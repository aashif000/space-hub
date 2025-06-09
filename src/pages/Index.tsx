import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useSpaceData } from '../contexts/DataContext';
import { useTheme } from '../contexts/ThemeContext';
import LoadingScreen from '../components/LoadingScreen';
import Dashboard from '../components/Dashboard';
import EnhancedDashboard from '../components/EnhancedDashboard';
import AstroAgentApp from '../components/AstroAgentApp';
import KidsZone from '../components/KidsZone';
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
import { ModernWelcome } from '../components/ModernWelcome';
import SpaceBackground3D from '../components/ui/space-background-3d';
import { 
  Rocket, 
  Satellite, 
  Globe, 
  Users, 
  Activity, 
  Search, 
  Star, 
  Shield,
  Newspaper,
  Earth,
  UserCheck,
  Home,
  Baby,
  Zap,
  Menu,
  X,
  ChevronDown,
  Sparkles,
  Command,
  Sun,
  Moon
} from 'lucide-react';

const Index = () => {
  const { allDataLoaded } = useSpaceData();
  const { theme, toggleTheme, mounted } = useTheme();
  const [activeTab, setActiveTab] = useState('welcome');
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [hoveredItem, setHoveredItem] = useState<string | null>(null);
  const [currentTime, setCurrentTime] = useState(new Date());
  const [showWelcome, setShowWelcome] = useState(true);

  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  // Prevent rendering until both data and theme are ready
  if (!allDataLoaded || !mounted) {
    return <LoadingScreen />;
  }

  const handleGetStarted = () => {
    setShowWelcome(false);
    setActiveTab('home');
  };

  const navigationItems = [
    { 
      id: 'home', 
      label: 'AstroAgent Enhanced', 
      icon: Zap, 
      component: AstroAgentApp,
      color: 'from-purple-500 to-pink-500',
      bgColor: 'bg-purple-500/20',
      borderColor: 'border-purple-500/50',
      description: 'Advanced 3D space exploration',
      category: 'featured'
    },
    { 
      id: 'classic-dashboard', 
      label: 'Mission Control', 
      icon: Home, 
      component: EnhancedDashboard,
      color: 'from-blue-500 to-cyan-500',
      bgColor: 'bg-blue-500/20',
      borderColor: 'border-blue-500/50',
      description: 'Classic mission dashboard',
      category: 'control'
    },
    { 
      id: 'spacex', 
      label: 'SpaceX Hub', 
      icon: Rocket, 
      component: EnhancedSpaceXDashboard,
      color: 'from-orange-500 to-red-500',
      bgColor: 'bg-orange-500/20',
      borderColor: 'border-orange-500/50',
      description: 'Falcon 9, Dragon & Starship data',
      category: 'exploration'
    },
    { 
      id: 'solar-system', 
      label: 'Solar Explorer', 
      icon: Globe, 
      component: SolarSystemExplorer,
      color: 'from-yellow-500 to-orange-500',
      bgColor: 'bg-yellow-500/20',
      borderColor: 'border-yellow-500/50',
      description: '3D planetary exploration',
      category: 'exploration'
    },
    { 
      id: 'satellites', 
      label: 'Live Tracking', 
      icon: Satellite, 
      component: SatelliteTracker,
      color: 'from-green-500 to-emerald-500',
      bgColor: 'bg-green-500/20',
      borderColor: 'border-green-500/50',
      description: 'Real-time ISS & satellite data',
      category: 'tracking'
    },
    { 
      id: 'exoplanets', 
      label: 'Alien Worlds', 
      icon: Star, 
      component: ExoplanetExplorer,
      color: 'from-indigo-500 to-purple-500',
      bgColor: 'bg-indigo-500/20',
      borderColor: 'border-indigo-500/50',
      description: 'Discover distant exoplanets',
      category: 'exploration'
    },
    { 
      id: 'space-weather', 
      label: 'Solar Activity', 
      icon: Shield, 
      component: SpaceWeatherMonitor,
      color: 'from-red-500 to-pink-500',
      bgColor: 'bg-red-500/20',
      borderColor: 'border-red-500/50',
      description: 'Solar flares & space weather',
      category: 'monitoring'
    },
    { 
      id: 'astronauts', 
      label: 'Space Heroes', 
      icon: Users, 
      component: AstronautDatabase,
      color: 'from-teal-500 to-cyan-500',
      bgColor: 'bg-teal-500/20',
      borderColor: 'border-teal-500/50',
      description: 'Astronaut profiles & missions',
      category: 'database'
    },
    { 
      id: 'space-population', 
      label: 'Space Station Sim', 
      icon: UserCheck, 
      component: SpacePopulationTracker,
      color: 'from-violet-500 to-purple-500',
      bgColor: 'bg-violet-500/20',
      borderColor: 'border-violet-500/50',
      description: 'Who\'s in space right now',
      category: 'tracking'
    },
    { 
      id: 'copernicus', 
      label: 'Earth Observation', 
      icon: Earth, 
      component: CopernicusDataExplorer,
      color: 'from-blue-500 to-green-500',
      bgColor: 'bg-blue-500/20',
      borderColor: 'border-blue-500/50',
      description: 'Satellite imagery & Earth data',
      category: 'monitoring'
    },
    { 
      id: 'launch-library', 
      label: 'Launch Archive', 
      icon: Search, 
      component: LaunchLibraryExplorer,
      color: 'from-amber-500 to-orange-500',
      bgColor: 'bg-amber-500/20',
      borderColor: 'border-amber-500/50',
      description: 'Historical launch database',
      category: 'database'
    },
    { 
      id: 'news', 
      label: 'Space News', 
      icon: Newspaper, 
      component: SpaceflightNewsExplorer,
      color: 'from-gray-500 to-slate-500',
      bgColor: 'bg-gray-500/20',
      borderColor: 'border-gray-500/50',
      description: 'Latest space industry news',
      category: 'information'
    },
    { 
      id: 'kids-zone', 
      label: 'Young Explorers', 
      icon: Baby, 
      component: KidsZone,
      color: 'from-pink-500 to-rose-500',
      bgColor: 'bg-pink-500/20',
      borderColor: 'border-pink-500/50',
      description: 'Space fun for kids',
      category: 'education'
    },
    { 
      id: 'dashboard', 
      label: 'Data Explorer', 
      icon: Activity, 
      component: Dashboard,
      color: 'from-cyan-500 to-blue-500',
      bgColor: 'bg-cyan-500/20',
      borderColor: 'border-cyan-500/50',
      description: 'Advanced data visualization',
      category: 'control'
    },
  ];

  const ActiveComponent = navigationItems.find(item => item.id === activeTab)?.component || Dashboard;

  // Show welcome screen first
  if (showWelcome) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-950 via-blue-950 to-indigo-950 relative overflow-hidden">
        {/* Three.js 3D Space Background */}
        <div className="fixed inset-0 z-0">
          <SpaceBackground3D />
        </div>
        
        {/* Subtle background stars effect */}
        <div className="fixed inset-0 opacity-5 pointer-events-none z-10">
          <div className="stars-small"></div>
          <div className="stars-medium"></div>
          <div className="stars-large"></div>
        </div>

        <ModernWelcome onGetStarted={handleGetStarted} />
      </div>
    );
  }

  const categories = {
    featured: { label: 'Featured', icon: Sparkles },
    exploration: { label: 'Exploration', icon: Rocket },
    tracking: { label: 'Tracking', icon: Satellite },
    monitoring: { label: 'Monitoring', icon: Shield },
    database: { label: 'Database', icon: Search },
    control: { label: 'Control', icon: Command },
    information: { label: 'Information', icon: Newspaper },
    education: { label: 'Education', icon: Baby }  };
  return (
    <div className={`min-h-screen relative overflow-hidden transition-all duration-500 ${theme}`}>
      {/* Theme-aware background that changes with the theme */}
      <div className={`absolute inset-0 transition-all duration-500 ${
        theme === 'dark' 
          ? 'bg-gradient-to-br from-slate-950 via-blue-950 to-indigo-950' 
          : 'bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50'
      }`}></div>
      {/* Three.js 3D Space Background */}
      <div className="fixed inset-0 z-0">
        <SpaceBackground3D />
      </div>
      
      {/* Subtle background stars effect */}
      <div className={`fixed inset-0 pointer-events-none z-10 transition-opacity duration-500 ${
        theme === 'dark' ? 'opacity-5' : 'opacity-2'
      }`}>
        <div className="stars-small"></div>
        <div className="stars-medium"></div>
        <div className="stars-large"></div>
      </div>

      {/* Modern Top Navigation Bar */}
      <motion.header 
        className={`fixed top-0 left-0 right-0 z-50 backdrop-blur-xl border-b transition-all duration-500 ${
          theme === 'dark' 
            ? 'bg-slate-950/80 border-cyan-500/20' 
            : 'bg-white/80 border-indigo-200/50'
        }`}
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
      >
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            {/* Logo Section */}
            <motion.div 
              className="flex items-center gap-4 cursor-pointer"
              whileHover={{ scale: 1.05 }}
              onClick={() => setActiveTab('home')}
            >
              <div className="relative">
                <div className="w-12 h-12 bg-gradient-to-br from-cyan-400 via-blue-500 to-purple-600 rounded-xl flex items-center justify-center shadow-2xl shadow-cyan-500/30">
                  <Rocket className="w-7 h-7 text-white" />
                </div>
                <div className="absolute inset-0 w-12 h-12 bg-gradient-to-br from-cyan-400 to-purple-500 rounded-xl animate-pulse opacity-20"></div>
              </div>              <div>
                <h1 className={`text-2xl font-bold bg-gradient-to-r bg-clip-text text-transparent ${
                  theme === 'dark' 
                    ? 'from-cyan-400 via-blue-400 to-purple-400' 
                    : 'from-indigo-600 via-purple-600 to-pink-600'
                }`}>
                  AstroAgent
                </h1>
                <p className={`text-sm font-medium ${
                  theme === 'dark' ? 'text-cyan-300/70' : 'text-indigo-600/70'
                }`}>Space Exploration Platform</p>
              </div>
            </motion.div>

            {/* Status Bar and Theme Toggle */}
            <div className={`hidden md:flex items-center gap-6 text-sm ${
              theme === 'dark' ? 'text-cyan-300/80' : 'text-indigo-600/80'
            }`}>
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                <span>Systems Operational</span>
              </div>
              <div className="flex items-center gap-2">
                <Globe className="w-4 h-4" />
                <span>UTC {currentTime.toUTCString().split(' ')[4]}</span>
              </div>
              
              {/* Global Theme Toggle Button */}
              <motion.button
                onClick={toggleTheme}
                className="p-2 rounded-lg bg-gradient-to-r from-purple-500/20 to-blue-500/20 border border-purple-500/30 backdrop-blur-sm hover:from-purple-500/30 hover:to-blue-500/30 transition-all duration-300"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                title={`Switch to ${theme === 'dark' ? 'light' : 'dark'} mode`}
              >
                {theme === 'dark' ? 
                  <Sun className="w-5 h-5 text-yellow-400" /> : 
                  <Moon className="w-5 h-5 text-purple-400" />
                }
              </motion.button>
            </div>

            {/* Mobile Menu Toggle */}
            <div className="flex items-center gap-3">
              {/* Mobile Theme Toggle */}
              <motion.button
                onClick={toggleTheme}
                className="md:hidden p-2 rounded-lg bg-gradient-to-r from-purple-500/20 to-blue-500/20 border border-purple-500/30 backdrop-blur-sm"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                {theme === 'dark' ? 
                  <Sun className="w-5 h-5 text-yellow-400" /> : 
                  <Moon className="w-5 h-5 text-purple-400" />
                }
              </motion.button>              {/* Menu Toggle */}
              <motion.button
                className="relative z-50 p-3 rounded-xl bg-gradient-to-r from-cyan-500/20 to-purple-500/20 border border-cyan-500/30 backdrop-blur-sm hover:from-cyan-500/30 hover:to-purple-500/30 transition-all duration-300"
                onClick={() => setIsMenuOpen(!isMenuOpen)}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <AnimatePresence mode="wait">
                  {isMenuOpen ? (
                    <motion.div
                      key="close"
                      initial={{ rotate: -90, opacity: 0 }}
                      animate={{ rotate: 0, opacity: 1 }}
                      exit={{ rotate: 90, opacity: 0 }}
                      transition={{ duration: 0.2 }}
                    >
                      <X className="w-6 h-6 text-cyan-300" />
                    </motion.div>
                  ) : (
                    <motion.div
                      key="menu"
                      initial={{ rotate: 90, opacity: 0 }}
                      animate={{ rotate: 0, opacity: 1 }}
                      exit={{ rotate: -90, opacity: 0 }}
                      transition={{ duration: 0.2 }}
                    >
                      <Menu className="w-6 h-6 text-cyan-300" />
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.button>
            </div>
          </div>
        </div>
      </motion.header>      {/* Full-Screen Navigation Menu */}
      <AnimatePresence>
        {isMenuOpen && (
          <motion.div
            className={`fixed inset-0 z-40 backdrop-blur-2xl transition-colors duration-500 ${
              theme === 'dark' ? 'bg-slate-950/95' : 'bg-white/95'
            }`}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
          >
            <div className="container mx-auto px-6 pt-24 pb-12 h-full overflow-y-auto">
              <motion.div
                className="max-w-6xl mx-auto"
                initial={{ y: 50, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                exit={{ y: 50, opacity: 0 }}
                transition={{ duration: 0.5, delay: 0.1 }}
              >
                <div className="text-center mb-12">
                  <h2 className={`text-4xl font-bold bg-gradient-to-r bg-clip-text text-transparent mb-4 ${
                    theme === 'dark' 
                      ? 'from-cyan-400 via-blue-400 to-purple-400' 
                      : 'from-indigo-600 via-purple-600 to-pink-600'
                  }`}>
                    Explore the Universe
                  </h2>
                  <p className={`text-xl max-w-2xl mx-auto ${
                    theme === 'dark' ? 'text-cyan-300/80' : 'text-indigo-600/80'
                  }`}>
                    Choose your space exploration adventure from our comprehensive suite of tools and visualizations
                  </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                  {navigationItems.map((item, index) => (
                    <motion.div
                      key={item.id}
                      className="group relative"
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.5, delay: index * 0.05 }}
                      onMouseEnter={() => setHoveredItem(item.id)}
                      onMouseLeave={() => setHoveredItem(null)}
                    >                      <motion.button
                        className={`w-full h-48 rounded-2xl border-2 border-transparent backdrop-blur-sm p-6 text-left transition-all duration-300 ${
                          theme === 'dark'
                            ? 'bg-gradient-to-br from-slate-800/50 to-slate-900/50'
                            : 'bg-gradient-to-br from-white/70 to-gray-50/70'
                        } ${
                          activeTab === item.id
                            ? `${item.borderColor} border-2 shadow-2xl ${theme === 'dark' ? 'shadow-cyan-500/20' : 'shadow-indigo-500/20'}`
                            : `hover:${item.borderColor} hover:border-2 hover:shadow-xl ${theme === 'dark' ? 'hover:shadow-cyan-500/10' : 'hover:shadow-indigo-500/10'}`
                        }`}
                        onClick={() => {
                          setActiveTab(item.id);
                          setIsMenuOpen(false);
                        }}
                        whileHover={{ scale: 1.02, y: -5 }}
                        whileTap={{ scale: 0.98 }}
                      >
                        {/* Background gradient overlay */}
                        <div 
                          className={`absolute inset-0 rounded-2xl bg-gradient-to-br ${item.color} opacity-0 group-hover:opacity-10 transition-opacity duration-300`}
                        />
                        
                        <div className="relative z-10 flex flex-col h-full">
                          {/* Icon */}
                          <div className="mb-4">
                            <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${item.color} flex items-center justify-center shadow-lg transition-all duration-300 group-hover:scale-110 group-hover:shadow-xl`}>
                              <item.icon className="w-6 h-6 text-white" />
                            </div>
                          </div>
                            {/* Content */}
                          <div className="flex-1 flex flex-col justify-between">
                            <div>
                              <h3 className={`text-lg font-bold mb-2 transition-colors ${
                                theme === 'dark' 
                                  ? 'text-white group-hover:text-cyan-300' 
                                  : 'text-gray-800 group-hover:text-indigo-600'
                              }`}>
                                {item.label}
                              </h3>
                              <p className={`text-sm leading-relaxed ${
                                theme === 'dark' ? 'text-cyan-300/70' : 'text-gray-600/80'
                              }`}>
                                {item.description}
                              </p>
                            </div>
                            
                            {/* Category badge */}
                            <div className="mt-4">
                              <span className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium bg-gradient-to-r ${item.color} bg-opacity-20 border ${
                                theme === 'dark' 
                                  ? 'text-white border-white/20' 
                                  : 'text-gray-700 border-gray-300/50'
                              }`}>
                                {categories[item.category as keyof typeof categories]?.label}
                              </span>
                            </div>
                          </div>

                          {/* Active indicator */}
                          {activeTab === item.id && (
                            <div className="absolute top-4 right-4">
                              <div className={`w-3 h-3 rounded-full animate-pulse shadow-lg ${
                                theme === 'dark' 
                                  ? 'bg-cyan-400 shadow-cyan-400/50' 
                                  : 'bg-indigo-500 shadow-indigo-500/50'
                              }`}></div>
                            </div>
                          )}
                        </div>
                      </motion.button>
                    </motion.div>
                  ))}
                </div>
              </motion.div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Main Content */}
      <main className="relative z-20 pt-20">
        <div className="container mx-auto px-6 py-8">
          <AnimatePresence mode="wait">
            <motion.div
              key={activeTab}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.5 }}
              className="min-h-screen"
            >
              <ActiveComponent />
            </motion.div>
          </AnimatePresence>
        </div>
      </main>
    </div>
  );
};

export default Index;
