import React, { useEffect, useRef, useState, useCallback } from 'react';
import { Container, Typography, Box, Grid, Button, Chip, Skeleton, Avatar, IconButton } from '@mui/material';
import { motion, useScroll, useTransform, useInView, AnimatePresence } from 'framer-motion';
import { GitHub, LinkedIn, WhatsApp, OpenInNew, TrendingUp, Visibility, Code } from '@mui/icons-material';
import { Link as RouterLink } from 'react-router-dom';
import ContactForm from './ContactForm';
import { trackPageVisit, trackPageLeave, trackProject } from '../utils/tracker';
import API from '../utils/config';

// ── Animated grid background ──────────────────────────────────────────────────
const GridBg = () => (
  <Box sx={{ position: 'fixed', inset: 0, zIndex: 0, overflow: 'hidden', pointerEvents: 'none' }}>
    <Box sx={{
      position: 'absolute', inset: 0,
      backgroundImage: `
        linear-gradient(rgba(124,92,255,0.04) 1px, transparent 1px),
        linear-gradient(90deg, rgba(124,92,255,0.04) 1px, transparent 1px)`,
      backgroundSize: '60px 60px',
    }} />
    <Box sx={{
      position: 'absolute', top: '10%', left: '5%', width: '40vw', height: '40vw', maxWidth: 600,
      background: 'radial-gradient(circle, rgba(124,92,255,0.12) 0%, transparent 70%)',
      filter: 'blur(40px)', animation: 'float1 8s ease-in-out infinite',
    }} />
    <Box sx={{
      position: 'absolute', bottom: '15%', right: '5%', width: '35vw', height: '35vw', maxWidth: 500,
      background: 'radial-gradient(circle, rgba(0,212,255,0.1) 0%, transparent 70%)',
      filter: 'blur(40px)', animation: 'float2 10s ease-in-out infinite',
    }} />
    <style>{`
      @keyframes float1 { 0%,100%{transform:translate(0,0) scale(1)} 50%{transform:translate(30px,-30px) scale(1.05)} }
      @keyframes float2 { 0%,100%{transform:translate(0,0) scale(1)} 50%{transform:translate(-20px,20px) scale(1.03)} }
    `}</style>
  </Box>
);

// ── Floating orb ──────────────────────────────────────────────────────────────
const Orb = ({ size, top, left, color, delay = 0 }) => (
  <Box sx={{
    position: 'absolute', width: size, height: size, borderRadius: '50%',
    background: `radial-gradient(circle, ${color} 0%, transparent 70%)`,
    top, left, filter: 'blur(60px)', opacity: 0.6, pointerEvents: 'none',
    animation: `orbFloat 6s ${delay}s ease-in-out infinite`,
  }} />
);

// ── Skill badge ───────────────────────────────────────────────────────────────
const SkillBadge = ({ skill, index }) => {
  const ref = useRef(null);
  const inView = useInView(ref, { once: false, amount: 0.5 });
  return (
    <motion.div ref={ref} initial={{ scale: 0, opacity: 0 }} animate={inView ? { scale: 1, opacity: 1 } : {}}
      transition={{ duration: 0.4, delay: index * 0.04, type: 'spring', stiffness: 200 }}>
      <Box sx={{
        display: 'inline-block', m: 0.4, px: 2, py: 0.8, borderRadius: '30px',
        background: 'rgba(124,92,255,0.08)', border: '1px solid rgba(124,92,255,0.25)',
        backdropFilter: 'blur(10px)', fontSize: '0.82rem', fontWeight: 600, color: '#a78bfa',
        cursor: 'default', transition: 'all 0.3s',
        '&:hover': { background: 'rgba(124,92,255,0.2)', border: '1px solid rgba(124,92,255,0.6)', color: '#fff', transform: 'translateY(-2px)' },
      }}>{skill}</Box>
    </motion.div>
  );
};

// ── Project card ──────────────────────────────────────────────────────────────
const ProjectCard = ({ project, index }) => {
  const ref      = useRef(null);
  const inView   = useInView(ref, { once: false, amount: 0.2 });
  const viewDone = useRef(false);
  const enterT   = useRef(null);

  useEffect(() => {
    if (inView && !viewDone.current && project._id) {
      viewDone.current = true; enterT.current = Date.now();
      trackProject(project._id, 'view');
    }
    if (!inView && enterT.current && project._id) {
      const s = Math.round((Date.now() - enterT.current) / 1000);
      if (s > 1) trackProject(project._id, 'time', s);
      enterT.current = null;
    }
  }, [inView, project._id]);

  const imgSrc = project.imageUrl || project.imageData;

  return (
    <Grid item xs={12} md={6} lg={4}>
      <motion.div ref={ref} initial={{ y: 60, opacity: 0 }} animate={inView ? { y: 0, opacity: 1 } : {}}
        transition={{ duration: 0.7, delay: index * 0.12, ease: [0.23, 1, 0.32, 1] }}
        onClick={() => project._id && trackProject(project._id, 'click')}>
        <Box sx={{
          height: '100%', borderRadius: '20px', overflow: 'hidden', cursor: 'pointer',
          background: 'rgba(255,255,255,0.03)', backdropFilter: 'blur(20px)',
          border: '1px solid rgba(124,92,255,0.15)',
          boxShadow: '0 8px 32px rgba(0,0,0,0.3)',
          transition: 'all 0.4s cubic-bezier(0.23,1,0.32,1)',
          '&:hover': { transform: 'translateY(-12px) scale(1.01)', border: '1px solid rgba(124,92,255,0.5)', boxShadow: '0 24px 60px rgba(124,92,255,0.2)' },
        }}>
          {/* Image */}
          <Box sx={{ position: 'relative', height: 200, overflow: 'hidden', background: 'rgba(124,92,255,0.06)' }}>
            {imgSrc
              ? <Box component="img" src={imgSrc} alt={project.title} sx={{ width: '100%', height: '100%', objectFit: 'cover', transition: 'transform 0.6s', '.MuiBox-root:hover &': { transform: 'scale(1.08)' } }} />
              : <Box sx={{ height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <Code sx={{ fontSize: 48, color: 'rgba(124,92,255,0.3)' }} />
                </Box>
            }
            <Box sx={{ position: 'absolute', inset: 0, background: 'linear-gradient(180deg,transparent 50%,rgba(10,15,30,0.8))' }} />
            <Box sx={{ position: 'absolute', top: 12, left: 12 }}>
              <Chip icon={<TrendingUp sx={{ fontSize: '12px !important', color: '#7c5cff !important' }} />}
                label={`#${index + 1}`} size="small"
                sx={{ background: 'rgba(10,15,30,0.8)', color: '#a78bfa', fontWeight: 700, fontSize: '0.7rem', border: '1px solid rgba(124,92,255,0.3)', backdropFilter: 'blur(10px)' }} />
            </Box>
            {project.engagement?.views > 0 && (
              <Box sx={{ position: 'absolute', top: 12, right: 12 }}>
                <Chip icon={<Visibility sx={{ fontSize: '11px !important', color: '#00d4ff !important' }} />}
                  label={project.engagement.views} size="small"
                  sx={{ background: 'rgba(10,15,30,0.8)', color: '#00d4ff', fontSize: '0.68rem', border: '1px solid rgba(0,212,255,0.2)', backdropFilter: 'blur(10px)' }} />
              </Box>
            )}
          </Box>

          {/* Content */}
          <Box sx={{ p: 3 }}>
            <Typography variant="h6" sx={{ fontWeight: 700, color: '#e0e6ff', mb: 1, fontFamily: "'Space Grotesk'" }}>{project.title}</Typography>
            <Typography variant="body2" sx={{ color: 'rgba(224,230,255,0.6)', lineHeight: 1.7, mb: 2, minHeight: 56, fontSize: '0.84rem' }}>
              {project.description}
            </Typography>
            <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5, mb: 2.5 }}>
              {(project.techStack || []).slice(0, 4).map(t => (
                <Chip key={t} label={t} size="small" sx={{ background: 'rgba(0,212,255,0.06)', color: '#00d4ff', fontSize: '0.68rem', border: '1px solid rgba(0,212,255,0.15)' }} />
              ))}
            </Box>
            <Box sx={{ display: 'flex', gap: 1 }}>
              {project.githubUrl && (
                <Button href={project.githubUrl} target="_blank" size="small" startIcon={<GitHub sx={{ fontSize: '14px !important' }} />}
                  onClick={() => project._id && trackProject(project._id, 'github_click')}
                  sx={{ flex: 1, py: 0.8, borderRadius: '10px', textTransform: 'none', fontWeight: 600, fontSize: '0.78rem', color: '#a78bfa', border: '1px solid rgba(124,92,255,0.25)', '&:hover': { background: 'rgba(124,92,255,0.15)', border: '1px solid rgba(124,92,255,0.5)' } }}>
                  Code
                </Button>
              )}
              {project.liveUrl && (
                <Button href={project.liveUrl} target="_blank" size="small" startIcon={<OpenInNew sx={{ fontSize: '14px !important' }} />}
                  onClick={() => project._id && trackProject(project._id, 'live_click')}
                  sx={{ flex: 1, py: 0.8, borderRadius: '10px', textTransform: 'none', fontWeight: 600, fontSize: '0.78rem', color: '#00d4ff', border: '1px solid rgba(0,212,255,0.25)', '&:hover': { background: 'rgba(0,212,255,0.1)', border: '1px solid rgba(0,212,255,0.5)' } }}>
                  Live
                </Button>
              )}
            </Box>
          </Box>
        </Box>
      </motion.div>
    </Grid>
  );
};

// ── Stat card ─────────────────────────────────────────────────────────────────
const StatCard = ({ icon, value, label }) => (
  <Box sx={{
    p: 3, borderRadius: '16px', textAlign: 'center',
    background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(124,92,255,0.15)',
    backdropFilter: 'blur(20px)', transition: 'all 0.3s',
    '&:hover': { border: '1px solid rgba(124,92,255,0.4)', transform: 'translateY(-4px)', boxShadow: '0 16px 40px rgba(124,92,255,0.15)' },
  }}>
    <Box sx={{ fontSize: '2rem', mb: 1 }}>{icon}</Box>
    <Typography sx={{ fontFamily: "'Orbitron'", fontSize: '2rem', fontWeight: 900, background: 'linear-gradient(135deg,#7c5cff,#00d4ff)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>{value}</Typography>
    <Typography sx={{ color: 'rgba(224,230,255,0.5)', fontSize: '0.8rem', mt: 0.5 }}>{label}</Typography>
  </Box>
);

// ── MAIN HOME ──────────────────────────────────────────────────────────────────
export default function Home() {
  const [profile,  setProfile]  = useState(null);
  const [projects, setProjects] = useState([]);
  const [loading,  setLoading]  = useState(true);
  const heroRef = useRef(null);
  const { scrollYProgress } = useScroll({ target: heroRef });
  const heroY   = useTransform(scrollYProgress, [0, 1], ['0%', '30%']);
  const heroOp  = useTransform(scrollYProgress, [0, 0.8], [1, 0]);

  useEffect(() => {
    trackPageVisit('/');
    const load = async () => {
      try {
        const [prof, proj] = await Promise.all([
          fetch(`${API}/profile`).then(r => r.json()),
          fetch(`${API}/projects`).then(r => r.json()),
        ]);
        setProfile(prof);
        setProjects(Array.isArray(proj) ? proj : []);
      } catch (e) {
        console.error(e);
      } finally {
        setLoading(false);
      }
    };
    load();
    return () => trackPageLeave('/');
  }, []);

  const skills = profile?.featuredSkills ? profile.featuredSkills.split(',').map(s => s.trim()).filter(Boolean) : [];

  return (
    <Box sx={{ background: '#0a0f1e', minHeight: '100vh', position: 'relative', overflow: 'hidden' }}>
      <GridBg />
      <style>{`@keyframes orbFloat{0%,100%{transform:translateY(0)}50%{transform:translateY(-20px)}}`}</style>

      {/* ── HERO ── */}
      <Box ref={heroRef} sx={{ minHeight: '100vh', display: 'flex', alignItems: 'center', position: 'relative', zIndex: 1 }}>
        <Orb size="500px" top="-100px" left="-100px" color="rgba(124,92,255,0.15)" delay={0} />
        <Orb size="400px" top="30%" left="60%" color="rgba(0,212,255,0.1)" delay={2} />

        <Container maxWidth="xl" sx={{ py: 8 }}>
          <Grid container spacing={6} alignItems="center">
            <Grid item xs={12} md={7}>
              <motion.div style={{ y: heroY, opacity: heroOp }}>
                <motion.div initial={{ opacity: 0, y: 40 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8 }}>
                  <Box sx={{
                    display: 'inline-block', px: 2, py: 0.6, mb: 3, borderRadius: '30px',
                    background: 'rgba(124,92,255,0.1)', border: '1px solid rgba(124,92,255,0.3)',
                    fontSize: '0.78rem', fontWeight: 700, color: '#a78bfa', letterSpacing: '0.2em', textTransform: 'uppercase',
                  }}>
                    {loading ? <Skeleton width={160} sx={{ bgcolor: 'rgba(255,255,255,0.05)' }} /> : (profile?.heroTagline || 'Available for Work')}
                  </Box>
                </motion.div>

                <motion.div initial={{ opacity: 0, y: 50 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.9, delay: 0.15 }}>
                  <Typography sx={{
                    fontFamily: "'Orbitron', sans-serif", fontWeight: 900, lineHeight: 1.1,
                    fontSize: { xs: '2.8rem', sm: '3.8rem', md: '5rem', lg: '6rem' },
                    background: 'linear-gradient(135deg, #ffffff 0%, #a78bfa 50%, #00d4ff 100%)',
                    WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent',
                    mb: 1,
                  }}>
                    {loading ? <Skeleton width="80%" height={100} sx={{ bgcolor: 'rgba(255,255,255,0.05)' }} /> : (profile?.name || '')}
                  </Typography>
                </motion.div>

                <motion.div initial={{ opacity: 0, y: 40 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8, delay: 0.3 }}>
                  <Typography sx={{
                    fontSize: { xs: '1.1rem', md: '1.5rem' }, fontWeight: 300, color: 'rgba(224,230,255,0.75)',
                    mb: 1, letterSpacing: '0.02em',
                  }}>
                    {loading ? <Skeleton width="60%" sx={{ bgcolor: 'rgba(255,255,255,0.05)' }} /> : (profile?.title || '')}
                  </Typography>
                  {profile?.subtitle && (
                    <Typography sx={{ fontSize: '0.95rem', color: '#00d4ff', fontWeight: 500, mb: 3 }}>{profile.subtitle}</Typography>
                  )}
                </motion.div>

                <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8, delay: 0.45 }}>
                  <Typography sx={{ color: 'rgba(224,230,255,0.55)', lineHeight: 1.9, fontSize: '1rem', maxWidth: 560, mb: 4 }}>
                    {loading ? [1,2,3].map(k => <Skeleton key={k} sx={{ bgcolor: 'rgba(255,255,255,0.05)' }} />) : (profile?.bio || '')}
                  </Typography>
                </motion.div>

                {/* CTA */}
                <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7, delay: 0.6 }}>
                  <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap', mb: 4 }}>
                    <Button component={RouterLink} to="/about" variant="contained" size="large" sx={{
                      px: 4, py: 1.5, borderRadius: '12px', textTransform: 'none', fontWeight: 700, fontSize: '1rem',
                      background: 'linear-gradient(135deg,#7c5cff,#00d4ff)', boxShadow: '0 8px 30px rgba(124,92,255,0.4)',
                      '&:hover': { boxShadow: '0 12px 40px rgba(124,92,255,0.6)', transform: 'translateY(-2px)' },
                      transition: 'all 0.3s',
                    }}>{profile?.ctaText || 'About Me'}</Button>
                    {profile?.resumeUrl && (
                      <Button href={profile.resumeUrl} target="_blank" size="large" sx={{
                        px: 4, py: 1.5, borderRadius: '12px', textTransform: 'none', fontWeight: 700, fontSize: '1rem',
                        border: '1px solid rgba(124,92,255,0.4)', color: '#a78bfa',
                        '&:hover': { background: 'rgba(124,92,255,0.1)', borderColor: '#7c5cff' },
                      }}>Resume</Button>
                    )}
                  </Box>
                  <Box sx={{ display: 'flex', gap: 1.5 }}>
                    {profile?.github && <IconButton href={profile.github} target="_blank" sx={{ color: 'rgba(224,230,255,0.5)', border: '1px solid rgba(255,255,255,0.1)', '&:hover': { color: '#fff', borderColor: '#7c5cff', background: 'rgba(124,92,255,0.15)' } }}><GitHub /></IconButton>}
                    {profile?.linkedin && <IconButton href={profile.linkedin} target="_blank" sx={{ color: 'rgba(224,230,255,0.5)', border: '1px solid rgba(255,255,255,0.1)', '&:hover': { color: '#00d4ff', borderColor: '#00d4ff', background: 'rgba(0,212,255,0.1)' } }}><LinkedIn /></IconButton>}
                    {profile?.whatsapp && <IconButton href={profile.whatsapp} target="_blank" sx={{ color: 'rgba(224,230,255,0.5)', border: '1px solid rgba(255,255,255,0.1)', '&:hover': { color: '#25d366', borderColor: '#25d366', background: 'rgba(37,211,102,0.1)' } }}><WhatsApp /></IconButton>}
                  </Box>
                </motion.div>
              </motion.div>
            </Grid>

            {/* Avatar / Profile image */}
            <Grid item xs={12} md={5} sx={{ display: 'flex', justifyContent: 'center', position: 'relative' }}>
              <motion.div initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 1, delay: 0.4, ease: [0.23,1,0.32,1] }}>
                <Box sx={{ position: 'relative' }}>
                  {/* Glow rings */}
                  <Box sx={{ position: 'absolute', inset: -20, borderRadius: '50%', border: '1px solid rgba(124,92,255,0.2)', animation: 'spin 20s linear infinite', '@keyframes spin': { '100%': { transform: 'rotate(360deg)' } } }} />
                  <Box sx={{ position: 'absolute', inset: -40, borderRadius: '50%', border: '1px dashed rgba(0,212,255,0.15)', animation: 'spin 30s linear infinite reverse' }} />
                  <Avatar src={profile?.profileImage} sx={{
                    width: { xs: 220, md: 320, lg: 380 }, height: { xs: 220, md: 320, lg: 380 },
                    border: '3px solid transparent',
                    background: 'linear-gradient(#0a0f1e,#0a0f1e) padding-box, linear-gradient(135deg,#7c5cff,#00d4ff) border-box',
                    boxShadow: '0 0 80px rgba(124,92,255,0.3)',
                    fontSize: '6rem',
                  }}>
                    {profile?.name?.[0] || ''}
                  </Avatar>
                </Box>
              </motion.div>
            </Grid>
          </Grid>
        </Container>

        {/* Scroll indicator */}
        <motion.div animate={{ y: [0,10,0] }} transition={{ repeat: Infinity, duration: 2 }}
          style={{ position: 'absolute', bottom: 40, left: '50%', transform: 'translateX(-50%)' }}>
          <Box sx={{ width: 24, height: 40, borderRadius: '12px', border: '2px solid rgba(124,92,255,0.4)', display: 'flex', justifyContent: 'center', pt: 1 }}>
            <Box sx={{ width: 4, height: 8, borderRadius: '2px', background: 'linear-gradient(180deg,#7c5cff,#00d4ff)', animation: 'scrollDot 2s ease-in-out infinite', '@keyframes scrollDot': { '0%,100%': { opacity: 1, transform: 'translateY(0)' }, '50%': { opacity: 0, transform: 'translateY(8px)' } } }} />
          </Box>
        </motion.div>
      </Box>

      {/* ── SKILLS ── */}
      {skills.length > 0 && (
        <Box sx={{ py: 10, position: 'relative', zIndex: 1 }}>
          <Container maxWidth="xl">
            <motion.div initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.7 }}>
              <Typography sx={{
                textAlign: 'center', fontFamily: "'Orbitron'", fontSize: { xs: '1.6rem', md: '2.2rem' }, fontWeight: 900,
                background: 'linear-gradient(135deg,#fff,#a78bfa)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', mb: 1,
              }}>Tech Stack</Typography>
              <Box sx={{ width: 60, height: 3, background: 'linear-gradient(90deg,#7c5cff,#00d4ff)', borderRadius: 2, mx: 'auto', mb: 5 }} />
            </motion.div>
            <Box sx={{ textAlign: 'center' }}>
              {skills.map((s, i) => <SkillBadge key={s} skill={s} index={i} />)}
            </Box>
          </Container>
        </Box>
      )}

      {/* ── PROJECTS ── */}
      <Box sx={{ py: 10, position: 'relative', zIndex: 1 }}>
        <Container maxWidth="xl">
          <motion.div initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.7 }}>
            <Typography sx={{
              textAlign: 'center', fontFamily: "'Orbitron'", fontSize: { xs: '1.6rem', md: '2.2rem' }, fontWeight: 900,
              background: 'linear-gradient(135deg,#fff,#00d4ff)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', mb: 1,
            }}>Projects</Typography>
            <Typography sx={{ textAlign: 'center', color: 'rgba(224,230,255,0.4)', fontSize: '0.85rem', mb: 1, letterSpacing: '0.1em', textTransform: 'uppercase' }}>
              RL-Ranked by visitor engagement
            </Typography>
            <Box sx={{ width: 60, height: 3, background: 'linear-gradient(90deg,#7c5cff,#00d4ff)', borderRadius: 2, mx: 'auto', mb: 6 }} />
          </motion.div>

          {loading ? (
            <Grid container spacing={3}>
              {[1,2,3].map(k => <Grid key={k} item xs={12} md={4}><Skeleton variant="rounded" height={340} sx={{ bgcolor: 'rgba(255,255,255,0.04)', borderRadius: '20px' }} /></Grid>)}
            </Grid>
          ) : projects.length === 0 ? (
            <Box sx={{ textAlign: 'center', py: 8, color: 'rgba(224,230,255,0.3)' }}>
              <Code sx={{ fontSize: 64, mb: 2, opacity: 0.3 }} />
              <Typography>Projects will appear here once added via Admin.</Typography>
            </Box>
          ) : (
            <Grid container spacing={3}>
              {projects.map((p, i) => <ProjectCard key={p._id} project={p} index={i} />)}
            </Grid>
          )}
        </Container>
      </Box>

      {/* ── CONTACT ── */}
      <Box sx={{ py: 10, position: 'relative', zIndex: 1 }}>
        <Container maxWidth="md">
          <motion.div initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.7 }}>
            <Typography sx={{
              textAlign: 'center', fontFamily: "'Orbitron'", fontSize: { xs: '1.6rem', md: '2.2rem' }, fontWeight: 900,
              background: 'linear-gradient(135deg,#fff,#a78bfa)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', mb: 1,
            }}>Get In Touch</Typography>
            <Box sx={{ width: 60, height: 3, background: 'linear-gradient(90deg,#7c5cff,#00d4ff)', borderRadius: 2, mx: 'auto', mb: 6 }} />
          </motion.div>
          <ContactForm />
        </Container>
      </Box>
    </Box>
  );
}
