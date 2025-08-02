import { useEffect, useState, useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import { Vector3 } from 'three'
import { Html } from '@react-three/drei'
import Player from './Player'
import { GameManager } from '../../game/GameManager'

export default function Game() {
  const gameManagerRef = useRef<GameManager | null>(null)
  const [playerPosition, setPlayerPosition] = useState<[number, number, number]>([0, 0, 0])
  const [isPlaying, setIsPlaying] = useState(false)
  
  useEffect(() => {
    // Initialize game manager
    const gameManager = GameManager.getInstance()
    gameManagerRef.current = gameManager
    
    // Create player
    gameManager.createPlayer()
    setIsPlaying(true)
    
    // Subscribe to player movement events
    const unsubscribe = gameManager.getEventBus().on('PLAYER_MOVED', (event) => {
      const { to } = event.data
      console.log('Player moved to:', to)
      setPlayerPosition([to.x, 0, -to.y]) // Convert Y to Z for 3D view
    })
    
    // Log initial state
    console.log('Game initialized')
    
    return () => {
      unsubscribe()
      gameManager.reset()
    }
  }, [])
  
  // Update game logic
  useFrame((_, delta) => {
    if (gameManagerRef.current && isPlaying) {
      gameManagerRef.current.update(delta)
    }
  })
  
  const handlePlayerPositionChange = (_: Vector3) => {
    // This can be used for camera tracking later
  }
  
  // Debug controls
  const movePlayer = (direction: 'up' | 'down' | 'left' | 'right') => {
    const gameManager = gameManagerRef.current
    if (!gameManager) return
    
    const inputManager = (gameManager as any).inputManager
    if (!inputManager) return
    
    const keyMap = {
      up: 'ArrowUp',
      down: 'ArrowDown', 
      left: 'ArrowLeft',
      right: 'ArrowRight'
    }
    
    const event = new KeyboardEvent('keydown', { key: keyMap[direction] })
    inputManager.handleKeyDown(event)
  }
  
  return (
    <>
      {isPlaying && (
        <Player 
          position={playerPosition} 
          onPositionChange={handlePlayerPositionChange}
        />
      )}
      
      {/* Debug controls */}
      <Html position={[0, 5, 0]}>
        <div style={{ 
          background: 'rgba(0,0,0,0.7)', 
          padding: '10px', 
          borderRadius: '5px',
          color: 'white',
          fontSize: '12px'
        }}>
          <div>Player Y: {playerPosition[2] ? -playerPosition[2] : 0}</div>
          <div style={{ marginTop: '5px' }}>
            <button onClick={() => movePlayer('up')} style={{ margin: '2px' }}>↑</button>
            <button onClick={() => movePlayer('down')} style={{ margin: '2px' }}>↓</button>
            <button onClick={() => movePlayer('left')} style={{ margin: '2px' }}>←</button>
            <button onClick={() => movePlayer('right')} style={{ margin: '2px' }}>→</button>
          </div>
        </div>
      </Html>
    </>
  )
}