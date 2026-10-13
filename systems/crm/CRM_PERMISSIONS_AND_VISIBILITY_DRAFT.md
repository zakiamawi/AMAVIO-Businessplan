# AMAVIO One CRM – Berechtigungen und Sichtbarkeit

## R3.12-Ergänzung – lokale Schutzgrenze

Die lokalen Dateirechte (`0700`/`0600`), Same-Origin-Prüfung und Browser-Schutzheader reduzieren die Exposition des synthetischen Einzelplatzsystems. Sie sind keine Benutzerberechtigung. Solange Authentifizierung, MFA/AAL2, serverseitige Autorisierung, RLS und Sitzungsgrenzen nicht umgesetzt und negativ getestet sind, gilt weiterhin: keine realen Daten und kein produktiver Zugriff. Die read-only beobachtete deaktivierte macOS-Firewall ist ein eigener Geräteblocker.

**Version:** Fachvertrag 1.0 · Product-Owner-Beschluss vom 09.10.2026  
**Status:** Rollen- und Sichtbarkeitsziel fachlich beschlossen; Authentifizierung, Security-Architektur und technische Durchsetzung vollständig gesperrt  
**Arbeitsbereich:** erster Zielrahmen ist ein interner AMAVIO-Single-Workspace; keine Mandantenfähigkeit und keine externen Zugänge

> **C0-Fortschreibung 10.10.2026:** Das spätere Zugriffsmuster ist fachlich entschieden: interne Einladung, verpflichtende TOTP-MFA, serverseitige Rollen-/Objektprüfung und restriktive RLS als zusätzliche Schutzschicht. Diese Regeln sind in R3.2 nicht technisch aktiv und dürfen erst nach C1-Freigabe umgesetzt werden.

> **C1-Entry-Gate-Fortschreibung 10.10.2026:** Die erlaubten und verbotenen Rollen-/Objektaktionen, AAL2-Pflicht und negativen API-/RLS-Tests sind nun in `CRM_C1_AUTHORIZATION_AND_RLS_TEST_MATRIX_20261010.md` spezifiziert. Das schließt den Testvertrag, nicht die technische Durchsetzung. Ein einziger erfolgreich ausgeführter Verbotsfall würde die spätere C1-Abnahme stoppen.

| Rolle | Lesen | Bearbeiten | Archivieren | Export/Integration |
|---|---|---|---|---|
| CRM Admin | alle CRM-Core-Objekte | alle Core-Objekte | ja | nur nach separatem Gate |
| Commercial Owner | eigene/zugewiesene Accounts und Chancen | eigene/zugewiesene Datensätze | eingeschränkt | nein |
| Commercial Editor | freigegebene Accounts, Kontakte, Chancen, Aufgaben | freigegebene Datensätze | nein | nein |
| Operations Viewer | gewonnene und freigegebene Übergabekontexte | nein | nein | nein |
| Privacy Reviewer | Kontaktstatus, Herkunft, Audit-Metadaten | nur Datenschutzstatus | Sperr-/Prüfmarker | kontrollierter Auskunftsprozess, Gate |

Die fünf Rollen sind fachliche Zielrollen. Sie sind im lokalen Prototyp keine Identitäten und keine Sicherheitskontrolle. Ohne Authentifizierung, serverseitige Autorisierung und Security Review darf keine Berechtigungswirkung behauptet werden.

In der R3-Arbeitskopie sind diese fünf Rollen als deklarativer Vertrag und Teamreferenz hinterlegt. Die sichtbare Arbeitsprofilanzeige ist rein informativ; sie prüft keine Identität und beschränkt keine Aktion.

## Sichtbarkeitsklassen

- `commercial_internal`: Standard für CRM-Beziehungsdaten.
- `restricted_contact`: Kontakt- und Kommunikationsstatus.
- `handoff_review`: nur für kontrollierte ACC-Übergabeprüfung.
- `system_audit`: Audit-Metadaten.

## Beschlossene Governance-Regeln

- Partnerorganisationen und Partnerkontakte bleiben von Arbeitgeber-Accounts und normalen Kontakten getrennte Objektklassen.
- Partnerpflege ist ausschließlich für später technisch berechtigte interne AMAVIO-Rollen vorgesehen; ein Partnerlogin im CRM ist ausgeschlossen.
- Beziehungsstatus, Kommunikationsstatus und Einwilligungs-/Rechtsgrundlagenstatus werden getrennt geführt.
- `unknown` ist der Standard für nicht belegte Einwilligungs- oder Rechtsgrundlagenzustände.
- `withdrawn` und `blocked` müssen spätere externe Kontaktaktionen sperren; im lokalen Core gibt es keine solchen Aktionen.
- Export bleibt für R3 deaktiviert und darf erst nach einem separaten Export-, Datenschutz- und Security-Vertrag umgesetzt werden.
- ACC-Handoff-Sichtbarkeit ist auf den kontrollierten Review-Kontext begrenzt und begründet keine ACC-Zugriffsrechte.

## Weiterhin offene technische beziehungsweise produktive Gates

- tatsächliche Nutzerzahl und Teamstruktur für eine spätere produktive Auslegung;
- Feldrechte für Kontakt- und Datenschutzdaten;
- Vertretungs- und Freigabelogik;
- Trennung eigener und teamweiter Datensätze;
- Rollen für externe Partner – im beschlossenen Zielbild nicht vorgesehen und nicht autorisiert;
- konkrete Sessiondauer, Recovery-/Notfallzugriff und Admin-Vier-Augen-Ablauf; Plattformpräferenz und TOTP-MFA sind in C0 benannt, aber technisch nicht aktiviert;
- technische Single-Workspace-Architektur; Mandantenfähigkeit bleibt ausdrücklich außerhalb des Zielbilds und darf nicht behauptet werden.
- namentliche Bestätigung von Technical Operator und unabhängiger Recovery-/Security-Prüffunktion;
- Wirksamkeitsnachweis der API-/RLS-Regeln in einem erst noch gesondert freizugebenden C1.

## R3.15 – Sichtbarkeit des lokalen Echtdaten-Stagings

- Zugriff: ausschließlich lokaler Einzelplatz auf `127.0.0.1`; kein Netzwerk-, Team- oder Gastzugriff.
- UI-Rechte: lesend; Suche, Filter, Pagination und Detailansicht sind erlaubt, Bearbeiten und Löschen nicht.
- Importrecht: kontrollierter lokaler Importprozess nach Dry-Run, Quellhashprüfung, Snapshot und Transaktion.
- sensible Felder: Kontaktdaten und Provenienz sind nur innerhalb des ausdrücklich benannten Staging-Arbeitsbereichs sichtbar; sie erscheinen nicht im Cockpit, Arbeitstag, Pipeline oder in Auswertungen des synthetischen Cores.
- Resetrecht: `Demo zurücksetzen` betrifft ausschließlich den synthetischen Core; das Echtdaten-Staging bleibt unverändert.
- Außenrechte: Versand, Export, Cloud-Sync, Supabase, App, ACC und Connectoren besitzen keinen aktiven Pfad.

Mangels Authentifizierung ist diese Regel eine lokale Betriebs- und UI-Grenze, keine produktive technische Rollenabsicherung. Ein Mehrbenutzer- oder Hostingbetrieb bleibt unzulässig.
