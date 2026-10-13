# ADR-007 – Release J Operational Learning & Evaluation Loop

**Stand:** 08.10.2026  
**Status:** umgesetzt und lokal QA-grün  
**Entscheidung:** AMAVIO lernt zuerst aus strukturierten operativen Beobachtungen und reproduzierbaren lokalen Evaluationen. Externe Modelle bleiben austauschbare, deaktivierte Adapter.

## Kontext

Release G verbindet die operative Fallreise, Kernel V2 liefert drei vertikale Fachfähigkeiten, Release H trennt die Rollen und Release I steuert Ereignisse kohortenweit. Bisher fehlte die geschlossene Rückkopplung zwischen Operator-Beobachtung, tatsächlichem Outcome, Qualitätsmessung, Policy-/Capability-Version und menschlicher Entscheidung.

Eine direkte Providerintegration wäre für diesen Reifegrad fachlich verfrüht. Sie würde Kosten und Bindung erzeugen, ohne dass AMAVIO bereits über eine belastbare eigene Evaluationsbasis verfügt.

## Entscheidung

Release J ergänzt eine eigene, operationsinterne Lernschleife:

`Feedback erfassen → Outcome zuordnen → Qualität bewerten → Version vergleichen → Entscheidung dokumentieren`

Die Schleife arbeitet mit vier verbindlichen Verträgen:

1. Operator-Feedback wird strukturiert, tenantgebunden, versioniert und evidenzreferenziert gespeichert.
2. Baseline und Kandidat werden unter demselben 24-teiligen synthetischen Fixture Set verglichen.
3. Policy Set, Capability, lokale Engine und Provideradapter besitzen getrennte Versions- und Statuslinien.
4. Eine fachliche Kandidatenprüfung ist advisory-only. Sie aktiviert keine Version und erzeugt keine Außenwirkung.

## Messmodell

Die reproduzierbare Qualitätsmatrix enthält Evidenztreue, Handlungsfähigkeit, Policy-Konformität, Reproduzierbarkeit und Korrekturaufwand. Die Metrik `Korrekturaufwand` wird richtungsrichtig ausgewertet: ein geringerer Wert ist besser. Ergänzend werden erwartete und tatsächliche Outcomes, Match-Status, Operator-Korrekturen und Policy-Diffs verglichen.

Jeder Lauf erhält SHA-256-Fingerprints für Eingabebasis, Baseline, Kandidat und Gesamtergebnis. Gleiche Versionen und Fixtures führen zu gleichen Scores und gleichen Fingerprints.

## Providergrenze

`provider-neutral-v1` ist registriert, aber deaktiviert. Release J führt keine Provideranfrage aus, lädt keine Credentials, erzeugt kein Kostenereignis und zeigt keine Provider-Scores. Ein späterer Adapter muss denselben Evaluationsvertrag erfüllen und kann gegen die lokale AMAVIO-Baseline verglichen werden, ohne UI oder Fachdomäne neu zu bauen.

## Folgen

- AMAVIO besitzt vor einem Providerentscheid eine eigene messbare Qualitätsbasis.
- Operatives Lernen bleibt nachvollziehbar und ist nicht mit Modelltraining gleichzusetzen.
- Menschliche Reviewentscheidungen werden dokumentiert, aber nie automatisch umgesetzt.
- Arbeitgeberrollen erhalten weder Lernoberfläche noch Lernendpunkte.
- Produktive Identity, reale Daten, externe KI, Hosting, Integrationen und Deployment bleiben separate Gates.

## Verworfene Alternativen

- **Sofortiger Live-Provider-Vergleich:** verworfen, weil Kosten, Datenschutz- und Vertragsbindung ohne belastbaren lokalen Benchmark entstehen würden.
- **Freitextfeedback ohne Outcome-Vertrag:** verworfen, weil daraus keine reproduzierbare Produktverbesserung ableitbar ist.
- **Automatische Aktivierung des besten Kandidaten:** verworfen, weil sie Human Gate, Nachvollziehbarkeit und sichere Produktgrenzen verletzt.

