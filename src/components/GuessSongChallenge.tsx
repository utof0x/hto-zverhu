import { useState, useEffect, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { GUESS_SONG_TRACKS } from '../data/guessSong'

type Step = 'idle-minus' | 'minus' | 'idle-plus' | 'plus'

interface Props {
  onAdvance: () => void
}

export default function GuessSongChallenge({ onAdvance }: Props) {
  const [songIndex, setSongIndex] = useState(0)
  const [step, setStep] = useState<Step>('idle-minus')
  const audioRef = useRef<HTMLAudioElement | null>(null)

  const track = GUESS_SONG_TRACKS[songIndex]
  const isLast = songIndex >= GUESS_SONG_TRACKS.length - 1
  const isPlaying = step === 'minus' || step === 'plus'

  function stopAudio() {
    if (audioRef.current) {
      audioRef.current.pause()
      audioRef.current.currentTime = 0
      audioRef.current = null
    }
  }

  useEffect(() => () => stopAudio(), [])

  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if (e.code !== 'Space' && e.code !== 'Enter') return
      e.preventDefault()
      e.stopImmediatePropagation()

      if (step === 'idle-minus') {
        const audio = new Audio(track.minus)
        audioRef.current = audio
        audio.play().catch(() => {})
        setStep('minus')
      } else if (step === 'minus') {
        stopAudio()
        setStep('idle-plus')
      } else if (step === 'idle-plus') {
        const audio = new Audio(track.plus)
        audioRef.current = audio
        audio.play().catch(() => {})
        setStep('plus')
      } else if (step === 'plus') {
        stopAudio()
        if (isLast) {
          onAdvance()
        } else {
          setSongIndex((i) => i + 1)
          setStep('idle-minus')
        }
      }
    }
    window.addEventListener('keydown', onKey, { capture: true })
    return () => window.removeEventListener('keydown', onKey, { capture: true })
  }, [step, track, isLast, onAdvance])

  return (
    <div className="screen">
      <div className="guess-song-center">
        <AnimatePresence mode="wait">
          {isPlaying && (
            <motion.div
              key="playing"
              className="guess-song-playing"
              initial={{ opacity: 0, scale: 0.85 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.85 }}
              transition={{ duration: 0.3 }}
            >
              <SoundWave />
              {step === 'plus' && (
                <motion.div
                  className="guess-song-info"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.15, duration: 0.35 }}
                >
                  <span className="guess-song-name">{track.name}</span>
                  <span className="guess-song-artist">{track.artist}</span>
                </motion.div>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </div>

    </div>
  )
}

function SoundWave() {
  const bars = [0.4, 0.7, 1, 0.6, 0.85, 0.5, 0.9, 0.65, 0.75, 0.45]
  return (
    <div className="sound-wave">
      {bars.map((h, i) => (
        <div
          key={i}
          className="sound-wave-bar"
          style={{ animationDelay: `${i * 0.08}s`, '--bar-height': h } as React.CSSProperties}
        />
      ))}
    </div>
  )
}
