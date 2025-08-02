/**
 * Input types supported by the game
 */
export type InputAction = 
  | 'MOVE_FORWARD'
  | 'MOVE_BACKWARD'
  | 'MOVE_LEFT'
  | 'MOVE_RIGHT'
  | 'PAUSE'
  | 'RESTART';

/**
 * Input event data
 */
export interface InputEvent {
  action: InputAction;
  timestamp: number;
  source: 'keyboard' | 'mouse' | 'touch' | 'gamepad';
}

/**
 * Input handler callback
 */
export type InputHandler = (event: InputEvent) => void;

/**
 * Platform-agnostic input manager interface
 */
export interface IInputManager {
  /**
   * Initialize input system
   */
  initialize(): void;
  
  /**
   * Register input handler
   */
  onInput(handler: InputHandler): () => void; // Returns unsubscribe
  
  /**
   * Enable/disable input
   */
  setEnabled(enabled: boolean): void;
  
  /**
   * Check if input is enabled
   */
  isEnabled(): boolean;
  
  /**
   * Get last input time (for pressure system)
   */
  getLastInputTime(): number;
  
  /**
   * Clean up resources
   */
  destroy(): void;
}