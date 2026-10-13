# AMAVIO One CRM – Capability-Gap- und Wahrheitsmatrix

**Stand:** 09.10.2026  
**Baseline:** gesicherter lokaler Prototyp vom 08.10.2026  
**Prüfobjekt:** datierte Canonical-Core-Arbeitskopie vom 09.10.2026  
**Zulässige Reifegradbezeichnung:** **Lokaler synthetischer CRM-Core-Prototyp – fachlich und technisch geprüft, nicht produktiv freigegeben**

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
| Pipeline | sechs Phasen, Rail und Liste | **Belastbar implementiert** | Rail, Board, Liste, Filter, Detail, erlaubte Übergänge und append-only Phasenaktivität; finales Governance-Modell offen. |
| Kontakte | Liste ohne wirksames CRUD | **Belastbar implementiert** | lokales Anlegen, Anzeigen, Bearbeiten, Archivieren/Wiederherstellen, Organisations- und Chancenbezug. |
| Organisationen/Accounts | nur Textwerte in Chancen | **Belastbar implementiert** | eigenes kanonisches Objekt mit CRUD, Detail, Beziehungen und Archivstatus. |
| Partner | statisches Ledger | **Teilweise implementiert** | Suche, Liste, Detail und Partnerkontakte erreichbar; Partner-CRUD ist bis PO-CRM-005 bewusst nicht umgesetzt. |
| Aufgaben | Liste und Statusumschaltung | **Belastbar implementiert** | lokales CRUD, Abschluss/Wiederöffnung, Beziehungen, Detail, Archivierung und leere Zustände. |
| Auswertungen | statischer Weekly Brief | **Teilweise implementiert** | lokaler dynamischer Wochenüberblick und Kopieren; keine gespeicherten Reports, Forecast-Zusage oder externe Quelle. |
| Globale Suche | Suchfeld filterte primär Chancen | **Belastbar implementiert** | durchsucht Organisationen, Kontakte, Chancen, Aufgaben und Partner; `⌘/Strg K`, leere Zustände und Detailnavigation geprüft. |
| Filter | Chancenphase und Owner | **Teilweise implementiert** | funktionsfähige Pipeline-, Owner-, Status-, Archiv- und Textfilter in Kernansichten; kein globaler gespeicherter Filterbaukasten. |
| Neue Chance | lokales Formular mit Organisation als Text | **Belastbar implementiert** | kanonische Organisation und Kontakt, Pflichtfelder, Plausibilität, synthetische Herkunft und Bestätigung. |
| Bearbeitung | Chance teilweise bearbeitbar | **Belastbar implementiert** | Organisation, Kontakt, Chance und Aufgabe lokal bearbeitbar; Phasenwechsel ausschließlich über Übergangsvertrag. |
| Notizen | überschreibbares Chance-Textfeld | **Teilweise implementiert** | Arbeitsnotiz plus append-only Aktivitätstimeline; eigenständiges Notizobjekt modelliert, UI-CRUD bewusst noch nicht ausgerollt. |
| Wochenüberblick | kopierbarer statischer Text | **Teilweise implementiert** | wird aus aktuellem lokalen Zustand erzeugt und kann kopiert werden; kein Versand, kein Datei-Export. |
| Export | deaktivierte Schaltfläche | **Gate-gesperrt** | sichtbar und eindeutig „nicht verfügbar“; Format, Rechte, Datenschutz und Verwendungszweck offen. |
| Tastaturkürzel | `⌘ K` nur dargestellt | **Belastbar implementiert** | `Meta/Ctrl+K`, Escape, Focus-Trap und Focus-Rückgabe browserbasiert geprüft. |
| Chance-Detail | einfacher Drawer | **Belastbar implementiert** | Beziehungen, Aufgaben, Aktivitäten, Phase, Historie, Bearbeitung, Archivierung und ACC-Gate erreichbar. |
| Kontakt-Detail | Pfeil ohne Wirkung | **Belastbar implementiert** | erreichbar, bearbeitbar, Organisation und beteiligte Chancen verknüpft. |
| Organisations-Detail | nicht vorhanden | **Belastbar implementiert** | erreichbar, bearbeitbar, Kontakte und Chancen verknüpft. |
| Partner-Detail | nicht vorhanden | **Teilweise implementiert** | erreichbar mit Status, Kontakt und Produktgrenze; Bearbeitung geparkt. |
| Aufgaben-Detail | nicht vorhanden | **Belastbar implementiert** | erreichbar, bearbeitbar, verknüpfte Chance und Statusaktionen. |
| Responsive Verhalten | 1600 und 430 grob geprüft | **Belastbar implementiert** | 1600, 1280, 1024 und 430 Pixel sowie 200-%-Reflow ohne Seitenüberlauf; breite Tabellen/Schienen scrollen intern. |
| Accessibility | Grundlabels und Reduced Motion | **Teilweise implementiert** | Dialogsemantik, Fehlermarkierung, Escape, Focus-Trap, Focus-Rückgabe, Tastaturweg und 200-%-Reflow geprüft; kein externer WCAG-Audit/Screenreader-Matrix. |
| Lokale Persistenz | unvalidiertes `localStorage` v1 | **Belastbar implementiert** | validiertes v2-Schema; Neuladen geprüft; v1-Schlüssel wird weder importiert noch überschrieben. |
| Reset | direkter Seed-Reset | **Belastbar implementiert** | Bestätigungsdialog, synthetischer Seed, sichtbare Rückmeldung und Undo. |
| Undo | nicht vorhanden | **Belastbar implementiert** | letzte reversible lokale Mutation einschließlich Reset kann zurückgenommen werden; keine mehrstufige Historie. |
| Archivierung | nicht vorhanden | **Belastbar implementiert** | Organisation, Kontakt, Chance und Aufgabe werden reversibel archiviert und wiederhergestellt; keine physische Löschung. |
| Dublettenerkennung | nicht vorhanden | **Belastbar implementiert** | lokaler nicht blockierender Hinweis für Organisation, Kontakt und Chance; keine automatische Zusammenführung. |
| Aktivitätstimeline | nicht vorhanden | **Belastbar implementiert** | manuelle synthetische Aktivitäten und systemische Phasenereignisse werden chronologisch angezeigt. |
| Status-/Phasenhistorie | nicht vorhanden | **Belastbar implementiert** | erlaubte Übergänge schreiben Aktivität und Audit-Ereignis; Ausgangszustand wird nicht mutiert. |
| Fehler-/Bestätigungszustände | teilweise still | **Belastbar implementiert** | Feldfehler, Beziehungsfehler, Toasts, Bestätigungsdialoge, Leerzustände und lokale Speicherfehler sind sichtbar. |
| ACC-Übergabe | lokaler Hinweis bei gewonnenen Chancen | **Gate-gesperrt** | nur Review-Marker und Vertragsentwurf; kein Fall, kein Payload, keine Übertragung, keine Benachrichtigung. |
| App-Abgrenzung | dokumentiert | **Belastbar implementiert** | separate Produkt- und Codebasis bleibt unverändert; keine App-Referenz wird technisch aufgelöst. |
| Authentifizierung | nicht vorhanden | **Gate-gesperrt** | gesondertes Product-Owner-/Security-Gate. |
| Produktive Datenbank | nicht vorhanden | **Gate-gesperrt** | Architektur-, Kosten-, Datenschutz- und Security-Entscheidung offen. |
| E-Mail/Kalender/Cloud | nicht vorhanden | **Gate-gesperrt** | keinerlei Connector, Login, API-Aufruf oder Synchronisation aktiviert. |
| Dokumentenspeicher | nur kanonische Referenz modelliert | **Gate-gesperrt** | keine Dateiablage oder Cloud-Verbindung. |
| Mehrbenutzer-/Mandantenfähigkeit | nicht vorhanden | **Gate-gesperrt** | Rollen-/Sichtbarkeitsentwurf ist keine technische Zugriffskontrolle. |
| Reale Daten/Import | nicht vorhanden und unzulässig | **Gate-gesperrt** | nur synthetische Seeds, `.invalid`-Adressen und lokale Eingaben; kein Import. |
| Produktive KI/Automatisierung | nicht vorhanden | **Gate-gesperrt** | keine produktive KI und keine externe Kommunikation. |
| Hosting/Deployment | nicht vorhanden | **Gate-gesperrt** | nur lokaler Server; kein Push, Upload, Deployment oder Release. |

## Bewusst nicht aus der IGS-Referenz übernommen

- M&A-, Pflegeunion-, Kaufpreis- und Transaktionslogik;
- geografische Deal-/Standortkarte;
- Gmail-, Drive- und HubSpot-artige Connector-Aktionen;
- automatische externe Erinnerungen und Käuferkommunikation;
- produktive KI-Generierung;
- automatische ACC- oder App-Übergabe.

## Offene Entscheidungen

Nicht durch Implementierungsannahmen geschlossen sind: finales Pipeline-Governance-Modell, Rollen und Feldrechte, rechtliche Aufbewahrung, produktive IDs, Datenbank, Hosting, Authentifizierung, Integrationen, reale Importquelle, ACC-Nachrichtenformat, Exportrechte und produktive Übersetzungsstrategie. Details stehen in `CRM_PRODUCT_OWNER_DECISIONS.md`.
