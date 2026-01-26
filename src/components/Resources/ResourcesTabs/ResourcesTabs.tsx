import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Box, Tabs, Tab, useMediaQuery, useTheme } from '@mui/material';
import {
  FolderOpen as FolderIcon,
  People as PeopleIcon,
  LocalHospital as ClinicianIcon,
  School as EducatorIcon,
  VideoLibrary as VideoIcon,
  Article as ArticleIcon,
  Language as WebsiteIcon,
} from '@mui/icons-material';
import { resourceNavItems } from '../../../data/resourcesContent';
import './ResourcesTabs.scss';

interface ResourcesTabsProps {
  currentPage: string;
}

const iconMap: Record<string, React.ReactElement> = {
  overview: <FolderIcon />,
  parents: <PeopleIcon />,
  clinicians: <ClinicianIcon />,
  educators: <EducatorIcon />,
  videos: <VideoIcon />,
  news: <ArticleIcon />,
  websites: <WebsiteIcon />,
};

const ResourcesTabs: React.FC<ResourcesTabsProps> = ({ currentPage }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  const getCurrentTabIndex = () => {
    const index = resourceNavItems.findIndex(
      (item) => location.pathname.includes(item.slug) || currentPage === item.slug
    );
    return index >= 0 ? index : 0;
  };

  const handleTabChange = (_event: React.SyntheticEvent, newValue: number) => {
    const item = resourceNavItems[newValue];
    if (item) {
      navigate(`/resources/${item.slug}`);
    }
  };

  return (
    <Box className="resources-tabs" dir="rtl">
      <Box className="resources-tabs__container">
        <Tabs
          value={getCurrentTabIndex()}
          onChange={handleTabChange}
          variant={isMobile ? 'scrollable' : 'fullWidth'}
          scrollButtons={isMobile ? 'auto' : false}
          allowScrollButtonsMobile
          className="resources-tabs__tabs"
          TabIndicatorProps={{
            className: 'resources-tabs__indicator',
          }}
        >
          {resourceNavItems.map((item) => (
            <Tab
              key={item.id}
              icon={iconMap[item.id]}
              iconPosition="start"
              label={isMobile ? undefined : item.title}
              className="resources-tabs__tab"
              aria-label={item.title}
            />
          ))}
        </Tabs>
      </Box>
      
      {/* Decorative line */}
      <Box className="resources-tabs__decoration">
        <Box className="resources-tabs__decoration-line" />
        <Box className="resources-tabs__decoration-glow" />
      </Box>
    </Box>
  );
};

export default ResourcesTabs;
