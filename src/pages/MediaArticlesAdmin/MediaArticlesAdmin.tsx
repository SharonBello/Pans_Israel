// ==========================================================================
// MediaArticlesAdmin.tsx — Admin panel for פורסם בתקשורת
// Route: /admin/media-articles  (protect with your existing ProtectedRoute)
// ==========================================================================
import React, { useEffect, useState } from 'react';
import {
    FiPlus, FiEdit2, FiTrash2, FiEye, FiEyeOff,
    FiStar, FiX, FiSave, FiExternalLink, FiChevronDown,
    FiLink,
} from 'react-icons/fi';
import { MdNewspaper } from 'react-icons/md';
import {
    getAllArticles,
    createMediaArticle,
    updateMediaArticle,
    deleteMediaArticle,
    togglePublished,
    toggleFeatured,
} from '../../services/mediaArticleService';
import type { MediaArticle, MediaArticleFormData } from '../../types/mediaArticle';
import { CATEGORY_LABELS } from '../../types/mediaArticle';
import './MediaArticlesAdmin.scss';
import FormModal from './FormModal';

// ── Empty form state ──────────────────────────────────────────────────────────
const EMPTY_FORM: MediaArticleFormData = {
    mediaType: 'article',
    title: '',
    url: '',
    thumbnailUrl: '',
    publication: '',
    publicationLogoUrl: '',
    datePublished: new Date().toISOString().split('T')[0],
    summary: '',
    category: 'awareness',
    featured: false,
    published: false,
};

// ── Admin Table Row ───────────────────────────────────────────────────────────
interface RowProps {
    article: MediaArticle;
    onEdit: (a: MediaArticle) => void;
    onDelete: (id: string) => void;
    onTogglePublished: (id: string, current: boolean) => void;
    onToggleFeatured: (id: string, current: boolean) => void;
}

const AdminRow: React.FC<RowProps> = ({ article, onEdit, onDelete, onTogglePublished, onToggleFeatured }) => {
    const formatDate = (iso: string) =>
        new Date(iso).toLocaleDateString('he-IL', { year: 'numeric', month: 'short', day: 'numeric' });

    return (
        <tr className={`mca-table__row ${!article.published ? 'mca-table__row--draft' : ''}`}>
            <td className="mca-table__cell mca-table__cell--title">
                <div className="mca-table__title-wrap">
                    <span className="mca-table__title">{article.title}</span>
                    <span className="mca-table__pub">{article.publication}</span>
                </div>
            </td>
            <td className="mca-table__cell">{formatDate(article.datePublished)}</td>
            <td className="mca-table__cell">
                <span className="mca-table__category">{CATEGORY_LABELS[article.category]}</span>
            </td>
            <td className="mca-table__cell mca-table__cell--actions">
                {/* Published toggle */}
                <button
                    className={`mca-icon-btn ${article.published ? 'mca-icon-btn--active' : ''}`}
                    title={article.published ? 'הסתר' : 'פרסם'}
                    onClick={() => onTogglePublished(article.id, article.published)}
                >
                    {article.published ? <FiEye /> : <FiEyeOff />}
                </button>

                {/* Featured toggle */}
                <button
                    className={`mca-icon-btn ${article.featured ? 'mca-icon-btn--star' : ''}`}
                    title={article.featured ? 'הסר מעמוד הבית' : 'הצג בעמוד הבית'}
                    onClick={() => onToggleFeatured(article.id, article.featured)}
                >
                    <FiStar />
                </button>

                {/* Open link */}
                <a
                    className="mca-icon-btn"
                    href={article.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    title="פתח כתבה"
                >
                    <FiExternalLink />
                </a>

                {/* Edit */}
                <button className="mca-icon-btn" title="ערוך" onClick={() => onEdit(article)}>
                    <FiEdit2 />
                </button>

                {/* Delete */}
                <button
                    className="mca-icon-btn mca-icon-btn--danger"
                    title="מחק"
                    onClick={() => onDelete(article.id)}
                >
                    <FiTrash2 />
                </button>
            </td>
        </tr>
    );
};

// ── Main Admin Page ───────────────────────────────────────────────────────────
const MediaArticlesAdmin: React.FC = () => {
    const [articles, setArticles] = useState<MediaArticle[]>([]);
    const [loading, setLoading] = useState(true);
    const [modalOpen, setModalOpen] = useState(false);
    const [editTarget, setEditTarget] = useState<MediaArticle | null>(null);
    const [saving, setSaving] = useState(false);
    const [toast, setToast] = useState<{ msg: string; type: 'success' | 'error' } | null>(null);

    const showToast = (msg: string, type: 'success' | 'error' = 'success') => {
        setToast({ msg, type });
        setTimeout(() => setToast(null), 3500);
    };

    const load = async () => {
        setLoading(true);
        try {
            const data = await getAllArticles();
            setArticles(data);
        } catch {
            showToast('שגיאה בטעינת נתונים', 'error');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => { load(); }, []);

    const openCreate = () => { setEditTarget(null); setModalOpen(true); };
    const openEdit = (a: MediaArticle) => { setEditTarget(a); setModalOpen(true); };
    const closeModal = () => { setModalOpen(false); setEditTarget(null); };

    const handleSave = async (data: MediaArticleFormData) => {
        setSaving(true);
        try {
            if (editTarget) {
                await updateMediaArticle(editTarget.id, data);
                showToast('הכתבה עודכנה בהצלחה');
            } else {
                await createMediaArticle(data);
                showToast('הכתבה נוספה בהצלחה');
            }
            closeModal();
            await load();
        } catch {
            showToast('שגיאה בשמירה', 'error');
        } finally {
            setSaving(false);
        }
    };

    const handleDelete = async (id: string) => {
        if (!window.confirm('האם למחוק את הכתבה? פעולה זו אינה הפיכה.')) return;
        try {
            await deleteMediaArticle(id);
            showToast('הכתבה נמחקה');
            setArticles(prev => prev.filter(a => a.id !== id));
        } catch {
            showToast('שגיאה במחיקה', 'error');
        }
    };

    const handleTogglePublished = async (id: string, current: boolean) => {
        try {
            await togglePublished(id, current);
            setArticles(prev => prev.map(a => a.id === id ? { ...a, published: !current } : a));
        } catch {
            showToast('שגיאה בעדכון', 'error');
        }
    };

    const handleToggleFeatured = async (id: string, current: boolean) => {
        try {
            await toggleFeatured(id, current);
            setArticles(prev => prev.map(a => a.id === id ? { ...a, featured: !current } : a));
        } catch {
            showToast('שגיאה בעדכון', 'error');
        }
    };

    const formInitial: MediaArticleFormData = editTarget
        ? {
            mediaType: editTarget.mediaType || 'article',
            title: editTarget.title,
            url: editTarget.url,
            thumbnailUrl: editTarget.thumbnailUrl || '',
            publication: editTarget.publication,
            publicationLogoUrl: editTarget.publicationLogoUrl || '',
            datePublished: editTarget.datePublished,
            summary: editTarget.summary,
            category: editTarget.category,
            featured: editTarget.featured,
            published: editTarget.published,
        }
        : EMPTY_FORM;

    const published = articles.filter(a => a.published).length;
    const featured = articles.filter(a => a.featured).length;

    return (
        <div className="mca" dir="rtl">
            {/* Toast */}
            {toast && (
                <div className={`mca-toast mca-toast--${toast.type}`}>{toast.msg}</div>
            )}

            {/* Header */}
            <div className="mca__header">
                <div className="mca__header-left">
                    <div className="mca__header-icon"><MdNewspaper /></div>
                    <div>
                        <h1 className="mca__header-title">ניהול פורסם בתקשורת</h1>
                        <p className="mca__header-sub">ניהול פורסם מיוחדות לעמוד התקשורת</p>
                    </div>
                </div>
                <button className="mca-btn mca-btn--primary" onClick={openCreate}>
                    <FiPlus /> הוסף כתבה חדשה
                </button>
            </div>

            {/* Stats */}
            <div className="mca__stats">
                <div className="mca__stat">
                    <span className="mca__stat-num">{articles.length}</span>
                    <span className="mca__stat-label">סה"כ פרסומים</span>
                </div>
                <div className="mca__stat">
                    <span className="mca__stat-num mca__stat-num--green">{published}</span>
                    <span className="mca__stat-label">פורסמו</span>
                </div>
                <div className="mca__stat">
                    <span className="mca__stat-num mca__stat-num--gold">{featured}</span>
                    <span className="mca__stat-label">בעמוד הבית</span>
                </div>
                <div className="mca__stat">
                    <span className="mca__stat-num mca__stat-num--gray">{articles.length - published}</span>
                    <span className="mca__stat-label">טיוטות</span>
                </div>
            </div>

            {/* Table */}
            <div className="mca__table-wrap">
                {loading ? (
                    <div className="mca__loading">
                        <div className="mca__spinner" /> טוען...
                    </div>
                ) : articles.length === 0 ? (
                    <div className="mca__empty">
                        <MdNewspaper className="mca__empty-icon" />
                        <p>אין כתבות עדיין. לחץ "הוסף כתבה חדשה" כדי להתחיל.</p>
                    </div>
                ) : (
                    <table className="mca-table">
                        <thead>
                            <tr>
                                <th className="mca-table__th">כותרת / מקור</th>
                                <th className="mca-table__th">תאריך</th>
                                <th className="mca-table__th">קטגוריה</th>
                                <th className="mca-table__th">פעולות</th>
                            </tr>
                        </thead>
                        <tbody>
                            {articles.map(a => (
                                <AdminRow
                                    key={a.id}
                                    article={a}
                                    onEdit={openEdit}
                                    onDelete={handleDelete}
                                    onTogglePublished={handleTogglePublished}
                                    onToggleFeatured={handleToggleFeatured}
                                />
                            ))}
                        </tbody>
                    </table>
                )}
            </div>

            {/* Modal */}
            {modalOpen && (
                <FormModal
                    initial={formInitial}
                    onSave={handleSave}
                    onClose={closeModal}
                    saving={saving}
                />
            )}
        </div>
    );
};

export default MediaArticlesAdmin;