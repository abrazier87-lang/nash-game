"use strict";
// Printable books: Grade 5 ("Dr. Somebody Comes Home").
// Loaded after shared/books.js; adds BOOK.g5 and two Grade 5 math activity builders.

// ---------- game drawings copied from shared/newowl.js and shared/inkart.js ----------
// Turned into clean black-and-white outlines by outline() and place().

// Copied from NEW_OWL in shared/newowl.js (flying cap, goggles, white coat with buttons, red scarf).
const G5_OWL = `<svg viewBox="0 0 200 232"><g stroke="#2b1a10" stroke-width="3.4" stroke-linejoin="round" stroke-linecap="round">
  <ellipse cx="80" cy="218" rx="17" ry="9" fill="#ffa62b"/><ellipse cx="120" cy="218" rx="17" ry="9" fill="#ffa62b"/>
  <ellipse cx="100" cy="160" rx="57" ry="56" fill="#e2b178"/>
  <path d="M45 150 Q44 110 100 106 Q156 110 155 150 Q157 186 139 198 Q120 187 100 191 Q80 187 61 198 Q43 186 45 150 Z" fill="#fff"/>
  <path d="M48 124 Q28 150 37 186 Q53 180 55 150 Z" fill="#fff"/><path d="M152 124 Q172 150 163 186 Q147 180 145 150 Z" fill="#fff"/>
  <path d="M60 164 h22 v13 q-11 7 -22 0 z" fill="#fff"/><path d="M118 164 h22 v13 q-11 7 -22 0 z" fill="#fff"/>
  <circle cx="100" cy="146" r="5.5" fill="#f4b942"/><circle cx="100" cy="168" r="5.5" fill="#f4b942"/>
  <ellipse cx="100" cy="74" rx="63" ry="53" fill="#7a4a24"/>
  <path d="M100 48 Q72 30 52 56 Q42 98 100 114 Q158 98 148 56 Q128 30 100 48 Z" fill="#fff"/>
  <circle cx="73" cy="74" r="24" fill="#f4b942"/><circle cx="127" cy="74" r="24" fill="#f4b942"/>
  <circle class="blink" cx="75" cy="75" r="15" fill="#1c1c1c"/><circle class="blink" cx="125" cy="75" r="15" fill="#1c1c1c"/>
  <circle cx="81" cy="69" r="5" fill="#fff"/><circle cx="131" cy="69" r="5" fill="#fff"/>
  <polygon points="91,88 109,88 100,108" fill="#ff8a3d"/>
  <path d="M52 110 Q100 132 148 110 L152 124 Q100 148 48 124 Z" fill="#e63946"/>
  <path d="M76 132 L66 182 L78 176 L84 184 L92 134 Z" fill="#e63946"/><circle cx="84" cy="130" r="9" fill="#e63946"/>
  <path d="M42 56 Q32 62 39 80 Q51 76 53 58 Z" fill="#fff"/><path d="M158 56 Q168 62 161 80 Q149 76 147 58 Z" fill="#fff"/>
  <path d="M42 56 Q42 6 100 5 Q158 6 158 56 Q130 38 100 38 Q70 38 42 56 Z" fill="#fff"/>
  <path d="M56 32 Q100 20 144 32" fill="none" stroke="#c98a1b" stroke-width="7"/>
  <circle cx="74" cy="30" r="16" fill="#f4b942"/><circle cx="126" cy="30" r="16" fill="#f4b942"/><circle cx="100" cy="29" r="9" fill="#f4b942"/>
  <circle cx="74" cy="30" r="10" fill="#35c2e0"/><circle cx="126" cy="30" r="10" fill="#35c2e0"/><circle cx="100" cy="29" r="5" fill="#35c2e0"/>
</g></svg>`;

// Copied from balloonAt() in shared/inkart.js (Grades 5 to 8 clock balloon), with Grade 5 clock ticks and basket weave.
const G5_BALLOON = `<svg viewBox="0 0 160 200"><g stroke="#2b1a10" stroke-width="4" stroke-linejoin="round" stroke-linecap="round">
  <line x1="52" y1="118" x2="62" y2="160"/><line x1="108" y1="118" x2="98" y2="160"/>
  <path d="M80 6 C26 6 12 52 22 86 C30 110 56 124 60 132 H100 C104 124 130 110 138 86 C148 52 134 6 80 6 Z" fill="#e63946"/>
  <path d="M80 6 C58 20 52 90 66 132 H94 C108 90 102 20 80 6 Z" fill="#ffd84d"/>
  <circle cx="80" cy="66" r="30" fill="#fff"/><line x1="80" y1="66" x2="80" y2="46"/><line x1="80" y1="66" x2="94" y2="74" stroke="#e63946"/><circle cx="80" cy="66" r="3" fill="#2b1a10"/>
  <path d="M56 160 H104 L100 192 H60 Z" fill="#c48a4a"/><path d="M54 158 H106 V168 H54 Z" fill="#9c6830"/></g></svg>`;
const G5_BALLOON_EXTRA = `<path d="M80 6 C40 20 26 88 64 132 M80 6 C120 20 134 88 96 132 M26 98 Q80 116 134 98" fill="none"/>`
  + bumps(12, i => { const a = i * Math.PI / 6, c = Math.cos(a), s = Math.sin(a); return `<line x1="${(80 + 22 * c).toFixed(1)}" y1="${(66 + 22 * s).toFixed(1)}" x2="${(80 + 27 * c).toFixed(1)}" y2="${(66 + 27 * s).toFixed(1)}"/>`; })
  + `<path d="M70 132 L72 158 M90 132 L88 158 M66 168 V192 M75 168 V192 M85 168 V192 M94 168 V192 M58 179 H102" fill="none"/>`;

// Copied from longhouse() in shared/inkart.js: a bark covered Haudenosaunee longhouse with smoke holes.
const G5_LONGHOUSE = `<svg viewBox="0 0 180 96"><path d="M8 92 V50 Q90 2 172 50 V92 Z" fill="#c89a5e"/>
  <path d="M8 50 Q90 2 172 50" fill="none"/><rect x="16" y="62" width="16" height="30" rx="4" fill="#fff"/>
  <path d="M24 62 V92 M40 42 V92 M60 32 V92 M80 28 V92 M100 28 V92 M120 32 V92 M140 42 V92 M160 50 V92 M8 68 H172 M32 52 H172" fill="none"/>
  <path d="M62 24 q-7 -7 0 -13 q7 -6 0 -10 M118 24 q-7 -7 0 -13 q7 -6 0 -10" fill="none"/></svg>`;

// Copied from corn(), squash() and mound() in shared/inkart.js: a Three Sisters mound (corn, climbing beans, squash).
const G5_MOUND = `<svg viewBox="-34 -62 68 74"><ellipse cx="0" cy="4" rx="28" ry="8" fill="#9a6b3c"/>
  <path d="M-24 2 Q-20 -10 -7 -4 Q-9 6 -24 2 Z" fill="#4aa862"/><path d="M24 3 Q20 -9 7 -3 Q9 7 24 3 Z" fill="#58b368"/>
  <ellipse cx="0" cy="-2" rx="11" ry="8" fill="#f79a2e"/><path d="M0 -10 v-4 M-5 -9 Q-7 -2 -5 5 M5 -9 Q7 -2 5 5" fill="none"/>
  <path d="M-2 -4 Q-3 -28 0 -54 Q3 -28 2 -4 Z" fill="#58b368"/>
  <path d="M0 -18 Q-17 -22 -22 -38 Q-7 -34 0 -24 Z" fill="#4aa862"/><path d="M0 -28 Q17 -32 22 -48 Q7 -44 0 -34 Z" fill="#58b368"/>
  <path d="M0 -40 Q-11 -42 -14 -56 Q-3 -52 0 -44 Z" fill="#4aa862"/>
  <path d="M3 -22 Q11 -32 7 -44 Q0 -34 3 -22 Z" fill="#ffd23f"/>
  <path d="M-2 -10 Q10 -18 4 -28 Q-8 -36 4 -46" fill="none"/>
  <ellipse cx="7" cy="-17" rx="3" ry="2.2" fill="#a8452a"/><ellipse cx="-5" cy="-32" rx="3" ry="2.2" fill="#a8452a"/></svg>`;

// Copied from canoe() in shared/inkart.js (birchbark canoe, no invented people, stitched bark ribs and lashings).
const G5_CANOE = `<svg viewBox="-62 -28 124 46"><path d="M-52 -4 Q-60 -18 -50 -20 Q-44 -6 0 -4 Q44 -6 50 -20 Q60 -18 52 -4 Q40 12 0 12 Q-40 12 -52 -4 Z" fill="#ecd3a3"/>
  <path d="M-50 -4 Q0 2 50 -4" fill="none"/>
  <path d="M-38 1 l2 7 M-24 2 l2 8 M-10 3 l2 8 M4 3 l2 8 M18 2 l2 8 M32 1 l2 7 M-50 -14 l6 3 M-49 -9 l6 3 M50 -14 l-6 3 M49 -9 l-6 3" fill="none"/>
  <path d="M-26 -5 L18 -17" fill="none"/><path d="M18 -17 q9 -4 14 2 q-4 6 -14 -2 Z" fill="#b07a45"/></svg>`;

// Copied from riceStalk() in shared/inkart.js: wild rice (manoomin) growing out of shallow water.
const G5_RICE = `<svg viewBox="-16 -56 34 62"><path d="M0 2 Q-2 -24 3 -48" fill="none"/>
  <path d="M-1 -14 Q-12 -22 -14 -34 M1 -20 Q12 -26 14 -38" fill="none"/>
  <ellipse cx="8" cy="-48" rx="4.5" ry="2.2" transform="rotate(-35 8 -48)" fill="#e9c46a"/>
  <ellipse cx="-2" cy="-44" rx="4.5" ry="2.2" transform="rotate(35 -2 -44)" fill="#e9c46a"/>
  <ellipse cx="8" cy="-39" rx="4.2" ry="2" transform="rotate(-25 8 -39)" fill="#e9c46a"/>
  <ellipse cx="-2" cy="-34" rx="4.2" ry="2" transform="rotate(28 -2 -34)" fill="#e9c46a"/></svg>`;

// Copied from the goose break canvas wall tent in ART.goosebreak (grade5-canada.html line 92): pitched gable roof and canvas walls (no conical tipi shape).
const G5_TENT = `<svg viewBox="0 0 116 74"><path d="M10 68 V32 L58 10 L106 32 V68 Z" fill="#fbf6ea"/>
  <path d="M4 34 L58 8 L112 34" fill="none"/><path d="M50 68 V42 H66 V68 Z" fill="#d9c7a0"/>
  <path d="M58 42 V68 M10 32 H106 M26 32 V68 M90 32 V68" fill="none"/>
  <rect x="78" y="4" width="7" height="16" rx="2" fill="#fff"/></svg>`;

// Copied from iglu() in shared/inkart.js: a snow house built from spiralling blocks of hard snow.
const G5_IGLU = `<svg viewBox="-42 -50 104 56"><path d="M30 0 Q30 -18 45 -18 Q58 -18 58 0 Z" fill="#fff"/>
  <path d="M-36 0 Q-36 -44 0 -44 Q36 -44 36 0 Z" fill="#fff"/><path d="M36 0 Q36 -13 45 -13 Q52 -13 52 0 Z" fill="#fff"/>
  <path d="M-34 -12 Q0 -18 34 -12 M-29 -24 Q0 -30 29 -24 M-20 -35 Q0 -39 20 -35 M-18 -1 V-13 M0 -1 V-15 M18 -1 V-13 M-10 -15 V-26 M10 -15 V-26 M-2 -28 V-37" fill="none"/></svg>`;

// Copied from inuksuk() in shared/inkart.js: stacked stones marking the way in the Arctic.
const G5_INUKSUK = `<svg viewBox="-26 -50 52 54"><rect x="-13" y="-16" width="9" height="16" rx="2" fill="#aab2bd"/>
  <rect x="4" y="-16" width="9" height="16" rx="2" fill="#9aa3af"/><rect x="-22" y="-24" width="44" height="9" rx="3" fill="#b9c0ca"/>
  <rect x="-9" y="-36" width="18" height="12" rx="3" fill="#a3abb6"/><rect x="-6" y="-45" width="12" height="9" rx="3" fill="#b9c0ca"/></svg>`;

// Copied from qamutiik() in shared/inkart.js: an Arctic sled with runners, slats and bundles.
const G5_QAMUTIIK = `<svg viewBox="-42 -26 86 36"><rect x="-26" y="-18" width="18" height="13" rx="3" fill="#b03a2e"/>
  <rect x="-6" y="-20" width="22" height="15" rx="3" fill="#8a6238"/>
  <path d="M-26 -11 H-8 M-6 -12 H16 M-34 -4 H30 M-28 -4 V4 M-10 -4 V4 M10 -4 V4 M26 -4 V4 M-36 4 H28 Q36 4 38 -4" fill="none"/></svg>`;

// Copied from chapel() in shared/inkart.js: Mohawk Chapel (1785), the oldest church still standing in Ontario.
const G5_CHAPEL = `<svg viewBox="-54 -114 112 118"><rect x="-44" y="-40" width="74" height="40" fill="#fbfbf5"/>
  <polygon points="-50,-40 -7,-70 36,-40" fill="#5a6470"/><rect x="26" y="-62" width="24" height="62" fill="#fbfbf5"/>
  <polygon points="22,-62 38,-96 54,-62" fill="#5a6470"/><path d="M38 -96 V-108" fill="none"/>
  <path d="M32 0 V-18 Q38 -26 44 -18 V0 Z" fill="#8a5a2b"/>
  <path d="M-34 -8 V-24 Q-29 -31 -24 -24 V-8 Z M-14 -8 V-24 Q-9 -31 -4 -24 V-8 Z M6 -8 V-24 Q11 -31 16 -24 V-8 Z" fill="#bfe6f7"/>
  <circle cx="38" cy="-46" r="5" fill="#bfe6f7"/><path d="M-44 -20 H26 M-44 -30 H26" fill="none"/></svg>`;

// Copied from bridge() in shared/inkart.js: the arched bridge over the Grand River at Brantford.
const G5_BRIDGE = `<svg viewBox="-8 -8 186 42"><path d="M0 4 H170 V30 H146 Q116 2 85 30 Q54 2 24 30 H0 Z" fill="#d9c7a0"/>
  <path d="M-4 4 H174 M0 10 H170 M18 10 V30 M85 10 V30 M152 10 V30" fill="none"/></svg>`;

// Copied from house() in shared/inkart.js: a simple home in today's community.
const G5_HOUSE = `<svg viewBox="-10 -34 80 86"><rect x="0" y="0" width="60" height="44" fill="#fbf1dc"/>
  <polygon points="-6,0 30,-26 66,0" fill="#e63946"/><rect x="24" y="20" width="12" height="24" rx="2" fill="#8a5a2b"/>
  <rect x="6" y="10" width="12" height="12" fill="#bfe6f7"/><rect x="42" y="10" width="12" height="12" fill="#bfe6f7"/></svg>`;

// Copied from mapleLeaf() in shared/inkart.js: a maple leaf.
const G5_MAPLE = `<svg viewBox="-26 -26 52 54"><path d="M0 -20 L5 -11 L12 -14 L10 -4 L19 -5 L14 3 L20 9 L9 9 L10 17 L2 13 L0 22 L-2 13 L-10 17 L-9 9 L-20 9 L-14 3 L-19 -5 L-10 -4 L-12 -14 L-5 -11 Z" fill="#e63946"/>
  <path d="M0 16 V-14 M0 4 L-10 -1 M0 4 L10 -1 M0 -4 L-6 -9 M0 -4 L6 -9" fill="none"/></svg>`;

// ---------- small Grade 5 scenery helpers (black outlines only, white fill) ----------
const G5_rock = (x, y, w, h) => shape(`<path d="M${x} ${y} Q${x + w * .12} ${y - h} ${x + w * .46} ${y - h * .9} Q${x + w * .82} ${y - h * 1.08} ${x + w} ${y} Z"/><path d="M${x + w * .22} ${y - h * .55} q${w * .14} ${-h * .18} ${w * .28} ${-h * .08}" fill="none"/>`);
const G5_goose = (x, y, s) => `<g transform="translate(${x} ${y}) scale(${s})">${shape(`<path d="M-16 4 Q-6 -12 4 -2 Q10 -8 18 -6 Q10 2 2 6 Q-6 2 -16 4 Z"/><path d="M-14 3 Q-4 -6 2 -2" fill="none"/>`, 2 / s)}</g>`;
const G5_ice = (x, y, w) => shape(`<path d="M${x} ${y} l${(w * .3).toFixed(1)} -7 l${(w * .5).toFixed(1)} 3 l${(w * .2).toFixed(1)} 7 l${(-w * .4).toFixed(1)} 6 Z"/>`);

// ---------- Grade 5 math activity builders ----------
// Activity 3: Spring Geese Bar Graph (matches Chapter 3 ASK.geese: reading a bar graph, difference, total, and mean).
ACTIVITY_BUILDERS.g5GeeseGraph = function (G, A) {
  const days = A.days, vals = A.vals, top = 100;
  const x0 = 76, y0 = 266, W = 580, H = 220, bw = 64, gap = 110;
  // five distinct black-and-white hatching patterns so bars stand out cleanly when printed
  let svg = `<svg viewBox="0 0 700 310" width="700" height="310"><defs>
    <pattern id="g5p0" width="10" height="10" patternUnits="userSpaceOnUse"><path d="M0 10 L10 0" stroke="#000" stroke-width="1.5"/></pattern>
    <pattern id="g5p1" width="10" height="10" patternUnits="userSpaceOnUse"><path d="M0 5 H10" stroke="#000" stroke-width="1.5"/></pattern>
    <pattern id="g5p2" width="10" height="10" patternUnits="userSpaceOnUse"><path d="M5 0 V10" stroke="#000" stroke-width="1.5"/></pattern>
    <pattern id="g5p3" width="12" height="12" patternUnits="userSpaceOnUse"><path d="M0 12 L12 0 M0 0 L12 12" stroke="#000" stroke-width="1.3"/></pattern>
    <pattern id="g5p4" width="10" height="10" patternUnits="userSpaceOnUse"><circle cx="5" cy="5" r="1.7" fill="none" stroke="#000" stroke-width="1.3"/></pattern>
  </defs>`;
  svg += `<text x="366" y="24" font-size="20" font-weight="bold" text-anchor="middle" fill="#000">Geese Counted Each Morning</text>`;
  for (let v = 0; v <= top; v += 10) {
    const y = y0 - (v / top) * H;
    svg += `<line x1="${x0}" y1="${y.toFixed(1)}" x2="${x0 + W}" y2="${y.toFixed(1)}" stroke="#000" stroke-width="${v % 20 === 0 ? 1.2 : .6}" ${v > 0 ? 'stroke-dasharray="4 4"' : ""}/>`;
    if (v % 20 === 0) svg += `<text x="${x0 - 10}" y="${(y + 5).toFixed(1)}" font-size="15" font-weight="bold" text-anchor="end" fill="#000">${v}</text>`;
  }
  svg += `<text x="22" y="${y0 - H / 2}" font-size="15" font-weight="bold" text-anchor="middle" fill="#000" transform="rotate(-90 22 ${y0 - H / 2})">Number of geese</text>`;
  days.forEach((d, i) => {
    const h = (vals[i] / top) * H, x = x0 + 36 + i * gap;
    svg += `<rect x="${x}" y="${(y0 - h).toFixed(1)}" width="${bw}" height="${h.toFixed(1)}" fill="url(#g5p${i})" stroke="#000" stroke-width="2.5"/>`;
    svg += `<text x="${x + bw / 2}" y="${y0 + 24}" font-size="14" font-weight="bold" text-anchor="middle" fill="#000">${d}</text>`;
  });
  svg += `<path d="M${x0} ${y0 - H - 8} V${y0} H${x0 + W}" fill="none" stroke="#000" stroke-width="3" stroke-linecap="round"/></svg>`;

  const total = vals.reduce((a, b) => a + b, 0), mean = total / vals.length;
  const maxV = Math.max(...vals), maxDay = days[vals.indexOf(maxV)];
  const qs = [
    { q: "Which morning had the most geese, and how many were counted?", a: `${maxDay}, ${maxV}`, wide: true },
    { q: `How many more geese were counted on ${days[3]} than on ${days[0]}?`, a: `${vals[3] - vals[0]} geese` },
    { q: `How many geese were counted on ${days[1]} and ${days[2]} altogether?`, a: `${vals[1] + vals[2]} geese` },
    { q: "How many geese were counted from Monday to Friday altogether?", a: `${total} geese` },
    { q: "What is the mean (the average) for one morning?", a: `${mean} geese` }
  ];
  const rows = qs.map((item, i) =>
    `<div style="display:flex;align-items:center;justify-content:space-between;gap:16px;padding:12px 14px;border:2px solid #000;border-radius:10px;width:100%;font-size:17px;line-height:1.3">
      <span><b>${i + 1}.</b> ${item.q}</span>
      <span style="flex:none;display:inline-block;width:${item.wide ? 190 : 120}px;height:38px;border:2px solid #000;border-radius:8px;background:#fff"></span>
    </div>`).join("");
  const ansHtml = `<div style="width:310px;text-align:left;font-size:13px;line-height:1.55;border:2px solid #000;border-radius:10px;padding:8px 12px">`
    + qs.map((item, i) => `<p style="margin:2px 0"><b>${i + 1}.</b> ${item.a}</p>`).join("") + `</div>`;
  return {
    body: `<h2 class="pt">Spring Geese Bar Graph</h2><p class="pi">Maya's grandfather counted the spring geese each morning. Use the graph to answer each question.</p>
      <div class="puz" style="gap:12px">${svg}<div style="width:100%;display:flex;flex-direction:column;gap:10px;margin-top:4px">${rows}</div></div>`,
    answer: { label: "Spring Geese Bar Graph", html: ansHtml }
  };
};

// Activity 4: Multiply by Splitting (matches Chapters 1, 4 and 5: splitting a two digit number into tens and ones).
ACTIVITY_BUILDERS.g5SplitMultiply = function (G, A) {
  const example = `<div style="width:100%;border:3px solid #000;border-radius:12px;padding:10px 14px;font-size:16px;line-height:1.45;background:#fff">
    <b>Example:</b> A garden has <b>14 rows</b> with <b>13 mounds</b> in each row. Split <b>13</b> into <b>10</b> and <b>3</b>.<br>
    14 &times; 10 = <b>140</b> &nbsp;&nbsp;&nbsp; 14 &times; 3 = <b>42</b> &nbsp;&nbsp;&nbsp; 140 + 42 = <b>182 mounds</b>
  </div>`;
  const box = (w) => `<span style="display:inline-block;width:${w}px;height:30px;border:2px solid #000;border-radius:6px;vertical-align:middle;margin:0 4px"></span>`;
  const rows = A.items.map((it, i) => {
    const tens = Math.floor(it.b / 10) * 10, ones = it.b % 10;
    return `<div style="width:100%;border:2px solid #000;border-radius:10px;padding:10px 14px;font-size:16px;line-height:1.4">
      <div><b>${i + 1}.</b> ${it.text}</div>
      <div style="margin-top:8px;font-weight:bold;font-size:17px">
        ${it.a} &times; ${tens} = ${box(68)} &nbsp;+&nbsp; ${it.a} &times; ${ones} = ${box(62)} &nbsp;=&nbsp; ${box(76)} ${it.unit}
      </div>
    </div>`;
  }).join("");
  const ansHtml = `<div style="width:330px;text-align:left;font-size:13px;line-height:1.55;border:2px solid #000;border-radius:10px;padding:8px 12px">`
    + A.items.map((it, i) => {
      const tens = Math.floor(it.b / 10) * 10, ones = it.b % 10, p1 = it.a * tens, p2 = it.a * ones;
      return `<p style="margin:2px 0"><b>${i + 1}.</b> ${p1} + ${p2} = <b>${p1 + p2} ${it.unit}</b></p>`;
    }).join("") + `</div>`;
  return {
    body: `<h2 class="pt">Multiply by Splitting</h2><p class="pi">Split the second number into tens and ones, multiply each part, and add them up.</p>
      <div class="puz" style="gap:12px">${example}<div style="width:100%;display:flex;flex-direction:column;gap:12px">${rows}</div></div>`,
    answer: { label: "Multiply by Splitting", html: ansHtml }
  };
};

// ---------- BOOK.g5 entry ----------
BOOK.g5 = {
  story: "Dr. Somebody Comes Home",
  gradeLabel: "Grade 5",
  order: 5,
  lineWidth: 2,
  pictures: {
    owl: { svg: G5_OWL, black: ["#1c1c1c"] },
    balloon: { svg: G5_BALLOON, extra: G5_BALLOON_EXTRA, black: ["#2b1a10"] },
    longhouse: { svg: G5_LONGHOUSE },
    mound: { svg: G5_MOUND },
    canoe: { svg: G5_CANOE },
    rice: { svg: G5_RICE },
    tent: { svg: G5_TENT },
    iglu: { svg: G5_IGLU },
    inuksuk: { svg: G5_INUKSUK },
    qamutiik: { svg: G5_QAMUTIIK },
    chapel: { svg: G5_CHAPEL },
    bridge: { svg: G5_BRIDGE },
    house: { svg: G5_HOUSE },
    mapleLeaf: { svg: G5_MAPLE }
  },
  colouring: [
    { // Chapter 1: Haudenosaunee longhouse beside a Three Sisters garden (longhouse, mound, owl)
      caption: "Three Sisters grow beside the longhouse.",
      scene: (P, S) => [
        S.sun(336, 52, 22), S.cloud(94, 54, 1.05), S.cloud(224, 80, .74),
        S.bird(162, 46), S.bird(190, 56),
        S.hill("M-20 228 Q95 194 205 220 T420 206"),
        S.tree(36, 174, 22), S.tree(356, 176, 22),
        S.hill("M-20 274 Q115 248 245 268 T420 258"),
        // main bark covered longhouse and a smaller distant longhouse on the ridge
        P("longhouse", 24, 152, 224),
        P("longhouse", 252, 186, 128),
        S.bush(248, 266, .75),
        // Three Sisters garden slope in the foreground with stepping stones and Dr. Somebody
        S.hill("M-20 320 Q120 302 250 318 T420 310"),
        S.shape(`<path d="M18 352 Q115 344 215 352 M18 394 Q130 386 245 396" fill="none"/>`, 1.4),
        P("mound", 26, 274, 72), P("mound", 112, 282, 74), P("mound", 198, 274, 72),
        P("mound", 64, 342, 80), P("mound", 162, 348, 82),
        P("owl", 282, 272, 94),
        S.shape(`<ellipse cx="268" cy="408" rx="16" ry="5"/><ellipse cx="304" cy="422" rx="18" ry="6"/><ellipse cx="344" cy="434" rx="18" ry="6"/>`, 1.8),
        S.tuft(36, 434), S.tuft(250, 436), S.flower(366, 412, .45, 14)
      ].join("")
    },
    { // Chapter 2: Birchbark canoe gliding among wild rice on Georgian Bay (canoe, rice, balloon)
      caption: "A birchbark canoe glides through tall wild rice.",
      scene: (P, S) => [
        S.sun(336, 52, 22), S.cloud(86, 54, .98), S.cloud(286, 118, .66),
        S.bird(116, 108), S.bird(266, 74),
        // Canadian Shield rock islands and pines across the bay
        G5_rock(-10, 224, 148, 54), S.pine(34, 174, .82), S.pine(74, 182, .68), S.pine(104, 196, .52),
        G5_rock(252, 220, 158, 48), S.pine(298, 176, .76), S.pine(334, 184, .64), S.pine(366, 190, .58),
        P("balloon", 164, 34, 74),
        // wide lake water and distant islet
        S.shape(`<path d="M-10 224 H410 V470 H-10 Z"/>`),
        G5_rock(128, 250, 74, 22), S.pine(164, 228, .48),
        S.shape(`<path d="M26 246 q14 -5 28 0 t28 0 M236 254 q14 -5 28 0 t28 0 M48 378 q16 -5 32 0 t32 0 M162 418 q18 -5 36 0 t36 0 M28 432 q14 -5 28 0 t28 0" fill="none"/>`, 1.6),
        // background wild rice stalks in the shallow bay, cleanly below the shoreline
        P("rice", 274, 232, 34), P("rice", 306, 238, 36), P("rice", 338, 230, 34),
        // hero birchbark canoe gliding across the water
        P("canoe", 44, 282, 224),
        // foreground wild rice stalks and lily pads framing the lower banks
        S.shape(`<ellipse cx="78" cy="396" rx="18" ry="6"/><ellipse cx="222" cy="382" rx="15" ry="5"/>`, 1.6),
        P("rice", 24, 344, 42), P("rice", 254, 330, 44), P("rice", 296, 338, 46), P("rice", 338, 326, 44)
      ].join("")
    },
    { // Chapter 3: Geese returning in spring over the northern river and goose break camp (tent, owl)
      caption: "Geese return in spring over the northern river.",
      scene: (P, S) => [
        S.sun(56, 52, 20), S.cloud(156, 48, .85), S.cloud(322, 60, .92),
        // two V formations of Canada geese flying north
        G5_goose(198, 96, .88), G5_goose(172, 110, .78), G5_goose(224, 110, .78), G5_goose(148, 126, .68), G5_goose(248, 126, .68), G5_goose(124, 142, .6), G5_goose(272, 142, .6),
        G5_goose(320, 124, .62), G5_goose(300, 136, .54), G5_goose(340, 136, .54),
        // flat northern riverbank lined with boreal pines
        S.hill("M-20 226 Q110 212 220 224 T420 216"),
        S.pine(34, 214, .88), S.pine(68, 222, .72), S.pine(104, 216, .64),
        S.pine(268, 214, .68), S.pine(306, 220, .82), S.pine(352, 216, .92),
        S.hill("M-20 264 Q120 250 250 262 T420 254"),
        // canvas wall tents from the spring goose break camp (drawn over the hills) and Dr. Somebody
        P("tent", 112, 224, 88), P("tent", 204, 232, 74),
        S.shape(`<path d="M174 222 q-5 -7 0 -13 q5 -6 0 -12" fill="none"/>`, 1.6),
        P("owl", 286, 228, 86),
        // wide river during spring break up with drifting ice floes and shoreline reeds
        S.shape(`<path d="M-10 324 Q120 310 240 324 T410 318 V470 H-10 Z"/>`),
        S.shape(`<path d="M30 348 q14 -5 28 0 t28 0 M230 354 q14 -5 28 0 t28 0 M120 426 q16 -5 32 0 t32 0" fill="none"/>`, 1.5),
        G5_ice(46, 372, 56), G5_ice(164, 386, 72), G5_ice(276, 376, 62), G5_ice(94, 414, 48), G5_ice(250, 426, 66),
        S.tuft(32, 320), S.tuft(86, 318), S.tuft(366, 316)
      ].join("")
    },
    { // Chapter 4: Inuksuk on a snowy hill under the northern lights and Nuutuittuq (inuksuk, iglu, qamutiik)
      caption: "An inuksuk stands beneath the still star.",
      scene: (P, S) => [
        // Nuutuittuq (the star that never moves) with gentle turning star arcs around it
        S.shape(`<path d="M138 78 A72 72 0 0 1 164 26 M236 26 A72 72 0 0 1 262 78 M104 94 A108 108 0 0 1 144 20 M256 20 A108 108 0 0 1 296 94" fill="none" stroke-dasharray="5 6"/>`, 1.4),
        S.sparkle(200, 44, 15),
        S.sparkle(48, 42, 7), S.sparkle(96, 64, 6), S.sparkle(310, 56, 7), S.sparkle(358, 38, 8), S.sparkle(72, 128, 6), S.sparkle(342, 118, 6),
        // sweeping northern lights ribbon across the Arctic night sky, with shimmer lines clipped strictly inside
        `<defs><clipPath id="g5Aurora"><path d="M-10 124 Q72 78 164 112 T324 94 T410 110 V142 Q324 126 164 146 T-10 156 Z"/></clipPath></defs>`,
        S.shape(`<path d="M-10 124 Q72 78 164 112 T324 94 T410 110 V142 Q324 126 164 146 T-10 156 Z"/>`, 2),
        `<g clip-path="url(#g5Aurora)">${S.shape(`<path d="M36 90 V160 M76 80 V160 M118 80 V160 M164 90 V160 M212 90 V160 M258 80 V160 M306 80 V160 M352 80 V160" fill="none"/>`, 1.2)}</g>`,
        S.shape(`<path d="M-10 124 Q72 78 164 112 T324 94 T410 110 V142 Q324 126 164 146 T-10 156 Z" fill="none"/>`, 2),
        // distant snow capped Arctic mountains
        S.shape(`<path d="M-20 242 L44 188 L98 224 L158 176 L224 228 L294 182 L356 218 L420 192 V320 H-20 Z"/>`),
        S.shape(`<path d="M144 198 L158 176 L172 198 L164 202 L158 195 L152 203 Z M282 200 L294 182 L306 200 L300 204 L294 198 L288 205 Z"/>`, 1.6),
        // snowy hills with iglu and qamutiik in the middle ground
        S.hill("M-20 264 Q105 236 225 262 T420 248"),
        P("iglu", 26, 224, 134),
        S.hill("M-20 338 Q125 314 250 336 T420 318"),
        P("qamutiik", 136, 302, 114),
        // foreground wind carved snow ridge with the hero inuksuk standing tall
        S.hill("M-20 392 Q130 374 260 390 T420 370"),
        P("inuksuk", 270, 272, 108),
        S.shape(`<path d="M34 416 Q92 406 156 418 M194 432 Q256 420 326 432 M46 438 Q104 430 162 438" fill="none"/>`, 1.5),
        G5_rock(34, 394, 42, 14), G5_rock(234, 404, 34, 12)
      ].join("")
    },
    { // Chapter 5: Dr. Somebody's balloon coming home over the Grand River (balloon, chapel, bridge, house, owl, mapleLeaf)
      caption: "Dr. Somebody's balloon comes home to the river.",
      scene: (P, S) => [
        S.sun(336, 52, 22), S.cloud(76, 52, .92), S.cloud(336, 118, .62),
        S.bird(274, 52), S.bird(116, 110),
        S.hill("M-20 250 Q100 218 210 244 T420 228"),
        // Mohawk Chapel on the left bank and homes on the right bank, with trees clear of the buildings
        P("chapel", 42, 152, 98), S.tree(168, 212, 16),
        P("house", 282, 186, 56), S.tree(366, 210, 16),
        // drifting maple leaves and the clock balloon coming home in open sky
        P("mapleLeaf", 76, 102, 32), P("mapleLeaf", 274, 102, 30),
        P("balloon", 142, 22, 118),
        // Grand River and arched stone bridge
        S.shape(`<path d="M-10 296 Q110 282 220 296 T410 290 V420 H-10 Z"/>`),
        P("bridge", 104, 266, 192),
        S.shape(`<path d="M34 328 q14 -5 28 0 t28 0 M184 334 q14 -5 28 0 t28 0 M298 326 q14 -5 28 0 t28 0" fill="none"/>`, 1.5),
        // grassy foreground riverbank with Dr. Somebody, maple leaves and flowers
        S.hill("M-20 374 Q115 352 245 372 T420 360"),
        P("owl", 280, 312, 88),
        P("mapleLeaf", 46, 392, 34), P("mapleLeaf", 174, 404, 30),
        S.shape(`<ellipse cx="116" cy="414" rx="16" ry="5"/><ellipse cx="146" cy="428" rx="18" ry="6"/>`, 1.6),
        S.tuft(26, 434), S.tuft(234, 434), S.flower(368, 412, .45, 14)
      ].join("")
    }
  ],
  activities: {
    pages: ["maze", "crossword", "g5GeeseGraph", "g5SplitMultiply"],
    maze: {
      cols: 16, rows: 20, seed: 505, cs: 30, ox: 96, oy: 28, wall: 4,
      start: "balloon", end: "mapleLeaf", startW: 72, endW: 64, icon: 1.8, answerWidth: 295,
      title: "Help the balloon find its way home!",
      instruction: "Start at the balloon. Find the way home to the maple leaf. Watch out for dead ends!"
    },
    crossword: {
      seed: 19,
      entries: [
        { word: "MANOOMIN", clue: "Wild rice harvested in shallow bays by the Anishinaabe" },
        { word: "MEEGWETCH", clue: "Thank you in the Cree language" },
        { word: "INUKSUK", clue: "Stones stacked by people to mark the way in the Arctic" },
        { word: "QAMUTIIK", clue: "A long Arctic sled pulled by a dog team" },
        { word: "NAKURMIIK", clue: "Thank you in Nina's language" },
        { word: "LONGHOUSE", clue: "A bark covered building where Haudenosaunee families gather" },
        { word: "PORTAGE", clue: "Carrying a canoe over land from one waterway to the next" },
        { word: "MUSKEG", clue: "Flat wet ground near James Bay that wobbles underfoot" },
        { word: "IGLU", clue: "Nina's word for a house, including one built of snow blocks" },
        { word: "NUNAVUT", clue: "Canada's newest territory, meaning our land" },
        { word: "SQUASH", clue: "One of the Three Sisters, whose big leaves shade the ground" },
        { word: "GEESE", clue: "Birds that fly north to James Bay each spring" }
      ]
    },
    g5GeeseGraph: {
      days: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"],
      vals: [40, 70, 50, 90, 50]
    },
    g5SplitMultiply: {
      items: [
        { a: 12, b: 16, unit: "mounds", text: "A Three Sisters garden has <b>12 rows</b> with <b>16 mounds</b> in each row. How many mounds is that?" },
        { a: 24, b: 13, unit: "km", text: "Paddlers travel <b>24 kilometres</b> each day for <b>13 days</b>. How far is the whole trip?" },
        { a: 15, b: 24, unit: "kg", text: "One snow block weighs <b>15 kilograms</b>. An iglu uses <b>24 blocks</b>. How many kilograms of snow is that?" },
        { a: 35, b: 14, unit: "km", text: "A dog team travels <b>35 kilometres</b> each day for <b>14 days</b>. How far does the team travel?" },
        { a: 18, b: 15, unit: "km", text: "Travelling to a new home, a group covers <b>18 kilometres</b> a day for <b>15 days</b>. How far do they go?" }
      ]
    }
  }
};
