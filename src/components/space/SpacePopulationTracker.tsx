import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '../ui/card';
import { Badge } from '../ui/badge';
import { Button } from '../ui/button';
import { useTheme } from '../../contexts/ThemeContext';
import { Users, Rocket, MapPin, Clock, HelpCircle, BookOpen } from 'lucide-react';

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
  const { theme } = useTheme();
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
         {/* X1 Config Simulator Embed with Documentation */}
      <Card className="bg-slate-800/50 border-slate-700">
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="text-white flex items-center gap-3">
              <Rocket className="w-6 h-6" />
              X1 Configuration Simulator
            </CardTitle>
            <Button variant="outline" className="h-8 px-2 text-xs border-blue-500 text-blue-400 hover:text-blue-300" onClick={() => document.getElementById('x1-simulator-guide')?.scrollIntoView({ behavior: 'smooth' })}>
              <HelpCircle className="w-3 h-3 mr-1" />
              How to Use
            </Button>
          </div>
          <CardDescription className="text-gray-400 mt-2">
            Experiment with the next-generation spacecraft configurations and explore optimal designs for different mission profiles.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
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
          
          {/* Simulator Guide */}
          <div id="x1-simulator-guide" className="space-y-4 bg-slate-900/70 rounded-lg p-4 border border-blue-500/30">
            <div className="flex items-center gap-2 text-blue-400">
              <BookOpen className="w-4 h-4" />
              <h3 className="font-medium">X1 Simulator Guide</h3>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-gray-300">
              <div className="space-y-2">
                <h4 className="font-medium text-white">Getting Started</h4>
                <ol className="list-decimal list-inside space-y-1">
                  <li>Select a mission type from the dropdown menu</li>
                  <li>Adjust propulsion system configuration</li>
                  <li>Configure life support and habitat modules</li>
                  <li>Review power systems and adjust as needed</li>
                  <li>Check overall mass and system integration</li>
                </ol>
              </div>
              
              <div className="space-y-2">
                <h4 className="font-medium text-white">Key Features</h4>
                <ul className="list-disc list-inside space-y-1">
                  <li>Real-time performance analysis</li>
                  <li>Mission duration calculator</li>
                  <li>Integration checks between systems</li>
                  <li>3D preview of configured spacecraft</li>
                  <li>Export configuration to share with others</li>
                </ul>
              </div>
            </div>
            
            <div className="space-y-2">
              <h4 className="font-medium text-white">Mission Types</h4>
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
                <div className="bg-gradient-to-r from-orange-500/20 to-red-500/20 p-3 rounded border border-orange-500/30">
                  <h5 className="text-orange-400 font-medium mb-1">Mars Direct</h5>
                  <p className="text-xs text-gray-300">Optimize for direct transfer to Mars with minimal orbital transitions.</p>
                </div>
                <div className="bg-gradient-to-r from-blue-500/20 to-indigo-500/20 p-3 rounded border border-blue-500/30">
                  <h5 className="text-blue-400 font-medium mb-1">Lunar Operations</h5>
                  <p className="text-xs text-gray-300">Configure for repeated Earth-Moon transits and extended lunar surface operations.</p>
                </div>
                <div className="bg-gradient-to-r from-purple-500/20 to-pink-500/20 p-3 rounded border border-purple-500/30">
                  <h5 className="text-purple-400 font-medium mb-1">Deep Space</h5>
                  <p className="text-xs text-gray-300">Long-duration missions to asteroids or outer planets with extended life support.</p>
                </div>
              </div>
            </div>
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
