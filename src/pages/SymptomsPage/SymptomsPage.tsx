import React, { useState, lazy, Suspense } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import {
  Container,
  Typography,
  Box,
  Card,
  CardContent,
  CardActions,
  Button,
  Alert,
  Chip,
  Divider,
  Tabs,
  Tab,
  CircularProgress,
} from '@mui/material';
import {
  Assessment,
  Lock,
  Science,
  Timeline,
  Verified as VerifiedIcon,
  Favorite as HeartIcon,
} from '@mui/icons-material';
import './SymptomsPage.scss';

// Lazy load chart components for better performance
const ScaleResultsChart = lazy(() => import('./scales/ScaleResultsChart/ScaleResultsChart'));
const KovacevicResultsChart = lazy(() => import('../../components/Scales/KovacevicResultsChart/KovacevicResultsChart'));
const PTECResultsChart = lazy(() => import('../../components/Scales/PTECResultsChart/PTECResultsChart'));
const PANS31ResultsChart = lazy(() => import('../../components/Scales/PANS31ResultsChart/PANS31ResultsChart'));
const CBIResultsChart = lazy(() => import('../../components/Scales/CBIResultsChart/CBIResultsChart'));

interface ScaleCard {
  id: string;
  title: string;
  description: string;
  route: string;
  available: boolean;
  status: 'available' | 'coming-soon';
  icon?: 'assessment' | 'science' | 'timeline' | 'verified' | 'heart' | 'lock';
  color?: string;
  validated?: boolean;
  forParents?: boolean;
}

const SymptomsPage: React.FC = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [activeChartTab, setActiveChartTab] = useState(0);

  const scales: ScaleCard[] = [
    {
      id: 'pans31',
      title: 'מדד פאנס 31-פריטים',
      description: 'כלי הערכה מאומת מחקרית (Cronbach\'s α=0.89) לזיהוי ומדידת חומרת תסמיני PANS',
      route: '/scales/pans31',
      available: true,
      status: 'available',
      icon: 'verified',
      color: '#717DBC',
      validated: true,
    },
    {
      id: 'cbi',
      title: 'שאלון עומס המטפל (CBI)',
      description: 'הערכת העומס הרגשי, הפיזי והחברתי של הורים - מאומת ל-PANS (Farmer et al., 2018)',
      route: '/scales/cbi',
      available: true,
      status: 'available',
      icon: 'heart',
      color: '#9B59B6',
      validated: true,
      forParents: true,
    },
    {
      id: 'pandas',
      title: t('symptoms.pandasScale.title', 'מדד פאנס/פאנדס'),
      description: t(
        'symptoms.pandasScale.description',
        'כלי הערכה מקיף למעקב אחר תסמיני פאנס/פאנדס לאורך זמן'
      ),
      route: '/scales/pandas',
      available: true,
      status: 'available',
      icon: 'assessment',
      color: '#6C5CE7',
    },
    {
      id: 'kovacevic',
      title: 'שאלון קובאצ\'ביץ\'',
      description: 'קריטריוני אבחון מבוססי תצפיות קליניות מ-591 מטופלים (ד"ר קובאצ\'ביץ\' 2019)',
      route: '/scales/kovacevic',
      available: true,
      status: 'available',
      icon: 'science',
      color: '#E17055',
    },
    {
      id: 'ptec',
      title: 'שאלון PTEC',
      description: 'כלי מעקב אחר שיפור/החמרה בתסמינים לאורך זמן (0-306 נקודות)',
      route: '/scales/ptec',
      available: true,
      status: 'available',
      icon: 'timeline',
      color: '#00CEC9',
    },
  ];

  const handleStartScale = (scale: ScaleCard) => {
    if (scale.available) {
      navigate(scale.route);
    }
  };

  // Render icon based on scale type
  const renderIcon = (scale: ScaleCard) => {
    if (!scale.available) {
      return <Lock className="scale-card__icon scale-card__icon--locked" />;
    }
    const iconStyle = { color: scale.color || '#717DBC' };
    switch (scale.icon) {
      case 'verified':
        return <VerifiedIcon className="scale-card__icon scale-card__icon--active" sx={iconStyle} />;
      case 'science':
        return <Science className="scale-card__icon scale-card__icon--active" sx={iconStyle} />;
      case 'timeline':
        return <Timeline className="scale-card__icon scale-card__icon--active" sx={iconStyle} />;
      case 'heart':
        return <HeartIcon className="scale-card__icon scale-card__icon--active" sx={iconStyle} />;
      case 'assessment':
      default:
        return <Assessment className="scale-card__icon scale-card__icon--active" sx={iconStyle} />;
    }
  };

  return (
    <Container maxWidth="lg" className="symptoms-page" dir={t('dir')}>
      {/* Header */}
      <Box className="symptoms-page__header">
        <Typography variant="h3" component="h1" gutterBottom>
          {t('symptoms.title', 'תסמינים וסולמות אבחון')}
        </Typography>
      </Box>

      {/* Disclaimer */}
      <Alert severity="info" className="symptoms-page__disclaimer">
        <Typography variant="body1">
          {t(
            'symptoms.disclaimer',
            'הסולמות המוצגים כאן הם כלי עזר בלבד ואינם מהווים תחליף לאבחון רפואי מקצועי. אנא התייעצו עם רופא מומחה.'
          )}
        </Typography>
      </Alert>

      {/* Scale Cards Grid */}
      <Box className="symptoms-page__grid">
        {scales.map((scale) => (
          <Card
            key={scale.id}
            className={`scale-card ${!scale.available ? 'scale-card--disabled' : ''}`}
            elevation={scale.available ? 3 : 1}
            sx={{
              borderTop: scale.available ? `4px solid ${scale.color || '#717DBC'}` : undefined,
            }}
          >
            <CardContent className="scale-card__content">
              {/* Icon & Status Badge */}
              <Box className="scale-card__header">
                {renderIcon(scale)}
                <Box sx={{ display: 'flex', gap: 0.5, flexWrap: 'wrap' }}>
                  {scale.validated && (
                    <Chip
                      label="מאומת"
                      size="small"
                      sx={{
                        backgroundColor: 'rgba(76, 175, 80, 0.1)',
                        color: '#4CAF50',
                        fontWeight: 'bold',
                      }}
                    />
                  )}
                  {scale.forParents && (
                    <Chip
                      label="להורים"
                      size="small"
                      sx={{
                        backgroundColor: 'rgba(155, 89, 182, 0.1)',
                        color: '#9B59B6',
                        fontWeight: 'bold',
                      }}
                    />
                  )}
                  <Chip
                    label={
                      scale.available
                        ? t('symptoms.pandasScale.available', 'זמין עכשיו')
                        : t('symptoms.pcansScale.comingSoon', 'בקרוב')
                    }
                    color={scale.available ? 'success' : 'default'}
                    size="small"
                    className="scale-card__status"
                  />
                </Box>
              </Box>

              {/* Title */}
              <Typography
                variant="h5"
                component="h2"
                className="scale-card__title"
                gutterBottom
              >
                {scale.title}
              </Typography>

              {/* Description */}
              <Typography
                variant="body2"
                color="text.secondary"
                className="scale-card__description"
              >
                {scale.description}
              </Typography>
            </CardContent>

            {/* Actions */}
            <CardActions className="scale-card__actions">
              <Button
                variant={scale.available ? 'contained' : 'outlined'}
                fullWidth
                disabled={!scale.available}
                onClick={() => handleStartScale(scale)}
                className="scale-card__button"
                sx={{
                  backgroundColor: scale.available ? scale.color : undefined,
                  '&:hover': {
                    backgroundColor: scale.available ? scale.color : undefined,
                    filter: 'brightness(0.9)',
                  },
                }}
              >
                {scale.available
                  ? t('symptoms.startScale', 'התחל מדד')
                  : t('symptoms.pcansScale.comingSoon', 'בקרוב')}
              </Button>
            </CardActions>
          </Card>
        ))}
      </Box>

      {/* Community Statistics Section - Tabbed Layout */}
      <Box sx={{ mt: 6 }}>
        <Divider sx={{ mb: 4 }}>
          <Chip label="סטטיסטיקות קהילתיות" />
        </Divider>

        {/* Chart Tabs */}
        <Box sx={{ borderBottom: 1, borderColor: 'divider', mb: 3 }}>
          <Tabs
            value={activeChartTab}
            onChange={(_, newValue) => setActiveChartTab(newValue)}
            variant="scrollable"
            scrollButtons="auto"
            allowScrollButtonsMobile
            sx={{
              '& .MuiTab-root': {
                fontWeight: 600,
                minHeight: 56,
              },
              '& .Mui-selected': {
                color: '#717DBC',
              },
              '& .MuiTabs-indicator': {
                backgroundColor: '#717DBC',
                height: 3,
              },
            }}
          >
            <Tab
              label="PANS 31"
              icon={<VerifiedIcon sx={{ fontSize: 18 }} />}
              iconPosition="start"
              sx={{ color: '#717DBC' }}
            />
            <Tab
              label="עומס המטפל (CBI)"
              icon={<HeartIcon sx={{ fontSize: 18 }} />}
              iconPosition="start"
              sx={{ color: '#9B59B6' }}
            />
            <Tab
              label="PANDAS"
              icon={<Assessment sx={{ fontSize: 18 }} />}
              iconPosition="start"
              sx={{ color: '#6C5CE7' }}
            />
            <Tab
              label="קובאביץ'"
              icon={<Science sx={{ fontSize: 18 }} />}
              iconPosition="start"
              sx={{ color: '#E17055' }}
            />
            <Tab
              label="PTEC"
              icon={<Timeline sx={{ fontSize: 18 }} />}
              iconPosition="start"
              sx={{ color: '#00CEC9' }}
            />
          </Tabs>
        </Box>

        {/* Chart Content */}
        <Box className="chart-tab-content">
          <Suspense
            fallback={
              <Box sx={{ display: 'flex', justifyContent: 'center', py: 8 }}>
                <CircularProgress sx={{ color: '#717DBC' }} />
              </Box>
            }
          >
            {activeChartTab === 0 && <PANS31ResultsChart />}
            {activeChartTab === 1 && <CBIResultsChart />}
            {activeChartTab === 2 && <ScaleResultsChart />}
            {activeChartTab === 3 && <KovacevicResultsChart />}
            {activeChartTab === 4 && <PTECResultsChart />}
          </Suspense>
        </Box>
      </Box>
    </Container>
  );
};

export default SymptomsPage;
