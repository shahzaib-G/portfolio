import React, { useState, useEffect } from 'react';
import { Box, IconButton, useTheme } from '@mui/material';
import { Menu as MenuIcon, Close, LightMode, DarkMode } from '@mui/icons-material';
import { Link, useLocation } from 'react-router-dom';
import { useThemeMode } from '../context/ThemeContext';
import API from '../utils/config';

const NAV = [
  { label: 'Home',         path: '/' },
  { label: 'About',        path: '/about' },
  { label: 'Experience',   path: '/experience' },
  { label: 'Certificates', path: '/certificates' },
];

const FH = "'Plus Jakarta Sans', sans-serif";
const FB = "'Inter', sans-serif";

export default function Header() {
  const location       = useLocation();
  const theme          = useTheme();
  const { mode, toggleMode } = useThemeMode();
  const [drawer, setDrawer]   = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [profile, setProfile]   = useState(null);
  const isLight = theme.palette.mode === 'light';

  useEffect(() => {
    fetch(`${API}/profile`).then(r => r.json()).then(setProfile).catch(() => {});
  }, []);

  useEffect(() => {
    const fn = () => setScrolled(window.scrollY > 40);
    window.addEventListener('scroll', fn, { passive: true });
    return () => window.removeEventListener('scroll', fn);
  }, []);

  useEffect(() => {
    if (drawer) document.body.style.overflow = 'hidden';
    else document.body.style.overflow = '';
    return () => { document.body.style.overflow = ''; };
  }, [drawer]);

  const name     = profile?.name || '';
  const initials = name.split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase() || 'P';

  const scrollBg    = isLight ? 'rgba(248,250,252,0.9)' : 'rgba(15,23,42,0.9)';
  const scrollBorder = isLight ? '#e2e8f0' : 'rgba(255,255,255,0.06)';
  const pillBg       = isLight ? 'rgba(0,0,0,0.03)' : 'rgba(255,255,255,0.04)';
  const pillBorder   = isLight ? '#e2e8f0' : 'rgba(255,255,255,0.06)';
  const accent       = isLight ? '#4f46e5' : '#818cf8';
  const activeNavBg  = isLight ? 'rgba(79,70,229,0.08)' : 'rgba(129,140,248,0.12)';
  const activeNavBdr = isLight ? 'rgba(79,70,229,0.22)' : 'rgba(129,140,248,0.28)';

  return (
    <>
      <Box
        component="header"
        sx={{
          position: 'fixed', top: 0, left: 0, right: 0, zIndex: 1000,
          display: 'flex', alignItems: 'center', justifyContent: 'space-between',
          px: { xs: 3, md: 5 },
          py: scrolled ? 1.5 : 2.5,
          background: scrolled ? scrollBg : 'transparent',
          backdropFilter: scrolled ? 'blur(16px) saturate(160%)' : 'none',
          borderBottom: `1px solid ${scrolled ? scrollBorder : 'transparent'}`,
          transition: 'all 0.3s ease',
        }}
      >
        {/* Logo */}
        <Link to="/" style={{ textDecoration: 'none' }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
            <Box sx={{
              width: 36, height: 36, borderRadius: '10px', flexShrink: 0,
              background: 'linear-gradient(135deg, #4f46e5, #0891b2)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontFamily: FH, fontWeight: 800, fontSize: '0.82rem', color: '#fff',
            }}>
              {initials}
            </Box>
            {name && (
              <Box sx={{
                fontFamily: FH, fontWeight: 700, fontSize: '1rem',
                color: theme.palette.text.primary,
                display: { xs: 'none', sm: 'block' },
                letterSpacing: '-0.01em',
                transition: 'color 0.3s ease',
              }}>
                {name.split(' ')[0]}
              </Box>
            )}
          </Box>
        </Link>

        {/* Center nav pill */}
        <Box sx={{
          display: { xs: 'none', md: 'flex' }, gap: 0.5, p: 0.75,
          borderRadius: '14px', background: pillBg,
          border: `1px solid ${pillBorder}`,
        }}>
          {NAV.map((item) => {
            const active = location.pathname === item.path;
            return (
              <Box
                key={item.path}
                component={Link} to={item.path}
                sx={{
                  display: 'block', px: 2.5, py: 0.85,
                  borderRadius: '10px', textDecoration: 'none',
                  fontFamily: FB, fontSize: '0.875rem',
                  fontWeight: active ? 600 : 400,
                  color: active ? accent : theme.palette.text.secondary,
                  background: active ? activeNavBg : 'transparent',
                  border: active ? `1px solid ${activeNavBdr}` : '1px solid transparent',
                  transition: 'all 0.2s ease',
                  '&:hover': {
                    color: theme.palette.text.primary,
                    background: isLight ? 'rgba(0,0,0,0.04)' : 'rgba(255,255,255,0.06)',
                  },
                }}
              >
                {item.label}
              </Box>
            );
          })}
        </Box>

        {/* Right: theme toggle + admin + mobile menu */}
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <IconButton
            onClick={toggleMode}
            size="small"
            title={mode === 'light' ? 'Switch to dark mode' : 'Switch to light mode'}
            sx={{
              color: theme.palette.text.secondary,
              border: `1px solid ${pillBorder}`,
              borderRadius: '10px', p: 0.9,
              background: pillBg,
              transition: 'all 0.2s ease',
              '&:hover': {
                color: theme.palette.text.primary,
                background: isLight ? 'rgba(0,0,0,0.06)' : 'rgba(255,255,255,0.08)',
              },
            }}
          >
            {mode === 'light' ? <DarkMode sx={{ fontSize: 17 }} /> : <LightMode sx={{ fontSize: 17 }} />}
          </IconButton>

          <Box
            component={Link} to="/admin/login"
            sx={{
              display: { xs: 'none', md: 'block' },
              px: 2.5, py: 0.85, borderRadius: '10px',
              textDecoration: 'none', fontFamily: FB, fontSize: '0.875rem', fontWeight: 400,
              color: theme.palette.text.secondary,
              border: `1px solid ${pillBorder}`,
              transition: 'all 0.2s ease',
              '&:hover': {
                color: theme.palette.text.primary,
                background: isLight ? 'rgba(0,0,0,0.04)' : 'rgba(255,255,255,0.04)',
              },
            }}
          >
            Admin
          </Box>

          <IconButton
            sx={{ display: { md: 'none' }, color: theme.palette.text.secondary, p: 1 }}
            onClick={() => setDrawer(true)}
          >
            <MenuIcon fontSize="small" />
          </IconButton>
        </Box>
      </Box>

      {/* Mobile full-screen drawer */}
      {drawer && (
        <Box
          sx={{
            position: 'fixed', inset: 0, zIndex: 2000,
            background: isLight ? 'rgba(248,250,252,0.98)' : 'rgba(15,23,42,0.98)',
            backdropFilter: 'blur(24px)',
          }}
        >
          <IconButton
            sx={{ position: 'absolute', top: 20, right: 20, color: theme.palette.text.secondary }}
            onClick={() => setDrawer(false)}
          >
            <Close />
          </IconButton>
          <Box sx={{ position: 'absolute', top: 22, left: 24, display: 'flex', alignItems: 'center', gap: 1.5 }}>
            <Box sx={{
              width: 36, height: 36, borderRadius: '10px',
              background: 'linear-gradient(135deg,#4f46e5,#0891b2)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontFamily: FH, fontWeight: 800, fontSize: '0.82rem', color: '#fff',
            }}>
              {initials}
            </Box>
          </Box>
          <Box sx={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', height: '100%', px: { xs: 6, sm: 10 } }}>
            {NAV.map((item, i) => (
              <Box
                key={item.path}
                component={Link} to={item.path}
                onClick={() => setDrawer(false)}
                sx={{
                  display: 'flex', alignItems: 'center', gap: 2,
                  textDecoration: 'none', py: 2.5,
                  borderBottom: `1px solid ${isLight ? '#e2e8f0' : 'rgba(255,255,255,0.05)'}`,
                  '&:hover .nav-label': { color: accent },
                }}
              >
                <Box sx={{
                  fontFamily: FH, fontSize: '0.7rem', fontWeight: 700,
                  color: theme.palette.text.secondary, letterSpacing: '0.1em', minWidth: 28,
                }}>
                  0{i + 1}
                </Box>
                <Box className="nav-label" sx={{
                  fontFamily: FH, fontWeight: 700,
                  fontSize: { xs: '2rem', sm: '2.8rem' },
                  letterSpacing: '-0.03em',
                  color: location.pathname === item.path ? accent : theme.palette.text.primary,
                  transition: 'color 0.2s',
                }}>
                  {item.label}
                </Box>
              </Box>
            ))}
            <Box sx={{ mt: 4, display: 'flex', alignItems: 'center', gap: 2 }}>
              <Box
                component={Link} to="/admin/login"
                onClick={() => setDrawer(false)}
                sx={{
                  textDecoration: 'none', fontFamily: FB, fontSize: '0.85rem',
                  color: theme.palette.text.secondary,
                  '&:hover': { color: theme.palette.text.primary },
                }}
              >
                Admin Panel →
              </Box>
              <Box
                component="button"
                onClick={toggleMode}
                sx={{
                  display: 'flex', alignItems: 'center', gap: 1,
                  background: 'none', border: `1px solid ${isLight ? '#e2e8f0' : 'rgba(255,255,255,0.1)'}`,
                  borderRadius: '8px', px: 1.5, py: 0.75, cursor: 'pointer',
                  color: theme.palette.text.secondary, fontFamily: FB, fontSize: '0.82rem',
                }}
              >
                {mode === 'light' ? <DarkMode sx={{ fontSize: 15 }} /> : <LightMode sx={{ fontSize: 15 }} />}
                {mode === 'light' ? 'Dark' : 'Light'}
              </Box>
            </Box>
          </Box>
        </Box>
      )}
    </>
  );
}
