import { SCHEMA_VERSION } from "./crmDomain.js";
import { seedOutreachDrafts, seedResearchItems, seedSuppressionEntries, seedTargetSegments } from "../data/seed.js";
import { createDefaultG1Governance, g1ProductOwnerDecisionContract } from "./g1Governance.js";

function alignG1ProductOwnerDecisions(governance = {}) {
  const defaults = createDefaultG1Governance();
  return {
    ...defaults,
    ...governance,
    version: defaults.version,
    approvedScope: structuredClone(defaults.approvedScope),
    productOwnerDecision: structuredClone(defaults.productOwnerDecision),
    retentionScheduleVersion: defaults.retentionScheduleVersion,
    lifecyclePolicy: structuredClone(defaults.lifecyclePolicy),
    backupPolicy: structuredClone(defaults.backupPolicy),
    incidentPlaybookStatus: defaults.incidentPlaybookStatus,
    incidentPolicy: structuredClone(defaults.incidentPolicy),
    legalAssurance: { ...defaults.legalAssurance, ...(governance?.legalAssurance || {}), productiveContactAllowed: false },
    accessAssurance: { ...defaults.accessAssurance, ...(governance?.accessAssurance || {}), productiveAccessAllowed: false },
    localEnvironmentEvidence: structuredClone(defaults.localEnvironmentEvidence),
    c1Readiness: structuredClone(defaults.c1Readiness),
    externalEvidenceRegister: structuredClone(defaults.externalEvidenceRegister),
    status: "no_go",
    releaseEligible: false,
    realDataEnabled: false,
  };
}

export function migrateToR38(input) {
  const state = structuredClone(input);
  const version = Number(state?.meta?.schemaVersion || 0);
  if (version === SCHEMA_VERSION) {
    const decisionWasMissing = state.g1Governance?.productOwnerDecision?.reference !== g1ProductOwnerDecisionContract.reference;
    const c1DecisionWasMissing = state.g1Governance?.c1Readiness?.decisionReference !== "PO-CRM-045";
    state.meta = {
      ...state.meta,
      status: "local-r3-14-c1-external-review-readiness",
      demoDate: state.meta.demoDate || "2026-10-10",
      realDataEnabled: false,
      outboundEnabled: false,
      legacyStorageKeysPreserved: [...new Set([...(state.meta.legacyStorageKeysPreserved || []), "amavio-one-crm-r3-7-g1-entry-gate-closure-v6", "amavio-one-crm-r3-6-workspaces-analytics-g1-v5", "amavio-one-crm-r3-5-operational-readiness-v5"])],
    };
    state.g1Governance = alignG1ProductOwnerDecisions(state.g1Governance);
    if (decisionWasMissing && !state.auditEvents.some((event) => event.id === "audit-g1-po-043")) {
      state.auditEvents.unshift({
        id: "audit-g1-po-043", action: "g1_product_owner_policy_decisions_recorded", entityType: "system", entityId: "g1-governance",
        summary: "Product-Owner-Arbeitsbeschlüsse für G1-01, G1-05, G1-07 und G1-09 protokolliert; G1-10 bleibt NO-GO", actorId: "usr-za", occurredAt: "2026-10-13T12:00:00.000Z", synthetic: true,
      });
    }
    if (c1DecisionWasMissing && !state.auditEvents.some((event) => event.id === "audit-c1-po-045")) {
      state.auditEvents.unshift({
        id: "audit-c1-po-045", action: "c1_partial_product_owner_decision_recorded", entityType: "system", entityId: "c1-readiness",
        summary: "C1-Betreiber, Vertretung, internes Datenschutz-Ownership, Budgetkorridor und Synthetic-only beschlossen; Security Review und Provider-/Regionsfreigabe bleiben offen", actorId: "usr-za", occurredAt: "2026-10-13T12:15:00.000Z", synthetic: true,
      });
    }
    return state;
  }
  if (version === 6) {
    state.meta = {
      ...state.meta,
      schemaVersion: SCHEMA_VERSION,
      status: "local-r3-14-c1-external-review-readiness",
      realDataEnabled: false,
      outboundEnabled: false,
      legacyStorageKeysPreserved: [...new Set([...(state.meta.legacyStorageKeysPreserved || []), "amavio-one-crm-r3-7-g1-entry-gate-closure-v6"])],
      migratedAt: new Date().toISOString(),
    };
    state.g1Governance = alignG1ProductOwnerDecisions(state.g1Governance);
    state.auditEvents.unshift({
      id: `audit-migration-${Date.now().toString(36)}`, action: "schema_migrated", entityType: "system", entityId: "local-state",
      summary: "Lokalen synthetischen Zustand von R3.7/v6 auf R3.8/v7 migriert", actorId: "usr-za", occurredAt: new Date().toISOString(), synthetic: true,
    });
    return state;
  }
  if (version === 5) {
    state.meta = {
      ...state.meta,
      schemaVersion: SCHEMA_VERSION,
      status: "local-r3-14-c1-external-review-readiness",
      realDataEnabled: false,
      outboundEnabled: false,
      legacyStorageKeysPreserved: [...new Set([...(state.meta.legacyStorageKeysPreserved || []), "amavio-one-crm-r3-6-workspaces-analytics-g1-v5", "amavio-one-crm-r3-5-operational-readiness-v5"])],
      migratedAt: new Date().toISOString(),
    };
    state.g1Governance = alignG1ProductOwnerDecisions();
    state.auditEvents.unshift({
      id: `audit-migration-${Date.now().toString(36)}`, action: "schema_migrated", entityType: "system", entityId: "local-state",
      summary: "Lokalen synthetischen Zustand von v5 auf R3.8/v7 migriert", actorId: "usr-za", occurredAt: new Date().toISOString(), synthetic: true,
    });
    return state;
  }
  if (version !== 4) throw new Error(`Nicht unterstützte lokale Schema-Version: ${version || "unbekannt"}.`);

  state.meta = {
    ...state.meta,
    schemaVersion: SCHEMA_VERSION,
    status: "local-r3-14-c1-external-review-readiness",
    demoDate: "2026-10-10",
    realDataEnabled: false,
    outboundEnabled: false,
    legacyStorageKeysPreserved: [...new Set([...(state.meta.legacyStorageKeysPreserved || []), "amavio-one-crm-r3-2-local-core-v4"])],
    migratedAt: new Date().toISOString(),
  };
  state.targetSegments = structuredClone(seedTargetSegments);
  state.researchItems = structuredClone(seedResearchItems);
  state.outreachDrafts = structuredClone(seedOutreachDrafts);
  state.suppressionEntries = structuredClone(seedSuppressionEntries);
  state.providerAdapters = [{ id: "provider-brevo-disabled", provider: "brevo", label: "Brevo – nicht verbunden", status: "disabled", dailyLimit: 0, monthlyBudgetEur: 0, externalWritesAllowed: false, synthetic: true }];
  state.costGuardrails = { dailySendLimit: 0, monthlySendLimit: 0, monthlyBudgetEur: 0, requireHumanApproval: true, stopOnBounce: true, synthetic: true, updatedAt: new Date().toISOString() };
  state.g1Governance = alignG1ProductOwnerDecisions();
  state.contacts = state.contacts.map((contact) => ({
    sourceUrl: "", sourceType: "legacy_local_synthetic", researchedAt: "", informationNoticeAt: "", objectionAt: "", unsubscribedAt: "",
    lastVerifiedAt: "", outreachEligibility: "review_required", ...contact,
  }));
  state.auditEvents.unshift({
    id: `audit-migration-${Date.now().toString(36)}`, action: "schema_migrated", entityType: "system", entityId: "local-state",
    summary: "Lokalen synthetischen Zustand von R3.2/v4 auf R3.8/v7 migriert", actorId: "usr-za", occurredAt: new Date().toISOString(), synthetic: true,
  });
  return state;
}

export const migrateToR37 = migrateToR38;
export const migrateToR35 = migrateToR38;
