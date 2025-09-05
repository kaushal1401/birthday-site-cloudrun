import React from 'react';
import { CssBaseline, ThemeProvider, createTheme } from '@mui/material';
import { Box, Typography, Alert } from '@mui/material';
import { isDemoMode } from './firebase';
import EventTimer from './components/EventTimer';
import RSVPForm from './components/RSVPForm';

const simpleTheme = createTheme({
  palette: {
    primary: { main: '#FF6B9D' }
  }
});

function App() {
  console.log('App component rendering...');
  console.log('Demo mode:', isDemoMode);
  
  const showNotification = (message, severity = 'success') => {
    console.log('Notification:', message, severity);
  };
  
  return (
    <ThemeProvider theme={simpleTheme}>
      <CssBaseline />
      <Box sx={{ 
        minHeight: '100vh',
        background: 'linear-gradient(135deg, #FFE5F1 0%, #E8F8F5 50%, #FFF9E7 100%)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        flexDirection: 'column',
        gap: 3,
        p: 2
      }}>
        <Typography variant="h2" component="h1" sx={{ textAlign: 'center', color: 'primary.main' }}>
          🎂 Testing RSVP Component 🎉
        </Typography>
        
        <Alert severity={isDemoMode ? "warning" : "success"}>
          {isDemoMode ? "🎈 Running in Demo Mode" : "✅ Firebase Connected"}
        </Alert>
        
        <Box sx={{ border: '2px dashed #FF6B9D', p: 3, borderRadius: 2, bgcolor: 'rgba(255,255,255,0.8)', width: '100%', maxWidth: 600 }}>
          <Typography variant="h6" gutterBottom>RSVPForm Component Test:</Typography>
          <RSVPForm onSuccess={showNotification} />
        </Box>
      </Box>
    </ThemeProvider>
  );
}

export default App;
