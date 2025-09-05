import React, { useState, useEffect } from 'react';
import { 
  Box, 
  Typography, 
  Container,
  CircularProgress,
  Card,
  CardMedia,
  IconButton,
  Tabs,
  Tab,
  Paper,
  Chip,
  Grid,
  Fade
} from '@mui/material';
import {
  Favorite,
  FavoriteBorder,
  NavigateBefore,
  NavigateNext,
  ChildCare as BabyIcon
} from '@mui/icons-material';
import { getPhotos, togglePhotoLike } from '../services/photoService';
import { GCS_CONFIG } from '../config/gcsConfig';

const BabyJourney = () => {
  const [currentMonthIndex, setCurrentMonthIndex] = useState(0);
  const [monthsData, setMonthsData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [likes, setLikes] = useState({});
  const [error, setError] = useState(null);

  const months = GCS_CONFIG.photoStructure.babyJourney.months;

  useEffect(() => {
    const loadAllMonthsData = async () => {
      try {
        setLoading(true);
        setError(null);
        const monthsWithPhotos = [];
        
        for (const month of months) {
          try {
            const monthPhotos = await getPhotos('babyJourney', month.name);
            monthsWithPhotos.push({
              ...month,
              photos: monthPhotos,
              description: `${month.name === 'Newborn' ? 'Our precious little one arrives! 👶' : `Month ${month.name.split(' ')[1]} - Growing stronger every day! 💪`}`
            });
          } catch (error) {
            console.log(`Error loading ${month.name}:`, error);
            // Add month with placeholders on error
            monthsWithPhotos.push({
              ...month,
              photos: [
                {
                  id: `${month.key}_placeholder_1`,
                  url: `https://via.placeholder.com/500x400/FFE5F1/FF6B9D?text=${encodeURIComponent(`📸 ${month.name} Photo 1`)}`,
                  isPlaceholder: true
                },
                {
                  id: `${month.key}_placeholder_2`,
                  url: `https://via.placeholder.com/500x400/FFE5F1/FF6B9D?text=${encodeURIComponent(`📸 ${month.name} Photo 2`)}`,
                  isPlaceholder: true
                }
              ],
              description: `${month.name === 'Newborn' ? 'Our precious little one arrives! 👶' : `Month ${month.name.split(' ')[1]} - Growing stronger every day! 💪`}`
            });
          }
        }
        
        setMonthsData(monthsWithPhotos);
        console.log(`Loaded data for ${monthsWithPhotos.length} months`);
      } catch (error) {
        console.error('Error loading baby journey data:', error);
        setError('Unable to load baby journey photos. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    loadAllMonthsData();
  }, []);

  const handleTabChange = (event, newValue) => {
    setCurrentMonthIndex(newValue);
  };

  const handlePreviousMonth = () => {
    setCurrentMonthIndex(prev => prev === 0 ? months.length - 1 : prev - 1);
  };

  const handleNextMonth = () => {
    setCurrentMonthIndex(prev => prev === months.length - 1 ? 0 : prev + 1);
  };

  const handleLike = async (photoUrl, event) => {
    if (event) {
      event.stopPropagation();
    }
    
    try {
      const newLikeCount = await togglePhotoLike(photoUrl);
      setLikes(prev => ({
        ...prev,
        [photoUrl]: newLikeCount
      }));
    } catch (error) {
      console.error('Error toggling like:', error);
    }
  };

  if (loading) {
    return (
      <Container maxWidth="lg" sx={{ py: 8 }}>
        <Box display="flex" flexDirection="column" alignItems="center" minHeight={400}>
          <CircularProgress size={60} sx={{ color: '#ff6b9d', mb: 3 }} />
          <Typography variant="h6" sx={{ color: '#666', fontFamily: '"Nunito", sans-serif', fontWeight: 600 }}>
            Loading baby's precious journey... 👶✨
          </Typography>
        </Box>
      </Container>
    );
  }

  if (error) {
    return (
      <Container maxWidth="lg" sx={{ py: 8 }}>
        <Box display="flex" flexDirection="column" alignItems="center" minHeight={400}>
          <Typography variant="h6" sx={{ color: '#f44336', fontFamily: '"Nunito", sans-serif', fontWeight: 600, mb: 2 }}>
            {error}
          </Typography>
          <Typography variant="body2" sx={{ color: '#666', fontFamily: '"Nunito", sans-serif' }}>
            Photos will be loaded from GCS bucket when available.
          </Typography>
        </Box>
      </Container>
    );
  }

  const currentMonth = monthsData[currentMonthIndex];

  return (
    <Container maxWidth="lg" sx={{ py: 8 }}>
      {/* Header */}
      <Box textAlign="center" mb={6}>
        <Typography 
          variant="h2" 
          component="h2" 
          sx={{ 
            fontFamily: '"Poppins", sans-serif',
            fontWeight: 800,
            background: 'linear-gradient(45deg, #ff6b9d, #c44569, #f8b500)',
            backgroundClip: 'text',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            mb: 2,
            fontSize: { xs: '2.5rem', md: '3.5rem' },
            letterSpacing: '-0.02em'
          }}
        >
          Baby's First Year Journey
        </Typography>
        <Typography 
          variant="h6" 
          sx={{ 
            color: '#666',
            fontFamily: '"Nunito", sans-serif',
            fontWeight: 500,
            fontSize: { xs: '1rem', md: '1.2rem' }
          }}
        >
          Watch our little princess grow month by month! 👶💕
        </Typography>
      </Box>

      {/* Month Tabs */}
      <Paper 
        elevation={8}
        sx={{ 
          mb: 4,
          borderRadius: 4,
          overflow: 'hidden',
          background: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)'
        }}
      >
        <Tabs
          value={currentMonthIndex}
          onChange={handleTabChange}
          variant="scrollable"
          scrollButtons="auto"
          sx={{
            '& .MuiTabs-flexContainer': {
              justifyContent: 'center'
            },
            '& .MuiTab-root': {
              fontFamily: '"Poppins", sans-serif',
              fontWeight: 600,
              fontSize: { xs: '0.8rem', md: '1rem' },
              color: 'rgba(255, 255, 255, 0.8)',
              minWidth: { xs: 80, md: 120 },
              '&.Mui-selected': {
                color: 'white',
                fontWeight: 700
              }
            },
            '& .MuiTabs-indicator': {
              backgroundColor: 'white',
              height: 3,
              borderRadius: '3px 3px 0 0'
            },
            backgroundColor: 'transparent'
          }}
        >
          {months.map((month, index) => (
            <Tab 
              key={month.key}
              label={month.name}
              icon={index === 0 ? <BabyIcon /> : null}
              iconPosition="start"
            />
          ))}
        </Tabs>
      </Paper>

      {/* Current Month Display */}
      {currentMonth && (
        <Paper
          elevation={12}
          sx={{
            borderRadius: 4,
            overflow: 'hidden',
            background: 'linear-gradient(135deg, #ffffff 0%, #f8f9ff 100%)',
            position: 'relative'
          }}
        >
          {/* Navigation Arrows */}
          <IconButton
            onClick={handlePreviousMonth}
            sx={{
              position: 'absolute',
              left: 16,
              top: '50%',
              transform: 'translateY(-50%)',
              zIndex: 2,
              backgroundColor: 'rgba(255, 255, 255, 0.95)',
              boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
              '&:hover': {
                backgroundColor: 'white',
                transform: 'translateY(-50%) scale(1.1)',
              },
              transition: 'all 0.3s ease'
            }}
          >
            <NavigateBefore sx={{ color: '#ff6b9d', fontSize: 30 }} />
          </IconButton>
          
          <IconButton
            onClick={handleNextMonth}
            sx={{
              position: 'absolute',
              right: 16,
              top: '50%',
              transform: 'translateY(-50%)',
              zIndex: 2,
              backgroundColor: 'rgba(255, 255, 255, 0.95)',
              boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
              '&:hover': {
                backgroundColor: 'white',
                transform: 'translateY(-50%) scale(1.1)',
              },
              transition: 'all 0.3s ease'
            }}
          >
            <NavigateNext sx={{ color: '#ff6b9d', fontSize: 30 }} />
          </IconButton>

          {/* Month Header */}
          <Box 
            sx={{ 
              p: 4, 
              textAlign: 'center',
              background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
              color: 'white'
            }}
          >
            <Typography 
              variant="h3" 
              sx={{ 
                fontFamily: '"Poppins", sans-serif',
                fontWeight: 700,
                mb: 1,
                fontSize: { xs: '2rem', md: '2.8rem' }
              }}
            >
              {currentMonth.name}
            </Typography>
            <Typography 
              variant="h6" 
              sx={{ 
                fontFamily: '"Nunito", sans-serif',
                fontWeight: 500,
                opacity: 0.95
              }}
            >
              {currentMonth.description}
            </Typography>
          </Box>

          {/* Photos Grid */}
          <Box sx={{ p: 4 }}>
            <Grid container spacing={4} justifyContent="center">
              {currentMonth.photos.map((photo, photoIndex) => (
                <Grid item xs={12} md={6} key={`${currentMonth.key}_${photoIndex}`}>
                  <Fade in={true} timeout={500 + photoIndex * 200}>
                    <Card
                      elevation={8}
                      sx={{
                        borderRadius: 3,
                        overflow: 'hidden',
                        cursor: 'pointer',
                        transition: 'all 0.3s ease',
                        height: 400,
                        position: 'relative',
                        '&:hover': {
                          transform: 'translateY(-8px)',
                          boxShadow: '0 20px 40px rgba(0,0,0,0.2)',
                        }
                      }}
                    >
                      {/* Photo Number Badge */}
                      <Chip
                        label={`Photo ${photoIndex + 1}`}
                        sx={{
                          position: 'absolute',
                          top: 16,
                          left: 16,
                          zIndex: 1,
                          backgroundColor: 'rgba(255, 255, 255, 0.95)',
                          color: '#ff6b9d',
                          fontWeight: 700,
                          fontFamily: '"Poppins", sans-serif',
                          fontSize: '0.9rem'
                        }}
                      />

                      {/* Photo */}
                      <CardMedia
                        component="img"
                        image={photo.url}
                        alt={`${currentMonth.name} - Photo ${photoIndex + 1}`}
                        sx={{
                          height: 320,
                          objectFit: 'cover',
                          filter: photo.isPlaceholder ? 'none' : 'brightness(1.1) contrast(1.05)',
                        }}
                      />

                      {/* Like Section */}
                      <Box
                        sx={{
                          position: 'absolute',
                          bottom: 0,
                          left: 0,
                          right: 0,
                          height: '80px',
                          background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                          p: 3,
                          display: 'flex',
                          justifyContent: 'space-between',
                          alignItems: 'center',
                          color: 'white'
                        }}
                      >
                        <Typography
                          variant="h6"
                          sx={{
                            fontFamily: '"Poppins", sans-serif',
                            fontWeight: 600
                          }}
                        >
                          {currentMonth.name}
                        </Typography>
                        
                        <Box display="flex" alignItems="center" gap={1}>
                          <IconButton
                            size="small"
                            onClick={(e) => handleLike(photo.url, e)}
                            sx={{ 
                              color: 'white',
                              '&:hover': {
                                backgroundColor: 'rgba(255, 255, 255, 0.1)',
                                transform: 'scale(1.2)',
                              },
                              transition: 'all 0.3s ease'
                            }}
                          >
                            {likes[photo.url] > 0 ? (
                              <Favorite sx={{ color: '#ff6b9d' }} />
                            ) : (
                              <FavoriteBorder />
                            )}
                          </IconButton>
                          <Typography 
                            variant="body1" 
                            sx={{ 
                              fontFamily: '"Nunito", sans-serif',
                              fontWeight: 600
                            }}
                          >
                            {likes[photo.url] || 0}
                          </Typography>
                        </Box>
                      </Box>
                    </Card>
                  </Fade>
                </Grid>
              ))}
            </Grid>
          </Box>

          {/* Progress Indicator */}
          <Box sx={{ textAlign: 'center', pb: 3 }}>
            <Typography variant="body2" sx={{ color: '#999', fontFamily: '"Nunito", sans-serif', mb: 2 }}>
              Month {currentMonthIndex + 1} of {months.length}
            </Typography>
            <Box display="flex" justifyContent="center" gap={1}>
              {months.map((_, index) => (
                <Box
                  key={index}
                  sx={{
                    width: 8,
                    height: 8,
                    borderRadius: '50%',
                    backgroundColor: index === currentMonthIndex ? '#ff6b9d' : '#ddd',
                    transition: 'all 0.3s ease',
                    cursor: 'pointer'
                  }}
                  onClick={() => setCurrentMonthIndex(index)}
                />
              ))}
            </Box>
          </Box>
        </Paper>
      )}
    </Container>
  );
};

export default BabyJourney;
