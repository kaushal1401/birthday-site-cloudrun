import React, { useState } from 'react';
import { 
  CssBaseline, 
  ThemeProvider, 
  createTheme, 
  Box, 
  Typography, 
  Container,
  Grid,
  Fade,
  Alert,
  Snackbar,
  Fab,
  Dialog,
  DialogTitle,
  DialogContent,
  IconButton,
  TextField,
  Button,
  Link
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
import LatestWishes from './components/LatestWishes';
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
        width: '100%',
        maxWidth: '100vw',
        overflowX: 'hidden',
        background: `
          linear-gradient(135deg, #FFE5F1 0%, #E8F8F5 50%, #FFF9E7 100%)
        `,
        position: 'relative',
        py: { xs: 1, sm: 2 },
        px: 0,
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
          fontSize: { xs: '1.5rem', sm: '2rem', md: '3rem' },
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
          </Box>

          {/* Latest Birthday Wishes Section */}
          <Fade in timeout={2500}>
            <Box sx={{ 
              mt: 4, 
              mb: 4, 
              p: 2, 
              background: 'linear-gradient(135deg, #FFE5F1 0%, #F0F8FF 100%)',
              borderRadius: 4,
              boxShadow: '0 8px 32px rgba(255, 107, 157, 0.2)',
              border: '2px solid rgba(255, 107, 157, 0.1)'
            }}>
              <Typography 
                variant="h2" 
                component="h2" 
                textAlign="center" 
                sx={{ 
                  mb: 2,
                  fontFamily: '"Fredoka One", cursive',
                  background: 'linear-gradient(45deg, #FF6B9D, #4FC3F7, #FFD700)',
                  backgroundClip: 'text',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                  fontSize: { xs: '1.5rem', md: '2rem' }
                }}
              >
                🌟 Latest Birthday Wishes 🌟
              </Typography>
              <Typography 
                variant="h6" 
                textAlign="center" 
                sx={{ 
                  mb: 2, 
                  color: '#666',
                  fontFamily: '"Comic Neue", cursive',
                  fontSize: { xs: '0.9rem', md: '1rem' }
                }}
              >
                See the love and warm wishes pouring in for our little princess! 💖
              </Typography>
              <LatestWishes />
            </Box>
          </Fade>

          {/* Main Content Layout */}
          <Grid container spacing={4} sx={{ mt: 4 }} justifyContent="center">
            {/* Centered Content - Countdown and Messages */}
            <Grid item xs={12} md={8}>
              {/* Birthday Countdown */}
              <Box sx={{ mb: 4 }}>
                <EventTimer />
              </Box>

              {/* Guest Messages Section */}
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

          {/* Kashvi Journey Section */}
          <Box sx={{ mt: 8 }}>
            <BabyJourney />
          </Box>

          {/* Best Moments Section */}
          <Box sx={{ mt: 8 }}>
            <BestPhotos />
          </Box>

          {/* Footer */}
          <Box sx={{ 
            mt: 8, 
            py: 2, 
            textAlign: 'center',
            background: 'rgba(255, 255, 255, 0.8)',
            borderTop: '1px solid rgba(255, 107, 157, 0.2)',
            borderRadius: '10px'
          }}>
            <Typography variant="body2" sx={{ color: '#666', fontSize: '0.9rem' }}>
              © 2025 Kashvi's Birthday Celebration. All rights reserved.
            </Typography>
            <Typography variant="body2" sx={{ mt: 1, color: '#666', fontSize: '0.9rem' }}>
              Made with 💖 for our precious little one
            </Typography>
            <Typography variant="body2" sx={{ mt: 1, fontSize: '0.8rem', color: '#888', fontWeight: 'bold' }}>
              Website powered by{' '}
              <Link 
                href="https://www.linkedin.com/in/kaushal-singh14" 
                target="_blank" 
                rel="noopener noreferrer"
                sx={{ 
                  color: '#666', 
                  textDecoration: 'none',
                  fontSize: '0.8rem',
                  fontWeight: 'bold',
                  '&:hover': { textDecoration: 'underline' }
                }}
              >
                Kaushal
              </Link>
            </Typography>
          </Box>
        </Container>

        {/* Floating Action Buttons */}
        {/* RSVP FAB - Left side with text */}
        <Box sx={{ 
          position: 'fixed', 
          bottom: { xs: 16, sm: 20 }, 
          left: { xs: 16, sm: 20 }, 
          zIndex: 1000,
          display: 'flex',
          alignItems: 'center',
          gap: 1
        }}>
          <Fab 
            variant="extended"
            color="primary" 
            sx={{ 
              background: 'linear-gradient(45deg, #FF6B9D 30%, #4FC3F7 90%)',
              color: 'white',
              fontWeight: 'bold',
              px: { xs: 2, sm: 3 },
              py: { xs: 1, sm: 1.5 },
              fontSize: { xs: '0.875rem', sm: '1rem' },
              minHeight: { xs: '48px', sm: '56px' }, // Minimum touch target size
              minWidth: { xs: '80px', sm: '100px' },
              '&:hover': {
                background: 'linear-gradient(45deg, #FF6B9D 60%, #4FC3F7 100%)',
                transform: 'scale(1.05)',
              },
              '&:active': {
                transform: 'scale(0.98)', // Visual feedback on press
              },
              transition: 'all 0.3s ease',
              // Better touch interaction
              touchAction: 'manipulation',
              userSelect: 'none',
              WebkitTapHighlightColor: 'transparent'
            }}
            onClick={() => setRsvpOpen(true)}
            aria-label="Open RSVP Form"
          >
            <RSVPIcon sx={{ mr: 1, fontSize: { xs: '1.2rem', sm: '1.5rem' } }} />
            RSVP
          </Fab>
        </Box>

        {/* Admin FAB - Right side */}
        <Fab 
          color="secondary" 
          sx={{ 
            position: 'fixed', 
            bottom: { xs: 16, sm: 20 }, 
            right: { xs: 16, sm: 20 }, 
            zIndex: 1000,
            minHeight: { xs: '48px', sm: '56px' }, // Minimum touch target size
            minWidth: { xs: '48px', sm: '56px' },
            background: 'linear-gradient(45deg, #9C27B0 30%, #673AB7 90%)',
            '&:hover': {
              background: 'linear-gradient(45deg, #9C27B0 60%, #673AB7 100%)',
              transform: 'scale(1.05)',
            },
            '&:active': {
              transform: 'scale(0.98)', // Visual feedback on press
            },
            transition: 'all 0.3s ease',
            // Better touch interaction
            touchAction: 'manipulation',
            userSelect: 'none',
            WebkitTapHighlightColor: 'transparent'
          }}
          onClick={() => setAdminOpen(true)}
          aria-label="Open Admin Panel"
        >
          <AdminIcon sx={{ fontSize: { xs: '1.2rem', sm: '1.5rem' } }} />
        </Fab>

        {/* RSVP Dialog with Enhanced Styling */}
        <Dialog 
          open={rsvpOpen} 
          onClose={() => setRsvpOpen(false)} 
          maxWidth="md" 
          fullWidth
          fullScreen={window.innerWidth < 600} // Full screen on mobile for better UX
          PaperProps={{
            sx: {
              borderRadius: { xs: 0, sm: 6 }, // No border radius on mobile
              background: 'linear-gradient(135deg, #FFF8F0 0%, #FFE5F1 50%, #E8F8F5 100%)',
              border: { xs: 'none', sm: '4px solid #FF6B9D' },
              boxShadow: '0 20px 40px rgba(255, 107, 157, 0.3)',
              overflow: 'hidden',
              margin: { xs: 0, sm: 2 },
              maxHeight: { xs: '100vh', sm: '90vh' }
            }
          }}
        >
          <DialogTitle sx={{ 
            display: 'flex', 
            justifyContent: 'space-between', 
            alignItems: 'center',
            background: 'linear-gradient(45deg, #FF6B9D 30%, #4FC3F7 60%, #FFD700 90%)',
            color: 'white',
            fontFamily: '"Comic Sans MS", cursive, sans-serif',
            fontSize: { xs: '1.5rem', sm: '2.2rem' },
            fontWeight: 'bold',
            textShadow: '3px 3px 6px rgba(0,0,0,0.4)',
            py: { xs: 2, sm: 3 },
            px: { xs: 2, sm: 3 },
            position: 'relative',
            '&::before': {
              content: '"🎉 🎈 🎂 🎁 🎊"',
              position: 'absolute',
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              fontSize: { xs: '0.8rem', sm: '1rem' },
              opacity: 0.1,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              pointerEvents: 'none'
            }
          }}>
            <Box sx={{ 
              display: 'flex', 
              alignItems: 'center', 
              gap: 1,
              fontSize: { xs: '1.2rem', sm: '1.5rem' }
            }}>
              🎂 Join Kashvi's Birthday Party! 🎂
            </Box>
            <IconButton 
              onClick={() => setRsvpOpen(false)} 
              sx={{ 
                color: 'white',
                backgroundColor: 'rgba(255, 255, 255, 0.2)',
                minWidth: { xs: '44px', sm: '48px' }, // Minimum touch target
                minHeight: { xs: '44px', sm: '48px' },
                '&:hover': {
                  backgroundColor: 'rgba(255, 255, 255, 0.3)',
                },
                '&:active': {
                  transform: 'scale(0.95)',
                },
                transition: 'all 0.2s ease',
                touchAction: 'manipulation',
                WebkitTapHighlightColor: 'transparent'
              }}
              aria-label="Close RSVP Dialog"
            >
              <CloseIcon />
            </IconButton>
          </DialogTitle>
          <DialogContent sx={{ 
            mt: 2, 
            px: 4, 
            pb: 4,
            background: 'linear-gradient(135deg, #FFFFFF 0%, #FFF9E7 50%, #FFE5F1 100%)'
          }}>
            <Box sx={{ 
              textAlign: 'center', 
              mb: 3,
              p: 2,
              background: 'linear-gradient(45deg, rgba(255, 107, 157, 0.1) 30%, rgba(79, 195, 247, 0.1) 90%)',
              borderRadius: 3,
              border: '2px dashed #FF6B9D'
            }}>
              <Typography variant="h6" sx={{ 
                color: '#C44569',
                fontWeight: 'bold',
                mb: 1
              }}>
                We can't wait to celebrate with you! 🌟
              </Typography>
              <Typography variant="body1" sx={{ 
                color: '#666',
                fontStyle: 'italic'
              }}>
                Please let us know if you'll be joining our little princess's big day
              </Typography>
            </Box>
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
