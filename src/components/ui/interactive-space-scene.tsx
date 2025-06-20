import React, { useRef, useState, useEffect } from 'react';
import { useFrame, useThree } from '@react-three/fiber';
import { OrbitControls, Stars, Text } from '@react-three/drei';
import * as THREE from 'three';
import { motion } from 'framer-motion';
import { usePerformanceOptimization, ScenePerformanceMonitor, FPSCounter, QualitySettings } from './performance-monitor';
import { FixedCanvas } from './fixed-canvas';
import SceneErrorBoundary from './SceneErrorBoundary';

// Interactive Planet Component
function InteractivePlanet({ 
  position, 
  size = 1, 
  color = '#4f46e5', 
  rings = false, 
  onClick,
  name = "Planet",
  selected = false 
}: {
  position: [number, number, number];
  size?: number;
  color?: string;
  rings?: boolean;
  onClick?: () => void;
  name?: string;
  selected?: boolean;
}) {
  const planetRef = useRef<THREE.Mesh>(null);
  const ringsRef = useRef<THREE.Mesh>(null);
  const [hovered, setHovered] = useState(false);

  useFrame((state) => {
    if (planetRef.current) {
      planetRef.current.rotation.y += 0.01;
      planetRef.current.scale.setScalar(
        size * (hovered || selected ? 1.2 : 1) * (1 + Math.sin(state.clock.elapsedTime) * 0.05)
      );
    }
    if (ringsRef.current) {
      ringsRef.current.rotation.z += 0.005;
    }
  });

  return (
    <group position={position}>
      {/* Planet */}
      <mesh
        ref={planetRef}
        onClick={onClick}
        onPointerOver={() => setHovered(true)}
        onPointerOut={() => setHovered(false)}
        castShadow
        receiveShadow
      >
        <sphereGeometry args={[size, 32, 32]} />
        <meshPhongMaterial 
          color={color} 
          emissive={selected ? color : '#000000'}
          emissiveIntensity={selected ? 0.3 : 0}
        />
      </mesh>

      {/* Rings */}
      {rings && (
        <mesh ref={ringsRef} rotation={[Math.PI / 2, 0, 0]}>
          <ringGeometry args={[size * 1.2, size * 1.8, 32]} />
          <meshBasicMaterial 
            color={color} 
            transparent 
            opacity={0.6} 
            side={THREE.DoubleSide} 
          />
        </mesh>
      )}

      {/* Name label (visible when hovered or selected) */}
      {(hovered || selected) && (
        <Text
          position={[0, size + 0.5, 0]}
          fontSize={0.3}
          color="white"
          anchorX="center"
          anchorY="middle"
        >
          {name}
        </Text>
      )}
    </group>
  );
}

// Floating Space Station
function SpaceStation({ position }: { position: [number, number, number] }) {
  const stationRef = useRef<THREE.Group>(null);

  useFrame((state) => {
    if (stationRef.current) {
      stationRef.current.rotation.y += 0.02;
      stationRef.current.position.y = position[1] + Math.sin(state.clock.elapsedTime * 0.5) * 0.2;
    }
  });

  return (
    <group ref={stationRef} position={position}>
      {/* Main hub */}
      <mesh>
        <cylinderGeometry args={[0.3, 0.3, 0.8, 8]} />
        <meshPhongMaterial color="#e5e7eb" />
      </mesh>

      {/* Solar panels */}
      {[0, 90, 180, 270].map((rotation, index) => (
        <mesh 
          key={index}
          position={[
            Math.sin((rotation * Math.PI) / 180) * 0.8,
            0,
            Math.cos((rotation * Math.PI) / 180) * 0.8
          ]}
          rotation={[0, (rotation * Math.PI) / 180, 0]}
        >
          <boxGeometry args={[0.1, 0.6, 0.4]} />
          <meshPhongMaterial color="#1e40af" emissive="#1e40af" emissiveIntensity={0.2} />
        </mesh>
      ))}

      {/* Communication dish */}
      <mesh position={[0, 0.6, 0]} rotation={[Math.PI / 4, 0, 0]}>
        <cylinderGeometry args={[0.2, 0.15, 0.1, 16]} />
        <meshPhongMaterial color="#fbbf24" />
      </mesh>
    </group>
  );
}

// Comet with Trail
function Comet() {
  const cometRef = useRef<THREE.Group>(null);
  const trailPoints = useRef<THREE.Vector3[]>([]);

  useFrame((state) => {
    if (cometRef.current) {
      const time = state.clock.elapsedTime;
      const x = Math.cos(time * 0.3) * 8;
      const y = Math.sin(time * 0.2) * 4;
      const z = Math.sin(time * 0.3) * 6;
      
      cometRef.current.position.set(x, y, z);
      
      // Update trail
      trailPoints.current.push(new THREE.Vector3(x, y, z));
      if (trailPoints.current.length > 20) {
        trailPoints.current.shift();
      }
    }
  });

  return (
    <group ref={cometRef}>
      {/* Comet core */}
      <mesh>
        <sphereGeometry args={[0.1, 8, 8]} />
        <meshPhongMaterial 
          color="#f59e0b" 
          emissive="#f59e0b" 
          emissiveIntensity={0.5}
        />
      </mesh>      {/* Glow effect */}
      <mesh>
        <sphereGeometry args={[0.3, 8, 8]} />
        <meshBasicMaterial 
          color="#fbbf24" 
          transparent 
          opacity={0.3}
        />
      </mesh>
    </group>
  );
}

// Main Scene Component
function SpaceScene({ onPlanetSelect }: { onPlanetSelect: (planet: string) => void }) {
  const [selectedPlanet, setSelectedPlanet] = useState<string | null>(null);

  const planets = [
    { name: "Mercury", position: [-4, 0, 0] as [number, number, number], size: 0.3, color: "#8c7853" },
    { name: "Venus", position: [-2, 1, -1] as [number, number, number], size: 0.4, color: "#ffc649" },
    { name: "Earth", position: [0, 0, 0] as [number, number, number], size: 0.5, color: "#6b93d6" },
    { name: "Mars", position: [2, -0.5, 1] as [number, number, number], size: 0.4, color: "#c1440e" },
    { name: "Jupiter", position: [5, 0, -2] as [number, number, number], size: 1.2, color: "#d8ca9d", rings: true },
    { name: "Saturn", position: [8, 1, 1] as [number, number, number], size: 1.0, color: "#fab74b", rings: true },
  ];

  const handlePlanetClick = (planetName: string) => {
    setSelectedPlanet(planetName);
    onPlanetSelect(planetName);
  };

  return (
    <>
      <ambientLight intensity={0.4} />
      <pointLight position={[10, 10, 10]} intensity={1} castShadow />
      <pointLight position={[-10, -5, 5]} intensity={0.5} color="#4f46e5" />

      {/* Background stars */}
      <Stars radius={100} depth={50} count={5000} factor={4} saturation={0} fade />

      {/* Central Sun */}
      <mesh position={[-8, 0, 0]}>
        <sphereGeometry args={[0.8, 32, 32]} />        <meshPhongMaterial 
          color="#fbbf24" 
          emissive="#fbbf24" 
          emissiveIntensity={0.5}
        />
      </mesh>

      {/* Planets */}
      {planets.map((planet) => (
        <InteractivePlanet
          key={planet.name}
          position={planet.position}
          size={planet.size}
          color={planet.color}
          rings={planet.rings}
          name={planet.name}
          selected={selectedPlanet === planet.name}
          onClick={() => handlePlanetClick(planet.name)}
        />
      ))}

      {/* Space Station */}
      <SpaceStation position={[3, 2, -3]} />

      {/* Comet */}
      <Comet />

      {/* Orbital paths */}
      {planets.map((planet, index) => (
        <mesh key={`orbit-${planet.name}`} rotation={[Math.PI / 2, 0, 0]}>
          <ringGeometry args={[
            Math.sqrt(planet.position[0] ** 2 + planet.position[2] ** 2) - 0.02,
            Math.sqrt(planet.position[0] ** 2 + planet.position[2] ** 2) + 0.02,
            64
          ]} />
          <meshBasicMaterial 
            color="#ffffff" 
            transparent 
            opacity={0.1} 
            side={THREE.DoubleSide} 
          />
        </mesh>
      ))}

      <OrbitControls 
        enableZoom={true} 
        enablePan={true} 
        enableRotate={true}
        zoomSpeed={0.6}
        panSpeed={0.8}
        rotateSpeed={0.4}
      />
    </>
  );
}

// Main Component
interface InteractiveSpaceSceneProps {
  className?: string;
  height?: string;
}

export const InteractiveSpaceScene: React.FC<InteractiveSpaceSceneProps> = ({
  className = "",
  height = "500px"
}) => {
  const [selectedPlanet, setSelectedPlanet] = useState<string | null>(null);

  const planetInfo = {
    Mercury: "The smallest planet, closest to the Sun with extreme temperatures.",
    Venus: "The hottest planet with a thick, toxic atmosphere.",
    Earth: "Our home planet, the only known planet with life.",
    Mars: "The red planet, target for future human exploration.",
    Jupiter: "The largest planet, a gas giant with over 80 moons.",
    Saturn: "Famous for its beautiful ring system made of ice and rock."
  };

  return (
    <div className={`relative ${className}`}>      <div style={{ height }} className="w-full rounded-lg overflow-hidden border border-white/10">
        <SceneErrorBoundary>
          <FixedCanvas camera={{ position: [0, 5, 15], fov: 60 }}>
            <SpaceScene onPlanetSelect={setSelectedPlanet} />
          </FixedCanvas>
        </SceneErrorBoundary>
      </div>

      {/* Planet Information Panel */}
      {selectedPlanet && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 20 }}
          className="absolute bottom-4 left-4 right-4 bg-black/80 backdrop-blur-sm rounded-lg p-4 border border-white/20"
        >
          <h3 className="text-lg font-semibold text-white mb-2">{selectedPlanet}</h3>
          <p className="text-sm text-gray-300">
            {planetInfo[selectedPlanet as keyof typeof planetInfo]}
          </p>
          <button
            onClick={() => setSelectedPlanet(null)}
            className="mt-2 text-xs text-blue-400 hover:text-blue-300"
          >
            Close
          </button>
        </motion.div>
      )}

      {/* Instructions */}
      <div className="absolute top-4 right-4 bg-black/60 backdrop-blur-sm rounded-lg p-3 text-xs text-gray-300">
        <p>• Click planets to learn more</p>
        <p>• Drag to rotate view</p>
        <p>• Scroll to zoom</p>
      </div>
    </div>
  );
};

export default InteractiveSpaceScene;
