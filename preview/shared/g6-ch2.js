"use strict";
// Grade 6, Chapter 2: The Long Farms. Long thin farms along the St. Lawrence, and the maple wood with its sugar shack.
{
  const GUIDE = { hood: "#58b368", short: true }; // Olivier: short dark hair and a green hoodie
  const f = n => n.toLocaleString("en-CA");

  // ---------- my own drawing pieces ----------
  const FIELD_COLORS = ["#a9cf86", "#c8dd8f", "#e6cf7a", "#8fc27a", "#c9a46a"];
  // long thin fields seen from above: n strips between x0 and x1, from yT (far) to yB (near); k squeezes the far end in
  const ribbons = (x0, x1, yT, yB, n, k) => `<g ${THIN}>${Array.from({ length: n }, (_, i) => {
    const a = x0 + (x1 - x0) * i / n, b = x0 + (x1 - x0) * (i + 1) / n, ta = 200 + (a - 200) * k, tb = 200 + (b - 200) * k;
    return `<polygon points="${a.toFixed(1)},${yB} ${b.toFixed(1)},${yB} ${tb.toFixed(1)},${yT} ${ta.toFixed(1)},${yT}" fill="${FIELD_COLORS[i % 5]}"/>`;
  }).join("")}</g>`;
  // a stone farmhouse with a steep red roof and a chimney
  const farmhouse = (x, y, s) => `<g transform="translate(${x} ${y}) scale(${s})" ${INKED}><rect x="-32" y="-26" width="64" height="26" fill="#d6c7ae"/><polygon points="-38,-26 -30,-58 30,-58 38,-26" fill="#b03a2e"/><rect x="14" y="-66" width="8" height="14" fill="#a9755a"/>
    <rect x="-5" y="-18" width="10" height="18" rx="2" fill="#8a5a2b"/><rect x="-26" y="-20" width="9" height="9" fill="#bfe6f7"/><rect x="17" y="-20" width="9" height="9" fill="#bfe6f7"/><rect x="-4" y="-48" width="8" height="8" fill="#bfe6f7"/></g>`;
  // a red barn with a white crossed door
  const barn = (x, y, s) => `<g transform="translate(${x} ${y}) scale(${s})" ${INKED}><rect x="-34" y="-30" width="68" height="30" fill="#b03a2e"/><path d="M-38 -30 L-30 -50 Q0 -62 30 -50 L38 -30 Z" fill="#8f2d24"/><rect x="-12" y="-22" width="24" height="22" fill="#fbf6ea"/><path d="M-12 -22 L12 0 M12 -22 L-12 0" fill="none" stroke-width="2"/></g>`;
  // a stone windmill with four sails
  const windmill = (x, y, s) => `<g transform="translate(${x} ${y}) scale(${s})" ${INKED}><path d="M-16 0 L-11 -50 H11 L16 0 Z" fill="#d6c7ae"/><polygon points="-14,-50 0,-70 14,-50" fill="#6a4a2a"/><rect x="-4" y="-18" width="8" height="18" rx="2" fill="#6a4a2a"/>
    <g transform="translate(0 -56)">${[25, 115, 205, 295].map(a => `<rect x="-2" y="-40" width="4" height="40" fill="#8a5a2b" transform="rotate(${a})"/><rect x="2" y="-38" width="9" height="22" fill="#fbf6ea" transform="rotate(${a})"/>`).join("")}<circle cx="0" cy="0" r="4" fill="#6a4a2a"/></g></g>`;
  // a sugar shack: a wooden hut with a vent on the roof and steam puffing out
  const shack = (x, y, s) => `<g transform="translate(${x} ${y}) scale(${s})" ${INKED}><rect x="-34" y="-30" width="68" height="30" fill="#a8452a"/><polygon points="-40,-30 -30,-48 30,-48 40,-30" fill="#6a4a2a"/><rect x="-9" y="-62" width="18" height="16" fill="#8a5a2b"/><polygon points="-13,-62 0,-72 13,-62" fill="#6a4a2a"/>
    <rect x="-6" y="-58" width="12" height="9" fill="#2b1a10"/><rect x="-6" y="-20" width="12" height="20" rx="2" fill="#4a3518"/><rect x="14" y="-24" width="12" height="10" fill="#fff6c9"/><rect x="-26" y="-24" width="12" height="10" fill="#fff6c9"/></g>
    <g transform="translate(${x} ${y}) scale(${s})" fill="none" stroke="#fff" stroke-width="8" stroke-linecap="round" opacity=".85"><path d="M0 -78 q-10 -10 0 -20 q10 -10 0 -20"/><path d="M12 -76 q8 -8 0 -16 q-8 -8 0 -16" opacity=".7"/></g>`;
  // a maple tree in leaf, with a sap bucket on its trunk
  const mapleTree = (x, y, s) => `<g transform="translate(${x} ${y}) scale(${s})" ${INKED}><rect x="-5" y="-30" width="10" height="32" rx="2" fill="#7a4a24"/><path d="M0 -76 Q22 -78 24 -56 Q38 -44 22 -32 Q0 -22 -22 -32 Q-38 -44 -24 -56 Q-22 -78 0 -76 Z" fill="#4aa862"/><path d="M5 -14 h9 l-1 10 h-7 z" fill="#c9ced6"/></g>`;
  // a bare maple in late winter, with a sap bucket hanging on it
  const bareMaple = (x, y, s) => `<g transform="translate(${x} ${y}) scale(${s})" ${INKED}><path d="M-7 0 L-4 -44 L4 -44 L7 0 Z" fill="#7a4a24"/>
    <path d="M0 -44 L-18 -70 M0 -44 L0 -76 M0 -44 L18 -68 M-9 -58 L-24 -60 M9 -58 L24 -58" fill="none" stroke="#2b1a10" stroke-width="6"/><path d="M0 -44 L-18 -70 M0 -44 L0 -76 M0 -44 L18 -68 M-9 -58 L-24 -60 M9 -58 L24 -58" fill="none" stroke="#7a4a24" stroke-width="3.4"/>
    <path d="M6 -14 h10 l-1.5 11 h-7 z" fill="#c9ced6"/></g>`;
  // a horse pulling a sleigh with a driver in it (facing right, feet on y)
  const horseSleigh = (x, y, s) => `<g transform="translate(${x} ${y}) scale(${s})" ${INKED}>
    <path d="M-130 4 H-56 Q-44 4 -44 -10" fill="none" stroke-width="5" stroke="#6a4a2a"/><path d="M-112 -6 V4 M-68 -6 V4" fill="none" stroke-width="3"/>${person(-92, -46, .55, "#3b6ea5")}
    <path d="M-126 -6 L-118 -32 H-62 L-54 -6 Z" fill="#b03a2e"/><path d="M-54 -14 L-26 -28" fill="none" stroke-width="2"/>
    <path d="M-26 -36 Q-40 -30 -36 -12" fill="none" stroke-width="5" stroke="#2b1a10"/><path d="M-26 -36 Q-40 -30 -36 -12" fill="none" stroke-width="3" stroke="#4a3518"/>
    <rect x="-22" y="-24" width="6" height="24" rx="2" fill="#7a4a24"/><rect x="-12" y="-24" width="6" height="24" rx="2" fill="#7a4a24"/><rect x="10" y="-24" width="6" height="24" rx="2" fill="#7a4a24"/><rect x="19" y="-24" width="6" height="24" rx="2" fill="#7a4a24"/>
    <ellipse cx="0" cy="-34" rx="28" ry="15" fill="#8a5a2b"/><path d="M18 -42 L30 -64 L44 -58 L34 -32 Z" fill="#8a5a2b"/><ellipse cx="44" cy="-58" rx="13" ry="7" transform="rotate(28 44 -58)" fill="#8a5a2b"/>
    <path d="M30 -64 L28 -72 L36 -66 Z" fill="#7a4a24"/><path d="M20 -50 L27 -66 L31 -52" fill="#2b1a10"/><circle cx="46" cy="-61" r="1.6" fill="#2b1a10" stroke="none"/></g>`;

  // ---------- the windows into the past ----------
  // about 1700: long lots, each touching the river, with cottages along the shore and a seigneur's windmill
  const longAgo1 = `<rect width="400" height="240" fill="#f6e3b4"/>${ribbons(130, 342, 52, 150, 6, .75)}
    ${house(166, 134, 14, 11, "#8a5a2b")}${house(212, 134, 14, 11, "#b03a2e")}${house(262, 134, 14, 11, "#8a5a2b")}${windmill(304, 150, .5)}${person(240, 120, .45, "#3b6ea5")}
    ${water(150, "#6cc0ea")}${canoe(230, 188, .5, { who: 2 })}`;
  // late winter long ago: sap buckets on the maples, a pot over the fire, two people working together
  const longAgo2 = `<rect width="400" height="240" fill="#cfe0f2"/><g ${INKED}><path d="M130 110 Q236 92 342 110 V250 H130 Z" fill="#fff"/><path d="M130 168 Q236 152 342 170 V250 H130 Z" fill="#eef4fb"/></g>
    ${bareMaple(176, 136, .9)}${bareMaple(300, 132, .9)}${bareMaple(246, 126, .7)}${person(204, 150, .55, "#c98f58")}${person(232, 152, .55, "#3b6ea5")}${kettle(260, 184, 1.5)}`;

  // ---------- the pictures ----------
  Object.assign(ART, {
    lf_arrive: () => frame(`${sky("#9fd8f2", "#f4f1d8", [346, 40, 20], [[90, 38, .8], [250, 28, .6]])}<g ${INKED}><path d="M-10 118 Q100 100 210 116 T410 108 V176 H-10 Z" fill="#9ed08f"/></g>
      <g stroke="#6fae6a" stroke-width="2.4">${Array.from({ length: 16 }, (_, i) => `<line x1="${i * 26}" y1="124" x2="${i * 26 - 6}" y2="172"/>`).join("")}</g>${water(160)}${windmill(64, 154, .6)}${farmhouse(332, 154, .6)}${riding(150, 22, 112)}`),
    lf_olivier: () => frame(`${sky("#9fd8f2", "#f4f1d8", [344, 40, 20], [[70, 40, .8], [190, 28, .6]])}<g ${INKED}><path d="M-10 168 Q100 154 210 168 T410 162 V250 H-10 Z" fill="#8cc084"/><path d="M-10 206 Q140 192 260 206 T410 200 V250 H-10 Z" fill="#7dbb7a"/></g>
      ${farmhouse(296, 178, .9)}${mapleTree(368, 180, .8)}${owlAt(66, 116, 112)}${kidAt(204, 140, 1.05, GUIDE)}`),
    lf_window1: () => frame(`${sky("#9fd8f2", "#f4f1d8", null, [[60, 40, .7]])}${water(176)}<g ${INKED}><path d="M-10 212 Q100 198 210 214 T410 212 V250 H-10 Z" fill="#8cc084"/></g>${windowAt(236, 112, 92, longAgo1)}${owlAt(18, 118, 108)}${kidAt(118, 150, .95, GUIDE)}`),
    lf_today: () => frame(`${sky("#9fd8f2", "#f4f1d8", [50, 40, 20], [[300, 40, .7]])}<g ${INKED}><path d="M-10 84 H410 V210 H-10 Z" fill="#8cc084"/></g>${ribbons(-10, 410, 84, 206, 13, .8)}${water(204, "#5db7e6")}
      ${farmhouse(98, 202, .55)}${barn(146, 202, .5)}${windmill(318, 202, .5)}${riding(168, 4, 100)}`),
    lf_window2: () => frame(`${sky("#9fd8f2", "#f4f1d8", null, [[60, 40, .7]])}${water(176)}<g ${INKED}><path d="M-10 212 Q100 198 210 214 T410 212 V250 H-10 Z" fill="#8cc084"/></g>${windowAt(236, 112, 92, longAgo2)}${owlAt(18, 118, 108)}${kidAt(118, 150, .95, GUIDE)}`),
    lf_choice: () => frame(`${sky("#9fd8f2", "#f4f1d8", [60, 40, 20], [[220, 30, .8], [330, 50, .6]])}${snow(172)}${snowPine(236, 176, .75)}${shack(318, 198, 1.3)}${owlAt(30, 126, 104)}${kidAt(168, 148, .95, GUIDE)}`),
    lf_taffy: () => frame(`${sky("#9fd8f2", "#f4f1d8", [344, 40, 20], [[80, 34, .8]])}${snow(150)}${shack(332, 150, .8)}${owlAt(40, 98, 106)}${kidAt(200, 108, 1, GUIDE)}
      <g ${INKED}><path d="M50 200 H350 L338 230 H62 Z" fill="#8a5a2b"/><path d="M60 205 H340 L332 224 H68 Z" fill="#fff"/></g>
      <g fill="none" stroke="#c9791b" stroke-width="3.6" stroke-linecap="round"><path d="M76 211 q16 -8 32 0 t32 0 t32 0 t32 0 t32 0 t32 0 t32 0"/><path d="M92 219 q16 -7 32 0 t32 0 t32 0 t32 0 t32 0"/></g>
      <g fill="none" stroke-linecap="round"><path d="M300 206 L334 188" stroke="#2b1a10" stroke-width="6"/><path d="M300 206 L334 188" stroke="#c89a5e" stroke-width="3.4"/><path d="M334 188 q10 -10 4 -16 q-8 -4 -8 4 q2 6 8 4" stroke="#c9791b" stroke-width="5"/></g>`),
    lf_sleigh: () => frame(`${sky("#9fd8f2", "#f4f1d8", [350, 40, 20], [[90, 34, .8], [240, 50, .6]])}${snow(168)}${bareMaple(188, 182, .75)}${horseSleigh(332, 214, 1)}${owlAt(24, 124, 104)}${kidAt(150, 148, .95, GUIDE)}`),
    lf_goodbye: () => frame(`${sky("#ffd9a0", "#fdebd0", [70, 52, 20], [[200, 34, .7], [320, 30, .6]])}${water(124, "#6cc0ea")}${ship(222, 142, .4)}<g ${INKED}><path d="M-10 196 Q100 180 210 198 T410 196 V250 H-10 Z" fill="#8cc084"/></g>${geese(150, 74, .7, 5)}${balloonAt(252, 70, 116)}${owlAt(50, 120, 106)}${kidAt(178, 150, .95, GUIDE)}`)
  });

  // ---------- the questions ----------
  Object.assign(ASK, {
    lf_ribbon() { // area and perimeter of long rectangles, metres and kilometres, a missing side
      const kind = rand(3);
      if (kind === 0) { const w = pick([40, 50, 60, 80]), L = pick([300, 400, 500, 600, 800]), P = 2 * (w + L); return { html: "", text: `A habitant's lot is <b>${w} m</b> wide and <b>${L} m</b> long. How many metres of fence go all the way around it?`, choices: cards(P, [w + L, 2 * w + L, w + 2 * L, P + 20, P - 20]), why: `Perimeter is 2 × (${w} + ${L}) = 2 × ${w + L} = ${P} m.` }; }
      if (kind === 1) { const w = pick([40, 50, 60, 80]), L = pick([300, 400, 500, 600, 800]), A = w * L; return { html: "", text: `A lot has an area of <b>${f(A)} m²</b> and is <b>${w} m</b> wide. How many metres long is it?`, choices: cards(L, [L + w, L - w, L * 2, A / 100, w]), why: `Area = width × length, so length = ${f(A)} ÷ ${w} = ${L} m.` }; }
      const k = pick([2, 3, 4, 5]), w = pick([50, 60, 80, 100]), P = 2 * (k * 1000 + w);
      return { html: "", text: `A very long lot is <b>${k} km</b> long and <b>${w} m</b> wide. What is its perimeter in <b>metres</b>?`, choices: cards(P, [k * 1000 + w, 2 * (k + w), 2 * k * 1000 + w, P + 1000, P - 1000]), why: `${k} km = ${f(k * 1000)} m. Perimeter = 2 × (${f(k * 1000)} + ${w}) = ${f(P)} m.` };
    },
    lf_slant() { // area of parallelograms and triangles
      const kind = rand(3);
      if (kind === 0) { const b = pick([60, 80, 100, 120]), h = pick([30, 40, 50, 60]), s = h + pick([10, 20]), A = b * h; return { html: "", text: `A slanted field is a parallelogram with base <b>${b} m</b>, height <b>${h} m</b> and slanted side <b>${s} m</b>. What is its area in m²?`, choices: cards(A, [b * s, b + h, 2 * (b + h), A / 2, A + b]), why: `Area = base × height = ${b} × ${h} = ${f(A)} m². The slanted side is not used.` }; }
      if (kind === 1) { const b = pick([40, 60, 80, 100, 120]), h = pick([30, 50, 70, 90]), A = b * h / 2; return { html: "", text: `A corner field is a triangle with base <b>${b} m</b> and height <b>${h} m</b>. What is its area in m²?`, choices: cards(A, [b * h, b + h, A / 2, A + b, A - h]), why: `A triangle is half of a rectangle. ${b} × ${h} ÷ 2 = ${f(A)} m².` }; }
      const b = pick([40, 50, 60, 80]), h = pick([20, 30, 40, 50]), A = b * h;
      return { html: "", text: `A parallelogram field has an area of <b>${f(A)} m²</b> and a base of <b>${b} m</b>. How many metres tall is it (its height)?`, choices: cards(h, [b, h + 10, h - 10, h * 2, h / 2]), why: `Area = base × height, so height = ${f(A)} ÷ ${b} = ${h} m.` };
    },
    lf_sap() { // the 40 to 1 rule, and unit rates
      const kind = rand(3);
      if (kind === 0) { const m = pick([2, 3, 4, 5, 6, 8]), n = 40 * m; return { html: "", text: `Olivier wants <b>${m} litres</b> of syrup. The rule is <b>40 litres</b> of sap for every <b>1 litre</b> of syrup. How many litres of sap does he need?`, choices: cards(n, [40 + m, 4 * m, n + 40, n - 40, 10 * m]), why: `Each litre of syrup needs 40 litres of sap. ${m} × 40 = ${n} litres.` }; }
      if (kind === 1) { const m = pick([3, 4, 5, 6, 8, 10]), s = 40 * m; return { html: "", text: `A big pot holds <b>${s} litres</b> of sap. At 40 litres of sap to 1 litre of syrup, how many litres of syrup will it make?`, choices: cards(m, [10 * m, 2 * m, m + 1, m - 1, s - 40]), why: `Every 40 litres of sap makes 1 litre of syrup. ${s} ÷ 40 = ${m} litres.` }; }
      const n = pick([3, 4, 5]), c = pick([8, 9, 12, 15]), T = c * n, m = n + pick([2, 3, 4]), ans = c * m;
      return { html: "", text: `At the farm stand, <b>${n} tins</b> of syrup cost <b>$${T}</b>. At the same rate, how much do <b>${m} tins</b> cost?`, choices: textCards(`$${ans}`, [T + m, c, ans + c, ans - c, ans + 5].filter(k => k > 0 && k !== ans).map(k => `$${k}`)), why: `One tin costs $${T} ÷ ${n} = $${c}. So ${m} tins cost ${m} × $${c} = $${ans}.` };
    },
    lf_share() { // fractions and percents of an amount
      const kind = rand(3);
      if (kind === 0) { const [num, d] = pick([[2, 3], [3, 4], [2, 5], [3, 5], [4, 5], [5, 6]]), unit = pick([4, 5, 6, 8, 10]), N = d * unit, ans = num * unit; return { html: "", text: `Olivier picks <b>${N} kg</b> of strawberries. He sells <b>${num}/${d}</b> of them at the farm stand. How many kg does he sell?`, choices: cards(ans, [unit, N - ans, N, ans + unit, ans - unit]), why: `1/${d} of ${N} is ${N} ÷ ${d} = ${unit}. So ${num}/${d} is ${num} × ${unit} = ${ans} kg.` }; }
      if (kind === 1) { const P = pick([20, 40, 60, 80]), pc = pick([10, 20, 25]), disc = P * pc / 100, n = P - disc; return { html: "", text: `A tin of syrup costs <b>$${P}</b>. This week it is <b>${pc}% off</b>. What is the sale price?`, choices: textCards(`$${n}`, [P, disc, P + disc, P - pc, n + 5, n - 5].filter(k => k > 0 && k !== n).map(k => `$${k}`)), why: `${pc}% of $${P} is $${disc}. $${P} − $${disc} = $${n}.` }; }
      const [pc, part, whole] = pick([[25, 10, 40], [50, 20, 40], [75, 30, 40], [20, 8, 40], [10, 4, 40], [60, 24, 40], [80, 32, 40], [25, 15, 60], [50, 30, 60], [75, 45, 60]]);
      return { html: "", text: `Olivier made <b>${whole} jars</b> of strawberry jam and sold <b>${part}</b> of them. What percent of the jars did he sell?`, choices: textCards(pc + "%", [pc + 10, pc - 10, pc + 5, 100 - pc, part].filter(k => k > 0 && k < 100).map(k => k + "%")), why: `${part} out of ${whole}. ${part} ÷ ${whole} = ${(part / whole).toFixed(2).replace(/0$/, "")}, which is ${pc} percent.` };
    }
  });

  // FACT CHECK: about 1700 in New France the land along the St. Lawrence was divided into long, narrow lots, each with a short side on the river (the seigneurial system)
  // FACT CHECK: the farming families were called habitants, and the river was the main road (in winter the frozen river was used as a road too)
  // FACT CHECK: the long lots can still be seen in the fields today, and farms with strawberries and apples are found on the Ile d'Orleans and the Cote-de-Beaupre east of Quebec City
  // FACT CHECK: First Nations peoples made maple sugar from sap before the French came, and taught the French settlers how
  // FACT CHECK: added from Shane's review notes (November 2026): the Abenaki, Algonquin and Wendat, among other First Nations of this region, made maple sugar long before ships came and taught the French settlers (Innu deliberately not named here)
  // FACT CHECK: added from Shane's review notes (November 2026): the seigneuries' long narrow farms were laid out along riverbanks that were already First Nations homelands, where people had lived, fished and travelled for thousands of years
  // FACT CHECK: it takes about 40 litres of maple sap to make 1 litre of maple syrup
  // FACT CHECK: Quebec makes most of the world's maple syrup (about 70 percent, in recent years)
  // FACT CHECK: maple taffy poured on clean snow is a real sugar shack treat, and many sugar shacks offer horse-drawn sleigh rides
  // FACT CHECK: the water of the St. Lawrence gets wider and saltier as it nears the Gulf and the sea
  // FACT CHECK: French words: la ferme (the farm), le champ (the field), l'érable (the maple tree), le sirop d'érable (maple syrup), la cabane à sucre (the sugar shack), la tire (maple taffy), le traîneau (the sleigh)
  // FACT CHECK: Reworded after an outside review (Gemini, November 2026), checked against The Canadian Encyclopedia: First Nations along the St. Lawrence are spoken of in the present tense.
  CHAPTERS[1] = { title: "The Long Farms", where: "Along the St. Lawrence", beats: [
    { art: "lf_arrive", say: ["Goodbye, Léa! My clock balloon is drifting downriver, and the St. Lawrence is slowly getting wider.",
      "Look at the land along the shore. The fields are not squares. They are <em>long thin strips</em>, like ribbons, all running back from the water.",
      "We are just east of Quebec City, where farms have lined this river for hundreds of years. I see a windmill and a farmhouse. I wave at the farmhouse. It does not wave back."] },
    { art: "lf_olivier", word: ["la ferme", "the farm"], say: ["This is Olivier. He lives on a farm by the river, with strawberry rows, apple trees, and a wood full of maple trees. He speaks French at home and at school.",
      "A farm is <em>la ferme</em>. Like most farms around here, his is long and thin. Not a square in sight.",
      "Why so long and thin? Olivier says the river holds the secret. Clock, show us!"] },
    { art: "lf_window1", who: "The clock", say: ["Tick, tock. Time to look back. My window is open."] },
    { art: "lf_window1", say: ["The window into the past! The year is about <em>1700</em>, in New France. See the land? It is cut into long, narrow lots, and every lot touches the river.",
      "Each lot was farmed by a family of <em>habitants</em>, which is what the French farmers were called. Every family got a piece of the riverbank, because the river was the road.",
      "These long farms were laid out along riverbanks that were already the homelands of First Nations. They have lived, fished and travelled along this river for thousands of years, and they still do.",
      "Boats carried people and goods, and in winter the frozen river was a road too. So the houses stood close together along the shore, and neighbours could wave. Let's measure these lots."] },
    { ask: "lf_ribbon", intro: "Measure the long thin lots. Three right answers and we fly over the fields of today." },
    { art: "lf_today", word: ["le champ", "the field"], say: ["Back to today! From up here the fields still look like <em>ribbons</em>. Some are strawberries, some are hay, and some are just having a nap.",
      "The roads run along the river now, but the old lot lines are still there to see. Olivier's family farm is one of those thin ribbons.",
      "A field is <em>le champ</em>. Where the river bends, some fields get cut on a slant, which makes them tricky to measure. Shall we try?"] },
    { ask: "lf_slant", intro: "Measure the slanted fields. Three right answers and the window opens again." },
    { art: "lf_window2", who: "The clock", say: ["Tick, tock. The window opens again."] },
    { art: "lf_window2", word: ["l'érable", "the maple tree"], say: ["The window again, and it is late winter long ago. Look at the buckets hanging on the trees! These are <em>maple trees</em>, and the sap inside them is sweet.",
      "First Nations of this region, among them the Abenaki, the Algonquin and the Wendat, made maple sugar long before any ships came. They taught the French settlers how.",
      "Olivier's family still makes maple sugar today.",
      "A maple tree is <em>l'érable</em>. It takes about <em>40 litres of sap</em> to make just 1 litre of syrup. That is a lot of buckets and a lot of boiling."] },
    { ask: "lf_sap", intro: "Do the syrup sums. Three right answers and we visit the sugar shack." },
    { art: "lf_choice", pick: "The clock hops us to early spring, when the sap runs and snow is still on the ground. We are at Olivier's sugar shack, which he calls la cabane à sucre. Steam is pouring out of the roof! What shall we do first?", options: [
      { label: "Maple taffy on snow", art: "lf_taffy", word: ["la tire", "maple taffy"], say: ["Hot syrup is poured in lines on clean snow. It cools into chewy taffy, and you roll it up onto a stick. Olivier says it is the best part of spring.",
        "In French it is <em>la tire</em>. Mine stuck to my feathers. I may be sticky until Tuesday."] },
      { label: "A sleigh ride", art: "lf_sleigh", word: ["le traîneau", "the sleigh"], say: ["A horse pulls us through the maple wood. The snow squeaks, and the sap buckets slide by on the trees.",
        "A sleigh is <em>le traîneau</em>. The horse stayed calm the whole ride. I did not, but I am an owl, and owls are dramatic."] }] },
    { ask: "lf_share", intro: "The clock hops us back to summer, and the farm stand is full of strawberries. Three right answers finishes the chapter." },
    { art: "lf_goodbye", word: ["le sirop d'érable", "maple syrup"], say: ["Olivier gave me a little tin of <em>le sirop d'érable</em>, which is maple syrup. It is the best thing I have ever put on a pancake.",
      "He says Quebec makes most of the maple syrup in the whole world. I believe him. I have the sticky feathers to prove it.",
      "Out on the river the water is getting wider, and it is slowly turning salty. The sea is not far now.",
      "Merci, Olivier! Next we sail for the Acadian shore of Nova Scotia, where people won farmland from the sea. Yes, really. Tick tock!"] }
  ] };
}
