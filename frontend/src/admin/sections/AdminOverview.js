import React, { useEffect, useState } from 'react';
import { Grid, Box, Typography, CircularProgress } from '@mui/material';
import { People, Code, EmojiEvents, Message } from '@mui/icons-material';
import API from '../../utils/config';

const token = () => localStorage.getItem('adminToken');

const StatCard = ({ icon, label, value, color }) => (
  <Box sx={{ p:3, borderRadius:'16px', background:'rgba(255,255,255,0.03)', border:`1px solid ${color}22`, backdropFilter:'blur(20px)',
    transition:'all 0.3s', '&:hover':{ transform:'translateY(-4px)', border:`1px solid ${color}55`, boxShadow:`0 16px 40px ${color}18` } }}>
    <Box sx={{ display:'flex', alignItems:'center', gap:2, mb:2 }}>
      <Box sx={{ p:1.5, borderRadius:'12px', background:`${color}15` }}>{React.cloneElement(icon, { sx:{ color, fontSize:24 } })}</Box>
      <Typography sx={{ color:'rgba(224,230,255,0.45)', fontSize:'0.82rem', fontWeight:600, textTransform:'uppercase', letterSpacing:'0.1em' }}>{label}</Typography>
    </Box>
    <Typography sx={{ fontFamily:"'Orbitron'", fontSize:'2.2rem', fontWeight:900, color }}>{value ?? '—'}</Typography>
  </Box>
);

export default function AdminOverview() {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      fetch(`${API}/analytics/summary`, { headers:{ Authorization:`Bearer ${token()}` } }).then(r=>r.json()),
      fetch(`${API}/projects`).then(r=>r.json()),
      fetch(`${API}/certificates`).then(r=>r.json()),
      fetch(`${API}/contact`, { headers:{ Authorization:`Bearer ${token()}` } }).then(r=>r.json()),
    ]).then(([analytics, projects, certs, messages]) => {
      setStats({ visitors: analytics.total, projects: projects.length, certs: certs.length, messages: messages.filter(m=>!m.read).length });
    }).catch(()=>{}).finally(()=>setLoading(false));
  }, []);

  return (
    <Box>
      <Typography sx={{ fontFamily:"'Orbitron'", fontWeight:900, fontSize:'1.6rem',
        background:'linear-gradient(135deg,#fff,#a78bfa)', WebkitBackgroundClip:'text', WebkitTextFillColor:'transparent', mb:5 }}>
        Dashboard Overview
      </Typography>

      {loading ? (
        <Box sx={{ display:'flex', justifyContent:'center', py:8 }}><CircularProgress sx={{ color:'#7c5cff' }} /></Box>
      ) : (
        <Grid container spacing={3}>
          <Grid item xs={12} sm={6} lg={3}><StatCard icon={<People />} label="Total Visitors" value={stats?.visitors} color="#7c5cff" /></Grid>
          <Grid item xs={12} sm={6} lg={3}><StatCard icon={<Code />}   label="Projects"       value={stats?.projects} color="#00d4ff" /></Grid>
          <Grid item xs={12} sm={6} lg={3}><StatCard icon={<EmojiEvents />} label="Certificates" value={stats?.certs}  color="#a78bfa" /></Grid>
          <Grid item xs={12} sm={6} lg={3}><StatCard icon={<Message />} label="Unread Messages" value={stats?.messages} color="#ff6b9d" /></Grid>
        </Grid>
      )}

      <Box sx={{ mt:5, p:3, borderRadius:'16px', background:'rgba(124,92,255,0.05)', border:'1px solid rgba(124,92,255,0.15)' }}>
        <Typography sx={{ color:'#a78bfa', fontWeight:700, mb:1 }}>🤖 RL Engine Status</Typography>
        <Typography sx={{ color:'rgba(224,230,255,0.5)', fontSize:'0.85rem', lineHeight:1.8 }}>
          The Reinforcement Learning ranking engine is <strong style={{ color:'#6effc8' }}>active</strong> and integrated directly into the backend.
          Every time a visitor views or clicks a project, the RL engine automatically re-ranks all projects using an epsilon-greedy bandit algorithm.
          No manual runs needed — it's fully automatic.
        </Typography>
      </Box>
    </Box>
  );
}
