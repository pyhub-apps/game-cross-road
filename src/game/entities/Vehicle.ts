import { Obstacle, ObstacleType } from '../systems/ObstacleSystem';

export interface VehicleConfig {
  color?: string;
  speed?: number;
  size?: {
    width: number;
    length: number;
    height: number;
  };
}

export class Vehicle implements Obstacle {
  public id: string;
  public type: ObstacleType = ObstacleType.VEHICLE;
  public position: { x: number; y: number; z: number };
  public size: { width: number; length: number; height: number };
  public speed: number;
  public direction: 1 | -1;
  public laneY: number;
  public active: boolean;
  public color: string;

  constructor(id: string, config?: VehicleConfig) {
    this.id = id;
    this.position = { x: 0, y: 0, z: 0.5 };
    this.size = config?.size || { width: 0.8, length: 1.6, height: 0.8 };
    this.speed = config?.speed || 2;
    this.direction = 1;
    this.laneY = 0;
    this.active = false;
    this.color = config?.color || '#FF4444';
  }

  // 차량 초기화
  public reset(): void {
    this.position = { x: 0, y: 0, z: 0.5 };
    this.active = false;
    this.direction = 1;
    this.laneY = 0;
  }

  // 차량 활성화
  public activate(
    position: { x: number; y: number; z: number },
    direction: 1 | -1,
    speed: number,
    laneY: number
  ): void {
    this.position = { ...position };
    this.direction = direction;
    this.speed = speed;
    this.laneY = laneY;
    this.active = true;
  }

  // 차량 이동
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

  // 차량이 화면 밖에 있는지 확인
  public isOutOfBounds(worldWidth: number): boolean {
    const halfWidth = worldWidth / 2 + this.size.length;
    return Math.abs(this.position.x) > halfWidth;
  }

  // 차량 타입별 설정
  public static createCar(id: string): Vehicle {
    const colors = ['#FF4444', '#4444FF', '#44FF44', '#FFFF44'];
    return new Vehicle(id, {
      color: colors[Math.floor(Math.random() * colors.length)],
      speed: 1.5 + Math.random() * 1.5,
      size: { width: 0.8, length: 1.6, height: 0.8 }
    });
  }

  public static createTruck(id: string): Vehicle {
    const colors = ['#888888', '#666666', '#999999'];
    return new Vehicle(id, {
      color: colors[Math.floor(Math.random() * colors.length)],
      speed: 1 + Math.random(),
      size: { width: 0.9, length: 2.4, height: 1.2 }
    });
  }

  public static createBus(id: string): Vehicle {
    return new Vehicle(id, {
      color: '#FFA500',
      speed: 1.2 + Math.random() * 0.8,
      size: { width: 0.9, length: 3, height: 1.4 }
    });
  }
}