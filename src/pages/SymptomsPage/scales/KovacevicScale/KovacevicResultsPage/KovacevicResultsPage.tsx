import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import {
    Container,
    Typography,
    Paper,
    Box,
    Button,
    Divider,
    Chip,
    LinearProgress,
    Alert,
    Table,
    TableBody,
    TableRow,
    TableCell,
    Grid,
} from '@mui/material';
import {
    CheckCircle as CheckIcon,
    Cancel as CancelIcon,
    Warning as WarningIcon,
    Print as PrintIcon,
    Refresh as RefreshIcon,
} from '@mui/icons-material';
import type { KovacevicFormData, KovacevicDiagnosisResult } from '@/types/kovacevicScale';
import { KOVACEVIC_LABELS } from '@/types/kovacevicScale';
import './KovacevicResultsPage.scss';

interface ResultsState {
    formData: KovacevicFormData;
    diagnosis: KovacevicDiagnosisResult;
    savedDocId?: string;
}

const KovacevicResultsPage: React.FC = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const state = location.state as ResultsState | undefined;

    if (!state) {
        navigate('/scales/kovacevic');
        return null;
    }

    const { formData, diagnosis, savedDocId } = state;

    // Get diagnosis display info
    const getDiagnosisDisplay = () => {
        switch (diagnosis.formula) {
            case 'formula1':
                return {
                    color: '#4CAF50',
                    bgColor: 'rgba(76, 175, 80, 0.1)',
                    icon: <CheckIcon sx={{ fontSize: 60, color: '#4CAF50' }} />,
                    title: KOVACEVIC_LABELS.diagnosis.formula1.title,
                    description: KOVACEVIC_LABELS.diagnosis.formula1.description,
                    severity: 'success' as const,
                };
            case 'formula2':
                return {
                    color: '#2196F3',
                    bgColor: 'rgba(33, 150, 243, 0.1)',
                    icon: <CheckIcon sx={{ fontSize: 60, color: '#2196F3' }} />,
                    title: KOVACEVIC_LABELS.diagnosis.formula2.title,
                    description: KOVACEVIC_LABELS.diagnosis.formula2.description,
                    severity: 'info' as const,
                };
            case 'partial':
                return {
                    color: '#FF9800',
                    bgColor: 'rgba(255, 152, 0, 0.1)',
                    icon: <WarningIcon sx={{ fontSize: 60, color: '#FF9800' }} />,
                    title: KOVACEVIC_LABELS.diagnosis.partial.title,
                    description: KOVACEVIC_LABELS.diagnosis.partial.description,
                    severity: 'warning' as const,
                };
            default:
                return {
                    color: '#9E9E9E',
                    bgColor: 'rgba(158, 158, 158, 0.1)',
                    icon: <CancelIcon sx={{ fontSize: 60, color: '#9E9E9E' }} />,
                    title: KOVACEVIC_LABELS.diagnosis.not_met.title,
                    description: KOVACEVIC_LABELS.diagnosis.not_met.description,
                    severity: 'warning' as const,
                };
        }
    };

    const diagnosisDisplay = getDiagnosisDisplay();
    const totalConfidence =
        diagnosis.confidenceBreakdown.symptoms +
        diagnosis.confidenceBreakdown.treatment +
        diagnosis.confidenceBreakdown.labs;

    return (
        <Container maxWidth="md" className="kovacevic-results-page" dir="rtl">
            <Typography variant="h4" align="center" gutterBottom>
                תוצאות שאלון קובאצ'ביץ'
            </Typography>

            {savedDocId && (
                <Alert severity="success" sx={{ mb: 2 }}>
                    ✓ התוצאות נשמרו בהצלחה
                </Alert>
            )}

            {/* Main Diagnosis Result */}
            <Paper
                elevation={3}
                className="diagnosis-card"
                sx={{ backgroundColor: diagnosisDisplay.bgColor }}
            >
                <Box className="diagnosis-header">
                    {diagnosisDisplay.icon}
                    <Typography variant="h4" sx={{ color: diagnosisDisplay.color, fontWeight: 700 }}>
                        {diagnosisDisplay.title}
                    </Typography>
                    <Typography variant="body1" color="text.secondary">
                        {diagnosisDisplay.description}
                    </Typography>
                </Box>

                {/* Confidence Breakdown */}
                <Box className="confidence-breakdown">
                    <Typography variant="h6" gutterBottom>
                        פירוט רמת הוודאות
                    </Typography>

                    <Box className="confidence-bar">
                        <Box className="bar-section symptoms" style={{ width: `${diagnosis.confidenceBreakdown.symptoms}%` }}>
                            {diagnosis.confidenceBreakdown.symptoms > 10 && `${diagnosis.confidenceBreakdown.symptoms}%`}
                        </Box>
                        <Box className="bar-section treatment" style={{ width: `${diagnosis.confidenceBreakdown.treatment}%` }}>
                            {diagnosis.confidenceBreakdown.treatment > 3 && `${diagnosis.confidenceBreakdown.treatment}%`}
                        </Box>
                        <Box className="bar-section labs" style={{ width: `${diagnosis.confidenceBreakdown.labs}%` }}>
                            {diagnosis.confidenceBreakdown.labs > 2 && `${diagnosis.confidenceBreakdown.labs}%`}
                        </Box>
                        <Box className="bar-section margin" style={{ width: '5%' }}>
                            5%
                        </Box>
                    </Box>

                    <Box className="confidence-legend">
                        <Chip label={`תסמינים: ${diagnosis.confidenceBreakdown.symptoms}%`} className="chip symptoms" />
                        <Chip label={`טיפול: ${diagnosis.confidenceBreakdown.treatment}%`} className="chip treatment" />
                        <Chip label={`מעבדה: ${diagnosis.confidenceBreakdown.labs}%`} className="chip labs" />
                        <Chip label="מרווח טעות: 5%" className="chip margin" />
                    </Box>

                    <Typography variant="h5" align="center" sx={{ mt: 2, fontWeight: 700 }}>
                        סה"כ: {totalConfidence}%
                    </Typography>
                </Box>
            </Paper>

            {/* Criteria Summary */}
            <Paper elevation={2} className="criteria-summary">
                <Typography variant="h6" gutterBottom>
                    סיכום קריטריונים
                </Typography>

                <Grid container spacing={2}>
                    {/* Mandatory */}
                    <Grid sx={{ xs:6, sm:3 }}>
                        <Box className="criteria-box">
                            <Typography variant="subtitle2" color="text.secondary">
                                קריטריון חובה
                            </Typography>
                            <Typography variant="h4" color="primary">
                                {diagnosis.criteriaMetCount.mandatory}/3
                            </Typography>
                        </Box>
                    </Grid>

                    {/* Core */}
                    <Grid sx={{ xs:6, sm:3 }}>
                        <Box className="criteria-box">
                            <Typography variant="subtitle2" color="text.secondary">
                                קריטריונים מרכזיים
                            </Typography>
                            <Typography variant="h4" color="primary">
                                {diagnosis.criteriaMetCount.core}/4
                            </Typography>
                        </Box>
                    </Grid>

                    {/* Secondary Group 1 */}
                    <Grid sx={{ xs:6, sm:3 }}>
                        <Box className="criteria-box">
                            <Typography variant="subtitle2" color="text.secondary">
                                משניים קבוצה 1
                            </Typography>
                            <Typography variant="h4" color="secondary">
                                {diagnosis.criteriaMetCount.secondaryGroup1}/5
                            </Typography>
                        </Box>
                    </Grid>

                    {/* Secondary Group 2 */}
                    <Grid sx={{ xs:6, sm:3 }}>
                        <Box className="criteria-box">
                            <Typography variant="subtitle2" color="text.secondary">
                                משניים קבוצה 2
                            </Typography>
                            <Typography variant="h4" color="secondary">
                                {diagnosis.criteriaMetCount.secondaryGroup2}/13
                            </Typography>
                        </Box>
                    </Grid>
                </Grid>
            </Paper>

            {/* Detailed Breakdown */}
            <Paper elevation={2} className="detailed-breakdown">
                <Typography variant="h6" gutterBottom>
                    פירוט מלא
                </Typography>

                {/* Mandatory */}
                <Box className="section">
                    <Typography variant="subtitle1" fontWeight="bold" gutterBottom>
                        {KOVACEVIC_LABELS.mandatory.title}
                    </Typography>
                    <Table size="small">
                        <TableBody>
                            <TableRow>
                                <TableCell>{KOVACEVIC_LABELS.mandatory.suddenOnset}</TableCell>
                                <TableCell align="center" width={60}>
                                    {formData.mandatory.suddenOnset ? (
                                        <CheckIcon color="success" />
                                    ) : (
                                        <CancelIcon color="disabled" />
                                    )}
                                </TableCell>
                            </TableRow>
                            <TableRow>
                                <TableCell>{KOVACEVIC_LABELS.mandatory.canRecallExactOnset}</TableCell>
                                <TableCell align="center">
                                    {formData.mandatory.canRecallExactOnset ? (
                                        <CheckIcon color="success" />
                                    ) : (
                                        <CancelIcon color="disabled" />
                                    )}
                                </TableCell>
                            </TableRow>
                            <TableRow>
                                <TableCell>{KOVACEVIC_LABELS.mandatory.dynamicEvolution}</TableCell>
                                <TableCell align="center">
                                    {formData.mandatory.dynamicEvolution ? (
                                        <CheckIcon color="success" />
                                    ) : (
                                        <CancelIcon color="disabled" />
                                    )}
                                </TableCell>
                            </TableRow>
                        </TableBody>
                    </Table>
                </Box>

                <Divider sx={{ my: 2 }} />

                {/* Core */}
                <Box className="section">
                    <Typography variant="subtitle1" fontWeight="bold" gutterBottom>
                        {KOVACEVIC_LABELS.core.title}
                    </Typography>
                    <Table size="small">
                        <TableBody>
                            {Object.entries(formData.core).map(([key, value]) => (
                                <TableRow key={key}>
                                    <TableCell>
                                        {KOVACEVIC_LABELS.core[key as keyof typeof KOVACEVIC_LABELS.core]}
                                    </TableCell>
                                    <TableCell align="center" width={60}>
                                        {value ? <CheckIcon color="success" /> : <CancelIcon color="disabled" />}
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </Box>

                <Divider sx={{ my: 2 }} />

                {/* Treatment */}
                <Box className="section">
                    <Typography variant="subtitle1" fontWeight="bold" gutterBottom>
                        {KOVACEVIC_LABELS.treatment.title}
                    </Typography>
                    <Table size="small">
                        <TableBody>
                            <TableRow>
                                <TableCell>{KOVACEVIC_LABELS.treatment.antibioticsResponse}</TableCell>
                                <TableCell align="center" width={100}>
                                    <Chip
                                        label={
                                            formData.treatment.antibioticsResponse === 'yes'
                                                ? 'כן'
                                                : formData.treatment.antibioticsResponse === 'no'
                                                    ? 'לא'
                                                    : 'לא ידוע'
                                        }
                                        size="small"
                                        color={formData.treatment.antibioticsResponse === 'yes' ? 'success' : 'default'}
                                    />
                                </TableCell>
                            </TableRow>
                            <TableRow>
                                <TableCell>{KOVACEVIC_LABELS.treatment.steroidsResponse}</TableCell>
                                <TableCell align="center">
                                    <Chip
                                        label={
                                            formData.treatment.steroidsResponse === 'yes'
                                                ? 'כן'
                                                : formData.treatment.steroidsResponse === 'no'
                                                    ? 'לא'
                                                    : 'לא ידוע'
                                        }
                                        size="small"
                                        color={formData.treatment.steroidsResponse === 'yes' ? 'success' : 'default'}
                                    />
                                </TableCell>
                            </TableRow>
                        </TableBody>
                    </Table>
                </Box>

                <Divider sx={{ my: 2 }} />

                {/* Labs */}
                <Box className="section">
                    <Typography variant="subtitle1" fontWeight="bold" gutterBottom>
                        {KOVACEVIC_LABELS.labs.title}
                    </Typography>
                    <Chip
                        label={KOVACEVIC_LABELS.labs[formData.labs.status]}
                        color={formData.labs.status === 'positive' ? 'success' : 'default'}
                    />
                </Box>
            </Paper>

            {/* Disclaimer */}
            <Alert severity="warning" className="disclaimer">
                <Typography variant="body2">
                    <strong>הבהרה חשובה:</strong> תוצאות אלו מיועדות לשימוש כמידע תומך בלבד ואינן מהווות
                    אבחון רפואי. יש להתייעץ עם רופא מומחה לצורך אבחון וטיפול מקצועי.
                </Typography>
            </Alert>

            {/* Action Buttons */}
            <Box className="action-buttons">
                <Button
                    variant="outlined"
                    startIcon={<RefreshIcon />}
                    onClick={() => navigate('/scales/kovacevic')}
                >
                    חזרה להתחלה
                </Button>
                <Button
                    variant="contained"
                    startIcon={<PrintIcon />}
                    onClick={() => window.print()}
                >
                    הדפס תוצאות
                </Button>
            </Box>
        </Container>
    );
};

export default KovacevicResultsPage;
