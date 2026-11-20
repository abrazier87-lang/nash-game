"use strict";
// Grade 7, Chapter 5: The Land of Giants. The Alberta badlands beside the Red Deer River near Drumheller: hoodoos, fossils, and a little help from Pip and Dot.
{
  const GUIDE = { hood: "#2a9d8f" };   // Priya: long dark hair and a teal hoodie

  // ---------- my own drawing pieces ----------
  const BANDS_A = ["#b5683a", "#d9bf92", "#8c857c", "#c8a779", "#b5683a", "#d9bf92"];
  const BANDS_B = ["#8c857c", "#c8a779", "#b5683a", "#d9bf92", "#a9a29a"];
  const BANDS_C = ["#c8a779", "#b5683a", "#8c857c", "#d9bf92", "#b5683a", "#c8a779", "#a9a29a"];
  // a flat-topped, striped badlands hill (cx is the middle, yb the bottom, w the width at the bottom)
  const butte = (cx, yb, w, h, cols) => `<g ${THIN}>${cols.map((c, i) => {
    const n = cols.length, y0 = yb - h * i / n, y1 = yb - h * (i + 1) / n, w0 = w / 2 * (1 - .6 * i / n), w1 = w / 2 * (1 - .6 * (i + 1) / n);
    return `<polygon points="${(cx - w0).toFixed(1)},${y0.toFixed(1)} ${(cx + w0).toFixed(1)},${y0.toFixed(1)} ${(cx + w1).toFixed(1)},${y1.toFixed(1)} ${(cx - w1).toFixed(1)},${y1.toFixed(1)}" fill="${c}"/>`;
  }).join("")}</g>`;
  const badFar = () => `${butte(60, 180, 170, 64, BANDS_A)}${butte(206, 178, 120, 44, BANDS_B)}${butte(346, 182, 160, 70, BANDS_C)}`;
  const land = (y, c) => `<g ${INKED}><path d="M-10 ${y} Q110 ${y - 12} 220 ${y} T410 ${y - 4} V250 H-10 Z" fill="${c || "#d9bb85"}"/><path d="M-10 ${y + 36} Q140 ${y + 24} 270 ${y + 34} T410 ${y + 30} V250 H-10 Z" fill="#c9a06a"/></g>`;
  // a hoodoo: a soft pillar with a hard grey cap stone (y is the ground)
  const hoodoo = (x, y, s) => `<g transform="translate(${x} ${y}) scale(${s})" ${INKED}><path d="M-16 0 Q-9 -18 -8 -40 Q-9 -56 -11 -62 H11 Q9 -56 8 -40 Q9 -18 16 0 Z" fill="#d9bf92"/><path d="M-10 -14 H10 M-8 -30 H8 M-8 -46 H8" fill="none" stroke="#b5683a" stroke-width="5" opacity=".75"/><path d="M-19 -62 Q-19 -78 0 -78 Q19 -78 19 -62 Z" fill="#8c857c"/></g>`;
  // bones: dark outline underneath, pale bone on top
  const bone = (d, w) => `<path d="${d}" fill="none" stroke="#2b1a10" stroke-width="${w + 3}" stroke-linecap="round" stroke-linejoin="round"/><path d="${d}" fill="none" stroke="#fffdf5" stroke-width="${w}" stroke-linecap="round" stroke-linejoin="round"/>`;
  // the dinosaurs (feet on y, facing right, f flips them to face left)
  const albertosaurus = (x, y, s, f) => `<g transform="translate(${x} ${y}) scale(${f ? -s : s} ${s})" ${INKED}>
    <path d="M-24 -48 Q-60 -52 -84 -30 Q-56 -38 -26 -30 Z" fill="#b8744a"/><rect x="-14" y="-38" width="13" height="32" rx="5" fill="#a8643c"/><ellipse cx="-6" cy="-2" rx="12" ry="4.5" fill="#a8643c"/><rect x="6" y="-38" width="13" height="32" rx="5" fill="#a8643c"/><ellipse cx="14" cy="-2" rx="12" ry="4.5" fill="#a8643c"/>
    <ellipse cx="0" cy="-48" rx="32" ry="20" fill="#c47a4a"/><ellipse cx="6" cy="-42" rx="22" ry="11" fill="#e8c9a0" stroke="none"/><path d="M18 -62 Q30 -80 40 -76 L44 -60 Z" fill="#c47a4a"/>
    <path d="M30 -84 Q30 -94 46 -94 L68 -88 Q76 -86 76 -78 Q74 -68 62 -68 L40 -66 Q30 -68 30 -84 Z" fill="#c47a4a"/><path d="M44 -73 Q60 -77 74 -77" fill="none" stroke-width="1.8"/><path d="M52 -76 l2 5 l2 -5 M62 -77 l2 5 l2 -5" fill="#fff" stroke-width="1"/>
    <circle cx="46" cy="-85" r="3.4" fill="#fff" stroke-width="1.4"/><circle cx="47" cy="-85" r="1.5" fill="#2b1a10" stroke="none"/>
    <path d="M26 -46 L36 -40" fill="none" stroke="#2b1a10" stroke-width="5"/><path d="M26 -46 L36 -40" fill="none" stroke="#c47a4a" stroke-width="2.6"/></g>`;
  const hadrosaur = (x, y, s, f) => `<g transform="translate(${x} ${y}) scale(${f ? -s : s} ${s})" ${INKED}>
    <path d="M-26 -46 Q-64 -50 -88 -28 Q-60 -36 -28 -28 Z" fill="#6f9a94"/><rect x="-14" y="-36" width="12" height="30" rx="5" fill="#6f9a94"/><ellipse cx="-6" cy="-2" rx="11" ry="4.5" fill="#6f9a94"/><rect x="6" y="-36" width="12" height="30" rx="5" fill="#6f9a94"/><ellipse cx="14" cy="-2" rx="11" ry="4.5" fill="#6f9a94"/>
    <ellipse cx="0" cy="-46" rx="30" ry="18" fill="#7aa6a0"/><ellipse cx="4" cy="-40" rx="20" ry="9" fill="#d6e6d0" stroke="none"/>
    <path d="M14 -58 Q26 -76 30 -84 L42 -80 Q40 -64 34 -52 Z" fill="#7aa6a0"/><ellipse cx="38" cy="-86" rx="12" ry="8" fill="#7aa6a0"/><path d="M44 -91 Q64 -93 67 -84 Q64 -78 44 -80 Z" fill="#a9c9bf"/>
    <circle cx="37" cy="-89" r="2.6" fill="#fff" stroke-width="1.2"/><circle cx="37.6" cy="-89" r="1.2" fill="#2b1a10" stroke="none"/>
    <path d="M20 -44 L30 -34" fill="none" stroke="#2b1a10" stroke-width="5"/><path d="M20 -44 L30 -34" fill="none" stroke="#7aa6a0" stroke-width="2.6"/></g>`;
  const centrosaurus = (x, y, s, f) => `<g transform="translate(${x} ${y}) scale(${f ? -s : s} ${s})" ${INKED}>
    <path d="M-36 -34 Q-58 -34 -70 -14 Q-52 -24 -34 -20 Z" fill="#8d9c6b"/><rect x="-32" y="-24" width="12" height="24" rx="5" fill="#7b8a5c"/><rect x="-14" y="-24" width="12" height="24" rx="5" fill="#7b8a5c"/><rect x="10" y="-24" width="12" height="24" rx="5" fill="#7b8a5c"/><rect x="26" y="-24" width="12" height="24" rx="5" fill="#7b8a5c"/>
    <ellipse cx="0" cy="-32" rx="40" ry="20" fill="#8d9c6b"/><ellipse cx="2" cy="-24" rx="28" ry="9" fill="#d9e0b8" stroke="none"/>
    <path d="M26 -20 Q8 -34 20 -60 Q32 -68 40 -58 Q50 -40 44 -22 Z" fill="#d95f5f"/><path d="M20 -60 l-3 -8 l8 4 z M31 -66 l0 -9 l7 6 z" fill="#d95f5f" stroke-width="1.6"/>
    <ellipse cx="48" cy="-24" rx="18" ry="12" fill="#8d9c6b"/><path d="M52 -33 L58 -52 L61 -30 Z" fill="#fff6e0"/><circle cx="52" cy="-28" r="2.6" fill="#fff" stroke-width="1.2"/><circle cx="52.6" cy="-28" r="1.2" fill="#2b1a10" stroke="none"/></g>`;
  // a nest with eggs
  const nestEggs = (x, y, s) => `<g transform="translate(${x} ${y}) scale(${s})" ${INKED}><ellipse cx="0" cy="0" rx="34" ry="10" fill="#8a5a2b"/>
    ${[[-14, -9], [0, -11], [14, -9], [-7, -16], [7, -16]].map(([ex, ey]) => `<ellipse cx="${ex}" cy="${ey}" rx="6.5" ry="8.5" fill="#fff6e0"/>`).join("")}<path d="M-34 0 Q0 16 34 0 Q0 8 -34 0 Z" fill="#6a4a2a"/></g>`;
  // a chickadee on a fence post (y is the ground, the bird sits on top)
  const chickadee = (x, y, s) => `<g transform="translate(${x} ${y}) scale(${s})" ${INKED}><path d="M-24 -20 H24 M-24 -10 H24" fill="none" stroke-width="1.6"/><rect x="-5" y="-34" width="10" height="34" fill="#8a5a2b"/>
    <path d="M-6 -42 L-19 -36 L-8 -38 Z" fill="#9aa0a8"/><ellipse cx="0" cy="-42" rx="8" ry="7" fill="#c9ced6"/><ellipse cx="2" cy="-40" rx="5" ry="4.5" fill="#f3e6cf" stroke="none"/><circle cx="5" cy="-51" r="5.5" fill="#fff"/>
    <path d="M-0.5 -52 Q0 -57.5 5 -57.5 Q10.5 -57.5 10.5 -52 Z" fill="#2b1a10"/><path d="M10 -50 l4 1 l-4 2 Z" fill="#2b1a10"/><circle cx="7" cy="-52" r="1" fill="#2b1a10" stroke="none"/></g>`;
  // the museum skeleton on its stand (the whole thing is about 90 tall at s = 1)
  const museumBones = (x, y, s) => `<g transform="translate(${x} ${y}) scale(${s})">
    <g ${INKED}><rect x="-70" y="-6" width="140" height="6" rx="2" fill="#6a4a2a"/></g><path d="M-4 -6 V-30 M20 -6 V-32" stroke="#6a4a2a" stroke-width="3.4"/>
    ${bone("M-76 -34 Q-40 -50 -8 -52 Q20 -54 34 -66", 6)}${bone("M-76 -34 Q-86 -30 -92 -24", 4)}${bone("M-10 -52 Q-6 -34 8 -30", 4)}${bone("M4 -53 Q8 -34 20 -32", 4)}${bone("M16 -56 Q22 -40 30 -38", 3)}
    ${bone("M-2 -46 L-4 -24 L-12 -8 L2 -8", 6)}${bone("M14 -48 L16 -24 L10 -8 L24 -8", 6)}${bone("M26 -52 L34 -44", 3)}${bone("M30 -66 Q34 -76 40 -74", 5)}
    <g ${INKED}><path d="M30 -82 Q32 -92 48 -92 L70 -86 Q78 -84 78 -76 L48 -70 Q32 -70 30 -82 Z" fill="#fffdf5"/></g><circle cx="46" cy="-84" r="3.2" fill="#2b1a10"/><path d="M50 -75 l2 4 l2 -4 M60 -77 l2 4 l2 -4" fill="#fff" stroke="#2b1a10" stroke-width="1"/></g>`;
  const museumBldg = (x, y, s) => `<g transform="translate(${x} ${y}) scale(${s})" ${INKED}><rect x="-14" y="-90" width="28" height="30" fill="#d9bf92"/><rect x="-50" y="-60" width="100" height="60" fill="#e8dfd0"/><rect x="-56" y="-66" width="112" height="10" fill="#b5683a"/>
    <rect x="-14" y="-34" width="28" height="34" fill="#bfe6f7"/><path d="M0 -34 V0" fill="none" stroke-width="1.6"/><rect x="-44" y="-50" width="20" height="24" fill="#bfe6f7"/><rect x="24" y="-50" width="20" height="24" fill="#bfe6f7"/><rect x="-7" y="-82" width="14" height="14" fill="#bfe6f7"/></g>`;
  // Dot's little engine, with a grain car if car is true (y is the rail)
  const train = (x, y, s, car) => `<g transform="translate(${x} ${y}) scale(${s})" ${INKED}>
    ${car ? `<rect x="50" y="-36" width="64" height="26" rx="3" fill="#e9c46a"/><path d="M66 -36 V-10 M82 -36 V-10 M98 -36 V-10" fill="none" stroke-width="1.6"/><circle cx="64" cy="-8" r="7" fill="#4a3518"/><circle cx="100" cy="-8" r="7" fill="#4a3518"/><path d="M42 -12 H52" fill="none" stroke-width="3"/>` : ""}
    <rect x="-50" y="-42" width="58" height="28" rx="6" fill="#3b82c4"/><rect x="-44" y="-58" width="12" height="18" fill="#2b1a10"/><rect x="8" y="-60" width="34" height="46" rx="3" fill="#e63946"/><rect x="2" y="-66" width="46" height="8" rx="2" fill="#7a2e2e"/><rect x="16" y="-52" width="18" height="16" fill="#bfe6f7"/>
    <circle cx="-34" cy="-9" r="9" fill="#4a3518"/><circle cx="-12" cy="-9" r="9" fill="#4a3518"/><circle cx="26" cy="-10" r="10" fill="#4a3518"/><path d="M-50 -10 L-60 0 H-44 Z" fill="#7a5a2e"/></g>
    <g fill="none" stroke="#fff" stroke-width="7" stroke-linecap="round" opacity=".85"><path d="M${x - 38 * s} ${y - 66 * s} q-8 -10 0 -18 q8 -8 0 -16"/></g>`;

  // ---------- the windows into the past ----------
  // about 75 million years ago: a warm, wet plain beside a shallow sea, with dinosaurs
  const longAgo1 = `<rect width="400" height="240" fill="#d6efe4"/><g ${INKED}><path d="M130 104 Q236 92 342 104 V130 H130 Z" fill="#6cc0ea"/><path d="M130 124 Q236 108 342 124 V250 H130 Z" fill="#9fcf7a"/><path d="M130 192 Q220 174 342 188 V212 Q230 198 130 216 Z" fill="#6cc0ea"/></g>
    ${pine(168, 134, .8, "#2f8a57")}${tree(300, 132, .9, "#3f9a58")}${tree(190, 128, .7)}${hadrosaur(262, 144, .34)}${hadrosaur(196, 164, .44)}${centrosaurus(212, 190, .46)}${albertosaurus(256, 186, .5, true)}`;
  // the same time: a nest of eggs, babies, and a mother
  const longAgo2 = `<rect width="400" height="240" fill="#f3e8c4"/><g ${INKED}><path d="M130 130 Q236 112 342 130 V250 H130 Z" fill="#d9bf8e"/></g>${tree(172, 132, .8, "#3f9a58")}${pine(318, 128, .7, "#2f8a57")}
    ${hadrosaur(168, 172, .15)}${hadrosaur(230, 168, .14, true)}${nestEggs(198, 186, 1.1)}${hadrosaur(270, 184, .48, true)}`;

  // ---------- the pictures ----------
  const dayTop = clouds => sky("#9fd8f2", "#f4f1d8", [346, 40, 20], clouds);
  Object.assign(ART, {
    bl_arrive: () => frame(`${dayTop([[84, 40, .8], [250, 30, .6]])}${badFar()}${land(188)}${hoodoo(40, 206, 1)}${hoodoo(76, 214, .7)}${hoodoo(330, 210, 1.1)}${hoodoo(366, 218, .7)}${riding(150, 18, 112)}`),
    bl_priya: () => frame(`${dayTop([[70, 40, .8]])}${badFar()}${land(186)}${hoodoo(364, 204, .9)}${owlAt(30, 118, 112)}${kidAt(170, 140, 1, GUIDE)}${dinoAt(238, 148, 70, "pip")}${rock(240, 222, 84, 40)}`),
    bl_window1: () => frame(`${sky("#9fd8f2", "#f4f1d8", null, [[60, 40, .7]])}${land(196)}${windowAt(236, 112, 92, longAgo1)}${owlAt(18, 118, 108)}${kidAt(118, 150, .95, GUIDE)}`),
    bl_today: () => frame(`${dayTop([[70, 38, .7]])}${butte(348, 204, 130, 110, BANDS_C)}${bone("M330 150 Q342 134 358 146", 5)}${bone("M338 168 L360 164", 4)}${land(196)}${owlAt(8, 124, 96)}${kidAt(118, 146, .9, GUIDE)}${dinoAt(148, 160, 58, "pip")}${dinoAt(222, 160, 58, "dot")}`),
    bl_window2: () => frame(`${sky("#9fd8f2", "#f4f1d8", null, [[60, 40, .7]])}${land(196)}${windowAt(236, 112, 92, longAgo2)}${owlAt(18, 118, 108)}${kidAt(118, 150, .95, GUIDE)}${dinoAt(294, 172, 54, "pip")}${chickadee(372, 226, 1.1)}`),
    bl_choice: () => frame(`${dayTop([[240, 34, .7]])}${badFar()}${land(190)}${museumBldg(336, 218, .9)}${owlAt(20, 126, 96)}${kidAt(160, 148, .9, GUIDE)}${dinoAt(206, 168, 54, "pip")}`),
    bl_dig: () => frame(`${dayTop([[70, 36, .7]])}${butte(330, 150, 150, 50, BANDS_B)}${land(152)}
      <rect x="124" y="176" width="176" height="50" fill="#b5844e" ${INKED}/>${bone("M140 206 Q190 194 250 204", 6)}${bone("M160 200 Q164 218 176 220", 4)}${bone("M178 197 Q182 215 194 217", 4)}${bone("M196 196 Q200 214 212 215", 4)}
      <g ${INKED}><path d="M132 204 Q134 192 150 194 L162 200 L150 212 Q134 214 132 204 Z" fill="#fffdf5"/></g><ellipse cx="262" cy="219" rx="44" ry="11" fill="#c49a63" ${THIN}/>
      <g fill="none" stroke="#e63946" stroke-width="1.8"><path d="M124 176 H300 M124 201 H300 M124 226 H300 M124 176 V226 M168 176 V226 M212 176 V226 M256 176 V226 M300 176 V226"/></g>${[[124, 176], [300, 176], [124, 226], [300, 226]].map(([cx, cy]) => `<circle cx="${cx}" cy="${cy}" r="3.4" fill="#8a5a2b" ${THIN}/>`).join("")}
      ${owlAt(24, 112, 100)}${dinoAt(232, 100, 56, "pip")}${kidAt(338, 134, .9, GUIDE)}`),
    bl_lab: () => frame(`<rect width="400" height="240" fill="#efe6d4"/><rect y="196" width="400" height="44" fill="#c9b8a6"/><path d="M0 196 H400" stroke="#2b1a10" stroke-width="2.4"/>
      <g ${INKED}><rect x="40" y="36" width="64" height="84" fill="#bfe6f7"/><path d="M72 36 V120 M40 78 H104" fill="none"/><rect x="300" y="44" width="62" height="40" fill="#fbf1dc"/></g>
      ${museumBones(228, 216, .95)}<g ${THIN}><rect x="140" y="219" width="160" height="7" fill="#ffd23f"/>${Array.from({ length: 17 }, (_, i) => `<path d="M${140 + i * 10} 219 v${i % 5 === 0 ? 7 : 4}" fill="none"/>`).join("")}</g>
      ${owlAt(14, 120, 96)}${dinoAt(98, 168, 54, "pip")}${kidAt(344, 144, .9, GUIDE)}`),
    bl_goodbye: () => frame(`${sky("#ffd9a0", "#fdebd0", null, [[90, 36, .8], [330, 50, .6]])}${sun(70, 66, 22)}${badFar()}${land(190)}${hoodoo(30, 214, .8)}
      <path d="M296 216 H400" stroke="#2b1a10" stroke-width="5" stroke-linecap="round"/>${train(352, 214, .8, false)}${balloonAt(176, 8, 100)}${owlAt(14, 126, 96)}${kidAt(132, 148, .9, GUIDE)}${dinoAt(168, 166, 52, "pip")}${dinoAt(236, 160, 58, "dot")}`)
  });

  // ---------- the questions ----------
  Object.assign(ASK, {
    bl_big() { // huge numbers, powers of ten, exponents
      const kind = rand(3);
      if (kind === 0) { const d = pick([2, 3, 4, 5, 6, 7, 8, 9]), k = pick([3, 4, 5]), ans = d * 10 ** k;
        return { html: "", text: `Priya counts <b>${d} × 10<sup>${k}</sup></b> tiny grains of sand stuck to a bone. Written as an ordinary number, how many grains is that?`, choices: cards(ans, [ans * 10, ans / 10, d * k, d + 10 ** k, ans * 100]), why: `10^${k} = ${fmt(10 ** k)}, and ${d} × ${fmt(10 ** k)} = ${fmt(ans)}.` }; }
      if (kind === 1) { const m = pick([66, 70, 75]), yrs = pick([500, 1000, 5000, 10000]), ans = m * 1000000 / yrs;
        return { html: "", text: `A dinosaur bone is about <b>${m} million</b> years old. A stone tool in the museum is <b>${fmt(yrs)}</b> years old. The bone is how many times as old as the tool?`, choices: cards(ans, [ans * 10, ans / 10, ans * 100, ans / 100, ans + yrs]), why: `${m} million = ${fmt(m * 1000000)}. ${fmt(m * 1000000)} ÷ ${fmt(yrs)} = ${fmt(ans)}.` }; }
      const [m, coef, n] = pick([[66, "6.6", 7], [75, "7.5", 7], [80, "8", 7], [250, "2.5", 8], [230, "2.3", 8]]);
      return { html: "", text: `A fossil is about <b>${m} million</b> years old, which is ${fmt(m * 1000000)} years. Written as <b>${coef} × 10<sup>n</sup></b>, what is the missing exponent n?`, choices: cards(n, [n - 1, n + 1, 6, 9, n + 2]), why: `Move the decimal point ${n} places to the right: ${coef} × 10^${n} = ${fmt(m * 1000000)}. So n = ${n}.` };
    },
    bl_scale() { // scale, proportion and unit rates
      const kind = rand(3), L = pick([6, 9, 12, 15]), k = pick([10, 20, 30, 50]), c = 100 * L / k;
      if (kind === 0) return { html: "", text: `A museum builds a model of a dinosaur that was <b>${L} m</b> long. The scale is <b>1 : ${k}</b>. How long is the model, in centimetres?`, choices: cards(c, [L * 100, c * 10, L * k, c + k, c - 5]), why: `${L} m = ${L * 100} cm. ${L * 100} ÷ ${k} = ${c} cm.` };
      if (kind === 1) return { html: "", text: `Priya's drawing of a dinosaur is <b>${c} cm</b> long, at a scale of <b>1 : ${k}</b>. How long was the real dinosaur, in metres?`, choices: cards(L, [c * k, L * 10, c + k, L + 10, L - 2]), why: `${c} × ${k} = ${c * k} cm, and ${c * k} cm = ${L} m.` };
      const a = pick([2, 4, 5]), u = pick([2, 3, 5]), b = a * u, d = pick([7, 9, 11, 13]), ans = d * u;
      return { html: "", text: `On Priya's trail map, <b>${a} cm</b> stands for <b>${b} km</b>. The trail from the museum to the hoodoos is <b>${d} cm</b> on the map. How many km long is the trail?`, choices: cards(ans, [d * b, d * a, ans + u, ans - u, d + b]), why: `${b} ÷ ${a} = ${u} km for each centimetre. ${d} × ${u} = ${ans} km.` };
    },
    bl_grid() { // squares, square roots, powers and a missing number
      const kind = rand(3);
      if (kind === 0) { const s = pick([4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15]), A = s * s;
        return { html: "", text: `The crew marks a square dig site that is <b>${s} m</b> on each side. What is its area, in square metres?`, choices: cards(A, [2 * s, 4 * s, A + s, A - s, A + 10]), why: `Area of a square = side × side = ${s} × ${s} = ${A} m².` }; }
      if (kind === 1) { const s = pick([5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16]), A = s * s;
        return { html: "", text: `A square dig site covers <b>${A} m²</b>. How many metres of string go all the way around its edge?`, choices: cards(4 * s, [s, 2 * s, A, A / 4, 4 * s + 4, 4 * s - 4]), why: `The side is the square root of ${A}, which is ${s}. The edge is 4 × ${s} = ${4 * s} m.` }; }
      const n = pick([2, 3, 4, 5, 6, 7, 8, 9, 10]), k = pick([5, 9, 11, 16, 20]), T = n * n + k;
      return { html: "", text: `Priya is thinking of a number, <b>n</b>. She squares it, then adds <b>${k}</b>, and gets <b>${T}</b>. What is n?`, choices: cards(n, [n + 1, n - 1, T - k, k, T]), why: `n² + ${k} = ${T}, so n² = ${T - k}. The number that times itself makes ${T - k} is ${n}.` };
    },
    bl_last(g) { // follows the choice: 0 = the dig (grids, depths, rates), 1 = the lab (scale models, ratios)
      const way = g && g.choice ? 1 : 0, kind = rand(3);
      if (way === 0) {
        if (kind === 0) { const r = pick([2, 3, 4, 5]), t = pick([6, 8, 10, 12]), s = pick([1, 2, 3]), d = r * t, a = r * s, ans = t - s;
          return { html: "", text: `The bone lies <b>${d} cm</b> down. The crew digs down <b>${r} cm</b> every hour and has already dug <b>${a} cm</b>. How many more hours until they reach the bone?`, choices: cards(ans, [t, d - a, ans + 1, ans - 1, t + s]), why: `${d} − ${a} = ${d - a} cm still to go. ${d - a} ÷ ${r} = ${ans} hours.` }; }
        if (kind === 1) { const rows = pick([4, 5, 6]), cols = pick([5, 6, 8]), b = pick([7, 9, 11, 13]), T = rows * cols, ans = T - b;
          return { html: "", text: `The dig grid has <b>${rows} rows</b> of <b>${cols} squares</b>. Bones have been found in <b>${b}</b> of the squares. How many squares have no bones yet?`, choices: cards(ans, [T, b, rows + cols - b, ans + 1, ans - 1, T + b]), why: `${rows} × ${cols} = ${T} squares. ${T} − ${b} = ${ans}.` }; }
        const n = pick([3, 4, 5, 6]), x = pick([4, 6, 8, 10]), cap = pick([6, 10, 12, 15]), T = n * x + cap;
        return { html: "", text: `The bone lies under <b>${n}</b> layers of rock, each <b>x</b> cm thick, plus <b>${cap} cm</b> of loose soil. The total depth is <b>${T} cm</b>. What is x?`, choices: cards(x, [T - cap, x + 1, x - 1, x + 2, cap, n]), why: `${n}x + ${cap} = ${T}, so ${n}x = ${T - cap}. x = ${T - cap} ÷ ${n} = ${x}.` };
      }
      if (kind === 0) { const [k, c] = pick([[20, pick([10, 15, 20, 25, 30])], [10, pick([10, 20, 30, 40])], [50, pick([4, 6, 8, 10])]]), ans = c * k / 100;
        return { html: "", text: `On the lab's model skeleton, at a scale of <b>1 : ${k}</b>, a leg bone is <b>${c} cm</b> long. How long was the real leg bone, in metres?`, choices: cards(ans, [c * k, c * k / 10, c + k, ans * 10, ans + 1, ans - 1]), why: `${c} × ${k} = ${c * k} cm, which is ${ans} m.` }; }
      if (kind === 1) { const [a, b] = pick([[2, 3], [1, 4], [3, 5], [3, 2], [4, 1]]), n = pick([3, 4, 5, 6, 7, 8]), T = (a + b) * n, ans = a * n;
        return { html: "", text: `A lab drawer holds meat-eater and plant-eater teeth in the ratio <b>${a} : ${b}</b>. There are <b>${T}</b> teeth in all. How many are meat-eater teeth?`, choices: cards(ans, [b * n, n, a + b, T - a, ans + n]), why: `${a} + ${b} = ${a + b} parts. ${T} ÷ ${a + b} = ${n} in each part. ${a} × ${n} = ${ans}.` }; }
      const k = pick([10, 20, 25]), x = pick([3, 4, 5, 6, 7, 8, 9]), R = k * x;
      return { html: "", text: `The model has a scale of <b>1 : ${k}</b>, and the real tail bone is <b>${R} cm</b>. The model tail is x cm long, so ${k} × x = ${R}. What is x?`, choices: cards(x, [R, R - k, x + 1, x - 1, k]), why: `${k} × x = ${R}, so x = ${R} ÷ ${k} = ${x} cm.` };
    }
  });

  // FACT CHECK: the badlands near Drumheller lie along the Red Deer River in Alberta, and the Royal Tyrrell Museum of Palaeontology is in Drumheller (it opened in 1985)
  // FACT CHECK: Dinosaur Provincial Park, downstream on the Red Deer River, is a UNESCO World Heritage Site (named in 1979) and one of the richest dinosaur fossil beds in the world (the scene says "one of the richest")
  // FACT CHECK: "the traditional territory of the Blackfoot (Niitsitapi) people": Niitsitapi is the Blackfoot word for the Blackfoot Confederacy, often translated "the real people". This area is also home to other nations (it falls under Treaty 7 and nearby Treaty 6 and 4 land). The scene uses one plain line and does not give a meaning for the word.
  // FACT CHECK (Shane's review notes, November 2026): the land acknowledgement now names the Blackfoot (Niitsitapi) and the neighbouring Treaty 7 nations, the Tsuut'ina and the Stoney Nakoda, and says the area is also a Métis homeland; pronunciation guide nee-tsee-TAH-pee added. "Archaeologists" changed to "Palaeontologists" (they study fossils).
  // FACT CHECK: hoodoos are pillars of soft rock (sandstone and mudstone) capped by a harder, wider stone that shields the pillar below from rain
  // FACT CHECK: about 75 million years ago (Late Cretaceous) southern Alberta was a warm, wet coastal plain beside the Western Interior Sea, with rivers, swamps and forests. Dinosaur Provincial Park rocks are about 76 to 75 million years old and the Drumheller rocks somewhat younger (about 70 million). The scene uses "about 75 million" for both.
  // FACT CHECK: Albertosaurus was a meat-eating tyrannosaur, smaller than T. rex, about 9 metres long (some sources say up to 10). Joseph Tyrrell found the skull in 1884 in the Red Deer River valley near today's Drumheller. The animal was named Albertosaurus in 1905 by Henry Fairfield Osborn.
  // FACT CHECK: hadrosaurs (duck-billed dinosaurs) and horned dinosaurs (Centrosaurus, Styracosaurus) lived here. The pictures are simple and friendly, not to scale.
  // FACT CHECK: how fossils form: quick burial in mud or sand, then minerals slowly replace the bone over millions of years. Older rock lies lower down in a layer stack. Rain and the river wear the rock away and uncover new fossils each year.
  // FACT CHECK: hadrosaur nests with eggs and babies were found at Devil's Coulee, near Warner in southern Alberta (the first eggs found in 1987)
  // FACT CHECK: birds are living dinosaurs, descended from small feathered meat-eating dinosaurs. The black-capped chickadee lives in Alberta.
  // FACT CHECK: the non-bird dinosaurs died out about 66 million years ago, after a large asteroid struck the Earth
  // FACT CHECK: the Drumheller railway station has stood in the town (an old station building and trains are part of local history). The scene only says a train stops at the old station.
  // FACT CHECK: French words: le dinosaure (the dinosaur), l'œuf (the egg), le fossile (the fossil), la roche (the rock), l'os (the bone)
  // FACT CHECK: "hoodoo" is an English word for a pillar of rock with a cap stone
  CHAPTERS[4] = { title: "The Land of Giants", where: "The Alberta Badlands", beats: [
    { art: "bl_arrive", word: ["hoodoo", "a pillar of soft rock with a hard cap"], say: ["Westward ho! We left the sea of grass behind, and now the ground below is <em>striped</em>. Grey, brown and rust red, like a giant cake that someone sliced.",
      "This is the Alberta badlands, beside the Red Deer River near the town of Drumheller. It is the traditional territory of the Blackfoot, the Niitsitapi. You say it nee-tsee-TAH-pee.",
      "It is also the territory of the neighbouring Treaty 7 nations, the Tsuut'ina and the Stoney Nakoda. It is a homeland of the Métis too. They live in Alberta today.",
      "See those tall pillars with flat stones balanced on top like hats? Those are <em>hoodoos</em>. And one of the rocks down there just moved. I think. Down we go!"] },
    { art: "bl_priya", word: ["le dinosaure", "the dinosaur"], say: ["A girl in a teal hoodie is waving. This is Priya. She lives in Drumheller, and she volunteers at the Royal Tyrrell Museum, which is packed with dinosaur bones.",
      "Then a green head pops up from behind the rock. It is Pip! Pip is a small green dinosaur, and an old friend of mine. Pip has been searching for lost eggs for ages.",
      "Priya says this is the best place in the world for old eggs. Pip's eyes go round. Pip says one word, <em>eggs</em>. A dinosaur is <em>le dinosaure</em> in French.",
      "Priya waved at Pip first. I am not jealous. I am a little jealous."] },
    { art: "bl_window1", say: ["The window into the past! It is about <em>75 million years ago</em>, in a time called the Late Cretaceous. This dry, dusty land is a warm, wet plain beside a shallow inland sea.",
      "There are rivers, swamps and forests. Duck-billed dinosaurs called hadrosaurs munch the leaves. Horned dinosaurs with bony frills, like Centrosaurus, wander by.",
      "And creeping along behind them is an <em>Albertosaurus</em>, a meat-eater and a smaller cousin of T. rex. It was about 9 metres long. Pip hid behind me. I hid behind Pip. Time for some very big numbers."] },
    { ask: "bl_big", intro: "Count the years with Priya. Three right answers and each one pays a Made Beaver, then we look at the rocks." },
    { art: "bl_today", word: ["le fossile", "the fossil"], say: ["Back to today! Priya shows us a striped cliff. Each stripe is a <em>layer</em> of rock, like the pages of a book. The lower pages are older.",
      "When a dinosaur died, mud or sand could bury it quickly. Over millions of years, minerals slowly replaced the bone and turned it to stone. That is a <em>fossil</em>, or <em>le fossile</em>.",
      "Then wind and rain wore the rock away, bit by bit, and new bones show up every year. In 1884 Joseph Tyrrell found the skull of a big meat-eater near here.",
      "A train whistle toots from the old station, and out hops Dot, a small purple dinosaur in a blue driver's cap! Pip squeaks. Dot says <em>choo choo</em>. It is plenty."] },
    { ask: "bl_scale", intro: "Priya needs help with models, drawings and maps. Three right answers and the window opens again." },
    { art: "bl_window2", word: ["l'œuf", "the egg"], say: ["The window again, still 75 million years ago, and now we are looking at a nest. Dinosaurs laid eggs! This is a hadrosaur nest, with a mother keeping watch over her little ones.",
      "Nests with eggs, and even tiny babies, have been found in southern Alberta, at a place called Devil's Coulee. An egg is <em>l'œuf</em> in French. Pip is staring at the eggs and not blinking.",
      "Now Pip, here is the big secret. Birds are <em>living dinosaurs</em>, descended from small feathered meat-eaters. Priya points to a chickadee on the fence. That tiny bird is a dinosaur.",
      "The other dinosaurs died out about 66 million years ago, after a giant asteroid hit the Earth. Pip whispers one word, <em>cousins</em>. Yes, Pip. Cousins."] },
    { ask: "bl_grid", intro: "The dig crew is marking out squares. Three right answers and Priya lets us pick our job." },
    { art: "bl_choice", pick: "Priya has two jobs for the afternoon. Shall we join the dig crew and brush a bone out of the ground, or go into the museum lab and measure a skeleton?", options: [
      { label: "Join the dig crew", art: "bl_dig", word: ["la roche", "the rock"], say: ["The crew pulls a string grid over the dig site, so every bone is marked by its square. We brush the dust away gently, until a rib shows. Pip spots it first.",
        "Rock is <em>la roche</em>. I brushed so carefully that a beetle thanked me. Then it sat on my beak. Palaeontologists say that is a good sign."] },
      { label: "Measure a skeleton in the lab", art: "bl_lab", word: ["l'os", "the bone"], say: ["Inside the museum lab stands a whole skeleton on a stand, with scale models of its bones on the table. Priya hands me a tape measure, and I stretch it along the floor with great importance.",
        "A bone is <em>l'os</em>. I measured the jaw, and Pip measured my tape measure. Both of us got a number, and neither of us got eaten."] }] },
    { ask: "bl_last", intro: "One last set of puzzles for the crew. Three right answers finishes the chapter." },
    { art: "bl_goodbye", say: ["Pip did not find the lost eggs. But Pip found a whole world of cousins, and every chickadee in Alberta is now a celebrity. Pip waves goodbye with both arms.",
      "Thank you, Priya, for sharing your backyard. Keep looking down, because after every rain the badlands can show you a brand new bone.",
      "Toot toot! Dot has grain cars to pull, and she offers me a ride west into wheat country. Her cap nearly flew off when she waved, and she caught it with her tail.",
      "Next stop is <em>Wheat and Sky</em>, where gold fields stretch all the way to the edge of the world. All aboard! Tick tock!"] }
  ] };
}
