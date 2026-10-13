# ACC Release I – Operations Twin Route Matrix

**Stand:** 08.10.2026  
**Status:** lokal grün · ausschließlich synthetische Daten

| Route | Methode | Tenant | Rolle | Fuzz | Concurrency | Idempotenz | Failure Injection | Ergebnis |
|---|---|---|---|---|---|---|---|---|
| `/api/twin/v1/bootstrap` | GET | erzwungen | Operations | bestanden | n/a | n/a | bestanden | Kohortenlage |
| `/api/twin/v1/events/{id}` | GET | erzwungen | Operations | bestanden | n/a | n/a | bestanden | Ereignisdetails |
| `/api/twin/v1/events/{id}/work-plans` | POST | erzwungen | Operations | bestanden | bestanden | bestanden | bestanden | Plan im Human Gate |
| `/api/twin/v1/work-plans/{id}` | GET | erzwungen | Operations | bestanden | n/a | n/a | bestanden | Plan lesen |
| `/api/twin/v1/work-plans/{id}/review` | POST | erzwungen | Operations | bestanden | 1 Gewinner / 1 Konflikt | bestanden | bestanden | advisory only |
| `/api/twin/v1/cohort-simulations` | POST | erzwungen | Operations | bestanden | bestanden | bestanden | bestanden | isolierte Vorschau |
| `/api/twin/v1/cohort-simulations/{id}` | GET | erzwungen | Operations | bestanden | n/a | n/a | bestanden | Simulation lesen |

Die bestehende ausführbare Gate-02A-Registry umfasst mit Release I insgesamt 41 API-Routen und 24 Mutationen. Für alle geschützten Routen gilt: fehlende Session `401`; unzulässige Arbeitgeberrolle `403 role_scope_denied`; tenantfremde Ressourcen `404`; alle Mutationen verlangen einen persistenten Idempotency Key.
