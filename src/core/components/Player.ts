import { IComponent } from '../interfaces/IComponent';

/**
 * Player component for player-specific data
 */
export interface Player extends IComponent {
  type: 'player';
  score: number;
  highestY: number;
  isAlive: boolean;
  inputEnabled: boolean;
  lastMoveTime: number; // For pressure system
}

export const createPlayer = (): Player => ({
  type: 'player',
  score: 0,
  highestY: 0,
  isAlive: true,
  inputEnabled: true,
  lastMoveTime: Date.now()
});