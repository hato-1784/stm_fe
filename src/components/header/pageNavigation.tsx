import React from 'react';
import { Box, Button } from '@mui/material';
import { PageNavigationProps } from 'src/interfaces/notice/component_notice';

const PageNavigation = ({ pages, navigateToPage }: PageNavigationProps) => (
  <Box sx={{ display: 'flex', justifyContent: 'flex-start', marginLeft: 2 }}>
    {pages.map((page) => (
      <Button key={page} color="inherit" onClick={() => navigateToPage(page)} sx={{ marginLeft: 1 }}>{page}</Button>
    ))}
  </Box>
);

export default PageNavigation;