# Datenschutz

- Formulardaten werden über den Next.js-Server an den konfigurierten
  HTTPS-Webhook-Empfänger übertragen.
- Die Web-App enthält keine eigene Datenbank für Anfragen. Persistenz und
  Speicherdauer hängen jedoch vom tatsächlich konfigurierten Empfänger ab.
- Ohne Webhook-Konfiguration wird keine Zustellung und kein Erfolg behauptet.
- Die öffentliche Datenschutzseite bleibt ausdrücklich unvollständig.

Vor Produktion müssen Verantwortlicher, Empfänger/Auftragsverarbeitung,
Rechtsgrundlage, Zwecke, Aufbewahrungsfristen, Betroffenenrechte sowie
Auskunfts- und Löschprozesse anhand des realen Systems verbindlich dokumentiert
werden.
