import React, { useState } from 'react';
import { Box, Container, Typography, Chip } from '@mui/material';
import {
    OpenInNew as ExternalIcon,
    Article as ArticlesIcon,
    Info as InfoIcon,
} from '@mui/icons-material';
import { ProfHero } from '../SharedComponents/ProfHero';
import ProfessionalTabs from '@/components/professionals/ProfessionalTabs/ProfessionalTabs';
import '../ProfessionalPage.scss';

interface Article { title: string; authors: string; journal: string; year: number; url: string; tag: string; tagColor?: string; abstract: string; }
const ARTICLES: Article[] = [
    { title: 'Clinical Evaluation of Youth with Pediatric Acute-Onset Neuropsychiatric Syndrome (PANS)', authors: 'Swedo SE, Seidlitz J, Kovacevic M, et al.', journal: 'Journal of Child and Adolescent Psychopharmacology', year: 2015, url: 'https://doi.org/10.1089/cap.2014.0062', tag: 'PANS', abstract: 'קריטריוני האבחון הרשמיים ל-PANS — מאמר הייחוס המרכזי. מגדיר תחילה פתאומית, OCD/הגבלות מזון ו-2+ תסמינים נוספים.' },
    { title: 'Pediatric Autoimmune Neuropsychiatric Disorders Associated with Streptococcal Infections: Clinical Description of the First 50 Cases', authors: 'Swedo SE, Leonard HL, Garvey M, et al.', journal: 'American Journal of Psychiatry', year: 1998, url: 'https://doi.org/10.1176/ajp.155.2.264', tag: 'PANDAS', abstract: 'המאמר המקורי שהגדיר PANDAS — 50 המקרים הראשונים, קשר ל-Strep, תגובה לאנטיביוטיקה.' },
    { title: 'Randomized Controlled Trial of Plasma Exchange, IVIG, and Placebo in Pediatric OCD-PANDAS', authors: 'Perlmutter SJ, Leitman SF, Garvey MA, et al.', journal: 'Lancet', year: 1999, url: 'https://doi.org/10.1016/S0140-6736(98)09413-3', tag: 'טיפול', tagColor: '#1565c0', abstract: 'מחקר RCT כפול-סמיות: פלסמהפרזה ו-IVIG יעילים משמעותית בהפחתת תסמיני OCD ב-PANDAS לעומת פלסבו.' },
    { title: 'Neuropsychiatric Symptoms in Children with Anti-N-Methyl-D-Aspartate Receptor Encephalitis', authors: 'Dalmau J, Gleichman AJ, Hughes EG, et al.', journal: 'Lancet Neurology', year: 2008, url: 'https://doi.org/10.1016/S1474-4422(08)70224-2', tag: 'PANS', abstract: 'Anti-NMDAR Encephalitis — סוג PANS שכיח עם נוגדנים ספציפיים. חשוב לאבחנה מבדלת.' },
    { title: 'A Clinical Case Series of Pediatric Acute-Onset Neuropsychiatric Syndrome Following Streptococcal Throat Infection', authors: 'Frankovich J, Thienemann M, Pearlstein J, et al.', journal: 'Journal of Pediatric Infectious Diseases Society', year: 2015, url: 'https://doi.org/10.1093/jpids/piu063', tag: 'PANDAS', abstract: 'סדרת מקרים מ-Stanford PANS Program — מאפייני מחלה, טיפולים ותוצאות ב-47 ילדים.' },
    { title: 'Anti-Basal Ganglia Antibodies in Acute Rheumatic Fever and Tourette Syndrome', authors: 'Kiessling LS, Marcotte AC, Culpepper L', journal: 'Journal of Child Neurology', year: 1994, url: 'https://doi.org/10.1177/088307389400900416', tag: 'מחקר בסיסי', tagColor: '#6a1b9a', abstract: 'אחד המאמרים הראשונים לתאר נוגדנים נגד גנגליה הבסיסיים בקשר ל-Strep — בסיס למנגנון האוטואימוני.' },
    { title: 'Long-term Antibiotic Prophylaxis for PANDAS: A Prospective Open-Label Study', authors: 'Snider LA, Lougee L, Slattery M, et al.', journal: 'Journal of Child and Adolescent Psychopharmacology', year: 2005, url: 'https://doi.org/10.1089/cap.2005.15.764', tag: 'טיפול', tagColor: '#1565c0', abstract: 'פרופילקסיס ארוך טווח עם Azithromycin ו-Penicillin V הפחית משמעותית אפיזודות PANDAS חוזרות.' },
    { title: 'Toward a Better Understanding of PANDAS, PANS, and Related Neuroimmune Disorders', authors: 'Chang K, Frankovich J, Bhatt A, et al.', journal: 'Pediatrics', year: 2015, url: 'https://doi.org/10.1542/peds.2014-1392', tag: 'סקירה', tagColor: '#2e7d32', abstract: 'סקירה מקיפה של הספרות המדעית — מחלוקות, הסכמות וכיווני מחקר עתידיים. מאמר הפניה חשוב.' },
];

export const ArticlesPage: React.FC = () => {
    const [filter, setFilter] = useState<string>('הכל');
    const tags = ['הכל', 'PANDAS', 'PANS', 'טיפול', 'סקירה', 'מחקר בסיסי'];
    const filtered = filter === 'הכל' ? ARTICLES : ARTICLES.filter(a => a.tag === filter);

    return (
        <Box className="professional-page" dir="rtl">
            <ProfHero
                icon={<ArticlesIcon />}
                label="מידע מקצועי"
                title="מאמרים מדעיים"
                desc="מאמרי מפתח בספרות הרפואית על PANDAS/PANS — לאבחון, טיפול ומחקר בסיסי"
            />
            <ProfessionalTabs />
            <Container maxWidth="lg" sx={{ py: 5 }}>

                {/* Filter chips */}
                <Box className="prof-filter-bar">
                    {tags.map(tag => (
                        <Chip
                            key={tag}
                            label={tag}
                            clickable
                            onClick={() => setFilter(tag)}
                            className={`prof-filter-chip ${filter === tag ? 'prof-filter-chip--active' : ''}`}
                        />
                    ))}
                </Box>

                <Box className="prof-articles-list">
                    {filtered.map(a => (
                        <Box key={a.title} className="prof-article-card">
                            <Box className="prof-article-card__meta">
                                <Chip label={a.tag} size="small" style={{ background: (a.tagColor || '#023373') + '18', color: a.tagColor || '#023373', fontWeight: 700 }} />
                                <Typography className="prof-article-card__year">{a.year}</Typography>
                            </Box>
                            <Typography className="prof-article-card__title">{a.title}</Typography>
                            <Typography className="prof-article-card__authors">{a.authors}</Typography>
                            <Typography className="prof-article-card__journal" component="em">{a.journal}</Typography>
                            <Typography className="prof-article-card__abstract">{a.abstract}</Typography>
                            <a href={a.url} target="_blank" rel="noopener noreferrer" className="prof-article-card__link">
                                <ExternalIcon />
                                <span>פתח מאמר (DOI)</span>
                            </a>
                        </Box>
                    ))}
                </Box>

                <Box className="prof-info-banner" style={{ marginTop: 32 }}>
                    <InfoIcon className="prof-info-banner__icon" />
                    <Typography className="prof-info-banner__text">
                        לרשימה מלאה של פרסומים: <a href="https://neuroimmune.org/clinicians/pans-pandas-publications-and-research/" target="_blank" rel="noopener noreferrer">Neuroimmune Foundation Publications</a> · <a href="https://www.pandasppn.org/research/" target="_blank" rel="noopener noreferrer">PPN Research Library</a>
                    </Typography>
                </Box>

            </Container>
        </Box>
    );
};

export default ArticlesPage;
