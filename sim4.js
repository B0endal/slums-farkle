// Wirkung der Regel "Slums-Gegner würfeln mit 5 statt 6 Würfeln": Siegquote des Startbeutels gegen Slums-Pools (Gruppe 1, vorsichtig, Ziel 1500)
const E = require("./engine.js"), DB = require("./dice.json");
const byId = Object.fromEntries(DB.map(d => [d.id, d])), T = +process.argv[2] || 2000, rng = E.mulberry32(4242);
const wp = items => { const t = items.reduce((a, x) => a + x[1], 0); let x = rng() * t; for (const [v, w] of items) { x -= w; if (x < 0) return v; } return items[0][0]; };
const g1 = () => { const c = wp([["std", 60], ["bd", 32], ["bq", 8]]); return c === "std" ? byId.std : byId[`${c}_f${1 + Math.floor(rng() * 6)}_m${1 + Math.floor(rng() * 6)}`]; };
const pool = n => Array.from({ length: n }, g1);
const startBag = () => { const o = []; for (let i = 0; i < 4; i++) o.push(byId[`${rng() < .5 ? "bd" : "bq"}_f${1 + Math.floor(rng() * 6)}_m${1 + Math.floor(rng() * 6)}`]); return o.concat([byId.std, byId.std]); };
const std6 = () => Array(6).fill(byId.std);
function win(mk, n) { let w = 0; for (let i = 0; i < T; i++) { const st = i % 2 === 0; const r = E.simulateDuel({ dice: mk(), dbById: byId, profile: "ausgewogen", starts: st }, { dice: pool(n), dbById: byId, profile: "vorsichtig", starts: !st }, 1500, rng, 400); if (r.winner === "a") w++; } return w / T; }
const pc = x => (100 * x).toFixed(0) + " %";
console.log("| Spielerbeutel | Slums-Gegner mit 6 Würfeln | Slums-Gegner mit 5 Würfeln |\n|---|---|---|");
for (const [n, mk] of [["Startbeutel", startBag], ["6 Standard", std6]]) console.log(`| ${n} | ${pc(win(mk, 6))} | ${pc(win(mk, 5))} |`);
