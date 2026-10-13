import assert from "node:assert/strict";
import test from "node:test";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { RealDataStagingStore } from "../../scripts/real-data-staging-store.mjs";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "../..");

function withStore(callback) {
  const store = new RealDataStagingStore(root);
  try {
    assert.equal(store.available, true, "Die getrennte lokale Staging-Datenbank muss vorhanden sein.");
    return callback(store);
  } finally {
    store.close();
  }
}

test("Staging-Vertrag hält Umfang, Trennung und Außenwirkung geschlossen", () => withStore((store) => {
  const summary = store.summary();

  assert.equal(summary.mode, "real_data_staging");
  assert.deepEqual(summary.safety, {
    outboundEnabled: false,
    cloudSyncEnabled: false,
    supabaseEnabled: false,
    appIntegrationEnabled: false,
    accIntegrationEnabled: false,
  });
  assert.deepEqual(summary.counts, {
    poolOrganizations: 2242,
    poolContacts: 3213,
    verifiedOrganizations: 192,
    verifiedContacts: 166,
    verifiedRelationships: 238,
    reviewQueue: 407,
    quarantineItems: 93,
    duplicateSignals: 6,
    suppressionEntries: 3379,
    legacySuppressions: 60,
    sources: 7,
  });
}));

test("jeder reale Kontakt bleibt technisch für Outreach gesperrt", () => withStore((store) => {
  const pool = store.database.prepare("SELECT COUNT(*) AS total, SUM(CASE WHEN do_not_contact=1 AND outreach_approved=0 THEN 1 ELSE 0 END) AS blocked FROM pool_contacts").get();
  const verified = store.database.prepare("SELECT COUNT(*) AS total, SUM(CASE WHEN do_not_contact=1 AND outreach_approved=0 THEN 1 ELSE 0 END) AS blocked FROM contacts").get();

  assert.equal(Number(pool.total), 3213);
  assert.equal(Number(pool.blocked), 3213);
  assert.equal(Number(verified.total), 166);
  assert.equal(Number(verified.blocked), 166);
}));

test("bestätigter Bestand bewahrt Mehrfachbeziehungen und Namensprüfungen", () => withStore((store) => {
  const nameReview = store.contacts(new URL("http://localhost/api/staging/contacts?dataset=verified&quality=name_review&pageSize=100"));
  const relationshipGroups = store.database.prepare("SELECT COUNT(*) AS count FROM (SELECT contact_id FROM contact_organization_relationships GROUP BY contact_id HAVING COUNT(*) > 1)").get();
  const relationshipRows = store.database.prepare("SELECT COUNT(*) AS count FROM contact_organization_relationships WHERE contact_id IN (SELECT contact_id FROM contact_organization_relationships GROUP BY contact_id HAVING COUNT(*) > 1)").get();

  assert.equal(nameReview.total, 48);
  assert.equal(Number(relationshipGroups.count), 31);
  assert.equal(Number(relationshipRows.count), 103);
}));

test("Prüfqueue, Quarantäne und Dublettensignale bleiben getrennt nachvollziehbar", () => withStore((store) => {
  const review = store.reviewQueue(new URL("http://localhost/api/staging/review-queue?pageSize=100"));
  const current = store.reviewQueue(new URL("http://localhost/api/staging/review-queue?status=confirmed_current&pageSize=100"));
  const quarantine = store.quarantine(new URL("http://localhost/api/staging/quarantine?pageSize=100"));
  const sources = store.sources();

  assert.equal(review.total, 407);
  assert.equal(current.total, 238);
  assert.equal(quarantine.total, 93);
  assert.equal(sources.duplicateSignals.length, 6);
  assert.equal(sources.sources.length, 7);
}));

test("wiederholter Import ist als Update ohne neue Datensätze protokolliert", () => withStore((store) => {
  const summary = store.summary();
  const batchCount = store.database.prepare("SELECT COUNT(*) AS count FROM import_batches").get();

  assert.equal(Number(batchCount.count), 1);
  assert.equal(summary.latestBatch.status, "completed");
  assert.equal(Number(summary.latestBatch.importedCount), 0);
  assert.ok(Number(summary.latestBatch.updatedCount) > 0);
  assert.equal(Number(summary.latestBatch.quarantinedCount), 93);
  assert.equal(Number(summary.latestBatch.outboundEnabled), 0);
  assert.equal(Number(summary.latestBatch.cloudSyncEnabled), 0);
}));
