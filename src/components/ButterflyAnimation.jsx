import React from 'react';
import { Box, keyframes } from '@mui/material';

const float = keyframes`
  0% { transform: translateY(0px) rotate(0deg); }
  33% { transform: translateY(-20px) rotate(5deg); }
  66% { transform: translateY(-10px) rotate(-5deg); }
  100% { transform: translateY(0px) rotate(0deg); }
`;

const flutter = keyframes`
  0% { transform: scaleX(1); }
  50% { transform: scaleX(0.8); }
  100% { transform: scaleX(1); }
`;

const flyAround = keyframes`
  0% { left: 10%; top: 20%; }
  25% { left: 80%; top: 30%; }
  50% { left: 70%; top: 70%; }
  75% { left: 20%; top: 80%; }
  100% { left: 10%; top: 20%; }
`;

const ButterflyAnimation = ({ count = 3 }) => {
  return (
    <>
      {[...Array(count)].map((_, index) => (
        <Box
          key={index}
          sx={{
            position: 'fixed',
            zIndex: 1,
            fontSize: '24px',
            animation: `${flyAround} ${15 + index * 5}s infinite linear, ${float} 3s ease-in-out infinite, ${flutter} 1s ease-in-out infinite`,
            animationDelay: `${index * 5}s`,
            pointerEvents: 'none',
            opacity: 0.7,
          }}
        >
          🦋
        </Box>
      ))}
    </>
  );
};

export default ButterflyAnimation;