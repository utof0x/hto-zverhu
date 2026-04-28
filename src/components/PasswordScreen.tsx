import { useState, useEffect } from 'react'

const PASSWORD = '12346'

interface Props {
  onUnlock: () => void
}

export default function PasswordScreen({ onUnlock }: Props) {
  const [input, setInput] = useState('')
  const [shake, setShake] = useState(false)

  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if (e.key >= '0' && e.key <= '9') {
        setInput((prev) => {
          const next = prev + e.key
          if (next === PASSWORD) {
            onUnlock()
            return ''
          }
          if (next.length >= PASSWORD.length) {
            setShake(true)
            setTimeout(() => setShake(false), 500)
            return ''
          }
          return next
        })
      }
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [onUnlock])

  return (
    <div className="screen">
      <div className={`password-box ${shake ? 'password-shake' : ''}`}>
        {Array.from({ length: PASSWORD.length }, (_, i) => (
          <div key={i} className={`password-dot ${i < input.length ? 'password-dot-filled' : ''}`} />
        ))}
      </div>

    </div>
  )
}
