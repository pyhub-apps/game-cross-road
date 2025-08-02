import { ISystem } from '../interfaces/ISystem';
import { IEntityManager } from '../interfaces/IEntity';
import { IComponentManager } from '../interfaces/IComponent';
import { Transform } from '../components/Transform';
import { Collider } from '../components/Collider';
import { IEventBus } from '../../game/interfaces/IEventBus';

/**
 * Collision detection system using AABB (Axis-Aligned Bounding Box)
 */
export class CollisionSystem implements ISystem {
  name = 'CollisionSystem';
  priority = 200; // Run after movement
  enabled = true;
  
  private entityManager!: IEntityManager;
  private componentManager!: IComponentManager;
  private eventBus: IEventBus;
  
  constructor(eventBus: IEventBus) {
    this.eventBus = eventBus;
  }
  
  initialize(entityManager: IEntityManager, componentManager: IComponentManager): void {
    this.entityManager = entityManager;
    this.componentManager = componentManager;
  }
  
  update(deltaTime: number): void {
    if (!this.enabled) return;
    
    const entities = this.entityManager.getActiveEntities();
    const collidableEntities: Array<{ id: string; transform: Transform; collider: Collider }> = [];
    
    // Collect all entities with colliders
    for (const entity of entities) {
      const transform = this.componentManager.getComponent<Transform>(entity.id, 'transform');
      const collider = this.componentManager.getComponent<Collider>(entity.id, 'collider');
      
      if (transform && collider) {
        collidableEntities.push({ id: entity.id, transform, collider });
      }
    }
    
    // Check collisions between all pairs
    for (let i = 0; i < collidableEntities.length; i++) {
      for (let j = i + 1; j < collidableEntities.length; j++) {
        const entityA = collidableEntities[i];
        const entityB = collidableEntities[j];
        
        if (this.checkAABBCollision(entityA, entityB)) {
          // Emit collision event
          this.eventBus.emit({
            type: 'COLLISION_DETECTED',
            data: {
              entityA: entityA.id,
              entityB: entityB.id,
              collisionType: `${entityA.collider.colliderType}_${entityB.collider.colliderType}`
            }
          });
        }
      }
    }
  }
  
  private checkAABBCollision(
    a: { transform: Transform; collider: Collider },
    b: { transform: Transform; collider: Collider }
  ): boolean {
    // Calculate actual positions with offsets
    const aPos = {
      x: a.transform.position.x + a.collider.offset.x,
      y: a.transform.position.y + a.collider.offset.y,
      z: a.transform.position.z + a.collider.offset.z
    };
    
    const bPos = {
      x: b.transform.position.x + b.collider.offset.x,
      y: b.transform.position.y + b.collider.offset.y,
      z: b.transform.position.z + b.collider.offset.z
    };
    
    // AABB collision check
    return (
      Math.abs(aPos.x - bPos.x) < (a.collider.bounds.width + b.collider.bounds.width) / 2 &&
      Math.abs(aPos.y - bPos.y) < (a.collider.bounds.height + b.collider.bounds.height) / 2 &&
      Math.abs(aPos.z - bPos.z) < (a.collider.bounds.depth + b.collider.bounds.depth) / 2
    );
  }
  
  destroy(): void {
    // Clean up if needed
  }
}