# Sicherheit

- Die Anfrage-API akzeptiert ausschließlich `application/json`, weist eine
  deklarierte `Content-Length` über 16 KiB früh ab und prüft nach dem Einlesen
  auch die tatsächliche Body-Größe. Objektform, primitive Typen, erlaubte
  Profile, Feldlängen, E-Mail und Einwilligung werden strikt validiert.
- Das Anwendungslimit ist bei fehlender oder falscher `Content-Length`
  best-effort, weil der Route Handler den Stream vor der tatsächlichen
  Größenprüfung einliest. Ein vorgelagertes Plattform-/Proxy-Limit bleibt für
  Produktion erforderlich.
- Anfragen werden nur serverseitig an eine validierte HTTPS-Webhook-URL
  übertragen. Redirects, Timeouts und Nicht-2xx-Antworten gelten als Fehler.
- Webhook-Konfiguration und mögliche Zugriffstoken bleiben serverseitig.
- Fehlerantworten geben weder Webhook-URL noch Antwortinhalt des Empfängers aus.
- Globale Header setzen `nosniff`, `DENY` gegen Framing, eine restriktive
  Referrer Policy, Permissions Policy und Cross-Origin-Opener-Policy.

## Deployment-Aufgaben

- Rate Limiting/WAF, Secret Management und Monitoring ohne unnötige PII
- Aufbewahrungs-, Zugriffs- und Löschkonzept beim Webhook-Empfänger
- sichere Cookies, sobald Authentifizierung ergänzt wird
- Malware-Scan, Größenlimit und private Buckets vor Datei-Uploads

Eine strikte CSP ist bewusst nicht statisch gesetzt: Die Next.js-16-Dokumentation
beschreibt Nonces über request-time Proxy und damit dynamisches Rendering. Die
finale CSP muss zu Hosting und Integrationen passen und wird deployment-spezifisch
umgesetzt, statt die aktuelle App mit einer spröden Richtlinie zu brechen.
