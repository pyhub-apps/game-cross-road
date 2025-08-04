import { EventEmitter } from '../interfaces/IEventBus';
import { Lane, LaneType } from './MapSystem';

// 장애물 타입 정의
export enum ObstacleType {
  VEHICLE = 'vehicle',
  LOG = 'log',
}

// 장애물 데이터 구조
export interface Obstacle {
  id: string;
  type: ObstacleType;
  position: { x: number; y: number; z: number };
  size: { width: number; length: number; height: number };
  speed: number;
  direction: 1 | -1; // 1: right, -1: left
  laneY: number;
  active: boolean;
  color?: string;
}

// 장애물 생성 설정
interface ObstacleConfig {
  type: ObstacleType;
  laneY: number;
  count: number;
  minGap: number;
  speed: { min: number; max: number };
  size?: { min: number; max: number }; // For logs
}

export class ObstacleSystem extends EventEmitter {
  private obstacles: Map<string, Obstacle> = new Map();
  private obstaclePool: Map<ObstacleType, Obstacle[]> = new Map();
  private nextId: number = 0;
  private worldWidth: number = 20; // 월드 너비
  private poolSize: number = 50; // 각 타입별 풀 크기
  private vehicleColors: string[] = ['#FF4444', '#4444FF', '#44FF44', '#FFFF44', '#FF44FF'];

  constructor() {
    super();
    this.initializePool();
  }

  // Object Pool 초기화
  private initializePool(): void {
    // Vehicle pool
    const vehiclePool: Obstacle[] = [];
    for (let i = 0; i < this.poolSize; i++) {
      vehiclePool.push(this.createVehicle());
    }
    this.obstaclePool.set(ObstacleType.VEHICLE, vehiclePool);

    // Log pool
    const logPool: Obstacle[] = [];
    for (let i = 0; i < this.poolSize; i++) {
      logPool.push(this.createLog());
    }
    this.obstaclePool.set(ObstacleType.LOG, logPool);
  }

  // 차량 생성
  private createVehicle(): Obstacle {
    return {
      id: `obstacle_${this.nextId++}`,
      type: ObstacleType.VEHICLE,
      position: { x: 0, y: 0, z: 0 },
      size: { width: 1, length: 2, height: 1 },
      speed: 1,
      direction: 1,
      laneY: 0,
      active: false,
      color: this.vehicleColors[Math.floor(Math.random() * this.vehicleColors.length)],
    };
  }

  // 나무줄기 생성
  private createLog(): Obstacle {
    return {
      id: `obstacle_${this.nextId++}`,
      type: ObstacleType.LOG,
      position: { x: 0, y: 0, z: 0 },
      size: { width: 1, length: 3, height: 0.5 },
      speed: 0.5,
      direction: 1,
      laneY: 0,
      active: false,
      color: '#8B4513', // Brown
    };
  }

  // Pool에서 장애물 가져오기
  private getFromPool(type: ObstacleType): Obstacle | null {
    const pool = this.obstaclePool.get(type);
    if (!pool) return null;

    const obstacle = pool.find(o => !o.active);
    if (obstacle) {
      obstacle.active = true;
      return obstacle;
    }
    return null;
  }

  // Pool로 장애물 반환
  private returnToPool(obstacle: Obstacle): void {
    obstacle.active = false;
    obstacle.position = { x: 0, y: 0, z: 0 };
  }

  // 레인에 장애물 생성
  public generateObstaclesForLane(lane: Lane): void {
    // 이미 장애물이 있는 레인은 스킵
    const existingObstacles = Array.from(this.obstacles.values())
      .filter(o => o.laneY === lane.y && o.active);
    
    if (existingObstacles.length > 0) return;

    if (lane.type === LaneType.ROAD) {
      this.generateVehicles(lane);
    } else if (lane.type === LaneType.RIVER) {
      this.generateLogs(lane);
    }
  }

  // 차량 생성
  private generateVehicles(lane: Lane): void {
    const count = 2 + Math.floor(Math.random() * 2); // 2-3대
    const direction = Math.random() > 0.5 ? 1 : -1;
    const speed = 1 + Math.random() * 2; // 1-3 units/sec
    const minGap = 3; // 최소 간격 3칸
    
    const positions = this.calculatePositions(count, minGap, 2); // 차량 길이 2

    for (const x of positions) {
      const vehicle = this.getFromPool(ObstacleType.VEHICLE);
      if (!vehicle) continue;

      vehicle.position = { 
        x: direction === 1 ? -this.worldWidth / 2 + x : this.worldWidth / 2 - x, 
        y: lane.y, 
        z: 0.5 
      };
      vehicle.direction = direction;
      vehicle.speed = speed;
      vehicle.laneY = lane.y;
      
      this.obstacles.set(vehicle.id, vehicle);
    }

    this.emit('obstaclesGenerated', { laneY: lane.y, type: ObstacleType.VEHICLE });
  }

  // 나무줄기 생성
  private generateLogs(lane: Lane): void {
    const count = 3 + Math.floor(Math.random() * 2); // 3-4개
    const direction = Math.random() > 0.5 ? 1 : -1;
    const speed = 0.5 + Math.random() * 1.5; // 0.5-2 units/sec
    const minGap = 2; // 최소 간격 2칸
    
    const positions: number[] = [];
    let currentX = 0;
    
    for (let i = 0; i < count; i++) {
      const log = this.getFromPool(ObstacleType.LOG);
      if (!log) continue;

      // 랜덤 길이 (2-4칸)
      log.size.length = 2 + Math.floor(Math.random() * 3);
      
      positions.push(currentX);
      currentX += log.size.length + minGap + Math.random() * 3;
      
      log.position = { 
        x: direction === 1 ? -this.worldWidth / 2 + currentX : this.worldWidth / 2 - currentX, 
        y: lane.y, 
        z: 0.25 
      };
      log.direction = direction;
      log.speed = speed;
      log.laneY = lane.y;
      
      this.obstacles.set(log.id, log);
    }

    this.emit('obstaclesGenerated', { laneY: lane.y, type: ObstacleType.LOG });
  }

  // 위치 계산 헬퍼
  private calculatePositions(count: number, minGap: number, obstacleLength: number): number[] {
    const positions: number[] = [];
    const totalLength = this.worldWidth;
    const segmentLength = totalLength / count;
    
    for (let i = 0; i < count; i++) {
      const basePosition = i * segmentLength;
      const randomOffset = Math.random() * (segmentLength - obstacleLength - minGap);
      positions.push(basePosition + randomOffset);
    }
    
    return positions;
  }

  // 장애물 업데이트
  public update(deltaTime: number): void {
    const obstaclesArray = Array.from(this.obstacles.values());
    
    for (const obstacle of obstaclesArray) {
      if (!obstacle.active) continue;

      // 이동
      obstacle.position.x += obstacle.speed * obstacle.direction * deltaTime;

      // 화면 밖으로 나가면 반대편으로 이동 (wrapping)
      const halfWidth = this.worldWidth / 2 + obstacle.size.length;
      if (obstacle.position.x > halfWidth) {
        obstacle.position.x = -halfWidth;
      } else if (obstacle.position.x < -halfWidth) {
        obstacle.position.x = halfWidth;
      }
    }

    this.emit('obstaclesUpdated', obstaclesArray.filter(o => o.active));
  }

  // 레인 제거 시 장애물 정리
  public removeObstaclesForLane(laneY: number): void {
    const toRemove: string[] = [];
    
    this.obstacles.forEach((obstacle, id) => {
      if (obstacle.laneY === laneY) {
        this.returnToPool(obstacle);
        toRemove.push(id);
      }
    });

    toRemove.forEach(id => this.obstacles.delete(id));
    this.emit('obstaclesRemoved', { laneY });
  }

  // 충돌 검사
  public checkCollision(playerPosition: { x: number; y: number; z: number }): Obstacle | null {
    for (const obstacle of this.obstacles.values()) {
      if (!obstacle.active) continue;

      // AABB 충돌 검사
      const halfWidth = obstacle.size.width / 2;
      const halfLength = obstacle.size.length / 2;
      
      const collisionX = Math.abs(playerPosition.x - obstacle.position.x) < halfWidth + 0.4;
      const collisionY = Math.abs(playerPosition.y - obstacle.position.y) < 0.5;
      
      if (collisionX && collisionY) {
        return obstacle;
      }
    }
    return null;
  }

  // 플레이어가 나무줄기 위에 있는지 확인
  public isOnLog(playerPosition: { x: number; y: number; z: number }): Obstacle | null {
    for (const obstacle of this.obstacles.values()) {
      if (!obstacle.active || obstacle.type !== ObstacleType.LOG) continue;

      const halfWidth = obstacle.size.width / 2;
      const halfLength = obstacle.size.length / 2;
      
      const onLogX = Math.abs(playerPosition.x - obstacle.position.x) <= halfLength;
      const onLogY = Math.abs(playerPosition.y - obstacle.position.y) < 0.1;
      
      if (onLogX && onLogY) {
        return obstacle;
      }
    }
    return null;
  }

  // 현재 활성 장애물 가져오기
  public getActiveObstacles(): Obstacle[] {
    return Array.from(this.obstacles.values()).filter(o => o.active);
  }

  // 시스템 리셋
  public reset(): void {
    this.obstacles.forEach(obstacle => {
      this.returnToPool(obstacle);
    });
    this.obstacles.clear();
    this.emit('obstaclesReset');
  }

  // 디버그 정보
  public getDebugInfo(): { active: number; pooled: number; total: number } {
    const active = Array.from(this.obstacles.values()).filter(o => o.active).length;
    const vehiclePooled = this.obstaclePool.get(ObstacleType.VEHICLE)?.filter(o => !o.active).length || 0;
    const logPooled = this.obstaclePool.get(ObstacleType.LOG)?.filter(o => !o.active).length || 0;
    
    return {
      active,
      pooled: vehiclePooled + logPooled,
      total: active + vehiclePooled + logPooled
    };
  }
}