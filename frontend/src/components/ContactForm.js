import React, { useState } from 'react';
import { Box, TextField, Button, Typography, Alert, CircularProgress } from '@mui/material';
import { Send } from '@mui/icons-material';
import { motion } from 'framer-motion';
import API from '../utils/config';

const inputSx = {
  '& .MuiOutlinedInput-root': {
    color: '#e0e6ff',
    fontFamily: "'Space Grotesk'",
    background: 'rgba(255,255,255,0.03)',
    borderRadius: '12px',
    '& fieldset': { borderColor: 'rgba(124,92,255,0.2)' },
    '&:hover fieldset': { borderColor: 'rgba(124,92,255,0.5)' },
    '&.Mui-focused fieldset': { borderColor: '#7c5cff' },
  },
  '& .MuiInputLabel-root': { color: 'rgba(224,230,255,0.45)', fontFamily: "'Space Grotesk'" },
  '& .MuiInputLabel-root.Mui-focused': { color: '#a78bfa' },
};

export default function ContactForm() {
  const [form, setForm]     = useState({ name:'', email:'', subject:'', message:'' });
  const [status, setStatus] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => setForm(f => ({ ...f, [e.target.name]: e.target.value }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true); setStatus(null);
    try {
      const res = await fetch(`${API}/contact`, { method:'POST', headers:{'Content-Type':'application/json'}, body: JSON.stringify(form) });
      if (!res.ok) throw new Error('Failed');
      setStatus('success');
      setForm({ name:'', email:'', subject:'', message:'' });
    } catch {
      setStatus('error');
    } finally { setLoading(false); }
  };

  return (
    <motion.div initial={{ opacity:0, y:30 }} whileInView={{ opacity:1, y:0 }} viewport={{ once:true }} transition={{ duration:0.7 }}>
      <Box component="form" onSubmit={handleSubmit} sx={{
        p: { xs: 3, md: 5 }, borderRadius: '24px',
        background: 'rgba(255,255,255,0.03)', backdropFilter: 'blur(20px)',
        border: '1px solid rgba(124,92,255,0.15)',
        boxShadow: '0 8px 40px rgba(0,0,0,0.3)',
      }}>
        {status === 'success' && <Alert severity="success" sx={{ mb:3, background:'rgba(0,255,128,0.08)', color:'#6effc8', border:'1px solid rgba(0,255,128,0.2)', borderRadius:'12px' }}>Message sent!</Alert>}
        {status === 'error'   && <Alert severity="error"   sx={{ mb:3, background:'rgba(255,80,80,0.08)',  color:'#ff8080', border:'1px solid rgba(255,80,80,0.2)',  borderRadius:'12px' }}>Failed to send. Try again.</Alert>}

        <Box sx={{ display:'flex', gap:2, mb:2, flexDirection:{ xs:'column', sm:'row' } }}>
          <TextField fullWidth label="Name"    name="name"    value={form.name}    onChange={handleChange} required sx={inputSx} />
          <TextField fullWidth label="Email"   name="email"   value={form.email}   onChange={handleChange} required type="email" sx={inputSx} />
        </Box>
        <TextField fullWidth label="Subject" name="subject" value={form.subject} onChange={handleChange} sx={{ ...inputSx, mb:2 }} />
        <TextField fullWidth label="Message" name="message" value={form.message} onChange={handleChange} required multiline rows={5} sx={{ ...inputSx, mb:3 }} />

        <Button type="submit" disabled={loading} fullWidth variant="contained" size="large" endIcon={loading ? <CircularProgress size={18} color="inherit" /> : <Send />} sx={{
          py:1.8, borderRadius:'12px', textTransform:'none', fontWeight:700, fontSize:'1rem', fontFamily:"'Space Grotesk'",
          background:'linear-gradient(135deg,#7c5cff,#00d4ff)', boxShadow:'0 8px 30px rgba(124,92,255,0.35)',
          '&:hover': { boxShadow:'0 12px 40px rgba(124,92,255,0.55)', transform:'translateY(-2px)' },
          transition:'all 0.3s',
        }}>
          {loading ? 'Sending…' : 'Send Message'}
        </Button>
      </Box>
    </motion.div>
  );
}
