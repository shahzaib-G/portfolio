import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import { ThemeProvider, createTheme } from '@mui/material';
import { AuthProvider } from './context/AuthContext';
import App from './App';

const theme = createTheme({
  palette: {
    mode: 'dark',
    primary:    { main: '#8b5cf6' },
    secondary:  { main: '#22d3ee' },
    background: { default: '#09090b', paper: 'rgba(17,17,22,0.8)' },
    text:       { primary: '#f1f5f9', secondary: '#94a3b8' },
  },
  typography: {
    fontFamily: "'DM Sans', sans-serif",
    h1: { fontFamily: "'Syne', sans-serif" },
    h2: { fontFamily: "'Syne', sans-serif" },
    h3: { fontFamily: "'Syne', sans-serif" },
    h4: { fontFamily: "'Syne', sans-serif" },
    h5: { fontFamily: "'Syne', sans-serif" },
  },
  shape: { borderRadius: 12 },
  components: {
    MuiCssBaseline: { styleOverrides: { body: { background: '#09090b' } } },
    MuiChip: {
      styleOverrides: {
        root: { fontFamily: "'DM Sans', sans-serif" },
      },
    },
  },
});

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <BrowserRouter>
    <ThemeProvider theme={theme}>
      <AuthProvider>
        <App />
      </AuthProvider>
    </ThemeProvider>
  </BrowserRouter>
);
