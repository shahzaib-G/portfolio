import React, { useEffect, useState } from 'react';
import { Container, Typography, Box, Grid, Avatar, Skeleton } from '@mui/material';
import { motion } from 'framer-motion';
import { LocationOn, Email, Code, School } from '@mui/icons-material';
import { useTheme } from '@mui/material/styles';
import { trackPageVisit, trackPageLeave } from '../utils/tracker';
import API from '../utils/config';

const FH = "'Plus Jakarta Sans', sans-serif";
const FB = "'Inter', sans-serif";
const FM = "'JetBrains Mono', monospace";

const fadeInView = (delay = 0) => ({
  initial: { opacity: 0, y: 16 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true },
  transition: { duration: 0.42, delay, ease: 'easeOut' },
});

const Card = ({ children, sx = {}, delay = 0 }) => {
  const theme   = useTheme();
  const isLight = theme.palette.mode === 'light';
  return (
    <motion.div {...fadeInView(delay)} style={{ height: '100%' }}>
      <Box sx={{
        height: '100%',
        p: { xs: 3, md: 3.5 },
        borderRadius: '16px',
        background: theme.palette.background.paper,
        border: `1px solid ${theme.palette.divider}`,
        boxShadow: isLight ? '0 1px 4px rgba(0,0,0,0.06)' : '0 4px 20px rgba(0,0,0,0.2)',
        transition: 'border-color 0.2s ease, box-shadow 0.2s ease',
        '&:hover': {
          borderColor: isLight ? 'rgba(79,70,229,0.25)' : 'rgba(129,140,248,0.28)',
          boxShadow: isLight ? '0 4px 16px rgba(0,0,0,0.09)' : '0 8px 28px rgba(0,0,0,0.3)',
        },
        ...sx,
      }}>
        {children}
      </Box>
    </motion.div>
  );
};

const InfoRow = ({ icon, label, value }) => {
  const theme = useTheme();
  return (
    <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: 1.5, mb: 2 }}>
      <Box sx={{ mt: 0.2, color: theme.palette.text.secondary, flexShrink: 0 }}>{icon}</Box>
      <Box>
        <Typography sx={{ fontFamily: FM, fontSize: '0.68rem', color: theme.palette.text.secondary, letterSpacing: '0.08em', textTransform: 'uppercase', mb: 0.2 }}>
          {label}
        </Typography>
        <Typography sx={{ fontFamily: FB, fontSize: '0.92rem', fontWeight: 500, color: theme.palette.text.primary }}>
          {value}
        </Typography>
      </Box>
    </Box>
  );
};

const SkillBar = ({ name, level, index }) => {
  const theme   = useTheme();
  const isLight = theme.palette.mode === 'light';
  return (
    <motion.div {...fadeInView(index * 0.04)}>
      <Box sx={{ mb: 2.5 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 0.8 }}>
          <Typography sx={{ fontFamily: FB, fontSize: '0.85rem', fontWeight: 500, color: theme.palette.text.primary }}>
            {name}
          </Typography>
          <Typography sx={{ fontFamily: FM, fontSize: '0.75rem', color: isLight ? '#4f46e5' : '#818cf8', fontWeight: 600 }}>
            {level}%
          </Typography>
        </Box>
        <Box sx={{ height: 5, borderRadius: '3px', background: isLight ? '#e2e8f0' : 'rgba(255,255,255,0.08)', overflow: 'hidden' }}>
          <motion.div
            initial={{ width: 0 }}
            whileInView={{ width: `${level}%` }}
            viewport={{ once: true }}
            transition={{ duration: 1, delay: index * 0.04 + 0.15, ease: [0.23, 1, 0.32, 1] }}
            style={{
              height: '100%', borderRadius: 3,
              background: isLight
                ? 'linear-gradient(90deg, #4f46e5, #0891b2)'
                : 'linear-gradient(90deg, #818cf8, #22d3ee)',
            }}
          />
        </Box>
      </Box>
    </motion.div>
  );
};

export default function About() {
  const theme   = useTheme();
  const isLight = theme.palette.mode === 'light';
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

  const accent = isLight ? '#4f46e5' : '#818cf8';
  const catColors = ['#4f46e5', '#0891b2', '#059669', '#d97706', '#dc2626'];

  return (
    <Box sx={{
      background: theme.palette.background.default,
      minHeight: '100vh',
      pt: { xs: 12, md: 14 }, pb: 12,
      transition: 'background 0.3s ease',
    }}>
      <Container maxWidth="xl">

        {/* Header */}
        <motion.div {...fadeInView()}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2 }}>
            <Box sx={{
              width: 28, height: 28, borderRadius: '8px',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              background: isLight ? 'rgba(79,70,229,0.09)' : 'rgba(129,140,248,0.12)',
              border: `1px solid ${isLight ? 'rgba(79,70,229,0.18)' : 'rgba(129,140,248,0.22)'}`,
            }}>
              <Typography sx={{ fontFamily: FM, fontSize: '0.6rem', fontWeight: 700, color: accent }}>01</Typography>
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
            About me
          </Typography>
          <Typography sx={{ fontFamily: FB, color: theme.palette.text.secondary, fontSize: '1rem', mb: 8, maxWidth: 420 }}>
            A little bit about who I am, what I do, and the skills I've picked up along the way.
          </Typography>
        </motion.div>

        {/* Top bento row */}
        <Grid container spacing={3} sx={{ mb: 3 }}>

          {/* Avatar card */}
          <Grid item xs={12} md={4}>
            <Card delay={0} sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center', py: 4 }}>
              {loading ? (
                <>
                  <Skeleton variant="circular" width={140} height={140} sx={{ mb: 2.5 }} />
                  <Skeleton width={160} height={32} />
                </>
              ) : (
                <>
                  <Box sx={{ position: 'relative', mb: 3 }}>
                    <Box sx={{
                      width: 140, height: 140, borderRadius: '50%', p: '3px',
                      background: isLight
                        ? 'linear-gradient(135deg, #4f46e5, #0891b2)'
                        : 'linear-gradient(135deg, #818cf8, #22d3ee)',
                    }}>
                      <Avatar
                        src={profile?.profileImage}
                        sx={{
                          width: '100%', height: '100%',
                          background: isLight ? '#e0e7ff' : 'rgba(129,140,248,0.15)',
                          fontSize: '3.5rem', color: accent,
                        }}
                      >
                        {profile?.name?.[0] || ''}
                      </Avatar>
                    </Box>
                  </Box>
                  <Typography sx={{ fontFamily: FH, fontWeight: 800, fontSize: '1.35rem', color: theme.palette.text.primary, letterSpacing: '-0.03em', mb: 0.5 }}>
                    {profile?.name || ''}
                  </Typography>
                  <Typography sx={{ fontFamily: FB, color: theme.palette.text.secondary, fontSize: '0.9rem' }}>
                    {profile?.title || ''}
                  </Typography>
                  {profile?.subtitle && (
                    <Box sx={{
                      mt: 2, px: 2, py: 0.6, borderRadius: '20px',
                      background: isLight ? 'rgba(8,145,178,0.07)' : 'rgba(34,211,238,0.07)',
                      border: isLight ? '1px solid rgba(8,145,178,0.18)' : '1px solid rgba(34,211,238,0.18)',
                    }}>
                      <Typography sx={{ fontFamily: FM, fontSize: '0.75rem', color: isLight ? '#0891b2' : '#22d3ee' }}>
                        {profile.subtitle}
                      </Typography>
                    </Box>
                  )}
                </>
              )}
            </Card>
          </Grid>

          {/* Bio card */}
          <Grid item xs={12} md={8}>
            <Card delay={0.07}>
              <Typography sx={{ fontFamily: FM, fontSize: '0.7rem', color: theme.palette.text.secondary, letterSpacing: '0.12em', textTransform: 'uppercase', mb: 2 }}>
                bio
              </Typography>
              {loading
                ? [1,2,3,4].map(k => <Skeleton key={k} sx={{ mb: 1 }} />)
                : (
                  <Typography sx={{ fontFamily: FB, color: theme.palette.text.secondary, lineHeight: 2, fontSize: '0.98rem', mb: 4 }}>
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
            </Card>
          </Grid>
        </Grid>

        {/* Skills */}
        {(loading || Object.keys(groupedSkills).length > 0) && (
          <>
            <motion.div {...fadeInView(0)}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 6, mt: 6 }}>
                <Code sx={{ color: accent, fontSize: 18 }} />
                <Typography sx={{ fontFamily: FH, fontWeight: 700, fontSize: '1.5rem', color: theme.palette.text.primary, letterSpacing: '-0.03em' }}>
                  Skills & Expertise
                </Typography>
                <Box sx={{ flex: 1, height: 1, background: theme.palette.divider }} />
              </Box>
            </motion.div>

            {loading ? (
              <Grid container spacing={3}>
                {[1,2,3].map(k => (
                  <Grid key={k} item xs={12} md={4}>
                    <Skeleton variant="rounded" height={220} sx={{ borderRadius: '16px' }} />
                  </Grid>
                ))}
              </Grid>
            ) : (
              <Grid container spacing={3}>
                {Object.entries(groupedSkills).map(([cat, catSkills], ci) => (
                  <Grid key={cat} item xs={12} sm={6} md={4}>
                    <Card delay={ci * 0.06}>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mb: 3 }}>
                        <Box sx={{
                          width: 8, height: 8, borderRadius: '50%', flexShrink: 0,
                          background: catColors[ci % catColors.length],
                        }} />
                        <Typography sx={{ fontFamily: FH, fontWeight: 700, fontSize: '0.95rem', color: theme.palette.text.primary, letterSpacing: '-0.02em' }}>
                          {cat}
                        </Typography>
                      </Box>
                      {catSkills.map((skill, si) => (
                        <SkillBar key={skill._id || skill.name} name={skill.name} level={skill.level} index={si} />
                      ))}
                    </Card>
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
