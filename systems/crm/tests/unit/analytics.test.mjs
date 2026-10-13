import test from "node:test";
import assert from "node:assert/strict";
import { createSeedState } from "../../src/data/seed.js";
import { buildAnalytics, buildG1Readiness } from "../../src/domain/analytics.js";

test("Auswertungen leiten Kennzahlen und Verteilungen aus dem CRM-Zustand ab", () => {
  const analytics = buildAnalytics(createSeedState(), "30");
  assert.equal(analytics.metrics.active, 7);
  assert.equal(analytics.metrics.potential, 138700);
  assert.deepEqual(analytics.pipeline.map((item) => item.count), [1, 2, 2, 1, 1, 1]);
  assert.equal(analytics.statusMix.reduce((sum, item) => sum + item.count, 0), 8);
  assert.ok(analytics.activityTrend.every((item) => item.date && Number.isInteger(item.count)));
  assert.ok(analytics.completeness > 0 && analytics.completeness <= 100);
});

test("Berichtslogik verwendet dokumentierte Ereignisse statt erfundener Forecast-Reihen", () => {
  const analytics = buildAnalytics(createSeedState(), "30");
  assert.equal(analytics.evidence.generatedFrom, "Aktueller CRM-Datenstand");
  assert.equal(analytics.evidence.opportunityCount, 8);
  assert.equal(analytics.activityTrend.reduce((sum, item) => sum + item.count, 0), analytics.evidence.eventCount);
});

test("G1-Readiness bewertet Vorbereitung, hält reale Daten aber gesperrt", () => {
  const readiness = buildG1Readiness(createSeedState(), { mode: "sqlite" });
  assert.equal(readiness.state, "blocked");
  assert.equal(readiness.label, "G1 bleibt NO-GO");
  assert.equal(readiness.gates.length, 10);
  assert.equal(readiness.releaseEligible, false);
  assert.equal(readiness.gates.find((item) => item.id === "G1-06").status, "technical_blocked");
  assert.equal(readiness.gates.find((item) => item.id === "G1-10").status, "po_blocked");
});
