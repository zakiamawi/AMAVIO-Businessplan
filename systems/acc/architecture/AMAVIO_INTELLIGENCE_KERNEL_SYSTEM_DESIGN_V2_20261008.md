# AMAVIO Intelligence Kernel V2 – Systemdesign

**Stand:** 08.10.2026  
**Scope:** lokale synthetische Konzeptdemo; keine produktive Architekturfreigabe

## Komponenten und Datenfluss

```text
Release-G-Fallreise
  ├─ Evidenz ─────────► Evidence Reconciliation ─► Klärungsauftrag ─► Human Gate
  ├─ Simulation ──────► Critical-Path Replanning ► Anpassungsvorlage ► Human Gate
  └─ Arbeitsprodukt ──► Brief Composer
                         ├─ Evidence Graph
                         ├─ Policy Engine
                         ├─ geprüfte V2-Artefakte
                         ├─ Simulation
                         └─ dokumentierte Entscheidung
                                      │
                                      ▼
                          Qualitätsrubrik + Human Gate
```

## Persistenz

`kernel_artifacts` speichert ausschließlich synthetische Artefakte mit:

- Tenant und Fall;
- Capability-/Vertragsversion;
- Basis-Fallversion und Evidence-Graph-Fingerprint;
- SHA-256-Input-Hash für reproduzierbare Ausführung;
- strukturiertem Inhalt und Qualitätsrubrik;
- Human-Gate-Status und optimistischer Review-Version.

Der eindeutige Schlüssel `(tenant, case, artifact_type, input_hash)` verhindert Duplikate. Ein positives Review bedeutet `advisory_approved`, nicht angewendet, versandt oder produktiv freigegeben.

## Capability-Verträge

### Evidence Reconciliation

Input: kanonischer Fall plus Evidence Graph. Output: Konfliktgruppen, claims je Quelle, fehlende/ungeprüfte Pflichtbelege, Klärungsfragen, Akzeptanzkriterien, Verantwortung, Frist und Zitate.

### Critical-Path Replanning

Input: kanonischer Fall, Graph und begründetes Fallereignis. Zulässig sind `arrival_date_changed`, `milestone_delayed`, `owner_unavailable` und `evidence_blocked`. Output: Vorher-/Nachher-Fristen, Abhängigkeitswirkungen, Begründung je Änderung und unveränderte Elemente. Keine automatische Anwendung.

### Arrival Readiness Brief Composer

Voraussetzungen: geprüfte Reconciliation, geprüfter Replan, dokumentierte Simulation und menschliche Entscheidung. Output: sieben Abschnitte, Quellenreferenzen, vollständige Provenienz und eine sechsteilige 100-Punkte-Rubrik. Unter 85 Punkten ist das Ergebnis nicht qualitätsfähig.

## Fehler- und Sicherheitsverhalten

- fehlende Voraussetzungen: `422 kernel_brief_prerequisites`;
- unbekanntes Ereignis oder Artefakt: fail closed;
- Cross-Tenant-Zugriff: `404`;
- paralleles Review: `409`;
- jede Mutation: Idempotency-Key, Fuzz-, Concurrency- und Failure-Injection-Vertrag;
- externe Calls, automatische Entscheidungen und Außenwirkungen: technisch `false`.

## Spätere Wiederprüfung

Produktive Identity, echte Mandantentrennung, reale Datenquellen, Retention, Verschlüsselung, Hosting, Monitoring, Notfallbetrieb und Provider-Sandbox benötigen eigene Entscheidungen und Nachweise.
