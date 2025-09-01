import React, { useState, useEffect } from 'react';
import { Box, Typography, Paper } from '@mui/material';

const EventTimer = () => {
  const [timeLeft, setTimeLeft] = useState(calculateTimeLeft());

  function calculateTimeLeft() {
    const difference = new Date('2025-09-24T00:00:00Z') - new Date();
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
      setTimeLeft(calculateTimeLeft());
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  return (
    <Box sx={{ textAlign: 'center', mt: 4 }}>
      <Typography variant="h3" gutterBottom>
        Birthday Countdown
      </Typography>
      <Box sx={{ display: 'flex', justifyContent: 'center', gap: 2 }}>
        {Object.keys(timeLeft).length > 0 ? (
          Object.keys(timeLeft).map(interval => (
            <Paper
              key={interval}
              elevation={3}
              sx={{
                p: 2,
                minWidth: 100,
                backgroundColor: 'rgba(255, 255, 255, 0.05)'
              }}
            >
              <Typography variant="h4">{timeLeft[interval]}</Typography>
              <Typography variant="subtitle1">{interval}</Typography>
            </Paper>
          ))
        ) : (
          <Typography variant="h4">Happy Birthday! 🎉</Typography>
        )}
      </Box>
    </Box>
  );
};

export default EventTimer;