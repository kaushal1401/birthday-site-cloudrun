import React, { useState } from 'react';
import { CssBaseline, ThemeProvider, createTheme } from '@mui/material';
import { Box, Typography, Alert, Button, Container } from '@mui/material';
import { isDemoMode } from './firebase';
import EventTimer from './components/EventTimer';
import RSVPForm from './components/RSVPForm';
import GuestMessageWall from './components/GuestMessageWall';
import PhotoGallery from './components/PhotoGallery';
import AdminDashboard from './components/AdminDashboard';
import ButterflyAnimation from './components/ButterflyAnimation';

const simpleTheme = createTheme({
  palette: {
    primary: { main: '#FF6B9D' },
    secondary: { main: '#4ECDC4' }
  }
});

function App() {
  const [currentTest, setCurrentTest] = useState('all');
  console.log('App component rendering...');
  console.log('Demo mode:', isDemoMode);
  
  const showNotification = (message, severity = 'success') => {
    console.log('Notification:', message, severity);
  };
  
  const renderComponent = () => {
    switch(currentTest) {
      case 'timer':
        return <EventTimer />;
      case 'rsvp':
        return <RSVPForm onSuccess={showNotification} />;
      case 'messages':
        return <GuestMessageWall />;
      case 'photos':
        return <PhotoGallery />;
      case 'admin':
        return <AdminDashboard />;
      case 'butterfly':
        return <ButterflyAnimation />;
      case 'all':
      default:
        return (
          <Container maxWidth="lg" sx={{ py: 2 }}>
            <Box textAlign="center" mb={3}>
              <Typography variant="h3" component="h1" gutterBottom sx={{ color: 'primary.main' }}>
                🎂 Kashvi's 1st Birthday Celebration! 🎉
              </Typography>
              <Typography variant="h6" color="textSecondary" paragraph>
                Complete Component Test - All Components Working Together
              </Typography>
              <ButterflyAnimation />
              <EventTimer />
            </Box>
            
            <Box sx={{ mt: 4, p: 2, border: '1px solid #ddd', borderRadius: 2 }}>
              <Typography variant="h5" gutterBottom>RSVP Section:</Typography>
              <RSVPForm onSuccess={showNotification} />
            </Box>
            
            <Box sx={{ mt: 4, p: 2, border: '1px solid #ddd', borderRadius: 2 }}>
              <Typography variant="h5" gutterBottom>Message Wall:</Typography>
              <GuestMessageWall />
            </Box>
            
            <Box sx={{ mt: 4, p: 2, border: '1px solid #ddd', borderRadius: 2 }}>
              <Typography variant="h5" gutterBottom>Photo Gallery:</Typography>
              <PhotoGallery />
            </Box>
            
            <Box sx={{ mt: 4, p: 2, border: '1px solid #ddd', borderRadius: 2 }}>
              <Typography variant="h5" gutterBottom>Admin Dashboard:</Typography>
              <AdminDashboard />
            </Box>
          </Container>
        );
    }
  };
  
  return (
    <ThemeProvider theme={simpleTheme}>
      <CssBaseline />
      <Box sx={{ 
        minHeight: '100vh',
        background: 'linear-gradient(135deg, #FFE5F1 0%, #E8F8F5 50%, #FFF9E7 100%)'
      }}>
        <Box sx={{ p: 2, bgcolor: 'rgba(255,255,255,0.9)', borderBottom: '1px solid #ddd' }}>
          <Typography variant="h4" component="h1" sx={{ textAlign: 'center', color: 'primary.main', mb: 2 }}>
            🎂 Birthday Site - Complete Component Test 🎉
          </Typography>
          
          <Alert severity={isDemoMode ? "warning" : "success"} sx={{ mb: 2 }}>
            {isDemoMode ? "🎈 Running in Demo Mode - All Firebase features using demo data" : "✅ Firebase Connected"}
          </Alert>
          
          <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap', justifyContent: 'center' }}>
            {[
              { id: 'all', label: '🎊 All Components' },
              { id: 'timer', label: '⏰ Timer' },
              { id: 'rsvp', label: '📝 RSVP' },
              { id: 'messages', label: '💌 Messages' },
              { id: 'photos', label: '📸 Photos' },
              { id: 'admin', label: '⚙️ Admin' },
              { id: 'butterfly', label: '🦋 Animation' }
            ].map((test) => (
              <Button
                key={test.id}
                variant={currentTest === test.id ? "contained" : "outlined"}
                onClick={() => setCurrentTest(test.id)}
                size="small"
              >
                {test.label}
              </Button>
            ))}
          </Box>
        </Box>
        
        <Box sx={{ p: 2 }}>
          {renderComponent()}
        </Box>
      </Box>
    </ThemeProvider>
  );
}

export default App;
