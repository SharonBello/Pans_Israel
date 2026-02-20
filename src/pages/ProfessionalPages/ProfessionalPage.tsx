import {
    Container,
    Typography,
    Box,
    Card,
    CardContent,
    CardActions,
    Button,
    Chip,
    Link,
} from '@mui/material';
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { FiBarChart2 } from 'react-icons/fi';
import { ContentPaste as SurveysIcon } from '@mui/icons-material';
import ProfessionalTabs from '@/components/professionals/ProfessionalTabs/ProfessionalTabs';
import './ProfessionalPage.scss';
import { ProfHero } from './SharedComponents/ProfHero';

interface SurveyCard {
    id: string;
    title: string;
    description: string;
    route: string;
    resultsRoute?: string;
    available: boolean;
    status: 'available' | 'coming-soon';
    color?: string;
    validated?: boolean;
}

const SurveysPage: React.FC = (): React.JSX.Element => {
    const navigate = useNavigate();

    const surveys: SurveyCard[] = [
        {
            id: 'state-of-children',
            title: 'סקר מצב ילדינו 2026',
            description: 'סקר מקיף למשפחות ילדים עם פאנס/פאנדס בישראל. המידע יסייע להגביר את המודעות ולקדם מחקר בתחום.',
            route: '/surveys/state-of-children',
            resultsRoute: '/surveys/state-of-children/results',
            available: true,
            status: 'available',
            color: '#717DBC',
            validated: true,
        },
    ];

    const handleStartSurvey = (survey: SurveyCard) => {
        if (survey.available) navigate(survey.route);
    };

    return (
        <Box className="professional-page" dir="rtl">

            {/* ── Hero — same style as all other professional pages ── */}
            <ProfHero
                icon={<SurveysIcon />}
                label="מידע מקצועי"
                title="סקרים"
                desc="סקרים קהילתיים לאיסוף מידע על מצב משפחות פאנס/פאנדס בישראל — כל השתתפות תורמת למחקר ולמדיניות"
            />

            {/* ── Professional tabs navigation ── */}
            <ProfessionalTabs />

            {/* ── Survey cards ── */}
            <Container maxWidth="lg" sx={{ py: 5 }} dir="rtl">
                <Box
                    sx={{
                        display: 'grid',
                        gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))',
                        gap: 3,
                    }}
                >
                    {surveys.map((survey) => (
                        <Card
                            key={survey.id}
                            elevation={3}
                            sx={{
                                borderTop: survey.available ? `4px solid ${survey.color || '#717DBC'}` : undefined,
                                borderRadius: 2,
                                direction: 'rtl',
                            }}
                        >
                            <CardContent sx={{ pb: 1 }}>

                                {/* Status badge */}
                                <Box sx={{ mb: 1 }}>
                                    {survey.validated && (
                                        <Chip
                                            label="מאומת"
                                            size="small"
                                            sx={{
                                                backgroundColor: 'rgba(76, 175, 80, 0.1)',
                                                color: '#4CAF50',
                                                fontWeight: 'bold',
                                                fontFamily: "'Heebo','Assistant',sans-serif",
                                            }}
                                        />
                                    )}
                                </Box>

                                {/* Title */}
                                <Typography
                                    variant="h5"
                                    component="h2"
                                    gutterBottom
                                    sx={{
                                        fontFamily: "'Heebo','Assistant',sans-serif",
                                        fontWeight: 700,
                                        color: '#1a2744',
                                        textAlign: 'right',
                                    }}
                                >
                                    {survey.title}
                                </Typography>

                                {/* Description */}
                                <Typography
                                    variant="body2"
                                    color="text.secondary"
                                    sx={{
                                        fontFamily: "'Heebo','Assistant',sans-serif",
                                        textAlign: 'right',
                                        lineHeight: 1.7,
                                    }}
                                >
                                    {survey.description}
                                </Typography>
                            </CardContent>

                            <CardActions sx={{ flexDirection: 'column', gap: 1, px: 2, pb: 2 }}>
                                <Button
                                    variant="contained"
                                    fullWidth
                                    disabled={!survey.available}
                                    onClick={() => handleStartSurvey(survey)}
                                    sx={{
                                        backgroundColor: survey.color,
                                        fontFamily: "'Heebo','Assistant',sans-serif",
                                        fontWeight: 600,
                                        '&:hover': { backgroundColor: survey.color, filter: 'brightness(0.9)' },
                                    }}
                                >
                                    התחל סקר
                                </Button>

                                {survey.resultsRoute && (
                                    <Link
                                        component="button"
                                        onClick={() => navigate(survey.resultsRoute!)}
                                        sx={{
                                            display: 'flex',
                                            alignItems: 'center',
                                            gap: 0.5,
                                            fontSize: '0.875rem',
                                            color: survey.color || '#717DBC',
                                            textDecoration: 'none',
                                            cursor: 'pointer',
                                            fontFamily: "'Heebo','Assistant',sans-serif",
                                            '&:hover': { textDecoration: 'underline' },
                                        }}
                                    >
                                        <FiBarChart2 size={16} />
                                        צפה בתוצאות הסקר
                                    </Link>
                                )}
                            </CardActions>
                        </Card>
                    ))}
                </Box>
            </Container>
        </Box>
    );
};

export default SurveysPage;