import React, { createContext, useContext, useEffect, useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { mockSpaceData, mockApiCall } from '../data/mock-space-data';

interface DataContextType {
  isLoading: boolean;
  spaceXData: any;
  solarSystemData: any;
  issData: any;
  tleData: any;
  launchLibraryData: any;
  exoplanetData: any;
  spacePopulation: any;
  newsData: any;
  earthObservationData: any;
  meteoriteData: any;
  missionsData: any;
  allDataLoaded: boolean;
}

const DataContext = createContext<DataContextType>({} as DataContextType);

export const useSpaceData = () => useContext(DataContext);

export const DataProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [allDataLoaded, setAllDataLoaded] = useState(false);

  // Mock SpaceX Data - Using realistic mock responses to avoid API errors
  const { data: spaceXLaunches, isLoading: spaceXLaunchesLoading } = useQuery({
    queryKey: ['spacex-launches'],
    queryFn: () => mockApiCall([
      {
        id: "1",
        name: "Starship IFT-4",
        date_utc: "2024-06-06T12:50:00.000Z",
        success: true,
        details: "Fourth integrated flight test of Starship and Super Heavy",
        rocket: "starship",
        payloads: ["starship-demo"]
      },
      {
        id: "2",
        name: "Falcon Heavy - Europa Clipper",
        date_utc: "2024-10-14T16:06:00.000Z",
        success: true,
        details: "Launch of NASA's Europa Clipper mission to Jupiter's moon Europa",
        rocket: "falcon-heavy",
        payloads: ["europa-clipper"]
      }
    ], 500),
    staleTime: 5 * 60 * 1000,
  });

  const { data: spaceXRockets, isLoading: spaceXRocketsLoading } = useQuery({
    queryKey: ['spacex-rockets'],
    queryFn: () => mockApiCall([
      {
        id: "falcon9",
        name: "Falcon 9",
        active: true,
        stages: 2,
        boosters: 0,
        cost_per_launch: 67000000,
        success_rate_pct: 98,
        first_flight: "2010-06-04",
        country: "United States",
        company: "SpaceX"
      },
      {
        id: "falconheavy",
        name: "Falcon Heavy",
        active: true,
        stages: 2,
        boosters: 2,
        cost_per_launch: 97000000,
        success_rate_pct: 100,
        first_flight: "2018-02-06",
        country: "United States",
        company: "SpaceX"
      }
    ], 300),
  });

  // Mock Solar System Data
  const { data: solarSystemBodies, isLoading: solarSystemLoading } = useQuery({
    queryKey: ['solar-system-bodies'],
    queryFn: () => mockApiCall([
      {
        id: "earth",
        name: "Earth",
        englishName: "Earth",
        isPlanet: true,
        mass: { massValue: 5.972, massExponent: 24 },
        vol: { volValue: 1.083, volExponent: 12 },
        density: 5.514,
        gravity: 9.8,
        discoveredBy: "",
        discoveryDate: "",
        alternativeName: "",
        axialTilt: 23.44,
        avgTemp: 288,
        mainAnomaly: 358.617,
        argPeriapsis: 114.20783,
        longAscNode: 348.73936
      },
      {
        id: "mars",
        name: "Mars",
        englishName: "Mars",
        isPlanet: true,
        mass: { massValue: 6.39, massExponent: 23 },
        vol: { volValue: 1.638, volExponent: 11 },
        density: 3.933,
        gravity: 3.71,
        discoveredBy: "",
        discoveryDate: "",
        alternativeName: "Red Planet",
        axialTilt: 25.19,
        avgTemp: 210,
        mainAnomaly: 19.412,
        argPeriapsis: 286.502,
        longAscNode: 49.558
      }
    ], 400),
  });

  // Mock ISS Data
  const { data: issPosition, isLoading: issLoading } = useQuery({
    queryKey: ['iss-position'],
    queryFn: () => mockApiCall({
      name: "iss",
      id: 25544,
      latitude: 51.6461,
      longitude: -0.0072,
      altitude: 408.05,
      velocity: 27600,
      visibility: "daylight",
      footprint: 4465.83,
      timestamp: Date.now() / 1000,
      daynum: 2459945.123456,
      solar_lat: -23.44,
      solar_lon: 280.123,
      units: "kilometers"
    }, 200),
    refetchInterval: 5000,
  });

  // Mock People in Space
  const { data: spacePopulation, isLoading: spacePopLoading } = useQuery({
    queryKey: ['space-population'],
    queryFn: () => mockApiCall(mockSpaceData.spacePopulation, 300),
    refetchInterval: 60000,
  });

  // Mock Space News
  const { data: newsData, isLoading: newsLoading } = useQuery({
    queryKey: ['spaceflight-news'],
    queryFn: () => mockApiCall(mockSpaceData.spaceNews, 600),
  });

  // Mock Exoplanet Data
  const { data: exoplanetData, isLoading: exoplanetLoading } = useQuery({
    queryKey: ['exoplanet-data'],
    queryFn: () => mockApiCall(mockSpaceData.exoplanets, 800),
  });

  // Mock Meteorite Data
  const { data: meteoriteData, isLoading: meteoriteLoading } = useQuery({
    queryKey: ['meteorite-data'],
    queryFn: () => mockApiCall(mockSpaceData.meteorites, 700),
  });

  // Mock Mission Data
  const { data: missionsData, isLoading: missionsLoading } = useQuery({
    queryKey: ['missions-data'],
    queryFn: () => mockApiCall(mockSpaceData.missions, 400),
  });

  // Mock Earth Observation Data
  const { data: earthObservationData, isLoading: earthObsLoading } = useQuery({
    queryKey: ['earth-observation'],
    queryFn: () => mockApiCall({
      collections: [
        {
          id: "sentinel-2",
          title: "Sentinel-2 MSI",
          description: "Multispectral Instrument (MSI) aboard Sentinel-2",
          keywords: ["sentinel", "msi", "multispectral"],
          license: "proprietary",
          providers: [{ name: "ESA", roles: ["producer"] }]
        }
      ]
    }, 500),
  });

  // Aggregate data structures
  const spaceXData = {
    launches: spaceXLaunches || [],
    rockets: spaceXRockets || [],
    crew: [],
    capsules: [],
    company: {
      name: "SpaceX",
      founder: "Elon Musk",
      founded: 2002,
      employees: 12000,
      vehicles: 4,
      launch_sites: 3,
      test_sites: 1,
      ceo: "Elon Musk",
      cto: "Elon Musk",
      coo: "Gwynne Shotwell",
      cto_propulsion: "Tom Mueller",
      valuation: 180000000000,
      headquarters: {
        address: "Rocket Road",
        city: "Hawthorne",
        state: "California"
      },
      summary: "SpaceX designs, manufactures and launches advanced rockets and spacecraft."
    },
    cores: [],
    dragons: [],
    history: [],
    landpads: [],
    launchpads: [],
    payloads: [],
    roadster: null,
    ships: [],
    starlink: [],
  };

  const solarSystemData = {
    bodies: solarSystemBodies || [],
  };

  const issData = {
    position: issPosition,
    tle: null,
  };

  const tleData = {
    collection: [],
  };

  const launchLibraryData = {
    launches: [],
    events: [],
    agencies: [],
    astronauts: [],
    stations: [],
    expeditions: [],
  };

  const isLoading = spaceXLaunchesLoading || spaceXRocketsLoading || solarSystemLoading || 
                   issLoading || spacePopLoading || newsLoading || exoplanetLoading || 
                   meteoriteLoading || missionsLoading || earthObsLoading;

  useEffect(() => {
    if (!isLoading) {
      setAllDataLoaded(true);
    }
  }, [isLoading]);

  return (
    <DataContext.Provider value={{
      isLoading,
      spaceXData,
      solarSystemData,
      issData,
      tleData,
      launchLibraryData,
      exoplanetData,
      spacePopulation,
      newsData,
      earthObservationData,
      meteoriteData,
      missionsData,
      allDataLoaded
    }}>
      {children}
    </DataContext.Provider>
  );
};
