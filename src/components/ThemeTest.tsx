import React, { useEffect } from 'react';
import { useTheme } from '../contexts/ThemeContext';
import { Card } from './ui/card';
import { Sun, Moon } from 'lucide-react';

export default function ThemeTest() {
  const { theme, toggleTheme } = useTheme();

  return (
    <div className="min-h-screen p-8 bg-white dark:bg-gray-950 transition-colors duration-300">
      <Card className="max-w-lg mx-auto p-6">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">
          Theme Test Component
        </h1>
        
        <div className="space-y-4">
          <div className="p-4 rounded-lg bg-gray-100 dark:bg-gray-800">
            <p className="text-gray-900 dark:text-white">
              Current Theme: <span className="font-bold">{theme}</span>
            </p>
          </div>

          <button
            onClick={toggleTheme}
            className="flex items-center gap-2 px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-lg transition-colors"
          >
            {theme === 'dark' ? (
              <>
                <Sun className="w-5 h-5" />
                Switch to Light Mode
              </>
            ) : (
              <>
                <Moon className="w-5 h-5" />
                Switch to Dark Mode
              </>
            )}
          </button>

          {/* Theme Color Test */}
          <div className="grid grid-cols-2 gap-4 mt-8">
            <div className="p-4 rounded-lg bg-gray-100 dark:bg-gray-800">
              <h3 className="font-semibold text-gray-900 dark:text-white mb-2">
                Background Colors
              </h3>
              <div className="space-y-2">
                <div className="h-8 rounded bg-white dark:bg-gray-950" />
                <div className="h-8 rounded bg-gray-100 dark:bg-gray-900" />
                <div className="h-8 rounded bg-gray-200 dark:bg-gray-800" />
              </div>
            </div>
            
            <div className="p-4 rounded-lg bg-gray-100 dark:bg-gray-800">
              <h3 className="font-semibold text-gray-900 dark:text-white mb-2">
                Text Colors
              </h3>
              <div className="space-y-2">
                <p className="text-gray-900 dark:text-white">Primary Text</p>
                <p className="text-gray-600 dark:text-gray-300">Secondary Text</p>
                <p className="text-gray-400 dark:text-gray-500">Muted Text</p>
              </div>
            </div>
          </div>

          {/* Interactive Elements Test */}
          <div className="p-4 rounded-lg bg-gray-100 dark:bg-gray-800">
            <h3 className="font-semibold text-gray-900 dark:text-white mb-4">
              Interactive Elements
            </h3>
            <div className="space-y-4">
              <button className="w-full px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-lg transition-colors">
                Primary Button
              </button>
              <button className="w-full px-4 py-2 bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 text-gray-900 dark:text-white rounded-lg transition-colors">
                Secondary Button
              </button>
              <div className="flex items-center gap-2">
                <input 
                  type="checkbox" 
                  className="rounded border-gray-300 dark:border-gray-600"
                />
                <span className="text-gray-900 dark:text-white">Checkbox</span>
              </div>
              <input 
                type="text" 
                placeholder="Text Input"
                className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
              />
            </div>
          </div>
        </div>
      </Card>
    </div>
  );
}
