export default function Lighting() {
  return (
    <>
      {/* 전체적인 밝기를 위한 환경광 */}
      <ambientLight intensity={0.6} />
      
      {/* 그림자를 위한 방향광 */}
      <directionalLight
        position={[10, 10, 5]}
        intensity={0.8}
        castShadow
        shadow-mapSize={[2048, 2048]}
        shadow-camera-near={0.5}
        shadow-camera-far={50}
        shadow-camera-left={-20}
        shadow-camera-right={20}
        shadow-camera-top={20}
        shadow-camera-bottom={-20}
      />
    </>
  )
}