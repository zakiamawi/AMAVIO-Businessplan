# AMAVIO One CRM – R3.17 Einheitliche globale Suche

**Stand:** 13. Oktober 2026  
**Status CRM:** **Lokaler CRM-Prototyp mit synthetischem Core und schreibgeschützt eingebundenen Importdaten – nicht produktiv freigegeben**  
**Status Außenwirkung:** **Kein Versand, keine Cloud-Synchronisierung, keine Connector-Aktivierung und keine produktive Kontaktfreigabe**

**R3.17-Status 13.10.2026:** Die globale Suche umfasst jetzt neben dem lokalen synthetischen Core auch die bereits schreibgeschützt eingebundenen Organisationen und Kontakte. Ein Treffer führt in den bestehenden Reiter **Organisationen** oder **Kontakte** und öffnet dort dieselbe reguläre Detailansicht wie ein Treffer aus der Bereichsliste. Ab zwei Zeichen werden höchstens sechs importierte Organisationen und sechs importierte Kontakte ergänzend abgefragt; Lade-, Fehler- und Leerezustände sind ausdrücklich gekennzeichnet. Es wurde kein neuer Pool, keine zweite Detailoberfläche, keine Übernahme in den synthetischen Core und keine Cloud-Verbindung geschaffen.

**R3.16-Status 13.10.2026:** Der in R3.15 sichtbare Pool-/Prüfbereich war eine Fehlinterpretation des gewünschten CRM-Arbeitsablaufs und wurde aus der Hauptnavigation entfernt. Die 2.242 importierten Organisationen erscheinen nun ausschließlich im bestehenden Reiter **Organisationen**; die 3.213 importierten Kontakte ausschließlich im bestehenden Reiter **Kontakte**. Beide Reiter besitzen gemeinsame Suche, Datenquellenfilter, serverseitige Pagination und normale CRM-Detailansichten. Importierte Einträge bleiben lokal, schreibgeschützt und vollständig für Outreach gesperrt. Prüfqueue, Quarantäne, Provenienz und Dublettensignale bleiben technische Hintergrundkontrollen und werden nicht als fachlicher CRM-Arbeitsbereich dargestellt.

**R3.15-Status 13.10.2026:** Die ausdrücklich freigegebene große AMAVIO-Altdatenliste ist in einer **getrennten lokalen SQLite-Staging-Datenbank** sichtbar gemacht. Der synthetische CRM-Core wurde nicht mit Echtdaten vermischt. Enthalten sind 2.242 Organisationen, 3.213 Kontaktkandidaten, 192 bestätigt aktuelle Organisationen, 166 deduplizierte bestätigt aktuelle Kontakte und 238 Beziehungen. 407 Prüfeinträge, 93 Quarantänehinweise, sechs Dublettensignale und die Quellprovenienz bleiben sichtbar. Jeder reale Kontakt besitzt `do_not_contact = 1` und `outreach_approved = 0`. Versand, Cloud-Sync, Supabase, App und ACC bleiben technisch deaktiviert. Der zweite identische Importlauf erzeugte null neue Datensätze.

**R3.14-Status 13.10.2026:** Die vier noch notwendigen C1-Fremd- und Entscheidungswege sind als vollständige Prüfpakete vorbereitet: Security Review, Vertretungsannahme/Betriebsübergabe, externe Datenschutz-/Vertragsprüfung und eindeutige Provider-/Regionsauswahl. Die aktuelle Betriebssystemprüfung meldet für die Firewall `Allow all incoming connections` und `State = 0`; sie gilt deshalb trotz früherer UI-Anzeige als beobachteter Blocker. Kein Reviewer, keine externe Freigabe, keine Providerauswahl, kein Projekt, kein Kauf und keine C1-Implementierung wurden vorweggenommen.

**R3.13-Status 13.10.2026:** PO-CRM-045 protokolliert Zaki Amawi als technischen Betreiber, Van Vardanian als benannte Vertretung, Zaki Amawi als internen Datenschutz-/Vertragsverantwortlichen, einen Budgetkorridor von 50–100 EUR brutto/Monat mit 100 EUR harter Planungsobergrenze sowie Synthetic-only. Security Review und eindeutige Supabase-/Regionsfreigabe fehlen weiterhin. Die Bildschirmsperre greift nach fünf Minuten mit sofortiger Passwortanforderung; FileVault wird als eingeschaltet angezeigt. Die Firewall-Oberfläche meldet nach Aktivierung „Aktiv“, das Legacy-CLI weiterhin `State = 0`; dieser Nachweiswiderspruch bleibt offen. C1 ist nicht autorisiert.

**R3.12-Status 13.10.2026:** Der lokal ausführbare Teil der verbleibenden G1- und C1-Eintrittsarbeit ist abgeschlossen: Herkunftsschutz für ändernde API-Aufrufe, restriktive Browser-Schutzheader, eigentümergebundene SQLite-/Exportrechte, ein offizielles G1-03-Quellendossier, Geräte- und Betriebsevidenz sowie aktualisierte C1-Provider-/Kosten- und G1-10-Entscheidungsunterlagen. Die macOS-Firewall wurde read-only als deaktiviert beobachtet; Datenträgerverschlüsselung und Sperrzeit sind nicht verifiziert. Deshalb bleiben G1-03, G1-06, G1-10 und C1 gesperrt.

**R3.11-Status 13.10.2026:** Die Empfehlungen für G1-01, G1-05, G1-07 und G1-09 sind unter `PO-CRM-043` als lokale Product-Owner-Arbeitsbeschlüsse protokolliert und im synthetischen Core angeglichen. Die Oberfläche trennt nun lokale Nachweise, Fachbeschlüsse und offene Fremdnachweise. G1-03, G1-06 und G1-10 bleiben gesperrt; Echtdaten, Import, Versand, C1 und externe Verbindungen bleiben deaktiviert.

**R3.10-Status 13.10.2026:** G1-07 besitzt eine tatsächlich ausführbare isolierte Wiederherstellungsprobe: Der synthetische v7-Zustand wird in einer temporären SQLite-In-Memory-Datenbank geschrieben, gelesen, validiert und per Prüfsumme verglichen. Der laufende Zustand bleibt unverändert.

**R3.9-Status 13.10.2026:** Die gewachsene Informationsarchitektur wurde vollständig auf echte Doppelungen geprüft. „Daten & Sicherung“ ist nicht mehr gleichzeitig Hauptbereich und Unterregister von „Research & Outreach“, sondern als eigenständiger Bereich **„System & Freigaben“** geführt. Growth-Arbeit, lokale Sicherung und G1-Governance besitzen nun eindeutige Seitenzwecke. Arbeitstag, Cockpit, Pipeline und Auswertungen bleiben bewusst getrennt, weil sie verschiedene Entscheidungen unterstützen. Datenmodell und v7-Persistenzvertrag wurden nicht verändert.

**R3.8-Status 13.10.2026:** G1-03 und G1-06 sind bis an ihre realen Freigabegrenzen geführt. Sieben Quellen-/Zweck-/Kanalpfade, vier Informationspflicht-Bausteine und neun Zugriffsschutzkontrollen trennen lokale Evidenz von externer Rechts-, Geräte- und Security-Freigabe. Sechs auditierbare Prüfungen bestätigen sowohl die lokalen Verträge als auch die verbleibenden Sperren. G1 bleibt NO-GO.

**R3.7-Status 13.10.2026:** Das G1-Entry-Gate-Closure-Paket ist lokal-synthetisch umgesetzt. Zehn Gates unterscheiden lokal belegte, entscheidungsreife, externe, technische und Product-Owner-Blocker. Datenklassen, Ausschlüsse, Fristen, Import/Quarantäne, Betroffenenanfragen, Incident-Ablauf und Nachweisverantwortung sind vorbereitet.

**R3.6-Status 13.10.2026:** `Mein Arbeitstag`, `Cockpit` und `Pipeline` besitzen getrennte Zwecke und Oberflächen. Die Auswertungen zeigen Diagramme aus dem tatsächlichen lokalen Zustand und trennen interne Analyse von einer bereinigten, noch nicht extern freigegebenen Berichtsansicht. Sichtbare Entwicklungs- und Assistenzinformationen wurden aus den regulären Arbeitsflächen entfernt. G1 Real-Data Readiness wurde als Entry-Gate-Register begonnen.

**R3.5-Status 12.10.2026:** Kontaktbezogene Entscheidung „Darf kontaktiert werden?“, kombinierter Outreach-Preflight, ableitbare Operational-Readiness-Signale und die deduplizierte Umwandlung offener Prüfpunkte in lokale Aufgaben sind umgesetzt. Reale Daten, rechtliche Einzelfallfreigabe, Live Research, Provider und Versand bleiben gesperrt.

**R3.4-Status 10.10.2026:** `Mein Arbeitstag`, Founder Focus, Decision Brief, erklärbare Entscheidungsreife, Pipeline Movement, Aging Strip, Relationship Field und Datenvertrauen sind als lokale regelbasierte Entscheidungsoberfläche umgesetzt. Alle Hinweise stammen aus dem lokalen synthetischen Zustand. Es gibt keine externe KI, keine autonomen Änderungen und keine Außenwirkung.

**R3.3-Status 10.10.2026:** Das CRM ist als internes, kostengünstiges AMAVIO-Arbeitssystem bestätigt. Lokale SQLite-Persistenz, Backup/Restore, synthetischer Import/Export, Zielsegmente, Quellenrecherche, kontrollierte Lead-Übernahme, Outreach-Entwürfe, Kontaktsperren und Kostenlimits sind umgesetzt. Reale Daten, externe Anbieter und Versand bleiben in diesem Block technisch deaktiviert.

**Kurzfristige Folgepriorität 10.10.2026:** Produktiver Versand, kontrollierte Automation, erlaubte Live-Research-Quellen, Connectoren, Mehrbenutzerbetrieb, spätere Workspace-Isolation sowie App-/ACC-Verträge werden als priorisierte Folgeblöcke geführt. Umgehung von Login, CAPTCHA, Paywall oder Zugriffsschutz wird nicht umgesetzt; hierfür sind ausschließlich erlaubte APIs, Exporte oder Anbieterfreigaben vorgesehen.

**R3.2-Status 10.10.2026:** Der begrenzte lokale Fachblock ist als Arbeitsjournal mit Notizen, Gesprächen, Terminen, Wiedervorlagen, Angeboten, Entscheidungen, Dokumentreferenzen, gespeicherten Ansichten und lokalen Alterungshinweisen umgesetzt. C0 ist fachlich entschieden; C1 bis C7 sind nicht aktiviert.

**C1-Neueinordnung 10.10.2026:** Die Supabase-/Cloud-Unterlagen bleiben erhalten, sind aber nicht mehr der unmittelbare nächste Block. Sie sind eine spätere Option für Geräte-Synchronisierung und G6 Mehrbenutzerbetrieb. Es wurde kein Anbieterzugang, Projekt, Cloud-Backend oder Login aktiviert.

**UAT-Status 09.10.2026:** Die technische R3-Arbeitskopie wurde unverändert in diese separate UAT-Arbeitskopie übernommen. Die Product-Owner-Abnahme ist vorbereitet, aber noch nicht erteilt. Einstieg: `UAT/README_START_HERE.md`.

**Product-Owner-Stand 09.10.2026:** Bündel A und B sind gemäß Empfehlung beschlossen und in dieser Arbeitskopie technisch an den lokalen synthetischen Core angeglichen. Bündel C bleibt vollständig gesperrt. Die Angleichung ist keine produktive, rechtliche, datenschutzrechtliche oder sicherheitsbezogene Freigabe.

Diese datierte Arbeitskopie entwickelt den gesicherten Prototyp vom 8. Oktober kontrolliert zu einem eigenständigen lokalen AMAVIO-CRM-Core weiter. Sie ist keine HubSpot-Kopie und kein produktives System. Die IGS-Ausgangsdateien dienten ausschließlich als Material für Funktions- und Informationsarchitektur; deren fremde Fachlogik wurde nicht übernommen.

## Produktgrenze

Der lokale Core umfasst:

- kanonische Organisationen, Kontakte, Leads, Chancen, Partnerorganisationen, Partnerkontakte, Aufgaben und Aktivitäten;
- belastbare Beziehungen, Detailansichten und Aktivitätstimeline;
- erlaubte Pipelineübergänge mit phasenbezogenen Mindestkriterien und Historie;
- kontrollierte Lead-Umwandlung erst nach Organisation, Bedarf, Zuständigkeit und fälligem nächstem Schritt;
- getrennte Kontakt-, Beziehungs- und synthetische Einwilligungsstatus ohne abgeleitete Rechtsgrundlage;
- zwei lokale ACC-Prüfmarker ohne Payload, ACC-Fall oder Übertragung;
- Validierung, lokale Dublettenhinweise, Archiv/Wiederherstellung und ein einstufiges Undo;
- objektübergreifende Suche, Filter, Leer-, Fehler- und Bestätigungszustände;
- ein verbundenes Arbeitsjournal für Notizen, Gespräche, Termine, Wiedervorlagen, Angebote, Entscheidungen und reine Dokumentreferenz-Metadaten;
- lokal gespeicherte Ansichten und konfigurierbare Alterungshinweise ohne externe Erinnerung oder Automation;
- versionierte, validierte lokale Persistenz mit kontrolliertem Reset;
- lokale SQLite-API auf `127.0.0.1`, Browser-Fallback, versionierte Snapshots, JSON-Export, synthetische Importvorschau und Restore;
- Zielsegmente, dokumentierte Recherchequellen, Fit-Status und kontrollierte Übernahme in einen Lead;
- Outreach-Entwürfe, lokale Freigabekriterien, Kontaktsperren, deaktivierter Brevo-Adapter und Kostenlimits;
- Kontaktentscheidung, Outreach-Preflight und kontrollierte Umwandlung offener Nachweise in verknüpfte lokale Aufgaben;
- synthetische Beispieldaten und `.invalid`-Adressen im weiterhin getrennten, lokal bearbeitbaren CRM-Core;
- 2.242 schreibgeschützt eingebundene Organisationen im bestehenden Organisationsreiter und 3.213 schreibgeschützt eingebundene Kontakte im bestehenden Kontaktreiter;
- zehn G1-Eintrittsgates mit Verantwortung, Nachweisanforderung, nächstem Schritt und unveränderlichem NO-GO;
- sechs Datenklassen, Fristen-/Lebenszyklusentwurf, Import-Quarantänevertrag und sechs lokale Kontrollläufe mit Auditspur;
- sieben getrennte Quellen-/Zweck-/Kanalentscheidungen und vier versionierte Informationspflicht-Bausteine ohne Rechtsfreigabe;
- dreizehn Zugriffsschutzkontrollen, die sechs lokale Schutzgrenzen, den beobachteten Firewall-Blocker, fehlende Authentifizierung und externe Geräteevidenz sichtbar trennen;
- restriktive lokale Sicherheitsheader, Cross-Site-/Origin-Abweisung für Änderungen und eigentümergebundene lokale Datendateien;
- eine isolierte, prüfsummenbasierte SQLite-Wiederherstellungsprobe ohne Veränderung des laufenden Zustands oder der Freigabeflags.
- eine eigenständige lokale Import-SQLite-Datei, die durch den synthetischen Demo-Reset nicht verändert wird;
- technische Hintergrundkontrollen für Zuordnung, Dubletten, Sperren und Herkunft, ohne sichtbaren Pool-, Prüf- oder Staging-Reiter.

Ausdrücklich nicht aktiviert sind Authentifizierung, Mehrbenutzer- oder Mandantenfähigkeit, eine schreibende Übernahme der importierten Datensätze in den operativen CRM-Core, E-Mail-Versand, Kalender, Cloud, Dokumentenspeicher, produktive KI, externe Kommunikation, Hosting, Deployment sowie App- oder ACC-Integration. Die operative CRM-Core-SQLite bleibt ausschließlich synthetisch. Importierte Datensätze werden aus der getrennten lokalen Datei nur gelesen und sind vollständig kontaktgesperrt.

CRM, AMAVIO One App und Arrival Control Center bleiben getrennte Produkte und getrennte Codebasen. Ein gewonnener CRM-Vorgang kann lediglich einen lokalen Review-Marker besitzen; es wird kein ACC-Fall erzeugt und nichts übertragen.

## Schutz des Ausgangsstands

- Unveränderter Ausgangsordner: `20261008_AMAVIO_One_CRM_Cockpit_Working`
- Vollständige Sicherung vor der Core-Arbeit: `20261009_AMAVIO_One_CRM_Cockpit_Sicherung_Pre_Canonical_Core`
- Diese Arbeitskopie: `20261009_AMAVIO_One_CRM_Canonical_Core_Working`
- Vollständige R3-Sicherung: `20261009_AMAVIO_One_CRM_Canonical_Core_Sicherung_Pre_R3`
- Diese R3-Arbeitskopie: `20261009_AMAVIO_One_CRM_R3_Contract_Alignment_Working`
- Vollständige Sicherung vor UAT: `20261009_AMAVIO_One_CRM_R3_Contract_Alignment_Sicherung_Pre_UAT`
- Diese UAT-Arbeitskopie: `20261009_AMAVIO_One_CRM_R3_UAT_Acceptance_Working`
- Vollständige Sicherung vor R3.1: `20261010_AMAVIO_One_CRM_R3_UAT_Sicherung_Pre_R3_1`
- Diese R3.1-Arbeitskopie: `20261010_AMAVIO_One_CRM_R3_1_Visual_Coverage_Working`
- Vollständige Sicherung vor R3.2: `20261010_AMAVIO_One_CRM_R3_1_Sicherung_Pre_R3_2`
- Diese R3.2-Arbeitskopie: `20261010_AMAVIO_One_CRM_R3_2_Fachblock_Working`
- Vollständige Sicherung vor dem C1-Entry-Gate-Block: `20261010_AMAVIO_One_CRM_R3_2_Sicherung_Pre_C1_Entry_Gates`
- Diese C1-Entry-Gate-Arbeitskopie: `20261010_AMAVIO_One_CRM_C1_Entry_Gates_Working`
- Vollständige Sicherung vor R3.3: `20261010_AMAVIO_One_CRM_C1_Entry_Gates_Sicherung_Pre_R3_3`
- Diese R3.3-Arbeitskopie: `20261010_AMAVIO_One_CRM_R3_3_Owner_Growth_Working`
- Vollständige Sicherung vor R3.4: `20261010_AMAVIO_One_CRM_R3_3_Sicherung_Pre_R3_4`
- Diese R3.4-Arbeitskopie: `20261010_AMAVIO_One_CRM_R3_4_Founder_Decision_Working`
- Vollständige Sicherung vor R3.5: `20261012_AMAVIO_One_CRM_R3_4_Sicherung_Pre_R3_5`
- Diese R3.5-Arbeitskopie: `20261012_AMAVIO_One_CRM_R3_5_Operational_Readiness_Working`
- Vollständige Sicherung vor R3.6: `20261013_AMAVIO_One_CRM_R3_5_Sicherung_Pre_R3_6_G1`
- Diese R3.6-Arbeitskopie: `20261013_AMAVIO_One_CRM_R3_6_Workspaces_Analytics_G1_Readiness_Working`
- Vollständige Sicherung vor G1 Entry Gate Closure: `20261013_AMAVIO_One_CRM_R3_6_Sicherung_Pre_G1_Entry_Gate_Closure`
- Diese R3.7-Arbeitskopie: `20261013_AMAVIO_One_CRM_R3_7_G1_Entry_Gate_Closure_Working`
- Vollständige Sicherung vor R3.8: `20261013_AMAVIO_One_CRM_R3_7_Sicherung_Pre_G1_Legal_Access_Closure`
- Diese R3.8-Arbeitskopie: `20261013_AMAVIO_One_CRM_R3_8_G1_Legal_Access_Assurance_Working`
- Vollständige Sicherung vor R3.9: `20261013_AMAVIO_One_CRM_R3_8_Sicherung_Pre_IA_Consolidation`
- Diese R3.9-Arbeitskopie: `20261013_AMAVIO_One_CRM_R3_9_IA_Consolidation_Working`
- Vollständige Sicherung vor R3.10: `20261013_AMAVIO_One_CRM_R3_9_Sicherung_Pre_R3_10_Local_Operations_Assurance`
- Diese R3.10-Arbeitskopie: `20261013_AMAVIO_One_CRM_R3_10_Local_Operations_Assurance_Working`
- Vollständige Sicherung vor R3.11: `20261013_AMAVIO_One_CRM_R3_10_Sicherung_Pre_R3_11_G1_PO_Decision_Alignment`
- Diese R3.11-Arbeitskopie: `20261013_AMAVIO_One_CRM_R3_11_G1_PO_Decision_Alignment_Working`
- Vollständige Sicherung vor R3.12: `20261013_AMAVIO_One_CRM_R3_11_Sicherung_Pre_R3_12_G1_External_Technical_Readiness`
- Diese R3.12-Arbeitskopie: `20261013_AMAVIO_One_CRM_R3_12_G1_External_Technical_Readiness_Working`
- Vollständige Sicherung vor R3.13: `20261013_AMAVIO_One_CRM_R3_12_Sicherung_Pre_R3_13_C1_Decision_Closure`
- Diese R3.13-Arbeitskopie: `20261013_AMAVIO_One_CRM_R3_13_C1_Decision_Closure_Working`
- Vollständige relevante Sicherung vor R3.14: `20261013_AMAVIO_One_CRM_R3_13_Sicherung_Pre_R3_14_C1_External_Review_Readiness`
- Diese R3.14-Arbeitskopie: `20261013_AMAVIO_One_CRM_R3_14_C1_External_Review_Readiness_Working`
- Unveränderte Ausgangsarbeitskopie vor R3.15: `20261013_AMAVIO_One_CRM_R3_14_C1_External_Review_Readiness_Working`
- Diese R3.15-Arbeitskopie: `20261013_AMAVIO_One_CRM_R3_15_Local_Real_Data_Staging_Working`
- Unveränderte Sicherung vor der UI-Korrektur: `20261013_AMAVIO_One_CRM_R3_15_Local_Real_Data_Staging_Working`
- Diese R3.16-Arbeitskopie: `20261013_AMAVIO_One_CRM_R3_16_Organizations_Contacts_Integration_Working`
- Unveränderte Sicherung vor R3.17: `20261013_AMAVIO_One_CRM_R3_16_Organizations_Contacts_Integration_Working`
- Diese R3.17-Arbeitskopie: `20261013_AMAVIO_One_CRM_R3_17_Unified_Global_Search_Working`
- Getrennte lokale Staging-Datenbank: `local-data/real-data-staging/amavio-real-data-staging-r3-15.sqlite`
- Vor-/Nachweis der freigegebenen lokalen Teilhärtung: `QA/CRM_R3_13_LOCAL_SYSTEM_SETTINGS_PRECHANGE_20261013.md` und `QA/CRM_R3_13_LOCAL_SYSTEM_SETTINGS_POSTCHANGE_20261013.md`
- R3.13-Abschlussbericht: `QA/CRM_R3_13_C1_DECISION_CLOSURE_QA_20261013.md`
- Die alten Speicher `amavio-one-crm-cockpit-v1`, `amavio-one-crm-canonical-core-v2`, `amavio-one-crm-r3-contract-alignment-v3` und `amavio-one-crm-r3-3-owner-growth-v5` bleiben unangetastet.
- Diese Arbeitskopie verwendet `amavio-one-crm-r3-8-g1-legal-access-assurance-v7`; der v6- und die älteren Schlüssel bleiben erhalten und lokale synthetische Zustände können kontrolliert migriert werden.

Die Sicherungs- und Vergleichsevidenz steht in `QA/CRM_COPY_AND_SCOPE_VERIFICATION_20261009.md`.

## Lokal starten

Voraussetzung: Node.js 22.5 oder neuer.

Vollständiger lokaler Betrieb mit SQLite:

```bash
npm start
```

Standardadresse dieser Arbeitskopie: `http://127.0.0.1:4401/`

Reine UI-Entwicklung mit Browser-Fallback:

```bash
npm run dev
```

Der reine Vite-Entwicklungsmodus nutzt standardmäßig `http://127.0.0.1:4396/` und den ausdrücklich sichtbaren Browser-Fallback. Die lokale Produktionsvorschau verwendet `4398`.

## Qualitätsprüfungen

```bash
npm run build
npm run qa
npm run test:logic
npm run test:persistence
npm run test:staging
npm run test:e2e
npm run qa:browser
```

- `test:logic` umfasst Unit-, Vertrags-, Komponenten- und Integrationstests.
- `test:e2e` prüft zwanzig zusammenhängende synthetische Kernpfade sowie separat die Einbindung importierter Organisationen und Kontakte in die beiden vorhandenen CRM-Reiter.
- `test:persistence` prüft SQLite, Speichern, Sicherung, JSON-Export, Reset, Restore, die isolierte Prüfsummen-Wiederherstellungsprobe und die Abweisung nicht-synthetischer Importe.
- `test:staging` prüft als technische Hintergrundkontrolle Umfang, Deduplizierung, Mehrfachbeziehungen, Namensprüfungen, Quarantäne, Provenienz, vollständige Kontaktsperre und Idempotenz der getrennten Importdatei.
- `qa:browser` prüft 1600, 1280, 1024, 768, 430 und 390 Pixel, acht Arbeitsflächen einschließlich Organisationen und Kontakte, Tastatur/Fokus, 200-%-Reflow und Browserkonsole und erzeugt lokale QA-Screenshots.
- Die Browser-Skripte nutzen den lokal installierten Google Chrome. Sie rufen ausschließlich den lokalen Vite-Server auf.

## Architektur- und Entscheidungsdokumente

- `CRM_CAPABILITY_GAP_MATRIX.md`
- `CRM_CANONICAL_DOMAIN_MODEL.md`
- `CRM_STATUS_AND_TRANSITION_CONTRACT.md`
- `CRM_PERMISSIONS_AND_VISIBILITY_DRAFT.md`
- `CRM_DATA_LIFECYCLE_AND_PRIVACY_DRAFT.md`
- `CRM_ACC_HANDOFF_CONTRACT_DRAFT.md`
- `CRM_TEST_AND_QUALITY_STRATEGY.md`
- `CRM_RELEASE_MATURITY_PLAN.md`
- `CRM_PRODUCT_OWNER_DECISIONS.md`
- `CRM_R3_13_SCOPE_AND_IMPLEMENTATION_20261013.md`
- `CRM_R3_14_SCOPE_AND_IMPLEMENTATION_20261013.md`
- `CRM_C1_SECURITY_REVIEW_BRIEF_20261013.md`
- `CRM_C1_DELEGATE_ACCEPTANCE_AND_HANDOVER_DRAFT_20261013.md`
- `CRM_C1_PRIVACY_CONTRACT_EXTERNAL_REVIEW_BRIEF_20261013.md`
- `CRM_C1_PROVIDER_REGION_DECISION_BRIEF_20261013.md`
- `CRM_C1_GATE_CLOSURE_REGISTER_20261013.md`
- `QA/CRM_R3_14_FIREWALL_VERIFICATION_20261013.md`
- `QA/CRM_R3_14_COPY_AND_SCOPE_VERIFICATION_20261013.md`
- `QA/CRM_R3_14_EXTERNAL_REVIEW_READINESS_QA_20261013.md`
- `CRM_R3_15_SCOPE_AND_IMPLEMENTATION_20261013.md`
- `CRM_R3_15_REAL_DATA_STAGING_CONTRACT_20261013.md`
- `QA/CRM_R3_15_COPY_AND_SCOPE_VERIFICATION_20261013.md`
- `QA/CRM_R3_15_LOCAL_REAL_DATA_STAGING_QA_20261013.md`
- `QA/CRM_R3_15_DESIGN_FIDELITY_LEDGER_20261013.md`
- `CRM_R3_16_SCOPE_AND_CORRECTION_20261013.md`
- `QA/CRM_R3_16_COPY_AND_SCOPE_VERIFICATION_20261013.md`
- `QA/CRM_R3_16_ORGANIZATIONS_CONTACTS_INTEGRATION_QA_20261013.md`
- `CRM_C1_PRODUCT_OWNER_DECISION_RECORD_20261013.md`
- `CRM_G1_06_DEVICE_CONFIGURATION_AND_VERIFICATION_20261013.md`
- `QA/CRM_R3_13_COPY_AND_SCOPE_VERIFICATION_20261013.md`
- `QA/CRM_R3_13_C1_DECISION_CLOSURE_QA_20261013.md`
- `QA/CRM_R3_13_LOCAL_SYSTEM_SETTINGS_PRECHANGE_20261013.md`
- `QA/CRM_R3_13_LOCAL_SYSTEM_SETTINGS_POSTCHANGE_20261013.md`
- `CRM_R3_12_SCOPE_AND_IMPLEMENTATION_20261013.md`
- `CRM_G1_03_OFFICIAL_SOURCE_AND_REVIEW_DOSSIER_20261013.md`
- `CRM_G1_03_ART_13_14_NOTICE_CONTENT_DRAFT_20261013.md`
- `CRM_G1_03_LIA_AND_CHANNEL_DECISION_TEMPLATE_20261013.md`
- `CRM_G1_03_RECORD_OF_PROCESSING_DRAFT_20261013.md`
- `CRM_G1_06_LOCAL_DEVICE_AND_SERVER_POSTURE_20261013.md`
- `CRM_G1_07_09_LOCAL_OPERATIONS_EVIDENCE_20261013.md`
- `CRM_G1_09_INCIDENT_CONTACT_AND_ESCALATION_RUNBOOK_20261013.md`
- `CRM_C1_CURRENT_PROVIDER_AND_COST_REFRESH_20261013.md`
- `CRM_C1_MINIMUM_RELEASE_DECISIONS_20261013.md`
- `CRM_G1_10_DECISION_PACKET_R3_12_20261013.md`
- `QA/CRM_R3_12_G1_EXTERNAL_TECHNICAL_READINESS_QA_20261013.md`
- `QA/CRM_R3_12_COPY_AND_SCOPE_VERIFICATION_20261013.md`
- `CRM_R3_11_SCOPE_AND_IMPLEMENTATION_20261013.md`
- `CRM_G1_PRODUCT_OWNER_DECISION_RECORD_20261013.md`
- `CRM_G1_REMAINING_EXTERNAL_TECHNICAL_GATES_20261013.md`
- `QA/CRM_R3_11_G1_PO_DECISION_ALIGNMENT_QA_20261013.md`
- `QA/CRM_R3_11_COPY_AND_SCOPE_VERIFICATION_20261013.md`
- `CRM_R3_10_SCOPE_AND_IMPLEMENTATION_20261013.md`
- `CRM_G1_07_OBSERVED_RESTORE_ASSURANCE_20261013.md`
- `CRM_G1_01_05_07_09_DECISION_RECOMMENDATION_20261013.md`
- `QA/CRM_R3_10_LOCAL_OPERATIONS_ASSURANCE_QA_20261013.md`
- `QA/CRM_R3_10_COPY_AND_SCOPE_VERIFICATION_20261013.md`
- `CRM_R3_6_SCOPE_AND_IMPLEMENTATION_20261013.md`
- `CRM_R3_6_WORKSPACE_PURPOSE_AND_USABILITY_MATRIX_20261013.md`
- `CRM_R3_6_VISIBLE_INFORMATION_AND_PRIVACY_AUDIT_20261013.md`
- `CRM_G1_REAL_DATA_READINESS_SCOPE_20261013.md`
- `CRM_G1_DATA_INVENTORY_AND_CLASSIFICATION_DRAFT_20261013.md`
- `CRM_G1_ENTRY_GATE_REGISTER_20261013.md`
- `CRM_G1_RELEASE_DECISION_DRAFT_20261013.md`
- `CRM_G1_GATE_CLOSURE_IMPLEMENTATION_20261013.md`
- `CRM_G1_DATA_PURPOSE_AND_LEGAL_BASIS_MATRIX_DRAFT_20261013.md`
- `CRM_G1_INFORMATION_DUTY_AND_CONTACT_POLICY_DRAFT_20261013.md`
- `CRM_G1_ACCESS_DEVICE_AND_SESSION_CONTROL_DRAFT_20261013.md`
- `CRM_G1_RETENTION_ARCHIVE_AND_DELETION_SCHEDULE_DRAFT_20261013.md`
- `CRM_G1_IMPORT_MAPPING_DEDUPLICATION_AND_QUARANTINE_CONTRACT_20261013.md`
- `CRM_G1_DATA_SUBJECT_REQUEST_PLAYBOOK_DRAFT_20261013.md`
- `CRM_G1_INCIDENT_RESPONSE_PLAYBOOK_DRAFT_20261013.md`
- `CRM_G1_EVIDENCE_AND_OWNERSHIP_REGISTER_20261013.md`
- `CRM_G1_PRODUCT_OWNER_DECISION_PACKAGE_20261013.md`
- `CRM_R3_8_SCOPE_AND_IMPLEMENTATION_20261013.md`
- `CRM_G1_03_LEGAL_AND_INFORMATION_DUTY_CLOSURE_PACKAGE_20261013.md`
- `CRM_G1_03_SOURCE_PURPOSE_CHANNEL_DECISION_MATRIX_20261013.md`
- `CRM_G1_03_INFORMATION_NOTICE_VERSIONING_AND_EVIDENCE_DRAFT_20261013.md`
- `CRM_G1_06_ACCESS_DEVICE_SESSION_ASSURANCE_PACKAGE_20261013.md`
- `CRM_G1_06_DEVICE_AND_LOCAL_ENVIRONMENT_EVIDENCE_20261013.md`
- `CRM_G1_06_AUTHORIZATION_NEGATIVE_TEST_CONTRACT_20261013.md`
- `CRM_G1_10_FINAL_DECISION_READINESS_20261013.md`
- `QA/CRM_R3_8_G1_LEGAL_ACCESS_ASSURANCE_QA_20261013.md`
- `CRM_R3_9_INFORMATION_ARCHITECTURE_AND_DUPLICATION_AUDIT_20261013.md`
- `CRM_R3_9_SCOPE_AND_IMPLEMENTATION_20261013.md`
- `QA/CRM_R3_9_IA_CONSOLIDATION_QA_20261013.md`
- `QA/CRM_R3_9_COPY_AND_SCOPE_VERIFICATION_20261013.md`
- `CRM_R3_1_VISUAL_LANGUAGE_ALIGNMENT_20261010.md`
- `CRM_IGS_TO_AMAVIO_COVERAGE_MATRIX_20261010.md`
- `CRM_STEP_C_GATE_AND_SEQUENCE_PLAN_20261010.md`
- `CRM_STEP_C_IMPLEMENTATION_PROMPT_DRAFT_20261010.md`
- `CRM_R3_2_SCOPE_AND_IMPLEMENTATION_20261010.md`
- `CRM_R3_3_SCOPE_AND_IMPLEMENTATION_20261010.md`
- `CRM_R3_4_PRODUCT_EXPERIENCE_AND_AI_MASTER_PROMPT_20261010.md`
- `CRM_R3_4_PRODUCT_EXPERIENCE_BLUEPRINT_20261010.md`
- `CRM_R3_4_INFORMATION_ARCHITECTURE_20261010.md`
- `CRM_R3_4_DESIGN_SYSTEM_DELTA_20261010.md`
- `CRM_R3_4_VISUALIZATION_CONTRACT_20261010.md`
- `CRM_R3_4_AI_EXPERIENCE_AND_GOVERNANCE_CONTRACT_20261010.md`
- `CRM_R3_4_ACCESSIBILITY_AND_RESPONSIVE_MATRIX_20261010.md`
- `CRM_R3_4_IMPLEMENTATION_CROSSWALK_20261010.md`
- `CRM_R3_5_SCOPE_AND_IMPLEMENTATION_20261012.md`
- `CRM_R3_5_CONTACTABILITY_AND_OUTREACH_PREFLIGHT_CONTRACT_20261012.md`
- `CRM_R3_5_REAL_DATA_INDIVIDUAL_SEND_AND_LIVE_RESEARCH_GATE_PREPARATION_20261012.md`
- `CRM_R3_5_IMPLEMENTATION_CROSSWALK_20261012.md`
- `CRM_GROWTH_AND_OUTREACH_DOMAIN_CONTRACT_20261010.md`
- `CRM_LOCAL_PERSISTENCE_BACKUP_AND_IMPORT_CONTRACT_20261010.md`
- `CRM_NEAR_TERM_CAPABILITY_ROADMAP_20261010.md`
- `CRM_C1_RECLASSIFICATION_20261010.md`
- `CRM_C0_DECISION_PACKAGE_20261010.md`
- `CRM_C0_ARCHITECTURE_DECISION_RECORD_20261010.md`
- `CRM_C0_PROVIDER_COMPARISON_20261010.md`
- `CRM_C1_ENTRY_GATE_REGISTER_20261010.md`
- `CRM_C1_SECURITY_AND_THREAT_MODEL_DRAFT_20261010.md`
- `CRM_C1_DATA_PROTECTION_AND_PROVIDER_DUE_DILIGENCE_20261010.md`
- `CRM_C1_OPERATING_MODEL_AND_RESPONSIBILITY_MATRIX_20261010.md`
- `CRM_C1_BACKUP_RESTORE_RPO_RTO_DRAFT_20261010.md`
- `CRM_C1_COST_GUARDRAIL_AND_BUDGET_DRAFT_20261010.md`
- `CRM_C1_ENVIRONMENT_SECRET_AND_EXIT_STRATEGY_20261010.md`
- `CRM_C1_AUTHORIZATION_AND_RLS_TEST_MATRIX_20261010.md`
- `CRM_C1_RELEASE_DECISION_DRAFT_20261010.md`
- `R3_CONTRACT_ALIGNMENT_SCOPE.md`
- `R3_IMPLEMENTATION_CROSSWALK.md`
- `decision_round/CRM_PRODUCT_OWNER_DECISION_ACTIVATION_20261009.md`
- `decision_round/QA/CRM_PRODUCT_OWNER_DECISION_ACTIVATION_QA_20261009.md`
- `QA/CRM_CORE_OPERATIONS_QA_20261009.md`
- `QA/CRM_R3_CONTRACT_ALIGNMENT_QA_20261009.md`
- `QA/CRM_R3_1_VISUAL_COVERAGE_QA_20261010.md`
- `QA/CRM_R3_2_CORE_QA_20261010.md`
- `QA/CRM_C1_ENTRY_GATES_QA_20261010.md`
- `QA/CRM_R3_3_OWNER_GROWTH_QA_20261010.md`
- `QA/CRM_R3_4_PRODUCT_EXPERIENCE_QA_20261010.md`
- `QA/CRM_R3_4_DESIGN_FIDELITY_LEDGER_20261010.md`
- `QA/CRM_R3_5_OPERATIONAL_READINESS_QA_20261012.md`
- `QA/CRM_R3_6_WORKSPACES_ANALYTICS_G1_QA_20261013.md`
- `QA/CRM_G1_ENTRY_GATE_CLOSURE_QA_20261013.md`
- `UAT/README_START_HERE.md`
- `UAT/CRM_R3_UAT_SCRIPT_20261009.md`
- `UAT/CRM_R3_ACCEPTANCE_CHECKLIST_20261009.md`
- `UAT/CRM_R3_UAT_FINDINGS_20261009.md`
- `UAT/CRM_R3_PRODUCT_OWNER_ACCEPTANCE_20261009.md`
- `UAT/CRM_R3_RELEASE_DECISION_20261009.md`

## Visuelle Referenzen

- `design/AMAVIO_ONE_CRM_DESKTOP_CONCEPT_20261008.png`
- `design/AMAVIO_ONE_CRM_MOBILE_CONCEPT_20261008.png`
- `public/assets/media/crm-focus-architecture.png`
- `design/r3-4/AMAVIO_ONE_CRM_R3_4_DESKTOP_CONCEPT_20261010.png`
- `design/r3-4/AMAVIO_ONE_CRM_R3_4_MOBILE_CONCEPT_20261010.png`
- `design/r3-6/AMAVIO_ONE_CRM_R3_6_WORKDAY_CONCEPT_20261013.png`
- `design/r3-6/AMAVIO_ONE_CRM_R3_6_COCKPIT_CONCEPT_20261013.png`
- `design/r3-6/AMAVIO_ONE_CRM_R3_6_REPORTS_CONCEPT_20261013.png`
- `design/r3-6/AMAVIO_ONE_CRM_R3_6_WORKDAY_MOBILE_CONCEPT_20261013.png`

Die bestehende AMAVIO-Identität wurde erhalten: Editorialität, Navy-/Creme-Basis, Goldakzente, klare Typografie und offene Flächen. Das Architekturmotiv und sämtliche dargestellten CRM-Daten sind synthetisch und identifizieren keine reale Organisation oder Person.
