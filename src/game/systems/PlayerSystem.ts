import { ISystem } from '../../core/interfaces/ISystem';
import { EntityManager } from '../../core/managers/EntityManager';
import { ComponentManager } from '../../core/managers/ComponentManager';
import { Transform } from '../../core/components/Transform';
import { Player } from '../../core/components/Player';
import { IInputManager, InputEvent } from '../../infrastructure/interfaces/IInputManager';
import { IEventBus } from '../interfaces/IEventBus';
import { IGameStateManager } from '../interfaces/IGameState';

/**
 * Player system - handles player input, movement, and scoring
 */
export class PlayerSystem implements ISystem {
  name = 'PlayerSystem';
  priority = 50; // Run before movement system
  enabled = true;
  
  private entityManager!: EntityManager;
  private componentManager!: ComponentManager;
  private inputManager: IInputManager;
  private eventBus: IEventBus;
  private gameStateManager: IGameStateManager;
  
  // Grid-based movement
  private readonly GRID_SIZE = 1;
  private isMoving = false;
  private moveQueue: InputEvent[] = [];
  
  constructor(
    inputManager: IInputManager,
    eventBus: IEventBus,
    gameStateManager: IGameStateManager
  ) {
    this.inputManager = inputManager;
    this.eventBus = eventBus;
    this.gameStateManager = gameStateManager;
  }
  
  initialize(entityManager: EntityManager, componentManager: ComponentManager): void {
    this.entityManager = entityManager;
    this.componentManager = componentManager;
    
    // Subscribe to input events
    this.inputManager.onInput(this.handleInput.bind(this));
    
    // Subscribe to collision events
    this.eventBus.on('COLLISION_DETECTED', (event) => {
      this.handleCollision(event.data);
    });
  }
  
  private handleInput(event: InputEvent): void {
    const gameState = this.gameStateManager.getState();
    if (gameState.currentState !== 'playing' || !gameState.playerEntityId) return;
    
    // Queue movement if already moving, otherwise process immediately
    if (this.isMoving) {
      this.moveQueue.push(event);
    } else {
      this.processMovement(event);
    }
  }
  
  private processMovement(event: InputEvent): void {
    const gameState = this.gameStateManager.getState();
    if (!gameState.playerEntityId) return;
    
    const entity = this.entityManager.getEntity(gameState.playerEntityId);
    if (!entity) return;
    
    const player = this.componentManager.getComponent<Player>(entity, 'player');
    const transform = this.componentManager.getComponent<Transform>(entity, 'transform');
    
    if (!player || !transform || !player.isAlive || !player.inputEnabled) return;
    
    const oldPosition = { ...transform.position };
    let moved = false;
    
    switch (event.action) {
      case 'MOVE_FORWARD':
        transform.position.y += this.GRID_SIZE;
        moved = true;
        break;
      case 'MOVE_BACKWARD':
        if (transform.position.y > 0) {
          transform.position.y -= this.GRID_SIZE;
          moved = true;
        }
        break;
      case 'MOVE_LEFT':
        transform.position.x -= this.GRID_SIZE;
        moved = true;
        break;
      case 'MOVE_RIGHT':
        transform.position.x += this.GRID_SIZE;
        moved = true;
        break;
    }
    
    if (moved) {
      // Update player state
      player.lastMoveTime = Date.now();
      
      // Update score if moved forward
      if (transform.position.y > player.highestY) {
        player.highestY = transform.position.y;
        player.score = Math.floor(player.highestY);
        
        this.eventBus.emit({
          type: 'SCORE_UPDATED',
          data: {
            score: player.score,
            highScore: Math.max(player.score, this.gameStateManager.getState().highScore)
          }
        });
      }
      
      // Emit movement event
      this.eventBus.emit({
        type: 'PLAYER_MOVED',
        data: {
          from: oldPosition,
          to: { x: transform.position.x, y: transform.position.y }
        }
      });
      
      // Brief movement animation delay
      this.isMoving = true;
      setTimeout(() => {
        this.isMoving = false;
        // Process queued movement
        if (this.moveQueue.length > 0) {
          const nextMove = this.moveQueue.shift();
          if (nextMove) this.processMovement(nextMove);
        }
      }, 100);
    }
  }
  
  private handleCollision(data: { entityA: string; entityB: string; collisionType: string }): void {
    const gameState = this.gameStateManager.getState();
    if (!gameState.playerEntityId) return;
    
    // Check if player is involved in collision
    const playerId = gameState.playerEntityId;
    if (data.entityA !== playerId && data.entityB !== playerId) return;
    
    const entity = this.entityManager.getEntity(playerId);
    if (!entity) return;
    
    const player = this.componentManager.getComponent<Player>(entity, 'player');
    if (!player || !player.isAlive) return;
    
    // Determine collision type and handle accordingly
    const collisionParts = data.collisionType.split('_');
    const otherType = collisionParts.find(part => part !== 'player');
    
    switch (otherType) {
      case 'vehicle':
        this.killPlayer('collision');
        break;
      case 'water':
        // Check if player is on a log
        if (!this.isPlayerOnLog()) {
          this.killPlayer('water');
        }
        break;
      case 'boundary':
        this.killPlayer('boundary');
        break;
    }
  }
  
  private isPlayerOnLog(): boolean {
    // Implementation would check if player is colliding with a log
    // For now, return false
    return false;
  }
  
  private killPlayer(reason: 'collision' | 'water' | 'boundary' | 'pressure'): void {
    const gameState = this.gameStateManager.getState();
    if (!gameState.playerEntityId) return;
    
    const entity = this.entityManager.getEntity(gameState.playerEntityId);
    if (!entity) return;
    
    const player = this.componentManager.getComponent<Player>(entity, 'player');
    if (!player) return;
    
    player.isAlive = false;
    player.inputEnabled = false;
    
    this.eventBus.emit({
      type: 'PLAYER_DIED',
      data: { reason }
    });
    
    // Update game state
    this.gameStateManager.setState({ currentState: 'gameOver' });
  }
  
  update(deltaTime: number): void {
    if (!this.enabled) return;
    
    const gameState = this.gameStateManager.getState();
    if (gameState.currentState !== 'playing' || !gameState.playerEntityId) return;
    
    const entity = this.entityManager.getEntity(gameState.playerEntityId);
    if (!entity) return;
    
    const player = this.componentManager.getComponent<Player>(entity, 'player');
    if (!player || !player.isAlive) return;
    
    // Check pressure system
    const timeSinceLastMove = Date.now() - player.lastMoveTime;
    if (timeSinceLastMove > 3000 && !gameState.pressureActive) {
      this.gameStateManager.setState({ pressureActive: true });
      this.eventBus.emit({
        type: 'PRESSURE_ACTIVATED',
        data: { timeRemaining: 3 }
      });
    }
  }
  
  destroy(): void {
    this.moveQueue = [];
  }
}