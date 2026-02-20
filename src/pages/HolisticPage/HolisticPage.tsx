import React from 'react';
import { Box, Container, Typography, Card, CardContent, Chip, Alert } from '@mui/material';
import {
    Spa as SpaIcon,
    LocalFlorist as HerbIcon,
    Psychology as MindIcon,
    FitnessCenter as BodyIcon,
    Restaurant as NutritionIcon,
    SelfImprovement as MeditationIcon,
} from '@mui/icons-material';
import './HolisticPage.scss';
import TreatmentTabs from '@/components/Treatment/TreatmentTabs/TreatmentTabs';

const HOLISTIC_AREAS = [
    {
        id: 'nutrition',
        icon: <NutritionIcon sx={{ fontSize: '2rem' }} />,
        title: 'תזונה ותוספים',
        color: '#4caf50',
        bgColor: 'rgba(76,175,80,0.06)',
        description:
            'גישות תזונתיות שעשויות לתמוך במערכת החיסון ולהפחית דלקת — כולל דיאטות אנטי-דלקתיות, תוספי ויטמינים ומינרלים, והימנעות ממזונות מעוררי דלקת.',
        examples: ['ויטמין D', 'אומגה 3', 'מגנזיום', 'פרוביוטיקה', 'דיאטה ים-תיכונית'],
    },
    {
        id: 'herbal',
        icon: <HerbIcon sx={{ fontSize: '2rem' }} />,
        title: 'צמחי מרפא ונטורופתיה',
        color: '#8bc34a',
        bgColor: 'rgba(139,195,74,0.06)',
        description:
            'שימוש בצמחי מרפא ותכשירים טבעיים לתמיכה במערכת החיסון ולאיזון רמות הדלקת. חשוב להתייעץ עם נטורופת מוסמך לפני התחלת כל טיפול.',
        examples: ['כורכום', 'אשווגנדה', 'אכינצאה', 'ג\'ינג\'ר', 'ברברין'],
    },
    {
        id: 'mind',
        icon: <MindIcon sx={{ fontSize: '2rem' }} />,
        title: 'פסיכולוגיה ורגש',
        color: '#9c27b0',
        bgColor: 'rgba(156,39,176,0.06)',
        description:
            'טיפולים פסיכולוגיים מותאמים לילדים עם PANS/PANDAS — CBT, טיפול במשחק, EMDR, וטכניקות לניהול חרדה ו-OCD. חלק בלתי נפרד מהטיפול המשולב.',
        examples: ['CBT', 'טיפול במשחק', 'EMDR', 'מיינדפולנס', 'ביופידבק'],
    },
    {
        id: 'body',
        icon: <BodyIcon sx={{ fontSize: '2rem' }} />,
        title: 'פיזיותרפיה ועיסוי',
        color: '#ff9800',
        bgColor: 'rgba(255,152,0,0.06)',
        description:
            'טיפולים גופניים לשחרור מתחים, שיפור תפקוד מוטורי, והפחתת תסמינים פיזיים הנלווים לתסמונת — כולל פיזיותרפיה, ריפוי בעיסוק ועיסוי רפואי.',
        examples: ['פיזיותרפיה', 'ריפוי בעיסוק', 'עיסוי רפואי', 'SensoryOT', 'הידרותרפיה'],
    },
    {
        id: 'meditation',
        icon: <MeditationIcon sx={{ fontSize: '2rem' }} />,
        title: 'מיינדפולנס והרפיה',
        color: '#00bcd4',
        bgColor: 'rgba(0,188,212,0.06)',
        description:
            'טכניקות הרגעה ומיינדפולנס מותאמות לילדים — עוזרות להפחית חרדה, לשפר שינה, ולתת לילד כלים לניהול עצמאי של תסמינים.',
        examples: ['נשימות מודעות', 'יוגה לילדים', 'מדיטציה מודרכת', 'EFT', 'ויזואליזציה'],
    },
    {
        id: 'spa',
        icon: <SpaIcon sx={{ fontSize: '2rem' }} />,
        title: 'אקופונקטורה ורפלקסולוגיה',
        color: '#e91e63',
        bgColor: 'rgba(233,30,99,0.06)',
        description:
            'טיפולים מרפואה סינית מסורתית שחלק מההורים מדווחים על שיפור בתסמינים בעקבותיהם — חשוב לעבוד עם מטפלים בעלי ניסיון עם ילדים.',
        examples: ['דיקור', 'רפלקסולוגיה', 'שיאצו', 'צ\'י קונג', 'רפואה סינית'],
    },
];

const HolisticPage: React.FC = () => {
    return (
        <Box className="holistic-page" dir="rtl">

            {/* Hero */}
            <Box className="holistic-page__hero">
                <Box className="holistic-page__hero-bg" />
                <Container maxWidth="lg" className="holistic-page__hero-content">
                    {/* <Typography variant="overline" className="holistic-page__hero-label">
                        אפשרויות טיפול
                    </Typography> */}
                    <Typography variant="h1" className="holistic-page__hero-title">
                        רפואה משלימה
                    </Typography>
                    <Typography variant="body1" className="holistic-page__hero-description">
                        גישות משלימות לתמיכה בילדים עם פאנס/פאנדס לצד הטיפול הרפואי הקונבנציונלי
                    </Typography>
                </Container>
            </Box>

            {/* Tabs */}
            <TreatmentTabs />

            {/* Content */}
            <Container maxWidth="lg" sx={{ py: 5 }}>

                <Alert
                    severity="warning"
                    sx={{ mb: 4, borderRadius: 2, fontFamily: "'Heebo','Assistant',sans-serif" }}
                >
                    <Typography variant="body2" sx={{ fontFamily: 'inherit' }}>
                        <strong>חשוב לדעת:</strong> הטיפולים המשלימים המוצגים כאן אינם מחליפים טיפול רפואי קונבנציונלי.
                        יש להתייעץ עם הרופא המטפל לפני הוספת כל טיפול משלים. מידע זה נאסף מהקהילה ואינו המלצה רפואית.
                    </Typography>
                </Alert>

                <Typography variant="h4" sx={{
                    fontWeight: 700, color: '#1a2744', mb: 1, textAlign: 'center',
                    fontFamily: "'Heebo','Assistant',sans-serif",
                }}>
                    תחומי הרפואה המשלימה
                </Typography>
                <Typography variant="body1" sx={{
                    color: '#546e7a', textAlign: 'center', mb: 4,
                    fontFamily: "'Heebo','Assistant',sans-serif",
                }}>
                    הורים רבים בקהילה משלבים גישות אלו לצד הטיפול הרפואי הרגיל
                </Typography>

                <Box sx={{
                    display: 'grid',
                    gridTemplateColumns: { xs: '1fr', sm: '1fr 1fr', md: 'repeat(3, 1fr)' },
                    gap: 3,
                }}>
                    {HOLISTIC_AREAS.map((area) => (
                        <Card
                            key={area.id}
                            sx={{
                                border: `2px solid ${area.color}22`,
                                borderTop: `4px solid ${area.color}`,
                                borderRadius: 2,
                                backgroundColor: area.bgColor,
                                transition: 'transform 0.2s, box-shadow 0.2s',
                                '&:hover': {
                                    transform: 'translateY(-3px)',
                                    boxShadow: `0 8px 24px ${area.color}30`,
                                },
                            }}
                        >
                            <CardContent sx={{ p: 3 }}>
                                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mb: 2 }}>
                                    <Box sx={{ color: area.color }}>{area.icon}</Box>
                                    <Typography variant="h6" sx={{
                                        fontWeight: 700, color: '#1a2744',
                                        fontFamily: "'Heebo','Assistant',sans-serif",
                                    }}>
                                        {area.title}
                                    </Typography>
                                </Box>

                                <Typography variant="body2" sx={{
                                    color: '#546e7a', lineHeight: 1.7, mb: 2,
                                    fontFamily: "'Heebo','Assistant',sans-serif",
                                }}>
                                    {area.description}
                                </Typography>

                                <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.75 }}>
                                    {area.examples.map((ex) => (
                                        <Chip
                                            key={ex}
                                            label={ex}
                                            size="small"
                                            sx={{
                                                backgroundColor: `${area.color}15`,
                                                color: area.color,
                                                border: `1px solid ${area.color}30`,
                                                fontSize: '0.72rem',
                                                fontFamily: "'Heebo','Assistant',sans-serif",
                                            }}
                                        />
                                    ))}
                                </Box>
                            </CardContent>
                        </Card>
                    ))}
                </Box>

                {/* Community note */}
                <Box sx={{
                    mt: 5, p: 3,
                    backgroundColor: 'rgba(2,51,115,0.04)',
                    border: '1px solid rgba(2,51,115,0.12)',
                    borderRadius: 2, textAlign: 'center',
                }}>
                    <Typography variant="h6" sx={{
                        fontWeight: 700, color: '#023373', mb: 1,
                        fontFamily: "'Heebo','Assistant',sans-serif",
                    }}>
                        יש לכם ניסיון עם רפואה משלימה?
                    </Typography>
                    <Typography variant="body2" sx={{
                        color: '#546e7a', mb: 2,
                        fontFamily: "'Heebo','Assistant',sans-serif",
                    }}>
                        שתפו את הקהילה — אנחנו אוספים חוויות ומידע מהורים על גישות שעזרו לילדיהם
                    </Typography>
                    <a
                        href="https://www.facebook.com/groups/PandasIsrael"
                        target="_blank"
                        rel="noopener noreferrer"
                        style={{
                            display: 'inline-block',
                            backgroundColor: '#023373',
                            color: '#fff',
                            padding: '10px 24px',
                            borderRadius: '8px',
                            textDecoration: 'none',
                            fontFamily: "'Heebo','Assistant',sans-serif",
                            fontSize: '0.9rem',
                            fontWeight: 600,
                        }}
                    >
                        שתפו בקבוצת הפייסבוק
                    </a>
                </Box>

            </Container>
        </Box>
    );
};

export default HolisticPage;