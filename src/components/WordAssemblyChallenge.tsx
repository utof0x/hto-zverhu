import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import wrongSrc from '../assets/wrong.mp3'

const TIMER_SECONDS = 90

type Step = 'women' | 'idle' | 'men' | 'idle2'

interface Props {
  onAdvance: () => void
}

export default function WordAssemblyChallenge({ onAdvance }: Props) {
  const [step, setStep] = useState<Step>('women')
  const [remaining, setRemaining] = useState(TIMER_SECONDS)
  const [timerActive, setTimerActive] = useState(true)
  const [timerDone, setTimerDone] = useState(false)

  const isTimerStep = step === 'women' || step === 'men'

  useEffect(() => {
    if (!isTimerStep) return
    setRemaining(TIMER_SECONDS)
    setTimerDone(false)
    setTimerActive(true)
  }, [step]) // eslint-disable-line react-hooks/exhaustive-deps

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

  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if (e.code !== 'Space' && e.code !== 'Enter') return
      e.preventDefault()
      e.stopImmediatePropagation()
      if (step === 'women') {
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
    }
    window.addEventListener('keydown', onKey, { capture: true })
    return () => window.removeEventListener('keydown', onKey, { capture: true })
  }, [step, onAdvance])

  if (!isTimerStep) {
    return (
      <div className="screen">
        <p className="keyboard-hint">Натисніть Space щоб продовжити</p>
      </div>
    )
  }

  const teamClass = step === 'women' ? 'bonus-women' : 'bonus-men'

  return (
    <div className="screen">
      <motion.div
        className={`role-swap-timer ${teamClass}`}
        key={step}
        initial={{ scale: 0.7, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ type: 'spring', bounce: 0.4, duration: 0.5 }}
      >
        {remaining}
      </motion.div>
      <p className="keyboard-hint">Натисніть Space щоб завершити хід</p>
    </div>
  )
}
