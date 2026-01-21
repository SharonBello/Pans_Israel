import React, { useState } from 'react';
import {
  Box,
  Typography,
  Container,
  Paper,
  Stepper,
  Step,
  StepLabel,
  Button,
  FormControl,
  FormLabel,
  RadioGroup,
  FormControlLabel,
  Radio,
  TextField,
  Select,
  MenuItem,
  Alert,
  CircularProgress,
  LinearProgress,
  Divider,
  InputLabel,
  Grid,
} from '@mui/material';
import { useNavigate } from 'react-router-dom';
import {
  ArrowBack as BackIcon,
  ArrowForward as ForwardIcon,
  Calculate as CalculateIcon,
} from '@mui/icons-material';
import {
  type PTECFormData,
  type SymptomRating,
  type FlareStatus,
  type EvaluationType,
  type DiagnosisType,
  type TriggerType,
  PTEC_INITIAL_STATE,
  RATING_LABELS,
  FLARE_STATUS_LABELS,
  EVALUATION_TYPE_LABELS,
  DIAGNOSIS_LABELS,
  TRIGGER_LABELS,
  BEHAVIOR_MOOD_LABELS,
  OCD_LABELS,
  ANXIETY_LABELS,
  FOOD_INTAKE_LABELS,
  TICS_LABELS,
  COGNITIVE_LABELS,
  SENSORY_LABELS,
  OTHER_LABELS,
  SLEEP_LABELS,
  HEALTH_LABELS,
} from '@/types/ptecScale';
import { savePTECResult, calculatePTECScores } from '@/services/ptecService';
import './PTECScalePage.scss';

// Step definitions
const STEPS = [
  'פרטי רקע',
  'התנהגות/מצב רוח',
  'OCD',
  'חרדה ואכילה',
  'טיקים וקוגניטיבי',
  'חושי ואחר',
  'שינה ובריאות',
];

// Category to step mapping
const CATEGORY_STEPS = {
  1: ['behaviorMood'],
  2: ['ocd'],
  3: ['anxiety', 'foodIntake'],
  4: ['tics', 'cognitive'],
  5: ['sensory', 'other'],
  6: ['sleep', 'health'],
};

// Labels mapping
const ALL_LABELS: Record<string, Record<string, string>> = {
  behaviorMood: BEHAVIOR_MOOD_LABELS,
  ocd: OCD_LABELS,
  anxiety: ANXIETY_LABELS,
  foodIntake: FOOD_INTAKE_LABELS,
  tics: TICS_LABELS,
  cognitive: COGNITIVE_LABELS,
  sensory: SENSORY_LABELS,
  other: OTHER_LABELS,
  sleep: SLEEP_LABELS,
  health: HEALTH_LABELS,
};

const CATEGORY_TITLES: Record<string, string> = {
  behaviorMood: 'התנהגות / מצב רוח',
  ocd: 'OCD - הפרעה טורדנית כפייתית',
  anxiety: 'חרדה',
  foodIntake: 'אכילה',
  tics: 'טיקים',
  cognitive: 'קוגניטיבי / התפתחותי',
  sensory: 'חושי',
  other: 'אחר',
  sleep: 'שינה',
  health: 'בריאות',
};

const PTECScalePage: React.FC = () => {
  const navigate = useNavigate();
  const [activeStep, setActiveStep] = useState(0);
  const [formData, setFormData] = useState<PTECFormData>(PTEC_INITIAL_STATE);
  const [isSaving, setIsSaving] = useState(false);
  const [saveError, setSaveError] = useState<string | null>(null);

  // Calculate progress
  const totalSteps = STEPS.length;
  const progress = ((activeStep + 1) / totalSteps) * 100;

  // Handle patient info changes
  const handlePatientInfoChange = (field: string, value: any) => {
    setFormData((prev) => ({
      ...prev,
      patientInfo: {
        ...prev.patientInfo,
        [field]: value,
      },
    }));
  };

  // Handle symptom rating changes
  const handleSymptomChange = (
    category: keyof typeof formData.symptoms,
    symptom: string,
    rating: SymptomRating
  ) => {
    setFormData((prev) => ({
      ...prev,
      symptoms: {
        ...prev.symptoms,
        [category]: {
          ...prev.symptoms[category],
          [symptom]: rating,
        },
      },
    }));
  };

  // Navigate between steps
  const handleNext = () => {
    setActiveStep((prev) => Math.min(prev + 1, STEPS.length - 1));
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleBack = () => {
    setActiveStep((prev) => Math.max(prev - 1, 0));
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Submit form
  const handleSubmit = async () => {
    setIsSaving(true);
    setSaveError(null);

    try {
      const scores = calculatePTECScores(formData.symptoms);
      const docId = await savePTECResult(formData);

      navigate('/scales/ptec/results', {
        state: { formData, scores, savedDocId: docId },
      });
    } catch (error) {
      console.error('Error saving:', error);
      setSaveError('שגיאה בשמירת התוצאות');

      // Still navigate with calculated scores
      const scores = calculatePTECScores(formData.symptoms);
      setTimeout(() => {
        navigate('/scales/ptec/results', {
          state: { formData, scores },
        });
      }, 2000);
    } finally {
      setIsSaving(false);
    }
  };

  // Render symptom rating component
  const renderSymptomRating = (
    category: keyof typeof formData.symptoms,
    symptomKey: string,
    label: string
  ) => (
    <Box key={symptomKey} className="symptom-item">
      <Typography variant="body2" className="symptom-label">
        {label}
      </Typography>
      <RadioGroup
        row
        value={formData.symptoms[category][symptomKey as keyof typeof formData.symptoms[typeof category]] || 0}
        onChange={(e) =>
          handleSymptomChange(category, symptomKey, parseInt(e.target.value) as SymptomRating)
        }
        className="symptom-rating"
      >
        {([0, 1, 2, 3] as SymptomRating[]).map((rating) => (
          <FormControlLabel
            key={rating}
            value={rating}
            control={<Radio size="small" />}
            label={RATING_LABELS[rating]}
            className={`rating-option rating-${rating}`}
          />
        ))}
      </RadioGroup>
    </Box>
  );

  // Render category section
  const renderCategory = (categoryKey: string) => {
    const labels = ALL_LABELS[categoryKey];
    const title = CATEGORY_TITLES[categoryKey];

    return (
      <Box key={categoryKey} className="category-section">
        <Typography variant="h6" className="category-title">
          {title}
        </Typography>
        <Box className="symptoms-list">
          {Object.entries(labels).map(([key, label]) =>
            renderSymptomRating(
              categoryKey as keyof typeof formData.symptoms,
              key,
              label
            )
          )}
        </Box>
      </Box>
    );
  };

  // Render step content
  const renderStepContent = () => {
    if (activeStep === 0) {
      // Patient Info Step
      return (
        <Box className="step-content patient-info">
          <Grid container spacing={3}>
            {/* Age */}
            <Grid sx={{ xs:12, sm:6 }}>
              <TextField
                fullWidth
                label="גיל בשנים"
                type="number"
                value={formData.patientInfo.ageInYears || ''}
                onChange={(e) =>
                  handlePatientInfoChange('ageInYears', parseInt(e.target.value) || 0)
                }
                inputProps={{ min: 0, max: 100 }}
              />
            </Grid>

            {/* Biological Sex */}
            <Grid sx={{ xs:12, sm:6 }}>
              <FormControl fullWidth>
                <InputLabel>מין ביולוגי</InputLabel>
                <Select
                  value={formData.patientInfo.biologicalSex}
                  label="מין ביולוגי"
                  onChange={(e) => handlePatientInfoChange('biologicalSex', e.target.value)}
                >
                  <MenuItem value="male">זכר</MenuItem>
                  <MenuItem value="female">נקבה</MenuItem>
                </Select>
              </FormControl>
            </Grid>

            {/* Flare Status */}
            <Grid sx={{ xs:12 }}>
              <FormControl component="fieldset">
                <FormLabel>מה מאפיין את התסמינים כרגע?</FormLabel>
                <RadioGroup
                  value={formData.patientInfo.flareStatus}
                  onChange={(e) =>
                    handlePatientInfoChange('flareStatus', e.target.value as FlareStatus)
                  }
                >
                  {Object.entries(FLARE_STATUS_LABELS).map(([key, label]) => (
                    <FormControlLabel key={key} value={key} control={<Radio />} label={label} />
                  ))}
                </RadioGroup>
              </FormControl>
            </Grid>

            {/* Evaluation Type */}
            <Grid sx={{ xs:12 }}>
              <FormControl component="fieldset">
                <FormLabel>האם זו הפעם הראשונה שאתם ממלאים שאלון זה?</FormLabel>
                <RadioGroup
                  value={formData.patientInfo.evaluationType}
                  onChange={(e) =>
                    handlePatientInfoChange('evaluationType', e.target.value as EvaluationType)
                  }
                >
                  {Object.entries(EVALUATION_TYPE_LABELS).map(([key, label]) => (
                    <FormControlLabel key={key} value={key} control={<Radio />} label={label} />
                  ))}
                </RadioGroup>
              </FormControl>
            </Grid>

            {/* Recent Treatment */}
            <Grid item xs={12} sm={6}>
              <FormControl component="fieldset">
                <FormLabel>האם התחלתם טיפול חדש לאחרונה?</FormLabel>
                <RadioGroup
                  row
                  value={formData.patientInfo.recentTreatment ? 'yes' : 'no'}
                  onChange={(e) =>
                    handlePatientInfoChange('recentTreatment', e.target.value === 'yes')
                  }
                >
                  <FormControlLabel value="yes" control={<Radio />} label="כן" />
                  <FormControlLabel value="no" control={<Radio />} label="לא" />
                </RadioGroup>
              </FormControl>
            </Grid>

            {/* Diagnosis */}
            <Grid sx={{ xs:12, sm:6 }}>
              <FormControl fullWidth>
                <InputLabel>אבחנה</InputLabel>
                <Select
                  value={formData.patientInfo.diagnosis}
                  label="אבחנה"
                  onChange={(e) =>
                    handlePatientInfoChange('diagnosis', e.target.value as DiagnosisType)
                  }
                >
                  {Object.entries(DIAGNOSIS_LABELS).map(([key, label]) => (
                    <MenuItem key={key} value={key}>
                      {label}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>

            {/* Recent Trigger */}
            <Grid sx={{ xs:12 }}>
              <FormControl fullWidth>
                <InputLabel>האם הייתה מחלה או טריגר לאחרונה?</InputLabel>
                <Select
                  value={formData.patientInfo.recentTrigger}
                  label="האם הייתה מחלה או טריגר לאחרונה?"
                  onChange={(e) =>
                    handlePatientInfoChange('recentTrigger', e.target.value as TriggerType)
                  }
                >
                  {Object.entries(TRIGGER_LABELS).map(([key, label]) => (
                    <MenuItem key={key} value={key}>
                      {label}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
          </Grid>
        </Box>
      );
    }

    // Symptom steps (1-6)
    const categories = CATEGORY_STEPS[activeStep as keyof typeof CATEGORY_STEPS] || [];
    return (
      <Box className="step-content symptoms-step">
        {categories.map((cat, index) => (
          <React.Fragment key={cat}>
            {renderCategory(cat)}
            {index < categories.length - 1 && <Divider sx={{ my: 3 }} />}
          </React.Fragment>
        ))}
      </Box>
    );
  };

  return (
    <Container maxWidth="md" className="ptec-scale-page" dir="rtl">
      <Typography variant="h4" align="center" gutterBottom>
        שאלון PTEC
      </Typography>

      {/* Progress */}
      <Box sx={{ mb: 2 }}>
        <LinearProgress variant="determinate" value={progress} sx={{ height: 8, borderRadius: 4 }} />
        <Typography variant="caption" align="center" display="block" sx={{ mt: 0.5 }}>
          {Math.round(progress)}% הושלם
        </Typography>
      </Box>

      {/* Stepper */}
      <Stepper activeStep={activeStep} alternativeLabel className="ptec-stepper">
        {STEPS.map((label) => (
          <Step key={label}>
            <StepLabel>{label}</StepLabel>
          </Step>
        ))}
      </Stepper>

      {/* Content */}
      <Paper elevation={3} className="ptec-form">
        <Typography variant="h5" gutterBottom className="step-title">
          {STEPS[activeStep]}
        </Typography>

        {activeStep > 0 && (
          <Alert severity="info" sx={{ mb: 2 }}>
            דרגו כל תסמין: 0 = ללא קושי, 1 = קושי קל, 2 = קושי בינוני, 3 = קושי חמור
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

          {activeStep === STEPS.length - 1 ? (
            <Button
              variant="contained"
              onClick={handleSubmit}
              disabled={isSaving}
              endIcon={isSaving ? <CircularProgress size={20} /> : <CalculateIcon />}
              sx={{ backgroundColor: '#00CEC9' }}
            >
              {isSaving ? 'שומר...' : 'חשב תוצאות'}
            </Button>
          ) : (
            <Button
              variant="contained"
              onClick={handleNext}
              endIcon={<BackIcon />}
              sx={{ backgroundColor: '#00CEC9' }}
            >
              הבא
            </Button>
          )}
        </Box>
      </Paper>
    </Container>
  );
};

export default PTECScalePage;
