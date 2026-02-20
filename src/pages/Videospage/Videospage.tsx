import React, { useState, useEffect } from 'react';
import { Box, Container, Typography, Tabs, Tab } from '@mui/material';
import { PlayCircle as PlayIcon, OpenInNew as ExternalIcon } from '@mui/icons-material';
import SupportTabs from '../../components/Support/SupportTabs/SupportTabs';
import './VideosPage.scss';

type AudienceType = 'parents' | 'clinicians' | 'educators';

interface VideoItem {
    id: string;
    type: 'youtube' | 'vimeo' | 'other';
    videoId?: string;       // real Vimeo or YouTube ID for thumbnail
    vimeoHash?: string;     // Vimeo private hash (after the slash in share URL)
    title: string;
    speaker?: string;
    source: string;
    duration?: string;
    audience: AudienceType[];
    url: string;
    description?: string;
    isHebrew?: boolean;
}

// ── Vimeo oEmbed thumbnail hook ───────────────────────────────────────────────
// Uses Vimeo's official public oEmbed API (no key needed, CORS-enabled)
// For private videos with hash, pass the full share URL
const useVimeoThumb = (video: VideoItem) => {
    const [thumb, setThumb] = useState<string | null>(null);

    useEffect(() => {
        if (video.type !== 'vimeo' || !video.videoId) return;
        let cancelled = false;

        // Build the video URL — include hash for private videos
        const vimeoUrl = video.vimeoHash
            ? `https://vimeo.com/${video.videoId}/${video.vimeoHash}`
            : `https://vimeo.com/${video.videoId}`;

        fetch(`https://vimeo.com/api/oembed.json?url=${encodeURIComponent(vimeoUrl)}&width=640`)
            .then((r) => r.json())
            .then((data) => {
                if (!cancelled && data.thumbnail_url) {
                    // Strip size suffix to get the base URL, then request 640-wide
                    const base = data.thumbnail_url.replace(/_\d+x\d+$/, '');
                    setThumb(`${base}_640`);
                }
            })
            .catch(() => { });

        return () => { cancelled = true; };
    }, [video.videoId, video.vimeoHash, video.type]);

    return thumb;
};

// ── Video data ─────────────────────────────────────────────────────────────────
// Sources:
//  - YouTube: f-rzmlrnfaA  (verified live from pandasnetwork.org)
//  - Vimeo IDs from Neuroimmune Foundation (public share links, thumbnails work via oEmbed)
//  - PANDAS Network private Vimeo videos: linked to PANDAS Network page, not vimeo.com directly
const VIDEOS: VideoItem[] = [
    // ── YouTube (1 confirmed working) ──────────────────────────────────────────
    {
        id: 'v1',
        type: 'youtube',
        videoId: 'f-rzmlrnfaA',
        title: 'פלנרי: חוטים משותפים במחלות מוח אוטואימוניות',
        speaker: 'Common Threads Conference — מומחים בינלאומיים',
        source: 'PANDAS Network',
        duration: '90 דק׳',
        audience: ['clinicians', 'parents'],
        url: 'https://www.youtube.com/watch?v=f-rzmlrnfaA',
        description: 'שולחן עגול רב-תחומי על חוטים משותפים בין מחלות דלקת-מוחית אוטואימונית הנגרמות מזיהומים',
    },

    // ── Neuroimmune Foundation webinars — real Vimeo IDs with hash (share links) ─
    {
        id: 'v2',
        type: 'vimeo',
        videoId: '842327371',
        vimeoHash: 'e97025b4e4',
        title: 'הבנת התרופות המשמשות ב-PANS/PANDAS',
        speaker: 'Erica Guetzlaff, PharmD',
        source: 'Neuroimmune Foundation',
        duration: '60 דק׳',
        audience: ['parents', 'clinicians'],
        url: 'https://vimeo.com/842327371/e97025b4e4?share=copy',
        description: 'פרמקולוגיה בסיסית, עלות ושימוש בתרופות פסיכיאטריות הנפוצות בטיפול ב-PANS — פרסנטציה ברמה המתאימה להורים',
    },
    {
        id: 'v3',
        type: 'vimeo',
        videoId: '843092519',
        vimeoHash: '27e9105e87',
        title: 'עדכון על פאנל קנינגהם ומחקרים קשורים',
        speaker: 'ד"ר מדלן קנינגהם, PhD',
        source: 'Neuroimmune Foundation',
        duration: '60 דק׳',
        audience: ['parents', 'clinicians'],
        url: 'https://vimeo.com/843092519/27e9105e87?share=copy',
        description: 'פאנל קנינגהם לאבחון PANDAS — מה הוא בודק, איך לפרש תוצאות, ומה חדש במחקר הנוגדנים האנטי-נוירונליים',
    },
    {
        id: 'v4',
        type: 'vimeo',
        videoId: '554034011',
        vimeoHash: '82cb397369',
        title: 'ראומטולוגיה ופסיכיאטריה — מה אפשר ללמוד ממחלות חופפות',
        speaker: 'ד"ר ג׳ניפר פרנקוביץ׳, Stanford',
        source: 'Neuroimmune Foundation',
        duration: '55 דק׳',
        audience: ['clinicians', 'parents'],
        url: 'https://vimeo.com/554034011/82cb397369?share=copy',
        description: 'ד"ר פרנקוביץ׳ מ-Stanford PANS Program מסבירה את הקשר בין מחלות ראומטולוגיות לסימפטומים פסיכיאטריים',
    },
    {
        id: 'v5',
        type: 'vimeo',
        videoId: '713882840',
        vimeoHash: 'a0b0763c38',
        title: 'PTSD אצל הורים לילדים עם PANS',
        speaker: 'ד"ר מרגו טיינמן, Stanford',
        source: 'Neuroimmune Foundation',
        duration: '60 דק׳',
        audience: ['parents'],
        url: 'https://vimeo.com/713882840/a0b0763c38?share=copy',
        description: 'עומס הטיפול, בידוד והתמודדות עם טראומה — וגם: פרוטוקול פסיכותרפיה קבוצתית שפותח במיוחד להורים לילדים עם PANS',
    },
    {
        id: 'v6',
        type: 'vimeo',
        videoId: '843760067',
        vimeoHash: '4d4380cc96',
        title: 'זיהוי וטיפול בטראומה אצל אחים',
        speaker: 'Eileen Devine, LCSW',
        source: 'Neuroimmune Foundation',
        duration: '60 דק׳',
        audience: ['parents'],
        url: 'https://vimeo.com/843760067/4d4380cc96?share=copy',
        description: 'מה עוברים האחים? כיצד להגן עליהם מפני טראומה תוך שמירה על כל הילדים — כלים מעשיים להורים',
    },
    {
        id: 'v7',
        type: 'vimeo',
        videoId: '841746672',
        vimeoHash: '903395ffec',
        title: 'EMDR 101 למשפחות ילדים עם PANS/PANDAS',
        speaker: 'Tina Motley, LCSW',
        source: 'Neuroimmune Foundation',
        duration: '60 דק׳',
        audience: ['parents'],
        url: 'https://player.vimeo.com/video/841746672?h=903395ffec',
        description: 'המדע שמאחורי טיפול EMDR לטיפול בטראומת הורים — מה זה, איך זה עובד ולמה זה רלוונטי',
    },
    // ── Israeli Hebrew webinar ─────────────────────────────────────────────────
    {
        id: 'v8',
        type: 'other',
        title: 'התערבות רפואית ב-PANDAS — לגורמים ולהורים',
        speaker: 'ד"ר יובל שפריר, ד"ר אודליה גרטל קריביל',
        source: 'ETI Training',
        duration: '90 דק׳',
        audience: ['parents', 'clinicians'],
        url: 'https://www.eti.training/pandasqa?wix-vod-video-id=1a107db5024a4c9792edc394a62eab2a&wix-vod-comp-id=comp-ki66gjrn',
        description: 'ווובינר ישראלי! ד"ר שפריר מהנוירולוגיה עם ד"ר גרטל קריביל — התערבויות רפואיות ופסיכולוגיות ב-PANDAS',
        isHebrew: true,
    },
    // ── PANDAS Network — old private Vimeo → link to archive page ─────────────
    {
        id: 'v9',
        type: 'youtube',
        videoId: 'ktsGYtzU9qk',
        title: 'PANS/PANDAS בכיתה — מדריך מעשי למחנכים',
        speaker: 'Dr Jennifer Barr',
        source: 'Neuroimmune Foundation',
        duration: '26 דק׳',
        audience: ['educators', 'parents'],
        url: 'https://youtu.be/ktsGYtzU9qk?si=RzIkjcUdH9gsTaxV',
        description: 'זיהוי, התאמות ותמיכה בתלמידים עם PANS/PANDAS — מדריך פרקטי לצוות החינוך',
    },
    {
        id: 'v10',
        type: 'youtube',
        videoId: '-5Rew0NpEEQ',
        title: 'ניהול התנהגות מפריעה בבית ובמסגרות חינוכיות | ניהול PANDAS/PANS',
        speaker: 'Patricia Doran, Heather Korbmacher, Jan Tona',
        source: 'PANDAS Network',
        duration: '32 דק׳',
        audience: ['educators', 'parents'],
        url: 'https://www.youtube.com/watch?v=-5Rew0NpEEQ',
        description: 'בסרטון זה מוצגות אסטרטגיות לניהול התנהגות מפריעה בבית ובבית הספר...',
    },
    {
        id: 'v11',
        type: 'youtube',
        videoId: 'jqFX9Y6ndEM',
        title: 'PANS/PANDAS במסגרת בית־הספר',
        speaker: 'Various Speakers',
        source: 'PANDAS Network',
        duration: '32 דק׳',
        audience: ['educators', 'parents'],
        url: 'https://www.youtube.com/watch?v=jqFX9Y6ndEM',
        description: 'מצגת על PANS/PANDAS בהקשר חינוכי ויישומי בהכשרת צוותי חינוך',
    }
];

const AUDIENCE_LABELS: Record<AudienceType, string> = {
    parents: 'להורים',
    clinicians: 'לאנשי מקצוע',
    educators: 'למחנכים',
};

const AUDIENCE_TABS = [
    { value: 'all', label: 'הכל' },
    { value: 'parents', label: 'להורים' },
    { value: 'clinicians', label: 'לאנשי מקצוע' },
    { value: 'educators', label: 'למחנכים' },
] as const;

// ── Video Card ────────────────────────────────────────────────────────────────
const VideoCard: React.FC<{ video: VideoItem }> = ({ video }) => {
    const vimeoThumb = useVimeoThumb(video);
    const [imgError, setImgError] = useState(false);

    const thumbUrl =
        video.type === 'youtube' && video.videoId
            ? `https://img.youtube.com/vi/${video.videoId}/mqdefault.jpg`
            : video.type === 'vimeo'
                ? vimeoThumb
                : null;

    const showPlaceholder = !thumbUrl || imgError;

    return (
        <a href={video.url} target="_blank" rel="noopener noreferrer" className="video-card">
            <div className="video-card__thumb">
                {!showPlaceholder ? (
                    <img
                        src={thumbUrl!}
                        alt={video.title}
                        loading="lazy"
                        onError={() => setImgError(true)}
                    />
                ) : (
                    <div className={`video-card__placeholder video-card__placeholder--${video.type}`}>
                        <PlayIcon className="video-card__placeholder-icon" />
                    </div>
                )}
                <div className="video-card__play-btn">
                    <PlayIcon />
                </div>
                {video.duration && (
                    <span className="video-card__duration">{video.duration}</span>
                )}
                {video.type === 'youtube' && (
                    <span className="video-card__platform video-card__platform--yt">YouTube</span>
                )}
                {video.type === 'vimeo' && (
                    <span className="video-card__platform video-card__platform--vimeo">Vimeo</span>
                )}
                {video.isHebrew && (
                    <span className="video-card__platform video-card__platform--he">🇮🇱 עברית</span>
                )}
            </div>

            <div className="video-card__body">
                <div className="video-card__badges">
                    {video.audience.map((a) => (
                        <span key={a} className={`video-card__badge video-card__badge--${a}`}>
                            {AUDIENCE_LABELS[a]}
                        </span>
                    ))}
                </div>
                <h3 className="video-card__title">{video.title}</h3>
                {video.speaker && <p className="video-card__speaker">{video.speaker}</p>}
                {video.description && <p className="video-card__desc">{video.description}</p>}
                <div className="video-card__footer">
                    <span className="video-card__source">{video.source}</span>
                    <ExternalIcon className="video-card__external" />
                </div>
            </div>
        </a>
    );
};

// ── Page ──────────────────────────────────────────────────────────────────────
const VideosPage: React.FC = () => {
    const [audience, setAudience] = useState<'all' | AudienceType>('all');

    const filtered =
        audience === 'all'
            ? VIDEOS
            : VIDEOS.filter((v) => v.audience.includes(audience as AudienceType));

    return (
        <Box className="videos-page" dir="rtl">
            <Box className="videos-page__hero">
                <Container maxWidth="lg" className="videos-page__hero-content">
                    <Typography variant="overline" className="videos-page__hero-label">
                        תמיכה וקהילה
                    </Typography>
                    <Typography variant="h1" className="videos-page__hero-title">
                        סרטונים ווובינרים
                    </Typography>
                    <Typography className="videos-page__hero-desc">
                        הרצאות מומחים, עדויות משפחות וסרטוני הדרכה על PANS/PANDAS — חינמיים ופתוחים לכולם
                    </Typography>
                </Container>
            </Box>

            <SupportTabs />

            <Box className="videos-page__filter-bar">
                <Container maxWidth="lg" className="videos-page__filter-inner">
                    <Tabs
                        value={audience}
                        onChange={(_, v) => setAudience(v)}
                        variant="scrollable"
                        scrollButtons="auto"
                        allowScrollButtonsMobile
                        centered
                        className="videos-page__filter-tabs"
                    >
                        {AUDIENCE_TABS.map((t) => (
                            <Tab key={t.value} value={t.value} label={t.label} className="videos-page__filter-tab" />
                        ))}
                    </Tabs>
                    <Typography className="videos-page__count">{filtered.length} סרטונים</Typography>
                </Container>
            </Box>

            <Container maxWidth="lg" sx={{ py: 5 }}>
                <div className="videos-page__grid">
                    {filtered.map((v) => (<VideoCard key={v.id} video={v} />))}
                </div>

                <div className="videos-page__more">
                    <Typography variant="h5" className="videos-page__more-title">מאגרים נוספים</Typography>
                    <div className="videos-page__more-links">
                        {[
                            { label: 'Neuroimmune Foundation — ווובינרים למשפחות', url: 'https://neuroimmune.org/patient-and-family-resources/pans-pandas-webinars/' },
                            { label: 'PANDAS Network — ארכיון סרטונים ווובינרים', url: 'https://pandasnetwork.org/resources/archive/videos/' },
                            { label: 'PPN — Presentations & Videos', url: 'https://www.pandasppn.org/presentations/' },
                            { label: 'ASPIRE — Webinar Library', url: 'https://aspire.care/resources/aspire-pans-pandas-webinars/' },
                        ].map((link) => (
                            <a key={link.url} href={link.url} target="_blank" rel="noopener noreferrer" className="videos-page__more-link">
                                <ExternalIcon />
                                <span>{link.label}</span>
                            </a>
                        ))}
                    </div>
                </div>
            </Container>
        </Box>
    );
};

export default VideosPage;