# Offene Fehler und Änderungswünsche (Sammlung während des Tests)
Stand 14.11.2026, Version Cache v11. Wird nach Testende gesammelt abgearbeitet. Nichts davon ist bisher geändert.

## 1. Vier Einsen werden mit 2000 statt 1100 gewertet
- **Beobachtet (Nutzer, iPhone):** Vier Würfel mit Wert 1 bringen 2000 Punkte.
- **Erwartet:** 1100 Punkte (Drilling aus Einsen 1000 + einzelne 1 mit 100).
- **Engine-Prüfung (`scoreSelection`, Okkult-Faktor 1, nur Standardwürfel):** 1111 ergibt 1100. Die Engine ist in diesem Fall korrekt, ebenso 111 = 1000 und 11111 = 2000. Die Ursache liegt also vermutlich nicht in der reinen Wertungsregel.
- **Zu prüfen:**
  - Waren Würfel mit Multiplikator beteiligt (Goldener Würfel `totalMult`, Okkult-Faktor ab einem okkulten Würfel, Signaturwürfel „Wucht“ oder „Zwillingswürfel“)? Dann wären 2000 gewollt, aber für den Spieler nicht nachvollziehbar.
  - Zeigt die Vorschau im Duell den gleichen Wert wie die Gutschrift?
  - Wirkt der Stern (Joker, beliebige Augenzahl) in der Wertungsvorschau wie ein weiterer Würfel?
  - Gleichmäßige Spielregeln: Fünf gleiche = 2000, deshalb Verdacht auf Fehlzuordnung bei vier Würfeln plus Hot-Dice-Folgewurf.
- **Nächster Schritt:** Spielstand oder genaue Würfelzusammenstellung des Nutzers erfragen und per Test nachstellen, danach in Engine und Tests (`engine.test.js`) einen Fall ergänzen.

## Vorlage für weitere Einträge
- **Beobachtet:** …
- **Erwartet:** …
- **Zu prüfen:** …
