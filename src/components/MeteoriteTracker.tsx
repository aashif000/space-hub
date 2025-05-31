
import React, { useState, useMemo } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Input } from './ui/input';
import { Badge } from './ui/badge';
import { Zap, Search, MapPin, Calendar } from 'lucide-react';

const MeteoriteTracker = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [classFilter, setClassFilter] = useState('all');

  const { data: meteoriteData, isLoading } = useQuery({
    queryKey: ['meteorite-data'],
    queryFn: () => fetch('https://data-nasa-bucket-production.s3.us-east-1.amazonaws.com/legacy/meteorite_landings/Meteorite_Landings.json?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZJ34W7PDNZ6ZML5S%2F20250531%2Fus-east-1%2Fs3%2Faws4_request&X-Amz-Date=20250531T141950Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEPb%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FwEaCXVzLWVhc3QtMSJGMEQCIAybrzxNfuJysHpxM3YLwOwYUvaX3tFreCH97ZsIAbH3AiASwn0T4DprorKE1pUpcoWfDfUE0q5HbFAUd0yFWaP4SiqdBQi%2F%2F%2F%2F%2F%2F%2F%2F%2F%2F%2F8BEAAaDDYzOTY3NDgwOTI4NiIMSyV5rzdjEtb4HokCKvEEVs7xzbc4E7bRa2nhPer8sFMNcmPzDBQy15OAJ2r1K85jAwkQfdxzYCtZgp7K%2BwhJQ%2Ban3CJtx0gqIrVocb41UJX4Jf29I8h93PmL6ngt%2BCmtQyW5I8xdm0qh9622MgKzplVqD771zw0rDebZjCsvr5yMWCHv%2BjRc1UCknNriDuEk%2ByyYimQfN759t9DSGsdF2R5KSTRd69Nafj5Mlu5Lxa7bBn6fnTtJ2zenlWWzhKK9w%2B%2BraudFm3n%2Ft7poA7F6QvmQKE%2Fu3ETns7czGRmUhjUylomFmvW85uMVT4xdd19TvDOZiy7tTdoX0rDZBD4g8EolsUS4AtSyLLsZBFdT0WTwozPQboYgndAoOgbsmge3ywHmoO1DwzSanSzvhjrOeSNXSP%2FtR9dZyPks8mmK395IAW4%2FIaRwGFokkc8lUBnXuLiQfAsrNiJlW3DNiALHiXt59UtSqzZaifQod9IjLIxoI5BFR3ceEUNDnZq5tTLQMt2dfrJo7CY8zmTid5dX4dER2g%2B5YCYg6Vvi%2B%2FDx0drERcy6G87iePKVJgX9Cr%2BPSPPq1rXv2zh3OMQu%2FMSSEar03gGr9J08mar3Mw6G%2FRFQgRNQ3JFsEkhYVib%2B8z6j8kYVzzGt3XtW9gk2bZVRtKd8xEWoexSejTjJRfrRPW4XUnMSynVI7HWyDBkYHnfgMfchgINXh0yZxOngmMHnsK7wMjVJYPSlf%2Frz%2Bxi%2BOBX6CDaMn14tYlaVECK7wxngCAjESqM4OLSyXwkoBamuKExZ1S8Zn1NgW3skQpmTFN76RxpCmrJTbwszcFEfYZqIZlGpWZ2WhAsjY6xbOdm5YjDLjuzBBjqcAeWA2x5meB8LMrhLVsQFQD2BolaPWu8VAii7b49Ba8BeyRqUYb%2Bk8oM%2FJy2fNtqIzqx6%2FfyRJYZDljQ5u0BMoKytiUSFIU8SqlcZNoqpyA2vke44vMEYpbNPhC5F5ahGd17QstPcDhGTChXO%2F47uVkjPn5lF5l6OtQwNFMVg5pnFyo%2Fdd8dS2aaFF3rQZyQUZnMXXR4dZCXLvnaQfw%3D%3D&X-Amz-Signature=085557186d715258e228a3ac38827317aca2cefe156eaa86f251219ea7f69c4e&X-Amz-SignedHeaders=host&x-id=GetObject').then(res => res.json()),
  });

  const filteredMeteorites = useMemo(() => {
    if (!meteoriteData?.data) return [];
    
    return meteoriteData.data.slice(1, 101).filter((meteorite: any[]) => {
      const name = meteorite[1]?.toLowerCase() || '';
      const recclass = meteorite[4] || '';
      
      const matchesSearch = name.includes(searchTerm.toLowerCase());
      const matchesClass = classFilter === 'all' || recclass === classFilter;
      
      return matchesSearch && matchesClass;
    });
  }, [meteoriteData, searchTerm, classFilter]);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-500"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="bg-gradient-to-r from-orange-600/20 to-yellow-600/20 rounded-lg p-6 border border-orange-500/30">
        <div className="flex items-center gap-3 mb-4">
          <Zap className="w-8 h-8 text-orange-400" />
          <div>
            <h1 className="text-2xl font-bold text-white">Meteorite Tracker</h1>
            <p className="text-orange-200">NASA's comprehensive meteorite landing database</p>
          </div>
        </div>
      </div>

      {/* Search and Filters */}
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
              placeholder="Search meteorites..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="bg-slate-700 border-slate-600 text-white"
            />
            <select
              value={classFilter}
              onChange={(e) => setClassFilter(e.target.value)}
              className="bg-slate-700 border-slate-600 text-white rounded-md px-3 py-2"
            >
              <option value="all">All Classes</option>
              <option value="L6">L6</option>
              <option value="H5">H5</option>
              <option value="L5">L5</option>
              <option value="H6">H6</option>
            </select>
          </div>
        </CardContent>
      </Card>

      {/* Meteorites Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredMeteorites.map((meteorite: any[], index: number) => (
          <Card key={index} className="bg-slate-800/50 border-slate-700 hover:bg-slate-800/70 transition-all duration-300">
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="text-white text-lg">{meteorite[1] || 'Unknown'}</CardTitle>
                <Badge variant="outline">{meteorite[4] || 'Unknown Class'}</Badge>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-2 text-sm">
                <div className="flex items-center justify-between">
                  <span className="text-gray-400">Mass:</span>
                  <span className="text-white">{meteorite[5] ? `${meteorite[5]}g` : 'Unknown'}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-gray-400">Fall/Found:</span>
                  <span className="text-white">{meteorite[6] || 'Unknown'}</span>
                </div>
                {meteorite[7] && (
                  <div className="flex items-center justify-between">
                    <span className="text-gray-400 flex items-center gap-1">
                      <Calendar className="w-3 h-3" />
                      Year:
                    </span>
                    <span className="text-white">{new Date(meteorite[7]).getFullYear()}</span>
                  </div>
                )}
                {meteorite[8] && meteorite[9] && (
                  <div className="flex items-center justify-between">
                    <span className="text-gray-400 flex items-center gap-1">
                      <MapPin className="w-3 h-3" />
                      Location:
                    </span>
                    <span className="text-white text-xs">
                      {parseFloat(meteorite[8]).toFixed(2)}°, {parseFloat(meteorite[9]).toFixed(2)}°
                    </span>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default MeteoriteTracker;
