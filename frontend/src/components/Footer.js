import React, { useRef } from 'react';
import { Box, Typography, Grid, IconButton, useTheme, useMediaQuery, Container } from '@mui/material';
import { motion, useInView } from 'framer-motion';
import { GitHub, LinkedIn, WhatsApp, Email } from '@mui/icons-material';

const Footer = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: '-100px' });

  const socialLinks = [
    { icon: <GitHub />, name: 'GitHub', link: 'https://github.com/shahzaib-G' },
    { icon: <LinkedIn />, name: 'LinkedIn', link: 'https://www.linkedin.com/in/shahzaibrj/' },
    { icon: <WhatsApp />, name: 'WhatsApp', link: 'https://wa.me/923253434138' },
    {
      icon: <Email />,
      name: 'Email',
      link: 'https://mail.google.com/mail/?view=cm&to=shahzaibnasir3011@gmail.com'
    }
  ];
  

  return (
    <Box
      component="footer"
      sx={{
        position: 'relative',
        bgcolor: 'rgba(255, 255, 255, 0.8)',
        backdropFilter: 'blur(10px)',
        borderTop: '1px solid rgba(25, 118, 210, 0.1)',
        mt: 12,
        py: 6,
        px: 2,
        background: 'linear-gradient(to bottom, rgba(251, 235, 214, 0.9), rgba(255, 245, 235, 0.7))'
      }}
    >
      <Container maxWidth="lg">
        <Grid container spacing={4} ref={ref}>
          {/* Social Links */}
          <Grid item xs={12} md={6}>
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.6 }}
            >
              <Typography 
                variant="h6" 
                sx={{ 
                  mb: 3,
                  fontWeight: 600,
                  color: '#1e3a5f',
                  textAlign: { xs: 'center', md: 'left' }
                }}
              >
                Let's Connect
              </Typography>
              <Grid container spacing={2}>
                {socialLinks.map((item, index) => (
                  <Grid item xs={6} sm={3} key={index}>
                    <IconButton
                      component="a"
                      href={item.link}
                      target="_blank"
                      rel="noopener noreferrer"
                      sx={{
                        width: '100%',
                        py: 1.5,
                        borderRadius: '12px',
                        background: 'rgba(25, 118, 210, 0.05)',
                        border: '1px solid rgba(25, 118, 210, 0.1)',
                        '&:hover': {
                          background: 'rgba(25, 118, 210, 0.1)',
                          transform: 'translateY(-3px)'
                        },
                        transition: 'all 0.3s ease'
                      }}
                    >
                      <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                        {React.cloneElement(item.icon, {
                          sx: { 
                            fontSize: 28,
                            color: '#1565c0',
                            mb: 0.5
                          }
                        })}
                        <Typography variant="caption" sx={{ color: '#1565c0', fontWeight: 500 }}>
                          {item.name}
                        </Typography>
                      </Box>
                    </IconButton>
                  </Grid>
                ))}
              </Grid>
            </motion.div>
          </Grid>

          {/* Copyright Text */}
          <Grid item xs={12} md={6}>
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.6, delay: 0.2 }}
              style={{ height: '100%' }}
            >
              <Box
                sx={{
                  height: '100%',
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'center',
                  alignItems: { xs: 'center', md: 'flex-end' },
                  textAlign: { xs: 'center', md: 'right' }
                }}
              >
                <Typography
                  variant="body2"
                  sx={{
                    color: '#546e7a',
                    maxWidth: 400,
                    lineHeight: 1.6,
                    mb: 2
                  }}
                >
                  Crafted with passion and attention to detail. Built using React, Material UI, and Framer Motion.
                </Typography>
                <Typography
                  variant="body2"
                  sx={{
                    color: '#1e3a5f',
                    fontWeight: 500
                  }}
                >
                  &copy; {new Date().getFullYear()} Shahzaib Nasir. All rights reserved.
                </Typography>
              </Box>
            </motion.div>
          </Grid>
        </Grid>

        {/* Decorative Elements */}
        <Box
          component={motion.div}
          initial={{ scale: 0 }}
          animate={isInView ? { scale: 1 } : {}}
          transition={{ duration: 0.8, delay: 0.4 }}
          sx={{
            position: 'absolute',
            bottom: 0,
            left: '50%',
            transform: 'translateX(-50%)',
            width: '80%',
            height: '2px',
            background: 'linear-gradient(90deg, transparent, #1565c0, transparent)',
            opacity: 0.3
          }}
        />
      </Container>
    </Box>
  );
};

export default Footer;