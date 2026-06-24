/**
 * Theme Context for OTA (Over-The-Air) runtime theming
 * Provides dynamic theme injection from server payload or campaign configs
 */

import React, { createContext, useContext, useState, ReactNode } from 'react';
import { ThemeConfig } from '../types/components';

interface ThemeContextValue {
  theme: ThemeConfig;
  setTheme: (theme: ThemeConfig) => void;
  mergeTheme: (partialTheme: Partial<ThemeConfig>) => void;
}

const defaultTheme: ThemeConfig = {
  primary: '#007AFF',
  background: '#FFFFFF',
};

const ThemeContext = createContext<ThemeContextValue | undefined>(undefined);

interface ThemeProviderProps {
  children: ReactNode;
  initialTheme?: ThemeConfig;
}

export const ThemeProvider: React.FC<ThemeProviderProps> = ({ 
  children, 
  initialTheme = defaultTheme 
}) => {
  const [theme, setTheme] = useState<ThemeConfig>(initialTheme);

  const mergeTheme = (partialTheme: Partial<ThemeConfig>) => {
    setTheme(prev => ({ ...prev, ...partialTheme }));
  };

  return (
    <ThemeContext.Provider value={{ theme, setTheme, mergeTheme }}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = (): ThemeContextValue => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within ThemeProvider');
  }
  return context;
};
