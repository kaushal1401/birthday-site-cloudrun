import React, { useState, useEffect } from 'react';
import { Box, Typography, Paper, Chip, Card, CardContent, Grid } from '@mui/material';
import { 
  CakeOutlined, 
  CelebrationOutlined, 
  LocationOn, 
  Schedule, 
  CalendarToday 
} from '@mui/icons-material';
import { messagesService } from '../services/firestoreService';
import { eventDetails } from '../firebase';

// Add CSS animations
const styles = `
  @keyframes pulse {
    0% { transform: scale(1); }
    50% { transform: scale(1.05); }
    100% { transform: scale(1); }
  }
  
  @keyframes bounce {
    0%, 20%, 50%, 80%, 100% { transform: translateY(0); }
    40% { transform: translateY(-10px); }
    60% { transform: translateY(-5px); }
  }
  
  @keyframes fadeIn {
    0% { opacity: 0; transform: translateY(10px); }
    100% { opacity: 1; transform: translateY(0); }
  }
`;

// Inject styles
if (typeof document !== 'undefined') {
  const styleSheet = document.createElement("style");
  styleSheet.type = "text/css";
  styleSheet.innerText = styles;
  document.head.appendChild(styleSheet);
}

const EventTimer = () => {
  const [birthdayTimeLeft, setBirthdayTimeLeft] = useState(calculateBirthdayTimeLeft());
  const [eventTimeLeft, setEventTimeLeft] = useState(calculateEventTimeLeft());
  const [recentMessages, setRecentMessages] = useState([]);

  function calculateBirthdayTimeLeft() {
    const birthdayDate = eventDetails.birthdayDate;
    const difference = new Date(`${birthdayDate}T00:00:00Z`) - new Date();
    let timeLeft = {};

    if (difference > 0) {
      timeLeft = {
        days: Math.floor(difference / (1000 * 60 * 60 * 24)),
        hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
        minutes: Math.floor((difference / 1000 / 60) % 60),
        seconds: Math.floor((difference / 1000) % 60)
      };
    }
    return timeLeft;
  }

  function calculateEventTimeLeft() {
    // Event starts at 6:30 PM on October 5th, 2025
    const eventDate = eventDetails.eventDate;
    const difference = new Date(`${eventDate}T18:30:00-05:00`) - new Date(); // 6:30 PM CST
    let timeLeft = {};

    if (difference > 0) {
      timeLeft = {
        days: Math.floor(difference / (1000 * 60 * 60 * 24)),
        hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
        minutes: Math.floor((difference / 1000 / 60) % 60),
        seconds: Math.floor((difference / 1000) % 60)
      };
    }
    return timeLeft;
  }

  useEffect(() => {
    const timer = setInterval(() => {
      setBirthdayTimeLeft(calculateBirthdayTimeLeft());
      setEventTimeLeft(calculateEventTimeLeft());
    }, 1000);

    // Load recent messages
    const loadRecentMessages = async () => {
      try {
        const messages = await messagesService.getMessages();
        // Get the 3 most recent messages
        setRecentMessages(messages.slice(0, 3));
      } catch (error) {
        console.error('Error fetching recent messages:', error);
      }
    };

    loadRecentMessages();
    
    // Set up polling for recent messages
    const messageInterval = setInterval(loadRecentMessages, 10000); // Poll every 10 seconds

    return () => {
      clearInterval(timer);
      clearInterval(messageInterval);
    };
  }, []);

  return (
    <Box sx={{ textAlign: 'center', mt: 4, mb: 4 }}>
      {/* Birthday Countdown - Enhanced with Birthday Theme */}
      <Box sx={{ 
        background: 'linear-gradient(135deg, #FFE5F1 0%, #FFF9E7 50%, #E8F8F5 100%)',
        borderRadius: 4,
        p: 4,
        border: '3px solid #FF6B9D',
        boxShadow: '0 12px 24px rgba(255, 107, 157, 0.3)',
        position: 'relative',
        overflow: 'hidden',
        mb: 6,
        '&::before': {
          content: '""',
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: 'url("data:image/svg+xml,%3Csvg xmlns=\'http://www.w3.org/2000/svg\' viewBox=\'0 0 100 100\'%3E%3Ctext y=\'.9em\' font-size=\'90\'%3E🎂%3C/text%3E%3C/svg%3E") repeat',
          opacity: 0.03,
          backgroundSize: '60px 60px',
          zIndex: 0
        }
      }}>
        <Box sx={{ position: 'relative', zIndex: 1 }}>
          <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: 1, mb: 2 }}>
            <Typography sx={{ fontSize: '3rem' }}>🎂🎈</Typography>
            <Typography variant="h2" sx={{ 
              background: 'linear-gradient(45deg, #FF6B9D 30%, #C44569 70%, #FFD700 100%)',
              backgroundClip: 'text',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              fontWeight: 'bold',
              textShadow: '2px 2px 4px rgba(0,0,0,0.1)',
              animation: 'pulse 2s infinite'
            }}>
              Birthday Countdown
            </Typography>
            <Typography sx={{ fontSize: '3rem' }}>🎈🎂</Typography>
          </Box>
          
          <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: 1, mb: 3 }}>
            <Typography sx={{ fontSize: '2rem' }}>👑</Typography>
            <Chip 
              label="Kashvi's 1st Birthday - September 24th, 2025" 
              sx={{ 
                background: 'linear-gradient(45deg, #FF6B9D 30%, #C44569 90%)',
                color: 'white',
                fontSize: '1.1rem',
                fontWeight: 'bold',
                px: 2,
                py: 1,
                '& .MuiChip-label': { px: 2 }
              }} 
            />
            <Typography sx={{ fontSize: '2rem' }}>👑</Typography>
          </Box>
          
          <Box sx={{ display: 'flex', justifyContent: 'center', gap: 2, flexWrap: 'wrap' }}>
            {Object.keys(birthdayTimeLeft).length > 0 ? (
              Object.keys(birthdayTimeLeft).map(interval => (
                <Paper
                  key={interval}
                  elevation={8}
                  sx={{
                    p: 3,
                    minWidth: 120,
                    background: 'linear-gradient(135deg, #FFFFFF 0%, #FFE5F1 50%, #FFF9E7 100%)',
                    borderRadius: 4,
                    border: '3px solid #FF6B9D',
                    transform: 'scale(1.05)',
                    transition: 'transform 0.3s ease',
                    '&:hover': {
                      transform: 'scale(1.1)',
                      boxShadow: '0 8px 16px rgba(255, 107, 157, 0.4)'
                    }
                  }}
                >
                  <Typography variant="h3" sx={{ 
                    color: '#C44569', 
                    fontWeight: 'bold',
                    textShadow: '1px 1px 2px rgba(0,0,0,0.1)'
                  }}>
                    {birthdayTimeLeft[interval]}
                  </Typography>
                  <Typography variant="h6" sx={{ 
                    color: '#FF6B9D', 
                    textTransform: 'capitalize',
                    fontWeight: 'bold'
                  }}>
                    {interval}
                  </Typography>
                </Paper>
              ))
            ) : (
              <Box sx={{ textAlign: 'center', p: 6 }}>
                <Typography variant="h1" sx={{ 
                  background: 'linear-gradient(45deg, #FF6B9D 30%, #FFD700 70%)',
                  backgroundClip: 'text',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                  fontWeight: 'bold',
                  mb: 3,
                  animation: 'bounce 1s infinite',
                  fontSize: { xs: '2.5rem', md: '4rem' }
                }}>
                  🎂 IT'S BIRTHDAY TIME! 🎂
                </Typography>
                
                <Typography variant="h3" sx={{ 
                  color: '#C44569', 
                  mb: 3,
                  fontWeight: 'bold',
                  fontSize: { xs: '1.8rem', md: '2.5rem' }
                }}>
                  👑 Kashvi's Special Day is HERE! 👑
                </Typography>
                
                <Typography variant="h4" sx={{ 
                  color: '#FF6B9D', 
                  mb: 4,
                  fontSize: { xs: '1.5rem', md: '2rem' }
                }}>
                  🌟 Happy 1st Birthday Princess! 🌟
                </Typography>

                {/* Special Message from Parents */}
                <Paper elevation={8} sx={{
                  background: 'linear-gradient(135deg, #FFFFFF 0%, #FFE5F1 50%, #FFF9E7 100%)',
                  border: '3px solid #FFD700',
                  borderRadius: 4,
                  p: 4,
                  mx: 'auto',
                  maxWidth: 600,
                  boxShadow: '0 12px 24px rgba(255, 215, 0, 0.3)',
                  animation: 'pulse 3s infinite'
                }}>
                  <Typography variant="h5" sx={{ 
                    color: '#C44569', 
                    mb: 3,
                    fontWeight: 'bold',
                    fontSize: { xs: '1.3rem', md: '1.5rem' }
                  }}>
                    💝 A Special Message for You 💝
                  </Typography>
                  
                  <Typography variant="h6" sx={{ 
                    color: '#666',
                    lineHeight: 1.6,
                    fontStyle: 'italic',
                    mb: 3,
                    fontSize: { xs: '1rem', md: '1.2rem' }
                  }}>
                    "Thank you for coming to celebrate our little princess Kashvi's 
                    first birthday! Your presence makes this day even more special. 
                    May this beautiful day be filled with joy, laughter, and wonderful 
                    memories that we'll treasure forever. 🌈✨"
                  </Typography>
                  
                  <Typography variant="h6" sx={{ 
                    color: '#FF6B9D',
                    fontWeight: 'bold',
                    fontSize: { xs: '1.1rem', md: '1.3rem' }
                  }}>
                    💕 With Love,<br />
                    Jyoti & Kaushal 💕
                  </Typography>
                </Paper>
                
                <Box sx={{ mt: 4, display: 'flex', justifyContent: 'center', gap: 2, flexWrap: 'wrap' }}>
                  <Typography sx={{ fontSize: '3rem', animation: 'bounce 1s infinite' }}>🎈</Typography>
                  <Typography sx={{ fontSize: '3rem', animation: 'bounce 1s infinite 0.2s' }}>🎂</Typography>
                  <Typography sx={{ fontSize: '3rem', animation: 'bounce 1s infinite 0.4s' }}>🎁</Typography>
                  <Typography sx={{ fontSize: '3rem', animation: 'bounce 1s infinite 0.6s' }}>🎉</Typography>
                  <Typography sx={{ fontSize: '3rem', animation: 'bounce 1s infinite 0.8s' }}>🌟</Typography>
                </Box>

                {/* Recent Messages Section */}
                {recentMessages.length > 0 && (
                  <Box sx={{ mt: 4 }}>
                    <Typography variant="h5" sx={{ 
                      color: '#FF6B9D', 
                      mb: 2,
                      fontWeight: 'bold',
                      fontSize: { xs: '1.1rem', md: '1.3rem' }
                    }}>
                      💌 Recent Messages 💌
                    </Typography>
                    <Box sx={{ display: 'flex', gap: 1, justifyContent: 'center', flexWrap: 'wrap' }}>
                      {recentMessages.map((msg, index) => (
                        <Paper
                          key={index}
                          elevation={4}
                          sx={{
                            p: 2,
                            maxWidth: 200,
                            background: 'linear-gradient(135deg, #FFF9E7 0%, #FFE5F1 100%)',
                            border: '2px solid #FFD700',
                            borderRadius: 3,
                            textAlign: 'center',
                            animation: `fadeIn 0.5s ease-in-out ${index * 0.2}s both`
                          }}
                        >
                          <Typography variant="body2" sx={{ 
                            fontWeight: 'bold', 
                            color: '#C44569',
                            fontSize: '0.9rem' 
                          }}>
                            {msg.name}
                          </Typography>
                          <Typography variant="body2" sx={{ 
                            color: '#666', 
                            fontSize: '0.8rem',
                            overflow: 'hidden',
                            textOverflow: 'ellipsis',
                            display: '-webkit-box',
                            WebkitLineClamp: 2,
                            WebkitBoxOrient: 'vertical'
                          }}>
                            {msg.message}
                          </Typography>
                        </Paper>
                      ))}
                    </Box>
                  </Box>
                )}
              </Box>
            )}
          </Box>
        </Box>
      </Box>

      {/* Event Countdown - Enhanced with Party Theme */}
      <Box sx={{ 
        background: 'linear-gradient(135deg, #FFE5F1 0%, #E8F8F5 50%, #FFF9E7 100%)',
        borderRadius: 4,
        p: 4,
        border: '3px solid #FF6B9D',
        boxShadow: '0 12px 24px rgba(255, 107, 157, 0.3)',
        position: 'relative',
        overflow: 'hidden',
        '&::before': {
          content: '""',
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: 'url("data:image/svg+xml,%3Csvg xmlns=\'http://www.w3.org/2000/svg\' viewBox=\'0 0 100 100\'%3E%3Ctext y=\'.9em\' font-size=\'90\'%3E🎉%3C/text%3E%3C/svg%3E") repeat',
          opacity: 0.05,
          backgroundSize: '50px 50px',
          zIndex: 0
        }
      }}>
        <Box sx={{ position: 'relative', zIndex: 1 }}>
          <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: 1, mb: 2 }}>
            <Typography sx={{ fontSize: '3rem' }}>🎪🎊</Typography>
            <Typography variant="h2" sx={{ 
              background: 'linear-gradient(45deg, #FF6B9D 30%, #4ECDC4 70%, #FFD700 100%)',
              backgroundClip: 'text',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              fontWeight: 'bold',
              textShadow: '2px 2px 4px rgba(0,0,0,0.1)',
              animation: 'pulse 2s infinite'
            }}>
              Party Countdown
            </Typography>
            <Typography sx={{ fontSize: '3rem' }}>🎊🎪</Typography>
          </Box>
          
          <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: 1, mb: 3 }}>
            <Typography sx={{ fontSize: '2rem' }}>🗓️</Typography>
            <Chip 
              label={`${eventDetails.eventDate === '2025-10-05' ? 'October 5th, 2025' : eventDetails.eventDate} - ${eventDetails.eventTime}`} 
              sx={{ 
                background: 'linear-gradient(45deg, #FFD700 30%, #FF6B9D 90%)',
                color: 'white',
                fontSize: '1.1rem',
                fontWeight: 'bold',
                px: 2,
                py: 1,
                '& .MuiChip-label': { px: 2 }
              }} 
            />
            <Typography sx={{ fontSize: '2rem' }}>🎈</Typography>
          </Box>
          
          <Box sx={{ display: 'flex', justifyContent: 'center', gap: 2, flexWrap: 'wrap' }}>
            {Object.keys(eventTimeLeft).length > 0 ? (
              Object.keys(eventTimeLeft).map(interval => (
                <Paper
                  key={interval}
                  elevation={8}
                  sx={{
                    p: 3,
                    minWidth: 120,
                    background: 'linear-gradient(135deg, #FFFFFF 0%, #FFE5F1 50%, #E8F8F5 100%)',
                    borderRadius: 4,
                    border: '3px solid #FF6B9D',
                    transform: 'scale(1.05)',
                    transition: 'transform 0.3s ease',
                    '&:hover': {
                      transform: 'scale(1.1)',
                      boxShadow: '0 8px 16px rgba(255, 107, 157, 0.4)'
                    }
                  }}
                >
                  <Typography variant="h3" sx={{ 
                    color: '#FF6B9D', 
                    fontWeight: 'bold',
                    textShadow: '1px 1px 2px rgba(0,0,0,0.1)'
                  }}>
                    {eventTimeLeft[interval]}
                  </Typography>
                  <Typography variant="h6" sx={{ 
                    color: '#4ECDC4', 
                    textTransform: 'capitalize',
                    fontWeight: 'bold'
                  }}>
                    {interval}
                  </Typography>
                </Paper>
              ))
            ) : (
              <Box sx={{ textAlign: 'center', p: 4 }}>
                <Typography variant="h2" sx={{ 
                  background: 'linear-gradient(45deg, #FF6B9D 30%, #FFD700 70%)',
                  backgroundClip: 'text',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                  fontWeight: 'bold',
                  mb: 3,
                  animation: 'bounce 1s infinite',
                  fontSize: { xs: '2.5rem', md: '4rem' }
                }}>
                  🎉 IT'S PARTY TIME! 🎉
                </Typography>
                
                <Typography variant="h3" sx={{ 
                  color: '#C44569', 
                  mb: 3,
                  fontWeight: 'bold',
                  fontSize: { xs: '1.8rem', md: '2.5rem' }
                }}>
                  🎂 Kashvi's Birthday Celebration is NOW! 🎂
                </Typography>

                {/* Special Message from Parents for Party Day */}
                <Paper elevation={8} sx={{
                  background: 'linear-gradient(135deg, #FFFFFF 0%, #FFE5F1 50%, #FFF9E7 100%)',
                  border: '3px solid #FFD700',
                  borderRadius: 4,
                  p: 4,
                  mx: 'auto',
                  maxWidth: 600,
                  mt: 4,
                  boxShadow: '0 12px 24px rgba(255, 215, 0, 0.3)',
                  animation: 'pulse 3s infinite'
                }}>
                  <Typography variant="h5" sx={{ 
                    color: '#C44569', 
                    mb: 3,
                    fontWeight: 'bold',
                    fontSize: { xs: '1.3rem', md: '1.5rem' }
                  }}>
                    � Thank You for Joining Us! 🎊
                  </Typography>
                  
                  <Typography variant="h6" sx={{ 
                    color: '#666',
                    lineHeight: 1.6,
                    fontStyle: 'italic',
                    mb: 3,
                    fontSize: { xs: '1rem', md: '1.2rem' }
                  }}>
                    "Welcome to Kashvi's 1st Birthday Celebration! Thank you for being here 
                    to make this special day even more memorable. Let's celebrate our little 
                    princess together with joy, laughter, and lots of fun! Your presence is 
                    the best gift we could ask for. 🌟✨"
                  </Typography>
                  
                  <Typography variant="h6" sx={{ 
                    color: '#FF6B9D',
                    fontWeight: 'bold',
                    fontSize: { xs: '1.1rem', md: '1.3rem' }
                  }}>
                    💕 With Love & Gratitude,<br />
                    Jyoti & Kaushal 💕
                  </Typography>
                </Paper>
                
                <Typography variant="h5" sx={{ 
                  color: '#4ECDC4', 
                  mt: 4,
                  fontSize: { xs: '1.3rem', md: '1.5rem' }
                }}>
                  🎈 Let's Celebrate Together! 🎈
                </Typography>
              </Box>
            )}
          </Box>
        </Box>
      </Box>

      {/* Venue Information */}
      <Box sx={{ mt: 6 }}>
        <Typography variant="h4" gutterBottom sx={{ 
          textAlign: 'center',
          background: 'linear-gradient(45deg, #FF6B9D 30%, #4ECDC4 90%)',
          backgroundClip: 'text',
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent',
          fontWeight: 'bold',
          mb: 3
        }}>
          🎪 Celebration Venue 🎪
        </Typography>
        
        <Grid container spacing={3} justifyContent="center">
          <Grid item xs={12} md={6}>
            <Card sx={{ 
              background: 'linear-gradient(135deg, #FFE5F1 0%, #FFF9E7 100%)',
              borderRadius: 4,
              border: '2px solid rgba(255, 111, 157, 0.2)',
              transition: 'transform 0.3s ease-in-out',
              '&:hover': {
                transform: 'translateY(-8px)',
                boxShadow: '0 8px 25px rgba(0,0,0,0.15)'
              }
            }}>
              <CardContent sx={{ textAlign: 'center', p: 3 }}>
                <LocationOn sx={{ fontSize: 40, color: '#FF6B9D', mb: 1 }} />
                <Typography variant="h6" sx={{ color: '#2D3436', fontWeight: 'bold', mb: 1 }}>
                  {eventDetails.eventVenue}
                </Typography>
                <Typography variant="body2" sx={{ color: '#636E72' }}>
                  {eventDetails.eventAddress}
                </Typography>
              </CardContent>
            </Card>
          </Grid>
          
          <Grid item xs={12} md={6}>
            <Card sx={{ 
              background: 'linear-gradient(135deg, #E8F8F5 0%, #FFE5F1 100%)',
              borderRadius: 4,
              border: '2px solid rgba(78, 205, 196, 0.2)',
              transition: 'transform 0.3s ease-in-out',
              '&:hover': {
                transform: 'translateY(-8px)',
                boxShadow: '0 8px 25px rgba(0,0,0,0.15)'
              }
            }}>
              <CardContent sx={{ textAlign: 'center', p: 3 }}>
                <Schedule sx={{ fontSize: 40, color: '#4ECDC4', mb: 1 }} />
                <Typography variant="h6" sx={{ color: '#2D3436', fontWeight: 'bold', mb: 1 }}>
                  Event Time
                </Typography>
                <Typography variant="body2" sx={{ color: '#636E72' }}>
                  {eventDetails.eventTime} onwards
                  <br />
                  {eventDetails.eventDate === '2025-10-05' ? 'October 5th, 2025' : eventDetails.eventDate}
                </Typography>
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      </Box>
    </Box>
  );
};

export default EventTimer;