import React, { useState, useEffect } from 'react';
import { Box, Typography, Paper, CircularProgress, Alert } from '@mui/material';
import {
    BarChart,
    Bar,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    Legend,
    ResponsiveContainer,
} from 'recharts';
import './ScaleResultsChart.scss';
import {
    aggregateResults,
    subscribeToResults,
    type AggregatedScores,
    type ScaleResultDocument,
} from '@/services/scalesService';

// Color palette for the 3 timeframes
const COLORS = {
    before: '#6C5CE7', // Purple - "שבוע לפני"
    after: '#00CEC9', // Teal - "שבוע אחרי"
    current: '#FF6B6B', // Coral - "7 ימים אחרונים"
};

// Hebrew labels
const LABELS = {
    before: 'שבוע לפני',
    after: 'שבוע אחרי',
    current: '7 ימים אחרונים',
};

interface ChartDataItem {
    name: string;
    nameEn: string;
    before: number;
    after: number;
    current: number;
    max: number;
}

const ScaleResultsChart: React.FC = () => {
    const [aggregated, setAggregated] = useState<AggregatedScores | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        // Subscribe to real-time updates
        const unsubscribe = subscribeToResults(
            (results: ScaleResultDocument[]) => {
                try {
                    const agg = aggregateResults(results);
                    setAggregated(agg);
                    setError(null);
                } catch (err) {
                    console.error('Error aggregating results:', err);
                    setError('שגיאה בעיבוד הנתונים');
                } finally {
                    setLoading(false);
                }
            },
            100 // Last 100 results
        );

        // Cleanup subscription
        return () => {
            unsubscribe();
        };
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

    // Prepare data for grouped bar chart
    // Each category has 3 bars: before, after, current
    const chartData: ChartDataItem[] = [
        {
            name: 'OCD',
            nameEn: 'OCD',
            before: aggregated.averages.before.ocd,
            after: aggregated.averages.after.ocd,
            current: aggregated.averages.current.ocd,
            max: 25,
        },
        {
            name: 'NP נלווים',
            nameEn: 'NP',
            before: aggregated.averages.before.np,
            after: aggregated.averages.after.np,
            current: aggregated.averages.current.np,
            max: 25,
        },
        {
            name: 'פגיעה תפקודית',
            nameEn: 'Functional',
            before: aggregated.averages.before.functional,
            after: aggregated.averages.after.functional,
            current: aggregated.averages.current.functional,
            max: 50,
        },
        {
            name: 'סה"כ',
            nameEn: 'Total',
            before: aggregated.averages.before.total,
            after: aggregated.averages.after.total,
            current: aggregated.averages.current.total,
            max: 100,
        },
    ];

    // Custom tooltip component
    const CustomTooltip = ({ active, payload, label }: any) => {
        if (active && payload && payload.length) {
            const item = chartData.find((d) => d.name === label);
            return (
                <Paper
                    elevation={3}
                    sx={{
                        p: 2,
                        backgroundColor: 'rgba(255, 255, 255, 0.98)',
                        border: '1px solid #e0e0e0',
                        direction: 'rtl',
                    }}
                >
                    <Typography variant="subtitle2" sx={{ fontWeight: 'bold', mb: 1 }}>
                        {label}
                    </Typography>
                    {payload.map((entry: any, index: number) => (
                        <Box
                            key={index}
                            sx={{
                                display: 'flex',
                                alignItems: 'center',
                                gap: 1,
                                mb: 0.5,
                            }}
                        >
                            <Box
                                sx={{
                                    width: 12,
                                    height: 12,
                                    borderRadius: '2px',
                                    backgroundColor: entry.fill,
                                }}
                            />
                            <Typography variant="body2">
                                {entry.name}: <strong>{entry.value}</strong>
                            </Typography>
                        </Box>
                    ))}
                    {item && (
                        <Typography variant="caption" color="text.secondary" sx={{ mt: 1, display: 'block' }}>
                            מקסימום: {item.max}
                        </Typography>
                    )}
                </Paper>
            );
        }
        return null;
    };

    return (
        <Paper elevation={3} className="scale-results-chart">
            {/* Header */}
            <Box sx={{ px: 3, pt: 3, pb: 2 }}>
                <Typography
                    variant="h5"
                    gutterBottom
                    sx={{ textAlign: 'center', fontWeight: 'bold', color: '#2d3436' }}
                >
                    סטטיסטיקות קהילתיות
                </Typography>
                <Typography
                    variant="body2"
                    color="text.secondary"
                    sx={{ textAlign: 'center', mb: 2 }}
                >
                    ממוצע ציונים מבוסס על {aggregated.count} שאלונים שהושלמו
                </Typography>
            </Box>

            {/* Chart */}
            <Box sx={{ px: 2, pb: 2 }}>
                <ResponsiveContainer width="100%" height={400}>
                    <BarChart
                        data={chartData}
                        margin={{ top: 20, right: 30, left: 20, bottom: 20 }}
                        barCategoryGap="20%"
                        barGap={4}
                    >
                        <CartesianGrid strokeDasharray="3 3" stroke="#e0e0e0" />
                        <XAxis
                            dataKey="name"
                            tick={{ fontSize: 14, fill: '#2d3436' }}
                            tickLine={{ stroke: '#e0e0e0' }}
                            axisLine={{ stroke: '#e0e0e0' }}
                        />
                        <YAxis
                            domain={[0, 100]}
                            tick={{ fontSize: 12, fill: '#636e72' }}
                            tickLine={{ stroke: '#e0e0e0' }}
                            axisLine={{ stroke: '#e0e0e0' }}
                            label={{
                                value: 'ציון ממוצע',
                                angle: -90,
                                position: 'insideLeft',
                                style: { textAnchor: 'middle', fill: '#636e72', fontSize: 14 },
                            }}
                        />
                        <Tooltip content={<CustomTooltip />} />
                        <Legend
                            wrapperStyle={{
                                paddingTop: '20px',
                                direction: 'rtl',
                            }}
                            formatter={(value: string) => (
                                <span style={{ color: '#2d3436', marginRight: '8px' }}>{value}</span>
                            )}
                        />
                        {/* Three bars per category */}
                        <Bar
                            dataKey="before"
                            name={LABELS.before}
                            fill={COLORS.before}
                            radius={[4, 4, 0, 0]}
                            maxBarSize={50}
                        />
                        <Bar
                            dataKey="after"
                            name={LABELS.after}
                            fill={COLORS.after}
                            radius={[4, 4, 0, 0]}
                            maxBarSize={50}
                        />
                        <Bar
                            dataKey="current"
                            name={LABELS.current}
                            fill={COLORS.current}
                            radius={[4, 4, 0, 0]}
                            maxBarSize={50}
                        />
                    </BarChart>
                </ResponsiveContainer>
            </Box>

            {/* Summary Stats */}
            <Box
                sx={{
                    px: 3,
                    pb: 3,
                    pt: 2,
                    backgroundColor: 'rgba(108, 92, 231, 0.05)',
                    borderTop: '1px solid rgba(108, 92, 231, 0.1)',
                }}
            >
                {/* Score summary cards */}
                <Box
                    sx={{
                        display: 'grid',
                        gridTemplateColumns: { xs: '1fr', sm: 'repeat(3, 1fr)' },
                        gap: 2,
                        mb: 2,
                    }}
                >
                    <Box
                        sx={{
                            textAlign: 'center',
                            p: 2,
                            borderRadius: 2,
                            backgroundColor: 'rgba(108, 92, 231, 0.1)',
                        }}
                    >
                        <Typography variant="h4" sx={{ color: COLORS.before, fontWeight: 'bold' }}>
                            {aggregated.averages.before.total}
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                            {LABELS.before}
                        </Typography>
                    </Box>
                    <Box
                        sx={{
                            textAlign: 'center',
                            p: 2,
                            borderRadius: 2,
                            backgroundColor: 'rgba(0, 206, 201, 0.1)',
                        }}
                    >
                        <Typography variant="h4" sx={{ color: COLORS.after, fontWeight: 'bold' }}>
                            {aggregated.averages.after.total}
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                            {LABELS.after}
                        </Typography>
                    </Box>
                    <Box
                        sx={{
                            textAlign: 'center',
                            p: 2,
                            borderRadius: 2,
                            backgroundColor: 'rgba(255, 107, 107, 0.1)',
                        }}
                    >
                        <Typography variant="h4" sx={{ color: COLORS.current, fontWeight: 'bold' }}>
                            {aggregated.averages.current.total}
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                            {LABELS.current}
                        </Typography>
                    </Box>
                </Box>

                <Typography
                    variant="caption"
                    color="text.secondary"
                    sx={{ textAlign: 'center', display: 'block' }}
                >
                    הגרף מציג ממוצעים מ-{aggregated.count} שאלונים שהושלמו. הנתונים מתעדכנים
                    אוטומטית כאשר משתמשים חדשים ממלאים את השאלון.
                </Typography>
            </Box>
        </Paper>
    );
};

export default ScaleResultsChart;
