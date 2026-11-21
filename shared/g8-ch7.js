"use strict";
// Grade 8, Chapter 7: Home. The last chapter of the whole series. Dr. Somebody flies home to the Grand River, tells Lily what he learned, meets all twenty-two guides, and the clock starts to spin again.
{
  const lily = (x, y, s) => kidAt(x, y, s, WHO.lily);
  const fx = n => String(+n.toFixed(3));
  // a grassy bank, y is where the far edge sits
  const bank = y => `<g ${INKED}><path d="M-10 ${y} Q100 ${y - 16} 210 ${y + 2} T410 ${y} V250 H-10 Z" fill="#9ed08f"/></g>`;
  const lake = (x, y, rx, ry) => `<ellipse cx="${x}" cy="${y}" rx="${rx}" ry="${ry}" fill="#8fd0f0" ${THIN}/>`;
  // the land seen from high above: pale tundra and little lakes on the left, a patchwork of prairie fields, then a big lake
  const patches = [[124, 160, "#e9d27a"], [160, 160, "#a9cf86"], [196, 160, "#d9c56a"], [124, 192, "#a9cf86"], [160, 192, "#d9c56a"], [196, 192, "#e9d27a"], [124, 224, "#d9c56a"], [160, 224, "#e9d27a"], [196, 224, "#a9cf86"]];
  const flightLand = `<g ${INKED}><path d="M-10 152 Q100 140 200 150 T410 146 V250 H-10 Z" fill="#a9cf86"/></g>
    <g ${THIN}><path d="M-10 152 Q60 144 120 150 L112 250 H-10 Z" fill="#eef4f6"/></g>${lake(24, 176, 16, 7)}${lake(72, 200, 12, 5)}${lake(40, 226, 18, 6)}${lake(96, 170, 8, 4)}${lake(80, 238, 9, 3)}
    <g ${THIN}>${patches.map(([x, y, c]) => `<rect x="${x}" y="${y}" width="34" height="28" rx="5" fill="${c}"/>`).join("")}</g>
    <g ${INKED}><path d="M250 160 Q290 146 330 158 Q372 150 410 164 V250 H262 Q246 220 262 196 Q244 180 250 160 Z" fill="#6cc0ea"/><ellipse cx="334" cy="206" rx="28" ry="10" fill="#a9cf86"/></g>`;
  // a rolled certificate with a red seal
  const scroll = (x, y, s) => `<g transform="translate(${x} ${y}) scale(${s})" ${INKED}><rect x="-30" y="-20" width="60" height="40" rx="4" fill="#fffdf5"/><path d="M-30 -20 Q-38 0 -30 20 M30 -20 Q38 0 30 20" fill="none"/><path d="M-18 -8 H18 M-18 0 H18 M-12 8 H8" stroke-width="2" fill="none" stroke="#c9b78a"/><circle cx="18" cy="14" r="7" fill="#e63946"/></g>`;
  // the twenty-two guides, in order: Grade 5, Grade 6, Grade 7, Grade 8 (Kayla is not in the page's WHO list, so she is drawn here to match Grade 8 Chapter 3)
  const NAMES = ["lily", "noah", "maya", "nina", "lea", "olivier", "elodie", "sadie", "amara", "declan", "zoe", "kai", "jade", "tyson", "priya", "lukas", "mei", "jordan", "simran", "kayla", "hannah", "dana"];
  const look = n => WHO[n] || { hood: "#2a9d8f" }; // Kayla: long hair and a teal hoodie, as in Grade 8 Chapter 3
  const backRow = NAMES.slice(0, 12).map((n, i) => kidAt(24 + i * 31, 68, .5, look(n))).join("");
  const frontRow = NAMES.slice(12).map((n, i) => kidAt(i < 5 ? 26 + i * 28 : 262 + (i - 5) * 28, 150, .5, look(n))).join("");
  // lines of light spinning out of the clock
  const spinRays = (cx, cy) => Array.from({ length: 14 }, (_, i) => { const a = i / 14 * 2 * Math.PI, l = 66 + (i % 3) * 14, p = (r, d) => `${(cx + r * Math.cos(a + d)).toFixed(1)} ${(cy + r * Math.sin(a + d)).toFixed(1)}`;
    return `<path d="M${p(30, 0)} Q${p(l * .65, .45)} ${p(l, .9)}" fill="none" stroke="${i % 2 ? "#ffe08a" : "#fff6c9"}" stroke-width="3.2" stroke-linecap="round"/>`; }).join("");

  Object.assign(ART, {
    hm_flight: () => frame(`${sky("#8fd0f2", "#fdf0c8", null, [[70, 40, .8], [336, 34, .6]])}${flightLand}<path d="M14 190 Q80 130 176 126" fill="none" stroke="#2b1a10" stroke-width="2.4" stroke-dasharray="2 7" stroke-linecap="round" opacity=".6"/>${riding(150, 14, 120)}`),
    hm_river: () => frame(`${sky("#9fd8f2", "#f4f1d8", [56, 44, 20], [[190, 40, .8], [320, 60, .6]])}${tree(30, 128, 1.5, "#3f9a58")}${tree(62, 134, 1.2)}${tree(372, 128, 1.5)}${bridge(70, 124, 180)}${water(156)}${bank(210)}${balloonAt(300, 104, 112)}${owlAt(44, 120, 106)}${lily(190, 146, 1)}`),
    hm_talk: () => frame(`${sky("#ffd9a0", "#fdebd0", [300, 80, 22], [[80, 40, .8], [200, 56, .6]])}${tree(34, 140, 1.5, "#3f9a58")}${tree(370, 140, 1.4)}${water(152, "#7fc4e8")}${bank(208)}${mapleLeaf(60, 70, .7, 20)}${mapleLeaf(340, 130, .6, -20)}${mapleLeaf(360, 70, .5, 40)}${owlAt(104, 120, 108)}${lily(250, 146, 1)}`),
    hm_gather: () => frame(`${sky("#9fd8f2", "#f4f1d8", [360, 34, 18], [[70, 30, .7], [290, 24, .6]])}${bank(96)}${water(214, "#8fd0f0")}${balloonAt(176, 2, 56)}${backRow}${owlAt(157, 112, 100)}${frontRow}`),
    hm_thanks: () => frame(`${sky("#ffd9a0", "#fdebd0", [100, 70, 22], [[210, 40, .8], [330, 60, .6]])}${hills("#9ed08f", "#7dbb7a")}${tree(366, 150, 1.4, "#3f9a58")}${mapleLeaf(40, 110, .6, 20)}${mapleLeaf(344, 100, .5, -30)}${balloonAt(262, 96, 120)}${owlAt(120, 112, 120)}${scroll(70, 164, 1.2)}`),
    hm_spin: () => frame(`${nightSky([[30, 30], [70, 60, 2], [110, 24], [150, 50], [250, 22, 2], [290, 54], [350, 90, 2], [380, 26], [24, 100], [60, 130, 2]])}<circle cx="200" cy="72" r="78" fill="#ffd84d" opacity=".2"/><circle cx="200" cy="72" r="50" fill="#ffd84d" opacity=".28"/>
      <g ${INKED}><path d="M-10 170 Q100 156 210 172 T410 168 V250 H-10 Z" fill="#2f5a46"/></g>${water(214, "#25407a")}${tree(352, 176, 1.3, "#1f4a38")}${tree(380, 182, 1, "#1f4a38")}
      ${balloonAt(140, 22, 150)}${spinRays(200, 72)}<circle cx="200" cy="72" r="19" fill="none" stroke="#e63946" stroke-width="3" stroke-dasharray="6 5" opacity=".55"/>${owlAt(36, 104, 96)}`)
  });

  Object.assign(ASK, {
    hm_friends(g) { // one question from each friend, in the order of the journey: the star the child is on says whose it is
      const who = g ? Math.min(5, g.stars || 0) : rand(6);
      if (who === 0) { const N = pick([40, 60, 80, 120, 200]), p = pick([10, 20, 25, 50]), off = N * p / 100, r = N - off;
        return { html: "", text: `Léa asks: a scarf in a Quebec City shop costs <b>$${N}</b> and is <b>${p}% off</b>. What is the sale price?`, choices: textCards(r, [off, N + off, N - p, r + 10, r - 5], k => `$${k}`), why: `${p}% of ${N} is $${off}. ${N} − ${off} = $${r}.` }; }
      if (who === 1) { const A = pick([35, 40, 45, 50, 55, 60, 65]), B = pick([30, 45, 55, 70, 75]), r = 180 - A - B;
        return { html: "", text: `Sadie asks: a sail on Cape Breton is a triangle. Two of its angles are <b>${A}°</b> and <b>${B}°</b>. How big is the third angle?`, choices: textCards(r, [A + B, 180 - A, 180 - B, r + 10, r - 10], k => `${k}°`), why: `Angles in a triangle add to 180°. ${A} + ${B} = ${A + B}, and 180 − ${A + B} = ${r}.` }; }
      if (who === 2) { const d = pick([1, 1.2, 1.5, 2]), R = v => +v.toFixed(3), C = R(3.14 * d);
        return { html: "", text: `Jade asks: a cart wheel on the Red River is <b>${d} m</b> across. Using pi = 3.14, how far is it around the rim (the circumference)?`, choices: textCards(C, [3.14 * d / 2, 3.14 * d * d, 2 * 3.14 * d, d + 3.14, 3.14 * d * d / 4].map(R), k => `${fx(k)} m`), why: `Circumference = pi × diameter. 3.14 × ${d} = ${fx(C)} m.` }; }
      if (who === 3) { const S = pick([100, 200, 400, 500]), p = pick([10, 20, 25, 50]), E = S * (100 + p) / 100;
        return { html: "", text: `Tyson asks: a bison herd on the grasslands grew from <b>${S}</b> to <b>${E}</b>. By what percent did it grow?`, choices: textCards(p, [E - S, p + 10, p - 5, p * 2, p + 5, 100 - p], k => `${k}%`), why: `It grew by ${E} − ${S} = ${E - S}. ${E - S} ÷ ${S} = ${p / 100}, which is ${p}%.` }; }
      if (who === 4) { const [a, b, c] = pick([[3, 4, 5], [6, 8, 10], [5, 12, 13], [9, 12, 15], [8, 15, 17], [12, 16, 20]]);
        if (rand(2)) return { html: "", text: `Mei asks: a trail in the Rockies runs <b>${a} km</b> across and <b>${b} km</b> straight up. How long is the straight line from the start to the top?`, choices: cards(c, [a + b, a, b, c + 1, c - 1, c + 2]), why: `${a}² + ${b}² = ${a * a} + ${b * b} = ${c * c}. The square root of ${c * c} is ${c}.` };
        return { html: "", text: `Mei asks: a ladder <b>${c} m</b> long leans on a hut wall, with its foot <b>${a} m</b> from the wall. How high up the wall does it reach?`, choices: cards(b, [c - a, c + a, a, c, b + 1, b - 1]), why: `${b}² = ${c}² − ${a}² = ${c * c} − ${a * a} = ${b * b}. The square root of ${b * b} is ${b}.` }; }
      const s = pick([-30, -26, -22, -18, -14]), rise = rand(2), amt = pick([6, 10, 12, 16, 20]), ch = rise ? amt : -amt, r = s + ch, T = k => `${k < 0 ? "−" : ""}${Math.abs(k)}°C`;
      return { html: "", text: `Nina asks: at dawn in Nunavut it is <b>${T(s)}</b>. By the afternoon the temperature ${rise ? "rises" : "falls"} by <b>${amt}°</b>. What is it then?`, choices: textCards(r, [s - ch, -s + ch, -s - ch, r + 2, r - 2], T), why: `${T(s)} ${rise ? "+" : "−"} ${amt}° = ${T(r)}.` };
    },
    hm_last(g) { // a case file in three steps: the whole journey in rough numbers, the total, the average, and the time at the balloon's speed
      const c = (g && g.case) || {};
      if (!c.set) { c.set = true; c.d = pick([[4000, 6000, 5000, 5000], [3500, 6500, 5500, 4500], [4000, 5000, 7000, 4000], [3000, 5000, 8000, 6000], [4500, 5500, 6500, 5500]]); c.T = c.d[0] + c.d[1] + c.d[2] + c.d[3]; c.avg = c.T / 4; c.v = pick([20, 25, 50]); c.h = c.avg / c.v; }
      const step = g ? g.stars || 0 : rand(3), d = c.d, T = c.T, avg = c.avg, v = c.v, h = c.h;
      if (step === 0) return { html: "", text: `Case file, step 1. Rough distances flown: Grade 5 <b>${fmt(d[0])} km</b>, Grade 6 <b>${fmt(d[1])} km</b>, Grade 7 <b>${fmt(d[2])} km</b>, Grade 8 <b>${fmt(d[3])} km</b>. What is the total?`, choices: cards(T, [T - 500, T + 500, T + 1000, T - d[3], T / 4, T - 1000]), why: `${fmt(d[0])} + ${fmt(d[1])} + ${fmt(d[2])} + ${fmt(d[3])} = ${fmt(T)} km.` };
      if (step === 1) return { html: "", text: `Case file, step 2. The four grades came to <b>${fmt(T)} km</b> altogether. If every grade was the same length, how many kilometres would one grade be?`, choices: cards(avg, [T / 2, T / 3, T / 5, avg + 500, avg - 500, T / 8]), why: `${fmt(T)} ÷ 4 = ${fmt(avg)} km for each grade.` };
      return { html: "", text: `Case file, step 3. The balloon flies at about <b>${v} km/h</b>. How many hours would it take to fly one average grade of <b>${fmt(avg)} km</b>?`, choices: cards(h, [T / v, h + 10, h - 10, h * 2, h + 25]), why: `${fmt(avg)} ÷ ${v} = ${h} hours of flying.` };
    }
  });

  // FACT CHECK: Nia:wen means thank you. It is the spelling Lily's chapter used in Grade 5 (grade5-canada.html), copied exactly. The card calls it Mohawk. Please check that language and that spelling with Six Nations readers (the Haudenosaunee languages each have their own forms).
  // FACT CHECK: Lily is Haudenosaunee, from Six Nations of the Grand River, and the Grand River runs past Brantford, Ontario, as in Grade 5. Check the wording of "Six Nations of the Grand River".
  // FACT CHECK: The distances (4 000 to 8 000 km a grade, 20 000 or 22 000 km in all) are invented round numbers for the maths, and the story calls them rough. They are not real flight distances. The balloon speeds (20, 25, 50 km/h) are also invented.
  // FACT CHECK: Maths uses pi = 3.14, 180 degrees in a triangle, whole-number Pythagorean triples (3-4-5, 6-8-10, 5-12-13, 9-12-15, 8-15-17, 12-16-20), and Nunavut temperatures from about -30 to -14 degrees C in the questions only.
  // FACT CHECK: The twenty-two guides by grade: Grade 5 Lily, Noah, Maya, Nina. Grade 6 Lea, Olivier, Elodie, Sadie, Amara, Declan. Grade 7 Zoe, Kai, Jade, Tyson, Priya, Lukas. Grade 8 Mei, Jordan, Simran, Kayla, Hannah, Dana. Check this list against the earlier chapters (Nina is counted in Grade 5, where she first appeared).
  // FACT CHECK: Dr. Somebody's goodbye line is written exactly as the brief gave it: "Out with the old, in with the new! It's been a hoooot!" The Grade 4 recording reads "Out with the old, in with the new! It's been a hoooot!" (different punctuation and a long hoot).
  // READERS: Six Nations of the Grand River readers (for Lily's scenes), and a final read by the family.
  CHAPTERS[6] = { title: "Home", where: "The Grand River, Ontario", beats: [
    { art: "hm_flight", say: ["The clock points south and east, and for once I let it pull. Below us the Arctic <em>tundra</em> slides by, flat and wide and dotted with a thousand little lakes. Nina is still waving somewhere behind.",
      "Then the <em>prairies</em>, a quilt of gold and green. Then the forest, and the rock, and the Great Lakes, so big they look like seas. I name every place out loud as it passes, the way you say goodnight to people you love.",
      "Every one of them is a place I visited, and every one had somebody waiting. It was a very long way round. It turns out it is also a short way home."] },
    { art: "hm_river", word: ["Nia:wen", "thank you, in Mohawk"], say: ["And there is the <em>Grand River</em>, winding silver below, and the bridge at Brantford, and a small figure on the bank. It is Lily, from Six Nations of the Grand River. She is standing on the very same bank where my story began.",
      "She is older now, and taller, and so, I suppose, am I. She says <em>Nia:wen</em>, thank you for coming back. Then she folds her arms and asks the question I knew was coming. What did you learn?",
      "I land the balloon as gently as an owl can, which is to say with a bump and a hoot. Then I sit down beside her on the grass, because it is a good question and it needs sitting down for."] },
    { art: "hm_talk", say: ["First, that this country is many peoples' <em>home</em>. Everywhere I went, someone's family had been there for a very long time, and other families had come and made a home too.",
      "Second, that the people who were here first are still here. Not in a museum. Here, now, in their own towns and cities, speaking, teaching and laughing at my jokes. Mostly laughing.",
      "Third, that some of our history is hard, and that telling it truthfully is how you <em>look after</em> a place. You cannot mend what you will not look at.",
      "And last, that every place had a child who knew it better than any book. Lily nods slowly. She says that will do very nicely."] },
    { ask: "hm_friends", need: 6, intro: "Six friends have each sent one last question, one from every part of the journey. Six right answers and they will all come to say hello." },
    { art: "hm_gather", say: ["Then the clock on the balloon begins to chime, soft and clear, one note after another. Along the riverbank the friends appear one by one, as if the notes had called them. First the Grade 5 friends: <em>Lily, Noah, Maya and Nina</em>.",
      "Then the friends from the east, Grade 6: <em>Léa, Olivier, Élodie, Sadie, Amara and Declan</em>. Léa waves with both arms, and the notes keep coming.",
      "Then the friends from the west, Grade 7: <em>Zoe, Kai, Jade, Tyson, Priya and Lukas</em>. They walk across the grass as if they had only been over the next hill.",
      "And last the friends from the mountains and the North, Grade 8: <em>Mei, Jordan, Simran, Kayla, Hannah and Dana</em>. That is twenty-two friends on one riverbank, and one very proud owl in the middle."] },
    { ask: "hm_last", intro: "The last puzzle of all is a case file in three steps, about the whole journey. The numbers are rough and round. Three right answers and I have something to tell you." },
    { art: "hm_thanks", say: ["There is one more thank you, and it is for you. Yes, you, the one reading this. You are the child who has been travelling with me all this time.",
      "It was your answers that opened every door. Every chime, every window, every gate on this long trip, you found the key. I only drove the balloon, and not always in a straight line.",
      "A <em>certificate</em> is waiting for you. Hang it on the wall, or on the fridge, or both. And thank you. I mean it with every feather."] },
    { art: "hm_spin", say: ["The others have said goodnight and gone home along the river. It is very quiet. I hang my goggles on the basket, and I say it out loud to the stars. I am home for good. I find that I mean it.",
      "Then the clock begins to spin, faster than it has ever spun before. Its hands become a blur, lines of light spinning out into the dark. It points at nowhere on any map. I look at it. I look at you.",
      "Out with the old, in with the new! It's been a hoooot!",
      "Tick tock."] }
  ] };
}
