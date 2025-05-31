
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Input } from '../ui/input';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../ui/tabs';
import { Satellite, Download, Calendar, MapPin, Cloud, Search } from 'lucide-react';

interface CopernicusFeature {
  id: string;
  properties: {
    title: string;
    collection: string;
    platform: string;
    productType: string;
    startDate: string;
    completionDate: string;
    cloudCover?: number;
    status: string;
    services?: {
      download?: {
        url: string;
        size: number;
      };
    };
  };
}

export const CopernicusDataExplorer = () => {
  const [sentinelData, setSentinelData] = useState<CopernicusFeature[]>([]);
  const [loading, setLoading] = useState(false);
  const [searchParams, setSearchParams] = useState({
    cloudCover: '[0,10]',
    startDate: '2024-01-01T00:00:00Z',
    completionDate: '2024-12-31T23:59:59Z',
    maxRecords: '20'
  });

  const fetchCopernicusData = async (collection: string = 'Sentinel2') => {
    setLoading(true);
    try {
      const params = new URLSearchParams({
        cloudCover: searchParams.cloudCover,
        startDate: searchParams.startDate,
        completionDate: searchParams.completionDate,
        maxRecords: searchParams.maxRecords
      });

      const response = await fetch(
        `https://catalogue.dataspace.copernicus.eu/resto/api/collections/${collection}/search.json?${params}`
      );
      const data = await response.json();
      setSentinelData(data.features || []);
    } catch (error) {
      console.error('Error fetching Copernicus data:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCopernicusData();
  }, []);

  const formatFileSize = (bytes: number) => {
    const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
    if (bytes === 0) return '0 Byte';
    const i = Math.floor(Math.log(bytes) / Math.log(1024));
    return Math.round(bytes / Math.pow(1024, i) * 100) / 100 + ' ' + sizes[i];
  };

  return (
    <div className="space-y-6">
      <div className="bg-gradient-to-r from-green-600/20 to-blue-600/20 rounded-lg p-6 border border-green-500/30">
        <div className="flex items-center gap-3 mb-4">
          <Satellite className="w-8 h-8 text-green-400" />
          <div>
            <h1 className="text-2xl font-bold text-white">Satellite Data</h1>
            <p className="text-green-200">European Space Agency Earth Observation Data</p>
          </div>
        </div>
      </div>

      {/* Search Controls */}
      <Card className="bg-slate-800/50 border-slate-700">
        <CardHeader>
          <CardTitle className="text-white flex items-center gap-2">
            <Search className="w-5 h-5" />
            Search Parameters
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <div>
              <label className="text-sm text-gray-400 mb-1 block">Cloud Cover (%)</label>
              <Input
                value={searchParams.cloudCover}
                onChange={(e) => setSearchParams({...searchParams, cloudCover: e.target.value})}
                placeholder="[0,10]"
                className="bg-slate-700 border-slate-600 text-white"
              />
            </div>
            <div>
              <label className="text-sm text-gray-400 mb-1 block">Start Date</label>
              <Input
                type="date"
                value={searchParams.startDate.split('T')[0]}
                onChange={(e) => setSearchParams({...searchParams, startDate: `${e.target.value}T00:00:00Z`})}
                className="bg-slate-700 border-slate-600 text-white"
              />
            </div>
            <div>
              <label className="text-sm text-gray-400 mb-1 block">End Date</label>
              <Input
                type="date"
                value={searchParams.completionDate.split('T')[0]}
                onChange={(e) => setSearchParams({...searchParams, completionDate: `${e.target.value}T23:59:59Z`})}
                className="bg-slate-700 border-slate-600 text-white"
              />
            </div>
            <div>
              <label className="text-sm text-gray-400 mb-1 block">Max Records</label>
              <Input
                type="number"
                value={searchParams.maxRecords}
                onChange={(e) => setSearchParams({...searchParams, maxRecords: e.target.value})}
                className="bg-slate-700 border-slate-600 text-white"
              />
            </div>
          </div>
          <div className="flex gap-2 mt-4">
            <Button onClick={() => fetchCopernicusData('Sentinel2')} disabled={loading}>
              Search Sentinel-2
            </Button>
            <Button onClick={() => fetchCopernicusData('Sentinel3')} disabled={loading} variant="outline">
              Search Sentinel-3
            </Button>
            <Button onClick={() => fetchCopernicusData('Sentinel1')} disabled={loading} variant="outline">
              Search Sentinel-1
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Results */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {loading ? (
          <div className="col-span-full flex items-center justify-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-500"></div>
          </div>
        ) : (
          sentinelData.map((feature) => (
            <Card key={feature.id} className="bg-slate-800/50 border-slate-700 hover:bg-slate-800/70 transition-all duration-300">
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <Badge variant="outline" className="text-green-400 border-green-500">
                    {feature.properties.collection}
                  </Badge>
                  <Badge variant={feature.properties.status === 'ONLINE' ? 'default' : 'secondary'}>
                    {feature.properties.status}
                  </Badge>
                </div>
                <CardTitle className="text-sm text-white line-clamp-2">
                  {feature.properties.title}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2 text-sm">
                  <div className="flex items-center text-gray-400">
                    <Satellite className="w-4 h-4 mr-2" />
                    {feature.properties.platform} - {feature.properties.productType}
                  </div>
                  <div className="flex items-center text-gray-400">
                    <Calendar className="w-4 h-4 mr-2" />
                    {new Date(feature.properties.startDate).toLocaleDateString()}
                  </div>
                  {feature.properties.cloudCover !== undefined && (
                    <div className="flex items-center text-gray-400">
                      <Cloud className="w-4 h-4 mr-2" />
                      {feature.properties.cloudCover.toFixed(2)}% cloud cover
                    </div>
                  )}
                  {feature.properties.services?.download && (
                    <div className="flex items-center justify-between mt-3">
                      <span className="text-xs text-gray-500">
                        {formatFileSize(feature.properties.services.download.size)}
                      </span>
                      <Button size="sm" variant="outline" className="h-6 text-xs">
                        <Download className="w-3 h-3 mr-1" />
                        Download
                      </Button>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </div>
    </div>
  );
};
