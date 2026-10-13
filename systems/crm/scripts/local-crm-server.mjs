import { createServer } from "node:http";
import { chmod, mkdir, readFile, readdir, writeFile } from "node:fs/promises";
import { chmodSync, existsSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { createHash } from "node:crypto";
import { DatabaseSync } from "node:sqlite";
import { createSeedState } from "../src/data/seed.js";
import { isSyntheticState, SCHEMA_VERSION } from "../src/domain/crmDomain.js";
import { migrateToR38 } from "../src/domain/migrations.js";
import { RealDataStagingStore } from "./real-data-staging-store.mjs";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const distRoot = path.join(root, "dist");
const dataRoot = path.resolve(process.env.AMAVIO_CRM_DATA_DIR || path.join(root, "local-data"));
const exportRoot = path.join(dataRoot, "exports");
const host = "127.0.0.1";
const port = Number(process.env.AMAVIO_CRM_PORT || 4401);
const maxBodyBytes = 8 * 1024 * 1024;
const localOrigin = `http://${host}:${port}`;
const securityHeaders = Object.freeze({
  "Content-Security-Policy": "default-src 'self'; base-uri 'self'; connect-src 'self'; font-src 'self' data:; form-action 'self'; frame-ancestors 'none'; img-src 'self' data:; object-src 'none'; script-src 'self'; style-src 'self'; style-src-attr 'unsafe-inline'",
  "Cross-Origin-Opener-Policy": "same-origin",
  "Cross-Origin-Resource-Policy": "same-origin",
  "Permissions-Policy": "camera=(), geolocation=(), microphone=()",
  "Referrer-Policy": "no-referrer",
  "X-Content-Type-Options": "nosniff",
  "X-Frame-Options": "DENY",
});

await mkdir(exportRoot, { recursive: true });
await chmod(dataRoot, 0o700);
await chmod(exportRoot, 0o700);
for (const file of await readdir(exportRoot)) {
  const exportPath = path.join(exportRoot, file);
  if (existsSync(exportPath)) await chmod(exportPath, 0o600);
}
const databasePath = path.join(dataRoot, "amavio-one-crm-r3-8-g1-assurance.sqlite");
const database = new DatabaseSync(databasePath);
const realDataStaging = new RealDataStagingStore(root);
database.exec("PRAGMA journal_mode = WAL; PRAGMA foreign_keys = ON;");
database.exec(`
  CREATE TABLE IF NOT EXISTS schema_migrations (
    version INTEGER PRIMARY KEY,
    applied_at TEXT NOT NULL
  );
  CREATE TABLE IF NOT EXISTS crm_state (
    id INTEGER PRIMARY KEY CHECK (id = 1),
    schema_version INTEGER NOT NULL,
    payload TEXT NOT NULL,
    updated_at TEXT NOT NULL
  );
  CREATE TABLE IF NOT EXISTS state_snapshots (
    id TEXT PRIMARY KEY,
    label TEXT NOT NULL,
    schema_version INTEGER NOT NULL,
    payload TEXT NOT NULL,
    created_at TEXT NOT NULL
  );
`);
database.prepare("INSERT OR IGNORE INTO schema_migrations(version, applied_at) VALUES (?, ?)").run(SCHEMA_VERSION, new Date().toISOString());
hardenStorePermissions();

const existing = database.prepare("SELECT payload FROM crm_state WHERE id = 1").get();
if (!existing) persistState(createSeedState());
else persistState(migrateToR38(JSON.parse(existing.payload)));

function persistState(state) {
  if (!isSyntheticState(state)) throw new Error("Nur der synthetische v7-Datenvertrag darf lokal gespeichert werden.");
  database.prepare(`
    INSERT INTO crm_state(id, schema_version, payload, updated_at) VALUES (1, ?, ?, ?)
    ON CONFLICT(id) DO UPDATE SET schema_version = excluded.schema_version, payload = excluded.payload, updated_at = excluded.updated_at
  `).run(SCHEMA_VERSION, JSON.stringify(state), new Date().toISOString());
  hardenStorePermissions();
}

function currentState() {
  const row = database.prepare("SELECT payload FROM crm_state WHERE id = 1").get();
  return JSON.parse(row.payload);
}

function createSnapshot(label, state = currentState()) {
  const createdAt = new Date().toISOString();
  const id = `backup-${Date.now().toString(36)}`;
  database.prepare("INSERT INTO state_snapshots(id, label, schema_version, payload, created_at) VALUES (?, ?, ?, ?, ?)")
    .run(id, String(label || "Lokale Sicherung").slice(0, 160), SCHEMA_VERSION, JSON.stringify(state), createdAt);
  hardenStorePermissions();
  return { id, label, schemaVersion: SCHEMA_VERSION, createdAt };
}

function hardenStorePermissions() {
  for (const filePath of [databasePath, `${databasePath}-wal`, `${databasePath}-shm`]) {
    if (existsSync(filePath)) chmodSync(filePath, 0o600);
  }
}

function stateSummary(state) {
  const keys = ["organizations", "contacts", "leads", "opportunities", "tasks", "activities", "researchItems", "outreachDrafts", "suppressionEntries"];
  return Object.fromEntries(keys.map((key) => [key, state[key]?.length || 0]));
}

function runIsolatedRestoreDrill() {
  const sourceState = currentState();
  if (!isSyntheticState(sourceState)) throw new Error("Restore-Probe abgebrochen: Der Ausgangszustand ist nicht synthetisch.");
  const sourcePayload = JSON.stringify(sourceState);
  const checksum = (value) => createHash("sha256").update(value).digest("hex");
  const sourceChecksum = checksum(sourcePayload);
  const isolated = new DatabaseSync(":memory:");
  try {
    isolated.exec(`
      CREATE TABLE restore_probe (
        id INTEGER PRIMARY KEY CHECK (id = 1),
        schema_version INTEGER NOT NULL,
        payload TEXT NOT NULL
      );
    `);
    isolated.prepare("INSERT INTO restore_probe(id, schema_version, payload) VALUES (1, ?, ?)").run(SCHEMA_VERSION, sourcePayload);
    const restored = isolated.prepare("SELECT schema_version AS schemaVersion, payload FROM restore_probe WHERE id = 1").get();
    const restoredState = JSON.parse(restored.payload);
    const restoredChecksum = checksum(restored.payload);
    if (restored.schemaVersion !== SCHEMA_VERSION) throw new Error("Restore-Probe fehlgeschlagen: Schema stimmt nicht überein.");
    if (!isSyntheticState(restoredState)) throw new Error("Restore-Probe fehlgeschlagen: Wiederhergestellter Zustand verletzt den synthetischen Vertrag.");
    if (restoredChecksum !== sourceChecksum) throw new Error("Restore-Probe fehlgeschlagen: Prüfsumme stimmt nicht überein.");
    return {
      status: "passed",
      syntheticOnly: true,
      liveStateMutated: false,
      schemaVersion: restored.schemaVersion,
      checksumPrefix: sourceChecksum.slice(0, 12),
      checkedAt: new Date().toISOString(),
      recordCount: Object.values(restoredState).reduce((sum, value) => sum + (Array.isArray(value) ? value.length : 0), 0),
    };
  } finally {
    isolated.close();
  }
}

function json(response, status, payload) {
  response.writeHead(status, { ...securityHeaders, "Content-Type": "application/json; charset=utf-8", "Cache-Control": "no-store" });
  response.end(`${JSON.stringify(payload)}\n`);
}

function mutationOriginAllowed(request) {
  if (!["POST", "PUT", "PATCH", "DELETE"].includes(request.method || "")) return true;
  if (request.headers["sec-fetch-site"] === "cross-site") return false;
  const origin = request.headers.origin;
  if (!origin) return true;
  return origin === localOrigin;
}

async function parseBody(request) {
  let size = 0;
  const chunks = [];
  for await (const chunk of request) {
    size += chunk.length;
    if (size > maxBodyBytes) throw new Error("Import ist größer als 8 MB.");
    chunks.push(chunk);
  }
  if (!chunks.length) return {};
  return JSON.parse(Buffer.concat(chunks).toString("utf8"));
}

async function handleApi(request, response, url) {
  if (request.method === "GET" && url.pathname === "/api/health") {
    return json(response, 200, { ok: true, mode: "local-sqlite", schemaVersion: SCHEMA_VERSION, syntheticOnly: false, syntheticCoreOnly: false, importedRecordsMode: "local-read-only", importedRecordsEnabled: realDataStaging.available, realDataStagingMode: "isolated-local-read-only", realDataStagingEnabled: realDataStaging.available, outboundEnabled: false, cloudSyncEnabled: false, supabaseEnabled: false, localHardeningVersion: "1.1", firewallStatus: "observed_blocker", c1DecisionStatus: "partial_decision_recorded", c1GatePackageStatus: "prepared_for_external_review_and_explicit_decision", c1ImplementationAuthorized: false });
  }
  if (request.method === "GET" && url.pathname === "/api/crm/imported/organizations") return json(response, 200, realDataStaging.organizations(url));
  if (request.method === "GET" && url.pathname === "/api/crm/imported/contacts") return json(response, 200, realDataStaging.contacts(url));
  const importedDetailMatch = url.pathname.match(/^\/api\/crm\/imported\/detail\/(organization|contact)\/([^/]+)$/);
  if (request.method === "GET" && importedDetailMatch) {
    const internalType = importedDetailMatch[1] === "organization" ? "pool-organization" : "pool-contact";
    const detail = realDataStaging.detail(internalType, importedDetailMatch[2]);
    return detail ? json(response, 200, detail) : json(response, 404, { error: "CRM-Eintrag wurde nicht gefunden." });
  }
  if (request.method === "GET" && url.pathname === "/api/staging/summary") return json(response, 200, realDataStaging.summary());
  if (request.method === "GET" && url.pathname === "/api/staging/organizations") return json(response, 200, realDataStaging.organizations(url));
  if (request.method === "GET" && url.pathname === "/api/staging/contacts") return json(response, 200, realDataStaging.contacts(url));
  if (request.method === "GET" && url.pathname === "/api/staging/review-queue") return json(response, 200, realDataStaging.reviewQueue(url));
  if (request.method === "GET" && url.pathname === "/api/staging/quarantine") return json(response, 200, realDataStaging.quarantine(url));
  if (request.method === "GET" && url.pathname === "/api/staging/sources") return json(response, 200, realDataStaging.sources());
  const stagingDetailMatch = url.pathname.match(/^\/api\/staging\/detail\/([^/]+)\/([^/]+)$/);
  if (request.method === "GET" && stagingDetailMatch) {
    const detail = realDataStaging.detail(decodeURIComponent(stagingDetailMatch[1]), stagingDetailMatch[2]);
    return detail ? json(response, 200, detail) : json(response, 404, { error: "Staging-Datensatz wurde nicht gefunden." });
  }
  if (request.method === "GET" && url.pathname === "/api/state") return json(response, 200, { state: currentState(), persistence: "sqlite", databasePath: "local-data/amavio-one-crm-r3-8-g1-assurance.sqlite" });
  if (request.method === "PUT" && url.pathname === "/api/state") {
    const { state } = await parseBody(request);
    persistState(state);
    return json(response, 200, { ok: true, updatedAt: new Date().toISOString() });
  }
  if (request.method === "GET" && url.pathname === "/api/backups") {
    const backups = database.prepare("SELECT id, label, schema_version AS schemaVersion, created_at AS createdAt FROM state_snapshots ORDER BY created_at DESC LIMIT 50").all();
    return json(response, 200, { backups });
  }
  if (request.method === "POST" && url.pathname === "/api/assurance/restore-drill") {
    return json(response, 200, runIsolatedRestoreDrill());
  }
  if (request.method === "POST" && url.pathname === "/api/backups") {
    const body = await parseBody(request);
    const backup = createSnapshot(body.label);
    const filename = `${backup.id}.synthetic.json`;
    await writeFile(path.join(exportRoot, filename), `${JSON.stringify(currentState(), null, 2)}\n`, { encoding: "utf8", flag: "wx", mode: 0o600 });
    return json(response, 201, { backup, localExport: `local-data/exports/${filename}`, exportFilename: filename });
  }
  const restoreMatch = url.pathname.match(/^\/api\/backups\/([^/]+)\/restore$/);
  if (request.method === "POST" && restoreMatch) {
    const row = database.prepare("SELECT payload FROM state_snapshots WHERE id = ?").get(decodeURIComponent(restoreMatch[1]));
    if (!row) return json(response, 404, { error: "Sicherung wurde nicht gefunden." });
    createSnapshot("Automatische Sicherung vor Wiederherstellung");
    const state = JSON.parse(row.payload);
    persistState(state);
    return json(response, 200, { state, restored: true });
  }
  if (request.method === "POST" && url.pathname === "/api/import/preview") {
    const body = await parseBody(request);
    const migrated = migrateToR38(body.state);
    if (!isSyntheticState(migrated)) throw new Error("Import abgewiesen: Nur freigegebene synthetische v7-Zustände sind zulässig.");
    return json(response, 200, { valid: true, syntheticOnly: true, schemaVersion: migrated.meta.schemaVersion, summary: stateSummary(migrated), state: migrated });
  }
  if (request.method === "POST" && url.pathname === "/api/import/apply") {
    const body = await parseBody(request);
    const migrated = migrateToR38(body.state);
    if (!isSyntheticState(migrated)) throw new Error("Import abgewiesen: Nicht-synthetische Daten sind nicht freigegeben.");
    createSnapshot("Automatische Sicherung vor synthetischem Import");
    persistState(migrated);
    return json(response, 200, { state: migrated, imported: true });
  }
  if (request.method === "POST" && url.pathname === "/api/reset") {
    createSnapshot("Automatische Sicherung vor Demo-Reset");
    const state = createSeedState();
    persistState(state);
    return json(response, 200, { state, reset: true });
  }
  return json(response, 404, { error: "Lokaler API-Pfad wurde nicht gefunden." });
}

const mimeTypes = { ".html": "text/html; charset=utf-8", ".js": "text/javascript; charset=utf-8", ".css": "text/css; charset=utf-8", ".svg": "image/svg+xml", ".png": "image/png", ".json": "application/json; charset=utf-8" };

async function serveStatic(response, pathname) {
  if (!existsSync(distRoot)) return json(response, 503, { error: "Build fehlt. Zuerst npm run build ausführen." });
  const requested = pathname === "/" ? "index.html" : pathname.replace(/^\/+/, "");
  const resolved = path.resolve(distRoot, requested);
  const safePath = resolved.startsWith(`${distRoot}${path.sep}`) || resolved === path.join(distRoot, "index.html") ? resolved : path.join(distRoot, "index.html");
  let filePath = safePath;
  if (!existsSync(filePath)) filePath = path.join(distRoot, "index.html");
  const content = await readFile(filePath);
  response.writeHead(200, { ...securityHeaders, "Content-Type": mimeTypes[path.extname(filePath)] || "application/octet-stream", "Cache-Control": filePath.endsWith("index.html") ? "no-store" : "public, max-age=3600" });
  response.end(content);
}

const server = createServer(async (request, response) => {
  const url = new URL(request.url || "/", `http://${host}:${port}`);
  try {
    if (!mutationOriginAllowed(request)) return json(response, 403, { error: "Ändernde Anfrage wegen abweichender Herkunft abgewiesen." });
    if (url.pathname.startsWith("/api/")) await handleApi(request, response, url);
    else if (["GET", "HEAD"].includes(request.method || "")) await serveStatic(response, url.pathname);
    else json(response, 405, { error: "Methode nicht erlaubt." });
  } catch (error) {
    json(response, 400, { error: error.message || "Lokaler Serverfehler." });
  }
});

server.listen(port, host, () => {
  console.log(`AMAVIO One CRM R3.17 Einheitliche globale Suche: http://${host}:${port}`);
  console.log(`SQLite: ${databasePath}`);
  console.log(`Importierte Organisationen und Kontakte: ${realDataStaging.available ? "lokal eingebunden" : "nicht geladen"}; Versand, Cloud und externe Anbindungen sind deaktiviert.`);
});

for (const signal of ["SIGINT", "SIGTERM"]) {
  process.on(signal, () => {
    server.close(() => {
      realDataStaging.close();
      database.close();
      process.exit(0);
    });
  });
}
