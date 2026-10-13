# AMAVIO ACC – Gate 02A QA-Abschluss

**Stand:** 07.10.2026  
**Arbeitskopie:** `20261007_AMAVIO_ACC_Productization_Gate_02_Foundation_Working`  
**Ergebnis:** lokal grün; geeignet als Basis für den moderierten synthetischen Usability-Test  
**Produktionsstatus:** nicht produktionsreif; keine externe Identity, kein Hosting, keine realen Daten und keine Live-Provider

**Lokaler Prüfport:** `4196`; die bereits laufenden Fassungen auf `4193` bis `4195` wurden nicht verändert.

## Geprüfter Umfang

- 20 API-Routen und 13 schreibende Routen;
- Fuzzing von Query-/Unicode-Werten sowie je Mutation fehlender Idempotency-Key, malformed JSON, übergroßer Request, Schema- und Unicode-Probe;
- Parallelzugriffe auf alle Mutationen;
- deterministisches Replay, Key-Konflikt und Persistenz nach Neustart;
- kontrollierter Vor-Routen-Ausfall auf allen 20 Routen;
- Commit-Abbruch, Rollback und Wiederholung mit demselben Key für Entscheidung und Simulationsübernahme;
- fehlende Sitzung und Cross-Tenant-Negativpfade;
- HTML/CSS/JavaScript-Syntax, lokale Assets und Produktgrenzen;
- Desktop 1505, 1280, 1024, Tablet 768 sowie Mobile 390 und 360 Pixel;
- Tastaturpfad, Reduced Motion, Form-Labels, Buttonnamen, horizontale Überläufe, Konsole und externe Requests;
- Fallarbeit, Evidenz, Regeln, Simulation, Human Gate, Arbeitsprodukt und 24 Evaluationsszenarien.

## Automatisierte Ergebnisse

| Prüfschritt | Ergebnis |
|---|---|
| `npm test` | 78/78 Tests bestanden |
| `npm run qa:static` | bestanden |
| `npm run qa:browser` | sechs Viewports bestanden |
| externe Browserrequests | 0 |
| echte Daten | 0 |
| produktive Außenwirkung | 0 |

Der erste Headless-Browserstart innerhalb der macOS-Sandbox wurde vom Betriebssystem mit `MachPortRendezvousServer: Permission denied` blockiert. Der identische lokale QA-Lauf außerhalb dieser Prozessbeschränkung war erfolgreich. Dies war ein Testumgebungsfehler, kein Anwendungsfehler.

## Implementierte Garantien

- Jede Mutation erfordert einen `Idempotency-Key` mit 8–120 erlaubten Zeichen.
- Key, HTTP-Methode, Pfad und stabil normalisierter Body bilden den Request-Fingerprint.
- Ein identischer Retry gibt Status und JSON-Antwort wieder, ohne die Fachmutation erneut auszuführen.
- Eine abweichende Wiederverwendung desselben Keys endet mit `409 idempotency_conflict`.
- Ein 5xx entfernt eine offene Idempotenzreservierung, damit ein kontrollierter Retry möglich bleibt.
- Exklusive Zustandsänderungen verwenden Version, Status-CAS oder `BEGIN IMMEDIATE`.
- Fall-, Task-, Evidenz-, Entscheidungs- und Simulationsressourcen bleiben tenantgebunden.
- Alle produktnahen Wirkungen bleiben `local_only` beziehungsweise `sink_only`.

## Bewusste Grenzen

Gate 02A beweist lokale Routenresilienz dieser synthetischen Konzeptanwendung. Es ersetzt keine Mehrprozess-/Mehrknoten-Lastprüfung, keinen externen Penetrationstest, keine produktive Identity, keine Datenbank-RLS, kein Secret Management, keinen Hosting-/Restore-Nachweis und keine Datenschutzfreigabe. Diese Punkte bleiben in Gate 02B beziehungsweise Gate 03.

## Nächster Schritt

Moderierter Usability-Test ausschließlich mit synthetischen Fällen. Vor externen Einladungen werden Teilnehmerkreis, Rollen, Moderationsleitfaden, Beobachtungsbogen, Einwilligungs-/Aufzeichnungsscope und Terminierung separat vom Founder freigegeben.
