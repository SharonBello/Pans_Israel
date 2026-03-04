// ==========================================================================
// FeaturedMediaWidget.tsx — הומפג׳ widget: כתבות בתקשורת
// Add to your HomeSections or wherever your homepage sections live
// ==========================================================================
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { MdNewspaper } from 'react-icons/md';
import { FiExternalLink, FiArrowLeft } from 'react-icons/fi';
import { getFeaturedArticles } from '../../services/mediaArticleService';
import type { MediaArticle } from '../../types/mediaArticle';
import { CATEGORY_LABELS, CATEGORY_COLORS } from '../../types/mediaArticle';
import './FeaturedMediaWidget.scss';

const formatDateHebrew = (iso: string): string => {
    try {
        return new Date(iso).toLocaleDateString('he-IL', {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
        });
    } catch {
        return iso;
    }
};

const PUB_COLORS: Record<string, string> = {
    ynet: '#e8192c',
    'מאקו': '#ff6600',
    'הארץ': '#1a3a6b',
    'ידיעות אחרונות': '#003580',
    'וואלה': '#6600cc',
    'ישראל היום': '#c8102e',
    'כאן': '#0057a8',
};

const FeaturedMediaWidget: React.FC = () => {
    const navigate = useNavigate();
    const [articles, setArticles] = useState<MediaArticle[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        getFeaturedArticles(3)
            .then(setArticles)
            .catch(() => { })
            .finally(() => setLoading(false));
    }, []);

    if (!loading && articles.length === 0) return null;

    return (
        <section className="fmw" dir="rtl">
            {/* Section header */}
            <div className="fmw__header">
                <div className="fmw__header-right">
                    <div className="fmw__icon-wrap">
                        <MdNewspaper />
                    </div>
                    <div>
                        <h2 className="fmw__title">PANS/PANDAS בתקשורת</h2>
                        <p className="fmw__subtitle">כתבות נבחרות מהתקשורת הישראלית</p>
                    </div>
                </div>
                <button className="fmw__see-all" onClick={() => navigate('/resources/media-coverage')}>
                    כל הכתבות <FiArrowLeft />
                </button>
            </div>

            {/* Cards */}
            {loading ? (
                <div className="fmw__loading">
                    <div className="fmw__spinner" />
                </div>
            ) : (
                <div className="fmw__grid">
                    {articles.map(article => {
                        const pubColor = PUB_COLORS[article.publication] || '#023373';
                        const catColor = CATEGORY_COLORS[article.category] || '#023373';
                        return (
                            <a
                                key={article.id}
                                className="fmw__card"
                                href={article.url}
                                target="_blank"
                                rel="noopener noreferrer"
                            >
                                {article.thumbnailUrl && (
                                    <div className="fmw__card-thumb">
                                        <img src={article.thumbnailUrl} alt={article.title} loading="lazy" />
                                    </div>
                                )}
                                <div className="fmw__card-body">
                                    <div className="fmw__card-meta">
                                        <span className="fmw__card-pub" style={{ color: pubColor }}>
                                            {article.publication}
                                        </span>
                                        <span className="fmw__card-cat" style={{ background: catColor }}>
                                            {CATEGORY_LABELS[article.category]}
                                        </span>
                                    </div>
                                    <h3 className="fmw__card-title">{article.title}</h3>
                                    <p className="fmw__card-date">{formatDateHebrew(article.datePublished)}</p>
                                    <span className="fmw__card-link">
                                        לכתבה המלאה <FiExternalLink />
                                    </span>
                                </div>
                            </a>
                        );
                    })}
                </div>
            )}
        </section>
    );
};

export default FeaturedMediaWidget;