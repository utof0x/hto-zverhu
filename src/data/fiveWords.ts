export interface FiveWordsRound {
  women: { words: [string, string, string, string, string]; song: string };
  men: { words: [string, string, string, string, string]; song: string };
}

export const FIVE_WORDS_ROUNDS: FiveWordsRound[] = [
  {
    women: {
      words: ["Хто", "тримає", "цей", "район", "пес"],
      song: "/audio/fv-w-1.mp3",
    },
    men: {
      words: ["наливай", "куме", "горілки", "стаканчик", "бігає"],
      song: "/audio/fv-m-1.mp3",
    },
  },
  {
    women: {
      words: ["Місто", "Вітер", "Очі", "Голос", "Небо"],
      song: "/audio/fv-w-2.mp3",
    },
    men: {
      words: ["Море", "Сміх", "Руки", "Душа", "Весна"],
      song: "/audio/fv-m-2.mp3",
    },
  },
  {
    women: {
      words: ["Тінь", "Пісня", "Ранок", "Крила", "Доля"],
      song: "/audio/fv-w-3.mp3",
    },
    men: {
      words: ["Ліс", "Сонце", "Вода", "Камінь", "Вітер"],
      song: "/audio/fv-m-3.mp3",
    },
  },
];
