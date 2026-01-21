import React, { useState } from 'react';
import {
  Box,
  Typography,
  Container,
  Paper,
  Button,
  FormControl,
  FormLabel,
  RadioGroup,
  FormControlLabel,
  Radio,
  Alert,
  CircularProgress,
  LinearProgress,
  Checkbox,
} from '@mui/material';
import { useNavigate } from 'react-router-dom';
import {
  ArrowBack as BackIcon,
  ArrowForward as ForwardIcon,
  Calculate as CalculateIcon,
} from '@mui/icons-material';
import {
  type CBIFormData,
  type CBIItems,
  type FrequencyRating,
  CBI_INITIAL_STATE,
  CBI_ITEM_LABELS,
  FREQUENCY_LABELS,
  CBI_CITATION,
} from '@/types/cbiScale';
import { saveCBIResult, calculateCBIScores } from '@/services/cbiService';
import './CBIScalePage.scss';

type SubscaleKey = keyof CBIItems;
const SUBSCALE_ORDER: SubscaleKey[] = [
  'timeDependency',
  'developmental',
  'physical',
  'emotional',
  'social',
];

const CBIScalePage: React.FC = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState<CBIFormData>({
    items: CBI_INITIAL_STATE,
    demographics: {
      relationshipToChild: 'mother',
      reducedWorkHours: false,
      changedSchooling: false,
      missedSchoolDays: false,
    },
  });
  const [activeStep, setActiveStep] = useState(0);
  const [isSaving, setIsSaving] = useState(false);
  const [saveError, setSaveError] = useState<string | null>(null);

  const totalSteps = SUBSCALE_ORDER.length + 1; // 5 subscales + demographics

  // Calculate progress
  const totalItems = 24;
  const answeredItems = Object.values(formData.items).reduce((count, subscale) => {
    return count + Object.values(subscale).filter((v) => v > 0).length;
  }, 0);
  const progress = (answeredItems / totalItems) * 100;

  // Handle item rating change
  const handleItemChange = (
    subscale: SubscaleKey,
    item: string,
    rating: FrequencyRating
  ) => {
    setFormData((prev) => ({
      ...prev,
      items: {
        ...prev.items,
        [subscale]: {
          ...prev.items[subscale],
          [item]: rating,
        },
      },
    }));
  };

  // Handle demographics change
  const handleDemographicsChange = (field: string, value: any) => {
    setFormData((prev) => ({
      ...prev,
      demographics: {
        ...prev.demographics,
        [field]: value,
      },
    }));
  };

  // Navigate
  const handleNext = () => {
    setActiveStep((prev) => Math.min(prev + 1, totalSteps - 1));
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleBack = () => {
    setActiveStep((prev) => Math.max(prev - 1, 0));
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Submit
  const handleSubmit = async () => {
    setIsSaving(true);
    setSaveError(null);

    try {
      const scores = calculateCBIScores(formData.items);
      const docId = await saveCBIResult(formData);

      navigate('/scales/cbi/results', {
        state: { formData, scores, savedDocId: docId },
      });
    } catch (error) {
      console.error('Error saving:', error);
      setSaveError('שגיאה בשמירת התוצאות');

      const scores = calculateCBIScores(formData.items);
      setTimeout(() => {
        navigate('/scales/cbi/results', {
          state: { formData, scores },
        });
      }, 2000);
    } finally {
      setIsSaving(false);
    }
  };

  // Render subscale content
  const renderSubscaleContent = (subscaleKey: SubscaleKey) => {
    const subscaleInfo = CBI_ITEM_LABELS[subscaleKey];
    const subscaleItems = formData.items[subscaleKey];

    return (
      <Box className="subscale-section">
        <Typography variant="h6" className="subscale-title">
          {subscaleInfo.title}
        </Typography>
        <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
          {subscaleInfo.description}
        </Typography>

        <Box className="items-list">
          {Object.entries(subscaleInfo.items).map(([itemKey, itemLabel]) => {
            const currentValue = subscaleItems[itemKey as keyof typeof subscaleItems];

            return (
              <Box key={itemKey} className="item-row">
                <Typography variant="body1" className="item-label">
                  {itemLabel}
                </Typography>

                <RadioGroup
                  row
                  value={currentValue}
                  onChange={(e) =>
                    handleItemChange(
                      subscaleKey,
                      itemKey,
                      parseInt(e.target.value) as FrequencyRating
                    )
                  }
                  className="rating-group"
                >
                  {([0, 1, 2, 3, 4] as FrequencyRating[]).map((rating) => (
                    <FormControlLabel
                      key={rating}
                      value={rating}
                      control={<Radio size="small" />}
                      label={FREQUENCY_LABELS[rating].short}
                      className={`rating-option rating-${rating} ${currentValue === rating ? 'selected' : ''}`}
                    />
                  ))}
                </RadioGroup>
              </Box>
            );
          })}
        </Box>
      </Box>
    );
  };

  // Render demographics
  const renderDemographics = () => {
    return (
      <Box className="demographics-section">
        <Typography variant="h6" gutterBottom>
          מידע נוסף
        </Typography>

        <Box className="demographics-fields">
          <FormControl component="fieldset" sx={{ mb: 3 }}>
            <FormLabel>מי ממלא את השאלון?</FormLabel>
            <RadioGroup
              row
              value={formData.demographics.relationshipToChild}
              onChange={(e) => handleDemographicsChange('relationshipToChild', e.target.value)}
            >
              <FormControlLabel value="mother" control={<Radio />} label="אם" />
              <FormControlLabel value="father" control={<Radio />} label="אב" />
              <FormControlLabel value="both" control={<Radio />} label="שניהם" />
              <FormControlLabel value="other" control={<Radio />} label="אחר" />
            </RadioGroup>
          </FormControl>

          <Typography variant="subtitle2" gutterBottom sx={{ mt: 2 }}>
            האם בעקבות מחלת הילד:
          </Typography>

          <FormControlLabel
            control={
              <Checkbox
                checked={formData.demographics.reducedWorkHours}
                onChange={(e) => handleDemographicsChange('reducedWorkHours', e.target.checked)}
              />
            }
            label="הפחתתם את שעות העבודה?"
          />

          <FormControlLabel
            control={
              <Checkbox
                checked={formData.demographics.changedSchooling}
                onChange={(e) => handleDemographicsChange('changedSchooling', e.target.checked)}
              />
            }
            label="שיניתם את סידורי הלימודים של הילד (למשל, מעבר ללימודים בבית)?"
          />

          <FormControlLabel
            control={
              <Checkbox
                checked={formData.demographics.missedSchoolDays}
                onChange={(e) => handleDemographicsChange('missedSchoolDays', e.target.checked)}
              />
            }
            label="הילד מפספס יום לימודים אחד או יותר בשבוע בממוצע?"
          />
        </Box>
      </Box>
    );
  };

  // Get current step content
  const renderStepContent = () => {
    if (activeStep < SUBSCALE_ORDER.length) {
      return renderSubscaleContent(SUBSCALE_ORDER[activeStep]);
    }
    return renderDemographics();
  };

  // Get step title
  const getStepTitle = () => {
    if (activeStep < SUBSCALE_ORDER.length) {
      return CBI_ITEM_LABELS[SUBSCALE_ORDER[activeStep]].title;
    }
    return 'מידע נוסף';
  };

  return (
    <Container maxWidth="md" className="cbi-scale-page" dir="rtl">
      <Typography variant="h4" align="center" gutterBottom>
        שאלון עומס המטפל (CBI)
      </Typography>

      {/* Progress */}
      <Box sx={{ mb: 2 }}>
        <LinearProgress
          variant="determinate"
          value={(activeStep / totalSteps) * 100}
          sx={{ height: 8, borderRadius: 4, backgroundColor: 'rgba(155, 89, 182, 0.2)',
            '& .MuiLinearProgress-bar': { backgroundColor: '#9B59B6' }
          }}
        />
        <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 0.5 }}>
          <Typography variant="caption">
            שלב {activeStep + 1} מתוך {totalSteps}
          </Typography>
          <Typography variant="caption">{Math.round(progress)}% מהפריטים נענו</Typography>
        </Box>
      </Box>

      {/* Step indicators */}
      <Box className="step-indicators">
        {[...Array(totalSteps)].map((_, index) => (
          <Box
            key={index}
            className={`step-dot ${index === activeStep ? 'active' : ''} ${index < activeStep ? 'completed' : ''}`}
            onClick={() => setActiveStep(index)}
          />
        ))}
      </Box>

      {/* Content */}
      <Paper elevation={3} className="cbi-form">
        <Typography variant="h5" gutterBottom className="step-title">
          {getStepTitle()}
        </Typography>

        {activeStep < SUBSCALE_ORDER.length && (
          <Alert severity="info" sx={{ mb: 2 }}>
            <Typography variant="body2">
              0 = אף פעם | 1 = לעתים רחוקות | 2 = לפעמים | 3 = לעתים קרובות | 4 = כמעט תמיד
            </Typography>
          </Alert>
        )}

        {renderStepContent()}

        {saveError && (
          <Alert severity="error" sx={{ mt: 2 }}>
            {saveError}
          </Alert>
        )}

        {/* Navigation */}
        <Box className="navigation-buttons">
          <Button
            variant="outlined"
            onClick={handleBack}
            disabled={activeStep === 0}
            startIcon={<ForwardIcon />}
          >
            הקודם
          </Button>

          {activeStep === totalSteps - 1 ? (
            <Button
              variant="contained"
              onClick={handleSubmit}
              disabled={isSaving}
              endIcon={isSaving ? <CircularProgress size={20} /> : <CalculateIcon />}
              sx={{ backgroundColor: '#9B59B6' }}
            >
              {isSaving ? 'שומר...' : 'חשב תוצאות'}
            </Button>
          ) : (
            <Button
              variant="contained"
              onClick={handleNext}
              endIcon={<BackIcon />}
              sx={{ backgroundColor: '#9B59B6' }}
            >
              הבא
            </Button>
          )}
        </Box>
      </Paper>

      {/* Citation */}
      <Typography variant="caption" color="text.secondary" sx={{ mt: 2, display: 'block', textAlign: 'center' }}>
        {CBI_CITATION.original.authors} ({CBI_CITATION.original.year}). {CBI_CITATION.original.journal}.
      </Typography>
    </Container>
  );
};

export default CBIScalePage;
