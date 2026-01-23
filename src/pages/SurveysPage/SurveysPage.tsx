import {
  Container,
  Typography,
  Box,
  Card,
  CardContent,
  CardActions,
  Button,
  Chip,
  Link,
} from '@mui/material';
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { FiBarChart2 } from 'react-icons/fi';

interface SurveyCard {
  id: string;
  title: string;
  description: string;
  route: string;
  resultsRoute?: string;  // Added results route
  available: boolean;
  status: 'available' | 'coming-soon';
  icon?: 'assessment' | 'science' | 'timeline' | 'verified' | 'heart' | 'lock';
  color?: string;
  validated?: boolean;
  forParents?: boolean;
}

const SurveysPage: React.FC = (): React.JSX.Element => {
  const navigate = useNavigate();

  const survey: SurveyCard[] = [
    {
      id: 'state-of-children',
      title: 'סקר מצב ילדינו 2026',
      description: 'סקר מקיף למשפחות ילדים עם PANS/PANDAS בישראל. המידע יסייע להגביר את המודעות ולקדם מחקר בתחום.',
      route: '/surveys/state-of-children',
      resultsRoute: '/surveys/state-of-children/results',  // Added
      available: true,
      status: 'available',
      icon: 'verified',
      color: '#717DBC',
      validated: true,
    },
  ];

  const handleStartSurvey = (survey: SurveyCard) => {
    if (survey.available) {
      navigate(survey.route);
    }
  };

  return (
    <Container className="surveys-page">
      {/* Header */}
      <Box className="symptoms-page__header">
        <Typography variant="h3" component="h1" gutterBottom>
          סקרים
        </Typography>
      </Box>

      {/* Survey Cards Grid */}
      <Box className="symptoms-page__grid">
        {survey.map((survey) => (
          <Card
            key={survey.id}
            className={`survey-card ${!survey.available ? 'survey-card--disabled' : ''}`}
            elevation={survey.available ? 3 : 1}
            sx={{
              borderTop: survey.available ? `4px solid ${survey.color || '#717DBC'}` : undefined,
            }}
          >
            <CardContent className="survey-card__content">
              {/* Icon & Status Badge */}
              <Box className="survey-card__header">
                <Box sx={{ display: 'flex', gap: 0.5, flexWrap: 'wrap' }}>
                  {survey.validated && (
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
                </Box>
              </Box>

              {/* Title */}
              <Typography
                variant="h5"
                component="h2"
                className="survey-card__title"
                gutterBottom
              >
                {survey.title}
              </Typography>

              {/* Description */}
              <Typography
                variant="body2"
                color="text.secondary"
                className="survey-card__description"
              >
                {survey.description}
              </Typography>
            </CardContent>

            {/* Actions */}
            <CardActions
              className="survey-card__actions"
              sx={{
                flexDirection: 'column',
                gap: 1,
                padding: '16px',
              }}
            >
              <Button
                variant={survey.available ? 'contained' : 'outlined'}
                fullWidth
                disabled={!survey.available}
                onClick={() => handleStartSurvey(survey)}
                className="survey-card__button"
                sx={{
                  backgroundColor: survey.available ? survey.color : undefined,
                  '&:hover': {
                    backgroundColor: survey.available ? survey.color : undefined,
                    filter: 'brightness(0.9)',
                  },
                }}
              >
                התחל סקר
              </Button>

              {/* Results Link */}
              {survey.resultsRoute && (
                <Link
                  component="button"
                  onClick={() => navigate(survey.resultsRoute!)}
                  sx={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: 0.5,
                    fontSize: '0.875rem',
                    color: survey.color || '#717DBC',
                    textDecoration: 'none',
                    cursor: 'pointer',
                    fontFamily: 'Heebo, sans-serif',
                    '&:hover': {
                      textDecoration: 'underline',
                    },
                  }}
                >
                  <FiBarChart2 size={16} />
                  צפה בתוצאות הסקר
                </Link>
              )}
            </CardActions>
          </Card>
        ))}
      </Box>
    </Container>
  );
};

export default SurveysPage;