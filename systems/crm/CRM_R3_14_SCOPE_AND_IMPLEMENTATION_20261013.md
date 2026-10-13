# AMAVIO One CRM – R3.14 C1 External Review Readiness

**Datum:** 13.10.2026  
**Ausgangsstand:** R3.13 C1 Decision Closure  
**Status:** lokale Prüf- und Entscheidungsunterlagen vollständig vorbereitet; kein C1-Go

## Ziel

R3.14 schließt keine fremde Entscheidung stellvertretend. Der Block überführt die offenen C1-Gates in vier klar abnehmbare Pakete: unabhängiges Security Review, Vertretungsannahme und Betriebsübergabe, externe Datenschutz-/Vertragsprüfung sowie eindeutige Provider-/Regionsentscheidung. Die Ergebnisse werden im lokalen synthetischen Governance-Vertrag sichtbar, ohne Provider, Kauf, Login, Cloud, reale Daten oder Außenwirkung zu aktivieren.

## Erhalten

- sämtliche CRM-Core-Funktionen, Layouts, Markenmittel und synthetischen Beispieldaten;
- Schema v7, lokale SQLite-Persistenz, Reset, Backup/Restore und historische Speicherstände;
- Produktgrenzen zwischen CRM, App und ACC;
- PO-CRM-045 mit Betreiber, benannter Vertretung, Budgetrahmen und Synthetic-only;
- `realDataEnabled=false`, `outboundEnabled=false`, `c1ImplementationAuthorized=false`.

## Neu beziehungsweise geschärft

- Firewall-Nachweis mit `system_profiler` und `socketfilterfw` erneut erhoben und konservativ als Geräteblocker bewertet;
- Security-Review-Brief mit Prüfumfang, Negativtests, Severity und Abnahmekriterien;
- unterschriftsreifes Vertretungs- und Übergabeprotokoll ohne vorweggenommene Annahme;
- externes Datenschutz-/Vertragsbriefing mit Provider-, Transfer-, Lösch- und Verwaltungsdatenfragen;
- eindeutiger Provider-/Regionsbeschluss mit getrennten Optionen `freigegeben` und `nicht freigegeben`;
- konsolidiertes C1-Gate-Closure-Register;
- sichtbarer UI-Hinweis, dass Unterlagen vorbereitet, aber Entscheidungen und Fremdprüfungen offen sind;
- lokaler Health-Nachweis für vorbereitete Reviewpakete und unveränderte Implementierungssperre.

## Nicht ausgeführt

- kein Supabase-Login, keine Organisation, kein Projekt und keine Region angelegt;
- kein Tarif, keine Zahlungsart und kein Add-on gewählt;
- keine Zugangsdaten, Secrets, MFA-Faktoren oder Auth-Artefakte gelesen oder geschrieben;
- keine reale Person als CRM-Datensatz, kein Import und kein Versand;
- keine externe Nachricht, Einladung oder Beauftragung versendet;
- keine App-/ACC-Anbindung, Veröffentlichung, Deployment oder Git-Übertragung.

## Abschlussbedingung dieses Blocks

R3.14 ist abgeschlossen, wenn alle vier Pakete konsistent, lokal testbar und im UI wahrheitsgemäß abgebildet sind. Die tatsächliche Annahme durch Van Vardanian, die Benennung eines unabhängigen Security Reviewers, die externe Fachprüfung und die Providerentscheidung bleiben menschliche beziehungsweise externe Gates. Erst danach darf ein enger C1-Beschluss erneut vorgelegt werden.
