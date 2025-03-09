import React, { useState, useRef } from 'react';
import { 
  Container, 
  Typography, 
  Box, 
  Grid, 
  Card, 
  CardContent, 
  CardMedia, 
  Chip,
  Button,
  Dialog,
  DialogContent,
  IconButton,
  useMediaQuery,
  useTheme
} from '@mui/material';
import { 
  motion, 
  useInView 
} from 'framer-motion';
import { 
  ZoomIn, 
  Close, 
  OpenInNew, 
  CloudDownload,
  VerifiedUser
} from '@mui/icons-material';

// Import certificate images
import cert1 from '../images/cart1.jpg';
import cert2 from '../images/cart2.jpg';
import cert3 from '../images/cart3.jpg';
import cert4 from '../images/cart4.jpg';
import cert5 from '../images/cart5.jpg';

// Enhanced certificate data with more information
const certificates = [
  {
    id: 1,
    title: 'Web Development Fundamentals',
    image: cert1,
    issuer: 'Udemy',
    issueDate: 'January 2023',
    description: 'Comprehensive course covering HTML, CSS, and JavaScript fundamentals for modern web development.',
    skills: ['HTML5', 'CSS3', 'JavaScript', 'Responsive Design'],
    credentialLink: 'https://udemy.com/certificate/123456',
    verified: true
  },
  {
    id: 2,
    title: 'Advanced React & Redux',
    image: cert2,
    issuer: 'Coursera',
    issueDate: 'March 2023',
    description: 'Mastering React hooks, context API, Redux, and advanced state management patterns for building scalable applications.',
    skills: ['React', 'Redux', 'Hooks', 'Context API'],
    credentialLink: 'https://coursera.org/verify/123456',
    verified: true
  },
  {
    id: 3,
    title: 'Full Stack Development',
    image: cert3,
    issuer: 'freeCodeCamp',
    issueDate: 'June 2023',
    description: 'Building end-to-end applications with MERN stack (MongoDB, Express, React, Node.js).',
    skills: ['MongoDB', 'Express.js', 'React', 'Node.js', 'REST API'],
    credentialLink: 'https://freecodecamp.org/certification/123456',
    verified: true
  },
  {
    id: 4,
    title: 'UI/UX Design Principles',
    image: cert4,
    issuer: 'LinkedIn Learning',
    issueDate: 'August 2023',
    description: 'Learning user-centered design principles, wireframing, prototyping, and usability testing.',
    skills: ['Figma', 'User Research', 'Prototyping', 'UI Design'],
    credentialLink: 'https://linkedin.com/learning/certificate/123456',
    verified: false
  },
  {
    id: 5,
    title: 'AI & Machine Learning Fundamentals',
    image: cert5,
    issuer: 'Kaggle',
    issueDate: 'October 2023',
    description: 'Introduction to artificial intelligence concepts, machine learning algorithms, and practical applications.',
    skills: ['Python', 'TensorFlow', 'Neural Networks', 'Data Analysis'],
    credentialLink: 'https://kaggle.com/learn/certification/123456',
    verified: true
  },
  {
    id: 6,
    title: 'Cloud Computing with AWS',
    image: cert1, // Reusing image for demo
    issuer: 'Amazon Web Services',
    issueDate: 'December 2023',
    description: 'Deploying and managing applications on Amazon Web Services cloud infrastructure.',
    skills: ['AWS', 'Cloud Architecture', 'ServerLess', 'Docker'],
    credentialLink: 'https://aws.training/certification/123456',
    verified: true
  },
  {
    id: 7,
    title: 'Mobile App Development with React Native',
    image: cert3, // Reusing image for demo
    issuer: 'Pluralsight',
    issueDate: 'February 2024',
    description: 'Building cross-platform mobile applications using React Native and Expo.',
    skills: ['React Native', 'Expo', 'Mobile UI', 'API Integration'],
    credentialLink: 'https://pluralsight.com/certificate/123456',
    verified: false
  },
  {
    id: 8,
    title: 'Advanced CSS & Animation',
    image: cert2, // Reusing image for demo
    issuer: 'Frontend Masters',
    issueDate: 'April 2024',
    description: 'Creating sophisticated UI designs and animations using modern CSS techniques.',
    skills: ['CSS Grid', 'Flexbox', 'SASS', 'CSS Animations'],
    credentialLink: 'https://frontendmasters.com/certificate/123456',
    verified: true
  }
];

// Simple Certificate Card Component
const CertificateCard = ({ certificate, onClick, index }) => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: false, amount: 0.2 });

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 50 }}
      animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 50 }}
      transition={{ 
        duration: 0.5, 
        delay: index * 0.1,
        type: 'spring',
        damping: 12
      }}
      whileHover={{ 
        scale: 1.03,
        y: -5,
      }}
      style={{ height: '100%' }}
    >
      <Card 
        onClick={onClick}
        sx={{
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          borderRadius: '12px',
          overflow: 'hidden',
          cursor: 'pointer',
          boxShadow: '0 8px 20px rgba(0, 0, 0, 0.08)',
          transition: 'all 0.3s ease',
          '&:hover': {
            boxShadow: '0 12px 28px rgba(0, 0, 0, 0.15)',
          }
        }}
      >
        {/* Certificate Image */}
        <Box sx={{ position: 'relative', overflow: 'hidden', pt: '70%' }}>
          <CardMedia
            component="img"
            image={certificate.image}
            alt={certificate.title}
            sx={{
              position: 'absolute',
              top: 0,
              left: 0,
              width: '100%',
              height: '100%',
              objectFit: 'cover',
              transition: 'transform 0.4s ease',
              '&:hover': {
                transform: 'scale(1.05)'
              }
            }}
          />
          
          {/* Issuer badge */}
          <Chip
            label={certificate.issuer}
            size="small"
            color="primary"
            sx={{
              position: 'absolute',
              top: 12,
              right: 12,
              fontWeight: 'bold',
            }}
          />
          
          {/* Verification badge if verified */}
          {certificate.verified && (
            <Box
              sx={{
                position: 'absolute',
                bottom: 12,
                left: 12,
                zIndex: 2,
                display: 'flex',
                alignItems: 'center',
                backgroundColor: 'rgba(0, 128, 0, 0.85)',
                borderRadius: '50px',
                padding: '3px 10px',
                color: 'white'
              }}
            >
              <VerifiedUser sx={{ fontSize: '14px', mr: 0.5 }} />
              <Typography variant="caption" fontWeight="bold">
                Verified
              </Typography>
            </Box>
          )}
          
          {/* Zoom icon overlay */}
          <Box
            sx={{
              position: 'absolute',
              top: 0,
              left: 0,
              width: '100%',
              height: '100%',
              background: 'rgba(0, 0, 0, 0.25)',
              opacity: 0,
              transition: 'opacity 0.3s ease',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              '&:hover': {
                opacity: 1
              },
              zIndex: 1
            }}
          >
            <ZoomIn sx={{ color: 'white', fontSize: '36px' }} />
          </Box>
        </Box>
        
        {/* Certificate Info */}
        <CardContent sx={{ flexGrow: 1, p: 2 }}>
          <Typography 
            variant="h6" 
            sx={{ 
              fontWeight: 600,
              color: '#2c3e50',
              mb: 0.5,
              fontSize: { xs: '0.95rem', sm: '1.1rem' }
            }}
          >
            {certificate.title}
          </Typography>
          
          <Typography 
            variant="body2" 
            color="text.secondary" 
            sx={{ mb: 1, fontSize: { xs: '0.8rem', sm: '0.875rem' } }}
          >
            {certificate.issueDate}
          </Typography>
          
          <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5, mt: 1 }}>
            {certificate.skills.slice(0, 3).map((skill) => (
              <Chip
                key={skill}
                label={skill}
                size="small"
                sx={{ 
                  backgroundColor: 'rgba(41, 128, 185, 0.1)',
                  color: '#2980b9',
                  fontSize: '0.7rem'
                }}
              />
            ))}
            {certificate.skills.length > 3 && (
              <Chip
                label={`+${certificate.skills.length - 3}`}
                size="small"
                sx={{ 
                  backgroundColor: 'rgba(0, 0, 0, 0.05)',
                  fontSize: '0.7rem'
                }}
              />
            )}
          </Box>
        </CardContent>
      </Card>
    </motion.div>
  );
};

// Certificate Detail Modal
const CertificateDetail = ({ certificate, open, onClose }) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  if (!certificate) return null;

  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="md"
      fullWidth
      sx={{
        '& .MuiDialog-paper': {
          borderRadius: '16px',
          overflow: 'hidden',
          boxShadow: '0 20px 60px rgba(0, 0, 0, 0.2)'
        }
      }}
    >
      <Box sx={{ position: 'absolute', top: 8, right: 8, zIndex: 10 }}>
        <IconButton onClick={onClose} sx={{ color: 'white', background: 'rgba(0, 0, 0, 0.4)' }}>
          <Close />
        </IconButton>
      </Box>

      <DialogContent sx={{ p: 0, position: 'relative', display: 'flex', flexDirection: 'column' }}>
        <Box sx={{ display: 'flex', flexDirection: { xs: 'column', md: 'row' }, height: '100%' }}>
          {/* Certificate Image */}
          <Box sx={{ flex: { xs: 'none', md: '1' }, height: { xs: '180px', md: 'auto' }, position: 'relative' }}>
            <CardMedia
              component="img"
              image={certificate.image}
              alt={certificate.title}
              sx={{
                width: '100%',
                height: '100%',
                objectFit: 'cover'
              }}
            />
            <Box sx={{ position: 'absolute', inset: 0, background: 'linear-gradient(to bottom, rgba(0,0,0,0) 50%, rgba(0,0,0,0.7) 100%)' }} />
          </Box>
          
          {/* Certificate Details */}
          <Box sx={{ flex: { xs: '1', md: '1' }, p: 3, maxHeight: { xs: '350px', md: '500px' }, overflow: 'auto' }}>
            <Typography variant="h5" gutterBottom sx={{ fontWeight: 600, color: '#2c3e50' }}>
              {certificate.title}
            </Typography>
            
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
              <Chip label={certificate.issuer} color="primary" sx={{ mr: 1, fontWeight: 'bold' }} />
              <Typography variant="body2" color="text.secondary">
                {certificate.issueDate}
              </Typography>
              {certificate.verified && (
                <Chip icon={<VerifiedUser />} label="Verified" size="small" color="success" sx={{ ml: 1 }} />
              )}
            </Box>
            
            <Typography variant="body1" paragraph sx={{ lineHeight: 1.6 }}>
              {certificate.description}
            </Typography>
            
            <Typography variant="h6" sx={{ mt: 3, mb: 1 }}>
              Skills Gained
            </Typography>
            
            <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, mb: 3 }}>
              {certificate.skills.map((skill) => (
                <Chip
                  key={skill}
                  label={skill}
                  sx={{ 
                    backgroundColor: 'rgba(41, 128, 185, 0.1)',
                    color: '#2980b9',
                  }}
                />
              ))}
            </Box>
            
            <Box sx={{ mt: 3, display: 'flex', flexWrap: 'wrap', gap: 2 }}>
              <Button
                variant="contained"
                startIcon={<OpenInNew />}
                href={certificate.credentialLink}
                target="_blank"
                rel="noopener noreferrer"
                sx={{ 
                  borderRadius: '50px',
                  px: 3
                }}
              >
                Verify Certificate
              </Button>
              
              <Button
                variant="outlined"
                startIcon={<CloudDownload />}
                sx={{ 
                  borderRadius: '50px',
                  px: 3
                }}
              >
                Download PDF
              </Button>
            </Box>
          </Box>
        </Box>
      </DialogContent>
    </Dialog>
  );
};

// Animated section title
const SectionTitle = ({ children }) => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: false, amount: 0.2 });
  
  return (
    <Box ref={ref} sx={{ mb: 5, textAlign: 'center' }}>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
        transition={{ duration: 0.5 }}
      >
        <Typography 
          variant="h3" 
          component="h1" 
          sx={{ 
            fontWeight: 700, 
            color: '#2c3e50',
            position: 'relative',
            display: 'inline-block',
            mb: 1
          }}
        >
          {children}
        </Typography>
      </motion.div>
      
      <motion.div
        initial={{ width: 0 }}
        animate={isInView ? { width: '80px' } : { width: 0 }}
        transition={{ duration: 0.5, delay: 0.3 }}
        style={{
          height: '3px',
          background: 'linear-gradient(90deg, #3498db, #2ecc71)',
          borderRadius: '2px',
          margin: '0 auto'
        }}
      />
    </Box>
  );
};

// Statistics section
const StatisticsSection = () => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: false, amount: 0.2 });
  
  const stats = [
    { value: 8, label: 'Certificates' },
    { value: 5, label: 'Platforms' },
    { value: 3, label: 'Years Experience' },
    { value: 20, label: 'Skills Gained' },
  ];
  
  return (
    <Box 
      ref={ref}
      sx={{ 
        py: 5,
        my: 6,
        borderRadius: '12px',
        background: 'linear-gradient(135deg, #3498db, #2ecc71)',
        boxShadow: '0 10px 30px rgba(0, 0, 0, 0.1)',
      }}
    >
      <Container>
        <Grid container spacing={3} justifyContent="center">
          {stats.map((stat, index) => (
            <Grid item xs={6} sm={3} key={index} textAlign="center">
              <motion.div
                initial={{ opacity: 0, scale: 0.5 }}
                animate={isInView ? { opacity: 1, scale: 1 } : { opacity: 0, scale: 0.5 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
              >
                <Typography 
                  variant="h2" 
                  sx={{ 
                    fontWeight: 700, 
                    color: 'white',
                    textShadow: '0 2px 8px rgba(0,0,0,0.2)'
                  }}
                >
                  {stat.value}+
                </Typography>
                <Typography 
                  variant="body1" 
                  sx={{ 
                    color: 'rgba(255,255,255,0.9)',
                    fontWeight: 500,
                    textTransform: 'uppercase',
                    letterSpacing: 1
                  }}
                >
                  {stat.label}
                </Typography>
              </motion.div>
            </Grid>
          ))}
        </Grid>
      </Container>
    </Box>
  );
};

// Call-to-action section
const CallToAction = () => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: false, amount: 0.2 });
  
  return (
    <Box 
      ref={ref}
      sx={{ 
        py: 6,
        mb: 4,
        borderRadius: '12px',
        background: 'linear-gradient(135deg, #f5f7fa, #e5e9f0)',
      }}
    >
      <Container maxWidth="md">
        <Grid container spacing={4} alignItems="center">
          <Grid item xs={12} md={7}>
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              animate={isInView ? { opacity: 1, x: 0 } : { opacity: 0, x: -30 }}
              transition={{ duration: 0.6 }}
            >
              <Typography 
                variant="h4" 
                gutterBottom 
                sx={{ 
                  fontWeight: 700, 
                  color: '#2c3e50' 
                }}
              >
                Ready to Discuss Your Project?
              </Typography>
              <Typography 
                variant="body1" 
                paragraph 
                sx={{ 
                  fontSize: '1.1rem', 
                  color: '#34495e', 
                  mb: 3 
                }}
              >
                Let's combine my expertise and your vision to create something amazing. I'm always open to new challenges and collaborations.
              </Typography>
              <Button 
                variant="contained" 
                size="large"
                href="https://wa.me/923253434138"
                target="_blank"
                sx={{ 
                  borderRadius: '50px',
                  px: 4,
                  py: 1.5,
                  backgroundColor: '#3498db',
                  '&:hover': {
                    backgroundColor: '#2980b9',
                    transform: 'translateY(-3px)',
                    boxShadow: '0 8px 15px rgba(0, 0, 0, 0.1)'
                  },
                  transition: 'all 0.3s ease'
                }}
              >
                Contact Me
              </Button>
            </motion.div>
          </Grid>
          <Grid item xs={12} md={5} sx={{ display: { xs: 'none', md: 'block' } }}>
            <motion.div
              initial={{ opacity: 0, scale: 0.4}}
              animate={isInView ? { opacity: 1, scale: 1 } : { opacity: 0, scale: 0.4 }}
              transition={{ duration: 0.6 }}
              style={{ position: 'relative', height: '250px' }}
            >
              {/* Abstract shape decorations */}
              <Box 
                component={motion.div}
                animate={{ 
                  rotate: 360,
                  borderRadius: ['30% 70% 70% 30% / 30% 30% 70% 70%', '60% 40% 30% 70% / 60% 30% 70% 40%', '30% 70% 70% 30% / 30% 30% 70% 70%']
                }}
                transition={{ duration: 20, repeat: Infinity, ease: "easeInOut" }}
                sx={{ 
                  position: 'absolute',
                  width: '180px',
                  height: '180px',
                  background: 'linear-gradient(135deg, rgba(52, 152, 219, 0.3), rgba(46, 204, 113, 0.3))',
                  filter: 'blur(2px)',
                  left: '50%',
                  top: '50%',
                  transform: 'translate(-50%, -50%)',
                }}
              />
            </motion.div>
          </Grid>
        </Grid>
      </Container>
    </Box>
  );
};

// Main Certificates Component
function Certificates() {
  const [selectedCertificate, setSelectedCertificate] = useState(null);
  const [isModalOpen, setModalOpen] = useState(false);
  
  // Open certificate detail modal
  const handleOpenModal = (certificate) => {
    setSelectedCertificate(certificate);
    setModalOpen(true);
  };
  
  // Close certificate detail modal
  const handleCloseModal = () => {
    setModalOpen(false);
  };
  
  return (
    <Container maxWidth="lg" sx={{ py: 10, position: 'relative' }}>
      {/* Title */}
      <SectionTitle>My Certifications</SectionTitle>
      
      {/* Introduction */}
      <Box sx={{ textAlign: 'center', mb: 5, maxWidth: '800px', mx: 'auto' }}>
        <Typography variant="body1" sx={{ color: '#34495e', fontSize: '1.1rem', mb: 3 }}>
          Each certification represents my commitment to continuous learning and professional growth. 
          These credentials validate my expertise in various areas of web development and design.
        </Typography>
      </Box>
      
      {/* Statistics Section */}
      <StatisticsSection />
      
      {/* Certificates Grid */}
      <Grid container spacing={3} sx={{ mb: 6 }}>
        {certificates.map((certificate, index) => (
          <Grid item xs={12} sm={6} md={4} lg={3} key={certificate.id}>
            <CertificateCard 
              certificate={certificate} 
              onClick={() => handleOpenModal(certificate)}
              index={index}
            />
          </Grid>
        ))}
      </Grid>
      
      {/* Certificate Detail Modal */}
      <CertificateDetail 
        certificate={selectedCertificate}
        open={isModalOpen}
        onClose={handleCloseModal}
      />
      
      {/* Call to Action */}
      <CallToAction />
    </Container>
  );
}

export default Certificates;