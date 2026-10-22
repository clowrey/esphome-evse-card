import "./evse-card.js";

window.customCards ??= [];
window.customCards.push({
  type: "esphome-evse-card",
  name: "ESPHome EVSE Card",
  description: "Power flow, charge controller, controls and 24 h history for the ESPHome EVSE.",
  preview: true,
  documentationURL: "https://github.com/clowrey/esphome-evse-card",
});

console.info(`%c ESPHOME-EVSE-CARD %c ${__VERSION__} `, "color: white; background: #ef6c00", "");
