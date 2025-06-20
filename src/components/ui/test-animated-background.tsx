import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useTheme } from '../../contexts/ThemeContext';

// Simple test component to verify animations work
const TestAnimatedBackground: React.FC = () => {
  const { theme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);
  if (!mounted) {
    return (
      <div 
        className="fixed inset-0 pointer-events-none"
        style={{
          background: theme === 'dark' ? 
            'radial-gradient(ellipse at top, #1e1b4b 0%, #0f0f23 50%, #000000 100%)' :
            'radial-gradient(ellipse at top, #ddd6fe 0%, #e0e7ff 50%, #f8fafc 100%)',
          zIndex: 1
        }}
      />
    );
  }
  return (
    <div 
      className="fixed inset-0 overflow-hidden pointer-events-none"
      style={{
        background: theme === 'dark' ? 
          'radial-gradient(ellipse at top, #1e1b4b 0%, #0f0f23 50%, #000000 100%)' :
          'radial-gradient(ellipse at top, #ddd6fe 0%, #e0e7ff 50%, #f8fafc 100%)',
        zIndex: 1  // Positive z-index to ensure visibility
      }}
    >      {/* Debug element to verify component is rendering */}
      <div
        className="absolute top-4 right-4 bg-red-500 text-white p-2 rounded text-sm font-bold"
        style={{ zIndex: 20 }}
      >
        TEST ANIMATIONS ACTIVE
      </div>

      {/* Simple floating orb test - make it more visible */}
      <motion.div
        className="absolute w-24 h-24 rounded-full border-2 border-cyan-400"
        style={{
          background: 'radial-gradient(circle, rgba(99, 102, 241, 0.8) 0%, rgba(99, 102, 241, 0.4) 50%, transparent 100%)',
          left: '20%',
          top: '30%',
          boxShadow: '0 0 30px rgba(99, 102, 241, 0.5)'
        }}
        animate={{
          y: [0, -30, 0],
          x: [0, 15, 0],
          scale: [1, 1.2, 1],
          opacity: [0.7, 1, 0.7]
        }}
        transition={{
          duration: 3,
          repeat: Infinity,
          ease: "easeInOut"
        }}
      />

      {/* Simple pulsing orb - make it more visible */}
      <motion.div
        className="absolute w-20 h-20 rounded-full border-2 border-purple-400"
        style={{
          background: 'radial-gradient(circle, rgba(139, 92, 246, 0.8) 0%, rgba(139, 92, 246, 0.4) 50%, transparent 100%)',
          right: '20%',
          bottom: '30%',
          boxShadow: '0 0 25px rgba(139, 92, 246, 0.5)'
        }}
        animate={{
          scale: [1, 1.4, 1],
          opacity: [0.6, 1, 0.6]
        }}
        transition={{
          duration: 2.5,
          repeat: Infinity,
          ease: "easeInOut"
        }}
      />

      {/* Moving particle - make it bigger */}
      <motion.div
        className="absolute w-4 h-4 rounded-full bg-cyan-400 border border-cyan-300"
        style={{
          left: '50%',
          top: '50%',
          boxShadow: '0 0 15px rgba(6, 182, 212, 0.8)'
        }}
        animate={{
          x: [0, 150, 0, -150, 0],
          y: [0, -75, 0, 75, 0],
          opacity: [0.5, 1, 0.5, 1, 0.5]
        }}
        transition={{
          duration: 6,
          repeat: Infinity,
          ease: "linear"
        }}
      />

      {/* Twinkling star - make it bigger */}
      <motion.div
        className="absolute w-3 h-3 bg-white rounded-full border border-gray-300"
        style={{
          left: '70%',
          top: '20%',
          boxShadow: '0 0 10px rgba(255, 255, 255, 0.8)'
        }}
        animate={{
          opacity: [0.4, 1, 0.4],
          scale: [1, 2, 1]
        }}
        transition={{
          duration: 1.5,
          repeat: Infinity,
          ease: "easeInOut"
        }}
      />
    </div>
  );
};

export default TestAnimatedBackground;
