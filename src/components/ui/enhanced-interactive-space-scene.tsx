import React, { useRef, useState, useEffect } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls, Stars, Text } from '@react-three/drei';
import * as THREE from 'three';
import { motion } from 'framer-motion';
import { Sun, Moon } from 'lucide-react';
import { usePerformanceOptimization, ScenePerformanceMonitor, FPSCounter, QualitySettings } from './performance-monitor';
import { useTheme } from '@/contexts/ThemeContext';

// Enhanced Interactive Planet Component
function EnhancedInteractivePlanet({ 
  position, 
  size = 1, 
  color = '#4f46e5', 
  rings = false, 
  onClick,
  name = "Planet",
  selected = false,
  performanceSettings
}: {
  position: [number, number, number];
  size?: number;
  color?: string;
  rings?: boolean;
  onClick?: () => void;
  name?: string;
  selected?: boolean;
  performanceSettings: any;
}) {
  const planetRef = useRef<THREE.Mesh>(null);
  const ringsRef = useRef<THREE.Mesh>(null);
  const [hovered, setHovered] = useState(false);
  useFrame((state) => {
    if (planetRef.current) {
      planetRef.current.rotation.y += 0.01 * (performanceSettings.animationQuality === 'high' ? 1 : 0.5);
      
      if (performanceSettings.animationQuality !== 'low') {
        planetRef.current.scale.setScalar(
          size * (hovered || selected ? 1.2 : 1) * (1 + Math.sin(state.clock.elapsedTime) * 0.05)
        );
      }
    }
    if (ringsRef.current && performanceSettings.animationQuality !== 'low') {
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
        castShadow={performanceSettings.enableBloom}
        receiveShadow={performanceSettings.enableBloom}
      >
        <sphereGeometry args={[size, performanceSettings.animationQuality === 'high' ? 32 : 16, performanceSettings.animationQuality === 'high' ? 32 : 16]} />
        <meshPhongMaterial 
          color={color} 
          emissive={selected ? color : '#000000'}
          emissiveIntensity={selected ? 0.3 : 0}
        />
      </mesh>

      {/* Rings */}
      {rings && (
        <mesh ref={ringsRef} rotation={[Math.PI / 2, 0, 0]}>
          <ringGeometry args={[size * 1.2, size * 1.8, performanceSettings.animationQuality === 'high' ? 32 : 16]} />
          <meshBasicMaterial 
            color={color} 
            transparent 
            opacity={0.6} 
            side={THREE.DoubleSide} 
          />
        </mesh>
      )}

      {/* Name label (visible when hovered or selected) */}
      {(hovered || selected) && performanceSettings.animationQuality !== 'low' && (
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

// Enhanced Floating Space Station
function EnhancedSpaceStation({ position, performanceSettings }: { 
  position: [number, number, number];
  performanceSettings: any;
}) {
  const stationRef = useRef<THREE.Group>(null);

  useFrame((state) => {
    if (stationRef.current && performanceSettings.animationQuality !== 'low') {
      stationRef.current.rotation.y += 0.02;
      stationRef.current.position.y = position[1] + Math.sin(state.clock.elapsedTime * 0.5) * 0.2;
    }
  });

  return (
    <group ref={stationRef} position={position}>
      {/* Main hub */}
      <mesh>
        <cylinderGeometry args={[0.3, 0.3, 0.8, performanceSettings.animationQuality === 'high' ? 8 : 6]} />
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
          <meshPhongMaterial 
            color="#1e40af" 
            emissive={performanceSettings.enableBloom ? "#1e40af" : "#000000"}
            emissiveIntensity={performanceSettings.enableBloom ? 0.2 : 0} 
          />
        </mesh>
      ))}

      {/* Communication dish */}
      <mesh position={[0, 0.6, 0]} rotation={[Math.PI / 4, 0, 0]}>
        <cylinderGeometry args={[0.2, 0.15, 0.1, performanceSettings.animationQuality === 'high' ? 16 : 8]} />
        <meshPhongMaterial color="#fbbf24" />
      </mesh>
    </group>
  );
}

// Enhanced Comet with Trail
function EnhancedComet({ performanceSettings }: { performanceSettings: any }) {
  const cometRef = useRef<THREE.Group>(null);
  const trailPoints = useRef<THREE.Vector3[]>([]);

  useFrame((state) => {
    if (cometRef.current) {
      const time = state.clock.elapsedTime;
      const speed = performanceSettings.animationQuality === 'high' ? 0.3 : 0.2;
      const x = Math.cos(time * speed) * 8;
      const y = Math.sin(time * speed * 0.7) * 4;
      const z = Math.sin(time * speed) * 6;
      
      cometRef.current.position.set(x, y, z);
      
      // Update trail only on higher performance settings
      if (performanceSettings.animationQuality === 'high') {
        trailPoints.current.push(new THREE.Vector3(x, y, z));
        if (trailPoints.current.length > 20) {
          trailPoints.current.shift();
        }
      }
    }
  });

  return (
    <group ref={cometRef}>
      {/* Comet core */}
      <mesh>
        <sphereGeometry args={[0.1, performanceSettings.animationQuality === 'high' ? 8 : 6, performanceSettings.animationQuality === 'high' ? 8 : 6]} />
        <meshPhongMaterial 
          color="#f59e0b" 
          emissive="#f59e0b" 
          emissiveIntensity={0.5}
        />
      </mesh>
      
      {/* Glow effect - only on higher settings */}
      {performanceSettings.animationQuality !== 'low' && (
        <mesh>
          <sphereGeometry args={[0.3, 8, 8]} />
          <meshBasicMaterial 
            color="#fbbf24" 
            transparent 
            opacity={0.3}
          />
        </mesh>
      )}
    </group>
  );
}

// Enhanced Main Scene Component
function EnhancedSpaceScene({ 
  onPlanetSelect, 
  performanceSettings,
  theme 
}: { 
  onPlanetSelect: (planet: string) => void;
  performanceSettings: any;
  theme?: string;
}) {
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
      <ambientLight intensity={performanceSettings.ambientIntensity || 0.4} />
      <pointLight 
        position={[10, 10, 10]} 
        intensity={theme === 'light' ? 1.5 : 1} 
        castShadow={performanceSettings.enableBloom}
        shadow-mapSize-width={performanceSettings.shadowMapSize}
        shadow-mapSize-height={performanceSettings.shadowMapSize}
      />
      {performanceSettings.animationQuality === 'high' && (
        <pointLight 
          position={[-10, -5, 5]} 
          intensity={theme === 'light' ? 0.8 : 0.5} 
          color={theme === 'light' ? "#ffd700" : "#4f46e5"} 
        />
      )}

      {/* Background stars */}
      <Stars 
        radius={100} 
        depth={50} 
        count={performanceSettings.starsCount || 5000} 
        factor={4} 
        saturation={0} 
        fade 
      />

      {/* Central Sun */}
      <mesh position={[-8, 0, 0]}>
        <sphereGeometry args={[0.8, performanceSettings.animationQuality === 'high' ? 32 : 16, performanceSettings.animationQuality === 'high' ? 32 : 16]} />
        <meshPhongMaterial 
          color="#fbbf24" 
          emissive="#fbbf24" 
          emissiveIntensity={theme === 'light' ? 0.8 : 0.5}
        />
      </mesh>

      {/* Planets */}
      {planets.map((planet) => (
        <EnhancedInteractivePlanet
          key={planet.name}
          position={planet.position}
          size={planet.size}
          color={planet.color}
          rings={planet.rings}
          name={planet.name}
          selected={selectedPlanet === planet.name}
          onClick={() => handlePlanetClick(planet.name)}
          performanceSettings={performanceSettings}
        />
      ))}

      {/* Space Station */}
      <EnhancedSpaceStation position={[3, 2, -3]} performanceSettings={performanceSettings} />

      {/* Comet */}
      <EnhancedComet performanceSettings={performanceSettings} />

      {/* Orbital paths - only on higher settings */}
      {performanceSettings.animationQuality !== 'low' && planets.map((planet) => (
        <mesh key={`orbit-${planet.name}`} rotation={[Math.PI / 2, 0, 0]}>
          <ringGeometry args={[
            Math.sqrt(planet.position[0] ** 2 + planet.position[2] ** 2) - 0.02,
            Math.sqrt(planet.position[0] ** 2 + planet.position[2] ** 2) + 0.02,
            performanceSettings.animationQuality === 'high' ? 64 : 32
          ]} />
          <meshBasicMaterial 
            color={theme === 'light' ? "#666666" : "#ffffff"} 
            transparent 
            opacity={theme === 'light' ? 0.3 : 0.1} 
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

// Main Enhanced Component
interface EnhancedInteractiveSpaceSceneProps {
  className?: string;
  height?: string;
  showFPS?: boolean;
}

export const EnhancedInteractiveSpaceScene: React.FC<EnhancedInteractiveSpaceSceneProps> = ({
  className = "",
  height = "500px",
  showFPS = false
}) => {
  const [selectedPlanet, setSelectedPlanet] = useState<string | null>(null);
  const { performanceLevel, setPerformanceLevel, getSettings } = usePerformanceOptimization();
  const { theme, toggleTheme } = useTheme();
  const settings = getSettings();

  // Theme-based colors and styling
  const themeStyles = {
    light: {
      background: 'linear-gradient(to bottom, #87CEEB, #E0F6FF, #F0F8FF)',
      containerBg: 'bg-white/90 backdrop-blur-sm',
      controlsBg: 'bg-white/90 backdrop-blur-sm',
      textPrimary: 'text-gray-900',
      textSecondary: 'text-gray-600',
      border: 'border-gray-200/50',
      panelBg: 'bg-white/95 backdrop-blur-sm border-gray-200/40',
      buttonActive: 'bg-blue-500 text-white',
      buttonInactive: 'bg-gray-200 text-gray-700 hover:bg-gray-300',
      starsCount: 1000,
      ambientIntensity: 0.8
    },
    dark: {
      background: 'linear-gradient(to bottom, #0f0f23, #1a1a2e, #16213e)',
      containerBg: 'bg-black/80 backdrop-blur-sm',
      controlsBg: 'bg-black/80 backdrop-blur-sm',
      textPrimary: 'text-white',
      textSecondary: 'text-gray-300',
      border: 'border-white/10',
      panelBg: 'bg-black/90 backdrop-blur-sm border-white/20',
      buttonActive: 'bg-blue-500 text-white',
      buttonInactive: 'bg-white/20 text-gray-300 hover:bg-white/30',
      starsCount: 5000,
      ambientIntensity: 0.4
    }
  };

  const currentTheme = themeStyles[theme as keyof typeof themeStyles] || themeStyles.dark;

  const planetInfo = {
    Mercury: "The smallest planet, closest to the Sun with extreme temperatures ranging from 427°C to -173°C.",
    Venus: "The hottest planet with a thick, toxic atmosphere of carbon dioxide and surface temperatures of 462°C.",
    Earth: "Our home planet, the only known planet with life, featuring 71% ocean coverage and a protective atmosphere.",
    Mars: "The red planet, target for future human exploration, with evidence of ancient water flows and polar ice caps.",
    Jupiter: "The largest planet, a gas giant with over 80 moons including the four Galilean moons discovered in 1610.",
    Saturn: "Famous for its beautiful ring system made of ice and rock particles, with 83 confirmed moons including Titan."
  };
  return (
    <div className={`relative ${className}`}>
      <div style={{ height }} className={`w-full rounded-lg overflow-hidden ${currentTheme.border} border`}>
        <Canvas 
          camera={{ position: [0, 5, 15], fov: 60 }}
          shadows={settings.enableBloom}
          dpr={settings.pixelRatio}
          gl={{ antialias: settings.antialias }}
          style={{ background: currentTheme.background }}
        >
          <ScenePerformanceMonitor>
            <EnhancedSpaceScene 
              onPlanetSelect={setSelectedPlanet} 
              performanceSettings={{
                ...settings,
                starsCount: currentTheme.starsCount,
                ambientIntensity: currentTheme.ambientIntensity
              }}
              theme={theme}
            />
          </ScenePerformanceMonitor>
        </Canvas>
      </div>      
      {/* Control Panel Container - Better positioned and responsive */}
      <div className="absolute top-2 right-2 z-10 flex flex-col gap-2 items-end">
        {/* Theme Toggle Button */}
        <motion.button
          onClick={toggleTheme}
          className={`${currentTheme.controlsBg} rounded-lg p-3 ${currentTheme.textPrimary} transition-all duration-300 hover:scale-105`}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          title={`Switch to ${theme === 'dark' ? 'light' : 'dark'} mode`}
        >
          {theme === 'dark' ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
        </motion.button>

        {/* FPS Counter */}
        {showFPS && (
          <div className={`${currentTheme.controlsBg} rounded-lg px-3 py-2 ${currentTheme.textPrimary} text-sm font-mono`}>
            FPS: 60
          </div>
        )}

        {/* Quality Settings - Redesigned for better visibility */}
        <div className={`${currentTheme.controlsBg} rounded-lg p-3`}>
          <div className={`${currentTheme.textPrimary} text-xs mb-2 font-medium`}>Quality</div>
          <div className="flex gap-1">
            {['Low', 'Med', 'High'].map((level, index) => {
              const levelKey = ['low', 'medium', 'high'][index] as 'low' | 'medium' | 'high';
              return (
                <button
                  key={levelKey}
                  onClick={() => setPerformanceLevel(levelKey)}
                  className={`px-2 py-1 rounded text-xs transition-colors min-w-[36px] ${
                    performanceLevel === levelKey
                      ? currentTheme.buttonActive
                      : currentTheme.buttonInactive
                  }`}
                >
                  {level}
                </button>
              );
            })}
          </div>
        </div>

        {/* Enhanced Instructions - Collapsible */}
        <div className={`${currentTheme.controlsBg} rounded-lg p-3 text-xs ${currentTheme.textSecondary} max-w-44`}>
          <div className="space-y-1">
            <p className={`${currentTheme.textPrimary} font-medium mb-2 text-center`}>Controls</p>
            <p>🖱️ Click planets</p>
            <p>🔄 Drag to rotate</p>
            <p>🔍 Scroll to zoom</p>
          </div>
        </div>
      </div>      {/* Planet Information Panel */}
      {selectedPlanet && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 20 }}
          className={`absolute bottom-2 left-2 right-2 md:right-auto md:w-80 ${currentTheme.panelBg} rounded-lg p-4 border`}
        >
          <div className="flex justify-between items-start mb-3">
            <h3 className={`text-lg font-semibold ${currentTheme.textPrimary}`}>{selectedPlanet}</h3>
            <button
              onClick={() => setSelectedPlanet(null)}
              className={`${currentTheme.textSecondary} hover:${currentTheme.textPrimary} transition-colors p-1`}
            >
              ✕
            </button>
          </div>
          <p className={`text-sm ${currentTheme.textSecondary} leading-relaxed`}>
            {planetInfo[selectedPlanet as keyof typeof planetInfo]}
          </p>
          <div className="mt-3 flex gap-2">
            <span className={`px-2 py-1 ${theme === 'dark' ? 'bg-blue-500/20 text-blue-400' : 'bg-blue-100 text-blue-600'} rounded text-xs`}>
              Interactive
            </span>
            <span className={`px-2 py-1 ${theme === 'dark' ? 'bg-purple-500/20 text-purple-400' : 'bg-purple-100 text-purple-600'} rounded text-xs`}>
              3D Model
            </span>
          </div>
        </motion.div>
      )}

      {/* Mobile-friendly touch instructions */}
      <div className={`absolute bottom-2 right-2 md:hidden ${currentTheme.controlsBg} rounded-lg p-2 text-xs ${currentTheme.textSecondary}`}>
        <p>👆 Tap • 🤏 Pinch zoom</p>
      </div>
    </div>
  );
};

export default EnhancedInteractiveSpaceScene;
