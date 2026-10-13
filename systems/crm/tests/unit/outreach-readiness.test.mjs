import test from "node:test";
import assert from "node:assert/strict";
import { createSeedState } from "../../src/data/seed.js";
import {
  buildContactabilityDecision,
  buildFutureGatePreparation,
  buildOperationalSignals,
  buildOutreachPreflight,
  outreachReadinessContract,
} from "../../src/domain/outreachReadiness.js";

test("Kontaktentscheidung benennt offene Nachweise ohne Versandfreigabe", () => {
  const data = createSeedState();
  const decision = buildContactabilityDecision(data, "con-101");
  assert.equal(decision.state, "review_required");
  assert.equal(decision.answer, "Prüfung erforderlich");
  assert.deepEqual(decision.missingEvidence.map((item) => item.id), ["legal_status", "information_notice"]);
  assert.equal(decision.productiveSendAllowed, false);
});

test("vollständig dokumentierter Kontakt ist nur lokal vorbereitet", () => {
  const data = createSeedState();
  const contact = data.contacts.find((item) => item.id === "con-101");
  Object.assign(contact, { consentStatus: "not_required_review", informationNoticeAt: "2026-10-12" });
  const decision = buildContactabilityDecision(data, contact.id);
  assert.equal(decision.state, "locally_ready");
  assert.equal(decision.answer, "Nur lokal vorbereitet");
  assert.equal(decision.productiveSendAllowed, false);
});

test("Sperrliste erzeugt eine harte Kontakt- und Preflight-Sperre", () => {
  const data = createSeedState();
  data.suppressionEntries.push({ id: "suppress-test", contactId: "con-101", reason: "Synthetischer Test", synthetic: true, archivedAt: null });
  assert.equal(buildContactabilityDecision(data, "con-101").state, "blocked");
  assert.equal(buildOutreachPreflight(data, "outreach-101").state, "blocked");
});

test("Outreach-Preflight bündelt Kontaktstatus, Nachweise, Freigabe und technische Sperre", () => {
  const preflight = buildOutreachPreflight(createSeedState(), "outreach-101");
  assert.equal(preflight.state, "review_required");
  assert.deepEqual(preflight.missingEvidence.map((item) => item.id), ["contactability", "local_approval"]);
  assert.equal(preflight.productiveSendAllowed, false);
  assert.match(preflight.providerStatus, /nicht verbunden/i);
});

test("operative Signale sind stabil, zuordenbar und deduplizierbar", () => {
  const data = createSeedState();
  const signals = buildOperationalSignals(data, "opp-101");
  assert.deepEqual(signals.map((item) => item.kind), ["contact-basis", "source-evidence", "decision-role", "outreach-preflight"]);
  assert.ok(signals.every((item) => item.readinessKey.startsWith("r3.5:opp-101:")));
  data.tasks.push({ id: "task-ready", readinessKey: signals[0].readinessKey, status: "open", archivedAt: null });
  assert.equal(buildOperationalSignals(data, "opp-101")[0].existingTaskId, "task-ready");
});

test("künftige Produktivgates bleiben ausdrücklich geschlossen", () => {
  const gates = buildFutureGatePreparation(createSeedState());
  assert.deepEqual(gates.map((item) => item.id), ["real_data", "individual_send", "live_research"]);
  assert.ok(gates.every((item) => item.status === "Nicht freigegeben"));
  assert.equal(outreachReadinessContract.productiveSend, false);
  assert.equal(outreachReadinessContract.externalResearch, false);
  assert.equal(outreachReadinessContract.legalClearanceClaimed, false);
});
