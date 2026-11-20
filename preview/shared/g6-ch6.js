"use strict";
// Grade 6, Chapter 6: The Edge of the Map. St. John's, Newfoundland: painted houses, icebergs, the Norse, the cod, and the goodbye at Cape Spear.
{
  const DECLAN = { hood: "#e8742c", short: true };                                  // this chapter's child guide: short hair, a rust-orange hoodie
  const WALLS = ["#e63946", "#f4b942", "#3b82c4", "#58b368", "#8e5bd0", "#ff8a3d", "#2aa7a0"];
  const ROOFS = ["#3b82c4", "#e63946", "#5a6470", "#8a5a2b"];

  // a row of brightly painted wooden houses stepping up a hill to the right (x: left edge of the first house, y: the foot of its wall)
  const houseRow = (x, y, n, w, h, dy) => {
    const y2 = y - (410 - (x - 8)) * dy / (w + 3);
    return `<g ${INKED}><path d="M${x - 8} ${y} L410 ${y2.toFixed(1)} V250 H${x - 8} Z" fill="#7dbb7a"/></g>` + Array.from({ length: n }, (_, i) => {
      const hx = x + i * (w + 3), hy = y - i * dy - h, wall = WALLS[i % WALLS.length], roof = ROOFS[(i * 3 + 1) % ROOFS.length];
      return `<g ${INKED}><rect x="${hx}" y="${hy}" width="${w}" height="${h}" fill="${wall}"/><polygon points="${hx - 3},${hy} ${hx + w / 2},${hy - w * .55} ${hx + w + 3},${hy}" fill="${roof}"/></g>
        <g ${THIN}><rect x="${hx + w * .1}" y="${hy + h * .15}" width="${w * .26}" height="${h * .28}" fill="#fff6c9"/><rect x="${hx + w * .64}" y="${hy + h * .15}" width="${w * .26}" height="${h * .28}" fill="#fff6c9"/><rect x="${hx + w * .38}" y="${hy + h * .5}" width="${w * .24}" height="${h * .5}" fill="#fbf6ea"/></g>`;
    }).join("");
  };
  // an iceberg: x is the middle, y the waterline. With below=true the big pale-blue part under the water is drawn too
  const iceberg = (x, y, s, below) => `<g transform="translate(${x} ${y}) scale(${s})">${below ? `<path d="M-34 0 Q-56 36 -38 64 Q-16 94 18 88 Q56 76 36 0 Z" fill="#cfeaf8" stroke="#2b1a10" stroke-width="2" stroke-linejoin="round" opacity=".85"/>` : ""}
    <g ${INKED}><path d="M-34 0 L-26 -18 L-14 -24 L-4 -46 L8 -30 L20 -36 L34 0 Z" fill="#fff"/></g><path d="M-4 -46 L-2 -20 L8 -30 Z" fill="#cfeaf8"/><path d="M-26 -18 L-14 -24 L-16 -4 Z" fill="#e3f3fb"/>
    <path d="M-42 1 q8 -4 16 0 t16 0 t16 0 t16 0 t16 0" fill="none" stroke="#fff" stroke-width="2.2" stroke-linecap="round" opacity=".85"/></g>`;
  // a puffin: black back, white front, a big orange beak and orange feet. x is the middle, y the feet. flip faces it left
  const puffin = (x, y, s, flip) => `<g transform="translate(${x} ${y}) scale(${flip ? -s : s} ${s})" ${THIN}><path d="M-12 -8 L-20 -2 L-8 -3 Z" fill="#2b1a10"/><ellipse cx="-5" cy="-1.5" rx="5.5" ry="2.6" fill="#ff8a3d"/><ellipse cx="6" cy="-1.5" rx="5.5" ry="2.6" fill="#ff8a3d"/>
    <ellipse cx="0" cy="-18" rx="13" ry="17" fill="#2b1a10"/><ellipse cx="4" cy="-15" rx="8.5" ry="13" fill="#fff"/><circle cx="4" cy="-35" r="9.5" fill="#2b1a10"/><ellipse cx="8" cy="-33" rx="6.5" ry="5.5" fill="#f4f4f4"/><circle cx="9" cy="-35" r="1.8" fill="#2b1a10"/>
    <path d="M13 -38 L28 -32 L13 -27 Z" fill="#ff8a3d"/><path d="M19 -35.5 L19 -29.6" fill="none" stroke="#ffd84d" stroke-width="2"/></g>`;
  // a Norse sod house: a low green mound of turf with a wooden door
  const sodHouse = (x, y, s) => `<g transform="translate(${x} ${y}) scale(${s})" ${INKED}><path d="M-38 0 Q-38 -32 0 -34 Q38 -32 38 0 Z" fill="#7fb35a"/><path d="M-12 0 V-14 Q0 -24 12 -14 V0 Z" fill="#8a5a2b"/></g>
    <g transform="translate(${x} ${y}) scale(${s})" fill="none" stroke="#4f8a3a" stroke-width="2" stroke-linecap="round"><path d="M-28 -12 q4 -6 8 0 M16 -20 q4 -6 8 0 M-8 -26 q3 -5 6 0 M24 -8 q3 -5 6 0"/></g>`;
  // a Norse longship with a square striped sail
  const longship = (x, y, s) => `<g transform="translate(${x} ${y}) scale(${s})" ${THIN}><path d="M0 -8 V-66" fill="none" stroke-width="3"/>${[-20, -10, 0, 10].map((sx, i) => `<rect x="${sx}" y="-62" width="10" height="38" fill="${i % 2 ? "#fbf6ea" : "#e63946"}"/>`).join("")}<path d="M-24 -62 H24" fill="none" stroke-width="3.4"/>
    <path d="M-46 -14 Q-52 -26 -44 -32 Q-40 -14 -30 -8 H30 Q40 -14 44 -32 Q52 -26 46 -14 Q36 6 0 6 Q-36 6 -46 -14 Z" fill="#8a5a2b" stroke-width="2.4"/>${[-24, -8, 8, 24].map(cx => `<circle cx="${cx}" cy="-1" r="3.6" fill="#f4b942"/>`).join("")}</g>`;
  // a drying rack (a flake) with salted cod laid out on top
  const flake = (x, y, w) => `<g ${THIN}><rect x="${x + 3}" y="${y - 18}" width="4" height="18" fill="#8a5a2b"/><rect x="${x + w - 7}" y="${y - 18}" width="4" height="18" fill="#8a5a2b"/><rect x="${x}" y="${y - 20}" width="${w}" height="5" fill="#a9784a"/>
    ${Array.from({ length: Math.floor(w / 11) }, (_, i) => `<ellipse cx="${x + 7 + i * 11}" cy="${y - 24}" rx="5.5" ry="2.8" fill="#e8c58a"/>`).join("")}</g>`;
  // a small fishing boat (a dory) with a fisher in it
  const dory = (x, y, s) => `${person(x - 2 * s, y - 27 * s, .45 * s, "#3b6ea5")}<g transform="translate(${x} ${y}) scale(${s})" ${INKED}><path d="M-32 -10 Q0 -2 32 -10 L24 6 H-24 Z" fill="#e63946"/><path d="M-30 -6 Q0 0 30 -6" fill="none" stroke="#fbf6ea" stroke-width="3"/></g>`;
  // a tour boat for looking at icebergs. open=true leaves the cabin off so people can stand on deck; boatFront is drawn over their feet
  const tourBoat = (x, y, s, open) => `<g transform="translate(${x} ${y}) scale(${s})" ${INKED}>${open ? "" : `<rect x="-14" y="-32" width="28" height="22" fill="#fbf6ea"/><rect x="-18" y="-37" width="36" height="6" fill="#3b82c4"/><rect x="-10" y="-27" width="8" height="8" fill="#bfe6f7"/><rect x="2" y="-27" width="8" height="8" fill="#bfe6f7"/><path d="M12 -37 V-52" fill="none"/><path d="M12 -52 h12 v7 h-12 z" fill="#ffd84d"/>`}
    <path d="M-40 -10 H40 Q34 10 20 12 H-26 Q-38 8 -40 -10 Z" fill="#e63946"/><path d="M-39 -5 H38" fill="none" stroke="#fbf6ea" stroke-width="3"/></g>`;
  const boatFront = (x, y, s) => `<g transform="translate(${x} ${y}) scale(${s})" ${INKED}><path d="M-39 -2 H39 Q34 10 20 12 H-26 Q-36 8 -39 -2 Z" fill="#e63946"/><path d="M-38 3 H37" fill="none" stroke="#fbf6ea" stroke-width="3"/></g>`;
  // the white lighthouse on Cape Spear with its red lantern. x is the middle, y the ground
  const lighthouse = (x, y, s) => `<g transform="translate(${x} ${y}) scale(${s})" ${INKED}><path d="M-15 0 L-11 -46 H11 L15 0 Z" fill="#fbf6ea"/><path d="M-13 -14 L-12 -24 H12 L13 -14 Z" fill="#e63946"/><rect x="-14" y="-50" width="28" height="5" fill="#2b1a10"/><rect x="-8" y="-66" width="16" height="16" fill="#fff6c9"/>
    <path d="M-12 -66 L0 -80 L12 -66 Z" fill="#e63946"/><path d="M0 -80 V-88" fill="none"/><path d="M-5 0 V-10 Q0 -16 5 -10 V0 Z" fill="#6a5a4c"/></g>`;
  // the clock balloon with its hands swung round to point west (left)
  const balloonWest = (x, y, h) => { const cx = x + h * .4, cy = y + h * .33, r = h * .15, w = h * .02;
    return `${balloonAt(x, y, h)}<circle cx="${cx}" cy="${cy}" r="${r}" fill="#fff" stroke="#2b1a10" stroke-width="${w}"/><path d="M${cx} ${cy} L${cx - r * .8} ${cy}" fill="none" stroke="#2b1a10" stroke-width="${w}" stroke-linecap="round"/>
    <path d="M${cx} ${cy} L${cx - r * .5} ${cy - r * .3}" fill="none" stroke="#e63946" stroke-width="${w}" stroke-linecap="round"/><circle cx="${cx}" cy="${cy}" r="${w}" fill="#2b1a10"/>
    <path d="M${cx + r * 1.4} ${cy} A${r * 1.4} ${r * 1.4} 0 0 0 ${cx} ${cy - r * 1.4}" fill="none" stroke="#fff" stroke-width="${w * .8}" stroke-linecap="round" stroke-dasharray="4 5" opacity=".9"/>`; };

  // the six guides of this grade, for the goodbye picture (Léa, Olivier, Élodie, Sadie, Amara, Declan)
  const GUIDES = [{ hood: "#f4b942" }, { hood: "#58b368", short: true }, { hood: "#e0533d" }, { hood: "#d94f70" }, { hood: "#e0559a" }, DECLAN];

  // what the window shows: the Norse at L'Anse aux Meadows, about 1,000 years ago
  const norse1000 = `<rect width="400" height="240" fill="#f6e3b4"/>${water(150, "#6cc0ea")}<g ${INKED}><path d="M130 122 Q236 100 342 122 V152 H130 Z" fill="#a9cf86"/></g>
    ${sodHouse(188, 142, .9)}${person(238, 116, .5, "#b03a2e")}${person(256, 120, .45, "#7a4a24")}${longship(268, 178, .75)}`;
  // what the window shows: fishing crews, flakes, a stage and a dory, in the 1500s
  const cod1500 = `<rect width="400" height="240" fill="#f6e3b4"/>${water(100, "#6cc0ea")}${ship(188, 112, .42)}${dory(236, 126, .8)}<g ${INKED}><path d="M130 148 Q200 130 262 140 Q306 146 342 150 V250 H130 Z" fill="#b9cf8e"/></g>
    <g ${INKED}><path d="M276 156 V142 M304 156 V142" fill="none" stroke-width="4"/><rect x="266" y="138" width="48" height="5" fill="#8a5a2b"/><rect x="272" y="112" width="36" height="26" fill="#b0452a"/><polygon points="266,112 290,92 314,112" fill="#5a6470"/><rect x="284" y="122" width="10" height="16" fill="#4a3518"/></g>
    ${flake(190, 186, 60)}${flake(214, 164, 48)}`;

  Object.assign(ART, {
    nl_arrive: () => frame(`${sky("#9fd8f2", "#f4f1d8", [344, 40, 20], [[60, 34, .8], [300, 78, .6]])}${water(150)}
      <g ${INKED}><path d="M-10 112 Q30 96 66 118 L82 160 Q90 192 74 226 H-10 Z" fill="#8f8a7e"/><path d="M-10 112 Q30 96 66 118" fill="none" stroke="#58b368" stroke-width="9"/></g>${houseRow(190, 190, 7, 24, 24, 9)}${riding(110, 6, 118)}`),
    nl_declan: () => frame(`${sky("#9fd8f2", "#f4f1d8", [56, 40, 20], [[230, 30, .8]])}${houseRow(-4, 178, 12, 28, 26, 7)}<g ${INKED}><path d="M-10 214 Q100 200 210 216 T410 214 V250 H-10 Z" fill="#d9c7a0"/></g>${owlAt(40, 116, 112)}${kidAt(204, 146, 1.05, DECLAN)}`),
    nl_window1: () => frame(`${sky("#9fd8f2", "#f4f1d8", null, [[60, 40, .7]])}${water(176)}<g ${INKED}><path d="M-10 214 Q100 200 210 216 T410 214 V250 H-10 Z" fill="#d9c7a0"/></g>${windowAt(236, 112, 92, norse1000)}${owlAt(18, 118, 108)}${kidAt(118, 150, .95, DECLAN)}`),
    nl_bergs: () => frame(`${sky("#9fd8f2", "#f4f1d8", [344, 40, 20], [[90, 34, .8], [230, 24, .6]])}${water(128, "#5db7e6")}${iceberg(292, 128, .95, true)}${iceberg(366, 134, .42, true)}${iceberg(224, 138, .34, true)}
      <g ${INKED}><path d="M-10 186 Q80 172 170 192 Q200 208 196 250 H-10 Z" fill="#8cc084"/></g>${owlAt(14, 114, 110)}${kidAt(150, 112, .95, DECLAN)}`),
    nl_window2: () => frame(`${sky("#9fd8f2", "#f4f1d8", null, [[60, 40, .7]])}${water(176)}<g ${INKED}><path d="M-10 214 Q100 200 210 216 T410 214 V250 H-10 Z" fill="#d9c7a0"/></g>${windowAt(236, 112, 92, cod1500)}${owlAt(18, 118, 108)}${kidAt(118, 150, .95, DECLAN)}`),
    nl_choice: () => frame(`${sky("#9fd8f2", "#f4f1d8", [56, 40, 20], [[210, 30, .8], [330, 40, .6]])}${water(124)}${iceberg(44, 124, .7, true)}${tourBoat(112, 146, .8)}
      <g ${INKED}><path d="M230 250 V132 Q260 100 310 104 Q370 100 410 118 V250 Z" fill="#9a8f80"/><path d="M230 132 Q260 100 310 104 Q370 100 410 118" fill="none" stroke="#58b368" stroke-width="10"/></g>${puffin(300, 116, .9)}${puffin(346, 114, .8, true)}
      <g ${INKED}><path d="M-10 214 H410 V250 H-10 Z" fill="#c9c3b6"/></g>${owlAt(140, 148, 84)}${kidAt(236, 160, .8, DECLAN)}`),
    nl_boat: () => frame(`${sky("#9fd8f2", "#f4f1d8", [56, 40, 20], [[200, 30, .8]])}${geese(150, 54, .6, 5)}${water(124, "#5db7e6")}${iceberg(306, 124, 1.15, true)}${tourBoat(130, 200, 1.6, true)}${owlAt(70, 108, 92)}${kidAt(180, 124, .9, DECLAN)}${boatFront(130, 200, 1.6)}`),
    nl_puffins: () => frame(`${sky("#9fd8f2", "#f4f1d8", [56, 40, 20], [[200, 30, .8]])}${water(150, "#5db7e6")}${iceberg(120, 150, .4, false)}
      <g ${INKED}><path d="M200 250 V150 Q230 110 290 114 Q350 108 410 124 V250 Z" fill="#9a8f80"/><path d="M200 150 Q230 110 290 114 Q350 108 410 124" fill="none" stroke="#58b368" stroke-width="10"/><path d="M214 172 Q230 164 262 170 V180 H214 Z" fill="#58b368"/></g>
      ${puffin(266, 120, 1)}${puffin(306, 118, 1.1)}${puffin(348, 119, 1, true)}${puffin(240, 172, .75)}
      <g ${INKED}><path d="M-10 190 Q80 170 170 192 Q200 200 220 206 V250 H-10 Z" fill="#8cc084"/></g>${owlAt(14, 114, 110)}${kidAt(150, 112, .95, DECLAN)}`),
    nl_goodbye: () => frame(`${sky("#ffc78a", "#fdebd0", null, [[110, 36, .8], [210, 62, .6]])}${sun(330, 150, 26)}${water(150, "#5db7e6")}<path d="M300 168 h60 M310 178 h40 M318 188 h24" fill="none" stroke="#ffe9a8" stroke-width="3" stroke-linecap="round"/>
      <g ${INKED}><path d="M-10 250 V162 Q50 144 120 154 Q172 162 196 190 V250 Z" fill="#8cc084"/></g>${lighthouse(118, 160, .9)}<g ${INKED}><path d="M-10 212 Q200 198 410 214 V250 H-10 Z" fill="#c9b8a6"/></g>
      ${balloonWest(262, 6, 120)}${owlAt(14, 128, 104)}${GUIDES.map((g, i) => kidAt(140 + i * 34, 172, .62, g)).join("")}`)
  });

  Object.assign(ASK, {
    nl_zones() { // time zones and elapsed time with half hours
      const kind = rand(3);
      if (kind === 0) { const h = 2 + rand(7), right = `${h + 1}:30`; return { html: "", text: `It is <b>${h}:00</b> p.m. in Ontario. Newfoundland is <b>1 hour 30 minutes</b> ahead. What time is it in St. John's?`, choices: textCards(right, [`${h + 1}:00`, `${h}:30`, `${h + 2}:00`, `${h + 2}:30`, `${h - 1}:30`]), why: `Add 1 hour 30 minutes. ${h}:00 + 1 hour = ${h + 1}:00, and 30 more minutes is ${h + 1}:30.` }; }
      if (kind === 1) { const h = 1 + rand(6), k = 1 + rand(2), right = `${h + k + 1}:15`; return { html: "", text: `A plane leaves Halifax at <b>${h}:15</b> p.m. Halifax time and flies for <b>${k} h 30 min</b>. St. John's is 30 minutes ahead. What time does it land there?`, choices: textCards(right, [`${h + k}:45`, `${h + k + 1}:45`, `${h + k}:15`, `${h + k + 2}:15`, `${h + k + 1}:00`]), why: `${h}:15 plus ${k} h 30 min is ${h + k}:45 in Halifax. Add 30 minutes for St. John's: ${h + k + 1}:15.` }; }
      const h = 5 + rand(3), d = 1 + rand(3), m = pick([15, 45]), n = 60 * d - 30 + m;
      return { html: "", text: `The sun rises at Cape Spear at <b>${h}:30</b> a.m. Declan gets there at <b>${h + d}:${m}</b> a.m. How many minutes after sunrise is that?`, choices: cards(n, [60 * d + 15, 60 * d + 30, n + 30, n - 30, 60 * d]), why: `${h}:30 to ${h + d}:00 is ${60 * d - 30} minutes. Then ${m} more. ${60 * d - 30} + ${m} = ${n} minutes.` };
    },
    nl_berg() { // fractions, decimals and percents of an iceberg
      const kind = rand(3);
      if (kind === 0) { const p = 4 + rand(7), n = p * 10; return { html: "", text: `Only <b>one tenth</b> of an iceberg shows above the water. Declan measures <b>${p} m</b> above the waves. How tall is the whole iceberg, in metres?`, choices: cards(n, [p * 9, p + 10, p * 100, n + 10, n - 10]), why: `${p} m is one tenth, so the whole is 10 times as much. ${p} × 10 = ${n} metres.` }; }
      if (kind === 1) {
        const sub = pick([["What <b>percent</b> of the iceberg is hidden under the water?", "90%", ["10%", "9%", "19%", "80%", "99%"]], ["Write the part hidden under the water as a <b>decimal</b>.", "0.9", ["0.1", "0.09", "1.9", "0.8", "9"]], ["Write the part hidden under the water as a <b>fraction</b>.", "9/10", ["1/10", "9/100", "1/9", "10/9", "9/1"]]]);
        return { html: "", text: `One tenth of an iceberg shows above the water. ${sub[0]}`, choices: textCards(sub[1], sub[2]), why: `The whole is 10 tenths. 10 − 1 = 9 tenths under the water, which is 9/10 = 0.9 = 90%.` };
      }
      const [t, a] = pick([[20, 3], [20, 7], [25, 5], [50, 12], [50, 35], [10, 3], [20, 9]]), pc = a * 100 / t;
      return { html: "", text: `One spring morning Declan counts <b>${t} icebergs</b>. <b>${a}</b> of them are taller than the lighthouse. What percent is that?`, choices: textCards(pc + "%", [pc + 10, pc - 10, a, 100 - pc, pc + 5].filter(k => k > 0 && k < 100).map(k => k + "%")), why: `${a} out of ${t}. ${a} ÷ ${t} = ${+(a / t).toFixed(2)}, which is ${pc} percent.` };
    },
    nl_crates() { // volume of rectangular prisms and unit conversions
      const kind = rand(3);
      if (kind === 0) { const l = pick([2, 3, 4, 5]), w = pick([2, 3]), h = pick([2, 3, 4]), V = l * w * h; return { html: "", text: `A bin of salt cod in the fish shed is <b>${l} m</b> long, <b>${w} m</b> wide and <b>${h} m</b> tall. What is its volume, in cubic metres?`, choices: cards(V, [l + w + h, 2 * (l * w + l * h + w * h), l * w + h, V + l, V - w]), why: `Volume = length × width × height. ${l} × ${w} × ${h} = ${V} cubic metres.` }; }
      if (kind === 1) { const kg = pick([0.5, 1.5, 2.5, 3.5, 4.5, 6.5]), n = Math.round(kg * 1000); return { html: "", text: `A box of dried cod weighs <b>${kg} kg</b>. How many grams is that?`, choices: cards(n, [n / 10, n * 10, n + 500, n - 500, kg * 100]), why: `There are 1,000 grams in a kilogram. ${kg} × 1,000 = ${n.toLocaleString("en-CA")} grams.` }; }
      const L = pick([2, 3, 4, 5, 6, 8]), b = pick([200, 250, 500]), n = L * 1000 / b;
      return { html: "", text: `Brine for salting fish comes in <b>${b} mL</b> jugs. How many jugs fill a <b>${L} L</b> barrel?`, choices: cards(n, [L * 1000, L * 100, L * 10, n + 2, n - 2]), why: `${L} L = ${(L * 1000).toLocaleString("en-CA")} mL. ${(L * 1000).toLocaleString("en-CA")} ÷ ${b} = ${n} jugs.` };
    },
    nl_review() { // a mixed review: order of operations, a ratio, a percent of an amount
      const kind = rand(3);
      if (kind === 0) {
        const a = 4 + rand(6), b = 2 + rand(5), c = 2 + rand(4);
        if (rand(2)) { const n = a + b * c; return { html: "", text: `Declan counts <b>${a}</b> gulls, then <b>${b}</b> ledges with <b>${c}</b> puffins on each. His sum is <b>${a} + ${b} × ${c}</b>. What does it equal?`, choices: cards(n, [(a + b) * c, a + b + c, a * b + c, a * b * c, n + 1]), why: `Multiply first. ${b} × ${c} = ${b * c}, then add. ${a} + ${b * c} = ${n}.` }; }
        const n = (a + b) * c; return { html: "", text: `Declan counts <b>${a}</b> puffins and <b>${b}</b> gulls on each of <b>${c}</b> cliffs. His sum is <b>(${a} + ${b}) × ${c}</b>. What does it equal?`, choices: cards(n, [a + b * c, a + b + c, a * b * c, a * b + c, n + 1]), why: `Brackets first. ${a} + ${b} = ${a + b}, then ${a + b} × ${c} = ${n}.` };
      }
      if (kind === 1) { const [a, b] = pick([[3, 2], [5, 2], [4, 3], [3, 1], [5, 3], [7, 2]]), m = 3 + rand(4), right = `${a} : ${b}`; return { html: "", text: `A cliff has <b>${a * m} puffins</b> and <b>${b * m} gulls</b>. What is the ratio of puffins to gulls, in its simplest form?`, choices: textCards(right, [`${b} : ${a}`, `${a * m} : ${b}`, `${a + 1} : ${b}`, `${a} : ${b + 1}`, `${a * 2} : ${b}`], x => `<span class="ratio">${x}</span>`), why: `Divide both numbers by ${m}. ${a * m} ÷ ${m} = ${a}, and ${b * m} ÷ ${m} = ${b}. The ratio is ${a} to ${b}.` }; }
      const N = pick([20, 40, 60, 80]), pc = pick([10, 20, 25, 30, 50, 75]), n = N * pc / 100;
      return { html: "", text: `Declan's class has <b>${N} students</b>. <b>${pc}%</b> of them take the boat tour. How many students is that?`, choices: cards(n, [N - n, pc, n + 5, n - 5, n * 2]), why: `${pc}% means ${pc} out of 100. ${N} × ${pc} ÷ 100 = ${n} students.` };
    }
  });

  // FACT CHECK: Terre-Neuve is the French name of the island and province of Newfoundland (literally "new land"). The beat says it means new found land, as the English name does.
  // FACT CHECK: la morue is the French word for cod. le macareux is the French word for the (Atlantic) puffin (le macareux moine). l'iceberg is the same word in French.
  // FACT CHECK: "Whaddaya at?" is a well-known Newfoundland English greeting that means roughly how are you doing / what are you up to. "b'y" (spoken like "boy") is a common Newfoundland term of address for a friend or buddy, used for men and boys and often for anyone. Check spelling and meaning with a Newfoundlander if possible.
  // FACT CHECK: The Norse (Vikings) sailed from Greenland and built a small settlement of sod-walled buildings at L'Anse aux Meadows, at the northern tip of Newfoundland, about 1,000 years ago (about the year 1000). It is a UNESCO World Heritage Site. They are the first Europeans known to have reached North America, about 500 years before Columbus (1492).
  // FACT CHECK: Indigenous peoples lived on the island of Newfoundland for thousands of years before the Norse. (Replaced: the chapter now names the peoples, see the next line.)
  // FACT CHECK: Added from Shane's review notes (November 2026): The Beothuk lived across the island of Newfoundland for a very long time (say bee-OTH-uk). After Europeans settled the coasts they were cut off from the sea they fished, there was fighting with settlers, and new sicknesses came, and their numbers fell. Shanawdithit, the last known Beothuk, died in St. John's in 1829 and drew maps and pictures so her people's story would not be lost. The Mi'kmaq have lived on the island for a long time and are still here; their name for it is Ktaqmkuk. In Labrador, the mainland part of the province, the Innu and the Inuit live on their homelands today.
  // FACT CHECK: Newfoundland has its own time zone, Newfoundland Standard Time, half an hour ahead of Atlantic Time (Halifax). Ontario's Eastern Time is one hour behind Atlantic Time, so Newfoundland is 1 hour 30 minutes ahead of most of Ontario. Daylight saving time moves all of these clocks together, so the gaps stay the same.
  // FACT CHECK: Cape Spear, near St. John's, is the most easterly point of North America (mainland and islands, not counting Greenland and Iceland), so the sun rises there before anywhere else in Canada. Teachers may want to note that wording.
  // FACT CHECK: Icebergs drift south each spring along the coast ("Iceberg Alley"). About one tenth (roughly 10 percent) of an iceberg shows above the water and about nine tenths is below. It is a rule of thumb, not exact.
  // FACT CHECK: Atlantic puffins nest on sea cliffs and islands along the coast of Newfoundland. Puffins: black back, white front, large orange and yellow beak, orange feet.
  // FACT CHECK: From the 1500s fishing crews from Europe crossed each summer for the cod of the Grand Banks, salted and dried the fish on wooden racks called flakes, and outports (small fishing villages) grew up around the coast. Newfoundland joined Canada in 1949 and was the last province to join (Nunavut is a territory, created in 1999).
  // FACT CHECK: Brightly painted wooden houses are a well-known sight of St. John's (the "Jellybean Row" houses). The harbour opens to the sea through a narrow channel (the Narrows) between high cliffs.
  // FACT CHECK: The plane trip from Halifax to St. John's is made up for the math question (a real flight is about 1.5 hours). Iceberg heights, counts, class sizes, crate sizes and bird counts in the questions are all made up for practice.
  // FACT CHECK: In the goodbye the guides are named as Léa, Olivier, Élodie, Sadie, Amara and Declan, and the picture draws their hoodie colours as guesses: match them to Chapters 1 to 5 if they differ.
  CHAPTERS[5] = { title: "The Edge of the Map", where: "Newfoundland", beats: [
    { art: "nl_arrive", word: ["Terre-Neuve", "Newfoundland, meaning new found land"], say: ["Off we hop, over the water from Halifax. The clock keeps pointing east, and east, and east. Until there is almost nothing left to point at.",
      "This is <em>Newfoundland</em>, an island on the edge of the sea. The city below is St. John's. Look at the houses! Red, yellow, blue and green, stacked up the steep hill like a box of crayons.",
      "In French the island is called <em>Terre-Neuve</em>. That means new found land. It was new only to the visitors, which is a bit cheeky when you think about it."] },
    { art: "nl_declan", word: ["Whaddaya at?", "how are you doing?"], say: ["This is Declan. He lives right here in St. John's, in a bright orange house on one of those very steep streets. His legs are very strong.",
      "He greets me with <em>Whaddaya at?</em> That is a Newfoundland way to ask how you are doing. I said I was at being an owl. Declan laughed anyway.",
      "Declan says Newfoundland has its own <em>time zone</em>. The clocks here are half an hour ahead of the rest of Atlantic Canada. My balloon clock is very confused."] },
    { art: "nl_window1", who: "The clock", say: ["Tick, tock. Time to look back. My window is open."] },
    { art: "nl_window1", say: ["The window into the past! It is about <em>1,000 years</em> ago, at the northern tip of the island. A longship with a striped sail has just landed.",
      "These are the Norse, also called Vikings. They sailed from Greenland and built a small village of sod houses at <em>L'Anse aux Meadows</em>. The roofs are made of grass!",
      "They are the first Europeans known to reach North America, about 500 years before Columbus."] },
    { art: "nl_window1", word: ["Beothuk", "the people who lived across this island for a very long time (say bee-OTH-uk)"], say: ["But this island was not empty. The <em>Beothuk</em> lived across it for a very long time. You say it bee-OTH-uk.",
      "After Europeans settled the coasts, the Beothuk were cut off from the sea they fished. There was fighting with settlers, and new sicknesses came. Their numbers fell and fell.",
      "Shanawdithit, the last known Beothuk, died in St. John's in 1829. Before she died she drew maps and pictures, so that her people's story would not be lost."] },
    { art: "nl_declan", say: ["The Mi'kmaq have lived here too, for a long time, and they are still here today. Their name for the island is <em>Ktaqmkuk</em>.",
      "In Labrador, the mainland part of this province, the Innu and the Inuit live on their homelands today.",
      "Declan says the Norse had no watches. He has one, and it is half an hour ahead of Halifax. Let's work out the time."] },
    { ask: "nl_zones", intro: "Check the clocks with Declan. Three right answers and we go to see some ice." },
    { art: "nl_bergs", word: ["l'iceberg", "the iceberg"], say: ["Every spring, something enormous floats past this coast. Icebergs! They break off glaciers far to the north and drift south along <em>Iceberg Alley</em>.",
      "In French it is <em>l'iceberg</em>. The very same word! That is one French word I did not have to practise.",
      "Only about <em>one tenth</em> of an iceberg shows above the water. The other nine tenths hide below the waves.",
      "On the sea cliffs nearby, puffins are nesting too. But first, some iceberg sums with Declan."] },
    { ask: "nl_berg", intro: "Do the iceberg sums with Declan. Three right answers and the window opens again." },
    { art: "nl_window2", who: "The clock", say: ["Tick, tock. The window opens again."] },
    { art: "nl_window2", word: ["la morue", "the cod"], say: ["Back to the window, and now it is the 1500s. The harbour is full of ships! Fishing crews cross the ocean from Europe every summer.",
      "They come for the cod. The Grand Banks, just off this coast, were full of huge schools of fish. In French, cod is <em>la morue</em>.",
      "The crews salted the fish and dried it on wooden racks called <em>flakes</em>. Little fishing villages, called outports, grew up all around the coast.",
      "Newfoundland did not join Canada until 1949. It was the last province to join. Now then, how much salt fish fits in a bin?"] },
    { ask: "nl_crates", intro: "Pack the salt fish. Three right answers and Declan lets you choose what we do next." },
    { art: "nl_choice", pick: "Declan has two ideas for the afternoon. Shall we take a boat out to see an iceberg up close, or walk the cliff to watch the puffins?", options: [
      { label: "Take a boat to an iceberg", art: "nl_boat", word: ["b'y", "friend, buddy"], say: ["A little tour boat takes us out through the narrow harbour entrance, between the cliffs. And there it is, a white and blue mountain floating in the sea. I feel extremely small.",
        "The captain calls out <em>b'y</em>, which is a Newfoundland word for a friend or a buddy. Declan says he calls everybody b'y. Even me. Even, probably, the iceberg."] },
      { label: "Walk the cliff to the puffins", art: "nl_puffins", word: ["le macareux", "the puffin"], say: ["We walk the cliff path, and there they are! Puffins sit on the grassy ledges, with black backs, white fronts, orange feet and great big orange beaks.",
        "In French a puffin is <em>le macareux</em>. Declan says it looks like it is wearing a clown's nose. I say it is the best beak I have ever seen."] }] },
    { ask: "nl_review", intro: "One last set of questions for this grade. Three right answers and we reach the very edge." },
    { art: "nl_goodbye", say: ["Cape Spear! This is the very edge of the map. It is the most easterly point in North America, and the sun rises here first. There is no more east to go.",
      "So thank you, Léa, Olivier, Élodie, Sadie, Amara and Declan. Each of you showed me a piece of the east, and I learned so much.",
      "Wait! The clock on the balloon is spinning! Its hands swing all the way round and point <em>west</em>. The prairies and the mountains are waiting for us.",
      "But that is another story. Tick tock!"] }
  ] };
}
