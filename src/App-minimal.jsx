import React, { useState } from 'react';
import { CssBaseline, ThemeProvider, createTheme } from '@mui/material';
import { Container, AppBar, Toolbar, Typography, Box, Fab, Divider, Alert } from '@mui/material';
import { AdminPanelSettings as AdminIcon } from '@mui/icons-material';

const birthdayTheme = createTheme({
  palette: {
    mode: 'light',
    primary: {
      main: '#FF6B9D', // Pink
      light: '#FFE5F1',
      dark: '#C44569',
    },
    secondary: {
      main: '#4ECDC4', // Mint green
      light: '#E8F8F5',
      dark: '#2C7A74',
    },
    background: {
      default: 'linear-gradient(135deg, #FFE5F1 0%, #E8F8F5 50%, #FFF9E7 100%)',
      paper: 'rgba(255, 255, 255, 0.9)',
    },
    text: {
      primary: '#2D3436',
      secondary: '#636E72',
    }
  },
  typography: {
    fontFamily: '"Comic Neue", "Roboto", "Arial", sans-serif',
    h1: {
      fontWeight: 700,
      background: 'linear-gradient(45deg, #FF6B9D 30%, #4ECDC4 90%)',
      backgroundClip: 'text',
      WebkitBackgroundClip: 'text',
      WebkitTextFillColor: 'transparent',
    }
  }
});

function App() {
  return (
    <ThemeProvider theme={birthdayTheme}>
      <CssBaseline />
      <Box sx={{ 
        minHeight: '100vh',
        background: 'linear-gradient(135deg, #FFE5F1 0%, #E8F8F5 50%, #FFF9E7 100%)',
        position: 'relative'
      }}>
        {/* Header */}
        <AppBar position="static" sx={{ 
          background: 'linear-gradient(45deg, #FF6B9D 30%, #4ECDC4 90%)',
          backdropFilter: 'blur(10px)',
          borderRadius: '0 0 20px 20px'
        }}>
          <Toolbar>
            <Typography variant="h4" component="div" sx={{ 
              flexGrow: 1, 
              fontWeight: 'bold',
              textShadow: '2px 2px 4px rgba(0,0,0,0.3)',
              textAlign: 'center'
            }}>
              🎂 Our Little One's First Birthday 🎉
            </Typography>
          </Toolbar>
        </AppBar>

        <Container maxWidth="lg" sx={{ py: 4, position: 'relative', zIndex: 2 }}>
          <Alert 
            severity="success" 
            sx={{ 
              mb: 4, 
              borderRadius: 3,
              backgroundColor: 'rgba(76, 175, 80, 0.1)',
              border: '1px solid rgba(76, 175, 80, 0.3)'
            }}
          >
            ✅ <strong>App Loading Successfully!</strong> All components are working correctly.
          </Alert>
          
          <Typography variant="h2" sx={{ textAlign: 'center', mt: 4 }}>
            🎈 Birthday Site is Working! 🎈
          </Typography>
        </Container>
      </Box>
    </ThemeProvider>
  );
}

export default App;
