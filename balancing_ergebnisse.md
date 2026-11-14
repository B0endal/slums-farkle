## 1. KI-Profile gegeneinander (je 6 Standardwürfel, Ziel 2000, Siegquote der Zeile)
| Profil | vorsichtig | ausgewogen | risikofreudig | jaeger | Züge je Duell |
|---|---|---|---|---|---|
| vorsichtig | 49 % | 49 % | 49 % | 53 % | 5.8 |
| ausgewogen | 48 % | 52 % | 50 % | 49 % | 5.8 |
| risikofreudig | 51 % | 50 % | 47 % | 53 % | 5.7 |
| jaeger | 50 % | 51 % | 48 % | 53 % | 5.8 |

## 2. Startbeutel (4 beschädigt + 2 Standard) des Spielers gegen NPCs (Spieler spielt ausgewogen)
| Gegner (Pool, Profil, Ziel) | Siegquote Start | Siegquote als Zweiter | gesamt | Züge |
|---|---|---|---|---|
| Slums (1, vorsichtig, 1500) | 49 % | 39 % | 44 % | 5.7 |
| Handelsstraße (2, ausgewogen, 2000) | 48 % | 31 % | 40 % | 7.4 |
| Kneipe (2, risikofreudig, 2500) | 47 % | 34 % | 40 % | 9.3 |
| Hafen (3, risikofreudig, 3000) | 39 % | 30 % | 35 % | 10.9 |

## 3. Beuteltypen gegen 6 Standardwürfel (beide ausgewogen, Ziel 2000)
| Beutel | Siegquote | Züge |
|---|---|---|
| 6 Standard | 51 % | 5.8 |
| Startbeutel | 30 % | 6.5 |
| Gezinkt Stufe 4 (6 Stück) | 41 % | 6.1 |
| 1 Okkult + 5 Standard | 33 % | 6.5 |
| 2 Okkulte + 4 Standard | 54 % | 5.9 |
| 3 Okkulte + 3 Standard | 72 % | 4.3 |
| 4 Okkulte + 2 Standard | 84 % | 3.2 |
| 6 Okkulte | 88 % | 2.8 |
| Golden G1–G6 | 98 % | 1.5 |
| Beutel gegen 6 Standard (ausgewogen, Ziel 2000) | Siegquote |
|---|---|
| 6x t15 Stufe 1 | 66 % |
| 6x t15 Stufe 4 | 81 % |
| 6x t456 Stufe 1 | 60 % |
| 6x t456 Stufe 4 | 80 % |
| 6x t23 Stufe 1 | 58 % |
| 6x t23 Stufe 4 | 76 % |
| 6x T1 (Einzelseite) | 75 % |
| 6x T5 (Einzelseite) | 65 % |
| 6x T2 (Einzelseite) | 55 % |
| 6x T6 (Einzelseite) | 64 % |
| 1 Golden (g1) + 5 Standard | 55 % |
| 1 Golden (g5) + 5 Standard | 54 % |
| 1 Golden (g3) + 5 Standard | 43 % |
| 2 Golden (g1,g5) + 4 Standard | 61 % |
| 2 Okkulte + 4 Standard | 55 % |

# Teil 2: Balancing der Welt nach Spezifikation v3 (sim3.js, 300 Duelle je Zelle, Streuung etwa ±6 Prozentpunkte)

| Gegner (Gruppe, Profil, Ziel, Min) | Startbeutel | 6 Standard | 3 gezinkt St. 1-2 + 3 Std | 6 gezinkt St. 2-3 | 6 gezinkt St. 4 | 2 Okkulte + 4 gezinkt St. 4 |
|---|---|---|---|---|---|---|
| Slums (1, vorsichtig, 1500, 1) | 47 % | 62 % | 56 % | 59 % | 53 % | 61 % |
| Handelsstraße (2, ausgewogen, 2000, 10) | 34 % | 57 % | 59 % | 56 % | 50 % | 62 % |
| Kneipe (Hasso) (2, risikofreudig, 2500, 20) | 38 % | 62 % | 56 % | 54 % | 54 % | 55 % |
| Hafen (Schiffsmeister) (3, risikofreudig, 3000, 30) | 37 % | 57 % | 56 % | 48 % | 55 % | 62 % |
| Nachtwache/Tagwache (3, ausgewogen, 3000, 30) | 32 % | 63 % | 55 % | 53 % | 49 % | 63 % |
| Marktplatz (4, risikofreudig, 5000, 100) | 25 % | 58 % | 53 % | 49 % | 49 % | 56 % |
| Gildenmeister (4, jaeger, 6000, 100) | 34 % | 63 % | 57 % | 60 % | 55 % | 64 % |
| Inneres Schloss (5, jaeger, 6000, 100) | 32 % | 64 % | 51 % | 54 % | 57 % | 67 % |
| Torsaal (5, jaeger, 7500, 100) | 33 % | 66 % | 58 % | 54 % | 53 % | 67 % |
| Ruine: Beschwörer (6b, jaeger, 5000, 50) | 53 % | 68 % | 66 % | 70 % | 65 % | 72 % |

## Erwarteter Silbergewinn je Duell bei Höchsteinsatz (3 × Mindesteinsatz), (2w − 1) · Einsatz

| Gegner | Startbeutel | 6 Standard | 3 gezinkt St. 1-2 + 3 Std | 6 gezinkt St. 2-3 | 6 gezinkt St. 4 | 2 Okkulte + 4 gezinkt St. 4 |
|---|---|---|---|---|---|---|
| Slums | -0.2 | 0.7 | 0.4 | 0.5 | 0.2 | 0.7 |
| Handelsstraße | -9.4 | 4.0 | 5.4 | 3.6 | 0.0 | 7.2 |
| Kneipe (Hasso) | -14.8 | 14.4 | 6.8 | 5.2 | 5.2 | 5.6 |
| Hafen (Schiffsmeister) | -22.8 | 13.2 | 10.8 | -3.0 | 9.0 | 21.0 |
| Nachtwache/Tagwache | -33.0 | 22.8 | 8.4 | 4.8 | -1.8 | 22.8 |
| Marktplatz | -150.0 | 48.0 | 20.0 | -4.0 | -8.0 | 38.0 |
| Gildenmeister | -94.0 | 76.0 | 44.0 | 62.0 | 30.0 | 82.0 |
| Inneres Schloss | -110.0 | 84.0 | 8.0 | 24.0 | 42.0 | 102.0 |
| Torsaal | -102.0 | 96.0 | 50.0 | 24.0 | 20.0 | 104.0 |
| Ruine: Beschwörer | 9.0 | 55.0 | 49.0 | 60.0 | 45.0 | 66.0 |

## Wichtige Preise

Bürgerkleidung 200, Adelskleidung 2000, Kanalisationsschlüssel 500. Start 20 Silber. Budget eines NPC = 5 × Mindesteinsatz, Höchsteinsatz = 3 × Mindesteinsatz.

## Beobachtungen
1. **Der Startbeutel ist sehr schwach.** Mit den vier beschädigten und zwei Standardwürfeln gewinnt der Spieler gegen die Handelsstraße (Startort, Mindesteinsatz 10) nur etwa 34 %. Bei Höchsteinsatz sind das im Mittel −9 Silber je Duell bei 20 Silber Startkapital. Einzig die Slums (Mindesteinsatz 1) sind ungefährlich, aber dort ist der Gewinn je Duell fast null (Höchsteinsatz 3).
2. **Ein Beutel aus sechs Standardwürfeln schlägt den Startbeutel um 15 bis 30 Prozentpunkte.** Die beschädigten Würfel sind also das eigentliche Handicap, und der erste Würfelgewinn (Final Offer in den Slums) ist der wichtigste Schritt der Frühphase.
3. **Hohe Beutel gewinnen gegen reiche Pools nur wenig.** Sechs gezinkte Würfel der Stufe 4 liegen gegen Poolgruppe 4 und 5 bei etwa 50 bis 57 %, kaum besser als Stufe 2 bis 3 (die Streuung deckt den Unterschied). Der Vorteil gegen Standardwürfel (etwa 81 %) wird von den ebenfalls gezinkten Pools der Reichen fast aufgehoben. Nennenswert besser sind nur Beutel mit Okkulten (56 bis 67 %) und Golden Picks.
4. **Die Ruine ist leicht.** Der Okkulte Beschwörer (Gruppe 6b, 50 Silber Mindesteinsatz) wird von jedem Beutel zu 53 bis 72 % geschlagen, bei Höchsteinsatz 150 Silber. Das ist der ergiebigste Gegner der Welt für den Aufwand.
5. **Ohne Gegenmaßnahme ist die Frühphase hart:** Bürgerkleidung (200 Silber) braucht mit dem Startbeutel viele Duelle in den Slums oder einen schnellen Würfelgewinn. Adelskleidung (2000) ist erst mit einem Beutel von etwa 55 bis 65 % in Gilde und Schloss in vertretbarer Zeit erreichbar (Höchsteinsatz 100 Silber, etwa 76 Silber Erwartung je Duell).

## Mögliche Stellschrauben (noch nicht umgesetzt)
- Startsilber von 20 auf 30 bis 40 erhöhen oder die Mindesteinsätze an der Handelsstraße auf 5 senken, damit der Startort kein Bankrott in drei Duellen ist.
- Beschädigte Würfel milder machen (zum Beispiel weniger defekte Seiten im Start-Pool).
- Poolgruppe 4 und 5 etwas weniger stark mit Gezinkt Stufe 3 bis 4 besetzen, damit sich Aufrüsten spürbar lohnt, oder den Okkult-Anteil nicht senken.
- Ruine als Frühziel zeitlich verzögern (Story-Freischaltung), da sie sonst die Wirtschaft kurzschließt. Das passt zum Backlog „Ruinen-Story“.

# Teil 3: Entscheidung zur Frühphase (umgesetzt)
Beschlossen und im Prototyp umgesetzt: Startsilber 30 (statt 20) und die Slums-Gegner würfeln mit nur 5 Würfeln, bis sie einen Würfel vom Spieler gewinnen (dann haben sie 6). Mit `FEW_DICE` und `START_SILVER` in game.src.html lässt sich beides ändern.

Messung mit sim4.js (2000 Duelle je Zelle, Slums-Pool Gruppe 1, vorsichtig, Ziel 1500, beginnt im Wechsel):

| Spielerbeutel | Slums-Gegner mit 6 Würfeln | Slums-Gegner mit 5 Würfeln |
|---|---|---|
| Startbeutel | 40 % | 73 % |
| 6 Standard | 59 % | 87 % |

Die Regel hebt die Siegquote des Startbeutels in den Slums von etwa 40 % auf 73 %. Das ist ein klarer Einstieg: Mit Höchsteinsatz 3 und Budget 5 löst oft schon der zweite Sieg das letzte Angebot aus, und der erste Würfelgewinn kommt früh. Bei Bedarf kann man das über das Ziel der Slums (1500) oder das Profil nachjustieren. Die Handelsstraße bleibt mit 30 Silber Start besser abgesichert (drei Verluste statt zwei bei Mindesteinsatz 10).
