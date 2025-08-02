/**
 * Base Component interface for the ECS pattern
 * Components are pure data containers
 */
export interface IComponent {
  type: string;
}

/**
 * Component manager interface for handling component data
 */
export interface IComponentManager {
  addComponent<T extends IComponent>(entityId: string, component: T): void;
  removeComponent(entityId: string, componentType: string): void;
  getComponent<T extends IComponent>(entityId: string, componentType: string): T | undefined;
  getComponents(entityId: string): IComponent[];
  hasComponent(entityId: string, componentType: string): boolean;
  getEntitiesWithComponent(componentType: string): string[];
}