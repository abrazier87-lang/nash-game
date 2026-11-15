"use strict";
/* =====================================================================
   THE STORY GAME ENGINE  (used by Grade 1 and up)
   A grade's page gives this engine its story: the host character, the
   places on the map, the questions, and what the host says. The engine
   runs everything else: asking questions, stars, making it harder or
   easier, the reward after each place, the big finish, saving, and the
   grown-ups panel.
   Needs shared/kit.js loaded first.
   ===================================================================== */

// ---------- helpers for writing questions ----------
const NUM = ["zero", "one", "two", "three", "four", "five", "six", "seven", "eight", "nine", "ten", "eleven", "twelve", "thirteen", "fourteen", "fifteen", "sixteen", "seventeen", "eighteen", "nineteen", "twenty"];
const INK = ["#ff5a5f", "#4d9de0", "#58b368", "#ff9f43", "#a06cd5", "#3fc1c9"];
const big = (text, size, color) => `<span style="font-size:${size || 12}vmin${color ? ";color:" + color : ""}">${text}</span>`;
const emo = (e, cls) => `<span class="emoji${cls ? " " + cls : ""}">${e}</span>`;
const tiles = arr => { const sz = arr.some(x => String(x).length > 2) ? "s xs" : "s"; return arr.map(x => x === "?" ? `<div class="q ${sz}">?</div>` : `<div class="tile ${sz}">${x}</div>`).join(""); }; // smaller boxes for big numbers
// Number answer cards: the right answer plus close wrong ones. "near" can list the wrong answers to prefer.
function numCards(n, lo, hi, count, near) {
  count = count || 3;
  let pool = [...new Set((near || []).concat([n - 1, n + 1, n - 2, n + 2, n + 3, n - 3, n + 4, n + 5]))].filter(k => k >= lo && k <= hi && k !== n);
  const first = shuffle(pool.slice(0, Math.max(count - 1, (near || []).length || 4)));
  const wrong = first.concat(pool.filter(k => !first.includes(k))).slice(0, count - 1);
  return wrong.concat(n).sort((a, b) => a - b).map(k => ({ html: String(k), ok: k === n, wrong: `That is ${k}.` }));
}

// ---------- Dr. Somebody's pictures (the same in every grade) ----------
// The owl. "behind" and "front" let a grade add a costume: shapes drawn behind the head, or on top of everything.
const owl = (behind, front) => `<svg viewBox="0 0 200 160"><ellipse cx="84" cy="152" rx="12" ry="5" fill="#ff9f43"/><ellipse cx="116" cy="152" rx="12" ry="5" fill="#ff9f43"/>
  <ellipse cx="100" cy="108" rx="44" ry="46" fill="#9c6b3f"/><ellipse cx="100" cy="116" rx="26" ry="32" fill="#f3dfb8"/>
  <path d="M58 92 Q52 130 66 150 L88 150 Q74 120 80 84 Z" fill="#fff"/><path d="M142 92 Q148 130 134 150 L112 150 Q126 120 120 84 Z" fill="#fff"/>
  <ellipse cx="54" cy="108" rx="10" ry="24" fill="#7a4f2a" transform="rotate(12 54 108)"/><ellipse cx="146" cy="108" rx="10" ry="24" fill="#7a4f2a" transform="rotate(-12 146 108)"/>
  ${behind || ""}<polygon points="62,34 70,6 88,26" fill="#7a4f2a"/><polygon points="138,34 130,6 112,26" fill="#7a4f2a"/>
  <ellipse cx="100" cy="50" rx="44" ry="36" fill="#9c6b3f"/><rect x="58" y="43" width="84" height="8" fill="#39405a"/>
  <circle cx="80" cy="48" r="19" fill="#d9a400"/><circle cx="120" cy="48" r="19" fill="#d9a400"/><circle cx="80" cy="48" r="14" fill="#fff"/><circle cx="120" cy="48" r="14" fill="#fff"/>
  <circle cx="83" cy="50" r="6" fill="#2b2d42"/><circle cx="117" cy="50" r="6" fill="#2b2d42"/><polygon points="92,63 108,63 100,77" fill="#ff9f43"/>${front || ""}</svg>`;
// The clock balloon (the time machine).
const BALLOON = `<svg viewBox="0 0 160 200"><path d="M80 6 C28 6 14 50 20 82 C26 112 56 132 80 140 C104 132 134 112 140 82 C146 50 132 6 80 6 Z" fill="#ff5a5f"/>
  <path d="M80 6 C58 20 50 60 56 96 C60 118 72 134 80 140 C88 134 100 118 104 96 C110 60 102 20 80 6 Z" fill="#ffd23f"/>
  <circle cx="80" cy="70" r="34" fill="#fff" stroke="#39405a" stroke-width="5"/>
  <g stroke="#39405a" stroke-width="4" stroke-linecap="round"><line x1="80" y1="42" x2="80" y2="48"/><line x1="80" y1="92" x2="80" y2="98"/><line x1="52" y1="70" x2="58" y2="70"/><line x1="102" y1="70" x2="108" y2="70"/></g>
  <line x1="80" y1="70" x2="80" y2="50" stroke="#39405a" stroke-width="5" stroke-linecap="round"/><line x1="80" y1="70" x2="97" y2="79" stroke="#ff5a5f" stroke-width="4" stroke-linecap="round"/><circle cx="80" cy="70" r="4" fill="#39405a"/>
  <line x1="56" y1="130" x2="62" y2="162" stroke="#c9a37a" stroke-width="3"/><line x1="104" y1="130" x2="98" y2="162" stroke="#c9a37a" stroke-width="3"/>
  <circle cx="80" cy="154" r="13" fill="#9c6b3f"/><circle cx="75" cy="152" r="5" fill="#fff"/><circle cx="85" cy="152" r="5" fill="#fff"/><circle cx="75" cy="152" r="2" fill="#2b2d42"/><circle cx="85" cy="152" r="2" fill="#2b2d42"/>
  <rect x="56" y="160" width="48" height="32" rx="7" fill="#c48a4a"/><rect x="56" y="160" width="48" height="7" rx="3" fill="#9c6830"/></svg>`;
// The row of rewards beside the balloon: each one found shows with a little badge (a crystal, a gear...).
const slots = (list, badge) => list.map(e => e ? `<div class="slot">${e}<i>${badge}</i></div>` : `<div class="slot empty"></div>`).join("");
// A clock face showing h hours and m minutes.
function clock(h, m) {
  const ha = ((h % 12) + m / 60) * 30, ma = m * 6;
  const nums = Array.from({ length: 12 }, (_, i) => { const n = i + 1, a = n * 30 * Math.PI / 180; return `<text x="${(50 + 38 * Math.sin(a)).toFixed(1)}" y="${(53.5 - 38 * Math.cos(a)).toFixed(1)}" font-size="10" text-anchor="middle" fill="#2b2d42" font-weight="bold">${n}</text>`; }).join("");
  return `<svg viewBox="0 0 100 100"><circle cx="50" cy="50" r="47" fill="#fff" stroke="#d9a400" stroke-width="5"/>${nums}
    <line x1="50" y1="50" x2="50" y2="31" stroke="#2b2d42" stroke-width="5" stroke-linecap="round" transform="rotate(${ha} 50 50)"/>
    <line x1="50" y1="50" x2="50" y2="20" stroke="#ff5a5f" stroke-width="3" stroke-linecap="round" transform="rotate(${ma} 50 50)"/><circle cx="50" cy="50" r="3.5" fill="#2b2d42"/></svg>`;
}
const timeText = (h, m) => `${h}:${String(m).padStart(2, "0")}`; // how it is written: 3:05
const timeSaid = (h, m) => m === 0 ? `${h} o'clock` : m === 30 ? `half past ${h}` : m === 15 ? `quarter past ${h}` : m === 45 ? `quarter to ${h % 12 + 1}` : `${h} ${m < 10 ? "oh " + m : m}`; // how it is said

// The list of a grade's recorded story lines: recorded("audio/g1/", 3) means the files are in audio/g1/ and
// there are "left1", "left2" and "left3" lines ("we need one more...", "two more...", "three more...").
const recorded = (folder, lefts) => Object.fromEntries(["hello", "start", "won", "boarded", "finale", "again"].concat(Array.from({ length: lefts }, (_, i) => "left" + (i + 1)))
  .map(k => [k, folder + k + ".mp3"]).concat([["replay", "audio/replay.mp3"]]));

/* C (the story) has:
   title, sub ("A Grade 1 adventure"), gradeLabel, hostName, host (picture), scenery (background),
   saveKey, medal (id for the shelf), games, gameIds, stepNames, need (rewards to finish), starsToWin,
   rewards: [[name, picture]], finaleTitle, stickersLabel,
   progress(list) and finaleArt(list): pictures of how far along the story is,
   lines: what the host says - hello(name), start, left(n), won(who), boarded(who), finale(name), again, replay, test(name) */
// Shrinks the writing on an answer card when a long number or word would not fit (for example 1,250).
function fitText(card) {
  if (card.firstElementChild || !card.clientWidth) return; // cards holding pictures or styled text look after themselves
  const cs = getComputedStyle(card), pen = fitText.pen || (fitText.pen = document.createElement("canvas").getContext("2d"));
  pen.font = `${cs.fontWeight} ${cs.fontSize} ${cs.fontFamily}`;
  const wide = pen.measureText(card.textContent).width, room = card.clientWidth * 0.84;
  if (wide > room) card.style.fontSize = (parseFloat(cs.fontSize) * room / wide / (Math.min(innerWidth, innerHeight) / 100)).toFixed(2) + "vmin";
}

function StoryGame(C) {
  const { sfx, animate, confetti } = Kit;
  // The host's own recorded voice for every line (C.lineVoice is the folder). Lines mix things that change (numbers, words),
  // so they are recorded in pieces: each sentence, split again at its commas, and each piece is shared by many lines.
  // A piece with no recording is said by the device voice. Without C.lineVoice, the device voice says everything.
  const lineUrl = w => C.lineVoice + Kit.clipName(w) + ".mp3";
  const pieces = w => (String(w).match(/[^.!?]+[.!?]+|[^.!?]+$/g) || [String(w)]).map(s => s.trim()).flatMap(s => s.split(/(?<=,)\s+/)).filter(Boolean);
  async function talk(words) {
    const parts = pieces(words); parts.forEach(p => Kit.loadClip(lineUrl(p)).catch(() => {}));
    for (const p of parts) if (!(await Kit.playClip(lineUrl(p), p))) return false;
    return true;
  }
  const say = (words, force) => C.lineVoice ? talk(words) : Kit.say(words, force);
  const sayAndWait = async (words, quietPause) => { if (!C.lineVoice) return Kit.sayAndWait(words, quietPause); if (!Kit.settings.voice) return wait(quietPause); if (await talk(words)) await wait(450); };
  const helperFor = (q, alive) => { // the hint tools (shared/kit.js), speaking in the host's recorded voice
    const H = Kit.hintHelper({ bubble: $("bubble"), box: $("choices"), q, alive });
    if (C.lineVoice) { const plain = H.say; H.say = (words, clip) => plain(words, clip || (() => talk(words))); }
    return H;
  };
  const PLAYER = Kit.currentPlayer(), NAME = PLAYER ? PLAYER.name : "";
  const GAMES = C.games, GAME_IDS = C.gameIds, NEED = C.need || 4, STARS = C.starsToWin || 5;

  // ---------- saved progress (kept on this device, one copy per child) ----------
  const fresh = () => ({ skill: Object.fromEntries(GAME_IDS.map(id => [id, 1])), aboard: {}, stickers: [], trips: 0, auto: true });
  let S = Kit.load(C.saveKey, fresh);
  const save = () => Kit.save(C.saveKey, S);
  const got = () => GAME_IDS.filter(id => S.aboard[id]).map(id => S.aboard[id]);
  // The host's story lines. If the grade has a recording for a line (C.voice), play it; if not, the device voice says the words.
  const speak = (key, words) => C.voice && C.voice[key] ? Kit.playClip(C.voice[key], words) : Kit.say(words);

  // ---------- the page ----------
  const play = label => `<button class="bigbtn go" id="${label}" aria-label="Keep going"><span class="tri"></span></button>`;
  $("app").innerHTML = `
    <div class="layer">${C.scenery || ""}</div><div class="layer" id="fx"></div>
    <div class="screen on" id="title"><h1>${C.title}</h1><p class="sub" id="titleSub"></p><div class="host big" id="titleHost">${C.titleArt || C.host}</div>
      <button class="bigbtn" id="playBtn" aria-label="Play"><span class="tri"></span></button></div>
    <div class="screen" id="map"><div class="places" id="places"></div><div class="progress" id="progress"></div><div class="stickers" id="stickers"></div></div>
    <div class="screen" id="game"><div class="stars" id="stars"></div>
      <div class="ask"><button class="host" id="gameHost" aria-label="Say it again">${C.host}</button><div class="bubble" id="bubble"></div></div>
      <div class="choices" id="choices"></div></div>
    <div class="screen" id="board"><button class="stage" id="boardStage" aria-label="Tap it"></button>${play("boardGo")}</div>
    <div class="screen" id="finale"><h1>${C.finaleTitle}</h1><div id="finaleArt"></div>${play("finaleGo")}</div>
    <button class="corner left" id="homeBtn" aria-label="Back to the map" style="display:none">🏠</button>
    <button class="corner left" id="shelfBtn" aria-label="Back to the book shelf">📚</button>
    <button class="corner right" id="grownBtn" aria-label="Grown-ups: press and hold">⚙️</button>
    <button class="corner right hint" id="hintBtn" aria-label="Hint (one each round)" style="display:none">💡</button>
    <button class="corner right lesson" id="lessonBtn" aria-label="Show me how" style="display:none">📖</button>
    <div id="grown"><div class="panel" id="grownPanel"></div></div>`;
  $("titleSub").textContent = C.sub + (NAME ? " for " + NAME : "");

  let current = "title";
  function show(id) {
    document.querySelectorAll(".screen").forEach(s => s.classList.toggle("on", s.id === id));
    current = id;
    $("homeBtn").style.display = (id === "game") ? "" : "none";
    $("shelfBtn").style.display = (id === "title" || id === "map") ? "" : "none";
    $("grownBtn").style.display = (id === "title" || id === "map") ? "" : "none";
    $("hintBtn").style.display = (id === "game" && C.hints) ? "" : "none"; // only in grades that have hints
    $("lessonBtn").style.display = (id === "game" && C.lessons) ? "" : "none"; // only in grades that have lessons
  }

  // ---------- playing one place: Learn, then Try together, then Play ----------
  // In grades with lessons (C.lessons), the first visit to a place starts with a short "watch me" lesson,
  // the next two questions come with the help already showing, and the 📖 button replays the lesson any time.
  // After a second wrong try the host explains the answer step by step, and a question that needed help
  // comes back a little later ("bring it back"), because practising again after a short gap helps it stick.
  let G = null;
  const REVIEW = {}; // questions to bring back, for as long as the game is open: { place: [{ q, due }] }
  function startGame(id) {
    G = { id, stars: 0, streak: 0, rough: 0, q: null, busy: false, first: true, last: "", hints: 1, count: 0, guided: 0 }; // one hint per round
    $("hintBtn").classList.remove("used");
    $("stars").innerHTML = Array(STARS).fill('<div class="star">⭐</div>').join("");
    show("game");
    if (C.lessons && GAMES[id].lesson && !(S.learned || {})[id]) runLesson(true);
    else nextQuestion(GAMES[id].intro + " ");
  }
  async function runLesson(first) { // "Learn": the host works through one example, step by step
    const g = G; if (!g) return;
    Kit.hush(); g.lesson = true; g.busy = true; g.q = null;
    const box = $("choices"); box.innerHTML = ""; box.style.setProperty("--cs", "30vmin");
    const go = document.createElement("button"); go.className = "choice pop myturn"; go.innerHTML = "<span>My turn ▶</span>";
    go.addEventListener("click", () => { sfx.tap(); endLesson(g); }); // children can skip ahead whenever they like
    box.appendChild(go);
    const L = Kit.lessonHelper({ bubble: $("bubble"), alive: () => G === g && !!g.lesson });
    if (C.lessonVoice) { // the host's own recorded voice for lesson lines (C.lessonVoice is the folder); a line with no recording uses the device voice
      const plain = L.say; L.say = words => plain(words, () => Kit.playClip(C.lessonVoice + Kit.clipName(words) + ".mp3", words));
    }
    L.frame(`<div class="lessonart"><span class="big">${GAMES[g.id].icon}</span><br><b>${GAMES[g.id].name}</b></div>`); // clear the last question away straight away
    let ok = !first || await L.say(GAMES[g.id].intro);
    if (ok) { await GAMES[g.id].lesson(L, S.skill[g.id]); ok = L.alive(); }
    if (ok && await L.say("Now it's your turn!")) endLesson(g);
  }
  function endLesson(g) {
    if (G !== g || !g.lesson) return;
    Kit.hush(); g.lesson = false; g.busy = false;
    (S.learned || (S.learned = {}))[g.id] = true; save();
    g.guided = 2; // "Try together": the next two questions come with the help already showing
    nextQuestion();
  }
  function nextQuestion(lead) {
    const keyOf = q => String(q.key !== undefined ? q.key : q.say + q.bubble);
    let q, tries = 0;
    const queue = REVIEW[G.id] || [], due = queue.findIndex(r => r.due <= G.count);
    if (due >= 0) { q = queue.splice(due, 1)[0].q; q.reviewed = true; q.explained = false; lead = (lead || "") + "Here's a tricky one again. "; } // bring it back
    else do { q = GAMES[G.id].makeQuestion(S.skill[G.id]); tries++; } while (tries < 8 && keyOf(q) === G.last);
    G.last = keyOf(q); G.q = q; G.first = true; G.busy = false; G.hinted = false; G.wrongs = 0;
    const shown = Kit.writtenBubble(q); // with talking off, the question is also shown in writing
    $("bubble").innerHTML = shown.html; $("bubble").classList.toggle("tall", !!q.tall); $("bubble").classList.toggle("quiet", shown.quiet); $("bubble").classList.remove("lessonframe"); animate($("bubble"), "pop");
    const box = $("choices"); box.innerHTML = "";
    box.style.setProperty("--cs", q.choices.length >= 4 ? "22vmin" : q.choices.length === 3 ? "27vmin" : "32vmin");
    q.choices.forEach(ch => {
      const b = document.createElement("button"); b.className = "choice pop"; b.innerHTML = ch.html; b._ch = ch; // (the hint needs to know which card is which)
      b.addEventListener("click", () => choose(b, ch));
      box.appendChild(b); fitText(b);
    });
    const guide = C.lessons && G.guided > 0 && q.hint; // "Try together": show the help straight after asking
    if (guide) { G.guided--; G.hinted = true; }
    const asked = say((lead || "") + q.say), g = G;
    if (guide) asked.then(done => { if (G === g && g.q === q && !g.busy && (done || !Kit.settings.voice)) q.hint(helperFor(q, () => G === g && g.q === q && !g.busy)); });
  }
  async function choose(el, ch) {
    if (!G || G.busy || el.classList.contains("dim")) return;
    const q = G.q, box = $("choices");
    if (ch.ok) {
      G.busy = true; sfx.yes();
      animate($("gameHost"), "bounce");
      el.classList.add("right"); [...box.children].forEach(b => { if (b !== el) b.classList.add("dim"); });
      G.stars++; $("stars").children[G.stars - 1].classList.add("got"); G.count++;
      if (C.lessons && (!G.first || G.hinted) && !q.reviewed) (REVIEW[G.id] || (REVIEW[G.id] = [])).push({ q, due: G.count + 2 }); // it needed help: ask it again a little later
      const spoken = sayAndWait(q.yay, q.pause || 2500); // waits for the voice to finish; with the voice off, a short pause
      Kit.track(C.medal, C.title, G.id, GAMES[G.id].name, S.skill[G.id], q, G.first && !G.hinted, G.hinted); // for the progress report
      adjust(G.first && !G.hinted); // an answer found with a hint does not make the place harder
      await spoken;
      if (!G || G.q !== q) return;
      if (G.stars >= STARS) finishGame(); else nextQuestion();
    } else {
      sfx.oops(); G.first = false; G.wrongs = (G.wrongs || 0) + 1;
      animate(el, "wobble"); el.classList.add("dim");
      if (C.hints && G.hints > 0) animate($("hintBtn"), "wobble"); // a gentle nudge: a hint is there if they want it
      if (C.lessons && G.wrongs >= 2 && q.explain && !q.explained) { // a second wrong try: show how to work it out, step by step
        q.explained = true; const g = G;
        say(ch.wrong).then(done => { if (G === g && g.q === q && !g.busy && (done || !Kit.settings.voice)) q.explain(helperFor(q, () => G === g && g.q === q && !g.busy)); });
      } else say(`${ch.wrong} ${q.again || q.say}`);
    }
  }
  // Quietly make a place harder after 3 right in a row, easier after 2 hard questions in a row.
  function adjust(firstTry) {
    if (!S.auto) return;
    if (firstTry) { G.streak++; G.rough = 0; if (G.streak >= 3 && S.skill[G.id] < 4) { S.skill[G.id]++; G.streak = 0; } }
    else { G.rough++; G.streak = 0; if (G.rough >= 2 && S.skill[G.id] > 1) { S.skill[G.id]--; G.rough = 0; } }
    save();
  }
  function finishGame() {
    const id = G.id; G = null;
    if (S.aboard[id]) { sfx.party(); confetti(30); Promise.all([speak("replay", C.lines.replay), wait(2600)]).then(() => { if (current === "game") showMap(); }); } // back to the map once the host has finished // already won here this trip
    else startBoard(id);
  }

  // ---------- the reward after winning a place ----------
  let B = null;
  function startBoard(id) {
    const taken = got(), who = pick(C.rewards.filter(r => !taken.includes(r[1])));
    B = { id, who, taps: 0, done: false };
    $("boardStage").textContent = who[1];
    $("boardGo").classList.remove("show");
    show("board"); sfx.party(); confetti(25); animate($("boardStage"), "pop");
    speak("won", C.lines.won(who[0]));
  }
  $("boardStage").addEventListener("click", () => {
    if (!B || B.done) return;
    B.taps++; sfx.tap(); animate($("boardStage"), "bounce");
    if (B.taps >= 2) {
      B.done = true;
      S.aboard[B.id] = B.who[1]; S.stickers.push(B.who[1]); save();
      sfx.party(); confetti(50);
      speak("boarded", C.lines.boarded(B.who[0]));
      setTimeout(() => $("boardGo").classList.add("show"), 1200);
    }
  });
  $("boardGo").addEventListener("click", () => { sfx.tap(); B = null; if (got().length >= NEED) showFinale(); else showMap(); });

  // ---------- the big finish ----------
  function showFinale() {
    $("finaleArt").innerHTML = C.finaleArt(got().slice(0, NEED));
    $("finaleGo").classList.remove("show");
    show("finale"); sfx.party(); confetti(80);
    speak("finale", C.lines.finale(NAME));
    setTimeout(() => $("finaleGo").classList.add("show"), 3000);
  }
  $("finaleGo").addEventListener("click", () => {
    sfx.tap(); S.aboard = {}; S.trips++; save(); Kit.stamp(C.medal);
    showMap("again");
  });

  // ---------- the map ----------
  function showMap(line) {
    const on = got();
    if (on.length >= NEED) { showFinale(); return; }
    $("places").innerHTML = ""; $("places").classList.toggle("many", GAME_IDS.length > 8); $("progress").classList.toggle("many", NEED > 4); // smaller cards when a grade has lots of places
    GAME_IDS.forEach(id => {
      const g = GAMES[id], b = document.createElement("button");
      b.className = "place" + (S.aboard[id] ? " done" : "");
      b.innerHTML = `<div class="pic">${g.icon}</div><div class="name">${g.name}</div>` + (S.aboard[id] ? `<div class="badge">${S.aboard[id]}</div>` : "");
      b.addEventListener("click", () => { sfx.tap(); startGame(id); });
      $("places").appendChild(b);
    });
    $("progress").innerHTML = C.progress(Array.from({ length: NEED }, (_, i) => on[i] || null));
    const earlier = S.stickers.slice(0, Math.max(0, S.stickers.length - on.length)).slice(-14);
    $("stickers").innerHTML = earlier.length ? `<small>${C.stickersLabel}</small>` + earlier.map(e => `<span>${e}</span>`).join("") : "";
    show("map");
    const left = NEED - on.length;
    if (line === "hello") speak("hello", C.lines.hello(NAME)); else if (line === "again") speak("again", C.lines.again); else if (left === NEED) speak("start", C.lines.start); else speak("left" + left, C.lines.left(left));
  }

  // ---------- buttons ----------
  $("playBtn").addEventListener("click", () => { Kit.audio(); sfx.tap(); Object.values(C.voice || {}).forEach(url => Kit.loadClip(url).catch(() => {})); showMap(got().length || S.trips ? undefined : "hello"); });
  $("gameHost").addEventListener("click", () => { if (G && G.q && !G.busy) { animate($("gameHost"), "wobble"); say(G.q.help || G.q.say); } }); // tap the host to hear it again ("help" is a fuller version, if the question has one)
  $("homeBtn").addEventListener("click", () => { sfx.tap(); G = null; showMap(); });
  // The hint button: one per round. It takes away one wrong answer, then shows how to think about the question
  // (each question's own "hint"; a question without one just hears the question again).
  $("hintBtn").addEventListener("click", async () => {
    if (!C.hints || !G || G.busy || !G.q || G.hints <= 0) return;
    const q = G.q; G.hints--; G.hinted = true; $("hintBtn").classList.add("used"); sfx.tap(); Kit.hush();
    Kit.dropOneWrong($("choices"));
    const H = helperFor(q, () => G && G.q === q && !G.busy);
    if (q.hint) await q.hint(H); else await H.say(q.help || q.say);
  });
  // The lesson button (📖): watch the "how to" lesson again, any time. Afterwards the questions start fresh.
  $("lessonBtn").addEventListener("click", () => {
    if (!C.lessons || !G || G.lesson || !GAMES[G.id].lesson) return;
    if (G.busy && G.q) return; // a right answer is being cheered: wait for the next question
    sfx.tap(); runLesson(false);
  });
  $("shelfBtn").addEventListener("click", () => { Kit.hush(); location.href = "index.html"; });

  // ---------- grown-ups corner (press and hold the gear) ----------
  function openGrown() {
    Kit.hush();
    const voices = Kit.englishVoices(), v = Kit.currentVoice();
    $("grownPanel").innerHTML = `<h2>Grown-ups <small class="soon" style="font-size:13px;font-weight:normal">Version ${Kit.VERSION}</small></h2>
      <p><b>${C.gradeLabel}.</b> ${NAME ? "Playing as <b>" + Kit.esc(NAME) + "</b>." : `<span class="soon">No name picked. Pick one on the book shelf to keep each child's progress separate.</span>`}</p>
      <p><a href="progress.html" style="font-weight:bold">📊 Progress report</a>: what is going well and what to practise next.</p>
    <div class="line"><div>Voice for the questions (the same in every game)<br><select id="voicePick">${voices.length ? voices.map(x => `<option value="${Kit.esc(x.name)}"${v && x.name === v.name ? " selected" : ""}>${Kit.esc(x.name)}</option>`).join("") : "<option>(this device has no voices)</option>"}</select></div><button data-act="test">Test</button></div>
      <p>Places won so far: <b>${S.stickers.length}</b> &nbsp;|&nbsp; Times the story was finished: <b>${S.trips}</b></p>
      ${GAME_IDS.map(id => `<div class="line"><div><b>${GAMES[id].name}</b><br><small>Step ${S.skill[id]} of 4: ${C.stepNames[id][S.skill[id] - 1]}</small></div>
        <div class="pm"><button data-act="down" data-id="${id}">-</button><button data-act="up" data-id="${id}">+</button></div></div>`).join("")}
      <div class="line"><div>Adjust difficulty automatically</div><button data-act="auto">${S.auto ? "On" : "Off"}</button></div>
      <div class="line"><div>Talking voice</div><button data-act="voice">${Kit.settings.voice ? "On" : "Off"}</button></div>
      <div class="line"><div>Sound effects</div><button data-act="sound">${Kit.settings.sound ? "On" : "Off"}</button></div>
      <div class="foot"><button class="warn" data-act="reset">Start over (erase progress)</button><button class="main" data-act="close">Done</button></div>`;
    $("grown").classList.add("on");
  }
  Kit.hold($("grownBtn"), openGrown);
  $("grownPanel").addEventListener("click", e => {
    const t = e.target.closest("button"); if (!t) return;
    const act = t.dataset.act, id = t.dataset.id;
    if (act === "test") { Kit.say(C.lines.test(NAME), true); return; } // tests the device voice picked above
    if (act === "up") S.skill[id] = Math.min(4, S.skill[id] + 1);
    if (act === "down") S.skill[id] = Math.max(1, S.skill[id] - 1);
    if (act === "auto") S.auto = !S.auto;
    if (act === "voice") Kit.settings.voice = !Kit.settings.voice;
    if (act === "sound") Kit.settings.sound = !Kit.settings.sound;
    if (act === "reset") { if (!confirm("Erase this game's progress and start over?")) return; S = fresh(); }
    save(); Kit.saveSettings();
    if (act === "close") { $("grown").classList.remove("on"); if (current === "map") showMap(); return; }
    if (act === "reset") { $("grown").classList.remove("on"); show("title"); return; }
    openGrown();
  });
  $("grownPanel").addEventListener("change", e => {
    if (e.target.id === "voicePick") { Kit.settings.voiceName = e.target.value; Kit.chooseVoice(); Kit.saveSettings(); }
  });

  // Handy for testing from outside.
  return { GAMES, GAME_IDS, STARS, NEED, startGame, showMap, show, nextQuestion, reset: () => { S = fresh(); },
    get S() { return S; }, get G() { return G; }, set G(v) { G = v; }, get current() { return current; } };
}
