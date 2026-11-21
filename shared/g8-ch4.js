"use strict";
// Grade 8, Chapter 4: Every Child Matters. A quiet chapter about residential schools, told in the interior of British Columbia. Dr. Somebody listens to Hannah, a Secwépemc girl of today, and her grandmother. Seven scenes: no questions, no money, no jokes.
{
  const GUIDE = WHO.hannah;                            // Hannah: long hair and an orange hoodie
  const hannah = (x, y, s) => kidAt(x, y, s, GUIDE);
  const ORANGE = "#f28c28";
  // Hannah's grandmother: the same drawing as the children, a little bigger, in an orange top, with grey hair drawn over the dark hair
  const grandma = (x, y, s) => `${kidAt(x, y, s, { hood: "#e8742c" })}<g transform="translate(${x} ${y}) scale(${s})"><path d="M-15 4 Q-20 20 -14 30 M15 4 Q20 20 14 30" fill="none" stroke="#d4d4d4" stroke-width="3" stroke-linecap="round"/><path d="M-15 4 Q-14 -12 0 -12 Q14 -12 15 4 Q8 -4 0 -4 Q-8 -4 -15 4 Z" fill="#d4d4d4" stroke="#2b1a10" stroke-width="2.4" stroke-linejoin="round"/></g>`;
  // dry rolling hills of the interior: two layers (the far one sits near y 140, the near one near y 180)
  const dryHills = (c1, c2) => `<g ${INKED}><path d="M-10 150 Q90 116 200 144 T410 130 V250 H-10 Z" fill="${c1}"/><path d="M-10 186 Q130 160 250 184 T410 176 V250 H-10 Z" fill="${c2}"/></g>`;
  const dryTufts = pts => pts.map(([x, y, s]) => `<g transform="translate(${x} ${y}) scale(${s || 1})" fill="none" stroke="#8a7a3a" stroke-width="2.2" stroke-linecap="round"><path d="M0 0 q-3 -10 -8 -14 M0 0 q0 -12 1 -18 M0 0 q3 -10 9 -13"/></g>`).join("");
  const river = `<g ${INKED}><path d="M-10 200 Q110 186 230 202 T410 196 V216 Q290 226 220 220 T-10 222 Z" fill="#6cc0ea"/></g>`;
  // a plain field of grass
  const field = (y, c1, c2) => `<g ${INKED}><path d="M-10 ${y} Q120 ${y - 10} 230 ${y - 2} T410 ${y - 6} V250 H-10 Z" fill="${c1}"/><path d="M-10 ${y + 34} Q140 ${y + 22} 270 ${y + 32} T410 ${y + 28} V250 H-10 Z" fill="${c2}"/></g>`;
  // a big plain brick school on a hill, seen from the front (x is the middle, y the ground), with rows of small windows
  const school = (x, y, s) => `<g transform="translate(${x} ${y}) scale(${s})"><g ${INKED}><rect x="-54" y="-58" width="108" height="58" fill="#a8553f"/><path d="M-60 -58 L0 -82 L60 -58 Z" fill="#6a4a3a"/></g>
    <g ${THIN}>${[0, 1, 2, 3, 4, 5].map(i => `<rect x="${-44 + i * 16}" y="-48" width="9" height="11" fill="#f1e3c0"/>`).join("")}${[0, 1, 4, 5].map(i => `<rect x="${-44 + i * 16}" y="-26" width="9" height="11" fill="#f1e3c0"/>`).join("")}<rect x="-10" y="-22" width="20" height="22" rx="2" fill="#5a3a2a"/></g></g>`;
  // a small plain figure of a child (no face), in a plain top
  const little = (x, y, s, top) => person(x, y, s, top || "#7a8a9a");
  // a small child of today in an orange shirt (skin and hair colours vary)
  const orangeKid = (x, y, s, skin, hair) => `<g transform="translate(${x} ${y}) scale(${s})" ${THIN}><rect x="-6" y="26" width="5" height="20" rx="2" fill="#3b5b8c"/><rect x="2" y="26" width="5" height="20" rx="2" fill="#3b5b8c"/><path d="M-9 28 Q-10 4 0 0 Q10 4 9 28 Z" fill="${ORANGE}"/><circle cx="0" cy="-8" r="8" fill="${skin}"/><path d="M-8 -9 Q-8 -18 0 -18 Q8 -18 8 -9 Q3 -14 0 -14 Q-4 -14 -8 -9 Z" fill="${hair}"/></g>`;
  const SKINS = ["#b9794a", "#e0b48a", "#8a5a3a", "#f1cfa8", "#6b4430"], HAIRS = ["#2b1a10", "#5a3a1c", "#2b1a10", "#c98f3a", "#1a1008"];
  const orangeKids = (xs, y, s) => xs.map((x, i) => orangeKid(x, y + (i % 2) * 3, s, SKINS[i % 5], HAIRS[(i * 2 + 1) % 5])).join("");
  // an orange shirt, flat, with short sleeves (x, y is the middle of the chest)
  const shirt = (x, y, s) => `<g transform="translate(${x} ${y}) scale(${s})" ${INKED}><path d="M-18 -30 L-34 -16 L-26 -4 L-16 -12 V30 H16 V-12 L26 -4 L34 -16 L18 -30 Q0 -20 -18 -30 Z" fill="${ORANGE}"/></g>`;
  // a small orange flag on a stick
  const flag = (x, y, s) => `<g transform="translate(${x} ${y}) scale(${s})"><path d="M0 0 V-22" fill="none" stroke="#7a5326" stroke-width="2.4" stroke-linecap="round"/><path d="M0 -22 L12 -17 L0 -12 Z" fill="${ORANGE}" stroke="#2b1a10" stroke-width="1.4" stroke-linejoin="round"/></g>`;
  const flagRows = (rows) => rows.map(([y, s, x0, n]) => Array.from({ length: n }, (_, i) => flag(x0 + i * 26 * s, y, s)).join("")).join("");

  // the window into the past, look 1: a large plain brick building on a hill, and a few small plain figures in a line outside
  const ecWin1 = `<rect width="400" height="240" fill="#f4e6c4"/>${cloud(250, 62, .6)}<g ${INKED}><path d="M130 136 Q236 108 342 134 V250 H130 Z" fill="#c9b27a"/></g>${school(236, 146, 1)}
    <g ${INKED}><path d="M130 150 Q236 142 342 152 V250 H130 Z" fill="#b8a468"/></g>${[0, 1, 2, 3, 4, 5].map(i => little(194 + i * 17, 158, .34, i % 2 ? "#8a7a6a" : "#7a8a9a")).join("")}`;
  // the window, look 2: a long road leading away to a small school far off, with a few small figures on it
  const ecWin2 = `<rect width="400" height="240" fill="#f1e6c8"/>${cloud(190, 52, .5)}<g ${INKED}><path d="M130 120 Q236 96 342 118 V250 H130 Z" fill="#c9b27a"/></g>${school(236, 106, .4)}
    <g ${INKED}><path d="M130 160 Q236 148 342 162 V250 H130 Z" fill="#b8a468"/></g>
    <path d="M190 205 Q300 175 230 150 Q170 128 236 108" fill="none" stroke="#2b1a10" stroke-width="14" stroke-linecap="round"/><path d="M190 205 Q300 175 230 150 Q170 128 236 108" fill="none" stroke="#e8d9a8" stroke-width="10" stroke-linecap="round"/>
    ${little(227, 182, .25)}${little(255, 164, .25, "#8a7a6a")}${little(251, 149, .22)}`;

  Object.assign(ART, {
    ec_arrive: () => frame(`${sky("#9fd0ea", "#f4e8c8", null, [[70, 44, .8], [310, 36, .6]])}${dryHills("#c9b27a", "#b59d62")}${river}${pine(46, 176, 1.1)}${pine(76, 182, .8, "#3f9a58")}${pine(340, 172, 1.2)}${pine(372, 180, .9, "#3f9a58")}${dryTufts([[130, 212, 1.2], [300, 226, 1.3]])}${riding(120, 0, 120)}`),
    ec_meet: () => frame(`${sky("#9fd0ea", "#f4e8c8", null, [[80, 44, .8], [320, 36, .6]])}${dryHills("#c9b27a", "#b59d62")}${pine(44, 170, 1.2)}${pine(372, 166, 1.3)}${dryTufts([[110, 216, 1.2], [20, 226, 1.3]])}
      <g ${INKED}><rect x="160" y="222" width="220" height="10" fill="#a9703a"/></g>${owlAt(40, 122, 108)}${hannah(212, 144, 1)}${grandma(290, 134, 1.15)}`),
    ec_window1: () => frame(`${sky("#cdd9df", "#efe6c8", null, [[60, 40, .7]])}${dryHills("#c9b27a", "#b59d62")}${windowAt(236, 112, 92, ecWin1)}${owlAt(18, 118, 108)}${hannah(118, 150, .95)}`),
    ec_telling: () => frame(`${sky("#cdd9df", "#efe6c8", null, [[60, 40, .7]])}${dryHills("#c9b27a", "#b59d62")}${windowAt(236, 112, 92, ecWin2)}${owlAt(18, 118, 108)}${grandma(118, 136, 1)}`),
    ec_shirt: () => frame(`${sky("#cdd9df", "#f4f1d8", null, [[80, 44, .7], [320, 50, .6]])}${field(170, "#b8c38a", "#a9b67a")}
      <g ${INKED}><rect x="86" y="46" width="8" height="150" rx="3" fill="#8a5a2b"/><rect x="306" y="46" width="8" height="150" rx="3" fill="#8a5a2b"/></g><path d="M94 52 Q200 62 306 52" fill="none" stroke="#2b1a10" stroke-width="2.4" stroke-linecap="round"/>
      <g ${THIN}><rect x="136" y="48" width="8" height="14" rx="2" fill="#e8d9a8"/><rect x="256" y="48" width="8" height="14" rx="2" fill="#e8d9a8"/></g>${shirt(200, 112, 1.6)}${owlAt(10, 124, 104)}`),
    ec_truth: () => frame(`${sky("#cdd9df", "#f4f1d8", null, [[70, 40, .7], [330, 46, .6]])}${dryHills("#c9b27a", "#b8c38a")}${pine(300, 142, .7)}${pine(330, 146, .55, "#3f9a58")}${pine(362, 144, .7)}
      ${flagRows([[168, .7, 196, 6], [186, .85, 188, 7], [206, 1, 178, 7], [226, 1.15, 170, 7]])}${owlAt(10, 118, 104)}${hannah(104, 140, .95)}${grandma(152, 128, 1.05)}`),
    ec_today: () => frame(`${sky("#ffd9a0", "#fdebd0", [190, 92, 22], [[70, 40, .8], [330, 56, .6]])}${field(150, "#d6b85a", "#c4a64c")}${dryTufts([[26, 226, 1.3], [200, 228, 1.2], [380, 226, 1.4]])}
      ${orangeKids([180, 204, 228, 252, 276, 300, 324, 348, 372], 168, .4)}${orangeKids([192, 218, 244, 270, 296, 322, 348], 192, .4)}
      ${riding(262, 6, 104)}${hannah(52, 140, 1)}${grandma(104, 130, 1.15)}`)
  });

  // READERS: residential school survivors or their families, and Secwépemc readers; the Orange Shirt Society (guidance on telling Phyllis Webstad's story, which is a real living person's story, told here only in the outline she has made public); the school board's Indigenous education lead.
  // FACT CHECK (this whole chapter should be read by those readers before any child sees it). It has no questions, no jokes and no collected words.
  // FACT CHECK: Added from Shane's review notes (November 2026): the earliest residential schools opened in the 1830s; the Mohawk Institute in Brantford, Ontario, beside Six Nations, took in its first boarding students in 1831; the 1880s is when the government built a national system. The earlier "began in the 1880s" wording was wrong. Pronunciation guides added: Secwépemc = suh-WEP-muhc; Tk'emlúps te Secwépemc = tuh-kem-LOOPS tuh suh-WEP-muhc.
  // FACT CHECK: Dates: the schools ran as a national system from the 1880s until the last one closed in 1996. "More than a hundred years" is used in the story.
  // FACT CHECK: The government of Canada paid for the schools and churches ran them. The story says exactly this.
  // FACT CHECK: More than 150,000 First Nations, Inuit and Métis children were sent to the schools.
  // FACT CHECK: For much of that time the law said parents had to send their children. Many children were taken from their families.
  // FACT CHECK: The purpose given in the story: to make the children give up their own languages and ways and become like the settlers.
  // FACT CHECK: What the schools were like (far from home, hair cut, clothes taken, punished for speaking their own languages, hungry, hurt by adults, sick) is told in general words only, from the findings of the Truth and Reconciliation Commission. "Thousands of children died at the schools and never came home. Some families were never told" is the careful general wording, with no single number given.
  // FACT CHECK: Phyllis Webstad: in 1973, aged six, sent to St. Joseph's Mission residential school near Williams Lake. Her grandmother had bought her a new orange shirt for her first day, and it was taken from her. She has said it made her feel she did not matter. The story keeps to this outline and does not name the school (St. Joseph's Mission) or quote her; the Orange Shirt Society should confirm the wording.
  // FACT CHECK: Orange Shirt Day began in 2013 and is held every year on September 30. Since 2021 September 30 has also been the National Day for Truth and Reconciliation in Canada. The words on the shirts are "Every Child Matters".
  // FACT CHECK: The government of Canada apologized in Parliament in 2008.
  // FACT CHECK: The Truth and Reconciliation Commission worked from 2008 to 2015, heard from more than 6,000 witnesses (most of them survivors) and made 94 Calls to Action. "Many are still not done" is a general statement (the commission's own progress reports and later reviews show many unfinished).
  // FACT CHECK: In 2021 the Tk'emlúps te Secwépemc Nation announced that a search of the grounds of the former Kamloops Indian Residential School had found signs of about 200 possible unmarked graves (described as possible, found by ground-penetrating radar). Other nations have since searched the grounds of other schools.
  // FACT CHECK: Spellings: Secwépemc (the people), Secwepemctsín (their language), Tk'emlúps te Secwépemc (the Nation at Kamloops). Pronunciation guides for Secwépemc and Tk'emlúps te Secwépemc were added in November 2026 (see above), and no Secwepemctsín word is collected (kyé7e, "grandmother", was left out because the spelling could not be confirmed).
  // FACT CHECK: The balloon turns north to the Klondike (Chapter 5, The Golden Stairs). Chapter 3 was Vancouver with Simran, the Komagata Maru and the Coast Salish nations.
  // This chapter has its own reader. Dr. Somebody (an older British voice) says only his own arrival and goodbye; a plain Canadian voice reads what Hannah and her grandmother tell him,
  // because a British voice passing on a survivor's story can sound like the voice of the people who ran the schools. Recordings: audio/g8/ch4/. Readers have not yet heard this choice.
  CHAPTERS[3] = { title: "Every Child Matters", where: "The interior of British Columbia", quiet: true, voice: "audio/g8/ch4/", beats: [
    { art: "ec_arrive", say: ["We have left Simran and Vancouver behind. The balloon drifts inland, over the mountains, until the land turns dry and golden. There are tan hills, tall pines and a slow river.",
      "This is the interior of British Columbia, near the city of <em>Kamloops</em>. Before we land, I need to tell you that this chapter is different.",
      "There are no puzzles today and no prizes. There is only a story that every child in Canada should hear. I am going to listen more than I talk.",
      "So a friend will read the rest of this chapter for me. I am listening."] },
    { art: "ec_meet", say: ["A girl is waiting on a porch with her grandmother. This is Hannah. She is <em>Secwépemc</em>, and her people have lived in these hills and valleys for thousands of years.",
      "You say it suh-WEP-muhc.",
      "Hannah is wearing an orange shirt, and so is her grandmother. Hannah tells me the shirts are for remembering.",
      "She says her grandmother will tell us why. I sit down beside them, and I listen."] },
    { art: "ec_window1", say: ["Hannah's grandmother asks me to open the window into the past. We see a large brick building on a hill, with rows of small windows. It is a <em>residential school</em>.",
      "For more than a hundred years, until the last one closed in 1996, the government of Canada paid for these boarding schools for First Nations, Inuit and Métis children, and churches ran them.",
      "More than 150,000 children were sent to them. Many were taken from their families, and for much of that time the law said parents had to send them.",
      "The purpose was to make the children give up their own languages and ways and become like the settlers."] },
    { art: "ec_window1", say: ["The earliest of these schools opened in the 1830s. One of the very first was the Mohawk Institute in Brantford, beside Six Nations, where Lily lives. Lily was our first guide.",
      "In the 1880s the government of Canada built a system of these schools across the whole country."] },
    { art: "ec_telling", say: ["Now Hannah's grandmother tells me what it was like. I do not say anything. I only listen, and I will tell you what she said.",
      "Children were often sent far from home, and did not see their parents for months or years. Their hair was cut and their own clothes were taken away. They were punished for speaking their own languages.",
      "Many children were hungry. Many were hurt by the adults who were supposed to care for them, and many became sick.",
      "Thousands of children died at the schools and never came home. Some families were never told what happened to their child."] },
    { art: "ec_shirt", say: ["Hannah's grandmother says the orange shirt has a story. The words on the shirts are <em>Every Child Matters</em>, and this is where they come from.",
      "In 1973 a six-year-old Secwépemc girl named <em>Phyllis Webstad</em> was sent to a residential school near Williams Lake. Her grandmother had bought her a brand new orange shirt for her first day.",
      "When she arrived, the shirt was taken from her and she never got it back. She has said it made her feel that she did not matter.",
      "Years later she told that story, and in 2013 <em>Orange Shirt Day</em> began. It is held every year on September 30, and since 2021 it is also the National Day for Truth and Reconciliation."] },
    { art: "ec_truth", say: ["In 2008 the government of Canada apologized in Parliament. From 2008 to 2015 the <em>Truth and Reconciliation Commission</em> listened to more than 6,000 people, most of them <em>survivors</em>.",
      "Survivors are people who went to the schools and lived. The commission wrote down what happened so that it can never be denied or forgotten. It made 94 Calls to Action, things Canada must do to begin to put things right."] },
    { art: "ec_truth", say: [
      "Many of the Calls to Action are still not done. In 2021 the Tk'emlúps te Secwépemc Nation announced that a search of the grounds of the former Kamloops school had found signs of about 200 possible unmarked graves.",
      "You say the Nation's name tuh-kem-LOOPS tuh suh-WEP-muhc.",
      "Other nations have searched the grounds of other schools since. Hannah's grandmother says the survivors always knew."] },
    { art: "ec_today", say: ["Hannah's grandmother says the languages the schools tried to end are being spoken and taught again. Hannah is learning <em>Secwepemctsín</em> from her grandmother.",
      "Survivors, their children and their grandchildren are still here. Hannah's grandmother says the first step is simple, and anyone can take it. Learn what happened, and tell the truth about it.",
      "I thank them both, quietly. I will carry this story with me.",
      "Now the balloon turns north, to the Klondike and <em>The Golden Stairs</em>."] }
  ] };
}
