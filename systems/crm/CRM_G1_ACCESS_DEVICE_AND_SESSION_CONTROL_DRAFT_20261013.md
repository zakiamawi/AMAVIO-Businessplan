# G1 Zugriff, Gerät und Sitzung – Kontrollentwurf

**Status:** Zielvertrag, technisch nicht umgesetzt; G1-06 bleibt gesperrt

## Mindestkontrollen für einen späteren Echtdatenbetrieb

| Bereich | Mindestanforderung | Nachweis | Aktueller Stand |
|---|---|---|---|
| Identität | eindeutiger persönlicher Zugang, keine geteilten Konten | Login- und Negativtest | nicht implementiert |
| Mehrfaktor | TOTP oder gleichwertige zweite Komponente | Einrichtungs- und Recovery-Test | nicht implementiert |
| Berechtigung | geringstmögliche Rechte, technisch erzwungen | Rollen-/RLS-Vertragstest | nur fachlicher Entwurf |
| Gerät | Festplattenverschlüsselung, Bildschirmsperre, aktuelles Betriebssystem | Gerätecheck mit Datum | extern nachzuweisen |
| Sitzung | Inaktivitätslimit, Abmeldung, Verlust-/Sperrweg | Sitzungs- und Sperrtest | nicht implementiert |
| lokale Dateien | geschützter Speicherort, kein offener Sync-Ordner | Pfad-/Berechtigungsprüfung | nicht freigegeben |
| Protokoll | sicherheitsrelevante Aktionen nachvollziehbar | Audit-Stichprobe | lokal-synthetisch vorhanden |

## Einzelarbeitsplatz ist keine Zugriffskontrolle

Der aktuelle Modus `single_internal` beschreibt nur den fachlichen Arbeitsbereich. Er beweist weder Identität noch Gerätesicherheit. Das sichtbare Profil ist keine Authentifizierung. Browser- oder SQLite-Persistenz allein darf deshalb nicht als Freigabe für reale Daten interpretiert werden.

## Exit-Kriterium

G1-06 kann erst geschlossen werden, wenn Authentifizierung, Gerät, Sitzung, Berechtigungen, Recovery und Negativtests in der tatsächlich vorgesehenen Betriebsumgebung geprüft sind. Dieser Block bereitet nur den Vertrag vor und aktiviert keinen Zugang.

