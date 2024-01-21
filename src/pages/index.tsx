import React from "react";
import { createTheme, ThemeProvider } from '@mui/material/styles';
import Container from '@mui/material/Container';
import CssBaseline from '@mui/material/CssBaseline';

const defaultTheme = createTheme();

const Index = () => {
  return (
    <ThemeProvider theme={defaultTheme}>
      <Container component="main" maxWidth="xs">
        <CssBaseline />
        <p>test</p>
      </Container>
    </ThemeProvider>
  );
}

export default Index;