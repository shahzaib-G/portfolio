import React, { useEffect, useState } from 'react';
import { Box, Container, Typography, IconButton, Divider } from '@mui/material';
import { GitHub, LinkedIn, WhatsApp, Instagram, Twitter, Email } from '@mui/icons-material';
import { Link } from 'react-router-dom';
import API from '../utils/config';

export default function Footer() {
  const [profile, setProfile] = useState(null);
  useEffect(() => { fetch(`${API}/profile`).then(r=>r.json()).then(setProfile).catch(()=>{}); }, []);

  const socials = [
    { key:'github',    icon:<GitHub />,    color:'#a78bfa' },
    { key:'linkedin',  icon:<LinkedIn />,  color:'#00d4ff' },
    { key:'whatsapp',  icon:<WhatsApp />,  color:'#25d366' },
    { key:'instagram', icon:<Instagram />, color:'#e1306c' },
    { key:'twitter',   icon:<Twitter />,   color:'#1da1f2' },
  ].filter(s => profile?.[s.key]);

  return (
    <Box component="footer" sx={{
      py: 6, position:'relative', zIndex:1,
      background:'rgba(10,15,30,0.95)', backdropFilter:'blur(20px)',
      borderTop:'1px solid rgba(124,92,255,0.1)',
    }}>
      <Container maxWidth="xl">
        <Box sx={{ display:'flex', flexDirection:{ xs:'column', md:'row' }, justifyContent:'space-between', alignItems:'center', gap:3 }}>
          <Box>
            <Typography sx={{ fontFamily:"'Orbitron'", fontWeight:900, fontSize:'1.3rem',
              background:'linear-gradient(135deg,#7c5cff,#00d4ff)', WebkitBackgroundClip:'text', WebkitTextFillColor:'transparent' }}>
              {profile?.name || 'Portfolio'}
            </Typography>
            {profile?.title && <Typography sx={{ color:'rgba(224,230,255,0.4)', fontSize:'0.82rem', mt:0.5 }}>{profile.title}</Typography>}
          </Box>

          <Box sx={{ display:'flex', gap:1 }}>
            {socials.map(s => (
              <IconButton key={s.key} href={profile[s.key]} target="_blank" size="small" sx={{
                color:'rgba(224,230,255,0.4)', border:'1px solid rgba(255,255,255,0.07)',
                '&:hover':{ color:s.color, borderColor:s.color, background:`${s.color}15` }, transition:'all 0.3s',
              }}>{s.icon}</IconButton>
            ))}
            {profile?.email && (
              <IconButton href={`mailto:${profile.email}`} size="small" sx={{
                color:'rgba(224,230,255,0.4)', border:'1px solid rgba(255,255,255,0.07)',
                '&:hover':{ color:'#a78bfa', borderColor:'#a78bfa', background:'rgba(124,92,255,0.1)' }, transition:'all 0.3s',
              }}><Email /></IconButton>
            )}
          </Box>
        </Box>

        <Divider sx={{ my:3, borderColor:'rgba(124,92,255,0.08)' }} />

        <Box sx={{ display:'flex', flexDirection:{ xs:'column', sm:'row' }, justifyContent:'space-between', alignItems:'center', gap:2 }}>
          <Typography sx={{ color:'rgba(224,230,255,0.25)', fontSize:'0.78rem' }}>
            © {new Date().getFullYear()} {profile?.name || ''}. All rights reserved.
          </Typography>
          <Box sx={{ display:'flex', gap:3 }}>
            {[['Home','/'],['About','/about'],['Experience','/experience'],['Certificates','/certificates']].map(([l,p]) => (
              <Typography key={p} component={Link} to={p} sx={{ color:'rgba(224,230,255,0.3)', fontSize:'0.78rem', textDecoration:'none', '&:hover':{ color:'#a78bfa' }, transition:'color 0.3s' }}>{l}</Typography>
            ))}
          </Box>
        </Box>
      </Container>
    </Box>
  );
}
