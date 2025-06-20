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

// Static particles for no animation refresh
const staticParticles = Array.from({ length: 25 }, (_, i) => ({
  id: i,
  x: Math.random() * 100,
  y: Math.random() * 100,
  size: Math.random() * 2 + 1,
  color: i % 3 === 0 ? 'bg-cyan-400' : i % 3 === 1 ? 'bg-blue-400' : 'bg-purple-400',
  opacity: Math.random() * 0.6 + 0.2
}));

// Static stars for background 
const staticStars = Array.from({ length: 100 }, (_, i) => ({
  id: i,
  x: Math.random() * 100,
  y: Math.random() * 100,
  size: Math.random() * 1.5 + 0.5,
  opacity: Math.random() * 0.8 + 0.2
}));

export default function FuturisticIndex() {
  const { allDataLoaded } = useSpaceData();
  const { theme, toggleTheme, mounted } = useTheme();
  const [activeTab, setActiveTab] = useState('dashboard');
  const [expandedCategory, setExpandedCategory] = useState<string | null>('Mission Command');
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (allDataLoaded && mounted) {
      const timer = setTimeout(() => setIsLoading(false), 1000);
      return () => clearTimeout(timer);
    }
  }, [allDataLoaded, mounted]);

  if (isLoading || !allDataLoaded || !mounted) {
    return <LoadingScreen />;
  }

  const renderActiveComponent = () => {
    // Find component across all categories
    for (const category of Object.values(navigationCategories)) {
      const item = category.items.find(item => item.id === activeTab);
      if (item) {
        const Component = item.component;
        return <Component />;
      }
    }
    return <FuturisticDashboard />;
  };

  const toggleCategory = (categoryName: string) => {
    setExpandedCategory(expandedCategory === categoryName ? null : categoryName);
  };

  const getFeaturedItems = () => {
    const featured = [];
    for (const category of Object.values(navigationCategories)) {
      featured.push(...category.items.filter(item => item.featured));
    }
    return featured;
  };

  const FuturisticDashboard = () => (
    <div className="min-h-screen relative overflow-hidden">
      {/* Static Background Effects - NO ANIMATIONS */}
      <div className="fixed inset-0 bg-gradient-to-br from-slate-950 via-blue-950 to-purple-950" />
      
      {/* Static Star Field */}
      <div className="fixed inset-0 pointer-events-none">
        {staticStars.map((star) => (
          <div
            key={star.id}
            className="absolute w-1 h-1 bg-white rounded-full"
            style={{
              left: `${star.x}%`,
              top: `${star.y}%`,
              width: `${star.size}px`,
              height: `${star.size}px`,
              opacity: star.opacity
            }}
          />
        ))}
      </div>

      {/* Static Floating Particles */}
      <div className="fixed inset-0 pointer-events-none z-5">
        {staticParticles.map((particle) => (
          <div
            key={particle.id}
            className={`absolute w-2 h-2 ${particle.color} rounded-full`}
            style={{
              left: `${particle.x}%`,
              top: `${particle.y}%`,
              width: `${particle.size}px`,
              height: `${particle.size}px`,
              opacity: particle.opacity,
              filter: 'blur(1px)'
            }}
          />
        ))}
      </div>

      {/* Main Content */}
      <div className="relative z-10 p-8">
        {/* Header */}
        <motion.div 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-center mb-12"
        >
          <div className="flex items-center justify-center gap-4 mb-6">
            <div className="relative">
              <Sparkles className="w-12 h-12 text-cyan-400" />
              <div className="absolute inset-0 bg-cyan-400 blur-xl opacity-30"></div>
            </div>
            <h1 className="text-5xl font-bold bg-gradient-to-r from-cyan-400 via-blue-500 to-purple-600 bg-clip-text text-transparent">
              SPACE HUB COMMAND
            </h1>
          </div>
          <p className="text-xl text-gray-300 max-w-2xl mx-auto">
            Mission Status: <span className="text-green-400 font-semibold">OPERATIONAL</span>
          </p>
          <div className="mt-4 text-sm text-gray-400">
            Advanced Space Exploration and Mission Control Center
          </div>
        </motion.div>

        {/* Featured Missions */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="mb-12"
        >
          <h2 className="text-2xl font-bold text-white mb-6 flex items-center gap-3">
            <Target className="w-8 h-8 text-cyan-400" />
            Featured Missions
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {getFeaturedItems().map((item, index) => {
              const Icon = item.icon;
              return (
                <motion.div
                  key={item.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.8, delay: 0.3 + index * 0.1 }}
                  className="group relative"
                >
                  <div 
                    onClick={() => setActiveTab(item.id)}
                    className="relative bg-gradient-to-br from-white/5 to-white/10 backdrop-blur-sm border border-white/20 hover:border-cyan-400/50 rounded-xl p-6 cursor-pointer transition-all duration-300 hover:shadow-2xl hover:shadow-cyan-500/20 hover:scale-105"
                  >
                    <div className="flex items-start gap-4">
                      <div className="p-3 rounded-lg bg-gradient-to-r from-cyan-400 to-blue-600 shadow-lg">
                        <Icon className="w-8 h-8 text-white" />
                      </div>
                      <div className="flex-1">
                        <h3 className="text-xl font-bold text-white mb-2">{item.label}</h3>
                        <p className="text-gray-300 text-sm leading-relaxed">{item.description}</p>
                      </div>
                      <ChevronRight className="w-5 h-5 text-gray-400 group-hover:text-cyan-400 transition-colors" />
                    </div>
                    <div className="absolute inset-0 bg-gradient-to-r from-cyan-400/0 via-cyan-400/5 to-cyan-400/0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-xl"></div>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </motion.div>

        {/* Navigation Categories */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4 }}
          className="space-y-6"
        >
          <h2 className="text-2xl font-bold text-white mb-6 flex items-center gap-3">
            <Command className="w-8 h-8 text-purple-400" />
            Mission Categories
          </h2>
          
          {Object.entries(navigationCategories).map(([categoryName, category], categoryIndex) => {
            const CategoryIcon = category.icon;
            const isExpanded = expandedCategory === categoryName;
            
            return (
              <motion.div
                key={categoryName}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.8, delay: 0.5 + categoryIndex * 0.1 }}
                className="relative bg-gradient-to-br from-white/5 to-white/10 backdrop-blur-sm border border-white/20 rounded-xl overflow-hidden"
              >
                {/* Category Header */}
                <div 
                  onClick={() => toggleCategory(categoryName)}
                  className="flex items-center justify-between p-6 cursor-pointer hover:bg-white/5 transition-colors duration-200"
                >
                  <div className="flex items-center gap-4">
                    <div className={`p-3 rounded-lg bg-gradient-to-r ${category.color} shadow-lg`}>
                      <CategoryIcon className="w-6 h-6 text-white" />
                    </div>
                    <div>
                      <h3 className="text-xl font-bold text-white">{categoryName}</h3>
                      <p className="text-gray-400 text-sm">{category.items.length} missions available</p>
                    </div>
                  </div>
                  <motion.div
                    animate={{ rotate: isExpanded ? 90 : 0 }}
                    transition={{ duration: 0.2 }}
                  >
                    <ChevronRight className="w-5 h-5 text-gray-400" />
                  </motion.div>
                </div>

                {/* Category Items */}
                <AnimatePresence>
                  {isExpanded && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      exit={{ opacity: 0, height: 0 }}
                      transition={{ duration: 0.3 }}
                      className="border-t border-white/10"
                    >
                      <div className="p-6 pt-0">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                          {category.items.map((item, itemIndex) => {
                            const ItemIcon = item.icon;
                            return (
                              <motion.div
                                key={item.id}
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.3, delay: itemIndex * 0.05 }}
                                onClick={() => setActiveTab(item.id)}
                                className="group flex items-center gap-3 p-4 rounded-lg bg-white/5 hover:bg-white/10 cursor-pointer transition-all duration-200 hover:scale-102"
                              >
                                <div className="p-2 rounded-md bg-white/10 group-hover:bg-white/20 transition-colors">
                                  <ItemIcon className="w-5 h-5 text-gray-300" />
                                </div>
                                <div className="flex-1">
                                  <h4 className="font-semibold text-white text-sm">{item.label}</h4>
                                  <p className="text-gray-400 text-xs">{item.description}</p>
                                </div>
                                <ChevronRight className="w-4 h-4 text-gray-400 group-hover:text-white transition-colors" />
                              </motion.div>
                            );
                          })}
                        </div>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            );
          })}
        </motion.div>

        {/* Theme Toggle */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8, delay: 1 }}
          className="fixed bottom-8 right-8 z-20"
        >
          <button
            onClick={toggleTheme}
            className="p-4 rounded-full bg-gradient-to-r from-cyan-400 to-blue-600 hover:from-cyan-500 hover:to-blue-700 shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-110"
          >
            {theme === 'dark' ? (
              <Sun className="w-6 h-6 text-white" />
            ) : (
              <Moon className="w-6 h-6 text-white" />
            )}
          </button>
        </motion.div>
      </div>
    </div>
  );

  if (activeTab === 'dashboard') {
    return <FuturisticDashboard />;
  }

  return (
    <div className="min-h-screen relative overflow-hidden">
      {/* Static Background */}
      <div className="fixed inset-0 bg-gradient-to-br from-slate-950 via-blue-950 to-purple-950" />
      
      {/* Static Star Field */}
      <div className="fixed inset-0 pointer-events-none">
        {staticStars.map((star) => (
          <div
            key={star.id}
            className="absolute w-1 h-1 bg-white rounded-full"
            style={{
              left: `${star.x}%`,
              top: `${star.y}%`,
              width: `${star.size}px`,
              height: `${star.size}px`,
              opacity: star.opacity
            }}
          />
        ))}
      </div>

      {/* Back Button */}
      <motion.button
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.5 }}
        onClick={() => setActiveTab('dashboard')}
        className="fixed top-8 left-8 z-30 flex items-center gap-2 px-4 py-2 bg-white/10 backdrop-blur-sm border border-white/20 rounded-lg text-white hover:bg-white/20 transition-all duration-200"
      >
        <ChevronRight className="w-4 h-4 rotate-180" />
        Back to Hub
      </motion.button>

      {/* Theme Toggle */}
      <motion.button
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5, delay: 0.2 }}
        onClick={toggleTheme}
        className="fixed bottom-8 right-8 z-30 p-4 rounded-full bg-gradient-to-r from-cyan-400 to-blue-600 hover:from-cyan-500 hover:to-blue-700 shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-110"
      >
        {theme === 'dark' ? (
          <Sun className="w-6 h-6 text-white" />
        ) : (
          <Moon className="w-6 h-6 text-white" />
        )}
      </motion.button>

      {/* Component Content */}
      <div className="relative z-10">
        {renderActiveComponent()}
      </div>
    </div>
  );
}
