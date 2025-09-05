import React, { useState, useEffect } from 'react';
import { 
  Box, 
  Typography, 
  CircularProgress,
  Container,
  Paper,
  IconButton,
  Card,
  CardMedia,
  Chip,
  Tabs,
  Tab,
  Grid,
  Fade
} from '@mui/material';
import {
  Favorite,
  FavoriteBorder,
  NavigateBefore,
  NavigateNext,
  PhotoCamera as PhotoIcon
} from '@mui/icons-material';
import { getPhotos, togglePhotoLike } from '../services/photoService';
import { GCS_CONFIG } from '../config/gcsConfig';

const BestPhotos = () => {
  const [currentCategoryIndex, setCurrentCategoryIndex] = useState(0);
  const [categoriesData, setCategoriesData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [likes, setLikes] = useState({});
  const [error, setError] = useState(null);

  const categories = GCS_CONFIG.photoStructure.bestPhotos.categories;

  useEffect(() => {
    const loadAllCategoriesData = async () => {
      try {
        setLoading(true);
        setError(null);
        const categoriesWithPhotos = [];
        
        // Load 2 photos for each category from GCS bucket
        for (const category of categories) {
          try {
            const categoryPhotos = await getPhotos('bestPhotos', category.name);
            
            categoriesWithPhotos.push({
              ...category,
              photos: categoryPhotos, // Will include placeholders if no real photos found
              description: `Beautiful ${category.name.toLowerCase()} moments! ${category.emoji}`
            });
          } catch (error) {
            console.log(`Error loading ${category.name}:`, error);
            // Add category with placeholders on error
            categoriesWithPhotos.push({
              ...category,
              photos: [
                {
                  id: `${category.key}_placeholder_1`,
                  url: `https://via.placeholder.com/500x400/F0F8FF/667eea?text=${encodeURIComponent(`📸 ${category.name} Photo 1`)}`,
                  isPlaceholder: true
                },
                {
                  id: `${category.key}_placeholder_2`,
                  url: `https://via.placeholder.com/500x400/F0F8FF/667eea?text=${encodeURIComponent(`📸 ${category.name} Photo 2`)}`,
                  isPlaceholder: true
                }
              ],
              description: `Beautiful ${category.name.toLowerCase()} moments! ${category.emoji}`
            });
          }
        }
        
        setCategoriesData(categoriesWithPhotos);
        console.log(`Loaded data for ${categoriesWithPhotos.length} categories`);
      } catch (error) {
        console.error('Error loading best photos data:', error);
        setError('Unable to load best photos. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    loadAllCategoriesData();
  }, []);

  const handleTabChange = (event, newValue) => {
    setCurrentCategoryIndex(newValue);
  };

  const handlePreviousCategory = () => {
    setCurrentCategoryIndex(prev => prev === 0 ? categories.length - 1 : prev - 1);
  };

  const handleNextCategory = () => {
    setCurrentCategoryIndex(prev => prev === categories.length - 1 ? 0 : prev + 1);
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
            Loading best moments gallery... 📸
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

  const currentCategory = categoriesData[currentCategoryIndex];

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
          Best Moments Gallery
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
          Capturing the most precious memories! 📸✨
        </Typography>
      </Box>

      {/* Single Container with Slider */}
      <Paper
        elevation={12}
        sx={{
          borderRadius: 4,
          overflow: 'hidden',
          background: 'linear-gradient(135deg, #ffffff 0%, #f8f9ff 100%)',
          position: 'relative'
        }}
      >
        {/* Category Tabs */}
        <Paper 
          elevation={0}
          sx={{ 
            borderRadius: 0,
            background: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)'
          }}
        >
          <Tabs
            value={currentCategoryIndex}
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
                minWidth: { xs: 120, md: 160 },
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
            {categories.map((category, index) => (
              <Tab 
                key={category.key}
                label={`${category.emoji} ${category.name}`}
                icon={index === 0 ? <PhotoIcon /> : null}
                iconPosition="start"
              />
            ))}
          </Tabs>
        </Paper>

        {/* Navigation Arrows */}
        <IconButton
          onClick={handlePreviousCategory}
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
          onClick={handleNextCategory}
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

        {/* Current Category Display */}
        {currentCategory && (
          <>
            {/* Category Header */}
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
                {currentCategory.emoji} {currentCategory.name}
              </Typography>
              <Typography 
                variant="h6" 
                sx={{ 
                  fontFamily: '"Nunito", sans-serif',
                  fontWeight: 500,
                  opacity: 0.95
                }}
              >
                {currentCategory.description}
              </Typography>
            </Box>

            {/* Photos Grid for Current Category */}
            <Box sx={{ p: 4 }}>
              <Grid container spacing={4} justifyContent="center">
                {currentCategory.photos.map((photo, photoIndex) => (
                  <Grid item xs={12} md={6} key={`${currentCategory.key}_${photoIndex}`}>
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
                          alt={`${currentCategory.name} - Photo ${photoIndex + 1}`}
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
                            {currentCategory.name}
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
                Category {currentCategoryIndex + 1} of {categories.length}
              </Typography>
              <Box display="flex" justifyContent="center" gap={1}>
                {categories.map((_, index) => (
                  <Box
                    key={index}
                    sx={{
                      width: 8,
                      height: 8,
                      borderRadius: '50%',
                      backgroundColor: index === currentCategoryIndex ? '#ff6b9d' : '#ddd',
                      transition: 'all 0.3s ease',
                      cursor: 'pointer'
                    }}
                    onClick={() => setCurrentCategoryIndex(index)}
                  />
                ))}
              </Box>
            </Box>
          </>
        )}
      </Paper>
    </Container>
  );
};

export default BestPhotos;
