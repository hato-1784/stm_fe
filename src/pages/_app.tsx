import { AppProps } from 'next/app';
import Header from 'src/components/header';
import { AuthProvider } from 'src/contexts/auth';

export function App({ Component, pageProps }: AppProps) {
  return (
    <AuthProvider>
      <Header />
      <Component {...pageProps} />
    </AuthProvider>
  );
}

export default App;