import { useRef } from 'react'
import { Mesh } from 'three'

interface GroundProps {
  size?: number
}

export default function Ground({ size = 20 }: GroundProps) {
  const meshRef = useRef<Mesh>(null!)

  return (
    <mesh 
      ref={meshRef} 
      rotation={[-Math.PI / 2, 0, 0]} 
      position={[0, -0.5, 0]}
      receiveShadow
    >
      <planeGeometry args={[size, size, size, size]} />
      <meshStandardMaterial 
        color="#4a4a4a" 
        wireframe={true}
      />
    </mesh>
  )
}