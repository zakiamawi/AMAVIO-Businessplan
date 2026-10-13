const fs = require("node:fs");
const path = require("node:path");
const vm = require("node:vm");
const { spawnSync } = require("node:child_process");

const root = path.resolve(__dirname, "..");
const read = (file) => fs.readFileSync(path.join(root, file), "utf8");
const html = read("index.html");
const client = read("assets/release-q.js");
const css = read("assets/release-q.css");
const server = read("backend/server.mjs");
const reliability = read("backend/arrival-reliability.mjs");
const failures = [];

const styles = [...html.matchAll(/<link[^>]+rel=["']stylesheet["'][^>]+href=["']([^"']+)/gi)].map((item) => item[1]);
const scripts = [...html.matchAll(/<script[^>]+src=["']([^"']+)/gi)].map((item) => item[1]);
if (styles.length !== 2 || !styles.some((item) => item.startsWith("assets/fonts/fonts.css")) || !styles.some((item) => item.startsWith("assets/release-q.css"))) failures.push(`Aktive Stylesheets: ${styles.join(", ")}`);
if (scripts.length !== 1 || !scripts[0].startsWith("assets/release-q.js")) failures.push(`Aktive Skripte: ${scripts.join(", ")}`);
if (/assets\/(?:core|release-[a-p]|runtime-integrity)\.(?:css|js)/i.test(html)) failures.push("Vorherige UI-Layer werden im aktiven HTML geladen.");

for (const value of ["Startübersicht", "Entscheidungsposteingang", "Aufträge an AMAVIO", "Ergebnisse von AMAVIO", "Arbeitsvorrat", "Aktive Aufträge", "Übergabebereit", "Leistungsnachweise", "Arbeitgeberportal", "Zu AMAVIO Operations", "operationsQueueWorkspace", "operationsActiveOrders", "operationsHandoverReady", "operationsEvidenceCenter", "employerGovernanceDashboard", "employerHrDashboard", "employerLocationDashboard", "employerBudgetDashboard", "overview", "tasks", "evidence", "communication", "history", "Auftrag übernehmen", "Nachweis sichern", "Ergebnis an Arbeitgeber übergeben", "Synthetische Daten · keine Außenwirkung", "Gesamtsteuerung"]) {
  if (!client.includes(value)) failures.push(`Release-Q-Oberflächenvertrag fehlt: ${value}`);
}
const sharedOperationsRenderer = /function render(?:Readiness|Decisions|Products)\(\)[\s\S]{0,240}operationsQueue\(\)[\s\S]{0,80}operationsWorkbench\(\)/g;
if ((client.match(sharedOperationsRenderer) || []).length > 1) failures.push("Mehrere Operations-Hauptbereiche verwenden weiterhin denselben Queue-/Workbench-Renderer.");
for (const value of ["housing-handover", "arrival-shift", "onboarding-mismatch", "arrival_intervention_orders", "arrival_intervention_steps", "serviceLevel", "acceptanceCriteria", "externalEffect: false", "automaticDecision: false"]) {
  if (!reliability.includes(value)) failures.push(`Arrival-Reliability-Vertrag fehlt: ${value}`);
}
for (const value of ['release: "Q"', "arrivalReliability: true", "interventionSystem: true", "serviceDeliveryProof: true", "roleSeparation: true", "usableWorkProducts: true", "dualProductSurfaces: true", "trueWorkspaces: true", "functionalInformationArchitecture: true", "providerCalls: 0", "externalEffects: false", "4220"]) {
  if (!server.includes(value)) failures.push(`Laufzeitgrenze fehlt: ${value}`);
}
if (/fetch\s*\(\s*["']https?:\/\//.test(client) || /WebSocket\s*\(/.test(client)) failures.push("Client enthält einen externen Netzpfad.");
if (/(^|[>"'])\s*Sponsor\b/i.test(client)) failures.push("Unverständliche Arbeitgeberbezeichnung ist sichtbar hinterlegt.");
try { new vm.Script(client, { filename: "assets/release-q.js" }); } catch (error) { failures.push(`Client-Syntax: ${error.message}`); }
for (const file of ["backend/server.mjs", "backend/arrival-reliability.mjs"]) {
  const check = spawnSync(process.execPath, ["--check", path.join(root, file)], { encoding: "utf8" });
  if (check.status !== 0) failures.push(`${file}: ${check.stderr.trim()}`);
}
if (!css.includes("@media (max-width: 680px)") || !css.includes("@media (max-width: 390px)") || !css.includes("prefers-reduced-motion")) failures.push("Responsive- oder Reduced-Motion-Vertrag fehlt.");
if (css.includes("linear-gradient") || /box-shadow:\s*0 0 \d+px [^;]*(?:blue|purple|cyan)/i.test(css)) failures.push("Unzulässiger KI-Dashboard-Effekt gefunden.");

if (failures.length) {
  console.error("Release Q Static QA – FEHLER");
  failures.forEach((failure) => console.error(`- ${failure}`));
  process.exit(1);
}
console.log("Release Q Static QA – OK (vier eigenständige Operations-Bereiche, vier Arbeitgeberperspektiven, Auftragsakte und lokale Grenzen)");
