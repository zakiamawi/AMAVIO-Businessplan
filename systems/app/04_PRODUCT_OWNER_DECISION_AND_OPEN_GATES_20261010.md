# Product-Owner-Entscheidung und offene Gates

**Stand:** 10. Oktober 2026  
**Entscheidungsobjekt:** V2.4 Final Product Candidate & R2 Foundation

## In diesem Paket entschieden und umgesetzt

| ID | Entscheidung | Status |
|---|---|---|
| R2-001 | neue datierte Arbeitskopie; Ausgangsfassung unverändert | UMGESETZT |
| R2-002 | drei externe App-Rollen bleiben hart getrennt | UMGESETZT |
| R2-003 | ACC bleibt getrenntes Produkt und getrennte Codebasis | UMGESETZT |
| R2-004 | lokales synthetisches Backend und SQLite-Persistenz | UMGESETZT |
| R2-005 | Revision, Idempotenz, Ereignis- und Auditspur | UMGESETZT |
| R2-006 | technische App-seitige ACC-Vertragsgrenze | UMGESETZT |
| R2-007 | vollständiger synthetischer 44-Schritte-Vertragstest | UMGESETZT |
| R2-008 | lokale erklärende Assistenz mit `decision_effect = 0` | UMGESETZT |
| R2-009 | externe KI, Matching, Scoring und Entscheidungen standardmäßig blockiert | UMGESETZT |
| R2-010 | Brand- und Experience-Grundsystem bewahren | UMGESETZT |
| R2-011 | Gesamtgate mit transparenten Browsergrenzen | UMGESETZT |

## Noch nicht zur Freigabe vorliegend

| Gate | Benötigte Entscheidung oder Evidenz | Bis dahin |
|---|---|---|
| G-R2-AUTH | Identity Provider, Rollenrechte, Tenants, Sessions und Recovery | keine produktive Authentifizierung |
| G-R2-DATA | reale Datenklassen, Zweck, Rechtsgrundlage, Speicherort, Löschung und Migration | nur synthetische Daten |
| G-R2-ACC-LIVE | gemeinsamer Contract-Review mit dem getrennten ACC und Live-Transportdesign | keine ACC-Live-Kopplung |
| G-R2-AI-PROVIDER | Use Cases, Provider, AVV/DPA, Datenregion, Retention, Kosten, Evaluation und Human Oversight | nur lokale deterministische Assistenz |
| G-R2-SECURITY | Threat Model, Secrets, Verschlüsselung, Security Test und Incident Response | keine Produktionsumgebung |
| G-R2-ACCESSIBILITY | Firefox, 200-Prozent-Zoom, AT-Retest und reale Geräte | kein vollständiges G3.2-Closure |
| G-R2-ROLE-RESEARCH | Research-, Datenschutz-, Rekrutierungs-, Einwilligungs- und Testdatenprotokoll | keine realen Rollentests |
| G-R2-RELEASE | Hosting, Datenschutz, Betrieb, Monitoring, Rollback und externe Freigabe | kein Deployment oder Release |

## Empfohlene nächste große Phase

Nicht weitere Frontend-Kleinstfunktionen bauen. Der nächste kohärente Schritt ist ein einziges Paket **„R2 Production Readiness Architecture & Contract Closure“** mit vier gemeinsam entschiedenen Ergebnissen:

1. produktionsfähiges Identity-/Tenant-/Rechtemodell;
2. verbindliches Daten-, Datenschutz-, Aufbewahrungs- und Auditmodell;
3. gemeinsamer, codebasenübergreifender App-/ACC-Contract-Test ohne Oberflächen- oder Codevermischung;
4. KI-Provider- und Human-Oversight-Entscheidung mit klarer Kosten- und Risikogrenze.

Erst nach dieser Architekturentscheidung lohnt sich der nächste größere Implementierungsschritt. So bleibt die App nicht in einer Folge von Demo-Funktionen stecken und die späteren Produktivkomponenten müssen nicht mehrfach umgebaut werden.

## Releasebegriff

Der Name „Final Product Candidate“ bezeichnet den lokal konsolidierten Produkt- und Technikstand. Er bedeutet ausdrücklich nicht:

- produktionsbereit;
- datenschutzrechtlich abschließend freigegeben;
- extern getestet;
- mit dem ACC live verbunden;
- mit produktiver KI ausgestattet;
- deployed oder veröffentlicht.
