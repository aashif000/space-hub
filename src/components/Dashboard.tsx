
import React from 'react';
import { useSpaceData } from '../contexts/DataContext';
import { useTheme } from '../contexts/ThemeContext';
import { Rocket, Satellite, Globe, Users, Activity, AlertTriangle } from 'lucide-react';

const Dashboard = () => {
  const { theme } = useTheme();
  const { spaceXData, issData, launchLibraryData, allDataLoaded } = useSpaceData();

  if (!allDataLoaded) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  const stats = [
    {
      title: 'Total SpaceX Launches',
      value: spaceXData?.launches?.length || 0,
      icon: Rocket,
      color: 'blue',
      description: 'Successful missions',
    },
    {
      title: 'ISS Altitude',
      value: `${Math.round(issData?.position?.altitude || 0)} km`,
      icon: Satellite,
      color: 'green',
      description: 'Current orbital height',
    },
    {
      title: 'Active Astronauts',
      value: launchLibraryData?.astronauts?.count || 0,
      icon: Users,
      color: 'purple',
      description: 'Currently in space',
    },
    {
      title: 'Space Agencies',
      value: launchLibraryData?.agencies?.count || 0,
      icon: Globe,
      color: 'orange',
      description: 'Worldwide organizations',
    },
  ];

  return (    <div className="space-y-6">
      {/* Welcome Header */}
      <div className={`rounded-lg p-6 border ${
        theme === 'dark' 
          ? 'bg-gradient-to-r from-blue-900/50 to-purple-900/50 border-blue-500/20' 
          : 'bg-gradient-to-r from-blue-500/10 to-purple-500/10 border-blue-400/30'
      }`}>
        <h1 className={`text-4xl font-bold mb-2 ${
          theme === 'dark' ? 'text-white' : 'text-gray-900'
        }`}>Explore</h1>
        <p className={`text-lg ${
          theme === 'dark' ? 'text-blue-200' : 'text-blue-700'
        }`}>
          Welcome to Cosmic Nexus - Your gateway to space exploration data
        </p>
      </div>      {/* Statistics Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat, index) => (
          <div key={index} className="bg-slate-800/50 rounded-lg p-6 border border-gray-600 hover:border-blue-500/50 transition-all duration-300 aspect-square flex flex-col">
            <div className="flex items-center justify-between mb-4">
              <div className={`p-3 rounded-full bg-${stat.color}-500/20`}>
                <stat.icon className={`w-6 h-6 text-${stat.color}-400`} />
              </div>
              <span className={`px-2 py-1 bg-${stat.color}-500/20 text-${stat.color}-400 text-xs rounded-full`}>
                LIVE
              </span>
            </div>
            <div className="flex flex-col justify-center flex-grow">
              <h3 className="text-3xl font-bold text-white mb-2">{stat.value}</h3>
              <p className="text-gray-400 text-sm font-medium mb-1">{stat.title}</p>
              <p className="text-gray-500 text-xs">{stat.description}</p>
            </div>
          </div>
        ))}
      </div>      {/* Recent Activity */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Latest SpaceX Launch */}
        <div className="bg-slate-800/50 rounded-lg p-6 border border-gray-600 hover:border-blue-500/30 transition-duration-300">
          <h3 className="text-xl font-bold text-white mb-4 flex items-center">
            <div className="p-2 rounded-lg bg-blue-500/20 mr-3">
              <Rocket className="w-5 h-5 text-blue-400" />
            </div>
            Latest SpaceX Launch
          </h3>
          {spaceXData?.launches?.[0] && (
            <div className="space-y-3">
              <h4 className="text-lg font-semibold text-white">{spaceXData.launches[0].name}</h4>
              <p className="text-gray-400">
                {new Date(spaceXData.launches[0].date_utc).toLocaleDateString()}
              </p>
              <div className="flex items-center space-x-2">
                <span className={`px-2 py-1 rounded-full text-xs ${
                  spaceXData.launches[0].success ? 'bg-green-500/20 text-green-400' : 'bg-red-500/20 text-red-400'
                }`}>
                  {spaceXData.launches[0].success ? 'SUCCESS' : 'FAILURE'}
                </span>
                <span className="text-gray-500 text-sm">{spaceXData.launches[0].rocket}</span>
              </div>
            </div>
          )}
        </div>        {/* ISS Position */}
        <div className="bg-slate-800/50 rounded-lg p-6 border border-gray-600 hover:border-green-500/30 transition-duration-300">
          <h3 className="text-xl font-bold text-white mb-4 flex items-center">
            <div className="p-2 rounded-lg bg-green-500/20 mr-3">
              <Satellite className="w-5 h-5 text-green-400" />
            </div>
            ISS Current Position
          </h3>
          {issData?.position && (
            <div className="space-y-3">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-gray-400 text-sm">Latitude</p>
                  <p className="text-white font-semibold">{issData.position.latitude?.toFixed(4)}°</p>
                </div>
                <div>
                  <p className="text-gray-400 text-sm">Longitude</p>
                  <p className="text-white font-semibold">{issData.position.longitude?.toFixed(4)}°</p>
                </div>
                <div>
                  <p className="text-gray-400 text-sm">Altitude</p>
                  <p className="text-white font-semibold">{Math.round(issData.position.altitude)} km</p>
                </div>
                <div>
                  <p className="text-gray-400 text-sm">Velocity</p>
                  <p className="text-white font-semibold">{Math.round(issData.position.velocity)} km/h</p>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>      {/* System Status */}
      <div className="bg-slate-800/50 rounded-lg p-6 border border-gray-600 hover:border-purple-500/30 transition-duration-300">
        <h3 className="text-xl font-bold text-white mb-4 flex items-center">
          <div className="p-2 rounded-lg bg-purple-500/20 mr-3">
            <Activity className="w-5 h-5 text-purple-400" />
          </div>
          System Connection
        </h3>        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="flex items-center justify-between p-3 bg-green-500/10 rounded-lg border border-green-500/20 hover:border-green-500/40 transition-all duration-200">
            <span className="text-green-400 font-medium">SpaceX</span>
            <div className="w-3 h-3 bg-green-400 rounded-full animate-pulse"></div>
          </div>
          <div className="flex items-center justify-between p-3 bg-green-500/10 rounded-lg border border-green-500/20 hover:border-green-500/40 transition-all duration-200">
            <span className="text-green-400 font-medium">ISS Tracker</span>
            <div className="w-3 h-3 bg-green-400 rounded-full animate-pulse"></div>
          </div>
          <div className="flex items-center justify-between p-3 bg-green-500/10 rounded-lg border border-green-500/20 hover:border-green-500/40 transition-all duration-200">
            <span className="text-green-400 font-medium">Launch Library</span>
            <div className="w-3 h-3 bg-green-400 rounded-full animate-pulse"></div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
