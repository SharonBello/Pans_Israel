import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FiArrowLeft, FiMessageCircle } from 'react-icons/fi';
import { getFeaturedArticle } from '../../../services/blogService';
import type { Article } from '../../../types/blog';
import './LatestArticleWidget.scss';

const formatDate = (ts: any): string => {
    if (!ts) return '';
    const date = ts.toDate ? ts.toDate() : new Date(ts);
    return date.toLocaleDateString('he-IL', { year: 'numeric', month: 'long', day: 'numeric' });
};

const LatestArticleWidget: React.FC = () => {
    const [article, setArticle] = useState<Article | null>(null);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();

    useEffect(() => {
        getFeaturedArticle().then(setArticle).catch(() => { }).finally(() => setLoading(false));
    }, []);

    if (loading || !article) return null;

    return (
        <section className="latest-article-widget" dir="rtl" aria-label="מאמר מומלץ">
            <div className="latest-article-widget__inner">
                {/* <div className="latest-article-widget__label">
                    <span className="latest-article-widget__dot" />
                    מאמר מומלץ מהקהילה
                </div> */}
                <div
                    className="latest-article-widget__card"
                    onClick={() => navigate(`/community/articles/${article.id}`)}
                    role="button" tabIndex={0}
                    onKeyDown={e => e.key === 'Enter' && navigate(`/community/articles/${article.id}`)}
                >
                    {article.coverImage && (
                        <div className="latest-article-widget__img-wrap">
                            <img src={article.coverImage} alt={article.title} />
                        </div>
                    )}
                    <div className="latest-article-widget__content">
                        <span className="latest-article-widget__category">{article.category}</span>
                        <h3 className="latest-article-widget__title">{article.title}</h3>
                        <p className="latest-article-widget__summary">{article.summary}</p>
                        <div className="latest-article-widget__meta">
                            <span>{article.author}</span><span>·</span>
                            <span>{formatDate(article.createdAt)}</span><span>·</span>
                            <span className="latest-article-widget__comments">
                                <FiMessageCircle size={13} />{article.commentCount}
                            </span>
                        </div>
                        <button className="latest-article-widget__cta" onClick={() => navigate(`/community/articles/${article.id}`)} type="button">
                            לקריאת המאמר המלא <FiArrowLeft size={14} />
                        </button>
                    </div>
                </div>
                <button className="latest-article-widget__all-link" onClick={() => navigate('/community/articles')} type="button">
                    לכל המאמרים של הקהילה <FiArrowLeft size={13} />
                </button>
            </div>
        </section>
    );
};

export default LatestArticleWidget;