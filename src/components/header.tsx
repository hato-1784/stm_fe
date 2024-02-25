import React from 'react';
import { useAuth } from 'src/contexts/auth';
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import IconButton from '@mui/material/IconButton';
import MenuIcon from '@mui/icons-material/Menu';
import { useRouter } from 'next/router'; // useRouterをインポート
import Cookies from 'js-cookie';

const Header = () => {
  const { user, signout } = useAuth();
  const router = useRouter(); // useRouterフックを使用

  const handleSignOut = async () => {
    try {
      await signout();
      router.push('/signin'); // サインアウト後にサインインページにリダイレクト
    } catch (error) {
      console.error("Sign out failed:", error);
    }
  };

  // ページリンクを追加
  const pages = ['顧客一覧', 'テスト', 'テスト'];

  // ページリンクの遷移先をカスタマイズ
  const navigateToPage = (page: string) => {
    if (page === '顧客一覧') {
      const accessToken = Cookies.get('access_token');
      if (!accessToken) {
        // ログインしていない場合はサインインページに遷移
        router.push('/signin');
      } else {
        // ログイン済みであれば顧客一覧(/stm)に遷移
        router.push('/stm');
      }
    } else {
      router.push(`/${page.toLowerCase()}`); // それ以外のページは小文字にして遷移
    }
  };

  return (
    <Box sx={{ flexGrow: 1 }}>
      <AppBar position="static">
        <Toolbar sx={{ justifyContent: 'space-between' }}> {/* Toolbar全体のスタイルを調整 */}
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            {/* Typographyの横幅を文字サイズに合わせて調整 */}
            <Typography variant="h6" component="div" sx={{ cursor: 'pointer' }} onClick={() => {
              const accessToken = Cookies.get('access_token');
              if (accessToken) {
                // ログイン済みであれば/stmにリダイレクト
                router.push('/stm');
              } else {
                // ログインしていない場合は/にリダイレクト
                router.push('/');
              }
            }}>
              STM
            </Typography>
            {/* ページリンクを左寄せで表示 */}
            <Box sx={{ display: 'flex', justifyContent: 'flex-start', marginLeft: 2 }}> {/* 左寄せのためのスタイルを追加 */}
              {pages.map((page) => (
                <Button key={page} color="inherit" onClick={() => navigateToPage(page)} sx={{ marginLeft: 1 }}>{page}</Button>
              ))}
            </Box>
          </Box>
          {/* Sign in, Sign up, Sign outを右寄せで配置 */}
          <Box sx={{ display: 'flex', flexGrow: 0 }}>
            {user ? (
              <Button color="inherit" onClick={handleSignOut}>Sign out</Button>
            ) : (
              <>
                <Button color="inherit" onClick={() => router.push('/signin')}>Sign in</Button>
                <Button color="inherit" onClick={() => router.push('/signup')}>Sign up</Button>
              </>
            )}
          </Box>
        </Toolbar>
      </AppBar>
    </Box>
  );
};

export default Header;
