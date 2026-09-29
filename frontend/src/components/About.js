import React, { useEffect, useState } from 'react';
import { Container, Typography, Box, Grid, Avatar, Chip, Skeleton } from '@mui/material';
import { motion, useInView } from 'framer-motion';
import { LocationOn, Email, Code, School } from '@mui/icons-material';
import { trackPageVisit, trackPageLeave } from '../utils/tracker';
import API from '../utils/config';

const FH = "'Syne', sans-serif";
const FB = "'DM Sans', sans-serif";
const FM = "'JetBrains Mono', monospace";

// ── Page background ──────────────────────────────────────────────────────────
const PageBg = () => (
  <>
    <Box sx={{ position: 'fixed', top: '10%', right: '-10%', width: '45vw', height: '45vw', maxWidth: 600, background: 'radial-gradient(circle,rgba(34,211,238,0.07) 0%,transparent 65%)', filter: 'blur(80px)', pointerEvents: 'none', zIndex: 0 }} />
    <Box sx={{ position: 'fixed', bottom: '20%', left: '-8%', width: '40vw', height: '40vw', maxWidth: 520, background: 'radial-gradient(circle,rgba(109,40,217,0.09) 0%,transparent 65%)', filter: 'blur(80px)', pointerEvents: 'none', zIndex: 0 }} />
  </>
);

// ── Skill bar ─────────────────────────────────────────────────────────────────
const SkillBar = ({ name, level, index }) => (
  <motion.div initial={{ opacity: 0, x: -16 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} transition={{ duration: 0.5, delay: index * 0.045 }}>
    <Box sx={{ mb: 2.5 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 0.8 }}>
        <Typography sx={{ fontFamily: FB, fontSize: '0.85rem', fontWeight: 500, color: '#e2e8f0' }}>{name}</Typography>
        <Typography sx={{ fontFamily: FM, fontSize: '0.75rem', color: '#8b5cf6', fontWeight: 600 }}>{level}%</Typography>
      </Box>
      <Box sx={{ height: 5, borderRadius: '3px', background: 'rgba(255,255,255,0.05)', overflow: 'hidden' }}>
        <motion.div
          initial={{ width: 0 }}
          whileInView={{ width: `${level}%` }}
          viewport={{ once: true }}
          transition={{ duration: 1.1, delay: index * 0.045 + 0.2, ease: [0.23, 1, 0.32, 1] }}
          style={{ height: '100%', borderRadius: 3, background: 'linear-gradient(90deg, #6d28d9, #22d3ee)' }}
        />
      </Box>
    </Box>
  </motion.div>
);

// ── Bento card ────────────────────────────────────────────────────────────────
const BentoCard = ({ children, sx = {}, delay = 0, full = false }) => (
  <motion.div
    initial={{ opacity: 0, y: 24 }}
    whileInView={{ opacity: 1, y: 0 }}
    viewport={{ once: true }}
    transition={{ duration: 0.65, delay, ease: [0.23, 1, 0.32, 1] }}
    style={{ height: '100%' }}
  >
    <Box sx={{
      height: '100%',
      p: { xs: 3, md: 3.5 },
      borderRadius: '20px',
      background: 'rgba(255,255,255,0.025)',
      border: '1px solid rgba(255,255,255,0.06)',
      backdropFilter: 'blur(12px)',
      transition: 'border-color 0.3s',
      '&:hover': { borderColor: 'rgba(139,92,246,0.25)' },
      ...sx,
    }}>
      {children}
    </Box>
  </motion.div>
);

// ── Info row ──────────────────────────────────────────────────────────────────
const InfoRow = ({ icon, label, value }) => (
  <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: 1.5, mb: 2 }}>
    <Box sx={{ mt: 0.2, color: '#475569', flexShrink: 0 }}>{icon}</Box>
    <Box>
      <Typography sx={{ fontFamily: FM, fontSize: '0.68rem', color: '#475569', letterSpacing: '0.08em', textTransform: 'uppercase', mb: 0.2 }}>{label}</Typography>
      <Typography sx={{ fontFamily: FB, fontSize: '0.92rem', fontWeight: 500, color: '#e2e8f0' }}>{value}</Typography>
    </Box>
  </Box>
);

export default function About() {
  const [profile, setProfile] = useState(null);
  const [skills,  setSkills]  = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    trackPageVisit('/about');
    Promise.all([
      fetch(`${API}/profile`).then(r => r.json()),
      fetch(`${API}/skills`).then(r => r.json()),
    ])
      .then(([p, s]) => { setProfile(p); setSkills(Array.isArray(s) ? s : []); })
      .catch(() => {})
      .finally(() => setLoading(false));
    return () => trackPageLeave('/about');
  }, []);

  const groupedSkills = skills.reduce((acc, s) => {
    const cat = s.category || 'General';
    if (!acc[cat]) acc[cat] = [];
    acc[cat].push(s);
    return acc;
  }, {});

  return (
    <Box sx={{ background: '#09090b', minHeight: '100vh', pt: { xs: 12, md: 14 }, pb: 12, position: 'relative', overflow: 'hidden' }}>
      <PageBg />

      <Container maxWidth="xl" sx={{ position: 'relative', zIndex: 1 }}>

        {/* Page header */}
        <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2 }}>
            <Box sx={{ fontFamily: FM, fontSize: '0.72rem', fontWeight: 500, color: '#475569', letterSpacing: '0.08em' }}>— 01</Box>
            <Box sx={{ flex: 1, maxWidth: 80, height: 1, background: 'rgba(255,255,255,0.06)' }} />
          </Box>
          <Typography sx={{ fontFamily: FH, fontWeight: 800, fontSize: { xs: '2.4rem', md: '3.5rem' }, letterSpacing: '-0.04em', lineHeight: 1, mb: 1.5, background: 'linear-gradient(135deg, #f1f5f9 0%, #c4b5fd 60%)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
            About me
          </Typography>
          <Typography sx={{ fontFamily: FB, color: '#475569', fontSize: '1rem', mb: 8, maxWidth: 420 }}>
            A little bit about who I am, what I do, and the skills I've picked up along the way.
          </Typography>
        </motion.div>

        {/* Top bento row */}
        <Grid container spacing={3} sx={{ mb: 3 }}>

          {/* Avatar + name card */}
          <Grid item xs={12} md={4}>
            <BentoCard delay={0} sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center', py: 4 }}>
              {loading ? (
                <>
                  <Skeleton variant="circular" width={140} height={140} sx={{ bgcolor: 'rgba(255,255,255,0.04)', mb: 2.5 }} />
                  <Skeleton width={160} height={32} sx={{ bgcolor: 'rgba(255,255,255,0.04)' }} />
                </>
              ) : (
                <>
                  <Box sx={{ position: 'relative', mb: 3 }}>
                    <Box sx={{ width: 140, height: 140, borderRadius: '50%', p: 0.4, background: 'linear-gradient(135deg,#6d28d9,#22d3ee)' }}>
                      <Avatar src={profile?.profileImage} sx={{ width: '100%', height: '100%', background: 'linear-gradient(135deg,rgba(109,40,217,0.25),rgba(34,211,238,0.15))', fontSize: '3.5rem' }}>
                        {profile?.name?.[0] || ''}
                      </Avatar>
                    </Box>
                  </Box>
                  <Typography sx={{ fontFamily: FH, fontWeight: 800, fontSize: '1.35rem', color: '#f1f5f9', letterSpacing: '-0.03em', mb: 0.5 }}>
                    {profile?.name || ''}
                  </Typography>
                  <Typography sx={{ fontFamily: FB, color: '#94a3b8', fontSize: '0.9rem' }}>
                    {profile?.title || ''}
                  </Typography>
                  {profile?.subtitle && (
                    <Box sx={{ mt: 2, px: 2, py: 0.6, borderRadius: '20px', background: 'rgba(34,211,238,0.07)', border: '1px solid rgba(34,211,238,0.18)' }}>
                      <Typography sx={{ fontFamily: FM, fontSize: '0.75rem', color: '#22d3ee' }}>{profile.subtitle}</Typography>
                    </Box>
                  )}
                </>
              )}
            </BentoCard>
          </Grid>

          {/* Bio card */}
          <Grid item xs={12} md={8}>
            <BentoCard delay={0.08}>
              <Typography sx={{ fontFamily: FM, fontSize: '0.7rem', color: '#475569', letterSpacing: '0.12em', textTransform: 'uppercase', mb: 2 }}>bio</Typography>
              {loading
                ? [1, 2, 3, 4].map(k => <Skeleton key={k} sx={{ bgcolor: 'rgba(255,255,255,0.04)', mb: 1 }} />)
                : (
                  <Typography sx={{ fontFamily: FB, color: '#94a3b8', lineHeight: 2, fontSize: '0.98rem', mb: 4 }}>
                    {profile?.bio || ''}
                  </Typography>
                )
              }
              {!loading && (
                <Grid container spacing={2}>
                  {profile?.location && (
                    <Grid item xs={12} sm={4}>
                      <InfoRow icon={<LocationOn sx={{ fontSize: 16 }} />} label="Location" value={profile.location} />
                    </Grid>
                  )}
                  {profile?.email && (
                    <Grid item xs={12} sm={4}>
                      <InfoRow icon={<Email sx={{ fontSize: 16 }} />} label="Email" value={profile.email} />
                    </Grid>
                  )}
                  {profile?.subtitle && (
                    <Grid item xs={12} sm={4}>
                      <InfoRow icon={<School sx={{ fontSize: 16 }} />} label="Study" value={profile.subtitle} />
                    </Grid>
                  )}
                </Grid>
              )}
            </BentoCard>
          </Grid>
        </Grid>

        {/* Skills section */}
        {(loading || Object.keys(groupedSkills).length > 0) && (
          <>
            <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.6 }}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 6, mt: 6 }}>
                <Code sx={{ color: '#8b5cf6', fontSize: 18 }} />
                <Typography sx={{ fontFamily: FH, fontWeight: 700, fontSize: '1.5rem', color: '#f1f5f9', letterSpacing: '-0.03em' }}>Skills & Expertise</Typography>
                <Box sx={{ flex: 1, height: 1, background: 'rgba(255,255,255,0.05)' }} />
              </Box>
            </motion.div>

            {loading ? (
              <Grid container spacing={3}>
                {[1, 2, 3].map(k => (
                  <Grid key={k} item xs={12} md={4}>
                    <Skeleton variant="rounded" height={220} sx={{ bgcolor: 'rgba(255,255,255,0.03)', borderRadius: '20px' }} />
                  </Grid>
                ))}
              </Grid>
            ) : (
              <Grid container spacing={3}>
                {Object.entries(groupedSkills).map(([cat, catSkills], ci) => (
                  <Grid key={cat} item xs={12} sm={6} md={4}>
                    <BentoCard delay={ci * 0.07}>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mb: 3 }}>
                        <Box sx={{ width: 8, height: 8, borderRadius: '50%', background: ['#8b5cf6','#22d3ee','#10b981','#f59e0b','#ec4899'][ci % 5], flexShrink: 0 }} />
                        <Typography sx={{ fontFamily: FH, fontWeight: 700, fontSize: '0.95rem', color: '#f1f5f9', letterSpacing: '-0.02em' }}>{cat}</Typography>
                      </Box>
                      {catSkills.map((skill, si) => <SkillBar key={skill._id || skill.name} name={skill.name} level={skill.level} index={si} />)}
                    </BentoCard>
                  </Grid>
                ))}
              </Grid>
            )}
          </>
        )}
      </Container>
    </Box>
  );
}
