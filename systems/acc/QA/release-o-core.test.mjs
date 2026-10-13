import test from "node:test";
import assert from "node:assert/strict";
import { mkdtempSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { createApplication } from "../backend/server.mjs";

const sessions = { operations: "demo-session-operations", location: "demo-session-employer-location" };
let sequence = 0;

async function start() {
  const databasePath = join(mkdtempSync(join(tmpdir(), "amavio-release-o-")), "release-o.sqlite");
  const application = createApplication({ databasePath, providerMode: "local" });
  await new Promise((resolve) => application.server.listen(0, "127.0.0.1", resolve));
  return { ...application, base: `http://127.0.0.1:${application.server.address().port}` };
}
async function close(app) { await new Promise((resolve) => app.server.close(resolve)); }
async function call(app, path, { session = "operations", method = "GET", body } = {}) {
  const headers = { "x-demo-session": sessions[session] };
  if (body !== undefined) {
    sequence += 1;
    headers["content-type"] = "application/json";
    headers["idempotency-key"] = `release-o-${sequence}`;
  }
  const response = await fetch(`${app.base}${path}`, { method, headers, ...(body === undefined ? {} : { body: JSON.stringify(body) }) });
  return { response, payload: await response.json().catch(() => ({})) };
}

test("Release O Golden Journey remains intact inside later Release P variants and resets reproducibly", async () => {
  const app = await start();
  try {
    const health = await fetch(`${app.base}/api/health`).then((response) => response.json());
    assert.ok(["O", "P", "P.1", "P.2", "P.3", "Q"].includes(health.release));
    assert.equal(health.consolidatedRuntime, true);
    assert.equal(health.goldenJourney, true);
    assert.equal(health.providerCalls, 0);
    assert.equal(health.externalEffects, false);

    const reset = await call(app, "/api/execution/v1/demo-reset", { method: "POST", body: { caseId: "SYN-CASE-001" } });
    assert.equal(reset.response.status, 200);
    let execution = reset.payload.execution;
    assert.deepEqual(execution.plan.progress, { completed: 0, total: 4 });

    const clarification = await call(app, "/api/v1.5/cases/SYN-CASE-001/work-products", { method: "POST", body: { type: "exception_resolution_plan" } });
    assert.equal(clarification.response.status, 201);
    assert.ok(clarification.payload.workProduct.content.sections.some((item) => item.title === "Fehlende Grundlage"));
    assert.equal(clarification.payload.workProduct.externalEffect, false);

    const first = execution.orders.find((item) => item.sequence === 1);
    const stageOne = await call(app, `/api/execution/v1/work-orders/${first.id}/transitions`, { method: "POST", body: { status: "completed", version: first.version, note: "Klärungsauftrag mit Quellen, Lücke und nächster Verantwortung fachlich geprüft." } });
    assert.equal(stageOne.response.status, 200);
    assert.equal(stageOne.payload.execution.orders.find((item) => item.sequence === 2).status, "ready");

    const employerView = (await call(app, "/api/execution/v1/cases/SYN-CASE-001", { session: "location" })).payload;
    assert.equal(employerView.access.internalDecisionLogicHidden, true);
    assert.equal(employerView.handoffs[0].status, "open");
    const handoff = employerView.handoffs[0];
    const contribution = { address: "Musterweg 24, 40200 Düsseldorf", availableFrom: "2026-09-18", basis: "Geprüfter Vertragsentwurf", rationale: "Der synthetische Vertragsentwurf und die Übergabezeit wurden am Standort gemeinsam geprüft." };
    const handed = await call(app, `/api/execution/v1/handoffs/${handoff.id}/respond`, { session: "location", method: "POST", body: { decision: "acknowledged", version: handoff.version, note: `${contribution.address}; verfügbar ab ${contribution.availableFrom}. ${contribution.rationale}`, contribution } });
    assert.equal(handed.response.status, 200);
    assert.equal(handed.payload.execution.handoffs[0].status, "acknowledged");

    execution = (await call(app, "/api/execution/v1/cases/SYN-CASE-001")).payload;
    const third = execution.orders.find((item) => item.sequence === 3);
    const stageThree = await call(app, `/api/execution/v1/work-orders/${third.id}/transitions`, { method: "POST", body: { status: "completed", version: third.version, note: "Standortbeitrag gegen Wohnraum, Übergabe und Arbeitsstartabhängigkeit geprüft." } });
    assert.equal(stageThree.response.status, 200);
    const decision = stageThree.payload.execution.decisionPackages[0];
    assert.equal(decision.status, "open");

    const decided = await call(app, `/api/execution/v1/decision-packages/${decision.id}/review`, { method: "POST", body: { version: decision.version, option: decision.recommendation, rationale: "Evidenz, Arbeitgeberbeitrag und Auswirkung wurden vollständig menschlich geprüft." } });
    assert.equal(decided.response.status, 200);
    assert.equal(decided.payload.execution.plan.status, "locally_decided");
    assert.equal(decided.payload.execution.impacts[0].applied, false);

    const brief = await call(app, "/api/v1.5/cases/SYN-CASE-001/work-products", { method: "POST", body: { type: "arrival_readiness_brief" } });
    assert.equal(brief.response.status, 201);
    assert.ok(brief.payload.workProduct.content.sections.some((item) => item.title === "Dokumentierte Entscheidung"));
    assert.match(brief.payload.workProduct.content.sections.find((item) => item.title === "Dokumentierte Entscheidung").text, /vollständig menschlich geprüft/i);
    assert.ok(!JSON.stringify(brief.payload.workProduct.content).includes("R-0"));

    for (const [eventType, journeyStep] of [["work_product_created", 1], ["employer_handoff_completed", 2], ["journey_step_completed", 3], ["human_gate_confirmed", 4]]) {
      const event = await call(app, "/api/execution/v1/metrics/events", { method: "POST", body: { caseId: "SYN-CASE-001", eventType, journeyStep, durationMs: journeyStep * 1000 } });
      assert.equal(event.response.status, 201);
    }
    const metrics = await call(app, "/api/execution/v1/metrics/summary?caseId=SYN-CASE-001");
    assert.equal(metrics.payload.summary.totalEvents, 4);
    assert.equal(metrics.payload.summary.humanGates, 1);
    assert.equal(metrics.payload.boundaries.realWorldEfficiencyClaim, false);

    const finalReset = await call(app, "/api/execution/v1/demo-reset", { method: "POST", body: { caseId: "SYN-CASE-001" } });
    assert.deepEqual(finalReset.payload.execution.plan.progress, { completed: 0, total: 4 });
    const emptyMetrics = await call(app, "/api/execution/v1/metrics/summary?caseId=SYN-CASE-001");
    assert.equal(emptyMetrics.payload.summary.totalEvents, 0);
  } finally { await close(app); }
});

test("Release O rejects incomplete employer evidence and protects role boundaries", async () => {
  const app = await start();
  try {
    let execution = (await call(app, "/api/execution/v1/cases/SYN-CASE-001")).payload;
    const first = execution.orders[0];
    await call(app, `/api/execution/v1/work-orders/${first.id}/transitions`, { method: "POST", body: { status: "completed", version: first.version, note: "Synthetische Lageklärung für den Rollen- und Validierungstest abgeschlossen." } });
    const employer = (await call(app, "/api/execution/v1/cases/SYN-CASE-001", { session: "location" })).payload;
    const handoff = employer.handoffs[0];
    const invalid = await call(app, `/api/execution/v1/handoffs/${handoff.id}/respond`, { session: "location", method: "POST", body: { decision: "acknowledged", version: handoff.version, note: "Unvollständiger strukturierter Testbeitrag.", contribution: { address: "Musterweg", availableFrom: "", basis: "", rationale: "zu kurz" } } });
    assert.equal(invalid.response.status, 409);
    assert.equal(invalid.payload.code, "invalid_structured_contribution");
    execution = (await call(app, "/api/execution/v1/cases/SYN-CASE-001")).payload;
    assert.equal(execution.orders.find((item) => item.sequence === 2).status, "ready");
  } finally { await close(app); }
});
