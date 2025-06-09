import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Canvas, useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { useTheme } from '../contexts/ThemeContext';
import { mockSpaceData } from '../data/mock-space-data';
import { 
  Star, 
  Rocket, 
  Play, 
  Volume2, 
  VolumeX, 
  RotateCcw,
  Sparkles,
  ChevronLeft,
  ChevronRight,
  Trophy,
  Target,
  Gift,
  Gamepad2,
  BookOpen,
  Zap
} from 'lucide-react';

interface KidsZoneProps {
  className?: string;
}

export default function KidsZone({ className }: KidsZoneProps) {
  const { theme } = useTheme();
  const [currentFactIndex, setCurrentFactIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [soundEnabled, setSoundEnabled] = useState(true);
  const [completedFacts, setCompletedFacts] = useState<number[]>([]);

  const facts = mockSpaceData.kidsZoneFacts;
  const currentFact = facts[currentFactIndex];

  const nextFact = () => {
    if (currentFactIndex < facts.length - 1) {
      setCurrentFactIndex(currentFactIndex + 1);
      if (!completedFacts.includes(currentFactIndex)) {
        setCompletedFacts([...completedFacts, currentFactIndex]);
      }
    }
  };

  const prevFact = () => {
    if (currentFactIndex > 0) {
      setCurrentFactIndex(currentFactIndex - 1);
    }
  };

  const resetProgress = () => {
    setCurrentFactIndex(0);
    setCompletedFacts([]);
  };

  const playFact = () => {
    if (soundEnabled) {
      // In a real app, you'd use text-to-speech API here
      const utterance = new SpeechSynthesisUtterance(currentFact.fact);
      utterance.rate = 0.8;
      utterance.pitch = 1.2;
      speechSynthesis.speak(utterance);
      setIsPlaying(true);
      
      utterance.onend = () => setIsPlaying(false);
    }
  };

  const containerVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.6,
        staggerChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 }
  };

  const factCardVariants = {
    enter: { x: 300, opacity: 0 },
    center: { x: 0, opacity: 1 },
    exit: { x: -300, opacity: 0 }
  };

  // 3D Solar System component for kids
  function KidsSolarSystem() {
    const groupRef = useRef<THREE.Group>(null);
    
    useFrame((state) => {
      if (groupRef.current) {
        groupRef.current.rotation.y += 0.005;
      }
    });

    const planets = [
      { name: 'Sun', position: [0, 0, 0], size: 1, color: '#FDB813' },
      { name: 'Mercury', position: [2, 0, 0], size: 0.2, color: '#8C7853' },
      { name: 'Venus', position: [3, 0, 0], size: 0.3, color: '#FFC649' },
      { name: 'Earth', position: [4, 0, 0], size: 0.4, color: '#6B93D6' },
      { name: 'Mars', position: [5, 0, 0], size: 0.3, color: '#CD5C5C' },
    ];

    return (
      <group ref={groupRef}>
        {planets.map((planet, index) => (
          <group key={planet.name}>
            <mesh position={planet.position as [number, number, number]}>
              <sphereGeometry args={[planet.size, 16, 16]} />
              <meshBasicMaterial color={planet.color} />
            </mesh>
            {/* Orbit rings */}
            {index > 0 && (
              <mesh rotation={[Math.PI / 2, 0, 0]}>
                <ringGeometry args={[planet.position[0] - 0.05, planet.position[0] + 0.05, 32]} />
                <meshBasicMaterial color="#ffffff" transparent opacity={0.2} side={THREE.DoubleSide} />
              </mesh>
            )}
          </group>
        ))}
      </group>
    );
  }

  // Floating space elements for kids
  function FloatingSpaceElements() {
    const elements = useRef<THREE.Group[]>([]);
    
    useFrame((state) => {
      elements.current.forEach((element, index) => {
        if (element) {
          element.position.y += Math.sin(state.clock.elapsedTime + index) * 0.01;
          element.rotation.y += 0.01;
        }
      });
    });

    const spaceObjects = [
      { type: 'rocket', position: [-3, 2, -2], color: '#FF6B6B' },
      { type: 'star', position: [3, -1, -1], color: '#FFD93D' },
      { type: 'satellite', position: [-2, -2, -3], color: '#6BCF7F' },
    ];

    return (
      <>
        {spaceObjects.map((obj, index) => (
          <group 
            key={index} 
            ref={(el) => { if (el) elements.current[index] = el; }}
            position={obj.position as [number, number, number]}
          >
            {obj.type === 'rocket' && (
              <>
                <mesh>
                  <cylinderGeometry args={[0.1, 0.05, 0.8, 8]} />
                  <meshBasicMaterial color={obj.color} />
                </mesh>
                <mesh position={[0, -0.5, 0]}>
                  <coneGeometry args={[0.15, 0.3, 8]} />
                  <meshBasicMaterial color="#FF4757" />
                </mesh>
              </>
            )}
            {obj.type === 'star' && (
              <mesh>
                <octahedronGeometry args={[0.3]} />
                <meshBasicMaterial color={obj.color} />
              </mesh>
            )}
            {obj.type === 'satellite' && (
              <>
                <mesh>
                  <boxGeometry args={[0.4, 0.2, 0.2]} />
                  <meshBasicMaterial color={obj.color} />
                </mesh>
                <mesh position={[-0.3, 0, 0]}>
                  <boxGeometry args={[0.1, 0.6, 0.1]} />
                  <meshBasicMaterial color="#555555" />
                </mesh>
              </>
            )}
          </group>
        ))}
      </>
    );
  }
  return (
    <motion.div 
      className={`space-y-6 p-4 ${className}`}
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >      {/* Enhanced Header */}
      <motion.div variants={itemVariants} className="text-center">
        <div className="inline-flex items-center gap-3 mb-6">
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 8, repeat: Infinity, ease: "linear" }}
            className="relative"
          >
            <Sparkles className={`h-10 w-10 ${
              theme === 'dark' ? 'text-yellow-400' : 'text-yellow-500'
            }`} />
            <div className={`absolute -top-1 -right-1 w-3 h-3 rounded-full animate-ping ${
              theme === 'dark' ? 'bg-pink-400' : 'bg-pink-500'
            }`} />
          </motion.div>
          <h1 className={`text-5xl font-bold bg-gradient-to-r bg-clip-text text-transparent ${
            theme === 'dark' 
              ? 'from-pink-400 via-purple-400 to-blue-400' 
              : 'from-pink-600 via-purple-600 to-blue-600'
          }`}>
            Space Kids Zone
          </h1>
          <motion.div
            animate={{ rotate: -360, scale: [1, 1.2, 1] }}
            transition={{ 
              rotate: { duration: 6, repeat: Infinity, ease: "linear" },
              scale: { duration: 2, repeat: Infinity, ease: "easeInOut" }
            }}
          >
            <Star className={`h-10 w-10 ${
              theme === 'dark' ? 'text-blue-400' : 'text-blue-500'
            }`} />
          </motion.div>
        </div>
        <p className={`text-xl mb-4 ${
          theme === 'dark' ? 'text-gray-300' : 'text-gray-600'
        }`}>
          🚀 Explore the amazing universe with fun facts and interactive games! 🌟
        </p>
          {/* Achievement badges */}
        <div className="flex justify-center gap-2 mt-4">
          {completedFacts.length >= 3 && (
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              className={`flex items-center gap-1 px-3 py-1 rounded-full border ${
                theme === 'dark' 
                  ? 'bg-gradient-to-r from-yellow-500/20 to-orange-500/20 border-yellow-500/30' 
                  : 'bg-gradient-to-r from-yellow-400/30 to-orange-400/30 border-yellow-500/50'
              }`}
            >
              <Trophy className={`w-4 h-4 ${
                theme === 'dark' ? 'text-yellow-400' : 'text-yellow-600'
              }`} />
              <span className={`text-sm ${
                theme === 'dark' ? 'text-yellow-300' : 'text-yellow-700'
              }`}>Explorer</span>
            </motion.div>
          )}
          {completedFacts.length >= 7 && (
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              className={`flex items-center gap-1 px-3 py-1 rounded-full border ${
                theme === 'dark' 
                  ? 'bg-gradient-to-r from-blue-500/20 to-purple-500/20 border-blue-500/30' 
                  : 'bg-gradient-to-r from-blue-400/30 to-purple-400/30 border-blue-500/50'
              }`}
            >
              <Rocket className={`w-4 h-4 ${
                theme === 'dark' ? 'text-blue-400' : 'text-blue-600'
              }`} />
              <span className={`text-sm ${
                theme === 'dark' ? 'text-blue-300' : 'text-blue-700'
              }`}>Astronaut</span>
            </motion.div>
          )}
          {completedFacts.length === facts.length && (
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              className={`flex items-center gap-1 px-3 py-1 rounded-full border ${
                theme === 'dark' 
                  ? 'bg-gradient-to-r from-purple-500/20 to-pink-500/20 border-purple-500/30' 
                  : 'bg-gradient-to-r from-purple-400/30 to-pink-400/30 border-purple-500/50'
              }`}
            >
              <Zap className={`w-4 h-4 ${
                theme === 'dark' ? 'text-purple-400' : 'text-purple-600'
              }`} />
              <span className={`text-sm ${
                theme === 'dark' ? 'text-purple-300' : 'text-purple-700'
              }`}>Space Master</span>
            </motion.div>
          )}
        </div>
      </motion.div>      {/* Interactive 3D Solar System */}
      <motion.div variants={itemVariants}>
        <Card className={`border ${
          theme === 'dark' 
            ? 'bg-gradient-to-br from-indigo-600/20 to-purple-600/20 border-indigo-500/30' 
            : 'bg-gradient-to-br from-indigo-400/20 to-purple-400/20 border-indigo-400/40'
        }`}>
          <CardHeader>
            <CardTitle className={`flex items-center gap-2 ${
              theme === 'dark' ? 'text-white' : 'text-gray-900'
            }`}>
              <Gamepad2 className={`w-5 h-5 ${
                theme === 'dark' ? 'text-indigo-400' : 'text-indigo-600'
              }`} />
              Interactive Solar System
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className={`h-64 rounded-lg overflow-hidden border ${
              theme === 'dark' 
                ? 'bg-black/50 border-indigo-500/30' 
                : 'bg-blue-50/50 border-indigo-300/50'
            }`}>
              <Canvas camera={{ position: [0, 0, 8] }}>
                <ambientLight intensity={0.5} />
                <pointLight position={[0, 0, 0]} intensity={1} />
                <KidsSolarSystem />
                <FloatingSpaceElements />
              </Canvas>
            </div>
            <div className={`mt-3 text-center text-sm ${
              theme === 'dark' ? 'text-indigo-200' : 'text-indigo-700'
            }`}>
              Watch the planets orbit around the Sun! 🌍✨
            </div>
          </CardContent>
        </Card>
      </motion.div>      {/* Progress Bar with enhanced design */}
      <motion.div variants={itemVariants}>
        <Card className={`border ${
          theme === 'dark' 
            ? 'bg-gradient-to-r from-green-600/20 to-blue-600/20 border-green-500/30' 
            : 'bg-gradient-to-r from-green-400/20 to-blue-400/20 border-green-400/40'
        }`}>
          <CardContent className="p-4">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <Target className={`w-5 h-5 ${
                  theme === 'dark' ? 'text-green-400' : 'text-green-600'
                }`} />
                <span className={`font-medium ${
                  theme === 'dark' ? 'text-white' : 'text-gray-900'
                }`}>Learning Progress</span>              </div>
              <Button
                variant="outline"
                size="sm"
                onClick={resetProgress}
                className={`h-8 ${
                  theme === 'dark' 
                    ? 'border-green-500/50 text-green-300 hover:bg-green-500/10' 
                    : 'border-green-500/60 text-green-700 hover:bg-green-500/20'
                }`}
              >
                <RotateCcw className="h-3 w-3 mr-1" />
                Reset
              </Button>
            </div>
            <div className={`w-full rounded-full h-4 mb-3 overflow-hidden ${
              theme === 'dark' ? 'bg-gray-700' : 'bg-gray-300'
            }`}>
              <motion.div
                className={`h-4 rounded-full relative ${
                  theme === 'dark' 
                    ? 'bg-gradient-to-r from-green-400 via-blue-400 to-purple-400' 
                    : 'bg-gradient-to-r from-green-500 via-blue-500 to-purple-500'
                }`}
                initial={{ width: 0 }}
                animate={{ width: `${(completedFacts.length / facts.length) * 100}%` }}
                transition={{ duration: 0.8, ease: "easeOut" }}
              >
                <div className="absolute inset-0 bg-white/20 animate-pulse" />
              </motion.div>
            </div>
            <div className="flex justify-between text-sm">
              <span className={`flex items-center gap-1 ${
                theme === 'dark' ? 'text-green-300' : 'text-green-700'
              }`}>
                <BookOpen className="w-4 h-4" />
                {completedFacts.length} completed
              </span>
              <span className={`${
                theme === 'dark' ? 'text-blue-300' : 'text-blue-700'
              }`}>{facts.length} total facts</span>
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* Main Fact Card */}
      <motion.div variants={itemVariants}>
        <div className="relative overflow-hidden">
          <AnimatePresence mode="wait">
            <motion.div
              key={currentFactIndex}
              variants={factCardVariants}
              initial="enter"
              animate="center"
              exit="exit"
              transition={{ type: "spring", stiffness: 300, damping: 30 }}
            >              <Card 
                className={`relative overflow-hidden bg-gradient-to-br ${currentFact.color} p-8 border-0`}
              >
                {/* Floating elements */}
                <motion.div
                  className="absolute top-4 right-4 text-6xl opacity-20"
                  animate={{ 
                    rotate: [0, 10, -10, 0],
                    scale: [1, 1.1, 1] 
                  }}
                  transition={{ 
                    duration: 4, 
                    repeat: Infinity,
                    ease: "easeInOut" 
                  }}
                >
                  {currentFact.icon}
                </motion.div>                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle className={`text-3xl ${
                      theme === 'dark' ? 'text-white' : 'text-white'
                    }`}>
                      {currentFact.title}
                    </CardTitle>
                    <Badge variant="secondary" className={`${
                      theme === 'dark' 
                        ? 'bg-white/20 text-white' 
                        : 'bg-white/30 text-white'
                    }`}>
                      {currentFactIndex + 1} of {facts.length}
                    </Badge>
                  </div>
                </CardHeader>

                <CardContent>
                  <p className={`text-xl leading-relaxed mb-6 ${
                    theme === 'dark' ? 'text-white/90' : 'text-white/95'
                  }`}>
                    {currentFact.fact}
                  </p>

                  {/* Controls */}
                  <div className="flex items-center justify-between">
                    <div className="flex gap-2">
                      <Button
                        onClick={playFact}
                        disabled={isPlaying || !soundEnabled}
                        className={`text-white ${
                          theme === 'dark' 
                            ? 'bg-white/20 hover:bg-white/30 border-white/30' 
                            : 'bg-white/25 hover:bg-white/35 border-white/40'
                        }`}
                        variant="outline"
                      >
                        <Play className={`h-4 w-4 mr-2 ${isPlaying ? 'animate-pulse' : ''}`} />
                        {isPlaying ? 'Playing...' : 'Read Aloud'}
                      </Button>
                      
                      <Button
                        onClick={() => setSoundEnabled(!soundEnabled)}
                        variant="outline"
                        size="icon"
                        className={`text-white ${
                          theme === 'dark' 
                            ? 'bg-white/20 hover:bg-white/30 border-white/30' 
                            : 'bg-white/25 hover:bg-white/35 border-white/40'
                        }`}
                      >
                        {soundEnabled ? <Volume2 className="h-4 w-4" /> : <VolumeX className="h-4 w-4" />}
                      </Button>
                    </div>

                    <div className="flex gap-2">
                      <Button
                        onClick={prevFact}
                        disabled={currentFactIndex === 0}
                        variant="outline"
                        size="icon"
                        className={`text-white ${
                          theme === 'dark' 
                            ? 'bg-white/20 hover:bg-white/30 border-white/30' 
                            : 'bg-white/25 hover:bg-white/35 border-white/40'
                        }`}
                      >
                        <ChevronLeft className="h-4 w-4" />
                      </Button>
                      
                      <Button
                        onClick={nextFact}
                        disabled={currentFactIndex === facts.length - 1}
                        variant="outline"
                        size="icon"
                        className={`text-white ${
                          theme === 'dark' 
                            ? 'bg-white/20 hover:bg-white/30 border-white/30' 
                            : 'bg-white/25 hover:bg-white/35 border-white/40'
                        }`}
                      >
                        <ChevronRight className="h-4 w-4" />
                      </Button>
                    </div>
                </div>
                </CardContent>
              </Card>
            </motion.div>
          </AnimatePresence>
        </div>
      </motion.div>      {/* Quick Facts Grid */}
      <motion.div variants={itemVariants}>
        <h2 className={`text-2xl font-bold mb-4 text-center ${
          theme === 'dark' ? 'text-white' : 'text-gray-900'
        }`}>Quick Space Facts!</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {facts.map((fact, index) => (
            <motion.div
              key={fact.id}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setCurrentFactIndex(index)}
              className="cursor-pointer"
            >
              <Card 
                className={`relative p-4 transition-all border ${
                  theme === 'dark' 
                    ? 'border-slate-600/50 bg-slate-800/50 hover:bg-slate-700/50' 
                    : 'border-gray-300/50 bg-white/50 hover:bg-gray-50/80'
                } ${
                  completedFacts.includes(index) 
                    ? theme === 'dark' 
                      ? 'ring-2 ring-green-400' 
                      : 'ring-2 ring-green-500'
                    : ''
                } ${
                  index === currentFactIndex 
                    ? theme === 'dark' 
                      ? 'ring-2 ring-blue-400' 
                      : 'ring-2 ring-blue-500'
                    : ''
                }`}
              >
                <div className="flex items-center gap-3">
                  <div className="text-2xl">{fact.icon}</div>
                  <div className="flex-1">
                    <h3 className={`font-semibold text-sm ${
                      theme === 'dark' ? 'text-white' : 'text-gray-900'
                    }`}>{fact.title}</h3>
                    <p className={`text-xs truncate ${
                      theme === 'dark' ? 'text-gray-400' : 'text-gray-600'
                    }`}>
                      {fact.fact}
                    </p>
                  </div>
                  {completedFacts.includes(index) && (
                    <div className={`${
                      theme === 'dark' ? 'text-green-400' : 'text-green-500'
                    }`}>
                      <Star className="h-4 w-4 fill-current" />
                    </div>
                  )}
                </div>
              </Card>
            </motion.div>
          ))}
        </div>
      </motion.div>      {/* Coming Soon Games */}
      <motion.div variants={itemVariants}>
        <Card className={`p-6 text-center border ${
          theme === 'dark' 
            ? 'bg-gradient-to-r from-red-900/30 to-orange-900/30 border-orange-500/30' 
            : 'bg-gradient-to-r from-red-400/20 to-orange-400/20 border-orange-400/40'
        }`}>
          <motion.div
            animate={{ y: [0, -10, 0] }}
            transition={{ duration: 2, repeat: Infinity }}
          >
            <Rocket className={`h-12 w-12 mx-auto mb-4 ${
              theme === 'dark' ? 'text-orange-400' : 'text-orange-600'
            }`} />
          </motion.div>
          <h3 className={`text-xl font-bold mb-2 ${
            theme === 'dark' ? 'text-white' : 'text-gray-900'
          }`}>Space Games Coming Soon!</h3>
          <p className={`${
            theme === 'dark' ? 'text-gray-300' : 'text-gray-600'
          }`}>
            🎮 Planet Builder • 🚀 Rocket Designer • 👨‍🚀 Astronaut Training
          </p>
        </Card>
      </motion.div>

      {/* 3D Space Scene */}
      <motion.div variants={itemVariants}>
        <div className="w-full h-64 md:h-96 rounded-lg overflow-hidden">
          <Canvas camera={{ position: [0, 0, 10], fov: 50 }}>
            <ambientLight intensity={0.5} />
            <pointLight position={[10, 10, 10]} />
            <KidsSolarSystem />
            <FloatingSpaceElements />
          </Canvas>
        </div>
      </motion.div>
    </motion.div>
  );
}
