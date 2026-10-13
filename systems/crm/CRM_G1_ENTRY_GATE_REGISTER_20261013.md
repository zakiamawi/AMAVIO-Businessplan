# G1 Entry Gate Register – nach lokalem Closure-Paket

**Datum:** 13.10.2026  
**Gesamtstatus:** NO-GO – reale Daten bleiben deaktiviert

| Gate | Nachweisstand 13.10.2026 | Noch erforderlich | Status |
|---|---|---|---|
| G1-01 Datenumfang und Zweck | Zweck-/Umfangsmatrix, sechs Datenklassen, Ausschlussliste und PO-CRM-043 vorgelegt | Quellen-/Kanalprüfung bei produktiver Nutzung | **lokal PO-beschlossen; keine Produktivfreigabe** |
| G1-02 Datenklassifikation | Schutzbedarf, erlaubte und ausgeschlossene Inhalte maschinenlesbar und in UI | Pflegeprozess bei Felderweiterung | **lokal belegt** |
| G1-03 Kontakt- und Rechtsstatus | sieben Quellen-/Zweck-/Kanalpfade, vier Informationspflicht-Bausteine, offizielles Quellendossier, Pflichttext-, LIA- und VVT-Entwürfe | bestätigte Rechtseinheit, fallbezogene externe Rechtsprüfung, freigegebene Pflichttexte und Zustellnachweis | **extern gesperrt** |
| G1-04 Herkunft und Nachweis | Quelle, Datum und Qualität im synthetischen Bestand vollständig geprüft | Standard für reale Evidenzstichprobe | **lokal belegt** |
| G1-05 Lebenszyklus | Reviewintervalle, Betroffenenrechte, synthetischer Trockenlauf und Verbot automatischer Löschung beschlossen | Datenschutzvalidierung und realer Vollzug | **lokal PO-beschlossen; externer Abgleich offen** |
| G1-06 Zugriffsschutz | acht lokale Schutzgrenzen einschließlich FileVault- und 5-Minuten-Sperrnachweis; Firewall UI aktiv, Legacy-CLI widerspricht | Firewall-Widerspruch klären, verschlüsselte Sicherung belegen sowie Authentifizierung, Autorisierung und Sitzungsschutz umsetzen/negativ testen | **technisch gesperrt** |
| G1-07 Sicherung und Wiederherstellung | lokale SQLite-Snapshots, isolierte Probe sowie RPO 24 h, RTO 4 h, täglicher Rhythmus und Hauptverantwortung beschlossen | Verschlüsselung, Speicherort, Vertretung und beobachteter Restore in der später freigegebenen Betriebsumgebung | **lokal PO-beschlossen; Betriebsevidenz offen** |
| G1-08 Import und Bereinigung | Mapping-/Dubletten-/Quarantäne-/Rollbackvertrag synthetisch geprüft | freigegebene reale Quelle und produktiver Importbeschluss | **lokal belegt** |
| G1-09 Vorfall und Rückabwicklung | Erstablauf, Hauptkoordination und synthetischer Trockenlauf beschlossen | Vertretung, Erreichbarkeit, Meldeweg, Rechtsfristen und realer Wiederanlauf | **lokal PO-beschlossen; externe Fristen offen** |
| G1-10 Releaseentscheidung | R3.12-Entscheidungspaket konsolidiert; Empfehlung NO-GO | erst nach G1-03/06 und externer Betriebsevidenz ausdrücklicher datierter Product-Owner-Entscheid | **PO-gesperrt** |

## Blockierende Reihenfolge

1. Datenschutz/Recht prüft G1-03 und die realen Vollzugsanteile von G1-05.
2. G1-06 wird in einer gesondert freigegebenen sicheren Betriebsgrundlage technisch umgesetzt und negativ getestet.
3. Geräte- und Sicherungsverschlüsselung, Speicherort, Vertretung, Meldeweg und beobachteter Restore werden real nachgewiesen.
4. Erst danach wird G1-10 als enger Einzelbeschluss vorgelegt.

Kein einzelnes geschlossenes Gate und keiner der vier lokalen Arbeitsbeschlüsse erlaubt Echtdatenbetrieb. „Lokal belegt“ und „PO-beschlossen“ sind keine Produktivfreigabe. Die Freigabe ist kumulativ; `realDataEnabled`, `outboundEnabled` und `releaseEligible` bleiben `false`.

