const base = import.meta.env.BASE_URL

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
    name: "Смарагдове небо",
    artist: "Drevo",
  },
  {
    minus: `${base}audio/gs-2-minus.mp3`,
    plus: `${base}audio/gs-2-plus.mp3`,
    name: "Happiest Year",
    artist: "Jaymes Young",
  },
]
