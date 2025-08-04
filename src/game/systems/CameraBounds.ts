import { GAME_CONFIG } from '../../shared/constants/GameConfig'

/**
 * Camera boundary configuration
 */
export interface CameraBounds {
  minX: number
  maxX: number
  minY: number
  maxY: number
  padding: {
    top: number
    bottom: number
    left: number
    right: number
  }
}

/**
 * Camera bounds system for managing viewport constraints
 */
export class CameraBoundsSystem {
  private bounds: CameraBounds
  private mapWidth: number = 20 // From -10 to 10 based on MapGenerator
  
  constructor() {
    // Initialize bounds based on map dimensions
    this.bounds = {
      minX: -10,
      maxX: 10,
      minY: 0, // Camera can't go below starting position
      maxY: Infinity, // No upper limit
      padding: {
        top: 5,
        bottom: 5,
        left: 2,
        right: 2
      }
    }
  }
  
  /**
   * Clamp camera position within bounds
   */
  public clampPosition(x: number, y: number): { x: number; y: number } {
    return {
      x: Math.max(this.bounds.minX, Math.min(this.bounds.maxX, x)),
      y: Math.max(this.bounds.minY, Math.min(this.bounds.maxY, y))
    }
  }
  
  /**
   * Check if a position is within camera frustum
   */
  public isInFrustum(x: number, y: number, cameraX: number, cameraY: number, viewDistance: number = 20): boolean {
    const halfView = viewDistance / 2
    
    return x >= cameraX - halfView - this.bounds.padding.left &&
           x <= cameraX + halfView + this.bounds.padding.right &&
           y >= cameraY - halfView - this.bounds.padding.bottom &&
           y <= cameraY + halfView + this.bounds.padding.top
  }
  
  /**
   * Get visible bounds for a given camera position
   */
  public getVisibleBounds(cameraX: number, cameraY: number, viewDistance: number = 20): {
    minX: number
    maxX: number
    minY: number
    maxY: number
  } {
    const halfView = viewDistance / 2
    
    return {
      minX: Math.max(this.bounds.minX, cameraX - halfView - this.bounds.padding.left),
      maxX: Math.min(this.bounds.maxX, cameraX + halfView + this.bounds.padding.right),
      minY: Math.max(this.bounds.minY, cameraY - halfView - this.bounds.padding.bottom),
      maxY: Math.min(this.bounds.maxY, cameraY + halfView + this.bounds.padding.top)
    }
  }
  
  /**
   * Update bounds (e.g., for dynamic map expansion)
   */
  public updateBounds(bounds: Partial<CameraBounds>): void {
    this.bounds = { ...this.bounds, ...bounds }
  }
  
  /**
   * Get current bounds
   */
  public getBounds(): CameraBounds {
    return { ...this.bounds }
  }
}