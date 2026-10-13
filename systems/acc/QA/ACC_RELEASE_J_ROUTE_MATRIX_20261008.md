# ACC Release J – Operational Learning Route Matrix

**Stand:** 08.10.2026  
**Status:** lokal grün · ausschließlich synthetische Daten

| Route | Methode | Tenant | Rolle | Fuzz | Concurrency | Idempotenz | Failure Injection | Ergebnis |
|---|---|---|---|---|---|---|---|---|
| `/api/learning/v1/bootstrap` | GET | erzwungen | Operations | bestanden | n/a | n/a | bestanden | Lernlage, Feedback, Evaluation, Versionen |
| `/api/learning/v1/versions` | GET | erzwungen | Operations | bestanden | n/a | n/a | bestanden | Policy-/Capability-Lineage |
| `/api/learning/v1/feedback/{id}` | GET | erzwungen | Operations | bestanden | n/a | n/a | bestanden | Feedback und Outcome lesen |
| `/api/learning/v1/feedback` | POST | erzwungen | Operations | bestanden | bestanden | bestanden | strukturiertes Feedback erzeugen |
| `/api/learning/v1/feedback/{id}` | PATCH | erzwungen | Operations | bestanden | 1 Gewinner / 1 Konflikt | bestanden | bestanden | Outcome versioniert zuordnen |
| `/api/learning/v1/evaluations` | POST | erzwungen | Operations | bestanden | bestanden | bestanden | 24 Fixtures deterministisch bewerten |
| `/api/learning/v1/evaluations/{id}` | GET | erzwungen | Operations | bestanden | n/a | n/a | bestanden | Evaluationslauf lesen |
| `/api/learning/v1/comparisons` | POST | erzwungen | Operations | bestanden | bestanden | bestanden | Qualitäts-/Outcome-/Policy-Vergleich |
| `/api/learning/v1/comparisons/{id}` | GET | erzwungen | Operations | bestanden | n/a | n/a | bestanden | Vergleich lesen |
| `/api/learning/v1/versions/{id}/decisions` | POST | erzwungen | Operations | bestanden | 1 Gewinner / 1 Konflikt | bestanden | bestanden | Kandidat fachlich prüfen, nicht aktivieren |

Die ausführbare Gate-02A-Registry umfasst mit Release J insgesamt **51 API-Routen** und **29 Mutationen**. Für alle geschützten Routen gilt: fehlende Session `401`; unzulässige Arbeitgeberrolle `403 role_scope_denied`; tenantfremde Ressourcen `404`; Mutationen ohne Idempotency Key `400`; kontrollierte Fehlerzustände bleiben ohne Teilmutation und Außenwirkung.

