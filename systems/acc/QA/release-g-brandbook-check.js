const fs = require('fs');
const path = require('path');

const root = path.resolve(__dirname, '..');
const css = fs.readFileSync(path.join(root, 'assets/release-g.css'), 'utf8').toLowerCase();
const html = fs.readFileSync(path.join(root, 'index.html'), 'utf8');
const failures = [];

const requireCss = (value, label = value) => {
  if (!css.includes(value.toLowerCase())) failures.push(`CSS-Pflichtwert fehlt: ${label}`);
};

[
  ['#081527', 'Stage Navy'],
  ['#0b1f3a', 'Brand Navy'],
  ['#f7f4ec', 'Cream'],
  ['#c6a35a', 'AMAVIO Gold'],
  ['#7d6130', 'Bronze'],
  ['#222222', 'Ink'],
  ['"geist"', 'Geist'],
  ['"fraunces"', 'Fraunces'],
  ['width: 180px', 'Logo-Breite 180 px'],
].forEach(([value, label]) => requireCss(value, label));

if (/linear-gradient|radial-gradient|conic-gradient/.test(css)) failures.push('Release G enthält einen nicht freigegebenen Verlauf.');
if (/box-shadow\s*:\s*(?!none)[^;]+/.test(css)) failures.push('Release G enthält einen nicht freigegebenen Panel-Schatten.');
if (/#(?:0f766e|14b8a6|2dd4bf|5eead4|99f6e4|ccfbf1)\b|\bteal\b|\bmint\b/.test(css)) failures.push('Release G enthält nicht freigegebene Teal-/Mint-Farbwerte.');

for (const match of css.matchAll(/border-radius\s*:\s*(\d+(?:\.\d+)?)px/g)) {
  if (Number(match[1]) > 8) failures.push(`Border-Radius über 8 px: ${match[0]}`);
}

const journey = [...html.matchAll(/data-ops-mode="([^"]+)"[^>]*>[\s\S]*?<b>([^<]+)<\/b>/g)]
  .map((match) => `${match[1]}:${match[2].trim()}`);
const expected = [
  'evidence:Lage',
  'responsibility:Verantwortung',
  'simulation:Auswirkung',
  'decision:Entscheidung',
  'products:Ergebnis',
];
if (journey.join('|') !== expected.join('|')) failures.push(`Fallreise nicht kanonisch: ${journey.join(' | ')}`);

const operations = html.match(/<section class="page operations-page[\s\S]*?<section class="page evaluation-page/)?.[0] || '';
if (/AMAVIO Intelligence|KI-Chat|Copilot/.test(operations)) failures.push('Sichtbares KI-Modul dominiert die operative Release-G-Fläche.');
if (!/keine Außenwirkung/i.test(operations) || !/(Synthetischer Fall|synthetische Daten)/i.test(operations)) failures.push('Synthetische No-Effect-Grenze fehlt in der Arbeitsfläche.');

if (failures.length) {
  console.error('AMAVIO ACC Release G – Brandbook QA: FEHLER');
  failures.forEach((failure) => console.error(`- ${failure}`));
  process.exit(1);
}

console.log('AMAVIO ACC Release G – Brandbook QA: OK (Stage Navy, Brand Navy, Cream, Gold, Bronze, Geist/Fraunces, 180-px-Logo, ruhige Geometrie und unsichtbar integrierte Fachlogik)');
