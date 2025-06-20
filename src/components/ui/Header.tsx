import React from 'react';
import { motion } from 'framer-motion';
import { Moon, Sun } from 'lucide-react';
import { useTheme } from '../../contexts/ThemeContext';

interface HeaderProps {
  title?: string;
  showThemeToggle?: boolean;
  className?: string;
}

const Header: React.FC<HeaderProps> = ({
  title = 'Space Hub',
  showThemeToggle = true,
  className = ''
}) => {
  const { theme, toggleTheme } = useTheme();
  
  return (
    <header className={`fixed top-0 left-0 right-0 z-30 px-6 py-4 backdrop-blur-lg ${
      theme === 'dark' 
        ? 'bg-slate-900/70 border-b border-slate-700/50' 
        : 'bg-white/70 border-b border-slate-200/50'
    } ${className}`}>
      <div className="container mx-auto flex items-center justify-between">
        <div className="flex items-center">
          <motion.div
            className="w-8 h-8 mr-3 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center"
            whileHover={{ rotate: 10, scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <span className="text-white text-xl font-bold">S</span>
          </motion.div>
          <h1 className="text-xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-500 to-indigo-500">
            {title}
          </h1>
        </div>
        
        {showThemeToggle && (
          <motion.button
            onClick={toggleTheme}
            className={`theme-toggle p-2 rounded-full ${
              theme === 'dark' 
                ? 'bg-slate-800 text-yellow-400 hover:bg-slate-700' 
                : 'bg-slate-200 text-slate-700 hover:bg-slate-300'
            } transition-colors`}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            aria-label={theme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode'}
          >
            {theme === 'dark' ? (
              <Sun className="w-5 h-5" />
            ) : (
              <Moon className="w-5 h-5" />
            )}
          </motion.button>
        )}
      </div>
    </header>
  );
};

export default Header;
