import React, { useState, useEffect } from 'react';
import { Box, Typography, Paper, CircularProgress, Alert, Grid } from '@mui/material';
import {
    BarChart,
    Bar,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    Legend,
    ResponsiveContainer,
    PieChart,
    Pie,
    Cell,
} from 'recharts';
import {
    subscribeToKovacevicResults,
    aggregateKovacevicResults,
    type KovacevicAggregatedData,
    type KovacevicResultDocument,
} from '@/services/kovacevicService';
import './KovacevicResultsChart.scss';

// Colors for charts
const FORMULA_COLORS = {
    formula1: '#4CAF50',
    formula2: '#2196F3',
    partial: '#FF9800',
    not_met: '#9E9E9E',
};

const CRITERIA_COLORS = {
    mandatory: '#6C5CE7',
    core: '#00CEC9',
    secondaryGroup1: '#FDCB6E',
    secondaryGroup2: '#E17055',
};

const KovacevicResultsChart: React.FC = () => {
    const [aggregated, setAggregated] = useState<KovacevicAggregatedData | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const unsubscribe = subscribeToKovacevicResults(
            (results: KovacevicResultDocument[]) => {
                try {
                    const agg = aggregateKovacevicResults(results);
                    setAggregated(agg);
                    setError(null);
                } catch (err) {
                    console.error('Error aggregating Kovacevic results:', err);
                    setError('שגיאה בעיבוד הנתונים');
                } finally {
                    setLoading(false);
                }
            },
            100
        );

        return () => unsubscribe();
    }, []);

    if (loading) {
        return (
            <Paper elevation={3} sx={{ p: 4, textAlign: 'center' }}>
                <CircularProgress />
                <Typography variant="body2" color="text.secondary" sx={{ mt: 2 }}>
                    טוען נתונים סטטיסטיים...
                </Typography>
            </Paper>
        );
    }

    if (error) {
        return (
            <Alert severity="error" sx={{ mb: 2 }}>
                {error}
            </Alert>
        );
    }

    if (!aggregated || aggregated.count === 0) {
        return (
            <Alert severity="info" sx={{ mb: 2 }}>
                אין עדיין נתונים להצגה. התוצאות יופיעו כאן לאחר שמשתמשים ימלאו את השאלון.
            </Alert>
        );
    }

    // Prepare data for diagnosis distribution pie chart
    const diagnosisData = [
        { name: 'נוסחה 1', value: aggregated.formulaCounts.formula1, color: FORMULA_COLORS.formula1 },
        { name: 'נוסחה 2', value: aggregated.formulaCounts.formula2, color: FORMULA_COLORS.formula2 },
        { name: 'חלקי', value: aggregated.formulaCounts.partial, color: FORMULA_COLORS.partial },
        { name: 'לא עומד', value: aggregated.formulaCounts.not_met, color: FORMULA_COLORS.not_met },
    ].filter((d) => d.value > 0);

    // Prepare data for criteria average bar chart
    const criteriaData = [
        {
            name: 'חובה',
            average: aggregated.averageCriteriaMet.mandatory,
            max: 3,
            color: CRITERIA_COLORS.mandatory,
        },
        {
            name: 'מרכזיים',
            average: aggregated.averageCriteriaMet.core,
            max: 4,
            color: CRITERIA_COLORS.core,
        },
        {
            name: 'משניים 1',
            average: aggregated.averageCriteriaMet.secondaryGroup1,
            max: 5,
            color: CRITERIA_COLORS.secondaryGroup1,
        },
        {
            name: 'משניים 2',
            average: aggregated.averageCriteriaMet.secondaryGroup2,
            max: 13,
            color: CRITERIA_COLORS.secondaryGroup2,
        },
    ];

    // Treatment response data
    const treatmentData = [
        { name: 'אנטיביוטיקה', percentage: aggregated.treatmentResponseRates.antibiotics },
        { name: 'סטרואידים', percentage: aggregated.treatmentResponseRates.steroids },
    ];

    // Custom tooltip
    const CustomTooltip = ({ active, payload, label }: any) => {
        if (active && payload && payload.length) {
            return (
                <Paper elevation={3} sx={{ p: 1.5, direction: 'rtl' }}>
                    <Typography variant="body2" fontWeight="bold">
                        {label}
                    </Typography>
                    {payload.map((entry: any, index: number) => (
                        <Typography key={index} variant="body2" sx={{ color: entry.fill || entry.color }}>
                            {entry.name}: {entry.value}
                            {entry.dataKey === 'percentage' && '%'}
                        </Typography>
                    ))}
                </Paper>
            );
        }
        return null;
    };

    return (
        <Paper elevation={3} className="kovacevic-results-chart">
            <Box sx={{ px: 3, pt: 3, pb: 2 }}>
                <Typography variant="h5" gutterBottom sx={{ textAlign: 'center', fontWeight: 'bold' }}>
                    סטטיסטיקות קהילתיות - שאלון קובאצ'ביץ'
                </Typography>
                <Typography variant="body2" color="text.secondary" sx={{ textAlign: 'center', mb: 3 }}>
                    מבוסס על {aggregated.count} שאלונים שהושלמו
                </Typography>
            </Box>

            <Grid container spacing={3} sx={{ px: 3, pb: 3 }}>
                {/* Diagnosis Distribution Pie Chart */}
                <Grid sx={{ xs:12, sm:6 }}>
                    <Paper elevation={1} sx={{ p: 2, height: '100%' }}>
                        <Typography variant="h6" gutterBottom align="center">
                            התפלגות אבחונים
                        </Typography>
                        <ResponsiveContainer width="100%" height={250}>
                            <PieChart>
                                <Pie
                                    data={diagnosisData}
                                    cx="50%"
                                    cy="50%"
                                    innerRadius={50}
                                    outerRadius={80}
                                    paddingAngle={5}
                                    dataKey="value"
                                    label={({ name, percent }) => `${name} (${((percent ?? 0) * 100).toFixed(0)}%)`}
                                    labelLine={false}
                                >
                                    {diagnosisData.map((entry, index) => (
                                        <Cell key={`cell-${index}`} fill={entry.color} />
                                    ))}
                                </Pie>
                                <Tooltip content={<CustomTooltip />} />
                            </PieChart>
                        </ResponsiveContainer>
                    </Paper>
                </Grid>

                {/* Criteria Average Bar Chart */}
                <Grid sx={{ xs:12, sm:6 }}>
                    <Paper elevation={1} sx={{ p: 2, height: '100%' }}>
                        <Typography variant="h6" gutterBottom align="center">
                            ממוצע קריטריונים שהתקיימו
                        </Typography>
                        <ResponsiveContainer width="100%" height={250}>
                            <BarChart data={criteriaData} layout="vertical">
                                <CartesianGrid strokeDasharray="3 3" />
                                <XAxis type="number" domain={[0, 'dataMax']} />
                                <YAxis type="category" dataKey="name" width={80} />
                                <Tooltip content={<CustomTooltip />} />
                                <Bar dataKey="average" name="ממוצע" radius={[0, 4, 4, 0]}>
                                    {criteriaData.map((entry, index) => (
                                        <Cell key={`cell-${index}`} fill={entry.color} />
                                    ))}
                                </Bar>
                            </BarChart>
                        </ResponsiveContainer>
                    </Paper>
                </Grid>

                {/* Treatment Response */}
                <Grid sx={{ xs:12 }}>
                    <Paper elevation={1} sx={{ p: 2 }}>
                        <Typography variant="h6" gutterBottom align="center">
                            אחוז תגובה חיובית לטיפול
                        </Typography>
                        <ResponsiveContainer width="100%" height={150}>
                            <BarChart data={treatmentData}>
                                <CartesianGrid strokeDasharray="3 3" />
                                <XAxis dataKey="name" />
                                <YAxis domain={[0, 100]} tickFormatter={(value) => `${value}%`} />
                                <Tooltip content={<CustomTooltip />} />
                                <Bar dataKey="percentage" name="אחוז תגובה" fill="#00CEC9" radius={[4, 4, 0, 0]} />
                            </BarChart>
                        </ResponsiveContainer>
                    </Paper>
                </Grid>

                {/* Summary Stats */}
                <Grid sx={{ xs:12 }}>
                    <Box
                        sx={{
                            display: 'grid',
                            gridTemplateColumns: { xs: 'repeat(2, 1fr)', sm: 'repeat(4, 1fr)' },
                            gap: 2,
                        }}
                    >
                        <Box className="stat-card" sx={{ bgcolor: 'rgba(76, 175, 80, 0.1)' }}>
                            <Typography variant="h4" color="success.main">
                                {aggregated.formulaCounts.formula1}
                            </Typography>
                            <Typography variant="body2">נוסחה 1</Typography>
                        </Box>
                        <Box className="stat-card" sx={{ bgcolor: 'rgba(33, 150, 243, 0.1)' }}>
                            <Typography variant="h4" color="info.main">
                                {aggregated.formulaCounts.formula2}
                            </Typography>
                            <Typography variant="body2">נוסחה 2</Typography>
                        </Box>
                        <Box className="stat-card" sx={{ bgcolor: 'rgba(255, 152, 0, 0.1)' }}>
                            <Typography variant="h4" color="warning.main">
                                {aggregated.formulaCounts.partial}
                            </Typography>
                            <Typography variant="body2">חלקי</Typography>
                        </Box>
                        <Box className="stat-card" sx={{ bgcolor: 'rgba(158, 158, 158, 0.1)' }}>
                            <Typography variant="h4" color="text.secondary">
                                {aggregated.formulaCounts.not_met}
                            </Typography>
                            <Typography variant="body2">לא עומד</Typography>
                        </Box>
                    </Box>
                </Grid>
            </Grid>

            <Box sx={{ px: 3, pb: 3 }}>
                <Typography variant="caption" color="text.secondary" sx={{ textAlign: 'center', display: 'block' }}>
                    הנתונים מתעדכנים אוטומטית כאשר משתמשים חדשים ממלאים את השאלון.
                </Typography>
            </Box>
        </Paper>
    );
};

export default KovacevicResultsChart;
