import React, { useState } from 'react';
import { Box, Typography, TextField, Button, Grid, IconButton, Dialog, DialogTitle, DialogContent, DialogActions, Slider, Alert, CircularProgress, Chip } from '@mui/material';
import { Add, Edit, Delete, Close } from '@mui/icons-material';
import { useCrud } from '../shared/useCrud';

const inputSx = {
  '& .MuiOutlinedInput-root':{ color:'#e0e6ff', fontFamily:"'Space Grotesk'", background:'rgba(255,255,255,0.03)', borderRadius:'10px',
    '& fieldset':{ borderColor:'rgba(124,92,255,0.2)' }, '&:hover fieldset':{ borderColor:'rgba(124,92,255,0.4)' }, '&.Mui-focused fieldset':{ borderColor:'#7c5cff' } },
  '& .MuiInputLabel-root':{ color:'rgba(224,230,255,0.4)' }, '& .MuiInputLabel-root.Mui-focused':{ color:'#a78bfa' },
};

const empty = { name:'', category:'', level:80 };

export default function AdminSkills() {
  const { items, loading, create, update, remove } = useCrud('skills');
  const [open, setOpen] = useState(false);
  const [form, setForm] = useState(empty);
  const [editId, setEditId] = useState(null);
  const [saving, setSaving] = useState(false);
  const [error, setError]   = useState('');

  const handleOpen = (item=null) => {
    setEditId(item?._id||null);
    setForm(item ? { name:item.name, category:item.category||'', level:item.level??80 } : empty);
    setError(''); setOpen(true);
  };

  const handleSubmit = async () => {
    setSaving(true); setError('');
    try {
      if (editId) await update(editId, form);
      else        await create(form);
      setOpen(false);
    } catch (e) { setError(e.message); }
    finally { setSaving(false); }
  };

  const categories = [...new Set(items.map(s=>s.category||'General'))];

  return (
    <Box>
      <Box sx={{ display:'flex', justifyContent:'space-between', alignItems:'center', mb:4 }}>
        <Typography sx={{ fontFamily:"'Orbitron'", fontWeight:900, fontSize:'1.5rem', background:'linear-gradient(135deg,#fff,#a78bfa)', WebkitBackgroundClip:'text', WebkitTextFillColor:'transparent' }}>Skills</Typography>
        <Button onClick={()=>handleOpen()} startIcon={<Add />} variant="contained" sx={{ borderRadius:'10px', textTransform:'none', fontWeight:700, background:'linear-gradient(135deg,#7c5cff,#00d4ff)', boxShadow:'0 4px 20px rgba(124,92,255,0.35)' }}>Add Skill</Button>
      </Box>

      {loading ? <CircularProgress sx={{ color:'#7c5cff', display:'block', mx:'auto', mt:4 }} /> : (
        categories.map(cat => (
          <Box key={cat} sx={{ mb:4 }}>
            <Typography sx={{ color:'#a78bfa', fontWeight:700, fontSize:'0.78rem', letterSpacing:'0.15em', textTransform:'uppercase', mb:2 }}>{cat}</Typography>
            <Grid container spacing={2}>
              {items.filter(s=>(s.category||'General')===cat).map(item=>(
                <Grid item xs={12} sm={6} md={4} key={item._id}>
                  <Box sx={{ p:2.5, borderRadius:'14px', background:'rgba(255,255,255,0.03)', border:'1px solid rgba(124,92,255,0.12)' }}>
                    <Box sx={{ display:'flex', justifyContent:'space-between', alignItems:'center', mb:1.5 }}>
                      <Typography sx={{ fontWeight:600, color:'#e0e6ff', fontSize:'0.9rem' }}>{item.name}</Typography>
                      <Box>
                        <IconButton size="small" onClick={()=>handleOpen(item)} sx={{ color:'#a78bfa' }}><Edit fontSize="small" /></IconButton>
                        <IconButton size="small" onClick={()=>remove(item._id)} sx={{ color:'#ff6b6b' }}><Delete fontSize="small" /></IconButton>
                      </Box>
                    </Box>
                    <Box sx={{ display:'flex', alignItems:'center', gap:1 }}>
                      <Box sx={{ flex:1, height:5, borderRadius:3, background:'rgba(255,255,255,0.06)', overflow:'hidden' }}>
                        <Box sx={{ width:`${item.level}%`, height:'100%', background:'linear-gradient(90deg,#7c5cff,#00d4ff)', borderRadius:3 }} />
                      </Box>
                      <Typography sx={{ color:'#7c5cff', fontSize:'0.75rem', fontWeight:700, minWidth:32 }}>{item.level}%</Typography>
                    </Box>
                  </Box>
                </Grid>
              ))}
            </Grid>
          </Box>
        ))
      )}

      <Dialog open={open} onClose={()=>setOpen(false)} maxWidth="xs" fullWidth PaperProps={{ sx:{ background:'#0d1224', border:'1px solid rgba(124,92,255,0.2)', borderRadius:'20px' } }}>
        <DialogTitle sx={{ color:'#e0e6ff', fontFamily:"'Space Grotesk'", fontWeight:700, display:'flex', justifyContent:'space-between', alignItems:'center' }}>
          {editId ? 'Edit Skill' : 'Add Skill'}
          <IconButton onClick={()=>setOpen(false)} sx={{ color:'rgba(224,230,255,0.4)' }}><Close /></IconButton>
        </DialogTitle>
        <DialogContent sx={{ pt:1 }}>
          {error && <Alert severity="error" sx={{ mb:2, background:'rgba(255,80,80,0.08)', color:'#ff8080', border:'1px solid rgba(255,80,80,0.2)', borderRadius:'10px' }}>{error}</Alert>}
          <TextField fullWidth label="Skill Name" value={form.name} onChange={e=>setForm(f=>({...f,name:e.target.value}))} sx={{ ...inputSx, mb:2 }} required />
          <TextField fullWidth label="Category (e.g. Frontend, AI, Backend)" value={form.category} onChange={e=>setForm(f=>({...f,category:e.target.value}))} sx={{ ...inputSx, mb:3 }} />
          <Typography sx={{ color:'rgba(224,230,255,0.5)', fontSize:'0.82rem', mb:1 }}>Proficiency Level: <strong style={{ color:'#a78bfa' }}>{form.level}%</strong></Typography>
          <Slider value={form.level} onChange={(_,v)=>setForm(f=>({...f,level:v}))} min={0} max={100} sx={{ color:'#7c5cff', '& .MuiSlider-thumb':{ background:'linear-gradient(135deg,#7c5cff,#00d4ff)' } }} />
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
