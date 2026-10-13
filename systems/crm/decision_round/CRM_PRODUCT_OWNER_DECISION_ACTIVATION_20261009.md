# AMAVIO One CRM – Aktivierung des Product-Owner-Beschlusses

**Datum:** 09.10.2026  
**Product Owner:** Zaki Amawi  
**Status:** **FACHLICH BESCHLOSSEN / IN DER R3-ARBEITSKOPIE LOKAL-SYNTHETISCH ANGEGLICHEN / NICHT PRODUKTIV FREIGEGEBEN**

## 1. Autorisierter Beschluss

> „Ich beschließe Bündel A und Bündel B gemäß Empfehlung. Bündel C bleibt vollständig gesperrt.“

Der Beschluss bezieht sich auf das QA-bestandene Entscheidungspaket vom 09.10.2026. Das Prä-Aktivierungsmanifest besitzt den SHA-256-Wert `bd9b9758f82247d2bc2e346f62497f1b0748cb5f618a46b184fc181d669771cd`.

## 2. Beschlossene fachliche Zielverträge

### Bündel A

Als fachliches R3-Zielbild angenommen wurden:

- `PO-CRM-001`: sechs Erfolgsphasen plus `Verloren` als separater Ausgang; spätere Änderungen nur versioniert;
- `PO-CRM-003`: phasenbezogene Mindestkriterien und ausdrücklich zulässige offene Evidenz;
- `PO-CRM-004`: klare Trennung von ungeprüftem Lead und qualifizierter Opportunity;
- `PO-CRM-005`: Partner als getrennte Objektklasse, interne Pflege, kein Partnerlogin;
- `PO-CRM-018`: Deutsch als vollständige Primärsprache; Englisch nur als vollständiges getestetes Release;
- `PO-CRM-019`: sichtbares Potenzial, aber kein gewichteter Forecast ohne belastbare Grundlage;
- `PO-CRM-020`: Export bleibt in R3 deaktiviert.

### Bündel B

Als fachliches Governance-Zielbild angenommen wurden:

- `PO-CRM-002`: fünf interne Zielrollen ohne behauptete technische Durchsetzung;
- `PO-CRM-006`: Trennung von Beziehungs-, Kontakt- und Einwilligungs-/Rechtsstatus; Default `unknown`;
- `PO-CRM-007`: Archivierung als operative Standardaktion; physische Löschung erst nach geprüftem Konzept;
- `PO-CRM-010`: erster Zielrahmen ist ein interner AMAVIO-Single-Workspace; keine Mandantenfähigkeit;
- `PO-CRM-014`: ACC-Handoff nur mit getrennter Freigabe durch Commercial/Product Owner und Operations, minimalem versioniertem Datensatz und ohne Personendaten im Default.

## 3. Vollständig gesperrte Gates

Für die folgenden IDs wurde die bestehende Sperre ausdrücklich bestätigt:

- `PO-CRM-008`: produktive Datenbank;
- `PO-CRM-009`: Authentifizierung und MFA;
- `PO-CRM-011`: Import bestehender Daten;
- `PO-CRM-012`: E-Mail- und Kalenderintegration;
- `PO-CRM-013`: Dokumentenspeicher;
- `PO-CRM-015`: App-Integration;
- `PO-CRM-016`: produktive KI;
- `PO-CRM-017`: Hosting und Deployment.

Es wurde für keine dieser IDs ein Discovery-, Anbieter-, Beschaffungs-, Login-, Integrations-, Implementierungs-, Deployment- oder Veröffentlichungsauftrag erteilt.

## 4. Durch diese Aktivierung geändert

- Product-Owner-Matrix und Entscheidungsregister wurden auf den Beschlussstand gebracht.
- Status-, Rollen-/Sichtbarkeits-, Lifecycle-, ACC-Handoff- und Domänenverträge wurden fachlich auf Version 1.0 gehoben.
- Capability-Matrix, Produktgrenzen und Release-Reifeplan wurden mit der neuen Entscheidungswahrheit abgeglichen.
- Ein Pre-Activation-Snapshot und neue Integritätsnachweise wurden erstellt.

## 5. Durch diese Aktivierung nicht geändert

- Anwendungscode, UI, Layout, Markenmittel und synthetische Beispieldaten;
- lokale Persistenz, Validierungslogik und vorhandene Tests;
- Authentifizierung, Datenbank, Rollen-Durchsetzung oder Mandantenfähigkeit;
- E-Mail, Kalender, Cloud, Dokumente, App, ACC oder Drittanbieter;
- Hosting, Deployment, Git-Status oder externe Übertragung.

## 6. R3-Folgeumsetzung

Der gesonderte Auftrag für das R3 Contract Alignment wurde erteilt und ausschließlich in der datierten Arbeitskopie `20261009_AMAVIO_One_CRM_R3_Contract_Alignment_Working` umgesetzt. Die technische Angleichung umfasst die lokalen synthetischen Vertragsfunktionen der Bündel A und B. Bündel C wurde weder geöffnet noch mittelbar vorweggenommen. Evidenz und genaue Zuordnung stehen in `R3_IMPLEMENTATION_CROSSWALK.md` und `QA/CRM_R3_CONTRACT_ALIGNMENT_QA_20261009.md`.
