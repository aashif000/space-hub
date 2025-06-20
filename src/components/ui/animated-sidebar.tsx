
import React, { useState, useEffect } from 'react';
import { cn } from '@/lib/utils';
import { ChevronLeft, ChevronRight, Zap } from 'lucide-react';

interface AnimatedSidebarProps {
  children: React.ReactNode;
  className?: string;
}

export const AnimatedSidebar: React.FC<AnimatedSidebarProps> = ({ children, className }) => {
  const [isExpanded, setIsExpanded] = useState(true);
  const [isHovered, setIsHovered] = useState(false);
  const [glowIntensity, setGlowIntensity] = useState(0.5);
  const [energyPulse, setEnergyPulse] = useState(0);
  const [starField, setStarField] = useState<Array<{id: number, x: number, y: number, delay: number}>>([]);

  const shouldBeExpanded = isExpanded || isHovered;

  // Initialize star field  // Static effects initialization
  useEffect(() => {
    const stars = Array.from({ length: 15 }, (_, i) => ({
      id: i,
      x: Math.random() * 100,
      y: Math.random() * 100,
      delay: Math.random() * 3
    }));
    setStarField(stars);
    
    // Set static values instead of animating
    setGlowIntensity(0.6);
    setEnergyPulse(0.7);
  }, []);
  return (
    <div
      className={cn(
        "fixed left-0 top-0 h-full transition-all duration-700 ease-out z-40 overflow-hidden",
        shouldBeExpanded ? "w-80" : "w-20",
        className
      )}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Multi-layered animated background */}
      <div className="absolute inset-0 bg-gradient-to-br from-slate-950/98 via-indigo-950/95 to-purple-950/98 backdrop-blur-xl"></div>
      
      {/* Animated mesh gradient overlay */}
      <div 
        className="absolute inset-0 opacity-20"
        style={{
          background: `
            radial-gradient(circle at 20% 80%, rgba(120, 119, 198, ${0.3 + glowIntensity * 0.4}) 0%, transparent 50%),
            radial-gradient(circle at 80% 20%, rgba(255, 119, 198, ${0.2 + energyPulse * 0.3}) 0%, transparent 50%),
            radial-gradient(circle at 40% 40%, rgba(59, 130, 246, ${0.25 + glowIntensity * 0.3}) 0%, transparent 50%)
          `
        }}
      ></div>

      {/* Holographic scanlines */}
      <div className="absolute inset-0 pointer-events-none opacity-10">
        <div 
          className="w-full h-full animate-pulse"
          style={{
            backgroundImage: `repeating-linear-gradient(
              0deg,
              transparent,
              transparent 2px,
              rgba(6, 182, 212, 0.1) 2px,
              rgba(6, 182, 212, 0.1) 4px
            )`
          }}
        ></div>
      </div>

      {/* Dynamic energy border with multiple layers */}
      <div className="absolute inset-0">
        <div 
          className="absolute inset-0 border-r-4"
          style={{
            borderImage: `linear-gradient(to bottom, 
              rgba(6, 182, 212, ${0.8 + glowIntensity * 0.4}), 
              rgba(139, 92, 246, ${0.6 + energyPulse * 0.4}), 
              rgba(236, 72, 153, ${0.7 + glowIntensity * 0.3})
            ) 1`,
            boxShadow: `
              inset -4px 0 ${20 + glowIntensity * 30}px rgba(6, 182, 212, ${0.3 + glowIntensity * 0.4}),
              inset -2px 0 ${10 + energyPulse * 15}px rgba(139, 92, 246, ${0.2 + energyPulse * 0.3})
            `
          }}
        ></div>
      </div>      {/* Floating star field */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {starField.map((star) => (
          <div
            key={star.id}
            className="absolute w-1 h-1 bg-cyan-300 rounded-full animate-twinkle"
            style={{
              left: `${star.x}%`,
              top: `${star.y}%`,
              animationDelay: `${star.delay}s`,
              boxShadow: `0 0 ${3 + glowIntensity * 2}px rgba(103, 232, 249, ${0.8 + glowIntensity * 0.4})`
            }}
          ></div>
        ))}
      </div>

      {/* Animated energy particles */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {[...Array(12)].map((_, i) => (
          <div
            key={i}
            className="absolute w-1.5 h-1.5 rounded-full animate-particle-float"
            style={{
              left: `${10 + (i % 4) * 20}%`,
              top: `${Math.random() * 100}%`,
              background: `radial-gradient(circle, 
                rgba(6, 182, 212, ${0.9 + glowIntensity * 0.3}) 0%, 
                rgba(139, 92, 246, ${0.6 + energyPulse * 0.4}) 100%
              )`,
              animationDelay: `${i * 0.3}s`,
              filter: 'blur(0.5px)',
              boxShadow: `0 0 ${6 + glowIntensity * 4}px rgba(6, 182, 212, ${0.6 + glowIntensity * 0.4})`
            }}
          ></div>
        ))}
      </div>{/* Advanced Toggle Button with holographic effect */}
      <button
        onClick={() => setIsExpanded(!isExpanded)}
        className="absolute -right-5 top-10 group transition-all duration-500 hover:scale-110 z-50"
        style={{
          transform: isHovered ? 'scale(1.1)' : 'scale(1)',
        }}
      >
        <div 
          className="relative bg-gradient-to-br from-cyan-500 via-blue-500 to-purple-600 p-3 rounded-full shadow-2xl border-2 border-cyan-300/40"
          style={{
            boxShadow: `
              0 0 ${25 + glowIntensity * 15}px rgba(6, 182, 212, ${0.7 + glowIntensity * 0.5}),
              inset 0 1px 0 rgba(255, 255, 255, 0.2),
              inset 0 -1px 0 rgba(0, 0, 0, 0.1)
            `
          }}
        >          {/* Holographic rim */}
          <div className="absolute inset-0 rounded-full border-2 border-transparent bg-gradient-to-r from-cyan-400 via-transparent to-purple-400 opacity-60 animate-spin-slow"></div>
          
          {shouldBeExpanded ? (
            <ChevronLeft className="w-5 h-5 text-white relative z-10 drop-shadow-lg" />
          ) : (
            <ChevronRight className="w-5 h-5 text-white relative z-10 drop-shadow-lg" />
          )}
        </div>
      </button>

      {/* Vertical energy beam for collapsed state */}
      {!shouldBeExpanded && (
        <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
          <div 
            className="w-3 h-20 rounded-full relative overflow-hidden"
            style={{
              background: `linear-gradient(to top, 
                rgba(6, 182, 212, ${0.8 + energyPulse * 0.4}), 
                rgba(139, 92, 246, ${0.9 + glowIntensity * 0.3}), 
                rgba(236, 72, 153, ${0.7 + energyPulse * 0.5})
              )`,
              boxShadow: `
                0 0 ${15 + glowIntensity * 10}px rgba(6, 182, 212, ${0.6 + glowIntensity * 0.4}),
                inset 0 0 ${10 + energyPulse * 5}px rgba(255, 255, 255, ${0.3 + energyPulse * 0.2})
              `
            }}
          >
            {/* Moving energy pulse */}
            <div 
              className="absolute w-full h-4 rounded-full animate-pulse"
              style={{
                background: 'rgba(255, 255, 255, 0.6)',
                top: `${energyPulse * 60}%`,
                filter: 'blur(1px)'
              }}
            ></div>
          </div>
        </div>
      )}      {/* Sidebar Content with enhanced styling */}
      <div className="relative p-6 h-full overflow-y-auto">
        {children}
      </div>
    </div>
  );
};
