# Release Q – True Workspaces

**Datum:** 13.10.2026  
**Status:** lokal implementierte und QA-geprüfte Arbeitskopie  
**Rückfallbasis:** Release P.3 auf Port 4219, unverändert

## Produktentscheidung

Release Q beendet die bisherige Gleichförmigkeit der Rollen- und Seitenwechsel. Arbeitgeberportal und AMAVIO Operations verwenden weiterhin denselben kontrollierten synthetischen Fallzustand, projizieren daraus aber unterschiedliche Aufgaben, Informationen und Handlungen.

Die Trennung ist fachlich, visuell und interaktiv:

- Das **Arbeitgeberportal** steuert Startfähigkeit, notwendige Mitwirkung, Entscheidungen, beauftragte Leistungen und Ergebnisse.
- **AMAVIO Operations** priorisiert Eingangslagen, übernimmt freigegebene Aufträge, dokumentiert Ausführung und Nachweise und bereitet eine prüfbare Ergebnisübergabe vor.
- Kein Bereich erhält bloß eine umbenannte Kopie des anderen.
- Seiten und Register zeigen nicht denselben Inhalt mit anderen Überschriften, sondern erfüllen jeweils einen eigenen Arbeitsauftrag.

## Arbeitgeberportal

Vier Funktionsperspektiven besitzen eine eigene Startdarstellung und eigene fachliche Projektion:

1. **Gesamtsteuerung:** Programmstand, Ankunftsreise, Entscheidungsposteingang und Ergebnislage.
2. **Personal & Onboarding:** interne Startvorbereitung, Paten, erste Schichten und benötigte Arbeitgeberbeiträge.
3. **Standort & Übergabe:** Standortbereitschaft, Übergabefolge und offene Zuständigkeiten.
4. **Budget & Freigaben:** synthetische Handlungsvarianten, Planungsaufwand, Startwirkung, Risiko und menschliche Freigabe.

Die Hauptnavigation trennt vier Arbeitgeberziele:

- Startübersicht
- Entscheidungen
- Aufträge an AMAVIO
- Ergebnisse

Interne Operations-Schritte, technische Policy-Daten, Providerinformationen und Auditdetails bleiben aus dieser Oberfläche entfernt.

## AMAVIO Operations

Die Operations-Konsole besitzt vier eigenständige Arbeitsflächen:

1. **Arbeitsvorrat:** Priorisierung, Suche, Sortierung, Fallauswahl, Kontext, Blocker und nächster Arbeitsschritt.
2. **Aktive Aufträge:** ausschließlich übernommene oder freigegebene Aufträge mit ausführbarer Nachweisarbeit.
3. **Übergabebereit:** ausschließlich fachlich vollständige Ergebnisse vor Abschluss und Übergabe.
4. **Leistungsnachweise:** dokumentierte Ausführung, Übergabedossier und lokale Arbeitsprodukte.

Die operative Auftragsakte trennt fünf Aufgabenregister:

- Übersicht
- Aufgaben
- Nachweise
- Klärungen
- Verlauf

## Geschlossene Golden Journey

Der priorisierte synthetische Unterkunftsfall läuft reproduzierbar durch folgende Kette:

`Arbeitgeberoption wählen → Entscheidung begründen → Auftrag übergeben → Operations übernimmt → drei Schritte mit Nachweis schließen → Ergebnis übergeben → Übergabedossier prüfen → Arbeitgeber-Ergebnisbrief öffnen`

Die Reise nutzt bestehende lokale Release-P.2-Verträge und lockert keine Rollen-, Tenant-, Versions-, Idempotenz- oder Human-Gate-Grenze.

## Responsive Informationsarchitektur

- Desktop nutzt die volle Arbeitgeberübersicht beziehungsweise die dreigeteilte Operations-Konsole.
- Tablet ordnet Arbeitgeberentscheidungen als beschriftete Datengruppen statt als abgeschnittene Desktop-Tabelle und stapelt den Operations-Kontext.
- Mobil reduziert nicht den fachlichen Inhalt, sondern übersetzt Navigation, Reise, Entscheidungsdaten, Auftrag und Kontext in lesbare kompakte Flächen.
- Jede Größe wird auf horizontalen Dokumentüberlauf, Konsole, Netzwerk und vollständige Interaktion geprüft.

## Technische Grenzen

- ausschließlich lokale SQLite-Arbeitsdaten;
- ausschließlich synthetische Personen-, Arbeitgeber-, Objekt-, Standort- und Partnerbezüge;
- keine externe oder generative KI;
- null Provideraufrufe und null Providerkosten;
- keine produktive Identity, Authentifizierung oder Mandantentrennung;
- keine CRM-, HRIS-, App-, Datei-, Messaging-, Buchungs- oder Zahlungsintegration;
- keine Nachricht, Buchung, reale Freigabe oder sonstige Außenwirkung;
- keine Veröffentlichung und kein Deployment.

## Nächster Gate-Punkt

Founder-Abnahme der tatsächlichen Arbeitsdifferenzierung:

1. Verändert ein Wechsel zwischen den vier Arbeitgeberbereichen sichtbar Aufgabe, Informationshierarchie und nächste Handlung?
2. Erfüllen Arbeitsvorrat, aktive Aufträge, Übergabebereit und Leistungsnachweise vier getrennte Operations-Aufgaben?
3. Ist die durchgehende Golden Journey ohne Erklärung nachvollziehbar?
4. Entspricht die implementierte Weboberfläche der freigegebenen ruhigen AMAVIO-Richtung?

Erst nach dieser Abnahme folgt eine neue datierte Korrekturbasis oder ein fachlich klar abgegrenzter nächster Release.
