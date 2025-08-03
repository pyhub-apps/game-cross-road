import { ISystem } from '../../core/interfaces/ISystem'
import { EntityManager } from '../../core/managers/EntityManager'
import { ComponentManager } from '../../core/managers/ComponentManager'
import { IEventBus } from '../interfaces/IEventBus'
import { IGameStateManager } from '../interfaces/IGameState'
import { Transform } from '../../core/components/Transform'
import { CameraBoundsSystem } from './CameraBounds'
import { CameraEffects } from './CameraEffects'

/**
 * Camera system - handles camera movement and tracking
 */
export class CameraSystem implements ISystem {
  name = 'CameraSystem'
  priority = 20
  enabled = true
  
  private entityManager!: EntityManager
  private componentManager!: ComponentManager
  private eventBus: IEventBus
  private gameStateManager: IGameStateManager
  
  // Camera state
  private cameraX: number = 0
  private cameraY: number = 0
  private targetX: number = 0
  private targetY: number = 0
  private forcedScrollSpeed: number = 1 // units per second
  private isForceScrolling: boolean = false
  
  // Camera bounds system
  private cameraBounds: CameraBoundsSystem
  // Camera effects system
  private cameraEffects: CameraEffects
  
  constructor(eventBus: IEventBus, gameStateManager: IGameStateManager) {
    this.eventBus = eventBus
    this.gameStateManager = gameStateManager
    this.cameraBounds = new CameraBoundsSystem()
    this.cameraEffects = new CameraEffects(eventBus)
  }
  
  initialize(entityManager: EntityManager, componentManager: ComponentManager): void {
    this.entityManager = entityManager
    this.componentManager = componentManager
    
    // Listen for pressure activation
    this.eventBus.on('PRESSURE_ACTIVATED', () => {
      this.isForceScrolling = true
    })
    
    this.eventBus.on('PRESSURE_DEACTIVATED', () => {
      this.isForceScrolling = false
    })
    
    // Listen for player movement to update camera target
    this.eventBus.on('PLAYER_MOVED', (event) => {
      const { to } = event.data
      // Update target position
      this.targetX = to.x
      // Camera only follows player when moving forward
      if (to.y > this.targetY) {
        this.targetY = to.y
      }
    })
  }
  
  update(deltaTime: number): void {
    const gameState = this.gameStateManager.getState()
    if (gameState.currentState !== 'playing') return
    
    // Update camera effects
    const effects = this.cameraEffects.update(deltaTime)
    
    // Handle forced scrolling during pressure
    if (this.isForceScrolling) {
      this.cameraY += this.forcedScrollSpeed * deltaTime
      this.targetY = Math.max(this.targetY, this.cameraY)
      
      // Apply effects offset
      const effectiveX = this.cameraX + effects.offset.x
      const effectiveY = this.cameraY + effects.offset.y
      
      // Apply bounds
      const beforeClamp = { x: effectiveX, y: effectiveY }
      const clampedPos = this.cameraBounds.clampPosition(effectiveX, effectiveY)
      
      // Debug log if position was clamped
      if (beforeClamp.x !== clampedPos.x || beforeClamp.y !== clampedPos.y) {
        console.log('Camera clamped:', beforeClamp, '->', clampedPos)
      }
      
      // Emit camera update event with effects
      this.eventBus.emit({
        type: 'CAMERA_MOVED',
        data: { 
          position: { x: clampedPos.x, y: clampedPos.y, z: 0 },
          zoom: effects.zoom
        }
      })
      
      // Check if player is off screen
      const playerEntity = this.entityManager.getEntity(gameState.playerEntityId!)
      if (playerEntity) {
        const transform = this.componentManager.getComponent<Transform>(playerEntity, 'transform')
        if (transform && transform.position.y < this.cameraY - 5) {
          // Player is off screen, trigger game over
          this.eventBus.emit({
            type: 'PLAYER_DIED',
            data: { reason: 'pressure' }
          })
        }
      }
    } else {
      // Normal camera following
      const lerpFactor = 0.1
      this.cameraX = this.cameraX + (this.targetX - this.cameraX) * lerpFactor
      this.cameraY = this.cameraY + (this.targetY - this.cameraY) * lerpFactor
      
      // Apply effects offset
      const effectiveX = this.cameraX + effects.offset.x
      const effectiveY = this.cameraY + effects.offset.y
      
      // Apply bounds
      const beforeClamp = { x: effectiveX, y: effectiveY }
      const clampedPos = this.cameraBounds.clampPosition(effectiveX, effectiveY)
      
      // Debug log if position was clamped
      if (beforeClamp.x !== clampedPos.x || beforeClamp.y !== clampedPos.y) {
        console.log('Camera clamped:', beforeClamp, '->', clampedPos)
      }
      
      // Emit camera update event with effects
      this.eventBus.emit({
        type: 'CAMERA_MOVED',
        data: { 
          position: { x: clampedPos.x, y: clampedPos.y, z: 0 },
          zoom: effects.zoom
        }
      })
    }
    
    // Update game state with camera offset
    this.gameStateManager.setState({
      ...gameState,
      cameraOffset: { x: this.cameraX, y: this.cameraY, z: 0 }
    })
  }
  
  destroy(): void {
    // Cleanup if needed
  }
  
  /**
   * Get current camera position
   */
  getPosition(): { x: number; y: number } {
    return { x: this.cameraX, y: this.cameraY }
  }
  
  /**
   * Get camera bounds system
   */
  getCameraBounds(): CameraBoundsSystem {
    return this.cameraBounds
  }
  
  /**
   * Check if an entity is visible in camera frustum
   */
  isInFrustum(x: number, y: number, viewDistance: number = 20): boolean {
    return this.cameraBounds.isInFrustum(x, y, this.cameraX, this.cameraY, viewDistance)
  }
}