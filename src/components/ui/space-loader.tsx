import React from 'react';
import { cn } from '@/lib/utils';

interface SpaceLoaderProps {
  className?: string;
  size?: 'sm' | 'md' | 'lg' | 'xl';
  variant?: 'orbit' | 'pulse' | 'galaxy' | 'rocket';
}

export function SpaceLoader({ className, size = 'md', variant = 'orbit' }: SpaceLoaderProps) {
  const sizeClasses = {
    sm: 'w-8 h-8',
    md: 'w-12 h-12',
    lg: 'w-16 h-16',
    xl: 'w-24 h-24'
  };

  if (variant === 'orbit') {
    return (
      <div className={cn('relative', sizeClasses[size], className)}>
        {/* Central star */}
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-2 h-2 bg-yellow-400 rounded-full animate-pulse shadow-lg shadow-yellow-400/50"></div>
        
        {/* Orbiting planets */}
        <div className="absolute inset-0 animate-spin" style={{ animationDuration: '3s' }}>
          <div className="absolute top-0 left-1/2 transform -translate-x-1/2 w-1.5 h-1.5 bg-blue-400 rounded-full shadow-sm shadow-blue-400/50"></div>
        </div>
        
        <div className="absolute inset-2 animate-spin" style={{ animationDuration: '2s', animationDirection: 'reverse' }}>
          <div className="absolute top-0 left-1/2 transform -translate-x-1/2 w-1 h-1 bg-red-400 rounded-full shadow-sm shadow-red-400/50"></div>
        </div>
        
        <div className="absolute inset-1 animate-spin" style={{ animationDuration: '4s' }}>
          <div className="absolute top-0 left-1/2 transform -translate-x-1/2 w-0.5 h-0.5 bg-green-400 rounded-full shadow-sm shadow-green-400/50"></div>
        </div>
      </div>
    );
  }

  if (variant === 'pulse') {
    return (
      <div className={cn('relative', sizeClasses[size], className)}>
        <div className="absolute inset-0 bg-gradient-to-r from-purple-400 via-pink-400 to-blue-400 rounded-full animate-ping opacity-75"></div>
        <div className="absolute inset-1 bg-gradient-to-r from-purple-500 via-pink-500 to-blue-500 rounded-full animate-pulse"></div>
        <div className="absolute inset-2 bg-gradient-to-r from-purple-600 via-pink-600 to-blue-600 rounded-full"></div>
      </div>
    );
  }

  if (variant === 'galaxy') {
    return (
      <div className={cn('relative', sizeClasses[size], className)}>
        {/* Galaxy spiral arms */}
        {[0, 60, 120, 180, 240, 300].map((rotation, index) => (
          <div 
            key={index}
            className="absolute inset-0 animate-spin"
            style={{ 
              animationDuration: `${2 + index * 0.2}s`,
              transform: `rotate(${rotation}deg)`,
              animationDelay: `${index * 0.1}s`
            }}
          >
            <div className="absolute top-1 left-1/2 transform -translate-x-1/2 w-0.5 h-0.5 bg-white rounded-full opacity-80"></div>
            <div className="absolute top-2 left-1/2 transform -translate-x-1/2 w-0.5 h-0.5 bg-blue-300 rounded-full opacity-60"></div>
            <div className="absolute top-3 left-1/2 transform -translate-x-1/2 w-0.5 h-0.5 bg-purple-300 rounded-full opacity-40"></div>
          </div>
        ))}
        
        {/* Central black hole */}
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-2 h-2 bg-black rounded-full border border-purple-400/50 animate-pulse"></div>
      </div>
    );
  }

  if (variant === 'rocket') {
    return (
      <div className={cn('relative', sizeClasses[size], className)}>
        <div className="absolute inset-0 animate-bounce">
          {/* Rocket body */}
          <div className="absolute top-2 left-1/2 transform -translate-x-1/2 w-2 h-6 bg-gray-300 rounded-t-full"></div>
          
          {/* Rocket fins */}
          <div className="absolute top-6 left-1/2 transform -translate-x-1/2 -translate-x-1 w-1 h-2 bg-red-400 transform rotate-45"></div>
          <div className="absolute top-6 left-1/2 transform -translate-x-1/2 translate-x-1 w-1 h-2 bg-red-400 transform -rotate-45"></div>
          
          {/* Exhaust flame */}
          <div className="absolute top-8 left-1/2 transform -translate-x-1/2 w-1 h-3 bg-gradient-to-b from-orange-400 to-red-500 animate-pulse"></div>
        </div>
        
        {/* Trailing particles */}
        <div className="absolute top-10 left-1/2 transform -translate-x-1/2">
          <div className="w-0.5 h-0.5 bg-orange-300 rounded-full animate-ping" style={{ animationDelay: '0s' }}></div>
        </div>
        <div className="absolute top-11 left-1/2 transform -translate-x-1/2 translate-x-1">
          <div className="w-0.5 h-0.5 bg-red-300 rounded-full animate-ping" style={{ animationDelay: '0.5s' }}></div>
        </div>
        <div className="absolute top-11 left-1/2 transform -translate-x-1/2 -translate-x-1">
          <div className="w-0.5 h-0.5 bg-yellow-300 rounded-full animate-ping" style={{ animationDelay: '1s' }}></div>
        </div>
      </div>
    );
  }

  return null;
}

// Loading overlay component
export function SpaceLoadingOverlay({ 
  isLoading, 
  message = "Exploring the cosmos...",
  variant = 'galaxy'
}: { 
  isLoading: boolean; 
  message?: string;
  variant?: 'orbit' | 'pulse' | 'galaxy' | 'rocket';
}) {
  if (!isLoading) return null;

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center">
      <div className="bg-gray-900/80 backdrop-blur-md border border-blue-500/20 rounded-lg p-8 flex flex-col items-center space-y-4">
        <SpaceLoader variant={variant} size="xl" />
        <p className="text-white/80 text-lg font-medium">{message}</p>
        <div className="flex space-x-1">
          <div className="w-2 h-2 bg-blue-400 rounded-full animate-bounce" style={{ animationDelay: '0s' }}></div>
          <div className="w-2 h-2 bg-purple-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
          <div className="w-2 h-2 bg-pink-400 rounded-full animate-bounce" style={{ animationDelay: '0.4s' }}></div>
        </div>
      </div>
    </div>
  );
}
