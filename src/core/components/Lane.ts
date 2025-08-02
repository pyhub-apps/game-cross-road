import { IComponent } from '../interfaces/IComponent';

/**
 * Lane types for procedural generation
 */
export type LaneType = 'grass' | 'road' | 'river' | 'railway';

/**
 * Lane component for map lanes
 */
export interface Lane extends IComponent {
  type: 'lane';
  laneType: LaneType;
  laneIndex: number; // Y position in the grid
  spawnPattern?: {
    spawnInterval: number;
    spawnSpeed: number;
    spawnDirection: 'left' | 'right';
    obstacleTypes: string[];
  };
}

export const createLane = (
  laneType: LaneType,
  laneIndex: number,
  spawnPattern?: Lane['spawnPattern']
): Lane => ({
  type: 'lane',
  laneType,
  laneIndex,
  spawnPattern
});