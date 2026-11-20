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
import { getPublishedSurveyStats } from '../../../shared/services/surveyService';
import { SOC_SURVEY_ID } from '../../types/socTypes';
import type { SOCPublicStats } from '../../utils/socStats';
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

// The numbers shown here are calculated on the admin page and published as one document
// (see utils/socStats.ts). This page never reads individual survey responses.

// --------------------------------------------------------------------------
// Component
// --------------------------------------------------------------------------

const SOCResultsPage: React.FC = () => {
    const [stats, setStats] = useState<SOCPublicStats | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [activeTab, setActiveTab] = useState(0);

    // --------------------------------------------------------------------------
    // Fetch the published statistics (one document)
    // --------------------------------------------------------------------------

    useEffect(() => {
        let cancelled = false;
        getPublishedSurveyStats<SOCPublicStats>(SOC_SURVEY_ID)
            .then((data) => { if (!cancelled) setStats(data); })
            .catch((err) => {
                console.error(err);
                if (!cancelled) setError('שגיאה בטעינת הנתונים');
            })
            .finally(() => { if (!cancelled) setLoading(false); });
        return () => { cancelled = true; };
    }, []);

    const statsCards: StatsCardData[] = useMemo(() => [
        {
            icon: <FiUsers />,
            label: 'סה"כ תשובות',
            value: stats?.totalCount ?? 0,
            color: '#023373',
        },
        {
            icon: <FiHeart />,
            label: 'משפחות משתתפות',
            value: stats?.familyCount ?? 0,
            color: '#E67E22',
        },
        {
            icon: <FiActivity />,
            label: 'שיעור הפוגה',
            value: stats?.remissionRate ?? '0%',
            color: '#4CAF50',
        },
        {
            icon: <FiTrendingUp />,
            label: 'גיל ממוצע בהתפרצות',
            value: stats?.avgOnsetAge ?? '0',
            color: '#6CA6D9',
        },
    ], [stats]);

    const publishedDate = stats?.publishedAt
        ? stats.publishedAt.toDate().toLocaleDateString('he-IL', { day: 'numeric', month: 'long', year: 'numeric' })
        : null;

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

    if (!stats || stats.totalCount === 0) {
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

    const {
        totalCount, familyCount,
        genderData, triggerData, symptomData, diagnosedByData, treatmentData,
        outlookData, difficultyData, comorbidData, misdiagnosesData,
        familyAutoimmuneData, familyPsychiatricData,
    } = stats;

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
                        <Box sx={{ xs: 12, md: 3 }} key={index}>
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
                        </Box>
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
                        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 4 }}>

                            {/* Bar chart - full width */}
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
                                            <YAxis dataKey="name" type="category" tick={{ fontFamily: 'Heebo' }} />
                                            <Tooltip formatter={(value: number | undefined) => [`${value ?? 0}%`, 'שימוש']} />
                                            <Bar dataKey="value" fill="#023373" radius={[0, 4, 4, 0]} />
                                        </BarChart>
                                    </ResponsiveContainer>
                                </CardContent>
                            </Card>

                            {/* Two gauge cards - side by side */}
                            <Box sx={{ display: 'flex', gap: 3, flexDirection: { xs: 'column', md: 'row' } }}>
                                <Card className="soc-results__chart-card soc-results__chart-card--gauge" sx={{ flex: 1 }}>
                                    <CardContent sx={{ textAlign: 'center' }}>
                                        <Typography className="soc-results__chart-title">רמת אופטימיות ממוצעת</Typography>
                                        <ResponsiveContainer width="100%" height={200}>
                                            <RadialBarChart cx="50%" cy="80%" innerRadius="60%" outerRadius="80%"
                                                barSize={20} data={outlookData} startAngle={180} endAngle={0}>
                                                <RadialBar dataKey="value" cornerRadius={10} background />
                                            </RadialBarChart>
                                        </ResponsiveContainer>
                                        <Typography className="soc-results__gauge-value" sx={{ color: '#4CAF50' }}>
                                            {outlookData[0]?.value.toFixed(0)}%
                                        </Typography>
                                    </CardContent>
                                </Card>

                                <Card className="soc-results__chart-card soc-results__chart-card--gauge" sx={{ flex: 1 }}>
                                    <CardContent sx={{ textAlign: 'center' }}>
                                        <Typography className="soc-results__chart-title">רמת הקושי היומיומי הממוצעת</Typography>
                                        <ResponsiveContainer width="100%" height={200}>
                                            <RadialBarChart cx="50%" cy="80%" innerRadius="60%" outerRadius="80%"
                                                barSize={20} data={difficultyData} startAngle={180} endAngle={0}>
                                                <RadialBar dataKey="value" cornerRadius={10} background />
                                            </RadialBarChart>
                                        </ResponsiveContainer>
                                        <Typography className="soc-results__gauge-value" sx={{ color: '#E67E22' }}>
                                            {difficultyData[0]?.value.toFixed(0)}%
                                        </Typography>
                                    </CardContent>
                                </Card>
                            </Box>

                        </Box>
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
                                            <BarChart data={familyAutoimmuneData} layout="vertical">
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
                        * הנתונים מבוססים על {totalCount} תשובות מ-{familyCount} משפחות
                        {publishedDate ? ` (עודכנו ב־${publishedDate})` : ''}.
                        המידע מוצג למטרות מודעות ומחקר בלבד ואינו מהווה ייעוץ רפואי.
                    </Typography>
                </Box>
            </Container >
        </Box >
    );
};

export default SOCResultsPage;