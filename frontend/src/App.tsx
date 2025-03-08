import React from 'react';
import { ThemeProvider, createTheme, CssBaseline, Box, Container } from '@mui/material';
import Dashboard from './components/Dashboard';

const theme = createTheme({
  palette: {
    mode: 'light',
    primary: {
      main: '#1976d2',
    },
    secondary: {
      main: '#dc004e',
    },
  },
});

function App() {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Box
        sx={{
          bgcolor: 'background.default',
          minHeight: '100vh',
          py: 4,
        }}
      >
        <Container>
          <Dashboard />
        </Container>
      </Box>
    </ThemeProvider>
  );
}

export default App;
