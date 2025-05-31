import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { Badge } from './ui/badge';
import { Rocket, Calendar } from 'lucide-react';

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
    };

    // 2) Process comets from the local `a.json`
    const processComets = () => {
      try {
        const cometColumns = cometsJson.meta.view.columns;
        const cometDataAll: any[][] = cometsJson.data;
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
        const meteoriteColumns = meteoritesJson.meta.view.columns;
        const meteoriteDataAll: any[][] = meteoritesJson.data;
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
    <div className="space-y-6 p-4">
      {/* Header */}
      <div className="bg-gradient-to-r from-purple-600/20 to-pink-600/20 rounded-lg p-6 border border-purple-500/30">
        <div className="flex items-center gap-3 mb-4">
          <Rocket className="w-8 h-8 text-purple-400" />
          <div>
            <h1 className="text-2xl font-bold text-white">
              Launch & NASA Data Explorer
            </h1>
            <p className="text-purple-200">
              SpaceX Launches • Near-Earth Comets • Meteorite Landings
            </p>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <Tabs defaultValue="launches" className="space-y-4">
        <TabsList className="grid grid-cols-3 bg-slate-800/50 rounded-t-lg">
          <TabsTrigger value="launches">Launches</TabsTrigger>
          <TabsTrigger value="comets">Comets</TabsTrigger>
          <TabsTrigger value="meteorites">Meteorites</TabsTrigger>
        </TabsList>

        {/* --- Launches Tab --- */}
        <TabsContent value="launches" className="p-4 bg-slate-800/20 rounded-b-lg">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {launches.slice(0, 12).map((launch: any) => (
              <Card
                key={launch.id}
                className="bg-slate-800/50 border-slate-700 hover:bg-slate-800/70 transition-all duration-300"
              >
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-white text-sm line-clamp-2">
                      {launch.name}
                    </CardTitle>
                    <Badge variant={launch.success ? 'default' : 'destructive'}>
                      {launch.success ? 'Success' : 'Failed'}
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2 text-sm">
                    <div className="flex items-center gap-2 text-gray-400">
                      <Calendar className="w-4 h-4" />
                      {launch.date_utc ? formatDate(launch.date_utc) : 'N/A'}
                    </div>
                    {launch.details && (
                      <p className="text-gray-300 text-xs line-clamp-3">
                        {launch.details}
                      </p>
                    )}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        {/* --- Comets Tab --- */}
        <TabsContent value="comets" className="p-4 bg-slate-800/20 rounded-b-lg">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {comets.map((c: CometRow, idx: number) => (
              <Card
                key={idx}
                className="bg-slate-800/50 border-slate-700 hover:bg-slate-800/70 transition-all duration-300"
              >
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-white text-sm line-clamp-2">
                      {c.object || 'Unnamed Comet'}
                    </CardTitle>
                    <Badge variant="outline">
                      {c.epoch_tdb != null ? c.epoch_tdb : 'Epoch N/A'}
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2 text-sm">
                    {c.tp_tdb != null && (
                      <div className="flex justify-between">
                        <span className="text-gray-400">Perihelion (TP):</span>
                        <span className="text-white">{c.tp_tdb}</span>
                      </div>
                    )}
                    {c.inclination != null && (
                      <div className="flex justify-between">
                        <span className="text-gray-400">Inclination:</span>
                        <span className="text-white">
                          {c.inclination.toFixed(2)}
                        </span>
                      </div>
                    )}
                    {c.eccentricity != null && (
                      <div className="flex justify-between">
                        <span className="text-gray-400">Eccentricity:</span>
                        <span className="text-white">
                          {c.eccentricity.toFixed(3)}
                        </span>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        {/* --- Meteorites Tab --- */}
        <TabsContent value="meteorites" className="p-4 bg-slate-800/20 rounded-b-lg">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {meteorites.map((m: MeteoriteRow, idx: number) => (
              <Card
                key={idx}
                className="bg-slate-800/50 border-slate-700 hover:bg-slate-800/70 transition-all duration-300"
              >
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-white text-sm line-clamp-2">
                      {m.name || 'Unknown Meteorite'}
                    </CardTitle>
                    <Badge variant="outline">
                      {m.year ? new Date(m.year).getFullYear() : 'Year N/A'}
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2 text-sm">
                    {m.mass_g != null && (
                      <div className="flex justify-between">
                        <span className="text-gray-400">Mass (g):</span>
                        <span className="text-white">{m.mass_g}</span>
                      </div>
                    )}
                    {m.reclat && m.reclong && (
                      <div className="flex justify-between">
                        <span className="text-gray-400">Coords:</span>
                        <span className="text-white">
                          {parseFloat(m.reclat).toFixed(2)}, {parseFloat(m.reclong).toFixed(2)}
                        </span>
                      </div>
                    )}
                    {m.recclass && (
                      <div className="flex justify-between">
                        <span className="text-gray-400">Class:</span>
                        <span className="text-white">{m.recclass}</span>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default LaunchLibraryExplorer;
