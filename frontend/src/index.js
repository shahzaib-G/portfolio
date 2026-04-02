import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import { ThemeProvider, createTheme } from '@mui/material';
import { AuthProvider } from './context/AuthContext';
import App from './App';

const theme = createTheme({
  palette: {
    mode: 'dark',
    primary:   { main: '#7c5cff' },
    secondary: { main: '#00d4ff' },
    background: { default: '#0a0f1e', paper: 'rgba(255,255,255,0.03)' },
  },
  typography: {
    fontFamily: "'Space Grotesk', sans-serif",
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
