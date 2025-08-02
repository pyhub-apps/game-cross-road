import { IMapGenerator, GeneratedLane, MapGenerationRules } from '../interfaces/IMapGenerator';
import { LaneType } from '../../core/components/Lane';
import defaultRules from '../../shared/data/defaultMapRules.json';

/**
 * Procedural map generator following PRD rules
 */
export class MapGenerator implements IMapGenerator {
  private rules: MapGenerationRules;
  private laneHistory: LaneType[] = [];
  private lastSafeZoneY = 0;
  private seed: number;
  
  constructor(seed?: number) {
    // Initialize with default rules from JSON
    this.rules = defaultRules as MapGenerationRules;
    this.seed = seed || Date.now();
  }
  
  generateLanes(startY: number, count: number, difficulty: number): GeneratedLane[] {
    const lanes: GeneratedLane[] = [];
    
    for (let i = 0; i < count; i++) {
      const y = startY + i;
      const laneType = this.selectNextLaneType(y);
      const obstacles = this.generateObstacles(laneType, difficulty);
      
      lanes.push({
        type: laneType,
        yPosition: y,
        obstacles
      });
      
      this.laneHistory.push(laneType);
      if (this.laneHistory.length > 20) {
        this.laneHistory.shift();
      }
    }
    
    return lanes;
  }
  
  updateRules(rules: Partial<MapGenerationRules>): void {
    this.rules = { ...this.rules, ...rules };
  }
  
  getRules(): MapGenerationRules {
    return { ...this.rules };
  }
  
  private selectNextLaneType(y: number): LaneType {
    // Check if we need a safe zone
    if (y - this.lastSafeZoneY >= this.rules.safeZoneInterval.max) {
      this.lastSafeZoneY = y;
      return 'grass';
    }
    
    // Count consecutive lanes of the same type
    const currentTypeCount = this.countConsecutive(this.laneHistory);
    const currentType = this.laneHistory[this.laneHistory.length - 1];
    
    // Check if we've hit the max consecutive limit
    if (currentType && currentTypeCount >= this.rules.laneConfigs[currentType].maxConsecutive!) {
      return this.selectDifferentType(currentType);
    }
    
    // Otherwise, use weighted random selection
    return this.weightedRandomSelection();
  }
  
  private countConsecutive(history: LaneType[]): number {
    if (history.length === 0) return 0;
    
    let count = 1;
    const lastType = history[history.length - 1];
    
    for (let i = history.length - 2; i >= 0; i--) {
      if (history[i] === lastType) {
        count++;
      } else {
        break;
      }
    }
    
    return count;
  }
  
  private selectDifferentType(excludeType: LaneType): LaneType {
    const types: LaneType[] = ['grass', 'road', 'river'];
    const available = types.filter(t => t !== excludeType);
    return available[Math.floor(this.seededRandom() * available.length)];
  }
  
  private weightedRandomSelection(): LaneType {
    // Use weights from config, excluding railway for MVP
    const weights: Record<string, number> = {};
    let totalWeight = 0;
    
    ['grass', 'road', 'river'].forEach(type => {
      const config = this.rules.laneConfigs[type as LaneType];
      if (config && 'weight' in config) {
        weights[type] = (config as any).weight || 0.3;
        totalWeight += weights[type];
      }
    });
    
    const random = this.seededRandom();
    let cumulative = 0;
    
    for (const [type, weight] of Object.entries(weights)) {
      cumulative += weight / totalWeight;
      if (random < cumulative) {
        return type as LaneType;
      }
    }
    
    return 'grass';
  }
  
  /**
   * Seeded random number generator for reproducible maps
   */
  private seededRandom(): number {
    this.seed = (this.seed * 9301 + 49297) % 233280;
    return this.seed / 233280;
  }
  
  private generateObstacles(
    laneType: LaneType,
    difficulty: number
  ): GeneratedLane['obstacles'] {
    const obstacles: GeneratedLane['obstacles'] = [];
    const config = this.rules.laneConfigs[laneType];
    
    if (!config.obstacleTypes || config.obstacleTypes.length === 0) {
      return obstacles;
    }
    
    // Adjust spawn probability based on difficulty
    const spawnChance = Math.min(0.8, 0.3 + (difficulty * 0.05));
    
    // Use configured density if available
    const configDensity = (config as any).obstacleDensity || 0.3;
    const adjustedDensity = Math.min(0.8, configDensity + (difficulty * this.rules.difficultyScaling.densityIncrease));
    
    // Generate obstacles at grid positions
    for (let x = -10; x <= 10; x += 2) {
      if (this.seededRandom() < adjustedDensity) {
        const obstacleType = config.obstacleTypes[
          Math.floor(this.seededRandom() * config.obstacleTypes.length)
        ];
        
        // Apply difficulty scaling to speed
        const baseSpeed = config.spawnSpeed || 0;
        const speedMultiplier = 1 + (difficulty * this.rules.difficultyScaling.speedIncrease);
        
        obstacles.push({
          type: obstacleType,
          xPosition: x,
          speed: baseSpeed * speedMultiplier,
          direction: this.seededRandom() < 0.5 ? 'left' : 'right'
        });
      }
    }
    
    return obstacles;
  }
}