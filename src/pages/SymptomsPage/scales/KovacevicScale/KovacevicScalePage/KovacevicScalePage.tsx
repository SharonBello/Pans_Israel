import React, { useState, type JSX } from 'react';
import {
  Box,
  Typography,
  Container,
  Paper,
  Stepper,
  Step,
  StepLabel,
  Button,
  FormGroup,
  FormControlLabel,
  Checkbox,
  RadioGroup,
  Radio,
  FormControl,
  FormLabel,
  Alert,
  CircularProgress,
  Divider,
  Chip,
} from '@mui/material';
import { useNavigate } from 'react-router-dom';
import {
  ArrowBack as BackIcon,
  ArrowForward as ForwardIcon,
  Calculate as CalculateIcon,
} from '@mui/icons-material';
import {
  type KovacevicFormData,
  type SymptomPresence,
  type CriterionResponse,
  type CriterionWithSeverity,
  type LabResults,
  KOVACEVIC_LABELS,
  KOVACEVIC_INITIAL_STATE,
} from '@/types/kovacevicScale';
import { saveKovacevicResult, calculateDiagnosis } from '@/services/kovacevicService';
import './KovacevicScalePage.scss';

const STEPS: string[] = [
  'קריטריון חובה',
  'קריטריונים מרכזיים',
  'קריטריונים משניים - קבוצה 1',
  'קריטריונים משניים - קבוצה 2',
  'תגובה לטיפול וממצאי מעבדה',
];

const isYes = (value: CriterionResponse): boolean => value === 'yes';

const KovacevicScalePage: React.FC = () => {
  const navigate = useNavigate();
  const [activeStep, setActiveStep] = useState<number>(0);
  const [formData, setFormData] = useState<KovacevicFormData>(KOVACEVIC_INITIAL_STATE);
  const [isSaving, setIsSaving] = useState<boolean>(false);
  const [saveError, setSaveError] = useState<string | null>(null);

  // Mandatory: CriterionResponse fields
  const handleMandatoryChange = (
    field: keyof KovacevicFormData['mandatory'],
    checked: boolean
  ): void => {
    setFormData((prev: KovacevicFormData) => ({
      ...prev,
      mandatory: {
        ...prev.mandatory,
        [field]: checked ? 'yes' : 'no',
      },
    }));
  };

  // Core / Secondary: CriterionWithSeverity fields (toggle present; keep severity)
  const handleCriterionWithSeverityChange = <
    TSection extends keyof Pick<KovacevicFormData, 'core' | 'secondaryGroup1' | 'secondaryGroup2'>,
    TField extends keyof KovacevicFormData[TSection]
  >(
    section: TSection,
    field: TField,
    checked: boolean
  ): void => {
    setFormData((prev: KovacevicFormData) => {
      const current: CriterionWithSeverity = prev[section][field] as unknown as CriterionWithSeverity;

      return {
        ...prev,
        [section]: {
          ...prev[section],
          [field]: {
            ...current,
            present: checked ? 'yes' : 'no',
          },
        },
      };
    });
  };

  // Treatment response lives under additional.treatmentResponse
  const handleTreatmentChange = (
    field: keyof KovacevicFormData['additional']['treatmentResponse'],
    value: SymptomPresence
  ): void => {
    setFormData((prev: KovacevicFormData) => ({
      ...prev,
      additional: {
        ...prev.additional,
        treatmentResponse: {
          ...prev.additional.treatmentResponse,
          [field]: value,
        },
      },
    }));
  };

  // Labs status lives under additional.labResults.overallResult
  const handleLabStatusChange = (value: LabResults['overallResult']): void => {
    setFormData((prev: KovacevicFormData) => ({
      ...prev,
      additional: {
        ...prev.additional,
        labResults: {
          ...prev.additional.labResults,
          overallResult: value,
        },
      },
    }));
  };

  const handleNext = (): void => {
    setActiveStep((prev: number) => Math.min(prev + 1, STEPS.length - 1));
  };

  const handleBack = (): void => {
    setActiveStep((prev: number) => Math.max(prev - 1, 0));
  };

  const handleSubmit = async (): Promise<void> => {
    setIsSaving(true);
    setSaveError(null);

    try {
      const diagnosis = calculateDiagnosis(formData);
      const docId = await saveKovacevicResult(formData);

      navigate('/scales/kovacevic/results', {
        state: { formData, diagnosis, savedDocId: docId },
      });
    } catch (error: unknown) {
      console.error('Error saving:', error);
      setSaveError('שגיאה בשמירת התוצאות. מנסה שוב...');

      const diagnosis = calculateDiagnosis(formData);
      setTimeout(() => {
        navigate('/scales/kovacevic/results', { state: { formData, diagnosis } });
      }, 2000);
    } finally {
      setIsSaving(false);
    }
  };

  const renderMandatoryCheckbox = (
    field: keyof KovacevicFormData['mandatory'],
    label: string
  ): JSX.Element => (
    <FormControlLabel
      key={String(field)}
      control={
        <Checkbox
          checked={isYes(formData.mandatory[field])}
          onChange={(e) => handleMandatoryChange(field, e.target.checked)}
          color="primary"
        />
      }
      label={<Typography variant="body2">{label}</Typography>}
      className="criterion-checkbox"
    />
  );

  const renderCriterionCheckbox = <
    TSection extends keyof Pick<KovacevicFormData, 'core' | 'secondaryGroup1' | 'secondaryGroup2'>,
    TField extends keyof KovacevicFormData[TSection]
  >(
    section: TSection,
    field: TField,
    label: string
  ): JSX.Element => {
    const item: CriterionWithSeverity = formData[section][field] as unknown as CriterionWithSeverity;

    return (
      <FormControlLabel
        key={`${String(section)}.${String(field)}`}
        control={
          <Checkbox
            checked={isYes(item.present)}
            onChange={(e) => handleCriterionWithSeverityChange(section, field, e.target.checked)}
            color="primary"
          />
        }
        label={<Typography variant="body2">{label}</Typography>}
        className="criterion-checkbox"
      />
    );
  };

  const renderTreatmentRadio = (
    field: keyof KovacevicFormData['additional']['treatmentResponse'],
    label: string
  ): JSX.Element => (
    <FormControl component="fieldset" className="treatment-radio" key={String(field)}>
      <FormLabel component="legend">{label}</FormLabel>
      <RadioGroup
        row
        value={formData.additional.treatmentResponse[field]}
        onChange={(e) => handleTreatmentChange(field, e.target.value as SymptomPresence)}
      >
        <FormControlLabel value="yes" control={<Radio />} label="כן" />
        <FormControlLabel value="no" control={<Radio />} label="לא" />
        <FormControlLabel value="unknown" control={<Radio />} label="לא יודע/לא נוסה" />
      </RadioGroup>
    </FormControl>
  );

  const renderStepContent = (): JSX.Element | null => {
    switch (activeStep) {
      case 0:
        return (
          <Box className="step-content">
            <Alert severity="info" sx={{ mb: 3 }}>
              <Typography variant="body2">{KOVACEVIC_LABELS.mandatory.subtitle}</Typography>
            </Alert>
            <FormGroup>
              {renderMandatoryCheckbox('suddenOnset', KOVACEVIC_LABELS.mandatory.suddenOnset)}
              {renderMandatoryCheckbox('canRecallExactOnset', KOVACEVIC_LABELS.mandatory.canRecallExactOnset)}
              {renderMandatoryCheckbox('dynamicEvolution', KOVACEVIC_LABELS.mandatory.dynamicEvolution)}
            </FormGroup>
          </Box>
        );

      case 1:
        return (
          <Box className="step-content">
            <FormGroup>
              {renderCriterionCheckbox('core', 'ocdSymptoms', KOVACEVIC_LABELS.core.ocdSymptoms)}
              {renderCriterionCheckbox('core', 'separationAnxiety', KOVACEVIC_LABELS.core.separationAnxiety)}
              {renderCriterionCheckbox('core', 'ticsOrMovements', KOVACEVIC_LABELS.core.ticsOrMovements)}
              {renderCriterionCheckbox('core', 'eatingDisorder', KOVACEVIC_LABELS.core.eatingDisorder)}
            </FormGroup>
          </Box>
        );

      case 2:
        return (
          <Box className="step-content">
            <FormGroup>
              {renderCriterionCheckbox('secondaryGroup1', 'sleepDisturbances', KOVACEVIC_LABELS.secondaryGroup1.sleepDisturbances)}
              {renderCriterionCheckbox('secondaryGroup1', 'mydriasis', KOVACEVIC_LABELS.secondaryGroup1.mydriasis)}
              {renderCriterionCheckbox('secondaryGroup1', 'behavioralRegression', KOVACEVIC_LABELS.secondaryGroup1.behavioralRegression)}
              {renderCriterionCheckbox('secondaryGroup1', 'frightenedAppearance', KOVACEVIC_LABELS.secondaryGroup1.frightenedAppearance)}
              {renderCriterionCheckbox(
                'secondaryGroup1',
                'aggressionOrSuicidalBehavior',
                // If you added label alias, you can use aggressionOrSuicidalBehavior directly in labels too.
                (KOVACEVIC_LABELS.secondaryGroup1 as unknown as Record<string, string>).aggressionOrSuicidalBehavior ??
                  KOVACEVIC_LABELS.secondaryGroup1.aggressionOrSuicidal
              )}
            </FormGroup>
          </Box>
        );

      case 3:
        return (
          <Box className="step-content">
            <FormGroup>
              {renderCriterionCheckbox('secondaryGroup2', 'fineMotorImpairment', KOVACEVIC_LABELS.secondaryGroup2.fineMotorImpairment)}
              {renderCriterionCheckbox('secondaryGroup2', 'hyperactivityAttention', KOVACEVIC_LABELS.secondaryGroup2.hyperactivityAttention)}
              {renderCriterionCheckbox('secondaryGroup2', 'memoryLoss', KOVACEVIC_LABELS.secondaryGroup2.memoryLoss)}
              {renderCriterionCheckbox('secondaryGroup2', 'learningDisabilities', KOVACEVIC_LABELS.secondaryGroup2.learningDisabilities)}
              {renderCriterionCheckbox('secondaryGroup2', 'urinarySymptoms', KOVACEVIC_LABELS.secondaryGroup2.urinarySymptoms)}
              {renderCriterionCheckbox('secondaryGroup2', 'hallucinations', KOVACEVIC_LABELS.secondaryGroup2.hallucinations)}
              {renderCriterionCheckbox('secondaryGroup2', 'sensoryHypersensitivity', KOVACEVIC_LABELS.secondaryGroup2.sensoryHypersensitivity)}
              {renderCriterionCheckbox(
                'secondaryGroup2',
                'emotionalLabilityDepression',
                (KOVACEVIC_LABELS.secondaryGroup2 as unknown as Record<string, string>).emotionalLabilityDepression ??
                  KOVACEVIC_LABELS.secondaryGroup2.emotionalLability
              )}
              {renderCriterionCheckbox('secondaryGroup2', 'dysgraphia', KOVACEVIC_LABELS.secondaryGroup2.dysgraphia)}
              {renderCriterionCheckbox('secondaryGroup2', 'selectiveMutism', KOVACEVIC_LABELS.secondaryGroup2.selectiveMutism)}
              {renderCriterionCheckbox('secondaryGroup2', 'hypotonia', KOVACEVIC_LABELS.secondaryGroup2.hypotonia)}
              {renderCriterionCheckbox(
                'secondaryGroup2',
                'intermittentDystonia',
                (KOVACEVIC_LABELS.secondaryGroup2 as unknown as Record<string, string>).intermittentDystonia ??
                  KOVACEVIC_LABELS.secondaryGroup2.dystonia
              )}
              {renderCriterionCheckbox('secondaryGroup2', 'abdominalComplaints', KOVACEVIC_LABELS.secondaryGroup2.abdominalComplaints)}
            </FormGroup>
          </Box>
        );

      case 4:
        return (
          <Box className="step-content">
            <Typography variant="h6" gutterBottom>
              {KOVACEVIC_LABELS.treatment.title}
              <Chip label="10% מהאבחנה" size="small" sx={{ ml: 1 }} />
            </Typography>

            <Box className="treatment-section">
              {renderTreatmentRadio('antibioticsResponse', KOVACEVIC_LABELS.treatment.antibioticsResponse)}
              {renderTreatmentRadio('steroidsResponse', KOVACEVIC_LABELS.treatment.steroidsResponse)}
            </Box>

            <Divider sx={{ my: 3 }} />

            <Typography variant="h6" gutterBottom>
              {KOVACEVIC_LABELS.labs.title}
              <Chip label="5% מהאבחנה" size="small" sx={{ ml: 1 }} />
            </Typography>

            <Alert severity="info" sx={{ mb: 2 }}>
              <Typography variant="body2">{KOVACEVIC_LABELS.labs.subtitle}</Typography>
            </Alert>

            <FormControl component="fieldset">
              <RadioGroup
                value={formData.additional.labResults.overallResult}
                onChange={(e) => handleLabStatusChange(e.target.value as LabResults['overallResult'])}
              >
                <FormControlLabel value="positive" control={<Radio />} label={KOVACEVIC_LABELS.labs.positive} />
                <FormControlLabel value="negative" control={<Radio />} label={KOVACEVIC_LABELS.labs.negative} />
                <FormControlLabel value="inconclusive" control={<Radio />} label={KOVACEVIC_LABELS.labs.inconclusive} />
                <FormControlLabel value="not_tested" control={<Radio />} label={KOVACEVIC_LABELS.labs.not_tested} />
              </RadioGroup>
            </FormControl>
          </Box>
        );

      default:
        return null;
    }
  };

  return (
    <Container maxWidth="md" className="kovacevic-scale-page" dir="rtl">
      <Typography variant="h4" align="center" gutterBottom>
        שאלון קובאצ&apos;ביץ&apos; לאבחון פאנס/פאנדס
      </Typography>

      <Stepper activeStep={activeStep} alternativeLabel className="kovacevic-stepper">
        {STEPS.map((label: string) => (
          <Step key={label}>
            <StepLabel>{label}</StepLabel>
          </Step>
        ))}
      </Stepper>

      <Paper elevation={3} className="kovacevic-form">
        <Typography variant="h5" gutterBottom className="step-title">
          {STEPS[activeStep]}
        </Typography>

        {renderStepContent()}

        {saveError && (
          <Alert severity="error" sx={{ mt: 2 }}>
            {saveError}
          </Alert>
        )}

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
            >
              {isSaving ? 'שומר...' : 'חשב אבחון'}
            </Button>
          ) : (
            <Button variant="contained" onClick={handleNext} endIcon={<BackIcon />}>
              הבא
            </Button>
          )}
        </Box>
      </Paper>
    </Container>
  );
};

export default KovacevicScalePage;
