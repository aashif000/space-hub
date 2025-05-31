
import React, { useState, useMemo } from 'react';
import { useSpaceData } from '../contexts/DataContext';
import { Search, Filter, Star, Globe, Thermometer, Clock } from 'lucide-react';

const ExoplanetExplorer = () => {
  const { exoplanetData } = useSpaceData();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedFilter, setSelectedFilter] = useState('all');

  // Parse XML data (simplified - in reality you'd use a proper XML parser)
  const parsedData = useMemo(() => {
    if (!exoplanetData) return [];
    
    // Simulated parsed exoplanet data
    return [
      {
        id: 1,
        name: 'Kepler-452b',
        star: 'Kepler-452',
        mass: '5.0 Earth masses',
        radius: '1.6 Earth radii',
        period: '385 days',
        distance: '1400 light years',
        habitableZone: true,
        discoveryYear: 2015,
        temperature: '265 K',
      },
      {
        id: 2,
        name: 'TRAPPIST-1e',
        star: 'TRAPPIST-1',
        mass: '0.77 Earth masses',
        radius: '0.92 Earth radii',
        period: '6.1 days',
        distance: '40 light years',
        habitableZone: true,
        discoveryYear: 2017,
        temperature: '251 K',
      },
      {
        id: 3,
        name: 'HD 40307g',
        star: 'HD 40307',
        mass: '7.1 Earth masses',
        radius: '1.8 Earth radii',
        period: '197 days',
        distance: '42 light years',
        habitableZone: true,
        discoveryYear: 2012,
        temperature: '227 K',
      },
      {
        id: 4,
        name: 'Gliese 667Cc',
        star: 'Gliese 667C',
        mass: '3.8 Earth masses',
        radius: '1.5 Earth radii',
        period: '28 days',
        distance: '23.6 light years',
        habitableZone: true,
        discoveryYear: 2011,
        temperature: '277 K',
      },
      {
        id: 5,
        name: 'K2-18b',
        star: 'K2-18',
        mass: '8.6 Earth masses',
        radius: '2.3 Earth radii',
        period: '33 days',
        distance: '124 light years',
        habitableZone: true,
        discoveryYear: 2015,
        temperature: '265 K',
      },
    ];
  }, [exoplanetData]);

  const filteredData = useMemo(() => {
    return parsedData.filter(planet => {
      const matchesSearch = planet.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           planet.star.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesFilter = selectedFilter === 'all' ||
                           (selectedFilter === 'habitable' && planet.habitableZone) ||
                           (selectedFilter === 'recent' && planet.discoveryYear >= 2015);
      return matchesSearch && matchesFilter;
    });
  }, [parsedData, searchTerm, selectedFilter]);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-gradient-to-r from-purple-900/50 to-blue-900/50 rounded-lg p-6 border border-purple-500/20">
        <h2 className="text-3xl font-bold text-white mb-2 flex items-center">
          <Star className="w-8 h-8 mr-3 text-purple-400" />
          Exoplanet Explorer
        </h2>
        <p className="text-purple-200">
          Discover worlds beyond our solar system from the Open Exoplanet Catalogue
        </p>
      </div>

      {/* Controls */}
      <div className="flex flex-col md:flex-row gap-4">
        <div className="flex-1 relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
          <input
            type="text"
            placeholder="Search exoplanets or host stars..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-3 bg-slate-800/50 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:ring-2 focus:ring-purple-500 focus:border-transparent"
          />
        </div>
        
        <div className="flex items-center space-x-2">
          <Filter className="w-5 h-5 text-gray-400" />
          <select
            value={selectedFilter}
            onChange={(e) => setSelectedFilter(e.target.value)}
            className="px-4 py-3 bg-slate-800/50 border border-gray-600 rounded-lg text-white focus:ring-2 focus:ring-purple-500 focus:border-transparent"
          >
            <option value="all">All Planets</option>
            <option value="habitable">Habitable Zone</option>
            <option value="recent">Recent Discoveries</option>
          </select>
        </div>
      </div>

      {/* Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-slate-800/50 rounded-lg p-4 border border-purple-500/20">
          <h3 className="text-purple-400 font-semibold mb-1">Total Exoplanets</h3>
          <p className="text-2xl font-bold text-white">{parsedData.length}</p>
        </div>
        <div className="bg-slate-800/50 rounded-lg p-4 border border-blue-500/20">
          <h3 className="text-blue-400 font-semibold mb-1">Habitable Zone</h3>
          <p className="text-2xl font-bold text-white">
            {parsedData.filter(p => p.habitableZone).length}
          </p>
        </div>
        <div className="bg-slate-800/50 rounded-lg p-4 border border-green-500/20">
          <h3 className="text-green-400 font-semibold mb-1">Recent Discoveries</h3>
          <p className="text-2xl font-bold text-white">
            {parsedData.filter(p => p.discoveryYear >= 2015).length}
          </p>
        </div>
        <div className="bg-slate-800/50 rounded-lg p-4 border border-yellow-500/20">
          <h3 className="text-yellow-400 font-semibold mb-1">Closest</h3>
          <p className="text-2xl font-bold text-white">23.6 LY</p>
        </div>
      </div>

      {/* Exoplanet Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredData.map((planet) => (
          <div key={planet.id} className="bg-slate-800/50 rounded-lg p-6 border border-gray-600 hover:border-purple-500/50 transition-all duration-300 hover:transform hover:scale-105">
            <div className="flex items-start justify-between mb-4">
              <div>
                <h3 className="text-xl font-bold text-white mb-1">{planet.name}</h3>
                <p className="text-purple-400 flex items-center">
                  <Star className="w-4 h-4 mr-1" />
                  {planet.star}
                </p>
              </div>
              {planet.habitableZone && (
                <span className="px-2 py-1 bg-green-500/20 text-green-400 text-xs rounded-full border border-green-500/30">
                  Habitable Zone
                </span>
              )}
            </div>

            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-gray-400 flex items-center">
                  <Globe className="w-4 h-4 mr-2" />
                  Mass
                </span>
                <span className="text-white font-medium">{planet.mass}</span>
              </div>
              
              <div className="flex items-center justify-between">
                <span className="text-gray-400 flex items-center">
                  <Globe className="w-4 h-4 mr-2" />
                  Radius
                </span>
                <span className="text-white font-medium">{planet.radius}</span>
              </div>
              
              <div className="flex items-center justify-between">
                <span className="text-gray-400 flex items-center">
                  <Clock className="w-4 h-4 mr-2" />
                  Period
                </span>
                <span className="text-white font-medium">{planet.period}</span>
              </div>
              
              <div className="flex items-center justify-between">
                <span className="text-gray-400 flex items-center">
                  <Thermometer className="w-4 h-4 mr-2" />
                  Temperature
                </span>
                <span className="text-white font-medium">{planet.temperature}</span>
              </div>
              
              <div className="pt-2 border-t border-gray-700">
                <div className="flex items-center justify-between">
                  <span className="text-gray-400">Distance</span>
                  <span className="text-white font-medium">{planet.distance}</span>
                </div>
                <div className="flex items-center justify-between mt-2">
                  <span className="text-gray-400">Discovered</span>
                  <span className="text-white font-medium">{planet.discoveryYear}</span>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {filteredData.length === 0 && (
        <div className="text-center py-12">
          <Star className="w-16 h-16 mx-auto text-gray-600 mb-4" />
          <h3 className="text-xl font-semibold text-gray-400 mb-2">No exoplanets found</h3>
          <p className="text-gray-500">Try adjusting your search or filter criteria</p>
        </div>
      )}
    </div>
  );
};

export default ExoplanetExplorer;
