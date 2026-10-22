# ESPHome EVSE Card

One Home Assistant card for the [ESPHome EVSE](https://github.com/clowrey/esphome-evse): what the
house battery, the charger and the car are doing, what the Normal/Fast controller is holding and
how far off it is, the controls, and the last 24 hours.

```yaml
type: custom:esphome-evse-card
prefix: evse_0
```

![The card: house battery, EVSE and car in a row with the flow animated between them, the controller's target band with the battery marker, the offered current against its limits, Stop / Normal / Fast and the current stepper, the last event and a 24 h chart](https://raw.githubusercontent.com/clowrey/esphome-evse-card/main/docs/evse-card.png)

## What it shows

- **Header**: the charger's mode (Stopped / Manual / Normal / Fast), the vehicle state from the
  control pilot (No vehicle / Vehicle connected / Charging / Pilot error), and a chip when the
  controller is running on its fallback battery input or has none. A banner across the top when
  charging is paused (house SOC, waiting for PV surplus), locked out on low battery voltage, or
  running without battery data.
- **Flow**: house battery → EVSE → car. The battery node shows its signed power (green/pink while
  it charges, teal while it discharges) and the lowest house SOC; the EVSE node the current offered
  to the car, the current actually drawn, the line voltage and the relay; the car node its power,
  what the pilot says, and today's energy as kWh, percent of the car's battery and cost. The
  connectors animate in the direction power flows, faster with more power.
- **Controller** (Normal and Fast): "Normal holds the battery at −1.0 kW", a centre-zero bar of
  the filtered battery power with the target band drawn on it, and the plain-English verdict
  ("in the band", "0.7 kW of room to raise the car", "no vehicle to charge"); below it the offered
  current between 6 A and Max Current Limit, with the SOC cap when one is active and the
  controller's settle time. In Manual or Stopped a line says so instead.
- **Controls**: Stop / Normal / Fast (the firmware's buttons, so Normal and Fast change the
  profile exactly as the Home Assistant buttons do), and −/+ on the offered current (6 A to Max
  Current Limit). Hide them with `show_controls: false`.
- **Footer**: the last controller event with its age ("auto 18A -> 22A (-2.61 kW) · 4 min ago")
  and the PCB temperature.
- **Last 24 h**: car power as an area and house-battery power as a line from Home Assistant's
  5-minute statistics; hover for values, click for the full history. Hide with `show_chart: false`.

Everything is clickable through to the entity, the card follows the light and dark themes, and
it reflows: in a narrow column the flow runs top to bottom.

## Install

### With HACS

1. HACS → ⋮ → **Custom repositories** → add `https://github.com/clowrey/esphome-evse-card`, type
   **Dashboard**.
2. Search HACS for **ESPHome EVSE Card** and **Download** it. HACS adds the resource; reload the
   browser when it asks.

### Manually

Copy `dist/esphome-evse-card.js` to `/config/www/esphome-evse-card/` and add it under
**Settings → Dashboards → ⋮ → Resources** as `/local/esphome-evse-card/esphome-evse-card.js`,
type **JavaScript module**.

## Options

| Option | Default | |
| --- | --- | --- |
| `prefix` | `evse_0` | Start of the EVSE's entity ids (`sensor.evse_0_power`, `number.evse_0_current_setpoint`, …). The ESPHome device name with `-` as `_`. |
| `title` | the device name | Card title. |
| `soc_entities` | `[]` | House-battery state-of-charge sensors to show on the battery node; with several, the lowest is shown (the one the firmware stops charging on). |
| `show_controls` | `true` | Stop / Normal / Fast and the current stepper. |
| `show_chart` | `true` | The 24 h chart. |

```yaml
type: custom:esphome-evse-card
prefix: evse_0
soc_entities:
  - sensor.sunsynk_battery_soc
  - sensor.sunsynk_battery_2_soc
```

The card needs the entities the `refactor-charge-control` firmware (or later) publishes: `Battery
Power Source`, `HA Battery Power`, `Active Target`, `Charge Control Deadband` and `Event Flag`
alongside the usual power, current, voltage, daily energy, CP state and mode entities. It leaves
out anything the firmware doesn't have rather than showing "unknown". The chart needs the
`Power` and `HA Battery Power Filtered` sensors to have `state_class: measurement`, which the
firmware sets.

## Development

```
npm install
npm run build        # dist/esphome-evse-card.js
npm run watch
```

Lit for the element, esbuild for the bundle, no other dependencies. The card re-renders only when
one of the entities it shows changes. To release: bump `version` in `package.json`, `npm run build`,
commit `dist/`, tag `vX.Y.Z` and publish a GitHub release; HACS picks up releases.

## License

MIT.
