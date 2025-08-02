import { IComponent } from '../interfaces/IComponent';

/**
 * Collider types for different collision behaviors
 */
export type ColliderType = 'player' | 'vehicle' | 'water' | 'log' | 'boundary';

/**
 * Collider component for collision detection
 */
export interface Collider extends IComponent {
  type: 'collider';
  colliderType: ColliderType;
  bounds: {
    width: number;
    height: number;
    depth: number;
  };
  offset: {
    x: number;
    y: number;
    z: number;
  };
  isTrigger: boolean; // True for triggers (water), false for solid collisions
}

export const createCollider = (
  colliderType: ColliderType,
  width: number,
  height: number,
  depth: number,
  isTrigger = false,
  offsetX = 0,
  offsetY = 0,
  offsetZ = 0
): Collider => ({
  type: 'collider',
  colliderType,
  bounds: { width, height, depth },
  offset: { x: offsetX, y: offsetY, z: offsetZ },
  isTrigger
});