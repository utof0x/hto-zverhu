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
import { BONUS_QUESTIONS_MEN, BONUS_QUESTIONS_WOMEN } from './data/bonusQuestions'
// BONUS_QUESTIONS_WOMEN kept for women bonus question selection
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
    bonusIndexMen: 0,
    bonusIndexWomen: 0,
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
        if (prev.currentChallenge === 'final') {
          return { ...prev, phase: 'round-end', roundScores: { men: 0, women: 0 } }
        }
        const bonusTeam: Team = prev.roundScores.women > prev.roundScores.men ? 'women' : 'men'
        const questions = bonusTeam === 'men' ? BONUS_QUESTIONS_MEN : BONUS_QUESTIONS_WOMEN
        const idx = bonusTeam === 'men' ? prev.bonusIndexMen : prev.bonusIndexWomen
        const question = questions[idx % questions.length]
        return {
          ...prev,
          phase: 'bonus',
          bonusTeam,
          bonusAnswer: question.answer ?? Math.round(15 + Math.random() * 70),
          bonusQuestion: question.question,
          bonusIndexMen: bonusTeam === 'men' ? prev.bonusIndexMen + 1 : prev.bonusIndexMen,
          bonusIndexWomen: bonusTeam === 'women' ? prev.bonusIndexWomen + 1 : prev.bonusIndexWomen,
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
      scores: { ...prev.scores, [team]: prev.scores[team] + 10 },
      roundScores: { ...prev.roundScores, [team]: prev.roundScores[team] + 10 },
    }))
  }, [])

  const removePoint = useCallback((team: Team) => {
    setState((prev) => ({
      ...prev,
      scores: { ...prev.scores, [team]: Math.max(0, prev.scores[team] - 10) },
    }))
  }, [])

  const transferAllPoints = useCallback((team: Team) => {
    setState((prev) => {
      const total = prev.scores.men + prev.scores.women
      return {
        ...prev,
        scores: { men: team === 'men' ? total : 0, women: team === 'women' ? total : 0 },
      }
    })
  }, [])

  const goBack = useCallback(() => {
    setState((prev) => {
      const { phase, currentChallenge } = prev
      if (phase === 'round-start') return { ...prev, phase: 'home' }
      if (phase === 'challenge') return { ...prev, phase: 'round-start' }
      if (phase === 'bonus') return { ...prev, phase: 'challenge' }
      if (phase === 'round-end') {
        if (currentChallenge === 'final') return { ...prev, phase: 'challenge' }
        return { ...prev, phase: 'bonus' }
      }
      return prev
    })
  }, [])

  const handleBonusDone = useCallback(() => {
    setState((prev) => ({ ...prev, phase: 'round-end' }))
  }, [])

  // Points can be added on challenge, bonus, and round-end screens
  useEffect(() => {
    if (state.phase !== 'bonus') return
    function onKey(e: KeyboardEvent) {
      if (e.key === '1') addPoint('men')
      if (e.key === '2') addPoint('women')
      if (e.key === '9') removePoint('men')
      if (e.key === '0') removePoint('women')
      if (e.code === 'ArrowLeft') goBack()
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [state.phase, addPoint, removePoint, goBack])

  useEffect(() => {
    if (state.phase === 'bonus') return

    function onKey(e: KeyboardEvent) {
      if (state.phase !== 'challenge' && (e.code === 'Space' || e.code === 'Enter' || e.code === 'ArrowRight')) {
        e.preventDefault()
        advance()
      }
      if (state.phase !== 'challenge' && e.code === 'ArrowLeft') {
        goBack()
      }
      if (state.phase === 'challenge' || state.phase === 'round-end') {
        const isFinal = state.currentChallenge === 'final'
        if (e.key === '1') isFinal ? transferAllPoints('men') : addPoint('men')
        if (e.key === '2') isFinal ? transferAllPoints('women') : addPoint('women')
      }
      if (e.key === '9') removePoint('men')
      if (e.key === '0') removePoint('women')
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [state.phase, state.currentChallenge, advance, addPoint, removePoint, transferAllPoints, goBack])

  const challenge = CHALLENGES.find((c) => c.id === state.currentChallenge)!

  return (
    <div className="app">
      <AnimatedBackground />
      {state.phase === 'home' && <HomeScreen />}
      {state.phase === 'round-start' && (
        <RoundStartScreen round={state.currentRound} challengeName={challenge.name} />
      )}
      {state.phase === 'challenge' && (
        <ChallengeScreen challengeType={state.currentChallenge} onAdvance={advance} onBack={goBack} />
      )}
      {state.phase === 'bonus' && state.bonusTeam && (
        <BonusScreen
          team={state.bonusTeam}
          answer={state.bonusAnswer}
          tolerance={state.bonusAnswerTolerance}
          question={state.bonusQuestion}
          onDone={handleBonusDone}
        />
      )}
      {state.phase === 'round-end' && (
        <RoundEndScreen
          scores={state.scores}
          isGameEnd={state.currentRound === TOTAL_ROUNDS}
          onAddPoint={(team) => state.currentChallenge === 'final' ? transferAllPoints(team) : addPoint(team)}
        />
      )}
    </div>
  )
}
