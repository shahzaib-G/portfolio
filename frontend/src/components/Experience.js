import React, { useEffect, useState } from 'react';
import { Container, Typography, Box, Chip, Skeleton } from '@mui/material';
import { motion } from 'framer-motion';
import { Work, CalendarToday } from '@mui/icons-material';
import { trackPageVisit, trackPageLeave } from '../utils/tracker';
import API from '../utils/config';

export default function Experience() {
  const [items,   setItems]   = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    trackPageVisit('/experience');
    fetch(`${API}/experiences`).then(r=>r.json()).then(d=>setItems(Array.isArray(d)?d:[])).catch(()=>{}).finally(()=>setLoading(false));
    return () => trackPageLeave('/experience');
  }, []);

  return (
    <Box sx={{ background:'#0a0f1e', minHeight:'100vh', pt:14, pb:12, position:'relative', overflow:'hidden' }}>
      <Box sx={{ position:'fixed', top:'30%', left:'-5%', width:'35vw', height:'35vw', maxWidth:500, background:'radial-gradient(circle,rgba(124,92,255,0.08) 0%,transparent 70%)', filter:'blur(60px)', pointerEvents:'none' }} />

      <Container maxWidth="lg">
        <motion.div initial={{ opacity:0, y:30 }} animate={{ opacity:1, y:0 }} transition={{ duration:0.7 }}>
          <Typography sx={{ fontFamily:"'Orbitron'", fontWeight:900, fontSize:{ xs:'2rem', md:'2.8rem' }, textAlign:'center',
            background:'linear-gradient(135deg,#fff,#a78bfa)', WebkitBackgroundClip:'text', WebkitTextFillColor:'transparent', mb:1 }}>
            Experience
          </Typography>
          <Box sx={{ width:60, height:3, background:'linear-gradient(90deg,#7c5cff,#00d4ff)', borderRadius:2, mx:'auto', mb:8 }} />
        </motion.div>

        {loading ? (
          [1,2,3].map(k=><Skeleton key={k} variant="rounded" height={180} sx={{ bgcolor:'rgba(255,255,255,0.04)', borderRadius:'20px', mb:3 }} />)
        ) : items.length === 0 ? (
          <Box sx={{ textAlign:'center', py:10 }}>
            <Work sx={{ fontSize:64, color:'rgba(124,92,255,0.2)', mb:2 }} />
            <Typography sx={{ color:'rgba(224,230,255,0.25)' }}>Experience will appear here once added via Admin.</Typography>
          </Box>
        ) : (
          <Box sx={{ position:'relative' }}>
            {/* Timeline line */}
            <Box sx={{ position:'absolute', left:{ xs:16, md:'50%' }, top:0, bottom:0, width:2,
              background:'linear-gradient(180deg,#7c5cff,#00d4ff)', opacity:0.25, transform:{ md:'translateX(-50%)' } }} />

            {items.map((item, i) => {
              const isLeft = i % 2 === 0;
              return (
                <motion.div key={item._id} initial={{ opacity:0, x: isLeft ? -40 : 40 }} whileInView={{ opacity:1, x:0 }}
                  viewport={{ once:true }} transition={{ duration:0.7, delay: i*0.1 }}>
                  <Box sx={{
                    display:'flex', justifyContent:{ md: isLeft ? 'flex-start' : 'flex-end' },
                    mb:4, pl:{ xs:6, md:0 },
                    pr:{ md: isLeft ? '52%' : 0 },
                    pl2:{ md: isLeft ? 0 : '52%' },
                    ...(isLeft ? { pr:{ md:'52%' } } : { pl:{ md:'52%' } }),
                  }}>
                    {/* Dot */}
                    <Box sx={{ position:'absolute', left:{ xs:8, md:'calc(50% - 8px)' }, width:16, height:16, borderRadius:'50%',
                      background:'linear-gradient(135deg,#7c5cff,#00d4ff)', boxShadow:'0 0 20px rgba(124,92,255,0.6)',
                      mt:3, zIndex:1 }} />

                    <Box sx={{ p:{ xs:3, md:3.5 }, borderRadius:'20px', background:'rgba(255,255,255,0.03)', backdropFilter:'blur(20px)',
                      border:'1px solid rgba(124,92,255,0.15)', width:{ md:'100%' },
                      transition:'all 0.3s', '&:hover':{ border:'1px solid rgba(124,92,255,0.4)', boxShadow:'0 16px 40px rgba(124,92,255,0.12)', transform:'translateY(-4px)' } }}>
                      <Box sx={{ display:'flex', justifyContent:'space-between', alignItems:'flex-start', flexWrap:'wrap', gap:1, mb:1 }}>
                        <Box>
                          <Typography sx={{ fontWeight:700, fontSize:'1.05rem', color:'#e0e6ff', fontFamily:"'Space Grotesk'" }}>{item.role}</Typography>
                          <Typography sx={{ fontWeight:600, color:'#7c5cff', fontSize:'0.88rem' }}>{item.company}</Typography>
                        </Box>
                        <Chip icon={<CalendarToday sx={{ fontSize:'11px !important', color:'#00d4ff !important' }} />}
                          label={`${item.startDate || ''}${item.current ? ' – Present' : item.endDate ? ` – ${item.endDate}` : ''}`}
                          size="small" sx={{ background:'rgba(0,212,255,0.07)', color:'rgba(224,230,255,0.6)', fontSize:'0.72rem', border:'1px solid rgba(0,212,255,0.15)' }} />
                      </Box>
                      {item.description && <Typography sx={{ color:'rgba(224,230,255,0.55)', fontSize:'0.87rem', lineHeight:1.8, mt:1.5 }}>{item.description}</Typography>}
                      {item.techStack?.length > 0 && (
                        <Box sx={{ display:'flex', flexWrap:'wrap', gap:0.5, mt:2 }}>
                          {item.techStack.map(t=><Chip key={t} label={t} size="small" sx={{ background:'rgba(124,92,255,0.08)', color:'#a78bfa', fontSize:'0.68rem', border:'1px solid rgba(124,92,255,0.18)' }} />)}
                        </Box>
                      )}
                    </Box>
                  </Box>
                </motion.div>
              );
            })}
          </Box>
        )}
      </Container>
    </Box>
  );
}
