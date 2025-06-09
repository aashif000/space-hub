import React, { useState, useMemo } from 'react';
import { useSpaceData } from '../contexts/DataContext';
import { useTheme } from '../contexts/ThemeContext';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Input } from './ui/input';
import { Badge } from './ui/badge';
import { Button } from './ui/button';
import { Zap, Search, MapPin, Calendar, RefreshCw, ExternalLink, TrendingUp, Globe } from 'lucide-react';

const MeteoriteTracker = () => {
  const { theme } = useTheme();
  const [searchTerm, setSearchTerm] = useState('');
  const [classFilter, setClassFilter] = useState('all');
  const { meteoriteData, isLoading } = useSpaceData();
  
  const filteredMeteorites = useMemo(() => {
    if (!meteoriteData) return [];
    
    return meteoriteData.filter((meteorite: any) => {
      const name = meteorite.name?.toLowerCase() || '';
      const fall = meteorite.fall || '';
      
      const matchesSearch = name.includes(searchTerm.toLowerCase());
      const matchesClass = classFilter === 'all' || fall === classFilter;
      
      return matchesSearch && matchesClass;
    });
  }, [meteoriteData, searchTerm, classFilter]);

  // Calculate statistics
  const stats = useMemo(() => {
    if (!meteoriteData) return { total: 0, found: 0, fell: 0, avgMass: 0 };
    
    const total = meteoriteData.length;
    const found = meteoriteData.filter((m: any) => m.fall === 'Found').length;
    const fell = meteoriteData.filter((m: any) => m.fall === 'Fell').length;
    const masses = meteoriteData.filter((m: any) => m.mass).map((m: any) => parseFloat(m.mass));
    const avgMass = masses.length > 0 ? masses.reduce((a, b) => a + b, 0) / masses.length : 0;
    
    return { total, found, fell, avgMass };
  }, [meteoriteData]);
  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className={`animate-spin rounded-full h-12 w-12 border-b-2 ${
          theme === 'dark' ? 'border-orange-500' : 'border-orange-600'
        }`}></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Enhanced Header */}
      <div className={`rounded-xl p-6 border shadow-2xl ${
        theme === 'dark' 
          ? 'bg-gradient-to-r from-orange-900/50 via-yellow-900/50 to-red-900/50 border-orange-500/30' 
          : 'bg-gradient-to-r from-orange-400/20 via-yellow-400/20 to-red-400/20 border-orange-400/40'
      }`}>
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <div className="relative">
              <Zap className={`w-10 h-10 animate-pulse ${
                theme === 'dark' ? 'text-orange-400' : 'text-orange-600'
              }`} />
              <div className={`absolute -top-1 -right-1 w-4 h-4 rounded-full animate-bounce ${
                theme === 'dark' ? 'bg-yellow-400' : 'bg-yellow-500'
              }`}></div>
            </div>
            <div>
              <h1 className={`text-3xl font-bold mb-1 ${
                theme === 'dark' ? 'text-white' : 'text-gray-900'
              }`}>
                Meteorite Tracker
              </h1>
              <p className={`${
                theme === 'dark' ? 'text-orange-200' : 'text-orange-700'
              }`}>
                NASA's comprehensive meteorite landing database • Global impact tracking
              </p>
            </div>
          </div>
          <div className="hidden md:flex items-center space-x-6 text-sm">
            <div className="text-center">
              <div className="text-2xl font-bold text-orange-400">{stats.total}</div>
              <div className="text-orange-200">Total Records</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-yellow-400">{stats.found}</div>
              <div className="text-yellow-200">Found</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-red-400">{stats.fell}</div>
              <div className="text-red-200">Observed Falls</div>
            </div>
          </div>
        </div>
      </div>

      {/* Enhanced Statistics Dashboard */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="bg-gradient-to-br from-orange-900/40 to-orange-800/20 border-orange-500/30 hover:border-orange-400/50 transition-all duration-300 hover:shadow-xl hover:shadow-orange-500/10">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-orange-300 text-sm font-medium">Total Meteorites</p>
                <p className="text-2xl font-bold text-white">{stats.total.toLocaleString()}</p>
              </div>
              <Globe className="w-8 h-8 text-orange-400" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-yellow-900/40 to-yellow-800/20 border-yellow-500/30 hover:border-yellow-400/50 transition-all duration-300 hover:shadow-xl hover:shadow-yellow-500/10">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-yellow-300 text-sm font-medium">Found on Ground</p>
                <p className="text-2xl font-bold text-white">{stats.found.toLocaleString()}</p>
              </div>
              <Search className="w-8 h-8 text-yellow-400" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-red-900/40 to-red-800/20 border-red-500/30 hover:border-red-400/50 transition-all duration-300 hover:shadow-xl hover:shadow-red-500/10">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-red-300 text-sm font-medium">Observed Falls</p>
                <p className="text-2xl font-bold text-white">{stats.fell.toLocaleString()}</p>
              </div>
              <Zap className="w-8 h-8 text-red-400" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-purple-900/40 to-purple-800/20 border-purple-500/30 hover:border-purple-400/50 transition-all duration-300 hover:shadow-xl hover:shadow-purple-500/10">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-purple-300 text-sm font-medium">Avg Mass</p>
                <p className="text-2xl font-bold text-white">{stats.avgMass.toFixed(1)}g</p>
              </div>
              <TrendingUp className="w-8 h-8 text-purple-400" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Enhanced Search and Filters */}
      <Card className="bg-slate-800/30 border-slate-600/50">
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <CardTitle className="text-white flex items-center gap-2">
              <Search className="w-5 h-5 text-orange-400" />
              Search & Filter
            </CardTitle>
            <div className="flex items-center gap-2">
              <Badge className="bg-orange-500/20 text-orange-400 border-orange-500/30">
                {filteredMeteorites.length} Results
              </Badge>
              <Button
                variant="outline"
                size="sm"
                className="border-orange-500/30 text-orange-400 hover:bg-orange-500/10"
                onClick={() => {/* refresh logic */}}
              >
                <RefreshCw className="w-4 h-4 mr-2" />
                Refresh
              </Button>
            </div>
          </div>
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
              className="bg-slate-700 border-slate-600 text-white rounded-md px-3 py-2 border"
            >
              <option value="all">All Classes</option>
              <option value="Found">Found</option>
              <option value="Fell">Fell (Observed)</option>
            </select>
          </div>
        </CardContent>
      </Card>

      {/* Enhanced Meteorites Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredMeteorites.map((meteorite: any[], index: number) => (
          <Card 
            key={index} 
            className="bg-gradient-to-br from-slate-900/80 to-slate-800/40 border-slate-600/50 hover:border-orange-500/50 transition-all duration-300 hover:transform hover:scale-105 hover:shadow-2xl hover:shadow-orange-500/10 group"
          >
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <CardTitle className="text-white text-lg line-clamp-2 group-hover:text-orange-300 transition-colors">
                  {meteorite[1] || 'Unknown'}
                </CardTitle>
                <Badge 
                  variant="outline" 
                  className={meteorite[6] === 'Fell' ? 'border-red-500/30 text-red-400' : 'border-yellow-500/30 text-yellow-400'}
                >
                  {meteorite[6] || 'Unknown Class'}
                </Badge>
              </div>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="grid grid-cols-2 gap-2">
                {meteorite[5] && (
                  <div className="bg-slate-800/50 rounded-lg p-2 border border-slate-600/30">
                    <div className="text-xs text-gray-400 mb-1">Mass</div>
                    <div className="text-white font-medium text-sm">{meteorite[5]}g</div>
                  </div>
                )}
                {meteorite[4] && (
                  <div className="bg-slate-800/50 rounded-lg p-2 border border-slate-600/30">
                    <div className="text-xs text-gray-400 mb-1">Class</div>
                    <div className="text-white font-medium text-sm">{meteorite[4]}</div>
                  </div>
                )}
              </div>
              
              {meteorite[7] && (
                <div className="bg-slate-800/50 rounded-lg p-2 border border-slate-600/30">
                  <div className="flex items-center justify-between">
                    <span className="text-gray-400 flex items-center gap-1 text-xs">
                      <Calendar className="w-3 h-3" />
                      Year:
                    </span>
                    <span className="text-white font-medium text-sm">{new Date(meteorite[7]).getFullYear()}</span>
                  </div>
                </div>
              )}
              
              {meteorite[8] && meteorite[9] && (
                <div className="bg-slate-800/50 rounded-lg p-2 border border-slate-600/30">
                  <div className="flex items-center justify-between">
                    <span className="text-gray-400 flex items-center gap-1 text-xs">
                      <MapPin className="w-3 h-3" />
                      Location:
                    </span>
                    <span className="text-white text-xs font-medium">
                      {parseFloat(meteorite[8]).toFixed(2)}°, {parseFloat(meteorite[9]).toFixed(2)}°
                    </span>
                  </div>
                </div>
              )}
              
              <div className="pt-2 border-t border-slate-700/50">
                <Button
                  variant="outline"
                  size="sm"
                  className="w-full border-orange-500/30 text-orange-400 hover:bg-orange-500/10 transition-all duration-300"
                >
                  <ExternalLink className="w-3 h-3 mr-2" />
                  View Details
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
      
      {filteredMeteorites.length === 0 && (
        <Card className="bg-slate-800/30 border-slate-600/50">
          <CardContent className="p-8 text-center">
            <Zap className="w-12 h-12 text-gray-500 mx-auto mb-4" />
            <p className="text-gray-400 text-lg mb-2">No meteorites found</p>
            <p className="text-gray-500 text-sm">Try adjusting your search criteria</p>
            <Button
              variant="outline"
              className="mt-4 border-orange-500/30 text-orange-400 hover:bg-orange-500/10"
              onClick={() => {
                setSearchTerm('');
                setClassFilter('all');
              }}
            >
              Reset Filters
            </Button>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default MeteoriteTracker;
