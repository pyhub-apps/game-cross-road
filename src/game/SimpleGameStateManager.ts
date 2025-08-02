import { IGameStateManager, IGameState } from './interfaces/IGameState'

/**
 * Simple game state manager for basic state management
 */
export class SimpleGameStateManager implements IGameStateManager {
  private state: IGameState
  
  constructor() {
    this.state = {
      currentState: 'menu',
      playerEntityId: null,
      score: 0,
      highScore: 0,
      pressureActive: false,
      cameraOffset: { x: 0, y: -5, z: 10 }
    }
  }
  
  getState(): IGameState {
    return { ...this.state }
  }
  
  setState(partialState: Partial<IGameState>): void {
    this.state = { ...this.state, ...partialState }
  }
  
  resetGame(): void {
    this.state = {
      ...this.state,
      currentState: 'menu',
      playerEntityId: null,
      score: 0,
      pressureActive: false
    }
  }
  
  saveHighScore(score: number): void {
    if (score > this.state.highScore) {
      this.state.highScore = score
      // Could save to localStorage here
    }
  }
  
  loadHighScore(): number {
    // Could load from localStorage here
    return this.state.highScore
  }
}