import { IEventBus, GameEvent, EventHandler } from '../interfaces/IEventBus';

/**
 * Event bus implementation for decoupled communication
 */
export class EventBus implements IEventBus {
  private handlers: Map<GameEvent['type'], Set<EventHandler<any>>> = new Map();
  
  on<T extends GameEvent['type']>(
    eventType: T,
    handler: EventHandler<T>
  ): () => void {
    if (!this.handlers.has(eventType)) {
      this.handlers.set(eventType, new Set());
    }
    
    const handlersSet = this.handlers.get(eventType)!;
    handlersSet.add(handler);
    
    // Return unsubscribe function
    return () => {
      handlersSet.delete(handler);
      if (handlersSet.size === 0) {
        this.handlers.delete(eventType);
      }
    };
  }
  
  emit(event: GameEvent): void {
    const handlers = this.handlers.get(event.type);
    if (!handlers) return;
    
    // Create a copy to avoid issues if handlers modify the set
    const handlersCopy = Array.from(handlers);
    
    for (const handler of handlersCopy) {
      try {
        handler(event);
      } catch (error) {
        console.error(`Error in event handler for ${event.type}:`, error);
      }
    }
  }
  
  off(eventType: GameEvent['type']): void {
    this.handlers.delete(eventType);
  }
  
  clear(): void {
    this.handlers.clear();
  }
  
  /**
   * Get handler count for debugging
   */
  getHandlerCount(eventType?: GameEvent['type']): number {
    if (eventType) {
      const handlers = this.handlers.get(eventType);
      return handlers ? handlers.size : 0;
    }
    
    let total = 0;
    for (const handlers of this.handlers.values()) {
      total += handlers.size;
    }
    return total;
  }
}