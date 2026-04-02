import React, { useState, useEffect } from 'react';
import { AppBar, Toolbar, Box, Button, IconButton, Drawer, List, ListItem, ListItemText, useScrollTrigger } from '@mui/material';
import { Menu as MenuIcon, Close } from '@mui/icons-material';
import { Link, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import API from '../utils/config';

const NAV = [
  { label: 'Home',         path: '/' },
  { label: 'About',        path: '/about' },
  { label: 'Experience',   path: '/experience' },
  { label: 'Certificates', path: '/certificates' },
];

export default function Header() {
  const location = useLocation();
  const [drawer, setDrawer] = useState(false);
  const [profile, setProfile] = useState(null);
  const trigger = useScrollTrigger({ disableHysteresis: true, threshold: 50 });

  useEffect(() => {
    fetch(`${API}/profile`).then(r => r.json()).then(d => setProfile(d)).catch(() => {});
  }, []);

  const name = profile?.name || '';

  return (
    <>
      <AppBar position="fixed" elevation={0} sx={{
        background: trigger ? 'rgba(10,15,30,0.95)' : 'transparent',
        backdropFilter: trigger ? 'blur(20px)' : 'none',
        borderBottom: trigger ? '1px solid rgba(124,92,255,0.15)' : 'none',
        transition: 'all 0.4s ease',
      }}>
        <Toolbar sx={{ justifyContent: 'space-between', py: 1 }}>
          {/* Logo */}
          <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.6 }}>
            <Link to="/" style={{ textDecoration: 'none' }}>
              <Box sx={{
                fontFamily: "'Orbitron', sans-serif", fontWeight: 900, fontSize: '1.4rem',
                background: 'linear-gradient(135deg, #7c5cff, #00d4ff)', WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent', letterSpacing: '0.1em',
              }}>
                {name ? name.split(' ')[0].toUpperCase() : 'PORTFOLIO'}
              </Box>
            </Link>
          </motion.div>

          {/* Desktop nav */}
          <Box sx={{ display: { xs: 'none', md: 'flex' }, gap: 0.5 }}>
            {NAV.map((item, i) => (
              <motion.div key={item.path} initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.1 + 0.3 }}>
                <Button component={Link} to={item.path} sx={{
                  color: location.pathname === item.path ? '#00d4ff' : 'rgba(224,230,255,0.8)',
                  fontFamily: "'Space Grotesk', sans-serif", fontWeight: 600, fontSize: '0.88rem',
                  px: 2.5, py: 1, borderRadius: '10px', textTransform: 'none', letterSpacing: '0.05em',
                  position: 'relative', overflow: 'hidden',
                  '&::after': location.pathname === item.path ? {
                    content: '""', position: 'absolute', bottom: 4, left: '50%', transform: 'translateX(-50%)',
                    width: '20px', height: '2px', background: 'linear-gradient(90deg,#7c5cff,#00d4ff)', borderRadius: '2px',
                  } : {},
                  '&:hover': { color: '#fff', background: 'rgba(124,92,255,0.12)' },
                }}>{item.label}</Button>
              </motion.div>
            ))}
            <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.7 }}>
              <Button component={Link} to="/admin/login" sx={{
                ml: 1, px: 3, py: 1, borderRadius: '10px', textTransform: 'none', fontWeight: 700, fontSize: '0.85rem',
                background: 'linear-gradient(135deg, rgba(124,92,255,0.2), rgba(0,212,255,0.1))',
                border: '1px solid rgba(124,92,255,0.4)', color: '#a78bfa',
                '&:hover': { background: 'linear-gradient(135deg,#7c5cff,#00d4ff)', color:'#fff', border:'1px solid transparent' },
                transition: 'all 0.3s',
              }}>Admin</Button>
            </motion.div>
          </Box>

          {/* Mobile menu button */}
          <IconButton sx={{ display: { md: 'none' }, color: '#a78bfa' }} onClick={() => setDrawer(true)}>
            <MenuIcon />
          </IconButton>
        </Toolbar>
      </AppBar>

      {/* Mobile Drawer */}
      <Drawer anchor="right" open={drawer} onClose={() => setDrawer(false)} PaperProps={{
        sx: { width: 260, background: 'rgba(10,15,30,0.98)', backdropFilter: 'blur(20px)', borderLeft: '1px solid rgba(124,92,255,0.2)' }
      }}>
        <Box sx={{ p: 2, display: 'flex', justifyContent: 'flex-end' }}>
          <IconButton onClick={() => setDrawer(false)} sx={{ color: '#a78bfa' }}><Close /></IconButton>
        </Box>
        <List>
          {[...NAV, { label: 'Admin', path: '/admin/login' }].map(item => (
            <ListItem key={item.path} component={Link} to={item.path} onClick={() => setDrawer(false)}
              sx={{ color: location.pathname === item.path ? '#00d4ff' : 'rgba(224,230,255,0.8)', '&:hover': { color: '#fff', background: 'rgba(124,92,255,0.1)' }, borderRadius: '8px', mx: 1, mb: 0.5 }}>
              <ListItemText primary={item.label} primaryTypographyProps={{ fontWeight: 600 }} />
            </ListItem>
          ))}
        </List>
      </Drawer>
      <Toolbar />
    </>
  );
}
