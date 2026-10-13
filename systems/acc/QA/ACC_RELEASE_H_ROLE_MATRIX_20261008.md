# ACC Release H – ausführbare Rollenmatrix

**Datum:** 08.10.2026  
**Testquelle:** `QA/release-h-role-contract.test.mjs` und `QA/release-h-browser-check.js`

| Rolle | projizierte Fälle | sichtbare Journey | zulässige lokale Aktion | verbotene Direktaufrufe |
|---|---:|---|---|---|
| AMAVIO Operations | 5 | Evidenz → Verantwortung → Simulation → Entscheidung → Arbeitsprodukt | vollständige lokale Fallsteuerung | produktive/externe Wirkung bleibt global gesperrt |
| Sponsor | 5, verdichtet | Statusgrundlage → Sponsor-Verantwortung → Auswirkungen → Entscheidung → Freigegebener Status | zugewiesene Sponsorentscheidung | Kernel, Provider, Simulation, Fremdaufgabe, Budgetentscheidung |
| HR Operations | 1 | Arbeitgeberbelege → HR-Aufgaben → Terminbezug → Rückfragen → Status | HR-Aufgabe und HR-Beleg | Kernel, Simulation, Standortaufgabe, Sponsor-/Budgetentscheidung |
| Standort | 2 | Standortangaben → Übergaben → Termine → Bestätigung → Status | Standortaufgabe und Standortbeleg | Kernel, Simulation, HR-/Budgetaufgabe, Sponsorentscheidung |
| Budget | 1 | Kostengrundlage → Budgetaufgabe → Auswirkung → Freigabe → Beschluss | Budgetaufgabe, Budgetbeleg und Budgetentscheidung | Kernel, Simulation, HR-/Standortaufgabe, Sponsorentscheidung |

## Negativnachweise

- Kernel-V2-Status aus Budget-/Sponsor-Sitzung: `403 role_scope_denied`.
- Simulation aus Sponsor-Sitzung: `403 role_scope_denied`.
- Standortaufgabe aus HR-Sitzung: `403 role_scope_denied`.
- Budgetentscheidung aus Sponsor-Sitzung: `403 role_scope_denied`.
- Fremdmandantenfall bleibt unabhängig von Rolle `404`.

## Aussagegrenze

Die Matrix ist ein lokaler technischer Vertrag, kein Nachweis produktiver Authentifizierung oder produktiver Mandantentrennung.

