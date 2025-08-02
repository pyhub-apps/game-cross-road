import { useEffect, useState, useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import { Vector3 } from 'three'
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
  
  return (
    <>
      {isPlaying && (
        <Player 
          position={playerPosition} 
          onPositionChange={handlePlayerPositionChange}
        />
      )}
    </>
  )
}