// Balancing der Welt nach Spezifikation v3: Siegquoten verschiedener Spielerbeutel gegen die echten Poolgruppen 1 bis 6c
// und der Silberfluss. Aufruf: node sim3.js [Duelle je Zelle]
const E = require("../../engine.js"), DB = require("../../dice.json");
const byId = Object.fromEntries(DB.map(d => [d.id, d]));
const T = +process.argv[2] || 400, rng = E.mulberry32(20261113);
const pick = a => a[Math.floor(rng() * a.length)], bag = ids => ids.map(id => byId[id]);
const GROUPS = { // wie in game.src.html (Abschnitt 13.5)
  "1": { std: 60, bd: 32, bq: 8, gez: 0, lv: {}, cap: 0, gold: 0, occ: 0, occCap: 0 },
  "2": { std: 60, bd: 22, bq: 8, gez: 10, lv: { 1: 1 }, cap: 1, gold: 0, occ: 0, occCap: 0 },
  "3": { std: 40, bd: 12, bq: 8, gez: 40, lv: { 1: 25, 2: 15 }, cap: 2, gold: 0, occ: 0, occCap: 0 },
  "4": { std: 28, bd: 5, bq: 5, gez: 61, lv: { 1: 11, 2: 20, 3: 20, 4: 10 }, cap: 3, gold: 1, goldCap: 1, occ: 0, occCap: 0 },
  "5": { std: 16, bd: 0, bq: 0, gez: 80, lv: { 2: 16, 3: 34, 4: 30 }, cap: 4, gold: 2, goldCap: 1, occ: 2, occCap: 1 },
  "6b": { std: 15, bd: 10, bq: 5, gez: 50, lv: { 1: 15, 2: 20, 3: 15 }, cap: 6, gold: 0, occ: 20, occCap: 3 }
};
const wp = items => { const t = items.reduce((a, x) => a + x[1], 0); let x = rng() * t; for (const [v, w] of items) { x -= w; if (x < 0) return v; } return items[items.length - 1][0]; };
function slot(g, pool) {
  const cnt = c => pool.filter(d => d.category === c).length;
  const cat = wp([["std", g.std], ["bd", g.bd], ["bq", g.bq], ["gez", g.gez], ["gold", g.gold], ["occ", g.occ]].filter(x => x[1] > 0));
  if (cat === "gez") { if (cnt("gezinkt") >= g.cap) return byId.std; return byId[pick(["t15", "t456", "t23"]) + "_" + wp(Object.entries(g.lv))]; }
  if (cat === "gold") return cnt("golden") >= (g.goldCap || 0) ? byId.std : byId[pick(["g1", "g2", "g3", "g4", "g5", "g6"])];
  if (cat === "occ") return cnt("okkult") >= (g.occCap || 0) ? byId.std : byId[pick(["o", "o_1", "o_2", "o_3", "o_4", "o_5", "o_6"])];
  if (cat === "bd" || cat === "bq") return byId[`${cat}_f${1 + Math.floor(rng() * 6)}_m${1 + Math.floor(rng() * 6)}`];
  return byId.std;
}
const npcPool = g => { const p = []; for (let i = 0; i < 6; i++) p.push(slot(GROUPS[g], p)); return p; };
const startBag = () => { const o = []; for (let i = 0; i < 4; i++) o.push(byId[`${rng() < .5 ? "bd" : "bq"}_f${1 + Math.floor(rng() * 6)}_m${1 + Math.floor(rng() * 6)}`]); return o.concat(bag(["std", "std"])); };
const BAGS = [
  ["Startbeutel", startBag],
  ["6 Standard", () => bag(Array(6).fill("std"))],
  ["3 gezinkt St. 1-2 + 3 Std", () => bag(["t15_1", "t456_2", "t23_2", "std", "std", "std"])],
  ["6 gezinkt St. 2-3", () => bag(["t15_2", "t456_2", "t23_3", "t15_3", "t456_3", "t23_2"])],
  ["6 gezinkt St. 4", () => bag(["t456_4", "t456_4", "t15_4", "t15_4", "t23_4", "t23_4"])],
  ["2 Okkulte + 4 gezinkt St. 4", () => bag(["o", "o_1", "t456_4", "t15_4", "t15_4", "t23_4"])]
];
const NPC = [ // [Name, Gruppe, Profil, Ziel, Mindesteinsatz]
  ["Slums", "1", "vorsichtig", 1500, 1], ["Handelsstraße", "2", "ausgewogen", 2000, 10], ["Kneipe (Hasso)", "2", "risikofreudig", 2500, 20],
  ["Hafen (Schiffsmeister)", "3", "risikofreudig", 3000, 30], ["Nachtwache/Tagwache", "3", "ausgewogen", 3000, 30], ["Marktplatz", "4", "risikofreudig", 5000, 100],
  ["Gildenmeister", "4", "jaeger", 6000, 100], ["Inneres Schloss", "5", "jaeger", 6000, 100], ["Torsaal", "5", "jaeger", 7500, 100], ["Ruine: Beschwörer", "6b", "jaeger", 5000, 50]
];
function winRate(mkA, npc) {
  let w = 0, turns = 0;
  for (let i = 0; i < T; i++) { const st = i % 2 === 0;
    const r = E.simulateDuel({ dice: mkA(), dbById: byId, profile: "ausgewogen", starts: st }, { dice: npcPool(npc[1]), dbById: byId, profile: npc[2], starts: !st }, npc[3], rng, 400);
    if (r.winner === "a") w++; turns += r.turns; }
  return { w: w / T, turns: turns / T };
}
const pct = x => (100 * x).toFixed(0) + " %";
const out = [`## Siegquoten der Spielerbeutel gegen die Poolgruppen der Welt (${T} Duelle je Zelle, Spieler ausgewogen, beginnt im Wechsel)`, "", "| Gegner (Gruppe, Profil, Ziel, Min) | " + BAGS.map(b => b[0]).join(" | ") + " |", "|---|" + BAGS.map(() => "---|").join("")];
const table = {};
for (const npc of NPC) { const cells = []; table[npc[0]] = {}; for (const [bn, mk] of BAGS) { const r = winRate(mk, npc); table[npc[0]][bn] = r.w; cells.push(pct(r.w)); } out.push(`| ${npc[0]} (${npc[1]}, ${npc[2]}, ${npc[3]}, ${npc[4]}) | ${cells.join(" | ")} |`); }
// Silberfluss: erwarteter Gewinn je Duell bei Höchsteinsatz (3 x Min) = (2w - 1) * 3 * Min
out.push("", "## Erwarteter Silbergewinn je Duell bei Höchsteinsatz (3 × Mindesteinsatz), (2w − 1) · Einsatz", "", "| Gegner | " + BAGS.map(b => b[0]).join(" | ") + " |", "|---|" + BAGS.map(() => "---|").join(""));
for (const npc of NPC) out.push(`| ${npc[0]} | ${BAGS.map(([bn]) => ((2 * table[npc[0]][bn] - 1) * 3 * npc[4]).toFixed(1)).join(" | ")} |`);
// Kosten wichtiger Ziele
out.push("", "## Wichtige Preise", "", "Bürgerkleidung 200, Adelskleidung 2000, Kanalisationsschlüssel 500. Start 20 Silber. Budget eines NPC = 5 × Mindesteinsatz, Höchsteinsatz = 3 × Mindesteinsatz.");
console.log(out.join("\n"));
