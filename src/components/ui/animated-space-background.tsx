import React, { useEffect, useState, useMemo } from 'react';
import { motion } from 'framer-motion';
import { useTheme } from '@/contexts/ThemeContext';

// Shooting Star Component
const ShootingStar = ({ delay, duration, path }: { delay: number; duration: number; path: string }) => {
  const windowWidth = typeof window !== 'undefined' ? window.innerWidth : 1920;
  const windowHeight = typeof window !== 'undefined' ? window.innerHeight : 1080;
  
  return (
    <motion.div
      className="absolute w-1 h-1 bg-white rounded-full shadow-lg"
      initial={{ 
        x: -20, 
        y: Math.random() * windowHeight,
        opacity: 0
      }}
      animate={{ 
        x: windowWidth + 100,
        y: Math.random() * windowHeight + 200,
        opacity: [0, 1, 1, 0]
      }}
      transition={{
        duration,
        delay,
        repeat: Infinity,
        repeatDelay: Math.random() * 10 + 5,
        ease: "linear"
      }}
      style={{
        boxShadow: `0 0 6px #ffffff, 0 0 12px #ffffff, 0 0 18px #ffffff`,
        filter: `blur(0.5px)`
      }}
    >
      {/* Shooting star trail */}
      <motion.div
        className="absolute -left-8 top-0 w-8 h-0.5 bg-gradient-to-r from-transparent via-white to-transparent"
        initial={{ scaleX: 0 }}
        animate={{ scaleX: 1 }}
        transition={{ duration: 0.3, delay }}
      />
    </motion.div>
  );
};

// Floating Orb Component
const FloatingOrb = ({ x, y, size, color, delay }: { 
  x: number; 
  y: number; 
  size: number; 
  color: string; 
  delay: number 
}) => {
  return (
    <motion.div
      className="absolute rounded-full"
      style={{
        width: size,
        height: size,
        background: `radial-gradient(circle, ${color}80 0%, ${color}40 50%, transparent 100%)`,
        filter: `blur(${size / 20}px)`,
      }}
      initial={{ x, y, opacity: 0 }}
      animate={{
        x: x + Math.sin(delay) * 50,
        y: y + Math.cos(delay) * 30,
        opacity: [0, 0.6, 0.8, 0.6, 0],
        scale: [1, 1.2, 1, 0.8, 1]
      }}
      transition={{
        duration: 8 + Math.random() * 4,
        delay,
        repeat: Infinity,
        repeatType: "reverse",
        ease: "easeInOut"
      }}
    />
  );
};

// Nebula Cloud Component
const NebulaCloud = ({ x, y, size, color, opacity }: {
  x: number; 
  y: number; 
  size: number; 
  color: string; 
  opacity: number 
}) => {
  return (
    <motion.div
      className="absolute rounded-full"
      style={{
        width: size,
        height: size * 0.6,
        background: `radial-gradient(ellipse, ${color}${Math.floor(opacity * 255).toString(16).padStart(2, '0')} 0%, transparent 70%)`,
        filter: `blur(${size / 10}px)`,
      }}
      initial={{ x, y, rotate: 0 }}
      animate={{
        rotate: 360,
        scale: [1, 1.1, 0.9, 1]
      }}
      transition={{
        rotate: { duration: 60, repeat: Infinity, ease: "linear" },
        scale: { duration: 20, repeat: Infinity, ease: "easeInOut" }
      }}
    />
  );
};

// Twinkling Star Component
const TwinklingStar = ({ x, y, delay }: { x: number; y: number; delay: number }) => {
  return (
    <motion.div
      className="absolute w-0.5 h-0.5 bg-white rounded-full"
      style={{ x, y }}
      animate={{
        opacity: [0.3, 1, 0.3],
        scale: [1, 1.5, 1]
      }}
      transition={{
        duration: 2 + Math.random() * 2,
        delay,
        repeat: Infinity,
        ease: "easeInOut"
      }}
    />
  );
};

// Particle Field Component
const ParticleField = ({ count, color }: { count: number; color: string }) => {
  const particles = useMemo(() => 
    Array.from({ length: count }, (_, i) => ({
      id: i,
      x: Math.random() * (typeof window !== 'undefined' ? window.innerWidth : 1920),
      y: Math.random() * (typeof window !== 'undefined' ? window.innerHeight : 1080),
      size: Math.random() * 2 + 1,
      delay: Math.random() * 5
    }))
  , [count]);

  return (
    <>
      {particles.map((particle) => (
        <motion.div
          key={particle.id}
          className="absolute rounded-full"
          style={{
            width: particle.size,
            height: particle.size,
            background: color,
            filter: `blur(${particle.size / 4}px)`,
          }}
          initial={{ 
            x: particle.x, 
            y: particle.y, 
            opacity: 0 
          }}
          animate={{
            y: particle.y - 100,
            opacity: [0, 0.7, 0],
            x: particle.x + Math.sin(particle.delay) * 20
          }}
          transition={{
            duration: 10 + Math.random() * 5,
            delay: particle.delay,
            repeat: Infinity,
            ease: "linear"
          }}
        />
      ))}
    </>
  );
};

// Main Animated Space Background Component
const AnimatedSpaceBackground: React.FC<{ className?: string }> = ({ className = '' }) => {
  const { theme } = useTheme();
  const [mounted, setMounted] = useState(false);
  const [dimensions, setDimensions] = useState({
    width: typeof window !== 'undefined' ? window.innerWidth : 1920,
    height: typeof window !== 'undefined' ? window.innerHeight : 1080
  });

  useEffect(() => {
    setMounted(true);
    const handleResize = () => {
      setDimensions({
        width: window.innerWidth,
        height: window.innerHeight
      });
    };

    if (typeof window !== 'undefined') {
      handleResize(); // Set initial dimensions
      window.addEventListener('resize', handleResize);
      return () => window.removeEventListener('resize', handleResize);
    }
  }, []);  // Don't render animations until mounted (client-side)
  if (!mounted) {
    return (
      <div 
        className={`fixed inset-0 overflow-hidden pointer-events-none ${className}`}
        style={{
          background: theme === 'dark' 
            ? 'radial-gradient(ellipse at top, #1e1b4b 0%, #0f0f23 50%, #000000 100%)'
            : 'radial-gradient(ellipse at top, #ddd6fe 0%, #e0e7ff 50%, #f8fafc 100%)',
          zIndex: -5
        }}
      />
    );
  }

  // Generate shooting stars
  const shootingStars = useMemo(() => 
    Array.from({ length: 5 }, (_, i) => ({
      id: i,
      delay: Math.random() * 10,
      duration: 2 + Math.random() * 2,
      path: `M${Math.random() * dimensions.width},${Math.random() * dimensions.height} L${dimensions.width + 100},${Math.random() * dimensions.height + 200}`
    }))
  , [dimensions]);

  // Generate floating orbs
  const floatingOrbs = useMemo(() => 
    Array.from({ length: 8 }, (_, i) => ({
      id: i,
      x: Math.random() * dimensions.width,
      y: Math.random() * dimensions.height,
      size: 20 + Math.random() * 40,
      color: theme === 'dark' 
        ? ['#6366f1', '#8b5cf6', '#06b6d4', '#10b981'][Math.floor(Math.random() * 4)]
        : ['#3b82f6', '#6366f1', '#8b5cf6', '#06b6d4'][Math.floor(Math.random() * 4)],
      delay: i * 0.5
    }))
  , [dimensions, theme]);

  // Generate nebula clouds
  const nebulaClouds = useMemo(() => 
    Array.from({ length: 3 }, (_, i) => ({
      id: i,
      x: Math.random() * dimensions.width,
      y: Math.random() * dimensions.height,
      size: 200 + Math.random() * 300,
      color: theme === 'dark' 
        ? ['#312e81', '#1e1b4b', '#581c87'][i]
        : ['#ddd6fe', '#e0e7ff', '#f3e8ff'][i],
      opacity: theme === 'dark' ? 0.3 : 0.1
    }))
  , [dimensions, theme]);

  // Generate twinkling stars
  const twinklingStars = useMemo(() => 
    Array.from({ length: 30 }, (_, i) => ({
      id: i,
      x: Math.random() * dimensions.width,
      y: Math.random() * dimensions.height,
      delay: Math.random() * 3
    }))
  , [dimensions]);
  const backgroundGradient = theme === 'dark' 
    ? 'radial-gradient(ellipse at top, #1e1b4b 0%, #0f0f23 50%, #000000 100%)'
    : 'radial-gradient(ellipse at top, #ddd6fe 0%, #e0e7ff 50%, #f8fafc 100%)';

  // Debug logging
  console.log('AnimatedSpaceBackground: Rendering animations with', {
    orbs: floatingOrbs.length,
    stars: twinklingStars.length,
    clouds: nebulaClouds.length,
    theme,
    mounted,
    dimensions
  });
  return (
    <div 
      className={`fixed inset-0 overflow-hidden pointer-events-none ${className}`}
      style={{
        background: backgroundGradient,
        zIndex: -5  // Lower z-index to ensure it's behind static background
      }}
    >
      {/* Nebula Clouds */}
      {nebulaClouds.map((cloud) => (
        <NebulaCloud
          key={`nebula-${cloud.id}`}
          x={cloud.x}
          y={cloud.y}
          size={cloud.size}
          color={cloud.color}
          opacity={cloud.opacity}
        />
      ))}

      {/* Floating Orbs */}
      {floatingOrbs.map((orb) => (
        <FloatingOrb
          key={`orb-${orb.id}`}
          x={orb.x}
          y={orb.y}
          size={orb.size}
          color={orb.color}
          delay={orb.delay}
        />
      ))}

      {/* Shooting Stars */}
      {shootingStars.map((star) => (
        <ShootingStar
          key={`shooting-${star.id}`}
          delay={star.delay}
          duration={star.duration}
          path={star.path}
        />
      ))}

      {/* Twinkling Stars */}
      {twinklingStars.map((star) => (
        <TwinklingStar
          key={`twinkling-${star.id}`}
          x={star.x}
          y={star.y}
          delay={star.delay}
        />
      ))}

      {/* Floating Particles */}
      <ParticleField 
        count={theme === 'dark' ? 20 : 10} 
        color={theme === 'dark' ? '#6366f1' : '#3b82f6'} 
      />

      {/* Ambient light overlay */}
      <motion.div
        className="absolute inset-0"
        style={{
          background: theme === 'dark' 
            ? 'radial-gradient(circle at 30% 20%, rgba(99, 102, 241, 0.1) 0%, transparent 50%), radial-gradient(circle at 70% 80%, rgba(139, 92, 246, 0.1) 0%, transparent 50%)'
            : 'radial-gradient(circle at 30% 20%, rgba(59, 130, 246, 0.05) 0%, transparent 50%), radial-gradient(circle at 70% 80%, rgba(99, 102, 241, 0.05) 0%, transparent 50%)'
        }}
        animate={{
          opacity: [0.5, 0.8, 0.5]
        }}
        transition={{
          duration: 8,
          repeat: Infinity,
          ease: "easeInOut"
        }}
      />
    </div>
  );
};

export default AnimatedSpaceBackground;
