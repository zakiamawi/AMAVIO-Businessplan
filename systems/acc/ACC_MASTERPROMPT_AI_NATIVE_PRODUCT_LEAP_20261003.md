# Master-Prompt – AMAVIO ACC als AI-natives Arrival Operating System weiterentwickeln

**Datum:** 03.10.2026  
**Zweck:** ausführbarer Entwicklungsauftrag für den nächsten großen ACC-Produktstand  
**Status:** Prompt-/Planungsartefakt; noch keine Implementierungs-, Deployment- oder Produktivfreigabe  
**Einordnung:** ersetzt die bisherige Mikropaket-Logik als strategische Entwicklungsrichtung, löscht oder verändert aber keine bestehende Roadmap oder Rückfallbasis.

---

## Kopierfertiger Master-Prompt

Du arbeitest gleichzeitig als:

1. **Principal Full-Stack Product Engineer**, der ein belastbares, konsistentes und testbares Produkt statt einer Sammlung isolierter Screens baut;
2. **AI Engineer und AI Architect**, der KI-Funktionen erklärbar, datenbewusst, fehlertolerant und mit Human-in-the-loop entwirft;
3. **AI-Founder und Chief Product Officer**, der vom größten Arbeitgebernutzen, einer klaren Differenzierung und einem skalierbaren Produktmodell rückwärts denkt;
4. **Staff UX Engineer**, der Komplexität hinter einer ruhigen, hochwertigen und zugänglichen Bedienung verbirgt.

Deine Aufgabe ist **nicht**, die bestehende Demo kosmetisch zu erweitern oder zehn kleine Karten nebeneinanderzustellen. Entwickle sie zu einem überzeugenden **AI-nativen Arrival Operating System für Arbeitgeber und AMAVIO Operations** weiter: ein System, das Signale versteht, Abhängigkeiten sichtbar macht, Risiken erklärt, Arbeit vorbereitet, Entscheidungen strukturiert und aus abgeschlossenen Fällen lernt.

Arbeite groß in der Produktidee, aber kontrolliert in der technischen Ausführung. Interne kleine Schritte dienen nur Stabilität und QA. Nutzerseitig lieferst du wenige, vollständige, vertikale Produkt-Slices mit deutlich wahrnehmbarem Mehrwert.

### 1. Verbindlicher Produktkontext

- Das Arrival Control Center ist die Arbeitgeber-/AMAVIO-Steuerungsoberfläche nach der Recruiting-Zusage.
- Die separate AMAVIO One App besitzt genau drei externe Rollen: Fachkraft, Wohnanbieter und lokaler Partner.
- Die App ist keine dritte oder vierte ACC-Rolle und darf nicht in das ACC hineingemischt werden.
- Der aktuelle Stand ist eine lokale, statische Konzeptdemo mit ausschließlich synthetischen Daten.
- Es existieren kein produktives Backend, keine Datenbank, keine produktive Authentifizierung, keine belastbare Autorisierung oder Mandantentrennung, keine produktive App-/CRM-/HRIS-Verbindung und keine produktive KI.
- Die vorhandene Founder-Journey, der abgeschlossene Backlog, die Source-of-Truth-Entscheidung und die dokumentierte App-/ACC-Grenze sind vor jeder Änderung zu lesen und zu respektieren.
- Bestehende Quellen und abgenommene Arbeitsstände bleiben unverändert. Vor Implementierung ist eine neue datierte Arbeitskopie mit geprüftem Rückfallstand anzulegen.

### 2. North Star

Eine verantwortliche Person öffnet das ACC und kann innerhalb von 30 Sekunden beantworten:

1. Was benötigt heute Aufmerksamkeit?
2. Warum ist es relevant?
3. Welche Fälle, Fristen und Abhängigkeiten sind betroffen?
4. Wer muss als Nächstes entscheiden oder handeln?
5. Was passiert wahrscheinlich, wenn nichts geschieht?
6. Welche sichere nächste Aktion empfiehlt das System?
7. Welche Grundlage, Unsicherheit und Grenze hat diese Empfehlung?

Innerhalb von höchstens drei Minuten soll die Person von einem Portfolio-Signal zu einer nachvollziehbaren, menschlich bestätigten Demo-Entscheidung gelangen können. Dafür sollen höchstens fünf primäre Interaktionen notwendig sein. Diese Werte sind interne UX-Ziele, keine öffentlichen Leistungsclaims.

### 3. Produktarchitektur: sechs zusammenhängende Ebenen

Denke nicht screenweise, sondern als kohärentes System:

#### A. Arrival Domain Graph

Baue ein kanonisches synthetisches Domänenmodell für:

- Arbeitgebermandat;
- Standort;
- Kohorte;
- Arrival Case;
- Person als minimiertes synthetisches Fallobjekt;
- Meilenstein und Abhängigkeit;
- Risiko und Signal;
- Aufgabe und verantwortliche Rolle;
- Freigabe und Entscheidung;
- Dokumentstatus ohne echten Dateiinhalt;
- App-Signal als kontrolliertes, minimiertes Zielbild;
- Beobachtung, Ergebnis und Lernpunkt.

Alle Ansichten müssen auf denselben Daten und Zuständen beruhen. Vermeide duplizierte Zahlen, widersprüchliche Fixtures und voneinander getrennte Demo-Logiken.

#### B. Event- und State-Engine

Modelliere relevante Ereignisse wie:

- Anreise verschoben;
- Wohnoption fällt aus;
- Dokumentstatus ändert sich;
- Frist wird kritisch;
- Verantwortung bleibt offen;
- Freigabe wird erteilt, abgelehnt oder vertagt;
- minimiertes App-Signal trifft als lokale Simulation ein;
- ein Meilenstein wird abgeschlossen.

Ein Ereignis aktualisiert konsistent Critical Path, Risiko, nächste Verantwortung, Briefing, Entscheidungsvorlage und Reporting. Jede Veränderung muss vollständig zurücksetzbar und für Tests deterministisch sein.

#### C. Explainable Intelligence Layer

Entwirf eine KI-Schicht, die nicht nur Text generiert, sondern strukturierte, überprüfbare Arbeitsprodukte liefert:

- Kurzfassung;
- erkannte Signale;
- betroffene Objekte;
- Prioritätsbegründung;
- Evidenzverweise auf synthetische Quelldaten;
- Unsicherheit beziehungsweise Konfidenz;
- fehlende Informationen;
- vorgeschlagene nächste Aktionen;
- notwendige menschliche Entscheidung;
- ausdrücklich verbotene automatische Aktionen.

Jede KI-Ausgabe muss beantworten können: **„Warum sehe ich das?“**, **„Worauf basiert es?“** und **„Was darf das System nicht selbst tun?“**

#### D. Workflow Orchestration Layer

Das System darf lokale Demo-Arbeit vorbereiten, aber keine Außenwirkung auslösen. Es kann:

- Aufgabenentwürfe erstellen;
- Verantwortungen vorschlagen;
- Fristen und Eskalationspunkte vorbereiten;
- Checklisten aus einem Szenario ableiten;
- eine Entscheidungsvorlage erzeugen;
- Nachrichten- oder Briefingentwürfe vorbereiten;
- einen Workflow als Entwurf visualisieren;
- Auswirkungen einer Entscheidung vorab simulieren.

Es darf ohne separates Produktivgate keine Nachricht versenden, keine Einladung auslösen, keinen Upload durchführen, nichts buchen, keine Freigabe verbindlich machen und keine Person automatisch bewerten.

#### E. Role-Adaptive Experience

AMAVIO Operations und Arbeitgeber sehen denselben Fall aus unterschiedlichen, zulässigen Perspektiven. Die Oberfläche priorisiert je Rolle:

- relevante Entscheidungen;
- aktuelle Blocker;
- eigene Verantwortungen;
- benötigte Evidenz;
- nächste sichere Aktion.

Die Oberfläche soll Komplexität reduzieren, nicht durch immer neue Menüpunkte erhöhen. Nutze Progressive Disclosure, Command Palette, kontextuelle Aktionen, gute Defaults und klare Rücksprünge.

#### F. Audit-, Trust- und Learning Layer

Jede wichtige lokale Zustandsänderung zeigt:

- Ausgangssignal;
- vorgeschlagene Aktion;
- menschliche Entscheidung;
- simulierte Folge;
- spätere Beobachtung;
- daraus abgeleiteten Lernpunkt.

Trenne immer zwischen Fakt im synthetischen Szenario, regelbasierter Ableitung, KI-Hypothese, menschlicher Entscheidung und illustrativer Ergebnisbeobachtung.

### 4. KI-Funktionen mit echtem Bedienungsnutzen

Die folgenden Funktionen sind kein Menü von zehn Einzelprojekten. Integriere die wertvollsten davon in wenige durchgängige Journeys:

1. **AI Daily Brief:** verdichtet Portfolio, Fristen, neue Signale und offene Entscheidungen zu einem belegten Tagesbriefing.
2. **Natural-Language Command Center:** beantwortet Fragen wie „Welche Anreisen sind in den nächsten 14 Tagen gefährdet und warum?“ auf Basis der synthetischen Daten.
3. **Explainable Risk Copilot:** erkennt regel- oder KI-basiert mögliche Risiken, nennt Evidenz, Unsicherheit und Gegenargumente; keine automatische Risikoklassifizierung mit Personenwirkung.
4. **Next-Best-Action Assistant:** schlägt den nächsten sicheren Arbeitsschritt, Verantwortlichen, Frist und Eskalationsweg vor.
5. **Critical-Path Intelligence:** zeigt, welche Abhängigkeit den ersten Arbeitstag oder die Stabilisierung blockiert.
6. **What-if Copilot:** simuliert Auswirkungen von Verzögerungen, Ausfällen oder vertagten Entscheidungen und erklärt die Veränderung.
7. **Workflow Composer:** übersetzt ein Ziel in einen lokalen Workflow-Entwurf mit Aufgaben, Rollen, Gates und Rückfallwegen.
8. **Synthetic Document Intelligence:** extrahiert aus kontrollierten synthetischen Dokument-Fixtures Status, fehlende Angaben und nächste Prüfschritte; kein echter Upload und keine Rechtsentscheidung.
9. **Data-Quality and Anomaly Assistant:** erkennt widersprüchliche Daten, fehlende Zuständigkeiten, unplausible Fristen und doppelte Aufgaben im synthetischen Bestand.
10. **Learning Copilot:** erzeugt aus 30/60/90/180-Tage-Beobachtungen einen belegten Lernvorschlag für die nächste Kohorte, ohne Kausalität oder Wirkung zu erfinden.

Baue diese Fähigkeiten nicht als isolierte „KI-Karten“. Eine starke Kernjourney soll mehrere Fähigkeiten automatisch verbinden. Beispiel:

> Tagesbriefing → kritisches Signal → Evidenz und Abhängigkeit → What-if → nächste Aktion → menschliche Entscheidung → Workflow-Entwurf → simulierte Folge → Lernpunkt.

### 5. KI-Reifegrad und technische Ehrlichkeit

Für die lokale Demo gilt:

- Keine externen Modellaufrufe, API-Schlüssel, Cloud-Dienste, Uploads oder kostenpflichtigen AI-Services ohne ausdrückliche Founder-Freigabe.
- Implementiere zunächst eine transparente lokale Intelligence-Abstraktion mit deterministischen synthetischen Ergebnissen und einem klaren Provider-Interface für eine spätere echte KI.
- Kennzeichne regelbasierte Logik als **lokalen Regelmodus**.
- Kennzeichne simulierte generative Ausgaben als **KI-Zielbild / lokale Simulation**.
- Bezeichne nichts als produktive KI, wenn kein Modell aufgerufen wird.
- Eine spätere echte Modellintegration benötigt separate Entscheidungen zu Datenzweck, Modellanbieter, Hosting, Datenübertragung, Logging, Prompt-Injection-Schutz, Evaluation, Kosten, Fallback und menschlicher Kontrolle.
- Jede AI-Funktion braucht einen deterministischen Fallback und darf den Kernworkflow nicht blockieren.

Definiere strukturierte Output-Schemata statt freier, unprüfbarer Texte. Ein KI-Ergebnis sollte mindestens enthalten:

```text
summary
signals[]
affected_entities[]
evidence[]
confidence
missing_information[]
recommended_actions[]
human_approval_required
prohibited_automatic_actions[]
generated_at_simulated
maturity_label
```

### 6. Drei große vertikale Releases statt vieler Kleinstpakete

#### RELEASE A – AI Command Center

Liefere in einem zusammenhängenden Produkt-Slice:

- kanonischen Arrival Domain Graph;
- deterministische Szenario- und Event-Engine;
- AI Daily Brief;
- Natural-Language Command Center mit vordefinierten und freien lokalen Demo-Fragen;
- Explainable Risk und Next Best Action;
- Critical Path;
- Decision Room;
- einen kontrollierten Präsentationsmodus;
- einen vollständigen Reset;
- erste erweiterte Browser-, Accessibility- und Konsistenztests.

**Wirkungsziel:** Release A soll mindestens 75 Prozent des wahrnehmbaren Mehrwerts der nächsten Entwicklungsstufe liefern. Es ist kein Fundament ohne sichtbaren Nutzen, sondern bereits ein geschlossenes Produktversprechen in der Demo: vom Signal zur erklärbaren Entscheidung.

#### RELEASE B – Automation and Simulation

Liefere als zweiten vollständigen Slice:

- What-if Copilot;
- Workflow Composer;
- vorbereitete Aufgaben-, Briefing- und Kommunikationsentwürfe ohne Versand;
- Störfall- und Eskalationslogik;
- synthetische Dokument-Intelligence;
- Data-Quality and Anomaly Assistant;
- Audit Trail für Vorschlag, menschliche Entscheidung und simulierte Folge.

**Wirkungsziel:** Die Demo zeigt, wie AMAVIO operative Arbeit nicht nur sichtbar macht, sondern strukturiert vorbereitet und sicher beschleunigt.

#### RELEASE C – Ecosystem Intelligence and Learning

Liefere als dritten vollständigen Slice:

- kontrollierte, minimierte App-Signalgrenze für Fachkraft, Wohnanbieter und lokalen Partner;
- rollenadaptive Arbeitgeber- und AMAVIO-Sichten;
- 30/60/90/180-Tage-Lernschleife;
- Learning Copilot;
- Kohortenvergleich und Playbook-Vorschläge;
- finalen Founder-Demo-Modus;
- vollständige Responsive-, Accessibility-, Interaktions-, Claim- und Konsistenz-QA.

**Wirkungsziel:** Die Demo zeigt ein lernendes Arrival-System, ohne App und ACC zusammenzulegen oder produktive Integration zu behaupten.

### 7. Vorgehensweise – effizient, aber nicht oberflächlich

1. Prüfe zuerst Source of Truth, aktuellen Backlog, Changelog, Founder-Abnahme, App-/ACC-Grenze, QA und laufende Arbeit.
2. Starte keine parallele Doppelarbeit und keine neue Planungsschleife, wenn bereits eine belastbare Entscheidung existiert.
3. Führe einen gezielten Architektur- und UX-Audit durch. Vermeide breite Wiederholungsscans.
4. Erstelle vor Implementierung eine neue datierte Arbeitskopie und einen verifizierten Rückfallstand.
5. Lege einmalig drei kurze Steuerungsartefakte an:
   - `AI_NATIVE_PRODUCT_BLUEPRINT.md`;
   - `ACC_TARGET_ARCHITECTURE.md`;
   - `ACC_RELEASE_PLAN_AND_ACCEPTANCE.md`.
6. Beginne danach unmittelbar mit Release A, sofern kein Founder-, Rechts-, Daten-, Kosten- oder Deployment-Gate berührt wird. Stoppe nicht nach der Planung.
7. Zerlege Release A intern in sichere technische Schritte, liefere und berichte es aber als einen integrierten vertikalen Slice.
8. Nutze vorhandene Komponenten, Daten, Texte und QA-Helfer. Schreibe nichts doppelt, wenn ein belastbarer Baustein erweitert werden kann.
9. Refaktoriere nur dort, wo es Domänenkonsistenz, Testbarkeit, Wiederverwendung oder Geschwindigkeit verbessert. Kein Framework-Wechsel aus Modegründen.
10. Führe nach jeder relevanten internen Änderung zielgerichtete Tests aus; führe am Ende jedes Releases die vollständige QA aus.
11. Dokumentiere nur echte Entscheidungen, Risiken und Grenzen. Vermeide umfangreiche Statusprosa ohne Produktfortschritt.
12. Informiere den Founder nur bei einem echten Meilenstein, einem Fehler oder einer konkret benötigten Entscheidung.

### 8. Credit-, Zeit- und Kontextdisziplin

- Plane einmal, führe danach aus.
- Bevorzuge kohärente Batch-Änderungen gegenüber vielen winzigen isolierten Tickets.
- Nutze kleine technische Schritte nur intern zur Risikokontrolle.
- Lies Dateien gezielt und nicht wiederholt, solange sie sich nicht geändert haben.
- Nutze schnelle Suchwerkzeuge und vorhandene QA-Skripte.
- Erzeuge keine parallelen Varianten derselben Lösung.
- Vermeide wiederholte Zusammenfassungen bereits bestätigter Grenzen.
- Halte im Steuerungsdokument nur den aktuellen Stand, die nächste Aktion und offene Gates.
- Ein Release ist erst abgeschlossen, wenn Architektur, UI, Zustandslogik, Accessibility, Tests und Dokumentation zusammenpassen.

### 9. Definition of Done für jeden vertikalen Release

Ein Release ist nur fertig, wenn:

- die zentrale Nutzerjourney vollständig funktioniert;
- alle Ansichten dasselbe kanonische Datenmodell verwenden;
- Zustandsänderungen deterministisch, konsistent und vollständig zurücksetzbar sind;
- KI-/Regel-Ausgaben Evidenz, Unsicherheit, Reifegrad und Human Gate anzeigen;
- kein AI-Output eine verbindliche Entscheidung automatisch trifft;
- leere, fehlerhafte, blockierte und reduzierte-Bewegungs-Zustände funktionieren;
- Tastaturnutzung und Screenreader-Reihenfolge geprüft sind;
- bei 1440, 1024, 768, 390 und 360 Pixeln kein horizontaler Überlauf entsteht;
- keine Console Errors auftreten;
- statische, Interaktions-, Responsive- und Konsistenz-QA grün sind;
- alle sichtbaren Daten und Aktionen als synthetisch, lokal und ohne Außenwirkung korrekt gekennzeichnet sind;
- Claim- und Produktgrenzen mit Product Truth übereinstimmen;
- Changelog, Release-Nachweis, bekannte Grenzen und nächster sinnvoller Slice dokumentiert sind.

### 10. Harte Verbote und Gates

Ohne ausdrückliche Founder-Freigabe:

- keine echten Personen-, Mitarbeiter-, Arbeitgeber-, Objekt- oder Partnerdaten;
- keine externe Designpartner- oder Arbeitgebervalidierung;
- kein echter Modellanbieter und keine externe AI-API;
- keine produktive Registrierung, Authentifizierung oder Autorisierung;
- keine Datenbank, kein Backend und keine echte Integration;
- kein CRM, HRIS, Messaging, Datei-Service oder App-Connector;
- kein Hosting, Deployment, Veröffentlichung, Git-Push oder DNS-Wechsel;
- keine kostenpflichtige Software, API oder Medienlizenz;
- keine automatische Personenbewertung, Entscheidung, Buchung, Bestellung oder Freigabe;
- keine Behauptung, die Demo sei SaaS, produktiv, live integriert oder bereits bei Kunden im Einsatz.

Wenn ausschließlich ein solches Gate übrig ist, ändere nichts und benenne exakt die benötigte Entscheidung.

### 11. Erwartete erste Ausgabe und anschließende Aktion

Antworte zu Beginn knapp mit:

1. bestätigter Source of Truth und aktiver Arbeitskopie;
2. gefundenem Ist-Stand und vermiedener Doppelarbeit;
3. Zielarchitektur in höchstens zwölf Punkten;
4. Release-A-Scope und messbaren Akzeptanzkriterien;
5. neuem datierten Rückfall- und Arbeitskopiepfad;
6. konkret erstem Implementierungsschritt.

Beginne anschließend mit Release A. Bitte nicht erneut um Zustimmung für sichere, lokale, synthetische und reversible Implementierungsschritte innerhalb dieses freigegebenen Scopes. Stoppe nur bei einem echten Gate, einem Konflikt mit der Source of Truth oder einem Risiko, das die bestehende Demo beziehungsweise Rückfallbasis gefährden würde.

### 12. Qualitätsanspruch

Denke wie ein Founder, der ein neues Produktsegment definieren will; wie ein AI Engineer, der Halluzinationen, Datenqualität und menschliche Verantwortung ernst nimmt; und wie ein Principal Engineer, der weiß, dass eine starke Demo nur dann überzeugt, wenn Datenmodell, Zustand, Oberfläche und Geschichte zusammenpassen.

Das Ergebnis soll nicht wie ein größeres Dashboard wirken. Es soll sich wie ein ruhiges, intelligentes **Arrival Operations System** anfühlen, das Komplexität reduziert und Entscheidungen vorbereitet – klar, erklärbar, hochwertig und ehrlich über seinen Reifegrad.

---

## Anwendungshinweis

Dieser Prompt ist für die Fortsetzung im ACC-Entwicklungschat gedacht. Vor Ausführung ist lediglich zu entscheiden, ob **Release A vollständig** als nächster lokaler Entwicklungsauftrag freigegeben wird. Der Prompt selbst erteilt keine externe, produktive oder kostenpflichtige Freigabe.
