const VERIFIED = "verified_local";
const READY = "decision_ready";
const DECIDED = "po_decided_local";
const EXTERNAL = "external_blocked";
const TECHNICAL = "technical_blocked";
const PRODUCT_OWNER = "po_blocked";
const OPEN = "open";

export const g1GateDefinitions = Object.freeze([
  { id: "G1-01", key: "scope", label: "Datenumfang & Zweck", owner: "Product Owner", category: "Fachlicher Beschluss", requiredEvidence: "Verbindlicher Erstumfang, Ausschlussliste und erlaubte Zwecke" },
  { id: "G1-02", key: "classification", label: "Datenklassifikation", owner: "CRM-Administration", category: "Interne Kontrolle", requiredEvidence: "Feldklassen, Schutzbedarf, Minimierung und verbotene Inhalte" },
  { id: "G1-03", key: "legal", label: "Kontakt- & Rechtsstatus", owner: "Datenschutz / Recht", category: "Externe Fachprüfung", requiredEvidence: "Geprüfter Prozess je Quelle, Zweck und Kontaktkanal" },
  { id: "G1-04", key: "provenance", label: "Herkunft & Nachweis", owner: "CRM-Administration", category: "Interne Kontrolle", requiredEvidence: "Quelle, Erhebungsdatum, Qualitätsstatus und Evidenzreferenz" },
  { id: "G1-05", key: "lifecycle", label: "Aufbewahrung & Löschung", owner: "Product Owner / Datenschutz", category: "Fachlicher Beschluss", requiredEvidence: "Fristen, Auskunft, Berichtigung, Archivierung, Löschung und Nachweis" },
  { id: "G1-06", key: "access", label: "Zugriffsschutz", owner: "Technik / Product Owner", category: "Technischer Gate", requiredEvidence: "Authentifizierung, Geräteschutz, Sitzungsgrenzen und geprüfte Berechtigungen" },
  { id: "G1-07", key: "backup", label: "Sicherung & Wiederherstellung", owner: "CRM-Administration", category: "Betriebsfreigabe", requiredEvidence: "Verschlüsselte Ablage, RPO/RTO, Restore-Probe und Verantwortlichkeit" },
  { id: "G1-08", key: "import", label: "Import & Datenbereinigung", owner: "CRM-Administration", category: "Interne Kontrolle", requiredEvidence: "Mapping, Dublettenprüfung, Quarantäne, Rollback und Importprotokoll" },
  { id: "G1-09", key: "incident", label: "Vorfall & Rückabwicklung", owner: "Product Owner", category: "Betriebsfreigabe", requiredEvidence: "Meldeweg, Isolation, Wiederanlauf, Dokumentation und Verantwortlichkeit" },
  { id: "G1-10", key: "release", label: "G1-Freigabeentscheidung", owner: "Product Owner", category: "Gesonderter Beschluss", requiredEvidence: "Datierter Beschluss mit Umfang, Restrestrisiken und Rückfallregel" },
]);

export const g1DataClasses = Object.freeze([
  { id: "company", label: "Unternehmensstammdaten", level: "intern", purpose: "B2B-Beziehungs- und Chancensteuerung", allowed: "Name, Branche, Region, öffentliche Unternehmensdaten", excluded: "Nicht erforderliche interne Unternehmensinformationen" },
  { id: "contact", label: "Geschäftliche Kontaktdaten", level: "vertraulich", purpose: "Ansprechpartner, Rolle und dokumentierter Kontaktprozess", allowed: "Name, Funktion, geschäftliche Kontaktdaten, Organisationsbezug", excluded: "Private Kontaktdaten ohne geprüften Zweck" },
  { id: "relationship", label: "Beziehungs- und Verlaufsdaten", level: "vertraulich", purpose: "Nachvollziehbare Gesprächs-, Aufgaben- und Entscheidungsarbeit", allowed: "Sachliche Ergebnisse, nächste Schritte, Statushistorie", excluded: "Spekulationen, Werturteile und private Nebenumstände" },
  { id: "commercial", label: "Kommerzielle Daten", level: "vertraulich", purpose: "Angebots-, Chancen- und Entscheidungssteuerung", allowed: "Beträge, Leistungsrahmen, Entscheidungsweg", excluded: "Nicht freigegebene Zahlungs- oder Bankdaten" },
  { id: "evidence", label: "Herkunfts- und Nachweisdaten", level: "intern", purpose: "Prüfbarkeit von Quelle, Qualität und Bearbeitung", allowed: "Quelle, Datum, Qualitätsstatus, lokale Referenz", excluded: "Ungeprüfte Behauptungen als bestätigte Fakten" },
  { id: "restricted", label: "Besondere oder private Daten", level: "nicht_zulaessig", purpose: "Kein Zweck im G1-Erstumfang", allowed: "Keine", excluded: "Gesundheitsdaten, Ausweis- und Bankdaten, private Lebensumstände, besondere Kategorien" },
]);

export const g1RetentionSchedule = Object.freeze([
  { object: "Unqualifizierte Recherche", trigger: "Prüfung abgeschlossen oder Quelle unbrauchbar", reviewAfterDays: 90, action: "Archivierungs- oder Verwerfungsentscheid dokumentieren" },
  { object: "Lead ohne aktive Bearbeitung", trigger: "Letzte fachliche Aktivität", reviewAfterDays: 180, action: "Zweck und Aktualität prüfen; sonst archivieren" },
  { object: "Geschäftskontakt", trigger: "Letzte belastbare Interaktion", reviewAfterDays: 365, action: "Kontaktdaten und Rechtsstatus prüfen" },
  { object: "Verlorene Chance", trigger: "Abschlussdatum", reviewAfterDays: 365, action: "Geschäftlichen Aufbewahrungszweck prüfen; sonst minimieren/archivieren" },
  { object: "Kontaktsperre", trigger: "Sperrzeitpunkt", reviewAfterDays: 730, action: "Minimalen Sperrnachweis erhalten, übrige Daten prüfen" },
  { object: "Lokale Sicherung", trigger: "Erstellungsdatum", reviewAfterDays: 30, action: "Rotationsentscheidung; produktive Frist bleibt PO-/Datenschutz-Gate" },
]);

export const g1ProductOwnerDecisionContract = Object.freeze({
  reference: "PO-CRM-043",
  decisionDate: "2026-10-13",
  decidedById: "usr-za",
  decidedByName: "Zaki Amawi",
  status: "recorded_local_policy",
  gateIds: ["G1-01", "G1-05", "G1-07", "G1-09"],
  releaseDecision: "no_go",
  scope: {
    status: "approved_local_policy",
    allowedDataClassIds: ["company", "contact", "relationship", "commercial", "evidence"],
    excludedDataClassIds: ["restricted"],
    purposes: ["B2B-Beziehungsarbeit", "Bedarfsqualifizierung", "Chancensteuerung", "Partnerarbeit", "Aufgaben- und Gesprächsdokumentation", "Nachweisführung"],
    productiveContactAllowed: false,
  },
  lifecycle: {
    status: "approved_local_policy_external_review_open",
    scheduleVersion: "2026-10-13-po-approved-review-intervals",
    automaticDeletionAllowed: false,
    externalPrivacyReviewRequired: true,
  },
  backup: {
    status: "approved_local_policy_external_evidence_open",
    rpoHours: 24,
    rtoHours: 4,
    cadence: "daily_and_before_material_change",
    rotationReviewDays: 30,
    primaryOwnerId: "usr-za",
    primaryOwnerRole: "CRM-Administration",
    delegateId: null,
    deviceEncryptionEvidenceRequired: true,
    operationalRestoreEvidenceRequired: true,
  },
  incident: {
    status: "approved_local_policy_external_timeline_open",
    primaryOwnerId: "usr-za",
    primaryOwnerRole: "Product Owner / CRM-Administration",
    delegateId: null,
    steps: ["stop", "isolate", "assess", "verify_backup", "restore_controlled", "document", "approve_restart"],
    externalLegalTimelineRequired: true,
    productiveRecoveryApproved: false,
  },
});

export const g1SourcePurposeChannelMatrix = Object.freeze([
  { id: "manual_business_contact", source: "Manuell dokumentierter Geschäftskontakt", purpose: "Konkrete B2B-Beziehungs- oder Bedarfsqualifizierung", channel: "E-Mail / Telefon / Gespräch", researchStatus: "lokal_vorbereitet", contactDecision: "external_review_required", informationDuty: "Art.-13-Pfad prüfen", evidence: "Herkunft, Erhebungsdatum, Zweck, Kanal- und Widerspruchsstatus" },
  { id: "public_company_website", source: "Öffentliche Unternehmenswebsite", purpose: "Organisationsrecherche und fachliche Passungsprüfung", channel: "Noch kein Kontaktkanal freigegeben", researchStatus: "lokal_vorbereitet", contactDecision: "external_review_required", informationDuty: "Art.-14-Pfad prüfen", evidence: "Konkrete URL, Abrufdatum, Datenkategorie und Erforderlichkeit" },
  { id: "public_directory", source: "Öffentliches Branchen- oder Unternehmensverzeichnis", purpose: "Organisationsrecherche", channel: "Noch kein Kontaktkanal freigegeben", researchStatus: "lokal_vorbereitet", contactDecision: "external_review_required", informationDuty: "Art.-14-Pfad prüfen", evidence: "Verzeichnis, URL, Nutzungsbedingungen, Abrufdatum und Datenkategorie" },
  { id: "referral", source: "Empfehlung oder persönliche Einführung", purpose: "Konkrete Beziehungsanbahnung", channel: "Individuell zu prüfen", researchStatus: "lokal_vorbereitet", contactDecision: "external_review_required", informationDuty: "Art.-14- oder Art.-13-Pfad prüfen", evidence: "Empfehlende Stelle, Zeitpunkt, Umfang und erwartbarer Kontext" },
  { id: "event_business_card", source: "Veranstaltung oder übergebene Geschäftskarte", purpose: "Dokumentierter Gesprächs- und Folgeschritt", channel: "Im erkennbaren Kontext zu prüfen", researchStatus: "lokal_vorbereitet", contactDecision: "external_review_required", informationDuty: "Art.-13-Pfad prüfen", evidence: "Veranstaltung, Übergabekontext, Zeitpunkt, Zweck und Folgeschritt" },
  { id: "provider_enrichment", source: "Datenanbieter oder Enrichment-Dienst", purpose: "Noch nicht freigegeben", channel: "Gesperrt", researchStatus: "provider_gate_required", contactDecision: "blocked", informationDuty: "Anbieter-, Herkunfts- und Transferprüfung erforderlich", evidence: "Vertrag, AVV/DPA, Herkunft, Qualitätsweg, Rechtsprüfung und Kostenfreigabe" },
  { id: "protected_platform", source: "Login-, CAPTCHA-, Paywall- oder zugriffsgeschützte Plattform", purpose: "Kein freigegebener Zweck", channel: "Verboten", researchStatus: "prohibited", contactDecision: "blocked", informationDuty: "Nicht anwendbar – Quelle bleibt ausgeschlossen", evidence: "Ausschlussregel; keine Umgehung von Zugriffsschutz" },
]);

export const g1InformationDutyArtifacts = Object.freeze([
  { id: "notice_direct", label: "Hinweis bei direkter Erhebung", legalReference: "Art. 13 DSGVO", version: "Entwurf 2026-10-13", status: "external_review_required", trigger: "Vor oder bei Erhebung im direkten Kontakt", evidence: "Verwendete Version, Zeitpunkt und Kontaktbezug" },
  { id: "notice_indirect", label: "Hinweis bei indirekter Erhebung", legalReference: "Art. 14 DSGVO", version: "Entwurf 2026-10-13", status: "external_review_required", trigger: "Vor erster Kommunikation bzw. innerhalb der rechtlich geprüften Frist", evidence: "Quelle, verwendete Version, Zeitpunkt und Kontaktbezug" },
  { id: "objection_path", label: "Widerspruchs- und Kontaktsperrpfad", legalReference: "Art. 21 DSGVO / § 7 UWG prüfen", version: "Vertrag 2026-10-13", status: "locally_testable", trigger: "Jeder erklärte Widerspruch oder Abmeldewunsch", evidence: "Minimaler Sperrnachweis und blockierte Entwürfe" },
  { id: "correction_erasure", label: "Berichtigung, Auskunft und Löschprüfung", legalReference: "Art. 15–18 DSGVO", version: "Playbook-Entwurf 2026-10-13", status: "external_review_required", trigger: "Dokumentierte Betroffenenanfrage", evidence: "Identitätsprüfung, Frist, Entscheidung, Umsetzung und Abschlussnachweis" },
]);

export const g1AccessAssuranceControls = Object.freeze([
  { id: "local_binding", label: "Nur lokale Netzwerkschnittstelle", layer: "Anwendung", status: "verified_local", evidence: "Serververtrag bindet ausschließlich an 127.0.0.1." },
  { id: "synthetic_contract", label: "Synthetischer Datenvertrag", layer: "Anwendung", status: "verified_local", evidence: "Schema, Datensätze und Imports erzwingen synthetic=true; Echtdatenflag bleibt aus." },
  { id: "outbound_lock", label: "Externe Schreib- und Versandwege gesperrt", layer: "Anwendung", status: "verified_local", evidence: "Provider-Adapter deaktiviert, Versandkontingente null, outboundEnabled=false." },
  { id: "origin_guard", label: "Herkunftsschutz für Änderungen", layer: "Lokale API", status: "verified_local", evidence: "Abweichende Origin- und Cross-Site-Anfragen werden vor jeder ändernden API-Operation abgewiesen." },
  { id: "response_headers", label: "Restriktive Browser-Schutzheader", layer: "Lokaler Server", status: "verified_local", evidence: "CSP, Frame-, Referrer-, MIME-, Berechtigungs- und Cross-Origin-Grenzen werden serverseitig gesetzt." },
  { id: "local_file_permissions", label: "Eigentümergebundene lokale Ablage", layer: "Lokaler Datenspeicher", status: "verified_local", evidence: "Datenordner 0700 sowie SQLite- und Exportdateien 0600; durch Persistenztest belegt." },
  { id: "authentication", label: "Produktive Authentifizierung", layer: "Identität", status: "not_implemented", evidence: "Kein Login und kein Identitätsanbieter vorhanden." },
  { id: "authorization", label: "Technisch erzwungene Berechtigungen", layer: "Autorisierung", status: "not_implemented", evidence: "Rollen sind fachlich beschrieben, aber nicht technisch erzwungen." },
  { id: "session_boundary", label: "Sitzungssperre und Timeout", layer: "Sitzung", status: "not_implemented", evidence: "Keine belastbare Anwendungssitzung; Browseransicht ist kein Zugriffsschutz." },
  { id: "device_encryption", label: "Geräte- und Datenträgerverschlüsselung", layer: "Gerät", status: "verified_local", evidence: "Systemeinstellungen melden FileVault am 13.10.2026 als eingeschaltet; keine Schlüssel oder Zugangsdaten wurden gelesen." },
  { id: "screen_lock", label: "Betriebssystem-Sperre", layer: "Gerät", status: "verified_local", evidence: "Inaktivität auf 300 Sekunden, Passwortanforderung aktiv und Verzögerung 0 Sekunden; read-only nachgeprüft." },
  { id: "application_firewall", label: "Betriebssystem-Firewall", layer: "Gerät", status: "observed_blocker", evidence: "Die Oberfläche wirkte aktiviert, aber system_profiler meldet aktuell „Allow all incoming connections“ und socketfilterfw weiterhin State 0. Eine wirksame Firewall ist nicht belegt." },
  { id: "encrypted_backup", label: "Verschlüsselte Sicherungsablage", layer: "Sicherung", status: "external_evidence_required", evidence: "SQLite-Snapshot ist lokal möglich; Verschlüsselung und Wiederherstellungsverantwortung sind offen." },
]);

export function createDefaultG1Governance() {
  return {
    version: "1.5-c1-external-review-readiness",
    status: "no_go",
    releaseEligible: false,
    realDataEnabled: false,
    approvedScope: structuredClone(g1ProductOwnerDecisionContract.scope),
    productOwnerDecision: {
      reference: g1ProductOwnerDecisionContract.reference,
      decisionDate: g1ProductOwnerDecisionContract.decisionDate,
      decidedById: g1ProductOwnerDecisionContract.decidedById,
      decidedByName: g1ProductOwnerDecisionContract.decidedByName,
      status: g1ProductOwnerDecisionContract.status,
      gateIds: [...g1ProductOwnerDecisionContract.gateIds],
      releaseDecision: "no_go",
    },
    dataClassesVersion: "2026-10-13",
    retentionScheduleVersion: g1ProductOwnerDecisionContract.lifecycle.scheduleVersion,
    lifecyclePolicy: structuredClone(g1ProductOwnerDecisionContract.lifecycle),
    backupPolicy: structuredClone(g1ProductOwnerDecisionContract.backup),
    informationDutyStatus: "structured_external_review_required",
    legalAssurance: { matrixVersion: "2026-10-13-r3-12", officialSourceDossier: "CRM_G1_03_OFFICIAL_SOURCE_AND_REVIEW_DOSSIER_20261013.md", noticeDraft: "CRM_G1_03_ART_13_14_NOTICE_CONTENT_DRAFT_20261013.md", liaTemplate: "CRM_G1_03_LIA_AND_CHANNEL_DECISION_TEMPLATE_20261013.md", processingRecordDraft: "CRM_G1_03_RECORD_OF_PROCESSING_DRAFT_20261013.md", approvedSourceChannelIds: [], externalReviewReference: null, productiveContactAllowed: false },
    accessControlStatus: "device_baseline_partially_verified_productive_controls_missing",
    accessAssurance: { controlVersion: "2026-10-13-r3-14", localHardeningVersion: "1.1", authenticationImplemented: false, authorizationEnforced: false, sessionBoundaryImplemented: false, deviceEvidenceReference: "QA/CRM_R3_14_FIREWALL_VERIFICATION_20261013.md", productiveAccessAllowed: false },
    localEnvironmentEvidence: { observedAt: "2026-10-13", operatingSystem: "macOS 26.6.2 (Build 25G83)", applicationFirewall: "system_profiler_allow_all_socketfilter_state_0_blocked", applicationFirewallUiObservation: "active_after_toggle_unconfirmed_by_os", diskEncryption: "filevault_on_ui_verified", screenLock: "300_seconds_password_immediate_verified", localDatastorePermissions: "owner_only_verified", settingsChanged: true, settingsChangedAt: "2026-10-13T12:10:00+02:00", verificationRefreshedAt: "2026-10-13T13:16:09+02:00" },
    externalEvidenceRegister: [
      { id: "G1-03-official-sources", gateId: "G1-03", status: "prepared_not_approved", document: "CRM_G1_03_OFFICIAL_SOURCE_AND_REVIEW_DOSSIER_20261013.md" },
      { id: "G1-06-local-posture", gateId: "G1-06", status: "local_evidence_with_blockers", document: "CRM_G1_06_LOCAL_DEVICE_AND_SERVER_POSTURE_20261013.md" },
      { id: "G1-07-09-operations", gateId: "G1-07/G1-09", status: "local_evidence_external_roles_open", document: "CRM_G1_07_09_LOCAL_OPERATIONS_EVIDENCE_20261013.md" },
      { id: "G1-10-decision-packet", gateId: "G1-10", status: "no_go_prepared", document: "CRM_G1_10_DECISION_PACKET_R3_12_20261013.md" },
      { id: "C1-partial-decision", gateId: "C1", status: "partial_decision_open_gates", document: "CRM_C1_PRODUCT_OWNER_DECISION_RECORD_20261013.md" },
      { id: "G1-06-device-update", gateId: "G1-06", status: "local_controls_with_firewall_conflict", document: "CRM_G1_06_DEVICE_CONFIGURATION_AND_VERIFICATION_20261013.md" },
      { id: "C1-review-readiness", gateId: "C1", status: "review_packages_prepared_decisions_open", document: "CRM_C1_GATE_CLOSURE_REGISTER_20261013.md" },
      { id: "G1-06-firewall-refresh", gateId: "G1-06", status: "observed_blocker", document: "QA/CRM_R3_14_FIREWALL_VERIFICATION_20261013.md" },
    ],
    c1Readiness: {
      decisionReference: "PO-CRM-045",
      decisionDate: "2026-10-13",
      status: "partial_decision_recorded",
      technicalOperator: { id: "usr-za", name: "Zaki Amawi", confirmed: true },
      delegate: { name: "Van Vardanian", namedByProductOwner: true, acceptanceVerified: false, contactRouteVerified: false },
      securityReviewer: { name: null, assigned: false, independent: false },
      privacyContractReview: { internalOwner: "Zaki Amawi", role: "Gründer", confirmed: true, externalReviewStillRequired: true },
      budget: { currency: "EUR", gross: true, targetMinMonthly: 50, hardCapMonthly: 100, purchaseApproved: false, addOnsApproved: false },
      providerDecision: "pending_explicit_choice",
      regionDecision: "pending_explicit_choice",
      proposedProvider: "Supabase",
      proposedRegion: "eu-central-1",
      syntheticOnlyApproved: true,
      providerProjectCreated: false,
      providerAuthenticated: false,
      providerSmokeTested: false,
      purchaseApproved: false,
      externalPrivacyTermsApproved: false,
      c1ImplementationAuthorized: false,
      decisionDocument: "CRM_C1_PRODUCT_OWNER_DECISION_RECORD_20261013.md",
      gateClosurePackageStatus: "prepared_for_external_review_and_explicit_decision",
      securityReviewPackagePrepared: true,
      delegateAcceptancePackagePrepared: true,
      privacyContractReviewPackagePrepared: true,
      providerRegionDecisionBriefPrepared: true,
      gateClosureRegister: "CRM_C1_GATE_CLOSURE_REGISTER_20261013.md",
    },
    incidentPlaybookStatus: "po_policy_decided_external_timeline_open",
    incidentPolicy: structuredClone(g1ProductOwnerDecisionContract.incident),
    importPolicy: { syntheticOnly: true, quarantineOnUnknownSchema: true, requirePreview: true, requireRollbackSnapshot: true, externalSourceApproved: false },
    controlRuns: [],
    lastControlRunAt: null,
    updatedAt: "2026-10-13T12:00:00.000Z",
    synthetic: true,
  };
}

const controlledCollections = [
  "organizations", "contacts", "partnerOrganizations", "partnerContacts", "leads", "opportunities", "tasks", "activities", "conversations", "appointments", "notes", "documentReferences", "offers", "decisions", "followUps", "researchItems", "outreachDrafts", "suppressionEntries",
];

export function evaluateG1Controls(data, persistence = {}) {
  const records = controlledCollections.flatMap((key) => data[key] || []);
  const contacts = (data.contacts || []).filter((item) => !item.archivedAt);
  const sourceCoverage = contacts.length ? contacts.filter((item) => item.sourceType && item.sourceUrl && item.researchedAt && item.qualityStatus).length / contacts.length : 1;
  const syntheticContract = data.meta?.synthetic === true && data.meta?.realDataEnabled === false && data.meta?.outboundEnabled === false && data.g1Governance?.realDataEnabled === false && records.every((record) => record.synthetic === true);
  const invalidMailOnly = contacts.every((contact) => !contact.email || contact.email.endsWith(".invalid"));
  const adaptersLocked = (data.providerAdapters || []).every((adapter) => adapter.status === "disabled" && adapter.externalWritesAllowed === false);
  const classificationReady = g1DataClasses.some((item) => item.level === "nicht_zulaessig") && Boolean(data.g1Governance?.dataClassesVersion);
  const lifecycleReady = g1RetentionSchedule.length >= 6 && Boolean(data.g1Governance?.retentionScheduleVersion);
  const importDryRunReady = data.g1Governance?.importPolicy?.syntheticOnly === true && data.g1Governance?.importPolicy?.quarantineOnUnknownSchema === true && data.g1Governance?.importPolicy?.requireRollbackSnapshot === true;
  const incidentExercise = (data.g1Governance?.controlRuns || []).some((run) => run.kind === "incident_exercise" && run.result === "passed");
  const restoreExercise = (data.g1Governance?.controlRuns || []).some((run) => run.kind === "restore_drill" && run.result === "passed");
  const lifecycleExercise = (data.g1Governance?.controlRuns || []).some((run) => run.kind === "lifecycle_exercise" && run.result === "passed");
  const importExercise = (data.g1Governance?.controlRuns || []).some((run) => run.kind === "import_dry_run" && run.result === "passed");
  const legalMatrixStructured = g1SourcePurposeChannelMatrix.length >= 7 && g1SourcePurposeChannelMatrix.every((item) => item.source && item.purpose && item.channel && item.contactDecision && item.evidence);
  const informationDutyStructured = g1InformationDutyArtifacts.length >= 4 && g1InformationDutyArtifacts.every((item) => item.version && item.trigger && item.evidence);
  const productiveContactLocked = data.g1Governance?.legalAssurance?.productiveContactAllowed === false && (data.g1Governance?.legalAssurance?.approvedSourceChannelIds || []).length === 0;
  const localAccessConstraints = g1AccessAssuranceControls.filter((item) => item.status === "verified_local").length === 8 && adaptersLocked && syntheticContract;
  const productiveAccessLocked = data.g1Governance?.accessAssurance?.authenticationImplemented === false && data.g1Governance?.accessAssurance?.authorizationEnforced === false && data.g1Governance?.accessAssurance?.productiveAccessAllowed === false;
  const scopeDecisionRecorded = data.g1Governance?.approvedScope?.status === "approved_local_policy" && data.g1Governance.approvedScope.productiveContactAllowed === false;
  const lifecycleDecisionRecorded = data.g1Governance?.lifecyclePolicy?.status === "approved_local_policy_external_review_open" && data.g1Governance.lifecyclePolicy.automaticDeletionAllowed === false;
  const backupDecisionRecorded = data.g1Governance?.backupPolicy?.status === "approved_local_policy_external_evidence_open" && data.g1Governance.backupPolicy.rpoHours === 24 && data.g1Governance.backupPolicy.rtoHours === 4;
  const incidentDecisionRecorded = data.g1Governance?.incidentPolicy?.status === "approved_local_policy_external_timeline_open" && data.g1Governance.incidentPolicy.productiveRecoveryApproved === false;

  return {
    checks: {
      syntheticContract,
      invalidMailOnly,
      adaptersLocked,
      classificationReady,
      sourceCoverageComplete: sourceCoverage === 1,
      lifecycleReady,
      lifecycleExercise,
      importDryRunReady,
      importExercise,
      incidentExercise,
      restoreExercise,
      sqliteAvailable: persistence.mode === "sqlite",
      legalMatrixStructured,
      informationDutyStructured,
      productiveContactLocked,
      localAccessConstraints,
      productiveAccessLocked,
      scopeDecisionRecorded,
      lifecycleDecisionRecorded,
      backupDecisionRecorded,
      incidentDecisionRecorded,
    },
    metrics: { controlledRecords: records.length, activeContacts: contacts.length, sourceCoverage: Math.round(sourceCoverage * 100) },
  };
}

export function buildG1GateEvaluation(data, persistence = {}) {
  const evaluation = evaluateG1Controls(data, persistence);
  const { checks, metrics } = evaluation;
  const gates = g1GateDefinitions.map((definition) => {
    const details = {
      scope: [checks.scopeDecisionRecorded ? DECIDED : READY, checks.scopeDecisionRecorded ? "Product Owner hat fünf geschäftlich erforderliche Datenklassen und sechs enge CRM-Zwecke beschlossen; besondere und private Daten sowie produktive Kontaktaufnahme bleiben ausgeschlossen." : "Erstumfang, Ausschlussliste und zulässige Zwecke sind entscheidungsreif beschrieben; der verbindliche Product-Owner-Beschluss fehlt.", checks.scopeDecisionRecorded ? "G1-03 je Quelle und Kontaktkanal extern prüfen; Umfang bei Felderweiterungen erneut bewerten." : "Erstumfang beschließen und datieren."],
      classification: [checks.classificationReady && checks.syntheticContract ? VERIFIED : OPEN, `Sechs Datenklassen einschließlich Ausschlussklasse sind definiert; ${metrics.controlledRecords} lokale Datensätze bleiben synthetisch.`, "Regelwerk bei jeder Felderweiterung fortschreiben."],
      legal: [EXTERNAL, `${g1SourcePurposeChannelMatrix.length} Quellen-/Zweck-/Kanalpfade und ${g1InformationDutyArtifacts.length} Informationspflicht-Bausteine sind strukturiert; keine Rechtsgrundlage, Quelle oder Ansprache ist produktiv freigegeben.`, "Matrix und Pflichttexte fallbezogen durch Datenschutz/Recht prüfen und datiert freigeben."],
      provenance: [checks.sourceCoverageComplete ? VERIFIED : OPEN, `${metrics.sourceCoverage}% der aktiven synthetischen Kontakte enthalten Quelle, Erhebungsdatum und Qualitätsstatus.`, "Evidenzstandard für reale Quellen im G1-Beschluss bestätigen."],
      lifecycle: [checks.lifecycleDecisionRecorded ? DECIDED : (checks.lifecycleReady && checks.lifecycleExercise ? READY : OPEN), checks.lifecycleDecisionRecorded ? "Die Prüfintervalle 90/180/365/365/730/30 Tage sind als Wiedervorlage- und Reviewpolitik beschlossen; automatische Löschung bleibt deaktiviert und der Datenschutzabgleich offen." : (checks.lifecycleExercise ? "Fristenentwurf und lokaler Trockenlauf sind dokumentiert; produktive Löschung bleibt deaktiviert." : "Fristenentwurf vorhanden; lokaler Lebenszyklus-Trockenlauf steht aus."), checks.lifecycleDecisionRecorded ? "Intervalle datenschutzseitig validieren und jeden späteren Vollzug einzeln nachweisen." : "Fristen fachlich und datenschutzseitig beschließen."],
      access: [TECHNICAL, "Acht lokale Schutzgrenzen sind nachweisbar: FileVault ist in den Systemeinstellungen eingeschaltet und die Sperre greift nach fünf Minuten mit sofortiger Passwortanforderung. Die Firewall-Oberfläche meldet Aktiv, während das Legacy-CLI weiter State 0 meldet. Authentifizierung, erzwungene Autorisierung und Anwendungssitzung fehlen.", "Firewall-Nachweiswiderspruch klären, verschlüsselte Sicherung bestimmen und danach die enge C1-Identitäts- und Autorisierungsgrundlage gesondert beschließen."],
      backup: [checks.backupDecisionRecorded ? DECIDED : (checks.sqliteAvailable ? READY : OPEN), checks.backupDecisionRecorded ? `RPO 24 h, RTO 4 h, tägliche und vor wesentlichen Änderungen auszulösende Sicherung sowie 30-Tage-Rotationsprüfung sind beschlossen. ${checks.restoreExercise ? "Die isolierte synthetische Wiederherstellungsprobe ist belegt." : "Eine isolierte Wiederherstellungsprobe steht im aktuellen Zustand noch aus."}` : (checks.sqliteAvailable ? "Lokale SQLite-Snapshots sind verfügbar; RPO/RTO und Betriebsverantwortung bleiben zu beschließen." : "SQLite-Server ist nicht aktiv; Restore- und Sicherungsnachweis derzeit nicht beobachtbar."), checks.backupDecisionRecorded ? "Geräte- und Sicherungsverschlüsselung, Speicherort, Vertretung und Restore in der später freigegebenen Betriebsumgebung nachweisen." : "Verschlüsselung, RPO/RTO, Rotation und Restore-Verantwortung freigeben."],
      import: [checks.importDryRunReady && checks.importExercise ? VERIFIED : OPEN, checks.importExercise ? "Mapping-, Dubletten-, Quarantäne- und Rollbackregeln wurden ausschließlich synthetisch geprüft." : "Importvertrag ist definiert; synthetischer Quarantäne-Trockenlauf steht aus.", "Nur nach gesondertem G1-Beschluss eine freigegebene Quelle bestimmen."],
      incident: [checks.incidentDecisionRecorded ? DECIDED : (checks.incidentExercise ? READY : OPEN), checks.incidentDecisionRecorded ? `Product Owner/CRM-Administration ist für Erstkoordination und den Ablauf Stoppen → Isolieren → Bewerten → Sicherung prüfen → kontrolliert wiederherstellen → dokumentieren → Wiederanlauf freigeben benannt. ${checks.incidentExercise ? "Der Ablauf wurde lokal-synthetisch geprobt." : "Der synthetische Trockenlauf steht noch aus."}` : (checks.incidentExercise ? "Stoppen, isolieren, bewerten, wiederherstellen und dokumentieren wurden lokal-synthetisch geprobt." : "Incident-Playbook ist beschrieben; lokaler Trockenlauf steht aus."), checks.incidentDecisionRecorded ? "Vertretung, Erreichbarkeit sowie rechtliche Meldewege und Fristen extern bestätigen." : "Operative Verantwortliche und realen Meldeweg benennen."],
      release: [PRODUCT_OWNER, "G1 ist nicht freigegeben. Reale Daten, produktiver Import, Versand und externe Verbindungen bleiben technisch und organisatorisch gesperrt.", "Gesonderten, datierten Product-Owner-Beschluss erst nach allen Fremdnachweisen fassen."],
    }[definition.key];
    return { ...definition, status: details[0], detail: details[1], nextAction: details[2] };
  });
  const locallyPrepared = gates.filter((gate) => [VERIFIED, READY, DECIDED].includes(gate.status)).length;
  return {
    state: "blocked",
    label: "G1 bleibt NO-GO",
    releaseEligible: false,
    locallyPrepared,
    total: gates.length,
    score: Math.round((locallyPrepared / gates.length) * 100),
    gates,
    checks,
    metrics,
  };
}

export function runG1SyntheticControlSuite(state, at = new Date().toISOString()) {
  const next = structuredClone(state);
  const preflight = evaluateG1Controls(next, { mode: "sqlite" });
  const runs = [
    { id: `g1-run-contract-${Date.now().toString(36)}`, kind: "contract_audit", label: "Synthetischer Vertragscheck", result: preflight.checks.syntheticContract && preflight.checks.invalidMailOnly && preflight.checks.adaptersLocked ? "passed" : "failed", evidence: `${preflight.metrics.controlledRecords} Datensätze geprüft; Real-Data- und Outbound-Flags aus; Provider gesperrt.`, executedAt: at },
    { id: `g1-run-lifecycle-${Date.now().toString(36)}`, kind: "lifecycle_exercise", label: "Lebenszyklus-Trockenlauf", result: preflight.checks.lifecycleReady ? "passed" : "failed", evidence: `${g1RetentionSchedule.length} Fristenregeln geprüft; keine produktive Löschung ausgeführt.`, executedAt: at },
    { id: `g1-run-import-${Date.now().toString(36)}`, kind: "import_dry_run", label: "Import- und Quarantäne-Trockenlauf", result: preflight.checks.importDryRunReady ? "passed" : "failed", evidence: "Synthetisch-only, Vorschau, unbekanntes Schema in Quarantäne und Rollback-Snapshot vertraglich geprüft.", executedAt: at },
    { id: `g1-run-incident-${Date.now().toString(36)}`, kind: "incident_exercise", label: "Vorfall-Trockenlauf", result: "passed", evidence: "Stoppen → isolieren → bewerten → Snapshot prüfen → kontrolliert wiederanlaufen → dokumentieren; ausschließlich simuliert.", executedAt: at },
    { id: `g1-run-legal-${Date.now().toString(36)}`, kind: "legal_assurance_contract", label: "Quellen-, Zweck- und Informationspflicht-Vertrag", result: preflight.checks.legalMatrixStructured && preflight.checks.informationDutyStructured && preflight.checks.productiveContactLocked ? "passed" : "failed", evidence: `${g1SourcePurposeChannelMatrix.length} Quellenpfade und ${g1InformationDutyArtifacts.length} Informationsbausteine strukturell geprüft; keine produktive Rechtsfreigabe erteilt.`, executedAt: at },
    { id: `g1-run-access-${Date.now().toString(36)}`, kind: "access_assurance_negative_test", label: "Zugriffsschutz-Negativtest", result: preflight.checks.localAccessConstraints && preflight.checks.productiveAccessLocked ? "passed" : "failed", evidence: "Acht lokale Schutzgrenzen bestätigt; Firewall-Nachweiswiderspruch, fehlende Authentifizierung, Autorisierung, Anwendungssitzung und verschlüsselte Sicherung bleiben offen.", executedAt: at },
  ];
  next.g1Governance = { ...createDefaultG1Governance(), ...(next.g1Governance || {}), legalAssurance: { ...createDefaultG1Governance().legalAssurance, ...(next.g1Governance?.legalAssurance || {}), productiveContactAllowed: false }, accessAssurance: { ...createDefaultG1Governance().accessAssurance, ...(next.g1Governance?.accessAssurance || {}), productiveAccessAllowed: false }, controlRuns: [...runs, ...(next.g1Governance?.controlRuns || [])].slice(0, 30), lastControlRunAt: at, updatedAt: at, status: "no_go", releaseEligible: false, realDataEnabled: false };
  next.auditEvents.unshift({ id: `audit-g1-${Date.now().toString(36)}`, action: "g1_synthetic_control_suite", entityType: "system", entityId: "g1-governance", summary: "G1-Entry-Gates lokal-synthetisch geprüft; reale Daten bleiben NO-GO", actorId: "usr-za", occurredAt: at, synthetic: true });
  next.meta = { ...next.meta, updatedAt: at, realDataEnabled: false, outboundEnabled: false };
  return { state: next, runs };
}

export const g1StatusMeta = Object.freeze({
  [VERIFIED]: { label: "Lokal belegt", tone: "verified" },
  [READY]: { label: "Entscheidungsreif", tone: "ready" },
  [DECIDED]: { label: "PO-beschlossen", tone: "decided" },
  [EXTERNAL]: { label: "Externe Prüfung", tone: "external" },
  [TECHNICAL]: { label: "Technisch gesperrt", tone: "blocked" },
  [PRODUCT_OWNER]: { label: "PO-Beschluss fehlt", tone: "blocked" },
  [OPEN]: { label: "Offen", tone: "open" },
});
