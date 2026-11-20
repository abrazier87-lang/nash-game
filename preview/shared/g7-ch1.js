"use strict";
// Grade 7, Chapter 1: Where the Canoes Met. Fort William at Thunder Bay, the Rendezvous of the Montreal canoes and the north canoes, and the people whose work made the trade go.
{
  const GUIDE = { hood: "#f2a73b" }; // Zoe: long dark hair and a mustard-yellow hoodie
  const f = n => n.toLocaleString("en-CA");

  // ---------- my own drawing pieces ----------
  // the Sleeping Giant: a long, flat-topped headland out on the lake (x, y is the middle of the base)
  const giant = (x, y, s) => `<g transform="translate(${x} ${y}) scale(${s})" ${INKED}><path d="M-92 0 L-82 -18 L-62 -22 L-52 -32 L-30 -32 L-20 -26 L8 -26 L22 -38 L40 -38 L52 -24 L90 -16 L108 0 Z" fill="#7a9bb5"/></g>
    <path d="M${x - 50 * s} ${y - 20 * s} L${x - 30 * s} ${y - 20 * s} M${x + 24 * s} ${y - 28 * s} L${x + 38 * s} ${y - 28 * s}" fill="none" stroke="#fff" stroke-width="${2.2 * s}" stroke-linecap="round" opacity=".5"/>`;
  // a pièce: a bundle of trade goods about 90 pounds, tied with rope (x, y is the middle of the bottom edge)
  const piece = (x, y, s, c) => `<g transform="translate(${x} ${y}) scale(${s})" ${THIN}><rect x="-11" y="-16" width="22" height="16" rx="4" fill="${c || "#8a6238"}"/><path d="M-11 -8 H11 M0 -16 V0" fill="none" stroke="#e8c58a" stroke-width="2"/></g>`;
  // a wooden fort: a palisade of pointed posts, a gate, two roofs behind and a flag (x, y is the middle of the ground line)
  const fort = (x, y, s) => `<g transform="translate(${x} ${y}) scale(${s})" ${INKED}>
    <rect x="-46" y="-52" width="32" height="24" fill="#d6b98a"/><polygon points="-50,-52 -30,-70 -10,-52" fill="#8f2d24"/><rect x="12" y="-56" width="34" height="28" fill="#d6b98a"/><polygon points="8,-56 29,-76 50,-56" fill="#6a4a2a"/>
    <path d="M40 -58 V-100" fill="none" stroke-width="3"/><path d="M42 -98 H64 L58 -90 L64 -82 H42 Z" fill="#e63946" stroke-width="1.8"/>
    ${Array.from({ length: 15 }, (_, i) => `<path d="M${-60 + i * 8} 0 V-30 L${-56 + i * 8} -38 L${-52 + i * 8} -30 V0 Z" fill="${i % 2 ? "#a8764a" : "#b98655"}" stroke-width="1.8"/>`).join("")}
    <path d="M-11 0 V-16 Q0 -30 11 -16 V0 Z" fill="#4a3518"/><path d="M0 -26 V0" fill="none" stroke-width="1.6"/></g>`;
  // a long canoe from the side with n paddlers. o.len: half length (80 is a big Montreal canoe, 62 a north canoe), o.packs: bundles aboard
  const longCanoe = (x, y, s, n, o) => { o = o || {}; const L = o.len || 80, span = L - 26, gap = n > 1 ? 2 * span / (n - 1) : 20,
      seats = Array.from({ length: n }, (_, i) => n === 1 ? 0 : -span + i * gap), k = Math.min(o.packs || 0, Math.max(n - 1, 1));
    return `<g transform="translate(${x} ${y}) scale(${s})">${Array.from({ length: k }, (_, i) => piece(-span + gap / 2 + i * gap, -1, .8, i % 2 ? "#b03a2e" : "#8a6238")).join("")}${seats.map(sx => paddler(sx, -1, 1, {})).join("")}
    <g ${INKED}><path d="M${-L} -4 Q${-L - 8} -20 ${-L + 2} -22 Q${-L + 10} -6 0 -4 Q${L - 10} -6 ${L - 2} -22 Q${L + 8} -20 ${L} -4 Q${L - 18} 14 0 14 Q${-L + 18} 14 ${-L} -4 Z" fill="#ecd3a3"/><path d="M${-L + 2} -4 Q0 2 ${L - 2} -4" fill="none" stroke-width="3" stroke="#8a5a2b"/></g>
    <g stroke="#8a5a2b" stroke-width="1.2" stroke-linecap="round">${Array.from({ length: 9 }, (_, i) => `<path d="M${-L + 22 + i * (2 * L - 44) / 8} 1 l2 6"/>`).join("")}</g></g>`; };
  // a voyageur: red toque, blue sash, two pièces carried on his back (x is the middle, y the top of the body, like person)
  const voyageur = (x, y, s) => `<g transform="translate(${x} ${y}) scale(${s})">${piece(-17, 14, 1)}${piece(-17, -2, 1, "#b03a2e")}<path d="M-8 -10 Q-12 -14 -14 -16" fill="none" stroke="#2b1a10" stroke-width="2" stroke-linecap="round"/></g>${person(x, y, s, "#d9c7a0")}
    <g transform="translate(${x} ${y}) scale(${s})" ${THIN}><path d="M-8.5 -10 Q-9 -25 0 -25 Q9 -25 8.5 -10 Q0 -13 -8.5 -10 Z" fill="#d62839"/><circle cx="0" cy="-26" r="2.6" fill="#d62839"/><path d="M-9 17 H9 V22 H-9 Z" fill="#2e6bd0"/><path d="M6 22 L10 32 M9 22 L13 31" fill="none" stroke="#d62839" stroke-width="2"/></g>`;
  const land = (y, c) => `<g ${INKED}><path d="M-10 ${y} Q100 ${y - 14} 210 ${y + 2} T410 ${y - 4} V250 H-10 Z" fill="${c}"/></g>`;
  // planks of a wharf
  const wharf = (x0, y0, x1, y1) => `<g ${INKED}><path d="M${x0} ${y0} H${x1} L${x1 + 8} ${y1} H${x0 - 8} Z" fill="#a8764a"/></g><g stroke="#6a4a2a" stroke-width="1.6" stroke-linecap="round">${Array.from({ length: 6 }, (_, i) => `<path d="M${x0 + (i + 1) * (x1 - x0) / 7} ${y0} L${x0 + (i + 1) * (x1 - x0) / 7 + (i - 2.5) * 1.4} ${y1}"/>`).join("")}</g>`;
  const sack = (x, y) => `<rect x="${x}" y="${y}" width="17" height="15" rx="6" fill="#e8d9b0" ${THIN}/>`;

  // ---------- the windows into the past ----------
  // about 1815: Fort William on the river, a big Montreal canoe and a north canoe in the water
  const longAgo1 = `<rect width="400" height="240" fill="#f6e3b4"/>${giant(292, 114, .4)}<g ${INKED}><path d="M130 114 Q236 100 342 116 V250 H130 Z" fill="#a9cf86"/></g>${fort(204, 142, .8)}${person(274, 132, .42, "#3b6ea5")}${person(290, 134, .4, "#c1272d")}
    ${water(152, "#6cc0ea")}${longCanoe(232, 170, .5, 6, { packs: 2 })}${longCanoe(266, 190, .42, 4, { len: 62, packs: 1 })}`;
  // about 1815: Anishinaabe families with a birchbark canoe, sacks of wild rice and sugar, and rice stalks
  const longAgo2 = `<rect width="400" height="240" fill="#f6e3b4"/><g ${INKED}><path d="M130 118 Q236 104 342 120 V250 H130 Z" fill="#b9d98f"/></g>${pine(176, 118, .8, "#3f9a58")}${pine(302, 116, .8)}
    ${longCanoe(236, 168, 1.02, 0, { len: 52 })}${person(170, 128, .55, "#c98f58")}${person(304, 130, .55, "#3f7f8a")}${sack(198, 176)}${sack(216, 180)}${sack(250, 178)}${riceStalk(190, 168, .8)}${riceStalk(278, 176, .8)}`;

  // ---------- the pictures ----------
  Object.assign(ART, {
    fw_arrive: () => frame(`${sky("#9fd8f2", "#f4f1d8", [346, 40, 20], [[90, 40, .8], [260, 28, .6]])}${giant(96, 132, .9)}${water(130, "#5db7e6")}${land(198, "#8cc084")}${pine(40, 216, 1.2)}${pine(74, 224, .9, "#3f9a58")}${fort(326, 206, .75)}${riding(176, 8, 112)}`),
    fw_zoe: () => frame(`${sky("#9fd8f2", "#f4f1d8", [346, 40, 20], [[80, 40, .8], [220, 30, .6]])}${water(142, "#5db7e6")}${land(196, "#8cc084")}${fort(334, 200, .72)}${pine(374, 214, .8)}${owlAt(54, 120, 110)}${kidAt(196, 142, 1.05, GUIDE)}`),
    fw_window1: () => frame(`${sky("#9fd8f2", "#f4f1d8", null, [[60, 40, .7]])}${water(176)}${shore}${windowAt(236, 112, 92, longAgo1)}${owlAt(18, 118, 108)}${kidAt(118, 150, .95, GUIDE)}`),
    fw_today: () => frame(`${sky("#9fd8f2", "#f4f1d8", [46, 40, 20], [[200, 36, .7], [330, 44, .6]])}${land(150, "#8cc084")}${fort(318, 150, .7)}${water(206, "#5db7e6")}
      ${wharf(196, 188, 368, 224)}${longCanoe(272, 196, .62, 0)}${piece(344, 196, 1, "#8a6238")}${piece(362, 196, 1, "#b03a2e")}${piece(353, 180, 1, "#8a6238")}${voyageur(376, 140, .8)}${owlAt(16, 120, 104)}${kidAt(142, 142, 1, GUIDE)}`),
    fw_window2: () => frame(`${sky("#9fd8f2", "#f4f1d8", null, [[60, 40, .7]])}${water(176)}${shore}${windowAt(236, 112, 92, longAgo2)}${owlAt(18, 118, 108)}${kidAt(118, 150, .95, GUIDE)}`),
    fw_choice: () => frame(`${sky("#9fd8f2", "#f4f1d8", [60, 40, 20], [[220, 30, .8], [336, 50, .6]])}${giant(310, 120, .55)}${water(120, "#5db7e6")}${land(200, "#8cc084")}${longCanoe(284, 152, .72, 8, { packs: 3 })}${longCanoe(296, 188, .6, 4, { len: 62, packs: 1 })}${owlAt(24, 124, 104)}${kidAt(148, 148, .95, GUIDE)}`),
    fw_big: () => frame(`${sky("#9fd8f2", "#f4f1d8", [346, 40, 20], [[100, 40, .8], [300, 60, .6]])}${giant(280, 116, .8)}${water(112, "#5db7e6")}${longCanoe(200, 190, 1.25, 8, { packs: 4 })}${riding(30, 10, 100)}`),
    fw_north: () => frame(`${sky("#9fd8f2", "#f4f1d8", [346, 40, 20], [[110, 36, .8]])}<g ${INKED}><path d="M-10 100 Q100 82 210 98 T410 90 V250 H-10 Z" fill="#8fc27a"/></g>${pine(34, 122, 1.1, "#2a6e4c")}${pine(70, 130, .9)}${pine(356, 118, 1.1, "#2a6e4c")}${pine(386, 126, .9)}${rock(250, 150, 80, 28)}
      ${water(146, "#5db7e6")}<g fill="none" stroke="#fff" stroke-width="3" stroke-linecap="round" opacity=".9"><path d="M120 176 q10 -8 20 0 t20 0 M150 196 q10 -8 20 0 t20 0"/></g>${longCanoe(250, 214, 1.1, 5, { len: 62, packs: 2 })}${voyageur(80, 150, .9)}${riding(150, 6, 96)}`),
    fw_goodbye: () => frame(`${sky("#ffd9a0", "#fdebd0", [70, 52, 20], [[200, 34, .7], [320, 30, .6]])}${giant(300, 130, .8)}${water(128, "#f2c98a")}${wharf(150, 190, 310, 226)}${fort(352, 200, .55)}${longCanoe(250, 164, .36, 6, { packs: 2 })}${geese(190, 74, .7, 5)}${balloonAt(264, 62, 112)}${owlAt(30, 122, 106)}${kidAt(120, 150, .95, GUIDE)}`)
  });

  // ---------- the questions ----------
  Object.assign(ASK, {
    fw_pace() { // rates and time: km per hour, hours per day, days for a trip
      const kind = rand(3);
      if (kind === 0) { const sp = pick([5, 6, 7, 8]), h = pick([3, 4, 5, 6]), D = sp * h; return { html: "", text: `A brigade paddles <b>${D} km</b> in <b>${h} hours</b> on a calm day. How many kilometres per hour is that?`, choices: cards(sp, [sp + 1, sp - 1, sp + 2, sp * 2, D - h, h]), why: `Speed = distance ÷ time. ${D} ÷ ${h} = ${sp} km per hour.` }; }
      if (kind === 1) { const v = pick([5, 6, 7, 8]), d = pick([2, 3, 4]), A = 14 * v * d; return { html: "", text: `Voyageurs paddled <b>14 hours</b> a day. At <b>${v} km</b> every hour, how far is that in <b>${d} days</b>?`, choices: cards(A, [14 * v, 14 * d, v * d, (14 + v) * d, 14 * v * (d + 1), 14 * v * (d - 1)]), why: `One day: 14 × ${v} = ${14 * v} km. Then ${14 * v} × ${d} = ${A} km.` }; }
      const pd = pick([60, 70, 80, 90, 100]), days = pick([4, 5, 6, 8, 9, 10, 12]), T = pd * days;
      return { html: "", text: `A trip is <b>${f(T)} km</b> long and a brigade covers <b>${pd} km</b> a day. If d is the number of days, then ${pd} × d = ${f(T)}. What is d?`, choices: cards(days, [days + 1, days - 1, days + 2, days * 2, T - pd]), why: `Divide both sides by ${pd}. ${f(T)} ÷ ${pd} = ${days} days.` };
    },
    fw_load() { // fractions and decimals of a load, and sharing it between carriers
      const kind = rand(3);
      if (kind === 0) { const c = pick([3, 4, 5, 6]), t = pick([2, 3, 4, 5]), P = 2 * c * t; return { html: "", text: `A wharf holds <b>${P} pièces</b> to carry over a portage. Each voyageur carries <b>2</b> at a time. How many trips do <b>${c} voyageurs</b> need, if they share the work equally?`, choices: cards(t, [t + 1, t - 1, 2 * t, P / c, P / 2, t + 2]), why: `Each trip moves ${c} × 2 = ${2 * c} pièces. ${P} ÷ ${2 * c} = ${t} trips.` }; }
      if (kind === 1) { const m = pick([2, 3, 4, 5, 6]), N = 12 * m, bl = N / 3, rest = N - bl, ans = rest / 4; return { html: "", text: `A canoe holds <b>${N} pièces</b>. <b>1/3</b> are blankets. Then <b>1/4</b> of the rest are kettles. How many pièces are kettles?`, choices: cards(ans, [bl, N / 4, rest, ans + m, ans - m, N / 12]), why: `1/3 of ${N} = ${bl} blankets. The rest is ${rest}. 1/4 of ${rest} = ${ans} kettles.` }; }
      const n = pick([4, 6, 8, 10, 12]), w = pick([1.5, 2.5, 3.5]), t = n * w;
      return { html: "", text: `Anishinaabe families sold maple sugar. One pack holds <b>${n}</b> birchbark boxes called makaks, of <b>${w} kg</b> each. How many kilograms of sugar is that?`, choices: textCards(`${t} kg`, [t + w, t - w, n + w, t * 10, t + 1].map(k => `${k} kg`)), why: `${n} × ${w} = ${t} kg.` };
    },
    fw_swap() { // proportions and simple algebra with canoes and pièces
      const kind = rand(3);
      if (kind === 0) { const per = pick([20, 25, 30, 40]), c1 = pick([2, 3, 4, 5]), c2 = pick([6, 7, 8, 9, 10]), tot = per * c1, ans = per * c2; return { html: "", text: `<b>${c1} north canoes</b> carry <b>${tot} pièces</b> between them. At the same rate, how many pièces do <b>${c2} canoes</b> carry?`, choices: cards(ans, [tot + c2, per + c2, ans + per, ans - per, tot * 2, c2 * c1]), why: `One canoe carries ${tot} ÷ ${c1} = ${per} pièces. ${c2} × ${per} = ${ans}.` }; }
      if (kind === 1) { const p = pick([20, 25, 30, 40, 60]), n = 3 + rand(7), T = p * n; return { html: "", text: `Each canoe carries <b>${p} pièces</b>. If <b>n</b> canoes carry <b>${T} pièces</b>, then ${p} × n = ${T}. What is n?`, choices: cards(n, [n + 1, n - 1, n + 2, n * 2, T - p]), why: `Divide both sides by ${p}. ${T} ÷ ${p} = ${n} canoes.` }; }
      const p = pick([20, 25, 30, 40, 60]), n = 2 + rand(7), a = pick([10, 15, 20]), T = p * n + a;
      return { html: "", text: `A brigade has <b>n</b> canoes with <b>${p} pièces</b> each, plus <b>${a}</b> more on the wharf, <b>${T}</b> in all. So ${p} × n + ${a} = ${T}. What is n?`, choices: cards(n, [n + 1, n - 1, n + 2, n * 2, T - a]), why: `${T} − ${a} = ${T - a}. Then ${T - a} ÷ ${p} = ${n} canoes.` };
    },
    fw_last(g) { // follows the choice: 0 the big Montreal canoe, 1 the north canoe. Two-step, algebra, and fractions of the cargo
      const way = g && g.choice ? 1 : 0, W = way ? { name: "north canoe", crew: 5, load: 25, fr: [[1, 5], [2, 5], [3, 5], [4, 5]] } : { name: "Montreal canoe", crew: 10, load: 60, fr: [[1, 4], [1, 3], [1, 5], [3, 5], [2, 3]] };
      const kind = rand(3);
      if (kind === 0) { const k = 2 + rand(3), one = W.load * 90, all = k * one; return { html: "", text: `A fleet of <b>${k} ${W.name}s</b> sets out. Each carries <b>${W.load} pièces</b> of <b>90 pounds</b>. How many pounds of cargo is that in all?`, choices: cards(all, [one, k * W.load, k * (W.load + 90), all + one, all - one, all / 10]), why: `One canoe: ${W.load} × 90 = ${f(one)} lb. Then ${f(one)} × ${k} = ${f(all)} lb.` }; }
      if (kind === 1) { const x = W.load / W.crew; return { html: "", text: `Each paddler looks after <b>${x} pièces</b>. A ${W.name} carries <b>${W.load} pièces</b>. If c is the crew, then ${x} × c = ${W.load}. What is c?`, choices: cards(W.crew, [W.crew + 1, W.crew - 1, W.crew + 2, W.load - x, W.crew * 2]), why: `Divide both sides by ${x}. ${W.load} ÷ ${x} = ${W.crew} paddlers.` }; }
      const [a, d] = pick(W.fr), u = W.load * a / d, r = W.load - u;
      return { html: "", text: `At a portage the crew of the ${W.name} carries <b>${a}/${d}</b> of its <b>${W.load} pièces</b> over first. How many pièces are still waiting by the water?`, choices: cards(r, [u, W.load, r + W.crew, r - W.crew, W.load / d]), why: `${a}/${d} of ${W.load} = ${u}. ${W.load} − ${u} = ${r} pièces left.` };
    }
  });

  // FACT CHECK: Fort William (on the Kaministiquia River at the head of Lake Superior, now Thunder Bay) was the inland headquarters of the North West Company, and its yearly summer meeting was called the Rendezvous
  // FACT CHECK: about 1815 is a good year for the fort at its busiest (the North West Company merged with the Hudson's Bay Company in 1821)
  // FACT CHECK: the big Montreal canoes (canots du maître) were about 11 metres (36 feet) long, with a crew of about 8 to 12 and roughly 60 pièces
  // FACT CHECK: the smaller north canoes (canots du nord) were about 7.5 metres (25 feet) long, with a crew of about 5 or 6 and roughly 25 pièces. The scene only says "smaller"
  // FACT CHECK: a pièce (also called a pack) was a bundle of about 90 pounds (about 41 kg), and a voyageur carried two at a time over a portage
  // FACT CHECK: voyageurs paddled 14 or more hours a day, and sang paddling songs to keep the stroke together
  // FACT CHECK: the crews swapped cargo at Fort William and turned back, because the summer was too short for one crew to make the whole trip (Montreal to the northwest and back)
  // FACT CHECK: Anishinaabe (Ojibwe) families built the birchbark canoes, supplied wild rice and maple sugar, guided brigades, and trapped and traded furs. Métis people worked as guides, interpreters and canoe crews
  // FACT CHECK: the Anishinaabe have lived around Lake Superior for a very long time, long before the fort. Fort William First Nation (an Ojibwe community) lies beside the city of Thunder Bay
  // FACT CHECK: Fort William Historical Park is a rebuilt fur trade post near the Kaministiquia River with costumed interpreters, and it builds canoes
  // FACT CHECK: the flat-topped headland on the lake is known as the Sleeping Giant (the Sibley Peninsula), and it can be seen from Thunder Bay
  // FACT CHECK: Lake Superior is the largest of the Great Lakes
  // FACT CHECK: French words: le voyageur (the canoe man), le canot (the canoe), le portage (carrying canoe and cargo over land), la pièce (the bundle), le rendez-vous (the meeting), en avant (forward), canot du maître, canot du nord
  // FACT CHECK: miigwech (Anishinaabemowin, in the double vowel spelling) means thank you. It was also used in the Grade 5 story
  // FACT CHECK: from Fort William the north canoes went on west by rivers and lakes, toward Lake Winnipeg and the Red and Assiniboine rivers, where The Forks lies
  CHAPTERS[0] = { title: "Where the Canoes Met", where: "Fort William, Thunder Bay", beats: [
    { art: "fw_arrive", say: ["The clock on my balloon swung round and pointed west! So off we float, from Newfoundland, back over Quebec and Ontario, past forests and lakes without end. West is a long way.",
      "Ahead is the biggest lake of them all, Lake <em>Superior</em>. At its western end a river called the Kaministiquia runs into it, and the city of <em>Thunder Bay</em> sits beside the water.",
      "See that flat-topped headland out on the lake? People call it the Sleeping Giant. And near the river is a wooden fort with a flag. Down we go!"] },
    { art: "fw_zoe", word: ["le voyageur", "the canoe man of the fur trade"], say: ["This is Zoe, and she lives right here in Thunder Bay. She says the lake is so cold in July that even the fish wear scarves.",
      "Zoe tells me the Anishinaabe, who are also called the Ojibwe, have lived around this lake since long before there was any fort. Fort William First Nation is right beside the city today.",
      "You say Anishinaabe like this: ah-nish-ih-NAH-bay.",
      "That wooden fort is Fort William Historical Park. It was built again, just the way it was. Its canoe crews were called <em>les voyageurs</em>. Clock, show us!"] },
    { art: "fw_window1", word: ["le rendez-vous", "the meeting"], say: ["The window into the past! The year is about <em>1815</em>, and this is Fort William, the great inland headquarters of the North West Company, a fur trade company.",
      "Every summer came the <em>Rendezvous</em>, a huge meeting. Big canoes from Montreal paddled in with trade goods from the east. Smaller canoes came down from the far northwest, full of furs.",
      "The big ones were about 11 metres long. The crews swapped cargo and turned around, because the summer was too short for one crew to make the whole trip. Speaking of trips, how fast did they go?"] },
    { ask: "fw_pace", intro: "Work out the speed of the brigades. Each right answer also earns you a Made Beaver, the fur trade money. Three right answers and we meet the canoe up close." },
    { art: "fw_today", word: ["la pièce", "a 90-pound bundle"], say: ["Back to today, on the wharf at Fort William Historical Park. The people who work here dress like 1815, and one of them is wearing a red toque and a sash and carrying a load. Zoe says that is the full outfit.",
      "Every bundle is a <em>pièce</em>, packed to weigh about 90 pounds, or about 41 kilograms. A voyageur carried two at a time over a portage. I lifted one and turned into a very short owl.",
      "They paddled 14 hours a day or more, and they sang to keep the stroke together. I would sing too, if it meant I did not have to carry anything."] },
    { ask: "fw_load", intro: "Count and share the load. Three right answers and the window opens again." },
    { art: "fw_window2", word: ["le canot", "the canoe"], say: ["The window again. Now let us look at whose trade it really was. It depended on <em>First Nations and Métis people</em>.",
      "You say Métis like this: may-TEE.",
      "Anishinaabe families built the birchbark canoes, a canoe is <em>un canot</em>. They supplied food such as wild rice and maple sugar, and they guided the brigades. They also trapped furs and traded them.",
      "Métis people worked as guides, interpreters and canoe crews too. Without all of them the canoes went nowhere. That is just a plain fact."] },
    { ask: "fw_swap", intro: "Solve the canoe sums. Three right answers and then we pick a canoe to ride in." },
    { art: "fw_choice", pick: "Through the window we can ride with a crew. Which canoe shall we climb into?", options: [
      { label: "The big Montreal canoe", art: "fw_big", word: ["en avant", "forward"], say: ["We climb into a big <em>canot du maître</em>, about 11 metres long, with a crew of about 10 and roughly 60 pièces packed in. It rides low and steady across the open lake.",
        "The steersman calls out <em>en avant</em>, which means forward! The paddles all dip together, and I keep time with my feet. I sing off key, and the crew is very polite about it."] },
      { label: "A north canoe up the river", art: "fw_north", word: ["le portage", "carrying canoe and cargo over land"], say: ["We hop into a smaller <em>canot du nord</em>, with a crew of about 5 and roughly 25 pièces. It slips up the river, until we meet rapids that no one can paddle.",
        "So we do a <em>portage</em>. That means everyone lifts the canoe and the pièces and carries them over land. I carry the map. It weighs nothing, and it is still too heavy."] }] },
    { ask: "fw_last", intro: "Now the sums for our own canoe. Three right answers finishes the chapter." },
    { art: "fw_goodbye", word: ["miigwech", "thank you in Anishinaabemowin (say MEE-gwetch)"], say: ["Back on the wharf, the lake is turning gold. Zoe says <em>miigwech</em>, which is thank you in Anishinaabemowin, the Anishinaabe language. I say it back. Mine comes out like a sneeze.",
      "You say miigwech like this: MEE-gwetch. You say Anishinaabemowin like this: ah-nish-ih-nah-bay-MOH-win.",
      "The north canoes did not stop here. They went on west with the cargo from this wharf, up rivers and over portages, toward a place where two rivers meet.",
      "That place is called <em>The Forks</em>, and it is in Winnipeg. Back into the basket I go. Tick tock!"] }
  ] };
}
