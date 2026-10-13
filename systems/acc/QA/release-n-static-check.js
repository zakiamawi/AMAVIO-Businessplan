const fs = require("fs");
const path = require("path");
const vm = require("vm");

const root = path.resolve(__dirname, "..");
const read = (file) => fs.readFileSync(path.join(root, file), "utf8");
const html = read("index.html");
const runtime = read("assets/runtime-integrity.js");
const client = read("assets/release-n.js");
const css = read("assets/release-n.css");
const roleContract = read("backend/role-contract.mjs");
const collaboration = read("backend/collaboration.mjs");
const server = read("backend/server.mjs");
const failures = [];

for (const value of [
  'href="assets/release-n.css?v=20261013"',
  "Aufgaben &amp; Entscheidungen",
  "Gesamtsteuerung",
  "Personal &amp; Onboarding",
  "Standort &amp; Übergabe",
  "Budget &amp; Freigaben",
  "data-employer-area-title",
  "data-employer-case-purpose",
  "program-employer-focus",
  "Gemeinsamer Ablauf- und Lieferplan",
]) if (!html.includes(value)) failures.push(`Release-N-Oberflächenvertrag fehlt: ${value}`);

for (const value of ["assets/release-n.js?v=20261013", "http://127.0.0.1:4214/?page=cases"]) {
  if (!runtime.includes(value)) failures.push(`Release-N-Laufzeitvertrag fehlt: ${value}`);
}

for (const value of ["Gesamtsteuerung", "Personal & Onboarding", "Standort & Übergabe", "Budget & Freigaben"]) {
  if (!client.includes(value)) failures.push(`Arbeitgeberbereich fehlt im Client: ${value}`);
}

if (/<option[^>]*>Sponsor<\/option>/i.test(html)) failures.push("Unverständliche sichtbare Option Sponsor ist noch vorhanden.");
if (/\bSponsor\b/.test(html.replace(/value="sponsor"/g, ""))) failures.push("Sponsor ist noch als sichtbare HTML-Sprache vorhanden.");
if (!roleContract.includes('label: "Arbeitgeber · Gesamtsteuerung"')) failures.push("Rollenvertrag verwendet noch keine verständliche Gesamtsteuerung.");
if (!collaboration.includes('employer_budget: "Arbeitgeber · Budget & Freigaben"')) failures.push("Collaboration-Vertrag verwendet noch keine verständlichen Arbeitgeberbereiche.");
if (!server.includes('release: "N"') || !server.includes("employerWorkspace: true")) failures.push("Release-N-Health-Vertrag fehlt.");
if (/linear-gradient|radial-gradient|conic-gradient/i.test(css)) failures.push("Release-N-Erweiterung enthält einen dekorativen Verlauf.");
if (/fetch\s*\(\s*["']https?:\/\//.test(client) || /WebSocket\s*\(/.test(client)) failures.push("Release-N-Client enthält einen externen Netzpfad.");

try { new vm.Script(client, { filename: "assets/release-n.js" }); }
catch (error) { failures.push(`assets/release-n.js: ${error.message}`); }
try { new vm.Script(runtime, { filename: "assets/runtime-integrity.js" }); }
catch (error) { failures.push(`assets/runtime-integrity.js: ${error.message}`); }

if (failures.length) {
  console.error("Release N Employer Workspace – FEHLER");
  failures.forEach((failure) => console.error(`- ${failure}`));
  process.exit(1);
}
console.log("Release N Employer Workspace – OK (verständliche Arbeitsbereiche, fachliche Tiefe, klare Arbeitgeberreise, Null-Außenwirkung)");
