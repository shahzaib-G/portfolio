import React, { useState, useEffect } from 'react';
import { Box, IconButton } from '@mui/material';
import { Menu as MenuIcon, Close } from '@mui/icons-material';
import { Link, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import API from '../utils/config';

const NAV = [
  { label: 'Home',         path: '/' },
  { label: 'About',        path: '/about' },
  { label: 'Experience',   path: '/experience' },
  { label: 'Certificates', path: '/certificates' },
];

const FH = "'Syne', sans-serif";
const FB = "'DM Sans', sans-serif";

export default function Header() {
  const location  = useLocation();
  const [drawer,   setDrawer]   = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [profile,  setProfile]  = useState(null);

  useEffect(() => {
    fetch(`${API}/profile`).then(r => r.json()).then(setProfile).catch(() => {});
  }, []);

  useEffect(() => {
    const fn = () => setScrolled(window.scrollY > 40);
    window.addEventListener('scroll', fn, { passive: true });
    return () => window.removeEventListener('scroll', fn);
  }, []);

  const name     = profile?.name || '';
  const initials = name.split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase() || 'P';

  return (
    <>
      <Box
        component="header"
        sx={{
          position: 'fixed', top: 0, left: 0, right: 0, zIndex: 1000,
          display: 'flex', alignItems: 'center', justifyContent: 'space-between',
          px: { xs: 3, md: 5 },
          py: scrolled ? 1.5 : 2.5,
          background: scrolled ? 'rgba(9,9,11,0.9)' : 'transparent',
          backdropFilter: scrolled ? 'blur(20px) saturate(160%)' : 'none',
          borderBottom: scrolled ? '1px solid rgba(255,255,255,0.05)' : 'none',
          transition: 'all 0.35s cubic-bezier(0.4,0,0.2,1)',
        }}
      >
        {/* Logo */}
        <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.6, ease: [0.23, 1, 0.32, 1] }}>
          <Link to="/" style={{ textDecoration: 'none' }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
              <Box sx={{
                width: 36, height: 36, borderRadius: '10px', flexShrink: 0,
                background: 'linear-gradient(135deg, #6d28d9, #22d3ee)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontFamily: FH, fontWeight: 800, fontSize: '0.82rem', color: '#fff',
                boxShadow: '0 0 20px rgba(109,40,217,0.45)',
              }}>
                {initials}
              </Box>
              {name && (
                <Box sx={{ fontFamily: FH, fontWeight: 700, fontSize: '1rem', color: '#f1f5f9', display: { xs: 'none', sm: 'block' }, letterSpacing: '-0.01em' }}>
                  {name.split(' ')[0]}
                </Box>
              )}
            </Box>
          </Link>
        </motion.div>

        {/* Center nav pill */}
        <Box sx={{
          display: { xs: 'none', md: 'flex' }, gap: 0.5, p: 0.75,
          borderRadius: '14px', background: 'rgba(255,255,255,0.04)',
          border: '1px solid rgba(255,255,255,0.06)', backdropFilter: 'blur(10px)',
        }}>
          {NAV.map((item, i) => {
            const active = location.pathname === item.path;
            return (
              <motion.div key={item.path} initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.07 + 0.2 }}>
                <Box
                  component={Link} to={item.path}
                  sx={{
                    display: 'block', px: 2.5, py: 0.85,
                    borderRadius: '10px', textDecoration: 'none',
                    fontFamily: FB, fontSize: '0.875rem',
                    fontWeight: active ? 600 : 400,
                    color: active ? '#f1f5f9' : '#94a3b8',
                    background: active ? 'rgba(139,92,246,0.18)' : 'transparent',
                    border: active ? '1px solid rgba(139,92,246,0.32)' : '1px solid transparent',
                    letterSpacing: '-0.01em',
                    transition: 'all 0.2s ease',
                    '&:hover': { color: '#f1f5f9', background: 'rgba(255,255,255,0.06)' },
                  }}
                >
                  {item.label}
                </Box>
              </motion.div>
            );
          })}
        </Box>

        {/* Right */}
        <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.6, delay: 0.3 }} style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <Box
            component={Link} to="/admin/login"
            sx={{
              display: { xs: 'none', md: 'block' }, px: 2.5, py: 0.85, borderRadius: '10px',
              textDecoration: 'none', fontFamily: FB, fontSize: '0.875rem', fontWeight: 400,
              color: '#475569', border: '1px solid rgba(255,255,255,0.06)',
              transition: 'all 0.2s ease',
              '&:hover': { color: '#94a3b8', borderColor: 'rgba(255,255,255,0.12)', background: 'rgba(255,255,255,0.03)' },
            }}
          >
            Admin
          </Box>
          <IconButton sx={{ display: { md: 'none' }, color: '#94a3b8', p: 1 }} onClick={() => setDrawer(true)}>
            <MenuIcon fontSize="small" />
          </IconButton>
        </motion.div>
      </Box>

      {/* Mobile full-screen drawer */}
      <AnimatePresence>
        {drawer && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.22 }}
            style={{ position: 'fixed', inset: 0, zIndex: 2000, background: 'rgba(9,9,11,0.97)', backdropFilter: 'blur(24px)' }}
          >
            <IconButton sx={{ position: 'absolute', top: 20, right: 20, color: '#475569' }} onClick={() => setDrawer(false)}>
              <Close />
            </IconButton>
            <Box sx={{ position: 'absolute', top: 22, left: 24, display: 'flex', alignItems: 'center', gap: 1.5 }}>
              <Box sx={{ width: 36, height: 36, borderRadius: '10px', background: 'linear-gradient(135deg,#6d28d9,#22d3ee)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: FH, fontWeight: 800, fontSize: '0.82rem', color: '#fff' }}>
                {initials}
              </Box>
            </Box>
            <Box sx={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', height: '100%', px: { xs: 6, sm: 10 } }}>
              {NAV.map((item, i) => (
                <motion.div key={item.path} initial={{ opacity: 0, x: -40 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.09, ease: [0.23, 1, 0.32, 1] }}>
                  <Box
                    component={Link} to={item.path}
                    onClick={() => setDrawer(false)}
                    sx={{
                      display: 'flex', alignItems: 'center', gap: 2,
                      textDecoration: 'none', py: 2.5,
                      borderBottom: '1px solid rgba(255,255,255,0.05)',
                      '&:hover .lbl': { color: '#8b5cf6' },
                    }}
                  >
                    <Box sx={{ fontFamily: FH, fontSize: '0.7rem', fontWeight: 700, color: '#2e2e40', letterSpacing: '0.1em', minWidth: 28 }}>0{i + 1}</Box>
                    <Box className="lbl" sx={{
                      fontFamily: FH, fontWeight: 700, fontSize: { xs: '2rem', sm: '2.8rem' }, letterSpacing: '-0.03em',
                      color: location.pathname === item.path ? '#8b5cf6' : '#f1f5f9', transition: 'color 0.2s',
                    }}>
                      {item.label}
                    </Box>
                  </Box>
                </motion.div>
              ))}
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.5 }}>
                <Box component={Link} to="/admin/login" onClick={() => setDrawer(false)}
                  sx={{ display: 'inline-block', mt: 4, textDecoration: 'none', fontFamily: FB, fontSize: '0.85rem', color: '#475569', '&:hover': { color: '#64748b' } }}>
                  Admin Panel →
                </Box>
              </motion.div>
            </Box>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
