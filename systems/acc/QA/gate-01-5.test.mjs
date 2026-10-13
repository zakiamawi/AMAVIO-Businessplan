import test from "node:test";
import assert from "node:assert/strict";
import { mkdtempSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { createApplication } from "../backend/server.mjs";
import { buildEvaluationCases, runEvaluationSuite } from "../backend/gate-01-5.mjs";
import { createProviderRegistry } from "../backend/provider-adapters.mjs";

let requestSequence = 0;
const headers = (session = "demo-session-alpha") => ({
  "content-type": "application/json",
  "x-demo-session": session,
  "idempotency-key": `gate15-test-${++requestSequence}`,
});

async function start(databasePath, options = {}) {
  const application = createApplication({ databasePath, providerMode: "local", ...options });
  await new Promise((resolve) => application.server.listen(0, "127.0.0.1", resolve));
  const address = application.server.address();
  return { ...application, base: `http://127.0.0.1:${address.port}` };
}

async function close(server) { await new Promise((resolve) => server.close(resolve)); }
async function payload(response) { const body = await response.json(); assert.ok(response.ok, JSON.stringify(body)); return body; }

test("Gate 01.5 exposes a tenant-bound operational case model and ten transparent rules", async () => {
  const directory = mkdtempSync(join(tmpdir(), "amavio-acc-gate15-domain-"));
  const app = await start(join(directory, "gate15.sqlite"));
  try {
    const bootstrap = await payload(await fetch(`${app.base}/api/v1.5/bootstrap`, { headers: headers() }));
    assert.equal(bootstrap.portfolio.length, 5);
    assert.equal(bootstrap.portfolio[0].id, "SYN-CASE-001");
    assert.equal(bootstrap.selected.case.synthetic, true);
    assert.equal(bootstrap.selected.milestones.length, 5);
    assert.equal(bootstrap.selected.rules.length, 10);
    assert.ok(bootstrap.selected.rules.some((rule) => rule.id === "R-02" && rule.triggered));
    assert.ok(bootstrap.selected.criticalPath.length >= 5);
    assert.equal(bootstrap.providerStatus.active, "local");
    assert.equal(bootstrap.providerStatus.providers.find((provider) => provider.id === "openai").activation, "gate_closed");

    const foreign = await fetch(`${app.base}/api/v1.5/cases/SYN-CASE-900`, { headers: headers() });
    assert.equal(foreign.status, 404);
    const beta = await payload(await fetch(`${app.base}/api/v1.5/portfolio`, { headers: headers("demo-session-beta") }));
    assert.equal(beta.cases.length, 4);
    assert.ok(beta.cases.every((item) => item.id.startsWith("SYN-CASE-9")));
  } finally { await close(app.server); }
});

test("simulation stays isolated until a versioned human-gated apply", async () => {
  const directory = mkdtempSync(join(tmpdir(), "amavio-acc-gate15-sim-"));
  const databasePath = join(directory, "gate15.sqlite");
  const app = await start(databasePath);
  let simulationId;
  try {
    const before = await payload(await fetch(`${app.base}/api/v1.5/cases/SYN-CASE-001`, { headers: headers() }));
    assert.equal(before.case.arrivalDate, "2026-09-13");

    const simulation = await payload(await fetch(`${app.base}/api/v1.5/cases/SYN-CASE-001/simulations`, {
      method: "POST", headers: headers(), body: JSON.stringify({ arrivalDate: "2026-09-16" }),
    }));
    simulationId = simulation.simulation.id;
    assert.equal(simulation.simulation.output.deltaDays, 3);
    assert.equal(simulation.simulation.output.originalMutated, false);
    assert.equal(simulation.simulation.output.impactedMilestones.length, 5);

    const unchanged = await payload(await fetch(`${app.base}/api/v1.5/cases/SYN-CASE-001`, { headers: headers() }));
    assert.equal(unchanged.case.arrivalDate, "2026-09-13");

    const invalidApply = await fetch(`${app.base}/api/v1.5/simulations/${simulationId}/apply`, {
      method: "POST", headers: headers(), body: JSON.stringify({ selectedChanges: ["arrivalDate"], note: "" }),
    });
    assert.equal(invalidApply.status, 409);

    const applied = await payload(await fetch(`${app.base}/api/v1.5/simulations/${simulationId}/apply`, {
      method: "POST", headers: headers(), body: JSON.stringify({ selectedChanges: ["arrivalDate"], note: "Synthetische Folgetermine geprüft und lokal übernommen." }),
    }));
    assert.equal(applied.humanGate, true);
    assert.equal(applied.externalEffect, false);

    const after = await payload(await fetch(`${app.base}/api/v1.5/cases/SYN-CASE-001`, { headers: headers() }));
    assert.equal(after.case.arrivalDate, "2026-09-16");
    assert.equal(after.case.version, before.case.version + 1);
    assert.equal(after.milestones[0].dueDate, "2026-09-10");
  } finally { await close(app.server); }

  const reopened = await start(databasePath);
  try {
    const persisted = await payload(await fetch(`${reopened.base}/api/v1.5/cases/SYN-CASE-001`, { headers: headers() }));
    assert.equal(persisted.case.arrivalDate, "2026-09-16");
    assert.ok(persisted.events.some((event) => event.event_type === "simulation.applied"));
  } finally { await close(reopened.server); }
});

test("evidence review, decision and all seven work-product types remain local and sourced", async () => {
  const directory = mkdtempSync(join(tmpdir(), "amavio-acc-gate15-products-"));
  const app = await start(join(directory, "gate15.sqlite"));
  try {
    const reviewed = await payload(await fetch(`${app.base}/api/v1.5/evidence/SYN-CASE-001-EVD-2/review`, {
      method: "POST", headers: headers(), body: JSON.stringify({ status: "confirmed", note: "Synthetische Vertragsangabe fachlich geprüft.", version: 1 }),
    }));
    assert.equal(reviewed.externalEffect, false);

    const decision = await payload(await fetch(`${app.base}/api/v1.5/decisions/SYN-CASE-001-DEC-1/review`, {
      method: "POST", headers: headers(), body: JSON.stringify({ option: "Vertragsangabe bestätigen", rationale: "Im synthetischen Fall als Arbeitsgrundlage bestätigt." }),
    }));
    assert.equal(decision.effectMode, "local_only");

    const types = ["arrival_readiness_brief", "decision_memo", "exception_resolution_plan", "employer_handover_brief", "stabilization_plan", "communication_draft", "case_closure_record"];
    for (const type of types) {
      const workProduct = await payload(await fetch(`${app.base}/api/v1.5/cases/SYN-CASE-001/work-products`, {
        method: "POST", headers: headers(), body: JSON.stringify({ type }),
      }));
      assert.equal(workProduct.workProduct.status, "sink_only");
      assert.equal(workProduct.workProduct.externalEffect, false);
      assert.ok(workProduct.workProduct.sourceRefs.some((ref) => ref.startsWith("SYN-CASE-001-EVD-")));
    }
    const detail = await payload(await fetch(`${app.base}/api/v1.5/cases/SYN-CASE-001`, { headers: headers() }));
    assert.equal(detail.workProducts.length, 7);
  } finally { await close(app.server); }
});

test("24 evaluation fixtures pass and local capability output is cited while external providers stay closed", async () => {
  assert.equal(buildEvaluationCases().length, 24);
  const direct = runEvaluationSuite();
  assert.equal(direct.passed, 24);
  assert.equal(direct.failed, 0);

  const directory = mkdtempSync(join(tmpdir(), "amavio-acc-gate15-eval-"));
  const app = await start(join(directory, "gate15.sqlite"));
  try {
    const evaluation = await payload(await fetch(`${app.base}/api/v1.5/evaluations/runs`, { method: "POST", headers: headers(), body: "{}" }));
    assert.equal(evaluation.result.total, 24);
    assert.equal(evaluation.result.schemaConformance, "100%");
    assert.equal(evaluation.result.crossTenantFindings, 0);

    const local = await payload(await fetch(`${app.base}/api/v1.5/capabilities/runs`, {
      method: "POST", headers: headers(), body: JSON.stringify({ caseId: "SYN-CASE-001", capability: "explain_conflict", provider: "local", instruction: "Erkläre den belegten Widerspruch." }),
    }));
    assert.equal(local.run.provider, "local");
    assert.equal(local.run.model, "amavio-domain-engine-v1.5");
    assert.ok(local.run.output.citations.includes("SYN-CASE-001-EVD-2"));
    assert.ok(local.run.output.forbiddenActions.includes("keine Nachricht senden"));

    const external = await fetch(`${app.base}/api/v1.5/capabilities/runs`, {
      method: "POST", headers: headers(), body: JSON.stringify({ caseId: "SYN-CASE-001", capability: "explain_conflict", provider: "openai", instruction: "Erkläre den belegten Widerspruch." }),
    });
    assert.equal(external.status, 409);
    const blocked = await external.json();
    assert.equal(blocked.code, "provider_gate_closed");
  } finally { await close(app.server); }
});

test("OpenAI and Mistral adapters are executable through injected, non-network test transports", async () => {
  const output = {
    status: "completed",
    headline: "Synthetischer Test",
    draft: "Nur ein strukturierter Testentwurf.",
    citations: ["E-1"],
    uncertainties: [],
    forbiddenActions: ["keine Nachricht senden"],
    proposedSteps: [{ action: "Menschlich prüfen", ownerRole: "AMAVIO Operations", humanGate: true }],
  };
  const request = {
    contractVersion: "acc.capability.v1", capability: "summarize_evidence", instruction: "Zusammenfassen",
    caseSnapshot: { id: "SYN", title: "Test", readinessLabel: "bereit", synthetic: true },
    evidence: [{ id: "E-1", label: "Beleg", assertion: "synthetisch", reviewStatus: "confirmed" }],
  };

  const openAICalls = [];
  const openAI = createProviderRegistry({
    external: { enabled: true, provider: "openai", model: "test-model", credential: "test-only", syntheticOnlyApproved: true },
    fetchImpl: async (url, options) => { openAICalls.push({ url, body: JSON.parse(options.body) }); return { ok: true, json: async () => ({ output_text: JSON.stringify(output) }) }; },
  });
  const openAIResult = await openAI.run(request, "openai");
  assert.equal(openAIResult.output.headline, "Synthetischer Test");
  assert.equal(openAICalls[0].url, "https://api.openai.com/v1/responses");
  assert.equal(openAICalls[0].body.store, false);
  assert.equal(openAICalls[0].body.text.format.type, "json_schema");

  const mistralCalls = [];
  const mistral = createProviderRegistry({
    external: { enabled: true, provider: "mistral", model: "test-model", credential: "test-only", syntheticOnlyApproved: true },
    fetchImpl: async (url, options) => { mistralCalls.push({ url, body: JSON.parse(options.body) }); return { ok: true, json: async () => ({ choices: [{ message: { content: JSON.stringify(output) } }] }) }; },
  });
  const mistralResult = await mistral.run(request, "mistral");
  assert.equal(mistralResult.output.headline, "Synthetischer Test");
  assert.equal(mistralCalls[0].url, "https://api.mistral.ai/v1/chat/completions");
  assert.equal(mistralCalls[0].body.response_format.type, "json_schema");
});
