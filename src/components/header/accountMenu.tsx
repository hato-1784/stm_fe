import React from 'react';
import { Menu, MenuItem } from '@mui/material';
import { AccountMenuProps } from 'src/interfaces/notice/component_notice';

const AccountMenu = ({ anchorEl, isMenuOpen, handleMenuClose, handleSignOut }: AccountMenuProps) => (
  <Menu
    anchorEl={anchorEl}
    anchorOrigin={{
      vertical: 'top',
      horizontal: 'right',
    }}
    id="primary-search-account-menu"
    keepMounted
    transformOrigin={{
      vertical: 'top',
      horizontal: 'right',
    }}
    open={isMenuOpen}
    onClose={handleMenuClose}
  >
    <MenuItem onClick={handleSignOut}>Sign out</MenuItem>
  </Menu>
);

export default AccountMenu;