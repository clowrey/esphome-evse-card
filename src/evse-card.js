import { html, svg, css, nothing } from "lit";
import { EvseBase, baseStyles, fmt, fmtKw, fmtAgo } from "./base.js";
import { fetchDay } from "./history.js";

// custom:esphome-evse-card
//   prefix: evse_0            start of the EVSE's entity ids
//   title:                    card title (default: the device name)
//   soc_entities: []          house-battery SOC sensors to show (the lowest counts)
//   show_controls: true       Stop / Normal / Fast and the current -/+ buttons
//   show_chart: true          last 24 h of car and battery power
//
// One card for the whole charger: what the house battery, the EVSE and the car are doing, what
// the Normal/Fast controller is holding and how far off it is, the controls, and the last day.

const MODES = {
  0: { name: "Stopped", short: "Stop", color: "var(--ev-bad)", icon: "mdi:power" },
  1: { name: "Manual", short: "Manual", color: "var(--ev-info)", icon: "mdi:hand-back-right-outline" },
  2: { name: "Normal", short: "Normal", color: "var(--ev-good)", icon: "mdi:lightning-bolt" },
  3: { name: "Fast", short: "Fast", color: "var(--ev-fast)", icon: "mdi:flash" },
};

const CP = {
  Idle: { text: "No vehicle", icon: "mdi:power-plug-off-outline", color: "var(--ev-muted)" },
  "EV Connected": { text: "Vehicle connected", icon: "mdi:ev-plug-type1", color: "var(--ev-info)" },
  "EV Charging": { text: "Charging", icon: "mdi:ev-plug-type1", color: "var(--ev-good)" },
  "EV Vent": { text: "Vent required", icon: "mdi:alert-circle-outline", color: "var(--ev-bad)" },
  Error: { text: "Pilot error", icon: "mdi:alert-circle-outline", color: "var(--ev-bad)" },
};

const FLOOR_A = 6;
const IDLE_KW = 0.05;

class EsphomeEvseCard extends EvseBase {
  static properties = { ...EvseBase.properties, _day: { state: true }, _hover: { state: true }, _tick: { state: true } };

  static getStubConfig(hass) {
    const id = Object.keys(hass?.states ?? {}).find((e) => /^sensor\.(\w+)_cp_output_pwm_duty_cycle$/.test(e));
    return { prefix: id ? id.match(/^sensor\.(\w+)_cp_output_pwm_duty_cycle$/)[1] : "evse_0" };
  }

  setConfig(config) {
    super.setConfig({ show_controls: true, show_chart: true, soc_entities: [], ...config });
  }

  watched() {
    return [
      "power", "current_measured", "voltage", "daily_energy", "daily_cost", "daily_percent", "cp_state",
      "state_text_sensor_output", "event_flag", "battery_power_source", "ha_battery_power",
      "ha_battery_power_filtered", "active_target", "ha_inputs_debug", "temperature_pcb",
      "number:charger_mode", "number:current_setpoint", "number:max_current_limit", "number:normal_target",
      "number:fast_target", "number:charge_control_deadband", "number:car_battery_size", "select:charge_profile",
      "binary_sensor:ac_relay", ...(this._config?.soc_entities ?? []),
    ];
  }

  connectedCallback() {
    super.connectedCallback();
    this._timer = setInterval(() => {
      this._tick = Date.now(); // "x min ago" and the chart's "now" edge
      if (this._config?.show_chart) this._loadDay();
    }, 60 * 1000);
  }

  disconnectedCallback() {
    super.disconnectedCallback();
    clearInterval(this._timer);
  }

  updated(changed) {
    if (changed.has("hass") && !this._day && !this._loading && this.hass && this._config?.show_chart) this._loadDay();
  }

  async _loadDay() {
    if (!this.hass) return;
    this._loading = true;
    const ids = [this.eid("power"), this.eid("ha_battery_power_filtered")];
    const data = await fetchDay(this.hass, ids);
    this._day = { car: data[ids[0]], battery: data[ids[1]] };
    this._loading = false;
  }

  // ---- data ----

  _mode() {
    const m = this.num("number:charger_mode");
    return m === undefined ? undefined : Math.max(0, Math.min(3, Math.round(m)));
  }

  _cp() {
    const s = this.str("cp_state");
    return s ? (CP[s] ?? { text: s, icon: "mdi:help-circle-outline", color: "var(--ev-muted)" }) : undefined;
  }

  // House SOC: the lowest of the configured sensors.
  _soc() {
    const vals = (this._config.soc_entities ?? []).map((id) => parseFloat(this.hass.states[id]?.state)).filter(Number.isFinite);
    return vals.length ? Math.min(...vals) : undefined;
  }

  // The firmware's one-line debug dump holds a few numbers no sensor carries.
  _debug() {
    const s = this.str("ha_inputs_debug") ?? "";
    const pick = (re) => {
      const m = s.match(re);
      return m ? parseFloat(m[1]) : undefined;
    };
    return { cap: pick(/cap:(\d+)A/), limit: pick(/lim:(\d+)A/), settle: pick(/settle:(\d+)s/), interval: pick(/int:([\d.]+)s/), minSoc: pick(/min:(\d+)/) };
  }

  _target() {
    const mode = this._mode();
    const active = this.numIn("active_target", "kW");
    if (active !== undefined) return active;
    return mode === 3 ? this.numIn("number:fast_target", "kW") : this.numIn("number:normal_target", "kW");
  }

  // Hold band: the configured deadband or 1.5 A worth of power, whichever is wider (as the firmware does).
  _deadband() {
    const v = this.numIn("voltage", "V");
    const kwPerAmp = (v && v > 150 ? v : 230) / 1000;
    return Math.max(this.numIn("number:charge_control_deadband", "kW") ?? 0.25, 1.5 * kwPerAmp);
  }

  _deviceName() {
    const deviceId = this.hass.entities?.[this.eid("power")]?.device_id;
    const device = deviceId && this.hass.devices?.[deviceId];
    return device?.name_by_user || device?.name || this.prefix.replace(/_/g, "-").toUpperCase();
  }

  // ---- actions ----

  _press(key) {
    this.hass.callService("button", "press", { entity_id: this.eid(`button:${key}`) });
  }

  _stepSetpoint(delta) {
    const cur = this.num("number:current_setpoint") ?? FLOOR_A;
    const max = this.num("number:max_current_limit") ?? 40;
    const value = Math.max(FLOOR_A, Math.min(max, Math.round(cur) + delta));
    if (value === Math.round(cur)) return;
    this.hass.callService("number", "set_value", { entity_id: this.eid("number:current_setpoint"), value });
  }

  // ---- render ----

  render() {
    if (!this.hass || !this._config) return nothing;
    if (!this.has("cp_state") && !this.has("power")) {
      return html`<ha-card><div class="wrap missing">No EVSE entities found for prefix <b>${this.prefix}</b>.</div></ha-card>`;
    }
    const mode = this._mode();
    return html`
      <ha-card>
        ${this._banners(mode)}
        <div class="wrap">
          ${this._header(mode)} ${this._flow(mode)}
          ${mode === 2 || mode === 3 ? this._controller(mode) : this._manualLine(mode)}
          ${this._config.show_controls ? this._controls(mode) : ""}
          ${this._footer()}
          ${this._config.show_chart ? this._chart() : ""}
        </div>
      </ha-card>
    `;
  }

  // Paused / locked out / no battery data, from the firmware's status line and source.
  _banners(mode) {
    const status = this.str("state_text_sensor_output") ?? "";
    const source = this.str("battery_power_source") ?? "";
    const items = [];
    if (/LV lockout/i.test(status)) {
      items.push({ color: "var(--ev-bad)", icon: "mdi:battery-alert-variant-outline", text: status.replace(/^.*?-\s*/, "") || "Low-voltage lockout", key: "state_text_sensor_output" });
    } else if (/Paused/i.test(status)) {
      const reason = status.replace(/^.*?Paused\s*-?\s*/i, "");
      items.push({ color: "var(--ev-warn)", icon: "mdi:pause-circle-outline", text: `Paused${reason ? ": " + reason : ""}`, key: "state_text_sensor_output" });
    }
    if ((mode === 2 || mode === 3) && source.startsWith("none")) {
      items.push({ color: "var(--ev-warn)", icon: "mdi:database-off-outline", text: "No house-battery data: holding the current, never raising it", key: "battery_power_source" });
    }
    if (/Vent|error/i.test(status) && /Pilot error|Vent/i.test(status)) {
      items.push({ color: "var(--ev-bad)", icon: "mdi:alert-circle-outline", text: status.replace(/^.*?-\s*/, ""), key: "cp_state" });
    }
    return items.map(
      (b) => html`<div class="banner clickable" style="--c:${b.color}" @click=${() => this.moreInfo(b.key)}>
        <ha-icon icon=${b.icon}></ha-icon><div>${b.text}</div>
      </div>`
    );
  }

  _header(mode) {
    const m = mode === undefined ? undefined : MODES[mode];
    const cp = this._cp();
    const source = this.str("battery_power_source");
    const profile = this.str("select:charge_profile");
    return html`
      <div class="header">
        <div class="title">
          <ha-icon icon="mdi:ev-station"></ha-icon>
          <span>${this._config.title ?? this._deviceName()}</span>
        </div>
        <div class="chips">
          ${m
            ? html`<span class="chip" style="--c:${m.color}" @click=${() => this.moreInfo("number:charger_mode")}><i></i>${m.name}</span>`
            : ""}
          ${cp
            ? html`<span class="chip" style="--c:${cp.color}" @click=${() => this.moreInfo("cp_state")}><ha-icon icon=${cp.icon}></ha-icon>${cp.text}</span>`
            : ""}
          ${source && source !== "primary" && (mode === 2 || mode === 3)
            ? html`<span class="chip" style="--c:${source.startsWith("none") ? "var(--ev-bad)" : "var(--ev-warn)"}" @click=${() => this.moreInfo("battery_power_source")}
                ><ha-icon icon="mdi:source-branch"></ha-icon>${source.startsWith("fallback") ? "Fallback input" : "No battery input"}</span
              >`
            : ""}
          ${mode === 0 && profile
            ? html`<span class="chip" style="--c:var(--ev-muted)" @click=${() => this.moreInfo("select:charge_profile")}>Next: ${profile}</span>`
            : ""}
        </div>
      </div>
    `;
  }

  // Battery -> EVSE -> car. The EVSE -> car link animates while the car charges; the battery ->
  // EVSE link only while that charge is coming out of the battery (never towards the battery:
  // the EVSE can't feed it, and PV charging the battery is the battery node's own business).
  _flow(mode) {
    const batt = this.numIn("ha_battery_power", "kW") ?? this.numIn("ha_battery_power_filtered", "kW");
    const car = this.numIn("power", "kW");
    const amps = this.numIn("current_measured", "A");
    const volts = this.numIn("voltage", "V");
    const setpoint = this.num("number:current_setpoint");
    const cp = this._cp();
    const relay = this.str("binary_sensor:ac_relay");
    const soc = this._soc();
    const kwh = this.numIn("daily_energy", "kWh");
    const pct = this.num("daily_percent");
    const cost = this.num("daily_cost");
    const costUnit = (this.unit("daily_cost") || "USD").replace("USD", "$");
    const carKwh = this.num("number:car_battery_size");

    const battState = batt === undefined ? "unknown" : batt > IDLE_KW ? "charging" : batt < -IDLE_KW ? "discharging" : "idle";
    const battColor = { charging: "var(--ev-charge)", discharging: "var(--ev-discharge)" }[battState] ?? "var(--ev-muted)";
    const [bv, bu] = fmtKw(this.hass, batt === undefined ? undefined : Math.abs(batt));
    const [cv, cu] = fmtKw(this.hass, car);
    const charging = (car ?? 0) > IDLE_KW;
    const offered = mode !== 0 && cp && cp.text !== "No vehicle";

    return html`
      <div class="flow">
        <div class="node clickable" @click=${() => this.moreInfo("ha_battery_power")}>
          <div class="label">House battery</div>
          <ha-icon class="node-icon" style="color:${battColor}" icon=${battState === "charging" ? "mdi:battery-charging" : battState === "discharging" ? "mdi:battery-arrow-up-outline" : "mdi:battery-outline"}></ha-icon>
          <div class="big num" style="color:${battColor}">${bv}<span class="unit">${bu}</span></div>
          <div class="sub">${{ charging: "charging", discharging: "discharging", idle: "idle", unknown: "no data" }[battState]}${soc !== undefined ? html` · ${fmt(this.hass, soc, 0)} %` : ""}</div>
        </div>
        ${this._connector(battState === "discharging" ? "fwd" : battState === "charging" ? "back" : "", battColor, Math.abs(batt ?? 0))}
        <div class="node evse clickable" @click=${() => this.moreInfo("number:current_setpoint")}>
          <div class="label">EVSE</div>
          <ha-icon class="node-icon" style="color:${offered ? "var(--ev-car)" : "var(--ev-muted)"}" icon="mdi:ev-station"></ha-icon>
          <div class="big num">${setpoint === undefined ? "–" : fmt(this.hass, setpoint, 0)}<span class="unit">A</span></div>
          <div class="sub">
            ${offered ? "offered" : "idle"}${amps !== undefined ? html` · <span class="num">${fmt(this.hass, amps, amps < 10 ? 1 : 0)} A</span> drawn` : ""}
          </div>
          <div class="sub dim">
            ${volts !== undefined ? html`<span class="num">${fmt(this.hass, volts, 0)} V</span>` : ""}${relay ? html` · relay ${relay}` : ""}
          </div>
        </div>
        ${this._connector(charging ? "fwd" : "", "var(--ev-car)", car ?? 0)}
        <div class="node clickable" @click=${() => this.moreInfo("power")}>
          <div class="label">Car</div>
          <ha-icon class="node-icon" style="color:${charging ? "var(--ev-good)" : cp?.color ?? "var(--ev-muted)"}" icon=${charging ? "mdi:car-electric" : cp && cp.text !== "No vehicle" ? "mdi:car-electric-outline" : "mdi:car-off"}></ha-icon>
          <div class="big num" style=${charging ? "" : "color:var(--ev-muted)"}>${cv}<span class="unit">${cu}</span></div>
          <div class="sub">${cp?.text ?? "–"}</div>
          ${kwh !== undefined
            ? html`<div class="sub dim today" @click=${(e) => { e.stopPropagation(); this.moreInfo("daily_energy"); }}>
                <span class="num">${fmt(this.hass, kwh, 1)} kWh</span> today${pct !== undefined ? html` · <span class="num">${fmt(this.hass, pct, 0)} %</span>${carKwh ? html` of ${fmt(this.hass, carKwh, 0)} kWh` : ""}` : ""}${cost !== undefined ? html` · <span class="num">${costUnit}${fmt(this.hass, cost, 2)}</span>` : ""}
              </div>`
            : ""}
        </div>
      </div>
    `;
  }

  // Animated dashes; faster with more power, still when nothing flows.
  _connector(dir, color, kw) {
    const seconds = dir ? Math.max(0.6, Math.min(3, 3 - Math.min(kw, 8) * 0.3)) : 0;
    return html`
      <div class="link ${dir}" style="--c:${color};--t:${seconds}s">
        <svg viewBox="0 0 100 24" preserveAspectRatio="none" aria-hidden="true">
          ${svg`<line class="rail" x1="0" y1="12" x2="100" y2="12"></line>
          ${dir ? svg`<line class="dash" x1="0" y1="12" x2="100" y2="12"></line>` : ""}`}
        </svg>
        ${dir ? html`<ha-icon class="arrow" icon=${dir === "fwd" ? "mdi:chevron-right" : "mdi:chevron-left"}></ha-icon>` : ""}
      </div>
    `;
  }

  // What the controller is holding, and where the battery sits against the band.
  _controller(mode) {
    const target = this._target();
    const band = this._deadband();
    const filtered = this.numIn("ha_battery_power_filtered", "kW") ?? this.numIn("ha_battery_power", "kW");
    const setpoint = this.num("number:current_setpoint");
    const max = this.num("number:max_current_limit") ?? 40;
    const dbg = this._debug();
    const cap = dbg.cap !== undefined ? Math.min(dbg.cap, max) : max;
    const m = MODES[mode];
    if (target === undefined) return "";

    const scale = Math.max(5, Math.abs(target) + band + 1, Math.abs(filtered ?? 0) + 0.5);
    const pos = (kw) => 50 + (Math.max(-scale, Math.min(scale, kw)) / scale) * 50;
    const lo = pos(target - band);
    const hi = pos(target + band);
    const marker = filtered === undefined ? undefined : pos(filtered);
    const err = filtered === undefined ? undefined : filtered - target;
    const cp = this._cp();
    const noCar = !cp || cp.text === "No vehicle";
    const verdict =
      err === undefined
        ? ""
        : noCar
          ? "no vehicle to charge"
          : Math.abs(err) <= band
            ? "in the band"
            : err > 0
              ? `${fmt(this.hass, err - band, 2)} kW of room to raise the car`
              : `${fmt(this.hass, -err - band, 2)} kW over, lowering the car`;
    const spPos = (a) => ((Math.max(FLOOR_A, Math.min(40, a)) - FLOOR_A) / (40 - FLOOR_A)) * 100;

    return html`
      <div class="ctl">
        <div class="ctl-head">
          <span class="label">Controller</span>
          <span class="ctl-text" style="color:${m.color}">
            ${m.name} holds the battery at <b class="num">${fmt(this.hass, target, 1)} kW</b>
            <span class="dim">(${target < 0 ? "discharging" : "charging"} · band ±${fmt(this.hass, band, 2)} kW)</span>
          </span>
        </div>
        <div class="bar clickable" @click=${() => this.moreInfo("ha_battery_power_filtered")} title="Filtered house-battery power against the target band">
          <div class="zone" style="left:${Math.min(lo, hi)}%;width:${Math.abs(hi - lo)}%;--c:${m.color}"></div>
          <div class="zero"></div>
          <div class="tgt" style="left:${pos(target)}%"></div>
          ${marker !== undefined ? html`<div class="marker" style="left:${marker}%"></div>` : ""}
        </div>
        <div class="bar-text">
          <span class="dim num">−${fmt(this.hass, scale, 0)} kW</span>
          <span class="num mid">${filtered === undefined ? "no battery data" : html`<b>${fmt(this.hass, filtered, 2)} kW</b> · ${verdict}`}</span>
          <span class="dim num">+${fmt(this.hass, scale, 0)} kW</span>
        </div>
        <div class="bar amps clickable" @click=${() => this.moreInfo("number:current_setpoint")} title="Offered current between 6 A and the limit">
          <div class="zone" style="left:0;width:${spPos(cap)}%;--c:var(--ev-car)"></div>
          ${cap < max ? html`<div class="tgt cap" style="left:${spPos(cap)}%" title="SOC limit ${cap} A"></div>` : ""}
          <div class="tgt" style="left:${spPos(max)}%" title="Max Current Limit ${max} A"></div>
          ${setpoint !== undefined ? html`<div class="marker" style="left:${spPos(setpoint)}%"></div>` : ""}
        </div>
        <div class="bar-text">
          <span class="dim num">6 A</span>
          <span class="num mid"><b>${fmt(this.hass, setpoint, 0)} A</b> offered${cap < max ? html` · SOC cap <b>${cap} A</b>` : ""}${dbg.settle ? html` · <span class="dim">settle ${dbg.settle} s</span>` : ""}</span>
          <span class="dim num">${fmt(this.hass, max, 0)} A max</span>
        </div>
      </div>
    `;
  }

  _manualLine(mode) {
    const setpoint = this.num("number:current_setpoint");
    const max = this.num("number:max_current_limit") ?? 40;
    const status = this.str("state_text_sensor_output");
    return html`
      <div class="ctl">
        <div class="ctl-head">
          <span class="label">Controller</span>
          <span class="ctl-text dim">
            ${mode === 1
              ? html`Manual: the car is offered <b class="num">${fmt(this.hass, setpoint, 0)} A</b> (limit ${fmt(this.hass, max, 0)} A); the house battery is not watched.`
              : html`Stopped: the pilot is off. ${status && status !== "Stopped" ? status : ""}`}
          </span>
        </div>
      </div>
    `;
  }

  _controls(mode) {
    const setpoint = this.num("number:current_setpoint");
    const max = this.num("number:max_current_limit") ?? 40;
    const canAdjust = mode !== 0 && setpoint !== undefined;
    const btn = (key, m, active) => html`
      <button class="mode ${active ? "active" : ""}" style="--c:${m.color}" @click=${() => this._press(key)} title=${m.name}>
        <ha-icon icon=${m.icon}></ha-icon><span>${m.short}</span>
      </button>
    `;
    return html`
      <div class="controls">
        <div class="modes">${btn("stop", MODES[0], mode === 0)} ${btn("normal", MODES[2], mode === 2)} ${btn("fast", MODES[3], mode === 3)}</div>
        <div class="stepper ${canAdjust ? "" : "off"}">
          <button @click=${() => this._stepSetpoint(-1)} ?disabled=${!canAdjust || setpoint <= FLOOR_A} title="1 A less"><ha-icon icon="mdi:minus"></ha-icon></button>
          <span class="val num clickable" @click=${() => this.moreInfo("number:current_setpoint")}>${fmt(this.hass, setpoint, 0)}<span class="unit">A</span></span>
          <button @click=${() => this._stepSetpoint(1)} ?disabled=${!canAdjust || setpoint >= max} title="1 A more"><ha-icon icon="mdi:plus"></ha-icon></button>
          <span class="dim max clickable" @click=${() => this.moreInfo("number:max_current_limit")}>max ${fmt(this.hass, max, 0)} A</span>
        </div>
      </div>
    `;
  }

  _footer() {
    const ev = this.stateObj("event_flag");
    const temp = this.num("temperature_pcb");
    if (!ev && temp === undefined) return "";
    const text = ev && ev.state !== "unknown" && ev.state !== "unavailable" ? ev.state : undefined;
    return html`
      <div class="footer">
        ${text
          ? html`<span class="clickable" @click=${() => this.moreInfo("event_flag")}><ha-icon icon="mdi:flag-outline"></ha-icon>${text} <span class="dim">· ${fmtAgo(ev.last_changed)}</span></span>`
          : ""}
        ${temp !== undefined
          ? html`<span class="clickable right" @click=${() => this.moreInfo("temperature_pcb")}><ha-icon icon="mdi:thermometer"></ha-icon><span class="num">${fmt(this.hass, temp, 0)} ${this.unit("temperature_pcb")}</span></span>`
          : ""}
      </div>
    `;
  }

  // Car power as an area, house-battery power as a line, over the last 24 h.
  _chart() {
    const now = Date.now();
    const t0 = now - 24 * 3600e3;
    const car = [...(this._day?.car ?? [])];
    const batt = [...(this._day?.battery ?? [])];
    const liveCar = this.numIn("power", "kW");
    const liveBatt = this.numIn("ha_battery_power_filtered", "kW");
    if (liveCar !== undefined) car.push([now, liveCar]);
    if (liveBatt !== undefined) batt.push([now, liveBatt]);
    const W = 1000;
    const H = 100;
    const x = (t) => ((t - t0) / (now - t0)) * W;
    const maxAbs = Math.max(1, ...car.map(([, p]) => Math.abs(p)), ...batt.map(([, p]) => Math.abs(p)));
    const hasNeg = batt.some(([, p]) => p < -0.05);
    const zero = hasNeg ? H / 2 : H;
    const y = (p) => (hasNeg ? zero - (p / maxAbs) * (H / 2) : H - (p / maxAbs) * H);
    const area = car.length > 1 ? `M${x(car[0][0]).toFixed(1)},${zero} L${car.map(([t, p]) => `${x(t).toFixed(1)},${y(Math.max(0, p)).toFixed(1)}`).join(" L")} L${x(car[car.length - 1][0]).toFixed(1)},${zero}Z` : "";
    const line = batt.length > 1 ? "M" + batt.map(([t, p]) => `${x(t).toFixed(1)},${y(p).toFixed(1)}`).join(" L") : "";
    const ticks = [24, 18, 12, 6, 0].map((h) => now - h * 3600e3);
    const hover = this._hover;
    const pick = (series, t) => {
      let best;
      for (const p of series) if (!best || Math.abs(p[0] - t) < Math.abs(best[0] - t)) best = p;
      return best?.[1];
    };
    const time = (t) => new Date(t).toLocaleTimeString(this.hass.locale?.language, { hour: "2-digit", minute: "2-digit" });
    return html`
      <div class="chart">
        <div class="chart-head">
          <span class="label">Last 24 h</span>
          <span class="legend"><i style="background:var(--ev-car)"></i>Car</span>
          <span class="legend"><i style="background:var(--ev-discharge)"></i>House battery</span>
          <span class="dim num scale">±${fmt(this.hass, maxAbs, 1)} kW</span>
        </div>
        <div
          class="plot"
          @mousemove=${(ev) => {
            const r = ev.currentTarget.getBoundingClientRect();
            this._hover = Math.max(0, Math.min(1, (ev.clientX - r.left) / r.width));
          }}
          @mouseleave=${() => (this._hover = undefined)}
          @click=${() => this.moreInfo("power")}
        >
          <svg viewBox="0 0 ${W} ${H}" preserveAspectRatio="none">
            ${svg`
              <line x1="0" x2=${W} y1=${zero} y2=${zero} class="zero-line"></line>
              <path d=${area} fill="var(--ev-car)" fill-opacity="0.35"></path>
              <path d=${line} fill="none" stroke="var(--ev-discharge)" stroke-width="2" vector-effect="non-scaling-stroke"></path>
              ${hover !== undefined ? svg`<line x1=${hover * W} x2=${hover * W} y1="0" y2=${H} class="cursor"></line>` : ""}
            `}
          </svg>
          ${!this._day ? html`<div class="loading dim">Loading history…</div>` : ""}
          ${hover !== undefined
            ? (() => {
                const t = t0 + hover * (now - t0);
                return html`<div class="tip" style="left:${hover * 100}%;${hover > 0.6 ? "transform:translateX(-100%)" : ""}">
                  <div class="dim">${time(t)}</div>
                  <div class="num">Car ${fmt(this.hass, pick(car, t), 2)} kW</div>
                  <div class="num">Battery ${fmt(this.hass, pick(batt, t), 2)} kW</div>
                </div>`;
              })()
            : ""}
        </div>
        <div class="ticks">${ticks.map((t, i) => html`<span>${i === 4 ? "now" : time(t)}</span>`)}</div>
      </div>
    `;
  }

  getGridOptions() {
    return { columns: "full", rows: "auto" };
  }

  static styles = [
    baseStyles,
    css`
      .wrap {
        padding: 16px 20px 18px;
        container-type: inline-size;
      }
      .missing {
        color: var(--ev-muted);
      }
      .banner {
        display: flex;
        align-items: center;
        gap: 12px;
        padding: 10px 20px;
        border-radius: 0;
        background: color-mix(in srgb, var(--c) 18%, transparent);
        border-bottom: 1px solid color-mix(in srgb, var(--c) 45%, transparent);
        font-size: 14px;
      }
      .banner ha-icon {
        color: var(--c);
        flex: none;
      }
      .header {
        display: flex;
        flex-wrap: wrap;
        align-items: center;
        justify-content: space-between;
        gap: 8px 16px;
        margin-bottom: 14px;
      }
      .title {
        display: flex;
        align-items: center;
        gap: 8px;
        font-size: 18px;
        font-weight: 500;
      }
      .title ha-icon {
        --mdc-icon-size: 22px;
        color: var(--state-icon-color, var(--primary-color));
      }
      .chips {
        display: flex;
        flex-wrap: wrap;
        gap: 6px;
      }
      .chip {
        display: inline-flex;
        align-items: center;
        gap: 6px;
        padding: 4px 12px 4px 10px;
        border-radius: 16px;
        font-size: 13px;
        font-weight: 500;
        color: var(--c);
        background: color-mix(in srgb, var(--c) 14%, transparent);
        cursor: pointer;
        white-space: nowrap;
      }
      .chip i {
        width: 8px;
        height: 8px;
        border-radius: 50%;
        background: var(--c);
        box-shadow: 0 0 0 3px color-mix(in srgb, var(--c) 25%, transparent);
      }
      .chip ha-icon {
        --mdc-icon-size: 16px;
      }

      /* flow */
      .flow {
        display: grid;
        grid-template-columns: minmax(0, 1fr) minmax(28px, 0.45fr) minmax(0, 1fr) minmax(28px, 0.45fr) minmax(0, 1fr);
        align-items: center;
        gap: 4px;
        margin: 0 -6px;
      }
      .node {
        padding: 6px;
        text-align: center;
        min-width: 0;
      }
      .node-icon {
        --mdc-icon-size: 34px;
        display: block;
        margin: 4px auto 2px;
      }
      .big {
        font-size: 30px;
        font-weight: 400;
        line-height: 1.1;
        letter-spacing: -0.01em;
        font-variant-numeric: tabular-nums;
      }
      .sub {
        font-size: 12.5px;
        margin-top: 2px;
        color: var(--primary-text-color);
      }
      .sub.dim,
      .sub .dim {
        color: var(--ev-muted);
      }
      .today {
        border-radius: 6px;
        padding: 1px 4px;
        margin: 2px -4px 0;
      }
      .today:hover {
        background: rgba(127, 127, 127, 0.12);
      }
      .link {
        position: relative;
        height: 24px;
        align-self: center;
        margin-top: 6px;
      }
      .link svg {
        width: 100%;
        height: 100%;
        display: block;
        overflow: visible;
      }
      .link .rail {
        stroke: var(--ev-track);
        stroke-width: 6;
        vector-effect: non-scaling-stroke;
        stroke-linecap: round;
      }
      .link .dash {
        stroke: var(--c);
        stroke-width: 6;
        stroke-linecap: round;
        vector-effect: non-scaling-stroke;
        stroke-dasharray: 10 14;
        animation: flow var(--t) linear infinite;
      }
      .link.back .dash {
        animation-direction: reverse;
      }
      .link .arrow {
        position: absolute;
        top: 50%;
        transform: translateY(-50%);
        --mdc-icon-size: 18px;
        color: var(--c);
      }
      .link.fwd .arrow {
        right: -6px;
      }
      .link.back .arrow {
        left: -6px;
      }
      @keyframes flow {
        to {
          stroke-dashoffset: -24;
        }
      }
      @media (prefers-reduced-motion: reduce) {
        .link .dash {
          animation: none;
        }
      }
      /* Narrow column: the flow runs top to bottom, one row per node. */
      @container (max-width: 480px) {
        .wrap {
          padding: 14px 14px 16px;
        }
        .flow {
          grid-template-columns: 1fr;
          gap: 0;
          margin: 0 -4px;
        }
        .node {
          display: grid;
          grid-template-columns: 40px minmax(0, 1fr) auto;
          grid-template-rows: auto auto auto;
          column-gap: 10px;
          align-items: center;
          text-align: left;
          padding: 4px 6px;
        }
        .node .label {
          grid-column: 2;
          grid-row: 1;
        }
        .node .node-icon {
          grid-column: 1;
          grid-row: 1 / span 3;
          --mdc-icon-size: 30px;
          margin: 0;
        }
        .node .big {
          grid-column: 3;
          grid-row: 1 / span 2;
          font-size: 26px;
          text-align: right;
        }
        .node .sub {
          grid-column: 2;
          grid-row: 2;
          margin-top: 0;
        }
        .node .sub.dim {
          grid-column: 2 / span 2;
          grid-row: 3;
        }
        .link {
          width: 28px;
          height: 26px;
          margin: -2px 0 -2px 12px;
        }
        .link svg {
          transform: rotate(90deg);
        }
        .link .arrow {
          top: auto;
          left: 50%;
          right: auto;
          bottom: -9px;
          transform: translateX(-50%) rotate(90deg);
        }
        .link.back .arrow {
          bottom: auto;
          top: -9px;
          left: 50%;
        }
      }

      /* controller */
      .ctl {
        margin-top: 16px;
        padding-top: 12px;
        border-top: 1px solid var(--ev-line);
      }
      .ctl-head {
        display: flex;
        flex-wrap: wrap;
        align-items: baseline;
        gap: 4px 12px;
        margin-bottom: 8px;
      }
      .ctl-text {
        font-size: 14px;
      }
      .ctl-text b {
        font-weight: 500;
      }
      .bar {
        position: relative;
        height: 10px;
        border-radius: 5px;
        background: var(--ev-track);
        margin: 8px 0 0;
      }
      .bar.amps {
        margin-top: 12px;
      }
      .bar .zone {
        position: absolute;
        top: 0;
        bottom: 0;
        border-radius: 5px;
        background: color-mix(in srgb, var(--c) 40%, transparent);
      }
      .bar .zero {
        position: absolute;
        left: 50%;
        top: -3px;
        bottom: -3px;
        width: 2px;
        margin-left: -1px;
        background: var(--ev-muted);
        opacity: 0.5;
      }
      .bar .tgt {
        position: absolute;
        top: -4px;
        bottom: -4px;
        width: 2px;
        margin-left: -1px;
        background: var(--primary-text-color);
        opacity: 0.7;
      }
      .bar .tgt.cap {
        background: var(--ev-warn);
        opacity: 1;
      }
      .bar .marker {
        position: absolute;
        top: 50%;
        width: 16px;
        height: 16px;
        margin: -8px 0 0 -8px;
        border-radius: 50%;
        background: var(--primary-text-color);
        border: 3px solid var(--card-background-color, #fff);
        box-sizing: border-box;
        transition: left 0.6s ease;
      }
      .bar-text {
        display: flex;
        justify-content: space-between;
        gap: 12px;
        margin-top: 6px;
        font-size: 12px;
      }
      .bar-text b {
        font-weight: 500;
      }
      .bar-text .mid {
        text-align: center;
      }

      /* controls */
      .controls {
        display: flex;
        flex-wrap: wrap;
        align-items: center;
        justify-content: space-between;
        gap: 10px 16px;
        margin-top: 16px;
      }
      .modes {
        display: flex;
        gap: 8px;
      }
      button {
        font: inherit;
        color: inherit;
        border: 0;
        cursor: pointer;
        background: var(--ev-track);
        border-radius: 12px;
      }
      button:disabled {
        opacity: 0.4;
        cursor: default;
      }
      .mode {
        display: flex;
        flex-direction: column;
        align-items: center;
        gap: 2px;
        width: 72px;
        padding: 8px 0 6px;
        font-size: 12px;
        color: var(--ev-muted);
      }
      .mode ha-icon {
        --mdc-icon-size: 24px;
      }
      .mode:hover {
        background: rgba(127, 127, 127, 0.28);
      }
      .mode.active {
        color: var(--c);
        background: color-mix(in srgb, var(--c) 18%, transparent);
        box-shadow: inset 0 0 0 1px color-mix(in srgb, var(--c) 50%, transparent);
      }
      .stepper {
        display: flex;
        align-items: center;
        gap: 8px;
      }
      .stepper.off {
        opacity: 0.6;
      }
      .stepper button {
        width: 40px;
        height: 40px;
        border-radius: 50%;
        display: grid;
        place-items: center;
      }
      .stepper .val {
        min-width: 58px;
        text-align: center;
        font-size: 24px;
        padding: 2px 4px;
      }
      .stepper .max {
        font-size: 12px;
        padding: 2px 6px;
      }

      /* footer */
      .footer {
        display: flex;
        flex-wrap: wrap;
        justify-content: space-between;
        gap: 6px 14px;
        margin-top: 14px;
        padding-top: 10px;
        border-top: 1px solid var(--ev-line);
        font-size: 12.5px;
      }
      .footer span.clickable {
        display: inline-flex;
        align-items: center;
        gap: 6px;
        padding: 2px 6px;
        margin: 0 -6px;
      }
      .footer ha-icon {
        --mdc-icon-size: 16px;
        color: var(--ev-muted);
      }

      /* chart */
      .chart {
        margin-top: 14px;
      }
      .chart-head {
        display: flex;
        align-items: center;
        gap: 12px;
        margin-bottom: 6px;
      }
      .legend {
        display: inline-flex;
        align-items: center;
        gap: 5px;
        font-size: 12px;
        color: var(--ev-muted);
      }
      .legend i {
        width: 10px;
        height: 10px;
        border-radius: 2px;
      }
      .scale {
        margin-left: auto;
        font-size: 12px;
      }
      .plot {
        position: relative;
        cursor: crosshair;
        height: 110px;
        border-left: 1px solid var(--ev-line);
        border-bottom: 1px solid var(--ev-line);
      }
      .plot svg {
        position: absolute;
        inset: 0;
        width: 100%;
        height: 100%;
      }
      .zero-line {
        stroke: var(--ev-line);
        stroke-dasharray: 4 4;
        vector-effect: non-scaling-stroke;
      }
      .cursor {
        stroke: var(--primary-text-color);
        stroke-opacity: 0.5;
        vector-effect: non-scaling-stroke;
      }
      .loading {
        position: absolute;
        inset: 0;
        display: grid;
        place-items: center;
        font-size: 13px;
      }
      .tip {
        position: absolute;
        top: 4px;
        margin: 0 8px;
        padding: 6px 10px;
        border-radius: 8px;
        font-size: 12px;
        line-height: 1.5;
        white-space: nowrap;
        pointer-events: none;
        background: var(--card-background-color, #fff);
        border: 1px solid var(--ev-line);
        box-shadow: 0 2px 8px rgba(0, 0, 0, 0.2);
      }
      .ticks {
        display: flex;
        justify-content: space-between;
        margin-top: 4px;
        font-size: 11px;
        color: var(--ev-muted);
      }
    `,
  ];
}

if (!customElements.get("esphome-evse-card")) customElements.define("esphome-evse-card", EsphomeEvseCard);
