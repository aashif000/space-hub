import React, { useRef, useMemo, Suspense, useState } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls, Stars, Text, Sphere, Ring, Torus, Cylinder, Environment } from '@react-three/drei';
import * as THREE from 'three';
import { motion } from 'framer-motion';
import { useTheme } from '../../contexts/ThemeContext';

// Enhanced Planet Component with better materials and lighting
function EnhancedPlanet({ 
  position, 
  size = 1, 
  color = '#4f46e5', 
  name = 'Planet',
  hasRings = false,
  hasAtmosphere = false,
  rotationSpeed = 0.01,
  onClick
}: {
  position: [number, number, number];
  size?: number;
  color?: string;
  name?: string;
  hasRings?: boolean;
  hasAtmosphere?: boolean;
  rotationSpeed?: number;
  onClick?: () => void;
}) {
  const planetRef = useRef<THREE.Mesh>(null);
  const atmosphereRef = useRef<THREE.Mesh>(null);
  const ringsRef = useRef<THREE.Mesh>(null);

  // Generate procedural planet texture
  const planetTexture = useMemo(() => {
    const canvas = document.createElement('canvas');
    canvas.width = 512;
    canvas.height = 256;
    const ctx = canvas.getContext('2d')!;
    
    // Create gradient for planet surface
    const gradient = ctx.createLinearGradient(0, 0, 512, 256);
    const baseColor = new THREE.Color(color);
    gradient.addColorStop(0, baseColor.clone().multiplyScalar(1.2).getHexString());
    gradient.addColorStop(0.3, baseColor.getHexString());
    gradient.addColorStop(0.7, baseColor.clone().multiplyScalar(0.8).getHexString());
    gradient.addColorStop(1, baseColor.clone().multiplyScalar(0.6).getHexString());
    
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, 512, 256);
    
    // Add surface details
    for (let i = 0; i < 50; i++) {
      const x = Math.random() * 512;
      const y = Math.random() * 256;
      const radius = Math.random() * 20 + 5;
      const opacity = Math.random() * 0.3 + 0.1;
      
      ctx.globalAlpha = opacity;
      ctx.fillStyle = baseColor.clone().multiplyScalar(Math.random() * 0.5 + 0.5).getHexString();
      ctx.beginPath();
      ctx.arc(x, y, radius, 0, Math.PI * 2);
      ctx.fill();
    }
    
    return new THREE.CanvasTexture(canvas);
  }, [color]);

  useFrame((state) => {
    if (planetRef.current) {
      planetRef.current.rotation.y += rotationSpeed;
      
      // Add subtle breathing animation
      const scale = 1 + Math.sin(state.clock.elapsedTime * 0.5) * 0.02;
      planetRef.current.scale.setScalar(scale);
    }
    
    if (atmosphereRef.current) {
      atmosphereRef.current.rotation.y += rotationSpeed * 0.5;
    }
    
    if (ringsRef.current) {
      ringsRef.current.rotation.z += rotationSpeed * 0.3;
    }
  });

  return (
    <group position={position} onClick={onClick}>
      {/* Main Planet */}
      <Sphere ref={planetRef} args={[size, 64, 32]}>
        <meshPhysicalMaterial 
          map={planetTexture}
          roughness={0.7}
          metalness={0.1}
          clearcoat={0.3}
          clearcoatRoughness={0.2}
          emissive={color}
          emissiveIntensity={0.02}
        />
      </Sphere>
      
      {/* Atmosphere */}
      {hasAtmosphere && (
        <Sphere ref={atmosphereRef} args={[size * 1.05, 32, 16]}>
          <meshBasicMaterial 
            color={color}
            transparent
            opacity={0.1}
            side={THREE.BackSide}
          />
        </Sphere>
      )}
      
      {/* Rings */}
      {hasRings && (
        <Ring ref={ringsRef} args={[size * 1.2, size * 2, 64]}>
          <meshBasicMaterial 
            color={color}
            transparent
            opacity={0.6}
            side={THREE.DoubleSide}
          />
        </Ring>
      )}
      
      {/* Planet Label */}
      <Text
        position={[0, size * 1.5, 0]}
        fontSize={size * 0.3}
        color="white"
        anchorX="center"
        anchorY="middle"
      >
        {name}
      </Text>
    </group>
  );
}

// Enhanced Space Station
function EnhancedSpaceStation({ position }: { position: [number, number, number] }) {
  const stationRef = useRef<THREE.Group>(null);
  
  useFrame((state) => {
    if (stationRef.current) {
      stationRef.current.rotation.y += 0.01;
      stationRef.current.rotation.z = Math.sin(state.clock.elapsedTime * 0.5) * 0.1;
    }
  });

  return (
    <group ref={stationRef} position={position}>
      {/* Central Hub */}
      <Sphere args={[0.5, 32, 16]}>
        <meshPhysicalMaterial 
          color="#888888"
          roughness={0.3}
          metalness={0.8}
          emissive="#0066ff"
          emissiveIntensity={0.1}
        />
      </Sphere>
      
      {/* Solar Panels */}
      {[0, 1, 2, 3].map((i) => (
        <group key={i} rotation={[0, (i * Math.PI) / 2, 0]}>
          <Cylinder args={[0.05, 0.05, 2]} position={[1.5, 0, 0]} rotation={[0, 0, Math.PI / 2]}>
            <meshPhysicalMaterial color="#333333" metalness={0.9} />
          </Cylinder>
          <mesh position={[2.5, 0, 0]}>
            <planeGeometry args={[1.5, 0.8]} />
            <meshPhysicalMaterial 
              color="#001133"
              emissive="#0066ff"
              emissiveIntensity={0.2}
              transparent
              opacity={0.8}
            />
          </mesh>
        </group>
      ))}
      
      {/* Communication Dish */}
      <Torus args={[0.3, 0.05, 8, 32]} position={[0, 0.8, 0]} rotation={[Math.PI / 4, 0, 0]}>
        <meshPhysicalMaterial color="#ffffff" metalness={0.9} />
      </Torus>
    </group>
  );
}

// Enhanced Asteroid Belt
function EnhancedAsteroidBelt({ count = 100, radius = 15 }: { count?: number; radius?: number }) {
  const asteroids = useMemo(() => {
    return Array.from({ length: count }, (_, i) => {
      const angle = (i / count) * Math.PI * 2;
      const r = radius + (Math.random() - 0.5) * 5;
      const x = Math.cos(angle) * r;
      const z = Math.sin(angle) * r;
      const y = (Math.random() - 0.5) * 2;
      
      return {
        position: [x, y, z] as [number, number, number],
        size: Math.random() * 0.3 + 0.1,
        rotation: [Math.random() * Math.PI, Math.random() * Math.PI, Math.random() * Math.PI] as [number, number, number],
        speed: Math.random() * 0.01 + 0.005
      };
    });
  }, [count, radius]);

  return (
    <>
      {asteroids.map((asteroid, i) => (
        <AsteroidRock key={i} {...asteroid} />
      ))}
    </>
  );
}

function AsteroidRock({ 
  position, 
  size, 
  rotation, 
  speed 
}: { 
  position: [number, number, number]; 
  size: number; 
  rotation: [number, number, number]; 
  speed: number; 
}) {
  const meshRef = useRef<THREE.Mesh>(null);
  
  useFrame(() => {
    if (meshRef.current) {
      meshRef.current.rotation.x += speed;
      meshRef.current.rotation.y += speed * 0.7;
      meshRef.current.rotation.z += speed * 0.3;
    }
  });

  return (
    <mesh ref={meshRef} position={position}>
      <dodecahedronGeometry args={[size]} />
      <meshPhysicalMaterial 
        color="#666666"
        roughness={0.9}
        metalness={0.1}
      />
    </mesh>
  );
}

// Main Enhanced 3D Scene Component
export function Enhanced3DSpaceScene() {
  const { theme } = useTheme();
  const [selectedPlanet, setSelectedPlanet] = useState<string | null>(null);

  const planets = [
    { name: 'Mercury', position: [8, 0, 0] as [number, number, number], size: 0.4, color: '#8C7853', rotationSpeed: 0.04 },
    { name: 'Venus', position: [10, 0, 0] as [number, number, number], size: 0.9, color: '#FFC649', hasAtmosphere: true, rotationSpeed: 0.03 },
    { name: 'Earth', position: [12, 0, 0] as [number, number, number], size: 1, color: '#6B93D6', hasAtmosphere: true, rotationSpeed: 0.02 },
    { name: 'Mars', position: [14, 0, 0] as [number, number, number], size: 0.5, color: '#CD5C5C', rotationSpeed: 0.018 },
    { name: 'Jupiter', position: [18, 0, 0] as [number, number, number], size: 2.5, color: '#D8CA9D', hasRings: true, rotationSpeed: 0.01 },
    { name: 'Saturn', position: [22, 0, 0] as [number, number, number], size: 2, color: '#FAD5A5', hasRings: true, rotationSpeed: 0.009 },
    { name: 'Uranus', position: [26, 0, 0] as [number, number, number], size: 1.5, color: '#4FD0E7', hasRings: true, rotationSpeed: 0.008 },
    { name: 'Neptune', position: [30, 0, 0] as [number, number, number], size: 1.4, color: '#4B70DD', rotationSpeed: 0.007 },
  ];

  return (
    <div className="h-full w-full relative">
      <Canvas
        camera={{ position: [0, 10, 35], fov: 60 }}
        gl={{ 
          antialias: true, 
          alpha: true,
          powerPreference: "high-performance"
        }}
      >
        <Suspense fallback={null}>
          {/* Enhanced Lighting */}
          <ambientLight intensity={0.2} />
          <pointLight position={[0, 0, 0]} intensity={2} color="#FDB813" />
          <directionalLight position={[10, 10, 5]} intensity={1} color="#ffffff" />
          
          {/* Environment */}
          <Environment preset="night" />
            {/* Central Sun */}
          <Sphere position={[0, 0, 0]} args={[1.5, 32, 16]}>
            <meshBasicMaterial 
              color="#FDB813"
            />
          </Sphere>
          
          {/* Planets */}
          {planets.map((planet) => (
            <EnhancedPlanet
              key={planet.name}
              {...planet}
              onClick={() => setSelectedPlanet(planet.name)}
            />
          ))}
          
          {/* Space Station */}
          <EnhancedSpaceStation position={[15, 3, 5]} />
          
          {/* Asteroid Belt */}
          <EnhancedAsteroidBelt count={150} radius={16} />
          
          {/* Background Stars */}
          <Stars radius={100} depth={50} count={5000} factor={4} saturation={0} fade />
            {/* Controls */}
          <OrbitControls 
            enablePan={true}
            enableZoom={true}
            enableRotate={true}
            zoomSpeed={0.6}
            panSpeed={0.5}
            rotateSpeed={0.4}
            minDistance={5}
            maxDistance={100}
          />
        </Suspense>
      </Canvas>
      
      {/* Planet Info Panel */}
      {selectedPlanet && (
        <motion.div
          initial={{ opacity: 0, x: 300 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: 300 }}
          className="absolute top-4 right-4 bg-black/80 backdrop-blur-sm p-6 rounded-lg border border-white/20 text-white max-w-sm"
        >
          <h3 className="text-xl font-bold mb-2">{selectedPlanet}</h3>
          <button
            onClick={() => setSelectedPlanet(null)}
            className="absolute top-2 right-2 text-white/60 hover:text-white"
          >
            ×
          </button>
          <p className="text-sm text-gray-300">
            Click and drag to explore the {selectedPlanet} system. Use mouse wheel to zoom.
          </p>
        </motion.div>
      )}
      
      {/* Controls Info */}
      <div className="absolute bottom-4 left-4 bg-black/60 backdrop-blur-sm p-4 rounded-lg text-white text-sm">
        <div className="space-y-1">
          <div>🖱️ Left Click + Drag: Rotate view</div>
          <div>🎯 Right Click + Drag: Pan view</div>
          <div>🔍 Scroll: Zoom in/out</div>
          <div>🪐 Click planets: View details</div>
        </div>
      </div>
    </div>
  );
}

export default Enhanced3DSpaceScene;
