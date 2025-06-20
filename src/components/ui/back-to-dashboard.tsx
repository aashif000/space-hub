import React from 'react';
import { motion } from 'framer-motion';
import { ArrowLeft, Home } from 'lucide-react';
import { Button } from './button';
import { useTheme } from '../../contexts/ThemeContext';

interface BackToDashboardProps {
  onBack: () => void;
  title?: string;
}

export const BackToDashboard: React.FC<BackToDashboardProps> = ({ 
  onBack,
  title = 'Back to Dashboard'
}) => {
  const { theme } = useTheme();
  
  return (
    <motion.div
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="mb-6"
    >
      <Button
        variant="outline" 
        size="sm"
        onClick={onBack}
        className={`flex items-center shadow-lg ${
          theme === 'dark' 
            ? 'bg-slate-800/80 hover:bg-slate-800 border-slate-700' 
            : 'bg-slate-100 hover:bg-slate-200 border-slate-300'
        }`}
      >
        <ArrowLeft className="h-4 w-4 mr-2" />
        <span>{title}</span>
      </Button>
    </motion.div>
  );
};
