# AMAVIO One CRM – Product-Owner-Entscheidungsrunde

**Stand:** 09.10.2026  
**Paketstatus:** **BÜNDEL A+B FACHLICH BESCHLOSSEN / BÜNDEL C GESPERRT BESTÄTIGT / NICHT PRODUKTIV FREIGEGEBEN**  
**Produktstand:** **Lokaler synthetischer CRM-Core-Prototyp – fachlich und technisch geprüft, nicht produktiv freigegeben**

## Zweck

Dieses Paket dokumentiert den ausdrücklichen Product-Owner-Beschluss vom 09.10.2026 zu `PO-CRM-001` bis `PO-CRM-020`. Bündel A und B wurden gemäß Empfehlung als fachliche Zielverträge angenommen. Bündel C bleibt vollständig gesperrt. Der Beschluss erteilt keine produktive Freigabe, ändert keine produktive Konfiguration und erweitert den CRM-Code nicht.

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

1. `CRM_PRODUCT_OWNER_DECISION_ACTIVATION_20261009.md` als Beschluss- und Aktivierungsnachweis lesen.
2. Fachverträge Version 1.0 als Zielbild verwenden.
3. Abweichungen künftig als neuen versionierten Beschluss dokumentieren.
4. Vor jeder technischen Umsetzung einen gesonderten Umsetzungsauftrag erteilen.
5. Bündel C nur durch einen neuen ausdrücklichen Product-Owner-Beschluss öffnen.

## Dateien

- `CRM_PRODUCT_OWNER_DECISION_BRIEF_20261009.md` – Management- und Entscheidungssicht.
- `CRM_PRODUCT_OWNER_DECISION_ACTIVATION_20261009.md` – Beschlusswirkung, Überführung und harte Nichtfreigabegrenzen.
- `CRM_PRODUCT_OWNER_DECISION_REGISTER_20261009.csv` – alle 20 Entscheidungen mit Optionen, Empfehlung, Abhängigkeiten und Folgeaktion.
- `CRM_DECISION_DEPENDENCY_AND_GATE_MAP_20261009.md` – Sequenz und Blocker.
- `CRM_DECISION_PROTOCOL_DRAFT_20261009.md` – nicht operatives Freigabeprotokoll.
- `CRM_DECISION_CROSSWALK_20261009.csv` – Quellen- und Evidenzzuordnung.
- `QA/CRM_PRODUCT_OWNER_DECISION_ROUND_QA_20261009.md` – QA-Nachweis.
- `QA/CRM_PRODUCT_OWNER_DECISION_ACTIVATION_QA_20261009.md` – QA der Beschlussüberführung.
- `PACKAGE_MANIFEST.sha256` – Integritätsmanifest der Entscheidungspaketdateien.
- `ACTIVATION_MANIFEST.sha256` – Integritätsmanifest der aktivierten kanonischen Fachverträge.

## Harte Grenze

Der Product-Owner-Beschluss ist eine fachliche Zielentscheidung, aber **keine technische oder produktive Freigabe**. CRM, App und ACC bleiben getrennte Produkte und Codebasen. Alle Gates von Bündel C bleiben geschlossen; neue Umsetzung benötigt einen gesonderten Auftrag.
