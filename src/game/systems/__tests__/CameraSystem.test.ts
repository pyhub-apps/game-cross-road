import { CameraSystem } from '../CameraSystem'
import { CameraBoundsSystem } from '../CameraBounds'
import { CameraEffects } from '../CameraEffects'
import { EventBus } from '../../events/EventBus'
import { SimpleGameStateManager } from '../../SimpleGameStateManager'
import { EntityManager } from '../../../core/managers/EntityManager'
import { ComponentManager } from '../../../core/managers/ComponentManager'

describe('CameraSystem', () => {
  let cameraSystem: CameraSystem
  let eventBus: EventBus
  let gameStateManager: SimpleGameStateManager
  let entityManager: EntityManager
  let componentManager: ComponentManager
  
  beforeEach(() => {
    eventBus = new EventBus()
    gameStateManager = new SimpleGameStateManager()
    entityManager = new EntityManager()
    componentManager = new ComponentManager(entityManager)
    
    cameraSystem = new CameraSystem(eventBus, gameStateManager)
    cameraSystem.initialize(entityManager, componentManager)
    
    // Set game state to playing
    gameStateManager.setState({ currentState: 'playing' })
  })
  
  describe('Camera Following', () => {
    it('should follow player movement with lerp', () => {
      const initialPos = cameraSystem.getPosition()
      expect(initialPos).toEqual({ x: 0, y: 0 })
      
      // Emit player movement
      eventBus.emit({
        type: 'PLAYER_MOVED',
        data: { to: { x: 5, y: 10 } }
      })
      
      // Update camera (simulate frame)
      cameraSystem.update(0.016) // 60fps
      
      const newPos = cameraSystem.getPosition()
      // Camera should have moved but not reached target due to lerp
      expect(newPos.x).toBeCloseTo(0.5, 1) // 10% of 5
      expect(newPos.y).toBeCloseTo(1, 1) // 10% of 10
    })
    
    it('should only follow player forward movement on Y axis', () => {
      // Move player forward
      eventBus.emit({
        type: 'PLAYER_MOVED',
        data: { to: { x: 0, y: 10 } }
      })
      
      cameraSystem.update(0.016)
      const pos1 = cameraSystem.getPosition()
      expect(pos1.y).toBeGreaterThan(0)
      
      // Try to move player backward
      eventBus.emit({
        type: 'PLAYER_MOVED',
        data: { to: { x: 0, y: 5 } }
      })
      
      cameraSystem.update(0.016)
      const pos2 = cameraSystem.getPosition()
      // Camera Y should not have decreased
      expect(pos2.y).toBeGreaterThanOrEqual(pos1.y)
    })
  })
  
  describe('Camera Boundaries', () => {
    it('should clamp camera position within bounds', () => {
      const bounds = cameraSystem.getCameraBounds()
      const boundsConfig = bounds.getBounds()
      
      // Try to move camera beyond X bounds
      eventBus.emit({
        type: 'PLAYER_MOVED',
        data: { to: { x: 20, y: 0 } } // Beyond max X of 10
      })
      
      // Update multiple times to ensure camera reaches target
      for (let i = 0; i < 50; i++) {
        cameraSystem.update(0.016)
      }
      
      const pos = cameraSystem.getPosition()
      expect(pos.x).toBeLessThanOrEqual(boundsConfig.maxX)
      expect(pos.x).toBeGreaterThanOrEqual(boundsConfig.minX)
    })
    
    it('should not allow camera to go below Y=0', () => {
      // Try to move camera below Y=0
      eventBus.emit({
        type: 'PLAYER_MOVED',
        data: { to: { x: 0, y: -5 } }
      })
      
      // Update multiple times
      for (let i = 0; i < 50; i++) {
        cameraSystem.update(0.016)
      }
      
      const pos = cameraSystem.getPosition()
      expect(pos.y).toBeGreaterThanOrEqual(0)
    })
  })
  
  describe('Pressure System', () => {
    it('should force scroll when pressure is activated', () => {
      const initialY = cameraSystem.getPosition().y
      
      // Activate pressure
      eventBus.emit({
        type: 'PRESSURE_ACTIVATED',
        data: {}
      })
      
      // Update for 1 second
      for (let i = 0; i < 60; i++) {
        cameraSystem.update(0.016)
      }
      
      const newY = cameraSystem.getPosition().y
      // Camera should have moved up by ~1 unit (1 unit/second)
      expect(newY).toBeCloseTo(initialY + 1, 1)
    })
    
    it('should stop force scrolling when pressure is deactivated', () => {
      // Activate then deactivate pressure
      eventBus.emit({ type: 'PRESSURE_ACTIVATED', data: {} })
      cameraSystem.update(0.5) // Update for 0.5 seconds
      
      const midY = cameraSystem.getPosition().y
      
      eventBus.emit({ type: 'PRESSURE_DEACTIVATED', data: {} })
      cameraSystem.update(0.5) // Update for another 0.5 seconds
      
      const finalY = cameraSystem.getPosition().y
      // Camera should not have moved much after deactivation
      expect(finalY - midY).toBeLessThan(0.1)
    })
  })
  
  describe('Frustum Culling', () => {
    it('should correctly determine if objects are in frustum', () => {
      const viewDistance = 20
      
      // Object at camera position should be visible
      expect(cameraSystem.isInFrustum(0, 0, viewDistance)).toBe(true)
      
      // Object far away should not be visible
      expect(cameraSystem.isInFrustum(0, 100, viewDistance)).toBe(false)
      
      // Object at edge of view distance
      expect(cameraSystem.isInFrustum(0, 9, viewDistance)).toBe(true)
      expect(cameraSystem.isInFrustum(0, 11, viewDistance)).toBe(false)
    })
  })
  
  describe('Camera Events', () => {
    it('should emit CAMERA_MOVED events', () => {
      let eventFired = false
      let eventData: any = null
      
      eventBus.on('CAMERA_MOVED', (event) => {
        eventFired = true
        eventData = event.data
      })
      
      // Trigger player movement
      eventBus.emit({
        type: 'PLAYER_MOVED',
        data: { to: { x: 1, y: 1 } }
      })
      
      cameraSystem.update(0.016)
      
      expect(eventFired).toBe(true)
      expect(eventData).toHaveProperty('position')
      expect(eventData.position).toHaveProperty('x')
      expect(eventData.position).toHaveProperty('y')
      expect(eventData.position).toHaveProperty('z')
    })
  })
})

describe('CameraBoundsSystem', () => {
  let cameraBounds: CameraBoundsSystem
  
  beforeEach(() => {
    cameraBounds = new CameraBoundsSystem()
  })
  
  it('should clamp positions within bounds', () => {
    const clamped = cameraBounds.clampPosition(15, -5)
    expect(clamped.x).toBe(10) // Max X
    expect(clamped.y).toBe(0) // Min Y
  })
  
  it('should correctly calculate visible bounds', () => {
    const visible = cameraBounds.getVisibleBounds(0, 10, 20)
    
    expect(visible.minX).toBe(-10) // Limited by map bounds
    expect(visible.maxX).toBe(10) // Limited by map bounds
    expect(visible.minY).toBe(0) // Limited by min Y
    expect(visible.maxY).toBeGreaterThan(10)
  })
})

describe('CameraEffects', () => {
  let cameraEffects: CameraEffects
  let eventBus: EventBus
  
  beforeEach(() => {
    eventBus = new EventBus()
    cameraEffects = new CameraEffects(eventBus)
  })
  
  describe('Shake Effect', () => {
    it('should create shake offset', () => {
      cameraEffects.shake({
        intensity: 1,
        duration: 1000,
        frequency: 10,
        fadeOut: false
      })
      
      const result = cameraEffects.update(0.016)
      
      // Should have non-zero offset
      expect(Math.abs(result.offset.x) + Math.abs(result.offset.y)).toBeGreaterThan(0)
    })
    
    it('should fade out shake when configured', () => {
      cameraEffects.shake({
        intensity: 1,
        duration: 1000,
        frequency: 10,
        fadeOut: true
      })
      
      // Get offset at start
      const result1 = cameraEffects.update(0.016)
      const intensity1 = Math.abs(result1.offset.x) + Math.abs(result1.offset.y)
      
      // Simulate time passing (90% through duration)
      for (let i = 0; i < 54; i++) {
        cameraEffects.update(0.016)
      }
      
      const result2 = cameraEffects.update(0.016)
      const intensity2 = Math.abs(result2.offset.x) + Math.abs(result2.offset.y)
      
      // Intensity should have decreased
      expect(intensity2).toBeLessThan(intensity1)
    })
  })
  
  describe('Zoom Effect', () => {
    it('should interpolate zoom value', () => {
      cameraEffects.zoom({
        targetZoom: 2,
        duration: 1000,
        easing: 'linear'
      })
      
      // Start at zoom 1
      const result1 = cameraEffects.update(0)
      expect(result1.zoom).toBe(1)
      
      // Halfway through
      for (let i = 0; i < 30; i++) {
        cameraEffects.update(0.016)
      }
      
      const result2 = cameraEffects.update(0.016)
      expect(result2.zoom).toBeCloseTo(1.5, 1)
    })
  })
  
  describe('Reset', () => {
    it('should reset all effects', () => {
      // Start shake and zoom
      cameraEffects.shake({
        intensity: 1,
        duration: 1000,
        frequency: 10,
        fadeOut: false
      })
      
      cameraEffects.zoom({
        targetZoom: 2,
        duration: 1000,
        easing: 'linear'
      })
      
      // Reset
      cameraEffects.reset()
      
      const result = cameraEffects.update(0.016)
      expect(result.offset.x).toBe(0)
      expect(result.offset.y).toBe(0)
      expect(result.zoom).toBe(1)
    })
  })
})