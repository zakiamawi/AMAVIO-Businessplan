# AMAVIO One CRM – Capability-Gap- und Wahrheitsmatrix

## R3.17-Addendum – Einheitliche globale Suche 13.10.2026

| Capability | R3.17-Wahrheitsstatus | Evidenz / Grenze |
|---|---|---|
| Globale Suche im synthetischen Core | **belastbar lokal implementiert** | Organisationen, Kontakte, Leads, Chancen, Aufgaben, Partner und Arbeitsjournal bleiben über den vorhandenen lokalen Index auffindbar. |
| Globale Suche in eingebundenen Importdaten | **belastbar lokal und lesend implementiert** | Ab zwei Zeichen werden bis zu sechs Organisationen und sechs Kontakte aus der getrennten lokalen SQLite-Staging-Datenbank ergänzt. |
| Treffer-Navigation | **belastbar lokal implementiert** | Importtreffer wechseln in `Organisationen` oder `Kontakte` und öffnen den zentral gehaltenen schreibgeschützten Detaildialog. |
| Lade-, Fehler- und Leerezustände | **belastbar lokal implementiert** | Unvollständige Eingabe, lokale Abfrage, Teilfehler der Importquelle und vollständiger Leertreffer sind unterscheidbar. |
| Bearbeitung importierter Datensätze | **bewusst nicht implementiert** | Kein stilles Kopieren in den synthetischen Core; importierte Einträge bleiben unverändert und schreibgeschützt. |
| Supabase-/Cloud-Suche | **Gate-gesperrt** | Kein Projekt, Login, Schlüssel, Connector, Netzwerkpfad oder Cloud-Sync wurde eingerichtet oder verwendet. |


## R3.14-Addendum – External Review Readiness 13.10.2026

| Capability | R3.14-Wahrheitsstatus | Evidenz / Grenze |
|---|---|---|
| Security-Review-Paket | **vollständig vorbereitet / Review offen** | Prüfumfang, Negativtests, Severity und Abnahmeformat definiert; kein Reviewer benannt |
| Vertretungsübergabe | **Annahmeprotokoll vorbereitet / nicht angenommen** | Van Vardanian bleibt ohne beidseitige Bestätigung und Trockenlauf nur benannte Vertretung |
| Datenschutz-/Vertragsprüfung | **externes Briefing vorbereitet / Prüfung offen** | DPA-, Transfer-, Subprozessor-, Verwaltungsdaten- und Exitfragen strukturiert |
| Provider-/Regionsentscheidung | **entscheidungsreif / keine Auswahl** | getrennte Optionen freigegeben, nicht freigegeben und zurückgestellt; kein Providerzugriff |
| Firewall | **beobachteter Blocker** | `system_profiler`: Allow all incoming connections; `socketfilterfw`: State 0 |
| C1 Gate Closure | **Prüfpaket vollständig / Implementierung NO-GO** | `c1ImplementationAuthorized=false`, kein Kauf, kein Projekt, keine realen Daten |

## R3.13-Addendum – C1 Decision Closure 13.10.2026

| Capability | R3.13-Wahrheitsstatus | Evidenz / Grenze |
|---|---|---|
| C1 technischer Betreiber | **PO-beschlossen** | Zaki Amawi; keine Provideraktivierung |
| C1 Vertretung | **benannt / operativer Nachweis offen** | Van Vardanian; Annahme, Erreichbarkeit und Übergabe fehlen |
| Security Review | **nicht besetzt / Gate-gesperrt** | leere Nutzerangabe wurde nicht ergänzt |
| Datenschutz-/Vertragsprüfung | **intern zugeordnet / externe Prüfung offen** | Zaki Amawi/Gründer; keine unabhängige Rechts- oder Datenschutzfreigabe |
| C1 Budget | **Planungsrahmen beschlossen** | 50–100 EUR brutto/Monat, harte Planungsobergrenze 100 EUR; Kauf und Add-ons nicht freigegeben |
| Provider/Region | **nicht eindeutig entschieden** | Supabase/Frankfurt bleibt Vorschlag, weil „freigegeben/nicht freigegeben“ keine Auswahl enthält |
| Bildschirmsperre | **belastbar lokal konfiguriert** | 300 Sekunden, Passwort aktiv, Verzögerung 0 |
| FileVault | **lokal beobachtet** | Systemeinstellungen zeigen „Ein“; keine Schlüssel gelesen |
| Firewall | **konfiguriert / Nachweiswiderspruch offen** | UI dauerhaft „Aktiv“, Legacy-CLI weiter `State = 0` |
| C1 Datenumfang | **PO-beschlossen** | ausschließlich synthetisch; Echtdaten, Versand und Integrationen gesperrt |

## R3.12-Addendum – G1 External & Technical Readiness 13.10.2026

| Capability | R3.12-Wahrheitsstatus | Evidenz / Grenze |
|---|---|---|
| Same-Origin-Schutz für Änderungen | **belastbar lokal implementiert** | Cross-Site- und abweichende Origin-Anfragen werden mit 403 abgewiesen; lokale CLI-Anfragen ohne Origin bleiben für Tests möglich |
| Browser-Schutzheader | **belastbar lokal implementiert** | CSP, Frame-, Referrer-, MIME-, Permissions- und Cross-Origin-Grenzen; kein Beleg einer vollständigen Security-Freigabe |
| lokale Datei- und Verzeichnisrechte | **belastbar lokal implementiert** | `0700` für Daten-/Exportordner, `0600` für SQLite/WAL/SHM/JSON; Persistenztest |
| Geräte-Firewall | **beobachteter technischer Blocker** | macOS Application Firewall am 13.10.2026 read-only als deaktiviert beobachtet; nicht verändert |
| Geräteverschlüsselung und Sperrzeit | **nicht verifiziert** | lokale Abfragen ergaben keinen belastbaren Freigabenachweis |
| G1-03 offizielle Rechts-/Datenschutzgrundlage | **teilweise vorbereitet / extern gesperrt** | Primärquellen, Informationsentwurf, LIA-Vorlage und VVT-Entwurf vorhanden; Rechtsprüfung und Rechtseinheit offen |
| G1-07/09 Betriebsevidenz | **teilweise lokal belegt** | Copy-Nachweis, SQLite-Integrität, Restore-Drill und Runbook; verschlüsselter Speicher, Vertretung und Ziel-Restore offen |
| C1 Provider-/Kostenentscheidung | **entscheidungsvorbereitet / nicht autorisiert** | offizieller Regionen-, MFA-, RLS-, Preis- und Backuprahmen dokumentiert; kein Login, Projekt, Kauf oder Smoke-Test |
| G1-10 | **Product-Owner-Gate gesperrt** | konsolidiertes NO-GO-Paket; Produktivflags bleiben `false` |

## R3.11-Addendum – G1 Product-Owner Decision Alignment 13.10.2026

| Capability | R3.11-Wahrheitsstatus | Evidenz / Grenze |
|---|---|---|
| G1-01 Datenumfang & Zweck | **lokal PO-beschlossen** | fünf zulässige Klassen, Ausschlussklasse und sechs enge CRM-Zwecke; produktive Ansprache bleibt ausgeschlossen |
| G1-05 Lebenszyklus | **lokal PO-beschlossen / extern zu validieren** | Reviewintervalle beschlossen, automatische Löschung verboten; Datenschutz- und Vollzugsnachweis offen |
| G1-07 Sicherung & Restore | **lokal PO-beschlossen / Betriebsevidenz offen** | RPO 24 h, RTO 4 h, täglicher Rhythmus und Hauptverantwortung; Verschlüsselung, Vertretung und Ziel-Restore offen |
| G1-09 Incident & Rückabwicklung | **lokal PO-beschlossen / externe Fristen offen** | Erstablauf und Hauptkoordination beschlossen; Vertretung, Erreichbarkeit und Rechtsfristen offen |
| G1-10 Real-Data-Freigabe | **Product-Owner-Gate gesperrt** | PO-CRM-043 ist ausdrücklich kein G1-10-Beschluss; alle Produktivflags bleiben `false` |


## R3.8-Addendum – G1 Legal & Access Assurance 13.10.2026

| Capability | R3.8-Wahrheitsstatus | Evidenz / Grenze |
|---|---|---|
| Quellen-/Zweck-/Kanal-Entscheidung | **belastbar lokal implementiert** | sieben Pfade im Domainvertrag und in der UI; keine produktive Freigabe |
| Informationspflicht-Versionierung | **teilweise implementiert** | vier Artefakte mit Trigger, Version und Evidenzanforderung; finale Rechtstexte offen |
| Widerspruch/Kontaktsperre | **belastbar lokal implementiert** | Sperrstatus blockiert verbundene Entwürfe; kein externer Versand vorhanden |
| Produktive Rechtsfreigabe | **durch Recht/Datenschutz-Gate gesperrt** | externe Fall- und Kanalprüfung erforderlich |
| lokale Schutzgrenzen | **belastbar lokal implementiert** | Loopback-Bindung, Synthetic-Only-Vertrag, Outbound-Sperre |
| Authentifizierung/Autorisierung/Sitzung | **nicht implementiert und technisch gesperrt** | Ziel- und Negativtestvertrag vorhanden, keine Login-Behauptung |
| Geräte-/Backupverschlüsselung | **durch externen Nachweis gesperrt** | Ausführungsumgebung konnte Verschlüsselungsstatus nicht verifizieren |
| G1-10 Real-Data-Freigabe | **Product-Owner-Gate gesperrt** | Entry-Checkliste vorhanden; `releaseEligible=false` |

## R3.7-Addendum – G1 Entry Gate Closure 13.10.2026

| Capability | R3.7-Wahrheitsstatus | Evidenz / Grenze |
|---|---|---|
| G1 Gate Register | **Belastbar implementiert – lokal/synthetisch** | Zehn Gates besitzen maschinenlesbare ID, Verantwortung, Nachweis, nächsten Schritt und differenzierten Status. Kein Gate aktiviert reale Daten. |
| Datenzweck und Klassifikation | **Entscheidungsreif / lokal belegt** | Sechs Datenklassen mit Zweck, Schutz, Minimierung und ausdrücklicher Ausschlussklasse sind dokumentiert und sichtbar. Verbindlicher Erstumfang bleibt PO-Entscheidung. |
| Herkunftsprüfung | **Belastbar implementiert – synthetischer Bestand** | Aktive Testkontakte werden auf Quelle, Datum und Qualitätsstatus geprüft. Ein realer Stichprobenstandard bleibt offen. |
| Lebenszyklus | **Teilweise implementiert / entscheidungsreif** | Sechs Fristenregeln und lokaler Trockenlauf vorhanden; keine automatische produktive Löschung, keine Rechtsfreigabe. |
| Import und Quarantäne | **Belastbar implementiert – nur synthetisch** | Vorschau, v6-Vertrag, unbekanntes Schema, Quarantäneregel und Rollback-Snapshot sind vertraglich/testseitig abgedeckt. Reale Quelle und Produktivimport bleiben gesperrt. |
| Incident Readiness | **Teilweise implementiert / entscheidungsreif** | Stop-/Isolation-/Bewertungs-/Restore-/Dokumentationsfolge wird synthetisch protokolliert. Personen, Meldeweg und realer Wiederanlauf fehlen. |
| Zugriffsschutz | **Nicht implementiert / technisch gesperrt** | Zielvertrag dokumentiert; keine Authentifizierung, Gerätekontrolle, Sitzungssperre oder technisch erzwungenen Rechte. |
| Rechts-/Informationspflichten | **Vorbereitet / extern gesperrt** | Status- und Policy-Entwurf vorhanden; keine fachlich/rechtliche Freigabe je Quelle, Zweck und Kanal. |
| G1 Freigabe | **Nicht erteilt / PO-gesperrt** | Entscheidungspaket ist vollständig; `realDataEnabled=false`, `outboundEnabled=false`, `releaseEligible=false`. |

## R3.6-Addendum – 13.10.2026

| Capability | R3.6-Wahrheitsstatus | Evidenz / Grenze |
|---|---|---|
| Mein Arbeitstag | **Belastbar implementiert – lokal/synthetisch** | Eigene Arbeitsfläche für drei Prioritäten, Agenda, Aufgaben und Wiedervorlagen; keine Pipeline- oder Management-Dublette. |
| Cockpit | **Belastbar implementiert – lokal/synthetisch** | Strategische Geschäftslage mit Kennzahlen, Pipeline-Zusammenfassung, Entscheidungsreife, Aging, Beziehungen und Datenvertrauen; keine Tagesagenda. |
| Pipeline | **Belastbar implementiert – lokal/synthetisch** | Bleibt die operative Detailfläche für Filter, Phasenarbeit, Bearbeitung und Historie. Die Darstellung im Cockpit ist nur eine verdichtete Lageübersicht. |
| Auswertungen | **Belastbar implementiert – lokal/synthetisch** | Zeitraumsteuerung und Diagramme für Pipeline, Aktivität, Status, Quellen, Aging und Datenqualität werden aus dem aktuellen CRM-Zustand abgeleitet; keine erfundene Historie oder Prognose. |
| Interne Analyse / Berichtsansicht | **Teilweise implementiert** | Die Berichtsansicht blendet Management-Brief, personenbezogene Detailnotizen und interne Fragen aus. Download, Versand, Rollenprüfung und belastbarer externer Freigabeprozess sind nicht implementiert. |
| Sichtbare Informationshygiene | **Belastbar implementiert – aktueller lokaler Stand** | Entwicklungsstände, Prompt-/Assistenzbezug und technische Releasetexte wurden aus den regulären Arbeitsflächen entfernt. Sicherheitsgrenzen wie „synthetisch“ oder „Versand gesperrt“ bleiben dort sichtbar, wo sie für eine sichere Bedienung erforderlich sind. |
| Kontaktfreigabe / Outreach-Preflight | **Belastbar implementiert – lokal/synthetisch** | Die aus R3.5 erhaltene Kontaktentscheidung, der Preflight und die deduplizierte Aufgabenconversion sind als eigene Arbeitsfläche unter Recherche & Outreach erreichbar und belasten weder Arbeitstag noch Cockpit. |
| G1 Real-Data Readiness | **Teilweise implementiert; NO-GO** | Zehn Readiness-Gates und ein nachvollziehbarer lokaler Status sind sichtbar. Dies ist eine Vorbereitung, keine Freigabe oder Aktivierung realer Daten. |
| Reale Kontaktdaten | **Gate-gesperrt** | Keine reale Person, produktive Organisation oder produktive Einwilligung wird verarbeitet. |
| Authentifizierung, Rollenwirkung, Import, Versand, Live Research und Connectoren | **Gate-gesperrt** | Keine Aktivierung in R3.6. Die vorbereiteten fachlichen Verträge sind keine technische Integration. |

**Stand:** 09.10.2026  
**Baseline:** gesicherter lokaler Prototyp vom 08.10.2026  
**Prüfobjekt:** datierte R3-Contract-Alignment-Arbeitskopie vom 09.10.2026  
**Zulässige Reifegradbezeichnung:** **Lokaler synthetischer CRM-Core-Prototyp – fachlich und technisch geprüft, nicht produktiv freigegeben**

> **R3.1-Ergänzung vom 10.10.2026:** Der fachliche IGS-Abgleich ist zusätzlich in `CRM_IGS_TO_AMAVIO_COVERAGE_MATRIX_20261010.md` dokumentiert.  
> **R3.2-Fortschreibung vom 10.10.2026:** Der begrenzte lokale Fachblock ist jetzt als Arbeitsjournal umgesetzt. C0 wurde nur fachlich entschieden; C1 bis C7 bleiben technisch gesperrt. Neue Evidenz: `CRM_R3_2_SCOPE_AND_IMPLEMENTATION_20261010.md` und `CRM_C0_DECISION_PACKAGE_20261010.md`.
> **R3.3-Fortschreibung vom 10.10.2026:** Interne Owner-CRM-Ausrichtung, lokale SQLite-Persistenz, synthetischer Import/Export, Recherche- und Outreach-Core sind umgesetzt. C1 Cloud ist geparkt; produktiver Versand und Connectoren bleiben eigene Folgegates. Neue Evidenz: `CRM_R3_3_SCOPE_AND_IMPLEMENTATION_20261010.md`.
> **R3.4-Fortschreibung vom 10.10.2026:** Die lokale Entscheidungsoberfläche leitet Founder Focus, Decision Brief, Pipeline Movement, Aging, Relationship Field und Datenvertrauen aus dem tatsächlichen synthetischen Zustand ab. Es gibt keine externe KI, keine autonome Mutation und keine Außenwirkung.

## Bewertungslogik

Jede Capability erhält für den aktuellen Stand genau eine Kategorie:

- **Belastbar implementiert:** lokal ausführbar, echte Zustandsänderung, reproduzierbare QA im definierten Prototyp-Scope.
- **Teilweise implementiert:** sinnvoll nutzbarer Ausschnitt, aber fachliche oder technische Kernanteile bleiben offen.
- **Nur visuell dargestellt:** sichtbar, aber ohne vollständige Wirkung.
- **Nicht implementiert:** weder sichtbar noch funktional vorhanden.
- **Bewusst geparkt:** derzeit ausdrücklich nicht Teil des lokalen Core-Scope.
- **Gate-gesperrt:** benötigt gesonderte Product-Owner-, Datenschutz-, Rechts-, Daten-, Kosten-, Security- oder Integrationsfreigabe.

„Belastbar“ bezieht sich ausschließlich auf den lokalen synthetischen Prototyp. Es ist keine Produktions-, Datenschutz- oder Security-Freigabe.

## Aktuelle Wahrheitsmatrix

| Capability | Vorher vorhanden | Kategorie 09.10.2026 | Aktuelle Evidenz und Grenze |
|---|---|---|---|
| CRM Cockpit | redaktionelle Übersicht mit Fokus, Pipeline und Aufgaben | **Belastbar implementiert** | Kennzahlen, Fokus und Hinweise werden aus kanonischen synthetischen Objekten abgeleitet; keine externe Wirkung. |
| Mein Arbeitstag / Founder Focus | nicht als eigener Einstieg vorhanden | **Belastbar implementiert** | maximal drei begründete lokale Prioritäten mit direktem Detailpfad; deterministische Regeln, keine externe KI. |
| Decision Brief / Entscheidungsreife | nicht vorhanden | **Belastbar implementiert** | bestätigt, Annahme, offene Frage und Empfehlung werden getrennt; Score zählt sechs sichtbare Vollständigkeitsdimensionen und ist keine Abschlusswahrscheinlichkeit. |
| Pipeline Movement / Aging | einzelne Pipelinewerte und lokale Alterungshinweise | **Belastbar implementiert** | aktueller Bestand, dokumentierte Phasenereignisse und Inaktivität seit letzter tatsächlicher Aktivität; keine erfundene Historie. |
| Relationship Field / Datenvertrauen | Beziehungen in Details verteilt | **Belastbar implementiert** | zentraler Organisations-, Kontakt-, Entscheider- und Partnerkontext sowie Quelle, Aktualität, Vollständigkeit und Dublettenhinweis. |
| Pipeline | sechs Phasen, Rail und Liste | **Belastbar implementiert** | Pipeline v1.0, erlaubte Übergänge, phasenbezogene Mindestkriterien, benannte offene Evidenz, Historie, Rail, Board und Liste sind im lokalen synthetischen Scope geprüft. |
| Kontakte | Liste ohne wirksames CRUD | **Belastbar implementiert** | lokales Anlegen, Anzeigen, Bearbeiten, Archivieren/Wiederherstellen, Organisations- und Chancenbezug. |
| Organisationen/Accounts | nur Textwerte in Chancen | **Belastbar implementiert** | eigenes kanonisches Objekt mit CRUD, Detail, Beziehungen und Archivstatus. |
| Leads | nicht als eigene Objektklasse vorhanden | **Belastbar implementiert** | eigenes Objekt mit CRUD/Archiv, Statusfilter, Suche, Detail und kontrollierter Konvertierung in eine Erstkontakt-Chance; ungeprüfte Signale bleiben außerhalb der Pipeline. |
| Partner | statisches Ledger | **Belastbar implementiert** | Partnerorganisationen und getrennte Partnerkontakte mit lokalem CRUD/Archiv, Suche, Detail und klarer Abgrenzung; kein Partnerlogin und keine App-Rolle. |
| Aufgaben | Liste und Statusumschaltung | **Belastbar implementiert** | lokales CRUD, Abschluss/Wiederöffnung, Beziehungen, Detail, Archivierung und leere Zustände. |
| Auswertungen | statischer Weekly Brief | **Teilweise implementiert** | lokaler dynamischer Wochenüberblick und Kopieren; keine gespeicherten Reports, Forecast-Zusage oder externe Quelle. |
| Globale Suche | Suchfeld filterte primär Chancen | **Belastbar implementiert** | durchsucht Organisationen, Kontakte, Leads, Chancen, Aufgaben, Partner/Partnerkontakte sowie Notizen, Gespräche, Termine, Wiedervorlagen, Angebote, Entscheidungen und Dokumentreferenzen; `⌘/Strg K`, leere Zustände und Detailnavigation geprüft. |
| Filter | Chancenphase und Owner | **Belastbar implementiert** | funktionsfähige Pipeline-, Owner-, Status-, Archiv- und Textfilter; Arbeitsjournal-Filter lassen sich als lokale Ansichten speichern und reversibel entfernen. Kein geteilter Mehrbenutzer-Filterbaukasten. |
| Neue Chance | lokales Formular mit Organisation als Text | **Belastbar implementiert** | kanonische Organisation und Kontakt, Pflichtfelder, Plausibilität, synthetische Herkunft und Bestätigung. |
| Bearbeitung | Chance teilweise bearbeitbar | **Belastbar implementiert** | Organisation, Kontakt, Lead, Chance, Aufgabe, Partnerorganisation und Partnerkontakt lokal bearbeitbar; Phasenwechsel ausschließlich über Übergangsvertrag. |
| Notizen | überschreibbares Chance-Textfeld | **Belastbar implementiert** | eigenständiges lokales Notizobjekt mit Beziehungen, CRUD/Archiv/Wiederherstellung, Suche, Detail, Aktivitäts- und Auditspur. |
| Gespräche | nicht vorhanden | **Belastbar implementiert** | strukturierte lokale Gesprächsdokumentation mit Datum, Kanal, Ergebnis, nächstem Schritt und Beziehungen; keine Aufnahme, Transkription oder Kommunikationsintegration. |
| Termine | nicht vorhanden | **Belastbar implementiert** | lokales Terminobjekt mit Beginn/Ende, Status, Agenda und Beziehungen; keine Kalenderverbindung oder Einladung. |
| Wiedervorlagen | nicht vorhanden | **Belastbar implementiert** | lokales Objekt mit Owner, Fälligkeit, Status und Alterungshinweis; keine externe Erinnerung oder Automation. |
| Angebote | Angebotsphase ohne eigenes Objekt | **Belastbar implementiert** | versioniertes lokales Angebotsobjekt mit Betrag, Gültigkeit, Leistungsrahmen und internen Statuswerten; kein Versand und keine externe Preisfreigabe. |
| Entscheidungen | nur Pipelinephase | **Belastbar implementiert** | lokales Entscheidungsobjekt mit Entscheiderrolle, Status, Datum, Begründung und nächstem Schritt; erzeugt keinen Vertrag oder Auftrag. |
| Dokumentreferenzen | kanonisch nur vorbereitet | **Belastbar implementiert** | lokale Metadaten mit Titel, Typ, Referenz, Version und Status; kein Upload, Cloudspeicher oder Dateiinhalt. |
| Gespeicherte Ansichten | nicht vorhanden | **Belastbar implementiert** | Objekttyp, Suchtext und Status werden nur lokal gespeichert; keine Freigabe oder Mehrbenutzerwirkung. |
| Alterungshinweise | nicht vorhanden | **Belastbar implementiert** | konfigurierbare lokale Hinweise für Chanceninaktivität, Wiedervorlagen und Angebotsgültigkeit; keine Nachricht oder Automation. |
| Wochenüberblick | kopierbarer statischer Text | **Teilweise implementiert** | wird aus aktuellem lokalen Zustand erzeugt und kann kopiert werden; kein Versand, kein Datei-Export. |
| Export | deaktivierte Schaltfläche | **Gate-gesperrt** | Product-Owner-Beschluss: Export bleibt in R3 deaktiviert; spätere Formate, Rechte, Datenschutz und Zweck benötigen einen neuen separaten Vertrag. |
| Tastaturkürzel | `⌘ K` nur dargestellt | **Belastbar implementiert** | `Meta/Ctrl+K`, Escape, Focus-Trap und Focus-Rückgabe browserbasiert geprüft. |
| Chance-Detail | einfacher Drawer | **Belastbar implementiert** | Beziehungen, Aufgaben, Aktivitäten, Phase, Historie, Bearbeitung, Archivierung und ACC-Gate erreichbar. |
| Kontakt-Detail | Pfeil ohne Wirkung | **Belastbar implementiert** | erreichbar, bearbeitbar, Organisation und beteiligte Chancen verknüpft. |
| Organisations-Detail | nicht vorhanden | **Belastbar implementiert** | erreichbar, bearbeitbar, Kontakte und Chancen verknüpft. |
| Partner-Detail | nicht vorhanden | **Belastbar implementiert** | Partnerorganisation und Partnerkontakt erreichbar, bearbeitbar, archivierbar und getrennt voneinander verknüpft. |
| Aufgaben-Detail | nicht vorhanden | **Belastbar implementiert** | erreichbar, bearbeitbar, verknüpfte Chance und Statusaktionen. |
| Responsive Verhalten | 1600 und 430 grob geprüft | **Belastbar implementiert** | 1600, 1280, 1024 und 430 Pixel sowie 200-%-Reflow ohne Seitenüberlauf; breite Tabellen/Schienen scrollen intern. |
| Accessibility | Grundlabels und Reduced Motion | **Teilweise implementiert** | Dialogsemantik, Fehlermarkierung, Escape, Focus-Trap, Focus-Rückgabe, Tastaturweg und 200-%-Reflow geprüft; kein externer WCAG-Audit/Screenreader-Matrix. |
| Lokale Persistenz | unvalidiertes `localStorage` v1 | **Belastbar implementiert** | v5-Vertrag mit SQLite-API auf `127.0.0.1`, Browser-Fallback, v4→v5-Migration und Neuladetest; ältere Schlüssel werden nicht überschrieben. |
| Reset | direkter Seed-Reset | **Belastbar implementiert** | Bestätigungsdialog, synthetischer Seed, sichtbare Rückmeldung und Undo. |
| Undo | nicht vorhanden | **Belastbar implementiert** | letzte reversible lokale Mutation einschließlich Reset kann zurückgenommen werden; keine mehrstufige Historie. |
| Archivierung | nicht vorhanden | **Belastbar implementiert** | Organisation, Kontakt, Chance und Aufgabe werden reversibel archiviert und wiederhergestellt; keine physische Löschung. |
| Dublettenerkennung | nicht vorhanden | **Belastbar implementiert** | lokaler nicht blockierender Hinweis für Organisation, Kontakt und Chance; keine automatische Zusammenführung. |
| Aktivitätstimeline | nicht vorhanden | **Belastbar implementiert** | manuelle synthetische Aktivitäten und systemische Phasenereignisse werden chronologisch angezeigt. |
| Status-/Phasenhistorie | nicht vorhanden | **Belastbar implementiert** | erlaubte Übergänge schreiben Aktivität und Audit-Ereignis; Ausgangszustand wird nicht mutiert. |
| Fehler-/Bestätigungszustände | teilweise still | **Belastbar implementiert** | Feldfehler, Beziehungsfehler, Toasts, Bestätigungsdialoge, Leerzustände und lokale Speicherfehler sind sichtbar. |
| ACC-Übergabe | lokaler Hinweis bei gewonnenen Chancen | **Teilweise implementiert** | zwei getrennte lokale Prüfmarker und Status `approved_marker` sind funktionsfähig; ACC-Fall, Payload, Übertragung, Benachrichtigung und Integration bleiben gate-gesperrt. |
| Zielrollen | keine Rollenstruktur | **Teilweise implementiert** | fünf fachliche Rollen und Sichtbarkeitsbegriffe sind als Vertrag hinterlegt; ohne Authentifizierung keine technische Zugriffskontrolle. |
| Kontakt-/Einwilligungsstatus | vermischte Kontaktangabe | **Teilweise implementiert** | getrennte Felder, Default `unknown`, synthetische Nachweispflichten und sichtbare Sperre bei `withdrawn`, `blocked` oder `do_not_contact`; keine Rechtsprüfung und keine externe Aktion. |
| App-Abgrenzung | dokumentiert | **Belastbar implementiert** | separate Produkt- und Codebasis bleibt unverändert; keine App-Referenz wird technisch aufgelöst. |
| Authentifizierung | nicht vorhanden | **Gate-gesperrt** | gesondertes Product-Owner-/Security-Gate. |
| Lokale synthetische Datenbank | nicht vorhanden | **Belastbar implementiert** | SQLite, WAL, Migrationsregister, Zustandszeile und Snapshots lokal geprüft; keine reale Datenfreigabe. |
| Cloud-/Produktivdatenbank | nicht vorhanden | **Bewusst geparkt** | C1-Unterlagen bleiben als spätere Mehrgeräte-/Teamoption erhalten. |
| E-Mail/Kalender/Cloud | nicht vorhanden | **Gate-gesperrt** | keinerlei Connector, Login, API-Aufruf oder Synchronisation aktiviert. |
| Dokumentenspeicher | lokale Dokumentreferenz-Metadaten vorhanden | **Gate-gesperrt** | Metadaten-CRUD ist lokal implementiert; Dateiablage, Upload, Download und Cloud-Verbindung bleiben vollständig gesperrt. |
| Mehrbenutzer-/Mandantenfähigkeit | nicht vorhanden | **Gate-gesperrt** | Rollen-/Sichtbarkeitsentwurf ist keine technische Zugriffskontrolle. |
| Reale Daten/Import | nicht vorhanden und unzulässig | **Gate-gesperrt** | nur synthetische Seeds, `.invalid`-Adressen und lokale Eingaben; kein Import. |
| Produktive KI/Automatisierung | nicht vorhanden | **Gate-gesperrt** | keine produktive KI und keine externe Kommunikation. |
| Hosting/Deployment | nicht vorhanden | **Gate-gesperrt** | nur lokaler Server; kein Push, Upload, Deployment oder Release. |
| Zielsegmente | nicht vorhanden | **Belastbar implementiert** | lokales Segment mit Passungs- und Ausschlusskriterien, Suche, Audit und Archivvertrag. |
| Lead Research | nicht vorhanden | **Belastbar implementiert** | Quelle, Quellenart, Zeitpunkt, Fit, Status und kontrollierte Lead-Übernahme sind lokal-synthetisch geprüft; kein Live-Abruf. |
| Outreach-Entwürfe | nicht vorhanden | **Belastbar implementiert** | Entwurf, Zweck, Kontakt, Prüfnachweis und lokale Freigabe; kein Versandstatus und kein Provideraufruf. |
| Kontaktsperre/Suppression | Kontaktstatus teilweise | **Belastbar implementiert** | Sperrregister setzt `do_not_contact` und blockiert verbundene Outreach-Entwürfe. |
| Backup/Restore | nur Browserzustand | **Belastbar implementiert** | manuelle SQLite-Snapshots, JSON-Ausgabe, automatische Vorsicherung und Restore-Test. |
| Synthetischer Import/Export | Export gesperrt | **Teilweise implementiert** | portable JSON-Ausgabe und zweistufige synthetische Importprüfung; reale Daten und Anbieterimporte bleiben gesperrt. |
| Produktiver E-Mail-Versand | nicht vorhanden | **Gate-gesperrt, kurzfristig priorisiert** | G2/G3 laut Roadmap; benötigt Provider-, Recht/Privacy-, DNS-, Suppression-, Test- und Kostenfreigabe. |
| Automatisierte Sequenzen/Massenversand | nicht vorhanden | **Gate-gesperrt, kurzfristig priorisiert** | erst nach stabilem Einzelversand; Human Gate, Rate Limits, Bounce-/Complaint-Stop und Kill-Switch verbindlich. |
| Erlaubtes Live Research | nicht vorhanden | **Gate-gesperrt, kurzfristig priorisiert** | nur öffentliche Seiten oder lizenzierte/offizielle APIs nach Quellen- und Kostenprüfung. |
| Schutzumgehung | nicht vorhanden | **Dauerhaft ausgeschlossen** | keine Umgehung von Login, CAPTCHA, Paywall oder Zugriffsschutz. |
| Produktive Connectoren | nicht vorhanden | **Gate-gesperrt, kurzfristig priorisiert** | Brevo, Workspace, Apollo und Airtable jeweils als getrennte Adapter; keine Aktivierung in R3.3. |
| Mehrbenutzerbetrieb | nicht vorhanden | **Gate-gesperrt, kurzfristig priorisiert** | zentrale Identität, Auth/MFA, Autorisierung, Audit und Backup erforderlich. |
| Mandantenfähigkeit | nicht vorhanden | **Gate-gesperrt, nach Mehrbenutzerbetrieb** | nur bei belegtem internen Isolationsbedarf; serverseitige Workspace-Grenze und negative Tests. |
| App-/ACC-Integration | keine | **Gate-gesperrt, kurzfristig fachlich priorisiert** | separate Codebasen und minimale versionierte API-/Eventverträge; kein gemeinsamer Datenbankzugriff. |

## Bewusst nicht aus der IGS-Referenz übernommen

- M&A-, Pflegeunion-, Kaufpreis- und Transaktionslogik;
- geografische Deal-/Standortkarte;
- Gmail-, Drive- und HubSpot-artige Connector-Aktionen;
- automatische externe Erinnerungen und Käuferkommunikation;
- produktive KI-Generierung;
- automatische ACC- oder App-Übergabe.

## Product-Owner-Beschluss und verbleibende Gates

Am 09.10.2026 wurden die Bündel A und B gemäß Empfehlung fachlich beschlossen. Diese R3-Arbeitskopie gleicht den lokalen synthetischen Core technisch an Pipeline v1.0, Lead-/Opportunity-Grenze, Partnerprinzip, fünf deklarative Zielrollen, Trennung der Kontakt-/Consent-Status, Archivierungsgrundsatz, internen Single-Workspace, lokale Dual-Approval-Marker, DE-first, Forecastgrenze und deaktivierten Export an.

Vollständig gesperrt bleiben produktive IDs, Datenbank, Hosting, Authentifizierung, technische Rollenwirkung, reale Daten und Import, Dokumentenspeicher, E-Mail/Kalender, App-/ACC-Integration, produktive KI und Deployment. Rechts-, Datenschutz- und Security-Freigaben sind nicht erteilt. Details stehen in `CRM_PRODUCT_OWNER_DECISIONS.md` und `decision_round/CRM_PRODUCT_OWNER_DECISION_ACTIVATION_20261009.md`.

## R3.5-Ergänzung vom 12.10.2026

| Capability | Status | Evidenz und Grenze |
|---|---|---|
| Kontaktentscheidung „Darf kontaktiert werden?“ | **Belastbar implementiert – lokal/synthetisch** | erklärt Kontaktstatus, Sperre, Kontakt-/Rechtsstatus, Herkunft, Aktualität, Informationsstatus und Synthetikgrenze; keine Rechts- oder Versandfreigabe |
| Outreach-Preflight | **Belastbar implementiert – lokal/synthetisch** | kombiniert Kontaktentscheidung, Entwurf, Kanalprüfnotiz, menschliche lokale Freigabe und deaktivierten Provider; `productiveSendAllowed` bleibt `false` |
| Prüfpunkt → Aufgabe | **Belastbar implementiert – lokal/synthetisch** | verknüpfte Aufgabe mit stabilem `readinessKey`, Audit und Dublettenschutz |
| Real-Data-Gate | **Vorbereitet, vollständig gesperrt** | fachliche Nachweise sichtbar; keine realen Daten aktiviert |
| kontrollierter Einzelversand | **Vorbereitet, vollständig gesperrt** | fachlicher Preflight vorhanden; kein Provider, Sendelog oder externer Schreibweg |
| erlaubtes Live Research | **Vorbereitet, vollständig gesperrt** | Quellen- und Schutzregeln dokumentiert; kein Live-Abruf oder Scraping |

## R3.9-Ergänzung vom 13.10.2026

| Capability | Status | Evidenz und Grenze |
|---|---|---|
| eindeutige Growth-Navigation | **Belastbar implementiert – lokal/synthetisch** | Lead Research, Outreach-Entwürfe und konkrete Kontaktfreigabe; keine System-/Sicherungsdoppelung |
| System & Freigaben | **Belastbar implementiert – lokal/synthetisch** | eigenständiger Hauptbereich für Sicherung, Datenvertrag und G1; keine Growth-Kennzahlen oder Growth-Unterregister |
| Seitenzweck-Trennung | **Belastbar dokumentiert und regressionsgeprüft** | Arbeitstag = handeln, Cockpit = steuern, Pipeline = bearbeiten, Auswertungen = analysieren, System = sichern/freigeben |
| G1 Status- und Evidenzsicht | **Belastbar implementiert – lokal/synthetisch** | Gate-Übersicht und Prüfspur/Beschluss bleiben getrennt und erklären ihren jeweiligen Zweck |
| Datenvertragsanzeige | **Belastbar implementiert – lokal/synthetisch** | zeigt technische Tatsachen statt erneut dieselben Produktivsperren; Schema v7 unverändert |

## R3.10-Ergänzung vom 13.10.2026

| Capability | Status | Evidenz und Grenze |
|---|---|---|
| isolierte SQLite-Restore-Probe | **Belastbar implementiert – lokal/synthetisch** | temporäre In-Memory-Datenbank, Schema-/Synthetikprüfung, SHA-256-Vergleich und `liveStateMutated=false` |
| G1-07 Restore-Evidenz | **Teilweise belegt / entscheidungsreif** | technischer Round-Trip beobachtbar; Verschlüsselung, RPO/RTO, Rotation, Zielumgebung und Verantwortlichkeit bleiben offen |
| G1-01/05/07/09 Beschlussvorlage | **Mit PO-CRM-043 als lokale Arbeitslogik beschlossen** | konkrete Regeln zu Umfang, Zweck, Review, Sicherung und Incident; keine G1-10- oder Produktivwirkung |
| produktiver Wiederanlauf | **Nicht implementiert / Gate-gesperrt** | kein realer Datenbestand, keine freigegebene Zielumgebung, kein produktiver Incident- oder Wiederanlaufprozess |

## R3.15-Ergänzung vom 13.10.2026

| Capability | Status | Evidenz und Grenze |
|---|---|---|
| großer lokaler Altdatenpool | **Belastbar implementiert – lokales Echtdaten-Staging** | 2.242 Organisationen und 3.213 Kontaktkandidaten in separater SQLite-Datei sichtbar |
| bestätigt aktueller Teilbestand | **Belastbar implementiert – lokales Echtdaten-Staging** | 192 Organisationen, 166 deduplizierte Kontakte, 238 Beziehungen |
| externe IDs und Provenienz | **Belastbar implementiert** | Quell-IDs, Datei, Blatt, Zeile und SHA-256-Herkunft bleiben erhalten |
| Mehrfachgruppen | **Belastbar implementiert** | 31 Kontakte mit 103 Zuordnungen als n:m-Beziehungen, ohne Personenduplikation |
| Namensprüfungen | **Belastbar implementiert** | 48 eindeutige Kontakte filterbar markiert; 73 Zuordnungszeilen nachvollziehbar |
| Aktualitätsprüfung | **Belastbar implementiert als Reviewstruktur** | 407 Einträge in fünf getrennten Aktualitäts-/Unsicherheitsklassen; keine automatische Hochstufung |
| Quarantäne und Dublettensignale | **Belastbar implementiert** | 93 Quarantänehinweise und sechs Signale; keine stille Zusammenführung |
| Kontaktsperre | **Belastbar implementiert im Staging** | 3.213/3.213 Poolkontakte und 166/166 bestätigte Kontakte: `do_not_contact=1`, `outreach_approved=0` |
| Staging-Suche und Filter | **Belastbar implementiert** | serverseitig über Organisationen, Kontakte, Reviewqueue und Quarantäne; Pagination und Leerzustand vorhanden |
| Staging-Detailansichten | **Belastbar implementiert** | Organisation, Kontakt, Beziehung, Quelle, Sperre und Provenienz; semantischer Dialog |
| schreibende UI-Bearbeitung realer Daten | **Bewusst geparkt / Gate-gesperrt** | Oberfläche absichtlich GET-only; Korrektur nur über kontrollierte Quelle und Importlauf |
| Übernahme in operativen CRM-Core | **Nicht implementiert / Gate-gesperrt** | synthetischer Core und Echtdaten-Staging bleiben getrennt |
| produktiver Versand / Outreach | **Nicht implementiert / Gate-gesperrt** | kein Adapterpfad; alle realen Kontakte blockiert |
| Supabase-/Cloud-Synchronisierung | **Nicht implementiert / Gate-gesperrt** | `supabaseEnabled=false`, `cloudSyncEnabled=false` |
| App-/ACC-Integration | **Nicht implementiert / Gate-gesperrt** | `appIntegrationEnabled=false`, `accIntegrationEnabled=false` |

## R3.16-Korrektur vom 13.10.2026

| Capability | Status | Evidenz und Grenze |
|---|---|---|
| sichtbarer Pool-/Staging-Reiter | **Korrigiert und aus der Navigation entfernt** | technische Prüfstrukturen bleiben erhalten, sind aber kein CRM-Arbeitsbereich |
| importierte Organisationen im Organisationsreiter | **Belastbar implementiert – lokal/lesend** | 2.242 Datensätze, serverseitige Suche, Pagination, Datenquellenfilter und CRM-Detailansicht |
| importierte Kontakte im Kontaktreiter | **Belastbar implementiert – lokal/lesend** | 3.213 Datensätze, Organisationsbezug, Suche, Pagination und CRM-Detailansicht |
| gemeinsame Sicht auf lokale und importierte Datensätze | **Belastbar implementiert** | `Alle CRM-Daten`, `Lokal angelegt` und `Importiert` innerhalb der beiden bestehenden Reiter |
| schreibende Bearbeitung importierter Datensätze | **Bewusst geparkt / Gate-gesperrt** | Importdaten bleiben bis zum kontrollierten Übernahmevertrag schreibgeschützt |
| Kontaktsperre importierter Kontakte | **Belastbar implementiert** | `Nicht kontaktieren` bleibt in Liste und Detail sichtbar; kein Versandpfad |
| technische Prüfqueue, Quarantäne und Provenienz | **Im Hintergrund erhalten** | weiterhin testbar und dokumentiert, aber nicht als sichtbare CRM-Funktionssammlung dargestellt |
