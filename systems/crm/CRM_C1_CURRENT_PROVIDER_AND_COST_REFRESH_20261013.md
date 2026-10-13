# C1 – Aktueller Provider- und Kostenrahmen

**Stand:** 13.10.2026  
**Status:** Read-only Entscheidungsgrundlage; kein Anbieterzugang und kein Kauf

## Vorgesehener enger C1-Rahmen

Ein später separat freigegebener C1-Block darf nur eine sichere Plattformgrundlage für synthetische Daten aufbauen: ein Supabase-Projekt in der explizit gewählten Region Frankfurt (`eu-central-1`), Postgres und Auth, Einladungs-/Admin-Testidentitäten, TOTP-MFA/AAL2, serverseitige Autorisierung und RLS. Storage, Realtime, Edge Functions, Webhooks, Social Login, E-Mail-/Kalenderconnectoren und reale Daten bleiben ausgeschlossen.

## Aktuelle offizielle Providerinformationen

- Regionen: Supabase führt Frankfurt als spezifische Region `eu-central-1`. Die Wahl des Speicherorts allein belegt keine rechtliche oder organisatorische Compliance. Quelle: https://supabase.com/docs/guides/platform/regions
- Auth/MFA: Supabase dokumentiert TOTP-MFA und die Assurance Levels `aal1`/`aal2`; eine UI-Sperre allein reicht nicht, die Durchsetzung muss auch in API/Datenbank erfolgen. Quelle: https://supabase.com/docs/guides/auth/auth-mfa
- RLS: Row Level Security ist für exponierte Tabellen zentral; service-/bypass-Rollen und Security-Definer-Pfade benötigen besondere Kontrolle. Quelle: https://supabase.com/docs/guides/database/postgres/row-level-security
- Preisrahmen: Der Pro-Plan wird aktuell ab 25 US-Dollar pro Monat ausgewiesen. Steuern, Wechselkurs, Zusatzverbrauch und optionale Funktionen sind vor Kauf zu klären. Quelle: https://supabase.com/pricing
- Sicherungen: Offizielle Unterlagen beschreiben tägliche Sicherungen im Pro-Plan mit begrenzter Aufbewahrung sowie zusätzliche kostenpflichtige PITR-Optionen. Projektlöschung und Restore-Verhalten müssen betrieblich verstanden werden; eine providerinterne Sicherung ersetzt nicht automatisch einen portablen Offsite-Nachweis. Quelle: https://supabase.com/docs/guides/platform/backups

## Tool-/Connectorstatus

Eine Supabase-Fähigkeit ist in der Arbeitsumgebung als mögliches Tool-/Pluginpaket sichtbar, wurde für dieses Projekt aber nicht authentifiziert und nicht smoke-getestet. Es wurde kein Login, kein Projekt, kein API-Schlüssel, keine Organisation und keine kostenpflichtige Ressource angelegt.

## Kostenentscheidung

PO-CRM-045 ersetzt den früheren 40-EUR-Vorschlag: Der Planungsrahmen beträgt 50–100 EUR brutto pro Monat, die harte Planungsobergrenze 100 EUR. Diese Entscheidung ist weiterhin keine Kaufberechtigung. Die aktuelle öffentliche Preisbasis nennt 25 USD/Monat für Pro und einen 10-USD-Compute-Credit für ein Micro-Projekt. Der Spend Cap schützt nicht jede Position; insbesondere Compute, PITR, Custom Domain und weitere bewusst gewählte Add-ons benötigen eigene Kontrolle. Vor Kauf bleiben Zahlungsverantwortung, aktuelle Steuer-/Währungsprüfung, Alarmgrenze, Stop-Regel und ausdrückliche Beschaffungserlaubnis zu dokumentieren.

## Datenschutz-/Vertragsgate

Vor Anbieteranlage müssen tatsächliche Vertragspartner, DPA/AVV, Subprozessoren, Region, Transfermechanismen, Aufbewahrung, Löschung, Supportzugriffe und Administrationsdaten geprüft werden. Diese Prüfung ist nicht durch technische Dokumentation ersetzt.

## Entscheidung

C1 bleibt `not_authorized`. Die Provider-/Regionsauswahl erfolgt ausschließlich über `CRM_C1_PROVIDER_REGION_DECISION_BRIEF_20261013.md`; dieses Dokument ist keine Provider-, Kauf- oder Produktionsfreigabe.
