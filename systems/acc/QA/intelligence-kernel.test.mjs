import test from "node:test";
import assert from "node:assert/strict";
import { mkdtempSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { createApplication } from "../backend/server.mjs";
import { buildEvidenceGraph } from "../backend/kernel/evidence-graph.mjs";
import { capabilityFor, listCapabilities } from "../backend/kernel/capability-registry.mjs";
import { evaluatePolicies } from "../backend/kernel/policy-engine.mjs";

const SESSION_ALPHA = "demo-session-alpha";
const SESSION_BETA = "demo-session-beta";
let sequence = 0;
const headers = (session = SESSION_ALPHA, mutation = false) => ({
  "content-type": "application/json",
  "x-demo-session": session,
  ...(mutation ? { "idempotency-key": `kernel-test-${String(++sequence).padStart(5, "0")}` } : {}),
});

async function start() {
  const directory = mkdtempSync(join(tmpdir(), "amavio-kernel-test-"));
  const application = createApplication({ databasePath: join(directory, "kernel.sqlite"), providerMode: "local" });
  await new Promise((resolve) => application.server.listen(0, "127.0.0.1", resolve));
  return { ...application, base: `http://127.0.0.1:${application.server.address().port}` };
}
async function close(app) { await new Promise((resolve) => app.server.close(resolve)); }
async function json(response) { return response.json(); }
async function detail(app) { return json(await fetch(`${app.base}/api/v1.5/cases/SYN-CASE-001`, { headers: headers() })); }
async function post(app, path, body, session = SESSION_ALPHA) {
  return fetch(`${app.base}${path}`, { method: "POST", headers: headers(session, true), body: JSON.stringify(body) });
}

test("Evidence Graph is deterministic, sourced and conflict-aware", async () => {
  const app = await start();
  try {
    const snapshot = await detail(app);
    const first = buildEvidenceGraph(snapshot);
    const second = buildEvidenceGraph(snapshot);
    assert.equal(first.fingerprint, second.fingerprint);
    assert.equal(first.summary.evidenceCount, 3);
    assert.equal(first.summary.conflictCount, 1);
    assert.ok(first.edges.some((item) => item.relation === "contradicts" && item.blocking));
    assert.ok(first.nodes.some((item) => item.type === "decision"));
    assert.match(first.fingerprint, /^[a-f0-9]{64}$/);
  } finally { await close(app); }
});

test("Policy Engine allows local advisory capabilities and denies external provider execution", async () => {
  const app = await start();
  try {
    const snapshot = await detail(app);
    const graph = buildEvidenceGraph(snapshot);
    const capability = capabilityFor("case.orchestrate");
    const local = evaluatePolicies({ detail: snapshot, graph, capability, provider: "local" });
    const external = evaluatePolicies({ detail: snapshot, graph, capability, provider: "openai" });
    assert.equal(local.outcome, "allow");
    assert.equal(local.decisions.length, 8);
    assert.equal(external.outcome, "deny");
    assert.deepEqual(external.deniedPolicyIds, ["POL-007"]);
    assert.equal(listCapabilities().length, 4);
  } finally { await close(app); }
});

test("Kernel context drives the existing journey without external effects", async () => {
  const app = await start();
  try {
    const response = await fetch(`${app.base}/api/kernel/v1/cases/SYN-CASE-001/context`, { headers: headers() });
    assert.equal(response.status, 200);
    const context = await json(response);
    assert.equal(context.contractVersion, "amavio.intelligence-kernel.v1");
    assert.equal(context.policy.outcome, "allow");
    assert.equal(context.orchestration.recommendedStage, "evidence");
    assert.equal(context.orchestration.nextResponsibility.ownerRole, "AMAVIO Operations");
    assert.equal(context.orchestration.humanGate.status, "required");
    assert.equal(context.externalEffect, false);
  } finally { await close(app); }
});

test("Kernel capability run is cited, persistent and human-gated", async () => {
  const app = await start();
  try {
    const created = await post(app, "/api/kernel/v1/runs", {
      caseId: "SYN-CASE-001",
      capabilityId: "evidence.resolve_conflict",
      provider: "local",
      instruction: "Erkläre nur den belegten synthetischen Konflikt.",
    });
    assert.equal(created.status, 201);
    const run = (await json(created)).run;
    assert.equal(run.status, "awaiting_human_review");
    assert.equal(run.provider, "local");
    assert.equal(run.output.externalEffect, false);
    assert.ok(run.output.citations.includes("SYN-CASE-001-EVD-2"));
    assert.equal(run.humanGate.automaticDecision, false);
    assert.equal(run.humanGate.effectMode, "advisory_only");

    const reviewed = await post(app, `/api/kernel/v1/runs/${run.id}/review`, {
      decision: "approved",
      note: "Belegte synthetische Empfehlung fachlich geprüft.",
      version: run.reviewVersion,
    });
    assert.equal(reviewed.status, 200);
    const reviewedRun = (await json(reviewed)).run;
    assert.equal(reviewedRun.status, "approved");
    assert.equal(reviewedRun.humanGate.approvalMeaning, "advisory_approved");
    assert.equal(reviewedRun.externalEffect, false);

    const replayReview = await post(app, `/api/kernel/v1/runs/${run.id}/review`, {
      decision: "approved", note: "Zweite Prüfung.", version: run.reviewVersion,
    });
    assert.equal(replayReview.status, 409);
  } finally { await close(app); }
});

test("External provider request and cross-tenant access fail closed", async () => {
  const app = await start();
  try {
    const external = await post(app, "/api/kernel/v1/runs", {
      caseId: "SYN-CASE-001", capabilityId: "case.orchestrate", provider: "openai",
    });
    assert.equal(external.status, 409);
    assert.equal((await json(external)).code, "kernel_policy_denied");

    const foreignContext = await fetch(`${app.base}/api/kernel/v1/cases/SYN-CASE-001/context`, { headers: headers(SESSION_BETA) });
    assert.equal(foreignContext.status, 404);
    const foreignRun = await post(app, "/api/kernel/v1/runs", {
      caseId: "SYN-CASE-001", capabilityId: "case.orchestrate", provider: "local",
    }, SESSION_BETA);
    assert.equal(foreignRun.status, 404);

    const alphaRunResponse = await post(app, "/api/kernel/v1/runs", {
      caseId: "SYN-CASE-001", capabilityId: "case.orchestrate", provider: "local",
    });
    const alphaRun = (await json(alphaRunResponse)).run;
    const foreignReview = await post(app, `/api/kernel/v1/runs/${alphaRun.id}/review`, {
      decision: "approved", note: "Unzulässige tenantfremde Prüfung.", version: alphaRun.reviewVersion,
    }, SESSION_BETA);
    assert.equal(foreignReview.status, 404);
  } finally { await close(app); }
});

test("Kernel Evaluation Harness is completely green with zero calls and effects", async () => {
  const app = await start();
  try {
    const response = await post(app, "/api/kernel/v1/evaluations", { caseId: "SYN-CASE-001" });
    assert.equal(response.status, 201);
    const result = (await json(response)).result;
    assert.equal(result.total, 34);
    assert.equal(result.passed, 34);
    assert.equal(result.failed, 0);
    assert.equal(result.externalCalls, 0);
    assert.equal(result.externalEffects, 0);
  } finally { await close(app); }
});
