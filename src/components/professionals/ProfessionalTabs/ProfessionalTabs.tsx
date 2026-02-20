import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Box, Tabs, Tab, useMediaQuery, useTheme } from '@mui/material';
import {
    MedicalServices as DiagnosisIcon,
    School as EducationIcon,
    Article as ArticlesIcon,
    Language as InternationalIcon,
    Biotech as ResearchIcon,
    BarChart as SurveysIcon,
} from '@mui/icons-material';
import './ProfessionalTabs.scss';

const PROF_TABS = [
    { id: 'diagnosis', label: 'אבחון וטיפול', icon: <DiagnosisIcon />, path: '/professional/diagnosis' },
    { id: 'education', label: 'מידע לצוות חינוכי', icon: <EducationIcon />, path: '/professional/education' },
    { id: 'articles', label: 'מאמרים מדעיים', icon: <ArticlesIcon />, path: '/professional/articles' },
    { id: 'international', label: 'אתרים בינלאומיים', icon: <InternationalIcon />, path: '/professional/international' },
    { id: 'research', label: 'מחקרים קליניים', icon: <ResearchIcon />, path: '/professional/research' },
    { id: 'surveys', label: 'סקרים', icon: <SurveysIcon />, path: '/professional/surveys' },
] as const;

type ProfTabId = typeof PROF_TABS[number]['id'];

const ProfessionalTabs: React.FC = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

    const currentIndex = (): number => {
        const path = location.pathname;
        const idx = PROF_TABS.findIndex(t => path.startsWith(t.path));
        return idx >= 0 ? idx : 0;
    };

    const handleChange = (_: React.SyntheticEvent, newValue: number) => {
        navigate(PROF_TABS[newValue].path);
    };

    return (
        <Box className="professional-tabs" dir="rtl">
            <Box className="professional-tabs__container">
                <Tabs
                    value={currentIndex()}
                    onChange={handleChange}
                    variant="scrollable"
                    scrollButtons="auto"
                    allowScrollButtonsMobile
                    className="professional-tabs__tabs"
                    TabIndicatorProps={{ className: 'professional-tabs__indicator' }}
                >
                    {PROF_TABS.map((tab) => (
                        <Tab
                            key={tab.id}
                            icon={tab.icon}
                            iconPosition="start"
                            label={isMobile ? undefined : tab.label}
                            className="professional-tabs__tab"
                            aria-label={tab.label}
                            title={tab.label}
                        />
                    ))}
                </Tabs>
            </Box>
            <Box className="professional-tabs__decoration" />
        </Box>
    );
};

export default ProfessionalTabs;