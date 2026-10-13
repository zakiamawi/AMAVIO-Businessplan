const fs = require("fs");
const path = require("path");

const root = path.resolve(__dirname, "..");
const css = fs.readFileSync(path.join(root, "assets/release-j5.css"), "utf8").toLowerCase();
const html = fs.readFileSync(path.join(root, "index.html"), "utf8");
const htmlLower = html.toLocaleLowerCase("de-DE");
const failures = [];

for (const [pattern, label] of [
  [/linear-gradient|radial-gradient|conic-gradient/i, "nicht freigegebener Verlauf"],
  [/box-shadow\s*:\s*(?!none)[^;]+/i, "nicht freigegebener Panel-Schatten"],
  [/#(?:0f766e|14b8a6|2dd4bf|5eead4|99f6e4|ccfbf1|0e8187|0d7880|0d858c|0d7e85|0d7178|0c7d84|096a70)\b|\bteal\b|\bmint\b/i, "nicht freigegebene Teal-/Mintfarbe"],
]) if (pattern.test(css)) failures.push(label);

for (const match of css.matchAll(/border-radius\s*:\s*(\d+(?:\.\d+)?)px/g)) {
  if (Number(match[1]) > 8) failures.push(`Radius über 8 px: ${match[0]}`);
}

for (const value of ["var(--navy)", "var(--gold)", "var(--gold-soft)", "var(--serif)", "var(--sans)"]) {
  if (!css.includes(value)) failures.push(`Brandtoken fehlt: ${value}`);
}

for (const value of ["Aufgaben &amp; Entscheidungen", "Operative Fallsteuerung", "Keine Außenwirkung", "ausschließlich synthetische Beiträge"]) {
  if (!htmlLower.includes(value.toLocaleLowerCase("de-DE"))) failures.push(`Pflichttext fehlt: ${value}`);
}

if (!/<button[^>]*data-page-target="operations"[^>]*data-admin-only/.test(html)) failures.push("Operations-Navigation ist nicht als interne Ansicht begrenzt");
if (!/data-page-target="collaboration" data-employer-only/.test(html)) failures.push("Arbeitgeber-Mitwirkung ist nicht rollenbezogen begrenzt");

if (failures.length) {
  console.error("AMAVIO ACC Release J.5 – Brandbook QA: FEHLER");
  failures.forEach((failure) => console.error(`- ${failure}`));
  process.exit(1);
}
console.log("AMAVIO ACC Release J.5 – Brandbook QA: OK (Navy, Gold, Gold Soft, Geist/Fraunces-Vererbung, ruhige Geometrie, keine Teal-/Mintpalette, keine Verläufe oder Panel-Schatten)");

