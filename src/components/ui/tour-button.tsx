import { Button } from "./button";
import { HelpCircle } from "lucide-react";
import { useTheme } from "../../contexts/ThemeContext";
import { motion } from "framer-motion";

interface TourButtonProps {
  startTour: () => void;
  position?: 'top-left' | 'top-right' | 'bottom-left' | 'bottom-right';
  size?: 'sm' | 'md' | 'lg';
  label?: string;
}

export function TourButton({
  startTour,
  position = 'bottom-right',
  size = 'md',
  label = 'Site Tour'
}: TourButtonProps) {
  const { theme } = useTheme();
  
  // Determine position classes
  const positionClasses = {
    'top-left': 'top-4 left-4',
    'top-right': 'top-4 right-4',
    'bottom-left': 'bottom-4 left-4',
    'bottom-right': 'bottom-4 right-4',
  };
  
  // Determine size classes
  const sizeClasses = {
    'sm': 'p-2 text-xs',
    'md': 'p-3 text-sm',
    'lg': 'p-4 text-base',
  };
  
  const iconSizes = {
    'sm': 'w-4 h-4',
    'md': 'w-5 h-5',
    'lg': 'w-6 h-6',
  };

  return (
    <motion.div
      className={`fixed ${positionClasses[position]} z-50`}
      initial={{ scale: 0, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      transition={{ delay: 1, duration: 0.5 }}
    >
      <Button
        onClick={startTour}
        className={`${sizeClasses[size]} flex items-center gap-2 shadow-lg ${
          theme === 'dark' 
            ? 'bg-indigo-600 hover:bg-indigo-700 text-white' 
            : 'bg-indigo-500 hover:bg-indigo-600 text-white'
        }`}
        variant="default"
      >
        <HelpCircle className={`${iconSizes[size]} ${
          theme === 'dark' ? 'text-indigo-200' : 'text-indigo-100'
        }`} />
        {label && <span>{label}</span>}
      </Button>
    </motion.div>
  );
}
