import { Canvas } from '@react-three/fiber'
import { OrbitControls, Stats } from '@react-three/drei'
import { OrthographicCamera } from 'three'
import { useMemo, useState } from 'react'
import { useViewport } from '../../hooks/useViewport'
import Camera from './Camera'
import Lighting from './Lighting'
import Ground from './Ground'
import Game from './Game'
import MapRenderer from './MapRenderer'
import CameraDebugInfo from './CameraDebugInfo'
import CameraBoundaryTest from './__tests__/CameraBoundaryTest'
import FrustumDebugInfo from './FrustumDebugInfo'
import CameraEffectsTest from './__tests__/CameraEffectsTest'
import ViewportDebugInfo from './ViewportDebugInfo'
import CameraTestRunner from './__tests__/CameraTestRunner'
import CameraReset from './CameraReset'

export default function GameCanvas() {
  const [cameraTarget, setCameraTarget] = useState<[number, number, number]>([0, 0, 0])
  const [debugMode, setDebugMode] = useState(false) // OrbitControls disabled by default
  const { viewport, cameraConfig } = useViewport()

  // Create responsive orthographic camera for isometric view
  const orthographicCamera = useMemo(() => {
    const aspect = viewport.aspectRatio
    const frustumSize = cameraConfig.frustumSize
    const cam = new OrthographicCamera(
      -frustumSize * aspect,
      frustumSize * aspect,
      frustumSize,
      -frustumSize,
      cameraConfig.nearClip,
      cameraConfig.farClip
    )
    cam.position.set(20, 20, 20)  // Further back for wider view
    cam.lookAt(0, 0, 0)
    cam.zoom = cameraConfig.zoom * 0.5  // Additional zoom out
    return cam
  }, [viewport, cameraConfig])

  const handlePlayerPositionChange = (position: [number, number, number]) => {
    // This is now handled by the CameraSystem through events
    console.log('Player position changed:', position)
  }
  
  const handleCameraMove = (position: [number, number, number]) => {
    // Update camera target based on CameraSystem events
    console.log('Camera moved to:', position)
    setCameraTarget(position)
  }

  return (
    <div style={{ width: '100%', height: '100vh' }}>
      <CameraReset />
      <Canvas
        shadows
        orthographic
        camera={orthographicCamera}
      >
        {/* 카메라 설정 */}
        <Camera 
          target={cameraTarget}
          offset={[20, 20, 20]}
          zoom={cameraConfig.zoom * 0.5}
          followSpeed={0.1}
          minY={0}
        />
        
        {/* 조명 설정 */}
        <Lighting />
        
        {/* 개발용 컨트롤 */}
        {debugMode && (
          <OrbitControls 
            enablePan={true}
            enableRotate={true}
            enableZoom={true}
            target={cameraTarget}
          />
        )}
        
        {/* 개발용 성능 모니터 */}
        <Stats />
        
        {/* 테스트용 바닥 - 카메라를 따라가도록 위치 설정 */}
        <Ground size={200} position={cameraTarget} />
        
        {/* 맵 렌더링 */}
        <MapRenderer />
        
        {/* 게임 컴포넌트 */}
        <Game 
          onPlayerPositionChange={handlePlayerPositionChange} 
          onCameraMove={handleCameraMove}
        />
        
        {/* 카메라 디버그 정보 */}
        <CameraDebugInfo />
        
        {/* 카메라 경계 테스트 */}
        {debugMode && <CameraBoundaryTest />}
        
        {/* 프러스텀 컬링 디버그 정보 */}
        {debugMode && <FrustumDebugInfo />}
        
        {/* 카메라 효과 테스트 */}
        {debugMode && <CameraEffectsTest />}
        
        {/* 뷰포트 디버그 정보 */}
        {debugMode && <ViewportDebugInfo />}
        
        {/* 카메라 시스템 테스트 러너 */}
        {debugMode && <CameraTestRunner />}
      </Canvas>
      
      {/* Debug toggle button */}
      <button
        style={{
          position: 'absolute',
          top: '10px',
          right: '10px',
          padding: '5px 10px',
          background: debugMode ? '#ff0000' : '#00ff00',
          color: 'white',
          border: 'none',
          borderRadius: '5px',
          cursor: 'pointer'
        }}
        onClick={() => setDebugMode(!debugMode)}
      >
        {debugMode ? 'Disable' : 'Enable'} OrbitControls
      </button>
    </div>
  )
}