import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Smartphone, Tablet, Monitor, Wifi, Battery, Signal } from 'lucide-react';

// Mobile device detection hook
export const useMobileDetection = () => {
  const [deviceInfo, setDeviceInfo] = useState({
    isMobile: false,
    isTablet: false,
    isDesktop: true,
    orientation: 'landscape' as 'portrait' | 'landscape',
    touchSupport: false,
    screenSize: 'large' as 'small' | 'medium' | 'large'
  });

  useEffect(() => {
    const updateDeviceInfo = () => {
      const userAgent = navigator.userAgent;
      const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(userAgent);
      const isTablet = /iPad|Android(?!.*Mobile)/i.test(userAgent);
      const touchSupport = 'ontouchstart' in window || navigator.maxTouchPoints > 0;
      
      const width = window.innerWidth;
      const height = window.innerHeight;
      const orientation = width > height ? 'landscape' : 'portrait';
      
      let screenSize: 'small' | 'medium' | 'large' = 'large';
      if (width < 640) screenSize = 'small';
      else if (width < 1024) screenSize = 'medium';

      setDeviceInfo({
        isMobile: isMobile && !isTablet,
        isTablet,
        isDesktop: !isMobile && !isTablet,
        orientation,
        touchSupport,
        screenSize
      });
    };

    updateDeviceInfo();
    window.addEventListener('resize', updateDeviceInfo);
    window.addEventListener('orientationchange', updateDeviceInfo);

    return () => {
      window.removeEventListener('resize', updateDeviceInfo);
      window.removeEventListener('orientationchange', updateDeviceInfo);
    };
  }, []);

  return deviceInfo;
};

// Mobile-optimized controls component
export const MobileControls: React.FC<{
  onToggleFPS: () => void;
  onToggleQuality: () => void;
  onResetView: () => void;
  showFPS: boolean;
}> = ({ onToggleFPS, onToggleQuality, onResetView, showFPS }) => {
  const [isOpen, setIsOpen] = useState(false);
  const deviceInfo = useMobileDetection();

  if (!deviceInfo.isMobile && !deviceInfo.isTablet) return null;

  return (
    <div className="fixed bottom-4 right-4 z-50">
      {/* Floating Action Button */}
      <motion.button
        onClick={() => setIsOpen(!isOpen)}
        className="w-14 h-14 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full shadow-lg flex items-center justify-center text-white"
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
      >
        <motion.div
          animate={{ rotate: isOpen ? 45 : 0 }}
          transition={{ duration: 0.2 }}
        >
          {deviceInfo.isMobile ? <Smartphone className="w-6 h-6" /> : <Tablet className="w-6 h-6" />}
        </motion.div>
      </motion.button>

      {/* Controls Menu */}
      <motion.div
        initial={{ opacity: 0, scale: 0.8, y: 20 }}
        animate={{ 
          opacity: isOpen ? 1 : 0, 
          scale: isOpen ? 1 : 0.8,
          y: isOpen ? 0 : 20
        }}
        transition={{ duration: 0.3 }}
        className={`absolute bottom-16 right-0 bg-black/90 backdrop-blur-sm rounded-xl p-4 min-w-48 ${
          isOpen ? 'pointer-events-auto' : 'pointer-events-none'
        }`}
      >
        <div className="space-y-3">
          <div className="text-white text-sm font-medium mb-3">Scene Controls</div>
          
          <button
            onClick={() => {
              onToggleFPS();
              setIsOpen(false);
            }}
            className="w-full flex items-center gap-3 p-2 rounded-lg bg-white/10 hover:bg-white/20 transition-colors text-white text-sm"
          >
            <Monitor className="w-4 h-4" />
            {showFPS ? 'Hide FPS' : 'Show FPS'}
          </button>

          <button
            onClick={() => {
              onToggleQuality();
              setIsOpen(false);
            }}
            className="w-full flex items-center gap-3 p-2 rounded-lg bg-white/10 hover:bg-white/20 transition-colors text-white text-sm"
          >
            <Signal className="w-4 h-4" />
            Toggle Quality
          </button>

          <button
            onClick={() => {
              onResetView();
              setIsOpen(false);
            }}
            className="w-full flex items-center gap-3 p-2 rounded-lg bg-white/10 hover:bg-white/20 transition-colors text-white text-sm"
          >
            <Battery className="w-4 h-4" />
            Reset View
          </button>
        </div>

        {/* Device Info */}
        <div className="mt-4 pt-3 border-t border-white/20">
          <div className="text-xs text-gray-400 space-y-1">
            <div className="flex justify-between">
              <span>Device:</span>
              <span>{deviceInfo.isMobile ? 'Mobile' : deviceInfo.isTablet ? 'Tablet' : 'Desktop'}</span>
            </div>
            <div className="flex justify-between">
              <span>Screen:</span>
              <span>{deviceInfo.screenSize}</span>
            </div>
            <div className="flex justify-between">
              <span>Touch:</span>
              <span>{deviceInfo.touchSupport ? 'Yes' : 'No'}</span>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

// Touch gesture helper component
export const TouchGestureOverlay: React.FC<{ className?: string }> = ({ className = "" }) => {
  const [showHints, setShowHints] = useState(true);
  const deviceInfo = useMobileDetection();

  useEffect(() => {
    const timer = setTimeout(() => setShowHints(false), 5000);
    return () => clearTimeout(timer);
  }, []);

  if (!deviceInfo.touchSupport || !showHints) return null;

  return (
    <div className={`absolute inset-0 pointer-events-none z-40 ${className}`}>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="absolute inset-0 bg-black/50 flex items-center justify-center"
      >
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.8, opacity: 0 }}
          className="bg-white/10 backdrop-blur-sm rounded-xl p-6 m-4 max-w-sm"
        >
          <h3 className="text-white font-medium mb-4 text-center">Touch Gestures</h3>
          <div className="space-y-3 text-sm text-gray-300">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 bg-blue-500/20 rounded-full flex items-center justify-center">
                👆
              </div>
              <span>Tap planets to explore</span>
            </div>
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 bg-purple-500/20 rounded-full flex items-center justify-center">
                🤏
              </div>
              <span>Pinch to zoom in/out</span>
            </div>
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 bg-green-500/20 rounded-full flex items-center justify-center">
                🔄
              </div>
              <span>Drag to rotate view</span>
            </div>
          </div>
          <button
            onClick={() => setShowHints(false)}
            className="w-full mt-4 p-2 bg-blue-500/20 text-blue-400 rounded-lg text-sm hover:bg-blue-500/30 transition-colors"
          >
            Got it!
          </button>
        </motion.div>
      </motion.div>
    </div>
  );
};

// Performance indicator for mobile devices
export const MobilePerformanceIndicator: React.FC<{ fps?: number }> = ({ fps = 60 }) => {
  const deviceInfo = useMobileDetection();
  const [batteryLevel, setBatteryLevel] = useState<number | null>(null);

  useEffect(() => {
    // Try to get battery information (if supported)
    if ('getBattery' in navigator) {
      (navigator as any).getBattery().then((battery: any) => {
        setBatteryLevel(Math.round(battery.level * 100));
        
        const updateBattery = () => setBatteryLevel(Math.round(battery.level * 100));
        battery.addEventListener('levelchange', updateBattery);
        
        return () => battery.removeEventListener('levelchange', updateBattery);
      }).catch(() => {
        // Battery API not supported
      });
    }
  }, []);

  if (!deviceInfo.isMobile && !deviceInfo.isTablet) return null;

  const getPerformanceColor = (fps: number) => {
    if (fps >= 50) return 'text-green-400';
    if (fps >= 30) return 'text-yellow-400';
    return 'text-red-400';
  };

  return (
    <div className="fixed top-4 left-4 bg-black/70 backdrop-blur-sm rounded-lg p-2 text-xs z-50">
      <div className="flex items-center gap-3">
        <div className="flex items-center gap-1">
          <Signal className="w-3 h-3 text-blue-400" />
          <span className={getPerformanceColor(fps)}>{fps} FPS</span>
        </div>
        
        {batteryLevel !== null && (
          <div className="flex items-center gap-1">
            <Battery className="w-3 h-3 text-green-400" />
            <span className="text-white">{batteryLevel}%</span>
          </div>
        )}
        
        <div className="flex items-center gap-1">
          <Wifi className="w-3 h-3 text-gray-400" />
          <span className="text-gray-400">{deviceInfo.screenSize}</span>
        </div>
      </div>
    </div>
  );
};
