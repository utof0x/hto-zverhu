import { useEffect, useRef } from 'react'
import { motion } from 'framer-motion'
import introSrc from '../assets/intro.mp3'

interface Props {
  round: number
  challengeName: string
}

const blockVariants = {
  hidden: { opacity: 0, scale: 0.6, y: 40 },
  visible: (delay: number) => ({
    opacity: 1,
    scale: 1,
    y: 0,
    transition: { delay, duration: 0.6, type: 'spring' as const, bounce: 0.4 },
  }),
}

const hint = {
  hidden: { opacity: 0 },
  visible: { opacity: 0.5, transition: { delay: 1.4, duration: 0.8 } },
}

export default function RoundStartScreen({ round, challengeName }: Props) {
  const audioRef = useRef<HTMLAudioElement | null>(null)

  useEffect(() => {
    const audio = new Audio(introSrc)
    audioRef.current = audio
    audio.play().catch(() => {})
    return () => {
      audio.pause()
      audio.currentTime = 0
    }
  }, [])

  return (
    <div className="screen">
      <div className="round-start-center">
        <motion.div
          className="round-block round-number"
          variants={blockVariants}
          custom={0}
          initial="hidden"
          animate="visible"
        >
          {round}
        </motion.div>
        <motion.div
          className="round-block round-label"
          variants={blockVariants}
          custom={0.2}
          initial="hidden"
          animate="visible"
        >
          Раунд
        </motion.div>
        <motion.div
          className="challenge-name-label"
          variants={blockVariants}
          custom={0.5}
          initial="hidden"
          animate="visible"
        >
          {challengeName}
        </motion.div>
      </div>
      <motion.p className="keyboard-hint" variants={hint} initial="hidden" animate="visible">
        Натисніть Space або Enter щоб розпочати
      </motion.p>
    </div>
  )
}
