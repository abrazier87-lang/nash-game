/* =====================================================================
   VOICE CHECK - a test helper, not part of any game.
   Finds every line a game can say that has no recording (it would fall back to the robotic device voice).

   How it is run (by Claude, in the test browser, on a game's own page served from this laptop):
     Dr. Somebody games:  voiceCheck({ g: "g3", numberPieces: true, scenes: [CHINA_FACTS, CHINA_TOUR], rounds: 4000 })
     Pip and Dot:         voiceCheckLive({ game: "pip", rounds: 3000 })   or   { game: "dot", rounds: 400 }  (Dot: rounds for each animal)
   Each one plays every place at every step many times over (questions, right and wrong answers, hints,
   worked answers, lessons, celebration scenes) and compares each spoken piece with audio/lines.json.
   voiceSave("name.json") then saves what was missing, tools/add-voice-lines.py adds it to audio/lines.json,
   and tools/make-voice.py records it. Run this before publishing any change to what a game says.
   ===================================================================== */
window.voiceCheck = async function (o) {
  const R = window.__voice = { done: false, at: "", checked: 0, missing: {}, direct: {}, errors: {} };
  const book = await (await fetch("audio/lines.json?x=" + Date.now())).json();
  const have = new Set(Object.keys(book.lines));
  const F = { line: `audio/${o.g}/l/`, lesson: `audio/${o.g}/lesson/`, scene: `audio/${o.g}/scene/` };
  // the same way shared/story.js cuts a line into recorded pieces
  const sentencePieces = w => (String(w).match(/[^.!?]+[.!?]+|[^.!?]+$/g) || [String(w)]).map(s => s.trim()).flatMap(s => s.split(/(?<=,)\s+/)).filter(Boolean);
  const numberWords = tok => { const n = parseInt(tok.replace(/,/g, ""), 10); return n >= 1000 && n < 1000000 ? [String(Math.floor(n / 1000)), "thousand"].concat(n % 1000 ? [String(n % 1000)] : []) : [String(n)]; };
  const splitNumbers = p => p.split(/(\d[\d,]*\d|\d)/).flatMap((part, i) => { if (i % 2) return numberWords(part); const t = part.replace(/^[\s,.;:!?]+|[\s,;:]+$/g, "").trim(); return t && /[a-z]/i.test(t) ? [t] : []; });
  const pieces = w => { const ps = sentencePieces(w); return o.numberPieces ? ps.flatMap(p => /\d/.test(p) ? splitNumbers(p) : [p]) : ps; };

  let ctx = "";
  const note = (kind, text, whole) => {
    R.checked++;
    const url = F[kind] + Kit.clipName(text) + ".mp3";
    if (have.has(url)) return;
    const m = R.missing[url] || (R.missing[url] = { kind, text, n: 0, where: ctx, from: whole && whole !== text ? String(whole).slice(0, 160) : "" });
    m.n++;
  };
  const talk = (words, what) => { if (words === undefined || words === null) { bump(R.errors, ctx + " " + what + ": nothing to say"); return; } pieces(words).forEach(p => note("line", p, words)); };
  const bump = (bag, key) => { bag[key] = (bag[key] || 0) + 1; };

  // while checking: timers run at once, and nothing really plays
  const real = { st: window.setTimeout.bind(window), play: Kit.playClip, load: Kit.loadClip, say: Kit.say, saw: Kit.sayAndWait };
  const ch = new MessageChannel(), jobs = []; ch.port1.onmessage = () => { const j = jobs.shift(); if (j) j(); };
  window.setTimeout = (f, ms, ...a) => { jobs.push(() => f(...a)); ch.port2.postMessage(0); return 0; };
  Kit.playClip = (url, words) => { bump(R.direct, "plays " + url + (have.has(url) ? "" : "  (NOT RECORDED: " + words + ")")); return Promise.resolve(true); };
  Kit.loadClip = () => Promise.resolve(null);
  Kit.say = words => { bump(R.direct, "DEVICE VOICE at " + ctx + ": " + words); return Promise.resolve(true); };
  Kit.sayAndWait = words => { bump(R.direct, "DEVICE VOICE at " + ctx + ": " + words); return Promise.resolve(true); };
  const breathe = () => new Promise(r => { jobs.push(r); ch.port2.postMessage(0); }); // lets the page catch its breath (a real timer would be slowed right down while the page is hidden)

  const helper = (q, kind) => { // stands in for the hint and lesson tools
    const bubble = document.createElement("div"); bubble.className = "bubble"; bubble.innerHTML = q ? q.bubble : "";
    const cards = q ? q.choices.map(c => { const el = document.createElement("button"); el.className = "choice"; el.innerHTML = c.html; el._ch = c; return { el, ch: c }; }) : [];
    return { q, bubble, alive: () => true, show: html => { let b = bubble.querySelector(".hintbox"); if (!b) { b = document.createElement("div"); b.className = "hintbox"; bubble.appendChild(b); } b.innerHTML = html; },
      say: async words => { if (kind === "lesson") note("lesson", words); else talk(words, kind); return true; },
      cards: () => cards, glow: (el, on) => el && el.classList.toggle("glow", !!on), label: () => {}, wait: async () => {},
      frame: html => { bubble.innerHTML = html; } };
  };
  const tryIt = async (what, f) => { try { await f(); } catch (e) { bump(R.errors, ctx + " " + what + ": " + (e && e.message)); } };

  try {
    const T = Story, rounds = o.rounds || 300;
    for (const id of (o.only || T.GAME_IDS)) {
      const g = T.GAMES[id];
      ctx = id + " intro"; note("lesson", g.intro); talk(g.intro, "intro"); note("lesson", "Now it's your turn!");
      for (let step = 1; step <= 4; step++) {
        ctx = id + " step " + step; R.at = ctx;
        if (g.lesson) for (let i = 0; i < 25; i++) await tryIt("lesson", () => g.lesson(helper(null, "lesson"), step));
        for (let i = 0; i < rounds; i++) {
          let q; try { q = g.makeQuestion(step); } catch (e) { bump(R.errors, ctx + " question: " + e.message); continue; }
          talk(q.say, "question"); if (q.help) talk(q.help, "help"); if (q.again) talk(q.again, "again"); talk(q.yay, "right answer");
          q.choices.forEach(c => { if (!c.ok) talk(c.wrong, "wrong answer"); });
          if (q.hint) await tryIt("hint", () => q.hint(helper(q, "hint")));
          if (q.explain) await tryIt("worked answer", () => q.explain(helper(q, "worked answer")));
          if (i % 50 === 49) await breathe();
        }
      }
    }
    ctx = "celebration scene";
    const walk = x => { if (!x) return; if (Array.isArray(x)) x.forEach(walk); else if (typeof x === "object") { if (typeof x.say === "string") note("scene", x.say); Object.values(x).forEach(v => typeof v === "object" && walk(v)); } };
    (o.scenes || []).forEach(walk);
  } finally {
    window.setTimeout = real.st; Kit.playClip = real.play; Kit.loadClip = real.load; Kit.say = real.say; Kit.sayAndWait = real.saw;
    R.done = true; R.at = "finished";
  }
  return R;
};
// Hands the missing pieces to the local test server, which saves them as .claude/<name> ({ "sound file": "words" }).
window.voiceSave = async name => {
  const out = Object.fromEntries(Object.entries(window.__voice.missing).map(([url, m]) => [url, m.text]));
  const r = await fetch("/__save?name=" + encodeURIComponent(name), { method: "POST", body: JSON.stringify(out) });
  return name + ": " + Object.keys(out).length + " saved (" + r.status + ")";
};
// Little helpers for running a check from the test browser in short visits.
window.__lim = () => new Promise(r => { const s = Date.now(), mc = new MessageChannel(); mc.port1.onmessage = () => { if (window.__saved || window.__voiceErr || Date.now() - s > 38000) r(); else mc.port2.postMessage(0); }; mc.port2.postMessage(0); });
window.__go = (o, name, run) => { window.__saved = null; window.__voiceErr = null; (run || window.voiceCheck)(o).then(() => window.voiceSave(name)).then(s => { window.__saved = s; }).catch(e => { window.__voiceErr = String(e && e.stack || e); }); };
window.__st = () => JSON.stringify({ at: window.__voice.at, checked: window.__voice.checked, n: Object.keys(window.__voice.missing).length, once: Object.values(window.__voice.missing).filter(m => m.n === 1).length, saved: window.__saved, errors: window.__voice.errors, err: window.__voiceErr });

// ---------- Pip's Lost Eggs and Dot's Busy Train ----------
// These two games are driven for real: their own code builds and says every line, but the sound itself is
// swapped for a note-taker, timers run at once, and nothing is saved to the child's progress.
window.voiceCheckLive = async function (o) {
  const R = window.__voice = { done: false, at: "", checked: 0, missing: {}, direct: {}, errors: {} };
  const book = await (await fetch("audio/lines.json?x=" + Date.now())).json();
  const have = new Set(Object.keys(book.lines));
  const dot = o.game === "dot", folder = "audio/" + o.game + "/";
  let ctx = "";
  const bump = (bag, key) => { bag[key] = (bag[key] || 0) + 1; };
  const used = new Set(); R.used = () => used.size; R.unused = () => Object.entries(book.lines).filter(([p]) => p.startsWith(folder) && !used.has(p)).map(([p, v]) => v[1]); R.inBook = Object.keys(book.lines).filter(p => p.startsWith(folder)).length; // how many different recordings the game asked for, out of how many it has
  const seen = (url, words) => { R.checked++; used.add(url); if (have.has(url)) return; const m = R.missing[url] || (R.missing[url] = { kind: "line", text: String(words), n: 0, where: ctx, from: "" }); m.n++; };
  const device = words => { bump(R.direct, "DEVICE VOICE at " + ctx + ": " + words); return Promise.resolve(true); };

  // swap the real sound, timers and saving for stand-ins (all put back at the end)
  const home = dot ? Kit : window, names = dot ? ["playClip", "loadClip", "say", "sayAndWait", "save", "track", "stamp"] : ["playClip", "loadClip", "say", "sayAndWait", "save", "track", "stamp", "choose"];
  const real = { st: window.setTimeout.bind(window) }; names.forEach(n => { real[n] = home[n]; });
  const ch = new MessageChannel(), jobs = []; ch.port1.onmessage = () => { const j = jobs.shift(); if (j) j(); };
  window.setTimeout = (f, ms, ...a) => { jobs.push(() => f(...a)); ch.port2.postMessage(0); return 0; };
  const breathe = () => new Promise(r => { jobs.push(r); ch.port2.postMessage(0); });
  home.playClip = (url, words) => { seen(url, words); return Promise.resolve(true); };
  home.loadClip = () => Promise.resolve(null);
  home.say = device; home.sayAndWait = device; home.save = () => {}; home.track = () => {}; home.stamp = () => {};
  let tapped = null; if (!dot) window.choose = (el, c) => { if (tapped) tapped.push(c); }; // Pip's "tap a body part" questions: note what each tap would say
  const voiceWas = dot ? Kit.settings.voice : S.voice, saved = JSON.stringify(S), wasG = G;
  if (dot) Kit.settings.voice = true; else S.voice = true;
  const tryIt = async (what, f) => { try { await f(); } catch (e) { bump(R.errors, ctx + " " + what + ": " + (e && e.message)); } };
  const tools = q => dot ? helper(q, () => true) : helper(() => true);

  try {
    const rounds = o.rounds || 1500;
    for (const id of (o.only || GAME_IDS)) {
      const g = GAMES[id];
      for (let step = 1; step <= 4; step++) {
       // In Dot's game any animal can be waiting at any station, and the lines name that animal's snack: try every animal.
       for (const rider of (dot ? PASSENGERS : [null])) {
        ctx = id + " step " + step + (rider ? " (" + rider.name + ")" : ""); R.at = ctx; S.skill[id] = step;
        G = dot ? { id, p: rider, need: 1e9, stars: 0, streak: 0, rough: 0, q: null, busy: false, first: true, last: "", hints: 1, count: 0, guided: 0 }
                : { id, stars: 0, streak: 0, rough: 0, q: null, busy: false, first: true, lastSay: "", hints: 1, count: 0, guided: 0 };
        if (g.lesson) for (let i = 0; i < 20; i++) await tryIt("lesson", async () => { const P = dot ? helper(null, () => true, true) : helper(() => true); await g.lesson(P, step); await P.say("Now you try!"); });
        await tryIt("try again", () => talk("Let's try this one again!"));
        for (let i = 0; i < rounds; i++) {
          await tryIt("question", async () => {
            G.busy = false; nextQuestion(); const q = G.q; // draws the question and asks it
            await talk(q.yay);
            let wrongs;
            if (q.render) { tapped = []; document.querySelectorAll("#choices [data-part]").forEach(el => (el.firstElementChild || el).dispatchEvent(new MouseEvent("click", { bubbles: true }))); wrongs = tapped.filter(c => !c.ok); tapped = null; }
            else wrongs = q.choices.filter(c => !c.ok);
            for (const c of wrongs) await talk(dot ? [c.wrong].concat(q.again || q.sayParts || q.say) : [c.wrong || `That is the ${c.name}.`].concat(q.sayParts || q.say));
            if (q.hint) await q.hint(tools(q));
            if (dot && q.teach) await countAlong(q);
            if (q.explain) await q.explain(tools(q));
          });
          if (i % 25 === 24) await breathe();
        }
       }
      }
    }
    // the lines with their own names ("hello", "wish-lion", "num-7"...): every one the game's code can ask for
    ctx = "named line";
    const src = await (await fetch(location.pathname + "?x=" + Date.now())).text();
    const nums = n => Array.from({ length: n }, (_, i) => i + 1);
    const grow = dot ? { "num-": nums(20), "won-": PASSENGERS.map(p => p.name), "wish-": PASSENGERS.map(p => p.name), "boarded-": PASSENGERS.map(p => p.name), "fair-": PASSENGERS.map(p => p.name), "intro-": GAME_IDS, "left": nums(CAR_COLORS.length - 1) }
                     : { "intro-": GAME_IDS, "hatch-": FRIEND_COLORS.flatMap(c => ["longneck", "spiky", "horned", "pip"].map(k => c + "-" + k)) };
    for (const m of src.matchAll(/\bspeak\(\s*(?:"([^"]*)"\s*([,+])|`([^`$]*)\$\{)/g)) {
      const name = m[1] !== undefined ? m[1] : m[3], whole = m[2] === ",";
      if (whole) seen(folder + name + ".mp3", "(the line named " + name + ")");
      else if (grow[name]) grow[name].forEach(x => seen(folder + name + x + ".mp3", "(the line named " + name + x + ")"));
      else bump(R.errors, "a new kind of named line, \"" + name + "...\": the checker needs to be taught about it");
    }
    // celebration scenes
    ctx = "celebration scene";
    seen(folder + "doc/" + (dot ? Kit.clipName : clipName)(DOC_HELLO.say) + ".mp3", DOC_HELLO.say);
    if (dot) for (const fact of Object.values(ANIMAL_FACTS)) await talk(fact, true);
    else for (const stop of PIP_FACTS) await talk(stop.say);
    if (dot) { const missingFact = PASSENGERS.filter(p => !ANIMAL_FACTS[p.name]).map(p => p.name); if (missingFact.length) bump(R.errors, "no fun fact for: " + missingFact.join(", ")); }
  } finally {
    window.setTimeout = real.st; names.forEach(n => { home[n] = real[n]; });
    if (dot) Kit.settings.voice = voiceWas;
    S = JSON.parse(saved); G = wasG; // put the child's progress and settings back exactly as they were
    R.done = true; R.at = "finished";
  }
  return R;
};

// Picks the right check for whichever game page it is on, with enough rounds to catch the rare lines.
// (Grades 3 and 4 say their numbers in pieces, "numberPieces" in their settings; keep this list in step with the games.)
window.voiceCheckHere = () => {
  const page = decodeURIComponent(location.pathname);
  if (/dots-busy-train/.test(page)) return window.voiceCheckLive({ game: "dot", rounds: 400 });
  if (/Pips Lost Eggs/.test(page)) return window.voiceCheckLive({ game: "pip", rounds: 3000 });
  if (/grade1-space/.test(page)) return window.voiceCheck({ g: "g1", numberPieces: false, scenes: [SPACE_FACTS, SPACE_TOUR], rounds: 8000 });
  if (/grade2-egypt/.test(page)) return window.voiceCheck({ g: "g2", numberPieces: false, scenes: [EGYPT_FACTS, EGYPT_TOUR], rounds: 12000 });
  if (/grade3-china/.test(page)) return window.voiceCheck({ g: "g3", numberPieces: true, scenes: [CHINA_FACTS, CHINA_TOUR], rounds: 4000 });
  if (/grade4-rome/.test(page)) return window.voiceCheck({ g: "g4", numberPieces: true, scenes: [ROME_FACTS, ROME_TOUR], rounds: 4000 });
  return Promise.reject(new Error("voice check: this page is not a game it knows. Add it to voiceCheckHere in tools/voice-check.js"));
};
