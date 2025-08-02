# Renderer Module

The renderer module provides the React Three Fiber implementation for rendering the game. This module is completely separate from game logic and can be replaced with any other rendering solution (including Godot).

## Structure

### `/three`
Three.js specific utilities and helpers:
- Scene setup
- Camera configuration
- Lighting setup
- Performance optimizations

### `/components`
React Three Fiber components for rendering entities:
- `PlayerMesh`: Voxel-style player rendering
- `ObstacleMesh`: Various obstacle types (cars, logs, etc.)
- `LaneMesh`: Ground tiles for different lane types
- `VoxelMesh`: Base voxel rendering component

### `/scenes`
Scene composition and management:
- `GameScene`: Main 3D game scene
- `UIScene`: Overlay UI elements
- `BackgroundScene`: Environment and skybox

### `/materials`
Three.js materials and textures:
- Voxel materials
- Optimized shaders
- Texture management

### `/systems`
Rendering-specific systems:
- `RenderSystem`: Main rendering pipeline
- `CameraSystem`: Camera movement and tracking
- `LODSystem`: Level of detail management
- `InstancedRenderingSystem`: Performance optimization

## Key Concepts

### Separation of Concerns
The renderer only visualizes the game state - it never modifies game logic. It reads from the ECS and game state to determine what to render.

### Performance Optimization
- Instanced rendering for repeated objects
- Frustum culling
- Level of detail (LOD)
- Object pooling
- Texture atlasing

### Responsive Design
- Dynamic camera adjustment
- Viewport-based scaling
- Mobile-optimized rendering

## Usage

```typescript
// Create renderer
const renderer = new ThreeRenderer();

// Initialize with config
await renderer.initialize({
  width: window.innerWidth,
  height: window.innerHeight,
  pixelRatio: window.devicePixelRatio,
  clearColor: '#87CEEB',
  cameraFOV: 75,
  cameraPosition: { x: 0, y: 5, z: 10 },
  cameraTarget: { x: 0, y: 0, z: 0 }
});

// Render loop
function animate() {
  const entities = entityManager.getAllEntities();
  renderer.render(entities, componentManager.getComponents);
  requestAnimationFrame(animate);
}
```

## Porting to Other Platforms

To port to another platform (e.g., Godot):
1. Keep all other modules unchanged
2. Replace this renderer module with platform-specific implementation
3. Implement the `IRenderer` interface
4. Map ECS components to platform-specific rendering