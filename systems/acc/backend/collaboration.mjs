import { randomUUID } from "node:crypto";

const text = (value, max = 2_000) => String(value ?? "").trim().slice(0, max);
const ROLE_LABELS = Object.freeze({
  employer_sponsor: "Arbeitgeber · Gesamtsteuerung",
  employer_hr: "Arbeitgeber · Personal & Onboarding",
  employer_location: "Arbeitgeber · Standort & Übergabe",
  employer_budget: "Arbeitgeber · Budget & Freigaben",
  operations: "AMAVIO Operations",
});

const TYPE_LABELS = Object.freeze({
  evidence_confirmation: "Arbeitgeberbeleg",
  decision: "Arbeitgeberentscheidung",
  outcome_feedback: "Ergebnisrückmeldung",
  clarification: "Rückfrage",
});

function serialize(row) {
  return {
    id: row.id,
    caseId: row.case_id,
    type: row.contribution_type,
    typeLabel: TYPE_LABELS[row.contribution_type] || row.contribution_type,
    summary: row.summary,
    detail: row.detail,
    status: row.status,
    createdRole: row.created_role,
    createdRoleLabel: ROLE_LABELS[row.created_role] || row.created_role,
    createdAt: row.created_at,
    reviewedAt: row.reviewed_at,
    reviewNote: row.review_note,
    sharedStatus: row.shared_status,
    synthetic: true,
    externalEffect: false,
  };
}

function roleGroup(session) {
  return session?.role === "operations" ? "amavio" : String(session?.role || "").startsWith("employer_") ? "employer" : "unknown";
}

export function installCollaboration(db) {
  db.exec(`
    CREATE TABLE IF NOT EXISTS employer_contributions (
      id TEXT PRIMARY KEY,
      tenant_id TEXT NOT NULL REFERENCES tenants(id),
      case_id TEXT NOT NULL REFERENCES arrival_cases(id),
      contribution_type TEXT NOT NULL CHECK (contribution_type IN ('evidence_confirmation','decision','outcome_feedback','clarification')),
      summary TEXT NOT NULL,
      detail TEXT NOT NULL,
      status TEXT NOT NULL CHECK (status IN ('submitted','in_review','reviewed','returned')),
      created_by TEXT NOT NULL REFERENCES users(id),
      created_role TEXT NOT NULL,
      created_at TEXT NOT NULL,
      reviewed_by TEXT REFERENCES users(id),
      reviewed_at TEXT,
      review_note TEXT,
      shared_status TEXT NOT NULL,
      synthetic INTEGER NOT NULL CHECK (synthetic = 1)
    );
    CREATE INDEX IF NOT EXISTS idx_contributions_tenant_case
      ON employer_contributions(tenant_id,case_id,created_at DESC);
  `);

  db.prepare(`INSERT OR IGNORE INTO employer_contributions
    (id,tenant_id,case_id,contribution_type,summary,detail,status,created_by,created_role,created_at,shared_status,synthetic)
    VALUES (?,?,?,?,?,?,?,?,?,?,?,1)`)
    .run(
      "SYN-CONTRIB-001",
      "SYN-TENANT-001",
      "SYN-CASE-001",
      "clarification",
      "Die Gesamtsteuerung bittet um eine klare Auswirkung auf den geplanten Arbeitsbeginn.",
      "Die Entscheidung soll zeigen, ob der vorgesehene Starttermin trotz offener Wohnraumfreigabe stabil bleibt.",
      "submitted",
      "SYN-USER-SPONSOR-001",
      "employer_sponsor",
      "2026-10-10T08:35:00.000Z",
      "AMAVIO prüft den Beitrag",
    );
}

export function createCollaborationHandler({ db, sendJson, readBody, requireSession, audit }) {
  return async function handleCollaboration(request, response, url) {
    if (!url.pathname.startsWith("/api/collaboration/v1/")) return false;
    const session = requireSession(request, response);
    if (!session) return true;
    const group = roleGroup(session);

    if (request.method === "GET" && url.pathname === "/api/collaboration/v1/bootstrap") {
      const rows = group === "amavio"
        ? db.prepare("SELECT * FROM employer_contributions WHERE tenant_id=? ORDER BY created_at DESC,id DESC").all(session.tenantId)
        : db.prepare("SELECT * FROM employer_contributions WHERE tenant_id=? AND created_role=? ORDER BY created_at DESC,id DESC").all(session.tenantId, session.role);
      const contributions = rows.map(serialize);
      sendJson(response, 200, {
        access: { role: session.role, roleGroup: group, label: ROLE_LABELS[session.role] || session.role, syntheticSession: true },
        summary: {
          total: contributions.length,
          submitted: contributions.filter((item) => item.status === "submitted").length,
          inReview: contributions.filter((item) => item.status === "in_review").length,
          reviewed: contributions.filter((item) => item.status === "reviewed").length,
        },
        contributions,
        boundaries: { syntheticOnly: true, externalEffects: false, internalLearningHiddenFromEmployer: true },
      });
      return true;
    }

    if (request.method === "POST" && url.pathname === "/api/collaboration/v1/contributions") {
      if (group !== "employer") { sendJson(response, 403, { error: "Nur eine Arbeitgeberrolle kann einen Arbeitgeberbeitrag einreichen.", code: "employer_role_required" }); return true; }
      const body = await readBody(request);
      const caseId = text(body.caseId, 120);
      const type = text(body.type, 80);
      const summary = text(body.summary, 240);
      const detail = text(body.detail, 2_000);
      if (!caseId || !TYPE_LABELS[type] || summary.length < 8 || detail.length < 12) {
        sendJson(response, 400, { error: "Fall, Beitragsart, Kurzbeschreibung und Erläuterung sind erforderlich.", code: "invalid_contribution" }); return true;
      }
      const arrivalCase = db.prepare("SELECT id FROM arrival_cases WHERE id=? AND tenant_id=?").get(caseId, session.tenantId);
      if (!arrivalCase) { sendJson(response, 404, { error: "Synthetischer Fall in diesem Mandanten nicht gefunden." }); return true; }
      const id = `SYN-CONTRIB-${randomUUID()}`;
      const createdAt = new Date().toISOString();
      db.prepare(`INSERT INTO employer_contributions
        (id,tenant_id,case_id,contribution_type,summary,detail,status,created_by,created_role,created_at,shared_status,synthetic)
        VALUES (?,?,?,?,?,?,'submitted',?,?,?,'An AMAVIO übergeben',1)`)
        .run(id, session.tenantId, caseId, type, summary, detail, session.userId, session.role, createdAt);
      audit(db, session, "collaboration.employer_contribution.submitted", "employer_contribution", id, { caseId, type, synthetic: true, externalEffect: false });
      sendJson(response, 201, { contribution: serialize(db.prepare("SELECT * FROM employer_contributions WHERE id=? AND tenant_id=?").get(id, session.tenantId)), externalEffect: false });
      return true;
    }

    const reviewMatch = url.pathname.match(/^\/api\/collaboration\/v1\/contributions\/([^/]+)\/review$/);
    if (request.method === "POST" && reviewMatch) {
      if (group !== "amavio") { sendJson(response, 403, { error: "Nur AMAVIO Operations kann einen eingegangenen Beitrag fachlich prüfen.", code: "operations_role_required" }); return true; }
      const body = await readBody(request);
      const id = decodeURIComponent(reviewMatch[1]);
      const decision = body.decision === "returned" ? "returned" : "reviewed";
      const note = text(body.note, 1_200);
      if (note.length < 12) { sendJson(response, 400, { error: "Eine nachvollziehbare Prüfnotiz ist erforderlich.", code: "review_note_required" }); return true; }
      const current = db.prepare("SELECT * FROM employer_contributions WHERE id=? AND tenant_id=?").get(id, session.tenantId);
      if (!current) { sendJson(response, 404, { error: "Arbeitgeberbeitrag nicht gefunden." }); return true; }
      if (current.status !== "submitted") { sendJson(response, 409, { error: "Arbeitgeberbeitrag wurde bereits fachlich bearbeitet.", code: "contribution_already_reviewed" }); return true; }
      const includeInLearning = body.includeInLearning === true && current.contribution_type === "outcome_feedback" && decision === "reviewed";
      const reviewedAt = new Date().toISOString();
      const learningFeedbackId = includeInLearning ? `SYN-LEARN-CONTRIB-${id}` : null;
      db.exec("BEGIN IMMEDIATE");
      try {
        db.prepare(`UPDATE employer_contributions
          SET status=?,reviewed_by=?,reviewed_at=?,review_note=?,shared_status=?
          WHERE id=? AND tenant_id=?`)
          .run(decision, session.userId, reviewedAt, note, decision === "reviewed" ? "Gemeinsamer Status aktualisiert" : "Rückfrage an Arbeitgeber vorbereitet", id, session.tenantId);
        if (includeInLearning) {
          db.prepare(`INSERT OR IGNORE INTO learning_feedback
            (id,tenant_id,title,related_event_id,observation,expected_outcome,actual_outcome,correction_type,evidence_refs_json,operator_note,status,severity,version,created_by,created_at,updated_at,synthetic)
            VALUES (?,?,?,?,?,?,?,?,?,?,?,?,1,?,?,?,1)`)
            .run(
              learningFeedbackId,
              session.tenantId,
              current.summary,
              null,
              current.detail,
              "Die Arbeitgeberrückmeldung wird gegen den dokumentierten Fallstand und das erwartete Arrival-Outcome geprüft.",
              current.detail,
              "evaluation_gap",
              JSON.stringify([current.case_id, current.id]),
              note,
              "outcome_linked",
              "medium",
              session.userId,
              reviewedAt,
              reviewedAt,
            );
        }
        db.exec("COMMIT");
      } catch (error) {
        db.exec("ROLLBACK");
        throw error;
      }
      audit(db, session, "collaboration.employer_contribution.reviewed", "employer_contribution", id, { decision, includeInLearning, learningFeedbackId, synthetic: true, externalEffect: false });
      sendJson(response, 200, {
        contribution: serialize(db.prepare("SELECT * FROM employer_contributions WHERE id=? AND tenant_id=?").get(id, session.tenantId)),
        learningIntake: includeInLearning ? { created: true, id: learningFeedbackId, internalOnly: true } : { created: false, internalOnly: true },
        externalEffect: false,
      });
      return true;
    }

    sendJson(response, 404, { error: "Collaboration-API-Pfad nicht gefunden." });
    return true;
  };
}

