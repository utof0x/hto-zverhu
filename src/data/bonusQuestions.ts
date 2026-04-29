export interface BonusQuestion {
  question: string;
  answer?: number;
}

export const BONUS_QUESTIONS_MEN: BonusQuestion[] = [
  {
    question:
      'Скільки відсотків жінок питали у чоловіка: "а ти б мене любив, якби я була..."?',
    answer: 64,
  },
  {
    question:
      "Скільки відсотків жінок вважають, що чоловік має першим зізнаватись в коханні?",
    answer: 72,
  },
  {
    question:
      "Скільки відсотків жінок приховують від чоловіка свої реальні витрати на косметику?",
    answer: 40,
  },
  {
    question:
      "Скільки відсотків жінок розповідали подругам щось, про що потім шкодували?",
    answer: 74,
  },
  {
    question:
      "Скільки відсотків жінок шукали в соцмережах, який вигляд має колишня коханого?",
    answer: 73,
  },
  {
    question:
      "Скільки відсотків жінок, не задоволених подарунком, симулювали радість?",
    answer: 80,
  },
];

export const BONUS_QUESTIONS_WOMEN: BonusQuestion[] = [
  {
    question:
      "Скільки відсотків чоловіків, коли знайомляться з дівчиною, просять її інстаграм замість номера телефону?",
    answer: 58,
  },
  {
    question:
      'Скільки відсотків чоловіків не будуть зустрічатись з дівчиною, яку не можуть "потягнути" матеріально?',
    answer: 58,
  },
  {
    question:
      "Скільки відсотків чоловіків губляться і говорять дурниці у компанії красивої дівчини?",
    answer: 76,
  },
  {
    question:
      "Скільки відсотків чоловіків вважають, що жінка обов'язково має вміти готувати?",
    answer: 66,
  },
  {
    question:
      "Скільки відсотків чоловіків пишаються, коли на їхню жінку звертають увагу інші чоловіки?",
    answer: 65,
  },
  {
    question: "Скільки відсотків чоловіків миють посуд одразу після їжі?",
    answer: 31,
  },
];

export function pickQuestion(
  questions: BonusQuestion[],
  usedIndices: number[],
): { question: BonusQuestion; index: number } {
  const available = questions
    .map((_, i) => i)
    .filter((i) => !usedIndices.includes(i));
  const pool = available.length > 0 ? available : questions.map((_, i) => i);
  const index = pool[Math.floor(Math.random() * pool.length)];
  return { question: questions[index], index };
}
