import { createHash } from "node:crypto";

export const KERNEL_CONTRACT_VERSION = "amavio.intelligence-kernel.v1";
export const EVIDENCE_GRAPH_VERSION = "amavio.evidence-graph.v1";
export const POLICY_CONTRACT_VERSION = "amavio.policy-decision.v1";
export const HUMAN_GATE_CONTRACT_VERSION = "amavio.human-gate.v1";
export const EVALUATION_CONTRACT_VERSION = "amavio.kernel-evaluation.v1";
export const KERNEL_V2_CONTRACT_VERSION = "amavio.intelligence-kernel.v2";
export const KERNEL_ARTIFACT_CONTRACT_VERSION = "amavio.kernel-artifact.v1";
export const EVIDENCE_RECONCILIATION_VERSION = "amavio.evidence-reconciliation.v1";
export const CRITICAL_PATH_REPLAN_VERSION = "amavio.critical-path-replan.v1";
export const READINESS_BRIEF_VERSION = "amavio.arrival-readiness-brief.v1";
export const READINESS_RUBRIC_VERSION = "amavio.readiness-rubric.v1";

export function stableValue(value) {
  if (Array.isArray(value)) return value.map(stableValue);
  if (value && typeof value === "object") {
    return Object.fromEntries(Object.keys(value).sort().map((key) => [key, stableValue(value[key])]));
  }
  return value;
}

export function stableHash(value) {
  return createHash("sha256").update(JSON.stringify(stableValue(value))).digest("hex");
}

export function assertSyntheticDetail(detail) {
  if (!detail?.case?.id || detail.case.synthetic !== true) {
    const error = new Error("Der Intelligence Kernel akzeptiert ausschließlich explizit synthetische Fall-Snapshots.");
    error.status = 422;
    error.code = "kernel_synthetic_boundary";
    throw error;
  }
  if (!Array.isArray(detail.evidence) || detail.evidence.length === 0) {
    const error = new Error("Der Intelligence Kernel benötigt mindestens einen belegten Evidenzeintrag.");
    error.status = 422;
    error.code = "kernel_evidence_required";
    throw error;
  }
  return detail;
}

export function kernelError(message, code, status = 400) {
  const error = new Error(message);
  error.code = code;
  error.status = status;
  return error;
}
