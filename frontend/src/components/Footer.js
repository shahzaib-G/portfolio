import React, { useEffect, useState } from 'react';
import { Box, Container, Typography, IconButton } from '@mui/material';
import { GitHub, LinkedIn, WhatsApp, Instagram, Twitter, Email } from '@mui/icons-material';
import { Link } from 'react-router-dom';
import API from '../utils/config';

const FB = "'DM Sans', sans-serif";
const FH = "'Syne', sans-serif";

export default function Footer() {
  const [profile, setProfile] = useState(null);
  useEffect(() => { fetch(`${API}/profile`).then(r => r.json()).then(setProfile).catch(() => {}); }, []);

  const socials = [
    { key: 'github',    icon: <GitHub fontSize="small" />,    color: '#8b5cf6' },
    { key: 'linkedin',  icon: <LinkedIn fontSize="small" />,  color: '#22d3ee' },
    { key: 'whatsapp',  icon: <WhatsApp fontSize="small" />,  color: '#22c55e' },
    { key: 'instagram', icon: <Instagram fontSize="small" />, color: '#ec4899' },
    { key: 'twitter',   icon: <Twitter fontSize="small" />,   color: '#60a5fa' },
  ].filter(s => profile?.[s.key]);

  return (
    <Box
      component="footer"
      sx={{
        borderTop: '1px solid rgba(255,255,255,0.05)',
        background: 'rgba(9,9,11,0.97)',
        backdropFilter: 'blur(16px)',
        py: { xs: 5, md: 6 },
      }}
    >
      <Container maxWidth="xl">
        <Box sx={{ display: 'flex', flexDirection: { xs: 'column', md: 'row' }, justifyContent: 'space-between', alignItems: { md: 'center' }, gap: 4 }}>

          {/* Brand */}
          <Box>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mb: 1 }}>
              <Box sx={{
                width: 32, height: 32, borderRadius: '9px', flexShrink: 0,
                background: 'linear-gradient(135deg,#6d28d9,#22d3ee)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontFamily: FH, fontWeight: 800, fontSize: '0.75rem', color: '#fff',
              }}>
                {(profile?.name || 'P').split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase()}
              </Box>
              <Typography sx={{ fontFamily: FH, fontWeight: 700, fontSize: '0.95rem', color: '#f1f5f9', letterSpacing: '-0.02em' }}>
                {profile?.name || 'Portfolio'}
              </Typography>
            </Box>
            {profile?.title && (
              <Typography sx={{ fontFamily: FB, color: '#475569', fontSize: '0.82rem', ml: 0.5 }}>
                {profile.title}
              </Typography>
            )}
          </Box>

          {/* Nav links */}
          <Box sx={{ display: 'flex', gap: { xs: 2, md: 3 }, flexWrap: 'wrap' }}>
            {[['Home', '/'], ['About', '/about'], ['Experience', '/experience'], ['Certificates', '/certificates']].map(([l, p]) => (
              <Box
                key={p}
                component={Link} to={p}
                sx={{
                  fontFamily: FB, fontSize: '0.85rem', color: '#475569', textDecoration: 'none',
                  transition: 'color 0.2s',
                  '&:hover': { color: '#94a3b8' },
                }}
              >
                {l}
              </Box>
            ))}
          </Box>

          {/* Socials */}
          <Box sx={{ display: 'flex', gap: 1 }}>
            {socials.map(s => (
              <Box
                key={s.key}
                component="a" href={profile[s.key]} target="_blank" rel="noopener"
                sx={{
                  width: 36, height: 36, borderRadius: '9px',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  color: '#475569', border: '1px solid rgba(255,255,255,0.06)',
                  transition: 'all 0.22s ease',
                  '&:hover': { color: s.color, borderColor: `${s.color}44`, background: `${s.color}0f`, transform: 'translateY(-2px)' },
                }}
              >
                {s.icon}
              </Box>
            ))}
            {profile?.email && (
              <Box
                component="a" href={`mailto:${profile.email}`}
                sx={{
                  width: 36, height: 36, borderRadius: '9px',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  color: '#475569', border: '1px solid rgba(255,255,255,0.06)',
                  transition: 'all 0.22s ease',
                  '&:hover': { color: '#c4b5fd', borderColor: 'rgba(139,92,246,0.35)', background: 'rgba(139,92,246,0.08)', transform: 'translateY(-2px)' },
                }}
              >
                <Email fontSize="small" />
              </Box>
            )}
          </Box>
        </Box>

        {/* Bottom bar */}
        <Box sx={{ mt: 5, pt: 3, borderTop: '1px solid rgba(255,255,255,0.04)', display: 'flex', flexDirection: { xs: 'column', sm: 'row' }, justifyContent: 'space-between', alignItems: 'center', gap: 2 }}>
          <Typography sx={{ fontFamily: FB, color: '#2e2e40', fontSize: '0.78rem' }}>
            © {new Date().getFullYear()} {profile?.name || ''}. All rights reserved.
          </Typography>
          <Typography sx={{ fontFamily: FB, color: '#2e2e40', fontSize: '0.78rem' }}>
            Built with React & ❤️
          </Typography>
        </Box>
      </Container>
    </Box>
  );
}
