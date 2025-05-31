
import React, { useState } from 'react';
import { cn } from '@/lib/utils';
import { ChevronLeft, ChevronRight } from 'lucide-react';

interface AnimatedSidebarProps {
  children: React.ReactNode;
  className?: string;
}

export const AnimatedSidebar: React.FC<AnimatedSidebarProps> = ({ children, className }) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [isHovered, setIsHovered] = useState(false);

  const shouldBeExpanded = isExpanded || isHovered;

  return (
    <div
      className={cn(
        "fixed left-0 top-0 h-full bg-gradient-to-b from-slate-950 via-blue-950 to-indigo-950 transition-all duration-300 ease-in-out z-40 border-r border-blue-500/20",
        shouldBeExpanded ? "w-64" : "w-16",
        className
      )}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Toggle Button */}
      <button
        onClick={() => setIsExpanded(!isExpanded)}
        className="absolute -right-3 top-6 bg-blue-600 hover:bg-blue-700 text-white rounded-full p-1 shadow-lg transition-colors z-50"
      >
        {shouldBeExpanded ? (
          <ChevronLeft className="w-4 h-4" />
        ) : (
          <ChevronRight className="w-4 h-4" />
        )}
      </button>

      {/* Sidebar Content */}
      <div className="p-4 h-full overflow-y-auto">
        {children}
      </div>

      {/* Hover Indicator */}
      {!shouldBeExpanded && (
        <div className="absolute right-1 top-1/2 transform -translate-y-1/2 w-1 h-8 bg-blue-500 rounded-full opacity-50" />
      )}
    </div>
  );
};
