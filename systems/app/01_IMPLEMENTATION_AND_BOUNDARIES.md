# Implementierung und Produktgrenzen

## Ein Produkt, drei externe Rollen, ein Entry Point

Der aktive Vite-Build enthält ausschließlich `index.html` und die AMAVIO-One-App. Fachkraft, Wohnanbieter und lokaler Partner besitzen getrennte Routen, Inhalte und minimierte Sichtprojektionen. Arbeitgeber- und Operationsrollen existieren nicht im aktiven App-Routenvertrag und können in der Oberfläche nicht gewählt werden.

Die App ist deshalb ausdrücklich kein mobiles Arrival Control Center. Das führende ACC bleibt ein getrenntes Produkt mit eigener Oberfläche, eigener Rollenlogik und eigener Codebasis.

## Gemeinsame Wahrheit ohne Produktvermischung

Die gemeinsame fachliche Wahrheit liegt in den versionierten Verträgen unter `contracts/` und in der deterministischen Arrival Engine unter `src/arrival/`. Die neue lokale API operationalisiert diese Grenze für synthetische Fälle, ohne ACC-Code oder ACC-Oberflächen in die App zu übernehmen.

| Datei | Zweck |
|---|---|
| `contracts/app-acc-interface-contract.v1.json` | Richtungen, Envelope, Idempotenz, Versionierung, Korrelation, erlaubte Wirkungen und Negativrechte |
| `contracts/status-mapping.v1.json` | Übersetzung zwischen App-Zuständen und Boundary-Ereignissen ohne gemeinsame flache Statusmaschine |
| `contracts/synthetic-arrival-integration-fixture.v1.json` | gemeinsamer synthetischer Fall mit sieben Phasen, vier Störklassen und Negativassertionen |

Ein technischer Transporterfolg gilt nicht als fachlicher Erfolg. Der Empfänger prüft weiterhin Version, Revision, Idempotenz, Akteur, fachliche Anwendbarkeit und Negativrechte.

## Aktive Architektur

| Bereich | Aktive Umsetzung |
|---|---|
| Rollen und Routen | `src/data/routes.js` – 3 Rollen, 18 Routen, DE/EN, feste Rollenzuordnung |
| Sichtprojektionen | `src/data/projections.js` und `src/arrival/projections.js` – rollenminimierte externe Projektionen |
| Zustände | `src/data/states.js` – 20 kontrollierte UI-Zustände |
| Arrival-Fachmodell | `src/arrival/` – Verträge, Graph, Golden Case, Engine und Projektion |
| Lokales Backend | `server/http.mjs` – same-origin API, Body-Limit, No-Store- und Security-Header |
| Lokale Persistenz | `server/database.mjs` – Node-SQLite, STRICT-Tabellen, WAL, Audit- und Eventspur |
| Fachservice | `server/case-service.mjs` – Revisionen, Idempotenz, Commands, Projektionen und ACC-Envelopes |
| Assistenz | `server/ai-service.mjs` – lokal-deterministische Erklärungen mit festem Purpose- und Negativvertrag |
| Readiness Policy | `server/readiness-policy.mjs` – ausführbare Referenz für Rollen-, Tenant-, Daten-, KI- und ACC-Peer-Grenzen |
| Frontend-Client | `src/runtime/api.js` und `src/arrival/store.js` – API-Verbindung, Timeout und sichtbarer lokaler Fallback |
| App-Shell | `src/components/ExternalApp.jsx` – Desktop-Sidebar, Mobile-Header und Bottom-Navigation |
| Journey | `src/components/ArrivalProcessPanel.jsx` – sieben Phasen, Verantwortung, Störpfad und R2-Laufzeitstatus |
| Interaktion | `src/components/FocusDialog.jsx` – Fokusübernahme, Fokusfalle, Escape, Fokus-Rückgabe und ehrliche Wirkungsanzeige |
| Designsystem | `src/styles.css` und `public/assets/brand/` – bestehende Brandbook-Tokens und Original-Logos |

## Persistenz- und Mutationsvertrag

Der lokale Golden Case umfasst sieben Arrival-Phasen und 44 deterministische Schritte. Der SQLite-Fachstand wird ausschließlich für den synthetischen Fall `SYN-ARRIVAL-0417` geführt. Jede akzeptierte Mutation verlangt eine erwartete Revision. Falscher Akteur, veraltete Revision und doppelter Befehl erzeugen keinen stillen Erfolg.

Die Tabellen trennen Arrival-Fälle, Commands, Fachereignisse, Integrationsnachrichten, Assistenzanfragen und Auditdaten. Datenbankschema und Laufzeit erzwingen `synthetic = 1` beziehungsweise `decision_effect = 0`.

Der Browser-Speicher bleibt ein sichtbarer lokaler Rückfallpfad, wenn die API nicht erreichbar ist. Er wird nicht als Backend, Mandanten- oder Synchronisationsmodell ausgegeben.

## Technische ACC-Grenze

Die App stellt lokal bereit:

- `POST /api/v1/integration/acc/messages` für synthetische ACC→App-Nachrichten;
- `GET /api/v1/integration/acc/outbox` für synthetische App→ACC-Envelopes.

Der Vertrag erzwingt Version, Korrelation, Idempotenz, erlaubte Boundary-Akteure und synthetische Daten. Verbotene Felder werden abgewiesen. Es gibt keinen ACC-Client, keinen Import der ACC-Codebasis und keine Live-Verbindung zu einem ACC-System.

## Assistenz- und KI-Grenze

Die lokale Assistenz unterstützt nur drei Zwecke:

1. nächsten sichtbaren Schritt erklären;
2. sichtbaren Status zusammenfassen;
3. strukturierte Supportfrage vorbereiten.

Die Projektion wird serverseitig und rollenminimiert erzeugt. Personenbewertung, Matching, Scoring und automatische Entscheidungen sind technisch und fachlich ausgeschlossen. Ein abweichender externer Provider wird mit `external_ai_provider_disabled_by_release_gate` abgewiesen.

Damit ist die Gateway- und Governance-Grundlage umgesetzt, aber keine produktive generative KI aktiviert. Für einen späteren externen Provider braucht es ein neues Daten-, Datenschutz-, Kosten-, Provider- und Release-Gate.

## Production-Readiness-Verträge

Die ergänzenden Verträge unter `contracts/` definieren Identity/Tenant/Rechte, Datenklassen, KI/Human Oversight, das erforderliche ACC-Peerprofil und neun Produktivgates. Der lokale Endpunkt `GET /api/v1/readiness` macht den Status maschinenlesbar. Er bestätigt ausdrücklich `productiveReleaseAllowed: false`.

Der read-only Audit gegen ACC J.4.1 verändert keine ACC-Datei. Sein Ergebnis `NOT_COMPATIBLE_YET` verhindert eine falsche Live-Integrationsbehauptung, bis beide getrennten Codebasen denselben Consumer-driven Contract nachweisen.

## Brand- und Experience-Entscheidungen

- Stage Navy, Brand Navy, App Navy, Cream, White, Ink, Gold und Bronze aus der freigegebenen Brandbook-Arbeitsfassung;
- Original-Logos, keine Verläufe, kein Teal/Mint/Purple und kein erfundenes App-Logo;
- editoriale Hierarchie statt austauschbarer Dashboard-Karten;
- eine primäre nächste Handlung pro Kontext;
- Verantwortung, lokale Wirkung, externe Nichtwirkung und Systemgrenzen vor einer Aktion sichtbar;
- technische Objekt- und Ereignisdetails standardmäßig eingeklappt;
- neue R2-Laufzeitinformation innerhalb der optionalen Prozessdetails, nicht als dominantes Dashboard;
- mobile Navigation ohne Rollenwahl oder ACC-Funktionen.

## Archivgrenze

`99_ARCHIV_ACC_TEST_HARNESS_20261008/` bewahrt die geerbte ACC-Demo und ältere Evidenz nur zur Rückverfolgbarkeit. Der Ordner wird von ESLint und Build ausgeschlossen. Sein Inhalt ist nicht Teil des aktiven App-Ergebnisses und darf nicht als aktueller ACC-Stand interpretiert werden.

## Unverändert geschlossene Einzelgates

1. produktive Authentifizierung, Identität, Autorisierung und Mandantenfähigkeit;
2. produktive Datenhaltung und echte Datenmigration;
3. produktive Arrival-Graph-Mutationen;
4. Live-Kopplung an die getrennte ACC-Codebasis;
5. externer KI-Provider, produktive KI, Matching, Scoring oder automatische Entscheidungen;
6. reale Daten und reale Rollentests;
7. Deployment, Veröffentlichung, Git-Push, externe Nachricht oder Kosten.

Die lokale R2-Foundation ist eine belastbare Entwicklungsgrundlage. Sie ist keine Aussage über Produktionsreife, rechtliche Freigabe, reale Betriebsfähigkeit oder externe Systemintegration.
