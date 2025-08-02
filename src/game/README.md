# Game Module

The game module contains the platform-agnostic game logic, rules, and systems specific to the Cross Road game. This module uses the core ECS system but remains independent of any rendering implementation.

## Structure

### `/logic`
Core game logic and rules:
- Game state management
- Score calculation
- Win/lose conditions
- Difficulty progression

### `/generation`
Procedural content generation:
- Map generation following PRD rules
- Obstacle placement algorithms
- Difficulty-based content scaling

### `/rules`
Game rules and configuration:
- Movement rules
- Collision rules
- Scoring rules
- Generation constraints

### `/events`
Event system for decoupled communication:
- Event bus implementation
- Game-specific events
- Event handlers

### `/state`
Game state management:
- Persistent state (high scores)
- Session state (current game)
- State transitions

### `/systems`
Game-specific systems:
- `PlayerSystem`: Player input, movement, and scoring
- `MapGenerationSystem`: Dynamic map generation
- `PressureSystem`: Time pressure mechanics
- `ObstacleSpawnSystem`: Obstacle spawning and management

## Key Interfaces

### IGameState
Central game state containing all game-relevant data like score, player state, and world state.

### IMapGenerator
Procedural generation interface for creating game maps following the PRD rules.

### IEventBus
Event system for loose coupling between game components.

## Design Patterns

1. **State Machine**: Game flow management (menu → playing → game over)
2. **Observer Pattern**: Event-based communication
3. **Strategy Pattern**: Swappable generation algorithms
4. **Object Pool**: Efficient obstacle management

## Integration Points

- Uses core ECS for entity management
- Provides events for UI updates
- Exposes state for rendering layer
- Accepts input through infrastructure layer