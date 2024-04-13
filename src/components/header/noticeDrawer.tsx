import React from 'react';
import { Drawer, Box, Typography, List, ListItem, ListItemText } from '@mui/material';
import ArrowDropDownIcon from '@mui/icons-material/ArrowDropDown';
import { NoticeDrawerProps } from 'src/interfaces/notice/component_notice';

const NoticeDrawer = ({ isOpen, toggleDrawer, notice, openDropdown, handleDropdownClick }: NoticeDrawerProps) => (
  <Drawer
    anchor="right"
    open={isOpen}
    onClose={() => toggleDrawer(false)}
    ModalProps={{
      keepMounted: true,
    }}
  >
    <Box
      sx={{ width: 250 }}
      role="presentation"
      onKeyDown={() => toggleDrawer(false)}
    >
      <Typography variant="h6" component="div" sx={{ padding: 2 }}>
        通知
      </Typography>
      <List>
        {notice.map((notification, index) => (
          <React.Fragment key={index}>
            <ListItem disablePadding onClick={(event) => { event.stopPropagation(); handleDropdownClick(index); }}>
              <ListItemText primary={notification.title} />
              <ArrowDropDownIcon />
            </ListItem>
            {openDropdown === index && (
              <Box sx={{ paddingLeft: 4, paddingRight: 4, paddingBottom: 2 }}>
                <Typography variant="body2">{notification.message}</Typography>
              </Box>
            )}
          </React.Fragment>
        ))}
      </List>
    </Box>
  </Drawer>
);

export default NoticeDrawer;