# G1 Product-Owner-Entscheidungspaket

**Entscheidungsgegenstand:** eng begrenzte Nutzung realer AMAVIO-Geschäftskontaktdaten  
**Aktuelle Empfehlung:** NO-GO bis G1-03, G1-06 und die externen Nachweise aus G1-07/G1-09 geschlossen sind

## Was mit PO-CRM-043 fachlich beschlossen ist

Datenklassen, Zweckgrenze, Ausschlussliste, Reviewintervalle, RPO-/RTO-Arbeitsziele, Sicherungsrhythmus, Hauptverantwortung und Incident-Erstablauf sind als lokale Arbeitslogik beschlossen. Import-/Quarantänevertrag, Betroffenenanfragen-Playbook und lokale Kontrollläufe bleiben synthetische Evidenz. Sie aktivieren keine realen Daten.

## Was nicht ersetzt werden kann

- fachlich/rechtliche Prüfung je Quelle, Zweck und Kanal;
- Authentifizierung, Geräteschutz, Sitzungs- und Berechtigungstest;
- Nachweis verschlüsselter Ablage, RPO/RTO, Rotation und realer Wiederherstellung;
- benannte Betriebs-, Datenschutz- und Vertretungsverantwortung;
- ausdrücklicher Product-Owner-Gesamtbeschluss G1-10.

## Pflichtinhalt eines späteren GO

Zulässige Datenklassen und Felder; ausgeschlossene Inhalte; erlaubte Quellen; konkrete Zwecke und Kanäle; maximaler Erstbestand; verantwortlicher Nutzer; Speicherort und Geräteanforderung; Startdatum, Prüftermin und End-/Reviewdatum; Aufbewahrung; Incident- und Stop-Regel; Restrestrisiken; Bedingungen für Einzelversand. Ein GO für G1 ist kein GO für Massenversand, Live-Scraping, Connectoren, Mehrbenutzerbetrieb, App oder ACC.

## Entscheidungsfelder

- Entscheidung: `NO-GO` / `GO mit engen Auflagen` / `GO eng begrenzt`
- zulässiger fachlicher Erstumfang: mit PO-CRM-043 beschlossen; produktive Quellen und Kanäle offen
- maximaler Datenbestand: offen
- Hauptverantwortung: Product Owner / CRM-Administration; Vertretung offen
- Start- und Reviewdatum: offen
- bestätigte Restrestrisiken: offen
- Datum/Name/Entscheidungsreferenz für G1-10: offen; fachliche Teilreferenz `PO-CRM-043`

Ohne vollständig ausgefüllte Felder und Gate-Nachweise bleibt der technische Status `realDataEnabled=false` und `releaseEligible=false`.

