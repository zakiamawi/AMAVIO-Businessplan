# G1-06 – Gerätekonfiguration und Verifikation

> **R3.14-Nachprüfung:** Die zusätzliche Betriebssystemabfrage `system_profiler SPFirewallDataType` meldet `Mode: Allow all incoming connections`; `socketfilterfw` bleibt bei `State = 0`. Die Oberfläche allein belegt deshalb keine wirksame Firewall. Maßgeblich ist `QA/CRM_R3_14_FIREWALL_VERIFICATION_20261013.md`; der Status ist ein beobachteter Blocker.

**Datum:** 13.10.2026  
**Status:** lokale Teilhärtung mit offenem Firewall-Nachweiswiderspruch; keine Security-Freigabe

## Vorherzustand

Der vollständige Vorher-Nachweis steht in `QA/CRM_R3_13_LOCAL_SYSTEM_SETTINGS_PRECHANGE_20261013.md`:

- Firewall deaktiviert, CLI `State = 0`;
- kein expliziter Screensaver-Idle-Wert;
- kein expliziter `askForPassword`- oder Verzögerungswert;
- systemseitige Screen-Lock-Verzögerung bereits `immediate`.

## Ausgeführte, freigegebene Änderungen

1. `idleTime` auf 300 Sekunden gesetzt.
2. Passwortanforderung aktiviert.
3. Passwortverzögerung auf 0 Sekunden gesetzt.
4. Firewall in Systemeinstellungen → Netzwerk → Firewall aktiviert.
5. Stealth Mode nicht verändert; er bleibt aus, weil hierzu kein eigener Beschluss vorlag.

## Nachher-Nachweis

| Kontrolle | Nachweis | Status |
|---|---|---|
| Bildschirmsperre | `idleTime=300` | lokal bestätigt |
| Passwortanforderung | `askForPassword=1` | lokal bestätigt |
| Verzögerung | `askForPasswordDelay=0`; `sysadminctl` meldet immediate | lokal bestätigt |
| FileVault | Systemeinstellungen: `FileVault, Ein` | lokal beobachtet und protokolliert |
| Firewall UI | nach Aktivierung und erneutem Öffnen: `Firewall, Aktiv` | UI-bestätigt |
| Firewall Legacy-CLI | `Firewall is disabled. (State = 0)` | widerspricht UI; offen |
| Stealth Mode | aus | unverändert, nicht beschlossen |

## Bewertung

Die Bildschirmsperre und der FileVault-Status verbessern beziehungsweise belegen den lokalen Geräteschutz. Der Firewall-Schalter wurde erfolgreich gesetzt und bleibt in der Oberfläche aktiv. Da das Legacy-CLI widerspricht, wird keine vollständig geschlossene Firewall-Kontrolle behauptet. Ein weiterer technischer Nachweis, beispielsweise nach Neustart oder durch einen aktuellen, für diese macOS-Version geeigneten Systemstatus, bleibt erforderlich.

G1-06 bleibt außerdem wegen fehlender produktiver Authentifizierung, MFA, Autorisierung, Anwendungssitzung und verschlüsselter externer Sicherung `technical_blocked`.

## Geheimnisgrenze

Es wurden keine Passwörter, FileVault-Schlüssel, Recovery Keys, Tokens oder sonstigen Authentifizierungsartefakte gelesen, erfasst oder gespeichert.
