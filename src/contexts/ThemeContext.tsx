import React, { createContext, useContext, useEffect, useState, useCallback } from 'react';

// Theme context type definition
interface ThemeContextType {
  theme: string;
  setTheme: (theme: string) => void;
  toggleTheme: () => void;
  mounted: boolean;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

// Hook to access theme context
export function useTheme() {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
}

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [theme, setTheme] = useState('dark');
  const [mounted, setMounted] = useState(false);

  // Initialize theme from localStorage or system preference
  useEffect(() => {
    const root = document.documentElement;
    const body = document.body;
    const savedTheme = localStorage.getItem('space-hub-theme');
    
    const applyTheme = (newTheme: string) => {
      setTheme(newTheme);
      root.classList.add(newTheme);
      body.classList.add(newTheme);
      localStorage.setItem('space-hub-theme', newTheme);
    };

    if (savedTheme === 'dark' || savedTheme === 'light') {
      applyTheme(savedTheme);
    } else {
      const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
      applyTheme(prefersDark ? 'dark' : 'light');
    }
    
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    const handleChange = (e: MediaQueryListEvent) => {
      if (!localStorage.getItem('space-hub-theme')) {
        applyTheme(e.matches ? 'dark' : 'light');
      }
    };
    
    mediaQuery.addEventListener('change', handleChange);
    setMounted(true);
    
    return () => mediaQuery.removeEventListener('change', handleChange);
  }, []);

  // Apply theme changes
  useEffect(() => {
    if (!mounted) return;

    const root = document.documentElement;
    const body = document.body;

    // Update theme classes
    root.classList.remove('dark', 'light');
    body.classList.remove('dark', 'light');
    root.classList.add(theme);
    body.classList.add(theme);    // Update CSS variables based on theme
    const themeColors = theme === 'dark' ? {
      background: 'rgb(15, 15, 25)',
      backgroundSecondary: 'rgb(20, 20, 30)',
      text: 'rgb(255, 255, 255)',
      textSecondary: 'rgb(200, 200, 200)',
      highlight: 'rgb(59, 130, 246)',
      accent: 'rgb(34, 197, 94)',
      primary: 'rgb(99, 102, 241)',
      secondary: 'rgb(168, 85, 247)',
      muted: 'rgb(156, 163, 175)',
      foreground: 'rgb(255, 255, 255)'
    } : {
      background: 'rgb(250, 252, 255)',
      backgroundSecondary: 'rgb(245, 248, 252)',
      text: 'rgb(15, 23, 42)',
      textSecondary: 'rgb(71, 85, 105)',
      highlight: 'rgb(37, 99, 235)',
      accent: 'rgb(22, 163, 74)',
      primary: 'rgb(79, 70, 229)',
      secondary: 'rgb(147, 51, 234)',
      muted: 'rgb(100, 116, 139)',
      foreground: 'rgb(51, 65, 85)'
    };

    // Apply theme colors
    document.body.style.backgroundColor = themeColors.background;
    document.body.style.color = themeColors.text;
    root.style.setProperty('--background-primary', themeColors.background);
    root.style.setProperty('--background-secondary', themeColors.backgroundSecondary);
    root.style.setProperty('--text-primary', themeColors.text);
    root.style.setProperty('--text-secondary', themeColors.textSecondary);
    root.style.setProperty('--highlight-color', themeColors.highlight);
    root.style.setProperty('--accent', themeColors.accent);
    root.style.setProperty('--primary', themeColors.primary);
    root.style.setProperty('--secondary', themeColors.secondary);
    root.style.setProperty('--muted', themeColors.muted);
    root.style.setProperty('--foreground', themeColors.foreground);

    // Persist theme preference
    localStorage.setItem('space-hub-theme', theme);
  }, [theme, mounted]);

  // Memoized theme toggle function
  const toggleTheme = useCallback(() => {
    setTheme(prevTheme => prevTheme === 'dark' ? 'light' : 'dark');
  }, []);

  return (
    <ThemeContext.Provider value={{ theme, setTheme, toggleTheme, mounted }}>
      {children}
    </ThemeContext.Provider>
  );
}
