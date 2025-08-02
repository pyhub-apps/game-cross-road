import { Canvas } from '@react-three/fiber'
import { OrbitControls, Stats } from '@react-three/drei'
import Camera from './Camera'
import Lighting from './Lighting'
import Ground from './Ground'

export default function GameCanvas() {
  return (
    <div style={{ width: '100%', height: '100vh' }}>
      <Canvas
        shadows
        camera={{
          position: [10, 10, 10],
          fov: 50,
          near: 0.1,
          far: 1000,
        }}
      >
        {/* 카메라 설정 */}
        <Camera />
        
        {/* 조명 설정 */}
        <Lighting />
        
        {/* 개발용 컨트롤 */}
        <OrbitControls 
          enablePan={true}
          enableRotate={true}
          enableZoom={true}
          target={[0, 0, 0]}
        />
        
        {/* 개발용 성능 모니터 */}
        <Stats />
        
        {/* 테스트용 바닥 */}
        <Ground />
        
        {/* 테스트용 큐브 */}
        <mesh position={[0, 0.5, 0]} castShadow>
          <boxGeometry args={[1, 1, 1]} />
          <meshStandardMaterial color="orange" />
        </mesh>
        
        {/* 테스트용 구체 */}
        <mesh position={[2, 0.5, 2]} castShadow>
          <sphereGeometry args={[0.5, 32, 32]} />
          <meshStandardMaterial color="lightblue" />
        </mesh>
      </Canvas>
    </div>
  )
}