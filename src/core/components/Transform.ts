import { IComponent } from '../interfaces/IComponent';

/**
 * Transform component for entity position, rotation, and scale
 */
export interface Transform extends IComponent {
  type: 'transform';
  position: {
    x: number;
    y: number;
    z: number;
  };
  rotation: {
    x: number;
    y: number;
    z: number;
  };
  scale: {
    x: number;
    y: number;
    z: number;
  };
}

export const createTransform = (
  x = 0,
  y = 0,
  z = 0,
  rotX = 0,
  rotY = 0,
  rotZ = 0,
  scaleX = 1,
  scaleY = 1,
  scaleZ = 1
): Transform => ({
  type: 'transform',
  position: { x, y, z },
  rotation: { x: rotX, y: rotY, z: rotZ },
  scale: { x: scaleX, y: scaleY, z: scaleZ }
});