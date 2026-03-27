// src/components/WaterBackground.jsx
// Surface d'eau nocturne — courbes remplies + reflets sur crêtes

import { useRef, useEffect } from 'react'

/* ── Couches d'eau — de la plus profonde à la surface ──────────────── */
const LAYERS = [
  // { freq, amp, speed, phase, y (0=top 1=bottom), fillAlpha, strokeAlpha, strokeW }
  { freq: 0.008, amp: 30, speed: 0.09, phase: 0.0, y: 0.40, fill: 0.06, stroke: 0.10, sw: 1.2 },
  { freq: 0.013, amp: 22, speed: 0.13, phase: 1.2, y: 0.48, fill: 0.07, stroke: 0.12, sw: 1.0 },
  { freq: 0.010, amp: 26, speed: 0.10, phase: 2.4, y: 0.54, fill: 0.08, stroke: 0.14, sw: 1.4 },
  { freq: 0.017, amp: 16, speed: 0.18, phase: 0.8, y: 0.60, fill: 0.09, stroke: 0.16, sw: 1.0 },
  { freq: 0.011, amp: 28, speed: 0.08, phase: 3.5, y: 0.65, fill: 0.10, stroke: 0.18, sw: 1.6 },
  { freq: 0.020, amp: 12, speed: 0.22, phase: 1.7, y: 0.70, fill: 0.11, stroke: 0.20, sw: 0.8 },
  { freq: 0.009, amp: 32, speed: 0.07, phase: 4.2, y: 0.76, fill: 0.13, stroke: 0.24, sw: 1.8 },
  { freq: 0.015, amp: 18, speed: 0.15, phase: 2.1, y: 0.82, fill: 0.15, stroke: 0.26, sw: 1.2 },
]

function getWaveY(layer, x, t, W) {
  const p  = t * layer.speed + layer.phase
  return (
    Math.sin(x * layer.freq + p)             * layer.amp +
    Math.sin(x * layer.freq * 1.6 - p * 0.7) * layer.amp * 0.40 +
    Math.sin(x * layer.freq * 0.5 + p * 0.3) * layer.amp * 0.25
  )
}

export default function WaterBackground() {
  const canvasRef = useRef(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    let animId, t = 0
    const mouse = { x: -9999, y: -9999 }

    const resize = () => {
      canvas.width  = window.innerWidth
      canvas.height = window.innerHeight
    }
    resize()
    window.addEventListener('resize', resize)

    const onMouseMove = (e) => { mouse.x = e.clientX; mouse.y = e.clientY }
    const onTouchMove = (e) => { mouse.x = e.touches[0].clientX; mouse.y = e.touches[0].clientY }
    window.addEventListener('mousemove', onMouseMove)
    window.addEventListener('touchmove', onTouchMove, { passive: true })

    const draw = () => {
      const W = canvas.width
      const H = canvas.height

      /* ── Fond ──────────────────────────────────────────────────── */
      ctx.fillStyle = '#010208'
      ctx.fillRect(0, 0, W, H)

      /* ── Lueur lune diffuse en haut-centre ─────────────────────── */
      const moonGrad = ctx.createRadialGradient(W * 0.5, 0, 0, W * 0.5, 0, H * 0.7)
      moonGrad.addColorStop(0,    'rgba(30,50,110,0.22)')
      moonGrad.addColorStop(0.35, 'rgba(15,28,65,0.10)')
      moonGrad.addColorStop(1,    'rgba(0,0,0,0)')
      ctx.fillStyle = moonGrad
      ctx.fillRect(0, 0, W, H)

      /* ── Couches d'eau ─────────────────────────────────────────── */
      LAYERS.forEach((layer) => {
        const baseY = layer.y * H

        // Perturbation douce au survol
        const yDist  = Math.abs(mouse.y - baseY)
        const mBoost = Math.max(0, 1 - yDist / (H * 0.15)) * 0.6

        /* Calcul des points de la vague */
        const pts = []
        for (let x = 0; x <= W; x += 3) {
          const xDist   = Math.abs(x - mouse.x)
          const mxBoost = Math.max(0, 1 - xDist / 200) * mBoost
          const dy = getWaveY(layer, x, t, W) * (1 + mxBoost * 0.4)
          pts.push({ x, y: baseY + dy })
        }

        /* ── Remplissage (eau en dessous de la vague) ───────────── */
        ctx.beginPath()
        ctx.moveTo(0, H)
        pts.forEach(p => ctx.lineTo(p.x, p.y))
        ctx.lineTo(W, H)
        ctx.closePath()

        const fillGrad = ctx.createLinearGradient(0, baseY - layer.amp, 0, H)
        fillGrad.addColorStop(0,   `rgba(20,45,100,${layer.fill})`)
        fillGrad.addColorStop(0.4, `rgba(10,25,60, ${layer.fill * 0.7})`)
        fillGrad.addColorStop(1,   `rgba(1,3,15,  ${layer.fill * 0.4})`)
        ctx.fillStyle = fillGrad
        ctx.fill()

        /* ── Contour de la vague (crête) ────────────────────────── */
        ctx.beginPath()
        pts.forEach((p, i) => i === 0 ? ctx.moveTo(p.x, p.y) : ctx.lineTo(p.x, p.y))
        const alphaBoost = 1 + mBoost * 0.5
        ctx.strokeStyle = `rgba(70,120,210,${(layer.stroke * alphaBoost).toFixed(3)})`
        ctx.lineWidth   = layer.sw
        ctx.stroke()

        /* ── Reflets scintillants sur les crêtes ────────────────── */
        if (layer.y > 0.5) {
          for (let i = 1; i < pts.length - 1; i++) {
            const prev = pts[i - 1], curr = pts[i], next = pts[i + 1]
            // Détecte les pics locaux (crête)
            if (curr.y < prev.y && curr.y < next.y) {
              const shimmerPhase = Math.sin(t * 2.5 + curr.x * 0.03)
              if (shimmerPhase > 0.55) {
                const shimA = (shimmerPhase - 0.55) / 0.45 * 0.35 * (layer.y - 0.5) * 2
                ctx.beginPath()
                ctx.arc(curr.x, curr.y, 1.2 + shimmerPhase, 0, Math.PI * 2)
                ctx.fillStyle = `rgba(160,200,255,${shimA.toFixed(3)})`
                ctx.fill()
              }
            }
          }
        }
      })

      /* ── Brume ─────────────────────────────────────────────────── */
      // Haut de l'image
      const topFog = ctx.createLinearGradient(0, 0, 0, H * 0.35)
      topFog.addColorStop(0,   'rgba(1,2,8,0.95)')
      topFog.addColorStop(1,   'rgba(1,2,8,0.0)')
      ctx.fillStyle = topFog
      ctx.fillRect(0, 0, W, H)

      // Bas de l'image
      const botFog = ctx.createLinearGradient(0, H * 0.82, 0, H)
      botFog.addColorStop(0,   'rgba(1,2,8,0.0)')
      botFog.addColorStop(1,   'rgba(1,2,8,0.90)')
      ctx.fillStyle = botFog
      ctx.fillRect(0, 0, W, H)

      t += 0.008
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
