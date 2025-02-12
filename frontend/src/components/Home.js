import React from 'react';
import { Container, Typography, Box, Button } from '@mui/material';
import { motion } from 'framer-motion';
import { Link as RouterLink } from 'react-router-dom';
import shahzaib from '../images/shahzaib.jpeg';

function Home() {
  return (
    <Container sx={{ mt: 4 }}>
      <Box
        sx={{
          display: 'flex',
          flexDirection: { xs: 'column', md: 'row' },
          alignItems: 'center',
          justifyContent: 'space-between'
        }}
      >
        {/* Left Content */}
        <motion.div
          initial={{ opacity: 0, x: -50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8 }}
          style={{ flex: 1 }}
        >
          <Typography variant="h3" gutterBottom>
            Hi, I'm Shahzaib Nasir
          </Typography>
          <Typography variant="h5" gutterBottom>
            Web Developer & AI Enthusiast
          </Typography>
          <Typography variant="body1" sx={{ mt: 2 }}>
            I specialize in React, Redux, SQL, HTML, CSS, Redux Saga, Tailwind, MUI, Bootstrap and more.
          </Typography>
          <Typography variant="body1" sx={{ mt: 1 }}>
            Currently pursuing AI studies at KFUEIT (6th semester) with skills in Machine Learning, Deep Learning, and NLP.
          </Typography>
          <Typography variant="body1" sx={{ mt: 1 }}>
            I work at Enovatorz eCommerce Company, building dashboards for product listings and employee functionalities.
          </Typography>
          <Box sx={{ mt: 3 }}>
            <Button variant="contained"  color="success" component={RouterLink} to="/about" sx={{ mr: 2 }}>
              More About Me
            </Button>
            <Button
              variant="outlined"
              href="https://wa.me/923253434138"
              target="_blank"
              color="success"
            >
              WhatsApp Chat
            </Button>
          </Box>
        </motion.div>

        {/* Right Image */}
        <motion.div
          initial={{ opacity: 0, x: 50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8 }}
          style={{ flex: 1, display: 'flex', justifyContent: 'center' }}
        >
          <Box
            component="img"
            src={shahzaib}
            alt="Shahzaib Nasir"
            sx={{
              width: { xs: '80%', md: '300px' },
              borderRadius: '8px'
            }}
          />
        </motion.div>
      </Box>
    </Container>
  );
}

export default Home;
