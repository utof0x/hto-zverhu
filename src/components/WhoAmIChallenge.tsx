import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import wrongSrc from '../assets/wrong.mp3'
import { WHO_AM_I_IMAGES } from '../data/whoAmI'

const TIMER_SECONDS = 90

type Step = 'intro' | 'men' | 'idle' | 'women' | 'idle2'

interface Props {
  onAdvance: () => void
  onBack: () => void
}

export default function WhoAmIChallenge({ onAdvance, onBack }: Props) {
  const [step, setStep] = useState<Step>('intro')
  const [remaining, setRemaining] = useState(TIMER_SECONDS)
  const [timerActive, setTimerActive] = useState(false)
  const [timerDone, setTimerDone] = useState(false)

  // Reset and start timer when entering a team step
  useEffect(() => {
    if (step !== 'men' && step !== 'women') return

    setRemaining(TIMER_SECONDS)
    setTimerDone(false)
    setTimerActive(true)
  }, [step])

  // Countdown tick
  useEffect(() => {
    if (!timerActive || timerDone) return
    if (remaining <= 0) {
      setTimerActive(false)
      setTimerDone(true)
      new Audio(wrongSrc).play().catch(() => {})
      return
    }
    const t = setTimeout(() => setRemaining((r) => r - 1), 1000)
    return () => clearTimeout(t)
  }, [timerActive, remaining, timerDone])

  // Owns Space/ArrowRight/ArrowLeft in capture phase so App.tsx doesn't also fire
  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      const isForward = e.code === 'Space' || e.code === 'Enter' || e.code === 'ArrowRight'
      const isBack = e.code === 'ArrowLeft'
      if (!isForward && !isBack) return
      e.preventDefault()
      e.stopImmediatePropagation()

      if (isForward) {
        if (step === 'intro') {
          setStep('women')
        } else if (step === 'women') {
          setTimerActive(false)
          setStep('idle')
        } else if (step === 'idle') {
          setStep('men')
        } else if (step === 'men') {
          setTimerActive(false)
          setStep('idle2')
        } else {
          onAdvance()
        }
      } else {
        if (step === 'intro') {
          onBack()
        } else if (step === 'women') {
          setTimerActive(false)
          setStep('intro')
        } else if (step === 'idle') {
          setStep('women')
        } else if (step === 'men') {
          setTimerActive(false)
          setStep('idle')
        } else {
          setStep('men')
        }
      }
    }
    window.addEventListener('keydown', onKey, { capture: true })
    return () => window.removeEventListener('keydown', onKey, { capture: true })
  }, [step, onAdvance, onBack])

  const isTeamStep = step === 'men' || step === 'women'

  const isMen = step === 'men'
  const teamClass = isMen ? 'bonus-men' : 'bonus-women'
  const imageSrc = isMen ? WHO_AM_I_IMAGES.men : WHO_AM_I_IMAGES.women

  return (
    <div className="screen">
      {/* Full-screen image */}
      {isTeamStep && (
        <motion.img
          key={step}
          src={imageSrc}
          className="who-am-i-image"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.4 }}
        />
      )}

      {/* Intro */}
      {step === 'intro' && (
        <div className="challenge-content">
          <motion.h2
            className="challenge-title"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            Хто я?
          </motion.h2>
          <motion.p
            className="challenge-description"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3, duration: 0.5 }}
          >
            Вгадайте відому особу або персонажа за підказками
          </motion.p>
        </div>
      )}

      {/* Timer counter — shown only during team steps */}
      {isTeamStep && (
        <div className="who-am-i-timer">
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
      )}

    </div>
  )
}
