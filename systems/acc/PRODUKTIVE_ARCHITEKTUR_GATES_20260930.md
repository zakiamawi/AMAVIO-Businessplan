# Entscheidungsgates vor produktiver ACC-Architektur

**Stand:** 30.09.2026  
**Status:** Entscheidungsrahmen; keine produktive Architektur, keine Anbieterwahl, keine Beschaffung und keine Implementierungsfreigabe

## Grundsatz

Die lokale Konzeptdemo validiert Gesprächslogik und Benutzerführung. Sie liefert keinen Nachweis für Datenschutz, Security, Hosting, Verträge, Datenqualität, Authentifizierung, Mandantentrennung oder Betrieb. Ein produktives MVP beginnt erst, wenn die folgenden Gates einzeln entschieden und dokumentiert sind.

## Gate A – Betriebs- und Verantwortungsmodell

**Zu entscheiden:** Welche Aufgaben übernimmt AMAVIO operativ, welche der Arbeitgeber und welche externe Fachstellen oder Partner?  
**Mindestnachweis:** Prozesslandkarte, RACI, Eskalationsweg, Freigabeschwellen, Servicezeiten und ausgeschlossene Leistungen.  
**Exit-Kriterium:** Jede produktive Aktion besitzt eine verantwortliche Rolle, einen Auslöser, einen Rückfallweg und eine dokumentierte Außenwirkung.

## Gate B – Datenschutz und Datenminimierung

**Zu entscheiden:** Zwecke, Rechtsgrundlagen, Rollen Verantwortlicher/Auftragsverarbeiter, Kategorien betroffener Personen, erlaubte Datenfelder, Löschfristen und Betroffenenrechte.  
**Mindestnachweis:** Verzeichnis der Verarbeitungstätigkeiten, Datenfluss, Löschkonzept, AVV-/Unterauftragnehmerprüfung, Datenschutzinformation und gegebenenfalls DSFA-Vorprüfung.  
**Exit-Kriterium:** Kein Datenfeld und keine Integration ohne dokumentierten Zweck, Rechtsgrundlage, Zugriff und Löschregel.

## Gate C – Security

**Zu entscheiden:** Schutzbedarf, Verschlüsselung, Geheimnisverwaltung, Protokollierung, Backup, Wiederherstellung, Schwachstellenmanagement und Incident Response.  
**Mindestnachweis:** Threat Model, Security-Baseline, Rollen-/Rechteprüfung, Backup-/Restore-Test, Logging- und Incident-Prozess.  
**Exit-Kriterium:** Kritische Risiken sind behandelt oder ausdrücklich mit Verantwortlichem und Frist akzeptiert.

## Gate D – Authentifizierung und Autorisierung

**Zu entscheiden:** Identitätsanbieter, MFA, Einladungsprozess, Rollenmodell, Berechtigungsprüfung, Sessionverwaltung und Offboarding.  
**Mindestnachweis:** Rollen-/Rechtematrix, Testfälle für unzulässige Zugriffe, Joiner-Mover-Leaver-Prozess und Audit-Logik.  
**Exit-Kriterium:** Die im UI gezeigten Rollen werden serverseitig erzwungen; UI-Ausblendung allein gilt nicht als Zugriffsschutz.

## Gate E – Mandantentrennung

**Zu entscheiden:** technische Mandanten-ID, Datenzugriffsregeln, interne AMAVIO-Sicht, Supportzugriff und Export-/Löschgrenzen.  
**Mindestnachweis:** Datenmodell, Row-/Tenant-Isolation, automatisierte Negativtests, Admin-Zugriffskontrolle und Protokollierung.  
**Exit-Kriterium:** Ein Arbeitgeber kann weder direkt noch indirekt Daten eines anderen Mandanten erkennen oder beeinflussen.

## Gate F – Hosting und Betrieb

**Zu entscheiden:** Region, Anbieter, Verfügbarkeit, Skalierung, Monitoring, Backups, Wiederanlauf, Support, Kosten und Exit-Strategie.  
**Mindestnachweis:** Architekturdiagramm, DPA/Unterauftragnehmerliste, Betriebs- und Kostenmodell, RTO/RPO, Status-/Alarmierungspfad und Exit-/Datenexportplan.  
**Exit-Kriterium:** Hosting, Betrieb und Support sind finanziell sowie organisatorisch tragbar und vertraglich überprüft.

## Gate G – Vertragsmodell und Produktgrenzen

**Zu entscheiden:** Leistungsbeschreibung, SaaS-/Service-Anteile, Freigabewirkung, Fremdkosten, Haftungsgrenzen, Support, Verfügbarkeit, Datenrückgabe und Beendigung.  
**Mindestnachweis:** juristisch geprüfte Vertrags- und Datenschutzunterlagen, klare Produkt-/Servicegrenze und dokumentierte Nichtleistungen.  
**Exit-Kriterium:** Kein Interface-Text verspricht mehr als Vertrag, Betrieb und Prozess tatsächlich leisten.

## Gate H – Datenquellen und Integrationen

**Zu entscheiden:** manuelle Erfassung oder angebundene Systeme, Datenverantwortung, Synchronisationsrichtung, Fehlerbehandlung und minimale Signaltypen zwischen App und ACC.  
**Mindestnachweis:** Integrationsinventar, Datenvertrag je Schnittstelle, Testdaten, Fehler-/Retry-Konzept und Verantwortlichkeit für Datenqualität.  
**Exit-Kriterium:** Jede Schnittstelle kann kontrolliert deaktiviert, überwacht und nachvollzogen werden; sensible Freitexte werden vermieden.

## Gate I – Produktivfreigabe und Betriebskontrolle

**Zu entscheiden:** Pilotumfang, Nutzerzahl, Freigabeverantwortliche, Supportkanal, Messgrößen, Abbruchkriterien und Rollback.  
**Mindestnachweis:** Release-Checkliste, Abnahmeprotokoll, Testmatrix, Schulung, Support-/Incidentplan, Pilotvertrag und benannter Rollback-Verantwortlicher.  
**Exit-Kriterium:** Founder, Legal/Datenschutz, Security/Technik und Pilotkunde haben ihren jeweiligen Bereich ausdrücklich freigegeben.

## Reihenfolge

1. Arbeitgeberproblem und operativen Scope mit synthetischer Validierung schärfen.
2. Datenminimierung, Rollen und Vertragswirkung festlegen.
3. Architektur- und Anbieteroptionen erst danach vergleichen.
4. Produktives MVP als getrenntes Projekt mit eigenem Source-of-Truth, Budget, Backlog und QA aufsetzen.
5. Echte Daten erst nach bestandenen Daten-, Security-, Vertrags- und Betriebsgates verwenden.

Bis dahin bleibt `index.html` eine lokale Konzeptdemo. Eine technische Erweiterung dieser statischen Datei ist kein Ersatz für die hier aufgeführten Entscheidungen.
