import React, { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { EnhancedDashboard } from './EnhancedDashboard';
import { EnhancedLoadingSequence } from './ui/enhanced-loading';
import { MobileControls, TouchGestureOverlay, MobilePerformanceIndicator, useMobileDetection } from './ui/mobile-optimization';
import { EnhancedSpaceBackground3D } from './ui/enhanced-space-background-3d';
import { AdvancedAnalyticsDashboard } from './ui/advanced-analytics-dashboard';
import { usePerformanceOptimization, QualitySettings } from './ui/performance-monitor';
import { AppTestSuite } from './ui/app-test-suite';
import { UserDocumentation } from './ui/user-documentation';
import { SystemStatusIndicator } from './ui/system-status-indicator';
import { BarChart3, Settings, Zap, Monitor, RotateCcw, Eye, TrendingUp, TestTube, Book, HelpCircle } from 'lucide-react';

interface AstroAgentAppProps {
  className?: string;
}

export const AstroAgentApp: React.FC<AstroAgentAppProps> = ({ className = "" }) => {  const [isLoading, setIsLoading] = useState(true);  const [showFPS, setShowFPS] = useState(false);
  const [showAnalytics, setShowAnalytics] = useState(false);
  const [showTestSuite, setShowTestSuite] = useState(false);
  const [showDocumentation, setShowDocumentation] = useState(false);
  const [currentFPS, setCurrentFPS] = useState(60);
  const [sceneKey, setSceneKey] = useState(0); // For resetting the 3D scene
  const deviceInfo = useMobileDetection();
  const { performanceLevel, setPerformanceLevel, getSettings } = usePerformanceOptimization();

  useEffect(() => {
    // Auto-detect if we should show FPS based on device
    if (deviceInfo.isDesktop) {
      setShowFPS(false); // Desktop users can toggle manually
    }
  }, [deviceInfo]);

  const handleLoadingComplete = useCallback(() => {
    setIsLoading(false);
  }, []);

  const handleToggleFPS = useCallback(() => {
    setShowFPS(prev => !prev);
  }, []);

  const handleToggleQuality = useCallback(() => {
    const levels: ('high' | 'medium' | 'low')[] = ['low', 'medium', 'high'];
    const currentIndex = levels.indexOf(performanceLevel);
    const nextLevel = levels[(currentIndex + 1) % levels.length];
    setPerformanceLevel(nextLevel);
  }, [performanceLevel, setPerformanceLevel]);

  const handleResetView = useCallback(() => {
    // Reset the 3D scene by incrementing the key
    setSceneKey(prev => prev + 1);
  }, []);
  const handleToggleAnalytics = useCallback(() => {
    setShowAnalytics(prev => !prev);
  }, []);
  const handleToggleTestSuite = useCallback(() => {
    setShowTestSuite(prev => !prev);
  }, []);

  const handleToggleDocumentation = useCallback(() => {
    setShowDocumentation(prev => !prev);
  }, []);

  if (isLoading) {
    return (
      <EnhancedLoadingSequence 
        onComplete={handleLoadingComplete}
        duration={3000}
      />
    );
  }
  return (
    <div className={`relative min-h-screen ${className}`}>
      {/* Enhanced 3D Space Background */}
      <div className="fixed inset-0 z-0">
        <EnhancedSpaceBackground3D key={sceneKey} />
      </div>

      {/* Main Dashboard */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, delay: 0.2 }}
        className="relative z-10"
      >
        <EnhancedDashboard />
      </motion.div>      {/* Advanced Analytics Dashboard */}
      <AnimatePresence>
        {showAnalytics && (
          <motion.div
            initial={{ opacity: 0, x: 300 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 300 }}
            transition={{ type: "spring", damping: 25, stiffness: 200 }}
            className="fixed top-4 right-4 z-50 w-80 max-h-[80vh] overflow-y-auto"
          >
            <AdvancedAnalyticsDashboard 
              isVisible={showAnalytics}
              onClose={() => setShowAnalytics(false)}
            />
          </motion.div>
        )}
      </AnimatePresence>      {/* Test Suite */}
      <AnimatePresence>
        {showTestSuite && (
          <motion.div
            initial={{ opacity: 0, y: 300 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 300 }}
            transition={{ type: "spring", damping: 25, stiffness: 200 }}
            className="fixed bottom-20 right-4 z-50"
          >
            <AppTestSuite onClose={() => setShowTestSuite(false)} />
          </motion.div>
        )}
      </AnimatePresence>

      {/* User Documentation */}
      <AnimatePresence>
        {showDocumentation && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            transition={{ type: "spring", damping: 25, stiffness: 200 }}
            className="fixed inset-4 z-50 flex items-center justify-center"
          >
            <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={() => setShowDocumentation(false)} />
            <div className="relative">
              <UserDocumentation onClose={() => setShowDocumentation(false)} />
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Quality Settings */}
      <QualitySettings
        performanceLevel={performanceLevel}
        onQualityChange={setPerformanceLevel}
      />

      {/* Mobile optimizations */}
      <MobileControls
        onToggleFPS={handleToggleFPS}
        onToggleQuality={handleToggleQuality}
        onResetView={handleResetView}
        showFPS={showFPS}
      />

      {/* Touch gesture overlay for first-time mobile users */}
      <TouchGestureOverlay />

      {/* Mobile performance indicator */}
      {(deviceInfo.isMobile || deviceInfo.isTablet) && showFPS && (
        <MobilePerformanceIndicator fps={currentFPS} />
      )}

      {/* System Status Indicator */}
      <motion.div
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ delay: 1.8, duration: 0.6 }}
        className="fixed top-20 left-4 z-40"
      >
        <SystemStatusIndicator />
      </motion.div>      {/* Enhanced Control Panel - Repositioned for better visibility */}
      <motion.div
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 1.2, duration: 0.6 }}
        className="fixed top-4 left-4 bg-black/80 backdrop-blur-sm rounded-lg p-2 z-40 max-w-[200px]"
      >
        <div className="grid grid-cols-2 gap-1">
          <button
            onClick={handleToggleAnalytics}
            className={`flex items-center justify-center gap-1 px-2 py-1 rounded text-xs transition-all duration-200 ${
              showAnalytics 
                ? 'bg-blue-500/20 text-blue-400 border border-blue-500/30' 
                : 'bg-white/5 text-gray-300 hover:bg-white/10 hover:text-white'
            }`}
            title="Toggle Analytics Dashboard"
          >
            <TrendingUp className="w-3 h-3" />
            <span className="hidden sm:inline text-xs">Analytics</span>
          </button>
          
          <button
            onClick={handleToggleFPS}
            className={`flex items-center justify-center gap-1 px-2 py-1 rounded text-xs transition-all duration-200 ${
              showFPS 
                ? 'bg-green-500/20 text-green-400 border border-green-500/30' 
                : 'bg-white/5 text-gray-300 hover:bg-white/10 hover:text-white'
            }`}
            title="Toggle FPS Counter"
          >
            <Monitor className="w-3 h-3" />
            <span className="hidden sm:inline text-xs">FPS</span>
          </button>
          
          <button
            onClick={handleResetView}
            className="flex items-center justify-center gap-1 px-2 py-1 rounded text-xs bg-white/5 text-gray-300 hover:bg-white/10 hover:text-white transition-all duration-200"
            title="Reset 3D View"
          >
            <RotateCcw className="w-3 h-3" />
            <span className="hidden sm:inline text-xs">Reset</span>
          </button>
          
          <button
            onClick={handleToggleTestSuite}
            className={`flex items-center justify-center gap-1 px-2 py-1 rounded text-xs transition-all duration-200 ${
              showTestSuite 
                ? 'bg-purple-500/20 text-purple-400 border border-purple-500/30' 
                : 'bg-white/5 text-gray-300 hover:bg-white/10 hover:text-white'
            }`}
            title="App Test Suite"
          >
            <TestTube className="w-3 h-3" />
            <span className="hidden sm:inline text-xs">Tests</span>
          </button>
        </div>
        
        {/* Second row for additional controls */}
        <div className="grid grid-cols-2 gap-1 mt-1">
          <button
            onClick={handleToggleDocumentation}
            className={`flex items-center justify-center gap-1 px-2 py-1 rounded text-xs transition-all duration-200 ${
              showDocumentation 
                ? 'bg-amber-500/20 text-amber-400 border border-amber-500/30' 
                : 'bg-white/5 text-gray-300 hover:bg-white/10 hover:text-white'
            }`}
            title="User Documentation"
          >
            <HelpCircle className="w-3 h-3" />
            <span className="hidden sm:inline text-xs">Help</span>
          </button>
          
          <button
            onClick={handleToggleQuality}
            className="flex items-center justify-center gap-1 px-2 py-1 rounded text-xs bg-white/5 text-gray-300 hover:bg-white/10 hover:text-white transition-all duration-200"
            title={`Quality: ${performanceLevel.toUpperCase()}`}
          >
            <Settings className="w-3 h-3" />
            <span className="hidden sm:inline text-xs">{performanceLevel.charAt(0).toUpperCase()}</span>
          </button>
        </div>
      </motion.div>      {/* Performance & Quality Indicator - Repositioned */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 1.5, duration: 0.6 }}
        className="fixed bottom-4 left-4 bg-black/80 backdrop-blur-sm rounded-lg p-2 text-xs text-gray-300 z-40"
      >
        <div className="flex items-center gap-2 mb-1">
          <div className={`w-2 h-2 rounded-full ${
            performanceLevel === 'high' ? 'bg-green-400' :
            performanceLevel === 'medium' ? 'bg-yellow-400' : 'bg-red-400'
          }`}></div>
          <span className="text-white font-medium text-xs">
            {performanceLevel.toUpperCase()}
          </span>
        </div>
        <div className="text-xs opacity-70">
          Quality: {getSettings().starsCount.toLocaleString()} ⭐
        </div>
      </motion.div>      {/* Achievement/Features Summary - Repositioned to right side */}
      <motion.div
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 1, duration: 0.6 }}
        className="fixed bottom-4 right-4 bg-black/80 backdrop-blur-sm rounded-lg p-2 text-xs text-gray-300 max-w-52 z-40"
      >
        <div className="font-medium text-white mb-2 text-xs">✨ Enhanced Features</div>
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span className="w-1.5 h-1.5 bg-green-400 rounded-full"></span>
            <span className="text-xs">Auto-Optimization</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="w-1.5 h-1.5 bg-blue-400 rounded-full"></span>
            <span className="text-xs">3D Solar System</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="w-1.5 h-1.5 bg-purple-400 rounded-full"></span>
            <span className="text-xs">Touch Controls</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="w-1.5 h-1.5 bg-yellow-400 rounded-full"></span>
            <span className="text-xs">Real-time Analytics</span>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default AstroAgentApp;
