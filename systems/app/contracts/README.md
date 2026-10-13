# AMAVIO One – Contract Package

Die Verträge beschreiben die lokale synthetische Fachgrundlage und die Voraussetzungen für eine spätere Produktivarchitektur. Sie aktivieren keine produktive Identität, keine echten Daten, keine ACC-Live-Verbindung, keine CRM-Integration und keinen externen KI-Provider.

## Gemeinsames Prinzip

Gemeinsame fachliche Verträge und gemeinsame synthetische Wahrheit – aber getrennte Produkte, getrennte Rollen, getrennte Oberflächen und getrennte Codebasen.

## Arrival- und ACC-Basis

| Vertrag | Zweck |
|---|---|
| `app-acc-interface-contract.v1.json` | lokaler App-Envelope, Richtungen, Idempotenz, Korrelation und Negativrechte |
| `status-mapping.v1.json` | explizite Übersetzung ohne gemeinsame flache Statusmaschine |
| `synthetic-arrival-integration-fixture.v1.json` | gemeinsamer synthetischer Fall und Störklassen |

## Production-Readiness-Verträge

| Vertrag | Status und Zweck |
|---|---|
| `identity-tenant-rights.v1.json` | Rollen-, Tenant-, Objekt-, Zweck- und Negativrechte; kein Identity Provider ausgewählt |
| `data-governance.v1.json` | Datenklassen, Default-Deny, Pflichtkontrollen und offene Rechts-/Aufbewahrungsentscheidungen |
| `ai-human-oversight.v1.json` | assistive Zwecke, verbotene Entscheidungen, Provider- und Human-Gate-Bedingungen |
| `app-acc-compatibility-profile.v1.json` | Pflichtprofil für einen späteren kompatiblen ACC-Peer |
| `production-readiness-gates.v1.json` | neun weiterhin geschlossene Produktivgates |

## Drei-System-Verträge

| Vertrag | Status und Zweck |
|---|---|
| `system-ownership-registry.v1.json` | Zuständigkeiten von App, ACC und CRM; getrennte Produkte, Codebasen, Rollen und Speicher |
| `identity-authority-boundaries.v1.json` | produktbezogene Identitäten und Rollen; keine Sitzungsföderation oder Rollenwiederverwendung |
| `data-system-of-record.v1.json` | genau ein führendes System je Objektklasse und Regeln für Referenzen/Projektionen |
| `crm-acc-handoff-profile.v1.json` | bestehender CRM-Fachvertrag als lokaler Prüfmarker; keine technische ACC-Integration |

## Ausführbare Referenz

`server/readiness-policy.mjs` prüft lokal:

- externe App-Rolle statt ACC-Rolle;
- Tenant- und Rollenübereinstimmung;
- synthetische Datenbegrenzung;
- zulässige Rollenaktion;
- Assistenzzweck, Datenklasse, Provider und Autonomie;
- App-/ACC-Peerprofil;
- aktuellen Readiness-Status.
- Drei-System-Zuständigkeiten und verbotene Direktwege.

Die Referenz ist kein produktiver Authorization Server und keine Rechts- oder Datenschutzfreigabe.

## Aktuelle ACC-Kompatibilität

Der read-only Audit gegen `20261010_AMAVIO_ACC_Release_J_5_Dual_Sided_Workflow_Working` ergibt weiterhin **NOT_COMPATIBLE_YET**. J.5 ergänzt einen belastbaren Arbeitgeber-/Operations-Beitragsprozess, ist aber kein App-Consumer und kein App-Sender für den Vertrag `1.1.0-local-r2-foundation`. Die Audit-Evidenz liegt unter `QA/APP_ACC_COMPATIBILITY_AUDIT_20261010.*`.

Das CRM wurde read-only gegen `20261010_AMAVIO_One_CRM_R3_4_Founder_Decision_Working` abgegrenzt. Dessen bestehender ACC-Handoff bleibt ein lokaler, payloadfreier Review-Marker. Ein direkter App-/CRM-Weg ist vertraglich ausgeschlossen.
