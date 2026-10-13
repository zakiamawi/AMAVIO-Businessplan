import test from "node:test";
import assert from "node:assert/strict";
import { mkdtempSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { createApplication } from "../backend/server.mjs";

const sessions = {
  operations: "demo-session-operations",
  location: "demo-session-employer-location",
  sponsor: "demo-session-employer-sponsor",
  beta: "demo-session-beta",
};
let sequence = 0;

async function start() {
  const databasePath = join(mkdtempSync(join(tmpdir(), "amavio-release-m-")), "release-m.sqlite");
  const application = createApplication({ databasePath, providerMode: "local" });
  await new Promise((resolve) => application.server.listen(0, "127.0.0.1", resolve));
  return { ...application, base: `http://127.0.0.1:${application.server.address().port}` };
}

async function close(app) { await new Promise((resolve) => app.server.close(resolve)); }

async function call(app, path, { session = "operations", method = "GET", body, requestKey } = {}) {
  const headers = { "x-demo-session": sessions[session] };
  if (body !== undefined) {
    sequence += 1;
    headers["content-type"] = "application/json";
    headers["idempotency-key"] = requestKey || `release-m-${sequence}`;
  }
  const response = await fetch(`${app.base}${path}`, { method, headers, ...(body !== undefined ? { body: JSON.stringify(body) } : {}) });
  const payload = await response.json().catch(() => ({}));
  return { response, payload };
}

test("Release M projects one role-specific execution path without exposing internal decision logic", async () => {
  const app = await start();
  try {
    const operations = await call(app, "/api/execution/v1/cases/SYN-CASE-001");
    assert.equal(operations.response.status, 200);
    assert.equal(operations.payload.orders.length, 4);
    assert.equal(operations.payload.decisionPackages.length, 1);
    assert.deepEqual(operations.payload.boundaries, { syntheticOnly: true, providerCalls: 0, automaticDecision: false, externalEffects: false });

    const employer = await call(app, "/api/execution/v1/cases/SYN-CASE-001", { session: "location" });
    assert.equal(employer.response.status, 200);
    assert.equal(employer.payload.orders.length, 1);
    assert.equal(employer.payload.orders[0].ownerRole, "Arbeitgeber Standort");
    assert.equal(employer.payload.handoffs.length, 1);
    assert.equal(employer.payload.decisionPackages.length, 0);
    assert.equal(employer.payload.access.internalDecisionLogicHidden, true);
  } finally { await close(app); }
});

test("Release M closes the full local execution loop from work order to advisory program impact", async () => {
  const app = await start();
  try {
    let current = (await call(app, "/api/execution/v1/cases/SYN-CASE-001")).payload;
    const first = current.orders[0];
    const completedFoundation = await call(app, `/api/execution/v1/work-orders/${first.id}/transitions`, { method: "POST", body: { status: "completed", version: first.version, note: "Synthetische Wohnungsgrundlage fachlich und nachvollziehbar lokal abgeschlossen." } });
    assert.equal(completedFoundation.response.status, 200);
    assert.equal(completedFoundation.payload.execution.orders[1].status, "ready");

    const locationView = (await call(app, "/api/execution/v1/cases/SYN-CASE-001", { session: "location" })).payload;
    assert.equal(locationView.handoffs[0].status, "open");
    const handoff = locationView.handoffs[0];
    const acknowledged = await call(app, `/api/execution/v1/handoffs/${handoff.id}/respond`, { session: "location", method: "POST", body: { decision: "acknowledged", version: handoff.version, note: "Synthetische Übergabezeit und Standortverantwortung wurden bewusst bestätigt." } });
    assert.equal(acknowledged.response.status, 200);
    assert.equal(acknowledged.payload.execution.handoffs[0].status, "acknowledged");

    current = (await call(app, "/api/execution/v1/cases/SYN-CASE-001")).payload;
    const impactCheck = current.orders.find((item) => item.id === "SYN-EXEC-WO-003");
    assert.equal(impactCheck.status, "ready");
    const checked = await call(app, `/api/execution/v1/work-orders/${impactCheck.id}/transitions`, { method: "POST", body: { status: "completed", version: impactCheck.version, note: "Auswirkung auf den synthetischen Arbeitsstart und das Programm lokal geprüft." } });
    assert.equal(checked.response.status, 200);
    assert.equal(checked.payload.execution.plan.status, "awaiting_decision");
    assert.equal(checked.payload.execution.decisionPackages[0].status, "open");

    const decision = checked.payload.execution.decisionPackages[0];
    const reviewed = await call(app, `/api/execution/v1/decision-packages/${decision.id}/review`, { method: "POST", body: { version: decision.version, option: decision.recommendation, rationale: "Die vollständige synthetische Arbeitskette und alle Abhängigkeiten wurden menschlich geprüft." } });
    assert.equal(reviewed.response.status, 200);
    assert.equal(reviewed.payload.execution.plan.status, "locally_decided");
    assert.equal(reviewed.payload.execution.impacts.length, 1);
    assert.equal(reviewed.payload.execution.impacts[0].applied, false);
    assert.equal(reviewed.payload.externalEffect, false);

    const program = await call(app, "/api/execution/v1/programs/SYN-PROG-001/impacts");
    assert.equal(program.response.status, 200);
    assert.equal(program.payload.impacts.length, 1);
    assert.equal(program.payload.impacts[0].advisoryOnly, true);
  } finally { await close(app); }
});

test("Release M rejects wrong roles, stale versions and tenant-crossing requests", async () => {
  const app = await start();
  try {
    const first = (await call(app, "/api/execution/v1/cases/SYN-CASE-001")).payload.orders[0];
    const requests = ["a", "b"].map((suffix) => call(app, `/api/execution/v1/work-orders/${first.id}/transitions`, { method: "POST", requestKey: `release-m-race-${suffix}`, body: { status: "completed", version: first.version, note: "Synthetischer Paralleltest mit nachvollziehbarer lokaler Abschlussnotiz." } }));
    const raced = await Promise.all(requests);
    assert.deepEqual(raced.map((item) => item.response.status).sort((a, b) => a - b), [200, 409]);

    const location = (await call(app, "/api/execution/v1/cases/SYN-CASE-001", { session: "location" })).payload;
    const forbidden = await call(app, `/api/execution/v1/handoffs/${location.handoffs[0].id}/respond`, { session: "sponsor", method: "POST", body: { decision: "acknowledged", version: location.handoffs[0].version, note: "Unzulässige rollenfremde Bestätigung im synthetischen Test." } });
    assert.equal(forbidden.response.status, 403);
    assert.equal(forbidden.payload.code, "role_scope_denied");

    const tenant = await call(app, "/api/execution/v1/cases/SYN-CASE-001", { session: "beta" });
    assert.equal(tenant.response.status, 404);
  } finally { await close(app); }
});

test("Release M capability health remains provider-free and effect-free in later releases", async () => {
  const app = await start();
  try {
    const response = await fetch(`${app.base}/api/health`);
    const health = await response.json();
    assert.ok(["M", "N", "O", "P", "P.1", "P.2", "P.3", "Q"].includes(health.release));
    assert.equal(health.operationalExecutionLoop, true);
    assert.equal(health.providerCalls, 0);
    assert.equal(health.externalEffects, false);
  } finally { await close(app); }
});

test("Release M keeps existing cases without an execution plan console-clean and usable", async () => {
  const app = await start();
  try {
    const result = await call(app, "/api/execution/v1/cases/SYN-CASE-900", { session: "beta" });
    assert.equal(result.response.status, 200);
    assert.equal(result.payload.available, false);
    assert.deepEqual(result.payload.orders, []);
    assert.equal(result.payload.boundaries.externalEffects, false);
  } finally { await close(app); }
});
