import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const packageRoot = path.resolve(root, "..");
const read = (file) => readFile(path.join(root, file), "utf8");
const ids = Array.from({ length: 20 }, (_, index) => `PO-CRM-${String(index + 1).padStart(3, "0")}`);

const [start, brief, activation, register, dependencies, protocol, crosswalk, sourceMatrix, statusContract, permissions, lifecycle, handoff, maturity] = await Promise.all([
  read("README_START_HERE.md"),
  read("CRM_PRODUCT_OWNER_DECISION_BRIEF_20261009.md"),
  read("CRM_PRODUCT_OWNER_DECISION_ACTIVATION_20261009.md"),
  read("CRM_PRODUCT_OWNER_DECISION_REGISTER_20261009.csv"),
  read("CRM_DECISION_DEPENDENCY_AND_GATE_MAP_20261009.md"),
  read("CRM_DECISION_PROTOCOL_DRAFT_20261009.md"),
  read("CRM_DECISION_CROSSWALK_20261009.csv"),
  readFile(path.join(packageRoot, "CRM_PRODUCT_OWNER_DECISIONS.md"), "utf8"),
  readFile(path.join(packageRoot, "CRM_STATUS_AND_TRANSITION_CONTRACT.md"), "utf8"),
  readFile(path.join(packageRoot, "CRM_PERMISSIONS_AND_VISIBILITY_DRAFT.md"), "utf8"),
  readFile(path.join(packageRoot, "CRM_DATA_LIFECYCLE_AND_PRIVACY_DRAFT.md"), "utf8"),
  readFile(path.join(packageRoot, "CRM_ACC_HANDOFF_CONTRACT_DRAFT.md"), "utf8"),
  readFile(path.join(packageRoot, "CRM_RELEASE_MATURITY_PLAN.md"), "utf8"),
]);

assert.match(start, /BÜNDEL A\+B FACHLICH BESCHLOSSEN.*BÜNDEL C GESPERRT BESTÄTIGT.*NICHT PRODUKTIV FREIGEGEBEN/s);
assert.match(brief, /BÜNDEL A\+B GEMÄSS EMPFEHLUNG BESCHLOSSEN.*BÜNDEL C VOLLSTÄNDIG GESPERRT.*NICHT PRODUKTIV FREIGEGEBEN/s);
assert.match(activation, /Ich beschließe Bündel A und Bündel B gemäß Empfehlung\. Bündel C bleibt vollständig gesperrt\./);
assert.match(protocol, /\[x\] Empfehlung vollständig annehmen/);
assert.equal((protocol.match(/\[x\] Empfehlung vollständig annehmen/g) || []).length, 2);
assert.match(protocol, /\[x\] Bestehende Sperren vollständig bestätigen/);
assert.match(protocol, /Zaki Amawi/);
assert.match(protocol, /09\.10\.2026/);
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
assert.equal(registerRows.filter((row) => row.includes('"decided_accepted"')).length, 12);
assert.equal(registerRows.filter((row) => row.includes('"gate_confirmed_closed"')).length, 8);
assert.equal(/"open_decision_ready"|"open_confirm_gate"/.test(register), false, "Register enthält noch einen alten offenen Status");
assert.match(sourceMatrix, /PO-CRM-008.*Sperre vollständig bestätigt/s);
assert.match(sourceMatrix, /PO-CRM-017.*Sperre vollständig bestätigt/s);
assert.match(statusContract, /Fachvertrag 1\.0/);
assert.match(permissions, /Fachvertrag 1\.0/);
assert.match(permissions, /technische Durchsetzung vollständig gesperrt/);
assert.match(lifecycle, /keine Rechts- oder Datenschutzfreigabe/);
assert.match(handoff, /ACC-Integration vollständig gesperrt/);
assert.match(maturity, /R4 bis R6 bleiben unverändert gesperrt/);
assert.equal(/https?:\/\//.test([start, brief, activation, register, dependencies, protocol, crosswalk].join("\n")), false, "Entscheidungspaket enthält unerwartete externe URL");

console.log("AMAVIO One CRM Product-Owner-Beschlussaktivierung: QA OK");
console.log("- 20/20 PO-IDs im Register und Crosswalk, jeweils genau einmal");
console.log("- 12 fachliche Entscheidungen als angenommen dokumentiert");
console.log("- 8 produktive Gates als vollständig geschlossen bestätigt");
console.log("- Fachvertrag, technische Umsetzung und produktive Freigabe bleiben getrennt");
console.log("- Rollen-, Privacy-, ACC- und Release-Grenzen konsistent");

function countExactCsvId(csv, id) {
  return csv.split("\n").filter((line) => line.startsWith(`"${id}"`)).length;
}
