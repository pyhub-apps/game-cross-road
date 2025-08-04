import { EventEmitter } from '../interfaces/IEventBus';

// Lane types
export enum LaneType {
  ROAD = 'road',
  RIVER = 'river',
  SAFE = 'safe',
  GRASS = 'grass'
}

// Lane data structure
export interface Lane {
  y: number;
  type: LaneType;
  obstacles: any[];
  speed: number;
  direction: 1 | -1;
}

// Map generation system
export class MapSystem extends EventEmitter {
  private lanes: Lane[] = [];
  private viewDistance = 15; // Number of lanes to keep ahead/behind
  private currentY = 0;
  private worldWidth = 20;
  private enabled = true;

  constructor() {
    super();
    this.initialize();
  }

  private initialize(): void {
    // Generate initial lanes
    for (let y = -5; y < this.viewDistance; y++) {
      this.generateLane(y);
    }
  }

  private generateLane(y: number): void {
    const laneTypes = [LaneType.ROAD, LaneType.RIVER, LaneType.SAFE, LaneType.GRASS];
    const type = laneTypes[Math.floor(Math.random() * laneTypes.length)];
    
    const lane: Lane = {
      y,
      type,
      obstacles: [],
      speed: 1 + Math.random() * 2,
      direction: Math.random() > 0.5 ? 1 : -1
    };

    // Apply rules
    if (type === LaneType.ROAD || type === LaneType.RIVER) {
      // Check for consecutive lanes
      const sameLanes = this.countConsecutiveLanes(y - 1, type);
      if ((type === LaneType.ROAD && sameLanes >= 4) || 
          (type === LaneType.RIVER && sameLanes >= 3)) {
        // Force a safe zone
        lane.type = LaneType.SAFE;
      }
    }

    // Add safe zones every 5-10 lanes
    if (y > 0 && y % (5 + Math.floor(Math.random() * 6)) === 0) {
      lane.type = LaneType.SAFE;
    }

    this.lanes.push(lane);
    this.emit('laneGenerated', lane);
  }

  private countConsecutiveLanes(startY: number, type: LaneType): number {
    let count = 0;
    for (let y = startY; y >= startY - 5; y--) {
      const lane = this.lanes.find(l => l.y === y);
      if (lane && lane.type === type) {
        count++;
      } else {
        break;
      }
    }
    return count;
  }

  public update(deltaTime: number): void {
    if (!this.enabled) return;

    // Generate new lanes as needed
    const maxY = Math.max(...this.lanes.map(l => l.y), 0);
    const minY = Math.min(...this.lanes.map(l => l.y), 0);
    
    // Generate forward lanes
    if (maxY < this.currentY + this.viewDistance) {
      this.generateLane(maxY + 1);
    }

    // Remove far lanes
    const toRemove = this.lanes.filter(l => 
      l.y < this.currentY - this.viewDistance || 
      l.y > this.currentY + this.viewDistance * 2
    );
    
    toRemove.forEach(lane => {
      const index = this.lanes.indexOf(lane);
      if (index > -1) {
        this.lanes.splice(index, 1);
        this.emit('laneRemoved', { laneY: lane.y });
      }
    });

    // Emit map update
    this.emit('mapUpdated', this.lanes);
  }

  public getLaneAt(y: number): Lane | null {
    return this.lanes.find(l => Math.abs(l.y - y) < 0.5) || null;
  }

  public getLanes(): Lane[] {
    return [...this.lanes];
  }

  public setCurrentY(y: number): void {
    this.currentY = y;
  }

  public reset(): void {
    this.lanes = [];
    this.currentY = 0;
    this.initialize();
  }
}