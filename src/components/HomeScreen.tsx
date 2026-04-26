import { motion } from 'framer-motion'

export default function HomeScreen() {
  return (
    <div className="screen">
      <div className="round-start-center">
        <motion.div
          className="round-block round-label"
          initial={{ opacity: 0, scale: 0.7, y: 40 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          transition={{ duration: 0.6, type: 'spring', bounce: 0.4 }}
        >
          Хто зверху?
        </motion.div>
      </div>
      <motion.p
        className="keyboard-hint"
        initial={{ opacity: 0 }}
        animate={{ opacity: 0.5 }}
        transition={{ delay: 1, duration: 0.8 }}
      >
        Натисніть Space щоб розпочати
      </motion.p>
    </div>
  )
}
