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
  TextField,
  Alert,
  CircularProgress,
  LinearProgress,
  Divider,
  Tooltip,
  IconButton,
  Collapse,
} from '@mui/material';
import { useNavigate } from 'react-router-dom';
import {
  ArrowBack as BackIcon,
  ArrowForward as ForwardIcon,
  Calculate as CalculateIcon,
  Info as InfoIcon,
  ExpandMore as ExpandIcon,
} from '@mui/icons-material';
import {
  type PANS31FormData,
  type PANS31Symptoms,
  type SeverityRating,
  PANS31_INITIAL_STATE,
  PANS31_LABELS,
  PANS31_CATEGORIES,
  SEVERITY_LABELS,
  PANS31_LICENSE,
} from '@/types/pans31Scale';
import { savePANS31Result, calculatePANS31Scores } from '@/services/pans31Service';
import './PANS31ScalePage.scss';

const PANS31ScalePage: React.FC = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState<PANS31FormData>(PANS31_INITIAL_STATE);
  const [activeCategory, setActiveCategory] = useState(0);
  const [isSaving, setIsSaving] = useState(false);
  const [saveError, setSaveError] = useState<string | null>(null);
  const [expandedDefinition, setExpandedDefinition] = useState<string | null>(null);

  const categoryKeys = Object.keys(PANS31_CATEGORIES) as (keyof typeof PANS31_CATEGORIES)[];
  const totalCategories = categoryKeys.length;

  // Calculate progress
  const totalItems = 31;
  const answeredItems = Object.values(formData.symptoms).filter((v) => v > 0).length;
  const progress = (answeredItems / totalItems) * 100;

  // Handle symptom rating change
  const handleSymptomChange = (symptom: keyof PANS31Symptoms, rating: SeverityRating) => {
    setFormData((prev) => ({
      ...prev,
      symptoms: {
        ...prev.symptoms,
        [symptom]: rating,
      },
    }));
  };

  // Handle additional data changes
  const handleAdditionalChange = (field: string, value: any) => {
    setFormData((prev) => ({
      ...prev,
      additional: {
        ...prev.additional,
        [field]: value,
      },
    }));
  };

  // Navigate between categories
  const handleNext = () => {
    setActiveCategory((prev) => Math.min(prev + 1, totalCategories));
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleBack = () => {
    setActiveCategory((prev) => Math.max(prev - 1, 0));
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Submit form
  const handleSubmit = async () => {
    setIsSaving(true);
    setSaveError(null);

    try {
      const scores = calculatePANS31Scores(formData.symptoms);
      const docId = await savePANS31Result(formData);

      navigate('/scales/pans31/results', {
        state: { formData, scores, savedDocId: docId },
      });
    } catch (error) {
      console.error('Error saving:', error);
      setSaveError('שגיאה בשמירת התוצאות');

      // Still navigate with calculated scores
      const scores = calculatePANS31Scores(formData.symptoms);
      setTimeout(() => {
        navigate('/scales/pans31/results', {
          state: { formData, scores },
        });
      }, 2000);
    } finally {
      setIsSaving(false);
    }
  };

  // Render symptom rating item
  const renderSymptomItem = (symptomKey: keyof PANS31Symptoms) => {
    const { label, definition } = PANS31_LABELS[symptomKey];
    const currentValue = formData.symptoms[symptomKey];

    return (
      <Box key={symptomKey} className="symptom-item">
        <Box className="symptom-header">
          <Typography variant="body1" className="symptom-label">
            {label}
          </Typography>
          {definition && (
            <IconButton
              size="small"
              onClick={() =>
                setExpandedDefinition(expandedDefinition === symptomKey ? null : symptomKey)
              }
              className="info-button"
            >
              <InfoIcon fontSize="small" />
            </IconButton>
          )}
        </Box>

        {definition && (
          <Collapse in={expandedDefinition === symptomKey}>
            <Alert severity="info" sx={{ mb: 1, py: 0 }}>
              <Typography variant="caption">{definition}</Typography>
            </Alert>
          </Collapse>
        )}

        <RadioGroup
          row
          value={currentValue}
          onChange={(e) =>
            handleSymptomChange(symptomKey, parseInt(e.target.value) as SeverityRating)
          }
          className="rating-group"
        >
          {([0, 1, 2, 3, 4] as SeverityRating[]).map((rating) => (
            <Tooltip key={rating} title={SEVERITY_LABELS[rating].description} arrow>
              <FormControlLabel
                value={rating}
                control={<Radio size="small" />}
                label={SEVERITY_LABELS[rating].short}
                className={`rating-option rating-${rating} ${currentValue === rating ? 'selected' : ''}`}
              />
            </Tooltip>
          ))}
        </RadioGroup>
      </Box>
    );
  };

  // Render category content
  const renderCategoryContent = () => {
    if (activeCategory >= totalCategories) {
      // Additional questions page
      return (
        <Box className="additional-section">
          <Typography variant="h6" gutterBottom>
            שאלות נוספות
          </Typography>

          <Box className="additional-fields">
            <TextField
              label="מספר שעות ביום של אובססיות"
              type="number"
              value={formData.additional.hoursObsessions ?? ''}
              onChange={(e) =>
                handleAdditionalChange(
                  'hoursObsessions',
                  e.target.value ? parseFloat(e.target.value) : null
                )
              }
              inputProps={{ min: 0, max: 24, step: 0.5 }}
              fullWidth
              sx={{ mb: 2 }}
            />

            <TextField
              label="מספר שעות ביום של כפייתיות/טקסים"
              type="number"
              value={formData.additional.hoursCompulsions ?? ''}
              onChange={(e) =>
                handleAdditionalChange(
                  'hoursCompulsions',
                  e.target.value ? parseFloat(e.target.value) : null
                )
              }
              inputProps={{ min: 0, max: 24, step: 0.5 }}
              fullWidth
              sx={{ mb: 2 }}
            />

            <FormControl component="fieldset" sx={{ mt: 2 }}>
              <FormLabel>השאלון מולא על ידי:</FormLabel>
              <RadioGroup
                row
                value={formData.additional.completedBy}
                onChange={(e) => handleAdditionalChange('completedBy', e.target.value)}
              >
                <FormControlLabel value="mother" control={<Radio />} label="אם" />
                <FormControlLabel value="father" control={<Radio />} label="אב" />
                <FormControlLabel value="other" control={<Radio />} label="אחר" />
              </RadioGroup>
            </FormControl>

            {formData.additional.completedBy === 'other' && (
              <TextField
                label="פרט:"
                value={formData.additional.otherCompletedBy || ''}
                onChange={(e) => handleAdditionalChange('otherCompletedBy', e.target.value)}
                fullWidth
                sx={{ mt: 1 }}
              />
            )}
          </Box>
        </Box>
      );
    }

    const categoryKey = categoryKeys[activeCategory];
    const category = PANS31_CATEGORIES[categoryKey];

    return (
      <Box className="category-section">
        <Typography variant="h6" className="category-title">
          {category.title}
        </Typography>
        <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
          דרגו כל תסמין לפי חומרתו <strong>בשבוע האחרון</strong>
        </Typography>

        <Box className="symptoms-list">
          {category.items.map((item) => renderSymptomItem(item))}
        </Box>
      </Box>
    );
  };

  // Get step label
  const getStepLabel = () => {
    if (activeCategory >= totalCategories) {
      return 'שאלות נוספות';
    }
    return PANS31_CATEGORIES[categoryKeys[activeCategory]].title;
  };

  return (
    <Container maxWidth="md" className="pans31-scale-page" dir="rtl">
      <Typography variant="h4" align="center" gutterBottom>
        סולם PANS 31-פריטים
      </Typography>

      {/* Progress */}
      <Box sx={{ mb: 2 }}>
        <LinearProgress
          variant="determinate"
          value={(activeCategory / (totalCategories + 1)) * 100}
          sx={{ height: 8, borderRadius: 4 }}
        />
        <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 0.5 }}>
          <Typography variant="caption">
            שלב {activeCategory + 1} מתוך {totalCategories + 1}
          </Typography>
          <Typography variant="caption">{Math.round(progress)}% מהפריטים נענו</Typography>
        </Box>
      </Box>

      {/* Step indicators */}
      <Box className="step-indicators">
        {categoryKeys.map((key, index) => (
          <Box
            key={key}
            className={`step-dot ${index === activeCategory ? 'active' : ''} ${index < activeCategory ? 'completed' : ''}`}
            onClick={() => setActiveCategory(index)}
          />
        ))}
        <Box
          className={`step-dot ${activeCategory === totalCategories ? 'active' : ''} ${activeCategory > totalCategories ? 'completed' : ''}`}
          onClick={() => setActiveCategory(totalCategories)}
        />
      </Box>

      {/* Content */}
      <Paper elevation={3} className="pans31-form">
        <Typography variant="h5" gutterBottom className="step-title">
          {getStepLabel()}
        </Typography>

        {activeCategory < totalCategories && (
          <Alert severity="info" sx={{ mb: 2 }}>
            <Typography variant="body2">
              0 = אין | 1 = קל | 2 = בינוני | 3 = חמור | 4 = קיצוני
            </Typography>
          </Alert>
        )}

        {renderCategoryContent()}

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
            disabled={activeCategory === 0}
            startIcon={<ForwardIcon />}
          >
            הקודם
          </Button>

          {activeCategory === totalCategories ? (
            <Button
              variant="contained"
              onClick={handleSubmit}
              disabled={isSaving}
              endIcon={isSaving ? <CircularProgress size={20} /> : <CalculateIcon />}
              sx={{ backgroundColor: '#717DBC' }}
            >
              {isSaving ? 'שומר...' : 'חשב תוצאות'}
            </Button>
          ) : (
            <Button
              variant="contained"
              onClick={handleNext}
              endIcon={<BackIcon />}
              sx={{ backgroundColor: '#717DBC' }}
            >
              הבא
            </Button>
          )}
        </Box>
      </Paper>

      {/* License attribution */}
      <Typography variant="caption" color="text.secondary" sx={{ mt: 2, display: 'block', textAlign: 'center' }}>
        {PANS31_LICENSE.title} © {PANS31_LICENSE.year} by {PANS31_LICENSE.authors} - {PANS31_LICENSE.license}
      </Typography>
    </Container>
  );
};

export default PANS31ScalePage;
