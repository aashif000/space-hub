import React, { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import { Points, PointMaterial } from '@react-three/drei';
import * as THREE from 'three';
import { useTheme } from '../../contexts/ThemeContext';
import { FixedCanvas } from './fixed-canvas';
import SceneErrorBoundary from './SceneErrorBoundary';

// Advanced Particle System for Space Background
function AdvancedStarField({ count = 5000 }: { count?: number }) {
  const points = useRef<THREE.Points>(null);
  
  const particlesPosition = useMemo(() => {
    const positions = new Float32Array(count * 3);
    const colors = new Float32Array(count * 3);
    
    for (let i = 0; i < count; i++) {
      positions[i * 3] = (Math.random() - 0.5) * 2000;
      positions[i * 3 + 1] = (Math.random() - 0.5) * 2000;
      positions[i * 3 + 2] = (Math.random() - 0.5) * 2000;
      
      // Create varied star colors
      const intensity = Math.random();
      if (intensity > 0.9) {
        // Blue-white hot stars
        colors[i * 3] = 0.8 + Math.random() * 0.2;
        colors[i * 3 + 1] = 0.9 + Math.random() * 0.1;
        colors[i * 3 + 2] = 1.0;
      } else if (intensity > 0.7) {
        // Yellow-white stars
        colors[i * 3] = 1.0;
        colors[i * 3 + 1] = 0.9 + Math.random() * 0.1;
        colors[i * 3 + 2] = 0.7 + Math.random() * 0.3;
      } else {
        // Red-orange cooler stars
        colors[i * 3] = 0.8 + Math.random() * 0.2;
        colors[i * 3 + 1] = 0.4 + Math.random() * 0.4;
        colors[i * 3 + 2] = 0.2 + Math.random() * 0.3;
      }
    }
    
    return { positions, colors };
  }, [count]);

  useFrame((state) => {
    if (points.current) {
      points.current.rotation.x = state.clock.elapsedTime * 0.0001;
      points.current.rotation.y = state.clock.elapsedTime * 0.0002;
    }
  });

  return (
    <Points ref={points} positions={particlesPosition.positions} colors={particlesPosition.colors}>
      <PointMaterial
        transparent
        color="#ffffff"
        size={2}
        sizeAttenuation={true}
        depthWrite={false}
        vertexColors={true}
        blending={THREE.AdditiveBlending}
      />
    </Points>
  );
}

// Nebula Effect
function NebulaEffect() {
  const nebulaRef = useRef<THREE.Mesh>(null);
    useFrame((state) => {
    if (nebulaRef.current) {
      nebulaRef.current.rotation.z = state.clock.elapsedTime * 0.0005;
      
      // Handle material opacity safely
      const material = nebulaRef.current.material;
      if (material && !Array.isArray(material) && 'opacity' in material) {
        material.opacity = 0.1 + Math.sin(state.clock.elapsedTime * 0.5) * 0.05;
      }
    }
  });

  return (
    <mesh ref={nebulaRef} position={[0, 0, -500]}>
      <planeGeometry args={[1000, 1000]} />
      <meshBasicMaterial
        color="#4f46e5"
        transparent
        opacity={0.1}
        blending={THREE.AdditiveBlending}
      />
    </mesh>
  );
}

// Moving Comet System
function CometSystem() {
  const comets = useMemo(() => {
    return Array.from({ length: 3 }, (_, i) => ({
      id: i,
      speed: 0.1 + Math.random() * 0.2,
      radius: 50 + Math.random() * 100,
      height: Math.random() * 20 - 10,
      phase: Math.random() * Math.PI * 2
    }));
  }, []);

  return (
    <>
      {comets.map((comet) => (
        <MovingComet key={comet.id} {...comet} />
      ))}
    </>
  );
}

function MovingComet({ speed, radius, height, phase }: {
  speed: number;
  radius: number;
  height: number;
  phase: number;
}) {
  const cometRef = useRef<THREE.Group>(null);
  const trailRef = useRef<THREE.Points>(null);

  useFrame((state) => {
    if (cometRef.current) {
      const time = state.clock.elapsedTime * speed + phase;
      cometRef.current.position.x = Math.cos(time) * radius;
      cometRef.current.position.z = Math.sin(time) * radius;
      cometRef.current.position.y = height + Math.sin(time * 2) * 5;
    }
  });

  return (
    <group ref={cometRef}>
      {/* Comet core */}      <mesh>
        <sphereGeometry args={[0.5, 8, 8]} />
        <meshStandardMaterial
          color="#fbbf24"
          emissive="#f59e0b"
          emissiveIntensity={0.8}
        />
      </mesh>
      
      {/* Comet glow */}
      <mesh>
        <sphereGeometry args={[2, 8, 8]} />
        <meshBasicMaterial
          color="#fbbf24"
          transparent
          opacity={0.2}
          blending={THREE.AdditiveBlending}
        />
      </mesh>
    </group>
  );
}

// Main Enhanced Space Background Component
export const EnhancedSpaceBackground3D: React.FC<{
  className?: string;
  quality?: 'low' | 'medium' | 'high';
}> = ({ className = "", quality = 'medium' }) => {
  const { theme } = useTheme();
  const starCount = {
    low: 1000,
    medium: 3000,
    high: 5000
  }[quality];

  const showComets = quality !== 'low';
  const showNebula = quality === 'high';

  // Theme-aware background gradient
  const backgroundStyle = theme === 'dark' 
    ? 'linear-gradient(to bottom, #0f0f23, #1a1a2e, #16213e)'
    : 'linear-gradient(to bottom, #87CEEB, #E0F6FF, #F0F8FF)';
  return (
    <div className={`fixed inset-0 -z-10 ${className}`}>
      <SceneErrorBoundary>
        <FixedCanvas
          camera={{ position: [0, 0, 5], fov: 75 }}
          style={{ background: backgroundStyle }}
          gl={{ antialias: false, alpha: false }}
          dpr={quality === 'high' ? window.devicePixelRatio : 1}
        >
          <AdvancedStarField count={starCount} />
          {showNebula && <NebulaEffect />}
          {showComets && <CometSystem />}
          
          {/* Ambient lighting for subtle illumination */}
          <ambientLight intensity={theme === 'dark' ? 0.1 : 0.3} />
        </FixedCanvas>
      </SceneErrorBoundary>
    </div>
  );
};

export default EnhancedSpaceBackground3D;
