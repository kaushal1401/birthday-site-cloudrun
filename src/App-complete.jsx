import React, { useState, useEffect } from 'react';
import { 
  Box, 
  Container, 
  Typography, 
  AppBar, 
  Toolbar, 
  Button,
  CssBaseline,
  ThemeProvider,
  createTheme,
  Alert,
  Snackbar,
  Fade
} from '@mui/material';
import ButterflyAnimation from './components/ButterflyAnimation';
import EventTimer from './components/EventTimer';
import RSVPForm from './components/RSVPForm';
import GuestMessageWall from './components/GuestMessageWall';
import AdminDashboard from './components/AdminDashboard';
import PhotoGallery from './components/PhotoGallery';
import { isDemoMode } from './firebase';

const theme = createTheme({
  palette: {
    primary: { main: '#FF6B9D' },
    secondary: { main: '#4FC3F7' },
    background: { default: '#FFF8F0' }
  },
  typography: {
    fontFamily: '"Comic Sans MS", cursive, sans-serif',
    h3: { fontWeight: 'bold', fontSize: '2.5rem' },
    h4: { fontWeight: 'bold', color: '#FF6B9D' }
  }
});

function App() {
  const [currentSection, setCurrentSection] = useState('main');
  const [notification, setNotification] = useState({ open: false, message: '', severity: 'info' });

  useEffect(() => {
    if (isDemoMode) {
      setNotification({
        open: true,
        message: '🎈 Running in Demo Mode - All features available for preview!',
        severity: 'info'
      });
    }
  }, []);

  const showNotification = (message, severity = 'success') => {
    setNotification({ open: true, message, severity });
  };

  const handleCloseNotification = () => {
    setNotification(prev => ({ ...prev, open: false }));
  };

  const navigationItems = [
    { id: 'main', label: '🏠 Home', icon: '🏠' },
    { id: 'rsvp', label: '📝 RSVP', icon: '📝' },
    { id: 'messages', label: '💌 Messages', icon: '💌' },
    { id: 'journey', label: '📸 12 Month Journey', icon: '📸' },
    { id: 'admin', label: '⚙️ Admin', icon: '⚙️' }
  ];

  const renderCurrentSection = () => {
    switch (currentSection) {
      case 'rsvp':
        return (
          <Container maxWidth="md" sx={{ py: 4 }}>
            <Typography variant="h3" component="h1" gutterBottom sx={{ textAlign: 'center', color: 'primary.main' }}>
              📝 RSVP for Kashvi's Birthday Party
            </Typography>
            <Typography variant="h6" color="textSecondary" paragraph sx={{ textAlign: 'center', mb: 4 }}>
              We can't wait to celebrate with you! Please let us know if you'll be joining us.
            </Typography>
            <RSVPForm onSuccess={showNotification} />
          </Container>
        );
      case 'messages':
        return (
          <Container maxWidth="lg" sx={{ py: 4 }}>
            <Typography variant="h3" component="h1" gutterBottom sx={{ textAlign: 'center', color: 'primary.main' }}>
              💌 Guest Message Wall
            </Typography>
            <Typography variant="h6" color="textSecondary" paragraph sx={{ textAlign: 'center', mb: 4 }}>
              Share your wishes and memories for our little princess!
            </Typography>
            <GuestMessageWall />
          </Container>
        );
      case 'journey':
        return (
          <Container maxWidth="lg" sx={{ py: 4 }}>
            <Typography variant="h3" component="h1" gutterBottom sx={{ textAlign: 'center', color: 'primary.main' }}>
              📸 Kashvi's 12 Month Journey
            </Typography>
            <Typography variant="h6" color="textSecondary" paragraph sx={{ textAlign: 'center', mb: 4 }}>
              Watch how our little angel has grown month by month!
            </Typography>
            <PhotoGallery />
          </Container>
        );
      case 'admin':
        return (
          <Container maxWidth="lg" sx={{ py: 4 }}>
            <Typography variant="h3" component="h1" gutterBottom sx={{ textAlign: 'center', color: 'primary.main' }}>
              ⚙️ Admin Dashboard
            </Typography>
            <Typography variant="h6" color="textSecondary" paragraph sx={{ textAlign: 'center', mb: 4 }}>
              Manage RSVPs, messages, and party details.
            </Typography>
            <AdminDashboard />
          </Container>
        );
      default:
        return (
          <Container maxWidth="lg" sx={{ py: 4 }}>
            <Box textAlign="center" mb={6}>
              <Fade in timeout={1000}>
                <Typography variant="h2" component="h1" gutterBottom 
                  sx={{ color: 'primary.main', fontWeight: 'bold', mb: 2 }}>
                  🎂 Kashvi's 1st Birthday Celebration! 🎉
                </Typography>
              </Fade>
              
              <Fade in timeout={1500}>
                <Typography variant="h5" color="textSecondary" paragraph>
                  Join us as we celebrate our little princess turning ONE! 👑
                </Typography>
              </Fade>

              <Box sx={{ my: 4 }}>
                <ButterflyAnimation />
              </Box>

              <EventTimer />
              
              <Box sx={{ mt: 6 }}>
                <Typography variant="h4" gutterBottom sx={{ color: 'secondary.main' }}>
                  🎊 Party Details 🎊
                </Typography>
                <Typography variant="h6" paragraph>
                  📅 Date: Saturday, December 15th, 2024
                </Typography>
                <Typography variant="h6" paragraph>
                  🕐 Time: 2:00 PM - 6:00 PM
                </Typography>
                <Typography variant="h6" paragraph>
                  📍 Location: Our Family Home
                </Typography>
                <Typography variant="h6" paragraph>
                  🎁 Theme: Princess & Butterflies
                </Typography>
              </Box>
            </Box>
          </Container>
        );
    }
  };

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Box sx={{ 
        minHeight: '100vh',
        background: 'linear-gradient(135deg, #FFE5F1 0%, #E8F8F5 50%, #FFF9E7 100%)'
      }}>
        <AppBar position="sticky" sx={{ 
          background: 'linear-gradient(45deg, #FF6B9D 30%, #4FC3F7 90%)',
          boxShadow: '0 3px 5px 2px rgba(255, 105, 135, .3)'
        }}>
          <Toolbar>
            <Typography variant="h6" component="div" sx={{ flexGrow: 1, fontWeight: 'bold' }}>
              🎈 Kashvi's Birthday Bash 🎈
            </Typography>
            
            <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
              {navigationItems.map((item) => (
                <Button
                  key={item.id}
                  color="inherit"
                  onClick={() => setCurrentSection(item.id)}
                  sx={{
                    fontWeight: currentSection === item.id ? 'bold' : 'normal',
                    bgcolor: currentSection === item.id ? 'rgba(255,255,255,0.2)' : 'transparent',
                    '&:hover': { bgcolor: 'rgba(255,255,255,0.1)' },
                    fontSize: { xs: '0.7rem', sm: '0.875rem' },
                    px: { xs: 1, sm: 2 }
                  }}
                >
                  {item.icon} {item.label}
                </Button>
              ))}
            </Box>
          </Toolbar>
        </AppBar>

        {renderCurrentSection()}

        <Snackbar 
          open={notification.open}
          autoHideDuration={6000}
          onClose={handleCloseNotification}
          anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
        >
          <Alert 
            onClose={handleCloseNotification} 
            severity={notification.severity}
            sx={{ width: '100%' }}
          >
            {notification.message}
          </Alert>
        </Snackbar>
      </Box>
    </ThemeProvider>
  );
}

export default App;
