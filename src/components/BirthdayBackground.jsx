// Birthday Background Component
import React from 'react';
import { Box } from '@mui/material';

const BirthdayBackground = () => {
  return (
    <>
      {/* Floating Balloons */}
      <Box sx={{
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        pointerEvents: 'none',
        zIndex: -1,
        '&::before': {
          content: '"🎈"',
          position: 'absolute',
          left: '10%',
          top: '20%',
          fontSize: '3rem',
          animation: 'float1 6s ease-in-out infinite'
        },
        '&::after': {
          content: '"🎈"',
          position: 'absolute',
          right: '15%',
          top: '30%',
          fontSize: '2.5rem',
          animation: 'float2 8s ease-in-out infinite'
        },
        '@keyframes float1': {
          '0%, 100%': { transform: 'translateY(0px) rotate(0deg)' },
          '50%': { transform: 'translateY(-20px) rotate(5deg)' }
        },
        '@keyframes float2': {
          '0%, 100%': { transform: 'translateY(0px) rotate(0deg)' },
          '50%': { transform: 'translateY(-15px) rotate(-3deg)' }
        }
      }}>
        {/* Additional floating elements */}
        <Box sx={{
          position: 'absolute',
          left: '80%',
          top: '60%',
          fontSize: '2rem',
          animation: 'spin 12s linear infinite'
        }}>
          🎊
        </Box>
        <Box sx={{
          position: 'absolute',
          left: '5%',
          top: '70%',
          fontSize: '2.5rem',
          animation: 'bounce 4s ease-in-out infinite'
        }}>
          🎁
        </Box>
        <Box sx={{
          position: 'absolute',
          right: '25%',
          top: '80%',
          fontSize: '2rem',
          animation: 'pulse 3s ease-in-out infinite'
        }}>
          🎂
        </Box>
      </Box>

      {/* Confetti Animation */}
      <Box sx={{
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        pointerEvents: 'none',
        zIndex: -1,
        '&::before': {
          content: '"✨ 🌟 ✨ 🌟 ✨"',
          position: 'absolute',
          top: '10%',
          left: '20%',
          right: '20%',
          fontSize: '1.5rem',
          opacity: 0.7,
          animation: 'sparkle 4s ease-in-out infinite'
        },
        '@keyframes spin': {
          '0%': { transform: 'rotate(0deg)' },
          '100%': { transform: 'rotate(360deg)' }
        },
        '@keyframes bounce': {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-25px)' }
        },
        '@keyframes pulse': {
          '0%, 100%': { transform: 'scale(1)' },
          '50%': { transform: 'scale(1.1)' }
        },
        '@keyframes sparkle': {
          '0%, 100%': { opacity: 0.7, transform: 'scale(1)' },
          '50%': { opacity: 1, transform: 'scale(1.2)' }
        }
      }} />
    </>
  );
};

export default BirthdayBackground;
