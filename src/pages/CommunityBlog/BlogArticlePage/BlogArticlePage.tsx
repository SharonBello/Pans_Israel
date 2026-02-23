import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { FiArrowRight, FiUser, FiTag, FiCalendar, FiMessageCircle } from 'react-icons/fi';
import { getArticleById } from '../../../services/blogService';
import type { Article } from '../../../types/blog';
import CommentSection from '../../../components/blog/CommentSection/CommentSection';
import './BlogArticlePage.scss';

const formatDate = (ts: any): string => {
    if (!ts) return '';
    const date = ts.toDate ? ts.toDate() : new Date(ts);
    return date.toLocaleDateString('he-IL', { year: 'numeric', month: 'long', day: 'numeric' });
};

const BlogArticlePage: React.FC = () => {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();
    const [article, setArticle] = useState<Article | null>(null);
    const [loading, setLoading] = useState(true);
    const [notFound, setNotFound] = useState(false);

    useEffect(() => {
        if (!id) { setNotFound(true); setLoading(false); return; }
        getArticleById(id)
            .then(data => { if (!data || !data.published) setNotFound(true); else setArticle(data); })
            .catch(() => setNotFound(true))
            .finally(() => setLoading(false));
    }, [id]);

    if (loading) return <div className="blog-article-page blog-article-page--loading" dir="rtl"><div className="blog-article-page__spinner" /></div>;
    if (notFound || !article) return (
        <div className="blog-article-page blog-article-page--not-found" dir="rtl">
            <h1>המאמר לא נמצא</h1>
            <button type="button" onClick={() => navigate('/community/articles')}>חזרה לכל המאמרים</button>
        </div>
    );

    return (
        <div className="blog-article-page" dir="rtl">
            {article.coverImage && (
                <div className="blog-article-page__cover">
                    <img src={article.coverImage} alt={article.title} />
                    <div className="blog-article-page__cover-overlay" />
                </div>
            )}
            <div className="blog-article-page__container">
                <button type="button" className="blog-article-page__back" onClick={() => navigate('/community/articles')}>
                    <FiArrowRight size={16} />כל המאמרים
                </button>
                <header className="blog-article-page__header">
                    <span className="blog-article-page__category">{article.category}</span>
                    <h1 className="blog-article-page__title">{article.title}</h1>
                    <p className="blog-article-page__summary">{article.summary}</p>
                    <div className="blog-article-page__meta">
                        <span className="blog-article-page__meta-item"><FiUser size={14} /><strong>{article.author}</strong>{article.authorRole && <span className="blog-article-page__author-role"> · {article.authorRole}</span>}</span>
                        <span className="blog-article-page__meta-item"><FiCalendar size={14} />{formatDate(article.createdAt)}</span>
                        <span className="blog-article-page__meta-item"><FiMessageCircle size={14} />{article.commentCount} תגובות</span>
                    </div>
                    {article.tags && article.tags.length > 0 && (
                        <div className="blog-article-page__tags">
                            <FiTag size={13} />
                            {article.tags.map(tag => <span key={tag} className="blog-article-page__tag">{tag}</span>)}
                        </div>
                    )}
                </header>
                <article className="blog-article-page__body">
                    <div className="blog-article-page__content" dangerouslySetInnerHTML={{ __html: article.content }} />
                </article>
                <CommentSection articleId={article.id} articleTitle={article.title} />
            </div>
        </div>
    );
};

export default BlogArticlePage;