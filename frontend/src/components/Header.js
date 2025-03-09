import React, { useState, useEffect } from 'react';
import { 
  AppBar, 
  Box, 
  Container,
  Drawer, 
  IconButton, 
  List, 
  ListItem,
  Fade,
  useScrollTrigger
} from '@mui/material';
import { Menu as MenuIcon, Close as CloseIcon } from '@mui/icons-material';
import { Link as RouterLink, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import logo from '../images/Logo.png';

// HideOnScroll component for clean scroll effect
function HideOnScroll(props) {
  const { children } = props;
  const trigger = useScrollTrigger({
    disableHysteresis: true,
    threshold: 100
  });

  return (
    <Fade appear={false} direction="down" in={!trigger}>
      {children}
    </Fade>
  );
}

function Header() {
  const [isOpen, setIsOpen] = useState(false);
  const [headerVisible, setHeaderVisible] = useState(true);
  const location = useLocation();

  const menuItems = [
    { text: 'Home', path: '/' },
    { text: 'About', path: '/about' },
    { text: 'Certificates', path: '/certificates' },
    { text: 'Experience', path: '/experience' }
  ];

  // Handle scroll behavior
  useEffect(() => {
    let lastScrollY = window.scrollY;
    
    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      
      if (currentScrollY > lastScrollY && currentScrollY > 80) {
        setHeaderVisible(false);
      } else {
        setHeaderVisible(true);
      }
      
      lastScrollY = currentScrollY;
    };
    
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <HideOnScroll>
      <AppBar 
        position="fixed"
        elevation={0}
        sx={{ 
          background: 'linear-gradient(135deg, rgba(52, 152, 219, 0.3), rgba(46, 204, 113, 0.3))',
          backdropFilter: 'blur(10px)',
          transform: headerVisible ? 'translateY(0)' : 'translateY(-100%)',
          transition: 'transform 0.3s ease'
        }}
      >
        <Container maxWidth="xl">
          <Box 
            sx={{ 
              display: 'flex', 
              justifyContent: 'space-between', 
              alignItems: 'center',
              py: 1.5
            }}
          >
            {/* Logo with pulse animation on hover */}
            <Box 
              component={RouterLink} 
              to="/"
              sx={{
                display: 'flex',
                alignItems: 'center'
              }}
            >
              <Box
                component="img"
                src={logo}
                alt="Logo"
                sx={{
                  width: '50px',
                  height: '50px',
                  borderRadius: '50%',
                  transition: 'all 0.3s ease',
                  '&:hover': {
                    transform: 'scale(1.05)',
                    boxShadow: '0 0 0 4px rgba(0, 0, 0, 0.1), 0 0 15px rgba(0, 0, 0, 0.2)'
                  }
                }}
              />
              
              {/* Desktop navigation */}
              <Box 
                sx={{ 
                  display: { xs: 'none', md: 'flex' },
                  ml: 4
                }}
              >
                {menuItems.map((item) => (
                  <Box
                    key={item.text}
                    component={RouterLink}
                    to={item.path}
                    sx={{
                      position: 'relative',
                      color: location.pathname === item.path ? '#000' : '#555',
                      fontSize: '16px',
                      fontWeight: location.pathname === item.path ? 600 : 500,
                      textDecoration: 'none',
                      mx: 2,
                      py: 1,
                      transition: 'color 0.3s ease',
                      '&:hover': {
                        color: '#000'
                      },
                      '&::after': {
                        content: '""',
                        position: 'absolute',
                        width: location.pathname === item.path ? '100%' : '0%',
                        height: '2px',
                        bottom: 0,
                        left: 0,
                        backgroundColor: '#000',
                        transition: 'width 0.3s ease'
                      },
                      '&:hover::after': {
                        width: '100%'
                      }
                    }}
                  >
                    {item.text}
                  </Box>
                ))}
              </Box>
            </Box>

            {/* Mobile menu icon */}
            <IconButton
              sx={{ 
                display: { xs: 'flex', md: 'none' },
                color: '#000',
                border: '1px solid rgba(0, 0, 0, 0.1)',
                borderRadius: '8px',
                p: 1,
                '&:hover': {
                  backgroundColor: 'rgba(0, 0, 0, 0.05)'
                }
              }}
              onClick={() => setIsOpen(true)}
              aria-label="menu"
            >
              <MenuIcon />
            </IconButton>
          </Box>
        </Container>

        {/* Mobile drawer */}
        <Drawer
          anchor="right"
          open={isOpen}
          onClose={() => setIsOpen(false)}
          PaperProps={{
            sx: {
              width: '100%',
              maxWidth: '300px',
              background: 'linear-gradient(135deg, #fbebd6 0%, #f5d6b2 100%)',
              p: 2
            }
          }}
        >
          <Box sx={{ position: 'relative', height: '100%' }}>
            {/* Close button */}
            <IconButton
              onClick={() => setIsOpen(false)}
              sx={{
                position: 'absolute',
                right: 10,
                top: 10,
                color: '#000',
                '&:hover': {
                  backgroundColor: 'rgba(0, 0, 0, 0.05)'
                }
              }}
            >
              <CloseIcon />
            </IconButton>
            
            <Box
              component={RouterLink}
              to="/"
              onClick={() => setIsOpen(false)}
              sx={{
                display: 'flex',
                justifyContent: 'center',
                mt: 6,
                mb: 4
              }}
            >
              <Box
                component="img"
                src={logo}
                alt="Logo"
                sx={{
                  width: '70px',
                  height: '70px',
                  borderRadius: '50%',
                  boxShadow: '0 4px 20px rgba(0, 0, 0, 0.15)'
                }}
              />
            </Box>

            <List>
              <AnimatePresence>
                {menuItems.map((item, index) => (
                  <motion.div
                    key={item.text}
                    initial={{ opacity: 0, x: 50 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.1, duration: 0.4 }}
                  >
                    <ListItem
                      component={RouterLink}
                      to={item.path}
                      onClick={() => setIsOpen(false)}
                      sx={{
                        color: location.pathname === item.path ? '#000' : '#555',
                        fontWeight: location.pathname === item.path ? 600 : 500,
                        textDecoration: 'none',
                        fontSize: '18px',
                        borderLeft: location.pathname === item.path ? '3px solid #000' : '3px solid transparent',
                        pl: 2,
                        py: 2,
                        my: 0.5,
                        borderRadius: '4px',
                        transition: 'all 0.3s ease',
                        '&:hover': {
                          backgroundColor: 'rgba(0, 0, 0, 0.05)',
                          borderLeft: '3px solid #000',
                          color: '#000'
                        }
                      }}
                    >
                      {item.text}
                    </ListItem>
                  </motion.div>
                ))}
              </AnimatePresence>
            </List>
            
            {/* Simple decorative elements */}
            <Box sx={{ position: 'absolute', bottom: 30, left: 0, right: 0 }}>
              <Box
                sx={{
                  display: 'flex',
                  justifyContent: 'center',
                  opacity: 0.3
                }}
              >
                <Box sx={{ 
                  width: '80%', 
                  height: '2px', 
                  background: 'linear-gradient(90deg, transparent, rgba(0,0,0,0.5), transparent)' 
                }} />
              </Box>
              
              <Box
                sx={{
                  textAlign: 'center',
                  fontSize: '12px',
                  mt: 2,
                  color: '#555',
                  fontStyle: 'italic'
                }}
              >
                &copy; {new Date().getFullYear()} Portfolio
              </Box>
            </Box>
          </Box>
        </Drawer>
      </AppBar>
    </HideOnScroll>
  );
}

export default Header;