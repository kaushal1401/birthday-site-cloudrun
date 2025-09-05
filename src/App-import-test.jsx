import React from 'react';
import { CssBaseline, ThemeProvider, createTheme, Box, Typography } from '@mui/material';

const theme = createTheme({
  palette: {
    primary: { main: '#FF6B9D' }
  }
});

function App() {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Box sx={{ p: 3 }}>
        <Typography variant="h2" sx={{ color: 'primary.main' }}>
          🎂 Import Test - Basic App Works
        </Typography>
      </Box>
    </ThemeProvider>
  );
}

export default App;
