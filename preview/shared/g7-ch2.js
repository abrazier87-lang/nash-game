"use strict";
// Grade 7, Chapter 2: The Forks. Where the Assiniboine meets the Red, a meeting place for thousands of years, and the fur trade as two people saw it.
{
  const GUIDE = { hood: "#f4b942", short: true }; // Kai: short dark hair and a yellow hoodie

  // ---------- my own drawing pieces ----------
  // two rivers joining like a Y, seen from a low hill: the Assiniboine comes in from the left, the Red from below, and the Red runs on north
  const rivers = () => { const a = "M-10 196 Q90 176 160 156 Q190 146 210 140", r = "M276 250 Q236 192 212 142 Q196 112 198 78";
    return `<g fill="none" stroke-linecap="round" stroke-linejoin="round"><path d="${a}" stroke="#2b1a10" stroke-width="35"/><path d="${r}" stroke="#2b1a10" stroke-width="35"/><path d="${a}" stroke="#5db7e6" stroke-width="29"/><path d="${r}" stroke="#5db7e6" stroke-width="29"/>
    <path d="M-4 192 Q90 172 156 152 M250 232 Q222 190 204 142 M194 124 Q190 100 194 84" stroke="#fff" stroke-width="2.2" opacity=".7"/></g>`; };
  // a little white arrow lying on the water, turned by a degrees (0 points up the page, which is north)
  const arrowOn = (x, y, a) => `<g transform="translate(${x} ${y}) rotate(${a})" ${THIN}><path d="M-7 8 L0 -10 L7 8 L0 4 Z" fill="#fff"/></g>`;
  // the market building at The Forks, with its tower
  const market = (x, y, s) => `<g transform="translate(${x} ${y}) scale(${s})" ${INKED}><rect x="-46" y="-28" width="92" height="28" fill="#e9d2b0"/><path d="M-52 -28 L-40 -42 H40 L52 -28 Z" fill="#a8452a"/><rect x="-8" y="-88" width="16" height="48" fill="#d6c7ae"/><polygon points="-12,-88 0,-110 12,-88" fill="#4a7a9a"/>
    <rect x="-4" y="-78" width="8" height="10" fill="#bfe6f7"/>${[-34, -20, 20, 34].map(wx => `<rect x="${wx - 5}" y="-22" width="10" height="12" fill="#bfe6f7"/>`).join("")}<rect x="-6" y="-18" width="12" height="18" rx="2" fill="#8a5a2b"/></g>`;
  // a modern footbridge: a flat deck, a tall slim tower and cables
  const footbridge = (x, y, w) => { const c = x + w / 2, t = y - 48;
    return `<g ${THIN} fill="none"><path d="M${c} ${t} L${x + 6} ${y} M${c} ${t} L${x + w * .25} ${y} M${c} ${t} L${x + w * .75} ${y} M${c} ${t} L${x + w - 6} ${y}" stroke-width="1.6"/></g>
    <g ${INKED}><rect x="${x + 20}" y="${y + 6}" width="7" height="18" fill="#9aa3af"/><rect x="${x + w - 27}" y="${y + 6}" width="7" height="18" fill="#9aa3af"/><rect x="${x}" y="${y}" width="${w}" height="8" rx="3" fill="#e9eef2"/><polygon points="${c - 5},${y} ${c + 5},${y} ${c + 2.5},${t} ${c - 2.5},${t}" fill="#c9ced6"/></g>`; };
  // the far bank, a thin green strip behind the river
  const farBank = `<g ${INKED}><path d="M-10 108 Q100 92 200 102 T410 98 V114 Q300 122 200 114 T-10 118 Z" fill="#a9cf86"/></g>`;
  // a beaver facing right (feet on y)
  const beaver = (x, y, s) => `<g transform="translate(${x} ${y}) scale(${s})" ${INKED}><ellipse cx="-38" cy="-6" rx="15" ry="6" fill="#4a3518"/><ellipse cx="-4" cy="-14" rx="26" ry="15" fill="#8a5a2b"/><circle cx="22" cy="-18" r="11" fill="#8a5a2b"/><circle cx="16" cy="-27" r="3.6" fill="#7a4a24"/>
    <circle cx="26" cy="-21" r="1.8" fill="#2b1a10" stroke="none"/><ellipse cx="32" cy="-16" rx="3.4" ry="2.6" fill="#2b1a10"/><rect x="28" y="-13" width="4" height="6" rx="1" fill="#fff" stroke-width="1.2"/><ellipse cx="6" cy="-1" rx="8" ry="3.6" fill="#7a4a24"/></g>`;
  // a beaver lodge: a dome of sticks
  const lodge = (x, y, s) => `<g transform="translate(${x} ${y}) scale(${s})" ${INKED}><path d="M-40 0 Q-38 -46 0 -48 Q38 -46 40 0 Z" fill="#8a5a2b"/></g>
    <g transform="translate(${x} ${y}) scale(${s})" fill="none" stroke="#4a3518" stroke-width="2" stroke-linecap="round"><path d="M-30 -10 L-8 -30 M-10 -8 L14 -36 M10 -4 L32 -24 M-34 -22 L-14 -40 M4 -42 L20 -14"/></g>`;
  // a rack of drying fish
  const rack = (x, y, s) => `<g transform="translate(${x} ${y}) scale(${s})" ${THIN}><path d="M-22 0 V-30 M22 0 V-30 M-26 -28 H26" fill="none" stroke-width="2.6" stroke="#8a5a2b"/>${[-14, -2, 10].map(fx => `<path d="M${fx} -27 q-4 8 0 16 q4 -8 0 -16 Z" fill="#f79a2e"/>`).join("")}</g>`;
  // a trading post on the river bank, with a flag on a tall pole
  const postHouse = (x, y, s, flag, roof) => `<g transform="translate(${x} ${y}) scale(${s})" ${INKED}><rect x="-36" y="-30" width="72" height="30" fill="#b98b54"/><polygon points="-42,-30 -30,-50 30,-50 42,-30" fill="${roof}"/><rect x="-7" y="-22" width="14" height="22" rx="2" fill="#4a3518"/>
    <rect x="-28" y="-24" width="12" height="10" fill="#bfe6f7"/><rect x="16" y="-24" width="12" height="10" fill="#bfe6f7"/><path d="M0 -50 V-82" fill="none" stroke-width="3"/><path d="M0 -80 H26 Q22 -72 26 -64 H0 Z" fill="${flag}"/></g>`;
  // things on the shelves and counter of a trading post
  const kettleP = (x, y, s) => `<g transform="translate(${x} ${y}) scale(${s})" ${THIN}><path d="M-9 -15 Q0 -27 9 -15" fill="none"/><path d="M-12 -15 H12 Q17 -3 9 0 H-9 Q-17 -3 -12 -15 Z" fill="#c9793a"/><path d="M12 -11 q9 0 7 -7" fill="none" stroke-width="2"/></g>`;
  const blanketRoll = (x, y, s, c) => `<g transform="translate(${x} ${y}) scale(${s})" ${THIN}><rect x="-17" y="-14" width="34" height="14" rx="5" fill="#fbf6ea"/><path d="M-17 -9 H17 M-17 -4 H17" fill="none" stroke="${c}" stroke-width="3"/></g>`;
  const pelts = (x, y, s) => `<g transform="translate(${x} ${y}) scale(${s})" ${THIN}>${[0, 1, 2].map(i => `<ellipse cx="${i % 2 ? 3 : -2}" cy="${-i * 7 - 4}" rx="${25 - i * 2}" ry="7" fill="${["#8a5a2b", "#a0693a", "#7a4a24"][i]}"/>`).join("")}</g>`;
  const scales = (x, y, s) => `<g transform="translate(${x} ${y}) scale(${s})" ${THIN}><rect x="-8" y="-4" width="16" height="4" rx="2" fill="#6a6f7a"/><path d="M0 -4 V-34 M-22 -32 H22" fill="none" stroke-width="3"/><path d="M-22 -32 L-30 -14 H-14 Z M22 -32 L14 -14 H30 Z" fill="#c9ced6"/></g>`;
  // the inside of a trading post: shelves, a counter, a scale, a stack of pelts, and the trader behind the counter
  const postInside = (accent, coat, px, ps) => `<rect width="400" height="240" fill="#c89a5e"/><g stroke="#8a5a2b" stroke-width="1.4" opacity=".6">${[40, 80, 120, 160, 200, 240, 280, 320, 360].map(x => `<line x1="${x}" y1="0" x2="${x}" y2="200"/>`).join("")}</g>
    <rect y="196" width="400" height="44" fill="#7a5326"/><g ${INKED}><rect x="24" y="56" width="352" height="7" fill="#6a4a2a"/><rect x="24" y="108" width="352" height="7" fill="#6a4a2a"/></g>
    ${[60, 100, 140, 300, 340].map(x => kettleP(x, 56, 1)).join("")}${[200, 244].map(x => blanketRoll(x, 56, 1.1, accent)).join("")}${[56, 96, 136].map(x => blanketRoll(x, 108, 1.1, accent)).join("")}${[230, 278, 326].map(x => kettleP(x, 108, 1)).join("")}
    ${person(px, 150 - 26 * ps, ps, coat)}<g ${INKED}><rect x="-4" y="162" width="408" height="40" fill="#8a5a2b"/><rect x="-4" y="156" width="408" height="9" rx="3" fill="#a9703a"/></g>${scales(72, 157, 1.1)}${pelts(338, 157, 1.1)}`;

  // ---------- the window into the past: a camp on the river bank, about 6,000 years ago ----------
  const longAgo1 = `<rect width="400" height="240" fill="#f6e3b4"/><g ${INKED}><path d="M130 116 Q236 96 342 116 V250 H130 Z" fill="#a9cf86"/></g>${tree(172, 112, .9, "#3f9a58")}${tree(198, 116, .7)}${tree(312, 108, .9, "#3f9a58")}
    ${tent(226, 150, .7)}${tent(270, 152, .62, "#e8c58a")}${rack(180, 160, 1)}${person(246, 128, .42)}${person(296, 142, .38, "#b98b54")}<g ${INKED}><path d="M130 172 Q236 158 342 174 V250 H130 Z" fill="#6cc0ea"/></g>${canoe(228, 192, .5, { who: 2 })}`;

  // ---------- the pictures ----------
  Object.assign(ART, {
    fk_arrive: () => frame(`${sky("#9fd8f2", "#f4f1d8", [346, 36, 20], [[70, 34, .8], [190, 24, .6]])}<g ${INKED}><path d="M-10 76 Q100 66 200 74 T410 72 V250 H-10 Z" fill="#a9cf86"/></g>${tree(340, 104, .9, "#3f9a58")}${tree(368, 112, .7)}${market(292, 130, .7)}${rivers()}${riding(40, 14, 100)}`),
    fk_kai: () => frame(`${sky("#9fd8f2", "#f4f1d8", [346, 36, 20], [[100, 34, .8], [250, 26, .6]])}${water(112, "#5db7e6")}${farBank}${market(70, 110, .8)}${footbridge(150, 98, 240)}<g ${INKED}><path d="M-10 172 Q110 156 210 172 T410 164 V250 H-10 Z" fill="#8cc084"/></g>${owlAt(40, 126, 104)}${kidAt(250, 146, 1, GUIDE)}`),
    fk_window1: () => frame(`${sky("#9fd8f2", "#f4f1d8", null, [[60, 40, .7]])}<g ${INKED}><path d="M-10 196 Q100 182 210 198 T410 196 V250 H-10 Z" fill="#a9cf86"/></g>${windowAt(236, 112, 92, longAgo1)}${owlAt(18, 118, 108)}${kidAt(118, 150, .95, GUIDE)}`),
    fk_today: () => frame(`${sky("#9fd8f2", "#f4f1d8", [346, 36, 20], [[130, 30, .7], [250, 22, .6]])}<g ${INKED}><path d="M-10 76 Q100 66 200 74 T410 72 V250 H-10 Z" fill="#a9cf86"/></g>${tree(350, 100, .9, "#3f9a58")}${tree(372, 110, .7)}${market(312, 126, .6)}${rivers()}${arrowOn(257, 221, -30)}${arrowOn(240, 194, -31)}${arrowOn(200, 112, -12)}${riding(36, 20, 96)}`),
    fk_trader: () => frame(postInside("#e63946", "#2f5d8a", 200, 1.7)),
    fk_hunter: () => frame(`${sky("#bfdcf0", "#eef4fb", [60, 36, 18], [[200, 34, .8], [320, 52, .6]])}${snow(150)}${snowPine(40, 160, 1.2)}${snowPine(346, 150, 1)}${lodge(310, 200, 1)}${beaver(250, 218, .9)}${snowWalker(210, 104, 1.5)}`),
    fk_choice: () => frame(`${sky("#9fd8f2", "#f4f1d8", [60, 36, 18], [[210, 30, .7], [330, 46, .6]])}${water(106, "#6cc0ea")}${farBank}${postHouse(100, 104, .9, "#e63946", "#6a4a2a")}${postHouse(300, 102, .9, "#3b82c4", "#4a3518")}${canoe(210, 128, .4, { who: 2, packs: 1 })}<g ${INKED}><path d="M-10 142 Q110 128 210 142 T410 136 V250 H-10 Z" fill="#8cc084"/></g>${owlAt(30, 126, 104)}${kidAt(310, 146, 1, GUIDE)}`),
    fk_hbc: () => frame(`${postInside("#e63946", "#2f5d8a", 280, 1.5)}${owlAt(14, 126, 104)}${kidAt(170, 146, .95, GUIDE)}`),
    fk_nwc: () => frame(`${postInside("#3b82c4", "#6a3a7a", 280, 1.5)}${owlAt(14, 126, 104)}${kidAt(170, 146, .95, GUIDE)}`),
    fk_goodbye: () => frame(`${sky("#ffd9a0", "#fdebd0", [70, 60, 20], [[210, 34, .7], [340, 30, .6]])}${water(112, "#6cc0ea")}${farBank}${market(70, 108, .8)}${footbridge(190, 98, 200)}${balloonAt(150, 12, 84)}<g ${INKED}><path d="M-10 172 Q110 156 210 172 T410 164 V250 H-10 Z" fill="#8cc084"/></g>${owlAt(30, 126, 104)}${kidAt(250, 146, 1, GUIDE)}`)
  });

  // ---------- the questions ----------
  const km = x => `${Math.round(x * 10) / 10} km`;
  Object.assign(ASK, {
    fk_river() { // rates, distance and time on the rivers, with decimals
      const kind = rand(3);
      if (kind === 0) { const v = pick([3.5, 4.5, 5.5, 6.5]), t = pick([2, 3, 4, 5]), d = v * t;
        return { html: "", text: `A canoe on the Red River travels at <b>${v} km/h</b>. How many kilometres does it go in <b>${t} hours</b>?`, choices: textCards(km(d), [km(v + t), km(d + v), km(d - v), km(d + t), km(d * 2)]), why: `Distance = speed × time = ${v} × ${t} = ${km(d)}.` }; }
      if (kind === 1) { const r = pick([1.5, 2.5, 3.5]), t = pick([2, 4, 6]), d = r * t;
        return { html: "", text: `A log drifts north on the Red River at <b>${r} km/h</b>. How many hours does it take to drift <b>${d} km</b>?`, choices: cards(t, [t + 1, t - 1, t * 2, d, d - t]), why: `Time = distance ÷ speed = ${d} ÷ ${r} = ${t} hours.` }; }
      const a = pick([5.5, 6.5, 7.5]), h1 = pick([2, 3, 4]), b = pick([3.5, 4.5]), h2 = pick([2, 4]), d = a * h1 + b * h2;
      return { html: "", text: `A boat goes <b>${h1} hours</b> at <b>${a} km/h</b>, then <b>${h2} hours</b> at <b>${b} km/h</b>. How far does it go in all?`, choices: textCards(km(d), [km(a * h1), km(b * h2), km(d + 1), km(d - 1), km((a + b) * h1)]), why: `${a} × ${h1} = ${km(a * h1)} and ${b} × ${h2} = ${km(b * h2)}. Together that is ${km(d)}.` };
    },
    fk_pelts() { // Made Beaver: totals, change and converting between kinds of pelt
      const kind = rand(3);
      if (kind === 0) { const k = pick([2, 3, 4]), b = pick([5, 6, 7]), n = pick([2, 3, 4]), T = n * k + b;
        return { html: "", text: `A kettle costs <b>${k} Made Beaver</b> and a blanket costs <b>${b}</b>. How many Made Beaver for <b>${n} kettles</b> and <b>1 blanket</b>?`, choices: cards(T, [n + k + b, n * (k + b), n * k, k + b, n * k + b + n]), why: `${n} kettles cost ${n} × ${k} = ${n * k}. Add the blanket: ${n * k} + ${b} = ${T}.` }; }
      if (kind === 1) { const b = pick([4, 5, 6, 7, 8]), m = 2 * b;
        return { html: "", text: `A blanket costs <b>${b} Made Beaver</b>. You only have marten pelts, and <b>2 marten = 1 Made Beaver</b>. How many marten pelts buy the blanket?`, choices: cards(m, [b, b + 2, m + 2, m - 2, b * 3]), why: `Each Made Beaver takes 2 marten. ${b} × 2 = ${m} marten pelts.` }; }
      const g = pick([12, 14]), p = pick([4, 5, 6]), m = pick([4, 6, 8]), need = g - p - m / 2;
      return { html: "", text: `A gun costs <b>${g} Made Beaver</b>. You bring <b>${p} beaver pelts</b> and <b>${m} marten pelts</b> (2 marten = 1). How many more Made Beaver do you need?`, choices: cards(need, [g - p, g - p - m, g - m / 2, need + 2, need + 1]), why: `${m} marten = ${m / 2}. You have ${p} + ${m / 2} = ${p + m / 2}. ${g} − ${p + m / 2} = ${need} more.` };
    },
    fk_puzzle() { // simple algebra with prices
      const kind = rand(3);
      if (kind === 0) { const n = pick([2, 3, 4]), k = pick([2, 3, 4, 5, 6]), e = pick([1, 2, 3, 4]), T = n * k + e;
        return { html: "", text: `${n} kettles and a knife that costs <b>${e}</b> cost <b>${T} Made Beaver</b>. If one kettle costs k, then <b>${n}k + ${e} = ${T}</b>. What is k?`, choices: cards(k, [T - e, k + 1, k - 1, k + e, T - n]), why: `${n}k = ${T} − ${e} = ${T - e}, so k = ${T - e} ÷ ${n} = ${k}.` }; }
      if (kind === 1) { const a = pick([3, 4]), c = pick([2, 4, 6]), k = pick([3, 4, 5, 6]), T = a * k + c;
        return { html: "", text: `A gun costs <b>${a}k + ${c}</b> Made Beaver, where k is the price of a kettle. A kettle costs <b>${k}</b>. What does the gun cost?`, choices: cards(T, [a + k + c, a * (k + c), a * k, T + k, T - c]), why: `Put k = ${k}: ${a} × ${k} + ${c} = ${a * k} + ${c} = ${T}.` }; }
      const r = pick([3, 4, 5]), k = pick([2, 3, 4]), T = (r + 1) * k;
      return { html: "", text: `A gun costs <b>${r} times</b> as much as a kettle. Together they cost <b>${T} Made Beaver</b>. How many Made Beaver does the kettle cost?`, choices: cards(k, [r * k, k + 1, k + 2, T - r, T - k]), why: `Kettle k and gun ${r}k make ${r + 1}k = ${T}, so k = ${T} ÷ ${r + 1} = ${k}.` };
    },
    fk_last(g) { // the price list of the post the child chose (g.choice: 0 = Hudson's Bay Company, 1 = North West Company)
      const way = g && g.choice ? 1 : 0;
      const P = [{ name: "Hudson's Bay post", gun: 20, bl: 8, ke: 4 }, { name: "North West post", gun: 16, bl: 10, ke: 5 }], me = P[way], other = P[1 - way];
      const kind = rand(3);
      if (kind === 0) { const T = me.gun + 2 * me.ke;
        return { html: "", text: `At the ${me.name}, a gun costs <b>${me.gun} Made Beaver</b> and a kettle costs <b>${me.ke}</b>. How many Made Beaver for <b>1 gun</b> and <b>2 kettles</b>?`, choices: cards(T, [me.gun + me.ke, 2 * (me.gun + me.ke), 2 * me.gun + me.ke, T + 2, T - 2]), why: `2 kettles cost 2 × ${me.ke} = ${2 * me.ke}. Add the gun: ${me.gun} + ${2 * me.ke} = ${T}.` }; }
      if (kind === 1) { const [item, key] = pick([["gun", "gun"], ["blanket", "bl"], ["kettle", "ke"]]), X = me[key], Y = other[key], dir = Y > X ? "more" : "less", opp = dir === "more" ? "less" : "more", p = Math.abs(Y - X) * 100 / X, q = p === 20 ? 25 : 20;
        return { html: "", text: `You chose the ${me.name}. A ${item} costs <b>${X} Made Beaver</b> there and <b>${Y}</b> at the other post. The other price is what percent more or less?`, choices: textCards(`${p}% ${dir}`, [`${p}% ${opp}`, `${q}% ${dir}`, `${q}% ${opp}`, `${Math.abs(Y - X)}% ${dir}`, `${p + 5}% ${dir}`]), why: `The difference is ${Math.abs(Y - X)}. ${Math.abs(Y - X)} ÷ ${X} = ${p / 100}, so the other price is ${p}% ${dir}.` }; }
      const cost = 2 * me.bl + me.ke, P0 = pick([30, 35, 40]), left = P0 - cost;
      return { html: "", text: `At the ${me.name}, a blanket costs <b>${me.bl} Made Beaver</b> and a kettle <b>${me.ke}</b>. You have <b>${P0}</b>. How many are left after buying 2 blankets and 1 kettle?`, choices: cards(left, [cost, P0 + cost, P0 - 2 * me.bl, P0 - me.bl - me.ke, left + 5]), why: `2 blankets and 1 kettle cost ${2 * me.bl} + ${me.ke} = ${cost}. ${P0} − ${cost} = ${left} left.` };
    }
  });

  // FACT CHECK: The Forks, where the Assiniboine River meets the Red River in downtown Winnipeg, has been a meeting place for about 6,000 years (archaeologists have found campfire sites, tools and fish bones there)
  // FACT CHECK: First Nations who met, traded and fished at The Forks include the ancestors of the Cree, Anishinaabe (Ojibwe), Nakoda (Assiniboine) and Dakota peoples
  // FACT CHECK: the Red River flows north into Lake Winnipeg, and Lake Winnipeg drains north by the Nelson River into Hudson Bay
  // FACT CHECK: the Assiniboine joins the Red from the west, and the Red continues north as one river
  // FACT CHECK: The Forks today has a market (The Forks Market, with a tower), a river walk, a modern footbridge (the Esplanade Riel is nearby) and a skating trail on the frozen rivers in winter
  // FACT CHECK: the Hudson's Bay Company priced goods in "Made Beaver" (MB): one prime beaver pelt was worth 1 MB, and other pelts and goods had set values in MB. The prices in this chapter are SIMPLIFIED and made up to suit the maths (real prices changed from post to post and year to year)
  // FACT CHECK: 2 marten pelts = 1 Made Beaver (a marten was worth about half a Made Beaver in the HBC lists)
  // FACT CHECK: about 1810 to 1820 the Hudson's Bay Company and the North West Company (based in Montreal) were rival fur traders with posts close together at The Forks (Fort Douglas for the HBC and Fort Gibraltar for the NWC); the two companies joined together in 1821
  // FACT CHECK: kettles, blankets and guns were goods traded to First Nations trappers, and these goods came to the prairies by ship across the Atlantic and then by canoe and boat inland
  // FACT CHECK: Cree and other First Nations hunters and trappers chose which post to trade at, and over-trapping did make beaver scarcer in many parts of the west in the early 1800s
  // FACT CHECK: the Métis are a distinct Indigenous people whose nation grew out of fur trade families (often a First Nations mother and a European father) and whose homeland centres on the Red River; there are many Métis families in Winnipeg today
  // FACT CHECK: French words: la fourche (the fork), la rivière (the river), la fourrure (the fur), le castor (the beaver), échanger (to trade), le marché (the market)
  CHAPTERS[1] = { title: "The Forks", where: "Winnipeg", beats: [
    { art: "fk_arrive", word: ["le marché", "the market"], say: ["Goodbye, Zoe, and goodbye, voyageurs! My clock balloon has floated far west from Lake Superior, over forest, rock and lakes, and now the land has gone flat and the sky is enormous.",
      "Look down! Two rivers are running together like the letter Y. This is the middle of <em>Winnipeg</em>, in Manitoba, at a place called The Forks.",
      "The river from the left is the Assiniboine. The river from below is the Red. They meet right here and flow on as one. That building with the tower is <em>le marché</em>, the market. I smell snacks."] },
    { art: "fk_kai", word: ["la fourche", "the fork"], say: ["This is Kai. He lives in Winnipeg, and he comes to The Forks almost every week to eat at the market, walk along the river and watch the boats go by.",
      "A fork in a river is <em>la fourche</em> in French. In winter the rivers freeze solid, and Kai skates on a trail that runs along the ice, right through the middle of the city!",
      "Kai says people have been meeting at this very spot for thousands of years. That is a long time to wait for a snack. Clock, show us!"] },
    { art: "fk_window1", who: "The clock", say: ["Tick, tock. Time to look back. My window is open."] },
    { art: "fk_window1", say: ["The window into the past! We are looking back about <em>6,000 years</em>, long before any fort or any city. No market, no bridge. Just grass, trees and two rivers.",
      "Archaeologists, who dig up the past very carefully, have found old campfires, tools and fish bones right here. People camped here, fished here and came back year after year.",
      "First Nations peoples met here to trade, fish and make agreements, among them the ancestors of the Cree, the Anishinaabe, the Nakoda and the Dakota. Goods travelled huge distances on the rivers."] },
    { ask: "fk_river", intro: "Rivers were the highways. Three right answers and we look at the rivers today." },
    { art: "fk_today", word: ["la rivière", "the river"], say: ["Back to today! The arrows show which way the water goes. The Red River flows <em>north</em>, away from the United States, toward Lake Winnipeg. A river is <em>la rivière</em>.",
      "From Lake Winnipeg the water keeps going north through more rivers, all the way to Hudson Bay. That is why trading companies wanted this spot. Boats could reach the bay from here.",
      "The traders also needed one price list for all those furs. They priced everything in <em>Made Beaver</em>: one good beaver pelt was 1 Made Beaver. You earn them too, for right answers!"] },
    { ask: "fk_pelts", intro: "Learn the fur trade money. Three right answers and the window opens on a trading post, about the year 1815, where two people will tell us what they see." },
    { who: "The trader", art: "fk_trader", word: ["la fourrure", "the fur"], say: ["I keep the books at this post for the Hudson's Bay Company. Here we price everything in <em>Made Beaver</em>. One prime beaver pelt is 1 Made Beaver, and a gun, a kettle or a blanket each costs a set number of pelts.",
      "Every kettle and every blanket on these shelves crossed the ocean by ship, then went inland by canoe and boat for weeks. That costs a great deal, so I think my prices are fair. I grade each pelt honestly.",
      "The list is the same for every hunter who walks in. Both sides want the same thing, which is good goods in return for good fur."] },
    { who: "The hunter", art: "fk_hunter", say: ["I am a Cree hunter and trader. Each bundle of furs is a whole winter of skilled work. I trap in deep snow, I skin and stretch every pelt, and then I carry them many days to reach the post.",
      "Nobody forces me to trade at one post. Two companies want my furs, so I can choose the one with the better deal. The kettles and blankets really are useful, and a good kettle saves my family hours of work.",
      "But I worry. The beaver are fewer every year. When too many are trapped, the lodges go quiet. What will the trade be when the beaver are gone?"] },
    { ask: "fk_puzzle", intro: "Both of them have a point. Now for some price puzzles. Three right answers and you pick the post where we trade." },
    { art: "fk_choice", pick: "The window shows two trading posts, a short walk apart along the river. They are rivals, and each has its own price list. Where shall we trade?", options: [
      { label: "The Hudson's Bay Company post", art: "fk_hbc", word: ["échanger", "to trade"], say: ["We step into the Hudson's Bay Company post. Wool blankets are stacked on the shelves and a clerk shows us the price list in Made Beaver. A gun is 20, a blanket is 8 and a kettle is 4.",
        "To trade is <em>échanger</em> in French. I tried to trade a feather for a kettle. The clerk said it was a very nice feather, but no."] },
      { label: "The North West Company post", art: "fk_nwc", word: ["le castor", "the beaver"], say: ["We walk along to the North West Company post, whose traders came from Montreal. The price list in Made Beaver says a gun is 16, a blanket is 10 and a kettle is 5.",
        "Everyone here talks about <em>le castor</em>, the beaver, because beaver fur is what everyone wants. The beaver would much rather keep its coat."] }] },
    { ask: "fk_last", intro: "Time to pay at the post you chose. Three right answers finishes our visit to The Forks." },
    { art: "fk_goodbye", say: ["Back in today! Kai walks us to the footbridge. The sun is going down, and the two rivers shine like copper kettles.",
      "Kai says the story of the fur trade did not end at the trading posts. Around these rivers a new people grew up, often with a First Nations mother and a European father. They are the <em>Métis</em>.",
      "The Métis are still here, with their own language, music and flag, and many Métis families live in Winnipeg today. Kai says their story starts on the Red River.",
      "Thank you, Kai! Next we follow the river to meet them, in The People of the Red River. Tick tock!"] }
  ] };
}
