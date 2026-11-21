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
const hillShape = d => shape(`<path d="${d} V450 H-20 Z"/>`);
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
const SCENE_TOOLS = { shape, cloud: cloudShape, sun: sunShape, hill: hillShape, peak: peakShape, tree: treeShape, flower: flowerShape, track: trackShape, tuft: tuftShape, bush: bushShape, bird: birdShape, sparkle: sparkleShape, burst: burstShape };

// ---------- one sheet of paper ----------
function sheet(G, bookName, pageNo, body) {
  return `<div class="sheetwrap"><section class="sheet"><div class="inner">
    <header class="sh"><span>${G.story}</span><span>${G.gradeLabel}</span></header>
    <div class="pbody">${body}</div>
    <footer class="sf"><span>${bookName}</span><span>Page ${pageNo}</span></footer>
  </div></section></div>`;
}

// ---------- colouring pages ----------
function colouringPages(G, bookName) {
  LINE = G.lineWidth || 3.5;
  const P = (name, x, y, w, target) => place(G.pictures[name], x, y, w, target || LINE);
  return G.colouring.map((page, i) => sheet(G, bookName, i + 1,
    `<div class="art"><svg viewBox="0 0 400 420" preserveAspectRatio="xMidYMid slice">${page.scene(P, SCENE_TOOLS)}</svg></div>
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
  let s = `<svg viewBox="0 0 600 600" width="640" height="640">${A.extras || ""}`;
  if (answers) s += `<polygon points="${poly.map(p => p.join(",")).join(" ")}" fill="none" stroke="#000" stroke-width="6" stroke-linejoin="round"/>`;
  poly.forEach((p, i) => {
    const a = normal((i + n - 1) % n), b = normal(i);
    let nx = a[0] + b[0], ny = a[1] + b[1]; const l = Math.hypot(nx, ny) || 1; nx /= l; ny /= l;
    s += `<circle cx="${p[0]}" cy="${p[1]}" r="9" fill="#000"/>`;
    if (i === 0) s += `<circle cx="${p[0]}" cy="${p[1]}" r="19" fill="none" stroke="#000" stroke-width="3"/>`;   // a ring round dot 1 shows where to start
    const off = i === 0 ? 46 : 40;
    s += `<text x="${(p[0] + nx * off).toFixed(1)}" y="${(p[1] + ny * off + 12).toFixed(1)}" font-size="34" font-weight="bold" text-anchor="middle" fill="#000">${i + 1}</text>`;
  });
  return s + `</svg>`;
}

// ---------- count and colour ----------
// Groups of 1 to 10 things, each with an empty box beside it. A.kinds are the things (one per group), A.colourKind is the thing in the bottom line.
function countColourSvg(G, A) {
  const rng = mulberry32(A.seed), rowH = 120;
  const groups = shuffled([1, 2, 3, 4, 5, 6, 7, 8, 9, 10], rng).slice(0, A.kinds.length).map((n, i) => ({ n, kind: A.kinds[i] }));
  const colourN = 3 + Math.floor(rng() * 4), H = groups.length * rowH + 125;
  let s = `<svg viewBox="0 0 720 ${H}" width="720" height="${H}">`;
  groups.forEach((g, i) => {
    const cy = i * rowH + rowH / 2;
    for (let j = 0; j < g.n; j++) {
      const col = j % 5, row = Math.floor(j / 5), rowShift = g.n > 5 ? (row ? 28 : -28) : 0;
      s += iconAt(G, g.kind, 80 + col * 76, cy + rowShift, 1);
    }
    s += `<rect x="500" y="${cy - 45}" width="120" height="90" rx="14" fill="#fff" stroke="#000" stroke-width="5"/>`;
    if (i < groups.length - 1) s += `<line x1="20" y1="${(i + 1) * rowH}" x2="700" y2="${(i + 1) * rowH}" stroke="#000" stroke-width="2" stroke-dasharray="3 9" stroke-linecap="round"/>`;
  });
  const by = groups.length * rowH;
  s += `<text x="360" y="${by + 42}" font-size="34" font-weight="bold" text-anchor="middle" fill="#000">Colour ${colourN} ${A.colourName}.</text>`;
  for (let i = 0; i < 8; i++) s += iconAt(G, A.colourKind, 90 + i * 77, by + 92, 1);
  return { svg: s + `</svg>`, groups };
}
// The answers: each group's picture and its number.
function countAnswerSvg(G, groups) {
  let s = `<svg viewBox="0 0 700 120" width="700" height="120">`;
  groups.forEach((g, i) => {
    const x = 70 + i * 140;
    s += iconAt(G, g.kind, x, 30, .8) + `<rect x="${x - 34}" y="62" width="68" height="50" rx="10" fill="#fff" stroke="#000" stroke-width="3"/><text x="${x}" y="100" font-size="38" font-weight="bold" text-anchor="middle" fill="#000">${g.n}</text>`;
  });
  return s + `</svg>`;
}

// ---------- pattern trains ----------
// Three trains of six cars. The pattern shows on the first four cars and the child draws what comes next on the last two.
function patternTrainSvg(G, A, answers) {
  const rng = mulberry32(A.seed), pool = shuffled(["circle", "square", "triangle", "star", "heart"], rng);
  const second = rng() < .5 ? [0, 0, 1, 0, 0, 1] : [0, 1, 1, 0, 1, 1];                       // AAB or ABB
  const rows = [{ shapes: [pool[0], pool[1]], seq: [0, 1, 0, 1, 0, 1] }, { shapes: [pool[2], pool[3]], seq: second }, { shapes: [pool[4], pool[0], pool[1]], seq: [0, 1, 2, 0, 1, 2] }];   // AB, AAB or ABB, ABC
  const rowH = 140, H = rows.length * rowH + 30, engine = G.pictures.engineSimple;
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
      answer: { label: "Dot to Dot", html: resize(dotToDotSvg(A, true), 310) }
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
      answer: { label: "Pattern Trains", html: resize(patternTrainSvg(G, A, true), 440) }
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
    { // Page 1: Dr. Somebody beside his clock balloon with a panda in the bamboo (owl, balloon, bamboo, panda face)
      caption: "Dr. Somebody and his balloon are ready to fly!",
      scene: (P, S) => [
        S.sun(335, 52, 22), S.cloud(105, 58, 1.1), S.cloud(255, 100, .75),
        S.hill("M-20 255 Q50 215 130 245 T290 228 T420 240"), S.hill("M-20 292 Q110 250 220 284 T420 268"),
        S.shape(`<path d="M30 268 q8 -7 16 0 M70 275 q8 -7 16 0 M150 262 q8 -7 16 0 M235 275 q8 -7 16 0" fill="none"/>`),
        P("bamboo", 292, 118, 96), P("bamboo", 338, 146, 80), P("bamboo", 368, 132, 70),
        S.hill("M-20 352 Q120 330 230 348 T420 338"),
        P("balloon", 10, 138, 165), P("owl", 178, 262, 132), P("panda", 312, 262, 82),
        S.tuft(60, 402), S.tuft(150, 410), S.tuft(300, 412), S.tuft(385, 408), S.tuft(105, 372), S.tuft(250, 395)
      ].join("")
    },
    { // Page 2: the Great Wall over layered mountains with a watchtower, a path, the pagoda and the balloon above (pagoda, balloon, owl; the wall is drawn here)
      caption: "The Great Wall winds over the mountains.",
      scene: (P, S) => {
        // the top edge of the wall has real battlements: a block, a gap, a block, a gap
        let top = "M-30 306 V268"; for (let x = -30; x < 430; x += 24) top += " V258 h14 V268 h10"; top += " V306 Z";
        let bricks = "M-30 281 H430 M-30 293.5 H430";
        for (let x = -30; x < 430; x += 20) bricks += ` M${x} 268 V281 M${x} 293.5 V306 M${x + 10} 281 V293.5`;
        let tower = "M155 310 V215"; for (let x = 155; x < 235; x += 20) tower += " V205 h12 V215 h8"; tower += " V310 Z";
        let towerBricks = ""; [228, 246, 264, 282, 300].forEach((y, i) => { towerBricks += `M155 ${y} H235 `; for (let x = 155 + (i % 2) * 10 + 10; x < 235; x += 20) towerBricks += `M${x} ${y - 18 < 215 ? 215 : y - 18} V${y} `; });
        return [
          S.sun(55, 50, 20),
          S.shape(`<path d="M-20 235 L35 165 L80 210 L140 132 L215 222 L275 158 L340 205 L420 145 V330 H-20 Z"/>`),
          S.shape(`<path d="M140 132 L150 165 L136 190 M275 158 L284 188 L270 210 M35 165 L42 190" fill="none"/><path d="M127 152 L140 132 L153 152 L146 158 L140 150 L134 159 Z M263 176 L275 158 L287 176 L281 181 L275 173 L269 182 Z"/>`),
          S.shape(`<path d="M-20 275 L50 205 L105 255 L175 190 L255 262 L320 215 L420 270 V340 H-20 Z"/>`),
          S.shape(`<path d="M175 190 L186 215 L172 238 M50 205 L58 230 M320 215 L330 240 L318 258" fill="none"/>`),
          S.cloud(130, 62, .75), S.cloud(335, 52, 1),
          P("balloon", 165, 38, 78),
          S.bird(268, 92), S.bird(292, 108), S.bird(62, 112),
          S.hill("M-20 296 Q100 280 200 292 T420 284"),
          `<g transform="rotate(-3 200 290)">${S.shape(`<path d="${top}"/>`)}${S.shape(`<path d="${bricks}" fill="none"/>`, 1.3)}</g>`,
          S.shape(`<path d="${tower}"/>`), S.shape(`<path d="${towerBricks}" fill="none"/>`, 1.3),
          S.shape(`<rect x="170" y="170" width="50" height="45"/><rect x="178" y="184" width="10" height="16" rx="4"/><rect x="202" y="184" width="10" height="16" rx="4"/><path d="M156 174 Q195 144 234 174 L224 182 H166 Z"/><path d="M170 172 L174 181 M184 164 L186 177 M195 161 V176 M206 164 L204 177 M220 172 L216 181" fill="none"/><path d="M195 146 V138" fill="none"/>`),
          S.shape(`<path d="M180 310 V284 Q195 262 210 284 V310 Z"/><rect x="164" y="236" width="12" height="18" rx="5"/><rect x="214" y="236" width="12" height="18" rx="5"/>`),
          S.hill("M-20 338 Q100 322 200 338 T420 326"),
          S.shape(`<path d="M118 430 C95 395 190 390 168 358 C150 332 188 326 180 310 L210 310 C220 330 195 336 212 356 C238 388 150 392 176 430 Z"/><path d="M148 395 q8 -3 14 0 M190 372 q6 -3 12 0 M180 340 q5 -2 10 0" fill="none"/>`),
          S.tree(352, 322, 15), S.tree(300, 332, 12), S.bush(255, 356, 1), S.bush(110, 372, .8), S.bush(386, 376, .8),
          P("pagoda", 28, 212, 92), P("owl", 292, 354, 76)
        ].join("");
      }
    },
    { // Page 3: the festival: patterned lanterns and kites, fireworks, stars and the pagoda (lantern, kite, pagoda, owl)
      caption: "Lanterns glow and kites soar at the festival.",
      scene: (P, S) => {
        const sag = x => 18 + 108 * ((x % 200) / 200) * (1 - (x % 200) / 200);       // how far down the string hangs at x
        return [
          S.cloud(100, 268, .6), S.cloud(300, 268, .5),
          S.burst(205, 122, 30), S.burst(152, 168, 18), S.burst(262, 176, 14),
          S.sparkle(28, 112, 9), S.sparkle(385, 112, 9), S.sparkle(250, 150, 7), S.sparkle(30, 175, 7), S.sparkle(380, 190, 7), S.sparkle(165, 100, 6),
          S.hill("M-20 372 Q100 350 200 368 T420 358"),
          S.shape(`<path d="M-5 18 Q100 72 200 18 Q300 72 405 18" fill="none"/>`),
          [25, 75, 125, 175, 225, 275, 325, 375].map(x => P("lantern", x - 12, sag(x) - 1, 24)).join(""),
          S.shape(`<path d="M38 232 V372 M372 232 V372" fill="none"/>`),
          P("lantern", 15, 238, 46), P("lantern", 349, 238, 46),
          P("kite", 296, 100, 58), P("kite", 68, 108, 52),
          P("pagoda", 140, 200, 120), P("owl", 262, 300, 86)
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
const ENGINE_DOTS = [[80, 210], [240, 210], [240, 290], [340, 290], [340, 200], [420, 200], [420, 290], [540, 290], [540, 420], [380, 420], [240, 420], [80, 420], [80, 315]];
const ENGINE_PRINTED = `<g fill="#fff" stroke="#000" stroke-width="5" stroke-linejoin="round" stroke-linecap="round"><circle cx="175" cy="466" r="34"/><circle cx="310" cy="466" r="34"/><circle cx="445" cy="466" r="34"/><circle cx="175" cy="466" r="11"/><circle cx="310" cy="466" r="11"/><circle cx="445" cy="466" r="11"/><rect x="110" y="240" width="100" height="60" rx="10"/><path d="M240 360 H540" fill="none"/><circle cx="515" cy="325" r="16"/><circle cx="380" cy="140" r="22"/><circle cx="402" cy="94" r="16"/><path d="M40 504 H560" fill="none"/></g>`;

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
        S.sun(335, 52, 28), S.cloud(100, 52, 1.1), S.cloud(230, 40, .8),
        S.hill("M-20 300 Q100 262 200 290 T420 275"),
        S.tree(60, 205, 40), S.tree(362, 262, 36),
        S.hill("M-20 360 Q120 335 240 358 T420 345"),
        S.flower(45, 392, 1, 40), S.flower(222, 400, .9, 40), S.flower(350, 392, 1, 40),
        P("dot", 25, 108, 350)
      ].join("")
    },
    { // Page 2: Dot driving her engine, with her head and shoulders in a big window (engine, dotHead)
      caption: "Dot drives her big train!",
      scene: (P, S) => [
        S.sun(55, 55, 26), S.cloud(165, 48, .95), S.cloud(310, 58, 1),
        S.hill("M-20 255 Q100 225 200 250 T420 240"),
        S.tree(215, 200, 38),
        S.hill("M-20 372 Q120 358 240 372 T420 364"),
        S.track(-10, 410, 370),
        P("engine", 30, 118, 340),
        P("dotHead", 64, 186, 98.6, 3),
        S.shape(`<rect x="64" y="186" width="98.6" height="88.4" rx="14" fill="none"/>`),
        S.cloud(285, 140, .7)
      ].join("")
    },
    { // Page 3: the whole train: engine and two cars carrying a pig and a panda (engineSimple, car, pig, panda)
      caption: "The train has cars to colour!",
      scene: (P, S) => [
        S.sun(55, 55, 26), S.cloud(200, 45, 1), S.cloud(335, 90, .8),
        S.hill("M-20 290 Q100 262 200 285 T420 272"),
        S.tree(330, 205, 38), S.tree(165, 188, 34),
        S.hill("M-20 372 Q120 358 240 372 T420 364"),
        S.track(-10, 410, 329),
        P("pig", 130, 221, 78, 3), P("panda", 20, 221, 78, 3),
        P("car", 117, 250, 104), P("car", 7, 250, 104),
        S.shape(`<path d="M108 308 H121 M218 308 H236" fill="none"/>`),
        P("engineSimple", 227, 210, 165),
        S.flower(55, 393, 1, 40), S.flower(200, 398, .9, 40), S.flower(340, 393, 1, 40)
      ].join("")
    }
  ],
  activities: {
    pages: ["maze", "dotToDot", "countColour", "patternTrain"],
    maze: { cols: 7, rows: 9, seed: 5, cs: 64, ox: 136, oy: 40, wall: 8, start: "dot", end: "engineSimple", startW: 112, endW: 112, icon: 2.2, answerWidth: 330,
      title: "Help Dot find her train!", instruction: "Start at Dot. Find the way to the train." },
    dotToDot: { points: ENGINE_DOTS, extras: ENGINE_PRINTED },
    countColour: { seed: 11, kinds: ["pig", "wheel", "ticket", "panda", "car"], colourKind: "wheel", colourName: "wheels" },
    patternTrain: { seed: 4 }
  }
};

window.Books = { start, BOOK, outline, place, mulberry32, makeWordSearch, makeCrossword, makeMaze, solveMaze };
