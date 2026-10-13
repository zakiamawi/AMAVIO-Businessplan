# QA – AMAVIO One CRM C1 Entry-Gate-Closure

**Datum:** 10.10.2026  
**Prüfgegenstand:** Dokumentations-, Architektur- und Entscheidungsblock vor C1  
**Ergebnis:** Gate-Paket konsistent und entscheidungsreif; C1 bleibt wegen drei offenen Freigaben im NO-GO

## Scope

Geprüft wurde ausschließlich die Vorbereitung und teilweise Schließung der C1-Entry-Gates. Es wurden keine Anwendungscodes verändert, keine Providerkonten geöffnet, keine Datenbank oder Authentifizierung aktiviert und keine Daten extern übertragen.

## Schutz und Arbeitskopie

| Stand | Pfad | Prüfung |
|---|---|---|
| geschützter R3.2-Ausgang | `20261010_AMAVIO_One_CRM_R3_2_Fachblock_Working` | 6.151 Dateien, 14 Symlinks, 300 Verzeichnisse |
| vollständige Sicherung vor Gate-Arbeit | `20261010_AMAVIO_One_CRM_R3_2_Sicherung_Pre_C1_Entry_Gates` | Datei-Hashes und Linkziele stimmen mit Ausgang überein |
| neue Arbeitskopie | `20261010_AMAVIO_One_CRM_C1_Entry_Gates_Working` | vor erster Änderung Datei-Hashes und Linkziele identisch |

Beim Kopieren meldete macOS Flag-Warnungen für bekannte `node_modules/.bin`-Symlinks. Deshalb wurden nicht nur Anzahl und Größe, sondern alle regulären Dateien per SHA-256 sowie alle Linkziele verglichen; die Bestände stimmten überein.

## Neu erstellte Dokumente

- `CRM_C1_ENTRY_GATE_REGISTER_20261010.md`
- `CRM_C1_SECURITY_AND_THREAT_MODEL_DRAFT_20261010.md`
- `CRM_C1_DATA_PROTECTION_AND_PROVIDER_DUE_DILIGENCE_20261010.md`
- `CRM_C1_OPERATING_MODEL_AND_RESPONSIBILITY_MATRIX_20261010.md`
- `CRM_C1_BACKUP_RESTORE_RPO_RTO_DRAFT_20261010.md`
- `CRM_C1_COST_GUARDRAIL_AND_BUDGET_DRAFT_20261010.md`
- `CRM_C1_ENVIRONMENT_SECRET_AND_EXIT_STRATEGY_20261010.md`
- `CRM_C1_AUTHORIZATION_AND_RLS_TEST_MATRIX_20261010.md`
- `CRM_C1_RELEASE_DECISION_DRAFT_20261010.md`
- `QA/CRM_C1_ENTRY_GATES_QA_20261010.md`

## Aktualisierte Dokumente

- `README.md`
- `CRM_STEP_C_GATE_AND_SEQUENCE_PLAN_20261010.md`
- `CRM_PRODUCT_OWNER_DECISIONS.md`
- `CRM_RELEASE_MATURITY_PLAN.md`
- `CRM_DATA_LIFECYCLE_AND_PRIVACY_DRAFT.md`
- `CRM_PERMISSIONS_AND_VISIBILITY_DRAFT.md`

## Konsistenzprüfungen

| Prüffeld | Erwartung | Ergebnis |
|---|---|---|
| Reifegrad | nur lokaler synthetischer Core, keine Produktionsbehauptung | bestanden |
| C1-Status | nicht freigegeben/nicht begonnen | bestanden |
| C2–C7 | unverändert gesperrt | bestanden |
| Produktgrenzen | CRM, App und ACC getrennt | bestanden |
| Daten | keine realen CRM-Daten | bestanden |
| Hosting | Web/API lokal; kein Deployment | bestanden |
| Provider | nur Planungspräferenz, kein Konto/Projekt/Login | bestanden |
| Auth/DB | nur Verträge/Testmatrix, keine Aktivierung | bestanden |
| Kosten | Preisbasis dokumentiert, keine Ausgabe autorisiert | bestanden |
| Datenschutz | keine Compliance-/Rechtsfreigabe behauptet | bestanden |
| Secrets | keine Werte gelesen, erzeugt oder dokumentiert | bestanden |
| Quellen | offizielle Supabase-/EU-/EDPB-Quellen, Abrufdatum angegeben | bestanden |
| lokale Dokumentreferenzen | alle in den zehn neuen Gate-Dokumenten referenzierten Markdowndateien vorhanden | bestanden |
| Secret-Musterscan | keine token-/passwortähnlichen Werte in den zehn neuen Gate-Dokumenten | bestanden |
| Runtime-/Quellintegrität | Hashgleichheit für `src/*`, Paketdateien, Vite-Konfiguration und QA-/E2E-Skripte gegenüber R3.2 | bestanden |

## Quellen-QA

Am 10.10.2026 wurden read-only geprüft:

- Supabase DPA Version 1 vom 01.08.2026;
- Data Residency and Transfers FAQ Version 1 vom 06.10.2026;
- Subprozessorenseite mit verlinkter Liste vom 01.06.2026;
- Pricing, Compute/Billing, Backups/PITR, Support Policy und SLA;
- Security, RLS, MFA, TLS/SSL, Production Checklist und Shared Responsibility;
- DSGVO Art. 28 über EUR-Lex und EDPB Guidelines 07/2020.

Zeitkritische Preis-, Vertrags- und Subprozessorenangaben müssen am tatsächlichen C1-Starttag erneut geprüft werden.

## Toolstatus

| Fähigkeit | Zustand |
|---|---|
| lokale Dateiarbeit | installiert/callable/smoke-tested in dieser Arbeitskopie |
| Webrecherche | callable; ausschließlich read-only offizielle Quellen genutzt |
| Supabase-Connector/CLI | nicht für das Projekt authentifiziert oder smoke-tested; bewusst nicht aufgerufen |
| Providerkonto | nicht vorhanden beziehungsweise nicht geprüft; kein Login |
| externe Schreibfähigkeit | nicht genutzt |

## Code- und Browser-QA

Der R3.2-Anwendungscode wurde in diesem Block nicht verändert. Die zuvor bestandenen Build-, Logik-, E2E-, Browser-, Keyboard-, Zoom- und Accessibility-Ergebnisse bleiben als R3.2-Evidenz referenziert. Ein erneuter Browserlauf wäre für reine Markdown-Ergänzungen ohne UI-/Runtimeänderung keine zusätzliche Wirksamkeitsevidenz. C1-spezifische technische Tests können erst nach dem gesonderten C1-Beschluss ausgeführt werden.

## Gate-Ergebnis

- **geschlossen:** Scope/Produktgrenze;
- **geschlossen auf Spezifikationsebene:** Architektur/Umgebung/Exit, Threat Model, Rollen/API/RLS;
- **geschlossen für synthetisches C1-Staging:** RPO/RTO-/Restore-Zielvertrag;
- **offen/BLOCKER:** qualifizierte Provider-/Datenschutzannahme, personelle Betriebs-/Prüfverantwortung, Budget-/Beschaffungsentscheidung;
- **nicht erteilt:** gesonderter C1-Product-Owner-Beschluss.

## Abschlussurteil

Das Paket erfüllt den beauftragten nächsten Block, indem es die C1-Entry-Gates nicht mit Implementierungsannahmen vermischt, die intern entscheidbaren Verträge schließt und externe beziehungsweise personenbezogene Freigaben sichtbar offen lässt. C1 darf noch nicht beginnen.

