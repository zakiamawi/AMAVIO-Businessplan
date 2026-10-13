# G1 – verbleibende externe und technische Gates nach R3.12

> **R3.14-Fortschreibung:** `system_profiler` meldet „Allow all incoming connections“ und `socketfilterfw` State 0. Die Firewall ist daher nicht als wirksam belegt. Security-, Vertretungs-, Datenschutz-/Vertrags- und Provider-/Regionspakete sind prüfbereit, ihre tatsächlichen Nachweise aber weiterhin offen.

> **R3.13-Fortschreibung:** FileVault und die 5-Minuten-Sperre sind lokal belegt. Die Firewall wurde in der Oberfläche aktiviert, weist aber einen UI-/Legacy-CLI-Widerspruch auf. Der C1-Teilbeschluss besetzt keinen Security Reviewer und enthält keine eindeutige Provider-/Regionsfreigabe. Die nachfolgende NO-GO-Reihenfolge bleibt deshalb bestehen.

**Datum:** 13.10.2026  
**Gesamtstatus:** NO-GO

| Gate | Was R3.12 zusätzlich geklärt hat | Was noch belastbar vorliegen muss | Freigabeinstanz |
|---|---|---|---|
| G1-03 Kontakt- und Rechtsstatus | offizielle Primärquellen, Quellen-/Zweck-/Kanalstruktur, Pflichttext-, LIA- und VVT-Entwürfe sowie produktive Kontaktsperre | Rechtseinheit, fallbezogene externe Prüfung, freigegebene Pflichttexte, Kanalregel, Zustell-/Nachweisprozess | Datenschutz / Recht |
| G1-05 Lebenszyklus | Reviewintervalle und Verbot automatischer Löschung beschlossen | Aufbewahrungs- und Datenschutzvalidierung; dokumentierter Vollzugsprozess | Datenschutz / Product Owner |
| G1-06 Zugriffsschutz | sechs lokale Schutzgrenzen mit Tests; Firewall deaktiviert beobachtet; Verschlüsselung/Sperrzeit nicht verifiziert | Geräteblocker schließen, Authentifizierung, Autorisierung, Sitzungsschutz und negative Zugriffstests | Security / Technik / Product Owner |
| G1-07 Sicherung und Restore | RPO/RTO-Arbeitsziele, Rhythmus und Hauptverantwortung beschlossen; isolierte synthetische Probe belegt | Verschlüsselung, Speicherort, Vertretung und beobachteter Restore in der freigegebenen Zielumgebung | Betrieb / Security |
| G1-09 Vorfall und Rückabwicklung | Erstablauf, Hauptkoordination und zeitlich gestufter lokaler Runbook-Entwurf | Vertretung, Erreichbarkeit, externer Eskalationsweg sowie rechtliche Meldepflichten und Fristen | Betrieb / Datenschutz / Recht |
| G1-10 Gesamtfreigabe | konsolidiertes R3.12-Entscheidungspaket mit NO-GO-Empfehlung | kumulativ geschlossene Pflichtgates, datierter enger PO-Beschluss, Rückfallregel | Product Owner |

## Reihenfolge

1. G1-03 fachlich und rechtlich schließen.
2. Sichere C1-/Zugriffsgrundlage für G1-06 separat beschließen und negativ testen.
3. Externe Geräte-, Verschlüsselungs-, Restore-, Vertretungs- und Incident-Evidenz beibringen.
4. Alle Nachweise gegeneinander prüfen und Restrestrisiken dokumentieren.
5. Erst danach G1-10 als engen Einzelbeschluss vorlegen.

Kein Einzelnachweis und keiner der vier Arbeitsbeschlüsse erlaubt allein Echtdatennutzung. Bis G1-10 bleiben `realDataEnabled=false`, `outboundEnabled=false` und `releaseEligible=false`.
