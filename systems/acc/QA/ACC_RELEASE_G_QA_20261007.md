# AMAVIO ACC Release G – QA-Nachweis

**Stand:** 07.10.2026  
**Prüfobjekt:** `20261007_AMAVIO_ACC_Release_G_Operational_Orchestration_Working`  
**Status:** lokal vollständig grün

## Ergebnis

- `npm run test`: **78/78 bestanden** – Backend, Gate 01.5, Gate 02A, Tenant-Grenzen, Fuzzing, Idempotenz, Concurrency, Failure Injection, Transaktions-Rollback und Recovery.
- `npm run qa:static`: **grün** – fünf Release-G-Stufen, Paketdateien, aktive Assets, Syntax, IDs, Links und Sicherheitsgrenzen.
- `npm run qa:brandbook`: **grün** – bestehende Usability-Konsole plus Release-G-Schicht; Stage Navy, Brand Navy, Cream, Gold, Bronze, Geist/Fraunces, 180-px-Logo, Radien 0/4/8, keine Verläufe, keine Panel-Schatten und kein Teal/Mint.
- `npm run qa:browser`: **grün** – 1505×1000, 1280×800, 1024×900, 768×900, 390×844 und 360×800.
- `npm run qa:usability`: **grün** – Desktop und Mobile, Scope Guard, sechs Aufgaben, lokale Persistenz, Auswertung und Export.
- `npm run qa:all`: **grün** als konsolidierter Abschlusslauf.

## Geprüfte Release-G-Journey

1. Start in `Evidenz` mit drei Quellen und sichtbarem Adresskonflikt.
2. Übergabe in `Verantwortung` mit Rolle, Aufgabe, Frist und Abhängigkeit.
3. Tastaturerreichbare `Simulation` mit unverändertem Originalfall und fünf Folgefristen.
4. Granulare Übernahme erst nach menschlicher Prüfnotiz; neue Fallversion und neues Anreisedatum bestätigt.
5. Menschlich begründete `Entscheidung`; Human-Gate-Kontext wechselt auf dokumentiert.
6. Erzeugung eines `Arrival Readiness Brief` mit Quellenreferenzen, `sink_only` und sichtbarer fehlender Außenwirkung.
7. 24/24 lokale Evaluationsszenarien vollständig grün.

## Browser- und Accessibility-Basis

- keine externen Requests;
- kein horizontaler Seitenüberlauf auf den sechs Prüfabmessungen;
- keine defekten Bilder oder doppelten IDs;
- sichtbare Felder beschriftet und Buttons zugänglich benannt;
- ein aktives H1, Main-Landmark und Skip-Link;
- Stufen per Tastatur erreichbar;
- Reduced-Motion-Regel wirksam;
- mobile Navigation öffnet und schließt kontrolliert;
- unbekannte Route liefert HTTP 404.

## Visueller Soll-Ist-Abgleich

Geprüft wurden die beiden Konzeptreferenzen direkt gegen die gerenderten Desktop- und Mobilansichten. Die Implementierung übernimmt die ruhige Informationshierarchie, die fünfstufige Fallreise, den permanenten Desktop-Kontext und den nachgelagerten Mobil-Kontext. Auf kleinen Viewports bleibt die Stufenleiste bewusst horizontal bedienbar; die Fallauswahl wird ausgeblendet, der aktive H1 semantisch erhalten.

Belege:

- `QA/release-g-screens/desktop-1505-evidence.png`
- `QA/release-g-screens/desktop-1505-product.png`
- `QA/release-g-screens/desktop-1280-operations.png`
- `QA/release-g-screens/desktop-1024-operations.png`
- `QA/release-g-screens/tablet-768-operations.png`
- `QA/release-g-screens/mobile-390-operations.png`
- `QA/release-g-screens/mobile-360-operations.png`

## Korrekturen im QA-Lauf

- synthetische No-Effect-Kennzeichnung in der aktiven Arbeitsfläche präzisiert;
- mobile H1-Semantik trotz ausgeblendeter Fallliste erhalten;
- 180-px-Logo auch bei der 1024-px-Sidebarbreite abgesichert;
- aktive H1-Prüfung auf die tatsächlich sichtbare Seite begrenzt;
- zusammenhängende Verantwortungsprüfung auf konkrete Rolle und Aufgabe ausgerichtet.

## Unveränderte Grenzen

Die Prüfung verwendet ausschließlich temporäre oder lokale synthetische Daten. Sie aktiviert keine Identity, externe KI, reale Datenquelle, Integration, Nachricht, Buchung, Veröffentlichung oder Deployment.

## Restgrenzen

Der grüne Status bedeutet lokale Founder-Evaluationsreife, nicht Produktivreife. Nicht nachgewiesen sind produktive Authentifizierung, produktive Mandantentrennung, Datenschutz-/Security-/Hosting-/Betriebsfreigabe, reale Datenquellen, Connectoren, Live-Provider, reale Personenentscheidungen, externe Zustellung oder Veröffentlichung. Diese Themen bleiben separate Founder-Gates.
