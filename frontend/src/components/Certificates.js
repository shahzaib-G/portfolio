import React, { useEffect, useState } from 'react';
import { Container, Typography, Box, Grid, Skeleton } from '@mui/material';
import { motion } from 'framer-motion';
import { EmojiEvents, OpenInNew, Verified } from '@mui/icons-material';
import { useTheme } from '@mui/material/styles';
import { trackPageVisit, trackPageLeave } from '../utils/tracker';
import API from '../utils/config';

const FH = "'Plus Jakarta Sans', sans-serif";
const FB = "'Inter', sans-serif";
const FM = "'JetBrains Mono', monospace";

const fadeView = (delay = 0) => ({
  initial: { opacity: 0, y: 18 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true },
  transition: { duration: 0.45, delay, ease: [0.22, 1, 0.36, 1] },
});

/* â”€â”€ Issuer accent colors â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€ */
const ISSUER_COLORS = {
  coursera:  ['#0056D2', '#00B6ED'],
  google:    ['#4285F4', '#34A853'],
  udemy:     ['#a435f0', '#ec5252'],
  microsoft: ['#00a4ef', '#7fba00'],
  default:   ['#4f46e5', '#0891b2'],
};
const getIssuerGradient = (issuer = '') => {
  const lower = issuer.toLowerCase();
  for (const [key, colors] of Object.entries(ISSUER_COLORS)) {
    if (lower.includes(key)) return `linear-gradient(135deg, ${colors[0]}, ${colors[1]})`;
  }
  return `linear-gradient(135deg, ${ISSUER_COLORS.default[0]}, ${ISSUER_COLORS.default[1]})`;
};

const CertCard = ({ cert, index }) => {
  const theme   = useTheme();
  const isLight = theme.palette.mode === 'light';
  const accent  = isLight ? '#4f46e5' : '#818cf8';
  const teal    = isLight ? '#0891b2' : '#22d3ee';
  const tealBg  = isLight ? 'rgba(8,145,178,0.06)' : 'rgba(34,211,238,0.07)';
  const tealBdr = isLight ? 'rgba(8,145,178,0.18)' : 'rgba(34,211,238,0.2)';
  const gradient = getIssuerGradient(cert.issuer);

  return (
    <motion.div {...fadeView(index * 0.055)} style={{ height: '100%' }}>
      <Box sx={{
        height: '100%', borderRadius: '18px', overflow: 'hidden',
        background: theme.palette.background.paper,
        border: `1px solid ${theme.palette.divider}`,
        boxShadow: isLight ? '0 1px 4px rgba(0,0,0,0.05)' : '0 4px 20px rgba(0,0,0,0.2)',
        display: 'flex', flexDirection: 'column',
        transition: 'transform 0.22s ease, box-shadow 0.22s ease, border-color 0.22s ease',
        '&:hover': {
          transform: 'translateY(-3px)',
          boxShadow: isLight ? '0 8px 28px rgba(0,0,0,0.1)' : '0 12px 36px rgba(0,0,0,0.35)',
          borderColor: isLight ? 'rgba(79,70,229,0.28)' : 'rgba(129,140,248,0.28)',
        },
      }}>
        {/* Top image or gradient header */}
        {cert.imageUrl ? (
          <Box sx={{ height: 165, overflow: 'hidden', flexShrink: 0 }}>
            <Box component="img" src={cert.imageUrl} alt={cert.title} sx={{ width: '100%', height: '100%', objectFit: 'cover' }} />
          </Box>
        ) : (
          <Box sx={{
            height: 120, flexShrink: 0, display: 'flex', alignItems: 'center', justifyContent: 'center',
            background: gradient, position: 'relative', overflow: 'hidden',
          }}>
            {/* Decorative circles */}
            <Box sx={{ position: 'absolute', width: 120, height: 120, borderRadius: '50%', background: 'rgba(255,255,255,0.08)', top: -40, right: -20 }} />
            <Box sx={{ position: 'absolute', width: 80, height: 80, borderRadius: '50%', background: 'rgba(255,255,255,0.06)', bottom: -20, left: 10 }} />
            <EmojiEvents sx={{ fontSize: 48, color: 'rgba(255,255,255,0.9)', position: 'relative', zIndex: 1, filter: 'drop-shadow(0 2px 8px rgba(0,0,0,0.2))' }} />
          </Box>
        )}

        {/* Content */}
        <Box sx={{ p: 2.5, flex: 1, display: 'flex', flexDirection: 'column' }}>
          <Typography sx={{ fontFamily: FH, fontWeight: 700, fontSize: '0.92rem', color: theme.palette.text.primary, mb: 0.6, letterSpacing: '-0.02em', lineHeight: 1.35 }}>
            {cert.title}
          </Typography>

          {cert.issuer && (
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5, mb: 0.5 }}>
              <Verified sx={{ fontSize: 13, color: accent }} />
              <Typography sx={{ fontFamily: FB, fontSize: '0.8rem', color: accent, fontWeight: 500 }}>
                {cert.issuer}
              </Typography>
            </Box>
          )}

          {cert.date && (
            <Typography sx={{ fontFamily: FM, fontSize: '0.7rem', color: theme.palette.text.secondary, mb: 1.5, letterSpacing: '0.04em' }}>
              {cert.date}
            </Typography>
          )}

          <Box sx={{ flex: 1 }} />

          {cert.credentialUrl && (
            <Box component="a" href={cert.credentialUrl} target="_blank" rel="noopener" sx={{
              display: 'inline-flex', alignItems: 'center', gap: 0.7,
              px: 2, py: 0.75, borderRadius: '8px', textDecoration: 'none', alignSelf: 'flex-start',
              fontFamily: FB, fontSize: '0.78rem', fontWeight: 600,
              color: teal, background: tealBg, border: `1px solid ${tealBdr}`,
              transition: 'all 0.18s ease', mt: 1,
              '&:hover': { background: isLight ? 'rgba(8,145,178,0.12)' : 'rgba(34,211,238,0.13)' },
            }}>
              <OpenInNew sx={{ fontSize: 12 }} /> View Credential
            </Box>
          )}
        </Box>
      </Box>
    </motion.div>
  );
};

export default function Certificates() {
  const theme   = useTheme();
  const isLight = theme.palette.mode === 'light';
  const [items,   setItems]   = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    trackPageVisit('/certificates');
    fetch(`${API}/certificates`)
      .then(r => r.json())
      .then(d => setItems(Array.isArray(d) ? d.sort((a, b) => a.order - b.order) : []))
      .catch(() => {})
      .finally(() => setLoading(false));
    return () => trackPageLeave('/certificates');
  }, []);

  const accent = isLight ? '#4f46e5' : '#818cf8';

  return (
    <Box sx={{
      background: theme.palette.background.default,
      minHeight: '100vh', pt: { xs: 12, md: 14 }, pb: 14,
      transition: 'background 0.3s ease',
    }}>
      <Container maxWidth="xl">

        {/* Page header */}
        <motion.div {...fadeView()}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2 }}>
            <Box sx={{
              width: 28, height: 28, borderRadius: '8px',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              background: isLight ? 'rgba(79,70,229,0.09)' : 'rgba(129,140,248,0.12)',
              border: `1px solid ${isLight ? 'rgba(79,70,229,0.18)' : 'rgba(129,140,248,0.22)'}`,
            }}>
              <Typography sx={{ fontFamily: FM, fontSize: '0.6rem', fontWeight: 700, color: accent }}>03</Typography>
            </Box>
            <Box sx={{ height: 1, width: 60, background: theme.palette.divider }} />
          </Box>
          <Typography sx={{
            fontFamily: FH, fontWeight: 800,
            fontSize: { xs: '2.4rem', md: '3.5rem' },
            letterSpacing: '-0.04em', lineHeight: 1, mb: 1.5,
            background: isLight
              ? 'linear-gradient(135deg, #1e1b4b 0%, #4f46e5 100%)'
              : 'linear-gradient(135deg, #e2e8f0 0%, #818cf8 100%)',
            WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text',
          }}>
            Certificates
          </Typography>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 3, mb: { xs: 8, md: 10 }, flexWrap: 'wrap' }}>
            <Typography sx={{ fontFamily: FB, color: theme.palette.text.secondary, fontSize: '1rem', maxWidth: 420 }}>
              Credentials and achievements I've earned along the way.
            </Typography>
            {!loading && items.length > 0 && (
              <Box sx={{
                px: 2, py: 0.7, borderRadius: '30px',
                background: isLight ? 'rgba(79,70,229,0.07)' : 'rgba(129,140,248,0.1)',
                border: `1px solid ${isLight ? 'rgba(79,70,229,0.15)' : 'rgba(129,140,248,0.2)'}`,
              }}>
                <Typography sx={{ fontFamily: FM, fontSize: '0.75rem', fontWeight: 700, color: accent }}>
                  {items.length} certificates
                </Typography>
              </Box>
            )}
          </Box>
        </motion.div>

        {loading ? (
          <Grid container spacing={3}>
            {[1, 2, 3, 4, 5, 6].map(k => (
              <Grid key={k} item xs={12} sm={6} md={4} lg={3}>
                <Skeleton variant="rounded" height={280} sx={{ borderRadius: '18px' }} />
              </Grid>
            ))}
          </Grid>
        ) : items.length === 0 ? (
          <Box sx={{ textAlign: 'center', py: 14 }}>
            <EmojiEvents sx={{ fontSize: 60, color: theme.palette.divider, mb: 2 }} />
            <Typography sx={{ fontFamily: FB, color: theme.palette.text.secondary, fontSize: '0.95rem' }}>
              Certificates will appear here once added via Admin.
            </Typography>
          </Box>
        ) : (
          <Grid container spacing={3}>
            {items.map((cert, i) => (
              <Grid key={cert._id} item xs={12} sm={6} md={4} lg={3}>
                <CertCard cert={cert} index={i} />
              </Grid>
            ))}
          </Grid>
        )}
      </Container>
    </Box>
  );
}
