import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Box, Tabs, Tab, useMediaQuery, useTheme } from '@mui/material';
import {
    FamilyRestroom as ParentsIcon,
    Favorite as SupportIcon,
    RecordVoiceOver as TestimonialsIcon,
    VideoLibrary as VideoIcon,
    Article as ArticleIcon,
    Newspaper as NewspaperIcon,
    Event as EventIcon,
} from '@mui/icons-material';
import './SupportTabs.scss';

const SUPPORT_TABS = [
    { id: 'parents', label: 'משאבים להורים', icon: <ParentsIcon />, path: '/resources/parents' },
    { id: 'community_articles', label: 'מאמרים מהקהילה ומטפלים', icon: <ArticleIcon />, path: '/community/articles' },
    { id: 'media_coverage', label: 'פורסם בתקשורת', icon: <NewspaperIcon />, path: '/resources/media-coverage' },
    { id: 'support', label: 'תמיכה וקהילה', icon: <SupportIcon />, path: '/support' },
    { id: 'testimonials', label: 'עדויות הורים', icon: <TestimonialsIcon />, path: '/testimonials' },
    { id: 'activities', label: 'פעילויות', icon: <EventIcon />, path: '/activities' },
    { id: 'videos', label: 'סרטונים', icon: <VideoIcon />, path: '/resources/videos' },
] as const;

const SupportTabs: React.FC = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

    const currentIndex = Math.max(
        0,
        SUPPORT_TABS.findIndex((tab) => tab.path === location.pathname),
    );

    const handleChange = (_: React.SyntheticEvent, newValue: number) => {
        navigate(SUPPORT_TABS[newValue].path);
    };

    return (
        <Box className="support-tabs" dir="rtl">
            <Box className="support-tabs__container">
                <Tabs
                    value={currentIndex}
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