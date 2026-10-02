import React, { useMemo } from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import { ThemeProvider, createTheme, CssBaseline } from '@mui/material';
import { AuthProvider } from './context/AuthContext';
import { ThemeModeProvider, useThemeMode } from './context/ThemeContext';
import App from './App';

const buildTheme = (mode) => createTheme({
  palette: {
    mode,
    primary:    { main: mode === 'light' ? '#4f46e5' : '#818cf8' },
    secondary:  { main: mode === 'light' ? '#0891b2' : '#22d3ee' },
    background: {
      default: mode === 'light' ? '#f8fafc' : '#0f172a',
      paper:   mode === 'light' ? '#ffffff'  : '#1e293b',
    },
    text: {
      primary:   mode === 'light' ? '#0f172a' : '#f1f5f9',
      secondary: mode === 'light' ? '#64748b' : '#94a3b8',
    },
    divider: mode === 'light' ? '#e2e8f0' : 'rgba(255,255,255,0.07)',
    success: { main: mode === 'light' ? '#16a34a' : '#4ade80' },
  },
  typography: {
    fontFamily: "'Inter', system-ui, sans-serif",
    h1: { fontFamily: "'Plus Jakarta Sans', system-ui, sans-serif" },
    h2: { fontFamily: "'Plus Jakarta Sans', system-ui, sans-serif" },
    h3: { fontFamily: "'Plus Jakarta Sans', system-ui, sans-serif" },
    h4: { fontFamily: "'Plus Jakarta Sans', system-ui, sans-serif" },
    h5: { fontFamily: "'Plus Jakarta Sans', system-ui, sans-serif" },
  },
  shape: { borderRadius: 12 },
  components: {
    MuiCssBaseline: {
      styleOverrides: {
        body: {
          backgroundColor: mode === 'light' ? '#f8fafc' : '#0f172a',
          transition: 'background-color 0.3s ease, color 0.3s ease',
        },
      },
    },
    MuiPaper: {
      defaultProps: { elevation: 0 },
      styleOverrides: { root: { backgroundImage: 'none' } },
    },
    MuiChip: {
      styleOverrides: { root: { fontFamily: "'Inter', system-ui, sans-serif" } },
    },
  },
});

function ThemedApp() {
  const { mode } = useThemeMode();
  const theme = useMemo(() => buildTheme(mode), [mode]);
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <AuthProvider>
        <App />
      </AuthProvider>
    </ThemeProvider>
  );
}

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <BrowserRouter>
    <ThemeModeProvider>
      <ThemedApp />
    </ThemeModeProvider>
  </BrowserRouter>
);
