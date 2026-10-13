import { createServer } from "node:http";
import { readFile } from "node:fs/promises";
import { existsSync, mkdirSync } from "node:fs";
import { dirname, extname, resolve, sep } from "node:path";
import { fileURLToPath, pathToFileURL } from "node:url";
import { createHash, randomUUID } from "node:crypto";
import { DatabaseSync } from "node:sqlite";
import { installGate15, createGate15Handler, loadOperationalCaseDetail } from "./gate-01-5.mjs";
import { createProviderRegistry } from "./provider-adapters.mjs";
import { createIntelligenceKernel, createIntelligenceKernelHandler } from "./intelligence-kernel.mjs";
import { createVerticalCapabilityKernel, createVerticalCapabilityHandler } from "./intelligence-kernel-v2.mjs";
import { authorizeRequest } from "./role-contract.mjs";
import { installOperationsTwin, createOperationsTwinHandler } from "./operations-twin.mjs";
import { installOperationalLearning, createOperationalLearningHandler } from "./operational-learning.mjs";
import { installCollaboration, createCollaborationHandler } from "./collaboration.mjs";
import { installProgramDelivery, createProgramDeliveryHandler } from "./program-delivery.mjs";
import { installIntelligenceKernelV3, createIntelligenceKernelV3, createIntelligenceKernelV3Handler } from "./intelligence-kernel-v3.mjs";
import { installExecutionLoop, createExecutionLoopHandler } from "./execution-loop.mjs";
import { installArrivalReliability, createArrivalReliabilityHandler } from "./arrival-reliability.mjs";

const backendDirectory = dirname(fileURLToPath(import.meta.url));
const projectRoot = resolve(backendDirectory, "..");
const defaultDatabasePath = resolve(backendDirectory, "data", "acc-release-q-true-workspaces.sqlite");
const demoSessions = new Map([
  ["demo-session-alpha", { userId: "SYN-USER-OPS-001", tenantId: "SYN-TENANT-001", role: "operations" }],
  ["demo-session-operations", { userId: "SYN-USER-OPS-001", tenantId: "SYN-TENANT-001", role: "operations" }],
  ["demo-session-employer-sponsor", { userId: "SYN-USER-SPONSOR-001", tenantId: "SYN-TENANT-001", role: "employer_sponsor" }],
  ["demo-session-employer-hr", { userId: "SYN-USER-HR-001", tenantId: "SYN-TENANT-001", role: "employer_hr" }],
  ["demo-session-employer-location", { userId: "SYN-USER-LOCATION-001", tenantId: "SYN-TENANT-001", role: "employer_location" }],
  ["demo-session-employer-budget", { userId: "SYN-USER-BUDGET-001", tenantId: "SYN-TENANT-001", role: "employer_budget" }],
  ["demo-session-beta", { userId: "SYN-USER-OPS-002", tenantId: "SYN-TENANT-002", role: "operations" }],
]);

const contentTypes = {
  ".html": "text/html; charset=utf-8",
  ".css": "text/css; charset=utf-8",
  ".js": "text/javascript; charset=utf-8",
  ".svg": "image/svg+xml",
  ".png": "image/png",
  ".woff2": "font/woff2",
  ".json": "application/json; charset=utf-8",
};

function now() { return new Date().toISOString(); }
function parseJson(value, fallback) { try { return JSON.parse(value); } catch { return fallback; } }
class HttpError extends Error {
  constructor(status, code, message) { super(message); this.status = status; this.code = code; }
}
function sendJson(response, status, payload) {
  response.writeHead(status, { "content-type": "application/json; charset=utf-8", "cache-control": "no-store" });
  response.end(JSON.stringify(payload));
}

function initializeDatabase(databasePath) {
  mkdirSync(dirname(databasePath), { recursive: true });
  const db = new DatabaseSync(databasePath);
  db.exec(`
    PRAGMA foreign_keys = ON;
    PRAGMA journal_mode = WAL;
    CREATE TABLE IF NOT EXISTS tenants (
      id TEXT PRIMARY KEY, name TEXT NOT NULL, synthetic INTEGER NOT NULL CHECK (synthetic = 1)
    );
    CREATE TABLE IF NOT EXISTS users (
      id TEXT PRIMARY KEY, tenant_id TEXT NOT NULL REFERENCES tenants(id), display_name TEXT NOT NULL,
      role TEXT NOT NULL, synthetic INTEGER NOT NULL CHECK (synthetic = 1)
    );
    CREATE TABLE IF NOT EXISTS arrival_cases (
      id TEXT PRIMARY KEY, tenant_id TEXT NOT NULL REFERENCES tenants(id), title TEXT NOT NULL,
      location TEXT NOT NULL, arrival_date TEXT NOT NULL, status TEXT NOT NULL,
      evidence_json TEXT NOT NULL, created_at TEXT NOT NULL
    );
    CREATE TABLE IF NOT EXISTS assistant_runs (
      id TEXT PRIMARY KEY, tenant_id TEXT NOT NULL REFERENCES tenants(id), case_id TEXT NOT NULL REFERENCES arrival_cases(id),
      provider TEXT NOT NULL, model TEXT NOT NULL, objective TEXT NOT NULL, output_json TEXT NOT NULL,
      created_by TEXT NOT NULL REFERENCES users(id), created_at TEXT NOT NULL,
      review_decision TEXT, review_note TEXT, reviewed_by TEXT, reviewed_at TEXT,
      CHECK (review_decision IS NULL OR review_decision IN ('approved','rejected'))
    );
    CREATE TABLE IF NOT EXISTS outbox_previews (
      id TEXT PRIMARY KEY, tenant_id TEXT NOT NULL REFERENCES tenants(id), case_id TEXT NOT NULL REFERENCES arrival_cases(id),
      run_id TEXT NOT NULL REFERENCES assistant_runs(id), status TEXT NOT NULL CHECK (status = 'sink_only'),
      payload_json TEXT NOT NULL, created_by TEXT NOT NULL REFERENCES users(id), created_at TEXT NOT NULL
    );
    CREATE TABLE IF NOT EXISTS booking_previews (
      id TEXT PRIMARY KEY, tenant_id TEXT NOT NULL REFERENCES tenants(id), case_id TEXT NOT NULL REFERENCES arrival_cases(id),
      run_id TEXT NOT NULL REFERENCES assistant_runs(id), status TEXT NOT NULL CHECK (status = 'sink_only'),
      payload_json TEXT NOT NULL, created_by TEXT NOT NULL REFERENCES users(id), created_at TEXT NOT NULL
    );
    CREATE TABLE IF NOT EXISTS audit_events (
      sequence INTEGER PRIMARY KEY AUTOINCREMENT, id TEXT NOT NULL UNIQUE,
      tenant_id TEXT NOT NULL REFERENCES tenants(id), actor_id TEXT NOT NULL REFERENCES users(id),
      event_type TEXT NOT NULL, entity_type TEXT NOT NULL, entity_id TEXT NOT NULL,
      payload_json TEXT NOT NULL, created_at TEXT NOT NULL
    );
    CREATE TABLE IF NOT EXISTS api_idempotency (
      tenant_id TEXT NOT NULL REFERENCES tenants(id), idempotency_key TEXT NOT NULL,
      method TEXT NOT NULL, route TEXT NOT NULL, request_fingerprint TEXT NOT NULL,
      response_status INTEGER, response_json TEXT, state TEXT NOT NULL CHECK (state IN ('pending','completed')),
      created_at TEXT NOT NULL, completed_at TEXT,
      PRIMARY KEY (tenant_id,idempotency_key)
    );
    CREATE INDEX IF NOT EXISTS idx_cases_tenant ON arrival_cases(tenant_id);
    CREATE INDEX IF NOT EXISTS idx_runs_tenant_case ON assistant_runs(tenant_id, case_id, created_at DESC);
    CREATE INDEX IF NOT EXISTS idx_audit_tenant_sequence ON audit_events(tenant_id, sequence DESC);
  `);

  const insertTenant = db.prepare("INSERT OR IGNORE INTO tenants (id,name,synthetic) VALUES (?,?,1)");
  const insertUser = db.prepare("INSERT OR IGNORE INTO users (id,tenant_id,display_name,role,synthetic) VALUES (?,?,?,?,1)");
  const insertCase = db.prepare("INSERT OR IGNORE INTO arrival_cases (id,tenant_id,title,location,arrival_date,status,evidence_json,created_at) VALUES (?,?,?,?,?,?,?,?)");
  insertTenant.run("SYN-TENANT-001", "Nordstern Gesundheitsverbund · Demo");
  insertTenant.run("SYN-TENANT-002", "Westhafen Industriewerke · Demo");
  insertUser.run("SYN-USER-OPS-001", "SYN-TENANT-001", "Demo Operations 001", "amavio_operations");
  insertUser.run("SYN-USER-SPONSOR-001", "SYN-TENANT-001", "Demo Arbeitgeber Sponsor", "employer_sponsor");
  insertUser.run("SYN-USER-HR-001", "SYN-TENANT-001", "Demo HR Operations", "employer_hr");
  insertUser.run("SYN-USER-LOCATION-001", "SYN-TENANT-001", "Demo Standortverantwortung", "employer_location");
  insertUser.run("SYN-USER-BUDGET-001", "SYN-TENANT-001", "Demo Budgetverantwortung", "employer_budget");
  insertUser.run("SYN-USER-OPS-002", "SYN-TENANT-002", "Demo Operations 002", "amavio_operations");
  insertCase.run(
    "SYN-CASE-001", "SYN-TENANT-001", "Wohnraumfreigabe vor Anreise klären", "Düsseldorf", "2026-09-20", "review_required",
    JSON.stringify([
      { label: "Wohnoption", value: "synthetische Option seit zwei Tagen ungeprüft" },
      { label: "Schlüsselzeit", value: "noch nicht bestätigt" },
      { label: "Startdatum", value: "in 14 Tagen" },
    ]), now(),
  );
  insertCase.run(
    "SYN-CASE-900", "SYN-TENANT-002", "Standortkontakt für Demo-Anreise klären", "Köln", "2026-09-27", "review_required",
    JSON.stringify([{ label: "Kontakt", value: "synthetische Vertretung nicht bestätigt" }]), now(),
  );
  installGate15(db);
  installOperationsTwin(db);
  installOperationalLearning(db);
  installCollaboration(db);
  installProgramDelivery(db);
  installIntelligenceKernelV3(db);
  installExecutionLoop(db);
  installArrivalReliability(db);
  return db;
}

function sessionFor(request) {
  return demoSessions.get(String(request.headers["x-demo-session"] || ""));
}

function requireSession(request, response) {
  const session = sessionFor(request);
  if (!session) sendJson(response, 401, { error: "Lokale Demo-Sitzung fehlt oder ist ungültig." });
  return session;
}

const bodyCache = new WeakMap();
function readBody(request) {
  if (bodyCache.has(request)) return bodyCache.get(request);
  const promise = new Promise((resolveBody, rejectBody) => {
    let body = "";
    let rejected = false;
    request.setEncoding("utf8");
    request.on("data", (chunk) => {
      body += chunk;
      if (body.length > 65_536 && !rejected) { rejected = true; rejectBody(new HttpError(413, "request_too_large", "Anfrage zu groß.")); }
    });
    request.on("end", () => {
      if (rejected) return;
      try { resolveBody(body ? JSON.parse(body) : {}); }
      catch { rejectBody(new HttpError(400, "invalid_json", "Ungültiges JSON.")); }
    });
    request.on("error", rejectBody);
  });
  bodyCache.set(request, promise);
  return promise;
}

function stableValue(value) {
  if (Array.isArray(value)) return value.map(stableValue);
  if (value && typeof value === "object") return Object.fromEntries(Object.keys(value).sort().map((key) => [key, stableValue(value[key])]));
  return value;
}

function fingerprint(method, route, body) {
  return createHash("sha256").update(`${method}\n${route}\n${JSON.stringify(stableValue(body))}`).digest("hex");
}

async function prepareIdempotency({ request, response, url, db, session }) {
  if (!session || !["POST", "PATCH", "PUT", "DELETE"].includes(request.method || "")) return { handled: false };
  const key = String(request.headers["idempotency-key"] || "").trim();
  if (!key) { sendJson(response, 428, { error: "Idempotency-Key ist für jede Mutation erforderlich.", code: "idempotency_key_required" }); return { handled: true }; }
  if (!/^[A-Za-z0-9._:-]{8,120}$/.test(key)) { sendJson(response, 400, { error: "Idempotency-Key ist ungültig.", code: "invalid_idempotency_key" }); return { handled: true }; }
  const body = await readBody(request);
  const requestFingerprint = fingerprint(request.method, url.pathname, body);
  const existing = db.prepare("SELECT * FROM api_idempotency WHERE tenant_id=? AND idempotency_key=?").get(session.tenantId, key);
  if (existing) {
    if (existing.method !== request.method || existing.route !== url.pathname || existing.request_fingerprint !== requestFingerprint) {
      sendJson(response, 409, { error: "Idempotency-Key wurde mit einem anderen Request verwendet.", code: "idempotency_conflict" }); return { handled: true };
    }
    if (existing.state === "pending") { sendJson(response, 409, { error: "Identischer Request wird bereits verarbeitet.", code: "idempotency_in_progress" }); return { handled: true }; }
    response.setHeader("idempotency-replayed", "true");
    sendJson(response, existing.response_status, parseJson(existing.response_json, {}));
    return { handled: true };
  }
  db.prepare("INSERT INTO api_idempotency (tenant_id,idempotency_key,method,route,request_fingerprint,state,created_at) VALUES (?,?,?,?,?,'pending',?)")
    .run(session.tenantId, key, request.method, url.pathname, requestFingerprint, now());

  const originalEnd = response.end.bind(response);
  response.end = function idempotentEnd(chunk, ...args) {
    const status = response.statusCode || 200;
    if (status >= 500) db.prepare("DELETE FROM api_idempotency WHERE tenant_id=? AND idempotency_key=? AND state='pending'").run(session.tenantId, key);
    else db.prepare("UPDATE api_idempotency SET response_status=?,response_json=?,state='completed',completed_at=? WHERE tenant_id=? AND idempotency_key=?")
      .run(status, typeof chunk === "string" ? chunk : String(chunk || "{}"), now(), session.tenantId, key);
    return originalEnd(chunk, ...args);
  };
  return { handled: false };
}

function caseForTenant(db, caseId, tenantId) {
  return db.prepare("SELECT * FROM arrival_cases WHERE id = ? AND tenant_id = ?").get(caseId, tenantId);
}

function runForTenant(db, runId, tenantId) {
  return db.prepare("SELECT * FROM assistant_runs WHERE id = ? AND tenant_id = ?").get(runId, tenantId);
}

function audit(db, session, eventType, entityType, entityId, payload = {}) {
  db.prepare("INSERT INTO audit_events (id,tenant_id,actor_id,event_type,entity_type,entity_id,payload_json,created_at) VALUES (?,?,?,?,?,?,?,?)")
    .run(`AUD-${randomUUID()}`, session.tenantId, session.userId, eventType, entityType, entityId, JSON.stringify(payload), now());
}

function serializeCase(row) {
  return {
    id: row.id, title: row.title, location: row.location, arrivalDate: row.arrival_date,
    status: row.status, evidence: parseJson(row.evidence_json, []),
  };
}

function serializeRun(row) {
  if (!row) return null;
  return {
    id: row.id, caseId: row.case_id, provider: row.provider, model: row.model,
    output: parseJson(row.output_json, {}), createdAt: row.created_at,
    reviewDecision: row.review_decision, reviewNote: row.review_note, reviewedAt: row.reviewed_at,
  };
}

function generateStructuredFallback(arrivalCase, objective) {
  const evidence = parseJson(arrivalCase.evidence_json, []);
  return {
    schemaVersion: "acc.assistance.v1",
    summary: "Freigabe und Schlüsselzeit in einer belegten Prüfkette klären",
    recommendation: `Zuerst die synthetische Wohnoption fachlich prüfen, anschließend die Schlüsselzeit bestätigen und erst danach eine Ankunftsinformation vorbereiten. Arbeitsziel: ${objective}`,
    evidence: evidence.map((item) => `${item.label}: ${item.value}`),
    confidence: "mittel · 0,72",
    uncertainty: "Es liegen keine echte Verfügbarkeitsbestätigung, kein verifizierter Kontakt und keine produktive Datenquelle vor.",
    forbiddenActions: ["keine Person bewerten", "keine Freigabe selbst erteilen", "keine Nachricht senden", "keine Buchung auslösen"],
    proposedSteps: [
      { order: 1, action: "Wohnoption fachlich prüfen", ownerRole: "AMAVIO Operations", humanGate: true },
      { order: 2, action: "Schlüsselzeit bestätigen", ownerRole: "Standort", humanGate: true },
      { order: 3, action: "Ankunftsinformation vorbereiten", ownerRole: "HR", humanGate: true },
    ],
  };
}

function auditEvents(db, tenantId) {
  const labels = {
    "assistant.created": "Assistenzlauf gespeichert",
    "assistant.approved": "Vorschlag menschlich freigegeben",
    "assistant.rejected": "Vorschlag zurückgewiesen",
    "outbox.previewed": "Nachrichtenvorschau im Sink gespeichert",
    "booking.previewed": "Buchungsvorschau im Sink gespeichert",
  };
  return db.prepare("SELECT event_type,entity_type,entity_id,created_at FROM audit_events WHERE tenant_id = ? ORDER BY sequence DESC LIMIT 20")
    .all(tenantId).map((row) => ({ label: labels[row.event_type] || row.event_type, entityType: row.entity_type, entityId: row.entity_id, createdAt: row.created_at }));
}

function createApiHandler(db, providerMode) {
  return async function handleApi(request, response, url) {
    if (request.method === "GET" && url.pathname === "/api/health") {
      sendJson(response, 200, { status: "ok", release: "Q", runtime: "local", database: "sqlite", syntheticOnly: true, externalEffects: false, dualSidedWorkflow: true, programDelivery: true, intelligenceKernelV3: true, operationalExecutionLoop: true, employerWorkspace: true, consolidatedRuntime: true, goldenJourney: true, pilotMetrics: true, arrivalReliability: true, interventionSystem: true, serviceDeliveryProof: true, roleSeparation: true, usableWorkProducts: true, dualProductSurfaces: true, trueWorkspaces: true, functionalInformationArchitecture: true, providerCalls: 0 }); return;
    }
    const session = requireSession(request, response);
    if (!session) return;

    if (request.method === "GET" && url.pathname === "/api/v1/bootstrap") {
      const tenant = db.prepare("SELECT id,name FROM tenants WHERE id = ?").get(session.tenantId);
      const user = db.prepare("SELECT id,display_name,role FROM users WHERE id = ? AND tenant_id = ?").get(session.userId, session.tenantId);
      const arrivalCase = db.prepare("SELECT * FROM arrival_cases WHERE tenant_id = ? ORDER BY CASE WHEN id = 'SYN-CASE-001' THEN 0 ELSE 1 END, created_at, id LIMIT 1").get(session.tenantId);
      const latestRun = db.prepare("SELECT * FROM assistant_runs WHERE tenant_id = ? AND case_id = ? ORDER BY created_at DESC LIMIT 1").get(session.tenantId, arrivalCase.id);
      sendJson(response, 200, {
        tenant, user: { id: user.id, displayName: user.display_name, role: user.role }, case: serializeCase(arrivalCase), latestRun: serializeRun(latestRun),
        provider: providerMode === "local" ? { mode: "local", label: "Lokaler strukturierter Fallback" } : { mode: "external", label: "Externer Provider · Gate offen" },
        auditEvents: auditEvents(db, session.tenantId), boundaries: { syntheticOnly: true, registration: false, messaging: "sink_only", booking: "sink_only" },
      }); return;
    }

    if (request.method === "GET" && url.pathname === "/api/v1/audit") {
      sendJson(response, 200, { events: auditEvents(db, session.tenantId) }); return;
    }

    if (request.method === "POST" && url.pathname === "/api/v1/assistant/runs") {
      const body = await readBody(request);
      const caseId = String(body.caseId || "");
      const objective = String(body.objective || "").trim();
      if (!objective || objective.length > 1_500) { sendJson(response, 400, { error: "Arbeitsziel fehlt oder ist zu lang." }); return; }
      const arrivalCase = caseForTenant(db, caseId, session.tenantId);
      if (!arrivalCase) { sendJson(response, 404, { error: "Fall im aktiven Mandanten nicht gefunden." }); return; }
      if (providerMode !== "local") { sendJson(response, 503, { error: "Externer KI-Provider ist bis zur separaten Founder-, Datenschutz- und Kostenfreigabe deaktiviert." }); return; }
      const id = `RUN-${randomUUID()}`;
      const output = generateStructuredFallback(arrivalCase, objective);
      db.prepare("INSERT INTO assistant_runs (id,tenant_id,case_id,provider,model,objective,output_json,created_by,created_at) VALUES (?,?,?,?,?,?,?,?,?)")
        .run(id, session.tenantId, caseId, "local-structured-fallback", "acc-rules-v1", objective, JSON.stringify(output), session.userId, now());
      audit(db, session, "assistant.created", "assistant_run", id, { caseId, provider: "local-structured-fallback" });
      sendJson(response, 201, { run: serializeRun(runForTenant(db, id, session.tenantId)) }); return;
    }

    const reviewMatch = url.pathname.match(/^\/api\/v1\/assistant\/runs\/([^/]+)\/review$/);
    if (request.method === "POST" && reviewMatch) {
      const id = decodeURIComponent(reviewMatch[1]);
      const run = runForTenant(db, id, session.tenantId);
      if (!run) { sendJson(response, 404, { error: "Assistenzlauf im aktiven Mandanten nicht gefunden." }); return; }
      const body = await readBody(request);
      const decision = String(body.decision || "");
      const note = String(body.note || "").trim();
      if (!['approved', 'rejected'].includes(decision) || !note || note.length > 1_000) { sendJson(response, 400, { error: "Prüfentscheidung und kurze Prüfnotiz sind erforderlich." }); return; }
      if (run.review_decision) { sendJson(response, 409, { error: "Assistenzlauf wurde bereits geprüft.", code: "review_already_completed" }); return; }
      const updated = db.prepare("UPDATE assistant_runs SET review_decision=?,review_note=?,reviewed_by=?,reviewed_at=? WHERE id=? AND tenant_id=? AND review_decision IS NULL")
        .run(decision, note, session.userId, now(), id, session.tenantId);
      if (updated.changes !== 1) { sendJson(response, 409, { error: "Assistenzlauf wurde parallel geprüft.", code: "review_already_completed" }); return; }
      audit(db, session, `assistant.${decision}`, "assistant_run", id, { note });
      sendJson(response, 200, { run: serializeRun(runForTenant(db, id, session.tenantId)) }); return;
    }

    if (request.method === "POST" && (url.pathname === "/api/v1/outbox/preview" || url.pathname === "/api/v1/bookings/preview")) {
      const body = await readBody(request);
      const caseId = String(body.caseId || "");
      const runId = String(body.runId || "");
      const arrivalCase = caseForTenant(db, caseId, session.tenantId);
      const run = runForTenant(db, runId, session.tenantId);
      if (!arrivalCase || !run || run.case_id !== caseId) { sendJson(response, 404, { error: "Fall oder Lauf im aktiven Mandanten nicht gefunden." }); return; }
      if (run.review_decision !== "approved") { sendJson(response, 409, { error: "Eine positive menschliche Prüfung ist vor jeder Vorschau erforderlich." }); return; }
      const isMessage = url.pathname.includes("outbox");
      const id = `${isMessage ? "MSG" : "BOOK"}-${randomUUID()}`;
      const table = isMessage ? "outbox_previews" : "booking_previews";
      const payload = isMessage
        ? { channel: "demo_sink", subject: `Synthetische Klärung ${caseId}`, dispatched: false }
        : { resource: "synthetic_housing_option", reservation: false, dispatched: false };
      db.prepare(`INSERT INTO ${table} (id,tenant_id,case_id,run_id,status,payload_json,created_by,created_at) VALUES (?,?,?,?,?,?,?,?)`)
        .run(id, session.tenantId, caseId, runId, "sink_only", JSON.stringify(payload), session.userId, now());
      audit(db, session, isMessage ? "outbox.previewed" : "booking.previewed", isMessage ? "outbox_preview" : "booking_preview", id, { caseId, dispatched: false });
      sendJson(response, 201, { id, status: "sink_only", label: isMessage ? "Nachrichtenvorschau" : "Buchungsvorschau", externalEffect: false }); return;
    }

    sendJson(response, 404, { error: "API-Pfad nicht gefunden." });
  };
}

async function serveStatic(response, url) {
  const requested = url.pathname === "/" ? "/index.html" : decodeURIComponent(url.pathname);
  const filePath = resolve(projectRoot, `.${requested}`);
  if (!(filePath === projectRoot || filePath.startsWith(`${projectRoot}${sep}`)) || !existsSync(filePath)) {
    sendJson(response, 404, { error: "Datei nicht gefunden." }); return;
  }
  try {
    const content = await readFile(filePath);
    response.writeHead(200, { "content-type": contentTypes[extname(filePath)] || "application/octet-stream", "cache-control": "no-store" });
    response.end(content);
  } catch { sendJson(response, 404, { error: "Datei nicht gefunden." }); }
}

export function createApplication(options = {}) {
  const databasePath = options.databasePath || process.env.ACC_DB_PATH || defaultDatabasePath;
  const providerMode = options.providerMode || process.env.ACC_AI_PROVIDER || "local";
  const db = initializeDatabase(databasePath);
  const providers = createProviderRegistry({ external: options.externalAI || { enabled: false }, fetchImpl: options.fetchImpl });
  const kernel = createIntelligenceKernel({ db, providers, loadCaseDetail: loadOperationalCaseDetail, audit });
  const verticalKernel = createVerticalCapabilityKernel({ db, loadCaseDetail: loadOperationalCaseDetail, audit });
  const handleApi = createApiHandler(db, providerMode);
  const failureInjector = typeof options.failureInjector === "function" ? options.failureInjector : null;
  const handleGate15 = createGate15Handler({ db, sendJson, readBody, requireSession, audit, providers, failureInjector });
  const handleKernel = createIntelligenceKernelHandler({ kernel, sendJson, readBody, requireSession });
  const handleKernelV2 = createVerticalCapabilityHandler({ kernel: verticalKernel, sendJson, readBody, requireSession });
  const handleOperationsTwin = createOperationsTwinHandler({ db, sendJson, readBody, requireSession, audit, loadCaseDetail: loadOperationalCaseDetail });
  const handleOperationalLearning = createOperationalLearningHandler({ db, sendJson, readBody, requireSession, audit });
  const handleCollaboration = createCollaborationHandler({ db, sendJson, readBody, requireSession, audit });
  const handleProgramDelivery = createProgramDeliveryHandler({ db, sendJson, readBody, requireSession, audit });
  const handleExecutionLoop = createExecutionLoopHandler({ db, sendJson, readBody, requireSession, audit });
  const handleArrivalReliability = createArrivalReliabilityHandler({ db, sendJson, readBody, requireSession, audit });
  const kernelV3 = createIntelligenceKernelV3({ db, audit });
  const handleKernelV3 = createIntelligenceKernelV3Handler({ kernel: kernelV3, sendJson, readBody, requireSession });
  const server = createServer(async (request, response) => {
    response.setHeader("x-content-type-options", "nosniff");
    response.setHeader("referrer-policy", "no-referrer");
    try {
      const url = new URL(request.url || "/", "http://127.0.0.1");
      const session = sessionFor(request);
      if (url.pathname.startsWith("/api/") && failureInjector) await failureInjector({ phase: "before_route", method: request.method, path: url.pathname, session, db });
      if (url.pathname.startsWith("/api/") && session) {
        const authorization = authorizeRequest({ db, session, method: request.method || "GET", path: url.pathname });
        if (!authorization.allowed) {
          sendJson(response, authorization.status || 403, { error: authorization.error, code: authorization.code || "role_scope_denied" });
          return;
        }
      }
      if (url.pathname.startsWith("/api/") && session) {
        const idempotency = await prepareIdempotency({ request, response, url, db, session });
        if (idempotency.handled) return;
      }
      if (url.pathname.startsWith("/api/reliability/v1/")) await handleArrivalReliability(request, response, url);
      else if (url.pathname.startsWith("/api/execution/v1/")) await handleExecutionLoop(request, response, url);
      else if (url.pathname.startsWith("/api/kernel/v3/")) await handleKernelV3(request, response, url);
      else if (url.pathname.startsWith("/api/programs/v1/")) await handleProgramDelivery(request, response, url);
      else if (url.pathname.startsWith("/api/collaboration/v1/")) await handleCollaboration(request, response, url);
      else if (url.pathname.startsWith("/api/learning/v1/")) await handleOperationalLearning(request, response, url);
      else if (url.pathname.startsWith("/api/twin/v1/")) await handleOperationsTwin(request, response, url);
      else if (url.pathname.startsWith("/api/kernel/v2/")) await handleKernelV2(request, response, url);
      else if (url.pathname.startsWith("/api/kernel/v1/")) await handleKernel(request, response, url);
      else if (url.pathname.startsWith("/api/v1.5/")) await handleGate15(request, response, url);
      else if (url.pathname.startsWith("/api/")) await handleApi(request, response, url);
      else if (request.method === "GET" || request.method === "HEAD") await serveStatic(response, url);
      else sendJson(response, 405, { error: "Methode nicht erlaubt." });
    } catch (error) {
      const status = Number(error?.status) || 500;
      sendJson(response, status, { error: error instanceof Error ? error.message : "Interner Fehler.", ...(error?.code ? { code: error.code } : {}) });
    }
  });
  server.on("close", () => db.close());
  return { server, db, databasePath, providerMode, providers, kernel, verticalKernel, kernelV3 };
}

if (process.argv[1] && import.meta.url === pathToFileURL(process.argv[1]).href) {
  const port = Number(process.env.PORT || 4220);
  const host = process.env.HOST || "127.0.0.1";
  const { server, databasePath, providerMode } = createApplication();
  server.listen(port, host, () => {
    console.log(`AMAVIO ACC Release Q True Workspaces: http://${host}:${port}`);
    console.log(`Database: ${databasePath}`);
    console.log(`AI provider mode: ${providerMode}`);
    console.log("Boundary: synthetic role sessions only; external provider adapters are gate-closed; no productive identity, registration, message dispatch, booking or external effect.");
  });
}
