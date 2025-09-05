import React, { useState, useEffect } from 'react';
import {
  Box,
  Card,
  CardContent,
  Typography,
  Avatar,
  Chip,
  Grid,
  Fade,
  Divider,
  IconButton
} from '@mui/material';
import {
  Person as PersonIcon,
  ChildCare as ChildIcon,
  Favorite as FavoriteIcon,
  Star as StarIcon,
  AccessTime as TimeIcon
} from '@mui/icons-material';
import { messagesService } from '../services/firestoreService';

const LatestWishes = () => {
  const [latestMessages, setLatestMessages] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadLatestMessages = async () => {
      try {
        setLoading(true);
        const allMessages = await messagesService.getMessages();
        // Get the latest 6 messages
        const latest = allMessages
          .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
          .slice(0, 6);
        setLatestMessages(latest);
      } catch (error) {
        console.error('Error fetching latest messages:', error);
      } finally {
        setLoading(false);
      }
    };

    loadLatestMessages();
    
    // Set up polling for real-time updates
    const interval = setInterval(loadLatestMessages, 10000); // Poll every 10 seconds
    
    return () => clearInterval(interval);
  }, []);

  const formatTimeAgo = (timestamp) => {
    const now = new Date();
    const messageTime = new Date(timestamp);
    const diffInMinutes = Math.floor((now - messageTime) / (1000 * 60));
    
    if (diffInMinutes < 1) return 'Just now';
    if (diffInMinutes < 60) return `${diffInMinutes}m ago`;
    if (diffInMinutes < 1440) return `${Math.floor(diffInMinutes / 60)}h ago`;
    return `${Math.floor(diffInMinutes / 1440)}d ago`;
  };

  const getAvatarColor = (guestType) => {
    return guestType === 'child' ? '#4FC3F7' : '#FF6B9D';
  };

  const getAvatarIcon = (guestType) => {
    return guestType === 'child' ? <ChildIcon /> : <PersonIcon />;
  };

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight={200}>
        <Typography variant="h6" sx={{ color: '#666', fontFamily: '"Comic Neue", cursive' }}>
          Loading latest wishes... 💫
        </Typography>
      </Box>
    );
  }

  if (latestMessages.length === 0) {
    return (
      <Box textAlign="center" py={4}>
        <Typography variant="h6" sx={{ color: '#666', fontFamily: '"Comic Neue", cursive', mb: 2 }}>
          No wishes yet... Be the first to send love! 💝
        </Typography>
        <Typography variant="body2" sx={{ color: '#888', fontFamily: '"Comic Neue", cursive' }}>
          Your beautiful messages will appear here
        </Typography>
      </Box>
    );
  }

  return (
    <Grid container spacing={3}>
      {latestMessages.map((message, index) => (
        <Grid item xs={12} sm={6} md={4} key={message.id || index}>
          <Fade in={true} timeout={500 + index * 100}>
            <Card
              elevation={6}
              sx={{
                height: '100%',
                background: 'linear-gradient(135deg, #ffffff 0%, #f8f9ff 100%)',
                borderRadius: 3,
                border: '2px solid rgba(255, 107, 157, 0.1)',
                transition: 'all 0.3s ease',
                '&:hover': {
                  transform: 'translateY(-8px)',
                  boxShadow: '0 12px 40px rgba(255, 107, 157, 0.2)',
                  border: '2px solid rgba(255, 107, 157, 0.3)',
                },
                position: 'relative',
                overflow: 'visible'
              }}
            >
              {/* New Message Badge */}
              {index < 3 && (
                <Chip
                  label="NEW"
                  size="small"
                  sx={{
                    position: 'absolute',
                    top: -8,
                    right: 16,
                    background: 'linear-gradient(45deg, #FF6B9D, #4FC3F7)',
                    color: 'white',
                    fontWeight: 'bold',
                    fontSize: '0.7rem',
                    zIndex: 1,
                    '& .MuiChip-label': {
                      fontFamily: '"Fredoka One", cursive',
                    }
                  }}
                />
              )}
              
              <CardContent sx={{ p: 3 }}>
                {/* Header */}
                <Box display="flex" alignItems="center" mb={2}>
                  <Avatar
                    sx={{
                      bgcolor: getAvatarColor(message.guestType),
                      width: 45,
                      height: 45,
                      mr: 2,
                      boxShadow: '0 4px 12px rgba(0,0,0,0.15)'
                    }}
                  >
                    {getAvatarIcon(message.guestType)}
                  </Avatar>
                  <Box flex={1}>
                    <Typography
                      variant="h6"
                      sx={{
                        fontFamily: '"Fredoka One", cursive',
                        color: '#2C3E50',
                        fontSize: '1.1rem',
                        mb: 0.5
                      }}
                    >
                      {message.name}
                    </Typography>
                    <Box display="flex" alignItems="center" gap={1}>
                      <Chip
                        label={message.guestType === 'child' ? 'Little Friend' : 'Guest'}
                        size="small"
                        sx={{
                          backgroundColor: message.guestType === 'child' ? '#E3F2FD' : '#FCE4EC',
                          color: message.guestType === 'child' ? '#1976D2' : '#C2185B',
                          fontSize: '0.7rem',
                          height: 20,
                          '& .MuiChip-label': {
                            fontFamily: '"Comic Neue", cursive',
                            fontWeight: 'bold'
                          }
                        }}
                      />
                      <Box display="flex" alignItems="center" gap={0.5}>
                        <TimeIcon sx={{ fontSize: 14, color: '#999' }} />
                        <Typography variant="caption" sx={{ color: '#999', fontSize: '0.7rem' }}>
                          {formatTimeAgo(message.createdAt)}
                        </Typography>
                      </Box>
                    </Box>
                  </Box>
                </Box>

                <Divider sx={{ mb: 2, borderColor: 'rgba(255, 107, 157, 0.1)' }} />

                {/* Message */}
                <Typography
                  variant="body1"
                  sx={{
                    fontFamily: '"Comic Neue", cursive',
                    color: '#2C3E50',
                    fontSize: '0.95rem',
                    lineHeight: 1.6,
                    mb: 2,
                    display: '-webkit-box',
                    WebkitLineClamp: 4,
                    WebkitBoxOrient: 'vertical',
                    overflow: 'hidden',
                    textOverflow: 'ellipsis'
                  }}
                >
                  "{message.message}"
                </Typography>

                {/* Bottom Actions */}
                <Box display="flex" justifyContent="space-between" alignItems="center">
                  <Box display="flex" alignItems="center" gap={1}>
                    <IconButton
                      size="small"
                      sx={{
                        color: '#FF6B9D',
                        '&:hover': {
                          backgroundColor: 'rgba(255, 107, 157, 0.1)',
                          transform: 'scale(1.1)'
                        }
                      }}
                    >
                      <FavoriteIcon fontSize="small" />
                    </IconButton>
                    <Typography variant="caption" sx={{ color: '#999' }}>
                      {Math.floor(Math.random() * 10) + 1} ❤️
                    </Typography>
                  </Box>
                  
                  <StarIcon sx={{ color: '#FFD700', fontSize: 18 }} />
                </Box>
              </CardContent>
            </Card>
          </Fade>
        </Grid>
      ))}
    </Grid>
  );
};

export default LatestWishes;
