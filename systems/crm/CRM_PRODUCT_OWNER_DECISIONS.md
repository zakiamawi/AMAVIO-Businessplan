# AMAVIO One CRM – Product-Owner-Entscheidungsmatrix

**Beschlussstand:** 13.10.2026  
**Beschlusswortlaut:** „Ich beschließe Bündel A und Bündel B gemäß Empfehlung. Bündel C bleibt vollständig gesperrt.“  
**Regel:** Die fachliche Annahme von Bündel A und B sowie der nachfolgende ausdrückliche R3-Auftrag erlauben ausschließlich die lokale synthetische technische Angleichung. Sie erlauben keine produktive Nutzung. Die bestätigten Sperren von Bündel C erlauben keinerlei Anbieterwahl, Integration oder technische Aktivierung.

**Entscheidungsvorlage:** Die nicht operative, QA-geprüfte Entscheidungsrunde liegt unter `decision_round/README_START_HERE.md`. Diese Verknüpfung ändert keinen Status in der nachfolgenden Matrix.

## G1 Entry Gate Closure – 13.10.2026

Der Product Owner hat den nächsten Schritt ausführlich und vollständig beauftragt. Aus dem unmittelbar vorher festgelegten Arbeitsplan folgt: Die intern prüfbaren G1-Eintrittsgates werden lokal-synthetisch geschlossen beziehungsweise entscheidungsreif vorbereitet; reale Daten werden dadurch nicht aktiviert. Umgesetzt sind Datenklassen, Zweck-/Ausschlussmatrix, Fristenentwurf, Import-/Quarantänevertrag, Betroffenenanfragen- und Incident-Playbook, Nachweisverantwortung und vier lokale Kontrollläufe. G1-03, G1-06 und G1-10 bleiben gesperrt. G1 erfordert weiterhin einen gesonderten Product-Owner-Beschluss nach Rechts-, Zugriffsschutz- und Betriebsnachweisen.

## G1 Product-Owner Decision Alignment – 13.10.2026

Mit der Freigabe des empfohlenen nächsten Schritts werden G1-01, G1-05, G1-07 und G1-09 unter `PO-CRM-043` als lokale Arbeitslogik beschlossen. Der Beschluss umfasst engen Datenumfang und Zweck, Reviewintervalle ohne automatische Löschung, RPO 24 Stunden/RTO 4 Stunden mit täglichem Sicherungsrhythmus sowie den Incident-Erstablauf mit Product Owner/CRM-Administration als Hauptkoordination. Nicht geschlossen sind G1-03, G1-06, die externen Betriebs- und Vertretungsnachweise oder G1-10. Reale Daten und alle Produktivflags bleiben gesperrt.

## R3.6-Arbeitsflächen, Auswertungen und G1-Start – 13.10.2026

Der Product Owner hat die fachliche Entflechtung von „Mein Arbeitstag“, „Cockpit“ und „Pipeline“, eine visuell belastbare Auswertungsfläche, die Prüfung sichtbarer interner Entwicklungsinformationen sowie den Start des **G1 Real-Data-Readiness-Pakets** beauftragt. Daraus folgt ausschließlich:

- „Mein Arbeitstag“ dient der konkreten Priorisierung, Agenda, Aufgaben- und Wiedervorlagenarbeit.
- „Cockpit“ dient der Geschäftssteuerung und verdichtet die Pipeline, ersetzt aber nicht die operative Pipeline-Arbeitsfläche.
- „Auswertungen“ erhalten belegte Diagramme und eine getrennte bereinigte Berichtsansicht. Diese Ansicht ist noch kein freigegebener Export und kein externer Bericht.
- Entwicklungsstände, Prompt-/Assistenzbezüge und interne Produktionshinweise gehören nicht auf reguläre CRM-Arbeitsflächen. Sicherheits- und Datengrenzen bleiben sichtbar.
- G1 darf vorbereitet und bewertet werden. Reale Daten, externer Import, Authentifizierung, Versand, Connectoren, Hosting, App und ACC bleiben ohne gesonderten Beschluss gesperrt.

## R3.4-Freigabe 10.10.2026

Der Product Owner hat den begrenzten Block **R3.4 – Founder Decision Cockpit & Relationship Intelligence** freigegeben. Umgesetzt werden ausschließlich lokale, synthetische und erklärbare Entscheidungsableitungen. Produktive KI, externe Datenübertragung, autonome Änderungen, Versand, Connectoren, Authentifizierung, Mehrbenutzerbetrieb, Mandantenfähigkeit, Cloud, Deployment sowie App-/ACC-Integration bleiben gesperrt.

## R3.2- und C0-Beschluss 10.10.2026

Der Product Owner hat als nächsten Schritt beschlossen: zuerst den begrenzten lokalen R3.2-Fachblock mit Notizen, Gesprächen, Terminen, Wiedervorlagen, Angeboten und Entscheidungen umsetzen; parallel ausschließlich C0 fachlich entscheiden; erst danach C1 als kontrollierte sichere Plattformgrundlage freigeben. Dokumentreferenzen wurden als reine lokale Metadaten innerhalb der bereits modellierten Objektgrenze umgesetzt; es existiert kein Datei- oder Cloudspeicher.

- **R3.2:** im lokalen synthetischen Core umgesetzt und geprüft.
- **C0:** fachlich entschieden; ausgewählte C1-Planungspräferenz ist Supabase Managed PostgreSQL/Auth in der spezifischen Region `eu-central-1` Frankfurt mit AMAVIO-Server/API-Grenze, restriktiver RLS, interner Einladung und TOTP-MFA.
- **C1:** nicht freigegeben; kein Konto, Projekt, Backend, Login oder Staging angelegt.
- **C2 bis C7:** vollständig gesperrt.

Maßgebliche Unterlagen: `CRM_C0_DECISION_PACKAGE_20261010.md`, `CRM_C0_ARCHITECTURE_DECISION_RECORD_20261010.md`, `CRM_C0_PROVIDER_COMPARISON_20261010.md` und `CRM_R3_2_SCOPE_AND_IMPLEMENTATION_20261010.md`.

## C1-Entry-Gate-Beschlussfolge 10.10.2026

Der Product Owner hat als nächsten Block das Schließen der dokumentierten C1-Entry-Gates vor jeder C1-Implementierung festgelegt. Der Block wurde ausschließlich dokumentarisch und read-only gegenüber externen Quellen ausgeführt. Ergebnis:

- Scope, Architektur/Umgebung/Exit, Bedrohungsmodell, API-/RLS-Vertrag und RPO/RTO sind für ein enges synthetisches C1-Staging entscheidungsreif spezifiziert.
- DPA-/Transfer-/Subprozessorenannahme, personelle Betriebs- und Prüffunktion sowie Budget/Beauftragung sind nicht durch technische Annahmen ersetzbar und bleiben offen.
- C1 ist deshalb noch nicht freigegeben; kein Konto, Projekt, Tarif, Backend, Login oder Staging wurde aktiviert.
- Maßgeblich: `CRM_C1_ENTRY_GATE_REGISTER_20261010.md` und `CRM_C1_RELEASE_DECISION_DRAFT_20261010.md`.

## R3.1-/Schritt-C-Einordnung 10.10.2026

Der Wunsch, einen Schritt-C-Prompt zu erstellen und Schritt C anschließend zu entwickeln, wird als Auftrag zur **C0-Vorbereitung** und zur Vorlage eines kontrollierten Sequenzplans dokumentiert. Er ersetzt nicht automatisch die acht voneinander unabhängigen, am 09.10.2026 ausdrücklich gesperrten Produktivgates. Der empfohlene nächste Beschluss ist auf C0 und C1 – sichere Plattformbasis mit synthetischem Staging – begrenzt. Details: `CRM_STEP_C_GATE_AND_SEQUENCE_PLAN_20261010.md`.

| ID | Entscheidung | Aktueller lokaler Default | Gate / Auswirkung | Status |
|---|---|---|---|---|
| PO-CRM-001 | finale Pipeline und Eintrittskriterien | sechs Erfolgsphasen plus verlorener Ausgang, Version 1.0 | Vertrieb/PO | **fachlich entschieden und lokal-synthetisch angeglichen 09.10.2026** |
| PO-CRM-002 | Verantwortungs- und Teamrollen | synthetische Owner-Referenzen | Auth/Rollen/Security | **fachlich entschieden – Empfehlung angenommen 09.10.2026; technische Durchsetzung gesperrt** |
| PO-CRM-003 | Pflichtfelder je Phase | phasenbezogene lokale Evidenzprüfung | Vertrieb/PO | **fachlich entschieden und lokal-synthetisch angeglichen; UAT/Produktivgate offen** |
| PO-CRM-004 | Definition von Lead vs. Opportunity | getrenntes Lead-Objekt und kontrollierte Konvertierung | Prozessdesign | **fachlich entschieden und lokal-synthetisch angeglichen** |
| PO-CRM-005 | Partner-Governance und Bearbeitungsrechte | Partner- und Partnerkontakt-CRUD ohne externen Zugang | Vertrag/Datenschutz | **fachlich entschieden und lokal-synthetisch angeglichen; Partnerlogin ausgeschlossen** |
| PO-CRM-006 | Kontakt- und Einwilligungsstatus | getrennte Felder, `unknown`, Nachweispflichten, lokale Sperre | Recht/Datenschutz | **fachlich entschieden und lokal-synthetisch angeglichen; Rechtsprüfung offen** |
| PO-CRM-007 | Aufbewahrung und Löschung | reversible Archivierung, keine Löschung | Recht/Datenschutz | **fachlich entschieden – Empfehlung angenommen 09.10.2026; Löschkonzept gesperrt** |
| PO-CRM-008 | produktive Datenbank | C0-Präferenz: Supabase Managed PostgreSQL, spezifische Region Frankfurt, serverseitige API-Grenze | Kosten/Architektur/Security | **C0 fachlich entschieden 10.10.2026; Provisionierung und C1-Umsetzung gesperrt** |
| PO-CRM-009 | Authentifizierung und MFA | C0-Präferenz: interne Einladung, TOTP-MFA, keine Selbstregistrierung/Social Logins | Security/PO | **C0 fachlich entschieden 10.10.2026; technische Aktivierung gesperrt** |
| PO-CRM-010 | Mandantenmodell | deklarierter interner Single-Workspace, `tenantCapable: false` | Produktarchitektur | **fachlich entschieden und lokal markiert; produktive Architektur gesperrt** |
| PO-CRM-011 | Import bestehender Daten | keiner | Datenqualität/Datenschutz | **Sperre vollständig bestätigt 09.10.2026** |
| PO-CRM-012 | E-Mail-/Kalenderanbieter | keiner | Integration/Datenschutz/Kosten | **Sperre vollständig bestätigt 09.10.2026** |
| PO-CRM-013 | Dokumentenspeicher | lokale Dokumentreferenz-Metadaten in R3.2; kein Upload | Security/Datenschutz/Kosten | **Metadaten lokal umgesetzt; Speicher/Cloud vollständig gesperrt** |
| PO-CRM-014 | ACC-Handoff-Freigaberollen | zwei lokale Prüfmarker, kein Payload/keine ACC-ID | ACC/PO/Datenschutz | **fachlich entschieden und lokal-synthetisch angeglichen; Integration gesperrt** |
| PO-CRM-015 | App-Bezug | keiner | getrennte Produktentscheidung | **Sperre vollständig bestätigt 09.10.2026** |
| PO-CRM-016 | produktive KI | keine | Kosten/Datenschutz/Qualität | **Sperre vollständig bestätigt 09.10.2026** |
| PO-CRM-017 | Hosting/Deployment | C0-Region/Architektur für spätere Planung benannt; keine Umgebung angelegt | Security/Kosten/Release | **C0 fachlich entschieden; Hosting, Deployment und C1 gesperrt** |
| PO-CRM-018 | EN-Sprachumfang | Struktur vorbereitbar, Oberfläche DE | Produkt/Content | **fachlich entschieden – DE vollständig; EN nur als geschlossenes Release** |
| PO-CRM-019 | Forecast-Definition | kein Forecast-Versprechen | Finance/Vertrieb | **fachlich entschieden – sichtbares Potenzial; kein gewichteter Forecast** |
| PO-CRM-020 | Exportrechte und Formate | kein Export | Datenschutz/Rollen | **fachlich entschieden – Export in R3 deaktiviert; spätere Spezifikation gesperrt** |
| PO-CRM-021 | R3.2-Arbeitsjournal | sieben lokale Fachobjekte, gespeicherte Ansichten und Alterungshinweise | Vertrieb/PO/QA | **lokal-synthetisch umgesetzt und geprüft 10.10.2026** |
| PO-CRM-022 | C0-Zugriffsmuster | Browser → AMAVIO Server/API → PostgreSQL; RLS als zusätzliche Schutzschicht | Architektur/Security | **fachlich entschieden; Umsetzung erst nach C1-Freigabe** |
| PO-CRM-023 | C0-Umgebungen | lokal; später synthetisches Staging; Produktion separat | Architektur/Release | **fachlich entschieden; keine Umgebung provisioniert** |
| PO-CRM-024 | C1-Entry-Gates vor Implementierung schließen | neun Gate-Nachweise; fünf intern spezifiziert, drei externe Freigaben und C1-Beschluss offen | Datenschutz/Vertrag/Betrieb/Kosten/PO | **Gate-Paket erstellt 10.10.2026; C1 bleibt NO-GO** |
| PO-CRM-025 | enger C1-Betriebszuschnitt | Managed PostgreSQL/Auth in Frankfurt; AMAVIO Web/API zunächst lokal; kein öffentlicher Endpoint | Architektur/Hosting/Security | **als C1-Beschlussvorlage spezifiziert; Umsetzung gesperrt** |
| PO-CRM-026 | C1-Kostenleitplanke | früherer Vorschlag: Pro, ein Micro-Projekt, maximal 40 EUR brutto/Monat, keine Add-ons | Kosten/Beschaffung | **durch PO-CRM-045 hinsichtlich des Planungsrahmens ersetzt; keine Ausgabe freigegeben** |
| PO-CRM-027 | C1-Verantwortlichkeiten | Technical Operator, Security Reviewer/zweite Freigabe, Privacy/Contract Review, QA Owner | Betrieb/Security/Datenschutz | **Personenzuordnung offen; C1-BLOCKER** |
| PO-CRM-028 | CRM-Zweck | internes, kostengünstiges AMAVIO Vertriebs-, Kontakt-, Recherche- und Marketing-System; kein zu verkaufendes SaaS | Produkt/Architektur | **entschieden 10.10.2026; R3.3 lokal umgesetzt** |
| PO-CRM-029 | lokale Datenbasis | Node-API auf `127.0.0.1`, SQLite, Browser-Fallback und synthetische v4→v5-Migration | Architektur/QA | **für R3.3 entschieden und lokal geprüft** |
| PO-CRM-030 | Growth-Core | Zielsegmente, Quellenrecherche, Lead-Übernahme, Outreach-Entwürfe, Suppression und Kostenlimits | Vertrieb/Marketing/QA | **lokal-synthetisch umgesetzt 10.10.2026** |
| PO-CRM-031 | kurzfristige Außenfähigkeiten | Versand, Automation, erlaubtes Live Research, Connectoren, Team, Isolation und ACC/App-Verträge wichtig | getrennte Recht/Privacy/Security/Kosten-/Integrationsgates | **priorisiert; kein pauschaler Go-live** |
| PO-CRM-032 | Schutzumgehung | Login-, CAPTCHA-, Paywall- und Zugriffsschutz nicht umgehen; offizielle APIs/Exporte/Freigaben verwenden | Recht/Security/Anbieterbedingungen | **dauerhaft ausgeschlossen** |
| PO-CRM-033 | R3.4 Founder Decision Cockpit | Mein Arbeitstag, drei erklärbare Prioritäten, Decision Brief, Pipeline Movement, Aging, Relationship Field und Datenvertrauen | Produkt/UX/QA/AI-Governance | **lokal-synthetisch umgesetzt; keine externe KI oder Außenwirkung** |
| PO-CRM-034 | R3.5 Operational Conversion & Outreach Readiness | Kontaktentscheidung, kombinierter Preflight und deduplizierte Aufgabenconversion | Vertrieb/Marketing/Datenschutz/QA | **lokal-synthetisch umgesetzt 12.10.2026; keine Rechts- oder Versandfreigabe** |
| PO-CRM-035 | Reihenfolge der nächsten Produktivgates | zuerst Reale Daten, danach enger kontrollierter Einzelversand und separat erlaubte Research-Quellen; jedes Gate unabhängig | PO/Recht/Datenschutz/Security/Kosten | **nur vorbereitet; Einzelbeschlüsse weiterhin erforderlich** |
| PO-CRM-036 | Zwecktrennung der Arbeitsflächen | Arbeitstag = Handeln; Cockpit = Steuern; Pipeline = operative Detailarbeit | Produkt/UX/QA | **R3.6 lokal-synthetisch umgesetzt** |
| PO-CRM-037 | Auswertungs- und Berichtssicht | belegte lokale Diagramme; interne Analyse getrennt von bereinigter Berichtsansicht | Produkt/Datenschutz/Kommunikation | **R3.6 lokal-synthetisch umgesetzt; Export, Versand und externe Freigabe gesperrt** |
| PO-CRM-038 | G1 Real-Data Readiness starten | zehn dokumentierte Entry-Gates; kein automatischer Go-live | Datenschutz/Recht/Security/Betrieb/PO | **Readiness-Paket begonnen; G1 bleibt NO-GO** |
| PO-CRM-039 | G1 Entry Gates ausführlich schließen und Entscheidung vorbereiten | interne Nachweise lokal-synthetisch vervollständigen; externe/technische/PO-Gates nicht fingieren | Datenschutz/Recht/Security/Betrieb/PO | **R3.7 umgesetzt; Entscheidungspaket vollständig, G1 bleibt NO-GO** |
| PO-CRM-040 | G1-03/G1-06 bis an reale Freigabegrenzen führen | Quellen-/Kanal- und Informationspflichtvertrag, Zugriffsschutzregister, Geräte-/Session-Evidenz und Negativtests; keine fingierte Rechts- oder Sicherheitsfreigabe | Datenschutz/Recht/Security/Betrieb/PO | **R3.8 lokal-synthetisch umgesetzt; externe und technische Nachweise offen, G1-10 bleibt NO-GO** |
| PO-CRM-041 | gewachsene Bereiche auf echte Informations- und Ansichtsdoppelungen prüfen | zusammenführen nur bei identischem Seitenzweck; Übersicht, Arbeitsfläche und Analyse bei unterschiedlicher Aufgabe erhalten | Produkt/UX/QA | **R3.9 geprüft und lokal-synthetisch konsolidiert; System & Freigaben aus Growth entkoppelt, übrige begründete Trennungen erhalten** |
| PO-CRM-042 | lokale Restore-Evidenz ergänzen und G1-01/05/07/09 konkret entscheidungsvorbereiten | isolierter In-Memory-Round-Trip ohne Live-State-Mutation; Empfehlungen bleiben bis datiertem Einzelbeschluss unverbindlich | PO/Betrieb/Datenschutz/Security/QA | **R3.10 lokal-synthetisch umgesetzt; G1 bleibt NO-GO, externe und organisatorische Nachweise offen** |
| PO-CRM-043 | G1-01/05/07/09 als lokale Arbeitslogik beschließen und technisch angleichen | enger Datenumfang; Reviewintervalle statt Auto-Löschung; RPO 24 h/RTO 4 h/tägliche Sicherung; Incident-Erstablauf; keine G1-10-Wirkung | PO/Betrieb/Datenschutz/Security/QA | **R3.11 lokal-synthetisch angeglichen; G1-03, G1-06, Fremdnachweise und G1-10 bleiben gesperrt** |
| PO-CRM-044 | verbleibende G1-/C1-Nachweise bis an die lokale Grenze vorbereiten | Origin-Schutz, Security-Header, Dateirechte, offizielle G1-03-Quellen, Geräte-/Betriebsevidenz, C1-Kostenrahmen und G1-10-Paket; keine externe Freigabe fingieren | PO/Betrieb/Datenschutz/Security/QA | **R3.12 lokal-synthetisch umgesetzt; Firewall-Blocker und Fremdnachweise offen; C1 und G1-10 nicht freigegeben** |
| PO-CRM-045 | C1-Teilentscheidungen und lokale Gerätehärtung protokollieren | Betreiber Zaki Amawi; Vertretung Van Vardanian; internes Privacy-/Contract-Ownership Zaki Amawi; Budget 50–100 EUR mit 100-EUR-Obergrenze; Synthetic-only; 5-Minuten-Sperre; Firewall aktiviert | PO/Betrieb/Datenschutz/Security/Kosten | **teilweise beschlossen und lokal angeglichen; Security Review, Vertreterannahme, externe Prüfung, Provider/Region und Kauf offen; C1 nicht autorisiert** |
| PO-CRM-046 | große AMAVIO-Altdatenliste lokal bearbeiten, an den CRM-Arbeitsstrang übergeben und im CRM sichtbar machen | getrenntes lokales Echtdaten-Staging; Core bleibt synthetisch; Organisationen vor Kontakten; IDs, 31 Mehrfachgruppen, Namensprüfungen, Quarantäne und Sperren erhalten | PO/Datenqualität/Datenschutz/QA | **R3.15 lokal umgesetzt; alle realen Kontakte DNC, kein Outreach, kein Cloud-/Supabase-/App-/ACC-Pfad** |
| PO-CRM-047 | Importdaten nicht als Pool-/Prüfübersicht, sondern ausschließlich in den bestehenden fachlichen Reitern führen | Organisationen im Reiter `Organisationen`, Kontakte im Reiter `Kontakte`; technische Datenprüfung nur im Hintergrund | PO/Produkt/UX/Datenqualität/QA | **R3.16 umgesetzt; sichtbarer Staging-Reiter entfernt, Daten lokal lesend integriert, Kontaktsperren erhalten** |
| PO-CRM-048 | Integrierte Organisationen und Kontakte auch über die bestehende globale Suche auffindbar machen | ab zwei Zeichen lokale Core-Treffer plus begrenzte lokale Abfrage der schreibgeschützten Importdaten; Navigation ausschließlich in die bestehenden fachlichen Reiter und Detailansichten | PO/Produkt/UX/Datenqualität/QA | **R3.17 lokal umgesetzt; keine Datenübernahme, Mutation, Cloud-Verbindung oder Outreach-Freigabe** |
