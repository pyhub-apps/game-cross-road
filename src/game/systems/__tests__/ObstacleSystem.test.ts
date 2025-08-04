import { ObstacleSystem, ObstacleType } from '../ObstacleSystem';
import { Lane, LaneType } from '../MapSystem';

describe('ObstacleSystem', () => {
  let obstacleSystem: ObstacleSystem;

  beforeEach(() => {
    obstacleSystem = new ObstacleSystem();
  });

  afterEach(() => {
    obstacleSystem.reset();
  });

  describe('Object Pooling', () => {
    it('should initialize pools for vehicles and logs', () => {
      const debugInfo = obstacleSystem.getDebugInfo();
      expect(debugInfo.pooled).toBeGreaterThan(0);
      expect(debugInfo.active).toBe(0);
    });

    it('should reuse objects from pool', () => {
      const roadLane: Lane = {
        y: 0,
        type: LaneType.ROAD,
        obstacles: [],
        speed: 2,
        direction: 1,
      };

      // Generate obstacles for first lane
      obstacleSystem.generateObstaclesForLane(roadLane);
      const firstDebugInfo = obstacleSystem.getDebugInfo();
      const firstActive = firstDebugInfo.active;

      // Remove obstacles
      obstacleSystem.removeObstaclesForLane(0);
      
      // Generate obstacles for second lane
      const secondLane: Lane = {
        y: 1,
        type: LaneType.ROAD,
        obstacles: [],
        speed: 2,
        direction: -1,
      };
      obstacleSystem.generateObstaclesForLane(secondLane);
      
      const secondDebugInfo = obstacleSystem.getDebugInfo();
      
      // Pool size should remain constant
      expect(secondDebugInfo.total).toBe(firstDebugInfo.total);
      // Active count should be similar
      expect(secondDebugInfo.active).toBeGreaterThan(0);
    });
  });

  describe('Obstacle Generation', () => {
    it('should generate vehicles for road lanes', () => {
      const roadLane: Lane = {
        y: 1,
        type: LaneType.ROAD,
        obstacles: [],
        speed: 2,
        direction: 1,
      };

      const eventSpy = jest.fn();
      obstacleSystem.on('obstaclesGenerated', eventSpy);

      obstacleSystem.generateObstaclesForLane(roadLane);

      expect(eventSpy).toHaveBeenCalledWith({
        laneY: 1,
        type: ObstacleType.VEHICLE,
      });

      const obstacles = obstacleSystem.getActiveObstacles();
      expect(obstacles.length).toBeGreaterThanOrEqual(2); // 2-3 vehicles
      expect(obstacles.length).toBeLessThanOrEqual(3);
      
      obstacles.forEach(obstacle => {
        expect(obstacle.type).toBe(ObstacleType.VEHICLE);
        expect(obstacle.laneY).toBe(1);
      });
    });

    it('should generate logs for river lanes', () => {
      const riverLane: Lane = {
        y: 2,
        type: LaneType.RIVER,
        obstacles: [],
        speed: 1,
        direction: -1,
      };

      const eventSpy = jest.fn();
      obstacleSystem.on('obstaclesGenerated', eventSpy);

      obstacleSystem.generateObstaclesForLane(riverLane);

      expect(eventSpy).toHaveBeenCalledWith({
        laneY: 2,
        type: ObstacleType.LOG,
      });

      const obstacles = obstacleSystem.getActiveObstacles();
      expect(obstacles.length).toBeGreaterThanOrEqual(3); // 3-4 logs
      expect(obstacles.length).toBeLessThanOrEqual(4);
      
      obstacles.forEach(obstacle => {
        expect(obstacle.type).toBe(ObstacleType.LOG);
        expect(obstacle.laneY).toBe(2);
        expect(obstacle.size.length).toBeGreaterThanOrEqual(2);
        expect(obstacle.size.length).toBeLessThanOrEqual(4);
      });
    });

    it('should not generate obstacles for existing lanes', () => {
      const roadLane: Lane = {
        y: 1,
        type: LaneType.ROAD,
        obstacles: [],
        speed: 2,
        direction: 1,
      };

      obstacleSystem.generateObstaclesForLane(roadLane);
      const firstCount = obstacleSystem.getActiveObstacles().length;

      obstacleSystem.generateObstaclesForLane(roadLane);
      const secondCount = obstacleSystem.getActiveObstacles().length;

      expect(secondCount).toBe(firstCount);
    });
  });

  describe('Obstacle Movement', () => {
    it('should move obstacles based on speed and direction', () => {
      const roadLane: Lane = {
        y: 0,
        type: LaneType.ROAD,
        obstacles: [],
        speed: 2,
        direction: 1,
      };

      obstacleSystem.generateObstaclesForLane(roadLane);
      const obstacles = obstacleSystem.getActiveObstacles();
      const initialPositions = obstacles.map(o => o.position.x);

      obstacleSystem.update(1); // 1 second delta

      obstacles.forEach((obstacle, index) => {
        const expectedPosition = initialPositions[index] + obstacle.speed * obstacle.direction;
        expect(Math.abs(obstacle.position.x - expectedPosition)).toBeLessThan(0.1);
      });
    });

    it('should wrap obstacles around when they go off screen', () => {
      const roadLane: Lane = {
        y: 0,
        type: LaneType.ROAD,
        obstacles: [],
        speed: 100, // Very high speed to force wrapping
        direction: 1,
      };

      obstacleSystem.generateObstaclesForLane(roadLane);
      const obstacles = obstacleSystem.getActiveObstacles();
      
      // Force an obstacle to the edge
      if (obstacles.length > 0) {
        obstacles[0].position.x = 10; // Near edge
        obstacles[0].speed = 100;
        obstacles[0].direction = 1;
      }

      obstacleSystem.update(1); // Should wrap around

      expect(obstacles[0].position.x).toBeLessThan(0); // Should wrap to negative side
    });
  });

  describe('Collision Detection', () => {
    it('should detect collision with vehicles', () => {
      const roadLane: Lane = {
        y: 0,
        type: LaneType.ROAD,
        obstacles: [],
        speed: 0, // Static for testing
        direction: 1,
      };

      obstacleSystem.generateObstaclesForLane(roadLane);
      const obstacles = obstacleSystem.getActiveObstacles();
      
      if (obstacles.length > 0) {
        const vehicle = obstacles[0];
        vehicle.position = { x: 0, y: 0, z: 0.5 };
        
        // Player at same position
        const collision = obstacleSystem.checkCollision({ x: 0, y: 0, z: 0 });
        expect(collision).toBeTruthy();
        expect(collision?.type).toBe(ObstacleType.VEHICLE);
      }
    });

    it('should not detect collision when player is far from obstacles', () => {
      const roadLane: Lane = {
        y: 0,
        type: LaneType.ROAD,
        obstacles: [],
        speed: 0,
        direction: 1,
      };

      obstacleSystem.generateObstaclesForLane(roadLane);
      
      // Player at different position
      const collision = obstacleSystem.checkCollision({ x: 100, y: 100, z: 0 });
      expect(collision).toBeNull();
    });

    it('should detect when player is on a log', () => {
      const riverLane: Lane = {
        y: 0,
        type: LaneType.RIVER,
        obstacles: [],
        speed: 0,
        direction: 1,
      };

      obstacleSystem.generateObstaclesForLane(riverLane);
      const obstacles = obstacleSystem.getActiveObstacles();
      
      if (obstacles.length > 0) {
        const log = obstacles[0];
        log.position = { x: 0, y: 0, z: 0.25 };
        log.size.length = 3;
        
        // Player on log
        const onLog = obstacleSystem.isOnLog({ x: 0, y: 0, z: 0 });
        expect(onLog).toBeTruthy();
        expect(onLog?.type).toBe(ObstacleType.LOG);
      }
    });

    it('should not detect player on log when not aligned', () => {
      const riverLane: Lane = {
        y: 0,
        type: LaneType.RIVER,
        obstacles: [],
        speed: 0,
        direction: 1,
      };

      obstacleSystem.generateObstaclesForLane(riverLane);
      const obstacles = obstacleSystem.getActiveObstacles();
      
      if (obstacles.length > 0) {
        const log = obstacles[0];
        log.position = { x: 0, y: 0, z: 0.25 };
        log.size.length = 2;
        
        // Player not on log (too far)
        const onLog = obstacleSystem.isOnLog({ x: 5, y: 0, z: 0 });
        expect(onLog).toBeNull();
      }
    });
  });

  describe('Lane Management', () => {
    it('should remove obstacles when lane is removed', () => {
      const roadLane: Lane = {
        y: 1,
        type: LaneType.ROAD,
        obstacles: [],
        speed: 2,
        direction: 1,
      };

      obstacleSystem.generateObstaclesForLane(roadLane);
      expect(obstacleSystem.getActiveObstacles().length).toBeGreaterThan(0);

      const eventSpy = jest.fn();
      obstacleSystem.on('obstaclesRemoved', eventSpy);

      obstacleSystem.removeObstaclesForLane(1);

      expect(eventSpy).toHaveBeenCalledWith({ laneY: 1 });
      expect(obstacleSystem.getActiveObstacles().filter(o => o.laneY === 1).length).toBe(0);
    });

    it('should handle multiple lanes independently', () => {
      const lane1: Lane = {
        y: 1,
        type: LaneType.ROAD,
        obstacles: [],
        speed: 2,
        direction: 1,
      };

      const lane2: Lane = {
        y: 2,
        type: LaneType.RIVER,
        obstacles: [],
        speed: 1,
        direction: -1,
      };

      obstacleSystem.generateObstaclesForLane(lane1);
      obstacleSystem.generateObstaclesForLane(lane2);

      const obstacles = obstacleSystem.getActiveObstacles();
      const lane1Obstacles = obstacles.filter(o => o.laneY === 1);
      const lane2Obstacles = obstacles.filter(o => o.laneY === 2);

      expect(lane1Obstacles.length).toBeGreaterThan(0);
      expect(lane2Obstacles.length).toBeGreaterThan(0);
      
      // Check types
      lane1Obstacles.forEach(o => expect(o.type).toBe(ObstacleType.VEHICLE));
      lane2Obstacles.forEach(o => expect(o.type).toBe(ObstacleType.LOG));
    });
  });

  describe('System Reset', () => {
    it('should reset all obstacles and pools', () => {
      const roadLane: Lane = {
        y: 0,
        type: LaneType.ROAD,
        obstacles: [],
        speed: 2,
        direction: 1,
      };

      obstacleSystem.generateObstaclesForLane(roadLane);
      expect(obstacleSystem.getActiveObstacles().length).toBeGreaterThan(0);

      const eventSpy = jest.fn();
      obstacleSystem.on('obstaclesReset', eventSpy);

      obstacleSystem.reset();

      expect(eventSpy).toHaveBeenCalled();
      expect(obstacleSystem.getActiveObstacles().length).toBe(0);
      
      const debugInfo = obstacleSystem.getDebugInfo();
      expect(debugInfo.active).toBe(0);
      expect(debugInfo.pooled).toBeGreaterThan(0);
    });
  });
});