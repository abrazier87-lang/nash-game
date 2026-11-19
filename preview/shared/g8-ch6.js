"use strict";
// Grade 8, Chapter 6: The Top of the World. Dr. Somebody meets Nina again, now a few years older, on the Arctic coast of Nunavut in summer. Whalers and traders, a warming land, and Nunavut.
{
  const fx = n => String(+n.toFixed(2));                          // a decimal with no extra zeros
  const tf = v => (v < 0 ? "−" : "") + fx(Math.abs(v));           // a number with a proper minus sign
  const nina = (x, y, s) => kidAt(x, y, s, WHO.nina);             // Nina, in her teal parka, as in Grade 5
  // the midnight sun: a warm sky with the sun sitting low on the horizon (sx, sy is the middle of the sun)
  const warmSky = (sx, sy, clouds) => sky("#ffb27a", "#ffe6b8", [sx, sy, 22], clouds);
  // flat summer tundra in two layers (y is where the far edge sits)
  const tundra = (y, c1, c2) => `<g ${INKED}><path d="M-10 ${y} Q120 ${y - 8} 230 ${y - 2} T410 ${y - 5} V250 H-10 Z" fill="${c1 || "#b7c98a"}"/><path d="M-10 ${y + 36} Q140 ${y + 26} 270 ${y + 34} T410 ${y + 30} V250 H-10 Z" fill="${c2 || "#a3b878"}"/></g>`;
  // small tundra flowers: pts are [x, y, colour]
  const flowers = pts => pts.map(([x, y, c]) => `<g ${THIN}><path d="M${x} ${y} v-9" fill="none" stroke="#5a7a3a" stroke-width="1.8"/><circle cx="${x}" cy="${y - 11}" r="3.6" fill="${c}"/></g><circle cx="${x}" cy="${y - 11}" r="1.2" fill="#fff3c9"/>`).join("");
  const FLOWERS_A = [[30, 206, "#e0559a"], [64, 222, "#fff"], [112, 214, "#f4b942"], [236, 224, "#e0559a"], [290, 212, "#fff"], [338, 226, "#f4b942"], [372, 208, "#e0559a"]];
  // one floe of sea ice seen from a little above (x, y is the middle, w the width)
  const floe = (x, y, w) => `<g ${THIN}><ellipse cx="${x}" cy="${y + 3}" rx="${w / 2}" ry="${w * .13}" fill="#bfe6f7"/><ellipse cx="${x}" cy="${y}" rx="${w / 2}" ry="${w * .13}" fill="#fff"/></g>`;
  // a band of sea from y down, with floes: each floe is [x, y, w]
  const seaBand = (y, floes) => `<g ${INKED}><path d="M-10 ${y} H410 V250 H-10 Z" fill="#6cc0ea"/></g>${floes.map(([x, fy, w]) => floe(x, fy, w)).join("")}`;
  // a house on stilts: x is the left edge, y the ground the stilts stand on
  const stiltHouse = (x, y, w, h, wall, roof) => `<g ${INKED}><path d="M${x + 4} ${y - 12} V${y} M${x + w / 2} ${y - 12} V${y} M${x + w - 4} ${y - 12} V${y}" fill="none" stroke-width="3.4"/>
    <rect x="${x}" y="${y - 12 - h}" width="${w}" height="${h}" fill="${wall}"/><path d="M${x - 4} ${y - 12 - h} L${x + w / 2} ${y - 12 - h * 1.4} L${x + w + 4} ${y - 12 - h} Z" fill="${roof}"/>
    <rect x="${x + w * .4}" y="${y - 12 - h * .55}" width="${w * .2}" height="${h * .55}" fill="#fbf1dc"/><rect x="${x + w * .1}" y="${y - 12 - h * .75}" width="${w * .2}" height="${h * .3}" fill="#bfe6f7"/><rect x="${x + w * .7}" y="${y - 12 - h * .75}" width="${w * .2}" height="${h * .3}" fill="#bfe6f7"/></g>`;
  // a whaling ship with three masts and square sails (x is the middle, y the water line)
  const whaleShip = (x, y, s) => `<g transform="translate(${x} ${y}) scale(${s})" ${THIN}>
    ${[-26, 0, 26].map((m, i) => `<path d="M${m} -10 V${-62 - (i === 1 ? 12 : 0)}" fill="none" stroke="#5a3a1c" stroke-width="3"/>`).join("")}
    ${[-26, 0, 26].map((m, i) => `<rect x="${m - 11}" y="${-58 - (i === 1 ? 12 : 0)}" width="22" height="14" fill="#fbf1dc"/><rect x="${m - 11}" y="${-42 - (i === 1 ? 12 : 0)}" width="22" height="14" fill="#f3e6cf"/>`).join("")}
    <path d="M-46 -12 H46 L36 8 H-36 Z" fill="#7a4a24"/><path d="M-44 -6 H44" fill="none" stroke="#e8c58a" stroke-width="2"/></g>`;
  // a bowhead whale's back, and its tail lifted above the water (x, y is the water line)
  const whaleBack = (x, y, s) => `<g transform="translate(${x} ${y}) scale(${s})" ${THIN}><path d="M-34 0 Q-20 -22 6 -18 Q26 -14 34 0 Z" fill="#3b4660"/><path d="M-8 -17 q3 -5 7 -2" fill="none" stroke="#9fb6d0" stroke-width="2"/></g>`;
  const whaleTail = (x, y, s) => `<g transform="translate(${x} ${y}) scale(${s})" ${THIN}><path d="M-4 0 Q-3 -14 0 -24 Q3 -14 4 0 Z" fill="#3b4660"/><path d="M0 -24 Q-14 -24 -22 -38 Q-10 -34 0 -30 Q10 -34 22 -38 Q14 -24 0 -24 Z" fill="#3b4660"/></g>`;
  // a small weather station: a white slatted box on legs, with a wind vane on a pole (x is the middle, y the ground)
  const wxStation = (x, y, s) => `<g transform="translate(${x} ${y}) scale(${s})" ${THIN}><path d="M-12 -18 L-17 0 M12 -18 L17 0" fill="none" stroke-width="3.2"/><path d="M0 -42 V-62" fill="none" stroke-width="2.6"/>
    <rect x="-16" y="-42" width="32" height="24" rx="2" fill="#fff"/><path d="M-16 -37 H16 M-16 -32 H16 M-16 -27 H16 M-16 -22 H16" fill="none" stroke="#9fb6d0" stroke-width="1.6"/>
    <path d="M-14 -62 H8" fill="none" stroke-width="2.4"/><path d="M8 -67 L17 -62 L8 -57 Z" fill="#e63946"/><path d="M-14 -66 L-8 -62 L-14 -58 Z" fill="#e63946"/></g>`;
  // someone testing the ice with a long measuring pole (x, y as for person), the pole standing in a small hole
  const poleUser = (x, y, s) => `<ellipse cx="${x + 18 * s}" cy="${y + 50 * s}" rx="${9 * s}" ry="${3 * s}" fill="#1d4a6a"/>${person(x, y, s, "#b03a2e")}<path d="M${x + 7 * s} ${y + 8 * s} L${x + 18 * s} ${y + 2 * s}" fill="none" stroke="#2b1a10" stroke-width="${6 * s}" stroke-linecap="round"/><path d="M${x + 7 * s} ${y + 8 * s} L${x + 18 * s} ${y + 2 * s}" fill="none" stroke="#b03a2e" stroke-width="${3.4 * s}" stroke-linecap="round"/>
    <path d="M${x + 18 * s} ${y - 34 * s} V${y + 50 * s}" fill="none" stroke="#2b1a10" stroke-width="${5 * s}" stroke-linecap="round"/><path d="M${x + 18 * s} ${y - 34 * s} V${y + 50 * s}" fill="none" stroke="#c89a5e" stroke-width="${2.6 * s}" stroke-linecap="round"/>`;
  // a string of flags between two points (the string sags a little)
  const bunting = (x1, x2, y, cols) => `<path d="M${x1} ${y} Q${(x1 + x2) / 2} ${y + 14} ${x2} ${y}" fill="none" stroke="#2b1a10" stroke-width="1.6"/>${cols.map((c, i) => { const t = (i + 1) / (cols.length + 1), px = x1 + (x2 - x1) * t, py = y + 28 * t * (1 - t); return `<path d="M${px.toFixed(1)} ${py.toFixed(1)} h10 l-5 10 z" fill="${c}" ${THIN}/>`; }).join("")}`;

  // the window into the past, look 1 (about 1850 to 1914): a whaling ship among the ice floes, a bowhead whale, and Inuit on the ice
  const twLong1 = `<rect width="400" height="240" fill="#dff1f7"/>${cloud(250, 62, .5)}<g ${INKED}><path d="M130 112 Q236 102 342 112 V250 H130 Z" fill="#6cc0ea"/></g>
    ${floe(176, 126, 44)}${floe(300, 122, 40)}${floe(210, 176, 56)}${floe(286, 180, 46)}${whaleShip(238, 130, .78)}${whaleTail(184, 166, .7)}${whaleBack(298, 158, .8)}
    ${person(206, 150, .42, "#c98f58")}${person(222, 152, .4, "#b98b54")}`;
  // the window, look 2 (1999): a summer gathering in a community, flags and people, an inuksuk
  const twLong2 = `<rect width="400" height="240" fill="#fdebd0"/>${sun(214, 60, 16)}<g ${INKED}><path d="M130 124 Q236 110 342 124 V250 H130 Z" fill="#b7c98a"/></g>
    ${stiltHouse(166, 132, 36, 24, "#e0533d", "#3b5b8c")}${stiltHouse(286, 134, 34, 22, "#3b82c4", "#c0453a")}${inuksuk(250, 140, .55)}${bunting(186, 304, 90, ["#e63946", "#f4b942", "#3b82c4", "#58b368", "#e0559a"])}
    ${person(188, 152, .5, "#2aa7a0")}${person(210, 156, .5, "#f4b942")}${person(232, 158, .5, "#e0559a")}${person(268, 156, .5, "#3b82c4")}${person(292, 152, .5, "#c0453a")}${person(248, 172, .46, "#58b368")}`;

  Object.assign(ART, {
    tw_arrive: () => frame(`${warmSky(310, 150, [[70, 40, .8], [220, 30, .6]])}${seaBand(150, [[60, 160, 50], [120, 166, 36], [190, 158, 44]])}${tundra(172)}${stiltHouse(250, 196, 36, 22, "#e0533d", "#3b5b8c")}${stiltHouse(300, 198, 40, 24, "#f4b942", "#8a5a2b")}${stiltHouse(350, 196, 34, 22, "#3b82c4", "#c0453a")}${flowers(FLOWERS_A)}${riding(120, 0, 120)}`),
    tw_meet: () => frame(`${warmSky(300, 126, [[80, 36, .7]])}${seaBand(126, [[330, 134, 40]])}${tundra(156)}${stiltHouse(200, 168, 36, 22, "#e0533d", "#3b5b8c")}${stiltHouse(250, 168, 40, 24, "#f4b942", "#8a5a2b")}${flowers(FLOWERS_A)}${inuksuk(344, 200, .8)}${owlAt(54, 118, 108)}${nina(160, 142, 1.05)}`),
    tw_window1: () => frame(`${sky("#cfe0f2", "#f4f1d8", null, [[60, 40, .7]])}${tundra(190, "#b7c98a", "#a3b878")}${windowAt(236, 112, 92, twLong1)}${owlAt(18, 118, 108)}${nina(118, 150, .95)}`),
    tw_today: () => frame(`${warmSky(80, 126, [[250, 36, .7]])}${seaBand(126, [[50, 134, 46], [130, 140, 34], [220, 132, 40], [320, 140, 50]])}${tundra(166)}${stiltHouse(196, 204, 46, 30, "#e0533d", "#3b5b8c")}${stiltHouse(252, 202, 50, 32, "#f4b942", "#8a5a2b")}<g transform="rotate(6 335 190)">${stiltHouse(312, 204, 46, 30, "#3b82c4", "#c0453a")}</g>${flowers([[30, 226, "#e0559a"], [100, 232, "#fff"], [380, 226, "#f4b942"]])}${owlAt(18, 122, 104)}${nina(120, 146, 1)}`),
    tw_window2: () => frame(`${sky("#cfe0f2", "#f4f1d8", null, [[60, 40, .7]])}${tundra(190, "#b7c98a", "#a3b878")}${windowAt(236, 112, 92, twLong2)}${owlAt(18, 118, 108)}${nina(118, 150, .95)}`),
    tw_choice: () => frame(`${warmSky(310, 130, [[80, 36, .7]])}${seaBand(130, [[60, 140, 44], [150, 138, 36], [240, 136, 42]])}${tundra(158)}${qamutiik(60, 206, .9)}${wxStation(330, 208, 1)}${flowers([[110, 224, "#fff"], [300, 226, "#e0559a"], [372, 224, "#f4b942"]])}${owlAt(130, 146, 84)}${nina(236, 164, .8)}`),
    tw_ice: () => frame(`${warmSky(300, 100, [[80, 36, .7]])}${seaBand(110, [[60, 120, 40], [150, 124, 50], [250, 118, 36], [350, 124, 44]])}<g ${INKED}><path d="M-10 160 Q100 148 200 158 T410 154 V250 H-10 Z" fill="#f4fbff"/><path d="M-10 204 Q140 192 270 202 T410 198 V250 H-10 Z" fill="#e6f0fa"/></g>${inuksuk(60, 170, .6)}${poleUser(312, 148, 1.15)}${owlAt(20, 126, 100)}${nina(160, 146, 1)}`),
    tw_station: () => frame(`${warmSky(310, 126, [[80, 36, .7]])}${seaBand(126, [[60, 134, 40], [160, 138, 30]])}${tundra(154)}${stiltHouse(300, 178, 70, 40, "#e0533d", "#3b5b8c")}${wxStation(250, 214, 1.5)}${flowers([[30, 224, "#e0559a"], [90, 232, "#fff"], [200, 230, "#f4b942"]])}${owlAt(24, 124, 104)}${nina(140, 146, 1)}`),
    tw_goodbye: () => frame(`${warmSky(90, 140, [[60, 40, .7], [250, 56, .6]])}${seaBand(140, [[40, 150, 46], [130, 154, 34], [330, 148, 50]])}${tundra(168)}${inuksuk(350, 210, .8)}${flowers([[30, 226, "#e0559a"], [200, 230, "#fff"], [290, 226, "#f4b942"]])}${nina(76, 146, 1)}${riding(240, 18, 112)}`)
  });

  Object.assign(ASK, {
    tw_temps() { // integers and rational numbers: changes, means and differences of temperatures
      const kind = rand(3);
      if (kind === 0) { const a = pick([-30, -28, -24, -22, -18]), d = pick([4.5, 6.5, 8.5, 9.5, 11.5]), b = a + d;
        return { html: "", text: `In Nina's winter notebook the thermometer read <b>${tf(a)}°C</b> at dawn and <b>${tf(b)}°C</b> by afternoon. By how many degrees did it rise?`, choices: textCards(`${fx(d)}°C`, [Math.abs(a) + Math.abs(b), d + 1, d - 1, Math.abs(b), d + 2].map(v => `${fx(v)}°C`)), why: `${tf(b)} − (${tf(a)}) = ${fx(d)}. It rose ${fx(d)} degrees.` }; }
      if (kind === 1) { const m = pick([-30, -27, -24, -21, -18, -15, -12]), x = pick([3, 6, 9]), y = pick([-3, 0, 3]), a = m + x, b = m + y, c = m - x - y;
        return { html: "", text: `Nina writes down three winter mornings: <b>${tf(a)}°C</b>, <b>${tf(b)}°C</b> and <b>${tf(c)}°C</b>. What is the mean (the average) temperature?`, choices: textCards(`${tf(m)}°C`, [3 * m, -m, m + 3, m - 3, m + 1].map(v => `${tf(v)}°C`)), why: `The three add up to ${tf(3 * m)}. ${tf(3 * m)} ÷ 3 = ${tf(m)}°C.` }; }
      const hi = pick([5, 8, 10, 12]), lo = pick([-35, -32, -30, -28]), diff = hi - lo;
      return { html: "", text: `The warmest afternoon last July was <b>${hi}°C</b>. The coldest morning last February was <b>${tf(lo)}°C</b>. How many degrees apart are they?`, choices: cards(diff, [Math.abs(lo) - hi, diff + 10, diff - 10, Math.abs(lo), diff + 5]), why: `${hi} − (${tf(lo)}) = ${hi} + ${-lo} = ${diff} degrees.` };
    },
    tw_trend() { // reading data: tapping a point on the trend, predicting, and reading a scatter plot
      const kind = rand(3), LINE = [0.5, 2];
      if (kind === 0) { const x0 = pick([4, 6, 8]), y = 2 + x0 / 2, wrong = { 4: [1, 7, 9], 5: [2, 8, 10], 6: [3, 9, 1] }[y], ys = shuffle([y, ...wrong]), right = ys.indexOf(y), spots = ys.map(v => [x0, v]);
        return { tap: true, html: graph({ xmax: 10, ymax: 10, xstep: 2, ystep: 1, xl: "Year", yl: "Weeks of open water", line: LINE, dots: [[1, 3], [3, 3.5], [5, 4.5], [7, 5.5], [9, 7]], spots }), text: `A made-up example: weeks of open water in the bay each summer. The red line shows the trend. Tap the point that fits the trend in year <b>${x0}</b>.`, choices: spots.map((s, i) => ({ pick: String(i), ok: i === right })), why: `At year ${x0} the red line is at ${y} weeks, so that is the point that fits the trend.` }; }
      if (kind === 1) { const x1 = pick([12, 14, 16]), v = 7 + (x1 - 10) / 2;
        return { html: graph({ xmax: 10, ymax: 10, xstep: 2, ystep: 1, xl: "Year", yl: "Weeks of open water", line: LINE, dots: [[1, 3], [3, 3.5], [5, 4.5], [7, 5.5], [9, 7]] }), text: `A made-up example: the red line shows weeks of open water in the bay. It keeps rising the same way each year. How many weeks in year <b>${x1}</b>?`, choices: cards(v, [v - 1, v + 1, v + 2, x1, v - 2]), why: `Each year adds half a week. Year 10 is 7 weeks, so year ${x1} is 7 + ${(x1 - 10) / 2} = ${v}.` }; }
      const s = pick([1, 2]), steps = [pick([1, 1, 2]), pick([1, 1, 2]), pick([1, 1, 2]), pick([1, 1, 2])], ys = [s]; steps.forEach(k => ys.push(ys[ys.length - 1] + k));
      const ans = ys[4] - ys[0];
      return { html: graph({ xmax: 10, ymax: 10, xstep: 2, ystep: 1, xl: "Year", yl: "Weeks of open water", dots: ys.map((v, i) => [i * 2, v]) }), text: `A made-up example: weeks of open water in the bay. By how many weeks did it grow from year <b>0</b> to year <b>8</b>?`, choices: cards(ans, [ys[4], ys[0], ans + 1, ans - 1, ans + 2]), why: `Year 8 shows ${ys[4]} weeks and year 0 shows ${ys[0]}. ${ys[4]} − ${ys[0]} = ${ans} weeks.` };
    },
    tw_case(g) { // the case file: how fast the sea ice thins, how thick it will be, and when it is too thin to travel on
      const c = (g && g.case) || {};
      if (!c.set) { c.set = true; c.r = pick([4, 5, 6, 8]); c.w = pick([2, 3, 4]); c.n = pick([1, 2, 3]); c.m = pick([2, 3, 4, 5]); c.S = pick([30, 40, 50]);
        c.T2 = c.S + c.r * c.m; c.T1 = c.T2 + c.r * c.n; c.T0 = c.T1 + c.r * c.w; }
      const step = Math.min(2, g ? g.stars || 0 : rand(3));
      if (step === 0) {
        return { html: "", text: `Case file, step 1. Nina's uncle measures the sea ice with his pole: <b>${c.T0} cm</b> thick. <b>${c.w} weeks</b> later it is <b>${c.T1} cm</b>. How many centimetres does it thin each week, if it thins evenly?`, choices: cards(c.r, [c.r + 1, c.r - 1, c.r + 2, c.w, c.r * 2]), why: `${c.T0} − ${c.T1} = ${c.r * c.w} cm in ${c.w} weeks. ${c.r * c.w} ÷ ${c.w} = ${c.r} cm each week.` };
      }
      if (step === 1) {
        return { html: "", text: `Case file, step 2. The ice thins by <b>${c.r} cm</b> each week, and it is <b>${c.T1} cm</b> thick now. How thick will it be in <b>${c.n} more ${c.n === 1 ? "week" : "weeks"}</b>?`, choices: cards(c.T2, [c.T1 - c.r, c.T1 - c.n, c.T1 + c.r * c.n, c.T2 + c.r, c.T2 - c.r]), why: `It loses ${c.r} × ${c.n} = ${c.r * c.n} cm. ${c.T1} − ${c.r * c.n} = ${c.T2} cm.` };
      }
      return { html: "", text: `Case file, step 3. The ice is now <b>${c.T2} cm</b> thick and still thins <b>${c.r} cm</b> a week. Nina's uncle will only travel on ice thicker than <b>${c.S} cm</b>. In how many weeks will it reach ${c.S} cm?`, choices: cards(c.m, [c.m + 1, c.m - 1, c.m + 2, c.m * c.r, c.n]), why: `${c.T2} − ${c.S} = ${c.T2 - c.S} cm to lose. ${c.T2 - c.S} ÷ ${c.r} = ${c.m} weeks.` };
    },
    tw_last(g) { // follows the choice: the ice with Nina's uncle (0) or the weather station with Nina's class (1)
      const way = g && g.choice ? 1 : 0, kind = rand(3);
      if (way === 0) {
        if (kind === 0) { const r = pick([3, 4, 5, 6]), w = pick([3, 4, 5, 6, 7, 8]), S = pick([30, 40, 50]), T0 = S + r * w;
          return { html: "", text: `Nina's uncle works out the ice thickness after w weeks as <b>h = ${T0} − ${r}w</b>, with h in centimetres. After how many weeks (w) will h be <b>${S}</b>?`, choices: cards(w, [w + 1, w - 1, w + 2, r * w, S / r]), why: `${T0} − ${r}w = ${S}, so ${r}w = ${T0 - S}. w = ${T0 - S} ÷ ${r} = ${w}.` }; }
        if (kind === 1) { const sp = pick([8, 10, 12, 15]), h1 = pick([2, 3, 4]), t = pick([5, 6, 7]), d = sp * h1;
          return { html: "", text: `Nina's uncle's snowmobile pulls the qamutiik <b>${d} km</b> in <b>${h1} hours</b> at a steady speed. How far will it go in <b>${t} hours</b> at that speed?`, choices: cards(sp * t, [d + t, d * t, sp + t, sp * t + sp, sp * t - sp]), why: `${d} ÷ ${h1} = ${sp} km each hour. ${sp} × ${t} = ${sp * t} km.` }; }
        const r = pick([3, 4, 5, 6, 8]), a = pick([1, 2]), b = a + pick([2, 3, 4]), hA = pick([90, 100, 110, 120]), hB = hA - r * (b - a);
        return { html: "", text: `The pole read <b>${hA} cm</b> in week <b>${a}</b> and <b>${hB} cm</b> in week <b>${b}</b>. What is the rate of change of the ice thickness?`, choices: textCards(`−${r} cm per week`, [`${r} cm per week`, `−${r + 1} cm per week`, `−${r - 1} cm per week`, `−${r * 2} cm per week`, `−${r + 2} cm per week`]), why: `Change: ${hB} − ${hA} = −${hA - hB} cm in ${b - a} weeks. −${hA - hB} ÷ ${b - a} = −${r} cm per week.` };
      }
      const DEV = pick([[-3, -1, 0, 1, 3], [-4, -2, 1, 2, 3], [-5, -1, 0, 2, 4], [-2, -2, 0, 1, 3]]), m = pick([-4, -2, 1, 3, 5]), rd = DEV.map(d => m + d), list = shuffle(rd.slice()).map(v => `${tf(v)}°C`).join(", ");
      if (kind === 0) {
        return { html: "", text: `The class weather station read <b>${list}</b> on five summer mornings. What is the mean temperature?`, choices: textCards(`${tf(m)}°C`, [m + 1, m - 1, m + 2, m - 2, -m].map(v => `${tf(v)}°C`)), why: `The deviations add to 0, so the five readings add to ${tf(5 * m)}. ${tf(5 * m)} ÷ 5 = ${tf(m)}°C.` };
      }
      if (kind === 1) { const hi = Math.max(...rd), lo = Math.min(...rd), range = hi - lo;
        return { html: "", text: `The class weather station read <b>${list}</b> on five summer mornings. What is the range (highest minus lowest)?`, choices: cards(range, [range + 1, range - 1, range + 2, range * 2, Math.abs(hi)]), why: `Highest ${tf(hi)}, lowest ${tf(lo)}. ${tf(hi)} − (${tf(lo)}) = ${range} degrees.` }; }
      const A = pick([20, 40, 60, 80, 100]), p = pick([10, 20, 25, 50]), B = A + A * p / 100;
      return { html: "", text: `Imagine Nina's class counts <b>${A}</b> days of open water in the bay one year and <b>${B}</b> days the next. What is the percent increase?`, choices: textCards(`${p}%`, [p + 10, p + 5, p - 5, B - A, 100 - p].map(v => `${v}%`)), why: `It grew by ${B} − ${A} = ${B - A} days. ${B - A} ÷ ${A} = ${p / 100}, which is ${p}%.` };
    }
  });

  // READERS: Inuit readers from Nunavut (and Inuit Tapiriit Kanatami or Nunavut Tunngavik guidance if available) should read this chapter before it is used with children.
  // FACT CHECK: Nakurmiik is the Inuktitut word for thank you, as in Grade 5. Check the spelling and how it is written for the dialect of the readers' community (the Grade 5 story gives the sound as na-koor-MEEK).
  // FACT CHECK: Nunavut means "our land" in Inuktitut. The Nunavut Land Claims Agreement was signed in 1993, and Nunavut became a territory of Canada on 1 April 1999. Inuit govern it (most of its people are Inuit), and Inuktitut is one of its official languages (Inuinnaqtun and the other official languages are not named in the story).
  // FACT CHECK: The Arctic is warming about three to four times faster than the rest of the world (estimates vary by study and period, roughly 2 to 4 times, with recent work often saying nearly 4). The story says "three to four times" as the brief gave it.
  // FACT CHECK: Sea ice forms later in the fall and breaks up earlier in the spring across much of the Arctic, which makes travel and hunting on the ice less safe. Permafrost is thawing, which shifts buildings and roads. Check that the story is true of the community's own coast.
  // FACT CHECK: Whaling ships from Britain and America hunted bowhead whales in the Arctic through the 1800s, and traders followed for fox furs. Inuit hunted, guided and sewed warm clothing for the newcomers. The bowhead was hunted to very low numbers and its population has recovered only partly. Bowhead whales still live in the Arctic today. The story gives no numbers.
  // FACT CHECK: Sicknesses brought by the whalers and traders (diseases Inuit had not met before) killed many Inuit in the late 1800s and early 1900s. The story gives no numbers and no named sicknesses.
  // FACT CHECK: In the Arctic summer, the midnight sun (the sun staying above the horizon for 24 hours) lasts for weeks. The story does not say how many weeks, because it depends on the latitude. Sea ice can still be present in early summer on the Arctic coast while the sun shines day and night.
  // FACT CHECK: Houses on stilts (or on gravel pads or posts) are used in many northern communities so that heat from the house does not melt the permafrost. The story only says the stilts lift houses off the ground, and that the ground is frozen.
  // FACT CHECK: A weather station box is a white slatted shelter (a Stevenson screen) that lets air in and keeps sun off the thermometer. The wind vane on the pole is a simple weather vane.
  // FACT CHECK: Scientists work together with Inuit hunters and elders, whose knowledge (called Inuit Qaujimajatuqangit) goes back much further than any instrument. The story does not use the Inuktitut term because the spelling and the meaning of it should be checked by the readers.
  // FACT CHECK: The ice measurements, the thinning rates and the safe thickness in the case file are story numbers for practising maths, not safety advice. Real ice safety comes from the knowledge of hunters and elders.
  // FACT CHECK: The graphs say they are made-up examples (weeks of open water in a bay), not real data.
  // FACT CHECK: French words: le soleil de minuit (the midnight sun), le nord (the north), le pergélisol (the permafrost), la glace (the ice), la météo (the weather).
  // NOT DRAWN: the flag of Nunavut was left out on purpose, because it could not be drawn simply and correctly.
  CHAPTERS[5] = { title: "The Top of the World", where: "Nunavut", beats: [
    { art: "tw_arrive", word: ["le soleil de minuit", "the midnight sun"], say: ["The clock points north and the balloon climbs. We leave the Klondike and the gold rush behind. We cross the Northwest Territories, and then we pass the tree line, where it is too cold for trees to grow.",
      "After that the land is wide, flat and open. This is <em>Nunavut</em>. By my pocket watch it is the middle of the night, and the sun is still up! In summer here the sun does not set for weeks.",
      "In French it is <em>le soleil de minuit</em>, the midnight sun. It rolls along the edge of the sky and never quite goes down. My owl eyes cannot decide whether to sleep. And somebody on the shore is waving at us."] },
    { art: "tw_meet", word: ["le nord", "the north"], say: ["It is Nina! Last time I saw her it was dark winter, and she showed me the iglu, the qulliq and the qamutiik. She is a few years older now and taller too. I am so delighted I jump up and down.",
      "I talk for a whole minute without stopping. Nina waits politely until I finish. Then she says, <em>You still talk too much, Dr. Somebody.</em> She is right. I am very pleased to see her anyway.",
      "This time it is summer, the opposite season. Flowers cover the tundra, and the ice in the bay is breaking up. Nina's home is far up in <em>le nord</em>, the north. Clock, show us what came before!"] },
    { art: "tw_window1", say: ["The window into the past! It is about <em>1850</em>. For thousands of years Inuit have lived here by their own knowledge of the ice, the animals and the weather. They know where the whales swim and when the ice can be trusted.",
      "Now ships come north from Britain and America each summer, looking for <em>bowhead whales</em>. Traders follow them, looking for fox furs. Inuit work with the newcomers as hunters and guides, and they sew warm clothing.",
      "Without that help the newcomers could not have survived in the Arctic. But the whalers kill so many bowhead whales that almost none are left. They also bring sicknesses that Inuit have never met, and many people die.",
      "I go quiet, and so does Nina. Then she says that her people are still here, and the bowhead whales are still here too. We look at some numbers, because numbers help us see what is happening now."] },
    { ask: "tw_temps", intro: "Nina has some temperature puzzles from her winter notebook, with a lot of minus signs. Three right answers and we go for a walk through her town. Each right answer also earns you a piece of gold dust." },
    { art: "tw_today", word: ["le pergélisol", "the permafrost"], say: ["Back in the present, Nina walks me through town. The houses are painted red, yellow and blue, and they stand on <em>stilts</em>, tall legs that lift them off the ground. One of them is leaning a little. I lean too, to see how it feels.",
      "The ground under the town is frozen all year. It is called <em>permafrost</em>, le pergélisol in French. Now the permafrost is thawing, so the ground shifts, and buildings and roads can tilt and crack.",
      "The Arctic is warming about <em>three to four times faster</em> than the rest of the world. The sea ice forms later in the fall and breaks up earlier in the spring. That makes travelling and hunting on it less safe. Animals are changing where they go too.",
      "Nina's uncle and the elders have watched all of this for decades. Scientists now work with them, because what Inuit know goes back much further than any instrument. Nina says it is time to look at some data."] },
    { ask: "tw_trend", intro: "Nina has some graphs to read. They are made-up examples, but they show the kind of trend scientists look for. Three right answers opens the window again." },
    { art: "tw_window2", word: ["Nunavut", "our land (Inuktitut)"], say: ["The window again, and this time it is <em>1999</em>. Inuit leaders worked for many years for this. The Nunavut land claim was signed in 1993, and now a whole territory is celebrating. Nina's grandmother remembers this day.",
      "On <em>1 April 1999</em>, Nunavut became Canada's newest territory. <em>Nunavut</em> means <em>our land</em> in Inuktitut. Inuit govern it, and Inuktitut is one of its official languages.",
      "Nina says that now the people who live in Nunavut make the big decisions about their own land. Everyone in the picture is dancing. I ask if there is cake. There is always cake."] },
    { ask: "tw_case", intro: "Nina's uncle has a puzzle about the sea ice. This is a case file with three steps, and each step uses the answer from the one before. Three right answers in a row solve the case." },
    { art: "tw_choice", pick: "The sun is still up, and it is time to choose. Nina's uncle is going out on the sea ice to check how thick it is with a long measuring pole, and we are invited. Or we could help Nina's class with the weather station outside the school. Which shall it be?", options: [
      { label: "Go out on the ice with Nina's uncle", art: "tw_ice", word: ["la glace", "the ice"], say: ["Nina's uncle knows this ice well. He tests it carefully before every step, and we follow exactly in his footsteps. He pushes a long pole down through a small hole and reads the thickness in centimetres.",
        "The numbers tell him whether the ice can be trusted, and where it can be crossed. Ice in French is <em>la glace</em>. I keep my wings out for balance. Nina says I look like a very nervous airplane."] },
      { label: "Help Nina's class with the weather station", art: "tw_station", word: ["la météo", "the weather"], say: ["Nina's class keeps a small weather station outside the school. It is a white box with slats on four legs, and a wind vane on a pole. The slats let the air in and keep the sun off the thermometer.",
        "Every morning someone writes down the temperature, and now there is a long list of numbers to work with. The weather in French is <em>la météo</em>. I am in charge of the pencil. Nina is in charge of me."] }] },
    { ask: "tw_last", intro: "Nina has some last puzzles from our adventure. Three right answers and we say goodbye." },
    { art: "tw_goodbye", word: ["nakurmiik", "thank you (Inuktitut)"], say: ["The sun is still up, and I realize that I have been here a whole day without noticing. This is the farthest north the balloon will go. At the top of the world, every direction points south.",
      "Nina says the next place I should go is home. The clock agrees. Its hand swings round to the south and east, all the way back to where the journey began, the Grand River. Nina says I can visit again, but I must talk less.",
      "Nakurmiik, Nina, for the iglu in winter, the ice in summer, and for telling it plainly. The balloon rises over the flowers and the floes. Next we go <em>Home</em>. Tick tock!"] }
  ] };
}
