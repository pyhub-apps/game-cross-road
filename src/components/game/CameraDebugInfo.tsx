import { useFrame } from '@react-three/fiber'
import { Html } from '@react-three/drei'
import { useState } from 'react'
import { GameManager } from '../../game/GameManager'

export default function CameraDebugInfo() {
  const [cameraInfo, setCameraInfo] = useState({
    x: 0,
    y: 0,
    bounds: { minX: -10, maxX: 10, minY: 0, maxY: Infinity }
  })
  const [playerInfo, setPlayerInfo] = useState({ x: 0, y: 0 })
  const [gameState, setGameState] = useState<string>('unknown')

  useFrame(() => {
    try {
      const gameManager = GameManager.getInstance()
      const state = gameManager.getGameState()
      
      // Update game state
      setGameState(state.currentState)
      
      // Get camera position from state
      if (state.cameraOffset) {
        setCameraInfo(prev => ({
          ...prev,
          x: state.cameraOffset.x,
          y: state.cameraOffset.y
        }))
      }
      
      // Get player position
      if (state.playerEntityId) {
        const playerEntity = gameManager.getEntityManager().getEntity(state.playerEntityId)
        if (playerEntity) {
          const transform = gameManager.getComponentManager().getComponent(playerEntity, 'transform')
          if (transform && 'position' in transform) {
            setPlayerInfo({
              x: transform.position.x,
              y: transform.position.y
            })
          }
        }
      }
    } catch (error) {
      console.error('CameraDebugInfo error:', error)
    }
  })

  return (
    <Html 
      position={[0, 0, 0]}  // Remove 3D positioning
      style={{
        position: 'fixed',  // Use fixed positioning
        top: '10px',
        left: '10px',
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
        <h3 style={{ margin: '0 0 10px 0' }}>Camera Debug Info</h3>
        
        <div>
          <strong>Game State:</strong> {gameState}
        </div>
        
        <div style={{ marginTop: '10px' }}>
          <strong>Camera Position:</strong><br />
          X: {cameraInfo.x.toFixed(2)}<br />
          Y: {cameraInfo.y.toFixed(2)}
        </div>
        
        <div style={{ marginTop: '10px' }}>
          <strong>Camera Bounds:</strong><br />
          X: [{cameraInfo.bounds.minX}, {cameraInfo.bounds.maxX}]<br />
          Y: [{cameraInfo.bounds.minY}, ∞]
        </div>
        
        <div style={{ marginTop: '10px' }}>
          <strong>Player Position:</strong><br />
          X: {playerInfo.x.toFixed(2)}<br />
          Y: {playerInfo.y.toFixed(2)}
        </div>
        
        <div style={{ marginTop: '10px', color: '#ffff00' }}>
          <strong>Test Instructions:</strong><br />
          1. Move left/right to test X bounds<br />
          2. Move down to test Y=0 bound<br />
          3. Check console for clamp logs
        </div>
      </div>
    </Html>
  )
}