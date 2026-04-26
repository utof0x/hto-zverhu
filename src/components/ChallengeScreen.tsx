import { useEffect } from 'react'
import { motion } from 'framer-motion'
import type { ChallengeType } from '../types'
import { CHALLENGES } from '../data/challenges'
import WhoAmIChallenge from './WhoAmIChallenge'
import FiveWordsChallenge from './FiveWordsChallenge'
import RoleSwapChallenge from './RoleSwapChallenge'
import WordAssemblyChallenge from './WordAssemblyChallenge'
import GuessSongChallenge from './GuessSongChallenge'

interface Props {
  challengeType: ChallengeType
  onAdvance: () => void
}

export default function ChallengeScreen({ challengeType, onAdvance }: Props) {
  if (challengeType === 'who-am-i') {
    return <WhoAmIChallenge onAdvance={onAdvance} />
  }

  if (challengeType === 'five-words') {
    return <FiveWordsChallenge onAdvance={onAdvance} />
  }

  if (challengeType === 'role-swap') {
    return <RoleSwapChallenge onAdvance={onAdvance} />
  }

  if (challengeType === 'word-assembly') {
    return <WordAssemblyChallenge onAdvance={onAdvance} />
  }

  if (challengeType === 'guess-song') {
    return <GuessSongChallenge onAdvance={onAdvance} />
  }

  return <GenericChallenge challengeType={challengeType} onAdvance={onAdvance} />
}

function GenericChallenge({ challengeType, onAdvance }: Props) {
  const challenge = CHALLENGES.find((c) => c.id === challengeType)!

  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if (e.code === 'Space' || e.code === 'Enter') {
        e.preventDefault()
        onAdvance()
      }
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [onAdvance])

  return (
    <div className="screen">
      <div className="challenge-content">
        <motion.h2
          className="challenge-title"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          {challenge.name}
        </motion.h2>
        <motion.p
          className="challenge-description"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3, duration: 0.5 }}
        >
          {challenge.description}
        </motion.p>
      </div>

      <div className="challenge-hints">
        <span className="hint-key">1</span><span className="hint-text">+1 Чоловіки</span>
        <span className="hint-sep" />
        <span className="hint-key">2</span><span className="hint-text">+1 Жінки</span>
        <span className="hint-sep" />
        <span className="hint-key">Space</span><span className="hint-text">Далі</span>
      </div>
    </div>
  )
}
