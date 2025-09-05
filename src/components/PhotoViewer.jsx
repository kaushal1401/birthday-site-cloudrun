import React, { useState } from 'react';
import {
  Dialog,
  DialogContent,
  IconButton,
  Box,
  Typography,
  Fade,
  useTheme,
  useMediaQuery
} from '@mui/material';
import {
  Close,
  NavigateBefore,
  NavigateNext,
  Favorite,
  FavoriteBorder
} from '@mui/icons-material';

const PhotoViewer = ({ 
  open, 
  onClose, 
  photos, 
  currentIndex, 
  onNavigate, 
  likes, 
  onLike 
}) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const [imageLoaded, setImageLoaded] = useState(false);

  if (!photos || photos.length === 0 || currentIndex < 0) return null;

  const currentPhoto = photos[currentIndex];
  const isFirstPhoto = currentIndex === 0;
  const isLastPhoto = currentIndex === photos.length - 1;

  const handlePrevious = () => {
    if (!isFirstPhoto) {
      setImageLoaded(false);
      onNavigate(currentIndex - 1);
    }
  };

  const handleNext = () => {
    if (!isLastPhoto) {
      setImageLoaded(false);
      onNavigate(currentIndex + 1);
    }
  };

  const handleLike = async (e) => {
    e.stopPropagation();
    if (onLike && currentPhoto) {
      await onLike(currentPhoto.url);
    }
  };

  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth={false}
      fullScreen={isMobile}
      PaperProps={{
        sx: {
          backgroundColor: 'rgba(0, 0, 0, 0.95)',
          backgroundImage: 'none',
          maxWidth: isMobile ? '100%' : '90vw',
          maxHeight: isMobile ? '100%' : '90vh',
          margin: isMobile ? 0 : 2
        }
      }}
    >
      <DialogContent
        sx={{
          position: 'relative',
          padding: 0,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          minHeight: isMobile ? '100vh' : '80vh',
          overflow: 'hidden'
        }}
      >
        {/* Close Button */}
        <IconButton
          onClick={onClose}
          sx={{
            position: 'absolute',
            top: 16,
            right: 16,
            zIndex: 1000,
            backgroundColor: 'rgba(255, 255, 255, 0.1)',
            color: 'white',
            '&:hover': {
              backgroundColor: 'rgba(255, 255, 255, 0.2)',
            }
          }}
        >
          <Close />
        </IconButton>

        {/* Photo Info */}
        <Box
          sx={{
            position: 'absolute',
            top: 16,
            left: 16,
            zIndex: 1000,
            color: 'white'
          }}
        >
          <Typography variant="h6" sx={{ fontWeight: 'bold', mb: 1 }}>
            {currentPhoto.month || currentPhoto.category}
          </Typography>
          <Typography variant="body2" sx={{ opacity: 0.8 }}>
            {currentIndex + 1} of {photos.length}
          </Typography>
        </Box>

        {/* Like Button */}
        <Box
          sx={{
            position: 'absolute',
            bottom: 16,
            right: 16,
            zIndex: 1000,
            display: 'flex',
            alignItems: 'center',
            gap: 1,
            backgroundColor: 'rgba(0, 0, 0, 0.5)',
            borderRadius: 3,
            padding: 1
          }}
        >
          <IconButton
            onClick={handleLike}
            sx={{
              color: 'white',
              '&:hover': {
                transform: 'scale(1.2)',
              }
            }}
          >
            {likes[currentPhoto.url] > 0 ? (
              <Favorite sx={{ color: '#e91e63' }} />
            ) : (
              <FavoriteBorder />
            )}
          </IconButton>
          <Typography variant="body1" sx={{ color: 'white', fontWeight: 'bold' }}>
            {likes[currentPhoto.url] || 0} ❤️
          </Typography>
        </Box>

        {/* Previous Button */}
        {!isFirstPhoto && (
          <IconButton
            onClick={handlePrevious}
            sx={{
              position: 'absolute',
              left: 16,
              top: '50%',
              transform: 'translateY(-50%)',
              zIndex: 1000,
              backgroundColor: 'rgba(255, 255, 255, 0.1)',
              color: 'white',
              width: 56,
              height: 56,
              '&:hover': {
                backgroundColor: 'rgba(255, 255, 255, 0.2)',
                transform: 'translateY(-50%) scale(1.1)',
              }
            }}
          >
            <NavigateBefore sx={{ fontSize: 32 }} />
          </IconButton>
        )}

        {/* Next Button */}
        {!isLastPhoto && (
          <IconButton
            onClick={handleNext}
            sx={{
              position: 'absolute',
              right: 16,
              top: '50%',
              transform: 'translateY(-50%)',
              zIndex: 1000,
              backgroundColor: 'rgba(255, 255, 255, 0.1)',
              color: 'white',
              width: 56,
              height: 56,
              '&:hover': {
                backgroundColor: 'rgba(255, 255, 255, 0.2)',
                transform: 'translateY(-50%) scale(1.1)',
              }
            }}
          >
            <NavigateNext sx={{ fontSize: 32 }} />
          </IconButton>
        )}

        {/* Main Photo */}
        <Fade in={imageLoaded} timeout={300}>
          <Box
            sx={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              width: '100%',
              height: '100%',
              padding: isMobile ? 2 : 4
            }}
          >
            <img
              src={currentPhoto.url}
              alt={currentPhoto.alt || 'Photo'}
              onLoad={() => setImageLoaded(true)}
              style={{
                maxWidth: '100%',
                maxHeight: '100%',
                objectFit: 'contain',
                borderRadius: 8,
                boxShadow: '0 8px 32px rgba(0, 0, 0, 0.3)'
              }}
            />
          </Box>
        </Fade>

        {/* Loading indicator */}
        {!imageLoaded && (
          <Box
            sx={{
              position: 'absolute',
              top: '50%',
              left: '50%',
              transform: 'translate(-50%, -50%)',
              color: 'white'
            }}
          >
            <Typography>Loading...</Typography>
          </Box>
        )}
      </DialogContent>
    </Dialog>
  );
};

export default PhotoViewer;
