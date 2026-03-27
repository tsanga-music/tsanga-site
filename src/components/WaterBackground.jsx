// src/components/WaterBackground.jsx
// Surface d'eau nocturne plein écran — gris/blanc, ondulations souris visibles

import { useRef, useEffect } from 'react'

/* ── 14 couches sur toute la hauteur de l'écran ───────────────────── */
const LAYERS = [
  { freq: 0.007, amp: 34, speed: 0.13, ph: 0.0,  y: 0.04 },
  { freq: 0.011, amp: 28, speed: 0.18, ph: 1.3,  y: 0.12 },
  { freq: 0.009, amp: 38, speed: 0.15, ph: 2.6,  y: 0.20 },
  { freq: 0.014, amp: 26, speed: 0.24, ph: 0.9,  y: 0.28 },
  { freq: 0.008, amp: 44, speed: 0.13, ph: 3.8,  y: 0.36 },
  { freq: 0.016, amp: 22, speed: 0.28, ph: 1.5,  y: 0.44 },
  { freq: 0.010, amp: 40, speed: 0.17, ph: 4.1,  y: 0.52 },
  { freq: 0.013, amp: 32, speed: 0.21, ph: 2.2,  y: 0.59 },
  { freq: 0.018, amp: 20, speed: 0.33, ph: 0.5,  y: 0.66 },
  { freq: 0.008, amp: 46, speed: 0.11, ph: 3.3,  y: 0.73 },
  { freq: 0.015, amp: 28, speed: 0.26, ph: 1.1,  y: 0.80 },
  { freq: 0.010, amp: 36, speed: 0.18, ph: 4.7,  y: 0.86 },
  { freq: 0.012, amp: 24, speed: 0.22, ph: 2.8,  y: 0.92 },
  { freq: 0.009, amp: 32, speed: 0.14, ph: 0.3,  y: 0.97 },
]

export default function WaterBackground() {
  const canvasRef = useRef(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    let animId, t = 0

    // Mouse state
    const mouse  = { x: -9999, y: -9999 }
    const prev   = { x: -9999, y: -9999 }
    const vel    = { x: 0, y: 0 }          // velocity
    const ripples = []                      // liste de ripples actifs

    const resize = () => {
      canvas.width  = window.innerWidth
      canvas.height = window.innerHeight
    }
    resize()
    window.addEventListener('resize', resize)

    const onMouseMove = (e) => {
      vel.x = e.clientX - mouse.x
      vel.y = e.clientY - mouse.y
      prev.x = mouse.x; prev.y = mouse.y
      mouse.x = e.clientX; mouse.y = e.clientY

      const speed = Math.sqrt(vel.x**2 + vel.y**2)
      if (speed > 2) {
        ripples.push({
          x: mouse.x, y: mouse.y,
          r: 0, maxR: 80 + speed * 3,
          alpha: Math.min(0.7, speed * 0.03),
          born: t,
        })
        if (ripples.length > 18) ripples.shift()
      }
    }
    const onTouchMove = (e) => {
      const touch = e.touches[0]
      vel.x = touch.clientX - mouse.x
      vel.y = touch.clientY - mouse.y
      mouse.x = touch.clientX; mouse.y = touch.clientY
      const speed = Math.sqrt(vel.x**2 + vel.y**2)
      if (speed > 1) {
        ripples.push({ x: mouse.x, y: mouse.y, r: 0, maxR: 100 + speed * 4, alpha: 0.5, born: t })
        if (ripples.length > 12) ripples.shift()
      }
    }
    window.addEventListener('mousemove', onMouseMove)
    window.addEventListener('touchmove', onTouchMove, { passive: true })

    const draw = () => {
      const W = canvas.width
      const H = canvas.height

      /* Fond presque noir, teinte très légèrement froide */
      ctx.fillStyle = '#020305'
      ctx.fillRect(0, 0, W, H)

      /* Lueur lune très diffuse — centre haut */
      const lg = ctx.createRadialGradient(W * 0.5, -H * 0.1, 0, W * 0.5, -H * 0.1, H * 0.9)
      lg.addColorStop(0,   'rgba(50,60,80,0.18)')
      lg.addColorStop(0.5, 'rgba(20,26,40,0.06)')
      lg.addColorStop(1,   'rgba(0,0,0,0)')
      ctx.fillStyle = lg
      ctx.fillRect(0, 0, W, H)

      /* ── Vagues plein écran ──────────────────────────────────────── */
      LAYERS.forEach((layer, li) => {
        const baseY = layer.y * H
        const progress = layer.y                     // 0=haut → 1=bas
        const brightness = 0.12 + progress * 0.22   // plus lumineux en bas

        /* Zone d'influence souris sur cette vague */
        const yDist  = Math.abs(mouse.y - baseY)
        const mInflY = Math.max(0, 1 - yDist / (H * 0.20))

        /* Points de la vague */
        const pts = []
        const step = 3
        for (let x = 0; x <= W; x += step) {
          const p  = t * layer.speed + layer.ph
          let dy  = Math.sin(x * layer.freq + p)             * layer.amp
                  + Math.sin(x * layer.freq * 1.7 - p * 0.6) * layer.amp * 0.38
                  + Math.sin(x * layer.freq * 0.5 + p * 0.3) * layer.amp * 0.20

          /* Déformation souris — visible et organique */
          if (mInflY > 0) {
            const xDist   = Math.abs(x - mouse.x)
            const mInflX  = Math.max(0, 1 - xDist / 220)
            const mEffect = mInflY * mInflX
            // Creux au passage de la souris, crêtes latérales
            const push = Math.sin((x - mouse.x) * 0.025) * vel.y * 0.35 * mEffect
            const dip  = -Math.exp(-(xDist**2) / (2 * 110**2)) * mInflY * 28
            dy += push + dip
          }

          pts.push({ x, y: baseY + dy })
        }

        /* Remplissage dessous la vague */
        ctx.beginPath()
        ctx.moveTo(0, H)
        pts.forEach(p => ctx.lineTo(p.x, p.y))
        ctx.lineTo(W, H)
        ctx.closePath()

        const fg = ctx.createLinearGradient(0, baseY - layer.amp, 0, H)
        const b  = brightness
        fg.addColorStop(0,   `rgba(${Math.round(b*120)},${Math.round(b*130)},${Math.round(b*145)},${(b * 0.7).toFixed(2)})`)
        fg.addColorStop(0.5, `rgba(5,7,14,${(b * 0.4).toFixed(2)})`)
        fg.addColorStop(1,   'rgba(2,3,5,0.0)')
        ctx.fillStyle = fg
        ctx.fill()

        /* Crête — trait gris/blanc */
        ctx.beginPath()
        pts.forEach((p, i) => i === 0 ? ctx.moveTo(p.x, p.y) : ctx.lineTo(p.x, p.y))
        const strokeA = (brightness * 1.6 + mInflY * 0.25).toFixed(3)
        ctx.strokeStyle = `rgba(180,190,205,${strokeA})`
        ctx.lineWidth   = 0.8 + progress * 0.8
        ctx.stroke()

        /* Scintillements blancs sur les crêtes locales */
        for (let i = 2; i < pts.length - 2; i += 3) {
          const p = pts[i]
          if (p.y < pts[i-1].y && p.y < pts[i+1].y) {
            const shimA = Math.max(0, Math.sin(t * 3 + p.x * 0.05 + li)) * brightness * 0.55
            if (shimA > 0.03) {
              ctx.beginPath()
              ctx.arc(p.x, p.y, 0.9 + shimA * 3, 0, Math.PI * 2)
              ctx.fillStyle = `rgba(215,220,230,${shimA.toFixed(3)})`
              ctx.fill()
            }
          }
        }
      })

      /* ── Courbes verticales (colonnes d'eau) ─────────────────────── */
      const VCOLS = 18
      for (let ci = 0; ci < VCOLS; ci++) {
        const baseX  = (ci / (VCOLS - 1)) * W
        const freq   = 0.008 + (ci % 4) * 0.003
        const amp    = 24 + (ci % 5) * 10
        const speed  = 0.12 + (ci % 6) * 0.04
        const ph     = ci * 0.88
        const progress = ci / (VCOLS - 1)
        const brightness = 0.09 + progress * 0.12

        /* Zone d'influence souris sur cette colonne */
        const xDist  = Math.abs(mouse.x - baseX)
        const mInflX = Math.max(0, 1 - xDist / (W * 0.18))

        const vpts = []
        const vstep = 3
        for (let y = 0; y <= H; y += vstep) {
          const p   = t * speed + ph
          let dx    = Math.sin(y * freq + p)              * amp
                    + Math.sin(y * freq * 1.8 - p * 0.6)  * amp * 0.42
                    + Math.sin(y * freq * 0.5 + p * 0.35) * amp * 0.22
                    + Math.sin(y * freq * 2.5 + p * 0.8)  * amp * 0.12

          if (mInflX > 0) {
            const yDist2  = Math.abs(y - mouse.y)
            const mInflY2 = Math.max(0, 1 - yDist2 / 260)
            const push2   = Math.sin((y - mouse.y) * 0.025) * vel.x * 0.45 * mInflX * mInflY2
            const dip2    = -Math.exp(-(yDist2**2) / (2 * 130**2)) * mInflX * 32
            dx += push2 + dip2
          }

          vpts.push({ x: baseX + dx, y })
        }

        ctx.beginPath()
        vpts.forEach((p, i) => i === 0 ? ctx.moveTo(p.x, p.y) : ctx.lineTo(p.x, p.y))
        const strokeAv = (brightness * 1.6 + mInflX * 0.22).toFixed(3)
        ctx.strokeStyle = `rgba(170,182,200,${strokeAv})`
        ctx.lineWidth   = 0.7 + progress * 0.6
        ctx.stroke()
      }

      /* ── Ripples souris ──────────────────────────────────────────── */
      for (let i = ripples.length - 1; i >= 0; i--) {
        const rp = ripples[i]
        rp.r += 2.4
        const life  = rp.r / rp.maxR
        const alpha = rp.alpha * (1 - life) * (1 - life)

        if (alpha > 0.005) {
          ctx.beginPath()
          ctx.ellipse(rp.x, rp.y, rp.r, rp.r * 0.35, 0, 0, Math.PI * 2)
          ctx.strokeStyle = `rgba(200,210,225,${alpha.toFixed(3)})`
          ctx.lineWidth   = 1.2 * (1 - life * 0.7)
          ctx.stroke()

          /* Second anneau décalé */
          if (rp.r > 12) {
            ctx.beginPath()
            ctx.ellipse(rp.x, rp.y, rp.r * 0.6, rp.r * 0.6 * 0.35, 0, 0, Math.PI * 2)
            ctx.strokeStyle = `rgba(200,210,225,${(alpha * 0.5).toFixed(3)})`
            ctx.lineWidth   = 0.8
            ctx.stroke()
          }
        } else {
          ripples.splice(i, 1)
        }
      }

      /* Reflet lumineux autour du curseur */
      if (mouse.x > 0) {
        const rg = ctx.createRadialGradient(mouse.x, mouse.y, 0, mouse.x, mouse.y, 90)
        rg.addColorStop(0,   'rgba(200,210,230,0.10)')
        rg.addColorStop(0.4, 'rgba(150,165,190,0.04)')
        rg.addColorStop(1,   'rgba(0,0,0,0)')
        ctx.fillStyle = rg
        ctx.fillRect(0, 0, W, H)
      }

      t += 0.014
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
