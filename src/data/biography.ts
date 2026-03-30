import { BiographyChapter } from "@/types";

// ui-designer + frontend-design: chapters mapped to the actual photos
// Photo sequence: baby in tiger costume → carnival → portrait → beach baby
// → beach toddler → teen portrait → aviators toddler → sea child
// → beach sunglasses child → home boy → teen b&w → mirror selfie
// → posed teen → school portrait

export const BIOGRAPHY_CHAPTERS: BiographyChapter[] = [
  {
    period: "I primi sorrisi",
    years: "2006 – 2007",
    icon: "🌟",
    text: "Da subito aveva qualcosa di speciale nello sguardo. Occhi grandi, curiosi, capaci di riempire una stanza di luce. Ogni mattina era un'avventura nuova, ogni scoperta uno spettacolo. Chi lo guardava non riusciva a non sorridere.",
    color: "#E8A87C",
    photo: "/photos/01-neonato-tigre.jpg",
  },
  {
    period: "Il carnevale e le feste",
    years: "2008 – 2009",
    icon: "🎭",
    text: "Amava vestirsi, travestirsi, diventare qualcun altro per un giorno. Ma quella sua espressione seria, concentrata, tradiva sempre il bambino vero — quello che osservava il mondo con attenzione, cercando di capirlo tutto.",
    color: "#5B8C8A",
    photo: "/photos/02-carnevale.jpg",
  },
  {
    period: "Gli occhi sul mondo",
    years: "2007 – 2008",
    icon: "👁️",
    text: "Uno sguardo che sembrava contenere tutto. Già da piccolo aveva una presenza silenziosa e forte, come se sapesse cose che gli altri ancora non avevano capito. Quel polo celeste, il rosso della sedia — tutto intorno a lui diventava un quadro.",
    color: "#6B9BC3",
    photo: "/photos/03-ritratto.jpg",
  },

  {
    period: "In piedi sul mondo",
    years: "2008 – 2009",
    icon: "🏖️",
    text: "Quel momento in cui riesci a stare in piedi da solo, aggrappato a qualcosa — e sorridi, perché hai capito di farcela. Era già così: determinato, curioso, con quella risata contagiosa che non abbandonava mai.",
    color: "#D4956A",
    photo: "/photos/05-spiaggia-bambino.jpg",
  },
  {
    period: "Già un grande",
    years: "2023 – 2025",
    icon: "✨",
    text: "Il bambino era diventato un ragazzo, e poi quasi un uomo. Quello sguardo sicuro, il mezzo sorriso, la postura di chi sa dove sta andando. Chi lo conosceva da piccolo non riusciva a credere quanto fosse cresciuto.",
    color: "#3D5A4E",
    photo: "/photos/06-ritratto-teen.jpg",
  },
  {
    period: "Il piccolo pilota",
    years: "2008 – 2009",
    icon: "😎",
    text: "Non aveva neanche due anni ma con quegli occhiali da aviatore sembrava già il padrone del mondo. Seduto nel suo seggiolino rosso, sorrideva a qualcosa che solo lui vedeva — come se avesse già deciso chi avrebbe voluto essere.",
    color: "#8B7355",
    photo: "/photos/07-occhiali-aviator.jpg",
  },
  {
    period: "Il bambino del mare",
    years: "2010 – 2012",
    icon: "💧",
    text: "Urlava di gioia, correva verso le onde, si fermava solo per raccogliere qualcosa di interessante sulla riva. Era così — tutto o niente, mai a metà. L'acqua era il suo elemento e lui lo sapeva già.",
    color: "#2980B9",
    photo: "/photos/08-bambino-mare.jpg",
  },
  {
    period: "L'estate dei 10 anni",
    years: "2016 – 2017",
    icon: "☀️",
    text: "Abbronzato, con quegli occhiali specchiati che riflettevano tutto il blu del mare. Stava diventando grande. Quell'estate era ancora tempo di spensieratezza, di sdraio arancioni e gelati — uno dei capitoli più belli.",
    color: "#E67E22",
    photo: "/photos/09-spiaggia-10anni.jpg",
  },
  {
    period: "Un ragazzo come si deve",
    years: "2018 – 2019",
    icon: "⭐",
    text: "\"Best Team Player\" — non era solo una scritta su una maglietta. Era già quello che aiutava gli altri, che stava sempre dalla parte giusta. A casa, in quell'ambiente familiare, sembrava già pronto per tutto.",
    color: "#6B5B7B",
    photo: "/photos/10-best-team.jpg",
    photoPosition: { x: 5, y: 5 },
  },
  {
    period: "Diventare se stessi",
    years: "2022 – 2023",
    icon: "🖤",
    text: "C'è un momento in cui smetti di essere quello che gli altri si aspettano e cominci a cercare chi sei davvero. Quel momento era arrivato. Intenso, riflessivo, con quello sguardo che sfidava il mondo silenziosamente.",
    color: "#3C3C3C",
    photo: "/photos/11-teen-bw.jpg",
  },
  {
    period: "Il riflesso",
    years: "2023 – 2024",
    icon: "🪞",
    text: "Uno specchio, un telefono, e sullo sfondo le foto di quando era piccolo. Crescere significa portare tutto con sé — le foto, i ricordi, le persone che ami. Lui lo sapeva, anche senza dirlo.",
    color: "#5A6A7A",
    photo: "/photos/12-specchio.jpg",
  },
  {
    period: "La sua presenza",
    years: "2024 – 2025",
    icon: "🌿",
    text: "C'era qualcosa di magnetico nel modo in cui stava — silenzioso ma presente, calmo ma vivo. Ogni foto degli ultimi anni racconta un ragazzo che stava costruendo la sua identità, pezzo dopo pezzo, con pazienza e stile.",
    color: "#4A7A5A",
    photo: "/photos/13-ritratto-finale.jpg",
  },
  {
    period: "Lo sguardo pensieroso",
    years: "2019 – 2020",
    icon: "📸",
    text: "Quella foto scolastica — il mento appoggiato alle mani, gli occhi chiari che guardano qualcosa fuori campo — è rimasta nel cuore di tutti. Sembrava già sapere che la vita chiedeva di essere affrontata con testa e cuore insieme.",
    color: "#7B8C6B",
    photo: "/photos/14-scuola.jpg",
    photoPosition: { x: 0, y: 50 },
  },
];
