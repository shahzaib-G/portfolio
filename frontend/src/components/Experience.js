import React, { useEffect, useState } from 'react';
import { Container, Typography, Box, Grid, Skeleton } from '@mui/material';
import { motion } from 'framer-motion';
import { Work, CalendarToday } from '@mui/icons-material';
import { useTheme } from '@mui/material/styles';
import { trackPageVisit, trackPageLeave } from '../utils/tracker';
import API from '../utils/config';

const FH = "'Plus Jakarta Sans', sans-serif";
const FB = "'Inter', sans-serif";
const FM = "'JetBrains Mono', monospace";

const fadeView = (delay = 0) => ({
  initial: { opacity: 0, y: 20 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true },
  transition: { duration: 0.48, delay, ease: [0.22, 1, 0.36, 1] },
});

const TimelineCard = ({ item, index, isLast }) => {
  const theme   = useTheme();
  const isLight = theme.palette.mode === 'light';
  const accent  = isLight ? '#4f46e5' : '#818cf8';
  const accentBg  = isLight ? 'rgba(79,70,229,0.06)' : 'rgba(129,140,248,0.09)';
  const accentBdr = isLight ? 'rgba(79,70,229,0.2)' : 'rgba(129,140,248,0.26)';

  return (
    <motion.div {...fadeView(index * 0.08)}>
      <Box sx={{ display: 'flex', gap: { xs: 2, md: 4 }, position: 'relative', mb: isLast ? 0 : 3 }}>
        {/* Timeline column */}
        <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', flexShrink: 0, width: { xs: 32, md: 40 } }}>
          {/* Dot */}
          <Box sx={{
            width: { xs: 32, md: 40 }, height: { xs: 32, md: 40 }, borderRadius: '50%', flexShrink: 0,
            background: `linear-gradient(135deg, ${accent}, ${isLight ? '#0891b2' : '#22d3ee'})`,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            boxShadow: isLight ? '0 2px 10px rgba(79,70,229,0.35)' : '0 2px 10px rgba(129,140,248,0.3)',
          }}>
            <Work sx={{ fontSize: { xs: 14, md: 16 }, color: '#fff' }} />
          </Box>
          {/* Connecting line */}
          {!isLast && (
            <Box sx={{
              flex: 1, width: 2, mt: 1, minHeight: 40,
              background: isLight
                ? 'linear-gradient(180deg, rgba(79,70,229,0.25), rgba(79,70,229,0.06))'
                : 'linear-gradient(180deg, rgba(129,140,248,0.25), rgba(129,140,248,0.04))',
              borderRadius: '2px',
            }} />
          )}
        </Box>

        {/* Card */}
        <Box sx={{
          flex: 1, pb: isLast ? 0 : 4,
          p: { xs: 3, md: 3.5 },
          mb: isLast ? 0 : 0,
          borderRadius: '16px',
          background: theme.palette.background.paper,
          border: `1px solid ${theme.palette.divider}`,
          boxShadow: isLight ? '0 1px 4px rgba(0,0,0,0.05)' : '0 4px 20px rgba(0,0,0,0.2)',
          position: 'relative', overflow: 'hidden',
          transition: 'border-color 0.22s, box-shadow 0.22s',
          '&:hover': {
            borderColor: isLight ? 'rgba(79,70,229,0.28)' : 'rgba(129,140,248,0.28)',
            boxShadow: isLight ? '0 6px 24px rgba(0,0,0,0.1)' : '0 10px 32px rgba(0,0,0,0.3)',
          },
          /* Accent top bar */
          '&::before': {
            content: '""', position: 'absolute', top: 0, left: 0, right: 0, height: 3,
            background: `linear-gradient(90deg, ${accent}, ${isLight ? '#0891b2' : '#22d3ee'})`,
            opacity: 0.7,
          },
        }}>
          {/* Header row */}
          <Box sx={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'space-between', alignItems: 'flex-start', gap: 2, mb: 1.5 }}>
            <Box>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, flexWrap: 'wrap' }}>
                <Typography sx={{ fontFamily: FH, fontWeight: 700, fontSize: { xs: '1.05rem', md: '1.15rem' }, color: theme.palette.text.primary, letterSpacing: '-0.02em' }}>
                  {item.role}
                </Typography>
                {item.current && (
                  <Box sx={{
                    px: 1.2, py: 0.3, borderRadius: '20px',
                    background: isLight ? 'rgba(22,163,74,0.08)' : 'rgba(74,222,128,0.08)',
                    border: `1px solid ${isLight ? 'rgba(22,163,74,0.22)' : 'rgba(74,222,128,0.22)'}`,
                  }}>
                    <Typography sx={{ fontFamily: FM, fontSize: '0.6rem', color: isLight ? '#15803d' : '#4ade80', fontWeight: 700, letterSpacing: '0.08em', textTransform: 'uppercase' }}>
                      Current
                    </Typography>
                  </Box>
                )}
              </Box>
              <Typography sx={{ fontFamily: FB, fontWeight: 600, color: accent, fontSize: '0.9rem', mt: 0.3 }}>
                {item.company}
              </Typography>
            </Box>
            <Box sx={{
              display: 'inline-flex', alignItems: 'center', gap: 0.8,
              px: 1.6, py: 0.6, borderRadius: '8px',
              background: isLight ? 'rgba(0,0,0,0.03)' : 'rgba(255,255,255,0.04)',
              border: `1px solid ${theme.palette.divider}`,
            }}>
              <CalendarToday sx={{ fontSize: 11, color: theme.palette.text.secondary }} />
              <Typography sx={{ fontFamily: FM, fontSize: '0.72rem', color: theme.palette.text.secondary, letterSpacing: '0.04em' }}>
                {item.startDate || ''}{item.current ? ' â€“ Present' : item.endDate ? ` â€“ ${item.endDate}` : ''}
              </Typography>
            </Box>
          </Box>

          {item.description && (
            <Typography sx={{ fontFamily: FB, color: theme.palette.text.secondary, fontSize: '0.9rem', lineHeight: 1.85, mt: 1 }}>
              {item.description}
            </Typography>
          )}

          {item.techStack?.length > 0 && (
            <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.7, mt: 2.5 }}>
              {item.techStack.map(t => (
                <Box key={t} sx={{
                  px: 1.4, py: 0.4, borderRadius: '6px', fontSize: '0.72rem',
                  fontFamily: FB, fontWeight: 500,
                  color: accent, background: accentBg, border: `1px solid ${accentBdr}`,
                }}>
                  {t}
                </Box>
              ))}
            </Box>
          )}
        </Box>
      </Box>
    </motion.div>
  );
};

export default function Experience() {
  const theme   = useTheme();
  const isLight = theme.palette.mode === 'light';
  const [items,   setItems]   = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    trackPageVisit('/experience');
    fetch(`${API}/experiences`)
      .then(r => r.json())
      .then(d => setItems(Array.isArray(d) ? d.sort((a, b) => a.order - b.order) : []))
      .catch(() => {})
      .finally(() => setLoading(false));
    return () => trackPageLeave('/experience');
  }, []);

  const accent = isLight ? '#4f46e5' : '#818cf8';

  return (
    <Box sx={{
      background: theme.palette.background.default,
      minHeight: '100vh', pt: { xs: 12, md: 14 }, pb: 14,
      transition: 'background 0.3s ease',
    }}>
      <Container maxWidth="md">

        {/* Page header */}
        <motion.div {...fadeView()}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2 }}>
            <Box sx={{
              width: 28, height: 28, borderRadius: '8px',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              background: isLight ? 'rgba(79,70,229,0.09)' : 'rgba(129,140,248,0.12)',
              border: `1px solid ${isLight ? 'rgba(79,70,229,0.18)' : 'rgba(129,140,248,0.22)'}`,
            }}>
              <Typography sx={{ fontFamily: FM, fontSize: '0.6rem', fontWeight: 700, color: accent }}>02</Typography>
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
            Experience
          </Typography>
          <Typography sx={{ fontFamily: FB, color: theme.palette.text.secondary, fontSize: '1rem', mb: { xs: 8, md: 10 }, maxWidth: 400 }}>
            Where I've worked and what I've built.
          </Typography>
        </motion.div>

        {/* Timeline */}
        {loading ? (
          [1, 2, 3].map(k => (
            <Box key={k} sx={{ display: 'flex', gap: 4, mb: 4 }}>
              <Skeleton variant="circular" width={40} height={40} sx={{ flexShrink: 0 }} />
              <Skeleton variant="rounded" height={200} sx={{ flex: 1, borderRadius: '16px' }} />
            </Box>
          ))
        ) : items.length === 0 ? (
          <Box sx={{ textAlign: 'center', py: 12 }}>
            <Work sx={{ fontSize: 56, color: theme.palette.divider, mb: 2 }} />
            <Typography sx={{ fontFamily: FB, color: theme.palette.text.secondary }}>
              Experience will appear here once added via Admin.
            </Typography>
          </Box>
        ) : (
          <Box>
            {items.map((item, i) => (
              <TimelineCard key={item._id} item={item} index={i} isLast={i === items.length - 1} />
            ))}
          </Box>
        )}
      </Container>
    </Box>
  );
}
