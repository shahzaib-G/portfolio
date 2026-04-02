import React, { useState } from 'react';
import { Box, TextField, Button, Typography, Alert, CircularProgress, Link } from '@mui/material';
import { motion } from 'framer-motion';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import API from '../utils/config';

const inputSx = {
  '& .MuiOutlinedInput-root': {
    color:'#e0e6ff', fontFamily:"'Space Grotesk'", background:'rgba(255,255,255,0.03)', borderRadius:'12px',
    '& fieldset':{ borderColor:'rgba(124,92,255,0.2)' },
    '&:hover fieldset':{ borderColor:'rgba(124,92,255,0.5)' },
    '&.Mui-focused fieldset':{ borderColor:'#7c5cff' },
  },
  '& .MuiInputLabel-root':{ color:'rgba(224,230,255,0.45)', fontFamily:"'Space Grotesk'" },
  '& .MuiInputLabel-root.Mui-focused':{ color:'#a78bfa' },
};

export default function AdminLogin() {
  const { login } = useAuth();
  const navigate  = useNavigate();
  const [form, setForm]       = useState({ email:'', password:'' });
  const [error, setError]     = useState('');
  const [loading, setLoading] = useState(false);
  const [forgot,  setForgot]  = useState(false);
  const [forgotEmail, setForgotEmail] = useState('');
  const [forgotMsg,   setForgotMsg]   = useState('');
  const [forgotLoading, setForgotLoading] = useState(false);

  const handleLogin = async (e) => {
    e.preventDefault(); setError(''); setLoading(true);
    try { await login(form.email, form.password); navigate('/admin'); }
    catch (err) { setError(err.message); }
    finally { setLoading(false); }
  };

  const handleForgot = async (e) => {
    e.preventDefault(); setForgotLoading(true); setForgotMsg('');
    try {
      const res = await fetch(`${API}/auth/forgot-password`, { method:'POST', headers:{'Content-Type':'application/json'}, body: JSON.stringify({ email: forgotEmail }) });
      const d = await res.json();
      setForgotMsg(res.ok ? 'success' : d.message || 'Error');
    } catch { setForgotMsg('error'); }
    finally { setForgotLoading(false); }
  };

  return (
    <Box sx={{ minHeight:'100vh', background:'#0a0f1e', display:'flex', alignItems:'center', justifyContent:'center', px:2, position:'relative', overflow:'hidden' }}>
      <Box sx={{ position:'absolute', top:'10%', left:'10%', width:400, height:400, background:'radial-gradient(circle,rgba(124,92,255,0.12) 0%,transparent 70%)', filter:'blur(60px)', pointerEvents:'none' }} />
      <Box sx={{ position:'absolute', bottom:'10%', right:'10%', width:300, height:300, background:'radial-gradient(circle,rgba(0,212,255,0.1) 0%,transparent 70%)', filter:'blur(60px)', pointerEvents:'none' }} />

      <motion.div initial={{ opacity:0, y:30, scale:0.96 }} animate={{ opacity:1, y:0, scale:1 }} transition={{ duration:0.7 }}>
        <Box sx={{ width:{ xs:'100%', sm:420 }, p:{ xs:3, sm:5 }, borderRadius:'24px',
          background:'rgba(255,255,255,0.03)', backdropFilter:'blur(20px)',
          border:'1px solid rgba(124,92,255,0.2)', boxShadow:'0 24px 80px rgba(0,0,0,0.4)' }}>

          <Box sx={{ textAlign:'center', mb:4 }}>
            <Typography sx={{ fontFamily:"'Orbitron'", fontWeight:900, fontSize:'1.6rem',
              background:'linear-gradient(135deg,#7c5cff,#00d4ff)', WebkitBackgroundClip:'text', WebkitTextFillColor:'transparent', mb:0.5 }}>
              {forgot ? 'Reset Password' : 'Admin Access'}
            </Typography>
            <Typography sx={{ color:'rgba(224,230,255,0.35)', fontSize:'0.82rem' }}>
              {forgot ? 'Enter your email to receive a reset link' : 'Portfolio Management System'}
            </Typography>
          </Box>

          {!forgot ? (
            <Box component="form" onSubmit={handleLogin}>
              {error && <Alert severity="error" sx={{ mb:2, background:'rgba(255,80,80,0.08)', color:'#ff8080', border:'1px solid rgba(255,80,80,0.2)', borderRadius:'10px' }}>{error}</Alert>}
              <TextField fullWidth label="Email" type="email" value={form.email} onChange={e=>setForm(f=>({...f,email:e.target.value}))} required sx={{ ...inputSx, mb:2 }} />
              <TextField fullWidth label="Password" type="password" value={form.password} onChange={e=>setForm(f=>({...f,password:e.target.value}))} required sx={{ ...inputSx, mb:3 }} />
              <Button type="submit" fullWidth disabled={loading} variant="contained" sx={{
                py:1.6, borderRadius:'12px', textTransform:'none', fontWeight:700, fontSize:'1rem',
                background:'linear-gradient(135deg,#7c5cff,#00d4ff)', boxShadow:'0 8px 30px rgba(124,92,255,0.35)',
                '&:hover':{ boxShadow:'0 12px 40px rgba(124,92,255,0.55)' },
              }}>
                {loading ? <CircularProgress size={20} color="inherit" /> : 'Sign In'}
              </Button>
              <Box sx={{ textAlign:'center', mt:2 }}>
                <Link component="button" onClick={()=>setForgot(true)} sx={{ color:'rgba(167,139,250,0.6)', fontSize:'0.82rem', textDecoration:'none', '&:hover':{ color:'#a78bfa' } }}>
                  Forgot password?
                </Link>
              </Box>
            </Box>
          ) : (
            <Box component="form" onSubmit={handleForgot}>
              {forgotMsg === 'success' && <Alert severity="success" sx={{ mb:2, background:'rgba(0,255,128,0.08)', color:'#6effc8', border:'1px solid rgba(0,255,128,0.2)', borderRadius:'10px' }}>Reset link sent to your email!</Alert>}
              {forgotMsg && forgotMsg !== 'success' && <Alert severity="error" sx={{ mb:2, background:'rgba(255,80,80,0.08)', color:'#ff8080', border:'1px solid rgba(255,80,80,0.2)', borderRadius:'10px' }}>{forgotMsg}</Alert>}
              <TextField fullWidth label="Email" type="email" value={forgotEmail} onChange={e=>setForgotEmail(e.target.value)} required sx={{ ...inputSx, mb:3 }} />
              <Button type="submit" fullWidth disabled={forgotLoading} variant="contained" sx={{
                py:1.6, borderRadius:'12px', textTransform:'none', fontWeight:700,
                background:'linear-gradient(135deg,#7c5cff,#00d4ff)', boxShadow:'0 8px 30px rgba(124,92,255,0.35)',
              }}>
                {forgotLoading ? <CircularProgress size={20} color="inherit" /> : 'Send Reset Link'}
              </Button>
              <Box sx={{ textAlign:'center', mt:2 }}>
                <Link component="button" onClick={()=>{ setForgot(false); setForgotMsg(''); }} sx={{ color:'rgba(167,139,250,0.6)', fontSize:'0.82rem', '&:hover':{ color:'#a78bfa' } }}>
                  ← Back to login
                </Link>
              </Box>
            </Box>
          )}
        </Box>
      </motion.div>
    </Box>
  );
}
