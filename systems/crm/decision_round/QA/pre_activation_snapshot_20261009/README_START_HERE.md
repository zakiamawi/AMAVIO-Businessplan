# AMAVIO One CRM – Product-Owner-Entscheidungsrunde

**Stand:** 09.10.2026  
**Paketstatus:** **ENTSCHEIDUNGSREIF / QA BESTANDEN / NICHT FREIGEGEBEN**  
**Produktstand:** **Lokaler synthetischer CRM-Core-Prototyp – fachlich und technisch geprüft, nicht produktiv freigegeben**

## Zweck

Dieses Paket macht die offenen Punkte `PO-CRM-001` bis `PO-CRM-020` entscheidungsreif. Es erteilt keine Freigabe, ändert keine produktive Konfiguration und erweitert den CRM-Code nicht. Empfehlungen sind Entscheidungsvorlagen, keine stillschweigenden Product-Owner-Beschlüsse.

## Entscheidungslogik in drei Bündeln

### Bündel A – Kommerzieller CRM-Kern

`PO-CRM-001`, `003`, `004`, `005`, `018`, `019`, `020`

Ziel: ein belastbares fachliches Arbeitsmodell für Pipeline, Qualifizierung, Partner, Sprache, Auswertung und Exportgrenze festlegen.

### Bündel B – Governance und Produktgrenzen

`PO-CRM-002`, `006`, `007`, `010`, `014`

Ziel: Rollenvertrag, Kontakt-/Consent-Trennung, Archivierungsgrundsatz, Arbeitsbereich und ACC-Handoff-Governance festlegen – ohne vorzutäuschen, dass diese Regeln bereits technisch erzwungen werden.

### Bündel C – Produktive Technik und Integrationen

`PO-CRM-008`, `009`, `011`, `012`, `013`, `015`, `016`, `017`

Ziel: die bestehenden Gates ausdrücklich bestätigen. In dieser Runde wird kein Anbieter ausgewählt, kein Login eingerichtet, kein Backend verbunden und kein Deployment ausgelöst.

## Reihenfolge

1. `CRM_PRODUCT_OWNER_DECISION_BRIEF_20261009.md` lesen.
2. Bündel A und B fachlich annehmen, ablehnen oder mit Änderungen versehen.
3. Bündel C als weiterhin gesperrt bestätigen oder einen getrennten Discovery-Auftrag erteilen.
4. Einzelabweichungen im Entscheidungsprotokoll dokumentieren.
5. Erst nach ausdrücklicher Entscheidung den Status im kanonischen Quellvertrag ändern.

## Dateien

- `CRM_PRODUCT_OWNER_DECISION_BRIEF_20261009.md` – Management- und Entscheidungssicht.
- `CRM_PRODUCT_OWNER_DECISION_REGISTER_20261009.csv` – alle 20 Entscheidungen mit Optionen, Empfehlung, Abhängigkeiten und Folgeaktion.
- `CRM_DECISION_DEPENDENCY_AND_GATE_MAP_20261009.md` – Sequenz und Blocker.
- `CRM_DECISION_PROTOCOL_DRAFT_20261009.md` – nicht operatives Freigabeprotokoll.
- `CRM_DECISION_CROSSWALK_20261009.csv` – Quellen- und Evidenzzuordnung.
- `QA/CRM_PRODUCT_OWNER_DECISION_ROUND_QA_20261009.md` – QA-Nachweis.
- `PACKAGE_MANIFEST.sha256` – Integritätsmanifest der Entscheidungspaketdateien.

## Harte Grenze

Eine Markierung als „empfohlen“, „entscheidungsreif“ oder „QA bestanden“ ist **keine Freigabe**. Ohne ausdrücklich dokumentierte Product-Owner-Entscheidung bleiben alle Punkte offen beziehungsweise gesperrt. CRM, App und ACC bleiben getrennte Produkte und Codebasen.
