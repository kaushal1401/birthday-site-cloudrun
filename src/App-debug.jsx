import React from 'react';
import { CssBaseline, ThemeProvider, createTheme } from '@mui/material';
import { Box, Typography, Alert } from '@mui/material';

const simpleTheme = createTheme({
  palette: {
    primary: { main: '#FF6B9D' }
  }
});

function App() {
  console.log('App component rendering...');
  
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
          🎂 Birthday Site Debug Mode 🎉
        </Typography>
        
        <Alert severity="success">
          ✅ App is loading successfully! No runtime errors detected.
        </Alert>
        
        <Typography variant="body1">
          If you can see this message, the basic React app is working correctly.
        </Typography>
      </Box>
    </ThemeProvider>
  );
}

export default App;
