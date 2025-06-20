import React, { useRef, useState, useEffect, Component, ErrorInfo } from 'react';
import { useFrame } from '@react-three/fiber';
import { OrbitControls, Stars, Text } from '@react-three/drei';
import * as THREE from 'three';
import { motion } from 'framer-motion';
import { Sun, Moon, Zap } from 'lucide-react';
import { usePerformanceOptimization, ScenePerformanceMonitor, FPSCounter, QualitySettings } from './performance-monitor';
import { useTheme } from '@/contexts/ThemeContext';
import { Button } from './button';
import { FixedCanvas } from './fixed-canvas';
import SceneErrorBoundary from './SceneErrorBoundary';
import PlanetInfoModal from './planet-info-modal';

// Planet interface to match the modal's expectations
interface Planet {
  name: string;
  position: [number, number, number];
  size: number;
  color: string;
  orbitSpeed?: number;
  tilt?: number;
  rings?: boolean;
  textureMap?: string;
}

// Interactive Planet Component
function EnhancedInteractivePlanet({ 
  position, 
  size = 1, 
  color = '#4f46e5', 
  rings = false, 
  onClick,
  name = "Planet",
  selected = false,
  performanceSettings,
  tilt = 0,
  orbitSpeed = 0.01,
  textureMap = ''
}: {
  position: [number, number, number];
  size?: number;
  color?: string;
  rings?: boolean;
  onClick?: () => void;
  name?: string;
  selected?: boolean;
  performanceSettings: any;
  tilt?: number;
  orbitSpeed?: number;
  textureMap?: string;
}) {
  const planetRef = useRef<THREE.Mesh>(null);
  const ringsRef = useRef<THREE.Mesh>(null);
  const groupRef = useRef<THREE.Group>(null);
  const [hovered, setHovered] = useState(false);
  const [showInfo, setShowInfo] = useState(false);
  
  const tiltInRadians = tilt * Math.PI / 180;
  
  // Simplified and optimized animation to prevent performance issues
  useFrame(() => {
    if (planetRef.current) {
      planetRef.current.rotation.y += 0.002;
    }
    
    if (ringsRef.current) {
      ringsRef.current.rotation.z += 0.0005;
    }
    
    if (groupRef.current) {
      groupRef.current.rotation.y = tiltInRadians;
    }
  });
  return (
    <group ref={groupRef} position={position}>
      {/* Planet mesh */}
      <mesh
        ref={planetRef}
        onClick={() => {
          setShowInfo(!showInfo);
          if (onClick) onClick();
        }}
        onPointerOver={() => setHovered(true)}
        onPointerOut={() => setHovered(false)}
        castShadow={performanceSettings.enableBloom}
        receiveShadow={performanceSettings.enableBloom}
      >        <sphereGeometry args={[
          size, 
          24, // Fixed resolution for better performance
          24  // Fixed resolution for better performance
        ]} /><meshStandardMaterial 
          color={color}
          emissive={selected ? color : '#000000'}
          emissiveIntensity={selected ? 0.3 : 0}
          roughness={0.7}
          metalness={0.2}
        />
      </mesh>      {/* Simplified atmosphere glow effect - only for Earth and gas giants */}
      {(name === "Earth" || name === "Jupiter" || name === "Saturn") && (
        <mesh>
          <sphereGeometry args={[size * 1.05, 16, 16]} />
          <meshBasicMaterial 
            color={name === "Earth" ? "#6b93d6" : 
                  name === "Saturn" ? "#fab74b" :
                  "#d8ca9d"}
            transparent 
            opacity={0.3}
          />
        </mesh>
      )}      {/* Simplified rings for better performance */}
      {rings && (
        <group>
          <mesh ref={ringsRef} rotation={[Math.PI / 2, 0, 0]}>
            <ringGeometry args={[
              size * 1.4, 
              size * 2.2, 
              32 // Fixed resolution for better performance
            ]} />
            <meshBasicMaterial 
              color={color} 
              transparent 
              opacity={0.7} 
              side={THREE.DoubleSide}
            />
          </mesh>
        </group>
      )}

      {/* Enhanced name label - always visible on hover or selection */}
      {(hovered || selected) && (
        <group position={[0, size + 0.8, 0]}>          <Text
            position={[0, 0, 0]}
            fontSize={0.4}
            color="white"
            anchorX="center"
            anchorY="middle"
            outlineWidth={0.02}
            outlineColor="#000000"
          >
            {name}
          </Text>
          
          {/* Indicator line connecting label to planet */}
          <mesh position={[0, -0.4, 0]}>
            <cylinderGeometry args={[0.01, 0.01, 0.4]} />
            <meshBasicMaterial color="#ffffff" />
          </mesh>
        </group>
      )}
      
      {/* Click-to-expand hint */}
      {hovered && !selected && (
        <Text
          position={[0, size * -1 - 0.3, 0]}
          fontSize={0.2}
          color="#88ccff"
          anchorX="center"
          anchorY="middle"
        >
          Click for details
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
    // Simplified solar system for better performance with memoized planets
  // Removed texture maps and adjusted sizes for better rendering
  const planets = React.useMemo(() => [
    { name: "Mercury", position: [-3, 0, 0] as [number, number, number], size: 0.38, color: "#8c7853", orbitSpeed: 0.02, tilt: 0.034, textureMap: "" },
    { name: "Venus", position: [-5, 0.3, -1] as [number, number, number], size: 0.95, color: "#ffc649", orbitSpeed: 0.015, tilt: 3.39, textureMap: "" },
    { name: "Earth", position: [-7, 0, 0] as [number, number, number], size: 1.0, color: "#6b93d6", orbitSpeed: 0.01, tilt: 23.44, textureMap: "" },
    { name: "Mars", position: [-10, -0.5, 1] as [number, number, number], size: 0.53, color: "#c1440e", orbitSpeed: 0.008, tilt: 25.19, textureMap: "" },
    { name: "Jupiter", position: [-15, 0, -2] as [number, number, number], size: 4.0, color: "#d8ca9d", orbitSpeed: 0.004, tilt: 3.13, rings: false, textureMap: "" },
    { name: "Saturn", position: [-22, 1, 1] as [number, number, number], size: 3.5, color: "#fab74b", orbitSpeed: 0.003, tilt: 26.73, rings: true, textureMap: "" },
    { name: "Uranus", position: [-27, 0, 3] as [number, number, number], size: 2.5, color: "#c1feff", orbitSpeed: 0.0015, tilt: 97.77, rings: true, textureMap: "" },
    { name: "Neptune", position: [-32, -1, -2] as [number, number, number], size: 2.5, color: "#5562de", orbitSpeed: 0.001, tilt: 28.32, rings: false, textureMap: "" },
  ], []);
  const handlePlanetClick = React.useCallback((planetName: string) => {
    console.log(`Planet clicked: ${planetName}`);
    setSelectedPlanet(prev => prev === planetName ? null : planetName);
    onPlanetSelect(planetName);
  }, [onPlanetSelect]);

  return (
    <>
      {/* Improved ambient light for better scene illumination */}
      <ambientLight intensity={performanceSettings.ambientIntensity || (theme === 'light' ? 0.6 : 0.4)} />
      
      {/* Enhanced point lights for more realistic scene lighting */}
      <pointLight 
        position={[10, 10, 10]} 
        intensity={theme === 'light' ? 1.5 : 1} 
        castShadow={performanceSettings.enableBloom}
        shadow-mapSize-width={performanceSettings.shadowMapSize || 1024}
        shadow-mapSize-height={performanceSettings.shadowMapSize || 1024}
        color={theme === 'light' ? "#ffffff" : "#f0f0ff"}
      />
      
      {performanceSettings.animationQuality === 'high' && (
        <pointLight 
          position={[-10, -5, 5]} 
          intensity={theme === 'light' ? 0.8 : 0.5} 
          color={theme === 'light' ? "#fffcf0" : "#4f46e5"} 
        />
      )}      {/* Enhanced background stars - reduced count for better performance */}
      <Stars 
        radius={100} 
        depth={50} 
        count={1500} 
        factor={4} 
        saturation={0} 
        fade 
        speed={0.5}
      />

      {/* Enhanced Sun with glow effect */}
      <group position={[-8, 0, 0]}>
        <mesh>
          <sphereGeometry args={[0.8, performanceSettings.animationQuality === 'high' ? 32 : 16, performanceSettings.animationQuality === 'high' ? 32 : 16]} />
          <meshPhongMaterial 
            color="#fbbf24" 
            emissive="#fbbf24" 
            emissiveIntensity={theme === 'light' ? 0.8 : 0.5}
          />
        </mesh>
        {performanceSettings.animationQuality !== 'low' && (
          <mesh>
            <sphereGeometry args={[1.2, 16, 16]} />            <meshBasicMaterial
              color="#fef3c7"
              transparent
              opacity={0.2}
              blending={THREE.AdditiveBlending}
            />
          </mesh>
        )}
      </group>
      
      {/* Planets with improved parameters */}
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
          tilt={planet.tilt}
          orbitSpeed={planet.orbitSpeed}
          textureMap={planet.textureMap}
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
      ))}      <OrbitControls 
        enableDamping={false}
        enableZoom={true} 
        enablePan={false} 
        enableRotate={true}
        zoomSpeed={0.4}
        rotateSpeed={0.3}
        minDistance={10}
        maxDistance={50}
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

  // Enhanced theme-based colors and styling with improved contrast
  const themeStyles = {
    light: {
      background: 'linear-gradient(to bottom, #87CEEB, #E0F6FF, #F0F8FF)',
      containerBg: 'bg-white/90 backdrop-blur-sm',
      controlsBg: 'bg-white/95 backdrop-blur-sm shadow-md',
      textPrimary: 'text-gray-900',
      textSecondary: 'text-gray-600',
      border: 'border-gray-200/50',
      panelBg: 'bg-white/95 backdrop-blur-sm border-gray-200/40 shadow-lg',
      buttonActive: 'bg-blue-500 text-white font-medium',
      buttonInactive: 'bg-gray-200 text-gray-700 hover:bg-gray-300 font-medium',
      starsCount: 1000,
      ambientIntensity: 0.8
    },
    dark: {
      background: 'linear-gradient(to bottom, #0f0f23, #1a1a2e, #16213e)',
      containerBg: 'bg-black/80 backdrop-blur-sm',
      controlsBg: 'bg-black/90 backdrop-blur-sm shadow-md border border-white/5',
      textPrimary: 'text-white',
      textSecondary: 'text-gray-300',
      border: 'border-white/10',
      panelBg: 'bg-black/95 backdrop-blur-sm border-white/20 shadow-lg',
      buttonActive: 'bg-blue-600 text-white font-medium',
      buttonInactive: 'bg-white/20 text-gray-300 hover:bg-white/30 font-medium',
      starsCount: 5000,
      ambientIntensity: 0.4
    }
  };

  const currentTheme = themeStyles[theme as keyof typeof themeStyles] || themeStyles.dark;
  // Enhanced planet descriptions
  const planetInfo = {
    Mercury: "The smallest planet, closest to the Sun with extreme temperatures ranging from 427°C to -173°C.",
    Venus: "The hottest planet with a thick, toxic atmosphere of carbon dioxide and surface temperatures of 462°C.",
    Earth: "Our home planet, the only known planet with life, featuring 71% ocean coverage and a protective atmosphere.",
    Mars: "The red planet, target for future human exploration, with evidence of ancient water flows and polar ice caps.",
    Jupiter: "The largest planet, a gas giant with over 80 moons including the four Galilean moons discovered in 1610.",
    Saturn: "Famous for its beautiful ring system made of ice and rock particles, with 83 confirmed moons including Titan.",
    Uranus: "A unique ice giant that rotates on its side with an axial tilt of 98 degrees, surrounded by faint rings.",
    Neptune: "The windiest planet with speeds up to 2,100 km/h, featuring the Great Dark Spot and 14 known moons."
  };
  
  // Define planets for the PlanetInfoModal component
  const planets = [
    { name: "Mercury", position: [-3, 0, 0] as [number, number, number], size: 0.38, color: "#8c7853", orbitSpeed: 0.02, tilt: 0.034, textureMap: "/textures/mercury.jpg" },
    { name: "Venus", position: [-5, 0.3, -1] as [number, number, number], size: 0.95, color: "#ffc649", orbitSpeed: 0.015, tilt: 3.39, textureMap: "/textures/venus.jpg" },
    { name: "Earth", position: [-7, 0, 0] as [number, number, number], size: 1.0, color: "#6b93d6", orbitSpeed: 0.01, tilt: 23.44, textureMap: "/textures/earth.jpg" },
    { name: "Mars", position: [-10, -0.5, 1] as [number, number, number], size: 0.53, color: "#c1440e", orbitSpeed: 0.008, tilt: 25.19, textureMap: "/textures/mars.jpg" },
    { name: "Jupiter", position: [-15, 0, -2] as [number, number, number], size: 11.2, color: "#d8ca9d", orbitSpeed: 0.004, tilt: 3.13, rings: false, textureMap: "/textures/jupiter.jpg" },
    { name: "Saturn", position: [-22, 1, 1] as [number, number, number], size: 9.4, color: "#fab74b", orbitSpeed: 0.003, tilt: 26.73, rings: true, textureMap: "/textures/saturn.jpg" },
    { name: "Uranus", position: [-30, 0, 3] as [number, number, number], size: 4.0, color: "#c1feff", orbitSpeed: 0.0015, tilt: 97.77, rings: true, textureMap: "/textures/uranus.jpg" },
    { name: "Neptune", position: [-38, -1, -2] as [number, number, number], size: 3.9, color: "#5562de", orbitSpeed: 0.001, tilt: 28.32, rings: false, textureMap: "/textures/neptune.jpg" },
  ];  return (
    <div className={`relative ${className}`}>
      <div style={{ height }} className={`w-full rounded-lg overflow-hidden ${currentTheme.border} border transition-all duration-300 relative`}>
        <SceneErrorBoundary
          fallback={
            <div className="flex h-full w-full flex-col items-center justify-center bg-gray-900 text-white p-6">
              <h3 className="mb-4 text-xl">3D visualization error</h3>
              <p className="mb-4 text-center">We encountered an issue with the space scene. This might be due to WebGL context loss or graphics hardware limitations.</p>              <Button 
                onClick={() => window.location.reload()}
                className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700"
              >
                <Zap size={16} /> Reload Application
              </Button>
            </div>
          }
        >          <FixedCanvas 
            camera={{ position: [0, 5, 15], fov: 60 }}
            shadows={settings.enableBloom}
            dpr={Math.min(1.5, window.devicePixelRatio)}
            gl={{ 
              antialias: settings.antialias,
              powerPreference: "high-performance",
              stencil: false,
              depth: true,
              alpha: false
            }}
            frameloop="always"
            style={{ 
              background: currentTheme.background,
              transition: 'background 0.5s ease-in-out'
            }}
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
          </FixedCanvas>
        </SceneErrorBoundary>
      </div>
      
      {/* Control Panel Container - Better positioned and responsive */}
      <div className="absolute top-2 right-2 z-10 flex flex-col gap-2 items-end">
        {/* Theme Toggle Button - Enhanced appearance */}
        <motion.button
          onClick={toggleTheme}
          className={`${currentTheme.controlsBg} rounded-lg p-3 ${currentTheme.textPrimary} transition-all duration-300 hover:scale-105`}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          title={`Switch to ${theme === 'dark' ? 'light' : 'dark'} mode`}
          aria-label={`Switch to ${theme === 'dark' ? 'light' : 'dark'} mode`}
        >
          {theme === 'dark' ? (
            <Sun className="w-5 h-5" />
          ) : (
            <Moon className="w-5 h-5" />
          )}
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
      </div>      {/* Planet Info Modal Component */}
      <PlanetInfoModal        planet={planets.find(p => p.name === selectedPlanet) || null}
        isOpen={!!selectedPlanet}
        onClose={() => setSelectedPlanet(null)}
        theme={theme as 'light' | 'dark'}
      />
    </div>
  );
}

export default EnhancedInteractiveSpaceScene;
