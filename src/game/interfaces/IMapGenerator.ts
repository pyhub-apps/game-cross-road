import { LaneType } from '../../core/components/Lane';

/**
 * Lane generation configuration
 */
export interface LaneConfig {
  type: LaneType;
  spawnInterval?: number;
  spawnSpeed?: number;
  obstacleTypes?: string[];
  minConsecutive?: number;
  maxConsecutive?: number;
}

/**
 * Map generation rules
 */
export interface MapGenerationRules {
  laneConfigs: Record<LaneType, LaneConfig>;
  safeZoneInterval: {
    min: number;
    max: number;
  };
  difficultyScaling: {
    speedIncrease: number;
    densityIncrease: number;
    intervalDecrease: number;
  };
}

/**
 * Map generator interface - platform agnostic procedural generation
 */
export interface IMapGenerator {
  /**
   * Generate next lanes based on current position and rules
   */
  generateLanes(
    startY: number,
    count: number,
    difficulty: number
  ): GeneratedLane[];
  
  /**
   * Update generation rules (for LLM integration)
   */
  updateRules(rules: Partial<MapGenerationRules>): void;
  
  /**
   * Get current generation rules
   */
  getRules(): MapGenerationRules;
}

/**
 * Generated lane data
 */
export interface GeneratedLane {
  type: LaneType;
  yPosition: number;
  obstacles: {
    type: string;
    xPosition: number;
    speed?: number;
    direction?: 'left' | 'right';
  }[];
}