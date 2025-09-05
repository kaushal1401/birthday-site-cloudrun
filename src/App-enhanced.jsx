import React, { useState, useEffect } from 'react';
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
  Card,
  CardContent,
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
import { isDemoMode } from './firebase';
import ButterflyAnimation from './components/ButterflyAnimation';
import EventTimer from './components/EventTimer';
import RSVPForm from './components/RSVPForm';
import GuestMessageWall from './components/GuestMessageWall';
import AdminDashboard from './components/AdminDashboard';

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
  const [messages, setMessages] = useState([]);
  const [rsvpOpen, setRsvpOpen] = useState(false);
  const [adminOpen, setAdminOpen] = useState(false);
  const [adminCode, setAdminCode] = useState('');
  const [adminVerified, setAdminVerified] = useState(false);

  const ADMIN_CODE = '14011992'; // Secret admin code

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

  const handleNewMessage = (newMessage) => {
    setMessages(prev => [newMessage, ...prev]);
    showNotification('Your message has been posted! 💌', 'success');
  };

  const handleAdminAccess = () => {
    if (adminCode === ADMIN_CODE) {
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
      <Box sx={{ 
        minHeight: '100vh',
        background: 'linear-gradient(135deg, #FFE5F1 0%, #E8F8F5 50%, #FFF9E7 100%)',
        py: 2
      }}>
        <Container maxWidth="lg">
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
              <Typography variant="h2" component="h1" gutterBottom sx={{ 
                color: 'primary.main', 
                mb: 2,
                background: 'linear-gradient(45deg, #FF6B9D 30%, #4FC3F7 70%, #FFD700 100%)',
                backgroundClip: 'text',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent'
              }}>
                🎉 Kashvi's 1st Birthday Celebration! 🎉
              </Typography>
            </Fade>
            
            <Fade in timeout={2000}>
              <Paper 
                elevation={3} 
                sx={{ 
                  p: 3, 
                  mb: 3, 
                  background: 'linear-gradient(45deg, #FF6B9D 30%, #4FC3F7 70%, #FFD700 100%)',
                  color: 'white',
                  borderRadius: 3
                }}
              >
                <Typography variant="h3" component="h2" gutterBottom>
                  📅 September 24th, 2025
                </Typography>
                <Typography variant="h5">
                  Join us as we celebrate our little princess turning ONE! 👑✨
                </Typography>
                <Box sx={{ mt: 2 }}>
                  <Typography variant="h6">🎊🎀🦋🎀🎊</Typography>
                </Box>
              </Paper>
            </Fade>

            <Box sx={{ my: 3 }}>
              <ButterflyAnimation />
            </Box>

            <EventTimer />
          </Box>

          {/* Floating Messages Display on Home */}
          {messages.length > 0 && (
            <Box sx={{ mb: 4 }}>
              <Typography variant="h4" gutterBottom sx={{ 
                textAlign: 'center', 
                color: 'secondary.main',
                textShadow: '2px 2px 4px rgba(0,0,0,0.1)'
              }}>
                💌 Latest Birthday Wishes ✨
              </Typography>
              <Grid container spacing={2}>
                {messages.slice(0, 3).map((msg, index) => (
                  <Grid item xs={12} md={4} key={index}>
                    <Fade in timeout={500 * (index + 1)}>
                      <Card 
                        elevation={6}
                        sx={{ 
                          background: 'linear-gradient(135deg, rgba(255, 255, 255, 0.9) 0%, rgba(255, 182, 193, 0.3) 100%)',
                          border: '2px solid #FF6B9D',
                          borderRadius: 4,
                          transform: `rotate(${Math.random() * 6 - 3}deg)`,
                          '&:hover': { transform: 'rotate(0deg) scale(1.05)' },
                          transition: 'transform 0.3s ease',
                          boxShadow: '0 8px 16px rgba(255, 107, 157, 0.3)'
                        }}
                      >
                        <CardContent>
                          <Typography variant="body1" gutterBottom sx={{ fontStyle: 'italic' }}>
                            "{msg.message || msg.text || 'Beautiful birthday wish! 💖'}"
                          </Typography>
                          <Typography variant="caption" color="primary.main" sx={{ fontWeight: 'bold' }}>
                            - {msg.name || msg.author || 'Anonymous'} 💕
                          </Typography>
                        </CardContent>
                      </Card>
                    </Fade>
                  </Grid>
                ))}
              </Grid>
            </Box>
          )}

          {/* Main Content - Only Message Wall */}
          <Grid container spacing={4} justifyContent="center">
            <Grid item xs={12} md={8}>
              <Paper elevation={6} sx={{ 
                p: 4, 
                borderRadius: 4, 
                background: 'linear-gradient(135deg, rgba(255, 255, 255, 0.95) 0%, rgba(255, 182, 193, 0.1) 100%)',
                border: '3px solid #FF6B9D',
                boxShadow: '0 12px 24px rgba(255, 107, 157, 0.2)'
              }}>
                <Typography variant="h3" gutterBottom sx={{ 
                  textAlign: 'center', 
                  color: 'primary.main',
                  textShadow: '2px 2px 4px rgba(0,0,0,0.1)',
                  mb: 3
                }}>
                  💌 Share Your Birthday Wishes! ✨
                </Typography>
                <Typography variant="h6" paragraph sx={{ 
                  textAlign: 'center', 
                  mb: 4,
                  color: 'text.secondary',
                  fontStyle: 'italic'
                }}>
                  Leave a special message for our little princess Kashvi! 🌟
                </Typography>
                <GuestMessageWall onNewMessage={handleNewMessage} />
              </Paper>
            </Grid>
          </Grid>
        </Container>

        {/* Floating RSVP Button */}
        <Fab
          variant="extended"
          color="secondary"
          size="large"
          sx={{
            position: 'fixed',
            bottom: 20,
            left: 20,
            background: 'linear-gradient(45deg, #4FC3F7 30%, #FF6B9D 90%)',
            color: 'white',
            fontSize: '1.2rem',
            fontWeight: 'bold',
            px: 3,
            py: 1.5,
            minWidth: '120px',
            '&:hover': {
              background: 'linear-gradient(45deg, #FF6B9D 30%, #4FC3F7 90%)',
              transform: 'scale(1.1)'
            },
            transition: 'all 0.3s ease',
            boxShadow: '0 8px 16px rgba(79, 195, 247, 0.5)',
            textShadow: '1px 1px 2px rgba(0,0,0,0.3)',
            zIndex: 1000
          }}
          onClick={() => setRsvpOpen(true)}
        >
          <RSVPIcon sx={{ mr: 1, fontSize: '1.5rem' }} />
          RSVP
        </Fab>

        {/* Floating Admin Button */}
        <Fab
          size="small"
          sx={{
            position: 'fixed',
            bottom: 20,
            right: 20,
            background: 'linear-gradient(45deg, #FFD700 30%, #FF6B9D 90%)',
            '&:hover': {
              background: 'linear-gradient(45deg, #FF6B9D 30%, #FFD700 90%)',
              transform: 'scale(1.1)'
            },
            transition: 'all 0.3s ease',
            boxShadow: '0 4px 8px rgba(255, 215, 0, 0.4)',
            zIndex: 1000
          }}
          onClick={() => setAdminOpen(true)}
        >
          <AdminIcon fontSize="small" />
        </Fab>

        {/* RSVP Dialog */}
        <Dialog
          open={rsvpOpen}
          onClose={() => setRsvpOpen(false)}
          maxWidth="md"
          fullWidth
          PaperProps={{
            sx: {
              borderRadius: 3,
              background: 'white',
              boxShadow: '0 12px 24px rgba(0,0,0,0.15)'
            }
          }}
          BackdropProps={{
            sx: {
              backgroundColor: 'rgba(0, 0, 0, 0.3)',
              backdropFilter: 'blur(2px)'
            }
          }}
        >
          <DialogTitle sx={{ 
            textAlign: 'center', 
            color: 'primary.main',
            fontSize: '1.5rem',
            fontWeight: 'bold',
            background: 'linear-gradient(135deg, #FFE5F1 0%, #E8F8F5 100%)',
            borderRadius: '12px 12px 0 0'
          }}>
            📝 RSVP for Kashvi's Birthday Party! 🎉
            <IconButton
              onClick={() => setRsvpOpen(false)}
              sx={{ position: 'absolute', right: 8, top: 8 }}
            >
              <CloseIcon />
            </IconButton>
          </DialogTitle>
          <DialogContent sx={{ background: 'white' }}>
            <Typography variant="body1" paragraph sx={{ textAlign: 'center', mb: 3, mt: 2 }}>
              We can't wait to celebrate with you! Please let us know if you'll be joining us. 🎈
            </Typography>
            <RSVPForm onSuccess={(msg) => {
              showNotification(msg);
              setRsvpOpen(false);
            }} />
          </DialogContent>
        </Dialog>

        {/* Admin Dialog */}
        <Dialog
          open={adminOpen}
          onClose={handleAdminClose}
          maxWidth="md"
          fullWidth
          PaperProps={{
            sx: {
              borderRadius: 3,
              background: 'linear-gradient(135deg, rgba(255, 255, 255, 0.95) 0%, rgba(255, 215, 0, 0.1) 100%)'
            }
          }}
        >
          <DialogTitle sx={{ 
            textAlign: 'center', 
            color: 'primary.main',
            fontSize: '1.5rem',
            fontWeight: 'bold'
          }}>
            ⚙️ Admin Access
            <IconButton
              onClick={handleAdminClose}
              sx={{ position: 'absolute', right: 8, top: 8 }}
            >
              <CloseIcon />
            </IconButton>
          </DialogTitle>
          <DialogContent>
            {!adminVerified ? (
              <Box sx={{ textAlign: 'center', mt: 2 }}>
                <Typography variant="body1" paragraph>
                  Enter admin code to access party management:
                </Typography>
                <TextField
                  label="Admin Code"
                  type="password"
                  value={adminCode}
                  onChange={(e) => setAdminCode(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && handleAdminAccess()}
                  sx={{ mb: 2 }}
                  fullWidth
                />
                <Button
                  variant="contained"
                  onClick={handleAdminAccess}
                  sx={{
                    background: 'linear-gradient(45deg, #FFD700 30%, #FF6B9D 90%)',
                    '&:hover': { background: 'linear-gradient(45deg, #FF6B9D 30%, #FFD700 90%)' }
                  }}
                >
                  Access Admin Panel
                </Button>
              </Box>
            ) : (
              <AdminDashboard />
            )}
          </DialogContent>
        </Dialog>

        <Snackbar 
          open={notification.open}
          autoHideDuration={6000}
          onClose={handleCloseNotification}
          anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
        >
          <Alert 
            onClose={handleCloseNotification} 
            severity={notification.severity}
            sx={{ 
              width: '100%',
              borderRadius: 2,
              fontWeight: 'bold'
            }}
          >
            {notification.message}
          </Alert>
        </Snackbar>
      </Box>
    </ThemeProvider>
  );
}

export default App;
