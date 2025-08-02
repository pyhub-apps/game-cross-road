import { ISystem } from '../../core/interfaces/ISystem'
import { EntityManager } from '../../core/managers/EntityManager'
import { ComponentManager } from '../../core/managers/ComponentManager'
import { MapGenerator } from '../generation/MapGenerator'
import { ChunkManager } from '../generation/ChunkManager'
import { LaneFactory } from '../generation/LaneFactory'
import { IEventBus } from '../interfaces/IEventBus'
import { IGameStateManager } from '../interfaces/IGameState'
import { Transform } from '../../core/components/Transform'

/**
 * System that manages procedural map generation and lane entities
 */
export class MapSystem implements ISystem {
  name = 'MapSystem'
  priority = 60 // Run before most other systems
  enabled = true
  
  private entityManager!: EntityManager
  private componentManager!: ComponentManager
  private mapGenerator: MapGenerator
  private chunkManager: ChunkManager
  private laneFactory!: LaneFactory
  private eventBus: IEventBus
  private gameStateManager: IGameStateManager
  
  // Track lane entities
  private laneEntities: Map<number, string> = new Map() // y -> entityId
  
  constructor(eventBus: IEventBus, gameStateManager: IGameStateManager) {
    this.eventBus = eventBus
    this.gameStateManager = gameStateManager
    this.mapGenerator = new MapGenerator()
    this.chunkManager = new ChunkManager(this.mapGenerator)
  }
  
  initialize(entityManager: EntityManager, componentManager: ComponentManager): void {
    this.entityManager = entityManager
    this.componentManager = componentManager
    this.laneFactory = new LaneFactory(entityManager, componentManager)
    
    // Initialize chunk manager with starting chunks
    this.chunkManager.initialize()
    console.log('MapSystem: Initialized chunk manager')
    
    // Create initial lane entities
    const initialLanes = this.chunkManager.getLanesInRange(-10, 20)
    console.log('MapSystem: Creating', initialLanes.length, 'initial lanes')
    
    initialLanes.forEach(lane => {
      const entity = this.laneFactory.createLaneEntity(lane)
      this.laneEntities.set(lane.yPosition, entity.id)
    })
    
    console.log('MapSystem: Lane entities created:', this.laneEntities.size)
    
    // Emit initial lanes update event
    this.eventBus.emit({
      type: 'LANES_UPDATED',
      data: {
        visibleLanes: this.laneEntities.size,
        totalLanes: this.laneEntities.size
      }
    })
    
    // Subscribe to player movement events
    this.eventBus.on('PLAYER_MOVED', (event) => {
      this.handlePlayerMovement(event.data)
    })
  }
  
  update(deltaTime: number): void {
    if (!this.enabled) return
    
    const gameState = this.gameStateManager.getState()
    if (gameState.currentState !== 'playing' || !gameState.playerEntityId) return
    
    // Get player position
    const playerEntity = this.entityManager.getEntity(gameState.playerEntityId)
    if (!playerEntity) return
    
    const transform = this.componentManager.getComponent<Transform>(playerEntity, 'transform')
    if (!transform) return
    
    const playerY = transform.position.y
    const difficulty = this.calculateDifficulty(playerY)
    
    // Update chunks based on player position
    this.chunkManager.update(playerY, difficulty)
    
    // Update visible lanes
    this.updateVisibleLanes(playerY)
  }
  
  destroy(): void {
    // Clean up all lane entities
    this.laneEntities.forEach(entityId => {
      this.entityManager.removeEntity(entityId)
    })
    this.laneEntities.clear()
  }
  
  private handlePlayerMovement(data: { from: { x: number; y: number }; to: { x: number; y: number } }): void {
    // Player moved, check if we need to generate new lanes
    const playerY = data.to.y
    const difficulty = this.calculateDifficulty(playerY)
    
    this.chunkManager.update(playerY, difficulty)
    this.updateVisibleLanes(playerY)
  }
  
  private updateVisibleLanes(playerY: number): void {
    const viewDistance = 20 // How many lanes to show ahead and behind
    const minY = Math.floor(playerY - viewDistance / 2)
    const maxY = Math.ceil(playerY + viewDistance)
    
    // Get lanes that should be visible
    const visibleLanes = this.chunkManager.getLanesInRange(minY, maxY)
    const visibleYPositions = new Set(visibleLanes.map(l => l.yPosition))
    
    // Remove lanes that are no longer visible
    const toRemove: number[] = []
    this.laneEntities.forEach((entityId, y) => {
      if (!visibleYPositions.has(y)) {
        this.entityManager.removeEntity(entityId)
        toRemove.push(y)
      }
    })
    toRemove.forEach(y => this.laneEntities.delete(y))
    
    // Add new lanes that should be visible
    visibleLanes.forEach(lane => {
      if (!this.laneEntities.has(lane.yPosition)) {
        const entity = this.laneFactory.createLaneEntity(lane)
        this.laneEntities.set(lane.yPosition, entity.id)
      }
    })
    
    // Emit event for lane updates
    this.eventBus.emit({
      type: 'LANES_UPDATED',
      data: {
        visibleLanes: visibleLanes.length,
        totalLanes: this.laneEntities.size
      }
    })
  }
  
  private calculateDifficulty(playerY: number): number {
    // Simple difficulty scaling based on distance
    if (playerY < 50) return 0 // Easy
    if (playerY < 150) return 1 // Medium
    return 2 // Hard
  }
  
  /**
   * Get current map statistics
   */
  getMapStats() {
    const chunkStats = this.chunkManager.getStats()
    return {
      ...chunkStats,
      visibleLanes: this.laneEntities.size
    }
  }
}