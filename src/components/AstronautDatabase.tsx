import React, { useState, useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Input } from './ui/input';
import { Badge } from './ui/badge';
import { useTheme } from '../contexts/ThemeContext';
import { Users, Search, Rocket, Satellite } from 'lucide-react';

// Import JSON data (assuming files are in the same directory)
import astData from './launchlib/ast.json';
import spacoData from './launchlib/spaco.json';
import spastData from './launchlib/spast.json';

// Interface definitions
interface Astronaut {
  id: number;
  name: string;
  status: { name: string };
  agency: { name: string };
  bio: string;
  date_of_birth: string;
  flights_count: number;
  spacewalks_count: number;
  nationality: Array<{ nationality_name: string }>;
  in_space: boolean;
  image: { image_url: string };
}

interface Spacecraft {
  id: number;
  name: string;
  type: { name: string };
  agency: { name: string };
  in_use: boolean;
  image: { image_url: string };
}

interface SpaceStation {
  id: number;
  name: string;
  status: { name: string };
  founded: string;
  orbit: string;
  description: string;
  image: { image_url: string };
  owners: Array<{ name: string }>;
}

const SpaceDatabase: React.FC = () => {
  const { theme } = useTheme();
  const [activeTab, setActiveTab] = useState<'astronauts' | 'spacecraft' | 'stations'>('astronauts');
  const [searchTerm, setSearchTerm] = useState('');

  // Transform JSON data
  const astronauts: Astronaut[] = useMemo(() => {
    return astData.results.map((astronaut: any) => ({
      id: astronaut.id,
      name: astronaut.name,
      status: astronaut.status,
      agency: astronaut.agency,
      bio: astronaut.bio || 'No biography available',
      date_of_birth: astronaut.date_of_birth,
      flights_count: astronaut.flights_count || 0,
      spacewalks_count: astronaut.spacewalks_count || 0,
      nationality: astronaut.nationality || [],
      in_space: astronaut.in_space || false,
      image: astronaut.image || { image_url: '' }
    }));
  }, []);

  const spacecrafts: Spacecraft[] = useMemo(() => {
    return spacoData.results.map((craft: any) => ({
      id: craft.id,
      name: craft.name,
      type: craft.type,
      agency: craft.agency,
      in_use: craft.in_use,
      image: craft.image || { image_url: '' }
    }));
  }, []);

  const stations: SpaceStation[] = useMemo(() => {
    return spastData.results.map((station: any) => ({
      id: station.id,
      name: station.name,
      status: station.status,
      founded: station.founded,
      orbit: station.orbit,
      description: station.description,
      image: station.image || { image_url: '' },
      owners: station.owners || []
    }));
  }, []);

  // Filter functions
  const filteredAstronauts = useMemo(() => {
    return astronauts.filter(astronaut => 
      astronaut.name.toLowerCase().includes(searchTerm.toLowerCase()))
  }, [searchTerm, astronauts]);

  const filteredSpacecrafts = useMemo(() => {
    return spacecrafts.filter(craft => 
      craft.name.toLowerCase().includes(searchTerm.toLowerCase()))
  }, [searchTerm, spacecrafts]);

  const filteredStations = useMemo(() => {
    return stations.filter(station => 
      station.name.toLowerCase().includes(searchTerm.toLowerCase()))
  }, [searchTerm, stations]);

  // Calculate age from date of birth
  const calculateAge = (dob: string) => {
    if (!dob) return 'Unknown';
    const birthDate = new Date(dob);
    const today = new Date();
    let age = today.getFullYear() - birthDate.getFullYear();
    const m = today.getMonth() - birthDate.getMonth();
    if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) {
      age--;
    }
    return age;
  };

  // Get current data based on active tab
  const currentData = useMemo(() => {
    switch (activeTab) {
      case 'astronauts': return filteredAstronauts;
      case 'spacecraft': return filteredSpacecrafts;
      case 'stations': return filteredStations;
      default: return [];
    }
  }, [activeTab, filteredAstronauts, filteredSpacecrafts, filteredStations]);

  // Get placeholder text based on active tab
  const getPlaceholder = () => {
    switch (activeTab) {
      case 'astronauts': return 'Search astronauts...';
      case 'spacecraft': return 'Search spacecraft...';
      case 'stations': return 'Search space stations...';
      default: return 'Search...';
    }
  };

  // Get badge text based on active tab
  const getBadgeText = () => {
    switch (activeTab) {
      case 'astronauts': return 'Astronaut';
      case 'spacecraft': return 'Spacecraft';
      case 'stations': return 'Space Station';
      default: return '';
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-gradient-to-r from-orange-600/20 to-red-600/20 rounded-lg p-6 border border-orange-500/30">
        <div className="flex items-center gap-3 mb-4">
          <Users className="w-8 h-8 text-orange-400" />
          <div>
            <h1 className="text-2xl font-bold text-white">Space Exploration Database</h1>
            <p className="text-orange-200">Astronauts, Spacecraft, and Space Stations</p>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex border-b border-slate-700">
        <button
          className={`px-4 py-2 font-medium flex items-center gap-2 ${
            activeTab === 'astronauts' 
              ? 'text-orange-400 border-b-2 border-orange-400' 
              : 'text-slate-400 hover:text-slate-200'
          }`}
          onClick={() => setActiveTab('astronauts')}
        >
          <Users size={16} />
          Astronauts ({astronauts.length})
        </button>
        
        <button
          className={`px-4 py-2 font-medium flex items-center gap-2 ${
            activeTab === 'spacecraft' 
              ? 'text-orange-400 border-b-2 border-orange-400' 
              : 'text-slate-400 hover:text-slate-200'
          }`}
          onClick={() => setActiveTab('spacecraft')}
        >
          <Rocket size={16} />
          Spacecraft ({spacecrafts.length})
        </button>
        
        <button
          className={`px-4 py-2 font-medium flex items-center gap-2 ${
            activeTab === 'stations' 
              ? 'text-orange-400 border-b-2 border-orange-400' 
              : 'text-slate-400 hover:text-slate-200'
          }`}
          onClick={() => setActiveTab('stations')}
        >
          <Satellite size={16} />
          Stations ({stations.length})
        </button>
      </div>

      {/* Search */}
      <Card className="bg-slate-800/50 border-slate-700">
        <CardHeader>
          <CardTitle className="text-white flex items-center gap-2">
            <Search className="w-5 h-5" />
            {activeTab === 'astronauts' && 'Search Astronauts'}
            {activeTab === 'spacecraft' && 'Search Spacecraft'}
            {activeTab === 'stations' && 'Search Space Stations'}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Input
            placeholder={getPlaceholder()}
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="bg-slate-700 border-slate-600 text-white"
          />
        </CardContent>
      </Card>

      {/* Data Grid - Improved layout for better image display */}
      <div className="grid grid-cols-1 gap-6">
        {currentData.length > 0 ? (
          currentData.map((item) => (
            <Card
              key={item.id}
              className="bg-slate-800/50 border-slate-700 hover:bg-slate-800/70 transition-all duration-300 flex flex-col lg:flex-row h-full"
            >
              {/* Image Container - Improved responsiveness and aspect ratio */}
              <div className="lg:w-1/2 relative flex items-center justify-center">
                {item.image?.image_url ? (
                  <div className="w-full h-full min-h-[250px] lg:max-h-[400px] relative">
                    <img 
                      src={item.image.image_url} 
                      alt={item.name} 
                      className="w-full h-full object-cover object-center rounded-t-lg lg:rounded-l-lg lg:rounded-tr-none"
                      onError={(e) => {
                        const target = e.target as HTMLImageElement;
                        // Instead of hiding, replace with placeholder
                        target.src = '/placeholder.svg';
                        target.classList.add('p-8', 'opacity-70');
                      }}
                      loading="lazy"
                    />
                    {/* Image expand button for detailed view */}
                    <button
                      onClick={() => window.open(item.image?.image_url, '_blank')}
                      className="absolute bottom-2 right-2 bg-black/70 hover:bg-black/90 text-white rounded-full p-2 transition-opacity opacity-80 hover:opacity-100"
                      title="View full image"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0zM10 7v3m0 0v3m0-3h3m-3 0H7" />
                      </svg>
                    </button>
                  </div>
                ) : (
                  <div className="w-full min-h-[200px] bg-slate-700/50 flex items-center justify-center rounded-t-lg lg:rounded-l-lg lg:rounded-tr-none">
                    <svg className="h-16 w-16 text-slate-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                  </div>
                )}
              </div>
              
              {/* Content Container */}
              <div className="lg:w-1/2 flex flex-col">
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-white text-xl">{item.name}</CardTitle>
                    <Badge 
                      variant={
                        activeTab === 'astronauts' 
                          ? (item as Astronaut).status.name === 'Active' 
                            ? 'default' 
                            : 'secondary'
                          : activeTab === 'spacecraft'
                            ? (item as Spacecraft).in_use
                              ? 'default'
                              : 'secondary'
                            : (item as SpaceStation).status.name === 'Active'
                              ? 'default'
                              : 'secondary'
                      }
                      className="capitalize"
                    >
                      {activeTab === 'astronauts' 
                        ? (item as Astronaut).status.name
                        : activeTab === 'spacecraft'
                          ? (item as Spacecraft).in_use ? 'In Use' : 'Retired'
                          : (item as SpaceStation).status.name}
                    </Badge>
                  </div>
                </CardHeader>
                
                <CardContent className="flex-grow">
                  <div className="space-y-3">
                    {/* Astronaut-specific info */}
                    {activeTab === 'astronauts' && (
                      <>
                        <div className="flex flex-wrap items-center gap-1">
                          <span className="text-gray-400 font-semibold">Agency:</span>
                          <span className="text-white">{(item as Astronaut).agency.name}</span>
                        </div>
                        
                        <div className="flex flex-wrap items-center gap-1">
                          <span className="text-gray-400 font-semibold">Age:</span>
                          <span className="text-white">{calculateAge((item as Astronaut).date_of_birth)}</span>
                          <span className="text-gray-400 mx-1">•</span>
                          <span className="text-gray-400 font-semibold">Flights:</span>
                          <span className="text-white">{(item as Astronaut).flights_count}</span>
                          <span className="text-gray-400 mx-1">•</span>
                          <span className="text-gray-400 font-semibold">Spacewalks:</span>
                          <span className="text-white">{(item as Astronaut).spacewalks_count}</span>
                        </div>
                        
                        {(item as Astronaut).nationality.length > 0 && (
                          <div className="flex flex-wrap items-center gap-1">
                            <span className="text-gray-400 font-semibold">Nationality:</span>
                            <span className="text-white">{(item as Astronaut).nationality[0].nationality_name}</span>
                          </div>
                        )}
                        
                        <div className="pt-2">
                          <p className="text-gray-300">{(item as Astronaut).bio}</p>
                        </div>
                      </>
                    )}
                    
                    {/* Spacecraft-specific info */}
                    {activeTab === 'spacecraft' && (
                      <>
                        <div className="flex flex-wrap items-center gap-1">
                          <span className="text-gray-400 font-semibold">Type:</span>
                          <span className="text-white">{(item as Spacecraft).type.name}</span>
                        </div>
                        
                        <div className="flex flex-wrap items-center gap-1">
                          <span className="text-gray-400 font-semibold">Agency:</span>
                          <span className="text-white">{(item as Spacecraft).agency.name}</span>
                        </div>
                        
                        <div className="flex flex-wrap items-center gap-1">
                          <span className="text-gray-400 font-semibold">Status:</span>
                          <span className="text-white">
                            {(item as Spacecraft).in_use ? 'Operational' : 'Retired'}
                          </span>
                        </div>
                      </>
                    )}
                    
                    {/* Space Station-specific info */}
                    {activeTab === 'stations' && (
                      <>
                        <div className="flex flex-wrap items-center gap-1">
                          <span className="text-gray-400 font-semibold">Orbit:</span>
                          <span className="text-white">{(item as SpaceStation).orbit}</span>
                        </div>
                        
                        <div className="flex flex-wrap items-center gap-1">
                          <span className="text-gray-400 font-semibold">Founded:</span>
                          <span className="text-white">{(item as SpaceStation).founded}</span>
                        </div>
                        
                        {(item as SpaceStation).owners.length > 0 && (
                          <div className="flex flex-wrap items-center gap-1">
                            <span className="text-gray-400 font-semibold">Owners:</span>
                            <span className="text-white">
                              {(item as SpaceStation).owners.map(o => o.name).join(', ')}
                            </span>
                          </div>
                        )}
                        
                        <div className="pt-2">
                          <p className="text-gray-300">{(item as SpaceStation).description}</p>
                        </div>
                      </>
                    )}
                  </div>
                </CardContent>
              </div>
            </Card>
          ))
        ) : (
          <div className="col-span-1 text-center py-8 text-gray-400">
            No {getBadgeText().toLowerCase()}s found matching your search.
          </div>
        )}
      </div>
    </div>
  );
};

export default SpaceDatabase;