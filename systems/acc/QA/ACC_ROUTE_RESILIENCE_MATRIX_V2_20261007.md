# ACC Route Resilience Matrix V2

**Stand:** 07.10.2026  
**Status:** Gate 02A vollständig implementiert und lokal grün nachgewiesen  
**Daten:** ausschließlich lokale synthetische Fixtures

## Testklassen

- `FZ`: Fuzzing – Typen, Längen, Enums, Datumswerte, Unicode, malformed JSON, Requestgröße;
- `CC`: Concurrency – zwei oder mehr zeitgleiche Mutationen;
- `ID`: Idempotenz – gleicher Key/gleicher Payload, gleicher Key/anderer Payload, Retry nach Verbindungsabbruch;
- `FI`: Failure Injection – Datenbank, Provider, Timeout, Antwortvalidierung, Abbruch;
- `TN`: Tenant Negatives – fremde ID, fremde Session, fehlende Session;
- `RC`: Recovery – Neustart, Transaktionsrollback, Audit- und Fallkonsistenz.

## Route Registry

| Route | Methode | Wirkung | FZ | CC | ID | FI | TN | RC | Zielstrategie |
|---|---|---|---|---|---|---|---|---|---|
| `/api/health` | GET | read | bestanden | n/a | n/a | bestanden | n/a | bestanden | keine internen Details |
| `/api/v1/bootstrap` | GET | read | bestanden | n/a | n/a | bestanden | bestanden | bestanden | serverseitiger Tenantkontext |
| `/api/v1/audit` | GET | read | bestanden | n/a | n/a | bestanden | bestanden | bestanden | tenantgebundene Lesesicht |
| `/api/v1/assistant/runs` | POST | create | bestanden | bestanden | bestanden | bestanden | bestanden | bestanden | persistenter Idempotency-Key + Fingerprint |
| `/api/v1/assistant/runs/{id}/review` | POST | update | bestanden | bestanden | bestanden | bestanden | bestanden | bestanden | Compare-and-swap + Key |
| `/api/v1/outbox/preview` | POST | create sink | bestanden | bestanden | bestanden | bestanden | bestanden | bestanden | Key + approved-run guard |
| `/api/v1/bookings/preview` | POST | create sink | bestanden | bestanden | bestanden | bestanden | bestanden | bestanden | Key + approved-run guard |
| `/api/v1.5/provider-status` | GET | read | bestanden | n/a | n/a | bestanden | bestanden | bestanden | keine Secrets/Accountdetails |
| `/api/v1.5/bootstrap` | GET | read | bestanden | n/a | n/a | bestanden | bestanden | bestanden | tenantgebundene Aggregation |
| `/api/v1.5/portfolio` | GET | read | bestanden | n/a | n/a | bestanden | bestanden | bestanden | tenantgebundene Aggregation |
| `/api/v1.5/cases/{id}` | GET | read | bestanden | n/a | n/a | bestanden | bestanden | bestanden | fremde ID ergibt 404 |
| `/api/v1.5/cases/{id}/transitions` | POST | update | bestanden | bestanden | bestanden | bestanden | bestanden | bestanden | Fallversion + Key + CAS |
| `/api/v1.5/tasks/{id}` | PATCH | update | bestanden | bestanden | bestanden | bestanden | bestanden | bestanden | Statusversion + Key + CAS |
| `/api/v1.5/evidence/{id}/review` | POST | update | bestanden | bestanden | bestanden | bestanden | bestanden | bestanden | Reviewversion + Key + CAS |
| `/api/v1.5/decisions/{id}/review` | POST | create/update | bestanden | bestanden | bestanden | bestanden | bestanden | bestanden | Status-CAS + Transaktion + Key |
| `/api/v1.5/cases/{id}/simulations` | POST | create | bestanden | bestanden | bestanden | bestanden | bestanden | bestanden | Basisversion + Key |
| `/api/v1.5/simulations/{id}/apply` | POST | multi-update | bestanden | bestanden | bestanden | bestanden | bestanden | bestanden | `BEGIN IMMEDIATE` + CAS + Key |
| `/api/v1.5/cases/{id}/work-products` | POST | create sink | bestanden | bestanden | bestanden | bestanden | bestanden | bestanden | Typprüfung + Key |
| `/api/v1.5/evaluations/runs` | POST | create | bestanden | bestanden | bestanden | bestanden | bestanden | bestanden | Fixtureversion + Key |
| `/api/v1.5/capabilities/runs` | POST | create | bestanden | bestanden | bestanden | bestanden | bestanden | bestanden | Capability-Vertrag + Key + Provider-Gate |

## Abnahmeformat

Jede als `bestanden` markierte Zelle besitzt einen reproduzierbaren Test in `QA/gate-02-assurance.test.mjs`. Für reine Leserouten sind Concurrency und Idempotenz nicht anwendbar. Fuzzing umfasst sichere Sonderzeichen-/Query-Behandlung auf Leserouten sowie für jede Mutation fehlenden Key, malformed JSON, 64-KiB-Grenze, Schema-Probe und Unicode-Probe. Exklusive Mutationen müssen bei zwei konkurrierenden Requests genau einen Gewinner und einen `409`-Konflikt liefern; reine Erzeugungsrouten dürfen zwei getrennte, gültige Objekte erzeugen.

## Abschlussnachweis Gate 02A

- 20/20 API-Routen im Registry;
- 13/13 Mutationen mit verpflichtendem, persistentem Idempotency-Key und Request-Fingerprint;
- identischer Key plus identischer Request liefert exakt die gespeicherte Antwort zurück;
- identischer Key plus anderer Request liefert `409 idempotency_conflict`;
- 7/7 Leserouten mit Query-/Unicode-Fuzzing ohne 5xx;
- 13/13 Mutationen mit malformed-, over-size-, Schema- und Unicode-Proben ohne unkontrollierten Fehler;
- 13/13 Mutationen mit Parallelitätstest; exklusive Änderungen nutzen Version, Status-CAS oder Transaktion;
- 20/20 Routen schließen bei kontrolliertem Vor-Routen-Fehler mit `503`;
- Entscheidung und Simulationsübernahme rollen bei Commit-Fehler vollständig zurück und akzeptieren danach denselben Key erneut;
- Idempotenzantwort überlebt einen Datenbank-/Serverneustart ohne Duplikat;
- Cross-Tenant-Ressourcen bleiben als `404` verborgen; fehlende Session liefert `401`;
- externer Provider bleibt geschlossen, Browser-QA erzeugt keine externen Requests.

Maschinenlesbarer Status: `QA/ACC_ROUTE_RESILIENCE_COVERAGE_20261007.json`. Vollständiger QA-Bericht: `QA/ACC_PRODUCTIZATION_GATE_02A_QA_20261007.md`.
