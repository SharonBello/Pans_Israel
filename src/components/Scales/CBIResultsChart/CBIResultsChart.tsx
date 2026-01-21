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
  Legend,
} from 'recharts';
import {
  subscribeToCBIResults,
  aggregateCBIResults,
  type CBIAggregatedData,
  type CBIResultDocument,
} from '@/services/cbiService';
import { PANS_NORMS, MAX_SCORES } from '@/types/cbiScale';
import './CBIResultsChart.scss';

// Colors
const BURDEN_COLORS = {
  low: '#4CAF50',
  moderate: '#FFC107',
  high: '#FF9800',
  severe: '#F44336',
};

// const SUBSCALE_COLORS = ['#9B59B6', '#8E44AD', '#E74C3C', '#3498DB', '#1ABC9C'];

// const SUBSCALE_LABELS: Record<string, string> = {
//   timeDependency: 'זמן',
//   developmental: 'התפתחותי',
//   physical: 'גופני',
//   emotional: 'רגשי',
//   social: 'חברתי',
// };

const CBIResultsChart: React.FC = () => {
  const [aggregated, setAggregated] = useState<CBIAggregatedData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const unsubscribe = subscribeToCBIResults(
      (results: CBIResultDocument[]) => {
        try {
          const agg = aggregateCBIResults(results);
          setAggregated(agg);
          setError(null);
        } catch (err) {
          console.error('Error aggregating CBI results:', err);
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
        <CircularProgress sx={{ color: '#9B59B6' }} />
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
        אין עדיין נתונים להצגה עבור שאלון עומס המטפל. התוצאות יופיעו כאן לאחר שהורים ימלאו את השאלון.
      </Alert>
    );
  }

  // Prepare burden distribution data
  const burdenData = [
    { name: 'נמוך', value: aggregated.burdenDistribution.low, color: BURDEN_COLORS.low },
    { name: 'בינוני', value: aggregated.burdenDistribution.moderate, color: BURDEN_COLORS.moderate },
    { name: 'גבוה', value: aggregated.burdenDistribution.high, color: BURDEN_COLORS.high },
    { name: 'חמור', value: aggregated.burdenDistribution.severe, color: BURDEN_COLORS.severe },
  ].filter((d) => d.value > 0);

  // Prepare subscale comparison data (community vs PANS norms)
  const subscaleComparisonData = [
    {
      name: 'זמן',
      קהילה: aggregated.averageSubscales.timeDependency,
      'נורמה PANS': PANS_NORMS.subscales.timeDependency.mean,
    },
    {
      name: 'התפתחותי',
      קהילה: aggregated.averageSubscales.developmental,
      'נורמה PANS': PANS_NORMS.subscales.developmental.mean,
    },
    {
      name: 'גופני',
      קהילה: aggregated.averageSubscales.physical,
      'נורמה PANS': PANS_NORMS.subscales.physical.mean,
    },
    {
      name: 'רגשי',
      קהילה: aggregated.averageSubscales.emotional,
      'נורמה PANS': PANS_NORMS.subscales.emotional.mean,
    },
    {
      name: 'חברתי',
      קהילה: aggregated.averageSubscales.social,
      'נורמה PANS': PANS_NORMS.subscales.social.mean,
    },
  ];

  // Radar chart data
  const radarData = [
    {
      subscale: 'זמן',
      value: (aggregated.averageSubscales.timeDependency / MAX_SCORES.subscales.timeDependency) * 100,
    },
    {
      subscale: 'התפתחותי',
      value: (aggregated.averageSubscales.developmental / MAX_SCORES.subscales.developmental) * 100,
    },
    {
      subscale: 'גופני',
      value: (aggregated.averageSubscales.physical / MAX_SCORES.subscales.physical) * 100,
    },
    {
      subscale: 'רגשי',
      value: (aggregated.averageSubscales.emotional / MAX_SCORES.subscales.emotional) * 100,
    },
    {
      subscale: 'חברתי',
      value: (aggregated.averageSubscales.social / MAX_SCORES.subscales.social) * 100,
    },
  ];

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
              {entry.name}: {entry.value}
              {entry.dataKey === 'value' ? '%' : ''}
            </Typography>
          ))}
        </Paper>
      );
    }
    return null;
  };

  return (
    <Paper elevation={3} className="cbi-results-chart">
      <Box sx={{ px: 3, pt: 3, pb: 2 }}>
        <Typography variant="h5" gutterBottom sx={{ textAlign: 'center', fontWeight: 'bold' }}>
          סטטיסטיקות קהילתיות - עומס המטפל
        </Typography>
        <Typography variant="body2" color="text.secondary" sx={{ textAlign: 'center', mb: 3 }}>
          מבוסס על {aggregated.count} שאלונים שהושלמו
        </Typography>
      </Box>

      <Grid container spacing={3} sx={{ px: 3, pb: 3 }}>
        {/* Average Score vs PANS Norm */}
        <Grid sx={{ xs: 12, md: 6 }}>
          <Paper elevation={1} sx={{ p: 2, height: '100%' }}>
            <Typography variant="h6" gutterBottom align="center">
              ציון ממוצע
            </Typography>
            <Box
              sx={{
                display: 'flex',
                justifyContent: 'space-around',
                alignItems: 'center',
                height: 180,
              }}
            >
              <Box sx={{ textAlign: 'center' }}>
                <Typography variant="h2" sx={{ color: '#9B59B6', fontWeight: 700 }}>
                  {aggregated.averageTotal}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  קהילה
                </Typography>
              </Box>
              <Box sx={{ textAlign: 'center' }}>
                <Typography variant="h2" sx={{ color: '#636e72', fontWeight: 700 }}>
                  {PANS_NORMS.mean}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  נורמה PANS
                </Typography>
              </Box>
            </Box>
            <Typography variant="caption" color="text.secondary" sx={{ textAlign: 'center', display: 'block' }}>
              נקודת חתך קלינית: 36
            </Typography>
          </Paper>
        </Grid>

        {/* Burden Distribution */}
        <Grid sx={{ xs: 12, md: 6 }}>

          <Paper elevation={1} sx={{ p: 2, height: '100%' }}>
            <Typography variant="h6" gutterBottom align="center">
              התפלגות רמת עומס
            </Typography>
            <ResponsiveContainer width="100%" height={220}>
              <PieChart>
                <Pie
                  data={burdenData}
                  cx="50%"
                  cy="50%"
                  innerRadius={40}
                  outerRadius={70}
                  paddingAngle={5}
                  dataKey="value"
                  label={({ name, percent }) => `${name} (${((percent ?? 0) * 100).toFixed(0)}%)`}
                  labelLine={false}
                >
                  {burdenData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip content={<CustomTooltip />} />
              </PieChart>
            </ResponsiveContainer>
          </Paper>
        </Grid>

        {/* Subscale Comparison Bar Chart */}
        <Grid sx={{ xs: 12 }}>
          <Paper elevation={1} sx={{ p: 2 }}>
            <Typography variant="h6" gutterBottom align="center">
              השוואת תחומים - קהילה מול נורמה PANS
            </Typography>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={subscaleComparisonData} layout="vertical">
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis type="number" domain={[0, 20]} />
                <YAxis type="category" dataKey="name" width={80} />
                <Tooltip content={<CustomTooltip />} />
                <Legend />
                <Bar dataKey="קהילה" fill="#9B59B6" radius={[0, 4, 4, 0]} />
                <Bar dataKey="נורמה PANS" fill="#bdc3c7" radius={[0, 4, 4, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </Paper>
        </Grid>

        {/* Radar Chart */}
        <Grid sx={{ xs: 12, md: 6 }}>
          <Paper elevation={1} sx={{ p: 2 }}>
            <Typography variant="h6" gutterBottom align="center">
              פרופיל עומס (%)
            </Typography>
            <ResponsiveContainer width="100%" height={300}>
              <RadarChart data={radarData}>
                <PolarGrid />
                <PolarAngleAxis dataKey="subscale" tick={{ fontSize: 12 }} />
                <PolarRadiusAxis angle={90} domain={[0, 100]} tick={{ fontSize: 10 }} />
                <Radar
                  name="אחוז מהמקסימום"
                  dataKey="value"
                  stroke="#9B59B6"
                  fill="#9B59B6"
                  fillOpacity={0.5}
                />
                <Tooltip content={<CustomTooltip />} />
              </RadarChart>
            </ResponsiveContainer>
          </Paper>
        </Grid>

        {/* Respite Need Stats */}
        <Grid sx={{ xs: 12, md: 6 }}>
          <Paper elevation={1} sx={{ p: 2, height: '100%', display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
            <Typography variant="h6" gutterBottom align="center">
              צורך בשירותי הקלה
            </Typography>
            <Box sx={{ textAlign: 'center', py: 3 }}>
              <Typography variant="h1" sx={{ color: aggregated.needsRespitePercent > 50 ? '#F44336' : '#FF9800', fontWeight: 700 }}>
                {aggregated.needsRespitePercent}%
              </Typography>
              <Typography variant="body1" color="text.secondary">
                מההורים עם ציון מעל 36
              </Typography>
            </Box>
            <Alert severity="info" sx={{ mt: 2 }}>
              <Typography variant="caption">
                ציון מעל 36 מצביע על צורך קליני בשירותי הקלה ותמיכה
              </Typography>
            </Alert>
          </Paper>
        </Grid>

        {/* Summary Stats */}
        <Grid sx={{ xs: 12 }}>
          <Box
            sx={{
              display: 'grid',
              gridTemplateColumns: { xs: 'repeat(2, 1fr)', sm: 'repeat(4, 1fr)' },
              gap: 2,
            }}
          >
            {[
              { label: 'נמוך', value: aggregated.burdenDistribution.low, color: BURDEN_COLORS.low },
              { label: 'בינוני', value: aggregated.burdenDistribution.moderate, color: BURDEN_COLORS.moderate },
              { label: 'גבוה', value: aggregated.burdenDistribution.high, color: BURDEN_COLORS.high },
              { label: 'חמור', value: aggregated.burdenDistribution.severe, color: BURDEN_COLORS.severe },
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
          הנתונים מתעדכנים אוטומטית. נורמות PANS מבוססות על מחקר Farmer et al. (2018) עם 104 הורים.
        </Typography>
      </Box>
    </Paper>
  );
};

export default CBIResultsChart;
