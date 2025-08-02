# Core Module

The core module contains the Entity-Component-System (ECS) implementation that forms the foundation of the game architecture. This module is completely platform-agnostic and can be used with any rendering or platform layer.

## Structure

### `/entities`
Contains the entity management system. Entities are just unique identifiers that group components together.

### `/components`
Pure data containers that define the properties of entities:
- `Transform`: Position, rotation, and scale
- `Velocity`: Linear and angular velocity for movement
- `Collider`: Collision detection properties
- `Player`: Player-specific data
- `Lane`: Map lane properties
- `Obstacle`: Obstacle properties

### `/systems`
Logic processors that operate on entities with specific components:
- `MovementSystem`: Updates entity positions based on velocity
- `CollisionSystem`: Detects collisions between entities

### `/interfaces`
TypeScript interfaces defining the contracts for the ECS pattern:
- `IEntity`: Entity structure and management
- `IComponent`: Component structure and management
- `ISystem`: System structure and lifecycle

## Usage

```typescript
// Create managers
const entityManager = new EntityManager();
const componentManager = new ComponentManager();
const systemManager = new SystemManager();

// Create an entity
const player = entityManager.createEntity();

// Add components
componentManager.addComponent(player.id, createTransform(0, 0, 0));
componentManager.addComponent(player.id, createPlayer());
componentManager.addComponent(player.id, createCollider('player', 0.8, 1, 0.8));

// Register systems
systemManager.registerSystem(new MovementSystem());
systemManager.registerSystem(new CollisionSystem(eventBus));

// Update loop
function gameLoop(deltaTime: number) {
  systemManager.updateAllSystems(deltaTime);
}
```

## Design Principles

1. **Pure Data Components**: Components contain only data, no logic
2. **System Logic**: All game logic resides in systems
3. **Loose Coupling**: Systems communicate through events, not direct references
4. **Platform Agnostic**: No rendering or platform-specific code