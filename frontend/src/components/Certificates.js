import React, { useEffect, useState } from 'react';
import { Container, Typography, Box, Grid, Button, Chip, Skeleton } from '@mui/material';
import { motion } from 'framer-motion';
import { EmojiEvents, OpenInNew } from '@mui/icons-material';
import { trackPageVisit, trackPageLeave } from '../utils/tracker';
import API from '../utils/config';

export default function Certificates() {
  const [items,   setItems]   = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    trackPageVisit('/certificates');
    fetch(`${API}/certificates`).then(r=>r.json()).then(d=>setItems(Array.isArray(d)?d:[])).catch(()=>{}).finally(()=>setLoading(false));
    return () => trackPageLeave('/certificates');
  }, []);

  return (
    <Box sx={{ background:'#0a0f1e', minHeight:'100vh', pt:14, pb:12, position:'relative', overflow:'hidden' }}>
      <Box sx={{ position:'fixed', bottom:'20%', right:'-5%', width:'35vw', height:'35vw', maxWidth:500, background:'radial-gradient(circle,rgba(0,212,255,0.07) 0%,transparent 70%)', filter:'blur(60px)', pointerEvents:'none' }} />

      <Container maxWidth="xl">
        <motion.div initial={{ opacity:0, y:30 }} animate={{ opacity:1, y:0 }} transition={{ duration:0.7 }}>
          <Typography sx={{ fontFamily:"'Orbitron'", fontWeight:900, fontSize:{ xs:'2rem', md:'2.8rem' }, textAlign:'center',
            background:'linear-gradient(135deg,#fff,#00d4ff)', WebkitBackgroundClip:'text', WebkitTextFillColor:'transparent', mb:1 }}>
            Certificates
          </Typography>
          <Box sx={{ width:60, height:3, background:'linear-gradient(90deg,#7c5cff,#00d4ff)', borderRadius:2, mx:'auto', mb:8 }} />
        </motion.div>

        {loading ? (
          <Grid container spacing={3}>
            {[1,2,3,4].map(k=><Grid key={k} item xs={12} sm={6} md={4} lg={3}><Skeleton variant="rounded" height={280} sx={{ bgcolor:'rgba(255,255,255,0.04)', borderRadius:'20px' }} /></Grid>)}
          </Grid>
        ) : items.length === 0 ? (
          <Box sx={{ textAlign:'center', py:10 }}>
            <EmojiEvents sx={{ fontSize:64, color:'rgba(124,92,255,0.2)', mb:2 }} />
            <Typography sx={{ color:'rgba(224,230,255,0.25)' }}>Certificates will appear here once added via Admin.</Typography>
          </Box>
        ) : (
          <Grid container spacing={3}>
            {items.map((cert, i) => (
              <Grid item xs={12} sm={6} md={4} lg={3} key={cert._id}>
                <motion.div initial={{ opacity:0, y:40 }} whileInView={{ opacity:1, y:0 }} viewport={{ once:true }} transition={{ duration:0.6, delay: i*0.08 }}>
                  <Box sx={{
                    height:'100%', borderRadius:'20px', overflow:'hidden',
                    background:'rgba(255,255,255,0.03)', backdropFilter:'blur(20px)',
                    border:'1px solid rgba(124,92,255,0.15)',
                    transition:'all 0.4s cubic-bezier(0.23,1,0.32,1)',
                    '&:hover':{ transform:'translateY(-10px)', border:'1px solid rgba(124,92,255,0.45)', boxShadow:'0 24px 60px rgba(124,92,255,0.18)' },
                  }}>
                    {cert.imageUrl ? (
                      <Box component="img" src={cert.imageUrl} alt={cert.title} sx={{ width:'100%', height:180, objectFit:'cover' }} />
                    ) : (
                      <Box sx={{ height:120, display:'flex', alignItems:'center', justifyContent:'center', background:'linear-gradient(135deg,rgba(124,92,255,0.08),rgba(0,212,255,0.05))' }}>
                        <EmojiEvents sx={{ fontSize:56, color:'rgba(124,92,255,0.35)' }} />
                      </Box>
                    )}
                    <Box sx={{ p:3 }}>
                      <Typography sx={{ fontWeight:700, color:'#e0e6ff', fontSize:'0.95rem', mb:0.5, fontFamily:"'Space Grotesk'" }}>{cert.title}</Typography>
                      <Typography sx={{ color:'#7c5cff', fontSize:'0.82rem', fontWeight:600, mb:0.5 }}>{cert.issuer}</Typography>
                      {cert.date && <Typography sx={{ color:'rgba(224,230,255,0.35)', fontSize:'0.75rem', mb:2 }}>{cert.date}</Typography>}
                      {cert.credentialUrl && (
                        <Button href={cert.credentialUrl} target="_blank" size="small" endIcon={<OpenInNew sx={{ fontSize:'13px !important' }} />} sx={{
                          color:'#00d4ff', fontSize:'0.76rem', textTransform:'none', fontWeight:600, p:0,
                          '&:hover':{ color:'#fff' },
                        }}>View Certificate</Button>
                      )}
                    </Box>
                  </Box>
                </motion.div>
              </Grid>
            ))}
          </Grid>
        )}
      </Container>
    </Box>
  );
}
