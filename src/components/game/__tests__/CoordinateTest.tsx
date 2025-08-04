import { useEffect } from 'react'
import { useFrame } from '@react-three/fiber'
import { Html } from '@react-three/drei'

export default function CoordinateTest() {
  useEffect(() => {
    console.log('=== COORDINATE TEST ===')
    console.log('Game Logic: Y-forward (player moves in +Y direction)')
    console.log('3D Rendering: Z-forward (negative Z is forward)')
    console.log('Conversion: Game Y => 3D -Z')
    console.log('======================')
  }, [])

  useFrame(({ camera }) => {
    // Log camera position every second
    if (Math.random() < 0.016) { // ~60fps, so this is roughly once per second
      console.log('Camera position:', {
        x: camera.position.x.toFixed(2),
        y: camera.position.y.toFixed(2),
        z: camera.position.z.toFixed(2)
      })
    }
  })

  return (
    <>
      {/* Visual markers for debugging */}
      {/* Origin marker */}
      <mesh position={[0, 0, 0]}>
        <sphereGeometry args={[0.5, 16, 16]} />
        <meshStandardMaterial color="red" />
      </mesh>
      <Html position={[0, 1, 0]}>
        <div style={{ color: 'red', background: 'white', padding: '2px' }}>Origin</div>
      </Html>

      {/* Y=1 marker (game logic) => Z=-1 (3D) */}
      <mesh position={[0, 0, -1]}>
        <sphereGeometry args={[0.5, 16, 16]} />
        <meshStandardMaterial color="green" />
      </mesh>
      <Html position={[0, 1, -1]}>
        <div style={{ color: 'green', background: 'white', padding: '2px' }}>Y=1</div>
      </Html>

      {/* Y=5 marker (game logic) => Z=-5 (3D) */}
      <mesh position={[0, 0, -5]}>
        <sphereGeometry args={[0.5, 16, 16]} />
        <meshStandardMaterial color="blue" />
      </mesh>
      <Html position={[0, 1, -5]}>
        <div style={{ color: 'blue', background: 'white', padding: '2px' }}>Y=5</div>
      </Html>

      {/* Y=10 marker (game logic) => Z=-10 (3D) */}
      <mesh position={[0, 0, -10]}>
        <sphereGeometry args={[0.5, 16, 16]} />
        <meshStandardMaterial color="yellow" />
      </mesh>
      <Html position={[0, 1, -10]}>
        <div style={{ color: 'yellow', background: 'white', padding: '2px' }}>Y=10</div>
      </Html>
    </>
  )
}