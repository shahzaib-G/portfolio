import React, { useState } from 'react';
import { Box, TextField, Typography, Alert, CircularProgress } from '@mui/material';
import { Send, CheckCircle } from '@mui/icons-material';
import { motion } from 'framer-motion';
import { useTheme } from '@mui/material/styles';
import API from '../utils/config';

const FB = "'Inter', sans-serif";

export default function ContactForm() {
  const theme   = useTheme();
  const isLight = theme.palette.mode === 'light';
  const [form,    setForm]    = useState({ name: '', email: '', subject: '', message: '' });
  const [status,  setStatus]  = useState(null);
  const [loading, setLoading] = useState(false);

  const accent = isLight ? '#4f46e5' : '#818cf8';

  const inputSx = {
    '& .MuiOutlinedInput-root': {
      fontFamily: FB,
      fontSize: '0.95rem',
      background: isLight ? '#ffffff' : 'rgba(255,255,255,0.03)',
      borderRadius: '10px',
      '& fieldset': { borderColor: theme.palette.divider },
      '&:hover fieldset': { borderColor: accent },
      '&.Mui-focused fieldset': { borderColor: accent, borderWidth: '1.5px' },
    },
    '& .MuiInputLabel-root': { color: theme.palette.text.secondary, fontFamily: FB, fontSize: '0.9rem' },
    '& .MuiInputLabel-root.Mui-focused': { color: accent },
    '& .MuiOutlinedInput-input': { color: theme.palette.text.primary },
  };

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
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.45 }}
    >
      <Box
        component="form"
        onSubmit={handleSubmit}
        sx={{
          p: { xs: 3, sm: 4, md: 5 },
          borderRadius: '20px',
          background: theme.palette.background.paper,
          border: `1px solid ${theme.palette.divider}`,
          boxShadow: isLight ? '0 4px 24px rgba(0,0,0,0.07)' : '0 8px 40px rgba(0,0,0,0.25)',
        }}
      >
        {status === 'success' && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
            <Box sx={{ textAlign: 'center', py: 6 }}>
              <CheckCircle sx={{ fontSize: 52, color: isLight ? '#16a34a' : '#4ade80', mb: 2 }} />
              <Typography sx={{
                fontFamily: "'Plus Jakarta Sans', sans-serif", fontWeight: 700,
                fontSize: '1.3rem', color: theme.palette.text.primary, mb: 1,
              }}>
                Message sent!
              </Typography>
              <Typography sx={{ fontFamily: FB, color: theme.palette.text.secondary, fontSize: '0.9rem', mb: 4 }}>
                Thanks for reaching out. I will get back to you soon.
              </Typography>
              <Box
                component="button"
                type="button"
                onClick={() => setStatus(null)}
                sx={{
                  px: 3, py: 1, borderRadius: '10px',
                  border: `1px solid ${theme.palette.divider}`,
                  background: 'transparent',
                  color: theme.palette.text.secondary,
                  fontFamily: FB, fontSize: '0.875rem', cursor: 'pointer',
                  transition: 'all 0.2s',
                  '&:hover': { background: isLight ? 'rgba(0,0,0,0.04)' : 'rgba(255,255,255,0.06)' },
                }}
              >
                Send another
              </Box>
            </Box>
          </motion.div>
        )}

        {status !== 'success' && (
          <>
            {status === 'error' && (
              <Alert severity="error" sx={{ mb: 3, borderRadius: '10px', fontFamily: FB }}>
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
                width: '100%', py: 1.85, px: 4, borderRadius: '10px',
                border: 'none', cursor: loading ? 'not-allowed' : 'pointer',
                display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 1.5,
                fontFamily: FB, fontWeight: 700, fontSize: '1rem', color: '#fff',
                background: accent,
                boxShadow: isLight
                  ? '0 4px 14px rgba(79,70,229,0.32)'
                  : '0 4px 14px rgba(129,140,248,0.3)',
                opacity: loading ? 0.7 : 1,
                transition: 'filter 0.2s ease',
                '&:hover:not(:disabled)': { filter: 'brightness(1.08)' },
              }}
            >
              {loading
                ? <><CircularProgress size={18} sx={{ color: 'rgba(255,255,255,0.8)' }} /> Sending...</>
                : <><Send sx={{ fontSize: 18 }} /> Send Message</>
              }
            </Box>
          </>
        )}
      </Box>
    </motion.div>
  );
}
