# AMAVIO One CRM – Entscheidungs-, Abhängigkeits- und Gate-Map

**Status:** fachliche Bündel A/B beschlossen; Bündel C vollständig gesperrt; nicht operativ

## Entscheidungsfluss

```text
Bündel A: kommerzieller Kern
  001 Pipeline ──┬── 003 Phasenpflichten
                 ├── 004 Lead/Opportunity
                 ├── 019 Forecastgrenze
                 └── 020 Exportgrenze
  005 Partner ────── 002 Rollen / 006 Kontaktstatus
  018 Sprache ────── vollständiger R3-Oberflächenscope

Bündel B: Governance
  002 Rollen ───┬── 009 Authentifizierung
                ├── 010 Arbeitsbereich/Mandant
                ├── 014 ACC-Handoff
                └── 020 Exportrechte
  006 Consent ──┬── 007 Lifecycle/Löschung
                ├── 011 Import
                ├── 012 E-Mail/Kalender
                └── 016 produktive KI

Bündel C: produktive Technik
  A + B entschieden
      └── 008 Datenbank + 009 Auth + 017 Hosting
              └── 011 Import / 012 E-Mail-Kalender / 013 Dokumente
                      └── 014 ACC-Integration / 015 App-Integration / 016 KI
```

## Gate-Klassen

| Gate | Betroffene IDs | Was davor vorliegen muss | Aktueller Zustand |
|---|---|---|---|
| G1 Product Contract | 001–005, 018–020 | Product-Owner-Entscheidung und versionierter Fachvertrag | **fachlich beschlossen; technische Angleichung/UAT offen** |
| G2 Governance & Privacy | 002, 005–007, 010, 014, 020 | Rollen-/Sichtbarkeitsvertrag, Zweck- und Datenklassen, Rechts-/Datenschutzprüfung für produktive Nutzung | **fachlicher Vertrag beschlossen; keine Rechts-, Datenschutz- oder Security-Freigabe** |
| G3 Secure Foundation | 008, 009, 017 | G1/G2, Threat Model, Betriebsverantwortung, Kostenrahmen, Backup/Restore | gesperrt |
| G4 Data Readiness | 011, 013 | G1–G3, Dateninventar, Mapping, Aufbewahrung, Migration/Rollback | gesperrt |
| G5 Controlled Integrations | 012, 014–016 | G1–G4, versionierte Verträge, Security-/Privacy-/Kostenfreigaben | gesperrt |
| G6 Release | alle produktiven Fähigkeiten | UAT, Security, Datenschutz, Betrieb, Monitoring, Incident, Releasefreigabe | gesperrt |

## Beschlusswirkung – und was nicht ausgelöst wurde

Der angenommene A-/B-Beschluss erlaubt ausschließlich, die entsprechenden Fachverträge auf Version 1.0 zu heben und ein getrenntes R3-Umsetzungspaket zu planen. Er erlaubt nicht automatisch Codeänderung, Verarbeitung realer Daten, Anbieterwahl oder Veröffentlichung.

Die erfolgte Bestätigung von Bündel C bedeutet ausdrücklich „Gate bleibt geschlossen“. Sie ist keine Auswahlentscheidung und kein Discovery-Auftrag.

## Konfliktregister

| Konflikt | Betroffene IDs | Auflösungsvorschlag |
|---|---|---|
| schnelle Produktivsetzung vs. belastbare Governance | 008, 009, 017 | G1/G2 abschließen, dann R4-Discovery; kein Zwischen-Deployment |
| CRM-Nutzen vs. Datenschutzstatus | 006, 007, 011, 012, 020 | Beziehungsdaten und Rechts-/Kontaktstatus getrennt führen; Außenaktionen standardmäßig gesperrt |
| gewonnen vs. operativ startbereit | 014 | Dual Approval und eigener Handoff-Status; kein Automatismus |
| interne Einfachheit vs. Mandantenfähigkeit | 010 | interner Single-Workspace als erster Zielrahmen; externe Portale separat |
| hilfreiche Kennzahl vs. Scheingenauigkeit | 019 | sichtbares Potenzial statt gewichteter Forecast bis empirische Grundlage vorliegt |
| vollständige Sprache vs. Mischoberfläche | 018 | DE vollständig; EN nur als geschlossenes Release |
