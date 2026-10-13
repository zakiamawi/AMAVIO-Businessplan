# QA – R3.11 G1 Product-Owner Decision Alignment

**Datum:** 13.10.2026  
**Prüfobjekt:** `20261013_AMAVIO_One_CRM_R3_11_G1_PO_Decision_Alignment_Working`  
**Zulässige Reifegradbezeichnung:** **Lokaler synthetischer CRM-Core-Prototyp – fachlich und technisch geprüft, nicht produktiv freigegeben**

## Prüfumfang

- maschinenlesbarer Beschlussvertrag `PO-CRM-043`;
- Migration bestehender v7-Zustände ohne Schema- oder Storage-Key-Wechsel;
- vier Gate-Status `po_decided_local` für G1-01, G1-05, G1-07 und G1-09;
- sichtbares Beschlussregister mit Restnachweisen;
- unveränderte Sperren für G1-03, G1-06 und G1-10;
- unveränderte Flags für reale Daten, Outbound und Release;
- vollständige Regression des lokalen synthetischen CRM-Cores.

## Automatisierte Prüfung

| Prüfung | Ergebnis |
|---|---|
| Produktionsbuild | **bestanden**, 1.603 Module transformiert |
| statisches QA-Gate | **bestanden** |
| Unit | **33/33 bestanden** |
| Vertragslogik | **11/11 bestanden** |
| Komponenten | **10/10 bestanden** |
| Integration | **6/6 bestanden** |
| Persistenz | **1/1 bestanden** |
| End-to-End | **20 zusammenhängende Kernabläufe bestanden** |
| Browsermatrix | **1600, 1280, 1024, 768, 430 und 390 Pixel bestanden** |
| Tastatur und Fokus | **Skip-Link, ⌘K, Escape, Focus-Trap und Focus-Rückgabe bestanden** |
| echter 200-%-Zoom | **bestanden**, 1280 Pixel Außenbreite reflowt auf 640 CSS-Pixel ohne Seitenüberlauf |
| Browserkonsole | **0 Fehler** |
| Screenshots | **62 lokale QA-Abbildungen einschließlich finaler manueller Evidenz** |

Maschinenlesbares Browserergebnis: `QA/CRM_R3_11_G1_PO_DECISION_ALIGNMENT_BROWSER_RESULT_20261013.json`. Screenshots: `QA/Screenshots/20261013-r3-11-g1-po-decision-alignment/`.

Der erste Logiklauf erkannte zwei Test-/Vertragsformulierungen: fehlende Spiegelung der Gate-ID-Liste im übergeordneten Beschlussvertrag und die alte Textbezeichnung der Restore-Probe. Beides wurde im kanonischen Vertrag korrigiert; anschließend bestand die vollständige Matrix ohne Fehler.

## Harte Negativkriterien

Die Prüfung gilt als fehlgeschlagen, wenn G1-03 nicht extern gesperrt, G1-06 nicht technisch gesperrt oder G1-10 nicht PO-gesperrt ist; wenn ein Beschluss produktive Kontaktaufnahme, Zugriff, Wiederanlauf oder Löschung freigibt; wenn `realDataEnabled`, `outboundEnabled` oder `releaseEligible` wahr wird; oder wenn eine externe Verbindung, ein Provider, C1, App oder ACC aktiviert wird.

## Abschluss und Wahrheitsstand

Die vier lokalen Fachbeschlüsse ändern ausschließlich die interne Arbeitslogik. Sie sind keine Rechts-, Datenschutz-, Security-, Betriebs- oder Gesamtfreigabe. Die vollständige lokale Matrix ist bestanden. Der zulässige Abschlussstand lautet deshalb ausschließlich: **Lokaler synthetischer CRM-Core-Prototyp – fachlich und technisch geprüft, nicht produktiv freigegeben**.

G1-03 bleibt `external_blocked`, G1-06 `technical_blocked` und G1-10 `po_blocked`. `realDataEnabled=false`, `outboundEnabled=false`, `releaseEligible=false`; produktive Kontakt-, Zugriffs-, Lösch- und Recovery-Freigaben bleiben ebenfalls aus.
