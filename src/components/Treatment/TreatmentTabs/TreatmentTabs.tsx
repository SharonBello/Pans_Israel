import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Box, Tabs, Tab, useMediaQuery, useTheme } from '@mui/material';
import {
    Healing as TreatmentIcon,
    MedicalServices as DoctorsIcon,
    Spa as HolisticIcon,
} from '@mui/icons-material';
import './TreatmentTabs.scss';

const TREATMENT_TABS = [
    { id: 'treatment', label: 'דרכי טיפול', icon: <TreatmentIcon />, path: '/info/treatment' },
    { id: 'professionals', label: 'רופאים ומטפלים', icon: <DoctorsIcon />, path: '/Professionals-help' },
    { id: 'holistic', label: 'רפואה משלימה', icon: <HolisticIcon />, path: '/holistic' },
] as const;

const TreatmentTabs: React.FC = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

    const getCurrentIndex = (): number => {
        // Match /Professionals-help (with or without ?tab=...)
        if (location.pathname.startsWith('/Professionals-help')) return 1;
        if (location.pathname === '/holistic') return 2;
        if (location.pathname === '/info/treatment') return 0;
        return 0;
    };

    const handleChange = (_: React.SyntheticEvent, newValue: number) => {
        const tab = TREATMENT_TABS[newValue];
        if (tab) navigate(tab.path);
    };

    return (
        <Box className="treatment-tabs" dir="rtl">
            <Box className="treatment-tabs__container">
                <Tabs
                    value={getCurrentIndex()}
                    onChange={handleChange}
                    variant="scrollable"
                    scrollButtons="auto"
                    allowScrollButtonsMobile
                    className="treatment-tabs__tabs"
                    TabIndicatorProps={{ className: 'treatment-tabs__indicator' }}
                >
                    {TREATMENT_TABS.map((tab) => (
                        <Tab
                            key={tab.id}
                            icon={tab.icon}
                            iconPosition="start"
                            label={isMobile ? undefined : tab.label}
                            className="treatment-tabs__tab"
                            aria-label={tab.label}
                            title={tab.label}
                        />
                    ))}
                </Tabs>
            </Box>
            <Box className="treatment-tabs__decoration">
                <Box className="treatment-tabs__decoration-line" />
            </Box>
        </Box>
    );
};

export default TreatmentTabs;