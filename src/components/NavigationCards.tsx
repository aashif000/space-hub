import React from 'react';
import { motion } from 'framer-motion';
import { LucideIcon, ChevronRight, Sparkles, Command, Globe, Satellite, Activity, Database, GraduationCap, Info } from 'lucide-react';
import { useTheme } from '../contexts/ThemeContext';

interface NavigationCardProps {
  id: string;
  label: string;
  icon: LucideIcon;
  color: string;
  bgColor: string;
  borderColor: string;
  description: string;
  onClick: () => void;
  index: number;
}

const NavigationCard: React.FC<NavigationCardProps> = ({
  id, label, icon: Icon, color, bgColor, borderColor, description, onClick, index
}) => {
  const { theme } = useTheme();
  
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, delay: index * 0.1 }}
      className={`navigation-card relative overflow-hidden rounded-xl border shadow-lg backdrop-blur-lg ${borderColor} hover:shadow-xl transition-all duration-300 cursor-pointer transform hover:-translate-y-1 aspect-square`}
      onClick={onClick}
      whileHover={{ scale: 1.03 }}
      whileTap={{ scale: 0.98 }}
    >
      {/* Background gradients and effects */}
      <div className={`absolute inset-0 ${bgColor} opacity-20`}></div>
      <div className={`bg-gradient-to-br ${color} absolute -right-6 -top-6 h-24 w-24 rounded-full opacity-20`}></div>
      <div className={`absolute bottom-0 right-0 h-24 w-24 bg-gradient-to-tl ${color} opacity-30 rounded-tl-full`}></div>
      
      {/* Content */}
      <div className="p-6 relative z-10 flex flex-col h-full justify-between">
        <div>
          {/* Icon */}
          <div className="flex items-center mb-4">
            <div className={`p-3 rounded-xl ${bgColor} shadow-lg`}>
              <Icon className="h-7 w-7 text-white" />
            </div>
          </div>
          
          {/* Title and description */}
          <h3 className="text-xl font-bold text-white mb-2">{label}</h3>
          <p className="text-sm text-gray-300 opacity-80">{description}</p>
        </div>
        
        {/* Explore button */}
        <div className="flex items-center justify-between mt-4">
          <div className={`inline-flex items-center rounded-full px-3 py-1 text-xs font-medium ${bgColor} text-white`}>
            Explore
          </div>
          <div className={`w-8 h-8 rounded-full ${bgColor} flex items-center justify-center`}>
            <ChevronRight className="h-5 w-5 text-white" />
          </div>
        </div>
      </div>
      
      {/* Tour target classes */}
      <div className={`${id === 'home' ? 'astro-agent-panel' : ''} ${id === 'kids-zone' ? 'kids-zone-link' : ''} ${id === 'spacex' ? 'spacex-link' : ''} ${id === 'astronaut-db' ? 'astronaut-db-link' : ''} ${id === 'simulators' ? 'simulators-section' : ''}`}></div>
    </motion.div>
  );
};

interface NavigationCardsProps {
  navigationItems: any[];
  activeTab: string;
  onTabChange: (tabId: string) => void;
}

const NavigationCards: React.FC<NavigationCardsProps> = React.memo(({
  navigationItems, activeTab, onTabChange
}) => {
  // Group navigation items by category
  const itemsByCategory = navigationItems.reduce((acc: any, item) => {
    const category = item.category || 'other';
    if (!acc[category]) acc[category] = [];
    acc[category].push(item);
    return acc;
  }, {});

  const categories = {
    featured: { 
      label: 'Featured', 
      order: 1,
      icon: Sparkles,
      color: 'from-indigo-400 to-purple-500' 
    },
    control: { 
      label: 'Mission Control', 
      order: 2,
      icon: Command,
      color: 'from-blue-400 to-cyan-500' 
    },
    exploration: { 
      label: 'Space Exploration', 
      order: 3,
      icon: Globe,
      color: 'from-green-400 to-teal-500' 
    },
    tracking: { 
      label: 'Tracking', 
      order: 4,
      icon: Satellite,
      color: 'from-orange-400 to-amber-500' 
    },
    monitoring: { 
      label: 'Monitoring', 
      order: 5,
      icon: Activity,
      color: 'from-red-400 to-orange-500' 
    },
    database: { 
      label: 'Database', 
      order: 6,
      icon: Database,
      color: 'from-sky-400 to-blue-500' 
    },
    education: { 
      label: 'Education', 
      order: 7,
      icon: GraduationCap,
      color: 'from-yellow-400 to-amber-500' 
    },
    information: { 
      label: 'Information', 
      order: 8,
      icon: Info,
      color: 'from-emerald-400 to-green-500' 
    },
  };

  // Sort categories by order
  const sortedCategories = Object.keys(itemsByCategory).sort(
    (a, b) => (categories[a as keyof typeof categories]?.order || 999) - (categories[b as keyof typeof categories]?.order || 999)
  );

  return (
    <div className="space-y-12">
      {sortedCategories.map((category) => {
        const categoryInfo = categories[category as keyof typeof categories];
        const Icon = categoryInfo?.icon || Sparkles;
        
        return (
          <motion.div 
            key={category} 
            className="space-y-6"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <div className="flex items-center space-x-4 mb-6">
              <div className="flex items-center justify-center w-10 h-10 rounded-xl bg-slate-800/80 backdrop-blur-lg border border-slate-700/50">
                <Icon className="h-5 w-5 text-white" />
              </div>
              <h2 className="text-2xl font-bold flex items-center">
                <span className={`text-transparent bg-clip-text bg-gradient-to-r ${categoryInfo?.color || 'from-blue-400 to-purple-500'}`}>
                  {categoryInfo?.label || category}
                </span>
              </h2>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {itemsByCategory[category].map((item: any, index: number) => (
                <NavigationCard
                  key={item.id}
                  id={item.id}
                  label={item.label}
                  icon={item.icon}
                  color={item.color}
                  bgColor={item.bgColor}
                  borderColor={item.borderColor}
                  description={item.description}
                  onClick={() => onTabChange(item.id)}
                  index={index}
                />
              ))}
            </div>
          </motion.div>
        );
      })}
    </div>  );
});

export default NavigationCards;
