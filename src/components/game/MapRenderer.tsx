import React, { useMemo } from 'react';
import { Lane, LaneType } from '../../game/systems/MapSystem';
import * as THREE from 'three';

interface MapRendererProps {
  lanes: Lane[];
}

// Individual lane component
const LaneRenderer: React.FC<{ lane: Lane }> = ({ lane }) => {
  const material = useMemo(() => {
    let color: string;
    let emissive: string | undefined;
    
    switch (lane.type) {
      case LaneType.ROAD:
        color = '#3a3a3a';
        emissive = '#1a1a1a';
        break;
      case LaneType.RIVER:
        color = '#2E86AB';
        emissive = '#1d5c7e';
        break;
      case LaneType.SAFE:
        color = '#90EE90';
        emissive = '#5fa65f';
        break;
      case LaneType.GRASS:
      default:
        color = '#228B22';
        emissive = '#145214';
        break;
    }

    return new THREE.MeshPhongMaterial({
      color,
      emissive: emissive ? new THREE.Color(emissive) : undefined,
      emissiveIntensity: 0.1,
      shininess: lane.type === LaneType.RIVER ? 80 : 10,
    });
  }, [lane.type]);

  // Add lane markings for roads
  const roadMarkings = useMemo(() => {
    if (lane.type !== LaneType.ROAD) return null;
    
    const markings = [];
    const markingWidth = 0.2;
    const markingLength = 2;
    const markingGap = 2;
    const numMarkings = 5;
    
    for (let i = 0; i < numMarkings; i++) {
      const x = (i - numMarkings / 2) * (markingLength + markingGap);
      markings.push(
        <mesh 
          key={`marking-${i}`}
          position={[x, 0.01, -lane.y]}
        >
          <boxGeometry args={[markingLength, 0.02, markingWidth]} />
          <meshBasicMaterial color="#FFFF00" />
        </mesh>
      );
    }
    
    return markings;
  }, [lane.type, lane.y]);

  // Add water animation for rivers
  const waterAnimation = useMemo(() => {
    if (lane.type !== LaneType.RIVER) return null;
    
    // Create a simple animated water texture
    const canvas = document.createElement('canvas');
    canvas.width = 512;
    canvas.height = 64;
    const ctx = canvas.getContext('2d');
    
    if (ctx) {
      const gradient = ctx.createLinearGradient(0, 0, 512, 0);
      gradient.addColorStop(0, '#2E86AB');
      gradient.addColorStop(0.5, '#3a9dc4');
      gradient.addColorStop(1, '#2E86AB');
      ctx.fillStyle = gradient;
      ctx.fillRect(0, 0, 512, 64);
      
      // Add wave pattern
      ctx.strokeStyle = '#226688';
      ctx.lineWidth = 2;
      for (let i = 0; i < 10; i++) {
        ctx.beginPath();
        const y = Math.sin(i * 0.5) * 10 + 32;
        ctx.moveTo(i * 51.2, y);
        ctx.quadraticCurveTo(
          i * 51.2 + 25.6, y - 10,
          i * 51.2 + 51.2, y
        );
        ctx.stroke();
      }
    }
    
    const texture = new THREE.CanvasTexture(canvas);
    texture.wrapS = THREE.RepeatWrapping;
    texture.wrapT = THREE.RepeatWrapping;
    texture.repeat.set(4, 1);
    
    return texture;
  }, [lane.type]);

  return (
    <group>
      {/* Main lane tile */}
      <mesh 
        position={[0, 0, -lane.y]}
        receiveShadow
      >
        <boxGeometry args={[20, 0.1, 1]} />
        <meshPhongMaterial
          {...material}
          map={waterAnimation}
        />
      </mesh>
      
      {/* Road markings */}
      {roadMarkings}
      
      {/* Safe zone indicators */}
      {lane.type === LaneType.SAFE && (
        <>
          <mesh position={[-9, 0.02, -lane.y]}>
            <boxGeometry args={[0.5, 0.02, 0.8]} />
            <meshBasicMaterial color="#FFD700" />
          </mesh>
          <mesh position={[9, 0.02, -lane.y]}>
            <boxGeometry args={[0.5, 0.02, 0.8]} />
            <meshBasicMaterial color="#FFD700" />
          </mesh>
        </>
      )}
    </group>
  );
};

// Main MapRenderer component
export const MapRenderer: React.FC<MapRendererProps> = ({ lanes }) => {
  // Sort lanes by Y position for proper rendering order
  const sortedLanes = useMemo(() => {
    return [...lanes].sort((a, b) => a.y - b.y);
  }, [lanes]);

  return (
    <group name="map">
      {sortedLanes.map(lane => (
        <LaneRenderer key={`lane-${lane.y}`} lane={lane} />
      ))}
      
      {/* Add ambient decorations */}
      <group name="decorations">
        {sortedLanes.map(lane => {
          if (lane.type === LaneType.GRASS || lane.type === LaneType.SAFE) {
            // Add random trees/bushes
            const decorations = [];
            for (let i = 0; i < 3; i++) {
              const x = (Math.random() - 0.5) * 18;
              const z = -lane.y + (Math.random() - 0.5) * 0.8;
              
              decorations.push(
                <mesh 
                  key={`tree-${lane.y}-${i}`}
                  position={[x, 0.5, z]}
                  castShadow
                >
                  <coneGeometry args={[0.3, 1, 6]} />
                  <meshPhongMaterial color="#0F5132" />
                </mesh>
              );
            }
            return decorations;
          }
          return null;
        })}
      </group>
    </group>
  );
};