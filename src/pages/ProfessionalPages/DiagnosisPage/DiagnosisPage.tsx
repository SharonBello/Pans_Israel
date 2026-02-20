import React from 'react';
import { Box, Container, Typography, Accordion, AccordionSummary, AccordionDetails, List, ListItem, ListItemIcon, ListItemText } from '@mui/material';
import {
    ExpandMore as ExpandIcon,
    MedicalServices as DiagnosisIcon,
    CheckCircleOutline as CheckIcon,
    Circle as BulletIcon,
} from '@mui/icons-material';
import '../ProfessionalPage.scss';
import ProfessionalTabs from '@/components/professionals/ProfessionalTabs/ProfessionalTabs';
import { ProfHero } from '../SharedComponents/ProfHero';
import { SectionWrapper } from '../SharedComponents/SectionWrapper';
import { LinkCard } from '../SharedComponents/LinkCard';

export const DiagnosisPage: React.FC = () => (
    <Box className="professional-page" dir="rtl">
        <ProfHero
            icon={<DiagnosisIcon />}
            label="מידע מקצועי"
            title="אבחון וטיפול"
            desc="קריטריונים, פרוטוקולים קליניים ומדריכים לאבחון ולטיפול ב-PANDAS/PANS — לרופאים ואנשי מקצוע"
        />
        <ProfessionalTabs />
        <Container maxWidth="lg" sx={{ py: 5 }}>

            {/* ── SECTION 1: Diagnosis criteria ── */}
            <SectionWrapper title="קריטריוני אבחון">
                <Box className="prof-criteria-grid">
                    {[
                        { label: 'PANDAS', items: ['סיפור פתאומי של תסמינים נוירופסיכיאטריים', 'אובססיות / OCD או טיקים', 'ילדים בגיל 3 עד בגרות מינית', 'קשר זמני לזיהום סטרפטוקוקלי', 'תסמינים נוירולוגיים (כוריפורמים)'] },
                        { label: 'PANS', items: ['אובססיות פתאומיות / הגבלות מזון', '2+ תסמינים נוירופסיכיאטריים נוספים', 'תחילה פתאומית ודרמטית', 'לא מוסבר ע"י מצב נוירולוגי אחר', 'גורם מדבק, מטבולי או אחר'] },
                    ].map(c => (
                        <Box key={c.label} className="prof-criteria-card">
                            <Typography className="prof-criteria-card__label">{c.label}</Typography>
                            {c.items.map(item => (
                                <Box key={item} className="prof-criteria-card__item">
                                    <CheckIcon className="prof-criteria-card__check" />
                                    <Typography>{item}</Typography>
                                </Box>
                            ))}
                        </Box>
                    ))}
                </Box>
            </SectionWrapper>

            {/* ── SECTION 2: FAQ from resourcesContent clinicians ── */}
            <SectionWrapper title="שאלות נפוצות לאנשי מקצוע">
                {[
                    { q: 'אילו בדיקות זמינות ל-פאנס/פאנדס?', a: 'כרגע, אין בדיקה מוחלטת 100% ל-פאנס/פאנדס, ולכן האבחנה נעשית על בסיס הערכה קלינית של התסמינים הנוירולוגיים ובריאות הנפש, יחד עם היסטוריה רפואית וממצאי מעבדה. בדיקות מעבדה כולל בדיקות דם בסיסיות, בדיקות ויראליות/חיידקיות כולל תרביות גרון לסטרפ ופאנל קנינגהם יכולות לעזור באבחנה נכונה.' },
                    { q: 'מהם גורמי הסיכון ל-פאנס/פאנדס?', a: 'למרות שסטרפ הוא הטריגר הנפוץ ביותר, חיידקים, וירוסים וגורמים סביבתיים אחרים יכולים ליצור את התגובה החיסונית המוטעית, כולל Mycoplasma pneumoniae, זיהומי סטאפ, מחלת ליים, שפעת, קוקסקי, אפשטיין-בר ונגיף הרפס סימפלקס. טריגרים אפשריים נוספים כוללים חשיפה למחלה, אלרגיות, מתח, כלור, תזונה וצמיחת יתר של שמרים.' },
                    { q: 'מה צריך לדעת על אינטראקציה עם הורים?', a: 'זו ההזדמנות שלכם לעשות הבדל גדול ולהשפיע עמוקות על ילדים ומשפחות. בקשו ממשפחות לצלם וידאו של ילדם ולשלוח לכם. הכינו המלצות לאימונולוגים, נוירולוגים, פסיכולוגים ופסיכיאטרים ילדים מקומיים מהימנים.' },
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

            {/* ── SECTION 3: Treatment protocols ── */}
            <SectionWrapper title="פרוטוקולי טיפול מומלצים">
                {[
                    { q: 'טיפול אנטיביוטי', a: 'אמוקסיצילין, פניצילין V, אוגמנטין לזיהומי Strep. בפרצות חוזרות — שקילת פרופילקסיס ארוך-טווח (Azithromycin/Penicillin V ×12 חודשים).' },
                    { q: 'אנטי-דלקתיים', a: 'NSAIDs (איבופרופן) לתסמינים קלים-בינוניים. קורטיקוסטרואידים קצרי-טווח לפרצות חריפות. IVIG / פלסמהפרזה לאפיזודות קשות.' },
                    { q: 'פסיכיאטרי/פסיכולוגי', a: 'CBT + ERP לאובססיות/קומפולסיות. SSRIs בזהירות — סבולת נמוכה אפשרית. ייעוץ משפחתי ותמיכה בסביבה.' },
                    { q: 'IVIG', a: 'ניתן ל-PANDAS/PANS עם תסמינים קשים שלא הגיבו לאנטיביוטיקה. 1-2 g/kg מנה חד-פעמית. תוצאות מחקר Stanford מצדדות ביעילות.' },
                    { q: 'אנטיביוטיקה מניעתית', a: 'פרופילקסיס ארוך-טווח עם Azithromycin או Penicillin V מפחית משמעותית אפיזודות חוזרות. מומלץ לשקול לאחר שתי אפיזודות מתועדות ומאושרות.' },
                    { q: 'כריתת שקדים', a: 'בחלק מהמקרים עם זיהומי Strep חוזרים ותסמינים חמורים, כריתת שקדים נחשבת כאופציה. יש להחליט באופן פרטני בשיתוף ילד/משפחה.' },
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

            {/* ── SECTION 4: Clinician resource links (from resourcesContent clinicians) ── */}
            <SectionWrapper title="משאבים נוספים לאנשי מקצוע">
                <Box className="prof-links-grid">
                    <LinkCard title="PANDAS Physicians Network" desc="רשת רופאים בינלאומית מקצועית עם הנחיות אבחון וטיפול" url="https://www.pandasppn.org/" tag="רשת" />
                    <LinkCard title="המכון הלאומי לבריאות הנפש (NIMH)" desc="סוכנות המחקר הפדרלית המובילה להפרעות נפשיות" url="https://www.nimh.nih.gov/" tag="NIMH" />
                    <LinkCard title="International OCD Foundation" desc="המשימה היא לעזור לכל מי שמושפע מ-OCD והפרעות קשורות" url="https://iocdf.org/" tag="OCD" />
                    <LinkCard title="Rare Diseases Toolkit" desc="מידע שימושי על חיים עם או תמיכה במטופלים עם מחלות נדירות" url="https://rarediseases.org/" tag="כללי" />
                </Box>
            </SectionWrapper>

            {/* ── SECTION 5: Clinical download guides ── */}
            <SectionWrapper title="מדריכים קליניים להורדה">
                <Box className="prof-links-grid">
                    <LinkCard title="PANS/PANDAS Treatment Guidelines — Stanford" desc="המדריך הקליני המקיף ביותר — אבחון, טיפול ומעקב" url="https://med.stanford.edu/content/dam/sm/pans/documents/PANSPANDASClinicalProtocol.pdf" tag="PDF" />
                    <LinkCard title="PANDAS Physicians Network — Treatment Guide" desc="פרוטוקול טיפול מעשי מאורגן לפי שלבי חומרה" url="https://www.pandasppn.org/treatment/" tag="מדריך" />
                    <LinkCard title="Neuroimmune — Clinician Resources" desc="משאבים לרופאים כולל פרוטוקולי IVIG ופלסמהפרזה" url="https://neuroimmune.org/clinicians/pandas-medical-resources/" tag="משאבים" />
                    <LinkCard title="PANS/PANDAS Treatment & Evaluation Checklist (PTEC)" desc="רשימת תיוג מלאה לאבחון ומעקב — Neuroimmune Foundation" url="https://neuroimmune.org/pans-pandas-treatment-evaluation-checklist/" tag="חדש" tagColor="#c62828" />
                </Box>
            </SectionWrapper>

        </Container>
    </Box>
);

export default DiagnosisPage;