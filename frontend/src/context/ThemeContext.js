import React, { createContext, useContext, useState, useMemo } from 'react';

const ThemeCtx = createContext({ mode: 'light', toggleMode: () => {} });

export const ThemeModeProvider = ({ children }) => {
  const [mode, setMode] = useState(() => {
    try { return localStorage.getItem('portfolio-theme') || 'light'; }
    catch { return 'light'; }
  });

  const toggleMode = () => {
    const next = mode === 'light' ? 'dark' : 'light';
    setMode(next);
    try { localStorage.setItem('portfolio-theme', next); } catch {}
  };

  const value = useMemo(() => ({ mode, toggleMode }), [mode]);
  return <ThemeCtx.Provider value={value}>{children}</ThemeCtx.Provider>;
};

export const useThemeMode = () => useContext(ThemeCtx);
