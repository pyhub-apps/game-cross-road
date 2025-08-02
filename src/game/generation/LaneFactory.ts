import { IEntity } from '../../core/interfaces/IEntity'
import { EntityManager } from '../../core/managers/EntityManager'
import { ComponentManager } from '../../core/managers/ComponentManager'
import { createTransform } from '../../core/components/Transform'
import { createLane, LaneType } from '../../core/components/Lane'
import { GeneratedLane } from '../interfaces/IMapGenerator'

/**
 * Factory for creating lane entities from generated data
 */
export class LaneFactory {
  private entityManager: EntityManager
  private componentManager: ComponentManager
  
  constructor(entityManager: EntityManager, componentManager: ComponentManager) {
    this.entityManager = entityManager
    this.componentManager = componentManager
  }
  
  /**
   * Create a lane entity from generated data
   */
  createLaneEntity(generatedLane: GeneratedLane): IEntity {
    const entity = this.entityManager.createEntity()
    
    // Add transform component
    const transform = createTransform(0, generatedLane.yPosition, 0)
    this.componentManager.addComponent(entity, transform)
    
    // Add lane component
    const spawnPattern = this.createSpawnPattern(generatedLane)
    const lane = createLane(generatedLane.type, generatedLane.yPosition, spawnPattern)
    this.componentManager.addComponent(entity, lane)
    
    return entity
  }
  
  /**
   * Create multiple lane entities
   */
  createLaneEntities(generatedLanes: GeneratedLane[]): IEntity[] {
    return generatedLanes.map(lane => this.createLaneEntity(lane))
  }
  
  /**
   * Create spawn pattern from generated obstacles
   */
  private createSpawnPattern(generatedLane: GeneratedLane) {
    if (generatedLane.obstacles.length === 0) {
      return undefined
    }
    
    // Calculate average speed and determine spawn pattern
    const speeds = generatedLane.obstacles
      .filter(o => o.speed !== undefined)
      .map(o => o.speed!)
    
    const avgSpeed = speeds.length > 0 
      ? speeds.reduce((a, b) => a + b, 0) / speeds.length 
      : 3
    
    const obstacleTypes = [...new Set(generatedLane.obstacles.map(o => o.type))]
    
    return {
      spawnInterval: this.calculateSpawnInterval(generatedLane.type),
      spawnSpeed: avgSpeed,
      spawnDirection: generatedLane.obstacles[0]?.direction || 'right' as 'left' | 'right',
      obstacleTypes
    }
  }
  
  /**
   * Calculate spawn interval based on lane type
   */
  private calculateSpawnInterval(laneType: LaneType): number {
    switch (laneType) {
      case 'road':
        return 2000 // 2 seconds
      case 'river':
        return 3000 // 3 seconds
      case 'railway':
        return 5000 // 5 seconds
      default:
        return 0 // No spawning for grass
    }
  }
}