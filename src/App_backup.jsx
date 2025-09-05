import React, { useState } from 'react';
import { 
  CssBaseline, 
  ThemeProvider, 
  createTheme, 
  Box, 
  Typography, 
  Container,
  Grid,
  Paper,
  Fade,
  Alert,
  Snackbar,
  Fab,
  Dialog,
  DialogTitle,
  DialogContent,
  IconButton,
  TextField,
  Button
} from '@mui/material';
import { 
  Close as CloseIcon, 
  AdminPanelSettings as AdminIcon,
  EventNote as RSVPIcon 
} from '@mui/icons-material';
import ButterflyAnimation from './components/ButterflyAnimation';
import EventTimer from './components/EventTimer';
import RSVPForm from './components/RSVPForm';
import GuestMessageWall from './components/GuestMessageWall';
import AdminDashboard from './components/AdminDashboard';
import BabyJourney from './components/BabyJourney';
import BestPhotos from './components/BestPhotos';
import BirthdayBackground from './components/BirthdayBackground';
// Import GCS test utility for development
import './utils/testGCS';

const theme = createTheme({
  palette: {
    primary: { main: '#FF6B9D' },
    secondary: { main: '#4FC3F7' },
    success: { main: '#FFD700' },
    background: { default: '#FFF8F0' }
  },
  typography: {
    fontFamily: '"Comic Sans MS", cursive, sans-serif',
    h1: { fontWeight: 'bold', fontSize: '3rem' },
    h2: { fontWeight: 'bold', fontSize: '2.5rem' },
    h3: { fontWeight: 'bold', fontSize: '2rem' },
    h4: { fontWeight: 'bold', color: '#FF6B9D' }
  }
});

function App() {
  const [notification, setNotification] = useState({ open: false, message: '', severity: 'info' });
  const [rsvpOpen, setRsvpOpen] = useState(false);
  const [adminOpen, setAdminOpen] = useState(false);
  const [adminCode, setAdminCode] = useState('');
  const [adminVerified, setAdminVerified] = useState(false);

  const showNotification = (message, severity = 'info') => {
    setNotification({ open: true, message, severity });
  };

  const handleCloseNotification = () => {
    setNotification({ ...notification, open: false });
  };

  const handleAdminAccess = () => {
    // Simple admin code check
    if (adminCode === '14011992' || adminCode === 'birthday2025' || adminCode === 'admin') {
      setAdminVerified(true);
      showNotification('Admin access granted! 🔓', 'success');
    } else {
      showNotification('Invalid admin code! 🚫', 'error');
    }
  };

  const handleAdminClose = () => {
    setAdminOpen(false);
    setAdminVerified(false);
    setAdminCode('');
  };

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <BirthdayBackground />
      <Box sx={{ 
        minHeight: '100vh',
        background: `
          linear-gradient(135deg, #FFE5F1 0%, #E8F8F5 50%, #FFF9E7 100%)
        `,
        position: 'relative',
        py: 2,
        '&::before': {
          content: '""',
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundImage: `
            radial-gradient(circle at 20% 20%, rgba(255, 182, 193, 0.1) 0%, transparent 50%),
            radial-gradient(circle at 80% 80%, rgba(135, 206, 250, 0.1) 0%, transparent 50%),
            radial-gradient(circle at 40% 60%, rgba(255, 215, 0, 0.1) 0%, transparent 50%)
          `,
          pointerEvents: 'none',
          zIndex: 0
        },
        '&::after': {
          content: '"🎂 🎈 🎉 🎁 🎊 👑 🦋 ✨ 🌟 💖 🍰 🎀 🌸 🦄 🌈"',
          position: 'absolute',
          top: '10%',
          left: '5%',
          right: '5%',
          bottom: '10%',
          fontSize: '3rem',
          opacity: 0.03,
          display: 'flex',
          flexWrap: 'wrap',
          justifyContent: 'space-around',
          alignItems: 'center',
          lineHeight: '4rem',
          pointerEvents: 'none',
          zIndex: 0,
          animation: 'float 20s ease-in-out infinite',
        },
        '@keyframes float': {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-10px)' }
        }
      }}>
        <Container maxWidth="lg" sx={{ position: 'relative', zIndex: 1 }}>
          {/* Header Section with Birthday Date and Icons */}
          <Box textAlign="center" mb={4}>
            <Fade in timeout={1000}>
              <Box sx={{ mb: 3 }}>
                {/* Cake and Balloon Emojis */}
                <Typography variant="h1" sx={{ fontSize: '4rem', mb: 2 }}>
                  🎂🎈🎉🎈🎂
                </Typography>
              </Box>
            </Fade>
            
            <Fade in timeout={1500}>
              <Typography variant="h1" sx={{ 
                textAlign: 'center', 
                mb: 4,
                fontWeight: 'bold',
                textShadow: '3px 3px 6px rgba(0,0,0,0.2)',
                background: 'linear-gradient(45deg, #FF6B9D 30%, #4FC3F7 60%, #FFD700 90%)',
                backgroundClip: 'text',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                fontSize: { xs: '2.5rem', md: '4rem' }
              }}>
                🎉 Kashvi's 1st Birthday Celebration! 🎉
              </Typography>
            </Fade>

            <Fade in timeout={2000}>
              <Box sx={{ mb: 4 }}>
                <Typography variant="h4" sx={{ 
                  mb: 2, 
                  color: '#C44569',
                  fontSize: { xs: '1.2rem', md: '1.5rem' }
                }}>
                  Come celebrate our little princess as she turns ONE! 👑
                </Typography>
                <Typography variant="h5" sx={{ 
                  color: '#2C7A74', 
                  fontStyle: 'italic',
                  fontSize: { xs: '1rem', md: '1.2rem' }
                }}>
                  Join Us for a Magical Celebration! ✨
                </Typography>
              </Box>
            </Fade>

            <EventTimer />
          </Box>

          {/* Main Content Sections */}
          <Grid container spacing={4} justifyContent="center">
            <Grid item xs={12} md={8}>
              <Fade in timeout={3000}>
                <Typography variant="h3" textAlign="center" sx={{ 
                  mb: 4, 
                  color: '#FF6B9D',
                  fontSize: { xs: '1.8rem', md: '2.5rem' }
                }}>
                  Leave a special message for our little princess Kashvi! 🌟
                </Typography>
              </Fade>
              <GuestMessageWall onNewMessage={showNotification} />
            </Grid>
          </Grid>

          {/* Baby Journey Section */}
          <Box sx={{ mt: 8 }}>
            <BabyJourney />
          </Box>

          {/* Best Photos Section */}
          <Box sx={{ mt: 8 }}>
            <BestPhotos />
          </Box>

          {/* Footer */}
          <Box sx={{ 
            mt: 8, 
            py: 4, 
            textAlign: 'center',
            borderTop: '2px solid rgba(255, 107, 157, 0.2)',
            background: 'rgba(255, 255, 255, 0.7)'
          }}>
            <Typography variant="body2" color="text.secondary">
              © 2025 Kashvi's Birthday Celebration. All rights reserved.
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
              Made with 💖 for our precious little one
            </Typography>
          </Box>
        </Container>

        {/* Floating Action Buttons */}
        <Fab 
          color="primary" 
          sx={{ position: 'fixed', bottom: 16, right: 16, zIndex: 1000 }}
          onClick={() => setRsvpOpen(true)}
        >
          <RSVPIcon />
        </Fab>

        <Fab 
          color="secondary" 
          sx={{ position: 'fixed', bottom: 16, left: 16, zIndex: 1000 }}
          onClick={() => setAdminOpen(true)}
        >
          <AdminIcon />
        </Fab>

        {/* RSVP Dialog */}
        <Dialog open={rsvpOpen} onClose={() => setRsvpOpen(false)} maxWidth="md" fullWidth>
          <DialogTitle sx={{ 
            display: 'flex', 
            justifyContent: 'space-between', 
            alignItems: 'center',
            background: 'linear-gradient(45deg, #FF6B9D 30%, #4FC3F7 90%)',
            color: 'white'
          }}>
            🎂 RSVP for Kashvi's Birthday Party! 🎂
            <IconButton onClick={() => setRsvpOpen(false)} sx={{ color: 'white' }}>
              <CloseIcon />
            </IconButton>
          </DialogTitle>
          <DialogContent sx={{ mt: 2 }}>
            <RSVPForm 
              onSuccess={(message) => {
                setRsvpOpen(false);
                showNotification(message, 'success');
              }} 
            />
          </DialogContent>
        </Dialog>

        {/* Admin Dialog */}
        <Dialog open={adminOpen} onClose={handleAdminClose} maxWidth="lg" fullWidth>
          <DialogTitle sx={{ 
            display: 'flex', 
            justifyContent: 'space-between', 
            alignItems: 'center',
            background: 'linear-gradient(45deg, #FF6B9D 30%, #4FC3F7 90%)',
            color: 'white'
          }}>
            🔐 Admin Dashboard
            <IconButton onClick={handleAdminClose} sx={{ color: 'white' }}>
              <CloseIcon />
            </IconButton>
          </DialogTitle>
          <DialogContent sx={{ mt: 2 }}>
            {!adminVerified ? (
              <Box sx={{ textAlign: 'center', py: 4 }}>
                <Typography variant="h5" sx={{ mb: 3, color: '#FF6B9D' }}>
                  Enter Admin Code
                </Typography>
                <TextField
                  type="password"
                  label="Admin Code"
                  value={adminCode}
                  onChange={(e) => setAdminCode(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && handleAdminAccess()}
                  sx={{ mb: 3, minWidth: 250 }}
                />
                <br />
                <Button 
                  variant="contained" 
                  onClick={handleAdminAccess}
                  sx={{ 
                    background: 'linear-gradient(45deg, #FF6B9D 30%, #4FC3F7 90%)',
                    color: 'white',
                    '&:hover': {
                      background: 'linear-gradient(45deg, #FF6B9D 60%, #4FC3F7 100%)'
                    }
                  }}
                >
                  Access Dashboard
                </Button>
              </Box>
            ) : (
              <AdminDashboard />
            )}
          </DialogContent>
        </Dialog>

        {/* Notification Snackbar */}
        <Snackbar 
          open={notification.open} 
          autoHideDuration={6000} 
          onClose={handleCloseNotification}
          anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
        >
          <Alert 
            onClose={handleCloseNotification} 
            severity={notification.severity} 
            sx={{ width: '100%' }}
          >
            {notification.message}
          </Alert>
        </Snackbar>

        {/* Butterfly Animation */}
        <ButterflyAnimation />
      </Box>
    </ThemeProvider>
  );
}

export default App;
