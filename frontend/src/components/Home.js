import React, { useEffect, useRef, useState } from 'react';
import { Container, Typography, Box, Grid, Chip, Skeleton, Avatar } from '@mui/material';
import { motion } from 'framer-motion';
import { GitHub, LinkedIn, WhatsApp, OpenInNew, Code, ArrowForward, Visibility, Instagram, KeyboardArrowDown } from '@mui/icons-material';
import { Link as RouterLink } from 'react-router-dom';
import { useTheme } from '@mui/material/styles';
import ContactForm from './ContactForm';
import SleepingCat from './SleepingCat';
import { trackPageVisit, trackPageLeave, trackProject } from '../utils/tracker';
import API from '../utils/config';

const FH = "'Plus Jakarta Sans', sans-serif";
const FB = "'Inter', sans-serif";
const FM = "'JetBrains Mono', monospace";

const fade = (delay = 0) => ({
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.5, delay, ease: [0.22, 1, 0.36, 1] },
});

const fadeView = (delay = 0) => ({
  initial: { opacity: 0, y: 20 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true },
  transition: { duration: 0.5, delay, ease: [0.22, 1, 0.36, 1] },
});

/* â”€â”€ Section heading â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€ */
const SectionLabel = ({ num, children }) => {
  const theme   = useTheme();
  const isLight = theme.palette.mode === 'light';
  return (
    <motion.div {...fadeView()}>
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2 }}>
        <Box sx={{
          width: 28, height: 28, borderRadius: '8px', flexShrink: 0,
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          background: isLight ? 'rgba(79,70,229,0.09)' : 'rgba(129,140,248,0.12)',
          border: `1px solid ${isLight ? 'rgba(79,70,229,0.18)' : 'rgba(129,140,248,0.22)'}`,
        }}>
          <Typography sx={{ fontFamily: FM, fontSize: '0.6rem', fontWeight: 700, color: isLight ? '#4f46e5' : '#818cf8' }}>
            {num}
          </Typography>
        </Box>
        <Box sx={{ height: 1, flex: 1, background: theme.palette.divider }} />
      </Box>
      <Typography sx={{
        fontFamily: FH, fontWeight: 800,
        fontSize: { xs: '2rem', sm: '2.4rem', md: '2.8rem' },
        color: theme.palette.text.primary, letterSpacing: '-0.04em',
        lineHeight: 1.08, mb: 1.5,
      }}>
        {children}
      </Typography>
    </motion.div>
  );
};

/* â”€â”€ Skill tag â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€ */
const SkillTag = ({ skill, index }) => {
  const theme   = useTheme();
  const isLight = theme.palette.mode === 'light';
  return (
    <motion.span
      initial={{ opacity: 0, scale: 0.88 }}
      whileInView={{ opacity: 1, scale: 1 }}
      viewport={{ once: true }}
      transition={{ duration: 0.28, delay: index * 0.02 }}
      style={{ display: 'inline-block', margin: '4px 5px' }}
    >
      <Box sx={{
        display: 'inline-flex', alignItems: 'center',
        px: 2, py: 0.75, borderRadius: '30px', cursor: 'default',
        background: isLight ? 'rgba(79,70,229,0.06)' : 'rgba(129,140,248,0.08)',
        border: `1px solid ${isLight ? 'rgba(79,70,229,0.14)' : 'rgba(129,140,248,0.17)'}`,
        transition: 'all 0.18s ease',
        '&:hover': {
          background: isLight ? 'rgba(79,70,229,0.12)' : 'rgba(129,140,248,0.16)',
          borderColor: isLight ? 'rgba(79,70,229,0.28)' : 'rgba(129,140,248,0.34)',
          transform: 'translateY(-1px)',
        },
      }}>
        <Typography sx={{ fontSize: '0.8rem', fontWeight: 500, fontFamily: FB, color: isLight ? '#4338ca' : '#a5b4fc' }}>
          {skill}
        </Typography>
      </Box>
    </motion.span>
  );
};

/* â”€â”€ Wide featured project card â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€ */
const FeaturedCard = ({ project }) => {
  const theme   = useTheme();
  const isLight = theme.palette.mode === 'light';
  const viewRef = useRef(null);
  const t0      = useRef(null);
  const viewed  = useRef(false);

  const accent      = isLight ? '#4f46e5' : '#818cf8';
  const accentBg    = isLight ? 'rgba(79,70,229,0.06)' : 'rgba(129,140,248,0.09)';
  const accentBdr   = isLight ? 'rgba(79,70,229,0.18)' : 'rgba(129,140,248,0.22)';
  const accentLight = isLight ? '#a5b4fc' : '#c7d2fe';
  const teal        = isLight ? '#0891b2' : '#22d3ee';
  const tealBg      = isLight ? 'rgba(8,145,178,0.06)' : 'rgba(34,211,238,0.07)';
  const tealBdr     = isLight ? 'rgba(8,145,178,0.18)' : 'rgba(34,211,238,0.18)';

  return (
    <motion.div
      ref={viewRef}
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      onViewportEnter={() => {
        if (!viewed.current && project._id) { viewed.current = true; t0.current = Date.now(); trackProject(project._id, 'view'); }
      }}
      onViewportLeave={() => {
        if (t0.current && project._id) { const s = Math.round((Date.now() - t0.current) / 1000); if (s > 1) trackProject(project._id, 'time', s); t0.current = null; }
      }}
      transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
    >
      <Box sx={{
        borderRadius: '20px', overflow: 'hidden',
        background: theme.palette.background.paper,
        border: `1px solid ${theme.palette.divider}`,
        boxShadow: isLight ? '0 2px 8px rgba(0,0,0,0.06), 0 8px 24px rgba(0,0,0,0.04)' : '0 8px 32px rgba(0,0,0,0.3)',
        display: 'flex', flexDirection: { xs: 'column', md: 'row' },
        transition: 'box-shadow 0.25s ease, border-color 0.25s ease',
        '&:hover': {
          boxShadow: isLight ? '0 8px 28px rgba(0,0,0,0.1)' : '0 12px 40px rgba(0,0,0,0.4)',
          borderColor: isLight ? 'rgba(79,70,229,0.28)' : 'rgba(129,140,248,0.28)',
        },
      }}>
        {/* Image side */}
        <Box sx={{
          width: { xs: '100%', md: '48%' }, flexShrink: 0,
          minHeight: { xs: 220, md: 340 },
          background: isLight ? 'linear-gradient(135deg, #ede9fe, #e0f2fe)' : 'linear-gradient(135deg, #1e1b4b, #0c1a2e)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          position: 'relative', overflow: 'hidden',
        }}>
          {(project.imageUrl || project.imageData)
            ? <Box component="img" src={project.imageUrl || project.imageData} alt={project.title}
                sx={{ width: '100%', height: '100%', objectFit: 'cover', position: 'absolute', inset: 0 }} />
            : <Code sx={{ fontSize: 64, color: isLight ? 'rgba(79,70,229,0.25)' : 'rgba(129,140,248,0.2)' }} />
          }
          {/* Featured badge */}
          <Box sx={{
            position: 'absolute', top: 16, left: 16,
            px: 1.6, py: 0.5, borderRadius: '20px',
            background: `linear-gradient(135deg, ${accent}, ${teal})`,
            boxShadow: '0 2px 8px rgba(0,0,0,0.15)',
          }}>
            <Typography sx={{ fontFamily: FB, fontSize: '0.68rem', fontWeight: 700, color: '#fff', letterSpacing: '0.06em' }}>
              FEATURED
            </Typography>
          </Box>
          {project.engagement?.views > 0 && (
            <Box sx={{ position: 'absolute', top: 16, right: 16 }}>
              <Chip icon={<Visibility sx={{ fontSize: '11px !important' }} />} label={project.engagement.views} size="small"
                sx={{ background: isLight ? 'rgba(255,255,255,0.9)' : 'rgba(15,23,42,0.8)', fontSize: '0.65rem', fontFamily: FB, backdropFilter: 'blur(8px)' }} />
            </Box>
          )}
        </Box>

        {/* Content side */}
        <Box sx={{ p: { xs: 3, md: 4.5 }, display: 'flex', flexDirection: 'column', justifyContent: 'center', flex: 1 }}>
          <Typography sx={{ fontFamily: FH, fontWeight: 800, fontSize: { xs: '1.3rem', md: '1.6rem' }, letterSpacing: '-0.03em', color: theme.palette.text.primary, mb: 1.5 }}>
            {project.title}
          </Typography>
          <Typography sx={{ fontFamily: FB, color: theme.palette.text.secondary, lineHeight: 1.8, fontSize: '0.9rem', mb: 3, display: '-webkit-box', WebkitLineClamp: 4, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
            {project.description}
          </Typography>
          <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.8, mb: 3.5 }}>
            {(project.techStack || []).slice(0, 6).map(t => (
              <Box key={t} sx={{ px: 1.4, py: 0.35, borderRadius: '6px', fontSize: '0.72rem', fontFamily: FB, fontWeight: 500, color: accent, background: accentBg, border: `1px solid ${accentBdr}` }}>
                {t}
              </Box>
            ))}
          </Box>
          <Box sx={{ display: 'flex', gap: 1.5, flexWrap: 'wrap' }}>
            {project.githubUrl && (
              <Box component="a" href={project.githubUrl} target="_blank" rel="noopener"
                onClick={() => project._id && trackProject(project._id, 'github_click')}
                sx={{
                  display: 'inline-flex', alignItems: 'center', gap: 0.8, px: 2.5, py: 1, borderRadius: '10px', textDecoration: 'none',
                  fontFamily: FB, fontSize: '0.85rem', fontWeight: 600, color: accent, background: accentBg, border: `1px solid ${accentBdr}`,
                  transition: 'all 0.18s ease', '&:hover': { background: isLight ? 'rgba(79,70,229,0.12)' : 'rgba(129,140,248,0.15)', borderColor: accentLight },
                }}>
                <GitHub sx={{ fontSize: 16 }} /> View Code
              </Box>
            )}
            {project.liveUrl && (
              <Box component="a" href={project.liveUrl} target="_blank" rel="noopener"
                onClick={() => project._id && trackProject(project._id, 'live_click')}
                sx={{
                  display: 'inline-flex', alignItems: 'center', gap: 0.8, px: 2.5, py: 1, borderRadius: '10px', textDecoration: 'none',
                  fontFamily: FB, fontSize: '0.85rem', fontWeight: 600, color: '#fff', background: `linear-gradient(135deg, ${accent}, ${teal})`,
                  boxShadow: isLight ? '0 4px 14px rgba(79,70,229,0.3)' : '0 4px 14px rgba(129,140,248,0.25)',
                  transition: 'filter 0.18s ease', '&:hover': { filter: 'brightness(1.08)' },
                }}>
                <OpenInNew sx={{ fontSize: 16 }} /> Live Demo
              </Box>
            )}
          </Box>
        </Box>
      </Box>
    </motion.div>
  );
};

/* â”€â”€ Regular project card â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€ */
const ProjectCard = ({ project, index }) => {
  const theme   = useTheme();
  const isLight = theme.palette.mode === 'light';
  const viewRef = useRef(null);
  const t0      = useRef(null);
  const viewed  = useRef(false);

  const accent      = isLight ? '#4f46e5' : '#818cf8';
  const accentBg    = isLight ? 'rgba(79,70,229,0.06)' : 'rgba(129,140,248,0.09)';
  const accentBdr   = isLight ? 'rgba(79,70,229,0.18)' : 'rgba(129,140,248,0.22)';
  const accentLight = isLight ? '#a5b4fc' : '#c7d2fe';
  const teal        = isLight ? '#0891b2' : '#22d3ee';
  const tealBg      = isLight ? 'rgba(8,145,178,0.06)' : 'rgba(34,211,238,0.07)';
  const tealBdr     = isLight ? 'rgba(8,145,178,0.18)' : 'rgba(34,211,238,0.18)';

  return (
    <motion.div
      ref={viewRef}
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      onViewportEnter={() => {
        if (!viewed.current && project._id) { viewed.current = true; t0.current = Date.now(); trackProject(project._id, 'view'); }
      }}
      onViewportLeave={() => {
        if (t0.current && project._id) { const s = Math.round((Date.now() - t0.current) / 1000); if (s > 1) trackProject(project._id, 'time', s); t0.current = null; }
      }}
      transition={{ duration: 0.42, delay: index * 0.07, ease: [0.22, 1, 0.36, 1] }}
      style={{ height: '100%' }}
    >
      <Box sx={{
        height: '100%', borderRadius: '16px', overflow: 'hidden',
        background: theme.palette.background.paper,
        border: `1px solid ${theme.palette.divider}`,
        boxShadow: isLight ? '0 1px 4px rgba(0,0,0,0.05)' : '0 4px 20px rgba(0,0,0,0.22)',
        transition: 'box-shadow 0.22s ease, border-color 0.22s ease, transform 0.22s ease',
        '&:hover': {
          transform: 'translateY(-3px)',
          boxShadow: isLight ? '0 8px 28px rgba(0,0,0,0.1)' : '0 12px 36px rgba(0,0,0,0.38)',
          borderColor: isLight ? 'rgba(79,70,229,0.28)' : 'rgba(129,140,248,0.28)',
        },
      }}>
        {/* Image */}
        <Box sx={{
          height: 200, overflow: 'hidden', position: 'relative',
          background: isLight ? 'linear-gradient(135deg, #ede9fe, #e0f2fe)' : 'linear-gradient(135deg, #1e1b4b, #0c1a2e)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
        }}>
          {(project.imageUrl || project.imageData)
            ? <Box component="img" src={project.imageUrl || project.imageData} alt={project.title}
                sx={{ width: '100%', height: '100%', objectFit: 'cover', transition: 'transform 0.4s ease', '.MuiBox-root:hover &': { transform: 'scale(1.04)' } }} />
            : <Code sx={{ fontSize: 48, color: isLight ? 'rgba(79,70,229,0.2)' : 'rgba(129,140,248,0.18)' }} />
          }
          {project.engagement?.views > 0 && (
            <Box sx={{ position: 'absolute', top: 10, right: 10 }}>
              <Chip icon={<Visibility sx={{ fontSize: '11px !important' }} />} label={project.engagement.views} size="small"
                sx={{ background: isLight ? 'rgba(255,255,255,0.9)' : 'rgba(15,23,42,0.8)', fontSize: '0.65rem', fontFamily: FB, backdropFilter: 'blur(8px)' }} />
            </Box>
          )}
        </Box>

        {/* Content */}
        <Box sx={{ p: 3 }}>
          <Typography sx={{ fontWeight: 700, color: theme.palette.text.primary, mb: 0.75, fontFamily: FH, fontSize: '1rem', letterSpacing: '-0.02em' }}>
            {project.title}
          </Typography>
          <Typography sx={{ color: theme.palette.text.secondary, lineHeight: 1.75, mb: 2.5, fontSize: '0.84rem', fontFamily: FB, display: '-webkit-box', WebkitLineClamp: 3, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
            {project.description}
          </Typography>
          <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.6, mb: 2.5 }}>
            {(project.techStack || []).slice(0, 5).map(t => (
              <Box key={t} sx={{ px: 1.4, py: 0.35, borderRadius: '6px', fontSize: '0.72rem', fontFamily: FB, fontWeight: 500, color: accent, background: accentBg, border: `1px solid ${accentBdr}` }}>
                {t}
              </Box>
            ))}
          </Box>
          <Box sx={{ display: 'flex', gap: 1.2 }}>
            {project.githubUrl && (
              <Box component="a" href={project.githubUrl} target="_blank" rel="noopener"
                onClick={() => project._id && trackProject(project._id, 'github_click')}
                sx={{ display: 'inline-flex', alignItems: 'center', gap: 0.7, px: 2, py: 0.8, borderRadius: '8px', textDecoration: 'none', fontFamily: FB, fontSize: '0.78rem', fontWeight: 600, color: accent, background: accentBg, border: `1px solid ${accentBdr}`, transition: 'all 0.18s', '&:hover': { borderColor: accentLight } }}>
                <GitHub sx={{ fontSize: 13 }} /> Code
              </Box>
            )}
            {project.liveUrl && (
              <Box component="a" href={project.liveUrl} target="_blank" rel="noopener"
                onClick={() => project._id && trackProject(project._id, 'live_click')}
                sx={{ display: 'inline-flex', alignItems: 'center', gap: 0.7, px: 2, py: 0.8, borderRadius: '8px', textDecoration: 'none', fontFamily: FB, fontSize: '0.78rem', fontWeight: 600, color: teal, background: tealBg, border: `1px solid ${tealBdr}`, transition: 'all 0.18s', '&:hover': { background: isLight ? 'rgba(8,145,178,0.12)' : 'rgba(34,211,238,0.12)' } }}>
                <OpenInNew sx={{ fontSize: 13 }} /> Live
              </Box>
            )}
          </Box>
        </Box>
      </Box>
    </motion.div>
  );
};

/* â”€â”€ MAIN â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€ */
export default function Home() {
  const theme   = useTheme();
  const isLight = theme.palette.mode === 'light';
  const [profile,  setProfile]  = useState(null);
  const [projects, setProjects] = useState([]);
  const [loading,  setLoading]  = useState(true);

  useEffect(() => {
    trackPageVisit('/');
    (async () => {
      try {
        const [prof, proj] = await Promise.all([
          fetch(`${API}/profile`).then(r => r.json()),
          fetch(`${API}/projects`).then(r => r.json()),
        ]);
        setProfile(prof);
        setProjects(Array.isArray(proj) ? proj : []);
      } catch {}
      finally { setLoading(false); }
    })();
    return () => trackPageLeave('/');
  }, []);

  const skills = profile?.featuredSkills
    ? profile.featuredSkills.split(',').map(s => s.trim()).filter(Boolean)
    : [];

  const [featured, ...rest] = projects;

  const socials = [
    { key: 'github',    icon: <GitHub fontSize="small" /> },
    { key: 'linkedin',  icon: <LinkedIn fontSize="small" /> },
    { key: 'whatsapp',  icon: <WhatsApp fontSize="small" /> },
    { key: 'instagram', icon: <Instagram fontSize="small" /> },
  ].filter(s => profile?.[s.key]);

  const accent    = isLight ? '#4f46e5' : '#818cf8';
  const accentBg  = isLight ? 'rgba(79,70,229,0.07)' : 'rgba(129,140,248,0.1)';
  const accentBdr = isLight ? 'rgba(79,70,229,0.18)' : 'rgba(129,140,248,0.22)';
  const teal      = isLight ? '#0891b2' : '#22d3ee';
  const green     = isLight ? '#16a34a' : '#4ade80';
  const greenBg   = isLight ? 'rgba(22,163,74,0.07)' : 'rgba(74,222,128,0.08)';
  const greenBdr  = isLight ? 'rgba(22,163,74,0.22)' : 'rgba(74,222,128,0.22)';

  return (
    <Box sx={{ background: theme.palette.background.default, minHeight: '100vh', transition: 'background 0.3s ease' }}>

      {/* â”€â”€ HERO â”€â”€ */}
      <Box sx={{
        minHeight: '100vh', display: 'flex', alignItems: 'center', pt: { xs: 10, md: 0 },
        position: 'relative', overflow: 'hidden',
        /* Subtle radial gradient background */
        '&::before': {
          content: '""', position: 'absolute', inset: 0, pointerEvents: 'none',
          background: isLight
            ? 'radial-gradient(ellipse 80% 60% at 70% 30%, rgba(79,70,229,0.06) 0%, transparent 70%), radial-gradient(ellipse 60% 50% at 20% 80%, rgba(8,145,178,0.05) 0%, transparent 70%)'
            : 'radial-gradient(ellipse 80% 60% at 70% 20%, rgba(129,140,248,0.07) 0%, transparent 70%), radial-gradient(ellipse 60% 50% at 15% 80%, rgba(34,211,238,0.05) 0%, transparent 70%)',
        },
      }}>
        <Container maxWidth="xl" sx={{ py: { xs: 6, md: 8 }, position: 'relative', zIndex: 1 }}>
          <Grid container spacing={{ xs: 6, md: 8 }} alignItems="center">

            {/* Left: Text */}
            <Grid item xs={12} md={7}>
              {/* Available badge */}
              <motion.div {...fade(0)}>
                <Box sx={{
                  display: 'inline-flex', alignItems: 'center', gap: 1,
                  px: 2, py: 0.7, mb: 4, borderRadius: '30px',
                  background: greenBg, border: `1px solid ${greenBdr}`,
                }}>
                  <Box sx={{
                    width: 7, height: 7, borderRadius: '50%', background: green,
                    '@keyframes pulse': { '0%,100%': { opacity: 1, transform: 'scale(1)' }, '50%': { opacity: 0.5, transform: 'scale(1.6)' } },
                    animation: 'pulse 2s ease-in-out infinite',
                  }} />
                  <Typography sx={{ fontFamily: FB, fontSize: '0.78rem', fontWeight: 600, color: green, letterSpacing: '0.07em', textTransform: 'uppercase' }}>
                    {loading ? <Skeleton width={120} /> : (profile?.heroTagline || 'Available for Work')}
                  </Typography>
                </Box>
              </motion.div>

              {/* Gradient name */}
              <motion.div {...fade(0.08)}>
                {loading
                  ? <Skeleton width="75%" height={90} sx={{ mb: 1.5, borderRadius: '12px' }} />
                  : (
                    <Typography component="h1" sx={{
                      fontFamily: FH, fontWeight: 800,
                      fontSize: { xs: '2.8rem', sm: '3.4rem', md: '4.2rem', lg: '5rem' },
                      letterSpacing: '-0.04em', lineHeight: 1.05, mb: 1.5,
                      background: isLight
                        ? 'linear-gradient(135deg, #1e1b4b 0%, #4f46e5 45%, #0891b2 100%)'
                        : 'linear-gradient(135deg, #e2e8f0 0%, #818cf8 45%, #22d3ee 100%)',
                      WebkitBackgroundClip: 'text',
                      WebkitTextFillColor: 'transparent',
                      backgroundClip: 'text',
                    }}>
                      {profile?.name || 'Your Name'}
                    </Typography>
                  )
                }
              </motion.div>

              {/* Role + subtitle */}
              <motion.div {...fade(0.15)}>
                <Typography sx={{ fontFamily: FH, fontSize: { xs: '1rem', md: '1.2rem' }, fontWeight: 600, color: accent, mb: 0.5 }}>
                  {loading ? <Skeleton width="50%" /> : (profile?.title || 'Full Stack Developer')}
                </Typography>
                {profile?.subtitle && (
                  <Typography sx={{ fontFamily: FM, fontSize: '0.88rem', color: theme.palette.text.secondary, fontWeight: 500, mb: 3, letterSpacing: '0.02em' }}>
                    {profile.subtitle}
                  </Typography>
                )}
              </motion.div>

              {/* Bio */}
              <motion.div {...fade(0.22)}>
                <Typography sx={{ fontFamily: FB, color: theme.palette.text.secondary, lineHeight: 1.85, fontSize: '1rem', maxWidth: 540, mb: 5 }}>
                  {loading ? [1, 2, 3].map(k => <Skeleton key={k} sx={{ mb: 0.5 }} />) : (profile?.bio || '')}
                </Typography>
              </motion.div>

              {/* CTAs */}
              <motion.div {...fade(0.3)}>
                <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 2, mb: 5, alignItems: 'center' }}>
                  <Box component={RouterLink} to="/about" sx={{
                    display: 'inline-flex', alignItems: 'center', gap: 1, px: 3.5, py: 1.4,
                    borderRadius: '10px', textDecoration: 'none', fontFamily: FB, fontSize: '0.95rem', fontWeight: 700, color: '#fff',
                    background: `linear-gradient(135deg, ${accent}, ${teal})`,
                    boxShadow: isLight ? '0 4px 16px rgba(79,70,229,0.35)' : '0 4px 16px rgba(129,140,248,0.3)',
                    transition: 'all 0.2s ease',
                    '&:hover': { transform: 'translateY(-1px)', boxShadow: isLight ? '0 8px 24px rgba(79,70,229,0.45)' : '0 8px 24px rgba(129,140,248,0.4)' },
                  }}>
                    {profile?.ctaText || 'About Me'} <ArrowForward sx={{ fontSize: 17 }} />
                  </Box>
                  {profile?.resumeUrl && (
                    <Box component="a" href={profile.resumeUrl} target="_blank" rel="noopener" sx={{
                      display: 'inline-flex', alignItems: 'center', gap: 1, px: 3.5, py: 1.4,
                      borderRadius: '10px', textDecoration: 'none', fontFamily: FB, fontSize: '0.95rem', fontWeight: 600,
                      color: theme.palette.text.primary,
                      border: `1.5px solid ${theme.palette.divider}`,
                      background: theme.palette.background.paper,
                      transition: 'all 0.2s ease',
                      '&:hover': { borderColor: accent, color: accent },
                    }}>
                      Resume â†—
                    </Box>
                  )}
                </Box>

                {/* Socials */}
                <Box sx={{ display: 'flex', gap: 1.5, flexWrap: 'wrap' }}>
                  {socials.map(s => (
                    <Box key={s.key} component="a" href={profile[s.key]} target="_blank" rel="noopener" sx={{
                      width: 42, height: 42, borderRadius: '11px',
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                      color: theme.palette.text.secondary,
                      border: `1.5px solid ${theme.palette.divider}`,
                      background: theme.palette.background.paper,
                      transition: 'all 0.18s ease',
                      '&:hover': { color: accent, borderColor: accent, background: accentBg, transform: 'translateY(-2px)' },
                    }}>
                      {s.icon}
                    </Box>
                  ))}
                </Box>
              </motion.div>
            </Grid>

            {/* Right: Profile visual */}
            <Grid item xs={12} md={5} sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
              <motion.div {...fade(0.12)} style={{ position: 'relative' }}>
                {/* Spinning gradient ring */}
                <Box sx={{
                  width: { xs: 250, md: 310 }, height: { xs: 250, md: 310 },
                  borderRadius: '50%', p: '3px',
                  background: isLight
                    ? 'conic-gradient(from 0deg, #4f46e5, #0891b2, #059669, #4f46e5)'
                    : 'conic-gradient(from 0deg, #818cf8, #22d3ee, #4ade80, #818cf8)',
                  '@keyframes spinRing': { from: { transform: 'rotate(0deg)' }, to: { transform: 'rotate(360deg)' } },
                  animation: 'spinRing 8s linear infinite',
                  boxShadow: isLight
                    ? '0 20px 60px rgba(79,70,229,0.2), 0 8px 24px rgba(0,0,0,0.08)'
                    : '0 20px 60px rgba(129,140,248,0.2)',
                }}>
                  <Box sx={{ width: '100%', height: '100%', borderRadius: '50%', overflow: 'hidden', background: isLight ? '#e0e7ff' : '#1e293b' }}>
                    {profile?.profileImage
                      ? <Box component="img" src={profile.profileImage} alt={profile.name || 'Profile'}
                          sx={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                      : <Avatar sx={{ width: '100%', height: '100%', borderRadius: '50%', fontSize: { xs: '4rem', md: '5rem' }, background: 'transparent', color: accent }}>
                          {profile?.name?.[0]?.toUpperCase() || '?'}
                        </Avatar>
                    }
                  </Box>
                </Box>

                {/* Floating badge â€” top right */}
                <motion.div
                  animate={{ y: [0, -6, 0] }}
                  transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
                  style={{ position: 'absolute', top: '5%', right: '-12%' }}
                >
                  <Box sx={{
                    px: 2, py: 1.4, borderRadius: '14px', textAlign: 'center', minWidth: 82,
                    background: theme.palette.background.paper,
                    border: `1px solid ${theme.palette.divider}`,
                    boxShadow: isLight ? '0 6px 20px rgba(0,0,0,0.1)' : '0 6px 20px rgba(0,0,0,0.4)',
                  }}>
                    <Typography sx={{ fontFamily: FH, fontWeight: 800, fontSize: '1.6rem', color: accent, lineHeight: 1 }}>
                      {projects.length || '0'}
                    </Typography>
                    <Typography sx={{ fontFamily: FB, fontSize: '0.68rem', color: theme.palette.text.secondary, mt: 0.4 }}>
                      Projects
                    </Typography>
                  </Box>
                </motion.div>

                {/* Floating badge â€” bottom left */}
                <motion.div
                  animate={{ y: [0, 6, 0] }}
                  transition={{ duration: 3.5, repeat: Infinity, ease: 'easeInOut', delay: 0.5 }}
                  style={{ position: 'absolute', bottom: '8%', left: '-16%' }}
                >
                  <Box sx={{
                    px: 2, py: 1.4, borderRadius: '14px', textAlign: 'center', minWidth: 100,
                    background: theme.palette.background.paper,
                    border: `1px solid ${theme.palette.divider}`,
                    boxShadow: isLight ? '0 6px 20px rgba(0,0,0,0.1)' : '0 6px 20px rgba(0,0,0,0.4)',
                  }}>
                    <Typography sx={{ fontFamily: FH, fontWeight: 700, fontSize: '1.05rem', color: teal, lineHeight: 1 }}>
                      Full Stack
                    </Typography>
                    <Typography sx={{ fontFamily: FB, fontSize: '0.68rem', color: theme.palette.text.secondary, mt: 0.4 }}>
                      Developer
                    </Typography>
                  </Box>
                </motion.div>
              </motion.div>
            </Grid>
          </Grid>
        </Container>

        {/* Lazy sleeping cat — bottom right corner of hero */}
        <Box sx={{
          position: 'absolute', bottom: { xs: 60, md: 24 }, right: { xs: 16, md: 48 },
          opacity: 0.88, display: { xs: 'none', sm: 'block' },
        }}>
          <motion.div
            animate={{ y: [0, -8, 0] }}
            transition={{ duration: 5, repeat: Infinity, ease: 'easeInOut' }}
          >
            <SleepingCat size={120} />
          </motion.div>
        </Box>

        {/* Scroll indicator */}
        <Box sx={{ position: 'absolute', bottom: 32, left: '50%', transform: 'translateX(-50%)' }}>
          <motion.div animate={{ y: [0, 6, 0] }} transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}>
            <KeyboardArrowDown sx={{ fontSize: 28, color: theme.palette.text.secondary, opacity: 0.4 }} />
          </motion.div>
        </Box>
      </Box>

      {/* â”€â”€ SKILLS â”€â”€ */}
      {(loading || skills.length > 0) && (
        <>
          <Box sx={{ borderTop: `1px solid ${theme.palette.divider}` }} />
          <Box sx={{ py: { xs: 8, md: 12 } }}>
            <Container maxWidth="xl">
              <SectionLabel num="02">Tech I work with</SectionLabel>
              <Typography sx={{ fontFamily: FB, color: theme.palette.text.secondary, fontSize: '0.92rem', mb: 6, maxWidth: 420 }}>
                The tools and technologies I use to build things that matter.
              </Typography>
              {loading
                ? <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                    {Array.from({ length: 20 }).map((_, i) => <Skeleton key={i} width={70 + (i % 6) * 16} height={36} sx={{ borderRadius: '30px' }} />)}
                  </Box>
                : <Box sx={{ lineHeight: 2.8 }}>
                    {skills.map((s, i) => <SkillTag key={s + i} skill={s} index={i} />)}
                  </Box>
              }
            </Container>
          </Box>
        </>
      )}

      {/* â”€â”€ PROJECTS â”€â”€ */}
      <>
        <Box sx={{ borderTop: `1px solid ${theme.palette.divider}` }} />
        <Box sx={{ py: { xs: 8, md: 12 } }}>
          <Container maxWidth="xl">
            <SectionLabel num="03">Projects</SectionLabel>
            <Typography sx={{ fontFamily: FB, color: theme.palette.text.secondary, fontSize: '0.92rem', mb: 6, maxWidth: 440 }}>
              Things I've built â€” side projects, client work, and open source.
            </Typography>

            {loading ? (
              <Grid container spacing={3}>
                {[1, 2, 3].map(k => (
                  <Grid key={k} item xs={12} sm={6} md={4}>
                    <Skeleton variant="rounded" height={360} sx={{ borderRadius: '16px' }} />
                  </Grid>
                ))}
              </Grid>
            ) : projects.length === 0 ? (
              <Box sx={{ textAlign: 'center', py: 12 }}>
                <Code sx={{ fontSize: 56, color: theme.palette.divider, mb: 2 }} />
                <Typography sx={{ fontFamily: FB, color: theme.palette.text.secondary, fontSize: '0.95rem' }}>
                  Projects will appear here once added via the Admin panel.
                </Typography>
              </Box>
            ) : (
              <>
                {featured && (
                  <Box sx={{ mb: 4 }}>
                    <FeaturedCard project={featured} />
                  </Box>
                )}
                {rest.length > 0 && (
                  <Grid container spacing={3}>
                    {rest.map((p, i) => (
                      <Grid key={p._id} item xs={12} sm={6} md={4}>
                        <ProjectCard project={p} index={i} />
                      </Grid>
                    ))}
                  </Grid>
                )}
              </>
            )}
          </Container>
        </Box>
      </>

      {/* â”€â”€ CONTACT â”€â”€ */}
      <Box sx={{
        py: { xs: 8, md: 12 },
        background: isLight
          ? 'linear-gradient(180deg, #f8fafc 0%, #f1f5f9 100%)'
          : 'rgba(15,23,42,0.5)',
        borderTop: `1px solid ${theme.palette.divider}`,
      }}>
        <Container maxWidth="md">
          <SectionLabel num="04">Get in touch</SectionLabel>
          <Typography sx={{ fontFamily: FB, color: theme.palette.text.secondary, fontSize: '0.92rem', mb: 6, maxWidth: 480 }}>
            Have a project in mind or just want to say hello? I'd love to hear from you.
          </Typography>
          <ContactForm />
        </Container>
      </Box>
    </Box>
  );
}
