import { randomUUID } from "node:crypto";

const now = () => new Date().toISOString();
const text = (value, max = 2_000) => String(value ?? "").trim().slice(0, max);
const roleGroup = (session) => session?.role === "operations" ? "operations" : String(session?.role || "").startsWith("employer_") ? "employer" : "unknown";

const roleMatches = (session, owner = "") => {
  if (session?.role === "operations") return /amavio operations/i.test(String(owner));
  const value = String(owner).toLowerCase();
  if (session?.role === "employer_sponsor") return /sponsor|geschäft|leitung/.test(value);
  if (session?.role === "employer_hr") return /hr|personal/.test(value);
  if (session?.role === "employer_location") return /standort|facility|wohn|übergabe/.test(value);
  if (session?.role === "employer_budget") return /budget|finanz|kosten|controlling/.test(value);
  return false;
};

const statusLabel = Object.freeze({
  active: "In Bearbeitung",
  awaiting_decision: "Entscheidung offen",
  locally_decided: "Lokal entschieden",
  blocked: "Abhängig",
  ready: "Bereit",
  in_progress: "In Arbeit",
  completed: "Erledigt",
  waiting: "Noch nicht bereit",
  open: "Ihre Mitwirkung ist gefragt",
  acknowledged: "Bestätigt",
  returned: "Rückfrage",
  reviewed: "Dokumentiert",
});

function serializeOrder(row, session, completedIds) {
  const dependencyMet = !row.dependency_id || completedIds.has(row.dependency_id);
  return {
    id: row.id,
    sequence: row.sequence,
    title: row.title,
    purpose: row.purpose,
    ownerRole: row.owner_role,
    dueDate: row.due_date,
    dependencyId: row.dependency_id,
    dependencyMet,
    status: row.status,
    statusLabel: statusLabel[row.status] || row.status,
    version: row.version,
    canAct: roleMatches(session, row.owner_role) && ["ready", "in_progress"].includes(row.status),
    synthetic: true,
  };
}

function loadExecution(db, tenantId, caseId, session) {
  const plan = db.prepare("SELECT * FROM execution_plans WHERE tenant_id=? AND case_id=?").get(tenantId, caseId);
  if (!plan) return null;
  const rows = db.prepare("SELECT * FROM execution_work_orders WHERE tenant_id=? AND plan_id=? ORDER BY sequence").all(tenantId, plan.id);
  const completedIds = new Set(rows.filter((row) => row.status === "completed").map((row) => row.id));
  const allOrders = rows.map((row) => serializeOrder(row, session, completedIds));
  const employer = roleGroup(session) === "employer";
  const orders = employer ? allOrders.filter((item) => roleMatches(session, item.ownerRole)) : allOrders;
  const handoffs = db.prepare("SELECT * FROM execution_handoffs WHERE tenant_id=? AND plan_id=? ORDER BY created_at,id").all(tenantId, plan.id)
    .filter((row) => !employer || roleMatches(session, row.target_role))
    .map((row) => ({
      id: row.id, workOrderId: row.work_order_id, targetRole: row.target_role, request: row.request_text,
      evidenceNeeded: row.evidence_needed, dueDate: row.due_date, status: row.status,
      statusLabel: statusLabel[row.status] || row.status, responseNote: row.response_note,
      version: row.version, canAct: employer && roleMatches(session, row.target_role) && row.status === "open",
      synthetic: true, externalEffect: false,
    }));
  const packages = employer ? [] : db.prepare("SELECT * FROM execution_decision_packages WHERE tenant_id=? AND plan_id=? ORDER BY created_at DESC,id DESC").all(tenantId, plan.id).map((row) => ({
    id: row.id, title: row.title, question: row.question, recommendation: row.recommendation,
    alternative: row.alternative, evidenceSummary: row.evidence_summary, consequence: row.consequence,
    status: row.status, statusLabel: statusLabel[row.status] || row.status, selectedOption: row.selected_option,
    rationale: row.rationale, version: row.version, canReview: row.status === "open", synthetic: true,
  }));
  const impacts = db.prepare("SELECT * FROM execution_program_impacts WHERE tenant_id=? AND plan_id=? ORDER BY created_at DESC,id DESC").all(tenantId, plan.id).map((row) => ({
    id: row.id, programId: row.program_id, summary: row.summary, affectedWorkstream: row.affected_workstream,
    recommendation: row.recommendation, status: row.status, createdAt: row.created_at,
    advisoryOnly: true, applied: false, externalEffect: false, synthetic: true,
  }));
  const nextOrder = allOrders.find((item) => item.status !== "completed") || null;
  return {
    plan: {
      id: plan.id, caseId: plan.case_id, programId: plan.program_id, title: plan.title,
      objective: plan.objective, status: plan.status, statusLabel: statusLabel[plan.status] || plan.status,
      version: plan.version, progress: { completed: completedIds.size, total: allOrders.length }, synthetic: true,
    },
    orders, handoffs, decisionPackages: packages, impacts,
    nextAction: nextOrder ? { id: nextOrder.id, title: nextOrder.title, ownerRole: nextOrder.ownerRole, dueDate: nextOrder.dueDate, status: nextOrder.status } : null,
    access: employer
      ? { role: session.role, roleGroup: "employer", projection: "assigned_execution", internalDecisionLogicHidden: true }
      : { role: session.role, roleGroup: "operations", projection: "full_execution" },
    boundaries: { syntheticOnly: true, providerCalls: 0, automaticDecision: false, externalEffects: false },
  };
}

function unlockNext(db, tenantId, planId, completedOrderId) {
  const next = db.prepare("SELECT * FROM execution_work_orders WHERE tenant_id=? AND plan_id=? AND dependency_id=?").get(tenantId, planId, completedOrderId);
  if (!next || next.status !== "blocked") return;
  db.prepare("UPDATE execution_work_orders SET status='ready',version=version+1,updated_at=? WHERE id=? AND tenant_id=? AND status='blocked'").run(now(), next.id, tenantId);
  db.prepare("UPDATE execution_handoffs SET status='open',version=version+1,updated_at=? WHERE work_order_id=? AND tenant_id=? AND status='waiting'").run(now(), next.id, tenantId);
  db.prepare("UPDATE execution_decision_packages SET status='open',version=version+1,updated_at=? WHERE work_order_id=? AND tenant_id=? AND status='blocked'").run(now(), next.id, tenantId);
}

export function installExecutionLoop(db) {
  db.exec(`
    CREATE TABLE IF NOT EXISTS execution_plans (
      id TEXT PRIMARY KEY, tenant_id TEXT NOT NULL REFERENCES tenants(id), case_id TEXT NOT NULL REFERENCES arrival_cases(id),
      program_id TEXT NOT NULL REFERENCES arrival_programs(id), title TEXT NOT NULL, objective TEXT NOT NULL,
      status TEXT NOT NULL CHECK (status IN ('active','awaiting_decision','locally_decided')),
      version INTEGER NOT NULL DEFAULT 1, created_at TEXT NOT NULL, updated_at TEXT NOT NULL,
      synthetic INTEGER NOT NULL CHECK (synthetic=1), UNIQUE (tenant_id,case_id)
    );
    CREATE TABLE IF NOT EXISTS execution_work_orders (
      id TEXT PRIMARY KEY, tenant_id TEXT NOT NULL REFERENCES tenants(id), plan_id TEXT NOT NULL REFERENCES execution_plans(id),
      sequence INTEGER NOT NULL, title TEXT NOT NULL, purpose TEXT NOT NULL, owner_role TEXT NOT NULL, due_date TEXT NOT NULL,
      dependency_id TEXT, status TEXT NOT NULL CHECK (status IN ('blocked','ready','in_progress','completed')),
      completion_note TEXT, completed_by TEXT, completed_at TEXT, version INTEGER NOT NULL DEFAULT 1,
      created_at TEXT NOT NULL, updated_at TEXT NOT NULL, synthetic INTEGER NOT NULL CHECK (synthetic=1),
      UNIQUE (tenant_id,plan_id,sequence)
    );
    CREATE TABLE IF NOT EXISTS execution_handoffs (
      id TEXT PRIMARY KEY, tenant_id TEXT NOT NULL REFERENCES tenants(id), plan_id TEXT NOT NULL REFERENCES execution_plans(id),
      work_order_id TEXT NOT NULL REFERENCES execution_work_orders(id), target_role TEXT NOT NULL, request_text TEXT NOT NULL,
      evidence_needed TEXT NOT NULL, due_date TEXT NOT NULL, status TEXT NOT NULL CHECK (status IN ('waiting','open','acknowledged','returned')),
      response_note TEXT, responded_by TEXT, responded_at TEXT, version INTEGER NOT NULL DEFAULT 1,
      created_at TEXT NOT NULL, updated_at TEXT NOT NULL, synthetic INTEGER NOT NULL CHECK (synthetic=1)
    );
    CREATE TABLE IF NOT EXISTS execution_decision_packages (
      id TEXT PRIMARY KEY, tenant_id TEXT NOT NULL REFERENCES tenants(id), plan_id TEXT NOT NULL REFERENCES execution_plans(id),
      work_order_id TEXT NOT NULL REFERENCES execution_work_orders(id), title TEXT NOT NULL, question TEXT NOT NULL,
      recommendation TEXT NOT NULL, alternative TEXT NOT NULL, evidence_summary TEXT NOT NULL, consequence TEXT NOT NULL,
      status TEXT NOT NULL CHECK (status IN ('blocked','open','reviewed')), selected_option TEXT, rationale TEXT,
      reviewed_by TEXT, reviewed_at TEXT, version INTEGER NOT NULL DEFAULT 1,
      created_at TEXT NOT NULL, updated_at TEXT NOT NULL, synthetic INTEGER NOT NULL CHECK (synthetic=1)
    );
    CREATE TABLE IF NOT EXISTS execution_program_impacts (
      id TEXT PRIMARY KEY, tenant_id TEXT NOT NULL REFERENCES tenants(id), plan_id TEXT NOT NULL REFERENCES execution_plans(id),
      program_id TEXT NOT NULL REFERENCES arrival_programs(id), summary TEXT NOT NULL, affected_workstream TEXT NOT NULL,
      recommendation TEXT NOT NULL, status TEXT NOT NULL CHECK (status='advisory'), created_at TEXT NOT NULL,
      synthetic INTEGER NOT NULL CHECK (synthetic=1)
    );
    CREATE TABLE IF NOT EXISTS pilot_metric_events (
      id TEXT PRIMARY KEY, tenant_id TEXT NOT NULL REFERENCES tenants(id), case_id TEXT NOT NULL REFERENCES arrival_cases(id),
      actor_role TEXT NOT NULL, event_type TEXT NOT NULL, journey_step INTEGER NOT NULL,
      duration_ms INTEGER, success INTEGER NOT NULL CHECK (success IN (0,1)),
      created_at TEXT NOT NULL, synthetic INTEGER NOT NULL CHECK (synthetic=1)
    );
    CREATE INDEX IF NOT EXISTS idx_execution_case ON execution_plans(tenant_id,case_id);
    CREATE INDEX IF NOT EXISTS idx_execution_orders ON execution_work_orders(tenant_id,plan_id,sequence);
    CREATE INDEX IF NOT EXISTS idx_execution_impacts ON execution_program_impacts(tenant_id,program_id,created_at DESC);
    CREATE INDEX IF NOT EXISTS idx_pilot_metrics ON pilot_metric_events(tenant_id,case_id,created_at DESC);
  `);

  const timestamp = "2026-10-13T09:00:00.000Z";
  db.prepare("INSERT OR IGNORE INTO execution_plans (id,tenant_id,case_id,program_id,title,objective,status,version,created_at,updated_at,synthetic) VALUES (?,?,?,?,?,?,'active',1,?,?,1)")
    .run("SYN-EXEC-001", "SYN-TENANT-001", "SYN-CASE-001", "SYN-PROG-001", "Wohnraumfreigabe bis zur Programmauswirkung steuern", "Einen belegten, rollengetrennten und menschlich entschiedenen Ausführungsweg herstellen.", timestamp, timestamp);
  const order = db.prepare("INSERT OR IGNORE INTO execution_work_orders (id,tenant_id,plan_id,sequence,title,purpose,owner_role,due_date,dependency_id,status,version,created_at,updated_at,synthetic) VALUES (?,?,?,?,?,?,?,?,?,?,1,?,?,1)");
  order.run("SYN-EXEC-WO-001", "SYN-TENANT-001", "SYN-EXEC-001", 1, "Wohnungsgrundlage fachlich klären", "Widersprüchliche Angaben in einen belastbaren lokalen Arbeitsstand überführen.", "AMAVIO Operations", "2026-09-11", null, "ready", timestamp, timestamp);
  order.run("SYN-EXEC-WO-002", "SYN-TENANT-001", "SYN-EXEC-001", 2, "Standortbestätigung einholen", "Übergabezeit und zuständige Standortrolle bewusst bestätigen lassen.", "Arbeitgeber Standort", "2026-09-12", "SYN-EXEC-WO-001", "blocked", timestamp, timestamp);
  order.run("SYN-EXEC-WO-003", "SYN-TENANT-001", "SYN-EXEC-001", 3, "Auswirkung auf Arbeitsstart prüfen", "Bestätigte Standortangabe gegen Termin- und Programmabhängigkeiten prüfen.", "AMAVIO Operations", "2026-09-13", "SYN-EXEC-WO-002", "blocked", timestamp, timestamp);
  order.run("SYN-EXEC-WO-004", "SYN-TENANT-001", "SYN-EXEC-001", 4, "Fallentscheidung dokumentieren", "Eine begründete menschliche Entscheidung mit nachvollziehbarer Programmfolge festhalten.", "AMAVIO Operations", "2026-09-13", "SYN-EXEC-WO-003", "blocked", timestamp, timestamp);
  db.prepare("INSERT OR IGNORE INTO execution_handoffs (id,tenant_id,plan_id,work_order_id,target_role,request_text,evidence_needed,due_date,status,version,created_at,updated_at,synthetic) VALUES (?,?,?,?,?,?,?,?, 'waiting',1,?,?,1)")
    .run("SYN-EXEC-HO-001", "SYN-TENANT-001", "SYN-EXEC-001", "SYN-EXEC-WO-002", "Arbeitgeber Standort", "Bitte bestätigen Sie für den synthetischen Fall die lokale Übergabezeit und die zuständige Rolle.", "Bestätigte Übergabezeit und Rollenverantwortung", "2026-09-12", timestamp, timestamp);
  db.prepare("INSERT OR IGNORE INTO execution_decision_packages (id,tenant_id,plan_id,work_order_id,title,question,recommendation,alternative,evidence_summary,consequence,status,version,created_at,updated_at,synthetic) VALUES (?,?,?,?,?,?,?,?,?,?, 'blocked',1,?,?,1)")
    .run("SYN-EXEC-DEC-001", "SYN-TENANT-001", "SYN-EXEC-001", "SYN-EXEC-WO-004", "Arbeitsstart lokal einordnen", "Bleibt der geplante synthetische Arbeitsstart unter dokumentierter Beobachtung bestehen?", "Arbeitsstart beibehalten und die bestätigte Standortübergabe im Programmstatus berücksichtigen.", "Arbeitsstart lokal neu planen und eine neue menschliche Prüfung anfordern.", "Wohnungsgrundlage, Standortbestätigung und lokale Abhängigkeitsprüfung bilden gemeinsam die Entscheidungsbasis.", "Die Entscheidung erzeugt ausschließlich eine beratende Programmfolge; sie verändert keinen externen Prozess.", timestamp, timestamp);
}

export function createExecutionLoopHandler({ db, sendJson, readBody, requireSession, audit }) {
  return async function handleExecutionLoop(request, response, url) {
    if (!url.pathname.startsWith("/api/execution/v1/")) return false;
    const session = requireSession(request, response); if (!session) return true;

    if (request.method === "GET" && url.pathname === "/api/execution/v1/metrics/summary") {
      const caseId = text(url.searchParams.get("caseId"), 120);
      const exists = db.prepare("SELECT id FROM arrival_cases WHERE id=? AND tenant_id=?").get(caseId, session.tenantId);
      if (!exists) { sendJson(response, 404, { error: "Synthetischer Fall für die Pilotmessung nicht gefunden." }); return true; }
      const rows = db.prepare("SELECT event_type,journey_step,duration_ms,success,created_at FROM pilot_metric_events WHERE tenant_id=? AND case_id=? ORDER BY created_at DESC,id DESC").all(session.tenantId, caseId);
      const durations = rows.filter((item) => Number.isFinite(item.duration_ms) && item.duration_ms > 0).map((item) => item.duration_ms);
      sendJson(response, 200, {
        summary: {
          totalEvents: rows.length,
          successfulEvents: rows.filter((item) => item.success === 1).length,
          humanGates: rows.filter((item) => item.event_type === "human_gate_confirmed").length,
          employerHandoffs: rows.filter((item) => item.event_type === "employer_handoff_completed").length,
          medianDurationMs: durations.length ? durations.sort((a,b) => a - b)[Math.floor(durations.length / 2)] : null,
        },
        events: rows.slice(0, 20),
        criteria: ["Aufgabenerfolg", "Bearbeitungszeit", "Übergabelatenz", "Nacharbeit", "Evidenzvollständigkeit"],
        boundaries: { syntheticOnly: true, realWorldEfficiencyClaim: false, externalEffects: false },
      });
      return true;
    }

    if (request.method === "POST" && url.pathname === "/api/execution/v1/metrics/events") {
      const body = await readBody(request);
      const caseId = text(body.caseId, 120);
      const eventType = text(body.eventType, 80);
      const journeyStep = Number(body.journeyStep);
      const durationMs = body.durationMs == null ? null : Math.max(0, Math.min(86_400_000, Number(body.durationMs) || 0));
      const allowedEvents = new Set(["work_product_created", "journey_step_completed", "human_gate_confirmed", "simulation_previewed", "employer_handoff_completed", "employer_handoff_returned"]);
      const exists = db.prepare("SELECT id FROM arrival_cases WHERE id=? AND tenant_id=?").get(caseId, session.tenantId);
      if (!exists || !allowedEvents.has(eventType) || !Number.isInteger(journeyStep) || journeyStep < 1 || journeyStep > 5) {
        sendJson(response, 400, { error: "Gültiger Fall, Messereignis und Journey-Schritt sind erforderlich.", code: "invalid_pilot_metric" }); return true;
      }
      const id = `SYN-METRIC-${randomUUID()}`;
      db.prepare("INSERT INTO pilot_metric_events (id,tenant_id,case_id,actor_role,event_type,journey_step,duration_ms,success,created_at,synthetic) VALUES (?,?,?,?,?,?,?,?,?,1)")
        .run(id, session.tenantId, caseId, session.role, eventType, journeyStep, durationMs, body.success === false ? 0 : 1, now());
      sendJson(response, 201, { id, synthetic: true, externalEffect: false });
      return true;
    }

    if (request.method === "POST" && url.pathname === "/api/execution/v1/demo-reset") {
      if (session.role !== "operations") { sendJson(response, 403, { error: "Nur AMAVIO Operations kann den lokalen Pilotstand zurücksetzen.", code: "operations_role_required" }); return true; }
      const caseId = text((await readBody(request)).caseId || "SYN-CASE-001", 120);
      const plan = db.prepare("SELECT * FROM execution_plans WHERE tenant_id=? AND case_id=?").get(session.tenantId, caseId);
      if (!plan) { sendJson(response, 404, { error: "Ausführungsplan im aktiven Mandanten nicht gefunden." }); return true; }
      db.exec("BEGIN IMMEDIATE");
      try {
        db.prepare("UPDATE execution_plans SET status='active',version=version+1,updated_at=? WHERE id=? AND tenant_id=?").run(now(), plan.id, session.tenantId);
        db.prepare("UPDATE execution_work_orders SET status=CASE sequence WHEN 1 THEN 'ready' ELSE 'blocked' END,completion_note=NULL,completed_by=NULL,completed_at=NULL,version=version+1,updated_at=? WHERE plan_id=? AND tenant_id=?").run(now(), plan.id, session.tenantId);
        db.prepare("UPDATE execution_handoffs SET status='waiting',response_note=NULL,responded_by=NULL,responded_at=NULL,version=version+1,updated_at=? WHERE plan_id=? AND tenant_id=?").run(now(), plan.id, session.tenantId);
        db.prepare("UPDATE execution_decision_packages SET status='blocked',selected_option=NULL,rationale=NULL,reviewed_by=NULL,reviewed_at=NULL,version=version+1,updated_at=? WHERE plan_id=? AND tenant_id=?").run(now(), plan.id, session.tenantId);
        db.prepare("DELETE FROM execution_program_impacts WHERE plan_id=? AND tenant_id=?").run(plan.id, session.tenantId);
        db.prepare("DELETE FROM pilot_metric_events WHERE case_id=? AND tenant_id=?").run(caseId, session.tenantId);
        db.prepare("DELETE FROM work_products WHERE case_id=? AND tenant_id=?").run(caseId, session.tenantId);
        db.prepare("DELETE FROM simulation_runs WHERE case_id=? AND tenant_id=?").run(caseId, session.tenantId);
        db.prepare("DELETE FROM case_events WHERE case_id=? AND tenant_id=?").run(caseId, session.tenantId);
        db.prepare("DELETE FROM employer_contributions WHERE case_id=? AND tenant_id=? AND id!='SYN-CONTRIB-001'").run(caseId, session.tenantId);
        db.prepare("DELETE FROM case_decisions WHERE case_id=? AND tenant_id=? AND id LIKE 'SYN-EXEC-CASE-DEC-%'").run(caseId, session.tenantId);
        db.prepare("UPDATE decision_requests SET status='open',updated_at=? WHERE case_id=? AND tenant_id=?").run(now(), caseId, session.tenantId);
        if (caseId === "SYN-CASE-001") {
          db.prepare("UPDATE case_operations SET state='blocked',readiness='blocked',readiness_label='Blockiert · 1 harte Abhängigkeit',version=version+1,updated_at=? WHERE case_id=? AND tenant_id=?").run(now(), caseId, session.tenantId);
          db.prepare("UPDATE case_exceptions SET status='open',updated_at=? WHERE case_id=? AND tenant_id=?").run(now(), caseId, session.tenantId);
          db.prepare("UPDATE case_tasks SET status=CASE id WHEN 'SYN-CASE-001-TASK-1' THEN 'open' WHEN 'SYN-CASE-001-TASK-2' THEN 'blocked' ELSE status END,version=version+1,updated_at=? WHERE case_id=? AND tenant_id=?").run(now(), caseId, session.tenantId);
        }
        audit(db, session, "execution.demo_reset", "execution_plan", plan.id, { caseId, synthetic: true, externalEffect: false });
        db.exec("COMMIT");
      } catch (error) { db.exec("ROLLBACK"); throw error; }
      sendJson(response, 200, { execution: loadExecution(db, session.tenantId, caseId, session), reset: true, externalEffect: false });
      return true;
    }

    const caseMatch = url.pathname.match(/^\/api\/execution\/v1\/cases\/([^/]+)$/);
    if (request.method === "GET" && caseMatch) {
      const caseId = decodeURIComponent(caseMatch[1]);
      const arrivalCase = db.prepare("SELECT id FROM arrival_cases WHERE id=? AND tenant_id=?").get(caseId, session.tenantId);
      if (!arrivalCase) { sendJson(response, 404, { error: "Synthetischer Fall im aktiven Mandanten nicht gefunden." }); return true; }
      const execution = loadExecution(db, session.tenantId, caseId, session);
      if (!execution) {
        sendJson(response, 200, {
          available: false, caseId, orders: [], handoffs: [], decisionPackages: [], impacts: [], nextAction: null,
          access: { role: session.role, roleGroup: roleGroup(session), projection: roleGroup(session) === "employer" ? "assigned_execution" : "full_execution" },
          boundaries: { syntheticOnly: true, providerCalls: 0, automaticDecision: false, externalEffects: false },
        });
        return true;
      }
      sendJson(response, 200, execution); return true;
    }

    const orderMatch = url.pathname.match(/^\/api\/execution\/v1\/work-orders\/([^/]+)\/transitions$/);
    if (request.method === "POST" && orderMatch) {
      const id = decodeURIComponent(orderMatch[1]);
      const row = db.prepare("SELECT * FROM execution_work_orders WHERE id=? AND tenant_id=?").get(id, session.tenantId);
      if (!row) { sendJson(response, 404, { error: "Arbeitsauftrag im aktiven Mandanten nicht gefunden." }); return true; }
      if (!roleMatches(session, row.owner_role)) { sendJson(response, 403, { error: "Dieser Arbeitsauftrag ist einer anderen Rolle zugeordnet.", code: "role_scope_denied" }); return true; }
      const body = await readBody(request); const version = Number(body.version); const target = text(body.status, 40); const note = text(body.note, 1_200);
      const valid = (row.status === "ready" && ["in_progress", "completed"].includes(target)) || (row.status === "in_progress" && target === "completed");
      if (!valid || version !== row.version || (target === "completed" && note.length < 12)) { sendJson(response, 409, { error: "Aktueller Auftrag, gültiger Folgestatus, Version und nachvollziehbare Abschlussnotiz sind erforderlich.", code: "execution_transition_conflict" }); return true; }
      db.exec("BEGIN IMMEDIATE");
      try {
        const changed = db.prepare("UPDATE execution_work_orders SET status=?,completion_note=?,completed_by=?,completed_at=?,version=version+1,updated_at=? WHERE id=? AND tenant_id=? AND version=? AND status=?")
          .run(target, target === "completed" ? note : null, target === "completed" ? session.userId : null, target === "completed" ? now() : null, now(), id, session.tenantId, version, row.status);
        if (changed.changes !== 1) throw Object.assign(new Error("Arbeitsauftrag wurde parallel bearbeitet."), { code: "execution_transition_conflict" });
        if (target === "completed") unlockNext(db, session.tenantId, row.plan_id, id);
        const openPackage = db.prepare("SELECT 1 AS yes FROM execution_decision_packages WHERE tenant_id=? AND plan_id=? AND status='open'").get(session.tenantId, row.plan_id);
        if (openPackage) db.prepare("UPDATE execution_plans SET status='awaiting_decision',version=version+1,updated_at=? WHERE id=? AND tenant_id=? AND status='active'").run(now(), row.plan_id, session.tenantId);
        audit(db, session, "execution.work_order.transitioned", "execution_work_order", id, { from: row.status, to: target, externalEffect: false });
        db.exec("COMMIT");
      } catch (error) { db.exec("ROLLBACK"); if (error?.code) { sendJson(response, 409, { error: error.message, code: error.code }); return true; } throw error; }
      const plan = db.prepare("SELECT case_id FROM execution_plans WHERE id=? AND tenant_id=?").get(row.plan_id, session.tenantId);
      sendJson(response, 200, { execution: loadExecution(db, session.tenantId, plan.case_id, session), externalEffect: false }); return true;
    }

    const handoffMatch = url.pathname.match(/^\/api\/execution\/v1\/handoffs\/([^/]+)\/respond$/);
    if (request.method === "POST" && handoffMatch) {
      const id = decodeURIComponent(handoffMatch[1]);
      const row = db.prepare("SELECT * FROM execution_handoffs WHERE id=? AND tenant_id=?").get(id, session.tenantId);
      if (!row) { sendJson(response, 404, { error: "Rollenübergabe im aktiven Mandanten nicht gefunden." }); return true; }
      if (roleGroup(session) !== "employer" || !roleMatches(session, row.target_role)) { sendJson(response, 403, { error: "Diese Übergabe ist einer anderen Arbeitgeberrolle zugeordnet.", code: "role_scope_denied" }); return true; }
      const body = await readBody(request); const version = Number(body.version); const decision = body.decision === "returned" ? "returned" : "acknowledged"; const note = text(body.note, 1_200);
      if (row.status !== "open" || version !== row.version || note.length < 12) { sendJson(response, 409, { error: "Offene Übergabe, aktuelle Version und nachvollziehbare Rückmeldung sind erforderlich.", code: "execution_handoff_conflict" }); return true; }
      db.exec("BEGIN IMMEDIATE");
      try {
        const changed = db.prepare("UPDATE execution_handoffs SET status=?,response_note=?,responded_by=?,responded_at=?,version=version+1,updated_at=? WHERE id=? AND tenant_id=? AND version=? AND status='open'")
          .run(decision, note, session.userId, now(), now(), id, session.tenantId, version);
        if (changed.changes !== 1) throw Object.assign(new Error("Übergabe wurde parallel bearbeitet."), { code: "execution_handoff_conflict" });
        if (decision === "acknowledged") {
          const order = db.prepare("SELECT * FROM execution_work_orders WHERE id=? AND tenant_id=?").get(row.work_order_id, session.tenantId);
          db.prepare("UPDATE execution_work_orders SET status='completed',completion_note=?,completed_by=?,completed_at=?,version=version+1,updated_at=? WHERE id=? AND tenant_id=? AND status IN ('ready','in_progress')")
            .run(note, session.userId, now(), now(), order.id, session.tenantId);
          unlockNext(db, session.tenantId, row.plan_id, order.id);
          const contribution = body.contribution && typeof body.contribution === "object" ? body.contribution : null;
          if (contribution) {
            const address = text(contribution.address, 240);
            const availableFrom = text(contribution.availableFrom, 20);
            const basis = text(contribution.basis, 240);
            const rationale = text(contribution.rationale, 1_200);
            if (!address || !/^\d{4}-\d{2}-\d{2}$/.test(availableFrom) || !basis || rationale.length < 12) {
              throw Object.assign(new Error("Der strukturierte Arbeitgeberbeitrag ist unvollständig."), { code: "invalid_structured_contribution" });
            }
            db.prepare(`INSERT INTO employer_contributions
              (id,tenant_id,case_id,contribution_type,summary,detail,status,created_by,created_role,created_at,shared_status,synthetic)
              VALUES (?,?,?,?,?,?,'submitted',?,?,?,'An AMAVIO übergeben',1)`)
              .run(
                `SYN-CONTRIB-${randomUUID()}`, session.tenantId,
                db.prepare("SELECT case_id FROM execution_plans WHERE id=? AND tenant_id=?").get(row.plan_id, session.tenantId).case_id,
                "evidence_confirmation", `Standortbeitrag: ${address}`,
                `Verfügbar ab ${availableFrom}; Grundlage: ${basis}. ${rationale}`,
                session.userId, session.role, now(),
              );
          }
        }
        audit(db, session, "execution.handoff.responded", "execution_handoff", id, { decision, externalEffect: false });
        db.exec("COMMIT");
      } catch (error) { db.exec("ROLLBACK"); if (error?.code) { sendJson(response, 409, { error: error.message, code: error.code }); return true; } throw error; }
      const plan = db.prepare("SELECT case_id FROM execution_plans WHERE id=? AND tenant_id=?").get(row.plan_id, session.tenantId);
      sendJson(response, 200, { execution: loadExecution(db, session.tenantId, plan.case_id, session), externalEffect: false }); return true;
    }

    const decisionMatch = url.pathname.match(/^\/api\/execution\/v1\/decision-packages\/([^/]+)\/review$/);
    if (request.method === "POST" && decisionMatch) {
      if (session.role !== "operations") { sendJson(response, 403, { error: "Die abschließende lokale Fallentscheidung liegt bei AMAVIO Operations.", code: "operations_role_required" }); return true; }
      const id = decodeURIComponent(decisionMatch[1]);
      const row = db.prepare("SELECT * FROM execution_decision_packages WHERE id=? AND tenant_id=?").get(id, session.tenantId);
      if (!row) { sendJson(response, 404, { error: "Entscheidungsvorlage im aktiven Mandanten nicht gefunden." }); return true; }
      const body = await readBody(request); const version = Number(body.version); const option = text(body.option, 500); const rationale = text(body.rationale, 1_500);
      if (row.status !== "open" || version !== row.version || ![row.recommendation, row.alternative].includes(option) || rationale.length < 12) { sendJson(response, 409, { error: "Offene Vorlage, aktuelle Version, vorgesehene Option und nachvollziehbare Begründung sind erforderlich.", code: "execution_decision_conflict" }); return true; }
      const plan = db.prepare("SELECT * FROM execution_plans WHERE id=? AND tenant_id=?").get(row.plan_id, session.tenantId);
      db.exec("BEGIN IMMEDIATE");
      try {
        const changed = db.prepare("UPDATE execution_decision_packages SET status='reviewed',selected_option=?,rationale=?,reviewed_by=?,reviewed_at=?,version=version+1,updated_at=? WHERE id=? AND tenant_id=? AND version=? AND status='open'")
          .run(option, rationale, session.userId, now(), now(), id, session.tenantId, version);
        if (changed.changes !== 1) throw Object.assign(new Error("Entscheidungsvorlage wurde parallel bearbeitet."), { code: "execution_decision_conflict" });
        db.prepare("UPDATE execution_work_orders SET status='completed',completion_note=?,completed_by=?,completed_at=?,version=version+1,updated_at=? WHERE id=? AND tenant_id=? AND status='ready'")
          .run(rationale, session.userId, now(), now(), row.work_order_id, session.tenantId);
        db.prepare("UPDATE execution_plans SET status='locally_decided',version=version+1,updated_at=? WHERE id=? AND tenant_id=? AND status='awaiting_decision'")
          .run(now(), row.plan_id, session.tenantId);
        db.prepare("INSERT OR IGNORE INTO execution_program_impacts (id,tenant_id,plan_id,program_id,summary,affected_workstream,recommendation,status,created_at,synthetic) VALUES (?,?,?,?,?,?,?,'advisory',?,1)")
          .run(`SYN-EXEC-IMPACT-${row.id}`, session.tenantId, row.plan_id, plan.program_id, "Die lokale Fallentscheidung ist als beratende Programmfolge dokumentiert.", "Unterkunft und Übergabe", option, now());
        const request = db.prepare("SELECT id FROM decision_requests WHERE tenant_id=? AND case_id=? ORDER BY created_at,id LIMIT 1").get(session.tenantId, plan.case_id);
        if (request) {
          db.prepare("UPDATE decision_requests SET status='reviewed',updated_at=? WHERE id=? AND tenant_id=?").run(now(), request.id, session.tenantId);
          db.prepare("INSERT OR REPLACE INTO case_decisions (id,tenant_id,case_id,request_id,selected_option,rationale,decided_by,effect_mode,created_at) VALUES (?,?,?,?,?,?,?,'local_only',?)")
            .run(`SYN-EXEC-CASE-DEC-${row.id}`, session.tenantId, plan.case_id, request.id, option, rationale, session.userId, now());
        }
        db.prepare("UPDATE case_operations SET state='locally_decided',readiness='watch',readiness_label='Geprüft · unter Beobachtung',version=version+1,updated_at=? WHERE case_id=? AND tenant_id=?")
          .run(now(), plan.case_id, session.tenantId);
        db.prepare("UPDATE case_exceptions SET status='handled',updated_at=? WHERE case_id=? AND tenant_id=?").run(now(), plan.case_id, session.tenantId);
        db.prepare("UPDATE case_tasks SET status='completed',version=version+1,updated_at=? WHERE case_id=? AND tenant_id=? AND id='SYN-CASE-001-TASK-1'").run(now(), plan.case_id, session.tenantId);
        audit(db, session, "execution.decision.reviewed", "execution_decision_package", id, { option, programId: plan.program_id, automaticApplication: false, externalEffect: false });
        db.exec("COMMIT");
      } catch (error) { db.exec("ROLLBACK"); if (error?.code) { sendJson(response, 409, { error: error.message, code: error.code }); return true; } throw error; }
      sendJson(response, 200, { execution: loadExecution(db, session.tenantId, plan.case_id, session), applied: false, externalEffect: false }); return true;
    }

    const programMatch = url.pathname.match(/^\/api\/execution\/v1\/programs\/([^/]+)\/impacts$/);
    if (request.method === "GET" && programMatch) {
      const programId = decodeURIComponent(programMatch[1]);
      const program = db.prepare("SELECT id FROM arrival_programs WHERE id=? AND tenant_id=?").get(programId, session.tenantId);
      if (!program) { sendJson(response, 404, { error: "Synthetisches Programm im aktiven Mandanten nicht gefunden." }); return true; }
      const impacts = db.prepare("SELECT * FROM execution_program_impacts WHERE tenant_id=? AND program_id=? ORDER BY created_at DESC,id DESC").all(session.tenantId, programId).map((row) => ({ id: row.id, summary: row.summary, affectedWorkstream: row.affected_workstream, recommendation: row.recommendation, status: row.status, createdAt: row.created_at, advisoryOnly: true, applied: false, externalEffect: false, synthetic: true }));
      sendJson(response, 200, { impacts, boundaries: { syntheticOnly: true, providerCalls: 0, automaticApplication: false, externalEffects: false } }); return true;
    }

    sendJson(response, 404, { error: "Operational-Execution-API-Pfad nicht gefunden." }); return true;
  };
}
