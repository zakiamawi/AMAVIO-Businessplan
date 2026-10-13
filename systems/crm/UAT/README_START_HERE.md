# AMAVIO One CRM – R3 Product-Owner-UAT

**Datum:** 09.10.2026  
**Prüfgegenstand:** lokale synthetische R3-UAT-Arbeitskopie  
**Status:** **UAT VORBEREITET / PRODUCT-OWNER-ENTSCHEIDUNG AUSSTEHEND / NICHT PRODUKTIV FREIGEGEBEN**

## Zweck

Diese Runde prüft nicht, ob einzelne Schaltflächen technisch funktionieren – das ist bereits automatisiert nachgewiesen. Sie prüft, ob Pipeline, Begriffe, Pflichtinformationen, Lead-Grenze, Partnerlogik, Kontaktstatus, ACC-Prüfmarker und Berichtssicht die tatsächliche AMAVIO-Arbeitsweise fachlich richtig abbilden.

Es werden keine produktiven Daten verwendet. Es gibt keine Authentifizierung, Datenbank, E-Mail-, Kalender-, Cloud-, App-, ACC- oder Drittanbieteranbindung. Bündel C bleibt vollständig gesperrt.

## Reihenfolge

1. `CRM_R3_UAT_SCRIPT_20261009.md` – die 14 Geschäftsszenarien vollständig durchgehen.
2. `CRM_R3_ACCEPTANCE_CHECKLIST_20261009.md` – jede fachliche Entscheidung einzeln bewerten.
3. `CRM_R3_UAT_FINDINGS_20261009.md` – nur konkrete Abweichungen oder Verbesserungsvorschläge erfassen.
4. `CRM_R3_PRODUCT_OWNER_ACCEPTANCE_20261009.md` – eine der vorgesehenen Abnahmeentscheidungen treffen.
5. `CRM_R3_RELEASE_DECISION_20261009.md` – R3 einfrieren, R3.1 begrenzen oder UAT zurückstellen.

## Lokaler Start

```bash
npm run dev -- --port 4364 --strictPort
```

Lokale Adresse: `http://127.0.0.1:4364`

Vor Beginn im CRM einmal **Demo zurücksetzen**. Der Reset betrifft ausschließlich den isolierten R3-v3-Speicher dieser Browserumgebung. Vorhandene v1- und v2-Speicherstände bleiben unangetastet.

## Verbindliche Bewertungswerte

- **AKZEPTIERT:** fachlich passend und ohne Änderung abnahmefähig.
- **R3.1-KORREKTUR:** klar begrenzte Korrektur innerhalb des bereits beschlossenen Vertrags.
- **GEPARKT:** sinnvoll, aber nicht für die R3-Abnahme erforderlich.
- **ENTSCHEIDUNG OFFEN:** fachliche Richtung muss durch den Product Owner festgelegt werden.
- **GATE-GESPERRT:** fällt in Bündel C oder benötigt Recht, Datenschutz, Security, Daten, Kosten oder Integration.

## Harte Abnahmegrenze

Eine technische QA, ein vorbereiteter UAT-Bericht oder ein lokal erreichbarer Preview ist keine Product-Owner-Abnahme. Der Status bleibt ausstehend, bis Zaki Amawi eine der Entscheidungen im Abnahmedokument ausdrücklich bestätigt. Ohne Bestätigung wird kein Freeze als „abgenommen“ bezeichnet.
