# ADR-008 – Release J.5 Dual-Sided Workflow

**Datum:** 10.10.2026  
**Status:** lokal implementiert und QA-geprüft  
**Geltungsbereich:** synthetische AMAVIO-ACC-Konzeptdemo

## Entscheidung

AMAVIO Operations und Arbeitgeber werden nicht als Varianten derselben Oberfläche modelliert. Sie teilen einen mandantengebundenen synthetischen Fallkontext, besitzen aber verschiedene Informations-, Aktions- und Verantwortungsverträge.

## Arbeitsräume

### AMAVIO Operations

- vollständige interne Fallsteuerung;
- Evidenz, Aufgaben, Simulation, Entscheidung und Arrival Readiness Brief;
- Eingang und fachliche Prüfung von Arbeitgeberbeiträgen;
- optionale, ausdrücklich gewählte Übernahme einer Ergebnisrückmeldung in Operational Learning;
- Zugriff auf interne Lern-, Kernel-, Twin- und Auditdomänen.

### Arbeitgeber

- rollenminimierter Fallbestand für Sponsor, HR Operations, Standort oder Budget;
- nur zugewiesene Aufgaben, Entscheidungen und freigegebene Evidenz;
- bewusste Übergabe von Beleg, Entscheidung, Rückfrage oder Ergebnis;
- gemeinsamer Status und eigener Beitragsverlauf;
- kein Zugriff auf interne Policies, Simulationen, Auditdaten, Kernelartefakte oder Lernbewertungen.

## Prozessvertrag

`Arbeitgeberaufgabe → bewusste Übergabe → Operations-Prüfung → gemeinsamer Status`

Eine Ergebnisrückmeldung darf zusätzlich als internes Lernsignal angelegt werden. Dafür ist eine eigene sichtbare Operations-Auswahl erforderlich. Die Prüfung selbst aktiviert keine Policy, Capability oder Providerfunktion.

## Technischer Vertrag

- `GET /api/collaboration/v1/bootstrap`
- `POST /api/collaboration/v1/contributions`
- `POST /api/collaboration/v1/contributions/:id/review`
- persistente lokale Tabelle `employer_contributions`;
- tenantgebundene Abfragen, serverseitige Rollenprüfung und fail-closed Fehlercodes;
- persistente Idempotenzkeys für Mutationen;
- exklusive Prüfung: ein bereits bearbeiteter Beitrag liefert `409 contribution_already_reviewed`;
- optionale Lernübernahme erzeugt reproduzierbar genau einen internen `learning_feedback`-Eintrag;
- alle Datensätze tragen die synthetische Grenze und besitzen keine Außenwirkung.

## Nicht entschieden

Produktive Identity, Mandantentrennung, Hosting, Datenschutzbetrieb, reale Datenquellen, externe KI, CRM/HRIS/App/Messaging/Buchung und Veröffentlichung bleiben außerhalb dieses Releases und benötigen eigene Founder- und Architekturentscheidungen.
