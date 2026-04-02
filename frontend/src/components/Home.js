import React, { useEffect, useRef, useState } from 'react';
import { Container, Typography, Box, Grid, Button, Chip, Skeleton, Avatar, IconButton } from '@mui/material';
import { motion, useScroll, useTransform, useInView } from 'framer-motion';
import { GitHub, LinkedIn, WhatsApp, OpenInNew, TrendingUp, Visibility, Code, ArrowForward } from '@mui/icons-material';
import { Link as RouterLink } from 'react-router-dom';
import { Canvas, useFrame } from '@react-three/fiber';
import { Sphere, MeshDistortMaterial, Float, Stars } from '@react-three/drei';
import * as THREE from 'three';
import ContactForm from './ContactForm';
import { trackPageVisit, trackPageLeave, trackProject } from '../utils/tracker';
import API from '../utils/config';

// ── Custom cursor ────────────────────────────────────────────────────────────
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
      if (inner.current) inner.current.style.transform = `translate(${lag.current.x - 5}px, ${lag.current.y - 5}px)`;
      id = requestAnimationFrame(loop);
    };
    id = requestAnimationFrame(loop);
    return () => { window.removeEventListener('mousemove', mv); cancelAnimationFrame(id); };
  }, []);

  return (
    <>
      <Box ref={outer} sx={{ position:'fixed', top:0, left:0, width:40, height:40, borderRadius:'50%', border:'1.5px solid rgba(124,92,255,0.55)', pointerEvents:'none', zIndex:9999, mixBlendMode:'difference' }} />
      <Box ref={inner} sx={{ position:'fixed', top:0, left:0, width:10, height:10, borderRadius:'50%', background:'linear-gradient(135deg,#7c5cff,#00d4ff)', pointerEvents:'none', zIndex:9999 }} />
    </>
  );
};

// ── 3D Orb ───────────────────────────────────────────────────────────────────
const Orb = ({ mousePos }) => {
  const ref = useRef();
  useFrame(({ clock }) => {
    if (!ref.current) return;
    ref.current.rotation.x = clock.elapsedTime * 0.18;
    ref.current.rotation.y = clock.elapsedTime * 0.24;
    ref.current.position.x = THREE.MathUtils.lerp(ref.current.position.x, mousePos.current.x * 0.6, 0.04);
    ref.current.position.y = THREE.MathUtils.lerp(ref.current.position.y, mousePos.current.y * 0.4, 0.04);
  });
  return (
    <Float speed={1.8} rotationIntensity={0.3} floatIntensity={0.7}>
      <Sphere ref={ref} args={[1.35, 128, 128]}>
        <MeshDistortMaterial color="#7c5cff" distort={0.5} speed={2.2} roughness={0} metalness={0.05} transparent opacity={0.82} />
      </Sphere>
      <Sphere args={[0.95, 64, 64]}>
        <MeshDistortMaterial color="#00d4ff" distort={0.28} speed={3} roughness={0} transparent opacity={0.22} />
      </Sphere>
    </Float>
  );
};

// ── Sharingan eye with cursor tracking ───────────────────────────────────────
const SharinganEye = () => {
  const pupilRef = useRef(null);
  const wrap = useRef(null);

  useEffect(() => {
    const mv = (e) => {
      if (!pupilRef.current || !wrap.current) return;
      const r  = wrap.current.getBoundingClientRect();
      const cx = r.left + r.width  / 2;
      const cy = r.top  + r.height / 2;
      const dx = e.clientX - cx, dy = e.clientY - cy;
      const d  = Math.sqrt(dx * dx + dy * dy) || 1;
      const m  = 10;
      const px = (dx / d) * Math.min(d * 0.35, m);
      const py = (dy / d) * Math.min(d * 0.35, m);
      pupilRef.current.style.transform = `translate(calc(-50% + ${px}px), calc(-50% + ${py}px))`;
    };
    window.addEventListener('mousemove', mv);
    return () => window.removeEventListener('mousemove', mv);
  }, []);

  return (
    <Box ref={wrap} sx={{ width:78, height:78, position:'relative' }}>
      {/* Spinning conic ring */}
      <Box sx={{ position:'absolute', inset:0, borderRadius:'50%', background:'conic-gradient(from 0deg,#ff3c3c 0%,#7c5cff 33%,#ff3c3c 50%,#00d4ff 83%,#ff3c3c 100%)', animation:'sharinSpin 5s linear infinite', '@keyframes sharinSpin':{'100%':{transform:'rotate(360deg)'}} }} />
      {/* Dark rim */}
      <Box sx={{ position:'absolute', inset:3, borderRadius:'50%', background:'#08090f' }}>
        {/* Red iris */}
        <Box sx={{ position:'absolute', inset:5, borderRadius:'50%', background:'radial-gradient(circle at 38% 35%,#ff7070 0%,#cc1111 60%,#7a0000 100%)', boxShadow:'inset 0 0 14px rgba(0,0,0,0.7), 0 0 14px rgba(255,40,40,0.5)', overflow:'hidden' }}>
          {/* 3 tomoe */}
          {[0,120,240].map(a => (
            <Box key={a} sx={{ position:'absolute', width:11, height:11, borderRadius:'50%', background:'#1a0000', top:'50%', left:'50%', transformOrigin:'0 0', transform:`rotate(${a}deg) translateX(11px) translateY(-50%)` }} />
          ))}
          {/* Pupil */}
          <Box ref={pupilRef} sx={{ position:'absolute', width:20, height:20, borderRadius:'50%', background:'#000', top:'50%', left:'50%', transform:'translate(-50%,-50%)', transition:'transform 0.07s ease-out', '&::after':{ content:'""', position:'absolute', top:3, left:4, width:6, height:6, borderRadius:'50%', background:'rgba(255,255,255,0.55)' } }} />
        </Box>
      </Box>
    </Box>
  );
};

// ── Skill badge — dense, hover lights eye ────────────────────────────────────
const SkillBadge = ({ skill, index }) => {
  const ref    = useRef(null);
  const inView = useInView(ref, { once: false, amount: 0.2 });
  const [hov,  setHov] = useState(false);
  return (
    <motion.div ref={ref}
      initial={{ scale:0, opacity:0 }} animate={inView ? { scale:1, opacity:1 } : {}}
      transition={{ duration:0.3, delay: index*0.025, type:'spring', stiffness:260, damping:20 }}
      onHoverStart={() => setHov(true)} onHoverEnd={() => setHov(false)}
      style={{ display:'inline-block', margin:'3px' }}>
      <Box sx={{
        display:'inline-flex', alignItems:'center', gap:0.7,
        px:1.6, py:0.65, borderRadius:'30px', whiteSpace:'nowrap',
        background: hov ? 'rgba(124,92,255,0.22)' : 'rgba(124,92,255,0.07)',
        border: hov ? '1px solid rgba(124,92,255,0.65)' : '1px solid rgba(124,92,255,0.17)',
        boxShadow: hov ? '0 0 18px rgba(124,92,255,0.38)' : 'none',
        transform: hov ? 'translateY(-4px)' : 'none',
        transition:'all 0.22s cubic-bezier(0.23,1,0.32,1)',
        cursor:'default',
      }}>
        {/* Eye dot */}
        <Box sx={{
          width:7, height:7, borderRadius:'50%', flexShrink:0, transition:'all 0.22s',
          background: hov ? '#ff4040' : 'rgba(255,255,255,0.14)',
          boxShadow: hov ? '0 0 8px #ff4040, 0 0 14px rgba(255,64,64,0.4)' : 'none',
          animation: hov ? 'eyePulse 0.55s ease-in-out infinite alternate' : 'none',
          '@keyframes eyePulse':{ '0%':{opacity:1},'100%':{opacity:0.45,transform:'scale(0.75)'} },
        }} />
        <Typography sx={{ fontSize:'0.79rem', fontWeight:600, color: hov ? '#e8e0ff' : 'rgba(167,139,250,0.88)' }}>{skill}</Typography>
      </Box>
    </motion.div>
  );
};

// ── Project card ─────────────────────────────────────────────────────────────
const ProjectCard = ({ project, index }) => {
  const ref     = useRef(null);
  const inView  = useInView(ref, { once:false, amount:0.1 });
  const viewRef = useRef(false);
  const t0      = useRef(null);
  const [hov,  setHov]  = useState(false);

  useEffect(() => {
    if (inView && !viewRef.current && project._id) { viewRef.current=true; t0.current=Date.now(); trackProject(project._id,'view'); }
    if (!inView && t0.current && project._id) { const s=Math.round((Date.now()-t0.current)/1000); if(s>1) trackProject(project._id,'time',s); t0.current=null; }
  }, [inView, project._id]);

  return (
    <Grid item xs={12} sm={6} lg={4}>
      <motion.div ref={ref}
        initial={{ y:70, opacity:0 }} animate={inView?{y:0,opacity:1}:{}}
        transition={{ duration:0.7, delay:index*0.1, ease:[0.23,1,0.32,1] }}
        onHoverStart={()=>setHov(true)} onHoverEnd={()=>setHov(false)}
        onClick={()=>project._id && trackProject(project._id,'click')}
        style={{ height:'100%' }}>
        <Box sx={{
          height:'100%', borderRadius:'22px', overflow:'hidden', cursor:'pointer',
          background:'rgba(255,255,255,0.03)', backdropFilter:'blur(20px)',
          border: hov ? '1px solid rgba(124,92,255,0.55)' : '1px solid rgba(124,92,255,0.12)',
          boxShadow: hov ? '0 28px 70px rgba(124,92,255,0.22)' : '0 8px 32px rgba(0,0,0,0.3)',
          transform: hov ? 'translateY(-14px) scale(1.012)' : 'none',
          transition:'all 0.4s cubic-bezier(0.23,1,0.32,1)',
        }}>
          <Box sx={{ position:'relative', height:210, overflow:'hidden', background:'rgba(124,92,255,0.06)' }}>
            {(project.imageUrl||project.imageData)
              ? <Box component="img" src={project.imageUrl||project.imageData} alt={project.title} sx={{ width:'100%',height:'100%',objectFit:'cover',transform:hov?'scale(1.1)':'scale(1)',transition:'transform 0.6s ease' }} />
              : <Box sx={{ height:'100%',display:'flex',alignItems:'center',justifyContent:'center',background:'linear-gradient(135deg,rgba(124,92,255,0.08),rgba(0,212,255,0.04))' }}><Code sx={{ fontSize:52,color:'rgba(124,92,255,0.28)' }} /></Box>
            }
            <Box sx={{ position:'absolute',inset:0,background:'linear-gradient(180deg,transparent 40%,rgba(10,15,30,0.9))' }} />
            <Box sx={{ position:'absolute',top:12,left:12 }}>
              <Chip icon={<TrendingUp sx={{ fontSize:'12px !important',color:'#7c5cff !important' }} />} label={`#${index+1}`} size="small"
                sx={{ background:'rgba(10,15,30,0.85)',color:'#a78bfa',fontWeight:700,fontSize:'0.68rem',border:'1px solid rgba(124,92,255,0.3)',backdropFilter:'blur(10px)' }} />
            </Box>
            {project.engagement?.views>0 && (
              <Box sx={{ position:'absolute',top:12,right:12 }}>
                <Chip icon={<Visibility sx={{ fontSize:'11px !important',color:'#00d4ff !important' }} />} label={project.engagement.views} size="small"
                  sx={{ background:'rgba(10,15,30,0.85)',color:'#00d4ff',fontSize:'0.68rem',border:'1px solid rgba(0,212,255,0.18)',backdropFilter:'blur(10px)' }} />
              </Box>
            )}
          </Box>
          <Box sx={{ p:3 }}>
            <Typography sx={{ fontWeight:700,color:'#e0e6ff',mb:1,fontFamily:"'Space Grotesk'",fontSize:'1rem' }}>{project.title}</Typography>
            <Typography sx={{ color:'rgba(224,230,255,0.52)',lineHeight:1.75,mb:2.5,fontSize:'0.82rem',display:'-webkit-box',WebkitLineClamp:3,WebkitBoxOrient:'vertical',overflow:'hidden' }}>{project.description}</Typography>
            <Box sx={{ display:'flex',flexWrap:'wrap',gap:0.5,mb:2.5 }}>
              {(project.techStack||[]).slice(0,5).map(t=>(
                <Chip key={t} label={t} size="small" sx={{ background:'rgba(0,212,255,0.06)',color:'#00d4ff',fontSize:'0.67rem',border:'1px solid rgba(0,212,255,0.14)',height:20 }} />
              ))}
            </Box>
            <Box sx={{ display:'flex',gap:1 }}>
              {project.githubUrl && <Button href={project.githubUrl} target="_blank" rel="noopener" size="small" startIcon={<GitHub sx={{ fontSize:'14px !important' }} />}
                onClick={e=>{e.stopPropagation();project._id&&trackProject(project._id,'github_click');}}
                sx={{ flex:1,py:0.9,borderRadius:'10px',textTransform:'none',fontWeight:600,fontSize:'0.78rem',color:'#a78bfa',border:'1px solid rgba(124,92,255,0.23)','&:hover':{background:'rgba(124,92,255,0.15)',border:'1px solid rgba(124,92,255,0.5)'} }}>Code</Button>}
              {project.liveUrl && <Button href={project.liveUrl} target="_blank" rel="noopener" size="small" startIcon={<OpenInNew sx={{ fontSize:'14px !important' }} />}
                onClick={e=>{e.stopPropagation();project._id&&trackProject(project._id,'live_click');}}
                sx={{ flex:1,py:0.9,borderRadius:'10px',textTransform:'none',fontWeight:600,fontSize:'0.78rem',color:'#00d4ff',border:'1px solid rgba(0,212,255,0.23)','&:hover':{background:'rgba(0,212,255,0.1)',border:'1px solid rgba(0,212,255,0.5)'} }}>Live</Button>}
            </Box>
          </Box>
        </Box>
      </motion.div>
    </Grid>
  );
};

// ── Section heading ──────────────────────────────────────────────────────────
const Heading = ({ children, sub, grad='linear-gradient(135deg,#fff,#a78bfa)' }) => (
  <motion.div initial={{ opacity:0,y:28 }} whileInView={{ opacity:1,y:0 }} viewport={{ once:true }} transition={{ duration:0.65 }}>
    <Typography sx={{ textAlign:'center',fontFamily:"'Orbitron'",fontSize:{xs:'1.65rem',md:'2.3rem'},fontWeight:900,background:grad,WebkitBackgroundClip:'text',WebkitTextFillColor:'transparent',mb: sub?0.5:1 }}>{children}</Typography>
    {sub && <Typography sx={{ textAlign:'center',color:'rgba(224,230,255,0.3)',fontSize:'0.72rem',letterSpacing:'0.2em',textTransform:'uppercase',mb:0.5 }}>{sub}</Typography>}
    <Box sx={{ width:60,height:3,background:'linear-gradient(90deg,#7c5cff,#00d4ff)',borderRadius:2,mx:'auto',mb:6 }} />
  </motion.div>
);

// ── MAIN ─────────────────────────────────────────────────────────────────────
export default function Home() {
  const [profile,  setProfile]  = useState(null);
  const [projects, setProjects] = useState([]);
  const [loading,  setLoading]  = useState(true);
  const mousePos = useRef({ x:0, y:0 });
  const heroRef  = useRef(null);
  const { scrollYProgress } = useScroll({ target: heroRef });
  const heroY  = useTransform(scrollYProgress, [0,1], ['0%','25%']);
  const heroOp = useTransform(scrollYProgress, [0,0.85], [1,0]);

  useEffect(() => {
    const mv = (e) => { mousePos.current = { x:(e.clientX/window.innerWidth-0.5)*2, y:(e.clientY/window.innerHeight-0.5)*-2 }; };
    window.addEventListener('mousemove', mv);
    return () => window.removeEventListener('mousemove', mv);
  }, []);

  useEffect(() => {
    trackPageVisit('/');
    (async () => {
      try {
        const [prof, proj] = await Promise.all([
          fetch(`${API}/profile`).then(r=>r.json()),
          fetch(`${API}/projects`).then(r=>r.json()),
        ]);
        setProfile(prof);
        setProjects(Array.isArray(proj)?proj:[]);
      } catch(e){ console.error(e); }
      finally { setLoading(false); }
    })();
    return () => trackPageLeave('/');
  }, []);

  const skills = profile?.featuredSkills ? profile.featuredSkills.split(',').map(s=>s.trim()).filter(Boolean) : [];

  return (
    <Box sx={{ background:'#0a0f1e', minHeight:'100vh', position:'relative', overflow:'hidden' }}>
      <CustomCursor />

      {/* Grid bg */}
      <Box sx={{ position:'fixed',inset:0,zIndex:0,pointerEvents:'none',
        backgroundImage:`linear-gradient(rgba(124,92,255,0.03) 1px,transparent 1px),linear-gradient(90deg,rgba(124,92,255,0.03) 1px,transparent 1px)`,
        backgroundSize:'60px 60px' }} />
      {/* Ambient glows */}
      <Box sx={{ position:'fixed',top:'-10%',left:'-5%',width:'50vw',height:'50vw',maxWidth:700,background:'radial-gradient(circle,rgba(124,92,255,0.1) 0%,transparent 70%)',filter:'blur(60px)',pointerEvents:'none',zIndex:0 }} />
      <Box sx={{ position:'fixed',bottom:'5%',right:'-5%',width:'40vw',height:'40vw',maxWidth:600,background:'radial-gradient(circle,rgba(0,212,255,0.08) 0%,transparent 70%)',filter:'blur(60px)',pointerEvents:'none',zIndex:0 }} />

      {/* ── HERO ── */}
      <Box ref={heroRef} sx={{ minHeight:'100vh', display:'flex', alignItems:'center', position:'relative', zIndex:1 }}>
        <Container maxWidth="xl" sx={{ py:{xs:12,md:6} }}>
          <Grid container spacing={4} alignItems="center">

            {/* Text side */}
            <Grid item xs={12} md={6}>
              <motion.div style={{ y:heroY, opacity:heroOp }}>
                {/* Status pill */}
                <motion.div initial={{opacity:0,y:30}} animate={{opacity:1,y:0}} transition={{duration:0.6}}>
                  <Box sx={{ display:'inline-flex',alignItems:'center',gap:1,px:2.5,py:0.8,mb:3,borderRadius:'30px',background:'rgba(124,92,255,0.1)',border:'1px solid rgba(124,92,255,0.28)' }}>
                    <Box sx={{ width:8,height:8,borderRadius:'50%',background:'#00d4ff',animation:'ping 1.5s ease-in-out infinite','@keyframes ping':{'0%,100%':{opacity:1,transform:'scale(1)'},'50%':{opacity:0.4,transform:'scale(1.5)'}} }} />
                    <Typography sx={{ fontSize:'0.74rem',fontWeight:700,color:'#a78bfa',letterSpacing:'0.2em',textTransform:'uppercase' }}>
                      {loading ? <Skeleton width={130} sx={{bgcolor:'rgba(255,255,255,0.05)'}} /> : (profile?.heroTagline||'Available for Work')}
                    </Typography>
                  </Box>
                </motion.div>

                {/* Name */}
                <motion.div initial={{opacity:0,y:50}} animate={{opacity:1,y:0}} transition={{duration:0.9,delay:0.1}}>
                  <Typography sx={{ fontFamily:"'Orbitron'",fontWeight:900,lineHeight:1.05,fontSize:{xs:'2.8rem',sm:'3.6rem',md:'4.4rem',lg:'5.2rem'},
                    background:'linear-gradient(135deg,#ffffff 0%,#a78bfa 40%,#00d4ff 100%)',WebkitBackgroundClip:'text',WebkitTextFillColor:'transparent',mb:1.5,
                    filter:'drop-shadow(0 0 40px rgba(124,92,255,0.28))' }}>
                    {loading ? <Skeleton width="80%" height={90} sx={{bgcolor:'rgba(255,255,255,0.05)'}} /> : (profile?.name||'')}
                  </Typography>
                </motion.div>

                {/* Title + subtitle */}
                <motion.div initial={{opacity:0,y:30}} animate={{opacity:1,y:0}} transition={{duration:0.8,delay:0.22}}>
                  <Typography sx={{ fontSize:{xs:'1rem',md:'1.25rem'},fontWeight:400,color:'rgba(224,230,255,0.7)',mb:0.5 }}>
                    {loading ? <Skeleton width="55%" sx={{bgcolor:'rgba(255,255,255,0.05)'}} /> : (profile?.title||'')}
                  </Typography>
                  {profile?.subtitle && <Typography sx={{ fontSize:'0.88rem',color:'#00d4ff',fontWeight:600,mb:3,letterSpacing:'0.05em' }}>{profile.subtitle}</Typography>}
                </motion.div>

                {/* Bio */}
                <motion.div initial={{opacity:0,y:20}} animate={{opacity:1,y:0}} transition={{duration:0.8,delay:0.38}}>
                  <Typography sx={{ color:'rgba(224,230,255,0.5)',lineHeight:1.9,fontSize:'0.95rem',maxWidth:520,mb:4 }}>
                    {loading ? [1,2,3].map(k=><Skeleton key={k} sx={{bgcolor:'rgba(255,255,255,0.04)'}}/>) : (profile?.bio||'')}
                  </Typography>
                </motion.div>

                {/* Buttons + socials */}
                <motion.div initial={{opacity:0,y:20}} animate={{opacity:1,y:0}} transition={{duration:0.7,delay:0.52}}>
                  <Box sx={{ display:'flex',gap:2,flexWrap:'wrap',mb:4 }}>
                    <Button component={RouterLink} to="/about" variant="contained" size="large" endIcon={<ArrowForward/>} sx={{
                      px:4,py:1.5,borderRadius:'12px',textTransform:'none',fontWeight:700,fontSize:'0.95rem',
                      background:'linear-gradient(135deg,#7c5cff,#00d4ff)',boxShadow:'0 8px 32px rgba(124,92,255,0.42)',
                      '&:hover':{boxShadow:'0 14px 44px rgba(124,92,255,0.62)',transform:'translateY(-3px)'},transition:'all 0.3s' }}>
                      {profile?.ctaText||'About Me'}
                    </Button>
                    {profile?.resumeUrl && (
                      <Button href={profile.resumeUrl} target="_blank" size="large" sx={{
                        px:4,py:1.5,borderRadius:'12px',textTransform:'none',fontWeight:700,
                        border:'1px solid rgba(124,92,255,0.32)',color:'#a78bfa',
                        '&:hover':{background:'rgba(124,92,255,0.12)',borderColor:'#7c5cff',transform:'translateY(-3px)'},transition:'all 0.3s' }}>Resume ↗</Button>
                    )}
                  </Box>
                  <Box sx={{ display:'flex',gap:1.5 }}>
                    {profile?.github   && <IconButton href={profile.github}   target="_blank" sx={{ color:'rgba(224,230,255,0.42)',border:'1px solid rgba(255,255,255,0.08)','&:hover':{color:'#fff',borderColor:'#7c5cff',background:'rgba(124,92,255,0.15)',transform:'translateY(-3px)'},transition:'all 0.3s' }}><GitHub/></IconButton>}
                    {profile?.linkedin && <IconButton href={profile.linkedin} target="_blank" sx={{ color:'rgba(224,230,255,0.42)',border:'1px solid rgba(255,255,255,0.08)','&:hover':{color:'#00d4ff',borderColor:'#00d4ff',background:'rgba(0,212,255,0.1)',transform:'translateY(-3px)'},transition:'all 0.3s' }}><LinkedIn/></IconButton>}
                    {profile?.whatsapp && <IconButton href={profile.whatsapp} target="_blank" sx={{ color:'rgba(224,230,255,0.42)',border:'1px solid rgba(255,255,255,0.08)','&:hover':{color:'#25d366',borderColor:'#25d366',background:'rgba(37,211,102,0.1)',transform:'translateY(-3px)'},transition:'all 0.3s' }}><WhatsApp/></IconButton>}
                  </Box>
                </motion.div>
              </motion.div>
            </Grid>

            {/* 3D + Avatar + Sharingan */}
            <Grid item xs={12} md={6} sx={{ display:'flex',justifyContent:'center',alignItems:'center' }}>
              <motion.div initial={{opacity:0,scale:0.7}} animate={{opacity:1,scale:1}} transition={{duration:1.1,delay:0.3,ease:[0.23,1,0.32,1]}} style={{ position:'relative',width:380,height:380 }}>
                {/* 3D canvas */}
                <Box sx={{ position:'absolute',inset:0,borderRadius:'50%',overflow:'hidden' }}>
                  <Canvas camera={{ position:[0,0,4], fov:45 }}>
                    <ambientLight intensity={0.35} />
                    <pointLight position={[10,10,10]} intensity={1.4} color="#7c5cff" />
                    <pointLight position={[-10,-10,-10]} intensity={0.7} color="#00d4ff" />
                    <Stars radius={100} depth={50} count={1200} factor={4} fade speed={1} />
                    <Orb mousePos={mousePos} />
                  </Canvas>
                </Box>
                {/* Avatar */}
                <Box sx={{ position:'absolute',inset:'16%',borderRadius:'50%',overflow:'hidden',zIndex:2,
                  border:'3px solid transparent',background:'linear-gradient(#0a0f1e,#0a0f1e) padding-box,linear-gradient(135deg,#7c5cff,#00d4ff) border-box',
                  boxShadow:'0 0 60px rgba(124,92,255,0.22)' }}>
                  {profile?.profileImage
                    ? <Box component="img" src={profile.profileImage} alt="profile" sx={{ width:'100%',height:'100%',objectFit:'cover' }} />
                    : <Avatar sx={{ width:'100%',height:'100%',background:'linear-gradient(135deg,rgba(124,92,255,0.3),rgba(0,212,255,0.2))',fontSize:'4.5rem',borderRadius:'50%' }}>{profile?.name?.[0]||''}</Avatar>}
                </Box>
                {/* Sharingan - top-right */}
                <Box sx={{ position:'absolute',top:-8,right:-8,zIndex:4 }}>
                  <SharinganEye />
                </Box>
                {/* Orbit rings */}
                <Box sx={{ position:'absolute',inset:-22,borderRadius:'50%',border:'1px solid rgba(124,92,255,0.16)',animation:'orb1 18s linear infinite','@keyframes orb1':{'100%':{transform:'rotate(360deg)'}},zIndex:0 }} />
                <Box sx={{ position:'absolute',inset:-46,borderRadius:'50%',border:'1px dashed rgba(0,212,255,0.1)',animation:'orb2 28s linear infinite reverse','@keyframes orb2':{'100%':{transform:'rotate(360deg)'}},zIndex:0 }} />
              </motion.div>
            </Grid>
          </Grid>
        </Container>

        {/* Scroll cue */}
        <motion.div animate={{ y:[0,12,0] }} transition={{ repeat:Infinity,duration:2.2 }} style={{ position:'absolute',bottom:32,left:'50%',transform:'translateX(-50%)' }}>
          <Box sx={{ width:26,height:42,borderRadius:'13px',border:'2px solid rgba(124,92,255,0.32)',display:'flex',justifyContent:'center',pt:1 }}>
            <Box sx={{ width:4,height:10,borderRadius:'2px',background:'linear-gradient(180deg,#7c5cff,#00d4ff)',animation:'sc 2.2s ease-in-out infinite','@keyframes sc':{'0%,100%':{opacity:1,transform:'translateY(0)'},'50%':{opacity:0,transform:'translateY(10px)'}} }} />
          </Box>
        </motion.div>
      </Box>

      {/* ── SKILLS ── */}
      {(loading || skills.length > 0) && (
        <Box sx={{ py:10, position:'relative', zIndex:1 }}>
          <Container maxWidth="xl">
            <Heading sub="hover to activate — eye lights up">Tech Arsenal</Heading>
            {loading ? (
              <Box sx={{ display:'flex',flexWrap:'wrap',gap:1,justifyContent:'center' }}>
                {Array.from({length:20}).map((_,i)=><Skeleton key={i} width={70+(i%5)*18} height={34} sx={{ bgcolor:'rgba(255,255,255,0.04)',borderRadius:'30px' }} />)}
              </Box>
            ) : (
              <Box sx={{ textAlign:'center', lineHeight:2.4 }}>
                {skills.map((s,i)=><SkillBadge key={s+i} skill={s} index={i} />)}
              </Box>
            )}
          </Container>
        </Box>
      )}

      {/* ── PROJECTS ── */}
      <Box sx={{ py:10, position:'relative', zIndex:1 }}>
        <Container maxWidth="xl">
          <Heading sub="rl-ranked by visitor engagement" grad="linear-gradient(135deg,#fff,#00d4ff)">Projects</Heading>
          {loading ? (
            <Grid container spacing={3}>
              {[1,2,3].map(k=><Grid key={k} item xs={12} sm={6} md={4}><Skeleton variant="rounded" height={360} sx={{bgcolor:'rgba(255,255,255,0.04)',borderRadius:'22px'}} /></Grid>)}
            </Grid>
          ) : projects.length === 0 ? (
            <Box sx={{ textAlign:'center',py:8,color:'rgba(224,230,255,0.24)' }}>
              <Code sx={{ fontSize:60,mb:2,opacity:0.28 }} />
              <Typography>Projects will appear here once added via Admin.</Typography>
            </Box>
          ) : (
            <Grid container spacing={3}>
              {projects.map((p,i)=><ProjectCard key={p._id} project={p} index={i} />)}
            </Grid>
          )}
        </Container>
      </Box>

      {/* ── CONTACT ── */}
      <Box sx={{ py:10, position:'relative', zIndex:1 }}>
        <Container maxWidth="md">
          <Heading>Get In Touch</Heading>
          <ContactForm />
        </Container>
      </Box>
    </Box>
  );
}
