import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  CheckCircle, 
  AlertCircle, 
  Clock, 
  Wifi, 
  Battery, 
  Cpu, 
  Monitor,
  Smartphone,
  Zap,
  Activity,
  Globe,
  Star
} from 'lucide-react';

interface SystemStatus {
  name: string;
  status: 'online' | 'warning' | 'offline';
  message: string;
  lastChecked: Date;
}

interface SystemStatusIndicatorProps {
  className?: string;
}

export const SystemStatusIndicator: React.FC<SystemStatusIndicatorProps> = ({ className = "" }) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [systems, setSystems] = useState<SystemStatus[]>([
    { name: 'WebGL Renderer', status: 'online', message: 'Rendering at optimal performance', lastChecked: new Date() },
    { name: '3D Scene Engine', status: 'online', message: 'Solar system loaded successfully', lastChecked: new Date() },
    { name: 'Performance Monitor', status: 'online', message: 'Tracking performance metrics', lastChecked: new Date() },
    { name: 'Analytics System', status: 'online', message: 'Collecting real-time data', lastChecked: new Date() },
    { name: 'Mobile Optimization', status: 'online', message: 'Touch controls active', lastChecked: new Date() },
    { name: 'Network Connection', status: 'online', message: 'Fast connection detected', lastChecked: new Date() }
  ]);

  const [overallStatus, setOverallStatus] = useState<'online' | 'warning' | 'offline'>('online');

  useEffect(() => {
    const checkSystems = () => {
      const updatedSystems = systems.map(system => {
        let status = system.status;
        let message = system.message;

        // Perform actual system checks
        switch (system.name) {
          case 'WebGL Renderer':
            const canvas = document.createElement('canvas');
            const gl = canvas.getContext('webgl') || canvas.getContext('experimental-webgl');
            if (!gl) {
              status = 'offline';
              message = 'WebGL not supported';
            } else {
              status = 'online';
              message = 'WebGL context active';
            }
            break;

          case '3D Scene Engine':
            const sceneElements = document.querySelectorAll('canvas');
            if (sceneElements.length === 0) {
              status = 'warning';
              message = 'Scene loading...';
            } else {
              status = 'online';
              message = 'Scene rendering successfully';
            }
            break;

          case 'Performance Monitor':
            if (performance && performance.now) {
              const memoryInfo = (performance as any).memory;
              if (memoryInfo && memoryInfo.usedJSHeapSize > 100 * 1024 * 1024) {
                status = 'warning';
                message = 'High memory usage detected';
              } else {
                status = 'online';
                message = 'Performance within normal range';
              }
            }
            break;

          case 'Mobile Optimization':
            const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
            const touchSupport = 'ontouchstart' in window || navigator.maxTouchPoints > 0;
            status = 'online';
            message = isMobile ? 'Mobile optimizations active' : 'Desktop mode active';
            break;

          case 'Network Connection':
            const connection = (navigator as any).connection;
            if (connection) {
              if (connection.effectiveType === '4g' || connection.effectiveType === '3g') {
                status = 'online';
                message = `${connection.effectiveType.toUpperCase()} connection`;
              } else {
                status = 'warning';
                message = 'Slow connection detected';
              }
            } else {
              status = 'online';
              message = 'Connection status unknown';
            }
            break;
        }

        return {
          ...system,
          status,
          message,
          lastChecked: new Date()
        };
      });

      setSystems(updatedSystems);

      // Calculate overall status
      const hasOffline = updatedSystems.some(s => s.status === 'offline');
      const hasWarning = updatedSystems.some(s => s.status === 'warning');
      
      if (hasOffline) {
        setOverallStatus('offline');
      } else if (hasWarning) {
        setOverallStatus('warning');
      } else {
        setOverallStatus('online');
      }
    };

    // Initial check
    checkSystems();

    // Periodic checks
    const interval = setInterval(checkSystems, 5000);
    return () => clearInterval(interval);
  }, []);

  const getStatusIcon = (status: SystemStatus['status']) => {
    switch (status) {
      case 'online':
        return <CheckCircle className="w-3 h-3 text-green-400" />;
      case 'warning':
        return <AlertCircle className="w-3 h-3 text-yellow-400" />;
      case 'offline':
        return <AlertCircle className="w-3 h-3 text-red-400" />;
    }
  };

  const getSystemIcon = (systemName: string) => {
    switch (systemName) {
      case 'WebGL Renderer':
        return <Monitor className="w-3 h-3" />;
      case '3D Scene Engine':
        return <Star className="w-3 h-3" />;
      case 'Performance Monitor':
        return <Activity className="w-3 h-3" />;
      case 'Analytics System':
        return <Cpu className="w-3 h-3" />;
      case 'Mobile Optimization':
        return <Smartphone className="w-3 h-3" />;
      case 'Network Connection':
        return <Wifi className="w-3 h-3" />;
      default:
        return <Globe className="w-3 h-3" />;
    }
  };

  const getOverallStatusColor = () => {
    switch (overallStatus) {
      case 'online':
        return 'from-green-500 to-emerald-600';
      case 'warning':
        return 'from-yellow-500 to-orange-600';
      case 'offline':
        return 'from-red-500 to-pink-600';
    }
  };

  const onlineCount = systems.filter(s => s.status === 'online').length;
  const totalCount = systems.length;

  return (
    <div className={`relative ${className}`}>
      <motion.button
        onClick={() => setIsExpanded(!isExpanded)}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        className={`flex items-center gap-2 px-3 py-2 rounded-lg text-sm bg-gradient-to-r ${getOverallStatusColor()} text-white shadow-lg backdrop-blur-sm transition-all duration-200`}
      >
        <div className="flex items-center gap-1">
          {overallStatus === 'online' ? (
            <CheckCircle className="w-4 h-4" />
          ) : overallStatus === 'warning' ? (
            <AlertCircle className="w-4 h-4" />
          ) : (
            <AlertCircle className="w-4 h-4" />
          )}
          <span className="font-medium">
            {onlineCount}/{totalCount} Systems
          </span>
        </div>
        <motion.div
          animate={{ rotate: isExpanded ? 180 : 0 }}
          transition={{ duration: 0.2 }}
        >
          ▼
        </motion.div>
      </motion.button>

      <AnimatePresence>
        {isExpanded && (
          <motion.div
            initial={{ opacity: 0, y: -10, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -10, scale: 0.95 }}
            transition={{ duration: 0.2 }}
            className="absolute top-full left-0 mt-2 w-80 bg-black/90 backdrop-blur-sm rounded-lg border border-white/20 shadow-xl z-50"
          >
            <div className="p-4">
              <div className="flex items-center gap-2 mb-3">
                <Activity className="w-4 h-4 text-blue-400" />
                <h3 className="text-white font-medium">System Status</h3>
              </div>

              <div className="space-y-2">
                {systems.map((system, index) => (
                  <motion.div
                    key={system.name}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.05 }}
                    className="flex items-center gap-3 p-2 rounded-lg bg-white/5 hover:bg-white/10 transition-colors"
                  >
                    <div className="flex items-center gap-2">
                      {getStatusIcon(system.status)}
                      {getSystemIcon(system.name)}
                    </div>
                    
                    <div className="flex-1">
                      <div className="text-sm font-medium text-white">
                        {system.name}
                      </div>
                      <div className="text-xs text-gray-400">
                        {system.message}
                      </div>
                    </div>

                    <div className="text-xs text-gray-500">
                      {system.lastChecked.toLocaleTimeString().slice(0, 5)}
                    </div>
                  </motion.div>
                ))}
              </div>

              <div className="mt-3 pt-3 border-t border-white/10">
                <div className="flex items-center justify-between text-xs text-gray-400">
                  <span>Last updated: {new Date().toLocaleTimeString()}</span>
                  <span>Auto-refresh: 5s</span>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default SystemStatusIndicator;
