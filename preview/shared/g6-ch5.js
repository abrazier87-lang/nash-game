"use strict";
// Grade 6, Chapter 5: The Harbour of Arrivals. Halifax: the great harbour, the Black Loyalists of 1783, the Citadel and the noon gun, and Pier 21.
{
  const GUIDE = { hood: "#e0559a" }; // Amara: long dark hair and a pink hoodie
  const fmt = k => k.toLocaleString("en-CA");
  const pad = m => String(m).padStart(2, "0");
  const money = c => "$" + (c / 100).toFixed(2);
  const frac = (a, b) => { const g = gcd(a, b); return `${a / g}/${b / g}`; };

  // ---------- my own drawing pieces ----------
  // a red and white lighthouse on rocks (x, y is the middle of the base)
  const lighthouse = (x, y, s) => { const hw = h => 12 - 4 * h / 56;
    return `<g transform="translate(${x} ${y}) scale(${s})" ${INKED}><ellipse cx="0" cy="2" rx="30" ry="9" fill="#9a8f84"/><ellipse cx="16" cy="4" rx="16" ry="6" fill="#b3a99c"/>${[[0, 14, "#fbf6ea"], [14, 28, "#e63946"], [28, 42, "#fbf6ea"], [42, 56, "#e63946"]].map(([a, b, c]) => `<polygon points="${-hw(a)},${-a} ${hw(a)},${-a} ${hw(b)},${-b} ${-hw(b)},${-b}" fill="${c}"/>`).join("")}<rect x="-8" y="-66" width="16" height="10" fill="#ffd84d"/><polygon points="-10,-66 0,-78 10,-66" fill="#e63946"/></g>`; };
  // a container ship with a stack of coloured boxes (x, y is the waterline in the middle)
  const cargoShip = (x, y, s) => `<g transform="translate(${x} ${y}) scale(${s})" ${INKED}><path d="M-62 -8 H58 Q54 12 40 14 H-52 Q-60 10 -62 -8 Z" fill="#3b4a5c"/>${[[-54, "#e63946"], [-40, "#3b82c4"], [-26, "#f4b942"], [-12, "#58b368"], [2, "#e63946"], [16, "#3b82c4"]].map(([cx, c]) => `<rect x="${cx}" y="-20" width="14" height="12" fill="${c}"/>`).join("")}${[[-40, "#58b368"], [-26, "#e63946"], [-12, "#3b82c4"], [2, "#f4b942"]].map(([cx, c]) => `<rect x="${cx}" y="-32" width="14" height="12" fill="${c}"/>`).join("")}<rect x="34" y="-38" width="18" height="30" fill="#fbf6ea"/><rect x="38" y="-33" width="10" height="5" fill="#bfe6f7" ${THIN}/></g>`;
  // the little harbour ferry
  const ferry = (x, y, s) => `<g transform="translate(${x} ${y}) scale(${s})" ${INKED}><path d="M-34 -6 H36 Q32 10 22 12 H-24 Q-32 8 -34 -6 Z" fill="#fbf6ea"/><path d="M-32 1 H34" fill="none" stroke="#3b82c4" stroke-width="3"/><rect x="12" y="-36" width="8" height="12" fill="#e63946"/><rect x="-10" y="-32" width="20" height="10" fill="#fbf6ea"/><rect x="-22" y="-22" width="44" height="16" fill="#fbf6ea"/>${[-16, -6, 4, 14].map(wx => `<rect x="${wx}" y="-19" width="6" height="7" fill="#bfe6f7" ${THIN}/>`).join("")}</g>`;
  // an ocean liner (x, y is the waterline in the middle)
  const liner = (x, y, s) => `<g transform="translate(${x} ${y}) scale(${s})" ${INKED}><rect x="-14" y="-60" width="12" height="22" fill="#e63946"/><rect x="4" y="-60" width="12" height="22" fill="#e63946"/><rect x="-14" y="-60" width="12" height="5" fill="#2b1a10"/><rect x="4" y="-60" width="12" height="5" fill="#2b1a10"/>
    <rect x="-30" y="-40" width="60" height="14" fill="#fbf6ea"/><rect x="-52" y="-26" width="104" height="18" fill="#fbf6ea"/><path d="M-72 -8 H80 Q72 14 52 16 H-58 Q-70 12 -72 -8 Z" fill="#243b6b"/><path d="M-69 0 H76" fill="none" stroke="#fbf6ea" stroke-width="3"/>${Array.from({ length: 9 }, (_, i) => `<circle cx="${-42 + i * 10.5}" cy="-17" r="2.2" fill="#bfe6f7" stroke-width="1"/>`).join("")}</g>`;
  // Pier 21: a long low building with arched doors (x, y is the middle of the ground line)
  const pier21 = (x, y, s) => `<g transform="translate(${x} ${y}) scale(${s})" ${INKED}><rect x="-110" y="-34" width="220" height="34" fill="#b5553b"/><rect x="-114" y="-42" width="228" height="9" fill="#6a5a4c"/><polygon points="-26,-42 0,-64 26,-42" fill="#6a5a4c"/>${[-90, -62, -34, 34, 62, 90].map(cx => `<path d="M${cx - 8} 0 V-14 Q${cx} -24 ${cx + 8} -14 V0 Z" fill="#f6e3b4"/>`).join("")}<path d="M-12 0 V-18 Q0 -30 12 -18 V0 Z" fill="#4a3518"/></g>`;
  // a suitcase (x, y is the middle of the bottom)
  const suitcase = (x, y, s, c) => `<g transform="translate(${x} ${y}) scale(${s})" ${THIN}><path d="M-5 -14 V-20 H5 V-14" fill="none" stroke-width="2.4"/><rect x="-11" y="-14" width="22" height="14" rx="3" fill="${c}"/><path d="M-6 -14 V0 M6 -14 V0" fill="none" stroke-width="1.6"/></g>`;
  // the noon gun: a cannon on a wooden carriage, with a puff of smoke. d is 1 (points right) or -1 (points left)
  const cannon = (x, y, s, d) => `<g transform="translate(${x} ${y}) scale(${s * d} ${s})" ${INKED}><g transform="rotate(-14 0 -14)"><rect x="-22" y="-20" width="46" height="12" rx="5" fill="#3a3f4a"/><rect x="20" y="-22" width="8" height="16" rx="3" fill="#2b2f38"/></g><path d="M-18 -8 L2 -8 L6 0 H-20 Z" fill="#8a5a2b"/><circle cx="-4" cy="-8" r="8" fill="#a8743a"/><circle cx="-4" cy="-8" r="2.4" fill="#2b1a10"/>
    <g ${THIN}><circle cx="36" cy="-24" r="6" fill="#fff"/><circle cx="46" cy="-30" r="8" fill="#fff"/><circle cx="41" cy="-41" r="6" fill="#f2f2f2"/></g></g>`;
  // the Citadel: a star-shaped fort on a green hill (x, y is the middle of the foot of the hill)
  const citadel = (x, y, s) => `<g transform="translate(${x} ${y}) scale(${s})" ${INKED}><path d="M-105 0 Q-72 -46 -30 -54 H30 Q72 -46 105 0 Z" fill="#6fae6a"/><path d="M-64 -52 L-56 -66 L-44 -58 L-30 -72 L-14 -62 L0 -76 L14 -62 L30 -72 L44 -58 L56 -66 L64 -52 Z" fill="#c9b8a0"/>
    <rect x="-20" y="-90" width="40" height="24" fill="#e8dcc0"/><polygon points="-24,-90 0,-104 24,-90" fill="#8a5a2b"/><path d="M0 -104 V-120" fill="none" stroke-width="2.2"/><path d="M0 -120 h14 v8 h-14 z" fill="#e63946"/><rect x="-12" y="-84" width="8" height="8" fill="#bfe6f7" ${THIN}/><rect x="4" y="-84" width="8" height="8" fill="#bfe6f7" ${THIN}/></g>`;
  // the Town Clock: a white tower with a clock face and a green roof
  const clockTower = (x, y, s) => `<g transform="translate(${x} ${y}) scale(${s})" ${INKED}><rect x="-17" y="-40" width="34" height="40" fill="#fbf6ea"/><rect x="-13" y="-76" width="26" height="38" fill="#fbf6ea"/><rect x="-9" y="-90" width="18" height="14" fill="#fbf6ea"/><polygon points="-12,-90 0,-110 12,-90" fill="#3f9a80"/><path d="M0 -110 V-118" fill="none"/>
    <circle cx="0" cy="-60" r="9" fill="#fff"/><path d="M0 -60 V-68" fill="none" stroke-width="2"/><path d="M0 -60 V-64" fill="none" stroke-width="3.6"/><path d="M-6 0 V-14 Q0 -22 6 -14 V0 Z" fill="#6a5a4c"/><rect x="-12" y="-32" width="6" height="9" fill="#bfe6f7" ${THIN}/><rect x="6" y="-32" width="6" height="9" fill="#bfe6f7" ${THIN}/></g>`;
  // a small log cabin
  const cabin = (x, y, s) => `<g transform="translate(${x} ${y}) scale(${s})" ${INKED}><rect x="-20" y="-22" width="40" height="22" fill="#b07a45"/><polygon points="-24,-22 0,-40 24,-22" fill="#7a4a24"/><rect x="-5" y="-14" width="10" height="14" fill="#4a3518"/><path d="M-20 -16 h12 M-20 -9 h12 M8 -16 h12 M8 -9 h12" fill="none" stroke="#7a4a24" stroke-width="1.2"/></g>`;
  // the deck of a boat or a boardwalk with a rail, drawn in front of the water
  const deck = `<g ${INKED}><path d="M-10 190 H410 V250 H-10 Z" fill="#c89a5e"/><path d="M-10 168 H410" fill="none" stroke-width="5"/>${Array.from({ length: 14 }, (_, i) => `<path d="M${10 + i * 30} 168 V190" fill="none"/>`).join("")}</g><g stroke="#8a5a2b" stroke-width="1.4">${[204, 218, 232].map(yy => `<path d="M-10 ${yy} H410"/>`).join("")}</g>`;

  // ---------- the windows into the past ----------
  // 1783: ships have brought the Black Loyalists, and they are building homes at Birchtown
  const birchtown = `<rect width="400" height="240" fill="#f6e3b4"/>${water(72, "#6cc0ea")}${ship(236, 100, .55)}<g ${INKED}><path d="M130 118 Q236 104 342 120 V250 H130 Z" fill="#a9cf86"/></g>${pine(168, 128, .7)}${pine(190, 132, .55, "#3f9a58")}${pine(310, 126, .7, "#3f9a58")}
    ${cabin(212, 158, .8)}${cabin(280, 162, .7)}${cabin(250, 148, .5)}${person(176, 150, .5, "#3b6ea5")}${person(236, 168, .5, "#e63946")}${person(262, 170, .45, "#8e5bd0")}${person(298, 172, .45, "#2f8a57")}${person(204, 176, .34, "#f4b942")}`;
  // 1928 to 1971: families with suitcases outside Pier 21, an ocean liner at the dock
  const pier1928 = `<rect width="400" height="240" fill="#f6e3b4"/>${water(92, "#6cc0ea")}${liner(250, 138, .75)}<g ${INKED}><path d="M130 142 H342 V250 H130 Z" fill="#d9c7a0"/></g>${pier21(236, 178, .52)}
    ${person(190, 160, .4, "#3b6ea5")}${person(208, 162, .4, "#c98f58")}${person(226, 168, .3, "#e63946")}${person(262, 160, .4, "#8e5bd0")}${person(280, 162, .4, "#2f8a57")}${suitcase(196, 182, .6, "#8a5a2b")}${suitcase(216, 182, .5, "#b03a2e")}${suitcase(270, 182, .6, "#3b82c4")}${suitcase(288, 182, .5, "#8a5a2b")}`;

  Object.assign(ART, {
    hx_arrive: () => frame(`${sky("#9fd8f2", "#f4f1d8", [344, 40, 20], [[70, 34, .8], [300, 66, .6]])}${water(132)}${cargoShip(300, 142, .75)}${ferry(198, 168, .7)}<g ${INKED}><path d="M-10 190 Q100 172 200 188 T410 184 V250 H-10 Z" fill="#a9cf86"/></g>${house(240, 172, 28, 22, "#e63946")}${house(276, 174, 26, 20, "#3b82c4")}${house(310, 172, 30, 22, "#f4b942")}${lighthouse(66, 198, .9)}${riding(120, 0, 120)}`),
    hx_amara: () => frame(`${sky("#9fd8f2", "#f4f1d8", [344, 40, 20], [[70, 44, .8], [250, 36, .6]])}${water(104)}${ferry(150, 120, .55)}<g ${INKED}><path d="M-10 150 H410 V250 H-10 Z" fill="#d9c7a0"/></g>${house(246, 128, 28, 22, "#e63946")}${house(280, 130, 26, 20, "#3b82c4")}${house(314, 128, 28, 22, "#f4b942")}${house(348, 130, 24, 20, "#58b368")}<g ${INKED}><path d="M-10 214 Q100 200 210 216 T410 214 V250 H-10 Z" fill="#c89a5e"/></g>${owlAt(28, 116, 112)}${kidAt(196, 142, 1.05, GUIDE)}`),
    hx_window1783: () => frame(`${sky("#9fd8f2", "#f4f1d8", null, [[60, 40, .7]])}${water(176)}${shore}${windowAt(236, 112, 92, birchtown)}${owlAt(18, 118, 108)}${kidAt(118, 150, .95, GUIDE)}`),
    hx_citadel: () => frame(`${sky("#9fd8f2", "#f4f1d8", [56, 40, 20], [[220, 40, .8], [330, 70, .6]])}${water(132)}<g ${INKED}><path d="M-10 196 Q100 186 200 198 T410 194 V250 H-10 Z" fill="#8cc084"/></g>${citadel(270, 198, 1)}${cannon(338, 168, .7, 1)}${owlAt(8, 124, 106)}${kidAt(134, 148, 1, GUIDE)}`),
    hx_window1928: () => frame(`${sky("#9fd8f2", "#f4f1d8", null, [[60, 40, .7]])}${water(176)}${shore}${windowAt(236, 112, 92, pier1928)}${owlAt(18, 118, 108)}${kidAt(118, 150, .95, GUIDE)}`),
    hx_choice: () => frame(`${sky("#9fd8f2", "#f4f1d8", [56, 40, 20], [[210, 32, .8]])}${water(120)}<g ${INKED}><path d="M-10 118 Q50 104 120 116 V124 H-10 Z" fill="#9ed08f"/></g>${house(20, 102, 18, 14, "#e63946")}${house(46, 104, 18, 12, "#f4b942")}${house(72, 102, 18, 14, "#3b82c4")}${ferry(96, 160, .85)}
      <g ${INKED}><path d="M190 220 Q230 96 310 74 Q370 60 410 72 V250 H190 Z" fill="#8cc084"/></g>${citadel(345, 84, .38)}<g ${INKED}><path d="M-10 214 H410 V250 H-10 Z" fill="#c9c3b6"/></g>${owlAt(150, 146, 84)}${kidAt(236, 160, .8, GUIDE)}`),
    hx_ferry: () => frame(`${sky("#9fd8f2", "#f4f1d8", [344, 40, 20], [[90, 40, .8], [220, 52, .6]])}${water(118)}<g ${INKED}><path d="M-10 126 Q60 112 130 124 T260 120 T410 126 V134 H-10 Z" fill="#9ed08f"/></g>${house(30, 112, 18, 14, "#e63946")}${house(56, 114, 18, 12, "#f4b942")}${house(84, 112, 18, 14, "#3b82c4")}${house(112, 114, 16, 12, "#58b368")}${lighthouse(330, 132, .6)}${geese(280, 60, .6, 3)}${deck}${owlAt(70, 112, 110)}${kidAt(206, 140, 1.05, GUIDE)}`),
    hx_noon: () => frame(`${sky("#9fd8f2", "#f4f1d8", [344, 40, 20], [[210, 36, .8]])}${water(108)}${cargoShip(270, 124, .5)}${clockTower(80, 182, 1.15)}<g ${INKED}><path d="M-10 250 V178 ${Array.from({ length: 15 }, () => "v-9 h14 v9 h14").join(" ")} V250 Z" fill="#c9b8a0"/></g><g stroke="#a8977f" stroke-width="1.4"><path d="M-10 196 H410 M-10 214 H410 M-10 232 H410"/></g>${cannon(322, 179, .9, 1)}${owlAt(130, 122, 104)}${kidAt(262, 142, 1, GUIDE)}`),
    hx_goodbye: () => frame(`${sky("#ffd9a0", "#fdebd0", [330, 70, 24], [[90, 40, .8], [220, 56, .6]])}${water(118, "#6cc0ea")}<g ${INKED}><path d="M-10 118 Q40 102 100 118 V128 H-10 Z" fill="#9ed08f"/></g>${liner(285, 150, .5)}${lighthouse(352, 166, .7)}${deck}${owlAt(70, 112, 110)}${kidAt(206, 140, 1.05, GUIDE)}`)
  });

  // ---------- the questions ----------
  Object.assign(ASK, {
    hx_numbers() { // big numbers up to one million: adding, rounding, comparing
      const kind = rand(3);
      if (kind === 0) { const a = 1000 * (150 + rand(250)), b = 1000 * (100 + rand(200)), n = a + b;
        return { html: "", text: `Pretend you are a harbour clerk. <b>${fmt(a)}</b> people came ashore one year and <b>${fmt(b)}</b> the next. How many is that in all?`, choices: textCards(fmt(n), shuffle([n + 10000, n - 10000, n + 100000, n - 100000, n + 1000]).map(fmt)), why: `Add them. ${fmt(a)} + ${fmt(b)} = ${fmt(n)}.` }; }
      if (kind === 1) { const place = pick([1000, 10000, 100000]), raw = 200000 + rand(700000), N = (raw % place) * 2 === place ? raw + 1 : raw, lo = Math.floor(N / place) * place, up = (N - lo) * 2 > place, ans = up ? lo + place : lo, other = up ? lo : lo + place;
        return { html: "", text: `A pier counted <b>${fmt(N)}</b> arrivals in one year. Round that to the nearest <b>${fmt(place)}</b>.`, choices: textCards(fmt(ans), shuffle([other, ans - place, ans + place, ans + 2 * place, ans - 2 * place].filter(k => k > 0 && k <= 1000000)).map(fmt)), why: `Look at the digit to the right of the place. ${fmt(N)} is closer to ${fmt(ans)}.` }; }
      const R = 1000 * (300 + rand(600));
      return { html: "", text: `Four towns near the harbour have these populations. Which number is the greatest?`, choices: textCards(fmt(R), shuffle([R - 10000, R - 1000, R - 100000, R - 100, R - 20000]).map(fmt)), why: `Line up the digits and compare from the left. ${fmt(R)} is the greatest.` };
    },
    hx_clock() { // elapsed time and the 24-hour clock
      const kind = rand(3);
      if (kind === 0) { const h = 10 + rand(2), m = 5 * (1 + rand(11)), n = (12 - h) * 60 - m;
        return { html: "", text: `It is <b>${h}:${pad(m)}</b> in the morning. The noon gun fires at <b>12:00</b>. How many minutes until the gun?`, choices: cards(n, [(12 - h) * 60 + m, 60 - m, n + 10, n - 10, n + 5]), why: h === 10 ? `${h}:${pad(m)} to 11:00 is ${60 - m} min. Add 60 more to reach noon: ${n} min.` : `From ${h}:${pad(m)} to 12:00 is ${n} minutes.` }; }
      if (kind === 1) { const H = 13 + rand(10), mm = pick([0, 15, 30, 45]), h12 = H - 12, p = pad(mm);
        return { html: "", text: `The Citadel's last tour starts at <b>${H}:${p}</b> by the 24-hour clock. What time is that on a 12-hour clock?`, choices: textCards(`${h12}:${p} p.m.`, [`${h12}:${p} a.m.`, `${h12 + 1}:${p} p.m.`, `${h12 + 2}:${p} p.m.`, `${h12}:${pad(mm === 30 ? 15 : 30)} p.m.`, `${h12 > 1 ? h12 - 1 : h12 + 3}:${p} p.m.`]), why: `Take away 12 from ${H}. ${H} − 12 = ${h12}, so it is ${h12}:${p} p.m.` }; }
      const sH = 1 + rand(3), sM = pick([10, 20, 35, 40, 45, 50]), dur = pick([55, 65, 70, 75, 80, 85, 95, 100]), total = sH * 60 + sM + dur, eH = Math.floor(total / 60), eM = total % 60, slip = (eH - sH) * 60 + Math.abs(eM - sM);
      return { html: "", text: `A tour of the Citadel starts at <b>${sH}:${pad(sM)} p.m.</b> and ends at <b>${eH}:${pad(eM)} p.m.</b> How many minutes long is the tour?`, choices: cards(dur, [slip, dur + 10, dur - 10, dur + 60, dur - 5]), why: `Count on from ${sH}:${pad(sM)} to ${eH}:${pad(eM)}. That is ${dur} minutes.` };
    },
    hx_tally() { // data and probability: the mean, a chance, a share as a percent
      const kind = rand(3);
      if (kind === 0) { const m = 12 + rand(9), ds = [rand(7) - 3, rand(7) - 3, rand(7) - 3], v = shuffle([...ds, -ds.reduce((a, b) => a + b, 0)].map(d => m + d));
        return { html: "", text: `Four ships docked at the pier this week with <b>${v.join(", ")}</b> families aboard. What is the mean number of families per ship?`, choices: cards(m, [m + 1, m - 1, Math.max(...v), 4 * m, m + 2, Math.min(...v)]), why: `Add them: ${v.join(" + ")} = ${4 * m}. Then ${4 * m} ÷ 4 = ${m}.` }; }
      if (kind === 1) { const set = pick([[3, 5, 2], [4, 4, 2], [2, 6, 2], [1, 3, 6], [5, 3, 2], [3, 3, 4], [2, 5, 3], [6, 3, 1], [3, 4, 5], [2, 4, 6], [1, 5, 6], [6, 3, 3], [4, 5, 3]]), T = set[0] + set[1] + set[2], names = ["red", "blue", "green"], i = rand(3), x = set[i], right = frac(x, T), g = gcd(x, T);
        return { html: "", text: `A bag at the museum holds <b>${T}</b> luggage tags: ${set[0]} red, ${set[1]} blue and ${set[2]} green. You pull out one without looking. What is the chance it is <b>${names[i]}</b>?`, choices: textCards(right, [frac(x, T - x), frac(T - x, T), `1/${T}`, frac(x + 1, T), frac(x, T + x)]), why: `${x} of the ${T} tags are ${names[i]}, so the chance is ${x}/${T}${g > 1 ? `, or ${right} in simplest form` : ""}.` }; }
      const [a, w, pc] = pick([[1, 4, 25], [3, 4, 75], [1, 5, 20], [2, 5, 40], [3, 5, 60], [4, 5, 80], [1, 2, 50], [7, 10, 70], [3, 10, 30], [9, 20, 45], [13, 20, 65], [17, 20, 85], [3, 20, 15]]);
      return { html: "", text: `On one train, <b>${a} out of every ${w}</b> passengers had just arrived by ship. What percent is that?`, choices: textCards(pc + "%", [pc + 10, pc - 10, 100 - pc, pc + 5, a].filter(k => k > 0 && k < 100).map(k => k + "%")), why: `${a} ÷ ${w} = ${(a / w).toFixed(2)}, and that is ${pc}%.` };
    },
    hx_fares() { // money and decimals: change, group cost, a percent off
      const kind = rand(3);
      if (kind === 0) { const n = 2 + rand(3), f = pick([225, 250, 275, 300, 325, 350]), total = n * f, bill = total <= 1000 ? 1000 : 2000, change = bill - total;
        return { html: "", text: `Amara buys <b>${n}</b> ferry tickets at <b>${money(f)}</b> each and pays with a <b>$${bill / 100}</b> bill. How much change does she get?`, choices: textCards(money(change), [bill - f, total, change + 100, change + 25, change - 100].filter(c => c > 0).map(money)), why: `${n} × ${money(f)} = ${money(total)}. $${bill / 100} − ${money(total)} = ${money(change)}.` }; }
      if (kind === 1) { const f = pick([3, 4, 5, 6]), n = pick([4, 5, 6, 8, 10]), pc = pick([10, 20, 25, 50]), total = f * n, disc = total * pc, net = total * 100 - disc;
        return { html: "", text: `A school group of <b>${n}</b> rides the ferry. Each ticket is <b>$${f}</b>, and the group gets <b>${pc}% off</b> the total. What does the group pay?`, choices: textCards(money(net), [total * 100, disc, net + f * 100, net - f * 100, total * 100 - pc * 100, net + 100, net - 100].filter(c => c > 0).map(money)), why: `Total: ${n} × $${f} = $${total}. ${pc}% of $${total} is ${money(disc)}. So ${money(total * 100)} − ${money(disc)} = ${money(net)}.` }; }
      const a = pick([250, 275, 300, 325, 350]), k = pick([125, 150, 175, 200, 225]), na = 2, nk = 1 + rand(3), total = na * a + nk * k;
      return { html: "", text: `A family rides the ferry: <b>${na} adults</b> at <b>${money(a)}</b> each and <b>${nk} ${nk === 1 ? "child" : "children"}</b> at <b>${money(k)}</b> each. What is the total fare?`, choices: textCards(money(total), [(na + nk) * a, (na + nk) * k, a + k, na * a, total + 100, total - 50].filter(c => c > 0).map(money)), why: `${na} × ${money(a)} = ${money(na * a)} and ${nk} × ${money(k)} = ${money(nk * k)}. Add: ${money(total)}.` };
    }
  });

  // FACT CHECK: Halifax has one of the great natural harbours of the world, and the harbour stays free of ice all year.
  // FACT CHECK: Kjipuktuk is the Mi'kmaw name for the Halifax harbour, usually written this way, and it means "great harbour". Mi'kmaq lived here long before Europeans came and live in Nova Scotia today.
  // FACT CHECK: Added from Shane's review notes (November 2026): Kjipuktuk was a Mi'kmaw gathering place long before there was a city; the British built Halifax there in 1749 without asking the Mi'kmaq. Pronunciation jee-BOOK-took. Also a line saying Canada has two official languages, English and French.
  // FACT CHECK: About 3,000 Black Loyalists came to Nova Scotia in 1783 and after the American Revolution. They were promised freedom and land, and many settled at Birchtown and were given less and poorer land than promised. Black Nova Scotians have lived here for over 200 years.
  // FACT CHECK: The Halifax Citadel is a star-shaped fort on Citadel Hill, built to guard the harbour. The noon gun is fired there every day at 12 o'clock.
  // FACT CHECK: The Town Clock is a white clock tower with a clock face on each of its sides (a teacher may wish to confirm). No date is given in the story.
  // FACT CHECK: Pier 21 welcomed about one million immigrants between 1928 and 1971. Today it is the Canadian Museum of Immigration at Pier 21.
  // FACT CHECK: The Halifax to Dartmouth ferry is described as the oldest saltwater ferry service in North America, running since 1752.
  // FACT CHECK: French words: bienvenue (welcome), le port (the harbour), le bateau (the boat), la valise (the suitcase), le traversier (the ferry, Canadian French), midi (noon, also the middle of the day), le phare (the lighthouse).
  // FACT CHECK: Every number in the questions (arrivals, populations, fares, tour times, discounts) is made up for practice and is not a real figure.
  CHAPTERS[4] = { title: "The Harbour of Arrivals", where: "Halifax", beats: [
    { art: "hx_arrive", word: ["bienvenue", "welcome"], say: ["Down the coast we float, and the clock has found a harbour. A big one! Ships are sliding in and out, and a red and white lighthouse is watching them go.",
      "This is <em>Halifax</em>, in Nova Scotia. It is one of the great natural harbours of the world, and its water stays free of ice all year.",
      "A sign on the dock says <em>bienvenue</em>, which is French for welcome. I waved at the sign. It did not wave back, but it was very polite.",
      "Canada has two official languages, English and French. So I am practising my French all the way to the coast."] },
    { art: "hx_amara", word: ["le port", "the harbour"], say: ["This is Amara. Her grandparents came to Canada by ship, and they landed in this very harbour. Now she lives a short walk from the water.",
      "The Mi'kmaq have known this harbour since long before any ship came, and they know it still. Their name for it is usually written <em>Kjipuktuk</em>, which means the great harbour. You say it jee-BOOK-took.",
      "Kjipuktuk was a Mi'kmaw gathering place long before there was a city. The British built Halifax here in 1749 without asking the Mi'kmaq.",
      "In French, a harbour is <em>le port</em>. Amara says every family here has a story about arriving, and some of the oldest ones can be seen through the clock. Clock, show us!"] },
    { art: "hx_window1783", word: ["le bateau", "the boat"], say: ["The window into the past. The year is <em>1783</em>. The American Revolution is over, and ships are bringing thousands of people to Nova Scotia.",
      "About 3,000 of them are <em>Black Loyalists</em>. They are people of African descent who were promised freedom and land if they sided with Britain. Many cross by boat, <em>le bateau</em> in French.",
      "Many settle at a place called Birchtown. They were given less land than they were promised, and poorer land too. They built their homes and communities anyway.",
      "Black Nova Scotians have been part of this province for well over 200 years, and they are here today. Harbour clerks had to count everyone who came ashore, so let's count too."] },
    { ask: "hx_numbers", intro: "Count the people stepping off the ships. Three right answers and we climb the hill." },
    { art: "hx_citadel", say: ["Now up Citadel Hill! At the top sits the <em>Citadel</em>, a star-shaped fort with thick walls, built to guard the harbour. The view is enormous.",
      "Every day at twelve o'clock, a cannon here goes BOOM. It is called the <em>noon gun</em>, and it is a Halifax tradition. Even the seagulls know to leave early.",
      "Down the hill stands the <em>Town Clock</em>, a white tower with a clock face on every side. As a clock inventor, I bowed to it. Now, how long until the gun goes off?"] },
    { ask: "hx_clock", intro: "Count down to the noon gun. Three right answers and the window opens again." },
    { art: "hx_window1928", word: ["la valise", "the suitcase"], say: ["Back to the window. The dock is busy again! The long, low building is <em>Pier 21</em>, and an ocean liner is tied up beside it.",
      "From 1928 to 1971, about <em>one million</em> immigrants arrived in Canada through Pier 21. Families came from many countries, after days at sea.",
      "Each person walked through the doors with a suitcase, which is <em>la valise</em> in French. Many then took a train and rode west across the country.",
      "Today the building is the Canadian Museum of Immigration at Pier 21, and anyone can visit. For now, the clerk needs help with his tally."] },
    { ask: "hx_tally", intro: "Help the clerk with his tally. Three right answers and we choose our own way." },
    { art: "hx_choice", pick: "Amara has two ideas for the afternoon. We could ride the harbour ferry across the water, or climb the hill again to hear the noon gun. Which shall we do?", options: [
      { label: "Ride the ferry", art: "hx_ferry", word: ["le traversier", "the ferry"], say: ["All aboard! The ferry crosses to Dartmouth, on the other side of the harbour. It is the oldest saltwater ferry service in North America, and it has been running since 1752.",
        "Amara says a ferry is <em>le traversier</em>. The wind is fresh and the gulls follow us. I held on tight to my feathers."] },
      { label: "Hear the noon gun", art: "hx_noon", word: ["midi", "noon"], say: ["Up the hill we go, just in time! The gun fires at twelve o'clock, and Amara covers her ears. BOOM! I covered mine too, with my wings.",
        "In French, noon is <em>midi</em>, which really means the middle of the day. Down below, the Town Clock looked very pleased with itself."] }] },
    { ask: "hx_fares", intro: "Amara is buying ferry tickets for the ride home. Three right answers and we say goodbye." },
    { art: "hx_goodbye", word: ["le phare", "the lighthouse"], say: ["The sun is going down, and the harbour glows. Out on the rocks, a red and white lighthouse keeps watch over the water. In French that is <em>le phare</em>.",
      "Thank you, Amara. Halifax has welcomed new people for a very long time, and it still does. <em>Au revoir</em>!",
      "The clock is pointing across the water, to the big island of Newfoundland, right at the edge of the map. One more hop and we are there. Tick tock!"] }
  ] };
}
