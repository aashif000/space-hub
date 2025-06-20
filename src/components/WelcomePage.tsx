import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useTheme } from '../contexts/ThemeContext';
import VibrantAnimatedBackground from '../components/ui/vibrant-animated-background';
import { 
  Rocket, Satellite, Globe, Users, Activity, Search, Star, Shield,
  ChevronRight, Play, BookOpen, Target, Command, Sparkles, ArrowRight
} from 'lucide-react';

interface WelcomePageProps {
  onEnter: () => void;
}

const WelcomePage: React.FC<WelcomePageProps> = ({ onEnter }) => {
  const { theme } = useTheme();
  const [currentSlide, setCurrentSlide] = useState(0);
  const [autoAdvance, setAutoAdvance] = useState(true);

  const slides = [
    {
      title: "Welcome to NEXUS SPACE HUB",
      subtitle: "Your Gateway to the Universe",
      description: "Explore the cosmos like never before with cutting-edge space technology, real-time data, and immersive experiences.",
      icon: Sparkles,
      color: "from-cyan-400 to-blue-600"
    },
    {
      title: "Mission Control Center",
      subtitle: "Real-Time Space Operations",
      description: "Monitor live satellite data, track space missions, and access comprehensive space weather information.",
      icon: Command,
      color: "from-purple-400 to-pink-600"
    },
    {
      title: "Exploration Tools",
      subtitle: "Discover New Worlds",
      description: "Journey through our solar system, explore exoplanets, and dive deep into astronomical databases.",
      icon: Rocket,
      color: "from-green-400 to-teal-600"
    },
    {
      title: "Interactive Learning",
      subtitle: "Education & Discovery",
      description: "Engage with interactive simulations, space games for kids, and comprehensive learning resources.",
      icon: BookOpen,
      color: "from-orange-400 to-red-600"
    }
  ];

  useEffect(() => {
    if (autoAdvance) {
      const timer = setInterval(() => {
        setCurrentSlide((prev) => (prev + 1) % slides.length);
      }, 4000);
      return () => clearInterval(timer);
    }
  }, [autoAdvance, slides.length]);

  const features = [
    { icon: Satellite, label: "Live Satellite Tracking", description: "Real-time orbital data" },
    { icon: Globe, label: "Earth Observation", description: "Copernicus satellite imagery" },
    { icon: Star, label: "Astronomical Data", description: "Comprehensive star catalogs" },
    { icon: Target, label: "Mission Planning", description: "Space exploration tools" },
    { icon: Users, label: "Astronaut Database", description: "Crew information & bios" },
    { icon: Activity, label: "Space Weather", description: "Solar activity monitoring" }
  ];

  return (
    <div className="min-h-screen relative overflow-hidden">
      <VibrantAnimatedBackground />
      
      <div className="relative z-10 min-h-screen flex flex-col">
        {/* Header */}
        <motion.header 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="p-8 text-center"
        >
          <div className="flex items-center justify-center gap-4 mb-4">
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
            >
              <Sparkles className="w-12 h-12 text-cyan-400" />
            </motion.div>
            <h1 className="text-4xl md:text-6xl font-bold bg-gradient-to-r from-cyan-400 via-blue-500 to-purple-600 bg-clip-text text-transparent">
              NEXUS SPACE HUB
            </h1>
          </div>          <p className={`text-lg md:text-xl max-w-2xl mx-auto ${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}`}>
            Advanced Space Exploration and Mission Control Center
          </p>
        </motion.header>

        {/* Main Content */}
        <div className="flex-1 flex flex-col items-center justify-center px-8">
          {/* Slide Content */}
          <motion.div 
            className="max-w-4xl mx-auto text-center mb-12"
            key={currentSlide}
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6 }}
          >            <div className="flex items-center justify-center mb-6">
              <motion.div
                className={`p-6 rounded-full bg-gradient-to-r ${slides[currentSlide].color} shadow-2xl`}
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.95 }}
              >
                {React.createElement(slides[currentSlide].icon, { className: "w-16 h-16 text-white" })}
              </motion.div>
            </div>
              <motion.h2 
              className={`text-3xl md:text-5xl font-bold mb-4 ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
            >
              {slides[currentSlide].title}
            </motion.h2>
            
            <motion.h3 
              className={`text-xl md:text-2xl font-semibold bg-gradient-to-r ${slides[currentSlide].color} bg-clip-text text-transparent mb-6`}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
            >
              {slides[currentSlide].subtitle}
            </motion.h3>
              <motion.p 
              className={`text-lg max-w-2xl mx-auto leading-relaxed ${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}`}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
            >
              {slides[currentSlide].description}
            </motion.p>
          </motion.div>

          {/* Features Grid */}
          <motion.div 
            className="grid grid-cols-2 md:grid-cols-3 gap-4 md:gap-6 max-w-4xl mx-auto mb-12"
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6, duration: 0.8 }}
          >
            {features.map((feature, index) => (              <motion.div
                key={feature.label}
                className={`${theme === 'dark' ? 'bg-white/5' : 'bg-gray-100/80'} backdrop-blur-sm border ${theme === 'dark' ? 'border-white/20' : 'border-gray-300/60'} rounded-lg p-4 text-center ${theme === 'dark' ? 'hover:bg-white/10' : 'hover:bg-gray-200/80'} transition-all duration-300`}
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.7 + index * 0.1 }}
                whileHover={{ scale: 1.05, y: -5 }}
              >
                <feature.icon className="w-8 h-8 text-cyan-400 mx-auto mb-2" />
                <h4 className={`font-semibold text-sm mb-1 ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>{feature.label}</h4>
                <p className={`text-xs ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>{feature.description}</p>
              </motion.div>
            ))}
          </motion.div>

          {/* Enter Button */}
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 1.2, duration: 0.6 }}
          >
            <motion.button
              onClick={onEnter}
              className="group relative px-12 py-4 bg-gradient-to-r from-cyan-400 to-blue-600 hover:from-cyan-500 hover:to-blue-700 rounded-full text-white font-bold text-lg shadow-2xl hover:shadow-cyan-500/25 transition-all duration-300"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onMouseEnter={() => setAutoAdvance(false)}
              onMouseLeave={() => setAutoAdvance(true)}
            >
              <span className="flex items-center gap-3">
                <Play className="w-6 h-6" />
                Enter Space Hub
                <ArrowRight className="w-6 h-6 group-hover:translate-x-1 transition-transform" />
              </span>
              
              {/* Animated border */}
              <motion.div
                className="absolute inset-0 rounded-full border-2 border-cyan-400"
                animate={{
                  scale: [1, 1.1, 1],
                  opacity: [0.5, 0.8, 0.5]
                }}
                transition={{
                  duration: 2,
                  repeat: Infinity,
                  ease: "easeInOut"
                }}
              />
            </motion.button>
          </motion.div>
        </div>

        {/* Slide Indicators */}
        <motion.div 
          className="flex justify-center gap-3 pb-8"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.5 }}
        >
          {slides.map((_, index) => (
            <motion.button
              key={index}
              onClick={() => {
                setCurrentSlide(index);
                setAutoAdvance(false);
                setTimeout(() => setAutoAdvance(true), 2000);
              }}
              className={`w-3 h-3 rounded-full transition-all duration-300 ${
                index === currentSlide 
                  ? 'bg-cyan-400 scale-125 shadow-lg shadow-cyan-400/50' 
                  : 'bg-white/30 hover:bg-white/50'
              }`}
              whileHover={{ scale: 1.2 }}
              whileTap={{ scale: 0.9 }}
            />
          ))}
        </motion.div>
      </div>
    </div>
  );
};

export default WelcomePage;
