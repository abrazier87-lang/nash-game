"use strict";
/* =====================================================================
   THE STORYBOARD ENGINE for the older grades (Grade 5 and up).
   A story is a list of chapters. A chapter is a row of "beats":
     { art, say: [captions], word: [new word, meaning] }          a story scene to read
     { ask, intro, need }                                         a challenge: right answers unlock the next scene
     { pick: "the question", art, options: [{ label, art, say }] } a choice: the child decides what happens next
     A scene may have who: "a name" (shown before its lines), for stories told by two people in turn.
   Start a game with ChapterGame({ title, sub, saveKey, medal, chapters, ask, art, intro, introVoice, map, wordsLabel, coin, shop }).
     ask[name](G) makes one question: { html, text, choices: [{ html, ok }], why }.
     art[name]() draws one picture.
     intro: [[art name, line]], played once when the book is first opened, in the recorded voice from introVoice.
     map: { art(), stops: [[left %, top %], ...] } shows the chapters as places on a map instead of a list.
     wordsLabel: turns on the word collection (a scene with "word" adds to it).
     coin: { name, icon } turns on money: 1 for each right answer, 2 more for a challenge with no mistakes.
     shop: { title, items: [{ id, name, cost, art() }] } is where the money is spent (things for the journey, to keep).
     A question may be answered by tapping its picture: { tap: true, html (with data-pick="..." on each thing to tap), choices: [{ pick, ok }] }.
     G.case is an empty object that lasts for one challenge, so a maker can carry numbers from one question to the next (a case file; G.stars says which step).
     A challenge with quiet: true, and a chapter with quiet: true, give no money, no cheering and no confetti.
     certificate: { title, line } shows a certificate with the child's name once every chapter is done.
     voice: "audio/.../" is the folder of this story's recorded lines. Each scene line, choice question and challenge intro is
       played from a file named after its words (Kit.clipName). speak(text) may change the words for speaking (how to say a name).
       A line with no recording is simply shown in writing: the device voice is never used.
     The question makers get G.choice: which option (0 or 1) was picked at this chapter's choice, so the maths can follow it.
   Every line is shown in writing. A missing recording is never replaced by the device voice.
   Needs shared/kit.js, shared/story.js (for its helpers), shared/newowl.js and shared/inkart.js.
   ===================================================================== */
function ChapterGame(C) {
  const CHAPTERS = C.chapters, ASK = C.ask, ART = C.art, INTRO = C.intro || [], NEED = 3; // right answers to open the next scene
  const para = t => `<div class="qtext">${t}</div>`;
  // ---------- recorded lines ----------
  const spoken = t => { const s = String(t).replace(/<[^>]+>/g, ""); return C.speak ? C.speak(s) : s; };
  const clipOf = t => C.voice + Kit.clipName(spoken(t)) + ".mp3";
  // A chapter may give voice: "a folder" to keep its recordings apart from the rest of the book, so that it can have its own reader (Grade 8 chapter 4 does).
  function speakLine(t, next, folder) { const f = folder || C.voice; if (!f || !t) return; const clip = x => f + Kit.clipName(spoken(x)) + ".mp3"; Kit.playClip(clip(t), ""); if (next) Kit.loadClip(clip(next)).catch(() => {}); } // "next" is fetched ahead so it starts without a pause

  // ---------- saved progress ----------
  let S = Kit.load(C.saveKey, () => ({ beat: CHAPTERS.map(() => 0), done: [], words: [] })); // beat[c]: how far chapter c has been opened
  while (S.beat.length < CHAPTERS.length) S.beat.push(0);
  if (!S.words) S.words = [];
  if (!S.coins) S.coins = 0; if (!S.bought) S.bought = []; if (!S.picks) S.picks = {};
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
    <button class="again" id="introAgain"${INTRO.length ? "" : " hidden"}>▶ Watch the beginning again</button>${C.shop ? `<button class="again shopbtn" id="shopBtn"></button>` : ""}${C.certificate ? `<button class="again" id="certBtn" hidden>★ My certificate</button>` : ""}</div>
  <div class="screen" id="story"><div class="dots" id="dots"></div><div class="panel" id="panel"></div><div class="caption" id="caption"></div>
    <div class="nextrow" id="nextRow"><button class="bigbtn small back" id="backBtn" aria-label="Back"><span class="tri"></span></button><button class="bigbtn small" id="nextBtn" aria-label="Next"><span class="tri"></span></button></div>
    <div class="options" id="options"></div><div class="cheer wordcheer" id="wordCheer"></div></div>
  <div class="screen" id="game"><div class="stars" id="stars"></div><div class="cheer" id="cheer"></div>
    <div class="ask"><div class="host">${NEW_OWL}</div><div class="bubble" id="bubble"></div></div><div class="tip" id="tip"></div><div class="choices" id="choices"></div></div>
  <button class="corner left" id="homeBtn" aria-label="Back to the chapters" style="display:none">${ICON.home}</button>
  <button class="corner left" id="shelfBtn" aria-label="Back to the book shelf">${ICON.shelf}</button>
  <button class="corner right words" id="wordsBtn" aria-label="My words" style="display:none">${ICON.words || "Aa"}</button>
  <div class="coinchip" id="coinChip" style="display:none"></div>
  <div id="wordbook"><div class="panel" id="wordPanel"></div></div><div id="shop"><div class="panel" id="shopPanel"></div></div><div id="cert"><div class="panel" id="certPanel"></div></div>`;

  function show(id) {
    document.querySelectorAll(".screen").forEach(s => s.classList.toggle("on", s.id === id));
    $("homeBtn").style.display = id === "story" || id === "game" ? "" : "none";
    $("shelfBtn").style.display = id === "title" || id === "map" ? "" : "none";
    $("wordsBtn").style.display = C.wordsLabel && (id === "map" || id === "story") ? "" : "none";
    $("coinChip").style.display = C.coin && id === "game" ? "" : "none"; drawCoins();
  }
  // ---------- money: earned by right answers, spent at the trading post ----------
  const coinText = n => `${C.coin.icon}<b>${n}</b>`;
  function drawCoins() { if (!C.coin) return; $("coinChip").innerHTML = coinText(S.coins); if (C.shop) $("shopBtn").innerHTML = `${coinText(S.coins)} <span>${C.shop.title}</span>`; }
  function earn(n) { if (!C.coin) return; S.coins += n; save(); drawCoins(); animate($("coinChip"), "pop"); }
  function drawShop() {
    $("shopPanel").innerHTML = `<h2>${C.shop.title} <small>You have ${coinText(S.coins)} ${C.coin.name}</small></h2><div class="shoplist">${C.shop.items.map(it => { const mine = S.bought.includes(it.id);
      return `<div class="item${mine ? " mine" : ""}">${it.art()}<b>${it.name}</b>${mine ? `<span class="yours">Yours!</span>` : `<button class="buy" data-id="${it.id}"${S.coins >= it.cost ? "" : " disabled"}>${coinText(it.cost)}</button>`}</div>`; }).join("")}</div><button class="again" id="shopClose">OK</button>`;
    $("shopClose").addEventListener("click", () => { sfx.tap(); $("shop").classList.remove("on"); });
  }
  if (C.shop) {
    $("shopBtn").addEventListener("click", () => { sfx.tap(); drawShop(); $("shop").classList.add("on"); });
    $("shop").addEventListener("click", e => { if (e.target === $("shop")) return $("shop").classList.remove("on");
      const b = e.target.closest(".buy"); if (!b || b.disabled) return; const it = C.shop.items.find(i => i.id === b.dataset.id); if (!it || S.coins < it.cost) return;
      S.coins -= it.cost; S.bought.push(it.id); save(); sfx.sparkle(); confetti(30); drawCoins(); drawShop(); });
  }
  $("playBtn").addEventListener("click", () => { Kit.audio(); sfx.tap(); if (S.seenIntro || !INTRO.length) { showMap(); Kit.music("theme", 0.4); } else playIntro(); }); // the theme plays over the map, where nobody is talking

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
  $("homeBtn").addEventListener("click", () => { sfx.tap(); Kit.hush(); G = null; showMap(); });

  // ---------- the certificate: every chapter finished ----------
  const allDone = () => CHAPTERS.every((c, i) => c.beats && S.done.includes(i));
  function showCert() {
    $("certPanel").innerHTML = `<div class="certowl">${NEW_OWL}</div><h2>${C.certificate.title}</h2><p class="certname">${NAME || "A brave traveller"}</p><p>${C.certificate.line}</p>
      <div class="certstamps">${CHAPTERS.map((c, i) => `<span>${ICON.star}<small>${c.title}</small></span>`).join("")}</div><button class="again" id="certClose">OK</button>`;
    $("cert").classList.add("on"); $("certClose").addEventListener("click", () => { sfx.tap(); $("cert").classList.remove("on"); });
  }
  if (C.certificate) $("certBtn").addEventListener("click", () => { sfx.tap(); showCert(); });

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
    if (C.certificate) $("certBtn").hidden = !allDone();
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
  // Somebody else's words (a scene with who: "...") are read aloud by the balloon's clock, when the page gives clockVoice (a folder of recordings). who: "The clock" is the clock speaking for itself.
  const whoLabel = w => w === "The clock" || !C.clockVoice ? w : `${w}, read by the clock`;
  function drawLine() { const sc = sceneAt(); $("caption").innerHTML = `<div>${sc.who ? `<span class="who">${whoLabel(sc.who)}</span>` : ""}${sc.say[at.line]}</div>`; fitCaption(); if (!sc.who) speakLine(sc.say[at.line], sc.say[at.line + 1], CHAPTERS[at.c].voice); else if (C.clockVoice) speakLine(sc.say[at.line], sc.say[at.line + 1], C.clockVoice); else Kit.hush(); $("backBtn").style.visibility = at.b === 0 && at.line === 0 && !beatAt().pick ? "hidden" : ""; }
  function fitCaption() { // a long line gets slightly smaller writing, so it never spills out of its box
    const cap = $("caption"); cap.style.fontSize = ""; const base = parseFloat(getComputedStyle(cap).fontSize);
    for (let i = 1; i <= 6 && cap.scrollHeight > cap.clientHeight + 1; i++) cap.style.fontSize = (base * (1 - .06 * i)).toFixed(2) + "px";
  }
  function drawPick() { // a choice: the question, and a big button for each way to go
    const beat = beatAt(); at.opt = null;
    $("panel").innerHTML = ART[beat.art](); animate($("panel"), "pop"); $("caption").innerHTML = `<div>${beat.pick}</div>`; $("nextRow").style.display = "none";
    $("options").innerHTML = beat.options.map((o, i) => `<button class="option" data-o="${i}">${o.label}</button>`).join(""); fitCaption(); speakLine(beat.pick, null, CHAPTERS[at.c].voice);
  }
  $("options").addEventListener("click", e => { const b = e.target.closest(".option"); if (!b || !at) return; sfx.tap(); at.opt = +b.dataset.o; at.line = 0; S.picks[at.c] = at.opt; save(); drawScene(); });
  $("nextBtn").addEventListener("click", () => { if (!at) return; sfx.tap(); const beats = CHAPTERS[at.c].beats;
    if (at.line < sceneAt().say.length - 1) { at.line++; drawLine(); return; }
    if (at.b < beats.length - 1) return openBeat(at.c, at.b + 1);
    const first = !S.done.includes(at.c); if (first) { S.done.push(at.c); save(); } Kit.finish(C.medal, "ch" + (at.c + 1)); /* the chapter is a finished lesson (for the progress report) */ const quietOne = CHAPTERS[at.c].quiet; Kit.hush(); if (!quietOne) confetti(80); // the chapter is finished
    if (CHAPTERS.every((c, i) => !c.beats || S.done.includes(i)) && CHAPTERS.every(c => c.beats)) { const had = Kit.stamps().includes(C.medal); Kit.stamp(C.medal); confetti(120); if (had && !quietOne && !Kit.music("chapter-complete")) sfx.party(); } // every chapter done: the medal goes on the book shelf (a new medal plays its own tune)
    else if (!quietOne && !Kit.music("chapter-complete")) sfx.party();
    showMap(); if (C.certificate && first && allDone()) showCert(); });
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
    G = { beat, need: beat.need || NEED, stars: 0, wrongs: 0, busy: false, last: "", perfect: true, choice: S.picks[at.c] || 0, case: {}, quiet: !!beat.quiet };
    $("stars").innerHTML = Array(G.need).fill('<div class="star">⭐</div>').join(""); $("stars").classList.remove("perfect");
    show("game"); nextAsk(beat.intro); if (beat.intro) speakLine(beat.intro, null, CHAPTERS[at.c].voice); else Kit.hush();
  }
  function nextAsk(lead) {
    let q, tries = 0; do { q = ASK[G.beat.ask](G); tries++; } while (tries < 10 && q.text === G.last);
    G.q = q; G.last = q.text; G.wrongs = 0; G.busy = false;
    $("bubble").innerHTML = (q.html || "") + para(q.text); animate($("bubble"), "pop");
    $("tip").className = "tip"; $("tip").textContent = lead || "";
    const box = $("choices"); box.innerHTML = ""; box.style.setProperty("--cs", "22vmin"); G.cards = null;
    if (q.tap) { G.cards = [...$("bubble").querySelectorAll("[data-pick]")]; // the answer is tapped in the picture
      G.cards.forEach(el => { const ch = q.choices.find(c => String(c.pick) === el.dataset.pick); if (ch) el.addEventListener("click", () => choose(el, ch)); }); return; }
    q.choices.forEach(ch => { const b = document.createElement("button"); b.className = "choice pop"; b.innerHTML = ch.html; b.addEventListener("click", () => choose(b, ch)); box.appendChild(b);
      const len = String(ch.html).replace(/<small>.*<\/small>|<[^>]+>/g, "").length; if (len > 3) b.style.fontSize = len > 9 ? "3.1vmin" : len > 7 ? "3.9vmin" : len > 4 ? "5.2vmin" : "6vmin"; b.style.flexDirection = "row"; });
  }
  async function choose(el, ch) {
    if (!G || G.busy || el.classList.contains("dim")) return;
    const q = G.q, g = G;
    if (ch.ok) {
      G.busy = true; sfx.yes(); el.classList.add("right"); (G.cards || [...$("choices").children]).forEach(b => { if (b !== el) b.classList.add("dim"); });
      G.stars++; $("stars").children[G.stars - 1].classList.add("got"); if (!G.quiet) earn(1);
      const strand = Kit.askStrand(C.medal, "ch" + (at.c + 1), G.beat.ask); // which part of mathematics this challenge practises
      Kit.track(C.medal, C.title, "ch" + (at.c + 1) + "." + strand, CHAPTERS[at.c].title + " · " + Kit.STRANDS[strand][1], 0, { say: q.text, choices: q.choices }, G.wrongs === 0, false); // for the progress report (a chapter has no difficulty steps, so the step is 0)
      $("tip").className = "tip"; $("tip").textContent = "Yes! " + q.why;
      await wait(2600); if (G !== g) return;
      if (G.stars < G.need) return nextAsk();
      if (!G.quiet) { if (G.perfect) { $("stars").classList.add("perfect"); sfx.sparkle(); cheer(C.coin ? `Perfect! +2 ${C.coin.name}` : "Perfect!"); earn(2); } const tune = Kit.music("well-done"); if (!tune) sfx.party(); confetti(40); await wait(tune ? 2100 : 0); } // with music on, the three-second jingle plays right to its end before the story moves on
      await wait(1300); if (G !== g) return;
      G = null; openBeat(at.c, at.b + 1);
    } else {
      sfx.oops(); G.wrongs++; G.perfect = false; animate(el, "wobble"); el.classList.add("dim");
      $("tip").className = "tip oops"; $("tip").textContent = G.wrongs >= 2 ? q.why : "Not quite. Have another look.";
    }
  }

  // for testing by hand: the moving parts of the game
  return { get S() { return S; }, set S(v) { S = v; while (S.beat.length < CHAPTERS.length) S.beat.push(0); if (!S.words) S.words = []; if (!S.coins) S.coins = 0; if (!S.bought) S.bought = []; if (!S.picks) S.picks = {}; }, get G() { return G; }, set G(v) { G = v; }, get at() { return at; }, get introAt() { return introAt; },
    show, showMap, openBeat, drawShop, showCert: () => showCert(), drawLine, drawScene, nextAsk, playIntro, CHAPTERS, ASK, ART, INTRO };
}
