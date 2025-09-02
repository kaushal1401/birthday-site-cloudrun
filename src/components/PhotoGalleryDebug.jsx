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

// Test Firebase imports one by one
let firebaseImportError = null;
let storageImportError = null;
let isDemoMode = true;
let storage = null;
let STORAGE_PATHS = null;

try {
  const { isDemoMode: demo } = require('../firebase');
  isDemoMode = demo;
  console.log('✅ Firebase isDemoMode imported successfully:', isDemoMode);
} catch (error) {
  firebaseImportError = error;
  console.error('❌ Error importing isDemoMode:', error);
}

try {
  const { storage: stor, STORAGE_PATHS: paths } = require('../firebase');
  storage = stor;
  STORAGE_PATHS = paths;
  console.log('✅ Firebase storage imported successfully:', !!storage);
  console.log('✅ STORAGE_PATHS imported successfully:', STORAGE_PATHS);
} catch (error) {
  storageImportError = error;
  console.error('❌ Error importing storage:', error);
}

try {
  const { ref, listAll, getDownloadURL } = require('firebase/storage');
  console.log('✅ Firebase Storage functions imported successfully');
} catch (error) {
  console.error('❌ Error importing Firebase Storage functions:', error);
}

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

const PhotoGalleryDebug = () => {
  const [photos, setPhotos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [debugInfo, setDebugInfo] = useState({});

  useEffect(() => {
    console.log('PhotoGallery Debug component mounting...');
    
    // Collect debug information
    const debug = {
      isDemoMode,
      hasStorage: !!storage,
      hasStoragePaths: !!STORAGE_PATHS,
      firebaseImportError: firebaseImportError?.message,
      storageImportError: storageImportError?.message
    };
    
    setDebugInfo(debug);
    console.log('Debug Info:', debug);
    
    // Load demo photos
    setTimeout(() => {
      setPhotos(demoPhotos);
      setLoading(false);
    }, 1000);
  }, []);

  if (loading) {
    return (
      <Box>
        <Typography variant="h4" gutterBottom>
          📸 PhotoGallery Debug - Loading...
        </Typography>
        <Skeleton variant="rectangular" height={200} />
      </Box>
    );
  }

  return (
    <Box>
      <Typography variant="h4" gutterBottom align="center">
        📸 PhotoGallery Debug Information
      </Typography>
      
      <Alert severity={firebaseImportError || storageImportError ? "error" : "info"} sx={{ mb: 2 }}>
        <Typography variant="h6">Debug Status:</Typography>
        <ul>
          <li>Demo Mode: {isDemoMode ? 'Yes' : 'No'}</li>
          <li>Storage Available: {debugInfo.hasStorage ? 'Yes' : 'No'}</li>
          <li>Storage Paths Available: {debugInfo.hasStoragePaths ? 'Yes' : 'No'}</li>
          {debugInfo.firebaseImportError && <li>Firebase Import Error: {debugInfo.firebaseImportError}</li>}
          {debugInfo.storageImportError && <li>Storage Import Error: {debugInfo.storageImportError}</li>}
        </ul>
      </Alert>

      <Typography variant="h5" gutterBottom>
        Demo Photos ({photos.length} loaded):
      </Typography>

      <Grid container spacing={2}>
        {photos.map((photo) => (
          <Grid item xs={12} sm={6} md={4} key={photo.id}>
            <Card>
              <CardMedia
                component="img"
                height="200"
                image={photo.url}
                alt={photo.title}
              />
              <CardContent>
                <Typography variant="h6">{photo.title}</Typography>
                <Typography variant="body2">{photo.description}</Typography>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>
    </Box>
  );
};

export default PhotoGalleryDebug;
