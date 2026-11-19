"use strict";
// The drawing tools for the older grades: everything is drawn the way the new Dr. Somebody is.
// (Grade 5's scene pieces live here too: villages, canoes, snow houses. Other grades can reuse them.)
// ---------- pictures ----------
// Everything is drawn the way the new Dr. Somebody is: bold dark outlines, round shapes, and a little shine.
const INKED = `stroke="#2b1a10" stroke-width="2.4" stroke-linejoin="round" stroke-linecap="round"`, THIN = `stroke="#2b1a10" stroke-width="1.6" stroke-linejoin="round" stroke-linecap="round"`;
const frame = inner => `<svg viewBox="0 0 400 240" preserveAspectRatio="xMidYMid slice">${inner}</svg>`; // the panel is the same shape, so this only trims a hair
const cloud = (x, y, s) => `<g transform="translate(${x} ${y}) scale(${s})" ${INKED}><path d="M-30 10 Q-44 10 -40 -2 Q-38 -14 -24 -12 Q-18 -28 0 -24 Q12 -34 24 -20 Q42 -22 42 -4 Q46 10 30 10 Z" fill="#fff"/></g>`;
const sun = (x, y, r) => `<g ${INKED}>${[0, 1, 2, 3, 4, 5, 6, 7].map(i => { const a = i / 8 * 2 * Math.PI; return `<line x1="${(x + (r + 5) * Math.cos(a)).toFixed(1)}" y1="${(y + (r + 5) * Math.sin(a)).toFixed(1)}" x2="${(x + (r + 13) * Math.cos(a)).toFixed(1)}" y2="${(y + (r + 13) * Math.sin(a)).toFixed(1)}" stroke="#e0a800" stroke-width="4"/>`; }).join("")}<circle cx="${x}" cy="${y}" r="${r}" fill="#ffd84d"/></g><circle cx="${x - r * .35}" cy="${y - r * .35}" r="${r * .22}" fill="#fff" opacity=".7"/>`;
const sky = (a, b, sunAt, clouds) => `<rect width="400" height="240" fill="${a}"/><rect y="110" width="400" height="130" fill="${b}" opacity=".55"/>${sunAt ? sun(sunAt[0], sunAt[1], sunAt[2] || 22) : ""}${(clouds || []).map(c => cloud(c[0], c[1], c[2] || 1)).join("")}`;
const hills = (c1, c2) => `<g ${INKED}><path d="M-10 172 Q100 128 210 164 T410 150 V250 H-10 Z" fill="${c1}"/><path d="M-10 204 Q140 170 260 196 T410 190 V250 H-10 Z" fill="${c2}"/></g>`;
const owlAt = (x, y, h) => `<svg x="${x}" y="${y}" width="${h * 200 / 232}" height="${h}" viewBox="0 0 200 232">${NEW_OWL.replace(/^<svg[^>]*>|<\/svg>$/g, "")}</svg>`;
// the guide: a child of today, in a hoodie and jeans
const kidAt = (x, y, s, o) => { o = o || {}; const hood = o.hood || "#e63946"; return `<g transform="translate(${x} ${y}) scale(${s})" stroke="#2b1a10" stroke-width="2.4" stroke-linejoin="round" stroke-linecap="round">
  <rect x="-9" y="52" width="8" height="26" rx="3" fill="#3b5b8c"/><rect x="2" y="52" width="8" height="26" rx="3" fill="#3b5b8c"/><ellipse cx="-6" cy="80" rx="8" ry="4" fill="#fff"/><ellipse cx="7" cy="80" rx="8" ry="4" fill="#fff"/>
  <path d="M-16 24 Q0 16 16 24 L18 56 H-18 Z" fill="${hood}"/><path d="M-16 26 L-25 46" fill="none" stroke-width="7" stroke="#2b1a10"/><path d="M-16 26 L-25 46" fill="none" stroke-width="4" stroke="${hood}"/>
  <path d="M16 26 L27 12" fill="none" stroke-width="7" stroke="#2b1a10"/><path d="M16 26 L27 12" fill="none" stroke-width="4" stroke="${hood}"/><circle cx="28" cy="10" r="4" fill="#b9794a"/>
  ${o.vest ? `<path d="M-13 24 Q0 20 13 24 L14 50 H-14 Z" fill="#ff8a3d"/><path d="M0 22 V50 M-13 36 H13" fill="none" stroke-width="1.6"/>` : `<path d="M-6 40 h12 v8 h-12 z" fill="rgba(0,0,0,.14)" stroke-width="1.4"/>`}
  ${o.parka ? `<circle cx="0" cy="5" r="20" fill="#f3e6cf"/><circle cx="0" cy="5" r="16.5" fill="${hood}" stroke-width="1.6"/>` : ""}<circle cx="0" cy="6" r="15" fill="#b9794a"/><path d="M-15 4 Q-14 -12 0 -12 Q14 -12 15 4 Q8 -4 0 -4 Q-8 -4 -15 4 Z" fill="#2b1a10"/>${o.short ? "" : `<path d="M-15 4 Q-20 20 -14 30" fill="none" stroke-width="5"/><path d="M15 4 Q20 20 14 30" fill="none" stroke-width="5"/>`}
  <circle cx="-5" cy="8" r="2" fill="#2b1a10" stroke="none"/><circle cx="5" cy="8" r="2" fill="#2b1a10" stroke="none"/><circle cx="-4.3" cy="7.3" r=".7" fill="#fff" stroke="none"/><circle cx="5.7" cy="7.3" r=".7" fill="#fff" stroke="none"/><path d="M-5 14 Q0 18 5 14" fill="none" stroke-width="1.8"/>
  <circle cx="-9" cy="12" r="2.4" fill="#e58b6b" stroke="none" opacity=".6"/><circle cx="9" cy="12" r="2.4" fill="#e58b6b" stroke="none" opacity=".6"/></g>`; };
const NOAH = { hood: "#3b82c4", short: true, vest: true }; // Chapter 2's guide: short hair, a blue hoodie and a life jacket
// the clock balloon, redrawn with outlines (the basket is empty: he has climbed out)
const balloonAt = (x, y, h) => `<svg x="${x}" y="${y}" width="${h * .8}" height="${h}" viewBox="0 0 160 200"><g stroke="#2b1a10" stroke-width="4" stroke-linejoin="round" stroke-linecap="round">
  <line x1="52" y1="118" x2="62" y2="160"/><line x1="108" y1="118" x2="98" y2="160"/>
  <path d="M80 6 C26 6 12 52 22 86 C30 110 56 124 60 132 H100 C104 124 130 110 138 86 C148 52 134 6 80 6 Z" fill="#e63946"/>
  <path d="M80 6 C58 20 52 90 66 132 H94 C108 90 102 20 80 6 Z" fill="#ffd84d"/>
  <circle cx="80" cy="66" r="30" fill="#fff"/><line x1="80" y1="66" x2="80" y2="46"/><line x1="80" y1="66" x2="94" y2="74" stroke="#e63946"/><circle cx="80" cy="66" r="3" fill="#2b1a10"/>
  <path d="M56 160 H104 L100 192 H60 Z" fill="#c48a4a"/><path d="M54 158 H106 V168 H54 Z" fill="#9c6830"/></g>
  <ellipse cx="50" cy="40" rx="8" ry="14" fill="#fff" opacity=".45" transform="rotate(24 50 40)"/></svg>`;
const tree = (x, y, s, c) => `<g transform="translate(${x} ${y}) scale(${s})" ${INKED}><rect x="-3.5" y="-2" width="7" height="18" rx="2" fill="#8a5a2b"/><path d="M0 -34 Q16 -34 15 -18 Q24 -8 12 0 Q0 6 -12 0 Q-24 -8 -15 -18 Q-16 -34 0 -34 Z" fill="${c || "#4aa862"}"/></g><ellipse cx="${x - 5 * s}" cy="${y - 22 * s}" rx="${4 * s}" ry="${6 * s}" fill="#fff" opacity=".28"/>`;
const house = (x, y, w, h, roof) => `<g ${INKED}><rect x="${x}" y="${y}" width="${w}" height="${h}" fill="#fbf1dc"/><polygon points="${x - 6},${y} ${x + w / 2},${y - h * .55} ${x + w + 6},${y}" fill="${roof}"/><rect x="${x + w * .42}" y="${y + h * .45}" width="${w * .18}" height="${h * .55}" rx="2" fill="#8a5a2b"/>
  <rect x="${x + w * .1}" y="${y + h * .22}" width="${w * .2}" height="${h * .28}" fill="#bfe6f7"/><rect x="${x + w * .7}" y="${y + h * .22}" width="${w * .2}" height="${h * .28}" fill="#bfe6f7"/></g>`;
// a longhouse: a long bark-covered house with a rounded roof and smoke holes
const longhouse = (x, y, w, h) => `<g ${INKED}><path d="M${x} ${y + h} V${y + h * .45} Q${x + w / 2} ${y - h * .4} ${x + w} ${y + h * .45} V${y + h} Z" fill="#c89a5e"/>
  <path d="M${x} ${y + h * .45} Q${x + w / 2} ${y - h * .4} ${x + w} ${y + h * .45}" fill="none" stroke="#8a5a2b" stroke-width="5"/>
  <rect x="${x + 5}" y="${y + h * .6}" width="${Math.max(7, w * .08)}" height="${h * .4}" rx="3" fill="#4a3518"/></g>
  <g stroke="#7a5326" stroke-width="1.1" opacity=".7">${Array.from({ length: Math.floor(w / 16) }, (_, i) => `<line x1="${x + 20 + i * 16}" y1="${y + h * .34}" x2="${x + 20 + i * 16}" y2="${y + h - 2}"/>`).join("")}<line x1="${x + 2}" y1="${y + h * .7}" x2="${x + w - 2}" y2="${y + h * .7}"/></g>
  ${[.32, .68].map(k => `<path d="M${x + w * k} ${y - h * .1} q-7 -7 0 -13 q7 -6 0 -13 q-6 -6 1 -11" fill="none" stroke="#fff" stroke-width="4.5" stroke-linecap="round" opacity=".8"/>`).join("")}`; // a curl of smoke from each smoke hole
const corn = (x, y, s) => `<g transform="translate(${x} ${y}) scale(${s})" ${THIN}><path d="M-2 0 Q-3 -24 0 -48 Q3 -24 2 0 Z" fill="#58b368"/><path d="M0 -14 Q-16 -18 -20 -34 Q-6 -30 0 -20 Z" fill="#4aa862"/><path d="M0 -24 Q16 -28 20 -44 Q6 -40 0 -30 Z" fill="#58b368"/><path d="M0 -36 Q-10 -38 -13 -50 Q-3 -47 0 -40 Z" fill="#4aa862"/>
  <path d="M3 -18 Q10 -28 6 -38 Q0 -30 3 -18 Z" fill="#ffd23f"/><path d="M-1 -6 Q8 -14 5 -22" fill="none" stroke="#8a5a2b"/><circle cx="6" cy="-13" r="2.6" fill="#a8452a"/><circle cx="-4" cy="-28" r="2.4" fill="#a8452a"/></g>`;
const squash = (x, y, s) => `<g transform="translate(${x} ${y}) scale(${s})" ${THIN}><path d="M-26 2 Q-22 -10 -8 -4 Q-10 6 -26 2 Z" fill="#4aa862"/><path d="M26 3 Q22 -9 8 -3 Q10 7 26 3 Z" fill="#58b368"/><ellipse cx="0" cy="-3" rx="10" ry="8" fill="#f79a2e"/><path d="M0 -11 v-4" stroke-width="2.4" stroke="#4c7a2e"/></g>`;
const mound = (x, y, s) => `<ellipse cx="${x}" cy="${y}" rx="${24 * s}" ry="${8 * s}" fill="#9a6b3c" ${THIN}/>${squash(x, y - 2 * s, s * .8)}${corn(x, y - 4 * s, s)}`;
// the window into the past: a round brass clock rim around a scene from long ago
const windowAt = (cx, cy, r, inner) => `<clipPath id="w${cx}"><circle cx="${cx}" cy="${cy}" r="${r}"/></clipPath><g clip-path="url(#w${cx})">${inner}</g>
  <circle cx="${cx}" cy="${cy}" r="${r + 4}" fill="none" stroke="#2b1a10" stroke-width="14"/><circle cx="${cx}" cy="${cy}" r="${r + 4}" fill="none" stroke="#f4b942" stroke-width="9"/><circle cx="${cx}" cy="${cy}" r="${r + 1}" fill="none" stroke="#c98a1b" stroke-width="2.4"/>
  ${[0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11].map(i => { const a = i / 12 * 2 * Math.PI; return `<circle cx="${(cx + (r + 4) * Math.sin(a)).toFixed(1)}" cy="${(cy - (r + 4) * Math.cos(a)).toFixed(1)}" r="2.4" fill="#7a4a24" stroke="#2b1a10" stroke-width="1"/>`; }).join("")}
  <path d="M${cx - r * .62} ${cy - r * .5} Q${cx - r * .2} ${cy - r * .86} ${cx + r * .2} ${cy - r * .8}" fill="none" stroke="#fff" stroke-width="5" stroke-linecap="round" opacity=".5"/>`;
const village = `<rect width="400" height="240" fill="#f6e3b4"/><g ${INKED}><path d="M-10 150 Q200 108 410 150 V250 H-10 Z" fill="#a9cf86"/></g>${tree(58, 100, 1.6, "#3f9a58")}${tree(92, 108, 1.2)}${tree(322, 102, 1.6, "#3f9a58")}${tree(350, 112, 1.1)}
  ${longhouse(120, 92, 150, 46)}${longhouse(96, 138, 120, 38)}${longhouse(234, 142, 98, 34)}${mound(96, 208, .7)}${mound(150, 214, .7)}${mound(206, 210, .7)}${mound(262, 216, .7)}${mound(316, 208, .7)}`;
const fire = x => `<g ${THIN}><ellipse cx="${x}" cy="222" rx="26" ry="8" fill="#6b4a25"/><path d="M${x - 12} 221 Q${x - 14} 198 ${x - 2} 184 Q${x + 2} 196 ${x + 8} 190 Q${x + 18} 206 ${x + 12} 221 Z" fill="#ff8a3d"/><path d="M${x - 5} 221 Q${x - 6} 208 ${x + 1} 200 Q${x + 8} 210 ${x + 5} 221 Z" fill="#ffd84d"/>
  <path d="M${x - 20} 224 l14 -5 M${x + 20} 224 l-14 -5" stroke-width="4" stroke="#4a3518"/></g><path d="M${x} 176 q8 -14 -2 -26 q12 6 8 26" fill="#fff" opacity=".3"/>`;

// ---- the Great Lakes: water, rock, pines, canoes ----
const water = (y, c) => `<g ${INKED}><path d="M-10 ${y} Q60 ${y - 6} 130 ${y} T270 ${y} T410 ${y} V250 H-10 Z" fill="${c || "#5db7e6"}"/></g>
  <g fill="none" stroke="#fff" stroke-width="2.2" stroke-linecap="round" opacity=".7">${[[40, 16], [150, 30], [250, 14], [330, 34], [90, 48], [300, 56]].map(([x, d]) => `<path d="M${x} ${y + d} q8 -5 16 0 t16 0"/>`).join("")}</g>`;
const pine = (x, y, s, c) => `<g transform="translate(${x} ${y}) scale(${s})" ${INKED}><rect x="-3" y="-4" width="6" height="16" rx="2" fill="#8a5a2b"/><path d="M0 -58 L13 -36 H7 L17 -18 H9 L20 0 H-20 L-9 -18 H-17 L-7 -36 H-13 Z" fill="${c || "#2f8a57"}"/></g>`;
const rock = (x, y, w, h) => `<g ${INKED}><path d="M${x} ${y} Q${x + w * .1} ${y - h} ${x + w * .45} ${y - h * .9} Q${x + w * .8} ${y - h * 1.1} ${x + w} ${y} Z" fill="#c9b8a6"/></g><path d="M${x + w * .2} ${y - h * .6} q${w * .14} ${-h * .22} ${w * .3} ${-h * .12}" fill="none" stroke="#fff" stroke-width="2.4" stroke-linecap="round" opacity=".6"/>`;
// someone paddling, seen from the side (long ago, or today in a life jacket)
const paddler = (x, y, s, o) => { o = o || {}; return `<g transform="translate(${x} ${y}) scale(${s})" ${THIN}><path d="M-7 0 Q-8 -16 0 -18 Q8 -16 7 0 Z" fill="${o.top || "#c98f58"}"/><circle cx="0" cy="-25" r="7.5" fill="#b9794a"/><path d="M-7.5 -26 Q-7 -34 0 -34 Q7 -34 7.5 -26 Q3 -30 0 -30 Q-4 -30 -7.5 -26 Z" fill="#2b1a10"/>
  <path d="M4 -13 L16 -6" fill="none" stroke-width="4.4" stroke="#2b1a10"/><path d="M4 -13 L16 -6" fill="none" stroke="${o.top || "#c98f58"}" stroke-width="2.4"/><path d="M12 -28 L19 12" fill="none" stroke-width="2.6" stroke="#8a5a2b"/><path d="M17 6 q7 6 3 16 q-7 -2 -6 -14 z" fill="#b07a45"/></g>`; };
// a birchbark canoe from the side. o.who: how many paddlers; o.packs: bundles of goods; o.today: life jackets
const canoe = (x, y, s, o) => { o = o || {}; const who = o.who === undefined ? 2 : o.who, seats = who === 0 ? [] : who === 1 ? [0] : who === 2 ? [-22, 18] : [-28, -4, 22];
  return `<g transform="translate(${x} ${y}) scale(${s})">${(o.packs ? [[-6, "#b03a2e"], [8, "#8a6238"]].slice(0, o.packs) : []).map(([px, c]) => `<rect x="${px - 6}" y="-12" width="12" height="11" rx="3" fill="${c}" ${THIN}/>`).join("")}
    ${seats.map(sx => paddler(sx, -1, 1, o.today ? { top: "#ff8a3d" } : {})).join("")}
    <g ${INKED}><path d="M-52 -4 Q-60 -18 -50 -20 Q-44 -6 0 -4 Q44 -6 50 -20 Q60 -18 52 -4 Q40 12 0 12 Q-40 12 -52 -4 Z" fill="${o.today ? "#e63946" : "#ecd3a3"}"/><path d="M-50 -4 Q0 2 50 -4" fill="none" stroke-width="3" stroke="${o.today ? "#2b1a10" : "#8a5a2b"}"/></g>
    ${o.today ? "" : `<g stroke="#8a5a2b" stroke-width="1.2" stroke-linecap="round">${[-38, -24, -10, 4, 18, 32].map(k => `<path d="M${k} 1 l2 6"/>`).join("")}<path d="M-50 -14 l5 3 M-49 -9 l5 3 M50 -14 l-5 3 M49 -9 l-5 3"/></g>`}</g>`; };
const riceStalk = (x, y, s) => `<g transform="translate(${x} ${y}) scale(${s})" fill="none" stroke-linecap="round"><path d="M0 0 Q-2 -22 3 -44" stroke="#2b1a10" stroke-width="3.6"/><path d="M0 0 Q-2 -22 3 -44" stroke="#7fae62" stroke-width="2"/><path d="M3 -44 q4 -8 9 -10 M3 -40 q-5 -7 -9 -8 M2 -34 q5 -5 9 -5" stroke="#2b1a10" stroke-width="3.2"/><path d="M3 -44 q4 -8 9 -10 M3 -40 q-5 -7 -9 -8 M2 -34 q5 -5 9 -5" stroke="#e9c46a" stroke-width="1.8"/></g>`;
const lakeLongAgo = `<rect width="400" height="240" fill="#f6e3b4"/>${rock(130, 96, 96, 30)}${pine(162, 74, .8)}${pine(190, 78, .65, "#3f9a58")}${rock(262, 92, 90, 26)}${pine(296, 72, .8, "#3f9a58")}${pine(318, 76, .6)}
  ${water(92, "#6cc0ea")}${canoe(206, 126, .62, { who: 2, packs: 2 })}${canoe(274, 156, .78, { who: 3, packs: 1 })}${canoe(214, 186, .7, { who: 2, packs: 2 })}`;
const riceLongAgo = `<rect width="400" height="240" fill="#f6e3b4"/>${rock(250, 92, 100, 26)}${pine(290, 72, .8, "#3f9a58")}${pine(314, 76, .65)}${water(90, "#6cc0ea")}
  ${[158, 182, 286, 306, 324].map((x, i) => riceStalk(x, 138 + (i % 2) * 8, .9)).join("")}${canoe(236, 158, .95, { who: 2 })}
  ${[150, 172, 196, 222, 262, 288, 312, 332].map((x, i) => riceStalk(x, 204 + (i % 2) * 6, 1.05)).join("")}`;
// the rocky shore they stand on while they look through the window
const shore = `<g ${INKED}><path d="M-10 214 Q90 196 190 218 T410 222 V250 H-10 Z" fill="#c9b8a6"/></g>`;

// ---- the north: geese, camps, snow ----
const MAYA = { hood: "#8e5bd0" }; // Chapter 3's guide: long hair and a purple hoodie
const geese = (x, y, s, n) => `<g transform="translate(${x} ${y}) scale(${s})" fill="none" stroke="#2b1a10" stroke-width="2.6" stroke-linecap="round" stroke-linejoin="round">${Array.from({ length: n || 7 }, (_, i) => { const k = Math.ceil(i / 2), side = i % 2 ? 1 : -1, gx = i ? side * k * 15 : 0, gy = k * 11; return `<path d="M${gx - 7} ${gy + 3} q4 -7 7 -1 q3 -6 7 1"/>`; }).join("")}</g>`;
const person = (x, y, s, top) => `<g transform="translate(${x} ${y}) scale(${s})" ${THIN}><rect x="-6" y="26" width="5" height="20" rx="2" fill="#7a5a2e"/><rect x="2" y="26" width="5" height="20" rx="2" fill="#7a5a2e"/><path d="M-9 28 Q-10 4 0 0 Q10 4 9 28 Z" fill="${top || "#c98f58"}"/><circle cx="0" cy="-8" r="8" fill="#b9794a"/><path d="M-8 -9 Q-8 -18 0 -18 Q8 -18 8 -9 Q3 -14 0 -14 Q-4 -14 -8 -9 Z" fill="#2b1a10"/></g>`;
const tent = (x, y, s, c) => `<g transform="translate(${x} ${y}) scale(${s})" ${INKED}><path d="M-6 -50 L4 -34 M6 -50 L-4 -34 M0 -52 V-34" fill="none" stroke-width="2.2" stroke="#8a5a2b"/><path d="M0 -40 L28 0 H-28 Z" fill="${c || "#f1ddb5"}"/><path d="M0 -14 L8 0 H-8 Z" fill="#4a3518"/></g>`;
const ice = (x, y, w) => `<path d="M${x} ${y} l${w * .3} -5 l${w * .5} 2 l${w * .2} 5 l-${w * .4} 4 Z" fill="#fff" ${THIN}/>`;
const snowPine = (x, y, s) => `${pine(x, y, s, "#3f8a6a")}<g transform="translate(${x} ${y}) scale(${s})"><path d="M0 -58 L8 -44 Q0 -40 -8 -44 Z M-12 -30 Q-2 -26 6 -32 L9 -24 Q0 -18 -14 -24 Z M-15 -10 Q-2 -6 8 -13 L12 -6 Q0 0 -17 -5 Z" fill="#fff" stroke="#2b1a10" stroke-width="1.4" stroke-linejoin="round"/></g>`;
const toboggan = (x, y, s) => `<g transform="translate(${x} ${y}) scale(${s})" ${THIN}><path d="M-30 4 H22 Q34 4 34 -8 Q32 -14 26 -10" fill="none" stroke-width="5" stroke="#2b1a10"/><path d="M-30 4 H22 Q34 4 34 -8 Q32 -14 26 -10" fill="none" stroke="#c89a5e" stroke-width="2.6"/><rect x="-24" y="-10" width="16" height="12" rx="3" fill="#b03a2e"/><rect x="-6" y="-12" width="18" height="14" rx="3" fill="#8a6238"/></g>`;
const snowWalker = (x, y, s) => `${person(x, y, s, "#d9c7a0")}<g transform="translate(${x} ${y}) scale(${s})" ${THIN}><ellipse cx="-4" cy="47" rx="11" ry="3.4" fill="#e8c58a"/><ellipse cx="6" cy="48" rx="11" ry="3.4" fill="#e8c58a"/><path d="M-8 22 L-34 34" fill="none" stroke="#8a5a2b"/></g>${toboggan(x - 52 * s, y + 40 * s, s)}`;
const springLongAgo = `<rect width="400" height="240" fill="#dff1f7"/>${geese(190, 34, .8, 9)}${geese(288, 52, .55, 7)}<g ${INKED}><path d="M130 130 Q236 110 342 130 V250 H130 Z" fill="#b9cf8e"/></g>${pine(160, 122, .7)}${pine(182, 126, .55, "#3f9a58")}${pine(312, 120, .7, "#3f9a58")}
  <g ${INKED}><path d="M130 176 Q236 160 342 178 V250 H130 Z" fill="#6cc0ea"/></g>${ice(160, 190, 34)}${ice(226, 200, 40)}${ice(284, 188, 30)}${ice(196, 176, 22)}
  ${tent(218, 158, .7)}${tent(266, 160, .6, "#e8c58a")}${person(240, 136, .45)}${person(298, 140, .42, "#b98b54")}`;
const winterLongAgo = `<rect width="400" height="240" fill="#cfe0f2"/><g ${INKED}><path d="M130 120 Q236 96 342 120 V250 H130 Z" fill="#fff"/><path d="M130 170 Q236 150 342 172 V250 H130 Z" fill="#eef4fb"/></g>
  ${snowPine(164, 116, .8)}${snowPine(196, 122, .6)}${snowPine(316, 114, .8)}${tent(292, 150, .6)}<path d="M286 110 q-6 -8 0 -14 q6 -6 0 -12" fill="none" stroke="#fff" stroke-width="4" stroke-linecap="round" opacity=".9"/>
  <g fill="#b9c8dc">${[178, 196, 214, 232].map((x, i) => `<ellipse cx="${x}" cy="${196 + i * 2}" rx="6" ry="2.2"/>`).join("")}</g>${snowWalker(272, 150, .8)}`;
const summerLongAgo = `<rect width="400" height="240" fill="#fdebd0"/>${sun(236, 60, 20)}<g ${INKED}><path d="M130 124 Q236 104 342 124 V250 H130 Z" fill="#a9cf86"/></g>${pine(158, 116, .7)}${pine(316, 114, .7, "#3f9a58")}
  <g ${INKED}><path d="M130 180 Q236 164 342 182 V250 H130 Z" fill="#6cc0ea"/></g>${tent(190, 160, .65)}${tent(230, 156, .7, "#e8c58a")}${tent(272, 160, .6)}
  <g ${THIN}><path d="M286 168 V140 M318 168 V140 M282 142 H322" fill="none" stroke="#8a5a2b" stroke-width="2.6"/>${[292, 302, 312].map(x => `<path d="M${x} 143 q-4 8 0 14 q4 -6 0 -14 Z" fill="#f79a2e"/>`).join("")}</g>
  ${person(206, 138, .42)}${person(250, 140, .4, "#b98b54")}${person(300, 150, .38)}${canoe(214, 204, .55, { who: 2 })}`;
// the Cree year: six seasons, drawn as a wheel
const seasonWheel = () => { const names = [["winter", "#dfeaf7"], ["break-up", "#bfe6f7"], ["spring", "#bfe8a6"], ["summer", "#ffe08a"], ["fall", "#f7b872"], ["freeze-up", "#cfd8e8"]], cx = 200, cy = 122, r = 100;
  const pt = (a, k) => `${(cx + k * Math.sin(a)).toFixed(1)},${(cy - k * Math.cos(a)).toFixed(1)}`;
  return `<rect width="400" height="240" fill="#f6e3b4"/>${names.map(([n, c], i) => { const a0 = i / 6 * 2 * Math.PI, a1 = (i + 1) / 6 * 2 * Math.PI, am = (a0 + a1) / 2, [tx, ty] = pt(am, r * .62).split(",");
    return `<path d="M${cx},${cy} L${pt(a0, r)} A${r},${r} 0 0 1 ${pt(a1, r)} Z" fill="${c}" ${INKED}/><text x="${tx}" y="${+ty + 4}" font-size="12.5" font-weight="bold" text-anchor="middle" fill="#2b1a10">${n}</text>`; }).join("")}<circle cx="${cx}" cy="${cy}" r="12" fill="#f4b942" ${INKED}/>`; };

// ---- the Arctic: snow, snow houses, dog teams, stone markers, the night sky ----
const NINA = { hood: "#2aa7a0", parka: true, short: true }; // Chapter 4's guide: a teal parka with a fur-trimmed hood
const snow = (y, c1, c2) => `<g ${INKED}><path d="M-10 ${y} Q110 ${y - 22} 220 ${y - 4} T410 ${y - 8} V250 H-10 Z" fill="${c1 || "#fff"}"/><path d="M-10 ${y + 44} Q140 ${y + 22} 270 ${y + 40} T410 ${y + 34} V250 H-10 Z" fill="${c2 || "#e6f0fa"}"/></g>`;
const iglu = (x, y, s) => `<g transform="translate(${x} ${y}) scale(${s})"><g ${INKED}><path d="M30 0 Q30 -16 44 -16 Q56 -16 56 0 Z" fill="#fff"/><path d="M-36 0 Q-36 -44 0 -44 Q36 -44 36 0 Z" fill="#fff"/><path d="M36 0 Q36 -12 44 -12 Q50 -12 50 0 Z" fill="#4a5a70"/></g>
  <g fill="none" stroke="#9fb6d0" stroke-width="1.5" stroke-linecap="round"><path d="M-34 -12 Q0 -18 34 -12 M-29 -24 Q0 -30 29 -24 M-20 -35 Q0 -39 20 -35"/><path d="M-18 -1 V-13 M0 -1 V-15 M18 -1 V-13 M-10 -15 V-26 M10 -15 V-26 M-2 -28 V-37"/></g></g>`;
const dog = (x, y, s, c) => `<g transform="translate(${x} ${y}) scale(${s})" ${THIN}><path d="M-14 -8 Q-22 -18 -17 -24" fill="none" stroke-width="4.4" stroke="#2b1a10"/><path d="M-14 -8 Q-22 -18 -17 -24" fill="none" stroke="${c || "#d9dde6"}" stroke-width="2.4"/>
  <rect x="-12" y="-2" width="4" height="12" rx="2" fill="${c || "#d9dde6"}"/><rect x="8" y="-2" width="4" height="12" rx="2" fill="${c || "#d9dde6"}"/><ellipse cx="0" cy="-6" rx="15" ry="8" fill="${c || "#d9dde6"}"/>
  <path d="M10 -12 L13 -24 L18 -15 L23 -23 L24 -12 Q30 -9 28 -4 Q20 0 12 -4 Z" fill="${c || "#d9dde6"}"/><circle cx="20" cy="-11" r="1.4" fill="#2b1a10" stroke="none"/><circle cx="28" cy="-6" r="1.6" fill="#2b1a10" stroke="none"/></g>`;
const qamutiik = (x, y, s) => `<g transform="translate(${x} ${y}) scale(${s})" ${THIN}><rect x="-26" y="-18" width="18" height="13" rx="3" fill="#b03a2e"/><rect x="-6" y="-20" width="22" height="15" rx="3" fill="#8a6238"/><path d="M-34 -4 H30 M-28 -4 V2 M-10 -4 V2 M10 -4 V2 M26 -4 V2" fill="none" stroke="#8a5a2b" stroke-width="2.4"/>
  <path d="M-36 4 H28 Q36 4 38 -4" fill="none" stroke-width="5" stroke="#2b1a10"/><path d="M-36 4 H28 Q36 4 38 -4" fill="none" stroke="#c89a5e" stroke-width="2.6"/></g>`;
const inuksuk = (x, y, s) => `<g transform="translate(${x} ${y}) scale(${s})" ${INKED}><rect x="-13" y="-16" width="9" height="16" rx="2" fill="#aab2bd"/><rect x="4" y="-16" width="9" height="16" rx="2" fill="#9aa3af"/><rect x="-22" y="-24" width="44" height="9" rx="3" fill="#b9c0ca"/><rect x="-9" y="-36" width="18" height="12" rx="3" fill="#a3abb6"/><rect x="-6" y="-45" width="12" height="9" rx="3" fill="#b9c0ca"/></g>`;
const aurora = `<g fill="none" stroke-linecap="round" opacity=".75"><path d="M-10 70 Q80 20 170 60 T330 40 T410 56" stroke="#58e0a0" stroke-width="16"/><path d="M-10 92 Q90 50 190 84 T410 74" stroke="#4fd0c8" stroke-width="9"/><path d="M-10 52 Q120 8 220 40 T410 24" stroke="#9be7a8" stroke-width="6"/></g>`;
const starry = pts => pts.map(([x, y, r]) => `<circle cx="${x}" cy="${y}" r="${r || 1.6}" fill="#fff"/>`).join("");
const winterCamp = `<rect width="400" height="240" fill="#1d2b55"/>${starry([[160, 36], [196, 28, 2], [236, 44], [270, 30], [304, 46, 2], [180, 62], [326, 68]])}<g transform="translate(60 -8) scale(.7)">${aurora}</g>
  <g ${INKED}><path d="M130 136 Q236 114 342 136 V250 H130 Z" fill="#fff"/><path d="M130 182 Q236 166 342 184 V250 H130 Z" fill="#e6f0fa"/></g>${iglu(196, 152, .8)}${iglu(272, 148, .65)}${inuksuk(318, 132, .5)}
  ${qamutiik(256, 186, .6)}${dog(214, 188, .55)}${dog(190, 192, .55, "#c9b8a6")}${person(292, 158, .4, "#d9c7a0")}`;
const sledTrip = `<rect width="400" height="240" fill="#cfe0f2"/>${sun(170, 70, 14)}<g ${INKED}><path d="M130 130 Q200 96 270 120 Q310 132 342 118 V250 H130 Z" fill="#fff"/><path d="M130 178 Q236 160 342 180 V250 H130 Z" fill="#e6f0fa"/></g>${inuksuk(296, 120, .8)}
  ${dog(176, 178, .6)}${dog(204, 172, .6, "#c9b8a6")}${dog(232, 178, .6)}<path d="M244 172 L266 174" stroke="#8a5a2b" stroke-width="1.6"/>${qamutiik(292, 178, .65)}${person(306, 132, .42, "#d9c7a0")}`;
// a thermometer for the bubble, marked every 10 degrees
const thermo = t => { const y = v => 118 - (v + 40) * 2.1; return `<div class="thermo"><svg viewBox="0 0 110 140">${[-40, -30, -20, -10, 0, 10].map(v => `<line x1="50" y1="${y(v)}" x2="62" y2="${y(v)}" stroke="#2b1a10" stroke-width="1.8"/><text x="68" y="${y(v) + 4}" font-size="11" font-weight="bold" fill="#2b1a10">${v < 0 ? "−" + -v : v}°</text>`).join("")}
  ${[-35, -25, -15, -5, 5].map(v => `<line x1="50" y1="${y(v)}" x2="57" y2="${y(v)}" stroke="#2b1a10" stroke-width="1.2"/>`).join("")}
  <rect x="34" y="6" width="14" height="118" rx="7" fill="#fff" ${INKED}/><rect x="37.5" y="${y(t)}" width="7" height="${120 - y(t)}" fill="#e63946"/><circle cx="41" cy="124" r="11" fill="#e63946" ${INKED}/></svg></div>`; };

// ---- home: the Grand River at Brantford ----
const LILY = {};
const bridge = (x, y, w) => `<g ${INKED}><path d="M${x} ${y} H${x + w} V${y + 26} H${x + w * .86} Q${x + w * .68} ${y - 2} ${x + w * .5} ${y + 26} Q${x + w * .32} ${y - 2} ${x + w * .14} ${y + 26} H${x} Z" fill="#d9c7a0"/><path d="M${x - 4} ${y} H${x + w + 4}" fill="none" stroke-width="6" stroke="#2b1a10"/><path d="M${x - 4} ${y} H${x + w + 4}" fill="none" stroke="#b9a37c" stroke-width="3"/></g>`;
const carrier = (x, y, s, top) => `${person(x, y, s, top)}<g transform="translate(${x} ${y}) scale(${s})" ${THIN}><rect x="-8" y="-28" width="16" height="11" rx="4" fill="#b03a2e"/></g>`;
const ford1784 = `<rect width="400" height="240" fill="#f6e3b4"/><g ${INKED}><path d="M130 112 Q236 92 342 112 V250 H130 Z" fill="#a9cf86"/></g>${tree(160, 110, .9, "#3f9a58")}${tree(190, 114, .7)}${tree(300, 108, .9)}${tree(324, 114, .7, "#3f9a58")}
  <g ${INKED}><path d="M130 142 Q236 128 342 146 V250 H130 Z" fill="#8fd0f0"/></g><g fill="none" stroke="#fff" stroke-width="2" stroke-linecap="round" opacity=".8"><path d="M160 170 q7 -4 14 0 M250 162 q7 -4 14 0 M300 190 q7 -4 14 0 M190 200 q7 -4 14 0"/></g>
  ${carrier(196, 122, .45, "#3b6ea5")}${person(222, 126, .45)}${carrier(246, 130, .48, "#b98b54")}${person(272, 136, .5, "#7a4a24")}${carrier(298, 142, .5)}${person(216, 152, .4, "#b03a2e")}${canoe(190, 196, .5, { who: 2, packs: 2 })}`;
const tractMap = () => { const river = "M110 6 Q160 58 200 90 T264 200"; // the river runs down to the lake; the green band is the promised land beside it
  return `<rect width="400" height="240" fill="#f6e3b4"/><path d="${river}" fill="none" stroke="#2b1a10" stroke-width="72"/><path d="${river}" fill="none" stroke="#bfe1a0" stroke-width="66"/>
  <path d="${river}" fill="none" stroke="#2b1a10" stroke-width="10"/><path d="${river}" fill="none" stroke="#5db7e6" stroke-width="6"/>
  <path d="M-10 198 Q200 182 410 202 V250 H-10 Z" fill="#6cc0ea" ${INKED}/><text x="110" y="226" font-size="14" font-weight="bold" text-anchor="middle" fill="#fff">Lake Erie</text>
  <g fill="none" stroke="#2b1a10" stroke-width="2.2" stroke-linecap="round"><path d="M160 60 L136 82 M160 60 L184 38"/><path d="M132 78 l4 4 l4 -4 M180 42 l4 -4 l-4 -4" stroke-width="1.6"/></g>
  <g font-size="13" font-weight="bold" fill="#2b1a10"><text x="112" y="104" text-anchor="middle">10 km</text><text x="230" y="48" text-anchor="middle">10 km</text><text x="296" y="150">the Grand River</text><text x="262" y="96">Brant's ford</text></g>
  <path d="M292 146 L258 158" fill="none" stroke="#2b1a10" stroke-width="2" stroke-linecap="round"/><path d="M258 92 L212 91" fill="none" stroke="#2b1a10" stroke-width="2" stroke-linecap="round"/><circle cx="201" cy="91" r="6" fill="#e63946" ${THIN}/>`; };
const chapel = (x, y, s) => `<g transform="translate(${x} ${y}) scale(${s})" ${INKED}><rect x="-44" y="-40" width="74" height="40" fill="#fbfbf5"/><polygon points="-50,-40 -7,-70 36,-40" fill="#5a6470"/><rect x="26" y="-62" width="24" height="62" fill="#fbfbf5"/><polygon points="22,-62 38,-96 54,-62" fill="#5a6470"/><path d="M38 -96 V-108" fill="none"/>
  <path d="M32 0 V-18 Q38 -26 44 -18 V0 Z" fill="#8a5a2b"/>${[-34, -14, 6].map(wx => `<path d="M${wx} -8 V-24 Q${wx + 5} -31 ${wx + 10} -24 V-8 Z" fill="#bfe6f7"/>`).join("")}<circle cx="38" cy="-46" r="5" fill="#bfe6f7"/></g>`;
const letter = (x, y, c) => `<g ${THIN}><rect x="${x - 13}" y="${y - 9}" width="26" height="18" rx="3" fill="#fffdf5"/><path d="M${x - 13} ${y - 8} L${x} ${y + 2} L${x + 13} ${y - 8}" fill="none"/><circle cx="${x}" cy="${y + 3}" r="3" fill="${c}"/></g>`;

// the picture behind everything: sky, sun, drifting clouds and hills
const backdrop = () => `<svg class="backdrop" viewBox="0 0 400 240" preserveAspectRatio="xMidYMid slice"><rect width="400" height="240" fill="#9fd8f2"/><rect y="100" width="400" height="140" fill="#f4f1d8" opacity=".55"/>
  ${sun(352, 34, 18)}<g class="drift">${cloud(218, 30, .75)}</g><g class="drift b">${cloud(300, 66, .6)}</g>
  <g ${INKED}><path d="M-10 190 Q110 150 230 182 T410 168 V250 H-10 Z" fill="#9ed08f"/><path d="M-10 218 Q150 188 270 212 T410 206 V250 H-10 Z" fill="#7dbb7a"/></g></svg>`;
const ICON = { // little outlined pictures for the buttons
  home: `<svg viewBox="0 0 40 40"><g ${INKED}><path d="M5 20 L20 6 L35 20 V35 H5 Z" fill="#fbf1dc"/><path d="M2 21 L20 4 L38 21" fill="none" stroke-width="4"/><path d="M2 21 L20 4 L38 21" fill="none" stroke="#e63946" stroke-width="2"/><rect x="16" y="23" width="8" height="12" rx="1.5" fill="#8a5a2b"/></g></svg>`,
  shelf: `<svg viewBox="0 0 40 40"><g ${INKED}><rect x="5" y="8" width="9" height="26" rx="2" fill="#58b368"/><rect x="15" y="5" width="9" height="29" rx="2" fill="#e63946"/><rect x="25" y="11" width="9" height="23" rx="2" fill="#3b82c4"/></g></svg>`,
  star: `<svg viewBox="0 0 40 40"><polygon points="20,3 25,15 38,16 28,24 31,37 20,30 9,37 12,24 2,16 15,15" fill="#ffd23f" ${INKED}/></svg>`,
  go: `<svg viewBox="0 0 40 40"><circle cx="20" cy="20" r="16" fill="#ff8a3d" ${INKED}/><polygon points="15,11 30,20 15,29" fill="#fff" ${THIN}/></svg>`,
  lock: `<svg viewBox="0 0 40 40"><g ${INKED}><path d="M12 19 V13 Q12 5 20 5 Q28 5 28 13 V19" fill="none" stroke-width="4"/><rect x="7" y="18" width="26" height="18" rx="4" fill="#f4b942"/><circle cx="20" cy="27" r="3" fill="#2b1a10"/></g></svg>`
};
// the clock balloon with Dr. Somebody riding in it
const riding = (x, y, h) => `${owlAt(x + h * .4 - h * .17, y + h * .56, h * .4)}${balloonAt(x, y, h)}`;
const nightSky = pts => `<rect width="400" height="240" fill="#16224a"/>${starry(pts)}<circle cx="330" cy="46" r="20" fill="#fff6c9" ${INKED}/><circle cx="322" cy="40" r="20" fill="#16224a"/>`;
const mapleLeaf = (x, y, s, r) => `<g transform="translate(${x} ${y}) rotate(${r || 0}) scale(${s})" ${THIN}><path d="M0 -20 L5 -11 L12 -14 L10 -4 L19 -5 L14 3 L20 9 L9 9 L10 17 L2 13 L0 22 L-2 13 L-10 17 L-9 9 L-20 9 L-14 3 L-19 -5 L-10 -4 L-12 -14 L-5 -11 Z" fill="#e63946"/></g>`;
