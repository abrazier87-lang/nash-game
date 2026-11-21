"use strict";
// Grade 7, Chapter 4: The Sea of Grass. Dr. Somebody meets Tyson, a Nakoda boy of today, in Grasslands National Park, Saskatchewan. The bison nation, the grass, and the loss of the bison told in two voices.
{
  const GUIDE = { hood: "#d9822b", short: true };      // Tyson: short hair and an orange hoodie
  const AUNTIE = { hood: "#7a4f9a" };                   // Tyson's auntie: long hair and a plum hoodie
  const tyson = (x, y, s) => kidAt(x, y, s, GUIDE);
  const fx = n => String(+n.toFixed(2));                // a decimal with no extra zeros
  const bigSky = clouds => sky("#8fd0f2", "#fdf0c8", null, clouds);
  // low rolling prairie in two layers of gold (y is where the far edge sits)
  const plain = (y, c1, c2) => `<g ${INKED}><path d="M-10 ${y} Q120 ${y - 10} 230 ${y - 2} T410 ${y - 6} V250 H-10 Z" fill="${c1 || "#d9c56a"}"/><path d="M-10 ${y + 34} Q140 ${y + 22} 270 ${y + 32} T410 ${y + 28} V250 H-10 Z" fill="${c2 || "#c8b258"}"/></g>`;
  const tuft = (x, y, s) => `<g transform="translate(${x} ${y}) scale(${s})" fill="none" stroke="#7a8a3a" stroke-width="2.2" stroke-linecap="round"><path d="M0 0 q-3 -10 -8 -14 M0 0 q0 -12 1 -18 M0 0 q3 -10 9 -13"/></g>`;
  const tufts = pts => pts.map(([x, y, s]) => tuft(x, y, s || 1)).join("");
  // a plains bison seen from the side, facing right (flip it to face left): dark brown, a big hump on the shoulders, small horns
  const bison = (x, y, s, flip) => `<g transform="translate(${x} ${y}) scale(${flip ? -s : s} ${s})" ${THIN}>
    <rect x="-20" y="-14" width="6" height="14" rx="2" fill="#3a2616"/><rect x="-11" y="-14" width="6" height="14" rx="2" fill="#3a2616"/><rect x="9" y="-14" width="6" height="14" rx="2" fill="#3a2616"/><rect x="18" y="-14" width="6" height="14" rx="2" fill="#3a2616"/>
    <path d="M-32 -18 Q-36 -32 -18 -34 Q-6 -46 12 -38 Q26 -34 28 -20 Q28 -10 18 -10 H-22 Q-32 -10 -32 -18 Z" fill="#6b4426"/>
    <path d="M18 -36 Q34 -36 38 -22 Q40 -8 30 -4 Q22 -4 20 -14 Z" fill="#4a2e1a"/>
    <path d="M24 -34 Q30 -45 37 -38" fill="none" stroke="#f1e3c0" stroke-width="2.6"/><circle cx="31" cy="-22" r="1.8" fill="#f1e3c0" stroke="none"/><path d="M-32 -26 q-8 6 -4 18" fill="none" stroke-width="2.4"/></g>`;
  const herd = (pts, s) => pts.map(([x, y, k, f]) => bison(x, y, s * (k || 1), f)).join("");
  // a plain tipi: a cone of pale hide, poles crossing at the top, and a door flap (x is the middle, y the ground)
  const tipi = (x, y, s) => `<g transform="translate(${x} ${y}) scale(${s})"><path d="M-6 -62 L-14 -84 M0 -62 V-88 M6 -62 L15 -84" fill="none" stroke="#5a3a1c" stroke-width="3.4" stroke-linecap="round"/>
    <g ${INKED}><path d="M-32 0 L-5 -64 H5 L32 0 Z" fill="#f3e3bc"/></g><path d="M-22 -24 Q0 -17 22 -24" fill="none" stroke="#c9b078" stroke-width="2" stroke-linecap="round"/><g ${THIN}><path d="M-8 0 L0 -26 L8 0 Z" fill="#6a4a2a"/></g></g>`;
  // a ring of stones lying in the grass (seen from a little above, so it looks like an oval)
  const stoneRing = (cx, cy, rx, ry, n) => Array.from({ length: n }, (_, i) => { const a = i / n * 2 * Math.PI; return `<ellipse cx="${(cx + rx * Math.cos(a)).toFixed(1)}" cy="${(cy + ry * Math.sin(a)).toFixed(1)}" rx="5" ry="3.4" fill="#b9b3a6" ${THIN}/>`; }).join("");
  // a prairie dog standing up beside its burrow (x is the middle of the mound, y the ground)
  const prairieDog = (x, y, s) => `<g transform="translate(${x} ${y}) scale(${s})"><ellipse cx="0" cy="2" rx="22" ry="7" fill="#a9824f" ${INKED}/><ellipse cx="0" cy="3" rx="9" ry="3.4" fill="#3a2616"/>
    <g ${THIN}><path d="M-8 0 Q-9 -22 0 -26 Q9 -22 8 0 Z" fill="#c9955a"/><ellipse cx="0" cy="-10" rx="4.5" ry="7" fill="#ecd3a0" stroke="none"/><circle cx="0" cy="-32" r="8" fill="#c9955a"/><circle cx="-7" cy="-37" r="2.6" fill="#a9703a"/><circle cx="7" cy="-37" r="2.6" fill="#a9703a"/><path d="M-7 -20 q-3 4 -1 8 M7 -20 q3 4 1 8" fill="none"/></g>
    <circle cx="-3" cy="-33" r="1.4" fill="#2b1a10"/><circle cx="3" cy="-33" r="1.4" fill="#2b1a10"/><ellipse cx="0" cy="-29.5" rx="2" ry="1.3" fill="#2b1a10"/></g>`;
  // a pronghorn: tan with a white belly and rump, short dark horns (faces right)
  const pronghorn = (x, y, s, flip) => `<g transform="translate(${x} ${y}) scale(${flip ? -s : s} ${s})" ${THIN}>
    <rect x="-14" y="-18" width="4" height="18" rx="2" fill="#a9703a"/><rect x="-7" y="-18" width="4" height="18" rx="2" fill="#a9703a"/><rect x="9" y="-18" width="4" height="18" rx="2" fill="#a9703a"/><rect x="16" y="-18" width="4" height="18" rx="2" fill="#a9703a"/>
    <ellipse cx="0" cy="-26" rx="22" ry="11" fill="#d99a55"/><path d="M-8 -20 Q4 -13 18 -20 Q16 -12 4 -12 Z" fill="#fff" stroke="none"/><ellipse cx="-19" cy="-27" rx="4.5" ry="6" fill="#fff"/>
    <path d="M12 -30 L22 -48 Q28 -52 31 -48 L26 -30 Z" fill="#d99a55"/><ellipse cx="33" cy="-47" rx="8" ry="5" fill="#d99a55" transform="rotate(14 33 -47)"/>
    <path d="M27 -51 q-2 -8 3 -10 M31 -51 q1 -7 6 -8" fill="none" stroke-width="2.6"/><circle cx="32" cy="-49" r="1.4" fill="#2b1a10" stroke="none"/></g>`;
  // one bison skull, small and pale (x, y is the middle of the face)
  const skull = (x, y, s) => `<g transform="translate(${x} ${y}) scale(${s})"><path d="M-10 -4 Q-20 -2 -19 -12 M10 -4 Q20 -2 19 -12" fill="none" stroke="#2b1a10" stroke-width="6" stroke-linecap="round"/><path d="M-10 -4 Q-20 -2 -19 -12 M10 -4 Q20 -2 19 -12" fill="none" stroke="#efe6cf" stroke-width="3" stroke-linecap="round"/>
    <path d="M-10 -14 Q0 -18 10 -14 Q12 4 4 8 H-4 Q-12 4 -10 -14 Z" fill="#efe6cf" ${THIN}/><circle cx="-5" cy="-6" r="2.6" fill="#6a5a44"/><circle cx="5" cy="-6" r="2.6" fill="#6a5a44"/><circle cx="-1.6" cy="4" r="1" fill="#6a5a44"/><circle cx="1.6" cy="4" r="1" fill="#6a5a44"/></g>`;
  // a pile of skulls: rows of 4, 3, 2 and 1
  const skullPile = (x, y, s) => [[4, 0], [3, -15], [2, -30], [1, -45]].map(([n, dy]) => Array.from({ length: n }, (_, i) => skull(x + (i - (n - 1) / 2) * 24 * s, y + dy * s, s)).join("")).join("");
  // a park truck: white with a green stripe, facing right (x is the middle, y the ground)
  const truck = (x, y, s) => `<g transform="translate(${x} ${y}) scale(${s})"><g ${INKED}><rect x="-44" y="-28" width="88" height="20" rx="4" fill="#f4f1e8"/><path d="M6 -28 L12 -46 H30 L38 -28 Z" fill="#f4f1e8"/><path d="M14 -43 H28 L33 -30 H11 Z" fill="#bfe6f7"/></g><rect x="-43" y="-20" width="86" height="5" fill="#3f8a57"/>
    <g ${INKED}><circle cx="-24" cy="-8" r="9" fill="#3a3a3a"/><circle cx="24" cy="-8" r="9" fill="#3a3a3a"/></g><circle cx="-24" cy="-8" r="3" fill="#b9b9b9"/><circle cx="24" cy="-8" r="3" fill="#b9b9b9"/></g>`;
  // a hide hunter of the 1870s: a hat, a dark coat and a long rifle carried over the shoulder
  const hunter = (x, y, s) => `${person(x, y, s, "#6a5a4a")}<g transform="translate(${x} ${y}) scale(${s})" ${THIN}><path d="M-7 -15 Q-7 -24 0 -24 Q7 -24 7 -15 Z" fill="#2b1a10"/><rect x="-13" y="-16" width="26" height="4" rx="2" fill="#2b1a10"/><path d="M-12 20 L16 -10" fill="none" stroke="#2b1a10" stroke-width="3.4"/></g>`;
  // a grandmother of the plains: grey hair and a blue shawl
  const grandma = (x, y, s) => `${person(x, y, s, "#8a3f4d")}<g transform="translate(${x} ${y}) scale(${s})" ${THIN}><path d="M-8 -9 Q-8 -18 0 -18 Q8 -18 8 -9 Q3 -14 0 -14 Q-4 -14 -8 -9 Z" fill="#dcdcdc"/><path d="M-10 6 Q0 14 10 6 L9 14 Q0 20 -9 14 Z" fill="#2f6fab"/></g>`;
  // a stack of flat hides
  const hides = (x, y) => `<g ${THIN}><rect x="${x}" y="${y}" width="46" height="8" rx="4" fill="#a9703a"/><rect x="${x + 3}" y="${y - 8}" width="40" height="8" rx="4" fill="#b98b54"/><rect x="${x + 6}" y="${y - 16}" width="34" height="8" rx="4" fill="#a9703a"/></g>`;

  // the window into the past, look 1 (about 1800): a great herd, and tipis at the edge of the camp
  const sgLong1 = `<rect width="400" height="240" fill="#f9e7b5"/>${cloud(250, 62, .6)}${cloud(190, 48, .5)}<g ${INKED}><path d="M130 118 Q236 106 342 118 V250 H130 Z" fill="#d9c56a"/><path d="M130 156 Q236 146 342 156 V250 H130 Z" fill="#cdb85a"/></g>
    ${tipi(186, 134, .42)}${tipi(212, 132, .34)}${person(230, 124, .4, "#c98f58")}
    ${herd([[250, 134], [268, 136, 1, 1], [288, 134], [306, 136, 1, 1]], .26)}${herd([[196, 158], [222, 160, 1, 1], [248, 158], [274, 162, 1, 1], [300, 158]], .36)}${herd([[186, 186, 1, 1], [222, 188], [258, 186, 1, 1], [294, 190]], .46)}`;
  // the window, look 2, the hide hunter's view: a pile of skulls, a stack of hides, and a man with a rifle
  const sgLong2a = `<rect width="400" height="240" fill="#e6dcc0"/><g ${INKED}><path d="M100 120 Q200 108 300 120 V250 H100 Z" fill="#d1ba62"/><path d="M100 160 Q200 150 300 160 V250 H100 Z" fill="#c4ac56"/></g>
    ${bison(146, 124, .2)}${bison(166, 122, .2, 1)}${skullPile(196, 178, .95)}${hides(120, 174)}${hunter(262, 128, .85)}`;
  // the window, look 2, the grandmother's view: an empty plain, a few skulls, and a small camp
  const sgLong2b = `<rect width="400" height="240" fill="#e2d8bd"/><g ${INKED}><path d="M100 118 Q200 106 300 118 V250 H100 Z" fill="#cdb865"/><path d="M100 158 Q200 148 300 158 V250 H100 Z" fill="#c2ac58"/></g>
    ${tipi(142, 140, .5)}${tipi(172, 136, .4)}${skull(214, 176, .5)}${skull(250, 184, .5)}${skull(278, 170, .4)}${skull(196, 150, .35)}${grandma(232, 124, .9)}${person(264, 146, .5, "#b98b54")}`;

  Object.assign(ART, {
    sg_arrive: () => frame(`${bigSky([[70, 44, .8], [300, 36, .7]])}${plain(150)}${tufts([[40, 190, 1.2], [90, 214, 1.4], [330, 200, 1.2], [360, 222, 1.5], [250, 226, 1.3]])}${herd([[40, 160], [62, 164, 1, 1], [334, 158], [356, 162, 1, 1]], .22)}${pronghorn(300, 214, .6, 1)}${riding(120, 0, 120)}`),
    sg_meet: () => frame(`${bigSky([[70, 44, .8], [310, 34, .6]])}${plain(150)}${tufts([[30, 214, 1.3], [120, 226, 1.4], [260, 216, 1.2], [372, 230, 1.4]])}${bison(300, 156, .34)}${prairieDog(336, 202, 1)}${owlAt(54, 118, 108)}${tyson(190, 142, 1.05)}`),
    sg_window1: () => frame(`${bigSky([[60, 40, .7]])}${plain(190)}${windowAt(236, 112, 92, sgLong1)}${owlAt(18, 118, 108)}${tyson(118, 150, .95)}`),
    sg_grass: () => frame(`${bigSky([[80, 38, .8], [330, 50, .6]])}${plain(150, "#d9c56a", "#cfba5a")}${tufts([[20, 200, 1.3], [60, 226, 1.5], [226, 214, 1.3], [236, 168, 1]])}${bison(318, 142, .32)}
      <g ${INKED}><rect x="252" y="152" width="134" height="76" rx="4" fill="#8a5a2b"/></g><g fill="none" stroke="#e8d9a0" stroke-width="2.4" stroke-linecap="round"><path d="M270 154 Q264 180 274 200 T268 226"/><path d="M290 154 Q298 176 288 198 T296 226"/><path d="M310 154 Q304 184 314 204 T308 226"/><path d="M330 154 Q338 178 328 200 T336 226"/><path d="M350 154 Q344 182 354 204 T348 226"/><path d="M370 154 Q376 180 366 202 T372 226"/></g>${tufts([[270, 152, 1.1], [310, 152, 1.2], [350, 152, 1.1]])}
      ${owlAt(24, 124, 104)}${tyson(168, 146, 1)}`),
    sg_hunter: () => frame(`${sky("#cdd9df", "#efe6c8", null, [[60, 40, .7], [340, 52, .6]])}${plain(190, "#c9b46a", "#b8a460")}${windowAt(200, 116, 92, sgLong2a)}`),
    sg_grandma: () => frame(`${sky("#cdd9df", "#efe6c8", null, [[60, 40, .7], [340, 52, .6]])}${plain(190, "#c9b46a", "#b8a460")}${windowAt(200, 116, 92, sgLong2b)}`),
    sg_choice: () => frame(`${bigSky([[250, 30, .7]])}${plain(156)}${herd([[300, 160], [326, 164, 1, 1], [352, 160]], .3)}${truck(70, 208, .8)}${stoneRing(330, 208, 36, 10, 12)}${owlAt(138, 146, 84)}${tyson(236, 164, .8)}`),
    sg_count: () => frame(`${bigSky([[80, 36, .8], [300, 30, .6]])}${plain(150)}${herd([[274, 150, 1, 1], [304, 154], [334, 150, 1, 1], [362, 156], [286, 176], [318, 180, 1, 1], [350, 178]], .36)}${truck(52, 214, .8)}${person(100, 168, .8, "#3f8a57")}${owlAt(120, 126, 96)}${tyson(232, 142, .95)}`),
    sg_rings: () => frame(`${bigSky([[80, 36, .8], [300, 30, .6]])}${plain(146)}${tufts([[20, 216, 1.3], [250, 160, 1], [372, 170, 1.1], [236, 226, 1.4]])}${stoneRing(322, 196, 48, 14, 15)}${owlAt(24, 126, 100)}${tyson(130, 148, .95)}${kidAt(196, 136, 1.1, AUNTIE)}`),
    sg_goodbye: () => frame(`${sky("#ffd9a0", "#fdebd0", [150, 96, 22], [[80, 40, .8], [260, 60, .6]])}${plain(158, "#d6b85a", "#c4a64c")}${tufts([[30, 214, 1.4], [200, 226, 1.3], [380, 226, 1.4]])}${herd([[230, 170], [262, 174, 1, 1], [294, 172], [326, 176, 1, 1], [358, 172], [246, 200, 1, 1], [284, 204], [322, 202, 1, 1]], .42)}${tyson(76, 146, 1)}${riding(240, 18, 112)}`)
  });

  Object.assign(ASK, {
    sg_big() { // big numbers and powers of ten: writing them, comparing them, estimating
      const kind = rand(3);
      if (kind === 0) { const [what, e] = pick([["about <b>30 million</b> bison lived on the Great Plains", 7], ["one big herd held <b>300 000</b> bison", 5], ["a small herd held <b>3 000</b> bison", 3]]);
        return { html: "", text: `Long ago ${what}. Which of these writes that number as a power of ten?`, choices: textCards(e, [e + 1, e - 1, e + 2, e - 2, e + 3], k => `3 × 10<sup>${k}</sup>`), why: `The 3 is followed by ${e} zeros, so it is 3 × 10<sup>${e}</sup>.` }; }
      if (kind === 1) { const herd = pick([300, 3000, 30000]), r = 30000000 / herd;
        return { html: "", text: `Long ago about <b>${fmt(30000000)}</b> bison lived on the plains. Imagine a small herd of <b>${fmt(herd)}</b>. The old number was how many times as big?`, choices: cards(r, [r * 10, r / 10, r / 100, herd, r + herd]), why: `${fmt(30000000)} ÷ ${fmt(herd)} = ${fmt(r)}. Each zero less in the herd makes the answer one power of ten bigger.` }; }
      const A = pick([1, 2, 3, 5, 6, 10]), per = 30 / A;
      return { html: "", text: `Imagine the <b>${fmt(30000000)}</b> bison were spread evenly over <b>${A} million</b> square kilometres. About how many bison is that for each square kilometre?`, choices: cards(per, [per * 10, per / 10, A, 30 - A, per + 5]), why: `30 million ÷ ${A} million = ${per}. About ${per} bison for each square kilometre.` };
    },
    sg_share() { // fractions and percents of a whole: the uses of the bison and the grassland that is left
      const kind = rand(3);
      if (kind === 0) { const set = pick([{ a: [1, 2], b: [1, 4], N: [40, 48, 60, 80, 100, 120] }, { a: [1, 2], b: [1, 3], N: [36, 48, 60, 72, 84] }, { a: [1, 3], b: [1, 4], N: [36, 48, 60, 72, 96] }]), N = pick(set.N),
          u1 = N * set.a[0] / set.a[1], u2 = N * set.b[0] / set.b[1], used = u1 + u2, left = N - used;
        return { html: "", text: `Imagine a camp has <b>${N}</b> hides. <b>${set.a[0]}/${set.a[1]}</b> go to tipi covers and <b>${set.b[0]}/${set.b[1]}</b> go to clothing. How many hides are left over?`, choices: cards(left, [used, u1, u2, N - u1, left + 4]), why: `${u1} + ${u2} = ${used} hides used. ${N} − ${used} = ${left} left.` }; }
      if (kind === 1) { const N = pick([200, 300, 400, 500]), p = pick([10, 15, 20, 25]), a = N * p / 100;
        return { html: "", text: `Imagine a map of the old prairie cut into <b>${N}</b> squares. Only <b>${p}%</b> of the squares are still native grass today. How many squares is that?`, choices: cards(a, [N - a, a * 2, a + 10, p, a - 10]), why: `${p}% of ${N} = ${p} ÷ 100 × ${N} = ${a} squares.` }; }
      const W = pick([20, 25, 50]), x = pick([3, 5, 7, 9, 11, 13]), p = x * 100 / W;
      return { html: "", text: `Tyson counts <b>${W}</b> animals on a ridge. <b>${x}</b> are bison and the rest are pronghorn. What percent of the animals are bison?`, choices: textCards(p, [100 - p, p * 2, p + 10, p + 20, x], k => `${k}%`), why: `${x} out of ${W} is ${x * 100 / W} out of 100. That is ${p}%.` };
    },
    sg_decline() { // percent change: reading a fall, soberly
      const kind = rand(3);
      if (kind === 0) { const S = pick([200, 400, 500, 800, 1000]), p = pick([5, 10, 20, 25, 40, 50]), E = S * p / 100;
        return { html: "", text: `Imagine one herd of <b>${fmt(S)}</b> bison. Hide hunters came, and only <b>${fmt(E)}</b> were left. What percent of the herd was left?`, choices: textCards(p, [100 - p, p * 2, p + 10, p + 20, E], k => `${k}%`), why: `${E} ÷ ${S} = ${p / 100}, which is ${p}%.` }; }
      if (kind === 1) { const f = pick([50, 60, 75, 80, 90]), S = pick([500, 1000, 2000]), E = S * (100 - f) / 100;
        return { html: "", text: `Imagine a herd of <b>${fmt(S)}</b> bison was cut down to <b>${fmt(E)}</b>. By what percent did the herd fall?`, choices: textCards(f, [100 - f, f - 10, f + 10, f - 5, f + 5], k => `${k}%`), why: `It fell by ${fmt(S)} − ${fmt(E)} = ${fmt(S - E)}. ${fmt(S - E)} out of ${fmt(S)} is ${f}%.` }; }
      const q = pick([50, 75, 80, 90]), E = pick([50, 100, 150, 200, 250]), S = E * 100 / (100 - q);
      return { html: "", text: `A herd lost <b>${q}%</b> of its animals, and <b>${fmt(E)}</b> were left. How many bison were in the herd at first?`, choices: cards(S, [E * 2, E * 4, E * 5, E * 10, E + E * q / 100]), why: `${100 - q}% of the herd is ${fmt(E)}. So the herd was ${fmt(E)} ÷ ${(100 - q) / 100} = ${fmt(S)}.` };
    },
    sg_last(g) { // follows the choice: counting the herd with the rangers (0) or measuring the tipi rings (1)
      const way = g && g.choice ? 1 : 0, kind = rand(3);
      if (way === 0) {
        if (kind === 0) { const H = pick([200, 300, 400, 500, 600]), p = pick([10, 20, 25, 50]), n = H + H * p / 100;
          return { html: "", text: `The rangers counted <b>${H}</b> bison last spring. This spring the herd is <b>${p}%</b> bigger, with all the new calves. How many bison are in the herd now?`, choices: cards(n, [H * p / 100, H - H * p / 100, H + p, n + 20, n - 20]), why: `${p}% of ${H} is ${H * p / 100}. ${H} + ${H * p / 100} = ${n} bison.` }; }
        if (kind === 1) { const a = pick([40, 50, 60, 70, 80, 90]), b = pick([30, 45, 55, 65]), n = pick([25, 35, 40, 60, 75]), T = a + b + n;
          return { html: "", text: `The rangers count the herd in three groups. One group has <b>${a}</b> bison, another has <b>${b}</b>, and the whole herd is <b>${T}</b>. How many are in the third group?`, choices: cards(n, [a + b, T - a, T - b, n + 10, n - 10]), why: `${a} + ${b} + n = ${T}, so n = ${T} − ${a} − ${b} = ${n}.` }; }
        const s = pick([2, 4, 5]), per = pick([3, 4, 5, 6]), c = s * per, k = pick([4, 5, 6, 8]), A = s * k, ans = c * k;
        return { html: "", text: `In a test patch of <b>${s} km²</b> the rangers count <b>${c}</b> bison. If the herd is spread the same way over <b>${A} km²</b>, about how many bison are there?`, choices: cards(ans, [c + A, c * (k - 1), c * (k + 1), per + A, A * s]), why: `${c} ÷ ${s} = ${per} bison for each km². ${per} × ${A} = ${ans} bison.` };
      }
      if (kind === 0) { const d = pick([4, 6, 8, 10, 12]), C = fx(3.14 * d);
        return { html: "", text: `A tipi ring is a circle of stones with a diameter of <b>${d} m</b>. Use 3.14 for pi. What is the distance around the ring (the circumference)?`, choices: textCards(`${C} m`, [3.14 * d / 2, 3.14 * d * d, 3.14 * d * d / 4, 2 * d, d + 3.14].map(v => `${fx(v)} m`)), why: `Circumference = 3.14 × diameter. 3.14 × ${d} = ${C} m.` }; }
      if (kind === 1) { const d = pick([4, 6, 8]), r = d / 2, A = fx(3.14 * r * r);
        return { html: "", text: `Another tipi ring has a diameter of <b>${d} m</b>. Use 3.14 for pi. What is the area of the ground inside the ring?`, choices: textCards(`${A} m²`, [3.14 * d * d, 3.14 * d, 3.14 * r, r * r, 2 * 3.14 * r * r].map(v => `${fx(v)} m²`)), why: `The radius is ${d} ÷ 2 = ${r} m. Area = 3.14 × ${r} × ${r} = ${A} m².` }; }
      const d = pick([4, 5, 6, 8, 10]), C = fx(3.14 * d);
      return { html: "", text: `Tyson's auntie paces round a ring and finds the distance around it is <b>${C} m</b>. With pi as 3.14, what is the diameter of the ring, in metres?`, choices: cards(d, [d * 2, d + 2, d - 2, d * 3, d + 1]), why: `3.14 × d = ${C}, so d = ${C} ÷ 3.14 = ${d} m.` };
    }
  });

  // FACT CHECK (all of this chapter should be read by people from the Plains nations before it is used).
  // FACT CHECK: Estimates of the plains bison before the 1800s vary (often given as 30 to 60 million). The story says "about 30 million", and the maths uses that number only.
  // FACT CHECK: By the late 1880s only a few hundred wild plains bison were left in North America (often given as fewer than 1,000, including a few hundred in the United States and small numbers in Canada). The fall happened in the 1870s and 1880s, in one lifetime.
  // FACT CHECK: Bison were killed for their hides (commercial hide hunters, who took the hides and often left the meat), for sport, and to clear the land for railways, ranches and farms. The story says "powerful rifles" and not "repeating rifles", because the best known hide-hunting guns (the Sharps rifles) were single-shot.
  // FACT CHECK: Governments did not stop the killing, and some leaders saw that the loss of the bison would force the Plains nations onto reserves (for example, historians quote officials of the time on this). Voice B says it in the careful words "some people in power".
  // FACT CHECK: After the bison were gone, hunger and starvation struck many Plains communities in the late 1870s and 1880s. The numbered treaties (for example Treaty 4 in 1874, Treaty 6 in 1876, Treaty 7 in 1877) were signed by Plains nations, who moved onto reserves in exchange for promises, including food in hard times. Many of those promises were broken or came too late.
  // FACT CHECK: Plains peoples used bison for food, tipi covers of hide, clothing, tools of bone and horn, and (dried dung) as fuel. Hunting by driving a herd over a cliff (a buffalo jump) or into a corral (a pound) is well documented across the plains.
  // FACT CHECK: Grasslands National Park is in southern Saskatchewan (two blocks, West and East). Plains bison were brought back to the park in 2005 (from Elk Island National Park, Alberta). The herd today is "several hundred" (the count changes year to year). Prairie dogs (black-tailed) and pronghorn live in the park.
  // FACT CHECK: Native prairie grass roots can reach a metre or more down. "Most of Canada's native prairie has been ploughed up" is true (only a small share of the original native grassland remains, with estimates varying by region). The story avoids a precise percent.
  // FACT CHECK: Stone circles, called tipi rings, are found across the plains and hold the stones that weighted the edge of a tipi cover. Some are hundreds to thousands of years old. They are still on the land today and should be left where they are.
  // FACT CHECK: Names: Nêhiyawak (the Plains Cree and others who speak nêhiyawêwin), Nakoda (also called Assiniboine), Niitsitapi (the Blackfoot Confederacy), Dakota, Lakota, Saulteaux (Plains Ojibwe, also written Nakawē). Check the spellings and the order.
  // FACT CHECK: Plains nations today work to return bison to their own lands (for example, Blackfoot nations brought bison back to Blackfeet and Alberta lands in 2014 through the Buffalo Treaty). The goodbye says this in general words only.
  // FACT CHECK: Added from Shane's review notes (November 2026): the elder is a Nakoda grandmother of the 1870s (not Tyson's own); a plain line that the government held back food until nations signed treaties and moved onto reserves; Nakoda spelling; pronunciation guides for Nakoda, Nêhiyawak, Niitsitapi and Saulteaux. The challenges here give no coins on purpose (quiet).
  // FACT CHECK: French words: le bison (the bison), la prairie (the grassland), l'herbe (the grass), le troupeau (the herd), le cercle (the circle). No Plains-language words are used. Tyson is Nakoda, and a Nakoda word for the bison was left out because the spelling is uncertain.
  CHAPTERS[3] = { title: "The Sea of Grass", where: "The grasslands of Saskatchewan", beats: [
    { art: "sg_arrive", word: ["la prairie", "the grassland"], say: ["Out of the east the clock follows the old cart trails, past the Red River and on and on, until the trees give up. Then there is only sky. Hold on to your hat, because the wind out here wants it.",
      "This is the <em>prairie</em> of southern Saskatchewan. The grass rolls away in every direction, gold and green, under a sky so big it seems to have no edge. In French it is la prairie, a word we borrowed.",
      "Below us is <em>Grasslands National Park</em>, one of the last big pieces of native prairie in Canada. And what is that dark speck, moving slowly through the grass? Down we go to find out."] },
    { art: "sg_meet", say: ["A boy is waiting by a fence post. This is Tyson. He is <em>Nakoda</em>, also called Assiniboine, and he lives in southern Saskatchewan. His people have lived on these plains for a very long time.",
      "You say Nakoda like this: nah-KOH-dah.",
      "Tyson says many nations call the plains home. They are the <em>Nêhiyawak</em> (Plains Cree), the Nakoda, the <em>Niitsitapi</em> (Blackfoot), the Dakota and Lakota, and the Saulteaux."] },
    { art: "sg_meet", say: ["You say Nêhiyawak like this: nay-HEE-yuh-wuk. Niitsitapi is nee-tsee-TAH-pee. Saulteaux is SOH-toh.",
      "And the dark speck? It is a <em>bison</em>. Many people say buffalo, but bison is the proper name. In French it is le bison. A big one just looked at me, so I looked back. Politely."] },
    { art: "sg_window1", who: "The clock", say: ["Tick, tock. Time to look back. My window is open."] },
    { art: "sg_window1", say: ["The window into the past! It is about the year <em>1800</em>, and the plains are full of life. Around <em>30 million</em> bison live on the Great Plains of North America. Try counting that on your fingers.",
      "For the Plains nations the bison is much more than food. Tipi covers are made of its hide. So are clothes. Tools are made of bone and horn, and dried dung is fuel for the fire. Nothing is wasted.",
      "Hunters work together, and one way is to drive a herd over a cliff or into a strong pen called a pound. Everyone in the camp has a job to do. Tyson says it is time for some big numbers."] },
    { ask: "sg_big", intro: "Thirty million is a very big number. Three right answers and we look at the ground under our feet.", quiet: true },
    { art: "sg_grass", word: ["l'herbe", "the grass"], say: ["Back in the present, Tyson crouches and parts the grass with his fingers. It looks plain, but it is tougher than it looks. I tried to pull one blade out and fell over backwards.",
      "Prairie grass hides its best part underground. The <em>roots</em> go down a metre or more and hold the soil in place. That is why the grass survives drought, fire and hungry animals. In French it is l'herbe.",
      "Bison keep the grassland healthy by grazing and by rolling in the dust, which is called wallowing. But most of Canada's native prairie has been ploughed up for farms and towns. What is left is precious."] },
    { ask: "sg_share", intro: "Tyson has a few sharing puzzles about the camp and the grassland. Three right answers and the window opens again, and this time it is a hard look.", quiet: true },
    { who: "The hide hunter", art: "sg_hunter", say: ["I came west in the 1870s because a man could earn good money here. They pay me by the hide. On a good day I shoot dozens of bison with my big rifle.",
      "I take the skins and I leave the rest on the ground. The hides go east by wagon and by rail, and the railway creeps further west every year. The land is being cleared for farms and ranches.",
      "The herds look endless to me. I think there are too many ever to be gone. I think about the money. Then one year I ride for days and cannot find a single herd."] },
    { who: "A Nakoda grandmother", art: "sg_grandma", say: ["I am a Nakoda grandmother of the plains. I remember when the ground shook with the herds, and the whole camp was fed. In my own lifetime I have watched them vanish. First the herds were smaller. Then they were gone.",
      "Without the bison, hunger came. Many of our people starved. We had lost our food, our shelter and our clothing all at once.",
      "Then we were pressed to sign treaties and to move onto reserves, and we were promised food and help. Many of those promises were broken. Some people in power did not stop the killing.",
      "I tell my grandchildren all of this, so it is never forgotten. We are still here."] },
    { art: "sg_grandma", say: ["When the bison were gone, the Plains nations were starving. Canada's government used that hunger. It held back food until nations signed treaties and moved onto reserves."] },
    { ask: "sg_decline", intro: "About 30 million bison. Fewer than 1,000 by the late 1880s, in one lifetime. The numbers tell the story, so let us look at them carefully. Three right answers and we come back to today.", quiet: true },
    { art: "sg_choice", pick: "Tyson is quiet too. Then he smiles a little and says the story is not over, because the bison are back. He has two ideas for the afternoon. Shall we go out with the park rangers to count the herd, or walk with his auntie to look at the plants and the old tipi rings?", options: [
      { label: "Count the herd with the rangers", art: "sg_count", word: ["le troupeau", "the herd"], say: ["In 2005 bison were brought back to Grasslands National Park, and now a herd of several hundred lives here. We bounce along in a ranger's truck and stop on a hill to look.",
        "The rangers count the herd to see how it is growing, and calves are born every spring. A herd in French is <em>le troupeau</em>. I counted with my wing tips and ran out of wing tips."] },
      { label: "Walk with Tyson's auntie", art: "sg_rings", word: ["le cercle", "the circle"], say: ["Tyson's auntie walks us over the hill, showing us the grasses and little flowers. Then she stops at a ring of stones lying in the grass. It is an old <em>tipi ring</em>, and the stones once held down the edges of a tipi.",
        "Some rings are hundreds of years old, or even older, and they are still on the land today. We leave every stone where it lies. A circle in French is <em>le cercle</em>."] }] },
    { ask: "sg_last", intro: "Tyson has some last puzzles from the afternoon. Three right answers and we say goodbye.", quiet: true },
    { art: "sg_goodbye", say: ["We walk back as the sun sinks and the whole prairie glows. The bison are back on this land. The herd is small next to 30 million, but it is growing, and Tyson says that matters.",
      "The Plains nations are still here too. They are raising their children on these grasslands, and working to bring the bison home to their own lands. The grass holds on, and so do the people.",
      "Thank you, Tyson, for telling it plainly. Next the clock tugs us west, to where the land breaks open into strange striped hills full of bones. That is <em>The Land of Giants</em>, the Alberta Badlands. Tick tock!"] }
  ] };
}
