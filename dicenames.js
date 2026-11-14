// Referenzimplementierung: Würfelnamen aus Account-Seed (Vanilla JS, ohne Abhängigkeiten)

const DICE_NAME_DATA = {
  standard: {
    haupt: [{ adj: "gewöhnlich", noun: "Würfel" }, { adj: "einfach", noun: "Würfel" }, { adj: "schlicht", noun: "Würfel" }],
    zusatz: ["blank", "sauber", "ebenmäßig", "gleichmäßig", "ordentlich", "schmucklos"]
  },
  beschaedigt: {
    haupt: [{ adj: "defekt", noun: "Würfel" }, { adj: "kaputt", noun: "Würfel" }, { adj: "beschädigt", noun: "Würfel" }],
    zusatz: ["ranzig", "nach Moder riechend", "angeschlagen", "abgenutzt", "vergilbt", "schmierig", "fleckig", "rissig",
      "angeschimmelt", "verklebt", "klebrig", "stumpf", "speckig", "verkratzt", "abgesplittert", "klappernd", "stinkend",
      "modrig", "verrußt", "trüb", "fettig", "verbeult", "angekokelt", "ausgeblichen", "schartig", "brüchig", "wurmstichig",
      "angebissen", "muffig", "rostbefleckt"]
  },
  gezinkt: {
    haupt: [{ adj: "manipuliert", noun: "Würfel" }, { adj: "präpariert", noun: "Würfel" }, { adj: "gefälscht", noun: "Würfel" }],
    zusatz: ["verdächtig schwer", "auffallend glatt", "heimlich beschwert", "fein geschliffen", "unscheinbar", "leicht schief",
      "sorgsam gearbeitet", "kühl liegend", "ungewöhnlich ruhig", "augenzwinkernd"]
  },
  golden: {
    haupt: [{ adj: "golden", noun: "Würfel" }, { adj: null, noun: "Goldwürfel" }, { adj: null, noun: "Würfel aus Gold" }],
    zusatz: ["glänzend", "schimmernd", "funkelnd", "strahlend", "prachtvoll", "makellos", "warm leuchtend", "sonnenhell"]
  },
  okkult: {
    haupt: [{ adj: "verflucht", noun: "Würfel" }, { adj: "okkult", noun: "Würfel" }, { adj: "unheimlich", noun: "Würfel" }],
    zusatz: ["flüsternd", "hell aufleuchtend", "einschüchternd", "verlockend", "raunend", "pochend", "schmeichelnd",
      "drängend", "sehnsüchtig", "herrisch"]
  }
};

// --- Seeded Zufall (deterministisch, plattformunabhängig) ---
function xmur3(str) {
  let h = 1779033703 ^ str.length;
  for (let i = 0; i < str.length; i++) { h = Math.imul(h ^ str.charCodeAt(i), 3432918353); h = (h << 13) | (h >>> 19); }
  return function () { h = Math.imul(h ^ (h >>> 16), 2246822507); h = Math.imul(h ^ (h >>> 13), 3266489909); return (h ^= h >>> 16) >>> 0; };
}
function mulberry32(a) {
  return function () { a |= 0; a = (a + 0x6D2B79F5) | 0; let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t; return ((t ^ (t >>> 14)) >>> 0) / 4294967296; };
}

// Seed wie "K7QM-2XDP-R9WB" (ohne 0, O, 1, I)
function generateSeed() {
  const A = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789", bytes = new Uint8Array(12);
  (globalThis.crypto || require("crypto").webcrypto).getRandomValues(bytes);
  const s = Array.from(bytes, b => A[b % A.length]).join("");
  return s.slice(0, 4) + "-" + s.slice(4, 8) + "-" + s.slice(8, 12);
}

// Weist jedem Würfel ohne Eintrag eine freie Kombination zu. Bestehende Zuordnungen bleiben unverändert.
// diceByCategory: { beschaedigt: [id, id, ...], ... } in fester Reihenfolge; names: gespeicherte Zuordnung { id: {z, h} }
function assignDiceNames(seed, diceByCategory, names = {}) {
  for (const [cat, ids] of Object.entries(diceByCategory)) {
    const data = DICE_NAME_DATA[cat];
    const combos = [];
    data.zusatz.forEach((z, zi) => data.haupt.forEach((h, hi) => combos.push({ z: zi, h: hi })));
    const rng = mulberry32(xmur3(seed + "|" + cat)());
    for (let i = combos.length - 1; i > 0; i--) { const j = Math.floor(rng() * (i + 1)); [combos[i], combos[j]] = [combos[j], combos[i]]; }
    const used = new Set(ids.filter(id => names[id]).map(id => names[id].z + "/" + names[id].h));
    const free = combos.filter(c => !used.has(c.z + "/" + c.h));
    for (const id of ids) if (!names[id]) names[id] = free.shift();   // wirft, wenn keine Kombination mehr frei ist
  }
  return names;
}

// ending: "er" (ohne Artikel, Nominativ), "e" (mit "der"), "en" (mit "den" / Akkusativ)
function diceName(cat, entry, ending = "er") {
  const d = DICE_NAME_DATA[cat], z = d.zusatz[entry.z], h = d.haupt[entry.h];
  return [z + ending, h.adj ? h.adj + ending : null, h.noun].filter(Boolean).join(" ");
}

module.exports = { DICE_NAME_DATA, xmur3, mulberry32, generateSeed, assignDiceNames, diceName };
