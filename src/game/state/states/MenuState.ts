import { IGameStateHandler } from '../IGameStateHandler';
import { GameStateManager } from '../GameStateManager';

export class MenuState implements IGameStateHandler {
  name = 'menu';
  private stateManager: GameStateManager;

  constructor(stateManager: GameStateManager) {
    this.stateManager = stateManager;
  }

  onEnter(previousState?: string): void {
    console.log(`Entering Menu state from ${previousState || 'initial'}`);
    
    // Reset game state when returning to menu
    if (previousState === 'gameOver') {
      this.stateManager.updateGameState({
        score: 0,
        lives: 3,
        timeElapsed: 0
      });
    }

    this.stateManager.updateGameState({
      isPlaying: false,
      isPaused: false
    });
  }

  onUpdate(deltaTime: number): void {
    // Menu idle animations or effects could go here
  }

  onExit(nextState?: string): void {
    console.log(`Exiting Menu state to ${nextState}`);
  }

  canTransitionTo(nextState: string): boolean {
    // From menu, can only go to playing
    return nextState === 'playing';
  }
}