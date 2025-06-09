
import React from 'react';
import { Rocket, Globe, Satellite } from 'lucide-react';
import { useTheme } from '../contexts/ThemeContext';

const LoadingScreen = () => {
  const { theme } = useTheme();
  const loadingSteps = [
    'Connecting to NASA mission control...',
    'Loading SpaceX launch data...',
    'Tracking ISS position...',
    'Fetching exoplanet discoveries...',
    'Synchronizing satellite telemetry...',
    'Preparing mission dashboard...',
  ];

  const [currentStep, setCurrentStep] = React.useState(0);

  React.useEffect(() => {
    const interval = setInterval(() => {
      setCurrentStep((prev) => (prev + 1) % loadingSteps.length);
    }, 800);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className={`min-h-screen flex items-center justify-center transition-colors duration-500 ${
      theme === 'dark' 
        ? 'bg-gradient-to-br from-slate-950 via-blue-950 to-indigo-950' 
        : 'bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50'
    }`}>
      <div className="text-center max-w-md mx-auto px-6">
        {/* Logo Animation */}
        <div className="relative mb-8">
          <div className="w-24 h-24 mx-auto mb-6 relative">
            <div className="absolute inset-0 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full animate-pulse"></div>
            <div className="absolute inset-2 bg-slate-950 rounded-full flex items-center justify-center">
              <Rocket className="w-8 h-8 text-blue-400 animate-bounce" />
            </div>
          </div>
          
          {/* Orbiting Icons */}
          <div className="absolute inset-0 animate-spin" style={{ animationDuration: '3s' }}>
            <Satellite className="absolute top-0 left-1/2 transform -translate-x-1/2 w-4 h-4 text-blue-300" />
          </div>
          <div className="absolute inset-0 animate-spin" style={{ animationDuration: '4s', animationDirection: 'reverse' }}>
            <Globe className="absolute bottom-0 left-1/2 transform -translate-x-1/2 w-4 h-4 text-purple-300" />
          </div>
        </div>        {/* Title */}
        <h1 className={`text-4xl font-bold bg-gradient-to-r bg-clip-text text-transparent mb-4 ${
          theme === 'dark' 
            ? 'from-blue-400 to-purple-400' 
            : 'from-indigo-600 to-purple-600'
        }`}>
          Cosmic Nexus
        </h1>
        
        <p className={`mb-8 ${
          theme === 'dark' ? 'text-gray-400' : 'text-gray-600'
        }`}>
          Initializing space exploration systems...
        </p>

        {/* Loading Progress */}
        <div className="mb-6">
          <div className={`w-full rounded-full h-2 mb-4 ${
            theme === 'dark' ? 'bg-slate-800' : 'bg-gray-200'
          }`}>
            <div 
              className={`h-2 rounded-full transition-all duration-300 ${
                theme === 'dark' 
                  ? 'bg-gradient-to-r from-blue-500 to-purple-600' 
                  : 'bg-gradient-to-r from-indigo-500 to-purple-500'
              }`}
              style={{ width: `${((currentStep + 1) / loadingSteps.length) * 100}%` }}
            ></div>
          </div>
          
          <p className={`text-sm animate-pulse ${
            theme === 'dark' ? 'text-blue-300' : 'text-indigo-600'
          }`}>
            {loadingSteps[currentStep]}
          </p>
        </div>

        {/* Feature Preview */}
        <div className="grid grid-cols-3 gap-4 mt-8">
          {['Real-time ISS', 'SpaceX Data', 'Exoplanets'].map((feature, index) => (
            <div key={feature} className="bg-slate-800/50 rounded-lg p-3 border border-blue-500/20">
              <div className={`w-2 h-2 rounded-full mx-auto mb-2 ${
                currentStep >= index ? 'bg-green-400' : 'bg-gray-600'
              }`}></div>
              <p className="text-xs text-gray-400">{feature}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default LoadingScreen;
