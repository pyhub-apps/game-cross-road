import { IGameState, GameStateType } from '../interfaces/IGameState';
import { IEventBus } from '../interfaces/IEventBus';
import { IGameStateHandler } from './IGameStateHandler';

export class GameStateManager {
  private states: Map<string, IGameStateHandler>;
  private currentState: IGameStateHandler | null;
  private previousState: IGameStateHandler | null;
  private eventBus: IEventBus;
  private gameState: IGameState;

  constructor(eventBus: IEventBus) {
    this.states = new Map();
    this.currentState = null;
    this.previousState = null;
    this.eventBus = eventBus;
    this.gameState = this.createInitialGameState();
  }

  /**
   * Register a state handler
   */
  registerState(state: IGameStateHandler): void {
    this.states.set(state.name, state);
  }

  /**
   * Transition to a new state
   */
  transitionTo(stateName: string): boolean {
    const newState = this.states.get(stateName);
    
    if (!newState) {
      console.error(`State '${stateName}' not found`);
      return false;
    }

    // Check if transition is allowed
    if (this.currentState && !this.currentState.canTransitionTo(stateName)) {
      console.warn(`Cannot transition from '${this.currentState.name}' to '${stateName}'`);
      return false;
    }

    // Exit current state
    if (this.currentState) {
      this.currentState.onExit(stateName);
      this.previousState = this.currentState;
    }

    // Enter new state
    const previousStateName = this.currentState?.name;
    this.currentState = newState;
    this.gameState.currentState = stateName as GameStateType;
    
    newState.onEnter(previousStateName);

    // Emit state change event
    this.eventBus.emit('gameStateChanged', {
      from: previousStateName,
      to: stateName,
      timestamp: Date.now()
    });

    return true;
  }

  /**
   * Update current state
   */
  update(deltaTime: number): void {
    if (this.currentState) {
      this.currentState.onUpdate(deltaTime);
    }
  }

  /**
   * Get current state name
   */
  getCurrentStateName(): string | null {
    return this.currentState?.name || null;
  }

  /**
   * Get game state data
   */
  getGameState(): IGameState {
    return { ...this.gameState };
  }

  /**
   * Update game state data
   */
  updateGameState(updates: Partial<IGameState>): void {
    Object.assign(this.gameState, updates);
    
    this.eventBus.emit('gameStateUpdated', {
      state: this.getGameState(),
      timestamp: Date.now()
    });
  }

  /**
   * Save game state to storage
   */
  saveState(): void {
    try {
      const stateToSave = {
        highScore: this.gameState.highScore,
        lastPlayed: new Date().toISOString()
      };
      
      localStorage.setItem('crossy_road_save', JSON.stringify(stateToSave));
      
      this.eventBus.emit('gameStateSaved', {
        timestamp: Date.now()
      });
    } catch (error) {
      console.error('Failed to save game state:', error);
    }
  }

  /**
   * Load game state from storage
   */
  loadState(): void {
    try {
      const savedState = localStorage.getItem('crossy_road_save');
      
      if (savedState) {
        const parsed = JSON.parse(savedState);
        this.gameState.highScore = parsed.highScore || 0;
        
        this.eventBus.emit('gameStateLoaded', {
          state: parsed,
          timestamp: Date.now()
        });
      }
    } catch (error) {
      console.error('Failed to load game state:', error);
    }
  }

  /**
   * Reset game state
   */
  resetGameState(): void {
    this.gameState = this.createInitialGameState();
    
    this.eventBus.emit('gameStateReset', {
      timestamp: Date.now()
    });
  }

  /**
   * Create initial game state
   */
  private createInitialGameState(): IGameState {
    return {
      currentState: 'menu',
      isPaused: false,
      playerEntityId: null,
      currentScore: 0,
      highScore: 0,
      activeLanes: [],
      visibleRange: { minY: 0, maxY: 10 },
      cameraY: 0,
      cameraScrollSpeed: 0,
      pressureTimer: 0,
      pressureActive: false,
      difficulty: 1,
      soundEnabled: true
    };
  }
}