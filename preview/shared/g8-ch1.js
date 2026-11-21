"use strict";
// Grade 8, Chapter 1: The Last Spike. Dr. Somebody climbs into the Rocky Mountains of British Columbia and meets Mei of Revelstoke. How a railway climbs, and the building of the Canadian Pacific Railway told in two voices.
{
  const GUIDE = WHO.mei; // Mei: long dark hair and a red hoodie

  // ---------- my own drawing pieces ----------
  // a sharp mountain: x is the middle, y the foot, w the width, h the height, with a snowy top
  const peak = (x, y, w, h, c) => `<g ${INKED}><path d="M${x - w / 2} ${y} L${x - w * .08} ${y - h * .82} L${x} ${y - h} L${x + w * .1} ${y - h * .86} L${x + w / 2} ${y} Z" fill="${c || "#8fa3b8"}"/></g>
    <path d="M${x - w * .18} ${y - h * .62} L${x - w * .08} ${y - h * .82} L${x} ${y - h} L${x + w * .1} ${y - h * .86} L${x + w * .22} ${y - h * .6} L${x + w * .1} ${y - h * .68} L${x} ${y - h * .55} L${x - w * .1} ${y - h * .66} Z" fill="#fff" ${THIN}/>`;
  const peaks = () => `${peak(330, 164, 170, 100, "#a3b4c6")}${peak(80, 164, 160, 90, "#a3b4c6")}${peak(200, 164, 200, 128, "#8fa3b8")}${peak(300, 164, 130, 84, "#7d93ab")}`;
  // dark evergreen slopes at the foot of the mountains
  const slopes = () => `<g ${INKED}><path d="M-10 168 Q60 140 130 160 Q200 128 270 156 Q340 136 410 156 V250 H-10 Z" fill="#2f6f4a"/></g>${[[30, 166, .9], [56, 160, .7], [96, 164, .8], [150, 158, .7], [240, 154, .8], [290, 160, .7], [352, 156, .9], [384, 162, .7]].map(([x, y, s]) => pine(x, y, s, "#245c3c")).join("")}`;
  const alpine = () => `${peaks()}${slopes()}`;
  const meadow = `<g ${INKED}><path d="M-10 176 Q130 164 250 174 T410 168 V250 H-10 Z" fill="#8cc084"/></g>`;
  // a straight piece of railway track across the picture (y is the upper rail)
  const track = y => `<g stroke="#6a4a2a" stroke-width="3" stroke-linecap="round">${Array.from({ length: 29 }, (_, i) => `<path d="M${i * 14 - 4} ${y - 1} V${y + 8}"/>`).join("")}</g><g stroke="#2b1a10" stroke-width="2.6" stroke-linecap="round" fill="none"><path d="M-10 ${y} H410 M-10 ${y + 6} H410"/></g>`;
  const wheel = (cx, r) => `<circle cx="${cx}" cy="${-r}" r="${r}" fill="#55555c"/>`;
  // a modern freight train facing right: a red locomotive and n cars (y is the rail)
  const freight = (x, y, s, n) => `<g transform="translate(${x} ${y}) scale(${s})" ${INKED}>${Array.from({ length: n }, (_, i) => { const cx = -48 - i * 46; return `<rect x="${cx - 20}" y="-26" width="42" height="21" fill="${["#b5532f", "#3b6ea5", "#8a6238", "#d9a21b"][i % 4]}"/><path d="M${cx - 20} -18 H${cx + 22}" fill="none" stroke-width="1.4"/>${wheel(cx - 12, 4)}${wheel(cx + 14, 4)}`; }).join("")}
    <rect x="-22" y="-28" width="52" height="24" rx="3" fill="#d62839"/><rect x="14" y="-40" width="16" height="13" rx="2" fill="#f1ddb5"/><rect x="18" y="-37" width="8" height="7" fill="#bfe6f7"/><path d="M-22 -14 H30" fill="none" stroke="#ffd84d" stroke-width="3"/>${wheel(-12, 4.5)}${wheel(4, 4.5)}${wheel(20, 4.5)}</g>`;
  // a steam locomotive and its tender, facing right, as in 1885 (y is the rail)
  const steam = (x, y, s) => `<g transform="translate(${x} ${y}) scale(${s})" ${INKED}><rect x="-66" y="-24" width="28" height="18" fill="#2b2b2b"/><rect x="-36" y="-44" width="20" height="38" rx="2" fill="#7a2a22"/><rect x="-32" y="-38" width="12" height="10" fill="#bfe6f7"/><rect x="-20" y="-30" width="46" height="22" rx="8" fill="#3a3a3f"/>
    <path d="M12 -30 L10 -42 H22 L20 -30 Z" fill="#2b2b2b"/><path d="M6 -42 H26 L22 -48 H10 Z" fill="#2b2b2b"/><path d="M26 -10 L40 0 H24 Z" fill="#8d877b"/><rect x="-20" y="-8" width="46" height="4" fill="#55555c"/>${wheel(-24, 8)}${wheel(-4, 8)}${wheel(14, 6)}${wheel(-58, 4.5)}${wheel(-44, 4.5)}
    <g fill="#fff" stroke-width="1.6"><circle cx="16" cy="-58" r="7"/><circle cx="26" cy="-70" r="9"/><circle cx="40" cy="-80" r="8"/></g></g>`;
  // plain figures: the same simple person for everyone, with a hat or a shovel when needed
  const suit = (x, y, s, coat) => `${person(x, y, s, coat || "#33343c")}<g transform="translate(${x} ${y}) scale(${s})" ${THIN}><rect x="-11" y="-19" width="22" height="3.4" rx="1.7" fill="#1d1a22"/><rect x="-6.5" y="-28" width="13" height="10" rx="2.5" fill="#1d1a22"/></g>`;
  const hammerMan = (x, y, s) => `${suit(x, y, s, "#2f3b4a")}<g transform="translate(${x} ${y}) scale(${s})" ${THIN}><path d="M8 4 L20 -22" fill="none" stroke="#8a5a2b" stroke-width="3.4"/><rect x="13" y="-34" width="16" height="9" rx="2" fill="#8d877b" transform="rotate(28 20 -26)"/></g>`;
  const digger = (x, y, s, top) => `${person(x, y, s, top)}<g transform="translate(${x} ${y}) scale(${s})" ${THIN}><path d="M7 8 L24 40" fill="none" stroke="#8a5a2b" stroke-width="2.8"/><path d="M21 38 L31 36 L30 48 L20 46 Z" fill="#8d877b"/></g>`;
  // a grey cliff face (x is the left foot, y the foot, w wide, h tall)
  const cliffWall = (x, y, w, h) => `<g ${INKED}><path d="M${x} ${y} L${x + w * .08} ${y - h * .7} L${x + w * .3} ${y - h} L${x + w * .7} ${y - h * .92} L${x + w * .94} ${y - h * .6} L${x + w} ${y} Z" fill="#a8a29a"/></g>
    <path d="M${x + w * .3} ${y - h * .85} V${y - h * .3} M${x + w * .55} ${y - h * .8} V${y - h * .2} M${x + w * .8} ${y - h * .65} V${y - h * .25}" fill="none" stroke="#6a655e" stroke-width="2" stroke-linecap="round"/>`;
  // a tunnel mouth in a cliff (x is the middle, y the ground)
  const tunnelMouth = (x, y, s) => `<g transform="translate(${x} ${y}) scale(${s})" ${INKED}><path d="M-38 0 V-32 Q-38 -62 0 -62 Q38 -62 38 -32 V0 Z" fill="#b9b3a6"/><path d="M-26 0 V-30 Q-26 -50 0 -50 Q26 -50 26 -30 V0 Z" fill="#1d1a22"/></g>`;
  // a stone cairn with a plaque (x is the middle, y the ground)
  const cairn = (x, y, s) => `<g transform="translate(${x} ${y}) scale(${s})" ${INKED}><path d="M-30 0 Q-32 -16 -22 -22 H22 Q32 -16 30 0 Z" fill="#a8a29a"/><path d="M-22 -22 Q-23 -36 -14 -40 H14 Q23 -36 22 -22 Z" fill="#bab4aa"/><path d="M-14 -40 Q-14 -50 -6 -52 H6 Q14 -50 14 -40 Z" fill="#a8a29a"/>
    <rect x="-11" y="-20" width="22" height="14" rx="2" fill="#d6b04a"/><path d="M-7 -16 H7 M-7 -11 H7" fill="none" stroke-width="1.4"/></g>`;
  // a wooden trestle bridge: a deck on legs with cross braces (x, y is the top left of the deck)
  const trestle = (x, y, w, h) => { const n = Math.max(2, Math.round(w / 30)), gp = w / n; let d = "";
    for (let i = 0; i <= n; i++) d += `M${x + i * gp} ${y + 6} V${y + h} `;
    for (let i = 0; i < n; i++) d += `M${x + i * gp} ${y + 6} L${x + (i + 1) * gp} ${y + h * .6} M${x + (i + 1) * gp} ${y + 6} L${x + i * gp} ${y + h * .6} `;
    return `<g fill="none" stroke-linecap="round"><path d="${d}" stroke="#2b1a10" stroke-width="5"/><path d="${d}" stroke="#a9703a" stroke-width="2.4"/></g><g ${INKED}><rect x="${x}" y="${y}" width="${w}" height="7" fill="#8a5a2b"/></g>`; };

  // ---------- the window into the past: building the railway, about 1881 to 1885 ----------
  const longAgo1 = `<rect width="400" height="240" fill="#f6e3b4"/>${peak(250, 132, 150, 80, "#a3b4c6")}<g ${INKED}><path d="M150 146 Q236 124 320 142 V200 H150 Z" fill="#5f8f5a"/></g>${pine(168, 142, .7, "#245c3c")}${pine(302, 138, .7, "#245c3c")}
    ${cliffWall(190, 156, 100, 62)}<g ${INKED}><path d="M150 156 H320 V176 H150 Z" fill="#a98a5e"/></g>${digger(178, 132, .55, "#7a8aa5")}${digger(214, 132, .55, "#8a6a4a")}${digger(250, 132, .55, "#6a8a7a")}${digger(288, 132, .55, "#a08060")}
    ${rock(196, 190, 40, 14)}${rock(256, 194, 34, 12)}`;

  // ---------- the pictures ----------
  Object.assign(ART, {
    ls_arrive: () => frame(`${sky("#9cc9e8", "#e8f0f4", null, [[250, 34, .7]])}${alpine()}${meadow}${track(188)}${freight(330, 190, .7, 3)}${riding(44, 26, 100)}`),
    ls_mei: () => frame(`${sky("#9cc9e8", "#e8f0f4", null, [[120, 32, .7], [290, 44, .6]])}${alpine()}${meadow}${track(176)}${freight(344, 178, .8, 2)}<g ${INKED}><path d="M-10 206 Q120 192 240 204 T410 198 V250 H-10 Z" fill="#7fae8a"/></g>${owlAt(24, 124, 104)}${kidAt(176, 146, 1, GUIDE)}`),
    ls_window1: () => frame(`${sky("#9cc9e8", "#e8f0f4", null, [[60, 40, .7]])}<g ${INKED}><path d="M-10 196 Q100 182 210 198 T410 196 V250 H-10 Z" fill="#7fae8a"/></g>${windowAt(236, 112, 92, longAgo1)}${owlAt(18, 118, 108)}${kidAt(118, 150, .95, GUIDE)}`),
    ls_today: () => frame(`${sky("#9cc9e8", "#e8f0f4", null, [[320, 34, .7]])}${peak(332, 226, 160, 120, "#a3b4c6")}<g ${INKED}><path d="M60 226 L150 62 L200 42 L262 82 L352 226 Z" fill="#3a7a58"/></g><path d="M150 62 L200 42 L262 82 L240 78 L222 92 L200 76 L176 92 L162 76 Z" fill="#fff" ${THIN}/>${pine(84, 220, .6, "#245c3c")}${pine(340, 220, .6, "#245c3c")}
      <g fill="none" stroke-linecap="round"><path d="M70 214 C180 208 280 204 320 186" stroke="#2b1a10" stroke-width="8"/><path d="M70 214 C180 208 280 204 320 186" stroke="#e8d9a8" stroke-width="4.4"/><path d="M190 112 C220 104 240 98 262 92" stroke="#2b1a10" stroke-width="8"/><path d="M190 112 C220 104 240 98 262 92" stroke="#e8d9a8" stroke-width="4.4"/>
      <path d="M320 186 C350 168 300 150 240 146 C170 140 150 126 190 112" stroke="#e8d9a8" stroke-width="3" stroke-dasharray="4 7"/></g>${tunnelMouth(320, 186, .4)}${tunnelMouth(190, 112, .35)}${freight(250, 203, .4, 3)}${riding(18, 20, 92)}`),
    ls_director: () => frame(`${sky("#cfe0f2", "#f4f1d8", null, [[90, 40, .7], [300, 32, .6]])}${alpine()}${meadow}${track(162)}${steam(345, 164, .7)}
      ${[[48, 128, 1.12, "#33343c"], [80, 126, 1.16, "#3d3a46"], [112, 128, 1.12, "#2f3b4a"], [150, 126, 1.16, "#403a34"], [232, 128, 1.12, "#33343c"], [266, 126, 1.16, "#3d3a46"]].map(([x, y, s, c]) => suit(x, y, s, c)).join("")}${hammerMan(190, 128, 1.16)}
      <g stroke="#6a4a2a" stroke-width="4" stroke-linecap="round">${[100, 130, 160, 190, 220, 250, 280].map(x => `<path d="M${x} 188 V200"/>`).join("")}</g><g stroke="#2b1a10" stroke-width="3" stroke-linecap="round"><path d="M92 190 H288 M92 197 H288"/></g><rect x="183" y="182" width="5" height="9" fill="#55555c" ${THIN}/>`),
    ls_worker: () => frame(`${sky("#cfe0f2", "#f4f1d8", null, [[300, 34, .7]])}${peak(300, 150, 170, 90, "#a3b4c6")}${peak(60, 150, 150, 70, "#a3b4c6")}<g ${INKED}><path d="M-10 150 Q120 130 230 148 T410 144 V250 H-10 Z" fill="#5f8f5a"/></g>${cliffWall(10, 176, 160, 100)}
      <g ${INKED}><path d="M-10 176 Q140 164 260 176 T410 170 V250 H-10 Z" fill="#a98a5e"/></g>${[286, 300, 314, 328, 342].map((x, i) => suit(x, 139, .32, ["#33343c", "#3d3a46", "#2f3b4a", "#403a34", "#33343c"][i])).join("")}${rock(210, 214, 44, 22)}${rock(252, 218, 30, 14)}${digger(96, 138, 1.8, "#7a8aa5")}`),
    ls_choice: () => frame(`${sky("#9cc9e8", "#e8f0f4", null, [[120, 32, .7], [300, 44, .6]])}${alpine()}${meadow}<g ${INKED}><path d="M110 204 Q160 150 220 154 Q250 160 262 204 Z" fill="#8cc084"/></g>
      <g fill="none" stroke-linecap="round"><path d="M126 204 Q160 192 190 178 Q208 168 214 158" stroke="#2b1a10" stroke-width="9"/><path d="M126 204 Q160 192 190 178 Q208 168 214 158" stroke="#d9c7a0" stroke-width="5"/></g>${cairn(214, 158, .5)}
      ${cliffWall(268, 178, 112, 80)}${tunnelMouth(324, 178, .85)}${track(182)}<g ${INKED}><path d="M-10 208 Q120 196 240 206 T410 200 V250 H-10 Z" fill="#7fae8a"/></g>${owlAt(20, 126, 104)}${kidAt(150, 146, 1, GUIDE)}`),
    ls_train: () => frame(`${sky("#9cc9e8", "#e8f0f4", null, [[110, 30, .7]])}${alpine()}${meadow}${cliffWall(170, 200, 230, 130)}${tunnelMouth(304, 198, 1.4)}${track(200)}${freight(262, 202, .9, 2)}<g ${INKED}><path d="M-10 214 Q100 204 200 214 T410 212 V250 H-10 Z" fill="#7fae8a"/></g>${owlAt(14, 126, 100)}${kidAt(128, 146, 1, GUIDE)}`),
    ls_trail: () => frame(`${sky("#9cc9e8", "#e8f0f4", null, [[110, 30, .7], [260, 40, .6]])}${alpine()}${meadow}<g fill="none" stroke-linecap="round"><path d="M-10 232 Q120 214 200 206 T250 200" stroke="#2b1a10" stroke-width="16"/><path d="M-10 232 Q120 214 200 206 T250 200" stroke="#d9c7a0" stroke-width="11"/></g>${pine(372, 200, 1.1, "#245c3c")}${pine(226, 190, .9, "#245c3c")}${cairn(292, 200, 1.7)}${owlAt(24, 124, 104)}${kidAt(150, 146, 1, GUIDE)}`),
    ls_goodbye: () => frame(`${sky("#ffd9a0", "#fdebd0", [70, 56, 20], [[240, 30, .6], [340, 50, .6]])}${peak(330, 172, 170, 96, "#c9a89a")}${peak(80, 172, 170, 90, "#c9a89a")}${peak(205, 172, 190, 110, "#b98f86")}${slopes()}
      <g ${INKED}><path d="M140 190 Q195 180 250 190 V250 H140 Z" fill="#6cc0ea"/></g><g ${INKED}><path d="M-10 170 H140 L150 250 H-10 Z" fill="#8a7a68"/><path d="M410 170 H250 L240 250 H410 Z" fill="#8a7a68"/></g><path d="M-10 170 H140 M250 170 H410" fill="none" stroke="#7fae8a" stroke-width="8"/>
      ${trestle(140, 170, 110, 50)}${track(164)}${balloonAt(170, 14, 84)}${owlAt(30, 126, 104)}${kidAt(310, 146, 1, GUIDE)}`)
  });

  // ---------- the questions ----------
  const money = n => "$" + fmt(n);
  const YEAR = { 50: 1885, 100: 1900, 500: 1903 }; // the year each head tax began
  Object.assign(ASK, {
    ls_climb() { // slope: a graph to tap, the grade as a percent, and how far a grade climbs
      const kind = rand(3);
      if (kind === 0) { const m = pick([3, 4]), x0 = pick([4, 5, 6]), R = [x0, m * x0], spots = shuffle([R, [x0, m * x0 + 10], [x0, m * x0 - 10], [x0 + 3, m * x0]]), right = spots.indexOf(R);
        return { tap: true, html: graph({ xmax: 10, ymax: 40, xstep: 1, ystep: 5, xl: "along (hundreds of m)", yl: "height (m)", line: [m, 0], spots }), text: `The red line is a track that climbs <b>${m} m</b> for every 100 m along. Tap the point on the track that is <b>${x0 * 100} m</b> along.`, choices: spots.map((s, i) => ({ pick: String(i), ok: i === right })), why: `${x0 * 100} m is ${x0} hundreds. ${x0} × ${m} = ${m * x0} m up, so the point is (${x0}, ${m * x0}).` }; }
      if (kind === 1) { const d = pick([200, 400, 500, 800]), p = pick([2, 3, 4, 5]), r = d * p / 100;
        return { html: "", text: `A track rises <b>${r} m</b> over a run of <b>${d} m</b>. The grade is rise ÷ run. What is the grade as a percent?`, choices: textCards(`${p}%`, [`${r}%`, `${p * 10}%`, `${p + 1}%`, `${p - 1}%`, `${p * 2}%`]), why: `${r} ÷ ${d} = ${r / d}, and as a percent that is ${p}%.` }; }
      const big = rand(2), g10 = big ? 45 : 22, d = big ? pick([200, 400, 1000]) : pick([500, 1000]), up = g10 * d / 1000;
      return { html: "", text: big ? `The first track over the Kicking Horse Pass, the Big Hill, had a grade of <b>4.5%</b>. How many metres up does it climb over a run of <b>${d} m</b>?` : `A railway is built to a gentle grade of <b>2.2%</b>. How many metres up does it climb over a run of <b>${d} m</b>?`,
        choices: textCards(`${up} m`, [`${up * 10} m`, `${up / 10} m`, `${g10 * d / 10} m`, `${up + 10} m`, `${up * 2} m`]), why: `${g10 / 10}% means ${g10 / 10} m up for every 100 m. ${d / 100} × ${g10 / 10} = ${up} m.` };
    },
    ls_hill() { // the Pythagorean theorem on the mountainside
      const [a0, b0, c0, mk] = pick([[3, 4, 5, 3], [5, 12, 13, 2], [8, 15, 17, 1], [6, 8, 10, 2]]), k = 1 + rand(mk), a = a0 * k, b = b0 * k, c = c0 * k, kind = rand(3);
      if (kind === 0) return { html: "", text: `A cable is stretched straight up a mountainside. It goes <b>${a} m</b> across and <b>${b} m</b> up. How long is the cable in metres?`, choices: cards(c, [a + b, c + 1, c - 1, c + 2, c * c]), why: `${a}² + ${b}² = ${a * a} + ${b * b} = ${c * c}, and the square root of ${c * c} is ${c}.` };
      if (kind === 1) return { html: "", text: `A rope <b>${c} m</b> long runs straight up a cliff to a ledge. Its bottom end is <b>${a} m</b> out from the foot of the cliff. How high is the ledge?`, choices: cards(b, [c - a, c + a, b + 1, b - 1, b * 2]), why: `${c}² − ${a}² = ${c * c} − ${a * a} = ${b * b}, and the square root of ${b * b} is ${b} m.` };
      return { html: "", text: `A path goes <b>${a} m</b> along a valley floor, then <b>${b} m</b> straight up. A new path cuts straight across. How many metres shorter is the new path?`, choices: cards(a + b - c, [c, a + b, a + b - c + 1, a + b - c + 2, (a + b - c) * 2]), why: `The straight path is √(${a * a} + ${b * b}) = ${c} m. Going round is ${a} + ${b} = ${a + b} m, so it saves ${a + b - c} m.` };
    },
    ls_pay(g) { // the case file: one worker's pay over a season, the food and gear he paid for, and the head tax (the numbers are made up for the maths)
      const c = (g && g.case) || {};
      if (!c.set) { c.set = true; c.weeks = pick([30, 40, 50]); c.tax = pick([50, 100, 500]); }
      const days = c.weeks * 6, cost = days * 4 / 10, keep = days - cost, step = g ? g.stars || 0 : rand(3);
      if (step === 0) return { html: "", text: `Suppose a worker works <b>6 days a week</b> for <b>${c.weeks} weeks</b> and is paid about <b>$1 a day</b>. How many dollars does he earn in the season?`, choices: textCards(money(days), [money(c.weeks), money(c.weeks + 6), money(days * 2), money(days - c.weeks), money(days + 100)]), why: `${c.weeks} weeks × 6 days = ${days} days. At $1 a day that is ${money(days)}.` };
      if (step === 1) return { html: "", text: `He buys his own food and gear. Suppose they cost <b>40 cents</b> for every day he works. After his ${days} days, how many dollars does he have left?`, choices: textCards(money(keep), [money(days - 40), money(cost), money(keep + 40), money(days - cost / 2), money(keep * 2)]), why: `Food and gear cost ${days} × 40 cents = ${money(cost)}. ${money(days)} − ${money(cost)} = ${money(keep)}.` };
      const n = Math.ceil(c.tax / keep);
      return { html: "", text: `In ${YEAR[c.tax]} the head tax for one person was <b>${money(c.tax)}</b>. He saves <b>${money(keep)}</b> a season. How many whole seasons must he work to save enough?`, choices: cards(n, [n + 1, n + 2, n - 1, Math.floor(c.tax / keep), n * 2]),
        why: n === 1 ? `One season saves ${money(keep)}, which is enough for ${money(c.tax)}.` : `${n - 1} seasons save ${money((n - 1) * keep)}, which is not enough. ${n} seasons save ${money(n * keep)}.` };
    },
    ls_last(g) { // 0: the train through the Spiral Tunnels (speed, time, length). 1: the trail to the cairn (distance, slope, time)
      const way = g && g.choice ? 1 : 0, kind = rand(3);
      if (way === 0) {
        if (kind === 0) { const v = pick([10, 15, 20]), kmh = v * 36 / 10;
          return { html: "", text: `Suppose a freight train climbs through a tunnel at <b>${kmh} km/h</b>. How many metres per second is that? (1 km is 1,000 m, and 1 hour is 3,600 s)`, choices: textCards(`${v} m/s`, [`${v + 5} m/s`, `${v - 5} m/s`, `${kmh / 6} m/s`, `${v * 2} m/s`, `${v + 10} m/s`]), why: `${kmh} km/h = ${fmt(kmh * 1000)} m in 3,600 s. ${fmt(kmh * 1000)} ÷ 3,600 = ${v} m/s.` }; }
        if (kind === 1) { const v = pick([10, 15, 20]), t = pick([40, 60, 90]), L = v * t;
          return { html: "", text: `A train enters a tunnel at <b>${v} m/s</b>. Its front takes <b>${t} s</b> to reach the far end. How long is the tunnel in metres?`, choices: cards(L, [v + t, L / 2, L * 2, L + 100, L - 100]), why: `Distance = speed × time = ${v} × ${t} = ${fmt(L)} m.` }; }
        const v = pick([10, 15, 20]), L = pick([600, 900, 1200]), tr = pick([300, 600]), t = (L + tr) / v;
        return { html: "", text: `A train <b>${tr} m</b> long goes through a tunnel <b>${L} m</b> long at <b>${v} m/s</b>. How many seconds from its front entering to its tail leaving?`, choices: cards(t, [L / v, tr / v, t + 10, t - 10, (L - tr) / v]), why: `The front must go ${L} + ${tr} = ${fmt(L + tr)} m. ${fmt(L + tr)} ÷ ${v} = ${t} s.` };
      }
      if (kind === 0) { const d = pick([2, 3, 6]), v = pick([3, 4, 6]), m = d * 60 / v;
        return { html: "", text: `The trail to the cairn is <b>${d} km</b> long. Walking at <b>${v} km/h</b>, how many minutes does the walk take?`, choices: cards(m, [d * v, 60 / v, m + 10, m - 10, m * 2]), why: `${d} km ÷ ${v} km/h = ${d}/${v} of an hour. Times 60 gives ${m} minutes.` }; }
      if (kind === 1) { const p = pick([5, 8, 10]), d = pick([200, 500, 1000]), up = p * d / 100;
        return { html: "", text: `The trail climbs at a grade of <b>${p}%</b>. How many metres higher are you after walking <b>${d} m</b> across the ground?`, choices: cards(up, [up + p, up - p, d / 100, up * 10, up / 2]), why: `${p}% means ${p} m up for every 100 m. ${d / 100} × ${p} = ${up} m.` }; }
      const gm = pick([20, 25, 30]), k = pick([3, 4, 5, 6]), H = gm * k;
      return { html: "", text: `On the steepest part, a hiker climbs <b>${gm} m</b> every <b>10 minutes</b>. How many minutes does it take to climb <b>${H} m</b>?`, choices: cards(k * 10, [k, k * 10 + 10, k * 10 - 10, H / 10, gm]), why: `${H} ÷ ${gm} = ${k} lots of 10 minutes, so ${k * 10} minutes.` };
    }
  });

  // FACT CHECK: British Columbia joined Canada in 1871 on the promise of a railway to the Pacific
  // FACT CHECK: the Canadian Pacific Railway was built through the Rocky Mountains and the Fraser Canyon between about 1881 and 1885, and the hardest construction was in British Columbia
  // FACT CHECK: about 15,000 Chinese workers came to build the British Columbia section of the railway (a number given in the task)
  // FACT CHECK: Chinese workers were given the most dangerous jobs, such as handling explosives to blast tunnels and ledges out of the rock
  // FACT CHECK: Chinese workers were paid about one dollar a day, roughly half of what white workers were paid, and had to buy their own food and gear out of it
  // FACT CHECK: at least 600 Chinese workers died building the railway in British Columbia (in rock slides, blasts, accidents and from illness): "at least 600" is the number most often given, and the true number is not known
  // FACT CHECK: the last spike was driven on November 7, 1885 at Craigellachie, in Eagle Pass, by Donald Smith, a director of the Canadian Pacific Railway. The famous photograph shows company men and no Chinese workers
  // FACT CHECK: the company did not pay the fare home for Chinese workers, as many had expected
  // FACT CHECK: in 1885 Canada passed a head tax of 50 dollars on every Chinese person entering the country. It was raised to 100 dollars in 1900 and to 500 dollars in 1903 (about two years of wages)
  // FACT CHECK: the 1923 Chinese Immigration Act shut out almost all Chinese immigration and was repealed in 1947; the government of Canada formally apologized in 2006 (a number and dates given in the task)
  // FACT CHECK: the Big Hill, the first track down from Kicking Horse Pass, had a grade of 4.5 percent, and the Spiral Tunnels (two loops inside the mountains) opened in 1909. Typical railway grades are gentle (about 2.2 m up for every 100 m along)
  // FACT CHECK: a long freight train can be at both ends of a Spiral Tunnel loop at the same time (the train passes over itself)
  // FACT CHECK: the Secwépemc, Ktunaxa and Sinixt are among the nations whose homelands include these mountains, and they live here today (the line is deliberately plain and general). Sinixt and the pronunciation guides (suh-WEP-muhc, k-too-NAH-ha, sin-AYKST) added from Shane's review notes (November 2026)
  // FACT CHECK: Mei, her family and the great-great-great-grandfather are made-up characters. The case-file numbers (6 days a week, 30 to 50 weeks, food and gear at 40 cents a day) are made up to suit the maths, not documented. The tunnel and trail numbers in the last questions are also made up
  // FACT CHECK: a stone cairn with a plaque marks the last-spike place at Craigellachie, and a walking route reaches it. The railway bridge on the trail is general scenery and should be checked against the real place
  // FACT CHECK: French words: la montagne (the mountain), le chemin de fer (the railway), le tunnel (the tunnel), le pont (the bridge)
  // FACT CHECK: Cantonese for railway is 鐵路, said teet-loh. The workers came from Guangdong and spoke Cantonese (or Taishanese). Changed from Mandarin tiělù per Shane's review notes (November 2026); a Cantonese reader should still confirm. Dates changed to month-day-year style
  // READERS: Chinese Canadian readers (ideally descendants of railway workers or a Chinese Canadian historical society); Secwépemc, Ktunaxa or Sinixt readers for the land line.
  CHAPTERS[0] = { title: "The Last Spike", where: "The mountains of British Columbia", beats: [
    { art: "ls_arrive", word: ["la montagne", "the mountain"], say: ["The prairie is behind us, and look at what the clock was pointing at! My balloon is climbing into the mountains of British Columbia. My ears have popped three times already.",
      "<em>La montagne</em> is the French word for a mountain, and these are very big ones. The peaks are sharp and white at the top, and the slopes below are dark with evergreen trees. This is the land of the Secwépemc, the Ktunaxa, the Sinixt and other nations, who live here today.",
      "You say them suh-WEP-muhc, k-too-NAH-ha and sin-AYKST.",
      "Down in the valley a long train is climbing the grade. Freight trains still haul goods through these passes every day. Why is there a railway in such steep mountains? Let us find out."] },
    { art: "ls_mei", word: ["鐵路 (teet-loh)", "the railway, in Cantonese"], say: ["This is Mei. She lives in Revelstoke, a mountain town in British Columbia, and she can hear the freight trains from her bedroom window. She says she can tell which train is coming by the sound.",
      "Mei's great-great-great-grandfather came from Guangdong, in southern China, to help build this railway. In Cantonese a railway is <em>teet-loh</em>, and Mei says the word slowly and carefully.",
      "Mei wants us to see one day in particular, November 7, 1885. But first we must see how the railway got here. Clock, show us!"] },
    { art: "ls_window1", who: "The clock", say: ["Tick, tock. Time to look back. My window is open."] },
    { art: "ls_window1", word: ["le chemin de fer", "the railway"], say: ["The window into the past! It is the early 1880s. British Columbia joined Canada in 1871 on the promise of a railway to the Pacific. A railway is <em>le chemin de fer</em> in French.",
      "The Canadian Pacific Railway is building it, and the hardest part is here, through these mountains and the Fraser Canyon. About <em>15,000 Chinese workers</em> came to build the British Columbia section.",
      "They were given the most dangerous jobs, like handling explosives to blast tunnels and ledges out of the rock. They were paid about one dollar a day, roughly half of what white workers were paid.",
      "They also had to buy their own food and gear out of that pay. Hundreds died in rock slides, blasts and accidents and from illness. At least 600 is the number most often given."] },
    { ask: "ls_climb", intro: "A train cannot climb a steep slope, so the track has to rise slowly. Three right answers and we look at the rails today." },
    { art: "ls_today", say: ["Back to today! Mei takes us up to the Kicking Horse Pass. A loaded train cannot climb steeply, so a railway is built to a gentle grade, about <em>2.2 metres</em> up for every 100 metres along.",
      "The first track over this pass, the Big Hill, rose 4.5 percent, which was dangerously steep. In 1909 the <em>Spiral Tunnels</em> opened: two loops inside the mountains that let the track rise slowly.",
      "Look at the picture. The track goes into the mountain, circles inside it and comes out higher up. A long freight train can be at both ends of a loop at the same time."] },
    { ask: "ls_hill", intro: "The mountainside is full of right triangles. Three right answers and the window opens on one day in 1885." },
    { who: "The railway director", art: "ls_director", say: ["It is November 7, 1885, at Craigellachie, in Eagle Pass. I am a company man, and I stand in the front row. Today the last spike goes in, and the railway runs from sea to sea.",
      "Donald Smith, one of our directors, lifts the hammer and drives the spike. The photographer asks us all to stand close and keep still. I am very proud. This is the picture the country will remember.",
      "I know that thousands of men built these miles through the mountains, and that most of them are not standing here. Today I think only of the country that is now joined together."] },
    { who: "Mei's great-great-great-grandfather", art: "ls_worker", say: ["I came from Guangdong, in southern China, to build this railway. The company gave men like me the most dangerous work, handling the explosives that blast tunnels and ledges out of the mountain.",
      "I was paid about one dollar a day, half of what white workers were paid, and I bought my own food and gear out of it. Many men died in rock slides, in blasts, in accidents and from sickness.",
      "Today they drive the last spike. I am not in the photograph. No Chinese worker is.",
      "The company did not pay our fare home, as many of us had hoped. And this same year, 1885, Canada made a head tax of 50 dollars on every Chinese person coming in. Now I cannot bring my wife and children."] },
    { art: "ls_mei", say: ["The window closes, and I am quiet for a while. Here is what came next, plainly. The <em>head tax</em> was raised to 100 dollars in 1900, and to 500 dollars in 1903. That was about two years of wages.",
      "In 1923 a new law shut out almost all Chinese immigration. It stayed until 1947. Families were kept apart for decades, a husband in Canada and a wife and children in China.",
      "In 2006 the government of Canada formally apologized. Mei's family is here today, and she tells this story so that it is remembered. Now, the numbers. They are worth looking at carefully."] },
    { ask: "ls_pay", intro: "This is a case file: three steps about one worker's pay, and each answer is used in the next. Three right answers and we go on." },
    { art: "ls_choice", pick: "Mei has two places to show us. We can ride a train through the Spiral Tunnels, or walk the trail to the cairn at Craigellachie where the last spike was driven. Which shall we do?", options: [
      { label: "Ride the train through the Spiral Tunnels", art: "ls_train", word: ["le tunnel", "the tunnel"], say: ["We climb aboard with Mei, and the train rumbles into the mountain. Inside it is dark and loud, and the track circles round until we come out higher up, with the same valley far below us.",
        "A tunnel is <em>le tunnel</em> in French. Mei says that the first builders of this railway worked on mountains like these with hand tools and explosives, and she is quiet for a while as we ride."] },
      { label: "Walk the trail to the last-spike cairn", art: "ls_trail", word: ["le pont", "the bridge"], say: ["We walk the trail to Craigellachie with Mei leading the way. At the end stands a stone cairn with a plaque that marks the place where the last spike was driven, and the tracks run right past it.",
        "Along the way Mei points up at a railway bridge high over a creek. A bridge is <em>le pont</em> in French. Mei says she has walked this trail many times, and she still stops at the cairn to read the plaque."] }] },
    { ask: "ls_last", intro: "Mei has one more set of questions about the way we chose. Three right answers and we say goodbye to the mountains." },
    { art: "ls_goodbye", say: ["The sun is going down behind the peaks, and the rails run on, across a high wooden bridge and down the canyon of a great river, toward the sea.",
      "Thank you, Mei. He was not in the photograph, but you keep his story, and now we do too.",
      "Next we follow the rails down the canyon to a river with its own story of gold. It is called the Fraser, and the chapter is The River of Gold. Tick tock!"] }
  ] };
}
