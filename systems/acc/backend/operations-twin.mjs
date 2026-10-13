import { randomUUID } from "node:crypto";

const json = (value, fallback = []) => { try { return JSON.parse(value); } catch { return fallback; } };
const text = (value, max = 1_500) => String(value || "").trim().slice(0, max);

const PLAYBOOKS = Object.freeze({
  evidence_conflict: [
    ["AMAVIO Operations", "Widersprüchliche Quellen in einer Klärungsakte zusammenführen"],
    ["Arbeitgeber-Sponsor", "Gültige Arbeitsgrundlage mit Begründung bestätigen"],
    ["Standort", "Übergabeadresse und Schlüsselzeit erneut bestätigen"],
  ],
  location_gap: [
    ["Standort", "Vertretung und Erreichbarkeit benennen"],
    ["HR", "Starttag und Welcome-Verantwortung abgleichen"],
    ["AMAVIO Operations", "Kritischen Pfad nach Bestätigung neu berechnen"],
  ],
  arrival_shift: [
    ["AMAVIO Operations", "Terminverschiebung gegen alle Folgeabhängigkeiten simulieren"],
    ["HR", "Startdatum und interne Vorbereitung prüfen"],
    ["Standort", "Übergabe- und Ankunftsfenster neu bestätigen"],
  ],
  review_overdue: [
    ["HR", "30-Tage-Review dokumentieren"],
    ["AMAVIO Operations", "Offene Maßnahmen in den Stabilisierungsplan übernehmen"],
  ],
  budget_decision: [
    ["Budget", "Synthetische Kostengrundlage gegen Kostenrahmen prüfen"],
    ["Arbeitgeber-Sponsor", "Zusatzbedarf fachlich priorisieren"],
    ["AMAVIO Operations", "Folgeplanung erst nach Budgetentscheidung vorbereiten"],
  ],
});

function seedEvent(db, item) {
  db.prepare(`INSERT OR IGNORE INTO twin_events
    (id,tenant_id,cohort_id,event_type,title,severity,occurred_at,case_ids_json,evidence_refs_json,summary,status,version,synthetic)
    VALUES (?,?,?,?,?,?,?,?,?,?,?,1,1)`)
    .run(item.id, item.tenantId, item.cohortId, item.type, item.title, item.severity, item.occurredAt, JSON.stringify(item.caseIds), JSON.stringify(item.evidenceRefs), item.summary, "open");
}

export function installOperationsTwin(db) {
  db.exec(`
    CREATE TABLE IF NOT EXISTS twin_cohorts (
      id TEXT PRIMARY KEY, tenant_id TEXT NOT NULL REFERENCES tenants(id), name TEXT NOT NULL,
      planned_arrivals INTEGER NOT NULL, window_label TEXT NOT NULL, synthetic INTEGER NOT NULL CHECK (synthetic = 1)
    );
    CREATE TABLE IF NOT EXISTS twin_events (
      id TEXT PRIMARY KEY, tenant_id TEXT NOT NULL REFERENCES tenants(id), cohort_id TEXT NOT NULL,
      event_type TEXT NOT NULL, title TEXT NOT NULL, severity TEXT NOT NULL,
      occurred_at TEXT NOT NULL, case_ids_json TEXT NOT NULL, evidence_refs_json TEXT NOT NULL,
      summary TEXT NOT NULL, status TEXT NOT NULL, version INTEGER NOT NULL DEFAULT 1,
      synthetic INTEGER NOT NULL CHECK (synthetic = 1)
    );
    CREATE TABLE IF NOT EXISTS twin_work_plans (
      id TEXT PRIMARY KEY, tenant_id TEXT NOT NULL REFERENCES tenants(id), cohort_id TEXT NOT NULL,
      event_id TEXT NOT NULL REFERENCES twin_events(id), case_ids_json TEXT NOT NULL, plan_json TEXT NOT NULL,
      status TEXT NOT NULL, version INTEGER NOT NULL DEFAULT 1, created_by TEXT NOT NULL REFERENCES users(id), created_at TEXT NOT NULL,
      review_decision TEXT, review_note TEXT, reviewed_by TEXT, reviewed_at TEXT
    );
    CREATE TABLE IF NOT EXISTS twin_simulations (
      id TEXT PRIMARY KEY, tenant_id TEXT NOT NULL REFERENCES tenants(id), cohort_id TEXT NOT NULL,
      scenario_json TEXT NOT NULL, result_json TEXT NOT NULL, status TEXT NOT NULL,
      created_by TEXT NOT NULL REFERENCES users(id), created_at TEXT NOT NULL
    );
    CREATE INDEX IF NOT EXISTS idx_twin_events_tenant ON twin_events(tenant_id,occurred_at DESC);
    CREATE INDEX IF NOT EXISTS idx_twin_plans_tenant ON twin_work_plans(tenant_id,created_at DESC);
  `);
  db.prepare("INSERT OR IGNORE INTO twin_cohorts (id,tenant_id,name,planned_arrivals,window_label,synthetic) VALUES (?,?,?,?,?,1)")
    .run("SYN-TWIN-COHORT-001", "SYN-TENANT-001", "Pflegekohorte September", 12, "01.09.–01.10.2026");
  db.prepare("INSERT OR IGNORE INTO twin_cohorts (id,tenant_id,name,planned_arrivals,window_label,synthetic) VALUES (?,?,?,?,?,1)")
    .run("SYN-TWIN-COHORT-002", "SYN-TENANT-002", "Technikkohorte September", 8, "08.09.–08.10.2026");

  [
    { id: "SYN-TWIN-EVT-001", tenantId: "SYN-TENANT-001", cohortId: "SYN-TWIN-COHORT-001", type: "evidence_conflict", title: "Wohnraumadresse widersprüchlich", severity: "critical", occurredAt: "2026-09-18T10:24:00.000Z", caseIds: ["SYN-CASE-001"], evidenceRefs: ["SYN-CASE-001-EVD-1", "SYN-CASE-001-EVD-2"], summary: "Formular und Vertragsentwurf nennen unterschiedliche synthetische Wohnungsadressen." },
    { id: "SYN-TWIN-EVT-002", tenantId: "SYN-TENANT-001", cohortId: "SYN-TWIN-COHORT-001", type: "location_gap", title: "Standortvertretung noch offen", severity: "critical", occurredAt: "2026-09-17T16:03:00.000Z", caseIds: ["SYN-CASE-001", "SYN-CASE-002"], evidenceRefs: ["SYN-CASE-002-EVD-1"], summary: "Für zwei synthetische Anreisen fehlt eine bestätigte Standortvertretung." },
    { id: "SYN-TWIN-EVT-003", tenantId: "SYN-TENANT-001", cohortId: "SYN-TWIN-COHORT-001", type: "arrival_shift", title: "Anreise um 3 Tage verschoben", severity: "critical", occurredAt: "2026-09-16T09:41:00.000Z", caseIds: ["SYN-CASE-004"], evidenceRefs: ["SYN-CASE-004-EVD-1"], summary: "Eine lokale Terminvariante verschiebt Anreise, Übergabe und Folgefristen um drei Tage." },
    { id: "SYN-TWIN-EVT-004", tenantId: "SYN-TENANT-001", cohortId: "SYN-TWIN-COHORT-001", type: "review_overdue", title: "30-Tage-Review überfällig", severity: "risk", occurredAt: "2026-09-15T08:50:00.000Z", caseIds: ["SYN-CASE-003"], evidenceRefs: ["SYN-CASE-003-EVD-1"], summary: "Der synthetische Stabilisierungsreview wurde noch nicht dokumentiert." },
    { id: "SYN-TWIN-EVT-005", tenantId: "SYN-TENANT-001", cohortId: "SYN-TWIN-COHORT-001", type: "budget_decision", title: "Zusatzbegleitung benötigt Budgetentscheidung", severity: "decision", occurredAt: "2026-09-14T11:20:00.000Z", caseIds: ["SYN-CASE-005"], evidenceRefs: ["SYN-CASE-005-EVD-1", "SYN-CASE-005-EVD-2"], summary: "Zusatzbedarf und synthetischer Kostenrahmen sind belegt; die Budgetentscheidung ist offen." },
    { id: "SYN-TWIN-EVT-900", tenantId: "SYN-TENANT-002", cohortId: "SYN-TWIN-COHORT-002", type: "location_gap", title: "Standortkontakt fehlt", severity: "critical", occurredAt: "2026-09-18T09:00:00.000Z", caseIds: ["SYN-CASE-900"], evidenceRefs: ["SYN-CASE-900-EVD-1"], summary: "Synthetischer Standortkontakt ist nicht bestätigt." },
  ].forEach((item) => seedEvent(db, item));
}

function eventRow(db, tenantId, eventId) {
  return db.prepare("SELECT * FROM twin_events WHERE id=? AND tenant_id=?").get(eventId, tenantId);
}

function serializeEvent(row) {
  return {
    id: row.id, type: row.event_type, title: row.title, severity: row.severity, occurredAt: row.occurred_at,
    caseIds: json(row.case_ids_json), evidenceRefs: json(row.evidence_refs_json), summary: row.summary,
    status: row.status, version: row.version, synthetic: true,
  };
}

function caseLabel(detail) {
  return detail ? { id: detail.case.id, title: detail.case.title, location: detail.case.location, readiness: detail.case.readiness, readinessLabel: detail.case.readinessLabel } : null;
}

function buildEventDetail(db, tenantId, row, loadCaseDetail) {
  const event = serializeEvent(row);
  const cases = event.caseIds.map((id) => caseLabel(loadCaseDetail(db, id, tenantId))).filter(Boolean);
  const evidence = event.evidenceRefs.map((id) => {
    for (const caseId of event.caseIds) {
      const detail = loadCaseDetail(db, caseId, tenantId);
      const item = detail?.evidence.find((entry) => entry.id === id);
      if (item) return { id: item.id, label: item.label, source: item.source, reviewStatus: item.reviewStatus };
    }
    return null;
  }).filter(Boolean);
  const workflow = (PLAYBOOKS[event.type] || PLAYBOOKS.location_gap).map(([ownerRole, action], index) => ({ order: index + 1, ownerRole, action, dueDate: `2026-09-${String(19 + index).padStart(2, "0")}`, humanGate: true }));
  return { event, cases, evidence, workflow, humanGate: { required: true, label: "Menschliche Freigabe erforderlich", automaticApply: false }, externalEffect: false };
}

function buildHandoffs(details) {
  const statusFor = (detail, pattern) => {
    const task = detail.tasks.find((item) => pattern.test(item.ownerRole));
    if (!task) return "offen";
    if (task.status === "completed") return "erledigt";
    if (task.status === "blocked") return "blockiert";
    return "in_arbeit";
  };
  return details.slice(0, 5).map((detail) => ({
    caseId: detail.case.id,
    location: detail.case.location,
    currentStep: detail.case.phase,
    operations: statusFor(detail, /AMAVIO/i), sponsor: statusFor(detail, /Sponsor/i), hr: statusFor(detail, /HR|Personal/i),
    locationRole: statusFor(detail, /Standort|Facility|Wohn/i), budget: statusFor(detail, /Budget|Kosten|Finanz/i),
    nextHandoff: detail.tasks.find((item) => item.status !== "completed")?.dueDate || detail.case.arrivalDate,
    status: detail.case.readiness,
  }));
}

function serializePlan(row) {
  return {
    id: row.id, eventId: row.event_id, caseIds: json(row.case_ids_json), steps: json(row.plan_json), status: row.status,
    version: row.version, createdAt: row.created_at, reviewDecision: row.review_decision, reviewNote: row.review_note,
    humanGate: true, externalEffect: false,
  };
}

export function createOperationsTwinHandler({ db, sendJson, readBody, requireSession, audit, loadCaseDetail }) {
  return async function handleOperationsTwin(request, response, url) {
    if (!url.pathname.startsWith("/api/twin/v1/")) return false;
    const session = requireSession(request, response); if (!session) return true;
    if (session.role !== "operations") { sendJson(response, 403, { error: "Operations Twin ist ausschließlich AMAVIO Operations zugeordnet.", code: "role_scope_denied" }); return true; }

    if (request.method === "GET" && url.pathname === "/api/twin/v1/bootstrap") {
      const cohort = db.prepare("SELECT * FROM twin_cohorts WHERE tenant_id=? ORDER BY id LIMIT 1").get(session.tenantId);
      if (!cohort) { sendJson(response, 404, { error: "Keine synthetische Kohorte im aktiven Mandanten." }); return true; }
      const events = db.prepare("SELECT * FROM twin_events WHERE tenant_id=? AND cohort_id=? ORDER BY occurred_at DESC").all(session.tenantId, cohort.id).map(serializeEvent);
      const caseRows = db.prepare("SELECT case_id FROM case_operations WHERE tenant_id=? ORDER BY case_id").all(session.tenantId);
      const details = caseRows.map((item) => loadCaseDetail(db, item.case_id, session.tenantId)).filter(Boolean);
      const selected = events[0] ? buildEventDetail(db, session.tenantId, eventRow(db, session.tenantId, events[0].id), loadCaseDetail) : null;
      sendJson(response, 200, {
        cohort: { id: cohort.id, name: cohort.name, plannedArrivals: cohort.planned_arrivals, trackedCases: details.length, windowLabel: cohort.window_label },
        readiness: [
          { code: "preparation", label: "Vorbereitung", window: "01.–07. Sep", count: 4, state: "complete" },
          { code: "documents", label: "Dokumente", window: "08.–14. Sep", count: 3, state: "active" },
          { code: "entry", label: "Visa & Einreise", window: "15.–21. Sep", count: 3, state: "active" },
          { code: "arrival", label: "Anreise", window: "22.–30. Sep", count: 2, state: "risk" },
          { code: "handoff", label: "Ankunft & Übergaben", window: "ab 01. Okt", count: 0, state: "future" },
        ],
        events, selected,
        criticalPaths: details.slice(0, 4).map((detail) => ({ caseId: detail.case.id, location: detail.case.location, milestones: detail.milestones.map((item) => ({ id: item.id, title: item.title, status: item.status, dueDate: item.dueDate, critical: item.critical })) })),
        handoffs: buildHandoffs(details),
        metrics: { criticalEvents: events.filter((item) => item.severity === "critical").length, riskEvents: events.filter((item) => item.severity === "risk").length, pendingDecisions: events.filter((item) => item.severity === "decision").length },
        boundaries: { syntheticOnly: true, externalEffects: false, externalAI: false, productiveAutomation: false },
      });
      return true;
    }

    const eventMatch = url.pathname.match(/^\/api\/twin\/v1\/events\/([^/]+)$/);
    if (request.method === "GET" && eventMatch) {
      const row = eventRow(db, session.tenantId, decodeURIComponent(eventMatch[1]));
      if (!row) { sendJson(response, 404, { error: "Ereignis im aktiven Mandanten nicht gefunden." }); return true; }
      sendJson(response, 200, buildEventDetail(db, session.tenantId, row, loadCaseDetail)); return true;
    }

    const planMatch = url.pathname.match(/^\/api\/twin\/v1\/events\/([^/]+)\/work-plans$/);
    if (request.method === "POST" && planMatch) {
      const row = eventRow(db, session.tenantId, decodeURIComponent(planMatch[1]));
      if (!row) { sendJson(response, 404, { error: "Ereignis im aktiven Mandanten nicht gefunden." }); return true; }
      const detail = buildEventDetail(db, session.tenantId, row, loadCaseDetail);
      const id = `TWIN-PLAN-${randomUUID()}`;
      db.prepare("INSERT INTO twin_work_plans (id,tenant_id,cohort_id,event_id,case_ids_json,plan_json,status,created_by,created_at) VALUES (?,?,?,?,?,?,?, ?,?)")
        .run(id, session.tenantId, row.cohort_id, row.id, row.case_ids_json, JSON.stringify(detail.workflow), "awaiting_human_review", session.userId, new Date().toISOString());
      audit(db, session, "twin.work_plan.created", "twin_work_plan", id, { eventId: row.id, automaticApply: false });
      sendJson(response, 201, { plan: serializePlan(db.prepare("SELECT * FROM twin_work_plans WHERE id=?").get(id)) }); return true;
    }

    const getPlanMatch = url.pathname.match(/^\/api\/twin\/v1\/work-plans\/([^/]+)$/);
    if (request.method === "GET" && getPlanMatch) {
      const row = db.prepare("SELECT * FROM twin_work_plans WHERE id=? AND tenant_id=?").get(decodeURIComponent(getPlanMatch[1]), session.tenantId);
      if (!row) { sendJson(response, 404, { error: "Arbeitsplan im aktiven Mandanten nicht gefunden." }); return true; }
      sendJson(response, 200, { plan: serializePlan(row) }); return true;
    }

    const reviewMatch = url.pathname.match(/^\/api\/twin\/v1\/work-plans\/([^/]+)\/review$/);
    if (request.method === "POST" && reviewMatch) {
      const id = decodeURIComponent(reviewMatch[1]); const row = db.prepare("SELECT * FROM twin_work_plans WHERE id=? AND tenant_id=?").get(id, session.tenantId);
      if (!row) { sendJson(response, 404, { error: "Arbeitsplan im aktiven Mandanten nicht gefunden." }); return true; }
      const body = await readBody(request); const decision = text(body.decision, 20); const note = text(body.note, 1_000); const version = Number(body.version);
      if (!["approved", "rejected"].includes(decision) || !note || version !== row.version) { sendJson(response, 409, { error: "Aktuelle Version, Entscheidung und Prüfnotiz sind erforderlich.", code: "version_conflict" }); return true; }
      const updated = db.prepare("UPDATE twin_work_plans SET status=?,version=version+1,review_decision=?,review_note=?,reviewed_by=?,reviewed_at=? WHERE id=? AND tenant_id=? AND version=? AND status='awaiting_human_review'")
        .run(decision === "approved" ? "advisory_approved" : "rejected", decision, note, session.userId, new Date().toISOString(), id, session.tenantId, version);
      if (updated.changes !== 1) { sendJson(response, 409, { error: "Arbeitsplan wurde bereits oder parallel geprüft.", code: "review_already_completed" }); return true; }
      audit(db, session, `twin.work_plan.${decision}`, "twin_work_plan", id, { advisoryOnly: true, externalEffect: false });
      sendJson(response, 200, { plan: serializePlan(db.prepare("SELECT * FROM twin_work_plans WHERE id=?").get(id)) }); return true;
    }

    if (request.method === "POST" && url.pathname === "/api/twin/v1/cohort-simulations") {
      const cohort = db.prepare("SELECT * FROM twin_cohorts WHERE tenant_id=? ORDER BY id LIMIT 1").get(session.tenantId);
      const body = await readBody(request); const shiftDays = Number(body.shiftDays ?? 3);
      if (!Number.isInteger(shiftDays) || Math.abs(shiftDays) > 14 || shiftDays === 0) { sendJson(response, 400, { error: "Ganzzahlige Verschiebung zwischen -14 und 14 Tagen erforderlich." }); return true; }
      const cases = db.prepare("SELECT COUNT(*) AS count FROM case_operations WHERE tenant_id=?").get(session.tenantId).count;
      const milestones = db.prepare("SELECT COUNT(*) AS count FROM case_milestones WHERE tenant_id=? AND critical=1").get(session.tenantId).count;
      const result = { summary: `${cases} synthetische Fälle und ${milestones} kritische Meilensteine werden in einer isolierten Kohortenvariante um ${Math.abs(shiftDays)} Tage ${shiftDays > 0 ? "nach hinten" : "nach vorn"} projiziert.`, affectedCases: cases, affectedMilestones: milestones, roleHandoffs: 4, budgetChecks: 1, originalMutated: false, automaticDecision: false, externalEffect: false };
      const id = `TWIN-SIM-${randomUUID()}`;
      db.prepare("INSERT INTO twin_simulations (id,tenant_id,cohort_id,scenario_json,result_json,status,created_by,created_at) VALUES (?,?,?,?,?,'preview',?,?)")
        .run(id, session.tenantId, cohort.id, JSON.stringify({ type: "cohort_arrival_shift", shiftDays }), JSON.stringify(result), session.userId, new Date().toISOString());
      audit(db, session, "twin.simulation.created", "twin_simulation", id, { shiftDays, originalMutated: false });
      sendJson(response, 201, { simulation: { id, scenario: { type: "cohort_arrival_shift", shiftDays }, result, status: "preview" } }); return true;
    }

    const simulationMatch = url.pathname.match(/^\/api\/twin\/v1\/cohort-simulations\/([^/]+)$/);
    if (request.method === "GET" && simulationMatch) {
      const row = db.prepare("SELECT * FROM twin_simulations WHERE id=? AND tenant_id=?").get(decodeURIComponent(simulationMatch[1]), session.tenantId);
      if (!row) { sendJson(response, 404, { error: "Kohortensimulation im aktiven Mandanten nicht gefunden." }); return true; }
      sendJson(response, 200, { simulation: { id: row.id, scenario: json(row.scenario_json, {}), result: json(row.result_json, {}), status: row.status } }); return true;
    }

    sendJson(response, 404, { error: "Operations-Twin-API-Pfad nicht gefunden." }); return true;
  };
}
