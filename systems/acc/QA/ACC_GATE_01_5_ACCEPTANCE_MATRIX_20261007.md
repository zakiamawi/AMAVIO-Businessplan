# ACC Gate 01.5 – Acceptance Matrix

**Stand:** 07.10.2026  
**Status:** weiterhin verbindliche Gesamtmatrix; der am 07.10.2026 implementierte Founder-Evaluationsschnitt und seine verbleibenden Lücken sind in `ACC_PRODUCTIZATION_GATE_01_5_QA_20261007.md` nachgewiesen  
**Geltung:** Releases D–F, lokal und ausschließlich synthetisch

## Bewertungslogik

- `MUSS`: ohne Erfüllung kein Release-Abschluss;
- `SOLL`: Abweichung erfordert dokumentierte Founder-Entscheidung;
- `NICHT ZULÄSSIG`: Auftreten blockiert Gate 01.5 unabhängig von anderen Ergebnissen.

## A. Produkt- und Fachabnahme

| ID | Priorität | Kriterium | Prüfnachweis | Release |
|---|---|---|---|---|
| PROD-01 | MUSS | Alle sechs Kernjourneys arbeiten auf demselben kanonischen Fallzustand. | Browser-Journey + Datenbankprüfung | D–F |
| PROD-02 | MUSS | Portfolio enthält mindestens acht klar synthetische Fälle in zwei technisch getrennten Mandanten. | Fixture-Inventar + UI + API | D |
| PROD-03 | MUSS | Jeder Fall zeigt Phase, Zustand, kritische Abhängigkeit, nächste Verantwortung und Frist. | UI- und Contract-Test | D |
| PROD-04 | MUSS | Readiness ist regelbasiert erklärbar und kein Prognosewert. | Domain-Test + UI-Erklärung | D |
| PROD-05 | MUSS | Evidenz besitzt Quelle, Gültigkeit, Prüfstatus und fachliche Referenzen. | Schema- und Journey-Test | D/F |
| PROD-06 | MUSS | Widersprüchliche Evidenz blockiert unbelegte Statusfreigaben. | Szenario J3 | D |
| PROD-07 | MUSS | Entscheidungen speichern Optionen, Folgen, Begründung, Rolle und Zeitpunkt. | API-, DB- und Audit-Test | D |
| PROD-08 | MUSS | Zehn lokale Fachregeln sind versioniert und menschenlesbar. | Regelinventar | E |
| PROD-09 | MUSS | Mindestens sechs Ausnahmeszenarien sind Ende-zu-Ende bearbeitbar. | Evaluationssuite | E |
| PROD-10 | MUSS | Simulation zeigt Vorher/Nachher und verändert den Originalfall nicht. | Snapshot- und DB-Test | E |
| PROD-11 | MUSS | Simulationsübernahme ist granular und human-gated. | Browser- und API-Test | E |
| PROD-12 | MUSS | Sieben Arbeitsprodukttypen werden aus strukturierten Falldaten erzeugt. | Work-Product-Suite | F |
| PROD-13 | MUSS | Jede Arbeitsproduktaussage referenziert Evidenz, Regel oder Entscheidung. | Provenienztest | F |
| PROD-14 | MUSS | 24 kanonische Evaluationsszenarien sind reproduzierbar. | Evaluationsreport | F |
| PROD-15 | SOLL | Ein neuer Nutzer versteht Blockade und nächste Handlung ohne Moderation. | moderierter Usability-Test mit synthetischem Scope | F |

## B. Daten, Mandanten und Sicherheit

| ID | Priorität | Kriterium | Prüfnachweis | Release |
|---|---|---|---|---|
| DATA-01 | MUSS | Jede neue operative Entität trägt serverseitig erzwungene `tenant_id`. | Schema- und Repository-Test | D–F |
| DATA-02 | MUSS | Kein schreibender Endpoint akzeptiert einen Client-Tenant als Autorität. | Negative Contract Tests | D–F |
| DATA-03 | MUSS | Cross-Tenant-Zugriff wird für jede Entität negativ getestet. | automatisierte Matrix | D–F |
| DATA-04 | MUSS | Alle Fixtures tragen `synthetic = 1` und sichtbare Demo-Kennzeichnung. | DB- und UI-Test | D–F |
| DATA-05 | MUSS | Migration von Gate 01 auf 1.5 ist reproduzierbar und erhält Bestandsdaten. | Migrationstest | D |
| DATA-06 | MUSS | Ungültige Zustandsübergänge werden serverseitig abgelehnt. | Domain-/API-Test | D |
| DATA-07 | MUSS | Versionskonflikte verhindern stilles Überschreiben. | Concurrency-Test | D |
| DATA-08 | MUSS | Audit-Ereignisse sind append-only und tenantgebunden. | DB- und Manipulationstest | D–F |
| DATA-09 | NICHT ZULÄSSIG | reale oder rückführbare Personen-, Arbeitgeber-, Objekt- oder Partnerdaten | Fixture- und Content-Scan | D–F |
| DATA-10 | NICHT ZULÄSSIG | Secret, Token, API-Key oder Auth-Artefakt im Projekt oder Browser | Static Scan + Network Audit | D–F |

## C. Human Gate und Wirkungssperre

| ID | Priorität | Kriterium | Prüfnachweis | Release |
|---|---|---|---|---|
| SAFE-01 | MUSS | Statuswechsel mit fachlicher Wirkung benötigt erlaubten Übergang und gegebenenfalls Human Gate. | State-Machine-Test | D–F |
| SAFE-02 | MUSS | Entscheidung erfordert konkrete Prüfnotiz. | API- und UI-Test | D–F |
| SAFE-03 | MUSS | Simulation kann vor menschlicher Übernahme nichts am Originalfall ändern. | Isolationstest | E |
| SAFE-04 | MUSS | Nachricht, Buchung und Export bleiben lokale Vorschau mit `sink_only`. | API-, DB- und UI-Test | D–F |
| SAFE-05 | MUSS | Verbotene Aktionen sind als zentraler Guard implementiert. | Negative Action Tests | D–F |
| SAFE-06 | NICHT ZULÄSSIG | Nachricht, Buchung, Zahlung, Upload oder externe Freigabe wird real ausgelöst. | Network- und Side-Effect-Test | D–F |
| SAFE-07 | NICHT ZULÄSSIG | automatische Bewertung, Auswahl, Priorisierung oder Profilierung einer Person | Domain- und Content-Review | D–F |
| SAFE-08 | NICHT ZULÄSSIG | unbelegte Prognose oder Wahrscheinlichkeit wird als echt dargestellt | Content- und Schema-Test | D–F |

## D. Lokale Intelligenz und Erklärbarkeit

| ID | Priorität | Kriterium | Prüfnachweis | Release |
|---|---|---|---|---|
| INT-01 | MUSS | Gleiche Eingaben und Regelversionen liefern dasselbe Ergebnis. | deterministischer Wiederholungstest | E/F |
| INT-02 | MUSS | Jede Empfehlung nennt verwendete Regeln und Evidenz. | Explainability-Test | E/F |
| INT-03 | MUSS | Fehlende oder unsichere Information ist explizit sichtbar. | Journey- und Snapshot-Test | D–F |
| INT-04 | MUSS | Kritischer Pfad wird aus gerichteten Abhängigkeiten berechnet. | Graph-Test | E |
| INT-05 | MUSS | Zyklen oder ungültige Abhängigkeiten werden erkannt und blockiert. | Graph-Negativtest | E |
| INT-06 | MUSS | Lokale Baseline ist versioniert und bleibt späterer Fallback. | Engine- und Versionstest | F |
| INT-07 | NICHT ZULÄSSIG | externer AI-/LLM-Netzwerkaufruf | Network Audit | D–F |

## E. API, Persistenz und Fehlermodi

| ID | Priorität | Kriterium | Prüfnachweis | Release |
|---|---|---|---|---|
| API-01 | MUSS | API `v1.5` besitzt dokumentierte Eingabe-, Ausgabe- und Fehlerverträge. | Contract-Datei + Tests | D |
| API-02 | MUSS | Alle Mutationen validieren Typ, Länge, Enum und Fallversion. | Fuzz-/Grenzfalltests | D–F |
| API-03 | MUSS | Neustart erhält Fälle, Aufgaben, Evidenz, Entscheidungen, Simulationen und Arbeitsprodukte. | Restart-Test | D–F |
| API-04 | MUSS | unbekannte IDs und fremde Mandanten geben keine sensiblen Details preis. | 404/403-Negativmatrix | D–F |
| API-05 | MUSS | wiederholte identische Requests erzeugen keine unbeabsichtigten Duplikate. | Idempotenztest | D–F |
| API-06 | MUSS | Fehlerzustände sind lokal verständlich und beschädigen keinen Fallzustand. | Failure Injection | D–F |

## F. UX, Accessibility und Responsive

| ID | Priorität | Kriterium | Prüfnachweis | Release |
|---|---|---|---|---|
| UX-01 | MUSS | Überblick, Fallarbeit und Details folgen Progressive Disclosure. | Visual Review | D–F |
| UX-02 | MUSS | Keine Rückkehr zur gleichgewichteten Karten-/Modulwand. | Founder Design Review | D–F |
| UX-03 | MUSS | Sechs Kernjourneys sind vollständig per Tastatur bedienbar. | Keyboard Matrix | D–F |
| UX-04 | MUSS | Fokus, Live-Regionen, Labels und Überschriften sind korrekt. | Accessibility Audit | D–F |
| UX-05 | MUSS | Status wird nie nur durch Farbe vermittelt. | Visual/A11y Test | D–F |
| UX-06 | MUSS | Kein horizontaler Überlauf in vereinbarten Desktop-, Tablet- und Mobile-Viewports. | Browsermatrix | D–F |
| UX-07 | MUSS | Lade-, Leer-, Fehler-, Konflikt- und Offlinezustände sind entworfen. | State Gallery + Browser-Test | D–F |
| UX-08 | MUSS | `prefers-reduced-motion` wird respektiert. | Browser-Test | D–F |
| UX-09 | SOLL | 6–8-Minuten-Founder-Journey ist ohne technische Erklärung verständlich. | Founder-Abnahme | F |

## G. Arbeitsprodukte und Evaluation

| ID | Priorität | Kriterium | Prüfnachweis | Release |
|---|---|---|---|---|
| EVAL-01 | MUSS | 24 Szenarien decken Standard, Evidenz, Ausnahme, Human Gate und Isolation ab. | Szenarioinventar | F |
| EVAL-02 | MUSS | Rubrik misst Korrektheit, Vollständigkeit, Evidenztreue, Sicherheit und Reproduzierbarkeit. | Evaluation Report | F |
| EVAL-03 | MUSS | 100 % der Ausgaben erfüllen das vereinbarte Schema. | automatisierter Lauf | F |
| EVAL-04 | MUSS | 0 verbotene Aktionen und 0 Cross-Tenant-Funde. | automatisierter Lauf | F |
| EVAL-05 | MUSS | Fehler werden pro Fähigkeit statt nur als Gesamtscore ausgewiesen. | Evaluation Report | F |
| EVAL-06 | MUSS | Baseline-Resultate sind mit Engine-, Regel- und Fixture-Version gespeichert. | Ergebnisartefakt | F |
| EVAL-07 | MUSS | Eine Gap-Liste benennt präzise, wo lokale Logik nicht genügt. | Founder Review | F |

## H. Gate-02-Readiness

| ID | Priorität | Kriterium | Prüfnachweis |
|---|---|---|---|
| AI-READY-01 | MUSS | Jede mögliche AI-Fähigkeit besitzt einen begrenzten Arbeitsauftrag. | Capability Register |
| AI-READY-02 | MUSS | Ein- und Ausgabeschema sowie Quellenregel sind festgelegt. | Contract Review |
| AI-READY-03 | MUSS | Messbarer Mehrwert gegenüber der lokalen Baseline ist definiert. | Evaluation Design |
| AI-READY-04 | MUSS | deterministischer Fallback und Human Gate bleiben erhalten. | Architekturtest |
| AI-READY-05 | MUSS | verbotene Aktionen und Abbruchbedingungen sind testbar. | Safety Suite |
| AI-READY-06 | MUSS | Founder hat Produktwirkung und konkreten AI-Gap abgenommen. | Abnahmeprotokoll |
| AI-READY-07 | MUSS | Datenschutz, Region, Retention, DPA/AVV, Security, Vertrag und Kosten werden separat freigegeben. | eigene Gate-02-Entscheidung |

## Release-Freigaben

### Release D

Freigabe nur, wenn alle für D markierten `MUSS`-Kriterien erfüllt sind und kein `NICHT ZULÄSSIG` auftritt.

### Release E

Freigabe nur auf abgeschlossenem Release D sowie erfüllter Simulationsisolation, Regelspur und Wirkungssperre.

### Release F / Abschluss Gate 01.5

Freigabe nur auf abgeschlossenem Release D und E, vollständiger Evaluationssuite und dokumentierter Founder-Abnahme. Dieser Abschluss öffnet Gate 02 nicht automatisch, sondern schafft nur eine sachliche Entscheidungsgrundlage.
