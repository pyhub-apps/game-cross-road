import React, { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { Obstacle, ObstacleType } from '../../game/systems/ObstacleSystem';

interface ObstacleRendererProps {
  obstacles: Obstacle[];
  frustumCulling?: boolean;
  debug?: boolean; // 명시적 디버그 모드
}

// 차량 메시 컴포넌트
const VehicleMesh: React.FC<{ obstacle: Obstacle }> = ({ obstacle }) => {
  const meshRef = useRef<THREE.Mesh>(null);
  
  // 차량 기하학 생성
  const geometry = useMemo(() => {
    const geo = new THREE.BoxGeometry(
      obstacle.size.length,
      obstacle.size.width,
      obstacle.size.height
    );
    return geo;
  }, [obstacle.size]);

  // 차량 재질 생성
  const material = useMemo(() => {
    return new THREE.MeshPhongMaterial({
      color: obstacle.color || '#FF4444',
      emissive: new THREE.Color(obstacle.color || '#FF4444').multiplyScalar(0.1),
      shininess: 100,
    });
  }, [obstacle.color]);

  // 위치 업데이트
  useFrame(() => {
    if (meshRef.current) {
      meshRef.current.position.set(
        obstacle.position.x,
        obstacle.position.z,
        -obstacle.position.y
      );
      // 방향에 따라 회전
      meshRef.current.rotation.y = obstacle.direction === 1 ? 0 : Math.PI;
    }
  });

  return (
    <>
      <mesh
        ref={meshRef}
        geometry={geometry}
        material={material}
        castShadow
        receiveShadow
        frustumCulled={true}
      />
      {/* 바퀴 표현 */}
      <group position={[obstacle.position.x, obstacle.position.z - obstacle.size.height / 2, -obstacle.position.y]}>
        {/* 앞 바퀴 */}
        <mesh position={[obstacle.size.length * 0.3, 0, obstacle.size.width * 0.3]}>
          <cylinderGeometry args={[0.15, 0.15, 0.1, 8]} />
          <meshPhongMaterial color="#222222" />
        </mesh>
        <mesh position={[obstacle.size.length * 0.3, 0, -obstacle.size.width * 0.3]}>
          <cylinderGeometry args={[0.15, 0.15, 0.1, 8]} />
          <meshPhongMaterial color="#222222" />
        </mesh>
        {/* 뒤 바퀴 */}
        <mesh position={[-obstacle.size.length * 0.3, 0, obstacle.size.width * 0.3]}>
          <cylinderGeometry args={[0.15, 0.15, 0.1, 8]} />
          <meshPhongMaterial color="#222222" />
        </mesh>
        <mesh position={[-obstacle.size.length * 0.3, 0, -obstacle.size.width * 0.3]}>
          <cylinderGeometry args={[0.15, 0.15, 0.1, 8]} />
          <meshPhongMaterial color="#222222" />
        </mesh>
      </group>
    </>
  );
};

// 나무줄기 메시 컴포넌트
const LogMesh: React.FC<{ obstacle: Obstacle }> = ({ obstacle }) => {
  const meshRef = useRef<THREE.Mesh>(null);
  
  // 나무줄기 기하학 생성
  const geometry = useMemo(() => {
    // 실린더 형태로 나무줄기 표현
    const geo = new THREE.CylinderGeometry(
      obstacle.size.height,
      obstacle.size.height,
      obstacle.size.length,
      8
    );
    // Y축을 기준으로 90도 회전하여 수평으로 놓기
    geo.rotateZ(Math.PI / 2);
    return geo;
  }, [obstacle.size]);

  // 나무줄기 재질은 직접 JSX에서 생성

  // 나무 텍스처 패턴 (간단한 나무결 표현)
  const barkPattern = useMemo(() => {
    const canvas = document.createElement('canvas');
    canvas.width = 256;
    canvas.height = 64;
    const ctx = canvas.getContext('2d');
    
    if (ctx) {
      // 베이스 색상
      ctx.fillStyle = obstacle.color || '#8B4513';
      ctx.fillRect(0, 0, 256, 64);
      
      // 나무결 패턴
      ctx.strokeStyle = '#654321';
      ctx.lineWidth = 2;
      for (let i = 0; i < 20; i++) {
        ctx.beginPath();
        ctx.moveTo(Math.random() * 256, 0);
        ctx.lineTo(Math.random() * 256, 64);
        ctx.stroke();
      }
    }
    
    const texture = new THREE.CanvasTexture(canvas);
    texture.wrapS = THREE.RepeatWrapping;
    texture.wrapT = THREE.RepeatWrapping;
    texture.repeat.set(obstacle.size.length / 2, 1);
    return texture;
  }, [obstacle.color, obstacle.size.length]);

  // 위치 업데이트
  useFrame(() => {
    if (meshRef.current) {
      meshRef.current.position.set(
        obstacle.position.x,
        obstacle.position.z,
        -obstacle.position.y
      );
    }
  });

  return (
    <mesh
      ref={meshRef}
      geometry={geometry}
      castShadow
      receiveShadow
      frustumCulled={true}
    >
      <meshPhongMaterial
        color={obstacle.color || '#8B4513'}
        map={barkPattern}
        emissive={new THREE.Color('#4A2C17')}
        emissiveIntensity={0.1}
        shininess={10}
      />
    </mesh>
  );
};

// Instanced Mesh를 사용한 최적화된 렌더러
const InstancedObstacles: React.FC<{
  obstacles: Obstacle[];
  type: ObstacleType;
}> = ({ obstacles, type }) => {
  const meshRef = useRef<THREE.InstancedMesh>(null);
  const dummy = useMemo(() => new THREE.Object3D(), []);

  // 타입별 기하학과 재질
  const [geometry, material] = useMemo(() => {
    if (type === ObstacleType.VEHICLE) {
      const geo = new THREE.BoxGeometry(2, 0.8, 0.8);
      const mat = new THREE.MeshPhongMaterial({ color: '#FF4444' });
      return [geo, mat];
    } else {
      const geo = new THREE.CylinderGeometry(0.4, 0.4, 3, 8);
      geo.rotateZ(Math.PI / 2);
      const mat = new THREE.MeshPhongMaterial({ color: '#8B4513' });
      return [geo, mat];
    }
  }, [type]);

  // 인스턴스 업데이트
  useFrame(() => {
    if (!meshRef.current) return;

    obstacles.forEach((obstacle, index) => {
      dummy.position.set(
        obstacle.position.x,
        obstacle.position.z,
        -obstacle.position.y
      );
      dummy.rotation.y = obstacle.direction === 1 ? 0 : Math.PI;
      dummy.scale.set(
        obstacle.size.length / 2,
        obstacle.size.height / 0.8,
        obstacle.size.width / 0.8
      );
      dummy.updateMatrix();

      meshRef.current!.setMatrixAt(index, dummy.matrix);
      
      // 색상 업데이트
      const color = new THREE.Color(obstacle.color || '#FF4444');
      meshRef.current!.setColorAt(index, color);
    });

    meshRef.current.instanceMatrix.needsUpdate = true;
    if (meshRef.current.instanceColor) {
      meshRef.current.instanceColor.needsUpdate = true;
    }
  });

  return (
    <instancedMesh
      ref={meshRef}
      args={[geometry, material, obstacles.length]}
      castShadow
      receiveShadow
      frustumCulled={true}
    />
  );
};

// 메인 ObstacleRenderer 컴포넌트
export const ObstacleRenderer: React.FC<ObstacleRendererProps> = ({
  obstacles,
  debug = false,
}) => {
  // 타입별로 장애물 분류
  const { vehicles, logs } = useMemo(() => {
    const vehicles: Obstacle[] = [];
    const logs: Obstacle[] = [];

    obstacles.forEach(obstacle => {
      if (!obstacle.active) return;
      
      if (obstacle.type === ObstacleType.VEHICLE) {
        vehicles.push(obstacle);
      } else if (obstacle.type === ObstacleType.LOG) {
        logs.push(obstacle);
      }
    });

    return { vehicles, logs };
  }, [obstacles]);

  // 성능 최적화를 위해 일정 수 이상일 때는 Instanced Mesh 사용
  const useInstancing = vehicles.length > 10 || logs.length > 10;

  return (
    <group name="obstacles">
      {useInstancing ? (
        <>
          {vehicles.length > 0 && (
            <InstancedObstacles obstacles={vehicles} type={ObstacleType.VEHICLE} />
          )}
          {logs.length > 0 && (
            <InstancedObstacles obstacles={logs} type={ObstacleType.LOG} />
          )}
        </>
      ) : (
        <>
          {vehicles.map(obstacle => (
            <VehicleMesh key={obstacle.id} obstacle={obstacle} />
          ))}
          {logs.map(obstacle => (
            <LogMesh key={obstacle.id} obstacle={obstacle} />
          ))}
        </>
      )}

      {/* 디버그 모드: 충돌 박스 표시 */}
      {debug && (
        <group name="debug-collision-boxes">
          {obstacles.map(obstacle => (
            <mesh
              key={`debug-${obstacle.id}`}
              position={[
                obstacle.position.x,
                obstacle.position.z + 0.5,
                -obstacle.position.y
              ]}
            >
              <boxGeometry
                args={[
                  obstacle.size.length,
                  obstacle.size.height,
                  obstacle.size.width,
                ]}
              />
              <meshBasicMaterial
                color="red"
                wireframe
                transparent
                opacity={0.3}
              />
            </mesh>
          ))}
        </group>
      )}
    </group>
  );
};