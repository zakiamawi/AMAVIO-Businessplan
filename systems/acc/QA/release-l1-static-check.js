const fs = require("fs");
const path = require("path");
const vm = require("vm");

const root = path.resolve(__dirname, "..");
const read = (file) => fs.readFileSync(path.join(root, file), "utf8");
const html = read("index.html");
const css = read("assets/release-l1.css");
const js = read("assets/calm-capable-v2.js");
const failures = [];

for (const value of [
  'class="page case-portfolio-page"',
  'data-case-total',
  'data-case-decisions',
  'data-case-due-today',
  'data-case-result-count',
  'data-case-preview-title',
  'data-case-preview-reason',
  'data-open-selected-case',
  'aria-live="polite"',
  'Fälle mit Klarheit steuern',
  'keine automatischen Entscheidungen',
]) if (!html.includes(value)) failures.push(`Pflichtbestandteil fehlt: ${value}`);

for (const value of [
  '.case-portfolio-hero',
  '.case-portfolio-summary',
  '.case-portfolio-workspace',
  '.case-portfolio-index',
  '.case-portfolio-detail',
  '.case-preview-facts',
  '@media(max-width:820px)',
  '@media(max-width:620px)',
]) if (!css.includes(value)) failures.push(`Layoutvertrag fehlt: ${value}`);

for (const value of [
  'function renderCasePreview()',
  'renderCaseTable(q("[data-case-search]").value)',
  'q("[data-open-selected-case]").addEventListener',
  'syncRoute("replace")',
]) if (!js.includes(value)) failures.push(`Interaktionsvertrag fehlt: ${value}`);

if (/case-table-head/.test(html.match(/<section class="page case-portfolio-page"[\s\S]*?<\/section>/)?.[0] || "")) failures.push("Alte Tabellenkopf-Struktur ist noch in der Fallübersicht aktiv.");
if (!/grid-template-columns:minmax\(260px,330px\) minmax\(520px,1fr\)/.test(css)) failures.push("Desktop-Master/Detail-Raster fehlt.");
if (!/\.case-portfolio-workspace\{[^}]*min-height:590px/.test(css)) failures.push("Ruhige Mindesthöhe der Arbeitsfläche fehlt.");
if (!/body\[data-page="cases"\] main\{max-width:1500px\}/.test(css)) failures.push("Breiter Web-Arbeitsraum für Fälle fehlt.");

try { new vm.Script(js, { filename: "assets/calm-capable-v2.js" }); }
catch (error) { failures.push(`JavaScript-Syntaxfehler: ${error.message}`); }

if (failures.length) {
  console.error("Release L.1 Web Fidelity – FEHLER");
  failures.forEach((failure) => console.error(`- ${failure}`));
  process.exit(1);
}

console.log("Release L.1 Web Fidelity – OK (Fallzentrale, Master/Detail, progressive Offenlegung, responsive Verträge, Interaktion und Syntax)");
