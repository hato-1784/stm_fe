import { AppProps } from 'next/app';
import Header from 'src/components/header';
import Footer from 'src/components/footer';
import { AuthProvider } from 'src/contexts/auth';
import { CssBaseline, Container, Box, createTheme, ThemeProvider } from '@mui/material';

export function App({ Component, pageProps }: AppProps) {
  return (
    <AuthProvider>
      <CssBaseline />
      <Box display="flex" flexDirection="column" minHeight="100vh">
        <Box component="header" sx={{ flexGrow: 0 }}>
          <Header />
        </Box>
        <Container component="main" fixed sx={{ flexGrow: 1 }}>
          <Component {...pageProps} />
        </Container>
        <Box component="footer" sx={{ flexGrow: 0 }}>
          <Footer />
        </Box>
      </Box>
    </AuthProvider>
  );
}

export default App;
