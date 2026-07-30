# Sicherheit

- Anfrage-API validiert Eingaben serverseitig.
- Aktuell keine Persistenz personenbezogener Daten.
- Spätere Speicherung nur mit Zweckbindung, Einwilligung, Rollenrechten und Löschkonzept.
- Datei-Uploads benötigen Malware-Scan, Größenlimit, Content-Type-Prüfung und private Storage-Buckets.
- Produktion benötigt CSP, Rate Limiting, sichere Cookies, Logging ohne unnötige PII und Secret Management.
