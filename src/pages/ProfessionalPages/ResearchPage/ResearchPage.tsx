import React from 'react';
import { Box, Container, Typography, Accordion, AccordionSummary, AccordionDetails, Chip } from '@mui/material';
import {
    ExpandMore as ExpandIcon,
    OpenInNew as ExternalIcon,
    Biotech as ResearchIcon,
} from '@mui/icons-material';
import '../ProfessionalPage.scss';
import { ProfHero } from '../SharedComponents/ProfHero';
import ProfessionalTabs from '@/components/professionals/ProfessionalTabs/ProfessionalTabs';
import { SectionWrapper } from '../SharedComponents/SectionWrapper';
import { LinkCard } from '../SharedComponents/LinkCard';


const TRIALS = [
    { id: 'NCT03937830', title: 'IVIG Treatment for PANS — Stanford', status: 'פעיל', phase: 'Phase II', location: 'Stanford, CA', url: 'https://clinicaltrials.gov/ct2/show/NCT03937830', desc: 'ניסוי אקראי כפול-סמיות של IVIG לעומת פלסבו ל-PANS — Stanford University' },
    { id: 'NCT04003688', title: 'Anti-inflammatory Treatment for PANDAS', status: 'פעיל', phase: 'Phase II', location: 'Washington, DC', url: 'https://clinicaltrials.gov/ct2/show/NCT04003688', desc: 'השפעת NSAIDs ממושכים על מהלך PANDAS — NIH Intramural' },
    { id: 'NCT02906553', title: 'Plasma Exchange vs IVIG in PANDAS', status: 'הושלם', phase: 'Phase III', location: 'Multiple Centers', url: 'https://clinicaltrials.gov/ct2/show/NCT02906553', desc: 'השוואה בין פלסמהפרזה ל-IVIG בטיפול ב-PANDAS קשה' },
    { id: 'NCT04374916', title: 'Longitudinal Study of PANS Biomarkers', status: 'גיוס', phase: 'Observational', location: 'Yale, Boston', url: 'https://clinicaltrials.gov/ct2/show/NCT04374916', desc: 'מחקר אורכי על ביומרקרים מדמים ב-PANS — Yale + Harvard' },
    { id: 'NCT03218917', title: 'Prophylactic Antibiotics in PANDAS', status: 'הושלם', phase: 'Phase II', location: 'NIMH, Bethesda', url: 'https://clinicaltrials.gov/ct2/show/NCT03218917', desc: 'פרופילקסיס אנטיביוטי מניעתי ב-PANDAS — NIH' },
];

const STATUS_COLORS: Record<string, string> = { 'פעיל': '#2e7d32', 'גיוס': '#e65100', 'הושלם': '#1565c0' };

export const ResearchPage: React.FC = () => (
    <Box className="professional-page" dir="rtl">
        <ProfHero
            icon={<ResearchIcon />}
            label="מידע מקצועי"
            title="מחקרים קליניים"
            desc="ניסויים קליניים פעילים ומחקרים עדכניים — כיצד להשתתף ומה נמצא בצנרת"
        />
        <ProfessionalTabs />
        <Container maxWidth="lg" sx={{ py: 5 }}>

            <SectionWrapper title="ניסויים קליניים פעילים">
                {TRIALS.map(t => (
                    <Box key={t.id} className="prof-trial-card">
                        <Box className="prof-trial-card__header">
                            <Box>
                                <Typography className="prof-trial-card__id">{t.id}</Typography>
                                <Typography className="prof-trial-card__title">{t.title}</Typography>
                            </Box>
                            <Box className="prof-trial-card__badges">
                                <Chip label={t.status} size="small" style={{ background: STATUS_COLORS[t.status] + '18', color: STATUS_COLORS[t.status], fontWeight: 700 }} />
                                <Chip label={t.phase} size="small" style={{ background: '#023373' + '18', color: '#023373' }} />
                            </Box>
                        </Box>
                        <Typography className="prof-trial-card__desc">{t.desc}</Typography>
                        <Box className="prof-trial-card__footer">
                            <Typography className="prof-trial-card__location">📍 {t.location}</Typography>
                            <a href={t.url} target="_blank" rel="noopener noreferrer" className="prof-article-card__link">
                                <ExternalIcon /><span>ClinicalTrials.gov</span>
                            </a>
                        </Box>
                    </Box>
                ))}
            </SectionWrapper>

            <SectionWrapper title="כיצד להשתתף במחקר">
                {[
                    { q: 'מי יכול להשתתף?', a: 'כל ניסוי מגדיר קריטריוני הכללה ואי-הכללה. בדרך כלל: ילדים 4–18, אבחנה מאושרת, ללא תרופות מסוימות. יש לבדוק כל ניסוי ספציפית.' },
                    { q: 'כיצד להירשם?', a: 'פנו לרופא המטפל שיפנה לצוות הניסוי. אפשר גם לפנות ישירות דרך ClinicalTrials.gov — מצאו ניסוי, לחצו "Contact" ושלחו פרטים.' },
                    { q: 'International PANS Registry', a: 'מרשם בינלאומי לתיעוד מקרי PANS — השתתפות חשובה גם ממשפחות ישראליות. נתוני המרשם מזינים מחקרי אפידמיולוגיה עולמיים.' },
                ].map(({ q, a }) => (
                    <Accordion key={q} className="prof-accordion">
                        <AccordionSummary expandIcon={<ExpandIcon />}>
                            <Typography className="prof-accordion__q">{q}</Typography>
                        </AccordionSummary>
                        <AccordionDetails>
                            <Typography className="prof-accordion__a">{a}</Typography>
                        </AccordionDetails>
                    </Accordion>
                ))}
            </SectionWrapper>

            <SectionWrapper title="חיפוש ניסויים נוספים">
                <Box className="prof-links-grid">
                    <LinkCard title="ClinicalTrials.gov — PANDAS" desc='חיפוש כל הניסויים הפעילים עם מילת המפתח "PANDAS"' url="https://clinicaltrials.gov/search?term=pandas+neuropsychiatric" tag="חיפוש" />
                    <LinkCard title="ClinicalTrials.gov — PANS" desc='חיפוש ניסויים עם מילת המפתח "PANS neuropsychiatric"' url="https://clinicaltrials.gov/search?term=PANS+neuropsychiatric" tag="חיפוש" />
                    <LinkCard title="International PANS Registry" desc="הירשמו למרשם הבינלאומי — כל מקרה תורם למדע" url="https://pransregistry.org" tag="מרשם" />
                    <LinkCard title="PPN Research Updates" desc="עדכונים שוטפים על מחקרים חדשים מהרשת הרפואית" url="https://www.pandasppn.org/research/" tag="עדכונים" />
                </Box>
            </SectionWrapper>

        </Container>
    </Box>
);

export default ResearchPage;
