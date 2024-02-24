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

  return (
    <Box sx={{ flexGrow: 1 }}>
      <AppBar position="static">
        <Toolbar>
          <IconButton
            size="large"
            edge="start"
            color="inherit"
            aria-label="menu"
            sx={{ mr: 2 }}
          >
            <MenuIcon />
          </IconButton>
          {/* Typographyをクリック可能にし、onClickでホームに遷移するように変更 */}
          <Typography variant="h6" component="div" sx={{ flexGrow: 1, cursor: 'pointer' }} onClick={() => {
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
          {user ? (
            <Button color="inherit" onClick={handleSignOut}>Sign out</Button>
          ) : (
            <>
              <Button color="inherit" onClick={() => router.push('/signin')}>Sign in</Button>
              <Button color="inherit" onClick={() => router.push('/signup')}>Sign up</Button>
            </>
          )}
        </Toolbar>
      </AppBar>
    </Box>
  );
};

export default Header;
