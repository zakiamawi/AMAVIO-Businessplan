# QA – G1 Entry Gate Closure

**Datum:** 13.10.2026  
**Prüfobjekt:** datierte R3.7-Arbeitskopie  
**Freigabegrenze:** lokal-synthetisch; G1 bleibt NO-GO

## Prüfauftrag

Geprüft werden Schema-v6-Isolation, Sicherheitsinvarianten, zehn Gate-Zustände, Datenklassen, Lebenszyklus, Import-/Quarantänevertrag, vier synthetische Trockenläufe, Auditspur, lokale Persistenz, responsive Darstellung, Tastaturbedienung, 200-%-Zoom und Browserkonsole. Reale Daten und externe Systeme sind nicht Teil der Prüfung.

## Soll-Negativtests

- nicht-synthetischer Import wird abgewiesen;
- reale E-Mail-Domain wird im Kontaktformular abgewiesen;
- Kontrollläufe setzen weder `realDataEnabled`, `outboundEnabled` noch `releaseEligible` auf `true`;
- G1-03 bleibt extern, G1-06 technisch und G1-10 durch PO-Beschluss gesperrt;
- Provider besitzen keine externen Schreibrechte;
- keine aktive externe Browserverbindung, kein Versand, kein App-/ACC-Payload;
- keine Behauptung von Datenschutz-, Security- oder Produktivfreigabe.

## Auszuführende Nachweise

`npm run build`, `npm run qa`, `npm run test:logic`, `npm run test:persistence`, `npm run test:e2e` und `npm run qa:browser` wurden ausgeführt. Screenshots liegen ausschließlich lokal unter `QA/Screenshots/20261013-r3-7-g1-entry-gates/`; das strukturierte Ergebnis liegt in `QA/CRM_R3_7_G1_BROWSER_RESULT_20261013.json`.

## Ergebnis

| Nachweis | Ergebnis |
|---|---|
| Build | bestanden; Vite-Produktionsbuild erzeugt |
| statisches QA-Gate | bestanden; Dokumente, Grenzen, Assets, lokaler Netzwerkvertrag und v6-Isolation geprüft |
| Unit | 29/29 bestanden |
| Vertragslogik | 10/10 bestanden |
| Komponenten | 9/9 bestanden |
| Integration | 5/5 bestanden |
| Persistenz | 1/1 bestanden; SQLite, Snapshot, Export, Reset, Restore und Ablehnung nicht-synthetischer Importe |
| End-to-End | 20 zusammenhängende lokale Kernabläufe bestanden; Browserkonsole ohne Fehler |
| Browser-QA | 1600, 1280, 1024, 768, 430 und 390 Pixel bestanden; 43 Screenshots |
| Tastatur | Skip-Link, `⌘/Ctrl K`, Escape, Focus-Trap und Focus-Rückgabe bestanden |
| 200-%-Zoom | echte 1280→640-CSS-Pixel-Reflow-Prüfung bestanden; kein Seitenüberlauf |

Nach dem finalen lokalen Kontrolllauf wurde der versionierte synthetische Snapshot `backup-mv5xkxrq` mit dem Label „G1 Entry Gate Closure – Post-QA synthetischer Snapshot“ erstellt. Der gespeicherte Zustand bestätigt Schema v6, vier Kontrollprotokolle sowie `realDataEnabled=false`, `outboundEnabled=false` und `releaseEligible=false`.

Der erste E2E-Start innerhalb der eingeschränkten macOS-Prozess-Sandbox scheiterte am Chromium-Mach-Port (`Permission denied`). Der identische lokale Lauf wurde anschließend mit freigegebenem lokalen Browserprozess wiederholt und vollständig bestanden. Dies war kein Produktfehler und erzeugte keine externe Verbindung.

## Visuelle Kontrolle

Desktop- und Mobile-Screenshots wurden visuell geprüft. Der G1-Bereich behält die AMAVIO-Typografie und offene redaktionelle Struktur, nutzt Statusfarbe nur als ergänzenden Indikator und bleibt ohne horizontales Seiten-Overflow. Umfangreiche Tabellen scrollen ausschließlich innerhalb ihres Inhaltsbereichs. Die vier G1-Ansichten vermeiden eine dauerhafte Überladung der Datenfläche.

## Reifegrad nach bestandenem Lauf

„G1-Entscheidungspaket lokal-synthetisch vollständig vorbereitet – reale Daten weiterhin NO-GO“. Der Nachweis ist keine Rechtsberatung, keine technische Zugriffsschutzfreigabe und kein Product-Owner-GO. Die verbleibenden Blocker G1-03, G1-06 und G1-10 sind in UI, Vertrag und Tests konsistent gesperrt.

