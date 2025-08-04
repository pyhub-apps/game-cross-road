import { useEffect, useState, useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import { Vector3 } from 'three'
import Player from './Player'
import { GameManager } from '../../game/GameManager'
import { MapRenderer } from './MapRenderer'
import { ObstacleRenderer } from './ObstacleRenderer'
import { Obstacle } from '../../game/systems/ObstacleSystem'
import { Lane } from '../../game/systems/MapSystem'

export default function Game() {
  const gameManagerRef = useRef<GameManager | null>(null)
  const [playerPosition, setPlayerPosition] = useState<[number, number, number]>([0, 0, 0])
  const [isPlaying, setIsPlaying] = useState(false)
  const [obstacles, setObstacles] = useState<Obstacle[]>([])
  const [lanes, setLanes] = useState<Lane[]>([])
  
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
    
    // Subscribe to obstacle events
    const obstacleSystem = gameManager.getObstacleSystem()
    const mapSystem = gameManager.getMapSystem()
    
    let unsubscribeObstacles: (() => void) | null = null
    let unsubscribeMap: (() => void) | null = null
    
    if (obstacleSystem) {
      unsubscribeObstacles = obstacleSystem.on('obstaclesUpdated', (updatedObstacles: Obstacle[]) => {
        setObstacles(updatedObstacles)
      })
    }
    
    if (mapSystem) {
      unsubscribeMap = mapSystem.on('mapUpdated', (updatedLanes: Lane[]) => {
        setLanes(updatedLanes)
      })
      
      // Get initial lanes
      setLanes(mapSystem.getLanes())
    }
    
    // Log initial state
    console.log('Game initialized')
    
    return () => {
      unsubscribe()
      unsubscribeObstacles?.()
      unsubscribeMap?.()
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
        <>
          <MapRenderer lanes={lanes} />
          <ObstacleRenderer obstacles={obstacles} />
          <Player 
            position={playerPosition} 
            onPositionChange={handlePlayerPositionChange}
          />
        </>
      )}
    </>
  )
}