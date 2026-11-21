"use strict";
// Grade 6, Chapter 3: Holding Back the Sea. The Acadian shore of Nova Scotia: dykes, the huge Fundy tides, the Deportation, and the Acadians of today.
{
  const GUIDE = { hood: "#e0533d" };   // Élodie: long hair and a red hoodie
  // a gold five-point star
  const acStar = (x, y, r) => `<polygon points="${Array.from({ length: 10 }, (_, i) => { const a = -Math.PI / 2 + i * Math.PI / 5, k = i % 2 ? r * .45 : r; return `${(x + k * Math.cos(a)).toFixed(1)},${(y + k * Math.sin(a)).toFixed(1)}`; }).join(" ")}" fill="#f4c20d" ${THIN}/>`;
  // the Acadian flag on a pole: blue, white and red bands, a gold star in the blue band. x is the pole, y the top of the flag, p the pole below the flag
  const acFlag = (x, y, w, h, p) => `<g ${INKED}><line x1="${x}" y1="${y - 5}" x2="${x}" y2="${y + h + p}" stroke="#8a5a2b" stroke-width="4"/><rect x="${x}" y="${y}" width="${w / 3}" height="${h}" fill="#2b5fb3"/><rect x="${x + w / 3}" y="${y}" width="${w / 3}" height="${h}" fill="#fff"/><rect x="${x + 2 * w / 3}" y="${y}" width="${w / 3}" height="${h}" fill="#d9363e"/></g>${acStar(x + w / 6, y + h / 2, Math.min(w / 8, h / 3))}`;
  // red-brown mud flats from y down to the bottom, with ripples
  const acMud = y => `<g ${INKED}><path d="M-10 ${y} Q90 ${y - 12} 190 ${y} T410 ${y - 4} V250 H-10 Z" fill="#b5694a"/></g><g fill="none" stroke="#8f4f36" stroke-width="2" stroke-linecap="round" opacity=".7">${[[30, 16], [130, 26], [250, 14], [330, 30], [80, 44], [290, 46]].map(([x, d]) => `<path d="M${x} ${y + d} q10 -4 20 0"/>`).join("")}</g>`;
  // a fishing boat sitting on the mud (y is just under the hull)
  const acBoat = (x, y, s, c) => `<g transform="translate(${x} ${y}) scale(${s}) rotate(-3)" ${INKED}><path d="M6 -18 V-52" fill="none" stroke-width="3"/><path d="M6 -52 l16 5 l-16 5 z" fill="#f4c20d" stroke-width="1.6"/><rect x="-18" y="-34" width="22" height="18" rx="3" fill="#fbf6ea"/><rect x="-14" y="-30" width="7" height="7" fill="#bfe6f7" stroke-width="1.4"/><path d="M-36 -18 H36 Q32 2 18 4 H-22 Q-34 2 -36 -18 Z" fill="${c}"/><path d="M-35 -12 H35" fill="none" stroke="#fff" stroke-width="3"/></g>`;
  // a wharf on tall legs with a little fish shed; x, y is the top left of the deck
  const acWharf = (x, y, w, h) => `<g ${INKED}>${[0, 1, 2, 3].map(i => `<rect x="${x + 5 + i * (w - 18) / 3}" y="${y + 6}" width="7" height="${h}" fill="#6a4a25"/>`).join("")}<path d="M${x + 8} ${y + h * .4} L${x + w - 12} ${y + h * .75} M${x + w - 12} ${y + h * .4} L${x + 8} ${y + h * .75}" fill="none" stroke-width="3" stroke="#8a5a2b"/><rect x="${x}" y="${y}" width="${w}" height="9" rx="2" fill="#c89a5e"/><rect x="${x + w - 30}" y="${y - 26}" width="24" height="26" fill="#fbf1dc"/><polygon points="${x + w - 34},${y - 26} ${x + w - 18},${y - 40} ${x + w - 2},${y - 26}" fill="#e63946"/></g>`;
  // a small village church (x is the middle, y the ground)
  const acChurch = (x, y, s) => `<g transform="translate(${x} ${y}) scale(${s})" ${INKED}><rect x="-22" y="-26" width="44" height="26" fill="#fbf6ea"/><polygon points="-26,-26 0,-42 26,-26" fill="#8a4a3a"/><rect x="-7" y="-52" width="14" height="28" fill="#fbf6ea"/><polygon points="-10,-52 0,-76 10,-52" fill="#e63946"/><path d="M0 -76 V-86 M-4 -82 H4" fill="none" stroke-width="2"/><path d="M-5 0 V-12 Q0 -19 5 -12 V0 Z" fill="#6a4a25"/><rect x="-18" y="-18" width="6" height="9" fill="#bfe6f7" stroke-width="1.4"/><rect x="12" y="-18" width="6" height="9" fill="#bfe6f7" stroke-width="1.4"/></g>`;
  // the dyke cut through the middle: earth wall, grass on top, and the aboiteau (a wooden tunnel with a flap on the sea side, on the left)
  const acDykeCut = (x, y, s) => `<g transform="translate(${x} ${y}) scale(${s})" ${INKED}><path d="M-72 0 Q-56 -52 -22 -60 H22 Q56 -52 72 0 Z" fill="#9a6b3c"/><path d="M-58 -34 Q-44 -56 -22 -60 H22 Q44 -56 58 -34 Q30 -42 0 -42 Q-30 -42 -58 -34 Z" fill="#6fb06c"/><rect x="-56" y="-24" width="112" height="16" fill="#d9a35c"/><path d="M-40 -24 V-8 M-20 -24 V-8 M0 -24 V-8 M20 -24 V-8 M40 -24 V-8" fill="none" stroke-width="1.4"/><rect x="-62" y="-27" width="8" height="22" rx="2" fill="#6a4a25"/></g>`;
  const acHills = y => `<g ${INKED}><path d="M-10 ${y + 18} Q70 ${y} 150 ${y + 12} T300 ${y + 8} T410 ${y + 12} V${y + 50} H-10 Z" fill="#7dbb7a"/></g>`;
  const acGrass = y => `<g ${INKED}><path d="M-10 ${y} Q100 ${y - 14} 210 ${y - 2} T410 ${y - 6} V250 H-10 Z" fill="#8cc084"/></g>`;
  const sgn = n => n < 0 ? "−" + (-n) : String(n);                      // whole number with a proper minus sign
  const hund = h => String(+(h / 100).toFixed(2));                        // hundredths (a whole number) as a decimal, like 625 -> 6.25

  // the window into the past, look 1: a dyke and its aboiteau in the late 1600s (the cut-through of the wall)
  const acLong1 = `<rect width="400" height="240" fill="#f6e3b4"/><rect x="130" y="118" width="120" height="40" fill="#6cc0ea"/>${ship(166, 122, .35)}
    <rect x="130" y="152" width="250" height="60" fill="#b5694a"/><rect x="236" y="152" width="150" height="9" fill="#a9cf86"/>${acDykeCut(236, 152, .75)}
    <g stroke="#e0a800" stroke-width="2.4" stroke-linecap="round">${[290, 304, 318].map(x => `<path d="M${x} 152 v-12 M${x - 4} 152 v-8 M${x + 4} 152 v-8"/>`).join("")}</g>
    ${cloud(276, 62, .6)}<g stroke="#4aa0d8" stroke-width="2" stroke-linecap="round">${[258, 274, 290].map((x, i) => `<path d="M${x} ${82 + (i % 2) * 8} l-3 9"/>`).join("")}</g>
    ${person(236, 82, .5, "#7a8aa8")}${person(296, 129, .5, "#7a8aa8")}${person(316, 132, .42, "#b98b54")}`;
  // the window into the past, look 2: 1755, ships waiting, families gathered on the shore, soldiers in red coats
  const acLong2 = `<rect width="400" height="240" fill="#dcd8cf"/><rect x="130" y="40" width="220" height="72" fill="#8fb7cf"/>${ship(206, 104, .5)}${ship(286, 96, .4)}
    <g ${INKED}><path d="M130 118 Q236 104 342 120 V250 H130 Z" fill="#aab98a"/></g>${acChurch(176, 150, .55)}
    ${person(216, 134, .5, "#7a8aa8")}${person(234, 140, .36, "#8a6a5a")}${person(248, 134, .5, "#8a6a5a")}${person(262, 140, .36, "#7a8aa8")}${person(300, 132, .5, "#b03a2e")}${person(314, 136, .46, "#b03a2e")}`;

  Object.assign(ART, {
    ac_arrive: () => frame(`${sky("#9fd8f2", "#f4f1d8", [344, 40, 20], [[60, 40, .8], [250, 26, .6]])}${acHills(100)}${water(128, "#5db7e6")}${ship(330, 152, .45)}${acMud(172)}
      <g ${INKED}><path d="M-10 204 Q100 194 200 202 T410 198 V250 H-10 Z" fill="#a9cf86"/></g>${acBoat(80, 182, .6, "#3b82c4")}${acBoat(150, 180, .5, "#e63946")}
      <g ${INKED}><path d="M-10 196 Q100 180 200 190 T410 184 V206 Q300 200 200 208 T-10 212 Z" fill="#6fb06c"/></g>
      ${house(236, 206, 24, 18, "#3b82c4")}${house(270, 202, 26, 20, "#e63946")}${acChurch(340, 228, .55)}${riding(120, 0, 120)}`),
    ac_elodie: () => frame(`${sky("#9fd8f2", "#f4f1d8", [344, 40, 20], [[70, 44, .8]])}${acHills(100)}${water(130, "#5db7e6")}${acMud(168)}${acBoat(330, 184, .75, "#e63946")}${acGrass(212)}${owlAt(50, 122, 106)}${kidAt(214, 142, 1.05, GUIDE)}`),
    ac_window1: () => frame(`${sky("#9fd8f2", "#f4f1d8", null, [[60, 40, .7]])}${water(176, "#5db7e6")}${acGrass(214)}${windowAt(236, 112, 92, acLong1)}${owlAt(18, 118, 108)}${kidAt(118, 150, .95, GUIDE)}`),
    ac_tides: () => frame(`${sky("#9fd8f2", "#f4f1d8", [56, 40, 20], [[230, 30, .8]])}${acHills(88)}${water(122, "#5db7e6")}${acMud(142)}${acWharf(262, 100, 110, 80)}${acBoat(160, 178, .85, "#3b82c4")}${acGrass(214)}${owlAt(18, 122, 106)}${kidAt(216, 146, 1, GUIDE)}`),
    ac_window2: () => frame(`${sky("#cfdbe6", "#e4e4e0", null, [[60, 40, .8], [330, 50, .7]])}${water(176, "#8fb7cf")}${acGrass(214)}${windowAt(236, 112, 92, acLong2)}${owlAt(18, 118, 108)}${kidAt(118, 150, .95, GUIDE)}${acFlag(346, 128, 30, 20, 78)}`),
    ac_choice: () => frame(`${sky("#9fd8f2", "#f4f1d8", [56, 40, 20], [[250, 30, .8]])}${acHills(88)}${water(112, "#9fb7c9")}
      <g ${INKED}><path d="M-10 108 H196 Q186 170 164 250 H-10 Z" fill="#b5694a"/></g>${acBoat(70, 170, .7, "#e63946")}
      <g ${INKED}><path d="M280 138 H410 V220 H280 Z" fill="#5db7e6"/><circle cx="278" cy="144" r="9" fill="#fff"/><circle cx="282" cy="160" r="9" fill="#fff"/><circle cx="278" cy="176" r="9" fill="#fff"/><circle cx="282" cy="192" r="9" fill="#fff"/><circle cx="278" cy="208" r="9" fill="#fff"/></g><g fill="none" stroke="#fff" stroke-width="2.4" stroke-linecap="round" opacity=".8"><path d="M310 160 q10 -4 20 0 M350 180 q10 -4 20 0 M312 196 q10 -4 20 0"/></g>
      ${acGrass(214)}${owlAt(130, 148, 84)}${kidAt(236, 160, .8, GUIDE)}`),
    ac_floor: () => frame(`${sky("#9fd8f2", "#f4f1d8", [344, 40, 20], [[80, 40, .8], [230, 28, .6]])}${acHills(90)}${water(118, "#5db7e6")}${acMud(134)}
      <g ${THIN} fill="#bfe6f7"><ellipse cx="190" cy="214" rx="18" ry="5"/><ellipse cx="322" cy="212" rx="20" ry="5"/></g>${acWharf(290, 96, 86, 70)}${acBoat(236, 186, .8, "#3b82c4")}${owlAt(30, 118, 108)}${kidAt(150, 140, 1, GUIDE)}`),
    ac_bore: () => frame(`${sky("#9fd8f2", "#f4f1d8", [344, 40, 20], [[80, 40, .8], [230, 30, .6]])}${acHills(96)}${tree(60, 122, .8)}${tree(120, 118, .7, "#3f9a58")}${tree(310, 120, .8)}${tree(352, 124, .7, "#3f9a58")}
      <g ${INKED}><path d="M-10 124 Q200 112 410 126 V206 Q200 220 -10 206 Z" fill="#b08a62"/></g>
      <g ${INKED}><path d="M236 121 Q320 118 410 126 V206 Q320 212 236 213 Z" fill="#5db7e6"/><circle cx="234" cy="130" r="9" fill="#fff"/><circle cx="238" cy="146" r="9" fill="#fff"/><circle cx="234" cy="162" r="9" fill="#fff"/><circle cx="238" cy="178" r="9" fill="#fff"/><circle cx="234" cy="194" r="9" fill="#fff"/><circle cx="238" cy="208" r="9" fill="#fff"/></g><g fill="none" stroke="#fff" stroke-width="2.4" stroke-linecap="round" opacity=".8"><path d="M280 150 q10 -4 20 0 M340 170 q10 -4 20 0 M290 190 q10 -4 20 0"/></g>
      ${acGrass(208)}${owlAt(14, 126, 104)}${kidAt(116, 144, 1, GUIDE)}`),
    ac_goodbye: () => frame(`${sky("#ffd9a0", "#fdebd0", [196, 92, 22], [[80, 40, .8], [170, 30, .6]])}${water(160, "#6cc0ea")}${ship(330, 186, .55)}${acGrass(212)}${acFlag(150, 140, 42, 28, 60)}${kidAt(78, 146, 1, GUIDE)}${riding(240, 18, 112)}`)
  });

  Object.assign(ASK, {
    ac_dyke() { // rates: the tide against the dyke, elapsed time between tides, and the speed of building
      const kind = rand(3);
      if (kind === 0) { const h = pick([1, 2, 3]), t = pick([2, 3, 4]), T = h * t; return { html: "", text: `The tide pushes in against the new dyke. The water climbs <b>${T} metres</b> in <b>${t} hours</b>. How many metres does it rise each hour?`, choices: cards(h, [h + 1, h - 1, T, t, h + 2]), why: `Share the rise over the hours. ${T} ÷ ${t} = ${h} metres an hour.` }; }
      if (kind === 1) { const hh = 1 + rand(5); return { html: "", text: `High tide is at <b>${hh}:00 a.m.</b> Low tide comes about <b>6 hours</b> later, and the next high tide <b>6 hours</b> after that. When is that high tide?`, choices: textCards(`${hh} p.m.`, [`${hh} a.m.`, `${hh + 6} a.m.`, `${hh + 6} p.m.`, `${hh + 3} p.m.`, `${hh + 1} p.m.`]), why: `6 + 6 = 12 hours later. ${hh}:00 a.m. plus 12 hours is ${hh}:00 p.m.` }; }
      const r = pick([4, 5, 6, 8]), d = 6 + rand(7), L = r * d; return { html: "", text: `A crew of Acadian farmers builds <b>${r} metres</b> of dyke each day. The wall must be <b>${L} metres</b> long. How many days will it take?`, choices: cards(d, [d + 1, d - 1, d + 2, d - 2, r]), why: `Length divided by the daily rate. ${L} ÷ ${r} = ${d} days.` };
    },
    ac_gauge() { // integers: heights above and below sea level
      const kind = rand(3);
      if (kind === 0) { const H = 3 + rand(6), L = 2 + rand(7), n = H + L; return { html: "", text: `The tide gauge reads 0 at sea level. High tide is at <b>+${H} m</b> and low tide is at <b>−${L} m</b>. How many metres does the water drop between them?`, choices: cards(n, [Math.abs(H - L), H, L, n + 1, n - 1]), why: `From +${H} down to 0 is ${H}. From 0 down to −${L} is ${L} more. ${H} + ${L} = ${n}.` }; }
      if (kind === 1) { const list = shuffle(shuffle([1, 2, 3, 4, 5, 6, 7, 8, 9]).slice(0, 2).map(v => -v).concat(shuffle([1, 2, 3, 4, 5, 6, 7, 8]).slice(0, 2))), low = Math.min(...list); return { html: "", text: `Four tide readings, in metres, are <b>${list.map(sgn).join(", ")}</b>. Which reading is the lowest?`, choices: textCards(sgn(low), list.filter(v => v !== low).map(sgn).concat([sgn(-low), sgn(low + 1)])), why: `Numbers below zero get lower as they get bigger. ${sgn(low)} is the furthest below zero.` }; }
      const L = 3 + rand(5); let R = 2 + rand(9); if (R === L) R += 1; const a = R - L; return { html: "", text: `At low tide the water at the wharf is at <b>−${L} m</b>. Then the tide rises <b>${R} metres</b>. What is the water level now?`, choices: textCards(sgn(a), [sgn(-a), sgn(R + L), sgn(R), sgn(-L), sgn(L)]), why: `Start at −${L} and go up ${R}. −${L} + ${R} = ${sgn(a)}.` };
    },
    ac_harvest() { // data: mean, median and mode
      const kind = rand(3);
      if (kind === 0) { const m = 20 + rand(21), d = pick([[-6, -2, 0, 3, 5], [-4, -1, 0, 1, 4], [-8, -3, 1, 4, 6], [-5, -2, 2, 2, 3]]), list = shuffle(d.map(x => m + x)); return { html: "", text: `Élodie's neighbours picked apples for five days: <b>${list.join(", ")}</b> bushels. What is the mean number of bushels picked each day?`, choices: cards(m, [m + 1, m - 1, Math.max(...list), Math.min(...list), m + 2]), why: `The total is ${m * 5}. Share it over 5 days. ${m * 5} ÷ 5 = ${m}.` }; }
      if (kind === 1) { const vals = shuffle([9, 10, 11, 12, 13, 14, 15, 16]).slice(0, 5), sorted = vals.slice().sort((a, b) => a - b), med = sorted[2], mean = Math.round(vals.reduce((a, b) => a + b, 0) / 5); return { html: "", text: `Élodie's class measured how far the tide rose on five days: <b>${vals.join(", ")}</b> metres. What is the median?`, choices: cards(med, [vals[2], sorted[1], sorted[3], Math.max(...vals), mean]), why: `In order: ${sorted.join(", ")}. The middle number is ${med}.` }; }
      const pool = shuffle([9, 10, 11, 12, 13, 14, 15, 16]), mo = pool[0], list = shuffle([mo, mo, mo].concat(pool.slice(1, 5))), sorted = list.slice().sort((a, b) => a - b), mean = Math.round(list.reduce((a, b) => a + b, 0) / 7);
      return { html: "", text: `Élodie wrote down how far the tide rose on seven days: <b>${list.join(", ")}</b> metres. What is the mode?`, choices: cards(mo, [sorted[3], mean, sorted[6], sorted[0], mo + 1]), why: `The mode is the number that shows up most often. ${mo} appears 3 times.` };
    },
    ac_depth() { // decimals: lengths of dyke, depths of water
      const kind = rand(3);
      if (kind === 0) { const a = 100 * (2 + rand(4)) + 5 * (1 + rand(19)), b = 100 * (1 + rand(3)) + 5 * (1 + rand(19)), s = a + b; return { html: "", text: `Élodie's village built its dyke in two stretches. One is <b>${hund(a)} km</b> long and the other is <b>${hund(b)} km</b>. How long are the two together?`, choices: textCards(`${hund(s)} km`, [s + 10, s - 10, s + 100, s - 100, s + 50].map(h => `${hund(h)} km`)), why: `Line up the decimal points and add. ${hund(a)} + ${hund(b)} = ${hund(s)} km.` }; }
      if (kind === 1) { const d = 100 * (5 + rand(5)) + 5 * (1 + rand(19)), e = 100 * (1 + rand(3)) + 5 * (1 + rand(19)), r = d - e; return { html: "", text: `At high tide the water at Élodie's wharf is <b>${hund(d)} m</b> deep. By low tide it has dropped by <b>${hund(e)} m</b>. How deep is the water now?`, choices: textCards(`${hund(r)} m`, [r + 10, r - 10, r + 100, r - 100, r + 50].map(h => `${hund(h)} m`)), why: `Line up the decimal points and subtract. ${hund(d)} − ${hund(e)} = ${hund(r)} m.` }; }
      const ai = pick([12, 15, 18, 24]), bi = pick([15, 25, 35]), P = ai * bi; return { html: "", text: `The tide creeps up the dyke by <b>${hund(ai * 10)} m</b> every hour. How many metres does it rise in <b>${hund(bi * 10)} hours</b>?`, choices: textCards(`${hund(P)} m`, [P * 10, (ai + bi) * 10, P + 100, P - 100, P * 100].map(h => `${hund(h)} m`)), why: `Multiply as whole numbers: ${ai} × ${bi} = ${P}. There are two decimal places in all, so ${hund(P)} m.` };
    }
  });

  // FACT CHECK: The Acadians were French-speaking settlers who arrived in the early 1600s. Dyking the salt marsh at Grand-Pré began in the late 1600s (the village dates from about 1680).
  // FACT CHECK: An aboiteau is a wooden sluice or box drain set in a dyke, with a hinged flap that lets fresh water drain out at low tide and shuts when the tide rises. Rain then washes the salt out of the soil.
  // FACT CHECK: The Bay of Fundy has the highest tides in the world. In the Minas Basin the water can change by about 16 metres (the record is about 16 m at Burntcoat Head). Roughly 6 hours 13 minutes pass between high and low tide (the story says about six hours). 16 metres is about the height of a five-storey building.
  // FACT CHECK: The Mi'kmaq have lived in this land for thousands of years, and the Acadians lived as neighbours of the Mi'kmaq. Their homeland is called Mi'kma'ki, and it includes Cape Breton Island.
  // FACT CHECK (added from Shane's review notes, November 2026): The Acadians and the Mi'kmaq lived side by side for more than a hundred years, traded, shared knowledge, and some families married into each other. The Acadians farmed the salt marshes, which left Mi'kmaw hunting grounds alone. During the 1755 Deportation some Acadian families escaped into the woods and Mi'kmaw families sheltered them and helped them survive.
  // FACT CHECK: The Deportation (le Grand Dérangement) began in 1755, carried out by British soldiers. About 10,000 Acadians were sent away over the following years (estimates vary, and some historians give higher numbers). Families were separated. Some Acadians later returned to the region, and some made new homes elsewhere, including Louisiana, where their descendants are called Cajuns.
  // FACT CHECK: The Acadian flag has blue, white and red vertical bands (the French tricolour) with a gold star in the blue band. Acadians still live in Nova Scotia, New Brunswick, Prince Edward Island and elsewhere, and speak French.
  // FACT CHECK: A tidal bore is a wave made by the incoming tide moving up a river against the current, and it can make the river flow the other way for a while. Bores happen on rivers that drain into the Minas Basin, such as the Salmon River at Truro and the Shubenacadie River.
  // FACT CHECK: French words: la digue (the dyke), la famille (the family), l'aboiteau (the dyke gate), la marée (the tide), le drapeau (the flag), la boue (the mud), la mer (the sea). Also le Grand Dérangement.
  // FACT CHECK: Reworded after an outside review (Gemini, November 2026), checked against The Canadian Encyclopedia: soldiers burned Acadian houses and barns; estimates of Acadians who died from disease and shipwreck run to about 5,000; the marsh farming line now says 'mostly'.
  CHAPTERS[2] = { title: "Holding Back the Sea", where: "The Acadian shore, Nova Scotia", beats: [
    { art: "ac_arrive", word: ["la digue", "the dyke"], say: ["Down the river, out to sea, and then south! The clock has brought us to the Bay of Fundy, where the tides are the biggest in the world.",
      "This is the <em>Acadian shore</em> of Nova Scotia. The sea goes out so far here that the boats sit on the mud. I landed in a puddle. A very big puddle.",
      "See that long green bank beside the water? It is a <em>dyke</em>, a wall of earth that keeps the sea out of the farms. In French it is la digue. Let's find a guide!"] },
    { art: "ac_elodie", word: ["la famille", "the family"], say: ["This is Élodie. She is an Acadian girl, and she speaks French at home. Her family has lived beside this bay for a very long time.",
      "Family in French is <em>la famille</em>, and hers is a big one. Her grandmother, her cousins and a dog named Moustache all come for Sunday supper.",
      "Élodie says Acadian farmers first built walls like this one more than 300 years ago. People around here still look after them. Clock, show us how it began!"] },
    { art: "ac_window1", who: "The clock", say: ["Tick, tock. Time to look back. My window is open."] },
    { art: "ac_window1", word: ["l'aboiteau", "the dyke gate"], say: ["The window into the past! It is the late <em>1600s</em>. Acadians, French-speaking settlers, are farming here. But this land is salt marsh, and the sea floods it twice a day.",
      "So they build a wall of earth to hold the sea back. Through the wall is a wooden gate called an <em>aboiteau</em>. Rain water flows out at low tide, and the rising tide pushes the gate shut.",
      "Once rain washes the salt away, the soil grows rich crops. The Acadians live as neighbours of the <em>Mi'kmaq</em>. You say it MEEG-mah. They have lived here for thousands of years."] },
    { art: "ac_window1", say: ["The Acadians and the Mi'kmaq lived side by side for more than a hundred years. They traded, shared what they knew, and some families married into each other.",
      "The Acadians farmed the salt marshes, which mostly left the Mi'kmaw hunting grounds alone. How long does a dyke take?"] },
    { ask: "ac_dyke", intro: "Help build the dyke. Three right answers and we meet the tides." },
    { art: "ac_tides", word: ["la marée", "the tide"], say: ["Back to today. Look at the boats! They are sitting on the mud, and the sea has gone far away. Did somebody pull the plug?",
      "No, it is the <em>tide</em>. Twice a day the sea rises and falls. In the Minas Basin it can change by as much as about 16 metres, as tall as a five-storey building.",
      "Élodie calls the tide <em>la marée</em>. The water takes about six hours to go from high to low, and then it turns and comes back. She has a tide gauge. Shall we read it?"] },
    { ask: "ac_gauge", intro: "Read Élodie's tide gauge. Three right answers and the window opens again." },
    { art: "ac_window2", who: "The clock", say: ["Tick, tock. The window opens again."] },
    { art: "ac_window2", word: ["le drapeau", "the flag"], say: ["The window shows a sadder time. The year is <em>1755</em>. Britain and France are rivals for this land, and British soldiers have come to the Acadian villages.",
      "The soldiers order the Acadians to leave their homes. Families are put on ships, and many are split up. The soldiers burn the houses and barns so that nobody can come back.", "This is called the <em>Deportation</em>, or le Grand Dérangement. Thousands of Acadians died of sickness and shipwreck on the way.",
      "Some Acadian families escaped into the woods. Mi'kmaw families sheltered them and helped them survive.",
      "The window fades. About <em>10,000</em> people were sent away over the next years. Some found their way back, years later. Others made new homes far away, as far as Louisiana."] },
    { art: "ac_elodie", say: ["But look at Élodie's flag! Acadians are still here, still speaking French, with a flag of blue, white and red and a gold star. A flag is <em>le drapeau</em>."] },
    { ask: "ac_harvest", intro: "Élodie has some numbers to share. Three right answers and you choose what we do next." },
    { art: "ac_choice", pick: "The tide is on the move! Élodie says there are two ways to see it. Which shall we choose?", options: [
      { label: "Walk on the sea floor", art: "ac_floor", word: ["la boue", "the mud"], say: ["Boots on! At low tide the sea floor is red-brown mud, and every step goes squish. Élodie says we must stay close to shore, because the tide comes back fast.",
        "Mud in French is <em>la boue</em>. By the time we got back, my feet were two mud puddings. The tide arrived right on time."] },
      { label: "Watch the tide rush in", art: "ac_bore", word: ["la mer", "the sea"], say: ["We waited on the riverbank. Then we heard it! The sea came rushing up the river in a wave, pushing against the current. It is called a <em>tidal bore</em>.",
        "The sea in French is <em>la mer</em>. For a little while the river flowed the other way. I cheered so loudly that a heron left."] }] },
    { ask: "ac_depth", intro: "Last test! Three right answers and it is time to say goodbye." },
    { art: "ac_goodbye", say: ["What a place! The sea goes out and comes back twice a day, and the Acadians are still here, farming the land their families dyked long ago.",
      "Merci, Élodie! She keeps her language, her flag and her family's stories alive, and she showed me that good walls take good neighbours.",
      "The balloon is tugging east, along the coast to Cape Breton Island, in Mi'kma'ki, the homeland of the Mi'kmaq. Our next chapter is <em>The People of the Dawn</em>.",
      "Au revoir, Élodie! East we go again. Tick tock!"] }
  ] };
}
