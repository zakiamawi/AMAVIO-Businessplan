# AMAVIO One CRM – R3 UAT-Szenariobuch

**Datum:** 09.10.2026  
**Dauer:** circa 60–90 Minuten  
**Daten:** ausschließlich kontrollierte synthetische Demonstrationsdaten  
**Ergebnisregel:** pro Szenario genau eine Bewertung: AKZEPTIERT, R3.1-KORREKTUR, GEPARKT, ENTSCHEIDUNG OFFEN oder GATE-GESPERRT

## Vorbereitung

- lokale UAT-Arbeitskopie starten;
- sicherstellen, dass „Synthetische Arbeitsdaten · lokal“ und „Kein Produktivsystem“ sichtbar sind;
- Demonstrationszustand kontrolliert zurücksetzen;
- keine realen Namen, E-Mail-Adressen, Telefonnummern, Unternehmen oder Gesprächsinhalte eingeben;
- Beobachtungen sofort im Befundregister dokumentieren;
- keine Lösung während der Sitzung improvisieren.

## Szenario 1 – Produktgrenze und Orientierung

**Ziel:** Innerhalb von 30 Sekunden verstehen, was das CRM ist und was es nicht ist.

**Schritte:**

1. CRM Cockpit öffnen.
2. Navigation, Kopfbereich, Profilanzeige und lokale Statushinweise lesen.
3. „Neue Chance“, globale Suche und Demo-Reset lokalisieren.

**Erwartung:** Interner AMAVIO-Arbeitsbereich, synthetische Daten und fehlende Produktivfreigabe sind eindeutig. Die Oberfläche wirkt wie AMAVIO und nicht wie eine fremde CRM-Kopie.

**Product-Owner-Fragen:** Ist die Informationshierarchie ruhig und klar? Fehlt eine für den Tagesstart unverzichtbare Orientierung?

**Bewertung:** _ausstehend_  
**Notiz:** _offen_

## Szenario 2 – Lead als ungeprüftes Signal

**Ziel:** Prüfen, ob ein frühes Signal bewusst außerhalb der Pipeline bleiben kann.

**Schritte:**

1. Leads öffnen.
2. „Hospitality – ungeprüftes Signal“ öffnen.
3. Status, Organisationshinweis, Bedarf, Kontaktfrage und nächsten Schritt prüfen.
4. Prüfen, ob eine Konvertierung angeboten wird.

**Erwartung:** Der Lead bleibt sichtbar von einer Chance getrennt. Ohne qualifizierten Status und aktive Organisation gibt es keine Konvertierung.

**Product-Owner-Fragen:** Ist „Lead“ der richtige Begriff? Sind „Neu“, „In Prüfung“, „Qualifiziert“, „Nicht qualifiziert“ und „Konvertiert“ ausreichend?

**Bewertung:** _ausstehend_  
**Notiz:** _offen_

## Szenario 3 – Lead qualifizieren und konvertieren

**Ziel:** Die beschlossene Lead-/Opportunity-Grenze fachlich prüfen.

**Schritte:**

1. Einen neuen synthetischen Lead anlegen.
2. Bestehende synthetische Organisation zuordnen.
3. Bedarf, Owner, nächste Handlung und Fälligkeit dokumentieren.
4. Status auf „Qualifiziert“ setzen.
5. Lead öffnen und in eine Chance konvertieren.
6. Konvertierte Chance öffnen.

**Erwartung:** Konvertierung ist erst bei erfülltem Vertrag möglich. Die Chance beginnt in „Erstkontakt“; der Lead bleibt als „Konvertiert“ nachvollziehbar.

**Product-Owner-Fragen:** Sind die Qualifikationsanforderungen angemessen? Fehlt vor der Konvertierung eine zwingende Information?

**Bewertung:** _ausstehend_  
**Notiz:** _offen_

## Szenario 4 – Organisation und Kontakt

**Ziel:** Prüfen, ob Arbeitgeber-Accounts und ihre Kontakte im Arbeitsalltag ausreichend beschrieben sind.

**Schritte:**

1. Eine synthetische Organisation anlegen.
2. Einen synthetischen Kontakt mit `.invalid`-Adresse anlegen.
3. Organisation und Kontakt gegenseitig über die Detailansichten öffnen.
4. Bearbeitung, Archivierung und Wiederherstellung prüfen.

**Erwartung:** Beziehungen sind nachvollziehbar; Archivierung ersetzt die physische Löschung.

**Product-Owner-Fragen:** Reichen Segment, Region, Funktion, Beziehungsrolle und Owner? Welche Felder wären nur „nice to have“?

**Bewertung:** _ausstehend_  
**Notiz:** _offen_

## Szenario 5 – Chance und Beteiligte

**Ziel:** Eine neue Geschäftschance mit belastbarer Grundstruktur anlegen.

**Schritte:**

1. Neue Chance öffnen.
2. Organisation und Hauptkontakt zuordnen.
3. Bezeichnung, Potenzial, Owner, nächste Handlung und Fälligkeit erfassen.
4. Chance speichern und Detailansicht prüfen.

**Erwartung:** Organisation und nächster Schritt sind verpflichtend; Kontakt und Potenzial dürfen im Erstkontakt offen bleiben.

**Product-Owner-Fragen:** Ist „Chance“ die richtige Bezeichnung? Ist das Potenzial hilfreich oder zu früh präsent?

**Bewertung:** _ausstehend_  
**Notiz:** _offen_

## Szenario 6 – Qualifiziert

**Ziel:** Eintrittskriterien der ersten qualifizierten Pipelinephase bewerten.

**Schritte:**

1. Chance in „Erstkontakt“ öffnen.
2. „Qualifiziert“ auswählen, ohne Bedarf zu dokumentieren.
3. Sperrhinweis lesen.
4. Bedarf und gegebenenfalls offene Kontaktfrage ergänzen.
5. Phasenwechsel erneut durchführen.

**Erwartung:** Fehlende Evidenz wird benannt; nach Erfüllung ist der Wechsel möglich und historisiert.

**Product-Owner-Fragen:** Ist die Schwelle zu niedrig, passend oder zu hoch? Ist eine begründete offene Kontaktfrage zulässig?

**Bewertung:** _ausstehend_  
**Notiz:** _offen_

## Szenario 7 – Scoping, Angebot und Entscheidung

**Ziel:** Die fachliche Progression der mittleren Pipeline prüfen.

**Schritte:**

1. Für Scoping Zielbild, offene Punkte und Hauptkontakt beziehungsweise Ausnahme dokumentieren.
2. Für Angebot Angebotskontext, Leistungsgrenze, Betrag oder offenen Betrag und Folgeschritt prüfen.
3. Für Entscheidung Entscheiderrolle, Entscheidungspfad und Zeitkorridor prüfen.
4. Erlaubte Rückwärtsbewegung nachvollziehen.

**Erwartung:** Kein Phasensprung; jede Phase verlangt nur die beschlossene Evidenz. Offene Informationen bleiben als offen dokumentierbar.

**Product-Owner-Fragen:** Entspricht die Reihenfolge dem AMAVIO-Verkaufsprozess? Ist „Scoping“ verständlich genug? Sind Angebot und Entscheidung sauber getrennt?

**Bewertung:** _ausstehend_  
**Notiz:** _offen_

## Szenario 8 – Gewonnen und Verloren

**Ziel:** Abschlussbegriffe und Nachweise bewerten.

**Schritte:**

1. Gewonnenen synthetischen Datensatz öffnen.
2. Gewinnmarker, gewonnenen Scope und Historie prüfen.
3. Bei einem separaten Testdatensatz „Verloren“ wählen und Verlustgrund dokumentieren.

**Erwartung:** „Gewonnen“ ist ein ausdrücklicher lokaler Geschäftsstatus, aber keine operative ACC-Startfreigabe. „Verloren“ verlangt einen sachlichen Grund.

**Product-Owner-Fragen:** Ist „Gewinnmarker“ angemessen? Werden verlorene Chancen ausreichend nachvollziehbar?

**Bewertung:** _ausstehend_  
**Notiz:** _offen_

## Szenario 9 – Aufgabe, Aktivität und Historie

**Ziel:** Prüfen, ob nächste Handlungen und Gesprächsdokumentation zusammenhängend sind.

**Schritte:**

1. Aus einer Chance eine Aufgabe anlegen.
2. Aufgabe in Arbeit setzen und abschließen.
3. Gesprächs- oder interne Notiz als Aktivität dokumentieren.
4. Timeline und Phasenhistorie prüfen.

**Erwartung:** Aufgabe und Aktivität bleiben mit Organisation/Chance verbunden. Kein E-Mail-Versand wird behauptet.

**Product-Owner-Fragen:** Ist die Trennung Aufgabe/Aktivität verständlich? Fehlt eine tägliche Arbeitsansicht?

**Bewertung:** _ausstehend_  
**Notiz:** _offen_

## Szenario 10 – Kontakt- und Einwilligungsstatus

**Ziel:** Die Trennung von Beziehung, Kontaktstatus und Rechts-/Einwilligungsstatus prüfen.

**Schritte:**

1. Kontakt öffnen und bearbeiten.
2. Einwilligungsstatus „Nur synthetisch dokumentiert“ wählen.
3. Pflichtfelder Zweck, Quelle, Datum und synthetische Nachweisreferenz prüfen.
4. Danach „Widerrufen“ oder Kontaktstatus „Nicht kontaktieren“ setzen.
5. Detailansicht lesen.

**Erwartung:** Eine sichtbare Sperre erscheint. Es gibt keine externe Kontaktaktion und keine Aussage, dass der CRM-Status eine Rechtsgrundlage bildet.

**Product-Owner-Fragen:** Sind die Begriffe verständlich? Ist dieser Bereich zu präsent oder für Vertrauen notwendig?

**Bewertung:** _ausstehend_  
**Notiz:** _offen_

## Szenario 11 – Partnerorganisation und Partnerkontakt

**Ziel:** Prüfen, ob Partner klar von Arbeitgeberkontakten und App-Rollen getrennt bleiben.

**Schritte:**

1. Partnerübersicht öffnen.
2. Synthetische Partnerorganisation anlegen.
3. Partnerkontakt hinzufügen.
4. Beziehung, Suche, Bearbeitung und Archivierung prüfen.

**Erwartung:** Partner und Partnerkontakte bilden eigene Objektklassen. Es gibt keinen Partnerlogin und keine App-Rolle.

**Product-Owner-Fragen:** Reichen Kategorie, Beziehungsstatus, Owner und nächster Schritt? Fehlt eine zwingende Leistungsgrenze?

**Bewertung:** _ausstehend_  
**Notiz:** _offen_

## Szenario 12 – ACC-Prüfmarker

**Ziel:** Sicherstellen, dass „Gewonnen“ nicht automatisch „operativ startbereit“ bedeutet.

**Schritte:**

1. „Care & Retention Monitoring“ öffnen.
2. Commercial/Product-Owner-Marker setzen.
3. Status beobachten.
4. Operations-Marker setzen.
5. finalen lokalen Status und gesperrte Übertragungsaktion prüfen.

**Erwartung:** Erst beide Marker ergeben „Fachlich doppelt freigegeben“. Es entsteht kein Fall, Payload, Transfer oder ACC-Zugriff.

**Product-Owner-Fragen:** Sind die beiden Verantwortungen korrekt? Wird die Trennung zwischen Vertriebserfolg und operativer Bereitschaft deutlich?

**Bewertung:** _ausstehend_  
**Notiz:** _offen_

## Szenario 13 – Suche, Bericht und Exportgrenze

**Ziel:** Informationszugriff und Kennzahlengrenze prüfen.

**Schritte:**

1. Strg/⌘ K verwenden.
2. je eine Organisation, einen Kontakt, Lead, eine Chance, Aufgabe, Partnerorganisation und einen Partnerkontakt finden.
3. Berichte öffnen.
4. sichtbares Potenzial und Forecast-Hinweis lesen.
5. Exportstatus prüfen.

**Erwartung:** Alle angekündigten Objekttypen sind auffindbar. Es gibt keinen gewichteten Forecast. Export ist deaktiviert.

**Product-Owner-Fragen:** Sind die Suchergebnisse verständlich? Reicht der Wochenüberblick für R3?

**Bewertung:** _ausstehend_  
**Notiz:** _offen_

## Szenario 14 – Mobile, Zoom, Reset und Gesamturteil

**Ziel:** Alltagstauglichkeit und kontrollierte Rückkehr zum Demonstrationszustand bewerten.

**Schritte:**

1. Oberfläche bei schmaler Breite beziehungsweise Mobile ansehen.
2. Navigation, Fokus, Pipeline, Chancen und nächste Schritte prüfen.
3. bei 200 Prozent Zoom Formulare und Detailansichten bedienen.
4. einen Datensatz archivieren und wiederherstellen.
5. Demo zurücksetzen.

**Erwartung:** Kerninformationen bleiben erreichbar; es gibt keinen Seitenüberlauf; Reset ist bestätigt und reversibel.

**Product-Owner-Fragen:** Würdest du mit dieser Informationsstruktur einen realen Arbeitstag beginnen – unabhängig von der noch fehlenden produktiven Technik? Was wäre ein echter Abnahmeblocker?

**Bewertung:** _ausstehend_  
**Gesamturteil:** _offen_
