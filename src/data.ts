export const AMBER = "#c8922a";
export const AMBER_DIM = "#7a5518";
export const SURFACE = "#1a1814";
export const BORDER = "#2e2a22";
export const MUTED = "#7a7060";
export const FG = "#e8e0d0";
export const FG2 = "#c4b898";

export const ERAS = [
  {
    id: "sangam",
    name: "Sangam",
    tamil: "சங்கம்",
    period: "300 BCE – 300 CE",
    color: "#c8922a",
    description:
      "The earliest and most celebrated period of Tamil literature, produced by assemblies of poets (sangam) under royal patronage. Works explore love (akam) and war (puram) with extraordinary precision of imagery.",
    texts: ["Akananuru", "Purananuru", "Kuruntokai", "Natrinai", "Kalittokai"],
    wordCount: 48200,
    uniqueWords: 12800,
    highlight:
      "யாதும் ஊரே யாவரும் கேளிர் — All towns are my own; all people are my kin.",
    highlightSource: "Purananuru 192 · Kaniyan Pungundranar",
  },
  {
    id: "post-sangam",
    name: "Post-Sangam",
    tamil: "சங்கமருவிய",
    period: "300 – 600 CE",
    color: "#a87422",
    description:
      "A transitional era blending Sangam conventions with emerging ethical and didactic traditions. The twin epics and ethical anthologies bridge the classical and devotional worlds.",
    texts: ["Silappatikaram", "Manimekalai", "Tirukkural", "Naladiyar"],
    wordCount: 39600,
    uniqueWords: 9400,
    highlight:
      "அகர முதல எழுத்தெல்லாம் — As 'A' is the first of all letters, so the Eternal is first in the world.",
    highlightSource: "Tirukkural 1 · Thiruvalluvar",
  },
  {
    id: "bhakti",
    name: "Bhakti",
    tamil: "பக்தி",
    period: "600 – 1200 CE",
    color: "#8a6018",
    description:
      "An explosion of devotional poetry directed at Shiva (Nayanmars) and Vishnu (Alvars). Emotionally intense, musically rich, and theologically daring — these hymns reshaped Tamil culture profoundly.",
    texts: ["Thevaram", "Thiruvasagam", "Divya Prabandham", "Thirumantiram"],
    wordCount: 62100,
    uniqueWords: 14200,
    highlight:
      "நாமார்க்கும் குடியல்லோம் — We are subject to no one; we belong only to Shiva.",
    highlightSource: "Thevaram · Thirugnana Sambandar",
  },
  {
    id: "medieval",
    name: "Medieval",
    tamil: "இடைக்கால",
    period: "1200 – 1800 CE",
    color: "#6a4a12",
    description:
      "A period of grand epics, sophisticated grammars, and court poetry. Kamban's retelling of the Ramayana stands as a monumental literary achievement fusing Sanskrit tradition with Tamil sensibility.",
    texts: ["Kambaramayanam", "Purapporul Venbamalai", "Nannul", "Thamizh vilakkam"],
    wordCount: 71300,
    uniqueWords: 11600,
    highlight:
      "கண்டேன் சீதையை — I have seen Sita! I have seen her!",
    highlightSource: "Kambaramayanam · Kambar",
  },
  {
    id: "modern",
    name: "Modern",
    tamil: "நவீன",
    period: "1800 CE – present",
    color: "#4a3408",
    description:
      "A renaissance driven by print culture, nationalism, and reform movements. Bharathiyar's revolutionary verse and the prose fiction of the 20th century brought Tamil into the contemporary world.",
    texts: ["Bharathiyar's poems", "Ponniyin Selvan", "Thamizhini", "Contemporary verse"],
    wordCount: 88400,
    uniqueWords: 19700,
    highlight:
      "வாழ்க நிரந்தரம் — Long live forever, Tamil language!",
    highlightSource: "Subramania Bharathi",
  },
];

export const FEATURED_WORDS = [
  { word: "அன்பு", romanized: "anbu", meaning: "love, affection", occurrences: 1715 },
  { word: "கடல்", romanized: "kadal", meaning: "sea, ocean", occurrences: 892 },
  { word: "மலை", romanized: "malai", meaning: "mountain", occurrences: 734 },
  { word: "வானம்", romanized: "vanam", meaning: "sky, heaven", occurrences: 618 },
  { word: "நிலா", romanized: "nilā", meaning: "moon, moonlight", occurrences: 541 },
  { word: "தீ", romanized: "tī", meaning: "fire", occurrences: 487 },
  { word: "காதல்", romanized: "kādal", meaning: "romantic love", occurrences: 963 },
  { word: "வீரம்", romanized: "vīram", meaning: "courage, valor", occurrences: 429 },
];

export const WORD_CLUSTERS = [
  {
    cluster: "Nature",
    tamil: "இயற்கை",
    color: "#4a8a4a",
    words: [
      { word: "கடல்", romanized: "kadal", x: 50, y: 30 },
      { word: "மலை", romanized: "malai", x: 75, y: 20 },
      { word: "ஆறு", romanized: "āru", x: 62, y: 45 },
      { word: "காடு", romanized: "kādu", x: 40, y: 50 },
      { word: "வானம்", romanized: "vanam", x: 85, y: 38 },
    ],
  },
  {
    cluster: "Emotion",
    tamil: "உணர்வு",
    color: "#c8922a",
    words: [
      { word: "அன்பு", romanized: "anbu", x: 25, y: 55 },
      { word: "காதல்", romanized: "kādal", x: 15, y: 40 },
      { word: "துயர்", romanized: "tuyar", x: 30, y: 70 },
      { word: "மகிழ்ச்சி", romanized: "makiḻcci", x: 10, y: 60 },
    ],
  },
  {
    cluster: "Valor",
    tamil: "வீரம்",
    color: "#8a3a3a",
    words: [
      { word: "வீரம்", romanized: "vīram", x: 70, y: 70 },
      { word: "போர்", romanized: "pōr", x: 82, y: 60 },
      { word: "வாள்", romanized: "vāḷ", x: 88, y: 75 },
      { word: "தீரன்", romanized: "tīraṉ", x: 65, y: 82 },
    ],
  },
  {
    cluster: "Divine",
    tamil: "தெய்வம்",
    color: "#4a6a8a",
    words: [
      { word: "கடவுள்", romanized: "kadavuḷ", x: 45, y: 18 },
      { word: "அருள்", romanized: "aruḷ", x: 30, y: 25 },
      { word: "தெய்வம்", romanized: "teyvam", x: 55, y: 12 },
    ],
  },
];

export const VERSE_EXAMPLES = [
  {
    id: 1,
    era: "sangam",
    text: "Akananuru",
    verse:
      "யாதும் ஊரே யாவரும் கேளிர்\nதீதும் நன்றும் பிறர்தர வாரா\nநோதலும் தணிதலும் அவற்றோர் அன்ன\nசாதலும் புதுவது அன்றே",
    translation:
      "All towns are our own; all people are our kin.\nEvil and good come not from others.\nPain and relief are not new arrivals.\nDeath, too, is not a new thing.",
    poet: "Kaniyan Pungundranar",
    clickableWords: ["யாதும்", "ஊரே", "யாவரும்", "கேளிர்", "தீதும்", "நன்றும்"],
  },
  {
    id: 2,
    era: "post-sangam",
    text: "Tirukkural",
    verse:
      "அன்பிற்கும் உண்டோ அடைக்கும் தாழ்\nஆர்வலர் புன்கணீர் பூசல் தரும்",
    translation:
      "Is there a bolt that can lock out love?\nThe sight of a lover's tears breaks open every door.",
    poet: "Thiruvalluvar",
    clickableWords: ["அன்பிற்கும்", "ஆர்வலர்", "புன்கணீர்"],
  },
  {
    id: 3,
    era: "bhakti",
    text: "Thevaram",
    verse:
      "மாசில் வீணையும் மாலை மதியமும்\nவீசு தென்றலும் வீங்கிள வேனிலும்\nமூசு வண்டறை பொய்கையும் போன்றதே",
    translation:
      "A flawless vina, the moonlit evening,\na sweeping southern breeze, the early spring —\nall these are like the humming bee-grazed pond.",
    poet: "Thirugnana Sambandar",
    clickableWords: ["மாசில்", "வீணையும்", "மதியமும்", "தென்றலும்", "வண்டறை"],
  },
];
