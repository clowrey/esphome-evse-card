import * as esbuild from "esbuild";
import { readFileSync } from "node:fs";

const { version } = JSON.parse(readFileSync("package.json", "utf8"));

const options = {
  entryPoints: ["src/index.js"],
  outfile: "dist/esphome-evse-card.js",
  bundle: true,
  format: "esm",
  target: "es2021",
  minify: true,
  legalComments: "none",
  banner: { js: `/* ESPHome EVSE Card ${version} - https://github.com/clowrey/esphome-evse-card */` },
  define: { __VERSION__: JSON.stringify(version) },
};

if (process.argv.includes("--watch")) {
  const ctx = await esbuild.context(options);
  await ctx.watch();
  console.log("watching src/ ...");
} else {
  await esbuild.build(options);
  console.log(`built dist/esphome-evse-card.js (${version})`);
}
