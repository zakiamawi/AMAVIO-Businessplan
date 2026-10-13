# AMAVIO One CRM – R3 Implementation Crosswalk

**Stand:** 09.10.2026  
**Bezugsbeschluss:** Bündel A+B gemäß Empfehlung; Bündel C vollständig gesperrt.

| ID | Beschlossener Vertrag | Technische Angleichung im lokalen synthetischen Core | Prüfevidenz | Restgrenze |
|---|---|---|---|---|
| PO-CRM-001 | sechs Erfolgsphasen plus `Verloren` | Pipelineversion `1.0`, explizite Übergangsmatrix, Historie und Audit | Contract-, Integration- und E2E-Test | Änderungen nur versioniert |
| PO-CRM-003 | phasenbezogene Mindestkriterien | `validateStageEntry` mit benannten fehlenden Evidenzen von Erstkontakt bis Gewonnen/Verloren | Unit- und Contract-Test; Browserpfad bis Scoping | keine erfundenen Ersatzwerte |
| PO-CRM-004 | Lead von Opportunity trennen | Lead-CRUD, Statusfilter, Detail, Archiv und qualifizierte Konvertierung in Erstkontakt | Contract-, Integration- und E2E-Test | keine automatische Anreicherung |
| PO-CRM-005 | Partner als getrennte Objektklasse | Partnerorganisation und Partnerkontakt mit CRUD, Beziehung, Suche und Archiv | Integration- und E2E-Test | kein Partnerlogin, keine App-Rolle |
| PO-CRM-018 | DE-first | sichtbare Oberfläche konsistent deutsch; keine Teilumschaltung | statisches Gate und Browserprüfung | EN nur als eigenes vollständiges Release |
| PO-CRM-019 | kein gewichteter Forecast | nur sichtbares Potenzial; Wochenüberblick benennt Forecastgrenze | E2E-Test | keine Wahrscheinlichkeitslogik |
| PO-CRM-020 | Export deaktiviert | sichtbare deaktivierte Exportaktion mit Gate-Hinweis | E2E- und statisches Gate | keine Datei-/Cloudausgabe |
| PO-CRM-002 | fünf Zielrollen | Rollenvertrag und Zuordnung im Single-Workspace-Seed | Unit-/statischer Test | keine Authentifizierung oder Durchsetzung |
| PO-CRM-006 | Statusarten trennen | Beziehung, Kontakt und Consent getrennt; Default `unknown`; Nachweisfelder und lokale Sperranzeige | Unit-, Komponenten- und E2E-Test | kein Rechtsnachweis, keine Außenaktion |
| PO-CRM-007 | Archiv statt Löschung | reversible Archivierung/Wiederherstellung und Undo für lokale Mutationen | Integration und E2E | keine physische Löschung |
| PO-CRM-010 | interner Single-Workspace | `workspaceContract.mode = single_internal`, `tenantCapable = false` | Unit-/statischer Test | keine Mehrbenutzer-/Mandantenarchitektur |
| PO-CRM-014 | Dual Approval vor ACC-Handoff | zwei getrennte lokale Marker; `approved_marker` nur bei beiden; kein Payload/`accId` | Contract-, Integration- und E2E-Test | ACC-Integration vollständig gesperrt |

## Bündel C – technische Negativkontrolle

Die acht gesperrten Fähigkeiten sind als unveränderliche Negativliste hinterlegt. Der aktive Quellcode enthält keinen `fetch`, `XMLHttpRequest`, `WebSocket` oder externe URL. Es existieren keine Provider-SDKs, Login-Flows, Uploads, Deployments, Imports oder Integrationsendpunkte. Das QA-Gate schlägt fehl, wenn diese lokale Grenze verletzt wird.

## Erhaltene Bestandteile

Markenmittel, Navy-/Creme-/Gold-System, Editorialität, synthetischer Demonstrationsbestand, bestehende Core-CRUD-Flows, Suche, Aufgaben, Timeline, Archiv, Undo, Reset, responsive Grundstruktur und Dialogmechanik wurden erhalten und gezielt erweitert. Es wurde keine generische CRM-Suite und keine fremde Produktlogik übernommen.
