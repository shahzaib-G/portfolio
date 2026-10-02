import React from 'react';
import { Box } from '@mui/material';
import { motion } from 'framer-motion';
import { useTheme } from '@mui/material/styles';

/* A lazy sleeping cat that breathes slowly and floats zzz bubbles */
export default function SleepingCat({ size = 140 }) {
  const theme   = useTheme();
  const isLight = theme.palette.mode === 'light';

  const fur     = isLight ? '#f8b400' : '#d4a017';
  const stripe  = isLight ? '#e09800' : '#b8860b';
  const belly   = isLight ? '#fff3cd' : '#fde68a';
  const nose    = '#f472b6';
  const outline = isLight ? 'rgba(0,0,0,0.12)' : 'rgba(255,255,255,0.08)';
  const zzzCol  = isLight ? '#818cf8' : '#a5b4fc';

  return (
    <Box sx={{ position: 'relative', width: size, height: size }}>
      {/* Zzz bubbles */}
      {[0, 1, 2].map(i => (
        <motion.div
          key={i}
          initial={{ opacity: 0, y: 0, x: 0, scale: 0.5 }}
          animate={{ opacity: [0, 0.9, 0], y: -28 - i * 14, x: i * 6, scale: [0.5, 1, 0.8] }}
          transition={{ duration: 2.4, delay: i * 0.75, repeat: Infinity, ease: 'easeOut' }}
          style={{
            position: 'absolute',
            top: '10%',
            right: '10%',
            fontFamily: "'Plus Jakarta Sans', sans-serif",
            fontWeight: 800,
            fontSize: 10 + i * 2,
            color: zzzCol,
            pointerEvents: 'none',
          }}
        >
          z
        </motion.div>
      ))}

      {/* Cat body — gently breathes */}
      <motion.div
        animate={{ scaleY: [1, 1.04, 1], scaleX: [1, 0.98, 1] }}
        transition={{ duration: 3.2, repeat: Infinity, ease: 'easeInOut' }}
        style={{ transformOrigin: 'center bottom', width: '100%', height: '100%' }}
      >
        <svg
          viewBox="0 0 120 100"
          width={size}
          height={size * 0.84}
          xmlns="http://www.w3.org/2000/svg"
          style={{ display: 'block' }}
        >
          {/* Tail */}
          <motion.path
            d="M 95 72 Q 118 60 112 45 Q 106 32 98 42 Q 90 52 95 65"
            fill={fur}
            stroke={outline}
            strokeWidth="0.8"
            animate={{ d: [
              "M 95 72 Q 118 60 112 45 Q 106 32 98 42 Q 90 52 95 65",
              "M 95 72 Q 115 65 110 48 Q 104 35 97 44 Q 89 54 95 65",
              "M 95 72 Q 118 60 112 45 Q 106 32 98 42 Q 90 52 95 65",
            ]}}
            transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
          />
          {/* Tail stripes */}
          <motion.path
            d="M 104 52 Q 108 48 105 44"
            fill="none" stroke={stripe} strokeWidth="1.8" strokeLinecap="round"
            animate={{ d: [
              "M 104 52 Q 108 48 105 44",
              "M 103 53 Q 107 49 104 45",
              "M 104 52 Q 108 48 105 44",
            ]}}
            transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
          />

          {/* Body (curled ellipse) */}
          <ellipse cx="60" cy="72" rx="46" ry="24" fill={fur} stroke={outline} strokeWidth="0.8" />
          {/* Belly */}
          <ellipse cx="58" cy="74" rx="28" ry="14" fill={belly} />
          {/* Back stripes */}
          <path d="M 40 56 Q 44 52 42 60" fill="none" stroke={stripe} strokeWidth="2" strokeLinecap="round" />
          <path d="M 54 53 Q 58 49 56 57" fill="none" stroke={stripe} strokeWidth="2" strokeLinecap="round" />
          <path d="M 68 54 Q 72 50 70 58" fill="none" stroke={stripe} strokeWidth="2" strokeLinecap="round" />

          {/* Head */}
          <circle cx="28" cy="62" r="22" fill={fur} stroke={outline} strokeWidth="0.8" />
          {/* Face belly patch */}
          <ellipse cx="28" cy="68" rx="12" ry="9" fill={belly} />

          {/* Left ear */}
          <path d="M 10 46 L 5 32 L 18 40 Z" fill={fur} stroke={outline} strokeWidth="0.8" />
          <path d="M 10 44 L 7 35 L 16 40 Z" fill={nose} opacity="0.5" />
          {/* Right ear */}
          <path d="M 36 43 L 42 30 L 48 42 Z" fill={fur} stroke={outline} strokeWidth="0.8" />
          <path d="M 37 43 L 42 33 L 46 42 Z" fill={nose} opacity="0.5" />

          {/* Closed sleepy eyes (curved lines) */}
          <path d="M 17 60 Q 21 57 25 60" fill="none" stroke="#3d2c00" strokeWidth="2" strokeLinecap="round" />
          <path d="M 31 59 Q 35 56 39 59" fill="none" stroke="#3d2c00" strokeWidth="2" strokeLinecap="round" />

          {/* Nose */}
          <path d="M 26 65 L 28 63 L 30 65 Z" fill={nose} />
          {/* Mouth */}
          <path d="M 28 65 Q 25 68 23 67" fill="none" stroke="#d97706" strokeWidth="1.2" strokeLinecap="round" />
          <path d="M 28 65 Q 31 68 33 67" fill="none" stroke="#d97706" strokeWidth="1.2" strokeLinecap="round" />

          {/* Whiskers */}
          <line x1="5"  y1="63" x2="20" y2="64" stroke="#9ca3af" strokeWidth="0.8" strokeLinecap="round" />
          <line x1="4"  y1="67" x2="19" y2="67" stroke="#9ca3af" strokeWidth="0.8" strokeLinecap="round" />
          <line x1="36" y1="63" x2="51" y2="62" stroke="#9ca3af" strokeWidth="0.8" strokeLinecap="round" />
          <line x1="36" y1="67" x2="51" y2="66" stroke="#9ca3af" strokeWidth="0.8" strokeLinecap="round" />

          {/* Front paws */}
          <ellipse cx="42" cy="88" rx="12" ry="6" fill={fur} stroke={outline} strokeWidth="0.6" />
          <ellipse cx="62" cy="90" rx="10" ry="5.5" fill={fur} stroke={outline} strokeWidth="0.6" />
          {/* Paw toe lines */}
          <line x1="38" y1="91" x2="38" y2="87" stroke={outline} strokeWidth="1" strokeLinecap="round" />
          <line x1="42" y1="92" x2="42" y2="88" stroke={outline} strokeWidth="1" strokeLinecap="round" />
          <line x1="46" y1="91" x2="46" y2="87" stroke={outline} strokeWidth="1" strokeLinecap="round" />
          <line x1="59" y1="93" x2="59" y2="89" stroke={outline} strokeWidth="1" strokeLinecap="round" />
          <line x1="63" y1="93.5" x2="63" y2="89.5" stroke={outline} strokeWidth="1" strokeLinecap="round" />
          <line x1="67" y1="92" x2="67" y2="88" stroke={outline} strokeWidth="1" strokeLinecap="round" />
        </svg>
      </motion.div>
    </Box>
  );
}
