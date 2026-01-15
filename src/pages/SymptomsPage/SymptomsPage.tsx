import React from 'react';
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
} from '@mui/material';
import { Assessment, Lock } from '@mui/icons-material';
import './SymptomsPage.scss';

interface ScaleCard {
  id: string;
  title: string;
  description: string;
  route: string;
  available: boolean;
  status: 'available' | 'coming-soon';
}

const SymptomsPage: React.FC = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();

  const scales: ScaleCard[] = [
    {
      id: 'pandas',
      title: t('symptoms.pandasScale.title', 'סולם PANDAS/PANS'),
      description: t('symptoms.pandasScale.description', 'כלי הערכה מקיף למעקב אחר תסמיני PANDAS/PANS לאורך זמן'),
      route: '/scales/pandas',
      available: true,
      status: 'available',
    },
    {
      id: 'pcans',
      title: t('symptoms.pcansScale.title', 'סולם PCANS'),
      description: t('symptoms.pcansScale.description', 'סולם נוסף לאבחון - בפיתוח'),
      route: '/scales/pcans',
      available: false,
      status: 'coming-soon',
    },
    {
      id: 'cunningham',
      title: t('symptoms.cunninghamScale.title', 'סולם קנינגהאם'),
      description: t('symptoms.cunninghamScale.description', 'סולם נוסף לאבחון - בפיתוח'),
      route: '/scales/cunningham',
      available: false,
      status: 'coming-soon',
    },
  ];

  const handleStartScale = (scale: ScaleCard) => {
    if (scale.available) {
      navigate(scale.route);
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
          {t('symptoms.disclaimer', 'הסולמות המוצגים כאן הם כלי עזר בלבד ואינם מהווים תחליף לאבחון רפואי מקצועי. אנא התייעצו עם רופא מומחה.')}
        </Typography>
      </Alert>

      {/* Scale Cards Grid */}
      <Box className="symptoms-page__grid">
        {scales.map((scale) => (
          <Card
            key={scale.id}
            className={`scale-card ${!scale.available ? 'scale-card--disabled' : ''}`}
            elevation={scale.available ? 3 : 1}
          >
            <CardContent className="scale-card__content">
              {/* Icon & Status Badge */}
              <Box className="scale-card__header">
                {scale.available ? (
                  <Assessment className="scale-card__icon scale-card__icon--active" />
                ) : (
                  <Lock className="scale-card__icon scale-card__icon--locked" />
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
              >
                {scale.available
                  ? t('symptoms.startScale', 'התחל סולם')
                  : t('symptoms.pcansScale.comingSoon', 'בקרוב')}
              </Button>
            </CardActions>
          </Card>
        ))}
      </Box>
    </Container>
  );
};

export default SymptomsPage;