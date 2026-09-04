import React, { useEffect, useMemo, useState } from 'react';
import { FiEye, FiEyeOff, FiStar, FiTrash2, FiExternalLink, FiBookOpen, FiFileText } from 'react-icons/fi';
import { Dialog, DialogTitle, DialogContent, DialogActions, Button, IconButton, Chip, Box } from '@mui/material';
import { Close as CloseIcon } from '@mui/icons-material';
import { getAllArticlesAdmin, setArticleFlags, deleteArticle } from '@/services/blogService';
import type { Article } from '@/types/blog';
import '../admin-shared.scss';

type Filter = 'pending' | 'published' | 'featured' | 'all';

const FILTERS: { id: Filter; label: string }[] = [
    { id: 'pending', label: 'ממתינים לפרסום' },
    { id: 'published', label: 'מפורסמים' },
    { id: 'featured', label: 'בעמוד הבית' },
    { id: 'all', label: 'הכל' },
];

const formatDate = (ts: unknown): string => {
    const d = (ts as { toDate?: () => Date })?.toDate?.();
    return d ? d.toLocaleDateString('he-IL', { day: 'numeric', month: 'short', year: 'numeric' }) : '';
};

const BlogAdmin: React.FC = () => {
    const [items, setItems] = useState<Article[]>([]);
    const [loading, setLoading] = useState(true);
    const [filter, setFilter] = useState<Filter>('pending');
    const [active, setActive] = useState<Article | null>(null);
    const [toast, setToast] = useState<{ msg: string; type: 'success' | 'error' } | null>(null);

    const showToast = (msg: string, type: 'success' | 'error' = 'success') => {
        setToast({ msg, type });
        setTimeout(() => setToast(null), 3500);
    };

    const load = async () => {
        setLoading(true);
        try {
            setItems(await getAllArticlesAdmin());
        } catch (err) {
            console.error('getAllArticlesAdmin failed:', err);
            showToast('שגיאה בטעינת מאמרים', 'error');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => { load(); }, []);

    const counts = useMemo(() => ({
        all: items.length,
        pending: items.filter((a) => !a.published).length,
        published: items.filter((a) => a.published).length,
        featured: items.filter((a) => a.published && a.featured).length,
    }), [items]);

    const visible = items.filter((a) => {
        if (filter === 'pending') return !a.published;
        if (filter === 'published') return a.published;
        if (filter === 'featured') return a.published && a.featured;
        return true;
    });

    const patch = (id: string, flags: Partial<Pick<Article, 'published' | 'featured'>>) => {
        setItems((prev) => prev.map((x) => (x.id === id ? { ...x, ...flags } : x)));
        if (active?.id === id) setActive((a) => (a ? { ...a, ...flags } : a));
    };

    const togglePublished = async (a: Article) => {
        const flags = a.published ? { published: false, featured: false } : { published: true };
        try {
            await setArticleFlags(a.id, flags);
            patch(a.id, flags);
            showToast(a.published ? 'המאמר הוסר מהאתר' : 'המאמר פורסם');
        } catch (err) {
            console.error(err);
            showToast('שגיאה בעדכון', 'error');
        }
    };

    const toggleFeatured = async (a: Article) => {
        if (!a.published) { showToast('יש לפרסם את המאמר לפני הצגתו בעמוד הבית', 'error'); return; }
        try {
            await setArticleFlags(a.id, { featured: !a.featured });
            patch(a.id, { featured: !a.featured });
            showToast(a.featured ? 'הוסר מעמוד הבית' : 'מוצג בעמוד הבית');
        } catch (err) {
            console.error(err);
            showToast('שגיאה בעדכון', 'error');
        }
    };

    const remove = async (a: Article) => {
        if (!window.confirm(`למחוק את "${a.title}"? פעולה זו אינה הפיכה.`)) return;
        try {
            await deleteArticle(a.id);
            setItems((prev) => prev.filter((x) => x.id !== a.id));
            if (active?.id === a.id) setActive(null);
            showToast('המאמר נמחק');
        } catch (err) {
            console.error(err);
            showToast('שגיאה במחיקה', 'error');
        }
    };

    return (
        <div className="adm" dir="rtl">
            {toast && <div className={`adm-toast adm-toast--${toast.type}`}>{toast.msg}</div>}

            <div className="adm__header">
                <div className="adm__header-left">
                    <div className="adm__header-icon"><FiBookOpen /></div>
                    <div>
                        <h1 className="adm__header-title">מאמרי קהילה</h1>
                        <p className="adm__header-sub">מאמרים שנשלחו מהאתר — פרסום, הצגה בעמוד הבית ומחיקה</p>
                    </div>
                </div>
            </div>

            <div className="adm__tabs" role="tablist">
                {FILTERS.map((f) => (
                    <button key={f.id} type="button" role="tab" aria-selected={filter === f.id}
                        className={`adm__tab${filter === f.id ? ' adm__tab--active' : ''}`} onClick={() => setFilter(f.id)}>
                        {f.label} <span className="adm__tab-count">({counts[f.id]})</span>
                    </button>
                ))}
            </div>

            <div className="adm__table-wrap">
                {loading ? (
                    <div className="adm__loading"><div className="adm__spinner" /> טוען…</div>
                ) : visible.length === 0 ? (
                    <div className="adm__empty"><FiFileText className="adm__empty-icon" /><p>אין מאמרים בקטגוריה זו.</p></div>
                ) : (
                    <table className="adm-table">
                        <thead>
                            <tr>
                                <th>מאמר</th>
                                <th>מאת</th>
                                <th>קטגוריה</th>
                                <th>תאריך</th>
                                <th>סטטוס</th>
                                <th>פעולות</th>
                            </tr>
                        </thead>
                        <tbody>
                            {visible.map((a) => (
                                <tr key={a.id}>
                                    <td>
                                        <span className="adm-table__title">{a.title}</span>
                                        <span className="adm-table__muted">{a.summary}</span>
                                    </td>
                                    <td>
                                        {a.author}
                                        {a.authorRole && <span className="adm-table__muted">{a.authorRole}</span>}
                                    </td>
                                    <td>{a.category}</td>
                                    <td>{formatDate(a.createdAt)}</td>
                                    <td>
                                        <span className={`adm-badge adm-badge--${a.published ? 'approved' : 'pending'}`}>
                                            {a.published ? 'מפורסם' : 'ממתין'}
                                        </span>
                                        {a.featured && a.published && <span className="adm-table__muted">★ בעמוד הבית</span>}
                                    </td>
                                    <td className="adm-table__actions">
                                        <button className="adm-icon-btn" title="קריאה" onClick={() => setActive(a)}><FiFileText /></button>
                                        <button className={`adm-icon-btn${a.published ? ' adm-icon-btn--approve' : ''}`}
                                            title={a.published ? 'הסר מהאתר' : 'פרסם'} onClick={() => togglePublished(a)}>
                                            {a.published ? <FiEye /> : <FiEyeOff />}
                                        </button>
                                        <button className="adm-icon-btn" title={a.featured ? 'הסר מעמוד הבית' : 'הצג בעמוד הבית'}
                                            onClick={() => toggleFeatured(a)} style={a.featured ? { color: '#d69e2e', borderColor: '#d69e2e' } : undefined}>
                                            <FiStar />
                                        </button>
                                        {a.published && (
                                            <a className="adm-icon-btn" href={`/community/articles/${a.id}`} target="_blank" rel="noopener noreferrer" title="פתח באתר">
                                                <FiExternalLink />
                                            </a>
                                        )}
                                        <button className="adm-icon-btn adm-icon-btn--danger" title="מחיקה" onClick={() => remove(a)}><FiTrash2 /></button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                )}
            </div>

            {/* Read modal */}
            <Dialog open={Boolean(active)} onClose={() => setActive(null)} maxWidth="md" fullWidth dir="rtl">
                {active && (
                    <>
                        <DialogTitle sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 2 }}>
                            <span>{active.title}</span>
                            <IconButton onClick={() => setActive(null)} aria-label="סגירה"><CloseIcon /></IconButton>
                        </DialogTitle>
                        <DialogContent dividers>
                            <Box sx={{ mb: 1.5, color: '#6b7a89', fontSize: '0.85rem' }}>
                                {active.author}{active.authorRole ? ` · ${active.authorRole}` : ''} · {active.category} · {formatDate(active.createdAt)}
                            </Box>
                            {active.coverImage && (
                                <Box component="img" src={active.coverImage} alt="" sx={{ width: '100%', maxHeight: 280, objectFit: 'cover', borderRadius: 2, mb: 2 }} />
                            )}
                            <Box sx={{ fontWeight: 600, mb: 2 }}>{active.summary}</Box>
                            <Box sx={{ whiteSpace: 'pre-wrap', lineHeight: 1.8 }}>{active.content}</Box>
                            {active.tags && active.tags.length > 0 && (
                                <Box sx={{ display: 'flex', gap: 0.75, flexWrap: 'wrap', mt: 2 }}>
                                    {active.tags.map((t) => <Chip key={t} label={t} size="small" />)}
                                </Box>
                            )}
                        </DialogContent>
                        <DialogActions sx={{ gap: 1 }}>
                            <Button color="error" onClick={() => remove(active)} startIcon={<FiTrash2 />}>מחיקה</Button>
                            <Box sx={{ flex: 1 }} />
                            <Button variant="outlined" onClick={() => toggleFeatured(active)} startIcon={<FiStar />} disabled={!active.published}>
                                {active.featured ? 'הסר מעמוד הבית' : 'הצג בעמוד הבית'}
                            </Button>
                            <Button variant="contained" color={active.published ? 'inherit' : 'success'} onClick={() => togglePublished(active)}
                                startIcon={active.published ? <FiEyeOff /> : <FiEye />}>
                                {active.published ? 'הסר מהאתר' : 'פרסום'}
                            </Button>
                        </DialogActions>
                    </>
                )}
            </Dialog>
        </div>
    );
};

export default BlogAdmin;