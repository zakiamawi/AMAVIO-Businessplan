import { EVIDENCE_GRAPH_VERSION, assertSyntheticDetail, stableHash } from "./contracts.mjs";

function node(id, type, label, state, source = null) {
  return { id, type, label, state, ...(source ? { source } : {}) };
}

function edge(from, to, relation, blocking = false) {
  return { id: `${from}:${relation}:${to}`, from, to, relation, blocking };
}

export function buildEvidenceGraph(input) {
  const detail = assertSyntheticDetail(input);
  const caseId = detail.case.id;
  const nodes = [node(caseId, "case", detail.case.title, detail.case.readiness)];
  const edges = [];

  for (const item of detail.evidence) {
    nodes.push(node(item.id, "evidence", item.label, item.reviewStatus, item.source));
    const relation = item.reviewStatus === "conflicting" ? "contradicts" : item.reviewStatus === "confirmed" ? "supports" : "requires_review";
    edges.push(edge(item.id, caseId, relation, relation !== "supports"));
  }
  for (const item of detail.tasks) {
    nodes.push(node(item.id, "task", item.title, item.status));
    edges.push(edge(item.id, caseId, "advances", item.status === "blocked"));
  }
  for (const item of detail.milestones) {
    nodes.push(node(item.id, "milestone", item.title, item.status));
    edges.push(edge(item.id, caseId, "milestone_for", item.critical && item.status === "blocked"));
  }
  for (const item of detail.dependencies) {
    edges.push(edge(item.predecessorId, item.successorId, item.type || "depends_on", item.hard === true));
  }
  for (const item of detail.decisions) {
    nodes.push(node(item.id, "decision", item.question, item.status));
    edges.push(edge(item.id, caseId, "gates", item.status === "open"));
    for (const evidenceId of item.requiredEvidence || []) edges.push(edge(evidenceId, item.id, "required_for", true));
  }
  for (const item of detail.rules) {
    nodes.push(node(item.id, "policy_signal", item.title, item.triggered ? "triggered" : "clear"));
    if (item.triggered) edges.push(edge(item.id, caseId, "constrains", true));
  }

  nodes.sort((a, b) => a.id.localeCompare(b.id, "de"));
  edges.sort((a, b) => a.id.localeCompare(b.id, "de"));
  const conflicts = detail.evidence.filter((item) => item.reviewStatus === "conflicting").map((item) => item.id);
  const unreviewed = detail.evidence.filter((item) => item.reviewStatus === "unreviewed").map((item) => item.id);
  const blockedEdges = edges.filter((item) => item.blocking).map((item) => item.id);
  const graph = {
    contractVersion: EVIDENCE_GRAPH_VERSION,
    caseId,
    synthetic: true,
    nodes,
    edges,
    summary: {
      nodeCount: nodes.length,
      edgeCount: edges.length,
      sourceReferenceCount: detail.evidence.length + detail.rules.filter((item) => item.triggered).length,
      evidenceCount: detail.evidence.length,
      conflictCount: conflicts.length,
      unreviewedCount: unreviewed.length,
      blockedRelationCount: blockedEdges.length,
      conflicts,
      unreviewed,
    },
  };
  return { ...graph, fingerprint: stableHash(graph) };
}
