# Release P.1 – Designsystem-Erweiterung

Stand: 13.10.2026  
Basis: `RELEASE_P_DESIGN_SYSTEM_20261013.md`

## Entscheidung

Release P.1 behält die freigegebene ruhige, editoriale Release-P-Gestaltung. Es entsteht kein neues Dashboardthema und kein sichtbares KI-Modul. Die neue Dienstleistungsmechanik wird mit denselben Navy-, Gold-, Weiß-, Linien-, Schrift- und Radius-Tokens umgesetzt.

## Rollenbezogene Oberfläche

### Arbeitgeber

- Navigation: Startfähigkeit, Entscheidung & Übergabe, Arbeitsprodukte, Programme.
- Hauptaufgabe: Option bewerten, Leistungsrahmen lesen, Auftrag begründet übergeben und Ergebnis verfolgen.
- Rechte Spalte: verbindlicher Leistungsauftrag mit AMAVIO-Leistung, Arbeitgebermitwirkung, Servicefenster, Abnahmekriterien und Nicht-Leistung.
- Nach Übergabe: Auftragsnummer, Fortschrittsleiste und gesperrte Entscheidung.
- Nach Abschluss: Ergebnis, Restbedingung, nächster Prüfpunkt und Nachweis.

### AMAVIO Operations

- Navigation: Auftragslage, Ausführung, Ergebnisübergaben, Programme.
- Kein Options- oder Freigabeformular.
- Eigenständiger Ausführungsraum mit Auftrag, Servicefenster, Abnahmebedingung, Arbeitgeberbeitrag und sequenziellen Nachweisschritten.
- Ergebnisübergabe erscheint erst nach vollständig belegten Schritten.

## Dichte und Hierarchie

- keine zusätzlichen globalen Tabs;
- Arbeitskontext bleibt offen und linear statt in verschachtelten Karten;
- Details stehen direkt am Auftrag, nicht in technischem Audit oder Kernel-Sprache;
- Arbeitgeber erhält Ergebnis- und Verantwortungsinformationen, aber keine internen Prüferläuterungen;
- mobile Darstellung bleibt einspaltig und unterbricht Tabellen in lesbare Sequenzen;
- Off-Canvas-Navigation wird auf schmalen Viewports explizit geclippt, damit kein horizontaler Dokumentüberlauf entsteht.

## Arbeitsproduktdarstellung

- dokumentnahe Dialogdarstellung mit Referenz, Version, Status, Verantwortung und Aktualisierung;
- strukturierte Abschnitte, Listen und Evidenztabelle;
- lokale Druckansicht ohne App-Chrome;
- keine Download- oder Exportbehauptung, weil kein Datei-Service implementiert ist.

## Visuelle Vergleichspunkte

1. Navy-Seitenleiste und weiße Arbeitsfläche bleiben unverändert.
2. Fraunces bleibt ausschließlich für fachliche Hauptüberschriften und Ergebniszeilen eingesetzt.
3. Gold kennzeichnet Auftrag, aktive Bedingung und menschliche Übergabe; Grün ausschließlich belegten Abschluss.
4. Keine Verläufe, Leuchteffekte, Chatflächen oder dekorativen KI-Indikatoren.
5. Desktop behält klare Zwei-Spalten-Entscheidung; Operations erhält einen breiten Ausführungsraum.
6. Tablet und Mobil brechen alle Auftrags- und Evidenzinformationen ohne horizontale Pflichtnavigation um.

