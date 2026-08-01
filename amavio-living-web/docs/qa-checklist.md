# QA Checklist

- `npm run lint`
- `npm run build`
- Desktop prüfen
- Mobile prüfen
- Formular mit fehlendem Webhook (`503`), Netzwerkfehler und erfolgreichem
  Test-Empfänger prüfen; keinen echten Produktions-Webhook für QA verwenden
- JSON-Typ-, Größen- und Content-Type-Fehler der Anfrage-API prüfen
- Filter auf `/wohnen?q=...&type=...` prüfen
- `robots.txt` ohne und mit echter `SITE_URL` prüfen
- interne Links prüfen
- keine aktive Verwendung von Arrivio
- keine erfundenen Registerdaten
- keine erfundenen Immobilien oder Verfügbarkeiten
- generierte Medien als Platzhalter kennzeichnen
- Kontraste und Tastaturbedienung prüfen
