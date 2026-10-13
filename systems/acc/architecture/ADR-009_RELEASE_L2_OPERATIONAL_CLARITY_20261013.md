# ADR-009 · Operational Clarity

**Datum:** 13.10.2026  
**Status:** lokal umgesetzt  
**Geltung:** Release L.2 der synthetischen ACC-Konzeptdemo

## Entscheidung

Die bisherige, historisch gewachsene Navigation mit elf gleichrangigen Zielen wird nicht als Produktmodell fortgeführt. Die Standardoberfläche erhält fünf fachlich verständliche Arbeitsbereiche:

1. Überblick
2. Fälle
3. Programme
4. Entscheidungen
5. Qualität

Bestehende Tiefenrouten für Fallsteuerung, Kohortenansicht, Planungsentscheidung, Evaluation und Lernschleife bleiben technisch erhalten. Sie werden aus dem primären Navigationsraum entfernt und aus dem jeweiligen fachlichen Zusammenhang geöffnet.

## Arbeitsmodell

Die Fallarbeit folgt durchgängig der Sprache `Lage → Verantwortung → Auswirkung → Entscheidung → Ergebnis`. Die sichtbare Oberfläche zeigt jeweils die aktuelle Aufgabe. Quellenabgleich, Abhängigkeitsberechnung, Versionen und technische Erweiterbarkeit werden über progressive Offenlegung als **Prüfnachweis** angeboten.

Der dreispaltige Arbeitsraum wird als bewusstes Aufgabenmodell verwendet:

- links: Auswahl;
- Mitte: genau eine aktuelle Aufgabe;
- rechts: knapper Verantwortungskontext.

Er ist kein CRM-Datensatzlayout. Kontaktpflege, Vertriebspipeline, Kommunikationshistorie und allgemeine Stammdatenverwaltung gehören nicht in diese Schicht.

## Rollen

- AMAVIO Operations sieht Überblick, Fälle, Programme, Entscheidungen und Qualität.
- Arbeitgeber sehen ihr Ankunftsprogramm und ihre eigene Mitwirkungsfläche.
- Interne Evidenz-, Regel-, Simulations-, Evaluations- und Lerninformationen bleiben für Arbeitgeber verborgen.

## Grenzen

Release L.2 verwendet ausschließlich synthetische Daten. Es aktiviert keine externe KI, keine produktive Anmeldung, keine Integration, keinen Versand, keine Buchung und keine automatische Freigabe. Die bestehende lokale Fachlogik und alle serverseitigen Rollen- und Wirkungsgrenzen bleiben unverändert.
