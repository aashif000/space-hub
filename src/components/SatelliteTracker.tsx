import React, { useState, useEffect, useRef } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Badge } from './ui/badge';
import { Satellite, MapPin, Clock, Zap, Globe } from 'lucide-react';
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
  const [currentTime, setCurrentTime] = useState(new Date());
  const [mapKey, setMapKey] = useState(Date.now());

  // ISS Position Query
  const { data: issPosition } = useQuery({
    queryKey: ['iss-position'],
    queryFn: () => fetch('https://api.wheretheiss.at/v1/satellites/25544').then(res => res.json()),
    refetchInterval: 5000,
  });

  // TLE Data Query
  const { data: issTle } = useQuery({
    queryKey: ['iss-tle'],
    queryFn: () => fetch('https://api.wheretheiss.at/v1/satellites/25544/tles').then(res => res.json()),
    refetchInterval: 60000,
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
      {/* Custom styles for ISS marker and map */}
      <style jsx global>{`
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
      `}</style>

      {/* Header */}
      <div className="bg-gradient-to-r from-green-600/20 to-blue-600/20 rounded-lg p-6 border border-green-500/30">
        <div className="flex items-center gap-3 mb-4">
          <Satellite className="w-8 h-8 text-green-400" />
          <div>
            <h1 className="text-2xl font-bold text-white">Satellite Tracker</h1>
            <p className="text-green-200">Real-time satellite positions and orbital data</p>
          </div>
        </div>
      </div>

      {/* ISS Tracker */}
      <Card className="bg-slate-800/50 border-slate-700">
        <CardHeader>
          <CardTitle className="text-white flex items-center gap-2">
            <MapPin className="w-5 h-5 text-green-400" />
            International Space Station
          </CardTitle>
        </CardHeader>
        <CardContent>
          {issPosition ? (
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="text-center">
                <div className="text-2xl font-bold text-green-400">
                  {issPosition.latitude?.toFixed(4)}°
                </div>
                <div className="text-sm text-gray-400">Latitude</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-green-400">
                  {issPosition.longitude?.toFixed(4)}°
                </div>
                <div className="text-sm text-gray-400">Longitude</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-blue-400">
                  {issPosition.altitude?.toFixed(1)} km
                </div>
                <div className="text-sm text-gray-400">Altitude</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-purple-400">
                  {issPosition.velocity?.toFixed(0)} km/h
                </div>
                <div className="text-sm text-gray-400">Velocity</div>
              </div>
            </div>
          ) : (
            <div className="text-center text-gray-400">Loading ISS position...</div>
          )}
        </CardContent>
      </Card>

      {/* ISS Live Map */}
      <Card className="bg-slate-800/50 border-slate-700">
        <CardHeader>
          <CardTitle className="text-white flex items-center gap-2">
            <Globe className="w-5 h-5 text-blue-400" />
            Live ISS Location
          </CardTitle>
        </CardHeader>
        <CardContent>
          {issPosition ? (
            <div className="h-96 rounded-lg overflow-hidden">
              <ISSMap 
                key={mapKey}
                latitude={issPosition.latitude} 
                longitude={issPosition.longitude} 
              />
            </div>
          ) : (
            <div className="h-96 flex items-center justify-center bg-slate-700/50 rounded-lg">
              <div className="text-center text-gray-400">
                Loading live map...
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* TLE Data */}
      <Card className="bg-slate-800/50 border-slate-700">
        <CardHeader>
          <CardTitle className="text-white flex items-center gap-2">
            <Zap className="w-5 h-5 text-yellow-400" />
            ISS Orbital Data
          </CardTitle>
        </CardHeader>
        <CardContent>
          {issTle ? (
            <div className="bg-slate-700/50 rounded-lg p-4">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-white font-medium text-lg">TLE (Two-Line Element)</h3>
                <Badge variant="secondary">NORAD ID: 25544</Badge>
              </div>
              <div className="font-mono text-sm text-gray-300 whitespace-pre">
                {issTle.line1}
                <br />
                {issTle.line2}
              </div>
              <div className="mt-4 grid grid-cols-1 md:grid-cols-3 gap-3">
                <div className="bg-slate-800/70 p-3 rounded">
                  <div className="text-gray-400 text-sm">Inclination</div>
                  <div className="text-white font-bold">
                    {issTle.line2.substring(8, 16).trim()}°
                  </div>
                </div>
                <div className="bg-slate-800/70 p-3 rounded">
                  <div className="text-gray-400 text-sm">RAAN</div>
                  <div className="text-white font-bold">
                    {issTle.line2.substring(17, 25).trim()}°
                  </div>
                </div>
                <div className="bg-slate-800/70 p-3 rounded">
                  <div className="text-gray-400 text-sm">Eccentricity</div>
                  <div className="text-white font-bold">
                    0.{issTle.line2.substring(26, 33).trim()}
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <div className="text-center text-gray-400">Loading TLE data...</div>
          )}
        </CardContent>
      </Card>

      {/* Current Time */}
      <Card className="bg-slate-800/50 border-slate-700">
        <CardContent className="pt-6">
          <div className="flex items-center justify-center gap-3">
            <Clock className="w-5 h-5 text-blue-400" />
            <div className="text-center">
              <div className="text-xl font-bold text-white">
                {currentTime.toUTCString()}
              </div>
              <div className="text-sm text-gray-400">Current UTC Time</div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default SatelliteTracker;