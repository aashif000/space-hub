import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Canvas, useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from './ui/card';
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
  Zap,
  Check,
  X,
  Brain,
  Award,
  Lightbulb,
  Pencil
} from 'lucide-react';

interface KidsZoneProps {
  className?: string;
}

// Space Quiz Questions
const quizQuestions = [
  {
    question: "Which planet is known as the Red Planet?",
    options: ["Earth", "Venus", "Mars", "Jupiter"],
    correctAnswer: "Mars",
    explanation: "Mars is called the Red Planet because of the reddish iron oxide (rust) that covers its surface."
  },
  {
    question: "What is the largest planet in our Solar System?",
    options: ["Earth", "Saturn", "Neptune", "Jupiter"],
    correctAnswer: "Jupiter",
    explanation: "Jupiter is the largest planet in our Solar System - so big that all other planets could fit inside it!"
  },
  {
    question: "How many planets are in our Solar System?",
    options: ["7", "8", "9", "10"],
    correctAnswer: "8",
    explanation: "There are 8 planets: Mercury, Venus, Earth, Mars, Jupiter, Saturn, Uranus, and Neptune."
  },
  {
    question: "What is the closest star to Earth?",
    options: ["Proxima Centauri", "The Sun", "Alpha Centauri", "Polaris"],
    correctAnswer: "The Sun",
    explanation: "The Sun is the closest star to Earth. It's about 93 million miles (150 million km) away."
  },
  {
    question: "What creates a comet's tail?",
    options: ["Ice", "Solar wind", "Stardust", "Gravity"],
    correctAnswer: "Solar wind",
    explanation: "Solar wind pushes dust and gas away from the comet, creating its beautiful tail that always points away from the Sun."
  },
];

// Space Memory Game items
const memoryItems = [
  { id: 1, name: "Sun", icon: "☀️", matched: false },
  { id: 2, name: "Earth", icon: "🌎", matched: false },
  { id: 3, name: "Moon", icon: "🌙", matched: false },
  { id: 4, name: "Star", icon: "⭐", matched: false },
  { id: 5, name: "Rocket", icon: "🚀", matched: false },
  { id: 6, name: "Astronaut", icon: "👨‍🚀", matched: false },
  { id: 7, name: "Saturn", icon: "🪐", matched: false },
  { id: 8, name: "UFO", icon: "🛸", matched: false }
];

export default function KidsZone({ className }: KidsZoneProps) {
  const { theme } = useTheme();
  const [currentFactIndex, setCurrentFactIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [soundEnabled, setSoundEnabled] = useState(true);
  const [completedFacts, setCompletedFacts] = useState<number[]>([]);
  
  // New interactive features
  const [quizActive, setQuizActive] = useState(false);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null);
  const [quizScore, setQuizScore] = useState(0);
  const [quizCompleted, setQuizCompleted] = useState(false);
  const [showExplanation, setShowExplanation] = useState(false);
  
  // Memory Game States
  const [memoryGameActive, setMemoryGameActive] = useState(false);
  const [cards, setCards] = useState<any[]>([]);
  const [flippedIndices, setFlippedIndices] = useState<number[]>([]);
  const [matchedPairs, setMatchedPairs] = useState(0);
  const [memoryMoves, setMemoryMoves] = useState(0);
  
  // Drawing Canvas State
  const [isDrawing, setIsDrawing] = useState(false);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [drawingColor, setDrawingColor] = useState("#FFFFFF");

  const facts = mockSpaceData.kidsZoneFacts;
  const currentFact = facts[currentFactIndex];
  const currentQuestion = quizQuestions[currentQuestionIndex];

  // Initialize memory game
  useEffect(() => {
    if (memoryGameActive) {
      // Duplicate items to make pairs and shuffle
      const duplicatedItems = [...memoryItems, ...memoryItems]
        .map((item, index) => ({ ...item, id: index + 1 }))
        .sort(() => Math.random() - 0.5);
      
      setCards(duplicatedItems);
      setFlippedIndices([]);
      setMatchedPairs(0);
      setMemoryMoves(0);
    }
  }, [memoryGameActive]);
  
  // Drawing canvas setup
  useEffect(() => {
    if (isDrawing && canvasRef.current) {
      const canvas = canvasRef.current;
      const ctx = canvas.getContext('2d');
      
      if (ctx) {
        ctx.fillStyle = theme === 'dark' ? '#0f1729' : '#f8fafc';
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        
        // Draw some stars in the background
        drawStars(ctx, canvas.width, canvas.height);
      }
    }
  }, [isDrawing, theme]);
  
  // Draw stars function
  const drawStars = (ctx: CanvasRenderingContext2D, width: number, height: number) => {
    for (let i = 0; i < 100; i++) {
      const x = Math.random() * width;
      const y = Math.random() * height;
      const radius = Math.random() * 1.5;
      
      ctx.fillStyle = '#FFFFFF';
      ctx.beginPath();
      ctx.arc(x, y, radius, 0, Math.PI * 2);
      ctx.fill();
    }
  };
  
  // Drawing handlers
  const handleMouseDown = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (!canvasRef.current) return;
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    
    const rect = canvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    
    ctx.beginPath();
    ctx.moveTo(x, y);
    ctx.strokeStyle = drawingColor;
    ctx.lineWidth = 3;
    ctx.lineCap = 'round';
    
    canvas.onmousemove = handleMouseMove;
    canvas.onmouseup = handleMouseUp;
  };
  
  const handleMouseMove = (e: MouseEvent) => {
    if (!canvasRef.current) return;
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    
    const rect = canvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    
    ctx.lineTo(x, y);
    ctx.stroke();
  };
  
  const handleMouseUp = () => {
    if (!canvasRef.current) return;
    canvasRef.current.onmousemove = null;
    canvasRef.current.onmouseup = null;
  };
  
  const clearCanvas = () => {
    if (!canvasRef.current) return;
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    
    ctx.fillStyle = theme === 'dark' ? '#0f1729' : '#f8fafc';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    
    // Redraw stars
    drawStars(ctx, canvas.width, canvas.height);
  };
  
  // Memory game handlers
  const handleCardClick = (index: number) => {
    // Prevent clicking if two cards are already flipped or if this card is already flipped/matched
    if (
      flippedIndices.length === 2 || 
      flippedIndices.includes(index) || 
      cards[index].matched
    ) return;
    
    const newFlipped = [...flippedIndices, index];
    setFlippedIndices(newFlipped);
    
    // If two cards are flipped, check for a match
    if (newFlipped.length === 2) {
      setMemoryMoves(memoryMoves + 1);
      
      const [firstIndex, secondIndex] = newFlipped;
      if (cards[firstIndex].name === cards[secondIndex].name) {
        // Match found
        const newCards = [...cards];
        newCards[firstIndex].matched = true;
        newCards[secondIndex].matched = true;
        setCards(newCards);
        setMatchedPairs(matchedPairs + 1);
        setFlippedIndices([]);
      } else {
        // No match, flip back after a short delay
        setTimeout(() => {
          setFlippedIndices([]);
        }, 1000);
      }
    }
  };
  
  // Quiz handlers
  const startQuiz = () => {
    setQuizActive(true);
    setQuizCompleted(false);
    setCurrentQuestionIndex(0);
    setQuizScore(0);
    setSelectedAnswer(null);
    setShowExplanation(false);
  };
  
  const handleAnswer = (answer: string) => {
    setSelectedAnswer(answer);
    
    if (answer === currentQuestion.correctAnswer) {
      setQuizScore(quizScore + 1);
    }
    
    setShowExplanation(true);
  };
  
  const nextQuestion = () => {
    if (currentQuestionIndex < quizQuestions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
      setSelectedAnswer(null);
      setShowExplanation(false);
    } else {
      setQuizCompleted(true);
    }
  };

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
      </motion.div>      {/* Interactive Space Quiz */}
      <motion.div variants={itemVariants}>
        <Card className={`p-6 border ${
          theme === 'dark' 
            ? 'bg-gradient-to-r from-indigo-900/30 to-purple-900/30 border-indigo-500/30' 
            : 'bg-gradient-to-r from-indigo-400/20 to-purple-400/20 border-indigo-400/40'
        }`}>
          <CardHeader className="pb-2">
            <div className="flex items-center justify-between">
              <CardTitle className={`text-xl ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
                <div className="flex items-center gap-2">
                  <Brain className={`h-5 w-5 ${theme === 'dark' ? 'text-indigo-400' : 'text-indigo-600'}`} />
                  Space Quiz Challenge
                </div>
              </CardTitle>
              <Badge variant="outline" className={`${
                theme === 'dark' ? 'border-indigo-500 text-indigo-300' : 'border-indigo-500 text-indigo-700'
              }`}>
                Interactive
              </Badge>
            </div>
            <CardDescription className={theme === 'dark' ? 'text-gray-300' : 'text-gray-600'}>
              Test your knowledge about space and earn cosmic badges!
            </CardDescription>
          </CardHeader>
          
          <CardContent>
            {!quizActive ? (
              <div className="text-center py-4">
                <motion.div
                  animate={{ rotate: [0, 10, -10, 0] }}
                  transition={{ duration: 3, repeat: Infinity }}
                >
                  <Lightbulb className={`h-12 w-12 mx-auto mb-4 ${
                    theme === 'dark' ? 'text-yellow-400' : 'text-yellow-500'
                  }`} />
                </motion.div>
                <Button 
                  onClick={() => startQuiz()}
                  className={`mt-4 ${
                    theme === 'dark' 
                      ? 'bg-indigo-600 hover:bg-indigo-700' 
                      : 'bg-indigo-500 hover:bg-indigo-600'
                  }`}
                >
                  Start Quiz
                </Button>
              </div>
            ) : quizCompleted ? (
              <div className="text-center py-4">
                <motion.div
                  animate={{ scale: [1, 1.1, 1] }}
                  transition={{ duration: 2, repeat: Infinity }}
                >
                  <Award className={`h-12 w-12 mx-auto mb-4 ${
                    quizScore > 3 
                      ? theme === 'dark' ? 'text-yellow-400' : 'text-yellow-500'
                      : theme === 'dark' ? 'text-blue-400' : 'text-blue-500'
                  }`} />
                </motion.div>
                <h3 className={`text-xl font-bold mb-2 ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
                  Quiz Completed!
                </h3>
                <p className={`mb-2 ${theme === 'dark' ? 'text-gray-300' : 'text-gray-600'}`}>
                  You scored {quizScore} out of {quizQuestions.length} questions correctly!
                </p>
                <div className="flex justify-center gap-3 mt-4">
                  <Button 
                    variant="outline" 
                    onClick={() => setQuizActive(false)}
                    className={theme === 'dark' ? 'border-indigo-500 text-indigo-400' : 'border-indigo-500 text-indigo-600'}
                  >
                    Close
                  </Button>
                  <Button 
                    onClick={() => startQuiz()}
                    className={theme === 'dark' ? 'bg-indigo-600 hover:bg-indigo-700' : 'bg-indigo-500 hover:bg-indigo-600'}
                  >
                    Try Again
                  </Button>
                </div>
              </div>
            ) : (
              <div className="space-y-4">
                <div className={`w-full rounded-full h-2 mb-3 overflow-hidden ${
                  theme === 'dark' ? 'bg-gray-700' : 'bg-gray-300'
                }`}>
                  <motion.div
                    className={`h-2 rounded-full ${
                      theme === 'dark' 
                        ? 'bg-gradient-to-r from-indigo-400 to-purple-400' 
                        : 'bg-gradient-to-r from-indigo-500 to-purple-500'
                    }`}
                    initial={{ width: 0 }}
                    animate={{ width: `${((currentQuestionIndex) / quizQuestions.length) * 100}%` }}
                    transition={{ duration: 0.5 }}
                  />
                </div>
                
                <h3 className={`text-lg font-medium ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
                  {currentQuestion.question}
                </h3>
                
                <div className="space-y-2 mt-4">
                  {currentQuestion.options.map((option, index) => (
                    <Button
                      key={index}
                      variant="outline"
                      className={`w-full justify-start text-left ${
                        selectedAnswer 
                          ? option === currentQuestion.correctAnswer
                            ? 'bg-green-500/20 border-green-500'
                            : option === selectedAnswer
                              ? 'bg-red-500/20 border-red-500'
                              : theme === 'dark' ? 'border-gray-600' : 'border-gray-300'
                          : theme === 'dark' ? 'border-indigo-500/50' : 'border-indigo-400/50'
                      } ${
                        !selectedAnswer && (theme === 'dark' 
                          ? 'hover:bg-indigo-500/20'
                          : 'hover:bg-indigo-400/20'
                        )
                      }`}
                      onClick={() => !selectedAnswer && handleAnswer(option)}
                      disabled={!!selectedAnswer}
                    >
                      {selectedAnswer && (
                        option === currentQuestion.correctAnswer ? (
                          <Check className="h-4 w-4 mr-2 text-green-500" />
                        ) : option === selectedAnswer ? (
                          <X className="h-4 w-4 mr-2 text-red-500" />
                        ) : null
                      )}
                      {option}
                    </Button>
                  ))}
                </div>
                
                {showExplanation && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    className={`p-3 rounded-lg mt-4 ${
                      theme === 'dark' 
                        ? 'bg-gray-800 border border-gray-700'
                        : 'bg-gray-100 border border-gray-200'
                    }`}
                  >
                    <p className={`text-sm ${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}`}>
                      <span className="font-medium">Explanation:</span> {currentQuestion.explanation}
                    </p>
                    
                    <Button 
                      className={`mt-3 w-full ${
                        theme === 'dark' 
                          ? 'bg-indigo-600 hover:bg-indigo-700' 
                          : 'bg-indigo-500 hover:bg-indigo-600'
                      }`} 
                      onClick={nextQuestion}
                    >
                      {currentQuestionIndex < quizQuestions.length - 1 ? "Next Question" : "See Results"}
                    </Button>
                  </motion.div>
                )}
              </div>
            )}
          </CardContent>
        </Card>
      </motion.div>
                    
      {/* Interactive Space Memory Game */}
      <motion.div variants={itemVariants}>
        <Card className={`p-6 border ${
          theme === 'dark' 
            ? 'bg-gradient-to-r from-teal-900/30 to-cyan-900/30 border-teal-500/30' 
            : 'bg-gradient-to-r from-teal-400/20 to-cyan-400/20 border-teal-400/40'
        }`}>
          <CardHeader className="pb-2">
            <div className="flex items-center justify-between">
              <CardTitle className={`text-xl ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
                <div className="flex items-center gap-2">
                  <Gift className={`h-5 w-5 ${theme === 'dark' ? 'text-teal-400' : 'text-teal-600'}`} />
                  Space Memory Challenge
                </div>
              </CardTitle>
              <Badge variant="outline" className={`${
                theme === 'dark' ? 'border-teal-500 text-teal-300' : 'border-teal-500 text-teal-700'
              }`}>
                Game
              </Badge>
            </div>
            <CardDescription className={theme === 'dark' ? 'text-gray-300' : 'text-gray-600'}>
              Match pairs of space objects to test your memory skills!
            </CardDescription>
          </CardHeader>
          
          <CardContent>
            {!memoryGameActive ? (
              <div className="text-center py-4">
                <motion.div
                  animate={{ rotate: [0, 10, -10, 0] }}
                  transition={{ duration: 3, repeat: Infinity }}
                >
                  <Gift className={`h-12 w-12 mx-auto mb-4 ${
                    theme === 'dark' ? 'text-teal-400' : 'text-teal-500'
                  }`} />
                </motion.div>
                <Button 
                  onClick={() => setMemoryGameActive(true)}
                  className={`mt-4 ${
                    theme === 'dark' 
                      ? 'bg-teal-600 hover:bg-teal-700' 
                      : 'bg-teal-500 hover:bg-teal-600'
                  }`}
                >
                  Start Memory Game
                </Button>
              </div>
            ) : (
              <div className="space-y-4">
                <div className="flex justify-between items-center mb-2">
                  <div className={`text-sm font-medium ${
                    theme === 'dark' ? 'text-teal-300' : 'text-teal-700'
                  }`}>
                    <span className="inline-flex items-center">
                      <Gift className="h-4 w-4 mr-1" />
                      Pairs: {matchedPairs} of {memoryItems.length}
                    </span>
                  </div>
                  <div className={`text-sm ${
                    theme === 'dark' ? 'text-gray-400' : 'text-gray-600'
                  }`}>
                    Moves: {memoryMoves}
                  </div>
                </div>
                
                {/* Memory game grid */}
                <div className="grid grid-cols-4 gap-2">
                  {cards.map((card, index) => (
                    <motion.div
                      key={card.id}
                      className={`relative h-16 cursor-pointer rounded-md overflow-hidden ${
                        flippedIndices.includes(index) || card.matched
                          ? theme === 'dark'
                            ? 'bg-teal-900/50 border border-teal-500/50'
                            : 'bg-teal-100 border border-teal-500/50'
                          : theme === 'dark'
                            ? 'bg-slate-800/70 hover:bg-slate-700/70 border border-slate-600/50'
                            : 'bg-gray-100 hover:bg-gray-200 border border-gray-300'
                      }`}
                      onClick={() => handleCardClick(index)}
                      whileHover={{ scale: flippedIndices.includes(index) || card.matched ? 1 : 1.05 }}
                      whileTap={{ scale: 0.95 }}
                    >
                      {(flippedIndices.includes(index) || card.matched) ? (
                        <div className="flex items-center justify-center h-full">
                          <div className="text-2xl">{card.icon}</div>
                        </div>
                      ) : (
                        <div className="absolute inset-0 flex items-center justify-center">
                          <div className={`text-xl ${
                            theme === 'dark' ? 'text-teal-400' : 'text-teal-600'
                          }`}>?</div>
                        </div>
                      )}
                      {card.matched && (
                        <div className="absolute top-0 right-0">
                          <Check className={`h-3 w-3 ${
                            theme === 'dark' ? 'text-green-400' : 'text-green-600'
                          }`} />
                        </div>
                      )}
                    </motion.div>
                  ))}
                </div>
                
                {/* Game completed message */}
                {matchedPairs === memoryItems.length && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    className={`p-3 rounded-lg mt-4 text-center ${
                      theme === 'dark' 
                        ? 'bg-teal-900/30 border border-teal-700/50'
                        : 'bg-teal-100 border border-teal-300'
                    }`}
                  >
                    <Award className={`h-8 w-8 mx-auto mb-2 ${
                      theme === 'dark' ? 'text-yellow-400' : 'text-yellow-500'
                    }`} />
                    <p className={`font-medium ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
                      Congratulations! You completed the game in {memoryMoves} moves!
                    </p>
                    <Button 
                      className={`mt-3 ${
                        theme === 'dark' 
                          ? 'bg-teal-600 hover:bg-teal-700' 
                          : 'bg-teal-500 hover:bg-teal-600'
                      }`}
                      onClick={() => {
                        setMemoryGameActive(false);
                        setMatchedPairs(0);
                        setMemoryMoves(0);
                        setFlippedIndices([]);
                      }}
                    >
                      Play Again
                    </Button>
                  </motion.div>
                )}
                
                {matchedPairs !== memoryItems.length && (
                  <Button 
                    variant="outline"
                    onClick={() => {
                      setMemoryGameActive(false);
                      setMatchedPairs(0);
                      setMemoryMoves(0);
                      setFlippedIndices([]);
                    }}
                    className={theme === 'dark' ? 'border-teal-500 text-teal-400' : 'border-teal-500 text-teal-600'}
                  >
                    Exit Game
                  </Button>
                )}
              </div>
            )}
          </CardContent>
        </Card>
      </motion.div>
                    
      {/* Interactive Space Games */}
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
          }`}>More Space Games!</h3>
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

      {/* Interactive Space Drawing */}
      <motion.div variants={itemVariants}>
        <Card className={`p-4 border ${
          theme === 'dark' 
            ? 'bg-gradient-to-r from-blue-900/30 to-green-900/30 border-blue-500/30' 
            : 'bg-gradient-to-r from-blue-400/20 to-green-400/20 border-blue-400/40'
        }`}>
          <CardHeader className="pb-2">
            <div className="flex items-center justify-between">
              <CardTitle className={`text-xl ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
                <div className="flex items-center gap-2">
                  <Pencil className={`h-5 w-5 ${theme === 'dark' ? 'text-blue-400' : 'text-blue-600'}`} />
                  Space Drawing Canvas
                </div>
              </CardTitle>
              <Badge variant="outline" className={`${
                theme === 'dark' ? 'border-blue-500 text-blue-300' : 'border-blue-500 text-blue-700'
              }`}>
                Interactive
              </Badge>
            </div>
            <CardDescription className={theme === 'dark' ? 'text-gray-300' : 'text-gray-600'}>
              Create your own space drawings! Try drawing planets, stars, and rockets.
            </CardDescription>
          </CardHeader>
          
          <CardContent className="mt-2">
            {!isDrawing ? (
              <div className="text-center py-6">
                <motion.div
                  animate={{ scale: [1, 1.1, 1] }}
                  transition={{ duration: 2, repeat: Infinity }}
                >
                  <Pencil className={`h-12 w-12 mx-auto mb-4 ${
                    theme === 'dark' ? 'text-blue-400' : 'text-blue-600'
                  }`} />
                </motion.div>
                <Button 
                  onClick={() => setIsDrawing(true)}
                  className={`mt-2 ${
                    theme === 'dark' 
                      ? 'bg-blue-600 hover:bg-blue-700' 
                      : 'bg-blue-500 hover:bg-blue-600'
                  }`}
                >
                  Start Drawing
                </Button>
              </div>
            ) : (
              <div className="space-y-4">
                <div className="relative h-[250px] w-full border rounded-md overflow-hidden">
                  <canvas 
                    ref={canvasRef} 
                    width={640}
                    height={480}
                    className="absolute top-0 left-0 w-full h-full cursor-crosshair" 
                    onMouseDown={handleMouseDown}
                  />
                </div>
                
                <div className="flex flex-wrap gap-2 justify-center">
                  {["#FFFFFF", "#FF6B6B", "#4ECDC4", "#FFD166", "#6BCF7F", "#C38D9E", "#98DAFC"].map((color) => (
                    <button 
                      key={color}
                      onClick={() => setDrawingColor(color)}
                      className={`w-8 h-8 rounded-full transition-transform ${drawingColor === color ? 'scale-125 ring-2 ring-white' : ''}`}
                      style={{ backgroundColor: color }}
                      title={color}
                    />
                  ))}
                </div>
                
                <div className="flex justify-center gap-2">
                  <Button 
                    variant="outline" 
                    onClick={clearCanvas}
                    className={theme === 'dark' ? 'border-blue-500 text-blue-400' : 'border-blue-500 text-blue-600'}
                  >
                    Clear Canvas
                  </Button>
                  <Button 
                    onClick={() => setIsDrawing(false)}
                    className={theme === 'dark' ? 'bg-blue-600 hover:bg-blue-700' : 'bg-blue-500 hover:bg-blue-600'}
                  >
                    I'm Done
                  </Button>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      </motion.div>
    </motion.div>
  );
}
