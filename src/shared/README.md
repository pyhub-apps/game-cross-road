# Shared Module

The shared module contains common types, utilities, and constants used across all other modules. This ensures consistency and prevents duplication.

## Structure

### `/types`
TypeScript type definitions:
- Common data structures
- Utility types
- Type guards and assertions

### `/utils`
Utility functions:
- Math utilities (vector operations, random generation)
- Array/object helpers
- Performance utilities (object pooling, throttling)
- Validation functions

### `/constants`
Game constants and configuration:
- Game rules constants
- Physics constants
- Rendering constants
- Debug flags

## Key Utilities

### Math Utilities
```typescript
// Vector operations
export const Vector3 = {
  add: (a: Vec3, b: Vec3): Vec3 => ({ x: a.x + b.x, y: a.y + b.y, z: a.z + b.z }),
  subtract: (a: Vec3, b: Vec3): Vec3 => ({ x: a.x - b.x, y: a.y - b.y, z: a.z - b.z }),
  multiply: (v: Vec3, scalar: number): Vec3 => ({ x: v.x * scalar, y: v.y * scalar, z: v.z * scalar }),
  distance: (a: Vec3, b: Vec3): number => Math.sqrt(Math.pow(a.x - b.x, 2) + Math.pow(a.y - b.y, 2) + Math.pow(a.z - b.z, 2))
};
```

### Object Pool
```typescript
export class ObjectPool<T> {
  private pool: T[] = [];
  private createFn: () => T;
  
  constructor(createFn: () => T, initialSize = 10) {
    this.createFn = createFn;
    for (let i = 0; i < initialSize; i++) {
      this.pool.push(createFn());
    }
  }
  
  get(): T {
    return this.pool.pop() || this.createFn();
  }
  
  release(item: T): void {
    this.pool.push(item);
  }
}
```

### Performance Utilities
- Frame rate limiter
- Throttle/debounce functions
- Memory usage tracker
- Performance profiler

## Constants

### Game Constants
```typescript
export const GAME_CONFIG = {
  GRID_SIZE: 1,
  PLAYER_MOVE_SPEED: 5,
  PRESSURE_TIMER: 3000, // ms
  CAMERA_OFFSET: { x: 0, y: 5, z: 10 },
  MAX_RENDER_DISTANCE: 50,
  LANES_BUFFER: 20
};
```

### Physics Constants
```typescript
export const PHYSICS = {
  GRAVITY: -9.81,
  JUMP_FORCE: 5,
  FRICTION: 0.8,
  MAX_VELOCITY: 10
};
```

## Usage

All modules import from shared:
```typescript
import { Vector3, ObjectPool, GAME_CONFIG } from '../shared';
```

## Design Principles

1. **No Dependencies**: Shared module depends on nothing
2. **Pure Functions**: Utilities are pure functions when possible
3. **Type Safety**: Strong TypeScript types throughout
4. **Performance**: Optimized implementations