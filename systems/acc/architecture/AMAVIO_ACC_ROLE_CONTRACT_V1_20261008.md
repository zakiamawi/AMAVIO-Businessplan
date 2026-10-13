# AMAVIO ACC Role Contract V1

**Stand:** 08.10.2026  
**Geltung:** lokale synthetische Konzeptdemo Release H  
**Nicht enthalten:** produktive Authentifizierung, produktives RBAC/ABAC, reale Arbeitgeberkonten oder reale Daten

## Rollenmatrix

| Fähigkeit | AMAVIO Operations | Sponsor | HR Operations | Standort | Budget |
|---|:---:|:---:|:---:|:---:|:---:|
| rollenbezogene Fälle lesen | voll | alle im eigenen Demo-Mandat, verdichtet | nur HR-Fälle | nur Standortfälle | nur Budgetfälle |
| Rohquellen und interne Assertions | ja | nein, verdichtet | nur HR-relevant | nur Standort-relevant | nur Kosten/Budget |
| interne Fachregeln und Eventlog | ja | nein | nein | nein | nein |
| eigene Aufgabe aktualisieren | ja | nur wenn explizit zugewiesen | ja | ja | ja |
| zugewiesenen Beleg prüfen | ja | nein | ja | ja | ja |
| zugewiesene Entscheidung dokumentieren | ja | ja | nein | nein | ja |
| Simulation erzeugen/übernehmen | ja | nein | nein | nein | nein |
| Evidence Reconciliation | ja | nein | nein | nein | nein |
| Critical-Path Replanning | ja | nein | nein | nein | nein |
| internen Readiness Brief erzeugen | ja | nein | nein | nein | nein |
| Provider-/Kernelstatus und Evaluation | ja | nein | nein | nein | nein |

## Sitzungsvertrag

| Demo-Sitzung | Rolle | Mandant | Zweck |
|---|---|---|---|
| `demo-session-operations` | `operations` | `SYN-TENANT-001` | vollständige interne Fallsteuerung |
| `demo-session-employer-sponsor` | `employer_sponsor` | `SYN-TENANT-001` | Sponsor- und Eskalationssicht |
| `demo-session-employer-hr` | `employer_hr` | `SYN-TENANT-001` | HR-Aufgaben und HR-Belege |
| `demo-session-employer-location` | `employer_location` | `SYN-TENANT-001` | Standort-/Übergabeverantwortung |
| `demo-session-employer-budget` | `employer_budget` | `SYN-TENANT-001` | Kosten- und Budgetentscheidung |

`demo-session-alpha` bleibt ausschließlich als rückwärtskompatibler Alias für lokale AMAVIO-Operations-Tests erhalten. Keine Zeichenfolge ist ein produktives Token oder Authentifizierungsartefakt.

## Projektion

Die Projektion entfernt nicht nur Bedienelemente. Sie minimiert die Serverantwort:

- `rules`, `events`, interne Abhängigkeiten und ungeprüfte Arbeitsprodukte werden für Arbeitgeberrollen nicht ausgeliefert;
- Aufgaben, Evidenz und Entscheidungen werden nach Rollenbezug gefiltert;
- Sponsorquellen werden auf Status und Abweichung verdichtet;
- `allowedActions` wird aus dem Rollenvertrag abgeleitet und steuert die sichtbare Journey;
- eine nicht sichtbare Ressource liefert eine neutrale `404`-Antwort; eine verbotene Aktion liefert `403 role_scope_denied`.

## Fail-closed-Regeln

1. Unbekannte oder fehlende Sitzung: `401`.
2. Fall außerhalb Mandant oder Rollenprojektion: `404`.
3. Verbotene interne Route oder Fremdaktion: `403 role_scope_denied`.
4. Arbeitgebermutation ohne aktuelle Version/Notiz/Idempotenz: bestehende `409`-, `428`- und Validierungsverträge bleiben bestehen.
5. Kein Arbeitgeberaufruf kann Kernel, Provider, Simulation, Evaluation, Messaging, Buchung oder externe Wirkung öffnen.

## Produktionslücke

Release H beweist Produkt- und Autorisierungslogik gegen synthetische Fixtures. Vor Produktion fehlen weiterhin mindestens: verifizierte Identity, sichere Sitzungen, Passwort-/MFA-Strategie, Provisionierung/Deprovisionierung, Mandantenmitgliedschaften, feinere Policies, Audit-Retention, Rechte-Rezertifizierung, Datenschutzkonzept, Threat Model, Hosting, Monitoring und Incident Response.

