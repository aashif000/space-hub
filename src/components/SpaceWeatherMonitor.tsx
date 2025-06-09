import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Badge } from './ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { Button } from './ui/button';
import { useTheme } from '../contexts/ThemeContext';
import { Shield, Activity, AlertTriangle, Sun, Zap, Satellite, TrendingUp, Clock, RefreshCw, ExternalLink, Thermometer, Wind } from 'lucide-react';

interface SolarData {
  id: string;
  eventTime: string;
  classType: string;
  sourceLocation: string;
  activeRegionNum: number;
  instruments: string[];
  peakTime: string;
  endTime: string;
  link: string;
}

interface GeomagneticData {
  id: string;
  eventTime: string;
  allKpIndex: { observedTime: string; kpIndex: number; source: string }[];
  estimatedKp: number;
  predictedKp: number;
  link: string;
}

const SpaceWeatherMonitor = () => {
  const { theme } = useTheme();
  const [solarFlares, setSolarFlares] = useState<SolarData[]>([]);
  const [geomagneticData, setGeomagneticData] = useState<GeomagneticData[]>([]);
  const [loading, setLoading] = useState(true);
  const [lastUpdated, setLastUpdated] = useState(new Date());

  // Mock data for demonstration (in real app, this would fetch from NASA DONKI API)
  useEffect(() => {
    const mockSolarFlares: SolarData[] = [
      {
        id: 'FLR001',
        eventTime: '2024-06-07T14:23:00Z',
        classType: 'M5.8',
        sourceLocation: 'S15W23',
        activeRegionNum: 3712,
        instruments: ['GOES-16', 'GOES-18'],
        peakTime: '2024-06-07T14:45:00Z',
        endTime: '2024-06-07T15:12:00Z',
        link: 'https://kauai.ccmc.gsfc.nasa.gov/DONKI/'
      },
      {
        id: 'FLR002',
        eventTime: '2024-06-06T09:15:00Z',
        classType: 'C2.3',
        sourceLocation: 'N12E45',
        activeRegionNum: 3708,
        instruments: ['GOES-16'],
        peakTime: '2024-06-06T09:32:00Z',
        endTime: '2024-06-06T10:01:00Z',
        link: 'https://kauai.ccmc.gsfc.nasa.gov/DONKI/'
      },
      {
        id: 'FLR003',
        eventTime: '2024-06-05T22:07:00Z',
        classType: 'X1.2',
        sourceLocation: 'S08W12',
        activeRegionNum: 3705,
        instruments: ['GOES-16', 'GOES-18', 'SDO/EVE'],
        peakTime: '2024-06-05T22:34:00Z',
        endTime: '2024-06-05T23:18:00Z',
        link: 'https://kauai.ccmc.gsfc.nasa.gov/DONKI/'
      }
    ];

    const mockGeomagneticData: GeomagneticData[] = [
      {
        id: 'GST001',
        eventTime: '2024-06-07T18:00:00Z',
        allKpIndex: [
          { observedTime: '2024-06-07T18:00:00Z', kpIndex: 5.0, source: 'NOAA' },
          { observedTime: '2024-06-07T21:00:00Z', kpIndex: 6.3, source: 'NOAA' },
          { observedTime: '2024-06-08T00:00:00Z', kpIndex: 4.7, source: 'NOAA' }
        ],
        estimatedKp: 5.5,
        predictedKp: 4.2,
        link: 'https://kauai.ccmc.gsfc.nasa.gov/DONKI/'
      }
    ];

    setTimeout(() => {
      setSolarFlares(mockSolarFlares);
      setGeomagneticData(mockGeomagneticData);
      setLoading(false);
      setLastUpdated(new Date());
    }, 1000);
  }, []);

  const getFlareClassColor = (classType: string) => {
    if (classType.startsWith('X')) return 'text-red-400 bg-red-500/20 border-red-500/50';
    if (classType.startsWith('M')) return 'text-orange-400 bg-orange-500/20 border-orange-500/50';
    if (classType.startsWith('C')) return 'text-yellow-400 bg-yellow-500/20 border-yellow-500/50';
    return 'text-gray-400 bg-gray-500/20 border-gray-500/50';
  };

  const getKpColor = (kp: number) => {
    if (kp >= 7) return 'text-red-400';
    if (kp >= 5) return 'text-orange-400';
    if (kp >= 3) return 'text-yellow-400';
    return 'text-green-400';
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-500"></div>
      </div>
    );
  }
  return (
    <div className="space-y-6">      {/* Enhanced Header */}
      <div className={`rounded-lg p-6 border ${
        theme === 'dark' 
          ? 'bg-gradient-to-r from-red-600/20 to-orange-600/20 border-red-500/30' 
          : 'bg-gradient-to-r from-red-500/10 to-orange-500/10 border-red-400/30'
      }`}>
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="relative">
              <Sun className={`w-8 h-8 animate-pulse ${
                theme === 'dark' ? 'text-orange-400' : 'text-orange-600'
              }`} />
              <Shield className={`w-4 h-4 absolute -top-1 -right-1 ${
                theme === 'dark' ? 'text-red-400' : 'text-red-600'
              }`} />
            </div>
            <div>
              <h1 className={`text-3xl font-bold mb-2 ${
                theme === 'dark' ? 'text-white' : 'text-gray-900'
              }`}>Space Weather Monitor</h1>
              <p className={`${
                theme === 'dark' ? 'text-orange-200' : 'text-orange-700'
              }`}>
                Real-time solar activity • Geomagnetic conditions • Satellite protection alerts
              </p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <Button
              size="sm"
              variant="outline"
              className={`${
                theme === 'dark' 
                  ? 'border-orange-500/50 text-orange-300 hover:bg-orange-500/10' 
                  : 'theme-nav-button'
              }`}
              onClick={() => {
                setLoading(true);
                setTimeout(() => {
                  setLoading(false);
                  setLastUpdated(new Date());
                }, 1000);
              }}
            >
              <RefreshCw className="w-4 h-4 mr-2" />
              Refresh
            </Button>
            <div className="text-right">
              <div className="flex items-center gap-2 text-sm text-gray-400">
                <Clock className="w-4 h-4" />
                {lastUpdated.toLocaleTimeString()}
              </div>
              <div className="text-xs text-gray-500">Last updated</div>
            </div>
          </div>
        </div>
      </div>

      {/* Current Conditions Dashboard */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="bg-gradient-to-br from-orange-600/20 to-red-600/20 border-orange-500/30">
          <CardHeader className="pb-2">
            <CardTitle className="text-white flex items-center gap-2 text-sm">
              <Sun className="w-4 h-4 text-orange-400" />
              Solar Activity
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-orange-400 mb-1">Moderate</div>
            <div className="text-xs text-orange-200">M-class flares detected</div>
            <div className="mt-2 text-xs text-gray-400">
              {solarFlares.length} events in 24h
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-blue-600/20 to-cyan-600/20 border-blue-500/30">
          <CardHeader className="pb-2">
            <CardTitle className="text-white flex items-center gap-2 text-sm">
              <Shield className="w-4 h-4 text-blue-400" />
              Geomagnetic Field
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-400 mb-1">Active</div>
            <div className="text-xs text-blue-200">Kp index: 5.5</div>
            <div className="mt-2 text-xs text-gray-400">
              Minor storm conditions
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-purple-600/20 to-pink-600/20 border-purple-500/30">
          <CardHeader className="pb-2">
            <CardTitle className="text-white flex items-center gap-2 text-sm">
              <Satellite className="w-4 h-4 text-purple-400" />
              Satellite Risk
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-purple-400 mb-1">Low</div>
            <div className="text-xs text-purple-200">Normal operations</div>
            <div className="mt-2 text-xs text-gray-400">
              No major disruptions
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-green-600/20 to-emerald-600/20 border-green-500/30">
          <CardHeader className="pb-2">
            <CardTitle className="text-white flex items-center gap-2 text-sm">
              <Activity className="w-4 h-4 text-green-400" />
              Radio Conditions
            </CardTitle>
          </CardHeader>
          <CardContent>            <div className="text-2xl font-bold text-green-400 mb-1">Good</div>
            <div className="text-xs text-green-200">HF propagation normal</div>
            <div className="mt-2 text-xs text-gray-400">
              Clear communications
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Detailed Data */}
      <Tabs defaultValue="flares" className="space-y-4">
        <TabsList className="grid grid-cols-3 bg-slate-800/50">
          <TabsTrigger value="flares">Solar Flares</TabsTrigger>
          <TabsTrigger value="geomagnetic">Geomagnetic Activity</TabsTrigger>
          <TabsTrigger value="forecast">Forecast</TabsTrigger>
        </TabsList>

        <TabsContent value="flares" className="space-y-4">
          <div className="grid gap-4">
            {solarFlares.map((flare) => (
              <Card key={flare.id} className="bg-slate-800/50 border-slate-700">
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-white text-lg flex items-center gap-3">
                      <Zap className="w-5 h-5 text-orange-400" />
                      Solar Flare - {flare.classType}
                    </CardTitle>
                    <Badge className={getFlareClassColor(flare.classType)}>
                      {flare.classType}
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <span className="text-gray-400">Event Time:</span>
                      <div className="text-white">{new Date(flare.eventTime).toLocaleString()}</div>
                    </div>
                    <div>
                      <span className="text-gray-400">Peak Time:</span>
                      <div className="text-white">{new Date(flare.peakTime).toLocaleString()}</div>
                    </div>
                    <div>
                      <span className="text-gray-400">Source Location:</span>
                      <div className="text-white">{flare.sourceLocation}</div>
                    </div>
                    <div>
                      <span className="text-gray-400">Active Region:</span>
                      <div className="text-white">AR {flare.activeRegionNum}</div>
                    </div>
                  </div>
                  <div>
                    <span className="text-gray-400 text-sm">Instruments:</span>
                    <div className="flex gap-2 mt-1">
                      {flare.instruments.map((instrument, idx) => (
                        <Badge key={idx} variant="outline" className="text-xs">
                          {instrument}
                        </Badge>
                      ))}
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="geomagnetic" className="space-y-4">
          {geomagneticData.map((data) => (
            <Card key={data.id} className="bg-slate-800/50 border-slate-700">
              <CardHeader>
                <CardTitle className="text-white text-lg flex items-center gap-3">
                  <Activity className="w-5 h-5 text-blue-400" />
                  Geomagnetic Storm Activity
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <span className="text-gray-400 text-sm">Current Kp Index:</span>
                    <div className={`text-xl font-bold ${getKpColor(data.estimatedKp)}`}>
                      {data.estimatedKp}
                    </div>
                  </div>
                  <div>
                    <span className="text-gray-400 text-sm">Predicted Kp:</span>
                    <div className={`text-xl font-bold ${getKpColor(data.predictedKp)}`}>
                      {data.predictedKp}
                    </div>
                  </div>
                </div>
                <div>
                  <span className="text-gray-400 text-sm mb-2 block">Recent Kp Measurements:</span>
                  <div className="space-y-2">
                    {data.allKpIndex.map((kp, idx) => (
                      <div key={idx} className="flex justify-between items-center bg-slate-700/50 p-2 rounded">
                        <span className="text-sm text-gray-300">
                          {new Date(kp.observedTime).toLocaleTimeString()}
                        </span>
                        <span className={`font-bold ${getKpColor(kp.kpIndex)}`}>
                          {kp.kpIndex}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </TabsContent>

        <TabsContent value="forecast" className="space-y-4">
          <Card className="bg-slate-800/50 border-slate-700">
            <CardHeader>
              <CardTitle className="text-white text-lg flex items-center gap-3">
                <TrendingUp className="w-5 h-5 text-purple-400" />
                3-Day Forecast
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {[
                  { day: 'Today', solar: 'Moderate', geo: 'Active', risk: 'Low' },
                  { day: 'Tomorrow', solar: 'Low', geo: 'Quiet', risk: 'Very Low' },
                  { day: 'Day 3', solar: 'Moderate', geo: 'Unsettled', risk: 'Low' }
                ].map((forecast, idx) => (
                  <div key={idx} className="bg-slate-700/50 p-4 rounded-lg">
                    <div className="grid grid-cols-4 gap-4 text-sm">
                      <div>
                        <span className="text-gray-400">Day:</span>
                        <div className="text-white font-medium">{forecast.day}</div>
                      </div>
                      <div>
                        <span className="text-gray-400">Solar Activity:</span>
                        <div className="text-orange-400">{forecast.solar}</div>
                      </div>
                      <div>
                        <span className="text-gray-400">Geomagnetic:</span>
                        <div className="text-blue-400">{forecast.geo}</div>
                      </div>
                      <div>
                        <span className="text-gray-400">Satellite Risk:</span>
                        <div className="text-green-400">{forecast.risk}</div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Alert Section */}
      <Card className="bg-gradient-to-r from-amber-900/20 to-red-900/20 border-amber-500/30">
        <CardHeader>
          <CardTitle className="text-white text-lg flex items-center gap-3">
            <AlertTriangle className="w-5 h-5 text-amber-400" />
            Space Weather Alerts
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="bg-amber-500/10 border border-amber-500/30 rounded-lg p-4">
            <div className="flex items-center gap-3 mb-2">
              <div className="w-2 h-2 bg-amber-400 rounded-full animate-pulse"></div>
              <span className="text-amber-400 font-medium">Minor Geomagnetic Storm Watch</span>
            </div>
            <p className="text-gray-300 text-sm">
              Elevated geomagnetic activity expected due to high-speed solar wind stream. 
              Aurora may be visible at higher latitudes. Minimal impact on satellites expected.
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default SpaceWeatherMonitor;
