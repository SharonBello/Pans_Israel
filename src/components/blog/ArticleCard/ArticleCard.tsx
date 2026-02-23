import React from 'react';
import { useNavigate } from 'react-router-dom';
import { FiArrowLeft, FiMessageCircle, FiUser, FiTag } from 'react-icons/fi';
import type { Article } from '../../../types/blog';
import './ArticleCard.scss';

interface Props {
    article: Article;
    featured?: boolean;
}

const formatDate = (ts: any): string => {
    if (!ts) return '';
    const date = ts.toDate ? ts.toDate() : new Date(ts);
    return date.toLocaleDateString('he-IL', { year: 'numeric', month: 'long', day: 'numeric' });
};

const ArticleCard: React.FC<Props> = ({ article, featured = false }) => {
    const navigate = useNavigate();
    const handleClick = () => navigate(`/community/articles/${article.id}`);

    return (
        <article
            className={`article-card${featured ? ' article-card--featured' : ''}`}
            onClick={handleClick}
            role="button"
            tabIndex={0}
            onKeyDown={e => e.key === 'Enter' && handleClick()}
            aria-label={`קרא את המאמר: ${article.title}`}
        >
            {article.coverImage && (
                <div className="article-card__image-wrap">
                    <img src={article.coverImage} alt={article.title} className="article-card__image" />
                </div>
            )}
            <div className="article-card__body">
                <span className="article-card__category">{article.category}</span>
                <h2 className={`article-card__title${featured ? ' article-card__title--featured' : ''}`}>
                    {article.title}
                </h2>
                <p className="article-card__summary">{article.summary}</p>
                <div className="article-card__meta">
                    <span className="article-card__meta-item">
                        <FiUser size={13} />
                        {article.author}
                        {article.authorRole && <span className="article-card__author-role"> · {article.authorRole}</span>}
                    </span>
                    <span className="article-card__meta-item">{formatDate(article.createdAt)}</span>
                    <span className="article-card__meta-item">
                        <FiMessageCircle size={13} />
                        {article.commentCount} תגובות
                    </span>
                </div>
                {article.tags && article.tags.length > 0 && (
                    <div className="article-card__tags">
                        <FiTag size={12} />
                        {article.tags.map(tag => (
                            <span key={tag} className="article-card__tag">{tag}</span>
                        ))}
                    </div>
                )}
                <button className="article-card__cta" onClick={handleClick} type="button">
                    <span>קרא עוד</span>
                    <FiArrowLeft size={15} />
                </button>
            </div>
        </article>
    );
};

export default ArticleCard;