import React, { useEffect, useState } from 'react';
import { Container, Typography, Box, Grid, Avatar, Chip, LinearProgress, Skeleton } from '@mui/material';
import { motion } from 'framer-motion';
import { LocationOn, Email, Code, School } from '@mui/icons-material';
import { trackPageVisit, trackPageLeave } from '../utils/tracker';
import API from '../utils/config';

const SectionTitle = ({ children }) => (
  <motion.div initial={{ opacity:0, y:20 }} whileInView={{ opacity:1, y:0 }} viewport={{ once:true }} transition={{ duration:0.6 }}>
    <Typography sx={{
      fontFamily:"'Orbitron'", fontWeight:900, fontSize:{ xs:'1.4rem', md:'1.9rem' },
      background:'linear-gradient(135deg,#fff,#a78bfa)', WebkitBackgroundClip:'text', WebkitTextFillColor:'transparent', mb:1,
    }}>{children}</Typography>
    <Box sx={{ width:48, height:3, background:'linear-gradient(90deg,#7c5cff,#00d4ff)', borderRadius:2, mb:4 }} />
  </motion.div>
);

const SkillBar = ({ name, level, category, index }) => (
  <motion.div initial={{ opacity:0, x:-20 }} whileInView={{ opacity:1, x:0 }} viewport={{ once:true }} transition={{ duration:0.5, delay: index*0.05 }}>
    <Box sx={{ mb:2.5 }}>
      <Box sx={{ display:'flex', justifyContent:'space-between', mb:0.8 }}>
        <Typography sx={{ fontSize:'0.88rem', fontWeight:600, color:'#e0e6ff' }}>{name}</Typography>
        <Typography sx={{ fontSize:'0.78rem', color:'#7c5cff', fontWeight:700 }}>{level}%</Typography>
      </Box>
      <Box sx={{ height:6, borderRadius:3, background:'rgba(255,255,255,0.06)', overflow:'hidden' }}>
        <motion.div initial={{ width:0 }} whileInView={{ width:`${level}%` }} viewport={{ once:true }} transition={{ duration:1, delay: index*0.05+0.2, ease:'easeOut' }}
          style={{ height:'100%', borderRadius:3, background:'linear-gradient(90deg,#7c5cff,#00d4ff)' }} />
      </Box>
    </Box>
  </motion.div>
);

export default function About() {
  const [profile, setProfile]     = useState(null);
  const [skills,  setSkills]      = useState([]);
  const [loading, setLoading]     = useState(true);

  useEffect(() => {
    trackPageVisit('/about');
    Promise.all([
      fetch(`${API}/profile`).then(r=>r.json()),
      fetch(`${API}/skills`).then(r=>r.json()),
    ]).then(([p,s]) => { setProfile(p); setSkills(Array.isArray(s)?s:[]); })
      .catch(()=>{})
      .finally(()=>setLoading(false));
    return () => trackPageLeave('/about');
  }, []);

  const groupedSkills = skills.reduce((acc, s) => {
    const cat = s.category || 'General';
    if (!acc[cat]) acc[cat] = [];
    acc[cat].push(s);
    return acc;
  }, {});

  const infoItems = [
    { icon:<LocationOn sx={{ fontSize:18, color:'#7c5cff' }} />, label:'Location', value: profile?.location },
    { icon:<Email     sx={{ fontSize:18, color:'#00d4ff' }} />, label:'Email',    value: profile?.email },
    { icon:<School    sx={{ fontSize:18, color:'#a78bfa' }} />, label:'Study',    value: profile?.subtitle },
  ].filter(i => i.value);

  return (
    <Box sx={{ background:'#0a0f1e', minHeight:'100vh', pt:12, pb:10, position:'relative', overflow:'hidden' }}>
      {/* bg glow */}
      <Box sx={{ position:'fixed', top:'20%', right:'-10%', width:'40vw', height:'40vw', maxWidth:600, background:'radial-gradient(circle,rgba(0,212,255,0.07) 0%,transparent 70%)', filter:'blur(60px)', pointerEvents:'none' }} />

      <Container maxWidth="xl">
        {/* Hero strip */}
        <Grid container spacing={6} alignItems="center" sx={{ mb:10 }}>
          <Grid item xs={12} md={5} sx={{ display:'flex', justifyContent:'center' }}>
            <motion.div initial={{ opacity:0, scale:0.85 }} animate={{ opacity:1, scale:1 }} transition={{ duration:0.9, ease:[0.23,1,0.32,1] }}>
              <Box sx={{ position:'relative' }}>
                <Box sx={{ position:'absolute', inset:-16, borderRadius:'50%', border:'1px solid rgba(124,92,255,0.2)', animation:'spin 20s linear infinite', '@keyframes spin':{'100%':{transform:'rotate(360deg)'}} }} />
                <Box sx={{ position:'absolute', inset:-32, borderRadius:'50%', border:'1px dashed rgba(0,212,255,0.12)', animation:'spin 35s linear infinite reverse' }} />
                <Avatar src={profile?.profileImage} sx={{
                  width:{ xs:220, md:300 }, height:{ xs:220, md:300 },
                  background:'linear-gradient(135deg,rgba(124,92,255,0.3),rgba(0,212,255,0.2))',
                  border:'3px solid transparent',
                  boxShadow:'0 0 80px rgba(124,92,255,0.25)',
                  fontSize:'5rem',
                }}>{loading ? '' : (profile?.name?.[0] || '')}</Avatar>
              </Box>
            </motion.div>
          </Grid>

          <Grid item xs={12} md={7}>
            <motion.div initial={{ opacity:0, y:30 }} animate={{ opacity:1, y:0 }} transition={{ duration:0.8, delay:0.2 }}>
              {loading ? (
                <>
                  <Skeleton width="60%" height={60} sx={{ bgcolor:'rgba(255,255,255,0.05)', mb:1 }} />
                  <Skeleton width="40%" height={30} sx={{ bgcolor:'rgba(255,255,255,0.04)', mb:2 }} />
                  {[1,2,3].map(k=><Skeleton key={k} sx={{ bgcolor:'rgba(255,255,255,0.03)', mb:0.5 }} />)}
                </>
              ) : profile ? (
                <>
                  <Typography sx={{ fontFamily:"'Orbitron'", fontWeight:900, fontSize:{ xs:'2rem', md:'2.8rem' },
                    background:'linear-gradient(135deg,#fff 0%,#a78bfa 60%,#00d4ff 100%)', WebkitBackgroundClip:'text', WebkitTextFillColor:'transparent', mb:0.5 }}>
                    {profile.name}
                  </Typography>
                  {profile.title && <Typography sx={{ fontSize:'1.1rem', color:'#00d4ff', fontWeight:500, mb:0.5 }}>{profile.title}</Typography>}
                  {profile.subtitle && <Typography sx={{ fontSize:'0.9rem', color:'rgba(224,230,255,0.45)', mb:3 }}>{profile.subtitle}</Typography>}
                  {profile.bio && <Typography sx={{ color:'rgba(224,230,255,0.6)', lineHeight:1.9, fontSize:'0.97rem', mb:4 }}>{profile.bio}</Typography>}
                  <Box sx={{ display:'flex', flexDirection:'column', gap:1.5 }}>
                    {infoItems.map(item => (
                      <Box key={item.label} sx={{ display:'flex', alignItems:'center', gap:1.5 }}>
                        {item.icon}
                        <Typography sx={{ color:'rgba(224,230,255,0.4)', fontSize:'0.82rem', minWidth:60 }}>{item.label}</Typography>
                        <Typography sx={{ color:'rgba(224,230,255,0.8)', fontSize:'0.88rem' }}>{item.value}</Typography>
                      </Box>
                    ))}
                  </Box>
                </>
              ) : (
                <Typography sx={{ color:'rgba(224,230,255,0.3)' }}>Profile not set up yet.</Typography>
              )}
            </motion.div>
          </Grid>
        </Grid>

        {/* Skills section */}
        {(loading || skills.length > 0) && (
          <Box>
            <SectionTitle>Skills & Technologies</SectionTitle>
            {loading ? (
              <Grid container spacing={3}>
                {[1,2].map(k=><Grid key={k} item xs={12} md={6}><Skeleton variant="rounded" height={200} sx={{ bgcolor:'rgba(255,255,255,0.04)', borderRadius:'16px' }} /></Grid>)}
              </Grid>
            ) : (
              <Grid container spacing={4}>
                {Object.entries(groupedSkills).map(([cat, catSkills]) => (
                  <Grid item xs={12} md={6} key={cat}>
                    <motion.div initial={{ opacity:0, y:20 }} whileInView={{ opacity:1, y:0 }} viewport={{ once:true }} transition={{ duration:0.6 }}>
                      <Box sx={{ p:3, borderRadius:'20px', background:'rgba(255,255,255,0.03)', border:'1px solid rgba(124,92,255,0.12)', backdropFilter:'blur(20px)' }}>
                        <Typography sx={{ fontWeight:700, color:'#a78bfa', fontSize:'0.82rem', letterSpacing:'0.15em', textTransform:'uppercase', mb:3 }}>{cat}</Typography>
                        {catSkills.map((s, i) => <SkillBar key={s._id} name={s.name} level={s.level} category={s.category} index={i} />)}
                      </Box>
                    </motion.div>
                  </Grid>
                ))}
              </Grid>
            )}
          </Box>
        )}

        {!loading && skills.length === 0 && (
          <Box sx={{ textAlign:'center', py:6 }}>
            <Code sx={{ fontSize:56, color:'rgba(124,92,255,0.2)', mb:2 }} />
            <Typography sx={{ color:'rgba(224,230,255,0.25)' }}>Skills will appear here once added via Admin.</Typography>
          </Box>
        )}
      </Container>
    </Box>
  );
}
