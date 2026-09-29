import React, { useEffect, useState } from 'react';
import { Container, Typography, Box, Grid, Button, Skeleton } from '@mui/material';
import { motion } from 'framer-motion';
import { EmojiEvents, OpenInNew } from '@mui/icons-material';
import { trackPageVisit, trackPageLeave } from '../utils/tracker';
import API from '../utils/config';

const FH = "'Syne', sans-serif";
const FB = "'DM Sans', sans-serif";
const FM = "'JetBrains Mono', monospace";

const CertCard = ({ cert, index }) => {
  const [hov, setHov] = useState(false);
  return (
    <motion.div
      initial={{ opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.6, delay: index * 0.07, ease: [0.23, 1, 0.32, 1] }}
      onHoverStart={() => setHov(true)}
      onHoverEnd={() => setHov(false)}
      style={{ height: '100%' }}
    >
      <Box sx={{
        height: '100%', borderRadius: '20px', overflow: 'hidden',
        background: 'rgba(255,255,255,0.025)',
        border: hov ? '1px solid rgba(139,92,246,0.35)' : '1px solid rgba(255,255,255,0.06)',
        boxShadow: hov ? '0 20px 56px rgba(0,0,0,0.4)' : '0 4px 20px rgba(0,0,0,0.2)',
        transform: hov ? 'translateY(-8px)' : 'none',
        transition: 'all 0.38s cubic-bezier(0.23,1,0.32,1)',
      }}>
        {/* Cert image */}
        {cert.imageUrl ? (
          <Box sx={{ position: 'relative', height: 180, overflow: 'hidden' }}>
            <Box
              component="img" src={cert.imageUrl} alt={cert.title}
              sx={{ width: '100%', height: '100%', objectFit: 'cover', transform: hov ? 'scale(1.06)' : 'scale(1)', transition: 'transform 0.5s ease' }}
            />
            <Box sx={{ position: 'absolute', inset: 0, background: 'linear-gradient(180deg,transparent 50%,rgba(9,9,11,0.85))' }} />
          </Box>
        ) : (
          <Box sx={{
            height: 120, display: 'flex', alignItems: 'center', justifyContent: 'center',
            background: 'linear-gradient(135deg,rgba(109,40,217,0.08),rgba(34,211,238,0.04))',
          }}>
            <EmojiEvents sx={{ fontSize: 44, color: 'rgba(139,92,246,0.3)' }} />
          </Box>
        )}

        {/* Content */}
        <Box sx={{ p: 3 }}>
          <Typography sx={{ fontFamily: FH, fontWeight: 700, fontSize: '0.95rem', color: '#f1f5f9', mb: 0.6, letterSpacing: '-0.02em', lineHeight: 1.3 }}>
            {cert.title}
          </Typography>
          {cert.issuer && (
            <Typography sx={{ fontFamily: FB, fontSize: '0.82rem', color: '#8b5cf6', fontWeight: 500, mb: 0.5 }}>
              {cert.issuer}
            </Typography>
          )}
          {cert.date && (
            <Typography sx={{ fontFamily: FM, fontSize: '0.72rem', color: '#475569', mb: 2 }}>
              {cert.date}
            </Typography>
          )}
          {cert.link && (
            <Box
              component="a" href={cert.link} target="_blank" rel="noopener"
              sx={{
                display: 'inline-flex', alignItems: 'center', gap: 0.8,
                px: 2, py: 0.75, borderRadius: '10px', textDecoration: 'none',
                fontFamily: FB, fontSize: '0.78rem', fontWeight: 600, color: '#22d3ee',
                border: '1px solid rgba(34,211,238,0.18)', background: 'rgba(34,211,238,0.05)',
                transition: 'all 0.2s ease',
                '&:hover': { background: 'rgba(34,211,238,0.12)', borderColor: 'rgba(34,211,238,0.4)' },
              }}
            >
              <OpenInNew sx={{ fontSize: 13 }} /> View
            </Box>
          )}
        </Box>
      </Box>
    </motion.div>
  );
};

export default function Certificates() {
  const [items,   setItems]   = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    trackPageVisit('/certificates');
    fetch(`${API}/certificates`)
      .then(r => r.json())
      .then(d => setItems(Array.isArray(d) ? d : []))
      .catch(() => {})
      .finally(() => setLoading(false));
    return () => trackPageLeave('/certificates');
  }, []);

  return (
    <Box sx={{ background: '#09090b', minHeight: '100vh', pt: { xs: 12, md: 14 }, pb: 12, position: 'relative', overflow: 'hidden' }}>
      {/* bg glows */}
      <Box sx={{ position: 'fixed', top: '10%', left: '-5%', width: '40vw', height: '40vw', maxWidth: 550, background: 'radial-gradient(circle,rgba(109,40,217,0.09) 0%,transparent 65%)', filter: 'blur(80px)', pointerEvents: 'none', zIndex: 0 }} />
      <Box sx={{ position: 'fixed', bottom: '10%', right: '-5%', width: '38vw', height: '38vw', maxWidth: 500, background: 'radial-gradient(circle,rgba(34,211,238,0.07) 0%,transparent 65%)', filter: 'blur(80px)', pointerEvents: 'none', zIndex: 0 }} />

      <Container maxWidth="xl" sx={{ position: 'relative', zIndex: 1 }}>
        {/* Header */}
        <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2 }}>
            <Box sx={{ fontFamily: FM, fontSize: '0.72rem', fontWeight: 500, color: '#475569', letterSpacing: '0.08em' }}>— 03</Box>
            <Box sx={{ width: 60, height: 1, background: 'rgba(255,255,255,0.06)' }} />
          </Box>
          <Typography sx={{ fontFamily: FH, fontWeight: 800, fontSize: { xs: '2.4rem', md: '3.5rem' }, letterSpacing: '-0.04em', lineHeight: 1, mb: 1.5, background: 'linear-gradient(135deg, #f1f5f9 0%, #67e8f9 60%)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
            Certificates
          </Typography>
          <Typography sx={{ fontFamily: FB, color: '#475569', fontSize: '1rem', mb: 8, maxWidth: 420 }}>
            Credentials and achievements I've earned along the way.
          </Typography>
        </motion.div>

        {loading ? (
          <Grid container spacing={3}>
            {[1, 2, 3, 4, 5, 6].map(k => (
              <Grid key={k} item xs={12} sm={6} md={4} lg={3}>
                <Skeleton variant="rounded" height={280} sx={{ bgcolor: 'rgba(255,255,255,0.03)', borderRadius: '20px' }} />
              </Grid>
            ))}
          </Grid>
        ) : items.length === 0 ? (
          <Box sx={{ textAlign: 'center', py: 12 }}>
            <EmojiEvents sx={{ fontSize: 56, color: 'rgba(139,92,246,0.15)', mb: 2 }} />
            <Typography sx={{ fontFamily: FB, color: '#475569' }}>Certificates will appear here once added via Admin.</Typography>
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
