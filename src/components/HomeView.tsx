import React from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from './ui/card';
import { useTheme } from '../contexts/ThemeContext';
import { Button } from './ui/button';
import { ArrowRight, Star } from 'lucide-react';

interface NavigationItem {
  id: string;
  label: string;
  icon: React.ElementType;
  component: React.ComponentType;
  color: string;
  bgColor: string;
  borderColor: string;
  description: string;
  category: string;
}

interface HomeViewProps {
  navigationItems: NavigationItem[];
  activeTab: string;
  setActiveTab: (tabId: string) => void;
}

const HomeView: React.FC<HomeViewProps> = ({ navigationItems, activeTab, setActiveTab }) => {
  const { theme } = useTheme();
  
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        delayChildren: 0.3,
        staggerChildren: 0.2
      }
    }
  };
  
  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1
    }
  };

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className="space-y-8"
    >      {/* Welcome Header */}
      <motion.div variants={itemVariants} className="text-center">
        <h1 className={`text-4xl font-bold mb-4 ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
          Welcome to <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">Space Hub</span>
        </h1>
        <p className={`text-xl mb-4 ${theme === 'dark' ? 'text-gray-200' : 'text-gray-600'}`}>
          Explore the cosmos with our interactive tools and visualizations
        </p>
        <div className={`inline-flex items-center gap-2 px-4 py-2 rounded-full ${
          theme === 'dark' ? 'bg-blue-600/20 text-blue-400' : 'bg-blue-100 text-blue-600'
        }`}>
          <Star className="w-4 h-4" />
          <span className="text-sm font-medium">{navigationItems.length} Amazing Features Available</span>
        </div>
      </motion.div>
        {/* Main Navigation Cards */}
      <motion.div 
        variants={itemVariants}
        className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4"
      >
        {navigationItems.map((item) => (
          <Card 
            key={item.id}
            className={`border transition-all duration-300 hover:shadow-lg aspect-square ${
              theme === 'dark' 
                ? `bg-gradient-to-br from-slate-800/50 to-slate-900/50 ${item.borderColor} hover:shadow-${item.color.split('-')[1]}-500/20` 
                : `bg-white hover:bg-gradient-to-br hover:from-white to-${item.color.split('-')[1]}-50/50 ${item.borderColor} hover:shadow-${item.color.split('-')[1]}-400/20`
            }`}
          >            <CardHeader className="pb-0">
              <div className={`flex flex-col items-center justify-center text-center p-2 mb-3`}>
                <div className={`p-3 rounded-full bg-gradient-to-br ${item.color} mb-3`}>
                  <item.icon className="w-6 h-6 text-white" />
                </div>
                <CardTitle className={`${theme === 'dark' ? 'text-white' : 'text-gray-900'} text-lg`}>
                  {item.label}
                </CardTitle>
              </div>
            </CardHeader>
            <CardContent className="text-center pt-0">
              <CardDescription className={`${theme === 'dark' ? 'text-gray-300' : 'text-gray-600'} text-sm line-clamp-2 mb-2`}>
                {item.description}
              </CardDescription>
            </CardContent>
            <CardFooter className="mt-auto pt-0">
              <Button 
                variant="ghost" 
                className="w-full justify-center hover:bg-opacity-20"
                onClick={() => setActiveTab(item.id)}
              >
                <span className="mr-2">Launch</span>
                <ArrowRight className="w-4 h-4" />
              </Button>
            </CardFooter>
          </Card>
        ))}
      </motion.div>
      
      {/* Featured Content */}
      <motion.div variants={itemVariants} className="mt-12">
        <div className={`rounded-lg p-6 border ${
          theme === 'dark' 
            ? 'bg-gradient-to-r from-blue-900/30 to-purple-900/30 border-blue-500/30' 
            : 'bg-gradient-to-r from-blue-500/10 to-purple-500/10 border-blue-400/30'
        }`}>
          <h2 className={`text-2xl font-bold mb-4 ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
            Latest Space Discoveries
          </h2>
          <p className={`${theme === 'dark' ? 'text-blue-200' : 'text-blue-700'}`}>
            Stay updated with the most recent breakthroughs in space exploration and astronomy
          </p>
        </div>
      </motion.div>
    </motion.div>
  );
};

export default HomeView;


