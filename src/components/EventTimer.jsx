import React, { useState, useEffect } from 'react';
import { Box, Typography, Paper, Chip, Card, CardContent, Grid } from '@mui/material';
import { 
  CakeOutlined, 
  CelebrationOutlined, 
  LocationOn, 
  Schedule, 
  CalendarToday 
} from '@mui/icons-material';

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

  function calculateBirthdayTimeLeft() {
    const birthdayDate = process.env.REACT_APP_BIRTHDAY_DATE || '2025-09-24';
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
    const eventDate = process.env.REACT_APP_EVENT_DATE || '2025-10-05';
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

    return () => clearInterval(timer);
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
              <Box sx={{ textAlign: 'center', p: 4 }}>
                <Typography variant="h2" sx={{ 
                  background: 'linear-gradient(45deg, #FF6B9D 30%, #FFD700 70%)',
                  backgroundClip: 'text',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                  fontWeight: 'bold',
                  mb: 2,
                  animation: 'bounce 1s infinite'
                }}>
                  🎂 IT'S BIRTHDAY TIME! 🎂
                </Typography>
                <Typography variant="h4" sx={{ color: '#C44569', mb: 2 }}>
                  👑 Kashvi's Special Day is HERE! 👑
                </Typography>
                <Typography variant="h5" sx={{ color: '#FF6B9D' }}>
                  � Happy 1st Birthday Princess! �
                </Typography>
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
              label="October 5th, 2025 - 6:30 PM" 
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
                  mb: 2,
                  animation: 'bounce 1s infinite'
                }}>
                  🎉 IT'S PARTY TIME! 🎉
                </Typography>
                <Typography variant="h4" sx={{ color: '#4ECDC4', mb: 2 }}>
                  � Kashvi's Birthday Celebration is NOW! 🎂
                </Typography>
                <Typography variant="h5" sx={{ color: '#FF6B9D' }}>
                  🎈 Welcome to the Party! Let's Celebrate! �
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
                  Mythri Banquet Hall
                </Typography>
                <Typography variant="body2" sx={{ color: '#636E72' }}>
                  8350 N MacArthur Blvd Suite 190
                  <br />
                  Irving, TX 75063
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
                  6:30 PM onwards
                  <br />
                  October 5th, 2025
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