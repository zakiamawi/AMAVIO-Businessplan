import test from "node:test";
import assert from "node:assert/strict";
import { mkdtempSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { createApplication } from "../backend/server.mjs";

let sequence = 0;
const OPS = "demo-session-operations";
const SPONSOR = "demo-session-employer-sponsor";
const HR = "demo-session-employer-hr";
const BETA = "demo-session-beta";
function key(prefix = "program") { sequence += 1; return `${prefix}-${String(sequence).padStart(8, "0")}`; }
function headers(session = OPS, mutate = false) { return { "x-demo-session": session, ...(mutate ? { "content-type": "application/json", "idempotency-key": key() } : {}) }; }
async function start() { const directory = mkdtempSync(join(tmpdir(), "amavio-release-k-")); const app = createApplication({ databasePath: join(directory, "release-k.sqlite"), providerMode: "local" }); await new Promise((resolve) => app.server.listen(0, "127.0.0.1", resolve)); return { ...app, base: `http://127.0.0.1:${app.server.address().port}` }; }
async function close(app) { await new Promise((resolve) => app.server.close(resolve)); }
async function call(app, path, { session = OPS, method = "GET", body } = {}) { const response = await fetch(`${app.base}${path}`, { method, headers: headers(session, Boolean(body)), ...(body ? { body: JSON.stringify(body) } : {}) }); return { response, payload: await response.json().catch(() => ({})) }; }

test("Release K exposes a tenant-scoped program operating model and a minimized employer projection", async () => {
  const app = await start();
  try {
    const ops = await call(app, "/api/programs/v1/bootstrap");
    assert.equal(ops.response.status, 200); assert.equal(ops.payload.boundaries.providerCalls, 0); assert.equal(ops.payload.boundaries.externalEffects, false);
    assert.equal(ops.payload.programs.length, 3); assert.equal(ops.payload.selected.access.projection, "program_internal"); assert.ok(ops.payload.selected.adjustments);
    const employer = await call(app, "/api/programs/v1/bootstrap", { session: SPONSOR });
    assert.equal(employer.response.status, 200); assert.equal(employer.payload.selected.access.projection, "program_shared"); assert.equal(employer.payload.selected.access.internalPlanningHidden, true); assert.deepEqual(employer.payload.selected.adjustments, []);
    assert.ok(employer.payload.selected.decisions.every((item) => /Sponsor|Arbeitgeber/.test(item.deciderRole)));
  } finally { await close(app); }
});

test("Release K keeps employer decisions with the assigned human role and handles concurrency", async () => {
  const app = await start();
  try {
    const denied = await call(app, "/api/programs/v1/decisions/SYN-PROG-DEC-001/review", { session: HR, method: "POST", body: { version: 1, option: "Bestätigen", rationale: "Ausreichende synthetische Begründung für die Prüfung." } });
    assert.equal(denied.response.status, 403); assert.equal(denied.payload.code, "role_scope_denied");
    const accepted = await call(app, "/api/programs/v1/decisions/SYN-PROG-DEC-001/review", { session: SPONSOR, method: "POST", body: { version: 1, option: "Standortverteilung bestätigen", rationale: "Die synthetische Standort- und Kapazitätsgrundlage wurde geprüft." } });
    assert.equal(accepted.response.status, 200); assert.equal(accepted.payload.externalEffect, false); assert.equal(accepted.payload.decision.status, "reviewed");
    const conflict = await call(app, "/api/programs/v1/decisions/SYN-PROG-DEC-001/review", { session: SPONSOR, method: "POST", body: { version: 1, option: "Anders entscheiden", rationale: "Dieser veraltete Stand darf nicht erneut angenommen werden." } });
    assert.equal(conflict.response.status, 409); assert.equal(conflict.payload.code, "program_decision_conflict");
  } finally { await close(app); }
});

test("Release K turns a local simulation into a reviewable adjustment without applying it", async () => {
  const app = await start();
  try {
    const created = await call(app, "/api/programs/v1/programs/SYN-PROG-001/simulations", { method: "POST", body: { trigger: "Synthetische Einreise verschiebt sich.", shiftDays: 7 } });
    assert.equal(created.response.status, 201); assert.equal(created.payload.applied, false); assert.equal(created.payload.adjustment.status, "awaiting_human_review"); assert.ok(created.payload.adjustment.affected.length >= 3);
    const reviewed = await call(app, `/api/programs/v1/adjustments/${created.payload.adjustment.id}/review`, { method: "POST", body: { version: created.payload.adjustment.version, note: "Auswirkungen und Unsicherheiten fachlich geprüft; keine automatische Anwendung." } });
    assert.equal(reviewed.response.status, 200); assert.equal(reviewed.payload.applied, false); assert.equal(reviewed.payload.adjustment.status, "advisory_approved");
    const employerDenied = await call(app, "/api/programs/v1/programs/SYN-PROG-001/simulations", { session: SPONSOR, method: "POST", body: { shiftDays: 3 } });
    assert.equal(employerDenied.response.status, 403);
  } finally { await close(app); }
});

test("Release K accepts employer outcomes while internal work products remain Operations-only", async () => {
  const app = await start();
  try {
    const outcome = await call(app, "/api/programs/v1/programs/SYN-PROG-001/outcomes", { session: HR, method: "POST", body: { rating: "teilweise_stabil", strengths: "Gemeinsame Zuständigkeiten sind verständlich.", challenges: "Standortbestätigungen stehen im Test noch aus.", currentNeed: "Eine bestätigte Übergabe für den synthetischen Arbeitsstart." } });
    assert.equal(outcome.response.status, 201); assert.equal(outcome.payload.externalEffect, false);
    const employerProduct = await call(app, "/api/programs/v1/programs/SYN-PROG-001/work-products", { session: HR, method: "POST", body: { type: "weekly_arrival_status" } });
    assert.equal(employerProduct.response.status, 403);
    const product = await call(app, "/api/programs/v1/programs/SYN-PROG-001/work-products", { method: "POST", body: { type: "weekly_arrival_status" } });
    assert.equal(product.response.status, 201); assert.equal(product.payload.workProduct.status, "draft"); assert.equal(product.payload.workProduct.content.externalEffect, false);
    const read = await call(app, `/api/programs/v1/work-products/${product.payload.workProduct.id}`);
    assert.equal(read.response.status, 200); assert.equal(read.payload.workProduct.id, product.payload.workProduct.id);
  } finally { await close(app); }
});

test("Release K isolates programs across tenants", async () => {
  const app = await start();
  try {
    const beta = await call(app, "/api/programs/v1/bootstrap", { session: BETA });
    assert.equal(beta.response.status, 200); assert.deepEqual(beta.payload.programs.map((item) => item.id), ["SYN-PROG-900"]);
    const foreign = await call(app, "/api/programs/v1/programs/SYN-PROG-001", { session: BETA });
    assert.equal(foreign.response.status, 404);
    const foreignMutation = await call(app, "/api/programs/v1/programs/SYN-PROG-001/simulations", { session: BETA, method: "POST", body: { shiftDays: 3 } });
    assert.equal(foreignMutation.response.status, 404);
  } finally { await close(app); }
});
