const fs = require("fs");
const path = require("path");
const vm = require("vm");

const root = path.resolve(__dirname, "..");
const read = (file) => fs.readFileSync(path.join(root, file), "utf8");
const html = read("index.html");
const runtime = read("assets/runtime-integrity.js");
const client = read("assets/release-m.js");
const css = read("assets/release-m.css");
const backend = read("backend/execution-loop.mjs");
const server = read("backend/server.mjs");
const failures = [];

for (const value of [
  'href="assets/release-m.css?v=20261013"',
  "data-execution-operations",
  "data-execution-employer",
  "data-execution-decision",
  "data-execution-result",
  "data-execution-program-impact",
]) if (!html.includes(value)) failures.push(`Release-M-Oberflächenvertrag fehlt: ${value}`);

if (!runtime.includes("assets/release-m.js?v=20261013")) failures.push("Release-M-Fähigkeitsmodul fehlt in der Laufzeit.");
if (!/http:\/\/127\.0\.0\.1:421(?:3|4)\/\?page=cases/.test(runtime)) failures.push("Lokales Startziel der aktuellen Arbeitskopie fehlt.");

for (const value of [
  "/api/execution/v1/cases/",
  "/api/execution/v1/work-orders/",
  "/api/execution/v1/handoffs/",
  "/api/execution/v1/decision-packages/",
  "/api/execution/v1/programs/",
]) if (!client.includes(value)) failures.push(`Client-Route fehlt: ${value}`);

for (const value of [
  "CREATE TABLE IF NOT EXISTS execution_plans",
  "CREATE TABLE IF NOT EXISTS execution_work_orders",
  "CREATE TABLE IF NOT EXISTS execution_handoffs",
  "CREATE TABLE IF NOT EXISTS execution_decision_packages",
  "CREATE TABLE IF NOT EXISTS execution_program_impacts",
  "automaticDecision: false",
  "externalEffects: false",
  "providerCalls: 0",
]) if (!backend.includes(value)) failures.push(`Backend-Vertrag fehlt: ${value}`);

if (!/release: "(?:M|N)"/.test(server) || !server.includes("operationalExecutionLoop: true")) failures.push("Release-M-Fähigkeitsvertrag fehlt.");
if (!server.includes("installExecutionLoop(db)")) failures.push("Execution-Loop wird nicht installiert.");
if (/fetch\s*\(\s*["']https?:\/\//.test(client) || /WebSocket\s*\(/.test(client)) failures.push("Release-M-Client enthält einen externen Netzpfad.");
if (/linear-gradient|radial-gradient|conic-gradient/i.test(css)) failures.push("Release-M-Erweiterung enthält einen nicht freigegebenen Verlauf.");

for (const [source, filename] of [[client, "assets/release-m.js"], [runtime, "assets/runtime-integrity.js"]]) {
  try { new vm.Script(source, { filename }); }
  catch (error) { failures.push(`${filename}: ${error.message}`); }
}

if (failures.length) {
  console.error("Release M Operational Execution Loop – FEHLER");
  failures.forEach((failure) => console.error(`- ${failure}`));
  process.exit(1);
}
console.log("Release M Operational Execution Loop – OK (geschlossene Arbeitskette, Rollenübergabe, Human Gate, beratende Programmfolge, Null-Außenwirkung)");
