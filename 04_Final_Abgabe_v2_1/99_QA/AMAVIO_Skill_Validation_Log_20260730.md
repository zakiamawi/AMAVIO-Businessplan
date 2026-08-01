# AMAVIO Skill Validation Log

Stand: 2026-07-30

## Zweck

Dieses Log dokumentiert, ob Skills nicht nur beschrieben, sondern praktisch nutzbar sind. Jeder Skill soll durch Strukturpruefung, Testlauf oder realen Einsatz validiert werden, bevor er als verlaesslicher Standard gilt.

## Validierungsformat

| Datum | Skill | Test/Einsatz | Ergebnis | Grenzen | Entscheidung |
| --- | --- | --- | --- | --- | --- |
| 2026-07-30 | `$agent-loop-system` | Strukturpruefung: SKILL.md, Referenzdatei, Trigger, Executor-Workflow | bestanden | offizieller Validator konnte wegen fehlendem Python-yaml nicht laufen | vorlaeufig aktiv; Praxisvalidierung bei naechster grossen Aufgabe |

## Offene Validierungen

| Skill/Kandidat | Erforderlicher Test | Prioritaet |
| --- | --- | --- |
| `$agent-loop-system` | realer Einsatz mit Planner -> Executor Subagent -> Reviewer -> Finalizer | hoch |
| Businessplan-QA-Skill | Pilot an 3-5 Businessplan-Seiten mit klarer Findings-Struktur | mittel |
| Finanzmodell-QA-Skill | Versions-/Annahmen-/Deck-Konsistenzcheck gegen vorhandene Artefakte | mittel |
| Website-Premium-QA-Skill | Build/Lint/Responsive/Design-Review nach Website-Premium-Patch | hoch |
