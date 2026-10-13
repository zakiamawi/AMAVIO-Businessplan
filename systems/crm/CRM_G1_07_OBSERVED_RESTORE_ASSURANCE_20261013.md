# G1-07 – Beobachtete lokale Wiederherstellungsprobe

**Datum:** 13.10.2026  
**Geltungsbereich:** ausschließlich lokaler synthetischer CRM-Zustand

## Prüfziel

Die Probe beantwortet eng die Frage, ob der aktuelle synthetische v7-Zustand in einer frischen SQLite-Struktur geschrieben, wieder gelesen, als synthetischer Zustand validiert und inhaltlich per Prüfsumme bestätigt werden kann. Sie ist keine Aussage über Cloud-Backups, verschlüsselte Datenträger, reale personenbezogene Daten oder einen produktiven Notfallbetrieb.

## Technischer Ablauf

1. Den aktuellen Zustand aus der laufenden lokalen SQLite-Datenbank lesen.
2. Vor Beginn `isSyntheticState` prüfen und den JSON-Payload mit SHA-256 hashen.
3. Eine neue SQLite-Datenbank ausschließlich als `:memory:` öffnen.
4. Eine minimale Restore-Tabelle anlegen und Schema-Version sowie Payload schreiben.
5. Datensatz zurücklesen, JSON parsen, Schema v7 und synthetischen Vertrag erneut prüfen.
6. Prüfsumme vor und nach dem Round-Trip vergleichen.
7. Temporäre Datenbank schließen; den laufenden Zustand nicht verändern.
8. Nur bei vollständigem Erfolg einen synthetischen Kontrolllauf und Audit-Eintrag erzeugen.

## Nachweisgrenzen

Belegt werden lokaler Round-Trip, Schemaübereinstimmung, synthetischer Datenvertrag, Prüfsummenidentität und ausbleibende Live-State-Mutation. Nicht belegt werden Dateisystem- oder Geräteverschlüsselung, externe Backup-Ablage, Rotation, tatsächliche Wiederanlaufzeit unter Störung, organisatorische Erreichbarkeit oder eine Rechts-/Security-Freigabe.

## Gate-Wirkung

Ein erfolgreicher Lauf verbessert die Evidenz von G1-07. Mit `PO-CRM-043` wurden RPO 24 Stunden, RTO 4 Stunden, Sicherungsrhythmus und Hauptverantwortung anschließend als lokale Arbeitslogik beschlossen. Vor einer G1-Freigabe bleiben mindestens Aufbewahrungsabgleich, verschlüsselte Ablage, Vertretungsverantwortung sowie eine beobachtete Betriebsprobe unter der später freigegebenen Zielumgebung nachzuweisen.

## Beobachtetes Ergebnis in der R3.10-Arbeitskopie

Am 13.10.2026 wurde die Probe im tatsächlichen lokalen SQLite-Modus auf `127.0.0.1:4387` ausgeführt. Ergebnis: `status=passed`, `syntheticOnly=true`, `liveStateMutated=false`, Schema v7, 71 gezählte synthetische Einträge und Prüfsummenpräfix `b6e65058a7b3`. Die Oberfläche protokollierte denselben Nachweis in der G1-Kontrollspur; G1 blieb sichtbar NO-GO. Die Evidenz ist lokal in `QA/Screenshots/20261013-r3-10-local-operations-assurance/r3-10-live-sqlite-restore-proof.png` gesichert.
