# AMAVIO Intelligence Kernel V1 – System Design

**Stand:** 07.10.2026  
**Laufzeit:** lokal, synthetisch, deterministisch  
**Kosten:** keine Providerkosten  
**Außenwirkung:** keine

## Anforderungen

### Funktional

- Fallbelege, Regeln, Aufgaben, Meilensteine und Entscheidungen als Evidence Graph verbinden;
- jede Kernel-Ausführung durch zentrale Policies prüfen;
- Fähigkeiten unabhängig vom Provider registrieren und versionieren;
- strukturierte lokale Ergebnisse mit Quellenreferenzen erzeugen;
- jedes Ergebnis unter einen expliziten Human-Gate-Vertrag stellen;
- Kernel-Verträge separat und automatisiert evaluieren;
- bestehende Release-G-Kontextanzeige versorgen, ohne neues KI-Modul.

### Nicht-funktional

- null externe Calls im Standardbetrieb;
- null Providerkosten;
- reproduzierbare Ausgabe für denselben Snapshot;
- tenantgebundener Zugriff;
- idempotente Mutationen;
- Fail-closed bei unbekannter Capability, falschem Provider, fehlender Evidenz oder fehlendem Review;
- keine automatische Personenentscheidung und keine Außenwirkung;
- bestehende Gate-02A-Resilience-Matrix bleibt für alle Kernel-Routen wirksam.

## Architektur

```text
Release-G-Fallreise
        │
        │ GET /cases/:id/context
        ▼
AMAVIO Intelligence Kernel
  ├── Evidence Graph ─────── Belege, Regeln, Aufgaben, Pfad, Entscheidungen
  ├── Policy Engine ──────── synthetisch, tenantgebunden, belegt, no-effect
  ├── Capability Registry ── vier versionierte AMAVIO-Fähigkeiten
  ├── Human Gate ─────────── pending → approved | rejected, advisory only
  ├── Evaluation Harness ─── 34 Kernel-Szenarien
  └── Provider Boundary
        ├── local ────────── aktiv, deterministisch, kostenfrei
        ├── openai ───────── Adapter implementiert, Gate geschlossen
        └── mistral ──────── Adapter implementiert, Gate geschlossen
```

## Datenfluss

### Kontext für die Fallreise

1. UI lädt den kanonischen Gate-01.5-Fall.
2. UI lädt parallel den Kernel-Kontext.
3. Evidence Graph erstellt einen Fingerprint aus dem Snapshot.
4. Policy Engine prüft die lokale Orchestrierungsfähigkeit.
5. Kernel gibt nur nächste Verantwortung, Human-Gate-Status, Briefstatus und Quellenumfang zurück.
6. Die vorhandene Kontextleiste rendert diese Daten ohne KI-Branding.
7. Bei Kernelfehler greift die vorhandene lokale Release-G-Falllogik als sicherer Fallback.

### Capability Run

1. Tenantgebundener Fall wird geladen.
2. Capability wird aus der Registry aufgelöst.
3. Evidence Graph und Policy-Entscheidung werden erzeugt.
4. Bei `deny` endet der Lauf vor dem Provider.
5. Lokaler Provider erzeugt ein strukturiertes, zitiertes Ergebnis.
6. Ergebnis, Graph-Hash, Policy-Entscheidung und Human Gate werden gemeinsam persistiert.
7. Review kann `approved` oder `rejected` setzen; Außenwirkung bleibt in beiden Fällen `false`.

## Module und Verträge

### Evidence Graph

- Vertrag: `amavio.evidence-graph.v1`
- Knotentypen: `case`, `evidence`, `task`, `milestone`, `decision`, `policy_signal`
- Kanten: `supports`, `contradicts`, `requires_review`, `advances`, `milestone_for`, `depends_on`, `required_for`, `gates`, `constrains`
- deterministischer SHA-256-Fingerprint

### Policy Engine

Zentrale Policies:

- `POL-001` nur synthetische Falldaten;
- `POL-002` mandantengebundener Kontext;
- `POL-003` Evidenzpflicht;
- `POL-004` Human Gate;
- `POL-005` keine Außenwirkung;
- `POL-006` keine automatisierte Personenentscheidung;
- `POL-007` lokaler Provider als Standard;
- `POL-008` versionierter Capability-Vertrag.

### Capability Registry

| Capability | Journey | Zweck | Provider-Port |
|---|---|---|---|
| `case.orchestrate` | Verantwortung | nächsten belegten Schritt ableiten | `summarize_evidence` |
| `evidence.resolve_conflict` | Evidenz | Konflikt erklären | `explain_conflict` |
| `simulation.explain_impact` | Simulation | Folgen erklären | `explain_simulation` |
| `brief.compose` | Arbeitsprodukt | internen Entwurf vorbereiten | `draft_work_product` |

Alle vier Fähigkeiten sind `advisory_only`, verlangen ein Human Gate und dürfen keine Personenentscheidung ausführen.

### Human Gate

- Vertrag: `amavio.human-gate.v1`
- Ausgangsstatus: `pending`
- erlaubte Entscheidungen: `approved`, `rejected`
- Begründung verpflichtend
- Approval-Semantik: `advisory_approved`
- verbotene Effekte: Nachricht, Buchung, Zahlung, Personenentscheidung, produktive Freigabe

## Speicherung

Neue Tabellen:

- `kernel_runs` für Capability, Provider, Graph-Hash, Policy, Output, Human Gate und Review-Version;
- `kernel_evaluation_runs` für versionierte Evaluationsresultate.

Die Tabellen referenzieren Tenant, Fall und synthetische Demo-Nutzer. Kernel-Mutationen laufen durch die bestehende Idempotenzschicht.

## Failure Modes

| Fehler | Verhalten |
|---|---|
| unbekannte Capability | 404, kein Provideraufruf |
| fremder Tenant | 404 |
| fehlende Evidenz | 422 |
| externer Provider | Policy `deny`, 409 |
| fehlende Review-Begründung | 400 |
| paralleles Review | genau ein Erfolg, sonst 409 |
| Kernel-Kontext im Browser nicht erreichbar | UI nutzt Release-G-Fallback |
| Providerausgabe verletzt Vertrag | fail closed |

## Skalierungs- und Produktionspunkte

V1 hat keine Produktiv-Skalierungsbehauptung. Vor realem Betrieb sind getrennt zu entscheiden: Identity, Tenant-Isolation, Verschlüsselung, Secrets, Observability, Datenklassifikation, Retention, Queueing, Rate Limits, Backups, Disaster Recovery, Provider-Routing, Kostenkontrolle und Incident Response.
