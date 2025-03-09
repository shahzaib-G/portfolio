import React, { useRef } from 'react';
import { Box, Typography, Grid, IconButton, useTheme, useMediaQuery, Container, Stack } from '@mui/material';
import { motion, useInView } from 'framer-motion';
import { GitHub, LinkedIn, WhatsApp, Email } from '@mui/icons-material';

const Footer = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: '-50px' });

  const socialLinks = [
    { icon: <GitHub />, name: 'GitHub', link: 'https://github.com/shahzaib-G' },
    { icon: <LinkedIn />, name: 'LinkedIn', link: 'https://www.linkedin.com/in/shahzaibrj/' },
    { icon: <WhatsApp />, name: 'WhatsApp', link: 'https://wa.me/923253434138' },
    { icon: <Email />, name: 'Email', link: 'mailto:shahzaibnasir3011@gmail.com' }
  ];

  return (
    <Box
      component="footer"
      sx={{
        position: 'relative',
        background: 'linear-gradient(to top, rgba(251, 235, 214, 0.95) 30%, rgba(255, 255, 255, 0.7) 100%)',
        backdropFilter: 'blur(12px)',
        borderTop: '1px solid rgba(25, 118, 210, 0.15)',
        mt: 12,
        py: { xs: 4, md: 6 },
        px: 2,
        boxShadow: '0 -4px 30px rgba(0, 0, 0, 0.05)'
      }}
    >
      <Container maxWidth="xl">
        <Grid 
          container 
          spacing={{ xs: 4, md: 8 }} 
          ref={ref}
          sx={{
            position: 'relative',
            zIndex: 2
          }}
        >
          {/* Social Links Section */}
          <Grid item xs={12} md={6}>
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.6, delay: 0.1 }}
            >
              <Stack spacing={3} alignItems={{ xs: 'center', md: 'flex-start' }}>
                <Typography 
                  variant="h5" 
                  sx={{
                    fontWeight: 700,
                    background: 'linear-gradient(135deg, #1565c0 30%, #00897b 90%)',
                    WebkitBackgroundClip: 'text',
                    WebkitTextFillColor: 'transparent',
                    textAlign: { xs: 'center', md: 'left' }
                  }}
                >
                  Let's Collaborate
                </Typography>
                
                <Grid container spacing={2} justifyContent={{ xs: 'center', md: 'flex-start' }}>
                  {socialLinks.map((item, index) => (
                    <Grid item xs={6} sm={4} lg={3} key={index}>
                      <IconButton
                        component="a"
                        href={item.link}
                        target="_blank"
                        rel="noopener"
                        sx={{
                          width: '100%',
                          p: 1.5,
                          borderRadius: '14px',
                          bgcolor: 'rgba(255, 255, 255, 0.7)',
                          border: '1px solid rgba(25, 118, 210, 0.1)',
                          boxShadow: '0 4px 20px rgba(25, 118, 210, 0.08)',
                          transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                          '&:hover': {
                            transform: 'translateY(-3px)',
                            boxShadow: '0 6px 24px rgba(25, 118, 210, 0.15)',
                            bgcolor: 'rgba(25, 118, 210, 0.05)'
                          }
                        }}
                      >
                        <Stack alignItems="center" spacing={0.5}>
                          {React.cloneElement(item.icon, {
                            sx: { 
                              fontSize: 28,
                              color: '#1565c0',
                              transition: 'color 0.2s ease'
                            }
                          })}
                          <Typography 
                            variant="caption" 
                            sx={{ 
                              color: '#1e3a5f',
                              fontWeight: 500,
                              fontSize: '0.75rem',
                              lineHeight: 1.2
                            }}
                          >
                            {item.name}
                          </Typography>
                        </Stack>
                      </IconButton>
                    </Grid>
                  ))}
                </Grid>
              </Stack>
            </motion.div>
          </Grid>

          {/* Info Section */}
          <Grid item xs={12} md={6}>
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.6, delay: 0.3 }}
              style={{ height: '100%' }}
            >
              <Stack 
                spacing={3} 
                sx={{ 
                  height: '100%',
                  alignItems: { xs: 'center', md: 'flex-end' },
                  textAlign: { xs: 'center', md: 'right' }
                }}
              >
                <Typography
                  variant="body1"
                  sx={{
                    color: '#546e7a',
                    maxWidth: 500,
                    lineHeight: 1.7,
                    fontSize: { xs: '0.875rem', md: '1rem' }
                  }}
                >
                  "Turning ideas into exceptional digital experiences through innovative development and creative problem-solving."
                </Typography>
                
                <Stack spacing={1}>
                  <Typography
                    variant="body2"
                    sx={{
                      color: '#1e3a5f',
                      fontWeight: 500,
                      fontSize: { xs: '0.75rem', md: '0.875rem' }
                    }}
                  >
                    &copy; {new Date().getFullYear()} Shahzaib Nasir
                  </Typography>
                  <Typography
                    variant="caption"
                    sx={{
                      color: '#00897b',
                      fontWeight: 500,
                      display: 'block'
                    }}
                  >
                    Built with React ⚛️ & Material-UI 🎨
                  </Typography>
                </Stack>
              </Stack>
            </motion.div>
          </Grid>
        </Grid>

        {/* Decorative Elements */}
        <motion.div
          initial={{ scaleX: 0 }}
          animate={isInView ? { scaleX: 1 } : {}}
          transition={{ duration: 1.2, delay: 0.5, ease: [0.16, 1, 0.3, 1] }}
          style={{
            position: 'absolute',
            bottom: 0,
            left: '50%',
            transform: 'translateX(-50%)',
            // width: 'min(90%, 1200px)',
            height: '2px',
            background: 'linear-gradient(90deg, transparent, #1565c0, transparent)',
            transformOrigin: 'center'
          }}
        />
        
        {!isMobile && (
          <Box
            component={motion.div}
            initial={{ rotate: 0 }}
            animate={{ rotate: 360 }}
            transition={{ duration: 25, repeat: Infinity, ease: 'linear' }}
            sx={{
              position: 'absolute',
              top: '20%',
              right: '5%',
              width: 80,
              height: 80,
              opacity: 0.1,
              background: 'radial-gradient(circle, #1565c0 0%, transparent 70%)'
            }}
          />
        )}
      </Container>
    </Box>
  );
};

export default Footer;