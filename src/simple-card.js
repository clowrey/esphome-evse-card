import { html, svg, css, nothing } from "lit";
import { EvseBase, baseStyles, fmt } from "./base.js";

// custom:esphome-evse-simple-card
//   prefix: evse_0            start of the EVSE's entity ids
//   title:                    optional title line above the status
//   show_status: true         the firmware's status line ("Fast Charging 18A", "Normal - No vehicle")
//   show_buttons: true        Stop / Normal / Fast
//   power_max_kw: 11          outer ring full scale
//   battery_max_kw: 10        inner ring half scale (centre-zero)
//
// The glanceable card: status, the three mode buttons, and the horseshoe gauge (charger power
// on the outer ring, house-battery power on the inner centre-zero ring, today's energy inside).

const MODES = [
  { key: "stop", mode: 0, label: "Stop", icon: "mdi:power", color: "#FF5252" },
  { key: "normal", mode: 2, label: "Normal", icon: "mdi:lightning-bolt", color: "#42D66A" },
  { key: "fast", mode: 3, label: "Fast", icon: "mdi:flash", color: "#FFB74D" },
];

// Outer ring colour: the highest stop at or below the value (HA "colorstop" style).
const POWER_STOPS = [
  [0, "#2E7D32"],
  [3.6, "#F9A825"],
  [7.2, "#EF6C00"],
  [11, "#C62828"],
];

const CX = 100;
const CY = 100;
const R_OUTER = 86;
const R_INNER = 67;
const START_DEG = 135; // bottom-left; the horseshoe sweeps 270° clockwise to 45° (bottom-right)
const SWEEP_DEG = 270;

function pt(r, deg) {
  const a = (deg * Math.PI) / 180;
  return [CX + r * Math.cos(a), CY + r * Math.sin(a)];
}

// Arc from angle a to angle b (degrees, SVG clockwise), radius r.
function arc(r, a, b) {
  const clockwise = b >= a;
  const span = Math.abs(b - a);
  if (span < 0.01) return "";
  const [x0, y0] = pt(r, a);
  const [x1, y1] = pt(r, b);
  return `M${x0.toFixed(2)} ${y0.toFixed(2)} A${r} ${r} 0 ${span > 180 ? 1 : 0} ${clockwise ? 1 : 0} ${x1.toFixed(2)} ${y1.toFixed(2)}`;
}

class EsphomeEvseSimpleCard extends EvseBase {
  static getStubConfig(hass) {
    const id = Object.keys(hass?.states ?? {}).find((e) => /^sensor\.(\w+)_cp_output_pwm_duty_cycle$/.test(e));
    return { prefix: id ? id.match(/^sensor\.(\w+)_cp_output_pwm_duty_cycle$/)[1] : "evse_0" };
  }

  setConfig(config) {
    super.setConfig({ show_status: true, show_buttons: true, power_max_kw: 11, battery_max_kw: 10, ...config });
  }

  watched() {
    return [
      "power", "daily_energy", "daily_cost", "daily_percent", "state_text_sensor_output", "ha_battery_power",
      "ha_battery_power_filtered", "number:charger_mode",
    ];
  }

  _press(key) {
    this.hass.callService("button", "press", { entity_id: this.eid(`button:${key}`) });
  }

  render() {
    if (!this.hass || !this._config) return nothing;
    if (!this.has("power") && !this.has("number:charger_mode")) {
      return html`<ha-card><div class="wrap dim">No EVSE entities found for prefix <b>${this.prefix}</b>.</div></ha-card>`;
    }
    const mode = Math.round(this.num("number:charger_mode") ?? -1);
    const status = this.str("state_text_sensor_output");
    return html`
      <ha-card>
        <div class="wrap">
          ${this._config.title ? html`<div class="title">${this._config.title}</div>` : ""}
          ${this._config.show_status && status
            ? html`<div class="status clickable" @click=${() => this.moreInfo("state_text_sensor_output")}>${status}</div>`
            : ""}
          ${this._config.show_buttons
            ? html`<div class="modes">
                ${MODES.map(
                  (m) => html`<button class=${mode === m.mode ? "active" : ""} style="--c:${m.color}" @click=${() => this._press(m.key)} title=${m.label}>
                    <ha-icon icon=${m.icon}></ha-icon><span>${m.label}</span>
                  </button>`
                )}
              </div>`
            : ""}
          ${this._gauge()}
        </div>
      </ha-card>
    `;
  }

  _gauge() {
    const power = Math.max(0, this.numIn("power", "kW") ?? 0);
    const hasPower = this.has("power");
    const batt = this.numIn("ha_battery_power", "kW") ?? this.numIn("ha_battery_power_filtered", "kW");
    const kwh = this.numIn("daily_energy", "kWh");
    const cost = this.num("daily_cost");
    const pct = this.num("daily_percent");
    const costUnit = (this.unit("daily_cost") || "USD").replace("USD", "$");
    const pMax = this._config.power_max_kw;
    const bMax = this._config.battery_max_kw;

    const outerEnd = START_DEG + SWEEP_DEG * Math.min(1, power / pMax);
    const outerColor = POWER_STOPS.reduce((c, [v, col]) => (power >= v ? col : c), POWER_STOPS[0][1]);
    const battFrac = batt === undefined ? 0 : Math.max(-1, Math.min(1, batt / bMax));
    const innerEnd = 270 + (SWEEP_DEG / 2) * battFrac; // from the top: right = charging, left = discharging
    const innerColor = (batt ?? 0) > 0 ? "#31FF00" : "#FF1E1E";

    return html`
      <div class="gauge">
        <svg viewBox="0 0 200 200" role="img" aria-label="Charger power ${fmt(this.hass, power, 2)} kW">
          ${svg`
            <path class="track" d=${arc(R_OUTER, START_DEG, START_DEG + SWEEP_DEG)} stroke-width="13"></path>
            <path class="track inner" d=${arc(R_INNER, START_DEG, START_DEG + SWEEP_DEG)} stroke-width="8"></path>
            ${power > 0.005 ? svg`<path class="value" d=${arc(R_OUTER, START_DEG, outerEnd)} stroke=${outerColor} stroke-width="13"></path>` : ""}
            ${Math.abs(battFrac) > 0.002 ? svg`<path class="value" d=${arc(R_INNER, 270, innerEnd)} stroke=${innerColor} stroke-width="8"></path>` : ""}
            <line x1="100" y1="27" x2="100" y2="39" class="zero"></line>
          `}
        </svg>
        <div class="inside">
          <div class="net clickable" @click=${() => this.moreInfo("ha_battery_power")}>
            <div class="label">Net</div>
            <div class="net-val num">${batt === undefined ? "–" : fmt(this.hass, batt, 2)} <span class="small">kW</span></div>
          </div>
          <div class="power clickable" @click=${() => this.moreInfo("power")}>
            <span class="num">${hasPower ? fmt(this.hass, power, 2) : "–"}</span><span class="pu">kW</span>
          </div>
          <div class="today clickable" @click=${() => this.moreInfo("daily_energy")}>
            <div class="label">Added today</div>
            <div class="row num"><span>${fmt(this.hass, kwh, 2)}</span><span class="u">kWh</span></div>
            ${cost !== undefined ? html`<div class="row num"><span>${fmt(this.hass, cost, 2)}</span><span class="u">${costUnit}</span></div>` : ""}
            ${pct !== undefined ? html`<div class="row num"><span>${fmt(this.hass, pct, 1)}</span><span class="u">%</span></div>` : ""}
          </div>
        </div>
      </div>
    `;
  }

  getCardSize() {
    return 5;
  }

  static styles = [
    baseStyles,
    css`
      .wrap {
        padding: 14px 16px 16px;
        container-type: inline-size;
      }
      .title {
        font-size: 16px;
        font-weight: 500;
        text-align: center;
        margin-bottom: 6px;
      }
      .status {
        text-align: center;
        font-size: clamp(0.95rem, 4cqw, 1.3rem);
        font-weight: 700;
        line-height: 1.2;
        padding: 10px 8px;
        margin: 0 -4px 10px;
        overflow-wrap: anywhere;
      }
      .modes {
        display: grid;
        grid-template-columns: repeat(3, 1fr);
        gap: 8px;
        margin-bottom: 8px;
      }
      button {
        font: inherit;
        color: var(--primary-text-color);
        border: 0;
        cursor: pointer;
        border-radius: 12px;
        background: rgb(45, 45, 45);
        display: flex;
        flex-direction: column;
        align-items: center;
        gap: 4px;
        padding: 12px 0 10px;
        font-size: 13px;
        transition: background 0.2s ease;
      }
      button ha-icon {
        --mdc-icon-size: 28px;
        color: #cfcfcf;
      }
      button:hover {
        background: rgb(62, 62, 62);
      }
      button.active {
        background: var(--c);
        color: #111;
      }
      button.active ha-icon {
        color: #111;
      }
      .gauge {
        position: relative;
        width: min(100%, 330px);
        margin: 0 auto;
        aspect-ratio: 1;
        container-type: inline-size;
      }
      .gauge svg {
        position: absolute;
        inset: 0;
        width: 100%;
        height: 100%;
      }
      .track {
        fill: none;
        stroke: var(--ev-track);
        stroke-linecap: butt;
      }
      .track.inner {
        stroke: rgba(127, 127, 127, 0.1);
      }
      .value {
        fill: none;
        stroke-linecap: butt;
        transition: d 0.6s ease;
      }
      .zero {
        stroke: var(--ev-muted);
        stroke-width: 1.5;
        opacity: 0.6;
      }
      .inside {
        position: absolute;
        inset: 0;
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        gap: 1.5cqw;
        text-align: center;
        /* inside the inner ring (radius 67/100): start below its top edge, run into the open bottom */
        padding: 23% 20% 5%;
        box-sizing: border-box;
      }
      .inside .clickable {
        padding: 1cqw 3cqw;
      }
      .inside .label {
        font-size: 4cqw;
        letter-spacing: 0.1em;
      }
      .net-val {
        font-size: 6.5cqw;
        color: var(--primary-text-color);
      }
      .net-val .small {
        font-size: 0.6em;
        color: var(--ev-muted);
      }
      .power {
        display: flex;
        align-items: baseline;
        gap: 2cqw;
        font-size: 18cqw;
        font-weight: 500;
        line-height: 1;
        letter-spacing: -0.02em;
      }
      .power .pu {
        font-size: 0.35em;
        color: var(--ev-muted);
      }
      .today .row {
        display: grid;
        grid-template-columns: 1fr 1fr;
        gap: 2cqw;
        font-size: 6.5cqw;
        line-height: 1.3;
      }
      .today .row span:first-child {
        text-align: right;
      }
      .today .row .u {
        text-align: left;
        color: var(--ev-muted);
      }
    `,
  ];
}

if (!customElements.get("esphome-evse-simple-card")) customElements.define("esphome-evse-simple-card", EsphomeEvseSimpleCard);
