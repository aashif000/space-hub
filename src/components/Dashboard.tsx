
import React from 'react';
import { useSpaceData } from '../contexts/DataContext';
import { Rocket, Satellite, Globe, Users, Activity, AlertTriangle } from 'lucide-react';

const Dashboard = () => {
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

  return (
    <div className="space-y-6">
      {/* Welcome Header */}
      <div className="bg-gradient-to-r from-blue-900/50 to-purple-900/50 rounded-lg p-6 border border-blue-500/20">
        <h1 className="text-4xl font-bold text-white mb-2">Explore</h1>
        <p className="text-blue-200 text-lg">
          Welcome to Cosmic Nexus - Your gateway to space exploration data
        </p>
      </div>

      {/* Statistics Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, index) => (
          <div key={index} className="bg-slate-800/50 rounded-lg p-6 border border-gray-600 hover:border-blue-500/50 transition-all duration-300">
            <div className="flex items-center justify-between mb-4">
              <stat.icon className={`w-8 h-8 text-${stat.color}-400`} />
              <span className={`px-2 py-1 bg-${stat.color}-500/20 text-${stat.color}-400 text-xs rounded-full`}>
                LIVE
              </span>
            </div>
            <h3 className="text-2xl font-bold text-white mb-1">{stat.value}</h3>
            <p className="text-gray-400 text-sm font-medium mb-1">{stat.title}</p>
            <p className="text-gray-500 text-xs">{stat.description}</p>
          </div>
        ))}
      </div>

      {/* Recent Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Latest SpaceX Launch */}
        <div className="bg-slate-800/50 rounded-lg p-6 border border-gray-600">
          <h3 className="text-xl font-bold text-white mb-4 flex items-center">
            <Rocket className="w-6 h-6 mr-2 text-blue-400" />
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
        </div>

        {/* ISS Position */}
        <div className="bg-slate-800/50 rounded-lg p-6 border border-gray-600">
          <h3 className="text-xl font-bold text-white mb-4 flex items-center">
            <Satellite className="w-6 h-6 mr-2 text-green-400" />
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
      </div>

      {/* System Status */}
      <div className="bg-slate-800/50 rounded-lg p-6 border border-gray-600">
        <h3 className="text-xl font-bold text-white mb-4 flex items-center">
          <Activity className="w-6 h-6 mr-2 text-purple-400" />
          System Connection
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="flex items-center justify-between p-3 bg-green-500/10 rounded-lg border border-green-500/20">
            <span className="text-green-400">SpaceX</span>
            <div className="w-3 h-3 bg-green-400 rounded-full animate-pulse"></div>
          </div>
          <div className="flex items-center justify-between p-3 bg-green-500/10 rounded-lg border border-green-500/20">
            <span className="text-green-400">ISS Tracker</span>
            <div className="w-3 h-3 bg-green-400 rounded-full animate-pulse"></div>
          </div>
          <div className="flex items-center justify-between p-3 bg-green-500/10 rounded-lg border border-green-500/20">
            <span className="text-green-400">Launch Library</span>
            <div className="w-3 h-3 bg-green-400 rounded-full animate-pulse"></div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
