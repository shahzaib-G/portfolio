import React, { useState } from 'react';
import { Box, TextField, Button, Typography, Alert, CircularProgress } from '@mui/material';
import { motion } from 'framer-motion';
import { useParams, useNavigate } from 'react-router-dom';
import API from '../utils/config';

const inputSx = {
  '& .MuiOutlinedInput-root':{
    color:'#e0e6ff', fontFamily:"'Space Grotesk'", background:'rgba(255,255,255,0.03)', borderRadius:'12px',
    '& fieldset':{ borderColor:'rgba(124,92,255,0.2)' },
    '&:hover fieldset':{ borderColor:'rgba(124,92,255,0.5)' },
    '&.Mui-focused fieldset':{ borderColor:'#7c5cff' },
  },
  '& .MuiInputLabel-root':{ color:'rgba(224,230,255,0.45)' },
  '& .MuiInputLabel-root.Mui-focused':{ color:'#a78bfa' },
};

export default function ResetPassword() {
  const { token }  = useParams();
  const navigate   = useNavigate();
  const [password, setPassword] = useState('');
  const [confirm,  setConfirm]  = useState('');
  const [status,   setStatus]   = useState(null);
  const [loading,  setLoading]  = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (password !== confirm) { setStatus('mismatch'); return; }
    setLoading(true); setStatus(null);
    try {
      const res = await fetch(`${API}/auth/reset-password/${token}`, { method:'POST', headers:{'Content-Type':'application/json'}, body: JSON.stringify({ password }) });
      if (!res.ok) { const d=await res.json(); setStatus(d.message||'error'); return; }
      setStatus('success');
      setTimeout(() => navigate('/admin/login'), 2500);
    } catch { setStatus('error'); }
    finally { setLoading(false); }
  };

  return (
    <Box sx={{ minHeight:'100vh', background:'#0a0f1e', display:'flex', alignItems:'center', justifyContent:'center', px:2 }}>
      <motion.div initial={{ opacity:0, y:30 }} animate={{ opacity:1, y:0 }} transition={{ duration:0.7 }}>
        <Box sx={{ width:{ xs:'100%', sm:400 }, p:{ xs:3, sm:5 }, borderRadius:'24px', background:'rgba(255,255,255,0.03)', backdropFilter:'blur(20px)', border:'1px solid rgba(124,92,255,0.2)', boxShadow:'0 24px 80px rgba(0,0,0,0.4)' }}>
          <Typography sx={{ fontFamily:"'Orbitron'", fontWeight:900, fontSize:'1.5rem', textAlign:'center',
            background:'linear-gradient(135deg,#7c5cff,#00d4ff)', WebkitBackgroundClip:'text', WebkitTextFillColor:'transparent', mb:3 }}>
            New Password
          </Typography>
          {status === 'success' && <Alert severity="success" sx={{ mb:2, background:'rgba(0,255,128,0.08)', color:'#6effc8', border:'1px solid rgba(0,255,128,0.2)', borderRadius:'10px' }}>Password reset! Redirecting…</Alert>}
          {status === 'mismatch' && <Alert severity="error" sx={{ mb:2, background:'rgba(255,80,80,0.08)', color:'#ff8080', border:'1px solid rgba(255,80,80,0.2)', borderRadius:'10px' }}>Passwords don't match.</Alert>}
          {status && status !== 'success' && status !== 'mismatch' && <Alert severity="error" sx={{ mb:2, background:'rgba(255,80,80,0.08)', color:'#ff8080', border:'1px solid rgba(255,80,80,0.2)', borderRadius:'10px' }}>{status}</Alert>}
          <Box component="form" onSubmit={handleSubmit}>
            <TextField fullWidth label="New Password" type="password" value={password} onChange={e=>setPassword(e.target.value)} required sx={{ ...inputSx, mb:2 }} />
            <TextField fullWidth label="Confirm Password" type="password" value={confirm} onChange={e=>setConfirm(e.target.value)} required sx={{ ...inputSx, mb:3 }} />
            <Button type="submit" fullWidth disabled={loading} variant="contained" sx={{
              py:1.6, borderRadius:'12px', textTransform:'none', fontWeight:700,
              background:'linear-gradient(135deg,#7c5cff,#00d4ff)', boxShadow:'0 8px 30px rgba(124,92,255,0.35)',
            }}>
              {loading ? <CircularProgress size={20} color="inherit" /> : 'Reset Password'}
            </Button>
          </Box>
        </Box>
      </motion.div>
    </Box>
  );
}
