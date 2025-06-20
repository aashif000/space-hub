import React, { createContext, useContext, useEffect, useState, useCallback } from 'react';

interface ThemeContextType {
  theme: string;
  setTheme: (theme: string) => void;
  toggleTheme: () => void;
  mounted: boolean;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export function useTheme() {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
}

export const ThemeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [theme, setTheme] = useState('dark');
  const [mounted, setMounted] = useState(false);

  const toggleTheme = useCallback(() => {
    const newTheme = theme === 'dark' ? 'light' : 'dark';
    console.log('Theme toggle clicked:', theme, '->', newTheme);
    setTheme(newTheme);
  }, [theme]);useEffect(() => {
    // Get saved theme from localStorage or use system preference
    const savedTheme = localStorage.getItem('space-hub-theme');
    const root = document.documentElement;
    const body = document.body;
    
    console.log('ThemeProvider mount - savedTheme:', savedTheme);
    
    // First, ensure we remove any existing theme classes
    root.classList.remove('light', 'dark');
    body.classList.remove('light', 'dark');
    
    if (savedTheme && (savedTheme === 'dark' || savedTheme === 'light')) {
      // Use saved preference if available
      console.log('Using saved theme:', savedTheme);
      setTheme(savedTheme);
      root.classList.add(savedTheme);
      body.classList.add(savedTheme);
    } else {
      // Otherwise, detect system preference
      const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
      const newTheme = prefersDark ? 'dark' : 'light';
      console.log('System preference detected:', newTheme);
      setTheme(newTheme);
      root.classList.add(newTheme);
      body.classList.add(newTheme);
      
      // Save the detected preference
      localStorage.setItem('space-hub-theme', newTheme);
    }
    
    // Listen for system theme changes
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    const handleChange = (e: MediaQueryListEvent) => {
      // Only update if the user hasn't explicitly set a preference
      if (!localStorage.getItem('space-hub-theme')) {
        setTheme(e.matches ? 'dark' : 'light');
      }
    };
    
    // Add listener for theme changes
    mediaQuery.addEventListener('change', handleChange);
    
    setMounted(true);
    
    // Cleanup
    return () => {
      mediaQuery.removeEventListener('change', handleChange);
    };
  }, []);  useEffect(() => {
    if (mounted) {
      console.log('Theme changed to:', theme);
      // Save theme preference
      localStorage.setItem('space-hub-theme', theme);
      
      // Apply theme to document root AND body
      const root = document.documentElement;
      const body = document.body;
      
      // First remove all theme classes to avoid conflicts
      root.classList.remove('dark', 'light');
      body.classList.remove('dark', 'light');
      
      // Then add the current theme class
      root.classList.add(theme);
      body.classList.add(theme);
      
      console.log('Applied theme classes:', theme, 'to root and body');
      
      // Apply specific theme styles for better visibility and contrast
      if (theme === 'dark') {
        document.body.style.backgroundColor = 'rgb(15, 15, 25)';
        document.body.style.color = 'rgb(255, 255, 255)';
        // Add dark mode custom colors
        root.style.setProperty('--background-primary', 'rgb(15, 15, 25)');
        root.style.setProperty('--text-primary', 'rgb(255, 255, 255)');
        root.style.setProperty('--highlight-color', 'rgb(59, 130, 246)');
      } else {
        document.body.style.backgroundColor = 'rgb(248, 250, 252)';
        document.body.style.color = 'rgb(15, 23, 42)';
        // Add light mode custom colors
        root.style.setProperty('--background-primary', 'rgb(248, 250, 252)');
        root.style.setProperty('--text-primary', 'rgb(15, 23, 42)');
        root.style.setProperty('--highlight-color', 'rgb(37, 99, 235)');
      }
      
      // Force Tailwind theme to update by dispatching a custom event
      const themeChangeEvent = new CustomEvent('themechange', { detail: { theme } });
      window.dispatchEvent(themeChangeEvent);
      
      console.log('Theme application complete:', theme);
    }
  }, [theme, mounted]);
  const toggleTheme = () => {
    const newTheme = theme === 'dark' ? 'light' : 'dark';
    console.log('Theme toggle clicked:', theme, '->', newTheme);
    setTheme(newTheme);
  };

  // Always render children, but provide mounted state for conditional rendering
  return (
    <ThemeContext.Provider value={{ theme, setTheme, toggleTheme, mounted }}>
      {children}
    </ThemeContext.Provider>
  );
};
