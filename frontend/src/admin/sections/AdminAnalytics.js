import React, { useEffect, useState } from 'react';
import { Box, Typography, Grid, CircularProgress } from '@mui/material';
import { People, Today, TrendingUp } from '@mui/icons-material';
import API from '../../utils/config';

const token = () => localStorage.getItem('adminToken');

const Card = ({ icon, label, value, color='#7c5cff' }) => (
  <Box sx={{ p:3, borderRadius:'16px', background:'rgba(255,255,255,0.03)', border:`1px solid ${color}22`, backdropFilter:'blur(20px)',
    transition:'all 0.3s', '&:hover':{ transform:'translateY(-4px)', border:`1px solid ${color}55` } }}>
    <Box sx={{ display:'flex', alignItems:'center', gap:2, mb:2 }}>
      <Box sx={{ p:1.5, borderRadius:'12px', background:`${color}15` }}>{React.cloneElement(icon,{sx:{color,fontSize:22}})}</Box>
      <Typography sx={{ color:'rgba(224,230,255,0.4)', fontSize:'0.8rem', fontWeight:600, textTransform:'uppercase', letterSpacing:'0.1em' }}>{label}</Typography>
    </Box>
    <Typography sx={{ fontFamily:"'Orbitron'", fontSize:'2rem', fontWeight:900, color }}>{value??'—'}</Typography>
  </Box>
);

export default function AdminAnalytics() {
  const [data,    setData]    = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch(`${API}/analytics/summary`, { headers:{ Authorization:`Bearer ${token()}` } })
      .then(r=>r.json()).then(setData).catch(()=>{}).finally(()=>setLoading(false));
  }, []);

  return (
    <Box>
      <Typography sx={{ fontFamily:"'Orbitron'", fontWeight:900, fontSize:'1.5rem', background:'linear-gradient(135deg,#fff,#00d4ff)', WebkitBackgroundClip:'text', WebkitTextFillColor:'transparent', mb:4 }}>Analytics</Typography>

      {loading ? <CircularProgress sx={{ color:'#7c5cff', display:'block', mx:'auto', mt:4 }} /> : (
        <>
          <Grid container spacing={3} sx={{ mb:5 }}>
            <Grid item xs={12} sm={4}><Card icon={<People />} label="Total Visits" value={data?.total} color="#7c5cff" /></Grid>
            <Grid item xs={12} sm={4}><Card icon={<Today />}  label="Today"        value={data?.todayCount} color="#00d4ff" /></Grid>
            <Grid item xs={12} sm={4}><Card icon={<TrendingUp />} label="Top Pages" value={data?.pages?.length||0} color="#a78bfa" /></Grid>
          </Grid>

          {data?.pages?.length > 0 && (
            <Box sx={{ p:3, borderRadius:'16px', background:'rgba(255,255,255,0.03)', border:'1px solid rgba(124,92,255,0.12)' }}>
              <Typography sx={{ color:'#a78bfa', fontWeight:700, fontSize:'0.82rem', letterSpacing:'0.12em', textTransform:'uppercase', mb:3 }}>Top Pages</Typography>
              {data.pages.map((p, i) => (
                <Box key={p._id} sx={{ display:'flex', alignItems:'center', gap:2, mb:2 }}>
                  <Typography sx={{ color:'rgba(224,230,255,0.3)', fontSize:'0.75rem', minWidth:20 }}>#{i+1}</Typography>
                  <Typography sx={{ flex:1, color:'rgba(224,230,255,0.7)', fontSize:'0.85rem', fontFamily:'monospace' }}>{p._id||'/'}</Typography>
                  <Box sx={{ width:120, height:5, borderRadius:3, background:'rgba(255,255,255,0.06)', overflow:'hidden' }}>
                    <Box sx={{ width:`${Math.min(100,(p.count/data.pages[0].count)*100)}%`, height:'100%', background:'linear-gradient(90deg,#7c5cff,#00d4ff)', borderRadius:3 }} />
                  </Box>
                  <Typography sx={{ color:'#7c5cff', fontWeight:700, fontSize:'0.82rem', minWidth:30, textAlign:'right' }}>{p.count}</Typography>
                </Box>
              ))}
            </Box>
          )}
        </>
      )}
    </Box>
  );
}
