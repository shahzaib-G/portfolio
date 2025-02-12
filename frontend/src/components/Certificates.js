import React from 'react';
import { Container, Typography, Card, CardContent, CardMedia, Grid } from '@mui/material';
import { motion } from 'framer-motion';

// Import certificate images from the local images folder
import cert1 from '../images/cart1.jpg';
import cert2 from '../images/cart2.jpg';
import cert3 from '../images/cart3.jpg';
import cert4 from '../images/cart4.jpg';
import cert5 from '../images/cart5.jpg';

// Define an array of certificate objects
const certificates = [
  {
    id: 1,
    // title: 'Web Development Certification',
    image: cert1,
    // description: 'Completed an intensive course in modern web development techniques.'
  },
  {
    id: 2,
    // title: 'Advanced React Certification',
    image: cert2,
    // description: 'Mastered React, hooks, and advanced patterns for scalable web apps.'
  },
  {
    id: 3,
    // title: 'Full Stack Developer Certification',
    image: cert3,
    // description: 'Demonstrated expertise in both frontend and backend technologies.'
  },
  {
    id: 4,
    // title: 'Full Stack Developer Certification',
    image: cert4,
    // description: 'Demonstrated expertise in both frontend and backend technologies.'
  },
  {
    id: 5,
    // title: 'Full Stack Developer Certification',
    image: cert5,
    // description: 'Demonstrated expertise in both frontend and backend technologies.'
  }
];

function Certificates() {
  return (
    <Container sx={{ mt: 4 }}>
      <Typography variant="h4" gutterBottom>
        Certificates
      </Typography>
      <Grid container spacing={4}>
        {certificates.map(cert => (
          <Grid item xs={12} md={4} key={cert.id}>
            <motion.div
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <Card 
                variant="outlined" 
                sx={{ 
                  borderRadius: 2,
                  overflow: 'visible' 
                }}
              >
                <CardMedia
                  component="img"
                  image={cert.image}
                  alt={cert.title}
                  sx={{
                    objectFit: 'contain',
                    width: '100%',
                    maxHeight: 300
                  }}
                />
                <CardContent>
                  <Typography variant="h6" gutterBottom>
                    {cert.title}
                  </Typography>
                  <Typography variant="body2">
                    {cert.description}
                  </Typography>
                </CardContent>
              </Card>
            </motion.div>
          </Grid>
        ))}
      </Grid>
    </Container>
  );
}

export default Certificates;
