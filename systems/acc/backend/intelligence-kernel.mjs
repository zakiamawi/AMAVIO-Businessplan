import { randomUUID } from "node:crypto";
import { KERNEL_CONTRACT_VERSION, kernelError } from "./kernel/contracts.mjs";
import { buildEvidenceGraph } from "./kernel/evidence-graph.mjs";
import { capabilityFor, listCapabilities, buildProviderRequest } from "./kernel/capability-registry.mjs";
import { evaluatePolicies } from "./kernel/policy-engine.mjs";
import { createHumanGateContract, reviewHumanGate } from "./kernel/human-gate.mjs";
import { runKernelEvaluation } from "./kernel/evaluation-harness.mjs";

function now() { return new Date().toISOString(); }
function parse(value, fallback = {}) { try { return JSON.parse(value); } catch { return fallback; } }

export function installIntelligenceKernel(db) {
  db.exec(`
    CREATE TABLE IF NOT EXISTS kernel_runs (
      id TEXT PRIMARY KEY,
      tenant_id TEXT NOT NULL REFERENCES tenants(id),
      case_id TEXT NOT NULL REFERENCES arrival_cases(id),
      contract_version TEXT NOT NULL,
      capability_id TEXT NOT NULL,
      capability_version TEXT NOT NULL,
      provider TEXT NOT NULL,
      model TEXT NOT NULL,
      graph_hash TEXT NOT NULL,
      policy_json TEXT NOT NULL,
      output_json TEXT NOT NULL,
      gate_json TEXT NOT NULL,
      status TEXT NOT NULL CHECK (status IN ('awaiting_human_review','approved','rejected')),
      review_version INTEGER NOT NULL DEFAULT 1,
      created_by TEXT NOT NULL REFERENCES users(id),
      created_at TEXT NOT NULL,
      reviewed_by TEXT,
      reviewed_at TEXT
    );
    CREATE TABLE IF NOT EXISTS kernel_evaluation_runs (
      id TEXT PRIMARY KEY,
      tenant_id TEXT NOT NULL REFERENCES tenants(id),
      contract_version TEXT NOT NULL,
      fixture_version TEXT NOT NULL,
      result_json TEXT NOT NULL,
      created_by TEXT NOT NULL REFERENCES users(id),
      created_at TEXT NOT NULL
    );
    CREATE INDEX IF NOT EXISTS idx_kernel_runs_case ON kernel_runs(tenant_id,case_id,created_at DESC);
    CREATE INDEX IF NOT EXISTS idx_kernel_evaluations_tenant ON kernel_evaluation_runs(tenant_id,created_at DESC);
  `);
}

function serializeRun(row) {
  if (!row) return null;
  return {
    id: row.id,
    contractVersion: row.contract_version,
    caseId: row.case_id,
    capabilityId: row.capability_id,
    capabilityVersion: row.capability_version,
    provider: row.provider,
    model: row.model,
    graphHash: row.graph_hash,
    policy: parse(row.policy_json),
    output: parse(row.output_json),
    humanGate: parse(row.gate_json),
    status: row.status,
    reviewVersion: row.review_version,
    createdAt: row.created_at,
    reviewedAt: row.reviewed_at,
    externalEffect: false,
  };
}

function normalizedOutput(result, graph, capability) {
  return {
    status: result.status,
    headline: result.headline,
    narrative: result.draft,
    citations: result.citations,
    uncertainties: result.uncertainties,
    forbiddenActions: result.forbiddenActions,
    proposedSteps: result.proposedSteps,
    evidenceGraphFingerprint: graph.fingerprint,
    journeyStage: capability.journeyStage,
    effectMode: "advisory_only",
    externalEffect: false,
  };
}

function orchestrationContext(detail, graph) {
  const openTask = detail.tasks.find((item) => item.status !== "completed");
  const openDecision = detail.decisions.find((item) => item.status === "open");
  const brief = detail.workProducts.find((item) => item.product_type === "arrival_readiness_brief");
  const hasSimulation = detail.simulations.length > 0;
  const hasEvidenceIssue = graph.summary.conflictCount > 0 || graph.summary.unreviewedCount > 0;
  const recommendedStage = hasEvidenceIssue ? "evidence" : openTask ? "responsibility" : !hasSimulation ? "simulation" : openDecision ? "decision" : !brief ? "products" : "complete";
  return {
    recommendedStage,
    nextResponsibility: openTask ? {
      ownerRole: openTask.ownerRole,
      task: openTask.title,
      dueDate: openTask.dueDate,
      dependency: openTask.blockedReason || "keine harte Blockade dokumentiert",
    } : null,
    humanGate: {
      status: openDecision ? "required" : "documented",
      label: openDecision ? "Entscheidung erforderlich" : "Dokumentiert",
      deciderRole: openDecision?.deciderRole || "AMAVIO Operations",
      automaticDecision: false,
    },
    brief: {
      status: brief ? "draft_created" : "not_created",
      label: brief ? "Entwurf erstellt" : "Entwurf",
      sourceCount: brief?.sourceRefs?.length || graph.summary.sourceReferenceCount,
      effectMode: "sink_only",
    },
  };
}

export function createIntelligenceKernel({ db, providers, loadCaseDetail, audit }) {
  installIntelligenceKernel(db);

  function status() {
    return {
      contractVersion: KERNEL_CONTRACT_VERSION,
      runtime: "local_deterministic",
      modules: {
        evidenceGraph: "active",
        policyEngine: "active",
        capabilityRegistry: "active",
        evaluationHarness: "active",
        providerAdapters: "gate_closed_external",
        humanGateContract: "active",
      },
      providerStatus: providers.status(),
      boundaries: { syntheticOnly: true, externalEffects: false, automaticDecisions: false, providerCosts: false },
    };
  }

  function context(caseId, tenantId) {
    const detail = loadCaseDetail(db, caseId, tenantId);
    if (!detail) throw kernelError("Fall im aktiven Mandanten nicht gefunden.", "kernel_case_not_found", 404);
    const graph = buildEvidenceGraph(detail);
    const capability = capabilityFor("case.orchestrate");
    const policy = evaluatePolicies({ detail, graph, capability, provider: "local" });
    return {
      contractVersion: KERNEL_CONTRACT_VERSION,
      caseId,
      evidenceGraph: { contractVersion: graph.contractVersion, fingerprint: graph.fingerprint, summary: graph.summary },
      policy: { contractVersion: policy.contractVersion, outcome: policy.outcome, deniedPolicyIds: policy.deniedPolicyIds },
      orchestration: orchestrationContext(detail, graph),
      externalEffect: false,
    };
  }

  async function run({ session, caseId, capabilityId, provider = "local", instruction = "" }) {
    const detail = loadCaseDetail(db, caseId, session.tenantId);
    if (!detail) throw kernelError("Fall im aktiven Mandanten nicht gefunden.", "kernel_case_not_found", 404);
    const capability = capabilityFor(capabilityId);
    const graph = buildEvidenceGraph(detail);
    const policy = evaluatePolicies({ detail, graph, capability, provider });
    if (policy.outcome !== "allow") {
      throw kernelError(`Kernel-Policy verweigert die Ausführung: ${policy.deniedPolicyIds.join(", ")}.`, "kernel_policy_denied", 409);
    }
    const providerRequest = buildProviderRequest({ capability, detail, graph, instruction });
    const result = await providers.run(providerRequest, provider);
    const output = normalizedOutput(result.output, graph, capability);
    const humanGate = createHumanGateContract(capability);
    const id = `KRN-${randomUUID()}`;
    db.prepare(`INSERT INTO kernel_runs (
      id,tenant_id,case_id,contract_version,capability_id,capability_version,provider,model,graph_hash,
      policy_json,output_json,gate_json,status,created_by,created_at
    ) VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)`).run(
      id, session.tenantId, caseId, KERNEL_CONTRACT_VERSION, capability.id, capability.version,
      result.provider, result.model, graph.fingerprint, JSON.stringify(policy), JSON.stringify(output),
      JSON.stringify(humanGate), "awaiting_human_review", session.userId, now(),
    );
    audit(db, session, "kernel.run.created", "kernel_run", id, { caseId, capabilityId, provider: result.provider, externalEffect: false });
    return serializeRun(db.prepare("SELECT * FROM kernel_runs WHERE id=? AND tenant_id=?").get(id, session.tenantId));
  }

  function review({ session, runId, decision, note, version }) {
    const row = db.prepare("SELECT * FROM kernel_runs WHERE id=? AND tenant_id=?").get(runId, session.tenantId);
    if (!row) throw kernelError("Kernel-Lauf im aktiven Mandanten nicht gefunden.", "kernel_run_not_found", 404);
    if (row.status !== "awaiting_human_review" || Number(version) !== row.review_version) {
      throw kernelError("Kernel-Lauf wurde bereits oder parallel geprüft.", "kernel_review_conflict", 409);
    }
    const gate = reviewHumanGate(parse(row.gate_json), decision, note);
    const updated = db.prepare(`UPDATE kernel_runs SET status=?,gate_json=?,review_version=review_version+1,reviewed_by=?,reviewed_at=?
      WHERE id=? AND tenant_id=? AND status='awaiting_human_review' AND review_version=?`)
      .run(decision, JSON.stringify(gate), session.userId, now(), runId, session.tenantId, Number(version));
    if (updated.changes !== 1) throw kernelError("Kernel-Lauf wurde parallel geprüft.", "kernel_review_conflict", 409);
    audit(db, session, `kernel.run.${decision}`, "kernel_run", runId, { note: String(note).trim(), externalEffect: false });
    return serializeRun(db.prepare("SELECT * FROM kernel_runs WHERE id=? AND tenant_id=?").get(runId, session.tenantId));
  }

  function evaluate({ session, caseId }) {
    const detail = loadCaseDetail(db, caseId, session.tenantId);
    if (!detail) throw kernelError("Fall im aktiven Mandanten nicht gefunden.", "kernel_case_not_found", 404);
    const result = runKernelEvaluation(detail, providers.status());
    const id = `K-EVAL-${randomUUID()}`;
    db.prepare("INSERT INTO kernel_evaluation_runs (id,tenant_id,contract_version,fixture_version,result_json,created_by,created_at) VALUES (?,?,?,?,?,?,?)")
      .run(id, session.tenantId, result.contractVersion, result.fixtureVersion, JSON.stringify(result), session.userId, now());
    audit(db, session, "kernel.evaluation.completed", "kernel_evaluation", id, { total: result.total, passed: result.passed, externalCalls: 0 });
    return { id, result };
  }

  return { status, context, run, review, evaluate, capabilities: listCapabilities };
}

export function createIntelligenceKernelHandler({ kernel, sendJson, readBody, requireSession }) {
  return async function handleKernel(request, response, url) {
    if (!url.pathname.startsWith("/api/kernel/v1/")) return false;
    const session = requireSession(request, response);
    if (!session) return true;

    if (request.method === "GET" && url.pathname === "/api/kernel/v1/status") {
      sendJson(response, 200, kernel.status()); return true;
    }
    if (request.method === "GET" && url.pathname === "/api/kernel/v1/capabilities") {
      sendJson(response, 200, { contractVersion: KERNEL_CONTRACT_VERSION, capabilities: kernel.capabilities(), externalEffect: false }); return true;
    }
    const contextMatch = url.pathname.match(/^\/api\/kernel\/v1\/cases\/([^/]+)\/context$/);
    if (request.method === "GET" && contextMatch) {
      sendJson(response, 200, kernel.context(decodeURIComponent(contextMatch[1]), session.tenantId)); return true;
    }
    if (request.method === "POST" && url.pathname === "/api/kernel/v1/runs") {
      const body = await readBody(request);
      const run = await kernel.run({
        session,
        caseId: String(body.caseId || ""),
        capabilityId: String(body.capabilityId || ""),
        provider: String(body.provider || "local"),
        instruction: String(body.instruction || "").trim().slice(0, 1_500),
      });
      sendJson(response, 201, { run }); return true;
    }
    const reviewMatch = url.pathname.match(/^\/api\/kernel\/v1\/runs\/([^/]+)\/review$/);
    if (request.method === "POST" && reviewMatch) {
      const body = await readBody(request);
      const run = kernel.review({ session, runId: decodeURIComponent(reviewMatch[1]), decision: String(body.decision || ""), note: body.note, version: body.version });
      sendJson(response, 200, { run }); return true;
    }
    if (request.method === "POST" && url.pathname === "/api/kernel/v1/evaluations") {
      const body = await readBody(request);
      const evaluation = kernel.evaluate({ session, caseId: String(body.caseId || "") });
      sendJson(response, 201, evaluation); return true;
    }
    sendJson(response, 404, { error: "Intelligence-Kernel-API-Pfad nicht gefunden." }); return true;
  };
}
