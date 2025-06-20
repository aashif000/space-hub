import React, { useState, useEffect, useRef } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Badge } from './ui/badge';
import { Button } from './ui/button';
import { useTheme } from '../contexts/ThemeContext';
import { Satellite, MapPin, Clock, Zap, Globe, RefreshCw, ExternalLink, Orbit, TrendingUp } from 'lucide-react';
import { useQuery } from '@tanstack/react-query';

// ISS Map Component
interface ISSMapProps {
  latitude: number;
  longitude: number;
}

const ISSMap: React.FC<ISSMapProps> = ({ latitude, longitude }) => {
  const mapRef = useRef<any>(null);
  const markerRef = useRef<any>(null);
  const mapContainerRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    // Dynamically import Leaflet only on client-side
    const initializeMap = async () => {
      const L = await import('leaflet');
      await import('leaflet/dist/leaflet.css');
      
      // Fix for default marker icons
      delete (L.Icon.Default.prototype as any)._getIconUrl;
      L.Icon.Default.mergeOptions({
        iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
        iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
        shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
      });

      if (!mapContainerRef.current) return;

      // Initialize map
      mapRef.current = L.map(mapContainerRef.current, {
        center: [latitude, longitude],
        zoom: 3,
        attributionControl: false,
      });

      // Add tile layer
      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
      }).addTo(mapRef.current);

      // Custom ISS icon
      const issIcon = L.divIcon({
        className: 'iss-icon',
        html: '<div class="iss-marker"></div>',
        iconSize: [30, 30],
        iconAnchor: [15, 15]
      });

      // Add ISS marker
      markerRef.current = L.marker([latitude, longitude], { icon: issIcon })
        .addTo(mapRef.current)
        .bindPopup('International Space Station');
    };

    if (typeof window !== 'undefined') {
      initializeMap();
    }

    return () => {
      if (mapRef.current) {
        mapRef.current.remove();
      }
    };
  }, []);

  // Update position when data changes
  useEffect(() => {
    if (mapRef.current && markerRef.current) {
      mapRef.current.setView([latitude, longitude]);
      markerRef.current.setLatLng([latitude, longitude]);
    }
  }, [latitude, longitude]);

  return (
    <div 
      ref={mapContainerRef} 
      className="w-full h-full"
      style={{ backgroundColor: '#1e293b' }}
    />
  );
};

// Main Satellite Tracker Component
const SatelliteTracker = () => {
  const { theme } = useTheme();
  const [currentTime, setCurrentTime] = useState(new Date());
  const [mapKey, setMapKey] = useState(Date.now());

  // ISS Position Query
  const { data: issPosition } = useQuery({
    queryKey: ['iss-position'],
    queryFn: () => fetch('https://api.wheretheiss.at/v1/satellites/25544').then(res => res.json()),
    refetchInterval: false, // Disabled automatic refetch
  });

  // TLE Data Query
  const { data: issTle } = useQuery({
    queryKey: ['iss-tle'],
    queryFn: () => fetch('https://api.wheretheiss.at/v1/satellites/25544/tles').then(res => res.json()),
    refetchInterval: false, // Disabled automatic refetch
  });

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
      // Update map key every 5 seconds to force re-render
      if (Date.now() - mapKey > 5000) {
        setMapKey(Date.now());
      }
    }, 1000);

    return () => clearInterval(timer);
  }, [mapKey]);

  return (
    <div className="space-y-6">
      {/* Custom styles for ISS marker and map */}      <style dangerouslySetInnerHTML={{
        __html: `
        .iss-marker {
          width: 30px;
          height: 30px;
          background: radial-gradient(circle, #60a5fa 0%, #3b82f6 50%, #2563eb 100%);
          border-radius: 50%;
          border: 2px solid white;
          box-shadow: 0 0 10px rgba(59, 130, 246, 0.7);
          animation: pulse 2s infinite;
        }
        
        @keyframes pulse {
          0% {
            box-shadow: 0 0 0 0 rgba(59, 130, 246, 0.7);
          }
          70% {
            box-shadow: 0 0 0 10px rgba(59, 130, 246, 0);
          }
          100% {
            box-shadow: 0 0 0 0 rgba(59, 130, 246, 0);
          }
        }
        
        .leaflet-tile {
          filter: invert(1) hue-rotate(180deg) brightness(0.95) contrast(0.9) !important;
        }
        
        .leaflet-container {
          background-color: #1e293b !important;
        }
        `
      }} />

      {/* Enhanced Header */}
      <div className="bg-gradient-to-r from-green-900/50 via-blue-900/50 to-purple-900/50 rounded-xl p-6 border border-green-500/30 shadow-2xl">
        <div className="flex items-center justify-between">        <div className="flex items-center space-x-4">
            <div className="relative">
              <Satellite className={`w-10 h-10 animate-pulse ${
                theme === 'dark' ? 'text-green-400' : 'text-green-600'
              }`} />
              <div className={`absolute -top-1 -right-1 w-4 h-4 rounded-full animate-ping ${
                theme === 'dark' ? 'bg-blue-400' : 'bg-blue-500'
              }`}></div>
            </div>
            <div>
              <h1 className={`text-3xl font-bold mb-1 ${
                theme === 'dark' ? 'text-white' : 'text-gray-900'
              }`}>
                Satellite Tracker
              </h1>
              <p className={`${
                theme === 'dark' ? 'text-green-200' : 'text-green-700'
              }`}>
                Real-time ISS position • Orbital mechanics • Live tracking data
              </p>
            </div>
          </div>
          <div className="hidden md:flex items-center space-x-6 text-sm">
            <div className="text-center">
              <div className={`text-2xl font-bold ${
                theme === 'dark' ? 'text-green-400' : 'text-green-600'
              }`}>
                {issPosition?.altitude?.toFixed(1) || '---'}
              </div>
              <div className={`${
                theme === 'dark' ? 'text-green-200' : 'text-green-700'
              }`}>Altitude (km)</div>            </div>
            <div className="text-center">
              <div className={`text-2xl font-bold ${
                theme === 'dark' ? 'text-blue-400' : 'text-blue-600'
              }`}>
                {issPosition?.velocity?.toFixed(0) || '---'}
              </div>
              <div className={`${
                theme === 'dark' ? 'text-blue-200' : 'text-blue-700'
              }`}>Speed (km/h)</div>
            </div>
            <div className="text-center">
              <div className={`text-2xl font-bold ${
                theme === 'dark' ? 'text-purple-400' : 'text-purple-600'
              }`}>25544</div>
              <div className={`${
                theme === 'dark' ? 'text-purple-200' : 'text-purple-700'
              }`}>NORAD ID</div>
            </div>
          </div>
        </div>
      </div>      {/* Enhanced Statistics Dashboard */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {issPosition && (
          <>
            <Card className={`border transition-all duration-300 hover:shadow-xl ${
              theme === 'dark' 
                ? 'bg-gradient-to-br from-green-900/40 to-green-800/20 border-green-500/30 hover:border-green-400/50 hover:shadow-green-500/10' 
                : 'bg-gradient-to-br from-green-50 to-green-100 border-green-300/50 hover:border-green-400/70 hover:shadow-green-500/20'
            }`}>
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className={`text-sm font-medium ${
                      theme === 'dark' ? 'text-green-300' : 'text-green-700'
                    }`}>Latitude</p>
                    <p className={`text-2xl font-bold ${
                      theme === 'dark' ? 'text-white' : 'text-gray-900'
                    }`}>
                      {issPosition.latitude?.toFixed(4)}°
                    </p>
                  </div>
                  <MapPin className={`w-8 h-8 ${
                    theme === 'dark' ? 'text-green-400' : 'text-green-600'
                  }`} />
                </div>
              </CardContent>
            </Card>

            <Card className={`border transition-all duration-300 hover:shadow-xl ${
              theme === 'dark' 
                ? 'bg-gradient-to-br from-blue-900/40 to-blue-800/20 border-blue-500/30 hover:border-blue-400/50 hover:shadow-blue-500/10' 
                : 'bg-gradient-to-br from-blue-50 to-blue-100 border-blue-300/50 hover:border-blue-400/70 hover:shadow-blue-500/20'
            }`}>
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className={`text-sm font-medium ${
                      theme === 'dark' ? 'text-blue-300' : 'text-blue-700'
                    }`}>Longitude</p>
                    <p className={`text-2xl font-bold ${
                      theme === 'dark' ? 'text-white' : 'text-gray-900'
                    }`}>
                      {issPosition.longitude?.toFixed(4)}°
                    </p>
                  </div>
                  <Globe className={`w-8 h-8 ${
                    theme === 'dark' ? 'text-blue-400' : 'text-blue-600'
                  }`} />
                </div>
              </CardContent>
            </Card>

            <Card className="bg-gradient-to-br from-purple-900/40 to-purple-800/20 border-purple-500/30 hover:border-purple-400/50 transition-all duration-300 hover:shadow-xl hover:shadow-purple-500/10">
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-purple-300 text-sm font-medium">Altitude</p>
                    <p className="text-2xl font-bold text-white">
                      {issPosition.altitude?.toFixed(1)} km
                    </p>
                  </div>
                  <TrendingUp className="w-8 h-8 text-purple-400" />                </div>
              </CardContent>
            </Card>

            <Card className={`border transition-all duration-300 hover:shadow-xl ${
              theme === 'dark' 
                ? 'bg-gradient-to-br from-purple-900/40 to-purple-800/20 border-purple-500/30 hover:border-purple-400/50 hover:shadow-purple-500/10' 
                : 'bg-gradient-to-br from-purple-50 to-purple-100 border-purple-300/50 hover:border-purple-400/70 hover:shadow-purple-500/20'
            }`}>
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className={`text-sm font-medium ${
                      theme === 'dark' ? 'text-purple-300' : 'text-purple-700'
                    }`}>Altitude</p>
                    <p className={`text-2xl font-bold ${
                      theme === 'dark' ? 'text-white' : 'text-gray-900'
                    }`}>
                      {issPosition.altitude?.toFixed(1)} km
                    </p>
                  </div>
                  <TrendingUp className={`w-8 h-8 ${
                    theme === 'dark' ? 'text-purple-400' : 'text-purple-600'
                  }`} />
                </div>
              </CardContent>
            </Card>

            <Card className={`border transition-all duration-300 hover:shadow-xl ${
              theme === 'dark' 
                ? 'bg-gradient-to-br from-orange-900/40 to-orange-800/20 border-orange-500/30 hover:border-orange-400/50 hover:shadow-orange-500/10' 
                : 'bg-gradient-to-br from-orange-50 to-orange-100 border-orange-300/50 hover:border-orange-400/70 hover:shadow-orange-500/20'
            }`}>
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className={`text-sm font-medium ${
                      theme === 'dark' ? 'text-orange-300' : 'text-orange-700'
                    }`}>Velocity</p>
                    <p className={`text-2xl font-bold ${
                      theme === 'dark' ? 'text-white' : 'text-gray-900'
                    }`}>
                      {issPosition.velocity?.toFixed(0)} km/h
                    </p>
                  </div>
                  <Zap className={`w-8 h-8 ${
                    theme === 'dark' ? 'text-orange-400' : 'text-orange-600'
                  }`} />
                </div>
              </CardContent>
            </Card>
          </>
        )}
      </div>

      {/* Enhanced ISS Live Map */}
      <Card className="bg-slate-800/30 border-slate-600/50">
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <CardTitle className="text-white flex items-center gap-2">
              <Globe className="w-5 h-5 text-blue-400" />
              Live ISS Location
            </CardTitle>
            <div className="flex items-center gap-2">
              <Badge className="bg-green-500/20 text-green-400 border-green-500/30">
                <div className="w-2 h-2 bg-green-400 rounded-full mr-2 animate-pulse"></div>
                LIVE
              </Badge>
              <Button
                variant="outline"
                size="sm"
                className="border-blue-500/30 text-blue-400 hover:bg-blue-500/10"
                onClick={() => {/* refresh logic */}}
              >
                <RefreshCw className="w-4 h-4 mr-2" />
                Refresh
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          {issPosition ? (
            <div className="h-96 rounded-lg overflow-hidden border border-slate-600/50">
              <ISSMap 
                key={mapKey}
                latitude={issPosition.latitude} 
                longitude={issPosition.longitude} 
              />
            </div>
          ) : (
            <div className="h-96 flex items-center justify-center bg-slate-700/50 rounded-lg border border-slate-600/50">
              <div className="text-center text-gray-400">
                <Satellite className="w-12 h-12 mx-auto mb-4 animate-spin" />
                Loading live map...
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Enhanced TLE Data */}
      <Card className="bg-slate-800/30 border-slate-600/50">
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <CardTitle className="text-white flex items-center gap-2">
              <Orbit className="w-5 h-5 text-yellow-400" />
              ISS Orbital Data
            </CardTitle>
            <Badge variant="outline" className="border-yellow-500/30 text-yellow-400">
              NORAD ID: 25544
            </Badge>
          </div>
        </CardHeader>
        <CardContent>
          {issTle ? (
            <div className="space-y-4">
              <div className="bg-slate-700/50 rounded-lg p-4 border border-slate-600/30">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-white font-medium text-lg">TLE (Two-Line Element)</h3>
                  <Button
                    variant="outline"
                    size="sm"
                    className="border-yellow-500/30 text-yellow-400 hover:bg-yellow-500/10"
                  >
                    <ExternalLink className="w-4 h-4 mr-2" />
                    View Details
                  </Button>
                </div>
                <div className="font-mono text-sm text-gray-300 whitespace-pre bg-slate-800/50 p-3 rounded border border-slate-600/20">
                  {issTle.line1}
                  <br />
                  {issTle.line2}
                </div>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <Card className="bg-gradient-to-br from-slate-800/50 to-slate-700/30 border-slate-600/50">
                  <CardContent className="p-4">
                    <div className="text-center">
                      <div className="text-gray-400 text-sm mb-1">Inclination</div>
                      <div className="text-white font-bold text-lg">
                        {issTle.line2.substring(8, 16).trim()}°
                      </div>
                    </div>
                  </CardContent>
                </Card>
                
                <Card className="bg-gradient-to-br from-slate-800/50 to-slate-700/30 border-slate-600/50">
                  <CardContent className="p-4">
                    <div className="text-center">
                      <div className="text-gray-400 text-sm mb-1">RAAN</div>
                      <div className="text-white font-bold text-lg">
                        {issTle.line2.substring(17, 25).trim()}°
                      </div>
                    </div>
                  </CardContent>
                </Card>
                
                <Card className="bg-gradient-to-br from-slate-800/50 to-slate-700/30 border-slate-600/50">
                  <CardContent className="p-4">
                    <div className="text-center">
                      <div className="text-gray-400 text-sm mb-1">Eccentricity</div>
                      <div className="text-white font-bold text-lg">
                        0.{issTle.line2.substring(26, 33).trim()}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          ) : (
            <div className="text-center text-gray-400 py-8">Loading TLE data...</div>
          )}
        </CardContent>
      </Card>

      {/* Enhanced Current Time */}
      <Card className="bg-slate-800/30 border-slate-600/50">
        <CardContent className="pt-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Clock className="w-5 h-5 text-blue-400" />
              <div>
                <div className="text-xl font-bold text-white">
                  {currentTime.toUTCString()}
                </div>
                <div className="text-sm text-gray-400">Current UTC Time</div>
              </div>
            </div>
            <div className="text-right">
              <div className="text-blue-400 font-medium">
                Next Update: {5 - (Date.now() % 5000) / 1000}s
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default SatelliteTracker;