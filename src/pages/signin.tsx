import * as React from 'react';
import { useAuth } from 'src/contexts/auth';
import SignInForm from 'src/components/signIn/signInForm';
import Container from '@mui/material/Container';
import Box from '@mui/material/Box';
import Avatar from '@mui/material/Avatar';
import Typography from '@mui/material/Typography';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import Copyright from 'src/components/copyright';

export default function SignIn() {
  const { signin } = useAuth();

  const handleSignIn = async (username: string, password: string) => {
    try {
      await signin(username, password);
    } catch (err) {
      alert("サインインに失敗しました");
    }
  };

  return (
    <Container component="main" maxWidth="xs">
      <Box sx={{ marginTop: 8, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
        <Avatar sx={{ m: 1, bgcolor: 'secondary.main' }}>
          <LockOutlinedIcon />
        </Avatar>
        <Typography component="h1" variant="h5">
          Sign in
        </Typography>
        <SignInForm onSignIn={handleSignIn} />
      </Box>
      <Copyright sx={{ mt: 8, mb: 4 }} />
    </Container>
  );
}