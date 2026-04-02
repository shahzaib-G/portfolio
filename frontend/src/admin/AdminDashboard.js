import React, { useState } from 'react';
import { Box, Drawer, List, ListItem, ListItemIcon, ListItemText, IconButton, Typography, useMediaQuery, useTheme, Button, Divider } from '@mui/material';
import { Routes, Route, useNavigate, useLocation } from 'react-router-dom';
import { Dashboard, Person, Work, School, EmojiEvents, Message, Analytics, Logout, Menu, Close, Code } from '@mui/icons-material';
import { motion } from 'framer-motion';
import { useAuth } from '../context/AuthContext';
import AdminOverview     from './sections/AdminOverview';
import AdminProfile      from './sections/AdminProfile';
import AdminProjects     from './sections/AdminProjects';
import AdminSkills       from './sections/AdminSkills';
import AdminExperiences  from './sections/AdminExperiences';
import AdminCertificates from './sections/AdminCertificates';
import AdminMessages     from './sections/AdminMessages';
import AdminAnalytics    from './sections/AdminAnalytics';

const DRAWER_W = 240;

const NAV = [
  { label:'Overview',     icon:<Dashboard />,    path:'/admin' },
  { label:'Profile',      icon:<Person />,        path:'/admin/profile' },
  { label:'Projects',     icon:<Code />,          path:'/admin/projects' },
  { label:'Skills',       icon:<Work />,          path:'/admin/skills' },
  { label:'Experience',   icon:<Work />,          path:'/admin/experience' },
  { label:'Certificates', icon:<EmojiEvents />,   path:'/admin/certificates' },
  { label:'Messages',     icon:<Message />,       path:'/admin/messages' },
  { label:'Analytics',    icon:<Analytics />,     path:'/admin/analytics' },
];

const sidebarSx = {
  width: DRAWER_W, flexShrink: 0,
  '& .MuiDrawer-paper': {
    width: DRAWER_W, boxSizing:'border-box',
    background:'rgba(10,15,30,0.98)', backdropFilter:'blur(20px)',
    borderRight:'1px solid rgba(124,92,255,0.12)',
  },
};

export default function AdminDashboard() {
  const { admin, logout } = useAuth();
  const navigate   = useNavigate();
  const location   = useLocation();
  const theme      = useTheme();
  const isMobile   = useMediaQuery(theme.breakpoints.down('md'));
  const [open, setOpen] = useState(false);

  const handleNav = (path) => { navigate(path); if (isMobile) setOpen(false); };
  const handleLogout = () => { logout(); navigate('/admin/login'); };

  const SidebarContent = () => (
    <Box sx={{ display:'flex', flexDirection:'column', height:'100%' }}>
      <Box sx={{ p:3, display:'flex', alignItems:'center', justifyContent:'space-between' }}>
        <Typography sx={{ fontFamily:"'Orbitron'", fontWeight:900, fontSize:'1.1rem',
          background:'linear-gradient(135deg,#7c5cff,#00d4ff)', WebkitBackgroundClip:'text', WebkitTextFillColor:'transparent' }}>
          ADMIN
        </Typography>
        {isMobile && <IconButton onClick={()=>setOpen(false)} sx={{ color:'rgba(224,230,255,0.5)' }}><Close /></IconButton>}
      </Box>

      <Box sx={{ px:2, pb:2 }}>
        <Box sx={{ p:2, borderRadius:'12px', background:'rgba(124,92,255,0.08)', border:'1px solid rgba(124,92,255,0.15)' }}>
          <Typography sx={{ fontSize:'0.78rem', color:'#a78bfa', fontWeight:700 }}>{admin?.name || 'Admin'}</Typography>
          <Typography sx={{ fontSize:'0.72rem', color:'rgba(224,230,255,0.35)' }}>{admin?.email}</Typography>
        </Box>
      </Box>

      <Divider sx={{ borderColor:'rgba(124,92,255,0.08)', mx:2 }} />

      <List sx={{ flex:1, py:1, px:1 }}>
        {NAV.map(item => {
          const active = location.pathname === item.path || (item.path !== '/admin' && location.pathname.startsWith(item.path));
          return (
            <ListItem key={item.path} onClick={()=>handleNav(item.path)} sx={{
              borderRadius:'10px', mb:0.3, cursor:'pointer',
              background: active ? 'rgba(124,92,255,0.15)' : 'transparent',
              border: active ? '1px solid rgba(124,92,255,0.3)' : '1px solid transparent',
              '&:hover':{ background:'rgba(124,92,255,0.1)', border:'1px solid rgba(124,92,255,0.2)' },
              transition:'all 0.2s',
            }}>
              <ListItemIcon sx={{ minWidth:36, color: active ? '#a78bfa' : 'rgba(224,230,255,0.4)' }}>{item.icon}</ListItemIcon>
              <ListItemText primary={item.label} primaryTypographyProps={{ fontSize:'0.87rem', fontWeight: active ? 700 : 500, color: active ? '#e0e6ff' : 'rgba(224,230,255,0.55)', fontFamily:"'Space Grotesk'" }} />
            </ListItem>
          );
        })}
      </List>

      <Divider sx={{ borderColor:'rgba(124,92,255,0.08)', mx:2 }} />
      <Box sx={{ p:2 }}>
        <Button fullWidth onClick={handleLogout} startIcon={<Logout />} sx={{
          color:'rgba(224,230,255,0.4)', textTransform:'none', fontWeight:600, borderRadius:'10px', justifyContent:'flex-start',
          '&:hover':{ color:'#ff6b6b', background:'rgba(255,107,107,0.08)' }, transition:'all 0.2s',
        }}>Logout</Button>
      </Box>
    </Box>
  );

  return (
    <Box sx={{ display:'flex', minHeight:'100vh', background:'#0a0f1e' }}>
      {/* Desktop sidebar */}
      {!isMobile && (
        <Drawer variant="permanent" sx={sidebarSx}>
          <SidebarContent />
        </Drawer>
      )}
      {/* Mobile drawer */}
      {isMobile && (
        <Drawer open={open} onClose={()=>setOpen(false)} sx={sidebarSx}>
          <SidebarContent />
        </Drawer>
      )}

      {/* Main content */}
      <Box sx={{ flex:1, display:'flex', flexDirection:'column', overflow:'hidden' }}>
        {/* Top bar (mobile) */}
        {isMobile && (
          <Box sx={{ display:'flex', alignItems:'center', p:2, borderBottom:'1px solid rgba(124,92,255,0.1)', background:'rgba(10,15,30,0.95)' }}>
            <IconButton onClick={()=>setOpen(true)} sx={{ color:'#a78bfa', mr:2 }}><Menu /></IconButton>
            <Typography sx={{ fontFamily:"'Orbitron'", fontWeight:900, fontSize:'1rem',
              background:'linear-gradient(135deg,#7c5cff,#00d4ff)', WebkitBackgroundClip:'text', WebkitTextFillColor:'transparent' }}>ADMIN</Typography>
          </Box>
        )}

        <Box sx={{ flex:1, overflow:'auto', p:{ xs:2, md:4 } }}>
          <motion.div key={location.pathname} initial={{ opacity:0, y:12 }} animate={{ opacity:1, y:0 }} transition={{ duration:0.35 }}>
            <Routes>
              <Route index          element={<AdminOverview />} />
              <Route path="profile"      element={<AdminProfile />} />
              <Route path="projects"     element={<AdminProjects />} />
              <Route path="skills"       element={<AdminSkills />} />
              <Route path="experience"   element={<AdminExperiences />} />
              <Route path="certificates" element={<AdminCertificates />} />
              <Route path="messages"     element={<AdminMessages />} />
              <Route path="analytics"    element={<AdminAnalytics />} />
            </Routes>
          </motion.div>
        </Box>
      </Box>
    </Box>
  );
}
