import React, { useState, useEffect } from 'react';
import {
  Paper,
  Typography,
  TextField,
  Button,
  Box,
  Card,
  CardContent,
  Avatar,
  Chip,
  Snackbar,
  Alert,
  Grid,
  Fade
} from '@mui/material';
import { Send as SendIcon, Person as PersonIcon, ChildCare as ChildIcon } from '@mui/icons-material';
import { messagesService } from '../services/firestoreService';

const GuestMessageWall = ({ onNewMessage }) => {
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState({
    name: '',
    message: '',
    guestType: 'adult'
  });
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    // Load messages from Firestore
    const loadMessages = async () => {
      try {
        const messagesData = await messagesService.getMessages();
        setMessages(messagesData);
      } catch (error) {
        console.error('Error fetching messages:', error);
      }
    };

    loadMessages();
    
    // Set up polling for real-time updates
    const interval = setInterval(loadMessages, 5000); // Poll every 5 seconds
    
    return () => clearInterval(interval);
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!newMessage.name.trim() || !newMessage.message.trim()) {
      setError('Please fill in both name and message');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const messageData = {
        name: newMessage.name,
        message: newMessage.message,
        guestType: newMessage.guestType
      };
      
      await messagesService.createMessage(messageData);

      setSuccess(true);
      setNewMessage({ name: '', message: '', guestType: 'adult' });
      
      // Call the callback to show message on home page
      if (onNewMessage) {
        onNewMessage(`New message from ${messageData.name}! 💌`, 'success');
      }
      
      // Refresh messages
      const messagesData = await messagesService.getMessages();
      setMessages(messagesData);
    } catch (err) {
      console.error('Error posting message:', err);
      setError('Failed to post message. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const getAvatarColor = (name) => {
    const colors = ['#e91e63', '#9c27b0', '#673ab7', '#3f51b5', '#2196f3', '#009688', '#4caf50', '#ff9800'];
    const index = name.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
    return colors[index % colors.length];
  };

  const formatTimestamp = (timestamp) => {
    if (!timestamp) return '';
    
    // Handle Firestore Timestamp objects
    let date;
    if (timestamp.toDate) {
      date = timestamp.toDate();
    } else if (timestamp.seconds) {
      date = new Date(timestamp.seconds * 1000);
    } else {
      date = new Date(timestamp);
    }
    
    return date.toLocaleDateString() + ' ' + date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  return (
    <Paper elevation={6} sx={{ 
      p: 4, 
      mb: 4, 
      background: 'linear-gradient(135deg, rgba(255, 255, 255, 0.9) 0%, rgba(255, 245, 250, 0.9) 100%)',
      borderRadius: 4,
      backdropFilter: 'blur(10px)',
      border: '1px solid rgba(255, 182, 193, 0.3)'
    }}>
      <Typography variant="h4" gutterBottom align="center" sx={{
        background: 'linear-gradient(45deg, #FF6B9D 30%, #4ECDC4 90%)',
        backgroundClip: 'text',
        WebkitBackgroundClip: 'text',
        WebkitTextFillColor: 'transparent',
        fontWeight: 'bold'
      }}>
        💌 Guest Message Wall 💌
      </Typography>
      <Typography variant="body1" align="center" sx={{ mb: 4, color: 'text.secondary' }}>
        Share your birthday wishes and excitement!
      </Typography>

      {/* Message Form */}
      <Box component="form" onSubmit={handleSubmit} sx={{ 
        mb: 4,
        p: 3,
        background: 'linear-gradient(135deg, #FFE5F1 0%, #E8F8F5 100%)',
        borderRadius: 3,
        border: '1px solid rgba(255, 107, 157, 0.2)'
      }}>
        <Grid container spacing={2}>
          <Grid item xs={12} sm={4}>
            <TextField
              fullWidth
              label="Your Name"
              value={newMessage.name}
              onChange={(e) => setNewMessage(prev => ({ ...prev, name: e.target.value }))}
              required
              sx={{
                '& .MuiOutlinedInput-root': {
                  borderRadius: 3,
                  background: 'rgba(255, 255, 255, 0.8)'
                }
              }}
            />
          </Grid>
          <Grid item xs={12} sm={8}>
            <TextField
              fullWidth
              label="Your Birthday Message"
              multiline
              rows={2}
              value={newMessage.message}
              onChange={(e) => setNewMessage(prev => ({ ...prev, message: e.target.value }))}
              placeholder="Write a sweet birthday message... 🎂✨"
              required
              sx={{
                '& .MuiOutlinedInput-root': {
                  borderRadius: 3,
                  background: 'rgba(255, 255, 255, 0.8)'
                }
              }}
            />
          </Grid>
          <Grid item xs={12}>
            <Button
              type="submit"
              variant="contained"
              startIcon={<SendIcon />}
              disabled={loading}
              sx={{ 
                float: 'right',
                borderRadius: 3,
                background: 'linear-gradient(45deg, #FF6B9D 30%, #4ECDC4 90%)',
                minWidth: { xs: '120px', md: '140px' },
                minHeight: { xs: '48px', md: '48px' }, // Ensure minimum touch target
                padding: { xs: '12px 24px', md: '8px 16px' },
                fontSize: { xs: '1rem', md: '0.875rem' },
                touchAction: 'manipulation',
                WebkitTapHighlightColor: 'transparent',
                '&:hover': {
                  background: 'linear-gradient(45deg, #FF6B9D 60%, #4ECDC4 100%)',
                  transform: 'translateY(-2px)',
                  boxShadow: '0 8px 25px rgba(255, 107, 157, 0.3)'
                },
                '&:active': {
                  transform: 'scale(0.98)',
                },
                transition: 'all 0.2s ease'
              }}
            >
              {loading ? 'Posting...' : 'Post Message 🎈'}
            </Button>
          </Grid>
        </Grid>
      </Box>

      {/* Messages Display */}
      <Box sx={{ maxHeight: '600px', overflowY: 'auto', pr: 1 }}>
        {messages.length === 0 ? (
          <Typography variant="body1" align="center" color="text.secondary" sx={{ py: 4 }}>
            Be the first to leave a birthday message! 🎉
          </Typography>
        ) : (
          messages.map((message, index) => (
            <Fade in={true} timeout={500 + index * 100} key={message.id}>
              <Card sx={{ 
                mb: 3, 
                background: index % 2 === 0 
                  ? 'linear-gradient(135deg, #FFE5F1 0%, #FFF9E7 100%)'
                  : 'linear-gradient(135deg, #E8F8F5 0%, #FFEAA7 100%)',
                borderRadius: 4,
                border: `2px solid ${index % 2 === 0 ? 'rgba(255, 107, 157, 0.2)' : 'rgba(78, 205, 196, 0.2)'}`,
                transform: 'translateY(0)',
                transition: 'all 0.3s ease',
                animation: `messageFloat 3s ease-in-out infinite ${index * 0.5}s`,
                '@keyframes messageFloat': {
                  '0%, 100%': { transform: 'translateY(0px)' },
                  '50%': { transform: 'translateY(-5px)' }
                },
                '&:hover': {
                  transform: 'translateY(-8px) scale(1.02)',
                  boxShadow: '0 12px 30px rgba(0,0,0,0.15)',
                }
              }}>
                <CardContent>
                  <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                    <Avatar 
                      sx={{ 
                        bgcolor: getAvatarColor(message.name), 
                        mr: 2,
                        width: 45,
                        height: 45,
                        boxShadow: '0 4px 12px rgba(0,0,0,0.2)'
                      }}
                    >
                      {message.guestType === 'child' ? <ChildIcon /> : <PersonIcon />}
                    </Avatar>
                    <Box sx={{ flexGrow: 1 }}>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        <Typography variant="h6" sx={{ 
                          color: index % 2 === 0 ? '#C44569' : '#2C7A74',
                          fontWeight: 'bold'
                        }}>
                          {message.name}
                        </Typography>
                        <Chip 
                          label={message.guestType === 'child' ? '👶 Child' : ''} 
                          size="small" 
                          sx={{
                            backgroundColor: message.guestType === 'child' ? '#4ECDC4' : '#FF6B9D',
                            color: 'white',
                            fontWeight: 'bold'
                          }}
                        />
                      </Box>
                      <Typography variant="caption" color="text.secondary">
                        {formatTimestamp(message.createdAt)}
                      </Typography>
                    </Box>
                  </Box>
                  <Typography variant="body1" sx={{ 
                    pl: 7,
                    fontSize: '1.1rem',
                    lineHeight: 1.6,
                    color: '#2D3436'
                  }}>
                    {message.message} 
                    <Box component="span" sx={{ ml: 1 }}>
                      {['🎉', '🎂', '🎈', '✨', '🌟', '💖'][Math.floor(Math.random() * 6)]}
                    </Box>
                  </Typography>
                </CardContent>
              </Card>
            </Fade>
          ))
        )}
      </Box>

      <Snackbar 
        open={success} 
        autoHideDuration={4000} 
        onClose={() => setSuccess(false)}
      >
        <Alert onClose={() => setSuccess(false)} severity="success">
          Message posted successfully! 🎉
        </Alert>
      </Snackbar>

      <Snackbar 
        open={!!error} 
        autoHideDuration={6000} 
        onClose={() => setError('')}
      >
        <Alert onClose={() => setError('')} severity="error">
          {error}
        </Alert>
      </Snackbar>
    </Paper>
  );
};

export default GuestMessageWall;