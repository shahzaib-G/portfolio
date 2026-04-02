import React, { useState } from 'react';
import { Box, Typography, TextField, Button, IconButton, Dialog, DialogTitle, DialogContent, DialogActions, Alert, CircularProgress, Switch, FormControlLabel, Chip } from '@mui/material';
import { Add, Edit, Delete, Close, Work } from '@mui/icons-material';
import { useCrud } from '../shared/useCrud';

const inputSx = {
  '& .MuiOutlinedInput-root':{ color:'#e0e6ff', fontFamily:"'Space Grotesk'", background:'rgba(255,255,255,0.03)', borderRadius:'10px',
    '& fieldset':{ borderColor:'rgba(124,92,255,0.2)' }, '&:hover fieldset':{ borderColor:'rgba(124,92,255,0.4)' }, '&.Mui-focused fieldset':{ borderColor:'#7c5cff' } },
  '& .MuiInputLabel-root':{ color:'rgba(224,230,255,0.4)' }, '& .MuiInputLabel-root.Mui-focused':{ color:'#a78bfa' },
};

const empty = { company:'', role:'', startDate:'', endDate:'', current:false, description:'', techStack:'' };

export default function AdminExperiences() {
  const { items, loading, create, update, remove } = useCrud('experiences');
  const [open, setOpen] = useState(false);
  const [form, setForm] = useState(empty);
  const [editId, setEditId] = useState(null);
  const [saving, setSaving] = useState(false);
  const [error, setError]   = useState('');

  const handleOpen = (item=null) => {
    setEditId(item?._id||null);
    setForm(item ? { company:item.company, role:item.role, startDate:item.startDate||'', endDate:item.endDate||'', current:item.current||false, description:item.description||'', techStack:(item.techStack||[]).join(', ') } : empty);
    setError(''); setOpen(true);
  };

  const handleSubmit = async () => {
    setSaving(true); setError('');
    try {
      const data = { ...form, techStack: form.techStack.split(',').map(s=>s.trim()).filter(Boolean) };
      if (editId) await update(editId, data);
      else        await create(data);
      setOpen(false);
    } catch(e) { setError(e.message); }
    finally { setSaving(false); }
  };

  return (
    <Box>
      <Box sx={{ display:'flex', justifyContent:'space-between', alignItems:'center', mb:4 }}>
        <Typography sx={{ fontFamily:"'Orbitron'", fontWeight:900, fontSize:'1.5rem', background:'linear-gradient(135deg,#fff,#a78bfa)', WebkitBackgroundClip:'text', WebkitTextFillColor:'transparent' }}>Experience</Typography>
        <Button onClick={()=>handleOpen()} startIcon={<Add />} variant="contained" sx={{ borderRadius:'10px', textTransform:'none', fontWeight:700, background:'linear-gradient(135deg,#7c5cff,#00d4ff)', boxShadow:'0 4px 20px rgba(124,92,255,0.35)' }}>Add Experience</Button>
      </Box>

      {loading ? <CircularProgress sx={{ color:'#7c5cff', display:'block', mx:'auto', mt:4 }} /> : items.length === 0 ? (
        <Box sx={{ textAlign:'center', py:8 }}><Work sx={{ fontSize:56, color:'rgba(124,92,255,0.2)', mb:2 }} /><Typography sx={{ color:'rgba(224,230,255,0.25)' }}>No experience entries yet.</Typography></Box>
      ) : items.map(item=>(
        <Box key={item._id} sx={{ mb:3, p:3, borderRadius:'16px', background:'rgba(255,255,255,0.03)', border:'1px solid rgba(124,92,255,0.12)' }}>
          <Box sx={{ display:'flex', justifyContent:'space-between', alignItems:'flex-start' }}>
            <Box>
              <Typography sx={{ fontWeight:700, color:'#e0e6ff' }}>{item.role}</Typography>
              <Typography sx={{ color:'#7c5cff', fontSize:'0.85rem', fontWeight:600 }}>{item.company}</Typography>
              <Typography sx={{ color:'rgba(224,230,255,0.35)', fontSize:'0.78rem', mt:0.3 }}>
                {item.startDate}{item.current ? ' – Present' : item.endDate ? ` – ${item.endDate}` : ''}
              </Typography>
            </Box>
            <Box>
              <IconButton size="small" onClick={()=>handleOpen(item)} sx={{ color:'#a78bfa' }}><Edit fontSize="small" /></IconButton>
              <IconButton size="small" onClick={()=>remove(item._id)} sx={{ color:'#ff6b6b' }}><Delete fontSize="small" /></IconButton>
            </Box>
          </Box>
          {item.description && <Typography sx={{ color:'rgba(224,230,255,0.45)', fontSize:'0.82rem', mt:1.5, lineHeight:1.7 }}>{item.description}</Typography>}
          {item.techStack?.length > 0 && <Box sx={{ display:'flex', flexWrap:'wrap', gap:0.5, mt:1.5 }}>
            {item.techStack.map(t=><Chip key={t} label={t} size="small" sx={{ background:'rgba(124,92,255,0.08)', color:'#a78bfa', fontSize:'0.65rem', border:'1px solid rgba(124,92,255,0.18)' }} />)}
          </Box>}
        </Box>
      ))}

      <Dialog open={open} onClose={()=>setOpen(false)} maxWidth="sm" fullWidth PaperProps={{ sx:{ background:'#0d1224', border:'1px solid rgba(124,92,255,0.2)', borderRadius:'20px' } }}>
        <DialogTitle sx={{ color:'#e0e6ff', fontFamily:"'Space Grotesk'", fontWeight:700, display:'flex', justifyContent:'space-between' }}>
          {editId ? 'Edit Experience' : 'Add Experience'}<IconButton onClick={()=>setOpen(false)} sx={{ color:'rgba(224,230,255,0.4)' }}><Close /></IconButton>
        </DialogTitle>
        <DialogContent sx={{ pt:1 }}>
          {error && <Alert severity="error" sx={{ mb:2, background:'rgba(255,80,80,0.08)', color:'#ff8080', border:'1px solid rgba(255,80,80,0.2)', borderRadius:'10px' }}>{error}</Alert>}
          <TextField fullWidth label="Company" value={form.company} onChange={e=>setForm(f=>({...f,company:e.target.value}))} sx={{ ...inputSx, mb:2 }} required />
          <TextField fullWidth label="Role / Position" value={form.role} onChange={e=>setForm(f=>({...f,role:e.target.value}))} sx={{ ...inputSx, mb:2 }} required />
          <Box sx={{ display:'flex', gap:2, mb:2 }}>
            <TextField fullWidth label="Start Date (e.g. Jan 2023)" value={form.startDate} onChange={e=>setForm(f=>({...f,startDate:e.target.value}))} sx={inputSx} />
            {!form.current && <TextField fullWidth label="End Date" value={form.endDate} onChange={e=>setForm(f=>({...f,endDate:e.target.value}))} sx={inputSx} />}
          </Box>
          <FormControlLabel control={<Switch checked={form.current} onChange={e=>setForm(f=>({...f,current:e.target.checked}))} sx={{ '& .MuiSwitch-thumb':{ background:'#7c5cff' } }} />}
            label={<Typography sx={{ color:'rgba(224,230,255,0.7)', fontSize:'0.88rem' }}>Currently working here</Typography>} sx={{ mb:2 }} />
          <TextField fullWidth multiline rows={3} label="Description" value={form.description} onChange={e=>setForm(f=>({...f,description:e.target.value}))} sx={{ ...inputSx, mb:2 }} />
          <TextField fullWidth label="Tech Stack (comma-separated)" value={form.techStack} onChange={e=>setForm(f=>({...f,techStack:e.target.value}))} sx={inputSx} />
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
