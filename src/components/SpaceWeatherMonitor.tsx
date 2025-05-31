
import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Shield, Sun, Activity, AlertTriangle, TrendingUp, Zap } from 'lucide-react';

const SpaceWeatherMonitor = () => {
  const [selectedEvent, setSelectedEvent] = useState('all');

  // NASA DONKI API calls
  const { data: solarFlares } = useQuery({
    queryKey: ['solar-flares'],
    queryFn: () => fetch('https://api.nasa.gov/DONKI/FLR?api_key=DEMO_KEY').then(res => res.json()),
  });

  const { data: cmeData } = useQuery({
    queryKey: ['cme-data'],
    queryFn: () => fetch('https://api.nasa.gov/DONKI/CME?api_key=DEMO_KEY').then(res => res.json()),
  });

  const { data: geomagneticStorms } = useQuery({
    queryKey: ['geomagnetic-storms'],
    queryFn: () => fetch('https://api.nasa.gov/DONKI/GST?api_key=DEMO_KEY').then(res => res.json()),
  });

  // Mock data for demonstration
  const mockSpaceWeatherData = [
    {
      id: 1,
      type: 'Solar Flare',
      class: 'X2.3',
      time: '2025-05-31T14:30:00Z',
      location: 'N15E25',
      severity: 'high',
      impact: 'Radio blackouts possible',
    },
    {
      id: 2,
      type: 'CME',
      speed: '850 km/s',
      time: '2025-05-31T12:15:00Z',
      direction: 'Earth-directed',
      severity: 'medium',
      impact: 'Geomagnetic storm likely',
    },
    {
      id: 3,
      type: 'Geomagnetic Storm',
      level: 'G2 (Moderate)',
      time: '2025-05-31T08:45:00Z',
      duration: '6 hours',
      severity: 'medium',
      impact: 'Aurora visible at high latitudes',
    },
  ];

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'high': return 'text-red-400 border-red-500/30 bg-red-500/10';
      case 'medium': return 'text-yellow-400 border-yellow-500/30 bg-yellow-500/10';
      case 'low': return 'text-green-400 border-green-500/30 bg-green-500/10';
      default: return 'text-gray-400 border-gray-500/30 bg-gray-500/10';
    }
  };

  const getEventIcon = (type: string) => {
    switch (type) {
      case 'Solar Flare': return Sun;
      case 'CME': return Activity;
      case 'Geomagnetic Storm': return Zap;
      default: return Shield;
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-gradient-to-r from-orange-900/50 to-red-900/50 rounded-lg p-6 border border-orange-500/20">
        <h2 className="text-3xl font-bold text-white mb-2 flex items-center">
          <Shield className="w-8 h-8 mr-3 text-orange-400" />
          Space Weather Monitor
        </h2>
        <p className="text-orange-200">
          Real-time monitoring of solar activity and space weather events
        </p>
      </div>

      {/* Current Status */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-slate-800/50 rounded-lg p-4 border border-green-500/20">
          <div className="flex items-center justify-between mb-2">
            <h3 className="text-green-400 font-semibold">Solar Activity</h3>
            <div className="w-3 h-3 bg-green-400 rounded-full animate-pulse"></div>
          </div>
          <p className="text-2xl font-bold text-white">Moderate</p>
          <p className="text-sm text-gray-400">Last flare: X2.3 class</p>
        </div>

        <div className="bg-slate-800/50 rounded-lg p-4 border border-yellow-500/20">
          <div className="flex items-center justify-between mb-2">
            <h3 className="text-yellow-400 font-semibold">Geomagnetic Field</h3>
            <div className="w-3 h-3 bg-yellow-400 rounded-full animate-pulse"></div>
          </div>
          <p className="text-2xl font-bold text-white">Disturbed</p>
          <p className="text-sm text-gray-400">Kp index: 5</p>
        </div>

        <div className="bg-slate-800/50 rounded-lg p-4 border border-blue-500/20">
          <div className="flex items-center justify-between mb-2">
            <h3 className="text-blue-400 font-semibold">Radio Conditions</h3>
            <div className="w-3 h-3 bg-blue-400 rounded-full animate-pulse"></div>
          </div>
          <p className="text-2xl font-bold text-white">Good</p>
          <p className="text-sm text-gray-400">Minor degradation</p>
        </div>
      </div>

      {/* Event Filter */}
      <div className="flex flex-wrap gap-2">
        {['all', 'Solar Flare', 'CME', 'Geomagnetic Storm'].map((eventType) => (
          <button
            key={eventType}
            onClick={() => setSelectedEvent(eventType)}
            className={`px-4 py-2 rounded-lg transition-all duration-200 ${
              selectedEvent === eventType
                ? 'bg-orange-600/20 text-orange-400 border border-orange-500/30'
                : 'bg-slate-800/50 text-gray-400 border border-gray-600 hover:text-orange-400'
            }`}
          >
            {eventType === 'all' ? 'All Events' : eventType}
          </button>
        ))}
      </div>

      {/* Recent Events */}
      <div className="space-y-4">
        <h3 className="text-xl font-bold text-white mb-4">Recent Space Weather Events</h3>
        
        {mockSpaceWeatherData
          .filter(event => selectedEvent === 'all' || event.type === selectedEvent)
          .map((event) => {
            const EventIcon = getEventIcon(event.type);
            return (
              <div key={event.id} className={`rounded-lg p-6 border ${getSeverityColor(event.severity)} transition-all duration-300 hover:transform hover:scale-105`}>
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center space-x-3">
                    <EventIcon className="w-6 h-6" />
                    <div>
                      <h4 className="text-lg font-bold text-white">{event.type}</h4>
                      <p className="text-sm text-gray-400">
                        {new Date(event.time).toLocaleString()}
                      </p>
                    </div>
                  </div>
                  
                  <span className={`px-3 py-1 rounded-full text-xs font-medium border ${getSeverityColor(event.severity)}`}>
                    {event.severity.toUpperCase()}
                  </span>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {event.type === 'Solar Flare' && (
                    <>
                      <div>
                        <span className="text-gray-400">Class</span>
                        <p className="text-white font-medium">{(event as any).class}</p>
                      </div>
                      <div>
                        <span className="text-gray-400">Location</span>
                        <p className="text-white font-medium">{(event as any).location}</p>
                      </div>
                    </>
                  )}
                  
                  {event.type === 'CME' && (
                    <>
                      <div>
                        <span className="text-gray-400">Speed</span>
                        <p className="text-white font-medium">{(event as any).speed}</p>
                      </div>
                      <div>
                        <span className="text-gray-400">Direction</span>
                        <p className="text-white font-medium">{(event as any).direction}</p>
                      </div>
                    </>
                  )}
                  
                  {event.type === 'Geomagnetic Storm' && (
                    <>
                      <div>
                        <span className="text-gray-400">Level</span>
                        <p className="text-white font-medium">{(event as any).level}</p>
                      </div>
                      <div>
                        <span className="text-gray-400">Duration</span>
                        <p className="text-white font-medium">{(event as any).duration}</p>
                      </div>
                    </>
                  )}
                  
                  <div>
                    <span className="text-gray-400">Impact</span>
                    <p className="text-white font-medium">{event.impact}</p>
                  </div>
                </div>
              </div>
            );
          })}
      </div>

      {/* Solar Cycle Information */}
      <div className="bg-slate-800/50 rounded-lg p-6 border border-purple-500/20">
        <h3 className="text-xl font-bold text-white mb-4 flex items-center">
          <TrendingUp className="w-6 h-6 mr-2 text-purple-400" />
          Solar Cycle 25 Status
        </h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <p className="text-gray-400 mb-2">Current Phase</p>
            <p className="text-2xl font-bold text-white">Solar Maximum Approaching</p>
            <p className="text-purple-400 mt-1">Expected peak: 2024-2026</p>
          </div>
          
          <div>
            <p className="text-gray-400 mb-2">Sunspot Number</p>
            <p className="text-2xl font-bold text-white">142</p>
            <p className="text-green-400 mt-1">+15% from last month</p>
          </div>
        </div>
        
        <div className="mt-6">
          <div className="w-full bg-slate-700 rounded-full h-3">
            <div className="bg-gradient-to-r from-yellow-500 to-orange-500 h-3 rounded-full" style={{ width: '65%' }}></div>
          </div>
          <div className="flex justify-between text-sm text-gray-400 mt-2">
            <span>Solar Minimum</span>
            <span>Solar Maximum</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SpaceWeatherMonitor;
