"use strict";
// Grade 6, Chapter 4: The People of the Dawn. Dr. Somebody meets Sadie, a Mi'kmaw girl of today, beside the Bras d'Or Lake on Cape Breton Island (Unama'ki).
{
  const SADIE = { hood: "#d94f70" };                 // this chapter's child guide: long hair and a rose-red hoodie
  const SPRUCE = "#2a6e4c";
  // an eight-pointed star in red, yellow, white and black (r is the outer radius)
  const star8 = (x, y, r, rot) => {
    const pts = k => Array.from({ length: 16 }, (_, i) => { const a = (rot || 0) * Math.PI / 180 + i * Math.PI / 8 - Math.PI / 2, rr = i % 2 ? k * .42 : k; return `${(x + rr * Math.cos(a)).toFixed(1)},${(y + rr * Math.sin(a)).toFixed(1)}`; }).join(" ");
    const big = r >= 14, ln = big ? INKED : THIN;
    return `<polygon points="${pts(r)}" fill="#d62839" ${ln}/><polygon points="${pts(r * .68)}" fill="#ffd23f" ${big ? THIN : ""}/><polygon points="${pts(r * .4)}" fill="#fff" ${big ? THIN : ""}/><circle cx="${x}" cy="${y}" r="${(r * .13).toFixed(1)}" fill="#2b1a10"/>`;
  };
  // Sadie wears the star on her jacket
  const sadieAt = (x, y, s) => `${kidAt(x, y, s, SADIE)}${star8(x, +(y + 36 * s).toFixed(1), +(6.5 * s).toFixed(1))}`;
  // a wikuom: a cone of pale birchbark with poles sticking out at the top and a dark door (x, y is the middle of the ground line)
  const wikuom = (x, y, s) => `<g transform="translate(${x} ${y}) scale(${s})"><path d="M-8 -54 L-14 -74 M0 -54 V-78 M8 -54 L15 -74" fill="none" stroke="#5a3a1c" stroke-width="3.4" stroke-linecap="round"/>
    <g ${INKED}><path d="M-36 0 L-5 -56 H5 L36 0 Z" fill="#f0dcb0"/></g><path d="M-26 -20 Q0 -13 26 -20 M-16 -38 Q0 -32 16 -38" fill="none" stroke="#b8975c" stroke-width="2" stroke-linecap="round"/><path d="M-12 -4 L-6 -10 M12 -6 L6 -12" fill="none" stroke="#b8975c" stroke-width="1.6"/>
    <g ${THIN}><path d="M-8 0 V-14 Q0 -26 8 -14 V0 Z" fill="#3a2616"/></g></g>`;
  // a birchbark canoe with sides that rise in the middle to keep out ocean waves. o.who: paddlers
  const bkcanoe = (x, y, s, o) => { o = o || {}; const who = o.who === undefined ? 2 : o.who, seats = who === 0 ? [] : who === 1 ? [0] : [-20, 20];
    return `<g transform="translate(${x} ${y}) scale(${s})">${seats.map(sx => paddler(sx, -8, 1, {})).join("")}
    <g ${INKED}><path d="M-60 -18 Q-52 -4 -34 -4 Q-16 -4 0 -11 Q16 -4 34 -4 Q52 -4 60 -18 Q58 8 34 12 H-34 Q-58 8 -60 -18 Z" fill="${o.c || "#ecd3a3"}"/></g>
    <path d="M-55 -9 Q-48 -1 -34 -1 Q-16 -1 0 -8 Q16 -1 34 -1 Q48 -1 55 -9" fill="none" stroke="#8a5a2b" stroke-width="2.4" stroke-linecap="round"/><path d="M-30 4 q4 -3 8 0 M-6 6 q4 -3 8 0 M18 4 q4 -3 8 0" fill="none" stroke="#8a5a2b" stroke-width="1.4" stroke-linecap="round"/></g>`; };
  // a bald eagle soaring: brown wings and body, white head and tail, yellow beak
  const eagle = (x, y, s) => `<g transform="translate(${x} ${y}) scale(${s})" ${INKED}><path d="M-8 18 L-8 34 L8 34 L8 18 Z" fill="#fff"/><path d="M0 0 Q-30 -26 -62 -10 Q-48 -4 -44 6 Q-34 0 -26 10 Q-14 2 0 8 Q14 2 26 10 Q34 0 44 6 Q48 -4 62 -10 Q30 -26 0 0 Z" fill="#5a3a22"/><ellipse cx="0" cy="8" rx="7" ry="13" fill="#5a3a22"/><circle cx="0" cy="-6" r="7" fill="#fff"/><path d="M5 -6 L14 -3 L5 0 Z" fill="#ffd23f"/><circle cx="2.5" cy="-8" r="1.3" fill="#2b1a10" stroke="none"/></g>`;
  const sailboat = (x, y, s) => `<g transform="translate(${x} ${y}) scale(${s})" ${THIN}><path d="M-20 0 H20 L13 10 H-13 Z" fill="#e63946"/><path d="M0 0 V-34" fill="none" stroke-width="2.4"/><path d="M3 -32 V-4 H20 Z" fill="#fff"/><path d="M-3 -26 V-4 H-14 Z" fill="#fff"/></g>`;
  // low wooded hills across the calm lake
  const farHills = () => `<g ${INKED}><path d="M-10 124 Q30 98 80 112 Q130 92 190 110 Q250 90 310 108 Q360 94 410 110 V152 H-10 Z" fill="#6aa878"/></g>${[30, 95, 170, 250, 330, 385].map((x, i) => pine(x, 120 - (i % 3) * 3, .38, "#2f7a52")).join("")}`;
  const ground = (y, c) => `<g ${INKED}><path d="M-10 ${y} Q100 ${y - 14} 210 ${y} T410 ${y - 4} V250 H-10 Z" fill="${c}"/></g>`;
  const dayTop = clouds => `${sky("#9fd8f2", "#f4f1d8", [344, 40, 20], clouds)}`;

  // the camp long ago, seen through the window: wikuoms on the shore and canoes on the water
  const campLongAgo = `<rect width="400" height="240" fill="#f6e3b4"/>${sun(262, 62, 14)}<g ${INKED}><path d="M130 104 Q180 80 230 98 Q280 78 342 100 V124 H130 Z" fill="#7fb98a"/></g>
    ${water(112, "#6cc0ea")}${bkcanoe(200, 138, .6, { who: 2 })}${bkcanoe(282, 130, .5, { who: 1 })}
    <g ${INKED}><path d="M130 160 Q236 140 342 158 V250 H130 Z" fill="#b9d98f"/></g>${pine(168, 168, .7, SPRUCE)}${pine(318, 164, .65, SPRUCE)}${wikuom(196, 170, .7)}${wikuom(280, 168, .65)}${wikuom(240, 178, .8)}${person(216, 150, .42, "#3f7f8a")}${person(266, 148, .4, "#c98f58")}`;
  // the 1700s: two people with a paper between them at a table
  const treatyLook = `<rect width="400" height="240" fill="#f6e3b4"/><g ${INKED}><path d="M130 100 Q236 88 342 102 V130 H130 Z" fill="#6cc0ea"/></g>${ship(236, 118, .45)}<g ${INKED}><path d="M130 128 Q236 116 342 130 V250 H130 Z" fill="#b9d98f"/></g>${pine(160, 138, .6, SPRUCE)}${pine(322, 138, .6, SPRUCE)}
    <g ${INKED}><rect x="206" y="156" width="64" height="8" rx="2" fill="#8a5a2b"/><rect x="212" y="164" width="6" height="26" fill="#8a5a2b"/><rect x="258" y="164" width="6" height="26" fill="#8a5a2b"/></g>
    <g ${THIN}><rect x="226" y="148" width="24" height="9" fill="#fff"/><path d="M230 151 H246 M230 154 H242" fill="none"/></g>
    ${person(188, 140, .8, "#3f7f8a")}${person(292, 140, .8, "#c1272d")}<g transform="translate(292 140) scale(.8)" ${THIN}><path d="M-11 -14 H11 L7 -21 H-7 Z" fill="#2b1a10"/></g>`;

  Object.assign(ART, {
    mk_arrive: () => frame(`${dayTop([[80, 40, .8], [250, 30, .6]])}${farHills()}${water(128, "#5db7e6")}${eagle(330, 84, .55)}${sailboat(190, 166, .7)}${ground(192, "#9ed08f")}${pine(40, 216, 1.2, SPRUCE)}${pine(74, 224, .9, SPRUCE)}${house(262, 174, 30, 22, "#e63946")}${house(300, 178, 28, 20, "#3b82c4")}${house(338, 174, 30, 22, "#f4b942")}${riding(120, 0, 120)}`),
    mk_sadie: () => frame(`${dayTop([[70, 44, .8]])}${farHills()}${water(140)}${sailboat(318, 168, .8)}${ground(202, "#a9cf86")}${pine(352, 208, 1.1, SPRUCE)}${pine(378, 216, .9, SPRUCE)}${owlAt(66, 116, 112)}${sadieAt(204, 144, 1.05)}`),
    mk_window1: () => frame(`${sky("#9fd8f2", "#f4f1d8", null, [[60, 40, .7]])}${water(176)}${shore}${windowAt(236, 112, 92, campLongAgo)}${owlAt(18, 118, 108)}${sadieAt(118, 150, .95)}`),
    mk_star: () => frame(`${dayTop([[60, 36, .7]])}${farHills()}${water(124)}${sailboat(206, 140, .5)}${eagle(112, 66, .75)}${ground(196, "#a9cf86")}
      <g ${INKED}><rect x="230" y="104" width="138" height="76" fill="#fbf1dc"/><polygon points="222,104 299,64 376,104" fill="#3b82c4"/><rect x="334" y="140" width="22" height="40" rx="2" fill="#8a5a2b"/><rect x="240" y="142" width="24" height="20" fill="#bfe6f7"/></g>${star8(298, 126, 24)}${pine(386, 190, 1, SPRUCE)}
      ${owlAt(24, 132, 96)}${sadieAt(166, 148, 1)}`),
    mk_window2: () => frame(`${sky("#9fd8f2", "#f4f1d8", null, [[60, 40, .7]])}${water(176)}${shore}${windowAt(236, 112, 92, treatyLook)}${owlAt(18, 118, 108)}${sadieAt(118, 150, .95)}`),
    mk_choice: () => frame(`${dayTop([[250, 30, .7]])}${farHills()}${water(126)}${eagle(330, 58, .8)}${ground(172, "#a9cf86")}${bkcanoe(84, 188, .8, { who: 0 })}
      <path d="M262 236 Q312 206 298 176 T330 148" fill="none" stroke="#2b1a10" stroke-width="15" stroke-linecap="round"/><path d="M262 236 Q312 206 298 176 T330 148" fill="none" stroke="#d9c7a0" stroke-width="10" stroke-linecap="round"/>
      ${pine(356, 168, 1.2, SPRUCE)}${pine(384, 178, 1, SPRUCE)}${owlAt(150, 146, 84)}${sadieAt(220, 164, .8)}`),
    mk_paddle: () => frame(`${dayTop([[70, 40, .8]])}${farHills()}${water(120, "#5db7e6")}${eagle(90, 62, .7)}${sailboat(330, 150, .5)}${owlAt(150, 110, 80)}${sadieAt(258, 104, .85)}${bkcanoe(200, 176, 1.5, { who: 0 })}`),
    mk_trail: () => frame(`${dayTop([[70, 36, .7]])}${farHills()}${water(132)}${ground(172, "#8fc27a")}
      <path d="M130 250 Q200 214 252 204 Q310 192 286 164" fill="none" stroke="#2b1a10" stroke-width="16" stroke-linecap="round"/><path d="M130 250 Q200 214 252 204 Q310 192 286 164" fill="none" stroke="#d9c7a0" stroke-width="11" stroke-linecap="round"/>
      ${pine(318, 190, 1.2, SPRUCE)}${pine(352, 204, 1.4, SPRUCE)}${pine(386, 196, 1.1, SPRUCE)}${eagle(250, 64, 1)}${owlAt(30, 124, 104)}${sadieAt(150, 146, 1)}`),
    mk_goodbye: () => frame(`${sky("#ffd9a0", "#fdebd0", null, [[90, 40, .8], [250, 56, .6]])}${sun(120, 112, 24)}${farHills()}${water(130, "#7fb7d6")}${sailboat(70, 166, .7)}${ground(204, "#a9cf86")}${pine(364, 210, 1.1, SPRUCE)}${balloonAt(284, 28, 120)}${owlAt(60, 124, 104)}${sadieAt(184, 146, 1)}`)
  });

  Object.assign(ASK, {
    mk_turns() { // angles: turns of a star, straight lines, full and part turns
      const kind = rand(3);
      if (kind === 0) { const n = pick([4, 5, 6, 8, 9, 10, 12, 15, 18, 20, 24]), a = 360 / n; return { html: "", text: `Sadie draws a star in the sand with <b>${n} points</b>, spaced evenly around a circle. How many degrees is the turn from one point to the next?`, choices: cards(a, [a + 10, a - 10, a * 2, n, a + 5, 180 - a]), why: `A full turn is 360 degrees. 360 ÷ ${n} = ${a} degrees.` }; }
      if (kind === 1) { const x = pick([20, 35, 40, 55, 65, 70, 110, 125, 130, 145, 160]), a = 180 - x; return { html: "", text: `Two corners of her drawing sit side by side on a straight line. One is <b>${x}°</b>. How many degrees is the other one?`, choices: cards(a, [x, a + 10, a - 10, 360 - x, 90 - x, a + 20]), why: `Angles on a straight line add to 180. 180 − ${x} = ${a}.` }; }
      const [name, deg, how] = pick([["a quarter turn", 90, "A quarter of 360 is 360 ÷ 4 = 90."], ["a half turn", 180, "Half of 360 is 180."], ["three quarter turns", 270, "3 × 90 = 270."], ["a full turn and then a quarter turn", 450, "360 + 90 = 450."]]);
      return { html: "", text: `Sadie spins her star clockwise by <b>${name}</b>. How many degrees did it turn?`, choices: cards(deg, [deg + 90, deg - 90, 360, 180, 45, 90]), why: `A full turn is 360 degrees. ${how}` };
    },
    mk_triangles() { // angles in a triangle: the missing angle, equal base angles, and naming an obtuse angle
      const kind = rand(3), A = [30, 35, 40, 45, 50, 55, 60, 65, 70, 75, 80];
      if (kind === 0) { const a = pick(A), b = pick(A.filter(v => a + v <= 150)), t = 180 - a - b; return { html: "", text: `The poles of a wikuom frame make a triangle. Two angles are <b>${a}°</b> and <b>${b}°</b>. How many degrees is the third angle?`, choices: cards(t, [a + b, 180 - a, 180 - b, t + 10, t - 10, 90 - a]), why: `Angles in a triangle add to 180. ${a} + ${b} = ${a + b}, and 180 − ${a + b} = ${t}.` }; }
      if (kind === 1) { const p = pick([20, 40, 60, 80, 100, 120]), base = (180 - p) / 2; return { html: "", text: `Two poles of the same length meet at the top at <b>${p}°</b>. The two angles at the bottom are equal. How many degrees is each one?`, choices: cards(base, [180 - p, p / 2, base + 10, base - 10, 90, base + 5]), why: `180 − ${p} = ${180 - p}. Share that between two equal angles. ${180 - p} ÷ 2 = ${base}.` }; }
      const right = pick([100, 110, 120, 135, 150, 160]); return { html: "", text: `Sadie measures some corners of a star design. Which of these angles is <b>obtuse</b>, bigger than 90° but smaller than 180°?`, choices: textCards(right + "°", ["90°", "45°", "30°", "60°", "85°"]), why: `An obtuse angle is more than 90° and less than 180°. ${right}° is the only one that is. 90° is right, and the others are acute.` };
    },
    mk_beads() { // growing and repeating patterns
      const kind = rand(3);
      if (kind === 0) { const s = pick([3, 4, 5, 6]), d = pick([2, 3, 4, 5]), t = s + 9 * d; return { html: "", text: `Sadie's grandmother beads a triangle. Row 1 has <b>${s} beads</b>, and every new row has <b>${d} more</b>. How many beads are in row <b>10</b>?`, choices: cards(t, [t + d, t - d, s + 10 * d, 10 * d, 10 * s, s + 9]), why: `Row 10 comes 9 rows after row 1. ${s} + 9 × ${d} = ${t} beads.` }; }
      if (kind === 1) { const L = pick([4, 5]), cols = ["red", "yellow", "white", "black", "blue"].slice(0, L), N = 14 + rand(26), r = N % L, q = (N - r) / L, right = cols[(N - 1) % L];
        return { html: "", text: `A string of beads repeats <b>${cols.join(", ")}</b>, over and over. What colour is bead number <b>${N}</b>?`, choices: textCards(right, cols.filter(c => c !== right)), why: `The pattern repeats every ${L} beads. ${N} ÷ ${L} = ${q} remainder ${r}, so ${r ? `it is colour number ${r} of the pattern` : "it is the last colour of the pattern"}: ${right}.` }; }
      const d = pick([3, 4, 5, 6]), c = pick([1, 2]), seq = [1, 2, 3, 4].map(n => d * n + c), right = `${d}n + ${c}`;
      return { html: "", text: `Rows of quills hold <b>${seq.join(", ")}</b> quills. If n is the row number, which rule gives the number of quills in any row?`, choices: textCards(right, [`${d}n`, `${d}n + ${c + 1}`, `${d + 1}n + ${c}`, `${c}n + ${d}`, `n + ${d}`]), why: `Each row adds ${d}, so the rule starts with ${d}n. Row 1 has ${d + c}, which is ${d} + ${c}, so add ${c}.` };
    },
    mk_symmetry() { // transformations in words: symmetry, turns, and perimeter of regular shapes
      const kind = rand(3);
      if (kind === 0) { const n = pick([4, 5, 6, 8, 10, 12]);
        if (rand(2)) return { html: "", text: `The star on Sadie's jacket has <b>${n} points</b>, all the same size. How many lines of symmetry does it have?`, choices: cards(n, [n / 2, n * 2, n + 1, n - 1, 1, 2]), why: `A regular star with ${n} points can be folded exactly in half in ${n} ways. It has ${n} lines of symmetry.` };
        return { html: "", text: `Turn a star with <b>${n} points</b> one full turn. How many times does it fit exactly onto itself, counting the finish?`, choices: cards(n, [n / 2, n * 2, n + 1, n - 1, 1, 2]), why: `It fits again after every ${360 / n} degrees. 360 ÷ ${360 / n} = ${n} times in one full turn.` }; }
      if (kind === 1) { const k = 1 + rand(3), cw = rand(2) === 0, dirs = ["up", "right", "down", "left"], right = dirs[cw ? k % 4 : (4 - k) % 4], words = ["one", "two", "three"][k - 1];
        return { html: "", text: `An arrow on Sadie's jacket points <b>up</b>. Turn it <b>${words} quarter turn${k > 1 ? "s" : ""}</b> <b>${cw ? "clockwise" : "counterclockwise"}</b>. Which way does it point now?`, choices: textCards(right, dirs.filter(d => d !== right)), why: `${k} quarter turn${k > 1 ? "s are" : " is"} ${k * 90} degrees. Turning ${cw ? "clockwise" : "counterclockwise"} from up, it points ${right}.` }; }
      const n = pick([5, 6, 8, 10]), name = { 5: "pentagon", 6: "hexagon", 8: "octagon", 10: "decagon" }[n], s = 3 + rand(7), P = n * s;
      return { html: "", text: `A bead frame is a regular <b>${name}</b>. Each side is <b>${s} cm</b> long. What is the perimeter of the frame, in centimetres?`, choices: cards(P, [P + s, P - s, n + s, (n - 1) * s, 2 * P, s * s]), why: `A regular ${name} has ${n} equal sides. ${n} × ${s} = ${P} cm.` };
    }
  });

  // FACT CHECK: The Mi'kmaq have lived in Mi'kma'ki for more than 10,000 years (often given as 13,000 years). The scene says "more than 10,000 years".
  // FACT CHECK: Spelling and meaning of the Mi'kmaw words (Francis-Smith orthography): kwe' (hello), wela'lin (thank you), Unama'ki (Cape Breton Island), Mi'kma'ki (the Mi'kmaw homeland), wikuom (a birchbark home), nmu'ltes (see you again).
  // FACT CHECK: "Mi'kmaq" is the plural, the people. "Mi'kmaw" describes things (the Mi'kmaw language) and is also used for one person.
  // FACT CHECK: Mi'kma'ki covers the Maritime provinces (Nova Scotia, New Brunswick, Prince Edward Island) and part of Quebec's Gaspé peninsula (also parts of Newfoundland and Maine in some descriptions, left out here).
  // FACT CHECK: The Mi'kmaq are one of the Wabanaki nations. Wabanaki is often translated as People of the Dawn, because their homelands are in the east, where the dawn comes early. (Changed from "the sun reaches their land first" to avoid clashing with Chapter 6, where Cape Spear is where the sun rises first; per Shane's review notes, November 2026.)
  // FACT CHECK: The Bras d'Or Lake is a large salt-water (tidal) lake in the middle of Cape Breton Island.
  // FACT CHECK: Wikuoms were homes made of poles covered with birchbark (a cone shape). Families fished and gathered by the sea in the warm months and moved inland for winter.
  // FACT CHECK: Mi'kmaw birchbark canoes are known for sides that rise in the middle, so they can ride ocean waves.
  // FACT CHECK: The eight-pointed star has been used by the Mi'kmaq for a very long time and appears today in quillwork, beadwork, and on jackets and buildings. The scene gives no meaning for it.
  // FACT CHECK: The Peace and Friendship Treaties were made between the Mi'kmaq (and other Wabanaki peoples) and the British Crown in the 1700s (the first in 1725, the last in 1779). In them the Mi'kmaq did not surrender their land.
  // FACT CHECK: The treaties are still in force today (the Supreme Court of Canada affirmed treaty rights, for example in the 1999 Marshall decision). October 1 is Treaty Day in Nova Scotia.
  // FACT CHECK: Added from Shane's review notes (November 2026): the eight-pointed star is a very old Mi'kmaw design, seen in quillwork and beadwork, and many people connect it with the sun (no meaning is given for the eight points). Many Mi'kmaw families still fish and gather along these waters today. The treaty scene names Mi'kmaw leaders and British officials, and says the Peace and Friendship Treaties still protect Mi'kmaw rights today, such as fishing and gathering. Pronunciation guides added; goodbye word respelled nmu'ltes.
  // FACT CHECK: Bald eagles live and nest around the Bras d'Or Lake.
  // FACT CHECK: Halifax is the next stop, along the coast.
  CHAPTERS[3] = { title: "The People of the Dawn", where: "Mi'kmaw country, Cape Breton", beats: [
    { art: "mk_arrive", word: ["Unama'ki", "Cape Breton Island (say oo-nah-MAH-gee)"], say: ["East we go again! The clock followed the coast, and now we float over an island with a great blue lake right in the middle. Hold on to your hat. I landed on a goose last time.",
      "The Mi'kmaq call this island <em>Unama'ki</em>. You say Mi'kmaq like MEEG-mah, and Unama'ki like oo-nah-MAH-gee.",
      "You may know it as Cape Breton Island. The Mi'kmaq have lived here for more than 10,000 years, and they live here today.",
      "That blue lake is the <em>Bras d'Or Lake</em>. It is salty like the sea, even though it sits in the middle of the island. Down we go!"] },
    { art: "mk_sadie", word: ["kwe'", "hello, in Mi'kmaw (say gway)"], say: ["A girl is waving from the shore. This is Sadie. She is a <em>Mi'kmaw</em> girl (you say it MEEG-maw), and she lives in a community right beside the lake.",
      "Mi'kmaw is the word for one person, and for the language too. All the people together are the <em>Mi'kmaq</em>.",
      "Sadie goes to school, and she is learning the Mi'kmaw language from her grandmother. This is how she says hello. <em>Kwe'</em>! You say it gway. I said it back, and I think I got it right. Mostly."] },
    { art: "mk_window1", who: "The clock", say: ["Tick, tock. Time to look back. My window is open."] },
    { art: "mk_window1", word: ["wikuom", "a birchbark home (say WEE-goo-om)"], say: ["The window into the past! This is a summer camp by the shore, long before any ships came. The Mi'kmaq have lived on this land for more than <em>10,000 years</em>.",
      "See the cone-shaped homes? Each one is a <em>wikuom</em>. You say it WEE-goo-om. It is made of poles covered with birchbark. And look at the canoes. Their sides rise in the middle, to keep out ocean waves.",
      "Families fished and gathered by the sea in the warm months, and moved inland for winter. Many Mi'kmaw families still fish and gather along these waters today.",
      "Back on the shore, Sadie has drawn a star in the sand. Time to talk about turns!"] },
    { ask: "mk_turns", intro: "Help Sadie with her star in the sand. Three right answers and we go to see the star in her community." },
    { art: "mk_star", word: ["Mi'kma'ki", "the Mi'kmaw homeland (say MEEG-mah-gee)"], say: ["Sadie walks us along the shore. A bald eagle circles over the lake, and little boats bob on the water. I waved. The eagle ignored me.",
      "On the community building is a big <em>eight-pointed star</em>, in red, yellow, white and black. Sadie has a little one on her jacket too. The Mi'kmaq have used this star for a very long time.",
      "It is a very old Mi'kmaw design. You can see it today in quillwork and beadwork, and on jackets and buildings. Many people connect it with the sun.",
      "And all this land is <em>Mi'kma'ki</em>, the Mi'kmaw homeland. You say it MEEG-mah-gee. It covers the Maritime provinces and more."] },
    { art: "mk_star", say: ["The Mi'kmaq are one of the Wabanaki nations. That name is often translated as <em>People of the Dawn</em>, because their homelands are in the east, where the dawn comes early. Early birds, just like me."] },
    { ask: "mk_triangles", intro: "Check the poles and the star corners with Sadie. Three right answers and the window opens again." },
    { art: "mk_window2", who: "The clock", say: ["Tick, tock. The window opens again."] },
    { art: "mk_window2", say: ["Back to the window, and now it is the 1700s. Mi'kmaw leaders and British officials stand at a table with a paper between them. This is a <em>treaty</em>, a promise made between two peoples.",
      "These are the <em>Peace and Friendship Treaties</em>, made between the Mi'kmaq and the British Crown in the 1700s. The Mi'kmaq did not give up their land in them.",
      "And here is the best part. Those treaties are still in force today, and every October 1 is <em>Treaty Day</em> in Nova Scotia. They still protect Mi'kmaw rights today, such as fishing and gathering.",
      "Sadie says a treaty is a promise you keep looking after. So is beadwork. She likes things neat, so she brought her beads."] },
    { ask: "mk_beads", intro: "Count the beads and quills with Sadie. Three right answers and we pick our afternoon." },
    { art: "mk_choice", pick: "Sadie has two ideas for the afternoon. Shall we paddle a canoe on the lake, or walk the shore trail to look for eagles?", options: [
      { label: "Paddle a canoe", art: "mk_paddle", word: ["wela'lin", "thank you (say weh-LAH-lin)"], say: ["Paddles up! A canoe is waiting by the water, and Sadie shows me how to paddle with my wings tucked in. Dip, pull, dip, pull. I only splashed myself twice.",
        "When we reach the shore again, Sadie says <em>wela'lin</em>. You say it weh-LAH-lin. It means thank you. I say it right back, for the paddling lesson."] },
      { label: "Walk the shore trail", art: "mk_trail", word: ["nmu'ltes", "see you again (say nem-OOL-tes)"], say: ["Up the shore trail we go, under the spruce trees, with our eyes on the sky. A bald eagle glides right over us, as wide as a door.",
        "When it flies off, Sadie waves and says <em>nmu'ltes</em>. You say it nem-OOL-tes. It means see you again. I said it too, in case the eagle was listening."] }] },
    { ask: "mk_symmetry", intro: "One last set of puzzles for the day. Three right answers finishes the chapter." },
    { art: "mk_goodbye", say: ["The sun sinks low over the hills, and the whole lake glows. Sadie says the dawn will come early to her land again tomorrow, as it always does.",
      "Thank you, Sadie, for showing me your home today. It was a big treat to meet someone who lives in the place we have been looking at through the window.",
      "Next the balloon follows the coast to <em>Halifax</em>, a busy harbour on the sea. Back into the basket I go. Tick tock!"] }
  ] };
}
