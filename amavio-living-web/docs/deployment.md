# Deployment

## Build und Laufzeit

- Lokale Ausführung: `npm run dev`
- Produktionsprüfung: `npm run lint` und `npm run build`
- Deployment benötigt eine Next.js-16-kompatible Node.js-Laufzeit.
- `npm run build` führt über `prebuild` automatisch
  `npm run validate:site-url` aus.

## Pflichtkonfiguration

- `SITE_URL`: echte kanonische HTTPS-Origin ohne Pfad, Query oder Fragment.
  Sie muss vor **jedem umgebungsspezifischen `next build`** korrekt gesetzt
  sein. Metadata, `robots.txt` und `sitemap.xml` werden statisch mit diesem Wert
  erzeugt. Eine spätere Änderung der Laufzeitvariable wirkt erst nach erneutem
  Build und Deployment.
- Ohne `SITE_URL` erlaubt der Validator nur einen lokalen/nicht deploybaren
  Build mit `http://localhost:3000` und gesperrten Crawlern. Ein gesetzter,
  fehlerhafter Wert bricht den Build früh mit einer konkreten Meldung ab.
- `INQUIRY_WEBHOOK_URL`: serverseitige HTTPS-URL für Anfragen. Sie darf niemals
  mit `NEXT_PUBLIC_` exponiert werden. Ohne Wert antwortet die API mit `503`.

Die Zielplattform muss beide Werte als Server-Environment-Variablen verwalten.
Webhook-Zugriffstoken können Bestandteil der geheimen URL sein. Preview- und
Produktionsumgebungen sollten getrennte Empfänger verwenden. Für Preview und
Produktion sind getrennte Builds mit der jeweils passenden `SITE_URL`
erforderlich; ein bereits gebautes Artefakt darf nicht unverändert zwischen
Domains verschoben werden.

## Vor öffentlicher Produktion

- vollständige Impressums- und Datenschutzpflichtangaben verifizieren
- Aufbewahrung, Zugriff, Löschung und Benachrichtigung im Webhook-Empfänger klären
- reale Domain und HTTPS prüfen
- Rate Limiting/WAF und Monitoring auf Deployment-Ebene aktivieren
- plattformseitiges Request-Body-/Streaming-Limit für `/api/inquiries` setzen
- CSP anhand der finalen Hosting-, Script- und Integrationsanforderungen umsetzen
- Desktop, Mobile, Tastaturbedienung sowie Erfolgs- und Fehlerfälle abnehmen
