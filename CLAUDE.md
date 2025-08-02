# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This is a web-based implementation of a "Cross Road" style arcade game (similar to Crossy Road/Frogger) called "Project Crossy". The project is currently in the planning stage with a comprehensive Korean-language PRD (Product Requirements Document).

## Technology Stack

- **Frontend Framework**: React.js (or Next.js)
- **3D Rendering**: react-three-fiber + drei libraries
- **Styling**: TBD (consider CSS-in-JS for component-based styling)
- **State Management**: TBD (consider Zustand for game state)
- **Build Tool**: TBD (Vite recommended for React + Three.js projects)

## Development Commands

Since the project hasn't been initialized yet, here are the typical commands once setup:

```bash
# Initial setup (to be run first)
npm create vite@latest . -- --template react
npm install three @react-three/fiber @react-three/drei

# Development
npm run dev          # Start development server
npm run build        # Build for production
npm run preview      # Preview production build

# Testing (once configured)
npm test            # Run tests
npm test:watch      # Run tests in watch mode
```

## Architecture Guidelines

### 1. **Modular Game Architecture**
The codebase should be structured with portability in mind for future GoDot engine porting:

```
src/
├── game/              # Core game logic (platform-agnostic)
│   ├── entities/      # Player, obstacles, platforms
│   ├── systems/       # Movement, collision, scoring
│   ├── generation/    # Procedural map generation
│   └── state/         # Game state management
├── renderer/          # React Three Fiber rendering layer
│   ├── components/    # 3D components (Player, Obstacles, etc.)
│   ├── scenes/        # Game scene, UI scene
│   └── materials/     # Voxel materials and textures
├── ui/                # React UI components
│   ├── screens/       # MainMenu, GameOver, HUD
│   └── controls/      # Touch/keyboard input handlers
└── utils/             # Shared utilities
```

### 2. **Key Design Patterns**

- **Entity-Component-System (ECS)**: Separate game entities from their behavior and rendering
- **Observer Pattern**: For game events (score updates, collisions, game over)
- **State Machine**: For game states (menu, playing, paused, game over)
- **Object Pool**: For efficient obstacle/platform recycling

### 3. **Core Game Mechanics Implementation**

#### Map Generation
- Implement procedural generation following PRD rules:
  - Roads: max 4 consecutive lanes
  - Rivers: max 3 consecutive lanes
  - Safe zones: every 5-10 lanes
- Use a lane-based system where each Y position represents a lane

#### Player Movement
- Grid-based movement (1 unit = 1 lane/tile)
- Input handling for keyboard arrows and touch/swipe
- Movement constraints to keep player within bounds

#### Collision System
- AABB (Axis-Aligned Bounding Box) collision detection
- Different collision responses:
  - Vehicles: instant game over
  - Water: game over unless on platform
  - Screen edge: game over

#### Pressure System
- Implement 3-second inactivity timer
- Force scroll camera upward when timer expires
- Player takes damage if pushed off-screen

### 4. **Performance Considerations**

- Use instanced meshes for repeated objects (vehicles, logs)
- Implement frustum culling for off-screen objects
- Object pooling for dynamic obstacles
- Keep draw calls under 100 for mobile performance

### 5. **Responsive Design Requirements**

- Support aspect ratios from 16:9 to 9:16
- Scale UI elements based on viewport size
- Adjust camera FOV/position for different screen sizes
- Touch controls for mobile with visual feedback

## Important Notes from PRD

1. **Voxel Art Style**: All assets should be created in voxel style using MagicaVoxel or similar tools
2. **Isometric View**: 3D camera positioned at ~45-degree angle
3. **Score System**: 1 point per forward movement, highest Y position = score
4. **MVP Focus**: Core gameplay only - no coins, characters, sounds, or leaderboards in initial version
5. **LLM Integration**: Consider implementing JSON-based map generation rules for developer tooling

## Game State Structure

```javascript
gameState = {
  player: {
    position: { x, y, z },
    isAlive: boolean,
    score: number
  },
  map: {
    lanes: Array<Lane>,
    generationRules: Object
  },
  camera: {
    position: { x, y, z },
    isScrolling: boolean
  },
  ui: {
    currentScreen: 'menu' | 'game' | 'gameOver',
    highScore: number
  }
}
```

## Input Handling

Primary controls (keyboard):
- ArrowUp: Move forward (+Y)
- ArrowDown: Move backward (-Y)
- ArrowLeft: Move left (-X)
- ArrowRight: Move right (+X)

Secondary controls (touch/mouse):
- Tap: Move forward
- Swipe: Move in swipe direction

Remember to implement input buffering for responsive controls and prevent multiple inputs per frame.