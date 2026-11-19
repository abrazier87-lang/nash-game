"use strict";
// Grade 8, Chapter 3: The Harbour and the Cedar. Vancouver: the cedar and the potlatch law, then the Komagata Maru in two voices.
{
  const GUIDE = WHO.simran;              // Simran: long hair and a purple hoodie
  const KAYLA = { hood: "#2a9d8f" };     // Kayla, Simran's best friend (Squamish Nation): long hair and a teal hoodie
  const TURBANS = ["#e8e1d0", "#3b82c4", "#f4b942", "#2b3a67", "#e63946", "#d9d0b8"];
  const fx = v => String(Math.round(v * 100) / 100);

  // ---------- my own drawing pieces ----------
  // a range of snowy mountains standing on the line y
  const mountains = y => `<g ${INKED}><path d="M-10 ${y} L50 ${y - 62} L90 ${y - 34} L150 ${y - 84} L215 ${y - 30} L270 ${y - 70} L330 ${y - 40} L380 ${y - 76} L410 ${y - 44} V${y} Z" fill="#7f9bb8"/></g>
    <g ${THIN} fill="#fff"><path d="M50 ${y - 62} L42 ${y - 50} L48 ${y - 53} L53 ${y - 48} L58 ${y - 53} L60 ${y - 50} Z"/><path d="M150 ${y - 84} L136 ${y - 60} L146 ${y - 66} L152 ${y - 58} L160 ${y - 66} L166 ${y - 60} Z"/><path d="M270 ${y - 70} L258 ${y - 52} L266 ${y - 57} L272 ${y - 50} L280 ${y - 57} L284 ${y - 52} Z"/><path d="M380 ${y - 76} L370 ${y - 60} L377 ${y - 64} L382 ${y - 58} L388 ${y - 64} L392 ${y - 60} Z"/></g>`;
  // a city skyline of tall blocks (x is the left end, y the ground)
  const skyline = (x, y, s) => `<g transform="translate(${x} ${y}) scale(${s})" ${THIN}>${[[0, 30, 14], [16, 48, 12], [30, 36, 16], [48, 60, 13], [63, 40, 14], [79, 52, 12], [93, 30, 16]].map(([bx, bh, bw], i) => `<rect x="${bx}" y="${-bh}" width="${bw}" height="${bh}" fill="${i % 2 ? "#9fb4c8" : "#b3c4d4"}"/>`).join("")}${[[19, 40], [51, 52], [82, 44]].map(([wx, wy]) => `<rect x="${wx}" y="${-wy}" width="3" height="3" fill="#fff" stroke="none"/>`).join("")}</g>`;
  // flat green ground along the bottom
  const land = (y, c) => `<g ${INKED}><path d="M-10 ${y} Q110 ${y - 16} 210 ${y} T410 ${y - 8} V250 H-10 Z" fill="${c || "#8cc084"}"/></g>`;
  // a container ship on the water (x middle, y the waterline): stacked containers and a bridge at the back
  const containerShip = (x, y, s) => { const cc = ["#e63946", "#3b82c4", "#f4b942", "#58b368", "#d9822b"];
    return `<g transform="translate(${x} ${y}) scale(${s})"><g ${INKED}><path d="M-74 -20 H74 L64 0 H-64 Z" fill="#2f3640"/><rect x="30" y="-46" width="26" height="26" fill="#f5f1e6"/><rect x="34" y="-56" width="18" height="10" fill="#f5f1e6"/><rect x="37" y="-52" width="12" height="4" fill="#bfe6f7" stroke="none"/></g>
      <g ${THIN}>${[3, 3, 2, 3, 3, 2].map((n, i) => Array.from({ length: n }, (_, r) => `<rect x="${-62 + i * 15}" y="${-28 - r * 8}" width="15" height="8" fill="${cc[(i + r * 2) % 5]}"/>`).join("")).join("")}</g></g>`; };
  // a small seaplane in the air (x, y the middle)
  const seaplane = (x, y, s) => `<g transform="translate(${x} ${y}) scale(${s})" ${INKED}><path d="M-20 -2 L-27 -13 L-15 -5 Z" fill="#e63946"/><ellipse cx="0" cy="0" rx="22" ry="7" fill="#fff"/><path d="M-6 -6 L14 -6 L10 -13 L-10 -13 Z" fill="#e63946"/><path d="M22 0 H27 M-12 7 V11 M8 7 V11" fill="none"/><rect x="-20" y="11" width="36" height="4" rx="2" fill="#e63946"/><circle cx="12" cy="-1" r="2" fill="#bfe6f7" stroke-width="1.2"/></g>`;
  // a wide plank house of cedar with a low sloped roof (x middle, y the ground)
  const plankHouse = (x, y, s) => `<g transform="translate(${x} ${y}) scale(${s})" ${INKED}><rect x="-70" y="-34" width="140" height="34" fill="#c89a5e"/><path d="M-78 -32 L-66 -52 H66 L78 -32 Z" fill="#a9703a"/><path d="M-76 -36 H76" fill="none" stroke-width="3"/><rect x="-9" y="-24" width="18" height="24" rx="8" fill="#4a3518"/></g>
    <g transform="translate(${x} ${y}) scale(${s})" stroke="#7a5326" stroke-width="1.2" opacity=".7" fill="none">${Array.from({ length: 13 }, (_, i) => i === 6 ? "" : `<path d="M${-66 + i * 11} -33 V-1"/>`).join("")}<path d="M-60 -44 H60 M-54 -48 H54"/></g>`;
  // a great red cedar: a wide fluted trunk and drooping layers of boughs (x middle, y the ground)
  const cedarTree = (x, y, s) => `<g transform="translate(${x} ${y}) scale(${s})" ${INKED}><path d="M-15 0 Q-9 -16 -7 -60 H7 Q9 -16 15 0 Z" fill="#9a5f3a"/><path d="M-4 -3 V-27 M4 -3 V-27 M-11 -2 Q-8 -14 -6 -26" fill="none" stroke="#6a3f22" stroke-width="1.4"/>
    <path d="M-40 -40 Q0 -54 40 -40 Q44 -30 34 -28 Q0 -36 -34 -28 Q-44 -30 -40 -40 Z" fill="#2f6f4a"/><path d="M-32 -62 Q0 -76 32 -62 Q36 -52 27 -50 Q0 -58 -27 -50 Q-36 -52 -32 -62 Z" fill="#3a8057"/><path d="M-24 -82 Q0 -94 24 -82 Q28 -73 20 -71 Q0 -78 -20 -71 Q-28 -73 -24 -82 Z" fill="#2f6f4a"/><path d="M-14 -100 Q0 -112 14 -100 Q16 -92 10 -90 Q0 -96 -10 -90 Q-16 -92 -14 -100 Z" fill="#3a8057"/><path d="M0 -122 Q8 -110 10 -100 H-10 Q-8 -110 0 -122 Z" fill="#2f6f4a"/></g>`;
  // a long carved cedar canoe from the side, n paddlers sitting in a row (tops: their shirt colours)
  const longCanoe = (x, y, s, n, tops) => { const px = Array.from({ length: n }, (_, i) => n === 1 ? 0 : -58 + i * 116 / (n - 1));
    return `<g transform="translate(${x} ${y}) scale(${s})">${px.map((p, i) => paddler(p, -2, 1, tops ? { top: tops[i % tops.length] } : {})).join("")}<g ${INKED}><path d="M-86 -12 Q-96 -30 -82 -32 Q-72 -8 0 -4 Q72 -8 82 -32 Q96 -30 86 -12 Q72 10 0 10 Q-72 10 -86 -12 Z" fill="#c98f58"/><path d="M-80 -7 Q0 0 80 -7" fill="none" stroke="#7a4a24" stroke-width="3"/></g></g>`; };
  // a 1914 steamship: a black hull, one funnel, two masts, and people crowding every rail (x middle, y the waterline)
  const steamship = (x, y, s) => { const heads = [];
    for (let i = 0; i < 23; i++) heads.push(`<circle cx="${-88 + i * 7.7}" cy="-31" r="3.2" fill="#b9794a"/><ellipse cx="${-88 + i * 7.7}" cy="-35" rx="4" ry="2.8" fill="${TURBANS[i % 6]}"/>`);
    for (let i = 0; i < 9; i++) heads.push(`<circle cx="${-36 + i * 10}" cy="-40" r="3.2" fill="#b9794a"/><ellipse cx="${-36 + i * 10}" cy="-44" rx="4" ry="2.8" fill="${TURBANS[(i + 2) % 6]}"/>`);
    return `<g transform="translate(${x} ${y}) scale(${s})"><g ${THIN}><path d="M-76 -26 V-80 M76 -26 V-82 M-84 -66 H-68 M68 -68 H84" fill="none" stroke-width="2"/></g>
      <g ${INKED}><rect x="4" y="-96" width="18" height="36" fill="#2b2b2b"/><rect x="4" y="-84" width="18" height="5" fill="#e8e1d0" stroke-width="1.4"/><rect x="-14" y="-62" width="42" height="10" fill="#f5f1e6"/><rect x="-40" y="-52" width="90" height="26" fill="#f5f1e6"/><path d="M-92 0 L-98 -26 H98 Q96 -10 84 0 Z" fill="#2f3640"/></g>
      <path d="M13 -100 q-8 -8 0 -14 q8 -6 0 -12" fill="none" stroke="#fff" stroke-width="4.5" stroke-linecap="round" opacity=".8"/><g ${THIN}>${heads.join("")}</g></g>`; };
  // a little rowing boat with one person in it
  const rowboat = (x, y, c) => `${person(x, y - 11, .32, c)}<g transform="translate(${x} ${y})" ${THIN}><path d="M-17 0 L-13 -7 H13 L17 0 Q0 8 -17 0 Z" fill="#c98f58"/></g>`;
  // the head and shoulders of a passenger in a turban
  const bust = (x, y, s, turban, shirt) => `<g transform="translate(${x} ${y}) scale(${s})" ${THIN}><path d="M-14 26 Q-14 8 0 8 Q14 8 14 26 Z" fill="${shirt}"/><circle cx="0" cy="0" r="8.5" fill="#b9794a"/><ellipse cx="0" cy="-8" rx="10" ry="7" fill="${turban}"/><path d="M-7 -9 Q0 -14 7 -9" fill="none" stroke-width="1.2"/><circle cx="-3" cy="2" r="1.2" fill="#2b1a10" stroke="none"/><circle cx="3" cy="2" r="1.2" fill="#2b1a10" stroke="none"/><path d="M-3 6 H3" fill="none" stroke-width="1"/></g>`;
  // an immigration officer of 1914: a dark coat, a peaked cap and a clipboard
  const officer = (x, y, s) => `${person(x, y, s, "#2f3a55")}<g transform="translate(${x} ${y}) scale(${s})" ${THIN}><path d="M-8 -13 Q-8 -25 0 -25 Q8 -25 8 -13 Z" fill="#2b3a67"/><rect x="-10" y="-14" width="20" height="4" rx="2" fill="#1e2a4a"/><rect x="7" y="8" width="12" height="16" rx="1.5" fill="#f4f1e8"/><path d="M10 12 H17 M10 16 H17 M10 20 H15" fill="none" stroke-width="1"/></g>`;
  // Simran's grandfather: a navy turban and a white beard
  const grandpa = (x, y, s) => `${person(x, y, s, "#9fc4dd")}<g transform="translate(${x} ${y}) scale(${s})" ${THIN}><ellipse cx="0" cy="-15" rx="10" ry="7.5" fill="#2b3a67"/><path d="M-6 -4 Q0 8 6 -4 Q4 4 0 5 Q-4 4 -6 -4 Z" fill="#eeeeee"/></g>`;
  // the memorial on the waterfront: a low curved wall, a tall slab with a small ship on it, and marigolds (x middle, y the ground)
  const memorial = (x, y, s) => `<g transform="translate(${x} ${y}) scale(${s})"><g ${INKED}><path d="M-46 0 V-22 Q0 -34 46 -22 V0 Z" fill="#b9b3a6"/><rect x="-10" y="-56" width="20" height="56" rx="2" fill="#a3abb6"/><path d="M-8 -34 H8 L5 -28 H-5 Z" fill="#2f3640" stroke-width="1.2"/></g>
    <rect x="-2" y="-42" width="4" height="8" fill="#2f3640"/><g stroke="#6a6f7a" stroke-width="1.6" opacity=".7"><path d="M-38 -14 H-14 M-38 -9 H-18 M14 -14 H38 M18 -9 H38"/></g>
    <g ${THIN}><circle cx="-30" cy="1" r="3.6" fill="#f79a2e"/><circle cx="-21" cy="3" r="3.6" fill="#f4b942"/><circle cx="29" cy="2" r="3.6" fill="#f4b942"/><circle cx="21" cy="4" r="3.6" fill="#f79a2e"/></g></g>`;

  // ---------- the windows into the past ----------
  // look 1: the shore before the city, with cedar trees, a plank house and a canoe
  const cedarLong = `<rect width="400" height="240" fill="#f6e3b4"/><g ${INKED}><path d="M130 142 Q236 124 342 142 V250 H130 Z" fill="#a9cf86"/></g>${cedarTree(170, 140, .62)}${cedarTree(198, 136, .42)}${cedarTree(300, 138, .6)}${plankHouse(250, 150, .5)}${person(214, 128, .38, "#c98f58")}${person(282, 130, .36, "#b98b54")}
    <g ${INKED}><path d="M130 172 Q236 160 342 174 V250 H130 Z" fill="#6cc0ea"/></g>${longCanoe(236, 188, .42, 3)}`;
  // look 2, the officer's view: a wharf, a steamship waiting in the water behind it, and an officer with his papers
  const komA = `<rect width="400" height="240" fill="#dfe6ea"/><g ${INKED}><path d="M100 132 H300 V162 H100 Z" fill="#7aa9c4"/></g>${steamship(168, 146, .6)}<g ${INKED}><path d="M100 164 H300 V250 H100 Z" fill="#a9703a"/></g>
    <g stroke="#7a5326" stroke-width="1.2" opacity=".7">${[120, 150, 180, 210, 240, 270].map(lx => `<line x1="${lx}" y1="164" x2="${lx}" y2="240"/>`).join("")}</g>${officer(244, 112, 1.4)}`;
  // look 2, the passenger's view: faces at the rail, the harbour, little boats, and the city and mountains across the water
  const komB = `<rect width="400" height="240" fill="#e1ecf3"/>${mountains(126)}<g ${INKED}><path d="M100 126 H300 V250 H100 Z" fill="#7aa9c4"/></g>${skyline(150, 126, .9)}${rowboat(160, 142, "#3b82c4")}${rowboat(252, 147, "#e63946")}
    ${bust(150, 172, 1.1, TURBANS[1], "#e8e1d0")}${bust(184, 176, 1.1, TURBANS[2], "#d9d0b8")}${bust(218, 172, 1.1, TURBANS[3], "#e8e1d0")}${bust(252, 176, 1.1, TURBANS[4], "#d9d0b8")}
    <g ${INKED}><rect x="90" y="186" width="220" height="60" fill="#4a3518"/><rect x="90" y="182" width="220" height="7" rx="3" fill="#8a5a2b"/></g>`;

  // ---------- the pictures ----------
  Object.assign(ART, {
    hc_arrive: () => frame(`${sky("#9fd8f2", "#f4f1d8", [350, 34, 18], [[210, 30, .7], [300, 58, .6]])}${mountains(112)}${water(114, "#5db7e6")}<g ${INKED}><path d="M150 112 Q260 100 410 110 V124 Q280 132 150 122 Z" fill="#8cc084"/></g>${tree(176, 114, .7, "#3f9a58")}${tree(198, 116, .6)}${skyline(262, 112, 1.1)}${seaplane(190, 52, .9)}${containerShip(236, 200, .95)}${riding(26, 14, 104)}`),
    hc_simran: () => frame(`${sky("#9fd8f2", "#f4f1d8", [350, 34, 18], [[90, 34, .7], [200, 26, .6]])}${mountains(116)}${water(120, "#5db7e6")}${skyline(250, 120, 1)}${containerShip(92, 146, .5)}${seaplane(310, 56, .8)}${land(166)}${tree(354, 164, 1.1, "#3f9a58")}${tree(378, 170, .9)}${owlAt(34, 126, 104)}${kidAt(244, 146, 1, GUIDE)}`),
    hc_window1: () => frame(`${sky("#9fd8f2", "#f4f1d8", null, [[60, 40, .7]])}${land(196, "#a9cf86")}${windowAt(236, 112, 92, cedarLong)}${owlAt(0, 130, 88)}${kidAt(104, 146, .85, GUIDE)}${kidAt(142, 154, .8, KAYLA)}`),
    hc_today: () => frame(`${sky("#9fd8f2", "#f4f1d8", [350, 34, 18], [[100, 34, .7], [230, 26, .6]])}${mountains(118)}${water(122, "#5db7e6")}${land(170)}${plankHouse(318, 200, .85)}${owlAt(8, 128, 100)}${kidAt(140, 148, .95, GUIDE)}${kidAt(196, 152, .9, KAYLA)}`),
    hc_officer: () => frame(`${sky("#cdd9df", "#efe6c8", null, [[60, 40, .7], [340, 52, .6]])}${water(196, "#7aa9c4")}${windowAt(200, 116, 92, komA)}`),
    hc_passenger: () => frame(`${sky("#cdd9df", "#efe6c8", null, [[60, 40, .7], [340, 52, .6]])}${water(196, "#7aa9c4")}${windowAt(200, 116, 92, komB)}`),
    hc_choice: () => frame(`${sky("#9fd8f2", "#f4f1d8", [350, 34, 18], [[200, 30, .7], [290, 54, .6]])}${mountains(118)}${water(124, "#5db7e6")}${longCanoe(86, 176, .62, 5, ["#ff8a3d", "#2a9d8f", "#8e5bd0"])}<g ${INKED}><path d="M150 176 Q260 156 410 164 V250 H150 Z" fill="#8cc084"/></g>${memorial(336, 200, .9)}${owlAt(160, 132, 92)}${kidAt(262, 150, .9, GUIDE)}`),
    hc_canoe: () => frame(`${sky("#9fd8f2", "#f4f1d8", [60, 36, 18], [[210, 30, .7], [330, 46, .6]])}${mountains(118)}${water(126, "#5db7e6")}<g ${INKED}><path d="M-10 196 Q50 184 120 200 V250 H-10 Z" fill="#8cc084"/></g>${longCanoe(332, 150, .5, 3)}${longCanoe(222, 196, 1, 6, ["#ff8a3d", "#2a9d8f", "#ff8a3d", "#8e5bd0", "#ff8a3d", "#ff8a3d"])}${owlAt(10, 128, 84)}`),
    hc_memorial: () => frame(`${sky("#cdd9df", "#efe6c8", [60, 36, 16], [[200, 34, .7], [320, 48, .6]])}${mountains(118)}${water(124, "#5db7e6")}${containerShip(222, 144, .45)}${land(168)}${memorial(312, 204, 1.25)}${owlAt(8, 130, 98)}${kidAt(126, 150, .9, GUIDE)}${grandpa(184, 152, 1.05)}`),
    hc_goodbye: () => frame(`${sky("#ffd9a0", "#fdebd0", [70, 60, 20], [[210, 34, .7], [340, 30, .6]])}${mountains(124)}${water(128, "#6cc0ea")}${land(172)}${balloonAt(250, 14, 84)}${owlAt(24, 130, 100)}${kidAt(150, 150, .95, GUIDE)}${kidAt(196, 154, .9, KAYLA)}`)
  });

  // ---------- the questions ----------
  Object.assign(ASK, {
    hc_solid() { // surface area and volume of prisms and cylinders: planks, containers and a log
      const kind = rand(3);
      if (kind === 0) { const l = pick([200, 300, 400]), w = pick([20, 25, 30]), t = pick([4, 5, 6]), V = l * w * t;
        return { html: "", text: `A cedar plank for a house wall is <b>${l} cm</b> long, <b>${w} cm</b> wide and <b>${t} cm</b> thick. What is its volume?`, choices: textCards(`${fmt(V)} cm³`, [l * w, l + w + t, 2 * (l * w + l * t + w * t), V / 2, V * 10].map(v => `${fmt(v)} cm³`)), why: `Volume = length × width × thickness = ${l} × ${w} × ${t} = ${fmt(V)} cm³.` }; }
      if (kind === 1) { const [l, w, h] = pick([[6, 2, 2], [6, 2, 3], [12, 2, 2], [12, 2, 3]]), SA = 2 * (l * w + l * h + w * h), V = l * w * h;
        return { html: "", text: `A shipping container is <b>${l} m</b> long, <b>${w} m</b> wide and <b>${h} m</b> tall. How much steel covers the outside (the surface area)?`, choices: textCards(`${SA} m²`, [V, SA / 2, 2 * (l * w + l * h), 2 * l * w + w * h, SA + l * w].map(v => `${v} m²`)), why: `Surface area = 2(lw + lh + wh) = 2(${l * w} + ${l * h} + ${w * h}) = ${SA} m².` }; }
      const r = pick([1, 2]), L = pick([2, 3, 5]), V = 3.14 * r * r * L;
      return { html: "", text: `A cedar log is a cylinder with a radius of <b>${r} m</b> and a length of <b>${L} m</b>. Use 3.14 for pi. What is its volume?`, choices: textCards(`${fx(V)} m³`, [3.14 * r * r, 3.14 * 2 * r * L, r * r * L, 3.14 * r * L, V * 2, 3.14 * L].map(v => `${fx(v)} m³`)), why: `Volume = 3.14 × r × r × length = 3.14 × ${r} × ${r} × ${L} = ${fx(V)} m³.` };
    },
    hc_ratio() { // percent, proportion, and a straight-line graph read by tapping
      const kind = rand(3);
      if (kind === 0) { const N = pick([200, 400, 500, 800]), p = pick([10, 15, 25, 40]), n = N * p / 100;
        return { html: "", text: `A container ship carries <b>${N}</b> containers. <b>${p}%</b> of them are refrigerated. How many refrigerated containers is that?`, choices: cards(n, [N - n, p, n * 2, n + 10, n - 10]), why: `${p}% of ${N} = ${p} ÷ 100 × ${N} = ${n} containers.` }; }
      if (kind === 1) { const v = pick([3, 4, 5]), t = pick([10, 20]), u = pick([30, 40, 50, 60]), a = v * t, n = v * u;
        return { html: "", text: `A seaplane flies <b>${a} km</b> in <b>${t} minutes</b>. At the same speed, how far does it fly in <b>${u} minutes</b>?`, choices: cards(n, [a + u, n + v, n - v, a * 2, n * 2]), why: `${a} ÷ ${t} = ${v} km every minute. ${v} × ${u} = ${n} km.` }; }
      const { b, m, ys } = pick([{ b: 8, m: 1, ys: 2 }, { b: 8, m: 2, ys: 2 }, { b: 10, m: 2, ys: 2 }]), xm = b / m,
        base = [[xm, 0], [0, b], [xm / 2, b / 2], [xm, b / 2]], order = shuffle([0, 1, 2, 3]), spots = order.map(i => base[i]), right = order.indexOf(0);
      return { tap: true, html: graph({ xmax: xm, ymax: b, xstep: 1, ystep: ys, xl: "hours", yl: "litres left", line: [-m, b], spots }), text: `A canoe family starts with a water barrel holding <b>${b} litres</b> and drinks <b>${m} litre${m > 1 ? "s" : ""}</b> every hour. Tap the point where the barrel is empty.`,
        choices: spots.map((s, i) => ({ pick: String(i), ok: i === right })), why: `The line reaches 0 litres at ${xm} hours, because ${b} ÷ ${m} = ${xm}.` };
    },
    hc_water(g) { // the case file: the water on the ship, in three linked steps
      const c = (g && g.case) || {};
      if (!c.set) { c.set = true; c.per = pick([2, 3, 4]); c.D = pick([8, 10, 12]); c.u = pick([2, 3, 4]); }
      const per = c.per, D = c.D, u = c.u, daily = 376 * per, T = daily * D, left = T - daily * u, more = D - u, step = g ? g.stars || 0 : rand(3);
      if (step === 0) {
        return { html: "", text: `Imagine the ship's water supply. All <b>376</b> people need <b>${per} litres</b> each, every day. How many litres does the ship use in one day?`, choices: cards(daily, [376 + per, 376 * (per + 1), daily - 376, daily + 100, daily / 2]), why: `376 × ${per} = ${fmt(daily)} litres a day.` };
      }
      if (step === 1) {
        return { html: "", text: `The water tanks held <b>${fmt(T)} litres</b> at the start. The ship uses <b>${fmt(daily)} litres</b> a day. How many litres are left after <b>${u} days</b>?`, choices: cards(left, [daily * u, T - daily, T + daily * u, left + daily, left - daily]), why: `${u} days use ${u} × ${fmt(daily)} = ${fmt(daily * u)} litres. ${fmt(T)} − ${fmt(daily * u)} = ${fmt(left)} litres left.` };
      }
      return { html: "", text: `Now <b>${fmt(left)} litres</b> are left, and the ship uses <b>${fmt(daily)} litres</b> a day. For how many more days will the water last?`, choices: cards(more, [more + 1, more - 1, D, u, more + 2]), why: `${fmt(left)} ÷ ${fmt(daily)} = ${more} more days.` };
    },
    hc_last(g) { // follows the choice: the canoe journey (0) or the memorial (1)
      const way = g && g.choice ? 1 : 0, kind = rand(3);
      if (way === 0) {
        if (kind === 0) { const v = pick([4, 5, 6]), t = pick([2, 3, 4]), d = v * t;
          return { html: "", text: `Kayla's family paddles at <b>${v} km/h</b> for <b>${t} hours</b>. How many kilometres do they travel?`, choices: cards(d, [v + t, d + v, d - v, d + t, d * 2]), why: `Distance = speed × time = ${v} × ${t} = ${d} km.` }; }
        if (kind === 1) { const [a, b, h] = pick([[3, 4, 5], [6, 8, 10], [5, 12, 13]]);
          return { html: "", text: `Two canoes leave the same dock. One paddles <b>${a} km</b> east and the other <b>${b} km</b> north. In a straight line, how far apart are they?`, choices: cards(h, [a + b, h + 1, h - 1, h + 2, a * b]), why: `The paths make a right triangle. ${a}² + ${b}² = ${a * a} + ${b * b} = ${h * h}, and the square root of ${h * h} is ${h} km.` }; }
        const c = pick([3, 4]), n = pick([5, 6, 7, 8]), T = c * n + 1;
        return { html: "", text: `<b>${c}</b> canoes each carry the same number of paddlers, and a safety boat carries <b>1</b> more person. There are <b>${T}</b> people in all. How many paddlers are in each canoe?`, choices: cards(n, [c * n, T / c, n + 1, n - 1, T - c]), why: `${c}n + 1 = ${T}, so ${c}n = ${T - 1} and n = ${T - 1} ÷ ${c} = ${n}.` };
      }
      if (kind === 0) {
        return { html: "", text: `The Komagata Maru waited in the harbour from 23 May to 23 July 1914. May has <b>31</b> days and June has <b>30</b>. How many days is that, from 23 May to 23 July?`, choices: cards(61, [60, 62, 59, 30, 31]), why: `23 May to 23 June is 31 days. 23 June to 23 July is 30 days. 31 + 30 = 61 days.` };
      }
      if (kind === 1) {
        return { html: "", text: `Of the <b>376</b> passengers on the Komagata Maru, only about <b>20</b> were allowed to land. About what percent is that? Round to the nearest whole percent.`, choices: textCards("5%", ["20%", "2%", "10%", "15%", "50%"]), why: `20 ÷ 376 is about 0.053, so about 5%. About 95% were not allowed to land.` };
      }
      return { html: "", text: `The ship was sent away in <b>1914</b>. The Prime Minister of Canada apologized in Parliament in <b>2016</b>. How many years later was that?`, choices: cards(102, [100, 98, 112, 92, 103]), why: `2016 − 1914 = 102 years.` };
    }
  });

  // FACT CHECK (all of this chapter should be read before it is used, see the READERS line below).
  // FACT CHECK: The city of Vancouver stands on the traditional land of the Musqueam, Squamish and Tsleil-Waututh Nations (Coast Salish peoples). They have lived here for thousands of years and live here today. The land was never given up by treaty ("unceded"). Check the wording with people from the three nations.
  // FACT CHECK: Kayla (Squamish Nation) and Simran (Sikh family, great-great-grandfather from Punjab) are made-up children. Kayla and Simran are drawn, and speak only through Dr. Somebody. Simran's grandfather is also invented.
  // FACT CHECK: Coast Salish peoples built houses of cedar planks, carved canoes from single cedar logs, wove cedar bark into clothing, rope and baskets, and wove blankets. The scene says "great houses of long planks with low sloped roofs": check the roof shape with Coast Salish readers (the picture is a simple plank house, not a particular house type).
  // FACT CHECK: The potlatch, as told here: a host feeds guests for days and gives away wealth, giving (not keeping) shows a family's standing, and the guests are witnesses who remember what was done. Outsiders gave the gathering that name. Nothing is said about its inner meanings. Check that the short description is acceptable.
  // FACT CHECK: Canada's law against the potlatch: from 1885 to 1951, which is 66 years. People were arrested and jailed, and masks, blankets and other treasures were taken and many were sent to museums. Families kept holding gatherings in secret. Since 1951 they have been held openly, and some of the things that were taken have been returned.
  // FACT CHECK: The Komagata Maru arrived in Vancouver harbour on 23 May 1914 with 376 passengers from Punjab, most of them Sikhs, with Muslims and Hindus too. They were British subjects and many had served in the British army.
  // FACT CHECK: The "continuous journey" rule (1908) said immigrants had to come to Canada by one continuous journey from their country of birth or citizenship. No steamship sailed directly from India, so the rule shut out South Asians without naming them.
  // FACT CHECK: The passengers were held on board for two months within sight of the city, with food and water running short. The local South Asian community raised money and took the case to court. On 23 July 1914 the ship was forced to leave, with the navy ship HMCS Rainbow nearby (its guns pointed at the Komagata Maru). The text says "a navy ship's guns".
  // FACT CHECK: "Only about 20 passengers were ever allowed ashore": about 20 who could prove they had lived in Canada before (some sources say 24, including a doctor and his family). The story says "about 20". The count is also used in a question: 20 of 376 is about 5.3 percent.
  // FACT CHECK: The days between 23 May and 23 July 1914 are 61 (31 days to 23 June, then 30 days to 23 July).
  // FACT CHECK: When the ship reached Budge Budge (near Calcutta, now Kolkata, India), police tried to arrest the passengers and about 20 of them were shot and killed (sources say 19 or 20). The text says "about 20".
  // FACT CHECK: On 18 May 2016 the Prime Minister of Canada apologized in the House of Commons (Parliament) for the Komagata Maru. 2016 − 1914 = 102 years. A memorial to the Komagata Maru stands on the waterfront in Vancouver. The picture of it (a low wall, a tall slab and a tiny ship) is simple and invented, not a copy of the real memorial.
  // FACT CHECK: The officer and the passenger are imaginary people who speak for how each side saw it. The officer's lines (applying the rule as written, and many people in the city wanting Canada kept for people like themselves) follow the public mood of 1914. Read both with Sikh community readers.
  // FACT CHECK: Canoe journeys are held today (the Tribal Journeys and other canoe gatherings along the coast).
  // FACT CHECK: Punjabi greeting "sat sri akal" (a Sikh greeting, often said to mean "truth is eternal" or "God is truth"). The chapter says only "a Sikh greeting". Check the spelling.
  // FACT CHECK: French words: le port (the harbour), le cèdre (the cedar), la loi (the law), le navire (the ship), le canot (the canoe). No Coast Salish words except the nation names (Musqueam, Squamish, Tsleil-Waututh), which should be checked.
  // FACT CHECK: Burrard Inlet is the inlet on which the Vancouver harbour lies.
  // FACT CHECK: The water numbers in the case file (litres each per day, size of the tanks) are made up to suit the maths. Only the 376 people is a real number.
  // READERS: South Asian Canadian (Sikh community) readers for the Komagata Maru; Musqueam, Squamish or Tsleil-Waututh readers for the cedar and potlatch scenes.
  CHAPTERS[2] = { title: "The Harbour and the Cedar", where: "Vancouver", beats: [
    { art: "hc_arrive", word: ["le port", "the harbour"], say: ["Goodbye, Jordan, and goodbye, salmon! The Fraser River has carried us down out of the mountains, and now the water is wide and salty and the air smells of the sea.",
      "Below us is <em>Vancouver</em>, in British Columbia. Mountains with snowy tops stand behind the city, and a long blue inlet runs in front of it.",
      "Container ships wait on the water, and seaplanes buzz in and out like dragonflies. A place where ships come and go is <em>le port</em>, the harbour. This one is Burrard Inlet."] },
    { art: "hc_simran", word: ["sat sri akal", "a Sikh greeting"], say: ["This is Simran. She lives in Vancouver, and she has come down to the water to meet us. Her family is Sikh, and her great-great-grandfather came here from Punjab, in India.",
      "She greets us with <em>sat sri akal</em>, a Sikh greeting, and I say it back as well as an owl can.",
      "Simran tells us this city stands on the land of three Coast Salish nations, the <em>Musqueam</em>, the <em>Squamish</em> and the <em>Tsleil-Waututh</em>. They have lived here for thousands of years, and they live here today.",
      "She adds that this land was never given up by treaty. Her best friend Kayla is from the Squamish Nation, and Kayla wants to show us the cedar. Clock, show us!"] },
    { art: "hc_window1", word: ["le cèdre", "the cedar"], say: ["The window into the past! Long before the city, this shore is thick with giant trees. Kayla points at the biggest. It is a <em>cedar</em>, <em>le cèdre</em> in French.",
      "The Coast Salish peoples build great houses of long cedar planks, with low sloped roofs. They carve canoes from single cedar logs. They weave cedar bark into clothing, rope and baskets, and they weave blankets too.",
      "Families also hold great gatherings, which outsiders later called the <em>potlatch</em>. A host feeds the guests for days and gives away wealth. Giving, not keeping, shows a family's standing.",
      "The guests are the witnesses. They watch, and they remember what was done. Kayla says gatherings are held today too. Now for some solid shapes."] },
    { ask: "hc_solid", intro: "Cedar planks, great logs and shipping containers are all solid shapes. Three right answers and we come back to the city today." },
    { art: "hc_today", word: ["la loi", "the law"], say: ["Back in today, Kayla tells us a hard part of the story, and I listen. From 1885 to 1951, which is <em>66 years</em>, Canada's law made the potlatch a crime. A law is <em>la loi</em> in French.",
      "People were arrested and jailed. Masks, blankets and other treasures were taken from families and sent to museums.",
      "Families kept their gatherings going in secret. Since 1951 they have been held openly again, and some of the things that were taken have been returned.",
      "Simran listens too, and says nothing for a while. Then she says there is another story on this same harbour, about another law, and she wants us to hear it."] },
    { ask: "hc_ratio", intro: "Some plain numbers now. Three right answers and the window opens on the summer of 1914." },
    { who: "The immigration officer", art: "hc_officer", say: ["I am an immigration officer at the port of Vancouver. On 23 May 1914 a ship called the <em>Komagata Maru</em> comes into the harbour with <em>376</em> passengers from Punjab. I have my orders.",
      "Canada has a rule: immigrants must come by one continuous journey from their home country. No ship sails straight from India, so these passengers cannot meet it. The rule names no one. I am only applying it as written, and I will not let them land.",
      "I am told they are British subjects too. But many people in this city want them turned away, and want Canada kept for people like themselves. They tell me so loudly. I do not make the law."] },
    { who: "A passenger on the ship", art: "hc_passenger", say: ["I sailed on the <em>Komagata Maru</em> from Punjab. Most of us are Sikhs, with Muslims and Hindus too. We are British subjects, like people in Canada, and many of us served in the British army.",
      "For two months they hold us on board, within sight of the city. Our food and water run short. People here, our own South Asian community, raise money for us and take our case to court.",
      "On 23 July 1914 they force us to sail away, with a navy ship's guns pointed at us. Only about 20 of us, who had lived in Canada before, are ever allowed ashore."] },
    { art: "hc_simran", say: ["The window closes, and I am quiet for a while. Then Simran tells me the rest. When the ship reached India, police tried to arrest the passengers at a place called <em>Budge Budge</em>. About 20 of them were shot and killed.",
      "In 2016 the Prime Minister of Canada stood in Parliament and apologized for what was done to the people on that ship.",
      "Simran's family is here today, and a memorial to the Komagata Maru stands on the harbour. Simran says the ship waited two months with its water running out. That is a problem we can look at plainly."] },
    { ask: "hc_water", intro: "This is a case file, three steps about a real problem on the ship: the water. Each answer is used in the next step. Three right answers and we go on." },
    { art: "hc_choice", pick: "Simran and Kayla each have somewhere to take us. Shall we paddle with Kayla's family in a cedar canoe on the inlet, or visit the memorial with Simran's grandfather?", options: [
      { label: "Paddle with Kayla's family", art: "hc_canoe", word: ["le canot", "the canoe"], say: ["Kayla's family invites us into a long cedar canoe, and we paddle out onto the inlet in life jackets. Canoe journeys are held today, and the mountains slide slowly past.",
        "A canoe is <em>le canot</em> in French. Everyone paddles together, and Kayla's family sets the pace."] },
      { label: "Visit the memorial with Simran's grandfather", art: "hc_memorial", word: ["le navire", "the ship"], say: ["Simran's grandfather meets us at the waterfront. He walks us to the memorial to the Komagata Maru, which stands on the harbour and looks out over the water where the ship waited.",
        "A ship is <em>le navire</em> in French. We stand there quietly for a while, and nobody feels like talking."] }] },
    { ask: "hc_last", intro: "A last set of problems from our time on the harbour. Three right answers and we say goodbye." },
    { art: "hc_goodbye", say: ["The sun is going down behind the mountains, and the lights of the ships are coming on. Simran and Kayla stand side by side.",
      "There are two stories on one harbour, the cedar and the ship. Both are about laws that told people they did not belong, and both are told today by the people who carry them. Thank you, Simran and Kayla.",
      "Next the clock turns inland, to the dry hills of the interior. There is a story there that every child in Canada should hear. I will listen more than I talk.",
      "It is called <em>Every Child Matters</em>. Tick tock!"] }
  ] };
}
