import React from 'react';
import { CssBaseline, ThemeProvider, createTheme } from '@mui/material';
import { Box, Typography } from '@mui/material';

const testTheme = createTheme({
  palette: {
    mode: 'light',
    primary: {
      main: '#FF6B9D',
    }
  }
});

function TestApp() {
  return (
    <ThemeProvider theme={testTheme}>
      <CssBaseline />
      <Box sx={{ 
        minHeight: '100vh',
        background: 'linear-gradient(135deg, #FFE5F1 0%, #E8F8F5 50%, #FFF9E7 100%)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center'
      }}>
        <Typography variant="h2" component="h1" sx={{ textAlign: 'center' }}>
          🎂 Test App Loading Successfully 🎉
        </Typography>
      </Box>
    </ThemeProvider>
  );
}

export default TestApp;
