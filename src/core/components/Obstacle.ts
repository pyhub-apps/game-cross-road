import { IComponent } from '../interfaces/IComponent';

/**
 * Obstacle types for different behaviors
 */
export type ObstacleType = 'car' | 'truck' | 'train' | 'log' | 'tree' | 'rock';

/**
 * Obstacle component for various game obstacles
 */
export interface Obstacle extends IComponent {
  type: 'obstacle';
  obstacleType: ObstacleType;
  isMoving: boolean;
  moveSpeed: number;
  moveDirection: 'left' | 'right' | 'none';
  isRideable: boolean; // For logs on water
}

export const createObstacle = (
  obstacleType: ObstacleType,
  isMoving = false,
  moveSpeed = 0,
  moveDirection: Obstacle['moveDirection'] = 'none',
  isRideable = false
): Obstacle => ({
  type: 'obstacle',
  obstacleType,
  isMoving,
  moveSpeed,
  moveDirection,
  isRideable
});