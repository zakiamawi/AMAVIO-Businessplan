# AMAVIO Intelligence Kernel V1 – QA-Nachweis

**Stand:** 07.10.2026  
**Arbeitskopie:** `20261007_AMAVIO_ACC_Intelligence_Kernel_V1_Working`  
**Status:** lokal vollständig grün

## Abschlusslauf

- `npm run test`: **102/102 bestanden**.
- `npm run qa:static`: **grün**.
- `npm run qa:brandbook`: **grün**.
- `npm run qa:browser`: **grün** auf sechs Viewports.
- `npm run qa:usability`: **grün** auf Desktop und Mobile.
- `npm run qa:all`: **grün** als konsolidierter Abschlusslauf.

## Kernel-Nachweise

### Evidence Graph

- identischer Snapshot erzeugt identischen SHA-256-Fingerprint;
- drei Startbelege und der markierte Adresskonflikt werden korrekt abgebildet;
- Case-, Evidence-, Task-, Milestone-, Decision- und Policy-Signal-Knoten vorhanden;
- blockierende Widerspruchs- und Abhängigkeitskanten vorhanden;
- Quellenreferenzzahl steht der Release-G-Kontextleiste zur Verfügung.

### Policy Engine

- acht lokale Policies `allow`;
- externer Provider erzeugt `deny` durch `POL-007`;
- Ausführung stoppt vor einem Provideraufruf;
- unbekannte Capability, fehlende Evidenz und fremder Tenant fail closed.

### Capability Registry und Provider Boundary

- vier eindeutige, versionierte Capabilities;
- lokaler deterministischer Provider aktiv;
- OpenAI und Mistral `gate_closed`;
- Adapter sind nur mit injiziertem Fake-Transport getestet, nicht authentifiziert oder live getestet;
- null externe Calls und null Providerkosten im Abschlusslauf.

### Human Gate

- jeder Capability Run startet als `awaiting_human_review`;
- Review verlangt `approved` oder `rejected`, Begründung und aktuelle Version;
- paralleles Review erlaubt genau einen erfolgreichen Abschluss;
- Approval bedeutet ausschließlich `advisory_approved`;
- Außenwirkung bleibt vor und nach dem Review `false`.

### Evaluation Harness

- **34/34** Kernel-Szenarien bestanden;
- Bereiche: Evidence Graph, Policy Engine, Capability Registry, Human Gate und Provider Boundary;
- gemeldete externe Calls: `0`;
- gemeldete externe Effekte: `0`.

## Erweiterte Route-Matrix

- bestehende 20 Gate-02A-Routen plus 6 Kernel-Routen;
- **26/26** Routen mit Session-/Tenant- und Failure-Injection-Prüfung;
- **16/16** Mutationen mit Idempotenz-, Fuzz- und Concurrency-Vertrag;
- Kernel-Kontext, Run, Review und Evaluation sind tenantgebunden;
- Idempotenzantwort bleibt über Neustart erhalten.

## Browser und Oberfläche

Geprüft wurden 1505×1000, 1280×800, 1024×900, 768×900, 390×844 und 360×800.

- Release-G-Journey bleibt vollständig funktionsfähig;
- Kontextleiste ist mit `amavio.intelligence-kernel.v1` verbunden;
- keine sichtbare Kernel-, KI-Chat-, Copilot- oder AI-Command-Center-Fläche;
- keine Layoutregression oder horizontaler Seitenüberlauf;
- keine externen Requests;
- keine defekten Bilder, doppelten IDs oder unbeschrifteten sichtbaren Felder;
- Tastaturpfad, Reduced Motion und mobile Navigation grün;
- bestehende 24er UI-Evaluation vollständig grün;
- moderiertes Usability-Instrument ohne Regression.

Visuelle Belege:

- `QA/release-g-screens/desktop-1505-evidence.png`
- `QA/release-g-screens/desktop-1505-product.png`
- `QA/release-g-screens/mobile-390-operations.png`
- `QA/release-g-screens/mobile-360-operations.png`

## Harte Grenze

Alle Prüfungen laufen mit lokalen synthetischen Fixtures. Es werden keine Credentials gelesen, keine Provider aktiviert, keine externen Requests ausgeführt, keine Kosten ausgelöst und keine Nachricht, Buchung, Freigabe oder produktive Entscheidung erzeugt.

## Restgrenzen

Der Abschluss belegt einen lokalen providerunabhängigen Kernel-Vertrag, nicht Produktivreife oder selbsttrainierte KI. Nicht nachgewiesen sind produktive Identity, produktive Mandantentrennung, reale Datenqualität, DPA/Retention/Region eines Providers, Live-Modellqualität, Prompt-Injection-Härtung gegen einen realen Provider, produktives Hosting, Observability, Secrets Management, Security-Test oder Betrieb.
