import type { Challenge, ChallengeType } from "../types";

export const CHALLENGES: Challenge[] = [
  {
    id: "who-am-i",
    name: "Хто я?",
    description:
      "Вгадайте відому особу або персонажа задаючи питання, на які можна відповісти лише 'так' або 'ні'",
  },
  {
    id: "five-words",
    name: "5 слів",
    description: "Вгадайте уривок пісні за 5 словами",
  },
  {
    id: "role-swap",
    name: "Обмін ролями",
    description: "Виконуйте завдання, граючи роль члена протилежної команди",
  },
  {
    id: "word-assembly",
    name: "Склади слово",
    description: "Складіть якомога більше слів за відведений час",
  },
  {
    id: "guess-song",
    name: "Вгадай пісню",
    description: "Визначте пісню за коротким уривком музики без слів",
  },
];

export const CHALLENGE_ORDER: ChallengeType[] = [
  "who-am-i",
  "five-words",
  "role-swap",
  "word-assembly",
  "guess-song",
];
