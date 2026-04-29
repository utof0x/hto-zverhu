import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'

type Step = 'main' | 'idle'

interface Props {
  onAdvance: () => void
  onBack: () => void
}

export default function TruthLieChallenge({ onAdvance, onBack }: Props) {
  const [step, setStep] = useState<Step>('main')

  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      const isForward = e.code === 'Space' || e.code === 'Enter' || e.code === 'ArrowRight'
      const isBack = e.code === 'ArrowLeft'
      if (!isForward && !isBack) return
      e.preventDefault()
      e.stopImmediatePropagation()

      if (isForward) {
        if (step === 'main') setStep('idle')
        else onAdvance()
      } else {
        if (step === 'main') onBack()
        else setStep('main')
      }
    }
    window.addEventListener('keydown', onKey, { capture: true })
    return () => window.removeEventListener('keydown', onKey, { capture: true })
  }, [step, onAdvance, onBack])

  if (step === 'idle') return <div className="screen" />

  return (
    <div className="screen">
      <div className="challenge-content">
        <motion.h2
          className="challenge-title"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          Правда чи брехня
        </motion.h2>
        <motion.p
          className="challenge-description"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3, duration: 0.5 }}
        >
          Гравці розповідають історії, а команда суперників вгадує, правда це чи брехня
        </motion.p>
      </div>
    </div>
  )
}
