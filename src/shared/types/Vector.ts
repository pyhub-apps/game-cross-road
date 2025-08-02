/**
 * 2D Vector type
 */
export interface Vec2 {
  x: number;
  y: number;
}

/**
 * 3D Vector type
 */
export interface Vec3 {
  x: number;
  y: number;
  z: number;
}

/**
 * Vector utilities
 */
export const Vector2 = {
  create: (x = 0, y = 0): Vec2 => ({ x, y }),
  add: (a: Vec2, b: Vec2): Vec2 => ({ x: a.x + b.x, y: a.y + b.y }),
  subtract: (a: Vec2, b: Vec2): Vec2 => ({ x: a.x - b.x, y: a.y - b.y }),
  multiply: (v: Vec2, scalar: number): Vec2 => ({ x: v.x * scalar, y: v.y * scalar }),
  divide: (v: Vec2, scalar: number): Vec2 => ({ x: v.x / scalar, y: v.y / scalar }),
  length: (v: Vec2): number => Math.sqrt(v.x * v.x + v.y * v.y),
  normalize: (v: Vec2): Vec2 => {
    const len = Vector2.length(v);
    return len > 0 ? Vector2.divide(v, len) : { x: 0, y: 0 };
  },
  distance: (a: Vec2, b: Vec2): number => Vector2.length(Vector2.subtract(b, a)),
  dot: (a: Vec2, b: Vec2): number => a.x * b.x + a.y * b.y,
  lerp: (a: Vec2, b: Vec2, t: number): Vec2 => ({
    x: a.x + (b.x - a.x) * t,
    y: a.y + (b.y - a.y) * t
  })
};

export const Vector3 = {
  create: (x = 0, y = 0, z = 0): Vec3 => ({ x, y, z }),
  add: (a: Vec3, b: Vec3): Vec3 => ({ x: a.x + b.x, y: a.y + b.y, z: a.z + b.z }),
  subtract: (a: Vec3, b: Vec3): Vec3 => ({ x: a.x - b.x, y: a.y - b.y, z: a.z - b.z }),
  multiply: (v: Vec3, scalar: number): Vec3 => ({ x: v.x * scalar, y: v.y * scalar, z: v.z * scalar }),
  divide: (v: Vec3, scalar: number): Vec3 => ({ x: v.x / scalar, y: v.y / scalar, z: v.z / scalar }),
  length: (v: Vec3): number => Math.sqrt(v.x * v.x + v.y * v.y + v.z * v.z),
  normalize: (v: Vec3): Vec3 => {
    const len = Vector3.length(v);
    return len > 0 ? Vector3.divide(v, len) : { x: 0, y: 0, z: 0 };
  },
  distance: (a: Vec3, b: Vec3): number => Vector3.length(Vector3.subtract(b, a)),
  dot: (a: Vec3, b: Vec3): number => a.x * b.x + a.y * b.y + a.z * b.z,
  cross: (a: Vec3, b: Vec3): Vec3 => ({
    x: a.y * b.z - a.z * b.y,
    y: a.z * b.x - a.x * b.z,
    z: a.x * b.y - a.y * b.x
  }),
  lerp: (a: Vec3, b: Vec3, t: number): Vec3 => ({
    x: a.x + (b.x - a.x) * t,
    y: a.y + (b.y - a.y) * t,
    z: a.z + (b.z - a.z) * t
  })
};