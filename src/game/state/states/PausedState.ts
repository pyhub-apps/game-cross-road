import { IGameStateHandler } from '../IGameStateHandler';
import { GameStateManager } from '../GameStateManager';

export class PausedState implements IGameStateHandler {
  name = 'paused';
  private stateManager: GameStateManager;
  private pauseStartTime: number = 0;

  constructor(stateManager: GameStateManager) {
    this.stateManager = stateManager;
  }

  onEnter(previousState?: string): void {
    console.log(`Entering Paused state from ${previousState}`);
    
    this.pauseStartTime = Date.now();
    
    this.stateManager.updateGameState({
      isPaused: true,
      isPlaying: false
    });
  }

  onUpdate(deltaTime: number): void {
    // No game updates while paused
    // Could update pause menu animations here
  }

  onExit(nextState?: string): void {
    console.log(`Exiting Paused state to ${nextState}`);
    
    const pauseDuration = Date.now() - this.pauseStartTime;
    console.log(`Game was paused for ${pauseDuration}ms`);
  }

  canTransitionTo(nextState: string): boolean {
    // From paused, can resume playing or go to menu
    return nextState === 'playing' || nextState === 'menu';
  }
}