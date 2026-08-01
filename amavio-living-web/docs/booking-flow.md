# Booking Flow

## V1

1. Nutzer wählt Zielgruppe oder Wohnform.
2. Nutzer stellt Anfrage.
3. API prüft Content-Type, Größe, JSON-Typen, Feldgrenzen und Einwilligung.
4. Die validierte Anfrage wird serverseitig an `INQUIRY_WEBHOOK_URL` zugestellt.
5. Nur eine erfolgreiche HTTPS-Zustellung wird als `delivered` bestätigt.

## P1

Persistenz und Aufbewahrung liegen beim konfigurierten Empfänger. Reale
Verfügbarkeitsprüfung, Terminbuchung, Dokumentenupload, Statusverfolgung und
E-Mail-Benachrichtigung benötigen weiterhin eigene Integrationen.
