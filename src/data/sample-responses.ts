
export const SAMPLE_RESPONSES = {
  meteorite: {
    meta: {
      view: {
        id: "gh4g-9sfh",
        name: "Meteorite Landings",
        assetType: "dataset",
        attributionLink: "http://visualizing.org/datasets/meteorite-landings",
        category: "Space Science",
        description: "This comprehensive data set from The Meteoritical Society contains information on all of the known meteorite landings."
      }
    },
    data: [
      ["row-id", "name", "id", "nametype", "recclass", "mass", "fall", "year", "reclat", "reclong", "geolocation"]
    ]
  },

  copernicus: {
    type: "FeatureCollection",
    properties: {
      id: "5b537923-9689-5e9a-b92a-d22bd0910477",
      totalResults: null,
      exactCount: 0,
      startIndex: 1,
      itemsPerPage: 20
    },
    features: [
      {
        type: "Feature",
        id: "07e96184-2d7b-4b55-83a0-206aceeacde4",
        properties: {
          collection: "SENTINEL-3",
          status: "ONLINE",
          platform: "S3A",
          instrument: "AUX"
        }
      }
    ]
  },

  astros: {
    message: "success",
    number: 7,
    people: [
      { name: "Oleg Kononenko", craft: "ISS" },
      { name: "Nikolai Chub", craft: "ISS" },
      { name: "Tracy Caldwell Dyson", craft: "ISS" }
    ]
  },

  spaceflightNews: {
    count: 123,
    next: "http://api.example.org/accounts/?offset=400&limit=100",
    previous: "http://api.example.org/accounts/?offset=200&limit=100",
    results: [
      {
        id: 0,
        title: "SpaceX Dragon Capsule Returns to Earth",
        url: "string",
        image_url: "string",
        news_site: "SpaceX",
        summary: "Dragon capsule successfully splashes down in the Pacific Ocean.",
        published_at: "2025-05-31T15:08:44.515Z",
        featured: true
      }
    ]
  }
};
