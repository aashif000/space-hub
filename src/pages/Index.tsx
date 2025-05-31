
import React, { useState } from 'react';
import { useSpaceData } from '../contexts/DataContext';
import LoadingScreen from '../components/LoadingScreen';
import Dashboard from '../components/Dashboard';
import { EnhancedSpaceXDashboard } from '../components/spacex/EnhancedSpaceXDashboard';
import SolarSystemExplorer from '../components/SolarSystemExplorer';
import SatelliteTracker from '../components/SatelliteTracker';
import LaunchLibraryExplorer from '../components/LaunchLibraryExplorer';
import ExoplanetExplorer from '../components/ExoplanetExplorer';
import AstronautDatabase from '../components/AstronautDatabase';
import SpaceWeatherMonitor from '../components/SpaceWeatherMonitor';
import { CopernicusDataExplorer } from '../components/satellite/CopernicusDataExplorer';
import { SpaceflightNewsExplorer } from '../components/news/SpaceflightNewsExplorer';
import { SpacePopulationTracker } from '../components/space/SpacePopulationTracker';
import { AnimatedSidebar } from '../components/ui/animated-sidebar';
import { 
  Rocket, 
  Satellite, 
  Globe, 
  Users, 
  Activity, 
  Search, 
  Star, 
  Shield,
  Newspaper,
  Earth,
  UserCheck
} from 'lucide-react';

const Index = () => {
  const { allDataLoaded } = useSpaceData();
  const [activeTab, setActiveTab] = useState('dashboard');

  if (!allDataLoaded) {
    return <LoadingScreen />;
  }

  const navigationItems = [
    { id: 'dashboard', label: 'Explore', icon: Activity, component: Dashboard },
    { id: 'spacex', label: 'SpaceX Explorer', icon: Rocket, component: EnhancedSpaceXDashboard },
    { id: 'solar-system', label: 'Solar System', icon: Globe, component: SolarSystemExplorer },
    { id: 'space-weather', label: 'Space Weather', icon: Shield, component: SpaceWeatherMonitor },
    { id: 'copernicus', label: 'Earth Observation', icon: Earth, component: CopernicusDataExplorer },
    { id: 'satellites', label: 'Satellite Tracker', icon: Satellite, component: SatelliteTracker },
    { id: 'space-population', label: 'Ship Simulator', icon: UserCheck, component: SpacePopulationTracker },
    { id: 'launch-library', label: 'Fliers', icon: Search, component: LaunchLibraryExplorer },
    { id: 'exoplanets', label: 'Exoplanets', icon: Star, component: ExoplanetExplorer },
    { id: 'astronauts', label: 'Astronauts', icon: Users, component: AstronautDatabase },
    
    
    { id: 'news', label: 'Space News', icon: Newspaper, component: SpaceflightNewsExplorer },
    
  ];

  const ActiveComponent = navigationItems.find(item => item.id === activeTab)?.component || Dashboard;

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-blue-950 to-indigo-950 flex">
      {/* Animated Sidebar */}
      <AnimatedSidebar>
        <div className="space-y-2">
          {/* Logo */}
          <div className="flex items-center gap-3 mb-6 p-2">
            <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center flex-shrink-0">
              <Rocket className="w-6 h-6 text-white" />
            </div>
            <h1 className="text-xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent whitespace-nowrap">
              Cosmic Nexus
            </h1>
          </div>

          {/* Navigation Items */}
          {navigationItems.map((item) => (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              className={`w-full flex items-center gap-3 px-3 py-3 rounded-lg transition-all duration-200 text-left ${
                activeTab === item.id
                  ? 'bg-blue-600/30 text-blue-400 border border-blue-500/50'
                  : 'text-gray-400 hover:text-blue-400 hover:bg-blue-600/10'
              }`}
            >
              <item.icon className="w-5 h-5 flex-shrink-0" />
              <span className="text-sm font-medium whitespace-nowrap">{item.label}</span>
            </button>
          ))}
        </div>
      </AnimatedSidebar>

      {/* Main Content */}
      <main className="flex-1 ml-16 transition-all duration-300">
        <div className="container mx-auto px-6 py-8">
          <ActiveComponent />
        </div>
      </main>
    </div>
  );
};

export default Index;
