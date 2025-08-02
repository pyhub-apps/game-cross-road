# Cross Road Game - Modular Architecture

A web-based implementation of a Cross Road-style arcade game with a modular, platform-agnostic architecture designed for easy porting to other platforms like Godot.

## 🏗️ Architecture Overview

The project follows a strict modular architecture with complete separation between game logic and rendering:

```
src/
├── core/           # ECS implementation (platform-agnostic)
├── game/           # Game logic and rules (platform-agnostic)
├── renderer/       # React Three Fiber rendering (platform-specific)
├── ui/             # React UI components (platform-specific)
├── infrastructure/ # Platform services (input, storage)
└── shared/         # Common types and utilities
```

## 🎯 Key Features

- **Entity-Component-System (ECS)** architecture for flexibility
- **Platform-independent** game logic
- **Event-driven** communication between modules
- **Procedural generation** following specific rules
- **Performance optimized** with object pooling and instancing
- **TypeScript** for type safety throughout

## 🚀 Getting Started

### Prerequisites
- Node.js 18+
- npm or yarn

### Installation
```bash
# Clone the repository
git clone <repository-url>
cd sandbox-game-cross-road

# Install dependencies
npm install

# Start development server
npm run dev
```

### Building
```bash
# Build for production
npm run build

# Preview production build
npm run preview
```

## 🎮 Game Controls

### Keyboard
- **Arrow Keys** or **WASD**: Move in four directions
- **Escape**: Pause game
- **R**: Restart game

### Touch/Mouse
- **Tap/Click**: Move forward
- **Swipe**: Move in swipe direction

## 📁 Module Documentation

Each module has its own README with detailed documentation:

- [Core Module](src/core/README.md) - ECS implementation
- [Game Module](src/game/README.md) - Game logic and rules
- [Renderer Module](src/renderer/README.md) - 3D rendering
- [UI Module](src/ui/README.md) - User interface
- [Infrastructure Module](src/infrastructure/README.md) - Platform services
- [Shared Module](src/shared/README.md) - Common utilities

## 🏛️ Architecture Principles

1. **Separation of Concerns**: Each module has a single, well-defined purpose
2. **Platform Independence**: Core game logic can run on any platform
3. **Interface-Based Design**: All cross-module communication through interfaces
4. **Event-Driven**: Loose coupling via event bus
5. **Performance First**: Designed for 60 FPS on mobile devices

## 🔄 Porting to Other Platforms

The architecture is designed for easy porting:

### To port to Godot:
1. Keep `core`, `game`, and `shared` modules unchanged
2. Replace `renderer` with Godot-specific implementation
3. Replace `infrastructure` with Godot input/storage
4. Replace `ui` with Godot UI system

### Interface contracts ensure compatibility:
- `IRenderer` - Rendering abstraction
- `IInputManager` - Input handling
- `IStorageManager` - Persistent storage

## 🧪 Testing

```bash
# Run unit tests
npm test

# Run tests in watch mode
npm test:watch

# Run integration tests
npm run test:integration
```

## 📊 Performance Targets

- **Frame Rate**: 60 FPS on modern mobile devices
- **Load Time**: < 3 seconds on 3G networks
- **Memory Usage**: < 100MB on mobile
- **Draw Calls**: < 100 per frame

## 🛠️ Development Tools

- **TypeScript**: Type safety and better IDE support
- **Vite**: Fast development builds
- **React**: UI framework
- **Three.js**: 3D rendering
- **React Three Fiber**: React renderer for Three.js

## 📝 License

This project is licensed under the MIT License.

## 🤝 Contributing

Please read [ARCHITECTURE.md](ARCHITECTURE.md) for details on the codebase structure and development guidelines.