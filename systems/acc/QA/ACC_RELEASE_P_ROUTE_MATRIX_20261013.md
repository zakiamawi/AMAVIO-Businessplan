# Release P – Route- und Resilienzmatrix

Stand: 13.10.2026

Die bestehende Gate-02A-Matrix wurde von 75 auf 83 API-Routen erweitert. 49 mutierende Routen besitzen einen Idempotenzvertrag. Die acht neuen Reliability-Routen sind in Missing-Session-, Fuzz-, Idempotenz-, Concurrency- und Failure-Injection-Prüfungen aufgenommen.

| Route | Rolle | Idempotenz | Concurrency | Fuzz | Failure Injection |
|---|---|---|---|---|---|
| `GET /api/reliability/v1/bootstrap` | alle berechtigten lokalen Sitzungen | n/a | n/a | grün | fail closed |
| `GET /api/reliability/v1/scenarios/:id` | alle berechtigten lokalen Sitzungen | n/a | n/a | grün | fail closed |
| `GET /api/reliability/v1/work-products/:type` | alle berechtigten lokalen Sitzungen | n/a | n/a | grün | fail closed |
| `POST /api/reliability/v1/scenarios/:id/options` | Arbeitgeber · Gesamtsteuerung | deterministisch | exklusiv über Version | grün | fail closed |
| `POST /api/reliability/v1/scenarios/:id/authorize` | Arbeitgeber · Gesamtsteuerung | deterministisch | exklusiv über Version | grün | fail closed |
| `POST /api/reliability/v1/scenarios/:id/complete` | AMAVIO Operations | deterministisch | exklusiv über Version | grün | fail closed |
| `POST /api/reliability/v1/scenarios/:id/outcomes` | Arbeitgeber · Gesamtsteuerung | deterministisch | genau eine Rückmeldung | grün | fail closed |
| `POST /api/reliability/v1/reset` | AMAVIO Operations | deterministisch | wiederholbar | grün | fail closed |

Mandantentrennung: Die Reliability-Domain ist nur für das synthetische Mandat `SYN-TENANT-001` initialisiert. Ein anderes lokales Mandat erhält auf Reliability-Routen `404`, nicht die Programmdaten des Klinikverbunds Rheinland.
