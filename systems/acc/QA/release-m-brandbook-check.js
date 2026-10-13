const fs = require("fs");
const path = require("path");
const root = path.resolve(__dirname, "..");
const css = fs.readFileSync(path.join(root, "assets/release-m.css"), "utf8");
const html = fs.readFileSync(path.join(root, "index.html"), "utf8");
const failures = [];

if (/linear-gradient|radial-gradient|conic-gradient/i.test(css)) failures.push("Verlauf in Release-M-CSS");
if (/\bKI[- ]?(Modul|Cockpit|Assistent|Agent)|AI Command Center/i.test(html)) failures.push("sichtbare KI-Inszenierung statt operativer Sprache");
for (const text of ["Operativer Ausführungsweg", "Vom Auftrag bis zur Entscheidung", "Menschliche Entscheidung", "Operatives Ergebnis", "Fallfolgen"]) if (!html.includes(text) && !fs.readFileSync(path.join(root, "assets/release-m.js"), "utf8").includes(text)) failures.push(`fachliche Leitbezeichnung fehlt: ${text}`);
for (const selector of [".execution-workdesk", ".execution-order", ".execution-employer-task", ".execution-gate", ".execution-outcome"]) if (!css.includes(selector)) failures.push(`ruhiger Komponentenvertrag fehlt: ${selector}`);

if (failures.length) {
  console.error("AMAVIO ACC Release M – Brandbook QA: FEHLER");
  failures.forEach((failure) => console.error(`- ${failure}`));
  process.exit(1);
}
console.log("AMAVIO ACC Release M – Brandbook QA: OK (L.2-System bewahrt, ruhige Fachsprache, keine sichtbare KI-Inszenierung, keine Verläufe)");
