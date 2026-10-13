# AMAVIO One CRM – C0 Plattformvergleich

**Stand:** 10.10.2026  
**Entscheidungsart:** fachliche und technische C0-Planungsentscheidung; keine Beschaffung, Einrichtung oder Integration  
**Reifegrad:** Lokaler synthetischer CRM-Core-Prototyp – fachlich und technisch geprüft, nicht produktiv freigegeben

## Zweck und Grenzen

Dieser Vergleich beantwortet ausschließlich, welche Plattformgrundlage für einen später separat freizugebenden C1-Block am besten zum aktuellen AMAVIO One CRM passt. Er aktiviert keine Datenbank, Authentifizierung, Cloud, echte Identität oder reale Daten. Preise und Vertragslagen sind vor einer Beauftragung erneut zu prüfen.

## Bewertungsmaßstab

- möglichst kleiner Betriebs- und Integrationsaufwand für ein zunächst internes Single-Workspace-CRM;
- PostgreSQL als portabler fachlicher Kern;
- ausdrückliche EU-/Deutschland-Region;
- Authentifizierung mit MFA und einladungsbasierter Nutzeranlage;
- serverseitig durchsetzbare Rollen plus zusätzliche Datenbankrichtlinien;
- Backup-/Restore-Fähigkeit;
- nachvollziehbare Kosten und geringe Anbieterbindung;
- keine technische Vermischung mit ACC oder AMAVIO One App.

## Vergleich

| Variante | Stärken | Risiken / Aufwand | C0-Urteil |
|---|---|---|---|
| **A – Supabase Managed Platform, spezifische Region `eu-central-1` Frankfurt** | vollwertiges PostgreSQL, integrierte Authentifizierung, MFA, Row-Level-Security, tägliche Backups; geringe Zahl eigener Betriebsbausteine; schneller Weg zu synthetischem Staging | DPA, Unterauftragsverarbeiter und begrenzte Verarbeitung außerhalb der gewählten Region müssen rechtlich geprüft werden; PITR ist kostenpflichtig; direkter Browserzugriff wäre für AMAVIO zu offen und wird daher nicht als Zielarchitektur akzeptiert | **für C1-Planung ausgewählt**, sofern Vertrags-, Datenschutz-, Kosten- und Security-Gates vor Provisionierung geschlossen werden |
| **B – AWS Frankfurt: RDS PostgreSQL + Cognito + eigener API-Dienst** | sehr fein steuerbare Infrastruktur, Verschlüsselung, Backups/PITR, ausgereifte Identitäts- und MFA-Funktionen, Region Frankfurt | höherer Architektur-, Konfigurations-, Kosten- und Betriebsaufwand; mehr Dienste und Fehlkonfigurationsfläche; für den aktuellen kleinen internen CRM-Scope überdimensioniert | **qualifizierte Rückfalloption**, falls Supabase-Vertrags- oder Security-Prüfung scheitert |
| **C – Hetzner Deutschland + selbst betriebene PostgreSQL-/Keycloak-Plattform** | deutsche Standorte, hohe Kontrolle, potenziell niedrige Infrastrukturkosten, offene Komponenten | AMAVIO müsste Patchen, Hardening, Hochverfügbarkeit, Monitoring, Backup-/Restore, Keycloak- und Datenbankbetrieb selbst verantworten; Betriebsreife derzeit nicht belegt | **nicht für C1 empfohlen**; erst bei klarer DevOps-Verantwortung und Betriebsbudget erneut bewerten |

## Beschlossene C0-Präferenz

Für die spätere C1-Planung wird **Variante A – Supabase in der spezifischen AWS-Region `eu-central-1` Frankfurt** bevorzugt. Dabei gelten verbindlich folgende Einschränkungen:

1. Browserzugriffe schreiben nicht direkt in kanonische CRM-Tabellen. Eine AMAVIO-eigene serverseitige API-/Service-Grenze prüft Eingaben, Rollen und Statusübergänge.
2. Row-Level-Security wird zusätzlich und standardmäßig restriktiv eingesetzt; sie ersetzt nicht die serverseitige Geschäftslogik.
3. Authentifizierung ist nur einladungsbasiert; Selbstregistrierung, Social Login und externe Partnerkonten bleiben deaktiviert.
4. TOTP-MFA wird für alle internen Nutzer verbindlich; privilegierte Rollen erhalten keine Ausnahme.
5. `eu-central-1` wird ausdrücklich gewählt. Eine allgemeine Regionengruppe reicht nicht aus.
6. C1 startet ausschließlich als getrenntes synthetisches Staging. Eine Produktionsumgebung wird nicht automatisch mit angelegt.
7. Supabase Storage, Realtime, Edge Functions, externe Webhooks und Social Provider bleiben deaktiviert, solange kein eigener Einzelbeschluss vorliegt.
8. ACC und App erhalten weder gemeinsame Tabellen noch Service-Schlüssel. Spätere Übergaben erfolgen ausschließlich über versionierte Minimalverträge.

## Noch offene Gate-Evidenz vor C1

- aktueller AVV/DPA, Unterauftragsverarbeiterliste und Transferbewertung;
- technische und organisatorische Maßnahmen sowie Verantwortlichkeiten;
- bestätigter Kostenrahmen für Plan, Compute, Backups, Logs und mögliche PITR-Option;
- Verantwortlicher für Administration, Incident-Reaktion, Restore und Nutzerfreigaben;
- C1-Bedrohungsmodell und überprüfbare RLS-/API-Autorisierungstests;
- RPO/RTO-Ziele; für synthetisches Staging genügt kein stillschweigender Produktdefault;
- Secret- und Schlüsselverwaltung außerhalb des Repositorys;
- Exit-/Datenexportstrategie für PostgreSQL-Schema und Auth-Identitäten.

## Offizielle Quellen

- Supabase dokumentiert spezifische Regionen einschließlich Frankfurt und weist darauf hin, dass die Regionswahl ein Datenstandort-Steuerelement, aber kein Compliance-Nachweis ist: [Available regions](https://supabase.com/docs/guides/platform/regions).
- Supabase beschreibt, dass Kern-Datenbank, Auth und Backups in der gewählten Region liegen, aber bestimmte Verarbeitung außerhalb möglich bleibt: [Data Residency and Transfers FAQ](https://supabase.com/legal/privacy-resources/data-residency-and-transfers-faq).
- PostgreSQL, RLS, tägliche Backups und optionales PITR sind in der Plattformdokumentation beschrieben: [Database overview](https://supabase.com/docs/guides/database/overview), [Database backups](https://supabase.com/docs/guides/platform/backups).
- MFA und dessen Durchsetzung über Auth, API und RLS sind beschrieben: [Supabase Auth MFA](https://supabase.com/docs/guides/auth/auth-mfa).
- AWS führt Frankfurt als `eu-central-1`: [AWS Regions](https://docs.aws.amazon.com/global-infrastructure/latest/regions/aws-regions.html).
- AWS RDS beschreibt verschlüsselte Instanzen, Logs, Backups und Snapshots sowie Point-in-Time-Recovery: [RDS encryption](https://docs.aws.amazon.com/AmazonRDS/latest/UserGuide/Overview.Encryption.html), [RDS backup and restore](https://docs.aws.amazon.com/AmazonRDS/latest/gettingstartedguide/managing-backup-restore.html).
- AWS Cognito dokumentiert MFA und User-Pool-Sicherheitsfunktionen: [Cognito security features](https://docs.aws.amazon.com/cognito/latest/developerguide/managing-security.html).
- Hetzner dokumentiert deutsche Rechenzentrumsstandorte; Keycloak unterstützt rollen- und gruppenbasierte Zuordnung: [Hetzner locations](https://docs.hetzner.com/cloud/general/locations/), [Keycloak Server Administration](https://www.keycloak.org/docs/latest/server_admin/index.html).

## Keine Compliance-Behauptung

Die Auswahl einer Frankfurter Region, MFA, RLS oder eines AVV macht das CRM nicht automatisch datenschutzkonform, sicherheitsgeprüft oder produktionsbereit. Diese C0-Entscheidung beschreibt nur die bevorzugte Architektur unter fortbestehenden Gates.

## Fortschreibung durch C1-Entry-Gate-Prüfung 10.10.2026

Aktuelle öffentliche Supabase-Unterlagen wurden erneut geprüft. Das DPA ist Version 1 vom 01.08.2026; die Data-Residency-/Transfer-FAQ ist Version 1 vom 06.10.2026; die verlinkte Subprozessorenliste trägt den Stand 01.06.2026. Der Provider stellt ausdrücklich klar, dass Kern-Datenbank, Auth und Backups in der gewählten Region liegen, aber Account-/Billingdaten, Supportzugriffe und Telemetrie/Logs außerhalb verarbeitet werden können. Die qualifizierte Transfer- und Vertragsannahme bleibt daher ein Gate.

Für das enge C1 wird Supabase Pro mit genau einem Micro-Projekt als Kostenbasis vorgeschlagen. Die aktuelle öffentliche Basis beginnt bei 25 USD/Monat, enthält tägliche Backups mit sieben Tagen Aufbewahrung und keine Uptime-SLA. PITR, Log Drains, Custom Domain, Team/Enterprise und weitere Projekte bleiben gesperrt. Der Product Owner hat dieses Budget noch nicht freigegeben. Details: `CRM_C1_DATA_PROTECTION_AND_PROVIDER_DUE_DILIGENCE_20261010.md` und `CRM_C1_COST_GUARDRAIL_AND_BUDGET_DRAFT_20261010.md`.
