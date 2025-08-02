import { IMapGenerator, GeneratedLane, MapGenerationRules } from '../interfaces/IMapGenerator';
import { LaneType } from '../../core/components/Lane';
import { GAME_CONFIG } from '../../shared/constants/GameConfig';

/**
 * Procedural map generator following PRD rules
 */
export class MapGenerator implements IMapGenerator {
  private rules: MapGenerationRules;
  private laneHistory: LaneType[] = [];
  private lastSafeZoneY = 0;
  
  constructor() {
    // Initialize with default rules from config
    this.rules = {
      laneConfigs: {
        grass: {
          type: 'grass',
          minConsecutive: 1,
          maxConsecutive: 10
        },
        road: {
          type: 'road',
          minConsecutive: 1,
          maxConsecutive: 4,
          spawnInterval: 2000,
          spawnSpeed: 3,
          obstacleTypes: ['car', 'truck']
        },
        river: {
          type: 'river',
          minConsecutive: 1,
          maxConsecutive: 3,
          spawnInterval: 3000,
          spawnSpeed: 2,
          obstacleTypes: ['log']
        },
        railway: {
          type: 'railway',
          minConsecutive: 1,
          maxConsecutive: 2,
          spawnInterval: 5000,
          spawnSpeed: 8,
          obstacleTypes: ['train']
        }
      },
      safeZoneInterval: {
        min: 5,
        max: 10
      },
      difficultyScaling: {
        speedIncrease: 0.1,
        densityIncrease: 0.1,
        intervalDecrease: 0.05
      }
    };
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
    return available[Math.floor(Math.random() * available.length)];
  }
  
  private weightedRandomSelection(): LaneType {
    const weights = {
      grass: 0.5,
      road: 0.3,
      river: 0.2
    };
    
    const random = Math.random();
    let cumulative = 0;
    
    for (const [type, weight] of Object.entries(weights)) {
      cumulative += weight;
      if (random < cumulative) {
        return type as LaneType;
      }
    }
    
    return 'grass';
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
    
    // Generate obstacles at grid positions
    for (let x = -10; x <= 10; x += 2) {
      if (Math.random() < spawnChance) {
        const obstacleType = config.obstacleTypes[
          Math.floor(Math.random() * config.obstacleTypes.length)
        ];
        
        obstacles.push({
          type: obstacleType,
          xPosition: x,
          speed: config.spawnSpeed ? config.spawnSpeed * (1 + difficulty * 0.1) : 0,
          direction: Math.random() < 0.5 ? 'left' : 'right'
        });
      }
    }
    
    return obstacles;
  }
}