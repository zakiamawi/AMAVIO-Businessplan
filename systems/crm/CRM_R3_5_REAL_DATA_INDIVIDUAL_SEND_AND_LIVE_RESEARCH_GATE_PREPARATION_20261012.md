# R3.5 Vorbereitung der Folgetore – Reale Daten, Einzelversand und Live Research

**Status:** vorbereitet, nicht freigegeben  
**Wirkung:** keine Aktivierung, kein Einkauf, kein Login und keine Außenaktion

## G1 – Begrenzte reale Daten

Vor einem gesonderten Beschluss müssen mindestens Zweck und Datenumfang, Rechtsgrundlagenprüfung, Informationspflichten, Aufbewahrung/Löschung, Betroffenenrechte, Geräte- und Backupschutz, Zugriffskonzept, Rollenverantwortung, Import-/Bereinigungsverfahren und ein dokumentierter Rollback geklärt sein. Der R3.5-Prototyp kann Datenqualität und fehlende Nachweise anzeigen, verarbeitet aber weiterhin ausschließlich synthetische Daten.

## G2 – Kontrollierter Einzelversand

Ein späterer Einzelversand benötigt mindestens einen gesondert ausgewählten und geprüften Anbieter, Vertrag/AVV und Transferprüfung, authentifizierte und geschützte Verbindung, Absender- und Domainkonfiguration, Sendelog, Zustell-/Bounce-/Beschwerdebehandlung, Abmelde- und Suppressionsdurchsetzung, Rollen- und Freigaberechte, Kostenlimit, Rate Limit, Not-Aus, Testumgebung sowie eine bestätigte Rechts- und Datenschutzprüfung für Zweck, Zielgruppe und Kanal.

R3.5 bereitet nur den fachlichen Preflight vor. Der Provideradapter bleibt `disabled`, `externalWritesAllowed` bleibt `false`, Versandlimits bleiben null und `sentAt` wird nicht gesetzt.

## G4/G5 – Erlaubtes Live Research

Vor Live Research sind die konkreten Quellen einzeln zu beschließen. Zulässig sind nur Quellen und Zugriffswege, deren Nutzungsbedingungen, Robots-/API-Regeln, Datenschutzrolle, Zweckbindung, Speicherumfang, Aktualisierung und Nachweisführung geprüft wurden. Login-, CAPTCHA-, Paywall- oder Zugriffsschutzumgehung bleibt dauerhaft ausgeschlossen. Offizielle APIs, lizenzierte Exporte oder ausdrückliche Anbieterfreigaben sind der vorgesehene Weg.

## Beschlusslogik

Die drei Gates sind unabhängig. Die Freigabe realer Daten erlaubt keinen Versand. Die Freigabe eines Einzelversands erlaubt keinen Massenversand und keine Automation. Die Freigabe einer Research-Quelle erlaubt keine anderen Quellen. Jeder Beschluss benötigt Umfang, Verantwortliche, Kostenobergrenze, technische Schutzmaßnahmen, Abbruchkriterien und QA-Nachweis. Bis dahin zeigt das Cockpit für alle drei Bereiche „Nicht freigegeben“.
