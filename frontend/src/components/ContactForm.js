import React, { useState } from 'react';
import { Box, TextField, Typography, Alert, CircularProgress } from '@mui/material';
import { Send, CheckCircle } from '@mui/icons-material';
import { motion } from 'framer-motion';
import API from '../utils/config';

const FB = "'DM Sans', sans-serif";
const FM = "'JetBrains Mono', monospace";

const inputSx = {
  '& .MuiOutlinedInput-root': {
    color: '#e2e8f0',
    fontFamily: FB,
    fontSize: '0.95rem',
    background: 'rgba(255,255,255,0.03)',
    borderRadius: '12px',
    '& fieldset': { borderColor: 'rgba(255,255,255,0.08)' },
    '&:hover fieldset': { borderColor: 'rgba(139,92,246,0.35)' },
    '&.Mui-focused fieldset': { borderColor: '#8b5cf6', borderWidth: '1.5px' },
  },
  '& .MuiInputLabel-root': { color: '#475569', fontFamily: FB, fontSize: '0.9rem' },
  '& .MuiInputLabel-root.Mui-focused': { color: '#a78bfa' },
  '& .MuiInputLabel-root.Mui-error': { color: '#f87171' },
};

export default function ContactForm() {
  const [form,    setForm]    = useState({ name: '', email: '', subject: '', message: '' });
  const [status,  setStatus]  = useState(null);
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => setForm(f => ({ ...f, [e.target.name]: e.target.value }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setStatus(null);
    try {
      const res = await fetch(`${API}/contact`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      });
      if (!res.ok) throw new Error();
      setStatus('success');
      setForm({ name: '', email: '', subject: '', message: '' });
    } catch {
      setStatus('error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.7 }}
    >
      <Box
        component="form"
        onSubmit={handleSubmit}
        sx={{
          p: { xs: 3, sm: 4, md: 5 },
          borderRadius: '24px',
          background: 'rgba(255,255,255,0.025)',
          border: '1px solid rgba(255,255,255,0.07)',
          boxShadow: '0 8px 40px rgba(0,0,0,0.25)',
        }}
      >
        {/* Success state */}
        {status === 'success' && (
          <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }}>
            <Box sx={{ textAlign: 'center', py: 6 }}>
              <CheckCircle sx={{ fontSize: 52, color: '#22c55e', mb: 2 }} />
              <Typography sx={{ fontFamily: "'Syne', sans-serif", fontWeight: 700, fontSize: '1.3rem', color: '#f1f5f9', mb: 1 }}>Message sent!</Typography>
              <Typography sx={{ fontFamily: FB, color: '#475569', fontSize: '0.9rem', mb: 4 }}>Thanks for reaching out — I'll get back to you soon.</Typography>
              <Box
                component="button" type="button" onClick={() => setStatus(null)}
                sx={{ px: 3, py: 1, borderRadius: '10px', border: '1px solid rgba(255,255,255,0.08)', background: 'transparent', color: '#94a3b8', fontFamily: FB, fontSize: '0.875rem', cursor: 'pointer', '&:hover': { background: 'rgba(255,255,255,0.05)' }, transition: 'all 0.2s' }}
              >
                Send another
              </Box>
            </Box>
          </motion.div>
        )}

        {status !== 'success' && (
          <>
            {status === 'error' && (
              <Alert severity="error" sx={{ mb: 3, background: 'rgba(239,68,68,0.08)', color: '#fca5a5', border: '1px solid rgba(239,68,68,0.2)', borderRadius: '12px', fontFamily: FB, '& .MuiAlert-icon': { color: '#f87171' } }}>
                Something went wrong. Please try again.
              </Alert>
            )}

            <Box sx={{ display: 'flex', gap: 2, mb: 2.5, flexDirection: { xs: 'column', sm: 'row' } }}>
              <TextField fullWidth label="Name"  name="name"  value={form.name}  onChange={handleChange} required sx={inputSx} />
              <TextField fullWidth label="Email" name="email" value={form.email} onChange={handleChange} required type="email" sx={inputSx} />
            </Box>
            <TextField fullWidth label="Subject" name="subject" value={form.subject} onChange={handleChange} sx={{ ...inputSx, mb: 2.5 }} />
            <TextField fullWidth label="Message" name="message" value={form.message} onChange={handleChange} required multiline rows={5} sx={{ ...inputSx, mb: 3.5 }} />

            <Box
              component="button"
              type="submit"
              disabled={loading}
              sx={{
                width: '100%', py: 1.85, px: 4, borderRadius: '12px',
                border: 'none', cursor: loading ? 'not-allowed' : 'pointer',
                display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 1.5,
                fontFamily: FB, fontWeight: 700, fontSize: '1rem', color: '#fff',
                background: 'linear-gradient(135deg, #6d28d9, #0e7490)',
                boxShadow: '0 8px 28px rgba(109,40,217,0.38)',
                opacity: loading ? 0.7 : 1,
                transition: 'all 0.3s ease',
                '&:hover:not(:disabled)': { boxShadow: '0 14px 40px rgba(109,40,217,0.55)', transform: 'translateY(-2px)' },
              }}
            >
              {loading
                ? <><CircularProgress size={18} sx={{ color: 'rgba(255,255,255,0.8)' }} /> Sending…</>
                : <><Send sx={{ fontSize: 18 }} /> Send Message</>
              }
            </Box>
          </>
        )}
      </Box>
    </motion.div>
  );
}
