import test from "node:test";
import assert from "node:assert/strict";
import { mkdtempSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { createApplication } from "../backend/server.mjs";

let sequence = 0;
const headers = (session = "demo-session-operations", mutation = false) => ({
  "x-demo-session": session,
  ...(mutation ? { "content-type": "application/json", "idempotency-key": `release-i-${String(++sequence).padStart(6, "0")}` } : {}),
});

async function start() {
  const directory = mkdtempSync(join(tmpdir(), "amavio-release-i-twin-"));
  const app = createApplication({ databasePath: join(directory, "operations-twin.sqlite"), providerMode: "local" });
  await new Promise((resolve) => app.server.listen(0, "127.0.0.1", resolve));
  return { ...app, base: `http://127.0.0.1:${app.server.address().port}` };
}
async function close(app) { await new Promise((resolve) => app.server.close(resolve)); }
const json = (response) => response.json();

test("Release I liefert eine kohortenweite, mandantengebundene Operations-Twin-Lage", async () => {
  const app = await start();
  try {
    const response = await fetch(`${app.base}/api/twin/v1/bootstrap`, { headers: headers() });
    assert.equal(response.status, 200);
    const payload = await json(response);
    assert.equal(payload.cohort.name, "Pflegekohorte September");
    assert.equal(payload.cohort.plannedArrivals, 12);
    assert.equal(payload.cohort.trackedCases, 5);
    assert.equal(payload.events.length, 5);
    assert.equal(payload.metrics.criticalEvents, 3);
    assert.equal(payload.readiness.reduce((total, item) => total + item.count, 0), 12);
    assert.equal(payload.handoffs.length, 5);
    assert.equal(payload.boundaries.externalAI, false);
    assert.equal(payload.boundaries.externalEffects, false);
  } finally { await close(app); }
});

test("Release I erzeugt Arbeitspläne reproduzierbar, idempotent und nur hinter Human Gate", async () => {
  const app = await start();
  try {
    const key = "release-i-fixed-idempotency";
    const create = () => fetch(`${app.base}/api/twin/v1/events/SYN-TWIN-EVT-001/work-plans`, { method: "POST", headers: { ...headers("demo-session-operations", true), "idempotency-key": key }, body: "{}" });
    const first = await create();
    assert.equal(first.status, 201);
    const firstPayload = await json(first);
    assert.equal(firstPayload.plan.status, "awaiting_human_review");
    assert.equal(firstPayload.plan.externalEffect, false);
    assert.equal(firstPayload.plan.steps.length, 3);
    const replay = await create();
    assert.equal(replay.status, 201);
    assert.equal((await json(replay)).plan.id, firstPayload.plan.id);

    const review = await fetch(`${app.base}/api/twin/v1/work-plans/${encodeURIComponent(firstPayload.plan.id)}/review`, {
      method: "POST", headers: headers("demo-session-operations", true), body: JSON.stringify({ decision: "approved", note: "Synthetischen Arbeitsplan fachlich geprüft.", version: 1 }),
    });
    assert.equal(review.status, 200);
    const reviewed = await json(review);
    assert.equal(reviewed.plan.status, "advisory_approved");
    assert.equal(reviewed.plan.version, 2);
    assert.equal(reviewed.plan.externalEffect, false);
  } finally { await close(app); }
});

test("Release I isoliert Simulation, Mandanten und Arbeitgeberrollen", async () => {
  const app = await start();
  try {
    const before = app.db.prepare("SELECT arrival_date FROM arrival_cases WHERE id='SYN-CASE-001'").get().arrival_date;
    const simulation = await fetch(`${app.base}/api/twin/v1/cohort-simulations`, { method: "POST", headers: headers("demo-session-operations", true), body: JSON.stringify({ shiftDays: 3 }) });
    assert.equal(simulation.status, 201);
    const result = await json(simulation);
    assert.equal(result.simulation.status, "preview");
    assert.equal(result.simulation.result.originalMutated, false);
    assert.equal(result.simulation.result.automaticDecision, false);
    assert.equal(app.db.prepare("SELECT arrival_date FROM arrival_cases WHERE id='SYN-CASE-001'").get().arrival_date, before);

    const crossTenant = await fetch(`${app.base}/api/twin/v1/events/SYN-TWIN-EVT-001`, { headers: headers("demo-session-beta") });
    assert.equal(crossTenant.status, 404);
    const employer = await fetch(`${app.base}/api/twin/v1/bootstrap`, { headers: headers("demo-session-employer-sponsor") });
    assert.equal(employer.status, 403);
    assert.equal((await json(employer)).code, "role_scope_denied");
  } finally { await close(app); }
});

test("Release I schützt parallele Human-Gate-Prüfungen mit Versionskonflikt", async () => {
  const app = await start();
  try {
    const created = await fetch(`${app.base}/api/twin/v1/events/SYN-TWIN-EVT-005/work-plans`, { method: "POST", headers: headers("demo-session-operations", true), body: "{}" });
    const plan = (await json(created)).plan;
    const review = (decision) => fetch(`${app.base}/api/twin/v1/work-plans/${encodeURIComponent(plan.id)}/review`, { method: "POST", headers: headers("demo-session-operations", true), body: JSON.stringify({ decision, note: `Parallele synthetische Prüfung: ${decision}.`, version: plan.version }) });
    const results = await Promise.all([review("approved"), review("rejected")]);
    assert.deepEqual(results.map((item) => item.status).sort(), [200, 409]);
    const rows = app.db.prepare("SELECT status,version FROM twin_work_plans WHERE id=?").all(plan.id);
    assert.equal(rows.length, 1);
    assert.equal(rows[0].version, 2);
  } finally { await close(app); }
});
