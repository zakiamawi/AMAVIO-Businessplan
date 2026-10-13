# AMAVIO One CRM – Product-Owner-Entscheidungsprotokoll (nicht operativer Draft)

**Datum der Vorlage:** 09.10.2026  
**Paketstatus:** entscheidungsreif, nicht freigegeben  
**Regel:** Leere oder nicht eindeutig markierte Felder bedeuten **keine Entscheidung**.

## Bündelentscheidung A – Kommerzieller CRM-Kern

Umfasst `PO-CRM-001`, `003`, `004`, `005`, `018`, `019`, `020`.

- [ ] Empfehlung vollständig annehmen
- [ ] Mit Änderungen annehmen
- [ ] Zurückweisen
- [ ] Vertagen

Abweichungen / Begründung:

> Noch nicht ausgefüllt.

## Bündelentscheidung B – Governance und Produktgrenzen

Umfasst `PO-CRM-002`, `006`, `007`, `010`, `014`.

- [ ] Empfehlung vollständig annehmen
- [ ] Mit Änderungen annehmen
- [ ] Zurückweisen
- [ ] Vertagen

Abweichungen / Begründung:

> Noch nicht ausgefüllt.

## Bündelentscheidung C – Produktive Technik und Integrationen

Umfasst `PO-CRM-008`, `009`, `011`, `012`, `013`, `015`, `016`, `017`.

- [ ] Bestehende Sperren vollständig bestätigen
- [ ] Für einzelne ID einen getrennten Discovery-Auftrag erlauben
- [ ] Mit Änderungen bestätigen
- [ ] Vertagen

Erlaubter Discovery-Umfang / ausgeschlossene Aktionen:

> Noch nicht ausgefüllt. Ohne Eintrag bleiben alle Gates geschlossen.

## Einzelabweichungen

| PO-ID | Entscheidung | Gewählte Option / Änderung | Begründung | Folgeauftrag erlaubt? |
|---|---|---|---|---|
| – | keine | – | – | nein |

## Formale Bestätigung

- Product Owner: **nicht eingetragen**
- Entscheidungsdatum: **nicht eingetragen**
- Geltende Paketversion/Manifest: **nicht eingetragen**
- Status nach Entscheidung: **nicht gesetzt**

## Aktivierungsprotokoll nach einer ausdrücklichen Entscheidung

1. Manifest und Paketstand verifizieren.
2. Jede angenommene PO-ID einzeln in `CRM_PRODUCT_OWNER_DECISIONS.md` von `offen` auf `entschieden` setzen; Wortlaut und Datum ergänzen.
3. Betroffene Verträge versionieren; Empfehlungen nicht still in Quellverträge übernehmen.
4. Capability-Matrix und Release-Reifeplan aktualisieren.
5. Konsistenz- und Negativprüfung ausführen.
6. Separaten Umsetzungsauftrag definieren. Keine Codeänderung allein aufgrund dieses Protokolls.

Eine Unterschrift oder Checkbox in einer Kopie ohne eindeutige Zuordnung zum Manifest ist kein belastbarer Freigabenachweis.
