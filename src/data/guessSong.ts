const base = import.meta.env.BASE_URL;

export interface GuessSongTrack {
  minus: string;
  plus: string;
  name: string;
  artist: string;
}

export const GUESS_SONG_TRACKS: GuessSongTrack[] = [
  {
    minus: `${base}audio/gs-1-minus.mp3`,
    plus: `${base}audio/gs-1-plus.mp3`,
    name: "Фанат",
    artist: "Alena Omargalieva",
  },
  {
    minus: `${base}audio/gs-2-minus.mp3`,
    plus: `${base}audio/gs-2-plus.mp3`,
    name: "Happiest Year",
    artist: "Jaymes Young",
  },
  {
    minus: `${base}audio/gs-3-minus.mp3`,
    plus: `${base}audio/gs-3-plus.mp3`,
    name: "Пінаколада",
    artist: "Віталій Козловський",
  },
  {
    minus: `${base}audio/gs-4-minus.mp3`,
    plus: `${base}audio/gs-4-plus.mp3`,
    name: "Смарагдове небо",
    artist: "Drevo",
  },
  {
    minus: `${base}audio/gs-5-minus.mp3`,
    plus: `${base}audio/gs-5-plus.mp3`,
    name: "Додай гучності",
    artist: "Jerry Heil",
  },
  {
    minus: `${base}audio/gs-6-minus.mp3`,
    plus: `${base}audio/gs-6-plus.mp3`,
    name: "Василина",
    artist: "DZIDZIO",
  },
  {
    minus: `${base}audio/gs-7-minus.mp3`,
    plus: `${base}audio/gs-7-plus.mp3`,
    name: "Зірочка палай (повна версія) - скачати",
    artist: "Аня Трінчер",
  },
  {
    minus: `${base}audio/gs-8-minus.mp3`,
    plus: `${base}audio/gs-8-plus.mp3`,
    name: "Маршрутка",
    artist: "Скрябін",
  },
];
