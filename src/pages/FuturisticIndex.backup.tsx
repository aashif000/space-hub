import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useSpaceData } from '../contexts/DataContext';
import { useTheme } from '../contexts/ThemeContext';
import LoadingScreen from '../components/LoadingScreen';
import EnhancedDashboard from '../components/EnhancedDashboard';
import AstroAgentApp from '../components/AstroAgentApp';
import KidsZone from '../components/EnhancedKidsZone';
import { EnhancedSpaceXDashboard } from '../components/spacex/EnhancedSpaceXDashboard';
import SolarSystemExplorer from '../components/SolarSystemExplorer';
import SatelliteTracker from '../components/SatelliteTracker';
import LaunchLibraryExplorer from '../components/LaunchLibraryExplorer';
import ExoplanetExplorer from '../components/ExoplanetExplorer';
import AstronautDatabase from '../components/AstronautDatabase';
import SpaceWeatherMonitor from '../components/SpaceWeatherMonitor';
import { CopernicusDataExplorer } from '../components/satellite/CopernicusDataExplorer';
import { SpaceflightNewsExplorer } from '../components/news/SpaceflightNewsExplorer';
import { SpacePopulationTracker } from '../components/space/SpacePopulationTracker';

import { 
  Rocket, Satellite, Globe, Users, Activity, Search, Star, Shield,
  Newspaper, Earth, UserCheck, Baby, Zap, Command, Sun, Moon,
  Sparkles, Gamepad2, Atom, Brain, Target, BookOpen, ChevronRight, ChevronDown
} from 'lucide-react';

// Navigation Items with Reorganized Categories
const navigationCategories = {
  'Mission Command': {
    icon: Command,
    color: 'from-cyan-400 to-blue-600',
    items: [
      { 
        id: 'mission-control', 
        label: 'Mission Control', 
        icon: Sparkles, 
        component: EnhancedDashboard,
        description: 'Advanced space mission command center',
        featured: true
      },
      { 
        id: 'astro-agent', 
        label: 'AstroAgent AI', 
        icon: Brain, 
        component: AstroAgentApp,
        description: 'AI-powered space exploration assistant',
        featured: true
      },
      { 
        id: 'spacex', 
        label: 'SpaceX Command', 
        icon: Rocket, 
        component: EnhancedSpaceXDashboard,
        description: 'SpaceX missions and launch data'
      },
      { 
        id: 'space-weather', 
        label: 'Space Weather', 
        icon: Activity, 
        component: SpaceWeatherMonitor,
        description: 'Real-time space weather monitoring'
      }
    ]
  },
  'Exploration': {
    icon: Globe,
    color: 'from-purple-400 to-pink-600',
    items: [
      { 
        id: 'solar-system', 
        label: 'Solar System', 
        icon: Sun, 
        component: SolarSystemExplorer,
        description: 'Interactive solar system exploration'
      },
      { 
        id: 'exoplanets', 
        label: 'Exoplanets', 
        icon: Earth, 
        component: ExoplanetExplorer,
        description: 'Discover worlds beyond our solar system'
      },
      { 
        id: 'satellite-tracker', 
        label: 'Live Tracking', 
        icon: Satellite, 
        component: SatelliteTracker,
        description: 'Real-time satellite and ISS tracking'
      },
      { 
        id: 'earth-observation', 
        label: 'Earth Observation', 
        icon: Globe, 
        component: CopernicusDataExplorer,
        description: 'Copernicus satellite data and imagery'
      }
    ]
  },
  'Database': {
    icon: Search,
    color: 'from-green-400 to-teal-600',
    items: [
      { 
        id: 'launches', 
        label: 'Launch Library', 
        icon: Rocket, 
        component: LaunchLibraryExplorer,
        description: 'Comprehensive launch database'
      },
      { 
        id: 'astronauts', 
        label: 'Astronaut Database', 
        icon: UserCheck, 
        component: AstronautDatabase,
        description: 'Complete astronaut profiles and missions'
      },
      { 
        id: 'space-news', 
        label: 'Space News', 
        icon: Newspaper, 
        component: SpaceflightNewsExplorer,
        description: 'Latest spaceflight news and updates'
      },
      { 
        id: 'space-population', 
        label: 'Space Population', 
        icon: Users, 
        component: SpacePopulationTracker,
        description: 'Track humans currently in space'
      }
    ]
  },
  'Education': {
    icon: BookOpen,
    color: 'from-orange-400 to-red-600',
    items: [
      { 
        id: 'kids-zone', 
        label: 'Kids Zone', 
        icon: Baby, 
        component: KidsZone,
        description: 'Interactive space games and learning'
      }
    ]
  }
};
    label: 'Kids Space Academy', 
    icon: Gamepad2, 
    component: KidsZone,
    color: 'from-green-400 via-emerald-500 to-teal-500',
    description: 'Interactive games and educational space adventures',
    category: 'featured',
    glow: 'shadow-green-500/50'
  },
  
  // Exploration
  { 
    id: 'solar-system', 
    label: 'Solar System Explorer', 
    icon: Globe, 
    component: SolarSystemExplorer,
    color: 'from-orange-400 via-red-500 to-pink-500',
    description: '3D interactive journey through our solar system',
    category: 'exploration',
    glow: 'shadow-orange-500/50'
  },
  { 
    id: 'spacex', 
    label: 'SpaceX Mission Hub', 
    icon: Rocket, 
    component: EnhancedSpaceXDashboard,
    color: 'from-red-400 via-pink-500 to-purple-500',
    description: 'Live SpaceX launches, rockets, and mission data',
    category: 'exploration',
    glow: 'shadow-red-500/50'
  },
  { 
    id: 'exoplanets', 
    label: 'Exoplanet Database', 
    icon: Star, 
    component: ExoplanetExplorer,
    color: 'from-yellow-400 via-orange-500 to-red-500',
    description: 'Discover worlds beyond our solar system',
    category: 'exploration',
    glow: 'shadow-yellow-500/50'
  },
  
  // Real-time Tracking
  { 
    id: 'satellites', 
    label: 'Satellite Network', 
    icon: Satellite, 
    component: SatelliteTracker,
    color: 'from-indigo-400 via-blue-500 to-cyan-500',
    description: 'Real-time satellite tracking and orbital data',
    category: 'tracking',
    glow: 'shadow-indigo-500/50'
  },
  { 
    id: 'population', 
    label: 'Space Population', 
    icon: UserCheck, 
    component: SpacePopulationTracker,
    color: 'from-pink-400 via-rose-500 to-red-500',
    description: 'Live count of humans currently in space',
    category: 'tracking',
    glow: 'shadow-pink-500/50'
  },
  
  // Research & Data
  { 
    id: 'astronauts', 
    label: 'Astronaut Archives', 
    icon: Users, 
    component: AstronautDatabase,
    color: 'from-cyan-400 via-teal-500 to-green-500',
    description: 'Comprehensive astronaut profiles and mission history',
    category: 'research',
    glow: 'shadow-cyan-500/50'
  },
  { 
    id: 'launches', 
    label: 'Launch Library', 
    icon: Command, 
    component: LaunchLibraryExplorer,
    color: 'from-violet-400 via-purple-500 to-pink-500',
    description: 'Global space launch schedules and mission data',
    category: 'research',
    glow: 'shadow-violet-500/50'
  },
  
  // Monitoring
  { 
    id: 'weather', 
    label: 'Space Weather', 
    icon: Activity, 
    component: SpaceWeatherMonitor,
    color: 'from-emerald-400 via-green-500 to-teal-500',
    description: 'Solar storms and space weather monitoring',
    category: 'monitoring',
    glow: 'shadow-emerald-500/50'
  },
  { 
    id: 'copernicus', 
    label: 'Earth Observer', 
    icon: Earth, 
    component: CopernicusDataExplorer,
    color: 'from-blue-400 via-cyan-500 to-teal-500',
    description: 'Earth observation and climate monitoring data',
    category: 'monitoring',
    glow: 'shadow-blue-500/50'
  },
  
  // News & Updates
  { 
    id: 'news', 
    label: 'Space News Feed', 
    icon: Newspaper, 
    component: SpaceflightNewsExplorer,
    color: 'from-slate-400 via-gray-500 to-zinc-500',
    description: 'Latest space exploration news and discoveries',
    category: 'news',
    glow: 'shadow-slate-500/50'
  }
];

const categories = {
  featured: { 
    label: 'Featured Missions', 
    icon: Sparkles, 
    color: 'from-cyan-400 to-blue-500',
    description: 'Most popular space exploration tools'
  },
  exploration: { 
    label: 'Deep Space Exploration', 
    icon: Rocket, 
    color: 'from-orange-400 to-red-500',
    description: 'Journey through space and discover new worlds'
  },
  tracking: { 
    label: 'Real-time Tracking', 
    icon: Target, 
    color: 'from-indigo-400 to-purple-500',
    description: 'Live monitoring of space objects and missions'
  },
  research: { 
    label: 'Research Database', 
    icon: BookOpen, 
    color: 'from-violet-400 to-pink-500',
    description: 'Comprehensive space research and data archives'
  },
  monitoring: { 
    label: 'Space Monitoring', 
    icon: Shield, 
    color: 'from-emerald-400 to-teal-500',
    description: 'Environmental and weather monitoring systems'
  },
  news: { 
    label: 'Mission Updates', 
    icon: Newspaper, 
    color: 'from-slate-400 to-gray-500',
    description: 'Latest news and mission updates'
  }
};

const FuturisticIndex = () => {
  const { allDataLoaded } = useSpaceData();
  const { theme, toggleTheme, mounted } = useTheme();
  const [activeTab, setActiveTab] = useState('dashboard');  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);

  if (!allDataLoaded || !mounted) {
    return <LoadingScreen />;
  }

  const renderActiveComponent = () => {
    if (activeTab === 'dashboard') {
      return <FuturisticDashboard />;
    }
    
    const Component = navigationItems.find(item => item.id === activeTab)?.component;
    return Component ? <Component /> : <FuturisticDashboard />;
  };
  const FuturisticDashboard = () => (
    <div className="min-h-screen p-8 space-y-8">      {/* Enhanced Scanning Line Effect */}
      <motion.div
        className="fixed inset-0 pointer-events-none z-15"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.5 }}
      >
        <motion.div
          className="absolute w-full h-px bg-gradient-to-r from-transparent via-cyan-400 to-transparent opacity-40"
          animate={{
            y: ['0vh', '100vh', '0vh'],
          }}
          transition={{
            duration: 6,
            repeat: Infinity,
            ease: "linear",
          }}
        />
        <motion.div
          className="absolute w-full h-px bg-gradient-to-r from-transparent via-purple-400 to-transparent opacity-30"
          animate={{
            y: ['100vh', '0vh', '100vh'],
          }}
          transition={{
            duration: 8,
            repeat: Infinity,
            ease: "linear",
            delay: 2,
          }}
        />
      </motion.div>{/* Floating Particles Effect */}
      <div className="fixed inset-0 pointer-events-none z-5">
        {Array.from({ length: 30 }).map((_, i) => (
          <motion.div
            key={i}
            className={`absolute w-1 h-1 rounded-full opacity-60 ${
              i % 3 === 0 ? 'bg-cyan-400' : i % 3 === 1 ? 'bg-blue-400' : 'bg-purple-400'
            }`}
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
            }}
            animate={{
              y: [0, -150, 0],
              x: [0, Math.random() * 50 - 25, 0],
              opacity: [0.6, 1, 0.6],
              scale: [1, 1.5, 1],
            }}
            transition={{
              duration: 4 + Math.random() * 3,
              repeat: Infinity,
              ease: "easeInOut",
              delay: Math.random() * 3,
            }}
          />
        ))}
      </div>

      {/* Nebula Clouds */}
      <div className="fixed inset-0 pointer-events-none z-5">
        {Array.from({ length: 3 }).map((_, i) => (
          <motion.div
            key={`nebula-${i}`}
            className={`absolute rounded-full opacity-20 blur-3xl ${
              i === 0 ? 'bg-purple-500' : i === 1 ? 'bg-cyan-500' : 'bg-blue-500'
            }`}
            style={{
              width: `${300 + Math.random() * 200}px`,
              height: `${300 + Math.random() * 200}px`,
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
            }}
            animate={{
              scale: [1, 1.2, 1],
              opacity: [0.1, 0.3, 0.1],
              x: [0, 50, 0],
              y: [0, -30, 0],
            }}
            transition={{
              duration: 8 + Math.random() * 4,
              repeat: Infinity,
              ease: "easeInOut",
              delay: i * 2,
            }}
          />
        ))}
      </div>

      {/* Twinkling Stars */}
      <div className="fixed inset-0 pointer-events-none z-5">
        {Array.from({ length: 50 }).map((_, i) => (
          <motion.div
            key={`star-${i}`}
            className="absolute w-px h-px bg-white rounded-full"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
            }}
            animate={{
              opacity: [0.3, 1, 0.3],
              scale: [1, 1.5, 1],
            }}
            transition={{
              duration: 2 + Math.random() * 3,
              repeat: Infinity,
              ease: "easeInOut",
              delay: Math.random() * 5,
            }}
          />
        ))}
      </div>

      {/* Hero Section with Enhanced Styling */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center mb-12 relative"
      >
        {/* Glowing Background Effect */}
        <div className="absolute inset-0 bg-gradient-to-r from-cyan-500/20 via-blue-500/20 to-purple-500/20 rounded-3xl blur-3xl" />
        
        <div className="relative z-10 p-8">
          <motion.h1 
            className="text-6xl md:text-8xl font-bold mb-4 bg-gradient-to-r from-cyan-400 via-blue-500 to-purple-600 bg-clip-text text-transparent"
            animate={{ 
              backgroundPosition: ['0% 50%', '100% 50%', '0% 50%'],
            }}
            transition={{
              duration: 8,
              repeat: Infinity,
              ease: "linear"
            }}
            style={{
              backgroundSize: '200% 200%'
            }}
          >
            SPACE HUB
          </motion.h1>
          <motion.p 
            className={`text-xl md:text-2xl ${theme === 'dark' ? 'text-gray-300' : 'text-gray-600'} mb-4`}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
          >
            Advanced Space Exploration Command Center
          </motion.p>          <motion.div 
            className={`text-sm ${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'} flex items-center justify-center gap-2`}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.7 }}
          >
            <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
            Mission Status: OPERATIONAL
          </motion.div>
        </div>
      </motion.div>      {/* Enhanced Category Grid with Inline Subcategories */}
      <div className="space-y-8 mb-12">
        {Object.entries(categories).map(([key, category], index) => {
          const categoryItems = navigationItems.filter(item => item.category === key);
          const isSelected = selectedCategory === key;
          
          return (
            <motion.div
              key={key}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1, duration: 0.6 }}
              className="space-y-4"
            >
              {/* Category Header */}
              <motion.div
                onClick={() => setSelectedCategory(isSelected ? null : key)}
                className={`
                  group relative p-6 rounded-2xl cursor-pointer transition-all duration-500
                  ${theme === 'dark' 
                    ? 'bg-white/5 hover:bg-white/10 border border-white/10 hover:border-white/20' 
                    : 'bg-black/5 hover:bg-black/10 border border-black/10 hover:border-black/20'
                  }
                  ${isSelected ? 'ring-2 ring-cyan-500 shadow-2xl shadow-cyan-500/25' : ''}
                  hover:shadow-2xl
                `}
                whileHover={{ scale: 1.02, y: -2 }}
              >
                {/* Glow Effect */}
                <div className={`absolute inset-0 bg-gradient-to-r ${category.color} opacity-0 group-hover:opacity-10 rounded-2xl transition-opacity duration-500`} />
                
                {/* Content */}
                <div className="relative z-10 flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <motion.div 
                      className={`w-14 h-14 rounded-xl bg-gradient-to-r ${category.color} flex items-center justify-center shadow-lg`}
                      whileHover={{ rotate: 360, scale: 1.1 }}
                      transition={{ duration: 0.6 }}
                    >
                      <category.icon className="w-7 h-7 text-white" />
                    </motion.div>
                    <div>
                      <h3 className={`text-xl font-semibold mb-1 ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
                        {category.label}
                      </h3>
                      <p className={`text-sm ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>
                        {category.description}
                      </p>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-4">
                    <div className={`px-4 py-2 rounded-full bg-gradient-to-r ${category.color} text-white text-sm font-medium shadow-lg`}>
                      {categoryItems.length} modules
                    </div>
                    <motion.div 
                      className={`w-8 h-8 rounded-full ${theme === 'dark' ? 'bg-white/10' : 'bg-black/10'} flex items-center justify-center`}
                      animate={{ rotate: isSelected ? 180 : 0 }}
                      transition={{ duration: 0.3 }}
                    >
                      <svg className={`w-4 h-4 ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                      </svg>
                    </motion.div>
                  </div>
                </div>
              </motion.div>

              {/* Inline Subcategories */}
              <AnimatePresence>
                {isSelected && (
                  <motion.div
                    initial={{ opacity: 0, height: 0, scale: 0.95 }}
                    animate={{ opacity: 1, height: 'auto', scale: 1 }}
                    exit={{ opacity: 0, height: 0, scale: 0.95 }}
                    transition={{ duration: 0.4, ease: "easeInOut" }}
                    className="pl-4"
                  >
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                      {categoryItems.map((item, itemIndex) => (
                        <motion.div
                          key={item.id}
                          initial={{ opacity: 0, x: -20, scale: 0.9 }}
                          animate={{ opacity: 1, x: 0, scale: 1 }}
                          transition={{ delay: itemIndex * 0.1, duration: 0.5 }}
                          whileHover={{ scale: 1.05, y: -5 }}
                          onClick={() => setActiveTab(item.id)}
                          className={`
                            group relative p-5 rounded-xl cursor-pointer transition-all duration-500
                            ${theme === 'dark' 
                              ? 'bg-white/10 hover:bg-white/15 border border-white/20 hover:border-white/30' 
                              : 'bg-black/10 hover:bg-black/15 border border-black/20 hover:border-black/30'
                            }
                            hover:shadow-xl hover:${item.glow}
                          `}
                        >
                          {/* Module Glow */}
                          <div className={`absolute inset-0 bg-gradient-to-r ${item.color} opacity-0 group-hover:opacity-15 rounded-xl transition-all duration-500`} />
                          
                          {/* Content */}
                          <div className="relative z-10">
                            <motion.div 
                              className={`w-12 h-12 rounded-lg bg-gradient-to-r ${item.color} flex items-center justify-center mb-3 shadow-md`}
                              whileHover={{ rotate: 360, scale: 1.1 }}
                              transition={{ duration: 0.6 }}
                            >
                              <item.icon className="w-6 h-6 text-white" />
                            </motion.div>
                            <h4 className={`text-base font-semibold mb-2 ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
                              {item.label}
                            </h4>
                            <p className={`text-xs ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'} mb-3 line-clamp-2`}>
                              {item.description}
                            </p>
                            <motion.div 
                              className={`text-xs px-3 py-1 rounded-full bg-gradient-to-r ${item.color} text-white inline-flex items-center gap-1 font-medium shadow-md`}
                              whileHover={{ scale: 1.05 }}
                            >
                              <Rocket className="w-3 h-3" />
                              Launch →
                            </motion.div>
                          </div>
                        </motion.div>
                      ))}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          );
        })}      </div>

      {/* Data Connection Lines */}
      <div className="fixed inset-0 pointer-events-none z-15 overflow-hidden">
        {Array.from({ length: 5 }).map((_, i) => (
          <motion.div
            key={`line-${i}`}
            className="absolute h-px bg-gradient-to-r from-transparent via-blue-400/30 to-transparent"
            style={{
              left: `${20 + i * 15}%`,
              top: `${30 + i * 20}%`,
              width: '40%',
              transform: `rotate(${i * 15}deg)`,
            }}
            animate={{
              opacity: [0.3, 0.8, 0.3],
              scaleX: [0.8, 1.2, 0.8],
            }}
            transition={{
              duration: 3,
              repeat: Infinity,
              delay: i * 0.5,
            }}
          />
        ))}
      </div>

      {/* Enhanced Quick Stats */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.8, duration: 0.6 }}
        className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-12"
      >
        {[
          { label: 'Active Missions', value: '13', color: 'text-cyan-400', icon: Rocket, bg: 'from-cyan-500/20 to-blue-500/20' },
          { label: 'Systems Online', value: '100%', color: 'text-green-400', icon: Shield, bg: 'from-green-500/20 to-emerald-500/20' },
          { label: 'Data Streams', value: '24/7', color: 'text-blue-400', icon: Activity, bg: 'from-blue-500/20 to-indigo-500/20' },
          { label: 'Global Access', value: '∞', color: 'text-purple-400', icon: Globe, bg: 'from-purple-500/20 to-pink-500/20' }
        ].map((stat, index) => (
          <motion.div 
            key={index} 
            className={`text-center p-6 rounded-xl ${theme === 'dark' ? 'bg-white/5' : 'bg-black/5'} border ${theme === 'dark' ? 'border-white/10' : 'border-black/10'} group hover:scale-105 transition-all duration-300`}
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 1 + index * 0.1, duration: 0.5 }}
            whileHover={{ y: -5 }}
          >
            {/* Glow Background */}
            <div className={`absolute inset-0 bg-gradient-to-r ${stat.bg} opacity-0 group-hover:opacity-100 rounded-xl transition-opacity duration-300`} />
            
            {/* Content */}
            <div className="relative z-10">
              <motion.div 
                className={`w-8 h-8 ${stat.color} mx-auto mb-3`}
                whileHover={{ rotate: 360 }}
                transition={{ duration: 0.6 }}
              >
                <stat.icon className="w-full h-full" />
              </motion.div>
              <motion.div 
                className={`text-3xl font-bold ${stat.color} mb-1`}
                whileHover={{ scale: 1.1 }}
              >
                {stat.value}
              </motion.div>
              <div className={`text-sm ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>
                {stat.label}
              </div>
            </div>
          </motion.div>
        ))}
      </motion.div>
    </div>
  );

  return (
    <div className={`min-h-screen relative overflow-hidden ${theme}`}>
      {/* Background */}
      <div className="fixed inset-0 z-0">
        <SpaceBackground3D />
      </div>
      
      {/* Futuristic gradient overlay */}
      <div className={`fixed inset-0 z-10 pointer-events-none ${
        theme === 'dark' 
          ? 'bg-gradient-to-br from-slate-900/80 via-blue-900/60 to-purple-900/80' 
          : 'bg-gradient-to-br from-blue-50/80 via-cyan-50/60 to-purple-50/80'
      }`} />
        {/* Enhanced Header */}
      <motion.header 
        className={`fixed top-0 left-0 right-0 z-50 backdrop-blur-xl border-b ${
          theme === 'dark' ? 'border-white/10 bg-black/20' : 'border-black/10 bg-white/20'
        }`}
        initial={{ y: -100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
      >
        <div className="px-6 py-4 flex items-center justify-between">
          <motion.div 
            className="flex items-center gap-3"
            whileHover={{ scale: 1.05 }}
          >
            <motion.div 
              className="p-2 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 shadow-lg"
              animate={{ 
                boxShadow: [
                  '0 0 20px rgba(59, 130, 246, 0.5)',
                  '0 0 40px rgba(59, 130, 246, 0.8)',
                  '0 0 20px rgba(59, 130, 246, 0.5)'
                ]
              }}
              transition={{ duration: 2, repeat: Infinity }}
            >
              <Rocket className="w-6 h-6 text-white" />
            </motion.div>
            <div>
              <h1 className={`text-xl font-bold ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
                Space Hub
              </h1>
              <p className={`text-xs ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>
                Mission Command Center
              </p>
            </div>
          </motion.div>
          
          <div className="flex items-center gap-4">
            {activeTab !== 'dashboard' && (
              <motion.button
                onClick={() => setActiveTab('dashboard')}
                className={`px-4 py-2 rounded-xl transition-all ${
                  theme === 'dark' 
                    ? 'bg-white/10 hover:bg-white/20 text-white' 
                    : 'bg-black/10 hover:bg-black/20 text-black'
                }`}
                whileHover={{ scale: 1.05, x: -2 }}
                whileTap={{ scale: 0.95 }}
              >
                ← Command Center
              </motion.button>
            )}
            
            <motion.button
              onClick={toggleTheme}
              className={`p-3 rounded-xl transition-all ${
                theme === 'dark' 
                  ? 'bg-white/10 hover:bg-white/20 text-white' 
                  : 'bg-black/10 hover:bg-black/20 text-black'
              }`}
              whileHover={{ scale: 1.05, rotate: 180 }}
              whileTap={{ scale: 0.95 }}
            >
              {theme === 'dark' ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
            </motion.button>
          </div>
        </div>
      </motion.header>{/* Main Content */}
      <main className="relative z-20 pt-20">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          {renderActiveComponent()}
        </motion.div>
      </main>
    </div>
  );
};

export default FuturisticIndex;
