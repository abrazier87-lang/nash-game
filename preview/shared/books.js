"use strict";
/* =====================================================================
   PRINTABLE BOOKS: the colouring book and the activity book.
   Both pages (book-colouring.html and book-activities.html) load this
   file and call Books.start("colouring") or Books.start("activities").
   The address says which grade: ?g=g3 (g3 is the default).

   To add a grade, add one more entry to BOOK (see BOOK.g3 near the
   bottom): its story name, its pictures (copied from the game and
   turned into outlines by outline()), its colouring scenes, and its
   word lists. Nothing else needs to change.
   ===================================================================== */

// ---------- small tools ----------
// A seeded random-number generator: the same seed always gives the same numbers,
// so a puzzle looks the same every time the page loads and the answers always match.
function mulberry32(a) {
  return function () {
    a |= 0; a = a + 0x6D2B79F5 | 0;
    let t = Math.imul(a ^ a >>> 15, 1 | a);
    t = t + Math.imul(t ^ t >>> 7, 61 | t) ^ t;
    return ((t ^ t >>> 14) >>> 0) / 4294967296;
  };
}
const shuffled = (list, rng) => {
  const a = list.slice();
  for (let i = a.length - 1; i > 0; i--) { const j = Math.floor(rng() * (i + 1)); [a[i], a[j]] = [a[j], a[i]]; }
  return a;
};

// ---------- turning a game drawing into a colouring outline ----------
// outline(svgText, options) takes the SVG text of a drawing from a game and returns a new SVG:
//   every fill becomes white (or black for the colours listed in options.black, such as eye pupils),
//   every stroke becomes black and the same thickness everywhere (options.stroke, in the drawing's own units),
//   gradients, classes, styles and see-through shine shapes are thrown away,
//   and anything matching a pattern in options.drop (tiny details) is cut out first.
// options.viewBox changes the view box (to make room for a hat, say). options.attrs is added to the <svg> tag.
function outline(svg, o) {
  o = o || {};
  const m = svg.match(/^\s*<svg([^>]*)>([\s\S]*)<\/svg>\s*$/);
  if (!m) throw new Error("outline() needs a whole <svg> drawing");
  const viewBox = o.viewBox || (m[1].match(/viewBox="([^"]*)"/) || [])[1];
  const black = (o.black || []).map(c => c.toLowerCase());
  let inner = m[2];
  (o.drop || []).forEach(re => { inner = inner.replace(re, ""); });
  // a drawing that colours itself with CSS classes (Dot does) can give each class a fill here
  Object.keys(o.classFills || {}).forEach(k => { inner = inner.replace(new RegExp('class="' + k + '"', "g"), 'fill="' + o.classFills[k] + '"'); });
  inner = inner
    .replace(/<[a-zA-Z]+\b[^>]*\sopacity="[^"]*"[^>]*\/>/g, "")                 // shines and see-through shapes
    .replace(/<defs>[\s\S]*?<\/defs>/g, "")                                      // gradients
    .replace(/\s(?:class|style|stroke|stroke-width|stroke-linecap|stroke-linejoin|stroke-opacity|fill-opacity)="[^"]*"/g, "")
    .replace(/\sfill="([^"]*)"/g, (all, c) => c === "none" ? all : black.includes(c.toLowerCase()) ? ' fill="#000"' : ' fill="#fff"');
  const w = (o.stroke || 3.5).toFixed(2);
  // options.mask is a list of points (the picture's own units) for a plain white shape drawn first, so lines from things
  // behind never show through the gaps in a picture (between the roofs of a pagoda, say)
  const mask = o.mask ? `<polygon points="${o.mask}" fill="#fff" stroke="none"/>` : "";
  return `<svg viewBox="${viewBox}"${o.attrs || ""}><g fill="#fff" stroke="#000" stroke-width="${w}" stroke-linejoin="round" stroke-linecap="round">${mask}${inner}</g></svg>`;
}

// Puts a picture from a grade's list onto a scene: x and y are the top left corner and w is the width,
// all in scene units. The line thickness is worked out so it comes out about 3.5 scene units whatever the size.
function place(pic, x, y, w, target) {
  const vb = (pic.viewBox || pic.svg.match(/viewBox="([^"]*)"/)[1]).trim().split(/\s+/).map(Number);
  const h = w * vb[3] / vb[2];
  // pic.extra is more drawing added to the game's picture (stripes, joints, leaves); pic.clip crops to the view box (a head and shoulders)
  const svg = pic.extra ? pic.svg.replace(/<\/svg>\s*$/, pic.extra + "</svg>") : pic.svg;
  return outline(svg, {
    viewBox: vb.join(" "), stroke: (target || 3.5) * vb[2] / w, black: pic.black, drop: pic.drop, classFills: pic.classFills, mask: pic.mask,
    attrs: ` x="${x}" y="${y}" width="${w}" height="${h.toFixed(1)}" overflow="${pic.clip ? "hidden" : "visible"}"`
  });
}

// Plain shapes drawn straight into a scene (sky, hills, mountains): white inside, black line.
let LINE = 3.5;   // the line thickness for the grade being drawn (younger grades use thicker lines)
const shape = (inner, w) => `<g fill="#fff" stroke="#000" stroke-width="${w || LINE}" stroke-linejoin="round" stroke-linecap="round">${inner}</g>`;
// (the cloud outline comes from cloud() in shared/inkart.js)
const cloudShape = (x, y, s) => `<g transform="translate(${x} ${y}) scale(${s})">${shape(`<path d="M-30 10 Q-44 10 -40 -2 Q-38 -14 -24 -12 Q-18 -28 0 -24 Q12 -34 24 -20 Q42 -22 42 -4 Q46 10 30 10 Z"/>`, LINE / s)}</g>`;
const sunShape = (x, y, r) => shape(Array.from({ length: 8 }, (_, i) => { const a = i / 8 * 2 * Math.PI; return `<line x1="${(x + (r + 7) * Math.cos(a)).toFixed(1)}" y1="${(y + (r + 7) * Math.sin(a)).toFixed(1)}" x2="${(x + (r + 17) * Math.cos(a)).toFixed(1)}" y2="${(y + (r + 17) * Math.sin(a)).toFixed(1)}"/>`; }).join("") + `<circle cx="${x}" cy="${y}" r="${r}"/>`);
// A hill: give only the top edge (from x -20 to x 420). It is closed far below the picture, so no line shows along the bottom edge.
const hillShape = d => shape(`<path d="${d} V490 H-20 Z"/>`);
const pts = (r, n, f) => Array.from({ length: n }, (_, i) => f(i, i * 2 * Math.PI / n)).join("");
// A round tree: trunk first, then the round top over it.
const treeShape = (x, y, r) => shape(`<rect x="${x - r * .22}" y="${y + r * .5}" width="${r * .44}" height="${r * 1.1}"/><circle cx="${x}" cy="${y}" r="${r}"/>`);
// A flower: six round petals round a middle, with a stem that runs down to y + stem.
const flowerShape = (x, y, s, stem) => shape((stem ? `<path d="M${x} ${y + 16 * s} V${y + stem}" fill="none"/>` : "") + pts(0, 6, (i, a) => `<circle cx="${(x + 17 * s * Math.cos(a)).toFixed(1)}" cy="${(y + 17 * s * Math.sin(a)).toFixed(1)}" r="${(12 * s).toFixed(1)}"/>`) + `<circle cx="${x}" cy="${y}" r="${(9 * s).toFixed(1)}"/>`);
// Railway track: sleepers from x0 to x1 with their tops at y, and two rails across them.
const trackShape = (x0, x1, y) => { let d = ""; for (let x = x0; x < x1; x += 36) d += `<rect x="${x}" y="${y}" width="22" height="30"/>`; return shape(d) + shape(`<path d="M${x0} ${y + 6} H${x1} M${x0} ${y + 22} H${x1}" fill="none"/>`); };
const tuftShape = (x, y) => shape(`<path d="M${x} ${y} q-2 -14 -10 -22 M${x} ${y} q0 -18 4 -28 M${x} ${y} q4 -12 14 -18" fill="none"/>`);
const bushShape = (x, y, s) => shape([[-14, 0, 11], [0, -6, 14], [14, 0, 11]].map(([dx, dy, r]) => `<circle cx="${x + dx * s}" cy="${y + dy * s}" r="${r * s}"/>`).join(""));
const birdShape = (x, y) => shape(`<path d="M${x} ${y} q7 -9 14 0 q7 -9 14 0" fill="none"/>`);
const sparkleShape = (x, y, r) => shape(`<polygon points="${x},${y - r} ${x + r * .26},${y - r * .26} ${x + r},${y} ${x + r * .26},${y + r * .26} ${x},${y + r} ${x - r * .26},${y + r * .26} ${x - r},${y} ${x - r * .26},${y - r * .26}"/>`);
// A firework burst: lines out from a middle, a long one and a short one in turn.
const burstShape = (x, y, r) => shape(pts(0, 12, (i, a) => { const a0 = r * .35, a1 = i % 2 ? r * .75 : r; return `<line x1="${(x + a0 * Math.cos(a)).toFixed(1)}" y1="${(y + a0 * Math.sin(a)).toFixed(1)}" x2="${(x + a1 * Math.cos(a)).toFixed(1)}" y2="${(y + a1 * Math.sin(a)).toFixed(1)}"/>`; }));
// A mountain with the same outline as the game's misty peaks (the .peak shapes in grade3-china.html): x, y, width, height.
const peakShape = (x, y, w, h) => shape(`<polygon points="${[[0, 1], [.28, .22], [.44, .52], [.62, 0], [1, 1]].map(([a, b]) => (x + a * w).toFixed(1) + "," + (y + b * h).toFixed(1)).join(" ")}"/>`);
// Simple Kindergarten friendly details: a butterfly, a railway signal, and a simple outlined duck on water.
const butterflyShape = (x, y, s) => `<g transform="translate(${x} ${y}) scale(${s})">${shape(`<ellipse cx="-14" cy="-7" rx="14" ry="10" transform="rotate(-18 -14 -7)"/><ellipse cx="14" cy="-7" rx="14" ry="10" transform="rotate(18 14 -7)"/><ellipse cx="-11" cy="8" rx="10" ry="8" transform="rotate(14 -11 8)"/><ellipse cx="11" cy="8" rx="10" ry="8" transform="rotate(-14 11 8)"/><rect x="-4" y="-14" width="8" height="28" rx="4"/><path d="M-2 -14 Q-9 -24 -14 -22 M2 -14 Q9 -24 14 -22" fill="none"/>`, LINE / s)}</g>`;
const signalShape = (x, y, h, dir) => { const d = dir || 1; return shape(`<rect x="${x - 6}" y="${y}" width="12" height="${h}" rx="3"/><rect x="${x - 16}" y="${y + h - 10}" width="32" height="12" rx="4"/><path d="M${x + 6 * d} ${y + 18} H${x + 48 * d} L${x + 40 * d} ${y + 32} H${x + 6 * d} Z"/><rect x="${x - 16}" y="${y - 4}" width="32" height="60" rx="14"/><circle cx="${x}" cy="${y + 14}" r="9"/><circle cx="${x}" cy="${y + 38}" r="9"/>`); };
const duckShape = (x, y, s, flip) => `<g transform="translate(${x} ${y}) scale(${flip ? -s : s} ${s})">${shape(`<path d="M-26 6 Q-28 -10 -12 -10 H12 Q28 -10 26 4 Q24 16 0 16 Q-22 16 -26 6 Z"/><path d="M-24 2 L-34 -8 L-18 -6 Z"/><circle cx="18" cy="-16" r="13"/><path d="M29 -17 L41 -13 L29 -10 Z"/><path d="M-10 -2 Q2 -8 12 2 Q2 10 -10 4" fill="none"/>`, LINE / s)}<circle cx="22" cy="-19" r="2.8" fill="#000"/></g>`;
// A layered pine tree for Grade 3 mountain and garden scenes.
const pineShape = (x, y, s) => `<g transform="translate(${x} ${y}) scale(${s})">${shape(`<rect x="-4" y="2" width="8" height="18" rx="2"/><polygon points="0,-46 15,-22 8,-22 20,-4 10,-4 24,10 -24,10 -10,-4 -20,-4 -8,-22 -15,-22"/>`, LINE / s)}</g>`;
const SCENE_TOOLS = { shape, cloud: cloudShape, sun: sunShape, hill: hillShape, peak: peakShape, tree: treeShape, flower: flowerShape, track: trackShape, tuft: tuftShape, bush: bushShape, bird: birdShape, sparkle: sparkleShape, burst: burstShape, butterfly: butterflyShape, signal: signalShape, duck: duckShape, pine: pineShape };

// ---------- one sheet of paper ----------
function sheet(G, bookName, pageNo, body) {
  return `<div class="sheetwrap"><section class="sheet"><div class="inner">
    <header class="sh"><span>${G.story}</span><span>${G.gradeLabel}</span></header>
    <div class="pbody">${body}</div>
    <footer class="sf"><span>${bookName}</span><span>Page ${pageNo}</span></footer>
  </div></section></div>`;
}

// ---------- colouring pages ----------
// .art measures 720 by 814.4 px (ratio 400:452.4), so viewBox 0 0 400 452 fills the frame with zero side cropping.
function colouringPages(G, bookName) {
  LINE = G.lineWidth || 3.5;
  const P = (name, x, y, w, target) => place(G.pictures[name], x, y, w, target || LINE);
  return G.colouring.map((page, i) => sheet(G, bookName, i + 1,
    `<div class="art"><svg viewBox="0 0 400 452" preserveAspectRatio="xMidYMid slice">${page.scene(P, SCENE_TOOLS)}</svg></div>
     <p class="cap">${page.caption}</p><p class="by">Coloured by: <span class="ul"></span></p>`));
}

// ---------- word search ----------
const ABC = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
const ALL_DIRECTIONS = [[1, 0], [-1, 0], [0, 1], [0, -1], [1, 1], [-1, -1], [1, -1], [-1, 1]];
// How many times a word can be read in the grid, in any of the eight directions.
function countWord(grid, word) {
  const n = grid.length; let found = 0;
  for (let y = 0; y < n; y++) for (let x = 0; x < n; x++) for (const [dx, dy] of ALL_DIRECTIONS) {
    let ok = true;
    for (let i = 0; i < word.length && ok; i++) { const cx = x + dx * i, cy = y + dy * i; ok = cx >= 0 && cy >= 0 && cx < n && cy < n && grid[cy][cx] === word[i]; }
    if (ok) found++;
  }
  return found;
}
// Hides the words across, down and diagonally down to the right (never backwards), then fills the gaps.
function makeWordSearch(words, size, seed) {
  const rng = mulberry32(seed), dirs = [[1, 0], [0, 1], [1, 1]];
  const order = words.slice().sort((a, b) => b.length - a.length);
  for (let attempt = 0; attempt < 500; attempt++) {
    const grid = Array.from({ length: size }, () => Array(size).fill(""));
    const placed = [];
    let allFit = true;
    for (const word of order) {
      let done = false;
      for (let tries = 0; tries < 400 && !done; tries++) {
        const [dx, dy] = dirs[Math.floor(rng() * dirs.length)];
        const x = Math.floor(rng() * size), y = Math.floor(rng() * size);
        if (x + dx * (word.length - 1) >= size || y + dy * (word.length - 1) >= size) continue;
        let fits = true;
        for (let i = 0; i < word.length && fits; i++) { const c = grid[y + dy * i][x + dx * i]; fits = !c || c === word[i]; }
        if (!fits) continue;
        for (let i = 0; i < word.length; i++) grid[y + dy * i][x + dx * i] = word[i];
        placed.push({ word, x, y, dx, dy }); done = true;
      }
      if (!done) { allFit = false; break; }
    }
    if (!allFit) continue;
    for (let y = 0; y < size; y++) for (let x = 0; x < size; x++) if (!grid[y][x]) grid[y][x] = ABC[Math.floor(rng() * 26)];
    if (words.every(w => countWord(grid, w) === 1)) return { grid, placed };   // no word hiding twice by accident
  }
  throw new Error("could not build the word search");
}
function wordSearchSvg(ws, cell, answers) {
  const n = ws.grid.length, W = n * cell, pad = 3, fs = Math.round(cell * .6);
  let s = `<svg viewBox="${-pad} ${-pad} ${W + 2 * pad} ${W + 2 * pad}" width="${W + 2 * pad}" height="${W + 2 * pad}"><rect x="0" y="0" width="${W}" height="${W}" fill="#fff" stroke="#000" stroke-width="${Math.max(2, cell / 16).toFixed(1)}"/>`;
  s += `<g font-size="${fs}" font-weight="bold" text-anchor="middle" fill="#000">`;
  ws.grid.forEach((row, y) => row.forEach((ch, x) => { s += `<text x="${(x + .5) * cell}" y="${((y + .5) * cell + fs * .35).toFixed(1)}">${ch}</text>`; }));
  s += `</g>`;
  if (answers) {
    const r = cell * .42;
    ws.placed.forEach(p => {
      const x1 = (p.x + .5) * cell, y1 = (p.y + .5) * cell, len = Math.hypot(p.dx, p.dy) * (p.word.length - 1) * cell, ang = Math.atan2(p.dy, p.dx) * 180 / Math.PI;
      s += `<rect x="${-r}" y="${-r}" width="${(len + 2 * r).toFixed(1)}" height="${2 * r}" rx="${r}" transform="translate(${x1} ${y1}) rotate(${ang.toFixed(1)})" fill="none" stroke="#000" stroke-width="${Math.max(2, cell / 10).toFixed(1)}"/>`;
    });
  }
  return s + `</svg>`;
}

// ---------- crossword ----------
// entries: [{ word, clue }]. The longest word goes first, then each other word is fitted onto a shared letter.
// Many shuffled orders are tried (the seed keeps it the same every time) and the best layout is kept.
function makeCrossword(entries, seed, maxWords, maxSpan) {
  const rng = mulberry32(seed);
  const sorted = entries.slice().sort((a, b) => b.word.length - a.word.length);
  let best = null;
  for (let attempt = 0; attempt < 150; attempt++) {
    const order = [sorted[0]].concat(shuffled(sorted.slice(1), rng));
    const cells = new Map(), placed = [], key = (x, y) => x + "," + y;
    const span = (extra) => {   // width and height of everything placed so far, plus a new word
      let x0 = 1e9, x1 = -1e9, y0 = 1e9, y1 = -1e9;
      const see = (x, y) => { x0 = Math.min(x0, x); x1 = Math.max(x1, x); y0 = Math.min(y0, y); y1 = Math.max(y1, y); };
      placed.forEach(p => { see(p.x, p.y); see(p.x + (p.dir === 0 ? p.word.length - 1 : 0), p.y + (p.dir === 1 ? p.word.length - 1 : 0)); });
      if (extra) { see(extra.x, extra.y); see(extra.x + (extra.dir === 0 ? extra.word.length - 1 : 0), extra.y + (extra.dir === 1 ? extra.word.length - 1 : 0)); }
      return [x1 - x0 + 1, y1 - y0 + 1];
    };
    const fits = (word, x, y, dir) => {          // dir 0 = across, 1 = down
      const dx = dir === 0 ? 1 : 0, dy = dir === 0 ? 0 : 1;
      if (cells.has(key(x - dx, y - dy)) || cells.has(key(x + dx * word.length, y + dy * word.length))) return false;
      let crossings = 0;
      for (let i = 0; i < word.length; i++) {
        const cx = x + dx * i, cy = y + dy * i, c = cells.get(key(cx, cy));
        if (c) {
          if (c.ch !== word[i] || (dir === 0 ? c.h : c.v)) return false;
          crossings++;
        } else if (cells.has(key(cx + dy, cy + dx)) || cells.has(key(cx - dy, cy - dx))) return false;   // no touching sideways
      }
      return crossings >= 1;
    };
    const add = (e, x, y, dir) => {
      const dx = dir === 0 ? 1 : 0, dy = dir === 0 ? 0 : 1;
      for (let i = 0; i < e.word.length; i++) {
        const k = key(x + dx * i, y + dy * i), c = cells.get(k) || { ch: e.word[i], h: false, v: false };
        if (dir === 0) c.h = true; else c.v = true;
        cells.set(k, c);
      }
      placed.push({ word: e.word, clue: e.clue, x, y, dir });
    };
    add(order[0], 0, 0, 0);
    for (let k = 1; k < order.length && placed.length < maxWords; k++) {
      const e = order[k], options = [];
      placed.forEach(p => {
        for (let i = 0; i < p.word.length; i++) for (let j = 0; j < e.word.length; j++) {
          if (p.word[i] !== e.word[j]) continue;
          const dir = 1 - p.dir, x = p.dir === 0 ? p.x + i : p.x - j, y = p.dir === 0 ? p.y - j : p.y + i;
          if (!fits(e.word, x, y, dir)) continue;
          const [w, h] = span({ word: e.word, x, y, dir });
          if (w <= maxSpan && h <= maxSpan) options.push([x, y, dir, w * h]);
        }
      });
      if (options.length) { const o = options[Math.floor(rng() * options.length)]; add(e, o[0], o[1], o[2]); }
    }
    const [w, h] = span(null), score = placed.length * 1000 - w * h;
    if (!best || score > best.score) best = { score, placed };
  }
  // move the layout to the top left corner and number the squares
  const ps = best.placed.map(p => Object.assign({}, p));
  const x0 = Math.min(...ps.map(p => p.x)), y0 = Math.min(...ps.map(p => p.y));
  ps.forEach(p => { p.x -= x0; p.y -= y0; });
  const cols = Math.max(...ps.map(p => p.x + (p.dir === 0 ? p.word.length : 1))), rows = Math.max(...ps.map(p => p.y + (p.dir === 1 ? p.word.length : 1)));
  const grid = Array.from({ length: rows }, () => Array(cols).fill(""));
  ps.forEach(p => { for (let i = 0; i < p.word.length; i++) grid[p.y + (p.dir === 1 ? i : 0)][p.x + (p.dir === 0 ? i : 0)] = p.word[i]; });
  const starts = {};
  ps.slice().sort((a, b) => a.y - b.y || a.x - b.x).forEach(p => { const k = p.x + "," + p.y; if (!starts[k]) starts[k] = Object.keys(starts).length + 1; p.num = starts[k]; });
  return { cols, rows, grid, words: ps, starts };
}
function crosswordSvg(cw, cell, answers) {
  const W = cw.cols * cell, H = cw.rows * cell, pad = 3, nf = Math.max(8, Math.round(cell * .28)), lf = Math.round(cell * .6);
  let s = `<svg viewBox="${-pad} ${-pad} ${W + 2 * pad} ${H + 2 * pad}" width="${W + 2 * pad}" height="${H + 2 * pad}">`;
  cw.grid.forEach((row, y) => row.forEach((ch, x) => {
    if (!ch) return;
    s += `<rect x="${x * cell}" y="${y * cell}" width="${cell}" height="${cell}" fill="#fff" stroke="#000" stroke-width="${Math.max(1.5, cell / 18).toFixed(1)}"/>`;
    const num = cw.starts[x + "," + y];
    if (num) s += `<text x="${x * cell + cell * .08}" y="${y * cell + nf + cell * .03}" font-size="${nf}" font-weight="bold" fill="#000">${num}</text>`;
    if (answers) s += `<text x="${(x + .5) * cell}" y="${((y + .5) * cell + lf * .38).toFixed(1)}" font-size="${lf}" font-weight="bold" text-anchor="middle" fill="#000">${ch}</text>`;
  }));
  return s + `</svg>`;
}
function clueLists(cw) {
  const list = dir => cw.words.filter(p => p.dir === dir).sort((a, b) => a.num - b.num)
    .map(p => `<li><b>${p.num}.</b>${p.clue} (${p.word.length})</li>`).join("");
  return `<div class="clues"><div><h3>Across</h3><ol>${list(0)}</ol></div><div><h3>Down</h3><ol>${list(1)}</ol></div></div>`;
}

// ---------- maze ----------
const MAZE_DIRS = [["n", 0, -1, "s"], ["e", 1, 0, "w"], ["s", 0, 1, "n"], ["w", -1, 0, "e"]];
// Depth-first carving: from the start, keep walking to a square not visited yet and knock down the wall, backing up at dead ends.
// That gives exactly one way between any two squares. The entrance is the left side of the top left square and the exit is the right side of the bottom right one.
function makeMaze(cols, rows, seed) {
  const rng = mulberry32(seed);
  const cell = Array.from({ length: rows }, () => Array.from({ length: cols }, () => ({ n: 1, e: 1, s: 1, w: 1, seen: 0 })));
  const stack = [[0, 0]]; cell[0][0].seen = 1;
  while (stack.length) {
    const [x, y] = stack[stack.length - 1];
    const options = MAZE_DIRS.filter(([, dx, dy]) => { const nx = x + dx, ny = y + dy; return nx >= 0 && ny >= 0 && nx < cols && ny < rows && !cell[ny][nx].seen; });
    if (!options.length) { stack.pop(); continue; }
    const [d, dx, dy, back] = options[Math.floor(rng() * options.length)];
    cell[y][x][d] = 0; cell[y + dy][x + dx][back] = 0; cell[y + dy][x + dx].seen = 1; stack.push([x + dx, y + dy]);
  }
  cell[0][0].w = 0; cell[rows - 1][cols - 1].e = 0;
  return { cols, rows, cell };
}
// The way through, as a list of [x, y] squares (found by walking outwards from the start).
function solveMaze(m) {
  const prev = new Map([["0,0", null]]), queue = [[0, 0]];
  while (queue.length) {
    const [x, y] = queue.shift();
    if (x === m.cols - 1 && y === m.rows - 1) break;
    for (const [d, dx, dy] of MAZE_DIRS) {
      const nx = x + dx, ny = y + dy;
      if (m.cell[y][x][d] || nx < 0 || ny < 0 || nx >= m.cols || ny >= m.rows || prev.has(nx + "," + ny)) continue;
      prev.set(nx + "," + ny, [x, y]); queue.push([nx, ny]);
    }
  }
  const path = []; let at = [m.cols - 1, m.rows - 1];
  while (at) { path.unshift(at); at = prev.get(at[0] + "," + at[1]); }
  return path;
}
const picHeight = (pic, w) => { const vb = (pic.viewBox || pic.svg.match(/viewBox="([^"]*)"/)[1]).trim().split(/\s+/).map(Number); return w * vb[3] / vb[2]; };
// Makes a puzzle drawing (one of my SVGs that starts with viewBox, width and height) a different width, keeping its shape.
function resize(svg, w) {
  const vb = svg.match(/viewBox="([^"]*)"/)[1].split(" ").map(Number);
  return svg.replace(/width="[\d.]+" height="[\d.]+"/, `width="${w}" height="${(w * vb[3] / vb[2]).toFixed(1)}"`);
}
// The maze drawing. G.activities.maze can change the square size (cs), the side margins (ox), the top margin (oy),
// the wall thickness, and which pictures stand at the start and the end (and how wide they are).
function mazeSvg(G, m, solution) {
  const o = Object.assign({ cs: 36, ox: 108, oy: 40, wall: 5, start: "owl", end: "balloon", startW: 92, endW: 60, icon: 2 }, G.activities.maze);
  const cs = o.cs, ox = o.ox, oy = o.oy, W = ox * 2 + m.cols * cs, H = oy + m.rows * cs + 30;
  let d = "";
  m.cell.forEach((row, y) => row.forEach((c, x) => {
    const X = ox + x * cs, Y = oy + y * cs;
    if (y === 0 && c.n) d += `M${X} ${Y}h${cs}`;
    if (x === 0 && c.w) d += `M${X} ${Y}v${cs}`;
    if (c.s) d += `M${X} ${Y + cs}h${cs}`;
    if (c.e) d += `M${X + cs} ${Y}v${cs}`;
  }));
  let s = `<svg viewBox="0 0 ${W} ${H}" width="${W}" height="${H}"><path d="${d}" fill="none" stroke="#000" stroke-width="${o.wall}" stroke-linecap="square"/>`;
  if (solution) {
    const pts = [[-.5, .5]].concat(solveMaze(m).map(([x, y]) => [x + .5, y + .5]), [[m.cols + .5, m.rows - .5]]).map(([x, y]) => `${ox + x * cs},${oy + y * cs}`).join(" ");
    s += `<polyline points="${pts}" fill="none" stroke="#000" stroke-width="${Math.max(3, Math.round(o.wall * .8))}" stroke-dasharray="${cs / 4} ${(cs / 4.5).toFixed(1)}" stroke-linecap="round" stroke-linejoin="round"/>`;
  }
  const A = G.pictures[o.start], B = G.pictures[o.end], aH = picHeight(A, o.startW), bH = picHeight(B, o.endW);
  s += place(A, (ox - o.startW) / 2, oy + cs / 2 - aH / 2, o.startW, o.icon);                                   // the hero waits at the entrance
  s += place(B, ox + m.cols * cs + (ox - o.endW) / 2, oy + (m.rows - .5) * cs - bH / 2, o.endW, o.icon);       // the goal is by the exit
  return s + `</svg>`;
}

// ---------- plain icons (for counting and patterns) ----------
// Outlines about 50 wide, centred on 0,0, drawn in code.
const starPoints = (R, r) => Array.from({ length: 10 }, (_, i) => { const a = -Math.PI / 2 + i * Math.PI / 5, rad = i % 2 ? r : R; return (rad * Math.cos(a)).toFixed(1) + "," + (rad * Math.sin(a)).toFixed(1); }).join(" ");
const ICONS = {
  star: `<polygon points="${starPoints(26, 11)}"/>`,
  heart: `<path d="M0 20 C-32 -2 -24 -24 -11 -24 C-5 -24 0 -19 0 -14 C0 -19 5 -24 11 -24 C24 -24 32 -2 0 20 Z"/>`,
  circle: `<circle cx="0" cy="0" r="22"/>`,
  square: `<rect x="-20" y="-20" width="40" height="40" rx="4"/>`,
  triangle: `<polygon points="0,-24 25,18 -25,18"/>`,
  wheel: `<circle cx="0" cy="0" r="23"/><circle cx="0" cy="0" r="9"/><path d="M0 -23 V-9 M0 9 V23 M-23 0 H-9 M9 0 H23" fill="none"/>`,
  ticket: `<path d="M-27 -16 H27 V-5 a5 5 0 0 0 0 10 V16 H-27 V5 a5 5 0 0 0 0 -10 Z"/><path d="M12 -10 V10" fill="none" stroke-dasharray="3 5"/>`
};
// One icon at x, y. Kinds that are pictures in the grade's list (the animal faces, the train car) are placed as outlines.
function iconAt(G, kind, x, y, k) {
  const pic = G.pictures[kind];
  k = k || 1;
  if (pic) { const w = (kind === "car" ? 58 : 52) * k; return place(pic, x - w / 2, y - picHeight(pic, w) / 2, w, 2.6); }
  return `<g transform="translate(${x} ${y}) scale(${k})" fill="#fff" stroke="#000" stroke-width="${(4 / k).toFixed(1)}" stroke-linejoin="round" stroke-linecap="round">${ICONS[kind]}</g>`;
}

// ---------- dot to dot ----------
// A.points are the corners of the picture's outline in order, A.extras is the printed part (wheels, window and so on).
// Each number goes on the outside of the outline, so it never sits on a line.
function dotToDotSvg(A, answers) {
  const poly = A.points, n = poly.length;
  let area = 0; poly.forEach((p, i) => { const q = poly[(i + 1) % n]; area += p[0] * q[1] - q[0] * p[1]; });
  const sign = area > 0 ? 1 : -1;
  const normal = i => { const p = poly[i], q = poly[(i + 1) % n], dx = q[0] - p[0], dy = q[1] - p[1], l = Math.hypot(dx, dy); return [sign * dy / l, -sign * dx / l]; };
  let s = `<svg viewBox="0 46 600 490" width="680" height="555">${A.extras || ""}`;
  if (answers) s += `<polygon points="${poly.map(p => p.join(",")).join(" ")}" fill="none" stroke="#000" stroke-width="6" stroke-linejoin="round"/>`;
  poly.forEach((p, i) => {
    const a = normal((i + n - 1) % n), b = normal(i);
    let nx = a[0] + b[0], ny = a[1] + b[1]; const l = Math.hypot(nx, ny) || 1; nx /= l; ny /= l;
    s += `<circle cx="${p[0]}" cy="${p[1]}" r="9" fill="#000"/>`;
    if (i === 0) s += `<circle cx="${p[0]}" cy="${p[1]}" r="19" fill="none" stroke="#000" stroke-width="3"/>`;   // a ring round dot 1 shows where to start
    const off = i === 0 ? 46 : 38;
    s += `<text x="${(p[0] + nx * off).toFixed(1)}" y="${(p[1] + ny * off + 12).toFixed(1)}" font-size="34" font-weight="bold" text-anchor="middle" fill="#000">${i + 1}</text>`;
  });
  return s + `</svg>`;
}

// ---------- count and colour ----------
// Groups of 1 to 10 things, each with an empty box beside it. A.kinds are the things (one per group), A.colourKind is the thing in the bottom line.
function countColourSvg(G, A) {
  const rng = mulberry32(A.seed), rowH = 128;
  const groups = shuffled([1, 2, 3, 4, 5, 6, 7, 8, 9, 10], rng).slice(0, A.kinds.length).map((n, i) => ({ n, kind: A.kinds[i] }));
  const colourN = 3 + Math.floor(rng() * 4), H = groups.length * rowH + 140;
  let s = `<svg viewBox="0 0 720 ${H}" width="720" height="${H}">`;
  groups.forEach((g, i) => {
    const cy = i * rowH + rowH / 2;
    const twoRows = g.n > 5, k = twoRows ? 1.15 : 1.58, step = twoRows ? 98 : 104, x0 = 66;
    for (let j = 0; j < g.n; j++) {
      const col = j % 5, row = Math.floor(j / 5), rowShift = twoRows ? (row ? 31 : -31) : 0;
      s += iconAt(G, g.kind, x0 + col * step, cy + rowShift, k);
    }
    s += `<rect x="566" y="${cy - 47}" width="134" height="94" rx="14" fill="#fff" stroke="#000" stroke-width="5"/>`;
    if (i < groups.length - 1) s += `<line x1="20" y1="${(i + 1) * rowH}" x2="700" y2="${(i + 1) * rowH}" stroke="#000" stroke-width="2" stroke-dasharray="3 9" stroke-linecap="round"/>`;
  });
  const by = groups.length * rowH;
  s += `<text x="360" y="${by + 42}" font-size="34" font-weight="bold" text-anchor="middle" fill="#000">Colour ${colourN} ${A.colourName}.</text>`;
  for (let i = 0; i < 8; i++) s += iconAt(G, A.colourKind, 56 + i * 87, by + 98, 1.38);
  return { svg: s + `</svg>`, groups };
}
// The answers: each group's picture and its number.
function countAnswerSvg(G, groups) {
  let s = `<svg viewBox="0 0 700 116" width="700" height="116">`;
  groups.forEach((g, i) => {
    const x = 70 + i * 140;
    s += iconAt(G, g.kind, x, 28, .8) + `<rect x="${x - 34}" y="58" width="68" height="48" rx="10" fill="#fff" stroke="#000" stroke-width="3"/><text x="${x}" y="95" font-size="36" font-weight="bold" text-anchor="middle" fill="#000">${g.n}</text>`;
  });
  return s + `</svg>`;
}

// ---------- pattern trains ----------
// Five trains of six cars, getting a little harder down the page: AB, AB (new shapes), AAB, ABB, ABC.
// The pattern shows on the first four cars and the child draws what comes next on the last two.
function patternTrainSvg(G, A, answers) {
  const rng = mulberry32(A.seed), pool = shuffled(["circle", "square", "triangle", "star", "heart"], rng);
  const rows = [
    { shapes: [pool[0], pool[1]], seq: [0, 1, 0, 1, 0, 1] },             // AB
    { shapes: [pool[2], pool[3]], seq: [0, 1, 0, 1, 0, 1] },             // AB (different shapes)
    { shapes: [pool[4], pool[0]], seq: [0, 0, 1, 0, 0, 1] },             // AAB
    { shapes: [pool[1], pool[2]], seq: [0, 1, 1, 0, 1, 1] },             // ABB
    { shapes: [pool[3], pool[4], pool[0]], seq: [0, 1, 2, 0, 1, 2] }     // ABC
  ];
  const rowH = 148, H = rows.length * rowH + 22, engine = G.pictures.engineSimple;
  let s = `<svg viewBox="0 0 720 ${H}" width="720" height="${H}">`;
  rows.forEach((row, r) => {
    const y0 = r * rowH + 34;
    s += `<path d="M0 ${y0 + 82} H720" fill="none" stroke="#000" stroke-width="4"/>`;
    for (let i = 0; i < 6; i++) {
      const x = 8 + i * 96;
      s += `<g fill="#fff" stroke="#000" stroke-width="4" stroke-linejoin="round" stroke-linecap="round"><rect x="${x + 2}" y="${y0 + 6}" width="88" height="56" rx="8"/><circle cx="${x + 22}" cy="${y0 + 68}" r="12"/><circle cx="${x + 70}" cy="${y0 + 68}" r="12"/>`;
      if (i < 5) s += `<path d="M${x + 90} ${y0 + 52} h6" fill="none"/>`;
      if (i >= 4 && !answers) s += `<rect x="${x + 14}" y="${y0 + 14}" width="64" height="40" rx="8" fill="none" stroke-dasharray="6 6" stroke-width="3"/>`;
      s += `</g>`;
      if (i < 4 || answers) s += iconAt(G, row.shapes[row.seq[i]], x + 46, y0 + 34, .75);
    }
    s += `<path d="M578 ${y0 + 52} H593" fill="none" stroke="#000" stroke-width="4" stroke-linecap="round"/>` + place(engine, 586, y0 - 14, 124, 2.6);
  });
  return s + `</svg>`;
}

// ---------- activity pages ----------
// Each kind of puzzle page is one builder. It gets the grade and that page's data (G.activities[name]) and returns
// { body: the page, answer: { label, html }: its piece of the answers page }.
// A grade chooses its pages, in order, with G.activities.pages (for example ["maze", "dotToDot", "countColour"]).
const ACTIVITY_BUILDERS = {
  wordSearch(G, A) {
    const ws = makeWordSearch(A.words, 12, A.seed);
    return {
      body: `<h2 class="pt">Word Search</h2><p class="pi">Find all ten words. They go across, down, and slanting down to the right. Circle each one.</p>
        <div class="puz">${wordSearchSvg(ws, 50, false)}<div class="wl">${A.words.map(w => `<span>${w}</span>`).join("")}</div></div>`,
      answer: { label: "Word Search", html: wordSearchSvg(ws, 27, true) }
    };
  },
  crossword(G, A) {
    const cw = makeCrossword(A.entries, A.seed, 9, 13);
    const cell = Math.min(44, Math.floor(700 / cw.cols), Math.floor(470 / cw.rows));
    const ansCell = Math.min(26, Math.floor(340 / cw.cols), Math.floor(330 / cw.rows));
    return {
      body: `<h2 class="pt">Crossword</h2><p class="pi">Read each clue and write the answer in the squares. The number in the corner tells you which clue.</p>
        <div class="puz">${crosswordSvg(cw, cell, false)}${clueLists(cw)}</div>`,
      answer: { label: "Crossword", html: crosswordSvg(cw, ansCell, true) }
    };
  },
  maze(G, A) {
    const maze = makeMaze(A.cols || 14, A.rows || 18, A.seed);
    return {
      body: `<h2 class="pt">${A.title}</h2><p class="pi">${A.instruction}</p><div class="puz">${mazeSvg(G, maze, false)}</div>`,
      answer: { label: "Maze", html: resize(mazeSvg(G, maze, true), A.answerWidth || 380) }
    };
  },
  dotToDot(G, A) {
    const n = A.points.length;
    return {
      body: `<h2 class="pt">Dot to Dot</h2><p class="pi">Join the dots from 1 to ${n}. Then join back to 1.</p><div class="puz">${dotToDotSvg(A, false)}</div>`,
      answer: { label: "Dot to Dot", html: resize(dotToDotSvg(A, true), 295) }
    };
  },
  countColour(G, A) {
    const c = countColourSvg(G, A);
    return {
      body: `<h2 class="pt">Count and Colour</h2><p class="pi">Count each group. Write how many in the box.</p><div class="puz">${c.svg}</div>`,
      answer: { label: "Count and Colour", html: countAnswerSvg(G, c.groups) }
    };
  },
  patternTrain(G, A) {
    return {
      body: `<h2 class="pt">Pattern Trains</h2><p class="pi">What comes next? Draw it on the empty cars.</p><div class="puz">${patternTrainSvg(G, A, false)}</div>`,
      answer: { label: "Pattern Trains", html: resize(patternTrainSvg(G, A, true), 340) }
    };
  },
  // A code key (each letter is a number) and true facts from the game written in numbers. The child writes the letter above each number.
  secretCode(G, A) {
    const rng = mulberry32(A.seed), numbers = shuffled(Array.from({ length: 26 }, (_, i) => i + 1), rng), codeOf = ch => numbers[ABC.indexOf(ch)];
    const needed = Array.from(new Set(A.facts.join("").replace(/ /g, "").split(""))).sort();
    const key = needed.map(ch => `<div class="kc"><b>${ch}</b><i>${codeOf(ch)}</i></div>`).join("");
    const facts = A.facts.map(f => `<div class="code-fact">${f.split(" ").map(w => `<span class="cw">${w.split("").map(ch => `<span class="cc"><u></u><i>${codeOf(ch)}</i></span>`).join("")}</span>`).join("")}</div>`).join("");
    return {
      body: `<h2 class="pt">Secret Code</h2><p class="pi">Use the key to find each letter. Write the letter in the box above its number.</p>
        <div class="puz"><div class="key">${key}</div>${facts}</div>`,
      answer: { label: "Secret Code", html: `<div class="dec">${A.facts.map(f => `<p>${f}.</p>`).join("")}</div>` }
    };
  }
};
// The answers are a page of their own for grown-ups (reached from the grown-ups panel on the shelf, with ?answers=1). A child's printout has no answers in it.
function activityPages(G, bookName, answersOnly) {
  const A = G.activities, built = A.pages.map(name => ACTIVITY_BUILDERS[name](G, A[name]));
  const answers = `<h2 class="pt">Answer Sheet</h2><div class="puz"><div class="ans-wrap">${built.map(b => `<div class="ans-box">${b.answer.label}${b.answer.html}</div>`).join("")}</div></div>`;
  return (answersOnly ? [answers] : built.map(b => b.body)).map((body, i) => sheet(G, bookName, i + 1, body));
}

// ---------- showing the pages ----------
// US Letter is 816 by 1056 pixels. On a narrow screen every sheet is shrunk to fit, so nothing scrolls sideways.
function fitSheets() {
  const s = Math.min(1, (document.documentElement.clientWidth - 16) / 816);
  document.querySelectorAll(".sheetwrap").forEach(w => {
    w.style.width = (816 * s) + "px"; w.style.height = (1056 * s) + "px";
    w.firstElementChild.style.transform = "scale(" + s + ")";
  });
}
function start(kind) {
  const Q = new URLSearchParams(location.search), id = Q.get("g") || "g3", G = BOOK[id], root = document.getElementById("sheets"), answers = kind === "activities" && Q.get("answers") === "1";
  // the grade switcher in the top bar: one link for every grade in BOOK, the current one marked
  const nav = document.getElementById("grades");
  if (nav) nav.innerHTML = Object.keys(BOOK).sort((a, b) => (BOOK[a].order || 0) - (BOOK[b].order || 0))
    .map(k => `<a href="?g=${k}${answers ? "&answers=1" : ""}"${k === id ? ' class="on" aria-current="page"' : ""}>${BOOK[k].gradeLabel}</a>`).join("");
  if (!G) { root.innerHTML = '<p style="text-align:center;padding:40px;font-size:20px">That book is not ready yet.</p>'; return; }
  const name = kind === "colouring" ? "Colouring Book" : answers ? "Activity Book Answers" : "Activity Book";
  document.title = name + ": " + G.story;
  document.getElementById("barTitle").textContent = name + ": " + G.gradeLabel;
  root.innerHTML = (kind === "colouring" ? colouringPages(G, name) : activityPages(G, name, answers)).join("");
  fitSheets(); window.addEventListener("resize", fitSheets);
}

// =====================================================================
// THE BOOKS, ONE ENTRY PER GRADE
// Each grade says: its story and grade names, `order` (where it sits in the switcher), `lineWidth` (the colouring line
// thickness on a 400 wide drawing: thick for little ones, thin for older children), its `pictures`, its three `colouring`
// scenes, and its `activities` (the list of `pages` and the data each page needs).
// =====================================================================
const BOOK = {};
const innerOf = svg => svg.replace(/^\s*<svg[^>]*>|<\/svg>\s*$/g, "");
const bumps = (n, f) => Array.from({ length: n }, (_, i) => f(i)).join("");

// ---------- shared drawings: the animal faces, copied from dots-busy-train.html ----------
// Copied from pD, pE, pM and PASSENGER_ART (panda, bear and pig faces) in dots-busy-train.html.
const pD = "#2b2d42", pE = (y = 52) => `<circle cx="36" cy="${y}" r="4.5" fill="${pD}"/><circle cx="64" cy="${y}" r="4.5" fill="${pD}"/>`;
const pM = d => `<path d="${d}" fill="none" stroke="${pD}" stroke-width="3" stroke-linecap="round"/>`;
// The game paints the panda's ears, eye patches and nose dark. In a colouring book only pupils stay solid, so those become outlines:
// the two white dots in the patches turn into black pupils, and every other dark colour becomes white.
const FACE_PANDA = `<svg viewBox="0 0 100 100"><circle cx="22" cy="24" r="13" fill="${pD}"/><circle cx="78" cy="24" r="13" fill="${pD}"/><circle cx="50" cy="56" r="35" fill="#f4f4f8" stroke="#cfd3e0" stroke-width="2"/><ellipse cx="34" cy="52" rx="9" ry="11" fill="${pD}"/><ellipse cx="66" cy="52" rx="9" ry="11" fill="${pD}"/><circle cx="35" cy="51" r="3.5" fill="#fff"/><circle cx="65" cy="51" r="3.5" fill="#fff"/><ellipse cx="50" cy="65" rx="6" ry="4" fill="${pD}"/>${pM("M44 72q6 5 12 0")}</svg>`.replace(/fill="#fff"/g, 'fill="#000000"');
const FACE_BEAR = `<svg viewBox="0 0 100 100"><circle cx="22" cy="24" r="13" fill="#a0714f"/><circle cx="78" cy="24" r="13" fill="#a0714f"/><circle cx="22" cy="24" r="6" fill="#d9a37a"/><circle cx="78" cy="24" r="6" fill="#d9a37a"/><circle cx="50" cy="56" r="34" fill="#a0714f"/><ellipse cx="50" cy="68" rx="15" ry="12" fill="#f3d2a6"/>${pE()}<ellipse cx="50" cy="63" rx="6" ry="4.5" fill="#fff"/>${pM("M50 67v5M43 73q7 5 14 0")}</svg>`;
const FACE_PIG = `<svg viewBox="0 0 100 100"><path d="M18 18L42 26L24 44z" fill="#ff9eb5"/><path d="M82 18L58 26L76 44z" fill="#ff9eb5"/><circle cx="50" cy="54" r="34" fill="#ffb3c1"/>${pE(46)}<ellipse cx="50" cy="64" rx="15" ry="11" fill="#ff8fa3"/></svg>`;
const FACES = {
  panda: { svg: FACE_PANDA, black: ["#000000"] },
  bear: { svg: FACE_BEAR, black: [pD], drop: [/<circle cx="(?:22|78)" cy="24" r="6" fill="#d9a37a"\/>/g] },
  pig: { svg: FACE_PIG, black: [pD] }
};

// ---------- Grade 3: Dr. Somebody in Ancient China ----------
// The pictures below are copied from the game and shared files. outline() turns each one into a colouring outline.
// `black` lists fills that stay black (eye pupils), `drop` lists tiny details to cut out, `extra` adds more detail drawn
// on top of the game's picture for the older children, and `mask` is a white shape behind it that hides lines from behind.

// Copied from owl() in shared/story.js: Dr. Somebody. The hat is HOST in grade3-china.html (a pointed straw hat drawn in front).
const owlSvg = (behind, front) => `<svg viewBox="0 0 200 160"><ellipse cx="84" cy="152" rx="12" ry="5" fill="#ff9f43"/><ellipse cx="116" cy="152" rx="12" ry="5" fill="#ff9f43"/>
  <ellipse cx="100" cy="108" rx="44" ry="46" fill="#9c6b3f"/><ellipse cx="100" cy="116" rx="26" ry="32" fill="#f3dfb8"/>
  <path d="M58 92 Q52 130 66 150 L88 150 Q74 120 80 84 Z" fill="#fff"/><path d="M142 92 Q148 130 134 150 L112 150 Q126 120 120 84 Z" fill="#fff"/>
  <ellipse cx="54" cy="108" rx="10" ry="24" fill="#7a4f2a" transform="rotate(12 54 108)"/><ellipse cx="146" cy="108" rx="10" ry="24" fill="#7a4f2a" transform="rotate(-12 146 108)"/>
  ${behind || ""}<polygon points="62,34 70,6 88,26" fill="#7a4f2a"/><polygon points="138,34 130,6 112,26" fill="#7a4f2a"/>
  <ellipse cx="100" cy="50" rx="44" ry="36" fill="#9c6b3f"/><rect x="58" y="43" width="84" height="8" fill="#39405a"/>
  <circle cx="80" cy="48" r="19" fill="#d9a400"/><circle cx="120" cy="48" r="19" fill="#d9a400"/><circle cx="80" cy="48" r="14" fill="#fff"/><circle cx="120" cy="48" r="14" fill="#fff"/>
  <circle class="blink" cx="83" cy="50" r="6" fill="#2b2d42"/><circle class="blink" cx="117" cy="50" r="6" fill="#2b2d42"/><polygon points="92,63 108,63 100,77" fill="#ff9f43"/>${front || ""}</svg>`;
const CHINA_HAT = `<polygon points="50,32 100,-8 150,32" fill="#e8c26a"/><ellipse cx="100" cy="32" rx="54" ry="7" fill="#c99a3e"/>`;

// Copied from tier() and PAGODA in grade3-china.html.
const tier = (y, w) => `<path d="M${42 - w} ${y + 16} Q50 ${y - 6} ${58 + w} ${y + 16} L${50 + w} ${y + 22} L${50 - w} ${y + 22} Z" fill="#c0392b"/><rect x="${54 - w}" y="${y + 22}" width="${2 * w - 8}" height="16" fill="#f6e3c5"/>`;
const PAGODA = `<svg class="pagoda" viewBox="0 0 100 140"><line x1="50" y1="0" x2="50" y2="14" stroke="#c0392b" stroke-width="3"/>${tier(8, 14)}${tier(44, 22)}${tier(80, 30)}<rect x="16" y="118" width="68" height="8" fill="#8d6e63"/></svg>`;
// More detail for Grade 3: roof tile lines on every roof, a window in each storey and a doorway.
const PAGODA_EXTRA = [[8, 14], [44, 22], [80, 30]].map(([y, w]) => [.3, .5, .7].map(t => {
  const x = (1 - t) * (1 - t) * (42 - w) + 2 * t * (1 - t) * 50 + t * t * (58 + w), yc = (1 - t) * (1 - t) * (y + 16) + 2 * t * (1 - t) * (y - 6) + t * t * (y + 16);
  return `<path d="M${x.toFixed(1)} ${yc.toFixed(1)} L${x.toFixed(1)} ${y + 22}" fill="none"/>`;
}).join("")).join("") + `<rect x="46" y="33" width="8" height="10" rx="3"/><rect x="38" y="69" width="8" height="10" rx="3"/><rect x="54" y="69" width="8" height="10" rx="3"/><rect x="30" y="105" width="8" height="10" rx="3"/><rect x="62" y="105" width="8" height="10" rx="3"/><path d="M43 118 V110 Q50 100 57 110 V118" />`;
const PAGODA_MASK = "50,0 55,12 72,26 66,36 80,58 72,70 88,94 82,104 84,118 84,126 16,126 16,118 18,104 12,94 28,70 20,58 34,36 28,26 45,12";

// Copied from BALLOON in shared/story.js: the clock balloon.
const BALLOON = `<svg viewBox="0 0 160 200"><path d="M80 6 C28 6 14 50 20 82 C26 112 56 132 80 140 C104 132 134 112 140 82 C146 50 132 6 80 6 Z" fill="#ff5a5f"/>
  <path d="M80 6 C58 20 50 60 56 96 C60 118 72 134 80 140 C88 134 100 118 104 96 C110 60 102 20 80 6 Z" fill="#ffd23f"/>
  <circle cx="80" cy="70" r="34" fill="#fff" stroke="#39405a" stroke-width="5"/>
  <g stroke="#39405a" stroke-width="4" stroke-linecap="round"><line x1="80" y1="42" x2="80" y2="48"/><line x1="80" y1="92" x2="80" y2="98"/><line x1="52" y1="70" x2="58" y2="70"/><line x1="102" y1="70" x2="108" y2="70"/></g>
  <line x1="80" y1="70" x2="80" y2="50" stroke="#39405a" stroke-width="5" stroke-linecap="round"/><line x1="80" y1="70" x2="97" y2="79" stroke="#ff5a5f" stroke-width="4" stroke-linecap="round"/><circle cx="80" cy="70" r="4" fill="#39405a"/>
  <line x1="56" y1="130" x2="62" y2="162" stroke="#c9a37a" stroke-width="3"/><line x1="104" y1="130" x2="98" y2="162" stroke="#c9a37a" stroke-width="3"/>
  <circle cx="80" cy="154" r="13" fill="#9c6b3f"/><circle cx="75" cy="152" r="5" fill="#fff"/><circle cx="85" cy="152" r="5" fill="#fff"/><circle cx="75" cy="152" r="2" fill="#2b2d42"/><circle cx="85" cy="152" r="2" fill="#2b2d42"/>
  <rect x="56" y="160" width="48" height="32" rx="7" fill="#c48a4a"/><rect x="56" y="160" width="48" height="7" rx="3" fill="#9c6830"/></svg>`;
// More detail for Grade 3: panel seams, a band of diamonds, twelve clock ticks, two more ropes, a woven basket.
const BALLOON_EXTRA = `<path d="M80 6 C36 20 24 90 80 140 M80 6 C124 20 136 90 80 140" fill="none"/><path d="M26 98 Q80 118 134 98" fill="none"/>`
  + bumps(12, i => { const a = i * Math.PI / 6, c = Math.cos(a), s = Math.sin(a); return `<line x1="${(80 + 25 * c).toFixed(1)}" y1="${(70 + 25 * s).toFixed(1)}" x2="${(80 + 30 * c).toFixed(1)}" y2="${(70 + 30 * s).toFixed(1)}"/>`; })
  + `<path d="M70 134 L72 160 M90 134 L88 160" fill="none"/><path d="M64 167 V192 M72 167 V192 M80 167 V192 M88 167 V192 M96 167 V192 M56 179 H104" fill="none"/>`;

// Copied from CHINA_ART.bamboo in grade3-china.html. Grade 3 adds a joint across each stalk and leaves.
const BAMBOO = `<svg viewBox="0 0 80 140"><g fill="#58b368"><rect x="14" y="10" width="10" height="130" rx="4"/><rect x="40" y="30" width="9" height="110" rx="4"/><rect x="60" y="0" width="8" height="140" rx="4"/></g><g fill="#2f7d44"><rect x="14" y="50" width="10" height="3"/><rect x="14" y="94" width="10" height="3"/><rect x="40" y="70" width="9" height="3"/><rect x="60" y="40" width="8" height="3"/><rect x="60" y="90" width="8" height="3"/></g><path d="M24 30 Q40 20 44 34" stroke="#58b368" stroke-width="5" fill="none"/></svg>`;
const leaf = (x, y, ang, len) => `<path d="M0 0 Q${len * .5} ${-len * .3} ${len} 0 Q${len * .5} ${len * .22} 0 0 Z" transform="translate(${x} ${y}) rotate(${ang})"/>`;
const BAMBOO_EXTRA = [[14, 24, 40, 70, 100, 128], [40, 9, 55, 85, 115], [60, 8, 25, 55, 85, 115]].map(([x, w, ...ys]) => ys.map(y => `<path d="M${x - 1} ${y} H${x + w + 1}" fill="none"/>`).join("")).join("")
  + leaf(24, 52, -25, 26) + leaf(14, 82, 205, 24) + leaf(49, 70, -28, 26) + leaf(40, 100, 200, 24) + leaf(68, 40, -20, 22) + leaf(60, 70, 205, 22) + leaf(68, 100, -22, 22) + leaf(24, 122, -30, 22);

// A panda sitting down: a simple round body under the panda face copied from dots-busy-train.html.
const PANDA_SITTING = `<svg viewBox="0 0 100 150"><ellipse cx="50" cy="112" rx="34" ry="34" fill="#fff"/><ellipse cx="22" cy="106" rx="10" ry="20" fill="#fff" transform="rotate(15 22 106)"/><ellipse cx="78" cy="106" rx="10" ry="20" fill="#fff" transform="rotate(-15 78 106)"/><ellipse cx="32" cy="140" rx="14" ry="8" fill="#fff"/><ellipse cx="68" cy="140" rx="14" ry="8" fill="#fff"/><ellipse cx="50" cy="116" rx="20" ry="20" fill="#fff"/>${innerOf(FACE_PANDA)}</svg>`;

// The game only shows lanterns and kites as emoji, so these two are drawn in the same bold style, with patterns for the older children.
const LANTERN = `<svg viewBox="-24 0 48 90"><ellipse cx="0" cy="32" rx="21" ry="24" fill="#e63946"/><path d="M-16 18 Q0 25 16 18 M-20 32 Q0 40 20 32 M-16 46 Q0 53 16 46" fill="none"/><path d="M0 8 Q-10 32 0 56 M0 8 Q10 32 0 56 M0 8 V56" fill="none"/><rect x="-9" y="3" width="18" height="7" fill="#d4a017"/><rect x="-9" y="54" width="18" height="7" fill="#d4a017"/><path d="M0 61 V78 M-5 61 L-7 76 M5 61 L7 76" fill="none"/><path d="M-8 78 H8 L5 88 H-5 Z" fill="#d4a017"/></svg>`;
const KITE = `<svg viewBox="0 0 60 152"><polygon points="30,0 58,30 30,70 2,30" fill="#ffd23f"/><path d="M30 0 V70 M2 30 H58" fill="none"/><path d="M30 14 L46 30 L30 54 L14 30 Z" fill="#e63946"/><path d="M30 70 Q14 82 30 94 Q46 106 30 118 Q14 130 30 144" fill="none"/><path d="M30 94 L39 88 V100 Z M30 94 L21 88 V100 Z M30 118 L39 112 V124 Z M30 118 L21 112 V124 Z M30 142 L39 136 V148 Z M30 142 L21 136 V148 Z" fill="#e63946"/></svg>`;

BOOK.g3 = {
  story: "Dr. Somebody in Ancient China",
  gradeLabel: "Grade 3",
  order: 3,
  lineWidth: 2.3,
  pictures: {
    owl: { svg: owlSvg("", CHINA_HAT), viewBox: "0 -12 200 172", black: ["#2b2d42"], drop: [/<circle cx="(?:80|120)" cy="48" r="14" fill="#fff"\/>/g] },   // eye whites cut out so the eyes are not crowded
    balloon: { svg: BALLOON, extra: BALLOON_EXTRA, drop: [/<g stroke="#39405a" stroke-width="4"[^>]*>[\s\S]*?<\/g>/, /<circle cx="\d+" cy="15[24]"[^>]*\/>/g] },   // the four clock ticks and the little face in the basket are cut out (the extra detail replaces them)
    pagoda: { svg: PAGODA, extra: PAGODA_EXTRA, mask: PAGODA_MASK },
    bamboo: { svg: BAMBOO, extra: BAMBOO_EXTRA, drop: [/<g fill="#2f7d44">[\s\S]*?<\/g>/] },
    panda: { svg: PANDA_SITTING, black: ["#000000"] },
    lantern: { svg: LANTERN },
    kite: { svg: KITE }
  },
  colouring: [
    { // Page 1: Dr. Somebody beside his clock balloon with a panda in the bamboo (owl, balloon, bamboo, panda)
      caption: "Dr. Somebody and his balloon are ready to fly!",
      scene: (P, S) => [
        S.sun(336, 52, 22), S.cloud(98, 56, 1.05), S.cloud(234, 88, .78),
        S.bird(168, 50), S.bird(196, 62),
        S.peak(-15, 166, 175, 108), S.peak(118, 146, 195, 126), S.peak(260, 170, 160, 102),
        S.hill("M-20 264 Q60 226 140 256 T300 240 T420 252"),
        S.hill("M-20 306 Q110 268 225 298 T420 282"),
        S.shape(`<path d="M36 286 q8 -7 16 0 M76 293 q8 -7 16 0 M164 282 q8 -7 16 0 M228 294 q8 -7 16 0" fill="none"/>`),
        P("bamboo", 252, 130, 74), P("bamboo", 308, 146, 62),
        S.hill("M-20 368 Q120 348 240 366 T420 354"),
        S.shape(`<ellipse cx="164" cy="408" rx="16" ry="6"/><ellipse cx="196" cy="422" rx="19" ry="7"/><ellipse cx="234" cy="436" rx="22" ry="7"/>`),
        P("balloon", 18, 148, 158), P("owl", 174, 286, 114), P("panda", 294, 284, 78),
        S.tuft(46, 420), S.tuft(114, 434), S.tuft(274, 432), S.tuft(358, 430), S.tuft(88, 392),
        S.flower(34, 434, .48, 14), S.flower(372, 412, .45, 14)
      ].join("")
    },
    { // Page 2: the Great Wall over layered mountains with a watchtower, a path, the pagoda and the balloon above (pagoda, balloon, owl)
      caption: "The Great Wall winds over the mountains.",
      scene: (P, S) => {
        // the top edge of the wall has real battlements: a block, a gap, a block, a gap
        let top = "M-30 322 V284"; for (let x = -30; x < 430; x += 24) top += " V274 h14 V284 h10"; top += " V322 Z";
        let bricks = "M-30 297 H430 M-30 309.5 H430";
        for (let x = -30; x < 430; x += 20) bricks += ` M${x} 284 V297 M${x} 309.5 V322 M${x + 10} 297 V309.5`;
        let tower = "M155 326 V231"; for (let x = 155; x < 235; x += 20) tower += " V221 h12 V231 h8"; tower += " V326 Z";
        let towerBricks = ""; [244, 262, 280, 298, 316].forEach((y, i) => { towerBricks += `M155 ${y} H235 `; for (let x = 155 + (i % 2) * 10 + 10; x < 235; x += 20) towerBricks += `M${x} ${y - 18 < 231 ? 231 : y - 18} V${y} `; });
        return [
          S.sun(60, 56, 20),
          S.shape(`<path d="M-20 251 L35 181 L80 226 L140 148 L215 238 L275 174 L340 221 L420 161 V346 H-20 Z"/>`),
          S.shape(`<path d="M140 148 L150 181 L136 206 M275 174 L284 204 L270 226 M35 181 L42 206" fill="none"/><path d="M127 168 L140 148 L153 168 L146 174 L140 166 L134 175 Z M263 192 L275 174 L287 192 L281 197 L275 189 L269 198 Z"/>`),
          S.shape(`<path d="M-20 291 L50 221 L105 271 L175 206 L255 278 L320 231 L420 286 V356 H-20 Z"/>`),
          S.shape(`<path d="M175 206 L186 231 L172 254 M50 221 L58 246 M320 231 L330 256 L318 274" fill="none"/>`),
          S.cloud(126, 64, .7), S.cloud(330, 56, .95),
          P("balloon", 162, 34, 76),
          S.bird(264, 96), S.bird(292, 114), S.bird(58, 118),
          S.hill("M-20 312 Q100 296 200 308 T420 300"),
          `<g transform="rotate(-3 200 306)">${S.shape(`<path d="${top}"/>`)}${S.shape(`<path d="${bricks}" fill="none"/>`, 1.3)}</g>`,
          S.shape(`<path d="${tower}"/>`), S.shape(`<path d="${towerBricks}" fill="none"/>`, 1.3),
          S.shape(`<rect x="170" y="186" width="50" height="45"/><rect x="178" y="200" width="10" height="16" rx="4"/><rect x="202" y="200" width="10" height="16" rx="4"/><path d="M156 190 Q195 160 234 190 L224 198 H166 Z"/><path d="M170 188 L174 197 M184 180 L186 193 M195 177 V192 M206 180 L204 193 M220 188 L216 197" fill="none"/><path d="M195 175 V158" fill="none"/><circle cx="195" cy="155" r="3.5"/>`),
          S.shape(`<path d="M180 326 V300 Q195 278 210 300 V326 Z"/><rect x="164" y="252" width="12" height="18" rx="5"/><rect x="214" y="252" width="12" height="18" rx="5"/>`),
          S.hill("M-20 354 Q100 338 200 354 T420 342"),
          S.shape(`<path d="M114 462 C92 422 190 412 168 378 C150 350 188 342 180 326 L210 326 C220 346 195 352 212 374 C238 408 152 418 176 462 Z"/><path d="M182 342 H208 M174 360 H205 M182 380 H212 M162 400 H196 M136 422 H174 M126 442 H166" fill="none"/>`),
          S.pine(344, 336, .82), S.pine(302, 344, .65),
          S.bush(250, 376, .95), S.bush(96, 392, .85), S.bush(366, 396, .7),
          P("pagoda", 26, 224, 92), P("owl", 282, 366, 76),
          S.tuft(46, 434), S.tuft(234, 436), S.flower(68, 422, .45, 14)
        ].join("");
      }
    },
    { // Page 3: the festival: patterned lanterns and kites, fireworks, stars, pagoda and stone courtyard (lantern, kite, pagoda, owl)
      caption: "Lanterns glow and kites soar at the festival.",
      scene: (P, S) => {
        const sag = x => 24 + 104 * ((x % 200) / 200) * (1 - (x % 200) / 200);       // how far down the string hangs at x
        let tiles = "";
        for (let x = 20; x < 390; x += 48) tiles += `M${x} 404 L${x - 12} 454 `;
        return [
          S.cloud(106, 276, .58), S.cloud(294, 276, .52),
          S.burst(200, 126, 30), S.burst(146, 174, 18), S.burst(258, 180, 15),
          S.sparkle(36, 118, 9), S.sparkle(364, 118, 9), S.sparkle(246, 146, 7), S.sparkle(42, 184, 7), S.sparkle(358, 192, 7), S.sparkle(162, 102, 6),
          S.hill("M-20 378 Q100 356 200 374 T420 364"),
          // patterned stone festival courtyard across the bottom so the page feels full and grounded
          S.shape(`<path d="M-10 404 H410 V460 H-10 Z"/><path d="M-10 426 H410 ${tiles}" fill="none"/>`, 1.8),
          S.shape(`<path d="M-5 24 Q100 76 200 24 Q300 76 405 24" fill="none"/>`),
          [42, 95, 148, 200, 252, 305, 358].map(x => P("lantern", x - 12, sag(x) - 1, 24)).join(""),
          // two festival lantern poles with carved bases, set cleanly inside the margins
          S.shape(`<path d="M46 238 V396 M354 238 V396 M34 246 H58 M342 246 H366" fill="none"/><rect x="34" y="388" width="24" height="14" rx="3"/><rect x="342" y="388" width="24" height="14" rx="3"/>`),
          P("lantern", 24, 246, 44), P("lantern", 332, 246, 44),
          P("kite", 284, 102, 56), P("kite", 66, 108, 52),
          P("pagoda", 136, 206, 124), P("owl", 248, 316, 82),
          S.flower(96, 392, .45, 12), S.flower(122, 396, .4, 10)
        ].join("");
      }
    },
    { // Page 4: Dr. Somebody's balloon soaring high over the Great Wall, seen from above, winding away over the hills
      caption: "The balloon soars over the Great Wall!",
      scene: (P, S) => {
        // draw one winding ribbon of the Great Wall with stone paving lines across the walkway and battlements on top
        const wallBand = (ptsTop, ptsBot, step, cren) => {
          const top = ptsTop.map(p => p.join(",")).join(" "), bot = ptsBot.slice().reverse().map(p => p.join(",")).join(" ");
          let rungs = "", merlons = "";
          for (let i = 0; i < ptsTop.length - 1; i++) {
            const n = step || 3;
            for (let k = 1; k < n; k++) {
              const t = k / n;
              const x1 = ptsTop[i][0] + (ptsTop[i + 1][0] - ptsTop[i][0]) * t, y1 = ptsTop[i][1] + (ptsTop[i + 1][1] - ptsTop[i][1]) * t;
              const x2 = ptsBot[i][0] + (ptsBot[i + 1][0] - ptsBot[i][0]) * t, y2 = ptsBot[i][1] + (ptsBot[i + 1][1] - ptsBot[i][1]) * t;
              rungs += `M${x1.toFixed(1)} ${y1.toFixed(1)} L${x2.toFixed(1)} ${y2.toFixed(1)} `;
            }
            if (cren) {
              const dx = ptsTop[i + 1][0] - ptsTop[i][0], dy = ptsTop[i + 1][1] - ptsTop[i][1], len = Math.hypot(dx, dy);
              const count = Math.max(2, Math.floor(len / 14));
              for (let k = 0; k < count; k++) {
                const t0 = (k + .18) / count, t1 = (k + .68) / count;
                const ax = ptsTop[i][0] + dx * t0, ay = ptsTop[i][1] + dy * t0, bx = ptsTop[i][0] + dx * t1, by = ptsTop[i][1] + dy * t1;
                merlons += `<polygon points="${ax.toFixed(1)},${ay.toFixed(1)} ${bx.toFixed(1)},${by.toFixed(1)} ${bx.toFixed(1)},${(by - cren).toFixed(1)} ${ax.toFixed(1)},${(ay - cren).toFixed(1)}"/>`;
              }
            }
          }
          return S.shape(merlons, 1.5) + S.shape(`<polygon points="${top} ${bot}"/>`) + S.shape(`<path d="${rungs}" fill="none"/>`, 1.4);
        };
        const towerAt = (x, y, s) => `<g transform="translate(${x} ${y}) scale(${s})">${S.shape(`<rect x="-18" y="-12" width="36" height="34"/><path d="M-20 -12 V-18 h8 V-12 h8 V-18 h8 V-12 h8 V-18 h8 V-12" fill="none"/><rect x="-12" y="-30" width="24" height="18"/><rect x="-7" y="-24" width="5" height="8" rx="2"/><rect x="2" y="-24" width="5" height="8" rx="2"/><path d="M-20 -28 Q0 -44 20 -28 L14 -24 H-14 Z"/><path d="M-18 2 H18 M-18 12 H18 M0 -12 V2 M-9 2 V12 M9 2 V12" fill="none"/>`, 2.3 / s)}</g>`;
        return [
          S.sun(56, 52, 20),
          S.cloud(316, 54, .95), S.cloud(76, 144, .72), S.cloud(324, 152, .76),
          S.bird(278, 92), S.bird(302, 108), S.bird(92, 88),
          // sweeping distant mountain ridges seen from high in the sky
          S.shape(`<path d="M-20 264 L46 222 L116 254 L194 218 L274 246 L352 204 L420 236 V470 H-20 Z"/>`),
          S.shape(`<path d="M46 222 L56 246 M194 218 L204 246 M352 204 L360 232" fill="none"/>`, 1.6),
          S.hill("M-20 288 Q95 250 205 282 T420 270"),
          S.hill("M-20 338 Q130 302 260 338 T420 322"),
          S.hill("M-20 396 Q110 366 230 394 T420 378"),
          // far stretch of the Great Wall winding along the upper right ridge
          wallBand([[392, 236], [326, 250], [248, 260], [164, 276], [96, 294]], [[396, 246], [330, 261], [250, 272], [168, 289], [104, 308]], 3, 4),
          towerAt(318, 250, .55),
          // middle sweep of the wall curving back from left to right
          wallBand([[96, 294], [166, 312], [244, 330], [308, 356]], [[82, 312], [156, 332], [234, 352], [296, 380]], 4, 5.5),
          towerAt(96, 300, .75),
          // broad foreground curve sweeping down toward the lower left corner
          wallBand([[308, 356], [230, 388], [142, 416], [58, 456]], [[322, 384], [244, 418], [162, 448], [98, 466]], 4, 7),
          towerAt(296, 360, 1.05),
          // mountain pines scattered along the slopes, clear of the wall
          S.pine(44, 302, .52), S.pine(248, 296, .46), S.pine(364, 316, .58),
          S.pine(56, 380, .68), S.pine(118, 372, .55), S.pine(356, 420, .72), S.pine(252, 434, .62),
          // hero clock balloon floating high in the sky
          P("balloon", 126, 14, 148)
        ].join("");
      }
    },
    { // Page 5: a kite making table with paper, string, brushes and finished kites, and Dr. Somebody holding a kite
      caption: "Dr. Somebody makes a kite for the festival!",
      scene: (P, S) => {
        // an extra wide butterfly style kite hanging on the workshop wall for variety
        const wallKite = S.shape(`<g transform="translate(332 90)">
          <path d="M0 -24 Q24 -36 32 -12 Q36 8 12 10 Q28 24 14 34 Q0 38 0 18 Q0 38 -14 34 Q-28 24 -12 10 Q-36 8 -32 -12 Q-24 -36 0 -24 Z"/>
          <path d="M0 -24 V24 M-26 -8 Q0 0 26 -8" fill="none"/>
          <circle cx="-16" cy="-10" r="6"/><circle cx="16" cy="-10" r="6"/>
          <path d="M0 24 Q-10 42 4 58 Q14 72 0 88" fill="none"/>
          <path d="M4 58 L12 53 V63 Z M4 58 L-4 53 V63 Z M1 82 L9 77 V87 Z M1 82 L-7 77 V87 Z"/>
        </g>`, 2.1);
        return [
          // pavilion wall, timber beam, and a round moon window looking out onto hills and bamboo
          S.shape(`<path d="M-10 258 H410 M216 34 H382" fill="none"/>`),
          `<defs><clipPath id="moonWin"><circle cx="102" cy="108" r="66"/></clipPath></defs>`,
          S.shape(`<circle cx="102" cy="108" r="72"/><circle cx="102" cy="108" r="66"/>`),
          `<g clip-path="url(#moonWin)">${S.cloud(78, 76, .5)}${S.hill("M28 140 Q82 120 132 136 T180 128")}${P("bamboo", 114, 62, 42)}</g>`,
          S.shape(`<circle cx="102" cy="108" r="66" fill="none"/>`),
          // display pegs and two finished kites hanging on the right wall
          S.shape(`<circle cx="262" cy="34" r="4"/><circle cx="332" cy="34" r="4"/><path d="M262 34 V46 M332 34 V66" fill="none"/>`),
          P("kite", 238, 46, 48),
          wallKite,
          // Dr. Somebody standing beside the table holding a finished kite cleanly clear of the window
          P("owl", 22, 166, 126),
          S.shape(`<path d="M116 240 Q146 218 188 158" fill="none"/>`),
          P("kite", 164, 134, 48),
          // stone floor tiles behind the table legs
          S.shape(`<path d="M-10 412 H410 M-10 434 H410 M60 412 L48 456 M140 412 L134 456 M220 412 L222 456 M300 412 L310 456 M370 412 L384 456" fill="none"/>`, 1.6),
          // wooden craft table: stretcher bar first, then white filled legs so floor lines never show through
          S.shape(`<rect x="52" y="414" width="296" height="8"/><rect x="64" y="384" width="14" height="44"/><rect x="322" y="384" width="14" height="44"/><rect x="34" y="384" width="18" height="58"/><rect x="348" y="384" width="18" height="58"/>`),
          S.shape(`<polygon points="36,274 364,274 380,372 20,372"/><rect x="20" y="372" width="360" height="16" rx="3"/>`),
          // craft paper sheet with a half built diamond kite frame and bamboo sticks
          S.shape(`<polygon points="50,288 186,288 176,358 38,358"/><polygon points="114,295 154,322 110,352 70,322"/><path d="M114 295 L110 352 M70 322 L154 322" fill="none"/>`, 2.1),
          // ceramic brush pot with decorative band and three brushes fanning out
          S.shape(`<path d="M226 274 L214 234 L222 232 L233 274 M242 274 L242 226 L250 226 L250 274 M256 274 L268 236 L276 239 L263 274"/>`),
          S.shape(`<path d="M214 234 Q212 222 218 218 Q224 222 222 232 Z M242 226 Q246 212 250 226 Z M268 236 Q275 224 279 229 Q278 236 276 239 Z"/>`),
          S.shape(`<rect x="224" y="274" width="42" height="50" rx="6"/><ellipse cx="245" cy="274" rx="21" ry="6"/><path d="M224 292 H266 M224 308 H266 M228 300 q6 -5 12 0 t12 0 t10 0" fill="none"/>`, 2.1),
          // oval paint dish beside the brush pot
          S.shape(`<ellipse cx="216" cy="346" rx="22" ry="11"/><ellipse cx="216" cy="346" rx="13" ry="5"/>`, 2.1),
          // wooden spool of kite string with trailing thread
          S.shape(`<ellipse cx="290" cy="354" rx="18" ry="6"/><rect x="276" y="316" width="28" height="38"/><ellipse cx="290" cy="316" rx="18" ry="6"/><path d="M276 324 H304 M276 332 H304 M276 340 H304 M276 348 H304 M304 338 Q324 342 324 354 Q324 364 344 360" fill="none"/>`, 2.1),
          // stack of square kite paper and two paper tail bows ready to tie on
          S.shape(`<polygon points="312,282 354,282 360,304 318,304"/><polygon points="308,290 350,290 356,312 314,312"/><path d="M336 330 L348 324 V336 Z M336 330 L324 324 V336 Z M354 346 L366 340 V352 Z M354 346 L342 340 V352 Z"/>`, 2.1)
        ].join("");
      }
    }
  ],
  activities: {
    pages: ["wordSearch", "crossword", "maze", "secretCode"],
    wordSearch: { seed: 31, words: ["PANDA", "SILK", "KITE", "DRAGON", "LANTERN", "EMPEROR", "BAMBOO", "PAPER", "COMPASS", "RIVER"] },
    crossword: {
      seed: 7,
      entries: [   // each clue is based on a fact in the game, and agrees in number with its answer
        { word: "SILKWORM", clue: "A tiny creature that spins the thread for silk" },
        { word: "SOLDIER", clue: "A clay one was buried near an emperor's tomb" },
        { word: "PALACE", clue: "The huge home where the emperor lived" },
        { word: "ABACUS", clue: "A frame with sliding beads that helps you count" },
        { word: "CAMELS", clue: "Traders travelled with these animals along the Silk Road" },
        { word: "PANDA", clue: "A black and white bear that eats bamboo" },
        { word: "RICE", clue: "Farmers grew this in flooded fields called paddies" },
        { word: "DRUM", clue: "It goes boom as the New Year dragon dances" },
        { word: "WALL", clue: "The Great ____ of China is thousands of kilometres long" },
        { word: "TEA", clue: "A drink made by putting dried leaves in hot water" }
      ]
    },
    maze: { seed: 2024, title: "Help Dr. Somebody find his balloon!", instruction: "Start at the owl. Find the way through to the balloon. Be careful of dead ends!", answerWidth: 330 },
    secretCode: { seed: 17, facts: ["PAPER WAS INVENTED IN CHINA", "SILK IS A SOFT SHINY CLOTH", "PANDAS EAT BAMBOO"] }   // each is stated in grade3-china.html
  }
};

// ---------- Kindergarten: Dot's Busy Train ----------
// Dot, the engine and the animal faces are copied from dots-busy-train.html. Lines are thicker and details fewer than in Grade 3.

// Copied from DOT in dots-busy-train.html. The game colours it with CSS classes (.m .d .b .e .p, in shared/kit.css), so classFills says what each class was.
const DOT_SVG = `<svg viewBox="0 0 200 160"><path class="d" d="M72 108 Q30 115 14 92 Q38 132 82 136 Z"/><rect class="d" x="80" y="136" width="18" height="20" rx="8"/><rect class="d" x="108" y="136" width="18" height="20" rx="8"/>
  <ellipse class="m" cx="100" cy="104" rx="38" ry="42"/><ellipse class="b" cx="109" cy="112" rx="22" ry="28"/><ellipse class="d" cx="136" cy="98" rx="12" ry="6"/>
  <ellipse class="m" cx="118" cy="48" rx="36" ry="30"/><ellipse class="m" cx="146" cy="57" rx="20" ry="15"/>
  <circle class="e" cx="128" cy="42" r="8"/><circle class="p" cx="130" cy="43" r="4"/><circle class="p" cx="158" cy="52" r="1.8"/>
  <path d="M138 64 Q150 72 162 62" fill="none" stroke="#2b2d42" stroke-width="3" stroke-linecap="round"/>
  <path d="M84 32 Q116 -8 150 30 Z" fill="#4d9de0"/><rect x="134" y="24" width="36" height="8" rx="4" fill="#2f6fab"/></svg>`;
// Copied from ENGINE in dots-busy-train.html (Dot at the window).
const ENGINE_SVG = `<svg viewBox="0 0 200 160"><circle cx="150" cy="20" r="9" fill="#fff" opacity=".9"/><circle cx="166" cy="6" r="6" fill="#fff" opacity=".7"/>
  <rect x="138" y="36" width="22" height="36" rx="3" fill="#39405a"/><rect x="132" y="30" width="34" height="10" rx="4" fill="#39405a"/>
  <rect x="66" y="68" width="112" height="56" rx="14" fill="#ff5a5f"/><rect x="66" y="92" width="112" height="8" fill="#ffd23f"/>
  <rect x="16" y="34" width="66" height="90" rx="8" fill="#c7383d"/><rect x="10" y="26" width="78" height="12" rx="5" fill="#39405a"/>
  <rect x="26" y="46" width="46" height="38" rx="6" fill="#cfefff"/>
  <ellipse cx="45" cy="68" rx="15" ry="13" fill="#a06cd5"/><ellipse cx="59" cy="72" rx="9" ry="7" fill="#a06cd5"/><circle cx="50" cy="65" r="4" fill="#fff"/><circle cx="51" cy="65" r="2" fill="#2b2d42"/><path d="M31 60 Q45 46 59 59 Z" fill="#4d9de0"/>
  <polygon points="178,124 198,124 178,98" fill="#39405a"/>
  <circle cx="46" cy="132" r="20" fill="#39405a"/><circle cx="46" cy="132" r="8" fill="#8d93ab"/>
  <circle cx="106" cy="136" r="16" fill="#39405a"/><circle cx="106" cy="136" r="6" fill="#8d93ab"/>
  <circle cx="152" cy="136" r="16" fill="#39405a"/><circle cx="152" cy="136" r="6" fill="#8d93ab"/></svg>`;
// The game draws its train cars with page styling (a coloured box and two wheels), so this simple car is drawn the same way: an object, not a character.
const CAR_SVG = `<svg viewBox="0 0 120 100"><rect x="4" y="40" width="112" height="42" rx="8" fill="#4d9de0"/><circle cx="32" cy="86" r="12" fill="#39405a"/><circle cx="88" cy="86" r="12" fill="#39405a"/></svg>`;
const TINY_DOT_IN_WINDOW = [/<ellipse cx="45" cy="68"[^>]*\/>/, /<ellipse cx="59" cy="72"[^>]*\/>/, /<circle cx="5[01]" cy="65"[^>]*\/>/g, /<path d="M31 60 Q45 46 59 59 Z"[^>]*\/>/];
const ENGINE_BARE = [/<rect x="66" y="92"[^>]*\/>/, /<circle cx="\d+" cy="13[26]" r="[68]" fill="#8d93ab"\/>/g];   // the yellow stripe and the wheel hubs are too fine to colour
const DOT_FIXES = { black: ["#2b2d42"], classFills: { m: "#a06cd5", d: "#7445a8", b: "#fff3c9", e: "#fff", p: "#2b2d42" }, drop: [/<circle class="p" cx="158" cy="52" r="1.8"\/>/] };
// The cab window is made bigger so Dot's head and shoulders (the real Dot, cropped) fit in it and her face reads clearly.
const ENGINE_BIG_WINDOW = ENGINE_SVG.replace('<rect x="26" y="46" width="46" height="38" rx="6" fill="#cfefff"/>', '<rect x="20" y="40" width="58" height="52" rx="8" fill="#cfefff"/>');

// The dot to dot: a side view of Dot's engine. These are the 13 dots, in order, round the body.
// The wheels, window, stripe, lamp and smoke are already printed, so the child only joins the body outline.
const ENGINE_DOTS = [[76, 200], [234, 200], [234, 286], [346, 286], [346, 194], [426, 194], [426, 286], [544, 286], [544, 418], [380, 418], [242, 418], [76, 418], [76, 309]];
const ENGINE_PRINTED = `<g fill="#fff" stroke="#000" stroke-width="5" stroke-linejoin="round" stroke-linecap="round"><circle cx="172" cy="466" r="34"/><circle cx="311" cy="466" r="34"/><circle cx="450" cy="466" r="34"/><circle cx="172" cy="466" r="11"/><circle cx="311" cy="466" r="11"/><circle cx="450" cy="466" r="11"/><rect x="106" y="234" width="98" height="62" rx="10"/><path d="M234 358 H544" fill="none"/><circle cx="516" cy="322" r="16"/><circle cx="386" cy="136" r="22"/><circle cx="408" cy="90" r="16"/><path d="M40 504 H560" fill="none"/></g>`;

BOOK.k = {
  story: "Dot's Busy Train",
  gradeLabel: "Kindergarten",
  order: 0,
  lineWidth: 5,
  pictures: {
    dot: Object.assign({ svg: DOT_SVG }, DOT_FIXES),
    dotHead: Object.assign({ svg: DOT_SVG, viewBox: "78 8 96 86", clip: true }, DOT_FIXES),                                  // head and shoulders, cropped
    engine: { svg: ENGINE_BIG_WINDOW, drop: ENGINE_BARE.concat(TINY_DOT_IN_WINDOW) },                                       // big empty window: Dot's head is placed in it
    engineSimple: { svg: ENGINE_SVG, drop: ENGINE_BARE.concat(TINY_DOT_IN_WINDOW) },                                        // small empty window, for small pictures
    car: { svg: CAR_SVG },
    panda: FACES.panda, bear: FACES.bear, pig: FACES.pig
  },
  colouring: [
    { // Page 1: Dot, large (dot)
      caption: "Dot the dinosaur says hello!",
      scene: (P, S) => [
        S.sun(330, 56, 26), S.cloud(98, 56, 1.05), S.cloud(214, 46, .8),
        S.butterfly(84, 118, .75), S.butterfly(326, 130, .7),
        S.hill("M-20 264 Q100 232 200 256 T420 246"),
        S.tree(54, 194, 36), S.tree(346, 212, 34),
        S.hill("M-20 364 Q120 340 240 362 T420 350"),
        P("dot", 38, 126, 326),
        S.flower(48, 412, .95, 42), S.flower(120, 420, .85, 36), S.flower(282, 420, .85, 36), S.flower(352, 412, .95, 42)
      ].join("")
    },
    { // Page 2: Dot driving her engine, with her head and shoulders in a big window (engine, dotHead)
      caption: "Dot drives her big train!",
      scene: (P, S) => [
        S.sun(64, 56, 25), S.cloud(186, 48, .95), S.cloud(318, 58, .95),
        S.hill("M-20 268 Q110 238 220 262 T420 248"),
        S.signal(354, 178, 214, -1),
        S.hill("M-20 392 Q120 378 240 392 T420 384"),
        S.track(-10, 410, 392),
        S.cloud(258, 152, .52), S.cloud(220, 118, .66), S.cloud(172, 100, .48),
        P("engine", 18, 146, 324),
        P("dotHead", 50.4, 210.8, 94, 3),
        S.shape(`<rect x="50.4" y="210.8" width="94" height="84.2" rx="13" fill="none"/>`),
        S.tuft(62, 444), S.tuft(200, 446), S.tuft(338, 444)
      ].join("")
    },
    { // Page 3: the whole train: engine and two cars carrying a pig and a panda, with trees standing clear between the cars
      caption: "The train has cars to colour!",
      scene: (P, S) => [
        S.sun(64, 56, 24), S.cloud(192, 48, 1), S.cloud(322, 66, .85),
        S.bird(126, 98), S.bird(266, 92),
        S.hill("M-20 240 Q100 218 200 234 T420 226"),
        S.tree(113, 184, 30), S.tree(216, 176, 32),
        S.cloud(336, 170, .48), S.cloud(296, 136, .58),
        S.hill("M-20 378 Q120 364 240 378 T420 370"),
        S.track(-10, 410, 336),
        P("panda", 26, 232, 68, 3), P("pig", 130, 232, 68, 3),
        P("car", 16, 258, 92), P("car", 120, 258, 92),
        S.shape(`<path d="M106 310 H122 M210 310 H234" fill="none"/>`),
        P("engineSimple", 224, 218, 156),
        S.flower(64, 416, .95, 40), S.flower(200, 420, .9, 36), S.flower(336, 416, .95, 40)
      ].join("")
    },
    { // Page 4: Dot waving at the train station, with a platform, a station sign and a clock
      caption: "Dot waves at the train station!",
      scene: (P, S) => [
        S.sun(334, 54, 24), S.cloud(98, 50, .95), S.cloud(218, 44, .75),
        S.butterfly(334, 152, .75), S.bird(244, 108),
        S.hill("M-20 282 Q120 250 250 274 T420 264"),
        // station building with gable roof, round clock, bold STATION sign, ticket window and arched doorway
        S.shape(`<rect x="42" y="106" width="22" height="44" rx="3"/><rect x="26" y="176" width="190" height="172"/><polygon points="14,176 121,100 228,176"/>`),
        S.shape(`<circle cx="121" cy="146" r="22"/><path d="M121 128 V133 M121 159 V164 M103 146 H108 M134 146 H139 M121 146 V135 M121 146 H132" fill="none"/>`, 3.6),
        S.shape(`<rect x="38" y="188" width="166" height="40" rx="8"/>`),
        `<text x="121" y="218" font-size="28" font-weight="900" letter-spacing="2" text-anchor="middle" fill="#fff" stroke="#000" stroke-width="2.2" paint-order="stroke">STATION</text>`,
        S.shape(`<rect x="42" y="246" width="58" height="54" rx="6"/><path d="M71 246 V300 M42 273 H100" fill="none"/><rect x="36" y="298" width="70" height="10" rx="3"/><path d="M124 348 V266 Q158 234 192 266 V348 Z"/><circle cx="178" cy="306" r="5"/>`),
        // raised platform, Dot waving beside a suitcase, and railway track along the front
        S.shape(`<rect x="-10" y="348" width="420" height="30"/><path d="M24 348 V378 M88 348 V378 M152 348 V378 M216 348 V378 M280 348 V378 M344 348 V378" fill="none"/>`, 3.5),
        S.shape(`<path d="M356 312 V304 Q363 298 370 304 V312" fill="none"/><rect x="346" y="312" width="34" height="36" rx="6"/><path d="M356 312 V348 M370 312 V348" fill="none"/>`, 3.8),
        P("dot", 204, 196, 190),
        S.track(-10, 410, 392),
        S.tuft(62, 444), S.tuft(200, 446), S.tuft(338, 444)
      ].join("")
    },
    { // Page 5: the train crossing a bridge with ducks on the water below
      caption: "Dot's train crosses the bridge!",
      scene: (P, S) => [
        S.sun(336, 54, 24), S.cloud(86, 52, .95), S.cloud(194, 44, .75),
        S.bird(144, 96),
        S.hill("M-20 226 Q110 194 220 218 T420 206"),
        S.tree(364, 168, 24),
        S.cloud(286, 114, .44), S.cloud(242, 86, .52),
        // Bear riding in the car and Dot driving the engine across the bridge
        P("bear", 40, 149, 70, 3),
        P("car", 24, 179, 102),
        S.shape(`<path d="M124 233 H156" fill="none"/>`),
        P("engine", 138, 102, 210),
        P("dotHead", 159, 144, 60.9, 2.6),
        S.shape(`<rect x="159" y="144" width="60.9" height="54.6" rx="8" fill="none"/>`, 3.4),
        // arched bridge spanning the river, arches cleanly below the bridge deck
        S.shape(`<path d="M-10 262 H410 V350 H380 V320 A53 34 0 0 0 274 320 V350 H253 V320 A53 34 0 0 0 147 320 V350 H126 V320 A53 34 0 0 0 20 320 V350 H-10 Z"/><path d="M-10 276 H410" fill="none"/>`),
        S.shape(`<path d="M126 300 H147 M126 324 H147 M253 300 H274 M253 324 H274" fill="none"/>`, 3.4),
        // calm river below with reeds on the banks and three simple outlined ducks
        S.shape(`<path d="M-10 346 H410 V470 H-10 Z"/>`),
        S.shape(`<path d="M36 372 q14 -7 28 0 t28 0 M230 374 q14 -7 28 0 t28 0 M132 436 q16 -7 32 0 t32 0 M286 434 q14 -7 28 0 t28 0" fill="none"/>`, 3.5),
        S.shape(`<path d="M22 444 V392 M34 446 V382 M366 446 V384 M378 444 V396" fill="none"/><ellipse cx="34" cy="378" rx="5" ry="11"/><ellipse cx="366" cy="380" rx="5" ry="11"/>`, 3.8),
        S.duck(94, 400, .92, false),
        S.duck(204, 412, 1, false),
        S.duck(314, 396, .88, true)
      ].join("")
    }
  ],
  activities: {
    pages: ["maze", "dotToDot", "countColour", "patternTrain"],
    maze: { cols: 7, rows: 9, seed: 5, cs: 64, ox: 136, oy: 40, wall: 8, start: "dot", end: "engineSimple", startW: 112, endW: 112, icon: 2.2, answerWidth: 290,
      title: "Help Dot find her train!", instruction: "Start at Dot. Find the way to the train." },
    dotToDot: { points: ENGINE_DOTS, extras: ENGINE_PRINTED },
    countColour: { seed: 11, kinds: ["pig", "wheel", "ticket", "panda", "car"], colourKind: "wheel", colourName: "wheels" },
    patternTrain: { seed: 4 }
  }
};

window.Books = { start, BOOK, outline, place, mulberry32, makeWordSearch, makeCrossword, makeMaze, solveMaze };
