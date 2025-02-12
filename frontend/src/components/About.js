import React from 'react';
import { Container, Typography, Box, List, ListItem, ListItemText, Button } from '@mui/material';
import { motion } from 'framer-motion';
import { Link as RouterLink } from 'react-router-dom';

function About() {
  return (
    <Container sx={{ mt: 4 }}>
      <motion.div
        initial={{ opacity: 0, x: -50 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.8 }}
      >
        <Typography variant="h4" gutterBottom>
          About Me
        </Typography>
        <Typography variant="body1" paragraph>
          Hello! I'm Shahzaib Nasir, a passionate Web Developer and AI student at KFUEIT currently in my 6th semester.
          I specialize in modern web technologies such as React, Redux, SQL, HTML, CSS, Redux Saga, Tailwind, MUI, and Bootstrap.
        </Typography>
        <Typography variant="body1" paragraph>
          Alongside web development, I am actively pursuing studies in AI, with a strong focus on Machine Learning, Deep Learning, and Natural Language Processing.
        </Typography>
        <Typography variant="body1" paragraph>
          I currently work at Enovatorz eCommerce Company, where I help build comprehensive dashboards that allow users and employees to list products on Amazon and manage various operations.
        </Typography>
        <Button variant="contained"  color="success" component={RouterLink} to="/certificates" sx={{ mr: 2 }}>
             View My Certificate Here 
            </Button>
        <Box sx={{ mt: 3 }}>
          <Typography variant="h6" gutterBottom>
            Key Skills:
          </Typography>
          <List>
            <ListItem>
              <ListItemText primary="React & Redux" />
            </ListItem>
            <ListItem>
              <ListItemText primary="SQL, HTML, CSS" />
            </ListItem>
            <ListItem>
              <ListItemText primary="Redux Saga & Tailwind" />
            </ListItem>
            <ListItem>
              <ListItemText primary="Material-UI & Bootstrap" />
            </ListItem>
            <ListItem>
              <ListItemText primary="Machine Learning, Deep Learning, NLP" />
            </ListItem>
          </List>
        </Box>
      </motion.div>
    </Container>
  );
}

export default About;
