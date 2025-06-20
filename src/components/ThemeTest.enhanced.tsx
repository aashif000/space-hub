import React, { useEffect, useState } from 'react';
import { useTheme } from '../contexts/ThemeContext';
import { Sun, Moon, CheckCircle, XCircle } from 'lucide-react';

export default function ThemeTest() {
  const { theme, toggleTheme, mounted } = useTheme();
  const [domClasses, setDomClasses] = useState({
    html: '',
    body: ''
  });

  // Monitor DOM classes in real-time
  useEffect(() => {
    const updateClasses = () => {
      setDomClasses({
        html: document.documentElement.className,
        body: document.body.className
      });
    };

    updateClasses();
    const interval = setInterval(updateClasses, 100);
    
    return () => clearInterval(interval);
  }, []);

  if (!mounted) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-lg">Loading theme...</div>
      </div>
    );
  }

  const isThemeWorking = domClasses.html.includes(theme) && domClasses.body.includes(theme);

  return (
    <div className={`min-h-screen p-8 transition-all duration-300 ${
      theme === 'dark' 
        ? 'bg-gray-900 text-white' 
        : 'bg-gray-100 text-gray-900'
    }`}>
      <div className="max-w-4xl mx-auto space-y-8">
        <div className="text-center">
          <h1 className="text-4xl font-bold mb-4">🌓 Theme Diagnostic Center</h1>
          <div className={`inline-flex items-center gap-2 px-4 py-2 rounded-full ${
            isThemeWorking 
              ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
              : 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200'
          }`}>
            {isThemeWorking ? <CheckCircle className="w-5 h-5" /> : <XCircle className="w-5 h-5" />}
            Theme Status: {isThemeWorking ? 'Working' : 'Issue Detected'}
          </div>
        </div>
        
        <div className={`p-6 rounded-lg border ${
          theme === 'dark'
            ? 'bg-gray-800 border-gray-700'
            : 'bg-white border-gray-300'
        }`}>
          <h2 className="text-2xl font-semibold mb-6 text-center">Current Theme Status</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
            <div className="space-y-3">
              <h3 className="text-lg font-medium">React State</h3>
              <div className="space-y-2 font-mono text-sm">
                <div><strong>Theme:</strong> <span className="px-2 py-1 bg-blue-100 dark:bg-blue-900 rounded">{theme}</span></div>
                <div><strong>Mounted:</strong> <span className="px-2 py-1 bg-blue-100 dark:bg-blue-900 rounded">{mounted.toString()}</span></div>
              </div>
            </div>
            
            <div className="space-y-3">
              <h3 className="text-lg font-medium">DOM State</h3>
              <div className="space-y-2 font-mono text-sm">
                <div><strong>HTML class:</strong> <span className="px-2 py-1 bg-blue-100 dark:bg-blue-900 rounded">{domClasses.html || 'none'}</span></div>
                <div><strong>Body class:</strong> <span className="px-2 py-1 bg-blue-100 dark:bg-blue-900 rounded">{domClasses.body || 'none'}</span></div>
              </div>
            </div>
          </div>
          
          <div className="text-center">
            <button
              onClick={toggleTheme}
              className={`flex items-center gap-3 px-8 py-4 rounded-lg font-medium transition-all duration-200 mx-auto text-lg ${
                theme === 'dark'
                  ? 'bg-blue-600 hover:bg-blue-700 text-white shadow-lg hover:shadow-xl'
                  : 'bg-blue-500 hover:bg-blue-600 text-white shadow-lg hover:shadow-xl'
              }`}
            >
              {theme === 'dark' ? (
                <>
                  <Sun className="w-6 h-6" />
                  Switch to Light Mode
                </>
              ) : (
                <>
                  <Moon className="w-6 h-6" />
                  Switch to Dark Mode
                </>
              )}
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className={`p-6 rounded-lg ${
            theme === 'dark'
              ? 'bg-gray-800 text-gray-300 border border-gray-700'
              : 'bg-white text-gray-600 border border-gray-200'
          }`}>
            <h3 className="text-lg font-semibold mb-4">Visual Test Elements</h3>
            
            <div className="space-y-4">
              <div className={`p-4 rounded border ${
                theme === 'dark'
                  ? 'bg-gray-700 border-gray-600'
                  : 'bg-gray-50 border-gray-200'
              }`}>
                <h4 className="font-medium mb-2">Standard Card</h4>
                <p className="text-sm">This card adapts to the current theme</p>
              </div>
              
              <div className={`p-4 rounded border ${
                theme === 'dark'
                  ? 'bg-blue-900 border-blue-700 text-blue-100'
                  : 'bg-blue-50 border-blue-200 text-blue-900'
              }`}>
                <h4 className="font-medium mb-2">Colored Card</h4>
                <p className="text-sm">This card has theme-aware colors</p>
              </div>
            </div>
          </div>
          
          <div className={`p-6 rounded-lg ${
            theme === 'dark'
              ? 'bg-gray-800 border border-gray-700'
              : 'bg-white border border-gray-200'
          }`}>
            <h3 className="text-lg font-semibold mb-4">Direct DOM Control</h3>
            <div className="space-y-3">
              <button
                onClick={() => {
                  document.documentElement.classList.remove('light');
                  document.documentElement.classList.add('dark');
                  document.body.classList.remove('light');
                  document.body.classList.add('dark');
                }}
                className="w-full px-4 py-2 bg-gray-800 text-white rounded hover:bg-gray-700 transition-colors"
              >
                🌙 Force Dark Theme
              </button>
              <button
                onClick={() => {
                  document.documentElement.classList.remove('dark');
                  document.documentElement.classList.add('light');
                  document.body.classList.remove('dark');
                  document.body.classList.add('light');
                }}
                className="w-full px-4 py-2 bg-gray-200 text-gray-800 rounded hover:bg-gray-300 transition-colors"
              >
                ☀️ Force Light Theme
              </button>
            </div>
          </div>
        </div>

        <div className={`p-6 rounded-lg ${
          theme === 'dark'
            ? 'bg-gray-800 border border-gray-700'
            : 'bg-white border border-gray-200'
        }`}>
          <h3 className="text-lg font-semibold mb-4">CSS Variables Test</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm font-mono">
            <div>
              <div className="font-medium mb-2">Background Primary:</div>
              <div className="px-3 py-2 bg-gray-200 dark:bg-gray-700 rounded">
                {getComputedStyle(document.documentElement).getPropertyValue('--background-primary') || 'not set'}
              </div>
            </div>
            <div>
              <div className="font-medium mb-2">Text Primary:</div>
              <div className="px-3 py-2 bg-gray-200 dark:bg-gray-700 rounded">
                {getComputedStyle(document.documentElement).getPropertyValue('--text-primary') || 'not set'}
              </div>
            </div>
            <div>
              <div className="font-medium mb-2">Highlight Color:</div>
              <div className="px-3 py-2 bg-gray-200 dark:bg-gray-700 rounded">
                {getComputedStyle(document.documentElement).getPropertyValue('--highlight-color') || 'not set'}
              </div>
            </div>
          </div>
        </div>

        <div className={`p-4 rounded-lg text-center ${
          theme === 'dark'
            ? 'bg-gray-800 border border-gray-700'
            : 'bg-white border border-gray-200'
        }`}>
          <div className="text-sm text-gray-500 dark:text-gray-400">
            LocalStorage: <span className="font-mono px-2 py-1 bg-gray-200 dark:bg-gray-700 rounded">{localStorage.getItem('space-hub-theme') || 'not set'}</span>
          </div>
        </div>
      </div>
    </div>
  );
}
