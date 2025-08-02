/**
 * Game state interface - platform agnostic
 */
export interface IGameState {
  // Game flow
  currentState: GameStateType;
  isPaused?: boolean;
  
  // Player data
  playerEntityId: string | null;
  score: number;
  currentScore?: number;
  highScore: number;
  
  // World data
  activeLanes?: string[]; // Entity IDs of lane entities
  visibleRange?: {
    minY: number;
    maxY: number;
  };
  
  // Camera
  cameraY?: number;
  cameraScrollSpeed?: number;
  cameraOffset?: { x: number; y: number; z: number };
  
  // Pressure system
  pressureTimer?: number;
  pressureActive: boolean;
  
  // Game settings
  difficulty?: number;
  soundEnabled?: boolean;
}

export type GameStateType = 'menu' | 'playing' | 'paused' | 'gameOver';

/**
 * Game state manager interface
 */
export interface IGameStateManager {
  getState(): IGameState;
  setState(updates: Partial<IGameState>): void;
  resetGame(): void;
  saveHighScore(score: number): void;
  loadHighScore(): number;
}