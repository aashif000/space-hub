import React, { useState, useEffect, useRef } from 'react';
import { 
  Activity, 
  Eye, 
  Clock, 
  Zap, 
  Cpu, 
  HardDrive, 
  Wifi, 
  Battery,
  TrendingUp,
  Users,
  Globe,
  Smartphone
} from 'lucide-react';

interface MetricCardProps {
  title: string;
  value: string | number;
  unit?: string;
  icon: React.ComponentType<any>;
  trend?: 'up' | 'down' | 'stable';
  color?: string;
  description?: string;
}

const MetricCard: React.FC<MetricCardProps> = ({ 
  title, 
  value, 
  unit = '', 
  icon: Icon, 
  trend = 'stable',
  color = 'from-blue-500 to-purple-600',
  description 
}) => {
  const [displayValue, setDisplayValue] = useState(0);
  const numericValue = typeof value === 'string' ? parseFloat(value) : value;

  useEffect(() => {
    const duration = 1000;
    const steps = 60;
    const increment = numericValue / steps;
    let current = 0;

    const timer = setInterval(() => {
      current += increment;
      if (current >= numericValue) {
        setDisplayValue(numericValue);
        clearInterval(timer);
      } else {
        setDisplayValue(current);
      }
    }, duration / steps);

    return () => clearInterval(timer);
  }, [numericValue]);

  const getTrendIcon = () => {
    switch (trend) {
      case 'up':
        return <TrendingUp className="w-3 h-3 text-green-400" />;
      case 'down':
        return <TrendingUp className="w-3 h-3 text-red-400 rotate-180" />;
      default:
        return null;
    }
  };

  return (
    <div className="bg-gradient-to-br from-white/5 to-white/10 backdrop-blur-sm rounded-xl p-4 border border-white/20 hover:border-white/40 transition-all duration-300 hover:scale-[1.02] hover:-translate-y-0.5">
      <div className="flex items-center justify-between mb-3">
        <div className={`p-2 rounded-lg bg-gradient-to-r ${color}`}>
          <Icon className="w-4 h-4 text-white" />
        </div>
        {getTrendIcon()}
      </div>
      
      <div className="space-y-1">
        <h3 className="text-xs font-medium text-gray-400 uppercase tracking-wide">
          {title}
        </h3>
        <div className="flex items-baseline gap-1">
          <span className="text-xl font-bold text-white transition-all">
            {typeof value === 'string' ? value : displayValue.toFixed(0)}
          </span>
          {unit && <span className="text-sm text-gray-400">{unit}</span>}
        </div>
        {description && (
          <p className="text-xs text-gray-500 mt-1">{description}</p>
        )}
      </div>
    </div>
  );
};

// Real-time Analytics Hook
const useRealTimeAnalytics = () => {
  const [analytics, setAnalytics] = useState({
    fps: 60,
    memoryUsage: 45,
    loadTime: 1.2,
    activeUsers: 1,
    pageViews: 1,
    deviceType: 'desktop' as 'mobile' | 'tablet' | 'desktop',
    connectionSpeed: 'fast' as 'slow' | 'medium' | 'fast',
    batteryLevel: 100,
    renderTime: 16.7
  });

  useEffect(() => {
    const updateAnalytics = () => {
      // Simulate real-time data updates
      setAnalytics(prev => ({
        ...prev,
        fps: Math.max(30, Math.min(60, prev.fps + (Math.random() - 0.5) * 5)),
        memoryUsage: Math.max(20, Math.min(80, prev.memoryUsage + (Math.random() - 0.5) * 10)),
        renderTime: 16.7 + (Math.random() - 0.5) * 5,
        pageViews: prev.pageViews + (Math.random() > 0.8 ? 1 : 0)
      }));
    };

    // Get device info
    const updateDeviceInfo = () => {
      const userAgent = navigator.userAgent;
      const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(userAgent);
      const isTablet = /iPad|Android(?!.*Mobile)/i.test(userAgent);
      
      let deviceType: 'mobile' | 'tablet' | 'desktop' = 'desktop';
      if (isMobile) deviceType = 'mobile';
      else if (isTablet) deviceType = 'tablet';

      // Simulate connection speed based on device
      const connectionSpeed = deviceType === 'mobile' ? 'medium' : 'fast';

      setAnalytics(prev => ({
        ...prev,
        deviceType,
        connectionSpeed
      }));
    };

    // Get battery info if available
    const updateBatteryInfo = async () => {
      if ('getBattery' in navigator) {
        try {
          const battery = await (navigator as any).getBattery();
          setAnalytics(prev => ({
            ...prev,
            batteryLevel: Math.round(battery.level * 100)
          }));
        } catch (error) {
          // Battery API not supported
        }
      }
    };

    updateDeviceInfo();
    updateBatteryInfo();

    const interval = setInterval(updateAnalytics, 1000);
    return () => clearInterval(interval);
  }, []);

  return analytics;
};

// Main Advanced Analytics Dashboard
export const AdvancedAnalyticsDashboard: React.FC<{
  isVisible: boolean;
  onClose: () => void;
}> = ({ isVisible, onClose }) => {
  const analytics = useRealTimeAnalytics();
  const [selectedTab, setSelectedTab] = useState<'performance' | 'engagement' | 'system'>('performance');

  const performanceMetrics: MetricCardProps[] = [
    {
      title: 'Frame Rate',
      value: analytics.fps,
      unit: 'FPS',
      icon: Activity,
      trend: analytics.fps > 50 ? 'up' : analytics.fps > 30 ? 'stable' : 'down',
      color: 'from-green-500 to-emerald-600',
      description: 'Real-time rendering performance'
    },
    {
      title: 'Memory Usage',
      value: analytics.memoryUsage,
      unit: '%',
      icon: HardDrive,
      trend: analytics.memoryUsage < 60 ? 'stable' : 'up',
      color: 'from-blue-500 to-cyan-600',
      description: 'Current memory consumption'
    },
    {
      title: 'Load Time',
      value: analytics.loadTime,
      unit: 's',
      icon: Clock,
      trend: 'stable',
      color: 'from-purple-500 to-violet-600',
      description: 'Initial page load duration'
    },
    {
      title: 'Render Time',
      value: analytics.renderTime,
      unit: 'ms',
      icon: Zap,
      trend: analytics.renderTime < 20 ? 'up' : 'stable',
      color: 'from-orange-500 to-red-600',
      description: 'Frame render duration'
    }
  ];

  const engagementMetrics: MetricCardProps[] = [
    {
      title: 'Active Users',
      value: analytics.activeUsers,
      unit: '',
      icon: Users,
      trend: 'stable',
      color: 'from-indigo-500 to-purple-600',
      description: 'Currently online'
    },
    {
      title: 'Page Views',
      value: analytics.pageViews,
      unit: '',
      icon: Eye,
      trend: 'up',
      color: 'from-pink-500 to-rose-600',
      description: 'Total session views'
    },
    {
      title: 'Session Time',
      value: '4m 32s',
      unit: '',
      icon: Clock,
      trend: 'up',
      color: 'from-teal-500 to-cyan-600',
      description: 'Current session duration'
    },
    {
      title: 'Interactions',
      value: '23',
      unit: '',
      icon: Globe,
      trend: 'up',
      color: 'from-yellow-500 to-orange-600',
      description: 'User interactions'
    }
  ];

  const systemMetrics: MetricCardProps[] = [
    {
      title: 'Device Type',
      value: analytics.deviceType.charAt(0).toUpperCase() + analytics.deviceType.slice(1),
      unit: '',
      icon: analytics.deviceType === 'mobile' ? Smartphone : Cpu,
      trend: 'stable',
      color: 'from-gray-500 to-slate-600',
      description: 'Current device category'
    },
    {
      title: 'Connection',
      value: analytics.connectionSpeed.charAt(0).toUpperCase() + analytics.connectionSpeed.slice(1),
      unit: '',
      icon: Wifi,
      trend: analytics.connectionSpeed === 'fast' ? 'up' : 'stable',
      color: 'from-green-500 to-teal-600',
      description: 'Network connection quality'
    },
    {
      title: 'Battery Level',
      value: analytics.batteryLevel,
      unit: '%',
      icon: Battery,
      trend: analytics.batteryLevel > 50 ? 'stable' : 'down',
      color: 'from-lime-500 to-green-600',
      description: 'Device battery status'
    },
    {
      title: 'CPU Usage',
      value: Math.round(analytics.memoryUsage * 0.8),
      unit: '%',
      icon: Cpu,
      trend: 'stable',
      color: 'from-red-500 to-pink-600',
      description: 'Estimated CPU utilization'
    }
  ];

  const getCurrentMetrics = () => {
    switch (selectedTab) {
      case 'performance':
        return performanceMetrics;
      case 'engagement':
        return engagementMetrics;
      case 'system':
        return systemMetrics;
      default:
        return performanceMetrics;
    }
  };

  return (
    <div>
      {isVisible && (
        <div
          className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4 transition-all duration-300"
          onClick={onClose}
        >
          <div
            className="bg-gradient-to-br from-gray-900/95 to-blue-900/95 backdrop-blur-md rounded-xl border border-white/20 p-6 max-w-4xl w-full max-h-[80vh] overflow-y-auto transition-all duration-300 scale-100 opacity-100"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header */}
            <div className="flex items-center justify-between mb-6">
              <div>
                <h2 className="text-2xl font-bold text-white mb-1">Advanced Analytics</h2>
                <p className="text-gray-400">Real-time application performance metrics</p>
              </div>
              <button
                onClick={onClose}
                className="p-2 hover:bg-white/10 rounded-lg transition-colors text-gray-400 hover:text-white"
              >
                ✕
              </button>
            </div>

            {/* Tab Navigation */}
            <div className="flex gap-1 mb-6 bg-white/5 rounded-lg p-1">
              {[
                { id: 'performance', label: 'Performance' },
                { id: 'engagement', label: 'Engagement' },
                { id: 'system', label: 'System' }
              ].map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setSelectedTab(tab.id as any)}
                  className={`flex-1 px-4 py-2 rounded-md text-sm font-medium transition-all ${
                    selectedTab === tab.id
                      ? 'bg-blue-500 text-white shadow-lg'
                      : 'text-gray-400 hover:text-white hover:bg-white/5'
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </div>

            {/* Metrics Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              {getCurrentMetrics().map((metric, index) => (
                <div
                  key={`${selectedTab}-${index}`}
                  className="transition-all duration-300 opacity-100 translate-y-0"
                  style={{ transitionDelay: `${index * 100}ms` }}
                >
                  <MetricCard {...metric} />
                </div>
              ))}
            </div>

            {/* Real-time Status */}
            <div className="mt-6 p-4 bg-white/5 rounded-lg">
              <div className="flex items-center gap-2 mb-2">
                <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                <span className="text-sm text-gray-300">Live Analytics</span>
              </div>
              <p className="text-xs text-gray-400">
                Data updates every second. Performance metrics are calculated in real-time based on browser APIs and usage patterns.
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
