import React from 'react';
import EventTimer from './components/EventTimer';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import Container from '@mui/material/Container';

const theme = createTheme({
  palette: {
    mode: 'dark',
    primary: {
      main: '#ff4081',
    },
    secondary: {
      main: '#03dac6',
    },
  },
});

function App() {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Container>
        <EventTimer targetDate="2025-09-24T00:00:00Z" />
      </Container>
    </ThemeProvider>
  );
}

export default App;