import { SCHEMA_VERSION, owners, pipelineStages } from "../domain/crmDomain.js";
import { createDefaultG1Governance } from "../domain/g1Governance.js";

const createdAt = "2026-10-08T12:00:00.000Z";
const base = { synthetic: true, qualityStatus: "synthetic", dataSourceId: "source-synthetic-seed", createdAt, updatedAt: createdAt, archivedAt: null };

export const seedOrganizations = [
  ["org-101", "Klinikverbund Rhein", "Gesundheit", "Düsseldorf", "usr-za", "Pilotkorridor und Entscheidungsweg werden synthetisch geprüft."],
  ["org-102", "St. Marien Kliniken", "Gesundheit", "Köln", "usr-ls", "Standortübergreifender Pilot als synthetischer Bedarf."],
  ["org-103", "Gesundheitsverbund Süd", "Pflege", "Stuttgart", "usr-za", "Readiness-Sprint im Angebotskontext."],
  ["org-104", "Klinikum Westfalen", "Gesundheit", "Dortmund", "usr-ls", "Fachbereichsbedarf wird geprüft."],
  ["org-105", "Städtische Kliniken Nord", "Gesundheit", "Hannover", "usr-mk", "Synthetischer Entscheidungskontext."],
  ["org-106", "Hotelgruppe Westtor", "Hospitality", "Düsseldorf", "usr-za", "Erstkontakt ohne belastbaren Leistungsrahmen."],
  ["org-107", "Logistikwerk Ruhr", "Logistik", "Essen", "usr-mk", "Qualifizierter Bedarf für einen späteren Zeitraum."],
  ["org-108", "Sozialwerk Mitte", "Sozialwirtschaft", "Berlin", "usr-za", "Gewonnener synthetischer Pilot; keine ACC-Übertragung."],
].map(([id, displayName, sector, region, ownerId, notes]) => ({ id, displayName, legalName: "", sector, region, ownerId, status: "active", website: "", phone: "", notes, ...base }));

export const seedContacts = [
  ["con-101", "Anna", "Keller", "HR-Leitung", "org-101", "anna.keller@example.invalid", "+49 211 000000", "usr-za", "decision_maker"],
  ["con-102", "Jonas", "Weber", "Projektleitung International", "org-102", "jonas.weber@example.invalid", "+49 221 000000", "usr-ls", "champion"],
  ["con-103", "Sarah", "Linke", "Geschäftsführung Pflege", "org-103", "sarah.linke@example.invalid", "+49 711 000000", "usr-za", "decision_maker"],
  ["con-104", "Nils", "Berger", "Personalentwicklung", "org-104", "nils.berger@example.invalid", "+49 231 000000", "usr-ls", "specialist"],
  ["con-105", "Mara", "König", "Einkauf & Projekte", "org-105", "mara.koenig@example.invalid", "+49 511 000000", "usr-mk", "budget_contact"],
  ["con-106", "David", "Stein", "People Operations", "org-106", "david.stein@example.invalid", "+49 211 000001", "usr-za", "first_contact"],
  ["con-107", "Aylin", "Yilmaz", "Standortleitung", "org-107", "aylin.yilmaz@example.invalid", "+49 201 000000", "usr-mk", "specialist"],
  ["con-108", "Katharina", "Vogt", "Bereichsleitung", "org-108", "katharina.vogt@example.invalid", "+49 30 000000", "usr-za", "sponsor"],
].map(([id, firstName, lastName, role, organizationId, email, phone, ownerId, relationshipRole]) => ({
  id, firstName, lastName, role, organizationId, email, phone, ownerId, relationshipRole,
  contactStatus: "active", consentStatus: "unknown", consentPurpose: "", consentSource: "", consentRecordedAt: "", consentEvidenceReference: "",
  sourceUrl: "https://example.invalid/synthetische-quelle", sourceType: "synthetic_seed", researchedAt: "2026-10-08", informationNoticeAt: "",
  objectionAt: "", unsubscribedAt: "", lastVerifiedAt: "2026-10-08", outreachEligibility: "review_required", notes: "", ...base,
}));

const opportunitiesInput = [
  ["opp-101", "org-101", "Arrival-Control-Kompaktpilot", "scoping", 18500, "Entscheidungsgespräch vorbereiten", "2026-10-10", "usr-za", "high", "Direktkontakt", "con-101", "Pilotkorridor, Rollen und Standortumfang für das Entscheidungsgespräch verdichten."],
  ["opp-102", "org-102", "Standortübergreifender Pilot", "scoping", 42000, "Leistungsrahmen klären", "2026-10-12", "usr-ls", "high", "Netzwerkpartner", "con-102", "Standorte, Kohortengröße und Freigabeweg sind noch offen."],
  ["opp-103", "org-103", "Readiness Sprint", "proposal", 5900, "Angebot finalisieren", "2026-10-13", "usr-za", "medium", "Empfehlung", "con-103", "Angebotsumfang gegen den aktuellen Leistungsrahmen prüfen; Drittleistungen getrennt halten."],
  ["opp-104", "org-104", "Standort-Readiness", "qualified", 5900, "Fachbereichs-Call durchführen", "2026-10-15", "usr-ls", "medium", "Direktkontakt", "con-104", "Bedarf ist plausibel; wirtschaftliche Entscheidungsrolle verifizieren."],
  ["opp-105", "org-105", "Arrival Office", "decision", 29400, "Angebotsinhalte abstimmen", "2026-10-16", "usr-mk", "high", "Partnerhinweis", "con-105", "Entscheidungsgremium und Budgetfreigabe sind dokumentiert; Inhalte offen."],
  ["opp-106", "org-106", "Hospitality Arrival Pilot", "contact", 18500, "Bedarfsgespräch terminieren", "2026-10-18", "usr-za", "medium", "Veranstaltung", "con-106", "Erstkontakt; noch keine belastbare Aussage zu Leistungsrahmen oder Budget."],
  ["opp-107", "org-107", "Arrival-Struktur 2027", "qualified", 18500, "Standortdaten anfordern", "2026-10-20", "usr-mk", "low", "Direktkontakt", "con-107", "Qualifizierter Bedarf; Zeitachse liegt im nächsten Geschäftsjahr."],
  ["opp-108", "org-108", "Care & Retention Monitoring", "won", 34800, "Kontrollierte Übergabeprüfung vorbereiten", "2026-10-17", "usr-za", "high", "Empfehlung", "con-108", "Synthetisch gewonnen. Übergabe ist nur als lokaler Planungsmarker angelegt."],
];

export const seedOpportunities = opportunitiesInput.map(([id, organizationId, title, stageId, potential, nextAction, nextActionDue, ownerId, priority, sourceLabel, primaryContactId, note]) => ({
  id,
  organizationId,
  title,
  pipelineId: "pipe-commercial-v1",
  stageId,
  status: stageId === "won" ? "won" : "active",
  potential,
  currency: "EUR",
  nextAction,
  nextActionDue,
  ownerId,
  priority,
  sourceLabel,
  primaryContactId,
  participantContactIds: [primaryContactId],
  needSummary: stageId === "contact" ? "Bedarf muss im nächsten Gespräch belastbar qualifiziert werden." : "Synthetischer Personal- und Ankunftsbedarf ist dokumentiert.",
  contactOpenQuestion: "",
  scopeSummary: ["scoping", "proposal", "decision", "won"].includes(stageId) ? "Synthetischer AMAVIO-Leistungsrahmen und Pilotkorridor sind dokumentiert." : "",
  openQuestions: ["scoping", "proposal", "decision", "won"].includes(stageId) ? "Standortumfang und interne Freigabefolge bleiben zu prüfen." : "",
  contactException: "",
  offerContext: ["proposal", "decision", "won"].includes(stageId) ? "Synthetischer Angebotskontext ohne Versand oder Preisfreigabe." : "",
  serviceBoundary: ["proposal", "decision", "won"].includes(stageId) ? "AMAVIO-Kernleistung; Drittleistungen und externe Zusagen ausdrücklich ausgeschlossen." : "",
  potentialOpenReason: "",
  offerValidUntil: ["proposal", "decision", "won"].includes(stageId) ? "2026-11-30" : "",
  decisionRole: ["decision", "won"].includes(stageId) ? "Synthetisches Entscheidungsgremium" : "",
  decisionPath: ["decision", "won"].includes(stageId) ? "Fachprüfung → kommerzielle Freigabe → dokumentierte Entscheidung" : "",
  decisionDateWindow: ["decision", "won"].includes(stageId) ? "Oktober 2026" : "",
  wonMarker: stageId === "won",
  wonScope: stageId === "won" ? "Synthetischer Pilotumfang ohne operative ACC-Startfreigabe." : "",
  wonAt: stageId === "won" ? createdAt : null,
  closedAt: null,
  note,
  lossReason: "",
  ...base,
}));

export const seedLeads = [
  { id: "lead-101", title: "Pflegeverbund – frühes Bedarfssignal", organizationId: "org-104", organizationHint: "", contactId: "con-104", ownerId: "usr-ls", status: "qualified", sourceLabel: "Synthetischer Netzwerkhinweis", needSummary: "Möglicher Bedarf an strukturierter Ankunftsbegleitung für eine kleine synthetische Kohorte.", contactOpenQuestion: "", nextAction: "Qualifiziertes Erstgespräch vorbereiten", nextActionDue: "2026-10-22", opportunityTitle: "Ankunftsbegleitung – Qualifizierter Lead", potential: 0, priority: "medium", notes: "Nur lokaler synthetischer Konvertierungspfad.", convertedOpportunityId: "", convertedAt: null, ...base },
  { id: "lead-102", title: "Hospitality – ungeprüftes Signal", organizationId: "", organizationHint: "Hotelbetrieb Rhein-Muster", contactId: "", ownerId: "usr-za", status: "reviewing", sourceLabel: "Synthetische Veranstaltung", needSummary: "", contactOpenQuestion: "Kontaktrolle und konkreter Bedarf sind noch offen.", nextAction: "Signal fachlich prüfen", nextActionDue: "2026-10-24", opportunityTitle: "", potential: 0, priority: "low", notes: "Keine Chance, solange die Qualifizierungskriterien nicht erfüllt sind.", convertedOpportunityId: "", convertedAt: null, ...base },
];

export const seedTasks = [
  ["task-101", "Unterlagen für Entscheidungsgespräch finalisieren", "opp-101", "2026-10-10", "usr-za", "high", "open"],
  ["task-102", "Technische Fragen mit IT klären", "opp-102", "2026-10-12", "usr-ls", "high", "open"],
  ["task-103", "Angebotsgrenzen gegen Leistungsrahmen prüfen", "opp-103", "2026-10-13", "usr-za", "medium", "in_progress"],
  ["task-104", "Teilnehmer für Fachbereichs-Call bestätigen", "opp-104", "2026-10-15", "usr-ls", "medium", "open"],
  ["task-105", "Budgetpfad dokumentieren", "opp-105", "2026-10-16", "usr-mk", "high", "open"],
].map(([id, title, opportunityId, dueDate, ownerId, priority, status]) => ({ id, title, opportunityId, organizationId: seedOpportunities.find((item) => item.id === opportunityId)?.organizationId, contactId: "", dueDate, ownerId, priority, status, description: "", completedAt: null, ...base }));

export const seedActivities = [
  ["act-101", "meeting_note", "Entscheidungskorridor und offenen Leistungsrahmen dokumentiert.", "opp-101", "org-101", "con-101", "2026-10-07"],
  ["act-102", "internal_note", "Standortumfang bleibt vor dem nächsten Gespräch zu klären.", "opp-102", "org-102", "con-102", "2026-09-24"],
  ["act-103", "stage_change", "Phase geändert: Leistungsrahmen → Angebot", "opp-103", "org-103", "con-103", "2026-10-08"],
  ["act-104", "system_event", "Gewinnstatus lokal markiert; keine ACC-Übertragung.", "opp-108", "org-108", "con-108", "2026-10-08"],
].map(([id, type, summary, opportunityId, organizationId, contactId, occurredAt]) => ({ id, type, summary, opportunityId, organizationId, contactId, occurredAt, authorId: "usr-za", ...base }));

export const seedNotes = [
  { id: "note-101", title: "Entscheidungsgespräch vorbereiten", body: "Offene Punkte zum Leistungsrahmen und zum internen Freigabeweg bündeln.", visibility: "internal", occurredAt: "2026-10-08", opportunityId: "opp-101", organizationId: "org-101", contactId: "con-101", ownerId: "usr-za", ...base },
];

export const seedConversations = [
  { id: "conv-101", subject: "Qualifizierungsgespräch", occurredAt: "2026-10-07", channel: "video", summary: "Synthetischer Bedarf und Entscheidungsweg wurden eingegrenzt.", nextStep: "Leistungsrahmen schriftlich verdichten", participantContactIds: ["con-101"], opportunityId: "opp-101", organizationId: "org-101", contactId: "con-101", ownerId: "usr-za", ...base },
];

export const seedAppointments = [
  { id: "appt-101", title: "Entscheidungsgespräch", startsAt: "2026-10-16T10:00", endsAt: "2026-10-16T10:45", status: "planned", locationNote: "Synthetischer Videotermin – keine Kalenderverbindung", agenda: "Leistungsrahmen, Freigabeweg und nächster Schritt", attendeeContactIds: ["con-101"], opportunityId: "opp-101", organizationId: "org-101", contactId: "con-101", ownerId: "usr-za", ...base },
];

export const seedFollowUps = [
  { id: "follow-101", title: "Freigabeweg nachhalten", dueDate: "2026-10-12", status: "open", priority: "high", description: "Rückmeldung zum synthetischen Entscheidungskorridor prüfen.", opportunityId: "opp-101", organizationId: "org-101", contactId: "con-101", ownerId: "usr-za", completedAt: null, ...base },
];

export const seedOffers = [
  { id: "offer-101", opportunityId: "opp-103", organizationId: "org-103", versionLabel: "V1", status: "draft", amount: 5900, currency: "EUR", validUntil: "2026-10-13", scopeSummary: "Synthetischer Readiness Sprint gemäß dokumentiertem Leistungsrahmen.", boundaryNote: "Keine Versendung und keine externe Preisfreigabe.", markedSentAt: null, ...base },
];

export const seedDecisions = [
  { id: "decision-101", opportunityId: "opp-105", organizationId: "org-105", title: "Pilotfreigabe", status: "pending", decisionDate: "", decisionMakerRole: "Synthetisches Entscheidungsgremium", rationale: "Budget- und Inhaltsabstimmung stehen noch aus.", nextStep: "Angebotsinhalte abstimmen", ...base },
];

export const seedDocumentReferences = [
  { id: "docref-101", title: "Leistungsrahmen Readiness Sprint", documentType: "Arbeitsentwurf", reference: "LOCAL-REF-RS-V1", versionLabel: "V1", status: "current", confidentiality: "internal", opportunityId: "opp-103", organizationId: "org-103", contactId: "", notes: "Nur lokale Metadaten; kein Datei-Upload.", ...base },
];

export const seedSavedViews = [
  { id: "view-101", name: "Offene Wiedervorlagen", entityType: "followUps", query: "", status: "open", synthetic: true, qualityStatus: "synthetic", dataSourceId: "source-synthetic-seed", createdAt, updatedAt: createdAt, archivedAt: null },
];

export const seedPartnerOrganizations = [
  { id: "par-101", displayName: "Welcome Region NRW", category: "Standortnetzwerk", relationshipStatus: "qualified", ownerId: "usr-za", nextAction: "Kooperationsrahmen prüfen", scopeNote: "Synthetischer Partnerpfad; keine Kooperation belegt.", ...base },
  { id: "par-102", displayName: "Talent Bridge Network", category: "Fachkräftenetzwerk", relationshipStatus: "prospect", ownerId: "usr-ls", nextAction: "Qualifizierungslogik abstimmen", scopeNote: "Synthetischer Partnerpfad.", ...base },
  { id: "par-103", displayName: "Local Living Circle", category: "Wohn- & Alltagspartner", relationshipStatus: "paused", ownerId: "usr-za", nextAction: "Leistungsgrenzen dokumentieren", scopeNote: "Keine Leistungszusage.", ...base },
  { id: "par-104", displayName: "Mobility Düsseldorf", category: "Mobilität", relationshipStatus: "prospect", ownerId: "usr-mk", nextAction: "Pilotbedarf abwarten", scopeNote: "Keine Leistungszusage.", ...base },
];

export const seedPartnerContacts = [
  { id: "pcon-101", partnerOrganizationId: "par-101", firstName: "Lea", lastName: "Muster", role: "Netzwerkkoordination", email: "lea.muster@example.invalid", contactStatus: "active", ...base },
  { id: "pcon-102", partnerOrganizationId: "par-102", firstName: "Tarek", lastName: "Beispiel", role: "Partnerships", email: "tarek.beispiel@example.invalid", contactStatus: "active", ...base },
];

export const seedTargetSegments = [
  { id: "segment-101", name: "Arbeitgeber Gesundheit NRW", sector: "Gesundheit & Pflege", region: "Nordrhein-Westfalen", fitCriteria: "Arbeitgeber mit internationalem Personalbedarf und erkennbarem Ankunfts- oder Bindungsbedarf.", exclusionCriteria: "Personalvermittlung ohne Arbeitgebermandat oder unklarer Bedarf.", ownerId: "usr-za", status: "active", ...base },
];

export const seedResearchItems = [
  { id: "research-101", organizationHint: "Gesundheitszentrum Musterstadt", website: "https://example.invalid/gesundheitszentrum", sourceUrl: "https://example.invalid/gesundheitszentrum/impressum", sourceType: "public_company_website", researchedAt: "2026-10-10", researchedBy: "usr-za", ownerId: "usr-za", targetSegmentId: "segment-101", status: "reviewing", qualityStatus: "synthetic", fitScore: 72, fitNote: "Synthetischer Rechercheeintrag: Arbeitgeberprofil passt grundsätzlich; Bedarf und Ansprechpartner sind offen.", contactHint: "Personalbereich", personalDataIncluded: false, termsReviewed: false, convertedLeadId: "", ...base },
];

export const seedOutreachDrafts = [
  { id: "outreach-101", contactId: "con-101", organizationId: "org-101", ownerId: "usr-za", purpose: "Synthetische Bedarfsqualifizierung", channel: "email", subject: "Entwurf: Austausch zur Ankunftsbegleitung", body: "Guten Tag Frau Keller,\n\ndies ist ein ausschließlich synthetischer Entwurf. Es erfolgt kein Versand.\n\nFreundliche Grüße\nAMAVIO", status: "review_required", providerAdapterId: "provider-brevo-disabled", legalReviewNote: "Versandgrundlage und Kanal müssen vor jeder Außenaktion separat geprüft werden.", approvedAt: null, approvedBy: "", sentAt: null, ...base },
];

export const seedSuppressionEntries = [];

export function createSeedState() {
  return structuredClone({
    meta: { schemaVersion: SCHEMA_VERSION, synthetic: true, status: "local-r3-14-c1-external-review-readiness", demoDate: "2026-10-10", createdAt, updatedAt: createdAt, locale: "de-DE", workspaceMode: "single_internal", workspaceLabel: "AMAVIO One CRM", tenantCapable: false, externalAccess: false, realDataEnabled: false, outboundEnabled: false, legacyStorageKeysPreserved: ["amavio-one-crm-cockpit-v1", "amavio-one-crm-canonical-core-v2", "amavio-one-crm-r3-contract-alignment-v3", "amavio-one-crm-r3-2-local-core-v4", "amavio-one-crm-r3-3-owner-growth-v5", "amavio-one-crm-r3-4-founder-decision-v5", "amavio-one-crm-r3-5-operational-readiness-v5", "amavio-one-crm-r3-6-workspaces-analytics-g1-v5", "amavio-one-crm-r3-7-g1-entry-gate-closure-v6"] },
    organizations: seedOrganizations,
    contacts: seedContacts,
    partnerOrganizations: seedPartnerOrganizations,
    partnerContacts: seedPartnerContacts,
    leads: seedLeads, opportunities: seedOpportunities,
    pipelines: [{ id: "pipe-commercial-v1", name: "AMAVIO Geschäftskontakte", version: "1.0", stages: pipelineStages.map((item) => item.id), synthetic: true }],
    tasks: seedTasks, activities: seedActivities, conversations: seedConversations, appointments: seedAppointments, notes: seedNotes, documentReferences: seedDocumentReferences, offers: seedOffers, decisions: seedDecisions, followUps: seedFollowUps, savedViews: seedSavedViews,
    agingRules: { opportunityInactivityDays: 14, followUpWarningDays: 2, offerExpiryWarningDays: 7, synthetic: true, updatedAt: createdAt },
    users: owners,
    teams: [{ id: "team-amavio", name: "AMAVIO One", workspaceMode: "single_internal", roleIds: ["crm_admin", "commercial_owner", "commercial_editor", "operations_viewer", "privacy_reviewer"], synthetic: true }],
    consentRecords: [],
    targetSegments: seedTargetSegments,
    researchItems: seedResearchItems,
    outreachDrafts: seedOutreachDrafts,
    suppressionEntries: seedSuppressionEntries,
    providerAdapters: [{ id: "provider-brevo-disabled", provider: "brevo", label: "Brevo – nicht verbunden", status: "disabled", dailyLimit: 0, monthlyBudgetEur: 0, externalWritesAllowed: false, synthetic: true }],
    costGuardrails: { dailySendLimit: 0, monthlySendLimit: 0, monthlyBudgetEur: 0, requireHumanApproval: true, stopOnBounce: true, synthetic: true, updatedAt: createdAt },
    g1Governance: createDefaultG1Governance(),
    dataSources: [
      { id: "source-synthetic-seed", type: "synthetic_seed", label: "Synthetischer Demonstrationsdatensatz", synthetic: true },
      { id: "source-local-manual", type: "local_manual", label: "Lokale synthetische Eingabe", synthetic: true },
      { id: "source-local-system", type: "local_system", label: "Lokales Systemereignis", synthetic: true },
    ],
    handoffReferences: [{ id: "handoff-101", opportunityId: "opp-108", status: "review_required", contractVersion: "1.0", commercialApproval: null, operationsApproval: null, synthetic: true, qualityStatus: "synthetic", dataSourceId: "source-synthetic-seed", createdAt, updatedAt: createdAt, archivedAt: null }],
    auditEvents: [
      { id: "audit-c1-po-045", action: "c1_partial_product_owner_decision_recorded", entityType: "c1_governance", entityId: "PO-CRM-045", summary: "C1-Betreiber, Vertretung, internes Datenschutz-Ownership, Budgetkorridor und Synthetic-only beschlossen; Security Review und Provider-/Regionsfreigabe bleiben offen.", actorId: "usr-za", occurredAt: "2026-10-13T12:15:00.000Z", synthetic: true },
      { id: "audit-g1-po-043", action: "g1_product_owner_policy_decisions_recorded", entityType: "g1_governance", entityId: "PO-CRM-043", summary: "Lokale Arbeitsbeschlüsse für G1-01, G1-05, G1-07 und G1-09 protokolliert; G1-10 bleibt NO-GO.", actorId: "usr-za", occurredAt: "2026-10-13T12:00:00.000Z", synthetic: true },
      { id: "audit-101", action: "seed_loaded", entityType: "system", entityId: "local-state", summary: "Synthetischer Vertragsausgangsstand", actorId: "usr-za", occurredAt: createdAt, synthetic: true },
    ],
  });
}

export { owners, pipelineStages as stages };
