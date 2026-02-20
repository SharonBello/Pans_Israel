import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Box, Tabs, Tab, useMediaQuery, useTheme } from '@mui/material';
import {
    FamilyRestroom as ParentsIcon,
    Favorite as SupportIcon,
    RecordVoiceOver as TestimonialsIcon,
    VideoLibrary as VideoIcon,
} from '@mui/icons-material';
import './SupportTabs.scss';

const SUPPORT_TABS = [
    { id: 'parents', label: 'משאבים להורים', icon: <ParentsIcon />, path: '/resources/parents' },
    { id: 'support', label: 'תמיכה וקהילה', icon: <SupportIcon />, path: '/support' },
    { id: 'testimonials', label: 'עדויות הורים', icon: <TestimonialsIcon />, path: '/testimonials' },
    { id: 'videos', label: 'סרטונים', icon: <VideoIcon />, path: '/resources/videos' },
] as const;

const SupportTabs: React.FC = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

    const getCurrentIndex = (): number => {
        const path = location.pathname;
        if (path === '/resources/parents') return 0;
        if (path === '/support') return 1;
        if (path === '/testimonials') return 2;
        if (path === '/resources/videos') return 3;
        return 0;
    };

    const handleChange = (_: React.SyntheticEvent, newValue: number) => {
        navigate(SUPPORT_TABS[newValue].path);
    };

    return (
        <Box className="support-tabs" dir="rtl">
            <Box className="support-tabs__container">
                <Tabs
                    value={getCurrentIndex()}
                    onChange={handleChange}
                    variant="scrollable"
                    scrollButtons="auto"
                    allowScrollButtonsMobile
                    className="support-tabs__tabs"
                    TabIndicatorProps={{ className: 'support-tabs__indicator' }}
                >
                    {SUPPORT_TABS.map((tab) => (
                        <Tab
                            key={tab.id}
                            icon={tab.icon}
                            iconPosition="start"
                            label={isMobile ? undefined : tab.label}
                            className="support-tabs__tab"
                            aria-label={tab.label}
                            title={tab.label}
                        />
                    ))}
                </Tabs>
            </Box>
            <Box className="support-tabs__decoration" />
        </Box>
    );
};

export default SupportTabs;