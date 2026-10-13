# AMAVIO One CRM – Canonical Core Architecture & Operational Foundation

**Stand:** 9. Oktober 2026  
**Status:** **Lokaler synthetischer CRM-Core-Prototyp – fachlich und technisch geprüft, nicht produktiv freigegeben**

Diese datierte Arbeitskopie entwickelt den gesicherten Prototyp vom 8. Oktober kontrolliert zu einem eigenständigen lokalen AMAVIO-CRM-Core weiter. Sie ist keine HubSpot-Kopie und kein produktives System. Die IGS-Ausgangsdateien dienten ausschließlich als Material für Funktions- und Informationsarchitektur; deren fremde Fachlogik wurde nicht übernommen.

## Produktgrenze

Der lokale Core umfasst:

- kanonische Organisationen, Kontakte, Chancen, Aufgaben und Aktivitäten;
- belastbare Beziehungen, Detailansichten und Aktivitätstimeline;
- erlaubte Pipelineübergänge mit Historie;
- Validierung, lokale Dublettenhinweise, Archiv/Wiederherstellung und ein einstufiges Undo;
- objektübergreifende Suche, Filter, Leer-, Fehler- und Bestätigungszustände;
- versionierte, validierte lokale Persistenz mit kontrolliertem Reset;
- ausschließlich synthetische Beispieldaten und `.invalid`-Adressen.

Ausdrücklich nicht enthalten oder aktiviert sind Authentifizierung, Backend/Datenbank, Mehrbenutzer- oder Mandantenfähigkeit, reale personenbezogene Daten, Import, E-Mail, Kalender, Cloud, Dokumentenspeicher, produktive KI, externe Kommunikation, Hosting, Deployment sowie App- oder ACC-Integration.

CRM, AMAVIO One App und Arrival Control Center bleiben getrennte Produkte und getrennte Codebasen. Ein gewonnener CRM-Vorgang kann lediglich einen lokalen Review-Marker besitzen; es wird kein ACC-Fall erzeugt und nichts übertragen.

## Schutz des Ausgangsstands

- Unveränderter Ausgangsordner: `20261008_AMAVIO_One_CRM_Cockpit_Working`
- Vollständige Sicherung vor der Core-Arbeit: `20261009_AMAVIO_One_CRM_Cockpit_Sicherung_Pre_Canonical_Core`
- Diese Arbeitskopie: `20261009_AMAVIO_One_CRM_Canonical_Core_Working`
- Der alte Speicher `amavio-one-crm-cockpit-v1` bleibt unangetastet.
- Diese Arbeitskopie verwendet ausschließlich `amavio-one-crm-canonical-core-v2`.

Die Sicherungs- und Vergleichsevidenz steht in `QA/CRM_COPY_AND_SCOPE_VERIFICATION_20261009.md`.

## Lokal starten

Voraussetzung: Node.js 20 oder neuer.

```bash
npm run dev
```

Lokale Adresse: `http://127.0.0.1:4360`

## Qualitätsprüfungen

```bash
npm run build
npm run qa
npm run test:logic
npm run test:e2e
npm run qa:browser
```

- `test:logic` umfasst Unit-, Vertrags-, Komponenten- und Integrationstests.
- `test:e2e` prüft die zwölf zusammenhängenden synthetischen Kernpfade.
- `qa:browser` prüft 1600, 1280, 1024 und 430 Pixel, Tastatur/Fokus, 200-%-Reflow und Browserkonsole und erzeugt lokale QA-Screenshots.
- Die Browser-Skripte nutzen den lokal installierten Google Chrome. Sie rufen ausschließlich den lokalen Vite-Server auf.

## Architektur- und Entscheidungsdokumente

- `CRM_CAPABILITY_GAP_MATRIX.md`
- `CRM_CANONICAL_DOMAIN_MODEL.md`
- `CRM_STATUS_AND_TRANSITION_CONTRACT.md`
- `CRM_PERMISSIONS_AND_VISIBILITY_DRAFT.md`
- `CRM_DATA_LIFECYCLE_AND_PRIVACY_DRAFT.md`
- `CRM_ACC_HANDOFF_CONTRACT_DRAFT.md`
- `CRM_TEST_AND_QUALITY_STRATEGY.md`
- `CRM_RELEASE_MATURITY_PLAN.md`
- `CRM_PRODUCT_OWNER_DECISIONS.md`
- `QA/CRM_CORE_OPERATIONS_QA_20261009.md`

## Visuelle Referenzen

- `design/AMAVIO_ONE_CRM_DESKTOP_CONCEPT_20261008.png`
- `design/AMAVIO_ONE_CRM_MOBILE_CONCEPT_20261008.png`
- `public/assets/media/crm-focus-architecture.png`

Die bestehende AMAVIO-Identität wurde erhalten: Editorialität, Navy-/Creme-Basis, Goldakzente, klare Typografie und offene Flächen. Das Architekturmotiv und sämtliche dargestellten CRM-Daten sind synthetisch und identifizieren keine reale Organisation oder Person.
