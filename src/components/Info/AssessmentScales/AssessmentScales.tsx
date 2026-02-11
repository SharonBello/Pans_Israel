import React, { useState } from 'react';
import {
  Box,
  Typography,
  Card,
  CardContent,
  Button,
  RadioGroup,
  FormControlLabel,
  Radio,
  LinearProgress,
  Collapse,
  IconButton,
  Link,
  Chip,
} from '@mui/material';
import {
  Download as DownloadIcon,
  OpenInNew as ExternalIcon,
  ExpandMore as ExpandIcon,
  ExpandLess as CollapseIcon,
  RestartAlt as ResetIcon,
  Assessment as AssessmentIcon,
} from '@mui/icons-material';
import type { AssessmentScale, AssessmentQuestion } from '../../../types/info.types';
import { assessmentScales } from '../../../data/infoContent';
import './AssessmentScales.scss';

interface AssessmentScalesProps {
  showInteractive?: boolean;
}

const AssessmentScales: React.FC<AssessmentScalesProps> = ({ showInteractive = true }) => {
  const [expandedScale, setExpandedScale] = useState<string | null>(null);
  const [answers, setAnswers] = useState<Record<string, number>>({});
  const [showResults, setShowResults] = useState(false);

  const externalScales = assessmentScales.filter((s) => s.type === 'external');
  const interactiveScales = assessmentScales.filter((s) => s.type === 'interactive');

  const handleAnswerChange = (questionId: string, value: number) => {
    setAnswers((prev) => ({
      ...prev,
      [questionId]: value,
    }));
    setShowResults(false);
  };

  const calculateScore = (scale: AssessmentScale): number => {
    if (!scale.questions) return 0;
    return scale.questions.reduce((total, q) => {
      return total + (answers[q.id] || 0);
    }, 0);
  };

  const getInterpretation = (scale: AssessmentScale) => {
    const score = calculateScore(scale);
    return scale.interpretation?.find(
      (i) => score >= i.minScore && score <= i.maxScore
    );
  };

  const getProgress = (scale: AssessmentScale): number => {
    if (!scale.questions) return 0;
    const answered = scale.questions.filter((q) => answers[q.id] !== undefined).length;
    return (answered / scale.questions.length) * 100;
  };

  const isComplete = (scale: AssessmentScale): boolean => {
    if (!scale.questions) return false;
    return scale.questions.every((q) => answers[q.id] !== undefined);
  };

  const handleReset = () => {
    setAnswers({});
    setShowResults(false);
  };

  const getSeverityColor = (severity: string): string => {
    switch (severity) {
      case 'minimal':
        return '#4caf50';
      case 'mild':
        return '#8bc34a';
      case 'moderate':
        return '#ff9800';
      case 'severe':
        return '#f44336';
      case 'extreme':
        return '#9c27b0';
      default:
        return '#757575';
    }
  };

  return (
    <Box className="assessment-scales" dir="rtl">
      {/* External Scales Section */}
      {/* <Box className="assessment-scales__section">
        <Typography variant="h5" className="assessment-scales__section-title">
          <DownloadIcon />
          סולמות הערכה להורדה
        </Typography>
        <Typography variant="body2" className="assessment-scales__section-description">
          סולמות אלו משמשים רופאים להערכת חומרת התסמינים. הורידו והציגו לרופא שלכם.
        </Typography>

        <Box className="assessment-scales__grid">
          {externalScales.map((scale) => (
            <Card key={scale.id} className="assessment-scales__card assessment-scales__card--external">
              <CardContent>
                <Typography variant="h6" className="assessment-scales__card-title">
                  {scale.titleHe}
                </Typography>
                <Typography variant="body2" className="assessment-scales__card-description">
                  {scale.descriptionHe}
                </Typography>
                <Typography variant="caption" className="assessment-scales__card-title-en">
                  {scale.title}
                </Typography>
                <Link
                  href={scale.externalUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="assessment-scales__download-link"
                >
                  <Button
                    variant="outlined"
                    startIcon={<ExternalIcon />}
                    className="assessment-scales__download-button"
                    fullWidth
                  >
                    פתח PDF
                  </Button>
                </Link>
              </CardContent>
            </Card>
          ))}
        </Box>
      </Box> */}

      {/* Interactive Scales Section */}
      {showInteractive && interactiveScales.length > 0 && (
        <Box className="assessment-scales__section">
          <Typography variant="h5" className="assessment-scales__section-title">
            <AssessmentIcon />
            הערכה אינטראקטיבית
          </Typography>
          <Typography variant="body2" className="assessment-scales__section-description">
            השתמשו בכלי זה להערכה ראשונית. זו אינה אבחנה רפואית - רק כלי עזר לתקשורת עם הרופא.
          </Typography>

          {interactiveScales.map((scale) => (
            <Card key={scale.id} className="assessment-scales__interactive-card">
              <CardContent>
                <Box className="assessment-scales__interactive-header">
                  <Box>
                    <Typography variant="h6" className="assessment-scales__card-title">
                      {scale.titleHe}
                    </Typography>
                    <Typography variant="body2" className="assessment-scales__card-description">
                      {scale.descriptionHe}
                    </Typography>
                  </Box>
                  <IconButton
                    onClick={() =>
                      setExpandedScale(expandedScale === scale.id ? null : scale.id)
                    }
                    className="assessment-scales__expand-button"
                  >
                    {expandedScale === scale.id ? <CollapseIcon /> : <ExpandIcon />}
                  </IconButton>
                </Box>

                <Collapse in={expandedScale === scale.id}>
                  <Box className="assessment-scales__questions">
                    {/* Progress bar */}
                    <Box className="assessment-scales__progress">
                      <Typography variant="caption">
                        התקדמות: {Math.round(getProgress(scale))}%
                      </Typography>
                      <LinearProgress
                        variant="determinate"
                        value={getProgress(scale)}
                        className="assessment-scales__progress-bar"
                      />
                    </Box>

                    {/* Questions */}
                    {scale.questions?.map((question: AssessmentQuestion, index: number) => (
                      <Box key={question.id} className="assessment-scales__question">
                        <Typography variant="subtitle2" className="assessment-scales__question-number">
                          שאלה {index + 1} מתוך {scale.questions?.length}
                        </Typography>
                        <Typography variant="body1" className="assessment-scales__question-text">
                          {question.questionHe}
                        </Typography>
                        <RadioGroup
                          value={answers[question.id] ?? ''}
                          onChange={(e) =>
                            handleAnswerChange(question.id, parseInt(e.target.value))
                          }
                          className="assessment-scales__options"
                        >
                          {question.options.map((option) => (
                            <FormControlLabel
                              key={option.value}
                              value={option.value}
                              control={<Radio />}
                              label={option.labelHe}
                              className="assessment-scales__option"
                            />
                          ))}
                        </RadioGroup>
                      </Box>
                    ))}

                    {/* Action buttons */}
                    <Box className="assessment-scales__actions">
                      <Button
                        variant="outlined"
                        startIcon={<ResetIcon />}
                        onClick={handleReset}
                        className="assessment-scales__reset-button"
                      >
                        התחל מחדש
                      </Button>
                      <Button
                        variant="contained"
                        onClick={() => setShowResults(true)}
                        disabled={!isComplete(scale)}
                        className="assessment-scales__submit-button"
                      >
                        הצג תוצאות
                      </Button>
                    </Box>

                    {/* Results */}
                    {showResults && isComplete(scale) && (
                      <Box className="assessment-scales__results">
                        <Typography variant="h6" className="assessment-scales__results-title">
                          תוצאות ההערכה
                        </Typography>
                        <Box className="assessment-scales__score">
                          <Typography variant="h3" className="assessment-scales__score-value">
                            {calculateScore(scale)}
                          </Typography>
                          <Typography variant="body2" className="assessment-scales__score-max">
                            מתוך {scale.maxScore}
                          </Typography>
                        </Box>

                        {getInterpretation(scale) && (
                          <Box className="assessment-scales__interpretation">
                            <Chip
                              label={getInterpretation(scale)?.labelHe}
                              sx={{
                                backgroundColor: getSeverityColor(
                                  getInterpretation(scale)?.severity || ''
                                ),
                                color: 'white',
                                fontWeight: 600,
                                fontSize: '1rem',
                                padding: '8px 16px',
                                marginBottom: '12px',
                              }}
                            />
                            <Typography variant="body1" className="assessment-scales__interpretation-text">
                              {getInterpretation(scale)?.descriptionHe}
                            </Typography>
                          </Box>
                        )}

                        <Box className="assessment-scales__disclaimer">
                          <Typography variant="caption">
                            ⚠️ שים לב: הערכה זו היא כלי עזר בלבד ואינה מהווה אבחנה רפואית.
                            אם אתה חושד שלילדך יש פאנס/פאנדס, פנה לרופא מומחה.
                          </Typography>
                        </Box>
                      </Box>
                    )}
                  </Box>
                </Collapse>
              </CardContent>
            </Card>
          ))}
        </Box>
      )}
    </Box>
  );
};

export default AssessmentScales;
