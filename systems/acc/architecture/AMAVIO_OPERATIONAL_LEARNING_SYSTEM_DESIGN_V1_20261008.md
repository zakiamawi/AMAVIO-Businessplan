# AMAVIO Operational Learning – Systemdesign V1

**Stand:** 08.10.2026  
**Scope:** lokale synthetische Founder-Evaluationsfassung

## Produktziel

Release J macht aus operativer Fallarbeit eine kontrollierte Lernschleife. Das System sammelt keine beliebigen Nutzersignale, sondern verknüpft eine fachliche Beobachtung mit erwartetem und tatsächlichem Outcome, Belegreferenzen, Korrekturtyp, betroffener Version und dokumentierter Entscheidung.

## Domänenmodell

| Entität | Zweck | Zentrale Grenzen |
|---|---|---|
| `learning_feedback` | strukturierte Operator-Beobachtung und Outcome | tenantgebunden, synthetisch, optimistische Version |
| `learning_evaluations` | unveränderlicher 24-Fixture-Lauf | lokaler Baseline-/Kandidatenvergleich, Fingerprint |
| `learning_comparisons` | interpretierbarer Qualitäts-, Outcome- und Policy-Vergleich | Human-Gate-Status, keine Aktivierung |
| `learning_versions` | Lineage für Policy, Capability, Engine und Adapter | Status getrennt von Aktivierung |

## Komponenten

### Feedback Contract

Pflichtfelder sind Titel, Beobachtung und erwartetes Outcome. Das tatsächliche Outcome darf zunächst fehlen; der Eintrag bleibt dann sichtbar als `outcome_missing`. Belegreferenzen, Korrekturtyp und Operator-Notiz machen die spätere Bewertung prüfbar. Parallele Aktualisierungen werden per Versionskonflikt geschlossen.

### Outcome Comparison

Der Vergleich stellt Erwartung und Ergebnis nicht nur als Score gegenüber. Er zeigt außerdem Baseline-/Kandidaten-Match und die Zahl manueller Operator-Korrekturen. Dadurch kann ein fachlich gleichwertiger Kandidat bevorzugt werden, wenn er weniger Nacharbeit erzeugt.

### Evaluation Harness

Das Fixture Set `acc-learning-fixtures-v1` enthält 24 synthetische Szenarien. Bewertet werden fünf Dimensionen. Jede Dimension definiert ihre Optimierungsrichtung. Der Lauf ist deterministisch, extern wirkungslos und erzeugt einen Reproduzierbarkeits-Fingerprint.

### Version Registry

Versioniert werden:

- `arrival-policy-v1.2` als aktives Policy Set;
- `critical-path-replan-v2.1` als zu prüfender Capability-Kandidat;
- `amavio-domain-engine-v1.5` als lokale Baseline;
- `provider-neutral-v1` als deaktivierter Adaptervertrag.

`candidate_reviewed` bedeutet ausschließlich fachlich geprüft. Es bedeutet weder aktiviert noch produktiv freigegeben.

### Human Gate

Ein Vergleich kann mit Begründung fachlich bestätigt oder zurückgestellt werden. Die Entscheidung setzt `automaticActivation=false`, `externalEffect=false` und belässt `activated=false`. Aktivierung erfordert später ein eigenes Release- und Founder-Gate.

## API

Release J ergänzt zehn Operations-only-Routen unter `/api/learning/v1/`. Alle Mutationen verlangen persistente Idempotency Keys. Session, Rolle und Tenant werden vor der Domänenverarbeitung geprüft. Arbeitgeberrollen erhalten `403 role_scope_denied`, tenantfremde Ressourcen `404`.

## Oberfläche

Die neue Navigation `Lernschleife` ist ausschließlich für AMAVIO Operations sichtbar. Die Oberfläche besteht aus einer fünfstufigen Schleife, Feedbackstrom, Qualitätsmatrix, strukturiertem Inspector, Versionslineage und fokussiertem Vergleichs-Drawer. Intelligence bleibt als Fachlogik integriert; es gibt kein sichtbares Chat-, Copilot- oder AI-Command-Center-Modul.

## Nichtfunktionale Anforderungen

- lokale SQLite-Persistenz für die Konzeptdemo;
- keine Netzwerkrequests außerhalb des lokalen Servers;
- Desktop 1440 × 1024 und Mobile 390 × 844 ohne unkontrollierten Überlauf;
- eine sichtbare H1, benannte Steuerungen, beschriftete Felder, Escape-Schließen und Reduced Motion;
- Fuzz, Concurrency, Idempotenz und Failure Injection für alle registrierten Routen;
- keine Secrets, echten Daten, Providerkosten oder Außenwirkungen.

## Späterer Providervergleich

Ein zukünftiger Adapter liefert für dasselbe Fixture Set Ergebnisse im bestehenden Vergleichsvertrag. Die Oberfläche ergänzt dann eine dritte messbare Spalte. Erst nach separater Freigabe dürfen Adapterstatus, Region, Retention, Kostenlimit und Live-Testkonfiguration geändert werden.

