const fs = require("fs");
const path = require("path");
const root = path.resolve(__dirname, "..");
const css = fs.readFileSync(path.join(root, "assets/release-k.css"), "utf8").toLowerCase();
const html = fs.readFileSync(path.join(root, "index.html"), "utf8");
const failures = [];
for (const [pattern, label] of [[/linear-gradient|radial-gradient|conic-gradient/i,"Verlauf"],[/box-shadow\s*:\s*(?!none)[^;]+/i,"Panel-Schatten"],[/#(?:0f766e|14b8a6|2dd4bf|5eead4|99f6e4|ccfbf1)\b|\bteal\b|\bmint\b/i,"Teal-/Mintfarbe"]]) if (pattern.test(css)) failures.push(label);
for (const value of ["var(--navy)","var(--gold)","var(--gold-soft)","var(--serif)","var(--sans)"]) if (!css.includes(value)) failures.push(`Brandtoken fehlt: ${value}`);
for (const value of ["Ankunftsprogramme steuern","Gemeinsamer Ablauf- und Lieferplan","Kritischen Pfad neu planen","Ergebnis und Zusammenarbeit","Synthetische Daten","keine Außenwirkung"]) if (!html.includes(value)) failures.push(`Pflichttext fehlt: ${value}`);
if (!/data-page-target="programs"/.test(html)) failures.push("Programmnavigation fehlt");
if (failures.length) { console.error("AMAVIO ACC Release K – Brandbook QA: FEHLER"); failures.forEach((item) => console.error(`- ${item}`)); process.exit(1); }
console.log("AMAVIO ACC Release K – Brandbook QA: OK (Navy/Gold, Geist/Fraunces, editoriale Arbeitsoberfläche, keine Verläufe/Schatten/Teal-Inszenierung)");
