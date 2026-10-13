import { buildEvidenceGraph } from "./evidence-graph.mjs";
import { capabilityFor } from "./capability-registry.mjs";
import { evaluatePolicies } from "./policy-engine.mjs";
import { reconcileEvidence } from "./evidence-reconciliation.mjs";
import { replanCriticalPath } from "./critical-path-replanning.mjs";
import { composeReadinessBrief } from "./readiness-brief-composer.mjs";

export function runVerticalCapabilityEvaluation(detail) {
  const graph = buildEvidenceGraph(detail);
  const policy = evaluatePolicies({ detail, graph, capability: capabilityFor("brief.compose"), provider: "local" });
  const reconciliation = reconcileEvidence(detail, graph);
  const replan = replanCriticalPath(detail, graph, { type: "arrival_date_changed", effectiveDate: "2026-09-16", reason: "Synthetischer Evaluationsfall." });
  const fixture = {
    ...detail,
    simulations: detail.simulations?.length ? detail.simulations : [{ id: "SIM-EVAL-001", output: { summary: "Synthetische Terminvariante dokumentiert." } }],
    decisionHistory: detail.decisionHistory?.length ? detail.decisionHistory : [{ id: "DCS-EVAL-001", requestId: "DEC-EVAL-001", selectedOption: "Synthetische Option", rationale: "Synthetische Fachentscheidung für die Evaluation." }],
  };
  const reconciliationArtifact = { id: "REC-EVAL-001", status: "approved", content: reconciliation.content };
  const replanArtifact = { id: "RPL-EVAL-001", status: "approved", content: replan.content };
  const brief = composeReadinessBrief(fixture, graph, policy, reconciliationArtifact, replanArtifact);
  const rc = reconciliation.content;
  const rp = replan.content;
  const br = brief.content;
  const checks = [
    ["REC-01", "reconciliation", rc.contractVersion === "amavio.evidence-reconciliation.v1"],
    ["REC-02", "reconciliation", rc.caseId === detail.case.id],
    ["REC-03", "reconciliation", rc.graphFingerprint === graph.fingerprint],
    ["REC-04", "reconciliation", Array.isArray(rc.conflicts)],
    ["REC-05", "reconciliation", rc.conflicts.length > 0],
    ["REC-06", "reconciliation", rc.conflicts.every((item) => item.claims.length > 0)],
    ["REC-07", "reconciliation", Array.isArray(rc.missingEvidence)],
    ["REC-08", "reconciliation", rc.clarificationOrder.ownerRole.length > 0],
    ["REC-09", "reconciliation", rc.clarificationOrder.dueDate.length === 10],
    ["REC-10", "reconciliation", rc.clarificationOrder.acceptanceCriteria.length >= 4],
    ["REC-11", "reconciliation", rc.clarificationOrder.citations.length > 0],
    ["REC-12", "reconciliation", rc.clarificationOrder.effectMode === "advisory_only"],
    ["REC-13", "reconciliation", reconciliation.quality.deterministic === true],
    ["REC-14", "reconciliation", reconciliation.quality.coverageRatio >= 0 && reconciliation.quality.coverageRatio <= 1],
    ["REC-15", "reconciliation", reconciliation.inputHash.length === 64],
    ["REC-16", "reconciliation", rc.boundaries.externalEffect === false],
    ["RPL-01", "replanning", rp.contractVersion === "amavio.critical-path-replan.v1"],
    ["RPL-02", "replanning", rp.baseCaseVersion === detail.case.version],
    ["RPL-03", "replanning", rp.graphFingerprint === graph.fingerprint],
    ["RPL-04", "replanning", rp.event.type === "arrival_date_changed"],
    ["RPL-05", "replanning", Number.isInteger(rp.event.deltaDays)],
    ["RPL-06", "replanning", rp.proposal.changes.length > 0],
    ["RPL-07", "replanning", rp.proposal.changes.every((item) => item.from && item.to)],
    ["RPL-08", "replanning", rp.proposal.changes.every((item) => item.rationale)],
    ["RPL-09", "replanning", Array.isArray(rp.proposal.dependencyImpacts)],
    ["RPL-10", "replanning", rp.proposal.acceptanceCriteria.length >= 4],
    ["RPL-11", "replanning", rp.proposal.effectMode === "advisory_only"],
    ["RPL-12", "replanning", rp.boundaries.originalMutated === false],
    ["RPL-13", "replanning", rp.boundaries.automaticApply === false],
    ["RPL-14", "replanning", replan.quality.rationaleCoverageRatio === 1],
    ["RPL-15", "replanning", replan.quality.deterministic === true],
    ["RPL-16", "replanning", replan.inputHash.length === 64],
    ["BRF-01", "brief", br.contractVersion === "amavio.arrival-readiness-brief.v1"],
    ["BRF-02", "brief", br.caseId === detail.case.id],
    ["BRF-03", "brief", br.sections.length === 7],
    ["BRF-04", "brief", br.sections.every((item) => item.title && item.text)],
    ["BRF-05", "brief", br.sections.every((item) => Array.isArray(item.citations))],
    ["BRF-06", "brief", br.sourceRefs.includes(reconciliationArtifact.id)],
    ["BRF-07", "brief", br.sourceRefs.includes(replanArtifact.id)],
    ["BRF-08", "brief", br.provenance.graphFingerprint === graph.fingerprint],
    ["BRF-09", "brief", br.provenance.baseCaseVersion === detail.case.version],
    ["BRF-10", "brief", br.status === "internal_draft"],
    ["BRF-11", "brief", br.boundaries.sinkOnly === true],
    ["BRF-12", "brief", br.boundaries.externalEffect === false],
    ["BRF-13", "brief", brief.quality.criteria.length === 6],
    ["BRF-14", "brief", brief.quality.score === 100],
    ["BRF-15", "brief", brief.quality.outcome === "pass"],
    ["BRF-16", "brief", brief.inputHash.length === 64],
  ].map(([id, category, passed]) => ({ id, category, expected: "pass", actual: passed ? "pass" : "fail", passed: Boolean(passed) }));
  return {
    contractVersion: "amavio.vertical-capability-evaluation.v1",
    fixtureVersion: "amavio.synthetic-vertical-fixtures.v1",
    total: checks.length,
    passed: checks.filter((item) => item.passed).length,
    failed: checks.filter((item) => !item.passed).length,
    scenarios: checks,
    externalCalls: 0,
    externalEffects: 0,
  };
}
