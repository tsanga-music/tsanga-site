import { useRef, useMemo } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import * as THREE from 'three';

function WaterPlane() {
  const mesh = useRef();
  const { viewport } = useThree();

  const uniforms = useMemo(() => ({
    uTime:       { value: 0 },
    uMouse:      { value: new THREE.Vector2(0, 0) },
    uResolution: { value: new THREE.Vector2(viewport.width, viewport.height) },
  }), []); // eslint-disable-line react-hooks/exhaustive-deps

  const vertexShader = `
    uniform float uTime;
    uniform vec2 uMouse;
    varying vec2 vUv;
    varying float vElevation;
    void main() {
      vUv = uv;
      vec3 pos = position;
      float dist = length(uv - uMouse);
      float ripple = sin(dist * 12.0 - uTime * 1.2) * exp(-dist * 3.5) * 0.06;
      float base = sin(pos.x * 1.5 + uTime * 0.3) * 0.015
                 + sin(pos.y * 1.2 + uTime * 0.2) * 0.01;
      pos.z += ripple + base;
      vElevation = pos.z;
      gl_Position = projectionMatrix * modelViewMatrix * vec4(pos, 1.0);
    }
  `;

  const fragmentShader = `
    uniform float uTime;
    varying vec2 vUv;
    varying float vElevation;
    void main() {
      float brightness = (vElevation + 0.08) * 4.0;
      vec3 deepWater = vec3(0.01, 0.02, 0.06);
      vec3 moonReflection = vec3(0.25, 0.30, 0.45);
      vec3 color = mix(deepWater, moonReflection, clamp(brightness, 0.0, 1.0));
      gl_FragColor = vec4(color, 1.0);
    }
  `;

  useFrame(({ clock, mouse: m }) => {
    uniforms.uTime.value = clock.getElapsedTime();
    uniforms.uMouse.value.set((m.x + 1) / 2, (m.y + 1) / 2);
  });

  return (
    <mesh ref={mesh} rotation={[-Math.PI / 2.5, 0, 0]} position={[0, -1, 0]}>
      <planeGeometry args={[8, 8, 128, 128]} />
      <shaderMaterial
        vertexShader={vertexShader}
        fragmentShader={fragmentShader}
        uniforms={uniforms}
      />
    </mesh>
  );
}

export default function WaterBackground() {
  return (
    <div style={{
      position: 'fixed', top: 0, left: 0,
      width: '100vw', height: '100vh',
      zIndex: 0, pointerEvents: 'none',
    }}>
      <Canvas
        camera={{ position: [0, 2, 4], fov: 55 }}
        style={{ background: '#01020a' }}
        dpr={[1, 1.5]}
        gl={{ antialias: false, powerPreference: 'low-power' }}
      >
        <WaterPlane />
        <fog attach="fog" args={['#01020a', 4, 12]} />
      </Canvas>
    </div>
  );
}
