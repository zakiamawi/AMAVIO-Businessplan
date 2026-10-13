# AMAVIO Intelligence Kernel V1 – Route- und Resilience-Matrix

**Stand:** 07.10.2026  
**Basis:** bestehende Gate-02A-Matrix mit 20 Routen  
**Erweiterung:** 6 Kernel-Routen  
**Gesamt im automatisierten Lauf:** 26 Routen, davon 16 Mutationen

| Route | Methode | Tenant | Fuzz | Idempotenz | Concurrency | Failure Injection | Wirkung |
|---|---|---:|---:|---:|---:|---:|---|
| `/api/kernel/v1/status` | GET | ja | ja | n/a | n/a | ja | read-only |
| `/api/kernel/v1/capabilities` | GET | ja | ja | n/a | n/a | ja | read-only |
| `/api/kernel/v1/cases/{caseId}/context` | GET | ja | ja | n/a | n/a | ja | read-only |
| `/api/kernel/v1/runs` | POST | ja | ja | ja | zwei unabhängige Läufe zulässig | ja | advisory only |
| `/api/kernel/v1/runs/{runId}/review` | POST | ja | ja | ja | genau ein Review erfolgreich | ja | advisory approved/rejected |
| `/api/kernel/v1/evaluations` | POST | ja | ja | ja | zwei unabhängige Läufe zulässig | ja | lokaler Nachweis |

## Zusätzliche Kernel-Grenzen

- Evidence Graph deterministisch und mit SHA-256-Fingerprint;
- externer Provider durch `POL-007` geschlossen;
- unbekannte Capability fail closed;
- Human Gate verlangt Begründung und aktuelle Review-Version;
- Cross-Tenant-Kontext, -Run und -Evaluation nicht zugänglich;
- keine Außenwirkung bei Erstellung oder Review;
- Evaluationslauf meldet null externe Calls und null externe Effekte.
