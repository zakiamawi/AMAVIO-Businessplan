# AMAVIO One CRM – C1 Entry-Gate-Register

> **Neueinordnung 10.10.2026:** Dieses Register bleibt als spätere Cloud-/Mehrbenutzergrundlage erhalten. Der unmittelbare nächste Entwicklungsweg ist R3.3 lokal-first. Die Neueinordnung steht in `CRM_C1_RECLASSIFICATION_20261010.md`; sie schließt oder aktiviert kein C1-Gate.

**Stand:** 10.10.2026  
**Arbeitsblock:** Schließen der dokumentierten C1-Entry-Gates; keine C1-Implementierung  
**Produktstatus:** Lokaler synthetischer CRM-Core-Prototyp – fachlich und technisch geprüft, nicht produktiv freigegeben

## Ergebnis in einem Satz

Der C1-Umfang ist technisch, fachlich und organisatorisch entscheidungsreif eingegrenzt. Fünf Gates sind auf Spezifikationsebene geschlossen; drei Gates bleiben bis zu einer ausdrücklichen Verantwortungs-, Kosten- beziehungsweise Datenschutz-/Vertragsbestätigung offen. Deshalb ist C1 noch nicht freigegeben und wurde nicht begonnen.

## Verbindlich enger C1-Zielumfang

C1 darf nach gesondertem Beschluss ausschließlich Folgendes aufbauen:

- genau ein getrenntes Supabase-Projekt in der spezifischen Region `eu-central-1` Frankfurt;
- ausschließlich synthetische CRM-Fachdaten der Klasse K1;
- PostgreSQL und Auth; keine Nutzung von Storage, Realtime, Edge Functions, Webhooks oder Social Login;
- lokale AMAVIO-Weboberfläche und lokale AMAVIO-Server/API während des gesamten C1-Blocks;
- kein öffentlicher Web- oder API-Endpunkt, kein DNS, kein Deployment und keine Produktionsumgebung;
- interne Testidentitäten, einladungs-/administrationsbasiert, TOTP-MFA und AAL2-Pflicht;
- serverseitige Fach- und Objektberechtigung; RLS als zweite `deny by default`-Schutzschicht;
- versionierte Migrationen, minimiertes Audit, tägliche Provider-Backups und ein dokumentierter Restore-Test;
- keine realen CRM-Kontakte, kein Import, keine Dokumentdateien, keine CRM-Kommunikation, keine ACC-/App-Anbindung und keine produktive KI.

Der Supabase-Organisationszugang, Abrechnungskontakt und benannte Administratoren sind notwendige Anbieter-Verwaltungsdaten, aber keine CRM-Fachdaten. Ihre Verarbeitung muss vor Konto-/Projektanlage ausdrücklich als Provider-Governance akzeptiert sein.

## Gate-Status

| ID | Gate | Nachweis in diesem Paket | Zustand | Wirkung |
|---|---|---|---|---|
| C1-EG-01 | Scope und Produktgrenze | dieses Register; C0-ADR; Negativumfang | **geschlossen** | C1 darf nur die enge synthetische Plattformgrundlage betreffen. |
| C1-EG-02 | Architektur, Umgebung und Exit | `CRM_C1_ENVIRONMENT_SECRET_AND_EXIT_STRATEGY_20261010.md` | **geschlossen auf Spezifikationsebene** | Ein Managed-Staging ist planbar; keine Provisionierung erlaubt. |
| C1-EG-03 | Security und Bedrohungsmodell | `CRM_C1_SECURITY_AND_THREAT_MODEL_DRAFT_20261010.md` | **geschlossen auf Spezifikationsebene** | Kontrollen und Abnahmekriterien sind definiert; Wirksamkeitsnachweis entsteht erst in C1. |
| C1-EG-04 | Rollen-, API- und RLS-Vertrag | `CRM_C1_AUTHORIZATION_AND_RLS_TEST_MATRIX_20261010.md` | **geschlossen auf Spezifikationsebene** | Erlaubte/abzuweisende Zugriffe sind prüfbar definiert. |
| C1-EG-05 | Backup, Restore, RPO/RTO | `CRM_C1_BACKUP_RESTORE_RPO_RTO_DRAFT_20261010.md` | **geschlossen für synthetisches C1-Staging** | RPO 24 h, Ziel-RTO 8 Betriebsstunden; Restore-Nachweis bleibt C1-Abnahmekriterium. |
| C1-EG-06 | Anbieter, Vertrag und Datenschutz | `CRM_C1_DATA_PROTECTION_AND_PROVIDER_DUE_DILIGENCE_20261010.md` | **BLOCKER – externe Bestätigung** | Aktuelle öffentliche Evidenz ist geprüft; DPA/TIA/Subprozessoren und Provider-Verwaltungsdaten benötigen qualifizierte Prüfung/Annahme. |
| C1-EG-07 | Betrieb und Verantwortlichkeit | `CRM_C1_OPERATING_MODEL_AND_RESPONSIBILITY_MATRIX_20261010.md` | **BLOCKER – Personenzuordnung** | Rollen und Verfahren stehen; technischer Betreiber und unabhängige Prüffunktion sind noch nicht namentlich bestätigt. |
| C1-EG-08 | Kosten und Beschaffung | `CRM_C1_COST_GUARDRAIL_AND_BUDGET_DRAFT_20261010.md` | **BLOCKER – Budgetbeschluss** | Pro ist Planungsbasis; Kostenlimit und Beauftragung sind nicht genehmigt. |
| C1-EG-09 | Gesonderter Product-Owner-Beschluss | `CRM_C1_RELEASE_DECISION_DRAFT_20261010.md` | **offen bis EG-06–08 geschlossen sind** | Ohne ausgefüllten Beschluss keine Konto-, Projekt- oder Implementierungsaktivität. |

## Was „geschlossen auf Spezifikationsebene“ bedeutet

Ein geschlossenes Spezifikationsgate bedeutet, dass Ziel, Grenzen, Kontrollen, negative Tests und Abnahmeevidenz vollständig genug definiert sind, um einen engen C1-Auftrag zu erteilen. Es behauptet nicht, dass diese Kontrollen bereits implementiert, sicherheitsgeprüft oder produktiv wirksam sind.

## Was vor C1 noch konkret benötigt wird

1. qualifizierte Datenschutz-/Vertragsprüfung mit dokumentiertem Ergebnis für DPA, SCC/TIA, Subprozessoren, Transfer- und Supportzugriffe;
2. ausdrückliche Annahme, dass notwendige Supabase-Konto-, Abrechnungs- und Administratorinformationen als Provider-Verwaltungsdaten verarbeitet werden;
3. Benennung einer technisch verantwortlichen Person für Provisionierung, MFA, Secrets, Migrationen, Monitoring, Incident und Restore;
4. Benennung einer zweiten, unabhängigen Person für Recovery-/Admin-Freigaben oder ein dokumentierter, zeitlich befristeter Ein-Personen-Ausnahmebeschluss für das rein synthetische Staging;
5. Product-Owner-Budgetbeschluss einschließlich Plan, Währung-/Steuerpuffer und Verbot nicht genehmigter Add-ons;
6. danach ein eigener enger C1-Beschluss. Dieser Gate-Block ersetzt diesen Beschluss nicht.

## Nicht vorgenommen

- kein Anbieterlogin und keine Authentifizierung;
- keine Konto-, Organisations- oder Projektanlage;
- keine Datenbank, keine Tabellen, keine RLS-Policy und keine Nutzeranlage;
- keine E-Mail, kein Kalender, keine Cloudablage und keine Drittanbieterintegration;
- keine Änderung des R3.2-Anwendungscodes oder seiner lokalen Daten;
- kein Deployment, Upload, Git-Push oder externe Übertragung.

