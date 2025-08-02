import { IGameStateHandler } from '../IGameStateHandler';
import { GameStateManager } from '../GameStateManager';

export class PlayingState implements IGameStateHandler {
  name = 'playing';
  private stateManager: GameStateManager;

  constructor(stateManager: GameStateManager) {
    this.stateManager = stateManager;
  }

  onEnter(previousState?: string): void {
    console.log(`Entering Playing state from ${previousState}`);
    
    this.stateManager.updateGameState({
      isPlaying: true,
      isPaused: false
    });

    // Initialize game session
    if (previousState === 'menu') {
      this.stateManager.updateGameState({
        score: 0,
        lives: 3,
        timeElapsed: 0
      });
    }
  }

  onUpdate(deltaTime: number): void {
    const state = this.stateManager.getGameState();
    
    // Update game time
    this.stateManager.updateGameState({
      timeElapsed: state.timeElapsed + deltaTime
    });

    // Check game over conditions
    if (state.lives <= 0) {
      this.stateManager.transitionTo('gameOver');
    }
  }

  onExit(nextState?: string): void {
    console.log(`Exiting Playing state to ${nextState}`);
    
    // Save high score if game over
    if (nextState === 'gameOver') {
      const state = this.stateManager.getGameState();
      if (state.score > state.highScore) {
        this.stateManager.updateGameState({
          highScore: state.score
        });
        this.stateManager.saveState();
      }
    }
  }

  canTransitionTo(nextState: string): boolean {
    // From playing, can go to paused or game over
    return nextState === 'paused' || nextState === 'gameOver';
  }
}