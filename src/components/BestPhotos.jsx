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
  PhotoCamera as PhotoIcon,
  Refresh as RefreshIcon
} from '@mui/icons-material';
import { getPhotos, togglePhotoLike, getPhotoLikes } from '../services/photoService';
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
                  url: `https://via.placeholder.com/500x400/F0F8FF/667eea?text=${encodeURIComponent(`📸 ${category.name}`)}`,
                  isPlaceholder: true
                },
                {
                  id: `${category.key}_placeholder_2`,
                  url: `https://via.placeholder.com/500x400/F0F8FF/667eea?text=${encodeURIComponent(`📸 ${category.name}`)}`,
                  isPlaceholder: true
                }
              ],
              description: `Beautiful ${category.name.toLowerCase()} moments! ${category.emoji}`
            });
          }
        }
        
        setCategoriesData(categoriesWithPhotos);
        
        // Load likes data for all photos
        const allPhotoUrls = categoriesWithPhotos.flatMap(category => 
          category.photos.map(photo => photo.url)
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
        console.log(`Loaded data for ${categoriesWithPhotos.length} categories with likes`);
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

  const refreshPhotos = async () => {
    console.log('🔄 Refreshing best photos...');
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
                  url: `https://via.placeholder.com/500x400/F0F8FF/667eea?text=${encodeURIComponent(`📸 ${category.name}`)}`,
                  isPlaceholder: true
                },
                {
                  id: `${category.key}_placeholder_2`,
                  url: `https://via.placeholder.com/500x400/F0F8FF/667eea?text=${encodeURIComponent(`📸 ${category.name}`)}`,
                  isPlaceholder: true
                }
              ],
              description: `Beautiful ${category.name.toLowerCase()} moments! ${category.emoji}`
            });
          }
        }
        
        setCategoriesData(categoriesWithPhotos);
        console.log(`✅ Refreshed data for ${categoriesWithPhotos.length} categories`);
      } catch (error) {
        console.error('Error refreshing best photos data:', error);
        setError('Unable to refresh best photos. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    await loadAllCategoriesData();
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
        
        {/* Refresh Button */}
        <IconButton
          onClick={refreshPhotos}
          disabled={loading}
          sx={{
            position: 'absolute',
            top: 0,
            right: 0,
            backgroundColor: 'rgba(255, 107, 157, 0.1)',
            color: '#ff6b9d',
            '&:hover': {
              backgroundColor: 'rgba(255, 107, 157, 0.2)',
              transform: 'scale(1.1)',
            },
            '&:disabled': {
              opacity: 0.5
            },
            transition: 'all 0.3s ease'
          }}
        >
          <RefreshIcon />
        </IconButton>
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
            left: { xs: 8, md: 16 },
            top: '50%',
            transform: 'translateY(-50%)',
            zIndex: 2,
            backgroundColor: 'rgba(255, 255, 255, 0.95)',
            boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
            minWidth: { xs: '48px', md: '48px' },
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
          aria-label="Previous category"
        >
          <NavigateBefore sx={{ color: '#ff6b9d', fontSize: { xs: 28, md: 30 } }} />
        </IconButton>
        
        <IconButton
          onClick={handleNextCategory}
          sx={{
            position: 'absolute',
            right: { xs: 8, md: 16 },
            top: '50%',
            transform: 'translateY(-50%)',
            zIndex: 2,
            backgroundColor: 'rgba(255, 255, 255, 0.95)',
            boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
            minWidth: { xs: '48px', md: '48px' },
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
          aria-label="Next category"
        >
          <NavigateNext sx={{ color: '#ff6b9d', fontSize: { xs: 28, md: 30 } }} />
        </IconButton>

        {/* Current Category Display */}
        {currentCategory && (
          <>
            {/* Category Header */}
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
                          alt={`${currentCategory.name} memory`}
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
                              border: '2px dashed #FF6B9D'
                            }}
                          >
                            <Typography
                              variant="body2"
                              sx={{
                                fontFamily: '"Nunito", sans-serif',
                                fontWeight: 600,
                                color: '#FF6B9D',
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
                              {photo.uploadPath || `best-photos/${currentCategory.key}/photo_${photoIndex + 1}.jpg`}
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
                            {currentCategory.name}
                          </Typography>
                          
                          <Box display="flex" alignItems="center" gap={1}>
                            <IconButton
                              size="small"
                              onClick={(e) => handleLike(photo.url, e)}
                              sx={{ 
                                color: 'white',
                                minWidth: { xs: '48px', sm: '40px' },
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
                              aria-label={`Like photo from ${currentCategory.name}`}
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
                Category {currentCategoryIndex + 1} of {categories.length}
              </Typography>
              <Box display="flex" justifyContent="center" gap={1}>
                {categories.map((_, index) => (
                  <Box
                    key={index}
                    sx={{
                      width: { xs: 12, md: 8 },
                      height: { xs: 12, md: 8 },
                      borderRadius: '50%',
                      backgroundColor: index === currentCategoryIndex ? '#ff6b9d' : '#ddd',
                      transition: 'all 0.3s ease',
                      cursor: 'pointer',
                      minWidth: { xs: '44px', md: '32px' },
                      minHeight: { xs: '44px', md: '32px' },
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      touchAction: 'manipulation',
                      WebkitTapHighlightColor: 'transparent',
                      '&:hover': {
                        backgroundColor: index === currentCategoryIndex ? '#ff5389' : '#ccc',
                        transform: 'scale(1.2)',
                      },
                      '&:active': {
                        transform: 'scale(0.9)',
                      }
                    }}
                    onClick={() => setCurrentCategoryIndex(index)}
                    role="button"
                    aria-label={`Go to category ${index + 1}: ${categories[index]?.name || ''}`}
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
