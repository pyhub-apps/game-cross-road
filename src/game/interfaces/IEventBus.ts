/**
 * Game events for decoupled communication
 */
export type GameEvent = 
  | { type: 'PLAYER_MOVED'; data: { from: { x: number; y: number }; to: { x: number; y: number } } }
  | { type: 'PLAYER_DIED'; data: { reason: 'collision' | 'water' | 'boundary' | 'pressure' } }
  | { type: 'SCORE_UPDATED'; data: { score: number; highScore: number } }
  | { type: 'LANE_SPAWNED'; data: { laneId: string; yPosition: number } }
  | { type: 'LANE_DESPAWNED'; data: { laneId: string } }
  | { type: 'OBSTACLE_SPAWNED'; data: { obstacleId: string; laneId: string } }
  | { type: 'OBSTACLE_DESPAWNED'; data: { obstacleId: string } }
  | { type: 'PRESSURE_ACTIVATED'; data: { timeRemaining: number } }
  | { type: 'PRESSURE_DEACTIVATED'; data: {} }
  | { type: 'GAME_STATE_CHANGED'; data: { from: string; to: string } }
  | { type: 'COLLISION_DETECTED'; data: { entityA: string; entityB: string; collisionType: string } }
  | { type: 'LANES_UPDATED'; data: { visibleLanes: number; totalLanes: number } }
  | { type: 'CAMERA_MOVED'; data: { position: { x: number; y: number; z: number } } };

/**
 * Event handler type
 */
export type EventHandler<T extends GameEvent['type']> = (
  event: Extract<GameEvent, { type: T }>
) => void;

/**
 * Event bus interface for decoupled communication
 */
export interface IEventBus {
  /**
   * Subscribe to an event
   */
  on<T extends GameEvent['type']>(
    eventType: T,
    handler: EventHandler<T>
  ): () => void; // Returns unsubscribe function
  
  /**
   * Emit an event
   */
  emit(event: GameEvent): void;
  
  /**
   * Remove all handlers for an event type
   */
  off(eventType: GameEvent['type']): void;
  
  /**
   * Clear all event handlers
   */
  clear(): void;
}