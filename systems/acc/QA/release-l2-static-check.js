const fs = require("fs");
const path = require("path");
const vm = require("vm");

const root = path.resolve(__dirname, "..");
const read = (file) => fs.readFileSync(path.join(root, file), "utf8");
const html = read("index.html");
const css = read("assets/release-l2.css");
const js = read("assets/calm-capable-v2.js");
const runtime = read("assets/runtime-integrity.js");
const failures = [];

const requiredHtml = [
  'href="assets/release-l2.css?v=20261013"',
  'data-open-current-case',
  'data-l2-deep-route',
  'Überblick',
  'Fälle',
  'Entscheidungen',
  'data-program-nav-label>Programme',
  'Qualität',
  '<h1 id="operations-command-title">Fallarbeit</h1>',
  '<b>Lage</b>',
  '<b>Auswirkung</b>',
  '<b>Ergebnis</b>',
  '<summary>Prüfnachweis</summary>',
  '<details class="program-capacity l2-section"',
  '<details class="program-adjustment l2-section"',
];
for (const value of requiredHtml) if (!html.includes(value)) failures.push(`Pflichtbestandteil fehlt: ${value}`);

const requiredCss = [
  '--l2-canvas:1240px',
  '[data-l2-deep-route]{display:none!important}',
  'body[data-page="today"] .workbench{display:none}',
  '.operations-page .ops-runtime',
  'grid-template-columns:var(--l2-rail) minmax(0,1fr) var(--l2-context)',
  '.l2-proof>summary',
  '.program-workspace{grid-template-columns:200px minmax(0,1fr) 220px',
  '@media(max-width:860px)',
  '@media(max-width:620px)',
];
for (const value of requiredCss) if (!css.includes(value)) failures.push(`Layoutvertrag fehlt: ${value}`);

const requiredJs = [
  'operations: "cases"',
  'planning: "programs"',
  'evaluation: "learning-quality"',
  'button.hasAttribute("data-l2-deep-route")',
  'showPage("operations")',
];
for (const value of requiredJs) if (!js.includes(value)) failures.push(`Navigationsvertrag fehlt: ${value}`);

const adminPrimaryTargets = [...html.matchAll(/<button[^>]*data-page-target="([^"]+)"[^>]*>/g)]
  .filter((match) => !match[0].includes("data-l2-deep-route") && !match[0].includes("data-employer-only"))
  .map((match) => match[1]);
const expectedPrimaryTargets = ["today", "cases", "twin-decisions", "programs", "learning-quality"];
if (adminPrimaryTargets.join(",") !== expectedPrimaryTargets.join(",")) failures.push(`Primärnavigation: ${adminPrimaryTargets.join(",")}`);

if (html.includes('Ergebnis bleibt `sink_only`')) failures.push("Interner Sink-Begriff ist in der sichtbaren Ergebnisansicht verblieben.");
if (!/http:\/\/127\.0\.0\.1:421(?:3|4)\/\?page=cases/.test(runtime)) failures.push("Lokales Startziel für die aktuelle datierte Arbeitskopie fehlt.");

try { new vm.Script(js, { filename: "assets/calm-capable-v2.js" }); }
catch (error) { failures.push(`JavaScript-Syntaxfehler: ${error.message}`); }
try { new vm.Script(runtime, { filename: "assets/runtime-integrity.js" }); }
catch (error) { failures.push(`Runtime-Syntaxfehler: ${error.message}`); }

if (failures.length) {
  console.error("Release L.2 Operational Clarity – FEHLER");
  failures.forEach((failure) => console.error(`- ${failure}`));
  process.exit(1);
}

console.log("Release L.2 Operational Clarity – OK (fünf Primärziele, Task-Journey, zentriertes Raster, progressive Offenlegung, responsive Verträge und Syntax)");
