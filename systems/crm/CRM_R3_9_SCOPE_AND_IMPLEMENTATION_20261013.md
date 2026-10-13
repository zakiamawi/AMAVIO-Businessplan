# AMAVIO One CRM – R3.9 IA Consolidation

**Datum:** 13.10.2026  
**Ausgangsbasis:** `20261013_AMAVIO_One_CRM_R3_8_G1_Legal_Access_Assurance_Working`  
**Sicherung:** `20261013_AMAVIO_One_CRM_R3_8_Sicherung_Pre_IA_Consolidation`  
**Arbeitskopie:** `20261013_AMAVIO_One_CRM_R3_9_IA_Consolidation_Working`

## Auftrag

R3.9 prüft Informations-, Ansichts- und Navigationsdoppelungen im gewachsenen lokalen CRM. Änderungen sind nur zulässig, wenn ein belegtes Duplikat, ein falscher Seitenkontext oder eine missverständliche Verantwortungsgrenze vorliegt.

## Umgesetzt

1. **Systembereich entkoppelt**
   - „Daten & Sicherung“ ist nicht mehr zugleich Hauptbereich und Growth-Unterregister.
   - Der neue Hauptbereich heißt „System & Freigaben“.
   - Die Seite besitzt eine eigene Überschrift, Zweckbeschreibung und Reifegradkennzeichnung.

2. **Growth-Bereich fokussiert**
   - Enthält nur noch Lead Research, Outreach-Entwürfe und konkrete Kontaktfreigabe.
   - Growth-Kennzahlen und -Navigation rahmen keine System- oder G1-Funktionen mehr ein.

3. **Datenvertrag bereinigt**
   - Zeigt ausschließlich technische Zustandsmerkmale: Schema, synthetischer Datentyp, Speichermodus und letzte lokale Änderung.
   - Produktive Sperren werden weiterhin an ihren fachlich zuständigen G1- und Außenaktionsgrenzen dargestellt.

4. **G1-Verantwortung verständlicher benannt**
   - „Eintrittsgates“ wird in der Navigation als „Gate-Übersicht“ bezeichnet.
   - „Nachweise & Beschluss“ wird zu „Prüfspur & Beschluss“.
   - Die Gate-Ansicht erklärt ihren Status- und Steuerungszweck.

5. **Kontaktfreigabe als Fallprüfung geschärft**
   - Überschrift und Einleitung unterscheiden die konkrete Datensatzprüfung von den generellen Regeln unter „System & Freigaben“.

## Bewusst erhalten

- Mein Arbeitstag, Cockpit, Pipeline und Auswertungen bleiben getrennte Arbeitsflächen.
- Pipeline-Lage im Cockpit bleibt als Managementverdichtung mit Link zur Detail-Pipeline erhalten.
- Tagesaufgaben bleiben eine begrenzte Priorisierung und ersetzen nicht den Aufgabenbereich.
- Kontakt-/Follow-up-Ausschnitt im Arbeitstag ersetzt nicht das Arbeitsjournal.
- Die bereinigte Berichtsansicht bleibt von der internen Analyse getrennt.

## Technische Grenze

- Datenmodell und Schema bleiben bei **v7**.
- Der vorhandene R3.8-Storage-Key und die vorhandene lokale SQLite-Vertragsdatei bleiben erhalten; R3.9 ist eine Informationsarchitektur- und UX-Konsolidierung, keine Datenmigration.
- Standardport der neuen Arbeitskopie: `127.0.0.1:4385`.
- Reale Daten, Login, Connectoren, Versand, externe Recherche, Cloud, Mehrbenutzerbetrieb, App, ACC und Deployment bleiben unverändert gesperrt.

## Abnahme

R3.9 ist erfüllt, wenn:

- „System & Freigaben“ direkt erreichbar ist und keine Growth-Unterregister-Navigation enthält;
- „Research & Outreach“ keinen Sicherungs-/Systemreiter mehr enthält;
- Growth und System jeweils eine zutreffende Seitenüberschrift besitzen;
- die G1-Fachregister vollständig erreichbar bleiben;
- alle bisherigen Kernpfade und Persistenzverträge regressionsfrei bestehen;
- Desktop, Zwischenbreiten, Mobile, Tastatur und echter 200-%-Zoom ohne Seitenüberlauf geprüft sind;
- keine Browserkonsolenfehler auftreten.

