import test from "node:test";
import assert from "node:assert/strict";
import { createSeedState } from "../../src/data/seed.js";
import {
  buildAgingStrip,
  buildDataConfidence,
  buildDecisionBrief,
  buildFounderFocus,
  buildOpportunityReadiness,
  buildPipelineMovement,
  decisionIntelligenceContract,
  opportunityIdleDays,
} from "../../src/domain/decisionIntelligence.js";

test("Founder Focus leitet exakt drei begründete Prioritäten aus dem lokalen Zustand ab", () => {
  const data = createSeedState();
  const focus = buildFounderFocus(data);
  assert.equal(focus.length, 3);
  assert.deepEqual(focus.map((item) => item.organization), ["Klinikverbund Rhein", "St. Marien Kliniken", "Gesundheitsverbund Süd"]);
  assert.match(focus[0].reason, /Entscheider noch offen/);
  assert.match(focus[1].reason, /16 Tage ohne Fortschritt/);
  assert.match(focus[2].reason, /3 Tagen/);
});

test("Entscheidungsreife bleibt erklärbar und benennt jede Prüfdimension", () => {
  const data = createSeedState();
  const opportunity = data.opportunities.find((item) => item.id === "opp-101");
  const readiness = buildOpportunityReadiness(data, opportunity);
  assert.equal(readiness.score, 83);
  assert.equal(readiness.level, "mittel");
  assert.equal(readiness.dimensions.length, 6);
  assert.deepEqual(readiness.dimensions.filter((item) => !item.met).map((item) => item.id), ["decision"]);
});

test("Decision Brief trennt Fakt, Annahme, offene Frage und Empfehlung", () => {
  const data = createSeedState();
  const brief = buildDecisionBrief(data, "opp-101");
  assert.deepEqual(brief.entries.map((item) => item.kind), ["confirmed", "assumption", "question", "recommendation"]);
  assert.match(brief.entries.find((item) => item.kind === "assumption").text, /Planungswert/);
  assert.match(brief.provenance, /lokale regelbasierte Assistenzsimulation/i);
  assert.equal(decisionIntelligenceContract.externalModel, false);
  assert.equal(decisionIntelligenceContract.externalDataTransfer, false);
  assert.equal(decisionIntelligenceContract.humanApprovalRequired, true);
  assert.equal(decisionIntelligenceContract.autonomousWrites, false);
});

test("Pipeline Movement zählt Bestand und nur dokumentierte Phasenereignisse", () => {
  const movement = buildPipelineMovement(createSeedState());
  assert.deepEqual(movement.map((item) => item.count), [1, 2, 2, 1, 1, 1]);
  assert.equal(movement.find((item) => item.id === "scoping").movements, 1);
  assert.equal(movement.find((item) => item.id === "proposal").movements, 1);
});

test("Aging Strip nutzt tatsächliche Aktivitätsdaten und keine Schätzung", () => {
  const data = createSeedState();
  const opportunity = data.opportunities.find((item) => item.id === "opp-102");
  assert.equal(opportunityIdleDays(data, opportunity), 16);
  const aging = buildAgingStrip(data);
  assert.equal(aging.find((bucket) => bucket.id === "attention").items[0].organization, "St. Marien Kliniken");
});

test("Datenvertrauen ist aus Quelle, Aktualität, Vollständigkeit und Dublettenlage ableitbar", () => {
  const confidence = buildDataConfidence(createSeedState(), "opp-101");
  assert.deepEqual(confidence.map((item) => item.id), ["source", "freshness", "completeness", "duplicates"]);
  assert.equal(confidence.find((item) => item.id === "source").status, "Dokumentiert");
  assert.equal(confidence.find((item) => item.id === "completeness").status, "Hoch");
  assert.equal(confidence.find((item) => item.id === "duplicates").status, "Gering");
});
