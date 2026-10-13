import { buildEvidenceGraph } from "./evidence-graph.mjs";
import { capabilityFor, listCapabilities } from "./capability-registry.mjs";
import { createHumanGateContract } from "./human-gate.mjs";
import { evaluatePolicies, POLICY_DEFINITIONS } from "./policy-engine.mjs";
import { EVALUATION_CONTRACT_VERSION } from "./contracts.mjs";

function scenario(id, category, passed, actual, expected) {
  return { id, category, passed: Boolean(passed), actual, expected };
}

export function runKernelEvaluation(detail, providerStatus) {
  const graph = buildEvidenceGraph(detail);
  const capabilities = listCapabilities();
  const capability = capabilityFor("case.orchestrate");
  const localPolicies = evaluatePolicies({ detail, graph, capability, provider: "local" });
  const externalPolicies = evaluatePolicies({ detail, graph, capability, provider: "openai" });
  const gate = createHumanGateContract(capability);
  const scenarios = [
    scenario("GRF-01", "evidence_graph", graph.contractVersion === "amavio.evidence-graph.v1", graph.contractVersion, "amavio.evidence-graph.v1"),
    scenario("GRF-02", "evidence_graph", graph.summary.evidenceCount === detail.evidence.length, graph.summary.evidenceCount, detail.evidence.length),
    scenario("GRF-03", "evidence_graph", graph.nodes.some((item) => item.type === "case"), "case node", "case node"),
    scenario("GRF-04", "evidence_graph", graph.nodes.some((item) => item.type === "evidence"), "evidence node", "evidence node"),
    scenario("GRF-05", "evidence_graph", graph.edges.some((item) => item.relation === "contradicts"), "contradiction edge", "contradiction edge"),
    scenario("GRF-06", "evidence_graph", graph.summary.conflictCount > 0, graph.summary.conflictCount, "> 0"),
    scenario("GRF-07", "evidence_graph", /^[a-f0-9]{64}$/.test(graph.fingerprint), graph.fingerprint.length, 64),
    scenario("GRF-08", "evidence_graph", graph.summary.sourceReferenceCount >= detail.evidence.length, graph.summary.sourceReferenceCount, `>= ${detail.evidence.length}`),
    ...POLICY_DEFINITIONS.map((policy, index) => scenario(`POL-${String(index + 1).padStart(2, "0")}`, "policy_engine", localPolicies.decisions[index].outcome === "allow", localPolicies.decisions[index].outcome, "allow")),
    scenario("POL-09", "policy_engine", externalPolicies.outcome === "deny", externalPolicies.outcome, "deny"),
    scenario("POL-10", "policy_engine", externalPolicies.deniedPolicyIds.includes("POL-007"), externalPolicies.deniedPolicyIds.join(","), "POL-007"),
    ...capabilities.map((item, index) => scenario(`CAP-${String(index + 1).padStart(2, "0")}`, "capability_registry", item.effectMode === "advisory_only" && item.humanGate === "required", `${item.effectMode}/${item.humanGate}`, "advisory_only/required")),
    scenario("CAP-05", "capability_registry", capabilities.length === 4, capabilities.length, 4),
    scenario("CAP-06", "capability_registry", new Set(capabilities.map((item) => item.id)).size === capabilities.length, "unique", "unique"),
    scenario("HUM-01", "human_gate", gate.required === true, gate.required, true),
    scenario("HUM-02", "human_gate", gate.status === "pending", gate.status, "pending"),
    scenario("HUM-03", "human_gate", gate.rationaleRequired === true, gate.rationaleRequired, true),
    scenario("HUM-04", "human_gate", gate.externalEffect === false, gate.externalEffect, false),
    scenario("HUM-05", "human_gate", gate.automaticDecision === false, gate.automaticDecision, false),
    scenario("HUM-06", "human_gate", gate.prohibitedEffects.length === 5, gate.prohibitedEffects.length, 5),
    scenario("PRV-01", "provider_boundary", providerStatus.active === "local", providerStatus.active, "local"),
    scenario("PRV-02", "provider_boundary", providerStatus.networkCallsThisRun === 0, providerStatus.networkCallsThisRun, 0),
    scenario("PRV-03", "provider_boundary", providerStatus.providers.find((item) => item.id === "openai")?.activation === "gate_closed", providerStatus.providers.find((item) => item.id === "openai")?.activation, "gate_closed"),
    scenario("PRV-04", "provider_boundary", providerStatus.providers.find((item) => item.id === "mistral")?.activation === "gate_closed", providerStatus.providers.find((item) => item.id === "mistral")?.activation, "gate_closed"),
  ];
  return {
    contractVersion: EVALUATION_CONTRACT_VERSION,
    fixtureVersion: "amavio-kernel-fixtures-v1",
    total: scenarios.length,
    passed: scenarios.filter((item) => item.passed).length,
    failed: scenarios.filter((item) => !item.passed).length,
    externalCalls: 0,
    externalEffects: 0,
    scenarios,
  };
}
