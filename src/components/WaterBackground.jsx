// src/components/WaterBackground.jsx
// Vue de dessus sur eau noire — reflet de lune suit la souris / le doigt

import { useRef, useMemo, useEffect } from 'react'
import { Canvas, useFrame, useThree } from '@react-three/fiber'
import * as THREE from 'three'

function WaterSurface() {
  const mesh = useRef()
  const mouse = useRef(new THREE.Vector2(0.5, 0.5))
  const targetMouse = useRef(new THREE.Vector2(0.5, 0.5))
  const { size } = useThree()

  // Suivi souris sur le DOM (pas via Three.js pour plus de fiabilité)
  useEffect(() => {
    const handleMouseMove = (e) => {
      targetMouse.current.set(
        e.clientX / window.innerWidth,
        1.0 - e.clientY / window.innerHeight
      )
    }
    const handleTouchMove = (e) => {
      const touch = e.touches[0]
      targetMouse.current.set(
        touch.clientX / window.innerWidth,
        1.0 - touch.clientY / window.innerHeight
      )
    }
    window.addEventListener('mousemove', handleMouseMove)
    window.addEventListener('touchmove', handleTouchMove, { passive: true })
    return () => {
      window.removeEventListener('mousemove', handleMouseMove)
      window.removeEventListener('touchmove', handleTouchMove)
    }
  }, [])

  const uniforms = useMemo(() => ({
    uTime:       { value: 0 },
    uMouse:      { value: new THREE.Vector2(0.5, 0.5) },
    uResolution: { value: new THREE.Vector2(size.width, size.height) }
  }), []) // eslint-disable-line react-hooks/exhaustive-deps

  const vertexShader = `
    varying vec2 vUv;
    void main() {
      vUv = uv;
      gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
    }
  `

  const fragmentShader = `
    uniform float uTime;
    uniform vec2  uMouse;
    uniform vec2  uResolution;
    varying vec2  vUv;

    // Hash pour pseudo-aléatoire
    float hash(vec2 p) {
      return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453);
    }

    // Noise 2D smooth
    float noise(vec2 p) {
      vec2 i = floor(p);
      vec2 f = fract(p);
      vec2 u = f * f * (3.0 - 2.0 * f);
      return mix(
        mix(hash(i + vec2(0,0)), hash(i + vec2(1,0)), u.x),
        mix(hash(i + vec2(0,1)), hash(i + vec2(1,1)), u.x),
        u.y
      );
    }

    // FBM — turbulence fractale pour la surface de l'eau
    float fbm(vec2 p) {
      float val = 0.0;
      float amp = 0.5;
      float freq = 1.0;
      for (int i = 0; i < 6; i++) {
        val += amp * noise(p * freq);
        amp  *= 0.5;
        freq *= 2.1;
        p    += vec2(0.3, 0.7);
      }
      return val;
    }

    void main() {
      vec2 uv = vUv;

      // Aspect ratio correct
      float aspect = uResolution.x / uResolution.y;
      vec2 uvAspect = vec2(uv.x * aspect, uv.y);

      // --- Surface de l'eau ---
      float t = uTime * 0.18;
      vec2 flow1 = vec2(t * 0.7,  t * 0.3);
      vec2 flow2 = vec2(-t * 0.4, t * 0.5);
      vec2 flow3 = vec2(t * 0.2, -t * 0.6);

      float water  = fbm(uvAspect * 3.5 + flow1);
      water       += fbm(uvAspect * 6.0 + flow2) * 0.5;
      water       += fbm(uvAspect * 1.8 + flow3) * 0.25;
      water       /= 1.75;

      // Couleur de base : eau noire profonde, tons bleu-nuit
      vec3 deepColor    = vec3(0.01, 0.02, 0.045);
      vec3 surfaceColor = vec3(0.06, 0.10, 0.18);
      vec3 waterColor   = mix(deepColor, surfaceColor, water * water);

      // --- Reflet de lune statique ---
      vec2 moonCenter = vec2(0.5 * aspect, 0.72);
      vec2 toMoon = uvAspect - moonCenter;
      float moonDist = length(toMoon * vec2(1.0, 0.35));
      float moonGlow = exp(-moonDist * moonDist * 9.0) * 0.35;
      float shimmer = fbm(uvAspect * 12.0 + vec2(t * 2.0, 0.0));
      moonGlow *= (0.7 + shimmer * 0.6);

      // --- Reflet interactif souris ---
      vec2 mouseAspect = vec2(uMouse.x * aspect, uMouse.y);
      vec2 toMouse = uvAspect - mouseAspect;
      float mouseDist = length(toMouse * vec2(1.0, 0.3));
      float mouseGlow = exp(-mouseDist * mouseDist * 5.0) * 0.55;
      float mouseShimmer = fbm(uvAspect * 15.0 - vec2(t * 1.5, t));
      mouseGlow *= (0.6 + mouseShimmer * 0.8);

      // Caustiques fines autour de la souris
      float caustic1 = fbm((uvAspect - mouseAspect) * 25.0 + vec2(t * 3.0));
      float causticMask = exp(-mouseDist * mouseDist * 18.0);
      float caustics = pow(caustic1, 2.5) * causticMask * 0.4;

      // Couleur du reflet : blanc froid légèrement bleuté
      vec3 reflectionColor = vec3(0.75, 0.85, 1.0);

      // --- Composition finale ---
      vec3 color = waterColor;
      color += reflectionColor * moonGlow;
      color += reflectionColor * mouseGlow;
      color += vec3(0.9, 0.95, 1.0) * caustics;

      // Vignette
      float vignette = 1.0 - smoothstep(0.5, 1.4, length((uv - 0.5) * vec2(1.0, 1.2)));
      color *= vignette * 0.85 + 0.15;

      // Tone mapping doux
      color = color / (color + vec3(0.15));

      gl_FragColor = vec4(color, 1.0);
    }
  `

  useFrame(({ clock }) => {
    if (!mesh.current) return
    mouse.current.lerp(targetMouse.current, 0.04)
    mesh.current.material.uniforms.uTime.value = clock.getElapsedTime()
    mesh.current.material.uniforms.uMouse.value.copy(mouse.current)
  })

  return (
    <mesh ref={mesh}>
      <planeGeometry args={[2, 2]} />
      <shaderMaterial
        vertexShader={vertexShader}
        fragmentShader={fragmentShader}
        uniforms={uniforms}
      />
    </mesh>
  )
}

export default function WaterBackground() {
  return (
    <div style={{
      position: 'fixed',
      top: 0, left: 0,
      width: '100vw',
      height: '100vh',
      zIndex: 0,
      pointerEvents: 'none'
    }}>
      <Canvas
        orthographic
        camera={{ zoom: 1, position: [0, 0, 1] }}
        style={{ background: '#01020a' }}
        dpr={[1, 1.5]}
        gl={{ antialias: false, powerPreference: 'high-performance' }}
      >
        <WaterSurface />
      </Canvas>
    </div>
  )
}
