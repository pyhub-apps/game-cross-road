import { useEffect, useState } from 'react'
import { useFrame } from '@react-three/fiber'
import Lane from './Lane'
import { GameManager } from '../../game/GameManager'
import { Lane as LaneComponent, LaneType } from '../../core/components/Lane'
import { Transform } from '../../core/components/Transform'

interface LaneData {
  id: string
  type: LaneType
  position: [number, number, number]
  worldY: number // Store original Y for frustum culling
}

export default function MapRenderer() {
  const [lanes, setLanes] = useState<LaneData[]>([])
  const [visibleLanes, setVisibleLanes] = useState<LaneData[]>([])
  const [culledCount, setCulledCount] = useState(0)
  const gameManager = GameManager.getInstance()
  
  useEffect(() => {
    console.log('MapRenderer: Mounting component')
    
    // Subscribe to lane updates
    const unsubscribe = gameManager.getEventBus().on('LANES_UPDATED', (event) => {
      console.log('MapRenderer: LANES_UPDATED event received', event.data)
      updateLanes()
    })
    
    // Initial lane update
    console.log('MapRenderer: Initial update')
    updateLanes()
    
    return () => {
      console.log('MapRenderer: Unmounting component')
      unsubscribe()
    }
  }, [])
  
  const updateLanes = () => {
    const entityManager = gameManager.getEntityManager()
    const componentManager = gameManager.getComponentManager()
    
    if (!entityManager || !componentManager) {
      console.log('MapRenderer: No managers available')
      return
    }
    
    // Get all entities with lane component
    const laneEntities = componentManager.getEntitiesWithComponents(['lane', 'transform'])
    
    console.log('MapRenderer: Found', laneEntities.length, 'lane entities')
    
    const laneData: LaneData[] = laneEntities.map(entity => {
      const lane = componentManager.getComponent<LaneComponent>(entity, 'lane')
      const transform = componentManager.getComponent<Transform>(entity, 'transform')
      
      if (!lane || !transform) return null
      
      const position: [number, number, number] = [
        transform.position.x,
        0,
        -transform.position.y // Convert Y to Z for 3D
      ]
      
      // Log first few lanes for debugging
      if (laneEntities.indexOf(entity) < 3) {
        console.log(`Lane at Y=${transform.position.y} => 3D position:`, position, 'type:', lane.laneType)
      }
      
      return {
        id: entity.id,
        type: lane.laneType,
        position,
        worldY: transform.position.y
      }
    }).filter(Boolean) as LaneData[]
    
    console.log('MapRenderer: Rendering', laneData.length, 'lanes')
    setLanes(laneData)
  }
  
  // Update visible lanes based on camera frustum
  useFrame(() => {
    const cameraSystem = (gameManager as any).systems.get('camera')
    if (!cameraSystem) return
    
    const cameraPos = cameraSystem.getPosition()
    const viewDistance = 20 // Match the frustum view distance
    
    // Filter lanes that are within camera frustum
    const visible = lanes.filter(lane => {
      // Check if lane is within frustum using the CameraBounds system
      return cameraSystem.isInFrustum(0, lane.worldY, viewDistance)
    })
    
    // Update visible lanes if changed
    if (visible.length !== visibleLanes.length) {
      setVisibleLanes(visible)
      const culled = lanes.length - visible.length
      setCulledCount(culled)
      
      // Log culling statistics periodically
      if (Math.random() < 0.05) { // 5% chance to log
        console.log(`Frustum culling: ${visible.length}/${lanes.length} lanes visible (${culled} culled)`)
        console.log(`Camera Y: ${cameraPos.y.toFixed(2)}, Visible Y range: [${cameraPos.y - viewDistance/2}, ${cameraPos.y + viewDistance/2}]`)
      }
    }
  })
  
  return (
    <>
      {visibleLanes.map(lane => (
        <Lane
          key={lane.id}
          type={lane.type}
          position={lane.position}
        />
      ))}
      
      {/* Frustum culling debug info */}
      {culledCount > 0 && (
        <group position={[0, 5, 0]}>
          <sprite scale={[10, 1, 1]}>
            <spriteMaterial color="green" opacity={0.7} />
          </sprite>
        </group>
      )}
    </>
  )
}