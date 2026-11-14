// Farkle-Kern: reine Funktionen ohne DOM-Zugriff. Zufall immer über einen injizierbaren Generator rng() -> [0,1).
(function (root) {
  "use strict";

  // ---------- Würfel ----------
  function sideProbabilities(die) {
    const total = die.sides.reduce((a, s) => a + s.weight, 0);
    return die.sides.map(s => s.weight / total);
  }

  function rollSideIndex(die, rng) {
    const total = die.sides.reduce((a, s) => a + s.weight, 0);
    let x = rng() * total;
    for (let i = 0; i < die.sides.length; i++) {
      x -= die.sides[i].weight;
      if (x < 0) return i;
    }
    return die.sides.length - 1;
  }

  // Okkult-Faktor: 0,5 x Anzahl okkulter Würfel in der aktiven Tasche (Duell-Start), gedeckelt auf höchstens x3
  let OCCULT_FACTOR_MAX = 3;   // mit dem Okkulten Set (Aschenkreis) 4
  function setOccultMax(n) { OCCULT_FACTOR_MAX = n; }
  function occultFactor(dice) {
    return Math.min(OCCULT_FACTOR_MAX, 0.5 * dice.filter(d => d.category === "okkult").length);
  }

  // ---------- Kompendium: Aussagekraft der Messwerte (Spezifikation Abschnitt 12) ----------
  // Richtwert für 95 % Konfidenz und ±5 % Genauigkeit: n = 1,96² · (1 − p) / (p · 0,05²)
  const CONFIDENCE_NAMES = ["unklar", "Tendenz", "wahrscheinlich", "gesichert"];
  function samplesNeeded(p) { return p <= 0 ? Infinity : (1.96 * 1.96 * (1 - p)) / (p * 0.05 * 0.05); }
  // n = Würfe gesamt, k = Treffer dieser Seite. Stufe 0 bis 3 (unklar, Tendenz, wahrscheinlich, gesichert).
  function confidenceLevel(n, k) {
    if (n <= 0) return 0;
    if (k <= 0) return n < 500 ? 0 : n < 2000 ? 1 : n < 7700 ? 2 : 3;   // nie gesehene Seite: Annahme, an p = 1/6 angelehnt
    const r = n / samplesNeeded(k / n);
    return r < 0.15 ? 0 : r < 0.5 ? 1 : r < 1 ? 2 : 3;
  }

  // ---------- Wertung ----------
  // Eintrag: { value, mult, totalMult, occult }. Wirkung eines Würfels = mult * totalMult * (occult ? factor : 1)
  function dieEffect(d, factor) {
    return (d.mult || 1) * (d.totalMult || 1) * (d.occult ? factor : 1);
  }

  // Wertetabelle (Regelbild). Einzelne 1 und 5 sind hier einstellbar.
  const RULES = {
    single: { 1: 100, 5: 50 },
    triple: { 1: 1000, 2: 200, 3: 300, 4: 400, 5: 500, 6: 600 },
    four: 1000, five: 2000, six: 3000,
    partialStraight: 750, straight: 1500, threePair: 1500, doubleTriple: 2500, fourPlusPair: 1500
  };

  // Grundwert einer Würfelgruppe als eine Kombination, oder 0 wenn sie keine ist
  function comboBase(vals) {
    const n = vals.length;
    if (vals.some(v => v === 0)) return { base: 0 };
    if (n === 1) { const b = RULES.single[vals[0]]; return b ? { base: b, type: "single" } : { base: 0 }; }
    const cnt = {}; vals.forEach(v => (cnt[v] = (cnt[v] || 0) + 1));
    const keys = Object.keys(cnt).map(Number), counts = keys.map(k => cnt[k]).sort((a, b) => b - a);
    if (keys.length === 1) {
      if (n === 3) return { base: RULES.triple[keys[0]], type: "triple" };
      if (n === 4) return { base: RULES.four, type: "four" };
      if (n === 5) return { base: RULES.five, type: "five" };
      if (n === 6) return { base: RULES.six, type: "six" };
      return { base: 0 };
    }
    const sorted = vals.slice().sort((a, b) => a - b).join("");
    if (n === 5 && (sorted === "12345" || sorted === "23456")) return { base: RULES.partialStraight, type: "partialStraight" };
    if (n === 6) {
      if (sorted === "123456") return { base: RULES.straight, type: "straight" };
      if (counts.join() === "2,2,2") return { base: RULES.threePair, type: "threePair" };
      if (counts.join() === "3,3") return { base: RULES.doubleTriple, type: "doubleTriple" };
      if (counts.join() === "4,2") return { base: RULES.fourPlusPair, type: "fourPlusPair" };
    }
    return { base: 0 };
  }

  // Beste Aufteilung der Auswahl in Kombinationen. Jeder gewählte Würfel muss zählen.
  // Liefert { score, combos } oder null.
  function scoreSelection(sel, factor) {
    const n = sel.length;
    if (!n || n > 6) return null;
    const full = (1 << n) - 1, info = new Array(full + 1);
    for (let m = 1; m <= full; m++) {
      const idx = []; for (let i = 0; i < n; i++) if (m & (1 << i)) idx.push(i);
      const c = comboBase(idx.map(i => sel[i].value));
      if (c.base) { const mult = idx.reduce((a, i) => a * dieEffect(sel[i], factor), 1); info[m] = { type: c.type, base: c.base, mult, pts: Math.round(c.base * mult) }; }
    }
    const best = new Array(full + 1).fill(null); best[0] = { score: 0, combos: [] };
    for (let m = 1; m <= full; m++) {
      const low = m & -m;
      for (let sub = m; sub; sub = (sub - 1) & m) {
        if (!(sub & low) || !info[sub]) continue;
        const rest = best[m ^ sub]; if (!rest) continue;
        const sc = rest.score + info[sub].pts;
        if (!best[m] || sc > best[m].score) best[m] = { score: sc, combos: rest.combos.concat([info[sub]]) };
      }
    }
    return best[full];
  }

  // Gibt es im Wurf irgendeine wertbare Auswahl? (sonst Farkle)
  function hasScoring(dice) {
    const n = dice.length;
    for (let m = 1; m < 1 << n; m++) {
      const sel = []; for (let i = 0; i < n; i++) if (m & (1 << i)) sel.push(dice[i]);
      if (scoreSelection(sel, 0)) return true;
    }
    return false;
  }

  // Alle gültigen Teilmengen (Indizes) eines Wurfs mit ihrem Wert
  function validSelections(dice, factor) {
    const out = [], n = dice.length;
    for (let mask = 1; mask < 1 << n; mask++) {
      const idx = [];
      for (let i = 0; i < n; i++) if (mask & (1 << i)) idx.push(i);
      const r = scoreSelection(idx.map(i => dice[i]), factor);
      if (r) out.push({ idx, score: r.score });
    }
    return out;
  }

  // ---------- Zug ----------
  // Ein Zugzustand: dice = Würfel auf dem Tisch [{ id, value, mult, totalMult, occult, locked }]
  function rollUnlocked(dice, dbById, rng) {
    return dice.map(d => {
      if (d.locked) return d;
      const die = dbById[d.id];
      const si = rollSideIndex(die, rng);
      const s = die.sides[si];
      return Object.assign({}, d, { side: si, value: s.value, mult: s.mult, selected: false });
    });
  }

  // Nach "Behalten": ausgewählte Würfel sperren. Hot Dice, wenn danach alle gesperrt sind.
  function keepSelected(dice) {
    const next = dice.map(d => (d.selected ? Object.assign({}, d, { locked: true, selected: false }) : d));
    const hot = next.length > 0 && next.every(d => d.locked);
    return hot ? { dice: next.map(d => Object.assign({}, d, { locked: false })), hot: true } : { dice: next, hot: false };
  }

  // ---------- KI ----------
  const AI_PROFILES = {
    vorsichtig:    { bank: 300, rule: (t, rem) => rem <= 2 },
    ausgewogen:    { bank: 450, rule: (t, rem) => rem <= 3 && t >= 300 },
    risikofreudig: { bank: 600, rule: (t, rem) => rem <= 2 && t >= 300 },
    jaeger:        { bank: 800, rule: (t, rem) => rem <= 1 && t >= 500 }
  };
  const REMAIN_BONUS = { 0: 350, 1: -150, 2: -50, 3: 0, 4: 60, 5: 120, 6: 150 };

  // Wahl der Würfel: Punkte plus Bonus für übrig bleibende Würfel
  function aiChoose(dice, factor) {
    const free = dice.map((d, i) => ({ d, i })).filter(x => !x.d.locked);
    const sels = validSelections(free.map(x => x.d), factor);
    if (!sels.length) return null;
    let best = null;
    for (const s of sels) {
      const rem = free.length - s.idx.length;
      const v = s.score + REMAIN_BONUS[rem];
      if (!best || v > best.v) best = { v, idx: s.idx.map(k => free[k].i), score: s.score, rem };
    }
    return best;
  }

  // Abschicken?
  function aiShouldBank(profileName, turnScore, remaining, myScore, target) {
    if (turnScore <= 0) return false;
    if (myScore + turnScore >= target) return true;
    const p = AI_PROFILES[profileName] || AI_PROFILES.ausgewogen;
    if (remaining === 0) return false; // Hot Dice: weiter
    return turnScore >= p.bank || p.rule(turnScore, remaining);
  }

  // Ein kompletter KI-Zug ohne UI. Gibt { banked, score, log } zurück.
  function aiPlayTurn(opts) {
    const { dice: bag, dbById, factor, profile, myScore, target, rng } = opts;
    let table = bag.map(d => ({ id: d.id, occult: d.category === "okkult", totalMult: 1, locked: false }));
    let turn = 0, log = [];
    for (let guard = 0; guard < 60; guard++) {
      table = rollUnlocked(table, dbById, rng);
      const free = table.filter(d => !d.locked);
      if (!hasScoring(free)) { log.push("farkle"); return { banked: false, score: 0, log }; }
      const pick = aiChoose(table, factor);
      pick.idx.forEach(i => (table[i] = Object.assign({}, table[i], { selected: true })));
      turn += pick.score;
      const k = keepSelected(table);
      table = k.dice;
      const remaining = k.hot ? 0 : table.filter(d => !d.locked).length;
      log.push({ kept: pick.score, remaining });
      if (aiShouldBank(profile, turn, remaining, myScore, target)) return { banked: true, score: turn, log };
    }
    return { banked: true, score: turn, log };
  }

  // Ganzes Duell zwischen zwei Beuteln (für Tests und Simulator). Beide spielen KI-Profile.
  function simulateDuel(a, b, target, rng, maxTurns) {
    const sc = { a: 0, b: 0 };
    const sides = { a, b };
    const first = a.starts === false ? "b" : "a";
    let who = first, turns = 0;
    while (turns++ < (maxTurns || 400)) {
      const s = sides[who];
      const r = aiPlayTurn({ dice: s.dice, dbById: s.dbById, factor: occultFactor(s.dice), profile: s.profile, myScore: sc[who], target, rng });
      if (r.banked) sc[who] += r.score;
      if (sc[who] >= target) return { winner: who, turns, scores: sc };
      who = who === "a" ? "b" : "a";
    }
    return { winner: null, turns, scores: sc };
  }

  // ---------- Zufall ----------
  function mulberry32(a) {
    return function () {
      a |= 0; a = (a + 0x6D2B79F5) | 0;
      let t = Math.imul(a ^ (a >>> 15), 1 | a);
      t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
      return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
    };
  }

  const api = { RULES, OCCULT_FACTOR_MAX, CONFIDENCE_NAMES, samplesNeeded, confidenceLevel, sideProbabilities, rollSideIndex, occultFactor, setOccultMax, scoreSelection, hasScoring, validSelections,
    rollUnlocked, keepSelected, AI_PROFILES, aiChoose, aiShouldBank, aiPlayTurn, simulateDuel, mulberry32 };
  if (typeof module !== "undefined" && module.exports) module.exports = api; else root.FarkleEngine = api;
})(typeof globalThis !== "undefined" ? globalThis : this);
