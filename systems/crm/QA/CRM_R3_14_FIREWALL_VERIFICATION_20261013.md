# R3.14 – macOS-Firewall-Verifikation

**Datum:** 13.10.2026  
**Gerät:** macOS 26.6.2, Build 25G83  
**Status:** beobachteter Blocker; Firewall nicht als wirksam belegt

## Vorgeschichte

In R3.13 wurde der Schalter in Systemeinstellungen → Netzwerk → Firewall aktiviert und nach erneutem Öffnen als `Aktiv` angezeigt. Das Legacy-Werkzeug meldete gleichzeitig `State = 0`. R3.14 ergänzt einen aktuellen zweiten Betriebssystemnachweis.

## Read-only-Nachweise

| Prüfung | Ergebnis |
|---|---|
| `system_profiler SPFirewallDataType` | `Mode: Allow all incoming connections` |
| `socketfilterfw --getglobalstate` | `Firewall is disabled. (State = 0)` |
| `/Library/Preferences/com.apple.alf globalstate` | Domain-/Wertpaar nicht vorhanden |
| Oberfläche aus R3.13 | nach Toggle als `Aktiv` beobachtet |

Zwei unabhängige Betriebssystemausgaben stimmen darin überein, dass keine wirksame Filterung belegt ist. Die Oberfläche allein reicht deshalb nicht als Sicherheitsnachweis. Der Status wird von `verification_conflict` auf `observed_blocker` geschärft.

## Erforderliche manuelle Schließung

1. Geräteadministrator aktiviert die Firewall mit erforderlicher macOS-Authentifizierung.
2. Systemeinstellungen werden geschlossen und erneut geöffnet.
3. `system_profiler SPFirewallDataType` darf nicht mehr `Allow all incoming connections` melden.
4. `socketfilterfw --getglobalstate` muss einen aktivierten Zustand melden.
5. Nur bei übereinstimmenden Nachweisen wird die Kontrolle neu bewertet.

Es wurden keine Adminpasswörter, Schlüssel oder Authentifizierungsartefakte angefordert oder verarbeitet. Der Apple-Leitfaden beschreibt die integrierte Firewall und ihre Optionen: https://support.apple.com/guide/security/firewall-security-in-macos-seca0e83763f/1/web/1
