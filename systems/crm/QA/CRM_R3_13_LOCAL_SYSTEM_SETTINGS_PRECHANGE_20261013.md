# R3.13 – Lokale Systemeinstellungen vor Änderung

**Zeitpunkt:** 13.10.2026, Europe/Berlin  
**Anlass:** ausdrückliche Freigabe des Nutzers für macOS-Firewall und Bildschirmsperre nach fünf Minuten  
**Status:** Vorher-Nachweis und Rückfallreferenz; keine Security-Zertifizierung

## Firewall vor Änderung

- Application Firewall: deaktiviert (`State = 0`)
- Stealth Mode: aus
- Es wurde keine vorhandene `/Library/Preferences/com.apple.alf.plist` gefunden.
- Vor diesem Nachweis wurde keine Firewall-Einstellung verändert.

## Bildschirmsperre vor Änderung

- `com.apple.screensaver idleTime`: kein expliziter Wert vorhanden
- `com.apple.screensaver askForPassword`: kein expliziter Wert vorhanden
- `com.apple.screensaver askForPasswordDelay`: kein expliziter Wert vorhanden
- `sysadminctl -screenLock status`: Verzögerung bereits als `immediate` gemeldet
- Im Benutzerordner wurde keine bestehende `com.apple.screensaver*.plist` im ByHost-Verzeichnis gefunden.

## Geplante eng begrenzte Änderung

1. Application Firewall global einschalten.
2. Stealth Mode nicht eigenmächtig ändern, weil der Nutzer nur die Firewall-Konfiguration freigegeben hat und kein Stealth-Mode-Beschluss vorliegt.
3. Screensaver-/Sperrinaktivität auf 300 Sekunden setzen.
4. Passwortanforderung aktivieren und Verzögerung auf 0 Sekunden setzen.
5. Danach alle Werte read-only erneut prüfen.

## Rückfallgrenze

Eine Rücknahme erfolgt nicht automatisch. Falls der Nutzer später ausdrücklich zurückrollen möchte, sind die dokumentierten Vorwerte die Referenz: Firewall aus, kein expliziter Idle-Wert, kein expliziter `askForPassword`-Wert und kein expliziter `askForPasswordDelay`-Wert. Passwörter, Wiederherstellungsschlüssel oder sonstige Authentifizierungsdaten werden weder gelesen noch gespeichert.
