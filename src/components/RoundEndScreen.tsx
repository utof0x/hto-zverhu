import { motion, AnimatePresence } from 'framer-motion'
import type { Team } from '../types'

interface Props {
  scores: { men: number; women: number }
  isGameEnd: boolean
  onAddPoint: (team: Team) => void
}

const cardVariants = {
  hidden: { opacity: 0, y: 60, scale: 0.85 },
  visible: (delay: number) => ({
    opacity: 1, y: 0, scale: 1,
    transition: { delay, duration: 0.6, type: 'spring', bounce: 0.35 },
  }),
}

export default function RoundEndScreen({ scores, isGameEnd, onAddPoint }: Props) {
  const menLeads = scores.men > scores.women
  const tied = scores.men === scores.women

  return (
    <div className="screen">
      <div className="round-end-center">
        <motion.h1
          className="round-end-title"
          initial={{ opacity: 0, y: -30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          {isGameEnd ? 'Гра завершена!' : 'Рахунок'}
        </motion.h1>

        <div className="score-cards">
          <motion.div
            className="score-card score-card-men"
            variants={cardVariants}
            custom={0.1}
            initial="hidden"
            animate="visible"
            onClick={() => onAddPoint('men')}
          >
            <div className="score-card-label">Чоловіки</div>
            <AnimatePresence mode="popLayout">
              <motion.div
                key={scores.men}
                className="score-card-value"
                initial={{ scale: 1.5, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ type: 'spring', bounce: 0.5, duration: 0.35 }}
              >
                {scores.men}
              </motion.div>
            </AnimatePresence>
          </motion.div>

          <motion.div
            className="score-card score-card-women"
            variants={cardVariants}
            custom={0.3}
            initial="hidden"
            animate="visible"
            onClick={() => onAddPoint('women')}
          >
            <div className="score-card-label">Жінки</div>
            <AnimatePresence mode="popLayout">
              <motion.div
                key={scores.women}
                className="score-card-value"
                initial={{ scale: 1.5, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ type: 'spring', bounce: 0.5, duration: 0.35 }}
              >
                {scores.women}
              </motion.div>
            </AnimatePresence>
          </motion.div>
        </div>

        {isGameEnd && !tied && (
          <motion.div
            className={`winner-banner ${menLeads ? 'winner-men' : 'winner-women'}`}
            initial={{ opacity: 0, scale: 0.7 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.8, type: 'spring', bounce: 0.5 }}
          >
            {menLeads ? '🏆 Перемогли чоловіки!' : '🏆 Перемогли жінки!'}
          </motion.div>
        )}
        {isGameEnd && tied && (
          <motion.div
            className="winner-banner winner-tie"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.8 }}
          >
            Нічия!
          </motion.div>
        )}
      </div>

      <div className="challenge-hints">
        <span className="hint-key">1</span><span className="hint-text">+1 Чоловіки</span>
        <span className="hint-sep" />
        <span className="hint-key">2</span><span className="hint-text">+1 Жінки</span>
        <span className="hint-sep" />
        <span className="hint-key">Space</span>
        <span className="hint-text">{isGameEnd ? 'Зіграти знову' : 'Далі'}</span>
      </div>
    </div>
  )
}
