import { useRef } from 'react'
import { Mesh } from 'three'

interface GroundProps {
  size?: number
}

export default function Ground({ size = 50 }: GroundProps) {
  const meshRef = useRef<Mesh>(null!)

  return (
    <>
      {/* Main ground plane */}
      <mesh 
        ref={meshRef} 
        rotation={[-Math.PI / 2, 0, 0]} 
        position={[0, -0.01, 0]}
        receiveShadow
      >
        <planeGeometry args={[size, size]} />
        <meshStandardMaterial color="#2a2a2a" />
      </mesh>
      
      {/* Grid helper for visual reference */}
      <gridHelper args={[size, size, '#444444', '#333333']} />
    </>
  )
}