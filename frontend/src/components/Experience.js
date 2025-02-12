import React, { useEffect, useState } from 'react';
import { Container, Typography, Card, CardContent, Grid } from '@mui/material';
import axios from 'axios';
import { motion } from 'framer-motion';

function Experience() {
  const [experiences, setExperiences] = useState([]);

  useEffect(() => {
    // In production, replace the URL with your deployed backend URL
    axios.get('http://localhost:5000/api/experiences')
      .then(response => {
        setExperiences(response.data);
      })
      .catch(error => {
        console.error('Error fetching experiences:', error);
      });
  }, []);

  return (
    <Container sx={{ mt: 4 }}>
      <Typography variant="h4" gutterBottom>
        Experience
      </Typography>
      <Grid container spacing={2}>
        {experiences.map(exp => (
          <Grid item xs={12} md={6} key={exp._id}>
            <motion.div
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <Card variant="outlined">
                <CardContent>
                  <Typography variant="h6">{exp.position}</Typography>
                  <Typography variant="subtitle1">{exp.company}</Typography>
                  <Typography variant="body2">
                    {new Date(exp.startDate).toLocaleDateString()} - {exp.endDate ? new Date(exp.endDate).toLocaleDateString() : 'Present'}
                  </Typography>
                  <Typography variant="body2">{exp.description}</Typography>
                </CardContent>
              </Card>
            </motion.div>
          </Grid>
        ))}
      </Grid>
    </Container>
  );
}

export default Experience;
