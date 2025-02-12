import React, { useState, useEffect } from 'react';
import { Box, Typography, styled } from '@mui/material';

const AnimatedTypography = styled(Typography)(({ theme }) => ({
  transform: 'translateY(30px)',
  opacity: 0,
  transition: 'all 0.6s cubic-bezier(0.57, 0.21, 0.69, 1.25)',
  '&.animated': {
    transform: 'translateY(0)',
    opacity: 1,
  },
}));

function Footer() {
  const [animated, setAnimated] = useState(false);

  useEffect(() => {
    setAnimated(true);
  }, []);

  return (
    <Box
      sx={{
        bgcolor: '#fbebd6',
        p: 2,
        textAlign: 'center',
        mt: 4, // footer appears after the page content
        borderTop: '1px solid rgba(10, 10, 10, 0.1)',
      }}
    >
      <AnimatedTypography
        variant="body1"
        sx={{ color: '#0a0a0a' }}
        className={animated ? 'animated' : ''}
      >
        &copy; {new Date().getFullYear()} My Portfolio. All rights reserved.
      </AnimatedTypography>
    </Box>
  );
}

export default Footer;
