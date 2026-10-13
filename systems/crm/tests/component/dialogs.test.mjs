import test from "node:test";
import assert from "node:assert/strict";
import React from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { createServer } from "vite";
import { createSeedState } from "../../src/data/seed.js";

test("Formulardialog besitzt Dialogsemantik, eindeutige Beschriftung und lokale Grenze", async (t) => {
  const vite = await createServer({ server: { middlewareMode: true }, appType: "custom", logLevel: "silent" });
  t.after(() => vite.close());
  const { EntityFormDialog } = await vite.ssrLoadModule("/src/components/EntityFormDialog.jsx");
  const markup = renderToStaticMarkup(React.createElement(EntityFormDialog, {
    config: { kind: "organizations", context: {} },
    data: createSeedState(),
    onClose() {},
    onSave() {},
  }));
  assert.match(markup, /role="dialog"/);
  assert.match(markup, /aria-modal="true"/);
  assert.match(markup, /Neu anlegen: Organisation/);
  assert.match(markup, /Alle Eingaben bleiben in diesem Browser/);
  assert.match(markup, /Organisationsname/);
  assert.match(markup, /Abbrechen/);
});

test("Globale Suche erklärt gemeinsame lokale und importierte Suche sowie sichere Zwischenzustände", async (t) => {
  const vite = await createServer({ server: { middlewareMode: true }, appType: "custom", logLevel: "silent" });
  t.after(() => vite.close());
  const { GlobalSearchDialog } = await vite.ssrLoadModule("/src/components/GlobalSearchDialog.jsx");
  const baseProps = { open: true, onQueryChange() {}, onSelect() {}, onClose() {}, results: [], inputRef: { current: null } };
  const shortMarkup = renderToStaticMarkup(React.createElement(GlobalSearchDialog, { ...baseProps, query: "A", loading: false, importedError: "" }));
  const loadingMarkup = renderToStaticMarkup(React.createElement(GlobalSearchDialog, { ...baseProps, query: "Adesso", loading: true, importedError: "" }));
  const resultMarkup = renderToStaticMarkup(React.createElement(GlobalSearchDialog, {
    ...baseProps,
    query: "Adesso",
    loading: false,
    importedError: "",
    results: [{ type: "importedOrganizations", id: "org-import-1", title: "Adesso SE", subtitle: "IT · Dortmund · schreibgeschützt" }],
  }));
  assert.match(shortMarkup, /Ab zwei Zeichen werden lokale und importierte CRM-Einträge gemeinsam geprüft/);
  assert.match(loadingMarkup, /Importierte Organisationen und Kontakte werden ergänzt/);
  assert.match(resultMarkup, /Importierte Organisation/);
  assert.match(resultMarkup, /Adesso SE/);
  assert.match(resultMarkup, /schreibgeschützt/);
});

test("R3-Formulare bilden Lead-, Partner- und Evidenzverträge ab", async (t) => {
  const vite = await createServer({ server: { middlewareMode: true }, appType: "custom", logLevel: "silent" });
  t.after(() => vite.close());
  const { EntityFormDialog } = await vite.ssrLoadModule("/src/components/EntityFormDialog.jsx");
  const data = createSeedState();
  const leadMarkup = renderToStaticMarkup(React.createElement(EntityFormDialog, { config: { kind: "leads", context: {} }, data, onClose() {}, onSave() {} }));
  const partnerMarkup = renderToStaticMarkup(React.createElement(EntityFormDialog, { config: { kind: "partnerOrganizations", context: {} }, data, onClose() {}, onSave() {} }));
  const opportunityMarkup = renderToStaticMarkup(React.createElement(EntityFormDialog, { config: { kind: "opportunities", record: data.opportunities[0] }, data, onClose() {}, onSave() {} }));
  assert.match(leadMarkup, /Lead-Bezeichnung/);
  assert.match(leadMarkup, /Oder Organisationshinweis/);
  assert.match(partnerMarkup, /Partnername/);
  assert.match(partnerMarkup, /Keine Kooperation oder Leistungszusage/);
  assert.match(opportunityMarkup, /Dokumentierter Bedarf/);
  assert.match(opportunityMarkup, /Entscheidungspfad/);
  assert.match(opportunityMarkup, /Lokaler Gewinnmarker/);
});

test("R3.2-Formulare bilden den beschlossenen Fachblock und lokale Grenzen ab", async (t) => {
  const vite = await createServer({ server: { middlewareMode: true }, appType: "custom", logLevel: "silent" });
  t.after(() => vite.close());
  const { EntityFormDialog } = await vite.ssrLoadModule("/src/components/EntityFormDialog.jsx");
  const data = createSeedState();
  const render = (kind) => renderToStaticMarkup(React.createElement(EntityFormDialog, { config: { kind, context: { opportunityId: "opp-101", organizationId: "org-101" } }, data, onClose() {}, onSave() {} }));
  assert.match(render("notes"), /Notizinhalt|Notiz \*/);
  assert.match(render("conversations"), /Gesprächsergebnis/);
  assert.match(render("appointments"), /keine Kalenderverbindung/i);
  assert.match(render("followUps"), /Wiedervorlage/);
  assert.match(render("offers"), /ohne Versand/i);
  assert.match(render("decisions"), /Entscheiderrolle/);
});

test("Growth-Arbeitsfläche zeigt Recherche, Versandgrenze und lokale Persistenz transparent", async (t) => {
  const vite = await createServer({ server: { middlewareMode: true }, appType: "custom", logLevel: "silent" });
  t.after(() => vite.close());
  const { GrowthWorkspace } = await vite.ssrLoadModule("/src/components/GrowthWorkspace.jsx");
  const api = { listBackups: async () => ({ backups: [] }), create() {}, convertResearch() {}, approveOutreach() {}, suppressContact() {}, updateCostGuardrails() {}, exportState() {} };
  const markup = renderToStaticMarkup(React.createElement(GrowthWorkspace, { data: createSeedState(), api, persistence: { mode: "browser-fallback", status: "ready", label: "Lokaler Browser-Fallback" } }));
  assert.match(markup, /Recherche &amp; Outreach/);
  assert.match(markup, /kein Live-Scraping/i);
  assert.match(markup, /Lead Research/);
  assert.match(markup, /Versand gesperrt|Outreach-Entwürfe/);
  assert.match(markup, /Kontrollierte Vorbereitung/);
  assert.doesNotMatch(markup, /Sicherung &amp; Datenvertrag/);
  assert.doesNotMatch(markup, /R3\.5/);
});

test("R3.9-Systembereich ist nicht mehr als Growth-Unterregister doppelt geführt", async (t) => {
  const vite = await createServer({ server: { middlewareMode: true }, appType: "custom", logLevel: "silent" });
  t.after(() => vite.close());
  const { GrowthWorkspace } = await vite.ssrLoadModule("/src/components/GrowthWorkspace.jsx");
  const api = { listBackups: async () => ({ backups: [] }), createBackup() {}, restoreBackup() {}, exportState() {}, previewImport() {}, applyImport() {}, runG1Controls() {} };
  const markup = renderToStaticMarkup(React.createElement(GrowthWorkspace, { workspace: "system", data: createSeedState(), api, persistence: { mode: "browser-fallback", status: "ready", label: "Lokaler Browser-Fallback" } }));
  assert.match(markup, /System &amp; Freigaben/);
  assert.match(markup, /Sicherung &amp; Datenvertrag/);
  assert.match(markup, /Gate-Übersicht/);
  assert.doesNotMatch(markup, /Growth-Bereiche/);
  assert.doesNotMatch(markup, /Recherche &amp; Outreach/);
});

test("R3.6-Cockpit zeigt strategische Lage ohne Tagesagenda oder Entwicklungstext", async (t) => {
  const vite = await createServer({ server: { middlewareMode: true }, appType: "custom", logLevel: "silent" });
  t.after(() => vite.close());
  const { FounderDecisionCockpit } = await vite.ssrLoadModule("/src/components/FounderDecisionCockpit.jsx");
  const markup = renderToStaticMarkup(React.createElement(FounderDecisionCockpit, {
    data: createSeedState(),
    openEntity() {},
    onNavigate() {},
  }));
  assert.match(markup, /Geschäftslage im Blick/);
  assert.match(markup, /Pipeline-Lage/);
  assert.match(markup, /Entscheidungsreife/);
  assert.match(markup, /Bewegung &amp; Alterung/);
  assert.match(markup, /Beziehungsabdeckung/);
  assert.match(markup, /Datenvertrauen/);
  assert.match(markup, /Nächste Managemententscheidungen/);
  assert.doesNotMatch(markup, /Heute &amp; als Nächstes/);
  assert.doesNotMatch(markup, /Outreach Preflight/);
  assert.doesNotMatch(markup, /R3\./);
});

test("R3.6-Arbeitstag bleibt handlungsorientiert und frei von Cockpit-Dubletten", async (t) => {
  const vite = await createServer({ server: { middlewareMode: true }, appType: "custom", logLevel: "silent" });
  t.after(() => vite.close());
  const { WorkdayView } = await vite.ssrLoadModule("/src/components/WorkdayView.jsx");
  const markup = renderToStaticMarkup(React.createElement(WorkdayView, { data: createSeedState(), openEntity() {}, onNavigate() {}, onSetTaskStatus() {} }));
  assert.match(markup, /Mein Arbeitstag/);
  assert.match(markup, /Prioritäten/);
  assert.match(markup, /Heute &amp; als Nächstes/);
  assert.match(markup, /Heute abschließen/);
  assert.match(markup, /Kontakt &amp; Follow-up/);
  assert.doesNotMatch(markup, /Pipeline-Lage/);
  assert.doesNotMatch(markup, /Datenvertrauen/);
});

test("R3.6-Auswertungen enthalten Charts, belegte Faktenbasis und getrennte Berichtsmodi", async (t) => {
  const vite = await createServer({ server: { middlewareMode: true }, appType: "custom", logLevel: "silent" });
  t.after(() => vite.close());
  const { AnalyticsView } = await vite.ssrLoadModule("/src/components/AnalyticsView.jsx");
  const markup = renderToStaticMarkup(React.createElement(AnalyticsView, { data: createSeedState(), onNavigate() {}, openEntity() {} }));
  assert.match(markup, /Pipeline-Verteilung/);
  assert.match(markup, /Aktivitätsentwicklung/);
  assert.match(markup, /Statusmix/);
  assert.match(markup, /Datenqualität/);
  assert.match(markup, /Interne Analyse/);
  assert.match(markup, /Berichtsansicht/);
  assert.match(markup, /keine Prognose/i);
});

test("R3.6-Kontaktfreigabe erhält Kontaktentscheidung, Preflight und Aufgabenconversion außerhalb des Cockpits", async (t) => {
  const vite = await createServer({ server: { middlewareMode: true }, appType: "custom", logLevel: "silent" });
  t.after(() => vite.close());
  const { OperationalReadinessPanel } = await vite.ssrLoadModule("/src/components/OperationalReadinessPanel.jsx");
  const markup = renderToStaticMarkup(React.createElement(OperationalReadinessPanel, { data: createSeedState(), api: { createReadinessTask() {} }, openEntity() {}, onNavigate() {} }));
  assert.match(markup, /Darf kontaktiert werden/);
  assert.match(markup, /Outreach-Preflight/);
  assert.match(markup, /Produktiver Versand gesperrt/);
  assert.match(markup, /Als Aufgabe anlegen|Aufgabe vorhanden/);
  assert.doesNotMatch(markup, /R3\./);
});

test("G1-Readiness bleibt ein gesperrtes Prüfregister ohne Aktivierung", async (t) => {
  const vite = await createServer({ server: { middlewareMode: true }, appType: "custom", logLevel: "silent" });
  t.after(() => vite.close());
  const { G1ReadinessPanel } = await vite.ssrLoadModule("/src/components/G1ReadinessPanel.jsx");
  const markup = renderToStaticMarkup(React.createElement(G1ReadinessPanel, { data: createSeedState(), persistence: { mode: "sqlite" }, onRunControls() {} }));
  assert.match(markup, /G1 · Eintrittsgates &amp; Beschlusslage/);
  assert.match(markup, /PO-beschlossen/);
  assert.match(markup, /G1 bleibt NO-GO/);
  assert.match(markup, /Zugriffsschutz/);
  assert.match(markup, /Import &amp; Datenbereinigung/);
  assert.match(markup, /Lokale Prüfungen ausführen/);
  assert.match(markup, /Recht &amp; Quellen/);
  assert.match(markup, /Zugriff &amp; Gerät/);
  assert.doesNotMatch(markup, /Echtdaten aktivieren/);
});
