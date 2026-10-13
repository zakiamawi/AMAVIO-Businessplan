import { POLICY_CONTRACT_VERSION } from "./contracts.mjs";

export const POLICY_DEFINITIONS = Object.freeze([
  { id: "POL-001", title: "Nur synthetische Falldaten", severity: "block" },
  { id: "POL-002", title: "Mandantengebundener Kontext", severity: "block" },
  { id: "POL-003", title: "Belegpflicht für jede Ausgabe", severity: "block" },
  { id: "POL-004", title: "Menschliche Prüfung vor Nutzung", severity: "block" },
  { id: "POL-005", title: "Keine Außenwirkung", severity: "block" },
  { id: "POL-006", title: "Keine automatisierte Personenentscheidung", severity: "block" },
  { id: "POL-007", title: "Lokaler Provider als Standard", severity: "block" },
  { id: "POL-008", title: "Versionierter Capability-Vertrag", severity: "block" },
]);

export function evaluatePolicies({ detail, graph, capability, provider = "local", tenantScoped = true, humanGateRequired = true }) {
  const checks = {
    "POL-001": detail?.case?.synthetic === true,
    "POL-002": tenantScoped === true,
    "POL-003": graph?.summary?.evidenceCount > 0,
    "POL-004": humanGateRequired === true && capability?.humanGate === "required",
    "POL-005": capability?.effectMode === "advisory_only",
    "POL-006": capability?.personDecision !== true,
    "POL-007": provider === "local",
    "POL-008": typeof capability?.version === "string" && capability.version.startsWith("1."),
  };
  const decisions = POLICY_DEFINITIONS.map((definition) => ({
    ...definition,
    outcome: checks[definition.id] ? "allow" : "deny",
    reason: checks[definition.id] ? "Vertrag erfüllt." : "Vertrag nicht erfüllt; Ausführung wird geschlossen abgebrochen.",
  }));
  const denied = decisions.filter((item) => item.outcome === "deny");
  return {
    contractVersion: POLICY_CONTRACT_VERSION,
    outcome: denied.length ? "deny" : "allow",
    decisions,
    deniedPolicyIds: denied.map((item) => item.id),
    externalEffect: false,
  };
}
