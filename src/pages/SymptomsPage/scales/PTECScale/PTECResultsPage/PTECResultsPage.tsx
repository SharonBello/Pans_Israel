import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import {
  Container,
  Typography,
  Paper,
  Box,
  Button,
  Alert,
  Grid,
  LinearProgress,
} from '@mui/material';
import {
  Print as PrintIcon,
  Refresh as RefreshIcon,
} from '@mui/icons-material';
import type { PTECFormData, PTECScores } from '@/types/ptecScale';
import { MAX_SCORES, CATEGORY_LABELS, FLARE_STATUS_LABELS, DIAGNOSIS_LABELS } from '@/types/ptecScale';
import { getSeverityLevel } from '@/services/ptecService';
import './PTECResultsPage.scss';

interface ResultsState {
  formData: PTECFormData;
  scores: PTECScores;
  savedDocId?: string;
}

const PTECResultsPage: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const state = location.state as ResultsState | undefined;

  if (!state) {
    navigate('/scales/ptec');
    return null;
  }

  const { formData, scores, savedDocId } = state;
  const severity = getSeverityLevel(scores.total);

  // Calculate percentage for each category
  const getPercentage = (score: number, maxScore: number) =>
    Math.round((score / maxScore) * 100);

  // Get color based on percentage
  const getBarColor = (percent: number) => {
    if (percent <= 20) return '#4CAF50';
    if (percent <= 40) return '#8BC34A';
    if (percent <= 60) return '#FFC107';
    if (percent <= 80) return '#FF9800';
    return '#F44336';
  };

  return (
    <Container maxWidth="md" className="ptec-results-page" dir="rtl">
      <Typography variant="h4" align="center" gutterBottom>
        תוצאות שאלון PTEC
      </Typography>

      {savedDocId && (
        <Alert severity="success" sx={{ mb: 2 }}>
          ✓ התוצאות נשמרו בהצלחה
        </Alert>
      )}

      {/* Main Score Card */}
      <Paper elevation={3} className="total-score-card" sx={{ backgroundColor: severity.color + '15' }}>
        <Box className="score-display">
          <Typography variant="h1" sx={{ color: severity.color, fontWeight: 700 }}>
            {scores.total}
          </Typography>
          <Typography variant="h6" color="text.secondary">
            מתוך 306
          </Typography>
        </Box>

        <Box className="severity-badge" sx={{ backgroundColor: severity.color }}>
          <Typography variant="h5" sx={{ color: 'white' }}>
            {severity.label}
          </Typography>
        </Box>

        <Box className="score-meter">
          <LinearProgress
            variant="determinate"
            value={(scores.total / 306) * 100}
            sx={{
              height: 20,
              borderRadius: 10,
              backgroundColor: 'rgba(0,0,0,0.1)',
              '& .MuiLinearProgress-bar': {
                backgroundColor: severity.color,
                borderRadius: 10,
              },
            }}
          />
          <Box className="meter-labels">
            <Typography variant="caption">0</Typography>
            <Typography variant="caption">306</Typography>
          </Box>
        </Box>
      </Paper>

      {/* Category Breakdown */}
      <Paper elevation={2} className="category-breakdown">
        <Typography variant="h6" gutterBottom>
          פירוט לפי קטגוריה
        </Typography>

        <Box className="categories-list">
          {(Object.keys(CATEGORY_LABELS) as (keyof typeof CATEGORY_LABELS)[]).map((cat) => {
            const score = scores[cat];
            const maxScore = MAX_SCORES[cat];
            const percent = getPercentage(score, maxScore);
            const color = getBarColor(percent);

            return (
              <Box key={cat} className="category-row">
                <Box className="category-info">
                  <Typography variant="body2" fontWeight="500">
                    {CATEGORY_LABELS[cat]}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    {score} / {maxScore}
                  </Typography>
                </Box>
                <Box className="category-bar-container">
                  <LinearProgress
                    variant="determinate"
                    value={percent}
                    sx={{
                      height: 12,
                      borderRadius: 6,
                      backgroundColor: 'rgba(0,0,0,0.08)',
                      '& .MuiLinearProgress-bar': {
                        backgroundColor: color,
                        borderRadius: 6,
                      },
                    }}
                  />
                  <Typography variant="caption" className="percent-label">
                    {percent}%
                  </Typography>
                </Box>
              </Box>
            );
          })}
        </Box>
      </Paper>

      {/* Patient Info Summary */}
      <Paper elevation={2} className="patient-summary">
        <Typography variant="h6" gutterBottom>
          פרטי הערכה
        </Typography>

        <Grid container spacing={2}>
          <Grid sx={{ xs: 6, sm: 4 }}>
            <Box className="info-item">
              <Typography variant="caption" color="text.secondary">
                גיל
              </Typography>
              <Typography variant="body1">
                {formData.patientInfo.ageInYears} שנים
              </Typography>
            </Box>
          </Grid>

          <Grid sx={{ xs: 6, sm: 4 }}>
            <Box className="info-item">
              <Typography variant="caption" color="text.secondary">
                מין
              </Typography>
              <Typography variant="body1">
                {formData.patientInfo.biologicalSex === 'male' ? 'זכר' : 'נקבה'}
              </Typography>
            </Box>
          </Grid>

          <Grid sx={{ xs: 6, sm: 4 }}>
            <Box className="info-item">
              <Typography variant="caption" color="text.secondary">
                אבחנה
              </Typography>
              <Typography variant="body1">
                {DIAGNOSIS_LABELS[formData.patientInfo.diagnosis]}
              </Typography>
            </Box>
          </Grid>

          <Grid sx={{ xs: 6, sm: 4 }}>
            <Box className="info-item">
              <Typography variant="caption" color="text.secondary">
                מצב נוכחי
              </Typography>
              <Typography variant="body1">
                {FLARE_STATUS_LABELS[formData.patientInfo.flareStatus]}
              </Typography>
            </Box>
          </Grid>

          <Grid sx={{ xs: 6, sm: 4 }}>
            <Box className="info-item">
              <Typography variant="caption" color="text.secondary">
                טיפול חדש לאחרונה
              </Typography>
              <Typography variant="body1">
                {formData.patientInfo.recentTreatment ? 'כן' : 'לא'}
              </Typography>
            </Box>
          </Grid>
        </Grid>
      </Paper>

      {/* Interpretation Guide */}
      <Paper elevation={2} className="interpretation-guide">
        <Typography variant="h6" gutterBottom>
          מדריך פירוש הציון
        </Typography>

        <Box className="score-ranges">
          {[
            { range: '0-30', label: 'מינימלי', color: '#4CAF50' },
            { range: '31-75', label: 'קל', color: '#8BC34A' },
            { range: '76-150', label: 'בינוני', color: '#FFC107' },
            { range: '151-225', label: 'חמור', color: '#FF9800' },
            { range: '226-306', label: 'קיצוני', color: '#F44336' },
          ].map(({ range, label, color }) => (
            <Box
              key={range}
              className={`range-item ${scores.total >= parseInt(range.split('-')[0]) && scores.total <= parseInt(range.split('-')[1]) ? 'active' : ''}`}
              sx={{ borderColor: color }}
            >
              <Typography variant="body2" fontWeight="bold" sx={{ color }}>
                {range}
              </Typography>
              <Typography variant="caption">{label}</Typography>
            </Box>
          ))}
        </Box>

        <Alert severity="info" sx={{ mt: 2 }}>
          <Typography variant="body2">
            <strong>שימו לב:</strong> הציון מיועד להשוואה בין הערכות שונות באותו מטופל.
            ציון נמוך יותר מצביע על שיפור, ציון גבוה יותר על החמרה.
          </Typography>
        </Alert>
      </Paper>

      {/* Disclaimer */}
      <Alert severity="warning" className="disclaimer">
        <Typography variant="body2">
          <strong>הבהרה:</strong> שאלון PTEC אינו כלי אבחוני. התוצאות מיועדות למעקב אחר שינויים
          לאורך זמן ולשיתוף עם הצוות הרפואי. אין להשתמש בתוצאות אלו לצורך אבחון עצמי.
        </Typography>
      </Alert>

      {/* Action Buttons */}
      <Box className="action-buttons">
        <Button
          variant="outlined"
          startIcon={<RefreshIcon />}
          onClick={() => navigate('/scales/ptec')}
        >
          חזרה להתחלה
        </Button>
        <Button
          variant="contained"
          startIcon={<PrintIcon />}
          onClick={() => window.print()}
          sx={{ backgroundColor: '#00CEC9' }}
        >
          הדפס תוצאות
        </Button>
      </Box>
    </Container>
  );
};

export default PTECResultsPage;
