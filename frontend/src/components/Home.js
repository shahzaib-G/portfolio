import React, { useEffect, useRef, useState } from 'react';
import { Container, Typography, Box, Grid, Button, useMediaQuery, useTheme } from '@mui/material';
import { motion, useScroll, useTransform, useInView } from 'framer-motion';
import { Link as RouterLink } from 'react-router-dom';
import { WhatsApp, GitHub, LinkedIn, Download, Code, School, Work } from '@mui/icons-material';
import shahzaib from '../images/shahzaib.jpeg';

// Animated particle background
const BackgroundCanvas = () => {
  const canvasRef = useRef(null);
  
  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    let particlesArray = [];
    let hue = 210; // Starting with blue hue
    
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    
    class Particle {
      constructor() {
        this.x = Math.random() * canvas.width;
        this.y = Math.random() * canvas.height;
        this.size = Math.random() * 3 + 1;
        this.speedX = Math.random() * 2 - 1;
        this.speedY = Math.random() * 2 - 1;
        this.color = `hsla(${hue}, 80%, 60%, 0.7)`;
      }
      
      update() {
        this.x += this.speedX;
        this.y += this.speedY;
        
        if (this.size > 0.2) this.size -= 0.02;
        
        // Bounce off edges with slight damping
        if (this.x < 0 || this.x > canvas.width) {
          this.speedX *= -0.95;
          this.x = Math.max(0, Math.min(this.x, canvas.width));
        }
        if (this.y < 0 || this.y > canvas.height) {
          this.speedY *= -0.95;
          this.y = Math.max(0, Math.min(this.y, canvas.height));
        }
      }
      
      draw() {
        ctx.fillStyle = this.color;
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        ctx.fill();
      }
    }
    
    const init = () => {
      particlesArray = [];
      for (let i = 0; i < 40; i++) {
        particlesArray.push(new Particle());
      }
    };
    
    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      ctx.fillStyle = 'rgba(10, 15, 30, 0.01)';
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      
      for (let i = 0; i < particlesArray.length; i++) {
        particlesArray[i].update();
        particlesArray[i].draw();
      }
      
      // Connect particles with lines if they're close enough
      for (let i = 0; i < particlesArray.length; i++) {
        for (let j = i; j < particlesArray.length; j++) {
          const dx = particlesArray[i].x - particlesArray[j].x;
          const dy = particlesArray[i].y - particlesArray[j].y;
          const distance = Math.sqrt(dx * dx + dy * dy);
          
          if (distance < 120) {
            ctx.beginPath();
            ctx.strokeStyle = `hsla(${hue}, 80%, 60%, ${1 - distance/120})`;
            ctx.lineWidth = 0.2;
            ctx.moveTo(particlesArray[i].x, particlesArray[i].y);
            ctx.lineTo(particlesArray[j].x, particlesArray[j].y);
            ctx.stroke();
            ctx.closePath();
          }
        }
      }
      
      // Slowly change hue for color cycling effect
      hue += 0.2;
      if (hue > 360) hue = 0;
      
      // Replace particles that have become too small
      for (let i = 0; i < particlesArray.length; i++) {
        if (particlesArray[i].size <= 0.3) {
          particlesArray[i] = new Particle();
        }
      }
      
      requestAnimationFrame(animate);
    };
    
    const handleResize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
      init();
    };
    
    window.addEventListener('resize', handleResize);
    
    init();
    animate();
    
    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, []);
  
  return (
    <canvas 
      ref={canvasRef} 
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        width: 'auto',
        height: '100%',
        zIndex: -1,
        opacity: 0.8,
      }}
    />
  );
};

// Animated skill badge component
const SkillBadge = ({ skill, index }) => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: false, amount: 0.5 });
  
  return (
    <motion.div
      ref={ref}
      initial={{ scale: 0.8, opacity: 0 }}
      animate={isInView ? { scale: 1, opacity: 1 } : { scale: 0.8, opacity: 0 }}
      transition={{ duration: 0.5, delay: index * 0.05 }}
      style={{ 
        display: 'inline-block',
        margin: '0.25rem',
        padding: '0.5rem 1rem',
        borderRadius: '20px',
        background: 'rgba(25, 118, 210, 0.1)',
        border: '1px solid rgba(25, 118, 210, 0.2)',
        backdropFilter: 'blur(5px)',
        fontSize: '0.85rem',
        fontWeight: 500,
        color: '#1565c0' 
      }}
    >
      {skill}
    </motion.div>
  );
};

// Feature card component
const FeatureCard = ({ icon, title, description, index }) => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: false, amount: 0.3 });
  
  return (
    <Grid item xs={12} md={4}>
      <motion.div
        ref={ref}
        initial={{ y: 50, opacity: 0 }}
        animate={isInView ? { y: 0, opacity: 1 } : { y: 50, opacity: 0 }}
        transition={{ duration: 0.6, delay: index * 0.2 }}
      >
        <Box
          sx={{
            p: 3,
            height: '100%',
            borderRadius: '16px',
            background: 'rgba(255, 255, 255, 0.8)',
            backdropFilter: 'blur(10px)',
            boxShadow: '0 10px 30px rgba(0, 0, 0, 0.08)',
            transition: 'transform 0.3s ease, box-shadow 0.3s ease',
            '&:hover': {
              transform: 'translateY(-10px)',
              boxShadow: '0 15px 35px rgba(0, 0, 0, 0.12)',
            }
          }}
        >
          <Box 
            sx={{ 
              mb: 2, 
              display: 'inline-flex', 
              p: 1.5,
              borderRadius: '12px',
              background: 'linear-gradient(135deg, #1565c0, #00897b)',
              color: 'white'
            }}
          >
            {icon}
          </Box>
          <Typography variant="h6" sx={{ mb: 1, fontWeight: 600, color: '#1e3a5f' }}>
            {title}
          </Typography>
          <Typography variant="body2" sx={{ color: '#546e7a', lineHeight: 1.7 }}>
            {description}
          </Typography>
        </Box>
      </motion.div>
    </Grid>
  );
};

// Experience timeline item
const TimelineItem = ({ year, title, company, description, index }) => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: false, amount: 0.3 });
  
  return (
    <motion.div
    
      ref={ref}
      initial={{ opacity: 0, x: -30 }}
      animate={isInView ? { opacity: 1, x: 0 } : { opacity: 0, x: -30 }}
      transition={{ duration: 0.3, delay: index * 0.2 }}
      style={{ 
        position: 'relative',
        paddingLeft: '2px',
        marginBottom: '32px',
        borderLeft: '2px solid rgba(21, 101, 192, 0.3)' 
      }}
    >
      <Box 
        sx={{ 
          position: 'absolute',
          left: '-10px',
          top: '0',
          width: '18px',
          height: '18px',
          borderRadius: '50%',
          background: 'linear-gradient(135deg, #1565c0, #00897b)',
          boxShadow: '0 0 0 4px rgba(21, 101, 192, 0.2)',
        }}
      />
      <Typography variant="caption" sx={{ color: '#546e7a', fontWeight: 500 }}>
        {year}
      </Typography>
      <Typography variant="h6" sx={{ mt: 0.5, mb: 0.5, color: '#1e3a5f', fontWeight: 600 }}>
        {title}
      </Typography>
      <Typography variant="subtitle2" sx={{ color: '#00897b', mb: 1 }}>
        {company}
      </Typography>
      <Typography variant="body2" sx={{ color: '#546e7a', lineHeight: 1.7 }}>
        {description}
      </Typography>
    </motion.div>
  );
};

function Home() {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const isTablet = useMediaQuery(theme.breakpoints.down('lg'));
  const { scrollYProgress } = useScroll();
  const heroRef = useRef(null);
  const aboutRef = useRef(null);
  const featuresRef = useRef(null);
  const timelineRef = useRef(null);
  
  // Parallax effects
  const y = useTransform(scrollYProgress, [0, 1], [0, -70]);
  const opacity = useTransform(scrollYProgress, [0, 0.3, 1], [1, 0.8, 0.5]);
  const scale = useTransform(scrollYProgress, [0, 0.3], [1, 0.95]);
  
  // Skills list
  const skills = [
    'React', 'Redux', 'Material UI', 'Tailwind CSS', 'Framer Motion',
    'JavaScript', 'HTML5', 'CSS3', 'Redux Saga', 'Bootstrap',
    'Machine Learning', 'Deep Learning', 'NLP', 'Python', 'TypeScript'
  ];
  
  // Features list
  const features = [
    {
      icon: <Code fontSize="medium" />,
      title: "Web Development",
      description: "Building responsive and intuitive web applications using modern frameworks and technologies with a focus on performance and user experience."
    },
    {
      icon: <School fontSize="medium" />,
      title: "AI Studies",
      description: "Pursuing advanced studies in Artificial Intelligence with specialization in Machine Learning, Deep Learning, and Natural Language Processing."
    },
    {
      icon: <Work fontSize="medium" />,
      title: "Professional Experience",
      description: "Working at Enovatorz eCommerce Company, developing sophisticated dashboards and employee management systems."
    }
  ];
  
  // Experience timeline
  const timeline = [
    {
      year: "2023 - Present",
      title: "software Developer",
      company: "Enovatorz eCommerce",
      description: "Developing responsive dashboards for product listings and employee management. Implementing UI/UX improvements and optimizing application performance."
    },
    {
      year: "2022 - 2023",
      title: "Web Development Intern",
      company: "Enovatorz",
      description: "Assisted in developing responsive websites and web applications using React and modern JavaScript frameworks. Collaborated with senior developers on client projects."
    },
    {
      year: "2021 - Present",
      title: "BSc in Artificial Intelligence",
      company: "KFUEIT University",
      description: "Studying artificial intelligence with focus on machine learning, deep learning, and natural language processing. Currently in 6th semester."
    }
  ];
  
  return (
    <>
      <BackgroundCanvas />
      
      {/* Hero Section */}
      <Container maxWidth="lg" sx={{ pt: { xs: 4, md: 6 }, pb: 6, position: 'relative', zIndex: 1 }}>
        <Box 
          ref={heroRef}
          sx={{
            display: 'flex',
            flexDirection: { xs: 'column', md: 'row' },
            alignItems: 'center',
            justifyContent: 'space-between',
            gap: 5,
            minHeight: '90vh',
          }}
        >
          {/* Hero Content */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ 
              duration: 0.8, 
              type: 'spring',
              stiffness: 100,
              damping: 20
            }}
            style={{ 
              flex: isTablet ? 1 : 0.55,
              width: '100%',
            }}
          >
            <Box
              sx={{
                p: { xs: 3, md: 4 },
                borderRadius: '24px',
                background: 'rgba(255, 255, 255, 0.85)',
                backdropFilter: 'blur(15px)',
                boxShadow: '0 15px 50px rgba(0, 0, 0, 0.1)',
                border: '1px solid rgba(255, 255, 255, 0.2)',
              }}
            >
              <Typography 
                variant="overline" 
                component={motion.div}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.5 }}
                sx={{ 
                  fontSize: '0.9rem',
                  letterSpacing: 3,
                  color: '#00897b',
                  fontWeight: 500,
                  mb: 1
                }}
              >
                WEB DEVELOPER & AI ENTHUSIAST
              </Typography>
              
              <Typography 
                variant="h3" 
                component={motion.h3}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2, duration: 0.6 }}
                sx={{ 
                  fontWeight: 800, 
                  background: 'linear-gradient(120deg, #1565c0, #00897b)', 
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                  mb: 1,
                  fontSize: { xs: '2rem', sm: '2.5rem', md: '3rem' }
                }}
              >
                I'm Shahzaib Nasir
              </Typography>
              
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: '100px' }}
                transition={{ delay: 0.7, duration: 1 }}
                style={{
                  height: '4px',
                  background: 'linear-gradient(90deg, #1565c0, #00897b)',
                  marginBottom: '1.5rem',
                  borderRadius: '2px'
                }}
              />
              
              <Typography 
                variant="body1" 
                component={motion.p}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.9, duration: 0.5 }}
                sx={{ 
                  color: '#455a64', 
                  mb: 3, 
                  lineHeight: 1.8,
                  fontSize: '1.05rem'
                }}
              >
                Passionate about creating responsive and intuitive web experiences 
                with React and modern frontend technologies. Currently pursuing AI studies with 
                a focus on Machine Learning and Natural Language Processing.
              </Typography>
              
              <Box sx={{ mb: 4 }}>
                <Typography variant="h6" sx={{ mb: 1.5, fontWeight: 600, color: '#1565c0' }}>
                  My Tech Stack
                </Typography>
                
                <Box>
                  {skills.map((skill, index) => (
                    <SkillBadge key={index} skill={skill} index={index} />
                  ))}
                </Box>
              </Box>
              
              <Box 
                component={motion.div}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 1.1, duration: 0.5 }}
                sx={{ 
                  display: 'flex', 
                  flexWrap: 'wrap',
                  gap: 2, 
                  mt: 3,
                  justifyContent: { xs: 'center', sm: 'flex-start' }
                }}
              >
                <Button 
                  variant="contained"
                  component="a" 
                  href="https://www.linkedin.com/in/shahzaibrj/"
                  target="_blank"
                  rel="noopener noreferrer"
                  startIcon={<LinkedIn />}
                  sx={{ 
                    borderRadius: '50px',
                    px: 3,
                    py: 1.2,
                    backgroundColor: '#1565c0',
                    fontWeight: 500,
                    '&:hover': {
                      backgroundColor: '#0d47a1',
                      transform: 'translateY(-3px)',
                      boxShadow: '0 7px 14px rgba(0, 0, 0, 0.1)'
                    },
                    transition: 'all 0.3s ease'
                  }}
                >
                  LinkedIn
                </Button>
                
                <Button
                  variant="outlined"
                  href="https://github.com/shahzaib-G"
                  target="_blank"
                  rel="noopener noreferrer"
                  startIcon={<GitHub />}
                  sx={{ 
                    borderRadius: '50px',
                    px: 3,
                    py: 1.2,
                    borderColor: '#424242',
                    color: '#424242',
                    fontWeight: 500,
                    '&:hover': {
                      borderColor: '#212121',
                      backgroundColor: 'rgba(33, 33, 33, 0.05)',
                      transform: 'translateY(-3px)',
                      boxShadow: '0 7px 14px rgba(0, 0, 0, 0.05)'
                    },
                    transition: 'all 0.3s ease'
                  }}
                >
                  GitHub
                </Button>
                
                <Button
                  variant="outlined"
                  href="https://wa.me/923253434138"
                  target="_blank"
                  rel="noopener noreferrer"
                  startIcon={<WhatsApp />}
                  sx={{ 
                    borderRadius: '50px',
                    px: 3,
                    py: 1.2,
                    borderColor: '#00897b',
                    color: '#00897b',
                    fontWeight: 500,
                    '&:hover': {
                      borderColor: '#00695c',
                      backgroundColor: 'rgba(0, 137, 123, 0.05)',
                      transform: 'translateY(-3px)',
                      boxShadow: '0 7px 14px rgba(0, 0, 0, 0.05)'
                    },
                    transition: 'all 0.3s ease'
                  }}
                >
                  Contact Me
                </Button>
              </Box>
            </Box>
          </motion.div>

          {/* Profile Image with effects */}
          <motion.div
            style={{ 
              y, 
              opacity, 
              scale,
              flex: isTablet ? 1 : 0.45,
              display: 'flex',
              justifyContent: 'center'
            }}
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, type: 'spring', bounce: 0.4 }}
          >
            <Box
              sx={{
                position: 'relative',
                borderRadius: '30px',
                overflow: 'hidden',
                width: { xs: '280px', sm: '340px', md: '400px' },
                height: { xs: '350px', sm: '420px', md: '500px' },
                boxShadow: '0 25px 50px rgba(0, 0, 0, 0.2)',
                '&::before': {
                  content: '""',
                  position: 'absolute',
                  inset: 0,
                  borderRadius: '30px',
                  padding: '4px',
                  background: 'linear-gradient(45deg, #1565c0, transparent, #00897b, transparent, #1565c0)',
                  WebkitMask: 'linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)',
                  WebkitMaskComposite: 'xor',
                  maskComposite: 'exclude',
                  zIndex: 1,
                  animation: 'border-animate 8s linear infinite',
                },
                '@keyframes border-animate': {
                  '0%': {
                    transform: 'rotate(0deg)'
                  },
                  '100%': {
                    transform: 'rotate(360deg)'
                  }
                }
              }}
            >
              <Box
                component="img"
                src={shahzaib}
                alt="Shahzaib Nasir"
                sx={{
                  width: '100%',
                  height: '100%',
                  objectFit: 'cover',
                  objectPosition: 'center',
                  transition: 'transform 0.7s ease-in-out',
                  '&:hover': {
                    transform: 'scale(1.05)',
                  },
                }}
              />
              
              <Box 
                sx={{
                  position: 'absolute',
                  bottom: 0,
                  left: 0,
                  right: 0,
                  background: 'linear-gradient(to top, rgba(0,0,0,0.8), transparent)',
                  padding: '2rem 1.5rem 1rem',
                  zIndex: 2
                }}
              >
                <Typography variant="h6" sx={{ color: 'white', fontWeight: 600 }}>
                  Shahzaib Nasir
                </Typography>
                <Typography variant="body2" sx={{ color: 'rgba(255,255,255,0.9)' }}>
                  Web Developer & AI Enthusiast
                </Typography>
              </Box>
            </Box>
          </motion.div>
        </Box>
      </Container>
      
      {/* Features/Services Section */}
      <Container maxWidth="lg" sx={{ py: 8, position: 'relative', zIndex: 1 }}>
        <Box ref={featuresRef} sx={{ mb: 6, textAlign: 'center' }}>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: false, amount: 0.3 }}
          >
            <Typography 
              variant="h4" 
              sx={{ 
                fontWeight: 700,
                color: '#1e3a5f',
                mb: 1
              }}
            >
              What I Do
            </Typography>
            <Typography variant="body1" sx={{ color: '#546e7a', maxWidth: '700px', mx: 'auto' }}>
              Combining technical expertise with creative problem-solving to deliver exceptional results
            </Typography>
            
            <Box
              sx={{
                width: '80px',
                height: '4px',
                background: 'linear-gradient(90deg, #1565c0, #00897b)',
                mx: 'auto',
                mt: 2,
                borderRadius: '2px'
              }}
            />
          </motion.div>
        </Box>
        
        <Grid container spacing={3}>
          {features.map((feature, index) => (
            <FeatureCard 
              key={index}
              icon={feature.icon}
              title={feature.title}
              description={feature.description}
              index={index}
            />
          ))}
        </Grid>
      </Container>
      
      {/* Experience Timeline Section */}
      <Container maxWidth="lg" sx={{ py: 8, position: 'relative', zIndex: 1 }}>
        <Box ref={timelineRef} sx={{ mb: 6 }}>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: false, amount: 0.3 }}
          >
            <Typography 
              variant="h4" 
              sx={{ 
                fontWeight: 700,
                color: '#1e3a5f',
                mb: 1,
                textAlign: 'center'
              }}
            >
              My Journey
            </Typography>
            <Typography 
              variant="body1" 
              sx={{ 
                color: '#546e7a', 
                maxWidth: '700px', 
                mx: 'auto',
                textAlign: 'center'
              }}
            >
              A timeline of my professional experience and education
            </Typography>
            
            <Box
              sx={{
                width: '80px',
                height: '4px',
                background: 'linear-gradient(90deg, #1565c0, #00897b)',
                mx: 'auto',
                mt: 2,
                mb: 5,
                borderRadius: '2px'
              }}
            />
          </motion.div>
        </Box>
        
        <Box 
          sx={{
            p: { xs: 3, md: 4 },
            borderRadius: '24px',
            background: 'rgba(255, 255, 255, 0.85)',
            backdropFilter: 'blur(15px)',
            boxShadow: '0 15px 50px rgba(0, 0, 0, 0.1)',
            border: '1px solid rgba(255, 255, 255, 0.2)',
          }}
        >
          {timeline.map((item, index) => (
            <TimelineItem 
              key={index}
              year={item.year}
              title={item.title}
              company={item.company}
              description={item.description}
              index={index}
            />
          ))}
        </Box>
      </Container>
      
      {/* Call-to-Action Section */}
      <Container maxWidth="lg" sx={{ py: 8, mb: 4, position: 'relative', zIndex: 1 }}>
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7 }}
          viewport={{ once: false, amount: 0.3 }}
        >
          <Box 
            sx={{ 
              borderRadius: '30px',
              overflow: 'hidden',
              position: 'relative',
              boxShadow: '0 20px 40px rgba(0, 0, 0, 0.1)',
            }}
          >
            <Box
              sx={{
                background: 'linear-gradient(135deg, #1565c0, #00897b)',
                p: { xs: 4, md: 6 },
                position: 'relative',
                zIndex: 1,
              }}
            >
              <Grid container spacing={4} alignItems="center">
                <Grid item xs={12} md={8}>
                  <Typography 
                    variant="h4" 
                    gutterBottom 
                    sx={{ 
                      fontWeight: 700, 
                      color: 'white',
                      textShadow: '0 2px 10px rgba(0,0,0,0.2)'
                    }}
                  >
                    Ready to Collaborate on Your Next Project?
                  </Typography>
                  <Typography 
                    variant="body1" 
                    paragraph 
                    sx={{ 
                      color: 'rgba(255,255,255,0.9)', 
                      mb: 3,
                      maxWidth: '600px',
                      textShadow: '0 1px 5px rgba(0,0,0,0.1)'
                    }}
                  >
                    Let's combine my technical expertise with your vision to create something amazing. 
                    I'm always open to new challenges and exciting collaborations.
                  </Typography>
                  <Button 
                    variant="contained" 
                    size="large"
                    href="https://wa.me/923253434138"
                    target="_blank"
                    rel="noopener noreferrer"
                    sx={{ 
                      borderRadius: '50px',
                      px: 4,
                      py: 1.5,
                      backgroundColor: 'white',
                      color: '#1565c0',
                      fontWeight: 600,
                      '&:hover': {
                        backgroundColor: 'rgba(255,255,255,0.9)',
                        transform: 'translateY(-3px)',
                        boxShadow: '0 10px 20px rgba(0, 0, 0, 0.15)'
                      },
                      transition: 'all 0.3s ease'
                    }}
                  >
                    Get In Touch
                  </Button>
                </Grid>
                <Grid item xs={12} md={4} sx={{ display: { xs: 'none', md: 'block' } }}>
                <Box 
  sx={{
    position: 'relative',
    height: '200px',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center'
  }}
>
  {/* Abstract decorative elements */}
  <motion.div
    animate={{ 
      rotate: [0, 360],
      scale: [1, 1.1, 1]
    }}
    transition={{ 
      duration: 15,
      repeat: Infinity,
      ease: "linear"
    }}
    style={{
      position: 'absolute',
      width: '180px',
      height: '180px',
      borderRadius: '50%',
      border: '3px solid rgba(255,255,255,0.2)',
    }}
  />
  <motion.div
    animate={{ 
      rotate: [360, 0],
      scale: [1, 1.2, 1]
    }}
    transition={{ 
      duration: 20,
      repeat: Infinity,
      ease: "linear"
    }}
    style={{
      position: 'absolute',
      width: '120px',
      height: '120px',
      borderRadius: '50%',
      border: '3px solid rgba(255,255,255,0.15)',
    }}
  />
  
  <Box 
    component={motion.div}
    animate={{ y: [0, -10, 0] }}
    transition={{ 
      duration: 3,
      repeat: Infinity,
      ease: "easeInOut"
    }}
    sx={{
      color: 'white',
      fontSize: '4rem'
    }}
  >
    <Code fontSize="inherit" />
  </Box>
</Box>
                </Grid>
              </Grid>
            </Box>
          </Box>
        </motion.div>
      </Container>
      

    </>
  );
}

export default Home;



