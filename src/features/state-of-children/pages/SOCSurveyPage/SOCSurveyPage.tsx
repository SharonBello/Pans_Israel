import React, { useState, useCallback, useMemo, useEffect, useRef } from 'react';
import {
    Box,
    Typography,
    Button,
    TextField,
    Container,
    Alert,
    CircularProgress,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
} from '@mui/material';
import { FiArrowRight, FiArrowLeft, FiSend, FiCheck, FiInfo } from 'react-icons/fi';
import { useNavigate } from 'react-router-dom';
import ReCAPTCHA from 'react-google-recaptcha';
import SurveyQuestion from '../../../shared/components/SurveyQuestion/SurveyQuestion';
import SurveyProgress from '../../../shared/components/SurveyProgress/SurveyProgress';
import { socCategories, socSurveyDefinition, getAllQuestions } from '../../data/socQuestions';
import { SOC_SURVEY_ID } from '../../types/socTypes';
import { submitSurveyResponse, getEmailSubmissionInfo } from '../../../shared/services/surveyService';
import './SOCSurveyPage.scss';

const RECAPTCHA_SITE_KEY = import.meta.env.VITE_RECAPTCHA_SITE_KEY as string;

// --------------------------------------------------------------------------
// Types
// --------------------------------------------------------------------------

interface SurveyState {
    email: string;
    childIndex: number;
    answers: Record<string, string | number | boolean | string[]>;
    currentCategoryIndex: number;
    errors: Record<string, string>;
    isSubmitting: boolean;
    isComplete: boolean;
    hasStarted: boolean;
}

// --------------------------------------------------------------------------
// Initial State
// --------------------------------------------------------------------------

const initialState: SurveyState = {
    email: '',
    childIndex: 1,
    answers: {},
    currentCategoryIndex: 0,
    errors: {},
    isSubmitting: false,
    isComplete: false,
    hasStarted: false,
};

// --------------------------------------------------------------------------
// Helper: Check if answer is valid (handles 0 and false correctly)
// --------------------------------------------------------------------------

const isAnswerProvided = (answer: string | number | boolean | string[] | undefined): boolean => {
    if (answer === undefined || answer === null) return false;
    if (answer === '') return false;
    if (Array.isArray(answer) && answer.length === 0) return false;
    return true;
};

// --------------------------------------------------------------------------
// Component
// --------------------------------------------------------------------------

const SOCSurveyPage: React.FC = () => {
    const navigate = useNavigate();
    const [state, setState] = useState<SurveyState>(initialState);
    const [emailInfo, setEmailInfo] = useState<{ hasSubmitted: boolean; count: number } | null>(null);
    const [showConfirmDialog, setShowConfirmDialog] = useState(false);
    const [submitError, setSubmitError] = useState<string | null>(null);

    // ── reCAPTCHA ────────────────────────────────────────────────────────────
    const [captchaToken, setCaptchaToken] = useState<string | null>(null);
    const recaptchaRef = useRef<ReCAPTCHA>(null);
    // ─────────────────────────────────────────────────────────────────────────

    const allQuestions = useMemo(() => getAllQuestions(), []);
    const currentCategory = socCategories[state.currentCategoryIndex];

    const visibleQuestions = useMemo(() => {
        return currentCategory.questions.filter((question) => {
            if (!question.dependsOn) return true;
            const dependsOnValue = state.answers[question.dependsOn.questionId];
            return question.dependsOn.values.some(v => {
                if (typeof v === 'boolean') {
                    return dependsOnValue === v || dependsOnValue === String(v);
                }
                return dependsOnValue === v;
            });
        });
    }, [currentCategory, state.answers]);

    // Initialize scale questions with their minimum value when visible
    useEffect(() => {
        const scaleDefaults: Record<string, number> = {};
        visibleQuestions.forEach((question) => {
            if (question.type === 'scale' && state.answers[question.id] === undefined) {
                scaleDefaults[question.id] = question.scaleMin ?? 0;
            }
        });
        if (Object.keys(scaleDefaults).length > 0) {
            setState(prev => ({
                ...prev,
                answers: { ...prev.answers, ...scaleDefaults },
            }));
        }
    }, [visibleQuestions, state.currentCategoryIndex]);

    const answeredCount = useMemo(() => {
        return allQuestions.filter(q => isAnswerProvided(state.answers[q.id])).length;
    }, [state.answers, allQuestions]);

    // --------------------------------------------------------------------------
    // Email Check
    // --------------------------------------------------------------------------

    const checkEmail = useCallback(async (email: string) => {
        if (!email || !email.includes('@')) return;
        try {
            const info = await getEmailSubmissionInfo(email);
            setEmailInfo({ hasSubmitted: info.hasSubmitted, count: info.submissionCount });
            if (info.hasSubmitted) {
                setState(prev => ({ ...prev, childIndex: info.submissionCount + 1 }));
            }
        } catch (error) {
            console.error('Error checking email:', error);
        }
    }, []);

    // --------------------------------------------------------------------------
    // Handlers
    // --------------------------------------------------------------------------

    const handleEmailChange = (email: string) => {
        setState(prev => ({ ...prev, email }));
        setEmailInfo(null);
    };

    const handleEmailBlur = () => {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (state.email && emailRegex.test(state.email)) {  // ← only call if valid format
            checkEmail(state.email);
        }
    };

    const handleStartSurvey = () => {
        // Validate email
        if (!state.email || !state.email.includes('@')) {
            setState(prev => ({
                ...prev,
                errors: { ...prev.errors, email: 'נא להזין כתובת אימייל תקינה' },
            }));
            return;
        }

        // Validate captcha
        if (!captchaToken) {
            setState(prev => ({
                ...prev,
                errors: { ...prev.errors, captcha: 'אנא אשר שאינך רובוט' },
            }));
            return;
        }

        setState(prev => ({ ...prev, hasStarted: true, errors: {} }));
    };

    const handleAnswerChange = useCallback((questionId: string, value: string | number | boolean | string[]) => {
        setState(prev => ({
            ...prev,
            answers: { ...prev.answers, [questionId]: value },
            errors: { ...prev.errors, [questionId]: '' },
        }));
    }, []);

    const validateCategory = useCallback((): boolean => {
        const newErrors: Record<string, string> = {};
        visibleQuestions.forEach((question) => {
            if (question.required) {
                const answer = state.answers[question.id];
                if (!isAnswerProvided(answer)) {
                    if (question.type === 'multiple_choice') {
                        newErrors[question.id] = 'נא לבחור לפחות אפשרות אחת';
                    } else {
                        newErrors[question.id] = 'שדה חובה';
                    }
                }
            }
        });
        setState(prev => ({ ...prev, errors: newErrors }));
        return Object.keys(newErrors).length === 0;
    }, [visibleQuestions, state.answers]);

    const handleNext = useCallback(() => {
        if (!validateCategory()) {
            setTimeout(() => {
                const currentErrors: string[] = [];
                visibleQuestions.forEach((q) => {
                    if (q.required && !isAnswerProvided(state.answers[q.id])) {
                        currentErrors.push(q.id);
                    }
                });
                const firstErrorKey = currentErrors[0];
                if (firstErrorKey) {
                    document.getElementById(`question-${firstErrorKey}`)?.scrollIntoView({
                        behavior: 'smooth',
                        block: 'center',
                    });
                }
            }, 100);
            return;
        }

        if (state.currentCategoryIndex < socCategories.length - 1) {
            setState(prev => ({
                ...prev,
                currentCategoryIndex: prev.currentCategoryIndex + 1,
                errors: {},
            }));
            window.scrollTo({ top: 0, behavior: 'smooth' });
        } else {
            setShowConfirmDialog(true);
        }
    }, [validateCategory, state.currentCategoryIndex, state.answers, visibleQuestions]);

    const handlePrevious = useCallback(() => {
        if (state.currentCategoryIndex > 0) {
            setState(prev => ({
                ...prev,
                currentCategoryIndex: prev.currentCategoryIndex - 1,
                errors: {},
            }));
            window.scrollTo({ top: 0, behavior: 'smooth' });
        }
    }, [state.currentCategoryIndex]);

    const handleGoToCategory = useCallback((index: number) => {
        if (index <= state.currentCategoryIndex) {
            setState(prev => ({
                ...prev,
                currentCategoryIndex: index,
                errors: {},
            }));
            window.scrollTo({ top: 0, behavior: 'smooth' });
        }
    }, [state.currentCategoryIndex]);

    const handleSubmit = async () => {
        setShowConfirmDialog(false);
        setState(prev => ({ ...prev, isSubmitting: true }));
        setSubmitError(null);

        try {
            const result = await submitSurveyResponse(
                SOC_SURVEY_ID,
                state.email,
                state.answers,
                state.childIndex
            );

            if (result.success) {
                setState(prev => ({ ...prev, isComplete: true, isSubmitting: false }));
                navigate('/surveys/state-of-children/results');
            } else {
                setSubmitError(result.error || 'אירעה שגיאה בשליחת הסקר. נסו שוב.');
                setState(prev => ({ ...prev, isSubmitting: false }));
            }
        } catch (error) {
            console.error('Submit error:', error);
            setSubmitError('אירעה שגיאה בשליחת הסקר. נסו שוב.');
            setState(prev => ({ ...prev, isSubmitting: false }));
        }
    };

    // --------------------------------------------------------------------------
    // Render: Email + Captcha (intro screen)
    // --------------------------------------------------------------------------

    if (!state.hasStarted) {
        return (
            <Box className="soc-survey" dir="rtl">
                <Container maxWidth="md">
                    <Box className="soc-survey__intro">
                        <Typography variant="h3" className="soc-survey__title">
                            {socSurveyDefinition.title}
                        </Typography>
                        <Typography className="soc-survey__description">
                            {socSurveyDefinition.description}
                        </Typography>

                        <Box className="soc-survey__info-cards">
                            <Box className="soc-survey__info-card">
                                <span className="soc-survey__info-icon">📋</span>
                                <Typography className="soc-survey__info-text">
                                    {allQuestions.length} שאלות ב-{socCategories.length} קטגוריות
                                </Typography>
                            </Box>
                            <Box className="soc-survey__info-card">
                                <span className="soc-survey__info-icon">⏱️</span>
                                <Typography className="soc-survey__info-text">
                                    זמן מילוי משוער: 15-20 דקות
                                </Typography>
                            </Box>
                            <Box className="soc-survey__info-card">
                                <span className="soc-survey__info-icon">🔒</span>
                                <Typography className="soc-survey__info-text">
                                    המידע נשמר באופן אנונימי
                                </Typography>
                            </Box>
                        </Box>

                        <Box className="soc-survey__email-section">
                            <Typography className="soc-survey__email-label">
                                להתחלת הסקר, הזינו את כתובת האימייל שלכם
                            </Typography>
                            <Typography className="soc-survey__email-note">
                                <FiInfo /> האימייל משמש לזיהוי פנימי בלבד ולא יקושר לתשובות
                            </Typography>

                            <TextField
                                type="email"
                                value={state.email}
                                onChange={(e) => handleEmailChange(e.target.value)}
                                onBlur={handleEmailBlur}
                                placeholder="your@email.com"
                                error={!!state.errors.email}
                                helperText={state.errors.email}
                                fullWidth
                                className="soc-survey__email-input"
                                dir="ltr"
                            />

                            {emailInfo?.hasSubmitted && (
                                <Alert severity="info" className="soc-survey__email-alert">
                                    כתובת האימייל הזו כבר מילאה {emailInfo.count} סקר/ים.
                                    אם יש לכם ילד נוסף עם פאנס/פאנדס, אתם מוזמנים למלא סקר נוסף.
                                    זה יהיה הסקר מספר {emailInfo.count + 1} עבור משפחתכם.
                                </Alert>
                            )}

                            {/* ── reCAPTCHA — sits between email and button ── */}
                            <Box className="soc-survey__captcha">
                                <ReCAPTCHA
                                    ref={recaptchaRef}
                                    sitekey={RECAPTCHA_SITE_KEY}
                                    onChange={(token) => {
                                        setCaptchaToken(token);
                                        // Clear captcha error if it was shown
                                        setState(prev => ({
                                            ...prev,
                                            errors: { ...prev.errors, captcha: '' },
                                        }));
                                    }}
                                    onExpired={() => setCaptchaToken(null)}
                                    hl="he"
                                />
                                {state.errors.captcha && (
                                    <Typography className="soc-survey__captcha-error">
                                        {state.errors.captcha}
                                    </Typography>
                                )}
                            </Box>
                            {/* ─────────────────────────────────────────────── */}

                            <Button
                                variant="contained"
                                onClick={handleStartSurvey}
                                className="soc-survey__start-btn"
                                endIcon={<FiArrowLeft />}
                                disabled={!captchaToken}
                            >
                                התחל את הסקר
                            </Button>
                        </Box>

                        <Typography className="soc-survey__disclaimer">
                            * הסקר הוא אנונימי ומיועד למטרות מחקר והגברת מודעות בלבד.
                            אין לראות בו ייעוץ רפואי.
                        </Typography>
                    </Box>
                </Container>
            </Box>
        );
    }

    // --------------------------------------------------------------------------
    // Render: Success
    // --------------------------------------------------------------------------

    if (state.isComplete) {
        return (
            <Box className="soc-survey soc-survey--complete" dir="rtl">
                <Container maxWidth="md">
                    <Box className="soc-survey__success">
                        <Box className="soc-survey__success-icon">
                            <FiCheck />
                        </Box>
                        <Typography variant="h4" className="soc-survey__success-title">
                            תודה רבה!
                        </Typography>
                        <Typography className="soc-survey__success-text">
                            הסקר נשלח בהצלחה. התשובות שלכם יסייעו להגביר את המודעות
                            ל-פאנס/פאנדס בישראל ולקדם מחקר בתחום.
                        </Typography>
                        <Box className="soc-survey__success-actions">
                            <Button
                                variant="contained"
                                onClick={() => navigate('/surveys/state-of-children/results')}
                                className="soc-survey__success-btn"
                            >
                                צפה בתוצאות הסקר
                            </Button>
                            <Button
                                variant="outlined"
                                onClick={() => navigate('/')}
                                className="soc-survey__success-btn soc-survey__success-btn--secondary"
                            >
                                חזרה לדף הבית
                            </Button>
                        </Box>
                    </Box>
                </Container>
            </Box>
        );
    }

    // --------------------------------------------------------------------------
    // Render: Survey Form
    // --------------------------------------------------------------------------

    return (
        <Box className="soc-survey" dir="rtl">
            <Container maxWidth="lg">
                <SurveyProgress
                    currentCategoryIndex={state.currentCategoryIndex}
                    totalCategories={socCategories.length}
                    categories={socCategories.map(c => ({ id: c.id, title: c.title, icon: c.icon }))}
                    questionsAnswered={answeredCount}
                    totalQuestions={allQuestions.length}
                    onCategoryClick={handleGoToCategory}
                />

                <Box className="soc-survey__category-header">
                    <Typography className="soc-survey__category-icon">
                        {currentCategory.icon}
                    </Typography>
                    <Typography variant="h4" className="soc-survey__category-title">
                        {currentCategory.title}
                    </Typography>
                    {currentCategory.description && (
                        <Typography className="soc-survey__category-description">
                            {currentCategory.description}
                        </Typography>
                    )}
                </Box>

                <Box className="soc-survey__questions">
                    {visibleQuestions.map((question) => (
                        <Box key={question.id} id={`question-${question.id}`}>
                            <SurveyQuestion
                                question={question}
                                value={state.answers[question.id]}
                                onChange={(value) => handleAnswerChange(question.id, value)}
                                error={state.errors[question.id]}
                                disabled={state.isSubmitting}
                            />
                        </Box>
                    ))}
                </Box>

                {submitError && (
                    <Alert severity="error" className="soc-survey__error-alert">
                        {submitError}
                    </Alert>
                )}

                <Box className="soc-survey__navigation">
                    <Button
                        variant="outlined"
                        onClick={handlePrevious}
                        disabled={state.currentCategoryIndex === 0 || state.isSubmitting}
                        startIcon={<FiArrowRight />}
                        className="soc-survey__nav-btn soc-survey__nav-btn--prev"
                    >
                        הקודם
                    </Button>

                    <Typography className="soc-survey__nav-info">
                        {state.currentCategoryIndex + 1} / {socCategories.length}
                    </Typography>

                    <Button
                        variant="contained"
                        onClick={handleNext}
                        disabled={state.isSubmitting}
                        endIcon={
                            state.isSubmitting ? (
                                <CircularProgress size={20} color="inherit" />
                            ) : state.currentCategoryIndex === socCategories.length - 1 ? (
                                <FiSend />
                            ) : (
                                <FiArrowLeft />
                            )
                        }
                        className="soc-survey__nav-btn soc-survey__nav-btn--next"
                    >
                        {state.currentCategoryIndex === socCategories.length - 1 ? 'שלח סקר' : 'הבא'}
                    </Button>
                </Box>
            </Container>

            <Dialog
                open={showConfirmDialog}
                onClose={() => setShowConfirmDialog(false)}
                className="soc-survey__dialog"
                dir="rtl"
            >
                <DialogTitle className="soc-survey__dialog-title">
                    שליחת הסקר
                </DialogTitle>
                <DialogContent>
                    <Typography className="soc-survey__dialog-text">
                        האם אתם בטוחים שברצונכם לשלוח את הסקר?
                        לא ניתן לערוך את התשובות לאחר השליחה.
                    </Typography>
                </DialogContent>
                <DialogActions className="soc-survey__dialog-actions">
                    <Button onClick={() => setShowConfirmDialog(false)}>
                        חזור לעריכה
                    </Button>
                    <Button
                        variant="contained"
                        onClick={handleSubmit}
                        startIcon={<FiSend />}
                    >
                        שלח סקר
                    </Button>
                </DialogActions>
            </Dialog>
        </Box>
    );
};

export default SOCSurveyPage;