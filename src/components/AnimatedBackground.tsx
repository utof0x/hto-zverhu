import { useState, useEffect, useMemo } from 'react'

const CIRCLE_SIZE = 42 // px
const GAP = 20 // px
const CELL = CIRCLE_SIZE + GAP

export default function AnimatedBackground() {
  const [cols, setCols] = useState(0)
  const [rows, setRows] = useState(0)

  useEffect(() => {
    function update() {
      setCols(Math.ceil(window.innerWidth / CELL) + 1)
      setRows(Math.ceil(window.innerHeight / CELL) + 1)
    }
    update()
    window.addEventListener('resize', update)
    return () => window.removeEventListener('resize', update)
  }, [])

  const circles = useMemo(() => {
    const total = cols * rows
    return Array.from({ length: total }, (_, i) => {
      const col = i % cols
      const row = Math.floor(i / cols)
      const startBlue = (col + row) % 2 === 0
      return {
        id: i,
        startBlue,
        delay: -(Math.random() * 4),
      }
    })
  }, [cols, rows])

  return (
    <div
      className="animated-bg"
      style={{ gridTemplateColumns: `repeat(${cols}, ${CIRCLE_SIZE}px)` }}
      aria-hidden="true"
    >
      {circles.map((c) => (
        <div
          key={c.id}
          className={`bg-circle ${c.startBlue ? 'starts-blue' : 'starts-pink'}`}
          style={{ animationDelay: `${c.delay}s` }}
        />
      ))}
    </div>
  )
}
