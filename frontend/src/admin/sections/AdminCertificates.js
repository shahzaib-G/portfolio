import React, { useState } from 'react';
import { Box, Typography, TextField, Button, Grid, IconButton, Dialog, DialogTitle, DialogContent, DialogActions, Alert, CircularProgress } from '@mui/material';
import { Add, Edit, Delete, Close, EmojiEvents } from '@mui/icons-material';
import { useCrud } from '../shared/useCrud';

const inputSx = {
  '& .MuiOutlinedInput-root':{ color:'#e0e6ff', fontFamily:"'Space Grotesk'", background:'rgba(255,255,255,0.03)', borderRadius:'10px',
    '& fieldset':{ borderColor:'rgba(124,92,255,0.2)' }, '&:hover fieldset':{ borderColor:'rgba(124,92,255,0.4)' }, '&.Mui-focused fieldset':{ borderColor:'#7c5cff' } },
  '& .MuiInputLabel-root':{ color:'rgba(224,230,255,0.4)' }, '& .MuiInputLabel-root.Mui-focused':{ color:'#a78bfa' },
};

const empty = { title:'', issuer:'', date:'', credentialUrl:'', imageUrl:'' };

export default function AdminCertificates() {
  const { items, loading, create, update, remove } = useCrud('certificates');
  const [open, setOpen] = useState(false);
  const [form, setForm] = useState(empty);
  const [editId, setEditId] = useState(null);
  const [saving, setSaving] = useState(false);
  const [error, setError]   = useState('');

  const handleOpen = (item=null) => {
    setEditId(item?._id||null);
    setForm(item ? { title:item.title, issuer:item.issuer, date:item.date||'', credentialUrl:item.credentialUrl||'', imageUrl:item.imageUrl||'' } : empty);
    setError(''); setOpen(true);
  };

  const handleSubmit = async () => {
    setSaving(true); setError('');
    try {
      if (editId) await update(editId, form);
      else        await create(form);
      setOpen(false);
    } catch(e) { setError(e.message); }
    finally { setSaving(false); }
  };

  return (
    <Box>
      <Box sx={{ display:'flex', justifyContent:'space-between', alignItems:'center', mb:4 }}>
        <Typography sx={{ fontFamily:"'Orbitron'", fontWeight:900, fontSize:'1.5rem', background:'linear-gradient(135deg,#fff,#00d4ff)', WebkitBackgroundClip:'text', WebkitTextFillColor:'transparent' }}>Certificates</Typography>
        <Button onClick={()=>handleOpen()} startIcon={<Add />} variant="contained" sx={{ borderRadius:'10px', textTransform:'none', fontWeight:700, background:'linear-gradient(135deg,#7c5cff,#00d4ff)', boxShadow:'0 4px 20px rgba(124,92,255,0.35)' }}>Add Certificate</Button>
      </Box>

      {loading ? <CircularProgress sx={{ color:'#7c5cff', display:'block', mx:'auto', mt:4 }} /> : items.length === 0 ? (
        <Box sx={{ textAlign:'center', py:8 }}><EmojiEvents sx={{ fontSize:56, color:'rgba(124,92,255,0.2)', mb:2 }} /><Typography sx={{ color:'rgba(224,230,255,0.25)' }}>No certificates yet.</Typography></Box>
      ) : (
        <Grid container spacing={3}>
          {items.map(item=>(
            <Grid item xs={12} sm={6} md={4} key={item._id}>
              <Box sx={{ p:3, borderRadius:'16px', background:'rgba(255,255,255,0.03)', border:'1px solid rgba(124,92,255,0.12)', height:'100%' }}>
                {item.imageUrl && <Box component="img" src={item.imageUrl} alt={item.title} sx={{ width:'100%', height:120, objectFit:'cover', borderRadius:'8px', mb:2 }} />}
                <Box sx={{ display:'flex', justifyContent:'space-between', alignItems:'flex-start' }}>
                  <Box>
                    <Typography sx={{ fontWeight:700, color:'#e0e6ff', fontSize:'0.9rem' }}>{item.title}</Typography>
                    <Typography sx={{ color:'#7c5cff', fontSize:'0.78rem', fontWeight:600 }}>{item.issuer}</Typography>
                    {item.date && <Typography sx={{ color:'rgba(224,230,255,0.3)', fontSize:'0.72rem' }}>{item.date}</Typography>}
                  </Box>
                  <Box>
                    <IconButton size="small" onClick={()=>handleOpen(item)} sx={{ color:'#a78bfa' }}><Edit fontSize="small" /></IconButton>
                    <IconButton size="small" onClick={()=>remove(item._id)} sx={{ color:'#ff6b6b' }}><Delete fontSize="small" /></IconButton>
                  </Box>
                </Box>
              </Box>
            </Grid>
          ))}
        </Grid>
      )}

      <Dialog open={open} onClose={()=>setOpen(false)} maxWidth="xs" fullWidth PaperProps={{ sx:{ background:'#0d1224', border:'1px solid rgba(124,92,255,0.2)', borderRadius:'20px' } }}>
        <DialogTitle sx={{ color:'#e0e6ff', fontFamily:"'Space Grotesk'", fontWeight:700, display:'flex', justifyContent:'space-between' }}>
          {editId ? 'Edit Certificate' : 'Add Certificate'}<IconButton onClick={()=>setOpen(false)} sx={{ color:'rgba(224,230,255,0.4)' }}><Close /></IconButton>
        </DialogTitle>
        <DialogContent sx={{ pt:1 }}>
          {error && <Alert severity="error" sx={{ mb:2, background:'rgba(255,80,80,0.08)', color:'#ff8080', border:'1px solid rgba(255,80,80,0.2)', borderRadius:'10px' }}>{error}</Alert>}
          <TextField fullWidth label="Certificate Title" value={form.title} onChange={e=>setForm(f=>({...f,title:e.target.value}))} sx={{ ...inputSx, mb:2 }} required />
          <TextField fullWidth label="Issuer (e.g. Google, Coursera)" value={form.issuer} onChange={e=>setForm(f=>({...f,issuer:e.target.value}))} sx={{ ...inputSx, mb:2 }} required />
          <TextField fullWidth label="Date (e.g. March 2024)" value={form.date} onChange={e=>setForm(f=>({...f,date:e.target.value}))} sx={{ ...inputSx, mb:2 }} />
          <TextField fullWidth label="Credential URL" value={form.credentialUrl} onChange={e=>setForm(f=>({...f,credentialUrl:e.target.value}))} sx={{ ...inputSx, mb:2 }} />
          <TextField fullWidth label="Image URL (optional)" value={form.imageUrl} onChange={e=>setForm(f=>({...f,imageUrl:e.target.value}))} sx={inputSx} />
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
