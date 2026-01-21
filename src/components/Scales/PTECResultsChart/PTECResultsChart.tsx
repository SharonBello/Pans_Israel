import React, { useState, useEffect } from 'react';
import { Box, Typography, Paper, CircularProgress, Alert, Grid } from '@mui/material';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  Radar,
} from 'recharts';
import {
  subscribeToPTECResults,
  aggregatePTECResults,
  type PTECAggregatedData,
  type PTECResultDocument,
} from '@/services/ptecService';
import { CATEGORY_LABELS, MAX_SCORES } from '@/types/ptecScale';
import './PTECResultsChart.scss';

// Colors
const SEVERITY_COLORS = {
  minimal: '#4CAF50',
  mild: '#8BC34A',
  moderate: '#FFC107',
  severe: '#FF9800',
  extreme: '#F44336',
};

const CATEGORY_COLORS = [
  '#00CEC9',
  '#6C5CE7',
  '#FDCB6E',
  '#E17055',
  '#74B9FF',
  '#A29BFE',
  '#55EFC4',
  '#FAB1A0',
  '#81ECEC',
  '#DFE6E9',
];

const PTECResultsChart: React.FC = () => {
  const [aggregated, setAggregated] = useState<PTECAggregatedData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const unsubscribe = subscribeToPTECResults(
      (results: PTECResultDocument[]) => {
        try {
          const agg = aggregatePTECResults(results);
          setAggregated(agg);
          setError(null);
        } catch (err) {
          console.error('Error aggregating PTEC results:', err);
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
        <CircularProgress sx={{ color: '#00CEC9' }} />
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

  // Prepare severity distribution data
  const severityData = [
    { name: 'מינימלי', value: aggregated.scoreDistribution.minimal, color: SEVERITY_COLORS.minimal },
    { name: 'קל', value: aggregated.scoreDistribution.mild, color: SEVERITY_COLORS.mild },
    { name: 'בינוני', value: aggregated.scoreDistribution.moderate, color: SEVERITY_COLORS.moderate },
    { name: 'חמור', value: aggregated.scoreDistribution.severe, color: SEVERITY_COLORS.severe },
    { name: 'קיצוני', value: aggregated.scoreDistribution.extreme, color: SEVERITY_COLORS.extreme },
  ].filter((d) => d.value > 0);

  // Prepare category average data
  const categoryData = Object.entries(CATEGORY_LABELS).map(([key, label], index) => ({
    category: label,
    score: aggregated.averageScores[key as keyof typeof aggregated.averageScores],
    maxScore: MAX_SCORES[key as keyof typeof MAX_SCORES],
    percent: Math.round(
      (aggregated.averageScores[key as keyof typeof aggregated.averageScores] /
        MAX_SCORES[key as keyof typeof MAX_SCORES]) *
      100
    ),
    fill: CATEGORY_COLORS[index % CATEGORY_COLORS.length],
  }));

  // Prepare radar chart data
  const radarData = categoryData.map((d) => ({
    category: d.category,
    value: d.percent,
    fullMark: 100,
  }));

  // Custom tooltip
  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <Paper elevation={3} sx={{ p: 1.5, direction: 'rtl' }}>
          <Typography variant="body2" fontWeight="bold">
            {label || payload[0]?.name}
          </Typography>
          {payload.map((entry: any, index: number) => (
            <Typography key={index} variant="body2" sx={{ color: entry.fill || entry.color }}>
              {entry.name === 'value' ? 'כמות' : entry.name}: {entry.value}
              {entry.dataKey === 'percent' && '%'}
            </Typography>
          ))}
        </Paper>
      );
    }
    return null;
  };

  return (
    <Paper elevation={3} className="ptec-results-chart">
      <Box sx={{ px: 3, pt: 3, pb: 2 }}>
        <Typography variant="h5" gutterBottom sx={{ textAlign: 'center', fontWeight: 'bold' }}>
          סטטיסטיקות קהילתיות - שאלון PTEC
        </Typography>
        <Typography variant="body2" color="text.secondary" sx={{ textAlign: 'center', mb: 3 }}>
          מבוסס על {aggregated.count} שאלונים שהושלמו
        </Typography>
      </Box>

      <Grid container spacing={3} sx={{ px: 3, pb: 3 }}>
        {/* Severity Distribution */}
        <Grid sx={{ xs: 12, md: 6 }}>
          <Paper elevation={1} sx={{ p: 2, height: '100%' }}>
            <Typography variant="h6" gutterBottom align="center">
              התפלגות חומרה
            </Typography>
            <ResponsiveContainer width="100%" height={250}>
              <PieChart>
                <Pie
                  data={severityData}
                  cx="50%"
                  cy="50%"
                  innerRadius={50}
                  outerRadius={80}
                  paddingAngle={5}
                  dataKey="value"
                  label={({ name, percent }) => `${name} (${(percent * 100).toFixed(0)}%)`}
                  labelLine={false}
                >
                  {severityData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip content={<CustomTooltip />} />
              </PieChart>
            </ResponsiveContainer>
          </Paper>
        </Grid>

        {/* Average Score */}
        <Grid sx={{ xs: 12, md: 6 }}>
          <Paper elevation={1} sx={{ p: 2, height: '100%' }}>
            <Typography variant="h6" gutterBottom align="center">
              ציון ממוצע
            </Typography>
            <Box
              sx={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                height: 200,
              }}
            >
              <Typography variant="h1" sx={{ color: '#00CEC9', fontWeight: 700 }}>
                {aggregated.averageScores.total}
              </Typography>
              <Typography variant="h6" color="text.secondary">
                מתוך 306
              </Typography>
            </Box>
          </Paper>
        </Grid>

        {/* Category Breakdown Radar */}
        <Grid sx={{ xs: 12 }}>
          <Paper elevation={1} sx={{ p: 2 }}>
            <Typography variant="h6" gutterBottom align="center">
              ממוצע לפי קטגוריה (%)
            </Typography>
            <ResponsiveContainer width="100%" height={350}>
              <RadarChart data={radarData}>
                <PolarGrid />
                <PolarAngleAxis dataKey="category" tick={{ fontSize: 11 }} />
                <PolarRadiusAxis angle={90} domain={[0, 100]} tick={{ fontSize: 10 }} />
                <Radar
                  name="אחוז מהמקסימום"
                  dataKey="value"
                  stroke="#00CEC9"
                  fill="#00CEC9"
                  fillOpacity={0.5}
                />
                <Tooltip content={<CustomTooltip />} />
              </RadarChart>
            </ResponsiveContainer>
          </Paper>
        </Grid>

        {/* Category Bar Chart */}
        <Grid sx={{ xs: 12 }}>
          <Paper elevation={1} sx={{ p: 2 }}>
            <Typography variant="h6" gutterBottom align="center">
              ציון ממוצע לפי קטגוריה
            </Typography>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={categoryData} layout="vertical">
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis type="number" domain={[0, 100]} tickFormatter={(v) => `${v}%`} />
                <YAxis type="category" dataKey="category" width={100} tick={{ fontSize: 11 }} />
                <Tooltip content={<CustomTooltip />} />
                <Bar dataKey="percent" name="אחוז" radius={[0, 4, 4, 0]}>
                  {categoryData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.fill} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </Paper>
        </Grid>

        {/* Summary Stats */}
        <Grid sx={{ xs: 12 }}>
          <Box
            sx={{
              display: 'grid',
              gridTemplateColumns: { xs: 'repeat(2, 1fr)', sm: 'repeat(5, 1fr)' },
              gap: 2,
            }}
          >
            {[
              { label: 'מינימלי', value: aggregated.scoreDistribution.minimal, color: SEVERITY_COLORS.minimal },
              { label: 'קל', value: aggregated.scoreDistribution.mild, color: SEVERITY_COLORS.mild },
              { label: 'בינוני', value: aggregated.scoreDistribution.moderate, color: SEVERITY_COLORS.moderate },
              { label: 'חמור', value: aggregated.scoreDistribution.severe, color: SEVERITY_COLORS.severe },
              { label: 'קיצוני', value: aggregated.scoreDistribution.extreme, color: SEVERITY_COLORS.extreme },
            ].map((item) => (
              <Box
                key={item.label}
                className="stat-card"
                sx={{ bgcolor: item.color + '20', borderColor: item.color }}
              >
                <Typography variant="h4" sx={{ color: item.color }}>
                  {item.value}
                </Typography>
                <Typography variant="body2">{item.label}</Typography>
              </Box>
            ))}
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

export default PTECResultsChart;
