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
    KOVACEVIC_LABELS,
    KOVACEVIC_INITIAL_STATE,
} from '@/types/kovacevicScale';
import {
    saveKovacevicResult,
    calculateDiagnosis,
} from '@/services/kovacevicService';
import './KovacevicScalePage.scss';

// Step titles
const STEPS = [
    'קריטריון חובה',
    'קריטריונים מרכזיים',
    'קריטריונים משניים - קבוצה 1',
    'קריטריונים משניים - קבוצה 2',
    'תגובה לטיפול וממצאי מעבדה',
];

const KovacevicScalePage: React.FC = () => {
    const navigate = useNavigate();
    const [activeStep, setActiveStep] = useState(0);
    const [formData, setFormData] = useState<KovacevicFormData>(KOVACEVIC_INITIAL_STATE);
    const [isSaving, setIsSaving] = useState(false);
    const [saveError, setSaveError] = useState<string | null>(null);

    // Handle checkbox changes for boolean fields
    const handleCheckboxChange = (
        section: keyof KovacevicFormData,
        field: string,
        checked: boolean
    ) => {
        setFormData((prev) => ({
            ...prev,
            [section]: {
                ...prev[section],
                [field]: checked,
            },
        }));
    };

    // Handle radio changes for treatment responses
    const handleTreatmentChange = (field: string, value: SymptomPresence) => {
        setFormData((prev) => ({
            ...prev,
            treatment: {
                ...prev.treatment,
                [field]: value,
            },
        }));
    };

    // Handle lab status change
    const handleLabStatusChange = (value: 'positive' | 'negative' | 'inconclusive' | 'not_tested') => {
        setFormData((prev) => ({
            ...prev,
            labs: {
                ...prev.labs,
                status: value,
            },
        }));
    };

    // Navigate between steps
    const handleNext = () => {
        setActiveStep((prev) => Math.min(prev + 1, STEPS.length - 1));
    };

    const handleBack = () => {
        setActiveStep((prev) => Math.max(prev - 1, 0));
    };

    // Submit and calculate
    const handleSubmit = async () => {
        setIsSaving(true);
        setSaveError(null);

        try {
            const diagnosis = calculateDiagnosis(formData);
            const docId = await saveKovacevicResult(formData);

            navigate('/scales/kovacevic/results', {
                state: { formData, diagnosis, savedDocId: docId },
            });
        } catch (error) {
            console.error('Error saving:', error);
            setSaveError('שגיאה בשמירת התוצאות. מנסה שוב...');

            // Still navigate even if save failed
            const diagnosis = calculateDiagnosis(formData);
            setTimeout(() => {
                navigate('/scales/kovacevic/results', {
                    state: { formData, diagnosis },
                });
            }, 2000);
        } finally {
            setIsSaving(false);
        }
    };

    // Render checkbox item
    const renderCheckbox = (
        section: keyof KovacevicFormData,
        field: string,
        label: string
    ) => (
        <FormControlLabel
            key={field}
            control={
                <Checkbox
                    checked={(formData[section] as Record<string, boolean>)[field] || false}
                    onChange={(e) => handleCheckboxChange(section, field, e.target.checked)}
                    color="primary"
                />
            }
            label={<Typography variant="body2">{label}</Typography>}
            className="criterion-checkbox"
        />
    );

    // Render treatment radio group
    const renderTreatmentRadio = (field: string, label: string) => (
        <FormControl component="fieldset" className="treatment-radio" key={field}>
            <FormLabel component="legend">{label}</FormLabel>
            <RadioGroup
                row
                value={formData.treatment[field as keyof typeof formData.treatment]}
                onChange={(e) => handleTreatmentChange(field, e.target.value as SymptomPresence)}
            >
                <FormControlLabel value="yes" control={<Radio />} label="כן" />
                <FormControlLabel value="no" control={<Radio />} label="לא" />
                <FormControlLabel value="unknown" control={<Radio />} label="לא יודע/לא נוסה" />
            </RadioGroup>
        </FormControl>
    );

    // Render step content
    const renderStepContent = () => {
        switch (activeStep) {
            case 0: // Mandatory Criterion
                return (
                    <Box className="step-content">
                        <Alert severity="info" sx={{ mb: 3 }}>
                            <Typography variant="body2">
                                {KOVACEVIC_LABELS.mandatory.subtitle}
                            </Typography>
                        </Alert>
                        <FormGroup>
                            {renderCheckbox('mandatory', 'suddenOnset', KOVACEVIC_LABELS.mandatory.suddenOnset)}
                            {renderCheckbox('mandatory', 'canRecallExactOnset', KOVACEVIC_LABELS.mandatory.canRecallExactOnset)}
                            {renderCheckbox('mandatory', 'dynamicEvolution', KOVACEVIC_LABELS.mandatory.dynamicEvolution)}
                        </FormGroup>
                    </Box>
                );

            case 1: // Core Criteria
                return (
                    <Box className="step-content">
                        <FormGroup>
                            {renderCheckbox('core', 'ocdSymptoms', KOVACEVIC_LABELS.core.ocdSymptoms)}
                            {renderCheckbox('core', 'separationAnxiety', KOVACEVIC_LABELS.core.separationAnxiety)}
                            {renderCheckbox('core', 'ticsOrMovements', KOVACEVIC_LABELS.core.ticsOrMovements)}
                            {renderCheckbox('core', 'eatingDisorder', KOVACEVIC_LABELS.core.eatingDisorder)}
                        </FormGroup>
                    </Box>
                );

            case 2: // Secondary Group 1
                return (
                    <Box className="step-content">
                        <FormGroup>
                            {renderCheckbox('secondaryGroup1', 'sleepDisturbances', KOVACEVIC_LABELS.secondaryGroup1.sleepDisturbances)}
                            {renderCheckbox('secondaryGroup1', 'mydriasis', KOVACEVIC_LABELS.secondaryGroup1.mydriasis)}
                            {renderCheckbox('secondaryGroup1', 'behavioralRegression', KOVACEVIC_LABELS.secondaryGroup1.behavioralRegression)}
                            {renderCheckbox('secondaryGroup1', 'frightenedAppearance', KOVACEVIC_LABELS.secondaryGroup1.frightenedAppearance)}
                            {renderCheckbox('secondaryGroup1', 'aggressionOrSuicidal', KOVACEVIC_LABELS.secondaryGroup1.aggressionOrSuicidal)}
                        </FormGroup>
                    </Box>
                );

            case 3: // Secondary Group 2
                return (
                    <Box className="step-content">
                        <FormGroup>
                            {renderCheckbox('secondaryGroup2', 'fineMotorImpairment', KOVACEVIC_LABELS.secondaryGroup2.fineMotorImpairment)}
                            {renderCheckbox('secondaryGroup2', 'hyperactivityAttention', KOVACEVIC_LABELS.secondaryGroup2.hyperactivityAttention)}
                            {renderCheckbox('secondaryGroup2', 'memoryLoss', KOVACEVIC_LABELS.secondaryGroup2.memoryLoss)}
                            {renderCheckbox('secondaryGroup2', 'learningDisabilities', KOVACEVIC_LABELS.secondaryGroup2.learningDisabilities)}
                            {renderCheckbox('secondaryGroup2', 'urinarySymptoms', KOVACEVIC_LABELS.secondaryGroup2.urinarySymptoms)}
                            {renderCheckbox('secondaryGroup2', 'hallucinations', KOVACEVIC_LABELS.secondaryGroup2.hallucinations)}
                            {renderCheckbox('secondaryGroup2', 'sensoryHypersensitivity', KOVACEVIC_LABELS.secondaryGroup2.sensoryHypersensitivity)}
                            {renderCheckbox('secondaryGroup2', 'emotionalLability', KOVACEVIC_LABELS.secondaryGroup2.emotionalLability)}
                            {renderCheckbox('secondaryGroup2', 'dysgraphia', KOVACEVIC_LABELS.secondaryGroup2.dysgraphia)}
                            {renderCheckbox('secondaryGroup2', 'selectiveMutism', KOVACEVIC_LABELS.secondaryGroup2.selectiveMutism)}
                            {renderCheckbox('secondaryGroup2', 'hypotonia', KOVACEVIC_LABELS.secondaryGroup2.hypotonia)}
                            {renderCheckbox('secondaryGroup2', 'dystonia', KOVACEVIC_LABELS.secondaryGroup2.dystonia)}
                            {renderCheckbox('secondaryGroup2', 'abdominalComplaints', KOVACEVIC_LABELS.secondaryGroup2.abdominalComplaints)}
                        </FormGroup>
                    </Box>
                );

            case 4: // Treatment & Labs
                return (
                    <Box className="step-content">
                        {/* Treatment Response Section */}
                        <Typography variant="h6" gutterBottom>
                            {KOVACEVIC_LABELS.treatment.title}
                            <Chip label="10% מהאבחנה" size="small" sx={{ ml: 1 }} />
                        </Typography>
                        <Box className="treatment-section">
                            {renderTreatmentRadio('antibioticsResponse', KOVACEVIC_LABELS.treatment.antibioticsResponse)}
                            {renderTreatmentRadio('steroidsResponse', KOVACEVIC_LABELS.treatment.steroidsResponse)}
                        </Box>

                        <Divider sx={{ my: 3 }} />

                        {/* Lab Results Section */}
                        <Typography variant="h6" gutterBottom>
                            {KOVACEVIC_LABELS.labs.title}
                            <Chip label="5% מהאבחנה" size="small" sx={{ ml: 1 }} />
                        </Typography>
                        <Alert severity="info" sx={{ mb: 2 }}>
                            <Typography variant="body2">
                                {KOVACEVIC_LABELS.labs.subtitle}
                            </Typography>
                        </Alert>
                        <FormControl component="fieldset">
                            <RadioGroup
                                value={formData.labs.status}
                                onChange={(e) =>
                                    handleLabStatusChange(
                                        e.target.value as 'positive' | 'negative' | 'inconclusive' | 'not_tested'
                                    )
                                }
                            >
                                <FormControlLabel
                                    value="positive"
                                    control={<Radio />}
                                    label={KOVACEVIC_LABELS.labs.positive}
                                />
                                <FormControlLabel
                                    value="negative"
                                    control={<Radio />}
                                    label={KOVACEVIC_LABELS.labs.negative}
                                />
                                <FormControlLabel
                                    value="inconclusive"
                                    control={<Radio />}
                                    label={KOVACEVIC_LABELS.labs.inconclusive}
                                />
                                <FormControlLabel
                                    value="not_tested"
                                    control={<Radio />}
                                    label={KOVACEVIC_LABELS.labs.not_tested}
                                />
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
                שאלון קובאצ'ביץ' לאבחון פאנס/פאנדס
            </Typography>

            {/* Stepper */}
            <Stepper activeStep={activeStep} alternativeLabel className="kovacevic-stepper">
                {STEPS.map((label, index) => (
                    <Step key={label}>
                        <StepLabel>{label}</StepLabel>
                    </Step>
                ))}
            </Stepper>

            {/* Content */}
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

                {/* Navigation Buttons */}
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
                        <Button
                            variant="contained"
                            onClick={handleNext}
                            endIcon={<BackIcon />}
                        >
                            הבא
                        </Button>
                    )}
                </Box>
            </Paper>
        </Container>
    );
};

export default KovacevicScalePage;
