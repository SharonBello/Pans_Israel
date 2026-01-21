import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import {
  Container,
  Typography,
  Paper,
  Box,
  Button,
  Divider,
  Alert,
  Grid,
  LinearProgress,
  Chip,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Link,
} from '@mui/material';
import {
  Print as PrintIcon,
  Refresh as RefreshIcon,
  Warning as WarningIcon,
} from '@mui/icons-material';
import type { PANS31FormData, PANS31Scores, PANS31Symptoms } from '@/types/pans31Scale';
import {
  PANS31_LABELS,
  PANS31_CATEGORIES,
  MAX_SCORES,
  PANS31_LICENSE,
  SEVERITY_LABELS,
} from '@/types/pans31Scale';
import { getSeverityInfo, getHighSeverityItems } from '@/services/pans31Service';
import './PANS31ResultsPage.scss';

interface ResultsState {
  formData: PANS31FormData;
  scores: PANS31Scores;
  savedDocId?: string;
}

const CATEGORY_LABELS: Record<keyof PANS31Scores['categories'], string> = {
  ocdEating: 'OCD והפרעות אכילה',
  anxietyMood: 'חרדה ומצב רוח',
  behavioral: 'התנהגות',
  cognitiveAcademic: 'קוגניטיבי ולימודי',
  somatic: 'גופני',
  psychosisTics: 'פסיכוזה וטיקים',
};

const PANS31ResultsPage: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const state = location.state as ResultsState | undefined;

  if (!state) {
    navigate('/scales/pans31');
    return null;
  }

  const { formData, scores, savedDocId } = state;
  const severityInfo = getSeverityInfo(scores.severityLevel);
  const highSeverityItems = getHighSeverityItems(formData.symptoms, 3);

  // Get percentage for progress bar
  const getPercentage = (score: number, max: number) => Math.round((score / max) * 100);

  // Get color for score
  const getBarColor = (percent: number) => {
    if (percent <= 20) return '#4CAF50';
    if (percent <= 40) return '#8BC34A';
    if (percent <= 60) return '#FFC107';
    if (percent <= 80) return '#FF9800';
    return '#F44336';
  };

  return (
    <Container maxWidth="md" className="pans31-results-page" dir="rtl">
      <Typography variant="h4" align="center" gutterBottom>
        תוצאות סולם PANS 31-פריטים
      </Typography>

      {savedDocId && (
        <Alert severity="success" sx={{ mb: 2 }}>
          ✓ התוצאות נשמרו בהצלחה
        </Alert>
      )}

      {/* Main Score Card */}
      <Paper
        elevation={3}
        className="total-score-card"
        sx={{ backgroundColor: severityInfo.color + '15' }}
      >
        <Box className="score-display">
          <Typography variant="h1" sx={{ color: severityInfo.color, fontWeight: 700 }}>
            {scores.total}
          </Typography>
          <Typography variant="h6" color="text.secondary">
            מתוך {MAX_SCORES.total}
          </Typography>
        </Box>

        <Box className="severity-badge" sx={{ backgroundColor: severityInfo.color }}>
          <Typography variant="h5" sx={{ color: 'white' }}>
            {severityInfo.label}
          </Typography>
        </Box>

        <Typography variant="body2" color="text.secondary" sx={{ mt: 1, textAlign: 'center' }}>
          {severityInfo.description}
        </Typography>

        <Box className="score-meter">
          <LinearProgress
            variant="determinate"
            value={getPercentage(scores.total, MAX_SCORES.total)}
            sx={{
              height: 20,
              borderRadius: 10,
              backgroundColor: 'rgba(0,0,0,0.1)',
              '& .MuiLinearProgress-bar': {
                backgroundColor: severityInfo.color,
                borderRadius: 10,
              },
            }}
          />
          <Box className="meter-labels">
            <Typography variant="caption">0</Typography>
            <Typography variant="caption">{MAX_SCORES.total}</Typography>
          </Box>
        </Box>
      </Paper>

      {/* High Severity Alerts */}
      {highSeverityItems.length > 0 && (
        <Alert severity="warning" className="high-severity-alert">
          <Typography variant="subtitle2" gutterBottom>
            <WarningIcon sx={{ verticalAlign: 'middle', mr: 1 }} />
            תסמינים בחומרה גבוהה ({highSeverityItems.length}):
          </Typography>
          <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5, mt: 1 }}>
            {highSeverityItems.map(({ key, rating }) => (
              <Chip
                key={key}
                label={`${PANS31_LABELS[key].label} (${rating})`}
                size="small"
                sx={{
                  backgroundColor: rating === 4 ? '#F44336' : '#FF9800',
                  color: 'white',
                }}
              />
            ))}
          </Box>
        </Alert>
      )}

      {/* Category Breakdown */}
      <Paper elevation={2} className="category-breakdown">
        <Typography variant="h6" gutterBottom>
          פירוט לפי קטגוריה
        </Typography>

        <Box className="categories-list">
          {(Object.keys(CATEGORY_LABELS) as (keyof typeof CATEGORY_LABELS)[]).map((cat) => {
            const score = scores.categories[cat];
            const maxScore = MAX_SCORES.categories[cat];
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

      {/* Detailed Breakdown Table */}
      <Paper elevation={2} className="detailed-breakdown">
        <Typography variant="h6" gutterBottom>
          פירוט מלא - 31 פריטים
        </Typography>

        <TableContainer>
          <Table size="small">
            <TableHead>
              <TableRow>
                <TableCell>תסמין</TableCell>
                <TableCell align="center">דירוג</TableCell>
                <TableCell>חומרה</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {Object.entries(PANS31_CATEGORIES).map(([catKey, category]) => (
                <React.Fragment key={catKey}>
                  <TableRow className="category-header-row">
                    <TableCell colSpan={3}>
                      <Typography variant="subtitle2" fontWeight="bold">
                        {category.title}
                      </Typography>
                    </TableCell>
                  </TableRow>
                  {category.items.map((item) => {
                    const rating = formData.symptoms[item];
                    const ratingInfo = SEVERITY_LABELS[rating];
                    return (
                      <TableRow
                        key={item}
                        className={rating >= 3 ? 'high-severity-row' : ''}
                      >
                        <TableCell>{PANS31_LABELS[item].label}</TableCell>
                        <TableCell align="center">
                          <Chip
                            label={rating}
                            size="small"
                            sx={{
                              backgroundColor: getBarColor(rating * 25),
                              color: 'white',
                              minWidth: 30,
                            }}
                          />
                        </TableCell>
                        <TableCell>{ratingInfo.short}</TableCell>
                      </TableRow>
                    );
                  })}
                </React.Fragment>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </Paper>

      {/* Additional Data */}
      {(formData.additional.hoursObsessions || formData.additional.hoursCompulsions) && (
        <Paper elevation={2} className="additional-data">
          <Typography variant="h6" gutterBottom>
            נתונים נוספים
          </Typography>
          <Grid container spacing={2}>
            {formData.additional.hoursObsessions !== null && (
              <Grid item xs={6}>
                <Box className="data-item">
                  <Typography variant="caption" color="text.secondary">
                    שעות אובססיות ביום
                  </Typography>
                  <Typography variant="h5">{formData.additional.hoursObsessions}</Typography>
                </Box>
              </Grid>
            )}
            {formData.additional.hoursCompulsions !== null && (
              <Grid item xs={6}>
                <Box className="data-item">
                  <Typography variant="caption" color="text.secondary">
                    שעות כפייתיות ביום
                  </Typography>
                  <Typography variant="h5">{formData.additional.hoursCompulsions}</Typography>
                </Box>
              </Grid>
            )}
          </Grid>
        </Paper>
      )}

      {/* Disclaimer */}
      <Alert severity="warning" className="disclaimer">
        <Typography variant="body2">
          <strong>הבהרה:</strong> סולם זה הוא כלי הערכה ואינו מהווה תחליף לאבחון רפואי מקצועי.
          יש להתייעץ עם רופא מומחה לקבלת אבחנה וטיפול מתאים.
        </Typography>
      </Alert>

      {/* Attribution */}
      <Paper elevation={1} className="attribution">
        <Typography variant="caption" display="block">
          {PANS31_LICENSE.title} © {PANS31_LICENSE.year} by {PANS31_LICENSE.authors}
        </Typography>
        <Typography variant="caption">
          Licensed under{' '}
          <Link
            href="https://creativecommons.org/licenses/by-nc-sa/4.0/"
            target="_blank"
            rel="noopener"
          >
            {PANS31_LICENSE.license}
          </Link>
        </Typography>
      </Paper>

      {/* Action Buttons */}
      <Box className="action-buttons">
        <Button
          variant="outlined"
          startIcon={<RefreshIcon />}
          onClick={() => navigate('/scales/pans31')}
        >
          חזרה להתחלה
        </Button>
        <Button
          variant="contained"
          startIcon={<PrintIcon />}
          onClick={() => window.print()}
          sx={{ backgroundColor: '#717DBC' }}
        >
          הדפס תוצאות
        </Button>
      </Box>
    </Container>
  );
};

export default PANS31ResultsPage;
