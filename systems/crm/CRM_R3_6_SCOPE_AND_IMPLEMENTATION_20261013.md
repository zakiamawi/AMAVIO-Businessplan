# AMAVIO One CRM – R3.6 Workspaces, Analytics & G1 Readiness

**Stand:** 13.10.2026  
**Reifegrad:** Lokaler synthetischer CRM-Core-Prototyp – fachlich und technisch geprüft, nicht produktiv freigegeben

## Anlass

Die bisherige Startseite verwendete für „Mein Arbeitstag“ und „Cockpit“ dieselbe React-Komponente. Lediglich Überschrift und Einleitung wechselten. Dadurch waren Tagesarbeit, Unternehmenssteuerung, Pipeline-Zusammenfassung, Datenqualität und Outreach-Readiness gleichzeitig sichtbar. Die separate Pipeline war zwar bereits der operative Bearbeitungsraum, wirkte neben der wiederholten Pipeline-Grafik im Cockpit aber wie eine zweite Pipeline.

Die bisherige Auswertung bestand überwiegend aus einem kopierbaren Textblock. Sie war korrekt begrenzt, half aber nur eingeschränkt dabei, Entwicklung, Verteilung, Alterung und Datenqualität visuell zu verstehen.

## Erhalten

- AMAVIO-Farbwelt, Typografie, Logo, linke Navigation und bestehende Informationshierarchie;
- kanonische CRM-Objekte, Status- und Übergangslogik, Detaildrawer, Formulare, Suche, Filter, Archivierung und Undo;
- lokale SQLite-/Browser-Persistenz mit ausschließlich synthetischen Daten;
- Research- und Outreach-Vorbereitung ohne produktiven Versand;
- Kontaktentscheidung, Outreach-Preflight und deduplizierte Aufgabenconversion aus R3.5;
- getrennte Produkt- und Codegrenzen zu App und ACC;
- bestehende R3.5-Sicherung und unveränderte R3.5-Ausgangsarbeitskopie.

## Verändert

### Mein Arbeitstag

Der Arbeitstag ist nun ein eigener Arbeitsraum. Er zeigt ausschließlich:

- drei priorisierte Vorgänge;
- Termine und Wiedervorlagen;
- offene beziehungsweise in Arbeit befindliche Aufgaben;
- kompakte Kontakt- und Follow-up-Kontexte.

Pipeline-Verteilung, Datenvertrauen, G1-Gates und Outreach-Preflight wurden dort entfernt.

### Cockpit

Das Cockpit ist nun der strategische Steuerungsraum. Es zeigt:

- aktive Chancen, ungewichtetes Potenzial, Entscheidungsreife und überfällige Schritte;
- eine nicht editierbare „Pipeline-Lage“ als aggregierte Steuerungssicht;
- Entscheidungsreife, Bewegung und Alterung;
- Beziehungsabdeckung und Datenvertrauen;
- drei Managemententscheidungen mit direktem Sprung in die zugehörige Chance.

Die eigentliche Pipeline bleibt der einzige operative Ort für Board, Liste, Filter und Detailbearbeitung.

### Auswertungen

Die frühere Textzusammenfassung wurde durch eine datenabgeleitete Analysefläche ersetzt:

- Zeitraumwahl 30 Tage, Quartal und Gesamt;
- Pipeline-Verteilung nach Anzahl und Potenzial;
- Aktivitätsentwicklung aus tatsächlich datierten CRM-Ereignissen;
- Statusmix, Quellen, Alterung und Datenqualität;
- interner Management-Brief;
- bereinigte Berichtsansicht ohne Kontakte, Notizen oder interne Fragestellungen.

Die Kennzahlen sind keine Prognosen. Es werden keine historischen Reihen erfunden.

### Sichtbare Systeminformationen

Entwicklungs-, Versions- und technische Reifegradtexte wurden aus Arbeitstag, Cockpit und Auswertungen entfernt. Systemstatus, Speichermodus, Sicherungen und produktive Sperren sind auf „Daten & Sicherung“ konzentriert.

Die Kontaktentscheidung und der Outreach-Preflight wurden nicht entfernt, sondern aus dem überladenen Cockpit in den eigenen Unterbereich „Kontaktfreigabe“ innerhalb von „Recherche & Outreach“ verschoben. Dort bleiben Kontaktdetails, Nachweise und die einmalige Aufgabenconversion vollständig bedienbar.

## Neu hinzugefügt

- `src/components/WorkdayView.jsx`
- `src/components/AnalyticsView.jsx`
- `src/components/G1ReadinessPanel.jsx`
- `src/components/OperationalReadinessPanel.jsx`
- `src/domain/analytics.js`
- vier R3.6-Designkonzepte unter `design/r3-6/`
- isolierter R3.6-Speicherschlüssel und lokale R3.6-SQLite-Arbeitsdatei
- Unit- und Komponententests für Workspace-Trennung, Analytik und G1-Sperre

## Nur vorbereitet

G1 bewertet die Eintrittsreife für einen späteren, gesonderten Beschluss zur Nutzung realer Geschäftskontaktdaten. Es aktiviert keine reale Datenverarbeitung.

## Weiterhin gesperrt

- reale personenbezogene oder geschäftliche Kontaktdaten;
- produktiver Import;
- Authentifizierung und rollenbasierte Zugriffskontrolle;
- Mehrbenutzer- und Mandantenbetrieb;
- produktiver E-Mail- oder Massenversand;
- Live-Scraping und Umgehung technischer Schutzmaßnahmen;
- produktive Provider-, Cloud-, App- oder ACC-Verbindungen;
- Deployment und Veröffentlichung.

