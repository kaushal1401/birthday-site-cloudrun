import React, { useState, useEffect, useMemo } from 'react';
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
import { getPhotos, togglePhotoLike, getPhotoLikes } from '../services/photoService';
import { GCS_CONFIG } from '../config/gcsConfig';
import { runFirebaseTest } from '../utils/firebaseTest';

const BabyJourney = () => {
  const [currentMonthIndex, setCurrentMonthIndex] = useState(0);
  const [monthsData, setMonthsData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [likes, setLikes] = useState({});
  const [error, setError] = useState(null);

  // Memoize months to prevent useEffect re-running
  const months = useMemo(() => 
    GCS_CONFIG.photoStructure.babyJourney.months.filter(month => month.name !== 'Newborn'),
    []
  );

  useEffect(() => {
    const loadAllMonthsData = async () => {
      try {
        setLoading(true);
        setError(null);
        const monthsWithPhotos = [];
        
        console.log('Loading data for months:', months.map(m => m.name));
        
        for (const month of months) {
          try {
            console.log(`Loading photos for ${month.name}`);
            const monthPhotos = await getPhotos('babyJourney', month.name);
            console.log(`Found ${monthPhotos.length} photos for ${month.name}`);
            
            monthsWithPhotos.push({
              ...month,
              photos: monthPhotos,
              description: `Month ${month.name.split(' ')[1]} - Growing stronger every day! 💪`
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
              description: `Month ${month.name.split(' ')[1]} - Growing stronger every day! 💪`
            });
          }
        }
        
        setMonthsData(monthsWithPhotos);
        
        // Load likes data for all photos
        const allPhotoUrls = monthsWithPhotos.flatMap(month => 
          month.photos.map(photo => photo.url)
        );
        
        const likesData = {};
        await Promise.all(
          allPhotoUrls.map(async (photoUrl) => {
            if (!photoUrl.includes('placeholder')) {
              try {
                const photoLikes = await getPhotoLikes(photoUrl);
                likesData[photoUrl] = photoLikes.totalLikes;
              } catch (error) {
                console.log(`Error loading likes for ${photoUrl}:`, error);
                likesData[photoUrl] = 0;
              }
            }
          })
        );
        
        setLikes(likesData);
        console.log(`Loaded data for ${monthsWithPhotos.length} months with likes`);
      } catch (error) {
        console.error('Error loading Kashvi journey data:', error);
        setError('Unable to load Kashvi journey photos. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    loadAllMonthsData();
  }, []); // Remove months dependency to prevent infinite loop

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
    
    console.log('💖 Like button clicked for photo:', photoUrl);
    
    try {
      const newLikeCount = await togglePhotoLike(photoUrl);
      console.log('📈 New like count received:', newLikeCount);
      
      setLikes(prev => ({
        ...prev,
        [photoUrl]: newLikeCount
      }));
      
      console.log('✅ Likes state updated successfully');
    } catch (error) {
      console.error('❌ Error toggling like:', error);
    }
  };

  if (loading) {
    return (
      <Container maxWidth="lg" sx={{ py: 8 }}>
        <Box display="flex" flexDirection="column" alignItems="center" minHeight={400}>
          <CircularProgress size={60} sx={{ color: '#ff6b9d', mb: 3 }} />
          <Typography variant="h6" sx={{ color: '#666', fontFamily: '"Nunito", sans-serif', fontWeight: 600 }}>
            Loading Kashvi's precious journey... 👶✨
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

  if (!monthsData || monthsData.length === 0) {
    return (
      <Container maxWidth="lg" sx={{ py: 8 }}>
        <Box display="flex" flexDirection="column" alignItems="center" minHeight={400}>
          <Typography variant="h6" sx={{ color: '#666', fontFamily: '"Nunito", sans-serif', fontWeight: 600 }}>
            No journey data available yet... 📸
          </Typography>
        </Box>
      </Container>
    );
  }

  const currentMonth = monthsData[currentMonthIndex];

  return (
    <Container maxWidth="lg" sx={{ py: 8 }}>
      {/* Header */}
      <Box textAlign="center" mb={6} position="relative">
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
          Kashvi's First Year Journey
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
              minHeight: { xs: '48px', md: '48px' }, // Ensure minimum touch target
              padding: { xs: '12px 16px', md: '12px 16px' },
              touchAction: 'manipulation',
              WebkitTapHighlightColor: 'transparent',
              '&.Mui-selected': {
                color: 'white',
                fontWeight: 700
              },
              '&:hover': {
                backgroundColor: 'rgba(255, 255, 255, 0.1)',
              },
              '&:active': {
                backgroundColor: 'rgba(255, 255, 255, 0.2)',
              },
              transition: 'all 0.2s ease'
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
              left: { xs: 8, md: 16 },
              top: '50%',
              transform: 'translateY(-50%)',
              zIndex: 2,
              backgroundColor: 'rgba(255, 255, 255, 0.95)',
              boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
              minWidth: { xs: '48px', md: '48px' }, // Ensure minimum touch target
              minHeight: { xs: '48px', md: '48px' },
              padding: { xs: '12px', md: '12px' },
              '&:hover': {
                backgroundColor: 'white',
                transform: 'translateY(-50%) scale(1.1)',
              },
              '&:active': {
                transform: 'translateY(-50%) scale(0.95)',
              },
              transition: 'all 0.2s ease',
              touchAction: 'manipulation',
              WebkitTapHighlightColor: 'transparent'
            }}
            aria-label="Previous month"
          >
            <NavigateBefore sx={{ color: '#ff6b9d', fontSize: { xs: 28, md: 30 } }} />
          </IconButton>
          
          <IconButton
            onClick={handleNextMonth}
            sx={{
              position: 'absolute',
              right: { xs: 8, md: 16 },
              top: '50%',
              transform: 'translateY(-50%)',
              zIndex: 2,
              backgroundColor: 'rgba(255, 255, 255, 0.95)',
              boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
              minWidth: { xs: '48px', md: '48px' }, // Ensure minimum touch target
              minHeight: { xs: '48px', md: '48px' },
              padding: { xs: '12px', md: '12px' },
              '&:hover': {
                backgroundColor: 'white',
                transform: 'translateY(-50%) scale(1.1)',
              },
              '&:active': {
                transform: 'translateY(-50%) scale(0.95)',
              },
              transition: 'all 0.2s ease',
              touchAction: 'manipulation',
              WebkitTapHighlightColor: 'transparent'
            }}
            aria-label="Next month"
          >
            <NavigateNext sx={{ color: '#ff6b9d', fontSize: { xs: 28, md: 30 } }} />
          </IconButton>

          {/* Month Header */}
          <Box 
            sx={{ 
              p: 4, 
              textAlign: 'center',
              background: 'linear-gradient(135deg, #FF6B9D 0%, #FF8E88 100%)',
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
                      {/* Photo - removed photo number badge for cleaner look */}
                      <CardMedia
                        component="img"
                        image={photo.url}
                        alt={`${currentMonth.name} memory`}
                        sx={{
                          height: { xs: 280, sm: 350, md: 400 }, // Responsive height
                          width: '100%',
                          objectFit: 'cover',
                          objectPosition: 'center',
                          filter: photo.isPlaceholder ? 'none' : 'brightness(1.05) contrast(1.02)',
                          opacity: photo.isPlaceholder ? 0.8 : 1,
                        }}
                      />

                      {/* Upload Instructions for Placeholders */}
                      {photo.isPlaceholder && (
                        <Box
                          sx={{
                            position: 'absolute',
                            top: '50%',
                            left: '50%',
                            transform: 'translate(-50%, -50%)',
                            textAlign: 'center',
                            backgroundColor: 'rgba(255, 255, 255, 0.95)',
                            borderRadius: 2,
                            p: 2,
                            boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
                            border: '2px dashed #ff6b9d'
                          }}
                        >
                          <Typography
                            variant="body2"
                            sx={{
                              fontFamily: '"Nunito", sans-serif',
                              fontWeight: 600,
                              color: '#ff6b9d',
                              mb: 1
                            }}
                          >
                            📸 Upload to GCS:
                          </Typography>
                          <Typography
                            variant="caption"
                            sx={{
                              fontFamily: '"Nunito", sans-serif',
                              color: '#666',
                              fontSize: '0.7rem'
                            }}
                          >
                            {photo.uploadPath || `baby-journey/${currentMonth.key}/photo_${photoIndex + 1}.jpg`}
                          </Typography>
                        </Box>
                      )}

                      {/* Like Section */}
                      <Box
                        sx={{
                          position: 'absolute',
                          bottom: 0,
                          left: 0,
                          right: 0,
                          height: '80px',
                          background: 'linear-gradient(135deg, #FF6B9D 0%, #FF8E88 100%)',
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
                              minWidth: { xs: '48px', sm: '40px' }, // Larger touch target on mobile
                              minHeight: { xs: '48px', sm: '40px' },
                              padding: { xs: '12px', sm: '8px' },
                              '&:hover': {
                                backgroundColor: 'rgba(255, 255, 255, 0.1)',
                                transform: 'scale(1.2)',
                              },
                              '&:active': {
                                transform: 'scale(0.95)',
                                backgroundColor: 'rgba(255, 255, 255, 0.2)',
                              },
                              transition: 'all 0.2s ease',
                              touchAction: 'manipulation',
                              WebkitTapHighlightColor: 'transparent'
                            }}
                            aria-label={`Like photo from ${currentMonth.name}`}
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
                              fontWeight: 600,
                              display: 'flex',
                              alignItems: 'center',
                              gap: 0.5
                            }}
                          >
                            {likes[photo.url] || 0} ❤️
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
