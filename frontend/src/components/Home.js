import React, { useEffect, useRef, useState } from 'react';
import { Container, Typography, Box, Grid, Button, Chip, Skeleton, Avatar, IconButton } from '@mui/material';
import { motion, useScroll, useTransform, useInView } from 'framer-motion';
import { GitHub, LinkedIn, WhatsApp, OpenInNew, Code, ArrowForward, Visibility, Instagram } from '@mui/icons-material';
import { Link as RouterLink } from 'react-router-dom';
import { Canvas, useFrame } from '@react-three/fiber';
import { Sphere, MeshDistortMaterial, Float, Stars } from '@react-three/drei';
import * as THREE from 'three';
import ContactForm from './ContactForm';
import { trackPageVisit, trackPageLeave, trackProject } from '../utils/tracker';
import API from '../utils/config';

const FH = "'Syne', sans-serif";
const FB = "'DM Sans', sans-serif";

// ── Custom cursor ─────────────────────────────────────────────────────────────
const CustomCursor = () => {
  const outer = useRef(null);
  const inner = useRef(null);
  const pos   = useRef({ x: -200, y: -200 });
  const lag   = useRef({ x: -200, y: -200 });

  useEffect(() => {
    const mv = (e) => { pos.current = { x: e.clientX, y: e.clientY }; };
    window.addEventListener('mousemove', mv);
    let id;
    const loop = () => {
      lag.current.x += (pos.current.x - lag.current.x) * 0.1;
      lag.current.y += (pos.current.y - lag.current.y) * 0.1;
      if (outer.current) outer.current.style.transform = `translate(${pos.current.x - 20}px, ${pos.current.y - 20}px)`;
      if (inner.current) inner.current.style.transform = `translate(${lag.current.x - 4}px, ${lag.current.y - 4}px)`;
      id = requestAnimationFrame(loop);
    };
    id = requestAnimationFrame(loop);
    return () => { window.removeEventListener('mousemove', mv); cancelAnimationFrame(id); };
  }, []);

  return (
    <>
      <Box ref={outer} sx={{ position:'fixed', top:0, left:0, width:40, height:40, borderRadius:'50%', border:'1.5px solid rgba(139,92,246,0.5)', pointerEvents:'none', zIndex:9999, display:{ xs:'none', md:'block' } }} />
      <Box ref={inner} sx={{ position:'fixed', top:0, left:0, width:8, height:8, borderRadius:'50%', background:'linear-gradient(135deg,#8b5cf6,#22d3ee)', pointerEvents:'none', zIndex:9999, display:{ xs:'none', md:'block' } }} />
    </>
  );
};

// ── 3D Orb ────────────────────────────────────────────────────────────────────
const Orb = ({ mousePos }) => {
  const ref = useRef();
  useFrame(({ clock }) => {
    if (!ref.current) return;
    ref.current.rotation.x = clock.elapsedTime * 0.15;
    ref.current.rotation.y = clock.elapsedTime * 0.22;
    ref.current.position.x = THREE.MathUtils.lerp(ref.current.position.x, mousePos.current.x * 0.55, 0.04);
    ref.current.position.y = THREE.MathUtils.lerp(ref.current.position.y, mousePos.current.y * 0.35, 0.04);
  });
  return (
    <Float speed={1.6} rotationIntensity={0.25} floatIntensity={0.6}>
      <Sphere ref={ref} args={[1.3, 128, 128]}>
        <MeshDistortMaterial color="#6d28d9" distort={0.45} speed={2} roughness={0} metalness={0.08} transparent opacity={0.85} />
      </Sphere>
      <Sphere args={[0.9, 64, 64]}>
        <MeshDistortMaterial color="#22d3ee" distort={0.25} speed={2.8} roughness={0} transparent opacity={0.2} />
      </Sphere>
    </Float>
  );
};

// ── Skill tag ─────────────────────────────────────────────────────────────────
const SkillTag = ({ skill, index }) => {
  const [hov, setHov] = useState(false);
  return (
    <motion.div
      initial={{ scale: 0, opacity: 0 }}
      whileInView={{ scale: 1, opacity: 1 }}
      viewport={{ once: true }}
      transition={{ duration: 0.35, delay: index * 0.03, type: 'spring', stiffness: 240, damping: 18 }}
      onHoverStart={() => setHov(true)}
      onHoverEnd={() => setHov(false)}
      style={{ display: 'inline-block', margin: 4 }}
    >
      <Box sx={{
        display: 'inline-flex', alignItems: 'center', gap: 0.8,
        px: 1.8, py: 0.7, borderRadius: '30px', cursor: 'default', whiteSpace: 'nowrap',
        background: hov ? 'rgba(139,92,246,0.2)' : 'rgba(139,92,246,0.06)',
        border: hov ? '1px solid rgba(139,92,246,0.55)' : '1px solid rgba(139,92,246,0.15)',
        boxShadow: hov ? '0 0 18px rgba(139,92,246,0.3)' : 'none',
        transform: hov ? 'translateY(-4px)' : 'none',
        transition: 'all 0.22s cubic-bezier(0.23,1,0.32,1)',
      }}>
        <Box sx={{
          width: 6, height: 6, borderRadius: '50%', flexShrink: 0,
          background: hov ? '#22d3ee' : 'rgba(255,255,255,0.18)',
          boxShadow: hov ? '0 0 8px #22d3ee' : 'none',
          transition: 'all 0.22s',
        }} />
        <Typography sx={{ fontSize: '0.8rem', fontWeight: 500, fontFamily: FB, color: hov ? '#e2e8f0' : '#94a3b8' }}>
          {skill}
        </Typography>
      </Box>
    </motion.div>
  );
};

// ── Project card ──────────────────────────────────────────────────────────────
const ProjectCard = ({ project, index, featured }) => {
  const ref    = useRef(null);
  const inView = useInView(ref, { once: false, amount: 0.1 });
  const viewed = useRef(false);
  const t0     = useRef(null);
  const [hov, setHov] = useState(false);

  useEffect(() => {
    if (inView && !viewed.current && project._id) { viewed.current = true; t0.current = Date.now(); trackProject(project._id, 'view'); }
    if (!inView && t0.current && project._id) { const s = Math.round((Date.now() - t0.current) / 1000); if (s > 1) trackProject(project._id, 'time', s); t0.current = null; }
  }, [inView, project._id]);

  return (
    <motion.div
      ref={ref}
      initial={{ y: 60, opacity: 0 }}
      animate={inView ? { y: 0, opacity: 1 } : {}}
      transition={{ duration: 0.65, delay: index * 0.1, ease: [0.23, 1, 0.32, 1] }}
      onHoverStart={() => setHov(true)}
      onHoverEnd={() => setHov(false)}
      style={{ height: '100%' }}
    >
      <Box sx={{
        height: '100%', borderRadius: '20px', overflow: 'hidden', cursor: 'pointer',
        background: 'rgba(255,255,255,0.03)',
        border: hov ? '1px solid rgba(139,92,246,0.45)' : '1px solid rgba(255,255,255,0.07)',
        boxShadow: hov ? '0 24px 60px rgba(139,92,246,0.18)' : '0 4px 24px rgba(0,0,0,0.3)',
        transform: hov ? 'translateY(-10px)' : 'none',
        transition: 'all 0.38s cubic-bezier(0.23,1,0.32,1)',
      }}>
        {/* Image */}
        <Box sx={{ position: 'relative', height: featured ? 260 : 200, overflow: 'hidden', background: 'rgba(139,92,246,0.04)' }}>
          {(project.imageUrl || project.imageData)
            ? <Box component="img" src={project.imageUrl || project.imageData} alt={project.title} sx={{ width: '100%', height: '100%', objectFit: 'cover', transform: hov ? 'scale(1.07)' : 'scale(1)', transition: 'transform 0.55s ease' }} />
            : (
              <Box sx={{ height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'linear-gradient(135deg,rgba(139,92,246,0.07),rgba(34,211,238,0.04))' }}>
                <Code sx={{ fontSize: 52, color: 'rgba(139,92,246,0.25)' }} />
              </Box>
            )
          }
          <Box sx={{ position: 'absolute', inset: 0, background: 'linear-gradient(180deg,transparent 40%,rgba(9,9,11,0.85))' }} />
          {project.engagement?.views > 0 && (
            <Box sx={{ position: 'absolute', top: 12, right: 12 }}>
              <Chip icon={<Visibility sx={{ fontSize: '11px !important', color: '#22d3ee !important' }} />} label={project.engagement.views} size="small"
                sx={{ background: 'rgba(9,9,11,0.8)', color: '#22d3ee', fontSize: '0.65rem', border: '1px solid rgba(34,211,238,0.2)', backdropFilter: 'blur(8px)', fontFamily: FB }} />
            </Box>
          )}
        </Box>

        {/* Content */}
        <Box sx={{ p: 3 }}>
          <Typography sx={{ fontWeight: 700, color: '#f1f5f9', mb: 0.75, fontFamily: FH, fontSize: featured ? '1.1rem' : '1rem', letterSpacing: '-0.02em' }}>
            {project.title}
          </Typography>
          <Typography sx={{ color: '#64748b', lineHeight: 1.75, mb: 2.5, fontSize: '0.85rem', fontFamily: FB, display: '-webkit-box', WebkitLineClamp: 3, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
            {project.description}
          </Typography>
          <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.6, mb: 2.5 }}>
            {(project.techStack || []).slice(0, 5).map(t => (
              <Box key={t} sx={{ px: 1.4, py: 0.35, borderRadius: '6px', fontSize: '0.72rem', fontFamily: FB, fontWeight: 500, color: '#22d3ee', background: 'rgba(34,211,238,0.07)', border: '1px solid rgba(34,211,238,0.12)' }}>
                {t}
              </Box>
            ))}
          </Box>
          <Box sx={{ display: 'flex', gap: 1.5 }}>
            {project.githubUrl && (
              <Box
                component="a" href={project.githubUrl} target="_blank" rel="noopener"
                onClick={e => { e.stopPropagation(); project._id && trackProject(project._id, 'github_click'); }}
                sx={{
                  display: 'inline-flex', alignItems: 'center', gap: 0.8,
                  px: 2, py: 0.9, borderRadius: '10px', textDecoration: 'none',
                  fontFamily: FB, fontSize: '0.8rem', fontWeight: 600, color: '#a78bfa',
                  border: '1px solid rgba(139,92,246,0.2)', background: 'rgba(139,92,246,0.05)',
                  transition: 'all 0.2s ease',
                  '&:hover': { background: 'rgba(139,92,246,0.15)', borderColor: 'rgba(139,92,246,0.45)' },
                }}
              >
                <GitHub sx={{ fontSize: 14 }} /> Code
              </Box>
            )}
            {project.liveUrl && (
              <Box
                component="a" href={project.liveUrl} target="_blank" rel="noopener"
                onClick={e => { e.stopPropagation(); project._id && trackProject(project._id, 'live_click'); }}
                sx={{
                  display: 'inline-flex', alignItems: 'center', gap: 0.8,
                  px: 2, py: 0.9, borderRadius: '10px', textDecoration: 'none',
                  fontFamily: FB, fontSize: '0.8rem', fontWeight: 600, color: '#22d3ee',
                  border: '1px solid rgba(34,211,238,0.2)', background: 'rgba(34,211,238,0.05)',
                  transition: 'all 0.2s ease',
                  '&:hover': { background: 'rgba(34,211,238,0.12)', borderColor: 'rgba(34,211,238,0.45)' },
                }}
              >
                <OpenInNew sx={{ fontSize: 14 }} /> Live
              </Box>
            )}
          </Box>
        </Box>
      </Box>
    </motion.div>
  );
};

// ── Section label ─────────────────────────────────────────────────────────────
const SectionLabel = ({ num, children }) => (
  <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.6 }}>
    <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2 }}>
      <Box sx={{ fontFamily: "'JetBrains Mono', monospace", fontSize: '0.72rem', fontWeight: 500, color: '#475569', letterSpacing: '0.08em' }}>
        {num}
      </Box>
      <Box sx={{ flex: 1, height: 1, background: 'rgba(255,255,255,0.06)' }} />
    </Box>
    <Typography sx={{
      fontFamily: FH, fontWeight: 800, fontSize: { xs: '2rem', md: '2.8rem' },
      color: '#f1f5f9', letterSpacing: '-0.04em', mb: 2,
      lineHeight: 1.05,
    }}>
      {children}
    </Typography>
  </motion.div>
);

// ── MAIN ──────────────────────────────────────────────────────────────────────
export default function Home() {
  const [profile,  setProfile]  = useState(null);
  const [projects, setProjects] = useState([]);
  const [loading,  setLoading]  = useState(true);
  const mousePos = useRef({ x: 0, y: 0 });
  const heroRef  = useRef(null);
  const { scrollYProgress } = useScroll({ target: heroRef });
  const heroY  = useTransform(scrollYProgress, [0, 1], ['0%', '22%']);
  const heroOp = useTransform(scrollYProgress, [0, 0.8], [1, 0]);

  useEffect(() => {
    const mv = (e) => { mousePos.current = { x: (e.clientX / window.innerWidth - 0.5) * 2, y: (e.clientY / window.innerHeight - 0.5) * -2 }; };
    window.addEventListener('mousemove', mv);
    return () => window.removeEventListener('mousemove', mv);
  }, []);

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
    { key: 'github',    icon: <GitHub fontSize="small" />,    color: '#8b5cf6' },
    { key: 'linkedin',  icon: <LinkedIn fontSize="small" />,  color: '#22d3ee' },
    { key: 'whatsapp',  icon: <WhatsApp fontSize="small" />,  color: '#22c55e' },
    { key: 'instagram', icon: <Instagram fontSize="small" />, color: '#ec4899' },
  ].filter(s => profile?.[s.key]);

  return (
    <Box sx={{ background: '#09090b', minHeight: '100vh', position: 'relative', overflow: 'hidden' }}>
      <CustomCursor />

      {/* Dot grid bg */}
      <Box sx={{
        position: 'fixed', inset: 0, zIndex: 0, pointerEvents: 'none',
        backgroundImage: 'radial-gradient(circle, rgba(139,92,246,0.08) 1px, transparent 1px)',
        backgroundSize: '40px 40px',
        maskImage: 'radial-gradient(ellipse 80% 80% at 50% 50%, #000 40%, transparent 100%)',
      }} />

      {/* Aurora glows */}
      <Box sx={{ position: 'fixed', top: '-15%', left: '-10%', width: '55vw', height: '55vw', maxWidth: 700, background: 'radial-gradient(circle,rgba(109,40,217,0.12) 0%,transparent 65%)', filter: 'blur(80px)', pointerEvents: 'none', zIndex: 0 }} />
      <Box sx={{ position: 'fixed', bottom: '0%', right: '-8%', width: '45vw', height: '45vw', maxWidth: 600, background: 'radial-gradient(circle,rgba(34,211,238,0.08) 0%,transparent 65%)', filter: 'blur(80px)', pointerEvents: 'none', zIndex: 0 }} />

      {/* ── HERO ── */}
      <Box ref={heroRef} sx={{ minHeight: '100vh', display: 'flex', alignItems: 'center', position: 'relative', zIndex: 1 }}>
        <Container maxWidth="xl" sx={{ py: { xs: 14, md: 8 } }}>
          <Grid container spacing={{ xs: 6, md: 4 }} alignItems="center">

            {/* Text */}
            <Grid item xs={12} md={7}>
              <motion.div style={{ y: heroY, opacity: heroOp }}>

                {/* Available badge */}
                <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
                  <Box sx={{ display: 'inline-flex', alignItems: 'center', gap: 1, px: 2, py: 0.75, mb: 4, borderRadius: '30px', background: 'rgba(34,197,94,0.08)', border: '1px solid rgba(34,197,94,0.22)' }}>
                    <Box sx={{ width: 7, height: 7, borderRadius: '50%', background: '#22c55e', animation: 'pulse 2s ease-in-out infinite', '@keyframes pulse': { '0%,100%': { opacity: 1, transform: 'scale(1)' }, '50%': { opacity: 0.45, transform: 'scale(1.6)' } } }} />
                    <Typography sx={{ fontFamily: FB, fontSize: '0.78rem', fontWeight: 600, color: '#4ade80', letterSpacing: '0.06em', textTransform: 'uppercase' }}>
                      {loading ? <Skeleton width={120} sx={{ bgcolor: 'rgba(255,255,255,0.04)' }} /> : (profile?.heroTagline || 'Available for Work')}
                    </Typography>
                  </Box>
                </motion.div>

                {/* Name — huge */}
                <motion.div initial={{ opacity: 0, y: 50 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.85, delay: 0.1, ease: [0.23, 1, 0.32, 1] }}>
                  {loading
                    ? <Skeleton width="78%" height={110} sx={{ bgcolor: 'rgba(255,255,255,0.04)', mb: 1.5 }} />
                    : (
                      <Typography sx={{
                        fontFamily: FH, fontWeight: 800,
                        fontSize: { xs: '3rem', sm: '4rem', md: '5rem', lg: '6rem' },
                        letterSpacing: '-0.04em', lineHeight: 1, mb: 1.5,
                        background: 'linear-gradient(135deg, #f1f5f9 0%, #c4b5fd 50%, #22d3ee 100%)',
                        WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent',
                      }}>
                        {profile?.name || ''}
                      </Typography>
                    )
                  }
                </motion.div>

                {/* Role */}
                <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7, delay: 0.22 }}>
                  <Typography sx={{ fontFamily: FH, fontSize: { xs: '1.05rem', md: '1.35rem' }, fontWeight: 600, color: '#94a3b8', mb: 0.5, letterSpacing: '-0.02em' }}>
                    {loading ? <Skeleton width="50%" sx={{ bgcolor: 'rgba(255,255,255,0.04)' }} /> : (profile?.title || '')}
                  </Typography>
                  {profile?.subtitle && (
                    <Typography sx={{ fontFamily: "'JetBrains Mono', monospace", fontSize: '0.88rem', color: '#22d3ee', fontWeight: 500, mb: 3, letterSpacing: '0.02em' }}>
                      {profile.subtitle}
                    </Typography>
                  )}
                </motion.div>

                {/* Bio */}
                <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7, delay: 0.36 }}>
                  <Typography sx={{ fontFamily: FB, color: '#64748b', lineHeight: 1.85, fontSize: '1rem', maxWidth: 520, mb: 5 }}>
                    {loading
                      ? [1, 2, 3].map(k => <Skeleton key={k} sx={{ bgcolor: 'rgba(255,255,255,0.03)', mb: 0.5 }} />)
                      : (profile?.bio || '')
                    }
                  </Typography>
                </motion.div>

                {/* CTAs + socials */}
                <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: 0.5 }}>
                  <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 2, mb: 4, alignItems: 'center' }}>
                    <Box
                      component={RouterLink} to="/about"
                      sx={{
                        display: 'inline-flex', alignItems: 'center', gap: 1,
                        px: 3.5, py: 1.5, borderRadius: '12px', textDecoration: 'none',
                        fontFamily: FB, fontSize: '0.95rem', fontWeight: 700, color: '#fff',
                        background: 'linear-gradient(135deg, #6d28d9, #0e7490)',
                        boxShadow: '0 8px 28px rgba(109,40,217,0.4)',
                        transition: 'all 0.3s ease',
                        '&:hover': { boxShadow: '0 14px 40px rgba(109,40,217,0.6)', transform: 'translateY(-2px)' },
                      }}
                    >
                      {profile?.ctaText || 'About Me'} <ArrowForward sx={{ fontSize: 18 }} />
                    </Box>
                    {profile?.resumeUrl && (
                      <Box
                        component="a" href={profile.resumeUrl} target="_blank" rel="noopener"
                        sx={{
                          display: 'inline-flex', alignItems: 'center', gap: 1,
                          px: 3.5, py: 1.5, borderRadius: '12px', textDecoration: 'none',
                          fontFamily: FB, fontSize: '0.95rem', fontWeight: 600, color: '#94a3b8',
                          border: '1px solid rgba(255,255,255,0.1)',
                          transition: 'all 0.3s ease',
                          '&:hover': { color: '#f1f5f9', borderColor: 'rgba(255,255,255,0.22)', background: 'rgba(255,255,255,0.05)', transform: 'translateY(-2px)' },
                        }}
                      >
                        Resume ↗
                      </Box>
                    )}
                  </Box>

                  {/* Socials */}
                  <Box sx={{ display: 'flex', gap: 1.5 }}>
                    {socials.map(s => (
                      <Box
                        key={s.key}
                        component="a" href={profile[s.key]} target="_blank" rel="noopener"
                        sx={{
                          width: 40, height: 40, borderRadius: '10px',
                          display: 'flex', alignItems: 'center', justifyContent: 'center',
                          color: '#475569', border: '1px solid rgba(255,255,255,0.07)',
                          background: 'rgba(255,255,255,0.03)',
                          transition: 'all 0.25s ease',
                          '&:hover': { color: s.color, borderColor: `${s.color}55`, background: `${s.color}12`, transform: 'translateY(-3px)' },
                        }}
                      >
                        {s.icon}
                      </Box>
                    ))}
                  </Box>
                </motion.div>
              </motion.div>
            </Grid>

            {/* 3D Visual */}
            <Grid item xs={12} md={5} sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
              <motion.div
                initial={{ opacity: 0, scale: 0.7 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 1, delay: 0.3, ease: [0.23, 1, 0.32, 1] }}
                style={{ position: 'relative', width: 340, height: 340 }}
              >
                {/* 3D canvas */}
                <Box sx={{ position: 'absolute', inset: 0, borderRadius: '50%', overflow: 'hidden' }}>
                  <Canvas camera={{ position: [0, 0, 4], fov: 45 }}>
                    <ambientLight intensity={0.3} />
                    <pointLight position={[10, 10, 10]} intensity={1.2} color="#6d28d9" />
                    <pointLight position={[-10, -10, -10]} intensity={0.6} color="#22d3ee" />
                    <Stars radius={100} depth={50} count={1000} factor={4} fade speed={1} />
                    <Orb mousePos={mousePos} />
                  </Canvas>
                </Box>
                {/* Avatar */}
                <Box sx={{
                  position: 'absolute', inset: '15%', borderRadius: '50%', overflow: 'hidden', zIndex: 2,
                  border: '2px solid transparent',
                  background: 'linear-gradient(#09090b, #09090b) padding-box, linear-gradient(135deg,#6d28d9,#22d3ee) border-box',
                  boxShadow: '0 0 50px rgba(109,40,217,0.2)',
                }}>
                  {profile?.profileImage
                    ? <Box component="img" src={profile.profileImage} alt="Profile" sx={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                    : <Avatar sx={{ width: '100%', height: '100%', background: 'linear-gradient(135deg,rgba(109,40,217,0.3),rgba(34,211,238,0.2))', fontSize: '4rem', borderRadius: '50%' }}>{profile?.name?.[0] || ''}</Avatar>
                  }
                </Box>
                {/* Orbit rings */}
                <Box sx={{ position: 'absolute', inset: -20, borderRadius: '50%', border: '1px solid rgba(139,92,246,0.12)', animation: 'spin 18s linear infinite', '@keyframes spin': { '100%': { transform: 'rotate(360deg)' } }, zIndex: 0 }} />
                <Box sx={{ position: 'absolute', inset: -44, borderRadius: '50%', border: '1px dashed rgba(34,211,238,0.08)', animation: 'spin 28s linear infinite reverse', zIndex: 0 }} />
              </motion.div>
            </Grid>
          </Grid>
        </Container>

        {/* Scroll cue */}
        <motion.div animate={{ y: [0, 10, 0] }} transition={{ repeat: Infinity, duration: 2.2 }} style={{ position: 'absolute', bottom: 32, left: '50%', transform: 'translateX(-50%)' }}>
          <Box sx={{ width: 24, height: 38, borderRadius: '12px', border: '2px solid rgba(139,92,246,0.28)', display: 'flex', justifyContent: 'center', pt: 0.8 }}>
            <Box sx={{ width: 3, height: 8, borderRadius: '2px', background: 'linear-gradient(180deg,#8b5cf6,#22d3ee)', animation: 'sc 2.2s ease-in-out infinite', '@keyframes sc': { '0%,100%': { opacity: 1, transform: 'translateY(0)' }, '50%': { opacity: 0, transform: 'translateY(10px)' } } }} />
          </Box>
        </motion.div>
      </Box>

      {/* ── SKILLS ── */}
      {(loading || skills.length > 0) && (
        <Box sx={{ py: { xs: 8, md: 12 }, position: 'relative', zIndex: 1 }}>
          <Container maxWidth="xl">
            <SectionLabel num="— 02">Tech I work with</SectionLabel>
            <Typography sx={{ fontFamily: FB, color: '#475569', fontSize: '0.9rem', mb: 5, maxWidth: 400 }}>
              Hover over a tag to see it light up.
            </Typography>
            {loading
              ? (
                <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                  {Array.from({ length: 20 }).map((_, i) => <Skeleton key={i} width={70 + (i % 6) * 16} height={34} sx={{ bgcolor: 'rgba(255,255,255,0.03)', borderRadius: '30px' }} />)}
                </Box>
              )
              : (
                <Box sx={{ lineHeight: 2.4 }}>
                  {skills.map((s, i) => <SkillTag key={s + i} skill={s} index={i} />)}
                </Box>
              )
            }
          </Container>
        </Box>
      )}

      {/* ── PROJECTS ── */}
      <Box sx={{ py: { xs: 8, md: 12 }, position: 'relative', zIndex: 1 }}>
        <Container maxWidth="xl">
          <SectionLabel num="— 03">Projects</SectionLabel>
          <Typography sx={{ fontFamily: FB, color: '#475569', fontSize: '0.9rem', mb: 6, maxWidth: 440 }}>
            Things I've built — side projects, client work, open source.
          </Typography>

          {loading ? (
            <Grid container spacing={3}>
              {[1, 2, 3].map(k => (
                <Grid key={k} item xs={12} sm={6} md={4}>
                  <Skeleton variant="rounded" height={360} sx={{ bgcolor: 'rgba(255,255,255,0.03)', borderRadius: '20px' }} />
                </Grid>
              ))}
            </Grid>
          ) : projects.length === 0 ? (
            <Box sx={{ textAlign: 'center', py: 10 }}>
              <Code sx={{ fontSize: 56, color: 'rgba(139,92,246,0.15)', mb: 2 }} />
              <Typography sx={{ fontFamily: FB, color: '#475569' }}>Projects will appear here once added via Admin.</Typography>
            </Box>
          ) : (
            <>
              {/* Featured project */}
              {featured && (
                <Box sx={{ mb: 3 }}>
                  <ProjectCard project={featured} index={0} featured />
                </Box>
              )}
              {/* Rest */}
              {rest.length > 0 && (
                <Grid container spacing={3}>
                  {rest.map((p, i) => (
                    <Grid key={p._id} item xs={12} sm={6} md={4}>
                      <ProjectCard project={p} index={i + 1} />
                    </Grid>
                  ))}
                </Grid>
              )}
            </>
          )}
        </Container>
      </Box>

      {/* ── CONTACT ── */}
      <Box sx={{ py: { xs: 8, md: 12 }, position: 'relative', zIndex: 1 }}>
        <Container maxWidth="md">
          <SectionLabel num="— 04">Get in touch</SectionLabel>
          <Typography sx={{ fontFamily: FB, color: '#475569', fontSize: '0.9rem', mb: 6, maxWidth: 480 }}>
            Have a project in mind or just want to say hello? I'd love to hear from you.
          </Typography>
          <ContactForm />
        </Container>
      </Box>
    </Box>
  );
}
