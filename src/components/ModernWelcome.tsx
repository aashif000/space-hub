import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Rocket, Sparkles, Globe, Star, Zap, ArrowRight, Play, Pause } from 'lucide-react';

interface ModernWelcomeProps {
  onGetStarted: () => void;
}

export const ModernWelcome: React.FC<ModernWelcomeProps> = ({ onGetStarted }) => {
  const [currentFeature, setCurrentFeature] = useState(0);
  const [isAutoPlaying, setIsAutoPlaying] = useState(true);

  const features = [
    {
      icon: Rocket,
      title: "3D Space Exploration",
      description: "Navigate through interactive 3D environments with real-time spacecraft tracking and planetary visualization",
      color: "from-purple-500 to-pink-500",
      bgColor: "bg-purple-500/10"
    },
    {
      icon: Globe,
      title: "Real-Time Data",
      description: "Access live satellite tracking, space weather monitoring, and current mission status updates",
      color: "from-blue-500 to-cyan-500",
      bgColor: "bg-blue-500/10"
    },
    {
      icon: Star,
      title: "Cosmic Discovery",
      description: "Explore exoplanets, solar system objects, and deep space phenomena with cutting-edge visualizations",
      color: "from-yellow-500 to-orange-500",
      bgColor: "bg-yellow-500/10"
    },
    {
      icon: Zap,
      title: "Advanced Analytics",
      description: "Dive deep into space data with comprehensive analytics, historical mission archives, and predictive insights",
      color: "from-green-500 to-emerald-500",
      bgColor: "bg-green-500/10"
    }
  ];

  useEffect(() => {
    if (!isAutoPlaying) return;
    
    const interval = setInterval(() => {
      setCurrentFeature((prev) => (prev + 1) % features.length);
    }, 4000);

    return () => clearInterval(interval);
  }, [isAutoPlaying, features.length]);

  const currentFeatureData = features[currentFeature];

  return (
    <div className="min-h-screen flex items-center justify-center relative overflow-hidden">
      {/* Animated Background Elements */}
      <div className="absolute inset-0 opacity-30">
        {[...Array(50)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-1 h-1 bg-cyan-400 rounded-full"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
            }}
            animate={{
              opacity: [0, 1, 0],
              scale: [0, 1, 0],
            }}
            transition={{
              duration: 3,
              repeat: Infinity,
              delay: Math.random() * 3,
            }}
          />
        ))}
      </div>

      <div className="container mx-auto px-6 text-center relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, ease: "easeOut" }}
          className="max-w-6xl mx-auto"
        >
          {/* Main Logo and Title */}
          <motion.div 
            className="mb-12"
            initial={{ scale: 0.5, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 1.2, ease: "easeOut" }}
          >
            <div className="flex items-center justify-center mb-6">
              <div className="relative">
                <div className="w-24 h-24 bg-gradient-to-br from-cyan-400 via-blue-500 to-purple-600 rounded-2xl flex items-center justify-center shadow-2xl shadow-cyan-500/30 animate-pulse-glow">
                  <Rocket className="w-12 h-12 text-white" />
                </div>
                <div className="absolute inset-0 w-24 h-24 bg-gradient-to-br from-cyan-400 to-purple-500 rounded-2xl animate-ping opacity-20"></div>
              </div>
            </div>
            
            <h1 className="text-6xl md:text-8xl font-bold bg-gradient-to-r from-cyan-400 via-blue-400 to-purple-400 bg-clip-text text-transparent mb-4 animate-gradient-shift">
              AstroAgent
            </h1>
            
            <p className="text-2xl md:text-3xl text-cyan-300/80 font-light mb-8 max-w-4xl mx-auto">
              Your Gateway to the Universe
            </p>
            
            <p className="text-lg text-cyan-300/60 max-w-2xl mx-auto leading-relaxed">
              Experience space exploration like never before with cutting-edge 3D visualizations, 
              real-time data, and comprehensive mission tracking in one powerful platform.
            </p>
          </motion.div>

          {/* Feature Showcase */}
          <div className="mb-12">
            <AnimatePresence mode="wait">
              <motion.div
                key={currentFeature}
                initial={{ opacity: 0, x: 100 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -100 }}
                transition={{ duration: 0.5 }}
                className={`max-w-4xl mx-auto p-8 rounded-3xl border border-cyan-500/20 ${currentFeatureData.bgColor} backdrop-blur-sm`}
              >
                <div className="flex items-center justify-center mb-6">
                  <div className={`w-16 h-16 rounded-2xl bg-gradient-to-br ${currentFeatureData.color} flex items-center justify-center shadow-lg animate-float-gentle`}>
                    <currentFeatureData.icon className="w-8 h-8 text-white" />
                  </div>
                </div>
                
                <h3 className="text-3xl font-bold text-white mb-4">
                  {currentFeatureData.title}
                </h3>
                
                <p className="text-lg text-cyan-300/80 leading-relaxed">
                  {currentFeatureData.description}
                </p>
              </motion.div>
            </AnimatePresence>

            {/* Feature Navigation */}
            <div className="flex items-center justify-center gap-4 mt-8">
              <button
                onClick={() => setIsAutoPlaying(!isAutoPlaying)}
                className="p-2 rounded-lg bg-cyan-500/20 border border-cyan-500/30 hover:bg-cyan-500/30 transition-colors"
              >
                {isAutoPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
              </button>
              
              <div className="flex gap-2">
                {features.map((_, index) => (
                  <button
                    key={index}
                    onClick={() => {
                      setCurrentFeature(index);
                      setIsAutoPlaying(false);
                    }}
                    className={`w-3 h-3 rounded-full transition-all duration-300 ${
                      index === currentFeature 
                        ? 'bg-cyan-400 shadow-lg shadow-cyan-400/50 scale-125' 
                        : 'bg-cyan-400/30 hover:bg-cyan-400/50'
                    }`}
                  />
                ))}
              </div>
            </div>
          </div>

          {/* Call to Action */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 0.5 }}
            className="flex flex-col sm:flex-row items-center justify-center gap-6"
          >
            <motion.button
              onClick={onGetStarted}
              className="group relative px-8 py-4 bg-gradient-to-r from-cyan-500 to-purple-600 rounded-2xl font-bold text-white text-lg shadow-2xl shadow-cyan-500/30 hover:shadow-cyan-500/50 transition-all duration-300 menu-button"
              whileHover={{ scale: 1.05, y: -2 }}
              whileTap={{ scale: 0.98 }}
            >
              <span className="relative z-10 flex items-center gap-2">
                Launch Experience
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </span>
            </motion.button>

            <motion.div
              className="flex items-center gap-4 text-sm text-cyan-300/60"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 1 }}
            >
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse status-dot"></div>
                <span>All Systems Ready</span>
              </div>
              <div className="hidden sm:block w-px h-4 bg-cyan-500/20"></div>
              <div className="flex items-center gap-1">
                <Sparkles className="w-4 h-4" />
                <span>Enhanced Experience</span>
              </div>
            </motion.div>
          </motion.div>

          {/* Quick Stats */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1.5, duration: 1 }}
            className="mt-16 grid grid-cols-2 md:grid-cols-4 gap-8 max-w-3xl mx-auto"
          >
            {[
              { value: "14", label: "Mission Modules" },
              { value: "3D", label: "Visualizations" },
              { value: "Live", label: "Data Feeds" },
              { value: "∞", label: "Discoveries" }
            ].map((stat, index) => (
              <div key={index} className="text-center">
                <div className="text-3xl font-bold bg-gradient-to-r from-cyan-400 to-purple-400 bg-clip-text text-transparent mb-2">
                  {stat.value}
                </div>
                <div className="text-sm text-cyan-300/60 font-medium">
                  {stat.label}
                </div>
              </div>
            ))}
          </motion.div>
        </motion.div>
      </div>
    </div>
  );
};
