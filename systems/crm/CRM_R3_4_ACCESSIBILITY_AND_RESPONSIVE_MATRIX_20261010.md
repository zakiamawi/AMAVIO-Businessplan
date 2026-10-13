# AMAVIO One CRM – R3.4 Accessibility- und Responsive-Matrix

**Stand:** 10.10.2026  
**Geltung:** lokaler synthetischer R3.4-Prototyp; kein externer WCAG-Zertifizierungsnachweis.

| Prüfbereich | Vertrag | Lokale Evidenz |
|---|---|---|
| Semantik | Regionen besitzen Überschriften; Charts enthalten bedienbare, benannte Elemente | DOM-/AX-Prüfung und Komponententest |
| Hauptinhalt | Skip-Link `Zum Hauptinhalt` führt zu `#main-content` | Browser-QA |
| Dialoge | `role=dialog`, Name, Escape, Focus-Trap und Focus-Rückgabe | Browser-QA und bestehende Dialogtests |
| Tastatur | globale Suche über Strg/⌘ K; alle R3.4-Handlungen als native Buttons | Browser-QA |
| Kontrast/Status | Status zusätzlich mit Wort, Symbol oder Form | visuelle und statische Prüfung |
| Bewegung | Balkenanimation bei Reduced Motion deaktiviert | CSS-QA |
| 1600 px | vollständige zweispaltige Entscheidungsbühne | Screenshot-QA |
| 1280 px | Agenda unter Founder Focus, keine Überlappung | Screenshot-QA |
| 1024 px | Fokuszeilen ohne abgeschnittene Kernhandlung; Module gestapelt | Screenshot-QA |
| 768 px | kritische Zwischenbreite ohne Seitenüberlauf | Browser-QA |
| 430/390 px | mobile Reihenfolge, fixe Primärnavigation, interne Chart-Schienen | Browser-QA |
| 200 % Zoom | echter Chrome-Reflow aus 1280 px auf etwa 640 CSS-Pixel | isoliertes Browserprofil |

## Bekannte Grenze

Ein vollständiger Screenreader-Test mit VoiceOver/NVDA und ein unabhängiger WCAG-Audit wurden nicht durchgeführt. Breite Pipeline- und Aging-Visualisierungen nutzen auf Mobilgeräten bewusst internes horizontales Scrollen; die Werte bleiben über einzelne benannte Buttons zugänglich.

## Abnahmekriterium

R3.4 darf nur als lokal QA-geprüft gelten, wenn kein horizontaler Seitenüberlauf, keine namenlose Schaltfläche, kein Browserkonsolenfehler und kein fehlender Dialogfokus festgestellt wird. Ein Build-Erfolg allein reicht nicht.
