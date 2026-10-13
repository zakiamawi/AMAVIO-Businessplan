import { EVIDENCE_RECONCILIATION_VERSION, assertSyntheticDetail, stableHash } from "./contracts.mjs";

const STATUS_WEIGHT = Object.freeze({ confirmed: 4, superseded: 3, rejected: 2, conflicting: 1, unreviewed: 0 });

export function reconcileEvidence(input, graph) {
  const detail = assertSyntheticDetail(input);
  const groups = new Map();
  for (const item of detail.evidence) {
    const key = item.conflictGroup || (item.reviewStatus === "conflicting" ? `single:${item.id}` : null);
    if (key) groups.set(key, [...(groups.get(key) || []), item]);
  }
  const conflicts = [...groups.entries()].map(([groupId, items]) => ({
    groupId,
    status: items.some((item) => item.reviewStatus === "conflicting" || item.reviewStatus === "unreviewed") ? "clarification_required" : "resolved",
    claims: items.sort((a, b) => (STATUS_WEIGHT[b.reviewStatus] || 0) - (STATUS_WEIGHT[a.reviewStatus] || 0)).map((item) => ({
      evidenceId: item.id,
      label: item.label,
      assertion: item.assertion,
      source: item.source,
      validUntil: item.validUntil,
      reviewStatus: item.reviewStatus,
    })),
  }));
  const requiredEvidence = new Set(detail.decisions.filter((item) => item.status === "open").flatMap((item) => item.requiredEvidence || []));
  const missingEvidence = detail.evidence.filter((item) => item.reviewStatus === "unreviewed" || requiredEvidence.has(item.id) && item.reviewStatus !== "confirmed").map((item) => ({
    evidenceId: item.id,
    label: item.label,
    reason: requiredEvidence.has(item.id) ? "Für eine offene Entscheidung erforderlich und noch nicht bestätigt." : "Quelle ist fachlich noch ungeprüft.",
    source: item.source,
  }));
  const unresolved = conflicts.filter((item) => item.status === "clarification_required");
  const owner = detail.tasks.find((item) => item.status !== "completed")?.ownerRole || detail.case.ownerRole || "AMAVIO Operations";
  const dueDate = detail.tasks.find((item) => item.status !== "completed")?.dueDate || detail.case.arrivalDate;
  const citations = [...new Set([...conflicts.flatMap((group) => group.claims.map((claim) => claim.evidenceId)), ...missingEvidence.map((item) => item.evidenceId)])].sort();
  const clarificationOrder = {
    title: "Prüfbarer Klärungsauftrag zur Evidenzlage",
    objective: unresolved.length ? "Widersprüchliche Aussagen quellenbezogen auflösen, bevor die Fallentscheidung verwendet wird." : "Noch ungeprüfte Pflichtbelege schließen und den belegten Zustand bestätigen.",
    ownerRole: owner,
    dueDate,
    requiredInputs: citations,
    questions: unresolved.flatMap((group) => group.claims.map((claim) => `Welche belastbare Primärquelle bestätigt oder widerlegt „${claim.assertion}“ (${claim.evidenceId})?`)),
    acceptanceCriteria: [
      "Jede strittige Aussage ist genau einer gültigen Primärquelle zugeordnet.",
      "Überholte oder widerlegte Evidenz ist ausdrücklich als ersetzt oder zurückgewiesen dokumentiert.",
      "Quelle, Gültigkeit, Prüfnotiz und menschliche Verantwortung sind vollständig.",
      "Keine Entscheidung und keine Außenwirkung erfolgt automatisch.",
    ],
    citations,
    effectMode: "advisory_only",
  };
  const coverageBase = detail.evidence.length || 1;
  const quality = {
    rubric: "amavio.evidence-reconciliation-rubric.v1",
    coverageRatio: Number(((detail.evidence.length - missingEvidence.length) / coverageBase).toFixed(2)),
    conflictGroupsInspected: conflicts.length,
    unresolvedConflictGroups: unresolved.length,
    citationCount: citations.length,
    deterministic: true,
  };
  const content = {
    contractVersion: EVIDENCE_RECONCILIATION_VERSION,
    caseId: detail.case.id,
    graphFingerprint: graph.fingerprint,
    summary: `${unresolved.length} Konfliktgruppe(n) und ${missingEvidence.length} fehlende oder ungeprüfte Belegposition(en) fachlich abgeglichen.`,
    conflicts,
    missingEvidence,
    clarificationOrder,
    boundaries: { syntheticOnly: true, automaticDecision: false, externalEffect: false },
  };
  return { content, quality, inputHash: stableHash({ contractVersion: EVIDENCE_RECONCILIATION_VERSION, caseVersion: detail.case.version, graphFingerprint: graph.fingerprint }) };
}
