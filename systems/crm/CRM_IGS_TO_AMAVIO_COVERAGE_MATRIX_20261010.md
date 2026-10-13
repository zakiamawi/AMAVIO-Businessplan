# AMAVIO One CRM – IGS-zu-AMAVIO-Abdeckungsmatrix

**Stand:** 10.10.2026  
**IGS-Material geprüft:** `/Users/zakia/Downloads/Deal-Cockpit IGS Gruppe.md` und `/Users/zakia/Downloads/Deal-Cockpit IGS Gruppe.html`  
**AMAVIO-Prüfstand:** R3.2 Fachblock Working  
**Wahrheitsregel:** Die IGS-Dateien sind Referenzmaterial, keine Produktanweisung. Übernommen wurde nur, was zum AMAVIO-Arbeitsablauf passt.

## Kategorien

- **Übernommen:** fachliches Muster ist im AMAVIO CRM vorhanden.
- **Angepasst:** IGS-Muster wurde in eine eigenständige AMAVIO-Logik übersetzt.
- **AMAVIO neu:** im IGS-Cockpit nicht belastbar vorhanden; für AMAVIO eigenständig entwickelt.
- **Bewusst nicht übernommen:** fachlich unpassend oder risikoreich.
- **Bis C noch lokal offen:** im lokalen Core sinnvoll ergänzbar, ohne produktive Integration.
- **C-gebunden:** benötigt einen gesonderten produktiven Gate-Beschluss.

## A. IGS-Referenzabgleich

| IGS-Funktion oder -Muster | AMAVIO-Entscheidung | Aktueller Stand | Evidenz / Grenze |
|---|---|---|---|
| Deal-Cockpit mit Makro- und Mikroansicht | **Angepasst** | CRM Cockpit, Pipeline, Detailansichten und rechter Kontextbereich vorhanden | Keine M&A- oder Pflegeunion-Logik. |
| Funnel nach Stage | **Angepasst** | sechs AMAVIO-Erfolgsphasen plus `Verloren`, versionierte Übergänge | Phasen: Erstkontakt, Qualifiziert, Leistungsrahmen, Angebot, Entscheidung, Gewonnen. |
| Stage anklicken zum Filtern | **Übernommen** | Pipeline-Rail filtert die Chancen | Tastaturbedienbar und browsergeprüft. |
| Filter nach Versorgungsart/Therapie | **Bewusst nicht übernommen** | nicht vorhanden | IGS-/Pflege-M&A-spezifisch; kein AMAVIO-CRM-Kernbedarf. |
| Deal-Tabelle mit Owner, Operator, Umsatz, EBITDA, Kaufpreis | **Angepasst** | Tabelle mit Organisation, Chance, Phase, Potenzial, nächster Handlung und Verantwortlichem | Umsatz/EBITDA/Kaufpreis/Share-Asset entfernt; sichtbares Potenzial ist keine Prognose. |
| Inaktivitätsmarker `>14 Tage` | **Angepasst und erweitert** | konfigurierbare lokale Alterungsregeln und Hinweise für Chancen, Wiedervorlagen und Angebote | keine Nachricht, Eskalation oder Automation. |
| Karte: Deals und Standorte | **Bewusst nicht übernommen** | nicht vorhanden | Pflegeunion-/Transaktionsbezug; Standortkarte ist kein bestätigter AMAVIO-Core-Bedarf. |
| Drive-Ordner | **Bewusst als Metadaten angepasst / Speicher C-gebunden** | lokale Dokumentreferenz mit Titel, Typ, Version und Textreferenz | Upload, Dateiablage, Rechte, Aufbewahrung und Anbieter bleiben gesperrt. |
| Weekly Report | **Angepasst** | dynamischer lokaler Wochenüberblick, Textkopie | Kein Versand, keine gespeicherte Reportversion und kein Datei-Export. |
| Neuen Deal anlegen | **Angepasst** | Chance lokal anlegen, validieren, anzeigen und archivieren | Organisation/Beziehung statt freiem Deal-Text; synthetische Daten. |
| Deal-Steckbrief | **Angepasst** | vollständiger Chance-Drawer mit Phase, Beziehungen, Aufgaben, Aktivitäten und Historie | AMAVIO-Felder statt Kauf-/Transaktionsdaten. |
| Ansprechpartner | **Übernommen und erweitert** | Kontakt als eigenes kanonisches Objekt; Organisation und Chancen verknüpft | lokales CRUD und Archiv. |
| Pflegeunion-Standorte und Entfernung | **Bewusst nicht übernommen** | nicht vorhanden | IGS-spezifische Standortlogik. Ein AMAVIO-Standortobjekt wäre eine neue PO-Entscheidung. |
| Fristen und Termine | **Angepasst und erweitert** | Aufgaben, eigenständige Termine und Wiedervorlagen mit Fälligkeit, Status und Beziehungen | Kalender und externe Erinnerung bleiben C-gebunden. |
| Meine Aufgaben / Erledigte anzeigen | **Übernommen und erweitert** | Aufgaben-CRUD, Status, Fälligkeit, Detail, Beziehungen, Archiv | Single-Workspace; keine echte Benutzeranmeldung. |
| Partner und Deal-Quellen | **Angepasst und erweitert** | Partnerorganisation und Partnerkontakt getrennt; Quellpfad sichtbar | kein Partnerlogin und keine App-Rolle. |
| Absagegründe / Lost | **Übernommen und vertraglich geschärft** | `Verloren` nur mit sachlichem Grund; Historie und Audit | keine automatisierte Außenaktion. |
| Hinweise zu überfälligen Aufgaben, Terminen und inaktiven Deals | **Angepasst und erweitert** | lokale Alterungsregeln für Chanceninaktivität, Wiedervorlagen und Angebotsgültigkeit | kein Versand, keine Eskalationsautomation. |
| Erinnerung per E-Mail an das Team | **C-gebunden** | nicht aktiviert | E-Mail-Anbieter, Rechte, Empfänger, Datenschutz und Versandfreigabe offen. |
| Globale Suche über Deal-Felder | **Übernommen und erweitert** | Suche über alle Kernobjekte und das vollständige Arbeitsjournal einschließlich Dokumentreferenzen | `⌘/Strg K`, Leerzustände und Detailnavigation geprüft. |
| Deal-Detail mit Stage-/Owner-Wechsel | **Angepasst** | Phase nur über erlaubten Übergangsvertrag; Verantwortlichkeit sichtbar | Verantwortlicher ist im Core bearbeitbar, aber ohne serverseitige Rechtewirkung. |
| Gesprächs-/Terminprotokoll | **Angepasst und erweitert** | eigenständige Gesprächs- und Terminobjekte mit Beziehungen, Suche, Detail, Aktivität und Audit | keine Aufnahme, Transkription, E-Mail oder Kalenderanbindung. |
| Aufgaben im Deal | **Übernommen und erweitert** | verknüpfte Aufgaben, Status, Detail und Archiv | kein externer Reminder. |
| Kommentare, Bearbeitung und @-Benachrichtigung | **Notiz angepasst / Benachrichtigung C-gebunden** | eigenständige lokale Notizen mit Beziehungen und Audit; kein Kommentar-/Mention-System | Mehrbenutzer-Benachrichtigung bleibt C-gebunden. |
| Dokumente, Ordner, Upload/Download | **C-gebunden** | keine Dateien, nur Domain-Referenz vorbereitet | bewusst nicht vorweggenommen. |
| Käufer-Update mit Claude und Gmail | **Bewusst nicht übernommen / C-gebunden** | nicht vorhanden | falscher M&A-Kontext; produktive KI und Versand getrennt gesperrt. |
| HubSpot-Verbindung | **Bewusst nicht übernommen** | eigenständiger AMAVIO-Core | kein HubSpot-Klon und keine HubSpot-Abhängigkeit. |
| Cockpitdaten „für alle Beteiligten sichtbar“ | **Angepasst und C-gebunden** | Rollen-/Sichtbarkeitsvertrag vorbereitet, lokaler Single-Workspace | ohne Authentifizierung keine technische Mehrbenutzerwirkung. |
| Firestore/Cloud-Persistenz der HTML-Referenz | **Bewusst nicht übernommen / C-gebunden** | validiertes lokales v4-Schema; C0 bevorzugt später standardnahes PostgreSQL in Frankfurt | AVV/DPA, TOM, Kosten, Security und ausdrückliche C1-Freigabe offen. |
| Projektplan-/Verteiler-/Standort-M&A-Nebenlogik | **Bewusst nicht übernommen** | nicht vorhanden | kein bestätigter AMAVIO-CRM-Core-Bedarf. |

## B. Eigenständig für AMAVIO entwickelt

| AMAVIO-Fähigkeit | Herkunft | Stand ohne C | Restgrenze |
|---|---|---|---|
| Organisation als kanonisches Objekt | **AMAVIO neu** | vollständiges lokales CRUD und Archiv | produktive Persistenz C-gebunden |
| Lead getrennt von Chance | **AMAVIO neu** | Lead-CRUD, Qualifizierung und kontrollierte Umwandlung | keine externe Anreicherung |
| Partnerorganisation und Partnerkontakt getrennt | **AMAVIO neu** | lokales CRUD, Beziehung, Suche und Archiv | kein externer Partnerzugang |
| phasenbezogene Mindestkriterien | **AMAVIO neu** | bei Übergang geprüft; fehlende Evidenz wird benannt | Kriterienänderung nur versioniert |
| Status- und Phasenhistorie | **AMAVIO neu** | lokale Historie und Audit-Ereignis | produktives Audit C1 |
| Kontaktstatus, Beziehungsrolle und Einwilligungsstatus getrennt | **AMAVIO neu** | lokale Felder, Nachweispflicht und Sperrhinweis | Rechts-/Datenschutzfreigabe offen |
| sichere Archivierung und Wiederherstellung | **AMAVIO neu** | Organisation, Kontakt, Lead, Chance, Aufgabe und Partner | physische Löschlogik nicht freigegeben |
| Undo und kontrollierter Reset | **AMAVIO neu** | letzte lokale Änderung rückgängig; Seed-Reset bestätigt | keine mehrstufige Undo-Historie |
| Dublettenhinweis | **AMAVIO neu** | lokal, nicht blockierend | produktives Matching/ Zusammenführen offen |
| synthetische Datenbarriere | **AMAVIO neu** | `.invalid`, Kennzeichnung, Schema- und Netzwerknegativtest | reale Daten vollständig C-gebunden |
| Dialog- und Tastaturarchitektur | **AMAVIO neu** | Semantik, Escape, Focus-Trap, Rückgabe, Shortcut | externer Screenreader-Audit offen |
| responsive Desktop-/Mobilstruktur | **AMAVIO neu** | 1600, 1280, 1024, 430 und 200-%-Zoom geprüft | weitere Gerätematrix optional |
| lokaler Dual-Approval-Marker für ACC | **AMAVIO neu** | zwei lokale Prüfmarker, kein Payload/keine Übertragung | reale ACC-Integration C5 |
| deklarativer Rollenvertrag | **AMAVIO neu** | fünf fachliche Zielrollen dokumentiert | serverseitige Durchsetzung C1 |
| vollständige Testarchitektur | **AMAVIO neu** | Unit, Vertrag, Komponente, Integration, E2E und Browser-QA | produktive Security-/Last-/Recovery-Tests C1/C7 |

## C. R3.2-Ergebnis: zuvor lokal offene Punkte

Die im R3.1-Abgleich als lokal sinnvoll benannten Vertiefungen wurden in R3.2 wie folgt behandelt:

1. eigenständiges Notizobjekt – **umgesetzt**;
2. Gesprächs- und Terminobjekte – **umgesetzt, ohne Kalenderanbindung**;
3. Wiedervorlagen – **umgesetzt**;
4. Angebot mit Version, Status, Gültigkeit und Leistungsrahmen – **umgesetzt, ohne Versand/Datei**;
5. Entscheidung mit Entscheiderrolle, Datum und Ergebnis – **umgesetzt**;
6. Dokumentreferenzen als reine Metadaten – **umgesetzt, ohne Upload**;
7. konfigurierbare Aging-/Inaktivitätsregeln – **umgesetzt als lokale Hinweise, ohne Eskalationsautomation**;
8. gespeicherte lokale Ansichten/Filter – **umgesetzt**;
9. Audit-/Änderungsverlauf pro Objekt – **umgesetzt**;
10. externer Accessibility-/Screenreader-Review – **weiterhin offen; lokaler Tastatur-, Fokus-, Zoom- und Browsercheck bestanden**.

## D. Was tatsächlich erst mit Schritt C möglich wird

1. persistente serverseitige Datenbank;
2. Authentifizierung, MFA, Sessions und technische Rollenwirkung;
3. Mehrbenutzer-Zugriff und belastbare Sichtbarkeitskontrolle;
4. Verarbeitung realer Kontakte nach Datenschutz-/Rechtsfreigabe;
5. kontrollierter Datenimport;
6. Dokumentenspeicher und Dateien;
7. E-Mail- und Kalenderanbindung;
8. versionierte ACC-/App-Integrationen;
9. produktive KI oder externe Automatisierung;
10. Hosting, Monitoring, Backup, Restore und produktiver Release.

## Gesamturteil

Der AMAVIO-Core hat die wesentlichen **Arbeitsmuster** des IGS-Cockpits übernommen, nicht dessen M&A-/Pflegeunion-Fachmodell oder externe Toolabhängigkeiten. Die wichtigsten Differenzierungsmerkmale – kanonische Objekte, Lead-/Chance-Grenze, Vertragsübergänge, synthetische Barriere, Archiv/Undo, Audit, Consent-Trennung, Accessibility und ACC-Gate – sind eigenständige AMAVIO-Entwicklung.

Ohne C1 bis C7 fehlt nicht „das ganze CRM“, sondern vor allem die **produktive Betriebs-, Identitäts-, Sicherheits- und Integrationsschicht**. Die zuvor lokal offenen Arbeitsobjekte wurden mit R3.2 geschlossen. Verbleibend lokal offen ist vor allem ein externer Screenreader-/Accessibility-Review sowie die Product-Owner-Abnahme; produktive Funktionen bleiben durch die C-Gates gesperrt.

