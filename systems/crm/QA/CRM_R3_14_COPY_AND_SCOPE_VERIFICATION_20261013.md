# R3.14 – Sicherungs- und Scope-Nachweis

**Datum:** 13.10.2026  
**Quelle:** `20261013_AMAVIO_One_CRM_R3_13_C1_Decision_Closure_Working`

## Sicherung und Arbeitskopie

- Sicherung: `20261013_AMAVIO_One_CRM_R3_13_Sicherung_Pre_R3_14_C1_External_Review_Readiness`
- Arbeitskopie: `20261013_AMAVIO_One_CRM_R3_14_C1_External_Review_Readiness_Working`
- Quell-, Daten-, QA- und Konfigurationsbestand: jeweils 841 relevante Dateien vor R3.14-Änderungen;
- Vergleich Quelle/Sicherung: ohne Abweichung für alle relevanten Dateien;
- `node_modules`, `dist` und `test-results` sind reproduzierbare Abhängigkeits-/Buildartefakte und wurden nicht dupliziert;
- die Arbeitskopie verwendet ausschließlich für lokale Tests einen Symlink auf das unveränderte R3.13-`node_modules`;
- ein wegen rekursiver `.bin`-Symlinks abgebrochener erster Kopierversuch wurde unter `_Technische_Kopierprotokolle/20261013_R3_14_Erster_Kopierversuch_unvollstaendig` archiviert und nicht gelöscht.

## Scope

Geändert werden nur Governance-Wahrheitsstatus, C1-Prüf-/Entscheidungsunterlagen, sichtbare Statushinweise, Versions-/Portkennzeichnung und dazugehörige Tests. Fachobjekte, synthetische Beispieldaten, Pipeline, Arbeitsjournal, Growth-Core, Suche, Filter, Auswertungen, lokale Persistenz, App-/ACC-Grenzen und Versandblocker bleiben erhalten.

Keine externe Übertragung, Provideraktion, Anmeldung, Bestellung, Veröffentlichung, Bereitstellung oder Nutzung realer CRM-Daten ist Teil dieses Blocks.
