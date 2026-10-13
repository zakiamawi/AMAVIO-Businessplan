const fs = require("node:fs");
const path = require("node:path");
const vm = require("node:vm");
const { spawnSync } = require("node:child_process");

const root = path.resolve(__dirname, "..");
const read = (file) => fs.readFileSync(path.join(root, file), "utf8");
const html = read("index.html");
const client = read("assets/core.js");
const css = read("assets/core.css");
const server = read("backend/server.mjs");
const execution = read("backend/execution-loop.mjs");
const failures = [];

const styles = [...html.matchAll(/<link[^>]+rel=["']stylesheet["'][^>]+href=["']([^"']+)/gi)].map((item) => item[1]);
const scripts = [...html.matchAll(/<script[^>]+src=["']([^"']+)/gi)].map((item) => item[1]);
if (styles.length !== 2 || !styles.some((item) => item.startsWith("assets/fonts/fonts.css")) || !styles.some((item) => item.startsWith("assets/core.css"))) failures.push(`Aktive Stylesheets: ${styles.join(", ")}`);
if (scripts.length !== 1 || !scripts[0].startsWith("assets/core.js")) failures.push(`Aktive Skripte: ${scripts.join(", ")}`);
if (/assets\/release-[^"']+\.(?:css|js)|runtime-integrity\.js/i.test(html)) failures.push("Legacy-Layer wird im aktiven HTML geladen.");

for (const value of ["Golden Journey", "Widersprüchliche Evidenz", "Arbeitgeberantwort verspätet", "Ankunftsdatum geändert", "Lokalen Pilotstand zurücksetzen", "Aufgabenerfolg", "Evidenzvollständigkeit"]) {
  if (!client.includes(value)) failures.push(`Release-O-Vertrag fehlt: ${value}`);
}
for (const value of ['release: "O"', "consolidatedRuntime: true", "goldenJourney: true", "pilotMetrics: true", "providerCalls: 0", "externalEffects: false", "4215"]) {
  if (!server.includes(value) && !client.includes(value)) failures.push(`Laufzeitgrenze fehlt: ${value}`);
}
for (const value of ["pilot_metric_events", "/metrics/summary", "/demo-reset", "employer_contributions"]) {
  if (!execution.includes(value)) failures.push(`Execution-Loop-Funktion fehlt: ${value}`);
}
if (/fetch\s*\(\s*["']https?:\/\//.test(client) || /WebSocket\s*\(/.test(client)) failures.push("Client enthält einen externen Netzpfad.");
try { new vm.Script(client, { filename: "assets/core.js" }); } catch (error) { failures.push(`Client-Syntax: ${error.message}`); }
for (const file of ["backend/server.mjs", "backend/execution-loop.mjs", "backend/gate-01-5.mjs"]) {
  const check = spawnSync(process.execPath, ["--check", path.join(root, file)], { encoding: "utf8" });
  if (check.status !== 0) failures.push(`${file}: ${check.stderr.trim()}`);
}
if (!css.includes("@media (max-width: 820px)") || !css.includes("@media (max-width: 560px)") || !css.includes("prefers-reduced-motion")) failures.push("Responsive- oder Reduced-Motion-Vertrag fehlt.");

if (failures.length) {
  console.error("Release O Static QA – FEHLER");
  failures.forEach((failure) => console.error(`- ${failure}`));
  process.exit(1);
}
console.log("Release O Static QA – OK (ein aktiver UI-Kern, lokale Grenzen, Syntax und Responsive-Vertrag)");
