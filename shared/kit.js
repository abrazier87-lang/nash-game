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

  // ---------- settings shared by the newer games ----------
  const settings = Object.assign({ voice: true, sound: true, voiceName: "" }, get("storyShelf.settings", {}));
  const saveSettings = () => put("storyShelf.settings", settings);

  // ---------- voice (the device's built-in talking voice) ----------
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
  function englishVoices() {
    if (!("speechSynthesis" in window)) return [];
    return speechSynthesis.getVoices().filter(v => /^en/i.test(v.lang)).sort((a, b) => voiceScore(b) - voiceScore(a));
  }
  function chooseVoice() { const vs = englishVoices(); voice = vs.find(v => v.name === settings.voiceName) || vs[0] || null; }
  if ("speechSynthesis" in window) { chooseVoice(); speechSynthesis.onvoiceschanged = chooseVoice; }
  function say(text, force) {
    if ((!settings.voice && !force) || !("speechSynthesis" in window)) return;
    try {
      speechSynthesis.cancel();
      const u = new SpeechSynthesisUtterance(text);
      if (voice) u.voice = voice;
      u.lang = voice ? voice.lang : "en-US"; u.rate = 0.9; u.pitch = 1.05;
      setTimeout(() => speechSynthesis.speak(u), 60);
    } catch (e) {}
  }
  const hush = () => { if ("speechSynthesis" in window) speechSynthesis.cancel(); };

  // ---------- little sounds (made by the computer, no sound files) ----------
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
    btn.addEventListener("pointerdown", e => { e.preventDefault(); btn.classList.add("holding"); timer = setTimeout(() => { end(); fn(); }, 1500); });
    ["pointerup", "pointerleave", "pointercancel"].forEach(ev => btn.addEventListener(ev, end));
    btn.addEventListener("contextmenu", e => e.preventDefault());
  }
  const esc = s => String(s).replace(/[&<>"]/g, c => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c]));

  // Stop pinch-zoom and double-tap zoom so little fingers can't shrink the game.
  document.addEventListener("gesturestart", e => e.preventDefault());
  document.addEventListener("dblclick", e => e.preventDefault());

  return { players, currentPlayer, setCurrent, addPlayer, removePlayer, load, save, settings, saveSettings,
    englishVoices, chooseVoice, currentVoice: () => voice, say, hush, audio, sfx, animate, confetti, hold, esc };
})();
