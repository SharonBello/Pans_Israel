import React, { useEffect, useState, useMemo } from 'react';
import { FiExternalLink, FiSearch, FiFilter } from 'react-icons/fi';
import { MdNewspaper } from 'react-icons/md';
import { FaYoutube, FaFacebook, FaTiktok } from 'react-icons/fa';
import { getPublishedArticles } from '../../services/mediaArticleService';
import type { MediaArticle, MediaArticleCategory, MediaType } from '../../types/mediaArticle';
import { CATEGORY_LABELS, CATEGORY_COLORS, MEDIA_TYPE_COLORS, } from '../../types/mediaArticle';
import SupportTabs from '../../components/Support/SupportTabs/SupportTabs';
import './MediaCoveragePage.scss';
import { detectMediaType, getFacebookEmbedUrl, getTikTokEmbedUrl, getYouTubeEmbedUrl } from './MediaArticleFormData';

// ── Helpers ──────────────────────────────────────────────────────────────────
const formatDateHebrew = (iso: string): string => {
    try {
        return new Date(iso).toLocaleDateString('he-IL', {
            year: 'numeric', month: 'long', day: 'numeric',
        });
    } catch { return iso; }
};

const PUB_COLORS: Record<string, string> = {
    ynet: '#e8192c', 'מאקו': '#ff6600', 'הארץ': '#1a3a6b',
    'ידיעות אחרונות': '#003580', 'וואלה': '#6600cc',
    'ישראל היום': '#c8102e', 'כאן': '#0057a8',
};

const MediaTypeIcon: React.FC<{ type: MediaType; size?: string }> = ({ type, size = '1rem' }) => {
    const style = { fontSize: size, color: MEDIA_TYPE_COLORS[type] };
    switch (type) {
        case 'youtube': return <FaYoutube style={style} />;
        case 'facebook': return <FaFacebook style={style} />;
        case 'tiktok': return <FaTiktok style={style} />;
        default: return <MdNewspaper style={style} />;
    }
};

// ── YouTube Card ─────────────────────────────────────────────────────────────
const YouTubeCard: React.FC<{ article: MediaArticle }> = ({ article }) => {
    const embedUrl = getYouTubeEmbedUrl(article.url);
    return (
        <div className="mcp__card mcp__card--embed">
            <div className="mcp__card-embed-wrap mcp__card-embed-wrap--video">
                {embedUrl ? (
                    <iframe
                        src={embedUrl}
                        title={article.title}
                        frameBorder="0"
                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                        allowFullScreen
                        loading="lazy"
                    />
                ) : (
                    <a href={article.url} target="_blank" rel="noopener noreferrer" className="mcp__card-embed-fallback">
                        <FaYoutube className="mcp__card-embed-icon" />
                        <span>פתח ב-YouTube</span>
                    </a>
                )}
            </div>
            <div className="mcp__card-body">
                <div className="mcp__card-meta">
                    <span className="mcp__card-type" style={{ color: MEDIA_TYPE_COLORS.youtube }}>
                        <FaYoutube /> YouTube
                    </span>
                    <span className="mcp__card-date">{formatDateHebrew(article.datePublished)}</span>
                </div>
                {article.title && <h3 className="mcp__card-title">{article.title}</h3>}
                {article.summary && <p className="mcp__card-summary">{article.summary}</p>}
                <a href={article.url} target="_blank" rel="noopener noreferrer" className="mcp__card-link">
                    צפה ב-YouTube <FiExternalLink />
                </a>
            </div>
        </div>
    );
};

// ── TikTok Card ──────────────────────────────────────────────────────────────
const TikTokCard: React.FC<{ article: MediaArticle }> = ({ article }) => {
    const embedUrl = getTikTokEmbedUrl(article.url);
    return (
        <div className="mcp__card mcp__card--embed mcp__card--tiktok">
            <div className="mcp__card-embed-wrap mcp__card-embed-wrap--tiktok">
                {embedUrl ? (
                    <iframe
                        src={embedUrl}
                        title={article.title || 'TikTok video'}
                        frameBorder="0"
                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope"
                        allowFullScreen
                        loading="lazy"
                    />
                ) : (
                    <a href={article.url} target="_blank" rel="noopener noreferrer" className="mcp__card-embed-fallback mcp__card-embed-fallback--tiktok">
                        <FaTiktok className="mcp__card-embed-icon" />
                        <span>פתח ב-TikTok</span>
                    </a>
                )}
            </div>
            <div className="mcp__card-body">
                <div className="mcp__card-meta">
                    <span className="mcp__card-type" style={{ color: MEDIA_TYPE_COLORS.tiktok }}>
                        <FaTiktok /> TikTok
                    </span>
                    <span className="mcp__card-date">{formatDateHebrew(article.datePublished)}</span>
                </div>
                {article.title && <h3 className="mcp__card-title">{article.title}</h3>}
                <a href={article.url} target="_blank" rel="noopener noreferrer" className="mcp__card-link">
                    צפה ב-TikTok <FiExternalLink />
                </a>
            </div>
        </div>
    );
};

// ── Facebook Card ────────────────────────────────────────────────────────────
const FacebookCard: React.FC<{ article: MediaArticle }> = ({ article }) => {
    const embedUrl = getFacebookEmbedUrl(article.url);
    return (
        <div className="mcp__card mcp__card--embed mcp__card--facebook">
            <div className="mcp__card-embed-wrap mcp__card-embed-wrap--facebook">
                <iframe
                    src={embedUrl}
                    title={article.title || 'Facebook post'}
                    frameBorder="0"
                    allow="autoplay; clipboard-write; encrypted-media; picture-in-picture; web-share"
                    allowFullScreen
                    loading="lazy"
                    scrolling="no"
                />
            </div>
            <div className="mcp__card-body">
                <div className="mcp__card-meta">
                    <span className="mcp__card-type" style={{ color: MEDIA_TYPE_COLORS.facebook }}>
                        <FaFacebook /> Facebook
                    </span>
                    <span className="mcp__card-date">{formatDateHebrew(article.datePublished)}</span>
                </div>
                {article.title && <h3 className="mcp__card-title">{article.title}</h3>}
                <a href={article.url} target="_blank" rel="noopener noreferrer" className="mcp__card-link">
                    צפה בפייסבוק <FiExternalLink />
                </a>
            </div>
        </div>
    );
};

// ── Article Card ──────────────────────────────────────────────────────────────
const ArticleCard: React.FC<{ article: MediaArticle }> = ({ article }) => {
    const [imgError, setImgError] = useState(false);
    const pubColor = PUB_COLORS[article.publication] || '#023373';
    const catColor = CATEGORY_COLORS[article.category] || '#023373';

    return (
        <a className="mcp__card" href={article.url} target="_blank" rel="noopener noreferrer">
            <div className="mcp__card-thumb">
                {article.thumbnailUrl && !imgError ? (
                    <img src={article.thumbnailUrl} alt={article.title} onError={() => setImgError(true)} loading="lazy" />
                ) : (
                    <div className="mcp__card-thumb-fallback" style={{ background: pubColor }}>
                        <MdNewspaper />
                    </div>
                )}
                <span className="mcp__card-category" style={{ background: catColor }}>
                    {CATEGORY_LABELS[article.category]}
                </span>
            </div>
            <div className="mcp__card-body">
                <div className="mcp__card-meta">
                    <span className="mcp__card-pub" style={{ color: pubColor }}>{article.publication}</span>
                    <span className="mcp__card-date">{formatDateHebrew(article.datePublished)}</span>
                </div>
                <h3 className="mcp__card-title">{article.title}</h3>
                <p className="mcp__card-summary">{article.summary}</p>
                <span className="mcp__card-link">קרא כתבה מלאה <FiExternalLink /></span>
            </div>
        </a>
    );
};

// ── Smart Card Router ─────────────────────────────────────────────────────────
const MediaCard: React.FC<{ article: MediaArticle }> = ({ article }) => {
    const type = article.mediaType || detectMediaType(article.url);
    switch (type) {
        case 'youtube': return <YouTubeCard article={article} />;
        case 'tiktok': return <TikTokCard article={article} />;
        case 'facebook': return <FacebookCard article={article} />;
        default: return <ArticleCard article={article} />;
    }
};

// ── Type filter buttons config ────────────────────────────────────────────────
const TYPE_FILTERS: { id: MediaType | 'all'; label: string; icon: React.ReactNode }[] = [
    { id: 'all', label: 'הכל', icon: null },
    { id: 'article', label: 'כתבות', icon: <MdNewspaper /> },
    { id: 'youtube', label: 'YouTube', icon: <FaYoutube /> },
    { id: 'facebook', label: 'Facebook', icon: <FaFacebook /> },
    { id: 'tiktok', label: 'TikTok', icon: <FaTiktok /> },
];

// ── Main Page ─────────────────────────────────────────────────────────────────
const MediaCoveragePage: React.FC = () => {
    const [articles, setArticles] = useState<MediaArticle[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(false);
    const [search, setSearch] = useState('');
    const [activeType, setActiveType] = useState<MediaType | 'all'>('all');
    const [activeCategory, setActiveCategory] = useState<MediaArticleCategory | 'all'>('all');

    useEffect(() => {
        setLoading(true);
        getPublishedArticles()
            .then(setArticles)
            .catch(() => setError(true))
            .finally(() => setLoading(false));
    }, []);

    const availableCategories = useMemo(() => {
        const cats = new Set(
            articles
                .filter(a => (a.mediaType || detectMediaType(a.url)) === 'article')
                .map(a => a.category)
        );
        return Array.from(cats) as MediaArticleCategory[];
    }, [articles]);

    // Count per type for badges
    const typeCounts = useMemo(() => {
        const counts: Record<string, number> = { all: articles.length };
        articles.forEach(a => {
            const t = a.mediaType || detectMediaType(a.url);
            counts[t] = (counts[t] || 0) + 1;
        });
        return counts;
    }, [articles]);

    const filtered = useMemo(() => {
        return articles.filter(a => {
            const type = a.mediaType || detectMediaType(a.url);
            const matchType = activeType === 'all' || type === activeType;
            const matchCat = activeCategory === 'all' || a.category === activeCategory;
            const q = search.toLowerCase();
            const matchSearch = !q ||
                a.title?.toLowerCase().includes(q) ||
                a.summary?.toLowerCase().includes(q) ||
                a.publication?.toLowerCase().includes(q);
            return matchType && matchCat && matchSearch;
        });
    }, [articles, activeType, activeCategory, search]);

    // Separate embeds from articles for layout
    const articleItems = filtered.filter(a => (a.mediaType || detectMediaType(a.url)) === 'article');
    const embedItems = filtered.filter(a => (a.mediaType || detectMediaType(a.url)) !== 'article');

    return (
        <div className="mcp" dir="rtl">

            {/* ── Hero ── */}
            <section className="mcp__hero">
                <div className="mcp__hero-glow mcp__hero-glow--1" />
                <div className="mcp__hero-glow mcp__hero-glow--2" />
                <div className="mcp__hero-inner">
                    <div className="mcp__hero-icon-wrap"><MdNewspaper /></div>
                    <span className="mcp__hero-label">PANS / PANDAS בתקשורת</span>
                    <h1 className="mcp__hero-title">מדיה וכתבות</h1>
                    <p className="mcp__hero-subtitle">
                        כתבות, סרטונים ותכנים מהתקשורת הישראלית והרשתות החברתיות על PANS ו-PANDAS
                    </p>
                </div>
            </section>

            <SupportTabs />

            {/* ── Type filter bar ── */}
            <div className="mcp__type-bar">
                {TYPE_FILTERS.map(tf => {
                    const count = typeCounts[tf.id] || 0;
                    if (tf.id !== 'all' && count === 0) return null;
                    const color = tf.id !== 'all' ? MEDIA_TYPE_COLORS[tf.id as MediaType] : '#023373';
                    return (
                        <button
                            key={tf.id}
                            className={`mcp__type-btn ${activeType === tf.id ? 'mcp__type-btn--active' : ''}`}
                            style={activeType === tf.id ? { background: color, borderColor: color } : {}}
                            onClick={() => { setActiveType(tf.id as MediaType | 'all'); setActiveCategory('all'); }}
                        >
                            {tf.icon && <span className="mcp__type-btn-icon">{tf.icon}</span>}
                            {tf.label}
                            <span className="mcp__type-btn-count">{count}</span>
                        </button>
                    );
                })}
            </div>

            {/* ── Search + category filters (articles only) ── */}
            <div className="mcp__controls">
                <div className="mcp__search-wrap">
                    <FiSearch className="mcp__search-icon" />
                    <input
                        className="mcp__search"
                        type="search"
                        placeholder="חיפוש..."
                        value={search}
                        onChange={e => setSearch(e.target.value)}
                        dir="rtl"
                    />
                </div>
                {(activeType === 'all' || activeType === 'article') && availableCategories.length > 0 && (
                    <div className="mcp__filters">
                        <FiFilter className="mcp__filter-icon" />
                        <button
                            className={`mcp__filter-btn ${activeCategory === 'all' ? 'mcp__filter-btn--active' : ''}`}
                            onClick={() => setActiveCategory('all')}
                        >הכל</button>
                        {availableCategories.map(cat => (
                            <button
                                key={cat}
                                className={`mcp__filter-btn ${activeCategory === cat ? 'mcp__filter-btn--active' : ''}`}
                                style={activeCategory === cat ? { background: CATEGORY_COLORS[cat], borderColor: CATEGORY_COLORS[cat] } : {}}
                                onClick={() => setActiveCategory(cat)}
                            >
                                {CATEGORY_LABELS[cat]}
                            </button>
                        ))}
                    </div>
                )}
            </div>

            {/* ── Content ── */}
            <div className="mcp__content">
                {loading && (
                    <div className="mcp__loading"><div className="mcp__spinner" /><span>טוען תכנים...</span></div>
                )}
                {error && <div className="mcp__error">אירעה שגיאה בטעינת התכנים. אנא נסו שוב מאוחר יותר.</div>}

                {!loading && !error && filtered.length === 0 && (
                    <div className="mcp__empty">לא נמצאו תכנים התואמים את הסינון.</div>
                )}

                {!loading && !error && filtered.length > 0 && (
                    <>
                        <p className="mcp__count">{filtered.length} פריטים</p>

                        {/* Embeds section (YouTube / TikTok / Facebook) */}
                        {embedItems.length > 0 && (
                            <div className="mcp__section">
                                {(activeType === 'all') && (
                                    <h2 className="mcp__section-title">סרטונים ותכנים חברתיים</h2>
                                )}
                                <div className="mcp__embed-grid">
                                    {embedItems.map(a => <MediaCard key={a.id} article={a} />)}
                                </div>
                            </div>
                        )}

                        {/* Articles section */}
                        {articleItems.length > 0 && (
                            <div className="mcp__section">
                                {(activeType === 'all') && embedItems.length > 0 && (
                                    <h2 className="mcp__section-title">כתבות בתקשורת</h2>
                                )}
                                <div className="mcp__grid">
                                    {articleItems.map(a => <MediaCard key={a.id} article={a} />)}
                                </div>
                            </div>
                        )}
                    </>
                )}
            </div>
        </div>
    );
};

export default MediaCoveragePage;