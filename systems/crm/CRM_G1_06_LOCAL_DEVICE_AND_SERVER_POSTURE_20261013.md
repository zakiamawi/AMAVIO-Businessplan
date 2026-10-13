# G1-06 – Lokale Geräte- und Server-Posture

**Erhebung:** 13.10.2026, ausschließlich read-only für Betriebssystemwerte  
**Status:** Teilnachweis mit Blockern; keine Sicherheitsfreigabe

## Beobachtete Umgebung

| Merkmal | Befund | Bewertung |
|---|---|---|
| Betriebssystem | macOS 26.6.2, Build 25G83 | dokumentiert, nicht als Update-/Patchfreigabe bewertet |
| Application Firewall | deaktiviert, Status 0 | konkreter Blocker; keine Systemeinstellung verändert |
| FileVault/Datenträgerverschlüsselung | Abfrage lieferte keinen belastbaren Status | nicht verifiziert |
| automatische Bildschirmsperre | kein belastbarer Richtlinienwert ermittelt | nicht verifiziert |
| CRM-Datenbank vor R3.12 | `0644` beobachtet | in der Arbeitskopie technisch gehärtet |
| CRM-Datenordner ab R3.12 | `0700` | durch Persistenztest zu belegen |
| SQLite-/WAL-/SHM-/Exportdateien ab R3.12 | `0600` | durch Persistenztest zu belegen |

## R3.12 lokale Schutzmaßnahmen

- Serverbindung ausschließlich an `127.0.0.1`;
- fremde Origin und `Sec-Fetch-Site: cross-site` werden für ändernde Methoden abgewiesen;
- CSP mit `default-src 'self'`, `frame-ancestors 'none'`, ohne externe Script-/Connect-Ziele;
- `X-Frame-Options: DENY`, `Referrer-Policy: no-referrer`, `nosniff`, restriktive `Permissions-Policy` und Same-Origin-Grenzen;
- lokale Verzeichnisse und Datenartefakte werden eigentümergebunden angelegt beziehungsweise nachgehärtet;
- Echtdaten-, Outbound- und Providerflags bleiben aus.

## Nicht vorhandene Kontrollen

Es existieren kein Login, keine produktive Identität, keine MFA, keine technisch erzwungene Rollenberechtigung, keine verlässliche Sitzungssperre und keine zentrale Protokoll-/Alarmierungsumgebung. Der lokale Browserzugang ist kein Zugriffsschutz.

## Für G1-06 noch zu schließen

1. Product Owner bestätigt bewusst, ob und wie die macOS-Firewall aktiviert und geprüft werden soll.
2. FileVault-/Datenträgerverschlüsselung wird mit geeignetem Verfahren nachgewiesen.
3. automatische Bildschirmsperre und Wiederanmeldepflicht werden festgelegt und nachgewiesen.
4. Backup-Speicherort und Verschlüsselung werden bestimmt.
5. Erst nach C1-Freigabe werden Identität, TOTP-MFA/AAL2, serverseitige Autorisierung und RLS negativ getestet.
6. Ein unabhängiger Security-Review oder eine ausdrücklich befristete Einpersonen-Ausnahme wird beschlossen.

## Ergebnis

Sechs lokale Schutzgrenzen sind testbar und reduzieren das Risiko des synthetischen Einzelplatzprototyps. Wegen des beobachteten Firewall-Blockers, der ungeklärten Geräte- und Backupabsicherung und fehlender Identitätskontrollen bleibt G1-06 `technical_blocked`.
