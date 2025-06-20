import React, { useState, useRef, useEffect } from 'react';
import { motion, useAnimation, useInView } from 'framer-motion';
import { SpaceCard } from './ui/space-card';
import { SpaceLoader } from './ui/space-loader';
import { EnhancedInteractiveSpaceScene } from './ui/enhanced-interactive-space-scene';
import { 
  Rocket, 
  Star, 
  Globe, 
  Satellite, 
  Telescope, 
  Users,
  Target,
  Award,
  ChevronRight,
  Play,
  Pause,
  RotateCcw,
  Settings,
  Monitor
} from 'lucide-react';

// Animated stats component
const AnimatedStat = ({ 
  icon: Icon, 
  value, 
  label, 
  delay = 0,
  accentColor = "from-blue-500 to-purple-600"
}: {
  icon: React.ComponentType<React.SVGProps<SVGSVGElement>>;
  value: string;
  label: string;
  delay?: number;
  accentColor?: string;
}) => {
  const controls = useAnimation();
  const ref = useRef(null);
  const inView = useInView(ref, { once: true });

  useEffect(() => {
    if (inView) {
      controls.start({
        opacity: 1,
        y: 0,
        transition: { duration: 0.6, delay }
      });
    }
  }, [controls, inView, delay]);

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 20 }}
      animate={controls}
      className="relative group"
    >      <div className="bg-gradient-to-br from-white/5 to-white/10 backdrop-blur-sm rounded-xl p-6 border border-white/20 hover:border-white/40 transition-all duration-300 hover:shadow-2xl hover:shadow-blue-500/20 aspect-square flex flex-col">
        <div className="flex items-center justify-between mb-4">
          <div className={`p-3 rounded-full bg-gradient-to-r ${accentColor} shadow-lg`}>
            <Icon className="w-6 h-6 text-white" />
          </div>
          <div className="px-2 py-1 bg-white/10 text-white/80 text-xs rounded-full">
            LIVE
          </div>
        </div>
        <div className="flex flex-col justify-center flex-grow">
          <motion.div 
            className="text-3xl font-bold text-white mb-2"
            initial={{ scale: 0.8 }}
            animate={{ scale: 1 }}
            transition={{ delay: delay + 0.2, type: "spring", stiffness: 200 }}
          >
            {value}
          </motion.div>
          <div className="text-sm text-gray-300">{label}</div>
        </div>
        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 rounded-xl"></div>
      </div>
    </motion.div>
  );
};

// Mission Card Component
const MissionCard = ({ 
  title, 
  description, 
  status, 
  progress, 
  icon: Icon,
  delay = 0 
}: {
  title: string;
  description: string;
  status: string;
  progress: number;
  icon: React.ComponentType<React.SVGProps<SVGSVGElement>>;
  delay?: number;
}) => {
  const controls = useAnimation();
  const ref = useRef(null);
  const inView = useInView(ref, { once: true });

  useEffect(() => {
    if (inView) {
      controls.start({
        opacity: 1,
        y: 0,
        transition: { duration: 0.6, delay }
      });
    }
  }, [controls, inView, delay]);

  return (    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 30 }}
      animate={controls}
      className="group"
    >
      <SpaceCard className="h-full aspect-square">
        <div className="flex flex-col h-full">
          <div className="flex items-start justify-between mb-4">
            <div className="flex items-center space-x-3">
              <div className="p-3 rounded-full bg-gradient-to-r from-blue-500 to-purple-600">
                <Icon className="w-5 h-5 text-white" />
              </div>
              <div>
                <h3 className="font-semibold text-white">{title}</h3>
                <span className={`text-xs px-2 py-1 rounded-full ${
                  status === 'Active' ? 'bg-green-500/20 text-green-400' :
                  status === 'Planned' ? 'bg-yellow-500/20 text-yellow-400' :
                  'bg-blue-500/20 text-blue-400'
                }`}>
                  {status}
                </span>
              </div>
            </div>
            <ChevronRight className="w-4 h-4 text-gray-400 group-hover:text-white transition-colors" />
          </div>
          
          <p className="text-sm text-gray-300 mb-4 line-clamp-2">{description}</p>
          
          <div className="space-y-2 mt-auto">
            <div className="flex justify-between text-xs text-gray-400">
              <span>Progress</span>
              <span>{progress}%</span>
            </div>
            <div className="w-full bg-gray-700 rounded-full h-2">
              <motion.div
                className="bg-gradient-to-r from-blue-500 to-purple-600 h-2 rounded-full"
                initial={{ width: 0 }}
                animate={{ width: `${progress}%` }}
                transition={{ duration: 1, delay: delay + 0.5 }}
              />
            </div>
          </div>
        </div>
      </SpaceCard>
    </motion.div>
  );
};

// Static particles component - NO ANIMATIONS
const StaticParticles = () => {
  const particles = React.useMemo(() => {
    return Array.from({ length: 20 }, (_, i) => ({
      id: i,
      x: Math.random() * 100,
      y: Math.random() * 100,
      size: Math.random() * 2 + 0.5,
      opacity: Math.random() * 0.3 + 0.1
    }));
  }, []);

  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      {particles.map((particle) => (
        <div
          key={particle.id}
          className="absolute w-1 h-1 bg-white rounded-full"
          style={{
            left: `${particle.x}%`,
            top: `${particle.y}%`,
            width: `${particle.size}px`,
            height: `${particle.size}px`,
            opacity: particle.opacity
          }}
        />
      ))}
    </div>
  );
};

export const EnhancedDashboard = () => {
  const [selectedMission, setSelectedMission] = useState<string | null>(null);  const [sceneControls, setSceneControls] = useState({
    autoRotate: true,
    showLabels: true,
    animationSpeed: 1,
    showFPS: false
  });

  const missions = [
    {
      title: "Mars Rover Mission",
      description: "Advanced robotic exploration of the Martian surface with AI-powered navigation and sample collection.",
      status: "Active",
      progress: 78,
      icon: Rocket
    },
    {
      title: "Lunar Gateway",
      description: "Establishing a permanent lunar station for deep space exploration and research.",
      status: "Planned",
      progress: 45,
      icon: Satellite
    },
    {
      title: "Asteroid Mining",
      description: "Automated extraction of valuable minerals from near-Earth asteroids.",
      status: "Research",
      progress: 23,
      icon: Target
    },
    {
      title: "Europa Ocean Probe",
      description: "Subsurface exploration of Jupiter's moon Europa to search for signs of life.",
      status: "Development",
      progress: 67,
      icon: Telescope
    }
  ];

  const stats = [
    { icon: Rocket, value: "12", label: "Active Missions", accentColor: "from-blue-500 to-cyan-500" },
    { icon: Globe, value: "847", label: "Planets Mapped", accentColor: "from-purple-500 to-pink-500" },
    { icon: Users, value: "2.3K", label: "Scientists", accentColor: "from-green-500 to-teal-500" },
    { icon: Award, value: "94%", label: "Success Rate", accentColor: "from-orange-500 to-red-500" }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-blue-900 to-purple-900 relative overflow-hidden">      {/* Static background elements */}
      <StaticParticles />
      
      {/* Main content */}
      <div className="relative z-10 container mx-auto px-6 py-8">
        {/* Header */}
        <motion.div 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-center mb-12"
        >
          <h1 className="text-4xl md:text-6xl font-bold text-white mb-4">
            <span className="bg-gradient-to-r from-blue-400 via-purple-500 to-pink-500 bg-clip-text text-transparent">
              AstroAgent
            </span>
          </h1>
          <p className="text-xl text-gray-300 max-w-2xl mx-auto">
            Exploring the cosmos through advanced AI and cutting-edge space technology
          </p>
        </motion.div>        {/* Stats Section */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-12">
          {stats.map((stat, index) => (
            <AnimatedStat
              key={stat.label}
              icon={stat.icon}
              value={stat.value}
              label={stat.label}
              delay={index * 0.2}
              accentColor={stat.accentColor}
            />
          ))}
        </div>

        {/* Interactive Space Scene */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8, delay: 0.4 }}
          className="mb-12"
        >
          <div className="text-center mb-6">
            <h2 className="text-2xl font-bold text-white mb-2">Interactive Solar System</h2>
            <p className="text-gray-300">Click on planets to explore and learn about our solar system</p>
          </div>
            <div className="relative">
            <EnhancedInteractiveSpaceScene 
              height="600px" 
              className="rounded-xl shadow-2xl" 
              showFPS={sceneControls.showFPS}
            />
              {/* Scene Controls */}
            <div className="absolute top-4 left-4 flex flex-col gap-2">
              <button
                onClick={() => setSceneControls(prev => ({ ...prev, autoRotate: !prev.autoRotate }))}
                className="p-2 bg-black/60 backdrop-blur-sm rounded-lg text-white hover:bg-black/80 transition-colors"
                title={sceneControls.autoRotate ? "Pause auto-rotation" : "Resume auto-rotation"}
              >
                {sceneControls.autoRotate ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
              </button>
              
              <button
                onClick={() => setSceneControls(prev => ({ ...prev, showLabels: !prev.showLabels }))}
                className="p-2 bg-black/60 backdrop-blur-sm rounded-lg text-white hover:bg-black/80 transition-colors"
                title="Toggle planet labels"
              >
                <Star className="w-4 h-4" />
              </button>
              
              <button
                onClick={() => setSceneControls(prev => ({ ...prev, showFPS: !prev.showFPS }))}
                className="p-2 bg-black/60 backdrop-blur-sm rounded-lg text-white hover:bg-black/80 transition-colors"
                title="Toggle FPS counter"
              >
                <Monitor className="w-4 h-4" />
              </button>
              
              <button
                className="p-2 bg-black/60 backdrop-blur-sm rounded-lg text-white hover:bg-black/80 transition-colors"
                title="Reset view"
              >
                <RotateCcw className="w-4 h-4" />
              </button>
            </div>
          </div>
        </motion.div>

        {/* Missions Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.6 }}
          className="mb-12"
        >
          <div className="text-center mb-8">
            <h2 className="text-3xl font-bold text-white mb-4">Current Missions</h2>
            <p className="text-gray-300 max-w-2xl mx-auto">
              Explore our ongoing space missions and their progress towards unlocking the mysteries of the universe
            </p>
          </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {missions.map((mission, index) => (
              <MissionCard
                key={mission.title}
                title={mission.title}
                description={mission.description}
                status={mission.status}
                progress={mission.progress}
                icon={mission.icon}
                delay={index * 0.1}
              />
            ))}
          </div>
        </motion.div>

        {/* Call to Action */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.8 }}
          className="text-center"
        >
          <SpaceCard className="max-w-4xl mx-auto">
            <div className="flex flex-col md:flex-row items-center justify-between">
              <div className="mb-6 md:mb-0">
                <h3 className="text-2xl font-bold text-white mb-2">Ready to Explore?</h3>
                <p className="text-gray-300">Join us in pushing the boundaries of space exploration</p>
              </div>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="bg-gradient-to-r from-blue-500 to-purple-600 text-white px-8 py-3 rounded-lg font-semibold hover:from-blue-600 hover:to-purple-700 transition-all duration-300 shadow-lg hover:shadow-xl"
              >
                Start Mission
              </motion.button>
            </div>
          </SpaceCard>
        </motion.div>
      </div>
    </div>
  );
};

export default EnhancedDashboard;
