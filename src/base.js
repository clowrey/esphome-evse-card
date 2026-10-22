import { LitElement, css } from "lit";

// Base for the card: entity prefix, state helpers, and re-rendering only when an entity the
// card shows has changed (hass changes many times a second across the whole house).
export class EvseBase extends LitElement {
  static properties = { hass: { attribute: false }, _config: { state: true } };

  setConfig(config) {
    this._config = { prefix: "evse_0", ...config };
  }

  get prefix() {
    return this._config.prefix;
  }

  // "power" -> "sensor.evse_0_power"; "number:current_setpoint" -> "number.evse_0_current_setpoint"
  eid(key) {
    if (key.includes(".")) return key;
    const [domain, name] = key.includes(":") ? key.split(":") : ["sensor", key];
    return `${domain}.${this.prefix}_${name}`;
  }

  stateObj(key) {
    return this.hass?.states[this.eid(key)];
  }

  has(key) {
    return !!this.stateObj(key);
  }

  // Numeric state, or undefined when missing/unavailable.
  num(key) {
    const v = parseFloat(this.stateObj(key)?.state);
    return Number.isFinite(v) ? v : undefined;
  }

  str(key) {
    const s = this.stateObj(key)?.state;
    return s === undefined || s === "unknown" || s === "unavailable" ? undefined : s;
  }

  unit(key) {
    return this.stateObj(key)?.attributes.unit_of_measurement ?? "";
  }

  // Numeric state converted to `unit` from whatever display unit the sensor has in HA.
  numIn(key, unit) {
    return toUnit(this.num(key), this.unit(key), unit);
  }

  // Entities this card renders; it only re-renders when one of them changes.
  watched() {
    return [];
  }

  shouldUpdate(changed) {
    if (changed.size !== 1 || !changed.has("hass")) return true;
    const old = changed.get("hass");
    if (!old) return true;
    return this.watched().some((key) => {
      const id = this.eid(key);
      return old.states[id] !== this.hass.states[id];
    });
  }

  moreInfo(key) {
    const entityId = this.eid(key);
    if (!this.hass?.states[entityId]) return;
    this.dispatchEvent(new CustomEvent("hass-more-info", { detail: { entityId }, bubbles: true, composed: true }));
  }

  getCardSize() {
    return 6;
  }
}

// Units Home Assistant lets a user switch a sensor to, as factors to the first unit of each family.
const UNIT_FAMILIES = [
  { V: 1, mV: 1e-3, kV: 1e3 },
  { A: 1, mA: 1e-3 },
  { W: 1, mW: 1e-3, kW: 1e3, MW: 1e6 },
  { Wh: 1, kWh: 1e3, MWh: 1e6 },
  { s: 1, ms: 1e-3, min: 60, h: 3600 },
];

export function toUnit(value, from, to) {
  if (value === undefined || !Number.isFinite(value)) return undefined;
  const f = (from ?? "").trim();
  if (f === "" || f === to) return value;
  const family = UNIT_FAMILIES.find((u) => f in u && to in u);
  return family ? (value * family[f]) / family[to] : undefined;
}

// Number formatting in the user's locale.
export function fmt(hass, value, digits = 1) {
  if (value === undefined || value === null || !Number.isFinite(value)) return "–";
  const locale = hass?.locale?.language ?? navigator.language;
  return value.toLocaleString(locale, { minimumFractionDigits: digits, maximumFractionDigits: digits });
}

// Kilowatts as "3.41 kW" or "850 W".
export function fmtKw(hass, kw) {
  if (kw === undefined) return ["–", "kW"];
  return Math.abs(kw) >= 1 ? [fmt(hass, kw, 2), "kW"] : [fmt(hass, kw * 1000, 0), "W"];
}

// "just now", "4 min ago", "2 h ago", "3 d ago"
export function fmtAgo(iso) {
  const t = Date.parse(iso);
  if (!Number.isFinite(t)) return "";
  const s = Math.max(0, (Date.now() - t) / 1000);
  if (s < 45) return "just now";
  if (s < 3600) return `${Math.round(s / 60)} min ago`;
  if (s < 86400) return `${Math.round(s / 3600)} h ago`;
  return `${Math.round(s / 86400)} d ago`;
}

// Shared look: theme tokens, small caps labels, big numbers.
export const baseStyles = css`
  :host {
    --ev-good: var(--success-color, #43a047);
    --ev-warn: var(--warning-color, #ffa600);
    --ev-bad: var(--error-color, #db4437);
    --ev-info: var(--info-color, #039be5);
    --ev-fast: #ffb74d;
    --ev-car: var(--energy-grid-consumption-color, #488fc2);
    --ev-charge: var(--energy-battery-in-color, #f06292);
    --ev-discharge: var(--energy-battery-out-color, #4db6ac);
    --ev-muted: var(--secondary-text-color);
    --ev-line: var(--divider-color, rgba(127, 127, 127, 0.25));
    --ev-track: rgba(127, 127, 127, 0.18);
    display: block;
  }
  ha-card {
    height: 100%;
    box-sizing: border-box;
    overflow: hidden;
  }
  .label {
    font-size: 11px;
    font-weight: 500;
    letter-spacing: 0.08em;
    text-transform: uppercase;
    color: var(--ev-muted);
  }
  .num {
    font-variant-numeric: tabular-nums;
  }
  .unit {
    font-size: 0.55em;
    color: var(--ev-muted);
    margin-left: 2px;
  }
  .dim {
    color: var(--ev-muted);
  }
  .clickable {
    cursor: pointer;
    border-radius: 8px;
  }
  .clickable:hover {
    background: rgba(127, 127, 127, 0.08);
  }
`;
