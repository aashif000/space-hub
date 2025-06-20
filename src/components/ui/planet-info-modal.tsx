import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, ExternalLink, ChevronDown, ChevronUp, Globe, Thermometer, Clock, Zap } from 'lucide-react';

interface Planet {
  name: string;
  position: [number, number, number];
  size: number;
  color: string;
  orbitSpeed?: number;
  tilt?: number;
  rings?: boolean;
  textureMap?: string;
}

interface PlanetInfoModalProps {
  planet: Planet | null;
  isOpen: boolean;
  onClose: () => void;
  theme?: 'light' | 'dark';
}

const PlanetInfoModal: React.FC<PlanetInfoModalProps> = ({ 
  planet, 
  isOpen, 
  onClose, 
  theme = 'dark' 
}) => {
  const [expandedSections, setExpandedSections] = useState({
    atmosphere: false,
    exploration: false,
    moons: false
  });

  if (!planet || !isOpen) return null;

  const toggleSection = (section: keyof typeof expandedSections) => {
    setExpandedSections(prev => ({...prev, [section]: !prev[section]}));
  };

  const modalStyles = {
    light: {
      overlay: 'bg-black/40 backdrop-blur-sm',
      container: 'bg-white shadow-xl border border-gray-200',
      header: 'border-b border-gray-200 bg-gradient-to-r from-blue-500/10 to-purple-500/10',
      heading: 'text-gray-900',
      text: 'text-gray-700',
      closeButton: 'bg-gray-100 hover:bg-gray-200 text-gray-700',
      expandButton: 'text-blue-600 hover:text-blue-800 bg-blue-50 hover:bg-blue-100',
      border: 'border-gray-200'
    },
    dark: {
      overlay: 'bg-black/70 backdrop-blur-sm',
      container: 'bg-gray-900 shadow-xl border border-gray-800',
      header: 'border-b border-gray-800 bg-gradient-to-r from-blue-900/40 to-purple-900/40',
      heading: 'text-white',
      text: 'text-gray-300',
      closeButton: 'bg-gray-800 hover:bg-gray-700 text-white',
      expandButton: 'text-blue-400 hover:text-blue-300 bg-blue-900/40 hover:bg-blue-900/60',
      border: 'border-gray-800'
    }
  };

  const currentStyle = theme === 'light' ? modalStyles.light : modalStyles.dark;

  // Planet facts and details
  const planetDetails = {
    Mercury: {
      diameter: "4,880 km",
      dayLength: "58.6 Earth days",
      yearLength: "88 Earth days",
      gravity: "3.7 m/s²",
      meanTemp: "167°C",
      atmosphere: "Minimal - Sodium, Potassium",
      moons: "0",
      atmosphereDetails: "Mercury's extremely thin atmosphere consists mainly of oxygen, sodium, hydrogen, helium and potassium. Because it's so thin, Mercury's atmosphere is constantly being 'blown away' by the solar wind and replenished by particles from the surface.",
      explorationDetails: "Mapped by NASA's MESSENGER mission (2011-2015), which was the first spacecraft to orbit Mercury. BepiColombo, a joint ESA/JAXA mission, is on its way to conduct detailed studies starting in 2025.",
      moonDetails: "Mercury has no moons. The planet's proximity to the Sun makes it difficult for it to capture and retain natural satellites.",
      interestingFact: "Mercury's surface resembles our Moon with heavy cratering and has extreme temperature variations between day and night sides, ranging from 430°C during the day to -180°C at night."
    },
    Venus: {
      diameter: "12,104 km",
      dayLength: "243 Earth days",
      yearLength: "225 Earth days",
      gravity: "8.87 m/s²",
      meanTemp: "464°C",
      atmosphere: "96% Carbon Dioxide, Sulphuric Acid clouds",
      moons: "0",
      atmosphereDetails: "Venus has the densest atmosphere of all terrestrial planets, composed primarily of carbon dioxide with clouds of sulfuric acid. The thick atmosphere traps heat in a runaway greenhouse effect, making it the hottest planet in our solar system.",
      explorationDetails: "Studied by various missions including Soviet Venera landers, NASA's Magellan mapper, and ESA's Venus Express. The extreme conditions on Venus make surface exploration challenging.",
      moonDetails: "Venus has no moons. Some theories suggest Venus may have had a moon in the past that was destroyed by collision or other cosmic events.",
      interestingFact: "Venus rotates backwards compared to other planets, with the Sun rising in the west and setting in the east. Its day (243 Earth days) is longer than its year (225 Earth days)."
    },
    Earth: {
      diameter: "12,742 km",
      dayLength: "24 hours",
      yearLength: "365.25 days",
      gravity: "9.81 m/s²",
      meanTemp: "15°C",
      atmosphere: "78% Nitrogen, 21% Oxygen",
      moons: "1",
      atmosphereDetails: "Earth's atmosphere is composed primarily of nitrogen (78%) and oxygen (21%) with traces of other gases. It protects life by absorbing ultraviolet radiation, warming the surface, and reducing temperature extremes.",
      explorationDetails: "Our home planet is continuously studied through satellites, ground-based observations, and direct measurements. Earth observation satellites monitor climate change, weather patterns, and environmental changes.",
      moonDetails: "Earth has one natural satellite, the Moon, which is relatively large compared to Earth (about 1/4 of Earth's diameter). The Moon was likely formed when a Mars-sized body collided with the early Earth.",
      interestingFact: "Earth is the only known planet to support life and has the highest density of all the planets in our solar system. About 71% of Earth's surface is covered by water."
    },
    Mars: {
      diameter: "6,779 km",
      dayLength: "24.6 hours",
      yearLength: "687 Earth days",
      gravity: "3.71 m/s²",
      meanTemp: "-65°C",
      atmosphere: "95% Carbon Dioxide, thin",
      moons: "2 (Phobos, Deimos)",
      atmosphereDetails: "Mars has a very thin atmosphere, composed mostly of carbon dioxide (95.3%) with traces of nitrogen and argon. The thin atmosphere means that Mars cannot retain heat, leading to cold surface temperatures.",
      explorationDetails: "Explored by numerous missions including NASA's Viking landers, Mars Rovers (Spirit, Opportunity, Curiosity, Perseverance), and orbiters like Mars Reconnaissance Orbiter.",
      moonDetails: "Mars has two small moons, Phobos and Deimos, which are thought to be captured asteroids. Phobos is gradually spiraling inward and may eventually collide with Mars.",
      interestingFact: "Mars has the largest dust storms in our solar system, which can last for months and cover the entire planet. These storms are so large that they can be seen from Earth through a telescope."
    },
    Jupiter: {
      diameter: "139,820 km",
      dayLength: "9.93 hours",
      yearLength: "11.86 Earth years",
      gravity: "24.79 m/s²",
      meanTemp: "-110°C",
      atmosphere: "89% Hydrogen, 10% Helium",
      moons: "95 confirmed",
      atmosphereDetails: "Jupiter's atmosphere is composed primarily of hydrogen and helium, with traces of methane, water vapor, ammonia, and other compounds. The Great Red Spot is a giant storm that has been raging for centuries.",
      explorationDetails: "Studied by Pioneer, Voyager, Galileo, and currently by the Juno mission. Europa Clipper will launch to explore Jupiter's moon Europa for signs of life.",
      moonDetails: "Jupiter has 95 confirmed moons, including the four largest Galilean moons: Io, Europa, Ganymede, and Callisto. Europa and Ganymede may have subsurface oceans.",
      interestingFact: "Jupiter is so massive that it influences the orbits of other planets and acts as a 'cosmic vacuum cleaner' protecting inner planets from asteroids and comets."
    },
    Saturn: {
      diameter: "116,460 km",
      dayLength: "10.7 hours",
      yearLength: "29.46 Earth years",
      gravity: "10.44 m/s²",
      meanTemp: "-140°C",
      atmosphere: "96% Hydrogen, 3% Helium",
      moons: "146 confirmed",
      atmosphereDetails: "Saturn's atmosphere is similar to Jupiter's but with more distinct banding. The planet experiences seasonal changes due to its axial tilt, and its hexagonal storm at the north pole is unique in the solar system.",
      explorationDetails: "Extensively studied by the Cassini mission (1997-2017), which provided detailed information about Saturn's rings, moons, and atmosphere. Future missions are being planned.",
      moonDetails: "Saturn has 146 confirmed moons, with Titan being the largest. Titan has a thick atmosphere and liquid methane lakes, making it a target for astrobiology research.",
      interestingFact: "Saturn is the least dense planet in our solar system - it would float if you could find an ocean big enough! Its ring system is the most extensive and complex in the solar system."
    },
    Uranus: {
      diameter: "50,724 km",
      dayLength: "17.2 hours",
      yearLength: "84 Earth years",
      gravity: "8.69 m/s²",
      meanTemp: "-195°C",
      atmosphere: "83% Hydrogen, 15% Helium, 2% Methane",
      moons: "27 confirmed",
      atmosphereDetails: "Uranus has a unique atmosphere with methane giving it a blue-green color. The planet rotates on its side with an extreme axial tilt of 98 degrees, causing unusual seasonal patterns.",
      explorationDetails: "Only briefly visited by Voyager 2 in 1986. No dedicated missions are currently planned, though concepts for future Uranus orbiters are being studied.",
      moonDetails: "Uranus has 27 known moons, all named after characters from Shakespeare and Alexander Pope. The largest moons are Ariel, Umbriel, Titania, Oberon, and Miranda.",
      interestingFact: "Uranus rotates on its side, likely due to a collision with an Earth-sized object billions of years ago. This means its seasons last about 21 Earth years each!"
    },
    Neptune: {
      diameter: "49,244 km",
      dayLength: "16.1 hours",
      yearLength: "164.8 Earth years",
      gravity: "11.15 m/s²",
      meanTemp: "-200°C",
      atmosphere: "80% Hydrogen, 19% Helium, 1% Methane",
      moons: "16 confirmed",
      atmosphereDetails: "Neptune has the most dynamic atmosphere in the solar system with winds reaching speeds of up to 2,100 km/h. The methane in its atmosphere gives it a deep blue color.",
      explorationDetails: "Only briefly visited by Voyager 2 in 1989. Future missions to the ice giants are being considered but would take decades to reach Neptune.",
      moonDetails: "Neptune has 16 known moons, with Triton being by far the largest. Triton is geologically active and likely a captured Kuiper Belt object.",
      interestingFact: "Neptune has the strongest winds in the solar system, despite being the farthest planet from the Sun. It generates 2.6 times more energy than it receives from the Sun!"
    }
  };

  const details = planetDetails[planet.name as keyof typeof planetDetails];

  if (!details) return null;

  return (
    <AnimatePresence>
      <motion.div 
        className={`fixed inset-0 z-50 flex items-center justify-center p-4 ${currentStyle.overlay}`}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
      >
        <motion.div 
          className={`relative w-full max-w-2xl max-h-[90vh] overflow-y-auto rounded-xl ${currentStyle.container}`}
          initial={{ scale: 0.9, opacity: 0, y: 20 }}
          animate={{ scale: 1, opacity: 1, y: 0 }}
          exit={{ scale: 0.9, opacity: 0, y: 20 }}
          onClick={(e) => e.stopPropagation()}
        >
          {/* Header */}
          <div className={`sticky top-0 p-6 ${currentStyle.header}`}>
            <div className="flex justify-between items-start">
              <div className="flex items-center gap-4">
                <div 
                  className="w-12 h-12 rounded-full shadow-lg"
                  style={{ 
                    backgroundColor: planet.color,
                    boxShadow: `0 0 20px ${planet.color}40`
                  }}
                />
                <div>
                  <h2 className={`text-2xl font-bold ${currentStyle.heading}`}>
                    {planet.name}
                  </h2>
                  <p className={`text-sm ${currentStyle.text}`}>
                    Click sections below to expand for more details
                  </p>
                </div>
              </div>
              <button 
                onClick={onClose}
                className={`p-2 rounded-lg transition-colors ${currentStyle.closeButton}`}
              >
                <X size={20} />
              </button>
            </div>
          </div>
          
          {/* Content */}
          <div className="p-6 space-y-6">
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <h3 className={`font-medium mb-3 flex items-center gap-2 ${currentStyle.heading}`}>
                  <Globe size={18} />
                  Basic Properties
                </h3>
                <dl className={`space-y-2 text-sm ${currentStyle.text}`}>
                  <div className="grid grid-cols-2 gap-2">
                    <dt className={`font-medium ${currentStyle.text}`}>Diameter:</dt>
                    <dd>{details.diameter}</dd>
                  </div>
                  <div className="grid grid-cols-2 gap-2">
                    <dt className={`font-medium ${currentStyle.text}`}>Day Length:</dt>
                    <dd>{details.dayLength}</dd>
                  </div>
                  <div className="grid grid-cols-2 gap-2">
                    <dt className={`font-medium ${currentStyle.text}`}>Year Length:</dt>
                    <dd>{details.yearLength}</dd>
                  </div>
                  <div className="grid grid-cols-2 gap-2">
                    <dt className={`font-medium ${currentStyle.text}`}>Gravity:</dt>
                    <dd>{details.gravity}</dd>
                  </div>
                  <div className="grid grid-cols-2 gap-2">
                    <dt className={`font-medium ${currentStyle.text}`}>Avg. Temperature:</dt>
                    <dd>{details.meanTemp}</dd>
                  </div>
                </dl>
              </div>
              
              <div>
                <h3 className={`font-medium mb-3 flex items-center gap-2 ${currentStyle.heading}`}>
                  <Zap size={18} />
                  Did You Know?
                </h3>
                <p className={`text-sm ${currentStyle.text}`}>{details.interestingFact}</p>
              </div>
            </div>

            {/* Expandable Sections */}
            <div className="space-y-4">
              {/* Atmosphere Section */}
              <div className={`border rounded-lg p-4 ${currentStyle.border}`}>
                <button 
                  onClick={() => toggleSection('atmosphere')}
                  className={`flex justify-between items-center w-full text-left ${currentStyle.heading}`}
                >
                  <span className="font-medium flex items-center gap-2">
                    <Thermometer size={16} />
                    Atmosphere: {details.atmosphere}
                  </span>
                  {expandedSections.atmosphere ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
                </button>
                <AnimatePresence>
                  {expandedSections.atmosphere && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      className="overflow-hidden"
                    >
                      <p className={`mt-3 text-sm ${currentStyle.text}`}>
                        {details.atmosphereDetails}
                      </p>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              {/* Moons Section */}
              <div className={`border rounded-lg p-4 ${currentStyle.border}`}>
                <button 
                  onClick={() => toggleSection('moons')}
                  className={`flex justify-between items-center w-full text-left ${currentStyle.heading}`}
                >
                  <span className="font-medium flex items-center gap-2">
                    <Clock size={16} />
                    Moons: {details.moons}
                  </span>
                  {expandedSections.moons ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
                </button>
                <AnimatePresence>
                  {expandedSections.moons && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      className="overflow-hidden"
                    >
                      <p className={`mt-3 text-sm ${currentStyle.text}`}>
                        {details.moonDetails}
                      </p>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              {/* Exploration Section */}
              <div className={`border rounded-lg p-4 ${currentStyle.border}`}>
                <button 
                  onClick={() => toggleSection('exploration')}
                  className={`flex justify-between items-center w-full text-left ${currentStyle.heading}`}
                >
                  <span className="font-medium">Exploration Status</span>
                  {expandedSections.exploration ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
                </button>
                <AnimatePresence>
                  {expandedSections.exploration && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      className="overflow-hidden"
                    >
                      <p className={`mt-3 text-sm ${currentStyle.text}`}>
                        {details.explorationDetails}
                      </p>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </div>

            {/* Size Comparison */}
            <div>
              <h3 className={`font-medium mb-3 ${currentStyle.heading}`}>Relative Size Comparison</h3>
              <div className="h-8 w-full bg-gray-800/50 rounded-full overflow-hidden">
                <div 
                  className="h-full rounded-full transition-all duration-1000"
                  style={{ 
                    backgroundColor: planet.color, 
                    width: `${planet.name === "Earth" ? 10 : 
                            planet.name === "Mercury" ? 4 :
                            planet.name === "Venus" ? 9.5 :
                            planet.name === "Mars" ? 5.3 :
                            planet.name === "Jupiter" ? 100 :
                            planet.name === "Saturn" ? 85 :
                            planet.name === "Uranus" ? 36 :
                            planet.name === "Neptune" ? 35 : 10}%` 
                  }}
                ></div>
              </div>
              <div className="flex justify-between text-xs mt-1">
                <span className={currentStyle.text}>Mercury</span>
                <span className={currentStyle.text}>Earth</span>
                <span className={currentStyle.text}>Jupiter</span>
              </div>
            </div>
          </div>
          
          {/* Footer */}
          <div className={`p-4 border-t ${currentStyle.border}`}>
            <div className="flex justify-between items-center">
              <span className={`text-xs ${currentStyle.text}`}>
                Data source: NASA Solar System Exploration
              </span>
              <div className="flex gap-2">
                <button 
                  className={`px-4 py-2 rounded-md font-medium transition-colors flex items-center gap-2
                    ${theme === 'light' 
                      ? 'bg-blue-100 hover:bg-blue-200 text-blue-700' 
                      : 'bg-blue-900/30 hover:bg-blue-800/40 text-blue-400'}`
                  }
                  onClick={() => window.open(`https://solarsystem.nasa.gov/planets/${planet.name.toLowerCase()}/overview/`, '_blank')}
                >
                  <ExternalLink size={14} />
                  Learn More
                </button>
                <button 
                  className={`px-4 py-2 rounded-md font-medium transition-colors
                    ${theme === 'light' 
                      ? 'bg-indigo-500 hover:bg-indigo-600 text-white' 
                      : 'bg-blue-600 hover:bg-blue-700 text-white'}`
                  }
                  onClick={onClose}
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};

export default PlanetInfoModal;
