import React, { useState, useRef } from 'react';
import { Box, Typography, TextField, Button, Grid, Chip, Alert, CircularProgress, Avatar, IconButton, Dialog, DialogTitle, DialogContent, DialogActions, Switch, FormControlLabel } from '@mui/material';
import { Add, Edit, Delete, CloudUpload, Close, TrendingUp } from '@mui/icons-material';
import { useCrud } from '../shared/useCrud';

const inputSx = {
  '& .MuiOutlinedInput-root':{ color:'#e0e6ff', fontFamily:"'Space Grotesk'", background:'rgba(255,255,255,0.03)', borderRadius:'10px',
    '& fieldset':{ borderColor:'rgba(124,92,255,0.2)' }, '&:hover fieldset':{ borderColor:'rgba(124,92,255,0.4)' }, '&.Mui-focused fieldset':{ borderColor:'#7c5cff' } },
  '& .MuiInputLabel-root':{ color:'rgba(224,230,255,0.4)' }, '& .MuiInputLabel-root.Mui-focused':{ color:'#a78bfa' },
};

const empty = { title:'', description:'', techStack:'', liveUrl:'', githubUrl:'', imageUrl:'', featured:false };

export default function AdminProjects() {
  const { items, loading, create, update, remove } = useCrud('projects');
  const [open,   setOpen]   = useState(false);
  const [form,   setForm]   = useState(empty);
  const [editId, setEditId] = useState(null);
  const [saving, setSaving] = useState(false);
  const [error,  setError]  = useState('');
  const [imgFile, setImgFile] = useState(null);
  const [imgPreview, setImgPreview] = useState('');
  const fileRef = useRef();

  const handleOpen = (item=null) => {
    setEditId(item?._id||null);
    setForm(item ? { title:item.title, description:item.description, techStack:(item.techStack||[]).join(', '), liveUrl:item.liveUrl||'', githubUrl:item.githubUrl||'', imageUrl:item.imageUrl||'', featured:item.featured||false } : empty);
    setImgFile(null); setImgPreview(item?.imageUrl||''); setError(''); setOpen(true);
  };

  const handleImgChange = (e) => {
    const f = e.target.files[0]; if (!f) return;
    setImgFile(f); setImgPreview(URL.createObjectURL(f));
  };

  const handleSubmit = async () => {
    setSaving(true); setError('');
    try {
      const fd = new FormData();
      Object.entries(form).forEach(([k,v]) => fd.append(k, v));
      if (imgFile) fd.append('image', imgFile);
      if (editId) await update(editId, fd, true);
      else        await create(fd, true);
      setOpen(false);
    } catch (e) { setError(e.message); }
    finally { setSaving(false); }
  };

  const handleDelete = async (id) => { if (window.confirm('Delete project?')) await remove(id); };

  return (
    <Box>
      <Box sx={{ display:'flex', justifyContent:'space-between', alignItems:'center', mb:4 }}>
        <Typography sx={{ fontFamily:"'Orbitron'", fontWeight:900, fontSize:'1.5rem', background:'linear-gradient(135deg,#fff,#00d4ff)', WebkitBackgroundClip:'text', WebkitTextFillColor:'transparent' }}>Projects</Typography>
        <Button onClick={()=>handleOpen()} startIcon={<Add />} variant="contained" sx={{ borderRadius:'10px', textTransform:'none', fontWeight:700, background:'linear-gradient(135deg,#7c5cff,#00d4ff)', boxShadow:'0 4px 20px rgba(124,92,255,0.35)' }}>Add Project</Button>
      </Box>

      {loading ? <CircularProgress sx={{ color:'#7c5cff', display:'block', mx:'auto', mt:4 }} /> : items.length === 0 ? (
        <Box sx={{ textAlign:'center', py:8, color:'rgba(224,230,255,0.25)' }}><Typography>No projects yet. Add your first one!</Typography></Box>
      ) : (
        <Grid container spacing={3}>
          {items.map(item => (
            <Grid item xs={12} sm={6} lg={4} key={item._id}>
              <Box sx={{ p:3, borderRadius:'16px', background:'rgba(255,255,255,0.03)', border:'1px solid rgba(124,92,255,0.12)', backdropFilter:'blur(20px)', height:'100%' }}>
                {(item.imageUrl||item.imageData) && <Box component="img" src={item.imageUrl||item.imageData} alt={item.title} sx={{ width:'100%', height:140, objectFit:'cover', borderRadius:'10px', mb:2 }} />}
                <Box sx={{ display:'flex', justifyContent:'space-between', alignItems:'flex-start' }}>
                  <Typography sx={{ fontWeight:700, color:'#e0e6ff', flex:1, mr:1 }}>{item.title}</Typography>
                  <Box>
                    <IconButton size="small" onClick={()=>handleOpen(item)} sx={{ color:'#a78bfa' }}><Edit fontSize="small" /></IconButton>
                    <IconButton size="small" onClick={()=>handleDelete(item._id)} sx={{ color:'#ff6b6b' }}><Delete fontSize="small" /></IconButton>
                  </Box>
                </Box>
                <Typography sx={{ color:'rgba(224,230,255,0.45)', fontSize:'0.8rem', mt:0.5, mb:1, display:'-webkit-box', WebkitLineClamp:2, WebkitBoxOrient:'vertical', overflow:'hidden' }}>{item.description}</Typography>
                <Box sx={{ display:'flex', flexWrap:'wrap', gap:0.4, mb:1 }}>
                  {(item.techStack||[]).slice(0,4).map(t=><Chip key={t} label={t} size="small" sx={{ background:'rgba(0,212,255,0.06)', color:'#00d4ff', fontSize:'0.65rem', border:'1px solid rgba(0,212,255,0.15)' }} />)}
                </Box>
                <Box sx={{ display:'flex', alignItems:'center', gap:1, mt:1 }}>
                  <TrendingUp sx={{ fontSize:14, color:'#7c5cff' }} />
                  <Typography sx={{ fontSize:'0.72rem', color:'rgba(224,230,255,0.35)' }}>Score: {Math.round(item.engagement?.engagementScore||0)} · Views: {item.engagement?.views||0}</Typography>
                </Box>
              </Box>
            </Grid>
          ))}
        </Grid>
      )}

      <Dialog open={open} onClose={()=>setOpen(false)} maxWidth="sm" fullWidth PaperProps={{ sx:{ background:'#0d1224', border:'1px solid rgba(124,92,255,0.2)', borderRadius:'20px' } }}>
        <DialogTitle sx={{ color:'#e0e6ff', fontFamily:"'Space Grotesk'", fontWeight:700, display:'flex', justifyContent:'space-between', alignItems:'center' }}>
          {editId ? 'Edit Project' : 'Add Project'}
          <IconButton onClick={()=>setOpen(false)} sx={{ color:'rgba(224,230,255,0.4)' }}><Close /></IconButton>
        </DialogTitle>
        <DialogContent sx={{ pt:1 }}>
          {error && <Alert severity="error" sx={{ mb:2, background:'rgba(255,80,80,0.08)', color:'#ff8080', border:'1px solid rgba(255,80,80,0.2)', borderRadius:'10px' }}>{error}</Alert>}
          {/* Image upload */}
          <Box sx={{ mb:2, display:'flex', alignItems:'center', gap:2 }}>
            {imgPreview && <Box component="img" src={imgPreview} sx={{ width:80, height:60, objectFit:'cover', borderRadius:'8px', border:'1px solid rgba(124,92,255,0.3)' }} />}
            <input ref={fileRef} type="file" accept="image/*" onChange={handleImgChange} style={{ display:'none' }} />
            <Button startIcon={<CloudUpload />} onClick={()=>fileRef.current.click()} sx={{ color:'#a78bfa', border:'1px solid rgba(124,92,255,0.3)', borderRadius:'8px', textTransform:'none', fontSize:'0.82rem', '&:hover':{ background:'rgba(124,92,255,0.1)' } }}>
              {imgPreview ? 'Change Image' : 'Upload Image'}
            </Button>
          </Box>
          <TextField fullWidth label="Title" value={form.title} onChange={e=>setForm(f=>({...f,title:e.target.value}))} sx={{ ...inputSx, mb:2 }} required />
          <TextField fullWidth multiline rows={3} label="Description" value={form.description} onChange={e=>setForm(f=>({...f,description:e.target.value}))} sx={{ ...inputSx, mb:2 }} required />
          <TextField fullWidth label="Tech Stack (comma-separated)" value={form.techStack} onChange={e=>setForm(f=>({...f,techStack:e.target.value}))} sx={{ ...inputSx, mb:2 }} />
          <TextField fullWidth label="GitHub URL" value={form.githubUrl} onChange={e=>setForm(f=>({...f,githubUrl:e.target.value}))} sx={{ ...inputSx, mb:2 }} />
          <TextField fullWidth label="Live URL" value={form.liveUrl} onChange={e=>setForm(f=>({...f,liveUrl:e.target.value}))} sx={{ ...inputSx, mb:2 }} />
          <TextField fullWidth label="Image URL (or upload above)" value={form.imageUrl} onChange={e=>setForm(f=>({...f,imageUrl:e.target.value}))} sx={{ ...inputSx, mb:2 }} />
          <FormControlLabel control={<Switch checked={form.featured} onChange={e=>setForm(f=>({...f,featured:e.target.checked}))} sx={{ '& .MuiSwitch-thumb':{ background:'#7c5cff' } }} />}
            label={<Typography sx={{ color:'rgba(224,230,255,0.7)', fontSize:'0.88rem' }}>Featured</Typography>} />
        </DialogContent>
        <DialogActions sx={{ p:3, pt:1 }}>
          <Button onClick={()=>setOpen(false)} sx={{ color:'rgba(224,230,255,0.4)', textTransform:'none' }}>Cancel</Button>
          <Button onClick={handleSubmit} disabled={saving} variant="contained" sx={{ borderRadius:'10px', textTransform:'none', fontWeight:700, background:'linear-gradient(135deg,#7c5cff,#00d4ff)', px:3 }}>
            {saving ? <CircularProgress size={18} color="inherit" /> : (editId ? 'Update' : 'Create')}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}
