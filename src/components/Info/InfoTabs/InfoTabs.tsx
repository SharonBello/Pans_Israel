import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Box, Tabs, Tab, useMediaQuery, useTheme } from '@mui/material';
import {
  Info as InfoIcon,
  MonitorHeart as SymptomsIcon,
  ContentPasteSearch as DiagnosisIcon,
  MedicalServices as TreatmentIcon,
  Groups as StoriesIcon,
} from '@mui/icons-material';
import { infoNavItems } from '../../../data/infoContent';
import './InfoTabs.scss';

interface InfoTabsProps {
  currentPage: string;
}

const iconMap: Record<string, React.ReactElement> = {
  overview: <InfoIcon />,
  symptoms: <SymptomsIcon />,
  diagnosis: <DiagnosisIcon />,
  treatment: <TreatmentIcon />,
  stories: <StoriesIcon />,
};

const InfoTabs: React.FC<InfoTabsProps> = ({ currentPage }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  const getCurrentTabIndex = () => {
    const index = infoNavItems.findIndex(
      (item) => location.pathname.includes(item.slug) || currentPage === item.slug
    );
    return index >= 0 ? index : 0;
  };

  const handleTabChange = (_event: React.SyntheticEvent, newValue: number) => {
    const item = infoNavItems[newValue];
    if (item) {
      navigate(`/info/${item.slug}`);
    }
  };

  return (
    <Box className="info-tabs" dir="rtl">
      <Box className="info-tabs__container">
        <Tabs
          value={getCurrentTabIndex()}
          onChange={handleTabChange}
          variant={isMobile ? 'scrollable' : 'fullWidth'}
          scrollButtons={isMobile ? 'auto' : false}
          allowScrollButtonsMobile
          className="info-tabs__tabs"
          TabIndicatorProps={{
            className: 'info-tabs__indicator',
          }}
        >
          {infoNavItems.map((item) => (
            <Tab
              key={item.id}
              icon={iconMap[item.id]}
              iconPosition="start"
              label={isMobile ? undefined : item.title}
              className="info-tabs__tab"
              aria-label={item.title}
            />
          ))}
        </Tabs>
      </Box>
      
      {/* Decorative line */}
      <Box className="info-tabs__decoration">
        <Box className="info-tabs__decoration-line" />
        <Box className="info-tabs__decoration-glow" />
      </Box>
    </Box>
  );
};

export default InfoTabs;
