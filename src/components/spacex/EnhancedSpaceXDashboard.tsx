import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Badge } from '../ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../ui/tabs';
import { Input } from '../ui/input';
import { Button } from '../ui/button';
import { useTheme } from '../../contexts/ThemeContext';
import {
  Rocket,
  Users,
  Ship as ShipIcon,
  Satellite,
  Calendar,
  MapPin,
  Clock,
  TrendingUp,
  Search,
  Filter,
  Star,
  CheckCircle,
  XCircle
} from 'lucide-react';

export const EnhancedSpaceXDashboard: React.FC = () => {
  const { theme } = useTheme();
  
  // Loading state
  const [isLoading, setIsLoading] = useState(true);

  // State for all SpaceX endpoints
  const [launches, setLaunches] = useState<any[]>([]);
  const [rockets, setRockets] = useState<any[]>([]);
  const [crew, setCrew] = useState<any[]>([]);
  const [capsules, setCapsules] = useState<any[]>([]);
  const [ships, setShips] = useState<any[]>([]);
  const [starlink, setStarlink] = useState<any[]>([]);
  const [historyEvents, setHistoryEvents] = useState<any[]>([]);
  const [company, setCompany] = useState<any>(null);
  const [cores, setCores] = useState<any[]>([]);
  const [dragons, setDragons] = useState<any[]>([]);
  const [landpads, setLandpads] = useState<any[]>([]);
  const [launchpads, setLaunchpads] = useState<any[]>([]);
  const [payloads, setPayloads] = useState<any[]>([]);
  const [roadster, setRoadster] = useState<any>(null);

  // Local search/filter
  const [searchTerm, setSearchTerm] = useState('');
  const [activeFilter, setActiveFilter] = useState('all');

  // Fetch all SpaceX data on mount
  useEffect(() => {
    const fetchAllData = async () => {
      try {
        const [
          launchesRes,
          rocketsRes,
          crewRes,
          capsulesRes,
          shipsRes,
          starlinkRes,
          historyRes,
          companyRes,
          coresRes,
          dragonsRes,
          landpadsRes,
          launchpadsRes,
          payloadsRes,
          roadsterRes
        ] = await Promise.all([
          fetch('https://api.spacexdata.com/v5/launches'),
          fetch('https://api.spacexdata.com/v4/rockets'),
          fetch('https://api.spacexdata.com/v4/crew'),
          fetch('https://api.spacexdata.com/v4/capsules'),
          fetch('https://api.spacexdata.com/v4/ships'),
          fetch('https://api.spacexdata.com/v4/starlink'),
          fetch('https://api.spacexdata.com/v4/history'),
          fetch('https://api.spacexdata.com/v4/company'),
          fetch('https://api.spacexdata.com/v4/cores'),
          fetch('https://api.spacexdata.com/v4/dragons'),
          fetch('https://api.spacexdata.com/v4/landpads'),
          fetch('https://api.spacexdata.com/v4/launchpads'),
          fetch('https://api.spacexdata.com/v4/payloads'),
          fetch('https://api.spacexdata.com/v4/roadster')
        ]);

        const launchesJson = await launchesRes.json();
        const rocketsJson = await rocketsRes.json();
        const crewJson = await crewRes.json();
        const capsulesJson = await capsulesRes.json();
        const shipsJson = await shipsRes.json();
        const starlinkJson = await starlinkRes.json();
        const historyJson = await historyRes.json();
        const companyJson = await companyRes.json();
        const coresJson = await coresRes.json();
        const dragonsJson = await dragonsRes.json();
        const landpadsJson = await landpadsRes.json();
        const launchpadsJson = await launchpadsRes.json();
        const payloadsJson = await payloadsRes.json();
        const roadsterJson = await roadsterRes.json();

        setLaunches(launchesJson);
        setRockets(rocketsJson);
        setCrew(crewJson);
        setCapsules(capsulesJson);
        setShips(shipsJson);
        setStarlink(starlinkJson);
        setHistoryEvents(historyJson);
        setCompany(companyJson);
        setCores(coresJson);
        setDragons(dragonsJson);
        setLandpads(landpadsJson);
        setLaunchpads(launchpadsJson);
        setPayloads(payloadsJson);
        setRoadster(roadsterJson);
      } catch (err) {
        console.error('Error fetching SpaceX data:', err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchAllData();
  }, []);

  // Show loader while fetching
  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  // Dashboard stats
  const stats = [
    {
      title: 'Total Launches',
      value: launches.length,
      icon: Rocket,
      color: 'text-blue-400',
      bgColor: 'bg-blue-500/10'
    },
    {
      title: 'Active Rockets',
      value: rockets.filter((r) => r.active).length,
      icon: Rocket,
      color: 'text-green-400',
      bgColor: 'bg-green-500/10'
    },
    {
      title: 'Crew Members',
      value: crew.length,
      icon: Users,
      color: 'text-purple-400',
      bgColor: 'bg-purple-500/10'
    },
    {
      title: 'Fleet Ships',
      value: ships.length,
      icon: ShipIcon,
      color: 'text-orange-400',
      bgColor: 'bg-orange-500/10'
    }
  ];

  // Utility to filter by a field (case insensitive)
  const filterBySearch = (items: any[], field: string) => {
    if (!searchTerm.trim()) return items;
    return items.filter((item) =>
      item[field]?.toString().toLowerCase().includes(searchTerm.toLowerCase())
    );
  };
  return (
    <div className="space-y-8 p-4">
      {/* Header */}
      <div className={`rounded-lg p-6 border theme-transition ${
        theme === 'dark' 
          ? 'bg-gradient-to-r from-blue-600/20 to-purple-600/20 border-blue-500/30' 
          : 'bg-gradient-to-r from-blue-500/10 to-purple-500/10 border-blue-400/30'
      }`}>
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between">
          <div className="mb-4 md:mb-0">
            <h1 className={`text-3xl font-bold mb-2 ${
              theme === 'dark' ? 'text-white' : 'text-gray-900'
            }`}>SpaceX Mission Control</h1>
            <p className={`${
              theme === 'dark' ? 'text-blue-200' : 'text-blue-700'
            }`}>Advancing the future of space exploration</p>          </div>
          {company && (
            <div className="text-right">
              <div className={`text-2xl font-bold ${
                theme === 'dark' ? 'text-green-400' : 'text-green-600'
              }`}>
                {company.valuation
                  ? `$${(company.valuation / 1_000_000_000).toFixed(1)}B`
                  : 'N/A'}              </div>
              <div className={`text-sm ${
                theme === 'dark' ? 'text-gray-400' : 'text-gray-600'
              }`}>Company Valuation</div>
            </div>
          )}
        </div>
      </div>

      {/* Stats Grid */}      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat, idx) => (
          <Card
            key={idx}
            className={`border transition-all duration-300 hover:scale-105 ${
              theme === 'dark' 
                ? 'bg-slate-800/50 border-slate-700 hover:bg-slate-800/70' 
                : 'theme-card hover:theme-card'
            }`}
          >
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <div className={`text-2xl font-bold ${
                    theme === 'dark' ? 'text-white' : 'theme-text-primary'
                  }`}>{stat.value}</div>
                  <div className={`text-sm ${
                    theme === 'dark' ? 'text-gray-400' : 'theme-text-secondary'
                  }`}>{stat.title}</div>
                </div>
                <div className={`p-3 rounded-full ${stat.bgColor}`}>
                  <stat.icon className={`w-6 h-6 ${stat.color}`} />
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>      {/* Search & Filter */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <Search className={`absolute left-3 top-3 w-4 h-4 ${
            theme === 'dark' ? 'text-gray-400' : 'text-gray-500'
          }`} />
          <Input
            placeholder="Search (e.g. names, types, serials...)"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className={`pl-10 transition-colors ${
              theme === 'dark' 
                ? 'bg-slate-800/50 border-slate-700 text-white placeholder-gray-400' 
                : 'theme-card theme-border theme-text-primary'
            }`}
          />
        </div>        <Button
          variant="outline"
          className={`transition-colors ${
            theme === 'dark' 
              ? 'border-slate-700 text-white hover:bg-slate-800' 
              : 'theme-nav-button'
          }`}
          onClick={() => {
            setActiveFilter(activeFilter === 'all' ? 'filtered' : 'all');
          }}
        >
          <Filter className="w-4 h-4 mr-2" />
          Filters
        </Button>
      </div>      {/* Tabs */}
      <Tabs defaultValue="launches" className="space-y-6">
        <TabsList className={`grid grid-cols-2 sm:grid-cols-4 md:grid-cols-7 lg:grid-cols-14 rounded-t-lg overflow-x-auto ${
          theme === 'dark' ? 'bg-slate-800/50' : 'theme-card'
        }`}>
          <TabsTrigger value="launches">Launches</TabsTrigger>
          <TabsTrigger value="rockets">Rockets</TabsTrigger>
          <TabsTrigger value="crew">Crew</TabsTrigger>
          <TabsTrigger value="capsules">Capsules</TabsTrigger>
          <TabsTrigger value="ships">Ships</TabsTrigger>
          <TabsTrigger value="starlink">Starlink</TabsTrigger>
          <TabsTrigger value="history">History</TabsTrigger>
          <TabsTrigger value="cores">Cores</TabsTrigger>
          <TabsTrigger value="dragons">Dragons</TabsTrigger>
          <TabsTrigger value="landpads">Landpads</TabsTrigger>
          <TabsTrigger value="launchpads">Launchpads</TabsTrigger>
          <TabsTrigger value="payloads">Payloads</TabsTrigger>
          <TabsTrigger value="roadster">Roadster</TabsTrigger>
          <TabsTrigger value="company">Company</TabsTrigger>
        </TabsList>        {/* --- Launches Tab --- */}
        <TabsContent value="launches" className={`p-4 rounded-b-lg ${
          theme === 'dark' ? 'bg-slate-800/20' : 'theme-card'
        }`}>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filterBySearch(launches, 'name')
              .slice(0, 12)
              .map((launch) => (
                <Card
                  key={launch.id}
                  className={`border transition-all duration-300 group ${
                    theme === 'dark' 
                      ? 'bg-slate-800/50 border-slate-700 hover:bg-slate-800/70' 
                      : 'theme-card hover:theme-card'
                  }`}
                >
                  <CardHeader className="pb-3">
                    <div className="flex items-center justify-between">
                      <CardTitle className={`text-lg group-hover:text-blue-400 transition-colors ${
                        theme === 'dark' ? 'text-white' : 'theme-text-primary'
                      }`}>
                        {launch.name}
                      </CardTitle>
                      <Badge
                        variant={launch.success ? 'default' : 'destructive'}
                        className="ml-2"
                      >
                        {launch.success ? (
                          <>
                            <CheckCircle className="w-3 h-3 mr-1" />
                            Success
                          </>
                        ) : (
                          <>
                            <XCircle className="w-3 h-3 mr-1" />
                            Failed
                          </>
                        )}
                      </Badge>
                    </div>
                  </CardHeader>                  <CardContent>
                    <div className="space-y-2 text-sm">
                      <div className={`flex items-center ${
                        theme === 'dark' ? 'text-gray-400' : 'theme-text-secondary'
                      }`}>
                        <Calendar className="w-4 h-4 mr-2" />
                        {new Date(launch.date_utc).toLocaleDateString()}
                      </div>
                      <div className={`flex items-center ${
                        theme === 'dark' ? 'text-gray-400' : 'theme-text-secondary'
                      }`}>
                        <Rocket className="w-4 h-4 mr-2" />
                        Flight #{launch.flight_number}                      </div>
                      {launch.details && (
                        <p className={`text-xs mt-2 line-clamp-2 ${
                          theme === 'dark' ? 'text-gray-300' : 'theme-text-secondary'
                        }`}>
                          {launch.details}
                        </p>
                      )}
                    </div>
                  </CardContent>
                </Card>
              ))}
          </div>
        </TabsContent>

        {/* --- Rockets Tab --- */}
        <TabsContent value="rockets" className="p-4 bg-slate-800/20 rounded-b-lg">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filterBySearch(rockets, 'name').map((rocket) => (
              <Card
                key={rocket.id}
                className="bg-slate-800/50 border-slate-700 hover:bg-slate-800/70 transition-all duration-300"
              >
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-white">{rocket.name}</CardTitle>
                    <Badge variant={rocket.active ? 'default' : 'secondary'}>
                      {rocket.active ? 'Active' : 'Inactive'}
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2 text-sm text-gray-300">
                    <div>
                      <span className="font-medium">Height:</span>{' '}
                      {rocket.height?.meters}m
                    </div>
                    <div>
                      <span className="font-medium">Mass:</span>{' '}
                      {rocket.mass?.kg?.toLocaleString()}kg
                    </div>
                    <div>
                      <span className="font-medium">Success Rate:</span>{' '}
                      {rocket.success_rate_pct}%
                    </div>
                    <div>
                      <span className="font-medium">Cost/Launch:</span> $
                      {rocket.cost_per_launch?.toLocaleString()}
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        {/* --- Crew Tab --- */}
        <TabsContent value="crew" className="p-4 bg-slate-800/20 rounded-b-lg">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {filterBySearch(crew, 'name').map((member) => (
              <Card
                key={member.id}
                className="bg-slate-800/50 border-slate-700 hover:bg-slate-800/70 transition-all duration-300"
              >
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-white">{member.name}</CardTitle>
                    <Badge variant={member.status === 'active' ? 'default' : 'secondary'}>
                      {member.status.charAt(0).toUpperCase() + member.status.slice(1)}
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2 text-sm text-gray-300">
                    <div className="flex items-center">
                      <Users className="w-4 h-4 mr-2 text-gray-400" />
                      {member.agency}
                    </div>
                    {member.image && (
                      <img
                        src={member.image}
                        alt={member.name}
                        className="w-full h-32 object-cover rounded-md mt-2"
                      />
                    )}
                    <div className="mt-2">
                      <a
                        href={member.wikipedia}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-xs text-blue-400 hover:underline"
                      >
                        Wikipedia
                      </a>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        {/* --- Capsules Tab --- */}
        <TabsContent value="capsules" className="p-4 bg-slate-800/20 rounded-b-lg">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {filterBySearch(capsules, 'serial').map((cap) => (
              <Card
                key={cap.id}
                className="bg-slate-800/50 border-slate-700 hover:bg-slate-800/70 transition-all duration-300"
              >
                <CardHeader>
                  <CardTitle className="text-white">Serial: {cap.serial}</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2 text-sm text-gray-300">
                    <div>
                      <span className="font-medium">Status:</span>{' '}
                      {cap.status.charAt(0).toUpperCase() + cap.status.slice(1)}
                    </div>
                    <div>
                      <span className="font-medium">Type:</span> {cap.type}
                    </div>
                    <div>
                      <span className="font-medium">Landings:</span> {cap.landings}
                    </div>
                    {cap.details && (
                      <p className="text-xs mt-2 line-clamp-2">{cap.details}</p>
                    )}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        {/* --- Ships Tab --- */}
        <TabsContent value="ships" className="p-4 bg-slate-800/20 rounded-b-lg">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {filterBySearch(ships, 'name').map((ship) => (
              <Card
                key={ship.id}
                className="bg-slate-800/50 border-slate-700 hover:bg-slate-800/70 transition-all duration-300"
              >
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-white">{ship.name}</CardTitle>
                    <Badge variant={ship.active ? 'default' : 'secondary'}>
                      {ship.active ? 'Active' : 'Inactive'}
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2 text-sm text-gray-300">
                    <div>
                      <span className="font-medium">Type:</span> {ship.type || 'N/A'}
                    </div>
                    <div>
                      <span className="font-medium">Home Port:</span>{' '}
                      {ship.home_port || 'Unknown'}
                    </div>
                    <div>
                      <span className="font-medium">Roles:</span>{' '}
                      {ship.roles.length > 0 ? ship.roles.join(', ') : 'None'}
                    </div>
                    {ship.image && (
                      <img
                        src={ship.image}
                        alt={ship.name}
                        className="w-full h-32 object-cover rounded-md mt-2"
                      />
                    )}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        {/* --- Starlink Tab --- */}
        <TabsContent value="starlink" className="p-4 bg-slate-800/20 rounded-b-lg">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {filterBySearch(starlink, 'id').map((sat) => (
              <Card
                key={sat.id}
                className="bg-slate-800/50 border-slate-700 hover:bg-slate-800/70 transition-all duration-300"
              >
                <CardHeader>
                  <CardTitle className="text-white">Satellite: {sat.id}</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2 text-sm text-gray-300">
                    <div className="flex items-center">
                      <MapPin className="w-4 h-4 mr-2 text-gray-400" />
                      Lon: {sat.longitude?.toFixed(2)}, Lat: {sat.latitude?.toFixed(2)}
                    </div>
                    <div className="flex items-center">
                      <Clock className="w-4 h-4 mr-2 text-gray-400" />
                      Height: {sat.height_km?.toFixed(1)} km
                    </div>
                    <div className="flex items-center">
                      <TrendingUp className="w-4 h-4 mr-2 text-gray-400" />
                      Velocity: {sat.velocity_kms?.toFixed(2)} km/s
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        {/* --- History Tab --- */}
        <TabsContent value="history" className="p-4 bg-slate-800/20 rounded-b-lg">
          <div className="space-y-4">
            {filterBySearch(historyEvents, 'title').map((event, idx) => (
              <Card
                key={`${event.title}-${idx}`}
                className="bg-slate-800/50 border-slate-700 hover:bg-slate-800/70 transition-all duration-300"
              >
                <CardHeader>
                  <CardTitle className="text-white">{event.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2 text-sm text-gray-300">
                    <div className="flex items-center">
                      <Calendar className="w-4 h-4 mr-2 text-gray-400" />
                      {new Date(event.event_date_utc).toLocaleDateString()}
                    </div>
                    <p className="text-xs">{event.details}</p>
                    {event.links?.article && (
                      <a
                        href={event.links.article}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-xs text-blue-400 hover:underline"
                      >
                        Read More
                      </a>
                    )}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        {/* --- Cores Tab --- */}
        <TabsContent value="cores" className="p-4 bg-slate-800/20 rounded-b-lg">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {filterBySearch(cores, 'serial').map((core) => (
              <Card
                key={core.id}
                className="bg-slate-800/50 border-slate-700 hover:bg-slate-800/70 transition-all duration-300"
              >
                <CardHeader>
                  <CardTitle className="text-white">Serial: {core.serial}</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2 text-sm text-gray-300">
                    <div>
                      <span className="font-medium">Status:</span>{' '}
                      {core.status.charAt(0).toUpperCase() + core.status.slice(1)}
                    </div>
                    <div>
                      <span className="font-medium">Block:</span> {core.block}
                    </div>
                    <div>
                      <span className="font-medium">Reuses:</span> {core.reuse_count}
                    </div>
                    <div>
                      <span className="font-medium">RTLS Landings:</span>{' '}
                      {core.rtls_landings}
                    </div>
                    {core.last_update && (
                      <p className="text-xs mt-2 line-clamp-2">{core.last_update}</p>
                    )}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        {/* --- Dragons Tab --- */}
        <TabsContent value="dragons" className="p-4 bg-slate-800/20 rounded-b-lg">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {filterBySearch(dragons, 'name').map((dragon) => (
              <Card
                key={dragon.id}
                className="bg-slate-800/50 border-slate-700 hover:bg-slate-800/70 transition-all duration-300"
              >
                <CardHeader>
                  <CardTitle className="text-white">{dragon.name}</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2 text-sm text-gray-300">
                    <div className="flex items-center">
                      <Calendar className="w-4 h-4 mr-2 text-gray-400" />
                      First Flight: {new Date(dragon.first_flight).toLocaleDateString()}
                    </div>
                    <div>
                      <span className="font-medium">Type:</span> {dragon.type}
                    </div>
                    <div>
                      <span className="font-medium">Active:</span> {dragon.active ? 'Yes' : 'No'}
                    </div>
                    {dragon.description && (
                      <p className="text-xs mt-2 line-clamp-3">{dragon.description}</p>
                    )}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        {/* --- Landpads Tab --- */}
        <TabsContent value="landpads" className="p-4 bg-slate-800/20 rounded-b-lg">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {filterBySearch(landpads, 'name').map((pad) => (
              <Card
                key={pad.id}
                className="bg-slate-800/50 border-slate-700 hover:bg-slate-800/70 transition-all duration-300"
              >
                <CardHeader>
                  <CardTitle className="text-white">{pad.full_name}</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2 text-sm text-gray-300">
                    <div>
                      <span className="font-medium">Status:</span>{' '}
                      {pad.status.charAt(0).toUpperCase() + pad.status.slice(1)}
                    </div>
                    <div>
                      <span className="font-medium">Type:</span> {pad.type}
                    </div>
                    <div className="flex items-center">
                      <MapPin className="w-4 h-4 mr-2 text-gray-400" />
                      {pad.locality}, {pad.region}
                    </div>
                    <div>
                      <span className="font-medium">Attempts:</span> {pad.landing_attempts}
                    </div>
                    <div>
                      <span className="font-medium">Successes:</span> {pad.landing_successes}
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        {/* --- Launchpads Tab --- */}
        <TabsContent value="launchpads" className="p-4 bg-slate-800/20 rounded-b-lg">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {filterBySearch(launchpads, 'name').map((pad) => (
              <Card
                key={pad.id}
                className="bg-slate-800/50 border-slate-700 hover:bg-slate-800/70 transition-all duration-300"
              >
                <CardHeader>
                  <CardTitle className="text-white">{pad.name}</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2 text-sm text-gray-300">
                    <div>
                      <span className="font-medium">Full Name:</span> {pad.full_name}
                    </div>
                    <div>
                      <span className="font-medium">Status:</span>{' '}
                      {pad.status.charAt(0).toUpperCase() + pad.status.slice(1)}
                    </div>
                    <div>
                      <span className="font-medium">Locality:</span> {pad.locality}
                    </div>
                    <div>
                      <span className="font-medium">Region:</span> {pad.region}
                    </div>
                    {pad.details && (
                      <p className="text-xs mt-2 line-clamp-2">{pad.details}</p>
                    )}
                    <div>
                      <span className="font-medium">Launch Attempts:</span> {pad.launch_attempts}
                    </div>
                    <div>
                      <span className="font-medium">Launch Successes:</span> {pad.launch_successes}
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        {/* --- Payloads Tab --- */}
        <TabsContent value="payloads" className="p-4 bg-slate-800/20 rounded-b-lg">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {filterBySearch(payloads, 'name').map((payload) => (
              <Card
                key={payload.id}
                className="bg-slate-800/50 border-slate-700 hover:bg-slate-800/70 transition-all duration-300"
              >
                <CardHeader>
                  <CardTitle className="text-white">{payload.name}</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2 text-sm text-gray-300">
                    <div>
                      <span className="font-medium">Type:</span> {payload.type}
                    </div>
                    <div>
                      <span className="font-medium">Orbit:</span> {payload.orbit}
                    </div>
                    <div>
                      <span className="font-medium">Mass (kg):</span> {payload.mass_kg || 'N/A'}
                    </div>
                    <div>
                      <span className="font-medium">Mass (lb):</span> {payload.mass_lbs || 'N/A'}
                    </div>
                    {Array.isArray(payload.customers) && payload.customers.length > 0 && (
                      <div>
                        <span className="font-medium">Customers:</span>{' '}
                        {payload.customers.join(', ')}
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        {/* --- Roadster Tab --- */}
        <TabsContent value="roadster" className="p-4 bg-slate-800/20 rounded-b-lg">
          {roadster ? (
            <Card className="bg-slate-800/50 border-slate-700 hover:bg-slate-800/70 transition-all duration-300 mx-auto max-w-2xl">
              <CardHeader>
                <CardTitle className="text-white">{roadster.name}</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2 text-sm text-gray-300">
                  <div className="flex items-center">
                    <Calendar className="w-4 h-4 mr-2 text-gray-400" />
                    Launched: {new Date(roadster.launch_date_utc).toLocaleDateString()}
                  </div>
                  <div>
                    <span className="font-medium">NORAD ID:</span> {roadster.norad_id}
                  </div>
                  <div className="flex items-center">
                    <Clock className="w-4 h-4 mr-2 text-gray-400" />
                    Speed: {roadster.speed_kph?.toLocaleString()} kph /{' '}
                    {roadster.speed_mph?.toLocaleString()} mph
                  </div>
                  <div className="flex items-center">
                    <MapPin className="w-4 h-4 mr-2 text-gray-400" />
                    Distance from Earth: {roadster.earth_distance_km?.toLocaleString()} km /{' '}
                    {roadster.earth_distance_mi?.toLocaleString()} mi
                  </div>
                  <div className="flex items-center">
                    <MapPin className="w-4 h-4 mr-2 text-gray-400" />
                    Distance from Mars: {roadster.mars_distance_km?.toLocaleString()} km /{' '}
                    {roadster.mars_distance_mi?.toLocaleString()} mi
                  </div>
                  {roadster.wikipedia && (
                    <a
                      href={roadster.wikipedia}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-xs text-blue-400 hover:underline"
                    >
                      Wikipedia
                    </a>
                  )}
                  {roadster.details && (
                    <p className="text-xs mt-2 line-clamp-3">{roadster.details}</p>
                  )}
                </div>
              </CardContent>
            </Card>
          ) : (
            <div className="text-gray-400 text-center">No Roadster data available.</div>
          )}
        </TabsContent>

        {/* --- Company Tab --- */}
        <TabsContent value="company" className="p-4 bg-slate-800/20 rounded-b-lg">
          {company ? (
            <Card className="bg-slate-800/50 border-slate-700 hover:bg-slate-800/70 transition-all duration-300 mx-auto max-w-2xl">
              <CardHeader>
                <CardTitle className="text-white">{company.name}</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2 text-sm text-gray-300">
                  <div>
                    <span className="font-medium">Founder:</span> {company.founder}
                  </div>
                  <div>
                    <span className="font-medium">Founded:</span> {company.founded}
                  </div>
                  <div>
                    <span className="font-medium">Employees:</span> {company.employees}
                  </div>
                  <div>
                    <span className="font-medium">Vehicles:</span> {company.vehicles}
                  </div>
                  <div>
                    <span className="font-medium">Launch Sites:</span> {company.launch_sites}
                  </div>
                  <div>
                    <span className="font-medium">Test Sites:</span> {company.test_sites}
                  </div>
                  <div>
                    <span className="font-medium">CEO:</span> {company.ceo}
                  </div>
                  <div>
                    <span className="font-medium">CTO:</span> {company.cto}
                  </div>
                  <div>
                    <span className="font-medium">COO:</span> {company.coo}
                  </div>
                  {company.summary && (
                    <p className="text-xs mt-2">{company.summary}</p>
                  )}
                  <div className="flex space-x-4 mt-2">
                    {company.links.website && (
                      <a
                        href={company.links.website}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-xs text-blue-400 hover:underline"
                      >
                        Website
                      </a>
                    )}
                    {company.links.flickr && (
                      <a
                        href={company.links.flickr}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-xs text-blue-400 hover:underline"
                      >
                        Flickr
                      </a>
                    )}
                    {company.links.twitter && (
                      <a
                        href={company.links.twitter}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-xs text-blue-400 hover:underline"
                      >
                        Twitter
                      </a>
                    )}
                    {company.links.elon_twitter && (
                      <a
                        href={company.links.elon_twitter}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-xs text-blue-400 hover:underline"
                      >
                        Elon Musk
                      </a>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          ) : (
            <div className="text-gray-400 text-center">No Company data available.</div>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
};
