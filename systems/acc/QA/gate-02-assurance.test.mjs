import test from "node:test";
import assert from "node:assert/strict";
import { mkdtempSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { createApplication } from "../backend/server.mjs";

const SESSION_ALPHA = "demo-session-alpha";
const SESSION_BETA = "demo-session-beta";
const SESSION_EMPLOYER_SPONSOR = "demo-session-employer-sponsor";
const SESSION_EMPLOYER_LOCATION = "demo-session-employer-location";
let sequence = 0;

function headers(session = SESSION_ALPHA, idempotencyKey) {
  return {
    "content-type": "application/json",
    "x-demo-session": session,
    ...(idempotencyKey ? { "idempotency-key": idempotencyKey } : {}),
  };
}

function key(prefix = "assurance") { sequence += 1; return `${prefix}-${String(sequence).padStart(6, "0")}`; }

async function start(options = {}) {
  const directory = mkdtempSync(join(tmpdir(), "amavio-acc-gate02-"));
  const databasePath = options.databasePath || join(directory, "gate02.sqlite");
  const application = createApplication({ databasePath, providerMode: "local", failureInjector: options.failureInjector });
  await new Promise((resolve) => application.server.listen(0, "127.0.0.1", resolve));
  return { ...application, base: `http://127.0.0.1:${application.server.address().port}` };
}

async function close(app) { await new Promise((resolve) => app.server.close(resolve)); }
async function json(response) { return response.json().catch(() => ({})); }

async function mutation(app, path, body, options = {}) {
  return fetch(`${app.base}${path}`, {
    method: options.method || "POST",
    headers: headers(options.session || SESSION_ALPHA, options.key || key("setup")),
    body: typeof body === "string" ? body : JSON.stringify(body),
  });
}

async function createRun(app) {
  const response = await mutation(app, "/api/v1/assistant/runs", { caseId: "SYN-CASE-001", objective: "Belegten synthetischen Arbeitsplan erstellen" });
  assert.equal(response.status, 201);
  return (await json(response)).run;
}

async function approveRun(app) {
  const run = await createRun(app);
  const response = await mutation(app, `/api/v1/assistant/runs/${run.id}/review`, { decision: "approved", note: "Synthetische Prüfung ohne Außenwirkung." });
  assert.equal(response.status, 200);
  return run;
}

async function createKernelRun(app) {
  const response = await mutation(app, "/api/kernel/v1/runs", {
    caseId: "SYN-CASE-001", capabilityId: "case.orchestrate", provider: "local",
    instruction: "Synthetischen nächsten Schritt belegt ableiten.",
  });
  assert.equal(response.status, 201);
  return (await json(response)).run;
}

async function createTwinPlan(app, eventId = "SYN-TWIN-EVT-001") {
  const response = await mutation(app, `/api/twin/v1/events/${eventId}/work-plans`, {});
  assert.equal(response.status, 201);
  return (await json(response)).plan;
}

async function createTwinSimulation(app) {
  const response = await mutation(app, "/api/twin/v1/cohort-simulations", { shiftDays: 3 });
  assert.equal(response.status, 201);
  return (await json(response)).simulation;
}

async function createLearningFeedback(app) {
  const response = await mutation(app, "/api/learning/v1/feedback", { title: "02A Lernbeobachtung", observation: "Synthetische strukturierte Beobachtung.", expectedOutcome: "Prüfbares synthetisches Outcome.", correctionType: "evaluation_gap", evidenceRefs: ["SYN-TWIN-EVT-001"] });
  assert.equal(response.status, 201);
  return (await json(response)).feedback;
}

async function createLearningEvaluation(app) {
  const response = await mutation(app, "/api/learning/v1/evaluations", {});
  assert.equal(response.status, 201);
  return (await json(response)).evaluation;
}

async function createLearningComparison(app) {
  const evaluation = await createLearningEvaluation(app);
  const response = await mutation(app, "/api/learning/v1/comparisons", { evaluationId: evaluation.id });
  assert.equal(response.status, 201);
  return (await json(response)).comparison;
}

async function createEmployerContribution(app, type = "outcome_feedback") {
  const response = await mutation(app, "/api/collaboration/v1/contributions", {
    caseId: "SYN-CASE-001",
    type,
    summary: "Synthetische Arbeitgeberrückmeldung für die 02A-Prüfung",
    detail: "Die ausschließlich synthetische Rückmeldung wird lokal und ohne Außenwirkung in AMAVIO Operations geprüft.",
  }, { session: SESSION_EMPLOYER_SPONSOR });
  assert.equal(response.status, 201);
  return (await json(response)).contribution;
}

async function createProgramAdjustment(app) {
  const response = await mutation(app, "/api/programs/v1/programs/SYN-PROG-001/simulations", { trigger: "Synthetische 02A-Programmverschiebung.", shiftDays: 7 });
  assert.equal(response.status, 201);
  return (await json(response)).adjustment;
}

async function createProgramWorkProduct(app) {
  const response = await mutation(app, "/api/programs/v1/programs/SYN-PROG-001/work-products", { type: "weekly_arrival_status" });
  assert.equal(response.status, 201);
  return (await json(response)).workProduct;
}

async function createKernelV3Run(app, route = "reconcile") {
  const response = await mutation(app, `/api/kernel/v3/programs/SYN-PROG-001/${route}`, route === "replan" ? { event: "Synthetische 02A-Programmverschiebung.", shiftDays: 7 } : {});
  assert.equal(response.status, 201);
  return (await json(response)).run;
}

async function createV2Artifact(app, type = "evidence") {
  const path = type === "evidence" ? "/api/kernel/v2/cases/SYN-CASE-001/evidence-reconciliations" : "/api/kernel/v2/cases/SYN-CASE-001/replans";
  const body = type === "evidence" ? {} : { event: { type: "arrival_date_changed", effectiveDate: "2026-09-16", reason: "Synthetische 02A-Anpassungsvorlage." } };
  const response = await mutation(app, path, body);
  assert.ok([200, 201].includes(response.status));
  return (await json(response)).artifact;
}

async function approveV2Artifact(app, artifact) {
  if (artifact.status === "approved") return artifact;
  const response = await mutation(app, `/api/kernel/v2/artifacts/${artifact.id}/review`, { decision: "approved", note: "Synthetisches Kernel-V2-Artefakt fachlich geprüft.", version: artifact.reviewVersion });
  assert.equal(response.status, 200);
  return (await json(response)).artifact;
}

async function prepareV2Brief(app) {
  const current = await detail(app);
  const decision = current.decisions.find((item) => item.status === "open");
  if (decision) {
    const decided = await mutation(app, `/api/v1.5/decisions/${decision.id}/review`, { option: decision.options[0], rationale: "Synthetische 02A-Entscheidung für den Brief." });
    assert.equal(decided.status, 201);
  }
  const refreshed = await detail(app);
  if (!refreshed.simulations.length) {
    const simulated = await mutation(app, "/api/v1.5/cases/SYN-CASE-001/simulations", { arrivalDate: "2026-09-16" });
    assert.equal(simulated.status, 201);
  }
  await approveV2Artifact(app, await createV2Artifact(app, "evidence"));
  await approveV2Artifact(app, await createV2Artifact(app, "replan"));
}

async function detail(app) {
  const response = await fetch(`${app.base}/api/v1.5/cases/SYN-CASE-001`, { headers: headers() });
  assert.equal(response.status, 200);
  return json(response);
}

async function executionDetail(app, session = SESSION_ALPHA) {
  const response = await fetch(`${app.base}/api/execution/v1/cases/SYN-CASE-001`, { headers: headers(session) });
  assert.equal(response.status, 200);
  return json(response);
}

async function prepareExecutionHandoff(app) {
  const current = await executionDetail(app);
  const first = current.orders.find((item) => item.id === "SYN-EXEC-WO-001");
  if (first.status !== "completed") {
    const response = await mutation(app, `/api/execution/v1/work-orders/${first.id}/transitions`, { status: "completed", version: first.version, note: "Synthetische Grundlage für die Übergabe nachvollziehbar abgeschlossen." });
    assert.equal(response.status, 200);
  }
  return executionDetail(app, SESSION_EMPLOYER_LOCATION);
}

async function prepareExecutionDecision(app) {
  const employer = await prepareExecutionHandoff(app);
  const handoff = employer.handoffs[0];
  if (handoff.status === "open") {
    const response = await mutation(app, `/api/execution/v1/handoffs/${handoff.id}/respond`, { decision: "acknowledged", version: handoff.version, note: "Synthetische Standortübergabe für die Entscheidung nachvollziehbar bestätigt." }, { session: SESSION_EMPLOYER_LOCATION });
    assert.equal(response.status, 200);
  }
  const current = await executionDetail(app);
  const impact = current.orders.find((item) => item.id === "SYN-EXEC-WO-003");
  if (impact.status !== "completed") {
    const response = await mutation(app, `/api/execution/v1/work-orders/${impact.id}/transitions`, { status: "completed", version: impact.version, note: "Synthetische Programm- und Arbeitsstartwirkung nachvollziehbar geprüft." });
    assert.equal(response.status, 200);
  }
  return executionDetail(app);
}

async function reliabilityScenario(app, scenarioId = "housing-handover", session = SESSION_EMPLOYER_SPONSOR) {
  const response = await fetch(`${app.base}/api/reliability/v1/scenarios/${scenarioId}`, { headers: headers(session) });
  assert.equal(response.status, 200);
  return json(response);
}

async function selectReliabilityOption(app, scenarioId = "housing-handover") {
  const current = await reliabilityScenario(app, scenarioId);
  if (current.state.intervention !== "awaiting_selection") return current;
  const option = current.options.find((item) => item.recommended);
  const response = await mutation(app, `/api/reliability/v1/scenarios/${scenarioId}/options`, { optionId: option.id, version: current.state.version }, { session: SESSION_EMPLOYER_SPONSOR });
  assert.equal(response.status, 200);
  return (await json(response)).scenario;
}

async function authorizeReliabilityIntervention(app, scenarioId = "housing-handover") {
  const current = await selectReliabilityOption(app, scenarioId);
  if (current.serviceOrder) return current;
  const response = await mutation(app, `/api/reliability/v1/scenarios/${scenarioId}/authorize`, {
    rationale: "Synthetische 02A-Intervention fachlich und menschlich bestätigt.", confirmSynthetic: true, version: current.state.version,
  }, { session: SESSION_EMPLOYER_SPONSOR });
  assert.equal(response.status, 200);
  return (await json(response)).scenario;
}

async function startReliabilityExecution(app, scenarioId = "housing-handover") {
  const current = await authorizeReliabilityIntervention(app, scenarioId);
  if (["in_execution", "completed"].includes(current.serviceOrder.status)) return current;
  const response = await mutation(app, `/api/reliability/v1/scenarios/${scenarioId}/start-execution`, { orderVersion: current.serviceOrder.version });
  assert.equal(response.status, 200);
  return (await json(response)).scenario;
}

async function completeReliabilitySteps(app, scenarioId = "housing-handover") {
  let current = await startReliabilityExecution(app, scenarioId);
  for (const step of current.serviceOrder.steps.filter((item) => item.status === "open")) {
    const response = await mutation(app, `/api/reliability/v1/scenarios/${scenarioId}/steps/${step.id}/complete`, {
      proofReference: `SYN-02A-${scenarioId}-${step.position}`,
      note: "Synthetischen Ausführungsschritt vollständig gegen die vereinbarte Abnahmebedingung geprüft.",
      stepVersion: step.version,
    });
    assert.equal(response.status, 200);
    current = (await json(response)).scenario;
  }
  return current;
}

async function completeReliabilityIntervention(app, scenarioId = "housing-handover") {
  const current = await completeReliabilitySteps(app, scenarioId);
  if (current.state.intervention === "completed") return current;
  const response = await mutation(app, `/api/reliability/v1/scenarios/${scenarioId}/complete`, {
    proofReference: `SYN-02A-${scenarioId}`,
    note: "Synthetischen Abschlussnachweis vollständig gegen die Programmlage geprüft.",
    resultSummary: "Die vereinbarte synthetische Übergabekette ist vollständig und nachvollziehbar abgeschlossen.",
    residualCondition: "Keine offene Bedingung",
    nextCheckpoint: "30-Tage-Stabilisierung",
    version: current.state.version,
  });
  assert.equal(response.status, 200);
  return (await json(response)).scenario;
}

const ROUTES = [
  { id: "health", method: "GET", public: true, prepare: async () => ({ path: "/api/health" }) },
  { id: "v1-bootstrap", method: "GET", prepare: async () => ({ path: "/api/v1/bootstrap" }) },
  { id: "v1-audit", method: "GET", prepare: async () => ({ path: "/api/v1/audit" }) },
  { id: "provider-status", method: "GET", prepare: async () => ({ path: "/api/v1.5/provider-status" }) },
  { id: "v15-bootstrap", method: "GET", prepare: async () => ({ path: "/api/v1.5/bootstrap" }) },
  { id: "portfolio", method: "GET", prepare: async () => ({ path: "/api/v1.5/portfolio" }) },
  { id: "case-detail", method: "GET", prepare: async () => ({ path: "/api/v1.5/cases/SYN-CASE-001" }) },
  { id: "kernel-status", method: "GET", prepare: async () => ({ path: "/api/kernel/v1/status" }) },
  { id: "kernel-capabilities", method: "GET", prepare: async () => ({ path: "/api/kernel/v1/capabilities" }) },
  { id: "kernel-context", method: "GET", prepare: async () => ({ path: "/api/kernel/v1/cases/SYN-CASE-001/context" }) },
  { id: "kernel-v2-status", method: "GET", prepare: async () => ({ path: "/api/kernel/v2/status" }) },
  { id: "kernel-v2-rubric", method: "GET", prepare: async () => ({ path: "/api/kernel/v2/brief-rubric" }) },
  { id: "kernel-v2-artifact", method: "GET", prepare: async (app) => { const artifact = await createV2Artifact(app, "evidence"); return { path: `/api/kernel/v2/artifacts/${artifact.id}` }; } },
  { id: "twin-bootstrap", method: "GET", prepare: async () => ({ path: "/api/twin/v1/bootstrap" }) },
  { id: "twin-event", method: "GET", prepare: async () => ({ path: "/api/twin/v1/events/SYN-TWIN-EVT-001" }) },
  { id: "twin-work-plan", method: "GET", prepare: async (app) => { const plan = await createTwinPlan(app); return { path: `/api/twin/v1/work-plans/${plan.id}` }; } },
  { id: "twin-simulation", method: "GET", prepare: async (app) => { const simulation = await createTwinSimulation(app); return { path: `/api/twin/v1/cohort-simulations/${simulation.id}` }; } },
  { id: "learning-bootstrap", method: "GET", prepare: async () => ({ path: "/api/learning/v1/bootstrap" }) },
  { id: "learning-feedback", method: "GET", prepare: async () => ({ path: "/api/learning/v1/feedback/SYN-LEARN-FB-001" }) },
  { id: "learning-evaluation", method: "GET", prepare: async (app) => { const evaluation = await createLearningEvaluation(app); return { path: `/api/learning/v1/evaluations/${evaluation.id}` }; } },
  { id: "learning-comparison", method: "GET", prepare: async (app) => { const comparison = await createLearningComparison(app); return { path: `/api/learning/v1/comparisons/${comparison.id}` }; } },
  { id: "learning-versions", method: "GET", prepare: async () => ({ path: "/api/learning/v1/versions" }) },
  { id: "collaboration-bootstrap", method: "GET", prepare: async () => ({ path: "/api/collaboration/v1/bootstrap" }) },
  { id: "program-bootstrap", method: "GET", prepare: async () => ({ path: "/api/programs/v1/bootstrap" }) },
  { id: "program-detail", method: "GET", prepare: async () => ({ path: "/api/programs/v1/programs/SYN-PROG-001" }) },
  { id: "program-work-product", method: "GET", prepare: async (app) => { const product = await createProgramWorkProduct(app); return { path: `/api/programs/v1/work-products/${product.id}` }; } },
  { id: "execution-case-detail", method: "GET", prepare: async () => ({ path: "/api/execution/v1/cases/SYN-CASE-001" }) },
  { id: "execution-program-impacts", method: "GET", prepare: async () => ({ path: "/api/execution/v1/programs/SYN-PROG-001/impacts" }) },
  { id: "kernel-v3-status", method: "GET", prepare: async () => ({ path: "/api/kernel/v3/status" }) },
  { id: "kernel-v3-context", method: "GET", prepare: async () => ({ path: "/api/kernel/v3/programs/SYN-PROG-001/context" }) },
  { id: "kernel-v3-run", method: "GET", prepare: async (app) => { const run = await createKernelV3Run(app); return { path: `/api/kernel/v3/runs/${run.id}` }; } },
  { id: "reliability-bootstrap", method: "GET", prepare: async () => ({ path: "/api/reliability/v1/bootstrap" }) },
  { id: "reliability-scenario", method: "GET", prepare: async () => ({ path: "/api/reliability/v1/scenarios/housing-handover" }) },
  { id: "reliability-work-product", method: "GET", prepare: async () => ({ path: "/api/reliability/v1/work-products/readiness-brief" }) },
  { id: "assistant-create", method: "POST", mode: "create", prepare: async () => ({ path: "/api/v1/assistant/runs", body: { caseId: "SYN-CASE-001", objective: "Synthetischen Arbeitsplan erzeugen" } }) },
  { id: "assistant-review", method: "POST", mode: "exclusive", prepare: async (app) => { const run = await createRun(app); return { path: `/api/v1/assistant/runs/${run.id}/review`, body: { decision: "approved", note: "Synthetisch geprüft." } }; } },
  { id: "outbox-preview", method: "POST", mode: "create", prepare: async (app) => { const run = await approveRun(app); return { path: "/api/v1/outbox/preview", body: { caseId: "SYN-CASE-001", runId: run.id } }; } },
  { id: "booking-preview", method: "POST", mode: "create", prepare: async (app) => { const run = await approveRun(app); return { path: "/api/v1/bookings/preview", body: { caseId: "SYN-CASE-001", runId: run.id } }; } },
  { id: "case-transition", method: "POST", mode: "exclusive", prepare: async (app) => { const current = await detail(app); return { path: "/api/v1.5/cases/SYN-CASE-001/transitions", body: { state: "active", note: "Synthetischer Statuswechsel geprüft.", version: current.case.version } }; } },
  { id: "task-update", method: "PATCH", mode: "exclusive", prepare: async (app) => { const current = await detail(app); const item = current.tasks[0]; return { path: `/api/v1.5/tasks/${item.id}`, body: { status: "completed", note: "Synthetische Aufgabe geprüft.", version: item.version } }; } },
  { id: "evidence-review", method: "POST", mode: "exclusive", prepare: async (app) => { const current = await detail(app); const item = current.evidence[1]; return { path: `/api/v1.5/evidence/${item.id}/review`, body: { status: "confirmed", note: "Synthetische Evidenz geprüft.", version: item.version } }; } },
  { id: "decision-review", method: "POST", mode: "exclusive", prepare: async (app) => { const current = await detail(app); const item = current.decisions.find((entry) => entry.status === "open"); return { path: `/api/v1.5/decisions/${item.id}/review`, body: { option: item.options[0], rationale: "Synthetische Entscheidung fachlich begründet." } }; } },
  { id: "simulation-create", method: "POST", mode: "create", prepare: async () => ({ path: "/api/v1.5/cases/SYN-CASE-001/simulations", body: { arrivalDate: "2026-09-16" } }) },
  { id: "simulation-apply", method: "POST", mode: "exclusive", prepare: async (app) => { const created = await mutation(app, "/api/v1.5/cases/SYN-CASE-001/simulations", { arrivalDate: "2026-09-16" }); assert.equal(created.status, 201); const payload = await json(created); return { path: `/api/v1.5/simulations/${payload.simulation.id}/apply`, body: { selectedChanges: ["arrivalDate"], note: "Synthetische Folgefristen geprüft." } }; } },
  { id: "work-product-create", method: "POST", mode: "create", prepare: async () => ({ path: "/api/v1.5/cases/SYN-CASE-001/work-products", body: { type: "arrival_readiness_brief" } }) },
  { id: "evaluation-create", method: "POST", mode: "create", prepare: async () => ({ path: "/api/v1.5/evaluations/runs", body: {} }) },
  { id: "capability-create", method: "POST", mode: "create", prepare: async () => ({ path: "/api/v1.5/capabilities/runs", body: { caseId: "SYN-CASE-001", capability: "explain_conflict", provider: "local", instruction: "Erkläre den synthetischen Widerspruch." } }) },
  { id: "kernel-run-create", method: "POST", mode: "create", prepare: async () => ({ path: "/api/kernel/v1/runs", body: { caseId: "SYN-CASE-001", capabilityId: "case.orchestrate", provider: "local", instruction: "Synthetischen nächsten Schritt ableiten." } }) },
  { id: "kernel-run-review", method: "POST", mode: "exclusive", prepare: async (app) => { const run = await createKernelRun(app); return { path: `/api/kernel/v1/runs/${run.id}/review`, body: { decision: "approved", note: "Kernel-Ausgabe synthetisch geprüft.", version: run.reviewVersion } }; } },
  { id: "kernel-evaluation-create", method: "POST", mode: "create", prepare: async () => ({ path: "/api/kernel/v1/evaluations", body: { caseId: "SYN-CASE-001" } }) },
  { id: "kernel-v2-reconciliation-create", method: "POST", mode: "create", prepare: async () => ({ path: "/api/kernel/v2/cases/SYN-CASE-001/evidence-reconciliations", body: {} }) },
  { id: "kernel-v2-replan-create", method: "POST", mode: "create", prepare: async () => ({ path: "/api/kernel/v2/cases/SYN-CASE-001/replans", body: { event: { type: "arrival_date_changed", effectiveDate: "2026-09-16", reason: "Synthetische 02A-Neuplanung." } } }) },
  { id: "kernel-v2-brief-create", method: "POST", mode: "create", prepare: async (app) => { await prepareV2Brief(app); return { path: "/api/kernel/v2/cases/SYN-CASE-001/readiness-briefs", body: {} }; } },
  { id: "kernel-v2-artifact-review", method: "POST", mode: "exclusive", prepare: async (app) => { const response = await mutation(app, "/api/kernel/v2/cases/SYN-CASE-001/replans", { event: { type: "arrival_date_changed", effectiveDate: "2026-09-17", reason: `Synthetische exklusive Prüfung ${key("artifact")}.` } }); assert.ok([200, 201].includes(response.status)); const artifact = (await json(response)).artifact; return { path: `/api/kernel/v2/artifacts/${artifact.id}/review`, body: { decision: "approved", note: "Synthetisches Kernel-V2-Artefakt geprüft.", version: artifact.reviewVersion } }; } },
  { id: "kernel-v2-evaluation-create", method: "POST", mode: "create", prepare: async () => ({ path: "/api/kernel/v2/evaluations", body: { caseId: "SYN-CASE-001" } }) },
  { id: "twin-work-plan-create", method: "POST", mode: "create", prepare: async () => ({ path: "/api/twin/v1/events/SYN-TWIN-EVT-001/work-plans", body: {} }) },
  { id: "twin-work-plan-review", method: "POST", mode: "exclusive", prepare: async (app) => { const plan = await createTwinPlan(app, "SYN-TWIN-EVT-005"); return { path: `/api/twin/v1/work-plans/${plan.id}/review`, body: { decision: "approved", note: "Synthetischen Twin-Arbeitsplan geprüft.", version: plan.version } }; } },
  { id: "twin-simulation-create", method: "POST", mode: "create", prepare: async () => ({ path: "/api/twin/v1/cohort-simulations", body: { shiftDays: 3 } }) },
  { id: "learning-feedback-create", method: "POST", mode: "create", prepare: async () => ({ path: "/api/learning/v1/feedback", body: { title: "Strukturierte 02A-Beobachtung", observation: "Lokale Beobachtung für den Lernzyklus.", expectedOutcome: "Outcome wird reproduzierbar geprüft.", correctionType: "evaluation_gap", evidenceRefs: ["SYN-TWIN-EVT-001"] } }) },
  { id: "learning-feedback-update", method: "PATCH", mode: "exclusive", prepare: async () => ({ path: "/api/learning/v1/feedback/SYN-LEARN-FB-003", body: { observation: "Budgetbegründung fehlt noch.", expectedOutcome: "Begründung und Evidenzreferenz werden dokumentiert.", actualOutcome: "Kandidat ergänzt beide Angaben.", correctionType: "capability_revision", evidenceRefs: ["SYN-TWIN-EVT-005"], operatorNote: "02A geprüft.", version: 1 } }) },
  { id: "learning-evaluation-create", method: "POST", mode: "create", prepare: async () => ({ path: "/api/learning/v1/evaluations", body: {} }) },
  { id: "learning-comparison-create", method: "POST", mode: "create", prepare: async (app) => { const evaluation = await createLearningEvaluation(app); return { path: "/api/learning/v1/comparisons", body: { evaluationId: evaluation.id } }; } },
  { id: "learning-version-decision", method: "POST", mode: "exclusive", prepare: async () => ({ path: "/api/learning/v1/versions/SYN-LEARN-VERSION-CAP-21/decisions", body: { comparisonId: "SYN-LEARN-COMP-004", rationale: "Synthetische Qualitätswerte und Outcomes fachlich geprüft.", version: 1 } }) },
  { id: "collaboration-contribution-create", method: "POST", mode: "create", session: SESSION_EMPLOYER_SPONSOR, prepare: async () => ({ path: "/api/collaboration/v1/contributions", body: { caseId: "SYN-CASE-001", type: "outcome_feedback", summary: "Synthetisches Arbeitgeberergebnis dokumentieren", detail: "Der synthetische Arbeitsstart wurde im lokalen Testfall ohne produktive Außenwirkung nachvollziehbar dokumentiert." } }) },
  { id: "collaboration-contribution-review", method: "POST", mode: "exclusive", prepare: async (app) => { const contribution = await createEmployerContribution(app); return { path: `/api/collaboration/v1/contributions/${contribution.id}/review`, body: { decision: "reviewed", note: "Synthetische Arbeitgeberrückmeldung fachlich geprüft und lokal eingeordnet.", includeInLearning: true } }; } },
  { id: "program-decision-review", method: "POST", mode: "exclusive", session: SESSION_EMPLOYER_SPONSOR, prepare: async () => ({ path: "/api/programs/v1/decisions/SYN-PROG-DEC-001/review", body: { version: 1, option: "Standortverteilung bestätigen", rationale: "Synthetische Programmgrundlage für die zugewiesene Arbeitgeberrolle geprüft." } }) },
  { id: "program-simulation-create", method: "POST", mode: "create", prepare: async () => ({ path: "/api/programs/v1/programs/SYN-PROG-001/simulations", body: { trigger: "Synthetisches Anreisefenster verschiebt sich.", shiftDays: 7 } }) },
  { id: "program-adjustment-review", method: "POST", mode: "exclusive", prepare: async (app) => { const adjustment = await createProgramAdjustment(app); return { path: `/api/programs/v1/adjustments/${adjustment.id}/review`, body: { version: adjustment.version, note: "Synthetische Auswirkungen und Unsicherheiten fachlich geprüft." } }; } },
  { id: "program-outcome-create", method: "POST", mode: "create", session: SESSION_EMPLOYER_SPONSOR, prepare: async () => ({ path: "/api/programs/v1/programs/SYN-PROG-001/outcomes", body: { rating: "stabil", strengths: "Gemeinsame Verantwortungen sind im Test verständlich.", challenges: "Einzelne Standortbestätigungen stehen noch aus.", currentNeed: "Eine dokumentierte Entscheidung zum synthetischen Standortplan." } }) },
  { id: "program-work-product-create", method: "POST", mode: "create", prepare: async () => ({ path: "/api/programs/v1/programs/SYN-PROG-001/work-products", body: { type: "weekly_arrival_status" } }) },
  { id: "execution-work-order-transition", method: "POST", mode: "exclusive", prepare: async (app) => { const current = await executionDetail(app); const item = current.orders.find((entry) => entry.status === "ready"); return { path: `/api/execution/v1/work-orders/${item.id}/transitions`, body: { status: "completed", version: item.version, note: "Synthetischen Arbeitsauftrag nachvollziehbar lokal abgeschlossen." } }; } },
  { id: "execution-handoff-respond", method: "POST", mode: "exclusive", session: SESSION_EMPLOYER_LOCATION, prepare: async (app) => { const current = await prepareExecutionHandoff(app); const item = current.handoffs[0]; return { path: `/api/execution/v1/handoffs/${item.id}/respond`, body: { decision: "acknowledged", version: item.version, note: "Synthetische Standortübergabe nachvollziehbar bestätigt." } }; } },
  { id: "execution-decision-review", method: "POST", mode: "exclusive", prepare: async (app) => { const current = await prepareExecutionDecision(app); const item = current.decisionPackages[0]; return { path: `/api/execution/v1/decision-packages/${item.id}/review`, body: { version: item.version, option: item.recommendation, rationale: "Vollständige synthetische Ausführungskette nachvollziehbar menschlich geprüft." } }; } },
  { id: "kernel-v3-reconcile-create", method: "POST", mode: "create", prepare: async () => ({ path: "/api/kernel/v3/programs/SYN-PROG-001/reconcile", body: {} }) },
  { id: "kernel-v3-replan-create", method: "POST", mode: "create", prepare: async () => ({ path: "/api/kernel/v3/programs/SYN-PROG-001/replan", body: { event: "Synthetische Neuplanung für 02A.", shiftDays: 7 } }) },
  { id: "kernel-v3-brief-create", method: "POST", mode: "create", prepare: async () => ({ path: "/api/kernel/v3/programs/SYN-PROG-001/briefs", body: {} }) },
  { id: "kernel-v3-run-review", method: "POST", mode: "exclusive", prepare: async (app) => { const run = await createKernelV3Run(app, "replan"); return { path: `/api/kernel/v3/runs/${run.id}/review`, body: { version: run.reviewVersion, decision: "approved", note: "Synthetische Kernel-V3-Ausgabe fachlich und nachvollziehbar geprüft." } }; } },
  { id: "kernel-v3-evaluation-create", method: "POST", mode: "create", prepare: async () => ({ path: "/api/kernel/v3/evaluations", body: { programId: "SYN-PROG-001" } }) },
  { id: "reliability-option-select", method: "POST", mode: "exclusive", session: SESSION_EMPLOYER_SPONSOR, prepare: async (app) => { const current = await reliabilityScenario(app); const option = current.options.find((item) => item.recommended); return { path: "/api/reliability/v1/scenarios/housing-handover/options", body: { optionId: option.id, version: current.state.version } }; } },
  { id: "reliability-intervention-authorize", method: "POST", mode: "exclusive", session: SESSION_EMPLOYER_SPONSOR, prepare: async (app) => { const current = await selectReliabilityOption(app); return { path: "/api/reliability/v1/scenarios/housing-handover/authorize", body: { rationale: "Synthetische 02A-Intervention fachlich und menschlich bestätigt.", confirmSynthetic: true, version: current.state.version } }; } },
  { id: "reliability-execution-start", method: "POST", mode: "exclusive", prepare: async (app) => { const current = await authorizeReliabilityIntervention(app); return { path: "/api/reliability/v1/scenarios/housing-handover/start-execution", body: { orderVersion: current.serviceOrder.version } }; } },
  { id: "reliability-step-complete", method: "POST", mode: "exclusive", prepare: async (app) => { const current = await startReliabilityExecution(app); const step = current.serviceOrder.steps.find((item) => item.status === "open"); return { path: `/api/reliability/v1/scenarios/housing-handover/steps/${step.id}/complete`, body: { proofReference: `SYN-02A-STEP-${step.position}`, note: "Synthetischen Ausführungsschritt vollständig gegen die Abnahmebedingung geprüft.", stepVersion: step.version } }; } },
  { id: "reliability-intervention-complete", method: "POST", mode: "exclusive", prepare: async (app) => { const current = await completeReliabilitySteps(app); return { path: "/api/reliability/v1/scenarios/housing-handover/complete", body: { proofReference: "SYN-02A-HOUSING", note: "Synthetischen Abschlussnachweis vollständig gegen die Programmlage geprüft.", resultSummary: "Die synthetische Übergabekette ist vollständig und nachvollziehbar abgeschlossen.", residualCondition: "Keine offene Bedingung", nextCheckpoint: "30-Tage-Stabilisierung", version: current.state.version } }; } },
  { id: "reliability-outcome-create", method: "POST", mode: "exclusive", session: SESSION_EMPLOYER_SPONSOR, prepare: async (app) => { await completeReliabilityIntervention(app); return { path: "/api/reliability/v1/scenarios/housing-handover/outcomes", body: { rating: "stabil", note: "Synthetischer Start blieb dreißig Tage ohne erneuten Handlungsbedarf stabil." } }; } },
  { id: "reliability-reset", method: "POST", mode: "create", prepare: async () => ({ path: "/api/reliability/v1/reset", body: { programId: "SYN-PROG-001" } }) },
];

const MUTATIONS = ROUTES.filter((route) => !["GET", "HEAD"].includes(route.method));

test("02A through Release P.1 registries cover all 85 API routes and all protected routes reject missing sessions", async () => {
  assert.equal(ROUTES.length, 85);
  assert.equal(MUTATIONS.length, 51);
  const app = await start();
  try {
    for (const route of ROUTES) {
      if (route.public) continue;
      const prepared = await route.prepare(app);
      const response = await fetch(`${app.base}${prepared.path}`, {
        method: route.method,
        headers: prepared.body ? { "content-type": "application/json", "idempotency-key": key("unauth") } : {},
        ...(prepared.body ? { body: JSON.stringify(prepared.body) } : {}),
      });
      assert.equal(response.status, 401, `${route.id} must require a session`);
    }
  } finally { await close(app); }
});

test("02A tenant boundaries hide Alpha resources from Beta on every resource route", async () => {
  const app = await start();
  try {
    const alphaContribution = await createEmployerContribution(app);
    const paths = [
      ["GET", "/api/v1.5/cases/SYN-CASE-001"],
      ["POST", "/api/v1/assistant/runs", { caseId: "SYN-CASE-001", objective: "Fremden Fall öffnen" }],
      ["POST", "/api/v1.5/cases/SYN-CASE-001/transitions", { state: "active", note: "Fremder Fall", version: 1 }],
      ["PATCH", "/api/v1.5/tasks/SYN-CASE-001-TASK-1", { status: "completed", note: "Fremde Aufgabe", version: 1 }],
      ["POST", "/api/v1.5/evidence/SYN-CASE-001-EVD-2/review", { status: "confirmed", note: "Fremde Evidenz", version: 1 }],
      ["POST", "/api/v1.5/decisions/SYN-CASE-001-DEC-1/review", { option: "Vertragsangabe bestätigen", rationale: "Fremde Entscheidung" }],
      ["POST", "/api/v1.5/cases/SYN-CASE-001/simulations", { arrivalDate: "2026-09-16" }],
      ["POST", "/api/v1.5/cases/SYN-CASE-001/work-products", { type: "arrival_readiness_brief" }],
      ["POST", "/api/v1.5/capabilities/runs", { caseId: "SYN-CASE-001", capability: "explain_conflict", provider: "local", instruction: "Fremden Fall erklären" }],
      ["GET", "/api/kernel/v1/cases/SYN-CASE-001/context"],
      ["POST", "/api/kernel/v1/runs", { caseId: "SYN-CASE-001", capabilityId: "case.orchestrate", provider: "local" }],
      ["POST", "/api/kernel/v1/evaluations", { caseId: "SYN-CASE-001" }],
      ["POST", "/api/kernel/v2/cases/SYN-CASE-001/evidence-reconciliations", {}],
      ["POST", "/api/kernel/v2/cases/SYN-CASE-001/replans", { event: { type: "arrival_date_changed", effectiveDate: "2026-09-16", reason: "Tenantfremde Neuplanung." } }],
      ["POST", "/api/kernel/v2/cases/SYN-CASE-001/readiness-briefs", {}],
      ["POST", "/api/kernel/v2/evaluations", { caseId: "SYN-CASE-001" }],
      ["GET", "/api/twin/v1/events/SYN-TWIN-EVT-001"],
      ["POST", "/api/twin/v1/events/SYN-TWIN-EVT-001/work-plans", {}],
      ["GET", "/api/learning/v1/feedback/SYN-LEARN-FB-001"],
      ["PATCH", "/api/learning/v1/feedback/SYN-LEARN-FB-003", { observation: "Fremde Beobachtung", expectedOutcome: "Fremdes Outcome", actualOutcome: "", correctionType: "evaluation_gap", version: 1 }],
      ["GET", "/api/learning/v1/evaluations/SYN-LEARN-EVAL-018"],
      ["GET", "/api/learning/v1/comparisons/SYN-LEARN-COMP-004"],
      ["POST", "/api/learning/v1/comparisons", { evaluationId: "SYN-LEARN-EVAL-018" }],
      ["POST", "/api/learning/v1/versions/SYN-LEARN-VERSION-CAP-21/decisions", { comparisonId: "SYN-LEARN-COMP-004", rationale: "Fremde Entscheidung", version: 1 }],
      ["POST", `/api/collaboration/v1/contributions/${alphaContribution.id}/review`, { decision: "reviewed", note: "Tenantfremde Arbeitgeberrückmeldung darf nicht geprüft werden." }],
      ["GET", "/api/programs/v1/programs/SYN-PROG-001"],
      ["POST", "/api/programs/v1/programs/SYN-PROG-001/simulations", { shiftDays: 7 }],
      ["GET", "/api/kernel/v3/programs/SYN-PROG-001/context"],
      ["POST", "/api/kernel/v3/programs/SYN-PROG-001/reconcile", {}],
      ["POST", "/api/kernel/v3/evaluations", { programId: "SYN-PROG-001" }],
      ["GET", "/api/execution/v1/cases/SYN-CASE-001"],
      ["POST", "/api/execution/v1/work-orders/SYN-EXEC-WO-001/transitions", { status: "completed", version: 1, note: "Tenantfremde Ausführung darf nicht erfolgen." }],
      ["GET", "/api/execution/v1/programs/SYN-PROG-001/impacts"],
      ["GET", "/api/reliability/v1/bootstrap"],
      ["GET", "/api/reliability/v1/scenarios/housing-handover"],
      ["POST", "/api/reliability/v1/scenarios/housing-handover/options", { optionId: "temporary-duesseldorf", version: 1 }],
      ["POST", "/api/reliability/v1/scenarios/housing-handover/start-execution", { orderVersion: 1 }],
      ["POST", "/api/reliability/v1/scenarios/housing-handover/steps/source-check/complete", { proofReference: "SYN-FREMD", note: "Tenantfremder Nachweis darf nicht angenommen werden.", stepVersion: 1 }],
    ];
    for (const [method, path, body] of paths) {
      const response = await fetch(`${app.base}${path}`, { method, headers: headers(SESSION_BETA, key("tenant")), ...(body ? { body: JSON.stringify(body) } : {}) });
      assert.equal(response.status, 404, `${method} ${path}`);
    }
    const betaPortfolio = await json(await fetch(`${app.base}/api/v1.5/portfolio`, { headers: headers(SESSION_BETA) }));
    assert.ok(betaPortfolio.cases.every((item) => item.id.startsWith("SYN-CASE-9")));
    const betaCollaboration = await json(await fetch(`${app.base}/api/collaboration/v1/bootstrap`, { headers: headers(SESSION_BETA) }));
    assert.equal(betaCollaboration.contributions.length, 0);
  } finally { await close(app); }
});

for (const route of ROUTES.filter((item) => item.method === "GET")) {
  test(`02A read-route fuzzing stays bounded for ${route.id}`, async () => {
    const app = await start();
    try {
      const prepared = await route.prepare(app);
      const separator = prepared.path.includes("?") ? "&" : "?";
      const response = await fetch(`${app.base}${prepared.path}${separator}unexpected=${encodeURIComponent("✓ 🧪 null % /")}`, {
        headers: route.public ? {} : headers(route.session || SESSION_ALPHA),
      });
      assert.ok(response.status >= 200 && response.status < 300, `${route.id}: ${response.status}`);
      assert.doesNotThrow(() => JSON.stringify(response.headers));
      await json(response);
    } finally { await close(app); }
  });
}

for (const route of MUTATIONS) {
  test(`02A idempotency is deterministic for ${route.id}`, async () => {
    const app = await start();
    try {
      const prepared = await route.prepare(app);
      const idempotencyKey = key(`idem-${route.id}`);
      const session = prepared.session || route.session || SESSION_ALPHA;
      const first = await mutation(app, prepared.path, prepared.body, { method: route.method, key: idempotencyKey, session });
      const firstBody = await json(first);
      assert.ok(first.status >= 200 && first.status < 300, `${route.id}: ${first.status} ${JSON.stringify(firstBody)}`);
      const replay = await mutation(app, prepared.path, prepared.body, { method: route.method, key: idempotencyKey, session });
      assert.equal(replay.status, first.status);
      assert.equal(replay.headers.get("idempotency-replayed"), "true");
      assert.deepEqual(await json(replay), firstBody);
      const conflict = await mutation(app, prepared.path, { ...prepared.body, _fingerprintChange: true }, { method: route.method, key: idempotencyKey, session });
      assert.equal(conflict.status, 409);
      assert.equal((await json(conflict)).code, "idempotency_conflict");
    } finally { await close(app); }
  });
}

for (const route of MUTATIONS) {
  test(`02A fuzz boundaries are green for ${route.id}`, async () => {
    const app = await start();
    try {
      const prepared = await route.prepare(app);
      const session = prepared.session || route.session || SESSION_ALPHA;
      const missing = await fetch(`${app.base}${prepared.path}`, { method: route.method, headers: headers(session), body: JSON.stringify(prepared.body) });
      assert.equal(missing.status, 428);
      assert.equal((await json(missing)).code, "idempotency_key_required");

      const malformed = await mutation(app, prepared.path, "{", { method: route.method, key: key("malformed"), session });
      assert.equal(malformed.status, 400);
      assert.equal((await json(malformed)).code, "invalid_json");

      const oversized = await mutation(app, prepared.path, JSON.stringify({ padding: "x".repeat(70_000) }), { method: route.method, key: key("oversized"), session });
      assert.equal(oversized.status, 413);
      assert.equal((await json(oversized)).code, "request_too_large");

      const schemaProbe = await mutation(app, prepared.path, {}, { method: route.method, key: key("schema-probe"), session });
      assert.ok(schemaProbe.status < 500, `${route.id}: invalid schema caused ${schemaProbe.status}`);

      const unicodeProbe = await mutation(app, prepared.path, { ...prepared.body, _unexpectedUnicode: "✓ 🧪 äöü null % /" }, { method: route.method, key: key("unicode-probe"), session });
      assert.ok(unicodeProbe.status < 500, `${route.id}: Unicode probe caused ${unicodeProbe.status}`);
    } finally { await close(app); }
  });
}

for (const route of MUTATIONS) {
  test(`02A concurrency contract is green for ${route.id}`, async () => {
    const app = await start();
    try {
      const prepared = await route.prepare(app);
      const session = prepared.session || route.session || SESSION_ALPHA;
      const calls = ["a", "b"].map((suffix) => mutation(app, prepared.path, prepared.body, { method: route.method, key: key(`race-${route.id}-${suffix}`), session }));
      const responses = await Promise.all(calls);
      const statuses = responses.map((response) => response.status).sort((a, b) => a - b);
      if (route.mode === "exclusive") {
        assert.ok(statuses[0] >= 200 && statuses[0] < 300, `${route.id}: ${statuses}`);
        assert.equal(statuses[1], 409, `${route.id}: ${statuses}`);
      } else {
        assert.ok(statuses.every((status) => status >= 200 && status < 300), `${route.id}: ${statuses}`);
      }
    } finally { await close(app); }
  });
}

for (const route of ROUTES) {
  test(`02A failure injection fails closed before ${route.id}`, async () => {
    let active = false;
    let target = "";
    const failureInjector = ({ phase, path }) => {
      if (active && phase === "before_route" && path === target) throw Object.assign(new Error("Kontrollierter 02A-Testfehler."), { status: 503, code: "injected_failure" });
    };
    const app = await start({ failureInjector });
    try {
      const prepared = await route.prepare(app);
      target = prepared.path; active = true;
      const response = await fetch(`${app.base}${prepared.path}`, {
        method: route.method,
        headers: headers(prepared.session || route.session || SESSION_ALPHA, route.method === "GET" ? undefined : key("failure")),
        ...(prepared.body ? { body: JSON.stringify(prepared.body) } : {}),
      });
      assert.equal(response.status, 503);
      assert.equal((await json(response)).code, "injected_failure");
    } finally { await close(app); }
  });
}

for (const routeId of ["decision-review", "simulation-apply"]) {
  test(`02A transaction rollback and same-key recovery are green for ${routeId}`, async () => {
    let injectBeforeCommit = true;
    const failureInjector = ({ phase, path }) => {
      if (injectBeforeCommit && phase === "before_commit" && path.includes(routeId === "decision-review" ? "/decisions/" : "/simulations/")) {
        throw Object.assign(new Error("Kontrollierter Commit-Abbruch."), { status: 503, code: "injected_commit_failure" });
      }
    };
    const app = await start({ failureInjector });
    try {
      const route = ROUTES.find((item) => item.id === routeId);
      const prepared = await route.prepare(app);
      const retryKey = key(`recovery-${routeId}`);
      const failed = await mutation(app, prepared.path, prepared.body, { method: route.method, key: retryKey });
      assert.equal(failed.status, 503);
      injectBeforeCommit = false;
      const recovered = await mutation(app, prepared.path, prepared.body, { method: route.method, key: retryKey });
      assert.ok(recovered.status >= 200 && recovered.status < 300, `${routeId}: ${recovered.status} ${JSON.stringify(await json(recovered))}`);
    } finally { await close(app); }
  });
}

test("02A idempotency result survives database restart without a duplicate", async () => {
  const directory = mkdtempSync(join(tmpdir(), "amavio-acc-gate02-restart-"));
  const databasePath = join(directory, "gate02.sqlite");
  const requestKey = "restart-proof-0001";
  const body = { caseId: "SYN-CASE-001", objective: "Wiederanlauf ohne Duplikat prüfen" };
  const firstApp = await start({ databasePath });
  let firstBody;
  try {
    const first = await mutation(firstApp, "/api/v1/assistant/runs", body, { key: requestKey });
    assert.equal(first.status, 201); firstBody = await json(first);
  } finally { await close(firstApp); }

  const secondApp = await start({ databasePath });
  try {
    const replay = await mutation(secondApp, "/api/v1/assistant/runs", body, { key: requestKey });
    assert.equal(replay.status, 201);
    assert.equal(replay.headers.get("idempotency-replayed"), "true");
    assert.deepEqual(await json(replay), firstBody);
    assert.equal(secondApp.db.prepare("SELECT COUNT(*) AS count FROM assistant_runs WHERE objective=?").get(body.objective).count, 1);
  } finally { await close(secondApp); }
});
