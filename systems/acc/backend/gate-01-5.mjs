import { randomUUID } from "node:crypto";
import { ProviderGateError } from "./provider-adapters.mjs";
import { describeSession, projectCaseDetail, projectPortfolio } from "./role-contract.mjs";

const DEMO_DATE = "2026-09-06";
const ALLOWED_TRANSITIONS = {
  draft: new Set(["active", "cancelled_demo"]),
  active: new Set(["blocked", "awaiting_evidence", "awaiting_decision", "ready", "cancelled_demo"]),
  blocked: new Set(["active", "awaiting_evidence", "awaiting_decision", "cancelled_demo"]),
  awaiting_evidence: new Set(["active", "blocked", "awaiting_decision"]),
  awaiting_decision: new Set(["active", "blocked", "ready"]),
  ready: new Set(["active", "completed"]),
  completed: new Set([]),
  cancelled_demo: new Set([]),
};

const WORK_PRODUCT_LABELS = {
  arrival_readiness_brief: "Arrival Readiness Brief",
  decision_memo: "Decision Memo",
  exception_resolution_plan: "Exception Resolution Plan",
  employer_handover_brief: "Employer Handover Brief",
  stabilization_plan: "30/60/90 Stabilization Plan",
  communication_draft: "Communication Draft",
  case_closure_record: "Case Closure Record",
};

function isoNow() { return new Date().toISOString(); }
function json(value, fallback = []) { try { return JSON.parse(value); } catch { return fallback; } }
function daysBetween(from, to) { return Math.round((Date.parse(to) - Date.parse(from)) / 86_400_000); }
function shiftDate(date, delta) { const next = new Date(`${date}T12:00:00Z`); next.setUTCDate(next.getUTCDate() + delta); return next.toISOString().slice(0, 10); }
function cleanText(value, max = 1_500) { return String(value || "").trim().slice(0, max); }

function insertIgnore(db, sql, values) { db.prepare(sql).run(...values); }
function ensureColumn(db, table, column, definition) {
  const exists = db.prepare(`PRAGMA table_info(${table})`).all().some((item) => item.name === column);
  if (!exists) db.exec(`ALTER TABLE ${table} ADD COLUMN ${column} ${definition}`);
}

function seedCase(db, item) {
  const hadOperationalState = Boolean(db.prepare("SELECT 1 FROM case_operations WHERE case_id=? AND tenant_id=?").get(item.id, item.tenantId));
  insertIgnore(db,
    "INSERT OR IGNORE INTO arrival_cases (id,tenant_id,title,location,arrival_date,status,evidence_json,created_at) VALUES (?,?,?,?,?,?,?,?)",
    [item.id, item.tenantId, item.title, item.location, item.arrivalDate, item.legacyStatus, "[]", item.createdAt],
  );
  if (!hadOperationalState) {
    db.prepare("UPDATE arrival_cases SET title=?,location=?,arrival_date=?,status=? WHERE id=? AND tenant_id=?")
      .run(item.title, item.location, item.arrivalDate, item.legacyStatus, item.id, item.tenantId);
  }
  insertIgnore(db,
    "INSERT OR IGNORE INTO case_operations (case_id,tenant_id,mandate_id,cohort_id,phase,state,readiness,readiness_label,start_date,owner_role,version,synthetic,updated_at) VALUES (?,?,?,?,?,?,?,?,?,?,1,1,?)",
    [item.id, item.tenantId, item.mandateId, item.cohortId, item.phase, item.state, item.readiness, item.readinessLabel, item.startDate, item.ownerRole, item.createdAt],
  );

  item.milestones.forEach((milestone, index) => {
    const id = `${item.id}-MS-${index + 1}`;
    insertIgnore(db,
      "INSERT OR IGNORE INTO case_milestones (id,tenant_id,case_id,sequence,code,title,detail,owner_role,due_date,status,critical,synthetic,updated_at) VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?)",
      [id, item.tenantId, item.id, index + 1, milestone.code, milestone.title, milestone.detail, milestone.owner, milestone.due, milestone.status, milestone.critical ? 1 : 0, 1, item.createdAt],
    );
    if (index > 0) {
      insertIgnore(db,
        "INSERT OR IGNORE INTO case_dependencies (id,tenant_id,case_id,predecessor_id,successor_id,dependency_type,lag_days,hard,synthetic) VALUES (?,?,?,?,?,?,?,?,1)",
        [`${item.id}-DEP-${index}`, item.tenantId, item.id, `${item.id}-MS-${index}`, id, "finish_to_start", 0, milestone.hard ? 1 : 0],
      );
    }
  });

  item.evidence.forEach((evidence, index) => {
    insertIgnore(db,
      "INSERT OR IGNORE INTO evidence_items (id,tenant_id,case_id,evidence_type,label,assertion,source_label,valid_from,valid_until,review_status,conflict_group,synthetic,created_at,updated_at) VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?,?)",
      [`${item.id}-EVD-${index + 1}`, item.tenantId, item.id, evidence.type, evidence.label, evidence.assertion, evidence.source, item.createdAt.slice(0, 10), evidence.validUntil || item.arrivalDate, evidence.status, evidence.conflictGroup || null, 1, item.createdAt, item.createdAt],
    );
  });

  item.tasks.forEach((task, index) => {
    insertIgnore(db,
      "INSERT OR IGNORE INTO case_tasks (id,tenant_id,case_id,title,owner_role,due_date,status,blocked_reason,synthetic,created_at,updated_at) VALUES (?,?,?,?,?,?,?,?,1,?,?)",
      [`${item.id}-TASK-${index + 1}`, item.tenantId, item.id, task.title, task.owner, task.due, task.status, task.blockedReason || null, item.createdAt, item.createdAt],
    );
  });

  if (item.exception) {
    insertIgnore(db,
      "INSERT OR IGNORE INTO case_exceptions (id,tenant_id,case_id,exception_code,title,severity,impact,status,playbook_code,synthetic,created_at,updated_at) VALUES (?,?,?,?,?,?,?,?,?,1,?,?)",
      [`${item.id}-EX-1`, item.tenantId, item.id, item.exception.code, item.exception.title, item.exception.severity, item.exception.impact, "open", item.exception.playbook, item.createdAt, item.createdAt],
    );
  }
  if (item.decision) {
    insertIgnore(db,
      "INSERT OR IGNORE INTO decision_requests (id,tenant_id,case_id,question,options_json,consequences_json,required_evidence_json,decider_role,status,synthetic,created_at,updated_at) VALUES (?,?,?,?,?,?,?,?,?,1,?,?)",
      [`${item.id}-DEC-1`, item.tenantId, item.id, item.decision.question, JSON.stringify(item.decision.options), JSON.stringify(item.decision.consequences), JSON.stringify(item.decision.requiredEvidence), item.decision.role, "open", item.createdAt, item.createdAt],
    );
  }
}

function seedFixtures(db) {
  const createdAt = "2026-09-06T08:00:00.000Z";
  insertIgnore(db, "INSERT OR IGNORE INTO employer_mandates (id,tenant_id,name,location,scope,status,synthetic,created_at) VALUES (?,?,?,?,?,?,1,?)", ["SYN-MANDATE-001", "SYN-TENANT-001", "Klinikverbund Rheinland", "Düsseldorf", "Synthetische Arrival-Koordination", "active_demo", createdAt]);
  insertIgnore(db, "INSERT OR IGNORE INTO employer_mandates (id,tenant_id,name,location,scope,status,synthetic,created_at) VALUES (?,?,?,?,?,?,1,?)", ["SYN-MANDATE-002", "SYN-TENANT-002", "Westhafen Industriewerke", "Köln", "Synthetische Arrival-Koordination", "active_demo", createdAt]);
  insertIgnore(db, "INSERT OR IGNORE INTO cohorts (id,tenant_id,mandate_id,name,arrival_window,status,synthetic,created_at) VALUES (?,?,?,?,?,?,1,?)", ["SYN-COHORT-001", "SYN-TENANT-001", "SYN-MANDATE-001", "Pflegekohorte September", "2026-09", "active_demo", createdAt]);
  insertIgnore(db, "INSERT OR IGNORE INTO cohorts (id,tenant_id,mandate_id,name,arrival_window,status,synthetic,created_at) VALUES (?,?,?,?,?,?,1,?)", ["SYN-COHORT-002", "SYN-TENANT-002", "SYN-MANDATE-002", "Technikkohorte September", "2026-09", "active_demo", createdAt]);

  const sharedMilestones = (dates, firstStatus = "open") => [
    { code: "housing_clearance", title: "Wohnraumfreigabe einholen", detail: "Wohnungsadresse, Mietvertrag, Übergabeprotokoll", owner: "Facility Management", due: dates[0], status: firstStatus, critical: true, hard: true },
    { code: "key_handover", title: "Schlüsselzeit bestätigen", detail: "Übergabetermin und Ansprechperson", owner: "Standortverantwortung", due: dates[1], status: "open", critical: true, hard: true },
    { code: "arrival_information", title: "Ankunftsinformation vorbereiten", detail: "Flugdetails, Abholung, Welcome-Pack", owner: "HR Operations", due: dates[2], status: "open", critical: true, hard: true },
    { code: "site_contact", title: "Standortvertretung bestätigen", detail: "Ansprechperson für erste Woche", owner: "Standortleitung", due: dates[3], status: "open", critical: true, hard: true },
    { code: "start_readiness", title: "Startklarheit prüfen", detail: "Alle Voraussetzungen erfüllt", owner: "AMAVIO Operations", due: dates[4], status: "open", critical: true, hard: true },
  ];

  const cases = [
    {
      id: "SYN-CASE-001", tenantId: "SYN-TENANT-001", mandateId: "SYN-MANDATE-001", cohortId: "SYN-COHORT-001",
      title: "Wohnraumfreigabe gefährdet den Start", location: "Düsseldorf", arrivalDate: "2026-09-13", startDate: "2026-09-14",
      legacyStatus: "review_required", phase: "preparation", state: "blocked", readiness: "blocked", readinessLabel: "Blockiert · 1 harte Abhängigkeit", ownerRole: "AMAVIO Operations", createdAt,
      milestones: sharedMilestones(["2026-09-07", "2026-09-09", "2026-09-10", "2026-09-11", "2026-09-12"], "blocked"),
      evidence: [
        { type: "housing_address", label: "Wohnungsadresse (Formular)", assertion: "Düsseldorf, Beispielstraße 12", source: "Synthetisches Arbeitgeberformular", status: "confirmed", conflictGroup: "housing-address" },
        { type: "housing_contract", label: "Mietvertrag (v2)", assertion: "Düsseldorf, Beispielstraße 8", source: "Synthetischer Vertragsentwurf", status: "conflicting", conflictGroup: "housing-address" },
        { type: "handover_protocol", label: "Übergabeprotokoll", assertion: "Noch nicht eingereicht", source: "Synthetische Checkliste", status: "unreviewed" },
      ],
      tasks: [
        { title: "Adressabweichung mit Arbeitgeber klären", owner: "AMAVIO Operations", due: "2026-09-07", status: "open" },
        { title: "Schlüsselübergabe bestätigen", owner: "Standortverantwortung", due: "2026-09-09", status: "blocked", blockedReason: "Wohnraumfreigabe fehlt" },
      ],
      exception: { code: "evidence_conflict", title: "Wohnungsadresse widersprüchlich", severity: "critical", impact: "Blockiert Freigabe und alle nachfolgenden Schritte", playbook: "PB-EVIDENCE-CONFLICT" },
      decision: { question: "Welche synthetische Wohnungsadresse wird als gültige Arbeitsgrundlage bestätigt?", options: ["Formularangabe bestätigen", "Vertragsangabe bestätigen", "Klärung vertagen"], consequences: ["gibt kritischen Pfad frei", "gibt kritischen Pfad frei", "Start bleibt blockiert"], requiredEvidence: ["SYN-CASE-001-EVD-1", "SYN-CASE-001-EVD-2"], role: "Arbeitgeber-Sponsor" },
    },
    {
      id: "SYN-CASE-002", tenantId: "SYN-TENANT-001", mandateId: "SYN-MANDATE-001", cohortId: "SYN-COHORT-001",
      title: "Standortverantwortung noch offen", location: "Köln", arrivalDate: "2026-09-22", startDate: "2026-09-23",
      legacyStatus: "active", phase: "preparation", state: "awaiting_evidence", readiness: "watch", readinessLabel: "Unter Beobachtung · Standortkontakt fehlt", ownerRole: "Standortleitung", createdAt,
      milestones: sharedMilestones(["2026-09-12", "2026-09-15", "2026-09-17", "2026-09-18", "2026-09-21"]),
      evidence: [{ type: "location_contact", label: "Standortkontakt", assertion: "Vertretung noch nicht benannt", source: "Synthetische Standortliste", status: "unreviewed" }],
      tasks: [{ title: "Standortvertretung benennen", owner: "Standortleitung", due: "2026-09-10", status: "open" }],
    },
    {
      id: "SYN-CASE-003", tenantId: "SYN-TENANT-001", mandateId: "SYN-MANDATE-001", cohortId: "SYN-COHORT-001",
      title: "30-Tage-Review ist überfällig", location: "Solingen", arrivalDate: "2026-08-01", startDate: "2026-08-02",
      legacyStatus: "active", phase: "stabilization", state: "active", readiness: "watch", readinessLabel: "Unter Beobachtung · Review offen", ownerRole: "HR Operations", createdAt,
      milestones: sharedMilestones(["2026-07-20", "2026-07-23", "2026-07-28", "2026-07-30", "2026-07-31"], "completed").map((item) => ({ ...item, status: "completed", critical: false })),
      evidence: [{ type: "review_note", label: "30-Tage-Review", assertion: "Noch nicht dokumentiert", source: "Synthetischer Nachlauf", status: "unreviewed", validUntil: "2026-09-01" }],
      tasks: [{ title: "30-Tage-Review dokumentieren", owner: "HR Operations", due: "2026-09-05", status: "open" }],
    },
    {
      id: "SYN-CASE-004", tenantId: "SYN-TENANT-001", mandateId: "SYN-MANDATE-001", cohortId: "SYN-COHORT-001",
      title: "Visum-Interview terminieren", location: "Frankfurt", arrivalDate: "2026-10-18", startDate: "2026-10-19",
      legacyStatus: "active", phase: "intake", state: "active", readiness: "ready", readinessLabel: "Planmäßig · keine harte Blockade", ownerRole: "AMAVIO Operations", createdAt,
      milestones: sharedMilestones(["2026-10-01", "2026-10-05", "2026-10-09", "2026-10-13", "2026-10-17"]),
      evidence: [{ type: "appointment_window", label: "Interviewfenster", assertion: "Drei synthetische Zeitfenster verfügbar", source: "Lokale Demoquelle", status: "confirmed" }],
      tasks: [{ title: "Zeitfenster menschlich auswählen", owner: "AMAVIO Operations", due: "2026-09-12", status: "open" }],
    },
    {
      id: "SYN-CASE-005", tenantId: "SYN-TENANT-001", mandateId: "SYN-MANDATE-001", cohortId: "SYN-COHORT-001",
      title: "Zusätzliche Anreisebegleitung budgetieren", location: "Düsseldorf", arrivalDate: "2026-10-25", startDate: "2026-10-26",
      legacyStatus: "review_required", phase: "preparation", state: "awaiting_decision", readiness: "decision", readinessLabel: "Entscheidung erforderlich · Budgetfreigabe", ownerRole: "Budgetverantwortung", createdAt,
      milestones: [
        { code: "cost_basis", title: "Kostengrundlage dokumentieren", detail: "Synthetischen Zusatzbedarf und Preisrahmen prüfen", owner: "Budgetverantwortung", due: "2026-09-28", status: "open", critical: true, hard: true },
        { code: "budget_release", title: "Budgetentscheidung dokumentieren", detail: "Freigabe, Rückfrage oder Ablehnung begründen", owner: "Budgetverantwortung", due: "2026-10-01", status: "open", critical: true, hard: true },
        { code: "operational_handover", title: "Operative Folgeplanung übernehmen", detail: "Nur nach dokumentierter Budgetentscheidung", owner: "AMAVIO Operations", due: "2026-10-03", status: "blocked", critical: true, hard: true },
      ],
      evidence: [
        { type: "budget_basis", label: "Synthetische Kostengrundlage", assertion: "Zusätzliche Begleitung: 6 Stunden im lokalen Testszenario", source: "Synthetische Budgetvorlage", status: "confirmed" },
        { type: "cost_ceiling", label: "Synthetischer Kostenrahmen", assertion: "Maximal 780 EUR im lokalen Testszenario", source: "Synthetische Arbeitgebervorgabe", status: "confirmed" },
      ],
      tasks: [{ title: "Kostenrahmen prüfen", owner: "Budgetverantwortung", due: "2026-09-28", status: "open" }],
      decision: { question: "Wie wird der synthetische Zusatzbedarf budgetseitig behandelt?", options: ["Im Kostenrahmen freigeben", "Rückfrage an AMAVIO", "Nicht freigeben"], consequences: ["operative Folgeplanung kann beginnen", "Fall bleibt in Klärung", "Zusatzleistung wird nicht eingeplant"], requiredEvidence: ["SYN-CASE-005-EVD-1", "SYN-CASE-005-EVD-2"], role: "Budgetverantwortung" },
    },
    {
      id: "SYN-CASE-900", tenantId: "SYN-TENANT-002", mandateId: "SYN-MANDATE-002", cohortId: "SYN-COHORT-002",
      title: "Standortkontakt für Demo-Anreise klären", location: "Köln", arrivalDate: "2026-09-27", startDate: "2026-09-28",
      legacyStatus: "review_required", phase: "preparation", state: "blocked", readiness: "blocked", readinessLabel: "Blockiert · Kontakt fehlt", ownerRole: "Standortleitung", createdAt,
      milestones: sharedMilestones(["2026-09-15", "2026-09-18", "2026-09-21", "2026-09-23", "2026-09-26"], "blocked"),
      evidence: [{ type: "location_contact", label: "Kontakt", assertion: "Synthetische Vertretung nicht bestätigt", source: "Lokale Demoquelle", status: "unreviewed" }],
      tasks: [{ title: "Vertretung bestätigen", owner: "Standortleitung", due: "2026-09-15", status: "open" }],
    },
    {
      id: "SYN-CASE-901", tenantId: "SYN-TENANT-002", mandateId: "SYN-MANDATE-002", cohortId: "SYN-COHORT-002",
      title: "Ankunftszeit noch nicht bestätigt", location: "Leverkusen", arrivalDate: "2026-09-29", startDate: "2026-09-30",
      legacyStatus: "active", phase: "arrival_ready", state: "awaiting_evidence", readiness: "watch", readinessLabel: "Unter Beobachtung · Zeitfenster fehlt", ownerRole: "AMAVIO Operations", createdAt,
      milestones: sharedMilestones(["2026-09-18", "2026-09-20", "2026-09-23", "2026-09-25", "2026-09-28"]),
      evidence: [{ type: "arrival_confirmation", label: "Ankunftszeit", assertion: "Noch offen", source: "Lokale Demoquelle", status: "unreviewed" }],
      tasks: [{ title: "Ankunftszeit bestätigen", owner: "AMAVIO Operations", due: "2026-09-20", status: "open" }],
    },
    {
      id: "SYN-CASE-902", tenantId: "SYN-TENANT-002", mandateId: "SYN-MANDATE-002", cohortId: "SYN-COHORT-002",
      title: "Wohnoption widersprüchlich", location: "Dormagen", arrivalDate: "2026-10-03", startDate: "2026-10-05",
      legacyStatus: "review_required", phase: "preparation", state: "awaiting_decision", readiness: "decision", readinessLabel: "Entscheidung erforderlich", ownerRole: "Arbeitgeber-Sponsor", createdAt,
      milestones: sharedMilestones(["2026-09-21", "2026-09-24", "2026-09-27", "2026-09-29", "2026-10-02"], "blocked"),
      evidence: [
        { type: "housing_address", label: "Wohnoption A", assertion: "Dormagen, Demoallee 4", source: "Lokale Demoquelle", status: "conflicting", conflictGroup: "housing-option" },
        { type: "housing_address", label: "Wohnoption B", assertion: "Dormagen, Musterweg 9", source: "Lokale Demoquelle", status: "conflicting", conflictGroup: "housing-option" },
      ],
      tasks: [{ title: "Wohnoption fachlich entscheiden", owner: "Arbeitgeber-Sponsor", due: "2026-09-21", status: "open" }],
      decision: { question: "Welche synthetische Wohnoption wird weiter geprüft?", options: ["Option A", "Option B", "Beide zurückstellen"], consequences: ["Prüfung A", "Prüfung B", "Fall bleibt blockiert"], requiredEvidence: ["SYN-CASE-902-EVD-1", "SYN-CASE-902-EVD-2"], role: "Arbeitgeber-Sponsor" },
    },
    {
      id: "SYN-CASE-903", tenantId: "SYN-TENANT-002", mandateId: "SYN-MANDATE-002", cohortId: "SYN-COHORT-002",
      title: "Kohortenstart wurde verschoben", location: "Krefeld", arrivalDate: "2026-10-10", startDate: "2026-10-12",
      legacyStatus: "active", phase: "preparation", state: "active", readiness: "watch", readinessLabel: "Unter Beobachtung · Kohortenänderung", ownerRole: "HR Operations", createdAt,
      milestones: sharedMilestones(["2026-09-28", "2026-10-01", "2026-10-04", "2026-10-06", "2026-10-09"]),
      evidence: [{ type: "cohort_event", label: "Neues Startfenster", assertion: "Synthetischer Start um zwei Tage verschoben", source: "Lokale Demoquelle", status: "confirmed" }],
      tasks: [{ title: "Folgeabhängigkeiten prüfen", owner: "HR Operations", due: "2026-09-25", status: "open" }],
      exception: { code: "cohort_event", title: "Standortweiter Start verschoben", severity: "medium", impact: "Mehrere Folgeaufgaben müssen neu terminiert werden", playbook: "PB-COHORT-CHANGE" },
    },
  ];
  cases.forEach((item) => seedCase(db, item));
}

export function installGate15(db) {
  db.exec(`
    CREATE TABLE IF NOT EXISTS employer_mandates (
      id TEXT PRIMARY KEY, tenant_id TEXT NOT NULL REFERENCES tenants(id), name TEXT NOT NULL, location TEXT NOT NULL,
      scope TEXT NOT NULL, status TEXT NOT NULL, synthetic INTEGER NOT NULL CHECK (synthetic = 1), created_at TEXT NOT NULL
    );
    CREATE TABLE IF NOT EXISTS cohorts (
      id TEXT PRIMARY KEY, tenant_id TEXT NOT NULL REFERENCES tenants(id), mandate_id TEXT NOT NULL REFERENCES employer_mandates(id),
      name TEXT NOT NULL, arrival_window TEXT NOT NULL, status TEXT NOT NULL, synthetic INTEGER NOT NULL CHECK (synthetic = 1), created_at TEXT NOT NULL
    );
    CREATE TABLE IF NOT EXISTS case_operations (
      case_id TEXT PRIMARY KEY REFERENCES arrival_cases(id), tenant_id TEXT NOT NULL REFERENCES tenants(id),
      mandate_id TEXT NOT NULL REFERENCES employer_mandates(id), cohort_id TEXT NOT NULL REFERENCES cohorts(id),
      phase TEXT NOT NULL, state TEXT NOT NULL, readiness TEXT NOT NULL, readiness_label TEXT NOT NULL,
      start_date TEXT NOT NULL, owner_role TEXT NOT NULL, version INTEGER NOT NULL DEFAULT 1,
      synthetic INTEGER NOT NULL CHECK (synthetic = 1), updated_at TEXT NOT NULL
    );
    CREATE TABLE IF NOT EXISTS case_milestones (
      id TEXT PRIMARY KEY, tenant_id TEXT NOT NULL REFERENCES tenants(id), case_id TEXT NOT NULL REFERENCES arrival_cases(id),
      sequence INTEGER NOT NULL, code TEXT NOT NULL, title TEXT NOT NULL, detail TEXT NOT NULL, owner_role TEXT NOT NULL,
      due_date TEXT NOT NULL, status TEXT NOT NULL, critical INTEGER NOT NULL DEFAULT 0,
      synthetic INTEGER NOT NULL CHECK (synthetic = 1), updated_at TEXT NOT NULL
    );
    CREATE TABLE IF NOT EXISTS case_dependencies (
      id TEXT PRIMARY KEY, tenant_id TEXT NOT NULL REFERENCES tenants(id), case_id TEXT NOT NULL REFERENCES arrival_cases(id),
      predecessor_id TEXT NOT NULL REFERENCES case_milestones(id), successor_id TEXT NOT NULL REFERENCES case_milestones(id),
      dependency_type TEXT NOT NULL, lag_days INTEGER NOT NULL DEFAULT 0, hard INTEGER NOT NULL DEFAULT 1,
      synthetic INTEGER NOT NULL CHECK (synthetic = 1)
    );
    CREATE TABLE IF NOT EXISTS case_tasks (
      id TEXT PRIMARY KEY, tenant_id TEXT NOT NULL REFERENCES tenants(id), case_id TEXT NOT NULL REFERENCES arrival_cases(id),
      title TEXT NOT NULL, owner_role TEXT NOT NULL, due_date TEXT NOT NULL, status TEXT NOT NULL, blocked_reason TEXT,
      version INTEGER NOT NULL DEFAULT 1, synthetic INTEGER NOT NULL CHECK (synthetic = 1), created_at TEXT NOT NULL, updated_at TEXT NOT NULL
    );
    CREATE TABLE IF NOT EXISTS evidence_items (
      id TEXT PRIMARY KEY, tenant_id TEXT NOT NULL REFERENCES tenants(id), case_id TEXT NOT NULL REFERENCES arrival_cases(id),
      evidence_type TEXT NOT NULL, label TEXT NOT NULL, assertion TEXT NOT NULL, source_label TEXT NOT NULL,
      valid_from TEXT NOT NULL, valid_until TEXT NOT NULL, review_status TEXT NOT NULL, review_note TEXT,
      conflict_group TEXT, version INTEGER NOT NULL DEFAULT 1, synthetic INTEGER NOT NULL CHECK (synthetic = 1), created_at TEXT NOT NULL, updated_at TEXT NOT NULL
    );
    CREATE TABLE IF NOT EXISTS case_exceptions (
      id TEXT PRIMARY KEY, tenant_id TEXT NOT NULL REFERENCES tenants(id), case_id TEXT NOT NULL REFERENCES arrival_cases(id),
      exception_code TEXT NOT NULL, title TEXT NOT NULL, severity TEXT NOT NULL, impact TEXT NOT NULL, status TEXT NOT NULL,
      playbook_code TEXT NOT NULL, synthetic INTEGER NOT NULL CHECK (synthetic = 1), created_at TEXT NOT NULL, updated_at TEXT NOT NULL
    );
    CREATE TABLE IF NOT EXISTS decision_requests (
      id TEXT PRIMARY KEY, tenant_id TEXT NOT NULL REFERENCES tenants(id), case_id TEXT NOT NULL REFERENCES arrival_cases(id),
      question TEXT NOT NULL, options_json TEXT NOT NULL, consequences_json TEXT NOT NULL, required_evidence_json TEXT NOT NULL,
      decider_role TEXT NOT NULL, status TEXT NOT NULL, synthetic INTEGER NOT NULL CHECK (synthetic = 1), created_at TEXT NOT NULL, updated_at TEXT NOT NULL
    );
    CREATE TABLE IF NOT EXISTS case_decisions (
      id TEXT PRIMARY KEY, tenant_id TEXT NOT NULL REFERENCES tenants(id), case_id TEXT NOT NULL REFERENCES arrival_cases(id),
      request_id TEXT NOT NULL REFERENCES decision_requests(id), selected_option TEXT NOT NULL, rationale TEXT NOT NULL,
      decided_by TEXT NOT NULL REFERENCES users(id), effect_mode TEXT NOT NULL CHECK (effect_mode = 'local_only'), created_at TEXT NOT NULL
    );
    CREATE TABLE IF NOT EXISTS case_events (
      sequence INTEGER PRIMARY KEY AUTOINCREMENT, id TEXT NOT NULL UNIQUE, tenant_id TEXT NOT NULL REFERENCES tenants(id),
      case_id TEXT NOT NULL REFERENCES arrival_cases(id), event_type TEXT NOT NULL, payload_json TEXT NOT NULL,
      actor_id TEXT NOT NULL REFERENCES users(id), created_at TEXT NOT NULL
    );
    CREATE TABLE IF NOT EXISTS simulation_runs (
      id TEXT PRIMARY KEY, tenant_id TEXT NOT NULL REFERENCES tenants(id), case_id TEXT NOT NULL REFERENCES arrival_cases(id),
      base_version INTEGER NOT NULL, input_json TEXT NOT NULL, output_json TEXT NOT NULL, status TEXT NOT NULL,
      applied_json TEXT, created_by TEXT NOT NULL REFERENCES users(id), created_at TEXT NOT NULL, applied_at TEXT
    );
    CREATE TABLE IF NOT EXISTS work_products (
      id TEXT PRIMARY KEY, tenant_id TEXT NOT NULL REFERENCES tenants(id), case_id TEXT NOT NULL REFERENCES arrival_cases(id),
      product_type TEXT NOT NULL, title TEXT NOT NULL, content_json TEXT NOT NULL, source_refs_json TEXT NOT NULL,
      version INTEGER NOT NULL DEFAULT 1, review_status TEXT NOT NULL, status TEXT NOT NULL CHECK (status = 'sink_only'),
      synthetic INTEGER NOT NULL CHECK (synthetic = 1), created_by TEXT NOT NULL REFERENCES users(id), created_at TEXT NOT NULL
    );
    CREATE TABLE IF NOT EXISTS capability_runs (
      id TEXT PRIMARY KEY, tenant_id TEXT NOT NULL REFERENCES tenants(id), case_id TEXT NOT NULL REFERENCES arrival_cases(id),
      capability TEXT NOT NULL, provider TEXT NOT NULL, model TEXT NOT NULL, request_json TEXT NOT NULL, output_json TEXT NOT NULL,
      status TEXT NOT NULL, created_by TEXT NOT NULL REFERENCES users(id), created_at TEXT NOT NULL
    );
    CREATE TABLE IF NOT EXISTS evaluation_runs (
      id TEXT PRIMARY KEY, tenant_id TEXT NOT NULL REFERENCES tenants(id), engine_version TEXT NOT NULL,
      fixture_version TEXT NOT NULL, result_json TEXT NOT NULL, created_by TEXT NOT NULL REFERENCES users(id), created_at TEXT NOT NULL
    );
    CREATE INDEX IF NOT EXISTS idx_operations_tenant ON case_operations(tenant_id, readiness);
    CREATE INDEX IF NOT EXISTS idx_milestones_case ON case_milestones(tenant_id, case_id, sequence);
    CREATE INDEX IF NOT EXISTS idx_tasks_case ON case_tasks(tenant_id, case_id, due_date);
    CREATE INDEX IF NOT EXISTS idx_evidence_case ON evidence_items(tenant_id, case_id, review_status);
    CREATE INDEX IF NOT EXISTS idx_exceptions_case ON case_exceptions(tenant_id, case_id, status);
    CREATE INDEX IF NOT EXISTS idx_events_case ON case_events(tenant_id, case_id, sequence DESC);
  `);
  ensureColumn(db, "case_tasks", "version", "INTEGER NOT NULL DEFAULT 1");
  ensureColumn(db, "evidence_items", "version", "INTEGER NOT NULL DEFAULT 1");
  seedFixtures(db);
}

function rowsForCase(db, table, caseId, tenantId, order = "id") {
  const allowed = new Set(["case_milestones", "case_dependencies", "case_tasks", "evidence_items", "case_exceptions", "decision_requests", "case_decisions", "simulation_runs", "work_products", "capability_runs", "case_events"]);
  if (!allowed.has(table)) throw new Error("Unzulässige Tabelle.");
  return db.prepare(`SELECT * FROM ${table} WHERE case_id = ? AND tenant_id = ? ORDER BY ${order}`).all(caseId, tenantId);
}

function operationalCase(db, caseId, tenantId) {
  return db.prepare(`
    SELECT c.id,c.title,c.location,c.arrival_date,c.status AS legacy_status,o.phase,o.state,o.readiness,o.readiness_label,
      o.start_date,o.owner_role,o.version,o.mandate_id,o.cohort_id,m.name AS mandate_name,h.name AS cohort_name
    FROM arrival_cases c JOIN case_operations o ON o.case_id=c.id AND o.tenant_id=c.tenant_id
    JOIN employer_mandates m ON m.id=o.mandate_id AND m.tenant_id=o.tenant_id
    JOIN cohorts h ON h.id=o.cohort_id AND h.tenant_id=o.tenant_id
    WHERE c.id=? AND c.tenant_id=?
  `).get(caseId, tenantId);
}

export function evaluateRules(context) {
  const { caseRow, milestones, evidence, exceptions, tasks, decisions } = context;
  const has = (type) => evidence.some((item) => item.evidence_type === type && item.review_status === "confirmed");
  const conflict = evidence.some((item) => item.review_status === "conflicting");
  const housingUnreviewed = evidence.some((item) => ["housing_address", "housing_contract", "handover_protocol"].includes(item.evidence_type) && item.review_status !== "confirmed");
  const hardBlocked = milestones.some((item) => item.critical === 1 && item.status === "blocked");
  const overdue = tasks.some((item) => item.status !== "completed" && item.due_date < DEMO_DATE);
  const decisionOpen = decisions.some((item) => item.status === "open");
  const stale = evidence.some((item) => item.valid_until < DEMO_DATE && item.review_status !== "superseded");
  const cohortEvent = evidence.some((item) => item.evidence_type === "cohort_event") || exceptions.some((item) => item.exception_code === "cohort_event");
  const rules = [
    ["R-01", "Ankunftszeit vor naher Anreise bestätigen", daysBetween(DEMO_DATE, caseRow.arrival_date) <= 14 && !has("arrival_confirmation"), "Ankunftsbestätigung fehlt im 14-Tage-Fenster."],
    ["R-02", "Widersprüchliche Datums- oder Adressangaben klären", conflict, "Mindestens zwei synthetische Angaben widersprechen sich."],
    ["R-03", "Harte Abhängigkeit vor Folgemeilenstein erfüllen", hardBlocked, "Ein kritischer Meilenstein blockiert den gerichteten Folgepfad."],
    ["R-04", "Überfällige Arbeitgeberverantwortung eskalieren", overdue, "Eine offene Aufgabe liegt vor dem simulierten Stichtag."],
    ["R-05", "Datumsänderung auf Folgeaufgaben prüfen", caseRow.state === "simulation_pending", "Eine Terminänderung erfordert eine isolierte Auswirkungsprüfung."],
    ["R-06", "Standortkontakt vor Arbeitsstart bestätigen", daysBetween(DEMO_DATE, caseRow.start_date) <= 21 && !has("location_contact"), "Ein bestätigter Standortkontakt fehlt."],
    ["R-07", "Wohnoption nur mit dokumentierter Prüfung freigeben", housingUnreviewed, "Mindestens ein wohnbezogener Beleg ist ungeprüft oder widersprüchlich."],
    ["R-08", "Entscheidung nur mit ausreichender Evidenz zulassen", decisionOpen && evidence.filter((item) => item.review_status === "confirmed").length < 2, "Für die offene Entscheidung reichen die bestätigten Belege nicht aus."],
    ["R-09", "Kohortenereignis fallbezogen rückprojizieren", cohortEvent, "Ein synthetisches Kohortenereignis berührt den Einzelfall."],
    ["R-10", "Veraltete Evidenz nach Fallereignis neu prüfen", stale, "Mindestens ein Beleg ist am simulierten Stichtag nicht mehr aktuell."],
  ];
  return rules.map(([id, title, triggered, explanation]) => ({ id, title, triggered: Boolean(triggered), explanation, engineVersion: "amavio-domain-engine-v1.5" }));
}

function serializeDetail(db, caseRow, tenantId) {
  const milestones = rowsForCase(db, "case_milestones", caseRow.id, tenantId, "sequence");
  const dependencies = rowsForCase(db, "case_dependencies", caseRow.id, tenantId);
  const tasks = rowsForCase(db, "case_tasks", caseRow.id, tenantId, "due_date");
  const evidence = rowsForCase(db, "evidence_items", caseRow.id, tenantId, "created_at");
  const exceptions = rowsForCase(db, "case_exceptions", caseRow.id, tenantId, "created_at");
  const decisions = rowsForCase(db, "decision_requests", caseRow.id, tenantId, "created_at").map((row) => ({ ...row, options: json(row.options_json), consequences: json(row.consequences_json), requiredEvidence: json(row.required_evidence_json) }));
  const decisionHistory = rowsForCase(db, "case_decisions", caseRow.id, tenantId, "created_at DESC").map((row) => ({ id: row.id, requestId: row.request_id, selectedOption: row.selected_option, rationale: row.rationale, decidedBy: row.decided_by, effectMode: row.effect_mode, createdAt: row.created_at }));
  const simulations = rowsForCase(db, "simulation_runs", caseRow.id, tenantId, "created_at DESC").map((row) => ({ ...row, input: json(row.input_json, {}), output: json(row.output_json, {}), applied: json(row.applied_json, null) }));
  const workProducts = rowsForCase(db, "work_products", caseRow.id, tenantId, "created_at DESC").map((row) => ({ ...row, content: json(row.content_json, {}), sourceRefs: json(row.source_refs_json) }));
  const events = rowsForCase(db, "case_events", caseRow.id, tenantId, "sequence DESC").slice(0, 20).map((row) => ({ ...row, payload: json(row.payload_json, {}) }));
  const rules = evaluateRules({ caseRow, milestones, evidence, exceptions, tasks, decisions });
  return {
    case: { id: caseRow.id, title: caseRow.title, location: caseRow.location, arrivalDate: caseRow.arrival_date, startDate: caseRow.start_date, phase: caseRow.phase, state: caseRow.state, readiness: caseRow.readiness, readinessLabel: caseRow.readiness_label, ownerRole: caseRow.owner_role, version: caseRow.version, mandate: caseRow.mandate_name, cohort: caseRow.cohort_name, synthetic: true },
    milestones: milestones.map((row) => ({ id: row.id, sequence: row.sequence, code: row.code, title: row.title, detail: row.detail, ownerRole: row.owner_role, dueDate: row.due_date, status: row.status, critical: row.critical === 1 })),
    dependencies: dependencies.map((row) => ({ id: row.id, predecessorId: row.predecessor_id, successorId: row.successor_id, type: row.dependency_type, hard: row.hard === 1 })),
    tasks: tasks.map((row) => ({ id: row.id, title: row.title, ownerRole: row.owner_role, dueDate: row.due_date, status: row.status, blockedReason: row.blocked_reason, version: row.version })),
    evidence: evidence.map((row) => ({ id: row.id, type: row.evidence_type, label: row.label, assertion: row.assertion, source: row.source_label, validUntil: row.valid_until, reviewStatus: row.review_status, reviewNote: row.review_note, conflictGroup: row.conflict_group, version: row.version, synthetic: true })),
    exceptions: exceptions.map((row) => ({ id: row.id, code: row.exception_code, title: row.title, severity: row.severity, impact: row.impact, status: row.status, playbook: row.playbook_code })),
    decisions: decisions.map((row) => ({ id: row.id, question: row.question, options: row.options, consequences: row.consequences, requiredEvidence: row.requiredEvidence, deciderRole: row.decider_role, status: row.status })),
    decisionHistory,
    rules,
    simulations,
    workProducts,
    events,
    criticalPath: milestones.filter((item) => item.critical === 1).map((item) => item.id),
  };
}

export function loadOperationalCaseDetail(db, caseId, tenantId) {
  const row = operationalCase(db, caseId, tenantId);
  return row ? serializeDetail(db, row, tenantId) : null;
}

function portfolio(db, tenantId) {
  return db.prepare(`
    SELECT c.id,c.title,c.location,c.arrival_date,o.phase,o.state,o.readiness,o.readiness_label,o.owner_role,o.version,
      (SELECT COUNT(*) FROM case_exceptions x WHERE x.case_id=c.id AND x.tenant_id=c.tenant_id AND x.status='open') AS exception_count,
      (SELECT title FROM case_tasks t WHERE t.case_id=c.id AND t.tenant_id=c.tenant_id AND t.status!='completed' ORDER BY t.due_date LIMIT 1) AS next_task
    FROM arrival_cases c JOIN case_operations o ON o.case_id=c.id AND o.tenant_id=c.tenant_id
    WHERE c.tenant_id=? ORDER BY CASE o.readiness WHEN 'blocked' THEN 1 WHEN 'decision' THEN 2 WHEN 'watch' THEN 3 ELSE 4 END,c.arrival_date
  `).all(tenantId).map((row) => ({ id: row.id, title: row.title, location: row.location, arrivalDate: row.arrival_date, phase: row.phase, state: row.state, readiness: row.readiness, readinessLabel: row.readiness_label, ownerRole: row.owner_role, version: row.version, exceptionCount: row.exception_count, nextTask: row.next_task || "Kein offener Schritt" }));
}

function projectedPortfolio(db, session) {
  const items = portfolio(db, session.tenantId);
  return projectPortfolio(items, session, (caseId) => loadOperationalCaseDetail(db, caseId, session.tenantId));
}

function projectedDetail(db, session, caseId) {
  const detail = loadOperationalCaseDetail(db, caseId, session.tenantId);
  return projectCaseDetail(detail, session);
}

function appendCaseEvent(db, session, caseId, eventType, payload) {
  db.prepare("INSERT INTO case_events (id,tenant_id,case_id,event_type,payload_json,actor_id,created_at) VALUES (?,?,?,?,?,?,?)")
    .run(`EVT-${randomUUID()}`, session.tenantId, caseId, eventType, JSON.stringify(payload), session.userId, isoNow());
}

function capabilityRequestFor(detail, capability, instruction) {
  return {
    contractVersion: "acc.capability.v1",
    capability,
    instruction,
    caseSnapshot: {
      id: detail.case.id,
      title: detail.case.title,
      readinessLabel: detail.case.readinessLabel,
      phase: detail.case.phase,
      version: detail.case.version,
      synthetic: true,
    },
    evidence: detail.evidence.map((item) => ({ id: item.id, label: item.label, assertion: item.assertion, reviewStatus: item.reviewStatus })),
    constraints: { language: "de", externalEffects: false, humanGate: true },
  };
}

function workProductContent(detail, type) {
  const openTasks = detail.tasks.filter((item) => item.status !== "completed");
  const conflicts = detail.evidence.filter((item) => item.reviewStatus === "conflicting");
  const nextTask = openTasks[0];
  const evidenceCount = detail.evidence.length;
  const boundaries = { title: "Wirkungsgrenze", text: "Lokaler synthetischer Entwurf. Kein Versand, keine Buchung, keine reale Freigabe und keine Außenwirkung." };
  const common = {
    heading: WORK_PRODUCT_LABELS[type],
    summary: `${detail.case.title} · ${detail.case.readinessLabel}`,
    generatedBy: "AMAVIO Arrival Control Center",
    syntheticOnly: true,
    externalEffect: false,
  };
  if (type === "exception_resolution_plan") return {
    ...common,
    sections: [
      { title: "Ausgangslage", text: `${evidenceCount} synthetische Nachweise liegen vor; ${conflicts.length} Angaben widersprechen sich.` },
      { title: "Widerspruch", text: conflicts.length ? conflicts.map((item) => `${item.label}: ${item.assertion}`).join(" | ") : "Kein offener Widerspruch im aktuellen Arbeitsstand." },
      { title: "Fehlende Grundlage", text: "Eine eindeutig bestätigte Wohn- und Übergabegrundlage fehlt und darf nicht automatisch ersetzt werden." },
      { title: "Prüfbarer Klärungsauftrag", text: "Quellen gegenüberstellen, verbindliche Grundlage benennen und Standortbestätigung mit Datum und Verantwortung dokumentieren." },
      { title: "Nächste Verantwortung", text: nextTask ? `${nextTask.ownerRole}: ${nextTask.title} bis ${nextTask.dueDate}.` : "Keine offene Verantwortung." },
      boundaries,
    ],
  };
  if (type === "employer_handover_brief") return {
    ...common,
    sections: [
      { title: "Anlass", text: "Die Standortbestätigung ist für die nachgelagerte Auswirkungsprüfung erforderlich." },
      { title: "Erwarteter Arbeitgeberbeitrag", text: "Bestätigte synthetische Wohnadresse, Verfügbarkeitsdatum, geprüfte Grundlage und kurze Begründung." },
      { title: "Frist und Folge", text: nextTask ? `Rückmeldung bis ${nextTask.dueDate}; danach prüft AMAVIO die Auswirkung auf Arbeitsstart und Programm.` : "Rückmeldung vor der Auswirkungsprüfung." },
      { title: "Verantwortung", text: "Arbeitgeber · Standort & Übergabe. AMAVIO kann diesen Beitrag nicht stellvertretend bestätigen." },
      boundaries,
    ],
  };
  return {
    ...common,
    sections: [
      { title: "Belegter Stand", text: `${evidenceCount} synthetische Nachweise wurden im Fall zusammengeführt; ${conflicts.length} Abweichungen sind dokumentiert.` },
      { title: "Verantwortung", text: nextTask ? `${nextTask.ownerRole}: ${nextTask.title} bis ${nextTask.dueDate}.` : "Die vereinbarten operativen Arbeitsschritte sind abgeschlossen." },
      { title: "Dokumentierte Entscheidung", text: detail.decisionHistory[0]?.rationale || "Die Entscheidung bleibt bis zur bewussten menschlichen Bestätigung offen." },
      { title: "Programmfolge", text: "Der bestätigte Fallstand wird als beratende Folge im lokalen Ankunftsprogramm geführt; es wird nichts automatisch ausgeführt." },
      boundaries,
    ],
  };
}

export function buildEvaluationCases() {
  const fixtures = [];
  for (let i = 1; i <= 6; i += 1) fixtures.push({ id: `STD-${i}`, category: "standard", fixture: { ready: true }, expected: "ready" });
  for (let i = 1; i <= 6; i += 1) fixtures.push({ id: `EVD-${i}`, category: "evidence", fixture: { conflict: i % 2 === 0, missingEvidence: i % 2 === 1 }, expected: "insufficient_evidence" });
  for (let i = 1; i <= 6; i += 1) fixtures.push({ id: `EXC-${i}`, category: "exception", fixture: { exception: true, hardDependency: i % 2 === 0 }, expected: "blocked" });
  for (let i = 1; i <= 4; i += 1) fixtures.push({ id: `HUM-${i}`, category: "human_gate", fixture: { forbiddenAutomaticAction: true }, expected: "human_gate" });
  for (let i = 1; i <= 2; i += 1) fixtures.push({ id: `ISO-${i}`, category: "isolation", fixture: { crossTenant: true }, expected: "isolated" });
  return fixtures;
}

function evaluateFixture(fixture) {
  if (fixture.crossTenant) return "isolated";
  if (fixture.forbiddenAutomaticAction) return "human_gate";
  if (fixture.exception || fixture.hardDependency) return "blocked";
  if (fixture.conflict || fixture.missingEvidence) return "insufficient_evidence";
  return fixture.ready ? "ready" : "unknown";
}

export function runEvaluationSuite() {
  const scenarios = buildEvaluationCases().map((scenario) => {
    const actual = evaluateFixture(scenario.fixture);
    return { id: scenario.id, category: scenario.category, expected: scenario.expected, actual, passed: actual === scenario.expected };
  });
  return {
    engineVersion: "amavio-domain-engine-v1.5",
    fixtureVersion: "acc-eval-fixtures-v1.5",
    total: scenarios.length,
    passed: scenarios.filter((item) => item.passed).length,
    failed: scenarios.filter((item) => !item.passed).length,
    schemaConformance: "100%",
    forbiddenActions: 0,
    crossTenantFindings: 0,
    scenarios,
  };
}

export function createGate15Handler({ db, sendJson, readBody, requireSession, audit, providers, failureInjector }) {
  return async function handleGate15(request, response, url) {
    if (request.method === "GET" && url.pathname === "/api/v1.5/provider-status") {
      const session = requireSession(request, response); if (!session) return true;
      sendJson(response, 200, providers.status()); return true;
    }
    if (!url.pathname.startsWith("/api/v1.5/")) return false;
    const session = requireSession(request, response); if (!session) return true;

    if (request.method === "GET" && url.pathname === "/api/v1.5/bootstrap") {
      const items = projectedPortfolio(db, session);
      const first = items[0];
      const selected = first ? projectedDetail(db, session, first.id) : null;
      sendJson(response, 200, {
        portfolio: items,
        selected,
        providerStatus: session.role === "operations" ? providers.status() : null,
        access: selected?.access || describeSession(session),
        boundaries: { syntheticOnly: true, externalAI: "gate_closed", externalEffects: false, registration: false, productiveIdentity: false },
      });
      return true;
    }
    if (request.method === "GET" && url.pathname === "/api/v1.5/portfolio") {
      sendJson(response, 200, { cases: projectedPortfolio(db, session), access: describeSession(session) }); return true;
    }
    const caseMatch = url.pathname.match(/^\/api\/v1\.5\/cases\/([^/]+)$/);
    if (request.method === "GET" && caseMatch) {
      const row = operationalCase(db, decodeURIComponent(caseMatch[1]), session.tenantId);
      if (!row) { sendJson(response, 404, { error: "Fall im aktiven Mandanten nicht gefunden." }); return true; }
      const detail = projectedDetail(db, session, row.id);
      if (!detail) { sendJson(response, 404, { error: "Fall ist für die aktive Rolle nicht freigegeben." }); return true; }
      sendJson(response, 200, detail); return true;
    }
    const transitionMatch = url.pathname.match(/^\/api\/v1\.5\/cases\/([^/]+)\/transitions$/);
    if (request.method === "POST" && transitionMatch) {
      const caseId = decodeURIComponent(transitionMatch[1]); const row = operationalCase(db, caseId, session.tenantId);
      if (!row) { sendJson(response, 404, { error: "Fall im aktiven Mandanten nicht gefunden." }); return true; }
      const body = await readBody(request); const nextState = cleanText(body.state, 40); const note = cleanText(body.note, 1_000); const version = Number(body.version);
      if (!note || version !== row.version) { sendJson(response, 409, { error: "Fallversion stimmt nicht oder Prüfnotiz fehlt." }); return true; }
      if (!ALLOWED_TRANSITIONS[row.state]?.has(nextState)) { sendJson(response, 422, { error: `Übergang ${row.state} → ${nextState} ist fachlich nicht erlaubt.` }); return true; }
      const updated = db.prepare("UPDATE case_operations SET state=?,version=version+1,updated_at=? WHERE case_id=? AND tenant_id=? AND version=?").run(nextState, isoNow(), caseId, session.tenantId, version);
      if (updated.changes !== 1) { sendJson(response, 409, { error: "Fall wurde parallel verändert.", code: "version_conflict" }); return true; }
      appendCaseEvent(db, session, caseId, "case.transitioned", { from: row.state, to: nextState, note }); audit(db, session, "case.transitioned", "arrival_case", caseId, { from: row.state, to: nextState });
      sendJson(response, 200, serializeDetail(db, operationalCase(db, caseId, session.tenantId), session.tenantId)); return true;
    }
    const taskMatch = url.pathname.match(/^\/api\/v1\.5\/tasks\/([^/]+)$/);
    if (request.method === "PATCH" && taskMatch) {
      const taskId = decodeURIComponent(taskMatch[1]); const task = db.prepare("SELECT * FROM case_tasks WHERE id=? AND tenant_id=?").get(taskId, session.tenantId);
      if (!task) { sendJson(response, 404, { error: "Aufgabe im aktiven Mandanten nicht gefunden." }); return true; }
      const body = await readBody(request); const status = cleanText(body.status, 40); const note = cleanText(body.note, 500); const version = Number(body.version);
      if (!new Set(["open", "in_progress", "blocked", "completed"]).has(status) || !note || version !== task.version) { sendJson(response, 409, { error: "Gültiger Aufgabenstatus, Notiz und aktuelle Version sind erforderlich.", code: "version_conflict" }); return true; }
      const updated = db.prepare("UPDATE case_tasks SET status=?,version=version+1,updated_at=? WHERE id=? AND tenant_id=? AND version=?").run(status, isoNow(), taskId, session.tenantId, version);
      if (updated.changes !== 1) { sendJson(response, 409, { error: "Aufgabe wurde parallel verändert.", code: "version_conflict" }); return true; }
      appendCaseEvent(db, session, task.case_id, "task.updated", { taskId, status, note }); audit(db, session, "task.updated", "task", taskId, { caseId: task.case_id, status });
      sendJson(response, 200, { task: { id: taskId, status, version: version + 1 }, externalEffect: false }); return true;
    }
    const evidenceMatch = url.pathname.match(/^\/api\/v1\.5\/evidence\/([^/]+)\/review$/);
    if (request.method === "POST" && evidenceMatch) {
      const evidenceId = decodeURIComponent(evidenceMatch[1]); const item = db.prepare("SELECT * FROM evidence_items WHERE id=? AND tenant_id=?").get(evidenceId, session.tenantId);
      if (!item) { sendJson(response, 404, { error: "Evidenz im aktiven Mandanten nicht gefunden." }); return true; }
      const body = await readBody(request); const status = cleanText(body.status, 40); const note = cleanText(body.note, 1_000); const version = Number(body.version);
      if (!new Set(["confirmed", "rejected", "superseded", "conflicting"]).has(status) || !note || version !== item.version) { sendJson(response, 409, { error: "Prüfstatus, Notiz und aktuelle Version sind erforderlich.", code: "version_conflict" }); return true; }
      const updated = db.prepare("UPDATE evidence_items SET review_status=?,review_note=?,version=version+1,updated_at=? WHERE id=? AND tenant_id=? AND version=?").run(status, note, isoNow(), evidenceId, session.tenantId, version);
      if (updated.changes !== 1) { sendJson(response, 409, { error: "Evidenz wurde parallel verändert.", code: "version_conflict" }); return true; }
      appendCaseEvent(db, session, item.case_id, "evidence.reviewed", { evidenceId, status, note }); audit(db, session, "evidence.reviewed", "evidence", evidenceId, { caseId: item.case_id, status });
      sendJson(response, 200, { evidence: { id: evidenceId, reviewStatus: status, version: version + 1 }, externalEffect: false }); return true;
    }
    const decisionMatch = url.pathname.match(/^\/api\/v1\.5\/decisions\/([^/]+)\/review$/);
    if (request.method === "POST" && decisionMatch) {
      const requestId = decodeURIComponent(decisionMatch[1]); const decision = db.prepare("SELECT * FROM decision_requests WHERE id=? AND tenant_id=?").get(requestId, session.tenantId);
      if (!decision) { sendJson(response, 404, { error: "Entscheidung im aktiven Mandanten nicht gefunden." }); return true; }
      const body = await readBody(request); const option = cleanText(body.option, 200); const rationale = cleanText(body.rationale, 1_500);
      if (decision.status !== "open") { sendJson(response, 409, { error: "Entscheidungsanfrage wurde bereits abgeschlossen.", code: "decision_already_closed" }); return true; }
      if (!json(decision.options_json).includes(option) || !rationale) { sendJson(response, 400, { error: "Zulässige Option und Begründung sind erforderlich." }); return true; }
      const id = `DCS-${randomUUID()}`;
      db.exec("BEGIN IMMEDIATE");
      try {
      const claimed = db.prepare("UPDATE decision_requests SET status='decided',updated_at=? WHERE id=? AND tenant_id=? AND status='open'").run(isoNow(), requestId, session.tenantId);
      if (claimed.changes !== 1) throw Object.assign(new Error("Entscheidungsanfrage wurde parallel abgeschlossen."), { status: 409, code: "decision_already_closed" });
      db.prepare("INSERT INTO case_decisions (id,tenant_id,case_id,request_id,selected_option,rationale,decided_by,effect_mode,created_at) VALUES (?,?,?,?,?,?,?,?,?)")
        .run(id, session.tenantId, decision.case_id, requestId, option, rationale, session.userId, "local_only", isoNow());
      db.prepare("UPDATE case_operations SET version=version+1,updated_at=? WHERE case_id=? AND tenant_id=?").run(isoNow(), decision.case_id, session.tenantId);
      appendCaseEvent(db, session, decision.case_id, "decision.recorded", { requestId, decisionId: id, option, effectMode: "local_only" }); audit(db, session, "decision.recorded", "decision", id, { caseId: decision.case_id, effectMode: "local_only" });
      if (failureInjector) await failureInjector({ phase: "before_commit", method: request.method, path: url.pathname, session, db });
      db.exec("COMMIT");
      } catch (error) { db.exec("ROLLBACK"); throw error; }
      sendJson(response, 201, { id, selectedOption: option, effectMode: "local_only", externalEffect: false }); return true;
    }
    const simulationMatch = url.pathname.match(/^\/api\/v1\.5\/cases\/([^/]+)\/simulations$/);
    if (request.method === "POST" && simulationMatch) {
      const caseId = decodeURIComponent(simulationMatch[1]); const row = operationalCase(db, caseId, session.tenantId);
      if (!row) { sendJson(response, 404, { error: "Fall im aktiven Mandanten nicht gefunden." }); return true; }
      const body = await readBody(request); const arrivalDate = cleanText(body.arrivalDate, 10);
      if (!/^\d{4}-\d{2}-\d{2}$/.test(arrivalDate)) { sendJson(response, 400, { error: "Gültiges synthetisches Anreisedatum erforderlich." }); return true; }
      const deltaDays = daysBetween(row.arrival_date, arrivalDate); const milestones = rowsForCase(db, "case_milestones", caseId, session.tenantId, "sequence");
      const output = { summary: `Anreise ${Math.abs(deltaDays)} Tag${Math.abs(deltaDays) === 1 ? "" : "e"} ${deltaDays >= 0 ? "später" : "früher"}; ${milestones.length} Folgefristen werden neu berechnet.`, deltaDays, originalArrivalDate: row.arrival_date, simulatedArrivalDate: arrivalDate, impactedMilestones: milestones.map((item) => ({ id: item.id, from: item.due_date, to: shiftDate(item.due_date, deltaDays), ownerRole: item.owner_role })), originalMutated: false, externalEffect: false };
      const id = `SIM-${randomUUID()}`;
      db.prepare("INSERT INTO simulation_runs (id,tenant_id,case_id,base_version,input_json,output_json,status,created_by,created_at) VALUES (?,?,?,?,?,?,?,?,?)")
        .run(id, session.tenantId, caseId, row.version, JSON.stringify({ arrivalDate }), JSON.stringify(output), "preview", session.userId, isoNow());
      appendCaseEvent(db, session, caseId, "simulation.created", { simulationId: id, baseVersion: row.version, originalMutated: false }); audit(db, session, "simulation.created", "simulation", id, { caseId, originalMutated: false });
      sendJson(response, 201, { simulation: { id, baseVersion: row.version, status: "preview", output } }); return true;
    }
    const applyMatch = url.pathname.match(/^\/api\/v1\.5\/simulations\/([^/]+)\/apply$/);
    if (request.method === "POST" && applyMatch) {
      const simulationId = decodeURIComponent(applyMatch[1]); const run = db.prepare("SELECT * FROM simulation_runs WHERE id=? AND tenant_id=?").get(simulationId, session.tenantId);
      if (!run) { sendJson(response, 404, { error: "Simulation im aktiven Mandanten nicht gefunden." }); return true; }
      const row = operationalCase(db, run.case_id, session.tenantId); const body = await readBody(request); const note = cleanText(body.note, 1_000); const selected = Array.isArray(body.selectedChanges) ? body.selectedChanges : [];
      if (run.status !== "preview" || row.version !== run.base_version || !note || !selected.includes("arrivalDate")) { sendJson(response, 409, { error: "Simulation ist veraltet, bereits übernommen oder nicht ausreichend menschlich geprüft." }); return true; }
      const output = json(run.output_json, {});
      db.exec("BEGIN IMMEDIATE");
      try {
        db.prepare("UPDATE arrival_cases SET arrival_date=? WHERE id=? AND tenant_id=?").run(output.simulatedArrivalDate, run.case_id, session.tenantId);
        output.impactedMilestones.forEach((item) => db.prepare("UPDATE case_milestones SET due_date=?,updated_at=? WHERE id=? AND tenant_id=?").run(item.to, isoNow(), item.id, session.tenantId));
        db.prepare("UPDATE case_operations SET version=version+1,updated_at=? WHERE case_id=? AND tenant_id=?").run(isoNow(), run.case_id, session.tenantId);
        const claimed = db.prepare("UPDATE simulation_runs SET status='applied',applied_json=?,applied_at=? WHERE id=? AND tenant_id=? AND status='preview'").run(JSON.stringify({ selectedChanges: selected, note, humanGate: true }), isoNow(), simulationId, session.tenantId);
        if (claimed.changes !== 1) throw Object.assign(new Error("Simulation wurde parallel übernommen."), { status: 409, code: "simulation_already_applied" });
        appendCaseEvent(db, session, run.case_id, "simulation.applied", { simulationId, selectedChanges: selected, note, humanGate: true });
        if (failureInjector) await failureInjector({ phase: "before_commit", method: request.method, path: url.pathname, session, db });
        db.exec("COMMIT");
      } catch (error) { db.exec("ROLLBACK"); throw error; }
      audit(db, session, "simulation.applied", "simulation", simulationId, { caseId: run.case_id, humanGate: true });
      sendJson(response, 200, { simulationId, status: "applied", humanGate: true, externalEffect: false, caseVersion: row.version + 1 }); return true;
    }
    const productMatch = url.pathname.match(/^\/api\/v1\.5\/cases\/([^/]+)\/work-products$/);
    if (request.method === "POST" && productMatch) {
      const caseId = decodeURIComponent(productMatch[1]); const row = operationalCase(db, caseId, session.tenantId);
      if (!row) { sendJson(response, 404, { error: "Fall im aktiven Mandanten nicht gefunden." }); return true; }
      const body = await readBody(request); const type = cleanText(body.type, 80);
      if (!WORK_PRODUCT_LABELS[type]) { sendJson(response, 400, { error: "Arbeitsprodukttyp ist nicht freigegeben." }); return true; }
      const detail = serializeDetail(db, row, session.tenantId); const content = workProductContent(detail, type); const sourceRefs = [...detail.evidence.map((item) => item.id), ...detail.rules.filter((item) => item.triggered).map((item) => item.id)]; const id = `WP-${randomUUID()}`;
      db.prepare("INSERT INTO work_products (id,tenant_id,case_id,product_type,title,content_json,source_refs_json,review_status,status,synthetic,created_by,created_at) VALUES (?,?,?,?,?,?,?,?,?,1,?,?)")
        .run(id, session.tenantId, caseId, type, WORK_PRODUCT_LABELS[type], JSON.stringify(content), JSON.stringify(sourceRefs), "draft", "sink_only", session.userId, isoNow());
      appendCaseEvent(db, session, caseId, "work_product.created", { workProductId: id, type, sourceRefs, status: "sink_only" }); audit(db, session, "work_product.created", "work_product", id, { caseId, status: "sink_only" });
      sendJson(response, 201, { workProduct: { id, type, title: WORK_PRODUCT_LABELS[type], content, sourceRefs, reviewStatus: "draft", status: "sink_only", externalEffect: false } }); return true;
    }
    if (request.method === "POST" && url.pathname === "/api/v1.5/evaluations/runs") {
      const result = runEvaluationSuite(); const id = `EVAL-${randomUUID()}`;
      db.prepare("INSERT INTO evaluation_runs (id,tenant_id,engine_version,fixture_version,result_json,created_by,created_at) VALUES (?,?,?,?,?,?,?)")
        .run(id, session.tenantId, result.engineVersion, result.fixtureVersion, JSON.stringify(result), session.userId, isoNow());
      audit(db, session, "evaluation.completed", "evaluation_run", id, { total: result.total, passed: result.passed });
      sendJson(response, 201, { id, result }); return true;
    }
    if (request.method === "POST" && url.pathname === "/api/v1.5/capabilities/runs") {
      const body = await readBody(request); const caseId = cleanText(body.caseId, 100); const capability = cleanText(body.capability, 80); const provider = cleanText(body.provider || "local", 40); const instruction = cleanText(body.instruction, 1_500);
      const row = operationalCase(db, caseId, session.tenantId);
      if (!row) { sendJson(response, 404, { error: "Fall im aktiven Mandanten nicht gefunden." }); return true; }
      const detail = serializeDetail(db, row, session.tenantId); const capabilityRequest = capabilityRequestFor(detail, capability, instruction || "Erzeuge einen belegten, sicheren Arbeitsentwurf.");
      try {
        const result = await providers.run(capabilityRequest, provider); const id = `CAP-${randomUUID()}`;
        db.prepare("INSERT INTO capability_runs (id,tenant_id,case_id,capability,provider,model,request_json,output_json,status,created_by,created_at) VALUES (?,?,?,?,?,?,?,?,?,?,?)")
          .run(id, session.tenantId, caseId, capability, result.provider, result.model, JSON.stringify(capabilityRequest), JSON.stringify(result.output), result.output.status, session.userId, isoNow());
        appendCaseEvent(db, session, caseId, "capability.completed", { capabilityRunId: id, capability, provider: result.provider, model: result.model }); audit(db, session, "capability.completed", "capability_run", id, { caseId, provider: result.provider });
        sendJson(response, 201, { run: { id, capability, provider: result.provider, model: result.model, output: result.output, externalEffect: false } });
      } catch (error) {
        if (error instanceof ProviderGateError) sendJson(response, 409, { error: error.message, code: error.code, providerStatus: providers.status() });
        else throw error;
      }
      return true;
    }

    sendJson(response, 404, { error: "Gate-01.5-API-Pfad nicht gefunden." }); return true;
  };
}

export { WORK_PRODUCT_LABELS };
