"use strict";
// Grade 7, Chapter 3: The People of the Red River. Dr. Somebody meets Jade, a Métis girl of today, in St. Boniface beside the Red River.
{
  const JADE = { hood: "#2a9d8f" };               // this chapter's child guide: long dark hair and a teal hoodie (she also wears a sash)
  const LOTC = ["#c8dd8f", "#e6cf7a", "#a9cf86", "#d9c56a"];

  // ---------- my own drawing pieces ----------
  // low flat prairie ground with a gentle curve
  const flat = (y, c) => `<g ${INKED}><path d="M-10 ${y} Q100 ${y - 8} 210 ${y} T410 ${y - 3} V250 H-10 Z" fill="${c}"/></g>`;
  // narrow river lots seen from above: n strips from the river bank (yT) down to yB, widening toward the viewer
  const lots = (yT, yB, n) => `<g ${THIN}>${Array.from({ length: n }, (_, i) => {
    const a = -20 + i * 440 / n, b = -20 + (i + 1) * 440 / n, ta = 200 + (a - 200) * .75, tb = 200 + (b - 200) * .75;
    return `<polygon points="${ta.toFixed(1)},${yT} ${tb.toFixed(1)},${yT} ${b.toFixed(1)},${yB} ${a.toFixed(1)},${yB}" fill="${LOTC[i % 4]}"/>`;
  }).join("")}</g>`;
  // a river across the picture (a dark outline with blue inside)
  const riverBand = (y, w) => `<path d="M-10 ${y + 4} Q100 ${y - 20} 200 ${y + 6} T410 ${y - 6}" fill="none" stroke="#2b1a10" stroke-width="${w + 6}" stroke-linecap="round"/><path d="M-10 ${y + 4} Q100 ${y - 20} 200 ${y + 6} T410 ${y - 6}" fill="none" stroke="#5db7e6" stroke-width="${w}" stroke-linecap="round"/>`;
  // a tall spoked wooden wheel
  const cwheel = (cx, cy, r) => {
    const sp = Array.from({ length: 12 }, (_, i) => { const a = i * Math.PI / 6; return `M${cx} ${cy}L${(cx + (r - 2) * Math.cos(a)).toFixed(1)} ${(cy + (r - 2) * Math.sin(a)).toFixed(1)}`; }).join("");
    return `<circle cx="${cx}" cy="${cy}" r="${r}" fill="none" stroke="#2b1a10" stroke-width="7"/><circle cx="${cx}" cy="${cy}" r="${r}" fill="none" stroke="#c89a5e" stroke-width="3.2"/>
      <path d="${sp}" fill="none" stroke="#2b1a10" stroke-width="3.6" stroke-linecap="round"/><path d="${sp}" fill="none" stroke="#c89a5e" stroke-width="1.8" stroke-linecap="round"/><circle cx="${cx}" cy="${cy}" r="6" fill="#8a5a2b" ${INKED}/>`;
  };
  // an ox facing right (feet on y)
  const ox = (x, y, s) => `<g transform="translate(${x} ${y}) scale(${s})" ${INKED}><rect x="-20" y="-18" width="8" height="18" rx="3" fill="#7a5226"/><rect x="-8" y="-18" width="8" height="18" rx="3" fill="#7a5226"/><rect x="10" y="-18" width="8" height="18" rx="3" fill="#7a5226"/><rect x="20" y="-18" width="8" height="18" rx="3" fill="#7a5226"/>
    <path d="M-27 -34 Q-36 -28 -32 -14" fill="none" stroke-width="4"/><ellipse cx="0" cy="-30" rx="29" ry="16" fill="#a8743a"/><path d="M-10 -42 Q6 -56 20 -42 Z" fill="#a8743a"/>
    <ellipse cx="34" cy="-26" rx="12" ry="9" fill="#a8743a"/><path d="M30 -33 Q26 -44 33 -46 M38 -33 Q42 -44 36 -48" fill="none" stroke-width="3"/><circle cx="38" cy="-29" r="1.7" fill="#2b1a10" stroke="none"/><ellipse cx="44" cy="-23" rx="3" ry="2.4" fill="#6a4a2a" stroke-width="1.2"/></g>`;
  // a Red River cart facing right (feet on y): all wood, a box with railed sides, two very tall wheels, two shafts. o.ox adds the ox, o.flip faces it left
  const redCart = (x, y, s, o) => { o = o || {}; return `<g transform="translate(${x} ${y}) scale(${o.flip ? -s : s} ${s})">
    ${o.ox ? ox(114, 0, 1) : ""}
    <g ${INKED}><rect x="-30" y="-46" width="62" height="16" fill="#8a5a2b"/></g>
    <path d="M-30 -46 V-62 M-14 -46 V-62 M2 -46 V-62 M18 -46 V-62 M32 -46 V-62 M-30 -62 H32 M-30 -54 H32" fill="none" stroke="#2b1a10" stroke-width="5" stroke-linecap="round"/><path d="M-30 -46 V-62 M-14 -46 V-62 M2 -46 V-62 M18 -46 V-62 M32 -46 V-62 M-30 -62 H32 M-30 -54 H32" fill="none" stroke="#a8743a" stroke-width="2.4" stroke-linecap="round"/>
    ${cwheel(0, -26, 26)}
    <path d="M26 -36 L${o.ox ? "96 -30" : "86 -4"}" fill="none" stroke="#2b1a10" stroke-width="6" stroke-linecap="round"/><path d="M26 -36 L${o.ox ? "96 -30" : "86 -4"}" fill="none" stroke="#c89a5e" stroke-width="3.2" stroke-linecap="round"/></g>`; };
  // a bison facing right (feet on y): a big shoulder hump, a shaggy dark head, short curved horns
  const bison = (x, y, s) => `<g transform="translate(${x} ${y}) scale(${s})" ${INKED}><rect x="-24" y="-16" width="8" height="16" rx="3" fill="#3f2814"/><rect x="-10" y="-16" width="8" height="16" rx="3" fill="#3f2814"/><rect x="8" y="-16" width="8" height="16" rx="3" fill="#3f2814"/><rect x="20" y="-16" width="8" height="16" rx="3" fill="#3f2814"/>
    <path d="M-34 -30 Q-36 -46 -16 -50 Q2 -66 24 -54 Q40 -46 38 -28 Q36 -10 14 -12 H-20 Q-34 -14 -34 -30 Z" fill="#6b4524"/>
    <path d="M20 -52 Q44 -46 42 -24 Q40 -6 28 -8 Q16 -22 20 -52 Z" fill="#4a2f17"/><path d="M30 -50 Q27 -60 36 -60 M36 -48 Q42 -58 47 -52" fill="none" stroke-width="3"/><circle cx="37" cy="-30" r="1.8" fill="#f6e3b4" stroke="none"/>
    <path d="M-34 -30 Q-44 -26 -40 -12" fill="none" stroke-width="3.2"/></g>`;
  // a fiddle with its bow (x, y is the middle; rot turns it)
  const fiddle = (x, y, s, rot) => `<g transform="translate(${x} ${y}) rotate(${rot || 0}) scale(${s})">
    <path d="M-2.5 -38 H2.5 V-14 H-2.5 Z" fill="#2b1a10"/><circle cx="0" cy="-41" r="4" fill="#8a4a1a" stroke="#2b1a10" stroke-width="2"/>
    <g ${INKED}><path d="M0 -16 Q10 -18 10 -8 Q6 -2 11 5 Q14 20 0 22 Q-14 20 -11 5 Q-6 -2 -10 -8 Q-10 -18 0 -16 Z" fill="#b5651d"/></g>
    <path d="M-5 -4 q-2 5 0 9 M5 -4 q2 5 0 9" fill="none" stroke="#2b1a10" stroke-width="1.6" stroke-linecap="round"/><path d="M-5 17 H5" fill="none" stroke="#2b1a10" stroke-width="3" stroke-linecap="round"/>
    <path d="M-1 -36 V15 M1 -36 V15" fill="none" stroke="#f4e6c0" stroke-width=".8"/>
    <path d="M-26 -2 L26 -10" fill="none" stroke="#2b1a10" stroke-width="3.4" stroke-linecap="round"/><path d="M-26 -2 L26 -10" fill="none" stroke="#c89a5e" stroke-width="1.6" stroke-linecap="round"/></g>`;
  // the Métis sash: a long red finger-woven belt with arrow patterns and a fringe at each end (x, y is the middle)
  const sash = (x, y, s) => `<g transform="translate(${x} ${y}) scale(${s})">
    <g stroke="#8f1d28" stroke-width="1.8" stroke-linecap="round">${[0, 1, 2, 3, 4].map(k => `<path d="M-50 ${-5 + k * 2.5} l-10 ${(k - 2) * 1.6} M50 ${-5 + k * 2.5} l10 ${(k - 2) * 1.6}"/>`).join("")}</g>
    <g ${INKED}><rect x="-50" y="-7" width="100" height="14" rx="2" fill="#d62839"/></g>
    <path d="M-50 -4 H50 M-50 4 H50" fill="none" stroke="#fff" stroke-width="1.4"/>
    <path d="${[0, 1, 2, 3, 4, 5, 6].map(i => `M${-42 + i * 14} -3 L${-38 + i * 14} 0 L${-42 + i * 14} 3`).join(" ")}" fill="none" stroke="#ffd23f" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></g>`;
  // the Métis flag: a white infinity sign on blue, on a pole (x, y is the top of the pole)
  const flag = (x, y, s) => `<g transform="translate(${x} ${y}) scale(${s})"><g ${INKED}><rect x="-2" y="-4" width="4" height="68" rx="1.5" fill="#8a5a2b"/><rect x="2" y="0" width="60" height="38" fill="#1d4e9e"/></g>
    <path d="M32 19 C26 8 12 8 12 19 C12 30 26 30 32 19 C38 8 52 8 52 19 C52 30 38 30 32 19 Z" fill="none" stroke="#fff" stroke-width="4" stroke-linejoin="round"/></g>`;
  // a rack of drying meat: two forked poles, a crossbar and dark red strips hanging
  const meatRack = (x, y, s) => `<g transform="translate(${x} ${y}) scale(${s})" ${INKED}><path d="M-34 0 V-40 M34 0 V-40" fill="none" stroke-width="6" stroke="#2b1a10"/><path d="M-34 0 V-40 M34 0 V-40" fill="none" stroke-width="3" stroke="#8a5a2b"/><path d="M-38 -38 H38" fill="none" stroke-width="6" stroke="#2b1a10"/><path d="M-38 -38 H38" fill="none" stroke-width="3" stroke="#8a5a2b"/>
    ${[-26, -14, -2, 10, 22].map((mx, i) => `<path d="M${mx - 4} -36 H${mx + 4} L${mx + 3} ${-12 - (i % 2) * 6} Q${mx} ${-8 - (i % 2) * 6} ${mx - 3} ${-12 - (i % 2) * 6} Z" fill="#a8452a" stroke-width="1.4"/>`).join("")}</g>`;
  // a music note
  const note = (x, y) => `<g ${THIN}><ellipse cx="${x}" cy="${y}" rx="5.4" ry="3.8" fill="#2b1a10" transform="rotate(-18 ${x} ${y})"/><path d="M${x + 4.6} ${y - 1} V${y - 20} q7 3 6 10" fill="none" stroke-width="2.4"/></g>`;
  // Jade wears her sash tied at the waist, with two tails hanging
  const jadeAt = (x, y, s) => `${kidAt(x, y, s, JADE)}<g transform="translate(${x} ${y}) scale(${s})"><rect x="-17" y="43" width="34" height="7" rx="2" fill="#d62839" stroke="#2b1a10" stroke-width="1.6"/><path d="M10 50 l-2 15 M14 50 l1 15" fill="none" stroke="#2b1a10" stroke-width="5" stroke-linecap="round"/><path d="M10 50 l-2 15 M14 50 l1 15" fill="none" stroke="#d62839" stroke-width="3" stroke-linecap="round"/></g>`;
  const day = clouds => sky("#9fd8f2", "#f6edc8", [346, 40, 20], clouds);

  // ---------- the windows into the past ----------
  // about 1840: a train of carts and oxen setting out across the plain, with bison ahead
  const hunt = `<rect width="400" height="240" fill="#f6e3b4"/>${sun(296, 62, 12)}<g ${INKED}><path d="M130 114 Q200 100 270 110 T342 108 V250 H130 Z" fill="#d9c56a"/></g><g ${THIN}><path d="M130 176 Q236 156 342 174 V250 H130 Z" fill="#c9b350"/></g>
    ${redCart(166, 136, .26, { ox: true })}${redCart(212, 132, .26, { ox: true })}${redCart(258, 136, .26, { ox: true })}${bison(206, 186, .42)}${bison(262, 178, .38)}${person(172, 168, .42, "#b03a2e")}`;
  // the people's own ways: the flag, two dancers, a fiddle and the sash
  const ownWays = `<rect width="400" height="240" fill="#f6e3b4"/><g ${INKED}><path d="M130 176 Q236 160 342 176 V250 H130 Z" fill="#d9c56a"/></g>
    ${flag(180, 58, .75)}${person(236, 100, .5, "#2a9d8f")}${person(258, 104, .5, "#b03a2e")}${fiddle(294, 106, 1, 18)}${sash(236, 160, 1)}`;

  // ---------- the pictures ----------
  Object.assign(ART, {
    rr_arrive: () => frame(`${day([[80, 38, .8], [230, 30, .6]])}${flat(116, "#b9d98f")}${riverBand(128, 32)}${lots(152, 246, 9)}${house(60, 150, 24, 16, "#b03a2e")}${house(150, 152, 24, 16, "#3b82c4")}${house(268, 150, 24, 16, "#b03a2e")}${house(340, 152, 24, 16, "#8a5a2b")}${riding(160, 6, 112)}`),
    rr_jade: () => frame(`${day([[70, 44, .8]])}${water(118)}${tree(60, 120, 1.1)}${tree(140, 118, .9, "#3f9a58")}${tree(350, 118, 1.2)}${flat(166, "#a9cf86")}${flag(312, 106, 1)}${fiddle(276, 200, 1.1, 12)}${owlAt(66, 116, 112)}${jadeAt(204, 144, 1.05)}`),
    rr_window1: () => frame(`${day([[60, 40, .7]])}${flat(190, "#b9d98f")}${windowAt(236, 112, 92, hunt)}${owlAt(18, 118, 108)}${jadeAt(118, 150, .95)}`),
    rr_cart: () => frame(`${day([[60, 36, .7], [310, 50, .6]])}${water(112)}${tree(46, 114, 1.1)}${tree(360, 112, 1.2, "#3f9a58")}${flat(164, "#a9cf86")}${redCart(252, 216, 1.2)}${owlAt(20, 124, 104)}${jadeAt(160, 146, 1)}`),
    rr_window2: () => frame(`${day([[60, 40, .7]])}${flat(190, "#b9d98f")}${windowAt(236, 112, 92, ownWays)}${owlAt(18, 118, 108)}${jadeAt(118, 150, .95)}`),
    rr_choice: () => frame(`${day([[250, 30, .7]])}${water(122)}${flat(168, "#a9cf86")}${redCart(286, 218, .62, { ox: true })}${fiddle(214, 196, 1.1, -14)}${owlAt(24, 128, 100)}${jadeAt(140, 152, .95)}`),
    rr_jig: () => frame(`${day([[70, 36, .7]])}${flat(150, "#b9d98f")}${flat(200, "#a9cf86")}<g fill="#8a7a2a" opacity=".5">${[[196, 212], [226, 218], [256, 210], [286, 216], [316, 208]].map(([x, y]) => `<ellipse cx="${x}" cy="${y}" rx="9" ry="3.6"/>`).join("")}</g>
      ${note(250, 84)}${note(292, 62)}${note(334, 90)}${fiddle(330, 168, 1.3, -10)}${owlAt(30, 124, 104)}${jadeAt(182, 146, 1)}`),
    rr_ride: () => frame(`${day([[260, 36, .7]])}${water(110)}${flat(150, "#b9d98f")}${redCart(70, 208, 1, { ox: true })}${owlAt(46, 98, 66)}${jadeAt(312, 136, .95)}`),
    rr_goodbye: () => frame(`${sky("#ffd9a0", "#fdebd0", [60, 58, 22], [[170, 30, .7], [320, 70, .6]])}${flat(142, "#d9c56a")}${flat(194, "#b9a24a")}${bison(30, 150, .28)}${bison(58, 146, .24)}${redCart(86, 150, .22, { ox: true, flip: true })}${redCart(134, 158, .26, { ox: true, flip: true })}${redCart(196, 166, .3, { ox: true, flip: true })}${balloonAt(300, 16, 104)}${owlAt(262, 126, 104)}${jadeAt(232, 146, 1)}`)
  });

  // ---------- the questions ----------
  Object.assign(ASK, {
    rr_wheel() { // circumference of a circle, distance rolled in a number of turns, and finding the diameter (pi = 3.14)
      const kind = rand(3);
      if (kind === 0) { const d = pick([100, 150, 200]), C = Math.round(d * 314) / 100;
        return { html: "", text: `A cart wheel is <b>${d} cm</b> across (its diameter). Use pi = <b>3.14</b>. How many centimetres is it around the rim (its circumference)?`, choices: cards(C, [Math.round(C / 2), 2 * d, C + d, C - d, 3 * d]), why: `Circumference = pi × diameter = 3.14 × ${d} = ${C} cm.` }; }
      if (kind === 1) { const d = pick([100, 150, 200]), C = Math.round(d * 314) / 100, t = pick([10, 20, 50]), dist = t * C / 100, m = v => `${+v.toFixed(2)} m`;
        return { html: "", text: `A cart wheel is <b>${d / 100} m</b> across. Use pi = <b>3.14</b>. How far does the cart roll in <b>${t}</b> full turns of the wheel?`, choices: textCards(m(dist), [t * d / 100, C / 100, dist * 2, dist / 2, dist * 10].map(m)), why: `One turn rolls 3.14 × ${d / 100} = ${C / 100} m. ${t} turns is ${t} × ${C / 100} = ${+dist.toFixed(2)} m.` }; }
      const d = pick([50, 100, 150, 200]), C = Math.round(d * 314) / 100;
      return { html: "", text: `Jade measures a rim that is <b>${C} cm</b> around. Use pi = <b>3.14</b> in 3.14 × d = ${C}. How many centimetres across is the wheel?`, choices: cards(d, [Math.round(C / 3), d * 2, d + 25, d + 50, d * 3, C / 2]), why: `Circumference = 3.14 × d, so d = ${C} ÷ 3.14 = ${d} cm.` };
    },
    rr_area() { // area of a circle, a composite shape (rectangle with a round pond), and finding a radius from an area (pi = 3.14)
      const kind = rand(3);
      if (kind === 0) { const r = pick([10, 20, 30]), A = Math.round(314 * r * r) / 100;
        return { html: "", text: `The wooden hub of a wheel is a round drum with a radius of <b>${r} cm</b>. Use pi = <b>3.14</b>. What is the area of its flat round end, in cm²?`, choices: cards(A, [r * r, 4 * A, A / 2, A + r, A - r, Math.round(A * 2)]), why: `Area = pi × r × r = 3.14 × ${r} × ${r} = ${fmt(A)} cm².` }; }
      if (kind === 1) { const [w, l] = pick([[40, 30], [50, 40], [60, 40]]), r = pick([5, 10]), pond = Math.round(314 * r * r) / 100, ans = w * l - pond, wrongD = w * l - Math.round(314 * 4 * r * r) / 100, f = v => `${fmt(+v.toFixed(2))} m²`;
        return { html: "", text: `A river lot is a rectangle <b>${w} m</b> by <b>${l} m</b>. A round pond with a radius of <b>${r} m</b> takes up part of it. Use pi = <b>3.14</b>. How much is left, in m²?`, choices: textCards(f(ans), [w * l, pond, w * l + pond, wrongD, ans + 10, ans - 10].map(f)), why: `Lot: ${w} × ${l} = ${fmt(w * l)}. Pond: 3.14 × ${r} × ${r} = ${pond}. ${fmt(w * l)} − ${pond} = ${fmt(ans)} m².` }; }
      const r = pick([5, 10, 15, 20, 30]), A = Math.round(314 * r * r) / 100;
      return { html: "", text: `A round hide patch for a cart has an area of <b>${fmt(A)} cm²</b>. Use pi = <b>3.14</b> and 3.14 × r × r = ${fmt(A)}. How many centimetres is its radius?`, choices: cards(r, [r * r, r * 2, r + 5, r + 10, r * 3, Math.round(r / 2)]), why: `r × r = ${fmt(A)} ÷ 3.14 = ${r * r}, and ${r} × ${r} = ${r * r}, so r = ${r} cm.` };
    },
    rr_pemmican() { // ratios and scaling a recipe, a two-step share of a total, and solving 400n + extra = total
      const kind = rand(3);
      if (kind === 0) { const [a, b] = pick([[3, 1], [2, 1], [4, 1], [5, 2]]), u = pick([2, 3, 4, 5, 6]);
        return { html: "", text: `A pemmican recipe uses dried meat and fat in the ratio <b>${a} : ${b}</b> (meat to fat). Jade has <b>${a * u} kg</b> of meat. How many kg of fat does she need?`, choices: cards(b * u, [a * u - b, u, (a + b) * u, a * u, b * u + a, a * b]), why: `${a} parts meat is ${a * u} kg, so 1 part is ${u} kg. ${b} part${b > 1 ? "s" : ""} of fat: ${b} × ${u} = ${b * u} kg.` }; }
      if (kind === 1) { const [a, b] = pick([[3, 1], [2, 1], [4, 1], [3, 2]]), u = pick([2, 3, 4, 5, 6, 8]), T = (a + b) * u;
        return { html: "", text: `A batch of pemmican has meat and fat in the ratio <b>${a} : ${b}</b> and weighs <b>${T} kg</b> in all. How many kg of it is meat?`, choices: cards(a * u, [b * u, u, T - u, a * u + u, T / 2, T - a]), why: `${a} + ${b} = ${a + b} parts. ${T} ÷ ${a + b} = ${u} kg a part. Meat is ${a} × ${u} = ${a * u} kg.` }; }
      const n = pick([3, 4, 5, 6, 7, 8, 9]), extra = pick([100, 200, 300]), T = 400 * n + extra;
      return { html: "", text: `A cart train carried <b>${fmt(T)} kg</b> of pemmican: <b>n</b> carts with <b>400 kg</b> each, plus one small load of <b>${extra} kg</b>. Solve 400 × n + ${extra} = ${fmt(T)}. What is n?`, choices: cards(n, [n + 1, n - 1, n + 2, Math.round(T / 400), T / extra, n * 2]), why: `Take away the small load: ${fmt(T)} − ${extra} = ${fmt(400 * n)}. Then ${fmt(400 * n)} ÷ 400 = ${n} carts.` };
    },
    rr_last(g) { // follows the choice: 0 = the jig (beats, steps and time), 1 = the cart (wheel turns and distance)
      const way = g && g.choice ? 1 : 0, kind = rand(3);
      if (way === 0) {
        if (kind === 0) { const bpm = pick([60, 100, 120]), mins = pick([2, 3, 4]), sp = pick([2, 3, 4]), tot = bpm * mins * sp;
          return { html: "", text: `Jade's jig tune plays <b>${bpm} beats</b> a minute and the dance lasts <b>${mins} minutes</b>. She takes <b>${sp} steps</b> on every beat. How many steps is that in all?`, choices: cards(tot, [bpm * mins, bpm * sp, bpm + mins + sp, tot + bpm, tot - bpm, mins * sp]), why: `Beats: ${bpm} × ${mins} = ${bpm * mins}. Steps: ${bpm * mins} × ${sp} = ${fmt(tot)}.` }; }
        if (kind === 1) { const sp = pick([2, 3, 4]), b = pick([24, 32, 48, 60, 90, 120]), S = sp * b, sec = b / 2;
          return { html: "", text: `Jade danced <b>${S} steps</b>, taking <b>${sp} steps</b> on every beat. The tune plays <b>2 beats</b> every second. How many seconds did the dance last?`, choices: cards(sec, [b, S / 2, S, sec + 10, sec - 10, b * 2]), why: `${S} ÷ ${sp} = ${b} beats. At 2 beats a second, ${b} ÷ 2 = ${sec} seconds.` }; }
        const v = pick([2, 3, 4, 5, 6]), N = 32 * v + 8;
        return { html: "", text: `The jig tune has an <b>8-beat</b> start, then verses of <b>32 beats</b>. The dance lasted <b>${N} beats</b>. Solve 32 × v + 8 = ${N}. How many verses?`, choices: cards(v, [v + 1, v - 1, v + 2, Math.round(N / 32), N - 8, v * 2]), why: `${N} − 8 = ${32 * v}. Then ${32 * v} ÷ 32 = ${v} verses.` };
      }
      // the Red River cart: a wheel 1.5 m across, so one turn rolls 3.14 × 1.5 = 4.71 m
      if (kind === 0) { const t = pick([100, 200, 300, 500]), dist = t * 471 / 100;
        return { html: "", text: `The wheel of the cart is <b>1.5 m</b> across. Use pi = <b>3.14</b>. How many metres does the cart roll in <b>${t}</b> turns of the wheel?`, choices: cards(dist, [Math.round(t * 1.5), Math.round(t * 3.14), dist + 100, dist - 100, 2 * dist]), why: `One turn: 3.14 × 1.5 = 4.71 m. ${t} turns: ${t} × 4.71 = ${fmt(dist)} m.` }; }
      if (kind === 1) { const t = pick([100, 200, 300, 500]), D = t * 471 / 100;
        return { html: "", text: `The wheel of the cart is <b>1.5 m</b> across. Use pi = <b>3.14</b>. How many full turns does it take to roll <b>${fmt(D)} m</b>?`, choices: cards(t, [Math.round(D / 1.5), Math.round(D / 3.14), t + 50, t - 50, t * 2]), why: `One turn rolls 3.14 × 1.5 = 4.71 m. ${fmt(D)} ÷ 4.71 = ${t} turns.` }; }
      const tph = pick([200, 300, 400, 500]), h = pick([2, 3, 4]), perHour = tph * 471 / 100, totalM = perHour * h, km = totalM / 1000, f = v => `${+v.toFixed(3)} km`;
      return { html: "", text: `Beside the ox, the wheel turns <b>${tph} times</b> every hour. It is <b>1.5 m</b> across. Use pi = <b>3.14</b>. How many kilometres does the cart roll in <b>${h} hours</b>?`, choices: textCards(f(km), [tph * 1.5 * h / 1000, km * 1000, km / 2, km * 2, perHour / 1000].map(f)), why: `One turn is 4.71 m. ${tph} × 4.71 = ${fmt(perHour)} m an hour. × ${h} = ${fmt(totalM)} m = ${+km.toFixed(3)} km.` };
    }
  });

  // FACT CHECK: The Métis are a distinct Indigenous people with their own history, culture and language. The Métis Nation grew up in the fur trade country, with its heart at the Red River, from the families of First Nations women (often Cree and Anishinaabe) and European fur traders (French and Scottish), and then from generations of Métis families marrying one another.
  // FACT CHECK: Michif greeting "taanshi" (hello). Michif spelling varies from community to community (Taanishi, Tanshi, Taanshi are all seen), so check the spelling the Métis reviewers prefer. Michif itself weaves Cree (verbs) and French (nouns) together.
  // FACT CHECK: St. Boniface sits on the east bank of the Red River, directly across from The Forks in Winnipeg. River lots (long, narrow farms with a short side on the river) were the way land was divided along the Red River, and the shapes can still be seen in the streets and property lines.
  // FACT CHECK: The great summer bison hunt from the Red River settlement, with hundreds of Métis families and carts, was a yearly event in the 1800s (about 1840 is one of the best recorded years). The hunters elected a captain and agreed on rules before they set out (the Laws of the Hunt). The scene gives no further detail.
  // FACT CHECK: Pemmican is dried bison meat pounded with melted fat (and sometimes berries). It was a main food of the fur trade, eaten by canoe crews and traders. The recipe ratios in the maths questions are made up for the puzzle.
  // FACT CHECK: Red River cart: built entirely of wood and rawhide (no iron, no nails), two wheels about 1.5 m across or more, ungreased wooden axles that squealed loudly, a load of about 400 kg (some sources say up to 450 kg), and the wheels could be taken off so the cart floated across a river. Pulled by an ox (horses were also used).
  // FACT CHECK: The ceinture fléchée (arrow sash) is a long finger-woven belt, the Métis flag is a white infinity sign on a blue field (a red field version also exists) and was flying by 1816, among the oldest flags to begin in Canada. The Red River Jig is a well known Métis fiddle tune and dance.
  // FACT CHECK: After 1869 Canada took over the Red River lands (the Red River Resistance of 1869-70, led by Louis Riel, led to Manitoba joining Canada in 1870). In the years that followed many Métis families lost or left their river lots. The scene now goes on to tell 1885 plainly (see next line).
  // FACT CHECK: Added from Shane's review notes (November 2026): in 1885 at Batoche on the South Saskatchewan River the Métis again asked Canada to respect their land and were not heard; they took up arms with Louis Riel as leader and Gabriel Dumont leading the fighters; Canada sent soldiers west by the new railway; after four days at Batoche the Métis were defeated; Riel was tried for treason and hanged in Regina on November 16, 1885; Manitoba honours him as its founder with Louis Riel Day every February. Also added: the infinity sign on the flag means two cultures joined together and a people that will go on forever; pronunciations TAHN-shee, MEE-chif, may-TEE.
  // FACT CHECK: The Constitution Act, 1982 (section 35) names three Aboriginal peoples of Canada: Indian (First Nations), Inuit and Métis. The scene says "First Nations, Inuit and Métis".
  // FACT CHECK: French words: la charrette (the cart), la ceinture fléchée (the arrow sash), le violon (the fiddle), la roue (the wheel), le bison (the bison), le pemmican (pemmican).
  // FACT CHECK: Next chapter, The Sea of Grass, is in the grasslands of Saskatchewan (west of Manitoba).
  CHAPTERS[2] = { title: "The People of the Red River", where: "The Red River valley", beats: [
    { art: "rr_arrive", say: ["Goodbye, Kai! My clock balloon has drifted just across the Red River from The Forks, to the part of Winnipeg called St. Boniface.",
      "Look at the long, narrow strips of land running back from the water. These are <em>river lots</em>, and you can still see their shapes along this river today.",
      "Somebody down there is playing a fiddle, and it sounds very cheerful. I tapped my foot so hard that I nearly fell out of the basket."] },
    { art: "rr_jade", word: ["taanshi", "hello, in Michif (say TAHN-shee; Michif is said MEE-chif)"], say: ["The fiddler is a girl named Jade. She is <em>Métis</em>, she lives right here by the river, and she jigs with a dance group.",
      "You say Métis like this: may-TEE.",
      "The Métis are a distinct Indigenous people, with their own history, culture and language. The Métis Nation grew up in the fur trade country, with its heart right here at the Red River.",
      "It grew from the families of First Nations women (often Cree and Anishinaabe) and French and Scottish fur traders. Then, over generations, Métis families married one another and became a new people, a nation."] },
    { art: "rr_jade", say: ["Jade says hello like this: <em>taanshi</em>! I said it back. She says I had a good try, and she is a very kind fiddler."] },
    { art: "rr_window1", who: "The clock", say: ["Tick, tock. Time to look back. My window is open."] },
    { art: "rr_window1", word: ["le pemmican", "dried bison meat pounded with fat and berries"], say: ["The window into the past! It is about <em>1840</em>, and a train of carts is rolling out from the Red River. Each summer, hundreds of Métis families set out onto the plains for the great <em>bison hunt</em>.",
      "The hunt is very well organized. Before they start, the hunters elect a captain and agree on a set of rules, the <em>Laws of the Hunt</em>.",
      "The meat is dried, then pounded with fat and berries into <em>le pemmican</em>. It keeps for a very long time, and it was the food that fed the whole fur trade.",
      "And look at the carts! Their wheels are as tall as a person. Let's measure one."] },
    { ask: "rr_wheel", intro: "Measure the cart wheels. Three right answers, and each one earns you a Made Beaver on the way." },
    { art: "rr_cart", word: ["la charrette", "the cart"], say: ["Back to today! Jade has brought me to a Red River cart, built the old way. In French it is <em>la charrette</em>, and its wheels are taller than I am.",
      "It is built entirely of wood and hide, with no iron and no nails, so it could be mended anywhere on the prairie.",
      "The wooden axles were never greased, and they squealed so loudly that you could hear a cart train from far away. Jade covers her ears and laughs.",
      "One cart could carry about <em>400 kilograms</em>. At a river, the wheels came off and the cart floated across like a little boat."] },
    { ask: "rr_area", intro: "Work out some round shapes and a river lot. Three right answers and the window opens again." },
    { art: "rr_window2", who: "The clock", say: ["Tick, tock. The window opens again."] },
    { art: "rr_window2", word: ["la ceinture fléchée", "the arrow sash"], say: ["The window again, and now we see a people with their own ways. Here is the <em>ceinture fléchée</em>, a long finger-woven sash with many uses. Here are fiddles playing the Red River Jig.",
      "People speak <em>Michif</em>, a language that weaves Cree and French together. And the Métis flag flies, a white infinity sign on blue, flown by 1816. It is one of the oldest flags that began in Canada.",
      "The white infinity sign stands for two cultures joined together, and for a people that will go on forever.",
      "After 1869, as Canada took over this land, the Métis had to stand up for their homes and their rights, led by Louis Riel. In the years that followed, many families were pushed off their river lots."] },
    { art: "rr_window2", say: ["In 1885, farther west at Batoche on the South Saskatchewan River, the Métis again asked Canada to respect their land, and again were not heard.",
      "They took up arms, with Louis Riel as their leader and Gabriel Dumont leading the fighters. Canada sent soldiers west by the new railway. After four days of fighting at Batoche, the Métis were defeated.",
      "Riel was tried for treason and hanged in Regina on November 16, 1885. Today Manitoba honours him as its founder, with Louis Riel Day every February.",
      "The Métis Nation is here today, one of the three Indigenous peoples named in Canada's Constitution, with First Nations and Inuit."] },
    { ask: "rr_pemmican", intro: "Help Jade scale up a pemmican recipe. Three right answers and then you choose how to spend the afternoon." },
    { art: "rr_choice", pick: "Jade has two ideas for the afternoon. Shall we learn a step of the Red River Jig, or ride in the Red River cart?", options: [
      { label: "Learn a jig step", art: "rr_jig", word: ["le violon", "the fiddle"], say: ["Jade tucks her fiddle under her chin and plays the Red River Jig, while her feet go tap, tap, tap. The jig is quick and bouncy, and the steps match the beat of the tune.",
        "I try the step with my big owl feet. The fiddle is <em>le violon</em> in French. It was the only one of us that stayed in time."] },
      { label: "Ride in the cart", art: "rr_ride", word: ["la roue", "the wheel"], say: ["I climb into the box, and Jade walks beside the ox. The big wooden wheels creak and squeal, and the whole cart bounces along.",
        "The wheel is <em>la roue</em> in French. I count its turns as we roll, because that is what a curious owl does. Jade says I am being silly."] }] },
    { ask: "rr_last", intro: "Last puzzles of the day. Three right answers finishes the chapter." },
    { art: "rr_goodbye", word: ["le bison", "the bison"], say: ["Thank you, Jade! You showed me that the Métis are a living nation, with music, a language and a flag that still flies today.",
      "When the hunt was ready, the carts rolled west, squealing, out onto the open plains. There the grass goes on like a sea, and the great herds of <em>le bison</em> were waiting.",
      "I can almost hear the axles. Back into the basket I go, and we follow the carts west to <em>The Sea of Grass</em>. Tick tock!"] }
  ] };
}
