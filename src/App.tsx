import { useState, useEffect, useCallback } from 'react'
import type { GameState, Team } from './types'
import { CHALLENGE_ORDER } from './data/challenges'
import HomeScreen from './components/HomeScreen'
import RoundStartScreen from './components/RoundStartScreen'
import ChallengeScreen from './components/ChallengeScreen'
import BonusScreen from './components/BonusScreen'
import RoundEndScreen from './components/RoundEndScreen'
import AnimatedBackground from './components/AnimatedBackground'
import { CHALLENGES } from './data/challenges'
import { BONUS_QUESTIONS_MEN, BONUS_QUESTIONS_WOMEN, pickQuestion } from './data/bonusQuestions'
import './App.css'

const TOTAL_ROUNDS = CHALLENGE_ORDER.length
const BONUS_TOLERANCE = 10

function initialState(): GameState {
  return {
    phase: 'home',
    currentRound: 1,
    totalRounds: TOTAL_ROUNDS,
    scores: { men: 0, women: 0 },
    roundScores: { men: 0, women: 0 },
    currentChallenge: CHALLENGE_ORDER[0],
    bonusTeam: null,
    bonusAnswer: 50,
    bonusAnswerTolerance: BONUS_TOLERANCE,
    bonusQuestion: '',
  }
}

export default function App() {
  const [state, setState] = useState<GameState>(initialState)

  const advance = useCallback(() => {
    setState((prev) => {
      const { phase, currentRound } = prev

      if (phase === 'home') return { ...prev, phase: 'round-start' }

      if (phase === 'round-start') return { ...prev, phase: 'challenge' }

      if (phase === 'challenge') {
        const bonusTeam: Team = prev.roundScores.women > prev.roundScores.men ? 'women' : 'men'
        const questions = bonusTeam === 'men' ? BONUS_QUESTIONS_MEN : BONUS_QUESTIONS_WOMEN
        const { question } = pickQuestion(questions, [])
        return {
          ...prev,
          phase: 'bonus',
          bonusTeam,
          bonusAnswer: Math.round(15 + Math.random() * 70),
          bonusQuestion: question.question,
          roundScores: { men: 0, women: 0 },
        }
      }

      if (phase === 'round-end') {
        const nextRound = currentRound + 1
        if (nextRound > TOTAL_ROUNDS) return initialState()
        return {
          ...prev,
          phase: 'round-start',
          currentRound: nextRound,
          currentChallenge: CHALLENGE_ORDER[nextRound - 1],
          roundScores: { men: 0, women: 0 },
        }
      }

      return prev
    })
  }, [])

  const addPoint = useCallback((team: Team) => {
    setState((prev) => ({
      ...prev,
      scores: { ...prev.scores, [team]: prev.scores[team] + 1 },
      roundScores: { ...prev.roundScores, [team]: prev.roundScores[team] + 1 },
    }))
  }, [])

  const handleBonusDone = useCallback(() => {
    setState((prev) => ({ ...prev, phase: 'round-end' }))
  }, [])

  const handleChangeAnswer = useCallback((delta: number) => {
    setState((prev) => ({
      ...prev,
      bonusAnswer: Math.max(1, Math.min(99, prev.bonusAnswer + delta)),
    }))
  }, [])

  // Points can be added on challenge, bonus, and round-end screens
  useEffect(() => {
    if (state.phase !== 'bonus') return
    function onKey(e: KeyboardEvent) {
      if (e.key === '1') addPoint('men')
      if (e.key === '2') addPoint('women')
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [state.phase, addPoint])

  useEffect(() => {
    if (state.phase === 'bonus') return

    function onKey(e: KeyboardEvent) {
      if (state.phase !== 'challenge' && (e.code === 'Space' || e.code === 'Enter')) {
        e.preventDefault()
        advance()
      }
      if (state.phase === 'challenge' || state.phase === 'round-end') {
        if (e.key === '1') addPoint('men')
        if (e.key === '2') addPoint('women')
      }
      // Dev shortcut: jump to bonus screen
      if (e.key === 'b' || e.key === 'B') {
        const { question } = pickQuestion(BONUS_QUESTIONS_MEN, [])
        setState((prev) => ({
          ...prev,
          phase: 'bonus',
          bonusTeam: 'men',
          bonusAnswer: Math.round(15 + Math.random() * 70),
          bonusQuestion: question.question,
        }))
      }
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [state.phase, advance, addPoint])

  const challenge = CHALLENGES.find((c) => c.id === state.currentChallenge)!

  return (
    <div className="app">
      <AnimatedBackground />
      {state.phase === 'home' && <HomeScreen />}
      {state.phase === 'round-start' && (
        <RoundStartScreen round={state.currentRound} challengeName={challenge.name} />
      )}
      {state.phase === 'challenge' && (
        <ChallengeScreen challengeType={state.currentChallenge} onAdvance={advance} />
      )}
      {state.phase === 'bonus' && state.bonusTeam && (
        <BonusScreen
          team={state.bonusTeam}
          answer={state.bonusAnswer}
          tolerance={state.bonusAnswerTolerance}
          question={state.bonusQuestion}
          onDone={handleBonusDone}
          onChangeAnswer={handleChangeAnswer}
        />
      )}
      {state.phase === 'round-end' && (
        <RoundEndScreen
          scores={state.scores}
          isGameEnd={state.currentRound === TOTAL_ROUNDS}
          onAddPoint={addPoint}
        />
      )}
    </div>
  )
}
