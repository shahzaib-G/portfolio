import React, { useState, useRef, useEffect } from 'react';
import { 
  Container, 
  Typography, 
  Box, 
  Grid, 
  Card, 
  CardContent,
  Chip,
  Button,
  Divider,
  useMediaQuery,
  useTheme,
  IconButton
} from '@mui/material';
import { 
  motion, 
  useInView 
} from 'framer-motion';
import { 
  Work,
  CalendarToday,
  LocationOn,
  KeyboardArrowDown,
  KeyboardArrowUp,
  BusinessCenter,
  School
} from '@mui/icons-material';
import axios from 'axios';

// Sample experience data in case the API call fails
const fallbackExperiences = [
  {
    id: 1,
    position: "Senior Frontend Developer",
    company: "TechSolutions Inc.",
    location: "San Francisco, CA",
    type: "Full-time",
    startDate: "2022-03-15",
    endDate: null,
    description: "Led the development of responsive web applications using React and Material UI. Implemented state management with Redux and optimized application performance. Collaborated with design and backend teams for seamless integration.",
    skills: ["React", "Redux", "Material UI", "TypeScript", "REST API"],
    achievements: [
      "Reduced load time by 40% through code splitting and lazy loading",
      "Implemented CI/CD pipeline reducing deployment time by 60%",
      "Mentored junior developers and conducted code reviews"
    ],
    category: "work"
  },
  {
    id: 2,
    position: "Frontend Developer",
    company: "WebCraft Studio",
    location: "Austin, TX",
    type: "Full-time",
    startDate: "2020-06-01",
    endDate: "2022-02-28",
    description: "Developed and maintained client websites and web applications. Created reusable components and implemented responsive designs. Worked with RESTful APIs and state management libraries.",
    skills: ["JavaScript", "React", "CSS3", "HTML5", "Git"],
    achievements: [
      "Developed 20+ responsive websites for various clients",
      "Migrated legacy jQuery applications to modern React framework",
      "Improved website accessibility to meet WCAG standards"
    ],
    category: "work"
  },
  {
    id: 3,
    position: "UI/UX Design Internship",
    company: "Creative Digital Agency",
    location: "Remote",
    type: "Internship",
    startDate: "2020-01-15",
    endDate: "2020-05-30",
    description: "Collaborated with the design team to create wireframes and prototypes. Assisted in user research and usability testing. Implemented design concepts using HTML, CSS, and JavaScript.",
    skills: ["Figma", "Adobe XD", "Wireframing", "Prototyping", "HTML/CSS"],
    achievements: [
      "Redesigned company website improving user engagement by 25%",
      "Created design system for consistent UI components",
      "Conducted usability testing with 50+ participants"
    ],
    category: "work"
  },
  {
    id: 4,
    position: "Bachelor of Artificial Intelligence",
    company: "Khawaja Fareed University of Technology",
    location: "RahimyarKhan",
    type: "Education",
    startDate: "2022-09-01",
    endDate: "2026-05-30",
    description: "Graduated with honors in Artificial Intelligence with a focus on web development and user interface design. Participated in various coding competitions and hackathons.",
    skills: ["Algorithms", "Data Structures", "Web Development", "User Interface Design"],
    achievements: [
      "GPA: 3.8/4.0",
      "Dean's List for 6 consecutive semesters",
      "Lead developer for senior capstone project"
    ],
    category: "education"
  }
];

// Animated section title (reused from Certificates component)
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

// Timeline component
const Timeline = ({ experiences }) => {
  return (
    <Box sx={{ position: 'relative', my: 6, pl: { xs: 4, md: 0 } }}>
      {/* Vertical timeline line (visible only on md and larger) */}
      <Box
        sx={{
          display: { xs: 'none', md: 'block' },
          position: 'absolute',
          left: '50%',
          transform: 'translateX(-50%)',
          width: '4px',
          height: '100%',
          background: 'linear-gradient(to bottom, #3498db, #2ecc71)',
          borderRadius: '4px',
          zIndex: 0
        }}
      />
      
      {/* Vertical timeline line (visible only on small screens) */}
      <Box
        sx={{
          display: { xs: 'block', md: 'none' },
          position: 'absolute',
          left: '0',
          width: '4px',
          height: '100%',
          background: 'linear-gradient(to bottom, #3498db, #2ecc71)',
          borderRadius: '4px',
          zIndex: 0
        }}
      />
      
      {/* Timeline items */}
      {experiences.map((experience, index) => (
        <TimelineItem key={experience.id} experience={experience} index={index} />
      ))}
    </Box>
  );
};

// Individual timeline item
const TimelineItem = ({ experience, index }) => {
  const isEven = index % 2 === 0;
  const ref = useRef(null);
  const isInView = useInView(ref, { once: false, amount: 0.2 });
  const [expanded, setExpanded] = useState(false);
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  
  const toggleExpand = () => {
    setExpanded(!expanded);
  };
  
  // Format date to show month and year only
  const formatDate = (dateString) => {
    if (!dateString) return 'Present';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { year: 'numeric', month: 'short' });
  };
  
  const isEducation = experience.category === 'education';
  
  return (
    <Box
      ref={ref}
      sx={{
        display: 'flex',
        flexDirection: { xs: 'column', md: 'row' },
        justifyContent: 'center',
        alignItems: { xs: 'flex-start', md: 'center' },
        position: 'relative',
        mb: 6
      }}
    >
      {/* Timeline dot */}
      <Box
        component={motion.div}
        initial={{ scale: 0, opacity: 0 }}
        animate={isInView ? { scale: 1, opacity: 1 } : { scale: 0, opacity: 0 }}
        transition={{ duration: 0.5, delay: 0.2 }}
        sx={{
          position: 'absolute',
          left: { xs: '-8px', md: '50%' },
          transform: { xs: 'none', md: 'translateX(-50%)' },
          width: '16px',
          height: '16px',
          borderRadius: '50%',
          background: isEducation ? '#2ecc71' : '#3498db',
          border: '3px solid white',
          boxShadow: '0 2px 5px rgba(0,0,0,0.2)',
          zIndex: 2
        }}
      />
      
      {/* Content */}
      <Grid container>
        {/* Left side (date on desktop) - empty on mobile */}
        <Grid 
          item 
          xs={12} 
          md={6} 
          sx={{ 
            pr: { md: 4 }, 
            textAlign: { md: 'right' },
            display: { xs: 'none', md: isEven ? 'block' : 'none' }
          }}
        >
          {isEven && !isMobile && (
            <Box sx={{ pt: 2 }}>
              <Typography 
                variant="h6" 
                component="div" 
                sx={{ 
                  display: 'flex', 
                  alignItems: 'center', 
                  justifyContent: 'flex-end', 
                  fontWeight: 600, 
                  color: '#2c3e50' 
                }}
              >
                <CalendarToday fontSize="small" sx={{ ml: 1, color: '#7f8c8d' }} />
                <Typography component="span" sx={{ ml: 1, color: '#7f8c8d' }}>
                  {formatDate(experience.startDate)} - {formatDate(experience.endDate)}
                </Typography>
              </Typography>
            </Box>
          )}
        </Grid>
        
        {/* Experience Card - always visible */}
        <Grid 
          item 
          xs={12} 
          md={6} 
          sx={{ 
            pl: { md: isEven ? 0 : 4 }, 
            pr: { md: isEven ? 4 : 0 } 
          }}
        >
          <motion.div
            initial={{ opacity: 0, x: isEven && !isMobile ? -30 : 30, y: isMobile ? 30 : 0 }}
            animate={isInView ? { opacity: 1, x: 0, y: 0 } : { opacity: 0, x: isEven && !isMobile ? -30 : 30, y: isMobile ? 30 : 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
          >
            <Card 
              elevation={3}
              sx={{
                borderRadius: '12px',
                overflow: 'hidden',
                transition: 'all 0.3s ease',
                '&:hover': {
                  boxShadow: '0 8px 25px rgba(0, 0, 0, 0.15)',
                  transform: 'translateY(-5px)'
                },
                borderLeft: `5px solid ${isEducation ? '#2ecc71' : '#3498db'}`
              }}
            >
              <CardContent sx={{ p: 3 }}>
                {/* Mobile date display */}
                <Box sx={{ display: { xs: 'flex', md: 'none' }, alignItems: 'center', mb: 2 }}>
                  <CalendarToday fontSize="small" sx={{ color: '#7f8c8d' }} />
                  <Typography variant="body2" sx={{ ml: 1, color: '#7f8c8d' }}>
                    {formatDate(experience.startDate)} - {formatDate(experience.endDate)}
                  </Typography>
                </Box>
                
                {/* Title and company */}
                <Box sx={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between' }}>
                  <Box>
                    <Typography variant="h5" component="h2" sx={{ fontWeight: 600, color: '#2c3e50', mb: 0.5 }}>
                      {experience.position}
                    </Typography>
                    <Typography variant="h6" component="h3" sx={{ display: 'flex', alignItems: 'center', color: '#34495e' }}>
                      {isEducation ? <School fontSize="small" sx={{ mr: 1 }} /> : <BusinessCenter fontSize="small" sx={{ mr: 1 }} />}
                      {experience.company}
                    </Typography>
                  </Box>
                  <Chip 
                    label={experience.type} 
                    size="small" 
                    color={isEducation ? "success" : "primary"} 
                    sx={{ fontWeight: 500 }} 
                  />
                </Box>
                
                {/* Location - if available */}
                {experience.location && (
                  <Box sx={{ display: 'flex', alignItems: 'center', mt: 1, mb: 2 }}>
                    <LocationOn fontSize="small" sx={{ color: '#7f8c8d' }} />
                    <Typography variant="body2" sx={{ ml: 1, color: '#7f8c8d' }}>
                      {experience.location}
                    </Typography>
                  </Box>
                )}
                
                {/* Description */}
                <Typography variant="body1" sx={{ mt: 2, color: '#34495e', lineHeight: 1.6 }}>
                  {experience.description}
                </Typography>
                
                {/* Date on right side (desktop only) */}
                {!isEven && !isMobile && (
                  <Box sx={{ display: { xs: 'none', md: 'flex' }, alignItems: 'center', mt: 2, justifyContent: 'flex-end' }}>
                    <CalendarToday fontSize="small" sx={{ color: '#7f8c8d' }} />
                    <Typography variant="body2" sx={{ ml: 1, color: '#7f8c8d' }}>
                      {formatDate(experience.startDate)} - {formatDate(experience.endDate)}
                    </Typography>
                  </Box>
                )}
                
                {/* Skills */}
                {experience.skills && experience.skills.length > 0 && (
                  <Box sx={{ mt: 2 }}>
                    <Typography variant="subtitle2" sx={{ fontWeight: 600, mb: 1 }}>
                      Skills:
                    </Typography>
                    <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                      {experience.skills.map((skill, i) => (
                        <Chip
                          key={i}
                          label={skill}
                          size="small"
                          sx={{ 
                            backgroundColor: isEducation ? 'rgba(46, 204, 113, 0.1)' : 'rgba(52, 152, 219, 0.1)',
                            color: isEducation ? '#2ecc71' : '#3498db',
                          }}
                        />
                      ))}
                    </Box>
                  </Box>
                )}
                
                {/* Achievements - expandable */}
                {experience.achievements && experience.achievements.length > 0 && (
                  <>
                    <Box sx={{ mt: 2 }}>
                      <Button 
                        onClick={toggleExpand}
                        endIcon={expanded ? <KeyboardArrowUp /> : <KeyboardArrowDown />}
                        sx={{ 
                          textTransform: 'none',
                          color: isEducation ? '#2ecc71' : '#3498db',
                          p: 0,
                          fontSize: '0.9rem'
                        }}
                      >
                        {expanded ? 'Hide achievements' : 'View achievements'}
                      </Button>
                    </Box>
                    
                    {expanded && (
                      <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: 0 }}
                        transition={{ duration: 0.3 }}
                      >
                        <Box sx={{ mt: 2, pl: 2, borderLeft: `2px solid ${isEducation ? '#2ecc71' : '#3498db'}` }}>
                          {experience.achievements.map((achievement, i) => (
                            <Typography 
                              key={i} 
                              variant="body2" 
                              sx={{ 
                                mb: 1, 
                                color: '#34495e',
                                position: 'relative',
                                pl: 2,
                                "&:before": {
                                  content: '""',
                                  position: 'absolute',
                                  left: -5,
                                  top: '50%',
                                  width: 8,
                                  height: 8,
                                  backgroundColor: isEducation ? '#2ecc71' : '#3498db',
                                  borderRadius: '50%',
                                  transform: 'translateY(-50%)'
                                }
                              }}
                            >
                              {achievement}
                            </Typography>
                          ))}
                        </Box>
                      </motion.div>
                    )}
                  </>
                )}
              </CardContent>
            </Card>
          </motion.div>
        </Grid>
      </Grid>
    </Box>
  );
};

// Statistics section (similar to the one in Certificates)
const StatisticsSection = ({ experiences }) => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: false, amount: 0.2 });
  
  // Calculate years of experience
  const calculateYearsOfExperience = () => {
    // Filter work experiences
    const workExperiences = experiences.filter(exp => exp.category === 'work');
    
    if (workExperiences.length === 0) return 0;
    
    // Sort by start date
    workExperiences.sort((a, b) => new Date(a.startDate) - new Date(b.startDate));
    
    // Get the earliest start date
    const earliestStart = new Date(workExperiences[0].startDate);
    
    // Calculate years from earliest start to now
    const now = new Date();
    const years = now.getFullYear() - earliestStart.getFullYear();
    
    // Adjust if we haven't hit the anniversary month yet
    if (now.getMonth() < earliestStart.getMonth() || 
        (now.getMonth() === earliestStart.getMonth() && now.getDate() < earliestStart.getDate())) {
      return years - 1;
    }
    
    return years;
  };
  
  // Get unique companies
  const getUniqueCompanies = () => {
    const companies = experiences.map(exp => exp.company);
    return new Set(companies).size;
  };
  
  // Get unique skills
  const getAllSkills = () => {
    const skillsArray = experiences.flatMap(exp => exp.skills || []);
    return new Set(skillsArray).size;
  };
  
  const stats = [
    { value: experiences.filter(exp => exp.category === 'work').length, label: 'Positions' },
    { value: getUniqueCompanies(), label: 'Companies' },
    { value: calculateYearsOfExperience(), label: 'Years Experience' },
    { value: getAllSkills(), label: 'Skills Used' },
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

// Call-to-action section (similar to the one in Certificates)
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
                Let's Work Together
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
                With years of experience and a passion for creating exceptional web experiences, I'm ready to bring your next project to life. Let's connect and discuss how we can collaborate.
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
              initial={{ opacity: 0, scale: 0.4 }}
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

// Category filter component
const CategoryFilter = ({ selectedCategory, onCategoryChange }) => {
  const categories = [
    { id: 'all', label: 'All Experiences' },
    { id: 'work', label: 'Work Experience' },
    { id: 'education', label: 'Education' }
  ];
  
  return (
    <Box sx={{ display: 'flex', justifyContent: 'center', mb: 4, gap: 2, flexWrap: 'wrap' }}>
      {categories.map((category) => (
        <Button
          key={category.id}
          variant={selectedCategory === category.id ? "contained" : "outlined"}
          color="primary"
          onClick={() => onCategoryChange(category.id)}
          sx={{
            borderRadius: '50px',
            px: 3,
            py: 1,
            textTransform: 'none',
            fontWeight: 500,
            boxShadow: selectedCategory === category.id ? 3 : 0,
            transition: 'all 0.3s ease',
            '&:hover': {
              transform: 'translateY(-2px)',
              boxShadow: 2
            }
          }}
        >
          {category.label}
        </Button>
      ))}
    </Box>
  );
};

// Main Experience Component
function Experience() {
  const [experiences, setExperiences] = useState([]);
  const [filteredExperiences, setFilteredExperiences] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [loading, setLoading] = useState(true);
  
  useEffect(() => {
    // Try to fetch from the API
    axios.get('http://localhost:5000/api/experiences')
      .then(response => {
        setExperiences(response.data);
        setFilteredExperiences(response.data);
        setLoading(false);
      })
      .catch(error => {
        console.error('Error fetching experiences:', error);
        // Use fallback data if API fails
        setExperiences(fallbackExperiences);
        setFilteredExperiences(fallbackExperiences);
        setLoading(false);
      });
  }, []);
  
  // Filter experiences based on selected category
  useEffect(() => {
    if (selectedCategory === 'all') {
      setFilteredExperiences(experiences);
    } else {
      setFilteredExperiences(experiences.filter(exp => exp.category === selectedCategory));
    }
  }, [selectedCategory, experiences]);
  
  // Handle category change
  const handleCategoryChange = (category) => {
    setSelectedCategory(category);
  };
  
  return (
    <Container maxWidth="lg" sx={{ py: 10 }}>
      {/* Title */}
      <SectionTitle>Professional Experience</SectionTitle>
      
      {/* Introduction */}
      <Box sx={{ textAlign: 'center', mb: 5, maxWidth: '800px', mx: 'auto' }}>
        <Typography variant="body1" sx={{ color: '#34495e', fontSize: '1.1rem', mb: 3 }}>
          My professional journey includes working with diverse teams and technologies.
          Each experience has contributed to my growth as a developer and problem solver.
        </Typography>
      </Box>
      
      {/* Category filter */}
      <CategoryFilter 
        selectedCategory={selectedCategory} 
        onCategoryChange={handleCategoryChange} 
      />
      
      {/* Statistics Section */}
      <StatisticsSection experiences={experiences} />
      
      {/* Experiences Timeline */}
      <Timeline experiences={filteredExperiences} />
      
      {/* Call to Action */}
      <CallToAction />
    </Container>
  );
}

export default Experience;