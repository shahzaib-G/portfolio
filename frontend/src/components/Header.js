import React, { useState, useEffect } from 'react';
import { 
  AppBar, 
  Box, 
  Drawer, 
  IconButton, 
  List, 
  ListItem, 
  Typography,
  styled 
} from '@mui/material';
import { Menu as MenuIcon, Close as CloseIcon } from '@mui/icons-material';
import { Link as RouterLink } from 'react-router-dom';
import logo from '../images/Logo.png'; // Make sure to have your logo image at this path

// Styled component for logo image
const AnimatedLogo = styled(Box)(({ theme }) => ({
  width: '80px',
  borderRadius: '50%',
  height: 'auto',
  transform: 'translateY(30px)',
  opacity: 0,
  transition: 'all 0.6s cubic-bezier(0.57, 0.21, 0.69, 1.25)',
  '&.animated': {
    transform: 'translateY(0)',
    opacity: 1
  }
}));

const MenuButton = styled(IconButton)(({ theme }) => ({
  transform: 'translateY(30px)',
  opacity: 0,
  transition: 'all 0.6s cubic-bezier(0.57, 0.21, 0.69, 1.25)',
  '&.animated': {
    transform: 'translateY(0)',
    opacity: 1
  }
}));

const NavLink = styled(RouterLink)(({ theme }) => ({
  textDecoration: 'none',
  color: '#fbebd6',
  fontSize: '32px',
  textTransform: 'uppercase',
  fontWeight: 400,
  letterSpacing: '2px',
  display: 'block',
  transform: 'translateY(100px)',
  opacity: 0,
  transition: 'all 0.5s ease-in-out',
  '&.visible': {
    transform: 'translateY(0)',
    opacity: 1
  },
  '& span': {
    display: 'block',
    transition: 'transform 0.5s ease-in-out, opacity 0.5s ease-in-out',
    '&:nth-of-type(2)': {
      fontFamily: '"Bodoni Moda", serif',
      transform: 'translateY(-32px) rotateX(95deg) skewX(-11deg)',
      opacity: 0
    }
  },
  '&:hover span:first-of-type': {
    transform: 'translateY(-32px) rotateX(87deg)',
    opacity: 0
  },
  '&:hover span:nth-of-type(2)': {
    transform: 'translateY(-52px) rotateX(0deg) skewX(-11deg)',
    opacity: 1
  }
}));

const StyledDrawer = styled(Drawer)(({ theme }) => ({
  '& .MuiDrawer-paper': {
    width: '50%',
    background: '#0a0a0a',
    padding: '80px 0'
  }
}));

// Increased height and removed overflow so complete text is visible
const NavItem = styled(ListItem)({
  height: '80px', 
  marginBottom: '8px'
});

function Header() {
  const [isOpen, setIsOpen] = useState(false);
  const [animated, setAnimated] = useState(false);

  const menuItems = [
    { text: 'Home', path: '/' },
    { text: 'About', path: '/about' },
    // { text: 'Services', path: '/services' },
    { text: 'Certificates', path: '/certificates' },
    { text: 'Experience', path: '/experience' }
  ];

  useEffect(() => {
    setAnimated(true);
  }, []);

  return (
    <AppBar 
      position="static" 
      sx={{ bgcolor: '#fbebd6', boxShadow: 'none', py: 0, px: 5 }}
    >
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        {/* Logo Image that redirects to Home */}
        <RouterLink to="/">
          <AnimatedLogo 
            component="img" 
            src={logo} 
            alt="Logo" 
            className={animated ? 'animated' : ''} 
          />
        </RouterLink>

        <MenuButton
          className={animated ? 'animated' : ''}
          onClick={() => setIsOpen(true)}
          sx={{ color: 'black' }}
        >
          <MenuIcon />
        </MenuButton>

        <StyledDrawer
          anchor="left"
          open={isOpen}
          onClose={() => setIsOpen(false)}
        >
          <IconButton
            onClick={() => setIsOpen(false)}
            sx={{
              position: 'absolute',
              right: 30,
              top: 30,
              color: '#fbebd6',
              '&:hover': {
                transform: 'rotate(90deg)',
                opacity: 0.5
              },
              transition: 'transform 0.5s ease-in-out, opacity 0.5s ease-in-out'
            }}
          >
            <CloseIcon />
          </IconButton>

          <List sx={{ p: 1 }}>
            {menuItems.map((item, index) => (
              <NavItem key={item.text}>
                <NavLink
                  to={item.path}
                  className={isOpen ? 'visible' : ''}
                  onClick={() => setIsOpen(false)}
                  style={{ 
                    transitionDelay: isOpen ? `${1 + (index * 0.2)}s` : '0s'
                  }}
                >
                  <span>{item.text}</span>
                  <span>{item.text}</span>
                </NavLink>
              </NavItem>
            ))}
          </List>
        </StyledDrawer>
      </Box>
    </AppBar>
  );
}

export default Header;
