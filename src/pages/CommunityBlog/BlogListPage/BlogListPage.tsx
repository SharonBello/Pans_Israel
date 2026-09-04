import React, { useEffect, useState } from 'react';
import { FiSearch, FiEdit } from 'react-icons/fi';
import { Article as ArticleIcon } from '@mui/icons-material';
import { getPublishedArticles } from '../../../services/blogService';
import type { Article, ArticleCategory } from '../../../types/blog';
import ArticleCard from '../../../components/blog/ArticleCard/ArticleCard';
import SubmitArticleModal from '../../../components/blog/SubmitArticleModal/SubmitArticleModal';
import SupportTabs from '@/components/Support/SupportTabs/SupportTabs';
import SupportPageHero from '@/components/Support/SupportPageHero/SupportPageHero';
import './BlogListPage.scss';

const CATEGORIES: Array<ArticleCategory | 'הכל'> = [
    'הכל', 'חוויות הורים', 'מידע רפואי', 'תמיכה רגשית', 'זכויות וסיוע', 'חדשות וחקר', 'כללי',
];

const BlogListPage: React.FC = () => {
    const [articles, setArticles] = useState<Article[]>([]);
    const [filtered, setFiltered] = useState<Article[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [activeCategory, setCategory] = useState<ArticleCategory | 'הכל'>('הכל');
    const [search, setSearch] = useState('');
    const [submitOpen, setSubmitOpen] = useState(false);

    useEffect(() => {
        setLoading(true);
        getPublishedArticles()
            .then(data => { setArticles(data); setFiltered(data); })
            .catch(() => setError('שגיאה בטעינת המאמרים. נסה שוב.'))
            .finally(() => setLoading(false));
    }, []);

    useEffect(() => {
        let result = articles;
        if (activeCategory !== 'הכל') result = result.filter(a => a.category === activeCategory);
        if (search.trim()) {
            const q = search.toLowerCase();
            result = result.filter(a =>
                a.title.toLowerCase().includes(q) || a.summary.toLowerCase().includes(q) ||
                a.author.toLowerCase().includes(q) || a.tags?.some(t => t.toLowerCase().includes(q))
            );
        }
        setFiltered(result);
    }, [articles, activeCategory, search]);

    const featured = articles.find(a => a.featured);
    const rest = filtered.filter(a => a.id !== featured?.id);

    return (
        <div className="blog-list-page" dir="rtl">
            <SupportPageHero
                icon={<ArticleIcon />}
                title="מאמרים ממשפחות הקהילה"
                subtitle="מאמרים, חוויות ועצות מהורים שחיים את המסע — עבור הורים שמתחילים אותו."
                action={
                    <button
                        type="button"
                        className="support-hero__action"
                        onClick={() => setSubmitOpen(true)}
                    >
                        <FiEdit size={16} />
                        <span>שלח/י מאמר לקהילה</span>
                    </button>
                }
            />

            <SupportTabs />

            <div className="blog-list-page__container">
                <div className="blog-list-page__search-wrap">
                    <FiSearch className="blog-list-page__search-icon" />
                    <input type="search" value={search} onChange={e => setSearch(e.target.value)}
                        placeholder="חיפוש לפי כותרת, מחבר, תגית..." className="blog-list-page__search" dir="rtl" />
                </div>

                <div className="blog-list-page__filters">
                    {CATEGORIES.map(cat => (
                        <button key={cat} type="button"
                            className={`blog-list-page__filter-btn${activeCategory === cat ? ' blog-list-page__filter-btn--active' : ''}`}
                            onClick={() => setCategory(cat)}>{cat}</button>
                    ))}
                </div>

                {loading && <div className="blog-list-page__loading"><div className="blog-list-page__spinner" /><span>טוען מאמרים...</span></div>}
                {error && !loading && <p className="blog-list-page__error">{error}</p>}

                {!loading && !error && (
                    <>
                        {featured && activeCategory === 'הכל' && !search && (
                            <section className="blog-list-page__featured">
                                <h2 className="blog-list-page__section-title">מאמר מומלץ</h2>
                                <ArticleCard article={featured} featured />
                            </section>
                        )}
                        {filtered.length === 0 ? (
                            <p className="blog-list-page__empty">לא נמצאו מאמרים התואמים את החיפוש.</p>
                        ) : (
                            <section className="blog-list-page__grid-wrap">
                                {activeCategory === 'הכל' && !search && <h2 className="blog-list-page__section-title">כל המאמרים</h2>}
                                <div className="blog-list-page__grid">
                                    {(activeCategory !== 'הכל' || search ? filtered : rest).map(article => (
                                        <ArticleCard key={article.id} article={article} />
                                    ))}
                                </div>
                            </section>
                        )}
                    </>
                )}
            </div>

            <SubmitArticleModal open={submitOpen} onClose={() => setSubmitOpen(false)} />
        </div>
    );
};

export default BlogListPage;