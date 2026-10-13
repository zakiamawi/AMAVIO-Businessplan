# R3.6 Workspace Purpose & Usability Matrix

**Prüfdatum:** 13.10.2026  
**Prüfumfang:** alle sichtbaren Navigationsbereiche des lokalen synthetischen CRM

| Bereich | Eindeutiger Zweck | Nutzbare Kernhandlungen | Status R3.6 | Bewusst nicht enthalten |
|---|---|---|---|---|
| Mein Arbeitstag | tägliche Priorisierung und Abarbeitung | Chance öffnen, Aufgabe abschließen, Aufgabe/Termin/Wiedervorlage öffnen, zu Aufgaben oder Arbeitsjournal springen | belastbar implementiert | strategische Pipeline-Analyse, technische Gates |
| Cockpit | strategische Vertriebs- und Beziehungssteuerung | aggregierte Lage lesen, Detail-Pipeline öffnen, Analysen öffnen, Managementchance öffnen | belastbar implementiert | Aufgabenliste, Tagesagenda, Outreach-Preflight, Pipeline-Bearbeitung |
| Pipeline | operative Chancensteuerung | suchen, nach Phase und Verantwortlichem filtern, archivierte anzeigen, Chance anlegen und öffnen, Board und Liste nutzen | belastbar implementiert | Forecast-Automation, externe Synchronisation |
| Organisationen | Account-Stammdaten und Beziehungen | suchen, anlegen, öffnen, bearbeiten, archivieren, wiederherstellen; Kontakte und Chancen nachvollziehen | belastbar implementiert | reale Firmendatenanreicherung |
| Kontakte | Kontaktrollen und Kontaktstatus | suchen, anlegen, öffnen, bearbeiten, archivieren, Sperr- und Herkunftsstatus prüfen | belastbar implementiert | produktiver Kontakt, E-Mail- oder Kalenderaktion |
| Research & Outreach | Zielkundensignale und Entwürfe kontrolliert vorbereiten | Zielsegment/Recherche/Entwurf anlegen, Quelle prüfen, Recherche zum Lead übernehmen, Kontakt sperren, Entwurf lokal freigeben | teilweise implementiert | Live-Recherche, produktiver Versand, Providerzugriff |
| Kontaktfreigabe (Unterbereich Research & Outreach) | Kontaktgrundlage und Preflight operativ klären | Kontaktentscheidung lesen, Kontaktdetails öffnen, Nachweise prüfen, offenen Prüfpunkt dedupliziert als Aufgabe anlegen | belastbar implementiert – lokal/synthetisch | Rechtsfreigabe, Providerprüfung und Versand |
| Leads | ungeprüfte oder qualifizierte Signale vor der Pipeline | suchen, filtern, anlegen, öffnen, bearbeiten, archivieren, qualifizierten Lead konvertieren | belastbar implementiert | automatischer Import oder Scoring durch externe KI |
| Partner | Partnerbeziehungen getrennt von Arbeitgeber-Accounts | suchen, anlegen, öffnen, bearbeiten, archivieren, Partnerkontakt zuordnen | belastbar implementiert | Partnerportal, Kooperations- oder Leistungszusage |
| Aufgaben | verantwortete nächste Handlungen | suchen, filtern, anlegen, öffnen, bearbeiten, abschließen, wieder öffnen, archivieren | belastbar implementiert | externe Erinnerungs- oder Kalenderautomation |
| Arbeitsjournal | Notizen, Gespräche, Termine, Wiedervorlagen, Angebote, Entscheidungen und Dokumentreferenzen | nach Typ navigieren, anlegen, öffnen, bearbeiten, archivieren; Aging-Regeln pflegen | belastbar implementiert | Dateiablage, Kalendersynchronisierung, Angebotsversand |
| Auswertungen | Entwicklung und Verteilung aus CRM-Fakten verstehen | Zeitraum wechseln, Diagramme lesen, interne Analyse und bereinigte Berichtsansicht wechseln, Chance/Pipeline öffnen | belastbar implementiert | Prognosemodell, automatischer Export, externer Versand |
| Daten & Sicherung | Persistenz, Sicherung, Importkontrolle und G1-Readiness | Sicherung erstellen/wiederherstellen, JSON exportieren, synthetischen Import prüfen, G1-Gates lesen | teilweise implementiert | Echtdatenaktivierung, Cloud-Backup, Authentifizierung |

## Antwort auf die Frage „Ist jeder Space vollständig nutzbar?“

Jeder Space besitzt nun einen abgegrenzten Zweck und mindestens einen zusammenhängenden nutzbaren Pfad. „Vollständig“ gilt jedoch nur innerhalb des lokalen synthetischen Reifegrads. Funktionen mit Außenwirkung, realen Daten, Identität, Cloud, Mehrbenutzerbetrieb oder Drittanbietern sind nicht enthalten und werden nicht als nutzbar ausgewiesen.

## Festgestellte Restlücken

1. Research & Outreach bleibt eine sichere Vorbereitungsfläche; produktive Recherche und Versand sind gesperrt.
2. Daten & Sicherung ist lokal nutzbar; Geräteverschlüsselung, Benutzeridentität, Zugriffsschutz und belastbarer Incident-Prozess sind nicht technisch erzwungen.
3. Auswertungen zeigen den aktuellen Datenstand und dokumentierte Aktivität; belastbare historische Trenddaten entstehen erst durch längere reale Nutzung nach späterer Freigabe.
4. Die Berichtsansicht ist eine bereinigte Bildschirmansicht, kein freigegebener Exportprozess.

