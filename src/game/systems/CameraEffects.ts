import { IEventBus } from '../interfaces/IEventBus'

export interface CameraShakeConfig {
  intensity: number      // Shake strength (0-1)
  duration: number      // Duration in milliseconds
  frequency: number     // Shake frequency (oscillations per second)
  fadeOut: boolean      // Whether to fade out the shake
}

export interface CameraZoomConfig {
  targetZoom: number    // Target zoom level
  duration: number      // Duration in milliseconds
  easing: 'linear' | 'ease-in' | 'ease-out' | 'ease-in-out'
}

export interface CameraFocusConfig {
  target: { x: number; y: number }  // Focus target position
  zoomLevel: number                 // Zoom level when focused
  duration: number                  // Duration in milliseconds
  vignette: boolean                 // Add vignette effect
}

/**
 * Camera effects system for visual feedback
 */
export class CameraEffects {
  private eventBus: IEventBus
  
  // Shake state
  private isShaking: boolean = false
  private shakeConfig: CameraShakeConfig | null = null
  private shakeStartTime: number = 0
  private shakeOffset: { x: number; y: number } = { x: 0, y: 0 }
  
  // Zoom state
  private isZooming: boolean = false
  private zoomConfig: CameraZoomConfig | null = null
  private zoomStartTime: number = 0
  private startZoom: number = 1
  private currentZoom: number = 1
  
  // Focus state
  private isFocusing: boolean = false
  private focusConfig: CameraFocusConfig | null = null
  private focusStartTime: number = 0
  private originalPosition: { x: number; y: number } | null = null
  
  constructor(eventBus: IEventBus) {
    this.eventBus = eventBus
    
    // Listen for effect triggers
    this.eventBus.on('CAMERA_SHAKE', (event) => {
      this.shake(event.data)
    })
    
    this.eventBus.on('CAMERA_ZOOM', (event) => {
      this.zoom(event.data)
    })
    
    this.eventBus.on('CAMERA_FOCUS', (event) => {
      this.focus(event.data)
    })
    
    this.eventBus.on('CAMERA_RESET_EFFECTS', () => {
      this.reset()
    })
  }
  
  /**
   * Trigger camera shake effect
   */
  public shake(config: CameraShakeConfig): void {
    this.isShaking = true
    this.shakeConfig = config
    this.shakeStartTime = Date.now()
    
    console.log('Camera shake started:', config)
  }
  
  /**
   * Trigger camera zoom effect
   */
  public zoom(config: CameraZoomConfig): void {
    this.isZooming = true
    this.zoomConfig = config
    this.zoomStartTime = Date.now()
    this.startZoom = this.currentZoom
    
    console.log('Camera zoom started:', config)
  }
  
  /**
   * Trigger camera focus effect
   */
  public focus(config: CameraFocusConfig): void {
    this.isFocusing = true
    this.focusConfig = config
    this.focusStartTime = Date.now()
    
    console.log('Camera focus started:', config)
  }
  
  /**
   * Update camera effects
   */
  public update(deltaTime: number): { offset: { x: number; y: number }; zoom: number } {
    const now = Date.now()
    let offset = { x: 0, y: 0 }
    let zoom = this.currentZoom
    
    // Update shake effect
    if (this.isShaking && this.shakeConfig) {
      const elapsed = now - this.shakeStartTime
      const progress = Math.min(elapsed / this.shakeConfig.duration, 1)
      
      if (progress < 1) {
        const intensity = this.shakeConfig.fadeOut 
          ? this.shakeConfig.intensity * (1 - progress)
          : this.shakeConfig.intensity
        
        // Calculate shake offset using sin/cos for smooth movement
        const time = elapsed / 1000
        offset.x = Math.sin(time * this.shakeConfig.frequency * 2 * Math.PI) * intensity
        offset.y = Math.cos(time * this.shakeConfig.frequency * 2 * Math.PI * 0.7) * intensity
        
        this.shakeOffset = offset
      } else {
        this.isShaking = false
        this.shakeConfig = null
        this.shakeOffset = { x: 0, y: 0 }
      }
    }
    
    // Update zoom effect
    if (this.isZooming && this.zoomConfig) {
      const elapsed = now - this.zoomStartTime
      const progress = Math.min(elapsed / this.zoomConfig.duration, 1)
      
      if (progress < 1) {
        const easedProgress = this.applyEasing(progress, this.zoomConfig.easing)
        zoom = this.startZoom + (this.zoomConfig.targetZoom - this.startZoom) * easedProgress
        this.currentZoom = zoom
      } else {
        this.isZooming = false
        this.currentZoom = this.zoomConfig.targetZoom
        zoom = this.currentZoom
      }
    }
    
    // Update focus effect
    if (this.isFocusing && this.focusConfig) {
      const elapsed = now - this.focusStartTime
      const progress = Math.min(elapsed / this.focusConfig.duration, 1)
      
      if (progress < 1) {
        const easedProgress = this.applyEasing(progress, 'ease-in-out')
        
        // Emit focus position update
        this.eventBus.emit({
          type: 'CAMERA_FOCUS_UPDATE',
          data: {
            progress: easedProgress,
            target: this.focusConfig.target,
            zoom: this.focusConfig.zoomLevel,
            vignette: this.focusConfig.vignette
          }
        })
      } else {
        this.isFocusing = false
        this.focusConfig = null
      }
    }
    
    // Combine all offsets
    return {
      offset: {
        x: offset.x + this.shakeOffset.x,
        y: offset.y + this.shakeOffset.y
      },
      zoom
    }
  }
  
  /**
   * Reset all camera effects
   */
  public reset(): void {
    this.isShaking = false
    this.shakeConfig = null
    this.shakeOffset = { x: 0, y: 0 }
    
    this.isZooming = false
    this.zoomConfig = null
    this.currentZoom = 1
    
    this.isFocusing = false
    this.focusConfig = null
    
    console.log('Camera effects reset')
  }
  
  /**
   * Apply easing function
   */
  private applyEasing(t: number, easing: string): number {
    switch (easing) {
      case 'linear':
        return t
      case 'ease-in':
        return t * t
      case 'ease-out':
        return t * (2 - t)
      case 'ease-in-out':
        return t < 0.5 
          ? 2 * t * t 
          : -1 + (4 - 2 * t) * t
      default:
        return t
    }
  }
  
  /**
   * Get current effect states
   */
  public getStates(): {
    isShaking: boolean
    isZooming: boolean
    isFocusing: boolean
    currentZoom: number
    shakeOffset: { x: number; y: number }
  } {
    return {
      isShaking: this.isShaking,
      isZooming: this.isZooming,
      isFocusing: this.isFocusing,
      currentZoom: this.currentZoom,
      shakeOffset: this.shakeOffset
    }
  }
}