import React, { useRef } from 'react';
import { 
  Container, 
  Typography, 
  Box, 
  Grid, 
  Paper, 
  Button, 
  Chip, 
  Divider, 
  Avatar, 
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  LinearProgress,
  Link as MuiLink,
  IconButton
} from '@mui/material';
import { motion, useInView } from 'framer-motion';
import { Link as RouterLink } from 'react-router-dom';
import { 
  School, 
  WorkOutline, 
  Code, 
  Psychology, 
  LocationOn, 
  CastForEducation, 
  Engineering, 
  Speed, 
  Favorite, 
  EmojiEvents,
  GitHub,
  LinkedIn,
  WhatsApp,
  ArticleOutlined,
  ArrowForward,
  VerifiedUser,
  Lightbulb
} from '@mui/icons-material';

// Animated section component
const AnimatedSection = ({ children, delay = 0 }) => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: false, amount: 0.2 });
  
  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 50 }}
      animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 50 }}
      transition={{ 
        duration: 0.5, 
        delay: delay,
        ease: "easeOut"
      }}
    >
      {children}
    </motion.div>
  );
};

// Timeline item component
const TimelineItem = ({ year, title, subtitle, icon: Icon, delay = 0 }) => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: false, amount: 0.2 });
  
  return (
    <Box
      ref={ref}
      sx={{ 
        display: 'flex', 
        mb: 4,
        position: 'relative',
        '&::before': {
          content: '""',
          position: 'absolute',
          left: { xs: '24px', md: '29px' },
          top: '50px',
          bottom: '-50px',
          width: '2px',
          backgroundColor: 'rgba(21, 101, 192, 0.2)',
          zIndex: 0
        },
        '&:last-child::before': {
          display: 'none'
        }
      }}
    >
      <Box sx={{ mr: 3, zIndex: 1 }}>
        <motion.div
          initial={{ scale: 0, opacity: 0 }}
          animate={isInView ? { scale: 1, opacity: 1 } : { scale: 0, opacity: 0 }}
          transition={{ 
            duration: 0.5, 
            delay: delay,
            type: 'spring',
            stiffness: 200,
            damping: 15
          }}
        >
          <Avatar 
            sx={{ 
              bgcolor: '#1565c0', 
              width: 60, 
              height: 60,
              boxShadow: '0 4px 8px rgba(21, 101, 192, 0.3)',
              p: 1
            }}
          >
            <Icon fontSize="medium" />
          </Avatar>
        </motion.div>
      </Box>
      
      <motion.div
        initial={{ opacity: 0, x: -20 }}
        animate={isInView ? { opacity: 1, x: 0 } : { opacity: 0, x: -20 }}
        transition={{ 
          duration: 0.5, 
          delay: delay + 0.1
        }}
        style={{ flex: 1 }}
      >
        <Typography 
          variant="caption" 
          sx={{ 
            color: '#1565c0',
            fontWeight: 600,
            fontSize: '0.85rem',
            display: 'block',
            mb: 0.5
          }}
        >
          {year}
        </Typography>
        <Typography variant="h6" fontWeight={600} sx={{ mb: 0.5 }}>
          {title}
        </Typography>
        <Typography variant="body2" color="text.secondary">
          {subtitle}
        </Typography>
      </motion.div>
    </Box>
  );
};

// Skill bar component with animation
const SkillBar = ({ skill, level, delay = 0 }) => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: false, amount: 0.2 });
  
  return (
    <Box ref={ref} sx={{ mb: 2 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 0.5 }}>
        <Typography variant="body2" fontWeight={500}>
          {skill}
        </Typography>
        <Typography variant="body2" color="text.secondary">
          {level}%
        </Typography>
      </Box>
      <LinearProgress
        variant="determinate"
        value={isInView ? level : 0}
        sx={{
          height: 6,
          borderRadius: 3,
          backgroundColor: 'rgba(21, 101, 192, 0.1)',
          '& .MuiLinearProgress-bar': {
            borderRadius: 3,
            backgroundColor: '#1565c0',
            transition: 'transform 1.5s ease-out'
          }
        }}
      />
    </Box>
  );
};

// Quote component
const Quote = ({ text, author }) => (
  <Box 
    sx={{ 
      py: 3, 
      px: 4, 
      position: 'relative',
      borderLeft: '4px solid #1565c0',
      bgcolor: 'rgba(21, 101, 192, 0.05)',
      borderRadius: '4px',
      my: 4
    }}
  >
    <Typography 
      variant="h6" 
      fontStyle="italic" 
      fontWeight={400}
      gutterBottom
      color="text.secondary"
    >
      "{text}"
    </Typography>
    <Typography variant="subtitle2" color="text.secondary">
      — {author}
    </Typography>
  </Box>
);

function About() {
  // Skills data
  const webSkills = [
    { name: 'React & Redux', level: 90 },
    { name: 'HTML/CSS/JavaScript', level: 95 },
    { name: 'Material UI & Tailwind', level: 85 },
    { name: 'Redux Saga', level: 80 },
    { name: 'Responsive Design', level: 90 }
  ];
  
  const aiSkills = [
    { name: 'Machine Learning', level: 80 },
    { name: 'Deep Learning', level: 75 },
    { name: 'Natural Language Processing', level: 85 },
    { name: 'Computer Vision', level: 70 },
    { name: 'AI Deployment', level: 75 }
  ];
  
  // Interests data
  const interests = [
    { name: 'Artificial Intelligence', icon: <Psychology color="primary" /> },
    { name: 'Web Development', icon: <Code color="primary" /> },
    { name: 'Continuous Learning', icon: <CastForEducation color="primary" /> },
    { name: 'Problem Solving', icon: <Engineering color="primary" /> },
    { name: 'Travel & Exploration', icon: <LocationOn color="primary" /> }
  ];
  
  return (
    <Container maxWidth="lg" mt="" sx={{ py: 10 }}>
      {/* Header Section */}
      <AnimatedSection>
        <Box sx={{ textAlign: 'center', mb: 6 }}>
          <Typography 
            variant="h3" 
            component="h1" 
            fontWeight={700} 
            sx={{ 
              mb: 1,
              background: 'linear-gradient(90deg, #1565c0, #00897b)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent'
            }}
          >
            About Me
          </Typography>
          
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: '120px' }}
            transition={{ duration: 0.6, delay: 0.2 }}
            style={{
              height: '4px',
              background: 'linear-gradient(90deg, #1565c0, #00897b)',
              margin: '0 auto 24px'
            }}
          />
          
          <Typography 
            variant="h6" 
            color="text.secondary"
            sx={{ maxWidth: '800px', mx: 'auto', px: 2 }}
          >
            Passionate Web Developer and AI Enthusiast with a love for learning and innovation
          </Typography>
        </Box>
      </AnimatedSection>
      
      {/* Introduction */}
      <Grid container spacing={4}>
        <Grid item xs={12} md={6}>
          <AnimatedSection>
            <Typography variant="h5" fontWeight={600} gutterBottom sx={{ mb: 2 }}>
              Hello, I'm <span style={{ color: '#1565c0' }}>Shahzaib Nasir</span>
            </Typography>
            
            <Typography variant="body1" paragraph sx={{ mb: 2, lineHeight: 1.7 }}>
              I'm a dedicated Web Developer and AI student at KFUEIT, currently in my 6th semester. My journey in technology has been driven by curiosity and a passion for creating meaningful digital experiences.
            </Typography>
            
            <Typography variant="body1" paragraph sx={{ mb: 2, lineHeight: 1.7 }}>
              I believe in the power of continuous learning and consider myself a fast learner who embraces new challenges. My excitement for AI technologies drives me to explore Machine Learning, Deep Learning, and Natural Language Processing through both academic studies and personal projects.
            </Typography>
            
            <Typography variant="body1" paragraph sx={{ mb: 2, lineHeight: 1.7 }}>
              Currently, I work at Enovatorz eCommerce Company, where I develop comprehensive dashboards for product listings and employee management on Amazon. This role has given me valuable experience in creating practical, user-focused solutions.
            </Typography>
            
            <Box sx={{ display: 'flex', gap: 2, mt: 3 }}>
              <Button 
                variant="contained"
                startIcon={<VerifiedUser />}
                component={RouterLink} 
                to="/certificates"
                sx={{ 
                  borderRadius: '50px',
                  px: 3,
                  bgcolor: '#1565c0',
                  '&:hover': {
                    bgcolor: '#0d47a1',
                  }
                }}
              >
                View Certificates
              </Button>
              
              <Button 
                variant="outlined"
                startIcon={<WorkOutline />}
                component={RouterLink} 
                to="/experience"
                sx={{ 
                  borderRadius: '50px',
                  px: 3,
                  borderColor: '#1565c0',
                  color: '#1565c0',
                  '&:hover': {
                    borderColor: '#0d47a1',
                    bgcolor: 'rgba(21, 101, 192, 0.05)'
                  }
                }}
              >
                Experience
              </Button>
            </Box>
          </AnimatedSection>
        </Grid>
        
        {/* Personal Info Card */}
        <Grid item xs={12} md={6}>
          <AnimatedSection delay={0.2}>
            <Paper elevation={3} sx={{ p: 3, borderRadius: '16px', height: '100%' }}>
              <Typography variant="h6" fontWeight={600} sx={{ mb: 3, color: '#1565c0' }}>
                Personal Details
              </Typography>
              
              <List disablePadding>
                <ListItem disableGutters sx={{ pb: 1.5 }}>
                  <ListItemIcon sx={{ minWidth: '40px' }}>
                    <School sx={{ color: '#1565c0' }} />
                  </ListItemIcon>
                  <ListItemText 
                    primary={<Typography variant="body2" fontWeight={500}>Education</Typography>}
                    secondary="AI Student at KFUEIT (6th Semester)"
                  />
                </ListItem>
                
                <ListItem disableGutters sx={{ pb: 1.5 }}>
                  <ListItemIcon sx={{ minWidth: '40px' }}>
                    <WorkOutline sx={{ color: '#1565c0' }} />
                  </ListItemIcon>
                  <ListItemText 
                    primary={<Typography variant="body2" fontWeight={500}>Employment</Typography>}
                    secondary="Web Developer at Enovatorz eCommerce"
                  />
                </ListItem>
                
                <ListItem disableGutters sx={{ pb: 1.5 }}>
                  <ListItemIcon sx={{ minWidth: '40px' }}>
                    <Speed sx={{ color: '#1565c0' }} />
                  </ListItemIcon>
                  <ListItemText 
                    primary={<Typography variant="body2" fontWeight={500}>Learning Style</Typography>}
                    secondary="Fast learner who enjoys exploring new technologies"
                  />
                </ListItem>
                
                <ListItem disableGutters sx={{ pb: 1.5 }}>
                  <ListItemIcon sx={{ minWidth: '40px' }}>
                    <Favorite sx={{ color: '#1565c0' }} />
                  </ListItemIcon>
                  <ListItemText 
                    primary={<Typography variant="body2" fontWeight={500}>Passion</Typography>}
                    secondary="Artificial Intelligence, especially NLP and Computer Vision"
                  />
                </ListItem>
                
                <ListItem disableGutters>
                  <ListItemIcon sx={{ minWidth: '40px' }}>
                    <LocationOn sx={{ color: '#1565c0' }} />
                  </ListItemIcon>
                  <ListItemText 
                    primary={<Typography variant="body2" fontWeight={500}>Location</Typography>}
                    secondary="Pakistan"
                  />
                </ListItem>
              </List>
              
              <Divider sx={{ my: 2 }} />
              
              <Typography variant="subtitle2" sx={{ mb: 1.5, color: '#1565c0' }}>
                Connect with me
              </Typography>
              
              <Box sx={{ display: 'flex', gap: 1 }}>
                <IconButton component={MuiLink} href="https://github.com/shahzaib-G" target="_blank" sx={{ color: '#1565c0' }}>
                  <GitHub />
                </IconButton>
                <IconButton component={MuiLink} href="https://www.linkedin.com/in/shahzaibrj/" target="_blank" sx={{ color: '#1565c0' }}>
                  <LinkedIn />
                </IconButton>
                <IconButton component={MuiLink} href="https://wa.me/923253434138" target="_blank" sx={{ color: '#00897b' }}>
                  <WhatsApp />
                </IconButton>
              </Box>
            </Paper>
          </AnimatedSection>
        </Grid>
      </Grid>
      
      {/* Quote Section */}
      <AnimatedSection delay={0.2}>
        <Quote 
          text="The excitement of learning something new and the joy of solving complex problems are what drive my passion for technology."
          author="Shahzaib Nasir"
        />
      </AnimatedSection>
      
      {/* Timeline Section */}
      <AnimatedSection delay={0.4}>
        <Typography variant="h5" fontWeight={600} gutterBottom sx={{ mt: 6, mb: 4 }}>
          My Journey
        </Typography>
        
        <Box sx={{ pl: { xs: 0, md: 2 } }}>
          <TimelineItem 
            year="2021 - Present"
            title="AI Student at KFUEIT"
            subtitle="Studying Artificial Intelligence with focus on Machine Learning, Deep Learning, and NLP techniques. Currently in 6th semester."
            icon={School}
            delay={0.1}
          />
          
          <TimelineItem 
            year="2022 - Present"
            title="Web Developer at Enovatorz eCommerce"
            subtitle="Building comprehensive dashboards for product listings and employee management on Amazon. Working with React, Redux, and modern frontend technologies."
            icon={WorkOutline}
            delay={0.2}
          />
          
          <TimelineItem 
            year="2023"
            title="Machine Learning Engineer Training"
            subtitle="Completed specialized training in Machine Learning engineering, focusing on model deployment and production environments."
            icon={Engineering}
            delay={0.2}
          />
          
          <TimelineItem 
            year="Ongoing"
            title="Continuous Learning Journey"
            subtitle="Regularly completing free and paid courses in AI and web development to stay at the cutting edge of technology."
            icon={CastForEducation}
            delay={0.4}
          />
        </Box>
      </AnimatedSection>
      
      {/* Skills Section */}
      <Grid container spacing={4} sx={{ mt: 3 }}>
        <Grid item xs={12} md={6}>
          <AnimatedSection delay={0.5}>
            <Paper elevation={3} sx={{ p: 3, borderRadius: '16px' }}>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
                <Code sx={{ color: '#1565c0', mr: 1.5 }} />
                <Typography variant="h6" fontWeight={600}>
                  Web Development Skills
                </Typography>
              </Box>
              
              {webSkills.map((skill, index) => (
                <SkillBar 
                  key={skill.name}
                  skill={skill.name}
                  level={skill.level}
                  delay={0.1 * index}
                />
              ))}
            </Paper>
          </AnimatedSection>
        </Grid>
        
        <Grid item xs={12} md={6}>
          <AnimatedSection delay={0.6}>
            <Paper elevation={3} sx={{ p: 3, borderRadius: '16px' }}>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
                <Psychology sx={{ color: '#1565c0', mr: 1.5 }} />
                <Typography variant="h6" fontWeight={600}>
                  AI & Machine Learning Skills
                </Typography>
              </Box>
              
              {aiSkills.map((skill, index) => (
                <SkillBar 
                  key={skill.name}
                  skill={skill.name}
                  level={skill.level}
                  delay={0.1 * index}
                />
              ))}
            </Paper>
          </AnimatedSection>
        </Grid>
      </Grid>
      
      {/* Personal Philosophy Section */}
      <AnimatedSection delay={0.7}>
        <Paper 
          elevation={3} 
          sx={{ 
            p: 4, 
            borderRadius: '16px', 
            mt: 5,
            backgroundImage: 'linear-gradient(to right, rgba(21, 101, 192, 0.05), rgba(0, 137, 123, 0.05))',
            backgroundSize: '200% 100%',
            animation: 'gradient-shift 15s ease infinite',
            '@keyframes gradient-shift': {
              '0%': { backgroundPosition: '0% 50%' },
              '50%': { backgroundPosition: '100% 50%' },
              '100%': { backgroundPosition: '0% 50%' }
            }
          }}
        >
          <Grid container spacing={4} alignItems="center">
            <Grid item xs={12} md={8}>
              <Typography variant="h5" fontWeight={600} gutterBottom>
                My Learning Philosophy
              </Typography>
              
              <Typography variant="body1" paragraph sx={{ lineHeight: 1.7 }}>
                I believe in approaching technology with enthusiasm and curiosity. Learning new concepts and implementing them in real-world scenarios brings me immense joy. I'm particularly passionate about:
              </Typography>
              
              <List>
                <ListItem sx={{ pl: 0 }}>
                  <ListItemIcon>
                    <Lightbulb sx={{ color: '#1565c0' }} />
                  </ListItemIcon>
                  <ListItemText 
                    primary="Embracing new challenges and technologies"
                    secondary="I find excitement in stepping out of my comfort zone"
                  />
                </ListItem>
                
                <ListItem sx={{ pl: 0 }}>
                  <ListItemIcon>
                    <EmojiEvents sx={{ color: '#1565c0' }} />
                  </ListItemIcon>
                  <ListItemText 
                    primary="Continuous improvement through daily learning"
                    secondary="I regularly take courses and practice new skills"
                  />
                </ListItem>
                
                <ListItem sx={{ pl: 0 }}>
                  <ListItemIcon>
                    <ArticleOutlined sx={{ color: '#1565c0' }} />
                  </ListItemIcon>
                  <ListItemText 
                    primary="Sharing knowledge and collaborating with others"
                    secondary="I believe in the power of community and collective learning"
                  />
                </ListItem>
              </List>
            </Grid>
            
            <Grid item xs={12} md={4}>
              <Box
                component={motion.div}
                whileHover={{ rotate: 5, scale: 1.05 }}
                transition={{ duration: 0.2 }}
                sx={{
                  p: 2,
                  borderRadius: '16px',
                  border: '2px dashed rgba(21, 101, 192, 0.3)',
                  textAlign: 'center'
                }}
              >
                <Typography variant="h6" fontWeight={500} gutterBottom>
                  Areas of Interest
                </Typography>
                
                <Box sx={{ 
                  display: 'flex', 
                  flexWrap: 'wrap', 
                  gap: 1,
                  justifyContent: 'center'
                }}>
                  {interests.map((interest, index) => (
                    <Chip
                      key={interest.name}
                      icon={interest.icon}
                      label={interest.name}
                      sx={{ 
                        m: 0.5,
                        bgcolor: 'rgba(21, 101, 192, 0.05)',
                        border: '1px solid rgba(21, 101, 192, 0.2)',
                        '&:hover': {
                          bgcolor: 'rgba(21, 101, 192, 0.1)',
                        }
                      }}
                    />
                  ))}
                </Box>
              </Box>
            </Grid>
          </Grid>
        </Paper>
      </AnimatedSection>
      
      {/* Call to Action */}
      <AnimatedSection delay={0.5}>
        <Box 
          sx={{ 
            textAlign: 'center', 
            mt: 8, 
            mb: 2,
            p: 4,
            borderRadius: '16px',
            background: 'linear-gradient(135deg, rgba(21, 101, 192, 0.9), rgba(0, 137, 123, 0.9))',
            color: 'white',
            boxShadow: '0 8px 32px rgba(21, 101, 192, 0.3)'
          }}
        >
          <Typography variant="h5" fontWeight={600} gutterBottom>
            Let's Connect and Create Something Amazing
          </Typography>
          
          <Typography variant="body1" sx={{ mb: 3, maxWidth: '800px', mx: 'auto' }}>
            I'm always open to discussing new projects, creative ideas, or opportunities to be part of your vision. Feel free to reach out!
          </Typography>
          
          <Box sx={{ display: 'flex', justifyContent: 'center', gap: 2, flexWrap: 'wrap' }}>
            
            
            <Button
              variant="outlined"
              component={MuiLink}
              href="https://wa.me/923253434138"
              target="_blank"
              startIcon={<WhatsApp />}
              sx={{ 
                borderRadius: '50px',
                px: 3,
                borderColor: 'white',
                color: 'white',
                '&:hover': {
                  borderColor: 'white',
                  bgcolor: 'rgba(255, 255, 255, 0.1)'
                }
              }}
            >
              WhatsApp Chat
            </Button>
          </Box>
        </Box>
      </AnimatedSection>
    </Container>
  );
}

export default About;