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
    let id = null; try { id = localStorage.getItem("storyShelf.current"); } catch (e) {}
    return players().find(p => p.id === id) || null;
  }
  function setCurrent(id) { try { localStorage.setItem("storyShelf.current", id); } catch (e) {} }
  function addPlayer(name) {
    name = String(name || "").trim().slice(0, 20);
    if (!name) return null;
    const list = players(), n = get("storyShelf.nextId", 1), p = { id: "p" + n, name };
    list.push(p); put("storyShelf.players", list); put("storyShelf.nextId", n + 1); setCurrent(p.id);
    return p;
  }
  function removePlayer(id) {
    const list = players().filter(p => p.id !== id); put("storyShelf.players", list);
    if (!list.find(p => p.id === (currentPlayer() || {}).id)) setCurrent(list[0] ? list[0].id : "");
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
  function stamp(id) { const list = stamps(); if (!list.includes(id)) { list.push(id); put(stampKey(), list); music("new-medal"); } } // a new medal gets its own little tune

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
    shelfKeys().forEach(k => { if (k !== "storyShelf.lastBackup") data[k] = localStorage.getItem(k); });
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
      const a = new Audio(URL.createObjectURL(new Blob([b], { type: "audio/wav" }))); a.loop = true; a.setAttribute("playsinline", "");
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
      const ac = audio(), sound = await loadClip("audio/music/" + name + ".mp3");
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
    if ((settings.voice && !always) || q.bubble.includes('class="passage"')) return { html: q.bubble, quiet: false };
    const words = q.read !== undefined ? q.read : q.say;
    return { html: (q.bubble.includes("👂") ? "" : `<div class="rowx">${q.bubble}</div>`) + `<div class="said">${words}</div>`, quiet: true };
  }
  const esc = s => String(s).replace(/[&<>"]/g, c => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c]));

  // Stop pinch-zoom and double-tap zoom so little fingers can't shrink the game.
  document.addEventListener("gesturestart", e => e.preventDefault());
  document.addEventListener("dblclick", e => e.preventDefault());

  const VERSION = "37"; // shown in the grown-ups panel, so you can tell which copy a device is running. Go up by one with each published change.
  return { VERSION, makeBackup, readBackup, restoreBackup, markBackedUp, lastBackup, niceDate, track, dropOneWrong, hintHelper, lessonHelper, writtenBubble, sayAndWait, playClip, loadClip, clipName, players, currentPlayer, setCurrent, addPlayer, removePlayer, load, save, stamps, stamp, settings, saveSettings,
    englishVoices, chooseVoice, currentVoice: () => voice, say, hush, music, stopMusic, audio, sfx, animate, confetti, hold, esc };
})();
