"use strict";
// Grade 8, Chapter 2: The River of Gold. The Fraser River and its salmon, the gold rush of 1858 as a miner and a Nlaka'pamux fisher saw it, and what came after.
{
  const GUIDE = WHO.jordan; // Jordan: short dark hair and a blue hoodie

  // ---------- my own drawing pieces ----------
  // a sockeye salmon, red with a green head, facing right (r turns it, flip faces it left)
  const salmon = (x, y, s, r, flip) => `<g transform="translate(${x} ${y}) rotate(${r || 0}) scale(${flip ? -s : s} ${s})" ${THIN}><path d="M-15 0 L-28 -9 Q-24 0 -28 9 Z" fill="#d62839"/><ellipse cx="-2" cy="0" rx="17" ry="7.5" fill="#d62839"/><path d="M9 -7 Q22 -7 24 0 Q22 7 9 7 Q13 0 9 -7 Z" fill="#4a9a52"/><circle cx="17" cy="-2" r="1.6" fill="#2b1a10" stroke="none"/><path d="M-6 -7 Q-1 -12 5 -7" fill="#b01e2e"/></g>`;
  // a dip net on a long pole: the pole runs down to the right and the hoop hangs over the water (x, y is where it is held)
  const dipNet = (x, y, s) => `<g transform="translate(${x} ${y}) scale(${s})" ${THIN}><path d="M0 0 L48 52" fill="none" stroke-width="6" stroke="#2b1a10"/><path d="M0 0 L48 52" fill="none" stroke-width="3.4" stroke="#8a5a2b"/><ellipse cx="56" cy="60" rx="17" ry="12" transform="rotate(45 56 60)" fill="#f1ddb5"/><path d="M46 50 L66 70 M48 62 L64 58 M54 52 L58 68" fill="none" stroke-width="1"/></g>`;
  // a rack of split salmon drying in the wind
  const dryRack = (x, y, s) => `<g transform="translate(${x} ${y}) scale(${s})" ${THIN}><path d="M-30 0 V-46 M30 0 V-46 M-34 -44 H34 M-34 -24 H34" fill="none" stroke-width="3" stroke="#8a5a2b"/>${[-24, -10, 4, 18].map(fx => `<path d="M${fx} -44 q-5 10 0 20 q5 -10 0 -20 Z" fill="#f2703a"/>`).join("")}${[-17, -3, 11].map(fx => `<path d="M${fx} -24 q-5 9 0 18 q5 -9 0 -18 Z" fill="#e85a2a"/>`).join("")}</g>`;
  // a gold pan with a few flakes in it
  const goldPan = (x, y, s) => `<g transform="translate(${x} ${y}) scale(${s})" ${INKED}><ellipse cx="0" cy="0" rx="28" ry="11" fill="#8d877b"/><ellipse cx="0" cy="1" rx="21" ry="7.5" fill="#5f6672"/></g><g transform="translate(${x} ${y}) scale(${s})"><circle cx="-8" cy="2" r="2.4" fill="#f4b942"/><circle cx="2" cy="4" r="2" fill="#ffd84d"/><circle cx="9" cy="1" r="2.6" fill="#f4b942"/><circle cx="-1" cy="-1" r="1.6" fill="#ffd84d"/></g>`;
  // a wooden rocker box (a cradle for washing gravel), with its handle
  const rocker = (x, y, s) => `<g transform="translate(${x} ${y}) scale(${s})" ${INKED}><path d="M-30 12 Q0 24 30 12" fill="none" stroke-width="5"/><path d="M-26 -12 H22 L28 10 H-26 Z" fill="#b98b54"/><path d="M-26 -12 L-26 -22 H-8 V-12" fill="#a0693a"/><path d="M22 -10 L44 -30" fill="none" stroke-width="5"/><path d="M-20 -4 H20 M-20 3 H22" fill="none" stroke-width="1.4" stroke="#7a5326"/><circle cx="46" cy="-32" r="3.6" fill="#8a5a2b"/></g>`;
  // a paddle-wheel steamboat of 1858 (the wheel is at the back, on the left); x, y is the waterline
  const steamboat = (x, y, s) => `<g transform="translate(${x} ${y}) scale(${s})" ${INKED}><path d="M-56 0 L52 0 L62 -14 H-48 Z" fill="#7a4a24"/><rect x="-36" y="-34" width="62" height="20" fill="#fbf6ea"/><rect x="-26" y="-50" width="40" height="16" fill="#fbf6ea"/><path d="M-40 -34 H30 V-38 H-40 Z" fill="#a8452a"/><rect x="14" y="-70" width="12" height="38" fill="#2b2b2b"/><rect x="14" y="-62" width="12" height="6" fill="#e63946"/>${[-20, -6, 8].map(wx => `<rect x="${wx - 3}" y="-28" width="7" height="8" fill="#bfe6f7"/>`).join("")}<circle cx="-54" cy="-10" r="15" fill="#c0392b"/><path d="M-54 -25 V5 M-69 -10 H-39 M-65 -21 L-43 1 M-65 1 L-43 -21" fill="none" stroke-width="1.6"/></g><g fill="#fff" opacity=".85" stroke="#2b1a10" stroke-width="1.4"><circle cx="${x + 24 * s}" cy="${y - 82 * s}" r="${7 * s}"/><circle cx="${x + 36 * s}" cy="${y - 94 * s}" r="${9 * s}"/></g>`;
  // a modern counting fence across the river: a row of grey pickets with a wooden rail on top (x, y is the top of the pickets)
  const fence = (x, y, w) => `<g ${THIN}>${Array.from({ length: Math.floor(w / 9) + 1 }, (_, i) => `<rect x="${x + i * 9}" y="${y}" width="3.6" height="30" fill="#aab2bd"/>`).join("")}<rect x="${x - 3}" y="${y - 5}" width="${w + 9}" height="6" rx="2" fill="#7a5326"/></g>`;
  // a gravel bank across the bottom of the picture
  const gravel = (y, c) => `<g ${INKED}><path d="M-10 ${y} Q100 ${y - 16} 210 ${y - 2} T410 ${y - 8} V250 H-10 Z" fill="${c || "#c9b8a6"}"/></g><g fill="#a89a86" opacity=".7">${[[40, y + 14], [120, y + 22], [200, y + 12], [290, y + 20], [360, y + 12]].map(([gx, gy]) => `<ellipse cx="${gx}" cy="${gy}" rx="5" ry="2.4"/>`).join("")}</g>`;
  // the far bank, a thin green strip behind the river
  const farBank = `<g ${INKED}><path d="M-10 108 Q100 92 200 102 T410 98 V114 Q300 122 200 114 T-10 118 Z" fill="#a9cf86"/></g>`;
  // the canyon: a river running away between two steep walls of rock, with evergreens along the tops (lit puts the sun in the gap)
  const canyon = (a, b, lit) => `${sky(a, b, lit ? [200, 40, 18] : null, [[200, 22, .6]])}<g ${THIN}><path d="M150 114 L188 66 L212 92 L246 60 L272 114 Z" fill="#b9c8dc"/></g>
    <g ${INKED}><path d="M166 112 L236 112 L350 250 H58 Z" fill="#5db7e6"/></g><g fill="none" stroke="#fff" stroke-width="2" stroke-linecap="round" opacity=".7"><path d="M190 130 q8 -4 16 0 M210 160 q10 -5 20 0 M150 196 q12 -6 24 0 M250 210 q12 -6 24 0"/></g>
    <g ${INKED}><path d="M-10 72 Q40 34 100 46 Q150 42 170 72 Q152 100 168 112 Q116 178 56 250 H-10 Z" fill="#9a9487"/><path d="M410 72 Q360 34 300 46 Q250 42 232 72 Q250 100 236 112 Q290 178 352 250 H410 Z" fill="#8d877b"/></g>
    <g fill="none" stroke="#6f6a5e" stroke-width="2" stroke-linecap="round"><path d="M30 110 L52 134 M70 150 L96 170 M20 170 L44 194 M372 112 L350 136 M330 152 L306 172 M386 176 L362 198"/></g>
    ${pine(34, 66, .9, "#2f8a57")}${pine(66, 56, .75, "#3f9a58")}${pine(112, 58, .8)}${pine(150, 70, .6, "#3f9a58")}${pine(372, 66, .9, "#2f8a57")}${pine(338, 54, .75, "#3f9a58")}${pine(290, 56, .8)}${pine(250, 70, .6, "#3f9a58")}`;

  // ---------- the window into the past: a family fishing from a rock ledge in the canyon, long before 1858 ----------
  const longAgo1 = `<rect width="400" height="240" fill="#f6e3b4"/><g ${THIN}><path d="M150 120 L190 70 L215 96 L250 60 L290 100 L330 80 V130 H150 Z" fill="#cdd8e4"/></g>
    <g ${INKED}><path d="M150 134 Q236 118 330 134 V200 H150 Z" fill="#6cc0ea"/></g><g fill="none" stroke="#fff" stroke-width="2" stroke-linecap="round" opacity=".7"><path d="M222 150 q6 -3 12 0 M246 176 q6 -3 12 0 M226 192 q6 -3 12 0"/></g>
    ${salmon(238, 160, .7, -30)}${salmon(240, 184, .6, -10)}
    <g ${INKED}><path d="M150 100 Q175 92 205 108 Q222 118 214 150 L205 200 H150 Z" fill="#a8a091"/><path d="M268 150 Q292 136 322 144 V196 H262 Z" fill="#b9b3a6"/></g>
    ${pine(162, 98, .55)}${dryRack(296, 146, .75)}${person(184, 74, .6, "#c98f58")}${dipNet(190, 86, .8)}`;

  // ---------- the pictures ----------
  Object.assign(ART, {
    rg_arrive: () => frame(`${canyon("#9fd8f2", "#f4f1d8")}${salmon(200, 172, .9, -35)}${salmon(238, 198, .8, -15)}${salmon(162, 208, .8, 10, true)}${riding(150, 18, 92)}`),
    rg_jordan: () => frame(`${canyon("#9fd8f2", "#f4f1d8")}${salmon(196, 148, .7, -30)}${salmon(228, 166, .6, -10, true)}${gravel(190)}${owlAt(30, 126, 104)}${kidAt(250, 146, 1, GUIDE)}`),
    rg_window1: () => frame(`${sky("#9fd8f2", "#f4f1d8", null, [[60, 40, .7]])}${gravel(198)}${windowAt(236, 112, 92, longAgo1)}${owlAt(18, 118, 108)}${kidAt(118, 150, .95, GUIDE)}`),
    rg_today: () => frame(`${canyon("#9fd8f2", "#f4f1d8", true)}${salmon(205, 130, .55, -20)}${fence(142, 150, 122)}${salmon(190, 184, .85, -10)}${salmon(228, 174, .8, -25)}${salmon(160, 170, .7, -5)}${gravel(204)}${house(330, 172, 48, 34, "#a8452a")}${person(304, 168, .8, "#ff8a3d")}${riding(20, 16, 90)}`),
    rg_miner: () => frame(`${sky("#9fd8f2", "#f4f1d8", [348, 36, 18], [[90, 34, .8], [220, 26, .6]])}${water(112, "#5db7e6")}${farBank}${tree(60, 104, .8)}${tree(120, 106, .6, "#3f9a58")}${tree(330, 100, .8, "#3f9a58")}${steamboat(290, 140, .5)}${gravel(170, "#d9c7a0")}${tent(330, 190, .8)}${tent(366, 196, .65, "#e8c58a")}${rocker(262, 214, .8)}${person(130, 104, 2.2, "#8a3d3d")}${goldPan(190, 214, 1)}`),
    rg_fisher: () => frame(`${sky("#9fd8f2", "#f4f1d8", null, [[100, 34, .8], [240, 26, .6]])}${water(112, "#5db7e6")}${farBank}${tree(70, 104, .8)}${tree(300, 100, .8, "#3f9a58")}${tree(340, 104, .6)}
      <g ${INKED}><path d="M-10 250 V192 Q40 180 110 186 Q142 192 152 214 Q160 238 150 250 Z" fill="#a8a091"/><path d="M226 250 Q246 198 326 190 Q376 186 410 192 V250 Z" fill="#c9b8a6"/></g>
      <g ${THIN} fill="#9a8f7d"><ellipse cx="330" cy="226" rx="26" ry="8"/><ellipse cx="376" cy="232" rx="20" ry="6"/><ellipse cx="262" cy="238" rx="18" ry="5"/></g>
      ${tent(310, 198, .8)}${tent(356, 204, .7, "#e8c58a")}${rocker(272, 222, .8)}${dryRack(44, 190, .8)}${person(100, 96, 2.1, "#c0504d")}${dipNet(116, 148, .8)}`),
    rg_after: () => frame(`${canyon("#b7c4d8", "#ecdcc8")}${gravel(192)}${dryRack(330, 212, .9)}${owlAt(30, 126, 104)}${kidAt(150, 146, 1, GUIDE)}`),
    rg_choice: () => frame(`${sky("#9fd8f2", "#f4f1d8", [348, 36, 18], [[130, 34, .8], [250, 26, .6]])}${water(108, "#5db7e6")}${farBank}${tree(70, 104, .8)}${tree(330, 100, .8, "#3f9a58")}${fence(120, 132, 150)}${salmon(150, 160, .8, -15)}${salmon(250, 164, .7, -20, true)}${gravel(180)}${goldPan(190, 216, 1.1)}${owlAt(22, 126, 104)}${kidAt(310, 146, 1, GUIDE)}`),
    rg_count: () => frame(`${sky("#9fd8f2", "#f4f1d8", [348, 36, 18], [[90, 34, .8], [220, 26, .6]])}${water(104, "#5db7e6")}${farBank}${tree(70, 104, .8)}${tree(330, 100, .8, "#3f9a58")}${fence(36, 134, 330)}${salmon(110, 168, .9, -15)}${salmon(200, 172, .8, -30)}${salmon(300, 166, .9, -10)}${gravel(188)}${owlAt(20, 126, 104)}${kidAt(250, 146, 1, GUIDE)}${person(330, 168, 1.1, "#ff8a3d")}`),
    rg_pan: () => frame(`${sky("#9fd8f2", "#f4f1d8", [348, 36, 18], [[100, 34, .8], [240, 26, .6]])}${water(104, "#5db7e6")}${farBank}${tree(70, 104, .8)}${tree(330, 100, .8, "#3f9a58")}${gravel(168, "#d9c7a0")}${owlAt(20, 128, 104)}${person(190, 122, 1.9, "#3b6ea5")}${goldPan(244, 218, 1)}${kidAt(318, 140, 1, GUIDE)}`),
    rg_goodbye: () => frame(`${canyon("#ffd9a0", "#fdebd0", true)}${balloonAt(285, 14, 80)}${gravel(190)}${owlAt(30, 126, 104)}${kidAt(250, 146, 1, GUIDE)}`)
  });

  // ---------- the questions ----------
  const sn = (a, k) => `${a} × 10<sup>${k}</sup>`; // scientific notation
  const snp = (a, k) => `${a} × 10^${k}`; // the same, for the plain-text hints
  const dol = x => `$${x}`;
  Object.assign(ASK, {
    rg_graph() { // straight-line graphs and rates: fish counted per hour, and distance swum per day
      const kind = rand(3);
      if (kind === 0) { const r = pick([100, 200, 300]), t = pick([3, 4, 5]); // tap the point on the line
        const pts = shuffle([{ p: [t, t * r], ok: true }, { p: [t, (t + 3) * r] }, { p: [t + 3, t * r] }, { p: [t - 2, (t + 2) * r] }]);
        return { tap: true, html: graph({ xmax: 8, ymax: 10 * r, xstep: 1, ystep: r, xl: "hours", yl: "fish counted", line: [r, 0], spots: pts.map(o => o.p) }),
          text: `Sockeye pass the counting fence at a steady <b>${r} fish per hour</b>. The red line shows the total. Tap the point for <b>${t} hours</b>.`,
          choices: pts.map((o, i) => ({ pick: String(i), ok: !!o.ok })), why: `${r} fish per hour × ${t} hours = ${fmt(r * t)} fish. Go across to ${t}, then up to ${fmt(r * t)}, onto the line.` }; }
      if (kind === 1) { const r = pick([100, 200, 300]), x = pick([2, 4, 5]), y = r * x; // read the slope
        return { html: graph({ xmax: 8, ymax: 10 * r, xstep: 1, ystep: r, xl: "hours", yl: "fish counted", line: [r, 0], dots: [[x, y]] }),
          text: `The line shows fish counted over time. The black dot is at <b>${x} hours</b> and <b>${fmt(y)} fish</b>. What is the rate, in fish per hour?`,
          choices: cards(r, [y, x, r * 2, r / 2, r + x]), why: `Rate of change = ${fmt(y)} ÷ ${x} = ${r} fish per hour. That is the slope of the line.` }; }
      const d = pick([20, 30, 40]), n = pick([8, 10, 12, 15]), dist = d * n; // a missing number
      return { html: "", text: `A sockeye swims about <b>${d} km</b> a day. Its birthplace is <b>${dist} km</b> upriver. Solve <b>${d}x = ${dist}</b>: how many days does it take?`,
        choices: cards(n, [n + 1, n - 1, n + 2, d, dist - d]), why: `${d}x = ${dist}, so x = ${dist} ÷ ${d} = ${n} days.` };
    },
    rg_big() { // scientific notation and big numbers
      const kind = rand(3);
      if (kind === 0) { const at = pick([12, 24, 31, 45, 52, 68, 75]), k = pick([4, 5, 6]), n = at * 10 ** (k - 1), a = tenths(at);
        return { html: "", text: `In a big year about <b>${fmt(n)}</b> sockeye swim up the Fraser. Which is this number in scientific notation?`,
          choices: textCards(sn(a, k), [sn(a, k + 1), sn(a, k - 1), sn(a, k + 2), sn(a, k - 2), sn(a, k + 3)]), why: `The decimal point moves ${k} places: ${fmt(n)} = ${snp(a, k)}.` }; }
      if (kind === 1) {
        if (rand(2)) return { html: "", text: `In 1858 about <b>${sn(3, 4)}</b> miners rushed to the Fraser River. Write that as an ordinary number.`,
          choices: textCards(fmt(30000), [fmt(3000), fmt(300000), fmt(34), fmt(3000000), fmt(340000)]), why: `${snp(3, 4)} means 3 × 10 000, so move the decimal point 4 places: ${fmt(30000)}.` };
        const at = pick([12, 24, 31, 45, 52, 68]), k = pick([4, 5, 6]), n = at * 10 ** (k - 1), a = tenths(at);
        return { html: "", text: `One year the run was <b>${sn(a, k)}</b> salmon. Write that as an ordinary number.`,
          choices: textCards(fmt(n), [fmt(n * 10), fmt(n / 10), fmt(n * 100), fmt(n / 100), fmt(at * k)]), why: `Move the decimal point ${k} places to the right: ${snp(a, k)} = ${fmt(n)}.` }; }
      const a = pick([2, 3, 4, 5]), k1 = pick([5, 6]), k2 = k1 - pick([2, 3]), ans = 10 ** (k1 - k2);
      return { html: "", text: `A big run is <b>${sn(a, k1)}</b> fish. After the rock slide, the run was only <b>${sn(a, k2)}</b>. How many times bigger is the big run?`,
        choices: cards(ans, [ans * 10, ans / 10, ans * 2, k1 - k2, a * ans]), why: `${a} is the same in both, so divide the powers: 10^${k1} ÷ 10^${k2} = 10^${k1 - k2} = ${ans}.` };
    },
    rg_case(g) { // CASE FILE: did a gold miner of 1858 end up ahead or behind? (prices are simplified)
      const c = (g && g.case) || {};
      if (!c.set) { c.set = true; c.d = pick([4, 5, 6]); c.gr = pick([2, 3, 4]); c.p = pick([2, 3]); c.f = pick([12, 14]); c.t = pick([15, 20, 25]); }
      const { d, gr, p, f, t } = c, step = g ? g.stars || 0 : rand(3), V = gr * p * d, C = f * d + t, S = C - V;
      if (step === 0) return { html: "", text: `A miner pans <b>${gr} grams</b> of gold a day for <b>${d} days</b>. Gold sells for <b>$${p}</b> a gram. How much is all his gold worth?`,
        choices: textCards(V, [gr * d, p * d, gr * p, V + gr, V - p], dol), why: `${gr} × ${d} = ${gr * d} grams. ${gr * d} × $${p} = $${V}.` };
      if (step === 1) return { html: "", text: `At gold-rush prices he pays <b>$${f}</b> a day for flour and beans, and <b>$${t}</b> for a pan, shovel and rocker box. What does he spend in <b>${d} days</b>?`,
        choices: textCards(C, [f * d, f + t, (f + t) * d, f * d + f, C + t], dol), why: `${f} × ${d} = ${f * d} for food. Add the tools: ${f * d} + ${t} = $${C}.` };
      return { html: "", text: `He earned <b>$${V}</b> in gold and spent <b>$${C}</b>. Is he ahead or behind, and by how much?`,
        choices: textCards(`behind $${S}`, [`ahead $${S}`, `behind $${V}`, `ahead $${C}`, `behind $${C}`, `ahead $${V}`]), why: `$${V} − $${C} = −$${S}, so he is $${S} behind. Most real miners ended behind too.` };
    },
    rg_last(g) { // the fourth maker follows the choice (g.choice: 0 = count fish at the fence, 1 = pan for gold)
      const way = g && g.choice ? 1 : 0, kind = rand(3);
      if (way === 0) {
        if (kind === 0) { const r = pick([150, 200, 250, 300]), h = pick([2, 3, 4, 6]), F = r * h;
          return { html: "", text: `Today's counters click <b>${fmt(F)}</b> sockeye through the fence in <b>${h} hours</b>. What is the rate, in fish per hour?`,
            choices: cards(r, [F, h, r * 2, r / 2, r + h]), why: `Rate = ${fmt(F)} ÷ ${h} = ${r} fish per hour.` }; }
        if (kind === 1) { const A = pick([200, 400, 500, 800]), pc = pick([20, 25, 40, 50]), B = A - A * pc / 100;
          return { html: "", text: `Last year's run was <b>${fmt(A * 1000)}</b> sockeye. This year it was <b>${fmt(B * 1000)}</b>. What is the percent decrease?`,
            choices: textCards(`${pc}%`, [`${pc + 5}%`, `${pc - 5}%`, `${pc + 10}%`, `${100 - pc}%`, `${pc / 2}%`]), why: `It fell by ${fmt((A - B) * 1000)}. ${A - B} ÷ ${A} = ${pc / 100}, so that is ${pc}%.` }; }
        const R = pick([200, 400, 500, 800]), q = pick([10, 20, 25, 50]), up = R * 10 * q, N = R * 1000 + up;
        return { html: "", text: `A run of <b>${fmt(R * 1000)}</b> sockeye grows by <b>${q}%</b> next year. How many sockeye is that?`,
          choices: textCards(N, [up, R * 1000 + q, R * 1000 - up, R * 1000 + 2 * up, R * 100 * q], fmt), why: `${q}% of ${fmt(R * 1000)} = ${fmt(up)}. Add it on: ${fmt(R * 1000)} + ${fmt(up)} = ${fmt(N)}.` };
      }
      if (kind === 0) { const n = pick([6, 8, 10, 12]), mt = pick([2, 4, 5]), tot = n * mt;
        return { html: "", text: `On the gravel bar, Jordan's uncle finds <b>${n} flakes</b>. Each weighs about <b>0.${mt} g</b>. What is the total mass of gold?`,
          choices: textCards(`${tenths(tot)} g`, [`${tenths(tot * 10)} g`, `${tot} g`, `${tenths(n + mt)} g`, `${tenths(tot + mt)} g`, `${tenths(tot - mt)} g`]), why: `${n} × 0.${mt} g = ${tenths(tot)} g.` }; }
      if (kind === 1) { const gm = pick([2, 3, 4, 5]), P = pick([80, 100, 120]), v = gm * P;
        return { html: "", text: `A jar holds <b>${gm} grams</b> of gold. Pretend gold sells for <b>$${P}</b> a gram. What is the jar worth?`,
          choices: textCards(v, [gm + P, v + P, v - P, v * 10, gm * 10], dol), why: `${gm} × $${P} = $${v}.` }; }
      const usd = pick([20, 40, 60, 80]), rate = pick([1.25, 1.5]), cad = usd * rate;
      return { html: "", text: `A visitor from the US pays <b>$${usd} US</b> for a pan lesson. Pretend <b>$1 US = $${rate} Canadian</b>. How many Canadian dollars is that?`,
        choices: cards(cad, [usd, cad - usd, cad + 10, cad - 10, usd * 2]), why: `${usd} × ${rate} = ${cad}, so the lesson costs $${cad} Canadian.` };
    }
  });

  // FACT CHECK: the Fraser River is the longest river in British Columbia and flows through the Fraser Canyon (near Yale and Hope) before it spreads out toward the sea
  // FACT CHECK: Stó:lō means "people of the river" in Halq'eméylem (the language of the Stó:lō); please check the spelling, the accents and the translation with Stó:lō readers
  // FACT CHECK: the Stó:lō live in the lower Fraser River valley (the area around Hope and downriver), and the Nlaka'pamux live upriver in the Fraser Canyon and the Thompson River area
  // FACT CHECK: families fished with dip nets from rock ledges in the canyon, dried salmon on racks in the dry canyon wind for winter and trade, and fishing places were looked after by families and passed down
  // FACT CHECK: sockeye swim hundreds of kilometres up the Fraser to spawn where they were born, and their bodies turn red and their heads green at spawning time
  // FACT CHECK: rock slides at Hells Gate in 1913 and 1914, caused by railway blasting, blocked the river and the sockeye run collapsed; fishways were built there later (in the 1940s)
  // FACT CHECK: warming water and overfishing are among the things that threaten Fraser salmon today
  // FACT CHECK: in the spring and summer of 1858 about 30,000 gold miners came to the Fraser River, most of them from California, many of them by steamboat
  // FACT CHECK: miners dug up gravel bars where First Nations fished, and took over village sites and fishing places; the Fraser Canyon War of summer 1858 was fought in the canyon, people on both sides were killed and villages were burned, and Nlaka'pamux leaders made a peace
  // FACT CHECK: in 1858 Britain made the mainland a colony, British Columbia, to keep control of the gold fields
  // FACT CHECK: treaties were never made for almost all of British Columbia; the land was not sold or given up, and this is still being worked out in courts and in new agreements
  // FACT CHECK: in 1862 smallpox spread up the coast and through the province, killing tens of thousands of First Nations people, and some communities lost more than half of their people in a single year
  // FACT CHECK: most gold rush miners did not get rich, and many ended with less than they started with (the case file uses SIMPLIFIED, made-up prices and amounts, not real 1858 figures)
  // FACT CHECK: people still pan for gold in the Fraser Canyon for fun and find a few flakes; the modern prices and the exchange rate in the questions are pretend numbers chosen to suit the maths
  // FACT CHECK: the fish counts, run sizes and swimming speeds in the questions are made up to suit the maths
  // FACT CHECK: French words: le saumon (the salmon), la rivière (the river), l'or (the gold), le filet (the net), la pépite (the nugget), compter (to count)
  // FACT CHECK: when smallpox reached Victoria in 1862, the colony's officials forced the First Nations people camped there to leave, and the sickness travelled north along the coast with them (added from Shane's review notes, November 2026); pronunciation guides for Stó:lō, Nlaka'pamux and Halq'eméylem also added from the same notes
  // READERS: Stó:lō and Nlaka'pamux readers.
  CHAPTERS[1] = { title: "The River of Gold", where: "The Fraser River", beats: [
    { art: "rg_arrive", word: ["la rivière", "the river"], say: ["Goodbye, Mei, and goodbye, railway! My clock balloon has floated down out of the mountains, and now I am drifting between two steep walls of rock.",
      "Far below, a wide river is rushing through the gap. This is the <em>Fraser River</em>, in British Columbia. Look at the water! Something red keeps leaping out of it.",
      "A river is <em>la rivière</em> in French. I am looking for a boy who knows this river better than anyone. I think I will land on that gravel bank."] },
    { art: "rg_jordan", word: ["Stó:lō", "people of the river (say STAW-low)"], say: ["This is Jordan. He is a Stó:lō boy, and he lives near Hope, where the river comes out of the canyon. His family has fished this river for as long as anyone can remember.",
      "You say Stó:lō like this: STAW-low.",
      "<em>Stó:lō</em> means people of the river, in Halq'eméylem (say halk-uh-MAY-lem), the language of his people. Jordan says the name tells you everything. The river is home and food, all in one.",
      "Higher up in the canyon is the land of the Nlaka'pamux people. You say it ing-kla-KAP-muh. Every year the salmon swim past all of them. Jordan says to look through the clock and see how his family fished long ago."] },
    { art: "rg_window1", who: "The clock", say: ["Tick, tock. Time to look back. My window is open."] },
    { art: "rg_window1", word: ["le filet", "the net"], say: ["The window into the past! We are looking back long before 1858, long before any railway or town. The river runs deep and fast through the canyon, and the salmon are coming home.",
      "Families stand on rock ledges over the rushing water and lift salmon out with long dip nets. A net is <em>le filet</em> in French. Each fishing place is looked after by a family and handed down.",
      "The fish are split open and hung on racks in the warm, dry wind of the canyon. Dried salmon lasts all winter, with plenty left over to trade."] },
    { ask: "rg_graph", intro: "Counting fish and following their swim on a graph. Three right answers and we look at the river today." },
    { art: "rg_today", word: ["le saumon", "the salmon"], say: ["Back to today! This is a counting station on the Fraser. Sockeye salmon are swimming upriver, and people count every fish that passes the fence. A salmon is <em>le saumon</em>.",
      "Sockeye swim hundreds of kilometres up the river to lay their eggs where they were born. On the way their bodies turn red and their heads turn green.",
      "Counting matters because some years the run is tiny. In 1913 and 1914, blasting for the railway sent rock sliding into the canyon at Hells Gate and blocked the river. The run collapsed.",
      "Fishways were built later so that fish could get past. Warmer water and too much fishing hurt the salmon too, so people keep counting and keep watching."] },
    { ask: "rg_big", intro: "Some of these numbers are very big. Three right answers and the window opens on the spring of 1858, where two people will tell us what they see." },
    { who: "The miner", art: "rg_miner", word: ["l'or", "the gold"], say: ["I came north from California this spring with a pan and a shovel. All winter I heard the same news: there is gold in the sandbars of the Fraser River! Thousands of us rushed here within months, about 30,000 men.",
      "I rode a steamboat up the river, then walked. I scoop gravel into my pan, swirl the water, and the heavy yellow flakes settle at the bottom. That is <em>l'or</em>, gold. One good strike and I could buy a farm.",
      "To me the bank looked empty and free for the taking. I did not stop to ask whose it was."] },
    { who: "A Nlaka'pamux fisher", art: "rg_fisher", say: ["My family has fished from these rocks since long before my grandmother's grandmother. Each fishing rock belongs to a family, and we look after it. Then the miners came, thousands of them, in only a few months.",
      "They dug up the gravel bars where we fish and dry salmon. They took over village sites and fishing rocks. They did not ask us, and we had never agreed to share the river this way.",
      "That summer there was fighting in the canyon. People on both sides were killed, and villages were burned. It is called the Fraser Canyon War. In the end our leaders made a peace. We are still here, and so is the river."] },
    { art: "rg_after", say: ["The clock is quiet, and so am I. Here is what came next, plainly. In 1858, Britain made the mainland a colony, <em>British Columbia</em>, to keep control of the gold fields.",
      "No treaties were made for almost all of this land. It was never sold or given up, and that is still being worked out today, in courts and in new agreements.",
      "Then, in 1862, smallpox came up the coast and through the colony. It killed tens of thousands of First Nations people, and some communities lost more than half of their people in a single year."] },
    { art: "rg_after", say: ["When smallpox reached Victoria in 1862, the colony's officials forced the First Nations people camped there to leave, and the sickness travelled north along the coast with them.",
      "The Stó:lō and the Nlaka'pamux are still here, and so is the river. Jordan's family still fishes it."] },
    { ask: "rg_case", intro: "A case file in three steps: did a gold miner of 1858 end up ahead or behind? Three right answers, one step at a time, and then you choose how we spend the afternoon." },
    { art: "rg_choice", pick: "Jordan has two ideas for the afternoon. We could go out with the fish counters at the counting fence, or pan for gold at a sandbar with his uncle. People still do, for fun, and find a few flakes. Which one?", options: [
      { label: "Count fish at the fence", art: "rg_count", word: ["compter", "to count"], say: ["We pull on bright orange vests and walk out to the fence with a fish counter. Each time a salmon swims through the gate, she clicks her counter once. To count is <em>compter</em> in French.",
        "Jordan lets me try. Click, click, click! It is much harder than it looks, because the fish do not wait in a line, and one of them splashed my feathers."] },
      { label: "Pan for gold with Jordan's uncle", art: "rg_pan", word: ["la pépite", "the nugget"], say: ["Jordan's uncle takes us to a gravel bar and shows us how to swirl the pan so the heavy flakes sink. People still pan here for fun, and with luck you find a few tiny flakes. A lump of gold is <em>la pépite</em>, a nugget.",
        "I found a flake! It was so small I almost sneezed it back into the river. Keep still, Dr. Somebody."] }] },
    { ask: "rg_last", intro: "Time for the numbers of the afternoon you chose. Three right answers and we say goodbye to the river." },
    { art: "rg_goodbye", say: ["Back in today! Jordan walks us to the water's edge. The Fraser rolls on past Hope, and the salmon keep swimming against the current, just as they have for thousands of years.",
      "Jordan says his people have watched this river through everything that has happened, the gold rush, the colony and the sickness. They are still here, still fishing, and still looking after it.",
      "The river does not stop here. It runs out across a wide flat delta and into the sea, near a great harbour. A big city has grown up there, with an old, old story under its cedar trees.",
      "Thank you, Jordan! Next we follow the river down to the sea, in The Harbour and the Cedar. Tick tock!"] }
  ] };
}
