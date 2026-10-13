# AMAVIO Intelligence Kernel V2 – Route- und Resilience-Matrix

**Stand:** 08.10.2026  
**Gesamt:** 34 API-Routen, davon 21 Mutationen  
**V2-Erweiterung:** 8 Routen, davon 5 Mutationen

| Route | Methode | Tenant | Fuzz | Idempotenz | Concurrency | Failure Injection | Wirkung |
|---|---|---:|---:|---:|---:|---:|---|
| `/api/kernel/v2/status` | GET | ja | ja | n/a | n/a | ja | read-only |
| `/api/kernel/v2/brief-rubric` | GET | ja | ja | n/a | n/a | ja | read-only |
| `/api/kernel/v2/artifacts/{id}` | GET | ja | ja | n/a | n/a | ja | read-only |
| `/api/kernel/v2/cases/{caseId}/evidence-reconciliations` | POST | ja | ja | ja | reproduzierbar | ja | advisory only |
| `/api/kernel/v2/cases/{caseId}/replans` | POST | ja | ja | ja | reproduzierbar | ja | advisory only |
| `/api/kernel/v2/cases/{caseId}/readiness-briefs` | POST | ja | ja | ja | reproduzierbar | ja | internal draft |
| `/api/kernel/v2/artifacts/{id}/review` | POST | ja | ja | ja | genau ein Review | ja | advisory approved/rejected |
| `/api/kernel/v2/evaluations` | POST | ja | ja | ja | unabhängige Läufe | ja | lokaler Nachweis |

Alle V1-, Gate-01- und Gate-01.5-Routen bleiben in derselben automatisierten Registry enthalten. Jeder V2-Pfad ist Teil der Session-, Tenant-, Request-Limit-, Idempotenz-, Unicode-, malformed-JSON-, Concurrency- und Failure-Injection-Prüfung.
