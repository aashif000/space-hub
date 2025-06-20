import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useTheme } from '../../contexts/ThemeContext';

// Vibrant animated background with lots of cool effects
const VibrantAnimatedBackground: React.FC = () => {
  const { theme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return (      <div 
        className="fixed inset-0 pointer-events-none"        style={{
          background: theme === 'dark' ? 
            'radial-gradient(ellipse at top, #1e1b4b 0%, #0f0f23 50%, #000000 100%)' :
            'radial-gradient(ellipse at top, #f8fafc 0%, #f1f5f9 50%, #e2e8f0 100%)',
          zIndex: 1
        }}
      />
    );
  }

  // Generate lots of twinkling stars
  const stars = Array.from({ length: 150 }, (_, i) => ({
    id: i,
    x: Math.random() * 100,
    y: Math.random() * 100,
    size: Math.random() * 3 + 1,
    delay: Math.random() * 5,
    duration: Math.random() * 3 + 2
  }));

  // Generate colorful floating orbs
  const orbs = Array.from({ length: 15 }, (_, i) => {
    const colors = [
      'rgba(59, 130, 246, 0.6)', // Blue
      'rgba(139, 92, 246, 0.6)', // Purple
      'rgba(6, 182, 212, 0.6)',  // Cyan
      'rgba(16, 185, 129, 0.6)', // Green
      'rgba(245, 101, 101, 0.6)', // Red
      'rgba(251, 146, 60, 0.6)',  // Orange
      'rgba(236, 72, 153, 0.6)',  // Pink
      'rgba(168, 85, 247, 0.6)',  // Violet
    ];
    return {
      id: i,
      x: Math.random() * 100,
      y: Math.random() * 100,
      size: Math.random() * 60 + 30,
      color: colors[Math.floor(Math.random() * colors.length)],
      delay: Math.random() * 5,
      duration: Math.random() * 8 + 6
    };
  });

  // Generate floating particles
  const particles = Array.from({ length: 80 }, (_, i) => ({
    id: i,
    x: Math.random() * 100,
    y: Math.random() * 100,
    size: Math.random() * 4 + 2,
    delay: Math.random() * 10
  }));
  return (
    <div 
      className="fixed inset-0 overflow-hidden pointer-events-none"
      style={{
        background: theme === 'dark' ? 
          'radial-gradient(ellipse at top, #1e1b4b 0%, #0f0f23 50%, #000000 100%)' :
          'radial-gradient(ellipse at top, #f0f9ff 0%, #e0f2fe 50%, #f8fafc 100%)',
        zIndex: 1
      }}
    >      {/* Twinkling Stars */}
      {stars.map((star) => (
        <motion.div
          key={`star-${star.id}`}
          className={`absolute rounded-full ${theme === 'dark' ? 'bg-white' : 'bg-slate-600'}`}
          style={{
            left: `${star.x}%`,
            top: `${star.y}%`,
            width: `${star.size}px`,
            height: `${star.size}px`,
            boxShadow: theme === 'dark' 
              ? `0 0 ${star.size * 3}px rgba(255, 255, 255, 0.8)`
              : `0 0 ${star.size * 2}px rgba(71, 85, 105, 0.4)`,
          }}
          animate={{
            opacity: theme === 'dark' ? [0.2, 1, 0.2] : [0.1, 0.6, 0.1],
            scale: [1, 1.5, 1],
          }}
          transition={{
            duration: star.duration,
            delay: star.delay,
            repeat: Infinity,
            ease: "easeInOut"
          }}
        />
      ))}

      {/* Colorful Floating Orbs */}
      {orbs.map((orb) => (
        <motion.div
          key={`orb-${orb.id}`}
          className="absolute rounded-full"
          style={{
            left: `${orb.x}%`,
            top: `${orb.y}%`,
            width: `${orb.size}px`,
            height: `${orb.size}px`,
            background: `radial-gradient(circle, ${orb.color} 0%, ${orb.color.replace('0.6', '0.2')} 50%, transparent 100%)`,
            boxShadow: `0 0 ${orb.size}px ${orb.color}`,
            filter: `blur(${orb.size / 15}px)`,
          }}          animate={{
            y: [0, -50, 0, 50, 0],
            x: [0, 30, 0, -30, 0],
            scale: [1, 1.3, 1, 0.8, 1],
            opacity: theme === 'dark' ? [0.4, 0.8, 0.6, 0.9, 0.4] : [0.2, 0.4, 0.3, 0.5, 0.2],
            rotate: [0, 180, 360]
          }}
          transition={{
            duration: orb.duration,
            delay: orb.delay,
            repeat: Infinity,
            ease: "easeInOut"
          }}
        />
      ))}

      {/* Floating Particles */}
      {particles.map((particle) => (
        <motion.div
          key={`particle-${particle.id}`}
          className="absolute rounded-full bg-cyan-400"
          style={{
            left: `${particle.x}%`,
            top: `${particle.y}%`,
            width: `${particle.size}px`,
            height: `${particle.size}px`,
            boxShadow: `0 0 ${particle.size * 2}px rgba(6, 182, 212, 0.6)`,
          }}
          animate={{
            y: [0, -100],
            x: [0, Math.sin(particle.delay) * 50],
            opacity: [0, 0.8, 0],
            scale: [1, 1.2, 0.8]
          }}
          transition={{
            duration: 15,
            delay: particle.delay,
            repeat: Infinity,
            ease: "linear"
          }}
        />
      ))}      {/* Shooting Stars */}
      {Array.from({ length: 8 }, (_, i) => (
        <motion.div
          key={`shooting-${i}`}
          className={`absolute w-1 h-1 rounded-full ${theme === 'dark' ? 'bg-white' : 'bg-gray-700'}`}
          style={{
            left: '-20px',
            top: `${Math.random() * 100}%`,
            boxShadow: theme === 'dark' 
              ? '0 0 10px rgba(255, 255, 255, 0.8)'
              : '0 0 10px rgba(0, 0, 0, 0.6)',
          }}
          animate={{
            x: ['0vw', '110vw'],
            y: [0, Math.random() * 200 - 100],
            opacity: [0, 1, 1, 0]
          }}
          transition={{
            duration: 3 + Math.random() * 2,
            delay: i * 2 + Math.random() * 5,
            repeat: Infinity,
            repeatDelay: Math.random() * 15 + 10,
            ease: "linear"
          }}
        >
          {/* Shooting star trail */}
          <motion.div
            className={`absolute -left-12 top-0 w-12 h-0.5 ${theme === 'dark' 
              ? 'bg-gradient-to-r from-transparent via-white to-transparent'
              : 'bg-gradient-to-r from-transparent via-gray-700 to-transparent'
            }`}
            animate={{
              scaleX: [0, 1, 1, 0]
            }}
            transition={{
              duration: 0.5,
              delay: 0.2
            }}
          />
        </motion.div>
      ))}

      {/* Cosmic Waves */}
      {Array.from({ length: 5 }, (_, i) => (
        <motion.div
          key={`wave-${i}`}
          className="absolute rounded-full border border-cyan-400"
          style={{
            left: '50%',
            top: '50%',
            width: '20px',
            height: '20px',
            borderColor: `rgba(6, 182, 212, ${0.3 - i * 0.05})`,
          }}
          animate={{
            scale: [0, 10, 20],
            opacity: [0.5, 0.2, 0]
          }}
          transition={{
            duration: 8,
            delay: i * 1.5,
            repeat: Infinity,
            ease: "easeOut"
          }}
        />
      ))}

      {/* Ambient Light Pulses */}
      <motion.div
        className="absolute inset-0"
        style={{
          background: theme === 'dark' 
            ? 'radial-gradient(circle at 20% 30%, rgba(99, 102, 241, 0.1) 0%, transparent 50%), radial-gradient(circle at 80% 70%, rgba(139, 92, 246, 0.1) 0%, transparent 50%), radial-gradient(circle at 50% 50%, rgba(6, 182, 212, 0.05) 0%, transparent 70%)'
            : 'radial-gradient(circle at 20% 30%, rgba(59, 130, 246, 0.05) 0%, transparent 50%), radial-gradient(circle at 80% 70%, rgba(99, 102, 241, 0.05) 0%, transparent 50%)'
        }}
        animate={{
          opacity: [0.3, 0.7, 0.3]
        }}
        transition={{
          duration: 12,
          repeat: Infinity,
          ease: "easeInOut"
        }}
      />
    </div>
  );
};

export default VibrantAnimatedBackground;
