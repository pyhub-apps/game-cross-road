import { ISystem } from '../interfaces/ISystem';
import { IEntityManager } from '../interfaces/IEntity';
import { IComponentManager } from '../interfaces/IComponent';
import { Transform } from '../components/Transform';
import { Velocity } from '../components/Velocity';

/**
 * Movement system - updates entity positions based on velocity
 */
export class MovementSystem implements ISystem {
  name = 'MovementSystem';
  priority = 100;
  enabled = true;
  
  private entityManager!: IEntityManager;
  private componentManager!: IComponentManager;
  
  initialize(entityManager: IEntityManager, componentManager: IComponentManager): void {
    this.entityManager = entityManager;
    this.componentManager = componentManager;
  }
  
  update(deltaTime: number): void {
    if (!this.enabled) return;
    
    // Get all entities with both Transform and Velocity components
    const entities = this.entityManager.getActiveEntities();
    
    for (const entity of entities) {
      const transform = this.componentManager.getComponent<Transform>(entity.id, 'transform');
      const velocity = this.componentManager.getComponent<Velocity>(entity.id, 'velocity');
      
      if (transform && velocity) {
        // Update position
        transform.position.x += velocity.linear.x * deltaTime;
        transform.position.y += velocity.linear.y * deltaTime;
        transform.position.z += velocity.linear.z * deltaTime;
        
        // Update rotation
        transform.rotation.x += velocity.angular.x * deltaTime;
        transform.rotation.y += velocity.angular.y * deltaTime;
        transform.rotation.z += velocity.angular.z * deltaTime;
      }
    }
  }
  
  destroy(): void {
    // Clean up if needed
  }
}