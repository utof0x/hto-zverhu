const base = import.meta.env.BASE_URL;

export interface FiveWordsRound {
  women: { words: [string, string, string, string, string]; song: string };
  men: { words: [string, string, string, string, string]; song: string };
}

export const FIVE_WORDS_ROUNDS: FiveWordsRound[] = [
  {
    women: {
      words: ["не", "пара", "це", "відчутно", "і"],
      song: `${base}audio/fv-w-1.mp3`,
    },
    men: {
      words: ["ти", "крок", "вперед", "а", "я"],
      song: `${base}audio/fv-m-1.mp3`,
    },
  },
  {
    women: {
      words: ["вуличні", "манери", "не", "формат", "нерви"],
      song: `${base}audio/fv-w-2.mp3`,
    },
    men: {
      words: ["неначе", "сон", "такий", "красивий", "ніби"],
      song: `${base}audio/fv-m-2.mp3`,
    },
  },
  {
    women: {
      words: ["з", "тих", "пір", "так", "сильно"],
      song: `${base}audio/fv-w-3.mp3`,
    },
    men: {
      words: ["за", "мною", "досі", "під", "покровою"],
      song: `${base}audio/fv-m-3.mp3`,
    },
  },
];
