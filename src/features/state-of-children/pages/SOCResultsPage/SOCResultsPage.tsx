import React, { useState, useEffect, useMemo } from 'react';
import {
    Box,
    Typography,
    Container,
    CircularProgress,
    Alert,
    Grid,
    Card,
    CardContent,
    Tabs,
    Tab,
} from '@mui/material';
import {
    PieChart,
    Pie,
    Cell,
    BarChart,
    Bar,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer,
    RadialBarChart,
    RadialBar,
} from 'recharts';
import { FiUsers, FiActivity, FiTrendingUp, FiHeart } from 'react-icons/fi';
import { getSurveyResponses, getSurveyResponseCount, getUniqueFamilyCount } from '../../../shared/services/surveyService';
import { SOC_SURVEY_ID } from '../../types/socTypes';
import type { BaseSurveyResponse } from '../../../shared/types/baseSurveyTypes';
import './SOCResultsPage.scss';

// --------------------------------------------------------------------------
// Types
// --------------------------------------------------------------------------

interface StatsCardData {
    icon: React.ReactNode;
    label: string;
    value: string | number;
    color: string;
}

interface ChartData {
    name: string;
    value: number;
    color?: string;
}

// --------------------------------------------------------------------------
// Colors
// --------------------------------------------------------------------------

const CHART_COLORS = [
    '#023373', // Primary
    '#6CA6D9', // Medium
    '#E67E22', // Accent
    '#4CAF50', // Success
    '#A7D5F2', // Light
    '#9C27B0', // Purple
    '#FF5722', // Deep Orange
    '#00BCD4', // Cyan
];

const SEVERITY_COLORS = [
    '#4CAF50', // 0 - Green
    '#8BC34A', // 1 - Light Green
    '#FFC107', // 2 - Yellow
    '#FF9800', // 3 - Orange
    '#FF5722', // 4 - Deep Orange
    '#F44336', // 5 - Red
];

// --------------------------------------------------------------------------
// Helper Functions
// --------------------------------------------------------------------------

const calculatePercentages = (
    responses: BaseSurveyResponse[],
    questionId: string,
    options: Array<{ value: string; label: string }>
): ChartData[] => {
    const counts: Record<string, number> = {};
    options.forEach(opt => counts[opt.value] = 0);

    responses.forEach(response => {
        const answer = response.answers[questionId];
        if (typeof answer === 'string' && counts[answer] !== undefined) {
            counts[answer]++;
        } else if (typeof answer === 'boolean') {
            const key = answer ? 'yes' : 'no';
            if (counts[key] !== undefined) counts[key]++;
        }
    });

    return options.map((opt, index) => ({
        name: opt.label,
        value: counts[opt.value] || 0,
        color: CHART_COLORS[index % CHART_COLORS.length],
    })).filter(d => d.value > 0);
};

const calculateAverageScale = (
    responses: BaseSurveyResponse[],
    questionId: string
): number => {
    const values = responses
        .map(r => r.answers[questionId])
        .filter((v): v is number => typeof v === 'number');

    if (values.length === 0) return 0;
    return values.reduce((a, b) => a + b, 0) / values.length;
};

const calculateSymptomAverages = (
    responses: BaseSurveyResponse[]
): ChartData[] => {
    const symptomQuestions = [
        { id: 'symptom_ocd', label: 'OCD' },
        { id: 'symptom_anxiety', label: 'חרדה' },
        { id: 'symptom_separation_anxiety', label: 'חרדת פרידה' },
        { id: 'symptom_mood_swings', label: 'שינויי מצב רוח' },
        { id: 'symptom_irritability', label: 'עצבנות' },
        { id: 'symptom_aggression', label: 'תוקפנות' },
        { id: 'symptom_depression', label: 'דיכאון' },
        { id: 'symptom_tics_motor', label: 'טיקים מוטוריים' },
        { id: 'symptom_tics_vocal', label: 'טיקים קוליים' },
        { id: 'symptom_sensory_sensitivity', label: 'רגישות חושית' },
        { id: 'symptom_sleep_issues', label: 'בעיות שינה' },
        { id: 'symptom_eating_issues', label: 'בעיות אכילה' },
        { id: 'symptom_urinary_issues', label: 'בעיות במתן שתן' },
        { id: 'symptom_cognitive_decline', label: 'ירידה קוגניטיבית' },
        { id: 'symptom_handwriting_decline', label: 'ירידה בכתב יד' },
        { id: 'symptom_regression', label: 'רגרסיה' },
        { id: 'symptom_hallucinations', label: 'הזיות' },
    ];

    return symptomQuestions.map(q => ({
        name: q.label,
        value: Math.round(calculateAverageScale(responses, q.id) * 20),
    })).filter(s => s.value > 0)  // Only show symptoms that exist
        .sort((a, b) => b.value - a.value);
};

// --------------------------------------------------------------------------
// Component
// --------------------------------------------------------------------------

const SOCResultsPage: React.FC = () => {
    const [responses, setResponses] = useState<BaseSurveyResponse[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [totalCount, setTotalCount] = useState(0);
    const [familyCount, setFamilyCount] = useState(0);
    const [activeTab, setActiveTab] = useState(0);

    // --------------------------------------------------------------------------
    // Fetch Data
    // --------------------------------------------------------------------------

    useEffect(() => {
        const fetchData = async () => {
            try {
                setLoading(true);
                const [responsesData, total, families] = await Promise.all([
                    getSurveyResponses(SOC_SURVEY_ID),
                    getSurveyResponseCount(SOC_SURVEY_ID),
                    getUniqueFamilyCount(SOC_SURVEY_ID),
                ]);
                setResponses(responsesData);
                setTotalCount(total);
                setFamilyCount(families);
            } catch (err) {
                setError('שגיאה בטעינת הנתונים');
                console.error(err);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, []);

    // --------------------------------------------------------------------------
    // Computed Data
    // --------------------------------------------------------------------------

    const statsCards: StatsCardData[] = useMemo(() => [
        {
            icon: <FiUsers />,
            label: 'סה"כ תשובות',
            value: totalCount,
            color: '#023373',
        },
        {
            icon: <FiHeart />,
            label: 'משפחות משתתפות',
            value: familyCount,
            color: '#E67E22',
        },
        {
            icon: <FiActivity />,
            label: 'שיעור הפוגה',
            value: responses.length > 0
                ? `${Math.round((responses.filter(r =>
                    r.answers.symptoms_remitted === 'full_remission' ||
                    r.answers.symptoms_remitted === 'mostly_managed'
                ).length / responses.length) * 100)}%`
                : '0%',
            color: '#4CAF50',
        },
        {
            icon: <FiTrendingUp />,
            label: 'גיל ממוצע בהתפרצות',
            value: responses.length > 0
                ? `${(responses.reduce((sum, r) => {
                    const age = r.answers.child_onset_age;
                    return sum + (typeof age === 'number' ? age : 0);
                }, 0) / responses.filter(r => typeof r.answers.child_onset_age === 'number').length || 0).toFixed(1)}`
                : '0',
            color: '#6CA6D9',
        },
    ], [responses, totalCount, familyCount]);

    const genderData = useMemo(() =>
        calculatePercentages(responses, 'child_gender', [
            { value: 'male', label: 'זכר' },
            { value: 'female', label: 'נקבה' },
            { value: 'other', label: 'אחר' },
        ]), [responses]);

    const triggerData = useMemo(() =>
        calculatePercentages(responses, 'primary_trigger', [
            { value: 'strep', label: 'סטרפטוקוק' },
            { value: 'mycoplasma', label: 'מיקופלזמה' },
            { value: 'lyme', label: 'ליים' },
            { value: 'flu', label: 'שפעת' },
            { value: 'covid', label: 'COVID-19' },
            { value: 'ebv', label: 'EBV' },
            { value: 'unknown', label: 'לא ידוע' },
            { value: 'other', label: 'אחר' },
        ]), [responses]);

    const symptomData = useMemo(() => calculateSymptomAverages(responses), [responses]);

    const diagnosedByData = useMemo(() =>
        calculatePercentages(responses, 'diagnosed_by', [
            { value: 'pediatrician', label: 'רופא ילדים' },
            { value: 'neurologist', label: 'נוירולוג' },
            { value: 'psychiatrist', label: 'פסיכיאטר' },
            { value: 'immunologist', label: 'אימונולוג' },
            { value: 'infectious', label: 'מומחה למחלות זיהומיות' },
            { value: 'rheumatologist', label: 'ראומטולוג' },
            { value: 'naturopath', label: 'רופא נטורופתי' },
            { value: 'self', label: 'אבחון עצמי' },
            { value: 'other', label: 'אחר' },
        ]), [responses]);

    const treatmentData = useMemo(() => {
        const treatments = [
            { id: 'antibiotics', label: 'אנטיביוטיקה' },
            { id: 'nsaids', label: 'נוגדי דלקת' },
            { id: 'steroids', label: 'סטרואידים' },
            { id: 'ivig', label: 'IVIG' },
            { id: 'cbt', label: 'CBT' },
            { id: 'ssri', label: 'SSRI' },
            { id: 'other_psychiatric', label: 'תרופות פסיכיאטריות אחרות' },
            { id: 'alternative', label: 'טיפולים אלטרנטיביים' },
            { id: 'supplements', label: 'תוספים' },
        ];

        return treatments.map(t => {
            const count = responses.filter(r => {
                const treatments = r.answers.treatments_used;
                return Array.isArray(treatments) && treatments.includes(t.id);
            }).length;

            return {
                name: t.label,
                value: responses.length > 0 ? Math.round((count / responses.length) * 100) : 0,
            };
        }).filter(t => t.value > 0).sort((a, b) => b.value - a.value);
    }, [responses]);

    const outlookData = useMemo(() => {
        const avg = calculateAverageScale(responses, 'outlook_rating');
        return [{ name: 'אופטימיות', value: avg * 20, fill: '#4CAF50' }];
    }, [responses]);

    // Comorbid conditions
    const comorbidData = useMemo(() => {
        const conditions = [
            { id: 'adhd', label: 'ADHD' },
            { id: 'autism', label: 'אוטיזם / ASD' },
            { id: 'learning_disability', label: 'לקות למידה' },
            { id: 'asthma', label: 'אסטמה' },
            { id: 'eczema', label: 'אקזמה' },
            { id: 'autoimmune', label: 'מחלה אוטואימונית' },
            { id: 'thyroid', label: 'בעיות בלוטת התריס' },
            { id: 'gi', label: 'בעיות עיכול' },
            { id: 'other', label: 'אחר' },
        ];

        return conditions.map(c => {
            const count = responses.filter(r => {
                const comorbid = r.answers.comorbid_conditions;
                return Array.isArray(comorbid) && comorbid.includes(c.id);
            }).length;

            return {
                name: c.label,
                value: responses.length > 0 ? Math.round((count / responses.length) * 100) : 0,
            };
        }).filter(c => c.value > 0)
            .sort((a, b) => b.value - a.value);
    }, [responses]);

    // Family autoimmune history
    const familyAutoimmueData = useMemo(() => {
        const conditions = [
            { id: 'pans', label: 'פאנס/פאנדס' },
            { id: 'thyroid', label: 'בלוטת התריס' },
            { id: 'rheumatoid', label: 'דלקת מפרקים' },
            { id: 'lupus', label: 'לופוס' },
            { id: 'celiac', label: 'צליאק' },
            { id: 'ms', label: 'טרשת נפוצה' },
            { id: 'psoriasis', label: 'פסוריאזיס' },
            { id: 'ibd', label: 'מחלת מעי דלקתית' },
            { id: 'diabetes_1', label: 'סוכרת סוג 1' },
            { id: 'other', label: 'אחר' },
        ];

        return conditions.map(c => {
            const count = responses.filter(r => {
                const family = r.answers.family_autoimmune_conditions;
                return Array.isArray(family) && family.includes(c.id);
            }).length;

            return {
                name: c.label,
                value: responses.length > 0 ? Math.round((count / responses.length) * 100) : 0,
            };
        }).filter(c => c.value > 0)
            .sort((a, b) => b.value - a.value);
    }, [responses]);

    // Family psychiatric history
    const familyPsychiatricData = useMemo(() => {
        const conditions = [
            { id: 'depression', label: 'דיכאון' },
            { id: 'bipolar', label: 'הפרעה דו-קוטבית' },
            { id: 'adhd', label: 'ADHD' },
            { id: 'autism', label: 'אוטיזם' },
            { id: 'tics', label: 'טיקים / טורט' },
            { id: 'eating', label: 'הפרעות אכילה' },
            { id: 'other', label: 'אחר' },
        ];

        return conditions.map(c => {
            const count = responses.filter(r => {
                const family = r.answers.family_psychiatric_history;
                return Array.isArray(family) && family.includes(c.id);
            }).length;

            return {
                name: c.label,
                value: responses.length > 0 ? Math.round((count / responses.length) * 100) : 0,
            };
        }).filter(c => c.value > 0)
            .sort((a, b) => b.value - a.value);
    }, [responses]);

    // Misdiagnoses
    const misdiagnosesData = useMemo(() => {
        const diagnoses = [
            { id: 'ocd', label: 'OCD' },
            { id: 'anxiety', label: 'הפרעת חרדה' },
            { id: 'adhd', label: 'ADHD' },
            { id: 'autism', label: 'אוטיזם / ASD' },
            { id: 'tourette', label: 'תסמונת טורט' },
            { id: 'bipolar', label: 'הפרעה דו-קוטבית' },
            { id: 'depression', label: 'דיכאון' },
            { id: 'behavioral', label: 'בעיות התנהגות' },
            { id: 'psychosis', label: 'פסיכוזה' },
            { id: 'other', label: 'אחר' },
        ];

        return diagnoses.map(d => {
            const count = responses.filter(r => {
                const misdiag = r.answers.misdiagnoses;
                return Array.isArray(misdiag) && misdiag.includes(d.id);
            }).length;

            return {
                name: d.label,
                value: responses.length > 0 ? Math.round((count / responses.length) * 100) : 0,
            };
        }).filter(d => d.value > 0)
            .sort((a, b) => b.value - a.value);
    }, [responses]);

    // --------------------------------------------------------------------------
    // Render
    // --------------------------------------------------------------------------

    if (loading) {
        return (
            <Box className="soc-results soc-results--loading" dir="rtl">
                <CircularProgress size={60} />
                <Typography>טוען תוצאות...</Typography>
            </Box>
        );
    }

    if (error) {
        return (
            <Box className="soc-results" dir="rtl">
                <Container maxWidth="lg">
                    <Alert severity="error">{error}</Alert>
                </Container>
            </Box>
        );
    }

    if (responses.length === 0) {
        return (
            <Box className="soc-results" dir="rtl">
                <Container maxWidth="lg">
                    <Box className="soc-results__empty">
                        <Typography variant="h4">עדיין אין תוצאות</Typography>
                        <Typography>
                            הסקר פתוח למילוי. התוצאות יוצגו כאן לאחר שיתקבלו תשובות.
                        </Typography>
                    </Box>
                </Container>
            </Box>
        );
    }

    return (
        <Box className="soc-results" dir="rtl">
            <Container maxWidth="lg">
                {/* Header */}
                <Box className="soc-results__header">
                    <Typography variant="h3" className="soc-results__title">
                        תוצאות סקר מצב ילדינו 2026
                    </Typography>
                    <Typography className="soc-results__subtitle">
                        סקירה סטטיסטית של התשובות שהתקבלו מהקהילה
                    </Typography>
                </Box>

                {/* Stats Cards */}
                <Grid container spacing={3} className="soc-results__stats">
                    {statsCards.map((card, index) => (
                        <Grid sx={{ xs: 12, md: 3 }} key={index}>
                            <Card className="soc-results__stat-card">
                                <CardContent>
                                    <Box
                                        className="soc-results__stat-icon"
                                        sx={{ backgroundColor: `${card.color}15`, color: card.color }}
                                    >
                                        {card.icon}
                                    </Box>
                                    <Typography className="soc-results__stat-value">
                                        {card.value}
                                    </Typography>
                                    <Typography className="soc-results__stat-label">
                                        {card.label}
                                    </Typography>
                                </CardContent>
                            </Card>
                        </Grid>
                    ))}
                </Grid>

                {/* Tabs */}
                <Box className="soc-results__tabs-container">
                    <Tabs
                        value={activeTab}
                        onChange={(_, newValue) => setActiveTab(newValue)}
                        className="soc-results__tabs"
                        centered
                    >
                        <Tab label="דמוגרפיה" />
                        <Tab label="תסמינים" />
                        <Tab label="אבחון וטיפול" />
                        <Tab label="משפחה ומצבים נלווים" />
                    </Tabs>
                </Box>

                {/* Tab Content */}
                <Box className="soc-results__content">
                    {/* Demographics Tab */}
                    {activeTab === 0 && (
                        <Grid container spacing={4}>
                            <Grid sx={{ xs: 12, md: 6 }}>
                                <Card className="soc-results__chart-card">
                                    <CardContent>
                                        <Typography className="soc-results__chart-title">
                                            התפלגות מגדר
                                        </Typography>
                                        <ResponsiveContainer width="100%" height={300}>
                                            <PieChart>
                                                <Pie
                                                    data={genderData}
                                                    cx="50%"
                                                    cy="50%"
                                                    innerRadius={60}
                                                    outerRadius={100}
                                                    paddingAngle={5}
                                                    dataKey="value"
                                                    label={({ name, percent }) =>
                                                        `${name} (${((percent ?? 0) * 100).toFixed(0)}%)`
                                                    }
                                                >
                                                    {genderData.map((entry, index) => (
                                                        <Cell key={index} fill={entry.color} />
                                                    ))}
                                                </Pie>
                                                <Tooltip />
                                            </PieChart>
                                        </ResponsiveContainer>
                                    </CardContent>
                                </Card>
                            </Grid>

                            <Grid sx={{ xs: 12, md: 6 }}>
                                <Card className="soc-results__chart-card">
                                    <CardContent>
                                        <Typography className="soc-results__chart-title">
                                            גורם מחולל (טריגר)
                                        </Typography>
                                        <ResponsiveContainer width="100%" height={300}>
                                            <PieChart>
                                                <Pie
                                                    data={triggerData}
                                                    cx="50%"
                                                    cy="50%"
                                                    innerRadius={60}
                                                    outerRadius={100}
                                                    paddingAngle={5}
                                                    dataKey="value"
                                                    label={({ name, percent }) =>
                                                        `${name} (${((percent ?? 0) * 100).toFixed(0)}%)`
                                                    }
                                                >
                                                    {triggerData.map((entry, index) => (
                                                        <Cell key={index} fill={entry.color} />
                                                    ))}
                                                </Pie>
                                                <Tooltip />
                                            </PieChart>
                                        </ResponsiveContainer>
                                    </CardContent>
                                </Card>
                            </Grid>
                        </Grid>
                    )}

                    {/* Symptoms Tab */}
                    {activeTab === 1 && (
                        <Grid container spacing={4}>
                            <Grid sx={{ xs: 12 }}>
                                <Card className="soc-results__chart-card">
                                    <CardContent>
                                        <Typography className="soc-results__chart-title">
                                            חומרת תסמינים ממוצעת (%)
                                        </Typography>
                                        <ResponsiveContainer width="100%" height={400}>
                                            <BarChart
                                                data={symptomData}
                                                layout="vertical"
                                                margin={{ top: 20, right: 30, left: 100, bottom: 5 }}
                                            >
                                                <CartesianGrid strokeDasharray="3 3" />
                                                <XAxis type="number" domain={[0, 100]} />
                                                <YAxis
                                                    dataKey="name"
                                                    type="category"
                                                    tick={{ fontFamily: 'Heebo' }}
                                                />
                                                <Tooltip
                                                    formatter={(value: number | undefined) => [`${value ?? 0}%`, 'שימוש']}
                                                />
                                                <Bar
                                                    dataKey="value"
                                                    fill="#023373"
                                                    radius={[0, 4, 4, 0]}
                                                />
                                            </BarChart>
                                        </ResponsiveContainer>
                                    </CardContent>
                                </Card>
                            </Grid>

                            <Grid sx={{ xs: 12, md: 6 }}>
                                <Card className="soc-results__chart-card soc-results__chart-card--gauge">
                                    <CardContent>
                                        <Typography className="soc-results__chart-title">
                                            רמת אופטימיות ממוצעת
                                        </Typography>
                                        <ResponsiveContainer width="100%" height={250}>
                                            <RadialBarChart
                                                cx="50%"
                                                cy="50%"
                                                innerRadius="60%"
                                                outerRadius="80%"
                                                barSize={20}
                                                data={outlookData}
                                                startAngle={180}
                                                endAngle={0}
                                            >
                                                <RadialBar
                                                    dataKey="value"
                                                    cornerRadius={10}
                                                    background
                                                />
                                            </RadialBarChart>
                                        </ResponsiveContainer>
                                        <Typography className="soc-results__gauge-value">
                                            {outlookData[0]?.value.toFixed(0)}%
                                        </Typography>
                                    </CardContent>
                                </Card>
                            </Grid>
                        </Grid>
                    )}

                    {/* Diagnosis & Treatment Tab */}
                    {activeTab === 2 && (
                        <Grid container spacing={4}>
                            <Grid sx={{ xs: 12, md: 6 }}>
                                <Card className="soc-results__chart-card">
                                    <CardContent>
                                        <Typography className="soc-results__chart-title">
                                            מי ביצע את האבחנה
                                        </Typography>
                                        <ResponsiveContainer width="100%" height={300}>
                                            <PieChart>
                                                <Pie
                                                    data={diagnosedByData}
                                                    cx="50%"
                                                    cy="50%"
                                                    innerRadius={60}
                                                    outerRadius={100}
                                                    paddingAngle={5}
                                                    dataKey="value"
                                                    label={({ name, percent }) =>
                                                        `${name} (${((percent ?? 0) * 100).toFixed(0)}%)`
                                                    }
                                                >
                                                    {diagnosedByData.map((entry, index) => (
                                                        <Cell key={index} fill={entry.color} />
                                                    ))}
                                                </Pie>
                                                <Tooltip />
                                            </PieChart>
                                        </ResponsiveContainer>
                                    </CardContent>
                                </Card>
                            </Grid>

                            <Grid sx={{ xs: 12, md: 6 }}>
                                <Card className="soc-results__chart-card">
                                    <CardContent>
                                        <Typography className="soc-results__chart-title">
                                            שיעור שימוש בטיפולים (%)
                                        </Typography>
                                        <ResponsiveContainer width="100%" height={300}>
                                            <BarChart data={treatmentData}>
                                                <CartesianGrid strokeDasharray="3 3" />
                                                <XAxis
                                                    dataKey="name"
                                                    tick={{ fontFamily: 'Heebo', fontSize: 12 }}
                                                />
                                                <YAxis domain={[0, 100]} />
                                                <Tooltip
                                                    formatter={(value: number | undefined) => [`${value ?? 0}%`, 'שימוש']}
                                                />
                                                <Bar
                                                    dataKey="value"
                                                    fill="#6CA6D9"
                                                    radius={[4, 4, 0, 0]}
                                                />
                                            </BarChart>
                                        </ResponsiveContainer>
                                    </CardContent>
                                </Card>
                            </Grid>
                        </Grid>
                    )}

                    {activeTab === 3 && (
                        <Grid container spacing={4}>
                            <Grid sx={{ xs: 12, md: 6 }}>
                                <Card className="soc-results__chart-card">
                                    <CardContent>
                                        <Typography className="soc-results__chart-title">
                                            מצבים נלווים בילד (%)
                                        </Typography>
                                        <ResponsiveContainer width="100%" height={300}>
                                            <BarChart data={comorbidData} layout="vertical">
                                                <CartesianGrid strokeDasharray="3 3" />
                                                <XAxis type="number" domain={[0, 100]} />
                                                <YAxis dataKey="name" type="category" width={120} tick={{ fontFamily: 'Heebo', fontSize: 12 }} />
                                                <Tooltip formatter={(value: number | undefined) => [`${value ?? 0}%`, 'שכיחות']} />
                                                <Bar dataKey="value" fill="#9C27B0" radius={[0, 4, 4, 0]} />
                                            </BarChart>
                                        </ResponsiveContainer>
                                    </CardContent>
                                </Card>
                            </Grid>

                            <Grid sx={{ xs: 12, md: 6 }}>
                                <Card className="soc-results__chart-card">
                                    <CardContent>
                                        <Typography className="soc-results__chart-title">
                                            אבחנות שגויות שהתקבלו (%)
                                        </Typography>
                                        <ResponsiveContainer width="100%" height={300}>
                                            <BarChart data={misdiagnosesData} layout="vertical">
                                                <CartesianGrid strokeDasharray="3 3" />
                                                <XAxis type="number" domain={[0, 100]} />
                                                <YAxis dataKey="name" type="category" width={120} tick={{ fontFamily: 'Heebo', fontSize: 12 }} />
                                                <Tooltip formatter={(value: number | undefined) => [`${value ?? 0}%`, 'שכיחות']} />
                                                <Bar dataKey="value" fill="#FF5722" radius={[0, 4, 4, 0]} />
                                            </BarChart>
                                        </ResponsiveContainer>
                                    </CardContent>
                                </Card>
                            </Grid>

                            <Grid sx={{ xs: 12, md: 6 }}>
                                <Card className="soc-results__chart-card">
                                    <CardContent>
                                        <Typography className="soc-results__chart-title">
                                            מחלות אוטואימוניות במשפחה (%)
                                        </Typography>
                                        <ResponsiveContainer width="100%" height={300}>
                                            <BarChart data={familyAutoimmueData} layout="vertical">
                                                <CartesianGrid strokeDasharray="3 3" />
                                                <XAxis type="number" domain={[0, 100]} />
                                                <YAxis dataKey="name" type="category" width={120} tick={{ fontFamily: 'Heebo', fontSize: 12 }} />
                                                <Tooltip formatter={(value: number | undefined) => [`${value ?? 0}%`, 'שכיחות']} />
                                                <Bar dataKey="value" fill="#00BCD4" radius={[0, 4, 4, 0]} />
                                            </BarChart>
                                        </ResponsiveContainer>
                                    </CardContent>
                                </Card>
                            </Grid>

                            <Grid sx={{ xs: 12, md: 6 }}>
                                <Card className="soc-results__chart-card">
                                    <CardContent>
                                        <Typography className="soc-results__chart-title">
                                            מצבים נפשיים במשפחה (%)
                                        </Typography>
                                        <ResponsiveContainer width="100%" height={300}>
                                            <BarChart data={familyPsychiatricData} layout="vertical">
                                                <CartesianGrid strokeDasharray="3 3" />
                                                <XAxis type="number" domain={[0, 100]} />
                                                <YAxis dataKey="name" type="category" width={120} tick={{ fontFamily: 'Heebo', fontSize: 12 }} />
                                                <Tooltip formatter={(value: number | undefined) => [`${value ?? 0}%`, 'שכיחות']} />
                                                <Bar dataKey="value" fill="#E67E22" radius={[0, 4, 4, 0]} />
                                            </BarChart>
                                        </ResponsiveContainer>
                                    </CardContent>
                                </Card>
                            </Grid>
                        </Grid>
                    )}
                </Box>

                {/* Disclaimer */}
                <Box className="soc-results__disclaimer">
                    <Typography>
                        * הנתונים מבוססים על {totalCount} תשובות מ-{familyCount} משפחות.
                        המידע מוצג למטרות מודעות ומחקר בלבד ואינו מהווה ייעוץ רפואי.
                    </Typography>
                </Box>
            </Container>
        </Box>
    );
};

export default SOCResultsPage;
