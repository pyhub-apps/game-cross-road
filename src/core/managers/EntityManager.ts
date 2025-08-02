import { IEntity } from '../interfaces/IEntity';

export class EntityManager {
  private entities: Map<string, IEntity>;
  private nextId: number;
  private recycledIds: string[];

  constructor() {
    this.entities = new Map();
    this.nextId = 1;
    this.recycledIds = [];
  }

  /**
   * Create a new entity
   */
  createEntity(): IEntity {
    let id: string;
    
    if (this.recycledIds.length > 0) {
      id = this.recycledIds.pop()!;
    } else {
      id = `entity_${this.nextId++}`;
    }

    const entity: IEntity = {
      id,
      components: new Map(),
      isActive: true
    };

    this.entities.set(id, entity);
    return entity;
  }

  /**
   * Remove an entity and recycle its ID
   */
  removeEntity(entityId: string): void {
    const entity = this.entities.get(entityId);
    if (entity) {
      entity.components.clear();
      entity.isActive = false;
      this.entities.delete(entityId);
      this.recycledIds.push(entityId);
    }
  }

  /**
   * Get entity by ID
   */
  getEntity(entityId: string): IEntity | undefined {
    return this.entities.get(entityId);
  }

  /**
   * Get all active entities
   */
  getAllEntities(): IEntity[] {
    return Array.from(this.entities.values()).filter(e => e.isActive);
  }

  /**
   * Check if entity exists
   */
  hasEntity(entityId: string): boolean {
    return this.entities.has(entityId);
  }

  /**
   * Clear all entities
   */
  clear(): void {
    this.entities.forEach(entity => {
      entity.components.clear();
    });
    this.entities.clear();
    this.recycledIds = [];
    this.nextId = 1;
  }

  /**
   * Get entity count
   */
  getEntityCount(): number {
    return this.entities.size;
  }
}