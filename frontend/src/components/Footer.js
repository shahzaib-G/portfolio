import React, { useEffect, useState } from 'react';
import { Box, Container, Typography } from '@mui/material';
import { GitHub, LinkedIn, WhatsApp, Instagram, Twitter, Email } from '@mui/icons-material';
import { Link } from 'react-router-dom';
import { useTheme } from '@mui/material/styles';
import API from '../utils/config';

const FB = "'Inter', sans-serif";
const FH = "'Plus Jakarta Sans', sans-serif";

export default function Footer() {
  const theme   = useTheme();
  const isLight = theme.palette.mode === 'light';
  const [profile, setProfile] = useState(null);

  useEffect(() => {
    fetch(`${API}/profile`).then(r => r.json()).then(setProfile).catch(() => {});
  }, []);

  const socials = [
    { key: 'github',    icon: <GitHub fontSize="small" /> },
    { key: 'linkedin',  icon: <LinkedIn fontSize="small" /> },
    { key: 'whatsapp',  icon: <WhatsApp fontSize="small" /> },
    { key: 'instagram', icon: <Instagram fontSize="small" /> },
    { key: 'twitter',   icon: <Twitter fontSize="small" /> },
  ].filter(s => profile?.[s.key]);

  const accent    = isLight ? '#4f46e5' : '#818cf8';
  const accentBg  = isLight ? 'rgba(79,70,229,0.07)' : 'rgba(129,140,248,0.1)';
  const accentBdr = isLight ? 'rgba(79,70,229,0.18)' : 'rgba(129,140,248,0.22)';
  const initials  = (profile?.name || 'P').split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase();

  return (
    <Box
      component="footer"
      sx={{
        borderTop: `1px solid ${theme.palette.divider}`,
        background: theme.palette.background.paper,
        py: { xs: 5, md: 6 },
        transition: 'background 0.3s ease',
      }}
    >
      <Container maxWidth="xl">
        <Box sx={{
          display: 'flex', flexDirection: { xs: 'column', md: 'row' },
          justifyContent: 'space-between', alignItems: { md: 'center' }, gap: 4,
        }}>
          {/* Brand */}
          <Box>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mb: 1 }}>
              <Box sx={{
                width: 32, height: 32, borderRadius: '9px', flexShrink: 0,
                background: 'linear-gradient(135deg,#4f46e5,#0891b2)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontFamily: FH, fontWeight: 800, fontSize: '0.75rem', color: '#fff',
              }}>
                {initials}
              </Box>
              <Typography sx={{ fontFamily: FH, fontWeight: 700, fontSize: '0.95rem', color: theme.palette.text.primary, letterSpacing: '-0.02em' }}>
                {profile?.name || 'Portfolio'}
              </Typography>
            </Box>
            {profile?.title && (
              <Typography sx={{ fontFamily: FB, color: theme.palette.text.secondary, fontSize: '0.82rem', ml: 0.5 }}>
                {profile.title}
              </Typography>
            )}
          </Box>

          {/* Nav links */}
          <Box sx={{ display: 'flex', gap: { xs: 2, md: 3 }, flexWrap: 'wrap' }}>
            {[['Home', '/'], ['About', '/about'], ['Experience', '/experience'], ['Certificates', '/certificates']].map(([l, p]) => (
              <Box
                key={p} component={Link} to={p}
                sx={{
                  fontFamily: FB, fontSize: '0.85rem', color: theme.palette.text.secondary,
                  textDecoration: 'none', transition: 'color 0.18s',
                  '&:hover': { color: theme.palette.text.primary },
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
                  color: theme.palette.text.secondary,
                  border: `1px solid ${theme.palette.divider}`,
                  transition: 'all 0.18s ease',
                  '&:hover': { color: accent, borderColor: accentBdr, background: accentBg },
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
                  color: theme.palette.text.secondary,
                  border: `1px solid ${theme.palette.divider}`,
                  transition: 'all 0.18s ease',
                  '&:hover': { color: accent, borderColor: accentBdr, background: accentBg },
                }}
              >
                <Email fontSize="small" />
              </Box>
            )}
          </Box>
        </Box>

        {/* Bottom bar */}
        <Box sx={{
          mt: 5, pt: 3, borderTop: `1px solid ${theme.palette.divider}`,
          display: 'flex', flexDirection: { xs: 'column', sm: 'row' },
          justifyContent: 'space-between', alignItems: 'center', gap: 2,
        }}>
          <Typography sx={{ fontFamily: FB, color: theme.palette.text.secondary, fontSize: '0.78rem', opacity: 0.55 }}>
            {`Â© ${new Date().getFullYear()} ${profile?.name || ''}. All rights reserved.`}
          </Typography>
          <Typography sx={{ fontFamily: FB, color: theme.palette.text.secondary, fontSize: '0.78rem', opacity: 0.55 }}>
            Built with React
          </Typography>
        </Box>
      </Container>
    </Box>
  );
}
