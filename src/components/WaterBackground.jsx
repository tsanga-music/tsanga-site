// src/components/WaterBackground.jsx
// Pattern grille de points en scroll infini — inspiré Adam Abundis

import { useRef, useEffect } from 'react'

export default function WaterBackground() {
  const canvasRef = useRef(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    let animId
    let offset = 0
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

    const GRID   = 38   // espacement de la grille
    const DOT_R  = 1.0  // rayon des points
    const SPEED  = 0.35 // vitesse de défilement (diagonal ↘)

    const draw = () => {
      const W = canvas.width
      const H = canvas.height

      ctx.clearRect(0, 0, W, H)

      // Fond
      ctx.fillStyle = '#010208'
      ctx.fillRect(0, 0, W, H)

      const off = offset % GRID

      // Points en grille
      for (let x = -GRID + off; x < W + GRID; x += GRID) {
        for (let y = -GRID + off; y < H + GRID; y += GRID) {

          // Distance du centre → vignette
          const dx  = x - W / 2
          const dy  = y - H / 2
          const distCenter = Math.sqrt(dx * dx + dy * dy)
          const maxDist    = Math.sqrt((W / 2) ** 2 + (H / 2) ** 2)
          const vigFactor  = Math.max(0, 1 - distCenter / (maxDist * 0.85))

          // Distance souris → glow
          const mx = x - mouse.x
          const my = y - mouse.y
          const distMouse  = Math.sqrt(mx * mx + my * my)
          const mouseGlow  = Math.max(0, 1 - distMouse / 130) ** 2

          const alpha = 0.07 + 0.18 * vigFactor + 0.55 * mouseGlow
          const radius = DOT_R + 1.8 * mouseGlow

          ctx.beginPath()
          ctx.arc(x, y, radius, 0, Math.PI * 2)
          ctx.fillStyle = `rgba(74,143,255,${alpha.toFixed(3)})`
          ctx.fill()
        }
      }

      // Lignes de grille très subtiles
      ctx.strokeStyle = 'rgba(74,143,255,0.025)'
      ctx.lineWidth = 0.5
      const offL = offset % GRID
      for (let x = -GRID + offL; x < W + GRID; x += GRID) {
        ctx.beginPath(); ctx.moveTo(x, 0); ctx.lineTo(x, H); ctx.stroke()
      }
      for (let y = -GRID + offL; y < H + GRID; y += GRID) {
        ctx.beginPath(); ctx.moveTo(0, y); ctx.lineTo(W, y); ctx.stroke()
      }

      // Vignette radiale douce par-dessus
      const grad = ctx.createRadialGradient(W / 2, H / 2, 0, W / 2, H / 2, Math.hypot(W, H) * 0.62)
      grad.addColorStop(0,    'rgba(1,2,8,0)')
      grad.addColorStop(0.55, 'rgba(1,2,8,0.35)')
      grad.addColorStop(1,    'rgba(1,2,8,0.88)')
      ctx.fillStyle = grad
      ctx.fillRect(0, 0, W, H)

      offset += SPEED
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
