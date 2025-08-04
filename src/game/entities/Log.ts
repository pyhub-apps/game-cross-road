import { Obstacle, ObstacleType } from '../systems/ObstacleSystem';

export interface LogConfig {
  length?: number;
  speed?: number;
  color?: string;
}

export class Log implements Obstacle {
  public id: string;
  public type: ObstacleType = ObstacleType.LOG;
  public position: { x: number; y: number; z: number };
  public size: { width: number; length: number; height: number };
  public speed: number;
  public direction: 1 | -1;
  public laneY: number;
  public active: boolean;
  public color: string;

  constructor(id: string, config?: LogConfig) {
    this.id = id;
    this.position = { x: 0, y: 0, z: 0.25 };
    this.size = { 
      width: 0.9, 
      length: config?.length || 3, 
      height: 0.4 
    };
    this.speed = config?.speed || 1;
    this.direction = 1;
    this.laneY = 0;
    this.active = false;
    this.color = config?.color || '#8B4513';
  }

  // 나무줄기 초기화
  public reset(): void {
    this.position = { x: 0, y: 0, z: 0.25 };
    this.active = false;
    this.direction = 1;
    this.laneY = 0;
  }

  // 나무줄기 활성화
  public activate(
    position: { x: number; y: number; z: number },
    direction: 1 | -1,
    speed: number,
    laneY: number,
    length?: number
  ): void {
    this.position = { ...position };
    this.direction = direction;
    this.speed = speed;
    this.laneY = laneY;
    this.active = true;
    if (length) {
      this.size.length = length;
    }
  }

  // 나무줄기 이동
  public move(deltaTime: number): void {
    if (!this.active) return;
    this.position.x += this.speed * this.direction * deltaTime;
  }

  // 충돌 박스 가져오기
  public getBoundingBox(): {
    min: { x: number; y: number; z: number };
    max: { x: number; y: number; z: number };
  } {
    const halfWidth = this.size.width / 2;
    const halfLength = this.size.length / 2;
    const halfHeight = this.size.height / 2;

    return {
      min: {
        x: this.position.x - halfLength,
        y: this.position.y - halfWidth,
        z: this.position.z - halfHeight,
      },
      max: {
        x: this.position.x + halfLength,
        y: this.position.y + halfWidth,
        z: this.position.z + halfHeight,
      },
    };
  }

  // 나무줄기가 화면 밖에 있는지 확인
  public isOutOfBounds(worldWidth: number): boolean {
    const halfWidth = worldWidth / 2 + this.size.length;
    return Math.abs(this.position.x) > halfWidth;
  }

  // 플레이어가 나무줄기 위에 있는지 확인
  public isPlayerOn(playerPosition: { x: number; y: number; z: number }): boolean {
    const halfLength = this.size.length / 2;
    const halfWidth = this.size.width / 2;
    
    const onX = Math.abs(playerPosition.x - this.position.x) <= halfLength;
    const onY = Math.abs(playerPosition.y - this.position.y) <= halfWidth;
    
    return onX && onY;
  }

  // 플레이어를 나무줄기와 함께 이동
  public movePlayerWith(
    playerPosition: { x: number; y: number; z: number },
    deltaTime: number
  ): { x: number; y: number; z: number } {
    if (!this.isPlayerOn(playerPosition)) return playerPosition;
    
    return {
      ...playerPosition,
      x: playerPosition.x + (this.speed * this.direction * deltaTime)
    };
  }

  // 나무줄기 타입별 생성
  public static createShortLog(id: string): Log {
    return new Log(id, {
      length: 2,
      speed: 0.8 + Math.random() * 0.7,
      color: '#A0522D'
    });
  }

  public static createMediumLog(id: string): Log {
    return new Log(id, {
      length: 3,
      speed: 0.6 + Math.random() * 0.8,
      color: '#8B4513'
    });
  }

  public static createLongLog(id: string): Log {
    return new Log(id, {
      length: 4,
      speed: 0.5 + Math.random() * 0.5,
      color: '#654321'
    });
  }

  // 나무줄기 상태 디버깅 정보
  public getDebugInfo(): string {
    return `Log ${this.id}: pos(${this.position.x.toFixed(2)}, ${this.position.y.toFixed(2)}), ` +
           `length: ${this.size.length}, speed: ${this.speed.toFixed(2)}, ` +
           `direction: ${this.direction === 1 ? 'right' : 'left'}, active: ${this.active}`;
  }
}