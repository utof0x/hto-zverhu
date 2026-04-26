export interface BonusQuestion {
  question: string
}

export const BONUS_QUESTIONS_MEN: BonusQuestion[] = [
  { question: 'Який відсоток чоловіків вміє готувати борщ?' },
  { question: 'Скільки відсотків чоловіків ніколи не плакали під час фільму?' },
  { question: 'Який відсоток чоловіків читав інструкцію перед використанням?' },
  { question: 'Скільки відсотків чоловіків знають, де лежать їхні шкарпетки?' },
  { question: "Який відсоток чоловіків пам'ятає дату річниці без підказки?" },
]

export const BONUS_QUESTIONS_WOMEN: BonusQuestion[] = [
  { question: 'Який відсоток жінок запізнювався більш ніж на 30 хвилин?' },
  { question: 'Скільки відсотків жінок вміє паралельно парковатись з першого разу?' },
  { question: 'Який відсоток жінок має більше 5 сумочок?' },
  { question: 'Скільки відсотків жінок хоча б раз фарбували волосся?' },
  { question: 'Який відсоток жінок знає, що знаходиться під капотом авто?' },
]

export function pickQuestion(questions: BonusQuestion[], usedIndices: number[]): { question: BonusQuestion; index: number } {
  const available = questions.map((_, i) => i).filter((i) => !usedIndices.includes(i))
  const pool = available.length > 0 ? available : questions.map((_, i) => i)
  const index = pool[Math.floor(Math.random() * pool.length)]
  return { question: questions[index], index }
}
