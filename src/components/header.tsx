import React from 'react';
import { AppBar, Box, Toolbar, Typography, IconButton, Badge, Button } from '@mui/material';
import AccountCircle from '@mui/icons-material/AccountCircle';
import NotificationsIcon from '@mui/icons-material/Notifications';
import { useRouter } from 'next/router';
import Cookies from 'js-cookie';

// 分割したコンポーネントをインポート
import NoticeDrawer from 'src/components/header/noticeDrawer';
import AccountMenu from 'src/components/header/accountMenu';
import PageNavigation from 'src/components/header/pageNavigation';

// カスタムフックをインポート
import useNotice from 'src/hooks/header/useNotice';
import useDrawerState from 'src/hooks/header/useDrawerState';
import useDropdownState from 'src/hooks/header/useDropdownState';
import { useAuth } from 'src/contexts/auth';
import { useUploadSuccess } from 'src/contexts/uploadSuccessContext';

const Header = () => {
  const { user, signout } = useAuth();
  const router = useRouter();
  const [notification, setNotification] = useUploadSuccess();
  const uploadSuccess = notification.uploadSuccess;

  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
  const isMenuOpen = Boolean(anchorEl);

  const notice = useNotice();
  const { isDrawerOpen, toggleDrawer } = useDrawerState();
  const { openDropdown, handleDropdownClick } = useDropdownState();

  const handleProfileMenuOpen = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const handleSignOut = () => {
    handleMenuClose();
    try {
      signout();
      router.push('/signin');
    } catch (error) {
      console.error("Sign out failed:", error);
    }
  };

  const pages = ['顧客一覧', 'テスト', 'テスト'];
  const navigateToPage = (page: string) => {
    switch (page) {
      case '顧客一覧':
        router.push('/stm');
        break;
      // 他のページの遷移ロジックもここに追加...
      default:
        break;
    }
  };

  return (
    <Box sx={{ flexGrow: 1 }}>
      <AppBar position="static">
        <Toolbar sx={{ justifyContent: 'space-between' }}>
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <Typography variant="h5" component="div" sx={{ cursor: 'pointer' }} onClick={() => {
              const accessToken = Cookies.get('access_token');
              if (accessToken) {
                router.push('/stm');
              } else {
                router.push('/');
              }
            }}>
              STM
            </Typography>
            <PageNavigation pages={pages} navigateToPage={navigateToPage} />
          </Box>
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <IconButton size="large" color="inherit" onClick={() => toggleDrawer(true)}>
              <Badge badgeContent={uploadSuccess ? 1 : 0} color="error">
                <NotificationsIcon />
              </Badge>
            </IconButton>
            {user ? (
              <>
                <IconButton
                  size="large"
                  edge="end"
                  aria-label="account of current user"
                  aria-controls="primary-search-account-menu"
                  aria-haspopup="true"
                  onClick={handleProfileMenuOpen}
                  color="inherit"
                >
                  <AccountCircle />
                </IconButton>
              </>
            ) : (
              <>
                <Button color="inherit" onClick={() => router.push('/signin')}>Sign in</Button>
                <Button color="inherit" onClick={() => router.push('/signup')}>Sign up</Button>
              </>
            )}
          </Box>
        </Toolbar>
      </AppBar>
      <AccountMenu anchorEl={anchorEl} isMenuOpen={isMenuOpen} handleMenuClose={handleMenuClose} handleSignOut={handleSignOut} />
      <NoticeDrawer isOpen={isDrawerOpen} toggleDrawer={toggleDrawer} notice={notice} openDropdown={openDropdown} handleDropdownClick={handleDropdownClick} />
    </Box>
  );
};

export default Header;