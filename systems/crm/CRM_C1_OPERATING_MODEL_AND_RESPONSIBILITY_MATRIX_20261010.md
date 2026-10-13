# AMAVIO One CRM – C1 Betriebsmodell und Verantwortungsmatrix

**Stand:** 10.10.2026  
**Status:** Rollen und Runbooks definiert; Personenzuordnung noch nicht vollständig bestätigt  
**Geltung:** nur nichtöffentliches C1-Staging mit synthetischen CRM-Fachdaten

## Betriebsgrundsatz

C1 ist kein Produktivbetrieb und kein dauerhaftes CRM-Hosting. Die Anwendung und AMAVIO-API bleiben lokal. Extern verwaltet werden erst nach gesondertem C1-Beschluss nur das Supabase-Projekt, PostgreSQL und Auth in Frankfurt. Der lokale R3.2-Prototyp bleibt als unabhängiger Demonstrations- und Rückfallstand erhalten.

## Verantwortungsrollen

| Rolle | Kernverantwortung | Muss vor C1 namentlich bestätigt sein |
|---|---|---|
| Product Owner | Scope, Budget, Risikoannahme, Stop-/Fortführungsentscheidung | ja |
| Technical Operator | Providerorganisation, Projekt, Region, Auth, MFA, Secrets, Migrationen, Monitoring, Backup/Restore | ja |
| Security Reviewer | Threat Model, Autorisierungs-/RLS-Tests, Secret-/Logprüfung, Abweichungen | ja; darf bei kritischer Abnahme nicht allein identisch mit Implementierung sein |
| Privacy/Contract Reviewer | DPA/TIA/Subprozessoren, Provider-Verwaltungsdaten, Aufbewahrung/Exit | ja, qualifizierte Prüfung |
| QA Owner | Testevidenz, Browser/Console, Regression, Releaseprotokoll | ja; kann im C1-Staging mit Security Reviewer kombiniert werden, wenn dokumentiert |

## RACI-Matrix

Legende: **A** = accountable, **R** = ausführend, **C** = zu konsultieren, **I** = zu informieren.

| Vorgang | Product Owner | Technical Operator | Security Reviewer | Privacy/Contract | QA Owner |
|---|---:|---:|---:|---:|---:|
| C1-Freigabe | A | C | C | C | I |
| Provider-/Tarifwahl | A | R | C | C | I |
| DPA/TIA/Subprozessoren | I | C | C | A/R | I |
| Projekt/Region anlegen | I | A/R | C | I | I |
| Rollen/RLS/Migrationen | I | A/R | C | I | C |
| Secrets und Rotation | I | A/R | C | I | I |
| Testnutzer/MFA | I | A/R | C | C | C |
| Restore-Test | I | A/R | C | I | C |
| Incident Triage | A | R | C | C | I |
| destruktive Adminaktion | A | R | C/zweite Freigabe | I | I |
| C1-Abnahme | A | R | C | C | R |
| Exit/Projektlöschung | A | R | C | C | I |

## Minimales Betriebsverfahren

### Täglich während aktiver C1-Arbeit

- nur bekannte Testidentitäten und erwartete Sessions;
- Fehlerrate, Auth-Anomalien und Kosten-/Usageanzeige prüfen;
- keine realen CRM-Daten und keine aktivierten Zusatzdienste;
- kritische Abweichungen sofort dokumentieren und C1 stoppen.

### Wöchentlich

- Nutzer-/Rolleninventar und MFA-Status;
- offene Providerwarnungen und Security-Advisor;
- Migrationen gegen dokumentierten Stand;
- Backupverfügbarkeit;
- Providerstatus und Kostenentwicklung;
- keine Geheimnisse in Repository, Build oder Logs.

### Bei Änderung

- Vorher-Zustand sichern und Migrations-/Rollbackpfad dokumentieren.
- Vier-Augen-Freigabe für Rollenmodell, RLS, Secrets, Region, Tarif/Add-ons und Löschung.
- Negativtests erneut ausführen.
- Abweichung, Verantwortlichen und Ergebnis im C1-QA-Protokoll festhalten.

## Incident-Klassen

| Klasse | Beispiel | Reaktion |
|---|---|---|
| S0 Scope-Verstoß | reale CRM-Daten, ACC/App-Verbindung, öffentlicher Endpoint | sofort stoppen, Zugriff sperren, sichern, bewerten, Product Owner informieren |
| S1 Security kritisch | Secret offengelegt, unerlaubter privilegierter Zugriff, RLS-Bypass | sofort stoppen, Sessions/Keys widerrufen, Beweise sichern, Incidentprozess starten |
| S2 Integrität/Verlust | Migration oder Restore fehlerhaft | Schreibzugriff stoppen, letzten belastbaren Stand bestimmen, Restore/Neuaufbau entscheiden |
| S3 Betrieb/Kosten | Ausfall, Quote, Kostenanstieg, Zusatzdienst aktiv | Ursache begrenzen, nicht benötigte Funktion deaktivieren, Budget-/Fortführungsentscheidung |
| S4 normale Abweichung | nichtkritischer Testfehler oder UX-Problem | im QA-Protokoll erfassen und kontrolliert beheben |

## Recovery- und Admin-Vier-Augen-Prinzip

Folgende Aktionen benötigen eine zweite bestätigende Person:

- Admin-/Owner-Wechsel und Recovery;
- MFA-Reset oder Faktorentfernung für privilegierte Konten;
- Service-Key-/Datenbankpasswortrotation;
- RLS-Deaktivierung oder privilegierte Rollenänderung;
- Tarif-/Add-on-Wechsel;
- Projekttransfer oder Projektlöschung;
- Restore, wenn der aktuelle Stand überschrieben werden könnte.

Ist für das kleine synthetische Staging noch keine zweite geeignete Person verfügbar, darf dieser Mangel nicht stillschweigend umgangen werden. Der Product Owner kann vor C1 höchstens eine zeitlich befristete Ausnahme ausschließlich für synthetische Daten dokumentieren; Produktivbetrieb, reale Daten und produktive Identitäten bleiben dann erst recht gesperrt.

## Offene Personenzuordnung

| Rolle | Name/Bestätigung | Status |
|---|---|---|
| Product Owner | Zaki Amawi; C1 selbst noch nicht freigegeben | Rolle bestätigt, C1-Beschluss offen |
| Technical Operator | Zaki Amawi | durch PO-CRM-045 bestätigt |
| Security Reviewer / zweite Freigabe | nicht benannt | **BLOCKER** |
| Vertretung Betrieb | Van Vardanian | benannt; Annahme und Übergabe offen |
| Privacy/Contract Owner intern | Zaki Amawi / Gründer | bestätigt; externe Fachprüfung bleibt Blocker |
| Privacy/Contract Reviewer extern | nicht benannt bzw. Mandat nicht belegt | **BLOCKER** |
| QA Owner | in C1-Beschluss zu benennen | offen |

## Keine Betriebsbehauptung

Dieses Dokument belegt nur ein vorbereitetes Betriebsmodell. Es belegt weder 24/7-Betrieb noch Monitoring, Incidentbereitschaft, Restorefähigkeit, Sicherheitsprüfung oder Mehrbenutzerbetrieb.

