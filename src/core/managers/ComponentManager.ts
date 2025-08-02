import { IComponent } from '../interfaces/IComponent';
import { IEntity } from '../interfaces/IEntity';
import { EntityManager } from './EntityManager';

export class ComponentManager {
  private componentPools: Map<string, IComponent[]>;
  private entityManager: EntityManager;

  constructor(entityManager: EntityManager) {
    this.componentPools = new Map();
    this.entityManager = entityManager;
  }

  /**
   * Add component to entity
   */
  addComponent<T extends IComponent>(entity: IEntity, component: T): void {
    if (!entity.isActive) {
      console.warn(`Cannot add component to inactive entity ${entity.id}`);
      return;
    }

    const componentType = component.type;
    
    // Store in entity
    entity.components.set(componentType, component);
    
    // Store in component pool for fast queries
    if (!this.componentPools.has(componentType)) {
      this.componentPools.set(componentType, []);
    }
    
    const pool = this.componentPools.get(componentType)!;
    if (!pool.includes(component)) {
      pool.push(component);
    }
  }

  /**
   * Remove component from entity
   */
  removeComponent(entity: IEntity, componentType: string): void {
    const component = entity.components.get(componentType);
    if (component) {
      entity.components.delete(componentType);
      
      // Remove from pool
      const pool = this.componentPools.get(componentType);
      if (pool) {
        const index = pool.indexOf(component);
        if (index !== -1) {
          pool.splice(index, 1);
        }
      }
    }
  }

  /**
   * Get component from entity
   */
  getComponent<T extends IComponent>(entity: IEntity, componentType: string): T | undefined {
    return entity.components.get(componentType) as T;
  }

  /**
   * Check if entity has component
   */
  hasComponent(entity: IEntity, componentType: string): boolean {
    return entity.components.has(componentType);
  }

  /**
   * Get all entities with specific components
   */
  getEntitiesWithComponents(componentTypes: string[]): IEntity[] {
    const entities = this.entityManager.getAllEntities();
    
    return entities.filter(entity => {
      return componentTypes.every(type => entity.components.has(type));
    });
  }

  /**
   * Get all components of a specific type
   */
  getComponentsByType<T extends IComponent>(componentType: string): T[] {
    return (this.componentPools.get(componentType) || []) as T[];
  }

  /**
   * Clear all component pools
   */
  clear(): void {
    this.componentPools.clear();
  }

  /**
   * Get statistics about component usage
   */
  getStats(): Record<string, number> {
    const stats: Record<string, number> = {};
    
    this.componentPools.forEach((pool, type) => {
      stats[type] = pool.length;
    });
    
    return stats;
  }
}