import type { Challenge, ChallengeType } from "../types";

export const CHALLENGES: Challenge[] = [
  {
    id: "five-words",
    name: "5 слів",
    description: "Вгадайте пісню за 5 словами",
  },
  {
    id: "who-am-i",
    name: "Хто я?",
    description:
      "Вгадайте відому особу або персонажа задаючи питання, на які можна відповісти лише 'так' або 'ні'",
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
    id: "truth-lie",
    name: "Правда чи брехня",
    description:
      "Гравці розповідають історії, а команда суперників вгадує, правда це чи брехня",
  },
  {
    id: "guess-song",
    name: "Вгадай пісню",
    description: "Визначте пісню за коротким уривком музики без слів",
  },
  {
    id: "final",
    name: "Фінал",
    description: "Завдання для фінального раунду, яке визначить переможця",
  },
];

export const CHALLENGE_ORDER: ChallengeType[] = [
  "five-words",
  "who-am-i",
  "role-swap",
  "word-assembly",
  "truth-lie",
  "guess-song",
  "final",
];
