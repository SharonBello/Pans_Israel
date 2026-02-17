import React from 'react';
import {
  Drawer,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Divider,
  Box,
  IconButton,
} from '@mui/material';
import {
  Home as HomeIcon,
  Info as InfoIcon,
  Favorite as FavoriteIcon,
  ContactMail as ContactMailIcon,
  Article as ArticleIcon,
  Close as CloseIcon,
  Groups as GroupsIcon,
} from '@mui/icons-material';
import { FiClipboard } from 'react-icons/fi';
import { useNavigate, useLocation } from 'react-router-dom';
import './Sidebar.scss';
import { FaWhatsapp } from 'react-icons/fa';

interface SidebarProps {
  open: boolean;
  onClose: () => void;
}

interface MenuItem {
  title: string;
  icon: React.ReactElement;
  path: string;
  isCta?: boolean;
}

const Sidebar: React.FC<SidebarProps> = ({ open, onClose }) => {
  const navigate = useNavigate();
  const location = useLocation();

  const menuItems: MenuItem[] = [
    { title: 'דף הבית', icon: <HomeIcon />, path: '/' },
    { title: 'אודות', icon: <GroupsIcon />, path: '/about' },
    { title: 'מידע', icon: <InfoIcon />, path: '/info' },
    { title: 'מטפלים', icon: <InfoIcon />, path: '/Professionals-help' },
    { title: 'תמיכה', icon: <FavoriteIcon />, path: '/support' },
    { title: 'משאבים', icon: <ArticleIcon />, path: '/resources' },
    { title: 'סקרים', icon: <FiClipboard />, path: '/surveys' },
    { title: 'צור קשר', icon: <FaWhatsapp />, path: '/contact', isCta: true },
  ];

  const handleMenuClick = (item: MenuItem) => {
    navigate(item.path);
    onClose();
  };

  const drawerWidth = 280;

  return (
    <Drawer
      variant="temporary"
      anchor="right"
      open={open}
      onClose={onClose}
      ModalProps={{
        keepMounted: true,
      }}
      sx={{
        zIndex: 1300, // Higher than header
        '& .MuiDrawer-paper': {
          width: drawerWidth,
          boxSizing: 'border-box',
          backgroundColor: '#fff',
        },
        '& .MuiBackdrop-root': {
          backgroundColor: 'rgba(0, 0, 0, 0.5)',
        },
      }}
    >
      <Box
        className="sidebar"
        sx={{ height: '100%', direction: 'rtl' }}
        role="presentation"
      >
        {/* Sidebar Header */}
        <Box className="sidebar__header">
          {/* <Typography variant="h6" sx={{ fontWeight: 700, color: '#2c5282' }}>
            תפריט ניווט
          </Typography> */}
          <IconButton onClick={onClose} size="small">
            <CloseIcon />
          </IconButton>
        </Box>

        <Divider />

        {/* Menu Items */}
        <List className="sidebar__list">
          {menuItems.map((item) => (
            <ListItem key={item.title} disablePadding>
              <ListItemButton
                onClick={() => handleMenuClick(item)}
                selected={location.pathname === item.path}
                sx={{
                  borderRadius: '8px',
                  margin: '4px 8px',
                  ...(item.isCta && {
                    backgroundColor: '#2c5282',
                    color: '#fff',
                    '&:hover': {
                      backgroundColor: '#1a365d',
                    },
                    '& .MuiListItemIcon-root': {
                      color: '#fff',
                    },
                  }),
                  '&.Mui-selected': {
                    backgroundColor: item.isCta ? '#1a365d' : '#e3f2fd',
                    '&:hover': {
                      backgroundColor: item.isCta ? '#1a365d' : '#bbdefb',
                    },
                  },
                }}
              >
                <ListItemIcon sx={{ minWidth: 40, color: item.isCta ? '#fff' : '#2c5282' }}>
                  {item.icon}
                </ListItemIcon>
                <ListItemText
                  primary={item.title}
                  primaryTypographyProps={{
                    fontWeight: location.pathname === item.path ? 600 : 400,
                  }}
                />
              </ListItemButton>
            </ListItem>
          ))}
        </List>
      </Box>
    </Drawer>
  );
};

export default Sidebar;