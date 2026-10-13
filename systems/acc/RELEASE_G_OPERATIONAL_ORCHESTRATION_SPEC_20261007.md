# AMAVIO ACC Release G – Operational Orchestration

**Stand:** 07.10.2026  
**Arbeitskopie:** `20261007_AMAVIO_ACC_Release_G_Operational_Orchestration_Working`  
**Status:** lokale, synthetische Founder-Evaluationsfassung

## Produktentscheidung

Release G ersetzt in der aktiven Fallarbeit das Nebeneinander mehrerer Funktionsmodule durch eine geschlossene operative Journey:

`Evidenz → Verantwortung → Simulation → Entscheidung → Arrival Readiness Brief`

Jede Stufe arbeitet auf demselben kanonischen Fall, denselben versionierten Quellen und demselben Audit-Verlauf. Die Oberfläche zeigt Fachlogik als nachvollziehbare Arbeitsunterstützung, nicht als dominantes KI-Produktmodul.

## Nutzerziel

Eine AMAVIO-Operations-Rolle soll für einen synthetischen Arrival-Fall jederzeit beantworten können:

1. Welche Evidenz liegt vor und wo besteht ein Widerspruch?
2. Wer trägt die nächste Verantwortung, was ist zu tun und bis wann?
3. Welche Folgefristen ändern sich bei einer isolierten Terminvariante?
4. Welche menschliche Entscheidung ist offen oder dokumentiert?
5. Welcher interne, belegte Arbeitsstand kann daraus erzeugt werden?

## Interaktionsvertrag

- Die Fallreise startet immer bei `Evidenz`.
- Stufen sind direkt sowie über eindeutige Weiter-Aktionen erreichbar.
- Eine Simulation verändert den Originalfall nicht.
- Die Übernahme einer Simulation verlangt eine menschliche Prüfnotiz und erzeugt eine neue Fallversion.
- Eine Entscheidung wird ausschließlich durch eine menschliche Begründung dokumentiert.
- Das Arbeitsprodukt ist ausschließlich ein `Arrival Readiness Brief` mit Quellenreferenzen und Status `sink_only`.
- Der rechte Kontext zeigt dauerhaft nächste Verantwortung, Frist, Human Gate und Briefstatus.
- Sämtliche Schreibaktionen bleiben lokal, synthetisch, auditierbar und ohne Außenwirkung.

## Designsystem

- Stage Navy `#081527`
- Brand Navy `#0B1F3A`
- Cream `#F7F4EC`
- Gold `#C6A35A`
- Bronze `#7D6130`
- Ink `#222222`
- Geist für Bedienoberfläche, Fraunces für redaktionelle Titel, Geist Mono für kurze Systemlabels
- Logo auf Stage Navy mit 180 px Breite
- Radien 0/4/8, feine Linien, keine Verläufe, keine Panel-Schatten und kein Teal/Mint

Konzeptreferenzen:

- `design/ACC_RELEASE_G_DESKTOP_CONCEPT_20261007.png`
- `design/ACC_RELEASE_G_MOBILE_CONCEPT_20261007.png`

## Technische Architektur

Release G nutzt die vorhandene lokale Gate-02A-Architektur weiter:

- Node-HTTP-Server und SQLite
- serverseitiger synthetischer Sitzungs- und Mandantenkontext
- lokale deterministische Domain Engine
- versionierte Aufgaben, Evidenz, Simulationen und Entscheidungen
- persistente Idempotenz, Concurrency- und Failure-Grenzen
- 24 synthetische Evaluationsszenarien
- geschlossene externe Provider-Adapter

Die aktive Release-G-Laufzeit erhält eine neue lokale Datenbankdatei, damit die bestehende Usability-Fassung und deren Zustand unverändert bleiben.

## Akzeptanzkriterien

- exakt fünf verbundene Fallstufen in der definierten Reihenfolge;
- vier synthetische Fälle im aktiven Mandanten, drei Evidenzbelege im Startfall, fünf Meilensteine und zehn Fachregeln;
- isolierte Simulation mit fünf sichtbaren Folgefristen;
- keine Fallmutation vor dem Human Gate;
- versionierte Übernahme nach Prüfnotiz;
- dokumentierte menschliche Entscheidung;
- erzeugbarer Arrival Readiness Brief mit Quellenreferenzen, `sink_only` und keiner Außenwirkung;
- 24/24 Evaluationsszenarien grün;
- keine externen Requests;
- keine horizontalen Seitenüberläufe auf 1505, 1280, 1024, 768, 390 und 360 px;
- zugängliche Namen und Labels, ein H1, Skip-Link, Tastaturpfad und Reduced-Motion-Regel;
- Brandbook-Check grün.

## Harte Grenzen

Nicht Bestandteil dieses Releases sind produktive Identity, produktive Mandantentrennung, echte Personen- oder Unternehmensdaten, externe KI, reale Prognosen, automatische Entscheidungen, CRM-/HRIS-/App-/Datei-/Messaging-/Buchungsintegrationen, Hosting, Deployment, Veröffentlichung oder Kosten. ACC bleibt Arbeitgeber-/AMAVIO-Oberfläche; die getrennte Drei-Rollen-App wird nicht verändert.
