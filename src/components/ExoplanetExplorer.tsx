
import React, { useState, useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Input } from './ui/input';
import { Badge } from './ui/badge';
import { Button } from './ui/button';
import { useSpaceData } from '../contexts/DataContext';
import { useTheme } from '../contexts/ThemeContext';
import { Search, Filter, Star, Globe, Thermometer, Clock, Telescope, Orbit, Zap, Eye, ExternalLink } from 'lucide-react';

const ExoplanetExplorer = () => {
  const { theme } = useTheme();
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
      {/* Enhanced Header */}
      <div className="bg-gradient-to-r from-purple-900/50 via-indigo-900/50 to-blue-900/50 rounded-xl p-6 border border-purple-500/30 shadow-2xl">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <div className="relative">
              <Telescope className="w-10 h-10 text-purple-400 animate-pulse" />
              <div className="absolute -top-1 -right-1 w-4 h-4 bg-green-400 rounded-full animate-ping"></div>
            </div>
            <div>
              <h2 className="text-3xl font-bold text-white mb-1">
                Exoplanet Explorer
              </h2>
              <p className="text-purple-200">
                Discover worlds beyond our solar system
              </p>
            </div>
          </div>
          <div className="hidden md:flex items-center space-x-6 text-sm">
            <div className="text-center">
              <div className="text-2xl font-bold text-purple-400">{parsedData.length}</div>
              <div className="text-purple-200">Exoplanets</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-green-400">{parsedData.filter(p => p.habitableZone).length}</div>
              <div className="text-green-200">Habitable</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-blue-400">{parsedData.filter(p => p.discoveryYear >= 2015).length}</div>
              <div className="text-blue-200">Recent</div>
            </div>
          </div>
        </div>
      </div>      {/* Enhanced Controls */}
      <div className="bg-slate-800/30 rounded-xl p-6 border border-slate-600/50">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1 relative">
            <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-purple-400 w-5 h-5" />
            <input
              type="text"
              placeholder="Search exoplanets or host stars..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-12 pr-4 py-3 bg-slate-900/50 border border-purple-500/30 rounded-lg text-white placeholder-gray-400 focus:ring-2 focus:ring-purple-400 focus:border-purple-400 transition-all duration-300"
            />
          </div>
          
          <div className="flex items-center space-x-3">
            <Filter className="w-5 h-5 text-purple-400" />
            <select
              value={selectedFilter}
              onChange={(e) => setSelectedFilter(e.target.value)}
              className="px-4 py-3 bg-slate-900/50 border border-purple-500/30 rounded-lg text-white focus:ring-2 focus:ring-purple-400 focus:border-purple-400 transition-all duration-300 cursor-pointer"
            >
              <option value="all">All Planets</option>
              <option value="habitable">Habitable Zone</option>
              <option value="recent">Recent Discoveries</option>
            </select>
          </div>
        </div>
      </div>      {/* Enhanced Statistics Dashboard */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className={`border transition-all duration-300 ${
          theme === 'dark' 
            ? 'bg-gradient-to-br from-purple-900/40 to-purple-800/20 border-purple-500/30 hover:from-purple-900/60 hover:to-purple-800/40' 
            : 'bg-gradient-to-br from-purple-50 to-purple-100 border-purple-300/50 hover:from-purple-100 hover:to-purple-200'
        }`}>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className={`text-sm font-medium ${
                  theme === 'dark' ? 'text-purple-300' : 'text-purple-700'
                }`}>Total Discovered</p>
                <p className={`text-2xl font-bold ${
                  theme === 'dark' ? 'text-white' : 'text-gray-900'
                }`}>{parsedData.length}</p>
              </div>
              <Telescope className={`w-8 h-8 ${
                theme === 'dark' ? 'text-purple-400' : 'text-purple-600'
              }`} />
            </div>
          </CardContent>
        </Card>
        
        <Card className="bg-gradient-to-br from-green-900/40 to-green-800/20 border-green-500/30 hover:from-green-900/60 hover:to-green-800/40 transition-all duration-300">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-green-300 text-sm font-medium">Habitable Zone</p>
                <p className="text-2xl font-bold text-white">
                  {parsedData.filter(p => p.habitableZone).length}
                </p>
              </div>
              <Globe className="w-8 h-8 text-green-400" />
            </div>
          </CardContent>
        </Card>
        
        <Card className="bg-gradient-to-br from-blue-900/40 to-blue-800/20 border-blue-500/30 hover:from-blue-900/60 hover:to-blue-800/40 transition-all duration-300">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-blue-300 text-sm font-medium">Recent Finds</p>
                <p className="text-2xl font-bold text-white">
                  {parsedData.filter(p => p.discoveryYear >= 2015).length}
                </p>
              </div>
              <Zap className="w-8 h-8 text-blue-400" />
            </div>
          </CardContent>
        </Card>
        
        <Card className="bg-gradient-to-br from-yellow-900/40 to-yellow-800/20 border-yellow-500/30 hover:from-yellow-900/60 hover:to-yellow-800/40 transition-all duration-300">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-yellow-300 text-sm font-medium">Closest</p>
                <p className="text-2xl font-bold text-white">23.6 LY</p>
              </div>
              <Star className="w-8 h-8 text-yellow-400" />
            </div>
          </CardContent>
        </Card>
      </div>      {/* Enhanced Exoplanet Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredData.map((planet) => (
          <Card key={planet.id} className="bg-gradient-to-br from-slate-900/80 to-slate-800/40 border-slate-600/50 hover:border-purple-500/50 transition-all duration-300 hover:transform hover:scale-105 hover:shadow-2xl hover:shadow-purple-500/10 group">
            <CardContent className="p-6">
              <div className="flex items-start justify-between mb-4">
                <div className="flex-1">
                  <h3 className="text-xl font-bold text-white mb-2 group-hover:text-purple-300 transition-colors">
                    {planet.name}
                  </h3>
                  <div className="flex items-center text-purple-400 mb-2">
                    <Star className="w-4 h-4 mr-2" />
                    <span className="font-medium">{planet.star}</span>
                  </div>
                </div>
                <div className="flex flex-col items-end space-y-2">
                  {planet.habitableZone && (
                    <Badge className="bg-green-500/20 text-green-400 border-green-500/30 px-2 py-1 text-xs">
                      <Globe className="w-3 h-3 mr-1" />
                      Habitable
                    </Badge>
                  )}
                  <Button
                    variant="outline"
                    size="sm"
                    className="border-purple-500/30 text-purple-400 hover:bg-purple-500/10 hover:border-purple-400 transition-all duration-300"
                  >
                    <ExternalLink className="w-3 h-3 mr-1" />
                    Details
                  </Button>
                </div>
              </div>

              <div className="space-y-3">
                <div className="grid grid-cols-2 gap-3">
                  <div className="bg-slate-800/50 rounded-lg p-3 border border-slate-600/30">
                    <div className="flex items-center text-gray-400 text-xs mb-1">
                      <Globe className="w-3 h-3 mr-1" />
                      Mass
                    </div>
                    <div className="text-white font-semibold text-sm">{planet.mass}</div>
                  </div>
                  
                  <div className="bg-slate-800/50 rounded-lg p-3 border border-slate-600/30">
                    <div className="flex items-center text-gray-400 text-xs mb-1">
                      <Orbit className="w-3 h-3 mr-1" />
                      Radius
                    </div>
                    <div className="text-white font-semibold text-sm">{planet.radius}</div>
                  </div>
                </div>
                
                <div className="bg-slate-800/50 rounded-lg p-3 border border-slate-600/30">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center text-gray-400 text-xs">
                      <Clock className="w-3 h-3 mr-1" />
                      Orbital Period
                    </div>
                    <div className="text-white font-medium text-sm">{planet.period}</div>
                  </div>
                </div>
                
                <div className="bg-slate-800/50 rounded-lg p-3 border border-slate-600/30">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center text-gray-400 text-xs">
                      <Thermometer className="w-3 h-3 mr-1" />
                      Temperature
                    </div>
                    <div className="text-white font-medium text-sm">{planet.temperature}</div>
                  </div>
                </div>
                
                <div className="pt-3 border-t border-slate-700/50">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-gray-400 text-xs">Distance</span>
                    <span className="text-blue-400 font-semibold text-sm">{planet.distance}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-gray-400 text-xs">Discovered</span>
                    <span className="text-green-400 font-semibold text-sm">{planet.discoveryYear}</span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>      {/* Enhanced Empty State */}
      {filteredData.length === 0 && (
        <Card className="bg-slate-800/30 border-slate-600/50">
          <CardContent className="text-center py-12">
            <div className="relative mb-6">
              <Telescope className="w-20 h-20 mx-auto text-gray-600 mb-4" />
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="w-16 h-16 border-2 border-purple-500/20 rounded-full animate-ping"></div>
              </div>
            </div>
            <h3 className="text-xl font-semibold text-gray-300 mb-2">No exoplanets found</h3>
            <p className="text-gray-500 mb-4">Try adjusting your search or filter criteria</p>
            <Button
              variant="outline"
              onClick={() => {
                setSearchTerm('');
                setSelectedFilter('all');
              }}
              className="border-purple-500/30 text-purple-400 hover:bg-purple-500/10"
            >
              <Eye className="w-4 h-4 mr-2" />
              Show All Exoplanets
            </Button>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default ExoplanetExplorer;
