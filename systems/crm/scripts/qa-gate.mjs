import assert from "node:assert/strict";
import { readFile, readdir, stat } from "node:fs/promises";
import { fileURLToPath } from "node:url";
import path from "node:path";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const read = (file) => readFile(path.join(root, file), "utf8");

const [html, app, appShell, globalSearchDialog, directoryViews, importedRecordDialog, importedRecordsService, seed, domain, stateEngine, growth, operationalPanel, workday, decisionCockpit, analyticsView, analytics, g1Readiness, g1Governance, decisionIntelligence, outreachReadiness, persistence, server, css, readme, packageJson] = await Promise.all([
  read("index.html"),
  read("src/App.jsx"),
  read("src/components/AppShell.jsx"),
  read("src/components/GlobalSearchDialog.jsx"),
  read("src/components/DirectoryViews.jsx"),
  read("src/components/ImportedRecordDialog.jsx"),
  read("src/services/importedCrmRecords.js"),
  read("src/data/seed.js"),
  read("src/domain/crmDomain.js"),
  read("src/domain/stateEngine.js"),
  read("src/components/GrowthWorkspace.jsx"),
  read("src/components/OperationalReadinessPanel.jsx"),
  read("src/components/WorkdayView.jsx"),
  read("src/components/FounderDecisionCockpit.jsx"),
  read("src/components/AnalyticsView.jsx"),
  read("src/domain/analytics.js"),
  read("src/components/G1ReadinessPanel.jsx"),
  read("src/domain/g1Governance.js"),
  read("src/domain/decisionIntelligence.js"),
  read("src/domain/outreachReadiness.js"),
  read("src/services/localPersistence.js"),
  read("scripts/local-crm-server.mjs"),
  read("src/styles.css"),
  read("README.md"),
  read("package.json"),
]);

const [stagingWorkspace, stagingService, stagingStore, stagingImporter] = await Promise.all([
  read("src/components/LegacyStagingWorkspace.jsx"),
  read("src/services/realDataStaging.js"),
  read("scripts/real-data-staging-store.mjs"),
  read("scripts/import_real_data_staging.py"),
]);

assert.match(html, /noindex,nofollow,noarchive/);
assert.match(app, /FounderDecisionCockpit/);
assert.match(seed, /Klinikverbund Rhein/);
assert.match(seed, /example\.invalid/);
assert.match(css, /#0b1f3a/i);
assert.match(css, /#f7f4ec/i);
assert.match(css, /prefers-reduced-motion/);
assert.match(readme, /Lokaler CRM-Prototyp mit synthetischem Core und schreibgeschützt eingebundenen Importdaten.*nicht produktiv freigegeben/s);
assert.match(packageJson, /test:e2e/);
assert.match(packageJson, /qa:browser/);
assert.match(seed, /schemaVersion: SCHEMA_VERSION/);
assert.match(app, /GlobalSearchDialog/);
assert.match(app, /FounderDecisionCockpit/);
assert.match(app, /WorkdayView/);
assert.match(app, /AnalyticsView/);
assert.match(appShell, /System & Freigaben/);
assert.equal(/Altdaten-Staging/.test(appShell), false, "Altdaten-Staging ist weiterhin als CRM-Reiter sichtbar");
assert.equal(/LegacyStagingWorkspace/.test(app), false, "Der Pool-Arbeitsbereich ist weiterhin aktiv eingebunden");
assert.match(app, /Importierte Organisationen und Kontakte bleiben unverändert/);
assert.match(app, /useImportedGlobalSearch/);
assert.match(app, /importedOrganizations/);
assert.match(app, /importedContacts/);
assert.match(globalSearchDialog, /Ab zwei Zeichen werden lokale und importierte CRM-Einträge gemeinsam geprüft/);
assert.match(globalSearchDialog, /Importierte Organisation/);
assert.match(globalSearchDialog, /Importierter Kontakt/);
assert.match(directoryViews, /Alle CRM-Daten/);
assert.match(directoryViews, /Importierte Organisationen/);
assert.match(directoryViews, /Importierte Kontakte/);
assert.match(directoryViews, /Nicht kontaktieren/);
assert.match(importedRecordDialog, /Importierter CRM-Eintrag/);
assert.match(importedRecordDialog, /schreibgeschützt/);
assert.match(importedRecordsService, /\/api\/crm\/imported\/organizations/);
assert.match(importedRecordsService, /\/api\/crm\/imported\/contacts/);
assert.match(importedRecordsService, /search: async/);
assert.match(stagingWorkspace, /Lokales Echtdaten-Staging/);
assert.match(stagingWorkspace, /Nicht kontaktieren/);
assert.match(stagingWorkspace, /Keine Außenkontaktfreigabe/);
assert.match(stagingWorkspace, /Bestätigt aktuell/);
assert.match(stagingWorkspace, /Prüfqueue \/ Quarantäne/);
assert.match(stagingService, /\/api\/staging\/summary/);
assert.match(stagingStore, /amavio-real-data-staging-r3-15\.sqlite/);
assert.match(stagingStore, /do_not_contact/);
assert.match(stagingImporter, /"outboundEnabled": False/);
assert.match(stagingImporter, /"cloudSyncEnabled": False/);
assert.match(stagingImporter, /"supabaseEnabled": False/);
assert.match(workday, /Mein Arbeitstag/);
assert.match(workday, /Heute abschließen/);
assert.equal(/Pipeline-Lage|Datenvertrauen/.test(workday), false, "Arbeitstag enthält Cockpit-Dubletten");
assert.match(decisionCockpit, /Geschäftslage im Blick/);
assert.match(decisionCockpit, /Pipeline-Lage/);
assert.match(decisionCockpit, /Beziehungsabdeckung/);
assert.match(decisionCockpit, /Datenvertrauen/);
assert.equal(/Heute & als Nächstes|Outreach Preflight|R3\./.test(decisionCockpit), false, "Cockpit enthält Tages- oder Entwicklungstext");
assert.match(analyticsView, /Pipeline-Verteilung/);
assert.match(analyticsView, /Aktivitätsentwicklung/);
assert.match(analyticsView, /Interne Analyse/);
assert.match(analyticsView, /Berichtsansicht/);
assert.match(analytics, /buildG1Readiness/);
assert.match(g1Governance, /G1 bleibt NO-GO/);
assert.match(g1Readiness, /readiness\.label/);
assert.match(g1Readiness, /G1 · Eintrittsgates & Beschlusslage/);
assert.match(g1Readiness, /PO-beschlossen/);
assert.match(g1Readiness, /Vier lokale Fachbeschlüsse protokolliert/);
assert.match(g1Readiness, /Lokale Prüfungen ausführen/);
assert.match(g1Readiness, /Datenklassen/);
assert.match(g1Readiness, /Recht & Quellen/);
assert.match(g1Readiness, /Zugriff & Gerät/);
assert.match(g1Readiness, /Lebenszyklus/);
assert.match(g1Readiness, /Prüfspur & Beschluss/);
assert.match(g1Readiness, /Isolierte Restore-Probe ausführen/);
assert.match(g1Readiness, /Live-Zustand/);
assert.match(g1Readiness, /Gate-Übersicht/);
assert.match(g1Governance, /releaseEligible: false/);
assert.match(g1Governance, /realDataEnabled: false/);
assert.match(g1Governance, /runG1SyntheticControlSuite/);
assert.match(g1Governance, /restoreExercise/);
assert.match(g1Governance, /PO-CRM-043/);
assert.match(g1Governance, /po_decided_local/);
assert.match(g1Governance, /releaseDecision: "no_go"/);
assert.match(decisionIntelligence, /externalModel: false/);
assert.match(decisionIntelligence, /externalDataTransfer: false/);
assert.match(decisionIntelligence, /autonomousWrites: false/);
assert.match(outreachReadiness, /productiveSend: false/);
assert.match(outreachReadiness, /externalResearch: false/);
assert.match(outreachReadiness, /legalClearanceClaimed: false/);
assert.match(stateEngine, /createReadinessTask/);

for (const forbidden of ["Pflegeunion", "HubSpot", "claude.ai", "Gmail-Konto", "Share Deal", "Asset Deal"]) {
  assert.equal(`${app}\n${seed}`.includes(forbidden), false, `IGS-spezifischer Begriff gefunden: ${forbidden}`);
}

for (const asset of [
  "public/assets/brand/amavio-logo-light.svg",
  "public/assets/brand/amavio-logo-primary.svg",
  "public/assets/media/crm-focus-architecture.png",
  "design/AMAVIO_ONE_CRM_DESKTOP_CONCEPT_20261008.png",
  "design/AMAVIO_ONE_CRM_MOBILE_CONCEPT_20261008.png",
  "design/r3-4/AMAVIO_ONE_CRM_R3_4_DESKTOP_CONCEPT_20261010.png",
  "design/r3-4/AMAVIO_ONE_CRM_R3_4_MOBILE_CONCEPT_20261010.png",
  "design/r3-6/AMAVIO_ONE_CRM_R3_6_WORKDAY_CONCEPT_20261013.png",
  "design/r3-6/AMAVIO_ONE_CRM_R3_6_COCKPIT_CONCEPT_20261013.png",
  "design/r3-6/AMAVIO_ONE_CRM_R3_6_REPORTS_CONCEPT_20261013.png",
  "design/r3-6/AMAVIO_ONE_CRM_R3_6_WORKDAY_MOBILE_CONCEPT_20261013.png",
]) {
  const info = await stat(path.join(root, asset));
  assert.ok(info.size > 500, `${asset} ist leer oder fehlt`);
}

for (const document of [
  "CRM_CAPABILITY_GAP_MATRIX.md",
  "CRM_CANONICAL_DOMAIN_MODEL.md",
  "CRM_STATUS_AND_TRANSITION_CONTRACT.md",
  "CRM_PERMISSIONS_AND_VISIBILITY_DRAFT.md",
  "CRM_DATA_LIFECYCLE_AND_PRIVACY_DRAFT.md",
  "CRM_ACC_HANDOFF_CONTRACT_DRAFT.md",
  "CRM_TEST_AND_QUALITY_STRATEGY.md",
  "CRM_RELEASE_MATURITY_PLAN.md",
  "CRM_PRODUCT_OWNER_DECISIONS.md",
  "QA/CRM_COPY_AND_SCOPE_VERIFICATION_20261009.md",
  "QA/CRM_CORE_OPERATIONS_QA_20261009.md",
  "R3_CONTRACT_ALIGNMENT_SCOPE.md",
  "R3_IMPLEMENTATION_CROSSWALK.md",
  "QA/CRM_R3_COPY_AND_SCOPE_VERIFICATION_20261009.md",
  "QA/CRM_R3_CONTRACT_ALIGNMENT_QA_20261009.md",
  "CRM_R3_2_SCOPE_AND_IMPLEMENTATION_20261010.md",
  "CRM_C0_DECISION_PACKAGE_20261010.md",
  "CRM_C0_ARCHITECTURE_DECISION_RECORD_20261010.md",
  "CRM_C0_PROVIDER_COMPARISON_20261010.md",
  "QA/CRM_R3_2_CORE_QA_20261010.md",
  "CRM_R3_3_SCOPE_AND_IMPLEMENTATION_20261010.md",
  "CRM_GROWTH_AND_OUTREACH_DOMAIN_CONTRACT_20261010.md",
  "CRM_LOCAL_PERSISTENCE_BACKUP_AND_IMPORT_CONTRACT_20261010.md",
  "CRM_NEAR_TERM_CAPABILITY_ROADMAP_20261010.md",
  "CRM_C1_RECLASSIFICATION_20261010.md",
  "CRM_R3_4_PRODUCT_EXPERIENCE_BLUEPRINT_20261010.md",
  "CRM_R3_4_INFORMATION_ARCHITECTURE_20261010.md",
  "CRM_R3_4_DESIGN_SYSTEM_DELTA_20261010.md",
  "CRM_R3_4_VISUALIZATION_CONTRACT_20261010.md",
  "CRM_R3_4_AI_EXPERIENCE_AND_GOVERNANCE_CONTRACT_20261010.md",
  "CRM_R3_4_ACCESSIBILITY_AND_RESPONSIVE_MATRIX_20261010.md",
  "CRM_R3_4_IMPLEMENTATION_CROSSWALK_20261010.md",
  "QA/CRM_R3_4_PRODUCT_EXPERIENCE_QA_20261010.md",
  "QA/CRM_R3_4_DESIGN_FIDELITY_LEDGER_20261010.md",
  "CRM_R3_5_SCOPE_AND_IMPLEMENTATION_20261012.md",
  "CRM_R3_5_CONTACTABILITY_AND_OUTREACH_PREFLIGHT_CONTRACT_20261012.md",
  "CRM_R3_5_REAL_DATA_INDIVIDUAL_SEND_AND_LIVE_RESEARCH_GATE_PREPARATION_20261012.md",
  "CRM_R3_5_IMPLEMENTATION_CROSSWALK_20261012.md",
  "QA/CRM_R3_5_OPERATIONAL_READINESS_QA_20261012.md",
  "CRM_R3_6_SCOPE_AND_IMPLEMENTATION_20261013.md",
  "CRM_R3_6_WORKSPACE_PURPOSE_AND_USABILITY_MATRIX_20261013.md",
  "CRM_R3_6_VISIBLE_INFORMATION_AND_PRIVACY_AUDIT_20261013.md",
  "CRM_G1_REAL_DATA_READINESS_SCOPE_20261013.md",
  "CRM_G1_DATA_INVENTORY_AND_CLASSIFICATION_DRAFT_20261013.md",
  "CRM_G1_ENTRY_GATE_REGISTER_20261013.md",
  "CRM_G1_RELEASE_DECISION_DRAFT_20261013.md",
  "QA/CRM_R3_6_WORKSPACES_ANALYTICS_G1_QA_20261013.md",
  "CRM_G1_GATE_CLOSURE_IMPLEMENTATION_20261013.md",
  "CRM_G1_DATA_PURPOSE_AND_LEGAL_BASIS_MATRIX_DRAFT_20261013.md",
  "CRM_G1_INFORMATION_DUTY_AND_CONTACT_POLICY_DRAFT_20261013.md",
  "CRM_G1_ACCESS_DEVICE_AND_SESSION_CONTROL_DRAFT_20261013.md",
  "CRM_G1_RETENTION_ARCHIVE_AND_DELETION_SCHEDULE_DRAFT_20261013.md",
  "CRM_G1_IMPORT_MAPPING_DEDUPLICATION_AND_QUARANTINE_CONTRACT_20261013.md",
  "CRM_G1_DATA_SUBJECT_REQUEST_PLAYBOOK_DRAFT_20261013.md",
  "CRM_G1_INCIDENT_RESPONSE_PLAYBOOK_DRAFT_20261013.md",
  "CRM_G1_EVIDENCE_AND_OWNERSHIP_REGISTER_20261013.md",
  "CRM_G1_PRODUCT_OWNER_DECISION_PACKAGE_20261013.md",
  "QA/CRM_G1_ENTRY_GATE_CLOSURE_QA_20261013.md",
  "CRM_R3_8_SCOPE_AND_IMPLEMENTATION_20261013.md",
  "CRM_G1_03_LEGAL_AND_INFORMATION_DUTY_CLOSURE_PACKAGE_20261013.md",
  "CRM_G1_03_SOURCE_PURPOSE_CHANNEL_DECISION_MATRIX_20261013.md",
  "CRM_G1_03_INFORMATION_NOTICE_VERSIONING_AND_EVIDENCE_DRAFT_20261013.md",
  "CRM_G1_06_ACCESS_DEVICE_SESSION_ASSURANCE_PACKAGE_20261013.md",
  "CRM_G1_06_DEVICE_AND_LOCAL_ENVIRONMENT_EVIDENCE_20261013.md",
  "CRM_G1_06_AUTHORIZATION_NEGATIVE_TEST_CONTRACT_20261013.md",
  "CRM_G1_10_FINAL_DECISION_READINESS_20261013.md",
  "QA/CRM_R3_8_G1_LEGAL_ACCESS_ASSURANCE_QA_20261013.md",
  "CRM_R3_9_INFORMATION_ARCHITECTURE_AND_DUPLICATION_AUDIT_20261013.md",
  "CRM_R3_9_SCOPE_AND_IMPLEMENTATION_20261013.md",
  "QA/CRM_R3_9_IA_CONSOLIDATION_QA_20261013.md",
  "QA/CRM_R3_9_COPY_AND_SCOPE_VERIFICATION_20261013.md",
  "CRM_R3_10_SCOPE_AND_IMPLEMENTATION_20261013.md",
  "CRM_G1_07_OBSERVED_RESTORE_ASSURANCE_20261013.md",
  "CRM_G1_01_05_07_09_DECISION_RECOMMENDATION_20261013.md",
  "QA/CRM_R3_10_LOCAL_OPERATIONS_ASSURANCE_QA_20261013.md",
  "QA/CRM_R3_10_COPY_AND_SCOPE_VERIFICATION_20261013.md",
  "CRM_R3_11_SCOPE_AND_IMPLEMENTATION_20261013.md",
  "CRM_G1_PRODUCT_OWNER_DECISION_RECORD_20261013.md",
  "CRM_G1_REMAINING_EXTERNAL_TECHNICAL_GATES_20261013.md",
  "QA/CRM_R3_11_G1_PO_DECISION_ALIGNMENT_QA_20261013.md",
  "QA/CRM_R3_11_COPY_AND_SCOPE_VERIFICATION_20261013.md",
  "CRM_R3_12_SCOPE_AND_IMPLEMENTATION_20261013.md",
  "CRM_G1_03_OFFICIAL_SOURCE_AND_REVIEW_DOSSIER_20261013.md",
  "CRM_G1_03_ART_13_14_NOTICE_CONTENT_DRAFT_20261013.md",
  "CRM_G1_03_LIA_AND_CHANNEL_DECISION_TEMPLATE_20261013.md",
  "CRM_G1_03_RECORD_OF_PROCESSING_DRAFT_20261013.md",
  "CRM_G1_06_LOCAL_DEVICE_AND_SERVER_POSTURE_20261013.md",
  "CRM_G1_07_09_LOCAL_OPERATIONS_EVIDENCE_20261013.md",
  "CRM_G1_09_INCIDENT_CONTACT_AND_ESCALATION_RUNBOOK_20261013.md",
  "CRM_C1_CURRENT_PROVIDER_AND_COST_REFRESH_20261013.md",
  "CRM_C1_MINIMUM_RELEASE_DECISIONS_20261013.md",
  "CRM_G1_10_DECISION_PACKET_R3_12_20261013.md",
  "QA/CRM_R3_12_COPY_AND_SCOPE_VERIFICATION_20261013.md",
  "QA/CRM_R3_12_G1_EXTERNAL_TECHNICAL_READINESS_QA_20261013.md",
  "CRM_R3_13_SCOPE_AND_IMPLEMENTATION_20261013.md",
  "CRM_C1_PRODUCT_OWNER_DECISION_RECORD_20261013.md",
  "CRM_G1_06_DEVICE_CONFIGURATION_AND_VERIFICATION_20261013.md",
  "QA/CRM_R3_13_COPY_AND_SCOPE_VERIFICATION_20261013.md",
  "QA/CRM_R3_13_C1_DECISION_CLOSURE_QA_20261013.md",
  "QA/CRM_R3_13_LOCAL_SYSTEM_SETTINGS_PRECHANGE_20261013.md",
  "QA/CRM_R3_13_LOCAL_SYSTEM_SETTINGS_POSTCHANGE_20261013.md",
  "CRM_R3_14_SCOPE_AND_IMPLEMENTATION_20261013.md",
  "CRM_C1_SECURITY_REVIEW_BRIEF_20261013.md",
  "CRM_C1_DELEGATE_ACCEPTANCE_AND_HANDOVER_DRAFT_20261013.md",
  "CRM_C1_PRIVACY_CONTRACT_EXTERNAL_REVIEW_BRIEF_20261013.md",
  "CRM_C1_PROVIDER_REGION_DECISION_BRIEF_20261013.md",
  "CRM_C1_GATE_CLOSURE_REGISTER_20261013.md",
  "QA/CRM_R3_14_FIREWALL_VERIFICATION_20261013.md",
  "QA/CRM_R3_14_COPY_AND_SCOPE_VERIFICATION_20261013.md",
  "QA/CRM_R3_14_EXTERNAL_REVIEW_READINESS_QA_20261013.md",
  "CRM_R3_15_SCOPE_AND_IMPLEMENTATION_20261013.md",
  "CRM_R3_15_REAL_DATA_STAGING_CONTRACT_20261013.md",
  "QA/CRM_R3_15_COPY_AND_SCOPE_VERIFICATION_20261013.md",
  "QA/CRM_R3_15_LOCAL_REAL_DATA_STAGING_QA_20261013.md",
  "QA/CRM_R3_15_DESIGN_FIDELITY_LEDGER_20261013.md",
  "CRM_R3_16_SCOPE_AND_CORRECTION_20261013.md",
  "QA/CRM_R3_16_COPY_AND_SCOPE_VERIFICATION_20261013.md",
  "QA/CRM_R3_16_ORGANIZATIONS_CONTACTS_INTEGRATION_QA_20261013.md",
  "CRM_R3_17_SCOPE_AND_IMPLEMENTATION_20261013.md",
  "CRM_C1_LOCAL_TO_SUPABASE_TRANSITION_CONTRACT_20261013.md",
  "QA/CRM_R3_17_COPY_AND_SCOPE_VERIFICATION_20261013.md",
  "QA/CRM_R3_17_UNIFIED_GLOBAL_SEARCH_QA_20261013.md",
]) {
  const content = await read(document);
  assert.ok(content.length > 300, `${document} ist unvollständig oder fehlt`);
}

const sourceFiles = (await readdir(path.join(root, "src"), { recursive: true })).filter((file) => /\.(js|jsx)$/.test(file));
const source = (await Promise.all(sourceFiles.map((file) => readFile(path.join(root, "src", file), "utf8")))).join("\n");
assert.equal(/fetch\s*\(\s*["'`]https?:/i.test(source), false, "Aktiver Browsercode enthält einen externen Fetch-Pfad");
assert.equal(/XMLHttpRequest|WebSocket\s*\(/.test(source), false, "Aktiver Browsercode enthält einen nicht freigegebenen Netzwerkpfad");
assert.match(persistence, /fetch\(path/);
assert.match(persistence, /\/api\/state/);
assert.match(source, /amavio-one-crm-r3-8-g1-legal-access-assurance-v7/);
assert.match(source, /amavio-one-crm-r3-7-g1-entry-gate-closure-v6/);
assert.match(source, /amavio-one-crm-r3-6-workspaces-analytics-g1-v5/);
assert.match(source, /amavio-one-crm-r3-5-operational-readiness-v5/);
assert.match(source, /amavio-one-crm-r3-4-founder-decision-v5/);
assert.match(source, /amavio-one-crm-r3-3-owner-growth-v5/);
assert.match(source, /amavio-one-crm-r3-2-local-core-v4/);
assert.match(source, /amavio-one-crm-r3-contract-alignment-v3/);
assert.match(source, /amavio-one-crm-canonical-core-v2/);
assert.match(source, /amavio-one-crm-cockpit-v1/);
assert.match(domain, /mode: "single_internal"/);
assert.match(domain, /tenantCapable: false/);
assert.match(domain, /securityEnforced: false/);
assert.match(domain, /"real_data_activation", "authentication", "external_import", "email_send", "calendar_sync", "document_storage", "app_integration", "productive_ai", "hosting_deployment"/);
assert.match(growth, /Versand gesperrt/);
assert.match(growth, /Kontaktfreigabe/);
assert.match(growth, /workspace === "system"/);
assert.match(growth, /Sicherung & Datenvertrag/);
assert.equal(/<span>Daten & Sicherung<\/span>/.test(growth), false, "Systembereich ist noch als Growth-Unterregister doppelt geführt");
assert.match(operationalPanel, /Darf kontaktiert werden/);
assert.match(operationalPanel, /Produktiver Versand gesperrt/);
assert.match(operationalPanel, /createReadinessTask/);
assert.equal(/R3\.[0-9]|Codex|ChatGPT|Claude|\bPrompt\b/i.test(operationalPanel), false, "Kontaktfreigabe enthält internen Entwicklungs- oder Assistenztext");
assert.match(seed, /Brevo – nicht verbunden/);
assert.match(source, /prepared_for_external_review_and_explicit_decision/);
assert.match(source, /system_profiler_allow_all_socketfilter_state_0_blocked/);
assert.match(source, /c1ImplementationAuthorized: false/);
assert.match(server, /127\.0\.0\.1/);
assert.match(server, /DatabaseSync/);
assert.match(server, /Content-Security-Policy/);
assert.match(server, /mutationOriginAllowed/);
assert.match(server, /0o600/);
assert.match(server, /0o700/);
assert.match(server, /new DatabaseSync\(":memory:"\)/);
assert.match(server, /liveStateMutated: false/);
assert.match(server, /RealDataStagingStore/);
assert.match(server, /\/api\/staging\/summary/);
assert.match(server, /outboundEnabled: false/);
assert.match(server, /cloudSyncEnabled: false/);
assert.match(server, /Nur synthetische R3\.2-\/R3\.3-\/R3\.4-\/R3\.5-Zustände|Nicht-synthetische Daten sind nicht freigegeben/);
assert.match(stateEngine, /status = updated\.commercialApproval\?\.approved && updated\.operationsApproval\?\.approved \? "approved_marker"/);
assert.equal(/\baccId\b|\bpayload\b/.test(stateEngine), false, "ACC-Transferfeld im lokalen Handoff-State gefunden");

console.log("AMAVIO One CRM QA: OK");
console.log("- synthetischer Core und schreibgeschützte Importdaten klar unterschieden");
console.log("- AMAVIO Markenanker und Reduced Motion vorhanden");
console.log("- IGS-spezifische Fachbegriffe aus aktiver Implementierung ausgeschlossen");
console.log("- Brand- und Konzeptassets vorhanden");
console.log("- Pflichtdokumente, isolierter G1/v7-Persistenzvertrag und lokale Restore-Assurance vorhanden; ältere Speicherstände bleiben erhalten");
console.log("- Arbeitstag, Steuerungscockpit, Pipeline und Auswertungen sind funktional getrennt");
console.log("- System & Freigaben ist eigenständig; Growth enthält keine Daten-/Sicherungsdoppelung mehr");
console.log("- Kontaktentscheidung, Outreach-Preflight und Aufgabenconversion bleiben über die eigene Kontaktfreigabe erreichbar");
console.log("- G1-Datenklassen, Quellen-/Kanalvertrag, Zugriffsschutzregister, Lebenszyklus, Kontrollsuite und gesperrte Freigabe statisch geprüft");
console.log("- C1-Reviewpakete vorbereitet; Firewall-Blocker und unveränderte Implementierungssperre statisch geprüft");
console.log("- Single-Workspace, lokale SQLite-Grenze, Growth-Verträge und geschlossene Außenfähigkeiten statisch geprüft");
console.log("- Browsercode nutzt ausschließlich relative lokale /api-Pfade; keine aktive externe Verbindung");
console.log("- Importdaten sind ausschließlich in Organisationen und Kontakte lesend eingebunden; kein Pool-Reiter sichtbar");
console.log("- Outreach, Cloud, Supabase, App und ACC bleiben deaktiviert");
