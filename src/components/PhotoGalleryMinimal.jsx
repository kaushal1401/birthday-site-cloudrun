import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Grid,
  Card,
  CardMedia,
  CardContent,
  Alert,
  Skeleton
} from '@mui/material';

// Demo photos for when Firebase Storage is not available
const demoPhotos = [
  {
    id: 'demo-1',
    url: 'https://via.placeholder.com/400x400/FFB6C1/FFFFFF?text=Month+1',
    month: 1,
    title: 'First Month',
    description: 'Welcome to the world!'
  },
  {
    id: 'demo-2', 
    url: 'https://via.placeholder.com/400x400/FFB6C1/FFFFFF?text=Month+2',
    month: 2,
    title: 'Second Month',
    description: 'Growing so fast!'
  },
  {
    id: 'demo-3',
    url: 'https://via.placeholder.com/400x400/FFB6C1/FFFFFF?text=Month+3', 
    month: 3,
    title: 'Third Month',
    description: 'Learning to smile!'
  }
];

const PhotoGalleryMinimal = () => {
  const [photos, setPhotos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    console.log('PhotoGallery component mounting...');
    
    try {
      // Test basic functionality
      setLoading(true);
      
      // Simulate loading photos
      setTimeout(() => {
        console.log('Loading demo photos...');
        setPhotos(demoPhotos);
        setLoading(false);
      }, 1000);
      
    } catch (err) {
      console.error('Error in PhotoGallery:', err);
      setError(err.message);
      setLoading(false);
    }
  }, []);

  console.log('PhotoGallery render:', { photos: photos.length, loading, error });

  if (error) {
    return (
      <Alert severity="error">
        Error in PhotoGallery: {error}
      </Alert>
    );
  }

  if (loading) {
    return (
      <Box>
        <Typography variant="h4" gutterBottom>
          📸 Baby's Journey - Loading...
        </Typography>
        <Grid container spacing={3}>
          {[1, 2, 3].map((index) => (
            <Grid item xs={12} sm={6} md={4} key={index}>
              <Card>
                <Skeleton variant="rectangular" height={300} />
                <CardContent>
                  <Skeleton variant="text" />
                  <Skeleton variant="text" />
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      </Box>
    );
  }

  return (
    <Box>
      <Typography variant="h4" gutterBottom align="center">
        📸 Baby's Journey Through 12 Months
      </Typography>
      
      <Alert severity="info" sx={{ mb: 2 }}>
        Minimal PhotoGallery Test - {photos.length} photos loaded
      </Alert>

      <Grid container spacing={3}>
        {photos.map((photo) => (
          <Grid item xs={12} sm={6} md={4} key={photo.id}>
            <Card sx={{ 
              cursor: 'pointer',
              transition: 'transform 0.2s',
              '&:hover': { transform: 'scale(1.05)' }
            }}>
              <CardMedia
                component="img"
                height="300"
                image={photo.url}
                alt={photo.title}
                onError={(e) => {
                  console.error('Image load error:', photo.url);
                  e.target.src = 'https://via.placeholder.com/400x400/FFB6C1/FFFFFF?text=Error';
                }}
              />
              <CardContent>
                <Typography variant="h6" component="h3">
                  {photo.title}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  {photo.description}
                </Typography>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>
    </Box>
  );
};

export default PhotoGalleryMinimal;
