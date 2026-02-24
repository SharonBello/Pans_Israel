import React, { useState, useEffect, useRef } from 'react';
import { Box, Container, Typography, Chip, Skeleton } from '@mui/material';
import {
    OpenInNew as ExternalIcon,
    Article as ArticlesIcon,
    Info as InfoIcon,
} from '@mui/icons-material';
import workerSrc from 'pdfjs-dist/build/pdf.worker.min.mjs?url';
import { getFirestore, collection, getDocs, orderBy, query } from 'firebase/firestore';
import { ProfHero } from '../SharedComponents/ProfHero';
import ProfessionalTabs from '@/components/professionals/ProfessionalTabs/ProfessionalTabs';
import research1 from '../../../styles/assets/resources/research-1.png';
import research2 from '../../../styles/assets/resources/research-2.png';
import research3 from '../../../styles/assets/resources/research-3.png';
import '../ProfessionalPage.scss';
import type { PdfEntry } from '@/components/professionals/PdfCard/PdfCard';

// ── PDF Thumbnail ─────────────────────────────────────────────────────────────
// Fetches PDF as ArrayBuffer (no CORS tainting) then renders page 1 via pdfjs
const PdfThumbnail: React.FC<{ pdfUrl: string }> = ({ pdfUrl }) => {
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(false);

    useEffect(() => {
        let cancelled = false;
        const render = async () => {
            try {
                const pdfjsLib = await import('pdfjs-dist');
                pdfjsLib.GlobalWorkerOptions.workerSrc = workerSrc;


                // Fetch as ArrayBuffer to avoid canvas CORS tainting issues
                const response = await fetch(pdfUrl);
                if (!response.ok) throw new Error(`HTTP ${response.status}`);
                const arrayBuffer = await response.arrayBuffer();

                if (cancelled) return;

                const pdf = await pdfjsLib.getDocument({ data: arrayBuffer }).promise;
                const page = await pdf.getPage(1);

                if (cancelled || !canvasRef.current) return;

                const canvas = canvasRef.current;
                const ctx = canvas.getContext('2d');
                if (!ctx) return;

                const parentWidth = canvas.parentElement?.clientWidth || 300;
                const viewport = page.getViewport({ scale: 1 });
                const scale = parentWidth / viewport.width;
                const scaled = page.getViewport({ scale });

                canvas.width = scaled.width;
                canvas.height = scaled.height;
                ctx.fillStyle = '#ffffff';
                ctx.fillRect(0, 0, canvas.width, canvas.height);

                await page.render({ canvasContext: ctx, viewport: scaled, canvas }).promise;
                if (!cancelled) setLoading(false);
            } catch (err) {
                console.warn('PdfThumbnail error:', err);
                if (!cancelled) { setError(true); setLoading(false); }
            }
        };
        render();
        return () => { cancelled = true; };
    }, [pdfUrl]);

    return (
        <div className="resources-page__card-image" style={{ overflow: 'hidden', background: '#f5f7ff' }}>
            {loading && !error && (
                <Skeleton variant="rectangular" width="100%" height="100%" animation="wave" />
            )}
            {error && (
                <div style={{
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    height: '100%', background: '#eef2ff', color: '#023373', fontSize: '2.5rem',
                }}>
                    📄
                </div>
            )}
            <canvas
                ref={canvasRef}
                style={{
                    display: loading || error ? 'none' : 'block',
                    width: '100%',
                    height: 'auto',
                }}
            />
        </div>
    );
};

const ExpandableText: React.FC<{ text: string }> = ({ text }) => {
    const [expanded, setExpanded] = useState(false);
    const LIMIT = 120;
    const isLong = text.length > LIMIT;
    const displayed = expanded || !isLong ? text : text.slice(0, LIMIT) + '...';

    return (
        <p style={{ fontSize: '0.8rem', color: '#555', margin: '4px 12px 12px', lineHeight: 1.5 }}>
            {displayed}
            {isLong && (
                <button
                    onClick={(e) => { e.stopPropagation(); setExpanded(!expanded); }}
                    style={{
                        background: 'none', border: 'none', color: '#023373',
                        cursor: 'pointer', fontWeight: 700, fontSize: '0.8rem',
                        padding: '0 4px',
                    }}
                >
                    {expanded ? ' סגור' : ' קרא עוד...'}
                </button>
            )}
        </p>
    );
};

// ── Static articles ───────────────────────────────────────────────────────────
interface Article {
    title: string;
    authors: string;
    journal: string;
    year: number;
    url: string;
    tag: string;
    tagColor?: string;
    abstract: string;
}

const ARTICLES: Article[] = [
    {
        title: 'Clinical Evaluation of Youth with Pediatric Acute-Onset Neuropsychiatric Syndrome (PANS)',
        authors: 'Swedo SE, Seidlitz J, Kovacevic M, et al.',
        journal: 'Journal of Child and Adolescent Psychopharmacology',
        year: 2015,
        url: 'https://doi.org/10.1089/cap.2014.0062',
        tag: 'PANS',
        abstract: 'קריטריוני האבחון הרשמיים ל-PANS — מאמר הייחוס המרכזי. מגדיר תחילה פתאומית, OCD/הגבלות מזון ו-2+ תסמינים נוספים.',
    },
    {
        title: 'Pediatric Autoimmune Neuropsychiatric Disorders Associated with Streptococcal Infections: Clinical Description of the First 50 Cases',
        authors: 'Swedo SE, Leonard HL, Garvey M, et al.',
        journal: 'American Journal of Psychiatry',
        year: 1998,
        url: 'https://doi.org/10.1176/ajp.155.2.264',
        tag: 'PANDAS',
        abstract: 'המאמר המקורי שהגדיר PANDAS — 50 המקרים הראשונים, קשר ל-Strep, תגובה לאנטיביוטיקה.',
    },
    {
        title: 'Randomized Controlled Trial of Plasma Exchange, IVIG, and Placebo in Pediatric OCD-PANDAS',
        authors: 'Perlmutter SJ, Leitman SF, Garvey MA, et al.',
        journal: 'Lancet',
        year: 1999,
        url: 'https://doi.org/10.1016/S0140-6736(98)09413-3',
        tag: 'טיפול',
        tagColor: '#1565c0',
        abstract: 'מחקר RCT כפול-סמיות: פלסמהפרזה ו-IVIG יעילים משמעותית בהפחתת תסמיני OCD ב-PANDAS לעומת פלסבו.',
    },
    {
        title: 'Neuropsychiatric Symptoms in Children with Anti-N-Methyl-D-Aspartate Receptor Encephalitis',
        authors: 'Dalmau J, Gleichman AJ, Hughes EG, et al.',
        journal: 'Lancet Neurology',
        year: 2008,
        url: 'https://doi.org/10.1016/S1474-4422(08)70224-2',
        tag: 'PANS',
        abstract: 'Anti-NMDAR Encephalitis — סוג PANS שכיח עם נוגדנים ספציפיים. חשוב לאבחנה מבדלת.',
    },
    {
        title: 'A Clinical Case Series of Pediatric Acute-Onset Neuropsychiatric Syndrome Following Streptococcal Throat Infection',
        authors: 'Frankovich J, Thienemann M, Pearlstein J, et al.',
        journal: 'Journal of Pediatric Infectious Diseases Society',
        year: 2015,
        url: 'https://doi.org/10.1093/jpids/piu063',
        tag: 'PANDAS',
        abstract: 'סדרת מקרים מ-Stanford PANS Program — מאפייני מחלה, טיפולים ותוצאות ב-47 ילדים.',
    },
    {
        title: 'Anti-Basal Ganglia Antibodies in Acute Rheumatic Fever and Tourette Syndrome',
        authors: 'Kiessling LS, Marcotte AC, Culpepper L',
        journal: 'Journal of Child Neurology',
        year: 1994,
        url: 'https://doi.org/10.1177/088307389400900416',
        tag: 'מחקר בסיסי',
        tagColor: '#6a1b9a',
        abstract: 'אחד המאמרים הראשונים לתאר נוגדנים נגד גנגליה הבסיסיים בקשר ל-Strep — בסיס למנגנון האוטואימוני.',
    },
    {
        title: 'Long-term Antibiotic Prophylaxis for PANDAS: A Prospective Open-Label Study',
        authors: 'Snider LA, Lougee L, Slattery M, et al.',
        journal: 'Journal of Child and Adolescent Psychopharmacology',
        year: 2005,
        url: 'https://doi.org/10.1089/cap.2005.15.764',
        tag: 'טיפול',
        tagColor: '#1565c0',
        abstract: 'פרופילקסיס ארוך טווח עם Azithromycin ו-Penicillin V הפחית משמעותית אפיזודות PANDAS חוזרות.',
    },
    {
        title: 'Toward a Better Understanding of PANDAS, PANS, and Related Neuroimmune Disorders',
        authors: 'Chang K, Frankovich J, Bhatt A, et al.',
        journal: 'Pediatrics',
        year: 2015,
        url: 'https://doi.org/10.1542/peds.2014-1392',
        tag: 'סקירה',
        tagColor: '#2e7d32',
        abstract: 'סקירה מקיפה של הספרות המדעית — מחלוקות, הסכמות וכיווני מחקר עתידיים. מאמר הפניה חשוב.',
    },
];

// ── Page ──────────────────────────────────────────────────────────────────────
export const ArticlesPage: React.FC = () => {
    const [filter, setFilter] = useState<string>('הכל');
    const [pdfs, setPdfs] = useState<PdfEntry[]>([]);
    const [loadingPdfs, setLoadingPdfs] = useState(true);

    const tags = ['הכל', 'PANDAS', 'PANS', 'טיפול', 'סקירה', 'מחקר בסיסי'];
    const filtered = filter === 'הכל' ? ARTICLES : ARTICLES.filter(a => a.tag === filter);
    const openUrl = (url: string) => window.open(url, '_blank', 'noopener,noreferrer');

    useEffect(() => {
        const load = async () => {
            try {
                const db = getFirestore();
                const q = query(collection(db, 'pdf_articles'), orderBy('createdAt', 'desc'));
                const snap = await getDocs(q);
                setPdfs(snap.docs.map(d => ({ id: d.id, ...d.data() } as PdfEntry)));
            } catch (err) {
                console.error('Failed to load PDFs:', err);
            } finally {
                setLoadingPdfs(false);
            }
        };
        load();
    }, []);

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

                {/* ── Latest research cards ── */}
                <section className="resources-page__section">
                    <Container maxWidth="lg">
                        <Typography variant="h2" className="resources-page__section-title">
                            מאמרים אחרונים
                        </Typography>

                        <div className="resources-page__cards-row">
                            {loadingPdfs ? (
                                [1, 2, 3].map(i => (
                                    <article key={i} className="resources-page__card">
                                        <div className="resources-page__card-image">
                                            <Skeleton variant="rectangular" width="100%" height="100%" animation="wave" />
                                        </div>
                                        <Skeleton variant="text" width="80%" sx={{ mt: 1, mx: 1 }} />
                                    </article>
                                ))
                            ) : pdfs.length > 0 ? (
                                pdfs.map(pdf => (
                                    <article
                                        key={pdf.id}
                                        className="resources-page__card"
                                        onClick={() => openUrl(pdf.pdfUrl)}
                                        role="button"
                                        tabIndex={0}
                                    >
                                        <PdfThumbnail pdfUrl={pdf.pdfUrl} />
                                        <h3 className="resources-page__card-title">{pdf.title}</h3>
                                        {pdf.authors && (
                                            <p style={{ fontSize: '0.78rem', color: '#666', margin: '4px 12px 4px' }}>
                                                {pdf.authors}{pdf.year ? ` · ${pdf.year}` : ''}
                                            </p>
                                        )}
                                        {pdf.description && (
                                            <ExpandableText text={pdf.description} />
                                        )}
                                    </article>
                                ))
                            ) : (
                                <>
                                    <article className="resources-page__card" onClick={() => openUrl('/pdfs/ivig-pans-6mo.pdf')} role="button" tabIndex={0}>
                                        <div className="resources-page__card-image"><img src={research1} alt="מחקר IVIG" /></div>
                                        <h3 className="resources-page__card-title">טיפול IVIG מורחב מראה יעילות ב-21 צעירים עם PANS במשך 6 חודשים</h3>
                                    </article>
                                    <article className="resources-page__card" onClick={() => openUrl('/pdfs/ae-clinician-guide.pdf')} role="button" tabIndex={0}>
                                        <div className="resources-page__card-image"><img src={research2} alt="מדריך לרופאים" /></div>
                                        <h3 className="resources-page__card-title">דלקת מוח אוטואימונית: מדריך לרופאים לספקטרום הקליני, אבחון וניהול</h3>
                                    </article>
                                    <article className="resources-page__card" onClick={() => openUrl('/pdfs/infection-psych-children.pdf')} role="button" tabIndex={0}>
                                        <div className="resources-page__card-image"><img src={research3} alt="זיהומים ומחלות פסיכיאטריות" /></div>
                                        <h3 className="resources-page__card-title">כיצד זיהומים נפוצים יכולים לעורר מחלות פסיכיאטריות בילדים</h3>
                                    </article>
                                </>
                            )}
                        </div>
                    </Container>
                </section>

                {/* ── Filter chips ── */}
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

                {/* ── Articles list ── */}
                <Box className="prof-articles-list">
                    {filtered.map(a => (
                        <Box key={a.title} className="prof-article-card">
                            <Box className="prof-article-card__meta">
                                <Chip
                                    label={a.tag}
                                    size="small"
                                    style={{
                                        background: (a.tagColor || '#023373') + '18',
                                        color: a.tagColor || '#023373',
                                        fontWeight: 700,
                                    }}
                                />
                                <Typography className="prof-article-card__year">{a.year}</Typography>
                            </Box>
                            <Typography className="prof-article-card__title">{a.title}</Typography>
                            <Typography className="prof-article-card__authors">{a.authors}</Typography>
                            <Typography className="prof-article-card__journal" component="em">{a.journal}</Typography>
                            <Typography className="prof-article-card__abstract">{a.abstract}</Typography>
                            <a href={a.url} target="_blank" rel="noopener noreferrer" className="prof-article-card__link">
                                <ExternalIcon /><span>פתח מאמר (DOI)</span>
                            </a>
                        </Box>
                    ))}
                </Box>

                {/* ── Info banner ── */}
                <Box className="prof-info-banner" style={{ marginTop: 32 }}>
                    <InfoIcon className="prof-info-banner__icon" />
                    <Typography className="prof-info-banner__text">
                        לרשימה מלאה של פרסומים:{' '}
                        <a href="https://neuroimmune.org/clinicians/pans-pandas-publications-and-research/" target="_blank" rel="noopener noreferrer">
                            Neuroimmune Foundation Publications
                        </a>{' '}·{' '}
                        <a href="https://www.pandasppn.org/research/" target="_blank" rel="noopener noreferrer">
                            PPN Research Library
                        </a>
                    </Typography>
                </Box>
            </Container>
        </Box>
    );
};

export default ArticlesPage;