import React, { useState, useEffect, useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Input } from './ui/input';
import { Badge } from './ui/badge';
import { Button } from './ui/button';
import { useTheme } from '../contexts/ThemeContext';
import { Globe, Search, Filter, Star, Orbit, Moon, Zap, Info, ExternalLink } from 'lucide-react';
import { EnhancedInteractiveSpaceScene } from './ui/enhanced-interactive-space-scene';

const SolarSystemExplorer: React.FC = () => {
  const { theme } = useTheme();
  const [allBodies, setAllBodies] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [typeFilter, setTypeFilter] = useState<string>('all');
  // Fetch the solar system bodies from the public API on mount
  useEffect(() => {
    const fetchBodies = async () => {
      try {
        const resp = await fetch('https://api.le-systeme-solaire.net/rest/bodies', {
          headers: {
            'Accept': 'application/json',
          },
        });
        
        if (!resp.ok) {
          throw new Error(`HTTP error! status: ${resp.status}`);
        }
        
        const json = await resp.json();
        // The API returns { bodies: [ ... ] }
        if (Array.isArray(json.bodies)) {
          setAllBodies(json.bodies);
        } else if (Array.isArray(json)) {
          // Fallback if API structure changes
          setAllBodies(json);
        } else {
          throw new Error('Invalid API response format');
        }
      } catch (err) {
        console.error('Error fetching solar system bodies:', err);
        // Fallback to mock data if API fails
        const mockBodies = [
          {
            id: 'terre',
            englishName: 'Earth',
            isPlanet: true,
            meanRadius: 6371,
            gravity: 9.8,
            mass: { massValue: 5.972, massExponent: 24 },
            moons: []
          },
          {
            id: 'mars',
            englishName: 'Mars',
            isPlanet: true,
            meanRadius: 3389,
            gravity: 3.7,
            mass: { massValue: 6.39, massExponent: 23 },
            moons: [{ moon: 'Phobos' }, { moon: 'Deimos' }]
          },
          {
            id: 'jupiter',
            englishName: 'Jupiter',
            isPlanet: true,
            meanRadius: 69911,
            gravity: 24.8,
            mass: { massValue: 1.898, massExponent: 27 },
            moons: Array.from({ length: 79 }, (_, i) => ({ moon: `Moon ${i + 1}` }))
          },
          {
            id: 'lune',
            englishName: 'Moon',
            isPlanet: false,
            aroundPlanet: { planet: 'Earth' },
            meanRadius: 1737,
            gravity: 1.6,
            mass: { massValue: 7.34, massExponent: 22 }
          }
        ];
        setAllBodies(mockBodies);
      } finally {
        setIsLoading(false);
      }
    };
    fetchBodies();
  }, []);

  // Filter and search logic
  const filteredBodies = useMemo(() => {
    if (!allBodies.length) return [];

    return allBodies.filter((body) => {
      // match search term against englishName (case-insensitive)
      const nameMatch = body.englishName
        ?.toLowerCase()
        .includes(searchTerm.toLowerCase());

      // match type filter:
      //   - "planet" => isPlanet === true
      //   - "moon" => aroundPlanet !== null
      //   - "asteroid" => bodyType === 'Asteroid'
      const typeMatch =
        typeFilter === 'all'
          ? true
          : typeFilter === 'planet'
          ? body.isPlanet === true
          : typeFilter === 'moon'
          ? body.aroundPlanet !== null
          : typeFilter === 'asteroid'
          ? body.bodyType === 'Asteroid'
          : true;

      return nameMatch && typeMatch;
    });
  }, [allBodies, searchTerm, typeFilter]);
  return (
    <div className="space-y-6 p-4">
      {/* Header with enhanced design */}
      <div className="bg-gradient-to-r from-orange-600/20 to-blue-600/20 rounded-lg p-6 border border-orange-500/30">        <div className="flex items-center gap-3 mb-4">
          <div className="relative">
            <Orbit className={`w-8 h-8 animate-spin ${
              theme === 'dark' ? 'text-orange-400' : 'text-orange-600'
            }`} style={{animationDuration: '10s'}} />
            <Globe className={`w-4 h-4 absolute top-1 left-1 ${
              theme === 'dark' ? 'text-blue-400' : 'text-blue-600'
            }`} />
          </div>
          <div>
            <h1 className={`text-3xl font-bold mb-2 ${
              theme === 'dark' ? 'text-white' : 'text-gray-900'
            }`}>
              Solar System Explorer
            </h1>
            <p className={`${
              theme === 'dark' ? 'text-orange-200' : 'text-orange-700'
            }`}>
              Journey through our cosmic neighborhood • {filteredBodies.length} celestial bodies discovered
            </p>
          </div>
        </div>
        
        {/* Quick stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-4">
          <div className={`rounded-lg p-3 text-center ${
            theme === 'dark' ? 'bg-orange-500/10' : 'bg-orange-100'
          }`}>
            <div className={`font-bold text-lg ${
              theme === 'dark' ? 'text-orange-400' : 'text-orange-600'
            }`}>
              {allBodies.filter(b => b.isPlanet).length}            </div>
            <div className={`text-sm ${
              theme === 'dark' ? 'text-orange-200' : 'text-orange-700'
            }`}>Planets</div>
          </div>
          <div className={`rounded-lg p-3 text-center ${
            theme === 'dark' ? 'bg-blue-500/10' : 'bg-blue-100'
          }`}>
            <div className={`font-bold text-lg ${
              theme === 'dark' ? 'text-blue-400' : 'text-blue-600'
            }`}>
              {allBodies.filter(b => b.aroundPlanet).length}
            </div>
            <div className={`text-sm ${
              theme === 'dark' ? 'text-blue-200' : 'text-blue-700'
            }`}>Moons</div>
          </div>
          <div className={`rounded-lg p-3 text-center ${
            theme === 'dark' ? 'bg-purple-500/10' : 'bg-purple-100'
          }`}>
            <div className={`font-bold text-lg ${
              theme === 'dark' ? 'text-purple-400' : 'text-purple-600'
            }`}>
              {allBodies.filter(b => b.bodyType === 'Asteroid').length}
            </div>
            <div className={`text-sm ${
              theme === 'dark' ? 'text-purple-200' : 'text-purple-700'
            }`}>Asteroids</div>
          </div>
          <div className={`rounded-lg p-3 text-center ${
            theme === 'dark' ? 'bg-green-500/10' : 'bg-green-100'
          }`}>
            <div className={`font-bold text-lg ${
              theme === 'dark' ? 'text-green-400' : 'text-green-600'
            }`}>
              {allBodies.length}
            </div>
            <div className={`text-sm ${
              theme === 'dark' ? 'text-green-200' : 'text-green-700'
            }`}>Total Bodies</div>
          </div>
        </div>
      </div>      {/* 3D Solar System Viewer - Using our own enhanced component */}
      <Card className="bg-slate-800/50 border-slate-700">
        <CardHeader>
          <CardTitle className="text-white flex items-center gap-2">
            <Star className="w-5 h-5 text-yellow-400" />
            Interactive 3D Solar System
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="w-full rounded-lg overflow-hidden border border-slate-600 bg-black">
            <EnhancedInteractiveSpaceScene 
              height="500px" 
              className="rounded-lg" 
              showFPS={false}
            />
          </div>
          <div className="mt-3 text-sm text-gray-400 flex items-center gap-2">
            <Info className="w-4 h-4" />
            Click planets to explore • Drag to rotate • Scroll to zoom • Auto performance optimization
          </div>
        </CardContent>
      </Card>

      {/* Search & Filter Card */}
      <Card className="bg-slate-800/50 border-slate-700">
        <CardHeader>
          <CardTitle className="text-white flex items-center gap-2">
            <Search className="w-5 h-5" />
            Search & Filter
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Input
              placeholder="Search celestial bodies..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="bg-slate-700 border-slate-600 text-white"
            />
            <select
              value={typeFilter}
              onChange={(e) => setTypeFilter(e.target.value)}
              className="bg-slate-700 border-slate-600 text-white rounded-md px-3 py-2"
            >
              <option value="all">All Bodies</option>
              <option value="planet">Planets</option>
              <option value="moon">Moons</option>
              <option value="asteroid">Asteroids</option>
            </select>
          </div>
        </CardContent>
      </Card>

      {/* Loading State */}
      {isLoading && (
        <div className="text-center py-8">
          <div className="text-white">Loading solar system data...</div>
        </div>
      )}      {/* Bodies Grid */}
      {!isLoading && filteredBodies.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredBodies.map((body) => {
            const getBodyIcon = () => {
              if (body.isPlanet) return <Globe className="w-5 h-5 text-orange-400" />;
              if (body.aroundPlanet) return <Moon className="w-5 h-5 text-blue-400" />;
              return <Zap className="w-5 h-5 text-purple-400" />;
            };

            const getBodyColor = () => {
              if (body.isPlanet) return 'from-orange-600/20 to-red-600/20 border-orange-500/30';
              if (body.aroundPlanet) return 'from-blue-600/20 to-cyan-600/20 border-blue-500/30';
              return 'from-purple-600/20 to-pink-600/20 border-purple-500/30';
            };

            return (
              <Card
                key={body.id}
                className={`bg-gradient-to-br ${getBodyColor()} hover:scale-105 transition-all duration-300 hover:shadow-xl`}
              >
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      {getBodyIcon()}
                      <CardTitle className="text-white text-lg">
                        {body.englishName}
                      </CardTitle>
                    </div>
                    <Badge
                      variant={
                        body.isPlanet
                          ? 'default'
                          : body.aroundPlanet
                          ? 'secondary'
                          : 'outline'
                      }
                      className="text-xs"
                    >
                      {body.isPlanet
                        ? 'Planet'
                        : body.aroundPlanet
                        ? 'Moon'
                        : body.bodyType || 'Other'}
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3 text-sm">
                    {/* Essential properties */}
                    {body.gravity != null && (
                      <div className="flex justify-between items-center">
                        <span className="text-gray-300 flex items-center gap-1">
                          <Zap className="w-3 h-3" />
                          Gravity:
                        </span>
                        <span className="text-white font-medium">
                          {body.gravity.toFixed(2)} m/s²
                        </span>
                      </div>
                    )}
                    
                    {body.meanRadius != null && (
                      <div className="flex justify-between items-center">
                        <span className="text-gray-300 flex items-center gap-1">
                          <Globe className="w-3 h-3" />
                          Radius:
                        </span>
                        <span className="text-white font-medium">
                          {body.meanRadius.toLocaleString()} km
                        </span>
                      </div>
                    )}

                    {body.mass && body.mass.massValue && (
                      <div className="flex justify-between items-center">
                        <span className="text-gray-300">Mass:</span>
                        <span className="text-white font-medium">
                          {body.mass.massValue.toExponential(2)} kg
                        </span>
                      </div>
                    )}
                    
                    {body.moons && Array.isArray(body.moons) && body.moons.length > 0 && (
                      <div className="flex justify-between items-center">
                        <span className="text-gray-300 flex items-center gap-1">
                          <Moon className="w-3 h-3" />
                          Moons:
                        </span>
                        <span className="text-white font-medium">{body.moons.length}</span>
                      </div>
                    )}
                    
                    {body.aroundPlanet && (
                      <div className="flex justify-between items-center">
                        <span className="text-gray-300 flex items-center gap-1">
                          <Orbit className="w-3 h-3" />
                          Orbits:
                        </span>
                        <span className="text-white font-medium">
                          {body.aroundPlanet.planet}
                        </span>
                      </div>
                    )}

                    {/* Additional interesting properties */}
                    {body.sideralOrbit != null && (
                      <div className="flex justify-between items-center">
                        <span className="text-gray-300">Orbital Period:</span>
                        <span className="text-white font-medium">
                          {(body.sideralOrbit / 365.25).toFixed(1)} years
                        </span>
                      </div>
                    )}

                    {body.discovery && body.discovery.discoveredBy && (
                      <div className="col-span-2 pt-2 border-t border-gray-600">
                        <span className="text-gray-400 text-xs">
                          Discovered by: {body.discovery.discoveredBy}
                        </span>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      )}

      {/* No Results */}
      {!isLoading && filteredBodies.length === 0 && (
        <div className="text-center py-8">
          <div className="text-gray-400">
            No celestial bodies found matching your criteria.
          </div>
        </div>
      )}
    </div>
  );
};

export default SolarSystemExplorer;
