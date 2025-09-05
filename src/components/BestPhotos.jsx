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
  Grid,
  Fade
} from '@mui/material';
import {
  Favorite,
  FavoriteBorder,
  Refresh as RefreshIcon
} from '@mui/icons-material';
import { getPhotos, togglePhotoLike, getPhotoLikes } from '../services/photoService';
import { GCS_CONFIG } from '../config/gcsConfig';
import PhotoViewer from './PhotoViewer';

const BestPhotos = () => {
  const [categoriesData, setCategoriesData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [likes, setLikes] = useState({});
  const [error, setError] = useState(null);
  const [photoViewerOpen, setPhotoViewerOpen] = useState(false);
  const [selectedPhotoIndex, setSelectedPhotoIndex] = useState(0);

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
            try {
              const photoLikes = await getPhotoLikes(photoUrl);
              likesData[photoUrl] = photoLikes.totalLikes;
            } catch (error) {
              console.log(`Error loading likes for ${photoUrl}:`, error);
              // Initialize with 0 for all photos, including placeholders
              likesData[photoUrl] = 0;
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
  }, [categories]);

  const handleLike = async (photoUrl, event) => {
    if (event) {
      event.stopPropagation();
    }
    
    console.log('💖 Like button clicked for photo:', photoUrl);
    
    // Check if this is a placeholder photo
    if (photoUrl.includes('placeholder') || photoUrl.includes('via.placeholder.com')) {
      console.log('📸 This is a placeholder photo - likes are allowed');
    }
    
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
      // Set a default like count if there's an error
      setLikes(prev => ({
        ...prev,
        [photoUrl]: (prev[photoUrl] || 0) + 1
      }));
    }
  };

  const handlePhotoClick = (photoIndex) => {
    setSelectedPhotoIndex(photoIndex);
    setPhotoViewerOpen(true);
  };

  const handlePhotoViewerNavigate = (newIndex) => {
    setSelectedPhotoIndex(newIndex);
  };

  const handlePhotoViewerClose = () => {
    setPhotoViewerOpen(false);
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
        {/* Family Moments Header - No tabs needed since we only have one category */}
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
            👨‍👩‍👧 Family Moments
          </Typography>
          <Typography 
            variant="h6" 
            sx={{ 
              fontFamily: '"Nunito", sans-serif',
              fontWeight: 500,
              opacity: 0.95
            }}
          >
            Beautiful family moments! 👨‍👩‍👧
          </Typography>
        </Box>

        {/* Photos Grid for Family Moments */}
        <Box sx={{ p: 4 }}>
          <Grid container spacing={4} justifyContent="center">
            {categoriesData[0]?.photos?.map((photo, photoIndex) => (
                  <Grid item xs={12} sm={6} md={4} key={`family_moments_${photoIndex}`}>
                    <Fade in={true} timeout={500 + photoIndex * 200}>
                      <Card
                        elevation={8}
                        onClick={() => handlePhotoClick(photoIndex)}
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
                        {/* Photo Number Badge - Only show for placeholders */}
                        {photo.isPlaceholder && (
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
                        )}

                        {/* Photo */}
                        <CardMedia
                          component="img"
                          image={photo.url}
                          alt="Family Moments memory"
                          sx={{
                            height: { xs: 280, sm: 350, md: 400 }, // Responsive height
                            width: '100%',
                            objectFit: 'contain', // Changed from 'cover' to 'contain' to show full photo
                            objectPosition: 'center',
                            backgroundColor: '#f5f5f5', // Add background color for letterboxing
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
                              {photo.uploadPath || `best-photos/family_moments/photo_${photoIndex + 1}.jpg`}
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
                              aria-label="Like photo from Family Moments"
                            >
                              {likes[photo.url] > 0 ? (
                                <Favorite sx={{ color: '#e91e63' }} />
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

            {/* Photo Viewer Modal */}
            {categoriesData[0]?.photos && (
              <PhotoViewer
                open={photoViewerOpen}
                onClose={handlePhotoViewerClose}
                photos={categoriesData[0].photos}
                currentIndex={selectedPhotoIndex}
                onNavigate={handlePhotoViewerNavigate}
                likes={likes}
                onLike={handleLike}
              />
            )}
          </Paper>
        </Container>
      );
    };

    export default BestPhotos;
