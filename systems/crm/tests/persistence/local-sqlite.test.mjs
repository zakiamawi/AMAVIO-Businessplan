import test from "node:test";
import assert from "node:assert/strict";
import { spawn } from "node:child_process";
import { mkdtemp, readFile, stat } from "node:fs/promises";
import { tmpdir } from "node:os";
import path from "node:path";
import { fileURLToPath } from "node:url";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "../..");

test("lokale SQLite-API persistiert, sichert, exportiert und setzt synthetisch zurück", async (t) => {
  const dataDir = await mkdtemp(path.join(tmpdir(), "amavio-crm-r33-"));
  const port = 4391 + Math.floor(Math.random() * 80);
  const child = spawn(process.execPath, [path.join(root, "scripts/local-crm-server.mjs")], {
    cwd: root,
    env: { ...process.env, AMAVIO_CRM_DATA_DIR: dataDir, AMAVIO_CRM_PORT: String(port) },
    stdio: ["ignore", "pipe", "pipe"],
  });
  let output = "";
  child.stdout.on("data", (chunk) => { output += chunk; });
  child.stderr.on("data", (chunk) => { output += chunk; });
  t.after(() => child.kill("SIGTERM"));
  const base = `http://127.0.0.1:${port}`;
  await waitForServer(base, child, () => output);

  const healthResponse = await fetch(`${base}/api/health`);
  assert.equal(healthResponse.headers.get("content-security-policy")?.includes("frame-ancestors 'none'"), true);
  assert.equal(healthResponse.headers.get("content-security-policy")?.includes("style-src-attr 'unsafe-inline'"), true);
  assert.equal(healthResponse.headers.get("x-frame-options"), "DENY");
  assert.equal(healthResponse.headers.get("referrer-policy"), "no-referrer");
  assert.equal(healthResponse.headers.get("permissions-policy"), "camera=(), geolocation=(), microphone=()");
  const health = await healthResponse.json();
  assert.deepEqual(
    { mode: health.mode, syntheticOnly: health.syntheticOnly, importedRecordsMode: health.importedRecordsMode, outboundEnabled: health.outboundEnabled },
    { mode: "local-sqlite", syntheticOnly: false, importedRecordsMode: "local-read-only", outboundEnabled: false },
  );
  assert.equal(health.localHardeningVersion, "1.1");
  assert.equal(health.firewallStatus, "observed_blocker");
  assert.equal(health.c1DecisionStatus, "partial_decision_recorded");
  assert.equal(health.c1ImplementationAuthorized, false);
  assert.equal(health.c1GatePackageStatus, "prepared_for_external_review_and_explicit_decision");
  const initial = await fetch(`${base}/api/state`).then((response) => response.json());
  assert.equal(initial.state.meta.schemaVersion, 7);
  initial.state.meta.testMarker = "persisted";
  const saved = await fetch(`${base}/api/state`, { method: "PUT", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ state: initial.state }) });
  assert.equal(saved.ok, true);
  assert.equal((await fetch(`${base}/api/state`).then((response) => response.json())).state.meta.testMarker, "persisted");

  const blockedCrossSite = await fetch(`${base}/api/state`, { method: "PUT", headers: { "Content-Type": "application/json", Origin: "https://example.invalid", "Sec-Fetch-Site": "cross-site" }, body: JSON.stringify({ state: initial.state }) });
  assert.equal(blockedCrossSite.status, 403);

  const restoreDrill = await fetch(`${base}/api/assurance/restore-drill`, { method: "POST" }).then((response) => response.json());
  assert.equal(restoreDrill.status, "passed");
  assert.equal(restoreDrill.syntheticOnly, true);
  assert.equal(restoreDrill.liveStateMutated, false);
  assert.equal(restoreDrill.schemaVersion, 7);
  assert.match(restoreDrill.checksumPrefix, /^[a-f0-9]{12}$/);
  assert.ok(restoreDrill.recordCount > 0);
  assert.equal((await fetch(`${base}/api/state`).then((response) => response.json())).state.meta.testMarker, "persisted");

  const backupResponse = await fetch(`${base}/api/backups`, { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ label: "Persistenztest" }) });
  assert.equal(backupResponse.status, 201);
  const backup = await backupResponse.json();
  assert.ok(backup.backup.id);
  const exported = JSON.parse(await readFile(path.join(dataDir, "exports", backup.exportFilename), "utf8"));
  assert.equal(exported.meta.testMarker, "persisted");
  assert.equal((await stat(dataDir)).mode & 0o777, 0o700);
  assert.equal((await stat(path.join(dataDir, "amavio-one-crm-r3-8-g1-assurance.sqlite"))).mode & 0o777, 0o600);
  assert.equal((await stat(path.join(dataDir, "exports", backup.exportFilename))).mode & 0o777, 0o600);

  const reset = await fetch(`${base}/api/reset`, { method: "POST" }).then((response) => response.json());
  assert.equal(reset.state.meta.testMarker, undefined);
  const restored = await fetch(`${base}/api/backups/${backup.backup.id}/restore`, { method: "POST" }).then((response) => response.json());
  assert.equal(restored.state.meta.testMarker, "persisted");

  const rejected = await fetch(`${base}/api/import/preview`, { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ state: { meta: { synthetic: false } } }) });
  assert.equal(rejected.ok, false);
});

async function waitForServer(base, child, readOutput) {
  for (let attempt = 0; attempt < 80; attempt += 1) {
    if (child.exitCode !== null) throw new Error(`Lokaler Server beendet:\n${readOutput()}`);
    try { if ((await fetch(`${base}/api/health`)).ok) return; } catch { /* startet */ }
    await new Promise((resolve) => setTimeout(resolve, 100));
  }
  throw new Error(`Lokaler Server nicht erreichbar:\n${readOutput()}`);
}
