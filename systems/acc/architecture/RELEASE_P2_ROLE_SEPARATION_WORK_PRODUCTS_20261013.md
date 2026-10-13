# Release P.2 – Role Separation & Usable Work Products

## Entscheidung

Release P.2 ersetzt die gemeinsame Arbeitgeber-/Operations-Seitenstruktur aus P.1 durch zwei fachlich getrennte Arbeitsverträge auf derselben lokalen Auftragsdomäne.

## Rollenvertrag

### Arbeitgeber

Der Arbeitgeber sieht Programmstand, betriebliche Folgen, Entscheidungsfristen, Handlungsoptionen, beauftragten Leistungsumfang, Status, Ergebnis und Abnahmeunterlagen. Er sieht keine internen Ausführungsformulare, Prüferläuterungen oder Leistungsnachweisprotokolle.

Navigation: `Startübersicht → Entscheidungen → Aufträge an AMAVIO → Ergebnisse`.

### AMAVIO Operations

Operations sieht Arbeitsvorrat, freigegebene Leistungsaufträge, aktuellen Arbeitsschritt, Nachweisanforderungen, Bearbeitungsnotiz, Nachweisreferenz, offene Abhängigkeiten und kontrollierte Ergebnisübergabe. Operations sieht keine Arbeitgeber-Optionswahl oder Arbeitgeberfreigabeformulare.

Navigation: `Arbeitsvorrat → Aktive Aufträge → Übergabebereit → Leistungsnachweise`.

## Gemeinsamer Zustandsvertrag

`Arbeitgeberentscheidung → Leistungsauftrag → Operations-Übernahme → Nachweisführung → Ergebnisübergabe → Arbeitgeberabnahme`

Die Rollen teilen Zustand und Auftragskennung, aber weder dieselbe Aufgabenoberfläche noch dieselbe Dokumentensicht.

## Arbeitsprodukte

Arbeitgeber:

- Ergebnisbrief für den Arbeitgeber
- Startfreigabeprotokoll

Operations:

- Leistungsnachweis
- Übergabedossier

Der Server erzwingt die Rollenzuordnung dieser vier Dokumenttypen. Ein Arbeitgeberzugriff auf interne Operations-Nachweise und ein Operationszugriff auf Arbeitgeber-Abnahmeunterlagen werden mit HTTP 403 abgewiesen.

## Technische Grenze

- lokale SQLite-Demopersistenz;
- synthetische Sessions und synthetische Fälle;
- optimistische Versionierung und Idempotenz bleiben erhalten;
- keine Provideraufrufe, produktive Identity, externen Daten oder Außenwirkungen;
- keine Integration, Nachricht, Buchung, Veröffentlichung oder Deployment.

