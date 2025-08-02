/**
 * Core Entity interface for the ECS pattern
 * Entities are just unique identifiers with associated components
 */
export interface IEntity {
  id: string;
  active: boolean;
}

/**
 * Entity manager interface for creating and managing entities
 */
export interface IEntityManager {
  createEntity(): IEntity;
  destroyEntity(entityId: string): void;
  getEntity(entityId: string): IEntity | undefined;
  getAllEntities(): IEntity[];
  getActiveEntities(): IEntity[];
}