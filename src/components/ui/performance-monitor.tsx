import React, { useState, useEffect } from 'react';
import { useFrame, useThree } from '@react-three/fiber';
import { PerformanceMonitor } from '@react-three/drei';

// Custom performance optimization hook
export const usePerformanceOptimization = () => {
  const [performanceLevel, setPerformanceLevel] = useState<'high' | 'medium' | 'low'>('high');
  const [fps, setFps] = useState(60);
    useEffect(() => {
    // Check device capabilities
    const canvas = document.createElement('canvas');
    const gl = canvas.getContext('webgl') || canvas.getContext('experimental-webgl') as WebGLRenderingContext;
    const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
    
    if (isMobile || !gl) {
      setPerformanceLevel('low');
    } else {
      // Check for dedicated GPU
      try {
        const debugInfo = gl.getExtension('WEBGL_debug_renderer_info');
        const renderer = debugInfo ? gl.getParameter(debugInfo.UNMASKED_RENDERER_WEBGL) : '';
        
        if (typeof renderer === 'string' && (renderer.includes('Intel') || renderer.includes('Apple'))) {
          setPerformanceLevel('medium');
        }
      } catch (error) {
        // Fallback to medium performance if detection fails
        setPerformanceLevel('medium');
      }
    }
  }, []);

  return {
    performanceLevel,
    setPerformanceLevel,
    fps,
    setFps,
    // Optimization settings based on performance level
    getSettings: () => ({
      particleCount: performanceLevel === 'high' ? 100 : performanceLevel === 'medium' ? 50 : 25,
      shadowMapSize: performanceLevel === 'high' ? 2048 : performanceLevel === 'medium' ? 1024 : 512,
      antialias: performanceLevel === 'high',
      pixelRatio: performanceLevel === 'high' ? Math.min(window.devicePixelRatio, 2) : 1,
      starsCount: performanceLevel === 'high' ? 5000 : performanceLevel === 'medium' ? 2000 : 1000,
      enableBloom: performanceLevel === 'high',
      animationQuality: performanceLevel
    })
  };
};

// Performance Monitor Component for 3D scenes
export const ScenePerformanceMonitor: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { performanceLevel, setPerformanceLevel, setFps } = usePerformanceOptimization();

  return (
    <PerformanceMonitor
      onIncline={() => {
        if (performanceLevel === 'low') setPerformanceLevel('medium');
        if (performanceLevel === 'medium') setPerformanceLevel('high');
      }}
      onDecline={() => {
        if (performanceLevel === 'high') setPerformanceLevel('medium');
        if (performanceLevel === 'medium') setPerformanceLevel('low');
      }}
      onChange={(api) => setFps(api.fps)}
    >
      {children}
    </PerformanceMonitor>
  );
};

// FPS Counter Component
let lastFrameTime = 0;

export const FPSCounter: React.FC = () => {
  const [fps, setFps] = useState(0);
  
  useFrame(() => {
    // Simple FPS calculation
    const now = performance.now();
    if (!lastFrameTime) {
      lastFrameTime = now;
      return;
    }
    
    const delta = now - lastFrameTime;
    lastFrameTime = now;
    
    const currentFps = Math.round(1000 / delta);
    setFps(currentFps);
  });

  return (
    <div className="absolute top-4 right-4 bg-black/60 backdrop-blur-sm rounded-lg px-3 py-2 text-white text-sm font-mono">
      FPS: {fps}
    </div>
  );
};

// Quality settings component for user control
export const QualitySettings: React.FC<{
  performanceLevel: 'high' | 'medium' | 'low';
  onQualityChange: (level: 'high' | 'medium' | 'low') => void;
}> = ({ performanceLevel, onQualityChange }) => {
  return (
    <div className="absolute bottom-4 right-4 bg-black/60 backdrop-blur-sm rounded-lg p-3">
      <div className="text-white text-xs mb-2">Graphics Quality</div>
      <div className="flex gap-2">
        {['low', 'medium', 'high'].map((level) => (
          <button
            key={level}
            onClick={() => onQualityChange(level as 'high' | 'medium' | 'low')}
            className={`px-2 py-1 rounded text-xs transition-colors ${
              performanceLevel === level
                ? 'bg-blue-500 text-white'
                : 'bg-white/20 text-gray-300 hover:bg-white/30'
            }`}
          >
            {level.charAt(0).toUpperCase() + level.slice(1)}
          </button>
        ))}
      </div>
    </div>
  );
};
