"use strict";
/* =====================================================================
   THE STORYBOARD ENGINE for the older grades (Grade 5 and up).
   A story is a list of chapters. A chapter is a row of "beats":
     { art, say: [captions], word: [new word, meaning] }          a story scene to read
     { ask, intro, need }                                         a challenge: right answers unlock the next scene
     { pick: "the question", art, options: [{ label, art, say }] } a choice: the child decides what happens next
   Start a game with ChapterGame({ title, sub, saveKey, medal, chapters, ask, art, intro, introVoice, map, wordsLabel }).
     ask[name](G) makes one question: { html, text, choices: [{ html, ok }], why }.
     art[name]() draws one picture.
     intro: [[art name, line]], played once when the book is first opened, in the recorded voice from introVoice.
     map: { art(), stops: [[left %, top %], ...] } shows the chapters as places on a map instead of a list.
     wordsLabel: turns on the word collection (a scene with "word" adds to it).
   Every line is shown in writing. A missing recording is never replaced by the device voice.
   Needs shared/kit.js, shared/story.js (for its helpers), shared/newowl.js and shared/inkart.js.
   ===================================================================== */
function ChapterGame(C) {
  const CHAPTERS = C.chapters, ASK = C.ask, ART = C.art, INTRO = C.intro || [], NEED = 3; // right answers to open the next scene
  const para = t => `<div class="qtext">${t}</div>`;

  // ---------- saved progress ----------
  let S = Kit.load(C.saveKey, () => ({ beat: CHAPTERS.map(() => 0), done: [], words: [] })); // beat[c]: how far chapter c has been opened
  while (S.beat.length < CHAPTERS.length) S.beat.push(0);
  if (!S.words) S.words = [];
  const save = () => Kit.save(C.saveKey, S);
  const PLAYER = Kit.currentPlayer(), NAME = PLAYER ? PLAYER.name : "";
  const { sfx, confetti, animate } = Kit;
  const ALL_WORDS = CHAPTERS.flatMap(c => (c.beats || []).flatMap(b => [b.word].concat((b.options || []).map(o => o.word)).filter(Boolean)));
  const isOpen = i => !!CHAPTERS[i].beats && (i === 0 || S.done.includes(i - 1));

  // ---------- the page ----------
  $("app").innerHTML = `
  <div class="layer">${backdrop()}</div><div class="layer" id="fx"></div>
  <div class="screen on" id="title"><h1>${C.title}</h1><p class="sub">${C.sub}${NAME ? " for " + NAME : ""}</p><div class="host big" style="width:32vmin;height:37vmin">${NEW_OWL}</div>
    <button class="bigbtn" id="playBtn" aria-label="Play"><span class="tri"></span></button></div>
  <div class="screen" id="intro"><div class="panel" id="introPanel"></div><div class="caption" id="introCap"></div>
    <div class="nextrow"><button class="bigbtn small" id="introNext" aria-label="Next"><span class="tri"></span></button></div></div>
  <div class="screen" id="map">${C.map ? `<div class="panel mappanel" id="mapPanel"></div><div class="caption mapcap" id="mapCap"></div><div class="nextrow"><button class="bigbtn small" id="mapGo" aria-label="Go"><span class="tri"></span></button></div>` : `<div class="chapters" id="chapters"></div>`}
    <button class="again" id="introAgain"${INTRO.length ? "" : " hidden"}>▶ Watch the beginning again</button></div>
  <div class="screen" id="story"><div class="dots" id="dots"></div><div class="panel" id="panel"></div><div class="caption" id="caption"></div>
    <div class="nextrow" id="nextRow"><button class="bigbtn small back" id="backBtn" aria-label="Back"><span class="tri"></span></button><button class="bigbtn small" id="nextBtn" aria-label="Next"><span class="tri"></span></button></div>
    <div class="options" id="options"></div><div class="cheer wordcheer" id="wordCheer"></div></div>
  <div class="screen" id="game"><div class="stars" id="stars"></div><div class="cheer" id="cheer"></div>
    <div class="ask"><div class="host">${NEW_OWL}</div><div class="bubble" id="bubble"></div></div><div class="tip" id="tip"></div><div class="choices" id="choices"></div></div>
  <button class="corner left" id="homeBtn" aria-label="Back to the chapters" style="display:none">${ICON.home}</button>
  <button class="corner left" id="shelfBtn" aria-label="Back to the book shelf">${ICON.shelf}</button>
  <button class="corner right words" id="wordsBtn" aria-label="My words" style="display:none">${ICON.words || "Aa"}</button>
  <div id="wordbook"><div class="panel" id="wordPanel"></div></div>`;

  function show(id) {
    document.querySelectorAll(".screen").forEach(s => s.classList.toggle("on", s.id === id));
    $("homeBtn").style.display = id === "story" || id === "game" ? "" : "none";
    $("shelfBtn").style.display = id === "title" || id === "map" ? "" : "none";
    $("wordsBtn").style.display = C.wordsLabel && (id === "map" || id === "story") ? "" : "none";
  }
  $("playBtn").addEventListener("click", () => { Kit.audio(); sfx.tap(); if (S.seenIntro || !INTRO.length) showMap(); else playIntro(); });

  // ---------- the intro: a few pictures, each with one line in the recorded voice ----------
  // It plays by itself the first time the book is opened. The arrow skips ahead; a button on the chapter screen plays it again.
  let introAt = -1, introRun = 0, introSkip = () => {};
  async function playIntro() {
    const run = ++introRun; show("intro");
    for (introAt = 0; introAt < INTRO.length; introAt++) {
      const [art, words] = INTRO[introAt];
      $("introPanel").innerHTML = ART[art](); animate($("introPanel"), "pop"); $("introCap").innerHTML = `<div>${words}</div>`;
      const read = wait(1200 + words.length * 55), spoken = C.introVoice ? Kit.playClip(C.introVoice + Kit.clipName(words) + ".mp3", "") : read;
      await Promise.race([Promise.all([read, spoken]), new Promise(r => { introSkip = r; })]);
      if (run !== introRun) return; // it was left, or started again
      await wait(350); if (run !== introRun) return;
    }
    Kit.hush(); if (!S.seenIntro) { S.seenIntro = true; save(); } showMap();
  }
  $("introNext").addEventListener("click", () => { sfx.tap(); Kit.hush(); introSkip(); });
  $("introAgain").addEventListener("click", () => { sfx.tap(); playIntro(); });
  $("shelfBtn").addEventListener("click", () => { introRun++; Kit.hush(); location.href = "index.html"; });
  $("homeBtn").addEventListener("click", () => { sfx.tap(); G = null; showMap(); });

  // ---------- the chapters: a list, or places on a map ----------
  let chosen = 0;
  const startChapter = c => openBeat(c, S.done.includes(c) ? 0 : Math.min(S.beat[c], CHAPTERS[c].beats.length - 1));
  function showMap() {
    if (C.map) {
      const next = CHAPTERS.findIndex((c, i) => isOpen(i) && !S.done.includes(i)); chosen = next >= 0 ? next : Math.max(0, CHAPTERS.findIndex((c, i) => isOpen(i)));
      $("mapPanel").innerHTML = C.map.art() + CHAPTERS.map((c, i) => { const [x, y] = C.map.stops[i], done = S.done.includes(i);
        return `<button class="pin${isOpen(i) ? "" : " locked"}${done ? " done" : ""}" data-c="${i}" style="left:${x}%;top:${y}%" aria-label="${c.title}">${done ? ICON.star : i + 1}</button>`; }).join("") + `<div class="mapowl" id="mapOwl">${NEW_OWL}</div>`;
      drawChosen();
    } else {
      $("chapters").innerHTML = CHAPTERS.map((c, i) => { const open = isOpen(i), done = S.done.includes(i);
        return `<button class="chap${open ? "" : " locked"}" data-c="${i}"><span class="num">${i + 1}</span><span class="what"><b>${c.title}</b><small>${c.where}${c.beats ? "" : " · coming soon"}</small></span><span class="state">${done ? ICON.star : open ? ICON.go : ICON.lock}</span></button>`; }).join("");
    }
    show("map");
  }
  function drawChosen() { // the place that is picked on the map: its name, and Dr. Somebody standing beside its pin
    const c = CHAPTERS[chosen], [x, y] = C.map.stops[chosen], open = isOpen(chosen);
    $("mapPanel").querySelectorAll(".pin").forEach(p => p.classList.toggle("on", +p.dataset.c === chosen));
    $("mapOwl").style.left = x + "%"; $("mapOwl").style.top = y + "%";
    $("mapCap").innerHTML = `<div><b>${chosen + 1}. ${c.title}</b><small>${c.where}${c.beats ? (open ? "" : " · finish the place before it first") : " · coming soon"}</small></div>`;
    $("mapGo").style.visibility = open ? "" : "hidden";
  }
  if (C.map) {
    $("mapPanel").addEventListener("click", e => { const p = e.target.closest(".pin"); if (!p) return; sfx.tap(); chosen = +p.dataset.c; if (!isOpen(chosen)) animate(p, "wobble"); drawChosen(); });
    $("mapGo").addEventListener("click", () => { sfx.tap(); if (isOpen(chosen)) startChapter(chosen); });
  } else $("chapters").addEventListener("click", e => { const b = e.target.closest(".chap"); if (!b) return; sfx.tap(); if (b.classList.contains("locked")) { animate(b, "wobble"); return; } startChapter(+b.dataset.c); });

  // ---------- a beat: a story scene, a choice, or a challenge ----------
  let at = null; // { c, b, line, opt }  (opt: which option was picked at a choice, or null while it is still being asked)
  const beatAt = () => CHAPTERS[at.c].beats[at.b];
  const sceneAt = () => { const beat = beatAt(); return beat.pick ? beat.options[at.opt] : beat; }; // what is being read now
  function drawDots() { $("dots").innerHTML = CHAPTERS[at.c].beats.map((bt, i) => `<i class="${bt.ask ? "q " : bt.pick ? "p " : ""}${i < at.b ? "done" : i === at.b ? "now" : ""}"></i>`).join(""); }
  function learn(word) { // a new word for the collection
    if (!word || !C.wordsLabel || S.words.some(w => w[0] === word[0])) return;
    S.words.push(word); save(); sfx.sparkle();
    const c = $("wordCheer"); c.innerHTML = `New word: <b>${word[0]}</b>`; c.classList.remove("show"); void c.offsetWidth; c.classList.add("show");
  }
  function openBeat(c, b) {
    const beats = CHAPTERS[c].beats; at = { c, b, line: 0, opt: null };
    if (b > S.beat[c]) { S.beat[c] = b; save(); }
    const beat = beats[b];
    if (beat.ask) return startAsk(beat);
    drawDots(); show("story");
    if (beat.pick) return drawPick();
    drawScene();
  }
  function drawScene() { const sc = sceneAt(); $("options").innerHTML = ""; $("nextRow").style.display = ""; $("panel").innerHTML = ART[sc.art](); animate($("panel"), "pop"); drawLine(); learn(sc.word); }
  function drawLine() { $("caption").innerHTML = `<div>${sceneAt().say[at.line]}</div>`; $("backBtn").style.visibility = at.b === 0 && at.line === 0 && !beatAt().pick ? "hidden" : ""; }
  function drawPick() { // a choice: the question, and a big button for each way to go
    const beat = beatAt(); at.opt = null;
    $("panel").innerHTML = ART[beat.art](); animate($("panel"), "pop"); $("caption").innerHTML = `<div>${beat.pick}</div>`; $("nextRow").style.display = "none";
    $("options").innerHTML = beat.options.map((o, i) => `<button class="option" data-o="${i}">${o.label}</button>`).join("");
  }
  $("options").addEventListener("click", e => { const b = e.target.closest(".option"); if (!b || !at) return; sfx.tap(); at.opt = +b.dataset.o; at.line = 0; drawScene(); });
  $("nextBtn").addEventListener("click", () => { if (!at) return; sfx.tap(); const beats = CHAPTERS[at.c].beats;
    if (at.line < sceneAt().say.length - 1) { at.line++; drawLine(); return; }
    if (at.b < beats.length - 1) return openBeat(at.c, at.b + 1);
    if (!S.done.includes(at.c)) { S.done.push(at.c); save(); } sfx.party(); confetti(80); // the chapter is finished
    if (CHAPTERS.every((c, i) => !c.beats || S.done.includes(i)) && CHAPTERS.every(c => c.beats)) { Kit.stamp(C.medal); confetti(120); } // every chapter done: the medal goes on the book shelf
    showMap(); });
  $("backBtn").addEventListener("click", () => { if (!at) return; sfx.tap(); if (at.line > 0) { at.line--; drawLine(); return; }
    if (beatAt().pick && at.opt !== null) return drawPick(); // back from a choice's scene to the choice itself
    let b = at.b - 1; while (b >= 0 && CHAPTERS[at.c].beats[b].ask) b--; // step back over challenges already won
    if (b < 0) return; const beat = CHAPTERS[at.c].beats[b]; openBeat(at.c, b);
    if (!beat.pick) { at.line = beat.say.length - 1; drawLine(); } });

  // ---------- the word collection ----------
  if (C.wordsLabel) {
    $("wordsBtn").addEventListener("click", () => { sfx.tap();
      $("wordPanel").innerHTML = `<h2>${C.wordsLabel} <small>${S.words.length} / ${ALL_WORDS.length}</small></h2><div class="wordlist">${ALL_WORDS.map(w => S.words.some(s => s[0] === w[0]) ? `<div class="word"><b>${w[0]}</b><span>${w[1]}</span></div>` : `<div class="word unmet"><b>?</b><span>&nbsp;</span></div>`).join("")}</div><button class="again" id="wordClose">OK</button>`;
      $("wordbook").classList.add("on"); $("wordClose").addEventListener("click", () => { sfx.tap(); $("wordbook").classList.remove("on"); }); });
    $("wordbook").addEventListener("click", e => { if (e.target === $("wordbook")) $("wordbook").classList.remove("on"); });
  }

  // ---------- a challenge: right answers open the next scene ----------
  let G = null;
  function cheer(text) { const c = $("cheer"); c.textContent = text; c.classList.remove("show"); void c.offsetWidth; c.classList.add("show"); }
  function startAsk(beat) {
    G = { beat, need: beat.need || NEED, stars: 0, wrongs: 0, busy: false, last: "", perfect: true };
    $("stars").innerHTML = Array(G.need).fill('<div class="star">⭐</div>').join(""); $("stars").classList.remove("perfect");
    show("game"); nextAsk(beat.intro);
  }
  function nextAsk(lead) {
    let q, tries = 0; do { q = ASK[G.beat.ask](G); tries++; } while (tries < 10 && q.text === G.last);
    G.q = q; G.last = q.text; G.wrongs = 0; G.busy = false;
    $("bubble").innerHTML = (q.html || "") + para(q.text); animate($("bubble"), "pop");
    $("tip").className = "tip"; $("tip").textContent = lead || "";
    const box = $("choices"); box.innerHTML = ""; box.style.setProperty("--cs", "22vmin");
    q.choices.forEach(ch => { const b = document.createElement("button"); b.className = "choice pop"; b.innerHTML = ch.html; b.addEventListener("click", () => choose(b, ch)); box.appendChild(b);
      const len = String(ch.html).replace(/<small>.*<\/small>|<[^>]+>/g, "").length; if (len > 3) b.style.fontSize = len > 7 ? "3.9vmin" : len > 4 ? "5.2vmin" : "6vmin"; b.style.flexDirection = "row"; });
  }
  async function choose(el, ch) {
    if (!G || G.busy || el.classList.contains("dim")) return;
    const q = G.q, g = G;
    if (ch.ok) {
      G.busy = true; sfx.yes(); el.classList.add("right"); [...$("choices").children].forEach(b => { if (b !== el) b.classList.add("dim"); });
      G.stars++; $("stars").children[G.stars - 1].classList.add("got"); $("tip").className = "tip"; $("tip").textContent = "Yes! " + q.why;
      await wait(2600); if (G !== g) return;
      if (G.stars < G.need) return nextAsk();
      if (G.perfect) { $("stars").classList.add("perfect"); sfx.sparkle(); cheer("Perfect!"); } sfx.party(); confetti(40);
      await wait(1300); if (G !== g) return;
      G = null; openBeat(at.c, at.b + 1);
    } else {
      sfx.oops(); G.wrongs++; G.perfect = false; animate(el, "wobble"); el.classList.add("dim");
      $("tip").className = "tip oops"; $("tip").textContent = G.wrongs >= 2 ? q.why : "Not quite. Have another look.";
    }
  }

  // for testing by hand: the moving parts of the game
  return { get S() { return S; }, set S(v) { S = v; while (S.beat.length < CHAPTERS.length) S.beat.push(0); if (!S.words) S.words = []; }, get G() { return G; }, set G(v) { G = v; }, get at() { return at; }, get introAt() { return introAt; },
    show, showMap, openBeat, drawLine, drawScene, nextAsk, playIntro, CHAPTERS, ASK, ART, INTRO };
}
