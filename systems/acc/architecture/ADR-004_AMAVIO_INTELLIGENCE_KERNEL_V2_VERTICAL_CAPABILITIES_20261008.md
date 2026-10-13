# ADR-004: Vertikale Kernel-Fähigkeiten als lokale Fachartefakte

**Status:** Akzeptiert für die lokale synthetische Founder-Evaluationsfassung  
**Datum:** 08.10.2026  
**Decider:** Founder/Product Owner für den lokalen Release; produktive Entscheidungen bleiben offen

## Kontext

Kernel V1 stellt Graph, Policies, Capabilities, Providergrenze, Evaluation und Human Gate bereit. Für echte Produkttiefe fehlten jedoch drei geschlossene Arbeitsabläufe: Quellenkonflikte fachlich auflösen, einen kritischen Pfad nach einem Ereignis neu planen und daraus einen reproduzierbaren internen Bereitschaftsbrief erstellen.

## Entscheidung

Die drei Fähigkeiten werden als deterministische, providerunabhängige Kernel-V2-Module umgesetzt. Jede Ausführung erzeugt ein persistiertes `kernel_artifact` mit Case-/Tenant-Bindung, Basisversion, Graph-Fingerprint, Input-Hash, Qualitätsdaten und Human-Gate-Vertrag. Kein Artefakt darf automatisch Fallzustände oder externe Systeme verändern.

## Erwogene Optionen

| Option | Komplexität | Kosten | Nachvollziehbarkeit | Entscheidung |
|---|---:|---:|---:|---|
| Externer LLM-Workflow | mittel | variabel | providerabhängig | verworfen für V2 |
| Sichtbare KI-Module je Capability | mittel | 0 EUR lokal | fachlich sichtbar, UI-dominant | verworfen |
| Lokale Fachmodule innerhalb der Fallreise | mittel | 0 EUR | hoch, deterministisch | gewählt |

## Konsequenzen

- Die operative Journey erhält mehr Produkttiefe, ohne eine neue Navigationsebene.
- Gleiche Inputs liefern das gleiche Artefakt zurück; parallele Reviews bleiben exklusiv.
- Ein Brief kann erst nach geprüfter Reconciliation, geprüftem Replan, Simulation und dokumentierter menschlicher Entscheidung entstehen.
- Ein späterer Provider kann ausschließlich innerhalb eines versionierten Capability-Vertrags ergänzen; er ersetzt weder Policies noch Human Gates.
- Produktive Daten, Identity, Hosting, Connectoren, Providerkonten und Außenwirkungen bleiben ungeöffnet.

## Nächste Entscheidung

Founder-Abnahme von Nutzen, Fachsprache und Informationsdichte. Erst danach: Versionierungsstrategie für reale Evaluationskorpora und ein separat freigegebener Provider-Sandbox-Test.
