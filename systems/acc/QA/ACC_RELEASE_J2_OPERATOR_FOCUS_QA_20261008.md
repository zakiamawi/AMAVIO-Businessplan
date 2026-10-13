# AMAVIO ACC Release J.2 – Operator Focus QA

**Stand:** 08.10.2026  
**Arbeitskopie:** `20261008_AMAVIO_ACC_Release_J_2_Operator_Focus_Working`  
**Ausgangsbasis:** Release J auf Port 4203, unverändert erhalten  
**Bewertung:** visuell und funktional lokal QA-grün · nicht produktiv freigegeben

## Anlass

Die Founder-Sichtung von Release J zeigte vier zusammenhängende P0-Probleme: zu viele gleichzeitig sichtbare Arbeitsbereiche, zu viele interne Informationen, abgeschnittene Texte sowie zu geringe Abstände. Die Korrektur wurde deshalb als Informationsarchitektur- und Layoutreset auf einer neuen datierten Arbeitskopie umgesetzt, nicht als punktuelle Schriftverkleinerung.

## Screenshot-Ledger

| Founder-Beobachtung | Ursache | Korrektur | Abnahme |
|---|---|---|---|
| „zu voll beladen“ | Feedback, Qualitätsmatrix, Inspector und Versionen gleichzeitig sichtbar | zwei klare Ansichten `Rückmeldungen` und `Qualität & Version`; Standardansicht zeigt nur die aktive Fallarbeit | Desktop und Mobile grün |
| „zu viele interne Informationen“ | IDs, Fixtures, Fingerprints, Provider- und Versionsdetails in der Primäransicht | progressive Offenlegung über `Prüfdetails` und `Technische Prüfdaten`; technische Werte nur nach bewusster Öffnung | Negativprüfung auf sichtbare interne Muster grün |
| „abgeschnittene Texte, Sätze, Wörter“ | überbreite Inhalte und verschobener Overflow-Kontext in der linken Spalte | neues Zweispaltenraster, keine horizontale Verschiebung der Rückmeldungsliste, eigener Clipping-/ScrollLeft-Test | `scrollLeft=0`, kein Dokumentüberlauf |
| „viel zu nah aneinander gebaut, ohne Luft“ | sehr kleine Schriftwerte, enge Tabellen und geschachtelte Rahmen | größere Typografie, 18–28 px Feldabstände, 32–60 px Bereichsabstände, ruhige Linien, weniger geschlossene Flächen | visueller Desktop-/Mobile-Abgleich grün |

## Neue Primärjourney

### Rückmeldungen

- verdichteter Lernstand mit drei statt fünf Kennzahlen;
- verständliche Fallbezüge statt Event-IDs;
- Rückmeldungsliste mit offenen und geklärten Ergebnissen;
- fokussierter Editor mit Beobachtung, Soll, Ist und sinnvoller Anpassung;
- Belegreferenzen, interne Notiz und technischer Prüfschlüssel standardmäßig geschlossen;
- verständliche „Bewusste Freigabe“ statt technischer Human-Gate-Metadaten.

### Qualität und Version

- eigener, bewusst gewählter Arbeitsmodus;
- Vergleich `Aktueller Stand` gegen `Vorschlag`;
- fünf Qualitätskriterien ohne ständig sichtbare Adapterspalte;
- drei fachlich relevante Versionsstände statt vier technischer Implementierungszeilen;
- Provider-, Fingerprint- und Regeländerungsdaten ausschließlich in der technischen Prüfebene;
- Vergleichs-Drawer auf Ergebnisqualität und manuelle Korrekturen fokussiert.

## Automatisierte Nachweise

- 196/196 Node-Tests bestanden;
- 165/165 Assurance-Tests für 51 Routen und 29 Mutationen bestanden;
- Static QA einschließlich neuer Focus-CSS-/JS-Dateien bestanden;
- Brandbook-Prüfung bestanden;
- Release-G-, H-, I- und J.2-Browserregression bestanden;
- Desktop 1440 × 1024 und Mobile 390 × 844 bestanden;
- genau eine sichtbare H1, benannte Steuerungen und beschriftete sichtbare Felder;
- kein horizontaler Dokumentüberlauf;
- keine verschobene oder abgeschnittene Rückmeldungsliste;
- keine internen IDs, Fixture-Namen oder Providerkennungen in der Standardansicht;
- technische Prüfebene bleibt erreichbar und vollständig;
- keine externen Browserrequests.

## Visuelle Nachweise

- `QA/release-j-screens/1440-operator-focus.png`
- `QA/release-j-screens/390-operator-focus.png`
- `QA/release-j-screens/1440-quality-focus.png`
- `QA/release-j-screens/1440-version-compare.png`

## Grenzen

Die Korrektur verändert ausschließlich Darstellung, Informationshierarchie und sichtbare Sprache. Die lokale synthetische Release-J-Domäne, 24 Prüffälle, Versionierung, Human Gate, Rollen- und Tenantgrenzen bleiben erhalten. Es wurden keine echte Identity, realen Daten, Provideraufrufe, Kosten, Integration, Veröffentlichung oder Deployment aktiviert.

