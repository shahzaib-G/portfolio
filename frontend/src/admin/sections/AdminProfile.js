import React, { useEffect, useState, useRef } from 'react';
import { Box, Typography, TextField, Button, Grid, Avatar, Alert, CircularProgress, Divider } from '@mui/material';
import { CloudUpload, Save } from '@mui/icons-material';
import API from '../../utils/config';

const token = () => localStorage.getItem('adminToken');
const inputSx = {
  '& .MuiOutlinedInput-root':{ color:'#e0e6ff', fontFamily:"'Space Grotesk'", background:'rgba(255,255,255,0.03)', borderRadius:'10px',
    '& fieldset':{ borderColor:'rgba(124,92,255,0.2)' }, '&:hover fieldset':{ borderColor:'rgba(124,92,255,0.4)' }, '&.Mui-focused fieldset':{ borderColor:'#7c5cff' } },
  '& .MuiInputLabel-root':{ color:'rgba(224,230,255,0.4)' }, '& .MuiInputLabel-root.Mui-focused':{ color:'#a78bfa' },
};

const FIELDS = [
  { name:'name',       label:'Full Name' },
  { name:'title',      label:'Title (e.g. Web Developer & AI Enthusiast)' },
  { name:'subtitle',   label:'Subtitle (e.g. BSc AI · KFUEIT)' },
  { name:'location',   label:'Location' },
  { name:'email',      label:'Contact Email' },
  { name:'heroTagline',label:'Hero Tagline (shown above name)' },
  { name:'ctaText',    label:'CTA Button Text' },
  { name:'resumeUrl',  label:'Resume URL' },
  { name:'github',     label:'GitHub URL' },
  { name:'linkedin',   label:'LinkedIn URL' },
  { name:'whatsapp',   label:'WhatsApp URL' },
  { name:'instagram',  label:'Instagram URL' },
  { name:'twitter',    label:'Twitter URL' },
  { name:'website',    label:'Website URL' },
  { name:'seoTitle',   label:'SEO Title' },
  { name:'seoDescription', label:'SEO Description' },
];

export default function AdminProfile() {
  const [form,    setForm]    = useState({});
  const [status,  setStatus]  = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving,  setSaving]  = useState(false);
  const [imgLoad, setImgLoad] = useState(false);
  const fileRef = useRef();

  const load = () => {
    setLoading(true);
    fetch(`${API}/profile`, { headers:{ Authorization:`Bearer ${token()}` } })
      .then(r=>r.json()).then(d=>setForm(d||{})).catch(()=>{}).finally(()=>setLoading(false));
  };
  useEffect(()=>{ load(); }, []);

  const handleChange = (e) => setForm(f=>({ ...f, [e.target.name]: e.target.value }));

  const handleSave = async (e) => {
    e.preventDefault(); setSaving(true); setStatus(null);
    try {
      const res = await fetch(`${API}/profile`, { method:'PUT', headers:{ Authorization:`Bearer ${token()}`, 'Content-Type':'application/json' }, body: JSON.stringify(form) });
      if (!res.ok) throw new Error('Save failed');
      setStatus('success'); load();
    } catch { setStatus('error'); }
    finally { setSaving(false); }
  };

  const handleImageUpload = async (e) => {
    const file = e.target.files[0]; if (!file) return;
    const fd = new FormData(); fd.append('image', file);
    setImgLoad(true);
    try {
      const res = await fetch(`${API}/profile/upload-image`, { method:'POST', headers:{ Authorization:`Bearer ${token()}` }, body: fd });
      if (!res.ok) throw new Error();
      const d = await res.json();
      setForm(f => ({ ...f, profileImage: d.profileImage }));
    } catch { setStatus('imgError'); }
    finally { setImgLoad(false); }
  };

  if (loading) return <Box sx={{ display:'flex', justifyContent:'center', pt:8 }}><CircularProgress sx={{ color:'#7c5cff' }} /></Box>;

  return (
    <Box component="form" onSubmit={handleSave}>
      <Typography sx={{ fontFamily:"'Orbitron'", fontWeight:900, fontSize:'1.5rem', background:'linear-gradient(135deg,#fff,#a78bfa)', WebkitBackgroundClip:'text', WebkitTextFillColor:'transparent', mb:4 }}>
        Profile Settings
      </Typography>

      {status === 'success'  && <Alert severity="success" sx={{ mb:2, background:'rgba(0,255,128,0.08)', color:'#6effc8', border:'1px solid rgba(0,255,128,0.2)', borderRadius:'10px' }}>Saved!</Alert>}
      {status === 'error'    && <Alert severity="error"   sx={{ mb:2, background:'rgba(255,80,80,0.08)',  color:'#ff8080', border:'1px solid rgba(255,80,80,0.2)',  borderRadius:'10px' }}>Save failed.</Alert>}
      {status === 'imgError' && <Alert severity="error"   sx={{ mb:2, background:'rgba(255,80,80,0.08)',  color:'#ff8080', border:'1px solid rgba(255,80,80,0.2)',  borderRadius:'10px' }}>Image upload failed.</Alert>}

      {/* Profile image */}
      <Box sx={{ display:'flex', alignItems:'center', gap:3, mb:4, p:3, borderRadius:'16px', background:'rgba(255,255,255,0.03)', border:'1px solid rgba(124,92,255,0.12)' }}>
        <Avatar src={form.profileImage} sx={{ width:80, height:80, border:'2px solid rgba(124,92,255,0.4)', fontSize:'2rem' }}>{form.name?.[0]||'A'}</Avatar>
        <Box>
          <Typography sx={{ color:'#e0e6ff', fontWeight:600, mb:1 }}>Profile Photo</Typography>
          <input ref={fileRef} type="file" accept="image/*" onChange={handleImageUpload} style={{ display:'none' }} />
          <Button startIcon={imgLoad ? <CircularProgress size={16} color="inherit" /> : <CloudUpload />} onClick={()=>fileRef.current.click()} disabled={imgLoad} sx={{
            color:'#a78bfa', border:'1px solid rgba(124,92,255,0.3)', borderRadius:'10px', textTransform:'none', px:2, py:0.8,
            '&:hover':{ background:'rgba(124,92,255,0.1)' },
          }}>{imgLoad ? 'Uploading…' : 'Upload Photo'}</Button>
        </Box>
      </Box>

      {/* Bio separately */}
      <TextField fullWidth multiline rows={4} name="bio" label="Bio / About text" value={form.bio||''} onChange={handleChange} sx={{ ...inputSx, mb:3 }} />

      {/* Featured skills */}
      <TextField fullWidth name="featuredSkills" label="Featured Skills (comma-separated)" value={form.featuredSkills||''} onChange={handleChange} sx={{ ...inputSx, mb:4 }}
        helperText={<span style={{ color:'rgba(224,230,255,0.3)', fontSize:'0.75rem' }}>e.g. React,Python,Node.js — shown as badges on Home page</span>} />

      <Divider sx={{ borderColor:'rgba(124,92,255,0.08)', mb:3 }} />

      <Grid container spacing={2.5}>
        {FIELDS.map(f => (
          <Grid item xs={12} sm={6} key={f.name}>
            <TextField fullWidth label={f.label} name={f.name} value={form[f.name]||''} onChange={handleChange} sx={inputSx} />
          </Grid>
        ))}
      </Grid>

      <Button type="submit" disabled={saving} variant="contained" size="large" startIcon={saving ? <CircularProgress size={18} color="inherit" /> : <Save />} sx={{
        mt:4, px:5, py:1.5, borderRadius:'12px', textTransform:'none', fontWeight:700,
        background:'linear-gradient(135deg,#7c5cff,#00d4ff)', boxShadow:'0 8px 30px rgba(124,92,255,0.35)',
        '&:hover':{ boxShadow:'0 12px 40px rgba(124,92,255,0.55)' },
      }}>{saving ? 'Saving…' : 'Save Profile'}</Button>
    </Box>
  );
}
