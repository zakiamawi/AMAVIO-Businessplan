const fs = require("node:fs");
const path = require("node:path");

const root = path.resolve(__dirname, "..");
const html = fs.readFileSync(path.join(root, "index.html"), "utf8");
const css = fs.readFileSync(path.join(root, "assets/release-q.css"), "utf8");
const client = fs.readFileSync(path.join(root, "assets/release-q.js"), "utf8");
const failures = [];

for (const token of ["#0b1d38", "#0f2444", "#b39743", '"Fraunces"', '"Geist"']) if (!css.includes(token)) failures.push(`Brandtoken fehlt: ${token}`);
if (!html.includes("assets/brand/amavio-favicon.svg")) failures.push("AMAVIO-Favicon fehlt.");
if (!client.includes('assets/brand/amavio-logo-light.svg') || !client.includes('assets/brand/amavio-logo-dark.svg')) failures.push("Rollengerechte AMAVIO-Wortmarken fehlen.");
if (!client.includes("Menschen ankommen lassen.")) failures.push("AMAVIO-Leitsatz fehlt.");
if (/gradient|glow|neon/i.test(css)) failures.push("Nicht freigegebener dekorativer KI-Look gefunden.");
if (!css.includes("--paper: #ffffff")) failures.push("Konzeptfarbe Weiß wurde verändert.");

if (failures.length) {
  console.error("Release Q Brandbook QA – FEHLER");
  failures.forEach((failure) => console.error(`- ${failure}`));
  process.exit(1);
}
console.log("Release Q Brandbook QA – OK (AMAVIO Wortmarken, Navy/Gold, lokale Schriften und zwei klar getrennte Produktoberflächen)");
