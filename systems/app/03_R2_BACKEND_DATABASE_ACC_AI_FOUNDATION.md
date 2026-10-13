# R2 Foundation – Backend, Datenbank, ACC-Grenze und Assistenz

## Zielbild dieses Pakets

Dieses Paket schafft eine produktionsnahe technische Form, ohne eine produktive Umgebung vorzutäuschen. Alle Laufzeitdaten sind synthetisch. Die Implementierung ist lokal gebunden, verfügt über keine produktive Authentifizierung und kommuniziert mit keinem externen System.

```text
AMAVIO One App (3 externe Rollen)
             │ same-origin /api
             ▼
Lokaler Node-Fachservice ─────► lokale SQLite-Persistenz
             │
             ├───────────────► lokale Assistenz ohne Entscheidungswirkung
             │
             └───────────────► versionierte ACC-Vertragsgrenze
                                  │
                                  └─ keine Live-Verbindung; synthetischer Testadapter
```

## Backend und Datenbank

Die Implementierung nutzt ausschließlich vorhandene Node-Funktionalität (`node:http`, `node:sqlite`) und verursacht keine neuen Abhängigkeiten oder Kosten.

### Tabellen

| Tabelle | Verantwortung |
|---|---|
| `arrival_cases` | kanonischer synthetischer Fachstand mit Revision und Cursor |
| `commands` | idempotente Commands, Ergebnis und Ablehnungsgrund |
| `workflow_events` | append-orientierte Fachereignisse mit Sichtbarkeit |
| `integration_messages` | App→ACC- und ACC→App-Envelopes |
| `ai_requests` | zulässige Assistenzanfragen mit Input-Hash und `decision_effect = 0` |
| `audit_log` | technische Nachvollziehbarkeit zentraler Aktionen |

### Schutzmechanismen

- SQLite-STRICT-Tabellen, Foreign Keys und WAL;
- `synthetic = 1` als Schema-Bedingung;
- erwartete Revision für jede Mutation;
- eindeutige Idempotenzschlüssel;
- rollenminimierte Projektionen statt Datenbankobjekte im Frontend;
- lokaler No-Store-API-Vertrag und restriktive Response-Header;
- Request-Limit von 256 KiB;
- kein CORS-Freigabevertrag für Fremdursprünge;
- Laufzeitdaten in `.runtime/`, vom Quellpaket ausgeschlossen.

## API-Oberfläche

| Methode und Route | Lokale Funktion |
|---|---|
| `GET /api/health` | Reifegrad, DB-Zähler, Verträge und Assistenzgrenzen |
| `GET /api/v1/cases/:id` | rollenminimierte Projektion |
| `POST /api/v1/cases/:id/commands` | externer Rollencommand mit Revision und Idempotenz |
| `POST /api/v1/integration/acc/messages` | synthetischer ACC→App-Eingang |
| `GET /api/v1/integration/acc/outbox` | synthetische App→ACC-Outbox |
| `POST /api/v1/assist` | erlaubte lokale Assistenzzwecke |
| `POST /api/v1/synthetic/reset` | lokaler Reset des festgelegten synthetischen Falls |

Alle Endpunkte sind Entwicklungsendpunkte. Ohne produktive Identität und Autorisierung dürfen sie weder exponiert noch mit echten Daten betrieben werden.

## ACC-Integrationsvertrag

Die App und das ACC teilen keine Oberfläche und keine Codebasis. Die lokale Schnittstelle prüft:

- `contractVersion`;
- `messageId`;
- `correlationId`;
- `idempotencyKey`;
- `senderRole`;
- `commandId`;
- `expectedRevision`;
- `synthetic: true`;
- Negativfelder aus dem Projektionsvertrag.

Arbeitgeber- und Operationsakteure sind ausschließlich Boundary-Akteure. Sie werden nicht als App-Rollen freigeschaltet. Eine spätere Live-Kopplung muss separat beweisen, dass beide Codebasen denselben freigegebenen Vertrag implementieren.

## Assistenz- und KI-Charter im Code

Zulässige Zwecke:

- `explain_next_step`;
- `summarize_visible_status`;
- `draft_support_question`.

Unzulässig:

- Personenbewertung;
- Matching oder Ranking;
- Scoring;
- Freigabe, Ablehnung oder Priorisierung von Personen;
- Mutation des Arrival-Graphen durch die Assistenz;
- externe Provider oder echte Daten ohne neues Gate.

Die aktuelle Implementierung ist eine deterministische lokale Policy-Assistenz. Sie beweist Gateway, Purpose-Limit, Datenminimierung, Audit und UI-Vertrag. Sie ist kein produktives Sprachmodell. Der Versuch, einen anderen Provider zu konfigurieren, wird aktiv abgewiesen.

## Spätere Produktionshärtung – ausdrücklich nicht freigegeben

Vor produktiver Nutzung wären mindestens erforderlich:

1. freigegebenes Identity-, Tenant- und Rechtemodell;
2. produktive Datenklassifikation, Aufbewahrung, Löschung und Migration;
3. Secret- und Key-Management;
4. verschlüsselte Transport- und Speicherschicht;
5. produktionsfähige Queue-/Retry-/Dead-Letter-Strategie;
6. verbindliche ACC-Kompatibilität und Contract-Deployment-Strategie;
7. KI-Provider-, Datenschutz-, Kosten-, Risiko- und Human-Oversight-Freigabe;
8. Observability, Incident Response, Backup und Restore;
9. Last-, Security-, Penetrations- und Datenschutzprüfung;
10. Deployment- und Rollback-Freigabe.
