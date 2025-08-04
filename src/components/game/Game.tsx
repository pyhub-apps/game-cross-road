import { useEffect, useState, useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import { Vector3 } from 'three'
import { Html } from '@react-three/drei'
import Player from './Player'
import { GameManager } from '../../game/GameManager'

interface GameProps {
  onPlayerPositionChange?: (position: [number, number, number]) => void
  onCameraMove?: (position: [number, number, number]) => void
}

export default function Game({ onPlayerPositionChange, onCameraMove }: GameProps) {
  const gameManagerRef = useRef<GameManager | null>(null)
  const [playerPosition, setPlayerPosition] = useState<[number, number, number]>([0, 0, 0])
  const [isPlaying, setIsPlaying] = useState(false)
  
  // Store callbacks in refs to prevent re-initialization
  const onPlayerPositionChangeRef = useRef(onPlayerPositionChange)
  const onCameraMoveRef = useRef(onCameraMove)
  
  useEffect(() => {
    onPlayerPositionChangeRef.current = onPlayerPositionChange
    onCameraMoveRef.current = onCameraMove
  }, [onPlayerPositionChange, onCameraMove])
  
  useEffect(() => {
    // Initialize game manager
    const gameManager = GameManager.getInstance()
    gameManagerRef.current = gameManager
    
    // Only create player if not already created
    const currentState = gameManager.getGameState()
    if (currentState.currentState !== 'playing') {
      gameManager.createPlayer()
      setIsPlaying(true)
    } else {
      setIsPlaying(true)
    }
    
    // Set initial player position
    const initialPosition: [number, number, number] = [0, 0, 0]
    setPlayerPosition(initialPosition)
    if (onPlayerPositionChangeRef.current) {
      onPlayerPositionChangeRef.current(initialPosition)
    }
    
    // Subscribe to player movement events
    const unsubscribePlayer = gameManager.getEventBus().on('PLAYER_MOVED', (event) => {
      const { to } = event.data
      console.log('Player moved to:', to)
      const newPosition: [number, number, number] = [to.x, 0, -to.y] // Convert Y to Z for 3D view
      setPlayerPosition(newPosition)
      
      // Notify parent component for camera tracking
      if (onPlayerPositionChangeRef.current) {
        onPlayerPositionChangeRef.current(newPosition)
      }
    })
    
    // Subscribe to camera movement events
    const unsubscribeCamera = gameManager.getEventBus().on('CAMERA_MOVED', (event) => {
      const { position } = event.data
      console.log('Camera moved to:', position)
      const cameraPosition: [number, number, number] = [position.x, 0, -position.y] // Convert Y to Z for 3D view
      
      // Notify parent component for camera updates
      if (onCameraMoveRef.current) {
        onCameraMoveRef.current(cameraPosition)
      }
    })
    
    // Log initial state
    console.log('Game initialized')
    
    return () => {
      unsubscribePlayer()
      unsubscribeCamera()
      gameManager.reset()
    }
  }, []) // Remove dependencies to prevent re-initialization
  
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