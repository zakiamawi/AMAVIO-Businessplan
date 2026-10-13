# Product-Owner-Entscheidungsmatrix – Production Readiness

**Stand:** 10. Oktober 2026  
**Freigegeben:** Erstellung und lokale Prüfung dieses Architektur- und Vertragspakets  
**Nicht pauschal freigegeben:** die unten noch offenen Provider-, Daten-, Rechts-, Kosten-, Betriebs- und Deploymententscheidungen

| ID | Entscheidung | Aktueller Beschluss | Vor nächster Aktivierung benötigt |
|---|---|---|---|
| PR-001 | App-Rollen | Fachkraft, Wohnanbieter, lokaler Partner | keine Erweiterung ohne neuen Rollenvertrag |
| PR-002 | ACC-Rollen in der App | verboten | bleibt im getrennten ACC |
| PR-003 | Tenant-Isolation | verpflichtend | produktive Tenant- und Organisationsadministration entwerfen |
| PR-004 | Identity Provider | nicht ausgewählt | Anbieter-, Vertrags-, Security-, MFA- und Kostenentscheidung |
| PR-005 | Reale Daten | gesperrt | Datenklassen, Zweck, Rechtsgrundlage, Notice, Speicherort, Retention, Löschung |
| PR-006 | Daten-Default | `deny_unclassified_data` | beibehalten |
| PR-007 | App-/ACC-Status | `NOT_COMPATIBLE_YET` | gemeinsamer Contract in beiden Codebasen und Consumer-driven Tests |
| PR-008 | ACC-Transport | nicht ausgewählt | Retry, Replay, Reconciliation, Queue/API, Security und Betrieb entscheiden |
| PR-009 | KI-Provider | keiner freigegeben | Datenschutz, Vertrag, Region, Retention, Security, Evaluation und Budget |
| PR-010 | KI-Autonomie | ausschließlich assistiv | Human Oversight und Nichtentscheidungsgrenze beibehalten |
| PR-011 | Matching/Scoring | verboten | nur durch neue ausdrückliche Product-, Legal- und Risikoentscheidung änderbar |
| PR-012 | Produktive Authentifizierung | gesperrt | PR-003 und PR-004 schließen |
| PR-013 | Produktive Datenbank | gesperrt | PR-005 plus Security, Backup und Betrieb schließen |
| PR-014 | Externe Kommunikation | gesperrt | konkreten Empfänger, Inhalt, Rechtsgrundlage und Versandweg freigeben |
| PR-015 | Reale Rollentests | gesperrt | Research-, Datenschutz-, Rekrutierungs-, Einwilligungs- und Testdatenprotokoll |
| PR-016 | Deployment | gesperrt | Hosting, Datenschutz, Security, Monitoring, Rollback und Releaseentscheidung |
| PR-017 | Browser-/AT-Abschluss | offen | Firefox, echter 200-Prozent-Zoom, AT-Retest und reale iOS-/Android-Geräte |

## Gesamtentscheidung

Das Architektur- und Vertragspaket ist lokal freigegeben und implementiert. Alle neun Produktivgates bleiben gegen Aktivierung geschlossen. Die Matrix verhindert, dass eine allgemeine Zustimmung zum Paket als stillschweigende Provider-, Datenschutz-, Kosten- oder Deploymentfreigabe interpretiert wird.

## Nächste zusammenhängende Entscheidungsrunde

Der nächste sinnvolle Founder-/Product-Owner-Termin sollte nicht einzelne Features behandeln, sondern drei verbindliche Beschlüsse bündeln:

1. Identity-/Tenant-Betriebsmodell und Kandidatenanforderungen;
2. Datenverantwortung, Speicher-/Aufbewahrungsmodell und Rechtsprüfung;
3. gemeinsamer App-/ACC-Contract als Aufgabe für beide getrennten Produktstränge.

Die KI-Providerentscheidung folgt erst, wenn diese drei Grundlagen stehen und ein konkreter, begrenzter Use Case eine externe KI überhaupt rechtfertigt.
