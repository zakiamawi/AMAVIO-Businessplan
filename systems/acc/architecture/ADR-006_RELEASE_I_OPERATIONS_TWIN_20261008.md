# ADR-006 – Release I Arrival Operations Twin

**Datum:** 08.10.2026  
**Status:** umgesetzt · lokale Founder-Evaluationsfassung · keine Produktionsfreigabe

## Entscheidung

AMAVIO erweitert die bisher fallbezogene Arbeitsoberfläche um einen kohortenweiten Operations Twin. Der Twin ist kein digitales Abbild realer Personen, sondern ein lokales synthetisches Arbeitsmodell aus Ereignissen, Fällen, Meilensteinen, Rollenübergaben, Arbeitsplänen und menschlichen Entscheidungen.

Die führende Arbeitskette lautet:

`Ereignis → Wirkung auf Fälle → kritischer Pfad → Rollenübergabe → Arbeitsplan → Human Gate`

## Warum dieser Schritt

Release G und H haben Falltiefe und Rollentrennung geschaffen. Der nächste Produktwert entsteht nicht durch weitere nebeneinanderliegende Module, sondern durch eine Ebene, die mehrere Fälle gemeinsam priorisiert und die operative Konsequenz eines Ereignisses nachvollziehbar macht.

## Architektur

- `twin_cohorts`: synthetische Kohorten und geplante Anreisen;
- `twin_events`: priorisierte Ereignisse mit Fall- und Belegreferenzen;
- `twin_work_plans`: reproduzierbare Arbeitspläne mit Version und Human Gate;
- `twin_simulations`: isolierte Varianten mit explizitem `originalMutated: false`;
- sieben `/api/twin/v1/`-Routen unter bestehender Session-, Tenant-, Idempotenz- und Audit-Schicht;
- Operations-only-Policy im zentralen Rollenvertrag.

## Nicht entschieden

- keine produktive Identity oder Mandantentrennung;
- keine realen Personen-, Arbeitgeber-, Objekt- oder Partnerdaten;
- keine produktive Automation oder Entscheidung;
- keine externe KI und keine Providerkosten;
- keine Nachricht, Buchung, Integration, Veröffentlichung oder Deployment.

## Folgen

Der Founder kann erstmals eine kohortenweite operative Leitstelle bewerten. Die lokale Engine bleibt Baseline und Fallback für einen späteren providerunabhängigen AMAVIO Intelligence Kernel. Eine Live-Provider-Entscheidung wird dadurch weder benötigt noch vorweggenommen.
