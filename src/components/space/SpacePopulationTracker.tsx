
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Badge } from '../ui/badge';
import { Users, Rocket, MapPin, Clock } from 'lucide-react';

interface Astronaut {
  name: string;
  craft: string;
}

interface SpacePopulation {
  message: string;
  number: number;
  people: Astronaut[];
}

export const SpacePopulationTracker = () => {
  const [spaceData, setSpaceData] = useState<SpacePopulation | null>(null);
  const [loading, setLoading] = useState(true);
  const [lastUpdated, setLastUpdated] = useState<Date>(new Date());

  const fetchSpacePopulation = async () => {
    try {
      const response = await fetch('http://api.open-notify.org/astros.json');
      const data = await response.json();
      setSpaceData(data);
      setLastUpdated(new Date());
    } catch (error) {
      console.error('Error fetching space population:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSpacePopulation();
    const interval = setInterval(fetchSpacePopulation, 60000); // Update every minute
    return () => clearInterval(interval);
  }, []);

  const getCraftColor = (craft: string) => {
    switch (craft.toLowerCase()) {
      case 'iss':
        return 'bg-blue-500/20 text-blue-400 border-blue-500';
      case 'tiangong':
        return 'bg-red-500/20 text-red-400 border-red-500';
      default:
        return 'bg-green-500/20 text-green-400 border-green-500';
    }
  };

  const getCraftIcon = (craft: string) => {
    switch (craft.toLowerCase()) {
      case 'iss':
        return '🌍';
      case 'tiangong':
        return '🏮';
      default:
        return '🚀';
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-48">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="bg-gradient-to-r from-blue-600/20 to-purple-600/20 rounded-lg p-6 border border-blue-500/30">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Users className="w-8 h-8 text-blue-400" />
            <div>
              <h1 className="text-2xl font-bold text-white">People in Space Right Now</h1>
              <p className="text-blue-200">Live tracking of humans in space</p>
            </div>
          </div>
          <div className="text-right">
            <div className="text-4xl font-bold text-blue-400">
              {spaceData?.number || 0}
            </div>
            <div className="text-sm text-gray-400">Currently in Space</div>
          </div>
        </div>
      </div>
       
       {/* X1 Config Simulator Embed */}
      <Card className="bg-slate-800/50 border-slate-700">
        <CardHeader>
          <CardTitle className="text-white flex items-center gap-3">
            <Rocket className="w-6 h-6" />
            X1 Configuration Simulator
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="bg-black rounded-lg overflow-hidden">
            <iframe
              src="https://sa-mack.github.io/X1-config-simulator/"
              width="100%"
              height="600"
              style={{ border: 'none' }}
              title="X1 Config Simulator"
              className="w-full"
            />
          </div>
        </CardContent>
      </Card>


      
      {/* Last Updated */}
      <Card className="bg-slate-800/50 border-slate-700">
        <CardContent className="p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 text-gray-400">
              <Clock className="w-4 h-4" />
              Last updated: {lastUpdated.toLocaleTimeString()}
            </div>
            <button
              onClick={fetchSpacePopulation}
              className="text-blue-400 hover:text-blue-300 text-sm"
            >
              Refresh
            </button>
          </div>
        </CardContent>
      </Card>

      {/* Spacecraft Groups */}
      {spaceData?.people && (
        <div className="space-y-4">
          {Object.entries(
            spaceData.people.reduce((acc, person) => {
              if (!acc[person.craft]) {
                acc[person.craft] = [];
              }
              acc[person.craft].push(person);
              return acc;
            }, {} as Record<string, Astronaut[]>)
          ).map(([craft, crew]) => (
            <Card key={craft} className="bg-slate-800/50 border-slate-700">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="text-white flex items-center gap-3">
                    <span className="text-2xl">{getCraftIcon(craft)}</span>
                    {craft}
                  </CardTitle>
                  <Badge className={getCraftColor(craft)}>
                    {crew.length} Crew Member{crew.length > 1 ? 's' : ''}
                  </Badge>
                </div>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                  {crew.map((person, index) => (
                    <div
                      key={index}
                      className="bg-slate-700/50 rounded-lg p-3 flex items-center gap-3"
                    >
                      <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center">
                        <Users className="w-5 h-5 text-white" />
                      </div>
                      <div>
                        <div className="text-white font-medium">{person.name}</div>
                        <div className="text-xs text-gray-400">Astronaut</div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      
    </div>
  );
};
