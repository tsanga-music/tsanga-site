// src/components/WaterBackground.jsx
// Surface d'eau nocturne — éclats de lumière argentés sur fond noir
// Ref : eausurface.gif — reflets scintillants haute-contrast

import { useRef, useEffect } from 'react'

/* ── Bruit 2D simple (valeur interpolée) ──────────────────────────── */
function hash(x, y) {
  const n = Math.sin(x * 127.1 + y * 311.7) * 43758.5453
  return n - Math.floor(n)
}
function noise(x, y) {
  const ix = Math.floor(x), iy = Math.floor(y)
  const fx = x - ix, fy = y - iy
  const ux = fx * fx * (3 - 2 * fx)
  const uy = fy * fy * (3 - 2 * fy)
  return (
    hash(ix,   iy)   * (1-ux) * (1-uy) +
    hash(ix+1, iy)   * ux     * (1-uy) +
    hash(ix,   iy+1) * (1-ux) * uy     +
    hash(ix+1, iy+1) * ux     * uy
  )
}

/* ── Génère les éclats de lumière au démarrage ────────────────────── */
function makeFlecks(count) {
  return Array.from({ length: count }, (_, i) => {
    // Concentre les reflets dans les 2/3 inférieurs avec variation de densité
    const band = Math.random()
    const yBase = band < 0.6
      ? 0.38 + Math.random() * 0.45   // zone principale (centre-bas)
      : 0.20 + Math.random() * 0.65   // quelques éclats plus haut

    return {
      xRel:       Math.random(),
      yRel:       yBase,
      w:          8  + Math.random() * 55,   // longueur variable
      h:          0.8 + Math.random() * 3.2, // très fin
      angle:      (Math.random() - 0.5) * 0.5,
      maxAlpha:   0.35 + Math.random() * 0.65,
      speed:      0.3  + Math.random() * 1.2,
      phase:      Math.random() * Math.PI * 2,
      driftX:     (Math.random() - 0.5) * 0.0003,
      driftY:     (Math.random() - 0.5) * 0.0001,
      noiseScale: 2 + Math.random() * 4,
    }
  })
}

const FLECKS = makeFlecks(220)

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

      // Fond noir pur
      ctx.fillStyle = '#000004'
      ctx.fillRect(0, 0, W, H)

      // Reflet de lune diffus — très subtil, bande centrale
      const moonGrad = ctx.createLinearGradient(0, H * 0.3, 0, H * 0.75)
      moonGrad.addColorStop(0,   'rgba(8,10,28,0.0)')
      moonGrad.addColorStop(0.4, 'rgba(12,18,40,0.12)')
      moonGrad.addColorStop(1,   'rgba(2,4,12,0.0)')
      ctx.fillStyle = moonGrad
      ctx.fillRect(0, 0, W, H)

      // ── Éclats de lumière ─────────────────────────────────────────
      FLECKS.forEach((f) => {
        // Position avec légère dérive
        const x = ((f.xRel + f.driftX * t * 1000) % 1) * W
        const y = (f.yRel  + f.driftY * t * 1000) * H

        // Bruit de scintillement (animé dans le temps)
        const nv = noise(
          f.xRel * f.noiseScale + t * f.speed * 0.4,
          f.yRel * f.noiseScale + t * f.speed * 0.2
        )

        // Seuil haut-contraste — seuls les éclats brillants sont visibles
        const threshold = 0.42
        if (nv < threshold) return

        // Intensité : pic sur les valeurs proches de 1
        const intensity = Math.pow((nv - threshold) / (1 - threshold), 1.4)

        // Bonus souris — les éclats proches du curseur s'illuminent
        const dx = x - mouse.x, dy = y - mouse.y
        const distMouse = Math.sqrt(dx*dx + dy*dy)
        const mouseBonus = Math.max(0, 1 - distMouse / 160) * 0.6

        const alpha = Math.min(1, f.maxAlpha * intensity + mouseBonus)

        // Couleur : blanc froid légèrement bleuté (comme argent sur eau)
        const lum = Math.round(200 + intensity * 55)
        ctx.save()
        ctx.translate(x, y)
        ctx.rotate(f.angle + Math.sin(t * f.speed * 0.5 + f.phase) * 0.08)
        ctx.globalAlpha = alpha

        // Éclat principal
        ctx.beginPath()
        ctx.ellipse(0, 0, f.w * 0.5, f.h * 0.5, 0, 0, Math.PI * 2)
        ctx.fillStyle = `rgb(${lum},${lum},${Math.round(lum * 1.06)})`
        ctx.fill()

        // Petit halo diffus (depth)
        if (intensity > 0.6) {
          ctx.globalAlpha = alpha * 0.3
          ctx.beginPath()
          ctx.ellipse(0, 0, f.w * 0.75, f.h * 1.8, 0, 0, Math.PI * 2)
          ctx.fillStyle = `rgba(180,200,255,0.4)`
          ctx.fill()
        }

        ctx.restore()
      })

      // ── Vague de profondeur — 2 traits horizontaux très subtils ───
      ;[0.52, 0.68].forEach((yp, i) => {
        const baseY = yp * H
        ctx.beginPath()
        for (let x = 0; x <= W; x += 3) {
          const y = baseY
            + Math.sin(x * 0.008 + t * 0.18 + i) * 12
            + Math.sin(x * 0.015 - t * 0.12) * 6
          x === 0 ? ctx.moveTo(x, y) : ctx.lineTo(x, y)
        }
        ctx.strokeStyle = 'rgba(60,80,140,0.07)'
        ctx.lineWidth = 1
        ctx.stroke()
      })

      // Brume — bords + haut de l'image
      const topMist = ctx.createLinearGradient(0, 0, 0, H * 0.4)
      topMist.addColorStop(0,   'rgba(0,0,4,0.95)')
      topMist.addColorStop(0.6, 'rgba(0,0,4,0.0)')
      ctx.fillStyle = topMist
      ctx.fillRect(0, 0, W, H)

      const botMist = ctx.createLinearGradient(0, H * 0.75, 0, H)
      botMist.addColorStop(0, 'rgba(0,0,4,0.0)')
      botMist.addColorStop(1, 'rgba(0,0,4,0.85)')
      ctx.fillStyle = botMist
      ctx.fillRect(0, 0, W, H)

      t += 0.007
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
