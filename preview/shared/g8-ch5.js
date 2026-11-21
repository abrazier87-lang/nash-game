"use strict";
// Grade 8, Chapter 5: The Golden Stairs. Dr. Somebody meets Dana, a Tr'ondëk Hwëch'in girl of Dawson City, Yukon. The gold rush of 1896 to 1898, the Chilkoot Pass and the ton of goods, and what the rush did to the people whose land this is.
{
  const dana = (x, y, s) => kidAt(x, y, s, WHO.dana);          // Dana: long hair and a green hoodie
  const CAM = { hood: "#3b82c4", short: true, vest: true };      // Dana's cousin Cam, a trail guide: short hair, a blue hoodie and an orange vest
  const cam = (x, y, s) => kidAt(x, y, s, CAM);
  const f1 = n => +n.toFixed(1);
  const fx = n => String(+n.toFixed(2));                         // a decimal with no extra zeros
  const dollars = n => "$" + fmt(n);

  // low wooded hills in two layers (y is where the far edge sits)
  const lowHills = (y, c1, c2) => `<g ${INKED}><path d="M-10 ${y} Q70 ${y - 30} 150 ${y - 10} T300 ${y - 14} T410 ${y - 4} V250 H-10 Z" fill="${c1}"/></g><g ${INKED}><path d="M-10 ${y + 34} Q120 ${y + 12} 250 ${y + 30} T410 ${y + 22} V250 H-10 Z" fill="${c2}"/></g>`;
  const pines = pts => pts.map(([x, y, s, c]) => pine(x, y, s, c)).join("");
  // a wooden boardwalk with a dirt street below it (y is the top of the boardwalk)
  const street = y => `<g ${INKED}><path d="M-10 ${y + 12} H410 V250 H-10 Z" fill="#c9a56a"/><rect x="-10" y="${y}" width="420" height="12" fill="#b98b54"/></g><path d="${Array.from({ length: 15 }, (_, i) => `M${i * 28} ${y} v12`).join(" ")}" stroke="#7a5326" stroke-width="1.4" fill="none"/>`;
  // a false-front building: a flat tall front with a cornice, a sign board, a window and a door (x is the left edge, y the ground)
  const falseFront = (x, y, w, h, c) => `<g ${INKED}><rect x="${x}" y="${y - h}" width="${w}" height="${h}" fill="${c}"/><rect x="${x - 3}" y="${y - h - 6}" width="${w + 6}" height="8" rx="2" fill="#8a5a2b"/></g><g ${THIN}><rect x="${f1(x + w * .12)}" y="${f1(y - h * .88)}" width="${f1(w * .76)}" height="${f1(h * .2)}" fill="#f1e3c0"/><rect x="${f1(x + w * .12)}" y="${f1(y - h * .55)}" width="${f1(w * .26)}" height="${f1(h * .26)}" fill="#bfe6f7"/><rect x="${f1(x + w * .56)}" y="${f1(y - h * .5)}" width="${f1(w * .26)}" height="${f1(h * .5)}" rx="2" fill="#5a3a1c"/></g>`;
  const row = (ground, list) => list.map(([x, w, h, c]) => falseFront(x, ground, w, h, c)).join("");
  // a log cabin with a sod roof of green grass (x is the middle, y the ground)
  const cabin = (x, y, s) => `<g transform="translate(${x} ${y}) scale(${s})"><g ${INKED}><rect x="-36" y="-34" width="72" height="34" fill="#a9703a"/><path d="M-42 -34 L-28 -52 H28 L42 -34 Z" fill="#7fae5a"/></g><path d="M-36 -24 H36 M-36 -14 H36 M-36 -4 H36" stroke="#6b4426" stroke-width="1.6" fill="none"/><g ${THIN}><rect x="-8" y="-24" width="16" height="24" rx="2" fill="#4a2e1a"/><rect x="16" y="-27" width="14" height="12" fill="#bfe6f7"/></g><path d="M-30 -52 q-2 -6 2 -9 M-12 -53 q-2 -6 3 -8 M8 -53 q2 -6 -1 -9 M26 -52 q-1 -6 3 -8" stroke="#4c7a2e" fill="none" stroke-width="2" stroke-linecap="round"/></g>`;
  // a paddle-wheel riverboat facing right, with its wheel at the back (x is the middle, y the waterline)
  const riverboat = (x, y, s) => `<g transform="translate(${x} ${y}) scale(${s})"><g ${INKED}><path d="M-44 -14 H46 L38 0 H-36 Z" fill="#fbf6ea"/><rect x="-28" y="-30" width="58" height="16" fill="#fbf1dc"/><rect x="-18" y="-42" width="38" height="12" fill="#e63946"/><rect x="-12" y="-62" width="7" height="22" fill="#3a3a3a"/><rect x="8" y="-62" width="7" height="22" fill="#3a3a3a"/><circle cx="-46" cy="-8" r="14" fill="#c89a5e"/></g><path d="M-46 -22 V6 M-60 -8 H-32 M-56 -18 L-36 2 M-56 2 L-36 -18" stroke="#2b1a10" stroke-width="1.6" stroke-linecap="round" fill="none"/><g fill="#bfe6f7" ${THIN}><rect x="-22" y="-27" width="9" height="8"/><rect x="-6" y="-27" width="9" height="8"/><rect x="10" y="-27" width="9" height="8"/></g></g>`;
  // a gold pan seen from a little above, with a few grains of gold in the water (x, y is the middle)
  const goldPan = (x, y, s) => `<g transform="translate(${x} ${y}) scale(${s})"><g ${INKED}><ellipse cx="0" cy="0" rx="34" ry="12" fill="#8d877b"/><ellipse cx="0" cy="2" rx="26" ry="8" fill="#6a6f7a"/></g><ellipse cx="-4" cy="4" rx="16" ry="4" fill="#6cc0ea" opacity=".85"/><circle cx="-10" cy="5" r="2" fill="#f4b942"/><circle cx="-2" cy="6" r="1.6" fill="#f4b942"/><circle cx="6" cy="5" r="2" fill="#f4b942"/><circle cx="0" cy="3" r="1.3" fill="#ffd23f"/></g>`;
  // gold scales: a stand, a level beam and two brass dishes, with a little heap of gold dust on the left (x is the middle, y the ground)
  const scales = (x, y, s) => `<g transform="translate(${x} ${y}) scale(${s})"><g ${INKED}><path d="M-14 0 H14 L8 -8 H-8 Z" fill="#8a5a2b"/><rect x="-2.5" y="-50" width="5" height="44" fill="#c98a1b"/><path d="M-34 -46 H34" fill="none" stroke-width="4"/><circle cx="0" cy="-52" r="5" fill="#f4b942"/></g><path d="M-34 -46 L-44 -22 M-34 -46 L-24 -22 M34 -46 L24 -22 M34 -46 L44 -22" stroke="#2b1a10" stroke-width="1.6" fill="none"/><g ${INKED}><path d="M-48 -22 H-20 Q-22 -14 -34 -14 Q-46 -14 -48 -22 Z" fill="#c98a1b"/><path d="M20 -22 H48 Q46 -14 34 -14 Q22 -14 20 -22 Z" fill="#c98a1b"/></g><path d="M-42 -22 Q-34 -34 -26 -22 Z" fill="#ffd23f" ${THIN}/><rect x="28" y="-31" width="12" height="9" rx="2" fill="#8d877b" ${THIN}/></g>`;
  // the ton of goods: crates, sacks and a barrel in a great heap (x is the middle, y the ground)
  const tonPile = (x, y, s) => `<g transform="translate(${x} ${y}) scale(${s})"><g ${INKED}><rect x="-46" y="-26" width="34" height="26" fill="#c89a5e"/><rect x="-10" y="-26" width="30" height="26" fill="#b98b54"/><rect x="-36" y="-50" width="30" height="24" fill="#b98b54"/><path d="M24 0 H50 Q54 -16 50 -32 H24 Q20 -16 24 0 Z" fill="#c89a5e"/><path d="M0 -26 Q-4 -44 4 -52 H14 Q22 -44 18 -26 Z" fill="#e8d2a0"/><path d="M-30 -50 Q-34 -66 -26 -72 H-14 Q-6 -66 -10 -50 Z" fill="#e8d2a0"/></g>
    <g ${THIN}><path d="M-46 -26 L-12 0 M-12 -26 L-46 0 M-10 -26 L20 0 M20 -26 L-10 0 M-36 -50 L-6 -26 M-6 -50 L-36 -26 M22 -10 H52 M22 -22 H52" fill="none" stroke-width="1.2"/></g></g>`;
  // a fish-drying rack: two posts, a crossbar and split fish hanging in a row (x is the middle, y the ground)
  const fishRack = (x, y, s) => `<g transform="translate(${x} ${y}) scale(${s})" ${THIN}><path d="M-26 0 V-44 M26 0 V-44 M-30 -40 H30" fill="none" stroke-width="3.4" stroke="#2b1a10"/><path d="M-26 0 V-44 M26 0 V-44 M-30 -40 H30" fill="none" stroke-width="1.8" stroke="#8a5a2b"/>${[-20, -10, 0, 10, 20].map(k => `<path d="M${k} -38 q-5 8 0 16 q5 -8 0 -16 Z" fill="#f08a5d"/>`).join("")}</g>`;
  const barrel = (x, y, s) => `<g transform="translate(${x} ${y}) scale(${s})" ${INKED}><path d="M-14 0 H14 Q18 -14 14 -28 H-14 Q-18 -14 -14 0 Z" fill="#c89a5e"/><path d="M-16 -8 H16 M-16 -20 H16" fill="none" stroke-width="2"/></g>`;
  // one tiny dark figure with a pack, climbing (x, y is the feet)
  const tiny = (x, y) => `<g fill="#2b1a10"><rect x="${f1(x - 2)}" y="${f1(y - 6)}" width="4" height="9" rx="2"/><circle cx="${f1(x)}" cy="${f1(y - 9)}" r="2.4"/><rect x="${f1(x + 1)}" y="${f1(y - 7)}" width="4" height="7" rx="1.5"/></g>`;
  const along = (x0, y0, x1, y1, n, make) => Array.from({ length: n }, (_, i) => { const t = (i + .5) / n; return make(x0 + (x1 - x0) * t, y0 + (y1 - y0) * t); }).join("");
  const stairTicks = (x0, y0, x1, y1, n) => `<g stroke="#9fb6d0" stroke-width="2.4" stroke-linecap="round">${along(x0, y0, x1, y1, n, (x, y) => `<path d="M${f1(x - 6)} ${f1(y)} h12"/>`)}</g>`;

  // the window into the past, look 1 (August 1896): a creek, a camp, and a small party panning at the bank
  const gsWin1 = `<rect width="400" height="240" fill="#f6e3b4"/><g ${INKED}><path d="M120 120 Q200 96 280 112 T360 108 V250 H120 Z" fill="#a9cf86"/></g>${pine(176, 112, .55)}${pine(202, 108, .45, "#3f9a58")}${pine(300, 106, .55)}${pine(326, 110, .45, "#3f9a58")}
    <g ${INKED}><path d="M168 250 Q200 196 226 168 Q250 146 262 124 L274 126 Q262 154 244 176 Q222 204 224 250 Z" fill="#6cc0ea"/></g>
    ${tent(168, 188, .6)}${person(190, 150, .5, "#c98f58")}${person(208, 158, .5, "#3b6ea5")}${person(286, 148, .44, "#b98b54")}${person(304, 152, .42, "#7a4a24")}${goldPan(196, 176, .3)}`;
  // the window, look 2 (1898): the town crowding in, a camp of fish racks, and a few people walking away with their bundles
  const gsWin2 = `<rect width="400" height="240" fill="#efe6c8"/><g ${INKED}><path d="M100 110 Q170 90 240 104 T310 98 V250 H100 Z" fill="#9fc08a"/></g>${pine(126, 108, .5)}${pine(152, 104, .42, "#3f9a58")}${pine(272, 100, .5)}${pine(292, 102, .4, "#3f9a58")}
    <g ${INKED}><path d="M100 150 Q200 134 310 150 V250 H100 Z" fill="#c9b78a"/></g>
    ${falseFront(122, 160, 16, 24, "#e8c58a")}${falseFront(140, 160, 18, 30, "#d98a7a")}${falseFront(160, 160, 20, 36, "#9fc6d8")}${falseFront(182, 160, 16, 26, "#bfd9a0")}
    ${tent(210, 166, .5)}${fishRack(236, 164, .55)}${fishRack(260, 168, .5)}${person(222, 144, .4, "#c98f58")}${person(246, 142, .38, "#b98b54")}
    <g ${INKED}><path d="M100 188 Q200 176 310 190 V250 H100 Z" fill="#6cc0ea"/></g>${riverboat(196, 192, .5)}`;

  Object.assign(ART, {
    gs_arrive: () => frame(`${sky("#bfe0ef", "#fdebd0", [340, 60, 18], [[60, 40, .8], [240, 26, .5]])}${lowHills(118, "#8fb89a", "#7fae8a")}${pines([[30, 118, .55], [62, 112, .5], [96, 120, .6, "#3f9a58"], [310, 112, .5], [344, 116, .6, "#3f9a58"], [376, 110, .5]])}
      <path d="M250 150 Q252 172 232 198" fill="none" stroke="#2b1a10" stroke-width="18" stroke-linecap="round"/><path d="M250 150 Q252 172 232 198" fill="none" stroke="#6cc0ea" stroke-width="12" stroke-linecap="round"/>
      ${falseFront(268, 176, 16, 20, "#e8c58a")}${falseFront(288, 176, 20, 28, "#d98a7a")}${falseFront(312, 176, 16, 22, "#9fc6d8")}${falseFront(332, 176, 22, 30, "#bfd9a0")}${falseFront(358, 176, 16, 22, "#c9a07a")}
      ${water(196, "#6cc0ea")}${riding(110, 0, 120)}`),
    gs_meet: () => frame(`${sky("#cfe6f2", "#fdebd0", [326, 88, 18], [[70, 40, .7], [200, 30, .5]])}${lowHills(112, "#8fb89a", "#7fae8a")}${row(178, [[8, 56, 54, "#e8c58a"], [66, 44, 40, "#9fc6d8"], [112, 60, 58, "#d98a7a"], [176, 46, 42, "#bfd9a0"], [226, 58, 52, "#e8c58a"], [288, 48, 44, "#c9a07a"], [340, 52, 56, "#9fc6d8"]])}${street(178)}${toboggan(318, 222, .9)}${owlAt(36, 126, 106)}${dana(190, 142, 1.05)}`),
    gs_window1: () => frame(`${sky("#bfe0ef", "#fdebd0", null, [[60, 40, .7]])}${lowHills(170, "#8fb89a", "#7fae8a")}${windowAt(236, 112, 92, gsWin1)}${owlAt(18, 118, 108)}${dana(118, 150, .95)}`),
    gs_pass: () => frame(`${sky("#cfe0f2", "#eef4fb", null, [[70, 36, .7], [330, 50, .6]])}<g ${INKED}><path d="M-10 214 V110 L52 58 L112 100 L170 50 L222 84 L262 74 L304 58 L352 32 L410 92 V214 Z" fill="#f4f8fc"/></g><path d="M170 50 L222 84 L196 112 L166 92 Z M352 32 L410 92 L384 96 L340 64 Z M52 58 L112 100 L84 108 L40 80 Z" fill="#b9c4d4" opacity=".8"/>${snow(188, "#fff", "#e6f0fa")}
      ${stairTicks(240, 178, 264, 84, 16)}${along(241, 176, 263, 90, 8, tiny)}${toboggan(256, 224, .9)}${tonPile(332, 216, .9)}${owlAt(22, 128, 100)}${dana(122, 146, .95)}${cam(180, 140, 1.05)}`),
    gs_window2: () => frame(`${sky("#cdd9df", "#efe6c8", null, [[60, 40, .7], [340, 52, .6]])}${lowHills(190, "#b9c9a4", "#a9bb94")}${windowAt(200, 116, 92, gsWin2)}`),
    gs_choice: () => frame(`${sky("#cfe6f2", "#fdebd0", [60, 70, 18], [[200, 36, .7], [330, 56, .5]])}${lowHills(116, "#8fb89a", "#7fae8a")}${row(176, [[12, 50, 44, "#9fc6d8"], [66, 60, 56, "#e8c58a"], [132, 44, 40, "#bfd9a0"], [182, 54, 50, "#d98a7a"], [242, 46, 42, "#c9a07a"], [294, 58, 54, "#9fc6d8"], [358, 40, 38, "#e8c58a"]])}${street(176)}${toboggan(304, 226, .8)}${barrel(354, 226, 1)}${goldPan(354, 198, .5)}${owlAt(22, 128, 104)}${dana(150, 144, 1)}${cam(228, 138, 1.05)}`),
    gs_trail: () => frame(`${sky("#cfe0f2", "#eef4fb", null, [[70, 34, .7], [330, 30, .5]])}<g ${INKED}><path d="M-10 160 L50 70 L110 120 L170 52 L250 130 L330 40 L410 100 V250 H-10 Z" fill="#c9d4e4"/></g>
      <g ${INKED}><path d="M-10 217 L410 91 V250 H-10 Z" fill="#fff"/></g><g ${INKED}><path d="M-10 240 L410 140 V250 H-10 Z" fill="#e6f0fa"/></g>
      ${Array.from({ length: 10 }, (_, i) => { const x = 20 + i * 38, y = 214 - .3 * x + 16; return `<path d="M${x} ${f1(y)} h18" stroke="#9fb6d0" stroke-width="3" stroke-linecap="round"/>`; }).join("")}
      ${owlAt(27, 103, 100)}${dana(170, 93, .95)}${cam(270, 55, 1.05)}`),
    gs_pan: () => frame(`${sky("#bfe0ef", "#fdebd0", [60, 56, 18], [[200, 34, .7], [330, 48, .5]])}${lowHills(120, "#8fb89a", "#7fae8a")}${cabin(330, 138, 1)}
      <g ${INKED}><path d="M-10 168 Q110 154 230 166 T410 160 V190 Q300 200 200 190 T-10 192 Z" fill="#6cc0ea"/></g><g fill="none" stroke="#fff" stroke-width="2.2" stroke-linecap="round" opacity=".7"><path d="M40 178 q8 -4 16 0 M150 184 q8 -4 16 0 M250 176 q8 -4 16 0"/></g>
      <g ${INKED}><path d="M-10 192 Q200 180 410 190 V250 H-10 Z" fill="#a9cf86"/></g><g ${INKED}><rect x="288" y="200" width="64" height="28" fill="#8a5a2b"/></g>${scales(320, 200, 1)}${goldPan(196, 226, .7)}${owlAt(24, 126, 104)}${dana(150, 146, 1)}`),
    gs_goodbye: () => frame(`${sky("#ffd9a0", "#fdebd0", [170, 114, 22], [[70, 40, .8], [330, 60, .6]])}${lowHills(130, "#c9b87a", "#b8a86c")}${pines([[40, 132, .5], [66, 128, .45], [300, 128, .5], [330, 132, .45], [360, 126, .5]])}${water(158, "#6cc0ea")}${riverboat(310, 192, .7)}
      <g ${INKED}><path d="M-10 204 Q120 190 240 202 T410 196 V250 H-10 Z" fill="#c9a56a"/></g>${dana(76, 146, 1)}${riding(240, 18, 112)}`)
  });

  Object.assign(ASK, {
    gs_trips() { // solving linear equations, told through the loads and the trips; one kind is a straight-line graph to tap
      const kind = rand(3);
      if (kind === 0) { const L = pick([20, 25, 30, 36, 45]), t = 900 / L;
        return { html: "", text: `The ton is <b>900 kg</b>. A packer carries <b>${L} kg</b> on every trip up the stairs. Solve <b>${L} × t = 900</b> to find the number of trips, t.`, choices: cards(t, [t + 4, t - 4, t + 10, 900 - L, L + t]), why: `${L} × t = 900, so t = 900 ÷ ${L} = ${t} trips.` }; }
      if (kind === 1) { const [a, c] = pick([[15, 150], [25, 150], [30, 150], [20, 300], [24, 300], [20, 400], [25, 400]]), x = (900 - c) / a;
        return { html: "", text: `Cam lays out the ton as <b>${a}</b> identical sacks plus <b>${c} kg</b> of tools. So <b>${a}x + ${c} = 900</b>. How many kilograms is one sack, x?`, choices: cards(x, [900 / a, (900 + c) / a, 900 - c, x + 10, x - 5]), why: `${a}x + ${c} = 900, so ${a}x = ${900 - c}. Then x = ${900 - c} ÷ ${a} = ${x} kg.` }; }
      const T = pick([4, 5, 6, 7]), K = 25 * T, items = shuffle([{ p: [T, K], ok: true }, { p: [T, K - 75] }, { p: [T - 2, K] }, { p: [T + 2, K + 50] }]), spots = items.map(i => i.p), right = items.findIndex(i => i.ok);
      return { tap: true, html: graph({ xmax: 10, ymax: 250, xstep: 1, ystep: 25, xl: "trips", yl: "kg carried", line: [25, 0], spots }), text: `The red line shows the kilograms carried against the trips, at <b>25 kg</b> a trip. Tap the point on the line where a packer has carried <b>${K} kg</b>.`,
        choices: spots.map((s, i) => ({ pick: String(i), ok: i === right })), why: `${K} ÷ 25 = ${T}, so the point on the line is at ${T} trips and ${K} kg.` };
    },
    gs_dust() { // gold dust as money: mass, a price per gram, percent, and simple interest on a loan
      const kind = rand(3);
      if (kind === 0) { const p = pick([10, 20, 25, 40, 50]), g = pick([6, 8, 12, 15, 24]), v = p * g;
        if (rand(2) === 0) return { html: "", text: `A simple, made-up price: <b>$${p}</b> for each gram of gold dust. A miner's pouch holds <b>${g} g</b>. What is the pouch worth?`, choices: textCards(dollars(v), [p + g, v + p, v - p, v * 2, v + g].map(dollars)), why: `${g} g × $${p} per gram = ${dollars(v)}.` };
        return { html: "", text: `Take a simple, made-up price of <b>$${p}</b> a gram. The outfitter's bill is <b>${dollars(v)}</b>. How many grams of gold dust pay it?`, choices: cards(g, [g + 2, g - 2, v - p, p, g * 2]), why: `${dollars(v)} ÷ $${p} per gram = ${g} g.` }; }
      if (kind === 1) { const W = pick([40, 80, 100, 200]), p = pick([10, 20, 25, 50]), sand = W * p / 100, a = W - sand;
        return { html: "", text: `A pouch of dust weighs <b>${W} g</b>, but <b>${p}%</b> of it is black sand. How many grams of the pouch are real gold?`, choices: cards(a, [sand, W + sand, W - p, a + 5, a - 5]), why: `${p}% of ${W} is ${sand} g of sand. ${W} − ${sand} = ${a} g of gold.` }; }
      const P = pick([200, 300, 400, 500, 600]), r = pick([2, 4, 5, 10]), t = pick([2, 3, 4, 6]), I = P * r * t / 100;
      return { html: "", text: `An outfitter lends a stampeder <b>${dollars(P)}</b> at <b>${r}%</b> simple interest each month. How much does he owe in all after <b>${t} months</b>?`, choices: textCards(dollars(P + I), [I, P + P * r / 100, P + P * r * (t + 1) / 100, P + r * t, P * t].map(dollars)), why: `Interest = ${P} × ${r}% × ${t} = ${dollars(I)}. He owes ${P} + ${I} = ${dollars(P + I)}.` };
    },
    gs_case(g) { // THE CASE FILE: packing the ton, in three linked steps (the total mass, the trips, the days)
      const c = (g && g.case) || {};
      if (!c.set) { c.set = true;
        c.rows = pick([
          [["Flour sacks", 12, 25, 4], ["Bacon boxes", 10, 20, 6], ["Bean sacks", 8, 25, 3], ["Tools, stove and tent", 1, 200, 60]],
          [["Flour sacks", 16, 25, 4], ["Bacon boxes", 5, 20, 6], ["Bean sacks", 10, 20, 3], ["Tools, stove and tent", 1, 200, 60]],
          [["Flour sacks", 8, 25, 4], ["Bacon boxes", 5, 20, 6], ["Bean sacks", 6, 25, 3], ["Tools, stove and tent", 1, 150, 50]],
          [["Flour sacks", 10, 25, 4], ["Bacon boxes", 5, 20, 6], ["Bean sacks", 10, 10, 3], ["Tools, stove and tent", 1, 150, 50]]]);
        c.M = c.rows.reduce((s, r) => s + r[1] * r[2], 0); c.cost = c.rows.reduce((s, r) => s + r[1] * r[3], 0); c.each = c.rows.reduce((s, r) => s + r[2], 0);
        c.L = pick([25, 30]); c.T = c.M / c.L; c.tp = pick([2, 3, 4].filter(k => c.T % k === 0)); c.D = c.T / c.tp; }
      const step = g ? g.stars || 0 : rand(3);
      if (step === 0) {
        const table = `<table style="margin:0 auto 6px;border-collapse:collapse;font-size:.8em"><tr><th style="padding:1px 8px">Supply</th><th style="padding:1px 8px">How many</th><th style="padding:1px 8px">kg each</th><th style="padding:1px 8px">$ each</th></tr>${c.rows.map(r => `<tr><td style="padding:1px 8px;text-align:left">${r[0]}</td><td style="padding:1px 8px">${r[1]}</td><td style="padding:1px 8px">${r[2]}</td><td style="padding:1px 8px">${r[3]}</td></tr>`).join("")}</table>`;
        return { html: table, text: `Cam is packing one stampeder's outfit, listed above. What is the <b>total mass</b> of everything, in kilograms?`, choices: cards(c.M, [c.cost, c.M - 100, c.M + 100, c.each, c.M - 50, c.M + 50]), why: `Mass of each row: ${c.rows.map(r => r[1] * r[2]).join(" + ")} = ${c.M} kg.` }; }
      if (step === 1)
        return { html: "", text: `The outfit weighs <b>${c.M} kg</b>. A packer carries <b>${c.L} kg</b> on each trip. How many trips up the stairs does it take?`, choices: cards(c.T, [c.T + 5, c.T - 5, c.T * 2, c.M - c.L, c.T + 10, c.L]), why: `${c.M} ÷ ${c.L} = ${c.T} trips.` };
      return { html: "", text: `Suppose the packer makes <b>${c.tp} trips</b> each day, and the job takes <b>${c.T} trips</b> in all. How many days does the job take?`, choices: cards(c.D, [c.T - c.tp, c.T + c.tp, c.D + 2, c.D - 2, c.T * c.tp]), why: `${c.T} trips ÷ ${c.tp} trips a day = ${c.D} days.` };
    },
    gs_last(g) { // follows the choice: the Chilkoot Trail with Cam (0: slope, steps and time) or panning for gold (1: grams, dollars and percent)
      const way = g && g.choice ? 1 : 0, kind = rand(3);
      if (way === 0) {
        if (kind === 0) { const [R, D, s] = pick([[30, 40, .75], [60, 80, .75], [40, 50, .8], [30, 50, .6], [20, 40, .5], [45, 60, .75], [24, 30, .8]]);
          return { html: "", text: `Cam sketches a slope of the trail. It rises <b>${R} m</b> over a horizontal run of <b>${D} m</b>. What is the slope (rise ÷ run) as a decimal?`, choices: textCards(fx(s), [D / R, 1 - s, s + .25, s * 2, s / 2].map(fx)), why: `Slope = rise ÷ run = ${R} ÷ ${D} = ${fx(s)}.` }; }
        if (kind === 1) { const r = pick([20, 25, 30, 50, 60]), m = 1500 / r;
          return { html: "", text: `The Golden Stairs had about <b>${fmt(1500)}</b> steps. Cam's group climbs <b>${r}</b> steps a minute. How many minutes does the whole staircase take?`, choices: cards(m, [m + 10, m - 10, 1500 - r, r, m * 2]), why: `${fmt(1500)} ÷ ${r} = ${m} minutes.` }; }
        const h = pick([10, 15, 20, 25]), m = 1500 * h / 100;
        return { html: "", text: `Imagine each of the <b>${fmt(1500)}</b> steps is <b>${h} cm</b> high. How many metres does the staircase climb in all?`, choices: cards(m, [1500 * h, m * 10, m + 100, m - 50, h * 100]), why: `${fmt(1500)} × ${h} cm = ${fmt(1500 * h)} cm. Divide by 100 to get ${m} m.` };
      }
      if (kind === 0) { const x = pick([2, 3, 4, 5]), n = pick([6, 8, 10, 12]), p = pick([10, 20]), v = x * n * p;
        return { html: "", text: `Imagine Dana's pan gives about <b>${x} g</b> of dust each time, and she pans <b>${n}</b> times today. At a simple, made-up <b>$${p}</b> a gram, what is her dust worth?`, choices: textCards(dollars(v), [x * n, x * p, n * p, v * 2, v / 2, v + p].map(dollars)), why: `${x} g × ${n} = ${x * n} g. ${x * n} × $${p} = ${dollars(v)}.` }; }
      if (kind === 1) { const V = pick([200, 400, 500, 800]), f = pick([5, 10, 20, 25]), fee = V * f / 100, a = V - fee;
        return { html: "", text: `A pouch of dust is worth <b>${dollars(V)}</b>. The assay office keeps a fee of <b>${f}%</b>. How many dollars does the miner get to keep?`, choices: cards(a, [fee, V + fee, V - f, V / 2, V - fee * 2]), why: `${f}% of ${V} = ${fee}. ${V} − ${fee} = ${a} dollars.` }; }
      const [a, b] = pick([[20, 25], [40, 50], [50, 60], [10, 15], [20, 30], [25, 30], [40, 60]]), p = Math.round((b - a) * 100 / a);
      return { html: "", text: `The made-up price of gold dust rises from <b>$${a}</b> to <b>$${b}</b> a gram. What is the percent increase?`, choices: textCards(`${p}%`, [b - a, Math.round(b * 100 / a), p + 10, p - 5, p * 2].map(k => `${k}%`)), why: `Increase = ${b} − ${a} = ${b - a}. ${b - a} ÷ ${a} = ${fx(p / 100)}, which is ${p}%.` };
    }
  });

  // READERS: Tr'ondëk Hwëch'in readers; Tlingit or Tagish readers for the discovery party and the Chilkoot packers.
  // FACT CHECK: Gold was found on Rabbit Creek (soon renamed Bonanza Creek, a tributary of the Klondike River) in August 1896 by a party of Keish (Skookum Jim Mason), his sister Shaaw Tláa (Kate Carmack), their nephew Káa Goox (Dawson Charlie) and Kate's husband George Carmack. The story says the three relatives are "Tagish and Tlingit". Check the spellings and accents of Keish, Shaaw Tláa and Káa Goox, and the way the family is described.
  // FACT CHECK: The news reached the outside world in 1897 and about 100,000 people set out for the Klondike. Only about 30,000 to 40,000 arrived, and only a few thousand found any gold. (The numbers are the task's and are rounded.)
  // FACT CHECK: The North-West Mounted Police required each person entering the Yukon to bring about a year of supplies, about a ton (roughly 900 kg), so that nobody would starve. Check the wording "would not let anyone in without".
  // FACT CHECK: The Chilkoot Trail was an old Tlingit trading route, and Tlingit people worked as packers carrying loads for the gold seekers, for pay. 1,500 steps were cut into the ice and snow for the last climb, called the Golden Stairs. One person could carry about 25 to 30 kg at a time, so a ton took about 30 or 40 trips, over weeks. The Chilkoot Trail is a hiking trail today (a national historic site), and the story does not say who looks after it.
  // FACT CHECK: Some people dragged goods on sleds on the gentler parts of the trail, and some borrowed from outfitters and paid interest. The story says "some" in both places, and the loan and the interest in the questions are made up for the maths.
  // FACT CHECK: In two years a fish camp at the river mouth became the city of Dawson, about 30,000 people in 1898, for a moment one of the largest cities in western Canada. The Tr'ondëk Hwëch'in had fished and hunted there for thousands of years and were pushed out of their camp at Tr'ochëk. Their leader, Chief Isaac, moved his people a few kilometres downriver to Moosehide to keep them together, and, afraid their songs and dances would be lost in the upheaval, sent them to relatives in Alaska for safekeeping. Generations later they were brought home. The Tr'ondëk Hwëch'in signed a modern land claim and self-government agreement in 1998. Check the spellings (Tr'ondëk Hwëch'in, Tr'ochëk, Moosehide) and every sentence of that scene with Tr'ondëk Hwëch'in readers. The name is not given as a "word" and its meaning is not translated in the story (it is often explained as "the people of the river", meaning the Klondike River): add it only if the community agrees.
  // FACT CHECK: Gold was worth about 16 dollars an ounce in the 1890s. The story and the questions use simple, MADE-UP prices per gram (10 to 50 dollars) and say so, so the maths is easy. Interest rates, fees and the black sand in the pouch are made up too. The step heights in the stairs question are made up ("Imagine").
  // FACT CHECK: In summer the sun hardly sets in Dawson (it is a little south of the Arctic Circle), and winters are deep cold.
  // FACT CHECK: Dana, her cousin Cam and the creek claim where we pan are made up. Cam's work as a trail guide and Dana's panning are only story.
  // FACT CHECK: Added from Shane's review notes (November 2026): the scene now says who pushed the Tr'ondëk Hwëch'in out of Tr'ochëk (gold seekers pouring in, the people building the new town, and government officials who let them take the land); pronunciation guides for Tr'ondëk Hwëch'in and Tr'ochëk; the l'or word card was removed (it is a word card in Chapter 2).
  // FACT CHECK: French words: l'or (the gold), la ruée vers l'or (the gold rush), le traîneau (the sled), le sentier (the trail), la balance (the scales). No Indigenous-language words are given as words to collect.
  CHAPTERS[4] = { title: "The Golden Stairs", where: "The Klondike, Yukon", beats: [
    { art: "gs_arrive", say: ["The clock is quiet this morning, and so am I. We drift north over mountains and then over a long, wide valley with low wooded hills. The air is clear and cool.",
      "Far below, two rivers meet. One is wide and slow, the <em>Yukon</em>. The other is smaller and joins it, the <em>Klondike</em>. At the meeting place there is a small town of wooden buildings.",
      "This is <em>Dawson City</em>, in the Yukon. In summer the sun hardly sets here, and in winter it is deep cold. We land softly beside the river."] },
    { art: "gs_meet", say: ["On a wooden boardwalk a girl is waiting for us. This is Dana. She lives in Dawson, and she is a citizen of the <em>Tr'ondëk Hwëch'in</em>, the First Nation whose land this is.",
      "You say it TRON-dek HWITCH-in.",
      "Dana says her people have fished and hunted along these rivers for thousands of years. The tall wooden false-front buildings around us are more than a hundred years old.",
      "People come from all over the world to hear about the gold. We already know the French word for gold, l'or. I held a gold coin once, and I gave it back, because it was heavier than it looked."] },
    { art: "gs_window1", word: ["la ruée vers l'or", "the gold rush"], say: ["The window into the past! It is August <em>1896</em>, at Rabbit Creek, soon to be renamed Bonanza Creek. A small party is here: Keish, called Skookum Jim, and his sister Shaaw Tláa, called Kate Carmack.",
      "With them are their nephew Káa Goox, called Dawson Charlie, and Kate's husband George Carmack. Keish, Shaaw Tláa and Káa Goox are Tagish and Tlingit. Together they find <em>gold</em> in the creek.",
      "The news reaches the outside world in 1897, and about <em>100,000</em> people set out for the Klondike. This is the gold rush, la ruée vers l'or. Only about 30,000 to 40,000 arrive, and only a few thousand find any gold.",
      "The North-West Mounted Police will not let anyone into the Yukon without a year of supplies, about a <em>ton</em> (roughly 900 kilograms), so that nobody starves. One way in is over the Chilkoot Pass, on foot."] },
    { ask: "gs_trips", intro: "Nine hundred kilograms is a lot to carry up a mountain. Three right answers and the clock hops us to the Chilkoot Pass. Each right answer also earns you a pinch of gold dust." },
    { art: "gs_pass", word: ["le traîneau", "the sled"], say: ["The clock hops us south, over the mountains, to the foot of the <em>Chilkoot Pass</em>. Dana's cousin Cam is here, a trail guide in an orange vest. Above us a line of tiny figures climbs a steep white slope.",
      "Today they are hikers. In 1898 they were gold seekers. The Chilkoot Trail was a trading route of the Tlingit long before the gold rush, and Tlingit packers carried loads for the gold seekers.",
      "The last climb was so steep that 1,500 steps were cut into the ice and snow. People called them the <em>Golden Stairs</em>. One person could carry only 25 to 30 kilograms at a time, so a ton took 30 or 40 trips, up and back down, for weeks.",
      "Some people dragged their goods on a sled, le traîneau, where the ground was gentler. Money was a worry too. Gold dust was weighed on scales to pay bills, and some people borrowed from outfitters and paid interest."] },
    { ask: "gs_dust", intro: "In the Klondike, gold dust was money, and money has to be weighed and counted. Three right answers and the window opens again, and this time it is a serious look." },
    { art: "gs_window2", say: ["The window opens again, and I go quiet. It is 1898. In two years a fish camp at the river mouth has become a city of about <em>30,000</em> people. For a moment it is one of the largest cities in western Canada.",
      "The Tr'ondëk Hwëch'in had fished and hunted here for thousands of years. Their camp was at Tr'ochëk. You say it TROH-chek.",
      "Gold seekers pour in by the thousands, and people build a new town. Government officials let them take the land. The Tr'ondëk Hwëch'in are pushed out of their camp."] },
    { art: "gs_window2", say: ["Their leader, <em>Chief Isaac</em>, moves his people a few kilometres downriver to Moosehide, to keep them together.",
      "Afraid that their songs and dances will be lost in all the upheaval, he sends them to relatives in Alaska for safekeeping. Generations later, they are brought home."] },
    { ask: "gs_case", intro: "This is a case file: one problem in three steps, and each answer feeds the next. Cam is packing a ton for a stampeder. Three right answers and we choose how to spend the afternoon." },
    { art: "gs_choice", pick: "Back in the present, Dana is quiet for a moment. She tells us the Tr'ondëk Hwëch'in are still here, and in 1998 they signed a modern land claim and self-government agreement. Then she smiles. Cam has driven up to meet us, with two ideas for the afternoon. Shall we climb a stretch of the Chilkoot Trail, or pan for gold at a creek claim?", options: [
      { label: "Climb the Chilkoot Trail with Cam", art: "gs_trail", word: ["le sentier", "the trail"], say: ["Cam leads us up a stretch of the Chilkoot Trail, one careful step at a time. A narrow path like this is a <em>trail</em>, le sentier in French. I counted my steps, and then I lost count of my counting.",
        "Cam says every hiker today walks the same ground as the Tlingit traders, the packers and the gold seekers before them. We stop often to look back at how far we have climbed."] },
      { label: "Pan for gold at a creek claim", art: "gs_pan", word: ["la balance", "the scales"], say: ["Dana shows us how to pan. You scoop gravel and water into the pan and swirl it round and round. The heavy gold sinks, and the light gravel washes away. I mostly got wet.",
        "A tiny heap of dust goes onto a little set of <em>scales</em>, la balance in French. Gold is sold by its mass, so the scales matter a great deal."] }] },
    { ask: "gs_last", intro: "Cam and Dana have some last puzzles from the afternoon. Three right answers and we say goodbye." },
    { art: "gs_goodbye", say: ["The clock hops us back to Dawson, and we walk along the boardwalk in the long evening light. The sun is still up. Dana says in summer it hardly sets at all. I hope it does not mind me borrowing a little of it for my balloon.",
      "The Tr'ondëk Hwëch'in are still here, where the Klondike meets the Yukon, and Dana is growing up on this land. The gold rush lasted a few years. The river and the people have been here far longer.",
      "Thank you, Dana, and thank you, Cam. Now the clock turns north, past the last of the trees, to the top of the world. An old friend is waiting there, and I think you know her. It is <em>The Top of the World</em>, in Nunavut, where Nina lives. Tick tock!"] }
  ] };
}
