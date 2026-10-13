# QA – AMAVIO One CRM R3.9 IA Consolidation

**Datum:** 13.10.2026  
**Arbeitskopie:** `20261013_AMAVIO_One_CRM_R3_9_IA_Consolidation_Working`  
**Daten:** ausschließlich synthetisch  
**Reifegrad:** Lokaler synthetischer CRM-Core-Prototyp – fachlich und technisch geprüft, nicht produktiv freigegeben

## Prüfgegenstand

- nachweisbasierte Doppelungsprüfung;
- Trennung von Growth-Arbeit und System-/Freigabesteuerung;
- korrekte Seitenidentität und Navigation;
- Erhalt der CRM-Kernfunktionen;
- lokale Persistenz und Reset;
- responsive, Tastatur-, Zoom- und Browserprüfung;
- unveränderte Produktiv- und Integrationssperren.

## Automatisierte Prüfungen

| Prüfung | Soll | Ergebnis |
|---|---:|---|
| Build | ohne Fehler | **bestanden – 1.603 Module** |
| statisches QA-Gate | vollständig grün | **bestanden** |
| Unit-Tests | vollständig grün | **31/31 bestanden** |
| Vertragstests | vollständig grün | **11/11 bestanden** |
| Komponententests | einschließlich R3.9-Trennung grün | **10/10 bestanden** |
| Integrationstests | vollständig grün | **5/5 bestanden** |
| Persistenztests | vollständig grün | **1/1 bestanden** |
| End-to-End | Kernabläufe und neue Navigation grün | **20 zusammenhängende Kernabläufe bestanden** |
| Browser-QA | 1600/1280/1024/768/430/390, Tastatur, 200 % | **bestanden** |
| Browserkonsole | keine Fehler | **bestanden – 0 Fehler** |

## Fachliche Negativprüfungen

- kein „Daten & Sicherung“-Unterregister in „Research & Outreach“;
- keine Growth-Navigation auf der Seite „System & Freigaben“;
- kein Verlust von G1-Datenklassen, Recht/Quellen, Zugriff/Gerät, Lebenszyklus oder Prüfspur;
- keine Zusammenlegung von Arbeitstag, Cockpit, Pipeline oder Auswertungen;
- keine Änderung des v7-Datenvertrags;
- keine reale Datenfreigabe, Authentifizierung, Connectoraktivierung, Außenkommunikation oder Integration.

## Manuelle Sichtprüfung

- geprüfte lokale Standardadresse der R3.9-Arbeitskopie: `http://127.0.0.1:4385/`;
- Browser-QA auf lokalem Vite-Testserver: 1600×1000, 1280×900, 1024×900, 768×1024, 430×932 und 390×844;
- 200-%-Zoom: isoliertes Chromium-Profil, 1280 Pixel Außenbreite reflowt auf 640 CSS-Pixel; `bodyScrollWidth = bodyWidth = 640`;
- Tastatur: Skip-Link, `Meta/Ctrl+K`, Escape, Focus-Trap und Focus-Rückgabe bestanden;
- Screenshotordner: `QA/Screenshots/20261013-r3-9-ia-consolidation/` mit **55** lokalen Screenshots;
- strukturierter Browsernachweis: `QA/CRM_R3_9_IA_CONSOLIDATION_BROWSER_RESULT_20261013.json`;
- visuell kontrolliert: Desktop-Systemansicht, mobile Systemansicht und Desktop-Kontaktfreigabe;
- beobachteter Konsolenstatus: **0 Fehler**;
- offene visuelle oder funktionale Abweichungen aus diesem Block: **keine**.

## Testkorrektur

Der erste E2E-Durchlauf enthielt noch eine R3.8-Erwartung, die den `NO-GO`-Marker im Register „Zugriff & Gerät“ suchte. Nach der beabsichtigten R3.9-Zwecktrennung liegt dieser Marker korrekt in „Prüfspur & Beschluss“. Der Testpfad wurde an die neue Informationsarchitektur angepasst und anschließend vollständig grün wiederholt. Der erste Browserstart innerhalb der eingeschränkten Sandbox war durch macOS-Mach-Port-Rechte blockiert; der freigegebene lokale Lauf außerhalb dieser Einschränkung bestand.

## Abschlussstatus

**BESTANDEN.** R3.9 ist als lokale synthetische Informationsarchitektur-Konsolidierung fachlich und technisch geprüft. Diese Aussage umfasst keine Produktiv-, Rechts-, Datenschutz-, Security-, Mehrbenutzer-, Connector-, Versand-, App-, ACC- oder Deploymentfreigabe.

