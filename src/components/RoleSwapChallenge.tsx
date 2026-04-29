import { useState, useEffect, useRef } from 'react'
import { motion } from 'framer-motion'
import wrongSrc from '../assets/wrong.mp3'

const TIMER_SECONDS = 30
const MEN_TURNS = 5
const WOMEN_TURNS = 5
const TOTAL_TURNS = MEN_TURNS + WOMEN_TURNS // 0-4 = men, 5-9 = women

const base = import.meta.env.BASE_URL
const roleMSrc = `${base}audio/role-swap-m.mp3`
const roleWSrc = `${base}audio/role-swap-w.mp3`

type Step = 'timer' | 'idle' | 'blank'

interface Props {
  onAdvance: () => void
  onBack: () => void
}

export default function RoleSwapChallenge({ onAdvance, onBack }: Props) {
  const [turnIndex, setTurnIndex] = useState(0)
  const [step, setStep] = useState<Step>('timer')
  const [remaining, setRemaining] = useState(TIMER_SECONDS)
  const [timerActive, setTimerActive] = useState(true)
  const [timerDone, setTimerDone] = useState(false)
  const audioRef = useRef<HTMLAudioElement | null>(null)

  const team = turnIndex < MEN_TURNS ? 'men' : 'women'
  const teamClass = team === 'men' ? 'bonus-men' : 'bonus-women'

  function stopAudio() {
    if (audioRef.current) {
      audioRef.current.pause()
      audioRef.current.currentTime = 0
      audioRef.current = null
    }
  }

  function endTurn() {
    setTimerActive(false)
    stopAudio()
    if (turnIndex >= TOTAL_TURNS - 1) setStep('blank')
    else setStep('idle')
  }

  // Reset timer and start music when entering a new timer step
  useEffect(() => {
    if (step !== 'timer') return
    setRemaining(TIMER_SECONDS)
    setTimerDone(false)
    setTimerActive(true)

    stopAudio()
    const src = turnIndex < MEN_TURNS ? roleMSrc : roleWSrc
    const audio = new Audio(src)
    audio.loop = true
    audioRef.current = audio
    audio.play().catch(() => {})

    return () => stopAudio()
  }, [step, turnIndex]) // eslint-disable-line react-hooks/exhaustive-deps

  // Countdown tick
  useEffect(() => {
    if (!timerActive || timerDone) return
    if (remaining <= 0) {
      setTimerDone(true)
      stopAudio()
      new Audio(wrongSrc).play().catch(() => {})
      setTimerActive(false)
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
        if (step === 'timer') {
          endTurn()
        } else if (step === 'idle') {
          setTurnIndex((i) => i + 1)
          setStep('timer')
        } else {
          onAdvance()
        }
      } else {
        if (step === 'blank') {
          setStep('timer')
        } else if (step === 'idle') {
          setStep('timer')
        } else if (turnIndex === 0) {
          onBack()
        } else {
          setTurnIndex((i) => i - 1)
          setStep('idle')
        }
      }
    }
    window.addEventListener('keydown', onKey, { capture: true })
    return () => window.removeEventListener('keydown', onKey, { capture: true })
  }, [step, turnIndex, onAdvance, onBack]) // eslint-disable-line react-hooks/exhaustive-deps

  if (step !== 'timer') {
    return <div className="screen" />
  }

  const teamTurnIndex = team === 'men' ? turnIndex + 1 : turnIndex - MEN_TURNS + 1
  const teamTurns = team === 'men' ? MEN_TURNS : WOMEN_TURNS

  return (
    <div className="screen">
      <div className={`challenge-counter ${team === 'men' ? 'challenge-counter-men' : 'challenge-counter-women'}`}>{teamTurnIndex} / {teamTurns}</div>
      <motion.div
        className={`role-swap-timer ${teamClass}`}
        key={turnIndex}
        initial={{ scale: 0.7, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ type: 'spring', bounce: 0.4, duration: 0.5 }}
      >
        {remaining}
      </motion.div>
    </div>
  )
}
