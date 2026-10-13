# AMAVIO One CRM – Product-Owner-Entscheidungsprotokoll

**Datum der Vorlage:** 09.10.2026  
**Paketstatus:** fachlich beschlossen; technische Umsetzung und produktive Freigabe nicht erteilt  
**Beschlussquelle:** ausdrückliche Product-Owner-Anweisung im aktuellen Chat  
**Prä-Aktivierungsmanifest:** SHA-256 `bd9b9758f82247d2bc2e346f62497f1b0748cb5f618a46b184fc181d669771cd`  
**Regel:** Der Beschluss gilt nur für die unten markierten Empfehlungen und Sperren. Nicht genannte Folgeaufträge sind nicht autorisiert.

## Bündelentscheidung A – Kommerzieller CRM-Kern

Umfasst `PO-CRM-001`, `003`, `004`, `005`, `018`, `019`, `020`.

- [x] Empfehlung vollständig annehmen
- [ ] Mit Änderungen annehmen
- [ ] Zurückweisen
- [ ] Vertagen

Abweichungen / Begründung:

> Keine Abweichung. Die Empfehlungen zu `PO-CRM-001`, `003`, `004`, `005`, `018`, `019` und `020` sind als fachlicher R3-Zielvertrag angenommen.

## Bündelentscheidung B – Governance und Produktgrenzen

Umfasst `PO-CRM-002`, `006`, `007`, `010`, `014`.

- [x] Empfehlung vollständig annehmen
- [ ] Mit Änderungen annehmen
- [ ] Zurückweisen
- [ ] Vertagen

Abweichungen / Begründung:

> Keine Abweichung. Die Empfehlungen zu `PO-CRM-002`, `006`, `007`, `010` und `014` sind als fachlicher Governance- und Produktgrenzenvertrag angenommen. Rechts-, Datenschutz- und Security-Freigaben bleiben davon unberührt.

## Bündelentscheidung C – Produktive Technik und Integrationen

Umfasst `PO-CRM-008`, `009`, `011`, `012`, `013`, `015`, `016`, `017`.

- [x] Bestehende Sperren vollständig bestätigen
- [ ] Für einzelne ID einen getrennten Discovery-Auftrag erlauben
- [ ] Mit Änderungen bestätigen
- [ ] Vertagen

Erlaubter Discovery-Umfang / ausgeschlossene Aktionen:

> Alle Gates `PO-CRM-008`, `009`, `011`, `012`, `013`, `015`, `016` und `017` bleiben vollständig geschlossen. Es wurde kein Discovery-, Auswahl-, Beschaffungs-, Implementierungs-, Integrations- oder Deployment-Auftrag erteilt.

## Einzelabweichungen

| PO-ID | Entscheidung | Gewählte Option / Änderung | Begründung | Folgeauftrag erlaubt? |
|---|---|---|---|---|
| – | keine Abweichung | Empfehlungen der Bündel A und B vollständig angenommen; Bündel C vollständig gesperrt | ausdrücklicher Product-Owner-Beschluss | nein |

## Formale Bestätigung

- Product Owner: **Zaki Amawi**
- Entscheidungsdatum: **09.10.2026**
- Wortlaut: **„Ich beschließe Bündel A und Bündel B gemäß Empfehlung. Bündel C bleibt vollständig gesperrt.“**
- Geltende Paketversion/Manifest: **Entscheidungspaket 09.10.2026; Prä-Aktivierungsmanifest SHA-256 wie oben**
- Status nach Entscheidung: **A und B fachlich beschlossen; C als geschlossenes Gate bestätigt; nicht produktiv freigegeben**

## Ausgeführtes Aktivierungsprotokoll

1. Prä-Aktivierungsmanifest und Paketstand verifiziert.
2. Prä-Aktivierungsstände der betroffenen Dokumente lokal gesichert.
3. Angenommene PO-IDs in `CRM_PRODUCT_OWNER_DECISIONS.md` mit Wortlaut und Datum als fachlich entschieden markiert.
4. Betroffene Fachverträge auf Version 1.0 gehoben; technische und rechtliche Gates ausdrücklich erhalten.
5. Capability-Matrix, Produktgrenzen und Release-Reifeplan abgeglichen.
6. Konsistenz-, Sperr- und Integritätsprüfung ausgeführt.

Ein separater Umsetzungsauftrag wurde nicht erteilt. Aus diesem Protokoll folgt keine Codeänderung.

Die Chat-Anweisung und dieses Protokoll belegen ausschließlich den fachlichen Beschluss. Sie sind keine Produktions-, Rechts-, Datenschutz-, Security-, Integrations- oder Deployment-Freigabe.
