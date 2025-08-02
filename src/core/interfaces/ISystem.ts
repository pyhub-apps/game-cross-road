import { IEntityManager } from './IEntity';
import { IComponentManager } from './IComponent';

/**
 * Base System interface for the ECS pattern
 * Systems contain the game logic and operate on entities with specific components
 */
export interface ISystem {
  name: string;
  priority: number; // Lower numbers run first
  enabled: boolean;
  
  /**
   * Initialize the system
   */
  initialize(entityManager: IEntityManager, componentManager: IComponentManager): void;
  
  /**
   * Update the system - called every frame
   * @param deltaTime Time since last update in seconds
   */
  update(deltaTime: number): void;
  
  /**
   * Clean up system resources
   */
  destroy(): void;
}

/**
 * System manager interface for coordinating all systems
 */
export interface ISystemManager {
  registerSystem(system: ISystem): void;
  unregisterSystem(systemName: string): void;
  getSystem<T extends ISystem>(systemName: string): T | undefined;
  updateAllSystems(deltaTime: number): void;
  enableSystem(systemName: string): void;
  disableSystem(systemName: string): void;
}