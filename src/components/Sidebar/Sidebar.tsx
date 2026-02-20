import React, { useState } from 'react';
import {
  Drawer, List, ListItem, ListItemButton, ListItemIcon,
  ListItemText, Divider, Box, IconButton, Collapse,
} from '@mui/material';
import {
  Home as HomeIcon,
  Groups as GroupsIcon,
  Psychology as PsychologyIcon,
  Healing as HealingIcon,
  Science as ScienceIcon,
  Close as CloseIcon,
  ExpandMore as ExpandMoreIcon,
  ExpandLess as ExpandLessIcon,
  MedicalServices as MedicalIcon,
  School as SchoolIcon,
  VideoLibrary as VideoIcon,
  Article as ArticleIcon,
  Language as LanguageIcon,
  Forum as ForumIcon,
  Assessment as AssessmentIcon,
  Favorite as FavoriteIcon,
  Biotech as BiotechIcon,
  ContentPaste as SurveyIcon,
  Info as InfoIcon,
  SupportAgent as SupportIcon,
} from '@mui/icons-material';
import { FaWhatsapp } from 'react-icons/fa';
import { useNavigate, useLocation } from 'react-router-dom';
import './Sidebar.scss';

interface SidebarProps {
  open: boolean;
  onClose: () => void;
}

interface ChildItem {
  label: string;
  path: string;
  icon?: React.ReactElement;
}

interface MenuItem {
  label: string;
  icon: React.ReactElement;
  path?: string;
  isCta?: boolean;
  isExternal?: boolean;
  externalUrl?: string;
  children?: ChildItem[];
}

const WHATSAPP_URL =
  'https://wa.me/972544767146?text=' +
  encodeURIComponent(
    'שלום,\nאני יוצר/ת קשר דרך אתר פאנס/פאנדס - העמותה הישראלית לאנספיליטיס אוטואימוני.\nאשמח לשוחח בנושא:'
  );

const MENU_ITEMS: MenuItem[] = [
  {
    label: 'דף הבית',
    icon: <HomeIcon />,
    path: '/',
  },
  {
    label: 'תסמינים ואבחון',
    icon: <PsychologyIcon />,
    children: [
      { label: 'סקירה כללית', path: '/info/overview', icon: <InfoIcon fontSize="small" /> },
      { label: 'תסמינים נפוצים', path: '/info/symptoms', icon: <PsychologyIcon fontSize="small" /> },
      { label: 'אבחון', path: '/info/diagnosis', icon: <BiotechIcon fontSize="small" /> },
      { label: 'כלי הערכה', path: '/info/scales', icon: <AssessmentIcon fontSize="small" /> },
    ],
  },
  {
    label: 'אפשרויות טיפול',
    icon: <HealingIcon />,
    children: [
      { label: 'דרכי טיפול', path: '/info/treatment', icon: <HealingIcon fontSize="small" /> },
      { label: 'רשימת רופאים ומטפלים', path: '/Professionals-help', icon: <MedicalIcon fontSize="small" /> },
      { label: 'רפואה משלימה', path: '/Professionals-help?tab=holistic', icon: <HealingIcon fontSize="small" /> },
    ],
  },
  {
    label: 'תמיכה וקהילה',
    icon: <SupportIcon />,
    children: [
      { label: 'משאבים להורים', path: '/resources/parents', icon: <GroupsIcon fontSize="small" /> },
      { label: 'תמיכה וקהילה', path: '/support', icon: <FavoriteIcon fontSize="small" /> },
      { label: 'עדויות הורים', path: '/testimonials', icon: <ForumIcon fontSize="small" /> },
      { label: 'סרטונים ווובינרים', path: '/resources/videos', icon: <VideoIcon fontSize="small" /> },
    ],
  },
  {
    label: 'מידע מקצועי',
    icon: <ScienceIcon />,
    children: [
      { label: 'אבחון וטיפול', path: '/professional/diagnosis', icon: <BiotechIcon fontSize="small" /> },
      { label: 'מידע לצוות חינוכי', path: '/professional/education', icon: <SchoolIcon fontSize="small" /> },
      { label: 'מאמרים מדעיים', path: '/professional/articles', icon: <ArticleIcon fontSize="small" /> },
      { label: 'אתרים בינלאומיים', path: '/professional/international', icon: <LanguageIcon fontSize="small" /> },
      { label: 'מחקרים קליניים', path: '/professional/research', icon: <ScienceIcon fontSize="small" /> },
      { label: 'סקרים', path: '/professional/surveys', icon: <SurveyIcon fontSize="small" /> },
    ],
  },
  {
    label: 'העמותה',
    icon: <GroupsIcon />,
    path: '/about',
  },
  {
    label: 'צור קשר',
    icon: <FaWhatsapp />,
    isCta: true,
    isExternal: true,
    externalUrl: WHATSAPP_URL,
  },
];

const PRIMARY = '#023373';
const CTA_BG = '#25d366';

const Sidebar: React.FC<SidebarProps> = ({ open, onClose }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const [expanded, setExpanded] = useState<string | null>(null);

  const handleToggle = (label: string) =>
    setExpanded(prev => (prev === label ? null : label));

  const handleNavigate = (item: MenuItem | ChildItem) => {
    if ('isExternal' in item && item.isExternal && 'externalUrl' in item && item.externalUrl) {
      window.open(item.externalUrl, '_blank');
    } else if (item.path) {
      navigate(item.path);
    }
    onClose();
  };

  const isParentActive = (item: MenuItem): boolean =>
    item.children?.some(c => location.pathname === c.path.split('?')[0]) ?? false;

  return (
    <Drawer
      variant="temporary"
      anchor="right"
      open={open}
      onClose={onClose}
      ModalProps={{ keepMounted: true }}
      sx={{
        zIndex: 1300,
        '& .MuiDrawer-paper': {
          width: 290,
          boxSizing: 'border-box',
          backgroundColor: '#fff',
          direction: 'rtl',
          overflowX: 'hidden',
        },
        '& .MuiBackdrop-root': { backgroundColor: 'rgba(0,0,0,0.45)' },
      }}
    >
      <Box className="sidebar" sx={{ height: '100%', direction: 'rtl', overflowY: 'auto' }}>

        <Box className="sidebar__header">
          <IconButton onClick={onClose} size="small" aria-label="סגור תפריט">
            <CloseIcon />
          </IconButton>
        </Box>

        <Divider />

        <List disablePadding sx={{ py: 1 }}>
          {MENU_ITEMS.map((item) => {
            const hasChildren = Boolean(item.children?.length);
            const isOpen = expanded === item.label;
            const parentActive = isParentActive(item);
            const selfActive = item.path ? location.pathname === item.path : false;
            const isActive = selfActive || parentActive;

            return (
              <React.Fragment key={item.label}>
                <ListItem disablePadding>
                  <ListItemButton
                    onClick={() => hasChildren ? handleToggle(item.label) : handleNavigate(item)}
                    sx={{
                      borderRadius: '8px',
                      mx: '8px',
                      my: '2px',
                      minHeight: 46,
                      ...(item.isCta && {
                        mt: 1,
                        backgroundColor: CTA_BG,
                        color: '#fff',
                        '&:hover': { backgroundColor: '#1da851' },
                        '& .MuiListItemIcon-root': { color: '#fff' },
                      }),
                      ...(!item.isCta && isActive && {
                        backgroundColor: 'rgba(2,51,115,0.07)',
                      }),
                      '&:hover': !item.isCta ? { backgroundColor: 'rgba(2,51,115,0.06)' } : {},
                    }}
                  >
                    <ListItemIcon sx={{ minWidth: 36, color: item.isCta ? '#fff' : isActive ? PRIMARY : '#607d8b' }}>
                      {item.icon}
                    </ListItemIcon>
                    <ListItemText
                      primary={item.label}
                      primaryTypographyProps={{
                        fontSize: '0.88rem',
                        fontWeight: isActive ? 700 : 500,
                        fontFamily: "'Heebo','Assistant',sans-serif",
                        color: item.isCta ? '#fff' : isActive ? PRIMARY : '#2d3748',
                      }}
                    />
                    {hasChildren && (
                      isOpen
                        ? <ExpandLessIcon sx={{ fontSize: '1rem', color: PRIMARY }} />
                        : <ExpandMoreIcon sx={{ fontSize: '1rem', color: '#90a4ae' }} />
                    )}
                  </ListItemButton>
                </ListItem>

                {hasChildren && (
                  <Collapse in={isOpen} timeout="auto" unmountOnExit>
                    <List disablePadding>
                      {item.children!.map((child) => {
                        const childActive = location.pathname === child.path.split('?')[0];
                        return (
                          <ListItem key={child.path} disablePadding>
                            <ListItemButton
                              onClick={() => handleNavigate(child)}
                              sx={{
                                borderRadius: '8px',
                                mx: '8px',
                                mr: '20px',
                                my: '1px',
                                minHeight: 38,
                                backgroundColor: childActive ? 'rgba(2,51,115,0.07)' : 'transparent',
                                '&:hover': { backgroundColor: 'rgba(2,51,115,0.05)' },
                              }}
                            >
                              {child.icon && (
                                <ListItemIcon sx={{ minWidth: 30, color: childActive ? PRIMARY : '#90a4ae' }}>
                                  {child.icon}
                                </ListItemIcon>
                              )}
                              <ListItemText
                                primary={child.label}
                                primaryTypographyProps={{
                                  fontSize: '0.81rem',
                                  fontWeight: childActive ? 700 : 400,
                                  fontFamily: "'Heebo','Assistant',sans-serif",
                                  color: childActive ? PRIMARY : '#455a64',
                                }}
                              />
                              {childActive && (
                                <Box sx={{ width: 3, height: 18, borderRadius: 2, backgroundColor: PRIMARY, flexShrink: 0 }} />
                              )}
                            </ListItemButton>
                          </ListItem>
                        );
                      })}
                    </List>
                  </Collapse>
                )}
              </React.Fragment>
            );
          })}
        </List>
      </Box>
    </Drawer>
  );
};

export default Sidebar;