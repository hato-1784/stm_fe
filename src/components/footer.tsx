import React from 'react';
import Box from '@mui/material/Box';
import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import { useTheme } from '@mui/material/styles';

const Footer = () => {

  return (
    <Box
      component="footer"
      sx={{
        flexGrow: 1,
        position: 'relative',
        bottom: 0,
        width: '100%',
        backgroundColor: 'transparent'
      }}
    >
      <AppBar position="static" color="transparent" elevation={0}>
        <Toolbar>
          <Typography variant="caption" sx={{ flexGrow: 1 }}>
            © 2023 STM
          </Typography>
        </Toolbar>
      </AppBar>
    </Box>
  );
};

export default Footer;
