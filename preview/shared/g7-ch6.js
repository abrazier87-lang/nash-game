"use strict";
// Grade 7, Chapter 6: Wheat and Sky. Dr. Somebody rides Dot's grain train into Alberta wheat country and meets Lukas, a farm boy of today. The last chapter of the grade.
{
  const LUKAS = { hood: "#f0b429", short: true };   // Lukas: short dark hair and a golden-yellow hoodie

  // ---------- my own drawing pieces ----------
  // a stretch of flat prairie ground with a gentle curve (y is the top edge)
  const flatLand = (y, c) => `<g ${INKED}><path d="M-10 ${y} Q100 ${y - 5} 210 ${y} T410 ${y - 2} V250 H-10 Z" fill="${c}"/></g>`;
  // faint rows across a field
  const rows = (y0, c, n, gap) => `<g fill="none" stroke="${c}" stroke-width="1.8" stroke-linecap="round" opacity=".6">${Array.from({ length: n }, (_, i) => `<path d="M-10 ${y0 + i * gap} Q200 ${y0 + i * gap - 4} 410 ${y0 + i * gap}"/>`).join("")}</g>`;
  // a strip of bright yellow canola in flower
  const canola = (y, h) => `<g ${INKED}><path d="M-10 ${y} Q200 ${y - 4} 410 ${y} V${y + h} Q200 ${y + h - 4} -10 ${y + h} Z" fill="#ffd60a"/></g><g fill="#fff0a0" opacity=".8">${[30, 90, 150, 210, 270, 330, 380].map((x, i) => `<circle cx="${x}" cy="${y + 5 + (i % 2) * 5}" r="2"/>`).join("")}</g>`;
  // the whole prairie behind the scene: sky, far field, canola, then golden wheat. "extra" is drawn right after the sky
  const prairie = (clouds, a, b, extra) => `${sky(a || "#8fd0f0", b || "#f6edc8", null, clouds)}${extra || ""}${flatLand(122, "#cdbb78")}${canola(130, 14)}${flatLand(150, "#e8c75c")}${rows(160, "#b88a2a", 5, 10)}`;
  // one stalk of wheat with its heavy golden head
  const stalk = (x, y, s) => `<g transform="translate(${x} ${y}) scale(${s})"><path d="M0 0 Q-2 -24 2 -46" fill="none" stroke="#8a7a2a" stroke-width="2.6" stroke-linecap="round"/><g ${THIN} fill="#f0cc5a"><ellipse cx="2" cy="-60" rx="3.4" ry="7"/><ellipse cx="-3" cy="-52" rx="3.4" ry="7" transform="rotate(-18 -3 -52)"/><ellipse cx="7" cy="-52" rx="3.4" ry="7" transform="rotate(18 7 -52)"/><ellipse cx="-2" cy="-44" rx="3.4" ry="6.5" transform="rotate(-22 -2 -44)"/><ellipse cx="6" cy="-44" rx="3.4" ry="6.5" transform="rotate(22 6 -44)"/></g></g>`;
  // railway track: a gravel bed with ties and two rails (y is the top of the bed; trains stand on y + 9)
  const track = y => `<g ${THIN}><rect x="-10" y="${y}" width="420" height="12" fill="#8a7a62"/></g><g stroke="#5a4a38" stroke-width="3">${Array.from({ length: 27 }, (_, i) => `<path d="M${i * 16 - 6} ${y} V${y + 12}"/>`).join("")}</g><path d="M-10 ${y + 3} H410 M-10 ${y + 9} H410" stroke="#2b1a10" stroke-width="2.4"/>`;
  const bank = y => `${flatLand(y - 6, "#a9a064")}${track(y)}`;
  // a tall wooden grain elevator: x is the middle, y the ground. Sloped shoulders, a small cupola, a lean-to office beside it
  const elevator = (x, y, s, c) => { c = c || "#a8452a"; return `<g transform="translate(${x} ${y}) scale(${s})" ${INKED}><path d="M18 -34 L46 -22 V0 H18 Z" fill="${c}"/><path d="M-18 0 V-60 L-12 -78 H12 L18 -60 V0 Z" fill="${c}"/><rect x="-7" y="-92" width="14" height="14" fill="${c}"/><polygon points="-11,-92 0,-104 11,-92" fill="#5a3a22"/><rect x="-14" y="-38" width="28" height="10" fill="#fbf1dc"/><rect x="-4" y="-60" width="8" height="10" fill="#fff6c9"/><rect x="24" y="-14" width="10" height="14" fill="#4a3518"/><path d="M-9 -76 V-40 M9 -76 V-40 M-9 -26 V0 M9 -26 V0" fill="none" stroke="#5a2a18" stroke-width="1.2"/></g>`; };
  // a round steel grain bin with a cone roof
  const bin = (x, y, s) => `<g transform="translate(${x} ${y}) scale(${s})" ${INKED}><rect x="-14" y="-32" width="28" height="32" fill="#c9ced6"/><path d="M-17 -32 L0 -48 L17 -32 Z" fill="#8f98a6"/><path d="M-14 -21 H14 M-14 -10 H14" fill="none" stroke-width="1.4"/></g>`;
  // a sod house: low turf walls, a grassy roof, one door and one window
  const sod = (x, y, s) => `<g transform="translate(${x} ${y}) scale(${s})" ${INKED}><path d="M-34 0 V-22 H34 V0 Z" fill="#7b6a3c"/><path d="M-38 -20 Q0 -36 38 -20 V-15 H-38 Z" fill="#6f9a3c"/><path d="M-34 -8 H34" fill="none" stroke-width="1.4"/><path d="M-24 -14 V-8 M-4 -14 V-8 M20 -14 V-8 M-14 -8 V0 M10 -8 V0" fill="none" stroke-width="1.2"/><rect x="-6" y="-17" width="12" height="17" rx="2" fill="#4a3518"/><rect x="16" y="-17" width="10" height="9" fill="#bfe6f7"/><path d="M-24 -29 l-2 -7 M-8 -32 l1 -8 M12 -32 l2 -7 M26 -28 l4 -6" fill="none" stroke="#4a8a2a" stroke-width="2.4"/></g>`;
  // a combine harvester facing left: wide yellow header with a reel, green body, glass cab, unloading tube. Feet on y = 0
  const combineAt = (x, y, s, driver) => `<g transform="translate(${x} ${y}) scale(${s})">
    <path d="M20 -60 L56 -86" fill="none" stroke="#2b1a10" stroke-width="8" stroke-linecap="round"/><path d="M20 -60 L56 -86" fill="none" stroke="#e8a317" stroke-width="4.4" stroke-linecap="round"/>
    <g ${INKED}><polygon points="-92,-8 -52,-14 -52,-38 -92,-36" fill="#e8a317"/><circle cx="-86" cy="-42" r="13" fill="#f4c542"/><path d="M-86 -55 V-29 M-99 -42 H-73 M-95 -51 L-77 -33 M-77 -51 L-95 -33" fill="none" stroke-width="1.6"/>
    <rect x="-52" y="-50" width="82" height="36" fill="#3a9a4a"/><rect x="-6" y="-62" width="36" height="12" fill="#2f7d3a"/><rect x="-48" y="-76" width="36" height="26" fill="#bfe6f7"/></g>
    ${driver ? person(-30, -70, .4, "#d94f70") : ""}
    <g ${INKED}><rect x="-52" y="-80" width="44" height="6" rx="2" fill="#2f7d3a"/><rect x="-48" y="-76" width="36" height="26" fill="none"/><circle cx="-34" cy="-14" r="14" fill="#2b1a10"/><circle cx="-34" cy="-14" r="6" fill="#8a8f99" stroke-width="1.4"/><circle cx="20" cy="-8" r="8" fill="#2b1a10"/><circle cx="20" cy="-8" r="3" fill="#8a8f99" stroke-width="1.2"/></g></g>`;
  // Dot's train facing left: an engine with Dot at the window, then n grain hopper cars. Feet (rail) on y = 0
  const trainAt = (x, y, s, n) => `<g transform="translate(${x} ${y}) scale(${s})">${Array.from({ length: n }, (_, i) => { const ox = 76 + i * 50; return `<g transform="translate(${ox} 0)"><path d="M-6 -9 H0" stroke="#2b1a10" stroke-width="3"/><path d="M0 -34 Q22 -46 44 -34 Z" fill="#e8c75c" ${THIN}/><g ${INKED}><path d="M0 -34 H44 V-20 L36 -12 H8 L0 -20 Z" fill="#c8a24a"/></g><path d="M1 -26 H43" stroke="#8a6a2a" stroke-width="2"/>${[8, 36].map(wx => `<circle cx="${wx}" cy="-6" r="6" fill="#2b1a10"/>`).join("")}</g>`; }).join("")}
    <path d="M68 -9 H76" stroke="#2b1a10" stroke-width="3"/>
    <g ${INKED}><rect x="0" y="-34" width="34" height="24" rx="3" fill="#3b82c4"/><rect x="32" y="-48" width="36" height="38" rx="3" fill="#e63946"/><rect x="29" y="-53" width="42" height="6" rx="2" fill="#7a2a30"/><rect x="6" y="-44" width="10" height="11" fill="#2b1a10"/><rect x="0" y="-12" width="68" height="4" fill="#2b1a10"/></g>
    <rect x="35" y="-45" width="31" height="22" fill="#bfe6f7"/>${dinoAt(34, -44, 26, "dot")}<rect x="35" y="-45" width="31" height="22" fill="none" ${THIN}/>
    <circle cx="-1" cy="-24" r="3" fill="#ffd84d" ${THIN}/>${[8, 30, 56].map(wx => `<circle cx="${wx}" cy="-6" r="6" fill="#2b1a10"/><circle cx="${wx}" cy="-6" r="2.2" fill="#8a8f99"/>`).join("")}</g>`;
  // a puff of steam or smoke
  const puff = (x, y, s) => `<g fill="#fff" opacity=".85" ${THIN}><circle cx="${x}" cy="${y}" r="${7 * s}"/><circle cx="${x + 8 * s}" cy="${y - 6 * s}" r="${9 * s}"/><circle cx="${x + 18 * s}" cy="${y - 14 * s}" r="${6 * s}"/></g>`;
  // the Rocky Mountains: a jagged blue-grey line with white tops (y is the base line)
  const mountains = y => `<g ${INKED}><path d="M-10 ${y} L40 ${y - 34} L62 ${y - 20} L96 ${y - 52} L130 ${y - 24} L160 ${y - 44} L200 ${y - 18} L240 ${y - 40} L280 ${y - 22} L330 ${y - 48} L370 ${y - 26} L410 ${y - 36} V${y + 14} H-10 Z" fill="#8a9bb8"/></g>${[[40, 34], [96, 52], [160, 44], [240, 40], [330, 48]].map(([px, h]) => `<path d="M${px - 12} ${y - h + 14} L${px} ${y - h} L${px + 12} ${y - h + 14} L${px + 5} ${y - h + 10} L${px} ${y - h + 16} L${px - 5} ${y - h + 10} Z" fill="#fff" ${THIN}/>`).join("")}`;

  // the homestead around 1900, seen through the window: a sod house, a family, fresh furrows
  const homesteadLook = `<rect width="400" height="240" fill="#f6e3b4"/>${sun(282, 62, 14)}<g ${INKED}><path d="M130 134 Q236 124 342 134 V250 H130 Z" fill="#c9bb6e"/></g>${sod(216, 156, 1.25)}${person(290, 134, .6, "#3b6ea5")}${person(310, 140, .5, "#c1272d")}
    <g fill="none" stroke="#7a5326" stroke-width="4" stroke-linecap="round" opacity=".8">${[176, 188, 200].map(y => `<path d="M140 ${y} Q236 ${y - 8} 340 ${y}"/>`).join("")}</g>`;
  // the 1930s, seen through the window: a huge dark cloud of dust over a bare farm
  const dustLook = `<rect width="400" height="240" fill="#d9b77a"/><g ${INKED}><path d="M120 150 Q236 138 350 150 V250 H120 Z" fill="#a8774a"/></g>
    <g ${INKED}><path d="M120 96 Q150 52 200 70 Q240 36 290 62 Q336 46 352 92 V150 H120 Z" fill="#5a3a22"/></g><path d="M150 108 Q190 84 230 104 Q270 80 320 104" fill="none" stroke="#7a5230" stroke-width="9" stroke-linecap="round"/><path d="M140 130 Q200 112 260 128 Q300 118 340 130" fill="none" stroke="#7a5230" stroke-width="7" stroke-linecap="round"/>
    ${house(190, 142, 36, 22, "#a8452a")}<ellipse cx="240" cy="152" rx="90" ry="14" fill="#8a5a2b" opacity=".45"/>
    <path d="M150 164 V182 M184 170 V188 M286 164 V182 M320 170 V188 M146 170 H330" fill="none" stroke="#4a3518" stroke-width="3" stroke-linecap="round"/>`;

  Object.assign(ART, {
    ws_arrive: () => frame(`${prairie([[80, 36, .8], [300, 30, .6]])}${elevator(356, 152, .5)}${bank(196)}${stalk(30, 236, 1.2)}${stalk(52, 238, 1)}${stalk(372, 236, 1.2)}${trainAt(120, 205, 1, 2)}${puff(130, 148, 1)}${owlAt(196, 117, 52)}`),
    ws_lukas: () => frame(`${prairie([[70, 40, .8]])}${elevator(250, 186, .8)}${bin(300, 186, .7)}${combineAt(352, 184, .5, true)}${flatLand(192, "#c3b074")}${owlAt(26, 126, 104)}${kidAt(150, 142, 1, LUKAS)}`),
    ws_window1: () => frame(`${sky("#8fd0f0", "#f6edc8", null, [[60, 40, .7]])}${flatLand(204, "#c3b074")}${windowAt(236, 112, 92, homesteadLook)}${owlAt(18, 118, 108)}${kidAt(118, 150, .95, LUKAS)}`),
    ws_elevator: () => frame(`${prairie([[70, 34, .8], [230, 28, .6]])}${bank(188)}${elevator(322, 190, 1.1)}${bin(384, 190, .7)}${trainAt(150, 197, .8, 2)}${puff(160, 148, .8)}${owlAt(14, 124, 100)}${kidAt(116, 146, .95, LUKAS)}`),
    ws_window2: () => frame(`${sky("#8fd0f0", "#f6edc8", null, [[60, 40, .7]])}${flatLand(204, "#c3b074")}${windowAt(236, 112, 92, dustLook)}${owlAt(18, 118, 108)}${kidAt(118, 150, .95, LUKAS)}`),
    ws_choice: () => frame(`${prairie([[250, 30, .7]])}${combineAt(70, 166, .55, true)}${bank(160)}${trainAt(262, 169, .5, 2)}${flatLand(186, "#c3b074")}${owlAt(112, 128, 100)}${kidAt(236, 146, 1, LUKAS)}`),
    ws_combine: () => frame(`${prairie([[80, 34, .8]])}${flatLand(186, "#c9b66e")}${rows(200, "#8a6a2a", 3, 12)}${combineAt(275, 204, 1.15, true)}${owlAt(10, 128, 100)}${kidAt(128, 146, .95, LUKAS)}${stalk(372, 236, 1.2)}`),
    ws_cab: () => frame(`${prairie([[80, 34, .8]])}${bank(184)}${trainAt(176, 193, 1.15, 2)}${puff(188, 130, 1.1)}${owlAt(10, 128, 100)}${kidAt(120, 146, .95, LUKAS)}`),
    ws_goodbye: () => frame(`${prairie([[90, 34, .7], [250, 48, .6]], "#ffd9a0", "#fdebd0", mountains(126))}${bank(190)}${trainAt(214, 199, .75, 2)}${puff(222, 152, .8)}<path d="M268 150 q6 -4 8 -10 M272 158 q8 -2 12 -8" fill="none" stroke="#2b1a10" stroke-width="2.4" stroke-linecap="round"/>${owlAt(24, 124, 104)}${kidAt(134, 144, 1, LUKAS)}`)
  });

  Object.assign(ASK, {
    ws_homestead() { // area and units: hectares, square metres, simple rates
      const kind = rand(3);
      if (kind === 0) { const w = pick([200, 300, 400, 500, 600]), l = pick([400, 500, 800, 1000]), ha = w * l / 10000;
        return { html: "", text: `Lukas's great-great-grandparents broke a field <b>${w} m</b> by <b>${l} m</b>. How many hectares is that? (1 hectare = 10,000 m²)`, choices: cards(ha, [ha * 10, w * l, ha * 100, ha + 10, ha * 2, ha + 5]), why: `${w} × ${l} = ${fmt(w * l)} m². Divide by 10,000 to get ${ha} hectares.` }; }
      if (kind === 1) { const k = 2 + rand(8), T = 64 * k;
        return { html: "", text: `A quarter section is about <b>64 hectares</b>. Lukas's family farms <b>64 × □ = ${T}</b> hectares. What is the missing number, the count of quarter sections?`, choices: cards(k, [k + 1, k - 1, k + 2, k * 2, T - 64]), why: `${T} ÷ 64 = ${k}, so 64 × ${k} = ${T}.` }; }
      const [w, l, ha, rs] = pick([[200, 400, 8, [2, 4]], [300, 400, 12, [2, 3, 4, 6]], [400, 500, 20, [2, 4, 5, 10]], [500, 600, 30, [2, 3, 5, 6, 10]], [400, 400, 16, [2, 4, 8]], [300, 500, 15, [3, 5]]]), r = pick(rs), d = ha / r;
      return { html: "", text: `A settler breaks a field <b>${w} m</b> by <b>${l} m</b>. His oxen break <b>${r} hectares</b> a day. How many days does the field take? (1 ha = 10,000 m²)`, choices: cards(d, [ha, ha * r, d + 1, d + 2, d - 1, ha + r]), why: `${w} × ${l} = ${fmt(w * l)} m², which is ${ha} ha. ${ha} ÷ ${r} = ${d} days.` };
    },
    ws_bins() { // volume of cylinders and prisms
      const kind = rand(3);
      if (kind === 0) { const r = pick([5, 10]), h = pick([4, 6, 8, 10, 12]), V = Math.round(314 * r * r * h / 100);
        return { html: "", text: `A round grain bin is a cylinder with a radius of <b>${r} m</b> and a height of <b>${h} m</b>. Use π = 3.14. What is its volume, in cubic metres?`, choices: cards(V, [r * r * h, V * 4, Math.round(314 * r * h / 100), V * 2, V + 100, V / 2]), why: `Volume = 3.14 × ${r} × ${r} × ${h} = ${fmt(V)} m³.` }; }
      if (kind === 1) { const L = pick([10, 15, 20]), W = pick([2, 3]), H = pick([2, 3]), vol = L * W * H, t = vol * 4 / 5;
        return { html: "", text: `A boxcar is <b>${L} m</b> long, <b>${W} m</b> wide and <b>${H} m</b> tall. A cubic metre of wheat has a mass of about <b>0.8 tonnes</b>. How many tonnes fill it?`, choices: cards(t, [vol, vol * 5 / 4, t + 8, t - 8, L * W, t * 2]), why: `Volume = ${L} × ${W} × ${H} = ${vol} m³. ${vol} × 0.8 = ${t} tonnes.` }; }
      const A = pick([20, 25, 30, 40, 50]), h = pick([6, 8, 10, 12, 15]), V = A * h;
      return { html: "", text: `The floor of a bin covers <b>${A} m²</b>, and the bin holds <b>${V} m³</b>. So ${A} × □ = ${V}. How many metres tall is the bin?`, choices: cards(h, [h + 2, h - 2, h * 2, V - A, V / 10, h + 5]), why: `Volume = floor area × height. ${V} ÷ ${A} = ${h} m.` };
    },
    ws_weather() { // probability and data: chances as percents, the mean, an expected count
      const kind = rand(3);
      if (kind === 0) { const n = pick([10, 20, 25, 50]), k = 1 + rand(n === 10 ? 4 : n === 20 ? 6 : n === 25 ? 6 : 8), p = k * 100 / n;
        return { html: "", text: `Hail hit Lukas's wheat in <b>${k} of the last ${n}</b> summers. Using that, what is the chance of hail next summer, as a percent?`, choices: textCards(`${p}%`, [`${k}%`, `${100 - p}%`, `${p * 2}%`, `${n - k}%`, `${p + 10}%`]), why: `${k} out of ${n} is ${k}/${n}. Multiply by ${100 / n} to get 100 in the bottom: ${p}%.` }; }
      if (kind === 1) { const m = pick([3, 4, 5]), ys = shuffle(pick([[-1, 0, 1, 2, -2], [-2, 1, 0, 0, 1], [1, -1, 2, -2, 0], [0, 0, -1, 1, 0], [-2, -1, 0, 1, 2]])).map(d => m + d), sorted = [...ys].sort((a, b) => a - b);
        return { html: "", text: `Lukas's family wrote down the wheat yield, in tonnes per hectare, for five years: <b>${ys.join(", ")}</b>. What is the mean yield?`, choices: cards(m, [sorted[2], Math.max(...ys), m + 1, m - 1, 5 * m, Math.min(...ys)]), why: `Add them: ${ys.join(" + ")} = ${5 * m}. Divide by 5 to get ${m} tonnes per hectare.` }; }
      const n = pick([20, 40]), p = pick([10, 20, 25, 30, 50]), rain = n * p / 100, dry = n - rain;
      return { html: "", text: `At harvest, the chance of rain on any day is <b>${p}%</b>. About how many of the next <b>${n} days</b> should be dry?`, choices: cards(dry, [rain, n - p, p, dry + 2, dry - 2, n]), why: `${p}% of ${n} is ${rain} rainy days. ${n} − ${rain} = ${dry} dry days.` };
    },
    ws_last(g) { // follows the choice: 0 = the combine harvester, 1 = Dot's grain train
      const way = g && g.choice ? 1 : 0, kind = rand(3);
      if (way === 0) {
        if (kind === 0) { const r = pick([5, 6, 8]), t = pick([8, 10]), d = pick([2, 3, 4]), total = r * t * d;
          return { html: "", text: `The combine cuts <b>${r} hectares</b> an hour. Lukas's mom works <b>${t} hours</b> a day for <b>${d} days</b>. How many hectares does she cut?`, choices: cards(total, [r * t, t * d, r * d, total + r, total - t, r + t + d]), why: `${r} × ${t} = ${r * t} ha a day. ${r * t} × ${d} = ${total} ha.` }; }
        if (kind === 1) { const A = pick([20, 30, 40, 50]), y = pick([3, 4, 5]), T = A * y, loads = T / 10;
          return { html: "", text: `The combine cuts <b>${A} hectares</b> of wheat that yields <b>${y} tonnes</b> per hectare. A truck carries <b>10 tonnes</b>. How many truckloads is that?`, choices: cards(loads, [T, A, loads + 1, loads - 1, y * 10, loads + 2]), why: `${A} × ${y} = ${T} tonnes. ${T} ÷ 10 = ${loads} loads.` }; }
        const y = pick([3, 4, 5]), A = pick([8, 12, 15, 20, 25]), T = y * A;
        return { html: "", text: `The combine took <b>${T} tonnes</b> from a field that yields <b>${y} tonnes</b> per hectare. So ${y} × □ = ${T}. How many hectares is the field?`, choices: cards(A, [A + y, A - y, T * y, A + 2, A * 2, T - y]), why: `${T} ÷ ${y} = ${A} hectares.` };
      }
      if (kind === 0) { const n = pick([40, 50, 60, 80, 100]), c = pick([80, 90, 100]), d = pick([10, 20]), remain = (n - d) * c;
        return { html: "", text: `Dot's grain train has <b>${n} cars</b>, each holding <b>${c} tonnes</b>. She drops <b>${d} cars</b> at the elevator. How many tonnes are still on board?`, choices: cards(remain, [n * c, d * c, (n + d) * c, remain - c, remain + c, n - d]), why: `${n} − ${d} = ${n - d} cars. ${n - d} × ${c} = ${fmt(remain)} tonnes.` }; }
      if (kind === 1) { const n = pick([30, 50, 70, 100]), L = 20 * n + 40;
        return { html: "", text: `Dot's train has <b>${n} cars</b>, each <b>20 m</b> long, plus two engines, each <b>20 m</b> long. How long is the whole train, in metres?`, choices: cards(L, [20 * n, 20 * n + 20, n + 40, 20 * n + 60, 20 * (n + 1), n * 20 - 40]), why: `${n} × 20 = ${20 * n} m of cars. Add 2 × 20 = 40 m of engines. ${L} m.` }; }
      const n = pick([40, 50, 60, 80]), c = pick([80, 90, 100, 110]), T = n * c;
      return { html: "", text: `Dot's train hauls <b>${fmt(T)} tonnes</b> in <b>${n} cars</b> that each hold the same amount. So ${n} × □ = ${fmt(T)}. How many tonnes does each car hold?`, choices: cards(c, [c + 10, c - 10, c * 2, n, c + 20, T / 100]), why: `${fmt(T)} ÷ ${n} = ${c} tonnes.` };
    }
  });

  // FACT CHECK: The Dominion Lands Act (1872) offered a homestead of 160 acres (a quarter section) for a $10 fee, if the settler lived on it, built a house and broke (cultivated) part of the land. The scene says "about 1900" and gives the rules in plain words.
  // FACT CHECK: 160 acres is about 65 hectares (64.75). The maths uses a quarter section of "about 64 hectares" and a square of about 800 m by 800 m (the real side is about 805 m). Check you are happy with the rounding.
  // FACT CHECK: Settlers came from Ukraine, Germany, Scandinavia, Britain, the United States, Iceland and many other places. Ukrainian settlement in Alberta began in the 1890s and was large from about 1896 to 1914. The scene says Lukas's great-great-grandparents came "more than 120 years ago".
  // FACT CHECK: Sod houses (soddies), built from blocks of prairie turf, were a common first home on the treeless prairies. Winters were brutal and neighbours could be kilometres apart.
  // FACT CHECK: Treaty 6 (1876) and Treaty 7 (1877) cover most of Alberta's farm country. The scene says Plains First Nations have lived here for thousands of years, that the land was opened to settlers after the treaties of the 1870s, and that First Nations families were moved onto reserves. Please check the wording is accurate and plain enough.
  // FACT CHECK: Grain elevator numbers. About 6,000 wooden elevators stood on the prairies at the peak (often given as nearly 6,000, in the 1930s). The scene says "only a few hundred are left". Teachers may want a current number for Alberta.
  // FACT CHECK: Prairie grain goes by rail to ports on the Pacific (Vancouver, Prince Rupert) and the Great Lakes (Thunder Bay), and ships carry it to other countries.
  // FACT CHECK: The dry years of the 1930s (the Dust Bowl on the Canadian prairies, hit hardest in southern Saskatchewan and southeastern Alberta). Drought plus ploughing under deep-rooted prairie grass let the soil blow away in dust storms. Farmers learned to plant shelter belts of trees, leave stubble on the fields and plough less deep. The scene does not give numbers.
  // FACT CHECK: Canola blooms bright yellow in July on the Alberta prairie.
  // FACT CHECK: Wheat has a bulk mass of roughly 0.77 tonnes per cubic metre. The question rounds this to "about 0.8 tonnes" so the answers come out whole.
  // FACT CHECK: A modern combine harvester cuts roughly 5 to 10 hectares an hour. Wheat yields in the question use 1 to 7 tonnes per hectare, and a grain hopper car holds roughly 100 tonnes (the questions use 80 to 110). Car and engine lengths of 20 m are rounded for the maths.
  // FACT CHECK: Word dyakuyu is the usual English spelling of the Ukrainian дякую (thank you), said roughly DYAH-koo-yoo.
  // FACT CHECK: French words: le blé (the wheat), le silo (the grain bin), la ferme (the farm), la moisson (the harvest), le train (the train).
  // FACT CHECK: From wheat country near Calgary the Rocky Mountains can be seen as a white line on the western horizon on a clear day.
  CHAPTERS[5] = { title: "Wheat and Sky", where: "Wheat country, Alberta", beats: [
    { art: "ws_arrive", word: ["le blé", "the wheat"], say: ["Last stop! This morning I left the Badlands on Dot's little train. She is the driver, her cars are full of grain, and I am sitting on top of one of them holding my hat.",
      "Out here the land is as flat as a pancake and as gold as a pancake too. It is a whole sea of <em>wheat</em>, which the French call <em>le blé</em>, all the way to the sky.",
      "In between are stripes of bright yellow. That is canola, and it is in flower in July. We are on the Alberta prairie, east of the Rocky Mountains, in farm country."] },
    { art: "ws_lukas", word: ["la ferme", "the farm"], say: ["Dot brakes beside a little town, and a boy waves from the gravel by the track. This is Lukas. His family grows wheat and canola on a farm just outside town.",
      "Lukas's great-great-grandparents came here from Ukraine more than 120 years ago to start that farm. Today his mom drives the combine, and Lukas helps in the busy weeks.",
      "In French, a farm is <em>la ferme</em>. Lukas learned it at school. He says it is easier to spell than combine."] },
    { art: "ws_window1", say: ["The window into the past! It is about 1900, and the government of Canada is offering settlers 160 acres, a <em>quarter section</em>, for a ten dollar fee. The rules were to live on it, build a house and break the land.",
      "People came from Ukraine, Germany, Scandinavia, Britain, the United States, Iceland and many other places. There were few trees, so the first home was often a <em>sod house</em>, made of blocks of prairie turf.",
      "Winters were brutal, and the nearest neighbour could be kilometres away. Lukas's great-great-grandparents began like this.",
      "This is Treaty 6 and Treaty 7 land. Plains First Nations have lived here for thousands of years, and still do. After the 1870s treaties it was opened to settlers, and First Nations families were moved onto reserves."] },
    { ask: "ws_homestead", intro: "Let's measure a homestead the way Lukas's family does, in hectares. Three right answers and we go to see the train." },
    { art: "ws_elevator", word: ["le silo", "the grain bin"], say: ["Dot's train rolls up beside a tall wooden building. This is a <em>grain elevator</em>. Farmers hauled their wheat here, where it was weighed, lifted to the top and stored in tall bins.",
      "When a train came, the grain poured down a chute into the rail cars. The railway carried it to ports on the Pacific and the Great Lakes, and ships took it around the world.",
      "Once there were about 6,000 of these wooden elevators on the prairies. Now only a few hundred are left, so Dot toots her whistle at this one every time.",
      "Today most grain is kept in round steel bins, which the French call <em>le silo</em>. They are cylinders with cone roofs, and they make a very good volume puzzle."] },
    { ask: "ws_bins", intro: "Dot's cars are being loaded, and the bins need measuring. Three right answers and the window opens again." },
    { art: "ws_window2", say: ["Back to the window, and now it is the 1930s. I will tell this one plainly. The rain stopped, year after year, and the fields turned dry.",
      "For thousands of years this land had been covered in prairie grass with deep roots. Farmers had ploughed much of it under. Without those roots, the dry soil turned to dust, and the wind carried it away.",
      "Huge black dust storms rolled over the farms. Crops failed, families lost their farms, and many people packed up and left.",
      "The families who stayed learned to protect the soil. They planted <em>shelter belts</em> of trees, left stubble on the fields and stopped ploughing so deep. Farms still use those ideas today."] },
    { ask: "ws_weather", intro: "Weather is a farmer's biggest worry, so let's work with chances and numbers. Three right answers and we pick a ride." },
    { art: "ws_choice", pick: "Lukas's mom is about to cut the wheat, and Dot's train is about to leave with a full load. Shall we ride in the combine harvester, or in the engine of the grain train?", options: [
      { label: "Ride in the combine", art: "ws_combine", word: ["la moisson", "the harvest"], say: ["Up the ladder and into the cab of the <em>combine harvester</em> with Lukas's mom! It cuts the wheat, shakes out the grain and drops the straw out the back, all in one pass. The seat is very high.",
        "This is <em>la moisson</em>, the harvest, the busiest time of the farm year. Gold dust floats everywhere, and I sneezed twice."] },
      { label: "Ride in the grain train", art: "ws_cab", word: ["le train", "the train"], say: ["Dot waves me into the engine, and the whole <em>train</em> rumbles out of town with its long line of grain cars behind us. I looked back and could not see the end of it.",
        "Dot lets me pull the whistle cord. Toot toot! The cows in the next field did not even look up. They have heard it all before."] }] },
    { ask: "ws_last", intro: "One last set of puzzles from our ride. Three right answers finishes the chapter, and the whole grade." },
    { art: "ws_goodbye", word: ["dyakuyu", "thank you in Ukrainian (дякую)"], say: ["We rolled west until a jagged white line rose along the edge of the sky. Those are the <em>Rocky Mountains</em>, still far away, but tall enough to see from here.",
      "This is where I say thank you. Thank you, Zoe, Kai, Jade, Tyson, Priya and Lukas. You each showed me your home, and I will remember every one.",
      "Lukas taught me how to say it in Ukrainian: <em>dyakuyu</em>. Then Dot pulled her whistle, and her little train turned back east with its grain, on the way to the ports.",
      "The clock is pointing up and over the mountains, to the Pacific and the far North. But that is another story. Tick tock!"] }
  ] };
}
