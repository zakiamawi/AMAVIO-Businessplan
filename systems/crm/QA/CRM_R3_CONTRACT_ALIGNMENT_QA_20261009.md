# AMAVIO One CRM – R3 Contract Alignment QA

**Datum:** 09.10.2026  
**Prüfobjekt:** `20261009_AMAVIO_One_CRM_R3_Contract_Alignment_Working`  
**Zulässiger Reifegrad:** **Lokaler synthetischer CRM-Core-Prototyp – fachlich und technisch geprüft, nicht produktiv freigegeben**  
**Prüfstatus:** **BESTANDEN – lokal/synthetisch; nicht produktiv freigegeben**

## Prüfumfang

Geprüft werden Build, statisches Sicherheits- und Scope-Gate, Unit-, Vertrags-, Komponenten-, Integrations- und End-to-End-Tests, lokale Persistenz und Reset, Browserkonsole, Desktop bei 1600 und 1280 Pixeln, kritische Zwischenbreite 1024 Pixel, Mobile bei 430 Pixeln, echter 200-Prozent-Chrome-Zoom, Tastatur, Focus-Trap, Escape und Focus-Rückgabe.

## R3-Vertragsabdeckung

Die Prüfung umfasst Pipeline v1.0 mit Mindestkriterien, Lead-Konvertierung, Partnerorganisation/Partnerkontakt, getrennte Kontakt-/Consent-Status, deklarative Zielrollen im internen Single-Workspace, Archiv statt Löschung, zwei lokale ACC-Prüfmarker, ungegewichtete Kennzahlen, deaktivierten Export und die vollständige Bündel-C-Sperre.

## Negativgrenzen

Es dürfen keine externe URL und kein Netzwerkpfad im aktiven Quellcode, kein ACC-Payload, keine ACC-ID, keine technische Authentifizierung, keine Datenbank, kein Import, kein E-Mail-/Kalenderpfad, kein Dokumentenspeicher, keine App-Integration, keine produktive KI und kein Hosting-/Deploymentpfad vorhanden sein. Sämtliche Testdaten müssen synthetisch und E-Mail-Adressen auf `.invalid` begrenzt sein.

## Visuelle Vergleichspunkte

Der finale Screenshotvergleich dokumentiert Navigationshierarchie, Navy-/Creme-/Gold-System, redaktionelle Headline- und Fokusstruktur, offene Flächen statt Boxenwüste, Tabellen-/Pipelinebehandlung, Drawer/Formularintegration sowie Mobile-Reflow. Abweichungen werden als bewusste funktionale Erweiterung, reparierter Mismatch oder offene Grenze klassifiziert.

## Automatisierte Ergebnisse

| Prüfung | Ergebnis | Evidenz |
|---|---|---|
| `npm run build` | bestanden | Vite 6.4.4; 1.591 Module; produktiver lokaler Build ohne Fehler |
| statisches Scope-/Sicherheitsgate | bestanden | synthetische Grenze, Markenanker, Pflichtdokumente, v3-Speicher, Single-Workspace, acht Bündel-C-Sperren, keine externe URL oder Netzwerkfunktion |
| Unit | 8/8 bestanden | Schema 3, Suche, Consent-Nachweise, Evidenzlücken, Sperrstatus, C-Locks, Validierung, Dublettenhinweis |
| Vertrag | 6/6 bestanden | Übergänge, Historie, Negativsprung, Scoping-Evidenz, Lead-Konvertierung, ACC-Doppelfreigabe ohne Transferfelder |
| Komponente | 2/2 bestanden | Dialogsemantik sowie Lead-, Partner- und Evidenzformulare |
| Integration | 2/2 bestanden | Kernbeziehungen/Archiv sowie Lead–Partner–Handoff-Vertragsfluss |
| End-to-End | 14 Abläufe bestanden | Core-CRUD, Evidenz, Suche über sieben Objekttypen, Lead, Partnerkontakt, Sperrstatus, Handoff-Marker, Archiv, Persistenz, Bericht, Exportgate, Reset |
| Browserkonsole | bestanden | keine `console.error`- oder `pageerror`-Ereignisse im E2E- und Viewport-Lauf |
| Responsive | bestanden | 1600×1000, 1280×900, 1024×900 und 430×932 ohne Seiten-Overflow |
| Tastatur/Dialoge | bestanden | Strg/⌘ K, Escape, Focus-Trap und Focus-Rückgabe |
| echter 200-%-Zoom | bestanden | isoliertes Chrome-Profil; 1280 Pixel Außenbreite reflowt auf 640 CSS-Pixel ohne Seiten-Overflow |

Maschinenlesbare Browserergebnisse: `QA/CRM_R3_BROWSER_RESULT_20261009.json`. Screenshots: `QA/Screenshots/20261009-r3/`.

## Visueller Vergleich gegen die akzeptierten Konzepte

| Prüfpunkt | Desktop/Mobile-Konzept | R3-Implementierung | Bewertung |
|---|---|---|---|
| Marken- und Navigationshierarchie | dunkle Navy-Navigation, AMAVIO-Wortmarke, Goldindikator | erhalten; Organisationen und Leads wurden als fachlich begründete Navigation ergänzt | passend; kontrollierte Erweiterung |
| Editoriale Hauptfläche | große Serifenschrift, Fokus vor Kennzahlen, offene Cremefläche | Headline, Fokuskarte, Datumsstand und ruhige Flächen erhalten | passend |
| Farbe und Dichte | Navy/Creme/Gold, wenige Statusfarben, tabellarische Präzision | Palette und Akzentlogik erhalten; R3-Funktionen verwenden bestehende Komponenten | passend; keine SaaS-Boxenwüste |
| Pipeline und reale Informationsdichte | sechs Phasen und Chancenliste | sechs Phasen, reale lokale Zählung und acht synthetische Chancen; auf schmalen Breiten kontrolliert horizontal | passend; Datenmenge fachlich erweitert |
| Mobile Struktur | kompakter Header, Fokus, Pipeline, Chancen, Aufgaben und feste Bottom-Navigation | gleiche Reihenfolge und feste Bottom-Navigation; `fullPage`-Screenshot zeigt die fixe Leiste einmal innerhalb der langen Capture-Fläche, im Runtime-Viewport bleibt sie am unteren Rand | funktional passend; Capture-Artefakt dokumentiert |
| 1024-/200-%-Reflow | im Konzept nicht separat dargestellt | Sidepanel, Hauptspalte und Rail reflowen beziehungsweise scrollen intern; kein Seiten-Overflow | zusätzliche QA bestanden |
| Neue R3-Controls | im visuellen Basiskonzept nicht vorhanden | Leads, Partnerkontakte, Evidenzfelder und Handoff-Prüfmarker nutzen Dialog-, Drawer-, Typografie- und Statusmuster des Systems | passende funktionale Ergänzung |

Es wurden keine kritischen visuellen Abweichungen festgestellt. Bewusste Abweichungen sind fachlich begründet: zusätzliche R3-Navigation, reale synthetische Zählwerte sowie erweiterte Formular- und Vertragszustände. Es erfolgte kein Redesign.

## Werkzeugstatus

Eine separate Browser-Skill-Schnittstelle war in dieser lokalen Umgebung nicht als callable Fähigkeit verfügbar. Der vorhandene Repository-Testpfad mit Playwright 1.64 und lokal installiertem Google Chrome war installiert, callable und durch E2E-, Responsive-, Tastatur- und Zoom-Läufe smoke-tested. Es wurde kein externer Browserdienst und kein Connector genutzt.

## Abschlussfeststellung

Die technische Angleichung von Bündel A und B ist im definierten lokalen synthetischen R3-Scope vollständig und konsistent. Bündel C bleibt als achtteilige Negativliste, ohne Netzwerkpfad und ohne Integrationsfelder gesperrt. Der Stand darf ausschließlich als **„Lokaler synthetischer CRM-Core-Prototyp – fachlich und technisch geprüft, nicht produktiv freigegeben“** bezeichnet werden.

Nicht erteilt sind Product-Owner-UAT, Rechts-/Datenschutz-/Security-Freigabe, Freigabe realer Daten, Backend-/Mehrbenutzer-/Mandantenfreigabe oder irgendeine Integrations-, Hosting-, Deployment- oder Veröffentlichungsfreigabe.
