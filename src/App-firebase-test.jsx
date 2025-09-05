import React from 'react';
import { CssBaseline, ThemeProvider, createTheme } from '@mui/material';
import { Box, Typography, Alert } from '@mui/material';
import { isDemoMode } from './firebase';

const simpleTheme = createTheme({
  palette: {
    primary: { main: '#FF6B9D' }
  }
});

function App() {
  console.log('App component rendering...');
  console.log('Demo mode:', isDemoMode);
  
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
        gap: 3
      }}>
        <Typography variant="h2" component="h1" sx={{ textAlign: 'center', color: 'primary.main' }}>
          🎂 Birthday Site - Testing Firebase 🎉
        </Typography>
        
        <Alert severity={isDemoMode ? "warning" : "success"}>
          {isDemoMode ? "🎈 Running in Demo Mode" : "✅ Firebase Connected"}
        </Alert>
        
        <Typography variant="body1">
          Firebase import test: {isDemoMode ? "Demo mode active" : "Live mode active"}
        </Typography>
      </Box>
    </ThemeProvider>
  );
}

export default App;
