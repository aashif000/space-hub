// Mock data service to replace failing APIs
export const mockSpaceData = {
  // Exoplanet mock data
  exoplanets: [
    {
      id: 1,
      name: "Kepler-452b",
      distance: "1,400 light years",
      size: "1.6x Earth",
      temperature: "Temperate",
      discovered: "2015",
      description: "Often called Earth's cousin, this planet orbits in the habitable zone of a sun-like star."
    },
    {
      id: 2,
      name: "TRAPPIST-1e",
      distance: "40 light years",
      size: "0.92x Earth",
      temperature: "Potentially habitable",
      discovered: "2017",
      description: "One of seven Earth-sized planets orbiting the ultra-cool dwarf star TRAPPIST-1."
    },
    {
      id: 3,
      name: "Proxima Centauri b",
      distance: "4.24 light years",
      size: "1.17x Earth",
      temperature: "Unknown",
      discovered: "2016",
      description: "The closest known exoplanet to Earth, orbiting our nearest stellar neighbor."
    }
  ],

  // People in space mock data
  spacePopulation: {
    message: "success",
    number: 7,
    people: [
      { name: "Kjell Lindgren", craft: "ISS" },
      { name: "Bob Hines", craft: "ISS" },
      { name: "Samantha Cristoforetti", craft: "ISS" },
      { name: "Jessica Watkins", craft: "ISS" },
      { name: "Cai Xuzhe", craft: "Tiangong" },
      { name: "Chen Dong", craft: "Tiangong" },
      { name: "Liu Yang", craft: "Tiangong" }
    ]
  },

  // Space news mock data
  spaceNews: {
    count: 10,
    results: [
      {
        id: 1,
        title: "NASA's James Webb Space Telescope Discovers Most Distant Galaxy",
        summary: "The telescope has identified a galaxy that existed just 400 million years after the Big Bang.",
        published_at: "2024-12-15T10:30:00Z",
        image_url: "https://images.unsplash.com/photo-1446776653964-20c1d3a81b06",
        url: "#"
      },
      {
        id: 2,
        title: "SpaceX Successfully Launches Artemis Support Mission",
        summary: "The mission will deliver crucial supplies to support NASA's lunar exploration program.",
        published_at: "2024-12-14T15:45:00Z",
        image_url: "https://images.unsplash.com/photo-1516849841032-87cbac4d88f7",
        url: "#"
      },
      {
        id: 3,
        title: "Mars Rover Discovers Evidence of Ancient Microbial Life",
        summary: "Perseverance rover finds biosignatures in Martian rock samples.",
        published_at: "2024-12-13T09:20:00Z",
        image_url: "https://images.unsplash.com/photo-1614728894747-a83421e2b9c9",
        url: "#"
      }
    ]
  },

  // Meteorite data mock
  meteorites: [
    {
      id: 1,
      name: "Allende",
      mass: "2000",
      year: "1969",
      fall: "Fell",
      reclat: "26.966670",
      reclong: "-105.316670",
      geolocation: { latitude: "26.966670", longitude: "-105.316670" }
    },
    {
      id: 2,
      name: "Hoba",
      mass: "60000000",
      year: "1920",
      fall: "Found",
      reclat: "-19.583330",
      reclong: "17.916670",
      geolocation: { latitude: "-19.583330", longitude: "17.916670" }
    }
  ],

  // Kids zone facts
  kidsZoneFacts: [
    {
      id: 1,
      title: "The Sun is HUGE!",
      fact: "You could fit 1.3 million Earths inside the Sun!",
      icon: "☀️",
      color: "from-yellow-400 to-orange-500"
    },
    {
      id: 2,
      title: "Space is Silent",
      fact: "There's no air in space, so sound can't travel. Astronauts use radios to talk!",
      icon: "🔇",
      color: "from-blue-400 to-purple-500"
    },
    {
      id: 3,
      title: "Floating in Space",
      fact: "Astronauts float in space because there's no gravity pulling them down!",
      icon: "🧑‍🚀",
      color: "from-green-400 to-blue-500"
    },
    {
      id: 4,
      title: "Mars is Red",
      fact: "Mars looks red because it's covered in rusty iron dust!",
      icon: "🔴",
      color: "from-red-400 to-pink-500"
    },
    {
      id: 5,
      title: "Saturn's Rings",
      fact: "Saturn's rings are made of ice and rock pieces - some as small as grains of sand!",
      icon: "🪐",
      color: "from-purple-400 to-indigo-500"
    }
  ],

  // Space missions
  missions: [
    {
      id: 1,
      name: "Artemis III",
      status: "Planning",
      launch_date: "2026",
      description: "Return humans to the Moon",
      agency: "NASA"
    },
    {
      id: 2,
      name: "Europa Clipper",
      status: "En Route",
      launch_date: "2024",
      description: "Explore Jupiter's moon Europa",
      agency: "NASA"
    },
    {
      id: 3,
      name: "Mars Sample Return",
      status: "Development",
      launch_date: "2028",
      description: "Bring Mars samples back to Earth",
      agency: "NASA/ESA"
    }
  ]
};

// Utility function to simulate API calls
export const mockApiCall = <T>(data: T, delay: number = 1000): Promise<T> => {
  return new Promise((resolve) => {
    setTimeout(() => resolve(data), delay);
  });
};
