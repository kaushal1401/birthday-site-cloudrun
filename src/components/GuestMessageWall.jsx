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
import { collection, addDoc, serverTimestamp, onSnapshot, query, orderBy } from 'firebase/firestore';
import { db } from '../firebase';

const GuestMessageWall = () => {
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
    // Subscribe to messages from Firestore
    const q = query(collection(db, 'messages'), orderBy('timestamp', 'desc'));
    const unsubscribe = onSnapshot(q, (querySnapshot) => {
      const messagesData = [];
      querySnapshot.forEach((doc) => {
        messagesData.push({ id: doc.id, ...doc.data() });
      });
      setMessages(messagesData);
    }, (error) => {
      console.error('Error fetching messages:', error);
    });

    return () => unsubscribe();
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
      await addDoc(collection(db, 'messages'), {
        ...newMessage,
        timestamp: serverTimestamp(),
        approved: true // Auto-approve for now, admin can delete if needed
      });

      setSuccess(true);
      setNewMessage({ name: '', message: '', guestType: 'adult' });
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
    const date = timestamp.toDate();
    return date.toLocaleDateString() + ' ' + date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  return (
    <Paper elevation={3} sx={{ p: 4, mb: 4, backgroundColor: 'rgba(255, 255, 255, 0.05)' }}>
      <Typography variant="h4" gutterBottom align="center" color="primary">
        💌 Guest Message Wall 💌
      </Typography>
      <Typography variant="body1" align="center" sx={{ mb: 4, color: 'text.secondary' }}>
        Share your birthday wishes and excitement!
      </Typography>

      {/* Message Form */}
      <Box component="form" onSubmit={handleSubmit} sx={{ mb: 4 }}>
        <Grid container spacing={2}>
          <Grid item xs={12} sm={4}>
            <TextField
              fullWidth
              label="Your Name"
              value={newMessage.name}
              onChange={(e) => setNewMessage(prev => ({ ...prev, name: e.target.value }))}
              required
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
              placeholder="Write a sweet birthday message..."
              required
            />
          </Grid>
          <Grid item xs={12}>
            <Button
              type="submit"
              variant="contained"
              startIcon={<SendIcon />}
              disabled={loading}
              sx={{ float: 'right' }}
            >
              {loading ? 'Posting...' : 'Post Message 🎈'}
            </Button>
          </Grid>
        </Grid>
      </Box>

      {/* Messages Display */}
      <Box sx={{ maxHeight: '500px', overflowY: 'auto', pr: 1 }}>
        {messages.length === 0 ? (
          <Typography variant="body1" align="center" color="text.secondary" sx={{ py: 4 }}>
            Be the first to leave a birthday message! 🎉
          </Typography>
        ) : (
          messages.map((message, index) => (
            <Fade in={true} timeout={500 + index * 100} key={message.id}>
              <Card sx={{ mb: 2, backgroundColor: 'rgba(255, 255, 255, 0.02)' }}>
                <CardContent>
                  <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                    <Avatar 
                      sx={{ 
                        bgcolor: getAvatarColor(message.name), 
                        mr: 2,
                        width: 40,
                        height: 40
                      }}
                    >
                      {message.guestType === 'child' ? <ChildIcon /> : <PersonIcon />}
                    </Avatar>
                    <Box sx={{ flexGrow: 1 }}>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        <Typography variant="h6" color="primary">
                          {message.name}
                        </Typography>
                        <Chip 
                          label={message.guestType === 'child' ? 'Child' : 'Adult'} 
                          size="small" 
                          color={message.guestType === 'child' ? 'secondary' : 'primary'}
                          variant="outlined"
                        />
                      </Box>
                      <Typography variant="caption" color="text.secondary">
                        {formatTimestamp(message.timestamp)}
                      </Typography>
                    </Box>
                  </Box>
                  <Typography variant="body1" sx={{ pl: 7 }}>
                    {message.message}
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