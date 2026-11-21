"use strict";
/* =====================================================================
   PRINTABLE BOOKS, GRADE 2: Dr. Somebody in Ancient Egypt (grade2-egypt.html).
   Loaded after shared/books.js, so its top-level names (BOOK, shape, owlSvg, BALLOON, ACTIVITY_BUILDERS ...) are visible here.
   Everything for this grade is in this one file. Names that start with G2_ or g2 belong to this grade only.
   ===================================================================== */

// ---------- Dr. Somebody dressed for Egypt ----------
// Copied from HOST in grade2-egypt.html: a blue and gold striped head cloth (drawn behind his head) and a gold circlet with a red jewel (in front).
const G2_CLOTH = `<path d="M60 30 L44 100 L70 104 L76 60 Z" fill="#2f6fab"/><path d="M140 30 L156 100 L130 104 L124 60 Z" fill="#2f6fab"/>
   <g stroke="#ffd23f" stroke-width="4"><line x1="55" y1="56" x2="75" y2="60"/><line x1="51" y1="74" x2="73" y2="78"/><line x1="47" y1="91" x2="71" y2="95"/><line x1="145" y1="56" x2="125" y2="60"/><line x1="149" y1="74" x2="127" y2="78"/><line x1="153" y1="91" x2="129" y2="95"/></g>`;
const G2_CIRCLET = `<path d="M58 36 Q100 0 142 36 L140 26 Q100 -6 60 26 Z" fill="#ffd23f"/><circle cx="100" cy="14" r="5" fill="#ff5a5f"/>`;

// ---------- drawings copied from EGYPT_ART in grade2-egypt.html ----------
const G2_PYRAMIDS = `<svg viewBox="0 0 200 110"><polygon points="70,8 136,108 4,108" fill="#e2b25a"/><polygon points="70,8 136,108 70,108" fill="#c48f3a"/><polygon points="150,40 196,108 104,108" fill="#e2b25a"/><polygon points="150,40 196,108 150,108" fill="#c48f3a"/></svg>`;
// Courses of stone blocks across both pyramids. The far pyramid's lines stop where the near pyramid starts.
const G2_PYRAMID_LINES = (() => {
  const half1 = y => (y - 8) * .66, half2 = y => (y - 40) * 46 / 68, left2 = y => 150 - half2(y);
  let d = "";
  [30, 52, 74, 96].forEach(y => { d += `M${(70 - half1(y)).toFixed(1)} ${y} H${Math.min(70 + half1(y), y > 84 ? left2(y) : 999).toFixed(1)} `; });
  [60, 78, 96].forEach(y => { d += `M${(150 - half2(y)).toFixed(1)} ${y} H${(150 + half2(y)).toFixed(1)} `; });
  // staggered joints between the stones: each course has its joints half a stone along from the one below
  const joints = (cx, courses, inside) => courses.forEach(([y0, y1, offs]) => offs.forEach(o => { if (inside(cx + o, y0) && inside(cx + o, y1)) d += `M${cx + o} ${y0} V${y1} `; }));
  joints(70, [[30, 52, [-14, 14]], [52, 74, [-28, 28]], [74, 96, [-14, 14, -42, 42]], [96, 108, [-28, 28, -56, 56]]], (x, y) => Math.abs(x - 70) < half1(y) - 2 && !(y > 84 && x > left2(y) - 2));
  joints(150, [[60, 78, [-8, 8]], [78, 96, [-16, 16]], [96, 108, [-8, 8, -26, 26]]], (x, y) => Math.abs(x - 150) < half2(y) - 2);
  return `<path d="${d}" fill="none"/>`;
})();
const G2_SPHINX = `<svg viewBox="0 0 200 110"><rect x="40" y="62" width="140" height="40" rx="8" fill="#d6a85a"/><rect x="150" y="88" width="46" height="14" rx="6" fill="#c4954a"/><path d="M26 30 Q40 10 62 18 L70 62 L22 62 Z" fill="#d6a85a"/>
    <path d="M18 30 L28 26 L30 64 L14 64 Z" fill="#3c6fb0"/><path d="M70 30 L60 26 L58 64 L74 64 Z" fill="#3c6fb0"/><circle cx="38" cy="36" r="3" fill="#2b2d42"/><circle cx="52" cy="36" r="3" fill="#2b2d42"/><path d="M40 48 Q45 52 50 48" stroke="#2b2d42" stroke-width="2" fill="none"/></svg>`;
// Stone block lines on the body and stripes on the head cloth, added for the older children.
const G2_SPHINX_EXTRA = `<rect x="4" y="88" width="56" height="15" rx="7"/><path d="M20 88 V103 M36 88 V103" fill="none"/><path d="M44 76 H178 M70 62 V76 M110 62 V76 M150 62 V76 M90 76 V88 M130 76 V88 M45 40 V46 M16 40 L29 38 M15 50 L29 49 M15 59 L30 58 M72 40 L59 38 M73 50 L59 49 M74 59 L58 58" fill="none"/>`;
const G2_FELUCCA = `<svg viewBox="0 0 100 100"><path d="M10 72 L90 72 L80 88 L20 88 Z" fill="#8a5a2b"/><line x1="50" y1="10" x2="50" y2="72" stroke="#5b3a1a" stroke-width="3"/><path d="M52 12 L52 68 L86 68 Z" fill="#fff8e7" stroke="#d9c9a3" stroke-width="2"/></svg>`;
// Stripes across the sail, planks on the hull and a little flag on the mast top, added for the older children.
const G2_FELUCCA_EXTRA = `<path d="M52 28 H61.7 M52 44 H70.9 M52 58 H79.5 M14.5 80 H85.5" fill="none"/><path d="M50 10 L38 14 L50 18 Z"/>`;
const G2_OBELISK = `<svg viewBox="0 0 60 160"><polygon points="30,4 42,22 18,22" fill="#e9c46a"/><polygon points="18,22 42,22 46,156 14,156" fill="#d6a85a"/><g fill="#a0742e"><rect x="27" y="40" width="6" height="6"/><rect x="25" y="60" width="10" height="3"/><circle cx="30" cy="80" r="3"/><rect x="27" y="96" width="6" height="8"/></g></svg>`;
// The game's glyph marks are too small to colour, so they are cut out and bigger ones are drawn instead.
const G2_OBELISK_EXTRA = `<circle cx="30" cy="44" r="6"/><path d="M20 66 q5 -6 10 0 t10 0" fill="none"/><rect x="25" y="78" width="10" height="14" rx="2"/><polygon points="30,104 38,120 22,120"/><rect x="26" y="130" width="8" height="14" rx="3"/>`;
const G2_SCROLL = `<svg viewBox="0 0 100 80"><rect x="16" y="10" width="68" height="60" fill="#f3e3b5"/><rect x="8" y="6" width="12" height="68" rx="6" fill="#d9b779"/><rect x="80" y="6" width="12" height="68" rx="6" fill="#d9b779"/><g fill="#7a5a2b"><circle cx="34" cy="26" r="4"/><path d="M48 20 L56 32 L40 32 Z"/><rect x="62" y="22" width="10" height="8"/><path d="M30 48 Q40 40 50 48 T70 48" stroke="#7a5a2b" stroke-width="3" fill="none"/></g></svg>`;
const G2_SCROLL_EXTRA = `<circle cx="33" cy="25" r="7"/><polygon points="50,18 61,34 39,34"/><rect x="65" y="19" width="12" height="14" rx="2"/><path d="M26 54 q8 -8 16 0 t16 0 t14 0" fill="none"/>`;
const G2_EYES = [/<circle cx="(?:80|120)" cy="48" r="14" fill="#fff"\/>/g];   // the same cut as the other grades: the eye whites go so the eyes are not crowded

// ---------- small things drawn fresh in the same bold style (the game shows palms, pots and fruit only as emoji or not at all) ----------
// All of these are objects or plants. They draw themselves with the line width of the page being made (LINE).
const g2At = (x, y, s, inner) => `<g transform="translate(${x} ${y}) scale(${s})">${shape(inner, LINE / s)}</g>`;
// A palm tree: x, y is the middle of the foot of the trunk. About 120 tall at scale 1, fronds reach about 65 each side of the top.
function g2Palm(x, y, s, lean) {
  lean = lean === undefined ? 12 : lean;
  const H = 120, cx = lean * .3;
  let rings = "";
  [.12, .26, .4, .54, .68, .82].forEach(t => {
    const u = 1 - t, xl = u * u * -9 + 2 * u * t * (cx - 7) + t * t * (lean - 5), xr = u * u * 9 + 2 * u * t * (cx + 7) + t * t * (lean + 5), yy = 2 * u * t * -62 + t * t * -H;
    rings += `M${xl.toFixed(1)} ${yy.toFixed(1)} Q${((xl + xr) / 2).toFixed(1)} ${(yy + 6).toFixed(1)} ${xr.toFixed(1)} ${yy.toFixed(1)} `;
  });
  const frond = (len, a, flip) => `<g transform="translate(${lean} ${-H}) ${flip ? "scale(-1 1) " : ""}rotate(${a})"><path d="M0 0 Q${len * .4} ${-len * .62} ${len} ${len * .2} Q${len * .55} ${-len * .04} 0 9 Z"/><path d="M3 3 Q${len * .5} ${-len * .3} ${len * .9} ${len * .16}" fill="none"/></g>`;
  return g2At(x, y, s,
    `<path d="M-9 0 Q${cx - 7} -62 ${lean - 5} ${-H} L${lean + 5} ${-H} Q${cx + 7} -62 9 0 Z"/><path d="${rings}" fill="none"/>`
    + frond(66, 24, 0) + frond(66, 24, 1) + frond(70, -14, 0) + frond(70, -14, 1) + frond(58, -52, 0) + frond(58, -52, 1)
    + `<circle cx="${lean - 5}" cy="${-H + 9}" r="5.5"/><circle cx="${lean + 6}" cy="${-H + 11}" r="5.5"/>`);
}
// A clump of reeds with a cattail: blades grow up from x, y (the base). About 100 tall at scale 1.
function g2Reeds(x, y, s) {
  const blade = (dx, h, tilt) => `<path d="M${dx - 5} 0 Q${dx - 6 + tilt * .4} ${-h * .55} ${dx + tilt} ${-h} Q${dx + 6 + tilt * .4} ${-h * .55} ${dx + 5} 0 Z"/>`;
  return g2At(x, y, s, blade(-16, 74, -14) + blade(14, 82, 14) + blade(-6, 98, -4) + blade(7, 90, 5) + `<path d="M0 0 V-84 M-3 -26 L-3 -84 H3 L3 -26" fill="none"/><ellipse cx="0" cy="-70" rx="6" ry="14"/>`);
}
// A lotus flower floating on its pad: x, y is the middle of the pad.
function g2Lotus(x, y, s) {
  const petal = a => `<path d="M0 0 Q-11 -13 0 -36 Q11 -13 0 0 Z" transform="rotate(${a})"/>`;
  return g2At(x, y, s, `<ellipse cx="0" cy="3" rx="36" ry="9"/><path d="M-20 3 H20" fill="none"/>` + petal(-62) + petal(62) + petal(-32) + petal(32) + petal(0) + `<path d="M0 -3 V-30" fill="none"/>`);
}
// A fig: x, y is the middle.
const g2Fig = (x, y, s) => g2At(x, y, s, `<path d="M0 -14 C-20 -8 -20 18 0 20 C20 18 20 -8 0 -14 Z"/><path d="M0 -14 Q1 -20 5 -23 M0 -8 V12" fill="none"/>`);
// A bunch of grapes hanging from a stem with a leaf: x, y is the top of the stem.
const g2Grapes = (x, y, s) => g2At(x, y, s, [[-13, 12], [0, 12], [13, 12], [-6, 25], [7, 25], [0, 38]].map(([a, b]) => `<circle cx="${a}" cy="${b}" r="7.5"/>`).join("") + `<path d="M0 12 V0 Q4 -4 8 -2" fill="none"/><path d="M3 4 Q14 -10 24 0 Q14 8 3 4 Z"/>`);
// A loaf of bread: x, y is the middle.
const g2Loaf = (x, y, s) => g2At(x, y, s, `<ellipse cx="0" cy="0" rx="30" ry="15"/><path d="M-15 -8 l7 14 M-3 -10 l7 17 M10 -8 l7 14" fill="none"/>`);
// A round clay pot with a wide mouth: x, y is the middle of the bottom.
const g2Pot = (x, y, w, h) => g2At(x, y, 1, `<path d="M${-w * .5} ${-h * .78} Q${-w * .62} ${-h * .1} ${-w * .22} 0 H${w * .22} Q${w * .62} ${-h * .1} ${w * .5} ${-h * .78} Z"/><ellipse cx="0" cy="${-h * .78}" rx="${w * .5}" ry="${h * .13}"/><path d="M${-w * .55} ${-h * .5} q${w * .11} ${-h * .12} ${w * .22} 0 t${w * .22} 0 t${w * .22} 0 t${w * .22} 0 t${w * .22} 0 M${-w * .5} ${-h * .27} H${w * .5}" fill="none"/>`);
// A tall jar (amphora) with two handles: x, y is the middle of the bottom.
function g2Jar(x, y, w, h) {
  const nw = w * .17, bw = w * .5;
  let zig = `M${-bw * .9} ${-h * .5}`;
  for (let i = 0; i < 6; i++) zig += ` L${(-bw * .9 + (i + .5) * bw * 1.8 / 6).toFixed(1)} ${-h * .36} L${(-bw * .9 + (i + 1) * bw * 1.8 / 6).toFixed(1)} ${-h * .5}`;
  return g2At(x, y, 1,
    `<ellipse cx="${nw + w * .2}" cy="${-h * .78}" rx="${w * .15}" ry="${h * .1}"/><ellipse cx="${-nw - w * .2}" cy="${-h * .78}" rx="${w * .15}" ry="${h * .1}"/>`
    + `<path d="M${-nw * 1.5} ${-h} H${nw * 1.5} L${nw} ${-h + 9} Q${nw} ${-h * .8} ${bw} ${-h * .55} Q${bw * 1.03} ${-h * .1} ${bw * .45} 0 H${-bw * .45} Q${-bw * 1.03} ${-h * .1} ${-bw} ${-h * .55} Q${-nw} ${-h * .8} ${-nw} ${-h + 9} Z"/>`
    + `<path d="M${-bw * .97} ${-h * .5} H${bw * .97} M${-bw * .93} ${-h * .36} H${bw * .93} ${zig}" fill="none"/>`);
}
// A woven basket heaped with round things (fruit): x, y is the middle of the bottom. `heap` is a list of [dx, dy, r].
function g2Basket(x, y, w, h, heap) {
  let weave = "";
  [.3, .6].forEach(t => { weave += `M${(-w * (.4 + .1 * (1 - t))).toFixed(1)} ${(-h * t).toFixed(1)} H${(w * (.4 + .1 * (1 - t))).toFixed(1)} `; });
  for (let i = -2; i <= 2; i++) weave += `M${(i * w * .17).toFixed(1)} ${-h * .98} L${(i * w * .14).toFixed(1)} 0 `;
  return g2At(x, y, 1, (heap || []).map(([a, b, r]) => `<circle cx="${a}" cy="${-h + b}" r="${r}"/>`).join("") + `<path d="M${-w / 2} ${-h} L${-w * .4} 0 H${w * .4} L${w / 2} ${-h} Z"/><ellipse cx="0" cy="${-h}" rx="${w / 2}" ry="${h * .12}"/><path d="${weave}" fill="none"/>`);
}
// A few stones lying on the sand.
const g2Stones = list => shape(list.map(([x, y, rx, ry]) => `<ellipse cx="${x}" cy="${y}" rx="${rx}" ry="${ry}"/>`).join(""));
// Sand ripples: short curved lines.
const g2Ripples = list => shape(list.map(([x, y, n]) => `M${x} ${y}` + " q8 -7 16 0".repeat(n || 1)).map(d => `<path d="${d}" fill="none"/>`).join(""));

// ---------- hieroglyph picture signs (objects only), drawn about 44 wide and centred on 0, 0 ----------
const G2_GLYPHS = {
  eye: `<path d="M-21 2 Q0 -18 21 2 Q0 17 -21 2 Z"/><circle cx="0" cy="1" r="8"/><circle cx="0" cy="1" r="3" fill="#000"/><path d="M-19 -9 Q0 -23 19 -9" fill="none"/><path d="M-3 15 Q-3 22 -9 24 M5 14 V25" fill="none"/>`,
  ankh: `<path d="M-4 -2 H-15 V6 H-4 V26 H4 V6 H15 V-2 H4 Z"/><ellipse cx="0" cy="-11" rx="9.5" ry="12"/><ellipse cx="0" cy="-11" rx="4" ry="6.5"/>`,
  water: `<path d="M-21 -11 q5.25 -7 10.5 0 t10.5 0 t10.5 0 t10.5 0 M-21 1 q5.25 -7 10.5 0 t10.5 0 t10.5 0 t10.5 0 M-21 13 q5.25 -7 10.5 0 t10.5 0 t10.5 0 t10.5 0" fill="none"/>`,
  sun: `<circle cx="0" cy="0" r="14"/><circle cx="0" cy="0" r="5.5"/>` + Array.from({ length: 8 }, (_, i) => { const a = i * Math.PI / 4; return `<path d="M${(17.5 * Math.cos(a)).toFixed(1)} ${(17.5 * Math.sin(a)).toFixed(1)} L${(23 * Math.cos(a)).toFixed(1)} ${(23 * Math.sin(a)).toFixed(1)}" fill="none"/>`; }).join(""),
  feather: `<path d="M0 -24 Q17 -8 7 20 L0 27 L-7 20 Q-17 -8 0 -24 Z"/><path d="M0 -20 V27" fill="none"/><path d="M0 -8 L10 -14 M0 3 L11 -3 M0 13 L9 7 M0 -2 L-10 -8 M0 9 L-10 3" fill="none"/>`,
  pyramid: `<path d="M0 -23 L25 19 H-25 Z"/><path d="M0 -23 V19 M-12 -2 H12 M-19 9 H19" fill="none"/>`,
  lotus: `<path d="M0 18 Q-12 4 0 -22 Q12 4 0 18 Z"/><path d="M-4 18 Q-24 12 -20 -8 Q-6 -2 -4 18 Z"/><path d="M4 18 Q24 12 20 -8 Q6 -2 4 18 Z"/><path d="M-18 21 H18" fill="none"/>`,
  boat: `<path d="M-23 9 H23 L14 20 H-14 Z"/><path d="M0 9 V-22" fill="none"/><path d="M3 -20 V6 H18 Z"/>`,
  bread: `<path d="M-22 16 A22 22 0 0 1 22 16 Z"/><path d="M-11 16 A11 11 0 0 1 11 16" fill="none"/>`,
  house: `<rect x="-21" y="-15" width="42" height="32"/><rect x="-9" y="-3" width="18" height="20" rx="2"/><path d="M-21 -7 H21" fill="none"/>`,
  star: `<polygon points="${starPoints(23, 10)}"/>`,
  bowl: `<path d="M-23 -4 H23 L17 18 H-17 Z"/><path d="M-19 6 H19 M-12 -4 L-10 18 M0 -4 V18 M12 -4 L10 18" fill="none"/>`
};
const g2Glyph = (name, x, y, s) => g2At(x, y, s, G2_GLYPHS[name]);

// ---------- the book ----------
BOOK.g2 = {
  story: "Dr. Somebody in Ancient Egypt",
  gradeLabel: "Grade 2",
  order: 2,
  lineWidth: 3,
  pictures: {
    owl: { svg: owlSvg(G2_CLOTH, G2_CIRCLET), viewBox: "0 -12 200 172", black: ["#2b2d42"], drop: G2_EYES },   // Dr. Somebody in his Egyptian head cloth and circlet (HOST in grade2-egypt.html)
    balloon: { svg: BALLOON, extra: BALLOON_EXTRA, drop: [/<g stroke="#39405a" stroke-width="4"[^>]*>[\s\S]*?<\/g>/, /<circle cx="\d+" cy="15[24]"[^>]*\/>/g] },   // the same clock balloon as Grades 1 and 3
    pyramids: { svg: G2_PYRAMIDS, extra: G2_PYRAMID_LINES },
    sphinx: { svg: G2_SPHINX, extra: G2_SPHINX_EXTRA, black: ["#2b2d42"] },
    felucca: { svg: G2_FELUCCA, extra: G2_FELUCCA_EXTRA },
    obelisk: { svg: G2_OBELISK, extra: G2_OBELISK_EXTRA, drop: [/<g fill="#a0742e">[\s\S]*?<\/g>/] },
    scroll: { svg: G2_SCROLL, extra: G2_SCROLL_EXTRA, drop: [/<g fill="#7a5a2b">[\s\S]*?<\/g>/] }
  },
  colouring: [
    { // Page 1: the balloon over the pyramids, Dr. Somebody on the sand (balloon, pyramids, owl; palms drawn fresh)
      caption: "Dr. Somebody visits the pyramids of Giza!",
      scene: (P, S) => [
        S.sun(336, 58, 24), S.cloud(84, 66, 1), S.cloud(322, 152, .62),
        S.bird(54, 130), S.bird(80, 142), S.bird(300, 112),
        P("balloon", 128, 36, 124),
        P("pyramids", 36, 192, 330),
        S.hill("M-20 334 Q100 314 220 332 T420 322"),
        g2Ripples([[28, 350, 3], [210, 346, 2], [316, 352, 3]]),
        S.hill("M-20 394 Q110 374 240 392 T420 382"),
        g2Palm(222, 420, .66, 8),
        P("owl", 38, 320, 112),
        g2Palm(304, 440, 1.02, 14),
        g2Stones([[176, 428, 16, 6], [206, 440, 22, 7], [92, 436, 14, 5]]),
        S.tuft(34, 438), S.tuft(150, 436), S.tuft(352, 442), g2Ripples([[40, 408, 2]])
      ].join("")
    },
    { // Page 2: a felucca with a big sail and Dr. Somebody aboard, on the Nile (felucca, owl, pyramids; palms, reeds, lotus drawn fresh)
      caption: "Dr. Somebody sails along the mighty Nile!",
      scene: (P, S) => [
        S.sun(62, 58, 22), S.cloud(196, 62, .9), S.cloud(330, 112, .68),
        S.bird(120, 118), S.bird(146, 130),
        P("pyramids", 246, 140, 118),
        S.hill("M-20 214 Q100 196 220 210 T420 202"),
        g2Palm(52, 218, .56, 6), g2Palm(100, 214, .46, 6), g2Palm(344, 210, .5, 4),
        S.shape(`<path d="M-10 226 Q100 214 200 226 T410 222 V470 H-10 Z"/>`),
        g2Ripples([[28, 242, 3], [304, 252, 2], [34, 330, 2], [330, 358, 3]]),
        P("felucca", 286, 252, 96),
        P("owl", 92, 296, 100),
        P("felucca", 60, 188, 266),
        g2Ripples([[40, 400, 4], [190, 440, 5], [290, 426, 3], [40, 276, 3], [190, 262, 2]]),
        g2Lotus(96, 436, .66), g2Lotus(300, 396, .56), g2Lotus(236, 442, .5), g2Lotus(54, 348, .5),
        g2Reeds(30, 448, .9), g2Reeds(366, 448, .86)
      ].join("")
    },
    { // Page 3: the Sphinx in front of the pyramids, with Dr. Somebody looking up at it (sphinx, pyramids, balloon, owl)
      caption: "The giant Sphinx is carved from one rock!",
      scene: (P, S) => [
        S.sun(338, 60, 26), S.cloud(108, 62, 1), S.cloud(260, 120, .6),
        S.bird(70, 132), S.bird(96, 146),
        P("balloon", 330, 128, 48),
        P("pyramids", 90, 142, 300),
        S.hill("M-20 340 Q100 324 220 338 T420 330"),
        g2Ripples([[300, 354, 3], [200, 352, 2]]),
        P("obelisk", 340, 296, 42),
        P("sphinx", 30, 258, 306),
        S.hill("M-20 424 Q120 408 240 422 T420 414"),
        P("owl", 24, 350, 88),
        g2Stones([[140, 436, 18, 6], [176, 440, 14, 5], [270, 438, 22, 7], [314, 434, 12, 5]]),
        S.tuft(44, 440), S.tuft(236, 444), S.tuft(376, 442), g2Ripples([[96, 410, 2]])
      ].join("")
    },
    { // Page 4: a wall of picture writing with Dr. Somebody the scribe, a scroll and an ink pot (owl, scroll; glyphs, cartouche and patterns drawn fresh)
      caption: "Dr. Somebody writes hieroglyphs on the wall!",
      scene: (P, S) => {
        const names = ["eye", "ankh", "water", "sun", "feather", "pyramid", "lotus", "boat", "bread", "house", "star", "bowl"];
        let slabs = "", glyphs = "";
        names.forEach((n, i) => {
          const cx = 28 + 8 + 38 + (i % 4) * 84, cy = 136 + 30 + Math.floor(i / 4) * 68;
          slabs += `<rect x="${cx - 38}" y="${cy - 30}" width="76" height="60" rx="7"/>`;
          glyphs += g2Glyph(n, cx, cy, .95);
        });
        // a zigzag frieze along the top of the wall
        let zig = "M28 112"; for (let i = 0; i < 16; i++) zig += ` L${(28 + (i + .5) * 21.5).toFixed(1)} 128 L${(28 + (i + 1) * 21.5).toFixed(1)} 112`;
        return [
          S.shape(`<rect x="46" y="22" width="308" height="76" rx="38"/><rect x="60" y="34" width="280" height="52" rx="26"/><path d="M354 34 V86" fill="none"/>`),
          g2Glyph("sun", 130, 60, .78), g2Glyph("feather", 200, 60, .78), g2Glyph("eye", 270, 60, .78),
          S.sparkle(30, 62, 8), S.sparkle(372, 62, 8),
          S.shape(`<rect x="28" y="104" width="344" height="236"/><rect x="28" y="104" width="344" height="24"/><path d="${zig}" fill="none"/>`),
          S.shape(slabs, 2.4), glyphs,
          S.shape(`<rect x="20" y="338" width="360" height="16" rx="3"/>`),
          S.hill("M-20 392 Q110 376 230 390 T420 380"),
          g2Stones([[364, 424, 12, 5]]),
          P("owl", 34, 332, 124),
          g2Pot(184, 436, 44, 46),
          P("scroll", 212, 346, 134),
          S.tuft(366, 444)
        ].join("");
      }
    },
    { // Page 5: a market stall with Dr. Somebody behind the counter (owl, pyramids; the stall, pots, baskets, fruit and bread drawn fresh)
      caption: "Dr. Somebody visits a busy Egyptian market!",
      scene: (P, S) => {
        // the striped awning: a flat top, a wavy hem, and stripes running down to each wave
        let hem = "M46 194", glyphs = "";
        ["sun", "ankh", "feather", "lotus", "star", "eye"].forEach((n, i) => { const t = .5, xa = 64 + i * 45.33 + (46 + i * 50.67 - 64 - i * 45.33) * t, xb = 64 + (i + 1) * 45.33 + (46 + (i + 1) * 50.67 - 64 - (i + 1) * 45.33) * t; glyphs += g2Glyph(n, (xa + xb) / 2, 160, .5); }); for (let i = 0; i < 6; i++) hem += " q25.3 26 50.67 0";
        let stripes = ""; for (let i = 1; i < 6; i++) stripes += `M${(64 + i * 45.33).toFixed(1)} 120 L${(46 + i * 50.67).toFixed(1)} 194 `;
        let band = "M50 338"; for (let i = 0; i < 20; i++) band += ` L${(50 + (i + .5) * 15).toFixed(1)} 358 L${(50 + (i + 1) * 15).toFixed(1)} 338`;
        return [
          S.sun(62, 62, 22), S.cloud(196, 62, .8), S.bird(130, 96), S.bird(154, 108),
          P("pyramids", 258, 52, 112),
          S.hill("M-20 392 Q110 378 240 390 T420 382"),
          S.shape(`<rect x="62" y="120" width="12" height="226"/><rect x="326" y="120" width="12" height="226"/>`),
          P("owl", 138, 206, 124),
          S.shape(`<path d="${hem} L336 120 H64 Z"/>`), S.shape(`<path d="${stripes}" fill="none"/>`), glyphs,
                    // goods on the counter: a basket of figs, a jar, a bowl of grapes, loaves of bread
          g2Basket(90, 312, 66, 36, [[-18, 4, 11], [0, 0, 11], [18, 4, 11], [-8, -8, 11], [10, -8, 11]]),
          g2Jar(142, 312, 42, 66),
          g2Basket(268, 312, 52, 26, [[-12, 4, 8], [0, 0, 8], [12, 4, 8]]), g2Grapes(268, 262, .8),
          g2Loaf(314, 300, .62), g2Loaf(330, 281, .55),
          // the counter, with a zigzag band
          S.shape(`<rect x="46" y="312" width="308" height="72"/>`), S.shape(`<path d="${band} M50 358 H350" fill="none"/>`),
          // big jars and baskets on the ground in front
          g2Jar(54, 440, 46, 74), g2Jar(348, 440, 42, 66),
          g2Basket(128, 440, 60, 32, [[-14, 2, 10], [4, 0, 10], [20, 3, 10]]), g2Basket(272, 440, 60, 32, [[-14, 2, 10], [4, 0, 10], [20, 3, 10]]),
          g2Pot(200, 440, 62, 54)
        ].join("");
      }
    }
  ],
  activities: {
    pages: ["maze", "wordSearch", "g2Coins", "g2Stones"],
    maze: { cols: 12, rows: 14, seed: 27, cs: 46, ox: 84, oy: 40, wall: 5, startW: 72, endW: 70, icon: 2.2, answerWidth: 390,
      title: "Help Dr. Somebody find the way through the pyramid!", instruction: "Start at the owl. Find the way through the pyramid to the balloon." },
    wordSearch: { seed: 17, size: 10, dirs: [[1, 0], [0, 1]], banned: BANNED_WORDS, cell: 62, answerCell: 30,
      title: "Egypt Word Search", instruction: "Find the nine words. They go across or down. Circle each one.",
      words: ["PYRAMID", "PHARAOH", "PAPYRUS", "SPHINX", "TEMPLE", "SCRIBE", "CAMEL", "BOAT", "NILE"] },   // each one is a word in grade2-egypt.html (nouns, scrolls, the tour)
    g2Coins: { title: "Market Coins" },
    g2Stones: { title: "Stone Rows" }
  }
};

// ---------- activity: Market Coins ----------
// The Canadian coins as the game draws them (the dime is the smallest, then the nickel, quarter, loonie and toonie). Amounts are in cents.
const G2_COINS = { 5: { d: 44, t: "5¢" }, 10: { d: 38, t: "10¢" }, 25: { d: 52, t: "25¢" }, 100: { d: 58, t: "$1" }, 200: { d: 62, t: "$2" } };
const g2Money = c => c < 100 ? c + "¢" : "$" + (c / 100).toFixed(c % 100 ? 2 : 0);
const g2CoinSvg = (c, x, y) => {
  const k = G2_COINS[c], r = k.d / 2;
  return `<circle cx="${x}" cy="${y}" r="${r}" fill="#fff" stroke="#000" stroke-width="4"/>` + (c === 200 ? `<circle cx="${x}" cy="${y}" r="${r * .66}" fill="#fff" stroke="#000" stroke-width="3"/>` : `<circle cx="${x}" cy="${y}" r="${r - 6}" fill="none" stroke="#000" stroke-width="1.6" stroke-dasharray="1 4" stroke-linecap="round"/>`)
    + `<text x="${x}" y="${y + (c === 10 ? 6 : 7)}" font-size="${c === 200 ? 22 : c >= 100 ? 24 : c === 10 ? 14 : 18}" font-weight="bold" text-anchor="middle" fill="#000">${k.t}</text>`;
};
const G2_COIN_QUESTIONS = [[10, 10, 5, 5], [25, 25, 10, 5], [25, 10, 10, 10, 5], [100, 25, 25, 10], [200, 100, 25, 10]];   // the first two are the coins Dr. Somebody counts in the game's lesson
function g2CoinsSvg(answers) {
  const names = [[5, "nickel"], [10, "dime"], [25, "quarter"], [100, "loonie"], [200, "toonie"]], rowH = 110, top = 124;
  let s = `<svg viewBox="0 0 720 ${top + 6 * rowH}" width="720" height="${top + 6 * rowH}">`;
  names.forEach(([c, n], i) => {
    const x = 70 + i * 145;
    s += g2CoinSvg(c, x, 36) + `<text x="${x}" y="88" font-size="19" font-weight="bold" text-anchor="middle" fill="#000">${n}</text><text x="${x}" y="107" font-size="16" text-anchor="middle" fill="#000">${g2Money(c)}</text>`;
  });
  s += `<line x1="10" y1="${top - 4}" x2="710" y2="${top - 4}" stroke="#000" stroke-width="3"/>`;
  const box = (cy, text) => `<text x="590" y="${cy + 12}" font-size="34" font-weight="bold" text-anchor="middle" fill="#000">=</text><rect x="618" y="${cy - 32}" width="92" height="64" rx="12" fill="#fff" stroke="#000" stroke-width="4"/>${answers ? `<text x="664" y="${cy + 10}" font-size="30" font-weight="bold" text-anchor="middle" fill="#000">${text}</text>` : ""}`;
  G2_COIN_QUESTIONS.forEach((list, i) => {
    const cy = top + i * rowH + rowH / 2 + 2, total = list.reduce((a, b) => a + b, 0);
    s += `<text x="12" y="${cy + 10}" font-size="30" font-weight="bold" fill="#000">${i + 1}.</text>`;
    list.forEach((c, j) => { s += g2CoinSvg(c, 90 + j * 80, cy); });
    s += box(cy, g2Money(total));
    s += `<line x1="10" y1="${top + (i + 1) * rowH}" x2="710" y2="${top + (i + 1) * rowH}" stroke="#000" stroke-width="2" stroke-dasharray="3 9" stroke-linecap="round"/>`;
  });
  // the last question is a change story: a fig costs 65 cents and the child pays with a loonie (the same sum as the game's lesson)
  const cy = top + 5 * rowH + rowH / 2 + 2;
  s += `<text x="12" y="${cy + 10}" font-size="30" font-weight="bold" fill="#000">6.</text>`
    + `<text x="56" y="${cy - 16}" font-size="22" fill="#000">A fig costs 65¢.</text><text x="56" y="${cy + 10}" font-size="22" fill="#000">You pay with a loonie.</text><text x="56" y="${cy + 36}" font-size="22" font-weight="bold" fill="#000">How much change?</text>`
    + g2CoinSvg(100, 400, cy) + box(cy, "35¢");
  return s + `</svg>`;
}
ACTIVITY_BUILDERS.g2Coins = function (G, A) {
  const answers = G2_COIN_QUESTIONS.map(l => g2Money(l.reduce((a, b) => a + b, 0))).concat("35¢");
  return {
    body: `<h2 class="pt">${A.title}</h2><p class="pi">Count the coins. Write how much money in each box.</p><div class="puz">${g2CoinsSvg(false)}</div>`,
    answer: { label: A.title, html: `<div style="text-align:left;font-weight:normal;font-size:14px;line-height:1.55;columns:2;column-gap:22px">${answers.map((a, i) => `<div>${i + 1}. <b>${a}</b></div>`).join("")}</div>` }
  };
};

// ---------- activity: Stone Rows ----------
// The pyramids were built from rows and rows of stones, and the game teaches counting them by rows (3 rows of 4). Each problem shows the stones,
// says it in words, and gives the adding sentence for the child to finish.
const G2_ROWS = [[3, 4], [2, 5], [4, 5], [3, 10], [5, 3]];   // [rows, stones in each row]
function g2StonesSvg(answers) {
  const rowH = 156, sw = 32, sh = 22, gap = 4;
  let s = `<svg viewBox="0 0 720 ${G2_ROWS.length * rowH}" width="720" height="${G2_ROWS.length * rowH}">`;
  G2_ROWS.forEach(([r, c], i) => {
    const cy = i * rowH + rowH / 2, gh = r * (sh + gap) - gap, y0 = cy - gh / 2;
    s += `<text x="10" y="${cy + 10}" font-size="30" font-weight="bold" fill="#000">${i + 1}.</text>`;
    for (let a = 0; a < r; a++) for (let b = 0; b < c; b++) s += `<rect x="${52 + b * (sw + gap)}" y="${y0 + a * (sh + gap)}" width="${sw}" height="${sh}" rx="5" fill="#fff" stroke="#000" stroke-width="3.5"/>`;
    s += `<text x="598" y="${cy - 14}" font-size="28" font-weight="bold" text-anchor="end" fill="#000">${r} rows of ${c}</text>`;
    s += `<text x="598" y="${cy + 28}" font-size="26" text-anchor="end" fill="#000">${Array(r).fill(c).join(" + ")}</text>`;
    s += `<text x="626" y="${cy + 28}" font-size="30" font-weight="bold" text-anchor="middle" fill="#000">=</text><rect x="644" y="${cy + 2}" width="66" height="50" rx="10" fill="#fff" stroke="#000" stroke-width="4"/>`;
    if (answers) s += `<text x="677" y="${cy + 38}" font-size="30" font-weight="bold" text-anchor="middle" fill="#000">${r * c}</text>`;
    if (i < G2_ROWS.length - 1) s += `<line x1="10" y1="${(i + 1) * rowH}" x2="710" y2="${(i + 1) * rowH}" stroke="#000" stroke-width="2" stroke-dasharray="3 9" stroke-linecap="round"/>`;
  });
  return s + `</svg>`;
}
ACTIVITY_BUILDERS.g2Stones = function (G, A) {
  return {
    body: `<h2 class="pt">${A.title}</h2><p class="pi">Pyramids were built from rows of stones. How many stones in each?</p><div class="puz">${g2StonesSvg(false)}</div>`,
    answer: { label: A.title, html: `<div style="text-align:left;font-weight:normal;font-size:14px;line-height:1.55;columns:2;column-gap:22px">${G2_ROWS.map(([r, c], i) => `<div>${i + 1}. <b>${r * c}</b></div>`).join("")}</div>` }
  };
};
