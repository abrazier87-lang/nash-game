"use strict";
// Printable books: Grade 4, Dr. Somebody in Ancient Rome. It is loaded after shared/books.js and adds one entry to BOOK.
// Everything for this grade lives in this file. Top level names start with G4_ so they cannot clash with another grade.

// ---------- pictures copied from grade4-rome.html ----------
// Dr. Somebody dressed for Rome: copied from LEAVES and HOST in grade4-rome.html (a crown of green leaves and a red sash).
// The owl itself is owlSvg(), copied in shared/books.js from owl() in shared/story.js.
const G4_LEAVES = [-4, -3, -2, -1, 1, 2, 3, 4].map(i => { const x = 100 + i * 10.5, y = 16 + i * i * 1.3; return `<ellipse cx="${x}" cy="${y.toFixed(1)}" rx="7" ry="3.4" fill="#4c9f50" transform="rotate(${i * 14} ${x} ${y.toFixed(1)})"/>`; }).join("");
const G4_OWL = owlSvg("", G4_LEAVES + `<path d="M70 86 Q100 100 132 120 L126 132 Q96 112 66 98 Z" fill="#b03a2e"/>`);

// Copied from ROME_ART.colosseum, ROME_ART.aqueduct and ROME_ART.temple in grade4-rome.html.
const G4_COLOSSEUM = `<svg viewBox="0 0 220 120"><path d="M10 118 V40 Q110 6 210 40 V118 Z" fill="#e3c9a0"/><path d="M10 40 Q110 6 210 40 V52 Q110 18 10 52 Z" fill="#cfae7c"/>
    <g fill="#8a6a44">${[0, 1, 2].map(r => Array.from({ length: 9 }, (_, i) => `<path d="M${22 + i * 21} ${110 - r * 24} v-14 a7 7 0 0 1 14 0 v14 z"/>`).join("")).join("")}</g><path d="M150 118 V58 L210 40 V118 Z" fill="#d1b386" opacity=".6"/></svg>`;
const G4_AQUEDUCT = `<svg viewBox="0 0 240 110"><rect x="0" y="10" width="240" height="14" fill="#cfae7c"/><g fill="#e3c9a0">${Array.from({ length: 6 }, (_, i) => `<path d="M${i * 40} 24 h40 v86 h-8 v-50 a12 12 0 0 0 -24 0 v50 h-8 z"/>`).join("")}</g><rect x="0" y="6" width="240" height="6" fill="#3fa9e0"/></svg>`;
const G4_TEMPLE = `<svg viewBox="0 0 160 120"><polygon points="80,8 154,40 6,40" fill="#efe6d4" stroke="#cbb994" stroke-width="2"/><rect x="10" y="40" width="140" height="8" fill="#e0d4bb"/><g fill="#f6efe1">${Array.from({ length: 6 }, (_, i) => `<rect x="${18 + i * 24}" y="48" width="12" height="58"/>`).join("")}</g><rect x="6" y="106" width="148" height="12" fill="#e0d4bb"/></svg>`;

// Extra detail for the older children, drawn on top of the game's pictures.
// Colosseum: a ledge between the rows of arches, a column between every pair of arches, and a ground line.
const G4_COLOSSEUM_EXTRA = `<path d="M10 87.5 H210 M10 63.5 H210" fill="none"/>`
  + [0, 1, 2].map(r => Array.from({ length: 8 }, (_, i) => `<path d="M${39.5 + i * 21} ${110 - r * 24 - 20} V${110 - r * 24}" fill="none"/>`).join("")).join("")
  + `<path d="M4 118 H216" fill="none"/>`;
// Aqueduct: stone blocks along the water channel and courses of stone on the piers.
const G4_AQUEDUCT_EXTRA = Array.from({ length: 14 }, (_, i) => `<path d="M${(i + 1) * 16} 12 V24" fill="none"/>`).join("")
  + [1, 2, 3, 4, 5].map(k => [74, 98].map(y => `<path d="M${k * 40 - 8} ${y} H${k * 40 + 8}" fill="none"/>`).join("")).join("")
  + [74, 98].map(y => `<path d="M0 ${y} H8 M232 ${y} H240" fill="none"/>`).join("");
// Temple: a ring in the pediment, grooves down every column, and a cap on each column.
const G4_TEMPLE_EXTRA = `<polygon points="80,19 129,37 31,37" fill="none"/><circle cx="80" cy="30" r="4"/>`
  + Array.from({ length: 6 }, (_, i) => `<path d="M${18 + i * 24 + 4} 54 V104 M${18 + i * 24 + 8} 54 V104" fill="none"/><rect x="${16 + i * 24}" y="48" width="16" height="5"/>`).join("")
  + `<path d="M6 112 H154" fill="none"/>`;

// ---------- pictures drawn fresh (the game shows these only as emoji, or not at all): objects and scenery, no characters ----------
const G4_sh = (inner, w) => SCENE_TOOLS.shape(inner, w);
// Roman numerals drawn as plain lines (I, V, X, L), centred on cx, cy and h tall.
function G4_numeral(txt, cx, cy, h) {
  const w = h * .62, gap = h * .3, total = txt.length * w + (txt.length - 1) * gap;
  let x = cx - total / 2 + w / 2, d = "";
  for (const ch of txt) {
    const t = cy - h / 2, b = cy + h / 2;
    if (ch === "I") d += `M${x} ${t} V${b}`;
    else if (ch === "V") d += `M${x - w / 2} ${t} L${x} ${b} L${x + w / 2} ${t}`;
    else if (ch === "X") d += `M${x - w / 2} ${t} L${x + w / 2} ${b} M${x + w / 2} ${t} L${x - w / 2} ${b}`;
    else if (ch === "L") d += `M${x - w / 2} ${t} V${b} H${x + w / 2}`;
    x += w + gap;
  }
  return `<path d="${d}" fill="none"/>`;
}
// A cypress tree, base at x, y.
const G4_cypress = (x, y, s) => `<g transform="translate(${x} ${y}) scale(${s})">${G4_sh(`<rect x="-3" y="-4" width="6" height="14"/><path d="M0 -84 Q17 -50 13 -6 H-13 Q-17 -50 0 -84 Z"/><path d="M0 -70 V-12 M-7 -55 Q-9 -30 -6 -14 M7 -55 Q9 -30 6 -14" fill="none"/>`, LINE / s)}</g>`;
// An umbrella pine (the flat topped pine of Italy), base of the trunk at x, y.
const G4_pine = (x, y, s) => `<g transform="translate(${x} ${y}) scale(${s})">${G4_sh(`<path d="M-5 0 Q-3 -24 -8 -46 H8 Q3 -24 5 0 Z"/><path d="M-40 -48 Q-46 -62 -26 -64 Q-18 -80 2 -74 Q22 -84 34 -68 Q50 -62 42 -50 Q20 -40 -40 -48 Z"/><path d="M-24 -56 q8 -6 16 0 M6 -62 q8 -6 16 0 M-6 -48 q8 -5 14 0" fill="none"/>`, LINE / s)}</g>`;
// A clay jar with two handles (an amphora), base at x, y.
const G4_amphora = (x, y, s) => `<g transform="translate(${x} ${y}) scale(${s})">${G4_sh(`<path d="M-9 -50 Q-28 -52 -22 -32" fill="none"/><path d="M9 -50 Q28 -52 22 -32" fill="none"/><path d="M-7 0 H7 L10 -6 Q22 -24 10 -44 L8 -52 H-8 L-10 -44 Q-22 -24 -10 -6 Z"/><rect x="-11" y="-58" width="22" height="7" rx="3"/><path d="M-15 -34 Q0 -28 15 -34 M-14 -20 Q0 -14 14 -20" fill="none"/>`, LINE / s)}</g>`;
// A milestone (a stone post marking the distance along a road), base at x, y, with a numeral cut into it.
const G4_milestone = (x, y, s, txt) => `<g transform="translate(${x} ${y}) scale(${s})">${G4_sh(`<rect x="-23" y="-9" width="46" height="9" rx="2"/><path d="M-16 -9 V-62 Q-16 -80 0 -80 Q16 -80 16 -62 V-9 Z"/>${G4_numeral(txt, 0, -50, txt.length > 1 ? 15 : 22)}<path d="M-16 -34 H16 M-16 -26 H16" fill="none"/>`, LINE / s)}</g>`;
// The top edge of a wall, with battlements: from xa to xb along y, merlons w wide and h tall with gaps between. Returns path pieces to join into one shape.
function G4_crenel(xa, xb, y, w, gap, h) {
  let d = "";
  for (let x = xa; x < xb; x += w + gap) d += ` V${y - h} H${Math.min(x + w, xb)} V${y} H${Math.min(x + w + gap, xb)}`;
  return d;
}

// ---------- the five colouring pages ----------
const G4_COLOURING = [
  { // Page 1: the Colosseum as a building, with the balloon above and Dr. Somebody in front (colosseum, balloon, owl; cypresses, jars and paving drawn fresh)
    caption: "The Colosseum stands tall in the heart of Rome.",
    scene: (P, S) => {
      let joints = "";
      for (let k = 0; k < 8; k++) joints += `M${40 + k * 58} 362 V386 M${69 + k * 58} 386 V410 M${40 + k * 58} 410 V440 `;
      return [
        S.sun(52, 58, 20), S.cloud(296, 78, .9), S.cloud(98, 124, .6),
        S.bird(268, 130), S.bird(292, 118), S.bird(60, 164),
        S.hill("M-20 214 Q60 180 140 206 T300 196 T420 208"),
        G4_pine(64, 258, .66), G4_pine(338, 256, .66),
        S.hill("M-20 342 Q100 330 200 340 T420 334"),
        P("balloon", 154, 26, 92),
        P("colosseum", 40, 188, 320),
        S.shape(`<path d="M-20 361 H420 V470 H-20 Z"/><path d="M-20 386 H420 M-20 410 H420" fill="none"/><path d="${joints}" fill="none"/>`, 1.5),
        G4_cypress(32, 428, .95), G4_cypress(370, 428, .95),
        P("owl", 262, 338, 84),
        G4_amphora(104, 432, .9), G4_amphora(138, 434, .7),
        S.flower(200, 404, .45, 12), S.flower(228, 410, .38, 10)
      ].join("");
    }
  },
  { // Page 2: an aqueduct striding across a valley (aqueduct, balloon, owl; mountains, hillsides, river, jar and trees drawn fresh)
    caption: "An aqueduct strides across the green valley.",
    scene: (P, S) => [
      S.sun(338, 52, 20), S.cloud(212, 68, .8),
      S.peak(-10, 112, 170, 90), S.peak(96, 92, 210, 112), S.peak(250, 118, 150, 84),
      P("balloon", 40, 22, 74),
      S.bird(262, 120), S.bird(290, 134),
      // the two hillsides the aqueduct comes out of
      S.shape(`<path d="M-20 200 H50 Q94 222 100 372 L-20 372 Z"/>`),
      S.shape(`<path d="M420 200 H350 Q306 222 300 372 L420 372 Z"/>`),
      P("aqueduct", 30, 196, 340),
      S.hill("M-20 376 Q110 356 220 372 T420 364"),
      S.shape(`<path d="M-20 394 Q70 380 150 394 T330 392 T420 384 V412 Q320 424 220 412 T-20 418 Z"/><path d="M30 404 q10 -5 20 0 M120 410 q10 -5 20 0 M210 400 q10 -5 20 0 M300 406 q10 -5 20 0" fill="none"/>`),
      G4_cypress(64, 376, .9), G4_cypress(92, 380, .7), G4_pine(358, 372, .62),
      P("owl", 262, 332, 92),
      G4_amphora(44, 432, .85),
      S.shape(`<path d="M-20 436 Q100 424 200 432 T420 428 V470 H-20 Z"/>`),
      S.tuft(120, 440), S.tuft(190, 442), S.flower(330, 424, .42, 12)
    ].join("")
  },
  { // Page 3: a temple front with columns and steps (temple, balloon, owl; cypresses, steps, jars and wreath drawn fresh)
    caption: "Columns and steps lead to a Roman temple.",
    scene: (P, S) => {
      let steps = "";
      [[44, 353], [30, 372], [16, 391]].forEach(([x, y], i) => { for (let jx = x + 40 + (i % 2) * 22; jx < 400 - x - 16; jx += 44) steps += `M${jx} ${y} v19 `; });
      let leaves = "";
      for (let i = 0; i < 12; i++) { const a = i * Math.PI / 6; leaves += `<ellipse cx="${(200 + 17 * Math.cos(a)).toFixed(1)}" cy="${(190 + 17 * Math.sin(a)).toFixed(1)}" rx="6" ry="3" transform="rotate(${(a * 180 / Math.PI + 90).toFixed(0)} ${(200 + 17 * Math.cos(a)).toFixed(1)} ${(190 + 17 * Math.sin(a)).toFixed(1)})"/>`; }
      return [
        S.sun(60, 58, 20), S.cloud(176, 80, .8), S.bird(120, 40), S.bird(146, 28),
        S.hill("M-20 252 Q70 222 160 246 T330 236 T420 246"),
        G4_cypress(38, 345, 1.3), G4_cypress(362, 345, 1.3),
        P("balloon", 290, 22, 72),
        P("temple", 50, 132, 300),
        S.shape(`<circle cx="200" cy="190" r="12"/>` + leaves, 1.5),
        S.shape(`<rect x="44" y="353" width="312" height="19"/><rect x="30" y="372" width="340" height="19"/><rect x="16" y="391" width="368" height="19"/><path d="${steps}" fill="none"/>`, 1.8),
        S.shape(`<path d="M-20 410 H420 V470 H-20 Z"/><path d="M-20 423 H420 M60 410 V423 M150 410 V423 M240 410 V423 M330 410 V423 M105 423 V440 M195 423 V440 M285 423 V440 M375 423 V440" fill="none"/>`, 1.5),
        P("owl", 292, 358, 84),
        G4_amphora(42, 434, .9), G4_amphora(78, 436, .7),
        S.flower(180, 428, .4, 10), S.flower(212, 430, .36, 9)
      ].join("");
    }
  },
  { // Page 4: a mosaic floor to colour as a pattern, with Dr. Somebody in a round medallion (owl; the tile pattern is drawn fresh)
    caption: "Colour the mosaic tiles around Dr. Somebody.",
    scene: (P, S) => {
      const c = 28, x0 = 18, y0 = 16, cols = 13, rows = 15, cx = x0 + cols * c / 2, cy = y0 + rows * c / 2;
      let cells = "", marks = "";
      for (let r = 0; r < rows; r++) for (let k = 0; k < cols; k++) {
        const X = x0 + k * c, Y = y0 + r * c, mx = X + c / 2, my = Y + c / 2, edge = r === 0 || r === rows - 1 || k === 0 || k === cols - 1, even = (r + k) % 2 === 0;
        cells += `<rect x="${X}" y="${Y}" width="${c}" height="${c}"/>`;
        if (edge) marks += even ? `<circle cx="${mx}" cy="${my}" r="8"/>` : `<polygon points="${mx},${my - 10} ${mx + 10},${my} ${mx},${my + 10} ${mx - 10},${my}"/>`;
        else marks += even ? `<path d="M${X} ${Y} L${X + c} ${Y + c} M${X + c} ${Y} L${X} ${Y + c}" fill="none"/>` : `<circle cx="${mx}" cy="${my}" r="10"/>`;
      }
      const ring = (r1, r2, n) => { let d = ""; for (let i = 0; i <= n; i++) { const a = i / n * 2 * Math.PI, b = (i + .5) / n * 2 * Math.PI; d += `${i ? "L" : "M"}${(cx + r1 * Math.cos(a)).toFixed(1)} ${(cy + r1 * Math.sin(a)).toFixed(1)} `; if (i < n) d += `L${(cx + r2 * Math.cos(b)).toFixed(1)} ${(cy + r2 * Math.sin(b)).toFixed(1)} `; } return d; };
      let beads = "";
      for (let i = 0; i < 16; i++) { const a = i / 16 * 2 * Math.PI; beads += `<circle cx="${(cx + 98 * Math.cos(a)).toFixed(1)}" cy="${(cy + 98 * Math.sin(a)).toFixed(1)}" r="9"/>`; }
      return [
        S.shape(cells + marks, 1.6),
        S.shape(`<rect x="${x0}" y="${y0}" width="${cols * c}" height="${rows * c}" fill="none"/><rect x="${x0 + c}" y="${y0 + c}" width="${(cols - 2) * c}" height="${(rows - 2) * c}" fill="none"/>`, 3),
        S.shape(`<circle cx="${cx}" cy="${cy}" r="126"/><path d="${ring(108, 126, 24)}" fill="none"/><circle cx="${cx}" cy="${cy}" r="108"/>${beads}<circle cx="${cx}" cy="${cy}" r="88"/>`, 2),
        P("owl", cx - 78, cy - 70, 156)
      ].join("");
    }
  },
  { // Page 5: a Roman road with milestones running to a city gate (owl, balloon; gate, wall, road, milestones, trees drawn fresh)
    caption: "The Roman road leads to the city gate.",
    scene: (P, S) => {
      const xl = y => 184 + (48 - 184) * (y - 262) / 178, xr = y => 216 + (352 - 216) * (y - 262) / 178, at = (y, f) => (xl(y) + f * (xr(y) - xl(y))).toFixed(1);
      const rows = [262, 270, 280, 292, 308, 328, 354, 388, 440];
      let joints = "", rowLines = "";
      rows.forEach((y, i) => {
        if (i) rowLines += `M${at(y, 0)} ${y} L${at(y, 1)} ${y} `;
        if (i < rows.length - 1) (i % 2 ? [.1, .3, .5, .7, .9] : [.2, .4, .6, .8]).forEach(f => { joints += `M${at(y, f)} ${y} L${at(rows[i + 1], f)} ${rows[i + 1]} `; });
      });
      let furrows = "";
      [-20, 8, 36, 364, 392, 420].forEach(x => { furrows += `M200 262 L${x} 436 `; });
      let wallL = "M-20 262 V216" + G4_crenel(-20, 112, 216, 12, 8, 8) + " V262 Z", wallR = "M288 262 V216" + G4_crenel(288, 420, 216, 12, 8, 8) + " V262 Z";
      const tower = (x1, x2) => `M${x1} 262 V160` + G4_crenel(x1, x2, 160, 10, 7, 9) + ` V262 Z`;
      return [
        S.sun(56, 56, 20), S.cloud(300, 62, .9), S.cloud(96, 108, .6), S.bird(238, 40), S.bird(262, 52), S.bird(334, 124),
        S.hill("M-20 168 Q80 138 170 158 T420 148"),
        S.hill("M-20 198 Q50 168 120 190 T250 184 T420 172"),
        G4_pine(46, 190, .7), G4_pine(356, 180, .7),
        P("balloon", 158, 20, 84),
        S.shape(`<path d="${wallL}"/><path d="${wallR}"/><path d="M-20 232 H112 M-20 248 H112 M288 232 H420 M288 248 H420 M10 216 V232 M44 232 V248 M78 216 V232 M360 216 V232 M326 232 V248 M394 232 V248" fill="none"/>`, 1.6),
        S.shape(`<path d="M152 262 V196${G4_crenel(152, 248, 196, 10, 6, 8)} V262 Z"/><path d="${tower(112, 156)}"/><path d="${tower(244, 288)}"/>`),
        S.shape(`<path d="M112 214 H156 M244 214 H288 M112 236 H156 M244 236 H288 M134 214 V236 M266 214 V236" fill="none"/><path d="M128 190 V180 Q134 172 140 180 V190 Z M260 190 V180 Q266 172 272 180 V190 Z"/>`, 1.6),
        S.shape(`<path d="M176 262 V232 A24 24 0 0 1 224 232 V262 Z"/><path d="M188 262 V228 M200 262 V222 M212 262 V228 M178 244 H222 M180 254 H220" fill="none"/>`, 1.8),
        S.shape(`<path d="M${furrows}" fill="none"/>`, 1.3),
        S.shape(`<polygon points="184,262 216,262 352,440 48,440"/>`),
        S.shape(`<path d="${rowLines}${joints}" fill="none"/>`, 1.4),
        G4_cypress(66, 318, .85), G4_cypress(338, 322, .85),
        S.tree(26, 284, 15), S.tree(374, 288, 14),
        G4_milestone(148, 290, .35, "X"), G4_milestone(252, 290, .35, "X"),
        G4_milestone(108, 338, .55, "V"), G4_milestone(292, 338, .55, "XX"),
        G4_milestone(38, 420, .9, "I"), G4_milestone(362, 420, .9, "XV"),
        P("owl", 150, 336, 100),
        S.tuft(80, 410), S.tuft(332, 436), S.flower(92, 430, .4, 10), S.flower(30, 332, .38, 10), S.flower(368, 336, .36, 9), S.flower(72, 356, .34, 9)
      ].join("");
    }
  }
];

// ---------- the activity pages ----------
// The Roman numerals, written out.
function G4_roman(n) {
  let s = ""; [[50, "L"], [40, "XL"], [10, "X"], [9, "IX"], [5, "V"], [4, "IV"], [1, "I"]].forEach(([v, r]) => { while (n >= v) { s += r; n -= v; } });
  return s;
}
// Copied from SHAPES in grade4-rome.html: name, corner points, and how many lines of symmetry the game says it has.
const G4_ngon = (n, r) => Array.from({ length: n }, (_, i) => { const a = i / n * 2 * Math.PI - Math.PI / 2 + (n % 2 ? 0 : Math.PI / n); return `${(50 + (r || 42) * Math.cos(a)).toFixed(1)},${(50 + (r || 42) * Math.sin(a)).toFixed(1)}`; }).join(" ");
const G4_SHAPES = {
  square: ["16,16 84,16 84,84 16,84", 4], rectangle: ["6,28 94,28 94,72 6,72", 2], rhombus: ["50,8 82,50 50,92 18,50", 2], parallelogram: ["26,28 96,28 74,72 4,72", 0], trapezoid: ["32,28 68,28 92,72 8,72", 1],
  pentagon: [G4_ngon(5), 5], hexagon: [G4_ngon(6), 6], octagon: [G4_ngon(8), 8], "equilateral triangle": ["50,12 92,84 8,84", 3], "isosceles triangle": ["50,8 76,88 24,88", 1]
};
// Finds the lines of symmetry of a shape by trying each line through the middle and a corner or the middle of a side, and checking the shape folds onto itself.
// Gives back each line as the two ends of a segment, a little longer than the shape.
function G4_symmetryLines(pointText) {
  const pts = pointText.split(" ").map(p => p.split(",").map(Number)), n = pts.length;
  const cx = pts.reduce((a, p) => a + p[0], 0) / n, cy = pts.reduce((a, p) => a + p[1], 0) / n, dirs = [], found = [];
  pts.forEach((p, i) => { const q = pts[(i + 1) % n]; dirs.push([p[0] - cx, p[1] - cy], [(p[0] + q[0]) / 2 - cx, (p[1] + q[1]) / 2 - cy]); });
  dirs.forEach(d => {
    const L = Math.hypot(d[0], d[1]); if (L < 1e-6) return;
    const ux = d[0] / L, uy = d[1] / L;
    const ok = pts.every(p => { const vx = p[0] - cx, vy = p[1] - cy, dot = vx * ux + vy * uy, rx = 2 * dot * ux - vx + cx, ry = 2 * dot * uy - vy + cy; return pts.some(q => Math.hypot(q[0] - rx, q[1] - ry) < .8); });
    if (ok && !found.some(f => Math.abs(f[0] * uy - f[1] * ux) < 1e-3)) found.push([ux, uy]);
  });
  return found.map(([ux, uy]) => {
    let t0 = 0, t1 = 0;
    pts.forEach((a, i) => {
      const b = pts[(i + 1) % n], ex = b[0] - a[0], ey = b[1] - a[1], den = ux * ey - uy * ex;
      if (Math.abs(den) < 1e-9) return;
      const t = ((a[0] - cx) * ey - (a[1] - cy) * ex) / den, s = ((cx - a[0]) * uy - (cy - a[1]) * ux) / (ex * uy - ey * ux);
      if (s >= -1e-6 && s <= 1 + 1e-6) { t0 = Math.min(t0, t); t1 = Math.max(t1, t); }
    });
    t0 -= 6; t1 += 6;
    return [(cx + ux * t0).toFixed(1), (cy + uy * t0).toFixed(1), (cx + ux * t1).toFixed(1), (cy + uy * t1).toFixed(1)];
  });
}

// A clock face with twelve empty boxes for the numerals that fell off (the story of the game: the numerals fell off the balloon clock).
function G4_clockSvg(answers, w) {
  const cx = 170, cy = 170;
  let s = `<svg viewBox="0 0 340 340" width="${w}" height="${w}"><circle cx="${cx}" cy="${cy}" r="164" fill="#fff" stroke="#000" stroke-width="6"/><circle cx="${cx}" cy="${cy}" r="90" fill="#fff" stroke="#000" stroke-width="3"/>`;
  for (let h = 1; h <= 12; h++) {
    const a = h * Math.PI / 6 - Math.PI / 2, bx = cx + 128 * Math.cos(a), by = cy + 128 * Math.sin(a), nx = cx + 63 * Math.cos(a), ny = cy + 63 * Math.sin(a);
    s += `<rect x="${(bx - 27).toFixed(1)}" y="${(by - 19).toFixed(1)}" width="54" height="38" rx="8" fill="#fff" stroke="#000" stroke-width="3"${answers ? "" : ' stroke-dasharray="7 5"'}/>`;
    if (answers) s += `<text x="${bx.toFixed(1)}" y="${(by + 8).toFixed(1)}" font-size="22" font-weight="bold" text-anchor="middle" fill="#000">${G4_roman(h)}</text>`;
    s += `<text x="${nx.toFixed(1)}" y="${(ny + 8).toFixed(1)}" font-size="23" font-weight="bold" text-anchor="middle" fill="#000">${h}</text>`;
  }
  return s + `<circle cx="${cx}" cy="${cy}" r="8" fill="#fff" stroke="#000" stroke-width="3"/></svg>`;
}

// The clue lists, with room for two digit clue numbers.
function G4_clues(cw) {
  const list = dir => cw.words.filter(p => p.dir === dir).sort((a, b) => a.num - b.num)
    .map(p => `<li style="padding-left:34px;text-indent:-34px"><b style="width:30px">${p.num}.</b>${p.clue} (${p.word.length})</li>`).join("");
  return `<div class="clues"><div><h3>Across</h3><ol>${list(0)}</ol></div><div><h3>Down</h3><ol>${list(1)}</ol></div></div>`;
}
ACTIVITY_BUILDERS.g4Crossword = (G, A) => {
  const cw = makeCrossword(A.entries, A.seed, 10, 13);
  const cell = Math.min(44, Math.floor(700 / cw.cols), Math.floor(440 / cw.rows)), ansCell = Math.min(26, Math.floor(340 / cw.cols), Math.floor(330 / cw.rows));
  return {
    body: `<h2 class="pt">Roman Crossword</h2><p class="pi">Read each clue and write the answer in the squares. The number in the corner tells you which clue.</p>
      <div class="puz">${crosswordSvg(cw, cell, false)}${G4_clues(cw)}</div>`,
    answer: { label: "Roman Crossword", html: crosswordSvg(cw, ansCell, true) }
  };
};

ACTIVITY_BUILDERS.g4Numerals = (G, A) => {
  const rng = mulberry32(A.seed), toNumber = shuffled(A.toNumber, rng), toRoman = shuffled(A.toRoman, rng);
  const line = txt => `<div style="display:flex;align-items:flex-end;gap:10px;margin:0 0 15px;font-size:26px;font-weight:bold"><span style="width:150px">${txt}</span><span>=</span><span style="flex:1;border-bottom:3px solid #000;height:34px"></span></div>`;
  const key = `<div style="width:340px;border:3px solid #000;border-radius:14px;padding:12px 16px;font-size:17px;line-height:1.35">
      <div style="display:flex;justify-content:space-between;font-size:24px;font-weight:bold;margin-bottom:10px;white-space:nowrap"><span>I = 1</span><span>V = 5</span><span>X = 10</span><span>L = 50</span></div>
      <p style="margin:0 0 8px">A small letter after a big one adds. VI is 6.</p>
      <p style="margin:0 0 8px">A small letter before a big one takes away. IV is 4.</p>
      <p style="margin:0">Write a Roman numeral in each box on the clock.</p></div>`;
  return {
    body: `<h2 class="pt">Roman Numerals</h2><p class="pi">The numerals fell off the clock on Dr. Somebody's balloon! Use the key to put them back.</p>
      <div class="puz"><div style="display:flex;gap:16px;align-items:center;justify-content:center;width:100%">${G4_clockSvg(false, 350)}${key}</div>
      <div style="display:flex;gap:34px;width:100%;margin-top:22px"><div style="flex:1"><h3 style="margin:0 0 10px;font-size:19px;border-bottom:2px solid #000">Write the number</h3>${toNumber.map(r => line(r)).join("")}</div>
      <div style="flex:1"><h3 style="margin:0 0 10px;font-size:19px;border-bottom:2px solid #000">Write the Roman numeral</h3>${toRoman.map(n => line(n)).join("")}</div></div></div>`,
    answer: {
      label: "Roman Numerals",
      html: `<div style="width:340px">${G4_clockSvg(true, 190)}<div style="display:flex;gap:10px;text-align:left;font-size:13px;line-height:1.45;font-weight:normal"><div style="flex:1">${toNumber.map(r => `${r} = ${A.toNumber.indexOf(r) >= 0 ? A.values[r] : ""}`).join("<br>")}</div><div style="flex:1">${toRoman.map(n => `${n} = ${G4_roman(n)}`).join("<br>")}</div></div></div>`
    }
  };
};

ACTIVITY_BUILDERS.g4Symmetry = (G, A) => {
  const shapes = A.shapes.map(name => ({ name, pts: G4_SHAPES[name][0], count: G4_SHAPES[name][1], lines: G4_symmetryLines(G4_SHAPES[name][0]) }));
  shapes.forEach(s => { if (s.lines.length !== s.count) throw new Error("symmetry lines for " + s.name + " do not match the game"); });
  const dash = lines => lines.map(l => `<line x1="${l[0]}" y1="${l[1]}" x2="${l[2]}" y2="${l[3]}" stroke="#000" stroke-width="2.6" stroke-dasharray="5 3.5" stroke-linecap="round"/>`).join("");
  const W = 720, rowH = 196, H = Math.ceil(shapes.length / 2) * rowH;
  let s = `<svg viewBox="0 0 ${W} ${H}" width="${W}" height="${H}">`;
  shapes.forEach((sh, i) => {
    const ox = (i % 2) * 360 + 6, oy = Math.floor(i / 2) * rowH + 4;
    s += `<text x="${ox + 4}" y="${oy + 24}" font-size="21" font-weight="bold" fill="#000">${sh.name}</text>`;
    s += `<svg x="${ox}" y="${oy + 32}" width="146" height="146" viewBox="0 0 100 100"><polygon points="${sh.pts}" fill="#fff" stroke="#000" stroke-width="2.8" stroke-linejoin="round"/></svg>`;
    s += `<text x="${ox + 168}" y="${oy + 90}" font-size="18" font-weight="bold" fill="#000">How many lines?</text><rect x="${ox + 190}" y="${oy + 104}" width="76" height="56" rx="12" fill="#fff" stroke="#000" stroke-width="3.5"/>`;
  });
  s += `</svg>`;
  // the answer: the same shapes with their lines drawn in, and the number under each
  const aw = 340, cw = aw / 4, ah = Math.ceil(shapes.length / 4) * (cw + 20);
  let a = `<svg viewBox="0 0 ${aw} ${ah}" width="${aw}" height="${ah}">`;
  shapes.forEach((sh, i) => {
    const x = (i % 4) * cw, y = Math.floor(i / 4) * (cw + 20);
    a += `<svg x="${x + 4}" y="${y}" width="${cw - 8}" height="${cw - 8}" viewBox="0 0 100 100"><polygon points="${sh.pts}" fill="#fff" stroke="#000" stroke-width="3.2" stroke-linejoin="round"/>${dash(sh.lines).replace(/stroke-width="2.6"/g, 'stroke-width="3"')}</svg>`;
    a += `<text x="${x + cw / 2}" y="${y + cw + 8}" font-size="15" font-weight="bold" text-anchor="middle" fill="#000">${sh.count}</text>`;
  });
  a += `</svg>`;
  return {
    body: `<h2 class="pt">Mirror Lines</h2><p class="pi">A line of symmetry folds a shape into two halves that match. Draw every line of symmetry you can find on each shape. Then write how many there are.</p><div class="puz">${s}</div>`,
    answer: { label: "Mirror Lines", html: a }
  };
};

// ---------- the grade ----------
BOOK.g4 = {
  story: "Dr. Somebody in Ancient Rome",
  gradeLabel: "Grade 4",
  order: 4,
  lineWidth: 2,
  pictures: {
    owl: { svg: G4_OWL, viewBox: "0 -12 200 172", black: ["#2b2d42"], drop: [/<circle cx="(?:80|120)" cy="48" r="14" fill="#fff"\/>/g] },   // eye whites cut out so the eyes are not crowded
    balloon: { svg: BALLOON, extra: BALLOON_EXTRA, drop: [/<g stroke="#39405a" stroke-width="4"[^>]*>[\s\S]*?<\/g>/, /<circle cx="\d+" cy="15[24]"[^>]*\/>/g] },
    colosseum: { svg: G4_COLOSSEUM, extra: G4_COLOSSEUM_EXTRA },
    aqueduct: { svg: G4_AQUEDUCT, extra: G4_AQUEDUCT_EXTRA },
    temple: { svg: G4_TEMPLE, extra: G4_TEMPLE_EXTRA }
  },
  colouring: G4_COLOURING,
  activities: {
    pages: ["maze", "g4Crossword", "g4Numerals", "g4Symmetry"],
    maze: { seed: 753, cols: 16, rows: 20, cs: 36, ox: 72, oy: 34, wall: 4, startW: 62, endW: 60, start: "owl", end: "temple", answerWidth: 340, title: "Find the road to Rome!", instruction: "Start at Dr. Somebody. Find the way along the roads to the temple in Rome. Be careful of dead ends!" },
    g4Crossword: {
      seed: 11,
      entries: [   // each clue is based on a fact in grade4-rome.html (SCROLLS, ROME_FACTS, ROME_TOUR, ROOTS) and agrees in number with its answer
        { word: "AQUEDUCT", clue: "A stone channel on tall arches that carried fresh water into a Roman city" },
        { word: "COLOSSEUM", clue: "The giant arena in Rome that could hold about fifty thousand people" },
        { word: "NUMERALS", clue: "Letters such as I, V and X that the Romans used for numbers" },
        { word: "MOSAIC", clue: "A floor picture made from tiny coloured tiles" },
        { word: "VESUVIUS", clue: "The volcano in Italy that buried the town of Pompeii in ash" },
        { word: "LATIN", clue: "The language of the Romans, which many English words come from" },
        { word: "FORUM", clue: "The place where Romans met to shop, talk and make decisions" },
        { word: "BATHS", clue: "Places where Romans went to wash, exercise and meet friends" },
        { word: "TIBER", clue: "The river beside the village where Rome began" },
        { word: "CONCRETE", clue: "A building material so strong that some Roman buildings still stand today" },
        { word: "ROADS", clue: "The Romans built more than eighty thousand kilometres of these" },
        { word: "AQUA", clue: "The Latin word part that means water" },
        { word: "JULY", clue: "The month named after Julius Caesar" }
      ]
    },
    g4Numerals: {
      seed: 29,
      toNumber: ["XIV", "XXVI", "XIX", "XXXVIII", "XLIV", "XLIX", "XXI", "L"],
      values: { XIV: 14, XXVI: 26, XIX: 19, XXXVIII: 38, XLIV: 44, XLIX: 49, XXI: 21, L: 50 },
      toRoman: [9, 16, 23, 34, 40, 47, 29, 48]
    },
    g4Symmetry: { shapes: ["square", "rectangle", "equilateral triangle", "isosceles triangle", "parallelogram", "trapezoid", "pentagon", "hexagon"] }
  }
};
