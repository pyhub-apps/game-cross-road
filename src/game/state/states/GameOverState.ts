import { IGameStateHandler } from '../IGameStateHandler';
import { GameStateManager } from '../GameStateManager';

export class GameOverState implements IGameStateHandler {
  name = 'gameOver';
  private stateManager: GameStateManager;

  constructor(stateManager: GameStateManager) {
    this.stateManager = stateManager;
  }

  onEnter(previousState?: string): void {
    console.log(`Entering GameOver state from ${previousState}`);
    
    const state = this.stateManager.getGameState();
    
    this.stateManager.updateGameState({
      isPlaying: false,
      isPaused: false
    });

    // Check for new high score
    if (state.score > state.highScore) {
      console.log(`New high score: ${state.score}!`);
      this.stateManager.updateGameState({
        highScore: state.score
      });
      this.stateManager.saveState();
    }

    // Log final stats
    console.log(`Game Over - Score: ${state.score}, Time: ${state.timeElapsed}s`);
  }

  onUpdate(deltaTime: number): void {
    // Could update game over screen animations here
  }

  onExit(nextState?: string): void {
    console.log(`Exiting GameOver state to ${nextState}`);
  }

  canTransitionTo(nextState: string): boolean {
    // From game over, can only go back to menu
    return nextState === 'menu';
  }
}