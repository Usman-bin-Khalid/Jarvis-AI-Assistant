'use client'

import { useRef, useEffect, useState } from 'react'
import { Canvas, useFrame, useThree } from '@react-three/fiber'
import { OrbitControls, Text, Sphere, Torus } from '@react-three/drei'
import * as THREE from 'three'

function AnimatedRings() {
  const group = useRef<THREE.Group>(null)

  useFrame(() => {
    if (group.current) {
      group.current.rotation.z += 0.001
      group.current.children.forEach((child, index) => {
        child.rotation.x += 0.0005 * (index % 2 === 0 ? 1 : -1)
      })
    }
  })

  return (
    <group ref={group}>
      <Torus args={[8, 0.2, 16, 100]} rotation={[Math.PI / 4, 0, 0]}>
        <meshStandardMaterial
          color="#00d4ff"
          emissive="#00d4ff"
          emissiveIntensity={0.5}
          wireframe={false}
        />
      </Torus>
      <Torus args={[6, 0.15, 16, 100]} rotation={[0, 0, Math.PI / 6]}>
        <meshStandardMaterial
          color="#00d4ff"
          emissive="#00d4ff"
          emissiveIntensity={0.3}
          wireframe={false}
          opacity={0.7}
          transparent
        />
      </Torus>
      <Torus args={[4, 0.1, 16, 100]} rotation={[Math.PI / 3, Math.PI / 4, 0]}>
        <meshStandardMaterial
          color="#ff6b35"
          emissive="#ff6b35"
          emissiveIntensity={0.4}
          wireframe={false}
        />
      </Torus>
    </group>
  )
}

function ParticleField() {
  const points = useRef<THREE.Points>(null)
  const geometryRef = useRef<THREE.BufferGeometry>(null)

  const particleCount = 500
  
  useEffect(() => {
    const geometry = new THREE.BufferGeometry()
    const positions = new Float32Array(particleCount * 3)

    for (let i = 0; i < particleCount * 3; i += 3) {
      positions[i] = (Math.random() - 0.5) * 40
      positions[i + 1] = (Math.random() - 0.5) * 40
      positions[i + 2] = (Math.random() - 0.5) * 40
    }

    geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3))
    geometryRef.current = geometry

    return () => {
      geometry.dispose()
    }
  }, [])

  useFrame(() => {
    if (points.current && geometryRef.current) {
      const positionAttribute = geometryRef.current.getAttribute('position')
      const array = positionAttribute.array as Float32Array
      for (let i = 2; i < array.length; i += 3) {
        array[i] -= 0.02
        if (array[i] < -20) {
          array[i] = 20
        }
      }
      positionAttribute.needsUpdate = true
    }
  })

  if (!geometryRef.current) return null

  return (
    <points ref={points} geometry={geometryRef.current}>
      <pointsMaterial
        size={0.3}
        color="#00d4ff"
        sizeAttenuation
        transparent
        opacity={0.6}
      />
    </points>
  )
}

function CentralCore() {
  const sphere = useRef<THREE.Mesh>(null)

  useFrame(() => {
    if (sphere.current) {
      sphere.current.rotation.x += 0.003
      sphere.current.rotation.y += 0.005
      sphere.current.scale.x = 1 + Math.sin(Date.now() * 0.001) * 0.1
      sphere.current.scale.y = 1 + Math.cos(Date.now() * 0.001) * 0.1
      sphere.current.scale.z = 1 + Math.sin(Date.now() * 0.0015) * 0.1
    }
  })

  return (
    <Sphere ref={sphere} args={[2, 64, 64]}>
      <meshStandardMaterial
        color="#ff6b35"
        emissive="#ff6b35"
        emissiveIntensity={0.8}
        wireframe={false}
      />
    </Sphere>
  )
}

export function JarvisHUD() {
  return (
    <Canvas
      camera={{ position: [0, 0, 15], fov: 75 }}
      className="w-full h-screen bg-background"
      gl={{
        antialias: true,
        alpha: true,
        powerPreference: 'high-performance',
      }}
    >
      <color attach="background" args={['#0a0a0a']} />
      
      {/* Lighting */}
      <ambientLight intensity={0.5} color="#ffffff" />
      <pointLight position={[10, 10, 10]} intensity={1} color="#00d4ff" />
      <pointLight position={[-10, -10, -10]} intensity={0.5} color="#ff6b35" />

      {/* 3D Elements */}
      <ParticleField />
      <AnimatedRings />
      <CentralCore />

      {/* Controls */}
      <OrbitControls
        autoRotate
        autoRotateSpeed={2}
        enableZoom={false}
        enablePan={false}
      />
    </Canvas>
  )
}
