export const API_LINKS = {
  // 1. Solar System OpenData API
  solarSystem: {
    base: 'https://api.le-systeme-solaire.net/rest',
    endpoints: {
      bodies: '/bodies',
      bodyById: '/bodies/{id}',
      earth: '/bodies/earth',
      mars: '/bodies/mars',
      moon: '/bodies/lune'
    }
  },

  // 2. Where the ISS At API
  iss: {
    base: 'https://api.wheretheiss.at/v1',
    endpoints: {
      position: '/satellites/25544',
      tle: '/satellites/25544/tles',
      coordinates: '/coordinates/{lat},{lon}',
      positions: '/satellites/25544/positions'
    },
    websocket: 'wss://wheretheiss.at/wss'
  },

  // 3. SpaceX API (v4 & v5)
  spacex: {
    v4: {
      base: 'https://api.spacexdata.com/v4',
      endpoints: {
        capsules: '/capsules',
        capsulesById: '/capsules/{id}',
        capsulesQuery: '/capsules/query',
        company: '/company',
        cores: '/cores',
        coresById: '/cores/{id}',
        coresQuery: '/cores/query',
        crew: '/crew',
        crewById: '/crew/{id}',
        crewQuery: '/crew/query',
        dragons: '/dragons',
        dragonsById: '/dragons/{id}',
        dragonsQuery: '/dragons/query',
        history: '/history',
        historyById: '/history/{id}',
        historyQuery: '/history/query',
        landpads: '/landpads',
        landpadsById: '/landpads/{id}',
        landpadsQuery: '/landpads/query',
        launches: '/launches',
        launchesById: '/launches/{id}',
        launchesQuery: '/launches/query',
        launchpads: '/launchpads',
        launchpadsById: '/launchpads/{id}',
        launchpadsQuery: '/launchpads/query',
        payloads: '/payloads',
        payloadsById: '/payloads/{id}',
        payloadsQuery: '/payloads/query',
        roadster: '/roadster',
        roadsterQuery: '/roadster/query',
        rockets: '/rockets',
        rocketsById: '/rockets/{id}',
        rocketsQuery: '/rockets/query',
        ships: '/ships',
        shipsById: '/ships/{id}',
        shipsQuery: '/ships/query',
        starlink: '/starlink',
        starlinkById: '/starlink/{id}',
        starlinkQuery: '/starlink/query'
      }
    },
    v5: {
      base: 'https://api.spacexdata.com/v5',
      endpoints: {
        launches: '/launches',
        launchesById: '/launches/{id}',
        launchesQuery: '/launches/query',
        launchesLatest: '/launches/latest',
        launchesUpcoming: '/launches/upcoming'
      }
    },
    websocket: 'wss://spacex-api.herokuapp.com/v3/websocket'
  },

  // 4. TLE API
  tle: {
    base: 'https://tle.ivanstanojevic.me/api',
    endpoints: {
      collection: '/tle',
      satellite: '/tle/{id}',
      propagate: '/tle/{id}/propagate'
    }
  },

  // 5. Launch Library 2 API
  launchLibrary: {
    base: 'https://ll.thespacedevs.com/2.3.0',
    endpoints: {
      launches: '/launches/',
      events: '/events/',
      agencies: '/agencies/',
      astronauts: '/astronauts/',
      spaceStations: '/space_stations/',
      expeditions: '/expeditions/',
      pads: '/pads/',
      locations: '/locations/',
      spacecraftConfigurations: '/spacecraft_configurations/',
      launchers: '/launchers/'
    }
  },

  // 6. Open Exoplanet Catalogue
  exoplanets: {
    xml: 'https://raw.githubusercontent.com/OpenExoplanetCatalogue/open_exoplanet_catalogue/master/systems.xml',
    gzipped: 'https://github.com/OpenExoplanetCatalogue/oec_gzip/raw/master/systems.xml.gz',
    repository: 'https://github.com/OpenExoplanetCatalogue/open_exoplanet_catalogue'
  },

  // 7. NASA Meteorite Landings API
  meteorite: {
    nasa: 'https://data.nasa.gov/resource/gh4g-9sfh.json',
    legacy: 'https://data-nasa-bucket-production.s3.us-east-1.amazonaws.com/legacy/meteorite_landings/Meteorite_Landings.json',
    attribution: 'http://visualizing.org/datasets/meteorite-landings'
  },

  // 8. ThreeSolar 3D Visualization
  threeSolar: {
    app: 'https://threesolar.netlify.app/',
    embed: 'https://threesolar.netlify.app/',
    repository: 'https://github.com/threejs/three.js'
  },

  // 9. NASA DONKI API (Space Weather)
  nasaDonki: {
    base: 'https://api.nasa.gov/DONKI/',
    endpoints: {
      solarFlares: '/FLR',
      coronalMassEjections: '/CME',
      geomagneticStorms: '/GST',
      interplanetaryShocks: '/IPS',
      magnetopauseCrossing: '/MPC',
      radiationBeltEnhancement: '/RBE',
      highSpeedStream: '/HSS'
    }
  },

  // 10. NASA EONET API (Natural Events)
  nasaEonet: {
    base: 'https://eonet.gsfc.nasa.gov/api/v3',
    endpoints: {
      events: '/events',
      categories: '/categories',
      layers: '/layers',
      sources: '/sources'
    }
  },

  // 11. Space-Track API
  spaceTrack: {
    base: 'https://www.space-track.org/basicspacedata/query',
    endpoints: {
      cdm: '/class/cdm',
      satcat: '/class/satcat',
      tle: '/class/tle_latest',
      gp: '/class/gp'
    }
  },

  // 12. Heavens-Above API
  heavensAbove: {
    base: 'https://www.heavens-above.com/api/',
    endpoints: {
      passes: '/passes',
      stars: '/stars',
      satellites: '/satellites',
      iss: '/iss'
    }
  },

  // 13. USGS Lunar API
  usgsLunar: {
    base: 'https://planetarynames.wr.usgs.gov/',
    endpoints: {
      search: '/search',
      categories: '/categories',
      features: '/features',
      nomenclature: '/nomenclature'
    }
  },

  // 14. NASA ADS (Astrophysics Data System)
  nasaAds: {
    base: 'https://api.adsabs.harvard.edu/',
    endpoints: {
      search: '/v1/search/query',
      metrics: '/v1/metrics',
      export: '/v1/export',
      libraries: '/v1/biblib'
    }
  },

  // 15. Minor Planet Center API
  minorPlanetCenter: {
    base: 'https://minorplanetcenter.net/web_service/',
    endpoints: {
      orbits: '/orbits',
      ephemeris: '/eph',
      observations: '/obs',
      designations: '/des'
    }
  },

  // 16. ISRO Spacecraft Operations Centre
  isro: {
    base: 'https://isro.vercel.app/api/',
    endpoints: {
      spacecrafts: '/spacecrafts',
      launches: '/launches',
      missions: '/missions',
      satellites: '/satellites'
    }
  },

  // 17. ESA Mars Express API
  esaMarsExpress: {
    base: 'https://api.esa.int/mars-express/',
    endpoints: {
      imagery: '/imagery',
      atmosphere: '/atmosphere',
      observations: '/observations',
      instruments: '/instruments'
    }
  },

  // 18. Copernicus Earth Observation API
  copernicus: {
    base: 'https://catalogue.dataspace.copernicus.eu/resto/api/collections',
    endpoints: {
      search: '/search.json',
      sentinel1: '/Sentinel1/search.json',
      sentinel2: '/Sentinel2/search.json',
      sentinel3: '/Sentinel3/search.json',
      sentinel5p: '/Sentinel5P/search.json',
      describe: '/describe.xml'
    },
    download: 'https://catalogue.dataspace.copernicus.eu/download/{id}'
  },

  // 19. People in Space API
  peopleInSpace: {
    url: 'http://api.open-notify.org/astros.json',
    backup: 'https://api.open-notify.org/astros.json'
  },

  // 20. Spaceflight News API
  spaceflightNews: {
    base: 'https://api.spaceflightnewsapi.net/v4',
    endpoints: {
      articles: '/articles/',
      blogs: '/blogs/',
      reports: '/reports/'
    }
  },

  // 21. X1 Config Simulator
  x1Simulator: {
    url: 'https://sa-mack.github.io/X1-config-simulator/',
    embed: 'https://sa-mack.github.io/X1-config-simulator/',
    repository: 'https://github.com/sa-mack/X1-config-simulator'
  },

  // Additional Space APIs and Tools
  additional: {
    // NOAA Space Weather
    noaaSpaceWeather: {
      base: 'https://services.swpc.noaa.gov/products/',
      endpoints: {
        solarWind: '/solar-wind/',
        geomagneticField: '/geomagnetic-field/',
        solarRadiation: '/solar-radiation/'
      }
    },

    // NASA Exoplanet Archive
    nasaExoplanetArchive: {
      base: 'https://exoplanetarchive.ipac.caltech.edu/cgi-bin/nstedAPI/',
      endpoints: {
        confirmed: '/nph-nstedAPI?table=exoplanets',
        composite: '/nph-nstedAPI?table=compositepars',
        kepler: '/nph-nstedAPI?table=cumulative'
      }
    },

    // Stellarium Web API
    stellarium: {
      base: 'https://stellarium-web.org/api/',
      endpoints: {
        objects: '/objects',
        location: '/location',
        time: '/time'
      }
    },

    // Three.js and D3.js Libraries
    visualization: {
      threejs: 'https://threejs.org/',
      d3js: 'https://d3js.org/',
      chartjs: 'https://www.chartjs.org/'
    },

    // Documentation and References
    documentation: {
      spacexDocs: 'https://github.com/r-spacex/SpaceX-API',
      launchLibraryDocs: 'https://launchlibrary.net/1.4/docs',
      nasaApiDocs: 'https://api.nasa.gov/',
      esaApiDocs: 'https://www.esa.int/Applications/Observing_the_Earth/Copernicus'
    },

    // Real-time WebSocket Endpoints
    websockets: {
      iss: 'wss://wheretheiss.at/wss',
      spacex: 'wss://spacex-api.herokuapp.com/v3/websocket'
    }
  }
};

// Sample endpoints for quick access
export const QUICK_ACCESS_ENDPOINTS = {
  issPosition: 'https://api.wheretheiss.at/v1/satellites/25544',
  spacexLatestLaunch: 'https://api.spacexdata.com/v5/launches/latest',
  solarSystemBodies: 'https://api.le-systeme-solaire.net/rest/bodies',
  exoplanets: 'https://raw.githubusercontent.com/OpenExoplanetCatalogue/open_exoplanet_catalogue/master/systems.xml',
  meteorites: 'https://data.nasa.gov/resource/gh4g-9sfh.json',
  peopleInSpace: 'http://api.open-notify.org/astros.json',
  spaceNews: 'https://api.spaceflightnewsapi.net/v4/articles/',
  earthObservation: 'https://catalogue.dataspace.copernicus.eu/resto/api/collections/search.json'
};

// Complete list of all URLs for reference
export const ALL_SPACE_URLS = [
  // Solar System API
  'https://api.le-systeme-solaire.net/rest',
  'https://api.le-systeme-solaire.net/rest/bodies',
  
  // ISS Tracking
  'https://api.wheretheiss.at/v1/satellites/25544',
  'https://api.wheretheiss.at/v1/satellites/25544/tles',
  'wss://wheretheiss.at/wss',
  
  // SpaceX API v4
  'https://api.spacexdata.com/v4/launches',
  'https://api.spacexdata.com/v4/rockets',
  'https://api.spacexdata.com/v4/crew',
  'https://api.spacexdata.com/v4/capsules',
  'https://api.spacexdata.com/v4/company',
  'https://api.spacexdata.com/v4/cores',
  'https://api.spacexdata.com/v4/dragons',
  'https://api.spacexdata.com/v4/history',
  'https://api.spacexdata.com/v4/landpads',
  'https://api.spacexdata.com/v4/launchpads',
  'https://api.spacexdata.com/v4/payloads',
  'https://api.spacexdata.com/v4/roadster',
  'https://api.spacexdata.com/v4/ships',
  'https://api.spacexdata.com/v4/starlink',
  
  // SpaceX API v5
  'https://api.spacexdata.com/v5/launches',
  'https://api.spacexdata.com/v5/launches/latest',
  
  // TLE API
  'https://tle.ivanstanojevic.me/api/tle',
  
  // Launch Library
  'https://ll.thespacedevs.com/2.3.0/launches/',
  'https://ll.thespacedevs.com/2.3.0/events/',
  'https://ll.thespacedevs.com/2.3.0/agencies/',
  'https://ll.thespacedevs.com/2.3.0/astronauts/',
  'https://ll.thespacedevs.com/2.3.0/space_stations/',
  'https://ll.thespacedevs.com/2.3.0/expeditions/',
  
  // Exoplanets
  'https://raw.githubusercontent.com/OpenExoplanetCatalogue/open_exoplanet_catalogue/master/systems.xml',
  
  // NASA APIs
  'https://data.nasa.gov/resource/gh4g-9sfh.json',
  'https://api.nasa.gov/DONKI/FLR',
  'https://eonet.gsfc.nasa.gov/api/v3/events',
  
  // Other Space APIs
  'https://www.space-track.org/basicspacedata/query',
  'https://planetarynames.wr.usgs.gov/search',
  'https://api.adsabs.harvard.edu/v1/search/query',
  'https://minorplanetcenter.net/web_service/orbits',
  'https://isro.vercel.app/api/spacecrafts',
  'https://api.esa.int/mars-express/imagery',
  
  // Earth Observation
  'https://catalogue.dataspace.copernicus.eu/resto/api/collections/search.json',
  
  // People in Space
  'http://api.open-notify.org/astros.json',
  
  // Space News
  'https://api.spaceflightnewsapi.net/v4/articles/',
  
  // Embedded Tools
  'https://threesolar.netlify.app/',
  'https://sa-mack.github.io/X1-config-simulator/',
  
  // WebSockets
  'wss://wheretheiss.at/wss',
  'wss://spacex-api.herokuapp.com/v3/websocket'
];
