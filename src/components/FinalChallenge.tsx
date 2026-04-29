import { useState, useEffect, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import wrongSrc from '../assets/wrong.mp3'
import dingSrc from '../assets/ding.mp3'
import { FINAL_IMAGES_MEN, FINAL_IMAGES_WOMEN } from '../data/finalChallenge'

const TIMER_SECONDS = 90
const finalSongSrc = `${import.meta.env.BASE_URL}audio/final.mp3`

type Step = 'men' | 'idle' | 'women' | 'blank'

interface Props {
  onAdvance: () => void
}

export default function FinalChallenge({ onAdvance }: Props) {
  const [step, setStep] = useState<Step>('men')
  const [remaining, setRemaining] = useState(TIMER_SECONDS)
  const [timerActive, setTimerActive] = useState(true)
  const [timerDone, setTimerDone] = useState(false)
  const [revealed, setRevealed] = useState<boolean[]>(Array(10).fill(false))
  const audioRef = useRef<HTMLAudioElement | null>(null)

  const isTimerStep = step === 'men' || step === 'women'
  const images = step === 'men' ? FINAL_IMAGES_MEN : FINAL_IMAGES_WOMEN
  const teamClass = step === 'men' ? 'bonus-men' : 'bonus-women'

  function stopAudio() {
    if (audioRef.current) {
      audioRef.current.pause()
      audioRef.current.currentTime = 0
      audioRef.current = null
    }
  }

  // Reset and start song when entering a timer step
  useEffect(() => {
    if (!isTimerStep) return
    setRemaining(TIMER_SECONDS)
    setTimerDone(false)
    setTimerActive(true)
    setRevealed(Array(10).fill(false))

    stopAudio()
    const audio = new Audio(finalSongSrc)
    audio.loop = true
    audioRef.current = audio
    audio.play().catch(() => {})

    return () => stopAudio()
  }, [step]) // eslint-disable-line react-hooks/exhaustive-deps

  // Countdown tick
  useEffect(() => {
    if (!timerActive || timerDone || !isTimerStep) return
    if (remaining <= 0) {
      setTimerActive(false)
      setTimerDone(true)
      stopAudio()
      new Audio(wrongSrc).play().catch(() => {})
      return
    }
    const t = setTimeout(() => setRemaining((r) => r - 1), 1000)
    return () => clearTimeout(t)
  }, [timerActive, remaining, timerDone, isTimerStep])

  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if (e.code !== 'Space' && e.code !== 'Enter') return
      e.preventDefault()
      e.stopImmediatePropagation()
      if (step === 'men') {
        setTimerActive(false)
        stopAudio()
        setStep('idle')
      } else if (step === 'idle') {
        setStep('women')
      } else if (step === 'women') {
        setTimerActive(false)
        stopAudio()
        setStep('blank')
      } else {
        onAdvance()
      }
    }
    window.addEventListener('keydown', onKey, { capture: true })
    return () => window.removeEventListener('keydown', onKey, { capture: true })
  }, [step, onAdvance])

  function handleReveal(i: number) {
    if (revealed[i]) return
    new Audio(dingSrc).play().catch(() => {})
    setRevealed((prev) => { const next = [...prev]; next[i] = true; return next })
  }

  if (!isTimerStep) return <div className="screen" />

  return (
    <div className="screen">
      {/* Timer */}
      <div className="final-timer-wrap">
        <motion.div
          className={`timer-counter ${teamClass}`}
          key={step}
          initial={{ scale: 0.7, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ type: 'spring', bounce: 0.4, duration: 0.5 }}
        >
          {remaining}
        </motion.div>
      </div>

      {/* Image grid */}
      <div className="final-grid">
        {images.map((item, i) => (
          <div key={i} className="final-cell">
            <img src={item.image} className="final-cell-image" alt="" />
            <motion.button
              className={`final-cell-answer ${teamClass}`}
              onClick={() => handleReveal(i)}
              whileHover={!revealed[i] ? { scale: 1.04 } : {}}
              whileTap={!revealed[i] ? { scale: 0.97 } : {}}
            >
              <AnimatePresence mode="wait">
                {revealed[i] ? (
                  <motion.span key="ans"
                    initial={{ opacity: 0, scale: 0.7 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ type: 'spring', bounce: 0.4, duration: 0.35 }}
                  >
                    {item.answer}
                  </motion.span>
                ) : (
                  <motion.span key="q"
                    initial={{ opacity: 0 }} animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }} transition={{ duration: 0.15 }}
                  >
                    ?
                  </motion.span>
                )}
              </AnimatePresence>
            </motion.button>
          </div>
        ))}
      </div>
    </div>
  )
}
