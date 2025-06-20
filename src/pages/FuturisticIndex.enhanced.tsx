import React, { useState, useRef, useEffect } from 'react';
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
import StaticSpaceBackground from '../components/ui/static-space-background-final';

import { 
  Rocket, Satellite, Globe, Users, Activity, Search, Star, Shield,
  Newspaper, Earth, UserCheck, Baby, Zap, Command, Sun, Moon,
  Sparkles, Gamepad2, Atom, Brain, Target, BookOpen, ChevronRight, ChevronDown,
  ArrowRight, PlayCircle, Settings, Monitor, Database
} from 'lucide-react';

// ENHANCED Navigation with Better Organization
const missionCategories = {
  'Command Center': {
    icon: Command,
    color: 'from-cyan-400 via-blue-500 to-purple-600',
    glow: 'shadow-cyan-500/30',
    description: 'Central mission control and AI systems',
    items: [
      { 
        id: 'mission-control', 
        label: 'Mission Control', 
        icon: Sparkles, 
        component: EnhancedDashboard,
        description: 'Advanced space mission command center with real-time telemetry',
        featured: true,
        status: 'OPERATIONAL',
        priority: 'critical'
      },
      { 
        id: 'astro-agent', 
        label: 'AstroAgent AI', 
        icon: Brain, 
        component: AstroAgentApp,
        description: 'AI-powered space exploration and analysis assistant',
        featured: true,
        status: 'ACTIVE',
        priority: 'high'
      },
      { 
        id: 'spacex', 
        label: 'SpaceX Operations', 
        icon: Rocket, 
        component: EnhancedSpaceXDashboard,
        description: 'SpaceX mission tracking and launch analytics',
        status: 'ACTIVE',
        priority: 'high'
      },
      { 
        id: 'space-weather', 
        label: 'Space Weather Monitor', 
        icon: Activity, 
        component: SpaceWeatherMonitor,
        description: 'Real-time space weather and solar activity monitoring',
        status: 'MONITORING',
        priority: 'medium'
      }
    ]
  },
  'Deep Space': {
    icon: Globe,
    color: 'from-purple-400 via-pink-500 to-red-500',
    glow: 'shadow-purple-500/30',
    description: 'Exploration beyond our solar system',
    items: [
      { 
        id: 'solar-system', 
        label: 'Solar System Explorer', 
        icon: Sun, 
        component: SolarSystemExplorer,
        description: 'Interactive 3D exploration of our solar system',
        status: 'ACTIVE',
        priority: 'high'
      },
      { 
        id: 'exoplanets', 
        label: 'Exoplanet Discovery', 
        icon: Earth, 
        component: ExoplanetExplorer,
        description: 'Discover worlds beyond our solar system',
        status: 'SCANNING',
        priority: 'medium'
      },
      { 
        id: 'satellite-tracker', 
        label: 'Live Satellite Tracking', 
        icon: Satellite, 
        component: SatelliteTracker,
        description: 'Real-time satellite and ISS position tracking',
        status: 'TRACKING',
        priority: 'high'
      },
      { 
        id: 'earth-observation', 
        label: 'Earth Observation', 
        icon: Globe, 
        component: CopernicusDataExplorer,
        description: 'Earth monitoring via Copernicus satellite network',
        status: 'OBSERVING',
        priority: 'medium'
      }
    ]
  },
  'Research Database': {
    icon: Database,
    color: 'from-green-400 via-emerald-500 to-teal-600',
    glow: 'shadow-green-500/30',
    description: 'Comprehensive space research archives',
    items: [
      { 
        id: 'launches', 
        label: 'Launch Archive', 
        icon: Rocket, 
        component: LaunchLibraryExplorer,
        description: 'Complete historical and upcoming launch database',
        status: 'ARCHIVED',
        priority: 'medium'
      },
      { 
        id: 'astronauts', 
        label: 'Astronaut Registry', 
        icon: UserCheck, 
        component: AstronautDatabase,
        description: 'Comprehensive astronaut profiles and mission records',
        status: 'CATALOGED',
        priority: 'medium'
      },
      { 
        id: 'space-news', 
        label: 'Space Intelligence', 
        icon: Newspaper, 
        component: SpaceflightNewsExplorer,
        description: 'Latest spaceflight news and mission updates',
        status: 'UPDATING',
        priority: 'low'
      },
      { 
        id: 'space-population', 
        label: 'Space Population', 
        icon: Users, 
        component: SpacePopulationTracker,
        description: 'Track humans currently in space',
        status: 'MONITORING',
        priority: 'low'
      }
    ]
  },
  'Training Academy': {
    icon: BookOpen,
    color: 'from-orange-400 via-yellow-500 to-red-600',
    glow: 'shadow-orange-500/30',
    description: 'Educational and training programs',
    items: [
      { 
        id: 'kids-zone', 
        label: 'Cadet Training Zone', 
        icon: Baby, 
        component: KidsZone,
        description: 'Interactive space games and educational content',
        status: 'TRAINING',
        priority: 'medium'
      }
    ]
  }
};

// Enhanced Static Effects - NO REFRESH ANIMATIONS
const StaticEnhancedEffects = () => {
  // Pre-generate all static elements
  const staticElements = React.useMemo(() => {
    const particles = Array.from({ length: 35 }, (_, i) => ({
      id: i,
      x: Math.random() * 100,
      y: Math.random() * 100,
      size: Math.random() * 3 + 1,
      color: ['#06b6d4', '#3b82f6', '#8b5cf6', '#ec4899', '#10b981'][i % 5],
      opacity: Math.random() * 0.8 + 0.2,
      blur: Math.random() * 2 + 1
    }));

    const dataConnections = Array.from({ length: 8 }, (_, i) => ({
      id: i,
      x1: Math.random() * 100,
      y1: Math.random() * 100,
      x2: Math.random() * 100,
      y2: Math.random() * 100,
      color: ['#06b6d4', '#8b5cf6', '#ec4899'][i % 3]
    }));

    const holographicGrid = Array.from({ length: 15 }, (_, i) => ({
      id: i,
      x: (i % 5) * 20,
      y: Math.floor(i / 5) * 33.33,
      opacity: Math.random() * 0.3 + 0.1
    }));

    return { particles, dataConnections, holographicGrid };
  }, []);

  return (
    <>
      {/* Enhanced Static Background */}
      <StaticSpaceBackground />
      
      {/* Holographic Grid Overlay */}
      <div className="fixed inset-0 pointer-events-none z-5">
        <svg className="w-full h-full" style={{ opacity: 0.15 }}>
          <defs>
            <pattern id="grid" width="100" height="100" patternUnits="userSpaceOnUse">
              <path d="M 100 0 L 0 0 0 100" fill="none" stroke="url(#gridGradient)" strokeWidth="0.5"/>
            </pattern>
            <linearGradient id="gridGradient" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#06b6d4" stopOpacity="0.3"/>
              <stop offset="50%" stopColor="#8b5cf6" stopOpacity="0.2"/>
              <stop offset="100%" stopColor="#ec4899" stopOpacity="0.1"/>
            </linearGradient>
          </defs>
          <rect width="100%" height="100%" fill="url(#grid)" />
        </svg>
      </div>

      {/* Enhanced Static Particles */}
      <div className="fixed inset-0 pointer-events-none z-5">
        {staticElements.particles.map((particle) => (
          <div
            key={particle.id}
            className="absolute rounded-full"
            style={{
              left: `${particle.x}%`,
              top: `${particle.y}%`,
              width: `${particle.size}px`,
              height: `${particle.size}px`,
              backgroundColor: particle.color,
              opacity: particle.opacity,
              filter: `blur(${particle.blur}px)`,
              boxShadow: `0 0 ${particle.size * 3}px ${particle.color}`
            }}
          />
        ))}
      </div>

      {/* Data Connection Lines */}
      <div className="fixed inset-0 pointer-events-none z-5">
        <svg className="w-full h-full" style={{ opacity: 0.2 }}>
          {staticElements.dataConnections.map((connection) => (
            <line
              key={connection.id}
              x1={`${connection.x1}%`}
              y1={`${connection.y1}%`}
              x2={`${connection.x2}%`}
              y2={`${connection.y2}%`}
              stroke={connection.color}
              strokeWidth="1"
              strokeDasharray="5,5"
              filter="blur(0.5px)"
            />
          ))}
        </svg>
      </div>

      {/* Static Holographic Elements */}
      <div className="fixed inset-0 pointer-events-none z-5">
        {staticElements.holographicGrid.map((element) => (
          <div
            key={element.id}
            className="absolute w-2 h-2 border border-cyan-400 rounded-full"
            style={{
              left: `${element.x}%`,
              top: `${element.y}%`,
              opacity: element.opacity,
              boxShadow: '0 0 10px rgba(6, 182, 212, 0.5)'
            }}
          />
        ))}
      </div>
    </>
  );
};

// Status Badge Component
const StatusBadge = ({ status, priority }: { status: string; priority: string }) => {
  const getStatusColor = () => {
    switch (status) {
      case 'OPERATIONAL': return 'bg-green-500/20 text-green-400 border-green-500/30';
      case 'ACTIVE': return 'bg-blue-500/20 text-blue-400 border-blue-500/30';
      case 'MONITORING': return 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30';
      case 'SCANNING': return 'bg-purple-500/20 text-purple-400 border-purple-500/30';
      case 'TRACKING': return 'bg-cyan-500/20 text-cyan-400 border-cyan-500/30';
      case 'OBSERVING': return 'bg-indigo-500/20 text-indigo-400 border-indigo-500/30';
      case 'TRAINING': return 'bg-orange-500/20 text-orange-400 border-orange-500/30';
      default: return 'bg-gray-500/20 text-gray-400 border-gray-500/30';
    }
  };

  const getPriorityIcon = () => {
    switch (priority) {
      case 'critical': return '🔴';
      case 'high': return '🟡';
      case 'medium': return '🔵';
      case 'low': return '⚪';
      default: return '';
    }
  };

  return (
    <div className={`flex items-center gap-1 px-2 py-1 text-xs rounded-full border ${getStatusColor()}`}>
      <span>{getPriorityIcon()}</span>
      <span>{status}</span>
    </div>
  );
};

export default function FuturisticIndex() {
  const { allDataLoaded } = useSpaceData();
  const { theme, toggleTheme, mounted } = useTheme();
  const [activeTab, setActiveTab] = useState('dashboard');
  const [expandedCategory, setExpandedCategory] = useState<string | null>('Command Center');
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    if (allDataLoaded && mounted) {
      const timer = setTimeout(() => setIsLoading(false), 1500);
      return () => clearTimeout(timer);
    }
  }, [allDataLoaded, mounted]);

  if (isLoading || !allDataLoaded || !mounted) {
    return <LoadingScreen />;
  }

  const renderActiveComponent = () => {
    for (const category of Object.values(missionCategories)) {
      const item = category.items.find(item => item.id === activeTab);
      if (item) {
        const Component = item.component;
        return <Component />;
      }
    }
    return <HubDashboard />;
  };

  const toggleCategory = (categoryName: string) => {
    setExpandedCategory(expandedCategory === categoryName ? null : categoryName);
  };

  const getFeaturedItems = () => {
    const featured = [];
    for (const category of Object.values(missionCategories)) {
      featured.push(...category.items.filter(item => item.featured));
    }
    return featured;
  };

  const getAllItems = () => {
    const allItems = [];
    for (const category of Object.values(missionCategories)) {
      allItems.push(...category.items);
    }
    return allItems;
  };

  const filteredItems = searchTerm 
    ? getAllItems().filter(item => 
        item.label.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.description.toLowerCase().includes(searchTerm.toLowerCase())
      )
    : [];

  const HubDashboard = () => (
    <div className="min-h-screen relative overflow-hidden">
      {/* Enhanced Static Effects */}
      <StaticEnhancedEffects />

      {/* Main Content */}
      <div className="relative z-10 p-8">
        {/* Enhanced Header */}
        <motion.div 
          initial={{ opacity: 0, y: -30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, ease: "easeOut" }}
          className="text-center mb-16"
        >
          <div className="flex items-center justify-center gap-6 mb-8">
            <div className="relative">
              <div className="absolute inset-0 bg-cyan-400 blur-2xl opacity-40 rounded-full"></div>
              <Sparkles className="w-16 h-16 text-cyan-400 relative z-10" />
              <div className="absolute inset-0 border-2 border-cyan-400/30 rounded-full"></div>
            </div>
            <div className="text-center">
              <h1 className="text-6xl font-bold bg-gradient-to-r from-cyan-400 via-blue-500 to-purple-600 bg-clip-text text-transparent mb-2">
                NEXUS SPACE HUB
              </h1>
              <div className="text-lg text-gray-300 font-medium">
                <span className="text-green-400">●</span> QUANTUM COMMAND CENTER <span className="text-green-400">●</span>
              </div>
            </div>
          </div>
          
          <div className="max-w-4xl mx-auto">
            <p className="text-xl text-gray-300 mb-6">
              Advanced Multi-Dimensional Space Exploration & Mission Control System
            </p>
            <div className="flex items-center justify-center gap-8 text-sm text-gray-400">
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                <span>Mission Status: OPERATIONAL</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-blue-400 rounded-full"></div>
                <span>Neural Network: ACTIVE</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-purple-400 rounded-full"></div>
                <span>AI Systems: ONLINE</span>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Enhanced Search */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="max-w-2xl mx-auto mb-12"
        >
          <div className="relative">
            <div className="absolute inset-0 bg-gradient-to-r from-cyan-400/20 to-purple-600/20 rounded-xl blur-xl"></div>
            <div className="relative bg-white/5 backdrop-blur-sm border border-white/20 rounded-xl p-4">
              <div className="flex items-center gap-3">
                <Search className="w-5 h-5 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search missions, systems, or databases..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="flex-1 bg-transparent text-white placeholder-gray-400 outline-none"
                />
                {searchTerm && (
                  <button
                    onClick={() => setSearchTerm('')}
                    className="text-gray-400 hover:text-white transition-colors"
                  >
                    ✕
                  </button>
                )}
              </div>
            </div>
          </div>
          
          {/* Search Results */}
          {searchTerm && filteredItems.length > 0 && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="mt-4 bg-white/5 backdrop-blur-sm border border-white/20 rounded-xl p-4"
            >
              <h3 className="text-white font-semibold mb-3">Search Results ({filteredItems.length})</h3>
              <div className="grid gap-2">
                {filteredItems.map((item) => {
                  const Icon = item.icon;
                  return (
                    <div
                      key={item.id}
                      onClick={() => {
                        setActiveTab(item.id);
                        setSearchTerm('');
                      }}
                      className="flex items-center gap-3 p-3 rounded-lg bg-white/5 hover:bg-white/10 cursor-pointer transition-all duration-200"
                    >
                      <Icon className="w-4 h-4 text-cyan-400" />
                      <div className="flex-1">
                        <div className="text-white font-medium">{item.label}</div>
                        <div className="text-gray-400 text-sm">{item.description}</div>
                      </div>
                      <StatusBadge status={item.status} priority={item.priority} />
                    </div>
                  );
                })}
              </div>
            </motion.div>
          )}
        </motion.div>

        {/* Featured Command Systems */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.3 }}
          className="mb-16"
        >
          <div className="flex items-center gap-4 mb-8">
            <Target className="w-8 h-8 text-cyan-400" />
            <h2 className="text-3xl font-bold text-white">Priority Command Systems</h2>
            <div className="flex-1 h-px bg-gradient-to-r from-cyan-400/50 to-transparent"></div>
          </div>
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {getFeaturedItems().map((item, index) => {
              const Icon = item.icon;
              return (
                <motion.div
                  key={item.id}
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.6, delay: 0.4 + index * 0.1 }}
                  className="group relative"
                >
                  <div className="absolute inset-0 bg-gradient-to-r from-cyan-400/20 to-purple-600/20 rounded-xl blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                  <div 
                    onClick={() => setActiveTab(item.id)}
                    className="relative bg-gradient-to-br from-white/5 to-white/10 backdrop-blur-sm border border-white/20 hover:border-cyan-400/50 rounded-xl p-8 cursor-pointer transition-all duration-300 hover:scale-105"
                  >
                    <div className="flex items-start gap-6">
                      <div className="relative">
                        <div className="absolute inset-0 bg-cyan-400 blur-lg opacity-30 rounded-lg"></div>
                        <div className="relative p-4 rounded-lg bg-gradient-to-r from-cyan-400 to-blue-600">
                          <Icon className="w-8 h-8 text-white" />
                        </div>
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-3">
                          <h3 className="text-2xl font-bold text-white">{item.label}</h3>
                          <StatusBadge status={item.status} priority={item.priority} />
                        </div>
                        <p className="text-gray-300 leading-relaxed mb-4">{item.description}</p>
                        <div className="flex items-center gap-2 text-cyan-400 group-hover:text-cyan-300 transition-colors">
                          <PlayCircle className="w-4 h-4" />
                          <span className="text-sm font-medium">Initialize System</span>
                          <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                        </div>
                      </div>
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </motion.div>

        {/* Mission Categories */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.5 }}
          className="space-y-8"
        >
          <div className="flex items-center gap-4 mb-8">
            <Command className="w-8 h-8 text-purple-400" />
            <h2 className="text-3xl font-bold text-white">Mission Categories</h2>
            <div className="flex-1 h-px bg-gradient-to-r from-purple-400/50 to-transparent"></div>
          </div>
          
          {Object.entries(missionCategories).map(([categoryName, category], categoryIndex) => {
            const CategoryIcon = category.icon;
            const isExpanded = expandedCategory === categoryName;
            
            return (
              <motion.div
                key={categoryName}
                initial={{ opacity: 0, x: -30 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.6, delay: 0.6 + categoryIndex * 0.1 }}
                className="relative group"
              >
                <div className={`absolute inset-0 bg-gradient-to-r ${category.color} opacity-0 group-hover:opacity-10 rounded-xl blur-xl transition-opacity duration-500`}></div>
                <div className="relative bg-gradient-to-br from-white/5 to-white/10 backdrop-blur-sm border border-white/20 rounded-xl overflow-hidden">
                  {/* Category Header */}
                  <div 
                    onClick={() => toggleCategory(categoryName)}
                    className="flex items-center justify-between p-8 cursor-pointer hover:bg-white/5 transition-colors duration-200"
                  >
                    <div className="flex items-center gap-6">
                      <div className="relative">
                        <div className={`absolute inset-0 bg-gradient-to-r ${category.color} blur-lg opacity-40 rounded-lg`}></div>
                        <div className={`relative p-4 rounded-lg bg-gradient-to-r ${category.color} ${category.glow} shadow-lg`}>
                          <CategoryIcon className="w-8 h-8 text-white" />
                        </div>
                      </div>
                      <div>
                        <h3 className="text-2xl font-bold text-white mb-2">{categoryName}</h3>
                        <p className="text-gray-400">{category.description}</p>
                        <div className="flex items-center gap-4 mt-2 text-sm text-gray-500">
                          <span>{category.items.length} systems available</span>
                          <span>•</span>
                          <span>{category.items.filter(item => item.status.includes('ACTIVE') || item.status.includes('OPERATIONAL')).length} active</span>
                        </div>
                      </div>
                    </div>
                    <motion.div
                      animate={{ rotate: isExpanded ? 90 : 0 }}
                      transition={{ duration: 0.3 }}
                      className="text-gray-400"
                    >
                      <ChevronRight className="w-6 h-6" />
                    </motion.div>
                  </div>

                  {/* Category Items */}
                  <AnimatePresence>
                    {isExpanded && (
                      <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: 0 }}
                        transition={{ duration: 0.4, ease: "easeInOut" }}
                        className="border-t border-white/10"
                      >
                        <div className="p-8 pt-6">
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            {category.items.map((item, itemIndex) => {
                              const ItemIcon = item.icon;
                              return (
                                <motion.div
                                  key={item.id}
                                  initial={{ opacity: 0, y: 10 }}
                                  animate={{ opacity: 1, y: 0 }}
                                  transition={{ duration: 0.3, delay: itemIndex * 0.05 }}
                                  onClick={() => setActiveTab(item.id)}
                                  className="group/item flex items-center gap-4 p-4 rounded-lg bg-white/5 hover:bg-white/10 cursor-pointer transition-all duration-200 hover:scale-102"
                                >
                                  <div className="relative">
                                    <div className="absolute inset-0 bg-white/20 blur-md opacity-0 group-hover/item:opacity-100 transition-opacity rounded-md"></div>
                                    <div className="relative p-3 rounded-md bg-white/10 group-hover/item:bg-white/20 transition-colors">
                                      <ItemIcon className="w-5 h-5 text-gray-300" />
                                    </div>
                                  </div>
                                  <div className="flex-1">
                                    <div className="flex items-center gap-2 mb-1">
                                      <h4 className="font-semibold text-white text-sm">{item.label}</h4>
                                      <StatusBadge status={item.status} priority={item.priority} />
                                    </div>
                                    <p className="text-gray-400 text-xs leading-relaxed">{item.description}</p>
                                  </div>
                                  <ArrowRight className="w-4 h-4 text-gray-400 group-hover/item:text-white group-hover/item:translate-x-1 transition-all" />
                                </motion.div>
                              );
                            })}
                          </div>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              </motion.div>
            );
          })}
        </motion.div>

        {/* Enhanced Theme Toggle */}
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8, delay: 1.2 }}
          className="fixed bottom-8 right-8 z-20"
        >
          <div className="relative">
            <div className="absolute inset-0 bg-gradient-to-r from-cyan-400 to-purple-600 blur-lg opacity-50 rounded-full"></div>
            <button
              onClick={toggleTheme}
              className="relative p-4 rounded-full bg-gradient-to-r from-cyan-400 to-blue-600 hover:from-cyan-500 hover:to-blue-700 shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-110 border border-white/20"
            >
              {theme === 'dark' ? (
                <Sun className="w-6 h-6 text-white" />
              ) : (
                <Moon className="w-6 h-6 text-white" />
              )}
            </button>
          </div>
        </motion.div>
      </div>
    </div>
  );

  if (activeTab === 'dashboard') {
    return <HubDashboard />;
  }

  return (
    <div className="min-h-screen relative overflow-hidden">
      {/* Enhanced Static Effects for Component Views */}
      <StaticEnhancedEffects />

      {/* Enhanced Back Button */}
      <motion.button
        initial={{ opacity: 0, x: -30 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.5 }}
        onClick={() => setActiveTab('dashboard')}
        className="fixed top-8 left-8 z-30 group"
      >
        <div className="relative">
          <div className="absolute inset-0 bg-cyan-400 blur-lg opacity-30 rounded-lg"></div>
          <div className="relative flex items-center gap-3 px-6 py-3 bg-white/10 backdrop-blur-sm border border-white/20 rounded-lg text-white hover:bg-white/20 transition-all duration-300 hover:scale-105">
            <ChevronRight className="w-5 h-5 rotate-180 group-hover:-translate-x-1 transition-transform" />
            <span className="font-medium">Return to Hub</span>
          </div>
        </div>
      </motion.button>

      {/* Enhanced Theme Toggle */}
      <motion.button
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5, delay: 0.2 }}
        onClick={toggleTheme}
        className="fixed bottom-8 right-8 z-30 group"
      >
        <div className="relative">
          <div className="absolute inset-0 bg-gradient-to-r from-cyan-400 to-purple-600 blur-lg opacity-50 rounded-full"></div>
          <div className="relative p-4 rounded-full bg-gradient-to-r from-cyan-400 to-blue-600 hover:from-cyan-500 hover:to-blue-700 shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-110 border border-white/20">
            {theme === 'dark' ? (
              <Sun className="w-6 h-6 text-white" />
            ) : (
              <Moon className="w-6 h-6 text-white" />
            )}
          </div>
        </div>
      </motion.button>

      {/* Component Content */}
      <div className="relative z-10">
        {renderActiveComponent()}
      </div>
    </div>
  );
}
