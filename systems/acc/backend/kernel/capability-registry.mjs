import { KERNEL_CONTRACT_VERSION, kernelError } from "./contracts.mjs";

const definitions = [
  {
    id: "case.orchestrate", version: "1.0.0", journeyStage: "responsibility",
    purpose: "Belegten nächsten operativen Schritt und Verantwortung ableiten.",
    providerCapability: "summarize_evidence", humanGate: "required", effectMode: "advisory_only", personDecision: false,
    reviewerRole: "AMAVIO Operations",
  },
  {
    id: "evidence.resolve_conflict", version: "1.0.0", journeyStage: "evidence",
    purpose: "Einen belegten Evidenzkonflikt erklären und sichere Klärungsschritte vorschlagen.",
    providerCapability: "explain_conflict", humanGate: "required", effectMode: "advisory_only", personDecision: false,
    reviewerRole: "AMAVIO Operations",
  },
  {
    id: "simulation.explain_impact", version: "1.0.0", journeyStage: "simulation",
    purpose: "Folgewirkungen einer isolierten Terminvariante nachvollziehbar erklären.",
    providerCapability: "explain_simulation", humanGate: "required", effectMode: "advisory_only", personDecision: false,
    reviewerRole: "AMAVIO Operations",
  },
  {
    id: "brief.compose", version: "1.0.0", journeyStage: "products",
    purpose: "Einen belegten internen Arrival-Readiness-Entwurf vorbereiten.",
    providerCapability: "draft_work_product", humanGate: "required", effectMode: "advisory_only", personDecision: false,
    reviewerRole: "AMAVIO Operations",
  },
];

const registry = new Map(definitions.map((item) => [item.id, Object.freeze({ ...item })]));

export function listCapabilities() {
  return definitions.map((item) => ({ ...item, contractVersion: KERNEL_CONTRACT_VERSION }));
}

export function capabilityFor(id) {
  const definition = registry.get(String(id || ""));
  if (!definition) throw kernelError("Capability ist im AMAVIO Intelligence Kernel nicht registriert.", "kernel_capability_unknown", 404);
  return definition;
}

export function buildProviderRequest({ capability, detail, graph, instruction }) {
  const latestSimulation = detail.simulations?.[0];
  return {
    contractVersion: "acc.capability.v1",
    capability: capability.providerCapability,
    caseSnapshot: {
      ...detail.case,
      synthetic: true,
      simulationSummary: latestSimulation?.output?.summary || null,
    },
    evidence: detail.evidence.map((item) => ({
      id: item.id, label: item.label, assertion: item.assertion, source: item.source,
      reviewStatus: item.reviewStatus, validUntil: item.validUntil, synthetic: true,
    })),
    instruction: instruction || capability.purpose,
    kernelContext: {
      contractVersion: KERNEL_CONTRACT_VERSION,
      evidenceGraphFingerprint: graph.fingerprint,
      effectMode: capability.effectMode,
      humanGate: capability.humanGate,
    },
  };
}
