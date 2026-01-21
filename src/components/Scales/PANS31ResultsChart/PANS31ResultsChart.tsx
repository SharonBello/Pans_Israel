import React, { useState, useEffect } from 'react';
import { Box, Typography, Paper, CircularProgress, Alert, Grid, Chip } from '@mui/material';
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
  subscribeToPANS31Results,
  aggregatePANS31Results,
  type PANS31AggregatedData,
  type PANS31ResultDocument,
} from '@/services/pans31Service';
import { PANS31_LABELS, MAX_SCORES } from '@/types/pans31Scale';
import './PANS31ResultsChart.scss';

// Colors
const SEVERITY_COLORS = {
  minimal: '#4CAF50',
  mild: '#8BC34A',
  moderate: '#FFC107',
  severe: '#FF9800',
  extreme: '#F44336',
};

const CATEGORY_COLORS = [
  '#717DBC',
  '#6C5CE7',
  '#00CEC9',
  '#FDCB6E',
  '#E17055',
  '#A29BFE',
];

const CATEGORY_LABELS: Record<string, string> = {
  ocdEating: 'OCD ואכילה',
  anxietyMood: 'חרדה ומצב רוח',
  behavioral: 'התנהגות',
  cognitiveAcademic: 'קוגניטיבי',
  somatic: 'גופני',
  psychosisTics: 'פסיכוזה וטיקים',
};

const PANS31ResultsChart: React.FC = () => {
  const [aggregated, setAggregated] = useState<PANS31AggregatedData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const unsubscribe = subscribeToPANS31Results(
      (results: PANS31ResultDocument[]) => {
        try {
          const agg = aggregatePANS31Results(results);
          setAggregated(agg);
          setError(null);
        } catch (err) {
          console.error('Error aggregating PANS31 results:', err);
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
        <CircularProgress sx={{ color: '#717DBC' }} />
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
        אין עדיין נתונים להצגה עבור סולם PANS 31-פריטים. התוצאות יופיעו כאן לאחר שמשתמשים ימלאו את הסולם.
      </Alert>
    );
  }

  // Prepare severity distribution data
  const severityData = [
    { name: 'מינימלי', value: aggregated.severityDistribution.minimal, color: SEVERITY_COLORS.minimal },
    { name: 'קל', value: aggregated.severityDistribution.mild, color: SEVERITY_COLORS.mild },
    { name: 'בינוני', value: aggregated.severityDistribution.moderate, color: SEVERITY_COLORS.moderate },
    { name: 'חמור', value: aggregated.severityDistribution.severe, color: SEVERITY_COLORS.severe },
    { name: 'קיצוני', value: aggregated.severityDistribution.extreme, color: SEVERITY_COLORS.extreme },
  ].filter((d) => d.value > 0);

  // Prepare category data for radar chart
  const radarData = Object.entries(aggregated.averageCategories).map(([key, value]) => ({
    category: CATEGORY_LABELS[key] || key,
    value: Math.round((value / MAX_SCORES.categories[key as keyof typeof MAX_SCORES.categories]) * 100),
    fullMark: 100,
  }));

  // Prepare most common high severity symptoms
  const highSeverityData = aggregated.mostCommonHighSeverity.slice(0, 8).map((item) => ({
    name: PANS31_LABELS[item.symptom as keyof typeof PANS31_LABELS]?.label || item.symptom,
    percentage: item.percentage,
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
              {entry.value}
              {entry.dataKey === 'percentage' || entry.dataKey === 'value' ? '%' : ''}
            </Typography>
          ))}
        </Paper>
      );
    }
    return null;
  };

  return (
    <Paper elevation={3} className="pans31-results-chart">
      <Box sx={{ px: 3, pt: 3, pb: 2 }}>
        <Typography variant="h5" gutterBottom sx={{ textAlign: 'center', fontWeight: 'bold' }}>
          סטטיסטיקות קהילתיות - סולם PANS 31-פריטים
        </Typography>
        <Typography variant="body2" color="text.secondary" sx={{ textAlign: 'center', mb: 3 }}>
          מבוסס על {aggregated.count} הערכות שהושלמו
        </Typography>
      </Box>

      <Grid container spacing={3} sx={{ px: 3, pb: 3 }}>
        {/* Average Score */}
        <Grid xs={12} md={6}>
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
              <Typography variant="h1" sx={{ color: '#717DBC', fontWeight: 700 }}>
                {aggregated.averageTotal}
              </Typography>
              <Typography variant="h6" color="text.secondary">
                מתוך {MAX_SCORES.total}
              </Typography>
            </Box>
          </Paper>
        </Grid>

        {/* Severity Distribution */}
        <Grid xs={12} md={6}>
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

        {/* Category Radar Chart */}
        <Grid item xs={12}>
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
                  stroke="#717DBC"
                  fill="#717DBC"
                  fillOpacity={0.5}
                />
                <Tooltip content={<CustomTooltip />} />
              </RadarChart>
            </ResponsiveContainer>
          </Paper>
        </Grid>

        {/* Most Common High Severity Symptoms */}
        {highSeverityData.length > 0 && (
          <Grid item xs={12}>
            <Paper elevation={1} sx={{ p: 2 }}>
              <Typography variant="h6" gutterBottom align="center">
                תסמינים נפוצים בחומרה גבוהה (3-4)
              </Typography>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={highSeverityData} layout="vertical">
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis type="number" domain={[0, 100]} tickFormatter={(v) => `${v}%`} />
                  <YAxis type="category" dataKey="name" width={150} tick={{ fontSize: 11 }} />
                  <Tooltip content={<CustomTooltip />} />
                  <Bar dataKey="percentage" name="אחוז" fill="#FF9800" radius={[0, 4, 4, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </Paper>
          </Grid>
        )}

        {/* Summary Stats */}
        <Grid item xs={12}>
          <Box
            sx={{
              display: 'grid',
              gridTemplateColumns: { xs: 'repeat(3, 1fr)', sm: 'repeat(5, 1fr)' },
              gap: 2,
            }}
          >
            {[
              { label: 'מינימלי', value: aggregated.severityDistribution.minimal, color: SEVERITY_COLORS.minimal },
              { label: 'קל', value: aggregated.severityDistribution.mild, color: SEVERITY_COLORS.mild },
              { label: 'בינוני', value: aggregated.severityDistribution.moderate, color: SEVERITY_COLORS.moderate },
              { label: 'חמור', value: aggregated.severityDistribution.severe, color: SEVERITY_COLORS.severe },
              { label: 'קיצוני', value: aggregated.severityDistribution.extreme, color: SEVERITY_COLORS.extreme },
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
          הנתונים מתעדכנים אוטומטית כאשר משתמשים חדשים ממלאים את הסולם.
        </Typography>
      </Box>
    </Paper>
  );
};

export default PANS31ResultsChart;
