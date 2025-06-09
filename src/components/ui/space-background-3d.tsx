import React, { useRef, useMemo } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import * as THREE from 'three';

// Simple starfield component
function Starfield() {
  const mesh = useRef<THREE.Points>(null);
  const starCount = 800;

  const stars = useMemo(() => {
    const positions = new Float32Array(starCount * 3);
    const colors = new Float32Array(starCount * 3);
    const sizes = new Float32Array(starCount);

    for (let i = 0; i < starCount; i++) {
      // Random positions in a sphere
      const radius = Math.random() * 100 + 50;
      const theta = Math.random() * Math.PI * 2;
      const phi = Math.acos(2 * Math.random() - 1);

      positions[i * 3] = radius * Math.sin(phi) * Math.cos(theta);
      positions[i * 3 + 1] = radius * Math.sin(phi) * Math.sin(theta);
      positions[i * 3 + 2] = radius * Math.cos(phi);

      // Star colors - mostly white with some blue and subtle colored stars
      const colorType = Math.random();
      if (colorType < 0.7) {
        // White stars
        const brightness = 0.8 + Math.random() * 0.2;
        colors[i * 3] = brightness;
        colors[i * 3 + 1] = brightness;
        colors[i * 3 + 2] = brightness;
      } else if (colorType < 0.9) {
        // Blue-white stars
        colors[i * 3] = 0.6 + Math.random() * 0.2;
        colors[i * 3 + 1] = 0.7 + Math.random() * 0.2;
        colors[i * 3 + 2] = 1;
      } else {
        // Subtle colored stars
        colors[i * 3] = 0.7 + Math.random() * 0.3;
        colors[i * 3 + 1] = 0.5 + Math.random() * 0.3;
        colors[i * 3 + 2] = 0.8 + Math.random() * 0.2;
      }

      sizes[i] = Math.random() * 2 + 0.5;
    }

    return { positions, colors, sizes };
  }, []);

  useFrame((state) => {
    if (mesh.current) {
      // Very slow rotation
      mesh.current.rotation.y += 0.0001;
      
      // Gentle twinkling effect
      const time = state.clock.elapsedTime;
      const sizes = mesh.current.geometry.attributes.size.array as Float32Array;
      
      for (let i = 0; i < starCount; i++) {
        // Subtle size variation for twinkling
        const originalSize = stars.sizes[i];
        sizes[i] = originalSize * (0.8 + 0.4 * Math.sin(time * 2 + i * 0.1));
      }
      
      mesh.current.geometry.attributes.size.needsUpdate = true;
    }
  });

  return (
    <points ref={mesh}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          array={stars.positions}
          count={starCount}
          itemSize={3}
        />
        <bufferAttribute
          attach="attributes-color"
          array={stars.colors}
          count={starCount}
          itemSize={3}
        />
        <bufferAttribute
          attach="attributes-size"
          array={stars.sizes}
          count={starCount}
          itemSize={1}
        />
      </bufferGeometry>
      <pointsMaterial 
        size={1} 
        vertexColors 
        transparent 
        opacity={0.8}
        sizeAttenuation={false}
      />
    </points>
  );
}

// Floating particles (smaller count, gentler movement)
function FloatingParticles() {
  const mesh = useRef<THREE.Points>(null);
  const particleCount = 400;
  const particles = useMemo(() => {
    const positions = new Float32Array(particleCount * 3);
    const colors = new Float32Array(particleCount * 3);
    const velocities = new Float32Array(particleCount * 3);

    for (let i = 0; i < particleCount; i++) {
      // Random positions in a larger sphere
      const radius = Math.random() * 60 + 30;
      const theta = Math.random() * Math.PI * 2;
      const phi = Math.acos(2 * Math.random() - 1);

      positions[i * 3] = radius * Math.sin(phi) * Math.cos(theta);
      positions[i * 3 + 1] = radius * Math.sin(phi) * Math.sin(theta);
      positions[i * 3 + 2] = radius * Math.cos(phi);

      // Slower velocities for gentle floating
      velocities[i * 3] = (Math.random() - 0.5) * 0.01;
      velocities[i * 3 + 1] = (Math.random() - 0.5) * 0.01;
      velocities[i * 3 + 2] = (Math.random() - 0.5) * 0.01;

      // Subtle colored particles
      const colorType = Math.random();
      if (colorType < 0.5) {
        // Blue/cyan
        colors[i * 3] = 0.3 + Math.random() * 0.3;
        colors[i * 3 + 1] = 0.6 + Math.random() * 0.3;
        colors[i * 3 + 2] = 1;
      } else {
        // Purple/magenta
        colors[i * 3] = 0.6 + Math.random() * 0.3;
        colors[i * 3 + 1] = 0.3 + Math.random() * 0.3;
        colors[i * 3 + 2] = 0.9 + Math.random() * 0.1;
      }
    }

    return { positions, colors, velocities };
  }, []);

  useFrame((state) => {
    if (mesh.current) {
      // Gentle rotation
      mesh.current.rotation.y += 0.0002;
      mesh.current.rotation.x += 0.0001;

      // Animate particles with error handling
      const positionAttribute = mesh.current.geometry.attributes.position;
      if (positionAttribute && positionAttribute.array) {
        const positions = positionAttribute.array as Float32Array;
        for (let i = 0; i < particleCount; i++) {
          positions[i * 3] += particles.velocities[i * 3];
          positions[i * 3 + 1] += particles.velocities[i * 3 + 1];
          positions[i * 3 + 2] += particles.velocities[i * 3 + 2];

          // Boundary wrapping with larger bounds
          if (Math.abs(positions[i * 3]) > 90) particles.velocities[i * 3] *= -1;
          if (Math.abs(positions[i * 3 + 1]) > 90) particles.velocities[i * 3 + 1] *= -1;
          if (Math.abs(positions[i * 3 + 2]) > 90) particles.velocities[i * 3 + 2] *= -1;
        }
        positionAttribute.needsUpdate = true;
      }
    }
  });

  return (
    <points ref={mesh}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          array={particles.positions}
          count={particleCount}
          itemSize={3}
        />
        <bufferAttribute
          attach="attributes-color"
          array={particles.colors}
          count={particleCount}
          itemSize={3}
        />
      </bufferGeometry>
      <pointsMaterial 
        size={0.5} 
        vertexColors 
        transparent 
        opacity={0.6}
        sizeAttenuation={false}
      />
    </points>
  );
}

// Animated planets with gentle effects
function AnimatedPlanet({ position, color, size, orbitRadius = 0, orbitSpeed = 0.01 }: { 
  position: [number, number, number], 
  color: string, 
  size: number,
  orbitRadius?: number,
  orbitSpeed?: number 
}) {
  const mesh = useRef<THREE.Mesh>(null);
  const group = useRef<THREE.Group>(null);

  useFrame((state) => {
    if (mesh.current) {
      // Planet rotation
      mesh.current.rotation.y += 0.01;
      
      // Gentle pulsing effect
      const scale = 1 + Math.sin(state.clock.elapsedTime * 1) * 0.05;
      mesh.current.scale.setScalar(scale);
    }
    
    if (group.current && orbitRadius > 0) {
      // Orbital motion
      group.current.rotation.y += orbitSpeed;
    }
  });

  const planetMesh = (
    <mesh ref={mesh} position={orbitRadius > 0 ? [orbitRadius, 0, 0] : position}>
      <sphereGeometry args={[size, 24, 24]} />
      <meshBasicMaterial 
        color={color} 
        transparent 
        opacity={0.6}
      />
    </mesh>
  );

  if (orbitRadius > 0) {
    return (
      <group ref={group} position={position}>
        {planetMesh}
      </group>
    );
  }

  return planetMesh;
}

// Animated circles moving right to left (centralized on screen)
function MovingCircles() {
  const groupRef = useRef<THREE.Group>(null);
  const circleCount = 12;

  const circles = useMemo(() => {
    const circleData = [];
    for (let i = 0; i < circleCount; i++) {
      circleData.push({
        x: Math.random() * 60 + 40, // Start from right side of screen
        y: (Math.random() - 0.5) * 20, // Centralized vertically
        z: Math.random() * 10 + 5, // Closer to camera for visibility
        size: Math.random() > 0.5 ? Math.random() * 2 + 1.5 : Math.random() * 1 + 0.3, // Big and small circles
        speed: Math.random() * 0.05 + 0.02, // Faster speed
        color: ['#ff6b6b', '#4ecdc4', '#45b7d1', '#96ceb4', '#ffeaa7', '#dda0dd', '#98d8c8', '#f7dc6f'][Math.floor(Math.random() * 8)],
        opacity: Math.random() * 0.4 + 0.3, // More visible
        delay: Math.random() * 100 // Staggered start times
      });
    }
    return circleData;
  }, []);

  useFrame((state) => {
    if (groupRef.current) {
      groupRef.current.children.forEach((child, index) => {
        const circle = circles[index];
        const time = state.clock.elapsedTime;
        
        // Move from right to left continuously
        child.position.x -= circle.speed;
        
        // Reset position when it goes off screen left
        if (child.position.x < -50) {
          child.position.x = Math.random() * 20 + 40; // Reset to right side
          child.position.y = (Math.random() - 0.5) * 20; // New Y position
          child.position.z = Math.random() * 10 + 5; // New Z position
        }
        
        // Subtle vertical floating
        child.position.y += Math.sin(time * 0.5 + circle.delay) * 0.005;
        
        // Gentle pulsing effect
        const scale = 1 + Math.sin(time * 0.8 + circle.delay) * 0.15;
        child.scale.setScalar(scale);
      });
    }
  });

  return (
    <group ref={groupRef}>
      {circles.map((circle, index) => (
        <mesh key={index} position={[circle.x, circle.y, circle.z]}>
          <sphereGeometry args={[circle.size, 20, 20]} />
          <meshBasicMaterial 
            color={circle.color} 
            transparent 
            opacity={circle.opacity}
          />
        </mesh>
      ))}
    </group>
  );
}

// Main balanced 3D background component
export default function SpaceBackground3D() {
  return (
    <div className="fixed inset-0 z-0 pointer-events-none">
      <Canvas camera={{ position: [0, 0, 15], fov: 75 }}>
        <color attach="background" args={['#0a0e17']} />
        
        {/* Ambient lighting */}
        <ambientLight intensity={0.1} />
        
        {/* Background elements */}
        <Starfield />
        <FloatingParticles />
        <MovingCircles />
        
        {/* A few animated planets */}
        <AnimatedPlanet position={[-25, 8, -30]} color="#4f46e5" size={1.2} orbitRadius={0} />
        <AnimatedPlanet position={[20, -5, -25]} color="#ec4899" size={0.8} orbitRadius={2} orbitSpeed={0.01} />
        <AnimatedPlanet position={[10, 12, -35]} color="#06b6d4" size={0.6} orbitRadius={1.5} orbitSpeed={0.008} />
        <AnimatedPlanet position={[-15, -12, -40]} color="#8b5cf6" size={0.5} orbitRadius={0} />
      </Canvas>
    </div>
  );
}
