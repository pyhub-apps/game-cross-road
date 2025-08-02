/**
 * Core game configuration constants
 */
export const GAME_CONFIG = {
  // Grid and movement
  GRID_SIZE: 1,
  PLAYER_MOVE_DURATION: 100, // ms
  
  // Pressure system
  PRESSURE_TIMER_DURATION: 3000, // ms
  PRESSURE_SCROLL_SPEED: 2, // units per second
  
  // Camera
  CAMERA_OFFSET: { x: 0, y: 5, z: 8 },
  CAMERA_FOV: 75,
  CAMERA_NEAR: 0.1,
  CAMERA_FAR: 100,
  CAMERA_SMOOTH_FACTOR: 0.1,
  
  // World generation
  INITIAL_LANES: 20,
  LANES_BUFFER_AHEAD: 20,
  LANES_BUFFER_BEHIND: 10,
  MAX_RENDER_DISTANCE: 50,
  
  // Lane generation rules (from PRD)
  LANE_RULES: {
    road: {
      minConsecutive: 1,
      maxConsecutive: 4,
      spawnChance: 0.3
    },
    river: {
      minConsecutive: 1,
      maxConsecutive: 3,
      spawnChance: 0.2
    },
    grass: {
      minConsecutive: 1,
      maxConsecutive: 10,
      spawnChance: 0.5,
      safeZoneInterval: { min: 5, max: 10 }
    }
  },
  
  // Obstacle settings
  OBSTACLE_SPAWN_INTERVAL: {
    min: 1000, // ms
    max: 3000
  },
  OBSTACLE_SPEED: {
    min: 1, // units per second
    max: 5
  },
  
  // Collision
  COLLISION_PADDING: 0.1,
  
  // Scoring
  POINTS_PER_FORWARD_MOVE: 1,
  
  // Performance
  MAX_ENTITIES: 500,
  ENTITY_CLEANUP_INTERVAL: 1000, // ms
  
  // UI
  UI_ANIMATION_DURATION: 300, // ms
  TOUCH_SWIPE_THRESHOLD: 50, // pixels
  
  // Debug
  DEBUG_MODE: false,
  SHOW_COLLISION_BOXES: false,
  SHOW_FPS: true
};

/**
 * Difficulty scaling configuration
 */
export const DIFFICULTY_CONFIG = {
  // Difficulty increases every N points
  DIFFICULTY_INTERVAL: 10,
  
  // Speed multiplier per difficulty level
  SPEED_MULTIPLIER: 0.1,
  
  // Spawn rate multiplier per difficulty level
  SPAWN_RATE_MULTIPLIER: 0.1,
  
  // Max difficulty level
  MAX_DIFFICULTY: 20
};

/**
 * Asset configuration
 */
export const ASSET_CONFIG = {
  VOXEL_SIZE: 1,
  VOXEL_COLORS: {
    player: '#4ECDC4',
    grass: '#52C41A',
    road: '#595959',
    water: '#1890FF',
    car: '#FA541C',
    truck: '#722ED1',
    log: '#8B6914',
    tree: '#389E0D',
    rock: '#8C8C8C'
  }
};