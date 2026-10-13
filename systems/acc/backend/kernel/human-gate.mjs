import { HUMAN_GATE_CONTRACT_VERSION, kernelError } from "./contracts.mjs";

export function createHumanGateContract(capability) {
  return {
    contractVersion: HUMAN_GATE_CONTRACT_VERSION,
    required: true,
    status: "pending",
    reviewerRole: capability.reviewerRole,
    rationaleRequired: true,
    allowedDecisions: ["approved", "rejected"],
    approvalMeaning: "advisory_approved",
    effectMode: "advisory_only",
    externalEffect: false,
    automaticDecision: false,
    prohibitedEffects: ["message_dispatch", "booking", "payment", "person_decision", "productive_approval"],
  };
}

export function reviewHumanGate(gate, decision, note) {
  if (!gate?.required || gate.status !== "pending") throw kernelError("Human Gate ist bereits abgeschlossen oder ungültig.", "kernel_gate_closed", 409);
  if (!gate.allowedDecisions.includes(decision) || !String(note || "").trim()) {
    throw kernelError("Zulässige Prüfentscheidung und menschliche Begründung sind erforderlich.", "kernel_review_required", 400);
  }
  return {
    ...gate,
    status: decision,
    reviewNote: String(note).trim(),
    reviewed: true,
    externalEffect: false,
    effectMode: "advisory_only",
  };
}
