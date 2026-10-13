import test from "node:test";
import assert from "node:assert/strict";
import { mkdtempSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { createApplication } from "../backend/server.mjs";

const ALPHA = "demo-session-alpha";
const BETA = "demo-session-beta";
let sequence = 0;
const headers = (session = ALPHA, mutation = false) => ({
  "content-type": "application/json",
  "x-demo-session": session,
  ...(mutation ? { "idempotency-key": `kernel-v2-test-${String(++sequence).padStart(6, "0")}` } : {}),
});

async function start() {
  const directory = mkdtempSync(join(tmpdir(), "amavio-kernel-v2-"));
  const app = createApplication({ databasePath: join(directory, "kernel-v2.sqlite"), providerMode: "local" });
  await new Promise((resolve) => app.server.listen(0, "127.0.0.1", resolve));
  return { ...app, base: `http://127.0.0.1:${app.server.address().port}` };
}
async function close(app) { await new Promise((resolve) => app.server.close(resolve)); }
async function json(response) { return response.json(); }
async function post(app, path, body = {}, session = ALPHA) {
  return fetch(`${app.base}${path}`, { method: "POST", headers: headers(session, true), body: JSON.stringify(body) });
}
async function approve(app, artifact) {
  const response = await post(app, `/api/kernel/v2/artifacts/${artifact.id}/review`, { decision: "approved", note: "Synthetisches Fachartefakt nachvollziehbar geprüft.", version: artifact.reviewVersion });
  assert.equal(response.status, 200);
  return (await json(response)).artifact;
}
async function prepareDecisionAndSimulation(app) {
  const detail = await json(await fetch(`${app.base}/api/v1.5/cases/SYN-CASE-001`, { headers: headers() }));
  const decision = detail.decisions.find((item) => item.status === "open");
  const decided = await post(app, `/api/v1.5/decisions/${decision.id}/review`, { option: decision.options[0], rationale: "Synthetische Fachentscheidung für einen reproduzierbaren Brief." });
  assert.equal(decided.status, 201);
  const simulated = await post(app, "/api/v1.5/cases/SYN-CASE-001/simulations", { arrivalDate: "2026-09-16" });
  assert.equal(simulated.status, 201);
}

test("Kernel V2 status exposes exactly the three local vertical capabilities", async () => {
  const app = await start();
  try {
    const response = await fetch(`${app.base}/api/kernel/v2/status`, { headers: headers() });
    assert.equal(response.status, 200);
    const status = await json(response);
    assert.deepEqual(status.capabilities, ["evidence_reconciliation", "critical_path_replan", "arrival_readiness_brief"]);
    assert.equal(status.boundaries.externalCalls, false);
    assert.equal(status.boundaries.automaticApply, false);
  } finally { await close(app); }
});

test("Evidence Reconciliation compares conflicts and creates a reviewable clarification order", async () => {
  const app = await start();
  try {
    const response = await post(app, "/api/kernel/v2/cases/SYN-CASE-001/evidence-reconciliations");
    assert.equal(response.status, 201);
    const artifact = (await json(response)).artifact;
    assert.equal(artifact.artifactType, "evidence_reconciliation");
    assert.equal(artifact.status, "awaiting_human_review");
    assert.ok(artifact.content.conflicts.length > 0);
    assert.ok(artifact.content.clarificationOrder.acceptanceCriteria.length >= 4);
    assert.ok(artifact.content.clarificationOrder.citations.includes("SYN-CASE-001-EVD-2"));
    assert.equal(artifact.externalEffect, false);
    const replay = await post(app, "/api/kernel/v2/cases/SYN-CASE-001/evidence-reconciliations");
    assert.equal(replay.status, 200);
    assert.equal((await json(replay)).artifact.id, artifact.id);
  } finally { await close(app); }
});

test("Critical-Path Replanning shifts dates deterministically without mutating the case", async () => {
  const app = await start();
  try {
    const before = await json(await fetch(`${app.base}/api/v1.5/cases/SYN-CASE-001`, { headers: headers() }));
    const response = await post(app, "/api/kernel/v2/cases/SYN-CASE-001/replans", { event: { type: "arrival_date_changed", effectiveDate: "2026-09-16", reason: "Anreise wurde im synthetischen Fall neu terminiert." } });
    assert.equal(response.status, 201);
    const artifact = (await json(response)).artifact;
    assert.equal(artifact.artifactType, "critical_path_replan");
    assert.ok(artifact.content.proposal.changes.length > 0);
    assert.ok(artifact.content.proposal.changes.every((item) => item.rationale && item.from && item.to));
    assert.equal(artifact.content.boundaries.originalMutated, false);
    const after = await json(await fetch(`${app.base}/api/v1.5/cases/SYN-CASE-001`, { headers: headers() }));
    assert.equal(after.case.arrivalDate, before.case.arrivalDate);
    assert.equal(after.case.version, before.case.version);
  } finally { await close(app); }
});

test("Arrival Readiness Brief fails closed until every documented prerequisite exists", async () => {
  const app = await start();
  try {
    const response = await post(app, "/api/kernel/v2/cases/SYN-CASE-001/readiness-briefs");
    assert.equal(response.status, 422);
    assert.equal((await json(response)).code, "kernel_brief_prerequisites");
  } finally { await close(app); }
});

test("Arrival Readiness Brief composes reproducibly and passes the six-part quality rubric", async () => {
  const app = await start();
  try {
    await prepareDecisionAndSimulation(app);
    const reconciliation = (await json(await post(app, "/api/kernel/v2/cases/SYN-CASE-001/evidence-reconciliations"))).artifact;
    await approve(app, reconciliation);
    const replan = (await json(await post(app, "/api/kernel/v2/cases/SYN-CASE-001/replans", { event: { type: "arrival_date_changed", effectiveDate: "2026-09-16", reason: "Synthetische Terminänderung fachlich nachvollziehen." } }))).artifact;
    await approve(app, replan);
    const response = await post(app, "/api/kernel/v2/cases/SYN-CASE-001/readiness-briefs");
    assert.equal(response.status, 201);
    const artifact = (await json(response)).artifact;
    assert.equal(artifact.content.sections.length, 7);
    assert.equal(artifact.quality.score, 100);
    assert.equal(artifact.quality.outcome, "pass");
    assert.equal(artifact.content.boundaries.sinkOnly, true);
    assert.ok(artifact.content.provenance.decisionId.startsWith("DCS-"));
    const replay = await post(app, "/api/kernel/v2/cases/SYN-CASE-001/readiness-briefs");
    assert.equal(replay.status, 200);
    assert.equal((await json(replay)).artifact.id, artifact.id);
  } finally { await close(app); }
});

test("Kernel V2 tenant boundary and evaluation harness are green", async () => {
  const app = await start();
  try {
    const created = (await json(await post(app, "/api/kernel/v2/cases/SYN-CASE-001/evidence-reconciliations"))).artifact;
    const foreign = await fetch(`${app.base}/api/kernel/v2/artifacts/${created.id}`, { headers: headers(BETA) });
    assert.equal(foreign.status, 404);
    const evaluation = await post(app, "/api/kernel/v2/evaluations", { caseId: "SYN-CASE-001" });
    assert.equal(evaluation.status, 201);
    const result = (await json(evaluation)).result;
    assert.equal(result.total, 48);
    assert.equal(result.passed, 48);
    assert.equal(result.failed, 0);
    assert.equal(result.externalCalls, 0);
    assert.equal(result.externalEffects, 0);
  } finally { await close(app); }
});
