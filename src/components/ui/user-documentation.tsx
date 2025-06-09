import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Book, 
  Rocket, 
  Star, 
  Monitor, 
  Smartphone, 
  Gamepad,
  Settings,
  Zap,
  Activity,
  Eye,
  RotateCcw,
  Play,
  ChevronDown,
  ChevronRight,
  CheckCircle
} from 'lucide-react';

interface DocumentationProps {
  onClose?: () => void;
}

interface Section {
  id: string;
  title: string;
  icon: React.ComponentType<any>;
  content: React.ReactNode;
}

export const UserDocumentation: React.FC<DocumentationProps> = ({ onClose }) => {
  const [activeSection, setActiveSection] = useState<string>('overview');
  const [expandedItems, setExpandedItems] = useState<Set<string>>(new Set());

  const toggleExpanded = (itemId: string) => {
    const newExpanded = new Set(expandedItems);
    if (newExpanded.has(itemId)) {
      newExpanded.delete(itemId);
    } else {
      newExpanded.add(itemId);
    }
    setExpandedItems(newExpanded);
  };

  const sections: Section[] = [
    {
      id: 'overview',
      title: 'Overview',
      icon: Book,
      content: (
        <div className="space-y-4">
          <h3 className="text-lg font-semibold text-white mb-3">Welcome to AstroAgent Enhanced</h3>
          <p className="text-gray-300 text-sm leading-relaxed">
            AstroAgent Enhanced is a cutting-edge space exploration platform featuring advanced 3D visualizations, 
            real-time performance monitoring, and comprehensive analytics. Experience the universe like never before 
            with our interactive solar system, mobile-optimized controls, and intelligent performance adaptations.
          </p>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mt-4">
            {[
              { icon: Rocket, text: 'Interactive 3D Solar System', color: 'text-blue-400' },
              { icon: Activity, text: 'Real-time Performance Monitor', color: 'text-green-400' },
              { icon: Smartphone, text: 'Mobile Touch Controls', color: 'text-purple-400' },
              { icon: Eye, text: 'Advanced Analytics Dashboard', color: 'text-yellow-400' }
            ].map((feature, index) => (
              <div key={index} className="flex items-center gap-3 p-3 bg-white/5 rounded-lg">
                <feature.icon className={`w-5 h-5 ${feature.color}`} />
                <span className="text-gray-300 text-sm">{feature.text}</span>
              </div>
            ))}
          </div>
        </div>
      )
    },
    {
      id: 'controls',
      title: 'Controls & Navigation',
      icon: Gamepad,
      content: (
        <div className="space-y-4">
          <h3 className="text-lg font-semibold text-white mb-3">How to Navigate</h3>
          
          <div className="space-y-3">
            <div className="bg-white/5 rounded-lg p-4">
              <h4 className="text-white font-medium mb-2 flex items-center gap-2">
                <Monitor className="w-4 h-4" />
                Desktop Controls
              </h4>
              <ul className="space-y-2 text-sm text-gray-300">
                <li className="flex items-center gap-2">
                  <span className="w-2 h-2 bg-blue-400 rounded-full"></span>
                  Mouse wheel to zoom in/out
                </li>
                <li className="flex items-center gap-2">
                  <span className="w-2 h-2 bg-green-400 rounded-full"></span>
                  Click and drag to rotate view
                </li>
                <li className="flex items-center gap-2">
                  <span className="w-2 h-2 bg-purple-400 rounded-full"></span>
                  Click planets for detailed information
                </li>
              </ul>
            </div>

            <div className="bg-white/5 rounded-lg p-4">
              <h4 className="text-white font-medium mb-2 flex items-center gap-2">
                <Smartphone className="w-4 h-4" />
                Mobile & Touch Controls
              </h4>
              <ul className="space-y-2 text-sm text-gray-300">
                <li className="flex items-center gap-2">
                  <span className="w-2 h-2 bg-blue-400 rounded-full"></span>
                  Pinch to zoom in/out
                </li>
                <li className="flex items-center gap-2">
                  <span className="w-2 h-2 bg-green-400 rounded-full"></span>
                  Single finger drag to rotate
                </li>
                <li className="flex items-center gap-2">
                  <span className="w-2 h-2 bg-purple-400 rounded-full"></span>
                  Tap planets to explore
                </li>
                <li className="flex items-center gap-2">
                  <span className="w-2 h-2 bg-yellow-400 rounded-full"></span>
                  Use mobile control panel for quick actions
                </li>
              </ul>
            </div>
          </div>
        </div>
      )
    },
    {
      id: 'features',
      title: 'Key Features',
      icon: Star,
      content: (
        <div className="space-y-4">
          <h3 className="text-lg font-semibold text-white mb-3">Advanced Features</h3>
          
          {[
            {
              id: 'performance',
              title: 'Performance Auto-Optimization',
              icon: Zap,
              description: 'Automatically adjusts graphics quality based on your device capabilities',
              details: [
                'Real-time FPS monitoring',
                'Dynamic quality adjustment (High/Medium/Low)',
                'Memory usage optimization',
                'Battery-aware performance scaling'
              ]
            },
            {
              id: 'analytics',
              title: 'Advanced Analytics Dashboard',
              icon: Activity,
              description: 'Comprehensive real-time monitoring and insights',
              details: [
                'Live performance metrics',
                'Device capability detection',
                'User engagement tracking',
                'System resource monitoring'
              ]
            },
            {
              id: 'mobile',
              title: 'Mobile Optimization Suite',
              icon: Smartphone,
              description: 'Enhanced mobile experience with touch controls',
              details: [
                'Touch gesture recognition',
                'Mobile-specific UI adaptations',
                'Battery status monitoring',
                'Network-aware optimizations'
              ]
            }
          ].map((feature) => (
            <div key={feature.id} className="bg-white/5 rounded-lg p-4">
              <button
                onClick={() => toggleExpanded(feature.id)}
                className="w-full flex items-center justify-between text-left"
              >
                <div className="flex items-center gap-3">
                  <feature.icon className="w-5 h-5 text-blue-400" />
                  <div>
                    <h4 className="text-white font-medium">{feature.title}</h4>
                    <p className="text-gray-400 text-sm">{feature.description}</p>
                  </div>
                </div>
                {expandedItems.has(feature.id) ? (
                  <ChevronDown className="w-4 h-4 text-gray-400" />
                ) : (
                  <ChevronRight className="w-4 h-4 text-gray-400" />
                )}
              </button>
              
              {expandedItems.has(feature.id) && (
                <div className="mt-3 overflow-hidden">
                  <ul className="space-y-1 text-sm text-gray-300 ml-8">
                    {feature.details.map((detail, index) => (
                      <li key={index} className="flex items-center gap-2">
                        <CheckCircle className="w-3 h-3 text-green-400" />
                        {detail}
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          ))}
        </div>
      )
    },
    {
      id: 'performance',
      title: 'Performance Guide',
      icon: Monitor,
      content: (
        <div className="space-y-4">
          <h3 className="text-lg font-semibold text-white mb-3">Optimizing Performance</h3>
          
          <div className="space-y-4">
            <div className="bg-gradient-to-r from-green-500/10 to-blue-500/10 rounded-lg p-4 border border-green-500/20">
              <h4 className="text-green-400 font-medium mb-2">High Performance Mode</h4>
              <p className="text-gray-300 text-sm mb-2">
                For powerful devices with dedicated graphics cards
              </p>
              <ul className="text-xs text-gray-400 space-y-1">
                <li>• 5000+ animated star particles</li>
                <li>• Full anti-aliasing</li>
                <li>• Advanced visual effects</li>
                <li>• High-resolution textures</li>
              </ul>
            </div>

            <div className="bg-gradient-to-r from-yellow-500/10 to-orange-500/10 rounded-lg p-4 border border-yellow-500/20">
              <h4 className="text-yellow-400 font-medium mb-2">Medium Performance Mode</h4>
              <p className="text-gray-300 text-sm mb-2">
                Balanced settings for most devices
              </p>
              <ul className="text-xs text-gray-400 space-y-1">
                <li>• 2000 star particles</li>
                <li>• Selective anti-aliasing</li>
                <li>• Optimized effects</li>
                <li>• Standard textures</li>
              </ul>
            </div>

            <div className="bg-gradient-to-r from-red-500/10 to-pink-500/10 rounded-lg p-4 border border-red-500/20">
              <h4 className="text-red-400 font-medium mb-2">Low Performance Mode</h4>
              <p className="text-gray-300 text-sm mb-2">
                Optimized for mobile devices and older hardware
              </p>
              <ul className="text-xs text-gray-400 space-y-1">
                <li>• 1000 star particles</li>
                <li>• No anti-aliasing</li>
                <li>• Minimal effects</li>
                <li>• Compressed textures</li>
              </ul>
            </div>
          </div>

          <div className="bg-white/5 rounded-lg p-4 mt-4">
            <h4 className="text-white font-medium mb-2">Performance Tips</h4>
            <ul className="text-sm text-gray-300 space-y-1">
              <li>• Close other browser tabs to free up memory</li>
              <li>• Use latest version of Chrome, Firefox, or Safari</li>
              <li>• Enable hardware acceleration in browser settings</li>
              <li>• On mobile, ensure sufficient battery level for best performance</li>
            </ul>
          </div>
        </div>
      )
    },
    {
      id: 'troubleshooting',
      title: 'Troubleshooting',
      icon: Settings,
      content: (
        <div className="space-y-4">
          <h3 className="text-lg font-semibold text-white mb-3">Common Issues & Solutions</h3>
          
          <div className="space-y-3">
            {[
              {
                issue: 'Low frame rate or stuttering',
                solutions: [
                  'Switch to lower quality mode using the quality toggle',
                  'Close other applications and browser tabs',
                  'Ensure your device is not in power saving mode',
                  'Update your graphics drivers'
                ]
              },
              {
                issue: '3D scene not loading',
                solutions: [
                  'Refresh the page and wait for complete loading',
                  'Check if WebGL is enabled in your browser',
                  'Try a different browser (Chrome recommended)',
                  'Disable browser extensions that might block WebGL'
                ]
              },
              {
                issue: 'Touch controls not working',
                solutions: [
                  'Ensure you\'re using a touch-enabled device',
                  'Try the mobile control panel buttons',
                  'Refresh the page to reset touch detection',
                  'Check if touch events are blocked by other elements'
                ]
              },
              {
                issue: 'Analytics not updating',
                solutions: [
                  'Wait a few seconds for data to populate',
                  'Check browser console for errors',
                  'Ensure JavaScript is enabled',
                  'Try refreshing the analytics dashboard'
                ]
              }
            ].map((item, index) => (
              <div key={index} className="bg-white/5 rounded-lg p-4">
                <h4 className="text-red-400 font-medium mb-2">❌ {item.issue}</h4>
                <ul className="space-y-1">
                  {item.solutions.map((solution, sIndex) => (
                    <li key={sIndex} className="text-sm text-gray-300 flex items-start gap-2">
                      <span className="text-green-400 text-xs mt-1">✓</span>
                      {solution}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      )
    }
  ];

  return (
    <div className="bg-black/95 backdrop-blur-sm rounded-xl border border-white/20 w-full max-w-4xl max-h-[85vh] overflow-hidden flex flex-col">
      {/* Header */}
      <div className="flex items-center justify-between p-6 border-b border-white/10">
        <div className="flex items-center gap-3">
          <Book className="w-6 h-6 text-blue-400" />
          <h2 className="text-xl font-semibold text-white">User Documentation</h2>
        </div>
        {onClose && (
          <button 
            onClick={onClose}
            className="text-gray-400 hover:text-white transition-colors text-xl"
          >
            ×
          </button>
        )}
      </div>

      <div className="flex flex-1 overflow-hidden">
        {/* Sidebar */}
        <div className="w-64 border-r border-white/10 p-4">
          <nav className="space-y-2">
            {sections.map((section) => (
              <button
                key={section.id}
                onClick={() => setActiveSection(section.id)}
                className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg text-left transition-colors ${
                  activeSection === section.id
                    ? 'bg-blue-500/20 text-blue-400 border border-blue-500/30'
                    : 'text-gray-300 hover:bg-white/5 hover:text-white'
                }`}
              >
                <section.icon className="w-4 h-4" />
                {section.title}
              </button>
            ))}
          </nav>
        </div>

        {/* Content */}
        <div className="flex-1 p-6 overflow-y-auto">
          <div>
            {sections.find(s => s.id === activeSection)?.content}
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserDocumentation;
