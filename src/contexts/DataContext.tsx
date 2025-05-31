import React, { createContext, useContext, useEffect, useState } from 'react';
import { useQuery } from '@tanstack/react-query';

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
  allDataLoaded: boolean;
}

const DataContext = createContext<DataContextType>({} as DataContextType);

export const useSpaceData = () => useContext(DataContext);

export const DataProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [allDataLoaded, setAllDataLoaded] = useState(false);

  // SpaceX Data - All Endpoints
  const { data: spaceXLaunches } = useQuery({
    queryKey: ['spacex-launches'],
    queryFn: () => fetch('https://api.spacexdata.com/v4/launches').then(res => res.json()),
    staleTime: 5 * 60 * 1000, // 5 minutes
  });

  const { data: spaceXRockets } = useQuery({
    queryKey: ['spacex-rockets'],
    queryFn: () => fetch('https://api.spacexdata.com/v4/rockets').then(res => res.json()),
  });

  const { data: spaceXCrew } = useQuery({
    queryKey: ['spacex-crew'],
    queryFn: () => fetch('https://api.spacexdata.com/v4/crew').then(res => res.json()),
  });

  const { data: spaceXCapsules } = useQuery({
    queryKey: ['spacex-capsules'],
    queryFn: () => fetch('https://api.spacexdata.com/v4/capsules').then(res => res.json()),
  });

  const { data: spaceXCompany } = useQuery({
    queryKey: ['spacex-company'],
    queryFn: () => fetch('https://api.spacexdata.com/v4/company').then(res => res.json()),
  });

  const { data: spaceXCores } = useQuery({
    queryKey: ['spacex-cores'],
    queryFn: () => fetch('https://api.spacexdata.com/v4/cores').then(res => res.json()),
  });

  const { data: spaceXDragons } = useQuery({
    queryKey: ['spacex-dragons'],
    queryFn: () => fetch('https://api.spacexdata.com/v4/dragons').then(res => res.json()),
  });

  const { data: spaceXHistory } = useQuery({
    queryKey: ['spacex-history'],
    queryFn: () => fetch('https://api.spacexdata.com/v4/history').then(res => res.json()),
  });

  const { data: spaceXLandpads } = useQuery({
    queryKey: ['spacex-landpads'],
    queryFn: () => fetch('https://api.spacexdata.com/v4/landpads').then(res => res.json()),
  });

  const { data: spaceXLaunchpads } = useQuery({
    queryKey: ['spacex-launchpads'],
    queryFn: () => fetch('https://api.spacexdata.com/v4/launchpads').then(res => res.json()),
  });

  const { data: spaceXPayloads } = useQuery({
    queryKey: ['spacex-payloads'],
    queryFn: () => fetch('https://api.spacexdata.com/v4/payloads').then(res => res.json()),
  });

  const { data: spaceXRoadster } = useQuery({
    queryKey: ['spacex-roadster'],
    queryFn: () => fetch('https://api.spacexdata.com/v4/roadster').then(res => res.json()),
  });

  const { data: spaceXShips } = useQuery({
    queryKey: ['spacex-ships'],
    queryFn: () => fetch('https://api.spacexdata.com/v4/ships').then(res => res.json()),
  });

  const { data: spaceXStarlink } = useQuery({
    queryKey: ['spacex-starlink'],
    queryFn: () => fetch('https://api.spacexdata.com/v4/starlink').then(res => res.json()),
  });

  // Solar System Data
  const { data: solarSystemBodies } = useQuery({
    queryKey: ['solar-system-bodies'],
    queryFn: () => fetch('https://api.le-systeme-solaire.net/rest/bodies').then(res => res.json()),
  });

  // ISS Data
  const { data: issPosition } = useQuery({
    queryKey: ['iss-position'],
    queryFn: () => fetch('https://api.wheretheiss.at/v1/satellites/25544').then(res => res.json()),
    refetchInterval: 5000, // Update every 5 seconds
  });

  const { data: issTle } = useQuery({
    queryKey: ['iss-tle'],
    queryFn: () => fetch('https://api.wheretheiss.at/v1/satellites/25544/tles').then(res => res.json()),
  });

  // TLE Satellite Data
  const { data: tleCollection } = useQuery({
    queryKey: ['tle-collection'],
    queryFn: () => fetch('https://tle.ivanstanojevic.me/api/tle').then(res => res.json()),
  });

  // Launch Library Data
  const { data: launchLibraryLaunches } = useQuery({
    queryKey: ['launch-library-launches'],
    queryFn: () => fetch('https://ll.thespacedevs.com/2.3.0/launches/').then(res => res.json()),
  });

  const { data: launchLibraryEvents } = useQuery({
    queryKey: ['launch-library-events'],
    queryFn: () => fetch('https://ll.thespacedevs.com/2.3.0/events/').then(res => res.json()),
  });

  const { data: launchLibraryAgencies } = useQuery({
    queryKey: ['launch-library-agencies'],
    queryFn: () => fetch('https://ll.thespacedevs.com/2.3.0/agencies/').then(res => res.json()),
  });

  const { data: launchLibraryAstronauts } = useQuery({
    queryKey: ['launch-library-astronauts'],
    queryFn: () => fetch('https://ll.thespacedevs.com/2.3.0/astronauts/').then(res => res.json()),
  });

  const { data: launchLibraryStations } = useQuery({
    queryKey: ['launch-library-stations'],
    queryFn: () => fetch('https://ll.thespacedevs.com/2.3.0/space_stations/').then(res => res.json()),
  });

  const { data: launchLibraryExpeditions } = useQuery({
    queryKey: ['launch-library-expeditions'],
    queryFn: () => fetch('https://ll.thespacedevs.com/2.3.0/expeditions/').then(res => res.json()),
  });

  // Exoplanet Data
  const { data: exoplanetData } = useQuery({
    queryKey: ['exoplanet-data'],
    queryFn: async () => {
      const response = await fetch('https://raw.githubusercontent.com/OpenExoplanetCatalogue/open_exoplanet_catalogue/master/systems.xml');
      const xmlText = await response.text();
      return xmlText;
    },
  });

  // People in Space API
  const { data: spacePopulation } = useQuery({
    queryKey: ['space-population'],
    queryFn: () => fetch('http://api.open-notify.org/astros.json').then(res => res.json()),
    refetchInterval: 60000, // Update every minute
  });

  // Spaceflight News API
  const { data: newsData } = useQuery({
    queryKey: ['spaceflight-news'],
    queryFn: () => fetch('https://api.spaceflightnewsapi.net/v4/articles/').then(res => res.json()),
  });

  // Copernicus Earth Observation API
  const { data: earthObservationData } = useQuery({
    queryKey: ['earth-observation'],
    queryFn: () => fetch('https://catalogue.dataspace.copernicus.eu/resto/api/collections/search.json?maxRecords=20').then(res => res.json()),
  });

  // NASA Meteorite Landings API
  const { data: meteoriteData } = useQuery({
    queryKey: ['meteorite-data'],
    queryFn: () => fetch('https://data-nasa-bucket-production.s3.us-east-1.amazonaws.com/legacy/meteorite_landings/Meteorite_Landings.json?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZJ34W7PDNZ6ZML5S%2F20250531%2Fus-east-1%2Fs3%2Faws4_request&X-Amz-Date=20250531T141950Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEPb%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FwEaCXVzLWVhc3QtMSJGMEQCIAybrzxNfuJysHpxM3YLwOwYUvaX3tFreCH97ZsIAbH3AiASwn0T4DprorKE1pUpcoWfDfUE0q5HbFAUd0yFWaP4SiqdBQi%2F%2F%2F%2F%2F%2F%2F%2F%2F%2F%2F8BEAAaDDYzOTY3NDgwOTI4NiIMSyV5rzdjEtb4HokCKvEEVs7xzbc4E7bRa2nhPer8sFMNcmPzDBQy15OAJ2r1K85jAwkQfdxzYCtZgp7K%2BwhJQ%2Ban3CJtx0gqIrVocb41UJX4Jf29I8h93PmL6ngt%2BCmtQyW5I8xdm0qh9622MgKzplVqD771zw0rDebZjCsvr5yMWCHv%2BjRc1UCknNriDuEk%2ByyYimQfN759t9DSGsdF2R5KSTRd69Nafj5Mlu5Lxa7bBn6fnTtJ2zenlWWzhKK9w%2B%2BraudFm3n%2Ft7poA7F6QvmQKE%2Fu3ETns7czGRmUhjUylomFmvW85uMVT4xdd19TvDOZiy7tTdoX0rDZBD4g8EolsUS4AtSyLLsZBFdT0WTwozPQboYgndAoOgbsmge3ywHmoO1DwzSanSzvhjrOeSNXSP%2FtR9dZyPks8mmK395IAW4%2FIaRwGFokkc8lUBnXuLiQfAsrNiJlW3DNiALHiXt59UtSqzZaifQod9IjLIxoI5BFR3ceEUNDnZq5tTLQMt2dfrJo7CY8zmTid5dX4dER2g%2B5YCYg6Vvi%2B%2FDx0drERcy6G87iePKVJgX9Cr%2BPSPPq1rXv2zh3OMQu%2FMSSEar03gGr9J08mar3Mw6G%2FRFQgRNQ3JFsEkhYVib%2B8z6j8kYVzzGt3XtW9gk2bZVRtKd8xEWoexSejTjJRfrRPW4XUnMSynVI7HWyDBkYHnfgMfchgINXh0yZxOngmMHnsK7wMjVJYPSlf%2Frz%2Bxi%2BOBX6CDaMn14tYlaVECK7wxngCAjESqM4OLSyXwkoBamuKExZ1S8Zn1NgW3skQpmTFN76RxpCmrJTbwszcFEfYZqIZlGpWZ2WhAsjY6xbOdm5YjDLjuzBBjqcAeWA2x5meB8LMrhLVsQFQD2BolaPWu8VAii7b49Ba8BeyRqUYb%2Bk8oM%2FJy2fNtqIzqx6%2FfyRJYZDljQ5u0BMoKytiUSFIU8SqlcZNoqpyA2vke44vMEYpbNPhC5F5ahGd17QstPcDhGTChXO%2F47uVkjPn5lF5l6OtQwNFMVg5pnFyo%2Fdd8dS2aaFF3rQZyQUZnMXXR4dZCXLvnaQfw%3D%3D&X-Amz-Signature=085557186d715258e228a3ac38827317aca2cefe156eaa86f251219ea7f69c4e&X-Amz-SignedHeaders=host&x-id=GetObject').then(res => res.json()),
  });

  // ... keep existing code (other API queries)

  const spaceXData = {
    launches: spaceXLaunches,
    rockets: spaceXRockets,
    crew: spaceXCrew,
    capsules: spaceXCapsules,
    company: spaceXCompany,
    cores: spaceXCores,
    dragons: spaceXDragons,
    history: spaceXHistory,
    landpads: spaceXLandpads,
    launchpads: spaceXLaunchpads,
    payloads: spaceXPayloads,
    roadster: spaceXRoadster,
    ships: spaceXShips,
    starlink: spaceXStarlink,
  };

  const solarSystemData = {
    bodies: solarSystemBodies,
  };

  const issData = {
    position: issPosition,
    tle: issTle,
  };

  const tleData = {
    collection: tleCollection,
  };

  const launchLibraryData = {
    launches: launchLibraryLaunches,
    events: launchLibraryEvents,
    agencies: launchLibraryAgencies,
    astronauts: launchLibraryAstronauts,
    stations: launchLibraryStations,
    expeditions: launchLibraryExpeditions,
  };

  const isLoading = !spaceXLaunches || !solarSystemBodies || !issPosition || !tleCollection || !launchLibraryLaunches;

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
      allDataLoaded
    }}>
      {children}
    </DataContext.Provider>
  );
};
