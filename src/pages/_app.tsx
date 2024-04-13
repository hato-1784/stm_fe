import { AppProps } from 'next/app';
import Header from 'src/components/header';
import Footer from 'src/components/footer';
import { AuthProvider } from 'src/contexts/auth';
import { CssBaseline, Container, Box, createTheme, ThemeProvider } from '@mui/material';
import { jaJP } from '@mui/material/locale';
import { UploadSuccessProvider } from 'src/contexts/uploadSuccessContext';

// 日本語のテーマを作成
const theme = createTheme({
  typography: {
    fontSize: 14,
    h4: {
      fontSize: '1.6rem',
    },
  },
  mixins: {
    toolbar: {
      minHeight: 48, // ツールバーの最小高さを設定
    },
  },
  // ここに他のテーマ設定を追加できます
}, jaJP); // 日本語ロケールを適用

export function App({ Component, pageProps }: AppProps) {
  return (
    <ThemeProvider theme={theme}>
      <AuthProvider>
        <UploadSuccessProvider>
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
        </UploadSuccessProvider>
      </AuthProvider>
    </ThemeProvider>
  );
}

export default App;
