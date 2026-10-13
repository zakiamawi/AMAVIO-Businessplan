# ACC-Entwicklungsroadmap – zehn Pakete für den nächsten Demonstrationsstand

**Datum:** 03.10.2026  
**Geltungsbereich:** lokale Arbeitgeber-/AMAVIO-Konzeptdemo des Arrival Control Center  
**Status:** priorisierte Planungsbasis; noch keine Umsetzungsfreigabe und keine Änderung an der abgenommenen Demo  
**Produktgrenze:** Die AMAVIO One App für Fachkraft, Wohnanbieter und lokalen Partner bleibt ein getrenntes Produkt.

## 1. Ausgangslage

Der bestehende P0/P1/P2-Backlog vom 30.09.2026 ist abgeschlossen. Die aktuelle Demo ist für die lokale, moderierte Founder- und Arbeitgeberpräsentation abgenommen. Sie zeigt bereits die durchgängige Kette von Mandat und Standort über Kohorte und Arrival Case bis zu Risiko, Verantwortung, Freigabe und Lerntransfer.

Die nächste Entwicklungswelle soll deshalb nicht einfach mehr Karten oder Kennzahlen hinzufügen. Sie soll die Demo in fünf Dimensionen deutlich anheben:

1. **Gesprächsführung:** Ein Founder kann die stärkste Geschichte kontrolliert in sechs bis acht Minuten zeigen.
2. **Entscheidungstiefe:** Jedes relevante Signal führt nachvollziehbar zu Verantwortung, Frist, Entscheidung und Konsequenz.
3. **Szenarienrealismus:** Mehrere synthetische Arbeitgeberlagen sind reproduzierbar demonstrierbar.
4. **Produktgrenze und Vertrauen:** ACC, App und spätere Architektur werden klarer, nicht vermischt.
5. **Vorführsicherheit:** Reset, Responsive-Verhalten, Accessibility, Textqualität und Browser-QA tragen auch unter Präsentationsdruck.

„5× besser“ ist damit ein internes Qualitätsziel über fünf messbare Achsen und ausdrücklich **kein externer Wirkungs-, Produktivitäts- oder Marktclaim**.

## 2. Nicht verhandelbare Leitplanken

- ausschließlich lokale, synthetische Testfälle;
- keine realen Personen-, Arbeitgeber-, Objekt-, Partner- oder Mitarbeiterdaten;
- keine produktive Registrierung, Authentifizierung, Rechteprüfung oder Mandantentrennung;
- kein Backend, keine Datenbank, kein CRM/HRIS, keine App-Integration und keine produktive KI;
- keine echte Nachricht, Einladung, Dateiübertragung, Bestellung, Buchung, Freigabe oder Veröffentlichung;
- keine automatische Risikobewertung oder Entscheidung;
- kein Deployment, Hosting, Git-Push, externer Test oder kostenpflichtiger Dienst ohne eigenes Founder-Gate;
- vor der ersten Umsetzung eine neue datierte Arbeitskopie mit verifiziertem Rückfallstand anlegen;
- die abgenommene Arbeitskopie vom 30.09.2026 nicht überschreiben.

## 3. Zehn priorisierte Entwicklungspakete

### ACC-NX-01 – Geführter Demo Director

**Priorität:** P0  
**Ziel:** Die sechs- bis achtminütige Journey wird als bewusster Präsentationsmodus steuerbar, ohne die normale Dashboard-Nutzung zu überlagern.

**Umfang**

- Startkarte mit Szenario, Zielgruppe, simulierter Zeitbasis und Produktgrenze;
- sieben klar benannte Präsentationsstationen passend zum vorhandenen Gesprächsleitfaden;
- „Weiter“, „Zurück“, „Station überspringen“ und „Demo sicher zurücksetzen“;
- dezente Moderationshinweise, die im freien Dashboard-Modus ausgeblendet bleiben;
- sichtbare Fortschrittsanzeige ohne Zeitdruck oder automatische Navigation.

**Akzeptanzkriterien**

- Journey ist mit Maus und Tastatur vollständig bedienbar;
- jeder Schritt öffnet reproduzierbar den vorgesehenen Zustand;
- keine Station behauptet echte Außenwirkung oder produktive Funktionen;
- Start, Abbruch und Reset hinterlassen einen definierten Ausgangszustand;
- die normale freie Demo bleibt weiterhin erreichbar.

**Abhängigkeiten/Gates:** baut auf dem bestehenden `DEMO_GUIDE_20260930.md` auf; keine externe Freigabe nötig.  
**Größe:** M.

### ACC-NX-02 – Deterministische Szenario-Bibliothek

**Priorität:** P0  
**Ziel:** Statt nur eines generischen Bestands gibt es drei bewusst unterschiedliche, aber vollständig synthetische Arbeitgeberfälle.

**Vorgesehene Szenarien**

1. Pflegeeinrichtung: Einreise steht, Wohnraum blockiert den Start;
2. Seniorenzentrum: Anerkennung und Dienstplanung erzeugen einen Freigabekonflikt;
3. technischer Mittelstand: mehrere Standorte, versetzte Anreisen und unklare lokale Verantwortung.

**Akzeptanzkriterien**

- jedes Szenario besitzt feste Mandate, Fristen, Rollen, Risiken und erwartete Demo-Ausgänge;
- ein Szenariowechsel setzt alle lokalen Änderungen kontrolliert zurück;
- kein Zufall erzeugt während der Präsentation widersprüchliche Werte;
- Szenarien sind sichtbar als fiktiv und synthetisch gekennzeichnet;
- alle Summen, Fallzahlen, Fristen und Statuswerte sind innerhalb eines Szenarios konsistent.

**Abhängigkeiten/Gates:** Daten- und Claim-QA; keine reale Branchen- oder Kundenzuordnung.  
**Größe:** L.

### ACC-NX-03 – Executive Portfolio Pulse

**Priorität:** P0  
**Ziel:** Die AMAVIO-Operations-Ansicht beantwortet in wenigen Sekunden: Wo muss heute entschieden werden, warum und mit welcher Folge?

**Umfang**

- priorisierte Mandate und Kohorten statt rein gleichwertiger Dashboard-Kacheln;
- Filter nach Handlungsdruck, Phase, Verantwortungsrolle und Frist;
- Verbindung von Portfolio-Signal zu Standort, Kohorte und konkretem Arrival Case;
- kurze Begründung der Priorisierung, ohne Scoring- oder KI-Claim;
- visuelle Trennung von „beobachten“, „klären“, „entscheiden“ und „eskalieren“.

**Akzeptanzkriterien**

- die drei wichtigsten offenen Entscheidungen sind ohne Scrollen erfassbar;
- jeder Eintrag zeigt nächste Rolle, Frist, Grund und Zielansicht;
- Filter verändern nur lokale synthetische Daten;
- Kennzahlen stimmen mit Szenario, Listen, Fallakte und Reporting überein;
- Priorisierung ist regelbasiert erklärt und nicht als automatische Entscheidung dargestellt.

**Abhängigkeiten/Gates:** ACC-NX-02.  
**Größe:** M.

### ACC-NX-04 – Arrival Critical Path

**Priorität:** P0  
**Ziel:** Ein Fall wird nicht nur als Akte, sondern als verständlicher kritischer Pfad mit Abhängigkeiten gezeigt.

**Umfang**

- Zeitachse von Vorbereitung über Anreise und ersten Arbeitstag bis 30/60/90/180 Tage;
- Abhängigkeiten zwischen Anerkennung, Einreise, Wohnen, Onboarding und Standortaufgaben;
- Blocker, Frist, nächste Verantwortung und Eskalationspunkt direkt an der Zeitachse;
- Rücksprung in die Fallakte sowie Wechsel zur betroffenen Arbeitgeberrolle.

**Akzeptanzkriterien**

- mindestens ein normaler und ein blockierter Pfad je Szenario;
- jede blockierte Station zeigt Ursache, Besitzer, Frist und nächsten erlaubten Schritt;
- keine Termin-, Visa-, Anerkennungs-, Wohnraum- oder Ergebnisgarantie;
- Zeitachse bleibt bei Desktop, Tablet und Mobile verständlich;
- Screenreader-Reihenfolge entspricht der zeitlichen Reihenfolge.

**Abhängigkeiten/Gates:** ACC-NX-02 und konsistente simulierte Datumsbasis.  
**Größe:** L.

### ACC-NX-05 – Decision Room mit nachvollziehbarer Entscheidungskette

**Priorität:** P0  
**Ziel:** Risiko, Handlungsoption, Freigabe, Begründung und Folge werden in einer zusammenhängenden lokalen Demo-Ansicht verständlich.

**Umfang**

- Entscheidungsvorlage mit Problem, verfügbaren synthetischen Optionen und Verantwortungsrolle;
- klarer Unterschied zwischen Empfehlung, Entscheidung und Ausführung;
- lokales Entscheidungsprotokoll mit simulierter Zeitbasis;
- „Was ändert sich dadurch?“ als Vorschau, bevor ein Demo-Zustand gesetzt wird;
- Rückfall- und Eskalationsweg für abgelehnte oder vertagte Entscheidungen.

**Akzeptanzkriterien**

- mindestens drei Entscheidungstypen sind demonstrierbar;
- Bestätigen, Ablehnen und Vertagen führen zu fachlich konsistenten lokalen Zuständen;
- jede Zustandsänderung ist als synthetisch, lokal und wirkungslos gekennzeichnet;
- keine Aktion wird als Bestellung, Buchung, Nachricht oder verbindliche Freigabe missverstanden;
- Reset stellt den vollständigen Ausgangszustand wieder her.

**Abhängigkeiten/Gates:** ACC-NX-03 und ACC-NX-04; Rechts-/Vertragsgate erst bei produktiver Wirkung.  
**Größe:** L.

### ACC-NX-06 – What-if- und Störfall-Simulator

**Priorität:** P1  
**Ziel:** Die Demo zeigt nicht nur den Idealweg, sondern wie AMAVIO mit typischen Abweichungen strukturiert umgeht.

**Vorgesehene Schalter**

- Anreise verschiebt sich;
- Wohnoption fällt aus;
- Freigabeverantwortung reagiert nicht;
- Dokumentstatus bleibt ungeklärt;
- lokale Kapazität reicht nicht aus.

**Akzeptanzkriterien**

- jeder Schalter verändert sichtbar Zeitachse, Verantwortung und Handlungsdruck;
- Ursache und Folgewirkung sind nachvollziehbar, nicht als Prognose ausgegeben;
- mehrere Störungen erzeugen keine unmöglichen Zustände oder widersprüchlichen Zahlen;
- ein Reset pro Szenario funktioniert zuverlässig;
- keine KI-, Matching- oder Garantiebehauptung.

**Abhängigkeiten/Gates:** ACC-NX-02 bis ACC-NX-05.  
**Größe:** L.

### ACC-NX-07 – Verantwortungs- und Übergabekarte

**Priorität:** P1  
**Ziel:** Sponsor, HR, Fachbereich, Standort, Budgetrolle und AMAVIO Operations werden als echte Steuerungskette verständlich, ohne produktive Autorisierung zu simulieren.

**Umfang**

- visuelle Zuständigkeitskarte pro Szenario und Prozessphase;
- Übergabepunkte mit erwartetem Eingang, Ausgang, Frist und Eskalation;
- klare Kennzeichnung von „verantwortet“, „wirkt mit“, „wird informiert“ und „entscheidet“;
- Ansicht aus Arbeitgeber- und AMAVIO-Perspektive.

**Akzeptanzkriterien**

- jede offene Aufgabe besitzt genau eine nächste verantwortliche Rolle;
- Übergaben sind aus beiden ACC-Perspektiven konsistent;
- interne AMAVIO-Notizen und Daten anderer Mandate bleiben ausgeschlossen;
- UI-Rollen werden weiterhin als fachliches Zielbild, nicht als Rechteprüfung bezeichnet;
- Tastatur- und Screenreader-Navigation ist ohne Informationsverlust möglich.

**Abhängigkeiten/Gates:** ACC-NX-02; produktive Umsetzung erst nach Identity-, Rechte- und Mandantengate.  
**Größe:** M.

### ACC-NX-08 – Kontrollierte App-Signalgrenze als Demonstrator

**Priorität:** P1  
**Ziel:** Die Trennung zwischen ACC und der separaten Drei-Rollen-App wird sichtbar und verständlich, ohne eine Integration vorzutäuschen.

**Umfang**

- rein lokaler „Signal-Eingang“ mit minimierten Beispielen für Fachkraft, Wohnanbieter und lokalen Partner;
- Anzeige, welche Information zulässig wäre und welche bewusst im ACC oder in der App verbleibt;
- menschlicher AMAVIO-Prüfschritt vor jeder simulierten Rückprojektion;
- klarer Reifegradhinweis „fachliches Zielbild – nicht verbunden“.

**Akzeptanzkriterien**

- nur Signaltypen aus `APP_ACC_INTERFACE_BOUNDARY_20260930.md` werden verwendet;
- keine sensiblen Freitexte, Personenprofile oder fremden Mandatsdaten;
- kein gemeinsames Rollenportal und kein Wechsel in App-Rollen innerhalb des ACC;
- keine automatische Freigabe, Veröffentlichung, Buchung oder Risikobewertung;
- jede Richtung zeigt Zweck, Minimaldaten, Verantwortung und Nicht-Implementierungsstatus.

**Abhängigkeiten/Gates:** fachliche Grenze vom 30.09.2026; technische Verbindung bleibt geschlossen.  
**Größe:** M.

### ACC-NX-09 – 30/60/90/180-Tage-Lern- und Wirkungsstory

**Priorität:** P1  
**Ziel:** Reporting wird vom Kennzahlen-Endpunkt zu einer nachvollziehbaren Lernschleife für die nächste Kohorte.

**Umfang**

- synthetischer Vergleich von Ausgangslage, Entscheidung, Ergebnisbeobachtung und Lernpunkt;
- Trennung von Prozessindikator, Beobachtung und behaupteter Wirkung;
- „Was ändern wir beim nächsten Start?“ mit konkreter Verantwortungszuweisung;
- Wechsel zwischen Einzelfall-, Kohorten- und Mandatssicht.

**Akzeptanzkriterien**

- jeder Lernpunkt verweist auf die zugrunde liegende synthetische Entscheidung;
- illustrative Zahlen sind direkt und dauerhaft als solche gekennzeichnet;
- keine reale Kausalitäts-, ROI-, Bindungs- oder Erfolgsaussage;
- Kennzahlen bleiben über Portfolio, Fall und Reporting konsistent;
- Druck-/Präsentationsansicht zeigt Quelle, Zeitbasis und Reifegrad.

**Abhängigkeiten/Gates:** ACC-NX-02, ACC-NX-05 und ACC-NX-06.  
**Größe:** M.

### ACC-NX-10 – Trust-, Accessibility- und Präsentations-QA-Layer

**Priorität:** P1, Abschlussgate jeder Entwicklungswelle  
**Ziel:** Die erweiterte Demo bleibt auch bei Live-Präsentation, kleinerem Bildschirm und assistiver Bedienung stabil und glaubwürdig.

**Umfang**

- durchgängige Datenherkunfts- und Reifegradlabels;
- Definitionen für Kennzahlen, Status und Priorisierungsregeln;
- leere, fehlerhafte und zurückgesetzte Zustände;
- Fokusführung, Live-Regionen, Kontrast, reduzierte Bewegung und sinnvolle Lesereihenfolge;
- sichere Präsentationsansicht ohne lokale Pfade, Debuganzeigen oder vertrauliche Browserinformationen;
- sprachliche Bereinigung einschließlich `Naechsten` → `Nächsten` und konsistenter Datumsdarstellung;
- erweiterte automatisierte Interaktions-, Konsistenz- und Responsive-Checks.

**Akzeptanzkriterien**

- statische Prüfung und Browser-QA sind grün;
- keine Console Errors und kein horizontaler Überlauf bei 1440, 1024, 768, 390 und 360 Pixeln;
- vollständiger Tastaturpfad für Demo Director, Szenariowechsel, Filter, Fall, Entscheidung und Reset;
- `prefers-reduced-motion` wird respektiert;
- alle sichtbaren Daten und schreibend wirkenden Aktionen bleiben als synthetisch beziehungsweise lokal gekennzeichnet;
- die sechs- bis achtminütige Founder-Journey besteht einen erneuten moderierten Abnahmelauf.

**Abhängigkeiten/Gates:** integriert die Ergebnisse aus ACC-NX-01 bis ACC-NX-09.  
**Größe:** M, fortlaufend.

## 4. Empfohlene Umsetzungsreihenfolge

### Welle A – kontrollierbare Grundlage

1. ACC-NX-01 Demo Director;
2. ACC-NX-02 Szenario-Bibliothek;
3. ACC-NX-10 QA-Layer zunächst als erweiterte Testbasis.

**Meilenstein A:** Drei reproduzierbare synthetische Szenarien können in einer kontrollierten sechs- bis achtminütigen Journey gestartet, durchlaufen und vollständig zurückgesetzt werden.

### Welle B – Entscheidungssystem sichtbar machen

4. ACC-NX-03 Executive Portfolio Pulse;
5. ACC-NX-04 Arrival Critical Path;
6. ACC-NX-05 Decision Room.

**Meilenstein B:** Ein Portfolio-Signal lässt sich lückenlos bis zur lokalen, begründeten Demo-Entscheidung und deren sichtbarer Folge verfolgen.

### Welle C – Robustheit und Produktgrenze

7. ACC-NX-06 What-if-Simulator;
8. ACC-NX-07 Verantwortungs- und Übergabekarte;
9. ACC-NX-08 kontrollierte App-Signalgrenze.

**Meilenstein C:** Die Demo erklärt Störfälle, Zuständigkeiten und das Zusammenspiel mit der getrennten App, ohne Integration oder Produktivreife zu behaupten.

### Welle D – Lerntransfer und Gesamtfreigabe

10. ACC-NX-09 Lern- und Wirkungsstory;
11. ACC-NX-10 vollständiger Abschluss- und Präsentations-QA-Lauf.

**Meilenstein D:** Die Journey schließt nachvollziehbar vom Risiko über Entscheidung und Beobachtung bis zur Verbesserung der nächsten Kohorte.

## 5. Scorecard für das interne „5×“-Ziel

| Qualitätsachse | Heutiger belastbarer Stand | Ziel nach der Roadmap | Nachweis |
|---|---|---|---|
| Gesprächsführung | manueller Leitfaden und freie Navigation | geführter, jederzeit abbrechbarer Demo Director | moderierter 6–8-Minuten-Test |
| Entscheidungstiefe | Verantwortung und Freigabe sichtbar | Signal → Ursache → Option → Entscheidung → Folge → Lernpunkt | drei vollständige synthetische Entscheidungsketten |
| Szenarienrealismus | ein statischer synthetischer Demo-Bestand | drei deterministische Szenarien plus definierte Störfälle | Konsistenztests und Reset-Nachweis |
| Produktgrenze/Vertrauen | dokumentierte ACC-/App-Trennung | sichtbarer Minimaldaten- und Prüffluss ohne Integrationsclaim | Boundary-Review gegen Übergabematrix |
| Vorführsicherheit | bestehende Desktop-/Tablet-/Mobile-QA | erweiterte Journey-, Zustands-, A11y- und Konsistenz-QA | grüne automatisierte Matrix plus Founder-Abnahme |

Die Roadmap gilt als erreicht, wenn alle fünf Zielnachweise vorliegen. Die reine Anzahl neuer Screens oder Funktionen ist kein Erfolgskriterium.

## 6. Vorgeschlagene neue Arbeits- und Rückfallbasis

Vor der ersten Umsetzung:

1. aktuelle abgenommene Demo erneut statisch und im Browser prüfen;
2. Hash und QA-Status dokumentieren;
3. unveränderte Kopie als Rückfallbasis sichern;
4. neue Arbeitskopie beispielsweise unter `10_Control_Center/20261003_AMAVIO_ACC_5X_Working/` anlegen;
5. genau ein Paket nach dem anderen umsetzen und nach jedem Paket die vollständige betroffene QA ausführen;
6. den bestehenden Backlog erst nach Founder-Priorisierung um die freigegebenen Pakete ergänzen.

## 7. Nächste Entscheidung

Empfohlen ist die Freigabe von **Welle A** als nächste lokale, reversible Entwicklungsstufe. Innerhalb von Welle A ist **ACC-NX-01 – Geführter Demo Director** das erste Arbeitspaket, weil er die vorhandene abgenommene Dramaturgie nutzt und die späteren Szenarien kontrollierbar macht.

Nicht Teil dieser Entscheidung sind externe Designpartner- oder Arbeitgebertests, echte Daten, App-/ACC-Integration, produktive Architektur, Hosting, Deployment, Veröffentlichung oder Kosten.
