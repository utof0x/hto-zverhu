import { useState, useEffect, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import dingSrc from '../assets/ding.mp3'
import { FIVE_WORDS_ROUNDS } from '../data/fiveWords'

interface Props {
  onAdvance: () => void
  roundIndex?: number
}

type Step = 'women' | 'idle' | 'men' | 'blank'

export default function FiveWordsChallenge({ onAdvance, roundIndex = 0 }: Props) {
  const round = FIVE_WORDS_ROUNDS[roundIndex % FIVE_WORDS_ROUNDS.length]
  const [step, setStep] = useState<Step>('women')
  const [revealed, setRevealed] = useState<boolean[]>([false, false, false, false, false])
  const songRef = useRef<HTMLAudioElement | null>(null)

  const teamData = step === 'women' || step === 'idle' ? round.women : round.men
  const isWordStep = step === 'women' || step === 'men'
  const allRevealed = revealed.every(Boolean)

  // Stop song and reset words when step changes
  useEffect(() => {
    if (songRef.current) {
      songRef.current.pause()
      songRef.current.currentTime = 0
      songRef.current = null
    }
    if (isWordStep) {
      setRevealed([false, false, false, false, false])
    }
  }, [step]) // eslint-disable-line react-hooks/exhaustive-deps

  // Play song once all words are revealed
  useEffect(() => {
    if (!isWordStep || !allRevealed) return
    const audio = new Audio(teamData.song)
    songRef.current = audio
    audio.play().catch(() => {})
    return () => {
      audio.pause()
      audio.currentTime = 0
    }
  }, [allRevealed, isWordStep, teamData.song])

  // Space/Enter on word steps (only when all revealed) and idle/blank
  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if (e.code !== 'Space' && e.code !== 'Enter') return

      if (isWordStep && !allRevealed) return

      e.preventDefault()
      e.stopImmediatePropagation()

      if (isWordStep) {
        if (songRef.current) {
          songRef.current.pause()
          songRef.current.currentTime = 0
          songRef.current = null
        }
        if (step === 'women') setStep('idle')
        else setStep('blank')
      } else if (step === 'idle') {
        setStep('men')
      } else {
        onAdvance()
      }
    }
    window.addEventListener('keydown', onKey, { capture: true })
    return () => window.removeEventListener('keydown', onKey, { capture: true })
  }, [step, isWordStep, allRevealed, onAdvance])

  function handleReveal(i: number) {
    if (revealed[i]) return
    new Audio(dingSrc).play().catch(() => {})
    setRevealed((prev) => {
      const next = [...prev]
      next[i] = true
      return next
    })
  }

  if (step === 'idle' || step === 'blank') {
    return (
      <div className="screen">
        <p className="keyboard-hint">Натисніть Space щоб продовжити</p>
      </div>
    )
  }

  const teamClass = step === 'women' ? 'bonus-women' : 'bonus-men'
  const row1 = [0, 1, 2]
  const row2 = [3, 4]

  return (
    <div className="screen">
      <div className="five-words-grid">
        <div className="five-words-row">
          {row1.map((i) => (
            <WordBlock
              key={i}
              word={teamData.words[i]}
              revealed={revealed[i]}
              teamClass={teamClass}
              onClick={() => handleReveal(i)}
            />
          ))}
        </div>
        <div className="five-words-row">
          {row2.map((i) => (
            <WordBlock
              key={i}
              word={teamData.words[i]}
              revealed={revealed[i]}
              teamClass={teamClass}
              onClick={() => handleReveal(i)}
            />
          ))}
        </div>
      </div>

      <p className="keyboard-hint">
        {allRevealed ? 'Натисніть Space щоб продовжити' : 'Натисніть на блок щоб відкрити слово'}
      </p>
    </div>
  )
}

function WordBlock({
  word,
  revealed,
  teamClass,
  onClick,
}: {
  word: string
  revealed: boolean
  teamClass: string
  onClick: () => void
}) {
  return (
    <motion.button
      className={`word-block ${teamClass}`}
      onClick={onClick}
      whileHover={!revealed ? { scale: 1.04 } : {}}
      whileTap={!revealed ? { scale: 0.97 } : {}}
    >
      <AnimatePresence mode="wait">
        {revealed ? (
          <motion.span
            key="word"
            initial={{ opacity: 0, scale: 0.6 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ type: 'spring', bounce: 0.5, duration: 0.5 }}
          >
            {word}
          </motion.span>
        ) : (
          <motion.span
            key="question"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0, scale: 0.6 }}
            transition={{ duration: 0.2 }}
          >
            ?
          </motion.span>
        )}
      </AnimatePresence>
    </motion.button>
  )
}
