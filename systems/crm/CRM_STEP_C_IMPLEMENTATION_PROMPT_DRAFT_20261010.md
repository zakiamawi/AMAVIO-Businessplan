# AMAVIO One CRM – Schritt-C-Implementierungsprompt

**Status:** verwendbarer Entwurf für den nächsten kontrollierten Arbeitsblock; keine automatische Gate-Freigabe

## Kopierfertiger Prompt

```text
Arbeite am AMAVIO One CRM ausschließlich im Projektordner
`/Users/zakia/Desktop/Businessplan AKTUELL/09_Unternehmenssystem/07_AMAVIO_One_CRM/`.

Der freigegebene Ausgangspunkt ist die datierte R3.1-Arbeitskopie. Sichere diesen Stand vollständig und erstelle vor jeder Änderung eine neue datierte Arbeitskopie. Überschreibe keine vorhandene Arbeits- oder Sicherungskopie.

Der Arbeitsblock heißt:

„AMAVIO One CRM – Schritt C: Secure Platform Foundation“

Ziel ist nicht, HubSpot nachzubauen. Ziel ist eine eigenständige, sichere und nachvollziehbare AMAVIO-CRM-Plattformbasis, die den bereits geprüften lokalen synthetischen Core erhält und seine Verträge serverseitig abbildet.

VERBINDLICHE PRODUKTGRENZEN

1. CRM, Arrival Control Center und AMAVIO One App bleiben getrennte Produkte und getrennte Codebasen.
2. Keine gemeinsame produktive Datenbank zwischen diesen Produkten.
3. Keine reale ACC- oder App-Integration ohne separaten versionierten Vertrag und eigene Freigabe.
4. Die bestehende AMAVIO-One-Marken-, Sprach- und Layoutlogik bleibt erhalten.
5. Keine HubSpot-Kopie, keine generische SaaS-Kartenwüste und keine ungeprüfte Funktionsausweitung.
6. Produktive Daten, Import, E-Mail/Kalender, Dokumente, KI und Deployment bleiben ausgeschaltet, sofern sie nicht im aktuellen Product-Owner-Beschluss ausdrücklich einzeln freigegeben sind.
7. Keine Secrets, Zugangsdaten, Tokens oder Auth-Artefakte lesen, kopieren, dokumentieren oder in das Repository schreiben.
8. Keine externe Übertragung, Veröffentlichung, Deployment oder Git-Push ohne ausdrückliche Freigabe.

PHASE C0 – ENTSCHEIDUNGS- UND RISIKOVERTRAG

Prüfe zuerst den aktuellen Code, die R3.1-QA, das kanonische Domänenmodell, die Status-/Übergangsverträge, die Rollenentwürfe, den Lebenszyklusentwurf und den ACC-Handoff-Vertrag.

Erstelle vor Implementierung eine Entscheidungsmatrix für:

- Datenbank-/Backend-Anbieter und EU-Region;
- Authentifizierung, MFA, Sessions und Kontowiederherstellung;
- serverseitig wirksame Rollen;
- interner Single-Workspace;
- Staging und Produktion;
- Datenklassen und zulässige Inhalte;
- Aufbewahrung, Archivierung, Sperrung und Löschung;
- Audit-Aufbewahrung und Zugriff;
- Backup, Restore, Monitoring und Incident-Prozess;
- AVV/DPA, Unterauftragsverarbeiter und TOMs;
- Kostenrahmen und Verantwortlichkeit.

Triff keine Anbieter- oder Rechtsannahme ohne Beleg. Offene Punkte bleiben BLOCKER. Beginne C1 erst nach ausdrücklichem Product-Owner-Beschluss zu diesen Punkten.

PHASE C1 – SICHERE PLATTFORMBASIS

Nach Freigabe:

- bilde die kanonischen Objekte und Beziehungen in einer versionierten Datenbankmigration ab;
- verwende unveränderliche produktive IDs, getrennt von synthetischen Seed-IDs;
- setze Authentifizierung mit MFA für privilegierte Rollen um;
- erzwinge Rollen und Sichtbarkeit serverseitig, deny by default;
- setze den internen Single-Workspace technisch durch;
- implementiere transaktionale Status- und Phasenübergänge gemäß Vertrag;
- implementiere serverseitige Validierung und Dublettenhinweise;
- implementiere reversible Archivierung und dokumentierten Löschworkflow;
- implementiere Audit-Ereignisse ohne unnötige Inhaltsduplikation;
- implementiere Staging, Healthchecks, strukturierte Fehler, Rate Limits, Monitoring sowie Backup-/Restore-Tests;
- beginne ausschließlich mit synthetischen Testdaten.

PHASE C2 BIS C7 – NUR NACH EINZELFREIGABE

C2 Import: Mapping, Dry Run, Quarantäne, Dublettenentscheidung, Fehlerprotokoll, Rollback.
C3 Dokumente: Referenz, Storage, Rollen, Aufbewahrung, Virenprüfung, Download- und Löschkontrolle.
C4 E-Mail/Kalender: explizite menschliche Aktion, Kontakt-/Einwilligungsstatus, Protokollierung, kein autonomer Versand.
C5 ACC/App: getrennte versionierte APIs, minimierter Payload, Idempotenz, Dual Approval, keine gemeinsame Datenbank.
C6 KI: klarer Zweck, Anbieter-/Modellprüfung, Datenminimierung, Human Approval, Abschaltung und Kostenlimit.
C7 Release: Security-Test, Restore-Nachweis, Incident-Prozess, Datenschutz-/Rechtsfreigabe, Betriebsverantwortung und kontrollierte Deployment-Entscheidung.

TEST- UND ABNAHMEPFLICHT

- Unit-, Vertrags-, Komponenten-, Integrations- und End-to-End-Tests;
- Datenbankmigration vorwärts und rückwärts;
- Autorisierungs- und Negativtests für jede Rolle und jedes Objekt;
- Session-, MFA-, Sperr- und Wiederherstellungstests;
- Audit-, Backup- und Restore-Nachweis;
- Accessibility, Tastatur, 200-%-Zoom und 430-/1024-/1280-/1600-px-Prüfung;
- keine Browserkonsolenfehler;
- keine realen Daten in Testartefakten, Screenshots oder Logs;
- Threat Model und Release-Checkliste aktualisieren.

ERFORDERLICHE ERGEBNISSE

- C0-Entscheidungsmatrix mit BLOCKERN;
- Zielarchitektur und Datenflussdiagramm;
- aktualisiertes kanonisches Datenmodell;
- Datenbank- und Migrationsvertrag;
- Auth-/Rollen-/Sichtbarkeitsvertrag;
- Security- und Threat-Model-Draft;
- Datenschutz-/Lebenszyklus-Draft;
- Betriebs-, Backup-, Restore- und Incident-Draft;
- Teststrategie und vollständiger QA-Bericht;
- Change Log: erhalten, geändert, neu, vorbereitet, gesperrt;
- explizite Reifegradbezeichnung.

REIFEGRAD

Ohne alle Einzelgates darf der Stand höchstens heißen:
„Internes CRM-Staging mit synthetischen Daten – technisch geprüft, nicht für reale personenbezogene Daten oder Produktivbetrieb freigegeben.“

Stoppe vor jedem neuen externen Anbieter, Connector, Upload, Login, Deployment, Versand oder realen Datensatz und hole die dafür erforderliche Freigabe ein.
```

## Verwendung

Der Prompt sollte erst nach dem Product-Owner-Beschluss zu C0/C1 verwendet werden. Für C2 bis C7 wird jeweils ein ergänzender, enger Teilauftrag empfohlen; der Gesamtprompt ist kein pauschaler Freigabeersatz.

