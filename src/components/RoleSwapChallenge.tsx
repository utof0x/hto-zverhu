import { useState, useEffect, useRef } from 'react'
import { motion } from 'framer-motion'
import wrongSrc from '../assets/wrong.mp3'

const TIMER_SECONDS = 30
const WOMEN_TURNS = 5

const base = import.meta.env.BASE_URL
const roleWSrc = `${base}audio/role-swap-w.mp3`
const videoSrc = `${base}m-role-swap.MP4`

// men-video → men-idle → women-timer(0) → idle → women-timer(1) → ... → blank
type Step = 'men-video' | 'men-idle' | 'women-timer' | 'idle' | 'blank'

interface Props {
  onAdvance: () => void
  onBack: () => void
}

export default function RoleSwapChallenge({ onAdvance, onBack }: Props) {
  const [step, setStep] = useState<Step>('men-video')
  const [turnIndex, setTurnIndex] = useState(0) // 0-4 for women's turns
  const [remaining, setRemaining] = useState(TIMER_SECONDS)
  const [timerActive, setTimerActive] = useState(false)
  const [timerDone, setTimerDone] = useState(false)
  const audioRef = useRef<HTMLAudioElement | null>(null)
  const videoRef = useRef<HTMLVideoElement | null>(null)

  function stopAudio() {
    if (audioRef.current) {
      audioRef.current.pause()
      audioRef.current.currentTime = 0
      audioRef.current = null
    }
  }

  function replayVideo() {
    if (videoRef.current) {
      videoRef.current.currentTime = 0
      videoRef.current.play().catch(() => {})
    }
  }

  function endTurn() {
    setTimerActive(false)
    stopAudio()
    if (turnIndex >= WOMEN_TURNS - 1) setStep('blank')
    else setStep('idle')
  }

  // Start women's audio and timer when entering women-timer step
  useEffect(() => {
    if (step !== 'women-timer') return
    setRemaining(TIMER_SECONDS)
    setTimerDone(false)
    setTimerActive(true)

    stopAudio()
    const audio = new Audio(roleWSrc)
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
        if (step === 'men-video') setStep('men-idle')
        else if (step === 'men-idle') { setTurnIndex(0); setStep('women-timer') }
        else if (step === 'women-timer') endTurn()
        else if (step === 'idle') { setTurnIndex((i) => i + 1); setStep('women-timer') }
        else onAdvance()
      } else {
        if (step === 'men-video') onBack()
        else if (step === 'men-idle') setStep('men-video')
        else if (step === 'women-timer' && turnIndex === 0) setStep('men-idle')
        else if (step === 'women-timer') { setTurnIndex((i) => i - 1); setStep('idle') }
        else if (step === 'idle') { stopAudio(); setStep('women-timer') }
        else setStep('women-timer') // blank → last women-timer
      }
    }
    window.addEventListener('keydown', onKey, { capture: true })
    return () => window.removeEventListener('keydown', onKey, { capture: true })
  }, [step, turnIndex, onAdvance, onBack]) // eslint-disable-line react-hooks/exhaustive-deps

  if (step === 'men-video') {
    return (
      <div className="screen">
        <video
          ref={videoRef}
          src={videoSrc}
          className="final-video"
          autoPlay
          playsInline
          key="men-video"
        />
        <button className="final-video-reload" onClick={replayVideo}>↺</button>
      </div>
    )
  }

  if (step === 'women-timer') {
    return (
      <div className="screen">
        <div className="challenge-counter challenge-counter-women">{turnIndex + 1} / {WOMEN_TURNS}</div>
        <motion.div
          className="role-swap-timer bonus-women"
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

  return <div className="screen" />
}
