import React from 'react';
import { AppBar, Toolbar, Typography, Box, IconButton } from '@mui/material';
import LanguageSwitcher from '../LanguageSwitcher/LanguageSwitcher';
import './Header.scss';

const Header: React.FC = () => {
  return (
    <AppBar position="static" className="header-container">
      <Toolbar className="header-toolbar">
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
          <LanguageSwitcher />
        </Box>
        {/* לוגו בצד שמאל (לא חובה, אך אם תרצו להחזירו, הסירו את ההערה) */}
        <Box className="header-left">
        
          <IconButton edge="start" color="inherit" aria-label="logo" className="header-logo-button">
            🧠
          </IconButton>
         
        <Typography variant="h6" component="div" className="header-title">
          מדד פאנס/פאנדס
        </Typography>
        </Box>

        {/* אם תרצו ליישר אלמנטים בצד ימין (כגון כפתורי תפריט), ניתן להוסיף אותם כאן */}
        <Box className="header-right">
          {/* דוגמא לכפתור ניווט או אייקון נוסף */}
          <IconButton color="inherit" aria-label="settings">
            {/* <SettingsIcon /> */}
          </IconButton>
        </Box>
      </Toolbar>
    </AppBar>
  );
};

export default Header;
