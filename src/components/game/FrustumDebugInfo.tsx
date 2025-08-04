import { Html } from '@react-three/drei'
import { useFrame } from '@react-three/fiber'
import { useState } from 'react'
import { GameManager } from '../../game/GameManager'

export default function FrustumDebugInfo() {
  const [frustumInfo, setFrustumInfo] = useState({
    totalLanes: 0,
    visibleLanes: 0,
    culledLanes: 0,
    cameraY: 0,
    visibleRange: { min: 0, max: 0 }
  })
  
  useFrame(() => {
    try {
      const gameManager = GameManager.getInstance()
      const componentManager = gameManager.getComponentManager()
      const cameraSystem = (gameManager as any).systems.get('camera')
      
      if (!cameraSystem || !componentManager) return
      
      // Get camera position
      const cameraPos = cameraSystem.getPosition()
      const viewDistance = 20
      
      // Get all lane entities
      const laneEntities = componentManager.getEntitiesWithComponents(['lane', 'transform'])
      const totalLanes = laneEntities.length
      
      // Count visible lanes
      let visibleCount = 0
      laneEntities.forEach(entity => {
        const transform = componentManager.getComponent(entity, 'transform')
        if (transform && 'position' in transform) {
          if (cameraSystem.isInFrustum(0, transform.position.y, viewDistance)) {
            visibleCount++
          }
        }
      })
      
      const culledCount = totalLanes - visibleCount
      
      // Update state only if values changed significantly
      if (Math.abs(frustumInfo.cameraY - cameraPos.y) > 0.1 || 
          frustumInfo.visibleLanes !== visibleCount) {
        setFrustumInfo({
          totalLanes,
          visibleLanes: visibleCount,
          culledLanes: culledCount,
          cameraY: cameraPos.y,
          visibleRange: {
            min: cameraPos.y - viewDistance / 2,
            max: cameraPos.y + viewDistance / 2
          }
        })
      }
    } catch (error) {
      console.error('FrustumDebugInfo error:', error)
    }
  })
  
  const cullingEfficiency = frustumInfo.totalLanes > 0 
    ? ((frustumInfo.culledLanes / frustumInfo.totalLanes) * 100).toFixed(1)
    : '0'
  
  return (
    <Html 
      position={[0, 0, 0]} 
      style={{
        position: 'fixed',
        top: '10px',
        right: '10px',
        zIndex: 1000
      }}
    >
      <div style={{
        background: 'rgba(0, 0, 0, 0.8)',
        color: 'white',
        padding: '10px',
        borderRadius: '5px',
        fontSize: '12px',
        fontFamily: 'monospace',
        minWidth: '200px'
      }}>
        <h3 style={{ margin: '0 0 10px 0', color: '#00ff00' }}>Frustum Culling</h3>
        
        <div style={{ marginBottom: '5px' }}>
          <strong>Total Lanes:</strong> {frustumInfo.totalLanes}
        </div>
        
        <div style={{ marginBottom: '5px', color: '#00ff00' }}>
          <strong>Visible Lanes:</strong> {frustumInfo.visibleLanes}
        </div>
        
        <div style={{ marginBottom: '5px', color: '#ff6600' }}>
          <strong>Culled Lanes:</strong> {frustumInfo.culledLanes}
        </div>
        
        <div style={{ marginBottom: '10px', color: '#ffff00' }}>
          <strong>Culling Efficiency:</strong> {cullingEfficiency}%
        </div>
        
        <div style={{ borderTop: '1px solid #444', paddingTop: '10px' }}>
          <strong>Camera Y:</strong> {frustumInfo.cameraY.toFixed(2)}<br />
          <strong>Visible Range:</strong><br />
          Y: [{frustumInfo.visibleRange.min.toFixed(1)}, {frustumInfo.visibleRange.max.toFixed(1)}]
        </div>
        
        <div style={{ marginTop: '10px', fontSize: '10px', color: '#888' }}>
          Only rendering lanes within camera view.<br />
          This improves performance significantly.
        </div>
      </div>
    </Html>
  )
}