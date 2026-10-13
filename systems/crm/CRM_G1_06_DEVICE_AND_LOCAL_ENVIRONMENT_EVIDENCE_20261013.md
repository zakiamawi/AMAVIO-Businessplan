# G1-06 – Geräte- und lokale Umgebungsevidenz

Beobachtung: 13.10.2026  
Umfang: ausschließlich read-only, keine Systemeinstellung verändert

| Kontrolle | Beobachtung | Evidenzqualität | Wirkung auf Gate |
|---|---|---|---|
| Betriebssystemversion | `26.6.2` über `sw_vers -productVersion` beobachtet | punktuelle lokale Beobachtung | kein Freigabenachweis |
| Screen-Lock-Verzögerung | `sysadminctl -screenLock status` meldete „immediate“ | punktuelle lokale Beobachtung | Richtlinie und Dauerhaftigkeit offen |
| Geräte-/Volumeverschlüsselung | `fdesetup status` konnte in der Ausführungsumgebung das Root-Volume nicht bestimmen | nicht verifiziert | harter Blocker |
| Datenträgerstatus | DiskManagement-Framework in der Ausführungsumgebung nicht verfügbar | nicht verifiziert | harter Blocker |
| lokale Serverbindung | Quellvertrag `127.0.0.1` | lokal technisch prüfbar | Risikoreduktion, kein Login |
| SQLite-Persistenz | lokale Datei und Snapshotpfad vorhanden | lokal technisch prüfbar | Verschlüsselung der Ablage offen |

## Bewertung

Die unmittelbare Betriebssystem-Sperre ist ein positives Signal, aber keine dauerhafte Sicherheitsfreigabe. Geräteverschlüsselung und verschlüsselte Sicherungsablage konnten nicht belastbar belegt werden. Es wurden bewusst keine Gerätekennung, kein Benutzername, keine Recovery-Information, kein Token und kein anderes Authentifizierungsartefakt gelesen oder gespeichert.

## Erforderliche externe Evidenz

- datierter Nachweis der aktiven Vollverschlüsselung am vorgesehenen Betriebsgerät;
- dokumentierter Screen-Lock- und Patchstandard;
- definierter exklusiver oder kontrollierter Benutzerzugriff;
- verschlüsselte Sicherungsablage und erfolgreicher Restore-Test;
- Verantwortlicher, Prüfrhythmus und Ablauf bei Geräteverlust.

