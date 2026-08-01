# AMAVIO Cross-Task Coordination Protocol

Stand: 2026-07-30

## Zweck

Dieses Protokoll stellt sicher, dass die AMAVIO-Tasks nicht isoliert arbeiten. Der geplante AMAVIO-Task und der Task `AMAVIO ENGINEER` sollen denselben Projektstand nutzen, Fortschritte gegenseitig sichtbar machen und relevante Ergebnisse dauerhaft in Projektdateien dokumentieren.

## Beteiligte Tasks

- Geplante AMAVIO-Aufgabe einrichten
- AMAVIO ENGINEER

## Grundregeln

1. Projektgedaechtnis liegt in Dateien, nicht nur im Chat.
2. Jeder Task prueft bei groesseren Schritten den aktuellen Projektstand und vorhandene QA-Artefakte.
3. Relevante Ergebnisse werden so dokumentiert, dass der andere Task sie ohne Chat-Kontext lesen kann.
4. Finale DOCX/PDF/PPTX/XLSX-Dateien werden nur mit Backup geaendert.
5. Keine parallelen blinden Aenderungen an denselben finalen Artefakten.

## Gemeinsame Arbeitsartefakte

Die Tasks sollen bevorzugt diese Artefakte pflegen oder auswerten:

- Statuslog
- Master-Todo
- Decision Log
- Research Notes
- Skill Register
- Skill Validation Log
- Businessplan QA-Checkliste
- Finanzmodell QA-Checkliste
- Website QA-Checkliste
- Pitchdeck/One-Pager QA-Checkliste
- Abgabe-Readiness-Checkliste

## ECC- und Agent-Loop-Nutzung

Wenn ECC in einem Task sichtbar ist, soll es fuer strukturierte Arbeit genutzt werden:

- `explorer`: Projekt- und Dateianalyse ohne Aenderungen
- `docs-researcher`: gezielte Recherche und Quellenpruefung
- `reviewer`: QA, Risiken, Regressionen, Abgabereife

Fuer groessere Aufgaben soll der globale Skill `$agent-loop-system` genutzt werden:

1. Planner
2. Executor Subagent
3. Reviewer
4. Executor Fix Pass
5. Finalizer

Wenn ECC oder Subagents nicht sichtbar sind, soll derselbe Ablauf manuell emuliert werden.

## Skill-Recherche Und Skill-Entwicklung

Die Tasks sollen laufend pruefen, welche vorhandenen oder neu zu entwickelnden Skills AMAVIO messbar besser, schneller oder guenstiger machen.

Skill-Arbeit ist nur sinnvoll, wenn die Funktion dahinter belastbar ist. Jeder vorgeschlagene oder entwickelte Skill soll deshalb mindestens diese Kriterien erfuellen:

- klarer Zweck fuer AMAVIO oder zukuenftige Projekte
- eindeutige Trigger, wann der Skill genutzt werden soll
- konkreter Workflow statt allgemeiner Ideensammlung
- definierte Inputs und Outputs
- Validierung durch Testlauf, Strukturpruefung oder realen Einsatz
- dokumentierter Nutzen und bekannte Grenzen

Vorhandene Skills sollen bevorzugt genutzt werden, wenn sie den Zweck abdecken. Neue Skills sollen nur entwickelt werden, wenn wiederkehrende Arbeit dadurch verlaesslicher, guenstiger oder weniger fehleranfaellig wird.

Morgen- und Abendlaeufe sollen jeweils kurz pruefen:

- Welche vorhandenen Skills helfen beim aktuellen AMAVIO-Schritt?
- Gibt es eine wiederkehrende Aufgabe, fuer die ein neuer Skill sinnvoll waere?
- Wurde ein Skill seit dem letzten Lauf genutzt, getestet oder verbessert?
- Muss ein Skill in das Skill Register oder Skill Validation Log aufgenommen werden?

Der Task `AMAVIO ENGINEER` soll im Laufe operativer Arbeit dieselben Regeln anwenden und nutzbare Skills dokumentieren, damit die geplanten Laeufe sie spaeter gezielt einsetzen koennen.

## Morgenlauf

Der Morgenlauf soll:

- den aktuellen Stand aus QA-Artefakten und, soweit moeglich, aus `AMAVIO ENGINEER` beruecksichtigen
- die wichtigsten Prioritaeten fuer den Tag festlegen
- den Master-Todo und offene Checklisten aktualisieren oder konkrete Aktualisierungen vorschlagen
- nuetzliche vorhandene Skills oder sinnvolle neue Skill-Kandidaten identifizieren
- relevante Erkenntnisse fuer `AMAVIO ENGINEER` knapp zusammenfassen

## Abendlauf

Der Abendlauf soll:

- sichtbaren Fortschritt und geaenderte Artefakte pruefen
- offene Risiken und naechste Schritte fuer den Folgetag dokumentieren
- genutzte, getestete oder neu entwickelte Skills im Skill Register/Validation Log erfassen
- relevante Ergebnisse so ablegen, dass `AMAVIO ENGINEER` sie aufnehmen kann
- bei wichtigen Fortschritten oder Abstimmungsbedarf eine kurze Koordinationsnotiz fuer `AMAVIO ENGINEER` vorbereiten

## Mindestformat Fuer Statusupdates

Jedes koordinationsrelevante Update soll enthalten:

- Datum/Uhrzeit
- Quelle/Task
- Gepruefte Artefakte
- Ergebnis
- Naechster Schritt
- Risiken oder Blocker
- Dateien, die geaendert wurden

## Ziel

Beide Tasks sollen auf demselben Stand bleiben, ohne unkontrolliert parallel zu arbeiten. Der geplante Task erzeugt Rhythmus und QA-Druck. `AMAVIO ENGINEER` treibt operative Umsetzung, Website, Businessplan, Decks und technische Arbeit voran.
