# AMAVIO ACC – Productization Gate 01.5

## Operational Product Depth & AI Readiness

**Stand:** 07.10.2026  
**Status:** Releases D–F als lokaler vertikaler Founder-Evaluationsschnitt implementiert; produktive Vollabnahme und Gate 02 weiterhin offen  
**Arbeitsmodus:** lokal, ausschließlich synthetisch, ohne Außenwirkung  
**Technische Basis:** Productization Gate 01 mit lokalem Node.js-Backend, SQLite, Mandantenkontext, Human Gate, Audit Trail und `sink_only`-Ausgängen  
**Rückfallbasis der Planungsänderung:** `archive/20261007_gate_01_5_plan_baseline/`  
**Rückfallbasis der Implementierung:** `archive/20261007_gate_01_5_implementation_baseline/`  
**Implementierungsnachweis:** `QA/ACC_PRODUCTIZATION_GATE_01_5_QA_20261007.md`

## 1. Founder-Entscheidung und Zielbild

Gate 01.5 wird vor Gate 02 umgesetzt. Der externe AI Provider wird geparkt, bis das ACC auch ohne generative KI einen belastbaren operativen Nutzen zeigt.

Das Produktziel lautet:

> Das ACC führt AMAVIO Operations und autorisierte Arbeitgeberrollen durch einen vollständigen synthetischen Arrival-Fall: Ausgangslage verstehen, Abhängigkeiten erkennen, Evidenz prüfen, Ausnahmen bearbeiten, Folgen simulieren, eine menschliche Entscheidung treffen, ein verwertbares Arbeitsprodukt erzeugen und den Verlauf nachvollziehbar evaluieren.

Die Intelligenz bleibt zunächst lokal, deterministisch, erklärbar und testbar. Eine spätere externe KI darf nur klar benannte Teilaufgaben verstärken. Sie darf weder das Domänenmodell ersetzen noch einen eigenen, unkontrollierten Produktpfad erzeugen.

## 2. Warum Gate 01.5 vor einem AI Provider kommt

Gate 01 beweist bereits die technische Sicherheitskette:

`synthetische Sitzung → Mandantenkontext → persistierter Fall → strukturierter Vorschlag → Human Gate → Audit → wirkungsloser Sink`

Noch nicht bewiesen sind jedoch die eigentlichen operativen Fähigkeiten eines Arrival-Produkts:

- mehrere zusammenhängende Fälle und Kohorten statt eines einzelnen Demonstrationsfalls;
- ein kanonischer Fallzustand mit Phasen, Verantwortungen und Fristen;
- fachliche Abhängigkeiten und ein nachvollziehbarer kritischer Pfad;
- Ausnahmebearbeitung mit Auslöser, Auswirkung, Lösung und Eskalation;
- Evidenz mit Herkunft, Gültigkeit, Widerspruch und Prüfergebnis;
- sichere Was-wäre-wenn-Simulationen ohne Veränderung des Originalfalls;
- wiederverwendbare Arbeitsprodukte statt bloßer Textantworten;
- messbare Produktqualität und eine reproduzierbare Evaluationsbasis.

Ohne diese Schicht würde externe KI nur eine dünne Oberfläche sprachlich aufwerten. Mit Gate 01.5 erhält ein späteres Modell dagegen klare Eingaben, erlaubte Aufgaben, strukturierte Ausgaben, Vergleichsbaselines und Fehlergrenzen.

## 3. Harte Produkt- und Freigabegrenzen

### In Gate 01.5 freigegeben

- lokale Weiterentwicklung innerhalb einer neuen datierten ACC-Arbeitskopie;
- ausschließlich synthetische Arbeitgeber-, Fall-, Personenreferenz-, Objekt- und Partnerdaten;
- lokale SQLite-Persistenz und versionierte Schema-Migrationen;
- deterministische Fachlogik, Regeln, Simulationen und Berechnungen;
- lokale Human-Gate-Entscheidungen ohne rechtliche oder externe Wirkung;
- lokale Arbeitsprodukte, Exporte und Kommunikationsvorschauen ohne Versand;
- reproduzierbare Browser-, Interaktions-, Accessibility-, API-, Datenbank- und Isolationstests.

### Ausgeschlossen

- externe oder generative KI-Aufrufe;
- API-Schlüssel, Providerkonto, Vertrag oder Kostenfreigabe;
- echte Personen-, Beschäftigten-, Arbeitgeber-, Objekt- oder Partnerdaten;
- produktive Registrierung, Authentifizierung oder Autorisierung;
- CRM-, HRIS-, App-, Messaging-, Buchungs-, Datei- oder Zahlungssysteme;
- reale Prognosen, Profiling, Eignungs- oder Leistungsbewertungen;
- automatische Freigaben, Priorisierung von Personen oder Entscheidungen mit Außenwirkung;
- Hosting, Veröffentlichung, Deployment oder externe Validierung.

### Produktgrenze

Das ACC bleibt die operative Arbeitgeber- und AMAVIO-Oberfläche. Fachkraft, Wohnanbieter und lokaler Partner bleiben Rollen der getrennten App. Gate 01.5 darf diese Trennung fachlich über kontrollierte synthetische Signale beschreiben, aber weder technisch integrieren noch die externen Rollen in das ACC übernehmen.

## 4. Produktprinzipien

1. **Ein Fall, eine Wahrheit:** Alle Ansichten lesen denselben kanonischen Fallzustand.
2. **Evidenz vor Behauptung:** Status und Empfehlung müssen auf konkreten Evidenzeinträgen oder transparenten Regeln beruhen.
3. **Ausnahme vor Happy Path:** Das Produkt muss zeigen, wie Arbeit bei fehlender, verspäteter oder widersprüchlicher Information weitergeht.
4. **Simulation ist keine Änderung:** Szenarien laufen in einer isolierten Kopie und verändern den Originalfall erst nach bewusster menschlicher Übernahme.
5. **Entscheidung ist ein eigenes Objekt:** Option, Begründung, Folgen, Entscheiderrolle und Zeitpunkt werden gespeichert.
6. **Arbeitsprodukt statt Chatantwort:** Der Wert endet in einem prüfbaren Plan, Briefing, Übergabepaket oder Entwurf.
7. **Intelligenz im Arbeitsfluss:** Keine dominanten KI-Module; Unterstützung erscheint kontextuell dort, wo eine Aufgabe entsteht.
8. **Erklärbarkeit ist Teil des Produkts:** Regel, Quelle, Unsicherheit und fehlende Information sind sichtbar.
9. **Keine Außenwirkung:** Jede scheinbar schreibende Aktion bleibt lokal, synthetisch und als solche bezeichnet.
10. **Baseline vor Modell:** Jede spätere KI-Funktion muss gegen die lokale deterministische Baseline messbar besser sein.

## 5. Kernnutzer und ihre operativen Aufgaben

### AMAVIO Operations

- neue Fälle qualifizieren und strukturieren;
- fehlende Informationen und kritische Abhängigkeiten erkennen;
- Evidenz prüfen und Widersprüche klären;
- Ausnahmen bearbeiten und Eskalationen vorbereiten;
- Optionen simulieren und Entscheidungsvorlagen erstellen;
- Arbeitsprodukte erzeugen und die Umsetzung nachhalten.

### Arbeitgeber-Sponsor

- Gesamtstatus, kritische Entscheidungen und Auswirkungen verstehen;
- Freigaben innerhalb der Demo fachlich prüfen;
- Verantwortlichkeiten und offene Blockaden sehen.

### HR/Fachbereich

- startrelevante Informationen, Zuständigkeiten und Arbeitsprodukte prüfen;
- fehlende Arbeitgeberbeiträge erkennen;
- lokale Kommunikationsentwürfe freigeben oder zurückweisen.

### Standortleitung

- operative Zeitfenster, Ansprechpartner, Übergaben und Vor-Ort-Abhängigkeiten bearbeiten;
- Auswirkungen einer Verschiebung auf Anreise und Start nachvollziehen.

### Budget-/Freigaberolle

- kostenrelevante synthetische Optionen und Entscheidungsfolgen sehen;
- keine Zahlung oder Buchung auslösen.

Diese Rollen sind fachliche Perspektiven der Konzeptdemo, keine produktive Rechteprüfung.

## 6. Kanonisches Domänenmodell

Gate 01.5 erweitert das schmale Gate-01-Modell zu einem versionierten Arrival-Domänenmodell. Alle Entitäten tragen `tenant_id`, `synthetic = 1`, Zeitstempel und eine fachliche Versionsnummer.

| Entität | Zweck | Zentrale Felder |
|---|---|---|
| `employer_mandate` | Arbeitgeberauftrag und Leistungsrahmen | Name, Standort, Kohorte, Sponsorrolle, Scope, Status |
| `arrival_case` | kanonischer operativer Fall | Titel, Phase, Zustand, Anreisedatum, Startdatum, Verantwortliche, Version |
| `milestone_definition` | wiederverwendbarer fachlicher Meilenstein | Code, Phase, Pflichtgrad, Vorbedingungen |
| `case_milestone` | konkreter Meilenstein im Fall | Status, Solltermin, Isttermin, Owner, Evidenzgrad |
| `case_dependency` | gerichtete fachliche Abhängigkeit | Vorgänger, Nachfolger, Typ, Verzögerung, Kritikalität |
| `task` | bearbeitbare operative Arbeit | Aktion, Ownerrolle, Frist, Status, Blockierungsgrund |
| `evidence_item` | belegbare Information | Typ, Quelle, Aussage, Gültigkeit, Prüfstatus, Widerspruchsgruppe |
| `exception` | Abweichung vom erwarteten Verlauf | Auslöser, Schweregrad, Auswirkung, Frist, Status, Playbook |
| `decision_request` | menschlich zu entscheidende Frage | Optionen, Folgen, benötigte Evidenz, Entscheiderrolle, Status |
| `decision` | getroffene lokale Demoentscheidung | gewählte Option, Begründung, Prüfer, Zeitpunkt, Wirkungssperre |
| `case_event` | unveränderbares fachliches Ereignis | Typ, Quelle, Payload, Akteur, Zeitpunkt |
| `simulation_run` | isolierter Was-wäre-wenn-Lauf | Basisversion, Eingangsänderung, Ergebnis, Delta, Übernahmestatus |
| `work_product` | verwertbares lokales Ergebnis | Typ, Version, Inhalt, Quellen, Prüfstatus, `sink_only` |
| `rule_definition` | versionierte lokale Fachregel | Trigger, Bedingungen, Ergebnis, Erklärung, Status |
| `rule_execution` | nachvollziehbare Regelausführung | Regelversion, Eingaben, Ergebnis, Belege, Zeitpunkt |
| `evaluation_case` | kanonisches Testszenario | Fixture, Erwartung, verbotene Ergebnisse, Rubrik |
| `evaluation_run` | gemessener Lauf | Engineversion, Resultat, Abweichungen, Bewertung |

### Datenmodellregeln

- Keine operative Kerninformation wird nur als unstrukturiertes Freitextfeld gespeichert.
- Freitext ergänzt strukturierte Daten, ersetzt aber nicht Status, Owner, Frist, Quelle oder Entscheidung.
- Änderungen an kanonischen Objekten erzeugen ein `case_event` und einen Audit-Eintrag.
- Abgeleitete Werte wie kritischer Pfad oder Readiness werden neu berechnet und nicht als unerklärter Wahrheitswert behandelt.
- Simulationen referenzieren eine unveränderliche Basisversion des Falls.
- Arbeitsprodukte enthalten ihre verwendeten Evidenz- und Regelreferenzen.

## 7. Fallzustand und Prozesslogik

### Operative Phasen

1. `intake` – Auftrag und Ausgangslage erfassen
2. `preparation` – Voraussetzungen, Dokumente und Verantwortungen klären
3. `arrival_ready` – Anreise operativ absichern
4. `arrival` – Übergaben und Ankunft koordinieren
5. `start_ready` – ersten Arbeitstag und Standortzugang absichern
6. `stabilization` – 30/60/90-Tage-Nachlauf beobachten
7. `closed` – Fall fachlich abschließen

### Zustände

- `draft`
- `active`
- `blocked`
- `awaiting_evidence`
- `awaiting_decision`
- `ready`
- `completed`
- `cancelled_demo`

Ein Fall kann nur über definierte Übergänge wechseln. Jeder Übergang nennt Vorbedingungen und erzeugt ein Ereignis. Beispielsweise darf `arrival_ready` nur erreicht werden, wenn alle als kritisch markierten Meilensteine erfüllt oder bewusst menschlich übersteuert sind.

### Readiness ohne Scheinprognose

Gate 01.5 zeigt keinen Wahrscheinlichkeitswert. Stattdessen wird ein erklärbarer Readiness-Status aus transparenten Bedingungen gebildet:

- `bereit`: alle kritischen Vorbedingungen erfüllt;
- `unter Beobachtung`: keine harte Blockade, aber offene zeitkritische Aufgabe;
- `blockiert`: mindestens eine unerfüllte harte Abhängigkeit;
- `Entscheidung erforderlich`: Fortschritt hängt von einem Human Gate ab;
- `Evidenz unzureichend`: Status kann mit vorhandenen Belegen nicht bestätigt werden.

Jeder Status muss seine auslösenden Bedingungen anzeigen.

## 8. Release-Schnitt Gate 01.5

Gate 01.5 wird in drei zusammenhängenden Releases umgesetzt. Jeder Release liefert ein nutzbares Ende-zu-Ende-Ergebnis und keine isolierte Sammlung kleiner UI-Funktionen.

## Release D – Operational Case Workbench

### Produktversprechen

Ein Nutzer kann einen komplexen synthetischen Arrival-Fall vollständig öffnen, verstehen und bearbeiten, ohne zwischen unverbundenen Demo-Modulen zu springen.

### Umfang

- Fallübersicht für mindestens acht synthetische Fälle in zwei getrennten Mandanten;
- Kohorten- und Standortkontext;
- Fallkopf mit Phase, Zustand, kritischem Pfad, nächster Verantwortung und Entscheidungsbedarf;
- Zeitachse mit Meilensteinen, Abhängigkeiten und Fristen;
- Aufgabenliste mit Ownerrolle, Status, Frist und Blockierungsgrund;
- Evidenzakte mit Herkunft, Prüfstatus, Gültigkeit und Widerspruch;
- Ausnahmeakte mit Schweregrad, Auswirkung und nächstem sicheren Schritt;
- menschliche Entscheidung als eigenes, versioniertes Objekt;
- vollständige Event- und Audit-Historie;
- rollenbezogene Darstellung für AMAVIO Operations und Arbeitgeberperspektiven;
- ruhige Progressive-Disclosure-Oberfläche: Überblick zuerst, Details kontextuell.

### Ende-zu-Ende-Journey

`Portfolio öffnen → priorisierten Fall wählen → kritische Abhängigkeit verstehen → fehlende oder widersprüchliche Evidenz prüfen → Aufgabe bearbeiten → Entscheidung vorbereiten → Entscheidung menschlich dokumentieren → Fallzustand nachvollziehbar aktualisieren`

### Technischer Kern

- versionierte SQLite-Migration statt Neuaufbau der Datenbank;
- Repository- und Domain-Service-Schicht zwischen HTTP und Datenbank;
- serverseitige Zustandsübergänge und Tenant-Filter;
- idempotente Mutationen mit Versionsprüfung gegen verlorene Änderungen;
- unveränderbare Ereignisse und Audit-Einträge;
- API-Vertrag `acc.api.v1.5`.

### Exit-Kriterien Release D

- fünf definierte Kernjourneys funktionieren vom Browser bis zur Datenbank;
- Neustart erhält alle Änderungen;
- jeder kritische Status ist aus Evidenz, Regeln oder Entscheidung erklärbar;
- Cross-Tenant-Negativtests decken jede neue Entität ab;
- keine schreibende Route akzeptiert eine frei vom Client gesetzte `tenant_id`;
- keine Außenwirkung und kein externer Netzwerkaufruf;
- Desktop, Tablet, Mobile, Tastatur und Screenreader-Basis sind geprüft.

## Release E – Exceptions, Automation & Simulation

### Produktversprechen

Das ACC reagiert nachvollziehbar auf operative Änderungen, zeigt Auswirkungen auf den kritischen Pfad und bietet sichere Handlungsoptionen, ohne selbstständig eine reale Aktion auszuführen.

### Umfang

- lokale Rules Engine mit versionierten, menschenlesbaren Regeln;
- Exception Command Center für zeitkritische und widersprüchliche Zustände;
- Abhängigkeitsgraph mit kritischem Pfad und Auswirkungen auf Folgeaufgaben;
- Playbooks für wiederkehrende Ausnahmeklassen;
- What-if-Sandbox mit isolierten Simulationen;
- Vorher-/Nachher-Differenz für Termine, Aufgaben, Blockaden und Entscheidungen;
- bewusste Übernahme ausgewählter Simulationsergebnisse durch Human Gate;
- lokale Workflow-Vormerkungen mit Trigger, Owner, Frist und Abbruchbedingung;
- Batch-Sicht für Kohortenereignisse, ohne automatische Personenentscheidung;
- nachvollziehbare Regelspur je Empfehlung.

### Mindestset lokaler Regeln

1. fehlende bestätigte Ankunftszeit bei nahendem Anreisedatum;
2. widersprüchliche Datumsangaben in zwei Evidenzeinträgen;
3. nicht erfüllte harte Abhängigkeit vor einem Meilenstein;
4. überfällige Arbeitgeberverantwortung;
5. Änderung des Anreisedatums mit Folgeauswirkungen;
6. fehlender Standortkontakt vor dem ersten Arbeitstag;
7. Wohnoption ohne dokumentierte Prüfentscheidung;
8. Entscheidung ohne ausreichende Evidenz;
9. Kohortenereignis mit Auswirkungen auf mehrere Fälle;
10. veraltete Evidenz nach einem relevanten Fallereignis.

### Simulationsregeln

- ein Lauf arbeitet auf einem Snapshot und schreibt nicht in den Originalfall;
- Ergebnis enthält Eingabeannahmen, Regelversionen, Deltas und Unsicherheiten;
- Übernahme ist granular, nicht „alles übernehmen“;
- Übernahme erfordert Prüfnotiz und erzeugt neue Fallversion plus Audit;
- jede Simulation ist reproduzierbar oder als nicht reproduzierbar gesperrt;
- eine Simulation darf weder Nachricht, Buchung noch Freigabe auslösen.

### Exit-Kriterien Release E

- zehn Mindestregeln liefern bei gleichen Eingaben dasselbe Ergebnis;
- mindestens sechs Ausnahmeszenarien sind Ende-zu-Ende bearbeitbar;
- kritischer Pfad wird aus dem Abhängigkeitsgraph berechnet und erklärt;
- Simulation verändert den Originalfall vor der Übernahme nachweislich nicht;
- abgelehnte oder teilweise übernommene Simulationen bleiben auditierbar;
- jede Regel hat Positiv-, Negativ- und Grenzfalltests;
- keine autonome Entscheidung und keine Außenwirkung.

## Release F – Work Products, Evidence & Evaluation

### Produktversprechen

Das ACC erzeugt aus geprüfter Fallarbeit belastbare lokale Arbeitsprodukte und kann seine eigene Produktleistung gegen definierte Erwartungen messen.

### Arbeitsprodukte

1. **Arrival Readiness Brief** – aktueller Status, kritische Blockaden, nächste Verantwortungen;
2. **Decision Memo** – Entscheidungsfrage, Optionen, Evidenz, Folgen und menschliche Begründung;
3. **Exception Resolution Plan** – Ausnahme, Ursache, Maßnahmen, Owner, Fristen und Abbruchbedingungen;
4. **Employer Handover Brief** – rollenbezogene Arbeitgeberaufgaben und bestätigte Voraussetzungen;
5. **30/60/90 Stabilization Plan** – synthetische Nachlaufpunkte ohne Leistungsbewertung;
6. **Communication Draft** – lokale, nicht versendete Nachrichtenvorschau mit Quellen und Freigabestatus;
7. **Case Closure Record** – Ergebnis, offene Restpunkte, Entscheidungen und Audit-Verweise.

Jedes Arbeitsprodukt ist versioniert, bearbeitbar, quellengebunden, lokal gespeichert und als `synthetic_only` sowie `sink_only` gekennzeichnet.

### Evidenzqualität

Jeder Evidenzeintrag erhält:

- fachlichen Typ und behauptete Aussage;
- synthetische Quelle und Erfassungszeitpunkt;
- Gültigkeitszeitraum;
- Prüfstatus `unreviewed`, `confirmed`, `rejected`, `superseded` oder `conflicting`;
- verantwortliche Prüferrolle;
- Referenzen auf abhängige Meilensteine und Entscheidungen;
- Widerspruchsgruppe bei kollidierenden Angaben.

### Evaluation Lab

Gate 01.5 enthält eine lokale Evaluationsbibliothek mit mindestens 24 synthetischen kanonischen Szenarien:

- 6 Standardverläufe;
- 6 fehlende-Evidenz- oder Widerspruchsfälle;
- 6 Ausnahme- und kritischer-Pfad-Fälle;
- 4 Human-Gate- und verbotene-Aktion-Fälle;
- 2 Cross-Tenant- und Isolation-Fälle.

Jedes Szenario definiert Eingaben, erwartete Status, erwartete nächste Schritte, zulässige Varianten und verbotene Ergebnisse.

### Bewertungsdimensionen

- fachliche Korrektheit;
- Vollständigkeit;
- Evidenztreue;
- korrekte Abhängigkeiten;
- sichere nächste Schritte;
- Einhaltung des Human Gates;
- keine verbotene Aktion;
- Rollen- und Mandantentreue;
- Verständlichkeit;
- Reproduzierbarkeit.

### Exit-Kriterien Release F

- sieben Arbeitsprodukte entstehen aus demselben kanonischen Fallmodell;
- jede Aussage eines Arbeitsprodukts ist auf Evidenz, Regel oder Entscheidung zurückführbar;
- alle 24 Szenarien laufen automatisiert und reproduzierbar;
- 100 % Schema- und Sicherheitskonformität;
- 0 Cross-Tenant-Datenfunde;
- 0 verbotene Außenwirkungen;
- lokale Baseline und Evaluationsergebnisse sind versioniert;
- Founder-Abnahme der 6–8-Minuten-Journey ist dokumentiert.

## 9. Sechs operative Kernjourneys

Diese Journeys sind die primären Abnahmepfade. Funktionen ohne Beitrag zu mindestens einer Journey werden für Gate 01.5 nicht priorisiert.

### J1 – Fallaufnahme und Readiness-Baseline

Ein synthetischer Arbeitgeberfall wird aus einem Mandat geöffnet. Das ACC zeigt vorhandene und fehlende Informationen, erzeugt den initialen Meilensteinplan und benennt die nächste Verantwortung.

### J2 – Blockade und kritischer Pfad

Eine harte Abhängigkeit ist nicht erfüllt. Das ACC zeigt Ursache, betroffene Folgeaufgaben, zeitliche Auswirkung und sichere Handlungsoptionen. Ein Mensch entscheidet über das weitere Vorgehen.

### J3 – Evidenzkonflikt

Zwei synthetische Quellen nennen unterschiedliche Termine. Das ACC markiert den Widerspruch, verhindert eine unbelegte Statusfreigabe und führt durch Klärung, Entscheidung und Dokumentation.

### J4 – Änderung und Simulation

Das Anreisedatum wird hypothetisch verschoben. Die Simulation zeigt Auswirkungen auf Wohnoption, Standortübergabe, Startbereitschaft und Aufgaben. Der Originalfall bleibt unverändert, bis einzelne Änderungen bewusst übernommen werden.

### J5 – Arbeitsprodukt und Human Gate

Aus geprüfter Evidenz entsteht ein Decision Memo oder Arrival Readiness Brief. Der Nutzer prüft Quellen und Begründung, bearbeitet den Entwurf und speichert ihn lokal als freigegebene Vorschau ohne Versand.

### J6 – Portfolio- und Kohortensteuerung

Ein synthetisches Standortereignis betrifft mehrere Fälle. Das ACC bündelt die Auswirkung, zeigt die betroffenen kritischen Pfade und erzeugt fallbezogene Aufgaben, ohne Personen automatisch zu bewerten oder zu priorisieren.

## 10. Technische Zielarchitektur für Gate 01.5

```text
Browser UI
  ├─ Portfolio / Kohorte
  ├─ Case Workbench
  ├─ Evidence & Exception Desk
  ├─ Simulation
  └─ Work Products / Evaluation
          │
          ▼
Local HTTP API / BFF
  ├─ Session & Tenant Context
  ├─ Input Validation
  ├─ API Contracts v1.5
  └─ No-Effect Guard
          │
          ▼
Domain Services
  ├─ Case State Machine
  ├─ Milestone & Dependency Service
  ├─ Evidence Consistency Service
  ├─ Exception & Decision Service
  ├─ Simulation Service
  ├─ Work Product Service
  └─ Evaluation Service
          │
          ▼
Deterministic Intelligence
  ├─ Rules Engine
  ├─ Critical Path Calculator
  ├─ Readiness Evaluator
  ├─ Template Renderer
  └─ Explainability Trace
          │
          ▼
SQLite Repositories + Immutable Events + Audit
          │
          ├─ Outbox Preview Sink
          └─ Booking Preview Sink

External AI Provider Boundary: in Gate 01 als gesperrter Modus angelegt;
ein echter Adapter wird in Gate 01.5 weder implementiert noch aktiviert.
```

### Architekturregeln

- HTTP-Routen enthalten keine verstreute Fachlogik.
- Domänenservices sind separat testbar und providerunabhängig.
- Regeln und Templates sind versioniert, aber keine zur Laufzeit frei ausführbaren Skripte.
- Tenant-Kontext kommt ausschließlich aus der serverseitig abgeleiteten Sitzung.
- Alle Mutationen prüfen Fallversion und erlaubten Zustandsübergang.
- Audit-Ereignisse sind append-only.
- Arbeitsprodukte werden aus strukturierten Daten erzeugt; HTML oder Markdown ist Darstellung, nicht Quelle.
- Der Browser erhält keine Geheimnisse und ruft keinen externen Modellanbieter auf.

### Providerneutrale Capability-Grenze

Die spätere KI wird nicht als globaler Chat und nicht als direkter Datenbankzugriff geplant. Gate 01.5 definiert lediglich einen stabilen serverseitigen Port, gegen den zunächst ausschließlich die lokale Engine läuft:

```text
CapabilityRequest
  capability: summarize_evidence | explain_conflict | draft_work_product | explain_simulation
  contractVersion: acc.capability.v1
  caseSnapshot: explizit freigegebener strukturierter Ausschnitt
  evidenceRefs: erlaubte synthetische Quellen
  constraints: Sprache, Länge, verbotene Aktionen, Human Gate

CapabilityResult
  status: completed | insufficient_evidence | blocked
  structuredDraft: schema-validiertes Ergebnis
  citations: verwendete Evidence-IDs
  uncertainties: fehlende oder widersprüchliche Informationen
  forbiddenActions: bestätigte Wirkungssperren
  trace: Engine-, Regel-, Prompt- oder Modellversion
```

Vorgesehene Adapterstruktur:

- `LocalDeterministicAdapter` ist die Gate-01.5-Baseline und der dauerhafte Fallback;
- `ExternalModelAdapter` bleibt bis Gate 02 eine nicht implementierte Schnittstelle;
- beide Adapter müssen denselben Capability-Vertrag erfüllen;
- ein externer Adapter erhält später nur den explizit zusammengestellten Request, keinen Datenbankzugriff;
- Schema-, Quellen-, Sicherheits- und Human-Gate-Prüfung erfolgen nach einem Modellaufruf erneut serverseitig;
- Fähigkeiten werden einzeln freigeschaltet; es gibt keinen globalen Schalter „KI aktiv“;
- jede Fähigkeit besitzt eigene Evaluation, Kostenmessung, Timeout, Rate Limit und Kill Switch.

## 11. Geplante API-Schnittstellen

Die genaue OpenAPI-Spezifikation entsteht mit Release D. Der geplante Zuschnitt lautet:

| Methode und Pfad | Zweck | Schutzregel |
|---|---|---|
| `GET /api/v1.5/portfolio` | Mandats-, Kohorten- und Fallübersicht | tenantgebunden |
| `GET /api/v1.5/cases/:id` | vollständige Fallarbeitsfläche | tenantgebunden |
| `POST /api/v1.5/cases/:id/transitions` | erlaubten Zustandswechsel ausführen | Version + Human Gate |
| `POST /api/v1.5/cases/:id/tasks` | lokale Aufgabe anlegen | strukturierte Validierung |
| `PATCH /api/v1.5/tasks/:id` | Aufgabe bearbeiten | Tenant + Version |
| `POST /api/v1.5/cases/:id/evidence` | synthetische Evidenz ergänzen | Herkunft + Typ Pflicht |
| `POST /api/v1.5/evidence/:id/review` | Evidenz prüfen | Prüfnotiz Pflicht |
| `POST /api/v1.5/cases/:id/exceptions` | Ausnahme erfassen | Auswirkung Pflicht |
| `POST /api/v1.5/decisions/:id/review` | menschliche Entscheidung | Rolle + Begründung Pflicht |
| `POST /api/v1.5/cases/:id/simulations` | isolierten Lauf starten | Snapshot, keine Mutation |
| `POST /api/v1.5/simulations/:id/apply` | ausgewählte Deltas übernehmen | granular + Human Gate |
| `POST /api/v1.5/cases/:id/work-products` | lokales Arbeitsprodukt erzeugen | Quellenreferenzen Pflicht |
| `POST /api/v1.5/work-products/:id/review` | Produkt prüfen | `sink_only` bleibt |
| `POST /api/v1.5/evaluations/runs` | lokale Testsuite ausführen | synthetische Fixtures |
| `GET /api/v1.5/audit` | Ereignis- und Prüfspur | tenantgebunden |

## 12. Umsetzungsplan in sechs großen Arbeitspaketen

Die Pakete werden sequenziell auf einer neuen datierten Arbeitskopie umgesetzt. Ein Paket gilt erst als abgeschlossen, wenn Code, Tests, Browser-QA und Dokumentation gemeinsam erfüllt sind.

### WP1 – Domain Kernel & Migration

- versioniertes Schema und Migration von Gate 01 auf 1.5;
- Entitäten, Zustandsmaschine und Dateninvarianten;
- synthetische Fixture-Fabrik für zwei Mandanten, acht Fälle und mindestens zwei Kohorten;
- Repository-Schicht und Tenant-Isolation;
- Rollback- und Neuaufbaupfad nur für synthetische Entwicklungsdaten.

**Ergebnis:** belastbare fachliche Datenbasis, noch ohne neue große UI.

### WP2 – Case Services & Contract API

- Meilenstein-, Aufgaben-, Evidenz-, Ausnahme- und Entscheidungsservices;
- Abhängigkeitsgraph und Readiness-Evaluator;
- API `v1.5`, Fehlerverträge und Idempotenz;
- Domain-, Contract-, Cross-Tenant- und Persistenztests.

**Ergebnis:** vollständige Fallarbeit ist per API beweisbar.

### WP3 – Operational Case Workbench

- Portfolio, Fallkopf, Zeitachse und kontextuelle Arbeitsbereiche;
- Progressive Disclosure statt Modulwand;
- Rollenperspektiven ohne produktive Rechtebehauptung;
- sechs Kernjourneys zunächst für Release D;
- visuelles Konzept vor Implementierung, anschließend Screenshot- und Responsive-QA.

**Ergebnis:** ruhige, verständliche und tief bedienbare operative Oberfläche.

### WP4 – Rules, Exceptions & Simulation

- Rules Engine und zehn Mindestregeln;
- Exception Desk und Playbooks;
- isolierte Simulation, Delta-Ansicht und granulare Übernahme;
- Regelspur, Unsicherheit und Negative Tests.

**Ergebnis:** lokale Intelligenz arbeitet nachvollziehbar im Prozess.

### WP5 – Work Products & Evidence Ledger

- sieben Arbeitsprodukttypen;
- Template-, Versions- und Quellenlogik;
- Evidenzkonflikte und Veraltung;
- lokale Vorschau, Bearbeitung, Prüfung und `sink_only`-Ablage.

**Ergebnis:** Fallarbeit endet in nutzbaren, prüfbaren Ergebnissen.

### WP6 – Evaluation, Hardening & Founder Journey

- 24 Szenarien und automatisierte Bewertungsrubrik;
- komplette QA-Matrix;
- Performance- und Fehlermodusprüfung im lokalen Umfang;
- 6–8-Minuten-Founder-Journey und Abnahmeprotokoll;
- dokumentierte Gap-Liste für eine mögliche externe KI-Verstärkung.

**Ergebnis:** Gate 01.5 ist abnahmefähig und Gate 02 kann sachlich statt spekulativ entschieden werden.

## 13. Nichtfunktionale Anforderungen

### Sicherheit und Daten

- jeder Datensatz ist synthetisch und mandantengebunden;
- Cross-Tenant-Zugriff liefert weder Daten noch Existenzhinweise;
- keine Secrets und keine externen Netzwerkziele im Frontend;
- Größen-, Typ- und Längenlimits für alle schreibenden Eingaben;
- serverseitige Allow-Lists für Zustände, Ereignisse und Rollen;
- Audit Trail für Mutation, Entscheidung, Simulation und Arbeitsprodukt;
- Datenbankmigrationen sind vorwärtsgerichtet und testbar.

### Usability und Accessibility

- Hauptjourney ohne versteckte Moduswechsel verständlich;
- vollständige Tastaturbedienung;
- sichtbarer Fokus, sinnvolle Überschriftenhierarchie und Live-Regionen;
- keine Farbcodierung als einziger Statusindikator;
- ausreichend große Interaktionsziele und mobile sichere Layouts;
- Reduced Motion respektiert;
- keine horizontalen Überläufe in den vereinbarten Viewports.

### Zuverlässigkeit

- ein Neustart erhält Fall-, Entscheidungs-, Simulations- und Arbeitsproduktzustände;
- ungültige Zustandswechsel werden serverseitig abgelehnt;
- parallele Bearbeitung wird über Versionskonflikte sichtbar;
- Fixture-Reset ist eindeutig lokal und synthetisch;
- Fehlerzustände geben konkrete, nicht technische Handlungsoptionen aus.

### Performance im Demoumfang

- Portfolio mit acht Fällen reagiert ohne wahrnehmbare Blockade;
- Fallwechsel benötigt keinen kompletten Seitenreload;
- deterministische Regeln und Simulationen bleiben lokal reproduzierbar;
- keine Performance-Behauptung über produktive Last oder Skalierung.

## 14. QA-Strategie

### Automatisierte Ebenen

1. Syntax- und statische Asset-Prüfung;
2. Datenbankmigration und Schema-Invarianten;
3. Domain-Unit-Tests für Zustände, Abhängigkeiten und Regeln;
4. API-Contract-Tests;
5. Cross-Tenant-Negativtests für jede Entität;
6. Persistenz- und Neustarttests;
7. Simulations-Isolation und Übernahmeprüfung;
8. Arbeitsprodukt-Provenienz;
9. Evaluationsszenarien;
10. Browser-Interaktionsmatrix.

### Manuelle und visuelle Ebenen

- visuelles Produktkonzept vor UI-Implementierung;
- Desktop, Tablet und Mobile;
- AMAVIO Operations und Arbeitgeberperspektiven;
- vollständige sechs Kernjourneys;
- Tastatur-only;
- Screenreader-Basis und verständliche Statusmeldungen;
- Fehler-, Leer-, Lade-, Konflikt- und Nicht-verfügbar-Zustände;
- Founder-Präsentationswirkung und Funktionsverständlichkeit.

Die detaillierte Freigabematrix liegt in `QA/ACC_GATE_01_5_ACCEPTANCE_MATRIX_20261007.md`.

## 15. Gate-01.5-Founder-Journey in 6–8 Minuten

1. **Portfolio und Produktgrenze:** zwei synthetische Mandanten, klare ACC-/App-Trennung.
2. **Priorisierter Fall:** Phase, Readiness, kritischer Pfad und nächste Verantwortung.
3. **Evidenzkonflikt:** widersprüchliche Angabe öffnen, Quellen und Auswirkung prüfen.
4. **Ausnahme bearbeiten:** Playbook, Aufgaben und Eskalationsentscheidung zeigen.
5. **Was-wäre-wenn:** Anreisedatum verschieben und Folgeabhängigkeiten vergleichen.
6. **Human Gate:** ausgewählte Änderung oder Entscheidung mit Begründung übernehmen.
7. **Arbeitsprodukt:** Arrival Readiness Brief aus geprüften Quellen erzeugen und bearbeiten.
8. **Evaluation und Grenze:** lokale Baseline, Audit, keine Außenwirkung und geparktes Gate 02 erklären.

## 16. Exit-Gate vor externer KI

Gate 02 darf erst erneut zur Entscheidung vorgelegt werden, wenn alle folgenden Bedingungen erfüllt sind:

- Release D, E und F sind lokal implementiert und QA-geprüft;
- die sechs Kernjourneys funktionieren auf demselben kanonischen Fallmodell;
- mindestens 24 Evaluationsszenarien bilden die deterministische Baseline;
- jede gewünschte KI-Aufgabe ist als begrenzte Fähigkeit beschrieben;
- für jede Fähigkeit existieren Eingabeschema, Ausgabeschema, Quellenregel und Human Gate;
- der messbare Mehrwert gegenüber der Baseline ist festgelegt;
- verbotene Aktionen und Abbruchbedingungen sind automatisiert testbar;
- die lokale Engine bleibt als Fallback verfügbar;
- Founder hat die Produktwirkung und den konkreten AI-Gap abgenommen;
- Datenschutz-, DPA-/AVV-, Retention-, Region-, Security-, Kosten- und Vertragsentscheidungen werden separat neu bestätigt.

### Zulässige spätere AI-Kandidaten

- mehrere strukturierte Evidenzeinträge knapp zusammenfassen;
- Widersprüche als Prüfhinweis formulieren;
- aus geprüften Daten einen bearbeitbaren Arbeitsproduktentwurf erstellen;
- eine natürlichsprachliche Fallfrage auf vorhandene, zitierte Daten beantworten;
- komplexe Simulationsdeltas verständlich erklären.

### Nicht zulässige AI-Aufgaben

- Personen bewerten, auswählen, ranken oder priorisieren;
- Beschäftigungs-, Zugangs-, Wohn- oder Leistungsentscheidungen treffen;
- Evidenz erfinden oder fehlende Daten als sicher darstellen;
- selbstständig Fallzustände verändern;
- Nachricht, Buchung, Zahlung, Freigabe oder externe Integration auslösen;
- eine statistische Prognose ohne validierte Datenbasis ausgeben.

## 17. Erfolgsmessung von Gate 01.5

Gate 01.5 gilt nicht durch Funktionsanzahl als erfolgreich. Es gilt als erfolgreich, wenn:

- ein Nutzer die Ursache einer Blockade und die nächste sichere Handlung ohne Moderator versteht;
- ein Status vollständig auf Evidenz, Regel oder menschliche Entscheidung zurückgeführt werden kann;
- eine Änderung ihre fachlichen Folgen zeigt, bevor sie übernommen wird;
- die wichtigsten Arbeitsprodukte aus dem Systemzustand entstehen und prüfbar bleiben;
- eine andere Person denselben synthetischen Fall reproduzierbar bearbeiten kann;
- die Evaluation echte Lücken einer lokalen Baseline sichtbar macht;
- anschließend klar ist, ob und wofür externe KI überhaupt einen zusätzlichen Nutzen bringt.

## 18. Hauptrisiken und Gegenmaßnahmen

| Risiko | Gegenmaßnahme |
|---|---|
| erneute unübersichtliche Modulwand | eine Fallarbeitsfläche, Progressive Disclosure, sechs feste Journeys |
| Fachlogik verteilt sich in UI-Code | Domain Services und versionierte Regeln |
| „KI“ wird nur sprachlich inszeniert | lokale Baseline, Evaluation und sichtbare Quellen |
| Simulation und Originalzustand vermischen sich | Snapshot, Delta, granulare Human-Gate-Übernahme |
| unstrukturierter Scope wächst | sechs Arbeitspakete, Exit-Kriterien, Non-Goals |
| synthetische Daten wirken real | globale Kennzeichnung plus Entitätsflag und QA-Test |
| Cross-Tenant-Leak | serverseitiger Kontext und Negativtest je Entität |
| externe Wirkung wird versehentlich aktiviert | zentraler No-Effect Guard und ausschließlich `sink_only`-Adapter |
| spätere Providerbindung | providerneutrale Capability-Schnittstelle und lokale Fallback-Engine |
| Produktdemo wird mit Produktionsreife verwechselt | Reifegrad- und Gate-Hinweise in UI, Dokumentation und Präsentation |

## 19. Entscheidungsstand

- **Gate 01.5:** geplant, noch nicht zur Implementierung geöffnet.
- **Nächste operative Entscheidung:** ausdrückliche Founder-Freigabe zur Umsetzung von Release D–F auf einer neuen datierten Arbeitskopie.
- **Gate 02 / externer AI Provider:** bewusst geparkt; keine Aktivierung, kein Konto, keine Kosten.
- **Produktive Architektur:** weiterhin separat und ungeöffnet.
- **Externe Validierung, Hosting und Veröffentlichung:** weiterhin separat freigabepflichtig.

## 20. Empfohlene Freigabeformel

> Freigegeben ist die lokale Umsetzung von Productization Gate 01.5 mit Release D bis F auf einer neuen datierten ACC-Arbeitskopie. Verwendet werden ausschließlich synthetische Daten, deterministische lokale Fachlogik und wirkungslose Ausgänge. Externe KI, Providerkonto, Kosten, reale Daten, produktive Authentifizierung, Integrationen, Versand, Buchung, automatisierte Personenentscheidungen, Hosting, Deployment und Veröffentlichung bleiben ausgeschlossen.
