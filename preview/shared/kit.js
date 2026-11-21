"use strict";
/* =====================================================================
   SHARED WORKING PARTS
   Every game on the shelf can use these: player names, saving,
   the talking voice, little sounds, confetti, and the press-and-hold
   grown-ups button. Change something here and every game gets it.
   ===================================================================== */

// ---------- small helpers ----------
const $ = id => document.getElementById(id);
const rand = n => Math.floor(Math.random() * n);
const pick = arr => arr[rand(arr.length)];
const shuffle = arr => { const a = arr.slice(); for (let i = a.length - 1; i > 0; i--) { const j = rand(i + 1); [a[i], a[j]] = [a[j], a[i]]; } return a; };
const wait = ms => new Promise(r => setTimeout(r, ms));
const cap = s => s.charAt(0).toUpperCase() + s.slice(1);

const Kit = (() => {
  const get = (k, d) => { try { const r = localStorage.getItem(k); return r === null ? d : JSON.parse(r); } catch (e) { return d; } };
  const put = (k, v) => { try { localStorage.setItem(k, JSON.stringify(v)); } catch (e) {} };

  // ---------- players (each child gets their own saved progress on this device) ----------
  const players = () => get("storyShelf.players", []);
  function currentPlayer() {
    if (reviewing()) return { id: "review", name: "", review: true };
    let id = null; try { id = localStorage.getItem("storyShelf.current"); } catch (e) {}
    return players().find(p => p.id === id) || null;
  }
  // ---------- grown-up review ----------
  // A grown-up can look through any book and any chapter without playing up to it. While review is on, "who is playing" is a pretend
  // player called "review": every game saves under names ending ".review", so no child's progress, medals or report are touched, and
  // all of it is thrown away when review ends. It ends by itself after two hours, in case it is left on and a child picks up the device.
  const REVIEW_MS = 2 * 60 * 60 * 1000;
  function reviewing() {
    let id = null; try { id = localStorage.getItem("storyShelf.current"); } catch (e) {}
    if (id !== "review") return false;
    const r = get("storyShelf.review", null);
    if (r && Date.now() - r.since < REVIEW_MS) return true;
    endReview(); return false;
  }
  function startReview() {
    if (reviewing()) return;
    const p = currentPlayer(); put("storyShelf.review", { since: Date.now(), before: p ? p.id : "" }); setCurrent("review");
  }
  function endReview() {
    const r = get("storyShelf.review", null), before = r ? r.before : "";
    try { const gone = []; for (let i = 0; i < localStorage.length; i++) { const k = localStorage.key(i); if (/\.review$/.test(k)) gone.push(k); } gone.forEach(k => localStorage.removeItem(k)); } catch (e) {}
    setCurrent(players().some(p => p.id === before) ? before : "");
  }
  // A book needs to know who is playing and how old they are (so progress belongs to a child). A game page opened without that goes back to the shelf, which asks.
  const needsChild = () => { const p = currentPlayer(); return !p || (!p.review && !p.born); };
  function guard() { if (!needsChild()) return false; try { location.replace("index.html?who=1"); } catch (e) {} return true; }
  function setCurrent(id) { try { localStorage.setItem("storyShelf.current", id); } catch (e) {} }
  // age (optional): how old the child is. What is kept is the YEAR THEY WERE BORN (worked out from the age), so the
  // suggested book moves up by itself each year. It stays on this device with the names, and travels with a backup.
  function addPlayer(name, age) {
    name = String(name || "").trim().slice(0, 20);
    if (!name) return null;
    const list = players(), n = get("storyShelf.nextId", 1), p = { id: "p" + n, name }; if (age > 0) p.born = new Date().getFullYear() - Math.round(age);
    // The very first child on a device takes over anything that was played before a name was asked for, so nothing is lost.
    if (!list.length && n === 1) try { // (only the first child ever added: a later child must not take over a removed child's progress)
      const keys = []; for (let i = 0; i < localStorage.length; i++) keys.push(localStorage.key(i));
      keys.filter(k => /^(storyShelf\.(stamps|progress)|(dotsBusyTrain|grade\d+[A-Za-z]*)\.v\d+|pipsLostEggs\.v1)$/.test(k)).forEach(k => {
        if (k === "pipsLostEggs.v1" && p.id === "p1") return; // Pip already keeps the first child's eggs under this name
        const mine = k + "." + p.id; if (localStorage.getItem(mine) === null) localStorage.setItem(mine, localStorage.getItem(k)); });
    } catch (e) {}
    list.push(p); put("storyShelf.players", list); put("storyShelf.nextId", n + 1); setCurrent(p.id);
    return p;
  }
  function setAge(id, age) { // a grown-up adds or changes a child's age later (no age: the suggestion goes away)
    const list = players(), p = list.find(x => x.id === id); if (!p) return;
    if (age > 0) p.born = new Date().getFullYear() - Math.round(age); else delete p.born;
    put("storyShelf.players", list);
  }
  const ageOf = p => p && p.born ? new Date().getFullYear() - p.born : null; // about how old (the birthday itself is not known)
  function removePlayer(id) {
    const list = players().filter(p => p.id !== id); put("storyShelf.players", list);
    if (!reviewing() && !list.find(p => p.id === (currentPlayer() || {}).id)) setCurrent(list[0] ? list[0].id : ""); // (a grown-up's review stays on; it goes back to a child when it ends)
  }
  // The name a game saves under. Each player gets a separate copy.
  const saveKey = base => { const p = currentPlayer(); return base + (p ? "." + p.id : ""); };
  function load(base, fresh) {
    const old = get(saveKey(base), null), S = Object.assign(fresh(), old || {});
    if (old && old.skill) S.skill = Object.assign(fresh().skill, old.skill); // keeps progress when new mini-games are added
    return S;
  }
  const save = (base, S) => put(saveKey(base), S);

  // ---------- medals (a child earns one the first time they finish a game's story) ----------
  const stampKey = () => { const p = currentPlayer(); return "storyShelf.stamps" + (p ? "." + p.id : ""); };
  const stamps = () => get(stampKey(), []);
  function stamp(id) { const list = stamps(); if (!list.includes(id)) { list.push(id); put(stampKey(), list); storyDone(id); music("new-medal"); } } // a new medal gets its own little tune (and the day goes in the progress report)

  // ---------- progress, for the grown-ups' progress report (progress.html) ----------
  // Every answered question is noted for the child who is playing: the game, the station, the difficulty step,
  // and whether it was right first time. Questions that needed another try are kept as "tricky ones".
  // It all stays on this device.
  const progressKey = () => { const p = currentPlayer(); return "storyShelf.progress" + (p ? "." + p.id : ""); };
  const plain = html => String(html || "").replace(/<\/b>\s*<i>/g, "/").replace(/<[^>]*>/g, " ").replace(/&nbsp;/g, " ").replace(/\s+/g, " ").trim();
  function track(game, title, station, stationName, step, q, firstTry, hinted) { // hinted: a hint was used on this question
    try {
      const P = get(progressKey(), null) || { v: 1, games: {}, days: {} };
      const g = P.games[game] || (P.games[game] = { title, stations: {} });
      const s = g.stations[station] || (g.stations[station] = { name: stationName, asked: 0, firstTry: 0, recent: [], missed: {} });
      g.title = title; s.name = stationName; s.asked++; if (firstTry) s.firstTry++; if (hinted) s.hints = (s.hints || 0) + 1;
      s.recent.push([step, firstTry ? 1 : 0]); if (s.recent.length > 20) s.recent.shift(); // the last 20 answers
      const d = new Date(), day = d.getFullYear() + "-" + String(d.getMonth() + 1).padStart(2, "0") + "-" + String(d.getDate()).padStart(2, "0");
      s.last = day; P.days[day] = (P.days[day] || 0) + 1;
      const strand = strandOf(game, station); // month by month, for each strand: [questions answered, right first time]
      if (strand) { const M = P.months || (P.months = {}), m = M[day.slice(0, 7)] || (M[day.slice(0, 7)] = {}), c = m[strand] || (m[strand] = [0, 0]); c[0]++; if (firstTry) c[1]++; }
      if (!firstTry) {
        const right = q.choices && q.choices.find(c => c.ok), answer = right ? plain(right.html) || right.name || "" : "";
        const full = plain(q.help || (q.read !== undefined && q.read ? q.read : q.say)), asked = full.length > 110 ? full.slice(0, 107).replace(/\s+\S*$/, "") + "…" : full;
        const label = asked + (answer ? " → " + answer : "") + (hinted ? " · used a hint" : "");
        s.missed[label] = (s.missed[label] || 0) + 1;
        const keys = Object.keys(s.missed); if (keys.length > 40) { keys.sort((a, b) => s.missed[a] - s.missed[b]); delete s.missed[keys[0]]; }
      }
      put(progressKey(), P);
    } catch (e) {}
  }

  // ---------- finished lessons (for the progress report, and one day for a hidden graduation scene) ----------
  // LESSONS lists every lesson on the shelf, in shelf order. A "lesson" is one place or station (Preschool to Grade 4)
  // or one chapter (Grades 5 to 8). WHEN YOU ADD A STATION OR A CHAPTER TO A GAME, ADD IT HERE TOO: this list is how the
  // report knows what is still left to do in a book the child has not even opened yet.
  // "save" is the name the game saves under (used to recognise lessons finished before this record existed).
  // STRANDS: the school subject and strand each lesson belongs to, named as the Ontario curriculum names them
  // (Mathematics 2020, Language 2023, Science and Technology 2022, Social Studies / History / Geography 2023).
  // The games are close to the curriculum, not exact: where a lesson did not fit one strand cleanly, the nearest was picked.
  // The order here is the order the progress report shows them in.
  const STRANDS = {
    LB: ["Language", "Foundations of Language"], LC: ["Language", "Comprehension: Understanding and Responding to Texts"],
    MB: ["Mathematics", "Number"], MC: ["Mathematics", "Algebra"], MD: ["Mathematics", "Data"], ME: ["Mathematics", "Spatial Sense"], MF: ["Mathematics", "Financial Literacy"],
    TB: ["Science and Technology", "Life Systems"], TE: ["Science and Technology", "Earth and Space Systems"],
    SA: ["Social Studies", "Heritage and Identity"],
    H7B: ["History", "Canada, 1800–1850: Conflict and Challenges"], H8A: ["History", "Creating Canada, 1850–1890"], H8B: ["History", "Canada, 1890–1914: A Changing Society"],
    G7B: ["Geography", "Natural Resources Around the World: Use and Sustainability"]
  };
  // A lesson is [id, name, strand] for a place or station, and [id, name, the story's strand, { challenge: its strand }] for a chapter
  // (a chapter's story is social studies, history, geography or science; its challenges are mathematics).
  const chapters = list => list.map(([name, strand, asks], i) => ["ch" + (i + 1), name, strand, asks]);
  // Books marked soon: true are on the preview copy only, for now: the real shelf does not have them, so there they are left out
  // of every count (and of "finished everything"). WHEN A BOOK JOINS THE REAL SHELF, TAKE ITS soon: true AWAY.
  const onPreview = /\/preview\//.test(location.pathname) || /^(localhost|127\.0\.0\.1)$/.test(location.hostname);
  const LESSONS = [
    { id: "pre", grade: "Preschool", title: "Pip's Lost Eggs", save: "pipsLostEggs.v1", lessons: [["colors", "Berry Bush", "LB"], ["shapes", "Shape Rocks", "ME"], ["count", "Egg Count", "MB"], ["patterns", "Pattern Path", "MC"], ["shadows", "Shadow Cave", "ME"], ["sizes", "Big and Small", "ME"], ["body", "Pip's Body", "TB"], ["sounds", "Animal Sounds", "TB"]] },
    { id: "k", grade: "Kindergarten", title: "Dot's Busy Train", save: "dotsBusyTrain.v1", lessons: [["letters", "Letter Station", "LB"], ["sounds", "Sound Station", "LB"], ["rhymes", "Rhyme Station", "LB"], ["words", "Word Station", "LB"], ["count", "Counting Station", "MB"], ["moreless", "More or Less", "MB"], ["order", "What's Next?", "MB"], ["adding", "Adding Station", "MB"]] },
    { id: "g1", grade: "Grade 1", title: "Dr. Somebody's Space Balloon", save: "grade1Space.v1", lessons: [["read", "Word World", "LB"], ["spell", "Spelling Star", "LB"], ["sentence", "Sentence Station", "LC"], ["plus", "Plus Planet", "MB"], ["minus", "Minus Moon", "MB"], ["tens", "Tens Tower", "MB"], ["clock", "Calendar Comet", "ME"], ["skip", "Skip-Count Rings", "MB"]] },
    { id: "g2", grade: "Grade 2", title: "Dr. Somebody in Ancient Egypt", save: "grade2Egypt.v1", lessons: [["add", "Pyramid Sums", "MB"], ["sub", "Nile Take-Away", "MB"], ["tokens", "Market Coins", "MF"], ["time", "Sundial Time", "ME"], ["words", "Hieroglyph Words", "LB"], ["scribe", "Scribe School", "LB"], ["scroll", "Explorer's Scroll", "LC"], ["rows", "Stone Rows", "MB"]] },
    { id: "g3", grade: "Grade 3", title: "Dr. Somebody in Ancient China", save: "grade3China.v1", lessons: [["times", "Great Wall Times", "MB"], ["share", "Silk Road Sharing", "MB"], ["fractions", "Dumpling Fractions", "MB"], ["abacus", "Abacus Numbers", "MB"], ["money", "Coin Counting", "MF"], ["graphs", "Market Graphs", "MD"], ["patterns", "Silk Patterns", "MC"], ["garden", "Palace Gardens", "ME"], ["problems", "Problem Bridge", "MB"], ["words", "Lantern Words", "LB"], ["grammar", "Scholar's Grammar", "LB"], ["scroll", "Explorer's Scroll", "LC"]] },
    { id: "g4", grade: "Grade 4", title: "Dr. Somebody in Ancient Rome", save: "grade4Rome.v1", lessons: [["numerals", "Roman Numerals", "MB"], ["multiply", "Legion Lines", "MB"], ["divide", "Aqueduct Sharing", "MB"], ["fractions", "Mosaic Fractions", "MB"], ["decimals", "Market Decimals", "MB"], ["shapes", "Architect's Angles", "ME"], ["measure", "Roman Roads", "ME"], ["camp", "Legion Camp", "ME"], ["formations", "Legion Formations", "MC"], ["data", "Senate Numbers", "MD"], ["problems", "Forum Problems", "MB"], ["market", "Roman Market", "MF"], ["roots", "Latin Words", "LB"], ["grammar", "Orator's Grammar", "LB"], ["scroll", "Explorer's Scroll", "LC"]] },
    { id: "g5", grade: "Grade 5", title: "Dr. Somebody Comes Home", save: "grade5Canada.v1", lessons: chapters([
      ["The People of the Longhouse", "SA", { longhouse: "ME", families: "MB", sisters: "MB", years: "MB" }], ["The Canoe Routes", "SA", { route: "MB", load: "MB", speed: "MB", rice: "MB" }],
      ["Following the Seasons", "SA", { geese: "MD", calendar: "ME", snow: "ME", daylight: "MB" }], ["The Land of Ice and Stars", "SA", { cold: "MB", blocks: "MC", sled: "MB", stars: "ME" }],
      ["Home Again", "SA", { journey: "MB", river: "ME", dates: "MB", home: "MB" }]]) },
    { id: "g6", grade: "Grade 6", title: "Dr. Somebody Goes East", save: "grade6East.v1", lessons: chapters([
      ["The City on the Cliff", "SA", { crossing: "MB", walls: "MB", trade: "MB", climb: "MB" }], ["The Long Farms", "SA", { lf_ribbon: "ME", lf_slant: "ME", lf_sap: "MB", lf_share: "MB" }],
      ["Holding Back the Sea", "SA", { ac_dyke: "MB", ac_gauge: "MB", ac_harvest: "MD", ac_depth: "MB" }], ["The People of the Dawn", "SA", { mk_turns: "ME", mk_triangles: "ME", mk_beads: "MC", mk_symmetry: "ME" }],
      ["The Harbour of Arrivals", "SA", { hx_numbers: "MB", hx_clock: "ME", hx_tally: "MD", hx_fares: "MF" }], ["The Edge of the Map", "SA", { nl_zones: "ME", nl_berg: "MB", nl_crates: "ME", nl_review: "MB" }]]) },
    { id: "g7", grade: "Grade 7", title: "Dr. Somebody Heads West", save: "grade7West.v1", lessons: chapters([
      ["Where the Canoes Met", "H7B", { fw_pace: "MB", fw_load: "MB", fw_swap: "MC", fw_last: "MB" }], ["The Forks", "H7B", { fk_river: "MB", fk_pelts: "MF", fk_puzzle: "MC", fk_last: "MF" }],
      ["The People of the Red River", "H7B", { rr_wheel: "ME", rr_area: "ME", rr_pemmican: "MB", rr_last: "ME" }], ["The Sea of Grass", "H7B", { sg_big: "MB", sg_share: "MB", sg_decline: "MB", sg_last: "MB" }],
      ["The Land of Giants", "TE", { bl_big: "MB", bl_scale: "MB", bl_grid: "ME", bl_last: "MC" }], ["Wheat and Sky", "G7B", { ws_homestead: "ME", ws_bins: "ME", ws_weather: "MD", ws_last: "MB" }]]) },
    { id: "g8", grade: "Grade 8", title: "Dr. Somebody and the Long Way Round", save: "grade8North.v1", lessons: chapters([
      ["The Last Spike", "H8A", { ls_climb: "MC", ls_hill: "ME", ls_pay: "MF", ls_last: "MB" }], ["The River of Gold", "H8A", { rg_graph: "MC", rg_big: "MB", rg_case: "MF", rg_last: "MB" }],
      ["The Harbour and the Cedar", "H8B", { hc_solid: "ME", hc_ratio: "MB", hc_water: "MB", hc_last: "MB" }], ["Every Child Matters", "H8B", {}],
      ["The Golden Stairs", "H8B", { gs_trips: "MC", gs_dust: "MF", gs_case: "MB", gs_last: "MB" }], ["The Top of the World", "TE", { tw_temps: "MB", tw_trend: "MD", tw_case: "MC", tw_last: "MC" }],
      ["Home", "H8B", { hm_friends: "MB", hm_last: "MB" }]]) }
  ].filter(L => onPreview || !L.soon);
  // Which strand an answer belongs to. station is a station's id ("times"), or a chapter's id with its challenge's strand ("ch2.ME").
  // (An answer saved for a whole chapter, as version 38 did, counts as Mathematics: Number, the commonest kind of challenge.)
  function strandOf(game, station) {
    const [id, code] = String(station).split("."), L = LESSONS.find(x => x.id === game), l = L && L.lessons.find(x => x[0] === id);
    return code && STRANDS[code] ? code : !l ? null : l[3] ? "MB" : l[2];
  }
  const askStrand = (game, lesson, ask) => { const L = LESSONS.find(x => x.id === game), l = L && L.lessons.find(x => x[0] === lesson); return (l && l[3] && l[3][ask]) || "MB"; };
  // Every strand a lesson touches: its own, plus (for a chapter) the strands of its challenges.
  const lessonStrands = l => [...new Set([l[2]].concat(Object.values(l[3] || {})))];
  const today = () => { const d = new Date(); return d.getFullYear() + "-" + String(d.getMonth() + 1).padStart(2, "0") + "-" + String(d.getDate()).padStart(2, "0"); };
  function gameRecord(P, game) { const L = LESSONS.find(x => x.id === game); return P.games[game] || (P.games[game] = { title: L ? L.title : game, stations: {} }); }
  // A game calls finish(game, lesson) each time a child finishes a lesson: the first time, the day is written down
  // (in the same record as the answers, so it is kept per child and travels with a backup).
  function finish(game, lesson) {
    try {
      const P = get(progressKey(), null) || { v: 1, games: {}, days: {} }, g = gameRecord(P, game), f = g.finished || (g.finished = {});
      if (!f[lesson]) { f[lesson] = today(); put(progressKey(), P); }
    } catch (e) {}
  }
  function storyDone(game) { // the whole story was finished (the medal): the first time, the day is written down
    try { const P = get(progressKey(), null) || { v: 1, games: {}, days: {} }, g = gameRecord(P, game); if (!g.story) { g.story = today(); put(progressKey(), P); } } catch (e) {}
  }
  // What a child has finished and what is left. childId: a child's id (null for "no name picked"); leave it out for whoever is playing.
  // Lessons finished before this record existed have no day; they are recognised from the game's own save where it shows them.
  // Hands back { games: [{ id, grade, title, lessons: [{ id, name, done, date }], done, total, story, storyDate }],
  //              done, total (lessons), stories, everything (true or false), missing: [{ game, grade, title, lesson, name }] }
  function finished(childId) {
    if (childId === undefined) { const p = currentPlayer(); childId = p ? p.id : null; }
    const end = childId ? "." + childId : "", P = get("storyShelf.progress" + end, null) || {}, medals = get("storyShelf.stamps" + end, []), missing = [];
    const games = LESSONS.map(L => {
      const rec = (P.games || {})[L.id] || {}, dated = rec.finished || {};
      const S = get(L.save + (L.id === "pre" && childId === "p1" ? "" : end), null) || {}; // (Pip's game keeps the first child's save under the plain name)
      const old = [S.found, S.aboard, S.medals].flatMap(o => Object.keys(o || {})).concat((Array.isArray(S.done) ? S.done : []).map(i => "ch" + (i + 1)));
      const lessons = L.lessons.map(([id, name]) => ({ id, name, done: !!dated[id] || old.includes(id), date: dated[id] || null }));
      const story = !!rec.story || (Array.isArray(medals) && medals.includes(L.id));
      lessons.forEach(l => { if (!l.done) missing.push({ game: L.id, grade: L.grade, title: L.title, lesson: l.id, name: l.name }); });
      if (!story) missing.push({ game: L.id, grade: L.grade, title: L.title, lesson: null, name: "Finish the story" });
      return { id: L.id, grade: L.grade, title: L.title, lessons, done: lessons.filter(l => l.done).length, total: lessons.length, story, storyDate: rec.story || null };
    });
    return { games, done: games.reduce((a, g) => a + g.done, 0), total: games.reduce((a, g) => a + g.total, 0), stories: games.filter(g => g.story).length, everything: !missing.length, missing };
  }
  // ---------- where to start (a suggestion from the child's age, never a lock) ----------
  // Ontario's usual ages: Kindergarten is for 4- and 5-year-olds, and Grade 1 starts in the September of the year a child
  // turns 6 (ontario.ca/page/kindergarten); each grade after that is one year on. A school year runs from September.
  // Younger children get the Preschool book; children past Grade 8 get the last book on the shelf.
  // startBook(childId) hands back null when no age was given, or { id, grade, title, age, earlier }:
  //   the suggested book, about how old the child is, and "earlier": the books before it that are not finished yet
  //   (to gently suggest going back), each as { id, grade, title, done, total, story }.
  function startBook(childId) {
    const p = childId === undefined ? currentPlayer() : players().find(x => x.id === childId);
    if (!p || !p.born) return null;
    const d = new Date(), turns = (d.getMonth() >= 8 ? d.getFullYear() : d.getFullYear() - 1) - p.born; // the age they reach in the year this school year began
    const want = turns <= 3 ? "pre" : turns <= 5 ? "k" : "g" + Math.min(turns - 5, 8);
    let at = LESSONS.findIndex(L => L.id === want); if (at < 0) at = LESSONS.length - 1; // that book is not on this shelf yet: the last one that is
    const L = LESSONS[at], F = finished(p.id);
    return { id: L.id, grade: L.grade, title: L.title, age: ageOf(p), earlier: F.games.slice(0, at).filter(g => !g.story || g.done < g.total) };
  }
  // THE ONE QUESTION for a graduation scene: has this child finished every lesson and every story, from Preschool up?
  // Kit.finishedEverything() answers for whoever is playing (or give a child's id): { yes: true or false, missing: [what is still to do] }.
  function finishedEverything(childId) { const f = finished(childId); return { yes: f.everything, missing: f.missing, done: f.done, total: f.total }; }

  // ---------- backup: everything the Story Shelf keeps on this device, as one code ----------
  // Progress lives only on the device (and an iPad keeps a separate store for each home-screen icon), so a grown-up can
  // save a backup and restore it later, or move it to another device. The code is "SSB1." followed by the data in letters
  // and numbers only, so it survives being pasted into Notes or an email, even with line breaks added.
  const BACKUP_KEYS = /^(storyShelf|pipsLostEggs|dotsBusyTrain|grade\d+[A-Za-z]*)\./; // the names every game saves under
  const toB64 = s => { const bytes = new TextEncoder().encode(s); let bin = ""; for (const b of bytes) bin += String.fromCharCode(b); return btoa(bin); };
  const fromB64 = s => new TextDecoder().decode(Uint8Array.from(atob(s), c => c.charCodeAt(0)));
  const shelfKeys = () => { const out = []; for (let i = 0; i < localStorage.length; i++) { const k = localStorage.key(i); if (BACKUP_KEYS.test(k)) out.push(k); } return out; };
  const niceDate = d => new Date(d).toLocaleString("en-CA", { day: "numeric", month: "short", year: "numeric", hour: "numeric", minute: "2-digit" });
  function makeBackup() {
    const data = {};
    shelfKeys().forEach(k => { if (k !== "storyShelf.lastBackup" && !/\.review$/.test(k)) data[k] = localStorage.getItem(k); });
    if (data["storyShelf.current"] === "review") data["storyShelf.current"] = (get("storyShelf.review", null) || {}).before || ""; // made during a review: the backup remembers the child who was playing // a grown-up's review is never part of a backup
    const names = players().map(p => p.name), made = new Date();
    const code = "SSB1." + toB64(JSON.stringify({ app: "story-shelf", v: 1, made: made.toISOString(), names, data }));
    const text = `Story Shelf backup\nMade: ${niceDate(made)}\nChildren: ${names.join(", ") || "(no names added)"}\n\n` +
      `To restore it: open the Story Shelf, press and hold the gear, and choose "Restore from a backup".\n\n${code}\n`;
    return { code, text, names, made };
  }
  function readBackup(text) { // finds the backup in a file or pasted text; throws if there is none
    const m = String(text || "").match(/SSB1\.([A-Za-z0-9+/=\s]+)/);
    if (!m) throw new Error("not a backup");
    const b = JSON.parse(fromB64(m[1].replace(/\s+/g, "")));
    if (!b || b.app !== "story-shelf" || !b.data) throw new Error("not a backup");
    return b;
  }
  function restoreBackup(b) { // replaces this device's Story Shelf data with the backup's; if anything goes wrong, puts the old data back
    const before = {}; shelfKeys().forEach(k => { before[k] = localStorage.getItem(k); });
    try {
      Object.keys(before).forEach(k => localStorage.removeItem(k));
      Object.entries(b.data).forEach(([k, v]) => { if (BACKUP_KEYS.test(k)) localStorage.setItem(k, v); });
      localStorage.setItem("storyShelf.lastBackup", JSON.stringify(b.made));
    } catch (e) {
      shelfKeys().forEach(k => localStorage.removeItem(k));
      Object.entries(before).forEach(([k, v]) => localStorage.setItem(k, v));
      throw e;
    }
  }
  const markBackedUp = () => put("storyShelf.lastBackup", new Date().toISOString());
  const lastBackup = () => get("storyShelf.lastBackup", null);

  // ---------- hints (one per round) ----------
  // A hint first takes away one wrong answer (only when 3 or more are left, so it never gives the answer away),
  // then runs the question's own "how to think about it" moment. hintHelper gives that moment simple tools:
  //   H.say(words, clip)  says the words (or plays a recorded clip); with talking off, writes them in the bubble
  //   H.show(html)        adds a picture or a few words under the question in the bubble
  //   H.cards()           the answer cards still in play, as [{ el, ch }]
  //   H.glow(el, on)      lights up a card, tile or picture;  H.label(el, text) puts a small number on a card
  //   H.q                 the question itself;  H.alive() is false once the child has moved on
  function dropOneWrong(box) {
    const left = [...box.children].filter(b => b._ch && !b.classList.contains("dim"));
    if (left.length < 3) return null;
    const x = pick(left.filter(b => !b._ch.ok)); x.classList.add("dim", "struck"); return x;
  }
  function hintHelper({ bubble, box, q, alive }) {
    const pace = () => (Kit.testPace || 1); // tests can speed this up
    const roomy = () => { // makes room under the question; moves the bubble's pictures rather than redrawing them, so lit-up ones stay lit
      if (bubble.classList.contains("quiet")) return;
      const row = document.createElement("div"); row.className = "rowx";
      while (bubble.firstChild) row.appendChild(bubble.firstChild);
      bubble.appendChild(row); bubble.classList.add("quiet");
    };
    const part = cls => { roomy(); let el = bubble.querySelector("." + cls); if (!el) { el = document.createElement("div"); el.className = cls; bubble.appendChild(el); } return el; };
    return {
      q, bubble, alive,
      show: html => { part("hintbox").innerHTML = html; },
      say: async (words, clip) => {
        if (!alive()) return false;
        if (settings.voice) return (clip ? await clip() : await say(words)) && alive();
        part("hintsaid").textContent = words; await wait(Math.max(1400, words.length * 55) * pace()); return alive();
      },
      cards: () => [...box.children].filter(b => b._ch && !b.classList.contains("dim")).map(el => ({ el, ch: el._ch })),
      glow: (el, on) => el && el.classList.toggle("glow", !!on),
      label: (el, text) => { let t = el.querySelector(".hintbadge"); if (!t) { t = document.createElement("span"); t.className = "hintbadge"; el.appendChild(t); } t.textContent = text; },
      wait: ms => wait(ms * pace())
    };
  }

  // A lesson ("watch me do one") uses the same tools as a hint, plus L.frame(html), which swaps the bubble
  // for the lesson's own picture. There are no answer cards during a lesson.
  function lessonHelper({ bubble, alive }) {
    const L = hintHelper({ bubble, box: document.createElement("div"), q: null, alive });
    L.frame = html => { bubble.className = "bubble quiet lessonframe"; bubble.innerHTML = `<div class="rowx">${html}</div>`; };
    return L;
  }

  // ---------- settings shared by the newer games ----------
  const settings = Object.assign({ voice: true, sound: true, music: true, voiceName: "" }, get("storyShelf.settings", {}));
  const saveSettings = () => put("storyShelf.settings", settings);

  // ---------- voice settings (the device's own voice is no longer used) ----------
  let voice = null;
  function voiceScore(v) {
    const n = v.name + " " + (v.voiceURI || "");
    let s = 0;
    if (/premium|enhanced|natural|neural/i.test(n)) s += 50;
    if (/Ava|Zoe|Allison|Samantha|Susan|Joelle|Nicky|Noelle|Aria|Jenny|Michelle|Ana\b|Sonia|Libby|Karen|Serena|Moira|Tessa|Google US English|Zira|Female/i.test(n)) s += 20;
    if (/^en.US/i.test(v.lang)) s += 5;
    if (/David|Mark\b|Guy\b|Daniel|Alex\b|Aaron|Tom\b|Evan|Nathan|Arthur|Oliver|Ryan|Christopher|Eric\b|Roger|Steffan|Brian|Andrew|Gordon|Rishi|\bMale/i.test(n)) s -= 30;
    if (/compact|eloquence|Eddy|Flo\b|Grandma|Grandpa|Reed|Rocko|Sandy|Shelley|Albert|Bad News|Good News|Bahh|Bells|Boing|Bubbles|Cellos|Jester|Organ|Superstar|Trinoids|Whisper|Wobble|Zarvox|Junior|Kathy|Ralph|Fred/i.test(n)) s -= 40;
    return s;
  }
  function englishVoices() { return []; } // the device voices are no longer used
  function chooseVoice() {} // kept so older pages do not break: there is no device voice to choose any more
  // The games used to fall back on the device's own ("robot") voice when a line had no recording. They no longer do:
  // every line is a recording in a chosen voice, and a line without one is simply shown in writing.
  // say() now only waits about as long as reading the words takes, so a game keeps its pace. It hands back true when
  // that time is up, or false straight away if the voice is switched off (or if something else starts in the meantime).
  function say(text, force) {
    return new Promise(resolve => {
      stopClip(); const mine = turn; // a new line always cuts off a recorded line that is still playing
      if (!text || (!settings.voice && !force)) return resolve(false);
      setTimeout(() => resolve(mine === turn), 900 + String(text).length * 55);
    });
  }
  // Says a line and waits until it is really over. Two safeguards, because some tablets report "finished" too early:
  // the voice must say it has finished, AND enough time must have passed for a line of that length.
  async function sayAndWait(text, quietPause) {
    const longEnough = wait(700 + text.length * 75);
    if (!(await say(text))) return wait(quietPause); // voice is off: just a short pause
    await longEnough; await wait(600);
  }
  const hush = () => { stopClip(); stopMusic(); };

  // ---------- recorded lines (a character's own voice, saved as sound files in the "audio" folder) ----------
  // playClip plays one recorded line. If the file is missing or cannot play, the game waits about as long as reading
  // "fallback" takes (the words are on the screen), and never uses the device voice. Like say(), it hands back a promise that finishes when the line is over.
  const clips = {}; let playing = null, turn = 0;
  // The file name for a recorded line, made from its words: the same words always give the same name
  // (tools/make-voice.py records the files listed in audio/lines.json under these names).
  function clipName(words) {
    let h = 0x811c9dc5; for (const ch of String(words)) { h ^= ch.codePointAt(0); h = Math.imul(h, 0x01000193) >>> 0; }
    return String(words).toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "").slice(0, 32).replace(/-$/, "") + "-" + h.toString(16).padStart(8, "0");
  }
  function loadClip(url) { // fetch a line ahead of time so it starts without a pause
    if (!clips[url]) clips[url] = (async () => {
      const ac = audio(), reply = await fetch(url);
      if (!reply.ok) throw new Error("no recording at " + url);
      const data = await reply.arrayBuffer();
      return new Promise((ok, no) => { const p = ac.decodeAudioData(data, ok, no); if (p && p.catch) p.catch(() => {}); });
    })().catch(e => { delete clips[url]; throw e; });
    return clips[url];
  }
  function stopClip() { turn++; if (playing) { const src = playing; playing = null; try { src.onended = null; src.stop(); } catch (e) {} if (src.cutOff) src.cutOff(); } }
  function playClip(url, fallback) {
    return new Promise(async resolve => {
      if (!settings.voice) { stopClip(); return resolve(false); }
      stopClip(); stopMusic(1.4); const mine = turn; // if anything else starts talking while this line loads, "turn" moves on and this line stays quiet
      try {
        const ac = audio(), sound = await loadClip(url);
        if (ac.state === "suspended") await ac.resume();
        if (mine !== turn) return resolve(false);
        if (ac.state !== "running") throw new Error("sound is blocked");
        const src = ac.createBufferSource(); src.buffer = sound; src.connect(ac.destination);
        src.onended = () => { if (playing === src) playing = null; resolve(true); if (musicNext) setTimeout(() => { const go = musicNext; if (go && !playing) { musicNext = null; go(); } }, 350); }; // music that was waiting for the voice to finish starts now
        src.cutOff = () => resolve(false); // another line interrupted this one
        stopMusic(1.4); playing = src; src.start(); // a voice always takes over from the music, which fades away gently instead of stopping dead
      } catch (e) { if (mine === turn) say(fallback).then(resolve); else resolve(false); }
    });
  }

  // ---------- little sounds (made by the computer, no sound files) ----------
  // iPhones mute this kind of sound when the ring/silent switch is on silent, though the device's reading voice still talks.
  // Telling Safari the game is "playback" (like a video) keeps the recordings and sound effects on. Older iPhones do not have that
  // setting, so there a silent sound on a loop does the same job. It has to start from a tap, so it runs on the first touch.
  let unmuted = false;
  function unmute() {
    if (unmuted) return; unmuted = true;
    try { if (navigator.audioSession) { navigator.audioSession.type = "playback"; return; } } catch (e) {}
    if (!/iPhone|iPad|iPod/.test(navigator.userAgent) && !(navigator.platform === "MacIntel" && navigator.maxTouchPoints > 1)) return;
    try { const n = 4000, b = new Uint8Array(44 + n), v = new DataView(b.buffer); // half a second of silence, as a tiny sound file
      [[0, 0x52494646], [8, 0x57415645], [12, 0x666d7420], [36, 0x64617461]].forEach(([at, word]) => v.setUint32(at, word));
      v.setUint32(4, 36 + n, true); v.setUint32(16, 16, true); v.setUint16(20, 1, true); v.setUint16(22, 1, true); v.setUint32(24, 8000, true); v.setUint32(28, 8000, true); v.setUint16(32, 1, true); v.setUint16(34, 8, true); v.setUint32(40, n, true);
      b.fill(128, 44);
      const a = new Audio(URL.createObjectURL(new Blob([b], { type: "../audio/wav" }))); a.loop = true; a.setAttribute("playsinline", "");
      const p = a.play(); if (p && p.catch) p.catch(() => { unmuted = false; }); } catch (e) { unmuted = false; }
  }
  ["touchend", "pointerup", "click"].forEach(ev => document.addEventListener(ev, unmute, true));
  // ---------- music (a short theme and a few jingles, in audio/music/) ----------
  // Music never plays over a voice: it stops the moment a recorded line starts, and a tune asked for while a line is
  // being spoken waits until the line is over. "Music" in the grown-ups panel switches it all off.
  // music(name) hands back true if music is switched on (so the game can skip its own beeps), false if not.
  let musicNow = null, musicGain = null, musicNext = null;
  function stopMusic(fade) {
    musicNext = null; if (!musicNow) return; const src = musicNow, g = musicGain, ac = AC; musicNow = null; fade = fade === undefined ? 0.35 : fade;
    try { g.gain.cancelScheduledValues(ac.currentTime); g.gain.setValueAtTime(g.gain.value, ac.currentTime); g.gain.linearRampToValueAtTime(0, ac.currentTime + fade); src.stop(ac.currentTime + fade + 0.05); } catch (e) { try { src.stop(); } catch (e2) {} }
  }
  function music(name, loud) {
    if (!settings.music) return false;
    if (playing) { musicNext = () => music(name, loud); return true; } // a voice is talking: the tune waits its turn
    musicNext = null; const mine = turn;
    (async () => { try {
      const ac = audio(), sound = await loadClip("../audio/music/" + name + ".mp3");
      if (playing) { musicNext = () => music(name, loud); return; } // a voice started while the tune loaded: wait for it to finish
      if (!settings.music || mine !== turn || !ac || ac.state !== "running") return; // the screen changed while it loaded
      stopMusic(0.05); const src = ac.createBufferSource(), g = ac.createGain(); g.gain.value = loud || 0.55;
      src.buffer = sound; src.connect(g); g.connect(ac.destination); src.onended = () => { if (musicNow === src) musicNow = null; };
      musicNow = src; musicGain = g; src.start();
    } catch (e) {} })();
    return true;
  }
  let AC = null;
  function audio() { if (!AC) { try { AC = new (window.AudioContext || window.webkitAudioContext)(); } catch (e) {} } if (AC && AC.state === "suspended") AC.resume(); return AC; }
  function tone(freq, start, len, type, vol) {
    const ac = audio(); if (!ac || !settings.sound) return;
    const o = ac.createOscillator(), g = ac.createGain();
    o.type = type || "sine"; o.frequency.value = freq;
    const t = ac.currentTime + start;
    g.gain.setValueAtTime(0.0001, t); g.gain.exponentialRampToValueAtTime(vol || 0.2, t + 0.02); g.gain.exponentialRampToValueAtTime(0.0001, t + len);
    o.connect(g); g.connect(ac.destination); o.start(t); o.stop(t + len + 0.05);
  }
  const sfx = {
    tap:     () => tone(520, 0, .08, "triangle", .12),
    yes:     () => { tone(523, 0, .15, "triangle"); tone(659, .12, .15, "triangle"); tone(784, .24, .25, "triangle"); },
    oops:    () => { tone(300, 0, .18, "sine", .12); tone(250, .12, .22, "sine", .12); },
    sparkle: () => { [1319, 1568, 2093].forEach((f, i) => tone(f, i * .07, .12, "sine", .12)); },
    boing:   () => { tone(220, 0, .09, "sine"); tone(330, .07, .14, "sine"); },
    party:   () => { [523, 659, 784, 1047, 784, 1047].forEach((f, i) => tone(f, i * .13, .22, "triangle")); },
    whistle: () => { [0, .45].forEach(s => { tone(740, s, s ? .7 : .3, "square", .05); tone(932, s, s ? .7 : .3, "square", .05); }); },
    chug:    () => { for (let i = 0; i < 8; i++) tone(110, i * .22, .1, "sawtooth", .07); }
  };

  // ---------- effects ----------
  function animate(el, cls) { el.classList.remove(cls); void el.offsetWidth; el.classList.add(cls); }
  const PARTY = ["#ff5a5f", "#4d9de0", "#ffd23f", "#58b368", "#ff9f43", "#a06cd5", "#ff8fb1", "#3fc1c9"];
  function confetti(n) {
    const fx = $("fx"); if (!fx) return;
    for (let i = 0; i < (n || 40); i++) {
      const c = document.createElement("div"); c.className = "confetti";
      c.style.left = rand(100) + "vw"; c.style.background = pick(PARTY);
      c.style.animationDuration = (1.6 + Math.random() * 1.8) + "s"; c.style.animationDelay = (Math.random() * .6) + "s";
      fx.appendChild(c); setTimeout(() => c.remove(), 4500);
    }
  }
  // Press and hold a button for a moment before it works (keeps little fingers out of the grown-ups panel).
  function hold(btn, fn) {
    let timer = null;
    const end = () => { btn.classList.remove("holding"); clearTimeout(timer); };
    const start = () => { btn.classList.add("holding"); clearTimeout(timer); timer = setTimeout(() => { end(); fn(); }, 1500); };
    btn.addEventListener("pointerdown", e => { e.preventDefault(); start(); });
    ["pointerup", "pointerleave", "pointercancel"].forEach(ev => btn.addEventListener(ev, end));
    btn.addEventListener("contextmenu", e => e.preventDefault());
    // with a keyboard: hold Enter or the space bar on the gear
    btn.addEventListener("keydown", e => { if ((e.key === "Enter" || e.key === " ") && !e.repeat) { e.preventDefault(); start(); } });
    btn.addEventListener("keyup", e => { if (e.key === "Enter" || e.key === " ") end(); });
    btn.addEventListener("blur", end);
  }
  // When talking is switched off, a question still has to make sense, so its words are shown in writing.
  // A picture that only means "listen" (the ear) is replaced by the words; a passage already holds its own question.
  function writtenBubble(q, always) { // always: the grade writes the question under the picture even when talking is on (older readers)
    if ((settings.voice && (!always || q.bubble.includes("👂"))) || q.bubble.includes('class="passage"')) return { html: q.bubble, quiet: false }; // a listening question (the ear) is heard, not shown, or the screen would give away the spelling
    const words = q.read !== undefined ? q.read : q.say;
    return { html: (q.bubble.includes("👂") ? "" : `<div class="rowx">${q.bubble}</div>`) + `<div class="said">${words}</div>`, quiet: true };
  }
  const esc = s => String(s).replace(/[&<>"]/g, c => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c]));

  // Stop pinch-zoom and double-tap zoom so little fingers can't shrink the game.
  document.addEventListener("gesturestart", e => e.preventDefault());
  document.addEventListener("dblclick", e => e.preventDefault());

  const VERSION = "62"; // shown in the grown-ups panel, so you can tell which copy a device is running. Go up by one with each published change.
  return { reviewing, startReview, endReview, needsChild, guard, VERSION, makeBackup, readBackup, restoreBackup, markBackedUp, lastBackup, niceDate, track, LESSONS, STRANDS, strandOf, askStrand, lessonStrands, finish, finished, finishedEverything,dropOneWrong, hintHelper, lessonHelper, writtenBubble, sayAndWait, playClip, loadClip, clipName, players, currentPlayer, setCurrent, addPlayer, setAge, ageOf, startBook, removePlayer, load, save, stamps, stamp, settings, saveSettings,
    englishVoices, chooseVoice, currentVoice: () => voice, say, hush, music, stopMusic, audio, sfx, animate, confetti, hold, esc };
})();
