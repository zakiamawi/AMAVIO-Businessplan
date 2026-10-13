import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const packageRoot = path.resolve(root, "..");
const read = (file) => readFile(path.join(root, file), "utf8");
const ids = Array.from({ length: 20 }, (_, index) => `PO-CRM-${String(index + 1).padStart(3, "0")}`);

const [start, brief, register, dependencies, protocol, crosswalk, sourceMatrix] = await Promise.all([
  read("README_START_HERE.md"),
  read("CRM_PRODUCT_OWNER_DECISION_BRIEF_20261009.md"),
  read("CRM_PRODUCT_OWNER_DECISION_REGISTER_20261009.csv"),
  read("CRM_DECISION_DEPENDENCY_AND_GATE_MAP_20261009.md"),
  read("CRM_DECISION_PROTOCOL_DRAFT_20261009.md"),
  read("CRM_DECISION_CROSSWALK_20261009.csv"),
  readFile(path.join(packageRoot, "CRM_PRODUCT_OWNER_DECISIONS.md"), "utf8"),
]);

assert.match(start, /ENTSCHEIDUNGSREIF.*NICHT FREIGEGEBEN/s);
assert.match(brief, /ENTSCHEIDUNGSREIF.*NICHT FREIGEGEBEN/s);
assert.match(protocol, /Leere oder nicht eindeutig markierte Felder bedeuten.*keine Entscheidung/i);
assert.match(dependencies, /Bündel A/);
assert.match(dependencies, /Bündel B/);
assert.match(dependencies, /Bündel C/);

for (const id of ids) {
  assert.equal(countExactCsvId(register, id), 1, `${id} fehlt oder ist im Register doppelt`);
  assert.equal(countExactCsvId(crosswalk, id), 1, `${id} fehlt oder ist im Crosswalk doppelt`);
  assert.equal((sourceMatrix.match(new RegExp(`\\| ${id.replaceAll("-", "\\-")} \\|`, "g")) || []).length, 1, `${id} fehlt oder ist in der Quellmatrix doppelt`);
}

const registerRows = register.trim().split("\n").slice(1);
assert.equal(registerRows.length, 20);
assert.equal(registerRows.filter((row) => row.includes('"open_decision_ready"')).length, 12);
assert.equal(registerRows.filter((row) => row.includes('"open_confirm_gate"')).length, 8);
assert.equal(/,"approved",|,"decided",/.test(register), false, "Register enthält eine nicht autorisierte Entscheidung");
assert.equal(/https?:\/\//.test([start, brief, register, dependencies, protocol, crosswalk].join("\n")), false, "Entscheidungspaket enthält unerwartete externe URL");

console.log("AMAVIO One CRM Product-Owner-Entscheidungspaket: QA OK");
console.log("- 20/20 PO-IDs im Register und Crosswalk, jeweils genau einmal");
console.log("- 12 fachliche Entscheidungen entscheidungsreif, 8 produktive Gates offen bestätigt");
console.log("- keine PO-ID als genehmigt oder entschieden markiert");
console.log("- Bündel-, Abhängigkeits- und Nichtfreigabegrenzen vorhanden");

function countExactCsvId(csv, id) {
  return csv.split("\n").filter((line) => line.startsWith(`"${id}"`)).length;
}
