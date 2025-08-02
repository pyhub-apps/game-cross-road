import { EntityManager } from './EntityManager';
import { ComponentManager } from './ComponentManager';
import { SystemManager } from './SystemManager';
import { IEntity } from '../interfaces/IEntity';
import { IComponent } from '../interfaces/IComponent';
import { ISystem } from '../interfaces/ISystem';

/**
 * World class - Main entry point for the ECS system
 */
export class World {
  private entityManager: EntityManager;
  private componentManager: ComponentManager;
  private systemManager: SystemManager;
  private isRunning: boolean;
  private lastUpdateTime: number;

  constructor() {
    this.entityManager = new EntityManager();
    this.componentManager = new ComponentManager(this.entityManager);
    this.systemManager = new SystemManager(this.entityManager, this.componentManager);
    this.isRunning = false;
    this.lastUpdateTime = 0;
  }

  /**
   * Create a new entity
   */
  createEntity(): IEntity {
    return this.entityManager.createEntity();
  }

  /**
   * Remove an entity
   */
  removeEntity(entityId: string): void {
    const entity = this.entityManager.getEntity(entityId);
    if (entity) {
      // Remove all components first
      entity.components.forEach((_, componentType) => {
        this.componentManager.removeComponent(entity, componentType);
      });
      
      // Then remove the entity
      this.entityManager.removeEntity(entityId);
    }
  }

  /**
   * Add component to entity
   */
  addComponent<T extends IComponent>(entity: IEntity, component: T): void {
    this.componentManager.addComponent(entity, component);
  }

  /**
   * Remove component from entity
   */
  removeComponent(entity: IEntity, componentType: string): void {
    this.componentManager.removeComponent(entity, componentType);
  }

  /**
   * Get component from entity
   */
  getComponent<T extends IComponent>(entity: IEntity, componentType: string): T | undefined {
    return this.componentManager.getComponent<T>(entity, componentType);
  }

  /**
   * Register a system
   */
  registerSystem(system: ISystem, priority: number = 0): void {
    this.systemManager.registerSystem(system, priority);
  }

  /**
   * Unregister a system
   */
  unregisterSystem(systemName: string): void {
    this.systemManager.unregisterSystem(systemName);
  }

  /**
   * Query entities with specific components
   */
  query(componentTypes: string[]): IEntity[] {
    return this.componentManager.getEntitiesWithComponents(componentTypes);
  }

  /**
   * Update the world
   */
  update(currentTime: number): void {
    if (!this.isRunning) return;

    const deltaTime = this.lastUpdateTime === 0 
      ? 0 
      : (currentTime - this.lastUpdateTime) / 1000; // Convert to seconds

    this.systemManager.update(deltaTime);
    this.lastUpdateTime = currentTime;
  }

  /**
   * Start the world
   */
  start(): void {
    this.isRunning = true;
    this.lastUpdateTime = performance.now();
  }

  /**
   * Stop the world
   */
  stop(): void {
    this.isRunning = false;
  }

  /**
   * Clear the world
   */
  clear(): void {
    this.systemManager.clear();
    this.componentManager.clear();
    this.entityManager.clear();
    this.lastUpdateTime = 0;
  }

  /**
   * Get world statistics
   */
  getStats(): Record<string, any> {
    return {
      entities: this.entityManager.getEntityCount(),
      components: this.componentManager.getStats(),
      systems: this.systemManager.getStats(),
      isRunning: this.isRunning
    };
  }

  /**
   * Create entity with components (convenience method)
   */
  createEntityWith(...components: IComponent[]): IEntity {
    const entity = this.createEntity();
    
    components.forEach(component => {
      this.addComponent(entity, component);
    });
    
    return entity;
  }

  // Getters for direct access to managers (for advanced usage)
  get entities(): EntityManager {
    return this.entityManager;
  }

  get components(): ComponentManager {
    return this.componentManager;
  }

  get systems(): SystemManager {
    return this.systemManager;
  }
}