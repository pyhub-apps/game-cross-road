import { ISystem } from '../interfaces/ISystem';
import { EntityManager } from './EntityManager';
import { ComponentManager } from './ComponentManager';

interface SystemEntry {
  system: ISystem;
  priority: number;
  enabled: boolean;
}

export class SystemManager {
  private systems: Map<string, SystemEntry>;
  private sortedSystems: SystemEntry[];
  private entityManager: EntityManager;
  private componentManager: ComponentManager;

  constructor(entityManager: EntityManager, componentManager: ComponentManager) {
    this.systems = new Map();
    this.sortedSystems = [];
    this.entityManager = entityManager;
    this.componentManager = componentManager;
  }

  /**
   * Register a system
   */
  registerSystem(system: ISystem, priority: number = 0): void {
    const entry: SystemEntry = {
      system,
      priority,
      enabled: true
    };

    this.systems.set(system.name, entry);
    this.sortSystems();

    // Initialize system
    if (system.initialize) {
      system.initialize(this.entityManager, this.componentManager);
    }
  }

  /**
   * Unregister a system
   */
  unregisterSystem(systemName: string): void {
    const entry = this.systems.get(systemName);
    if (entry) {
      if (entry.system.cleanup) {
        entry.system.cleanup();
      }
      this.systems.delete(systemName);
      this.sortSystems();
    }
  }

  /**
   * Enable/disable a system
   */
  setSystemEnabled(systemName: string, enabled: boolean): void {
    const entry = this.systems.get(systemName);
    if (entry) {
      entry.enabled = enabled;
    }
  }

  /**
   * Update all systems
   */
  update(deltaTime: number): void {
    for (const entry of this.sortedSystems) {
      if (entry.enabled) {
        const entities = this.componentManager.getEntitiesWithComponents(
          entry.system.requiredComponents
        );
        
        entry.system.update(entities, deltaTime);
      }
    }
  }

  /**
   * Get a system by name
   */
  getSystem<T extends ISystem>(systemName: string): T | undefined {
    const entry = this.systems.get(systemName);
    return entry?.system as T;
  }

  /**
   * Check if system is registered
   */
  hasSystem(systemName: string): boolean {
    return this.systems.has(systemName);
  }

  /**
   * Clear all systems
   */
  clear(): void {
    // Cleanup all systems
    this.systems.forEach(entry => {
      if (entry.system.cleanup) {
        entry.system.cleanup();
      }
    });
    
    this.systems.clear();
    this.sortedSystems = [];
  }

  /**
   * Sort systems by priority (higher priority runs first)
   */
  private sortSystems(): void {
    this.sortedSystems = Array.from(this.systems.values())
      .sort((a, b) => b.priority - a.priority);
  }

  /**
   * Get system execution order
   */
  getSystemExecutionOrder(): string[] {
    return this.sortedSystems.map(entry => entry.system.name);
  }

  /**
   * Get system stats
   */
  getStats(): Record<string, any> {
    return {
      totalSystems: this.systems.size,
      enabledSystems: this.sortedSystems.filter(e => e.enabled).length,
      executionOrder: this.getSystemExecutionOrder()
    };
  }
}