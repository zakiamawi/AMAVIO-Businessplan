const fs = require("node:fs");
const path = require("node:path");

const root = path.resolve(__dirname, "..");
const read = (file) => fs.readFileSync(path.join(root, file), "utf8");
const html = read("index.html");
const css = read("assets/core.css");
const client = read("assets/core.js");
const failures = [];

for (const token of ["--navy-950: #0b1d38", "--navy-900: #0f2444", "--gold: #b59a4d", '--serif: "Fraunces"', '--sans: "Geist"']) {
  if (!css.includes(token)) failures.push(`Brand-Token fehlt: ${token}`);
}
if (!html.includes("amavio-logo-light.svg") || !html.includes("assets/fonts/fonts.css")) failures.push("AMAVIO-Marke oder lokale Typografie fehlt.");
if (/linear-gradient|radial-gradient|conic-gradient/i.test(css)) failures.push("Dekorativer Verlauf widerspricht der ruhigen Arbeitsoberfläche.");
if (/#[a-f0-9]{3,8}[^\n]*(?:purple|violet)|#(?:7c3aed|8b5cf6|a855f7)/i.test(css)) failures.push("Unfreigegebene KI-/Violettästhetik gefunden.");
if (/font-size:\s*(?:6[0-9]|[7-9][0-9]|[1-9][0-9]{2})px/i.test(css)) failures.push("Überdimensionierte UI-Schrift gefunden.");
for (const label of ["Heute", "Fälle", "Entscheidungen", "Programme", "Aufgaben & Entscheidungen", "Ankunftsprogramme", "Gesamtsteuerung", "Personal & Onboarding", "Standort & Übergabe", "Budget & Freigaben"]) {
  if (!client.includes(label)) failures.push(`Verständliche Produktsprache fehlt: ${label}`);
}
if (/\bSponsor\b/.test(client.replaceAll('"sponsor"', ''))) failures.push("Der interne Rollenbegriff Sponsor ist sichtbar geblieben.");
if (!client.includes("Lokale Konzeptdemo") || !client.includes("Synthetische Daten · keine Außenwirkung")) failures.push("Konzeptdemo-Grenze ist nicht dauerhaft sichtbar.");

if (failures.length) {
  console.error("Release O Brandbook QA – FEHLER");
  failures.forEach((failure) => console.error(`- ${failure}`));
  process.exit(1);
}
console.log("Release O Brandbook QA – OK (AMAVIO Navy/Gold, lokale Typografie, ruhige Sprache, keine KI-Ästhetik)");
