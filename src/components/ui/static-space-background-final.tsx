import React from 'react';
import { useTheme } from '../../contexts/ThemeContext';

// Static background without animation for performance
export default function StaticSpaceBackground() {
  const { theme } = useTheme();

  return (
    <div className="fixed inset-0" style={{ zIndex: -10 }}>      {/* Gradient background */}
      <div
        className="absolute inset-0"
        style={{
          background: theme === 'dark' 
            ? 'linear-gradient(135deg, rgb(15, 15, 25) 0%, rgb(20, 20, 35) 50%, rgb(25, 25, 40) 100%)'
            : 'linear-gradient(135deg, rgb(250, 252, 255) 0%, rgb(240, 245, 251) 50%, rgb(235, 240, 248) 100%)',
        }}
      />      {/* Star field */}
      <div className="absolute inset-0">
        <div
          className={`w-full h-full ${theme === 'dark' ? 'opacity-80' : 'opacity-40'}`}
          style={{
            backgroundImage: theme === 'dark' ? `
              radial-gradient(1px 1px at 20px 30px, rgba(255, 255, 255, 0.8), transparent),
              radial-gradient(1px 1px at 40px 70px, rgba(255, 255, 255, 0.8), transparent),
              radial-gradient(1px 1px at 90px 40px, rgba(255, 255, 255, 0.8), transparent),
              radial-gradient(1px 1px at 130px 80px, rgba(255, 255, 255, 0.8), transparent),
              radial-gradient(1px 1px at 160px 30px, rgba(255, 255, 255, 0.8), transparent),
              radial-gradient(2px 2px at 200px 50px, rgba(59, 130, 246, 0.8), transparent),
              radial-gradient(1px 1px at 230px 90px, rgba(255, 255, 255, 0.8), transparent),
              radial-gradient(1px 1px at 270px 20px, rgba(255, 255, 255, 0.8), transparent),
              radial-gradient(2px 2px at 300px 70px, rgba(99, 102, 241, 0.8), transparent),
              radial-gradient(1px 1px at 320px 40px, rgba(255, 255, 255, 0.8), transparent),
              radial-gradient(1px 1px at 350px 80px, rgba(255, 255, 255, 0.8), transparent),
              radial-gradient(1px 1px at 380px 30px, rgba(255, 255, 255, 0.8), transparent),
              radial-gradient(1px 1px at 410px 60px, rgba(255, 255, 255, 0.8), transparent),
              radial-gradient(2px 2px at 440px 90px, rgba(168, 85, 247, 0.8), transparent),
              radial-gradient(1px 1px at 470px 20px, rgba(255, 255, 255, 0.8), transparent),
              radial-gradient(1px 1px at 500px 70px, rgba(255, 255, 255, 0.8), transparent),
              radial-gradient(1px 1px at 530px 40px, rgba(255, 255, 255, 0.8), transparent),
              radial-gradient(1px 1px at 560px 80px, rgba(255, 255, 255, 0.8), transparent),
              radial-gradient(2px 2px at 590px 30px, rgba(99, 102, 241, 0.8), transparent),
              radial-gradient(1px 1px at 620px 60px, rgba(255, 255, 255, 0.8), transparent)
            ` : `
              radial-gradient(1px 1px at 20px 30px, rgba(71, 85, 105, 0.6), transparent),
              radial-gradient(1px 1px at 40px 70px, rgba(71, 85, 105, 0.6), transparent),
              radial-gradient(1px 1px at 90px 40px, rgba(71, 85, 105, 0.6), transparent),
              radial-gradient(1px 1px at 130px 80px, rgba(71, 85, 105, 0.6), transparent),
              radial-gradient(1px 1px at 160px 30px, rgba(71, 85, 105, 0.6), transparent),
              radial-gradient(2px 2px at 200px 50px, rgba(37, 99, 235, 0.4), transparent),
              radial-gradient(1px 1px at 230px 90px, rgba(71, 85, 105, 0.6), transparent),
              radial-gradient(1px 1px at 270px 20px, rgba(71, 85, 105, 0.6), transparent),
              radial-gradient(2px 2px at 300px 70px, rgba(79, 70, 229, 0.4), transparent),
              radial-gradient(1px 1px at 320px 40px, rgba(71, 85, 105, 0.6), transparent),
              radial-gradient(1px 1px at 350px 80px, rgba(71, 85, 105, 0.6), transparent),
              radial-gradient(1px 1px at 380px 30px, rgba(71, 85, 105, 0.6), transparent),
              radial-gradient(1px 1px at 410px 60px, rgba(71, 85, 105, 0.6), transparent),
              radial-gradient(2px 2px at 440px 90px, rgba(147, 51, 234, 0.4), transparent),
              radial-gradient(1px 1px at 470px 20px, rgba(71, 85, 105, 0.6), transparent),
              radial-gradient(1px 1px at 500px 70px, rgba(71, 85, 105, 0.6), transparent),
              radial-gradient(1px 1px at 530px 40px, rgba(71, 85, 105, 0.6), transparent),
              radial-gradient(1px 1px at 560px 80px, rgba(71, 85, 105, 0.6), transparent),
              radial-gradient(2px 2px at 590px 30px, rgba(79, 70, 229, 0.4), transparent),
              radial-gradient(1px 1px at 620px 60px, rgba(71, 85, 105, 0.6), transparent)
            `,
            backgroundSize: '650px 100px',
            backgroundRepeat: 'repeat',
          }}
        />
      </div>
        {/* Nebula effects */}
      <div className={`absolute inset-0 ${theme === 'dark' ? 'opacity-15' : 'opacity-8'}`}>
        <div
          className="absolute top-20 left-20 w-96 h-96 rounded-full blur-3xl"
          style={{ 
            backgroundColor: theme === 'dark' ? 'rgba(99, 102, 241, 0.1)' : 'rgba(79, 70, 229, 0.05)',
          }}
        />
        <div
          className="absolute bottom-32 right-32 w-80 h-80 rounded-full blur-3xl"
          style={{ 
            backgroundColor: theme === 'dark' ? 'rgba(168, 85, 247, 0.1)' : 'rgba(147, 51, 234, 0.05)',
          }}
        />
        <div
          className="absolute top-1/2 left-1/2 w-64 h-64 rounded-full blur-3xl transform -translate-x-1/2 -translate-y-1/2"
          style={{ 
            backgroundColor: theme === 'dark' ? 'rgba(34, 197, 94, 0.08)' : 'rgba(22, 163, 74, 0.04)',
          }}
        />
        <div
          className="absolute top-3/4 left-1/4 w-48 h-48 rounded-full blur-3xl"
          style={{ 
            backgroundColor: theme === 'dark' ? 'rgba(156, 163, 175, 0.06)' : 'rgba(100, 116, 139, 0.03)',
          }}
        />
      </div>
      
      {/* Geometric shapes */}
      <div className={`absolute inset-0 ${theme === 'dark' ? 'opacity-10' : 'opacity-5'}`}>
        <div className="absolute top-32 right-40 w-2 h-2 rounded-full shadow-lg" style={{ 
          backgroundColor: theme === 'dark' ? 'rgba(168, 85, 247, 1)' : 'rgba(147, 51, 234, 0.8)', 
          boxShadow: theme === 'dark' ? '0 0 10px rgba(168, 85, 247, 0.5)' : '0 0 10px rgba(147, 51, 234, 0.3)' 
        }} />
        <div className="absolute bottom-48 left-32 w-1 h-1 rounded-full shadow-lg" style={{ 
          backgroundColor: theme === 'dark' ? 'rgba(99, 102, 241, 1)' : 'rgba(79, 70, 229, 0.8)', 
          boxShadow: theme === 'dark' ? '0 0 10px rgba(99, 102, 241, 0.5)' : '0 0 10px rgba(79, 70, 229, 0.3)' 
        }} />
        <div className="absolute top-1/3 left-1/3 w-1.5 h-1.5 rounded-full shadow-lg" style={{ 
          backgroundColor: theme === 'dark' ? 'rgba(34, 197, 94, 1)' : 'rgba(22, 163, 74, 0.8)', 
          boxShadow: theme === 'dark' ? '0 0 10px rgba(34, 197, 94, 0.5)' : '0 0 10px rgba(22, 163, 74, 0.3)' 
        }} />
        <div className="absolute bottom-1/3 right-1/3 w-2 h-2 rounded-full shadow-lg" style={{ 
          backgroundColor: theme === 'dark' ? 'rgba(156, 163, 175, 1)' : 'rgba(100, 116, 139, 0.8)', 
          boxShadow: theme === 'dark' ? '0 0 10px rgba(156, 163, 175, 0.5)' : '0 0 10px rgba(100, 116, 139, 0.3)' 
        }} />
        <div className="absolute top-2/3 right-1/4 w-1 h-1 rounded-full shadow-lg" style={{ 
          backgroundColor: theme === 'dark' ? 'rgba(255, 255, 255, 1)' : 'rgba(71, 85, 105, 0.8)', 
          boxShadow: theme === 'dark' ? '0 0 10px rgba(255, 255, 255, 0.5)' : '0 0 10px rgba(71, 85, 105, 0.3)' 
        }} />
      </div>
    </div>
  );
}
