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
  Typography,
  IconButton,
  Collapse,
  useTheme,
  useMediaQuery,
} from '@mui/material';
import {
  Home as HomeIcon,
  Info as InfoIcon,
  People as PeopleIcon,
  QuestionAnswer as QuestionAnswerIcon,
  LocalHospital as LocalHospitalIcon,
  Favorite as FavoriteIcon,
  ContactMail as ContactMailIcon,
  ExpandLess,
  ExpandMore,
  Close as CloseIcon,
  VolunteerActivism as VolunteerActivismIcon,
  Article as ArticleIcon,
} from '@mui/icons-material';
import { useNavigate, useLocation } from 'react-router-dom';
import './Sidebar.scss';

interface SidebarProps {
  open: boolean;
  onClose: () => void;
}

interface MenuItem {
  title: string;
  icon: React.ReactElement;
  path?: string;
  children?: MenuItem[];
}

const Sidebar: React.FC<SidebarProps> = ({ open, onClose }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  
  const [openSubmenu, setOpenSubmenu] = React.useState<string | null>(null);

  const menuItems: MenuItem[] = [
    {
      title: 'דף הבית',
      icon: <HomeIcon />,
      path: '/',
    },
    {
      title: 'מידע על התסמונות',
      icon: <InfoIcon />,
      children: [
        { title: 'מהן התסמונות?', icon: <InfoIcon />, path: '/syndromes/what' },
        { title: 'שאלות נפוצות', icon: <QuestionAnswerIcon />, path: '/syndromes/faq' },
        { title: 'מיתוסים מול עובדות', icon: <ArticleIcon />, path: '/syndromes/myths' },
      ],
    },
    {
      title: 'סיפורים וחוויות',
      icon: <PeopleIcon />,
      path: '/stories',
    },
    {
      title: 'תמיכה רגשית',
      icon: <FavoriteIcon />,
      children: [
        { title: 'כלים להתמודדות', icon: <LocalHospitalIcon />, path: '/support/tools' },
        { title: 'תמיכה למשפחה', icon: <PeopleIcon />, path: '/support/family' },
        { title: 'סיפורי תקווה', icon: <FavoriteIcon />, path: '/support/hope' },
      ],
    },
    {
      title: 'זכויות וסיוע',
      icon: <LocalHospitalIcon />,
      path: '/rights',
    },
    {
      title: 'משאבים להורים',
      icon: <ArticleIcon />,
      path: '/resources',
    },
    {
      title: 'קהילה',
      icon: <PeopleIcon />,
      path: '/community',
    },
    {
      title: 'תרומות והתנדבות',
      icon: <VolunteerActivismIcon />,
      path: '/donate',
    },
    {
      title: 'צור קשר',
      icon: <ContactMailIcon />,
      path: '/contact',
    },
  ];

  const handleMenuClick = (item: MenuItem) => {
    if (item.children) {
      setOpenSubmenu(openSubmenu === item.title ? null : item.title);
    } else if (item.path) {
      navigate(item.path);
      if (isMobile) {
        onClose();
      }
    }
  };

  const handleSubmenuClick = (path: string) => {
    navigate(path);
    if (isMobile) {
      onClose();
    }
  };

  const drawerWidth = 280;

  const drawer = (
    <Box
      className="sidebar"
      sx={{ height: '100%', direction: 'rtl' }}
      role="presentation"
    >
      {/* Sidebar Header */}
      <Box className="sidebar__header">
        <Typography variant="h6" sx={{ fontWeight: 700, color: '#2c5282' }}>
          תפריט ניווט
        </Typography>
        {isMobile && (
          <IconButton onClick={onClose} size="small">
            <CloseIcon />
          </IconButton>
        )}
      </Box>

      <Divider />

      {/* Menu Items */}
      <List className="sidebar__list">
        {menuItems.map((item) => (
          <Box key={item.title}>
            <ListItem disablePadding>
              <ListItemButton
                onClick={() => handleMenuClick(item)}
                selected={!item.children && location.pathname === item.path}
                sx={{
                  borderRadius: '8px',
                  margin: '4px 8px',
                  '&.Mui-selected': {
                    backgroundColor: '#e3f2fd',
                    '&:hover': {
                      backgroundColor: '#bbdefb',
                    },
                  },
                }}
              >
                <ListItemIcon sx={{ minWidth: 40, color: '#2c5282' }}>
                  {item.icon}
                </ListItemIcon>
                <ListItemText
                  primary={item.title}
                  primaryTypographyProps={{
                    fontWeight: location.pathname === item.path ? 600 : 400,
                  }}
                />
                {item.children &&
                  (openSubmenu === item.title ? <ExpandLess /> : <ExpandMore />)}
              </ListItemButton>
            </ListItem>

            {/* Submenu */}
            {item.children && (
              <Collapse in={openSubmenu === item.title} timeout="auto" unmountOnExit>
                <List component="div" disablePadding>
                  {item.children.map((child) => (
                    <ListItemButton
                      key={child.title}
                      onClick={() => child.path && handleSubmenuClick(child.path)}
                      selected={location.pathname === child.path}
                      sx={{
                        pl: 4,
                        borderRadius: '8px',
                        margin: '2px 8px',
                        '&.Mui-selected': {
                          backgroundColor: '#e3f2fd',
                          '&:hover': {
                            backgroundColor: '#bbdefb',
                          },
                        },
                      }}
                    >
                      <ListItemIcon sx={{ minWidth: 40, color: '#2c5282' }}>
                        {child.icon}
                      </ListItemIcon>
                      <ListItemText
                        primary={child.title}
                        primaryTypographyProps={{
                          fontSize: '0.9rem',
                          fontWeight: location.pathname === child.path ? 600 : 400,
                        }}
                      />
                    </ListItemButton>
                  ))}
                </List>
              </Collapse>
            )}
          </Box>
        ))}
      </List>
    </Box>
  );

  return (
    <Drawer
      variant={isMobile ? 'temporary' : 'persistent'}
      anchor="right"
      open={open}
      onClose={onClose}
      sx={{
        width: drawerWidth,
        flexShrink: 0,
        '& .MuiDrawer-paper': {
          width: drawerWidth,
          boxSizing: 'border-box',
          top: { xs: 56, sm: 64 },
          height: { xs: 'calc(100% - 56px)', sm: 'calc(100% - 64px)' },
        },
      }}
      ModalProps={{
        keepMounted: true, // Better mobile performance
      }}
    >
      {drawer}
    </Drawer>
  );
};

export default Sidebar;