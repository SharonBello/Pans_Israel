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
  Link,
} from '@mui/material';
import {
  Print as PrintIcon,
  Refresh as RefreshIcon,
  Favorite as HeartIcon,
} from '@mui/icons-material';
import type { CBIFormData, CBIScores } from '@/types/cbiScale';
import { CBI_ITEM_LABELS, MAX_SCORES, PANS_NORMS, CBI_CITATION } from '@/types/cbiScale';
import { getBurdenInfo, compareToNorms } from '@/services/cbiService';
import './CBIResultsPage.scss';

interface ResultsState {
  formData: CBIFormData;
  scores: CBIScores;
  savedDocId?: string;
}

const SUBSCALE_LABELS: Record<string, string> = {
  timeDependency: 'תלות בזמן',
  developmental: 'התפתחותי',
  physical: 'בריאות גופנית',
  emotional: 'בריאות רגשית',
  social: 'יחסים חברתיים',
};

const CBIResultsPage: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const state = location.state as ResultsState | undefined;

  if (!state) {
    navigate('/scales/cbi');
    return null;
  }

  const { formData, scores, savedDocId } = state;
  const burdenInfo = getBurdenInfo(scores.burdenLevel);
  const normComparison = compareToNorms(scores);

  // Get percentage
  const getPercentage = (score: number, max: number) => Math.round((score / max) * 100);

  // Get bar color
  const getBarColor = (percent: number) => {
    if (percent <= 25) return '#4CAF50';
    if (percent <= 50) return '#8BC34A';
    if (percent <= 75) return '#FF9800';
    return '#F44336';
  };

  return (
    <Container maxWidth="md" className="cbi-results-page" dir="rtl">
      <Typography variant="h4" align="center" gutterBottom>
        תוצאות שאלון עומס המטפל
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
        sx={{ backgroundColor: burdenInfo.color + '15' }}
      >
        <Box className="score-display">
          <Typography variant="h1" sx={{ color: burdenInfo.color, fontWeight: 700 }}>
            {scores.total}
          </Typography>
          <Typography variant="h6" color="text.secondary">
            מתוך {MAX_SCORES.total}
          </Typography>
        </Box>

        <Box className="burden-badge" sx={{ backgroundColor: burdenInfo.color }}>
          <Typography variant="h5" sx={{ color: 'white' }}>
            עומס {burdenInfo.label}
          </Typography>
        </Box>

        <Typography variant="body2" color="text.secondary" sx={{ mt: 1, textAlign: 'center' }}>
          {burdenInfo.description}
        </Typography>

        {/* Respite Alert */}
        {scores.needsRespite && (
          <Alert severity="warning" sx={{ mt: 2 }}>
            <Typography variant="body2">
              <strong>שימו לב:</strong> הציון שלכם ({scores.total}) מעל נקודת החתך הקלינית (36),
              מה שמצביע על צורך בשירותי הקלה ותמיכה.
            </Typography>
          </Alert>
        )}

        {/* Score Meter */}
        <Box className="score-meter">
          <LinearProgress
            variant="determinate"
            value={getPercentage(scores.total, MAX_SCORES.total)}
            sx={{
              height: 20,
              borderRadius: 10,
              backgroundColor: 'rgba(0,0,0,0.1)',
              '& .MuiLinearProgress-bar': {
                backgroundColor: burdenInfo.color,
                borderRadius: 10,
              },
            }}
          />
          <Box className="meter-labels">
            <Typography variant="caption">0</Typography>
            <Typography variant="caption" sx={{ fontWeight: 'bold' }}>
              36 (נקודת חתך)
            </Typography>
            <Typography variant="caption">{MAX_SCORES.total}</Typography>
          </Box>
        </Box>
      </Paper>

      {/* PANS Norms Comparison */}
      <Paper elevation={2} className="norms-comparison">
        <Typography variant="h6" gutterBottom>
          השוואה לממוצע PANS
        </Typography>

        <Grid container spacing={3} alignItems="center">
          <Grid sx={{ xs: 6 }}>
            <Box className="norm-stat">
              <Typography variant="body2" color="text.secondary">הציון שלך</Typography>
              <Typography variant="h4" sx={{ color: '#9B59B6' }}>{scores.total}</Typography>
            </Box>
          </Grid>
          <Grid sx={{ xs: 6 }}>
            <Box className="norm-stat">
              <Typography variant="body2" color="text.secondary">ממוצע PANS</Typography>
              <Typography variant="h4">{PANS_NORMS.mean}</Typography>
              <Typography variant="caption" color="text.secondary">
                (SD: {PANS_NORMS.sd})
              </Typography>
            </Box>
          </Grid>
        </Grid>

        <Alert
          severity={normComparison.comparison === 'above' ? 'warning' : 'info'}
          sx={{ mt: 2 }}
        >
          <Typography variant="body2">
            <strong>{normComparison.percentile}</strong> - {normComparison.description}
          </Typography>
        </Alert>
      </Paper>

      {/* Subscale Breakdown */}
      <Paper elevation={2} className="subscale-breakdown">
        <Typography variant="h6" gutterBottom>
          פירוט לפי תחום
        </Typography>

        <Box className="subscales-list">
          {(['timeDependency', 'developmental', 'physical', 'emotional', 'social'] as const).map((key) => {
            const score = key === 'physical' ? scores.subscales.physical : scores.subscales[key];
            const maxScore = key === 'physical' ? MAX_SCORES.subscales.physical : MAX_SCORES.subscales[key];
            const normMean = PANS_NORMS.subscales[key].mean;
            const percent = getPercentage(score, maxScore);
            const color = getBarColor(percent);

            return (
              <Box key={key} className="subscale-row">
                <Box className="subscale-info">
                  <Typography variant="body2" fontWeight="500">
                    {SUBSCALE_LABELS[key]}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    {score} / {maxScore}
                    <Typography component="span" variant="caption" sx={{ ml: 1 }}>
                      (ממוצע PANS: {normMean})
                    </Typography>
                  </Typography>
                </Box>
                <Box className="subscale-bar-container">
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

      {/* Support Resources */}
      <Paper elevation={2} className="support-resources">
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
          <HeartIcon sx={{ color: '#9B59B6' }} />
          <Typography variant="h6">משאבי תמיכה</Typography>
        </Box>

        <Typography variant="body2" paragraph>
          הטיפול בילד עם PANS/PANDAS מאתגר. הנה כמה דברים שיכולים לעזור:
        </Typography>

        <Box component="ul" sx={{ pl: 2 }}>
          <li><Typography variant="body2">דברו עם הרופא המטפל על העומס שאתם חווים</Typography></li>
          <li><Typography variant="body2">חפשו קבוצות תמיכה להורים בקהילה או באינטרנט</Typography></li>
          <li><Typography variant="body2">שקלו פנייה לייעוץ פסיכולוגי או לטיפול זוגי</Typography></li>
          <li><Typography variant="body2">בקשו עזרה ממשפחה וחברים</Typography></li>
          <li><Typography variant="body2">הקפידו על זמן לעצמכם, גם אם קצר</Typography></li>
        </Box>

        <Alert severity="info" sx={{ mt: 2 }}>
          <Typography variant="body2">
            זכרו: לדאוג לעצמכם הוא לא מותרות - זה חלק חשוב מהיכולת לדאוג לילדכם.
          </Typography>
        </Alert>
      </Paper>

      {/* Demographics Summary */}
      {(formData.demographics.reducedWorkHours ||
        formData.demographics.changedSchooling ||
        formData.demographics.missedSchoolDays) && (
          <Paper elevation={2} className="demographics-summary">
            <Typography variant="h6" gutterBottom>
              השפעות נוספות
            </Typography>

            <Box component="ul" sx={{ pl: 2 }}>
              {formData.demographics.reducedWorkHours && (
                <li><Typography variant="body2">הפחתתם את שעות העבודה</Typography></li>
              )}
              {formData.demographics.changedSchooling && (
                <li><Typography variant="body2">שיניתם את סידורי הלימודים של הילד</Typography></li>
              )}
              {formData.demographics.missedSchoolDays && (
                <li><Typography variant="body2">הילד מפספס ימי לימודים</Typography></li>
              )}
            </Box>

            <Typography variant="caption" color="text.secondary" sx={{ mt: 1, display: 'block' }}>
              מחקר מראה שגורמים אלה קשורים לעומס גבוה יותר בקרב הורים לילדי PANS.
            </Typography>
          </Paper>
        )}

      {/* Attribution */}
      <Paper elevation={1} className="attribution">
        <Typography variant="caption" display="block">
          <strong>מקור:</strong> {CBI_CITATION.original.authors} ({CBI_CITATION.original.year}).
          {' '}{CBI_CITATION.original.journal}, {CBI_CITATION.original.volume}.
        </Typography>
        <Typography variant="caption">
          <strong>תיקוף PANS:</strong>{' '}
          <Link
            href={`https://pmc.ncbi.nlm.nih.gov/articles/${CBI_CITATION.pansValidation.pmcid}/`}
            target="_blank"
            rel="noopener"
          >
            Farmer et al., 2018
          </Link>
        </Typography>
      </Paper>

      {/* Action Buttons */}
      <Box className="action-buttons">
        <Button
          variant="outlined"
          startIcon={<RefreshIcon />}
          onClick={() => navigate('/scales/cbi')}
        >
          חזרה להתחלה
        </Button>
        <Button
          variant="contained"
          startIcon={<PrintIcon />}
          onClick={() => window.print()}
          sx={{ backgroundColor: '#9B59B6' }}
        >
          הדפס תוצאות
        </Button>
      </Box>
    </Container>
  );
};

export default CBIResultsPage;
