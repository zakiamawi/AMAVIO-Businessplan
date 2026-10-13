# AMAVIO One CRM – C1 Security- und Bedrohungsmodell

**Stand:** 10.10.2026  
**Geltung:** ausschließlich enges C1-Staging mit synthetischen CRM-Fachdaten  
**Status:** verbindliche Spezifikation für einen späteren C1-Auftrag; nicht implementiert und nicht sicherheitsgeprüft

## Schutzgegenstände

| Schutzgegenstand | Schutzbedarf in C1 | Begründung |
|---|---|---|
| synthetische CRM-Fachdaten | intern | keine realen CRM-Personen, dennoch Integrität und Vertraulichkeit für valide Tests erforderlich |
| Auth-Identitäten und MFA-Faktoren | hoch | Kompromittierung erlaubt Plattformzugriff; auch Testidentitäten sind sicherheitsrelevant |
| Service- und Datenbankgeheimnisse | sehr hoch | privilegierter Zugriff; niemals CRM-Fachobjekt, Browserinhalt oder Repositorydatei |
| Rollen-, RLS- und Migrationsdefinitionen | hoch | Fehlkonfiguration kann Schutz vollständig aushebeln |
| Audit- und Sicherheitsereignisse | hoch | Nachweis, Untersuchung und Missbrauchserkennung; Inhalte müssen minimiert bleiben |
| Backups | hoch | enthalten den vollständigen synthetischen Datenstand und Konfigurationsteile |
| Provider-Konto und Abrechnung | hoch | Kontrollfläche für Projekt, Regionen, Nutzer, Kosten und Löschung |

## Vertrauensgrenzen

```text
Lokaler Browser
  -> lokale AMAVIO API (Eingabe, Fachlogik, Rollen-/Objektprüfung)
      -> verschlüsselte Verbindung mit Zertifikatsprüfung
          -> Supabase Auth und PostgreSQL in eu-central-1

Getrennte Kontrollfläche:
benannte Administratoren -> Supabase Dashboard/Organisation/Projekt
```

Der Browser erhält keinen Service-Role-Key, kein Datenbankpasswort und keinen privilegierten Direktzugriff. Jede Fachmutation läuft über die lokale AMAVIO-API. RLS bleibt trotzdem für alle exponierten Tabellen aktiv und standardmäßig verweigernd.

## Bedrohungen und verbindliche Kontrollen

| ID | Bedrohung | Beispiel | Pflichtkontrollen | C1-Abnahmeevidenz |
|---|---|---|---|---|
| TM-01 | Identitätsvortäuschung | gestohlene Zugangsdaten oder umgangene MFA | keine Selbstregistrierung; TOTP; AAL2-Pflicht; kurze Sitzungen; Sperr-/Recovery-Verfahren | Login-, AAL1-Abweisungs-, AAL2- und Sessiontests |
| TM-02 | Rechteausweitung | Editor ändert Rollen, Audit oder fremde gesperrte Objekte | serverseitige Autorisierung je Aktion/Objekt; RLS; getrennte Adminfunktion; kein Vertrauen in UI | vollständige Negativmatrix je Rolle |
| TM-03 | Umgehung der API | direkter Schreibversuch auf kanonische Tabellen | kein privilegierter Browserkey; Tabellenrechte minimieren; RLS `deny by default`; Service-Key nur lokal/serverseitig | Direktzugriff für anon/authenticated verweigert |
| TM-04 | Datenmanipulation | ungültiger Phasenwechsel oder veränderte Objektbeziehung | Schema- und Fachvalidierung; Transaktionen; erlaubte Übergänge; Audit | Vertrags- und Rollbacktests |
| TM-05 | Injection | manipulierte Suche, Filter oder IDs | parametrisierte Abfragen; allowlist-basierte Sortierung; strukturierte Eingabevalidierung | SQL-/Filter-/ID-Negativtests |
| TM-06 | Session-/Browserangriff | XSS liest Token; CSRF löst Mutation aus | keine Geheimnisse in Local Storage; sichere, HttpOnly/SameSite-Cookies für eigene Sitzung; CSP; Output-Encoding; CSRF-Schutz | Browser- und Headerprüfung; Mutation ohne Token abgewiesen |
| TM-07 | Geheimnisoffenlegung | Key im Repository, Build, Fehlertext oder Log | Secret Store/Laufzeitvariable; Log-Redaktion; Scans; Rotation; getrennte Schlüssel je Umgebung | Repository-/Build-/Log-Scan ohne Geheimnisse |
| TM-08 | Informationsabfluss durch Logs | Notiztext, E-Mail oder Token im Audit | Ereignismetadaten statt Inhaltskopien; Feld-Allowlist; Redaktionsregeln | Audit-Snapshots und Negativtests |
| TM-09 | Fehlkonfigurierte Region/Dienste | falsche Region, Storage oder Realtime aktiv | Provisionierungscheckliste; Region exakt prüfen; Feature-Inventar; nicht benötigte Dienste deaktivieren | Konfigurationsprotokoll und Screenshots/Exports ohne Secrets |
| TM-10 | Provider-/Supportzugriff | globaler Support greift im Fall auf Projektdaten zu | Datenminimierung; nur synthetische Fachdaten; DPA/TIA-Prüfung; Supportanfragen ohne Datendump; Zugriffsvorgang protokollieren | Datenschutzfreigabe und Support-Runbook |
| TM-11 | Verlust oder Fehlmigration | fehlerhafte Migration/Restore | versionierte Migrationen; Vorher-Backup; Transaktion; Restore-Test; Exit-Dump | Migration up/down auf leerer DB; Restore-Protokoll |
| TM-12 | Kosten-/Ressourcenmissbrauch | Add-on, Projekt oder Compute versehentlich erhöht | ein Projekt; Add-ons verboten; Spend Cap; Rechnungskontrolle; keine Management-API-Automation | Monatslimit und Konfigurationsabnahme |
| TM-13 | Verfügbarkeit/Abhängigkeit | Pro-Ausfall ohne SLA | C1 ist nicht produktiv; lokale Fallback-Demo bleibt erhalten; Statusseite; kein Verfügbarkeitsversprechen | dokumentierter Offline-/Fehlerzustand |
| TM-14 | unkontrollierte Löschung | Projekt, Nutzer oder Backup gelöscht | least privilege; Vier-Augen-Prozess für destruktive Adminaktionen; Export vor Exit; Audit | Lösch- und Recovery-Trockenlauf ohne echte Löschung |
| TM-15 | Vermischung mit ACC/App | gemeinsam genutzte Keys, Tabellen oder IDs | getrennte Organisationen/Projekte/Secrets/Codebasen; keine Verbindung in C1 | statischer Scope-Scan und Architekturreview |

## Sitzungs- und Identitätsvertrag

- Anmeldung nur für vorab administrativ angelegte Testidentitäten.
- Selbstregistrierung, anonyme Anmeldung, Social/OAuth-Provider und Partnerzugang sind deaktiviert.
- TOTP-Einrichtung ist Pflicht; Fachzugriff erst mit Authenticator Assurance Level 2.
- Zielwerte: 30 Minuten Inaktivität, 8 Stunden absolute Sitzungsdauer, erneute Bestätigung für privilegierte Aktionen nach 15 Minuten.
- Admin-, Recovery- und Faktorwechsel erzeugen ein Audit-Ereignis und erfordern grundsätzlich eine zweite Freigabe.
- Kein Recovery-Geheimnis und kein QR-/TOTP-Seed wird in CRM, Ticket, Chat, Screenshot oder Repository gespeichert.
- Nach Rollenentzug, Verdacht oder Offboarding werden Sitzungen widerrufen und relevante Geheimnisse rotiert.

Die technische Umsetzbarkeit dieser Zielwerte ist in C1 gegen den gewählten Tarif und die tatsächliche Auth-Konfiguration zu prüfen. Kann ein Ziel nicht erzwungen werden, bleibt die betroffene Abnahme rot; es wird kein stiller Ersatz akzeptiert.

## Datenbank- und Verbindungshärtung

- TLS wird erzwungen; Datenbankclients verwenden Zertifikats- und Hostnamenprüfung (`verify-full`).
- Netzwerkzugriff wird auf die für C1 erforderlichen Wege begrenzt; keine dauerhafte pauschale Freigabe.
- RLS ist auf jeder fachlichen Tabelle aktiv, bevor Testdaten geschrieben werden.
- `anon` erhält keine Fachrechte. `authenticated` erhält nur explizit benötigte Leserechte; Fachmutationen laufen über die AMAVIO-API.
- Service-Role- und Datenbankzugänge sind nur lokal/serverseitig vorhanden, nie im Browserbundle.
- Schemaänderungen erfolgen nur durch versionierte Migrationen, nie als undokumentierte Dashboard-Einzeländerung.
- Security Advisor und statische Prüfungen werden vor jeder C1-Abnahme dokumentiert.

## Restrisiken und Stop-Kriterien

C1 wird gestoppt, wenn eines der folgenden Ereignisse eintritt:

- Region oder Verarbeitungsweg ist nicht nachvollziehbar;
- privilegierte Geheimnisse erscheinen im Browser, Repository, Build oder Log;
- eine Rolle kann einen ausdrücklich verbotenen Matrixfall erfolgreich ausführen;
- AAL1 genügt für CRM-Fachzugriff;
- RLS ist auf einer Fach- oder Audit-Tabelle nicht aktiv;
- Storage, Realtime, Webhooks, Edge Functions oder externe Kommunikation werden unbeabsichtigt aktiviert;
- reale CRM-Daten werden gefunden;
- kein verantwortlicher Operator oder kein Restore-Verfahren verfügbar ist;
- Kostenlimit oder Vertrags-/Datenschutzgate ist nicht bestätigt.

## Provider-Evidenz, nicht AMAVIO-Sicherheitsfreigabe

Supabase dokumentiert ein Shared-Responsibility-Modell, RLS, MFA, TLS/SSL-Härtung, tägliche Backups und Security-/Compliance-Kontrollen. Diese Provider-Aussagen ersetzen weder Implementierung noch AMAVIO-Abnahme. Maßgebliche Quellen sind im Due-Diligence-Dokument mit Abrufdatum verzeichnet.

