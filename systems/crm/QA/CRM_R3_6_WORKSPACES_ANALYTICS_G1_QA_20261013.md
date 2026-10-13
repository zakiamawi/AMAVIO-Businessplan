# QA – R3.6 Workspaces, Analytics & G1 Readiness

**Datum:** 13.10.2026  
**Arbeitskopie:** `20261013_AMAVIO_One_CRM_R3_6_Workspaces_Analytics_G1_Readiness_Working`  
**Reifegrad:** Lokaler synthetischer CRM-Core-Prototyp – fachlich und technisch geprüft, nicht produktiv freigegeben

## Sicherung und Isolation

- R3.5-Server-Snapshot vor Beginn erstellt: `backup-mv5vkovj`.
- vollständige unveränderte Sicherung: `20261013_AMAVIO_One_CRM_R3_5_Sicherung_Pre_R3_6_G1`.
- neue R3.6-Arbeitskopie vor Änderungen checksum-basiert gegen R3.5 geprüft.
- neue isolierte SQLite-Datei `local-data/amavio-one-crm-r3-6.sqlite` aus dem konsolidierten R3.5-Stand erstellt.
- R3.5-Quelle und Sicherung wurden nicht überschrieben.

## Fachliche QA

- „Mein Arbeitstag“ und „Cockpit“ verwenden unterschiedliche Komponenten und unterschiedliche Informationsaufträge.
- Pipeline-Lage im Cockpit ist nur eine Aggregation; operative Filter, Board, Liste und Detailbearbeitung liegen ausschließlich in der Pipeline.
- Auswertungen verwenden vorhandene Chancen, Status, Quellen, Aufgaben und datierte Ereignisse.
- keine erfundene Umsatzprognose oder historische Wertreihe.
- interne Analyse und bereinigte Berichtsansicht sind sichtbar getrennt.
- Kontaktentscheidung, Outreach-Preflight und Aufgabenconversion wurden aus dem Cockpit in die eigene Kontaktfreigabe verschoben und bleiben erreichbar.
- G1 zeigt zehn Eintrittsgates und bleibt technisch ohne Aktivierungsfunktion.

## Sichtbarkeits-QA

Arbeitsseiten wurden auf folgende unzulässige sichtbare Inhalte geprüft:

- Codex, ChatGPT, Claude oder Agentenbezeichnungen;
- Prompt- oder Entwicklungsanweisungen;
- Arbeitsordnerpfade;
- QA- und R3.x-Entwicklungsstatus als operativer Seiteninhalt.

Ergebnis: keine solchen Inhalte in Arbeitstag, Cockpit, Pipeline, Auswertungen, Kontaktfreigabe oder Daten & Sicherung. Systemstatus und G1-Grenzen sind auf „Daten & Sicherung“ gebündelt.

## Technische QA

Finaler Stand:

- `npm run build`: **bestanden**, 1.602 Module transformiert; Produktions-Bundle lokal erzeugt.
- statisches QA-Gate: **bestanden**; Markenanker, Produktgrenzen, Dokumente, Speicherisolation, fehlende externe Fetch-Pfade und geschlossene Außenfähigkeiten geprüft.
- Unit-Tests: **25/25 bestanden**.
- Vertragstests: **9/9 bestanden**.
- Komponententests: **9/9 bestanden**.
- Integrationstests: **4/4 bestanden**.
- Persistenztest: **1/1 bestanden**; SQLite-Speichern, Snapshot, JSON-Ausgabe, Reset, Restore und Ablehnung nicht-synthetischer Importe geprüft.
- End-to-End: **20 zusammenhängende Kernabläufe bestanden**; Browserkonsole ohne Fehler.
- Browser-QA: **bestanden**; sechs Arbeitsflächen pro Breite, keine unbenannten Schaltflächen, kein Seitenüberlauf und keine sichtbaren Entwicklungs-/Assistenzbegriffe.

Geprüfte Browsergrößen:

- Desktop 1600 × 1000;
- Desktop 1280 × 900;
- kritische Zwischenbreite 1024 × 900;
- Tablet 768 × 1024;
- Mobile 430 × 932 und 390 × 844;
- echten 200-Prozent-Zoom;
- Tastatur, `⌘/Ctrl K`, Escape, Focus-Trap und Focus-Rückgabe;
- Browserkonsole ohne Fehler;
- sichtbare Trennung von Arbeitstag, Cockpit und Pipeline;
- Diagramme, interner/berichtsfähiger Ansichtswechsel, G1-Sperre und Kontaktfreigabe.

Der echte 200-Prozent-Lauf verwendete ein isoliertes Chromium-Profil: 1.280 Pixel Außenbreite reflowten auf 640 CSS-Pixel; `bodyScrollWidth` und `bodyWidth` betrugen jeweils 640 Pixel. Tastatur, `Ctrl/⌘ K`, Skip-Link, Escape, Focus-Trap und Focus-Rückgabe bestanden. Die Browserkonsole blieb über alle geprüften Flächen fehlerfrei.

Zusätzliche Sichtprüfung des final gebauten lokalen Servers auf `http://127.0.0.1:4377/`: Kontaktfreigabe einschließlich Versandsperre sichtbar; alle sechs Auswertungsdiagramme sichtbar; bei 1.280 Pixeln `bodyWidth = scrollWidth = 1.280`; Statusmix und Quellen ohne Überschneidung; keine Konsolenfehler.

Evidenz:

- `QA/CRM_R3_6_BROWSER_RESULT_20261013.json`
- `QA/Screenshots/20261013-r3-6/`

## Während der QA gefundene und behobene Punkte

- die bei 768 Pixeln zu enge Desktop-Shell verursachte horizontalen Überlauf; der Tablet-Breakpoint wurde auf die kompakte Shell umgestellt;
- der alte E2E-Berichtspfad erwartete die abgelöste Textzusammenfassung; er prüft nun die datenbasierte Auswertung und bereinigte Berichtsansicht;
- Kontaktentscheidung und Preflight waren nach der Cockpit-Entlastung nur noch fachlich im Core vorhanden; die Funktionen wurden als eigener Bereich „Kontaktfreigabe“ wieder vollständig erreichbar gemacht;
- Mobile-Screenshots wurden erst nach Abschluss der Seitenleistenanimation aufgenommen;
- Statusmix und Quellenbereich wurden für Zwischenbreiten entzerrt; 200-Prozent-Reflow wurde nochmals geprüft.

## Nicht geprüft oder nicht freigegeben

- reale personenbezogene Daten;
- rechtliche Zulässigkeit eines konkreten Kontaktfalls;
- Authentifizierung, externe Angriffsoberfläche oder Mehrbenutzersicherheit;
- Versand, Scraping, Connectoren, Cloud, App, ACC oder Deployment.

