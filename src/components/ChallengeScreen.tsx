import { useEffect } from 'react'
import { motion } from 'framer-motion'
import type { ChallengeType } from '../types'
import { CHALLENGES } from '../data/challenges'
import WhoAmIChallenge from './WhoAmIChallenge'
import FiveWordsChallenge from './FiveWordsChallenge'
import RoleSwapChallenge from './RoleSwapChallenge'
import WordAssemblyChallenge from './WordAssemblyChallenge'
import GuessSongChallenge from './GuessSongChallenge'
import TruthLieChallenge from './TruthLieChallenge'
import FinalChallenge from './FinalChallenge'

interface Props {
  challengeType: ChallengeType
  onAdvance: () => void
  onBack: () => void
}

export default function ChallengeScreen({ challengeType, onAdvance, onBack }: Props) {
  if (challengeType === 'who-am-i') {
    return <WhoAmIChallenge onAdvance={onAdvance} onBack={onBack} />
  }

  if (challengeType === 'five-words') {
    return <FiveWordsChallenge onAdvance={onAdvance} onBack={onBack} />
  }

  if (challengeType === 'role-swap') {
    return <RoleSwapChallenge onAdvance={onAdvance} onBack={onBack} />
  }

  if (challengeType === 'word-assembly') {
    return <WordAssemblyChallenge onAdvance={onAdvance} onBack={onBack} />
  }

  if (challengeType === 'truth-lie') {
    return <TruthLieChallenge onAdvance={onAdvance} onBack={onBack} />
  }

  if (challengeType === 'guess-song') {
    return <GuessSongChallenge onAdvance={onAdvance} onBack={onBack} />
  }

  if (challengeType === 'final') {
    return <FinalChallenge onAdvance={onAdvance} onBack={onBack} />
  }

  return <GenericChallenge challengeType={challengeType} onAdvance={onAdvance} onBack={onBack} />
}

function GenericChallenge({ challengeType, onAdvance, onBack }: Props) {
  const challenge = CHALLENGES.find((c) => c.id === challengeType)!

  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if (e.code === 'Space' || e.code === 'Enter' || e.code === 'ArrowRight') {
        e.preventDefault()
        onAdvance()
      }
      if (e.code === 'ArrowLeft') onBack()
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [onAdvance, onBack])

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
