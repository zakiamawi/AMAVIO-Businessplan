import { READINESS_BRIEF_VERSION, READINESS_RUBRIC_VERSION, assertSyntheticDetail, kernelError, stableHash } from "./contracts.mjs";

export const READINESS_RUBRIC = Object.freeze([
  { id: "evidence_traceability", label: "Evidenz und Konflikte sind quellenbezogen nachvollziehbar", weight: 20 },
  { id: "policy_conformance", label: "Ausgelöste Fachregeln und Grenzen sind benannt", weight: 15 },
  { id: "simulation_traceability", label: "Simulation und Basisversion sind nachvollziehbar", weight: 15 },
  { id: "decision_traceability", label: "Menschliche Entscheidung ist dokumentiert", weight: 20 },
  { id: "responsibility_clarity", label: "Verantwortung, Frist und nächste Schritte sind konkret", weight: 15 },
  { id: "effect_boundary", label: "Keine Außenwirkung und keine automatische Entscheidung", weight: 15 },
]);

export function composeReadinessBrief(input, graph, policy, reconciliation, replan) {
  const detail = assertSyntheticDetail(input);
  const missing = [];
  if (!reconciliation || reconciliation.status !== "approved") missing.push("approved_evidence_reconciliation");
  if (!replan || replan.status !== "approved") missing.push("approved_critical_path_replan");
  if (!detail.simulations?.length) missing.push("documented_simulation");
  if (!detail.decisionHistory?.length) missing.push("documented_human_decision");
  if (missing.length) {
    const error = kernelError(`Arrival Readiness Brief ist noch nicht reproduzierbar. Fehlende Voraussetzungen: ${missing.join(", ")}.`, "kernel_brief_prerequisites", 422);
    error.missingPrerequisites = missing;
    throw error;
  }
  const latestSimulation = detail.simulations[0];
  const latestDecision = detail.decisionHistory[0];
  const openTasks = detail.tasks.filter((item) => item.status !== "completed");
  const triggeredRules = detail.rules.filter((item) => item.triggered);
  const sources = [...new Set([
    ...detail.evidence.map((item) => item.id),
    ...triggeredRules.map((item) => item.id),
    reconciliation.id,
    replan.id,
    latestSimulation.id,
    latestDecision.id,
  ])].sort();
  const sections = [
    { id: "readiness", title: "Operativer Bereitschaftsstand", text: `${detail.case.readinessLabel}. Phase ${detail.case.phase}; Anreise ${detail.case.arrivalDate}; Arbeitsstart ${detail.case.startDate}.`, citations: [detail.case.id] },
    { id: "evidence", title: "Evidenz und Klärungsstand", text: reconciliation.content.summary, citations: [reconciliation.id, ...reconciliation.content.clarificationOrder.citations] },
    { id: "policy", title: "Aktive Fachregeln", text: triggeredRules.length ? triggeredRules.map((item) => `${item.id}: ${item.title}`).join(" · ") : "Keine Fachregel ausgelöst.", citations: triggeredRules.map((item) => item.id) },
    { id: "simulation", title: "Simulation und kritischer Pfad", text: `${latestSimulation.output?.summary || "Simulation dokumentiert."} ${replan.content.summary}`, citations: [latestSimulation.id, replan.id] },
    { id: "decision", title: "Dokumentierte Entscheidung", text: `${latestDecision.selectedOption}. Begründung: ${latestDecision.rationale}`, citations: [latestDecision.id, latestDecision.requestId] },
    { id: "responsibility", title: "Verantwortung und nächste Schritte", text: openTasks.length ? openTasks.map((item) => `${item.ownerRole}: ${item.title} bis ${item.dueDate}`).join(" · ") : "Keine offene Aufgabe.", citations: openTasks.map((item) => item.id) },
    { id: "boundary", title: "Nutzungsgrenze", text: "Interner synthetischer Entwurf. Keine Nachricht, Buchung, Personenentscheidung, produktive Freigabe oder sonstige Außenwirkung.", citations: [policy.contractVersion] },
  ];
  const checks = {
    evidence_traceability: reconciliation.content.clarificationOrder.citations.length > 0,
    policy_conformance: policy.outcome === "allow" && policy.decisions.every((item) => item.outcome === "allow"),
    simulation_traceability: Boolean(latestSimulation.id && replan.content.baseCaseVersion),
    decision_traceability: Boolean(latestDecision.id && latestDecision.rationale),
    responsibility_clarity: openTasks.length === 0 || openTasks.every((item) => item.ownerRole && item.dueDate),
    effect_boundary: true,
  };
  const criteria = READINESS_RUBRIC.map((item) => ({ ...item, passed: checks[item.id], score: checks[item.id] ? item.weight : 0 }));
  const score = criteria.reduce((sum, item) => sum + item.score, 0);
  const quality = { contractVersion: READINESS_RUBRIC_VERSION, score, threshold: 85, outcome: score >= 85 ? "pass" : "fail", criteria, deterministic: true };
  const content = {
    contractVersion: READINESS_BRIEF_VERSION,
    caseId: detail.case.id,
    title: `Arrival Readiness Brief · ${detail.case.title}`,
    summary: `${detail.case.readinessLabel}; ${openTasks.length} offene Verantwortung(en); ${triggeredRules.length} aktive Fachregel(n).`,
    sections,
    sourceRefs: sources,
    provenance: { graphFingerprint: graph.fingerprint, policyContract: policy.contractVersion, reconciliationArtifactId: reconciliation.id, replanArtifactId: replan.id, simulationId: latestSimulation.id, decisionId: latestDecision.id, baseCaseVersion: detail.case.version },
    status: "internal_draft",
    boundaries: { syntheticOnly: true, sinkOnly: true, automaticDecision: false, externalEffect: false },
  };
  return { content, quality, inputHash: stableHash({ contractVersion: READINESS_BRIEF_VERSION, provenance: content.provenance, sourceRefs: sources }) };
}
