import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { Badge } from './ui/badge';
import { Button } from './ui/button';
import { useTheme } from '../contexts/ThemeContext';
import { Rocket, Calendar, Zap, Clock, MapPin, Globe, Star, ExternalLink, RefreshCw, Activity } from 'lucide-react';

// Import the locally saved JSON files
import cometsJson from './launchlib/a.json';
import meteoritesJson from './launchlib/b.json';

interface CometRow {
  [key: string]: any;
}
interface MeteoriteRow {
  [key: string]: any;
}

const LaunchLibraryExplorer: React.FC = () => {
  const { theme } = useTheme();
  const [launches, setLaunches] = useState<any[]>([]);
  const [comets, setComets] = useState<CometRow[]>([]);
  const [meteorites, setMeteorites] = useState<MeteoriteRow[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  // Utility to transform Socrata-style rows into objects keyed by column.fieldName
  const socrataRowsToObjects = (data: any[][], columns: any[]): any[] => {
    return data.map((row: any[]) => {
      const obj: any = {};
      columns.forEach((colDef: any, idx: number) => {
        obj[colDef.fieldName] = row[idx];
      });
      return obj;
    });
  };

  useEffect(() => {
    // 1) Fetch SpaceX v5 Launches
    const fetchLaunches = async () => {
      try {
        const launchesRes = await fetch('https://api.spacexdata.com/v5/launches');
        if (!launchesRes.ok) {
          throw new Error(`Launch fetch failed: ${launchesRes.status}`);
        }
        const launchesJson = await launchesRes.json();
        setLaunches(launchesJson);
      } catch (err: any) {
        console.error('Error fetching launches:', err);
        setError(`Launches error: ${err.message || 'Unknown error'}`);
      }
    };    // 2) Process comets from the local `a.json`
    const processComets = () => {
      try {
        const cometColumns = (cometsJson as any).meta.view.columns;
        const cometDataAll: any[][] = (cometsJson as any).data;
        const cometSlice = cometDataAll.slice(0, 200);
        const cometObjects = socrataRowsToObjects(cometSlice, cometColumns);
        setComets(cometObjects);
      } catch (err: any) {
        console.error('Error processing comets JSON:', err);
        setError(`Comets error: ${err.message || 'Unknown error'}`);
      }
    };

    // 3) Process meteorites from the local `b.json`
    const processMeteorites = () => {
      try {
        const meteoriteColumns = (meteoritesJson as any).meta.view.columns;
        const meteoriteDataAll: any[][] = (meteoritesJson as any).data;
        const meteoriteSlice = meteoriteDataAll.slice(0, 200);
        const meteoriteObjects = socrataRowsToObjects(meteoriteSlice, meteoriteColumns);
        setMeteorites(meteoriteObjects);
      } catch (err: any) {
        console.error('Error processing meteorites JSON:', err);
        setError(`Meteorites error: ${err.message || 'Unknown error'}`);
      }
    };

    Promise.allSettled([
      fetchLaunches(),
      Promise.resolve(processComets()),
      Promise.resolve(processMeteorites()),
    ])
      .then(() => setIsLoading(false))
      .catch(() => setIsLoading(false));
  }, []);

  // Format ISO date to "Month DD, YYYY"
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center text-red-400 py-8">
        Error loading data: {error}
      </div>
    );
  }
  return (
    <div className="space-y-6">
      {/* Enhanced Header */}
      <div className="bg-gradient-to-r from-blue-900/50 via-purple-900/50 to-pink-900/50 rounded-xl p-6 border border-blue-500/30 shadow-2xl">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <div className="relative">
              <Rocket className="w-10 h-10 text-blue-400 animate-bounce" />
              <div className="absolute -top-1 -right-1 w-4 h-4 bg-orange-400 rounded-full animate-pulse"></div>
            </div>
            <div>
              <h1 className="text-3xl font-bold text-white mb-1">
                Launch & Space Data Explorer
              </h1>
              <p className="text-blue-200">
                Track SpaceX missions • Monitor near-Earth objects • Explore meteorite discoveries
              </p>
            </div>
          </div>
          <div className="hidden md:flex items-center space-x-6 text-sm">
            <div className="text-center">
              <div className="text-2xl font-bold text-blue-400">{launches.length}</div>
              <div className="text-blue-200">Launches</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-purple-400">{comets.length}</div>
              <div className="text-purple-200">Comets</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-pink-400">{meteorites.length}</div>
              <div className="text-pink-200">Meteorites</div>
            </div>          </div>
        </div>
      </div>

      {/* Enhanced Tabs */}
      <Tabs defaultValue="launches" className="space-y-4">
        <TabsList className="grid grid-cols-3 bg-slate-800/50 border border-slate-600/50 rounded-lg">
          <TabsTrigger value="launches" className="data-[state=active]:bg-blue-500/30 data-[state=active]:text-blue-300">
            <Rocket className="w-4 h-4 mr-2" />
            Launches
          </TabsTrigger>
          <TabsTrigger value="comets" className="data-[state=active]:bg-purple-500/30 data-[state=active]:text-purple-300">
            <Star className="w-4 h-4 mr-2" />
            Comets
          </TabsTrigger>
          <TabsTrigger value="meteorites" className="data-[state=active]:bg-pink-500/30 data-[state=active]:text-pink-300">
            <Zap className="w-4 h-4 mr-2" />
            Meteorites
          </TabsTrigger>
        </TabsList>

        {/* Enhanced Launches Tab */}
        <TabsContent value="launches" className="space-y-4">
          <Card className="bg-slate-800/30 border-slate-600/50 p-4">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-white flex items-center">
                <Activity className="w-5 h-5 mr-2 text-blue-400" />
                Recent SpaceX Launches
              </h3>
              <Button
                variant="outline"
                size="sm"
                className="border-blue-500/30 text-blue-400 hover:bg-blue-500/10"
              >
                <RefreshCw className="w-4 h-4 mr-2" />
                Refresh
              </Button>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {launches.slice(0, 12).map((launch: any) => (
                <Card
                  key={launch.id}
                  className="bg-gradient-to-br from-slate-900/80 to-slate-800/40 border-slate-600/50 hover:border-blue-500/50 transition-all duration-300 hover:transform hover:scale-105 hover:shadow-2xl hover:shadow-blue-500/10 group"
                >
                  <CardHeader className="pb-3">
                    <div className="flex items-center justify-between">
                      <CardTitle className="text-white text-sm line-clamp-2 group-hover:text-blue-300 transition-colors">
                        {launch.name}
                      </CardTitle>                      <Badge 
                        variant={launch.success ? 'default' : 'destructive'}
                        className={launch.success ? 'bg-green-500/20 text-green-400 border-green-500/30' : 'bg-red-500/20 text-red-400 border-red-500/30'}
                      >
                        {launch.success ? 'Success' : 'Failed'}
                      </Badge>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <div className="flex items-center gap-2 text-gray-400 text-sm">
                      <Calendar className="w-4 h-4" />
                      <span>{launch.date_utc ? formatDate(launch.date_utc) : 'N/A'}</span>
                    </div>
                    
                    {launch.rocket && (
                      <div className="bg-slate-800/50 rounded-lg p-2 border border-slate-600/30">
                        <div className="flex items-center text-xs text-gray-400 mb-1">
                          <Rocket className="w-3 h-3 mr-1" />
                          Rocket
                        </div>
                        <div className="text-white font-medium text-sm">{launch.rocket.name || 'Unknown'}</div>
                      </div>
                    )}
                    
                    {launch.details && (
                      <p className="text-gray-300 text-xs line-clamp-3 bg-slate-800/30 p-2 rounded border border-slate-600/20">
                        {launch.details}
                      </p>
                    )}
                    
                    <div className="pt-2 border-t border-slate-700/50">
                      <Button
                        variant="outline"
                        size="sm"
                        className="w-full border-blue-500/30 text-blue-400 hover:bg-blue-500/10 transition-all duration-300"
                      >
                        <ExternalLink className="w-3 h-3 mr-2" />
                        View Details
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </Card>
        </TabsContent>        {/* Enhanced Comets Tab */}
        <TabsContent value="comets" className="space-y-4">
          <Card className="bg-slate-800/30 border-slate-600/50 p-4">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-white flex items-center">
                <Star className="w-5 h-5 mr-2 text-purple-400" />
                Near-Earth Comets
              </h3>
              <Badge className="bg-purple-500/20 text-purple-400 border-purple-500/30">
                {comets.length} Objects
              </Badge>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {comets.slice(0, 12).map((c: CometRow, idx: number) => (
                <Card
                  key={idx}
                  className="bg-gradient-to-br from-slate-900/80 to-purple-900/20 border-slate-600/50 hover:border-purple-500/50 transition-all duration-300 hover:transform hover:scale-105 group"
                >
                  <CardHeader className="pb-3">
                    <div className="flex items-center justify-between">
                      <CardTitle className="text-white text-sm line-clamp-2 group-hover:text-purple-300 transition-colors">
                        {c.object || 'Unnamed Comet'}
                      </CardTitle>
                      <Badge variant="outline" className="border-purple-500/30 text-purple-400">
                        {c.epoch_tdb != null ? String(c.epoch_tdb).slice(0, 8) : 'N/A'}
                      </Badge>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <div className="grid grid-cols-2 gap-2">
                      {c.tp_tdb != null && (
                        <div className="bg-slate-800/50 rounded-lg p-2 border border-slate-600/30">
                          <div className="text-xs text-gray-400 mb-1">Perihelion</div>
                          <div className="text-white font-medium text-sm">{String(c.tp_tdb).slice(0, 10)}</div>
                        </div>
                      )}
                      {c.inclination != null && (
                        <div className="bg-slate-800/50 rounded-lg p-2 border border-slate-600/30">
                          <div className="text-xs text-gray-400 mb-1">Inclination</div>
                          <div className="text-white font-medium text-sm">{Number(c.inclination).toFixed(2)}°</div>
                        </div>
                      )}
                    </div>
                    {c.eccentricity != null && (
                      <div className="bg-slate-800/50 rounded-lg p-2 border border-slate-600/30">
                        <div className="flex items-center justify-between">
                          <span className="text-xs text-gray-400">Eccentricity</span>
                          <span className="text-purple-400 font-medium text-sm">{Number(c.eccentricity).toFixed(4)}</span>
                        </div>
                      </div>
                    )}                  </CardContent>
                </Card>
              ))}
            </div>
          </Card>
        </TabsContent>

        {/* Enhanced Meteorites Tab */}
        <TabsContent value="meteorites" className="space-y-4">
          <Card className="bg-slate-800/30 border-slate-600/50 p-4">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-white flex items-center">
                <Zap className="w-5 h-5 mr-2 text-pink-400" />
                Meteorite Landings
              </h3>
              <Badge className="bg-pink-500/20 text-pink-400 border-pink-500/30">
                {meteorites.length} Discoveries
              </Badge>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {meteorites.slice(0, 12).map((m: MeteoriteRow, idx: number) => (
                <Card
                  key={idx}
                  className="bg-gradient-to-br from-slate-900/80 to-pink-900/20 border-slate-600/50 hover:border-pink-500/50 transition-all duration-300 hover:transform hover:scale-105 group"
                >
                  <CardHeader className="pb-3">
                    <div className="flex items-center justify-between">
                      <CardTitle className="text-white text-sm line-clamp-2 group-hover:text-pink-300 transition-colors">
                        {m.name || 'Unknown Meteorite'}
                      </CardTitle>
                      <Badge variant="outline" className="border-pink-500/30 text-pink-400">
                        {m.year ? new Date(m.year).getFullYear() : 'N/A'}
                      </Badge>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <div className="grid grid-cols-2 gap-2">
                      {m.mass_g != null && (
                        <div className="bg-slate-800/50 rounded-lg p-2 border border-slate-600/30">
                          <div className="text-xs text-gray-400 mb-1">Mass</div>
                          <div className="text-white font-medium text-sm">{Number(m.mass_g).toFixed(1)}g</div>
                        </div>
                      )}
                      {m.recclass && (
                        <div className="bg-slate-800/50 rounded-lg p-2 border border-slate-600/30">
                          <div className="text-xs text-gray-400 mb-1">Class</div>
                          <div className="text-white font-medium text-sm">{m.recclass}</div>
                        </div>
                      )}
                    </div>
                    {(m.reclat != null && m.reclong != null) && (
                      <div className="bg-slate-800/50 rounded-lg p-2 border border-slate-600/30">
                        <div className="flex items-center justify-between">
                          <span className="text-xs text-gray-400 flex items-center">
                            <MapPin className="w-3 h-3 mr-1" />
                            Location
                          </span>
                          <span className="text-pink-400 font-medium text-sm">
                            {Number(m.reclat).toFixed(2)}, {Number(m.reclong).toFixed(2)}
                          </span>
                        </div>
                      </div>
                    )}
                  </CardContent>
                </Card>
              ))}
            </div>
          </Card>        </TabsContent>
      </Tabs>
    </div>
  );
};

export default LaunchLibraryExplorer;
