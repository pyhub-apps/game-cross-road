import { useEffect, useState } from 'react'
import Lane from './Lane'
import { GameManager } from '../../game/GameManager'
import { Lane as LaneComponent, LaneType } from '../../core/components/Lane'
import { Transform } from '../../core/components/Transform'

interface LaneData {
  id: string
  type: LaneType
  position: [number, number, number]
}

export default function MapRenderer() {
  const [lanes, setLanes] = useState<LaneData[]>([])
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
      
      return {
        id: entity.id,
        type: lane.laneType,
        position: [
          transform.position.x,
          0,
          -transform.position.y // Convert Y to Z for 3D
        ] as [number, number, number]
      }
    }).filter(Boolean) as LaneData[]
    
    console.log('MapRenderer: Rendering', laneData.length, 'lanes')
    setLanes(laneData)
  }
  
  return (
    <>
      {lanes.map(lane => (
        <Lane
          key={lane.id}
          type={lane.type}
          position={lane.position}
        />
      ))}
    </>
  )
}