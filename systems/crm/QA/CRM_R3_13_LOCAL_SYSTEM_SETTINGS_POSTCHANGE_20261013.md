# R3.13 – lokale Systemeinstellungen nach freigegebener Teilhärtung

**Datum:** 13.10.2026  
**Geltungsbereich:** lokales macOS-Arbeitsgerät; keine Server-, Provider- oder Produktivumgebung  
**Status:** Teilhärtung ausgeführt; Firewall-Nachweiswiderspruch offen

## Ausgeführte, vom Product Owner freigegebene Änderungen

| Kontrolle | Nachzustand | Bewertung |
|---|---|---|
| Bildschirmschoner/Sperrzeit | `idleTime = 300` Sekunden | lokal bestätigt |
| Passwort nach Sperre | `askForPassword = 1` | lokal bestätigt |
| Verzögerung der Passwortanforderung | `askForPasswordDelay = 0` | lokal bestätigt |
| System-Sperrstatus | Passwortanforderung ohne Verzögerung | lokal bestätigt |
| Firewall – Systemeinstellungen | `Firewall, Aktiv`, auch nach erneutem Öffnen | UI-bestätigt |
| Firewall – Legacy-CLI | `Firewall is disabled. (State = 0)` | widersprüchlich; nicht geschlossen |
| FileVault | Systemeinstellungen zeigen `Ein` | read-only UI-Nachweis |

## Sicherheits- und Datenschutzgrenze

- Es wurden keine Passwörter, Wiederherstellungsschlüssel, Zugangstoken oder sonstigen Authentifizierungsartefakte gelesen, gespeichert oder verändert.
- Der Stealth-Modus wurde nicht verändert.
- Es wurden keine Provider, externen Dienste oder Netzwerkschnittstellen konfiguriert.
- Der UI-/CLI-Widerspruch der Firewall verhindert die Einstufung als vollständig verifizierte Schutzkontrolle.
- Für C1 fehlen weiterhin unabhängiges Security Review, eindeutige Provider-/Regionsfreigabe und ein gesonderter Implementierungsbeschluss.

## Zugehörige Evidenz

- Vorzustand: `QA/CRM_R3_13_LOCAL_SYSTEM_SETTINGS_PRECHANGE_20261013.md`
- Geräte-/Konfigurationsbewertung: `CRM_G1_06_DEVICE_CONFIGURATION_AND_VERIFICATION_20261013.md`
- Gesamtabschluss: `QA/CRM_R3_13_C1_DECISION_CLOSURE_QA_20261013.md`
