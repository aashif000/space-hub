import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Canvas, useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { useTheme } from '../contexts/ThemeContext';
import { useSound, initSoundOnInteraction } from '../lib/soundManager';
import { 
  Star, Rocket, Play, Volume2, VolumeX, RotateCcw, Sparkles,
  Trophy, Target, Gift, Gamepad2, BookOpen, Zap, Check, X,
  Brain, Award, Lightbulb, Pencil, Palette, Music, Heart
} from 'lucide-react';

// Enhanced Quiz Questions with more variety
const quizQuestions = [
  {
    question: "Which planet is known as the Red Planet?",
    options: ["Earth", "Venus", "Mars", "Jupiter"],
    correctAnswer: "Mars",
    explanation: "Mars is called the Red Planet because of the reddish iron oxide (rust) on its surface!",
    funFact: "A day on Mars is almost the same as Earth - 24 hours and 37 minutes!"
  },
  {
    question: "What is the largest planet in our Solar System?",
    options: ["Earth", "Saturn", "Neptune", "Jupiter"],
    correctAnswer: "Jupiter",
    explanation: "Jupiter is HUGE! It's so big that all other planets could fit inside it!",
    funFact: "Jupiter has a giant storm called the Great Red Spot that's bigger than Earth!"
  },
  {
    question: "How many moons does Earth have?",
    options: ["0", "1", "2", "3"],
    correctAnswer: "1",
    explanation: "Earth has one moon that helps create our ocean tides!",
    funFact: "The Moon is slowly moving away from Earth - about 3.8 cm per year!"
  },
  {
    question: "What do astronauts wear in space?",
    options: ["Regular clothes", "Swimming suits", "Space suits", "Pajamas"],
    correctAnswer: "Space suits",
    explanation: "Space suits protect astronauts from the cold vacuum of space!",
    funFact: "A space suit costs about $500 million to make!"
  },
  {
    question: "What is the closest star to Earth?",
    options: ["Moon", "Mars", "Sun", "Venus"],
    correctAnswer: "Sun",
    explanation: "The Sun is our closest star and gives us light and warmth!",
    funFact: "The Sun is so big that about 1.3 million Earths could fit inside it!"
  },
  {
    question: "How long does it take Earth to orbit the Sun?",
    options: ["1 day", "1 week", "1 month", "1 year"],
    correctAnswer: "1 year",
    explanation: "Earth takes one year (365 days) to go around the Sun once!",
    funFact: "Earth travels around the Sun at 67,000 miles per hour!"
  }
];

// Memory Game Cards
const memoryCards = [
  { id: 1, name: "Earth", emoji: "🌍" },
  { id: 2, name: "Moon", emoji: "🌙" },
  { id: 3, name: "Sun", emoji: "☀️" },
  { id: 4, name: "Rocket", emoji: "🚀" },
  { id: 5, name: "Satellite", emoji: "🛰️" },
  { id: 6, name: "Astronaut", emoji: "👨‍🚀" },
  { id: 7, name: "Star", emoji: "⭐" },
  { id: 8, name: "Planet", emoji: "🪐" },
];

// 3D Space Objects for the drawing canvas background
function SpaceObject({ position, color, size }: { position: [number, number, number], color: string, size: number }) {
  const meshRef = useRef<THREE.Mesh>(null);
  
  useFrame((state) => {
    if (meshRef.current) {
      meshRef.current.rotation.x += 0.01;
      meshRef.current.rotation.y += 0.01;
      meshRef.current.position.y = position[1] + Math.sin(state.clock.elapsedTime) * 0.2;
    }
  });

  return (
    <mesh ref={meshRef} position={position}>
      <sphereGeometry args={[size, 16, 16]} />
      <meshStandardMaterial color={color} emissive={color} emissiveIntensity={0.2} />
    </mesh>
  );
}

function SpaceScene() {
  return (
    <>
      <ambientLight intensity={0.5} />
      <pointLight position={[10, 10, 10]} />
      
      <SpaceObject position={[-2, 0, 0]} color="#4f46e5" size={0.3} />
      <SpaceObject position={[2, 1, -1]} color="#ec4899" size={0.2} />
      <SpaceObject position={[0, -1, 1]} color="#10b981" size={0.25} />
      <SpaceObject position={[-1, 1.5, -2]} color="#f59e0b" size={0.15} />
      <SpaceObject position={[1.5, -0.5, 0]} color="#ef4444" size={0.2} />
    </>
  );
}

interface KidsZoneProps {
  className?: string;
}

const KidsZone: React.FC<KidsZoneProps> = ({ className = "" }) => {
  const { theme } = useTheme();
  const { playSound } = useSound();
  const [activeGame, setActiveGame] = useState<'quiz' | 'memory' | 'drawing' | null>(null);
  const [score, setScore] = useState(0);
  const [level, setLevel] = useState(1);
  const [soundEnabled, setSoundEnabled] = useState(true);
  
  // Quiz Game State
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null);
  const [showExplanation, setShowExplanation] = useState(false);
  const [quizCompleted, setQuizCompleted] = useState(false);
  const [correctAnswers, setCorrectAnswers] = useState(0);

  // Memory Game State
  const [memoryGameCards, setMemoryGameCards] = useState<any[]>([]);
  const [flippedCards, setFlippedCards] = useState<number[]>([]);
  const [matchedCards, setMatchedCards] = useState<number[]>([]);
  const [memoryMoves, setMemoryMoves] = useState(0);
  const [memoryCompleted, setMemoryCompleted] = useState(false);

  // Drawing Canvas State
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const [currentColor, setCurrentColor] = useState('#4f46e5');
  const [brushSize, setBrushSize] = useState(5);

  // Initialize Memory Game
  const initializeMemoryGame = () => {
    const shuffled = [...memoryCards, ...memoryCards]
      .map(card => ({ ...card, uniqueId: Math.random() }))
      .sort(() => Math.random() - 0.5);
    setMemoryGameCards(shuffled);
    setFlippedCards([]);
    setMatchedCards([]);
    setMemoryMoves(0);
    setMemoryCompleted(false);
  };

  // Handle Memory Card Click
  const handleMemoryCardClick = (index: number) => {
    if (flippedCards.length === 2 || flippedCards.includes(index) || matchedCards.includes(index)) {
      return;
    }

    const newFlipped = [...flippedCards, index];
    setFlippedCards(newFlipped);    if (newFlipped.length === 2) {
      setMemoryMoves(prev => prev + 1);
      
      if (memoryGameCards[newFlipped[0]].id === memoryGameCards[newFlipped[1]].id) {
        // Match found!
        playSound('success');
        setTimeout(() => {
          setMatchedCards(prev => [...prev, ...newFlipped]);
          setFlippedCards([]);
          setScore(prev => prev + 10);
          
          if (matchedCards.length + 2 === memoryGameCards.length) {
            setMemoryCompleted(true);
            setScore(prev => prev + 50); // Bonus for completion
            playSound('success', { playbackRate: 1.3 });
          }
        }, 1000);
      } else {
        // No match
        playSound('click', { playbackRate: 0.8 });
        setTimeout(() => {
          setFlippedCards([]);
        }, 1500);
      }
    } else {
      // First card flip
      playSound('click');
    }
  };
  // Quiz Functions
  const handleAnswerSelect = (answer: string) => {
    setSelectedAnswer(answer);
    setShowExplanation(true);
    
    if (answer === quizQuestions[currentQuestion].correctAnswer) {
      setCorrectAnswers(prev => prev + 1);
      setScore(prev => prev + 20);
      // Play success sound
      playSound('success');
    } else {
      // Play a different tone for incorrect answer
      playSound('click', { playbackRate: 0.7 });
    }

    setTimeout(() => {
      if (currentQuestion + 1 < quizQuestions.length) {
        setCurrentQuestion(prev => prev + 1);
        setSelectedAnswer(null);
        setShowExplanation(false);
      } else {
        setQuizCompleted(true);
        // Play special completion sound
        playSound('success', { playbackRate: 1.2 });
      }
    }, 3000);
  };

  const resetQuiz = () => {
    setCurrentQuestion(0);
    setSelectedAnswer(null);
    setShowExplanation(false);
    setQuizCompleted(false);
    setCorrectAnswers(0);
  };

  // Drawing Functions
  const startDrawing = (e: React.MouseEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    setIsDrawing(true);
    const rect = canvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    
    const ctx = canvas.getContext('2d');
    if (ctx) {
      ctx.beginPath();
      ctx.moveTo(x, y);
    }
  };

  const draw = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (!isDrawing) return;
    
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    const rect = canvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    
    const ctx = canvas.getContext('2d');
    if (ctx) {
      ctx.lineTo(x, y);
      ctx.strokeStyle = currentColor;
      ctx.lineWidth = brushSize;
      ctx.lineCap = 'round';
      ctx.stroke();
    }
  };

  const stopDrawing = () => {
    setIsDrawing(false);
  };

  const clearCanvas = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    const ctx = canvas.getContext('2d');
    if (ctx) {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
    }
  };  useEffect(() => {
    initializeMemoryGame();
    initSoundOnInteraction();
  }, []);

  // Sound-enabled game handlers
  const startQuizGame = () => {
    playSound('sparkle');
    setActiveGame('quiz');
  };

  const startMemoryGame = () => {
    playSound('alien');
    setActiveGame('memory');
  };

  const startDrawingGame = () => {
    playSound('sparkle', { playbackRate: 1.5 });
    setActiveGame('drawing');
  };

  const goBackToMenu = () => {
    playSound('click');
    setActiveGame(null);
  };

  const GameSelector = () => (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      {/* Space Quiz */}      <motion.div
        whileHover={{ scale: 1.05 }}
        onClick={startQuizGame}
        onMouseEnter={() => playSound('hover')}
        className={`cursor-pointer p-6 rounded-2xl text-center transition-all duration-300 ${
          theme === 'dark' 
            ? 'bg-gradient-to-br from-blue-500/20 to-purple-500/20 hover:from-blue-500/30 hover:to-purple-500/30 border border-blue-400/30' 
            : 'bg-gradient-to-br from-blue-100 to-purple-100 hover:from-blue-200 hover:to-purple-200 border border-blue-300'
        }`}
      >
        <div className="w-16 h-16 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center mx-auto mb-4">
          <Brain className="w-8 h-8 text-white" />
        </div>
        <h3 className={`text-xl font-bold mb-2 ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
          Space Quiz
        </h3>
        <p className={`text-sm ${theme === 'dark' ? 'text-gray-300' : 'text-gray-600'}`}>
          Test your space knowledge with fun questions!
        </p>
        <Badge className="mt-3 bg-blue-500 text-white">
          +20 points per question
        </Badge>
      </motion.div>

      {/* Memory Game */}      <motion.div
        whileHover={{ scale: 1.05 }}
        onClick={() => {
          startMemoryGame();
          initializeMemoryGame();
        }}
        onMouseEnter={() => playSound('hover')}
        className={`cursor-pointer p-6 rounded-2xl text-center transition-all duration-300 ${
          theme === 'dark' 
            ? 'bg-gradient-to-br from-green-500/20 to-emerald-500/20 hover:from-green-500/30 hover:to-emerald-500/30 border border-green-400/30' 
            : 'bg-gradient-to-br from-green-100 to-emerald-100 hover:from-green-200 hover:to-emerald-200 border border-green-300'
        }`}
      >
        <div className="w-16 h-16 bg-gradient-to-r from-green-500 to-emerald-600 rounded-full flex items-center justify-center mx-auto mb-4">
          <Target className="w-8 h-8 text-white" />
        </div>
        <h3 className={`text-xl font-bold mb-2 ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
          Memory Match
        </h3>
        <p className={`text-sm ${theme === 'dark' ? 'text-gray-300' : 'text-gray-600'}`}>
          Match space objects to improve your memory!
        </p>
        <Badge className="mt-3 bg-green-500 text-white">
          +10 points per match
        </Badge>
      </motion.div>

      {/* Space Drawing */}      <motion.div
        whileHover={{ scale: 1.05 }}
        onClick={startDrawingGame}
        onMouseEnter={() => playSound('hover')}
        className={`cursor-pointer p-6 rounded-2xl text-center transition-all duration-300 ${
          theme === 'dark' 
            ? 'bg-gradient-to-br from-pink-500/20 to-rose-500/20 hover:from-pink-500/30 hover:to-rose-500/30 border border-pink-400/30' 
            : 'bg-gradient-to-br from-pink-100 to-rose-100 hover:from-pink-200 hover:to-rose-200 border border-pink-300'
        }`}
      >
        <div className="w-16 h-16 bg-gradient-to-r from-pink-500 to-rose-600 rounded-full flex items-center justify-center mx-auto mb-4">
          <Palette className="w-8 h-8 text-white" />
        </div>
        <h3 className={`text-xl font-bold mb-2 ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
          Space Artist
        </h3>
        <p className={`text-sm ${theme === 'dark' ? 'text-gray-300' : 'text-gray-600'}`}>
          Draw your own space adventures!
        </p>
        <Badge className="mt-3 bg-pink-500 text-white">
          Creative Mode
        </Badge>
      </motion.div>
    </div>
  );

  return (
    <div className={`min-h-screen p-6 ${className}`}>
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center mb-8"
      >
        <h1 className={`text-4xl font-bold mb-4 bg-gradient-to-r from-blue-400 via-purple-500 to-pink-500 bg-clip-text text-transparent`}>
          🚀 Kids Space Academy 🌟
        </h1>
        <p className={`text-lg ${theme === 'dark' ? 'text-gray-300' : 'text-gray-600'} mb-4`}>
          Welcome, Space Cadet! Ready for an amazing space adventure?
        </p>
        
        {/* Score and Level Display */}
        <div className="flex justify-center items-center gap-6 mb-6">
          <div className={`px-4 py-2 rounded-full ${theme === 'dark' ? 'bg-blue-600' : 'bg-blue-500'} text-white`}>
            <Trophy className="w-5 h-5 inline mr-2" />
            Score: {score}
          </div>
          <div className={`px-4 py-2 rounded-full ${theme === 'dark' ? 'bg-purple-600' : 'bg-purple-500'} text-white`}>
            <Star className="w-5 h-5 inline mr-2" />
            Level: {level}
          </div>
          <button
            onClick={() => setSoundEnabled(!soundEnabled)}
            className={`px-4 py-2 rounded-full ${
              soundEnabled 
                ? theme === 'dark' ? 'bg-green-600' : 'bg-green-500'
                : theme === 'dark' ? 'bg-gray-600' : 'bg-gray-500'
            } text-white`}
          >
            {soundEnabled ? <Volume2 className="w-5 h-5" /> : <VolumeX className="w-5 h-5" />}
          </button>
        </div>
      </motion.div>

      {/* Game Content */}
      <AnimatePresence mode="wait">
        {!activeGame ? (
          <motion.div
            key="selector"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
          >
            <GameSelector />
          </motion.div>
        ) : activeGame === 'quiz' ? (
          <motion.div
            key="quiz"
            initial={{ opacity: 0, x: 100 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -100 }}
          >
            <Card className={`max-w-2xl mx-auto ${theme === 'dark' ? 'bg-gray-800 border-gray-700' : 'bg-white'}`}>
              <CardHeader>
                <div className="flex justify-between items-center">
                  <CardTitle className="flex items-center gap-2">
                    <Brain className="w-6 h-6 text-blue-500" />
                    Space Quiz
                  </CardTitle>
                  <Button variant="outline" onClick={() => setActiveGame(null)}>
                    Back
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                {!quizCompleted ? (
                  <div className="space-y-6">
                    <div className="text-center">
                      <Badge variant="outline">
                        Question {currentQuestion + 1} of {quizQuestions.length}
                      </Badge>
                    </div>
                    
                    <h3 className={`text-xl font-semibold text-center ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
                      {quizQuestions[currentQuestion].question}
                    </h3>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {quizQuestions[currentQuestion].options.map((option, index) => (
                        <button
                          key={index}
                          onClick={() => handleAnswerSelect(option)}
                          disabled={selectedAnswer !== null}
                          className={`p-4 rounded-lg border-2 transition-all duration-300 ${
                            selectedAnswer === option
                              ? option === quizQuestions[currentQuestion].correctAnswer
                                ? 'border-green-500 bg-green-100 dark:bg-green-900'
                                : 'border-red-500 bg-red-100 dark:bg-red-900'
                              : selectedAnswer && option === quizQuestions[currentQuestion].correctAnswer
                                ? 'border-green-500 bg-green-100 dark:bg-green-900'
                                : theme === 'dark'
                                  ? 'border-gray-600 hover:border-blue-500 bg-gray-700 hover:bg-gray-600'
                                  : 'border-gray-300 hover:border-blue-500 bg-gray-50 hover:bg-gray-100'
                          }`}
                        >
                          {option}
                        </button>
                      ))}
                    </div>
                    
                    {showExplanation && (
                      <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className={`p-4 rounded-lg ${
                          selectedAnswer === quizQuestions[currentQuestion].correctAnswer
                            ? 'bg-green-100 dark:bg-green-900 border border-green-500'
                            : 'bg-blue-100 dark:bg-blue-900 border border-blue-500'
                        }`}
                      >
                        <p className="font-semibold mb-2">
                          {selectedAnswer === quizQuestions[currentQuestion].correctAnswer ? '🎉 Correct!' : '💡 Correct answer: ' + quizQuestions[currentQuestion].correctAnswer}
                        </p>
                        <p className="mb-2">{quizQuestions[currentQuestion].explanation}</p>
                        <p className="text-sm font-medium">
                          🌟 Fun Fact: {quizQuestions[currentQuestion].funFact}
                        </p>
                      </motion.div>
                    )}
                  </div>
                ) : (
                  <div className="text-center space-y-6">
                    <div className="text-6xl">🎉</div>
                    <h3 className={`text-2xl font-bold ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
                      Amazing Work!
                    </h3>
                    <p className={`text-lg ${theme === 'dark' ? 'text-gray-300' : 'text-gray-600'}`}>
                      You got {correctAnswers} out of {quizQuestions.length} questions correct!
                    </p>
                    <div className="flex justify-center gap-4">
                      <Button onClick={resetQuiz}>
                        <RotateCcw className="w-4 h-4 mr-2" />
                        Try Again
                      </Button>
                      <Button variant="outline" onClick={() => setActiveGame(null)}>
                        Choose Another Game
                      </Button>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          </motion.div>
        ) : activeGame === 'memory' ? (
          <motion.div
            key="memory"
            initial={{ opacity: 0, x: 100 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -100 }}
          >
            <Card className={`max-w-4xl mx-auto ${theme === 'dark' ? 'bg-gray-800 border-gray-700' : 'bg-white'}`}>
              <CardHeader>
                <div className="flex justify-between items-center">
                  <CardTitle className="flex items-center gap-2">
                    <Target className="w-6 h-6 text-green-500" />
                    Memory Match Game
                  </CardTitle>
                  <div className="flex gap-2">
                    <Badge variant="outline">Moves: {memoryMoves}</Badge>
                    <Button variant="outline" onClick={() => setActiveGame(null)}>
                      Back
                    </Button>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                {!memoryCompleted ? (
                  <div className="grid grid-cols-4 gap-4">
                    {memoryGameCards.map((card, index) => (
                      <motion.div
                        key={card.uniqueId}
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={() => handleMemoryCardClick(index)}
                        className={`aspect-square rounded-lg cursor-pointer flex items-center justify-center text-4xl transition-all duration-300 ${
                          flippedCards.includes(index) || matchedCards.includes(index)
                            ? theme === 'dark' ? 'bg-blue-600' : 'bg-blue-500'
                            : theme === 'dark' ? 'bg-gray-700 hover:bg-gray-600' : 'bg-gray-200 hover:bg-gray-300'
                        }`}
                      >
                        {flippedCards.includes(index) || matchedCards.includes(index) 
                          ? card.emoji 
                          : '❓'
                        }
                      </motion.div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center space-y-6">
                    <div className="text-6xl">🎊</div>
                    <h3 className={`text-2xl font-bold ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
                      Fantastic Memory!
                    </h3>
                    <p className={`text-lg ${theme === 'dark' ? 'text-gray-300' : 'text-gray-600'}`}>
                      You completed the game in {memoryMoves} moves!
                    </p>
                    <div className="flex justify-center gap-4">
                      <Button onClick={initializeMemoryGame}>
                        <RotateCcw className="w-4 h-4 mr-2" />
                        Play Again
                      </Button>
                      <Button variant="outline" onClick={() => setActiveGame(null)}>
                        Choose Another Game
                      </Button>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          </motion.div>
        ) : (
          <motion.div
            key="drawing"
            initial={{ opacity: 0, x: 100 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -100 }}
          >
            <Card className={`max-w-4xl mx-auto ${theme === 'dark' ? 'bg-gray-800 border-gray-700' : 'bg-white'}`}>
              <CardHeader>
                <div className="flex justify-between items-center">
                  <CardTitle className="flex items-center gap-2">
                    <Palette className="w-6 h-6 text-pink-500" />
                    Space Artist Studio
                  </CardTitle>
                  <Button variant="outline" onClick={() => setActiveGame(null)}>
                    Back
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  {/* Drawing Tools */}
                  <div className="flex flex-wrap gap-4 items-center">
                    <div className="flex gap-2">
                      {['#4f46e5', '#ef4444', '#10b981', '#f59e0b', '#8b5cf6', '#ec4899'].map(color => (
                        <button
                          key={color}
                          onClick={() => setCurrentColor(color)}
                          className={`w-8 h-8 rounded-full border-2 ${
                            currentColor === color ? 'border-white' : 'border-gray-300'
                          }`}
                          style={{ backgroundColor: color }}
                        />
                      ))}
                    </div>
                    
                    <div className="flex items-center gap-2">
                      <span className={`text-sm ${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}`}>
                        Brush Size:
                      </span>
                      <input
                        type="range"
                        min="2"
                        max="20"
                        value={brushSize}
                        onChange={(e) => setBrushSize(Number(e.target.value))}
                        className="w-20"
                      />
                      <span className={`text-sm ${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}`}>
                        {brushSize}px
                      </span>
                    </div>
                    
                    <Button onClick={clearCanvas} variant="outline">
                      <RotateCcw className="w-4 h-4 mr-2" />
                      Clear
                    </Button>
                  </div>
                  
                  {/* Drawing Canvas with 3D Background */}
                  <div className="relative">
                    <div className="absolute inset-0 rounded-lg overflow-hidden">
                      <Canvas camera={{ position: [0, 0, 5] }}>
                        <SpaceScene />
                      </Canvas>
                    </div>
                    <canvas
                      ref={canvasRef}
                      width={800}
                      height={500}
                      onMouseDown={startDrawing}
                      onMouseMove={draw}
                      onMouseUp={stopDrawing}
                      onMouseLeave={stopDrawing}
                      className="relative z-10 border-2 border-dashed border-gray-300 rounded-lg cursor-crosshair bg-transparent"
                      style={{ width: '100%', maxWidth: '800px', height: 'auto' }}
                    />
                  </div>
                  
                  <p className={`text-center text-sm ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>
                    🎨 Draw your space adventure! Use different colors and brush sizes to create amazing space art!
                  </p>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default KidsZone;
