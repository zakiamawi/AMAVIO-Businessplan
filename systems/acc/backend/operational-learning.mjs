import { createHash, randomUUID } from "node:crypto";

const text = (value, max = 2_000) => String(value ?? "").trim().slice(0, max);
const json = (value, fallback = {}) => { try { return JSON.parse(value); } catch { return fallback; } };
const hash = (value) => createHash("sha256").update(JSON.stringify(value)).digest("hex");
const FIXTURE_SET = Object.freeze({ id: "acc-learning-fixtures-v1", count: 24, synthetic: true });

const QUALITY_DIMENSIONS = Object.freeze([
  { id: "evidence_fidelity", label: "Evidenztreue", direction: "higher", baseline: 92, candidate: 96 },
  { id: "actionability", label: "Handlungsfähigkeit", direction: "higher", baseline: 88, candidate: 92 },
  { id: "policy_compliance", label: "Policy-Konformität", direction: "higher", baseline: 100, candidate: 100 },
  { id: "reproducibility", label: "Reproduzierbarkeit", direction: "higher", baseline: 100, candidate: 100 },
  { id: "correction_effort", label: "Korrekturaufwand", direction: "lower", baseline: 84, candidate: 78 },
]);

const VERSION_FIXTURES = Object.freeze([
  { id: "SYN-LEARN-VERSION-POLICY-12", type: "policy_set", label: "Policy Set", version: "arrival-policy-v1.2", status: "active", basis: "8 Regeln", quality: 100, predecessor: "arrival-policy-v1.1" },
  { id: "SYN-LEARN-VERSION-CAP-21", type: "capability", label: "Capability", version: "critical-path-replan-v2.1", status: "candidate", basis: "24 Fixtures", quality: 92, predecessor: "critical-path-replan-v2.0" },
  { id: "SYN-LEARN-VERSION-ENGINE-15", type: "local_engine", label: "Local Engine", version: "amavio-domain-engine-v1.5", status: "baseline", basis: "41 Routen", quality: 100, predecessor: null },
  { id: "SYN-LEARN-VERSION-ADAPTER-1", type: "provider_adapter", label: "Provider Adapter", version: "provider-neutral-v1", status: "disabled", basis: "0 Calls · 0 EUR", quality: null, predecessor: null },
]);

const FEEDBACK_FIXTURES = Object.freeze([
  { id: "SYN-LEARN-FB-001", title: "Adresskonflikt früher markieren", eventId: "SYN-TWIN-EVT-001", observation: "Adresskonflikt wird aktuell zu spät erkannt. Er sollte bereits bei der ersten Prüfung markiert werden.", expected: "Konflikt wird im Initial-Check erkannt und als Hinweis ausgegeben.", actual: "Konflikt wird erkannt und im Fall als Hinweis dokumentiert.", correction: "policy_adjustment", evidence: ["SYN-TWIN-EVT-001", "SYN-CASE-001-EVD-1", "SYN-CASE-001-EVD-2"], note: "Reduziert manuelle Rückfragen im Team.", status: "outcome_linked", severity: "medium" },
  { id: "SYN-LEARN-FB-002", title: "Standortübergabe präzisieren", eventId: "SYN-TWIN-EVT-002", observation: "Die Übergabeverantwortung ist fachlich richtig, aber noch nicht präzise genug formuliert.", expected: "Standortrolle und Frist sind in einem prüfbaren Satz benannt.", actual: "Rolle und Frist erscheinen im Arbeitsplan.", correction: "output_contract", evidence: ["SYN-TWIN-EVT-002", "SYN-CASE-002-TASK-1"], note: "Formulierung als Abnahmekriterium festhalten.", status: "outcome_linked", severity: "low" },
  { id: "SYN-LEARN-FB-003", title: "Budgetbegründung fehlt", eventId: "SYN-TWIN-EVT-005", observation: "Der Arbeitsplan benennt die Budgetrolle, fordert aber noch keine strukturierte Begründung.", expected: "Budgetentscheidung enthält Belegreferenzen und eine kurze Begründung.", actual: "", correction: "evaluation_gap", evidence: ["SYN-TWIN-EVT-005", "SYN-CASE-005-EVD-1"], note: "Outcome nach nächstem synthetischem Durchlauf zuordnen.", status: "outcome_missing", severity: "high" },
  { id: "SYN-LEARN-FB-004", title: "Review-Frist zu spät erkannt", eventId: "SYN-TWIN-EVT-004", observation: "Die überfällige Review-Frist sollte vor dem Eskalationszeitpunkt sichtbar werden.", expected: "Fristrisiko wird mindestens drei Tage vor Fälligkeit markiert.", actual: "Fristrisiko wird in der lokalen Evaluation korrekt vorgezogen.", correction: "policy_adjustment", evidence: ["SYN-TWIN-EVT-004"], note: "Kein Außenkanal erforderlich.", status: "outcome_linked", severity: "medium" },
  { id: "SYN-LEARN-FB-005", title: "Arbeitsplan-Schritt unklar", eventId: "SYN-TWIN-EVT-003", observation: "Ein Neuplanungsschritt benennt die Abhängigkeit, aber nicht das Prüfkriterium.", expected: "Jeder kritische Schritt enthält Verantwortung, Frist und Prüfkriterium.", actual: "Kandidat v2.1 ergänzt das fehlende Prüfkriterium.", correction: "capability_revision", evidence: ["SYN-TWIN-EVT-003"], note: "In 24 Fixtures reproduzierbar.", status: "outcome_linked", severity: "medium" },
  { id: "SYN-LEARN-FB-006", title: "Simulation gut nachvollziehbar", eventId: "SYN-TWIN-EVT-003", observation: "Die isolierte Drei-Tage-Variante ist verständlich und hält den Originalfall unverändert.", expected: "Auswirkung und No-Effect-Grenze sind gemeinsam erkennbar.", actual: "Beide Kriterien werden in allen synthetischen Varianten erfüllt.", correction: "no_change", evidence: ["SYN-TWIN-EVT-003"], note: "Als positive Baseline beibehalten.", status: "outcome_linked", severity: "positive" },
]);

function dimensionResults() {
  return QUALITY_DIMENSIONS.map((item) => {
    const rawDelta = item.candidate - item.baseline;
    const improvement = item.direction === "lower" ? item.baseline - item.candidate : rawDelta;
    return { ...item, adapter: null, rawDelta, improvement, passed: improvement >= 0, interpretation: item.direction === "lower" ? "Weniger manuelle Korrekturen sind besser." : "Ein höherer Wert ist besser." };
  });
}

function comparisonPayload() {
  const dimensions = dimensionResults();
  const identity = {
    fixtureSet: FIXTURE_SET,
    baseline: "amavio-domain-engine-v1.5",
    candidate: "critical-path-replan-v2.1",
    dimensions: dimensions.map(({ id, baseline, candidate, direction }) => ({ id, baseline, candidate, direction })),
  };
  return {
    baseline: { version: identity.baseline, fingerprint: hash({ ...identity, side: "baseline" }) },
    candidate: { version: identity.candidate, fingerprint: hash({ ...identity, side: "candidate" }) },
    adapter: { version: "provider-neutral-v1", status: "disabled", calls: 0, costEvent: false, scores: null },
    fixtureSet: FIXTURE_SET,
    dimensions,
    outcomeComparison: { expected: 24, actualBaseline: 22, actualCandidate: 23, matchBaseline: 91.7, matchCandidate: 95.8, operatorCorrectionsBaseline: 19, operatorCorrectionsCandidate: 8 },
    policyDiff: [
      { policy: "PR-AC-017 · Initial-Check", baseline: "Hinweis", candidate: "Pflicht-Flag", status: "changed", rationale: "Adresskonflikte werden früher sichtbar." },
      { policy: "Verbotene externe Aktionen", baseline: "unverändert", candidate: "unverändert", status: "unchanged", rationale: "Keine Nachricht, Buchung oder automatische Freigabe." },
    ],
    reproducibilityFingerprint: hash(identity),
    externalCalls: 0,
    providerCosts: false,
    externalEffect: false,
    automaticActivation: false,
  };
}

function seedFeedback(db, item) {
  db.prepare(`INSERT OR IGNORE INTO learning_feedback
    (id,tenant_id,title,related_event_id,observation,expected_outcome,actual_outcome,correction_type,evidence_refs_json,operator_note,status,severity,version,created_by,created_at,updated_at,synthetic)
    VALUES (?,?,?,?,?,?,?,?,?,?,?,?,1,?,'2026-09-18T13:00:00.000Z','2026-09-18T13:00:00.000Z',1)`)
    .run(item.id, "SYN-TENANT-001", item.title, item.eventId, item.observation, item.expected, item.actual, item.correction, JSON.stringify(item.evidence), item.note, item.status, item.severity, "SYN-USER-OPS-001");
}

export function installOperationalLearning(db) {
  db.exec(`
    CREATE TABLE IF NOT EXISTS learning_feedback (
      id TEXT PRIMARY KEY, tenant_id TEXT NOT NULL REFERENCES tenants(id), title TEXT NOT NULL,
      related_event_id TEXT, observation TEXT NOT NULL, expected_outcome TEXT NOT NULL,
      actual_outcome TEXT NOT NULL DEFAULT '', correction_type TEXT NOT NULL,
      evidence_refs_json TEXT NOT NULL, operator_note TEXT NOT NULL DEFAULT '', status TEXT NOT NULL,
      severity TEXT NOT NULL, version INTEGER NOT NULL DEFAULT 1,
      created_by TEXT NOT NULL REFERENCES users(id), created_at TEXT NOT NULL, updated_at TEXT NOT NULL,
      synthetic INTEGER NOT NULL CHECK (synthetic = 1)
    );
    CREATE TABLE IF NOT EXISTS learning_evaluations (
      id TEXT PRIMARY KEY, tenant_id TEXT NOT NULL REFERENCES tenants(id), fixture_set TEXT NOT NULL,
      baseline_version TEXT NOT NULL, candidate_version TEXT NOT NULL, input_hash TEXT NOT NULL,
      result_json TEXT NOT NULL, status TEXT NOT NULL, created_by TEXT NOT NULL REFERENCES users(id), created_at TEXT NOT NULL
    );
    CREATE TABLE IF NOT EXISTS learning_comparisons (
      id TEXT PRIMARY KEY, tenant_id TEXT NOT NULL REFERENCES tenants(id), evaluation_id TEXT NOT NULL REFERENCES learning_evaluations(id),
      result_json TEXT NOT NULL, decision_status TEXT NOT NULL, decision_rationale TEXT,
      reviewed_by TEXT, reviewed_at TEXT, version INTEGER NOT NULL DEFAULT 1, created_at TEXT NOT NULL
    );
    CREATE TABLE IF NOT EXISTS learning_versions (
      id TEXT PRIMARY KEY, tenant_id TEXT NOT NULL REFERENCES tenants(id), component_type TEXT NOT NULL,
      label TEXT NOT NULL, version_label TEXT NOT NULL, status TEXT NOT NULL, basis TEXT NOT NULL,
      quality_score REAL, predecessor TEXT, activated INTEGER NOT NULL DEFAULT 0,
      version INTEGER NOT NULL DEFAULT 1, synthetic INTEGER NOT NULL CHECK (synthetic = 1)
    );
    CREATE INDEX IF NOT EXISTS idx_learning_feedback_tenant ON learning_feedback(tenant_id,updated_at DESC);
    CREATE INDEX IF NOT EXISTS idx_learning_eval_tenant ON learning_evaluations(tenant_id,created_at DESC);
  `);
  FEEDBACK_FIXTURES.forEach((item) => seedFeedback(db, item));
  for (const item of VERSION_FIXTURES) {
    db.prepare(`INSERT OR IGNORE INTO learning_versions
      (id,tenant_id,component_type,label,version_label,status,basis,quality_score,predecessor,activated,version,synthetic)
      VALUES (?,?,?,?,?,?,?,?,?,?,1,1)`)
      .run(item.id, "SYN-TENANT-001", item.type, item.label, item.version, item.status, item.basis, item.quality, item.predecessor, item.status === "active" ? 1 : 0);
  }
  const result = comparisonPayload();
  db.prepare(`INSERT OR IGNORE INTO learning_evaluations
    (id,tenant_id,fixture_set,baseline_version,candidate_version,input_hash,result_json,status,created_by,created_at)
    VALUES (?,?,?,?,?,?,?,?,?,'2026-09-18T14:00:00.000Z')`)
    .run("SYN-LEARN-EVAL-018", "SYN-TENANT-001", FIXTURE_SET.id, result.baseline.version, result.candidate.version, result.reproducibilityFingerprint, JSON.stringify(result), "completed", "SYN-USER-OPS-001");
  db.prepare(`INSERT OR IGNORE INTO learning_comparisons
    (id,tenant_id,evaluation_id,result_json,decision_status,version,created_at)
    VALUES (?,?,?,?, 'awaiting_human_review',1,'2026-09-18T14:01:00.000Z')`)
    .run("SYN-LEARN-COMP-004", "SYN-TENANT-001", "SYN-LEARN-EVAL-018", JSON.stringify(result));
}

function serializeFeedback(row) {
  return {
    id: row.id, title: row.title, relatedEventId: row.related_event_id, observation: row.observation,
    expectedOutcome: row.expected_outcome, actualOutcome: row.actual_outcome, correctionType: row.correction_type,
    evidenceRefs: json(row.evidence_refs_json, []), operatorNote: row.operator_note, status: row.status,
    severity: row.severity, version: row.version, updatedAt: row.updated_at, synthetic: true,
  };
}

function serializeVersion(row) {
  return { id: row.id, type: row.component_type, label: row.label, version: row.version_label, status: row.status, basis: row.basis, quality: row.quality_score, predecessor: row.predecessor, activated: Boolean(row.activated), reviewVersion: row.version };
}

function serializeEvaluation(row) {
  return { id: row.id, fixtureSet: row.fixture_set, baselineVersion: row.baseline_version, candidateVersion: row.candidate_version, inputHash: row.input_hash, result: json(row.result_json, {}), status: row.status, createdAt: row.created_at };
}

function serializeComparison(row) {
  return { id: row.id, evaluationId: row.evaluation_id, result: json(row.result_json, {}), decisionStatus: row.decision_status, decisionRationale: row.decision_rationale, version: row.version, createdAt: row.created_at, automaticActivation: false, externalEffect: false };
}

export function createOperationalLearningHandler({ db, sendJson, readBody, requireSession, audit }) {
  return async function handleOperationalLearning(request, response, url) {
    if (!url.pathname.startsWith("/api/learning/v1/")) return false;
    const session = requireSession(request, response); if (!session) return true;
    if (session.role !== "operations") { sendJson(response, 403, { error: "Operational Learning ist ausschließlich AMAVIO Operations zugeordnet.", code: "role_scope_denied" }); return true; }

    if (request.method === "GET" && url.pathname === "/api/learning/v1/bootstrap") {
      const feedback = db.prepare("SELECT * FROM learning_feedback WHERE tenant_id=? ORDER BY id").all(session.tenantId).map(serializeFeedback);
      const versions = db.prepare("SELECT * FROM learning_versions WHERE tenant_id=? ORDER BY CASE component_type WHEN 'policy_set' THEN 1 WHEN 'capability' THEN 2 WHEN 'local_engine' THEN 3 ELSE 4 END").all(session.tenantId).map(serializeVersion);
      const evaluation = db.prepare("SELECT * FROM learning_evaluations WHERE tenant_id=? ORDER BY created_at DESC,id DESC LIMIT 1").get(session.tenantId);
      const comparison = db.prepare("SELECT * FROM learning_comparisons WHERE tenant_id=? ORDER BY created_at DESC,id DESC LIMIT 1").get(session.tenantId);
      sendJson(response, 200, {
        scope: { title: "Operational Learning", cohort: "Pflegekohorte September", evaluationBasis: "2026-09" },
        loop: { feedback: feedback.length, outcomesLinked: feedback.filter((item) => item.status === "outcome_linked").length, qualityDimensions: QUALITY_DIMENSIONS.length, comparedScenarios: 3, openDecisions: comparison?.decision_status === "awaiting_human_review" ? 1 : 0 },
        feedback, selected: feedback[0], versions,
        evaluation: evaluation ? serializeEvaluation(evaluation) : null,
        comparison: comparison ? serializeComparison(comparison) : null,
        boundaries: { syntheticOnly: true, providerAdapters: "disabled", externalCalls: 0, providerCosts: false, automaticActivation: false, externalEffect: false },
      });
      return true;
    }

    if (request.method === "GET" && url.pathname === "/api/learning/v1/versions") {
      sendJson(response, 200, { versions: db.prepare("SELECT * FROM learning_versions WHERE tenant_id=? ORDER BY id").all(session.tenantId).map(serializeVersion) }); return true;
    }

    const feedbackMatch = url.pathname.match(/^\/api\/learning\/v1\/feedback\/([^/]+)$/);
    if (request.method === "GET" && feedbackMatch) {
      const row = db.prepare("SELECT * FROM learning_feedback WHERE id=? AND tenant_id=?").get(decodeURIComponent(feedbackMatch[1]), session.tenantId);
      if (!row) { sendJson(response, 404, { error: "Feedback im aktiven Mandanten nicht gefunden." }); return true; }
      sendJson(response, 200, { feedback: serializeFeedback(row) }); return true;
    }

    if (request.method === "POST" && url.pathname === "/api/learning/v1/feedback") {
      const body = await readBody(request); const title = text(body.title, 160); const observation = text(body.observation); const expected = text(body.expectedOutcome);
      if (!title || !observation || !expected) { sendJson(response, 400, { error: "Titel, Beobachtung und erwartetes Outcome sind erforderlich." }); return true; }
      const id = `LEARN-FB-${randomUUID()}`; const now = new Date().toISOString(); const actual = text(body.actualOutcome);
      db.prepare(`INSERT INTO learning_feedback
        (id,tenant_id,title,related_event_id,observation,expected_outcome,actual_outcome,correction_type,evidence_refs_json,operator_note,status,severity,version,created_by,created_at,updated_at,synthetic)
        VALUES (?,?,?,?,?,?,?,?,?,?,?,?,1,?,?,?,1)`)
        .run(id, session.tenantId, title, text(body.relatedEventId, 100), observation, expected, actual, text(body.correctionType, 80) || "evaluation_gap", JSON.stringify(Array.isArray(body.evidenceRefs) ? body.evidenceRefs.map((item) => text(item, 120)).filter(Boolean) : []), text(body.operatorNote), actual ? "outcome_linked" : "outcome_missing", text(body.severity, 30) || "medium", session.userId, now, now);
      audit(db, session, "learning.feedback.created", "learning_feedback", id, { structured: true, synthetic: true });
      sendJson(response, 201, { feedback: serializeFeedback(db.prepare("SELECT * FROM learning_feedback WHERE id=?").get(id)), externalEffect: false }); return true;
    }

    if (request.method === "PATCH" && feedbackMatch) {
      const id = decodeURIComponent(feedbackMatch[1]); const row = db.prepare("SELECT * FROM learning_feedback WHERE id=? AND tenant_id=?").get(id, session.tenantId);
      if (!row) { sendJson(response, 404, { error: "Feedback im aktiven Mandanten nicht gefunden." }); return true; }
      const body = await readBody(request); const version = Number(body.version); const observation = text(body.observation); const expected = text(body.expectedOutcome); const actual = text(body.actualOutcome);
      if (version !== row.version || !observation || !expected) { sendJson(response, 409, { error: "Aktuelle Version, Beobachtung und erwartetes Outcome sind erforderlich.", code: "version_conflict" }); return true; }
      const updated = db.prepare(`UPDATE learning_feedback SET observation=?,expected_outcome=?,actual_outcome=?,correction_type=?,evidence_refs_json=?,operator_note=?,status=?,version=version+1,updated_at=? WHERE id=? AND tenant_id=? AND version=?`)
        .run(observation, expected, actual, text(body.correctionType, 80) || row.correction_type, JSON.stringify(Array.isArray(body.evidenceRefs) ? body.evidenceRefs.map((item) => text(item, 120)).filter(Boolean) : json(row.evidence_refs_json, [])), text(body.operatorNote), actual ? "outcome_linked" : "outcome_missing", new Date().toISOString(), id, session.tenantId, version);
      if (updated.changes !== 1) { sendJson(response, 409, { error: "Feedback wurde parallel geändert.", code: "version_conflict" }); return true; }
      audit(db, session, "learning.feedback.updated", "learning_feedback", id, { outcomeLinked: Boolean(actual) });
      sendJson(response, 200, { feedback: serializeFeedback(db.prepare("SELECT * FROM learning_feedback WHERE id=?").get(id)), externalEffect: false }); return true;
    }

    if (request.method === "POST" && url.pathname === "/api/learning/v1/evaluations") {
      const result = comparisonPayload(); const id = `LEARN-EVAL-${randomUUID()}`; const now = new Date().toISOString();
      db.prepare(`INSERT INTO learning_evaluations (id,tenant_id,fixture_set,baseline_version,candidate_version,input_hash,result_json,status,created_by,created_at) VALUES (?,?,?,?,?,?,?,?,?,?)`)
        .run(id, session.tenantId, FIXTURE_SET.id, result.baseline.version, result.candidate.version, result.reproducibilityFingerprint, JSON.stringify(result), "completed", session.userId, now);
      audit(db, session, "learning.evaluation.completed", "learning_evaluation", id, { fixtureCount: FIXTURE_SET.count, externalCalls: 0 });
      sendJson(response, 201, { evaluation: serializeEvaluation(db.prepare("SELECT * FROM learning_evaluations WHERE id=?").get(id)) }); return true;
    }

    const evaluationMatch = url.pathname.match(/^\/api\/learning\/v1\/evaluations\/([^/]+)$/);
    if (request.method === "GET" && evaluationMatch) {
      const row = db.prepare("SELECT * FROM learning_evaluations WHERE id=? AND tenant_id=?").get(decodeURIComponent(evaluationMatch[1]), session.tenantId);
      if (!row) { sendJson(response, 404, { error: "Evaluation im aktiven Mandanten nicht gefunden." }); return true; }
      sendJson(response, 200, { evaluation: serializeEvaluation(row) }); return true;
    }

    if (request.method === "POST" && url.pathname === "/api/learning/v1/comparisons") {
      const body = await readBody(request); const evaluationId = text(body.evaluationId, 120);
      const evaluation = evaluationId ? db.prepare("SELECT * FROM learning_evaluations WHERE id=? AND tenant_id=?").get(evaluationId, session.tenantId) : db.prepare("SELECT * FROM learning_evaluations WHERE tenant_id=? ORDER BY created_at DESC,id DESC LIMIT 1").get(session.tenantId);
      if (!evaluation) { sendJson(response, 404, { error: "Evaluation im aktiven Mandanten nicht gefunden." }); return true; }
      const id = `LEARN-COMP-${randomUUID()}`; const result = json(evaluation.result_json, {});
      db.prepare(`INSERT INTO learning_comparisons (id,tenant_id,evaluation_id,result_json,decision_status,version,created_at) VALUES (?,?,?,?, 'awaiting_human_review',1,?)`)
        .run(id, session.tenantId, evaluation.id, JSON.stringify(result), new Date().toISOString());
      audit(db, session, "learning.comparison.created", "learning_comparison", id, { evaluationId: evaluation.id, externalCalls: 0, automaticActivation: false });
      sendJson(response, 201, { comparison: serializeComparison(db.prepare("SELECT * FROM learning_comparisons WHERE id=?").get(id)) }); return true;
    }

    const comparisonMatch = url.pathname.match(/^\/api\/learning\/v1\/comparisons\/([^/]+)$/);
    if (request.method === "GET" && comparisonMatch) {
      const row = db.prepare("SELECT * FROM learning_comparisons WHERE id=? AND tenant_id=?").get(decodeURIComponent(comparisonMatch[1]), session.tenantId);
      if (!row) { sendJson(response, 404, { error: "Vergleich im aktiven Mandanten nicht gefunden." }); return true; }
      sendJson(response, 200, { comparison: serializeComparison(row) }); return true;
    }

    const decisionMatch = url.pathname.match(/^\/api\/learning\/v1\/versions\/([^/]+)\/decisions$/);
    if (request.method === "POST" && decisionMatch) {
      const versionId = decodeURIComponent(decisionMatch[1]); const versionRow = db.prepare("SELECT * FROM learning_versions WHERE id=? AND tenant_id=?").get(versionId, session.tenantId);
      if (!versionRow) { sendJson(response, 404, { error: "Version im aktiven Mandanten nicht gefunden." }); return true; }
      const body = await readBody(request); const rationale = text(body.rationale); const comparisonId = text(body.comparisonId, 160); const reviewVersion = Number(body.version);
      if (!rationale || !comparisonId || reviewVersion !== versionRow.version || versionRow.status !== "candidate") { sendJson(response, 409, { error: "Offener Kandidat, aktuelle Version, Vergleich und Begründung sind erforderlich.", code: "version_decision_conflict" }); return true; }
      const comparison = db.prepare("SELECT * FROM learning_comparisons WHERE id=? AND tenant_id=? AND decision_status='awaiting_human_review'").get(comparisonId, session.tenantId);
      if (!comparison) { sendJson(response, 409, { error: "Offener Vergleich im aktiven Mandanten ist erforderlich.", code: "comparison_closed" }); return true; }
      db.exec("BEGIN IMMEDIATE");
      try {
        const changed = db.prepare("UPDATE learning_versions SET status='candidate_reviewed',version=version+1 WHERE id=? AND tenant_id=? AND version=? AND status='candidate'").run(versionId, session.tenantId, reviewVersion);
        if (changed.changes !== 1) throw Object.assign(new Error("Version wurde parallel geprüft."), { status: 409, code: "version_decision_conflict" });
        db.prepare("UPDATE learning_comparisons SET decision_status='advisory_approved',decision_rationale=?,reviewed_by=?,reviewed_at=?,version=version+1 WHERE id=? AND tenant_id=? AND decision_status='awaiting_human_review'").run(rationale, session.userId, new Date().toISOString(), comparisonId, session.tenantId);
        db.exec("COMMIT");
      } catch (error) { db.exec("ROLLBACK"); throw error; }
      audit(db, session, "learning.version.candidate_reviewed", "learning_version", versionId, { comparisonId, automaticActivation: false, externalEffect: false });
      sendJson(response, 200, { version: serializeVersion(db.prepare("SELECT * FROM learning_versions WHERE id=?").get(versionId)), comparison: serializeComparison(db.prepare("SELECT * FROM learning_comparisons WHERE id=?").get(comparisonId)), activated: false, externalEffect: false }); return true;
    }

    sendJson(response, 404, { error: "Operational-Learning-API-Pfad nicht gefunden." }); return true;
  };
}
