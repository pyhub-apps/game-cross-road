import { IComponent } from '../interfaces/IComponent';

/**
 * Velocity component for moving entities
 */
export interface Velocity extends IComponent {
  type: 'velocity';
  linear: {
    x: number;
    y: number;
    z: number;
  };
  angular: {
    x: number;
    y: number;
    z: number;
  };
}

export const createVelocity = (
  vx = 0,
  vy = 0,
  vz = 0,
  avx = 0,
  avy = 0,
  avz = 0
): Velocity => ({
  type: 'velocity',
  linear: { x: vx, y: vy, z: vz },
  angular: { x: avx, y: avy, z: avz }
});