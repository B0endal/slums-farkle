# Der Weg aus den Slums
Farkle-Roguelite als Browserspiel (Vanilla-JS, PWA, mobil zuerst).

Spielen: https://b0endal.github.io/slums-farkle/ (iPhone: Safari, Teilen, Zum Home-Bildschirm)

## Aufbau
- `index.html`, `sw.js`, `manifest.webmanifest`, `icons/`: das ausgelieferte Spiel (index.html wird gebaut, nicht von Hand ändern)
- `game.src.html`: gesamte Spiellogik und Oberfläche (Quelle)
- `engine.js`, `dice.json`, `dicenames.js`: Spiellogik, 124 Würfel, Namen
- `engine.test.js`: Tests (`node engine.test.js`)
- `build.py`: setzt `index.html` aus den Quellen zusammen (`python3 build.py`)
- `tools/sim/`: Balancing-Simulationen (`node tools/sim/sim5.js`)
- `docs/`: Checkliste, Übergabe für neue Chats, Verlaufsprotokoll, Balancing-Ergebnisse, alte Würfel-Tabelle (zwei Blätter veraltet)

## Release
1. `node engine.test.js`
2. `python3 build.py`
3. Cache-Namen in `sw.js` hochzählen
4. Commit und Push auf `main`, Pages veröffentlicht automatisch

`dice.json` ist die Quelle der Würfel. Die frühere Erzeugung aus der Tabelle ist entfernt, weil sie die Signaturwürfel überschrieben hätte.
