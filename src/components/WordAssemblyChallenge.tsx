import { useState, useEffect, useRef } from 'react'
import { motion } from 'framer-motion'
import wrongSrc from '../assets/wrong.mp3'

const TIMER_SECONDS = 90
const songSrc = `${import.meta.env.BASE_URL}audio/word-assembly-song.mp3`

type Step = 'women' | 'idle' | 'men' | 'idle2'

interface Props {
  onAdvance: () => void
  onBack: () => void
}

export default function WordAssemblyChallenge({ onAdvance, onBack }: Props) {
  const [step, setStep] = useState<Step>('women')
  const [remaining, setRemaining] = useState(TIMER_SECONDS)
  const [timerActive, setTimerActive] = useState(true)
  const [timerDone, setTimerDone] = useState(false)
  const audioRef = useRef<HTMLAudioElement | null>(null)

  const isTimerStep = step === 'women' || step === 'men'

  function stopAudio() {
    if (audioRef.current) {
      audioRef.current.pause()
      audioRef.current.currentTime = 0
      audioRef.current = null
    }
  }

  // Reset timer and start song when entering a timer step
  useEffect(() => {
    if (!isTimerStep) return
    setRemaining(TIMER_SECONDS)
    setTimerDone(false)
    setTimerActive(true)

    stopAudio()
    const audio = new Audio(songSrc)
    audio.loop = true
    audioRef.current = audio
    audio.play().catch(() => {})

    return () => stopAudio()
  }, [step]) // eslint-disable-line react-hooks/exhaustive-deps

  // Countdown tick
  useEffect(() => {
    if (!timerActive || timerDone) return
    if (remaining <= 0) {
      setTimerActive(false)
      setTimerDone(true)
      stopAudio()
      new Audio(wrongSrc).play().catch(() => {})
      return
    }
    const t = setTimeout(() => setRemaining((r) => r - 1), 1000)
    return () => clearTimeout(t)
  }, [timerActive, remaining, timerDone])

  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      const isForward = e.code === 'Space' || e.code === 'Enter' || e.code === 'ArrowRight'
      const isBack = e.code === 'ArrowLeft'
      if (!isForward && !isBack) return
      e.preventDefault()
      e.stopImmediatePropagation()

      if (isForward) {
        if (step === 'women') {
          setTimerActive(false)
          stopAudio()
          setStep('idle')
        } else if (step === 'idle') {
          setStep('men')
        } else if (step === 'men') {
          setTimerActive(false)
          stopAudio()
          setStep('idle2')
        } else {
          onAdvance()
        }
      } else {
        if (step === 'women') {
          onBack()
        } else if (step === 'idle') {
          setStep('women')
        } else if (step === 'men') {
          setTimerActive(false)
          stopAudio()
          setStep('idle')
        } else {
          // idle2 → men (timer restarts via useEffect)
          setStep('men')
        }
      }
    }
    window.addEventListener('keydown', onKey, { capture: true })
    return () => window.removeEventListener('keydown', onKey, { capture: true })
  }, [step, onAdvance, onBack])

  if (!isTimerStep) {
    return <div className="screen" />
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
    </div>
  )
}
