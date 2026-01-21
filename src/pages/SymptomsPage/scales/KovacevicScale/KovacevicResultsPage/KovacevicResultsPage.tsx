import React, { type JSX } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import {
  Container,
  Typography,
  Paper,
  Box,
  Button,
  Divider,
  Chip,
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
import type {
  KovacevicFormData,
  KovacevicDiagnosisResult,
  CriterionResponse,
  CriterionWithSeverity,
  LabResults,
} from '@/types/kovacevicScale';
import { KOVACEVIC_LABELS } from '@/types/kovacevicScale';
import './KovacevicResultsPage.scss';

interface ResultsState {
  formData: KovacevicFormData;
  diagnosis: KovacevicDiagnosisResult;
  savedDocId?: string;
}

const isYes = (value: CriterionResponse): boolean => value === 'yes';

const responseToHebrew = (value: CriterionResponse): string => {
  if (value === 'yes') return KOVACEVIC_LABELS.responses.yes;
  if (value === 'no') return KOVACEVIC_LABELS.responses.no;
  return KOVACEVIC_LABELS.responses.unknown;
};

const labStatusToHebrew = (status: LabResults['overallResult']): string => {
  switch (status) {
    case 'positive':
      return KOVACEVIC_LABELS.labs.positive;
    case 'negative':
      return KOVACEVIC_LABELS.labs.negative;
    case 'inconclusive':
      return KOVACEVIC_LABELS.labs.inconclusive;
    case 'not_tested':
    default:
      return KOVACEVIC_LABELS.labs.not_tested;
  }
};

const KovacevicResultsPage: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const state = location.state as ResultsState | undefined;

  if (!state) {
    navigate('/scales/kovacevic');
    return null;
  }

  const { formData, diagnosis, savedDocId } = state;

  const getDiagnosisDisplay = (): {
    color: string;
    bgColor: string;
    icon: JSX.Element;
    title: string;
    description: string;
    severity: 'success' | 'info' | 'warning';
  } => {
    switch (diagnosis.formula) {
      case 'formula1':
        return {
          color: '#4CAF50',
          bgColor: 'rgba(76, 175, 80, 0.1)',
          icon: <CheckIcon sx={{ fontSize: 60, color: '#4CAF50' }} />,
          title: KOVACEVIC_LABELS.diagnosis.formula1.title,
          description: KOVACEVIC_LABELS.diagnosis.formula1.description,
          severity: 'success',
        };
      case 'formula2':
        return {
          color: '#2196F3',
          bgColor: 'rgba(33, 150, 243, 0.1)',
          icon: <CheckIcon sx={{ fontSize: 60, color: '#2196F3' }} />,
          title: KOVACEVIC_LABELS.diagnosis.formula2.title,
          description: KOVACEVIC_LABELS.diagnosis.formula2.description,
          severity: 'info',
        };
      case 'partial':
        return {
          color: '#FF9800',
          bgColor: 'rgba(255, 152, 0, 0.1)',
          icon: <WarningIcon sx={{ fontSize: 60, color: '#FF9800' }} />,
          title: KOVACEVIC_LABELS.diagnosis.partial.title,
          description: KOVACEVIC_LABELS.diagnosis.partial.description,
          severity: 'warning',
        };
      case 'inconclusive':
      case 'not_met':
      default:
        return {
          color: '#9E9E9E',
          bgColor: 'rgba(158, 158, 158, 0.1)',
          icon: <CancelIcon sx={{ fontSize: 60, color: '#9E9E9E' }} />,
          title: KOVACEVIC_LABELS.diagnosis.not_met.title,
          description: KOVACEVIC_LABELS.diagnosis.not_met.description,
          severity: 'warning',
        };
    }
  };

  const diagnosisDisplay = getDiagnosisDisplay();

  // Use your real result shape
  const confidenceBreakdown = {
    symptoms: diagnosis.confidence.clinicalSymptoms,
    treatment: diagnosis.confidence.treatmentResponse,
    labs: diagnosis.confidence.labResults,
    margin: diagnosis.confidence.margin,
  };

  const totalConfidence: number = Math.min(
    confidenceBreakdown.symptoms + confidenceBreakdown.treatment + confidenceBreakdown.labs,
    100
  );

  const criteriaMetCount = {
    mandatory: diagnosis.criteriaMet.mandatory ? 1 : 0, // result type stores boolean, not 0..3
    core: diagnosis.criteriaMet.coreCount,
    secondaryGroup1: diagnosis.criteriaMet.secondaryGroup1Count,
    secondaryGroup2: diagnosis.criteriaMet.secondaryGroup2Count,
    totalSecondary: diagnosis.criteriaMet.totalSecondary,
  };

  return (
    <Container maxWidth="md" className="kovacevic-results-page" dir="rtl">
      <Typography variant="h4" align="center" gutterBottom>
        תוצאות שאלון קובאצ&apos;ביץ&apos;
      </Typography>

      {savedDocId && (
        <Alert severity="success" sx={{ mb: 2 }}>
          ✓ התוצאות נשמרו בהצלחה
        </Alert>
      )}

      <Paper elevation={3} className="diagnosis-card" sx={{ backgroundColor: diagnosisDisplay.bgColor }}>
        <Box className="diagnosis-header">
          {diagnosisDisplay.icon}
          <Typography variant="h4" sx={{ color: diagnosisDisplay.color, fontWeight: 700 }}>
            {diagnosisDisplay.title}
          </Typography>
          <Typography variant="body1" color="text.secondary">
            {diagnosisDisplay.description}
          </Typography>

          {/* If you want: show computed summary from result */}
          <Typography variant="body2" sx={{ mt: 1 }}>
            {diagnosis.summaryHebrew}
          </Typography>
        </Box>

        <Box className="confidence-breakdown">
          <Typography variant="h6" gutterBottom>
            פירוט רמת הוודאות
          </Typography>

          <Box className="confidence-bar">
            <Box className="bar-section symptoms" style={{ width: `${confidenceBreakdown.symptoms}%` }}>
              {confidenceBreakdown.symptoms > 10 && `${confidenceBreakdown.symptoms}%`}
            </Box>
            <Box className="bar-section treatment" style={{ width: `${confidenceBreakdown.treatment}%` }}>
              {confidenceBreakdown.treatment > 3 && `${confidenceBreakdown.treatment}%`}
            </Box>
            <Box className="bar-section labs" style={{ width: `${confidenceBreakdown.labs}%` }}>
              {confidenceBreakdown.labs > 2 && `${confidenceBreakdown.labs}%`}
            </Box>
            <Box className="bar-section margin" style={{ width: `${confidenceBreakdown.margin}%` }}>
              {confidenceBreakdown.margin}%
            </Box>
          </Box>

          <Box className="confidence-legend">
            <Chip label={`תסמינים: ${confidenceBreakdown.symptoms}%`} className="chip symptoms" />
            <Chip label={`טיפול: ${confidenceBreakdown.treatment}%`} className="chip treatment" />
            <Chip label={`מעבדה: ${confidenceBreakdown.labs}%`} className="chip labs" />
            <Chip label={`מרווח טעות: ${confidenceBreakdown.margin}%`} className="chip margin" />
          </Box>

          <Typography variant="h5" align="center" sx={{ mt: 2, fontWeight: 700 }}>
            סה&quot;כ: {totalConfidence}%
          </Typography>
        </Box>
      </Paper>

      <Paper elevation={2} className="criteria-summary">
        <Typography variant="h6" gutterBottom>
          סיכום קריטריונים
        </Typography>

        <Grid container spacing={2}>
          <Grid sx={{ xs: 6, sm: 3 }}>
            <Box className="criteria-box">
              <Typography variant="subtitle2" color="text.secondary">
                קריטריון חובה
              </Typography>
              <Typography variant="h4" color="primary">
                {criteriaMetCount.mandatory}/1
              </Typography>
            </Box>
          </Grid>

          <Grid sx={{ xs: 6, sm: 3 }}>
            <Box className="criteria-box">
              <Typography variant="subtitle2" color="text.secondary">
                קריטריונים מרכזיים
              </Typography>
              <Typography variant="h4" color="primary">
                {criteriaMetCount.core}/4
              </Typography>
            </Box>
          </Grid>

          <Grid sx={{ xs: 6, sm: 3 }}>
            <Box className="criteria-box">
              <Typography variant="subtitle2" color="text.secondary">
                משניים קבוצה 1
              </Typography>
              <Typography variant="h4" color="secondary">
                {criteriaMetCount.secondaryGroup1}/5
              </Typography>
            </Box>
          </Grid>

          <Grid sx={{ xs: 6, sm: 3 }}>
            <Box className="criteria-box">
              <Typography variant="subtitle2" color="text.secondary">
                משניים קבוצה 2
              </Typography>
              <Typography variant="h4" color="secondary">
                {criteriaMetCount.secondaryGroup2}/13
              </Typography>
            </Box>
          </Grid>
        </Grid>
      </Paper>

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
                  {isYes(formData.mandatory.suddenOnset) ? <CheckIcon color="success" /> : <CancelIcon color="disabled" />}
                </TableCell>
                <TableCell align="center" width={90}>
                  <Chip size="small" label={responseToHebrew(formData.mandatory.suddenOnset)} />
                </TableCell>
              </TableRow>

              <TableRow>
                <TableCell>{KOVACEVIC_LABELS.mandatory.canRecallExactOnset}</TableCell>
                <TableCell align="center">
                  {isYes(formData.mandatory.canRecallExactOnset) ? (
                    <CheckIcon color="success" />
                  ) : (
                    <CancelIcon color="disabled" />
                  )}
                </TableCell>
                <TableCell align="center">
                  <Chip size="small" label={responseToHebrew(formData.mandatory.canRecallExactOnset)} />
                </TableCell>
              </TableRow>

              <TableRow>
                <TableCell>{KOVACEVIC_LABELS.mandatory.dynamicEvolution}</TableCell>
                <TableCell align="center">
                  {isYes(formData.mandatory.dynamicEvolution) ? <CheckIcon color="success" /> : <CancelIcon color="disabled" />}
                </TableCell>
                <TableCell align="center">
                  <Chip size="small" label={responseToHebrew(formData.mandatory.dynamicEvolution)} />
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
              {(Object.entries(formData.core) as Array<[keyof KovacevicFormData['core'], CriterionWithSeverity]>).map(
                ([key, value]) => (
                  <TableRow key={String(key)}>
                    <TableCell>{KOVACEVIC_LABELS.core[key]}</TableCell>
                    <TableCell align="center" width={60}>
                      {isYes(value.present) ? <CheckIcon color="success" /> : <CancelIcon color="disabled" />}
                    </TableCell>
                    <TableCell align="center" width={90}>
                      <Chip size="small" label={responseToHebrew(value.present)} />
                    </TableCell>
                    <TableCell align="center" width={90}>
                      <Chip size="small" label={`חומרה: ${value.severity}`} />
                    </TableCell>
                  </TableRow>
                )
              )}
            </TableBody>
          </Table>
        </Box>

        <Divider sx={{ my: 2 }} />

        {/* Secondary Group 1 */}
        <Box className="section">
          <Typography variant="subtitle1" fontWeight="bold" gutterBottom>
            {KOVACEVIC_LABELS.secondaryGroup1.title}
          </Typography>
          <Table size="small">
            <TableBody>
              {(Object.entries(formData.secondaryGroup1) as Array<
                [keyof KovacevicFormData['secondaryGroup1'], CriterionWithSeverity]
              >).map(([key, value]) => {
                const labelMap = KOVACEVIC_LABELS.secondaryGroup1 as unknown as Record<string, string>;
                const label: string = labelMap[String(key)] ?? String(key);

                return (
                  <TableRow key={String(key)}>
                    <TableCell>{label}</TableCell>
                    <TableCell align="center" width={60}>
                      {isYes(value.present) ? <CheckIcon color="success" /> : <CancelIcon color="disabled" />}
                    </TableCell>
                    <TableCell align="center" width={90}>
                      <Chip size="small" label={responseToHebrew(value.present)} />
                    </TableCell>
                    <TableCell align="center" width={90}>
                      <Chip size="small" label={`חומרה: ${value.severity}`} />
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </Box>

        <Divider sx={{ my: 2 }} />

        {/* Secondary Group 2 */}
        <Box className="section">
          <Typography variant="subtitle1" fontWeight="bold" gutterBottom>
            {KOVACEVIC_LABELS.secondaryGroup2.title}
          </Typography>
          <Table size="small">
            <TableBody>
              {(Object.entries(formData.secondaryGroup2) as Array<
                [keyof KovacevicFormData['secondaryGroup2'], CriterionWithSeverity]
              >).map(([key, value]) => {
                const labelMap = KOVACEVIC_LABELS.secondaryGroup2 as unknown as Record<string, string>;
                const label: string = labelMap[String(key)] ?? String(key);

                return (
                  <TableRow key={String(key)}>
                    <TableCell>{label}</TableCell>
                    <TableCell align="center" width={60}>
                      {isYes(value.present) ? <CheckIcon color="success" /> : <CancelIcon color="disabled" />}
                    </TableCell>
                    <TableCell align="center" width={90}>
                      <Chip size="small" label={responseToHebrew(value.present)} />
                    </TableCell>
                    <TableCell align="center" width={90}>
                      <Chip size="small" label={`חומרה: ${value.severity}`} />
                    </TableCell>
                  </TableRow>
                );
              })}
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
                <TableCell align="center" width={120}>
                  <Chip
                    label={responseToHebrew(formData.additional.treatmentResponse.antibioticsResponse)}
                    size="small"
                    color={formData.additional.treatmentResponse.antibioticsResponse === 'yes' ? 'success' : 'default'}
                  />
                </TableCell>
              </TableRow>
              <TableRow>
                <TableCell>{KOVACEVIC_LABELS.treatment.steroidsResponse}</TableCell>
                <TableCell align="center">
                  <Chip
                    label={responseToHebrew(formData.additional.treatmentResponse.steroidsResponse)}
                    size="small"
                    color={formData.additional.treatmentResponse.steroidsResponse === 'yes' ? 'success' : 'default'}
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

          <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap', alignItems: 'center' }}>
            <Chip
              label={labStatusToHebrew(formData.additional.labResults.overallResult)}
              color={formData.additional.labResults.overallResult === 'positive' ? 'success' : 'default'}
            />
            <Chip label={`ASO מוגבר: ${responseToHebrew(formData.additional.labResults.elevatedASO)}`} />
            <Chip label={`תרבית גרון חיובית: ${responseToHebrew(formData.additional.labResults.positiveThroatCulture)}`} />
          </Box>
        </Box>
      </Paper>

      <Alert severity="warning" className="disclaimer">
        <Typography variant="body2">
          <strong>הבהרה חשובה:</strong> תוצאות אלו מיועדות לשימוש כמידע תומך בלבד ואינן מהווות אבחון רפואי.
          יש להתייעץ עם רופא מומחה לצורך אבחון וטיפול מקצועי.
        </Typography>
      </Alert>

      <Box className="action-buttons">
        <Button variant="outlined" startIcon={<RefreshIcon />} onClick={() => navigate('/scales/kovacevic')}>
          חזרה להתחלה
        </Button>
        <Button variant="contained" startIcon={<PrintIcon />} onClick={() => window.print()}>
          הדפס תוצאות
        </Button>
      </Box>
    </Container>
  );
};

export default KovacevicResultsPage;
