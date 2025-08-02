import { useRef } from 'react'
import { Mesh } from 'three'
import { LaneType } from '../../core/components/Lane'

interface LaneProps {
  type: LaneType
  position: [number, number, number]
  width?: number
}

// Lane colors based on type
const LANE_COLORS = {
  grass: '#4CAF50',
  road: '#424242',
  river: '#2196F3',
  railway: '#795548'
}

// Lane textures/patterns
const LANE_PATTERNS = {
  grass: { roughness: 0.8, metalness: 0.1 },
  road: { roughness: 0.9, metalness: 0.2 },
  river: { roughness: 0.2, metalness: 0.1 },
  railway: { roughness: 0.7, metalness: 0.4 }
}

export default function Lane({ type, position, width = 20 }: LaneProps) {
  const meshRef = useRef<Mesh>(null)
  
  return (
    <mesh 
      ref={meshRef}
      position={position}
      receiveShadow
    >
      <boxGeometry args={[width, 0.1, 1.05]} />
      <meshStandardMaterial 
        color={LANE_COLORS[type]}
        roughness={LANE_PATTERNS[type].roughness}
        metalness={LANE_PATTERNS[type].metalness}
      />
      
      {/* Add road markings for road lanes */}
      {type === 'road' && (
        <>
          <mesh position={[0, 0.051, 0]}>
            <planeGeometry args={[width * 0.02, 0.8]} />
            <meshStandardMaterial color="white" />
          </mesh>
        </>
      )}
      
      {/* Add wave effect for river lanes */}
      {type === 'river' && (
        <mesh position={[0, 0.05, 0]}>
          <planeGeometry args={[width, 0.9]} />
          <meshStandardMaterial 
            color={LANE_COLORS[type]}
            transparent
            opacity={0.8}
          />
        </mesh>
      )}
    </mesh>
  )
}