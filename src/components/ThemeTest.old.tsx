import React from 'react';
import { useTheme } from '../contexts/ThemeContext';
import { Sun, Moon } from 'lucide-react';

export default function ThemeTest() {
  const { theme, toggleTheme, mounted } = useTheme();

  if (!mounted) {
    return <div>Loading theme...</div>;
  }

  return (
    <div className={`min-h-screen p-8 transition-all duration-300 ${
      theme === 'dark' 
        ? 'bg-gray-900 text-white' 
        : 'bg-gray-100 text-gray-900'
    }`}>
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold mb-8">Theme Test Component</h1>
        
        <div className={`p-6 rounded-lg border ${
          theme === 'dark'
            ? 'bg-gray-800 border-gray-700'
            : 'bg-white border-gray-300'
        }`}>
          <h2 className="text-xl font-semibold mb-4">Current Theme Status</h2>
          
          <div className="space-y-2 mb-6">
            <p><strong>Theme:</strong> {theme}</p>
            <p><strong>Mounted:</strong> {mounted.toString()}</p>
            <p><strong>HTML class:</strong> {document.documentElement.className}</p>
            <p><strong>Body class:</strong> {document.body.className}</p>
            <p><strong>LocalStorage:</strong> {localStorage.getItem('space-hub-theme') || 'not set'}</p>
          </div>
          
          <button
            onClick={() => {
              console.log('Toggle button clicked, current theme:', theme);
              toggleTheme();
            }}
            className={`flex items-center gap-2 px-6 py-3 rounded-lg font-medium transition-all duration-200 ${
              theme === 'dark'
                ? 'bg-blue-600 hover:bg-blue-700 text-white'
                : 'bg-blue-500 hover:bg-blue-600 text-white'
            }`}
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
        </div>

        <div className={`mt-8 p-6 rounded-lg ${
          theme === 'dark'
            ? 'bg-gray-800 text-gray-300'
            : 'bg-white text-gray-600'
        }`}>
          <h3 className="text-lg font-semibold mb-4">Test Elements</h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className={`p-4 rounded border ${
              theme === 'dark'
                ? 'bg-gray-700 border-gray-600'
                : 'bg-gray-50 border-gray-200'
            }`}>
              <h4 className="font-medium mb-2">Card Example</h4>
              <p className="text-sm">This card should adapt to the theme</p>
            </div>
            
            <div className={`p-4 rounded border ${
              theme === 'dark'
                ? 'bg-blue-900 border-blue-700 text-blue-100'
                : 'bg-blue-50 border-blue-200 text-blue-900'
            }`}>
              <h4 className="font-medium mb-2">Colored Card</h4>
              <p className="text-sm">This card has theme-aware colors</p>
            </div>
          </div>        </div>

        <div className="mt-8">
          <h3 className="text-lg font-semibold mb-4">Direct DOM Manipulation Test</h3>
          <div className="space-y-4">
            <button
              onClick={() => {
                document.documentElement.classList.remove('light');
                document.documentElement.classList.add('dark');
                document.body.classList.remove('light');
                document.body.classList.add('dark');
                console.log('Force applied dark theme');
              }}
              className="px-4 py-2 bg-gray-800 text-white rounded mr-4"
            >
              Force Dark
            </button>
            <button
              onClick={() => {
                document.documentElement.classList.remove('dark');
                document.documentElement.classList.add('light');
                document.body.classList.remove('dark');
                document.body.classList.add('light');
                console.log('Force applied light theme');
              }}
              className="px-4 py-2 bg-gray-200 text-gray-800 rounded"
            >
              Force Light
            </button>
          </div>
        </div>

        <div className="mt-8">
          <h3 className="text-lg font-semibold mb-4">CSS Custom Properties Test</h3>
          <div className="space-y-2 text-sm font-mono">
            <div>--background-primary: <span className="px-2 py-1 bg-gray-200 dark:bg-gray-700 rounded">{getComputedStyle(document.documentElement).getPropertyValue('--background-primary')}</span></div>
            <div>--text-primary: <span className="px-2 py-1 bg-gray-200 dark:bg-gray-700 rounded">{getComputedStyle(document.documentElement).getPropertyValue('--text-primary')}</span></div>
            <div>--highlight-color: <span className="px-2 py-1 bg-gray-200 dark:bg-gray-700 rounded">{getComputedStyle(document.documentElement).getPropertyValue('--highlight-color')}</span></div>
          </div>
        </div>
      </div>
    </div>
  );
}
