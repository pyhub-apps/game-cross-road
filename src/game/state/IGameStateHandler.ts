import { IEventBus } from '../interfaces/IEventBus';

/**
 * Interface for game state handlers
 */
export interface IGameStateHandler {
  name: string;
  
  /**
   * Called when entering this state
   */
  onEnter(previousState?: string): void;
  
  /**
   * Called every frame while in this state
   */
  onUpdate(deltaTime: number): void;
  
  /**
   * Called when exiting this state
   */
  onExit(nextState?: string): void;
  
  /**
   * Check if transition to another state is allowed
   */
  canTransitionTo(nextState: string): boolean;
}