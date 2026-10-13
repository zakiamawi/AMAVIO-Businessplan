# AMAVIO One CRM – R3.4 AI Experience & Governance Contract

**Stand:** 10.10.2026  
**Aktiver Modus:** `r3.4-local-rule-simulation-v1`

## Wahrheitsgrenze

R3.4 enthält keine externe KI, kein Sprachmodell, keinen API-Aufruf und keine Übertragung von CRM-Daten. `Founder Focus`, Entscheidungsreife, Empfehlung und Decision Brief werden deterministisch aus dem lokalen synthetischen Zustand abgeleitet. Die Oberfläche kennzeichnet dies als `Lokale regelbasierte Assistenzsimulation · keine externe KI`.

## Verbindliche Eigenschaften

- `externalModel: false`
- `externalDataTransfer: false`
- `humanApprovalRequired: true`
- `autonomousWrites: false`

Die Assistenz darf keine Datensätze autonom ändern, keine Nachricht versenden, keine Termine anlegen, keine Chance verschieben und keine Freigabe auslösen. Jede Handlung bleibt eine menschliche Navigation in vorhandene Detail- und Formularpfade.

## Erklärbarkeit

Jede Empfehlung muss auf sichtbaren Faktoren beruhen: Fälligkeit, Inaktivität, Priorität, Phase, Angebotsgültigkeit oder fehlende Entscheiderrolle. Der Decision Brief trennt bestätigten Inhalt, Annahme, offene Frage und Empfehlung. Ein Potenzialwert wird ausdrücklich als lokaler Planungswert und nicht als Beauftragung gekennzeichnet.

## Fehler- und Unsicherheitslogik

Fehlen Daten, wird keine Wahrscheinlichkeit ergänzt. Stattdessen erscheinen offene Frage, fehlende Dimension oder ein neutraler Zustand. `Entscheidungsreife` beschreibt Daten- und Vorbereitungsvollständigkeit, nicht die Erfolgswahrscheinlichkeit eines Deals.

## Späteres Produktivgate

Produktive KI benötigt einen neuen Product-Owner-Beschluss, Zweck- und Datenminimierung, Anbieter- und Kostenprüfung, Rechts-/Privacy- und Security-Freigabe, Prompt-/Output-Governance, Evaluationsdatensatz, Human Gate, Audit, Kill-Switch und belastbare Negativtests. R3.4 bereitet nur die UX-Verträge vor und aktiviert nichts davon.
