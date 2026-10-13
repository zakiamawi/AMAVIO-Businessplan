# AMAVIO ACC Release J.4.1 – Runtime Clarity QA

**Datum:** 10.10.2026  
**Arbeitskopie:** `20261010_AMAVIO_ACC_Release_J_4_1_Runtime_Clarity_Working`  
**Rückfallbasis:** `archive/20261010_release_j4_1_runtime_clarity_baseline/`  
**Vorgänger:** Release J.4 auf Port 4206, unverändert

## Founder-Befund

- Lokaler Einstieg grundsätzlich verständlich, aber visuell noch unübersichtlich.
- Mehrere helle und kleine Sekundärtexte erschweren den ersten Blick.
- Datei-Hinweis und Serverfehler sind noch nicht vollständig selbsterklärend.
- Reload und Browser-Zurück stellen den erwarteten Arbeitszustand bereits korrekt wieder her und werden fachlich nicht verändert.

## Korrekturziel

Release J.4.1 verdichtet die Runtime-Zustände zu drei verständlichen Abläufen:

1. `Serverstart → Demo öffnet automatisch`
2. `Datei geöffnet → zwei klare Startschritte → lokaler Einstieg`
3. `Server nicht erreichbar → Startbefehl → erneut versuchen`

Die Fachoberfläche erhält ausschließlich eine Kontrast- und Mindestgrößenkorrektur für Sekundärtexte. Es entstehen keine neue Funktion, kein neues KI-Modul und keine produktive Anbindung.

## Abnahmegrenzen

- ausschließlich lokale, synthetische Konzeptdemo;
- keine externen Requests, Providerkosten oder Außenwirkung;
- keine produktive Identity, Datenquelle, Integration, Veröffentlichung oder Deployment;
- Release J.4 und J.3 bleiben unveränderte Rückfallfassungen.

## QA-Status

| Bereich | Prüfung | Status |
|---|---|---|
| Syntax | Runtime-, Server- und QA-Skripte mit `node --check` | Bestanden |
| Struktur | erforderliche J.4.1-Artefakte, 51 Routen und 29 Mutationen | Bestanden |
| Brandbook | Farbrollen, Geist/Fraunces, Radien, keine Gradienten oder Panel-Schatten | Bestanden |
| Vorbereitung | klare Erklärung, zwei sichtbare Prüfschritte, automatischer Übergang | Bestanden |
| Datei-Hinweis | Titel „Lokale Demo starten“, zwei Handlungsschritte, ein Hauptpfad auf Port 4207 | Bestanden |
| Serverfehler | Titel „Demo ist noch nicht erreichbar“, Startbefehl und erneute Prüfung | Bestanden |
| Lesbarkeit | Einleitung mindestens 16 px; Summary mindestens 11,4 px; Sekundärfarbe `#4e5f67` | Bestanden |
| Responsive | Desktop 1505/1280/1024, Tablet 768 und Mobile 390/360 | Bestanden |
| Navigation | Qualitätsprüfung, Browser-Zurück, Reload, Rolle, Fall und Arbeitsstufe | Bestanden |
| Netzwerk | keine externen Requests oder Provideraufrufe | Bestanden |

`npm run qa:all` ist am 10.10.2026 vollständig ohne Fehler abgeschlossen:

- **196/196 Node-Tests** bestanden;
- **51 API-Routen und 29 Mutationen** in der Assurance Registry abgedeckt;
- Runtime-Clarity-, Release-G-, Release-H-, Release-I- und Release-J.3-Browserregression bestanden;
- Accessibility-Basis, Rollen- und Netzwerkgrenzen sowie das Usability-Testinstrument bestanden;
- sichtbarer In-App-Browser-Smoke-Test auf Port 4207 ohne Fehler oder Warnungen abgeschlossen;
- Qualitätsprüfung geöffnet, Browser-Zurück und Reload live verifiziert.

## Screenshot-Nachweise

- `QA/release-j4-1-screens/1440-runtime-preparing.png`
- `QA/release-j4-1-screens/1440-file-protocol-guard.png`
- `QA/release-j4-1-screens/390-file-protocol-guard.png`
- `QA/release-j4-1-screens/1440-health-error.png`
- `QA/release-j4-1-screens/1440-runtime-ready-learning.png`
- `QA/release-j4-1-screens/1440-restored-operations-state.png`
