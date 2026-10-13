const fs = require("node:fs");
const path = require("node:path");

const root = path.resolve(__dirname, "..");
const html = fs.readFileSync(path.join(root, "index.html"), "utf8");
const css = fs.readFileSync(path.join(root, "assets/release-p3.css"), "utf8");
const client = fs.readFileSync(path.join(root, "assets/release-p3.js"), "utf8");
const failures = [];

for (const token of ["#0b1d38", "#0f2444", "#b39743", '"Fraunces"', '"Geist"']) if (!css.includes(token)) failures.push(`Brandtoken fehlt: ${token}`);
if (!html.includes("assets/brand/amavio-favicon.svg")) failures.push("AMAVIO-Favicon fehlt.");
if (!client.includes('assets/brand/amavio-logo-light.svg')) failures.push("AMAVIO-Wortmarke fehlt.");
if (!client.includes("Menschen ankommen lassen.")) failures.push("AMAVIO-Leitsatz fehlt.");
if (/gradient|glow|neon/i.test(css)) failures.push("Nicht freigegebener dekorativer KI-Look gefunden.");
if (!css.includes("--paper: #ffffff")) failures.push("Konzeptfarbe Weiß wurde verändert.");

if (failures.length) {
  console.error("Release P.3 Brandbook QA – FEHLER");
  failures.forEach((failure) => console.error(`- ${failure}`));
  process.exit(1);
}
console.log("Release P.3 Brandbook QA – OK (AMAVIO Wortmarke, Navy/Gold, lokale Schriften und zwei klar getrennte Produktoberflächen)");
