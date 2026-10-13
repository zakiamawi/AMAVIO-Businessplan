# AMAVIO One CRM – R3.4 Implementation Crosswalk

**Stand:** 10.10.2026

| Beschluss / Ziel | Implementierung | Prüfung | Grenze |
|---|---|---|---|
| Mein Arbeitstag | `FounderDecisionCockpit.jsx`, Standardroute `today` | Komponenten- und E2E-Test | lokal |
| maximal drei Prioritäten | `buildFounderFocus` | Unit-Test und Browser-QA | regelbasiert |
| Decision Brief | `buildDecisionBrief` + Brief-Ledger | Unit-, Komponenten-, E2E-Test | kein externer Textgenerator |
| Entscheidungsreife | `buildOpportunityReadiness` | sechs transparente Dimensionen im Unit-Test | keine Abschlusswahrscheinlichkeit |
| Pipeline Movement | `buildPipelineMovement` | Unit- und Browser-QA | nur dokumentierte Ereignisse |
| Aging Strip | `buildAgingStrip` / `opportunityIdleDays` | Unit- und Browser-QA | synthetisches Referenzdatum |
| Relationship Field | `buildRelationshipField` | Komponenten-/E2E-Test | kein externes Netzwerk |
| Datenvertrauen | `buildDataConfidence` | Unit-Test | lokaler Qualitätsindikator |
| lokale Assistenzsimulation | `decisionIntelligenceContract` | QA-Gate und Unit-Test | keine externe KI, keine autonomen Writes |
| Navigation | `AppShell.jsx`, `App.jsx` | Browser- und E2E-Test | bestehende Bereiche erhalten |
| responsive/editorial | R3.4-Block in `styles.css` | 1600/1280/1024/768/430/390/200 % | kein externer Design-Framework-Wechsel |
| sichere Migration | neuer R3.4-Schlüssel, Fallback auf R3.3/R3.2 | Persistenz-, E2E- und QA-Gate | alte Schlüssel bleiben erhalten |

## Erhalt und Änderung

Erhalten wurden alle R3.3-Fachfunktionen und die SQLite-/Browser-Fallback-Architektur. Verändert wurden Standardroute, Navigation, Seed-Metadaten und drei synthetische Datums-/Namensanker, damit die sichtbaren Begründungen wahrheitsgemäß sind. Neu sind ausschließlich abgeleitete Entscheidungslogik, R3.4-Oberfläche, responsive Regeln, Tests und Dokumentation. Vorbereitet, aber nicht aktiviert, bleiben produktive KI, Versand, Connectoren, Cloud, Auth, Team, Mandanten, App und ACC.
