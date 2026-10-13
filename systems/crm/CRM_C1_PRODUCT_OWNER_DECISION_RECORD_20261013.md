# C1 – Product-Owner-Teilbeschluss PO-CRM-045

**Datum:** 13.10.2026  
**Entscheider:** Zaki Amawi  
**Status:** Teilbeschluss protokolliert; C1-Implementierung weiterhin NO-GO

## Entscheidungsmatrix

| Punkt | Nutzerangabe | Protokollierter Stand | Wirkung |
|---|---|---|---|
| Technischer Betreiber | Zaki Amawi | bestätigt | technische Hauptverantwortung für einen späteren synthetischen C1-Block benannt |
| Vertretung | Van Vardanian | durch Product Owner benannt | Annahme, Erreichbarkeit, Berechtigung und Übergabe noch offen |
| Security Review | keine Angabe | nicht besetzt | harter C1-Blocker |
| Datenschutz-/Vertragsprüfung | Zaki Amawi / Gründer | interne Verantwortung bestätigt | keine unabhängige oder externe Datenschutz-/Rechtsfreigabe; G1-03 bleibt offen |
| Budgetobergrenze | 50–100 | Arbeitskorridor 50–100 EUR brutto/Monat; harte Planungsobergrenze 100 EUR | keine Kauf- oder Add-on-Freigabe |
| Provider/Region | Supabase, Frankfurt eu-central-1 – freigegeben/nicht freigegeben | keine eindeutige Auswahl | Provider und Region nicht freigegeben |
| macOS-Firewall | freigegeben | Systemeinstellungen melden aktiv; Legacy-CLI widerspricht | Konfiguration ausgeführt, Nachweiswiderspruch offen |
| Bildschirmsperre | nach 5 Minuten | 300 Sekunden, Passwort aktiv, Verzögerung 0 | lokal technisch bestätigt |
| C1-Datenumfang | ausschließlich synthetisch | bestätigt | reale Daten bleiben ausgeschlossen |

## C1-Status

`partial_decision_recorded` bedeutet: Der Arbeitsrahmen ist präziser, aber C1 darf noch nicht umgesetzt werden. Folgende Flags bleiben `false`:

- `c1ImplementationAuthorized`
- `providerProjectCreated`
- `providerAuthenticated`
- `providerSmokeTested`
- `purchaseApproved`
- `externalPrivacyTermsApproved`
- `realDataEnabled`
- `outboundEnabled`

## Noch notwendige Beschlüsse

1. Security Reviewer namentlich benennen oder eine klar befristete, begründete Einpersonen-Ausnahme mit Ablaufdatum und Kompensationsmaßnahmen beschließen.
2. Provider und Region eindeutig mit `freigegeben` oder `nicht freigegeben` entscheiden.
3. Van Vardanians Annahme der Vertretung, Erreichbarkeit und Übergabe dokumentieren.
4. Externe Datenschutz-/Vertragsprüfung bestimmen; die Selbstprüfung des Gründers ersetzt sie nicht.
5. Kauf erst in einem gesonderten externen Schreib-/Kostenbeschluss erlauben.

## Unveränderliche Grenze

Dieser Teilbeschluss aktiviert keinen Provider und keine produktive Fähigkeit. Er erlaubt nur die lokale, synthetische Dokumentation und spätere Entscheidungsplanung.
