import React, { useEffect, useState } from 'react';
import { Container, Typography, Box, Chip, Skeleton, Grid } from '@mui/material';
import { motion } from 'framer-motion';
import { Work, CalendarToday, ArrowOutward } from '@mui/icons-material';
import { trackPageVisit, trackPageLeave } from '../utils/tracker';
import API from '../utils/config';

const FH = "'Syne', sans-serif";
const FB = "'DM Sans', sans-serif";
const FM = "'JetBrains Mono', monospace";

const ExperienceCard = ({ item, index }) => {
  const [hov, setHov] = useState(false);
  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.65, delay: index * 0.08, ease: [0.23, 1, 0.32, 1] }}
      onHoverStart={() => setHov(true)}
      onHoverEnd={() => setHov(false)}
    >
      <Box sx={{
        position: 'relative', mb: 3,
        p: { xs: 3, md: 4 }, borderRadius: '20px',
        background: hov ? 'rgba(255,255,255,0.04)' : 'rgba(255,255,255,0.025)',
        border: hov ? '1px solid rgba(139,92,246,0.3)' : '1px solid rgba(255,255,255,0.06)',
        boxShadow: hov ? '0 16px 48px rgba(0,0,0,0.35)' : 'none',
        transition: 'all 0.3s cubic-bezier(0.23,1,0.32,1)',
      }}>
        {/* Left accent bar */}
        <Box sx={{
          position: 'absolute', left: 0, top: '20%', bottom: '20%', width: 3,
          borderRadius: '0 2px 2px 0',
          background: hov ? 'linear-gradient(180deg,#6d28d9,#22d3ee)' : 'rgba(139,92,246,0.2)',
          transition: 'background 0.3s',
        }} />

        <Grid container spacing={2} alignItems="flex-start">
          <Grid item xs={12} sm={8}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mb: 0.5 }}>
              <Typography sx={{ fontFamily: FH, fontWeight: 700, fontSize: { xs: '1rem', md: '1.15rem' }, color: '#f1f5f9', letterSpacing: '-0.02em' }}>
                {item.role}
              </Typography>
              {item.current && (
                <Box sx={{ px: 1.2, py: 0.3, borderRadius: '20px', background: 'rgba(34,197,94,0.1)', border: '1px solid rgba(34,197,94,0.22)' }}>
                  <Typography sx={{ fontFamily: FM, fontSize: '0.62rem', color: '#4ade80', fontWeight: 700, letterSpacing: '0.08em', textTransform: 'uppercase' }}>Current</Typography>
                </Box>
              )}
            </Box>
            <Typography sx={{ fontFamily: FB, fontWeight: 600, color: '#8b5cf6', fontSize: '0.9rem', mb: 0.5 }}>
              {item.company}
            </Typography>
          </Grid>
          <Grid item xs={12} sm={4} sx={{ display: 'flex', justifyContent: { sm: 'flex-end' } }}>
            <Box sx={{ display: 'inline-flex', alignItems: 'center', gap: 0.8, px: 1.6, py: 0.5, borderRadius: '8px', background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.06)' }}>
              <CalendarToday sx={{ fontSize: 11, color: '#475569' }} />
              <Typography sx={{ fontFamily: FM, fontSize: '0.72rem', color: '#475569', letterSpacing: '0.04em' }}>
                {item.startDate || ''}{item.current ? ' – Present' : item.endDate ? ` – ${item.endDate}` : ''}
              </Typography>
            </Box>
          </Grid>
        </Grid>

        {item.description && (
          <Typography sx={{ fontFamily: FB, color: '#64748b', fontSize: '0.9rem', lineHeight: 1.85, mt: 2 }}>
            {item.description}
          </Typography>
        )}

        {item.techStack?.length > 0 && (
          <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.6, mt: 2.5 }}>
            {item.techStack.map(t => (
              <Box key={t} sx={{ px: 1.4, py: 0.35, borderRadius: '6px', fontSize: '0.72rem', fontFamily: FB, fontWeight: 500, color: '#94a3b8', background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.07)' }}>
                {t}
              </Box>
            ))}
          </Box>
        )}
      </Box>
    </motion.div>
  );
};

export default function Experience() {
  const [items,   setItems]   = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    trackPageVisit('/experience');
    fetch(`${API}/experiences`)
      .then(r => r.json())
      .then(d => setItems(Array.isArray(d) ? d : []))
      .catch(() => {})
      .finally(() => setLoading(false));
    return () => trackPageLeave('/experience');
  }, []);

  return (
    <Box sx={{ background: '#09090b', minHeight: '100vh', pt: { xs: 12, md: 14 }, pb: 12, position: 'relative', overflow: 'hidden' }}>
      {/* bg glows */}
      <Box sx={{ position: 'fixed', top: '20%', right: '-8%', width: '40vw', height: '40vw', maxWidth: 550, background: 'radial-gradient(circle,rgba(109,40,217,0.09) 0%,transparent 65%)', filter: 'blur(80px)', pointerEvents: 'none', zIndex: 0 }} />
      <Box sx={{ position: 'fixed', bottom: '15%', left: '-8%', width: '40vw', height: '40vw', maxWidth: 520, background: 'radial-gradient(circle,rgba(34,211,238,0.07) 0%,transparent 65%)', filter: 'blur(80px)', pointerEvents: 'none', zIndex: 0 }} />

      <Container maxWidth="lg" sx={{ position: 'relative', zIndex: 1 }}>
        {/* Header */}
        <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2 }}>
            <Box sx={{ fontFamily: FM, fontSize: '0.72rem', fontWeight: 500, color: '#475569', letterSpacing: '0.08em' }}>— 02</Box>
            <Box sx={{ width: 60, height: 1, background: 'rgba(255,255,255,0.06)' }} />
          </Box>
          <Typography sx={{ fontFamily: FH, fontWeight: 800, fontSize: { xs: '2.4rem', md: '3.5rem' }, letterSpacing: '-0.04em', lineHeight: 1, mb: 1.5, background: 'linear-gradient(135deg, #f1f5f9 0%, #c4b5fd 60%)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
            Experience
          </Typography>
          <Typography sx={{ fontFamily: FB, color: '#475569', fontSize: '1rem', mb: 8, maxWidth: 420 }}>
            Where I've worked and what I've built.
          </Typography>
        </motion.div>

        {/* List */}
        {loading ? (
          [1, 2, 3].map(k => (
            <Skeleton key={k} variant="rounded" height={180} sx={{ bgcolor: 'rgba(255,255,255,0.03)', borderRadius: '20px', mb: 3 }} />
          ))
        ) : items.length === 0 ? (
          <Box sx={{ textAlign: 'center', py: 12 }}>
            <Work sx={{ fontSize: 56, color: 'rgba(139,92,246,0.15)', mb: 2 }} />
            <Typography sx={{ fontFamily: FB, color: '#475569' }}>Experience will appear here once added via Admin.</Typography>
          </Box>
        ) : (
          <Box>
            {items.map((item, i) => (
              <ExperienceCard key={item._id} item={item} index={i} />
            ))}
          </Box>
        )}
      </Container>
    </Box>
  );
}
