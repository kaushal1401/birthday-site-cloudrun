import React from 'react';
import { CssBaseline, ThemeProvider, createTheme } from '@mui/material';
import { Container } from '@mui/material';
import EventTimer from './components/EventTimer';

const darkTheme = createTheme({
  palette: {
    mode: 'dark',
    primary: {
      main: '#e91e63',
    },
    secondary: {
      main: '#009688',
    },
    background: {
      default: '#121212',
      paper: '#1e1e1e',
    },
  },
});

function App() {
  return (
    <ThemeProvider theme={darkTheme}>
      <CssBaseline />
      <Container maxWidth="lg">
        <EventTimer />
      </Container>
    </ThemeProvider>
  );
}

export default App;