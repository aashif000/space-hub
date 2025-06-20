import React, { useState, useRef, useEffect, useMemo, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useSpaceData } from '../contexts/DataContext';
import { useTheme } from '../contexts/ThemeContext';
import { useSiteTour } from '../hooks/use-site-tour-new';
import { useSound, initSoundOnInteraction } from '../lib/soundManager';
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
import VibrantAnimatedBackground from '../components/ui/vibrant-animated-background';
import { 
  Rocket, Satellite, Globe, Users, Activity, Search, Star, Shield,
  Newspaper, Earth, UserCheck, Baby, Zap, Command, Sun, Moon,
  Sparkles, Gamepad2, Atom, Brain, Target, BookOpen, ChevronRight, ChevronDown,
  ArrowRight, PlayCircle, Settings, Monitor, Database
} from 'lucide-react';

interface NavigationItem {
  id: string;
  label: string;
  icon: any;
  component: React.ComponentType<any>;
  description: string;
  featured?: boolean;
}

interface NavigationCategory {
  icon: any;
  color: string;
  items: NavigationItem[];
}

// Navigation categories
const navigationCategories: Record<string, NavigationCategory> = {
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
      },      { 
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

// Background components are imported from:
// - StaticSpaceBackground from '../components/ui/static-space-background-final'
// - AnimatedSpaceBackground from '../components/ui/animated-space-background'

export default function FuturisticIndex() {
  const { allDataLoaded } = useSpaceData();
  const { theme, toggleTheme, mounted } = useTheme();
  const { playSound } = useSound();
  const [activeTab, setActiveTab] = useState('hub');
  const [expandedCategory, setExpandedCategory] = useState<string | null>('Mission Command');
  const [isLoading, setIsLoading] = useState(true);

  // Initialize sound system on component mount
  useEffect(() => {
    initSoundOnInteraction();
  }, []);  // Tour steps configuration - comprehensive feature tour
  const tourSteps = [
    {
      target: 'body',
      content: 'Welcome to NEXUS Space Hub! 🚀 This is your ultimate command center for space exploration. We connect to live APIs from NASA, SpaceX, ESA, and more. Let me show you what makes us special!',
      placement: 'center' as const,
      disableBeacon: true,
    },
    {
      target: '.hub-title',
      content: '🌟 NEXUS Space Hub aggregates real-time space data from multiple agencies. We provide live satellite tracking, mission updates, space weather, and educational content all in one place!',
      placement: 'bottom' as const,
    },
    {
      target: '.featured-missions',
      content: '⭐ Featured Missions: These are our most popular tools! Click "Mission Control" for live space analytics, "Kids Zone" for educational games, "SpaceX Dashboard" for rocket tracking, and "Solar System" for 3D exploration.',
      placement: 'bottom' as const,
    },
    {
      target: 'body',
      content: '� Mission Control Features:\n• Real-time ISS tracking with live position\n• Space weather monitoring (solar flares, radiation)\n• Astronaut database with current crew info\n• Advanced space analytics dashboard\n• Live mission status updates',
      placement: 'center' as const,
    },
    {
      target: 'body',
      content: '🚀 SpaceX Intelligence:\n• Live launch countdown timers\n• Rocket landing predictions\n• Starship test flight tracking\n• Crew Dragon mission status\n• Falcon 9 reusability stats\n• Direct SpaceX API integration',
      placement: 'center' as const,
    },
    {
      target: 'body',
      content: '🌌 Space Exploration Tools:\n• Real-time satellite tracking (ISS, Hubble, etc.)\n• Interactive 3D solar system with realistic physics\n• Exoplanet discovery database (4000+ planets)\n• Mars weather reports from NASA Perseverance\n• Live space weather alerts',
      placement: 'center' as const,
    },
    {
      target: 'body',
      content: '👶 Kids Zone - Learning Made Fun:\n• Interactive space quizzes with 20+ questions\n• Memory matching games with space themes\n• Digital drawing pad for space art\n• Sound effects for engagement\n• Educational content for ages 6-12',
      placement: 'center' as const,
    },
    {
      target: 'body',
      content: '📊 Data Intelligence:\n• Copernicus Earth observation data\n• Space population growth tracking\n• Aggregate spaceflight news from 10+ sources\n• Launch statistics and trends\n• Satellite constellation analysis',
      placement: 'center' as const,
    },
    {
      target: 'body',
      content: '🤖 AstroAgent AI Assistant:\n• Ask any space-related questions\n• Get explanations of complex space concepts\n• Receive personalized mission recommendations\n• Learn about current space events\n• Interactive space education',
      placement: 'center' as const,
    },
    {
      target: '.mission-categories',
      content: '📂 Mission Categories: Click to expand each category and see all available tools. Each tool connects to live APIs and updates in real-time. Try expanding "Space Exploration" to see satellite tracking!',
      placement: 'top' as const,
    },
    {
      target: '.theme-toggle',
      content: '🌙 Dark/Light Theme: Dark mode is perfect for astronomy sessions (reduces eye strain in dark environments), while light mode is great for daytime browsing. The entire interface adapts!',
      placement: 'left' as const,
    },
    {
      target: 'body',
      content: '🎵 Special Features:\n• Interactive sound effects (try the Kids Zone!)\n• Smooth animations and transitions\n• 3D visualizations using WebGL\n• Mobile-responsive design\n• Offline caching for key data',
      placement: 'center' as const,
    },
    {
      target: 'body',
      content: '🚀 Ready for Launch? Here\'s what to try first:\n\n1. Click "Mission Control" for live space data\n2. Explore "Solar System" for 3D planets\n3. Check "SpaceX Dashboard" for next launch\n4. Try "Kids Zone" for fun learning\n\nAll data is live and updated every few minutes!',
      placement: 'center' as const,
    },
  ];

  const { tourComponent, startTour } = useSiteTour(tourSteps, false);  const handleThemeToggle = () => {
    playSound('click');
    toggleTheme();
  };
  const handleStartTour = () => {
    console.log('Starting comprehensive feature tour...');
    playSound('sparkle');
    // Make sure we're on the hub view for the tour
    if (activeTab !== 'hub') {
      setActiveTab('hub');
    }
    // Small delay to ensure view has switched
    setTimeout(() => {
      startTour();
    }, 100);
  };

  // Enhanced tour completion handler
  const handleTourComplete = () => {
    playSound('success', { playbackRate: 1.2 });
    // Optionally show a completion message or unlock a feature
    console.log('Tour completed! User now knows all features.');
  };

  const handleTabChange = (tabId: string) => {
    playSound('click');
    setActiveTab(tabId);
  };

  useEffect(() => {
    if (allDataLoaded && mounted) {
      const timer = setTimeout(() => setIsLoading(false), 1000);
      return () => clearTimeout(timer);
    }
  }, [allDataLoaded, mounted]);

  const toggleCategory = useCallback((categoryName: string) => {
    setExpandedCategory(prev => prev === categoryName ? null : categoryName);
  }, []);

  const featuredItems = useMemo(() => {
    const featured = [];
    for (const category of Object.values(navigationCategories)) {
      featured.push(...category.items.filter(item => item.featured));
    }
    return featured;
  }, []);

  if (isLoading || !allDataLoaded || !mounted) {
    return <LoadingScreen />;
  }

  const renderActiveComponent = () => {
    for (const category of Object.values(navigationCategories)) {
      const item = category.items.find(item => item.id === activeTab);
      if (item) {
        const Component = item.component;
        return <Component />;
      }
    }
    return <FuturisticDashboard />;
  };  const FuturisticDashboard = () => (
    <div className="min-h-screen relative overflow-hidden">
      {/* Base background layer */}
      <StaticSpaceBackground />
      {/* Vibrant animated layer */}
      <VibrantAnimatedBackground />

      <div className="relative z-10 p-8">
        <motion.div 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-center mb-12"
        >          <div className="flex items-center justify-center gap-4 mb-6">
            <div className="relative">
              <Sparkles className="w-12 h-12 text-cyan-400" />
              <div className="absolute inset-0 bg-cyan-400 blur-xl opacity-30"></div>
            </div>
            <h1 className="hub-title text-5xl font-bold bg-gradient-to-r from-cyan-400 via-blue-500 to-purple-600 bg-clip-text text-transparent">
              NEXUS SPACE HUB
            </h1>
          </div>          <p className={`text-xl max-w-2xl mx-auto ${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}`}>
            Mission Status: <span className="text-green-400 font-semibold">OPERATIONAL</span>
          </p>
          <div className={`mt-4 text-sm ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>
            Advanced Space Exploration and Mission Control Center
          </div>
        </motion.div>        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="featured-missions mb-12"
        >          <h2 className={`text-2xl font-bold mb-6 flex items-center gap-3 ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
            <Target className="w-8 h-8 text-cyan-400" />
            Featured Missions
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {featuredItems.map((item, index) => {
              const Icon = item.icon;
              return (
                <motion.div
                  key={item.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.8, delay: 0.3 + index * 0.1 }}
                  className="group relative"
                >                  <div 
                    onClick={() => setActiveTab(item.id)}
                    className={`relative ${theme === 'dark' ? 'bg-gradient-to-br from-white/5 to-white/10' : 'bg-gradient-to-br from-gray-100/80 to-gray-200/60'} backdrop-blur-sm border ${theme === 'dark' ? 'border-white/20 hover:border-cyan-400/50' : 'border-gray-300/60 hover:border-cyan-400/70'} rounded-xl p-6 cursor-pointer transition-all duration-300 hover:shadow-2xl hover:shadow-cyan-500/20 hover:scale-105`}
                  >
                    <div className="flex items-start gap-4">
                      <div className="p-3 rounded-lg bg-gradient-to-r from-cyan-400 to-blue-600 shadow-lg">
                        <Icon className="w-8 h-8 text-white" />
                      </div>                      <div className="flex-1">
                        <h3 className={`text-xl font-bold mb-2 ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>{item.label}</h3>
                        <p className={`text-sm leading-relaxed ${theme === 'dark' ? 'text-gray-300' : 'text-gray-600'}`}>{item.description}</p>
                      </div>
                      <ChevronRight className={`w-5 h-5 group-hover:text-cyan-400 transition-colors ${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}`} />
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </motion.div>        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4 }}
          className="mission-categories space-y-6"
        >          <h2 className={`text-2xl font-bold mb-6 flex items-center gap-3 ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
            <Command className="w-8 h-8 text-purple-400" />
            Mission Categories
          </h2>
          
          {Object.entries(navigationCategories).map(([categoryName, category], categoryIndex) => {
            const CategoryIcon = category.icon;
            const isExpanded = expandedCategory === categoryName;
            
            return (              <motion.div
                key={categoryName}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.8, delay: 0.5 + categoryIndex * 0.1 }}
                className={`relative ${theme === 'dark' ? 'bg-gradient-to-br from-white/5 to-white/10' : 'bg-gradient-to-br from-white/70 to-gray-100/50'} backdrop-blur-sm border ${theme === 'dark' ? 'border-white/20' : 'border-gray-300/50'} rounded-xl overflow-hidden`}
              >
                <div 
                  onClick={() => toggleCategory(categoryName)}                  className={`flex items-center justify-between p-6 cursor-pointer ${theme === 'dark' ? 'hover:bg-white/5' : 'hover:bg-gray-100/50'} transition-colors duration-200`}
                >
                  <div className="flex items-center gap-4">
                    <div className={`p-3 rounded-lg bg-gradient-to-r ${category.color} shadow-lg`}>
                      <CategoryIcon className="w-6 h-6 text-white" />
                    </div>
                    <div>
                      <h3 className={`text-xl font-bold ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>{categoryName}</h3>
                      <p className={`text-sm ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>{category.items.length} missions available</p>
                    </div>
                  </div>
                  <motion.div
                    animate={{ rotate: isExpanded ? 90 : 0 }}
                    transition={{ duration: 0.2 }}
                  >
                    <ChevronRight className={`w-5 h-5 ${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}`} />
                  </motion.div>
                </div>

                <AnimatePresence>
                  {isExpanded && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      exit={{ opacity: 0, height: 0 }}
                      transition={{ duration: 0.3 }}
                      className={`border-t ${theme === 'dark' ? 'border-white/10' : 'border-gray-300/30'}`}
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
                                className={`group flex items-center gap-3 p-4 rounded-lg cursor-pointer transition-all duration-200 hover:scale-102 ${theme === 'dark' ? 'bg-white/5 hover:bg-white/10' : 'bg-gray-100/60 hover:bg-gray-200/80'}`}
                              >
                                <div className="p-2 rounded-md bg-white/10 group-hover:bg-white/20 transition-colors">
                                  <ItemIcon className="w-5 h-5 text-gray-300" />
                                </div>                                <div className="flex-1">
                                  <h4 className={`font-semibold text-sm ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>{item.label}</h4>
                                  <p className={`text-xs ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>{item.description}</p>
                                </div>
                                <ChevronRight className={`w-4 h-4 transition-colors ${theme === 'dark' ? 'text-gray-400 group-hover:text-white' : 'text-gray-500 group-hover:text-gray-900'}`} />
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
        </motion.div>        <div className="fixed bottom-8 right-8 z-50 flex flex-col gap-4">
          <button
            onClick={startTour}
            className="p-3 rounded-full bg-gradient-to-r from-green-400 to-teal-600 hover:from-green-500 hover:to-teal-700 shadow-2xl hover:shadow-xl transition-all duration-300 hover:scale-110 border-2 border-white/20"
            title="Take a site tour"
            aria-label="Take a site tour"
          >
            <BookOpen className="w-5 h-5 text-white drop-shadow-lg" />
          </button>
          <button
            onClick={toggleTheme}
            className="theme-toggle p-4 rounded-full bg-gradient-to-r from-cyan-400 to-blue-600 hover:from-cyan-500 hover:to-blue-700 shadow-2xl hover:shadow-xl transition-all duration-300 hover:scale-110 border-2 border-white/20"
            title={`Switch to ${theme === 'dark' ? 'light' : 'dark'} mode`}
            aria-label={`Switch to ${theme === 'dark' ? 'light' : 'dark'} mode`}
          >
            {theme === 'dark' ? (
              <Sun className="w-6 h-6 text-white drop-shadow-lg" />
            ) : (
              <Moon className="w-6 h-6 text-white drop-shadow-lg" />
            )}
          </button>        </div>
      </div>
    </div>
  );

  const hubView = (
    <div className="min-h-screen relative overflow-hidden">
      {/* Base background layer */}
      <StaticSpaceBackground />
      {/* Vibrant animated layer */}
      <VibrantAnimatedBackground />      <div className="relative z-10 p-8">
        <motion.div 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-center mb-12"
        >          <div className="flex items-center justify-center gap-4 mb-6">
            <div className="relative">
              <Sparkles className="w-12 h-12 text-cyan-400" />
              <div className="absolute inset-0 bg-cyan-400 blur-xl opacity-30"></div>
            </div>
            <h1 className="hub-title text-5xl font-bold bg-gradient-to-r from-cyan-400 via-blue-500 to-purple-600 bg-clip-text text-transparent">
              NEXUS SPACE HUB
            </h1>
          </div>          <p className={`text-xl max-w-2xl mx-auto ${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}`}>
            Mission Status: <span className="text-green-400 font-semibold">OPERATIONAL</span>
          </p>
          <div className={`mt-4 text-sm ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>
            Advanced Space Exploration and Mission Control Center
          </div>
        </motion.div>        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="featured-missions mb-12"
        >          <h2 className={`text-2xl font-bold mb-6 flex items-center gap-3 ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
            <Target className="w-8 h-8 text-cyan-400" />
            Featured Missions
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {featuredItems.map((item, index) => {
              const Icon = item.icon;
              return (
                <motion.div
                  key={item.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.8, delay: 0.3 + index * 0.1 }}
                  className="group relative"
                >                  <div 
                    onClick={() => setActiveTab(item.id)}
                    className={`relative ${theme === 'dark' ? 'bg-gradient-to-br from-white/5 to-white/10' : 'bg-gradient-to-br from-gray-100/80 to-gray-200/60'} backdrop-blur-sm border ${theme === 'dark' ? 'border-white/20 hover:border-cyan-400/50' : 'border-gray-300/60 hover:border-cyan-400/70'} rounded-xl p-6 cursor-pointer transition-all duration-300 hover:shadow-2xl hover:shadow-cyan-500/20 hover:scale-105`}
                  >
                    <div className="flex items-start gap-4">
                      <div className="p-3 rounded-lg bg-gradient-to-r from-cyan-400 to-blue-600 shadow-lg">
                        <Icon className="w-8 h-8 text-white" />
                      </div>                      <div className="flex-1">
                        <h3 className={`text-xl font-bold mb-2 ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>{item.label}</h3>
                        <p className={`text-sm leading-relaxed ${theme === 'dark' ? 'text-gray-300' : 'text-gray-600'}`}>{item.description}</p>
                      </div>
                      <ChevronRight className={`w-5 h-5 group-hover:text-cyan-400 transition-colors ${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}`} />
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </motion.div>        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4 }}
          className="mission-categories space-y-6"
        >          <h2 className={`text-2xl font-bold mb-6 flex items-center gap-3 ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
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
                className={`relative ${theme === 'dark' ? 'bg-gradient-to-br from-white/5 to-white/10' : 'bg-gradient-to-br from-white/70 to-gray-100/50'} backdrop-blur-sm border ${theme === 'dark' ? 'border-white/20' : 'border-gray-300/50'} rounded-xl overflow-hidden`}
              >
                <div 
                  onClick={() => toggleCategory(categoryName)}
                  className={`flex items-center justify-between p-6 cursor-pointer ${theme === 'dark' ? 'hover:bg-white/5' : 'hover:bg-gray-100/50'} transition-colors duration-200`}
                >
                  <div className="flex items-center gap-4">
                    <div className={`p-3 rounded-lg bg-gradient-to-r ${category.color} shadow-lg`}>
                      <CategoryIcon className="w-6 h-6 text-white" />
                    </div>
                    <div>
                      <h3 className={`text-xl font-bold ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>{categoryName}</h3>
                      <p className={`text-sm ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>{category.items.length} missions available</p>
                    </div>
                  </div>
                  <motion.div
                    animate={{ rotate: isExpanded ? 90 : 0 }}
                    transition={{ duration: 0.2 }}
                  >
                    <ChevronRight className={`w-5 h-5 ${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}`} />
                  </motion.div>
                </div>

                <AnimatePresence>
                  {isExpanded && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      exit={{ opacity: 0, height: 0 }}
                      transition={{ duration: 0.3 }}
                      className={`border-t ${theme === 'dark' ? 'border-white/10' : 'border-gray-300/30'}`}
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
                                className={`group flex items-center gap-3 p-4 rounded-lg cursor-pointer transition-all duration-200 hover:scale-102 ${theme === 'dark' ? 'bg-white/5 hover:bg-white/10' : 'bg-gray-100/60 hover:bg-gray-200/80'}`}
                              >
                                <div className="p-2 rounded-lg bg-gradient-to-r from-cyan-400 to-blue-500 shadow-md">
                                  <ItemIcon className="w-5 h-5 text-white" />
                                </div>
                                <div className="flex-1">
                                  <h4 className={`font-semibold ${theme === 'dark' ? 'text-white group-hover:text-cyan-400' : 'text-gray-900 group-hover:text-cyan-600'} transition-colors`}>{item.label}</h4>
                                  <p className={`text-xs ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>{item.description}</p>
                                </div>
                                <ArrowRight className="w-4 h-4 text-cyan-400 opacity-0 group-hover:opacity-100 transition-opacity" />
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
        </motion.div>        <div className="fixed bottom-8 right-8 z-50 flex flex-col gap-4">
          <button
            onClick={startTour}
            className="p-3 rounded-full bg-gradient-to-r from-green-400 to-teal-600 hover:from-green-500 hover:to-teal-700 shadow-2xl hover:shadow-xl transition-all duration-300 hover:scale-110 border-2 border-white/20"
            title="Take a site tour"
            aria-label="Take a site tour"
          >            <BookOpen className="w-5 h-5 text-white drop-shadow-lg" />
          </button>
          <button
            onClick={handleThemeToggle}
            onMouseEnter={() => playSound('hover')}
            className="theme-toggle p-4 rounded-full bg-gradient-to-r from-cyan-400 to-blue-600 hover:from-cyan-500 hover:to-blue-700 shadow-2xl hover:shadow-xl transition-all duration-300 hover:scale-110 border-2 border-white/20"
            title={`Switch to ${theme === 'dark' ? 'light' : 'dark'} mode`}
            aria-label={`Switch to ${theme === 'dark' ? 'light' : 'dark'} mode`}
          >
            {theme === 'dark' ? (
              <Sun className="w-6 h-6 text-white drop-shadow-lg" />
            ) : (
              <Moon className="w-6 h-6 text-white drop-shadow-lg" />
            )}
          </button>
        </div>
      </div>
    </div>
  );

  if (activeTab === 'dashboard') {
    return (
      <>
        <FuturisticDashboard />
        {tourComponent}
      </>
    );
  }

  return (
    <>
      {activeTab === 'hub' ? hubView : (
        <div className="min-h-screen relative overflow-hidden">
          {/* Base background layer */}
          <StaticSpaceBackground />
          {/* Vibrant animated layer */}
          <VibrantAnimatedBackground />

          <button
            onClick={() => setActiveTab('hub')}
            className="fixed top-8 left-8 z-30 flex items-center gap-2 px-4 py-2 bg-white/10 backdrop-blur-sm border border-white/20 rounded-lg text-white hover:bg-white/20 transition-all duration-200"
          >
            <ChevronRight className="w-4 h-4 rotate-180" />
            Back to Hub
          </button>          <button
            onClick={toggleTheme}
            className="theme-toggle fixed bottom-8 right-8 z-30 p-4 rounded-full bg-gradient-to-r from-cyan-400 to-blue-600 hover:from-cyan-500 hover:to-blue-700 shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-110"
          >
            {theme === 'dark' ? (
              <Sun className="w-6 h-6 text-white" />
            ) : (
              <Moon className="w-6 h-6 text-white" />
            )}
          </button>

          {/* Tour button for non-hub views */}
          <button
            onClick={handleStartTour}
            className="fixed bottom-24 right-8 z-30 p-3 rounded-full bg-gradient-to-r from-green-400 to-teal-600 hover:from-green-500 hover:to-teal-700 shadow-2xl hover:shadow-xl transition-all duration-300 hover:scale-110 border-2 border-white/20"
            title="Take a site tour"
            aria-label="Take a site tour"
          >
            <BookOpen className="w-5 h-5 text-white drop-shadow-lg" />
          </button><div className="relative z-10">
            {renderActiveComponent()}
          </div>
        </div>
      )}
      {tourComponent}
    </>
  );
}
