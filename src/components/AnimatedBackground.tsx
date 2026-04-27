import { useEffect, useRef } from 'react'

const CIRCLE_SIZE = 44
const GAP = 20
const CELL = CIRCLE_SIZE + GAP
const RADIUS = CIRCLE_SIZE / 2
const BLUE: [number, number, number] = [0, 229, 255]
const PINK: [number, number, number] = [255, 0, 153]

export default function AnimatedBackground() {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    if (!ctx) return

    let animId: number
    let lastTime = 0

    function resize() {
      canvas.width = window.innerWidth
      canvas.height = window.innerHeight
    }
    resize()
    window.addEventListener('resize', resize)

    function draw(time: number) {
      animId = requestAnimationFrame(draw)
      // cap at ~30 fps to ease load on slow devices
      if (time - lastTime < 32) return
      lastTime = time

      const w = canvas.width
      const h = canvas.height
      ctx.clearRect(0, 0, w, h)

      const cols = Math.ceil(w / CELL) + 1
      const rows = Math.ceil(h / CELL) + 1

      for (let row = 0; row < rows; row++) {
        for (let col = 0; col < cols; col++) {
          const startBlue = (col + row) % 2 === 0
          const phase = ((col * 3 + row * 7) % 20) / 20
          const t = (Math.sin((time / 4000 + phase) * Math.PI * 2) + 1) / 2

          const [fr, fg, fb] = startBlue ? BLUE : PINK
          const [tr, tg, tb] = startBlue ? PINK : BLUE

          const r = (fr + (tr - fr) * t) | 0
          const g = (fg + (tg - fg) * t) | 0
          const b = (fb + (tb - fb) * t) | 0

          ctx.fillStyle = `rgba(${r},${g},${b},0.7)`
          ctx.beginPath()
          ctx.arc(col * CELL + RADIUS + 4, row * CELL + RADIUS + 4, RADIUS, 0, Math.PI * 2)
          ctx.fill()
        }
      }
    }

    animId = requestAnimationFrame(draw)
    return () => {
      cancelAnimationFrame(animId)
      window.removeEventListener('resize', resize)
    }
  }, [])

  return <canvas ref={canvasRef} className="animated-bg-canvas" aria-hidden="true" />
}
