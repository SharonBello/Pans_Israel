import React from 'react';
import { Box, Container, Typography, Accordion, AccordionSummary, AccordionDetails, List, ListItem, ListItemIcon, ListItemText, Button, Card, CardContent } from '@mui/material';
import {
    ExpandMore as ExpandIcon,
    School as EducationIcon,
    CheckCircleOutline as CheckIcon,
    Info as InfoIcon,
    Circle as BulletIcon,
    Download as DownloadIcon,
} from '@mui/icons-material';
import '../ProfessionalPage.scss';
import ProfessionalTabs from '@/components/professionals/ProfessionalTabs/ProfessionalTabs';
import { ProfHero } from '../SharedComponents/ProfHero';
import { SectionWrapper } from '../SharedComponents/SectionWrapper';
import { LinkCard } from '../SharedComponents/LinkCard';

const DOWNLOADABLE_RESOURCES = [
    {
        id: 'quick-facts',
        title: 'עובדות מהירות על פאנס/פאנדס',
        titleEn: 'PANDAS, PANS Quick Facts',
        description: 'מדריך תמציתי להבנת התסמונות',
        url: '/pdfs/quickFactsHe.pdf',
    },
    {
        id: 'education-toolkit',
        title: 'ערכת כלים חינוכית',
        titleEn: 'PANDAS Education Toolkit',
        description: 'ערכה מקיפה לצוות בית הספר',
        url: 'https://pandasnetwork.org/wp-content/uploads/2022/03/PANDAS-NETWORK_EDUCATIONTOOLKIT.pdf',
    },
    {
        id: 'brochure',
        title: 'חוברת פאנדס',
        titleEn: 'PANDAS Brochure',
        description: 'חוברת מידע להפצה',
        url: 'https://pandasnetwork.org/wp-content/uploads/2023/04/Brochure.pdf',
    },
    {
        id: 'letter-exacerbation',
        title: 'מכתב לבית הספר בזמן התלקחות',
        titleEn: 'Letter to School while in Exacerbation',
        description: 'לשימוש כשהילד נמצא באפיזודה פעילה',
        url: '/pdfs/Letter_School_PANDAS_Flare.pdf',
    },
    {
        id: 'letter-remission',
        title: 'מכתב לבית הספר בזמן הפוגה',
        titleEn: 'Letter to School while in Remission',
        description: 'לשימוש כשהילד במצב יציב',
        url: '/pdfs/Letter_School_PANDAS_Remission.pdf',
    },
    {
        id: 'handout-teachers',
        title: 'דף מידע למורים',
        titleEn: 'Handout for Teachers',
        description: 'מידע תמציתי למורים על פאנס/פאנדס',
        url: '/pdfs/Letter_School_PANDAS_Handout.pdf',
    },
    {
        id: 'handout-kindergarden-teachers',
        title: 'דף מידע לגננות',
        titleEn: 'Handout for Kindergarden Teachers',
        description: 'מידע תמציתי לגננות על פאנס/פאנדס',
        url: '/pdfs/Letter_Kindergarden_PANDAS_Handout.pdf',
    },
];

export const EducationPage: React.FC = () => (
    <Box className="professional-page" dir="rtl">
        <ProfHero
            icon={<EducationIcon />}
            label="מידע מקצועי"
            title="מידע לצוות חינוכי"
            desc="מדריכים, תסריטים ומידע מעשי למורים, יועצים ופסיכולוגים חינוכיים — כיצד לתמוך בתלמידים עם PANDAS/PANS"
        />
        <ProfessionalTabs />
        <Container maxWidth="lg" sx={{ py: 5 }}>

            {/* ── SECTION 1: What school staff need to know ── */}
            <SectionWrapper title="מה צוות בית הספר צריך לדעת">
                <Box className="prof-info-banner">
                    <InfoIcon className="prof-info-banner__icon" />
                    <Typography className="prof-info-banner__text">
                        PANDAS/PANS הן מחלות נוירולוגיות-אימוניות. התנהגות מאתגרת בכיתה <strong>אינה</strong> בחירה של הילד —
                        היא תסמין של דלקת מוחית. גישה מתאימה מצד הצוות החינוכי יכולה לשנות את חוויית הילד לחלוטין.
                    </Typography>
                </Box>
                <Box className="prof-3col-grid">
                    {[
                        { title: 'סימנים לזיהוי בכיתה', items: ['ירידה פתאומית בתפקוד אקדמי', 'חרדה קיצונית / קשיי פרידה', 'OCD — טקסים, חזרות, שאלות', 'קשיי כתיבה ועיפרון', 'אי-יכולת להישאר בכיתה', 'שינויי מצב רוח חריפים'] },
                        { title: 'מה מועיל בכיתה', items: ['ישיבה ליד הדלת (יציאה קלה)', 'הפחתת גירויים חזותיים/שמיעתיים', 'הוראות קצרות ומפוצלות', 'הארכות זמן / מבחנים בסביבה שקטה', 'שמירה על שגרה קבועה', 'תקשורת שוטפת עם ההורים'] },
                        { title: 'מה להימנע ממנו', items: ['עונשים על התנהגות תסמינית', 'לחץ להשלמת מטלות בפרצה', 'חשיפה לזיהומים (מחלות כיתה)', 'שינויים פתאומיים בשגרה', 'כיתה רועשת / מוסחת', 'דרישה לנימוס בעת משבר'] },
                    ].map(col => (
                        <Box key={col.title} className="prof-check-card">
                            <Typography className="prof-check-card__title">{col.title}</Typography>
                            {col.items.map(item => (
                                <Box key={item} className="prof-check-card__item">
                                    <CheckIcon />
                                    <Typography>{item}</Typography>
                                </Box>
                            ))}
                        </Box>
                    ))}
                </Box>
            </SectionWrapper>

            {/* ── SECTION 2: How PANS/PANDAS affects school participation ── */}
            <SectionWrapper title="כיצד פאנס/פאנדס יכולות להשפיע על השתתפות בבית הספר?">
                <Typography sx={{ mb: 2, color: '#546e7a', fontSize: '0.9rem', fontFamily: "'Heebo','Assistant',sans-serif" }}>
                    תסמיני פאנס/פאנדס עשויים לגרום לחסרים בביצוע, במיוחד בתחומים הבאים:
                </Typography>
                <List disablePadding sx={{ mb: 3 }}>
                    {[
                        { title: 'נוכחות', desc: 'עקב חוסר שינה, עייפות' },
                        { title: 'קוגניציה', desc: 'כולל התנהגות, לימודים (קריאה, כתיבה ומתמטיקה), עומס חושי' },
                        { title: 'מיומנויות מוטוריות עדינות', desc: 'כתב יד והשלמת מטלות' },
                        { title: 'בעיות תפיסתיות ופיזיות', desc: 'המשפיעות על מיומנויות מוטוריות עדינות/גסות' },
                        { title: 'תכיפות ושליטה במתן שתן', desc: '' },
                        { title: 'יכולת לאכול כרגיל', desc: '' },
                        { title: 'בעיות חברתיות עם עמיתים', desc: '' },
                    ].map(item => (
                        <ListItem key={item.title} disablePadding sx={{ mb: 0.5 }}>
                            <ListItemIcon sx={{ minWidth: 28 }}>
                                <BulletIcon sx={{ fontSize: '0.5rem', color: '#6CA6D9' }} />
                            </ListItemIcon>
                            <ListItemText
                                primary={item.title}
                                secondary={item.desc || undefined}
                                primaryTypographyProps={{ fontWeight: 600, fontSize: '0.9rem', fontFamily: "'Heebo','Assistant',sans-serif" }}
                                secondaryTypographyProps={{ fontSize: '0.82rem', fontFamily: "'Heebo','Assistant',sans-serif" }}
                            />
                        </ListItem>
                    ))}
                </List>
                <Typography sx={{ mb: 2, color: '#546e7a', fontSize: '0.9rem', fontFamily: "'Heebo','Assistant',sans-serif" }}>
                    בהתאם לחומרה, שעשויה להשתנות לאורך זמן, פאנס/פאנדס עשויות להשפיע על יכולת התלמיד:
                </Typography>
                <List disablePadding>
                    {[
                        'להגיע ולנסוע לפעילויות הקשורות לבית הספר',
                        'לשמור על קשב ממוקד ותפקוד ניהולי',
                        'להסתגל למעברים ומתחים',
                        'להבין ולזכור מידע',
                        'לתקשר ביעילות, הן בעל פה והן בכתב',
                        'להתנהג בדרכים המתאימות לגיל ולהפגין טיפול עצמי ומיומנויות חיי יומיום',
                        'לשמור על רמת הסיבולת הפיזית והנפשית הקודמת שלהם',
                    ].map(item => (
                        <ListItem key={item} disablePadding sx={{ mb: 0.5 }}>
                            <ListItemIcon sx={{ minWidth: 28 }}>
                                <BulletIcon sx={{ fontSize: '0.5rem', color: '#6CA6D9' }} />
                            </ListItemIcon>
                            <ListItemText
                                primary={item}
                                primaryTypographyProps={{ fontSize: '0.88rem', fontFamily: "'Heebo','Assistant',sans-serif" }}
                            />
                        </ListItem>
                    ))}
                </List>
            </SectionWrapper>

            {/* ── SECTION 3: Academic accommodations ── */}
            <SectionWrapper title="התאמות לימודיות ובדיקות">
                <List disablePadding>
                    {[
                        'הוראות לזמן נוסף',
                        'סביבות ללא הסחות דעת',
                        'טכנולוגיה מסייעת',
                        'שיטות חלופיות של גישה והשלמה',
                        'תעדוף השלמת מטלות שנועד לשקף מיומנות',
                        'שימוש בעוזרי הערות',
                        'עומס עבודה מופחת או שיעורי בית מופחתים',
                        'תקופות מנוחה עם אחות',
                        'חינוך גופני מותאם והוראה בבית/בית חולים',
                    ].map(item => (
                        <ListItem key={item} disablePadding sx={{ mb: 0.5 }}>
                            <ListItemIcon sx={{ minWidth: 28 }}>
                                <CheckIcon sx={{ fontSize: '1rem', color: '#2e7d32' }} />
                            </ListItemIcon>
                            <ListItemText
                                primary={item}
                                primaryTypographyProps={{ fontSize: '0.88rem', fontFamily: "'Heebo','Assistant',sans-serif" }}
                            />
                        </ListItem>
                    ))}
                </List>
            </SectionWrapper>

            {/* ── SECTION 4: IHCP ── */}
            <SectionWrapper title="כיצד לפתח תוכנית טיפול בריאותי אישית?">
                <Typography sx={{ mb: 2, color: '#546e7a', fontSize: '0.88rem', fontFamily: "'Heebo','Assistant',sans-serif" }}>
                    אחיות בית ספר העובדות עם תלמידי פאנס/פאנדס יכולות ליישם את הצעדים הבאים:
                </Typography>
                {[
                    { q: 'התחילו בשיתוף פעולה', a: 'הכירו בצורך של מחנכים, נותני שירות, משפחה וכאשר אפשר, התלמיד, לספק משוב ולעבוד יחד.' },
                    { q: 'שקלו התערבויות', a: 'שיתייחסו לתסמינים המשפיעים על נוכחות והשתתפות במהלך יום הלימודים.' },
                    { q: 'שקלו שינויי לוח זמנים', a: 'פעילויות חלופיות ומיקומים, לוגיסטיקת הסעות וגמישות בנוכחות.' },
                    { q: 'שקלו טיפול תומך', a: 'ריפוי בעיסוק, פיזיותרפיה ותמיכה במיומנויות חברתיות.' },
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

            {/* ── SECTION 5: Israeli rights ── */}
            <SectionWrapper title="זכויות חינוכיות בישראל">
                {[
                    { q: 'חוק חינוך מיוחד ואפשרויות סיוע', a: 'ילדים עם PANDAS/PANS עשויים להיות זכאים לסייעת, הוראה מתקנת, פטור מבחינות בסביבה מותאמת, ואפשרות ללמוד מהבית בתקופות פרצה. יש לפנות לפסיכולוג החינוכי של בית הספר ולמפקחת חינוך מיוחד במחוז.' },
                    { q: '504 Plan / IEP — הגרסה הישראלית', a: 'בישראל קיים מסלול דומה דרך ועדת השמה. ניתן לקבל תכנית לימודים מותאמת (תל"מ) הכוללת הקלות בבחינות, זמן נוסף, פטור ממקצועות מסוימים ועזרה פסיכולוגית שבועית.' },
                    { q: 'מכתב לבית הספר — מה לכלול', a: 'מכתב מרופא המפרט את האבחנה, המגבלות הפונקציונליות, ההמלצות הספציפיות, ופרטי קשר לתיאום. מומלץ לכלול גם עלון הסבר על PANDAS/PANS למחנכת.' },
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

            {/* ── SECTION 6: Downloadable PDFs ── */}
            <SectionWrapper title="מסמכים להורדה">
                <Box sx={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: 2 }}>
                    {DOWNLOADABLE_RESOURCES.map(resource => (
                        <Card key={resource.id} elevation={0} sx={{ border: '1px solid rgba(0,0,0,0.08)', borderRadius: 2 }}>
                            <CardContent sx={{ display: 'flex', flexDirection: 'column', gap: 1, height: '100%' }}>
                                <Typography sx={{ fontWeight: 700, fontSize: '0.9rem', color: '#1a2744', fontFamily: "'Heebo','Assistant',sans-serif" }}>
                                    {resource.title}
                                </Typography>
                                {resource.titleEn && (
                                    <Typography sx={{ fontSize: '0.72rem', color: '#90a4ae', fontFamily: 'Assistant,sans-serif', direction: 'ltr', textAlign: 'right' }}>
                                        {resource.titleEn}
                                    </Typography>
                                )}
                                <Typography sx={{ fontSize: '0.82rem', color: '#607d8b', flex: 1, fontFamily: "'Heebo','Assistant',sans-serif" }}>
                                    {resource.description}
                                </Typography>
                                <Button
                                    variant="outlined"
                                    size="small"
                                    href={resource.url}
                                    download
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    startIcon={<DownloadIcon />}
                                    sx={{
                                        mt: 1,
                                        borderColor: '#023373',
                                        color: '#023373',
                                        fontFamily: "'Heebo','Assistant',sans-serif",
                                        fontSize: '0.78rem',
                                        '&:hover': { borderColor: '#1565c0', color: '#1565c0', background: 'rgba(2,51,115,0.04)' },
                                    }}
                                >
                                    הורד PDF
                                </Button>
                            </CardContent>
                        </Card>
                    ))}
                </Box>
            </SectionWrapper>

            {/* ── SECTION 7: School flyer images ── */}
            <SectionWrapper title="חומרי הסברה לבית הספר">
                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
                    <Box sx={{ borderRadius: 2, overflow: 'hidden', border: '1px solid rgba(0,0,0,0.08)' }}>
                        <img src="/images/school_diagram.jpeg" alt="תרשים בית ספר" style={{ width: '100%', display: 'block' }} />
                    </Box>
                    <Box sx={{ borderRadius: 2, overflow: 'hidden', border: '1px solid rgba(0,0,0,0.08)' }}>
                        <img src="/images/school_lecture_flyer.png" alt="עלון הרצאה לבית ספר" style={{ width: '100%', display: 'block' }} />
                    </Box>
                </Box>
            </SectionWrapper>

            {/* ── SECTION 8: External links ── */}
            <SectionWrapper title="קישורים חיצוניים">
                <Box className="prof-links-grid">
                    <LinkCard title="PANDAS/PANS School Guide — PANS PANDAS UK" desc="מדריך מקיף לצוות חינוכי — כולל סרטונים ועדויות" url="https://panspandasuk.org/education/" tag="מדריך" />
                    <LinkCard title="School & PANS/PANDAS — PPN" desc="מסמך מקצועי לצוות בית הספר — מה לעשות ומה לא" url="https://www.pandasppn.org/school/" tag="PDF" />
                    <LinkCard title="504 Plan Template for PANDAS" desc="תבנית מוכנה לתכנית התאמות ב-504 (אנגלית)" url="https://pandasnetwork.org/information-resources/school/" tag="תבנית" />
                    <LinkCard title="Educator Resources — Neuroimmune" desc="חומרי הסבר למורים על PANS/PANDAS ועל הצרכים המיוחדים" url="https://neuroimmune.org/patient-and-family-resources/pandas-schools/" tag="משאבים" />
                </Box>
            </SectionWrapper>

        </Container>
    </Box>
);

export default EducationPage;