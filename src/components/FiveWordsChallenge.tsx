import { useState, useEffect, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import dingSrc from '../assets/ding.mp3'
import { FIVE_WORDS_ROUNDS } from '../data/fiveWords'

interface Props {
  onAdvance: () => void
}

// 'inter' = blank between rounds (Space → next women); 'blank' = final blank (Space → advance)
type Step = 'women' | 'idle' | 'men' | 'inter' | 'blank'

export default function FiveWordsChallenge({ onAdvance }: Props) {
  const [songRound, setSongRound] = useState(0)
  const [step, setStep] = useState<Step>('women')
  const [revealed, setRevealed] = useState<boolean[]>([false, false, false, false, false])
  const songRef = useRef<HTMLAudioElement | null>(null)

  const round = FIVE_WORDS_ROUNDS[songRound]
  const isWordStep = step === 'women' || step === 'men'
  const teamData = step === 'men' ? round.men : round.women
  const allRevealed = revealed.every(Boolean)

  function stopSong() {
    if (songRef.current) {
      songRef.current.pause()
      songRef.current.currentTime = 0
      songRef.current = null
    }
  }

  // Reset revealed and stop song on step change
  useEffect(() => {
    stopSong()
    if (isWordStep) setRevealed([false, false, false, false, false])
  }, [step, songRound]) // eslint-disable-line react-hooks/exhaustive-deps

  // Play song once all words revealed
  useEffect(() => {
    if (!isWordStep || !allRevealed) return
    const audio = new Audio(teamData.song)
    songRef.current = audio
    audio.play().catch(() => {})
    return () => { audio.pause(); audio.currentTime = 0 }
  }, [allRevealed, isWordStep, teamData.song])

  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if (e.code !== 'Space' && e.code !== 'Enter') return
      if (isWordStep && !allRevealed) return
      e.preventDefault()
      e.stopImmediatePropagation()

      stopSong()

      if (step === 'women') {
        setStep('idle')
      } else if (step === 'idle') {
        setStep('men')
      } else if (step === 'men') {
        const isLast = songRound >= FIVE_WORDS_ROUNDS.length - 1
        if (isLast) setStep('blank')
        else { setSongRound((r) => r + 1); setStep('inter') }
      } else if (step === 'inter') {
        setStep('women')
      } else {
        onAdvance()
      }
    }
    window.addEventListener('keydown', onKey, { capture: true })
    return () => window.removeEventListener('keydown', onKey, { capture: true })
  }, [step, songRound, isWordStep, allRevealed, onAdvance])

  function handleReveal(i: number) {
    if (revealed[i]) return
    new Audio(dingSrc).play().catch(() => {})
    setRevealed((prev) => { const next = [...prev]; next[i] = true; return next })
  }

  if (!isWordStep) {
    return <div className="screen" />
  }

  const teamClass = step === 'women' ? 'bonus-women' : 'bonus-men'

  return (
    <div className="screen">
      <div className="five-words-grid">
        <div className="five-words-row">
          {[0, 1, 2].map((i) => (
            <WordBlock key={i} word={teamData.words[i]} revealed={revealed[i]}
              teamClass={teamClass} onClick={() => handleReveal(i)} />
          ))}
        </div>
        <div className="five-words-row">
          {[3, 4].map((i) => (
            <WordBlock key={i} word={teamData.words[i]} revealed={revealed[i]}
              teamClass={teamClass} onClick={() => handleReveal(i)} />
          ))}
        </div>
      </div>
    </div>
  )
}

function WordBlock({ word, revealed, teamClass, onClick }: {
  word: string; revealed: boolean; teamClass: string; onClick: () => void
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
          <motion.span key="word" initial={{ opacity: 0, scale: 0.6 }} animate={{ opacity: 1, scale: 1 }}
            transition={{ type: 'spring', bounce: 0.5, duration: 0.5 }}>
            {word}
          </motion.span>
        ) : (
          <motion.span key="question" initial={{ opacity: 0 }} animate={{ opacity: 1 }}
            exit={{ opacity: 0, scale: 0.6 }} transition={{ duration: 0.2 }}>
            ?
          </motion.span>
        )}
      </AnimatePresence>
    </motion.button>
  )
}
