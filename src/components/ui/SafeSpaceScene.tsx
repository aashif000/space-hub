import React from 'react';
import SceneErrorBoundary from './SceneErrorBoundary';
import EnhancedSpaceScene from './EnhancedSpaceScene';
import { useTheme } from '../../contexts/ThemeContext';
import { Canvas } from '@react-three/fiber';

interface SafeSpaceSceneProps {
  performanceSettings: {
    starsCount: number;
    ambientIntensity: number;
    enableBloom?: boolean;
    antialias?: boolean;
  };
  onPlanetSelect?: (name: string) => void;
}

export const SafeSpaceScene: React.FC<SafeSpaceSceneProps> = ({
  performanceSettings,
  onPlanetSelect
}) => {
  const { theme } = useTheme();
  const spaceSceneTheme = theme === 'dark' ? 'dark' : 'light';
  
  const fallbackContent = (
    <div className="flex items-center justify-center h-full bg-slate-900/50 rounded-lg">
      <div className="text-center p-6">
        <h3 className="text-lg font-medium text-white mb-2">3D Visualization Unavailable</h3>
        <p className="text-sm text-slate-300">Your device may not support WebGL, or there might be a temporary issue.</p>
      </div>
    </div>
  );
  
  return (
    <SceneErrorBoundary fallback={fallbackContent}>
      <div className="w-full h-full">
        <Canvas
          camera={{ position: [0, 0, 20], fov: 75 }}
          style={{ background: 'transparent' }}
          dpr={[1, 2]}
          gl={{ 
            alpha: true, 
            antialias: !!performanceSettings.antialias,
            preserveDrawingBuffer: false 
          }}
        >
          <EnhancedSpaceScene 
            performanceSettings={performanceSettings}
            theme={spaceSceneTheme}
            onPlanetSelect={onPlanetSelect || (() => {})}
          />
        </Canvas>
      </div>
    </SceneErrorBoundary>
  );
};
