# Release P.3 – Dual Product Surfaces

**Datum:** 13.10.2026  
**Status:** lokale, synthetische Arbeitskopie ohne Außenwirkung

## Ausgangslage

Release P.2 trennte Rollen, Navigationen und Arbeitsprodukte fachlich. Beide Rollen nutzten jedoch weiterhin denselben Seitenrahmen aus Seitenleiste, Topbar und ähnlicher Flächenlogik. Dadurch wirkte die Trennung visuell wie eine Textvariante desselben Produkts.

## Entscheidung

Die aktive Laufzeit erzeugt zwei unterschiedliche App-Shells aus demselben lokalen Fallzustand:

- **Arbeitgeberportal:** heller, horizontal geführter Kundenarbeitsplatz ohne Operations-Seitenleiste. Fokus auf Programmstand, Entscheidung, beauftragte Leistung und Ergebnisabnahme.
- **AMAVIO Operations:** interne Arbeitskonsole mit dunkler Seitenleiste, Arbeitsvorrat, zentraler Auftragsbearbeitung und schmalem Auftragskontext.

Die Oberflächen teilen nur Marke, URL-Zustand, lokale synthetische Falldaten und die kontrollierte Rollenübergabe. Navigation, Dichte, Containerlogik und primäre Aktionen sind rollenspezifisch.

## Technischer Vertrag

- `app-shell--employer` rendert `employer-masthead`, horizontale Arbeitgebernavigation und `employer-main`.
- `app-shell--operations` rendert `sidebar`, Operations-Topbar und `operations-console-grid`.
- Der Rollenwechsel lädt die passende App-Shell neu, ohne Datenvertrag oder Golden Journey zu duplizieren.
- Arbeitgeber erhält keine internen Nachweisformulare; Operations erhält keine Arbeitgeber-Freigabeformulare.
- Bestehende vier rollenbegrenzte Arbeitsprodukte bleiben unverändert geschützt.

## Grenzen

Keine externe KI, keine realen Personen-, Arbeitgeber-, Objekt- oder Partnerdaten, keine produktive Registrierung, Authentifizierung, Integration, Nachricht, Buchung, Freigabe, Veröffentlichung oder Deployment. `providerCalls` bleibt `0`; `externalEffects` bleibt `false`.
