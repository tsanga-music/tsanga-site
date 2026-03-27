// src/components/WaterBackground.jsx
// Surface d'eau nocturne — ondes sinusoïdales calmes, tons bleu-nuit
// Référence : loop night waveform ocean (calm, dark, quiet)

import { useRef, useEffect } from 'react'

/* Couches d'ondes empilées — chacune a sa propre freq / amplitude / vitesse */
const WAVE_LAYERS = [
  { freq: 0.012, amp: 18, speed: 0.28, y: 0.38, alpha: 0.18, width: 1.2 },
  { freq: 0.018, amp: 12, speed: 0.19, y: 0.44, alpha: 0.22, width: 1.0 },
  { freq: 0.009, amp: 28, speed: 0.14, y: 0.50, alpha: 0.28, width: 1.5 },
  { freq: 0.022, amp:  9, speed: 0.35, y: 0.55, alpha: 0.18, width: 0.8 },
  { freq: 0.014, amp: 20, speed: 0.10, y: 0.60, alpha: 0.32, width: 1.8 },
  { freq: 0.010, amp: 14, speed: 0.22, y: 0.65, alpha: 0.20, width: 1.0 },
  { freq: 0.020, amp:  8, speed: 0.40, y: 0.70, alpha: 0.15, width: 0.7 },
  { freq: 0.007, amp: 32, speed: 0.08, y: 0.75, alpha: 0.25, width: 2.0 },
  { freq: 0.016, amp: 10, speed: 0.30, y: 0.80, alpha: 0.18, width: 0.9 },
  { freq: 0.011, amp: 22, speed: 0.16, y: 0.88, alpha: 0.22, width: 1.4 },
]

export default function WaterBackground() {
  const canvasRef = useRef(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    let animId
    let t = 0
    const mouse = { x: -9999, y: -9999 }

    const resize = () => {
      canvas.width  = window.innerWidth
      canvas.height = window.innerHeight
    }
    resize()
    window.addEventListener('resize', resize)

    const onMouseMove = (e) => { mouse.x = e.clientX; mouse.y = e.clientY }
    const onTouchMove = (e) => {
      mouse.x = e.touches[0].clientX
      mouse.y = e.touches[0].clientY
    }
    window.addEventListener('mousemove', onMouseMove)
    window.addEventListener('touchmove', onTouchMove, { passive: true })

    const draw = () => {
      const W = canvas.width
      const H = canvas.height

      // Fond noir bleuté
      ctx.fillStyle = '#01020c'
      ctx.fillRect(0, 0, W, H)

      // Lueur subtile au centre (reflet de lune diffus)
      const moonGrad = ctx.createRadialGradient(W * 0.5, H * 0.3, 0, W * 0.5, H * 0.3, W * 0.45)
      moonGrad.addColorStop(0,    'rgba(40,60,120,0.12)')
      moonGrad.addColorStop(0.5,  'rgba(20,35,80,0.06)')
      moonGrad.addColorStop(1,    'rgba(0,0,0,0)')
      ctx.fillStyle = moonGrad
      ctx.fillRect(0, 0, W, H)

      // ── Dessin des ondes ──────────────────────────────────────────
      WAVE_LAYERS.forEach((layer) => {
        const baseY = layer.y * H
        const phase = t * layer.speed

        // Perturbation douce autour de la souris
        const mouseDist = Math.abs(mouse.y - baseY)
        const mouseInfluence = Math.max(0, 1 - mouseDist / (H * 0.18))
        const ampBoost = 1 + mouseInfluence * 1.4
        const alphaBoost = 1 + mouseInfluence * 0.8

        ctx.beginPath()

        for (let x = 0; x <= W; x += 2) {
          // Perturbation horizontale autour du curseur
          const mxDist   = Math.abs(x - mouse.x)
          const mxFactor = Math.max(0, 1 - mxDist / 160) * mouseInfluence
          const distortion = Math.sin((x - mouse.x) * 0.05 + t * 2) * 6 * mxFactor

          const y = baseY
            + Math.sin(x * layer.freq + phase) * layer.amp * ampBoost
            + Math.sin(x * layer.freq * 1.7 - phase * 0.6) * layer.amp * 0.35 * ampBoost
            + distortion

          x === 0 ? ctx.moveTo(x, y) : ctx.lineTo(x, y)
        }

        // Trait de l'onde
        ctx.strokeStyle = `rgba(60,110,200,${(layer.alpha * alphaBoost).toFixed(3)})`
        ctx.lineWidth   = layer.width
        ctx.stroke()

        // Remplissage de l'eau sous l'onde (profondeur)
        ctx.lineTo(W, H)
        ctx.lineTo(0, H)
        ctx.closePath()
        ctx.fillStyle = `rgba(2,4,18,${(layer.alpha * 0.25).toFixed(3)})`
        ctx.fill()
      })

      // Brume / mist overlay — gradient du haut vers le bas
      const mistGrad = ctx.createLinearGradient(0, 0, 0, H)
      mistGrad.addColorStop(0,    'rgba(1,2,12,0.85)')
      mistGrad.addColorStop(0.28, 'rgba(1,2,12,0.15)')
      mistGrad.addColorStop(0.55, 'rgba(1,2,12,0.05)')
      mistGrad.addColorStop(1,    'rgba(1,2,12,0.70)')
      ctx.fillStyle = mistGrad
      ctx.fillRect(0, 0, W, H)

      t += 0.012
      animId = requestAnimationFrame(draw)
    }

    draw()

    return () => {
      cancelAnimationFrame(animId)
      window.removeEventListener('resize', resize)
      window.removeEventListener('mousemove', onMouseMove)
      window.removeEventListener('touchmove', onTouchMove)
    }
  }, [])

  return (
    <canvas
      ref={canvasRef}
      style={{
        position: 'fixed',
        top: 0, left: 0,
        width: '100vw',
        height: '100vh',
        zIndex: 0,
        pointerEvents: 'none',
        display: 'block',
      }}
    />
  )
}
