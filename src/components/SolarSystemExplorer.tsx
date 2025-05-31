import React, { useState, useEffect, useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Input } from './ui/input';
import { Badge } from './ui/badge';
import { Globe, Search, Filter } from 'lucide-react';

const SolarSystemExplorer: React.FC = () => {
  const [allBodies, setAllBodies] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [typeFilter, setTypeFilter] = useState<string>('all');

  // Fetch the solar system bodies from the public API on mount
  useEffect(() => {
    const fetchBodies = async () => {
      try {
        const resp = await fetch('https://api.le-systeme-solaire.net/rest/bodies');
        const json = await resp.json();
        // The API returns { bodies: [ ... ] }
        if (Array.isArray(json.bodies)) {
          setAllBodies(json.bodies);
        } else {
          setAllBodies([]);
        }
      } catch (err) {
        console.error('Error fetching bodies:', err);
        setAllBodies([]);
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
      {/* 1) Embed the 3D solar system app via iframe */}
      <div className="w-full h-96 rounded-lg overflow-hidden border border-slate-700">
        <iframe
          src="https://threesolar.netlify.app/"
          title="3D Solar System"
          className="w-full h-full bg-black"
          frameBorder="0"
        />
      </div>

      {/* Header */}
      <div className="bg-gradient-to-r from-blue-600/20 to-purple-600/20 rounded-lg p-6 border border-blue-500/30">
        <div className="flex items-center gap-3">
          <Globe className="w-8 h-8 text-blue-400" />
          <div>
            <h1 className="text-2xl font-bold text-white">
              Solar System Explorer
            </h1>
            <p className="text-blue-200">
              Discover planets, moons, and celestial bodies
            </p>
          </div>
        </div>
      </div>

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
      )}

      {/* Bodies Grid */}
      {!isLoading && filteredBodies.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredBodies.map((body) => (
            <Card
              key={body.id}
              className="bg-slate-800/50 border-slate-700 hover:bg-slate-800/70 transition-all duration-300"
            >
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="text-white text-lg">
                    {body.englishName}
                  </CardTitle>
                  <Badge
                    variant={
                      body.isPlanet
                        ? 'default'
                        : body.aroundPlanet
                        ? 'secondary'
                        : 'outline'
                    }
                  >
                    {body.isPlanet
                      ? 'Planet'
                      : body.aroundPlanet
                      ? 'Moon'
                      : 'Other'}
                  </Badge>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-2 text-sm">
                  {body.gravity != null && (
                    <div className="flex justify-between">
                      <span className="text-gray-400">Gravity:</span>
                      <span className="text-white">
                        {body.gravity} m/s²
                      </span>
                    </div>
                  )}
                  {body.meanRadius != null && (
                    <div className="flex justify-between">
                      <span className="text-gray-400">Radius:</span>
                      <span className="text-white">
                        {body.meanRadius.toLocaleString()} km
                      </span>
                    </div>
                  )}
                  {body.moons && Array.isArray(body.moons) && (
                    <div className="flex justify-between">
                      <span className="text-gray-400">Moons:</span>
                      <span className="text-white">{body.moons.length}</span>
                    </div>
                  )}
                  {body.aroundPlanet && (
                    <div className="flex justify-between">
                      <span className="text-gray-400">Orbits:</span>
                      <span className="text-white">
                        {body.aroundPlanet.planet}
                      </span>
                    </div>
                  )}
                  {body.bodyType && (
                    <div className="flex justify-between">
                      <span className="text-gray-400">Type:</span>
                      <span className="text-white">{body.bodyType}</span>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          ))}
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
