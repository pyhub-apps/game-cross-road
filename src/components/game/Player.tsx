import { useRef, useEffect, useState } from 'react'
import { useFrame } from '@react-three/fiber'
import { Group, Vector3 } from 'three'
import { useSpring, animated } from '@react-spring/three'

interface PlayerProps {
  position: [number, number, number]
  onPositionChange?: (position: Vector3) => void
}

export default function Player({ position, onPositionChange }: PlayerProps) {
  const groupRef = useRef<Group>(null)
  const [isMoving, setIsMoving] = useState(false)
  const [targetPosition, setTargetPosition] = useState(position)
  
  // 홉 애니메이션을 위한 spring
  const { hopY } = useSpring({
    hopY: isMoving ? 0.3 : 0,
    config: { tension: 300, friction: 10 }
  })
  
  // 부드러운 이동을 위한 spring
  const { x, z } = useSpring({
    x: targetPosition[0],
    z: targetPosition[2],
    config: { tension: 200, friction: 15 },
    onStart: () => setIsMoving(true),
    onRest: () => setIsMoving(false)
  })
  
  // position prop이 변경될 때 targetPosition 업데이트
  useEffect(() => {
    setTargetPosition(position)
  }, [position])
  
  // 프레임마다 위치 업데이트
  useFrame(() => {
    if (groupRef.current && onPositionChange) {
      onPositionChange(groupRef.current.position)
    }
  })
  
  return (
    <animated.group 
      ref={groupRef} 
      position-x={x}
      position-y={hopY}
      position-z={z}
    >
      {/* 몸통 */}
      <mesh castShadow position={[0, 0.3, 0]}>
        <boxGeometry args={[0.6, 0.6, 0.6]} />
        <meshStandardMaterial color="#4ECDC4" />
      </mesh>
      
      {/* 머리 */}
      <mesh castShadow position={[0, 0.8, 0]}>
        <boxGeometry args={[0.5, 0.5, 0.5]} />
        <meshStandardMaterial color="#FFE66D" />
      </mesh>
      
      {/* 눈 (왼쪽) */}
      <mesh position={[-0.15, 0.85, 0.25]}>
        <boxGeometry args={[0.1, 0.1, 0.1]} />
        <meshStandardMaterial color="#2C3E50" />
      </mesh>
      
      {/* 눈 (오른쪽) */}
      <mesh position={[0.15, 0.85, 0.25]}>
        <boxGeometry args={[0.1, 0.1, 0.1]} />
        <meshStandardMaterial color="#2C3E50" />
      </mesh>
      
      {/* 부리 */}
      <mesh position={[0, 0.75, 0.3]}>
        <boxGeometry args={[0.2, 0.1, 0.2]} />
        <meshStandardMaterial color="#F39C12" />
      </mesh>
    </animated.group>
  )
}