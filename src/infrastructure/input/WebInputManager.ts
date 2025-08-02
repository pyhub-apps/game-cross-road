import { IInputManager, InputHandler, InputEvent, InputAction } from '../interfaces/IInputManager';

/**
 * Web-based input manager for keyboard, mouse, and touch input
 */
export class WebInputManager implements IInputManager {
  private handlers: Set<InputHandler> = new Set();
  private enabled = true;
  private lastInputTime = Date.now();
  
  // Touch gesture tracking
  private touchStartPos: { x: number; y: number } | null = null;
  private touchStartTime = 0;
  
  // Key mapping
  private keyMap: Record<string, InputAction> = {
    'ArrowUp': 'MOVE_FORWARD',
    'ArrowDown': 'MOVE_BACKWARD',
    'ArrowLeft': 'MOVE_LEFT',
    'ArrowRight': 'MOVE_RIGHT',
    'w': 'MOVE_FORWARD',
    's': 'MOVE_BACKWARD',
    'a': 'MOVE_LEFT',
    'd': 'MOVE_RIGHT',
    'W': 'MOVE_FORWARD',
    'S': 'MOVE_BACKWARD',
    'A': 'MOVE_LEFT',
    'D': 'MOVE_RIGHT',
    'Escape': 'PAUSE',
    'r': 'RESTART',
    'R': 'RESTART'
  };
  
  initialize(): void {
    // Keyboard events
    window.addEventListener('keydown', this.handleKeyDown);
    
    // Mouse events
    window.addEventListener('click', this.handleClick);
    
    // Touch events
    window.addEventListener('touchstart', this.handleTouchStart);
    window.addEventListener('touchend', this.handleTouchEnd);
    
    // Prevent default touch behaviors
    window.addEventListener('touchmove', this.preventDefault, { passive: false });
  }
  
  onInput(handler: InputHandler): () => void {
    this.handlers.add(handler);
    return () => this.handlers.delete(handler);
  }
  
  setEnabled(enabled: boolean): void {
    this.enabled = enabled;
  }
  
  isEnabled(): boolean {
    return this.enabled;
  }
  
  getLastInputTime(): number {
    return this.lastInputTime;
  }
  
  destroy(): void {
    window.removeEventListener('keydown', this.handleKeyDown);
    window.removeEventListener('click', this.handleClick);
    window.removeEventListener('touchstart', this.handleTouchStart);
    window.removeEventListener('touchend', this.handleTouchEnd);
    window.removeEventListener('touchmove', this.preventDefault);
    this.handlers.clear();
  }
  
  private handleKeyDown = (event: KeyboardEvent): void => {
    if (!this.enabled) return;
    
    const action = this.keyMap[event.key];
    if (!action) return;
    
    event.preventDefault();
    this.emitInput({
      action,
      timestamp: Date.now(),
      source: 'keyboard'
    });
  };
  
  private handleClick = (event: MouseEvent): void => {
    if (!this.enabled) return;
    
    // Click/tap moves forward
    this.emitInput({
      action: 'MOVE_FORWARD',
      timestamp: Date.now(),
      source: 'mouse'
    });
  };
  
  private handleTouchStart = (event: TouchEvent): void => {
    if (!this.enabled || event.touches.length === 0) return;
    
    const touch = event.touches[0];
    this.touchStartPos = { x: touch.clientX, y: touch.clientY };
    this.touchStartTime = Date.now();
  };
  
  private handleTouchEnd = (event: TouchEvent): void => {
    if (!this.enabled || !this.touchStartPos) return;
    
    const touch = event.changedTouches[0];
    const deltaX = touch.clientX - this.touchStartPos.x;
    const deltaY = touch.clientY - this.touchStartPos.y;
    const deltaTime = Date.now() - this.touchStartTime;
    
    // Determine if it's a tap or swipe
    const distance = Math.sqrt(deltaX * deltaX + deltaY * deltaY);
    const isTap = distance < 10 && deltaTime < 300;
    
    if (isTap) {
      this.emitInput({
        action: 'MOVE_FORWARD',
        timestamp: Date.now(),
        source: 'touch'
      });
    } else if (distance > 30) {
      // Swipe detection
      let action: InputAction;
      
      if (Math.abs(deltaX) > Math.abs(deltaY)) {
        // Horizontal swipe
        action = deltaX > 0 ? 'MOVE_RIGHT' : 'MOVE_LEFT';
      } else {
        // Vertical swipe
        action = deltaY > 0 ? 'MOVE_BACKWARD' : 'MOVE_FORWARD';
      }
      
      this.emitInput({
        action,
        timestamp: Date.now(),
        source: 'touch'
      });
    }
    
    this.touchStartPos = null;
  };
  
  private preventDefault = (event: TouchEvent): void => {
    if (this.enabled) {
      event.preventDefault();
    }
  };
  
  private emitInput(event: InputEvent): void {
    this.lastInputTime = event.timestamp;
    
    // Notify all handlers
    for (const handler of this.handlers) {
      try {
        handler(event);
      } catch (error) {
        console.error('Error in input handler:', error);
      }
    }
  }
}