import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Box, Tabs, Tab, useMediaQuery, useTheme } from '@mui/material';
import {
  Info as OverviewIcon,
  Psychology as SymptomsIcon,
  Biotech as DiagnosisIcon,
  Assessment as ScalesIcon,
} from '@mui/icons-material';
import './InfoTabs.scss';

interface InfoTabsProps {
  currentPage: string;
}

const INFO_TABS = [
  { id: 'overview', slug: 'overview', label: 'סקירה כללית', icon: <OverviewIcon /> },
  { id: 'symptoms', slug: 'symptoms', label: 'תסמינים נפוצים', icon: <SymptomsIcon /> },
  { id: 'diagnosis', slug: 'diagnosis', label: 'אבחון', icon: <DiagnosisIcon /> },
  { id: 'scales', slug: 'scales', label: 'כלי הערכה', icon: <ScalesIcon /> },
] as const;

const InfoTabs: React.FC<InfoTabsProps> = ({ currentPage }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  const getCurrentIndex = (): number => {
    // Get the last segment of the path e.g. 'scales' from '/info/scales'
    const segment = location.pathname.replace(/\/$/, '').split('/').pop() ?? '';

    // Try matching by path segment first (most reliable)
    const bySegment = INFO_TABS.findIndex(t => t.slug === segment);
    if (bySegment >= 0) return bySegment;

    // Fall back to currentPage prop
    const byProp = INFO_TABS.findIndex(t => t.slug === currentPage);
    if (byProp >= 0) return byProp;

    // Default to overview (index 0)
    return 0;
  };

  const handleChange = (_: React.SyntheticEvent, newValue: number) => {
    const tab = INFO_TABS[newValue];
    if (tab) navigate(`/info/${tab.slug}`);
  };

  return (
    <Box className="info-tabs" dir="rtl">
      <Box className="info-tabs__container">
        <Tabs
          value={getCurrentIndex()}
          onChange={handleChange}
          variant="scrollable"
          scrollButtons="auto"
          allowScrollButtonsMobile
          className="info-tabs__tabs"
          TabIndicatorProps={{ className: 'info-tabs__indicator' }}
        >
          {INFO_TABS.map((tab) => (
            <Tab
              key={tab.id}
              icon={tab.icon}
              iconPosition="start"
              label={isMobile ? undefined : tab.label}
              className="info-tabs__tab"
              aria-label={tab.label}
              title={tab.label}
            />
          ))}
        </Tabs>
      </Box>
      <Box className="info-tabs__decoration">
        <Box className="info-tabs__decoration-line" />
      </Box>
    </Box>
  );
};

export default InfoTabs;