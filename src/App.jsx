import React, { useState } from 'react';
import { CssBaseline, ThemeProvider, createTheme } from '@mui/material';
import { Container, AppBar, Toolbar, Typography, Button, Box, Fab } from '@mui/material';
import { AdminPanelSettings as AdminIcon } from '@mui/icons-material';
import EventTimer from './components/EventTimer';
import RSVPForm from './components/RSVPForm';
import GuestMessageWall from './components/GuestMessageWall';
import AdminDashboard from './components/AdminDashboard';
import ButterflyAnimation from './components/ButterflyAnimation';

const darkTheme = createTheme({
  palette: {
    mode: 'dark',
    primary: {
      main: '#e91e63',
    },
    secondary: {
      main: '#009688',
    },
    background: {
      default: '#0a0a0a',
      paper: '#1e1e1e',
    },
  },
  typography: {
    fontFamily: '"Roboto", "Arial", sans-serif',
  },
});

function App() {
  const [currentView, setCurrentView] = useState('home');
  const [showAdmin, setShowAdmin] = useState(false);

  const renderContent = () => {
    if (showAdmin) {
      return <AdminDashboard />;
    }

    switch (currentView) {
      case 'home':
        return (
          <>
            <EventTimer />
            <RSVPForm />
          </>
        );
      case 'messages':
        return <GuestMessageWall />;
      default:
        return (
          <>
            <EventTimer />
            <RSVPForm />
          </>
        );
    }
  };

  return (
    <ThemeProvider theme={darkTheme}>
      <CssBaseline />
      <ButterflyAnimation count={4} />
      
      {/* Header */}
      <AppBar position="static" sx={{ background: 'linear-gradient(45deg, #e91e63 30%, #9c27b0 90%)' }}>
        <Toolbar>
          <Typography variant="h5" component="div" sx={{ flexGrow: 1, fontWeight: 'bold' }}>
            🎂 Baby's 1st Birthday Party 🎂
          </Typography>
          <Button 
            color="inherit" 
            onClick={() => { setCurrentView('home'); setShowAdmin(false); }}
            sx={{ mx: 1 }}
          >
            Home 🏠
          </Button>
          <Button 
            color="inherit" 
            onClick={() => { setCurrentView('messages'); setShowAdmin(false); }}
            sx={{ mx: 1 }}
          >
            Messages 💌
          </Button>
        </Toolbar>
      </AppBar>

      <Container maxWidth="lg" sx={{ py: 4, minHeight: '100vh' }}>
        {/* Hero Section */}
        {currentView === 'home' && !showAdmin && (
          <Box textAlign="center" sx={{ mb: 4 }}>
            <Typography variant="h2" component="h1" gutterBottom sx={{ 
              background: 'linear-gradient(45deg, #e91e63, #9c27b0, #009688)',
              backgroundClip: 'text',
              WebkitBackgroundClip: 'text',
              color: 'transparent',
              fontWeight: 'bold',
              mb: 2
            }}>
              🌟 September 24th, 2025 🌟
            </Typography>
            <Typography variant="h5" color="text.secondary" gutterBottom>
              Join us for a magical first birthday celebration!
            </Typography>
          </Box>
        )}

        {renderContent()}

        {/* Admin Access Button */}
        <Fab
          color="secondary"
          aria-label="admin"
          sx={{ position: 'fixed', bottom: 16, right: 16 }}
          onClick={() => setShowAdmin(!showAdmin)}
        >
          <AdminIcon />
        </Fab>
      </Container>

      {/* Footer */}
      <Box 
        component="footer" 
        sx={{ 
          py: 3, 
          px: 2, 
          mt: 'auto',
          backgroundColor: 'rgba(255, 255, 255, 0.05)',
          textAlign: 'center'
        }}
      >
        <Typography variant="body2" color="text.secondary">
          Made with ❤️ for our little one's special day | Powered by Firebase & Cloud Run
        </Typography>
      </Box>
    </ThemeProvider>
  );
}

export default App;