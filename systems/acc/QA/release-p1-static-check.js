const fs = require("node:fs");
const path = require("node:path");
const vm = require("node:vm");
const { spawnSync } = require("node:child_process");

const root = path.resolve(__dirname, "..");
const read = (file) => fs.readFileSync(path.join(root, file), "utf8");
const html = read("index.html");
const client = read("assets/release-p1.js");
const css = read("assets/release-p1.css");
const server = read("backend/server.mjs");
const reliability = read("backend/arrival-reliability.mjs");
const failures = [];

const styles = [...html.matchAll(/<link[^>]+rel=["']stylesheet["'][^>]+href=["']([^"']+)/gi)].map((item) => item[1]);
const scripts = [...html.matchAll(/<script[^>]+src=["']([^"']+)/gi)].map((item) => item[1]);
if (styles.length !== 2 || !styles.some((item) => item.startsWith("assets/fonts/fonts.css")) || !styles.some((item) => item.startsWith("assets/release-p1.css"))) failures.push(`Aktive Stylesheets: ${styles.join(", ")}`);
if (scripts.length !== 1 || !scripts[0].startsWith("assets/release-p1.js")) failures.push(`Aktive Skripte: ${scripts.join(", ")}`);
if (/assets\/(?:core|release-[a-o]|runtime-integrity)\.(?:css|js)/i.test(html)) failures.push("Vorherige UI-Layer werden im aktiven HTML geladen.");

for (const value of ["Startfähigkeit", "Handlungsoptionen", "AMAVIO-Leistungsauftrag", "Operative Ausführung", "Auftrag übernehmen", "Ergebnis an Arbeitgeber übergeben", "Arbeitsprodukte", "Stabilisierung nach dem Start", "Synthetische Daten · keine Außenwirkung", "Gesamtsteuerung"]) {
  if (!client.includes(value)) failures.push(`Release-P.1-Oberflächenvertrag fehlt: ${value}`);
}
for (const value of ["housing-handover", "arrival-shift", "onboarding-mismatch", "arrival_intervention_orders", "arrival_intervention_steps", "serviceLevel", "acceptanceCriteria", "externalEffect: false", "automaticDecision: false"]) {
  if (!reliability.includes(value)) failures.push(`Arrival-Reliability-Vertrag fehlt: ${value}`);
}
for (const value of ['release: "P.1"', "arrivalReliability: true", "interventionSystem: true", "serviceDeliveryProof: true", "providerCalls: 0", "externalEffects: false", "4217"]) {
  if (!server.includes(value)) failures.push(`Laufzeitgrenze fehlt: ${value}`);
}
if (/fetch\s*\(\s*["']https?:\/\//.test(client) || /WebSocket\s*\(/.test(client)) failures.push("Client enthält einen externen Netzpfad.");
if (/(^|[>"'])\s*Sponsor\b/i.test(client)) failures.push("Unverständliche Arbeitgeberbezeichnung ist sichtbar hinterlegt.");
try { new vm.Script(client, { filename: "assets/release-p.js" }); } catch (error) { failures.push(`Client-Syntax: ${error.message}`); }
for (const file of ["backend/server.mjs", "backend/arrival-reliability.mjs"]) {
  const check = spawnSync(process.execPath, ["--check", path.join(root, file)], { encoding: "utf8" });
  if (check.status !== 0) failures.push(`${file}: ${check.stderr.trim()}`);
}
if (!css.includes("@media (max-width: 680px)") || !css.includes("@media (max-width: 390px)") || !css.includes("prefers-reduced-motion")) failures.push("Responsive- oder Reduced-Motion-Vertrag fehlt.");
if (css.includes("linear-gradient") || /box-shadow:\s*0 0 \d+px [^;]*(?:blue|purple|cyan)/i.test(css)) failures.push("Unzulässiger KI-Dashboard-Effekt gefunden.");

if (failures.length) {
  console.error("Release P Static QA – FEHLER");
  failures.forEach((failure) => console.error(`- ${failure}`));
  process.exit(1);
}
console.log("Release P.1 Static QA – OK (Leistungsauftrag, Rollenübergabe, Ausführung, Ergebnisübergabe, lokale Grenzen und Responsive-Vertrag)");
