# AMAVIO One CRM – R3 Copy and Scope Verification

**Datum:** 09.10.2026  
**Status:** bestanden

Vor der R3-Änderung wurde der vollständige Canonical-Core-Stand in `20261009_AMAVIO_One_CRM_Canonical_Core_Sicherung_Pre_R3` gesichert und zusätzlich als `20261009_AMAVIO_One_CRM_R3_Contract_Alignment_Working` kopiert. Ein rekursiver Dateivergleich bestätigte unmittelbar nach dem Kopieren die Inhaltsgleichheit von Quelle, Sicherung und Arbeitskopie. Die Quelle wurde danach nicht bearbeitet.

Ein anfänglicher `cp -a`-Versuch meldete ausschließlich nicht-destruktive macOS-Flag-Warnungen an symbolischen Links unter `node_modules/.bin`. Die Kopien wurden daraufhin mit `rsync -a` vervollständigt und anschließend vollständig verglichen. Es wurden keine Dateien gelöscht, keine Konfiguration außerhalb der Arbeitskopie verändert und keine externen Systeme angesprochen.

Der R3-Code verwendet den neuen lokalen Schlüssel `amavio-one-crm-r3-contract-alignment-v3`. Die Schlüssel `amavio-one-crm-cockpit-v1` und `amavio-one-crm-canonical-core-v2` bleiben erhalten und werden nicht automatisch importiert oder überschrieben.

Die Scope-Kontrolle umfasst ausschließlich Bündel A und B. Die acht Bündel-C-Fähigkeiten bleiben gesperrt. Es erfolgten kein Deployment, kein Git-Push, keine Veröffentlichung, kein Login, keine Datenübertragung und keine Verarbeitung produktiver Daten.

Nach Abschluss sämtlicher R3-Änderungen und Prüfungen wurde die Canonical-Core-Quelle erneut rekursiv gegen die Pre-R3-Sicherung verglichen. Ergebnis: **identisch**. Damit ist belegt, dass ausschließlich die R3-Arbeitskopie verändert wurde.
