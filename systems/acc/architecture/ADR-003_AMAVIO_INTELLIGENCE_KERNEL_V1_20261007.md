# ADR-003: Providerunabhängiger AMAVIO Intelligence Kernel unter der operativen Fallreise

**Status:** Accepted für lokale synthetische V1  
**Datum:** 07.10.2026  
**Decider:** Founder  
**Produktgrenze:** ACC Arbeitgeber-/AMAVIO-Oberfläche, keine Drei-Rollen-App

## Kontext

Release G verbindet Evidenz, Verantwortung, Simulation, Entscheidung und Arbeitsprodukt zu einer verständlichen operativen Fallreise. Die nächste Ausbaustufe soll eigene AMAVIO-Intelligenz schaffen, ohne die Oberfläche wieder mit sichtbaren KI-Modulen zu überladen und ohne frühzeitig Providerkosten, Lock-in oder produktive Datenverarbeitung auszulösen.

Die Schicht muss heute lokal und deterministisch funktionieren, später aber kontrolliert einen austauschbaren generativen Provider hinter denselben Verträgen verwenden können.

## Entscheidung

AMAVIO implementiert einen modularen Intelligence Kernel unterhalb der Fallreise mit sechs Bausteinen:

1. Evidence Graph;
2. Policy Engine;
3. Capability Registry;
4. Evaluation Harness;
5. Provider Adapter Boundary;
6. Human-Gate-Vertrag.

Die aktive V1 verwendet ausschließlich den lokalen deterministischen Provider. OpenAI- und Mistral-Adapter bleiben implementierte, aber geschlossene Ports. Jede Capability ist beratend, belegt, versioniert, mandantengebunden und human-gated. Auch eine menschliche Freigabe erzeugt keine Außenwirkung, sondern nur den Status `advisory_approved`.

## Optionen

### A – Sichtbares AI Command Center

| Dimension | Bewertung |
|---|---|
| Verständlichkeit | gering bis mittel; konkurriert mit Fallarbeit |
| Kosten | zunächst lokal, später providergetrieben |
| Produktwirkung | laut, aber schnell generisch |
| Wartbarkeit | parallele UI- und Fachlogik |

**Nicht gewählt:** widerspricht dem Product Design Reset und der Release-G-Fallreise.

### B – Provider direkt in einzelnen Funktionen

| Dimension | Bewertung |
|---|---|
| Time-to-demo | schnell |
| Lock-in | hoch |
| Governance | fragmentiert |
| Evaluation | schwer vergleichbar |

**Nicht gewählt:** Evidenz-, Policy-, Gate- und Providerverträge würden mehrfach und inkonsistent entstehen.

### C – Eigener providerunabhängiger Kernel

| Dimension | Bewertung |
|---|---|
| Anfangskomplexität | mittel |
| Providerkosten V1 | keine |
| Austauschbarkeit | hoch |
| Governance | zentral und testbar |
| Produktdifferenzierung | AMAVIO-Fachlogik bleibt eigener Kern |

**Gewählt.**

## Konsequenzen

### Wird einfacher

- eine Capability kann lokal und später mit unterschiedlichen Providern dieselben Verträge nutzen;
- Evidenz und Quellenreferenzen werden systematisch statt promptweise geführt;
- Policies und Human Gates gelten zentral;
- Evaluation kann Provider, Capability und Version vergleichbar prüfen;
- UI bleibt ruhig und fallbezogen.

### Wird anspruchsvoller

- Verträge und Versionen müssen bewusst gepflegt werden;
- ein Providerwechsel darf nicht an der UI vorbei implementiert werden;
- echte Daten, produktive Mandantentrennung und Security bleiben separate Architekturprogramme;
- lokale Regeln dürfen nicht als statistische Prognose ausgegeben werden.

## Revisit-Gates

Diese Entscheidung wird vor einem Live-Provider, realen Daten oder produktivem Hosting erneut geprüft. Erforderlich bleiben DPA/Datenmodus, Region, Retention, Kostenlimit, Monitoring, Incident-Prozess, produktive Identity, Tenant-Isolation, Security-Test und Betriebskonzept.
