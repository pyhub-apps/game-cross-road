import { EntityManager } from '../core/managers/EntityManager'
import { ComponentManager } from '../core/managers/ComponentManager'
import { EventBus } from './events/EventBus'
import { SimpleGameStateManager } from './SimpleGameStateManager'
import { WebInputManager } from '../infrastructure/input/WebInputManager'

// Systems
import { PlayerSystem } from './systems/PlayerSystem'
import { MovementSystem } from './systems/MovementSystem'
import { CollisionSystem } from './systems/CollisionSystem'
import { CameraSystem } from './systems/CameraSystem'
import { PressureSystem } from './systems/PressureSystem'
import { MapSystem } from './systems/MapSystem'

// Components
import { Transform, createTransform } from '../core/components/Transform'
import { Player, createPlayer } from '../core/components/Player'
import { Velocity, createVelocity } from '../core/components/Velocity'

/**
 * Main game manager - coordinates all game systems
 */
export class GameManager {
  private static instance: GameManager | null = null
  
  private entityManager: EntityManager
  private componentManager: ComponentManager
  private systems: Map<string, any>
  private eventBus: EventBus
  private gameStateManager: SimpleGameStateManager
  private inputManager: WebInputManager
  
  private constructor() {
    // Initialize core managers
    this.entityManager = new EntityManager()
    this.componentManager = new ComponentManager(this.entityManager)
    this.systems = new Map()
    this.eventBus = new EventBus()
    this.gameStateManager = new SimpleGameStateManager()
    this.inputManager = new WebInputManager()
    
    // Initialize systems
    this.initializeSystems()
    
    // Initialize input
    this.inputManager.initialize()
  }
  
  static getInstance(): GameManager {
    if (!GameManager.instance) {
      GameManager.instance = new GameManager()
    }
    return GameManager.instance
  }
  
  private initializeSystems(): void {
    // Create systems
    const mapSystem = new MapSystem(this.eventBus, this.gameStateManager)
    const playerSystem = new PlayerSystem(
      this.inputManager,
      this.eventBus,
      this.gameStateManager
    )
    const movementSystem = new MovementSystem()
    const collisionSystem = new CollisionSystem(this.eventBus)
    const cameraSystem = new CameraSystem(this.eventBus, this.gameStateManager)
    const pressureSystem = new PressureSystem(this.eventBus, this.gameStateManager)
    
    // Register and initialize systems
    this.systems.set('map', mapSystem)
    this.systems.set('player', playerSystem)
    this.systems.set('movement', movementSystem)
    this.systems.set('collision', collisionSystem)
    this.systems.set('camera', cameraSystem)
    this.systems.set('pressure', pressureSystem)
    
    // Initialize all systems
    this.systems.forEach(system => {
      if (system.initialize) {
        system.initialize(this.entityManager, this.componentManager)
      }
    })
  }
  
  createPlayer(): string {
    // Create player entity
    const entity = this.entityManager.createEntity()
    
    // Add components
    const transform = createTransform(0, 0, 0)
    const player = createPlayer()
    const velocity = createVelocity()
    
    this.componentManager.addComponent(entity, transform)
    this.componentManager.addComponent(entity, player)
    this.componentManager.addComponent(entity, velocity)
    
    // Update game state
    this.gameStateManager.setState({ 
      playerEntityId: entity.id,
      currentState: 'playing' 
    })
    
    return entity.id
  }
  
  update(deltaTime: number): void {
    // Update systems in order
    const orderedSystems = ['map', 'player', 'movement', 'collision', 'camera', 'pressure']
    
    orderedSystems.forEach(systemName => {
      const system = this.systems.get(systemName)
      if (system && system.enabled) {
        system.update(deltaTime)
      }
    })
  }
  
  getPlayerPosition(): { x: number; y: number; z: number } | null {
    const state = this.gameStateManager.getState()
    if (!state.playerEntityId) return null
    
    const entity = this.entityManager.getEntity(state.playerEntityId)
    if (!entity) return null
    
    const transform = this.componentManager.getComponent<Transform>(
      entity, 
      'transform'
    )
    
    return transform ? { ...transform.position } : null
  }
  
  getPlayerScore(): number {
    const state = this.gameStateManager.getState()
    if (!state.playerEntityId) return 0
    
    const entity = this.entityManager.getEntity(state.playerEntityId)
    if (!entity) return 0
    
    const player = this.componentManager.getComponent<Player>(
      entity,
      'player'
    )
    
    return player ? player.score : 0
  }
  
  getGameState() {
    return this.gameStateManager.getState()
  }
  
  getEventBus() {
    return this.eventBus
  }
  
  getEntityManager() {
    return this.entityManager
  }
  
  getComponentManager() {
    return this.componentManager
  }
  
  reset(): void {
    // Clear all entities
    this.entityManager.getAllEntities().forEach(entity => {
      this.entityManager.removeEntity(entity.id)
    })
    
    // Reset game state
    this.gameStateManager.setState({
      currentState: 'menu',
      playerEntityId: null,
      score: 0,
      highScore: this.gameStateManager.getState().highScore,
      pressureActive: false,
      cameraOffset: { x: 0, y: -5, z: 10 }
    })
  }
  
  /**
   * Restart the game completely
   */
  restart(): void {
    // Reset everything
    this.reset()
    
    // Re-initialize map system to recreate lanes
    const mapSystem = this.systems.get('map')
    if (mapSystem && mapSystem.initialize) {
      console.log('GameManager: Re-initializing map system')
      mapSystem.initialize(this.entityManager, this.componentManager)
    }
    
    // Create player and start game
    this.createPlayer()
  }
  
  destroy(): void {
    // Destroy all systems
    this.systems.forEach(system => {
      if (system.destroy) {
        system.destroy()
      }
    })
    this.systems.clear()
    
    this.inputManager.destroy()
    this.eventBus.clear()
    GameManager.instance = null
  }
}