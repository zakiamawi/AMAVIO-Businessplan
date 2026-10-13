# AMAVIO ACC Release J.4 – Runtime & Navigation Integrity QA

**Datum:** 09.10.2026  
**Arbeitskopie:** `20261009_AMAVIO_ACC_Release_J_4_Runtime_Navigation_Integrity_Working`  
**Rückfallbasis:** `archive/20261009_release_j4_runtime_navigation_baseline/`  
**Vorgänger:** Release J.3 auf Port 4205, unverändert

## Ziel

Release J.4 schließt den Unterschied zwischen einer optisch geladenen HTML-Datei und der vollständig funktionsfähigen lokalen Anwendung. Die Demo darf keinen halbfunktionalen Zustand mehr still anzeigen. Sichtbare Seite, Browseradresse, Rolle, Arbeitgeberperspektive, ausgewählter Fall und Arbeitsstufe müssen reproduzierbar zusammenpassen.

## Akzeptanzkriterien

- Direkter `file://`-Aufruf zeigt ausschließlich einen klaren lokalen Start-Hinweis; keine Anwendungslogik und keine API-Aktionen werden geladen.
- Nicht freigegebene externe Hosts werden abgewiesen.
- Vor dem Laden der Fachoberfläche bestätigt `/api/health` SQLite, Synthetikgrenze und Null-Außenwirkung.
- Ein fehlgeschlagener Health-Check zeigt einen verständlichen Fehlerzustand mit Wiederholen-Aktion.
- Jede Hauptseite besitzt einen stabilen `?page=`-Deep-Link.
- Navigation aktualisiert die Browseradresse; Zurück, Vorwärts und Reload stellen dieselbe Seite wieder her.
- Arbeitgeberrolle und Funktionsperspektive werden über URL-Zustand wiederhergestellt; interne Seiten bleiben gesperrt.
- Ausgewählter Fall und Arbeitsstufe der Basisreise werden wiederhergestellt.
- Ausgewählter Fall und Arbeitsstufe der operativen Arbeitsfläche werden wiederhergestellt.
- Keine externen Requests, keine Providerkosten und keine Außenwirkung.

## Prüfmatrix

| Bereich | Prüfung | Status |
|---|---|---|
| Syntax | Runtime-, Navigations-, Operations-, Server- und QA-Skripte mit `node --check` | Bestanden |
| Struktur | lokale Ziele, 51 Routen, 29 Mutationen und erforderliche J.4-Artefakte | Bestanden |
| Runtime Ready | Health-Vertrag `release=J.4`, `syntheticOnly=true`, `externalEffects=false` | Bestanden |
| File Guard | keine Fachlogik im `file://`-Modus; klarer Startpfad auf Port 4206 | Bestanden |
| Health Failure | Oberfläche bleibt geschlossen; verständlicher Fehler; Retry lädt erst nach erfolgreicher Prüfung | Bestanden |
| Navigation | Deep Links, Zurück, Vorwärts und Reload | Bestanden |
| Rollenroute | Arbeitgeberrolle und HR-Perspektive werden wiederhergestellt; interne Navigation bleibt verborgen | Bestanden |
| Basisfall | Fall `A-2214` und Stufe `Simulation` über Reload erhalten | Bestanden |
| Operationsfall | ausgewählter Fall und Stufe `Simulation` über Reload erhalten | Bestanden |
| Netzwerk | keine externen Requests im vollständigen J.4-Browserlauf | Bestanden |
| Visuell | Desktop Ready, Operations-Wiederherstellung, Desktop-Fehler und mobiler File Guard einzeln geprüft | Bestanden |

Screenshots:

- `QA/release-j4-screens/1440-runtime-ready-learning.png`
- `QA/release-j4-screens/1440-restored-operations-state.png`
- `QA/release-j4-screens/1440-health-error.png`
- `QA/release-j4-screens/390-file-protocol-guard.png`

## Abschlussstatus

`npm run qa:all` ist am 09.10.2026 vollständig ohne Fehler abgeschlossen:

- **196/196 Node-Tests** bestanden;
- **51 API-Routen und 29 Mutationen** in der Assurance Registry abgedeckt;
- Static- und Brandbook-QA bestanden;
- Runtime-, Release-G-, Release-H-, Release-I- und Release-J.3-Browserregression bestanden;
- sechs responsive Release-G-Viewports sowie Desktop-/Mobile-Rollen-, Lern- und Usabilitypfade bestanden;
- Accessibility-Basis, Scope Guard, lokale Persistenz und Export des Testinstruments bestanden;
- keine externen Requests und keine Provideraufrufe beobachtet.

Der Abschlusslauf fand zunächst einen Scope-Übergabefehler: Ein Arbeitgeber-Fallkontext blieb beim Wechsel zurück zu AMAVIO Operations erhalten. J.4 verwirft Fall und Arbeitsstufe nun bei jedem Rollen- oder Arbeitgeberperspektivwechsel. Die gezielte Release-H-Prüfung und anschließend das vollständige Gate sind danach grün abgeschlossen.

## Grenzen

Release J.4 ist weiterhin eine lokale Konzeptdemo mit ausschließlich synthetischen Daten. Runtime-Integrität ersetzt weder produktive Identity, Hosting, Observability, Backup, Security-Betrieb noch externe Integrationen.
