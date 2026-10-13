import { randomUUID } from "node:crypto";
import { KERNEL_V2_CONTRACT_VERSION, EVIDENCE_RECONCILIATION_VERSION, CRITICAL_PATH_REPLAN_VERSION, READINESS_BRIEF_VERSION, kernelError } from "./kernel/contracts.mjs";
import { buildEvidenceGraph } from "./kernel/evidence-graph.mjs";
import { capabilityFor } from "./kernel/capability-registry.mjs";
import { evaluatePolicies } from "./kernel/policy-engine.mjs";
import { reconcileEvidence } from "./kernel/evidence-reconciliation.mjs";
import { replanCriticalPath } from "./kernel/critical-path-replanning.mjs";
import { composeReadinessBrief, READINESS_RUBRIC } from "./kernel/readiness-brief-composer.mjs";
import { createArtifact, getArtifact, installKernelArtifactStore, latestApprovedArtifact, reviewArtifact } from "./kernel/artifact-store.mjs";
import { runVerticalCapabilityEvaluation } from "./kernel/vertical-capability-evaluation.mjs";

function now() { return new Date().toISOString(); }

export function createVerticalCapabilityKernel({ db, loadCaseDetail, audit }) {
  installKernelArtifactStore(db);

  function detailFor(caseId, tenantId) {
    const detail = loadCaseDetail(db, caseId, tenantId);
    if (!detail) throw kernelError("Fall im aktiven Mandanten nicht gefunden.", "kernel_case_not_found", 404);
    return detail;
  }

  function create({ session, caseId, type, event }) {
    const detail = detailFor(caseId, session.tenantId);
    const graph = buildEvidenceGraph(detail);
    let result;
    let capabilityVersion;
    let artifactType;
    if (type === "evidence_reconciliation") {
      result = reconcileEvidence(detail, graph);
      capabilityVersion = EVIDENCE_RECONCILIATION_VERSION;
      artifactType = type;
    } else if (type === "critical_path_replan") {
      result = replanCriticalPath(detail, graph, event);
      capabilityVersion = CRITICAL_PATH_REPLAN_VERSION;
      artifactType = type;
    } else if (type === "arrival_readiness_brief") {
      const capability = capabilityFor("brief.compose");
      const policy = evaluatePolicies({ detail, graph, capability, provider: "local" });
      if (policy.outcome !== "allow") throw kernelError("Fachregelprüfung verweigert den Brief.", "kernel_policy_denied", 409);
      const reconciliation = latestApprovedArtifact(db, caseId, session.tenantId, "evidence_reconciliation");
      const replan = latestApprovedArtifact(db, caseId, session.tenantId, "critical_path_replan");
      result = composeReadinessBrief(detail, graph, policy, reconciliation, replan);
      capabilityVersion = READINESS_BRIEF_VERSION;
      artifactType = type;
    } else {
      throw kernelError("Unbekannte vertikale Capability.", "kernel_vertical_capability_unknown", 404);
    }
    const stored = createArtifact(db, {
      session, caseId, artifactType, capabilityVersion, baseCaseVersion: detail.case.version,
      graphHash: graph.fingerprint, inputHash: result.inputHash, content: result.content, quality: result.quality,
    });
    audit(db, session, `kernel.v2.${artifactType}.${stored.reproduced ? "reproduced" : "created"}`, "kernel_artifact", stored.artifact.id, { caseId, inputHash: result.inputHash, externalEffect: false });
    return stored;
  }

  function review({ session, artifactId, decision, note, version }) {
    const artifact = reviewArtifact(db, { session, artifactId, decision, note, version });
    audit(db, session, `kernel.v2.artifact.${decision}`, "kernel_artifact", artifactId, { caseId: artifact.caseId, externalEffect: false });
    return artifact;
  }

  function evaluate({ session, caseId }) {
    const detail = detailFor(caseId, session.tenantId);
    const result = runVerticalCapabilityEvaluation(detail);
    const id = `K2-EVAL-${randomUUID()}`;
    db.prepare("INSERT INTO kernel_evaluation_runs (id,tenant_id,contract_version,fixture_version,result_json,created_by,created_at) VALUES (?,?,?,?,?,?,?)")
      .run(id, session.tenantId, result.contractVersion, result.fixtureVersion, JSON.stringify(result), session.userId, now());
    audit(db, session, "kernel.v2.evaluation.completed", "kernel_evaluation", id, { total: result.total, passed: result.passed, externalCalls: 0, externalEffects: 0 });
    return { id, result };
  }

  return {
    status: () => ({
      contractVersion: KERNEL_V2_CONTRACT_VERSION,
      runtime: "local_deterministic",
      capabilities: ["evidence_reconciliation", "critical_path_replan", "arrival_readiness_brief"],
      boundaries: { syntheticOnly: true, providerIndependent: true, externalCalls: false, externalEffects: false, automaticDecisions: false, automaticApply: false },
    }),
    rubric: () => ({ contractVersion: "amavio.readiness-rubric.v1", threshold: 85, criteria: READINESS_RUBRIC }),
    create,
    artifact: (id, tenantId) => getArtifact(db, id, tenantId),
    review,
    evaluate,
  };
}

export function createVerticalCapabilityHandler({ kernel, sendJson, readBody, requireSession }) {
  return async function handleKernelV2(request, response, url) {
    if (!url.pathname.startsWith("/api/kernel/v2/")) return false;
    const session = requireSession(request, response);
    if (!session) return true;
    if (request.method === "GET" && url.pathname === "/api/kernel/v2/status") { sendJson(response, 200, kernel.status()); return true; }
    if (request.method === "GET" && url.pathname === "/api/kernel/v2/brief-rubric") { sendJson(response, 200, kernel.rubric()); return true; }
    const artifactMatch = url.pathname.match(/^\/api\/kernel\/v2\/artifacts\/([^/]+)$/);
    if (request.method === "GET" && artifactMatch) {
      const artifact = kernel.artifact(decodeURIComponent(artifactMatch[1]), session.tenantId);
      if (!artifact) throw kernelError("Kernel-Artefakt im aktiven Mandanten nicht gefunden.", "kernel_artifact_not_found", 404);
      sendJson(response, 200, { artifact }); return true;
    }
    const reconciliationMatch = url.pathname.match(/^\/api\/kernel\/v2\/cases\/([^/]+)\/evidence-reconciliations$/);
    if (request.method === "POST" && reconciliationMatch) {
      const result = kernel.create({ session, caseId: decodeURIComponent(reconciliationMatch[1]), type: "evidence_reconciliation" });
      sendJson(response, result.reproduced ? 200 : 201, result); return true;
    }
    const replanMatch = url.pathname.match(/^\/api\/kernel\/v2\/cases\/([^/]+)\/replans$/);
    if (request.method === "POST" && replanMatch) {
      const body = await readBody(request);
      const result = kernel.create({ session, caseId: decodeURIComponent(replanMatch[1]), type: "critical_path_replan", event: body.event });
      sendJson(response, result.reproduced ? 200 : 201, result); return true;
    }
    const briefMatch = url.pathname.match(/^\/api\/kernel\/v2\/cases\/([^/]+)\/readiness-briefs$/);
    if (request.method === "POST" && briefMatch) {
      const result = kernel.create({ session, caseId: decodeURIComponent(briefMatch[1]), type: "arrival_readiness_brief" });
      sendJson(response, result.reproduced ? 200 : 201, result); return true;
    }
    const reviewMatch = url.pathname.match(/^\/api\/kernel\/v2\/artifacts\/([^/]+)\/review$/);
    if (request.method === "POST" && reviewMatch) {
      const body = await readBody(request);
      const artifact = kernel.review({ session, artifactId: decodeURIComponent(reviewMatch[1]), decision: String(body.decision || ""), note: body.note, version: body.version });
      sendJson(response, 200, { artifact }); return true;
    }
    if (request.method === "POST" && url.pathname === "/api/kernel/v2/evaluations") {
      const body = await readBody(request);
      sendJson(response, 201, kernel.evaluate({ session, caseId: String(body.caseId || "") })); return true;
    }
    sendJson(response, 404, { error: "Intelligence-Kernel-V2-API-Pfad nicht gefunden." }); return true;
  };
}
