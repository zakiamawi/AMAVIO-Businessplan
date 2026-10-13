import { existsSync } from "node:fs";
import path from "node:path";
import { DatabaseSync } from "node:sqlite";

const integer = (value, fallback, minimum, maximum) => {
  const parsed = Number.parseInt(value ?? "", 10);
  if (!Number.isFinite(parsed)) return fallback;
  return Math.min(maximum, Math.max(minimum, parsed));
};

const compact = (value) => String(value || "").trim();

function distribution(database, sql, parameters = []) {
  return database.prepare(sql).all(...parameters).map((row) => ({ label: row.label || "Ohne Angabe", count: Number(row.count || 0) }));
}

function pagination(url) {
  return {
    page: integer(url.searchParams.get("page"), 1, 1, 100000),
    pageSize: integer(url.searchParams.get("pageSize"), 40, 10, 100),
  };
}

function pageResult(database, { selectSql, countSql, where, parameters, orderBy, url }) {
  const { page, pageSize } = pagination(url);
  const offset = (page - 1) * pageSize;
  const total = Number(database.prepare(`${countSql} ${where}`).get(...parameters).count || 0);
  const rows = database.prepare(`${selectSql} ${where} ${orderBy} LIMIT ? OFFSET ?`).all(...parameters, pageSize, offset);
  return { rows, total, page, pageSize, pages: Math.max(1, Math.ceil(total / pageSize)) };
}

function addLike(clauses, parameters, value, columns) {
  const query = compact(value);
  if (!query) return;
  clauses.push(`(${columns.map((column) => `${column} LIKE ? COLLATE NOCASE`).join(" OR ")})`);
  columns.forEach(() => parameters.push(`%${query}%`));
}

function addExact(clauses, parameters, value, column) {
  const query = compact(value);
  if (!query || query === "all") return;
  clauses.push(`${column} = ?`);
  parameters.push(query);
}

export class RealDataStagingStore {
  constructor(root) {
    this.databasePath = path.join(root, "local-data", "real-data-staging", "amavio-real-data-staging-r3-15.sqlite");
    this.available = existsSync(this.databasePath);
    this.database = this.available ? new DatabaseSync(this.databasePath) : null;
  }

  close() {
    this.database?.close();
  }

  requireDatabase() {
    if (!this.database) throw new Error("Die lokale Echtdaten-Staging-Datenbank fehlt. Zuerst den kontrollierten Import ausführen.");
    return this.database;
  }

  summary() {
    const database = this.requireDatabase();
    const scalar = (table) => Number(database.prepare(`SELECT COUNT(*) AS count FROM ${table}`).get().count || 0);
    const meta = Object.fromEntries(database.prepare("SELECT key, value FROM staging_meta").all().map((row) => [row.key, row.value]));
    const latestBatch = database.prepare("SELECT id, mapping_version AS mappingVersion, status, completed_at AS completedAt, imported_count AS importedCount, updated_count AS updatedCount, quarantined_count AS quarantinedCount, outbound_enabled AS outboundEnabled, cloud_sync_enabled AS cloudSyncEnabled FROM import_batches ORDER BY completed_at DESC LIMIT 1").get();
    return {
      mode: meta.mode,
      maturity: meta.maturity,
      safety: {
        outboundEnabled: meta.outboundEnabled === "true",
        cloudSyncEnabled: meta.cloudSyncEnabled === "true",
        supabaseEnabled: meta.supabaseEnabled === "true",
        appIntegrationEnabled: meta.appIntegrationEnabled === "true",
        accIntegrationEnabled: meta.accIntegrationEnabled === "true",
      },
      counts: {
        poolOrganizations: scalar("pool_organizations"),
        poolContacts: scalar("pool_contacts"),
        verifiedOrganizations: scalar("organizations"),
        verifiedContacts: scalar("contacts"),
        verifiedRelationships: scalar("contact_organization_relationships"),
        reviewQueue: scalar("review_queue"),
        quarantineItems: scalar("quarantine_items"),
        duplicateSignals: scalar("duplicate_signals"),
        suppressionEntries: scalar("suppression_entries"),
        legacySuppressions: scalar("legacy_suppressions"),
        sources: scalar("source_register"),
      },
      segments: distribution(database, "SELECT segment AS label, COUNT(*) AS count FROM pool_organizations GROUP BY segment ORDER BY count DESC"),
      contactSegments: distribution(database, "SELECT segment AS label, COUNT(*) AS count FROM pool_contacts GROUP BY segment ORDER BY count DESC"),
      reviewBuckets: distribution(database, "SELECT bucket AS label, COUNT(*) AS count FROM review_queue GROUP BY bucket ORDER BY count DESC"),
      quality: distribution(database, "SELECT quality_status AS label, COUNT(*) AS count FROM pool_organizations GROUP BY quality_status ORDER BY count DESC"),
      contactability: distribution(database, "SELECT consent_status AS label, COUNT(*) AS count FROM pool_contacts GROUP BY consent_status ORDER BY count DESC"),
      latestBatch,
      mappingVersion: meta.mappingVersion,
      updatedAt: meta.updatedAt,
    };
  }

  organizations(url) {
    const database = this.requireDatabase();
    const verified = url.searchParams.get("dataset") === "verified";
    const clauses = ["1=1"];
    const parameters = [];
    if (verified) {
      addLike(clauses, parameters, url.searchParams.get("search"), ["o.display_name", "o.central_email", "o.central_phone", "a.city", "a.state", "o.source_reference"]);
      addExact(clauses, parameters, url.searchParams.get("segment"), "o.segment");
      addExact(clauses, parameters, url.searchParams.get("quality"), "o.quality_status");
      addLike(clauses, parameters, url.searchParams.get("region"), ["a.city", "a.state", "a.postal_code"]);
      addLike(clauses, parameters, url.searchParams.get("source"), ["o.source_reference"]);
      return pageResult(database, {
        selectSql: "SELECT o.*, a.street, a.postal_code AS postalCode, a.city, a.state, a.country, a.quality_status AS addressQuality FROM organizations o LEFT JOIN organization_addresses a ON a.organization_kind='verified' AND a.organization_id=o.id",
        countSql: "SELECT COUNT(*) AS count FROM organizations o LEFT JOIN organization_addresses a ON a.organization_kind='verified' AND a.organization_id=o.id",
        where: `WHERE ${clauses.join(" AND ")}`,
        parameters,
        orderBy: "ORDER BY o.display_name COLLATE NOCASE",
        url,
      });
    }
    addLike(clauses, parameters, url.searchParams.get("search"), ["o.name", "o.central_email", "o.central_phone", "a.city", "a.state", "o.source_reference"]);
    addExact(clauses, parameters, url.searchParams.get("segment"), "o.segment");
    addExact(clauses, parameters, url.searchParams.get("quality"), "o.quality_status");
    addLike(clauses, parameters, url.searchParams.get("region"), ["a.city", "a.state", "a.postal_code"]);
    addLike(clauses, parameters, url.searchParams.get("source"), ["o.source_reference"]);
    return pageResult(database, {
      selectSql: "SELECT o.*, a.street, a.postal_code AS postalCode, a.city, a.state, a.country, a.quality_status AS addressQuality FROM pool_organizations o LEFT JOIN organization_addresses a ON a.organization_kind='pool' AND a.organization_id=o.id",
      countSql: "SELECT COUNT(*) AS count FROM pool_organizations o LEFT JOIN organization_addresses a ON a.organization_kind='pool' AND a.organization_id=o.id",
      where: `WHERE ${clauses.join(" AND ")}`,
      parameters,
      orderBy: "ORDER BY o.name COLLATE NOCASE",
      url,
    });
  }

  contacts(url) {
    const database = this.requireDatabase();
    const verified = url.searchParams.get("dataset") === "verified";
    const clauses = ["1=1"];
    const parameters = [];
    if (verified) {
      addLike(clauses, parameters, url.searchParams.get("search"), ["c.source_full_name", "c.first_name", "c.last_name", "c.email", "c.phone", "c.role", "o.display_name"]);
      addExact(clauses, parameters, url.searchParams.get("segment"), "c.segment");
      addExact(clauses, parameters, url.searchParams.get("status"), "c.verification_status");
      if (url.searchParams.get("quality") === "name_review") clauses.push("c.name_review_required = 1");
      if (url.searchParams.get("quality") === "clean") clauses.push("c.name_review_required = 0");
      if (url.searchParams.get("suppression") === "blocked") clauses.push("c.do_not_contact = 1 AND c.outreach_approved = 0");
      return pageResult(database, {
        selectSql: "SELECT c.*, COUNT(r.id) AS relationshipCount, GROUP_CONCAT(o.display_name, ' · ') AS organizationNames FROM contacts c LEFT JOIN contact_organization_relationships r ON r.contact_id=c.id LEFT JOIN organizations o ON o.id=r.organization_id",
        countSql: "SELECT COUNT(DISTINCT c.id) AS count FROM contacts c LEFT JOIN contact_organization_relationships r ON r.contact_id=c.id LEFT JOIN organizations o ON o.id=r.organization_id",
        where: `WHERE ${clauses.join(" AND ")}`,
        parameters,
        orderBy: "GROUP BY c.id ORDER BY c.last_name COLLATE NOCASE, c.first_name COLLATE NOCASE",
        url,
      });
    }
    addLike(clauses, parameters, url.searchParams.get("search"), ["c.source_full_name", "c.first_name", "c.last_name", "c.email", "c.phone", "c.original_role", "c.organization_name", "c.source_reference"]);
    addExact(clauses, parameters, url.searchParams.get("segment"), "c.segment");
    addExact(clauses, parameters, url.searchParams.get("status"), "c.review_bucket");
    if (url.searchParams.get("quality") === "name_review") clauses.push("c.name_review_required = 1");
    if (url.searchParams.get("quality") === "clean") clauses.push("c.name_review_required = 0");
    if (url.searchParams.get("suppression") === "blocked") clauses.push("c.do_not_contact = 1 AND c.outreach_approved = 0");
    addLike(clauses, parameters, url.searchParams.get("region"), ["c.organization_name"]);
    addLike(clauses, parameters, url.searchParams.get("source"), ["c.source_reference"]);
    return pageResult(database, {
      selectSql: "SELECT c.* FROM pool_contacts c",
      countSql: "SELECT COUNT(*) AS count FROM pool_contacts c",
      where: `WHERE ${clauses.join(" AND ")}`,
      parameters,
      orderBy: "ORDER BY c.organization_name COLLATE NOCASE, c.source_full_name COLLATE NOCASE",
      url,
    });
  }

  reviewQueue(url) {
    const database = this.requireDatabase();
    const clauses = ["1=1"];
    const parameters = [];
    addLike(clauses, parameters, url.searchParams.get("search"), ["organization_name", "contact_name", "email", "phone", "role", "evidence_url"]);
    addExact(clauses, parameters, url.searchParams.get("status"), "bucket");
    addExact(clauses, parameters, url.searchParams.get("segment"), "segment");
    if (url.searchParams.get("quality") === "blocked") clauses.push("do_not_contact = 1 AND outreach_approved = 0");
    return pageResult(database, {
      selectSql: "SELECT * FROM review_queue",
      countSql: "SELECT COUNT(*) AS count FROM review_queue",
      where: `WHERE ${clauses.join(" AND ")}`,
      parameters,
      orderBy: "ORDER BY CASE bucket WHEN 'confirmed_current' THEN 1 WHEN 'official_dated' THEN 2 WHEN 'historical_open' THEN 3 WHEN 'changed_legacy' THEN 4 ELSE 5 END, CAST(rank AS INTEGER), organization_name COLLATE NOCASE",
      url,
    });
  }

  quarantine(url) {
    const database = this.requireDatabase();
    const clauses = ["1=1"];
    const parameters = [];
    addLike(clauses, parameters, url.searchParams.get("search"), ["label", "source_id", "review_reason", "next_decision"]);
    addExact(clauses, parameters, url.searchParams.get("status"), "status");
    return pageResult(database, {
      selectSql: "SELECT * FROM quarantine_items",
      countSql: "SELECT COUNT(*) AS count FROM quarantine_items",
      where: `WHERE ${clauses.join(" AND ")}`,
      parameters,
      orderBy: "ORDER BY object_type COLLATE NOCASE, label COLLATE NOCASE",
      url,
    });
  }

  sources() {
    const database = this.requireDatabase();
    return {
      sources: database.prepare("SELECT * FROM source_register ORDER BY source_file COLLATE NOCASE, source_sheet_name COLLATE NOCASE").all(),
      suppressions: database.prepare("SELECT suppression_status AS status, reason, COUNT(*) AS count FROM legacy_suppressions GROUP BY suppression_status, reason ORDER BY count DESC").all(),
      duplicateSignals: database.prepare("SELECT id, group_id AS groupId, signal_type AS signalType, source_ids AS sourceIds, decision_rule AS decisionRule FROM duplicate_signals ORDER BY group_id").all(),
      provenance: distribution(database, "SELECT source_file || ' · ' || source_sheet AS label, COUNT(*) AS count FROM provenance GROUP BY source_file, source_sheet ORDER BY count DESC"),
    };
  }

  detail(type, id) {
    const database = this.requireDatabase();
    const decodedId = decodeURIComponent(id);
    if (type === "pool-organization") {
      const record = database.prepare("SELECT o.*, a.street, a.postal_code AS postalCode, a.city, a.state, a.country FROM pool_organizations o LEFT JOIN organization_addresses a ON a.organization_kind='pool' AND a.organization_id=o.id WHERE o.id=?").get(decodedId);
      if (!record) return null;
      return { type, record, contacts: database.prepare("SELECT id, source_full_name AS name, original_role AS role, contact_status AS status FROM pool_contacts WHERE organization_id=? ORDER BY source_full_name LIMIT 100").all(decodedId), provenance: database.prepare("SELECT * FROM provenance WHERE entity_type='pool_organization' AND entity_id=?").all(decodedId) };
    }
    if (type === "pool-contact") {
      const record = database.prepare("SELECT c.*, o.name AS resolvedOrganizationName FROM pool_contacts c LEFT JOIN pool_organizations o ON o.id=c.organization_id WHERE c.id=?").get(decodedId);
      if (!record) return null;
      return { type, record, provenance: database.prepare("SELECT * FROM provenance WHERE entity_type='pool_contact' AND entity_id=?").all(decodedId), suppressions: database.prepare("SELECT reason_code AS reasonCode, reason, source_status AS sourceStatus, consent_status AS consentStatus, active FROM suppression_entries WHERE entity_type='pool_contact' AND entity_id=?").all(decodedId) };
    }
    if (type === "organization") {
      const record = database.prepare("SELECT o.*, a.street, a.postal_code AS postalCode, a.city, a.state, a.country, a.quality_status AS addressQuality FROM organizations o LEFT JOIN organization_addresses a ON a.organization_kind='verified' AND a.organization_id=o.id WHERE o.id=?").get(decodedId);
      if (!record) return null;
      return { type, record, contacts: database.prepare("SELECT c.id, c.source_full_name AS name, c.role, c.name_review_required AS nameReviewRequired FROM contact_organization_relationships r JOIN contacts c ON c.id=r.contact_id WHERE r.organization_id=? ORDER BY c.source_full_name").all(decodedId), provenance: database.prepare("SELECT * FROM provenance WHERE entity_type='organization' AND entity_id=?").all(decodedId) };
    }
    if (type === "contact") {
      const record = database.prepare("SELECT * FROM contacts WHERE id=?").get(decodedId);
      if (!record) return null;
      return { type, record, relationships: database.prepare("SELECT r.*, o.display_name AS organizationName, a.city, a.state FROM contact_organization_relationships r JOIN organizations o ON o.id=r.organization_id LEFT JOIN organization_addresses a ON a.organization_kind='verified' AND a.organization_id=o.id WHERE r.contact_id=? ORDER BY o.display_name").all(decodedId), provenance: database.prepare("SELECT * FROM provenance WHERE entity_type='contact' AND entity_id=?").all(decodedId), suppressions: database.prepare("SELECT reason_code AS reasonCode, reason, source_status AS sourceStatus, consent_status AS consentStatus, active FROM suppression_entries WHERE entity_type='contact' AND entity_id=?").all(decodedId) };
    }
    if (type === "review") {
      const record = database.prepare("SELECT * FROM review_queue WHERE id=?").get(decodedId);
      return record ? { type, record } : null;
    }
    if (type === "quarantine") {
      const record = database.prepare("SELECT * FROM quarantine_items WHERE id=?").get(decodedId);
      return record ? { type, record } : null;
    }
    return null;
  }
}
