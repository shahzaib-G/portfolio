import React, { useEffect, useState } from 'react';
import { Box, Typography, CircularProgress, Chip, IconButton, Collapse } from '@mui/material';
import { Delete, ExpandMore, ExpandLess, MarkEmailRead, Message } from '@mui/icons-material';
import API from '../../utils/config';

const token = () => localStorage.getItem('adminToken');
const authH = () => ({ Authorization:`Bearer ${token()}` });

export default function AdminMessages() {
  const [msgs, setMsgs]     = useState([]);
  const [loading, setLoading] = useState(true);
  const [expanded, setExpanded] = useState(null);

  const load = () => {
    setLoading(true);
    fetch(`${API}/contact`, { headers: authH() }).then(r=>r.json()).then(d=>setMsgs(Array.isArray(d)?d:[])).catch(()=>{}).finally(()=>setLoading(false));
  };
  useEffect(()=>{ load(); }, []);

  const markRead = async (id) => {
    await fetch(`${API}/contact/${id}/read`, { method:'PUT', headers: authH() });
    setMsgs(msgs => msgs.map(m => m._id===id ? {...m,read:true} : m));
  };

  const del = async (id) => {
    if (!window.confirm('Delete this message?')) return;
    await fetch(`${API}/contact/${id}`, { method:'DELETE', headers: authH() });
    setMsgs(msgs => msgs.filter(m=>m._id!==id));
  };

  const toggle = (id) => {
    if (expanded !== id) markRead(id);
    setExpanded(e => e===id ? null : id);
  };

  return (
    <Box>
      <Typography sx={{ fontFamily:"'Orbitron'", fontWeight:900, fontSize:'1.5rem', background:'linear-gradient(135deg,#fff,#a78bfa)', WebkitBackgroundClip:'text', WebkitTextFillColor:'transparent', mb:4 }}>
        Messages {msgs.filter(m=>!m.read).length > 0 && <Chip label={`${msgs.filter(m=>!m.read).length} unread`} size="small" sx={{ ml:1, background:'rgba(255,107,157,0.15)', color:'#ff6b9d', border:'1px solid rgba(255,107,157,0.3)', fontSize:'0.72rem' }} />}
      </Typography>

      {loading ? <CircularProgress sx={{ color:'#7c5cff', display:'block', mx:'auto', mt:4 }} /> : msgs.length === 0 ? (
        <Box sx={{ textAlign:'center', py:8 }}><Message sx={{ fontSize:56, color:'rgba(124,92,255,0.2)', mb:2 }} /><Typography sx={{ color:'rgba(224,230,255,0.25)' }}>No messages yet.</Typography></Box>
      ) : msgs.map(msg=>(
        <Box key={msg._id} sx={{ mb:2, borderRadius:'16px', background:'rgba(255,255,255,0.03)', border:`1px solid ${msg.read ? 'rgba(124,92,255,0.1)' : 'rgba(255,107,157,0.25)'}`, overflow:'hidden' }}>
          <Box sx={{ p:3, display:'flex', alignItems:'center', cursor:'pointer', '&:hover':{ background:'rgba(124,92,255,0.05)' } }} onClick={()=>toggle(msg._id)}>
            <Box sx={{ flex:1 }}>
              <Box sx={{ display:'flex', alignItems:'center', gap:1.5, mb:0.3 }}>
                {!msg.read && <Box sx={{ width:8, height:8, borderRadius:'50%', background:'#ff6b9d', flexShrink:0 }} />}
                <Typography sx={{ fontWeight:700, color:'#e0e6ff', fontSize:'0.9rem' }}>{msg.name}</Typography>
                <Typography sx={{ color:'rgba(224,230,255,0.35)', fontSize:'0.75rem' }}>{msg.email}</Typography>
              </Box>
              {msg.subject && <Typography sx={{ color:'#a78bfa', fontSize:'0.82rem', fontWeight:600 }}>{msg.subject}</Typography>}
              <Typography sx={{ color:'rgba(224,230,255,0.4)', fontSize:'0.75rem', mt:0.3 }}>{new Date(msg.createdAt).toLocaleDateString('en-US',{month:'short',day:'numeric',year:'numeric',hour:'2-digit',minute:'2-digit'})}</Typography>
            </Box>
            <Box sx={{ display:'flex', alignItems:'center', gap:0.5 }}>
              {!msg.read && <IconButton size="small" onClick={e=>{e.stopPropagation();markRead(msg._id);}} sx={{ color:'#00d4ff' }} title="Mark read"><MarkEmailRead fontSize="small" /></IconButton>}
              <IconButton size="small" onClick={e=>{e.stopPropagation();del(msg._id);}} sx={{ color:'#ff6b6b' }}><Delete fontSize="small" /></IconButton>
              {expanded===msg._id ? <ExpandLess sx={{ color:'rgba(224,230,255,0.4)' }} /> : <ExpandMore sx={{ color:'rgba(224,230,255,0.4)' }} />}
            </Box>
          </Box>
          <Collapse in={expanded===msg._id}>
            <Box sx={{ px:3, pb:3, borderTop:'1px solid rgba(124,92,255,0.08)' }}>
              <Typography sx={{ color:'rgba(224,230,255,0.65)', fontSize:'0.88rem', lineHeight:1.8, pt:2, whiteSpace:'pre-wrap' }}>{msg.message}</Typography>
            </Box>
          </Collapse>
        </Box>
      ))}
    </Box>
  );
}
